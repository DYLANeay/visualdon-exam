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
