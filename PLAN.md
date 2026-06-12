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
| Styles | CSS vanilla (custom properties) ou Tailwind si besoin | Rester simple |
| Persistance | **localStorage** (+ export/import JSON) | Zéro backend, déploiement statique |
| Déploiement | **GitHub Pages** (build statique Vite) | Gratuit, push sur `main` = déploiement |
| Génération de contenu | **Hybride : banque JSON + templates paramétrés**, enrichie hors-ligne via opencode / Claude Code | Site statique et fiable, pas de clé API exposée, questions relues avant intégration |

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

### 6. Pipeline de génération (hors-ligne)
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
8. **Polish** : responsive, impression du formulaire A4, enrichissement de la banque.

Chaque étape = commits fréquents poussés directement sur `main` (cf. CLAUDE.md).

## Vérification

- `npm run dev` : parcourir chaque module, modifier un exemple de code et voir le rendu
  changer, compléter un quiz, tirer deux examens blancs (vérifier qu'ils diffèrent et
  respectent la pondération 20/36/25/15), réviser un deck de flashcards.
- Recharger la page : progression, XP et état SM-2 conservés (localStorage).
- `npm run build && npm run preview` : build statique sain avant push.
- Contrôle de fidélité : chaque question/flashcard référence le cours source
  (`source: "05-echelles-axes"`) pour audit rapide.
