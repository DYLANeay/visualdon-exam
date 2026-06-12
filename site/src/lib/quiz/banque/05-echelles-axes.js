export default [
  {
    id: '05-qcm-1',
    module: '05-echelles-axes',
    type: 'qcm',
    partie: 'qcm',
    points: 2,
    question: 'Quelle est la différence entre `scaleLinear` et `scaleBand` ?',
    options: [
      '`scaleLinear` est pour les couleurs, `scaleBand` pour les tailles',
      '`scaleLinear` mappe des valeurs continues, `scaleBand` divise l’espace en catégories discrètes',
      '`scaleBand` est plus précise que `scaleLinear`',
      'Il n’y a aucune différence fonctionnelle',
    ],
    correct: 1,
    explication:
      '`scaleLinear` transforme un domaine **continu** en pixels ; `scaleBand` répartit des **catégories** en bandes égales (idéal pour les bar charts).',
  },
  {
    id: '05-qcm-2',
    module: '05-echelles-axes',
    type: 'qcm',
    partie: 'qcm',
    points: 2,
    question: 'À quoi sert `x.bandwidth()` sur une échelle `scaleBand` ?',
    options: [
      'À connaître la largeur d’une bande (barre)',
      'À retourner le nombre de catégories',
      'À régler l’espacement entre les barres',
      'À convertir une valeur en pixel',
    ],
    correct: 0,
    explication:
      '`bandwidth()` renvoie la largeur calculée d’une bande, une fois le range et le padding répartis entre les catégories.',
  },
  {
    id: '05-vf-1',
    module: '05-echelles-axes',
    type: 'vrai-faux',
    partie: 'd3',
    points: 2,
    question:
      'Pour un axe Y orienté classiquement, le `range` de `yScale` est `[height, 0]`.',
    reponse: true,
    explication:
      'Vrai : l’axe Y du SVG pointe vers le bas (Y=0 en haut). On inverse donc le range pour que les grandes valeurs soient en haut.',
  },
  {
    id: '05-vf-2',
    module: '05-echelles-axes',
    type: 'vrai-faux',
    partie: 'd3',
    points: 2,
    question:
      'Passer `.padding(0.25)` à `.padding(0.7)` sur un `scaleBand` rend les barres plus larges.',
    reponse: false,
    explication:
      'Faux : un padding plus grand laisse **plus d’espace entre** les barres, donc des barres **plus fines**.',
  },
]
