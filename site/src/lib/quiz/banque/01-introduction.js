export default [
  // --- QCM ---
  {
    id: '01-qcm-1',
    module: '01-introduction',
    type: 'qcm',
    partie: 'qcm',
    points: 2,
    question: 'Quel historien de la dataviz a encodé **6 variables** sur une seule image pour représenter la campagne de Russie de Napoléon ?',
    options: [
      'Florence Nightingale',
      'John Snow',
      'Charles Joseph Minard',
      'Jacques Bertin',
    ],
    correct: 2,
    explication:
      'Charles Joseph Minard (1869) a représenté en une seule image : géographie, direction, effectifs, température, dates et rivières. Edward Tufte la considère comme la meilleure visualisation statistique jamais créée.',
  },
  {
    id: '01-qcm-2',
    module: '01-introduction',
    type: 'qcm',
    partie: 'qcm',
    points: 2,
    question: 'Combien de **variables visuelles** Jacques Bertin définit-il dans sa *Sémiologie graphique* (1967) ?',
    options: [
      '4',
      '5',
      '7',
      '10',
    ],
    correct: 2,
    explication:
      'Bertin définit **7 variables visuelles** : position, taille, valeur, grain, couleur, orientation et forme. Cette grammaire permet d\'encoder l\'information sans ambiguïté.',
  },
  {
    id: '01-qcm-3',
    module: '01-introduction',
    type: 'qcm',
    partie: 'qcm',
    points: 2,
    question: 'Selon Edward Tufte, que faut-il **maximiser** dans une bonne visualisation ?',
    options: [
      'Le nombre de couleurs utilisées',
      'Le **data-ink ratio** (rapport encre utile / encre totale)',
      'La surface occupée par les légendes',
      'Le nombre d\'éléments décoratifs pour attirer l\'œil',
    ],
    correct: 1,
    explication:
      'Tufte prône de maximiser le **data-ink ratio** : chaque pixel doit informer. Il appelle **chartjunk** tout ce qui décore sans informer, et conseille de l\'éliminer.',
  },
  {
    id: '01-qcm-4',
    module: '01-introduction',
    type: 'qcm',
    partie: 'qcm',
    points: 2,
    question: 'Selon *Information is Beautiful*, une bonne visualisation repose sur 4 piliers. Lequel de ces piliers **n\'existe pas** dans ce modèle ?',
    options: [
      'Information',
      'Fonction',
      'Complexité',
      'Histoire',
    ],
    correct: 2,
    explication:
      'Les 4 piliers d\'*Information is Beautiful* sont : **Information** (données exactes), **Fonction** (objectif clair), **Forme visuelle** (design efficace) et **Histoire** (narration). "Complexité" n\'en fait pas partie.',
  },
  {
    id: '01-qcm-5',
    module: '01-introduction',
    type: 'qcm',
    partie: 'qcm',
    points: 2,
    question: 'Florence Nightingale est connue pour avoir inventé quel type de visualisation afin de réformer l\'hygiène militaire britannique ?',
    options: [
      'Le scatter plot (nuage de points)',
      'La carte choroplèthe',
      'Le diagramme en rose (coxcomb)',
      'Le bar chart empilé',
    ],
    correct: 2,
    explication:
      'Florence Nightingale (1858) a inventé le **diagramme en rose** (ou coxcomb) pour montrer les causes de mortalité dans l\'armée britannique et convaincre le gouvernement de réformer l\'hygiène militaire.',
  },

  // --- Vrai / Faux ---
  {
    id: '01-vf-1',
    module: '01-introduction',
    type: 'vrai-faux',
    partie: 'qcm',
    points: 2,
    question: 'Les données sont objectives et neutres par nature : elles reflètent la réalité telle qu\'elle est, sans intervention humaine.',
    reponse: false,
    explication:
      'Faux. Comme le dit Bowker : *"Les données ne sont jamais brutes. Elles sont toujours déjà cuisinées."* Giorgia Lupi (Data Humanism) rappelle que les données portent la trace de ceux qui les ont collectées - elles ne sont jamais neutres.',
  },
  {
    id: '01-vf-2',
    module: '01-introduction',
    type: 'vrai-faux',
    partie: 'qcm',
    points: 2,
    question: 'Une visualisation **exploratoire** et une visualisation **explicative** répondent aux mêmes critères de qualité.',
    reponse: false,
    explication:
      'Faux. La visualisation **exploratoire** sert à soi-même (itérations rapides, sans souci esthétique). La visualisation **explicative** est destinée aux autres et nécessite un storytelling soigné et un message unique.',
  },
  {
    id: '01-vf-3',
    module: '01-introduction',
    type: 'vrai-faux',
    partie: 'qcm',
    points: 2,
    question: 'John Snow a prouvé la transmission du choléra par l\'eau grâce à une **cartographie** des cas à Londres en 1854.',
    reponse: true,
    explication:
      'Vrai. John Snow a cartographié les cas de choléra et constaté leur concentration autour d\'une pompe à eau, prouvant ainsi la transmission hydrique - donnant naissance à l\'épidémiologie moderne.',
  },
]
