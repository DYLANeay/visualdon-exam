export default {
  id: '05-echelles-axes',
  titre: 'Échelles et axes',
  accroche:
    'Tes données parlent en degrés, en habitants, en francs… mais ton écran, lui, ne comprend que les **pixels**. Une échelle est l’**interprète** qui traduit l’un dans l’autre.',

  sections: [
    {
      titre: 'Le problème : données ≠ pixels',
      corps: `Jusqu’ici on plaçait les données directement comme coordonnées. Ça marche tant que les chiffres tombent par hasard dans la taille du canvas… et ça casse dès que ce n’est plus le cas.

Imagine une température de \`-10\` à \`38\` °C à dessiner sur une largeur de \`800px\`, ou une population de \`8000\` à \`8 000 000\` sur une hauteur de \`500px\`. Les valeurs **débordent** ou se tassent dans un coin.

Il faut donc **transformer** les données pour les adapter à l’espace disponible. C’est exactement le métier des échelles.`,
    },
    {
      titre: 'La solution : les échelles (d3-scale)',
      corps: `Une échelle est une **fonction** qui transforme une valeur du **domaine des données** vers un **intervalle visuel** :

- **domain** : l’étendue des données en entrée (ex. \`[0, 100]\`)
- **range** : l’étendue visuelle en sortie, en pixels (ex. \`[0, 800]\`)

Tu donnes une donnée à la fonction, elle te rend une position. \`scale(minData)\` tombe au début du range, \`scale(maxData)\` à la fin.`,
      code: {
        langage: 'js',
        editable: true,
        source: `import { scaleLinear } from 'd3-scale'

const x = scaleLinear()
  .domain([0, 100])   // données
  .range([0, 800])    // pixels

x(0)   // 0
x(50)  // 400
x(100) // 800`,
      },
    },
    {
      titre: 'Le bon type d’échelle pour la bonne donnée',
      corps: `D3 offre une échelle par situation. À l’examen, sache **les distinguer** :

- **scaleLinear** — données numériques continues (positions, tailles, axes).
- **scaleTime** — dates et temps (séries temporelles).
- **scaleBand** — catégories pour les **bar charts** : découpe le range en bandes égales. \`x.bandwidth()\` donne la largeur d’une barre, \`.padding()\` l’espace entre elles.
- **scaleOrdinal** — catégories → valeurs discrètes (ex. une couleur par catégorie).
- **scaleQuantize** — continu → quelques catégories de taille égale (cartes choroplèthes).
- **scaleThreshold** — continu → catégories selon des **seuils** que tu choisis.

Mémo : *linéaire/temps = continu vers continu ; band/ordinal = catégories ; quantize/threshold = continu découpé en paliers.*`,
      code: {
        langage: 'js',
        editable: true,
        source: `import { scaleBand } from 'd3-scale'

const x = scaleBand()
  .domain(['A', 'B', 'C', 'D'])
  .range([0, 800])
  .padding(0.1)

x('A')         // position de la barre A
x.bandwidth()  // largeur de chaque barre`,
      },
    },
    {
      titre: 'Les axes (d3-axis)',
      corps: `Un axe se génère **à partir d’une échelle** : il dessine la ligne, les graduations (ticks) et les étiquettes pour toi.

- \`axisBottom(scale)\` / \`axisLeft(scale)\` sont les plus courants ; \`axisTop\`, \`axisRight\` existent aussi.
- On dessine un axe dans un \`<g>\` avec \`.call()\`, en le positionnant via \`transform\`.`,
      code: {
        langage: 'js',
        editable: true,
        source: `import { axisBottom, axisLeft } from 'd3-axis'

svg.append('g')
  .attr('transform', \`translate(0, \${height})\`)
  .call(axisBottom(xScale))

svg.append('g')
  .call(axisLeft(yScale))`,
      },
    },
    {
      titre: 'La convention des marges',
      corps: `Les axes ont besoin de place autour du dessin (étiquettes, graduations). La **convention des marges** réserve cet espace proprement : on définit un objet \`margin\`, et on décale toute la zone de dessin avec un \`<g>\` translaté de \`margin.left, margin.top\`.

Résultat : une zone de dessin nette de dimensions \`width × height\`, entourée des marges qui accueillent les axes.`,
      code: {
        langage: 'js',
        editable: false,
        source: `const margin = { top: 20, right: 30, bottom: 40, left: 50 }
const width  = 800 - margin.left - margin.right
const height = 500 - margin.top  - margin.bottom

const svg = d3.select('#chart').append('svg')
  .attr('width',  width  + margin.left + margin.right)
  .attr('height', height + margin.top  + margin.bottom)
  .append('g')
  .attr('transform', \`translate(\${margin.left}, \${margin.top})\`)`,
      },
    },
  ],

  essentiel: [
    'Une **échelle** est une fonction qui mappe un **domain** (données) vers un **range** (pixels).',
    '`scaleLinear` = continu→continu · `scaleBand` = catégories (barres) · `scaleOrdinal` = catégories→valeurs · `scaleTime` = dates.',
    'Sur une échelle de bandes : `x.bandwidth()` = largeur d’une barre, `.padding()` = espace entre barres.',
    'Un **axe** se crée depuis une échelle : `axisBottom`/`axisLeft`, dessiné dans un `<g>` via `.call()`.',
    'La **convention des marges** réserve la place des axes et garde une zone de dessin `width × height`.',
  ],

  pieges: [
    'L’axe Y du SVG pointe vers le **bas** (Y=0 en haut) : le `range` du yScale est donc **inversé**, `[height, 0]`, pour que les grandes valeurs soient en haut.',
    'Augmenter le `.padding()` d’un `scaleBand` rend les barres **plus fines** (plus d’espace entre elles), pas plus larges.',
    'Ne pas confondre `domain` (valeurs des données) et `range` (pixels) — les inverser retourne ou écrase la visualisation.',
  ],
}
