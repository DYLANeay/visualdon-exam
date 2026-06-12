// Questions vrai/faux supplémentaires pour la partie 2 (D3.js) de l'examen.
// Réparties sur les modules 03 à 07 : sélections & data binding, échelles & axes,
// manipulation de données, interaction & animation.
export default [
  // ----- Sélections & data binding -----
  {
    id: 'd3x-1',
    module: '03-js-dom',
    type: 'vrai-faux',
    partie: 'd3',
    points: 2,
    question:
      '`d3.select("p")` sélectionne **tous** les paragraphes de la page.',
    reponse: false,
    explication:
      'Faux. `select` ne retient que le **premier** élément correspondant ; pour tous les éléments, il faut `selectAll("p")`.',
  },
  {
    id: 'd3x-2',
    module: '03-js-dom',
    type: 'vrai-faux',
    partie: 'd3',
    points: 2,
    question:
      'Les méthodes D3 comme `.attr()` et `.style()` retournent la sélection elle-même, ce qui permet le chaînage.',
    reponse: true,
    explication:
      'Vrai. Chaque méthode de modification retourne la sélection : on peut enchaîner `.attr(...).style(...).text(...)` sans répéter la sélection.',
  },
  {
    id: 'd3x-3',
    module: '03-js-dom',
    type: 'vrai-faux',
    partie: 'd3',
    points: 2,
    question:
      '`selection.append("circle")` ajoute un cercle comme **dernier enfant** de chaque élément de la sélection et retourne la nouvelle sélection des cercles créés.',
    reponse: true,
    explication:
      'Vrai. `.append()` insère en dernier enfant et retourne la sélection des éléments créés - c\'est pour cela que la suite de la chaîne s\'applique aux cercles, pas au parent.',
  },
  {
    id: 'd3x-4',
    module: '04-donnees',
    type: 'vrai-faux',
    partie: 'd3',
    points: 2,
    question:
      'Dans `selectAll("rect").data(data).join("rect")`, si `data` contient plus d\'éléments que de `<rect>` existants, D3 crée automatiquement les rectangles manquants.',
    reponse: true,
    explication:
      'Vrai. C\'est la phase **enter** : `.join()` crée les éléments manquants, met à jour les existants (update) et supprime les surplus (exit).',
  },
  {
    id: 'd3x-5',
    module: '04-donnees',
    type: 'vrai-faux',
    partie: 'd3',
    points: 2,
    question:
      'Dans `.attr("cx", (d, i) => i * 50)`, `d` est l\'index de l\'élément et `i` la donnée associée.',
    reponse: false,
    explication:
      'Faux. C\'est l\'inverse : le **premier** paramètre `d` est la donnée liée, le **second** `i` est l\'index (0, 1, 2…).',
  },
  {
    id: 'd3x-6',
    module: '04-donnees',
    type: 'vrai-faux',
    partie: 'd3',
    points: 2,
    question:
      '`d3.csv("fichier.csv")` retourne directement le tableau de données, qu\'on peut utiliser sans `await` ni `.then()`.',
    reponse: false,
    explication:
      'Faux. `d3.csv` est **asynchrone** et retourne une *promesse*. Il faut `await d3.csv(...)` ou `.then(data => ...)` pour accéder aux données.',
  },
  {
    id: 'd3x-7',
    module: '04-donnees',
    type: 'vrai-faux',
    partie: 'd3',
    points: 2,
    question:
      'Avec `d3.csv`, toutes les valeurs lues sont des **chaînes de caractères** : il faut les convertir (ex. `+d.population`) pour faire des calculs.',
    reponse: true,
    explication:
      'Vrai. Le CSV est du texte : sans conversion (`+`, `parseFloat`, fonction de rang passée à `d3.csv`), les nombres restent des chaînes.',
  },
  {
    id: 'd3x-8',
    module: '04-donnees',
    type: 'vrai-faux',
    partie: 'd3',
    points: 2,
    question:
      'La phase **exit** du data binding correspond aux éléments DOM qui n\'ont plus de donnée associée ; `.join()` les supprime automatiquement.',
    reponse: true,
    explication:
      'Vrai. Exit = éléments en trop par rapport aux données. Avec `.join()`, ils sont retirés du DOM sans qu\'on ait à appeler `.remove()` soi-même.',
  },
  // ----- Échelles & axes -----
  {
    id: 'd3x-9',
    module: '05-echelles-axes',
    type: 'vrai-faux',
    partie: 'd3',
    points: 2,
    question:
      'Dans une échelle D3, `.domain()` décrit l\'espace des **données** et `.range()` l\'espace de **sortie** (pixels, couleurs…).',
    reponse: true,
    explication:
      'Vrai. Une échelle est une fonction domaine → range : `scaleLinear().domain([0, 100]).range([0, 400])` transforme 50 en 200.',
  },
  {
    id: 'd3x-10',
    module: '05-echelles-axes',
    type: 'vrai-faux',
    partie: 'd3',
    points: 2,
    question:
      'Pour un axe vertical dont les valeurs croissent vers le **haut**, on écrit typiquement `.range([height, 0])` (range inversé).',
    reponse: true,
    explication:
      'Vrai. L\'origine SVG est en haut à gauche et y croît vers le bas ; inverser le range (`[height, 0]`) fait correspondre les grandes valeurs au haut du graphique.',
  },
  {
    id: 'd3x-11',
    module: '05-echelles-axes',
    type: 'vrai-faux',
    partie: 'd3',
    points: 2,
    question:
      '`d3.axisBottom(x)` dessine directement l\'axe dans le SVG dès son appel.',
    reponse: false,
    explication:
      'Faux. `axisBottom(x)` crée un **générateur** d\'axe ; il faut l\'appliquer à un groupe avec `svg.append("g").call(axisBottom(x))` pour le dessiner.',
  },
  {
    id: 'd3x-12',
    module: '05-echelles-axes',
    type: 'vrai-faux',
    partie: 'd3',
    points: 2,
    question:
      'Un axe généré par `axisBottom` se place automatiquement en bas du graphique, sans transformation.',
    reponse: false,
    explication:
      'Faux. `axisBottom` oriente seulement les graduations vers le bas ; l\'axe se dessine à y = 0. Il faut le positionner soi-même : `.attr("transform", "translate(0, " + height + ")")`.',
  },
  {
    id: 'd3x-13',
    module: '05-echelles-axes',
    type: 'vrai-faux',
    partie: 'd3',
    points: 2,
    question:
      'Une `scaleLinear` peut produire des **couleurs** : `.range(["white", "red"])` interpole entre les deux teintes.',
    reponse: true,
    explication:
      'Vrai. Le range n\'est pas limité aux nombres : D3 sait interpoler les couleurs, ce qui sert par exemple aux cartes choroplèthes.',
  },
  {
    id: 'd3x-14',
    module: '05-echelles-axes',
    type: 'vrai-faux',
    partie: 'd3',
    points: 2,
    question:
      'Avec `scaleBand`, `.padding(0.2)` réserve 20 % de chaque bande comme espace entre les barres.',
    reponse: true,
    explication:
      'Vrai. `padding` (entre 0 et 1) règle la proportion d\'espace vide entre les bandes ; `bandwidth()` s\'en trouve réduit d\'autant.',
  },
  // ----- Interaction & animation -----
  {
    id: 'd3x-15',
    module: '06-interaction-1',
    type: 'vrai-faux',
    partie: 'd3',
    points: 2,
    question:
      'Sans appel à `.duration()`, une transition D3 dure 1 seconde par défaut.',
    reponse: false,
    explication:
      'Faux. La durée par défaut d\'une transition est de **250 ms**. `.duration(1000)` permet de passer à 1 seconde.',
  },
  {
    id: 'd3x-16',
    module: '06-interaction-1',
    type: 'vrai-faux',
    partie: 'd3',
    points: 2,
    question:
      'Dans la chaîne `bars.transition().duration(800).attr("height", ...)`, seuls les `.attr()` placés **après** `.transition()` sont animés.',
    reponse: true,
    explication:
      'Vrai. `.transition()` marque le début de l\'animation : ce qui précède s\'applique instantanément, ce qui suit est interpolé.',
  },
  {
    id: 'd3x-17',
    module: '06-interaction-1',
    type: 'vrai-faux',
    partie: 'd3',
    points: 2,
    question:
      '`.ease()` modifie la **durée totale** d\'une transition.',
    reponse: false,
    explication:
      'Faux. L\'easing ne change pas la durée : il définit la **courbe d\'accélération** (linéaire, rebond, élastique…) à durée constante.',
  },
  {
    id: 'd3x-18',
    module: '07-interaction-2',
    type: 'vrai-faux',
    partie: 'd3',
    points: 2,
    question:
      'Avec `d3-zoom`, on applique habituellement `event.transform` au groupe `<g>` contenant les éléments, pas au `<svg>` lui-même.',
    reponse: true,
    explication:
      'Vrai. Transformer le SVG entier déplacerait aussi les axes et fausserait la capture des événements ; on transforme le groupe des éléments visuels.',
  },
  {
    id: 'd3x-19',
    module: '07-interaction-2',
    type: 'vrai-faux',
    partie: 'd3',
    points: 2,
    question:
      'L\'objet `event.transform` de `d3-zoom` contient trois propriétés : `x`, `y` (translation) et `k` (facteur d\'échelle).',
    reponse: true,
    explication:
      'Vrai. `x`/`y` décrivent le déplacement, `k` le niveau de zoom (1 = taille initiale, 2 = zoom ×2).',
  },
  {
    id: 'd3x-20',
    module: '07-interaction-2',
    type: 'vrai-faux',
    partie: 'd3',
    points: 2,
    question:
      'Pour attacher un comportement de zoom, on écrit `svg.call(zoomBehavior)` plutôt que `svg.on("zoom", ...)` directement.',
    reponse: true,
    explication:
      'Vrai. `.call(zoomBehavior)` laisse le comportement installer lui-même ses écouteurs (molette, drag, tactile) ; le gestionnaire se définit sur le comportement : `zoom().on("zoom", ...)`.',
  },
  {
    id: 'd3x-21',
    module: '07-interaction-2',
    type: 'vrai-faux',
    partie: 'd3',
    points: 2,
    question:
      '`setInterval(fn, 1000)` exécute `fn` une seule fois après 1 seconde.',
    reponse: false,
    explication:
      'Faux. `setInterval` exécute la fonction **à répétition** toutes les 1000 ms ; une exécution unique différée, c\'est `setTimeout`. On arrête un intervalle avec `clearInterval(id)`.',
  },
  {
    id: 'd3x-22',
    module: '06-interaction-1',
    type: 'vrai-faux',
    partie: 'd3',
    points: 2,
    question:
      '`.delay((d, i) => i * 100)` fait démarrer chaque élément 100 ms après le précédent, créant un effet de cascade.',
    reponse: true,
    explication:
      'Vrai. Le callback reçoit l\'index `i` : l\'élément 0 part à 0 ms, le 1 à 100 ms, etc. Une valeur fixe `.delay(100)` ferait partir tout le monde en même temps.',
  },
]
