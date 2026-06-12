export default {
  id: "03-js-dom",
  titre: "JavaScript et manipulation DOM",
  accroche:
    "Le SVG est dans le DOM — et D3.js est l'**interprète** qui relie tes données à chaque forme. Apprendre D3, c'est apprendre à parler aux éléments de ta page.",

  sections: [
    {
      titre: "Le DOM : l'arbre de ta page",
      corps: `**DOM** = Document Object Model. Le navigateur représente la page HTML (et SVG) comme un **arbre d'objets** que JavaScript peut lire et modifier à la volée.

- Chaque balise = un **nœud** (\`Element\`)
- Chaque attribut = une **propriété** de ce nœud
- JavaScript peut ajouter, modifier ou supprimer des nœuds en temps réel

Le SVG est **dans le DOM** → on peut le manipuler exactement comme du HTML classique. C'est ce qui le rend si puissant pour la dataviz interactive.

\`\`\`
document
└── <html>
    └── <body>
        └── <svg>
            ├── <rect />
            ├── <circle />
            └── <g>
                └── <text />
\`\`\`

Quand D3 crée un cercle, il ajoute littéralement un \`<circle>\` dans cet arbre — et le navigateur l'affiche immédiatement.`,
    },
    {
      titre: "D3.js : Data-Driven Documents",
      corps: `**D3.js** (Data-Driven Documents) est la bibliothèque JavaScript de référence pour créer des visualisations interactives. Elle lie des **données** à des **éléments du DOM**.

- Créée par **Mike Bostock** en 2011, maintenue par **Observable**
- Produit des visualisations en **SVG**, HTML ou Canvas
- **Modulaire** : on installe uniquement les modules nécessaires

Le module de base pour ce cours : \`d3-selection\`.

\`\`\`bash
npm install d3-selection
\`\`\`

\`\`\`javascript
import { select, selectAll } from 'd3-selection'
\`\`\`

D3 va bien au-delà de la sélection — voici les modules clés pour la suite du cours :

| Module | Rôle | Cours |
|--------|------|-------|
| \`d3-scale\` | Convertir données → pixels / couleurs | 05 |
| \`d3-axis\` | Générer des axes | 05 |
| \`d3-shape\` | Générateurs de chemins (line, area, arc) | 06 |
| \`d3-fetch\` | Charger des fichiers CSV, JSON | 04 |
| \`d3-array\` | Statistiques (mean, extent, group…) | 04 |`,
    },
    {
      titre: "Sélectionner et modifier des éléments",
      corps: `D3 propose une API plus concise que le JavaScript vanilla pour sélectionner et modifier des éléments.

**Sélection** :
- \`document.querySelector\` → \`select\`
- \`document.querySelectorAll\` → \`selectAll\`
- Mêmes sélecteurs CSS qu'en JS vanilla

**Modification** :
- \`.setAttribute()\` → \`.attr()\`
- \`.style.prop\` → \`.style()\`
- \`.textContent\` → \`.text()\`

**Création** :
- Vanilla JS nécessite \`createElementNS\` avec le namespace SVG
- D3 : \`.append()\` gère le namespace automatiquement

**Method chaining** : chaque méthode D3 retourne la sélection courante, ce qui permet d'enchaîner les appels de façon lisible et compacte. Pattern courant dans les bibliothèques JS (jQuery, Lodash…).`,
      code: {
        langage: "js",
        editable: true,
        source: `import { select } from 'd3-selection'

// Sélectionner
const svg = select('#chart')

// Créer + modifier en chaîne
select('svg')
  .append('circle')
  .attr('cx', 100)
  .attr('cy', 100)
  .attr('r', 50)
  .attr('fill', 'steelblue')
  .style('opacity', 0.8)`,
      },
    },
    {
      titre: "Gérer les événements",
      corps: `D3 simplifie aussi l'écoute des événements avec \`.on()\` — équivalent de \`addEventListener\`.

**Point crucial** : dans le callback, utilise \`function(event)\` (et non une arrow function \`=>\`) si tu veux accéder à l'élément via \`select(this)\`. Avec une arrow function, \`this\` ne pointe plus sur l'élément DOM.

Vanilla JS :
\`\`\`javascript
cercle.addEventListener('click', function(event) {
  cercle.setAttribute('fill', 'green')
})
\`\`\`

D3 :
\`\`\`javascript
select('circle')
  .on('click', function(event) {
    select(this).attr('fill', 'green')
  })
\`\`\``,
      code: {
        langage: "js",
        editable: true,
        source: `import { select } from 'd3-selection'

select('circle')
  .on('click', function(event) {
    select(this).attr('fill', 'green')
  })
  .on('mouseover', function(event) {
    select(this).style('opacity', 0.5)
  })
  .on('mouseout', function(event) {
    select(this).style('opacity', 1)
  })`,
      },
    },
    {
      titre: "Vanilla JS vs D3 : comparaison côte à côte",
      corps: `Pour bien comprendre ce que D3 apporte, voici les équivalences entre JavaScript natif et D3 :

| Action | Vanilla JS | D3 |
|--------|-----------|-----|
| Sélectionner 1 élément | \`document.querySelector('#id')\` | \`select('#id')\` |
| Sélectionner N éléments | \`document.querySelectorAll('.classe')\` | \`selectAll('.classe')\` |
| Modifier un attribut | \`el.setAttribute('fill', 'red')\` | \`.attr('fill', 'red')\` |
| Modifier un style | \`el.style.opacity = 0.5\` | \`.style('opacity', 0.5)\` |
| Changer le texte | \`el.textContent = 'Bonjour'\` | \`.text('Bonjour')\` |
| Créer un élément SVG | \`createElementNS(NS, 'circle')\` puis \`appendChild\` | \`.append('circle')\` |
| Écouter un événement | \`el.addEventListener('click', fn)\` | \`.on('click', fn)\` |

La grande force de D3 n'est pas seulement la concision — c'est le **chaînage** et surtout la **liaison données–DOM** (join) que l'on verra dans les modules suivants.`,
    },
  ],

  essentiel: [
    "Le **DOM** est l'arbre d'objets que le navigateur construit depuis le HTML — SVG inclus — et que JS peut modifier à la volée.",
    "**D3.js** lie des données à des éléments du DOM. Module de base : `d3-selection` — `select` (1 élément) et `selectAll` (N éléments).",
    "**Method chaining** : chaque méthode D3 retourne la sélection → on enchaîne `.attr()`, `.style()`, `.text()`, `.append()`, `.on()`.",
    "Équivalences clés : `querySelector` → `select` · `setAttribute` → `.attr()` · `addEventListener` → `.on()`.",
    "Pour créer un élément SVG en vanilla JS il faut `createElementNS` ; D3 `.append()` gère le namespace automatiquement.",
    "Dans `.on()`, utilise `function(event)` (pas arrow function) pour accéder à l'élément via `select(this)`.",
  ],

  pieges: [
    "Utiliser une **arrow function** dans `.on()` casse `select(this)` : `this` ne pointe plus sur l'élément DOM mais sur le contexte extérieur.",
    "En vanilla JS, créer un élément SVG avec `document.createElement` (sans namespace) produit un élément HTML invalide — il faut `createElementNS(\"http://www.w3.org/2000/svg\", \"circle\")`.",
    "`select` et `selectAll` prennent des **sélecteurs CSS** (chaîne de caractères) — pas des éléments DOM directement.",
  ],

  patterns: [
    {
      titre: "Créer un SVG et y ajouter un cercle avec D3",
      code: `import { select } from 'd3-selection'

const svg = select('#chart')
  .append('svg')
  .attr('width', 400)
  .attr('height', 300)

svg.append('circle')
  .attr('cx', 200)
  .attr('cy', 150)
  .attr('r', 60)
  .attr('fill', 'steelblue')`,
    },
    {
      titre: "Événements hover sur un élément D3",
      code: `import { select } from 'd3-selection'

select('circle')
  .on('mouseover', function(event) {
    select(this)
      .attr('fill', 'orange')
      .attr('r', 70)
  })
  .on('mouseout', function(event) {
    select(this)
      .attr('fill', 'steelblue')
      .attr('r', 60)
  })`,
    },
  ],
}
