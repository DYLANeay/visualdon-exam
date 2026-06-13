import { persisted } from './persisted.js'

// Historique des examens blancs terminés, du plus récent au plus ancien.
// Chaque entrée : { date, points, max, pct, repondus, total }
export const examens = persisted('examens', [])

export function enregistrerExamen(resume) {
  examens.update((liste) => [{ date: Date.now(), ...resume }, ...liste].slice(0, 50))
}
