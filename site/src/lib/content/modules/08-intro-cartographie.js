export default {
  id: '08-intro-cartographie',
  titre: 'Introduction à la cartographie',
  accroche:
    `Une carte, c'est bien plus qu'un fond de plan : c'est un **choix politique**, un **regard sur le monde** et un outil de pouvoir. Depuis la défense de mammouth gravée il y a 25 000 ans jusqu'aux choroplèthes interactives des votations fédérales, cartographier c'est déjà **interpréter**.`,

  sections: [
    {
      titre: 'Une brève histoire de la cartographie',
      corps: `La carte la plus ancienne connue est gravée sur une **défense de mammouth** à Pavlov (République tchèque), datant d'environ **25 000 av. J.-C.**. Elle représente un paysage local : rivière, montagne, chemins.

Quelques jalons incontournables pour l'examen :

- **Anaximandre (~600 av. J.-C.)** : première carte du monde. Grèce au centre, monde entouré d'eau — déjà un biais eurocentré.
- **Ptolémée (IIe siècle)** : *Geographia*, première projection mathématique, 8 000 lieux répertoriés. Redécouvert au XVe siècle et influence toute la Renaissance.
- **Al-Idrisi (1154)** : *Tabula Rogeriana*, commandée par Roger II de Sicile. **Sud en haut**, tradition arabe — remet en cause la centralité européenne.
- **Mercator (1569)** : la projection qui a *défini notre vision mentale du monde* pendant 400 ans. Avantages : angles préservés, lignes droites = caps constants (idéal pour la navigation). Problème massif : **les surfaces sont déformées**. Le Groenland semble aussi grand que l'Afrique alors qu'il est 14 fois plus petit. Encore utilisée par défaut sur Google Maps jusqu'en 2018.

**Retiens** : chaque carte est liée à une époque, une culture, un centre de pouvoir.`,
    },
    {
      titre: 'Les types de cartes',
      corps: `Il existe une grande variété de types de cartes, et choisir le bon type c'est choisir quel aspect de la réalité tu veux mettre en avant. Connais-les pour l'examen :

| Type | Ce qu'il encode | Exemple |
|------|-----------------|---------|
| **Référence** | Localisation, navigation | OpenStreetMap, Google Maps, Swisstopo |
| **Qualitative** | Catégories distinctes (pas de hiérarchie) | Langues, cantons, partis politiques |
| **Choroplète** | Intensité d'une variable par zone (couleur) | Résultats de votations, revenus par canton |
| **Cartogramme** | Surface proportionnelle à une variable | Population mondiale, PIB |
| **À bulles** | Taille des symboles ∝ variable quantitative | Populations par ville |
| **Flowmap** | Flux et mouvements entre lieux | Migrations, exports, navetteurs |
| **Heatmap** | Densité d'événements dans l'espace | Activités Strava, criminalité |
| **Topographique** | Relief, altitude | Swisstopo, cartes de randonnée |
| **Topologique** | Relations et réseaux (sans respect des distances) | Plans de métro, transports publics |

**Choroplète vs cartogramme :** la choroplète colore les zones géographiques telles qu'elles sont — ce qui biaise visuellement en faveur des grandes zones peu peuplées. Le cartogramme *déforme* la géographie pour que la surface corresponde à la donnée. C'est un choix éditorial fort.

**Carte à bulles vs choroplète :** les bulles encodent une valeur par la taille d'un cercle centré sur la zone, sans déformer la géographie. Plus honnête que la choroplète pour des données de comptage (population absolue, votes absolus).`,
    },
    {
      titre: 'Variables visuelles de Bertin',
      corps: `Jacques Bertin, dans *Sémiologie graphique* (1967), a identifié les **variables visuelles** disponibles pour encoder l'information sur une carte ou un graphique :

- **Taille** (size) — quantité, importance
- **Valeur** (valeur lumineuse, clair/foncé) — intensité, hiérarchie
- **Grain** (texture) — catégories de surface
- **Couleur** (teinte) — catégories qualitatives
- **Orientation** — direction, tendance
- **Forme** — distinction qualitative de symboles

Ces variables ne sont pas toutes adaptées à tous les types de données. La **couleur** (teinte) encode bien les catégories ; la **valeur** (luminosité) encode mieux les gradients quantitatifs. C'est la base de tout design cartographique rigoureux.`,
    },
    {
      titre: 'Le pouvoir de la carte',
      corps: `Toute carte fait des **choix** — et ces choix ont des conséquences politiques et sociales.

**Ce qu'on met sur la carte :** *nommer, c'est exister*. Les cartes coloniales effaçaient les noms autochtones. Les frontières *créent* des États autant qu'elles les décrivent. Choisir un centre, c'est décider qui est la périphérie.

**Ce qu'on laisse de côté :** ce qui n'est pas cartographié n'existe pas officiellement. Quartiers informels, routes non reconnues, peuples sans territoire reconnu.

**Exemple actuel :** en janvier 2025, Google Maps a renommé le Golfe du Mexique en *Gulf of America* pour les utilisateurs américains, suite à un décret de l'administration Trump. Les grandes plateformes cartographiques exercent un **pouvoir d'influence mondial**.

**La carte comme outil de libération :** en 1854, **John Snow** a cartographié les cas de choléra rue par rue à Londres, prouvant par la visualisation spatiale que la contamination venait d'une pompe à eau (Broad Street) — et non de l'air. La carte a forcé la fermeture de la pompe et a inauguré l'épidémiologie moderne.

**Projets de contre-cartographie à connaître :**
- *Native Land Digital* — territoires autochtones invisibilisés
- *Environmental Justice Atlas* — conflits environnementaux
- *Forensic Architecture* — preuves de violations des droits humains
- *Missing Maps* — zones de crise humanitaire`,
    },
    {
      titre: 'La cartographie dans les médias',
      corps: `La carte est devenue un **format journalistique** à part entière. Elle permet d'ancrer un événement dans l'espace, de montrer des inégalités géographiques et de guider le lecteur dans une crise.

**Exemples de référence :**
- **RTS** : cartes choroplètes interactives des votations fédérales, commune par commune, en temps réel chaque jour de vote.
- **New York Times** : story maps interactives sur le Covid, les guerres, les élections.
- **Forensic Architecture** : reconstitutions spatiales comme preuves de violations des droits humains.
- **Le Monde** : choroplèthes temps réel pour les élections françaises.

**Story maps :** la carte comme fil conducteur d'un récit. Le scroll entraîne un déplacement géographique. Formats : ArcGIS StoryMaps, scrollytelling custom avec Mapbox GL ou D3.

**visionscarto.net** : revue de cartographie critique fondée par Philippe Rekacewicz et Philippe Rivière (ex-*Monde diplomatique*). Cartes engagées, sensibles, la carte comme geste politique et poétique.`,
    },
  ],

  essentiel: [
    `**Mercator (1569)** : angles préservés → navigation ; surfaces déformées → Groenland semble = Afrique (14× plus petit en réalité). Utilisée par Google Maps par défaut jusqu'en 2018.`,
    '**Choroplète** = intensité par zone (couleur) · **Cartogramme** = surface déformée ∝ variable · **Bulles** = taille du symbole ∝ variable.',
    `Une carte fait toujours des **choix politiques** : ce qu'on nomme, ce qu'on centre, ce qu'on omet.`,
    `**John Snow (1854)** : carte des cas de choléra → preuve visuelle → fermeture de la pompe → naissance de l'épidémiologie.`,
    '**Variables visuelles de Bertin (1967)** : taille, valeur, grain, couleur, orientation, forme — chacune adaptée à un type de donnée.',
    '**Carte topologique** = relations sans respect des distances (plan de métro) · **Carte topographique** = relief, altitude (Swisstopo).',
  ],

  pieges: [
    'Ne pas confondre **choroplète** (zones colorées selon une valeur) et **cartogramme** (zones déformées pour refléter la valeur). Le cartogramme corrige le biais visuel de la choroplète en faveur des grandes zones peu peuplées.',
    `**Mercator** est conforme (angles préservés) mais **ne préserve pas les surfaces** : c'est un piège classique dans les QCM.`,
    'Une carte **topologique** (métro, réseau) ne respecte PAS les distances réelles — elle montre des connexions. À ne pas confondre avec **topographique** (relief).',
    `La **discrétisation** d'une choroplète (choix des classes de couleur) est un choix éditorial : deux découpages différents sur les mêmes données peuvent produire des cartes politiquement opposées.`,
  ],
}
