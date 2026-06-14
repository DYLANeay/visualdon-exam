# 07 — Routing dans une SPA Svelte

## Le problème du routing sans serveur

Une **SPA** (Single-Page Application) n'a qu'un seul fichier HTML. Toute la navigation se passe côté client — le serveur ne sert que `index.html` et les assets.

Quand tu navigues vers `/modules/intro`, le serveur cherche un fichier `modules/intro/index.html` — qui n'existe pas. Résultat : **404**.

Il y a deux solutions :

1. **Routing par chemin** (`/modules/intro`) : le serveur doit être configuré pour toujours renvoyer `index.html` ("catch-all" ou "history fallback"). Possible sur un serveur perso, pas sur GitHub Pages.
2. **Routing par hash** (`#/modules/intro`) : tout ce qui suit le `#` n'est **jamais envoyé au serveur**. Le navigateur gère ça localement. Fonctionne partout, y compris GitHub Pages.

---

## Pourquoi le hash pour GitHub Pages ?

GitHub Pages sert des fichiers statiques. Il ne peut pas être configuré pour rediriger toutes les URLs vers `index.html`. Donc le hash est la solution la plus simple.

```
https://dylan.github.io/visualdon-exam/#/modules/intro
                                        ↑
                          Le serveur ne voit que /visualdon-exam/
                          Le navigateur gère #/modules/intro
```

---

## Le routeur hash du projet (`lib/router.js`)

Voici le code complet commenté :

```js
import { readable } from 'svelte/store'

// Lit le hash courant et enlève le # initial
function currentPath() {
  return window.location.hash.replace(/^#/, '') || '/'
  //                         ↑ supprime le # au début
  //                                            ↑ fallback sur '/' si pas de hash
}

// Store en lecture seule : expose le chemin courant
export const route = readable(currentPath(), (set) => {
  // Se met à jour à chaque changement de hash
  const update = () => set(currentPath())
  window.addEventListener('hashchange', update)

  // Cleanup quand plus personne n'utilise le store
  return () => window.removeEventListener('hashchange', update)
})

// Fonction de navigation programmatique
export function navigate(path) {
  window.location.hash = path
  // → déclenche 'hashchange' → le store se met à jour automatiquement
}
```

**C'est tout.** 17 lignes pour un routeur fonctionnel.

---

## Utilisation dans `App.svelte`

```svelte
<script>
  import { route } from './lib/router.js'

  // Extrait l'ID de module depuis le chemin '#/modules/intro'
  const moduleId = $derived(
    $route.startsWith('/modules/') ? $route.slice('/modules/'.length) : null,
  )
  // Si $route = '/modules/intro', moduleId = 'intro'
  // Si $route = '/modules',       moduleId = null
</script>

<!-- Rendu conditionnel selon la route courante -->
{#if $route === '/'}
  <Accueil />
{:else if moduleId}
  <Module id={moduleId} />
{:else if $route.startsWith('/modules')}
  <Modules />
{:else if $route === '/essentiel'}
  <Essentiel />
{:else}
  <Placeholder titre="Page introuvable" />
{/if}
```

### Les liens de navigation

```svelte
<!-- Dans la navbar : href avec # devant -->
<a href="#/modules">Modules</a>
<a href="#/essentiel">L'essentiel</a>

<!-- Vers une page de module spécifique -->
<a href={`#/modules/${m.id}`}>Voir ce module</a>

<!-- Retour accueil -->
<a href="#/">Accueil</a>
```

Le clic sur ces liens modifie `window.location.hash`, ce qui déclenche l'événement `hashchange`, ce qui met à jour le store `route`, ce qui provoque un re-rendu du `{#if}` dans `App.svelte`.

---

## Navigation programmatique

Pour naviguer sans lien cliquable (après une action, un formulaire…) :

```js
import { navigate } from './lib/router.js'

// Après avoir soumis un quiz :
function terminerQuiz() {
  // sauvegarder les résultats…
  navigate('/modules')  // → window.location.hash = '/modules'
}
```

---

## Comparaison avec Vue Router

| Concept | Vue Router | Routeur hash du projet |
|---|---|---|
| Définition des routes | `createRouter([{ path, component }])` | `{#if $route === '…'}` dans App.svelte |
| Navigation déclarative | `<RouterLink to="/modules">` | `<a href="#/modules">` |
| Navigation programmatique | `router.push('/modules')` | `navigate('/modules')` |
| Route active | `router.currentRoute` | `$route` |
| Params dynamiques | `/modules/:id` → `route.params.id` | `$route.slice('/modules/'.length)` |
| Lazy loading | `component: () => import(…)` | Non (tout est importé statiquement) |
| Garde de navigation | `router.beforeEach()` | À implémenter manuellement |

---

## Avantages et limites de cette approche

**Avantages :**
- Zéro dépendance, zéro configuration.
- Fonctionne sur GitHub Pages sans config serveur.
- Code facile à lire et à debugger.
- Suffisant pour un site de taille modeste avec peu de routes.

**Limites :**
- Pas de lazy loading automatique des pages.
- Pas de transitions de page intégrées.
- Les paramètres d'URL doivent être parsés manuellement.
- Si le projet grandit (> 10 routes, auth, guards…), mieux vaut passer à SvelteKit.

---

## SvelteKit pour aller plus loin

Pour un projet sérieux, Svelte dispose de son meta-framework : **SvelteKit**. Il offre :
- Routing par fichiers (comme Next.js) : `src/routes/modules/[id]/+page.svelte`
- SSR, SSG, pré-rendu
- Layouts, guards, loading de données côté serveur
- Intégration parfaite avec GitHub Pages via l'adapter static

Ce projet n'utilise pas SvelteKit pour rester simple et déployable directement.
