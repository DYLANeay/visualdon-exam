export default [
  {
    id: '07-qcm-1',
    module: '07-interaction-2',
    type: 'qcm',
    partie: 'qcm',
    points: 2,
    question: 'Que contient `event.transform` lors d\'un événement zoom D3 ?',
    options: [
      'Le niveau de zoom uniquement (`k`)',
      'Les coordonnées de la souris (`x`, `y`)',
      'Les propriétés `{ x, y, k }` : décalages et facteur d\'échelle',
      'Un objet vide — la transformation est gérée automatiquement',
    ],
    correct: 2,
    explication:
      '`event.transform` contient `{ x, y, k }` : `x` et `y` sont les décalages (translation) et `k` est le facteur d\'échelle (1 = taille normale, 2 = zoomé ×2).',
  },
  {
    id: '07-qcm-2',
    module: '07-interaction-2',
    type: 'qcm',
    partie: 'qcm',
    points: 2,
    question: 'On veut limiter le zoom entre ×1 (taille normale) et ×8 (max). Quelle est la bonne syntaxe ?',
    options: [
      '`.scaleExtent(1, 8)`',
      '`.scaleExtent([1, 8])`',
      '`.zoomExtent([1, 8])`',
      '`.scale([1, 8])`',
    ],
    correct: 1,
    explication:
      '`.scaleExtent([min, max])` prend un **tableau** `[min, max]`. Avec `[1, 8]`, l\'utilisateur ne peut pas dézoomer en dessous de la taille initiale et peut zoomer jusqu\'à ×8.',
  },
  {
    id: '07-qcm-3',
    module: '07-interaction-2',
    type: 'qcm',
    partie: 'qcm',
    points: 2,
    question: 'Pourquoi applique-t-on `event.transform` au groupe `<g>` plutôt qu\'au SVG lui-même ?',
    options: [
      'Le SVG ne supporte pas l\'attribut `transform`',
      'Appliquer la transformation au SVG décalerait aussi les axes et marges — en ciblant le `<g>`, axes et marges restent fixes',
      'D3-zoom n\'autorise pas `.attr()` sur un SVG',
      'C\'est une convention stylistique sans effet fonctionnel',
    ],
    correct: 1,
    explication:
      'Si on applique `event.transform` au SVG entier, **les axes bougent aussi**. En l\'appliquant au groupe `<g>` qui contient seulement les éléments visuels, les axes restent ancrés en dehors du groupe.',
  },
  {
    id: '07-qcm-4',
    module: '07-interaction-2',
    type: 'qcm',
    partie: 'qcm',
    points: 2,
    question: 'Comment arrêter une animation lancée avec `setInterval` ?',
    options: [
      '`stopInterval(id)`',
      '`setInterval(null)`',
      '`clearInterval(id)`',
      '`cancelInterval(id)`',
    ],
    correct: 2,
    explication:
      '`clearInterval(id)` arrête l\'intervalle dont l\'identifiant `id` a été retourné par `setInterval(fn, ms)`. Oublier de l\'appeler crée une **fuite mémoire** et des comportements indésirables.',
  },
  {
    id: '07-vf-1',
    module: '07-interaction-2',
    type: 'vrai-faux',
    partie: 'd3',
    points: 2,
    question: 'Sans `.scaleExtent([1, ...])`, l\'utilisateur peut dézoomer jusqu\'à ce que la visualisation disparaisse ou s\'inverse.',
    reponse: true,
    explication:
      'Vrai : sans contrainte, le facteur `k` peut descendre en dessous de 1, ce qui dézoomente et peut rendre la visualisation microscopique. `.scaleExtent([1, maxZoom])` bloque le dézoom.',
  },
  {
    id: '07-vf-2',
    module: '07-interaction-2',
    type: 'vrai-faux',
    partie: 'd3',
    points: 2,
    question: 'On peut combiner `.transition()` avec les méthodes de zoom programmatique (`scaleBy`, `scaleTo`) pour animer le zoom par code.',
    reponse: true,
    explication:
      'Vrai : `svg.transition().call(zoomBehavior.scaleBy, 2)` zoom vers ×2 avec une animation fluide. Toutes les méthodes de zoom programmatique (`.scaleBy`, `.scaleTo`, `.translateBy`, `.transform`) acceptent `.transition()`.',
  },
  {
    id: '07-vf-3',
    module: '07-interaction-2',
    type: 'vrai-faux',
    partie: 'd3',
    points: 2,
    question: 'Dans un handler D3 `.on("mouseover", function(event, d) {...})`, remplacer `function` par une arrow function `(event, d) => {...}` ne change rien au comportement de `d3.select(this)`.',
    reponse: false,
    explication:
      'Faux : dans une **arrow function**, `this` ne pointe **pas** sur l\'élément DOM ciblé — il hérite du contexte lexical. `d3.select(this)` ne fonctionnera pas comme prévu. Il faut utiliser `function(event, d)` pour que `this` soit l\'élément cliqué/survolé.',
  },
  {
    id: '07-vf-4',
    module: '07-interaction-2',
    type: 'vrai-faux',
    partie: 'd3',
    points: 2,
    question: 'Dans un tooltip D3, on utilise `.html(...)` plutôt que `.text(...)` pour pouvoir insérer des balises HTML comme `<strong>` ou `<br>`.',
    reponse: true,
    explication:
      'Vrai : `.text()` échappe le HTML et affiche les balises comme du texte brut. `.html()` interprète le HTML, ce qui permet d\'utiliser `<strong>`, `<br>`, etc. dans le contenu du tooltip.',
  },
]
