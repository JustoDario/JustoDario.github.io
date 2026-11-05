#!/usr/bin/env node
// Validates the portfolio content against a fixed manifest.
// Fails on missing files, wrong order, altered URLs, missing translations or
// location metadata. `--inject-broken` corrupts one path to prove it can fail.
import { createHash } from 'node:crypto'
import { existsSync, readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { carouselSections, publications } from '../src/data/entries.js'
import { MODELS } from '../src/data/models.js'
import { profile, skills } from '../src/data/profile.js'
import { en } from '../src/i18n/en.js'
import { es } from '../src/i18n/es.js'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const pub = (path) => join(ROOT, 'public', path)
const VID = (slug) => `video:${slug}`

// id, model, media in the exact order on the site.
const MANIFEST = {
  research: [
    ['thesis', 'g1', []],
    ['quadruped', 'coco1', [
      VID('coco-icra'), VID('coco-control'), VID('coco-redesign'),
      'cocov2_photo1.jpg', 'cocov2_summit1.jpg', 'cocov2_photo2.jpg', 'coco_summit.jpg', 'cocov1.jpg',
      VID('coco-ik'), VID('coco-trot'), 'rpycoco.png',
    ]],
  ],
  responsibility: [
    ['scara', 'scara', [VID('scara-demo'), 'scarav1-2.jpg']],
    ['tsb', 'sp01', [VID('tsb-mapping'), 'sp01.jpg', 'sp012.jpg', 'inflationlayeradded.png', 'tsbsimulation.png']],
    ['treasurer', null, []],
  ],
  projects: [
    ['so101-tidy', 'so101', [
      'best_moments_grid.gif', VID('erh-demo'), 'erharch.png', VID('erh-cup'), VID('erh-snickers'), 'erhsimvideo2.gif', 'erhsimvsreal.png',
    ]],
    ['go2-inspection', 'go2', ['eeq1.jpg', VID('go2-test1'), VID('go2-test2'), 'eehackarch.png', VID('go2-test3')]],
    ['biped', 'stairclimber', ['biped1.jpg']],
    ['ur5', 'ur5', [VID('ur5-moving'), 'ur5-program.jpg']],
    ['delivery', 'kobuki', [VID('delivery-test')]],
    ['car', 'humblebeev2', ['rcv1.jpg', 'rcv2.jpg', 'rc3.jpg', VID('car-esp32'), VID('car-test')]],
    ['line-follower', 'linefollower', [VID('linefollower-test')]],
    ['rover', 'turtlerover', []],
    ['rescue', 'drone', [VID('rescue-sim')]],
    ['cleaning', 'roomba', [VID('cleaning-sim')]],
    ['parking', 'robotaxi', [VID('parking-sim')]],
    ['f1', 'f1car', []],
    ['undocumented', null, [
      'prototype1.jpg', 'prototype2.jpg', 'prototype3.jpg', 'undocumented1.jpg', 'undocumented2.jpg',
      VID('proto-plot'), VID('proto-sensor'),
    ]],
  ],
  hackathons: [
    ['erh', null, ['erh_hack_podium.jpg', 'erh_house.jpg', 'erh_hack_team.jpg', VID('erh-timelapse')]],
    ['embodied', null, ['ee1.jpg', 'ee2.jpg', 'ee3.jpg', 'eehack.jpg', 'eesummit.jpg']],
    ['ai', null, ['hackatonaiayo.jpg', 'atari_aia.jpg', 'aia_conf.png']],
    ['mapfre', null, ['urjchackaton1.jpg', 'urjchackaton2.jpg', 'mapfreapp1.png']],
    ['qubic', null, ['qubichackaton.jpg', 'demoqubic1.jpg', 'demoqubic2.jpg']],
    ['openred', null, ['radiacodehackaton.jpg', 'radiacodeapp1.png']],
  ],
  education: [
    ['urjc', null, ['urjc-logo.png', 'urjc-campus.jpg']],
    ['ist', null, ['ist-logo.png', 'ist-campus.jpg']],
    ['uestc', null, ['uestc-logo.jpg', 'uestc-campus.jpg', 'uestc2.jpg', 'uestc1.jpg', 'uestc3.jpg']],
  ],
}

const REQUIRED_LINKS = {
  scara: 'https://robotech-urjc.github.io/mainweb/',
  tsb: 'https://tecnicosolarboat.com/',
}

// Never to be presented as physical robots.
const SIMULATED = ['rover', 'rescue', 'cleaning', 'parking', 'f1']

const errors = []
const fail = (message) => errors.push(message)
const inject = process.argv.includes('--inject-broken')

const localised = (field, where) => {
  for (const lang of ['en', 'es']) {
    if (typeof field?.[lang] !== 'string' || !field[lang].trim()) fail(`${where}: missing "${lang}" text`)
  }
}

// Checks that the file exists, that its real format matches its extension, and
// that it carries no EXIF block, which is where GPS coordinates live.
function checkImage(file, where) {
  const path = pub(`media/${file}`)
  if (!existsSync(path)) return fail(`${where}: file not found: public/media/${file}`)
  const data = readFileSync(path)
  const ext = file.split('.').pop()
  const isJpeg = data[0] === 0xff && data[1] === 0xd8
  const isPng = data.subarray(1, 4).toString() === 'PNG'
  const isGif = data.subarray(0, 3).toString() === 'GIF'
  if ({ jpg: !isJpeg, png: !isPng, gif: !isGif }[ext] ?? true) fail(`${where}: ${file} content does not match its extension`)
  if (isJpeg) {
    for (let i = 2; i < data.length - 4 && data[i] === 0xff && data[i + 1] !== 0xda; ) {
      const size = data.readUInt16BE(i + 2)
      if (data[i + 1] === 0xe1 && data.subarray(i + 4, i + 8).toString() === 'Exif') fail(`${where}: ${file} still has EXIF metadata`)
      i += size + 2
    }
  }
  if (isPng && data.includes('eXIf')) fail(`${where}: ${file} still has EXIF metadata`)
}

// Sections and entries against the manifest.
const seen = new Set()
if (inject) carouselSections.flatMap((s) => s.entries).flatMap((e) => e.media).find((m) => m.file).file = 'does-not-exist.jpg'

for (const [sectionId, expected] of Object.entries(MANIFEST)) {
  const section = carouselSections.find((s) => s.id === sectionId)
  if (!section) {
    fail(`missing section: ${sectionId}`)
    continue
  }
  const ids = section.entries.map((e) => e.id).join(',')
  if (ids !== expected.map(([id]) => id).join(',')) fail(`${sectionId}: entries or order differ: ${ids}`)

  for (const [id, model, media] of expected) {
    const entry = section.entries.find((e) => e.id === id)
    if (!entry) continue
    const where = `${sectionId}/${id}`
    if (seen.has(id)) fail(`${where}: duplicated id`)
    seen.add(id)

    localised(entry.title, `${where} title`)
    localised(entry.description, `${where} description`)
    for (const key of ['role', 'dates', 'subtitle', 'note']) {
      if (entry[key]) localised(entry[key], `${where} ${key}`)
    }
    entry.highlights?.forEach((h, i) => localised(h, `${where} highlight ${i}`))

    if (Boolean(entry.simulated) !== SIMULATED.includes(id)) fail(`${where}: simulated label is wrong`)
    if ((entry.model ?? null) !== model) fail(`${where}: model is ${entry.model}, expected ${model}`)
    if (model && !existsSync(pub(`3d/${MODELS[model]?.file}`))) fail(`${where}: no file for model ${model}`)

    if (REQUIRED_LINKS[id] && entry.link?.url !== REQUIRED_LINKS[id]) fail(`${where}: link differs from the original`)
    if (entry.link) localised(entry.link.label, `${where} link label`)

    const actual = entry.media.map((m) => (m.slug ? VID(m.slug) : m.file))
    if (actual.join('|') !== media.join('|')) fail(`${where}: media or order differ from the manifest:\n    ${actual.join('\n    ')}`)

    entry.media.forEach((m, i) => {
      if (m.still) checkImage(m.still, `${where} media ${i} still`)
      if (m.type === 'video') localised(m.title, `${where} video ${i} title`)
      if (m.type === 'video') {
        checkImage(m.poster, `${where} video ${i} poster`)
        if (m.youtube !== null && !/^[\w-]{11}$/.test(m.youtube ?? '')) fail(`${where} video ${i}: bad YouTube id`)
        for (const codec of ['av1', 'h264']) {
          const path = pub(`video/${m.slug}.${codec}.mp4`)
          if (!existsSync(path)) fail(`${where}: video file not found: ${m.slug}.${codec}.mp4`)
          else if (readFileSync(path).subarray(4, 8).toString() !== 'ftyp') fail(`${where}: ${m.slug}.${codec}.mp4 is not an MP4`)
        }
      }
      else {
        localised(m.alt, `${where} image ${i} alt`)
        checkImage(m.file, where)
      }
    })
  }
}

for (const item of publications) {
  for (const key of ['status', 'role', 'venue', 'collaboration']) localised(item[key], `publication ${item.id} ${key}`)
  if (item.media.map((m) => m.slug).join() !== 'coco-icra') fail(`publication ${item.id}: must play the supplementary video`)
  if (item.status.en !== 'Manuscript submitted') fail(`publication ${item.id}: status must stay "Manuscript submitted" until that changes`)
}

for (const [id, model] of Object.entries(MODELS)) {
  if (!existsSync(pub(`3d/${model.file}`))) fail(`model ${id}: file not found: public/3d/${model.file}`)
}

// Profile, skills and interface strings.
checkImage(profile.photo.file, 'profile photo')
localised(profile.photo.alt, 'profile photo alt')
localised(profile.subtitle, 'profile subtitle')
localised(profile.tagline, 'profile tagline')
profile.about.forEach((p, i) => localised(p, `about paragraph ${i}`))
if (skills.map((s) => s.name).join() !== 'ROS 2,C++,Foxglove,Python,ROS 2 Control,Gazebo') fail('skills differ from the original')
skills.forEach((s) => checkImage(s.logo, `skill ${s.name}`))

const enKeys = Object.keys(en).sort().join()
if (enKeys !== Object.keys(es).sort().join()) fail('en.js and es.js do not have the same keys')
for (const [lang, dict] of Object.entries({ en, es })) {
  for (const [key, value] of Object.entries(dict)) if (!value.trim()) fail(`${lang}.js: empty value for ${key}`)
}

// The published CV must stay identical to the one in assets/.
const sha = (path) => createHash('sha256').update(readFileSync(path)).digest('hex')
if (!existsSync(pub(profile.cv))) fail(`CV not found: public/${profile.cv}`)
else if (sha(pub(profile.cv)) !== sha(join(ROOT, 'assets/CVJustoDario.pdf'))) fail('public CV differs from assets/CVJustoDario.pdf')

if (errors.length) {
  console.error(`check-content: ${errors.length} problem(s)\n`)
  errors.forEach((e) => console.error(`  - ${e}`))
  process.exit(1)
}
console.log(`check-content: OK (${seen.size} entries, ${Object.keys(en).length} interface strings per language)`)
