# 06 — Styles scoped et Tailwind 4

## Les styles sont scoped par défaut

En Svelte, les styles définis dans un `<style>` s'appliquent **uniquement au composant courant**. C'est le comportement par défaut — pas besoin d'écrire `<style scoped>` comme en Vue.

**Comment ça marche ?** Au moment de la compilation, Svelte ajoute une classe unique à chaque élément du composant, et modifie les sélecteurs CSS pour cibler cette classe.

```svelte
<!-- MonComposant.svelte -->
<style>
  p {
    color: red;
  }
</style>

<p>Ce texte est rouge.</p>
```

Compilé, ça donne quelque chose comme :

```html
<style>
  p.svelte-1a2b3c { color: red; }
</style>

<p class="svelte-1a2b3c">Ce texte est rouge.</p>
```

Les `<p>` d'autres composants ne sont pas affectés. **L'isolation est totale.**

---

## `:global()` — styles qui s'échappent

Parfois tu veux cibler des éléments générés dynamiquement (par `{@html}`, par D3, par une librairie externe) que Svelte ne gère pas directement. La classe scoped ne sera pas ajoutée à ces éléments.

```svelte
<style>
  /* Cible TOUS les <a> dans .prose-vd, même générés par {@html} */
  :global(.prose-vd a) {
    color: blue;
    text-decoration: underline;
  }

  /* Cible les <p> enfants directs de ce composant,
     mais seulement dans le contexte de la classe scoped parente */
  div :global(p) {
    margin-bottom: 1rem;
  }
</style>
```

Dans `app.css` du projet, les styles `.prose-vd` sont **globaux** (pas dans un `<style>` de composant) justement parce qu'ils doivent cibler le HTML généré par `marked` dans `Markdown.svelte` :

```css
/* app.css — styles globaux, pas scoped */
.prose-vd p {
  @apply my-3 leading-relaxed;
}
.prose-vd a {
  @apply text-accent-600 underline underline-offset-2;
}
```

---

## Tailwind 4 dans ce projet

Le projet n'utilise **pas** de fichier `tailwind.config.js`. Tailwind 4 se configure directement dans le CSS via `@theme` :

```css
/* app.css */
@import 'tailwindcss';

@theme {
  --font-sans: 'Inter', ui-sans-serif, system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', ui-monospace, monospace;

  --color-accent-50: #eff6ff;
  --color-accent-100: #dbeafe;
  --color-accent-500: #3b82f6;
  --color-accent-600: #2563eb;
  --color-accent-700: #1d4ed8;
}
```

Les classes Tailwind s'utilisent directement dans les templates :

```svelte
<div class="mx-auto max-w-3xl py-12">
  <h1 class="text-2xl font-semibold text-neutral-900">Titre</h1>
</div>
```

---

## Le piège `@apply` dans un `<style>` scoped

C'est un problème **vécu dans ce projet** — voici l'explication complète.

### Le problème

Tailwind 4 fonctionne en scannant tes fichiers HTML/Svelte pour détecter les classes utilisées et générer le CSS correspondant. Quand tu utilises `@apply` dans un `<style>` de composant Svelte, tu te trouves dans un contexte **isolé** que Tailwind traite séparément du reste :

```svelte
<!-- PROBLEME : ce @apply peut échouer ou ne pas fonctionner -->
<style>
  .mon-bouton {
    @apply bg-accent-600 text-white px-4 py-2;
  }
</style>
```

Pourquoi ça plante ? Parce que les variables CSS personnalisées (`--color-accent-600`) définies dans `@theme` de `app.css` ne sont **pas automatiquement disponibles** dans le contexte du `<style>` scoped d'un composant.

### La solution : `@reference`

Tailwind 4 introduit la directive `@reference` pour résoudre exactement ce problème. Elle dit "va chercher les définitions de thème dans ce fichier" sans importer tout le CSS :

```svelte
<style>
  /* Indique à Tailwind où trouver les variables @theme */
  @reference "../../app.css";

  .mon-bouton {
    @apply bg-accent-600 text-white px-4 py-2;
    /* Maintenant --color-accent-600 est résolu correctement */
  }
</style>
```

Le chemin doit être **relatif au fichier `.svelte`** courant.

### La vraie bonne pratique dans ce projet

En regardant le code du projet, tu remarqueras que les composants utilisent **directement les classes Tailwind dans le template** plutôt que `@apply` :

```svelte
<!-- Pattern recommandé dans ce projet -->
<button class="rounded-md border border-neutral-200 px-3 py-1.5 text-sm text-neutral-600">
  Imprimer
</button>
```

C'est la façon la plus simple et celle qui évite le piège `@apply`. Réserve `@apply` pour les styles qui doivent cibler du HTML généré dynamiquement (via `{@html}` ou D3), où tu ne peux pas ajouter de classes manuellement.

---

## Quand utiliser quoi ?

| Situation | Approche recommandée |
|---|---|
| Styles d'un élément connu | Classes Tailwind directement dans le template |
| Style d'un état interactif simple | `class:nom={condition}` + classes Tailwind |
| Contenu `{@html}` (Markdown, etc.) | Styles globaux dans `app.css` avec `.prose-vd` |
| Composant avec logique de style complexe | `<style>` scoped + `@reference` si `@apply` nécessaire |
| Styles d'une librairie tierce | `:global()` dans le `<style>` du composant parent |

---

## Récap

- Les `<style>` Svelte sont **scoped par défaut** — isolation automatique comme `<style scoped>` Vue.
- `:global(sélecteur)` pour cibler des éléments hors du contrôle Svelte.
- `app.css` contient les styles **vraiment globaux** (prose-vd, body, html…).
- Tailwind 4 : configuration via `@theme` dans le CSS, pas de `tailwind.config.js`.
- `@apply` dans un `<style>` scoped nécessite `@reference "../../app.css"` pour accéder aux variables du thème.
- En pratique : préfère les classes Tailwind directement dans le template.
