# Schéma de la banque de questions

La banque vit dans `site/src/lib/quiz/banque/<id-module>.js` (un fichier par module
évalué). Chaque fichier exporte par défaut un tableau de questions. Le format couvre les
types de l'examen type (`comem-visualdon-main/revisions/examen-type.md`).

```js
export default [
  // --- QCM (une seule bonne réponse) ---
  {
    id: '05-qcm-1',          // unique, préfixé par le module
    module: '05-echelles-axes',
    type: 'qcm',
    partie: 'qcm',           // 'qcm' | 'd3' | 'cartographie' | 'ethique'
    points: 2,
    question: 'Que retourne `d3.extent([3, 8, 1, 6, 2])` ?',  // markdown inline
    code: 'optionnel : bloc de code affiché avec la question',
    langage: 'js',           // langage du bloc `code` si présent
    options: [
      '`8`',
      '`[1, 8]`',
      '`4` (la moyenne)',
      'Le tableau trié',
    ],
    correct: 1,              // index (0-based) de la bonne réponse
    explication: 'extent renvoie [min, max] sous forme de tableau.', // markdown
  },

  // --- Vrai / Faux (avec justification attendue) ---
  {
    id: '05-vf-1',
    module: '05-echelles-axes',
    type: 'vrai-faux',
    partie: 'd3',
    points: 2,
    question: 'Le `range` de l’axe Y vaut `[0, height]` pour partir du bas.',
    code: 'optionnel',
    reponse: false,          // true | false
    // Affiché après réponse ; sert d'auto-évaluation pour la justification.
    explication: 'Faux : le SVG a Y=0 en haut, donc le range est inversé `[height, 0]`.',
  },

  // --- Question ouverte (auto-évaluation, parties carto / éthique) ---
  {
    id: '08-ouvert-1',
    module: '08-intro-cartographie',
    type: 'ouvert',
    partie: 'cartographie',
    points: 3,
    question: 'Qu’est-ce qu’une projection cartographique ? Pourquoi distord-elle ?',
    // Points-clés attendus ; l'élève s'auto-note en comparant.
    corrige: [
      'Transformer la surface sphérique de la Terre sur un plan.',
      'Impossible sans distorsion (surface non développable) : on choisit ce qu’on préserve.',
    ],
  },
]
```

## Règles
- Fidélité totale au cours + à l'examen type. Les QCM ne doivent avoir **qu'une** bonne réponse.
- `partie` suit la structure de l'examen : QCM (2 pts), D3 vrai/faux (2 pts), cartographie, éthique.
- Markdown inline autorisé dans `question`, `options`, `explication` (`code`, **gras**).
- Le cours 11 (Scrollytelling) n'existe pas : aucune question.
