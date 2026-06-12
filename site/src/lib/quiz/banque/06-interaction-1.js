export default [
  {
    id: '06-qcm-1',
    module: '06-interaction-1',
    type: 'qcm',
    partie: 'qcm',
    points: 2,
    question: 'Quelle est la durée par défaut d\'une transition D3 si on n\'appelle pas `.duration()` ?',
    options: [
      '`100ms`',
      '`250ms`',
      '`500ms`',
      '`1000ms`',
    ],
    correct: 1,
    explication:
      'Par défaut, une transition D3 dure **250ms** — assez court pour être réactif sans être instantané.',
  },
  {
    id: '06-qcm-2',
    module: '06-interaction-1',
    type: 'qcm',
    partie: 'qcm',
    points: 2,
    question: 'Quel easing D3 produit un effet de rebond à l\'arrivée ?',
    options: [
      '`easeLinear`',
      '`easeCubic`',
      '`easeBounce`',
      '`easeElastic`',
    ],
    correct: 2,
    explication:
      '`easeBounce` simule un effet physique de rebond à la fin de la transition. `easeElastic` produit un dépassement élastique, et `easeCubic` est le comportement par défaut (accélération/décélération douce).',
  },
  {
    id: '06-qcm-3',
    module: '06-interaction-1',
    type: 'qcm',
    partie: 'qcm',
    points: 2,
    question: 'On veut que chaque barre démarre sa transition 80ms après la précédente (effet vague). Quelle syntaxe est correcte ?',
    options: [
      '`.delay(80)`',
      '`.delay(i => i * 80)`',
      '`.delay((d, i) => i * 80)`',
      '`.duration((d, i) => i * 80)`',
    ],
    correct: 2,
    explication:
      'Pour une cascade, `.delay()` doit recevoir un **callback** `(d, i)` — `d` est la donnée, `i` l\'index. `.delay(80)` ferait démarrer tous les éléments au même moment, avec 80ms de retard global.',
  },
  {
    id: '06-qcm-4',
    module: '06-interaction-1',
    type: 'qcm',
    partie: 'qcm',
    points: 2,
    question: 'Dans quel ordre faut-il chaîner ces méthodes pour animer correctement une barre ?',
    options: [
      '`.attr("y", ...).transition().duration(700)`',
      '`.duration(700).transition().attr("y", ...)`',
      '`.transition().duration(700).attr("y", ...)`',
      '`.transition().attr("y", ...).duration(700)`',
    ],
    correct: 2,
    explication:
      '`.transition()` doit toujours être **en premier**, suivi des paramètres (`.duration()`, `.ease()`), puis des attributs à animer. Mettre `.attr()` avant `.transition()` change l\'état immédiatement sans animation.',
  },
  {
    id: '06-vf-1',
    module: '06-interaction-1',
    type: 'vrai-faux',
    partie: 'd3',
    points: 2,
    question: 'Appeler `.attr("fill", "orange")` **avant** `.transition()` applique le changement de couleur instantanément, puis D3 anime vers l\'état final.',
    reponse: false,
    explication:
      'Faux : mettre `.attr()` **avant** `.transition()` change l\'état **immédiatement** sans aucune animation — il n\'y a plus rien à interpoler. Pour animer, `.transition()` doit précéder les `.attr()` cibles.',
  },
  {
    id: '06-vf-2',
    module: '06-interaction-1',
    type: 'vrai-faux',
    partie: 'd3',
    points: 2,
    question: '`.delay(500)` avec une valeur fixe est équivalent à `.delay((d, i) => i * 500)` pour créer une animation en cascade.',
    reponse: false,
    explication:
      'Faux : `.delay(500)` fait démarrer **tous** les éléments simultanément après 500ms. Pour une cascade, il faut un callback `.delay((d, i) => i * 500)` afin que chaque élément ait un délai différent selon son index.',
  },
  {
    id: '06-vf-3',
    module: '06-interaction-1',
    type: 'vrai-faux',
    partie: 'd3',
    points: 2,
    question: 'D3 est capable d\'interpoler automatiquement les couleurs CSS (ex. de `"steelblue"` à `"orange"`) lors d\'une transition.',
    reponse: true,
    explication:
      'Vrai : D3 sait interpoler les nombres, les couleurs, les positions SVG et bien d\'autres valeurs. Passer `"steelblue"` à `"orange"` produira un dégradé animé entre les deux couleurs.',
  },
  {
    id: '06-vf-4',
    module: '06-interaction-1',
    type: 'vrai-faux',
    partie: 'd3',
    points: 2,
    question: 'Enchaîner plusieurs `.transition()` sur le même élément sans appeler `selection.interrupt()` peut provoquer des comportements imprévisibles.',
    reponse: true,
    explication:
      'Vrai : les transitions s\'accumulent et se chevauchent. Pour éviter les conflits, il faut interrompre la transition en cours avec `selection.interrupt()` avant d\'en démarrer une nouvelle.',
  },
]
