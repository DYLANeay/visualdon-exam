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
  '05-echelles-axes',
  // 'master', '01-introduction', … à compléter au fil des générations
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
