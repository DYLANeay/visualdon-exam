export default {
  id: '07-interaction-2',
  titre: 'Interaction et animation (2)',
  accroche:
    'Zoomer, se déplacer, animer des données au fil du temps… Ce cours t\'équipe pour rendre tes visualisations vraiment **interactives** : l\'utilisateur n\'observe plus, il **explore**.',

  sections: [
    {
      titre: 'Le zoom avec d3-zoom',
      corps: `\`d3-zoom\` permet d'ajouter le **zoom et le déplacement** (pan) à n'importe quel SVG. Pense à Google Maps : tu scrolles pour zoomer, tu glisses pour te déplacer. C'est exactement le comportement que \`d3-zoom\` gère pour toi.

Le principe : tu crées un **comportement de zoom** (\`zoom()\`), tu lui attaches un gestionnaire d'événement \`'zoom'\`, et tu l'appliques au SVG avec \`.call()\`. Lors du zoom, D3 te donne une **transformation géométrique** (\`event.transform\`) que tu appliques au groupe \`<g>\` contenant tes éléments visuels.

La transformation contient trois propriétés :
- \`x\` : décalage horizontal (translation)
- \`y\` : décalage vertical (translation)
- \`k\` : facteur d'échelle (1 = normal, 2 = zoomé ×2)`,
      code: {
        langage: 'js',
        editable: true,
        source: `import { zoom } from 'd3-zoom'

// Le groupe <g> qui contient tous les éléments visuels
const g = svg.append('g')

// Créer le comportement de zoom
const zoomBehavior = zoom()
  .on('zoom', (event) => {
    // Appliquer la transformation au groupe
    g.attr('transform', event.transform)

    // event.transform contient { x, y, k }
    console.log('x:', event.transform.x.toFixed(1))
    console.log('y:', event.transform.y.toFixed(1))
    console.log('k:', event.transform.k.toFixed(2))
  })

// Attacher le zoom au SVG (capture scroll + drag)
svg.call(zoomBehavior)`,
      },
    },
    {
      titre: 'Contraintes du zoom',
      corps: `Sans contraintes, le zoom est illimité : l'utilisateur peut zoomer jusqu'à l'infini ou se déplacer hors du canvas. C'est rarement ce qu'on veut.

Deux méthodes pour cadrer le comportement :
- \`.scaleExtent([min, max])\` : limite le niveau de zoom. \`[1, 5]\` = pas de dézoom en dessous de la taille initiale, zoom max ×5.
- \`.translateExtent([[x0, y0], [x1, y1]])\` : limite la zone de déplacement. Typiquement \`[[0, 0], [width, height]]\` pour rester dans les limites du canvas.`,
      code: {
        langage: 'js',
        editable: false,
        source: `const zoomBehavior = zoom()
  .scaleExtent([1, 5])           // zoom min x1, max x5
  .translateExtent([
    [0, 0],                       // coin supérieur gauche
    [width, height]               // coin inférieur droit
  ])
  .on('zoom', (event) => {
    g.attr('transform', event.transform)
  })

svg.call(zoomBehavior)`,
      },
    },
    {
      titre: 'Zoom programmatique',
      corps: `En plus du zoom interactif (souris/tactile), tu peux **contrôler le zoom par code**, par exemple via des boutons. Utile pour les boutons "Zoom +" / "Zoom -" / "Réinitialiser" ou pour focaliser automatiquement sur une zone.

Les méthodes disponibles (à appeler avec \`.call()\` sur le SVG) :
- \`zoomBehavior.scaleBy(factor)\` : multiplie le zoom actuel par \`factor\`
- \`zoomBehavior.scaleTo(level)\` : définit un niveau de zoom absolu
- \`zoomBehavior.translateBy(dx, dy)\` : décale la vue
- \`zoomBehavior.transform(zoomIdentity)\` : remet à zéro

On peut les combiner avec \`.transition()\` pour des zooms animés.`,
      code: {
        langage: 'js',
        editable: false,
        source: `import { zoom, zoomIdentity } from 'd3-zoom'

// Zoom avant x2 (animé)
btnPlus.on('click', () => {
  svg.transition().call(zoomBehavior.scaleBy, 2)
})

// Zoom à x3 exactement (animé)
btnZoom3.on('click', () => {
  svg.transition().call(zoomBehavior.scaleTo, 3)
})

// Déplacer de 80px vers la droite (animé)
btnDroite.on('click', () => {
  svg.transition().call(zoomBehavior.translateBy, 80, 0)
})

// Remettre à zéro (retour à l'état initial)
btnReset.on('click', () => {
  svg.transition().call(zoomBehavior.transform, zoomIdentity)
})`,
      },
    },
    {
      titre: 'Animation temporelle avec setInterval',
      corps: `Pour animer des données **au fil du temps** (un graphique qui avance année par année, comme les animations de Gapminder), le motif classique est \`setInterval\`.

\`setInterval(fn, ms)\` exécute une fonction à **intervalles réguliers** exprimés en millisecondes. À chaque tick, on met à jour les données, puis on ré-anime les éléments visuels avec une transition D3.

\`clearInterval(id)\` arrête l'animation — indispensable pour le bouton "Pause" ou pour éviter les fuites mémoire.

Le pattern typique : un tableau d'étapes (années, mois…), un index \`step\` qui avance, et une mise à jour du graphique à chaque intervalle.`,
      code: {
        langage: 'js',
        editable: true,
        source: `const years = [1990, 1995, 2000, 2005, 2010, 2015, 2020]
let step = 0

// Démarrer l'animation : une mise à jour toutes les secondes
const intervalId = setInterval(() => {
  step = (step + 1) % years.length  // boucle sur les années

  // Mettre à jour les barres avec les données de la nouvelle année
  bars
    .data(dataByYear[years[step]])
    .transition()
    .duration(700)
    .attr('y', d => yScale(d))
    .attr('height', d => innerHeight - yScale(d))

}, 1000)  // toutes les 1000ms = 1 seconde

// Arrêter l'animation (ex. bouton Pause)
clearInterval(intervalId)`,
      },
    },
  ],

  essentiel: [
    '`d3-zoom` : créer un zoom avec `zoom().on(\'zoom\', fn)` et l\'attacher au SVG avec `svg.call(zoomBehavior)`.',
    '`event.transform` contient `{ x, y, k }` — appliquer au groupe `<g>` : `g.attr(\'transform\', event.transform)`.',
    '`.scaleExtent([min, max])` limite le zoom · `.translateExtent([[0,0],[w,h]])` limite le déplacement.',
    'Zoom programmatique : `.scaleBy`, `.scaleTo`, `.translateBy`, `.transform(zoomIdentity)` — combiner avec `.transition()` pour animer.',
    '`setInterval(fn, ms)` : exécuter une fonction à intervalles réguliers · `clearInterval(id)` pour arrêter.',
  ],

  pieges: [
    'Appliquer la transformation de zoom **directement sur le SVG** au lieu du groupe `<g>` — ça décale aussi les axes. Toujours appliquer `event.transform` au groupe contenant les éléments visuels, pas au SVG entier.',
    'Oublier \`clearInterval(id)\` après avoir stoppé une animation laisse l\'intervalle tourner en arrière-plan — **fuite mémoire** et comportements bizarres si tu relances.',
    'Sans `.scaleExtent([1, ...])` le zoom peut se retrouver en dessous de 1 (dézoom) et retourner la visualisation ou la réduire à rien.',
  ],

  patterns: [
    {
      titre: 'Zoom de base sur un scatter plot',
      code: `import { zoom } from 'd3-zoom'
import { select } from 'd3-selection'

const g = svg.append('g')  // groupe contenant tous les éléments

// Dessiner les points dans g...
g.selectAll('circle').data(data).join('circle')
  .attr('cx', d => xScale(d.x))
  .attr('cy', d => yScale(d.y))
  .attr('r', 5)

// Ajouter le zoom
const zoomBehavior = zoom()
  .scaleExtent([0.5, 10])
  .on('zoom', (event) => {
    g.attr('transform', event.transform)
  })

svg.call(zoomBehavior)`,
    },
    {
      titre: 'Animation temporelle avec play/pause',
      code: `const years = [2000, 2005, 2010, 2015, 2020]
let step = 0
let intervalId = null

function update(year) {
  bars.data(dataByYear[year])
    .transition().duration(700)
    .attr('y', d => yScale(d.value))
    .attr('height', d => height - yScale(d.value))
}

btnPlay.on('click', () => {
  if (intervalId) return  // déjà en cours
  intervalId = setInterval(() => {
    step = (step + 1) % years.length
    update(years[step])
  }, 1000)
})

btnPause.on('click', () => {
  clearInterval(intervalId)
  intervalId = null
})`,
    },
  ],
}
