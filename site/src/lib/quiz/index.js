import { get } from 'svelte/store'
import { stats, estFaible, poidsTirage } from '../stores/stats.js'

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

// Tirage pondéré sans remise : chaque question a un poids (cf. poidsTirage), les
// points faibles et les questions jamais vues remontent. Préserve la variété.
function tirerPondere(liste, n) {
  const etats = get(stats).questions
  const pool = liste.map((q) => ({ q, poids: poidsTirage(etats[q.id]) }))
  const choisies = []
  while (choisies.length < n && pool.length) {
    const total = pool.reduce((s, e) => s + e.poids, 0)
    let r = Math.random() * total
    let i = 0
    while (i < pool.length - 1 && (r -= pool[i].poids) > 0) i++
    choisies.push(pool[i].q)
    pool.splice(i, 1)
  }
  return choisies
}

// Tire `n` questions d'une partie donnée ('qcm' | 'd3' | 'cartographie' | 'ethique').
// Biaisé vers les points faibles via le suivi de stats.
function tirerPartie(partie, n) {
  return tirerPondere(
    toutes.filter((q) => q.partie === partie),
    n,
  )
}

// Tire des questions d'une partie jusqu'à atteindre (au plus près) `ptsCible` points.
// Sert aux parties carto (25 pts) et éthique (15 pts), dont les questions ont des
// pondérations variées : on vise le total officiel plutôt qu'un nombre fixe.
function tirerPartiePoints(partie, ptsCible) {
  const ordre = tirerPondere(toutes.filter((q) => q.partie === partie), 9999)
  const choisies = []
  let pts = 0
  for (const q of ordre) {
    if (pts >= ptsCible) break
    choisies.push(q)
    pts += q.points
  }
  return choisies
}

// Questions actuellement faibles (toutes parties confondues), pour le mode
// « Réviser mes erreurs ». Triées des plus ratées aux moins ratées.
export function questionsErreurs() {
  const etats = get(stats).questions
  return toutes
    .filter((q) => estFaible(etats[q.id]))
    .sort((a, b) => (etats[b.id]?.serieRates ?? 0) - (etats[a.id]?.serieRates ?? 0))
}

// Construit un examen blanc au format officiel (cf. revisions/examen-type.md) :
// QCM 20 pts (10×2), D3 vrai/faux 36 pts (18×2), cartographie 25 pts, éthique 15 pts.
export function genererExamen() {
  return {
    cree: Date.now(),
    sections: [
      { titre: 'Partie 1 · QCM', partie: 'qcm', questions: tirerPartie('qcm', 10) },
      { titre: 'Partie 2 · D3.js', partie: 'd3', questions: tirerPartie('d3', 18) },
      { titre: 'Partie 3 · Cartographie', partie: 'cartographie', questions: tirerPartiePoints('cartographie', 25) },
      { titre: 'Partie 4 · Éthique et biais', partie: 'ethique', questions: tirerPartiePoints('ethique', 15) },
    ],
  }
}
