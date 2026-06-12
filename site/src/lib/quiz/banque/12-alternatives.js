export default [
  {
    id: '12-qcm-1',
    module: '12-alternatives',
    type: 'qcm',
    partie: 'qcm',
    points: 2,
    question: 'Quelle technologie de rendu utilise **Chart.js** ?',
    options: [
      'SVG',
      'WebGL',
      'Canvas',
      'DOM HTML pur',
    ],
    correct: 2,
    explication:
      'Chart.js utilise **Canvas** (pas SVG). Conséquence directe : impossible d\'accéder aux éléments individuels (barres, points) via le DOM. Pas d\'événements sur chaque barre comme avec D3.',
  },
  {
    id: '12-qcm-2',
    module: '12-alternatives',
    type: 'qcm',
    partie: 'qcm',
    points: 2,
    question: 'Vous devez afficher un dataset de **500 000 points géospatiaux** en temps réel dans le navigateur. Quel outil est le plus adapté ?',
    options: [
      'Observable Plot (construit sur SVG/D3)',
      'Chart.js (Canvas 2D)',
      'Deck.gl (WebGL2, seuil >100 000 points)',
      'D3.js avec `selectAll("circle")`',
    ],
    correct: 2,
    explication:
      '**Deck.gl** est conçu pour des datasets massifs (>100 000 points) via WebGL2. Il est développé par Uber / OpenJS Foundation et s\'intègre à MapLibre GL JS. SVG et Canvas 2D deviennent trop lents au-delà de ~10 000 éléments.',
  },
  {
    id: '12-qcm-3',
    module: '12-alternatives',
    type: 'qcm',
    partie: 'qcm',
    points: 2,
    question: '**Observable Plot** se distingue de D3.js principalement par :',
    options: [
      'Il utilise WebGL au lieu de SVG pour plus de performance',
      'Son API est **déclarative** : on décrit *quoi* afficher, pas *comment* le construire ; axes et légendes sont automatiques',
      'Il est exclusivement destiné aux notebooks Jupyter',
      'Il remplace complètement D3 dans tous les cas d\'usage',
    ],
    correct: 1,
    explication:
      'Observable Plot (créé par Mike Bostock, le même auteur que D3) propose une API **déclarative** haut niveau construite sur D3. On décrit les "marks" souhaitées, et Plot gère automatiquement les axes, échelles et légendes. Moins flexible que D3 pur pour les visualisations très personnalisées.',
  },
  {
    id: '12-qcm-4',
    module: '12-alternatives',
    type: 'qcm',
    partie: 'qcm',
    points: 2,
    question: '**Vega-Lite** est unique parmi les outils de visualisation car :',
    options: [
      'Il est le seul outil compatible avec React',
      'Il permet de décrire une visualisation en **JSON pur**, sans écrire de JavaScript',
      'Il génère du code D3 automatiquement à partir de données CSV',
      'Il ne fonctionne qu\'avec des données en temps réel',
    ],
    correct: 1,
    explication:
      '**Vega-Lite** permet de décrire une visualisation en **JSON pur** (données, encodage, rendu) — zéro JavaScript requis pour un graphique standard. Il existe un éditeur interactif en ligne. Attention : ne pas confondre Vega (grammaire complète) et Vega-Lite (version simplifiée qui compile vers Vega).',
  },
  {
    id: '12-qcm-5',
    module: '12-alternatives',
    type: 'qcm',
    partie: 'qcm',
    points: 2,
    question: 'Quel outil est le plus adapté pour créer une **visualisation artistique et générative** (art algorithmique, animation frame par frame) ?',
    options: [
      'Vega-Lite',
      'Chart.js',
      'p5.js',
      'Deck.gl',
    ],
    correct: 2,
    explication:
      '**p5.js** est l\'héritier de Processing (Java) et est conçu pour le **creative coding**. Il fonctionne en mode immédiat : tout est redessiné à chaque frame via `draw()`. Très utilisé pour l\'art génératif, les visualisations expérimentales et pédagogiques. Pas adapté aux interfaces web classiques avec DOM.',
  },
  {
    id: '12-vf-1',
    module: '12-alternatives',
    type: 'vrai-faux',
    partie: 'qcm',
    points: 2,
    question: 'SVG est la meilleure technologie de rendu pour afficher un nuage de 50 000 points interactifs dans le navigateur.',
    reponse: false,
    explication:
      'Faux : **SVG devient lent au-delà de ~10 000 éléments** car chaque forme est un nœud du DOM. Pour 50 000 points, il faut utiliser Canvas (Chart.js, p5.js) ou WebGL (Deck.gl, three.js). SVG reste idéal pour les visualisations interactives avec peu d\'éléments, grâce à l\'accessibilité et aux événements DOM.',
  },
  {
    id: '12-vf-2',
    module: '12-alternatives',
    type: 'vrai-faux',
    partie: 'qcm',
    points: 2,
    question: 'Maîtriser D3.js est inutile si on utilise Observable Plot ou Chart.js, car ces outils remplacent complètement D3.',
    reponse: false,
    explication:
      'Faux : maîtriser D3 permet de **comprendre les fondamentaux** (échelles, encodages, relation données→rendu) qui sont la base de tous ces outils. Observable Plot est construit sur D3. Les modules D3 (`d3-scale`, `d3-shape`, `d3-geo`) restent utiles dans n\'importe quel contexte. Comme dit dans le cours : "Maîtriser D3, c\'est apprendre à penser la visualisation."',
  },
]
