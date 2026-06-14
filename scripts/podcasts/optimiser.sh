#!/usr/bin/env bash
# Réencode les podcasts en AAC 64 kbps mono : adapté à la voix parlée
# (NotebookLM sort du 256 kbps stéréo, ~4× trop lourd). Allège ~456 Mo → ~120 Mo
# pour un chargement mobile rapide et un streaming par morceaux fiable.
#
# Usage : ./optimiser.sh            # réencode tous les .m4a de site/public/podcasts
#         ./optimiser.sh fichier.m4a   # un seul fichier
set -euo pipefail

cd "$(dirname "$0")/../.."
OUT_DIR="$(pwd)/site/public/podcasts"

optimiser_un() {
  local f="$1"
  local tmp="${f%.m4a}.opt.m4a"
  local avant
  avant=$(du -h "$f" | cut -f1)
  ffmpeg -y -loglevel error -i "$f" -ac 1 -c:a aac -b:a 64k -movflags +faststart "$tmp"
  mv -f "$tmp" "$f"
  echo "✓ $(basename "$f")  $avant → $(du -h "$f" | cut -f1)"
}

if [[ $# -ge 1 ]]; then
  optimiser_un "$1"
else
  for f in "$OUT_DIR"/*.m4a; do optimiser_un "$f"; done
fi
echo "Total : $(du -sh "$OUT_DIR" | cut -f1)"
