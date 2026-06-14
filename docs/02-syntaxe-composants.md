# 02 — Syntaxe et composants Svelte 5

## Anatomie d'un fichier `.svelte`

Un fichier `.svelte` c'est comme un sandwich en trois couches :

```
┌─────────────────────────────┐
│  <script>                   │  ← logique JS / imports / état
│    ...                      │
│  </script>                  │
│                             │
│  <div>markup HTML</div>     │  ← template (HTML enrichi)
│                             │
│  <style>                    │  ← styles scoped (optionnel)
│    ...                      │
│  </style>                   │
└─────────────────────────────┘
```

**Analogie Vue** : c'est exactement le même principe que les SFC `.vue` avec `<script setup>`, `<template>` et `<style scoped>`. La différence : en Svelte, il n'y a pas de balise `<template>` — le HTML est directement au niveau racine du fichier.

---

## Exemple minimal — `CodeBlock.svelte` du projet

```svelte
<script>
  // Svelte 5 : les props se déclarent avec $props()
  let { code } = $props()
</script>

<figure class="my-4 overflow-hidden rounded-lg border border-neutral-200">
  <figcaption>
    <span>{code.langage ?? 'js'}</span>
    {#if code.editable}
      <span>éditable bientôt</span>
    {/if}
  </figcaption>
  <pre><code>{code.source}</code></pre>
</figure>
```

---

## Les props avec `$props()`

En **Svelte 5**, les props d'un composant se déclarent via la rune `$props()` :

```svelte
<script>
  // Destructuration directe — avec valeur par défaut optionnelle
  let { source = '', inline = false } = $props()
</script>
```

C'est exactement ce que fait `Markdown.svelte` dans le projet.

**Comparaison Vue → Svelte :**

```js
// Vue 3 (defineProps)
const props = defineProps({
  source: { type: String, default: '' },
  inline: { type: Boolean, default: false },
})

// Svelte 5 ($props)
let { source = '', inline = false } = $props()
```

> Svelte est plus concis : pas de typage à la Vue, on utilise les valeurs par défaut JS directement.

---

## Passage de données (passer des props)

Depuis un composant parent :

```svelte
<!-- parent passe une prop nommée `source` -->
<Markdown source={contenu.accroche} inline />

<!-- `inline` sans valeur = true (boolean shorthand) -->
<!-- équivalent à :inline="true" en Vue -->
```

Pour passer **toutes les props d'un objet** (spread) :

```svelte
<!-- App.svelte du projet -->
<Placeholder {...placeholders[$route]} />
```

Équivalent Vue : `<Placeholder v-bind="placeholders[route]" />`

---

## Interpolation dans le template

```svelte
<script>
  let nom = 'Dylan'
  let xp = 42
</script>

<!-- Interpolation simple : accolades simples (pas de double {{ }}) -->
<p>Bonjour {nom}, tu as {xp} XP !</p>

<!-- Expression JS autorisée -->
<p>Score : {xp * 2}</p>

<!-- Opérateur nullish coalescing -->
<span>{code.langage ?? 'js'}</span>
```

En Vue on utilise `{{ nom }}` (double accolades). En Svelte, une seule paire suffit.

---

## Bloc conditionnel `{#if}`

```svelte
{#if $route === '/'}
  <Accueil />
{:else if moduleId}
  <Module id={moduleId} />
{:else if $route.startsWith('/modules')}
  <Modules />
{:else}
  <Placeholder titre="Page introuvable" description="..." />
{/if}
```

Extrait réel de `App.svelte`. La syntaxe :
- `{#if condition}` — ouvre
- `{:else if condition}` — branche alternative
- `{:else}` — fallback
- `{/if}` — ferme

**Comparaison Vue :** `v-if`, `v-else-if`, `v-else` sur des éléments HTML. En Svelte c'est un **bloc** qui entoure du markup.

---

## Boucle `{#each}`

```svelte
<script>
  const nav = [
    { path: '/modules', label: 'Modules' },
    { path: '/essentiel', label: 'L'essentiel' },
  ]
</script>

{#each nav as item}
  <a href={'#' + item.path}>{item.label}</a>
{/each}

<!-- Avec index -->
{#each modules as m, i}
  <li>{i + 1}. {m.titre}</li>
{/each}

<!-- Avec clé (pour optimiser les mises à jour) -->
{#each modules as m (m.id)}
  <li>{m.titre}</li>
{/each}
```

**Comparaison Vue :** `v-for="item in nav" :key="item.path"`. En Svelte la clé est optionnelle et se place entre parenthèses à la fin.

---

## Événements

En Svelte 5, les événements utilisent la syntaxe des **attributs d'événements HTML natifs** — pas de `on:click` (c'était Svelte 4) :

```svelte
<!-- Svelte 5 : onclick, oninput, onchange... comme en HTML -->
<button onclick={() => window.print()}>Imprimer</button>

<!-- Avec référence à une fonction -->
<script>
  function handleClick() {
    console.log('cliqué')
  }
</script>
<button onclick={handleClick}>Clic</button>
```

Extrait réel de `Essentiel.svelte` :

```svelte
<button onclick={() => window.print()}>Imprimer</button>
```

**Comparaison Vue :** `@click="handler"` ou `v-on:click`. En Svelte 5, c'est exactement l'attribut HTML standard `onclick` — plus proche du JS natif.

> **Piège Svelte 4 → 5** : L'ancienne syntaxe `on:click={handler}` est **dépréciée** en Svelte 5. Utilise `onclick={handler}`.

---

## Récap visuel

| Concept | Vue 3 | Svelte 5 |
|---|---|---|
| Props | `defineProps({ x: String })` | `let { x } = $props()` |
| Interpolation | `{{ x }}` | `{x}` |
| Condition | `v-if` / `v-else` | `{#if}` / `{:else}` / `{/if}` |
| Boucle | `v-for="i in list"` | `{#each list as i}` / `{/each}` |
| Événement | `@click="fn"` | `onclick={fn}` |
| Spread props | `v-bind="obj"` | `{...obj}` |
