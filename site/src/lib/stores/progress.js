import { persisted } from './persisted.js'

// Progression globale de l'élève : XP, badges, streak, état par module.
// modules: { [idModule]: { statut: 'en-cours' | 'maitrise', meilleurScore: number } }
export const progress = persisted('progress', {
  xp: 0,
  badges: [],
  streak: { count: 0, lastDay: null },
  modules: {},
})

export function addXp(amount) {
  progress.update((p) => ({ ...p, xp: p.xp + amount }))
}

export function awardBadge(id) {
  progress.update((p) =>
    p.badges.includes(id) ? p : { ...p, badges: [...p.badges, id] },
  )
}
