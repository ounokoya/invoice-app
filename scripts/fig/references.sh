#!/usr/bin/env bash
# Rend les écrans de la maquette Figma en PNG de référence, dans design/ (hors dépôt : maquettes premium).
# Usage : bash scripts/fig/references.sh   (il faut design/invoice-app.fig, téléchargé sur FM)
set -euo pipefail
cd "$(dirname "$0")/../.."
work=design/fig; out=design/reference
mkdir -p "$work" "$out/svg"
unzip -q -o design/invoice-app.fig -d "$work"
python3 -I - "$work" <<'PY'
import struct, sys, zlib
d = sys.argv[1]; b = open(f'{d}/canvas.fig', 'rb').read(); off = 12; i = 0
while off + 4 <= len(b):
    n = struct.unpack('<I', b[off:off + 4])[0]; off += 4
    open(f'{d}/chunk{i}.bin', 'wb').write(zlib.decompress(b[off:off + n], -15)); off += n; i += 1
PY
python3 -I scripts/fig/kiwi_fig.py "$work" "$work/message.json"
python3 -I scripts/fig/fig_render.py "$work/message.json" "$PWD/$work/images" "$out/svg" 'Desktop|Tablet|Mobile|Design System'
jobs=(); for f in "$out"/svg/*.svg; do jobs+=("$PWD/$f:$PWD/$out/$(basename "$f" .svg).png"); done
node scripts/fig/svg2png.js "${jobs[@]}"
