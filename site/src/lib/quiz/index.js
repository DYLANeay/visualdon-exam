// Charge toute la banque de questions (un fichier par module).
const fichiers = import.meta.glob('./banque/*.js', { eager: true })

const toutes = []
const parModule = {}
for (const chemin in fichiers) {
  const liste = fichiers[chemin].default ?? []
  for (const q of liste) {
    toutes.push(q)
    ;(parModule[q.module] ??= []).push(q)
  }
}

export function questionsModule(id) {
  return parModule[id] ?? []
}

export function toutesLesQuestions() {
  return toutes
}

// Mélange (Fisher–Yates) sans muter l'original.
export function melanger(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// Tire `n` questions d'une partie donnée ('qcm' | 'd3' | 'cartographie' | 'ethique').
function tirerPartie(partie, n) {
  const dispo = melanger(toutes.filter((q) => q.partie === partie))
  return dispo.slice(0, n)
}

// Construit un examen blanc au format officiel (cf. revisions/examen-type.md) :
// QCM 20 pts (10×2), D3 vrai/faux 36 pts (18×2), cartographie 25 pts, éthique 15 pts.
export function genererExamen() {
  return {
    cree: Date.now(),
    sections: [
      { titre: 'Partie 1 · QCM', partie: 'qcm', questions: tirerPartie('qcm', 10) },
      { titre: 'Partie 2 · D3.js', partie: 'd3', questions: tirerPartie('d3', 18) },
      { titre: 'Partie 3 · Cartographie', partie: 'cartographie', questions: tirerPartie('cartographie', 5) },
      { titre: 'Partie 4 · Éthique et biais', partie: 'ethique', questions: tirerPartie('ethique', 5) },
    ],
  }
}
