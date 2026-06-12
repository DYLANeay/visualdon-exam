// Charge tous les modules de contenu (un fichier par cours évalué).
const fichiers = import.meta.glob('./modules/*.js', { eager: true })

const parId = {}
for (const chemin in fichiers) {
  const mod = fichiers[chemin].default
  if (mod?.id) parId[mod.id] = mod
}

export function contenuModule(id) {
  return parId[id] ?? null
}

export function tousLesContenus() {
  return Object.values(parId)
}
