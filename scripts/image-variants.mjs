#!/usr/bin/env node
// Lighter copies of the carousel images, with the original as the fallback, so nothing
// changes on screen:
// - photos: smaller JPEGs, and the browser picks the smallest one still as sharp as the
//   frame needs. A phone no longer gets 1920 px for a frame 316 px wide.
// - screenshots (PNG): lossless WebP at the same widths, the very same pixels.
// - animated GIFs: animated AVIF, same frames and timing at a fraction of the weight.
// Writes public/media/v/ and src/data/imageVariants.json, with paths relative to media/. An image missing from the JSON,
// a new one for instance, is simply served as before. Needs ImageMagick 6 and ffmpeg with
// libaom. Run from the repository root after adding or changing images.
import { execFileSync } from 'node:child_process'
import { existsSync, mkdirSync, rmSync, statSync, writeFileSync } from 'node:fs'
import { carouselSections } from '../src/data/entries.js'

const MEDIA = 'public/media'
const OUT = `${MEDIA}/v`
const WIDTHS = [640, 960, 1280, 1920]

const run = (command, args) => execFileSync(command, args, { stdio: ['ignore', 'pipe', 'inherit'] }).toString()
const base = (file) => file.replace(/\.\w+$/, '')

rmSync(OUT, { recursive: true, force: true })
mkdirSync(OUT, { recursive: true })

const files = new Set()
for (const { entries } of carouselSections) {
  for (const { media } of entries) for (const item of media) if (item.type === 'image') files.add(item.file)
}

const variants = {}
for (const file of [...files].sort()) {
  const source = `${MEDIA}/${file}`
  if (!existsSync(source)) continue // check-content reports it
  if (file.endsWith('.gif')) {
    const target = `${MEDIA}/v/${base(file)}.avif`
    run('ffmpeg', ['-v', 'error', '-y', '-i', source, '-vf', 'format=yuv420p,pad=ceil(iw/2)*2:ceil(ih/2)*2',
      '-c:v', 'libaom-av1', '-crf', '30', '-cpu-used', '4', '-row-mt', '1', '-f', 'avif', target])
    variants[file] = { type: 'image/avif', files: [[`v/${base(file)}.avif`, 0]] }
  } else {
    const width = Number(run('identify', ['-format', '%w', `${source}[0]`]))
    const smaller = WIDTHS.filter((w) => w < width)
    if (file.endsWith('.png')) {
      variants[file] = { type: 'image/webp', files: [] }
      for (const w of [...smaller, width]) {
        const name = `v/${base(file)}-${w}.webp`
        run('convert', [`${source}[0]`, '-resize', `${w}x`, '-strip', '-define', 'webp:lossless=true', '-define', 'webp:method=6', `${MEDIA}/${name}`])
        variants[file].files.push([name, w])
      }
    } else {
      if (smaller.length === 0) continue
      // Same settings as optimize-media.sh. ImageMagick ignores -quality for WebP, which is
      // why photos stay in JPEG: at the same quality WebP saved next to nothing here.
      variants[file] = { type: null, files: [] }
      for (const w of smaller) {
        const name = `v/${base(file)}-${w}.jpg`
        run('convert', [`${source}[0]`, '-resize', `${w}x`, '-strip', '-sampling-factor', '4:2:0', '-interlace', 'Plane', '-quality', '86', `${MEDIA}/${name}`])
        variants[file].files.push([name, w])
      }
      variants[file].files.push([file, width])
    }
  }
  // A smaller copy that weighs as much as a larger one is no use: keep only real savings.
  if (variants[file]?.files.length > 1) {
    const kept = []
    for (const variant of [...variants[file].files].reverse()) {
      const size = statSync(`${MEDIA}/${variant[0]}`).size
      if (kept.length && size >= kept[0][1]) {
        if (variant[0].startsWith('v/')) rmSync(`${MEDIA}/${variant[0]}`)
        continue
      }
      kept.unshift([variant, size])
    }
    variants[file].files = kept.map(([variant]) => variant)
    if (variants[file].type === null && variants[file].files.length === 1) delete variants[file]
  }
  const kb = (path) => Math.round(statSync(path).size / 1024)
  if (variants[file]) console.log(`${file}: ${variants[file].files.map(([name]) => kb(`${MEDIA}/${name}`)).join(' / ')} kB`)
}

writeFileSync('src/data/imageVariants.json', JSON.stringify(variants, null, 1) + '\n')
console.log(`${Object.keys(variants).length} images`)
