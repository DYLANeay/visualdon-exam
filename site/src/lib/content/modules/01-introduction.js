export default {
  id: "01-introduction",
  titre: "Introduction à la visualisation de données",
  accroche:
    "Un tableau de chiffres, c’est comme une boîte noire : l’info est là, mais invisible. La **visualisation de données**, c’est l’art d’ouvrir cette boîte et de rendre l’invisible… évident.",

  sections: [
    {
      titre: "Qu'est-ce que la visualisation de données ?",
      corps: `La visualisation de données, c'est la **représentation graphique de l'information** : transformer des données abstraites (chiffres, texte, mesures) en **formes visuelles** interprétables par l'œil humain.

Pourquoi ? Parce que notre cerveau est câblé pour détecter des formes, des couleurs et des tendances bien plus vite qu'il ne lit des colonnes de nombres. Une carte des cas de choléra nous dit en une seconde ce qu'un tableur cacherait pendant des heures.

La visualisation permet de :
- **Révéler des structures** cachées dans les données
- **Détecter des tendances** et des anomalies
- **Communiquer** un message à un public précis`,
    },
    {
      titre: "Pourquoi visualiser ? Trois grandes fonctions",
      corps: `L'histoire de la dataviz est peuplée de héros qui ont changé le monde avec un seul graphique. Trois usages fondamentaux :

**Explorer - trouver les tendances**
Florence Nightingale (1858) invente le diagramme en rose (coxcomb) pour montrer les causes de mortalité dans l'armée britannique. Son graphique convainc le gouvernement de réformer l'hygiène militaire : les décès par maladie s'effondrent.

**Analyser - tester une hypothèse**
John Snow (1854) cartographie les cas de choléra à Londres. La concentration des points autour d'une seule pompe à eau prouve que la maladie se transmet par l'eau, pas par l'air. Naissance de l'épidémiologie moderne.

**Présenter - raconter une histoire**
Charles Joseph Minard (1869) encode **6 variables** sur une seule image : la campagne de Russie de Napoléon - géographie, direction, effectifs, température, dates, rivières. Edward Tufte la considère comme la meilleure visualisation statistique jamais créée.`,
    },
    {
      titre: "Données : entre objectivité et subjectivité",
      corps: `On croit souvent que les données sont neutres, objectives, "scientifiques". C'est faux - ou du moins, incomplet.

> *"Les données ne sont jamais brutes. Elles sont toujours déjà cuisinées."*
> - Geoffrey C. Bowker, *Memory Practices in the Sciences* (2005)

Deux grandes traditions s'affrontent (et se complètent) :

**Approche rationnelle**
- **Jacques Bertin** (*Sémiologie graphique*, 1967) : 7 **variables visuelles** - position, taille, valeur, grain, couleur, orientation, forme - comme une grammaire universelle pour encoder l'information sans ambiguïté.
- **Edward Tufte** (*The Visual Display of Quantitative Information*, 1983) : maximiser le **data-ink ratio** (chaque pixel doit informer), éliminer le **chartjunk** (tout ce qui décore sans informer).

**Approche sensible**
- **Giorgia Lupi** (Data Humanism) : *"data-driven ne veut pas dire incontestablement vrai"* - les données portent la trace de ceux qui les ont collectées.
- **Federica Fragapane** : *"les données ne sont pas neutres"* - ses infographies organiques sont au MoMA.
- **Lupi & Posavec** (*Dear Data*, 2016) : 52 semaines de données personnelles dessinées à la main sur des cartes postales. Collection du MoMA.
- **Philippe Rekacewicz** : cartographie sensible et décentrée - esquisses, émotions, croquis.

Ces deux approches ne s'opposent pas : une bonne visualisation **choisit sa posture** selon son audience et son intention.`,
    },
    {
      titre: "Qu'est-ce qu'une bonne visualisation ?",
      corps: `Selon *Information is Beautiful*, une bonne visualisation repose sur **4 piliers** :

1. **Information** : données exactes, pertinentes, complètes
2. **Fonction** : objectif clair, utile à son public
3. **Forme visuelle** : design efficace, esthétique soignée
4. **Histoire** : narration qui donne du sens aux données

Une visualisation peut être **exploratoire** (pour soi, itérations rapides, sans souci esthétique) ou **explicative** (pour les autres, storytelling soigné, message unique). Le choix de la forme dépend toujours de l'**audience** et de l'**objectif**.

Et les formes ? Du plus simple au plus riche :
- **Statique** : infographie imprimée, affiche
- **Infographie** : combinaison de texte, chiffres, formes
- **Interactive** : filtres, hover, scroll, animation - ex. NYT "How the Virus Got Out", RTS votations`,
    },
    {
      titre: "Outils et objectifs du cours",
      corps: `Le paysage des outils de visualisation interactive dans un navigateur est vaste : Tableau, Datawrapper, Flourish, Observable, Vega-Lite, Chart.js… et bien d'autres.

Dans ce cours, l'outil central est **D3.js** (Data-Driven Documents). Pourquoi D3 ?
- Contrôle total sur chaque élément visuel
- Librairie de référence dans la presse (NYT, The Guardian, The Pudding)
- Comprendre D3, c'est comprendre la dataviz web en profondeur

**Objectifs du cours** :
- Connaître différentes technologies de visualisation dans un navigateur web
- Maîtriser **D3.js**
- Connaître une librairie de **cartographie web**
- Maîtriser la **manipulation des données** avec JavaScript
- Développer un **esprit critique** : questionner les choix, les biais et les intentions derrière chaque visualisation`,
    },
  ],

  essentiel: [
    "La visualisation transforme des **données abstraites** en **formes visuelles** pour révéler structures, tendances et anomalies.",
    "Trois fonctions : **explorer** (Nightingale), **analyser** (Snow), **présenter** (Minard).",
    "Bertin : 7 **variables visuelles** - position, taille, valeur, grain, couleur, orientation, forme.",
    "Tufte : maximiser le **data-ink ratio**, éliminer le **chartjunk** - chaque pixel doit informer.",
    "Lupi (Data Humanism) : les données ne sont jamais neutres - approche rationnelle ET sensible se complètent.",
    "4 piliers d’une bonne viz (*Information is Beautiful*) : **Information · Fonction · Forme visuelle · Histoire**.",
  ],

  pieges: [
    "Croire que les données sont objectives : elles sont toujours choisies, collectées et représentées par des humains avec des intentions.",
    "Confondre visualisation **exploratoire** (pour soi) et **explicative** (pour les autres) : les critères de qualité ne sont pas les mêmes.",
    "Oublier Bertin : ignorer les variables visuelles, c’est encoder l’information de façon ambiguë ou trompeuse.",
  ],
}
