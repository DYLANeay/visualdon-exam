export default {
  id: '09-cartographie-web',
  titre: 'Cartographie web',
  accroche:
    'Des coordonnées GPS à un beau `<path>` SVG ou une carte vectorielle interactive : ce cours est le **couteau suisse** du cartographe web. GeoJSON, d3-geo, MapLibre, Deck.gl - tu sais maintenant quel outil sortir selon la mission.',

  sections: [
    {
      titre: 'GeoJSON : le format standard du web géographique',
      corps: `GeoJSON est le format de référence pour les données géographiques sur le web (RFC 7946). Sa structure est simple : un objet JSON avec un **type** de géométrie et des **coordonnées**.

**Types de géométries à connaître :**
- \`Point\` - un lieu précis (une ville, un marqueur)
- \`LineString\` - un chemin, une route, une rivière
- \`Polygon\` - une zone fermée (un canton, un bâtiment)
- \`MultiPolygon\` - plusieurs zones (la France avec ses îles)
- \`FeatureCollection\` - tableau de \`Feature\`, le conteneur habituel

**⚠️ Piège classique de l'examen :** l'ordre des coordonnées dans GeoJSON est **\`[longitude, latitude]\`** - c'est l'inverse de ce qu'on dit en français ("latitude, longitude"). Pense à Google Maps : tu lis "46.78, 6.64" (lat, lon) mais en GeoJSON tu écris \`[6.64, 46.78]\` (lon, lat).`,
      code: {
        langage: 'js',
        editable: false,
        source: `// Une Feature GeoJSON : Point HEIG-VD
{
  "type": "Feature",
  "geometry": {
    "type": "Point",
    "coordinates": [6.6416, 46.7818]  // [LONGITUDE, latitude] ← ordre crucial !
  },
  "properties": {
    "name": "HEIG-VD",
    "city": "Yverdon-les-Bains"
  }
}

// Une FeatureCollection
{
  "type": "FeatureCollection",
  "features": [
    { "type": "Feature", "geometry": { ... }, "properties": { ... } },
    { "type": "Feature", "geometry": { ... }, "properties": { ... } }
  ]
}`,
      },
    },
    {
      titre: 'Autres formats et sources de données',
      corps: `**Formats alternatifs à GeoJSON :**

| Format | Caractéristiques |
|--------|-----------------|
| **TopoJSON** | Extension de GeoJSON avec topologie partagée. Compression ~80%. Idéal pour les cartes complexes (frontières partagées stockées une seule fois). |
| **Shapefile** | Format ESRI historique (.shp, .dbf, .shx). Encore très répandu dans les administrations et les SIG. |
| **WKT** | Well-Known Text, représentation textuelle de géométries. |
| **GeoParquet** | Format colonnaire pour le big data géospatial. |

**Sources de données géographiques :**
- **OpenStreetMap** : la "Wikipedia des cartes", collaborative, libre (ODbL). Accès via Overpass Turbo pour des requêtes ciblées ou Geofabrik pour des extractions régionales.
- **Natural Earth** : données vectorielles mondiales libres, parfaites pour les cartes à petite échelle.
- **Swisstopo / opendata.swiss** : données suisses officielles.
- **Nominatim** : géocodage (adresse → coordonnées) et géocodage inverse - basé sur OSM, gratuit, limite 1 req/seconde.`,
    },
    {
      titre: 'd3-geo : cartes SVG personnalisées',
      corps: `**d3-geo** dessine des cartes directement en SVG dans le navigateur, à partir de données GeoJSON. C'est l'outil idéal pour les choroplèthes intégrées dans une page web, avec contrôle total sur les couleurs, les styles et les animations.

Le flux de travail est simple : **GeoJSON → projection → geoPath → \`<path>\` SVG**.

1. **Projection** : convertit des coordonnées en degrés (lon, lat) en pixels (x, y) pour l'écran.
2. **geoPath** : générateur qui transforme chaque feature GeoJSON en chaîne SVG \`d="..."\`.

**Projections disponibles :**
- \`d3.geoEqualEarth()\` - surfaces préservées, compromis visuel agréable ← recommandée en cours
- \`d3.geoMercator()\` - angles préservés, surfaces déformées
- \`d3.geoOrthographic()\` - vue globe 3D
- \`d3.geoConicConformal()\` - projection suisse (CH1903+)

**Ajustement de la projection :**
- \`.fitExtent([[left, top], [right, bottom]], geojson)\` - cadrage automatique avec marges
- \`.fitSize([width, height], geojson)\` - cadrage automatique sans marges
- Manuel : \`.scale()\`, \`.translate()\`, \`.center()\``,
      code: {
        langage: 'js',
        editable: true,
        source: `import { geoEqualEarth, geoPath } from 'd3-geo'

const width = 800, height = 500

// 1. Définir la projection
const projection = geoEqualEarth()
  .fitExtent([[12, 12], [width - 12, height - 12]], geojsonData)

// 2. Créer le générateur de chemins SVG
const path = geoPath().projection(projection)

// 3. Dessiner les features : chaque Feature → un <path>
svg.selectAll('path')
  .data(geojsonData.features)
  .join('path')
  .attr('d', path)           // génère l'attribut "d" du chemin SVG
  .attr('fill', '#E92528')
  .attr('stroke', '#fff')
  .attr('stroke-width', 0.5)`,
      },
    },
    {
      titre: 'MapLibre GL JS : cartes interactives vectorielles',
      corps: `**MapLibre GL JS** est un fork open-source de Mapbox GL JS (licence BSD). Il utilise **WebGL** pour un rendu haute performance, des cartes 3D, et des **tuiles vectorielles** (données allégées, style appliqué côté client).

**Concepts clés :**
- **Style** : fichier JSON qui définit l'apparence complète de la carte (fond, routes, labels). On le charge depuis une URL (Carto, OpenFreeMap, MapTiler…).
- **Source** : les données à afficher (GeoJSON, tiles, image…).
- **Couche (layer)** : une représentation visuelle d'une source. Une même source peut alimenter plusieurs couches (remplissage + contour).
- **Événements** : \`map.on('load', ...)\` pour attendre que la carte soit prête avant d'ajouter des données. \`map.on('mousemove', 'layerId', ...)\` pour l'interactivité.

**Fournisseurs de styles gratuits (sans clé API) :**
- **Carto** : Voyager, Positron, Dark Matter
- **OpenFreeMap** : Liberty, Positron, Bright`,
      code: {
        langage: 'js',
        editable: true,
        source: `import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'  // CSS obligatoire !

// 1. Créer la carte
const map = new maplibregl.Map({
  container: 'map',       // id du div HTML (doit avoir une hauteur !)
  style: 'https://tiles.openfreemap.org/styles/positron',
  center: [6.64, 46.78], // [longitude, latitude]
  zoom: 11
})

// 2. Ajouter une source GeoJSON et des couches après le chargement
map.on('load', async () => {
  const geojson = await fetch('cantons.geojson').then(r => r.json())

  map.addSource('cantons', { type: 'geojson', data: geojson })

  map.addLayer({
    id: 'cantons-fill',
    type: 'fill',
    source: 'cantons',
    paint: { 'fill-color': '#E92528', 'fill-opacity': 0.5 }
  })

  map.addLayer({
    id: 'cantons-outline',
    type: 'line',
    source: 'cantons',
    paint: { 'line-color': '#fff', 'line-width': 1 }
  })
})`,
      },
    },
    {
      titre: 'MapLibre : expressions, interactivité et Deck.gl',
      corps: `**Expressions MapLibre** : les propriétés visuelles (couleur, opacité, taille) peuvent être liées dynamiquement aux données via des expressions JSON :

- \`['get', 'population']\` - lire une propriété de la feature
- \`['interpolate', ['linear'], ['get', 'population'], 1000000, '#fadadb', 85000000, '#7a0c0e']\` - choroplète continue
- \`['match', ...]\` - correspondance par catégorie
- \`['feature-state', 'hover']\` - état dynamique pour le hover

**Animations de caméra :**
- \`map.flyTo({ center, zoom, pitch, bearing, duration })\` - animation type "vol"
- \`map.easeTo({ pitch, bearing, duration })\` - transition linéaire douce
- \`pitch\` (0–85°) = inclinaison pour la vue 3D · \`bearing\` = rotation

**Deck.gl** : bibliothèque WebGL haute performance (développée par Uber/OpenJS Foundation) pour les **données massives**. S'intègre à MapLibre via \`MapboxOverlay\`. Couches disponibles : \`HexagonLayer\` (densité en hexagones 3D), \`ArcLayer\` (flux), \`ScatterplotLayer\` (millions de points), \`HeatmapLayer\`, \`TripsLayer\` (animation temporelle).

**Quand choisir quoi :**

| Besoin | Outil |
|--------|-------|
| Carte statique / infographie SVG | **d3-geo** |
| Carte interactive avec fond de carte | **MapLibre GL JS** |
| Données massives (100k+ points) | **Deck.gl** |
| Fond + couches complexes | **MapLibre + Deck.gl** |
| Exploration rapide sans code | **Kepler.gl** |`,
    },
  ],

  essentiel: [
    `**GeoJSON** : ordre des coordonnées = **\`[longitude, latitude]\`** (piège classique !). Types : \`Point\`, \`LineString\`, \`Polygon\`, \`MultiPolygon\`, \`FeatureCollection\`.`,
    `**TopoJSON** = GeoJSON avec topologie partagée → compression ~80%. Shapefile = format ESRI historique (.shp/.dbf/.shx).`,
    `**d3-geo** : \`geoPath().projection(proj)\` transforme chaque Feature GeoJSON en \`<path>\` SVG. \`.fitExtent()\` cadre automatiquement la carte.`,
    `**Projections d3-geo** : \`geoEqualEarth()\` = surfaces préservées (recommandée) · \`geoMercator()\` = angles préservés · \`geoOrthographic()\` = globe.`,
    `**MapLibre** : sépare **source** (données) et **layer** (rendu). Toujours attendre \`map.on(\'load\')\` avant \`addSource/addLayer\`. CSS obligatoire (\`maplibre-gl.css\`).`,
    `**Deck.gl** = WebGL haute performance pour données massives (HexagonLayer, ArcLayer, ScatterplotLayer). S'intègre à MapLibre via \`MapboxOverlay\`.`,
  ],

  pieges: [
    `**Ordre des coordonnées GeoJSON** : c'est \`[longitude, latitude]\` - l'inverse de l'usage courant en français. \`[6.64, 46.78]\` = Yverdon, pas \`[46.78, 6.64]\`.`,
    `Sans \`import \'maplibre-gl/dist/maplibre-gl.css\'\`, la carte MapLibre ne s'affiche pas correctement - le CSS est **obligatoire**.`,
    `Le container HTML de MapLibre **doit avoir une hauteur explicite** (ex. \`height: 500px\`) sinon la carte reste invisible.`,
    `Toujours envelopper \`addSource\` et \`addLayer\` dans \`map.on(\'load\', () => { ... })\` - les appeler avant le chargement provoque une erreur silencieuse.`,
  ],

  patterns: [
    {
      titre: 'd3-geo : choroplète SVG complète',
      code: `import { geoEqualEarth, geoPath } from 'd3-geo'
import { scaleQuantize } from 'd3-scale'
import { select } from 'd3-selection'

const width = 800, height = 500
const svg = select('#map').append('svg').attr('width', width).attr('height', height)

const projection = geoEqualEarth().fitExtent([[12, 12], [width - 12, height - 12]], data)
const path = geoPath().projection(projection)

const color = scaleQuantize()
  .domain([0, 100])
  .range(['#fadadb', '#f4a0a2', '#e96668', '#d42b2e', '#7a0c0e'])

svg.selectAll('path')
  .data(data.features)
  .join('path')
  .attr('d', path)
  .attr('fill', d => color(d.properties.value))
  .attr('stroke', '#fff')
  .attr('stroke-width', 0.5)`,
    },
    {
      titre: 'MapLibre : choroplète avec expression interpolate',
      code: `map.addLayer({
  id: 'fill-choropleth',
  type: 'fill',
  source: 'myData',
  paint: {
    'fill-color': [
      'interpolate', ['linear'],
      ['get', 'population'],    // valeur de la propriété
      1000000,  '#fadadb',      // min → couleur claire
      85000000, '#7a0c0e',      // max → couleur foncée
    ],
    'fill-opacity': 0.85
  }
})`,
    },
  ],
}
