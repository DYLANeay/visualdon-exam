export default {
  id: '12-alternatives',
  titre: 'Alternatives à D3.js',
  accroche:
    `D3 c'est la boîte à outils du chirurgien : puissant, précis, mais pas toujours le bon outil. Ce cours te donne la **carte de l'écosystème** pour choisir intelligemment - et comprendre pourquoi maîtriser D3 te rend meilleur·e avec *tous* les autres outils.`,

  sections: [
    {
      titre: 'Paysage de la visualisation de données',
      corps: `Le choix d'un outil de visualisation dépend de plusieurs critères. Avant de coder, pose-toi ces questions :

| Critère | Question clé |
|---------|--------------|
| **Complexité** | Graphique standard ou visualisation sur mesure ? |
| **Volume** | Dizaines ou millions de points ? |
| **Interactivité** | Statique, survol, ou exploration complète ? |
| **Rendu** | SVG (D3), Canvas (Chart.js, p5.js), ou WebGL (Deck.gl, three.js) ? |
| **Courbe d'apprentissage** | Prototype en une heure ou pièce de fond sur six semaines ? |

**SVG vs Canvas vs WebGL :**
- **SVG** : vectoriel, accessible, interactif avec le DOM, mais lent pour >10 000 éléments.
- **Canvas** : raster, performant pour des milliers de formes, pas d'éléments DOM individuels.
- **WebGL** : GPU, des *millions* de points en temps réel, mais complexité élevée.

D3 est la référence et la fondation sur laquelle d'autres outils sont construits - mais ce n'est pas toujours le bon choix.`,
    },
    {
      titre: 'Observable Plot et Chart.js : les alternatives haut niveau',
      corps: `**Observable Plot** est la réponse d'Mike Bostock (créateur de D3) à la demande d'un outil plus rapide à utiliser. Il est construit sur D3, mais son API est **déclarative** : tu décris *quoi* afficher, pas *comment* le construire.

- Gestion automatique des axes, échelles, légendes
- Idéal pour le prototypage rapide et les notebooks Observable
- Moins flexible que D3 pur pour les visualisations très personnalisées

---

**Chart.js** est simple, basé sur Canvas, avec 8 types de graphiques intégrés (bar, line, pie, scatter, radar, polar, bubble, doughnut). Prise en main rapide, documentation claire, animations intégrées. Limite : flexibilité réduite pour tout ce qui sort des sentiers battus.`,
      code: {
        langage: 'js',
        editable: true,
        source: `// Observable Plot - API déclarative
import * as Plot from '@observablehq/plot'

Plot.plot({
  marks: [
    Plot.barY(data, { x: 'category', y: 'value', fill: 'steelblue' }),
    Plot.ruleY([0])  // ligne de base à 0
  ]
})

// ---

// Chart.js - configuration par objet
import { Chart } from 'chart.js/auto'

new Chart(document.getElementById('myChart'), {
  type: 'bar',
  data: {
    labels: ['Jan', 'Fév', 'Mar', 'Avr'],
    datasets: [{
      label: 'Ventes',
      data: [12, 19, 3, 17],
      backgroundColor: 'steelblue'
    }]
  },
  options: {
    scales: { y: { beginAtZero: true } }
  }
})`,
      },
    },
    {
      titre: 'Vega / Vega-Lite : la grammaire déclarative',
      corps: `**Vega-Lite** pousse encore plus loin la séparation entre données, encodage et rendu. La visualisation est décrite en **JSON pur** - zéro JavaScript nécessaire pour un graphique standard.

- Séparation complète : données, transformations, encodage, rendu
- Éditeur interactif en ligne (Vega Editor)
- Excellente documentation et galerie d'exemples
- Moins adapté aux visualisations très personnalisées ou aux animations complexes

**Quand l'utiliser :** outils no-code, applications où l'utilisateur définit la visualisation, contextes où la reproductibilité JSON est importante.`,
      code: {
        langage: 'js',
        editable: false,
        source: `// Vega-Lite : spécification JSON complète
{
  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
  "data": { "url": "data.csv" },
  "mark": "bar",
  "encoding": {
    "x": { "field": "category", "type": "nominal", "sort": "-y" },
    "y": { "field": "value",    "type": "quantitative" },
    "color": { "field": "group", "type": "nominal" }
  }
}`,
      },
    },
    {
      titre: 'Au-delà des graphiques 2D : p5.js, three.js, Deck.gl',
      corps: `Quand la visualisation devient de l'**art génératif** ou de la **donnée immersive**, d'autres outils entrent en jeu.

**p5.js** - creative coding, Canvas, art génératif :
- Héritier de Processing (Java)
- Mode immédiat : redessine tout à chaque frame (\`draw()\`)
- Idéal pour les visualisations artistiques, expérimentales, pédagogiques
- Grande communauté, beaucoup de tutoriels

**three.js** - graphiques 3D, WebGL :
- Scènes, caméras, lumières, matériaux dans le navigateur
- Courbe d'apprentissage significative
- Cas d'usage en visualisation : globes interactifs, nuages de points 3D, terrain géospatial en relief, visualisations architecturales

**Deck.gl** - données massives, WebGL2, focus géospatial :
- Développé par Uber / OpenJS Foundation
- Rendu de *millions* de points en temps réel
- Couches : \`ScatterplotLayer\`, \`ArcLayer\`, \`HexagonLayer\`, \`HeatmapLayer\`, \`TripsLayer\`
- S'intègre à MapLibre GL JS
- Quand l'utiliser : datasets >100 000 points, visualisations géospatiales complexes

**roughViz.js** - style "dessin à la main" :
- Construit sur rough.js + D3
- Esthétique croquis/sketch
- Idéal pour des présentations informelles ou pédagogiques
- *Pas adapté* aux données sérieuses ou officielles`,
      code: {
        langage: 'js',
        editable: false,
        source: `// p5.js : ellipse qui suit la souris
function setup() {
  createCanvas(400, 400)
}
function draw() {
  background(220)
  fill('steelblue')
  ellipse(mouseX, mouseY, 50, 50)
}

// ---

// roughViz.js : bar chart façon croquis
new roughViz.Bar({
  element: '#chart',
  data: { labels: ['A', 'B', 'C'], values: [10, 20, 30] },
  roughness: 2,
  color: 'skyblue',
  stroke: 'black'
})`,
      },
    },
    {
      titre: 'Frameworks frontend + D3 et bilan',
      corps: `Une approche de plus en plus répandue chez les équipes data (The Pudding, Reuters Graphics, NYT) consiste à **combiner D3 avec un framework réactif** (React, Vue, Svelte, Angular).

**Principe :** D3 calcule, le framework affiche.
- Le **framework** gère le DOM, la réactivité et les transitions
- **D3** gère les données : échelles, générateurs, formats, projections
- Plus besoin de \`d3.select()\` ni \`.join()\` - le template JSX/Svelte s'en charge

**Pourquoi D3 reste utile même si tu n'utilises pas son DOM ?** Parce que \`d3-scale\`, \`d3-shape\`, \`d3-format\`, \`d3-geo\` sont des modules indépendants, utilisables dans n'importe quel contexte.

---

**Bilan du cours : l'outil au service de l'intention**

La vraie question n'est pas *"quel est le meilleur outil ?"* mais *"quelle expérience est-ce que je veux créer ?"*

| Expérience visée | Implication |
|-----------------|-------------|
| **Exploration** | Le lecteur navigue librement, découvre à son rythme |
| **Narration** | Le lecteur est guidé à travers une histoire |
| **Immersion** | Le lecteur est plongé dans les données, les ressent |

**Maîtriser D3, c'est apprendre à penser la visualisation :** comprendre les échelles, les encodages, la relation données→rendu. Avec ces bases, tu peux lire la doc de n'importe quel outil, débugger Chart.js ou Vega, et choisir *en connaissance de cause*.`,
    },
  ],

  essentiel: [
    `**Observable Plot** = API déclarative haut niveau construite sur D3. Axes/légendes automatiques. Idéal pour prototypage et notebooks.`,
    `**Chart.js** = Canvas, 8 types de graphiques, prise en main rapide, animations intégrées. Limite : peu flexible pour les visu non standard.`,
    `**Vega-Lite** = spécification JSON pure. Séparation totale données / encodage / rendu. Éditeur interactif en ligne.`,
    `**Rendu** : SVG (D3) pour <10k éléments interactifs · Canvas (Chart.js, p5.js) pour des milliers de formes · WebGL (Deck.gl, three.js) pour des millions de points.`,
    `**Deck.gl** = WebGL haute performance (Uber/OpenJS). Couches : ScatterplotLayer, ArcLayer, HexagonLayer. S'intègre à MapLibre. Seuil : >100k points.`,
    `**Frameworks + D3** : le framework gère le DOM/réactivité, D3 gère les calculs (scales, shapes, projections). Approche NYT / Reuters Graphics.`,
  ],

  pieges: [
    `Chart.js utilise **Canvas** (pas SVG) : impossible d'accéder aux éléments individuels via le DOM. Pas d'événements sur chaque barre comme avec D3.`,
    `**Observable Plot** n'est pas D3 : il cache la complexité. Si tu as besoin de contrôle fin (animation custom, layout non standard), reviens à D3.`,
    `Ne pas confondre **Vega** (grammaire complète) et **Vega-Lite** (version simplifiée). Vega-Lite compile vers Vega, pas l'inverse.`,
    `**p5.js** redessine tout à chaque frame (\`draw()\`) - pas adapté aux interfaces web classiques avec DOM. C'est du mode immédiat, pas du mode retenu.`,
  ],

  patterns: [
    {
      titre: 'Observable Plot : scatter plot avec couleur par groupe',
      code: `import * as Plot from '@observablehq/plot'

Plot.plot({
  color: { legend: true },
  marks: [
    Plot.dot(data, {
      x: 'gdp',
      y: 'lifeExpectancy',
      r: 'population',         // taille des points
      fill: 'continent',       // couleur par catégorie
      tip: true                // tooltip automatique
    }),
    Plot.ruleY([0])
  ]
})`,
    },
    {
      titre: 'Chart.js : graphique en ligne avec options',
      code: `import { Chart } from 'chart.js/auto'

new Chart(ctx, {
  type: 'line',
  data: {
    labels: ['2020', '2021', '2022', '2023'],
    datasets: [{
      label: 'Température moyenne (°C)',
      data: [14.2, 15.1, 14.8, 16.3],
      borderColor: '#E92528',
      tension: 0.3,
      fill: false
    }]
  },
  options: {
    scales: {
      y: { beginAtZero: false, title: { display: true, text: '°C' } }
    },
    plugins: {
      tooltip: { mode: 'index' }
    }
  }
})`,
    },
  ],
}
