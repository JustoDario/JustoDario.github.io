#!/usr/bin/env bash
# Generates public/media/ from the originals in assets/, which stay untouched.
# Output is committed, so this only needs to run when a source image changes.
# Requires ImageMagick 6 (`convert`). Run from the repository root.
set -euo pipefail

SRC=assets
OUT=public/media
SRGB=/usr/share/color/icc/colord/sRGB.icc
mkdir -p "$OUT"

# Converts to sRGB before stripping metadata: nine photos are Display P3, and
# removing the profile alone would shift their colours. [0] takes the main image
# of multi-picture JPEGs (ee1, ee2, eeq1). -auto-orient must run before -strip.
photo() { # source destination max-size
  convert "$SRC/$1[0]" -auto-orient -profile "$SRGB" -resize "$3x$3>" -strip \
    -sampling-factor 4:2:0 -interlace Plane -quality 82 "$OUT/$2"
}

# Screenshots and logos keep PNG: lossless, and two logos are transparent.
png() { # source destination max-size
  convert "$SRC/$1[0]" -resize "$3x$3>" -strip "$OUT/$2"
}

# Photos. Names are normalised; urjchackaton2.png really is a JPEG.
photo scarav1-2.jpg           scarav1-2.jpg           1920
photo cocov2_photo1.jpeg      cocov2_photo1.jpg       1920
photo cocov2_summit1.jpeg     cocov2_summit1.jpg      1920
photo cocov2_photo2.jpeg      cocov2_photo2.jpg       1920
photo coco_summit.jpeg        coco_summit.jpg         1920
photo cocov1.jpg              cocov1.jpg              1920
photo rcv1.jpeg               rcv1.jpg                1920
photo rcv2.jpeg               rcv2.jpg                1920
photo rc3.jpg                 rc3.jpg                 1920
photo erh_hack_podium.JPG     erh_hack_podium.jpg     1920
photo erh_house.jpeg          erh_house.jpg           1920
photo erh_hack_team.JPG       erh_hack_team.jpg       1920
photo ee1.JPG                 ee1.jpg                 1920
photo eeq1.JPG                eeq1.jpg                1920
photo ee2.JPG                 ee2.jpg                 1920
photo hackatonaiayo.JPG       hackatonaiayo.jpg       1920
photo atari_aia.JPG           atari_aia.jpg           1920
photo urjchackaton1.jpeg      urjchackaton1.jpg       1920
photo urjchackaton2.png       urjchackaton2.jpg       1920
photo radiacodehackaton.jpeg  radiacodehackaton.jpg   1920
photo qubichackaton.jpeg      qubichackaton.jpg       1920
photo demoqubic1.jpg          demoqubic1.jpg          1920
photo demoqubic2.jpg          demoqubic2.jpg          1920
photo mylatestphoto.jpeg      mylatestphoto.jpg       900
photo pythonlogo.jpeg         pythonlogo.jpg          256

# Screenshots. rpycoco is a wide plot strip, so it keeps its full 2600 px width.
png inflationlayeradded.png   inflationlayeradded.png 1920
png tsbsimulation.png         tsbsimulation.png       1920
png rpycoco.png               rpycoco.png             2600
png aia_conf.png              aia_conf.png            1920
png mapfreapp1.png            mapfreapp1.png          1920
png radiacodeapp1.png         radiacodeapp1.png       1920

# Logos. Gazebo and ROS 2 Control are transparent PNGs with a .jpeg extension.
png ros2logo.png              ros2logo.png            512
png c++logo.png               cpp-logo.png            512
png foxglovelogo.png          foxglovelogo.png        512
png gazebologo.jpeg           gazebologo.png          512
png ros2controllogo.jpeg      ros2controllogo.png     512

# Kept byte for byte: re-encoding would risk its 105 frames.
cp "$SRC/best_moments_grid.gif" "$OUT/best_moments_grid.gif"

echo "Generated $(find "$OUT" -type f | wc -l) files, $(du -sh "$OUT" | cut -f1)"
