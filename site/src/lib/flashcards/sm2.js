// Algorithme de répétition espacée SM-2 (simplifié), 4 niveaux de réponse.
// État d'une carte : { repetitions, intervalle (jours), facilite, du (timestamp) }.

export const ETAT_INITIAL = { repetitions: 0, intervalle: 0, facilite: 2.5, du: 0 }

// qualité : 0 = Encore, 3 = Difficile, 4 = Bien, 5 = Facile
export function reviser(etat = ETAT_INITIAL, qualite) {
  let { repetitions, intervalle, facilite } = etat
  const jour = 24 * 60 * 60 * 1000

  if (qualite < 3) {
    // Échec : on recommence, carte redue dans la session (≈1 min).
    return {
      repetitions: 0,
      intervalle: 0,
      facilite: Math.max(1.3, facilite - 0.2),
      du: Date.now() + 60 * 1000,
    }
  }

  // Réussite : on ajuste la facilité (formule SM-2).
  facilite = Math.max(
    1.3,
    facilite + (0.1 - (5 - qualite) * (0.08 + (5 - qualite) * 0.02)),
  )
  repetitions += 1
  if (repetitions === 1) intervalle = 1
  else if (repetitions === 2) intervalle = 6
  else intervalle = Math.round(intervalle * facilite)

  return { repetitions, intervalle, facilite, du: Date.now() + intervalle * jour }
}

export function estDue(etat) {
  return !etat || etat.du <= Date.now()
}

// Formate un intervalle (en jours) en libellé court, façon Anki.
export function formatIntervalle(jours) {
  if (jours <= 0) return '<1 min'
  if (jours < 1) return '<1 j'
  if (jours < 30) return `${Math.round(jours)} j`
  if (jours < 365) return `${Math.round(jours / 30)} mois`
  return `${(jours / 365).toFixed(1)} an`
}

// Prévisualise l'intervalle obtenu pour une qualité donnée, sans muter l'état.
// Sert à afficher l'échéance sur chaque bouton de réponse (comme Anki).
export function apercuIntervalle(etat = ETAT_INITIAL, qualite) {
  return formatIntervalle(reviser(etat, qualite).intervalle)
}

// Maturité d'une carte, façon Anki (seuil de maturité : 21 jours).
//  - 'nouvelle' : jamais réussie.
//  - 'apprentissage' : réussie mais intervalle court (< 21 j).
//  - 'mûre' : ancrée en mémoire long terme (intervalle ≥ 21 j).
const SEUIL_MUR = 21
export function maturite(etat) {
  if (!etat || etat.repetitions === 0) return 'nouvelle'
  return etat.intervalle >= SEUIL_MUR ? 'mûre' : 'apprentissage'
}

// Une carte « passe un cap » quand sa maturité progresse vers le haut.
export function aMonte(avant, apres) {
  const rang = { nouvelle: 0, apprentissage: 1, mûre: 2 }
  return rang[maturite(apres)] > rang[maturite(avant)]
}
