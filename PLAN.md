# PLAN — Site de révision VisualDon

## Vision

Un site web gamifié, en français, pour préparer toute la classe à l'examen VisualDon
(2 h sur papier, formulaire A4 r/v autorisé). Réviser doit être fun : progression,
points, badges, quiz, examens blancs générés dynamiquement, flashcards et exemples de
code D3 **modifiables en direct**.

Cours couverts : 01 à 12, **sauf le 11 (Scrollytelling, non évalué)**.

## Stack technique

| Brique | Choix | Pourquoi |
|---|---|---|
| Framework | **Svelte 5 + Vite** | Léger, réactif, excellent duo avec D3, peu de boilerplate |
| Visualisation | **D3.js v7** | La lib du cours — le site est aussi une démo de dataviz |
| Live coding | **CodeMirror 6 + iframe sandbox** | Éditeur léger, exécution isolée avec D3 préchargé |
| Styles | **Tailwind CSS 4** | Design épuré et cohérent (spacing/typo systématiques), rapide à itérer |
| Persistance | **localStorage** (+ export/import JSON) | Zéro backend, déploiement statique |
| Déploiement | **GitHub Pages** (build statique Vite) | Gratuit, push sur `main` = déploiement |
| Génération de contenu | **Hybride : banque JSON + templates paramétrés**, enrichie hors-ligne via opencode / Claude Code | Site statique et fiable, pas de clé API exposée, questions relues avant intégration |

## Direction artistique

**Archi clair, propre et élégant, sans fioritures.** Concrètement :

- Fond clair, beaucoup d'espace blanc, hiérarchie typographique nette (une seule famille
  de caractères soignée + une mono pour le code).
- Palette sobre : neutres + **une** couleur d'accent (et les couleurs sémantiques
  juste/faux). Pas de dégradés ni d'ombres lourdes.
- La gamification reste discrète : XP, badges et streak sont des touches élégantes
  (petites pastilles, micro-animations brèves), pas un casino.
- Les visualisations D3 sont les vedettes : le chrome de l'interface s'efface devant
  le contenu. Lisibilité avant tout — le site doit lui-même être un exemple de bonnes
  pratiques dataviz (cours 10 oblige).
- **Dark mode** : suit la préférence système par défaut, avec un toggle discret dans le
  header (choix persisté en localStorage). Même sobriété que le mode clair : fond
  sombre neutre, le même accent, contrastes soignés — y compris dans les
  visualisations D3 et l'éditeur de code (thème CodeMirror assorti).

## Architecture

```
site/
├── src/
│   ├── lib/
│   │   ├── components/      # QuizCard, Flashcard, CodePlayground, ProgressBar, Badge…
│   │   ├── engine/          # tirage d'examens, scoring, répétition espacée (SM-2)
│   │   ├── stores/          # progression, points, badges (Svelte stores ↔ localStorage)
│   │   └── data/            # banque de questions, flashcards, synthèses (JSON/MD)
│   ├── routes/ (ou pages/)  # accueil, modules, essentiel, examen, flashcards, profil
│   └── app.css
├── scripts/
│   └── generation/          # prompts + schéma JSON pour enrichir la banque (opencode/Claude)
└── vite.config.js
```

## Fonctionnalités

### 1. Modules de cours (11 modules : cours 1–10 et 12)
- Chaque module : résumé pédagogique fidèle aux slides (`comem-visualdon-main/cours/`),
  avec métaphores et exemples, suivi d'un quiz de validation.
- **Exemples de code modifiables** intégrés partout où c'est pertinent : SVG, sélections
  D3, data binding, échelles, transitions, interactions, cartes. L'élève modifie le code
  (CodeMirror), le rendu se met à jour dans l'iframe → apprentissage par l'expérimentation.
- Progression par module : non commencé → en cours → maîtrisé (quiz réussi).

### 2. Section « L'essentiel »
- Synthèse de tous les supports, **uniquement les fondamentaux** : concepts clés, pièges
  classiques, patterns de code D3 récurrents.
- Vue globale + déclinaison par cours. Pensée comme base du **formulaire A4** autorisé
  à l'examen (bouton « version imprimable »).

### 3. Examens blancs générés dynamiquement
- Moteur de tirage qui assemble un examen au **format officiel exact**
  (`revisions/examen-type.md`) : QCM 20 pts · D3 vrai/faux justifié 36 pts ·
  cartographie 25 pts · éthique/biais 15 pts. Durée 2 h, chrono intégré.
- Deux sources de variété :
  - **Banque** : questions rédigées à partir des cours et de l'examen type.
  - **Templates paramétrés** : datasets, valeurs et snippets de code tirés au sort
    (ex. la question `scaleBand` change de données à chaque tirage), corrigé calculé.
- Correction immédiate avec explication pédagogique pour chaque question, score sur 96 pts
  et note indicative.

### 4. Flashcards avec répétition espacée
- Deck par module + deck global. Algorithme **SM-2 simplifié** (encore / difficile /
  bien / facile) ; les cartes dues remontent automatiquement.
- Cartes recto/verso : notion → définition, code → résultat, graphique → biais à nommer.

### 5. Gamification
- **Points (XP)** pour chaque quiz, examen blanc, session de flashcards.
- **Badges** : « Maître des échelles », « Cartographe », « Chasseur de biais »,
  « Sans faute », « Streak 7 jours »…
- **Streak** quotidien et barre de progression globale vers « Prêt pour l'examen ».
- Tout dans localStorage, export/import JSON pour changer de machine.

### 6. Podcasts par module
- Génération **hors-ligne** avec [`notebooklm-py`](https://github.com/teng-lin/notebooklm-py)
  (automatisation NotebookLM via Playwright, audio en français) : un Audio Overview par
  module à partir des slides du cours, MP3 commités dans `site/public/podcasts/`.
- Lecture dans le site via `<audio>` natif + **Media Session API** : la lecture continue
  écran verrouillé, avec contrôles sur l'écran de verrouillage (titre du module, play/pause).
- **Podcast master** : un épisode de synthèse généré à partir du contenu de **tous les
  cours évalués** (sources : les 11 slides + la section « L'essentiel »), format long
  (deep-dive) — idéal pour une révision globale avant l'examen.
- **Flux RSS podcast** (`feed.xml` servi par Pages) : abonnement possible dans une vraie
  app de podcasts (hors-ligne, reprise, vitesse) — garantie maximale de lecture en
  arrière-plan.
- Lib non officielle (APIs Google non documentées) : la génération reste un script
  ponctuel, jamais une dépendance du site.

### 7. Pipeline de génération (hors-ligne)
- `scripts/generation/` contient le **schéma JSON** des questions/flashcards et des
  prompts prêts à l'emploi.
- Enrichissement : lancer opencode ou Claude Code en local → génération de nouvelles
  questions **fidèles aux slides** → relecture → commit dans `src/lib/data/`.
- Jamais d'appel LLM depuis le navigateur (clé API exposée sinon).

## Étapes de réalisation

1. **Socle** : scaffolding Svelte + Vite, routing, layout, stores localStorage, déploiement
   GitHub Pages fonctionnel dès le premier jour.
2. **Contenu v1** : extraction des notions des 11 cours évalués → synthèses de modules +
   section « L'essentiel ».
3. **Quiz & banque** : schéma JSON, banque initiale (~15–20 questions/module, en
   commençant par celles de l'examen type), composant QuizCard avec correction expliquée.
4. **Playground** : composant CodeMirror 6 + iframe sandbox D3, intégré aux modules.
5. **Examens blancs** : moteur de tirage au format officiel, chrono, scoring, corrigé.
6. **Flashcards** : decks + SM-2, intégration à la progression.
7. **Gamification** : XP, badges, streak, écran profil.
8. **Podcasts** : génération notebooklm-py par module + podcast master tous cours,
   lecteur audio + Media Session, flux RSS.
9. **Polish** : responsive, impression du formulaire A4, enrichissement de la banque.

Chaque étape = commits fréquents poussés directement sur `main` (cf. CLAUDE.md).

## Vérification

- `npm run dev` : parcourir chaque module, modifier un exemple de code et voir le rendu
  changer, compléter un quiz, tirer deux examens blancs (vérifier qu'ils diffèrent et
  respectent la pondération 20/36/25/15), réviser un deck de flashcards.
- Recharger la page : progression, XP et état SM-2 conservés (localStorage).
- `npm run build && npm run preview` : build statique sain avant push.
- Contrôle de fidélité : chaque question/flashcard référence le cours source
  (`source: "05-echelles-axes"`) pour audit rapide.
