export default {
  id: '04-donnees',
  titre: 'Données',
  accroche:
    'Avant de dessiner quoi que ce soit, il faut **comprendre ses données** : leur type, leur format, et comment les charger. Les données, c\'est la matière première - tout le reste n\'est que mise en forme.',

  sections: [
    {
      titre: 'Types de données : qualitative vs quantitative',
      corps: `Toutes les données ne sont pas égales devant la visualisation. Il existe deux grandes familles :

**Qualitative** : décrit une *qualité*, une catégorie - tu ne peux pas faire de moyenne dessus.
- **Nominale** : pas d'ordre naturel (ex. couleurs, pays, prénoms)
- **Ordinale** : ordre naturel mais intervalles non constants (ex. S, M, L, XL - la différence entre S et M n'est pas la même qu'entre L et XL)
- **Binaire** : seulement deux valeurs (oui/non, vrai/faux)

**Quantitative** : mesure une *quantité*, un nombre - tu peux calculer des moyennes, des sommes, etc.
- **Discrète** : valeurs entières (ex. nombre d'élèves dans une classe - tu ne peux pas avoir 2,7 élèves)
- **Continue** : valeurs réelles (ex. température, poids, distance)

Pourquoi c'est important ? Parce que le **type de donnée dicte le type d'échelle** (et donc le type de graphique). Tu n'utilises pas \`scaleBand\` pour des températures, ni \`scaleLinear\` pour des catégories.`,
    },
    {
      titre: 'Formats de données : CSV, JSON, TSV, XML',
      corps: `Les données vivent dans des fichiers. Voici les formats que tu croiseras le plus souvent :

**CSV** (Comma-Separated Values) - format texte, une ligne par enregistrement, valeurs séparées par des virgules. La première ligne = les noms de colonnes. Simple, universel, compatible Excel et Google Sheets. En D3 : \`d3.csv()\` retourne un **tableau d'objets**.

**JSON** (JavaScript Object Notation) - format texte structuré, nativement JavaScript. Les **types sont préservés** (nombres, booléens, tableaux, objets imbriqués). Format standard pour les APIs web. En D3 : \`d3.json()\` retourne l'objet parsé directement.

**TSV** (Tab-Separated Values) - comme le CSV mais le séparateur est une **tabulation** (\`\\t\`). Utile quand les données contiennent elles-mêmes des virgules. En D3 : \`d3.tsv()\`, syntaxe identique à \`d3.csv()\`.

**XML** (eXtensible Markup Language) - format de balisage, verbeux mais très expressif (comme du HTML pour les données). Utilisé dans certains exports OpenData et GIS. Rarement utilisé directement en D3 (\`d3.xml()\` pour les cas particuliers).

> **Mémo rapide** : CSV/TSV = tableaux de données simples · JSON = structures complexes/imbriquées · XML = cas spéciaux OpenData`,
    },
    {
      titre: 'Charger des données avec d3-fetch',
      corps: `D3 fournit \`d3-fetch\`, un wrapper autour de l'API \`fetch\` native, pour charger facilement des données.

La grosse différence avec JSON : **le CSV retourne tout en chaînes de caractères**. Pour obtenir des nombres, tu dois convertir manuellement avec l'opérateur \`+\` (ou \`Number()\`) via un **accesseur** (2e argument de \`d3.csv()\`).

Compare les deux approches : avec du JavaScript vanilla, analyser un CSV à la main, c'est du boulot. Avec D3, c'est une ligne.`,
      code: {
        langage: 'js',
        editable: true,
        source: `import { csv, json } from 'd3-fetch'

// Charger un CSV avec conversion de types
const villes = await csv('data/cities.csv', d => ({
  city: d.city,
  population: +d.population,  // string → number
  area: +d.area
}))
// [{ city: "Zurich", population: 421878, area: 87.88 }, ...]

// Charger du JSON - types déjà préservés, pas besoin de convertir
const data = await json('data/cities.json')
// [{ city: "Zurich", population: 421878 }, ...]`,
      },
    },
    {
      titre: 'Import statique vs runtime (Vite DSV)',
      corps: `Il y a deux façons de charger un CSV dans un projet Vite/Svelte :

**Import statique** (plugin \`@rollup/plugin-dsv\`) : le CSV est importé **comme un module JS**, parsé à la compilation. Aucune requête réseau, aucun \`await\`, données disponibles immédiatement. Idéal pour des données statiques qui ne changent pas.

**Runtime** (\`d3-fetch\`) : requête réseau chargée au moment de l'exécution. Nécessite \`await\`. Idéal pour des données dynamiques (APIs, URLs variables).

⚠ Attention : avec l'import statique, les valeurs restent des **chaînes** (l'accesseur de \`d3.csv()\` n'est pas disponible), donc pas de conversion automatique.`,
      code: {
        langage: 'js',
        editable: false,
        source: `// Option 1 : import statique (compile-time, synchrone)
// vite.config.js
import dsv from '@rollup/plugin-dsv'
export default { plugins: [dsv()] }

// script.js
import data from './data/cities.csv'
// ⚠ Valeurs = chaînes, pas de conversion automatique

// Option 2 : runtime avec d3-fetch (asynchrone)
import { csv } from 'd3-fetch'
const data = await csv('data/cities.csv', d => ({
  city: d.city,
  population: +d.population  // conversion possible ici
}))`,
      },
    },
    {
      titre: 'Manipuler les données : d3-array et méthodes JS',
      corps: `Une fois les données chargées, il faut souvent les **transformer**, les **filtrer** ou en extraire des statistiques. Deux outils complémentaires :

**d3-array** : fonctions statistiques optimisées, travaillent avec des **accesseurs** :
- \`max(data, d => d.pop)\` - valeur maximale
- \`min(data, d => d.pop)\` - valeur minimale
- \`sum(data, d => d.pop)\` - somme
- \`mean(data, d => d.pop)\` - moyenne arithmétique
- \`extent(data, d => d.pop)\` - retourne \`[min, max]\` d'un coup (pratique pour \`.domain()\`)

**Méthodes JS natives** (elles retournent un *nouveau* tableau sans muter l'original, sauf \`sort\`) :
- \`Array.map(fn)\` : transformer chaque élément
- \`Array.filter(fn)\` : garder les éléments qui passent un test
- \`Array.reduce(fn, init)\` : agréger en une seule valeur
- \`Array.includes(val)\` : vérifier si une valeur est présente
- \`Array.forEach(fn)\` : itérer pour les effets de bord (ne retourne rien)
- \`Array.sort(fn)\` : trier **en place** (⚠ mutation - utiliser \`[...data].sort(...)\` pour éviter ça)`,
      code: {
        langage: 'js',
        editable: true,
        source: `import { max, min, extent, mean } from 'd3-array'

const cities = [
  { name: 'Lausanne', population: 140000 },
  { name: 'Yverdon',  population:  30000 },
  { name: 'Genève',   population: 200000 }
]

// Statistiques d3-array
max(cities, d => d.population)     // 200000
extent(cities, d => d.population)  // [30000, 200000]
mean(cities, d => d.population)    // 123333.33...

// Filtrer + mapper
const grandes = cities
  .filter(d => d.population > 100000)
  .map(d => d.name)
// ["Lausanne", "Genève"]

// Trier sans muter l'original
const tries = [...cities].sort((a, b) => b.population - a.population)`,
      },
    },
    {
      titre: 'Data binding : .data().join()',
      corps: `C'est **le cœur de D3** : lier un tableau de données à des éléments du DOM. Pense-y comme un mariage organisé - D3 regarde combien de données tu as, combien d'éléments DOM existent, et fait correspondre les deux.

Le pattern \`selectAll → data → join\` en trois étapes :
1. \`selectAll('circle')\` : sélectionne les éléments cibles (vide ou non)
2. \`.data(data)\` : associe chaque valeur du tableau à un élément DOM
3. \`.join('circle')\` : **crée** les éléments manquants, **supprime** les excédents

Quand les données changent, D3 distingue trois situations (le cycle **Enter / Update / Exit**) :
- **Enter** : nouvelles données sans élément DOM → **créer** les éléments
- **Update** : données avec un élément existant → **modifier** les attributs
- **Exit** : éléments sans donnée correspondante → **supprimer**

Dans la version simple (\`.join('circle')\`), D3 gère tout automatiquement. La version longue (\`.join(enter, update, exit)\`) te donne le contrôle total - utile pour des animations différenciées à l'entrée et à la sortie.`,
      code: {
        langage: 'js',
        editable: true,
        source: `import { select } from 'd3-selection'

const data = [10, 30, 50, 20, 40]

// Version simple : D3 gère enter/update/exit automatiquement
select('svg')
  .selectAll('circle')
  .data(data)
  .join('circle')
    .attr('r',  d => d)
    .attr('cx', (d, i) => i * 60 + 40)
    .attr('cy', 60)
    .attr('fill', 'steelblue')

// Version avancée : contrôle total
select('svg').selectAll('circle').data(data)
  .join(
    enter  => enter.append('circle').attr('fill', 'steelblue'),
    update => update.attr('fill', 'orange'),
    exit   => exit.remove()
  )`,
      },
    },
  ],

  essentiel: [
    'Types de données : **qualitative** (nominale, ordinale, binaire) vs **quantitative** (discrète, continue) - le type dicte l\'échelle à utiliser.',
    'CSV = tout en **chaînes** → convertir avec `+d.valeur` dans l\'accesseur. JSON = types **préservés** (nombres, booléens).',
    '`extent(data, accessor)` retourne `[min, max]` - parfait pour alimenter `.domain()` d\'une échelle.',
    'Data binding : `selectAll` → `.data(array)` → `.join(\'element\')` - D3 crée/modifie/supprime les éléments DOM automatiquement.',
    'Cycle **Enter / Update / Exit** : Enter = créer, Update = modifier, Exit = supprimer. `.join(\'circle\')` gère les 3 cas automatiquement.',
    '`Array.sort()` mute le tableau en place - utiliser `[...data].sort(...)` pour éviter les effets de bord.',
  ],

  pieges: [
    '`d3.csv()` retourne **toutes les valeurs comme chaînes** - oublier de convertir avec `+d.population` donne un tri alphabétique ("10" < "9") et des calculs faux.',
    '`Array.sort()` **modifie le tableau original** - si le tableau doit rester intact, travailler sur une copie : `[...data].sort((a, b) => a.pop - b.pop)`.',
    '`forEach` ne retourne rien (contrairement à `map`) - utiliser `map` quand on veut un nouveau tableau transformé, `forEach` seulement pour les effets de bord.',
    'Ne pas confondre `extent` (retourne `[min, max]`) et `max`/`min` séparément - `extent` est directement utilisable pour `.domain([...extent])`.',
  ],

  patterns: [
    {
      titre: 'Charger et binder des données CSV',
      code: `import { csv } from 'd3-fetch'
import { select } from 'd3-selection'
import { scaleLinear, scaleBand } from 'd3-scale'
import { extent } from 'd3-array'

const data = await csv('data/cities.csv', d => ({
  city: d.city,
  population: +d.population
}))

const x = scaleBand().domain(data.map(d => d.city)).range([0, width]).padding(0.1)
const y = scaleLinear().domain([0, ...extent(data, d => d.population)]).range([height, 0])

select('svg').selectAll('rect')
  .data(data)
  .join('rect')
    .attr('x', d => x(d.city))
    .attr('width', x.bandwidth())
    .attr('y', d => y(d.population))
    .attr('height', d => height - y(d.population))`,
    },
  ],
}
