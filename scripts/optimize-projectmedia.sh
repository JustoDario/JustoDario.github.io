#!/usr/bin/env bash
# Generates the site's versions of the media added after optimize-media.sh: the originals
# in assets/projectmedia/ (too heavy for the repository, they stay out of it) and some in
# assets/. Output is committed. Run from the root. `./optimize-projectmedia.sh second`
# (or `third`) only does that batch.
# Needs ffmpeg and ImageMagick 6. The HEIC files must be decoded first into $HEIC_JPEGS
# (same names, .jpg), for instance with the npm package heic-convert in a temporary folder.
#
# -map_metadata -1 matters: phone videos carry the GPS position of where they were shot.
set -euo pipefail

SRC=assets/projectmedia
A=assets
MEDIA=public/media
VIDEO=public/video
SRGB=/usr/share/color/icc/colord/sRGB.icc
HEIC_JPEGS=${HEIC_JPEGS:?folder with the decoded HEIC files}

photo() { # source destination [degrees]
  convert "$1[0]" -auto-orient -rotate "${3:-0}" -profile "$SRGB" -resize '1920x1920>' -strip \
    -sampling-factor 4:2:0 -interlace Plane -quality 82 "$MEDIA/$2"
}

# Diagrams and logos: lossless, and IST1 is transparent.
png() { # source destination
  convert "$1[0]" -resize '1920x1920>' -strip "$MEDIA/$2"
}

# Same limits as the videos already on the site: 720p, at most 30 fps (slower sources keep
# theirs), AV1 first, H.264 as fallback.
SCALE="scale='if(gt(iw,ih),min(1280,iw),-2)':'if(gt(iw,ih),-2,min(1280,ih))'"

clip() { # source slug poster-second [audio]
  local audio_av1=(-an) audio_h264=(-an) FIT="$SCALE,format=yuv420p"
  local rate
  rate=$(ffprobe -v error -select_streams v:0 -show_entries stream=avg_frame_rate -of csv=p=0 "$SRC/$1")
  if awk "BEGIN { exit !($rate > 30.5) }"; then FIT="$SCALE,fps=30,format=yuv420p"; fi
  if [ "${4:-}" = audio ]; then
    audio_av1=(-c:a libopus -b:a 80k)
    audio_h264=(-c:a aac -b:a 96k)
  fi
  ffmpeg -v error -y -i "$SRC/$1" -map_metadata -1 -map_chapters -1 -vf "$FIT" \
    -c:v libsvtav1 -preset 6 -crf 38 "${audio_av1[@]}" -movflags +faststart "$VIDEO/$2.av1.mp4"
  ffmpeg -v error -y -i "$SRC/$1" -map_metadata -1 -map_chapters -1 -vf "$FIT" \
    -c:v libx264 -preset slow -crf 27 -profile:v high -level 3.1 "${audio_h264[@]}" -movflags +faststart "$VIDEO/$2.h264.mp4"
  ffmpeg -v error -y -ss "$3" -i "$SRC/$1" -map_metadata -1 -frames:v 1 -vf "$FIT" -q:v 4 "$MEDIA/video-$2.jpg"
  echo "$2 done"
}

first() {
photo "$SRC/industrialrobotprogramming.JPG" ur5-program.jpg
photo "$SRC/uestc1.jpeg"                    uestc1.jpg
photo "$SRC/uestc2.JPG"                     uestc2.jpg
photo "$SRC/uestcr2.jpeg"                   uestc3.jpg
photo "$SRC/prototype2.JPG"                 prototype2.jpg
photo "$HEIC_JPEGS/prototypefirst.jpg"      prototype1.jpg
photo "$HEIC_JPEGS/prototype4.jpg"          prototype3.jpg
photo "$HEIC_JPEGS/undocumented.jpg"        undocumented1.jpg
photo "$HEIC_JPEGS/undocumented1.jpg"       undocumented2.jpg

# Sound only where it is the point: the delivery robot talks to the recipient.
clip EEHackathonvideo1.MOV     go2-test1          2 &
clip EEHackathonvideo2.MOV     go2-test2          1 &
clip UR5moving1.MOV            ur5-moving         2 &
clip kobukideliverpackage.mp4  delivery-test      60 audio &
wait
clip humblebeetest1.MOV        car-test           20 &
clip linefollowertest.MOV      linefollower-test  12 &
clip rescuedron.mp4            rescue-sim         50 &
clip vacuumrobotroomba.mp4     cleaning-sim       45 &
wait
clip autoparking.mp4           parking-sim        40 &
clip undocumented3.MOV         proto-plot         4 &
clip undocumented4.MOV         proto-sensor       25 &
wait
}

second() {
  photo "$HEIC_JPEGS/biped1.jpg"     biped1.jpg       -90  # lying down, as it was shot
  photo "$A/ee3.JPG"                 ee3.jpg
  photo "$A/eehack.JPG"              eehack.jpg
  photo "$A/eesummit.png"            eesummit.jpg     # a JPEG despite its name
  png   "$A/eehackarch.png"          eehackarch.png
  png   "$A/erharch.png"             erharch.png
  png   "$A/erhsimvsreal.png"        erhsimvsreal.png
  photo "$A/uestc1.jpeg"             uestc-logo.jpg
  photo "$A/uestc2.jpg"              uestc-campus.jpg
  png   "$A/urjc.avif"               urjc-logo.png
  photo "$SRC/urjc2.jpeg"            urjc-campus.jpg
  png   "$SRC/IST1.png"              ist-logo.png
  photo "$SRC/ist2.jpeg"             ist-campus.jpg
  # Kept byte for byte like best_moments_grid.gif, with a still for reduced motion.
  cp "$A/erhsimvideo2.gif" "$MEDIA/erhsimvideo2.gif"
  convert "$A/erhsimvideo2.gif[0]" -strip -quality 82 "$MEDIA/erhsimvideo2-still.jpg"

  # Clips are from the assets/ root: SRC is relative to it here.
  SRC=$A
  clip eehackvideo1.mov  go2-test3    10 &
  clip erhcup2.MP4       erh-cup      20 &
  clip erhsnicker1.MP4   erh-snickers 20 &
  clip erhtimelapse.MP4  erh-timelapse 7 &
  wait
}

# The turtle rover: a Blender render (a photo for the encoder) and screenshots, lossless.
third() {
  photo "$A/turtle_bot.png"    turtle-render.jpg
  png   "$A/tr_rviz.png"       tr-rviz.png
  png   "$A/tr_simulation.png" tr-simulation.png
  for n in 1 2 3 4; do png "$A/tr_seq$n.png" "tr-seq$n.png"; done
}

case "${1:-}" in
  second) second ;;
  third) third ;;
  *) first; second; third ;;
esac
