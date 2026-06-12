#!/usr/bin/env bash
# Génère les podcasts de révision VisualDon via notebooklm-py (hors-ligne).
# Pré-requis : `notebooklm login` déjà fait, langue réglée sur fr.
#
# Usage :
#   ./generer.sh module 05-echelles-axes "Échelles et axes"   # un module
#   ./generer.sh master                                        # le podcast master
#   ./generer.sh all                                           # tous les modules + master
#
# Les MP3 atterrissent dans site/public/podcasts/.
set -euo pipefail

cd "$(dirname "$0")/../.."
REPO="$(pwd)"
SRC_DIR="$REPO/comem-visualdon-main/cours"
OUT_DIR="$REPO/site/public/podcasts"
PROMPT_MODULE="$REPO/scripts/podcasts/prompt-module.txt"
PROMPT_MASTER="$REPO/scripts/podcasts/prompt-master.txt"
mkdir -p "$OUT_DIR"

# id (= nom de fichier de cours sans .md) -> titre lisible
declare -A MODULES=(
  [01-introduction]="Introduction"
  [02-dessiner-avec-du-code]="Dessiner avec du code"
  [03-js-dom]="JavaScript et DOM"
  [04-donnees]="Données"
  [05-echelles-axes]="Échelles et axes"
  [06-interaction-1]="Interaction et animation I"
  [07-interaction-2]="Interaction et animation II"
  [08-intro-cartographie]="Introduction à la cartographie"
  [09-cartographie-web]="Cartographie web"
  [10-ethique-biais]="Éthique et biais"
  [12-alternatives]="Alternatives à D3"
)
# Ordre d'affichage (le 11 — scrollytelling — est volontairement absent)
ORDRE=(01-introduction 02-dessiner-avec-du-code 03-js-dom 04-donnees 05-echelles-axes \
       06-interaction-1 07-interaction-2 08-intro-cartographie 09-cartographie-web \
       10-ethique-biais 12-alternatives)

generer_module() {
  local id="$1" titre="$2"
  echo "▶ Module $id — $titre"
  local nb
  nb=$(notebooklm create "VisualDon $id — $titre" --json | python3 -c "import sys,json;print(json.load(sys.stdin)['notebook']['id'])")
  notebooklm source add "$SRC_DIR/$id.md" -n "$nb" --type file --title "Cours $id" >/dev/null
  # attendre l'indexation (le wait matche par préfixe ; on attend la 1re source)
  local sid
  sid=$(notebooklm source list -n "$nb" --json | python3 -c "import sys,json;print(json.load(sys.stdin)['sources'][0]['id'])")
  notebooklm source wait "$sid" -n "$nb" >/dev/null
  notebooklm generate audio --prompt-file "$PROMPT_MODULE" -n "$nb" \
    --format deep-dive --length default --language fr --wait --timeout 1800
  notebooklm download audio "$OUT_DIR/$id.m4a" -n "$nb"
  echo "✓ $OUT_DIR/$id.m4a"
}

generer_master() {
  echo "▶ Podcast master (tous les cours)"
  local nb
  nb=$(notebooklm create "VisualDon — Révision complète (master)" --json | python3 -c "import sys,json;print(json.load(sys.stdin)['notebook']['id'])")
  for id in "${ORDRE[@]}"; do
    notebooklm source add "$SRC_DIR/$id.md" -n "$nb" --type file --title "Cours $id" >/dev/null
  done
  # attendre que toutes les sources soient prêtes
  notebooklm source list -n "$nb" --json | python3 -c "import sys,json;[print(s['id']) for s in json.load(sys.stdin)['sources']]" | while read -r sid; do
    notebooklm source wait "$sid" -n "$nb" >/dev/null || true
  done
  notebooklm generate audio --prompt-file "$PROMPT_MASTER" -n "$nb" \
    --format deep-dive --length long --language fr --wait --timeout 1800
  notebooklm download audio "$OUT_DIR/master.m4a" -n "$nb"
  echo "✓ $OUT_DIR/master.m4a"
}

case "${1:-}" in
  module) generer_module "$2" "$3" ;;
  master) generer_master ;;
  all)
    for id in "${ORDRE[@]}"; do generer_module "$id" "${MODULES[$id]}"; done
    generer_master
    ;;
  *) echo "Usage: $0 {module <id> <titre>|master|all}"; exit 1 ;;
esac
