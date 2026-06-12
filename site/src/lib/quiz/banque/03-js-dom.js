export default [
  // --- QCM ---
  {
    id: '03-qcm-1',
    module: '03-js-dom',
    type: 'qcm',
    partie: 'qcm',
    points: 2,
    question: 'Quelle est l\'équivalence D3 de `document.querySelector("#chart")` ?',
    options: [
      '`d3.selectAll("#chart")`',
      '`d3.select("#chart")`',
      '`d3.find("#chart")`',
      '`d3.get("#chart")`',
    ],
    correct: 1,
    explication:
      '`d3.select("#chart")` sélectionne **un seul élément** (le premier correspondant au sélecteur CSS), tout comme `document.querySelector`. Pour plusieurs éléments, on utilise `d3.selectAll` (équivalent de `querySelectorAll`).',
  },
  {
    id: '03-qcm-2',
    module: '03-js-dom',
    type: 'qcm',
    partie: 'qcm',
    points: 2,
    question: 'Pourquoi utilise-t-on `function(event, d)` plutôt que `(event, d) =>` dans un handler D3 ?',
    code: 'barres.on("mouseover", function(event, d) {\n  d3.select(this).attr("fill", "orange")\n})',
    langage: 'js',
    options: [
      'Les arrow functions ne peuvent pas avoir deux paramètres',
      '`this` dans une arrow function ne pointe pas sur l\'élément DOM concerné',
      'D3 interdit les arrow functions dans les événements',
      'Il n\'y a aucune différence entre les deux syntaxes',
    ],
    correct: 1,
    explication:
      'Avec une arrow function `(event, d) =>`, `this` hérite du contexte lexical extérieur (souvent `window` ou `undefined`). Avec `function(event, d)`, `this` pointe sur **l\'élément DOM** qui a déclenché l\'événement - indispensable pour `d3.select(this)`.',
  },
  {
    id: '03-qcm-3',
    module: '03-js-dom',
    type: 'qcm',
    partie: 'qcm',
    points: 2,
    question: 'Comment D3 permet-il d\'enchaîner plusieurs modifications sur une sélection ?',
    code: 'select("svg")\n  .append("circle")\n  .attr("cx", 100)\n  .attr("r", 50)\n  .attr("fill", "steelblue")',
    langage: 'js',
    options: [
      'En utilisant des callbacks imbriqués',
      'Par le **method chaining** : chaque méthode retourne la sélection courante',
      'En passant un objet de configuration à `select()`',
      'D3 ne permet pas le chaînage, il faut stocker la sélection dans une variable',
    ],
    correct: 1,
    explication:
      'Le **method chaining** est un pattern clé de D3 : chaque méthode (`.attr()`, `.style()`, `.text()`, `.append()`) retourne la sélection courante, permettant d\'enchaîner les appels de façon lisible et compacte.',
  },
  {
    id: '03-qcm-4',
    module: '03-js-dom',
    type: 'qcm',
    partie: 'qcm',
    points: 2,
    question: 'Quelle méthode D3 faut-il utiliser pour **créer un élément SVG** `<circle>` dans le DOM ?',
    options: [
      '`document.createElement("circle")`',
      '`d3.create("circle")`',
      '`.append("circle")` sur une sélection D3',
      '`document.createElementNS("circle")`',
    ],
    correct: 2,
    explication:
      'D3 `.append("circle")` gère automatiquement le namespace SVG. En vanilla JS, il faudrait utiliser `document.createElementNS("http://www.w3.org/2000/svg", "circle")` - `document.createElement("circle")` crée un élément HTML invalide.',
  },
  {
    id: '03-qcm-5',
    module: '03-js-dom',
    type: 'qcm',
    partie: 'qcm',
    points: 2,
    question: 'Quelle est l\'équivalence D3 de `el.addEventListener("click", fn)` ?',
    options: [
      '`d3.listen("click", fn)`',
      '`selection.on("click", fn)`',
      '`selection.event("click", fn)`',
      '`selection.bind("click", fn)`',
    ],
    correct: 1,
    explication:
      '`selection.on("click", fn)` est l\'équivalent D3 de `addEventListener`. Il accepte les mêmes noms d\'événements DOM (`"click"`, `"mouseover"`, `"mouseout"`, etc.).',
  },

  // --- Vrai / Faux ---
  {
    id: '03-vf-1',
    module: '03-js-dom',
    type: 'vrai-faux',
    partie: 'd3',
    points: 2,
    question: 'Le SVG est dans le DOM - on peut donc le manipuler avec D3.js exactement comme du HTML classique.',
    reponse: true,
    explication:
      'Vrai. Le SVG est intégré directement dans le DOM HTML. D3 peut donc sélectionner, modifier et créer des éléments SVG avec les mêmes méthodes (`select`, `.attr()`, `.style()`, `.append()`) que pour le HTML.',
  },
  {
    id: '03-vf-2',
    module: '03-js-dom',
    type: 'vrai-faux',
    partie: 'd3',
    points: 2,
    question: 'Utiliser une arrow function dans `.on("click", (event, d) => { d3.select(this)... })` permet d\'accéder à l\'élément cliqué via `this`.',
    reponse: false,
    explication:
      'Faux. Avec une arrow function, `this` ne pointe **pas** sur l\'élément DOM - il hérite du contexte lexical extérieur. Pour utiliser `d3.select(this)`, il faut obligatoirement utiliser `function(event, d) { ... }`.',
  },
  {
    id: '03-vf-3',
    module: '03-js-dom',
    type: 'vrai-faux',
    partie: 'd3',
    points: 2,
    question: '`d3.select` et `d3.selectAll` acceptent des **sélecteurs CSS** (chaîne de caractères), pas des éléments DOM directement.',
    reponse: false,
    explication:
      'Faux en partie. `d3.select` et `d3.selectAll` acceptent **à la fois** des sélecteurs CSS (chaînes de caractères comme `"#chart"` ou `".bar"`) **et** des éléments DOM directement (ex. `d3.select(document.body)`).',
  },
  {
    id: '03-vf-4',
    module: '03-js-dom',
    type: 'vrai-faux',
    partie: 'd3',
    points: 2,
    question: 'D3 `.append("circle")` gère automatiquement le namespace SVG - pas besoin d\'utiliser `createElementNS`.',
    reponse: true,
    explication:
      'Vrai. D3 détecte le contexte parent (SVG ou HTML) et utilise automatiquement le bon namespace. En vanilla JS, créer un `<circle>` SVG nécessite `document.createElementNS("http://www.w3.org/2000/svg", "circle")`.',
  },
]
