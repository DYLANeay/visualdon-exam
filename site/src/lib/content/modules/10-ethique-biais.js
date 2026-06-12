export default {
  id: '10-ethique-biais',
  titre: 'Éthique et biais',
  accroche:
    `Un graphique peut mentir sans mentir : il suffit de couper l'axe Y, de choisir les bonnes couleurs ou d'omettre les bonnes données. Ce cours te donne les **anticorps critiques** pour ne jamais te faire piéger — ni piéger les autres.`,

  sections: [
    {
      titre: `Dos & Don'ts : les erreurs classiques de visualisation`,
      corps: `Avant les grands enjeux philosophiques, il y a des règles concrètes que tout·e créateur·trice de graphiques doit connaître par cœur.

**À éviter absolument :**

- **Couper l'axe Y** : faire commencer l'axe Y à une valeur différente de 0 sur un bar chart exagère visuellement les différences. Une variation de 2 % peut *paraître* doubler la hauteur des barres. Correction : commencer à 0, ou utiliser un graphique en ligne avec une note explicite.
- **La 3D inutile** : la troisième dimension déforme la perception des surfaces et des angles. Un camembert en 3D rend les tranches avant *visuellement* plus grandes que les tranches arrière — sans que les données l'indiquent.
- **Camemberts à plus de 5 parts** : l'œil humain compare très mal les angles et les aires. Préfère un bar chart horizontal ordonné.
- **Double axe Y** : superposer deux séries sur deux axes Y différents crée des corrélations *visuelles* artificielles — le lecteur peut croire qu'il y a un lien là où il n'y en a aucun.
- **Cumulation trompeuse** : un graphique de ventes *cumulées* monte toujours — même si les ventes s'effondrent. Apple a utilisé cette technique en 2013 pour ses ventes d'iPad.
- **Axe inversé** : en 2011, Simon Scarr du *South China Morning Post* a représenté les décès en Irak avec un axe Y inversé — les barres "tombaient" comme du sang, construisant un récit dramatique. La même donnée avec l'axe conventionnel (Andy Cotgreave, 2014) montre une baisse des décès. Données identiques, messages opposés.

**À privilégier :**
- Commencer les axes à 0 · 2D par défaut · Barres plutôt que camemberts · Annoter directement · Sourcer les données · Tester l'accessibilité · Trier par valeur de la donnée, pas par ordre alphabétique · Barres horizontales pour les noms de catégories longs.`,
    },
    {
      titre: 'Corrélation ≠ Causalité',
      corps: `C'est **le** principe à retenir pour l'examen et pour la vie.

Deux courbes qui montent en même temps ne prouvent aucun lien de cause à effet. Il peut y avoir un **facteur tiers** non représenté qui influence les deux variables.

**Exemple canonique du cours :** la consommation de chocolat par habitant·e et le nombre de prix Nobel par pays suivent la même tendance. Mais manger du chocolat ne rend pas génial — un niveau de richesse élevé explique probablement les deux variables.

**Règle d'or :** toujours chercher un **mécanisme explicatif** plausible avant de conclure à un lien causal, et nommer explicitement les limites de l'analyse.

**Le Quartet d'Anscombe (1973)** illustre l'inverse : quatre datasets ont des *statistiques résumées identiques* (même moyenne, même variance, même corrélation, même droite de régression), mais des formes visuellement radicalement différentes. **Leçon :** les statistiques résumées masquent la réalité — visualise avant de conclure !

Le site [tylervigen.com](https://www.tylervigen.com/spurious-correlations) recense des centaines de corrélations absurdes ("spurious correlations") pour illustrer ce danger.`,
    },
    {
      titre: 'Les données ne sont jamais neutres',
      corps: `Au-delà des erreurs de graphisme, il y a des biais plus profonds, liés à la *production* des données elles-mêmes.

D'Ignazio & Klein (*Data Feminism*, 2020) posent trois questions essentielles :

| Question | Ce qu'elle révèle | Exemple |
|----------|-------------------|---------|
| **Qui collecte ?** | Les données reflètent les priorités des financeur·euse·s | Statistiques coloniales conçues pour administrer, pas pour émanciper |
| **Qui est compté·e ?** | Les populations marginalisées sont souvent absentes | Les sans-abri ne rentrent pas dans les recensements classiques |
| **Qui est absent·e ?** | L'absence de données est elle-même une donnée | Pas de statistiques ethniques en Suisse |

**Implications pour la visualisation :** si les données sont biaisées, la visualisation *amplifie* ces biais. Présenter des données non-représentatives comme universelles, masquer l'incertitude ou les limites de l'échantillon — ce sont des choix éditoriaux à assumer ou à corriger.

**Questions à se poser avant de publier :**
- Qui a collecté ces données, dans quel but ?
- Qui est absent·e de ces données ?
- Quel récit cette visualisation construit-elle ?
- Qui pourrait être lésé·e par cette représentation ?`,
    },
    {
      titre: 'Biais algorithmiques : quand les machines reproduisent nos préjugés',
      corps: `Les algorithmes ne sont pas neutres : ils apprennent à partir de données produites par des humains, avec toutes leurs inégalités et leurs discriminations.

**Sources de biais algorithmiques :**
- **Données d'entraînement** : si l'historique contient des discriminations, le modèle les reproduit.
- **Objectifs d'optimisation** : maximiser l'engagement favorise souvent le contenu extrême.
- **Boucles de rétroaction** : les prédictions influencent la réalité qu'elles mesurent (si la police patrouille plus dans un quartier, elle y constate plus de délits, ce qui justifie plus de patrouilles…).
- **Choix de design** : quelles variables inclure, lesquelles ignorer ?

**Cas COMPAS** (à connaître pour l'examen) : système utilisé par les tribunaux américains pour prédire le risque de récidive (score de 1 à 10), influençant les décisions de libération conditionnelle. L'enquête de **ProPublica (2016)** sur 7 000 détenu·e·s a montré :
- Taux de faux positifs **2× plus élevé** pour les personnes racisées
- Taux de faux négatifs **2× plus élevé** pour les personnes non racisées
- Le score intégrait des variables corrélées au phénotype

**Conséquences des biais algorithmiques :** discrimination systématique à grande échelle, opacité (décisions automatisées sans explication), difficulté à contester (boîte noire).`,
    },
    {
      titre: 'Biais cognitifs et bonnes pratiques',
      corps: `Notre cerveau est aussi source de biais dans l'*interprétation* des visualisations.

**Buster Benson et John Manoogian III** ont recensé **180+ biais cognitifs** en 4 catégories :
1. **Trop d'information** → filtrage sélectif, on retient ce qui confirme nos croyances
2. **Manque de sens** → on comble les lacunes avec des hypothèses
3. **Agir vite** → on simplifie pour décider rapidement
4. **Se souvenir** → la mémoire reconstruit, elle ne reproduit pas

**Bonnes pratiques pour une visualisation éthique (Cairo, *The Truthful Art*, 2016) :**

| Pratique | Pourquoi |
|----------|----------|
| **Sourcer les données** | Permet de vérifier et contextualiser |
| **Montrer l'incertitude** | Intervalles de confiance, marges d'erreur |
| **Contextualiser les absences** | Nommer ce qui n'est pas mesuré |
| **Design accessible** | Daltonisme (~8 % des hommes, ~0,5 % des femmes), contrastes, lisibilité |
| **Être transparent·e sur les choix** | Échelles, projections, filtres appliqués |

**Accessibilité et daltonisme :** évite le rouge/vert seuls pour marquer une différence. Utilise le contraste clair/foncé et complète avec des formes ou textures. Outils de test : Coblis, Spectrum, Colorblinding.`,
    },
  ],

  essentiel: [
    `**Axe Y tronqué** = biais visuel classique sur les bar charts. Commencer à 0, ou expliciter le choix. L'orientation de l'axe (Scarr vs Cotgreave) construit le récit.`,
    `**Corrélation ≠ causalité** : deux courbes similaires ne prouvent aucun lien. Le Quartet d'Anscombe montre que des stats identiques cachent des formes radicalement différentes → **toujours visualiser**.`,
    `**Les données ne sont jamais neutres** : qui collecte, qui est compté·e, qui est absent·e sont des questions politiques (D'Ignazio & Klein, *Data Feminism*).`,
    `**COMPAS (ProPublica 2016)** : algorithme de récidive avec taux de faux positifs 2× plus élevé pour les personnes racisées → exemple canonique de biais algorithmique.`,
    `**Daltonisme** : ~8 % des hommes. Ne pas utiliser uniquement le rouge/vert pour encoder une différence. Tester avec Coblis/Spectrum.`,
    `**Bonnes pratiques** : sourcer, montrer l'incertitude, contextualiser les absences, être transparent·e sur les choix d'échelles et de filtres.`,
  ],

  pieges: [
    `**Couper l'axe Y** sur un bar chart exagère les différences. Sur un graphique en ligne, cela peut être acceptable *à condition de l'indiquer explicitement*.`,
    `**Double axe Y** : superposer deux échelles différentes crée des corrélations visuelles illusoires — le lecteur croit voir un lien là où il n'y en a pas.`,
    `**Cumulation trompeuse** : un graphique de valeurs cumulées monte toujours, même si la tendance sous-jacente s'effondre. Apple iPad (2013) est l'exemple du cours.`,
    `**3D** : déforme la perception des angles et des surfaces — les tranches avant d'un camembert 3D semblent plus grandes qu'elles ne le sont.`,
  ],
}
