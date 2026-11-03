#!/usr/bin/env node
// Validates the portfolio content against a fixed manifest of the original site.
// Fails on missing files, wrong order, altered URLs, missing translations or
// location metadata. `--inject-broken` corrupts one path to prove it can fail.
import { createHash } from 'node:crypto'
import { existsSync, readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { carouselSections } from '../src/data/entries.js'
import { MODELS } from '../src/data/models.js'
import { profile, skills } from '../src/data/profile.js'
import { en } from '../src/i18n/en.js'
import { es } from '../src/i18n/es.js'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const pub = (path) => join(ROOT, 'public', path)
const VID = (slug) => `video:${slug}`

// id, model, media in the exact order of the original portfolio.
const MANIFEST = {
  experience: [
    ['robotech', 'scara', [VID('scara-demo'), 'scarav1-2.jpg']],
    ['tsb', 'sp01', ['inflationlayeradded.png', 'tsbsimulation.png', VID('tsb-mapping')]],
  ],
  projects: [
    ['quadruped', 'coco1', [
      VID('coco-icra'), VID('coco-control'), VID('coco-redesign'),
      'cocov2_photo1.jpg', 'cocov2_summit1.jpg', 'cocov2_photo2.jpg', 'coco_summit.jpg', 'cocov1.jpg',
      VID('coco-ik'), VID('coco-trot'), 'rpycoco.png',
    ]],
    ['car', 'humblebeev2', ['rcv1.jpg', 'rcv2.jpg', 'rc3.jpg', VID('car-esp32')]],
  ],
  hackathons: [
    ['erh', 'so101', ['erh_hack_podium.jpg', 'best_moments_grid.gif', 'erh_house.jpg', 'erh_hack_team.jpg', VID('erh-demo')]],
    ['embodied', 'go2', ['ee1.jpg', 'eeq1.jpg', 'ee2.jpg']],
    ['ai', null, ['hackatonaiayo.jpg', 'atari_aia.jpg', 'aia_conf.png']],
    ['mapfre', null, ['urjchackaton1.jpg', 'urjchackaton2.jpg', 'mapfreapp1.png']],
    ['openred', null, ['radiacodehackaton.jpg', 'radiacodeapp1.png']],
    ['qubic', null, ['qubichackaton.jpg', 'demoqubic1.jpg', 'demoqubic2.jpg']],
  ],
  education: [
    ['urjc', null, []],
    ['ist', null, []],
    ['uestc', null, []],
  ],
}

const REQUIRED_LINKS = {
  robotech: 'https://robotech-urjc.github.io/mainweb/',
  tsb: 'https://tecnicosolarboat.com/',
}

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
if (inject) carouselSections[0].entries[0].media[1].file = 'does-not-exist.jpg'

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
    for (const key of ['role', 'dates', 'subtitle', 'research']) {
      if (entry[key]) localised(entry[key], `${where} ${key}`)
    }
    entry.highlights?.forEach((h, i) => localised(h, `${where} highlight ${i}`))

    if (entry.model !== model) fail(`${where}: model is ${entry.model}, expected ${model}`)
    if (model && !existsSync(pub(`3d/${MODELS[model]?.file}`))) fail(`${where}: no file for model ${model}`)

    if (REQUIRED_LINKS[id] && entry.link?.url !== REQUIRED_LINKS[id]) fail(`${where}: link differs from the original`)
    if (entry.link) localised(entry.link.label, `${where} link label`)
    if (entry.credit) localised(entry.credit.text, `${where} credit`)

    const actual = entry.media.map((m) => (m.slug ? VID(m.slug) : m.file))
    if (actual.join('|') !== media.join('|')) fail(`${where}: media or order differ from the manifest:\n    ${actual.join('\n    ')}`)

    entry.media.forEach((m, i) => {
      if (m.type === 'video') localised(m.title, `${where} video ${i} title`)
      if (m.type === 'video') {
        checkImage(m.poster, `${where} video ${i} poster`)
        if (!/^[\w-]{11}$/.test(m.youtube ?? '')) fail(`${where} video ${i}: bad YouTube id`)
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

// go2.glb is CC BY 4.0, which requires visible attribution.
const go2 = carouselSections.flatMap((s) => s.entries).find((e) => e.model === 'go2')
if (!go2?.credit?.url) fail('go2 entry is missing its CC BY credit')

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
