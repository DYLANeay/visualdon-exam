# 05 — Directives et blocs de flux

## Les blocs de flux (`{# … }`)

Les blocs de flux permettent de **contrôler ce qui est rendu** dans le template. Ils ne sont pas des éléments HTML — ce sont des instructions au compilateur Svelte.

---

### `{#if}` — rendu conditionnel

Déjà vu dans le doc 02, mais voici la forme complète :

```svelte
{#if utilisateur}
  <p>Bienvenue, {utilisateur.nom} !</p>
{:else if erreur}
  <p class="text-red-500">Erreur : {erreur.message}</p>
{:else}
  <p>Chargement…</p>
{/if}
```

Réel dans `App.svelte` :

```svelte
{#if $route === '/'}
  <Accueil />
{:else if moduleId}
  <Module id={moduleId} />
{:else if $route.startsWith('/modules')}
  <Modules />
{:else}
  <Placeholder titre="Page introuvable" />
{/if}
```

---

### `{#each}` — boucles

```svelte
<!-- Forme de base -->
{#each items as item}
  <li>{item.titre}</li>
{/each}

<!-- Avec index -->
{#each items as item, i}
  <li>{i + 1}. {item.titre}</li>
{/each}

<!-- Avec clé (pour les mises à jour efficaces) -->
{#each items as item (item.id)}
  <li>{item.titre}</li>
{/each}

<!-- Avec bloc vide si la liste est vide -->
{#each items as item}
  <li>{item.titre}</li>
{:else}
  <p>Aucun élément.</p>
{/each}
```

Réel dans `Module.svelte` :

```svelte
{#each contenu.sections ?? [] as section}
  <section class="mt-10">
    <h2>{section.titre}</h2>
    {#if section.corps}
      <Markdown source={section.corps} />
    {/if}
  </section>
{/each}
```

---

### `{#await}` — gestion des Promises

Parfait pour charger des données asynchrones (API, fichiers JSON…) :

```svelte
<script>
  async function chargerDonnees() {
    const res = await fetch('/api/modules')
    return res.json()
  }

  const promise = chargerDonnees()
</script>

{#await promise}
  <!-- Pendant le chargement -->
  <p>Chargement…</p>
{:then data}
  <!-- Une fois résolue -->
  {#each data as item}
    <li>{item.titre}</li>
  {/each}
{:catch erreur}
  <!-- En cas d'erreur -->
  <p>Erreur : {erreur.message}</p>
{/await}
```

**Comparaison Vue :** Pas d'équivalent direct en Vue — il faut gérer manuellement avec `ref(null)`, `onMounted`, et des conditions `v-if`. Svelte rend ça beaucoup plus concis.

---

### `{#key}` — forcer la recréation d'un composant

```svelte
<script>
  let moduleId = $state('intro')
</script>

<!-- Détruit et recrée Graphique à chaque fois que moduleId change -->
{#key moduleId}
  <Graphique {moduleId} />
{/key}
```

Utile quand un composant a un état interne qu'on veut remettre à zéro lors d'un changement de données (ex. : une animation D3 qui doit repartir de zéro).

---

## Les directives

Les directives sont des **attributs spéciaux** dans le template Svelte qui ajoutent un comportement au-delà du HTML standard.

---

### `bind:` — liaison bidirectionnelle

```svelte
<script>
  let nom = $state('')
  let checked = $state(false)
  let valeur = $state(50)
  let el = $state(null)
</script>

<!-- Lie la valeur d'un input à une variable (two-way binding) -->
<input bind:value={nom} placeholder="Ton nom" />
<p>Bonjour {nom}</p>

<!-- Checkbox -->
<input type="checkbox" bind:checked={checked} />

<!-- Range slider -->
<input type="range" bind:value={valeur} min="0" max="100" />

<!-- Référence à un élément DOM (pour D3, Canvas…) -->
<svg bind:this={el}></svg>
```

**Comparaison Vue :** `v-model="nom"` est l'équivalent de `bind:value={nom}` pour les inputs. `bind:this` équivaut à `ref="el"` + `const el = ref(null)`.

> `bind:this` est crucial pour D3 : il permet de récupérer la référence à l'élément SVG ou Canvas réel.

---

### `class:` — classes conditionnelles

```svelte
<script>
  let actif = $state(false)
  let route = $state('/modules')
</script>

<!-- Ajoute la classe 'actif' si `actif` est true -->
<button class:actif={actif}>Clic</button>

<!-- Raccourci si le nom de la variable = nom de la classe -->
<button class:actif>Clic</button>

<!-- Plusieurs conditions -->
<a
  class:font-medium={route === '/modules'}
  class:text-neutral-500={route !== '/modules'}
>
  Lien
</a>
```

Réel dans `App.svelte` :

```svelte
<a
  href={'#' + item.path}
  class={$route.startsWith(item.path)
    ? 'font-medium text-accent-600'
    : 'text-neutral-500 transition-colors hover:text-neutral-900'}
>
```

**Comparaison Vue :** `:class="{ actif: condition }"` ou `:class="condition ? 'a' : 'b'"`.

---

### `use:` — actions (directives personnalisées)

Une **action** est une fonction qui reçoit un élément DOM et peut y attacher comportements ou listeners :

```js
// lib/actions/autofocus.js
export function autofocus(node) {
  node.focus()
  return {
    destroy() {
      // cleanup si nécessaire
    }
  }
}
```

```svelte
<script>
  import { autofocus } from './actions/autofocus.js'
</script>

<input use:autofocus placeholder="Sera focusé automatiquement" />
```

**Comparaison Vue :** équivalent des directives personnalisées `v-focus` avec `app.directive('focus', { mounted(el) { el.focus() } })`.

---

### `{@html}` — rendu HTML brut

Permet d'injecter du HTML généré dynamiquement :

```svelte
<script>
  import { marked } from 'marked'
  let { source } = $props()
  const html = $derived(marked.parse(source))
</script>

<!-- Injecte le HTML sans l'échapper -->
<div class="prose-vd">{@html html}</div>
```

C'est exactement ce que fait `Markdown.svelte` dans le projet.

> **Sécurité** : `{@html}` ne filtre pas le contenu. À n'utiliser qu'avec du contenu de confiance (généré par toi, pas saisi par l'utilisateur).

**Comparaison Vue :** `v-html="html"`.

---

### `{@const}` — constante locale dans un bloc

```svelte
{#each modules as m}
  {@const pourcentage = (m.score / m.total) * 100}
  <div style="width: {pourcentage}%">{pourcentage.toFixed(1)}%</div>
{/each}
```

Évite de répéter l'expression plusieurs fois dans la boucle.

---

## Récap des blocs et directives

| Syntaxe | Rôle | Équivalent Vue |
|---|---|---|
| `{#if}` / `{:else}` / `{/if}` | Conditionnel | `v-if` / `v-else` |
| `{#each list as item}` | Boucle | `v-for` |
| `{#await promise}` | Async / Promise | Manuel (`onMounted` + `ref`) |
| `{#key expr}` | Recrée le composant | `:key` sur `v-for` |
| `bind:value` | Two-way binding | `v-model` |
| `bind:this` | Réf. DOM | `ref="el"` |
| `class:nom={cond}` | Classe conditionnelle | `:class="{ nom: cond }"` |
| `use:action` | Directive custom | `v-directive` |
| `{@html contenu}` | HTML brut | `v-html` |
