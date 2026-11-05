#!/usr/bin/env bash
# Generates the site's versions of the originals in assets/projectmedia/, which are too
# heavy for the repository and stay out of it. Output is committed. Run from the root.
# Needs ffmpeg and ImageMagick 6. The HEIC files must be decoded first into $HEIC_JPEGS
# (same names, .jpg), for instance with the npm package heic-convert in a temporary folder.
#
# -map_metadata -1 matters: phone videos carry the GPS position of where they were shot.
set -euo pipefail

SRC=assets/projectmedia
MEDIA=public/media
VIDEO=public/video
SRGB=/usr/share/color/icc/colord/sRGB.icc
HEIC_JPEGS=${HEIC_JPEGS:?folder with the decoded HEIC files}

photo() { # source destination
  convert "$1[0]" -auto-orient -profile "$SRGB" -resize '1920x1920>' -strip \
    -sampling-factor 4:2:0 -interlace Plane -quality 82 "$MEDIA/$2"
}

# Same limits as the videos already on the site: 720p at 30 fps, AV1 first, H.264 as fallback.
FIT="scale='if(gt(iw,ih),min(1280,iw),-2)':'if(gt(iw,ih),-2,min(1280,ih))',fps=30,format=yuv420p"

clip() { # source slug poster-second [audio]
  local audio_av1=(-an) audio_h264=(-an)
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
