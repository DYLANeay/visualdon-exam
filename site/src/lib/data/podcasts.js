// Manifeste des podcasts. Un fichier audio dans public/podcasts/<id>.m4a est
// considéré disponible si listé ici (et présent au build). Le podcast master
// synthétise tous les cours.
//
// Pour (re)générer les audios : scripts/podcasts/generer.sh
import { modules } from './modules.js'

const base = import.meta.env.BASE_URL

// Liste des podcasts effectivement générés (présents dans public/podcasts/).
// Ajoute un id ici après avoir lancé la génération.
const disponibles = new Set([
  'master',
  '01-introduction',
  '02-dessiner-avec-du-code',
  '03-js-dom',
  '04-donnees',
  '05-echelles-axes',
  '06-interaction-1',
  '07-interaction-2',
  '08-intro-cartographie',
  '09-cartographie-web',
  '10-ethique-biais',
  '12-alternatives',
])

export const podcastMaster = {
  id: 'master',
  titre: 'Révision complète (master)',
  sous_titre: 'Tout le cours en un épisode',
  fichier: `${base}podcasts/master.m4a`,
  disponible: disponibles.has('master'),
}

export const podcastsModules = modules.map((m) => ({
  id: m.id,
  titre: m.titre,
  sous_titre: `Cours ${String(m.numero).padStart(2, '0')}`,
  fichier: `${base}podcasts/${m.id}.m4a`,
  disponible: disponibles.has(m.id),
}))

export function podcastModule(id) {
  return podcastsModules.find((p) => p.id === id) ?? null
}
