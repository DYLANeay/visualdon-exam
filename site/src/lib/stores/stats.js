import { get } from 'svelte/store'
import { persisted } from './persisted.js'

// Historique de réponses par question, pour repérer les points faibles.
// Forme : { [idQuestion]: { module, partie, vus, justes, serieRates, dernier } }
//  - vus / justes : compteurs cumulés.
//  - serieRates : nombre d'échecs consécutifs (remis à 0 dès une réussite).
//  - dernier : timestamp de la dernière réponse.
export const stats = persisted('stats', { questions: {} })

// Enregistre une réponse. `q` est l'objet question complet (cf. quiz/SCHEMA.md).
export function enregistrerReponse(q, correct) {
  stats.update((s) => {
    const prec = s.questions[q.id] ?? {
      module: q.module,
      partie: q.partie,
      vus: 0,
      justes: 0,
      serieRates: 0,
      dernier: 0,
    }
    return {
      ...s,
      questions: {
        ...s.questions,
        [q.id]: {
          ...prec,
          module: q.module,
          partie: q.partie,
          vus: prec.vus + 1,
          justes: prec.justes + (correct ? 1 : 0),
          serieRates: correct ? 0 : prec.serieRates + 1,
          dernier: Date.now(),
        },
      },
    }
  })
}

// Une question est « faible » si elle a déjà été ratée et pas encore rattrapée :
// dernier essai faux (serieRates > 0) OU taux de réussite < 60 % après ≥ 2 essais.
export function estFaible(st) {
  if (!st || st.vus === 0) return false
  if (st.serieRates > 0) return true
  return st.vus >= 2 && st.justes / st.vus < 0.6
}

// Renvoie l'ensemble des ids de questions actuellement faibles.
export function idsFaibles() {
  const s = get(stats)
  return Object.entries(s.questions)
    .filter(([, st]) => estFaible(st))
    .map(([id]) => id)
}

// Poids de tirage d'une question : les points faibles et les questions jamais vues
// remontent ; les questions bien maîtrisées descendent. Toujours ≥ 0.2 (rien n'est exclu).
export function poidsTirage(st) {
  if (!st || st.vus === 0) return 1 // jamais vue : poids neutre
  if (estFaible(st)) return 3 // à retravailler en priorité
  const taux = st.justes / st.vus
  return Math.max(0.2, 1 - taux) // bien maîtrisée → rarement retirée
}
