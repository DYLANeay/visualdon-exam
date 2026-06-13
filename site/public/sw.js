// Service worker de la PWA VisualDon.
// Objectif : app installable + utilisable hors-ligne après une première visite,
// SANS jamais toucher aux podcasts (.m4a, ~460 Mo, requêtes Range pour le seek).

const BASE = '/visualdon-exam/'
const SHELL = 'vd-shell-v1' // app shell (incrémenter pour forcer une purge)
const RUNTIME = 'vd-runtime-v1' // assets hashés mis en cache à la volée

// Ressources minimales pour démarrer hors-ligne. Les bundles hashés (JS/CSS)
// sont ajoutés au cache runtime dès leur premier chargement.
const APP_SHELL = [BASE, BASE + 'index.html', BASE + 'favicon.svg', BASE + 'manifest.webmanifest']

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(SHELL)
      .then((c) => c.addAll(APP_SHELL))
      .then(() => self.skipWaiting()),
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((k) => k !== SHELL && k !== RUNTIME).map((k) => caches.delete(k))),
      )
      .then(() => self.clients.claim()),
  )
})

self.addEventListener('fetch', (event) => {
  const { request } = event
  if (request.method !== 'GET') return

  const url = new URL(request.url)
  if (url.origin !== self.location.origin) return // ressources externes : laisser passer

  // Ne JAMAIS intercepter l'audio : fichiers énormes + requêtes Range (seek).
  if (url.pathname.endsWith('.m4a') || request.headers.has('range')) return

  // Navigations (chargement de page) : réseau d'abord (toujours à jour),
  // repli sur l'app shell quand on est hors-ligne.
  if (request.mode === 'navigate') {
    event.respondWith(fetch(request).catch(() => caches.match(BASE + 'index.html')))
    return
  }

  // Assets statiques (JS/CSS/icônes/polices) : cache d'abord, puis réseau.
  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached
      return fetch(request)
        .then((resp) => {
          if (resp.ok && resp.type === 'basic') {
            const copie = resp.clone()
            caches.open(RUNTIME).then((c) => c.put(request, copie))
          }
          return resp
        })
        .catch(() => cached)
    }),
  )
})
