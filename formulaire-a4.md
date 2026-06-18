# FORMULAIRE A4 — VisualDon (recto/verso)

> Fidèle au matériel du cours (cours 02→10, 12 ; **cours 11 Scrollytelling non évalué**).
> À copier dans Figma. Tout est dense exprès : tu tailleras à la mise en page.

---
---

# ░░ RECTO ░░ — LE CODE D3 QUI TRAITE DE TOUT

## ⭐ MÉGA-EXEMPLE : bar chart D3 complet, intégralement commenté

Cet exemple couvre **à lui seul** : convention des marges, `scaleBand`, `scaleLinear`,
axes, data binding `.data().join()`, barres qui partent du bas, labels, tooltip,
transitions et événements. C'est LE pattern récurrent de l'examen.

```javascript
import { select } from 'd3-selection'          // sélection / manipulation DOM
import { scaleBand, scaleLinear } from 'd3-scale'
import { axisBottom, axisLeft } from 'd3-axis'
import { max } from 'd3-array'
import { transition } from 'd3-transition'

// ── 1. DONNÉES ───────────────────────────────────────────────
// (après un d3.csv, on convertit les chaînes en nombres avec +)
const data = [
  { categorie: 'Vélo',        accidents: 142 },
  { categorie: 'Piéton',      accidents:  89 },
  { categorie: 'Moto',        accidents: 203 },
  { categorie: 'Voiture',     accidents: 310 },
  { categorie: 'Trottinette', accidents:  67 },
]

// ── 2. CONVENTION DES MARGES ─────────────────────────────────
// On réserve de l'espace pour les axes. La zone de dessin "propre"
// fait innerW × innerH ; le <g> est décalé de (left, top).
const margin = { top: 20, right: 20, bottom: 50, left: 60 } // bottom/left + grands = place pour les axes
const width = 500, height = 350
const innerW = width  - margin.left - margin.right
const innerH = height - margin.top  - margin.bottom

const svg = select('#chart')
  .append('svg')
  .attr('width',  width)
  .attr('height', height)

const g = svg.append('g')                       // groupe = zone de dessin
  .attr('transform', `translate(${margin.left}, ${margin.top})`)

// ── 3. ÉCHELLES (data → pixels) ──────────────────────────────
// scaleBand : catégories discrètes → bandes de largeur égale (bar chart)
const x = scaleBand()
  .domain(data.map(d => d.categorie))           // toutes les catégories
  .range([0, innerW])                           // de gauche à droite
  .padding(0.25)                                // espace entre barres (0→1) : + grand = barres + fines

// scaleLinear : valeurs continues → position verticale
const y = scaleLinear()
  .domain([0, max(data, d => d.accidents)])     // de 0 (TOUJOURS commencer à 0 !) au max
  .range([innerH, 0])                           // ⚠ INVERSÉ : y=0 px est EN HAUT en SVG

// ── 4. AXES (dessinés dans un <g> via .call) ─────────────────
g.append('g')
  .attr('transform', `translate(0, ${innerH})`) // axe X poussé tout en bas
  .call(axisBottom(x))

g.append('g')
  .call(axisLeft(y))                            // axe Y reste à gauche (x=0)

// ── 5. DATA BINDING + BARRES ─────────────────────────────────
// .data().join('rect') : crée les rect manquants (enter), met à jour
// les existants (update), supprime les superflus (exit).
g.selectAll('rect')
  .data(data)
  .join('rect')
    .attr('x',      d => x(d.categorie))         // position via l'échelle de bande
    .attr('y',      d => y(d.accidents))         // haut de la barre
    .attr('width',  x.bandwidth())              // largeur d'une bande (calculée par scaleBand)
    .attr('height', d => innerH - y(d.accidents)) // hauteur = bas − sommet (barre part du bas)
    .attr('fill',   'steelblue')

// ── 6. LABELS (valeur au-dessus de chaque barre) ─────────────
g.selectAll('text.val')
  .data(data)
  .join('text')
    .attr('class', 'val')
    .attr('x', d => x(d.categorie) + x.bandwidth() / 2) // centré sur la barre
    .attr('y', d => y(d.accidents) - 5)
    .attr('text-anchor', 'middle')
    .text(d => d.accidents)

// ── 7. INTERACTION + TRANSITION ──────────────────────────────
// function (PAS arrow) : "this" = l'élément DOM survolé.
// Avec (event, d) => {...}, this ne pointerait PAS sur le <rect>.
const tooltip = select('#tooltip')             // <div> positionné en CSS absolute

g.selectAll('rect')
  .on('mouseover', function (event, d) {
    select(this)                                // this = le rect survolé
      .transition().duration(150)               // changement ANIMÉ (sinon instantané)
      .attr('fill', 'orange')
    tooltip
      .style('opacity', 1)
      .style('left', event.pageX + 12 + 'px')   // +12 : décalé à droite pour ne pas masquer le curseur
      .style('top',  event.pageY - 30 + 'px')
      .html(`<strong>${d.categorie}</strong><br>${d.accidents} accidents`) // .html pour insérer <strong>/<br>
  })
  .on('mouseout', function (event, d) {
    select(this).transition().duration(150).attr('fill', 'steelblue')
    tooltip.style('opacity', 0)
  })
```

---

## 🔑 CONCEPTS CLÉS — D3 / SVG / JS

### SVG (cours 02)
- **Vectoriel** (formes mathématiques, zoom sans perte, dans le DOM) vs **matriciel/Canvas** (pixels, pixelise au zoom, hors DOM).
- **Repère SVG** : origine `(0,0)` **en haut à gauche** ; `x` → droite, `y` → **bas** (inverse des maths).
- Formes : `<rect x y width height>`, `<circle cx cy r>`, `<line x1 y1 x2 y2>`, `<polygon points>`, `<path d>`, `<text>`.
  - ⚠ `<rect x="20" y="40" w="60" h="60">` = coin **supérieur gauche** en (20,40), PAS le centre.
- Style : `fill`, `stroke`, `stroke-width`, `opacity` (globale 0–1), `fill-opacity`, `stroke-dasharray` (tirets), `rx` (coins arrondis).
- `<path d="...">` : `M x y` (move, sans tracer) · `L x y` (line) · `H x` (horizontale) · `V y` (verticale) · `Z` (ferme). Utilisé par D3 pour arcs/courbes/cartes.
- `<g>` groupe + hérite des attributs ; `transform="translate(x,y) rotate(deg) scale(k)"`.

### Canvas (cours 02)
- **Impératif** : `ctx.fillRect()`, `ctx.beginPath()` / `ctx.arc()` / `ctx.fill()`, `ctx.moveTo`/`lineTo`/`stroke`.
- Pas de DOM, pas d'interactivité native, mais **performant > 10 000 éléments**. SVG sinon (dataviz, hover, accessible).

### DOM & D3-selection (cours 03)
- **DOM** = arbre d'objets que JS lit/modifie. SVG est dans le DOM → manipulable comme du HTML.
- **D3** = *Data-Driven Documents* (Mike Bostock, 2011, maintenu par Observable). **Modulaire** : on importe `d3-selection`, `d3-scale`…
- Équivalences : `querySelector`→`select` · `querySelectorAll`→`selectAll` · `setAttribute`→`.attr()` · `.style`→`.style()` · `.textContent`→`.text()` · `createElementNS`+`appendChild`→`.append()` (gère le namespace SVG) · `addEventListener`→`.on()`.
- **Method chaining** : chaque méthode retourne la sélection → on enchaîne.

### Données (cours 04)
- **Qualitative** : nominale (sans ordre : pays), ordinale (ordre : S/M/L), binaire (oui/non).
- **Quantitative** : discrète (entiers), continue (réels).
- Formats : **CSV** (virgules, en-têtes 1re ligne), **TSV** (tabulations), **JSON** (types préservés, imbrication, APIs), **XML** (verbeux).
- Chargement (`d3-fetch`) : `csv()` / `json()` / `tsv()`. ⚠ **CSV retourne tout en chaînes** → convertir avec `+d.x` (sinon `"100"+"200"="100200"`).
- `d3-array` : `max`, `min`, `sum`, `mean`, `extent` (→ `[min, max]`). Tous acceptent un **accesseur** : `max(data, d => d.pop)`.
- Méthodes tableau : `map` (transforme, **nouveau** tableau) · `filter` (garde si `true`) · `includes` · `reduce(acc,d)=>...,init` (agrège/compte) · `forEach` (effet de bord, ne retourne rien) · `sort((a,b)=>a-b)` croissant / `b-a` décroissant (**mute** ! `[...data].sort()` pour éviter).

### Data binding (cours 04)
- `selectAll().data(arr).join('tag')` : lie données ↔ DOM.
- **Enter** (donnée sans élément → créer) · **Update** (donnée + élément → modifier) · **Exit** (élément sans donnée → supprimer).
- `.join(enter=>…, update=>…, exit=>…)` pour contrôler chaque cas.
- Dans les callbacks : `d` = donnée liée, `i` = index. Une **clé** `.data(arr, d => d.id)` garantit l'identité des éléments entre updates.

### Échelles (cours 05) — *une échelle = fonction `domain` → `range`*
| Échelle | Entrée → sortie | Usage |
|---|---|---|
| `scaleLinear` | continue → continue | positions, tailles, axes numériques |
| `scaleTime` | dates → continue | séries temporelles |
| `scaleSqrt` | continue → continue (√) | **aire** des bulles (cf. éthique : rayon ≠ aire) |
| `scaleQuantize` | continue → discrète (range régulier) | choroplèthe |
| `scaleThreshold` | continue → discrète (seuils définis) | classes métier |
| `scaleOrdinal` | catégories → valeurs | couleurs par catégorie |
| `scaleBand` | catégories → bandes égales | bar charts (`.bandwidth()`, `.padding()`) |

- `range([innerH, 0])` pour Y : **inversé** car y=0 px est en haut.
- Axes (`d3-axis`) : `axisBottom(x)`, `axisLeft(y)` (+ `axisTop`/`axisRight`) ; dessinés via `g.append('g').call(axis)`.

### Interaction & animation (cours 06–07)
- **Transition** = interpolation animée d'un état à l'autre : `.transition().duration(ms).ease(fn).attr(...)`. Défaut **250 ms**.
- `.duration(150)` < `.duration(1000)` → **150 ms est PLUS RAPIDE** (durée + courte = + rapide).
- **Easing** (`d3-ease`) : `easeLinear` (constant), `easeCubic` (défaut, accél/décél), `easeBounce`, `easeElastic`.
- **Délai** en cascade : `.delay((d, i) => i * 100)`.
- **Événements** : `.on('mouseover'/'mouseout'/'click', function(event, d){…})`. Utiliser `function` (pas arrow) pour que `this` = élément DOM ; `select(this)` pour le cibler. `event.pageX/pageY` = position curseur.
- `.html()` (insère des balises) vs `.text()` (texte brut).
- **Zoom** (`d3-zoom`) : `zoom().on('zoom', e => g.attr('transform', e.transform))`, `svg.call(zoomBehavior)`. `event.transform = {x, y, k}`. Contraintes : `.scaleExtent([1,5])`, `.translateExtent([[0,0],[w,h]])`.
- **Animation pas-à-pas** : `setInterval(fn, ms)` / `clearInterval(id)` (ex. année par année).

---
---

# ░░ VERSO ░░ — CARTOGRAPHIE · ÉTHIQUE · DIVERS

## 🗺️ CARTOGRAPHIE (cours 08–09)

### Projections
- **Projection** = transformation de la surface (sphère) sur un plan. Toute projection **déforme** quelque chose (surfaces, angles ou distances) — impossible d'aplatir une sphère sans distorsion.
- **Mercator** : préserve les **angles** → navigation maritime, caps constants en lignes droites. MAIS déforme les **surfaces** (Groenland ≈ Afrique alors que 14× plus petit ; Europe agrandie/centrée → outil politique).
- **Equal-Area / équivalente** : préserve les **surfaces** → comparer densités/quantités par pays (densité de population mondiale).
- **Natural Earth** : compromis esthétique → infographie grand public.
- d3-geo : `geoEqualEarth()`, `geoMercator()`, `geoOrthographic()` (globe), `geoConicConformal()` (Suisse CH1903+).

### GeoJSON (cours 09)
- Format standard web pour la géo. Structure : `Feature` { `geometry` { `type`, `coordinates` }, `properties` {…} } ; **FeatureCollection** = tableau de Features.
- Géométries : **Point** (lieu/station), **LineString** (route, **trajectoire** d'un cyclone), **Polygon** (zone/pays/canton), **MultiPolygon** (pays à plusieurs morceaux).
- ⚠ **Coordonnées = `[longitude, latitude]`** (lon AVANT lat !). Inverser `[46.52, 6.63]`→`[6.63,46.52]` place le point au mauvais endroit (ici, dans la mer/au large).
- Un centre `[8.2, 46.8]` = **[longitude, latitude]** du centre de la Suisse.
- Exemple minimal (station vélo Lausanne) :
```json
{ "type": "Feature",
  "geometry": { "type": "Point", "coordinates": [6.63, 46.52] },
  "properties": { "nom": "Riponne", "velos": 8 } }
```
- Autres formats : **TopoJSON** (topologie partagée, ~80% + léger), **Shapefile** (ESRI/SIG), **WKT**, **GeoParquet**.

### d3-geo : GeoJSON → SVG
```javascript
const projection = d3.geoEqualEarth().fitSize([width, height], geojson) // ajuste auto
const path = d3.geoPath().projection(projection)   // générateur de chemins
svg.selectAll('path').data(geojson.features).join('path')
   .attr('d', path)            // chaque feature → un <path>
   .attr('fill', d => color(d.properties.value))
```
- `.fitSize([w,h], geojson)` / `.fitExtent([[l,h],[r,b]], geojson)` (avec marges) pour cadrer automatiquement.

### Librairies carto (cours 09)
| Lib | Rendu | Usage |
|---|---|---|
| **d3-geo** | SVG | cartes sur mesure, choroplèthes statiques, contrôle total |
| **MapLibre GL JS** | WebGL / vector tiles | cartes interactives + fond de carte |
| **Deck.gl** | WebGL | données massives (millions de points) |
| **Leaflet** | DOM | cartes raster légères |
| **Kepler.gl** | WebGL | exploration no-code |
- MapLibre : `addSource` (données) puis `addLayer` (rendu) ; attendre `map.on('load')`. Style dynamique via expressions `['get','prop']`, `['interpolate',['linear'],…]`, `['match',…]`, `['case',…]`.

### Types de cartes (cours 08)
| Type | Principe |
|---|---|
| **Référence** | localisation/navigation (Google Maps, Swisstopo) |
| **Qualitative** | catégories par couleur, **sans hiérarchie** (langues, partis) |
| **Choroplèthe** | **colore des zones** selon une valeur (intensité) |
| **Cercles proportionnels / bulles** | valeur encodée dans la **taille** d'un symbole |
| **Cartogramme** | **surface** de la zone ∝ variable (déforme la géo) |
| **Flowmap** | flux/migrations (épaisseur des lignes) |
| **Heatmap** | densité de points |
| **Topographique** | relief/altitude · **Topologique** : réseaux (métro), distances non respectées |
- **Choroplèthe vs cercles proportionnels** : choroplèthe = couleur de zones, idéale pour des **taux/densités/ratios** (ex. taux de chômage par canton) ; cercles = taille de symbole, mieux pour des **totaux absolus** (ne fait pas croire que les grandes zones « pèsent » plus).
- ⚠ **Piège choroplèthe** : colorer des **valeurs absolues** (nombre total de crimes) → les grands/peuplés cantons ressortent foncés mécaniquement. **Correction : normaliser** (taux pour 1 000 hab.).
- **Trajectoires de cyclones** : géométrie **LineString** (suite de points = trajet) ; type de carte = carte de **flux/lignes** sur fond de référence.
- **Variables visuelles** (Bertin, 1967) : taille, valeur, grain, couleur, orientation, forme. Couleurs catégorielles = **perceptuellement équidistantes**.
- **Pouvoir de la carte** : nommer = exister ; choisir un centre = définir la périphérie ; ce qui n'est pas cartographié « n'existe pas » (Golfe du Mexique→« d'Amérique » 2025 ; John Snow choléra 1854 = carte comme preuve).

---

## ⚖️ ÉTHIQUE ET BIAIS (cours 10)

### Dos & Don'ts (les classiques de l'examen)
- **Axe Y tronqué** : ne pas commencer à 0 dramatise une variation. *Ex. abonnés 952k→1005k avec axe à 950k = « explosion » trompeuse.* **Correction : axe à 0** (ou clairement signaler la coupure pour des séries où le 0 n'a pas de sens).
- **Valeurs absolues sans normalisation** : USA « investit le plus » en santé en milliards → trompeur car non rapporté à la population/PIB. **Correction : par habitant ou en % du PIB.**
- **Rayon vs aire des bulles** : encoder une valeur dans le **rayon** exagère (aire ∝ rayon² → doubler la valeur quadruple l'aire perçue). **Correction : encoder l'AIRE** (`scaleSqrt`).
- **Mise en évidence sélective** : choisir couleur vive / 1re position pour le seul cas favorable = biais de présentation. **Correction : traitement visuel neutre et égal.**
- **Corrélation ≠ causalité** (chocolat ↔ prix Nobel) : courbes semblables ne prouvent aucun lien ; chercher un mécanisme.
- **3D** déforme la perception · **camemberts > 5 parts** illisibles · **double axe Y** crée une corrélation illusoire · **cumul** trompeur.
- **Orientation de l'axe construit le récit** (Iraq's bloody toll, Scarr vs Cotgreave : mêmes données, message opposé).
- **Accessibilité** : ~8 % des hommes / 0,5 % des femmes daltoniens → ne pas coder par la couleur seule (formes/motifs/contraste), éviter rouge/vert seuls.
- **Barres** : tourner à l'horizontale si étiquettes longues ; **trier par valeur** (pas alphabétique), sauf ordre naturel (mois, âges).

### Biais plus profonds
- **Données jamais neutres** : qui collecte ? qui est compté ? **qui est absent** (l'absence de données est une donnée) — *Data Feminism*, D'Ignazio & Klein.
- **Biais algorithmiques** : données d'entraînement discriminatoires, objectifs d'optimisation (engagement→extrême), boucles de rétroaction, choix de design. *Cas **COMPAS** (récidive) : 2× plus de faux positifs pour personnes racisées (ProPublica 2016).*
- **Biais cognitifs** : Codex (Benson & Manoogian, 180+) → trop d'info / manque de sens / agir vite / se souvenir.
- **Quartet d'Anscombe** : 4 jeux aux **stats identiques** (moyenne, variance, corrélation) mais formes très différentes → **visualiser avant de conclure**.
- **Biais données vs biais représentation** : *données* = l'échantillon est biaisé (ex. sondage non représentatif) ; *représentation* = données correctes mais graphique trompeur (ex. axe tronqué).
- **Choix de graphique** : corrélation revenu ↔ espérance de vie sur 150 pays → **nuage de points (scatter plot)** (deux variables quantitatives continues).
- **Bonnes pratiques** : sourcer, montrer l'incertitude, contextualiser les absences, design accessible, transparence sur les choix (échelles, projections, filtres).

---

## 🧰 ALTERNATIVES À D3 (cours 12)
- **Observable Plot** (haut niveau, sur D3, déclaratif : décrire *quoi*) · **Chart.js** (Canvas, 8 types, simple) · **Vega/Vega-Lite** (spec JSON déclarative) · **p5.js** (creative coding, Canvas) · **three.js** (3D/WebGL) · **Deck.gl** (>100k points) · **roughViz** (style dessiné main).
- **Framework + D3** (React/Vue/Svelte) : le framework gère le DOM/réactivité, **D3 calcule** (échelles, générateurs, projections) — plus de `.select()`/`.join()`.
- Choix de l'outil selon : complexité, volume, interactivité, rendu (SVG/Canvas/WebGL), audience, intention (exploration / narration / immersion), maintenance, performance.

---

## 📌 ANTI-SÈCHE « pièges QCM »
- `d3.extent([3,8,1,6,2])` → `[1, 8]` (et non le max).
- `data.filter(d => d > 7)` sur `[12,5,8,20,3]` → `[12, 8, 20]`.
- `.join('circle')` : crée manquants + met à jour existants + supprime superflus.
- `+d.population` après `d3.csv` : convertit **chaîne → nombre** (CSV = tout en string).
- `d` dans `data([5,15,25]).attr('width', d=>…)` = **la valeur liée** (5/15/25), pas l'index.
- `scaleLinear` (continu) vs `scaleBand` (catégories discrètes).
- GeoJSON : coordonnées **[longitude, latitude]**.
- `function(event,d)` plutôt qu'arrow → `this` = élément DOM.
- `range:[height,0]` pour Y car axe SVG orienté vers le bas.
- `.padding(0.25)→0.7` rend les barres **plus fines**, pas plus larges.
```

---

## 🎯 RÉFLEXES CALQUÉS SUR L'EXAMEN BLANC

**Format exact** : P1 QCM (20 pts, 10×2) · P2 D3 vrai/faux + justif si faux (36 pts, 18×2) · P3 Cartographie (25 pts, ouvertes) · P4 Éthique (15 pts, ouvertes).

### Partie 2 — pièges « VRAI / FAUX, justifier si faux »
- *Barre France (68.4) plus large que Allemagne (84.1) avec `width = d.population*5` ?* → **FAUX** : largeur ∝ population, Allemagne > France donc plus large.
- *`translate(10, ${i*45+10})` espace de 45 px verticalement ?* → **VRAI** (chaque groupe décalé de 45 px).
- *Retirer un pays et ré-exécuter lève une erreur ?* → **FAUX** : `.join()` gère enter/update/**exit** sans erreur (l'élément en trop est supprimé).
- *`d.population*5` est une mauvaise pratique (barre peut dépasser le SVG) ?* → **VRAI** : il faut une **échelle** (`scaleLinear` avec `range` borné par la largeur dispo).
- *`d3.max(data, d=>d.accidents)` = 203 ?* → **FAUX** : le max est **310** (Voiture).
- *`range:[height-margin.bottom, margin.top]` car Y SVG va vers le bas ?* → **VRAI**.
- *Hauteur barre = `height - margin.bottom - yScale(d)` ?* → **VRAI** (bas − sommet).
- *`.padding(0.25)→0.7` élargit les barres ?* → **FAUX** : les **rétrécit** (plus d'espace entre elles).
- *`margin.bottom=50` pour les étiquettes de l'axe X ?* → **VRAI**.
- *Sans `+` devant `d.trajets`, `"100"+"200"="100200"` ?* → **VRAI** (concaténation de chaînes).
- *`recents` = tout `parsed` trié par année ?* → **FAUX** : `filter(d=>d.annee>=2020)` **filtre** (ne trie pas, peut en retirer).
- *`reduce(...)` → tableau d'objets `[{ville,total}]` ?* → **FAUX** : c'est un **objet** `{ ville: total }` (paires clé→valeur).
- *`top3` = 3 villes max sous forme `[nom, total]` ?* → **VRAI** (`Object.entries` + `sort` + `slice(0,3)`).
- *`mouseover` change la couleur instantanément ?* → **FAUX** : `.transition().duration(150)` → **animé**.
- *`.html()` plutôt que `.text()` pour insérer `<strong>`/`<br>` ?* → **VRAI**.
- *Remplacer `function` par arrow `=>` ne change rien à `select(this)` ?* → **FAUX** : `this` ne pointerait plus sur le `<rect>`.
- *`event.pageX+12` décale le tooltip à droite du curseur ?* → **VRAI**.
- *`.duration(150)→1000` accélère le retour au bleu ?* → **FAUX** : **ralentit** (durée plus longue).

### Partie 3 — carto (réponses-types) → voir bloc CARTOGRAPHIE
projection & distorsions · Mercator(angles)/EqualArea(surfaces)/NaturalEarth(grand public) · `[lon, lat]` · GeoJSON minimal · choroplèthe vs cercles · normaliser les absolus · LineString pour trajectoires.

### Partie 4 — éthique (réponses-types) → voir bloc ÉTHIQUE
axe tronqué→commencer à 0 · absolus→normaliser/par habitant · rayon→aire (`scaleSqrt`) · mise en évidence sélective→neutralité · scatter pour 2 variables continues · biais données vs représentation.
