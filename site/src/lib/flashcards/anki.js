// Export des flashcards au format d'import texte d'Anki.
// Anki lit un fichier tabulé : un champ recto, un champ verso, un champ tags.
// Les en-têtes `#...` configurent l'import (séparateur, HTML autorisé, colonne tags).

// Conversion markdown inline → HTML simple (Anki affiche du HTML, pas du markdown).
function mdVersHtml(src) {
  return (src ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/`([^`]+)`/g, '<code>$1</code>') // `code`
    .replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>') // **gras**
    .replace(/\*([^*]+)\*/g, '<i>$1</i>') // *italique*
    .replace(/\n/g, '<br>') // sauts de ligne
    .replace(/\t/g, ' ') // jamais de tabulation dans un champ
}

// Construit le contenu texte d'un paquet de cartes.
export function versTexteAnki(cartes) {
  const lignes = ['#separator:tab', '#html:true', '#tags column:3']
  for (const c of cartes) {
    const tag = 'VisualDon::' + (c.module ?? 'divers')
    lignes.push([mdVersHtml(c.recto), mdVersHtml(c.verso), tag].join('\t'))
  }
  return lignes.join('\n') + '\n'
}

// Déclenche le téléchargement d'un .txt importable dans Anki.
export function exporterAnki(cartes, nomFichier = 'visualdon-flashcards.txt') {
  const blob = new Blob([versTexteAnki(cartes)], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = nomFichier
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}
