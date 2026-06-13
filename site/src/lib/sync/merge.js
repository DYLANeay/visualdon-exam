// Fusion de deux états (local ↔ distant) sans perte, pour la synchro multi-appareils.
// Chaque type de donnée a sa règle, pensée pour « ne jamais régresser » :
//  - progression : le meilleur score gagne, « maîtrisé » l'emporte sur « en cours » ;
//  - flashcards  : la carte la plus avancée gagne (plus de répétitions, sinon échéance
//                  la plus lointaine) — réviser sur un appareil n'est pas annulé par l'autre ;
//  - stats       : la réponse la plus récente gagne (évite de recompter les essais) ;
//  - examens     : on concatène et on dédoublonne par date.

function fusionnerProgress(a = { modules: {} }, b = { modules: {} }) {
  const modules = {}
  for (const id of new Set([...Object.keys(a.modules ?? {}), ...Object.keys(b.modules ?? {})])) {
    const x = a.modules?.[id]
    const y = b.modules?.[id]
    if (!x) modules[id] = y
    else if (!y) modules[id] = x
    else
      modules[id] = {
        statut: x.statut === 'maîtrisé' || y.statut === 'maîtrisé' ? 'maîtrisé' : 'en cours',
        meilleurScore: Math.max(x.meilleurScore ?? 0, y.meilleurScore ?? 0),
      }
  }
  return { modules }
}

function fusionnerCards(a = {}, b = {}) {
  const out = {}
  for (const id of new Set([...Object.keys(a), ...Object.keys(b)])) {
    const x = a[id]
    const y = b[id]
    if (!x) out[id] = y
    else if (!y) out[id] = x
    // Plus de répétitions = plus avancée ; à égalité, l'échéance la plus lointaine.
    else if ((y.repetitions ?? 0) > (x.repetitions ?? 0)) out[id] = y
    else if ((x.repetitions ?? 0) > (y.repetitions ?? 0)) out[id] = x
    else out[id] = (y.du ?? 0) > (x.du ?? 0) ? y : x
  }
  return out
}

function fusionnerStats(a = { questions: {} }, b = { questions: {} }) {
  const questions = {}
  const qa = a.questions ?? {}
  const qb = b.questions ?? {}
  for (const id of new Set([...Object.keys(qa), ...Object.keys(qb)])) {
    const x = qa[id]
    const y = qb[id]
    if (!x) questions[id] = y
    else if (!y) questions[id] = x
    else questions[id] = (y.dernier ?? 0) >= (x.dernier ?? 0) ? y : x
  }
  return { questions }
}

function fusionnerExamens(a = [], b = []) {
  const parDate = new Map()
  for (const e of [...(a ?? []), ...(b ?? [])]) parDate.set(e.date, e)
  return [...parDate.values()].sort((x, y) => y.date - x.date).slice(0, 50)
}

// Fusionne deux états complets. L'ordre des arguments n'a pas d'importance.
export function fusionner(local = {}, distant = {}) {
  return {
    progress: fusionnerProgress(local.progress, distant.progress),
    cards: fusionnerCards(local.cards, distant.cards),
    stats: fusionnerStats(local.stats, distant.stats),
    examens: fusionnerExamens(local.examens, distant.examens),
  }
}
