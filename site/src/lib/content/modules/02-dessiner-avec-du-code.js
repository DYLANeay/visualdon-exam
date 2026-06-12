export default {
  id: "02-dessiner-avec-du-code",
  titre: "Dessiner avec du code",
  accroche:
    "Avant les ordinateurs, la dataviz se dessinait à la main. Aujourd'hui on code — mais la question reste la même : **quelle forme donner à cette donnée ?**",

  sections: [
    {
      titre: "La main comme point de départ",
      corps: `La visualisation de données a été inventée bien avant les ordinateurs. Nightingale, Du Bois, Tufte, Minard — tous dessinaient à la main. Et aujourd'hui encore, des artistes comme **Giorgia Lupi**, **Federica Fragapane** ou **Mona Chalabi** (The Guardian) travaillent au crayon.

Pourquoi cette insistance sur la main dans un cours de code ?

**Dessiner à la main force à penser** : quelles variables ? quel encodage visuel ? quelle échelle ? C'est une décision, pas un clic.

L'esquisse rapide (30 secondes) permet d'**itérer sans coût** — effacer un crayon coûte moins cher que refactorer du code. La main révèle les **décisions implicites** que le code cache : axes, proportions, hiérarchie.

Edward Tufte : *"Above all else show the data."*

**Règle d'or** : avant d'écrire du code, pose-toi — crayon en main — *quelle forme devrait prendre cette donnée ?*`,
    },
    {
      titre: "SVG : le vectoriel dans le navigateur",
      corps: `**SVG** (Scalable Vector Graphics) est un format d'image vectoriel intégré directement dans le HTML. Contrairement au PNG ou JPG (images matricielles, grilles de pixels fixes), SVG décrit des **formes mathématiques** — courbes, rayons, points.

**Vectoriel vs Matriciel** :
- **Matriciel** (PNG, JPG, Canvas) : grille de pixels. Zoomer → pixelisation visible.
- **Vectoriel** (SVG) : formes recalculées à la volée. Zoomer → **toujours net**.
- SVG est **résolution-indépendant** : parfait pour écrans Retina, exports PDF, impressions.

**Le système de coordonnées SVG** — important à retenir :
- L'origine \`(0, 0)\` est en **haut à gauche**
- \`x\` croît vers la **droite**, \`y\` croît vers le **bas**
- C'est l'inverse du repère mathématique scolaire — pense à une page imprimée, pas à un graphe de maths.
- SVG et Canvas partagent ce même repère.`,
      code: {
        langage: "svg",
        editable: true,
        source: `<svg width="280" height="190">

  <rect x="10" y="10"
        width="80" height="50"
        fill="steelblue" rx="4" />

  <circle cx="200" cy="45" r="40"
          fill="coral" />

  <polygon
    points="10,180 60,110 110,180"
    fill="#4caf50" />

  <line x1="140" y1="110"
        x2="270" y2="180"
        stroke="#333" stroke-width="2" />

</svg>`,
      },
    },
    {
      titre: "SVG : styles, chemins et groupes",
      corps: `**Attributs de style** communs :
- \`fill\` — couleur de remplissage (\`fill="none"\` pour contour seul)
- \`stroke\` — couleur du contour
- \`stroke-width\` — épaisseur du contour
- \`opacity\` — transparence globale (0–1)
- \`fill-opacity\` — transparence du remplissage seulement
- \`stroke-dasharray\` — contour en tirets

**L'élément \`<path>\`** est le plus puissant de SVG — D3.js l'utilise pour les arcs, courbes et formes complexes. Il se pilote avec des commandes :
- \`M x y\` — **Move to** : déplace le curseur sans tracer
- \`L x y\` — **Line to** : trace une ligne droite
- \`H x\` — **Horizontal line**
- \`V y\` — **Vertical line**
- \`Z\` — **Close path** : ferme le chemin vers le départ

**Les groupes \`<g>\`** regroupent des éléments. Les attributs et transformations s'héritent. Les transformations disponibles : \`translate(x, y)\`, \`rotate(deg)\`, \`scale(factor)\`.`,
      code: {
        langage: "svg",
        editable: true,
        source: `<svg width="240" height="180">

  <!-- Groupe avec attributs partagés -->
  <g fill="steelblue" stroke="#333" stroke-width="1">
    <rect x="10" y="10" width="50" height="50" />
    <rect x="70" y="10" width="50" height="50" />
  </g>

  <!-- Path : triangle avec commandes -->
  <path d="M 10 150 L 60 100 H 110 Z"
        fill="coral" />

  <!-- Groupe translaté -->
  <g transform="translate(160, 80) rotate(30)">
    <rect x="-25" y="-20" width="50" height="40"
          fill="#4caf50" rx="4"/>
  </g>

</svg>`,
      },
    },
    {
      titre: "HTML Canvas : le mode impératif",
      corps: `**Canvas** est une alternative à SVG : au lieu de déclarer des formes dans le DOM, on **donne des instructions** à un contexte 2D — comme peindre sur une toile.

Différences clés avec SVG :
- Les formes **ne restent pas dans le DOM** : une fois dessinées, ce ne sont que des pixels.
- **Très performant** pour les animations haute fréquence et les grands volumes de données (> 10 000 éléments).
- Interactivité manuelle (pas d'événements natifs sur les formes).

Chaque forme nécessite explicitement \`beginPath()\` puis \`fill()\` ou \`stroke()\`.`,
      code: {
        langage: "js",
        editable: true,
        source: `const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')

// Rectangle
ctx.fillStyle = 'steelblue'
ctx.fillRect(10, 10, 80, 50)

// Cercle
ctx.fillStyle = 'coral'
ctx.beginPath()
ctx.arc(200, 45, 40, 0, Math.PI * 2)
ctx.fill()

// Triangle (chemin libre)
ctx.fillStyle = '#4caf50'
ctx.beginPath()
ctx.moveTo(10, 180)
ctx.lineTo(60, 110)
ctx.lineTo(110, 180)
ctx.fill()`,
      },
    },
    {
      titre: "SVG vs Canvas : lequel choisir ?",
      corps: `| Critère | SVG | Canvas |
|---------|:---:|:------:|
| **Paradigme** | Déclaratif | Impératif |
| **Type de rendu** | Vectoriel (DOM) | Bitmap (pixels) |
| **Accès DOM** | ✓ | ✗ |
| **Interactivité native** | ✓ CSS + events | ✗ manuel |
| **Perf. > 10k éléments** | ✗ | ✓ |
| **Zoom sans perte** | ✓ | ✗ |
| **Courbe d'apprentissage** | Faible | Moyenne |
| **Idéal pour** | Dataviz, D3.js | Temps réel, jeux |

**→ SVG** si tu veux utiliser **D3.js**, interagir avec les formes (hover, clic, tooltip), produire des graphiques scalables et accessibles.

**→ Canvas** si tu travailles avec **de gros volumes** (> 10 000 éléments), des animations haute fréquence, ou du rendu WebGL.

**Dans ce cours → SVG + D3.js** : la dataviz web s'appuie sur SVG pour ses capacités de liaison données–DOM.`,
    },
  ],

  essentiel: [
    "SVG = **vectoriel déclaratif** dans le DOM : formes scalables, interactives, modifiables par JS/CSS.",
    "Système de coordonnées SVG : origine **(0,0) en haut à gauche**, x → droite, y → **bas** (inverse du repère mathématique).",
    "Formes SVG de base : `<rect>`, `<circle>`, `<line>`, `<polygon>`, `<path>`. Groupes : `<g>` avec héritage des attributs et `transform`.",
    "`<path>` : commandes `M` (move), `L` (line), `H` (horizontal), `V` (vertical), `Z` (close) — utilisé par D3 pour arcs et courbes.",
    "Canvas = **bitmap impératif** hors DOM : performant pour > 10 000 éléments, mais pas d'interactivité native.",
    "Choix du cours : **SVG + D3.js** pour la liaison données–DOM et l'interactivité.",
  ],

  pieges: [
    "L'axe Y du SVG pointe vers le **bas** : y=0 est en haut. Un rectangle `y=10` est près du haut, pas du bas.",
    "Confondre SVG (déclaratif, DOM) et Canvas (impératif, pixels) : une forme Canvas ne peut pas être sélectionnée ou écoutée directement.",
    "Oublier `beginPath()` en Canvas : sans lui, les anciens chemins se cumulent et le rendu est faux.",
    "`fill=\"none\"` en SVG donne un contour seul (pas de remplissage) — `fill` par défaut est **noir**, pas transparent.",
  ],

  patterns: [
    {
      titre: "Bar chart minimal en SVG",
      code: `<svg width="260" height="160">
  <!-- données : [40, 80, 60, 90] -->
  <rect x="20"  y="100" width="40" height="40" fill="steelblue"/>
  <rect x="75"  y="60"  width="40" height="80" fill="steelblue"/>
  <rect x="130" y="80"  width="40" height="60" fill="steelblue"/>
  <rect x="185" y="50"  width="40" height="90" fill="steelblue"/>
</svg>`,
    },
    {
      titre: "Groupe translaté (convention D3)",
      code: `<svg width="400" height="300">
  <!-- toute la viz est dans un <g> décalé des marges -->
  <g transform="translate(50, 20)">
    <!-- ici, x=0 correspond à margin.left dans l'espace visuel -->
    <rect x="0" y="0" width="50" height="100" fill="steelblue"/>
  </g>
</svg>`,
    },
  ],
}
