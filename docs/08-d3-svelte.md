# 08 — Intégrer D3 avec Svelte

## Le problème de cohabitation

D3 et Svelte veulent tous les deux **contrôler le DOM**. C'est comme avoir deux chefs cuisiniers dans la même cuisine — ça peut vite mal tourner si on ne définit pas clairement qui fait quoi.

- **Svelte** : gère le DOM via son système de réactivité compilée. Il crée, met à jour et détruit les éléments.
- **D3** : manipule directement le DOM SVG avec `d3.select()`, `d3.append()`, etc.

Il faut choisir une stratégie claire.

---

## Stratégie 1 : Svelte gère le DOM, D3 fait les calculs

C'est l'approche la plus "pure" en Svelte. D3 sert uniquement pour ses utilitaires (scales, axes, paths géo…) et Svelte génère les éléments SVG.

```svelte
<script>
  import * as d3 from 'd3'

  let { data } = $props()

  // D3 pour les calculs uniquement
  const xScale = $derived(
    d3.scaleLinear()
      .domain([0, d3.max(data, d => d.value)])
      .range([0, 400])
  )

  const yScale = $derived(
    d3.scaleBand()
      .domain(data.map(d => d.label))
      .range([0, 300])
      .padding(0.1)
  )
</script>

<!-- Svelte génère les éléments SVG directement -->
<svg width="400" height="300">
  {#each data as d}
    <rect
      x={0}
      y={yScale(d.label)}
      width={xScale(d.value)}
      height={yScale.bandwidth()}
      fill="steelblue"
    />
  {/each}
</svg>
```

**Avantages :** réactivité Svelte native, animations Svelte possibles, code lisible.
**Inconvénients :** certaines fonctionnalités D3 avancées (brush, zoom, drag) sont difficiles à intégrer.

---

## Stratégie 2 : D3 gère tout le SVG (via `$effect` + `bind:this`)

C'est l'approche la plus courante quand on a du D3 existant ou des features avancées. Svelte cède le contrôle du SVG entier à D3.

```svelte
<script>
  import * as d3 from 'd3'

  let { data } = $props()
  let svgEl = $state(null)  // référence à l'élément SVG réel

  $effect(() => {
    // svgEl est null au premier rendu, disponible après le montage
    if (!svgEl || !data.length) return

    // Dimensions
    const width = 600, height = 400
    const margin = { top: 20, right: 20, bottom: 40, left: 50 }
    const innerWidth = width - margin.left - margin.right
    const innerHeight = height - margin.top - margin.bottom

    // Nettoyer le SVG avant de redessiner
    // (important pour éviter les doublons quand data change)
    d3.select(svgEl).selectAll('*').remove()

    // Créer le groupe principal
    const svg = d3.select(svgEl)
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`)

    // Scales
    const x = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.value)])
      .range([0, innerWidth])

    const y = d3.scaleBand()
      .domain(data.map(d => d.label))
      .range([0, innerHeight])
      .padding(0.1)

    // Barres
    svg.selectAll('rect')
      .data(data)
      .join('rect')
        .attr('x', 0)
        .attr('y', d => y(d.label))
        .attr('width', d => x(d.value))
        .attr('height', y.bandwidth())
        .attr('fill', 'steelblue')

    // Axes
    svg.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(d3.axisBottom(x))

    svg.append('g')
      .call(d3.axisLeft(y))

    // Cleanup : détruire le SVG si le composant est démonté
    return () => {
      d3.select(svgEl).selectAll('*').remove()
    }
  })
</script>

<!-- bind:this donne à Svelte la référence à l'élément DOM réel -->
<svg bind:this={svgEl}></svg>
```

**Avantages :** D3 complet disponible (brush, zoom, drag, transitions fluides).
**Inconvénients :** Svelte ne contrôle plus le SVG — pas d'animations Svelte, code plus verbeux.

---

## Détail crucial : `bind:this`

```svelte
<script>
  let svgEl = $state(null)
  // Au moment de l'exécution du script → svgEl = null
  // Après le premier rendu DOM → svgEl = <svg> réel
</script>

<svg bind:this={svgEl}></svg>
```

`bind:this` est la colle entre Svelte et D3. Sans lui, tu n'as pas de référence à l'élément SVG et D3 ne peut pas s'y accrocher.

> **Important** : dans `$effect`, toujours vérifier `if (!svgEl) return` parce que l'effet peut s'exécuter avant que l'élément soit dans le DOM.

---

## Réactivité : redessiner quand les données changent

```svelte
<script>
  let { data } = $props()
  let svgEl = $state(null)

  $effect(() => {
    // Svelte détecte automatiquement que cet effet dépend de `data` et `svgEl`
    // Il se ré-exécutera à chaque changement de l'un ou l'autre
    if (!svgEl || !data) return

    d3.select(svgEl).selectAll('*').remove()
    // ... reconstruire le graphique
  })
</script>
```

C'est la magie de `$effect` : il piste les dépendances automatiquement. Quand `data` change (parce que le parent passe de nouvelles props), D3 redessine tout.

---

## Redimensionnement responsive

```svelte
<script>
  import * as d3 from 'd3'
  let conteneur = $state(null)
  let largeur = $state(600)

  // Observer le changement de taille du conteneur
  $effect(() => {
    if (!conteneur) return
    const observer = new ResizeObserver(([entry]) => {
      largeur = entry.contentRect.width
    })
    observer.observe(conteneur)
    return () => observer.disconnect()
  })

  let svgEl = $state(null)

  $effect(() => {
    if (!svgEl || largeur === 0) return
    // Redessine quand `largeur` change
    const height = largeur * 0.6  // ratio 5:3
    // ...construire le graphique avec la nouvelle largeur
  })
</script>

<div bind:this={conteneur}>
  <svg bind:this={svgEl}></svg>
</div>
```

---

## Quand laisser D3 manipuler le SVG ?

| Situation | Stratégie recommandée |
|---|---|
| Graphique simple (barres, lignes) | Svelte pour le DOM, D3 pour les calculs |
| Graphique avec axes D3 | D3 pour tout le SVG (`$effect` + `bind:this`) |
| Zoom / brush / drag | D3 pour tout (les interactions D3 nécessitent son accès au DOM) |
| Cartographie (GeoPath, projections) | D3 pour le SVG, Svelte pour la UI autour |
| Animations de transitions | D3 transitions si complexe, sinon CSS Svelte |

---

## Exemple concret : carte choroplèthe avec D3 + Svelte

```svelte
<script>
  import * as d3 from 'd3'
  import * as topojson from 'topojson-client'

  let svgEl = $state(null)

  $effect(() => {
    if (!svgEl) return

    const width = 800, height = 500
    const projection = d3.geoMercator().fitSize([width, height], geoData)
    const path = d3.geoPath().projection(projection)

    const svg = d3.select(svgEl)
      .attr('viewBox', `0 0 ${width} ${height}`)

    svg.selectAll('path')
      .data(features)
      .join('path')
        .attr('d', path)
        .attr('fill', d => colorScale(d.properties.value))
        .attr('stroke', '#fff')
        .attr('stroke-width', 0.5)

    return () => svg.selectAll('*').remove()
  })
</script>

<svg bind:this={svgEl} class="w-full"></svg>
```

---

## Récap

- `bind:this={el}` → référence à l'élément DOM réel, essentiel pour D3.
- `$effect(() => { … })` → déclenche D3 après le rendu, se ré-exécute quand les dépendances changent.
- Toujours faire `d3.select(el).selectAll('*').remove()` avant de redessiner.
- Retourner une fonction de cleanup depuis `$effect` pour éviter les fuites mémoire.
- Pour les graphiques simples : Svelte gère le DOM, D3 fait les maths.
- Pour les interactions avancées (zoom, brush) : laisser D3 tout gérer.
