# 01 — Introduction à Svelte

## Svelte, c'est quoi exactement ?

Imagine deux façons de construire une voiture :

- **Vue / React** : tu livres l'usine entière au client (le runtime). La voiture se fabrique chez lui, dans son navigateur, à chaque démarrage.
- **Svelte** : tu livres **la voiture déjà construite**. L'usine (le compilateur) a tout transformé en JavaScript natif pendant le build. Le navigateur n'a plus qu'à démarrer le moteur.

Svelte est un **compilateur**, pas un framework runtime. Ton code `.svelte` est transformé en JavaScript pur au moment du `vite build`. Il ne s'embarque pas dans le bundle final.

### Concrètement, qu'est-ce que ça change ?

| | Vue 3 | Svelte 5 |
|---|---|---|
| Runtime dans le bundle | Oui (~30 Ko min+gzip) | Minimal (quelques Ko) |
| Réactivité | Proxy JS (`reactive`) | Compilée (runes → instructions JS) |
| Virtual DOM | Oui | Non (mises à jour chirurgicales du DOM réel) |
| Syntaxe des composants | SFC (`.vue`) | SFC (`.svelte`) |

---

## Pourquoi Svelte pour ce projet ?

Le site de révision VisualDon est une **SPA légère** — pas de SSR, pas de millions d'utilisateurs. Les priorités sont :

1. **Vitesse de chargement** : l'élève ouvre le site vite, même sur le Wi-Fi de l'école.
2. **Productivité** : moins de boilerplate qu'avec Vue pour écrire des composants simples.
3. **Intégration D3** : Svelte laisse la main au développeur pour manipuler le DOM SVG directement, ce qui s'aligne bien avec la philosophie de D3.

---

## Structure d'un projet Vite + Svelte

```
visualdon-exam/
└── site/
    ├── index.html              ← point d'entrée HTML (Vite l'utilise)
    ├── vite.config.js          ← config Vite + plugins svelte() et tailwindcss()
    ├── package.json
    └── src/
        ├── main.js             ← monte le composant racine
        ├── App.svelte          ← composant racine (layout + routing)
        ├── app.css             ← styles globaux + config Tailwind
        └── lib/
            ├── components/     ← composants réutilisables
            ├── pages/          ← composants-pages (Accueil, Modules, Module…)
            ├── stores/         ← état global (progress.js, persisted.js)
            ├── data/           ← données statiques (liste des modules)
            ├── content/        ← contenu pédagogique (quiz, résumés)
            └── router.js       ← routeur hash maison
```

### `vite.config.js` du projet

```js
import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  base: '/visualdon-exam/',   // sous-chemin pour GitHub Pages
  plugins: [svelte(), tailwindcss()],
})
```

- `svelte()` — le plugin Vite qui déclenche le compilateur Svelte sur chaque `.svelte`.
- `tailwindcss()` — le plugin Tailwind v4 (intégration Vite native, pas de PostCSS).
- `base` — nécessaire pour que les assets soient correctement résolus sur GitHub Pages.

### `main.js` — point de montage

```js
import { mount } from 'svelte'
import './app.css'
import App from './App.svelte'

// Svelte 5 : on utilise `mount()` au lieu de `new App()`
const app = mount(App, {
  target: document.getElementById('app'),
})

export default app
```

> **Svelte 4 vs 5** : En Svelte 4 on écrivait `new App({ target: … })`. En Svelte 5, c'est `mount()`. C'est un changement d'API important à retenir.

---

## Cycle de développement

```bash
cd site
npm install        # installe svelte, vite, tailwindcss, d3…
npm run dev        # serveur de dev avec HMR (hot module reload)
npm run build      # compile en dist/ — prêt pour GitHub Pages
npm run preview    # prévisualise le build final localement
```

Le compilateur Svelte tourne silencieusement à chaque sauvegarde de `.svelte`. Tu codes, il compile, le navigateur se met à jour instantanément.

---

## Récap en une phrase

> Svelte est un compilateur qui transforme tes composants `.svelte` en JavaScript pur à la compilation — résultat : un bundle léger, pas de Virtual DOM, une réactivité chirurgicale.
