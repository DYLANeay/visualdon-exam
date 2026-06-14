# 04 — Les stores Svelte

## Pourquoi des stores ?

Les runes (`$state`, `$derived`) vivent à l'intérieur d'un composant. Quand tu veux partager de l'état entre plusieurs composants sans les lier en parent-enfant, tu as besoin d'un **store** — un objet réactif qui existe en dehors des composants.

**Analogie** : imagine un tableau blanc dans une salle de réunion. Chaque participant (composant) peut le lire et le modifier. Le tableau blanc existe indépendamment des participants — c'est le store.

---

## `writable` — store modifiable

```js
import { writable } from 'svelte/store'

// Crée un store avec une valeur initiale
const count = writable(0)

// Lire la valeur : s'abonner
count.subscribe((val) => console.log(val))  // affiche 0

// Modifier
count.set(5)           // remplace la valeur entière
count.update((n) => n + 1)  // transforme la valeur courante
```

---

## `readable` — store en lecture seule

Utile pour des valeurs qui changent d'elles-mêmes (horloge, position GPS, hash de l'URL…) mais qu'on ne veut pas modifier depuis l'extérieur.

```js
import { readable } from 'svelte/store'

// readable(valeurInitiale, fonctionDeSetup)
const heure = readable(new Date(), (set) => {
  const interval = setInterval(() => set(new Date()), 1000)
  return () => clearInterval(interval)  // cleanup
})
```

---

## Le store `route` dans le projet

C'est exactement ce pattern que `lib/router.js` utilise :

```js
// lib/router.js
import { readable } from 'svelte/store'

function currentPath() {
  return window.location.hash.replace(/^#/, '') || '/'
}

export const route = readable(currentPath(), (set) => {
  const update = () => set(currentPath())
  window.addEventListener('hashchange', update)
  return () => window.removeEventListener('hashchange', update)
})
```

- La valeur initiale est le hash courant de l'URL.
- La fonction de setup installe un listener `hashchange`.
- Le cleanup retire le listener quand plus personne ne s'abonne.

---

## S'abonner avec `$store` — la syntaxe magique

Dans un composant `.svelte`, préfixer un store de `$` l'abonne **automatiquement** :

```svelte
<script>
  import { route } from './lib/router.js'
  import { progress } from './lib/stores/progress.js'
</script>

<!-- Svelte s'abonne et se désabonne tout seul -->
<p>Route actuelle : {$route}</p>
<p>XP : {$progress.xp}</p>
```

Sans le `$`, `route` est juste l'objet store. Avec le `$`, c'est **la valeur courante**, mise à jour réactivement.

**Dans du JS pur** (hors composant), il faut s'abonner manuellement :

```js
import { get } from 'svelte/store'

// Lire la valeur une seule fois (snapshot)
const valeur = get(monStore)

// S'abonner aux changements
const unsubscribe = monStore.subscribe((val) => {
  console.log(val)
})
// Plus tard…
unsubscribe()
```

---

## `persisted.js` — store synchronisé avec localStorage

Le projet définit un helper custom dans `lib/stores/persisted.js` :

```js
import { writable } from 'svelte/store'

const PREFIX = 'visualdon:'

export function persisted(key, initial) {
  const storageKey = PREFIX + key
  let value = initial

  // Au démarrage : lit localStorage si une valeur existe
  try {
    const raw = localStorage.getItem(storageKey)
    if (raw !== null) value = JSON.parse(raw)
  } catch {
    // Valeur corrompue : on repart de l'état initial
  }

  // Crée un store writable avec la valeur récupérée
  const store = writable(value)

  // À chaque changement du store → sauvegarde dans localStorage
  store.subscribe((v) => {
    localStorage.setItem(storageKey, JSON.stringify(v))
  })

  return store
}
```

**Comment ça marche :**
1. Au démarrage, on essaie de lire `localStorage` pour reprendre la progression.
2. On crée un `writable` normal avec cette valeur.
3. On s'abonne au store : chaque mutation est immédiatement persistée.

Résultat : l'état survit aux rechargements de page.

---

## `progress.js` — l'état global du joueur

```js
import { persisted } from './persisted.js'

export const progress = persisted('progress', {
  xp: 0,
  badges: [],
  streak: { count: 0, lastDay: null },
  modules: {},  // { [idModule]: { statut, meilleurScore } }
})

// Fonctions d'action (comme des "mutations" Pinia)
export function addXp(amount) {
  progress.update((p) => ({ ...p, xp: p.xp + amount }))
}

export function awardBadge(id) {
  progress.update((p) =>
    p.badges.includes(id) ? p : { ...p, badges: [...p.badges, id] },
  )
}
```

Utilisation dans `App.svelte` et `Accueil.svelte` :

```svelte
<script>
  import { progress } from './lib/stores/progress.js'
</script>

<span>{$progress.xp} XP</span>
```

---

## Comparaison avec Pinia / Vuex

| Concept | Vuex | Pinia | Svelte stores |
|---|---|---|---|
| Déclarer un store | `createStore({})` | `defineStore('id', {})` | `writable(val)` |
| État | `state: () => ({})` | `const x = ref()` | valeur initiale de `writable` |
| Mutations / actions | `mutations: {}` | fonctions dans le store | `store.update()` ou fonctions exportées |
| Getters | `getters: {}` | `computed()` | `derived(store, fn)` |
| Lire dans un composant | `store.state.x` | `store.x` | `$store` |
| Persistance | plugin vuex-persistedstate | plugin pinia-plugin-persistedstate | à coder manuellement (cf. `persisted.js`) |

---

## `derived` — store calculé depuis un autre store

```js
import { writable, derived } from 'svelte/store'

const xp = writable(0)

// Se recalcule automatiquement quand `xp` change
const niveau = derived(xp, ($xp) => Math.floor($xp / 100) + 1)
```

Utile si tu as un store global et que tu veux en dériver une vue filtrée.

---

## Récap

- `writable(val)` → store modifiable avec `.set()` et `.update()`
- `readable(val, setup)` → store en lecture seule, alimenté par un callback
- `derived(store, fn)` → store calculé depuis un ou plusieurs autres stores
- `$store` dans un composant → s'abonne automatiquement (syntaxe sucre)
- `persisted(key, val)` → pattern du projet : `writable` + synchronisation `localStorage`
