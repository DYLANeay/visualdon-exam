import { get, writable } from 'svelte/store'
import { supabase, syncConfigure } from './supabase.js'
import { fusionner } from './merge.js'
import { progress } from '../stores/progress.js'
import { cartesEtat } from '../stores/cards.js'
import { stats } from '../stores/stats.js'
import { examens } from '../stores/examens.js'

const TABLE = 'sync'

// État exposé à l'UI.
export const utilisateur = writable(null) // session Supabase (ou null)
export const statutSync = writable(syncConfigure ? 'deconnecte' : 'inactif')
//  'inactif' (non configuré) · 'deconnecte' · 'synchro' · 'ok' · 'erreur'
export const derniereSync = writable(0)

let appliquant = false // évite de repousser pendant qu'on applique l'état fusionné

// Lecture / écriture des stores locaux.
function collecterLocal() {
  return {
    progress: get(progress),
    cards: get(cartesEtat),
    stats: get(stats),
    examens: get(examens),
  }
}

function appliquer(etat) {
  appliquant = true
  if (etat.progress) progress.set(etat.progress)
  if (etat.cards) cartesEtat.set(etat.cards)
  if (etat.stats) stats.set(etat.stats)
  if (etat.examens) examens.set(etat.examens)
  appliquant = false
}

// Pousse l'état local vers Supabase (upsert sur la ligne de l'utilisateur).
async function pousser(userId) {
  const { error } = await supabase
    .from(TABLE)
    .upsert({ user_id: userId, data: collecterLocal(), updated_at: new Date().toISOString() })
  if (error) throw error
}

// Tire l'état distant, le fusionne avec le local, applique, puis renvoie le tout.
async function tirerEtFusionner(userId) {
  const { data, error } = await supabase
    .from(TABLE)
    .select('data')
    .eq('user_id', userId)
    .maybeSingle()
  if (error) throw error
  if (data?.data) appliquer(fusionner(collecterLocal(), data.data))
  await pousser(userId)
}

// Synchro complète (tirer + fusionner + pousser), avec gestion du statut.
export async function synchroniser() {
  const u = get(utilisateur)
  if (!syncConfigure || !u) return
  statutSync.set('synchro')
  try {
    await tirerEtFusionner(u.id)
    derniereSync.set(Date.now())
    statutSync.set('ok')
  } catch (e) {
    console.error('Synchro échouée', e)
    statutSync.set('erreur')
  }
}

// Envoi d'un lien magique de connexion par e-mail.
export async function connecter(email) {
  if (!syncConfigure) return { error: { message: 'Synchro non configurée.' } }
  return supabase.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: window.location.origin + import.meta.env.BASE_URL },
  })
}

export async function deconnecter() {
  if (!syncConfigure) return
  await supabase.auth.signOut()
}

// Push débauncé : à chaque changement local (et si connecté), on remonte après 2 s.
let minuteur
function planifierPush() {
  if (appliquant || !syncConfigure) return
  const u = get(utilisateur)
  if (!u) return
  clearTimeout(minuteur)
  minuteur = setTimeout(async () => {
    try {
      statutSync.set('synchro')
      await pousser(u.id)
      derniereSync.set(Date.now())
      statutSync.set('ok')
    } catch (e) {
      console.error('Push échoué', e)
      statutSync.set('erreur')
    }
  }, 2000)
}

// Initialisation, appelée une fois au démarrage de l'app.
export function initSync() {
  if (!syncConfigure) return

  supabase.auth.onAuthStateChange((evenement, session) => {
    utilisateur.set(session?.user ?? null)
    if (session?.user) {
      statutSync.set('synchro')
      synchroniser()
    } else if (evenement === 'SIGNED_OUT') {
      statutSync.set('deconnecte')
    }
  })

  // Repousse les modifications locales vers le cloud.
  progress.subscribe(planifierPush)
  cartesEtat.subscribe(planifierPush)
  stats.subscribe(planifierPush)
  examens.subscribe(planifierPush)

  // Re-tire au retour sur l'onglet (un autre appareil a pu modifier les données).
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible' && get(utilisateur)) synchroniser()
  })
}
