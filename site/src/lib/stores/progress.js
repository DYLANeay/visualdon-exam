import { persisted } from './persisted.js'

// Progression globale de l'élève : XP, badges, streak, état par module.
// modules: { [idModule]: { statut: 'en cours' | 'maîtrisé', meilleurScore } }
export const progress = persisted('progress', {
  xp: 0,
  badges: [],
  streak: { count: 0, lastDay: null },
  modules: {},
})

export function addXp(amount) {
  progress.update((p) => ({ ...p, xp: p.xp + amount }))
  marquerActiviteDuJour()
}

export function awardBadge(id) {
  progress.update((p) =>
    p.badges.includes(id) ? p : { ...p, badges: [...p.badges, id] },
  )
}

// Niveau : paliers de 100 XP, label progressif.
export function niveau(xp) {
  const n = Math.floor(xp / 100) + 1
  const dansNiveau = xp % 100
  return { n, dansNiveau, versSuivant: 100 - dansNiveau }
}

function jourISO(d = new Date()) {
  return d.toISOString().slice(0, 10)
}

// Met à jour le streak quotidien dès qu'il y a une activité (XP gagné).
export function marquerActiviteDuJour() {
  progress.update((p) => {
    const auj = jourISO()
    const s = p.streak ?? { count: 0, lastDay: null }
    if (s.lastDay === auj) return p // déjà compté aujourd'hui

    const hier = jourISO(new Date(Date.now() - 864e5))
    const count = s.lastDay === hier ? s.count + 1 : 1
    const streak = { count, lastDay: auj }
    const badges =
      count >= 7 && !p.badges.includes('streak-7')
        ? [...p.badges, 'streak-7']
        : p.badges
    return { ...p, streak, badges }
  })
}

// Attribue les badges liés à la maîtrise des modules.
export function verifierBadgesModules() {
  progress.update((p) => {
    const maitrise = (id) => p.modules[id]?.statut === 'maîtrisé'
    const aAjouter = []
    if (maitrise('05-echelles-axes')) aAjouter.push('maitre-echelles')
    if (maitrise('08-intro-cartographie') || maitrise('09-cartographie-web'))
      aAjouter.push('cartographe')
    if (maitrise('10-ethique-biais')) aAjouter.push('chasseur-biais')
    const tous = [
      '01-introduction', '02-dessiner-avec-du-code', '03-js-dom', '04-donnees',
      '05-echelles-axes', '06-interaction-1', '07-interaction-2',
      '08-intro-cartographie', '09-cartographie-web', '10-ethique-biais', '12-alternatives',
    ]
    if (tous.every(maitrise)) aAjouter.push('tous-modules')

    const badges = [...p.badges]
    for (const b of aAjouter) if (!badges.includes(b)) badges.push(b)
    return { ...p, badges }
  })
}
