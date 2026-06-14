# 03 — Réactivité et runes Svelte 5

## C'est quoi une "rune" ?

Dans les langues nordiques, une **rune** est un symbole magique qui déclenche un effet. En Svelte 5, les runes sont des **mots-clés spéciaux préfixés par `$`** qui signalent au compilateur "surveille cette valeur et réagis quand elle change".

Ce ne sont pas des fonctions normales — ce sont des **instructions au compilateur**. On ne peut pas les assigner à une variable, les passer en argument, ni les importer depuis un autre fichier. Elles font partie du langage Svelte lui-même.

---

## `$state` — l'état réactif

```svelte
<script>
  // Svelte 5 : $state() crée une variable réactive
  let count = $state(0)
  let nom = $state('Dylan')
  let modules = $state([])
</script>

<p>Compteur : {count}</p>
<button onclick={() => count++}>+1</button>
```

Quand `count` change, Svelte met à jour **uniquement** les parties du DOM qui affichent `count`. Pas de Virtual DOM, pas de re-render du composant entier.

**Comparaison Vue :**

```js
// Vue 3
import { ref } from 'vue'
const count = ref(0)
count.value++         // ← obligatoire avec ref

// Svelte 5
let count = $state(0)
count++               // ← mutation directe, pas de .value
```

Gros avantage Svelte : pas de `.value` partout. La variable se lit et s'écrit normalement.

### `$state` avec des objets

```svelte
<script>
  // Les objets et tableaux sont réactifs "en profondeur"
  let user = $state({ nom: 'Dylan', xp: 0 })

  function gagnerXp() {
    user.xp += 10   // met à jour uniquement ce qui affiche user.xp
  }
</script>

<p>{user.nom} — {user.xp} XP</p>
```

En Vue, il faudrait `reactive({ nom: 'Dylan', xp: 0 })` et éviter de remplacer l'objet entier. En Svelte 5, `$state` gère ça nativement.

---

## `$derived` — valeurs calculées

```svelte
<script>
  let xp = $state(150)

  // Recalculé automatiquement quand xp change
  const niveau = $derived(Math.floor(xp / 100) + 1)
  const xpRestant = $derived(100 - (xp % 100))
</script>

<p>Niveau {niveau} — encore {xpRestant} XP</p>
```

**Comparaison Vue :**

```js
// Vue 3
const niveau = computed(() => Math.floor(xp.value / 100) + 1)

// Svelte 5
const niveau = $derived(Math.floor(xp / 100) + 1)
```

Exemples réels dans le projet :

```svelte
<!-- App.svelte -->
const moduleId = $derived(
  $route.startsWith('/modules/') ? $route.slice('/modules/'.length) : null,
)

<!-- Module.svelte -->
const meta = $derived(modules.find((m) => m.id === id))
const contenu = $derived(contenuModule(id))
```

Pour des calculs plus complexes (logique multi-lignes), on utilise `$derived.by()` :

```svelte
<script>
  const stats = $derived.by(() => {
    const total = modules.length
    const faits = modules.filter(m => m.statut === 'maitrise').length
    return { total, faits, pourcentage: (faits / total) * 100 }
  })
</script>
```

---

## `$effect` — effets de bord

Un effet s'exécute **après le rendu** chaque fois que ses dépendances changent — exactement comme `watch` avec `immediate: true` en Vue, ou `useEffect` en React.

```svelte
<script>
  let recherche = $state('')

  // S'exécute à l'initialisation, puis à chaque changement de `recherche`
  $effect(() => {
    console.log('Nouvelle recherche :', recherche)
    // Svelte détecte automatiquement les dépendances (ici : `recherche`)
  })
</script>
```

### Nettoyage (cleanup)

```svelte
<script>
  $effect(() => {
    const timer = setInterval(() => console.log('tick'), 1000)

    // Retourner une fonction = cleanup exécuté avant le prochain effet
    // ou quand le composant est détruit
    return () => clearInterval(timer)
  })
</script>
```

**Comparaison Vue :**

```js
// Vue 3
watch(recherche, (val) => {
  console.log('Nouvelle recherche :', val)
}, { immediate: true })

// Svelte 5
$effect(() => {
  console.log('Nouvelle recherche :', recherche)
})
```

Avantage Svelte : pas besoin de déclarer explicitement les dépendances — Svelte les **détecte automatiquement** en analysant ce que l'effet lit.

### Cas d'usage typique : D3

```svelte
<script>
  import * as d3 from 'd3'
  let svgEl = $state(null)

  $effect(() => {
    if (!svgEl) return
    // D3 manipule le DOM SVG ici
    d3.select(svgEl).append('circle').attr('r', 50)
    return () => d3.select(svgEl).selectAll('*').remove()
  })
</script>

<svg bind:this={svgEl}></svg>
```

---

## `$props` — déjà vu, mais dans le contexte réactif

```svelte
<script>
  let { id } = $props()

  // id est réactif : si le parent le change, $derived se recalcule
  const meta = $derived(modules.find((m) => m.id === id))
</script>
```

Les props reçues via `$props()` sont réactives. Si le parent change la valeur passée, le composant enfant réagit automatiquement — sans avoir besoin de `watch`.

---

## Comparaison globale Vue 3 vs Svelte 5

| Concept | Vue 3 | Svelte 5 |
|---|---|---|
| État local | `ref(val)` + `.value` | `$state(val)` |
| Objet réactif | `reactive({})` | `$state({})` |
| Valeur calculée | `computed(() => …)` | `$derived(…)` |
| Effet de bord | `watch()` / `watchEffect()` | `$effect(() => …)` |
| Props | `defineProps({})` | `$props()` |
| Cycle de vie mount | `onMounted(() => …)` | `$effect(() => …)` (s'exécute après le 1er rendu) |

---

## Ancienne syntaxe Svelte 4 (à reconnaître, ne pas utiliser)

Si tu tombes sur du vieux code Svelte :

```svelte
<!-- Svelte 4 — OBSOLÈTE -->
<script>
  export let id         // ← ancienne façon de déclarer une prop
  let count = 0         // ← état simple (pas réactif via $state)

  $: doubled = count * 2  // ← ancienne syntaxe pour les valeurs dérivées
  $: console.log(count)   // ← ancienne syntaxe pour les effets
</script>
```

En **Svelte 5**, ces syntaxes sont dépréciées. Utilise toujours `$state`, `$derived`, `$effect`, `$props`.
