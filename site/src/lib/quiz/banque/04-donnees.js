export default [
  // --- QCM ---
  {
    id: '04-qcm-1',
    module: '04-donnees',
    type: 'qcm',
    partie: 'qcm',
    points: 2,
    question: 'Pourquoi écrit-on `+d.population` après un `d3.csv()` ?',
    options: [
      'Pour arrondir la valeur à l\'entier le plus proche',
      'Pour convertir la chaîne de caractères en nombre, car CSV retourne tout en string',
      'Pour s\'assurer que la valeur est positive',
      'C\'est une syntaxe propre à D3, sans équivalent en JavaScript standard',
    ],
    correct: 1,
    explication:
      '`d3.csv()` retourne **toutes les valeurs comme chaînes de caractères**. L\'opérateur unaire `+` convertit la chaîne en nombre. Sans cette conversion, des opérations comme `"10" + "20" = "1020"` (concaténation) ou des tris alphabétiques erronés se produisent.',
  },
  {
    id: '04-qcm-2',
    module: '04-donnees',
    type: 'qcm',
    partie: 'qcm',
    points: 2,
    question: 'Que retourne `d3.extent([3, 8, 1, 6, 2])` ?',
    options: [
      '`8`',
      '`[1, 8]`',
      '`4` (la moyenne)',
      'Le tableau trié `[1, 2, 3, 6, 8]`',
    ],
    correct: 1,
    explication:
      '`d3.extent()` retourne `[min, max]` sous forme de tableau — ici `[1, 8]`. C\'est directement utilisable pour `.domain()` d\'une échelle D3.',
  },
  {
    id: '04-qcm-3',
    module: '04-donnees',
    type: 'qcm',
    partie: 'qcm',
    points: 2,
    question: 'Quel est le résultat de ce code JavaScript ?',
    code: 'const data = [12, 5, 8, 20, 3]\nconst filtered = data.filter(d => d > 7)',
    langage: 'js',
    options: [
      '`[12, 8, 20]`',
      '`[12, 5, 8, 20, 3]`',
      '`[5, 3]`',
      '`3` (le nombre d\'éléments > 7)',
    ],
    correct: 0,
    explication:
      '`.filter()` retourne un **nouveau tableau** contenant uniquement les éléments qui passent le test. Ici, les valeurs > 7 sont 12, 8 et 20. `.filter()` ne renvoie pas un compte, mais le tableau filtré.',
  },
  {
    id: '04-qcm-4',
    module: '04-donnees',
    type: 'qcm',
    partie: 'qcm',
    points: 2,
    question: 'Que fait `.join("circle")` dans ce code D3 ?',
    code: 'svg.selectAll("circle").data([5, 15, 25]).join("circle").attr("r", d => d)',
    langage: 'js',
    options: [
      'Fusionne tous les cercles en un seul élément',
      'Crée les cercles manquants, met à jour les existants, supprime les superflus',
      'Sélectionne uniquement les cercles déjà présents dans le DOM',
      'Ajoute un cercle à la fin de la sélection existante',
    ],
    correct: 1,
    explication:
      '`.join("circle")` gère automatiquement les trois cas du cycle **Enter / Update / Exit** : il **crée** les éléments manquants (Enter), **met à jour** les existants (Update) et **supprime** les éléments en trop (Exit).',
  },
  {
    id: '04-qcm-5',
    module: '04-donnees',
    type: 'qcm',
    partie: 'qcm',
    points: 2,
    question: 'Quelle est la différence principale entre **JSON** et **CSV** pour le chargement de données avec D3 ?',
    options: [
      'Le JSON ne peut pas être chargé avec D3',
      'Le CSV préserve les types (nombres, booléens), le JSON retourne tout en strings',
      'Le JSON préserve les types nativement ; le CSV retourne tout en chaînes de caractères',
      'Il n\'y a aucune différence — D3 convertit automatiquement les deux',
    ],
    correct: 2,
    explication:
      'Le **JSON** est un format JavaScript natif qui préserve les types (nombres, booléens, tableaux, objets). Le **CSV** est du texte brut — `d3.csv()` retourne toutes les valeurs comme des **chaînes**, il faut donc les convertir avec `+d.valeur`.',
  },

  // --- Vrai / Faux ---
  {
    id: '04-vf-1',
    module: '04-donnees',
    type: 'vrai-faux',
    partie: 'd3',
    points: 2,
    question: 'Sans le `+` devant `d.trajets` lors d\'un parsing CSV, les trajets seraient additionnés comme des chaînes (`"100" + "200" = "100200"`).',
    reponse: true,
    explication:
      'Vrai. Sans conversion, `d3.csv()` retourne des chaînes. L\'opérateur `+` entre deux chaînes effectue une **concaténation** et non une addition — `"100" + "200" = "100200"`. Il faut impérativement convertir avec `+d.trajets` ou `Number(d.trajets)`.',
  },
  {
    id: '04-vf-2',
    module: '04-donnees',
    type: 'vrai-faux',
    partie: 'd3',
    points: 2,
    question: '`Array.sort()` retourne un nouveau tableau trié sans modifier le tableau original.',
    reponse: false,
    explication:
      'Faux. `Array.sort()` **modifie le tableau en place** (mutation). Pour trier sans altérer l\'original, il faut travailler sur une copie : `[...data].sort((a, b) => a.val - b.val)`.',
  },
  {
    id: '04-vf-3',
    module: '04-donnees',
    type: 'vrai-faux',
    partie: 'd3',
    points: 2,
    question: 'Dans le cycle D3, la phase **Enter** correspond aux données qui n\'ont pas d\'élément DOM associé — D3 doit **créer** ces éléments.',
    reponse: true,
    explication:
      'Vrai. Le cycle Enter / Update / Exit fonctionne ainsi : **Enter** = nouvelles données sans élément DOM → créer. **Update** = données avec élément existant → modifier. **Exit** = éléments sans donnée → supprimer.',
  },
  {
    id: '04-vf-4',
    module: '04-donnees',
    type: 'vrai-faux',
    partie: 'd3',
    points: 2,
    question: '`d3.extent(data, d => d.population)` est directement utilisable pour alimenter `.domain()` d\'une échelle, sans modification.',
    reponse: true,
    explication:
      'Vrai. `d3.extent()` retourne `[min, max]` — exactement le format attendu par `.domain([min, max])`. C\'est pour ça qu\'on l\'utilise : `yScale.domain(d3.extent(data, d => d.pop))` ou `yScale.domain([0, d3.max(data, d => d.pop)])`.',
  },
]
