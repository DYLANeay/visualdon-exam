# Schéma de contenu d'un module

Chaque module évalué a un fichier `src/lib/content/modules/<id>.js` qui exporte par
défaut un objet respectant ce schéma. La prose est en **markdown** (rendue par `marked`),
en **français**, fidèle aux slides du cours correspondant (`comem-visualdon-main/cours/`).

```js
export default {
  id: '05-echelles-axes',          // = nom du fichier de cours, sans .md
  titre: 'Échelles et axes',       // titre court
  accroche: '…',                   // 1–2 phrases avec une métaphore du quotidien (markdown inline)

  // Le cœur pédagogique : 3 à 6 sections qui expliquent simplement puis approfondissent.
  sections: [
    {
      titre: 'La solution : les échelles',
      corps: `Prose markdown. **Gras**, listes, métaphores, analogies, mini-histoires.
Une notion à la fois, du simple au précis.`,
      // Optionnel : un exemple de code. editable:true => deviendra un playground (étape 4).
      code: {
        langage: 'js',           // 'js' | 'svg' | 'html'
        editable: true,
        source: `const x = scaleLinear().domain([0, 100]).range([0, 800])`,
      },
    },
  ],

  // « L'essentiel » : les fondamentaux à retenir ABSOLUMENT (base du formulaire A4).
  // Phrases courtes, denses, autosuffisantes. Markdown inline autorisé (`code`).
  essentiel: [
    'Une échelle mappe un **domain** (données) vers un **range** (pixels).',
  ],

  // Pièges classiques / erreurs fréquentes à l'examen.
  pieges: [
    'Le `range` de l’axe Y est `[height, 0]` (inversé) car le SVG a Y=0 en haut.',
  ],

  // Patterns de code D3 récurrents (optionnel, surtout cours techniques).
  patterns: [
    { titre: 'Bar chart : scaleBand + scaleLinear', code: `…` },
  ],
}
```

## Règles de rédaction

- **Fidélité** : ne rien inventer hors du cours. Tu peux ajouter des métaphores et
  reformulations, mais les faits techniques viennent des slides.
- **Ton** : enseignant fun et motivant, tutoiement de l'élève, zéro jargon non expliqué.
- **Le cours 11 (Scrollytelling) n'existe pas** ici : aucun module ne le couvre.
- `essentiel` et `pieges` sont ce qui sert le plus à l'examen : sois rigoureux.
