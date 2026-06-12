import { persisted } from './persisted.js'

// État SM-2 de chaque carte, par id : { repetitions, intervalle, facilite, du }.
export const cartesEtat = persisted('cards', {})

export function majCarte(id, etat) {
  cartesEtat.update((m) => ({ ...m, [id]: etat }))
}

// Efface tout l'historique de révision : toutes les cartes redeviennent dues.
export function reinitialiserCartes() {
  cartesEtat.set({})
}
