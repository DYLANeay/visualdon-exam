# 09 — Antisèche Vue 3 → Svelte 5

Référence rapide pour passer de Vue 3 (`<script setup>`) à Svelte 5. Toutes les correspondances sont basées sur les pratiques réelles du projet VisualDon.

---

## Réactivité

| Concept | Vue 3 (`<script setup>`) | Svelte 5 |
|---|---|---|
| État primitif | `const x = ref(0)` + `x.value` | `let x = $state(0)` + `x` |
| État objet/tableau | `const o = reactive({})` | `let o = $state({})` |
| Valeur calculée | `const d = computed(() => x.value * 2)` | `const d = $derived(x * 2)` |
| Valeur calculée complexe | `computed(() => { ... })` | `$derived.by(() => { ... })` |
| Effet de bord | `watchEffect(() => { ... })` | `$effect(() => { ... })` |
| Watcher sur une valeur | `watch(x, (val) => { ... })` | `$effect(() => { const _ = x; ... })` |
| Watch avec cleanup | `watchEffect((onCleanup) => { ...; onCleanup(() => ...) })` | `$effect(() => { ...; return () => ... })` |

---

## Props

| Concept | Vue 3 | Svelte 5 |
|---|---|---|
| Déclarer des props | `const p = defineProps({ x: String })` | `let { x } = $props()` |
| Props avec défaut | `defineProps({ x: { default: 'val' } })` | `let { x = 'val' } = $props()` |
| Lire une prop | `p.x` ou directement `x` avec destructure | `x` directement |
| Spread de props | `v-bind="obj"` | `{...obj}` |

---

## Template / Markup

| Concept | Vue 3 | Svelte 5 |
|---|---|---|
| Interpolation | `{{ x }}` | `{x}` |
| HTML brut | `v-html="html"` | `{@html html}` |
| Condition | `v-if="cond"` / `v-else-if` / `v-else` | `{#if cond}` / `{:else if}` / `{:else}` / `{/if}` |
| Boucle | `v-for="item in list" :key="item.id"` | `{#each list as item (item.id)}` / `{/each}` |
| Bloc async | manuel avec `ref` + `onMounted` | `{#await promise}` / `{:then val}` / `{:catch err}` / `{/await}` |
| Forcer recréation | `:key="id"` sur le composant | `{#key id}` / `{/key}` |

---

## Événements

| Concept | Vue 3 | Svelte 5 |
|---|---|---|
| Écouter un événement | `@click="fn"` | `onclick={fn}` |
| Inline handler | `@click="count++"` | `onclick={() => count++}` |
| Événement natif | `@click.native` (Options API) | `onclick` (natif par défaut) |
| Modificateur `.prevent` | `@submit.prevent="fn"` | `onsubmit={(e) => { e.preventDefault(); fn() }}` |
| Modificateur `.stop` | `@click.stop` | `onclick={(e) => e.stopPropagation()}` |
| Émettre depuis enfant | `const emit = defineEmits(['change']); emit('change', val)` | `let { onchange } = $props(); onchange?.(val)` |

> En Svelte 5, les événements custom se transmettent comme des props de type fonction.

---

## Liaisons (`bind`)

| Concept | Vue 3 | Svelte 5 |
|---|---|---|
| Two-way binding input | `v-model="val"` | `bind:value={val}` |
| Checkbox | `v-model="checked"` | `bind:checked={checked}` |
| Select | `v-model="selected"` | `bind:value={selected}` |
| Référence DOM | `const el = ref(null)` + `ref="el"` | `let el = $state(null)` + `bind:this={el}` |

---

## Styles et classes

| Concept | Vue 3 | Svelte 5 |
|---|---|---|
| Classe conditionnelle | `:class="{ actif: cond }"` | `class:actif={cond}` |
| Classe conditionnelle (string) | `:class="cond ? 'a' : 'b'"` | `class={cond ? 'a' : 'b'}` |
| Style inline | `:style="{ color: 'red' }"` | `style="color: red"` ou `style:color="red"` |
| Styles scoped | `<style scoped>` | `<style>` (scoped par défaut) |
| Styles globaux | `<style>` sans `scoped` | `<style>` dans `app.css` ou `:global()` |

---

## Composants

| Concept | Vue 3 | Svelte 5 |
|---|---|---|
| Importer un composant | `import Foo from './Foo.vue'` | `import Foo from './Foo.svelte'` |
| Utiliser un composant | `<Foo />` | `<Foo />` (identique) |
| Slot par défaut | `<slot />` | `{@render children?.()}` |
| Slots nommés | `<slot name="header" />` | `{@render header?.()}` |
| Fournir un slot | `<template #header>…</template>` | `{#snippet header()}…{/snippet}` |

> Les slots Svelte 5 utilisent les **snippets** (`{#snippet}` / `{@render}`) — une nouveauté par rapport à Svelte 4.

---

## Cycle de vie

| Moment | Vue 3 | Svelte 5 |
|---|---|---|
| Après le montage | `onMounted(() => { ... })` | `$effect(() => { ... })` |
| Avant destruction | `onUnmounted(() => { ... })` | Retourner une fn depuis `$effect` |
| Avant mise à jour | `onBeforeUpdate(() => { ... })` | Pas d'équivalent direct |
| Après mise à jour | `onUpdated(() => { ... })` | `$effect` se ré-exécute après chaque rendu |

---

## Stores / État global

| Concept | Vue 3 (Pinia) | Svelte 5 |
|---|---|---|
| Créer un store | `defineStore('id', () => ({ x: ref(0) }))` | `export const x = writable(0)` |
| Lire dans un composant | `const store = useStore(); store.x` | `import { x } from '…'; $x` |
| Modifier | `store.x = 5` ou action Pinia | `x.set(5)` ou `x.update(v => v + 1)` |
| Dériver | `computed()` dans le store | `derived(x, $x => $x * 2)` |
| Persister | Plugin `pinia-plugin-persistedstate` | Helper `persisted()` custom (cf. le projet) |

---

## Fichier de composant

```
Vue 3 (.vue)              Svelte 5 (.svelte)
─────────────────────     ─────────────────────
<script setup>            <script>
  // logique               // logique (runes directement utilisables)
</script>                 </script>

<template>                <!-- markup directement au niveau racine -->
  <div>…</div>              <div>…</div>
</template>

<style scoped>            <style>
  /* styles */              /* styles (scoped par défaut) */
</style>                  </style>
```

---

## Récap express (à coller sur ton formulaire A4)

```
$state(val)          ←→  ref(val)         pas de .value en Svelte
$derived(expr)       ←→  computed(() =>)
$effect(() => {})    ←→  watchEffect()    + return fn pour cleanup
$props()             ←→  defineProps()
{#if} {:else} {/if}  ←→  v-if v-else
{#each list as x}    ←→  v-for="x in list"
bind:value={x}       ←→  v-model="x"
bind:this={el}       ←→  ref="el"
onclick={fn}         ←→  @click="fn"
{@html str}          ←→  v-html="str"
$store               ←→  store.value (Pinia)
```
