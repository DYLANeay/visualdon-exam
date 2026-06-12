export default [
  // --- QCM ---
  {
    id: '02-qcm-1',
    module: '02-dessiner-avec-du-code',
    type: 'qcm',
    partie: 'qcm',
    points: 2,
    question: 'Que dessine ce code SVG ?',
    code: '<rect x="20" y="40" width="60" height="60" fill="orange" stroke="black" stroke-width="2"/>',
    langage: 'svg',
    options: [
      'Un rectangle orange de 60x60px avec contour noir, coin supérieur gauche à (20, 40)',
      'Un rectangle orange de 60x60px centré en (20, 40)',
      'Un carré noir de 60px de côté',
      'Une erreur : un carré doit utiliser `<square>` en SVG',
    ],
    correct: 0,
    explication:
      'En SVG, `x` et `y` définissent le **coin supérieur gauche** de la forme. Le rectangle est donc positionné avec son coin en (20, 40), mesure 60×60px, avec un remplissage orange et un contour noir de 2px.',
  },
  {
    id: '02-qcm-2',
    module: '02-dessiner-avec-du-code',
    type: 'qcm',
    partie: 'qcm',
    points: 2,
    question: 'Dans le système de coordonnées SVG, où se trouve l\'origine `(0, 0)` et dans quel sens croît l\'axe Y ?',
    options: [
      'En bas à gauche, Y croît vers le haut (comme en maths)',
      'En haut à gauche, Y croît vers le bas',
      'Au centre du canvas, Y croît vers le bas',
      'En haut à droite, Y croît vers la gauche',
    ],
    correct: 1,
    explication:
      'L\'origine SVG est en **haut à gauche**. L\'axe Y pointe vers le **bas** — c\'est l\'inverse du repère mathématique classique. Un élément avec `y=10` est donc près du haut, pas du bas.',
  },
  {
    id: '02-qcm-3',
    module: '02-dessiner-avec-du-code',
    type: 'qcm',
    partie: 'qcm',
    points: 2,
    question: 'Quelle est la commande `<path>` pour **fermer** un chemin SVG (rejoindre le dernier point au point de départ) ?',
    options: [
      '`F`',
      '`E`',
      '`Z`',
      '`C`',
    ],
    correct: 2,
    explication:
      'La commande `Z` (**Close path**) ferme le chemin en traçant une ligne droite du point courant vers le point de départ défini par le dernier `M`. Les autres commandes : `M` = move, `L` = line, `H` = horizontal, `V` = vertical.',
  },
  {
    id: '02-qcm-4',
    module: '02-dessiner-avec-du-code',
    type: 'qcm',
    partie: 'qcm',
    points: 2,
    question: 'Quelle est la **principale différence** entre SVG et Canvas pour la dataviz interactive ?',
    options: [
      'SVG est plus rapide que Canvas pour tous les cas d\'usage',
      'Canvas permet de zoomer sans perte de qualité, SVG non',
      'SVG est dans le DOM (interactivité native), Canvas est bitmap (pixels, pas d\'événements natifs sur les formes)',
      'SVG ne supporte pas les couleurs, Canvas si',
    ],
    correct: 2,
    explication:
      'SVG est **déclaratif et dans le DOM** : chaque forme est un élément manipulable par JS/CSS, avec des événements natifs (click, hover). Canvas est **impératif et bitmap** : les formes sont des pixels, sans accès DOM ni interactivité native.',
  },
  {
    id: '02-qcm-5',
    module: '02-dessiner-avec-du-code',
    type: 'qcm',
    partie: 'qcm',
    points: 2,
    question: 'Dans quels cas est-il préférable d\'utiliser **Canvas** plutôt que SVG ?',
    options: [
      'Quand on veut utiliser D3.js',
      'Quand on a besoin d\'interactivité CSS native',
      'Quand on affiche plus de 10 000 éléments ou des animations haute fréquence',
      'Quand on veut que le graphique soit scalable sans perte de qualité',
    ],
    correct: 2,
    explication:
      'Canvas est conseillé pour les **grands volumes** (> 10 000 éléments) et les **animations haute fréquence** car il est très performant — les formes ne sont que des pixels et le navigateur n\'a pas à gérer un DOM lourd.',
  },

  // --- Vrai / Faux ---
  {
    id: '02-vf-1',
    module: '02-dessiner-avec-du-code',
    type: 'vrai-faux',
    partie: 'd3',
    points: 2,
    question: 'En SVG, `fill="none"` est équivalent à omettre l\'attribut `fill` : dans les deux cas, la forme n\'a pas de remplissage.',
    reponse: false,
    explication:
      'Faux. Sans attribut `fill`, la valeur par défaut est **noir** (`fill="black"`). `fill="none"` supprime explicitement le remplissage pour n\'afficher que le contour (`stroke`).',
  },
  {
    id: '02-vf-2',
    module: '02-dessiner-avec-du-code',
    type: 'vrai-faux',
    partie: 'd3',
    points: 2,
    question: 'Un élément `<g>` en SVG peut hériter des attributs de style (`fill`, `stroke`) définis sur lui et les transmettre à ses enfants.',
    reponse: true,
    explication:
      'Vrai. `<g>` est un groupe SVG : les attributs de style définis sur lui (ex. `fill="steelblue"`) sont **hérités** par tous ses enfants, et les transformations `transform` s\'appliquent à tout le groupe.',
  },
  {
    id: '02-vf-3',
    module: '02-dessiner-avec-du-code',
    type: 'vrai-faux',
    partie: 'd3',
    points: 2,
    question: 'En Canvas, si on omet `beginPath()` avant de dessiner une nouvelle forme, les anciens chemins se cumulent et le rendu peut être incorrect.',
    reponse: true,
    explication:
      'Vrai. En Canvas, `beginPath()` **réinitialise** le chemin courant. Sans lui, les instructions de dessin s\'ajoutent au chemin précédent, produisant des formes inattendues lors du `fill()` ou `stroke()`.',
  },
  {
    id: '02-vf-4',
    module: '02-dessiner-avec-du-code',
    type: 'vrai-faux',
    partie: 'd3',
    points: 2,
    question: 'SVG et Canvas partagent le **même système de coordonnées** : origine en haut à gauche, Y croissant vers le bas.',
    reponse: true,
    explication:
      'Vrai. SVG et Canvas utilisent tous les deux un repère avec l\'origine **(0,0) en haut à gauche** et l\'axe Y qui pointe vers le bas — à l\'inverse du repère mathématique scolaire.',
  },
]
