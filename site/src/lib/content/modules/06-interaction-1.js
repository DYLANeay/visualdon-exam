export default {
  id: '06-interaction-1',
  titre: 'Interaction et animation (1)',
  accroche:
    'Un graphique statique, c\'est bien. Un graphique qui **s\'anime en douceur** quand les données changent, c\'est magique. Avec `d3-transition`, tu ajoutes une ligne et les barres dansent.',

  sections: [
    {
      titre: 'Qu\'est-ce qu\'une transition ?',
      corps: `Une **transition** est une interpolation animée entre deux états. Sans transition, un changement d'attribut est instantané — l'élément saute brutalement d'un état à l'autre. Avec une transition, D3 calcule automatiquement toutes les valeurs intermédiaires et anime le passage en douceur.

D3 sait interpoler les nombres, les couleurs, les positions, les transformations SVG… presque tout ce qui peut changer visuellement.

La magie : tu n'as qu'à ajouter \`.transition()\` avant tes \`.attr()\`, et le changement devient animé. Un seul mot, zéro effort supplémentaire.`,
      code: {
        langage: 'js',
        editable: true,
        source: `import { transition } from 'd3-transition'

// Sans transition — changement instantané (le cercle "saute")
circle.attr('r', 40)

// Avec transition — changement animé (le cercle "grossit")
circle
  .transition()
  .attr('r', 40)
  .attr('fill', '#E92528')`,
      },
    },
    {
      titre: 'Durée : .duration()',
      corps: `Par défaut, une transition dure **250ms** — assez court pour être réactif. On peut modifier cette durée avec \`.duration()\`, exprimée en **millisecondes**.

Quelques repères pratiques :
- **150–300ms** : transitions rapides, réponses à des interactions (hover, clic)
- **500–800ms** : transitions de données, changement de filtre
- **1000ms+** : animations d'entrée dramatiques, storytelling

Trop court = on ne remarque pas l'animation. Trop long = l'utilisateur s'impatiente.`,
      code: {
        langage: 'js',
        editable: true,
        source: `// Transition de 1 seconde
circle
  .transition()
  .duration(1000)  // 1000ms = 1 seconde
  .attr('r', 50)
  .attr('fill', '#E92528')

// Les barres d'un bar chart mettent 650ms à se mettre à jour
bars
  .transition()
  .duration(650)
  .attr('y', d => yScale(d.value))
  .attr('height', d => height - yScale(d.value))`,
      },
    },
    {
      titre: 'Easing : l\'accélération de la transition',
      corps: `L'**easing** contrôle *comment* la valeur change au fil du temps — est-ce qu'elle accélère, décélère, rebondit ?

Sans easing, une transition est mécanique et plate. Avec le bon easing, elle devient naturelle et vivante. Pense à la différence entre une porte qui s'ouvre à vitesse constante (bizarre) et une porte qui ralentit avant de s'arrêter (naturel).

Les easings disponibles dans \`d3-ease\` :
- \`easeLinear\` — vitesse constante (effet mécanique)
- \`easeCubic\` — accélération puis décélération douce (**défaut** de D3)
- \`easeBounce\` — effet de rebond à l'arrivée (physique)
- \`easeElastic\` — effet élastique, dépasse puis revient

Pour des données, \`easeCubic\` est presque toujours le bon choix. \`easeBounce\` et \`easeElastic\` pour les animations ludiques.`,
      code: {
        langage: 'js',
        editable: true,
        source: `import { easeBounce, easeElastic, easeCubic, easeLinear } from 'd3-ease'

circle
  .transition()
  .duration(1000)
  .ease(easeBounce)   // essaie aussi: easeElastic, easeCubic, easeLinear
  .attr('cy', 400)`,
      },
    },
    {
      titre: 'Délai : .delay() et animations en cascade',
      corps: `Le **délai** (\`.delay()\`) décale le *début* de la transition — idéal pour créer des **animations en cascade** où chaque élément démarre un peu après le précédent.

La clé : passer une **fonction** à \`.delay()\` plutôt qu'une valeur fixe. Cette fonction reçoit la donnée \`d\` et l'index \`i\`, ce qui permet de calculer un délai différent par élément.

Résultat : au lieu que toutes les barres bougent simultanément, elles défilent de gauche à droite, créant un effet visuel beaucoup plus élégant.`,
      code: {
        langage: 'js',
        editable: true,
        source: `// Chaque barre démarre 100ms après la précédente
bars
  .transition()
  .duration(650)
  .delay((d, i) => i * 100)   // d = donnée, i = index (0, 1, 2, ...)
  .attr('y', d => yScale(d.value))
  .attr('height', d => height - yScale(d.value))

// Résultat : barre 0 démarre à 0ms, barre 1 à 100ms,
// barre 2 à 200ms, etc. → effet "vague" de gauche à droite`,
      },
    },
  ],

  essentiel: [
    '`.transition()` transforme un changement instantané en animation fluide — il suffit de l\'insérer avant `.attr()`.',
    '`.duration(ms)` : durée de la transition en millisecondes (défaut : **250ms**).',
    '`.ease(fn)` contrôle l\'accélération : `easeCubic` (défaut, doux), `easeBounce` (rebond), `easeElastic` (élastique), `easeLinear` (constant).',
    '`.delay((d, i) => i * 100)` : délai différent par élément grâce à un **callback** — crée des animations en cascade.',
    'L\'ordre de la chaîne compte : `.transition().duration(800).ease(fn).attr(...)` — toujours `transition()` en premier.',
  ],

  pieges: [
    'Mettre `.attr()` **avant** `.transition()` change l\'état immédiatement puis anime vers rien — toujours placer `.transition()` avant les attributs à animer.',
    'Passer une **valeur fixe** à `.delay(500)` fait démarrer *tous* les éléments simultanément après 500ms — pour la cascade, utiliser un **callback** : `.delay((d, i) => i * 100)`.',
    'Ne pas chaîner plusieurs `.transition()` sur le même élément sans \`selection.interrupt()\` — les transitions s\'accumulent et se chevauchent de façon imprévisible.',
  ],

  patterns: [
    {
      titre: 'Bar chart animé avec entrée en cascade',
      code: `bars
  .transition()
  .duration(700)
  .ease(easeCubic)
  .delay((d, i) => i * 80)
  .attr('y', d => yScale(d.value))
  .attr('height', d => height - yScale(d.value))
  .attr('fill', 'steelblue')`,
    },
    {
      titre: 'Transition d\'entrée depuis le bas',
      code: `// D'abord positionner les barres en bas (hauteur 0)
bars
  .attr('y', height)
  .attr('height', 0)

// Puis animer vers leur vraie position
bars
  .transition()
  .duration(800)
  .ease(easeCubic)
  .delay((d, i) => i * 100)
  .attr('y', d => yScale(d.value))
  .attr('height', d => height - yScale(d.value))`,
    },
  ],
}
