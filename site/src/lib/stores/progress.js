import { persisted } from './persisted.js'

// Progression par module : { [idModule]: { statut: 'en cours' | 'maîtrisé', meilleurScore } }
export const progress = persisted('progress', {
  modules: {},
})
