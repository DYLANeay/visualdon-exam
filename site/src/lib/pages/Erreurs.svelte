<script>
  import { questionsErreurs } from '../quiz/index.js'
  import { enregistrerReponse } from '../stores/stats.js'
  import { modules } from '../data/modules.js'
  import QuizCard from '../components/QuizCard.svelte'

  // Figé au montage : la liste ne doit pas se vider sous nos pieds quand on
  // rattrape une question (sinon les cartes disparaissent en cours de session).
  let questions = $state(questionsErreurs())
  let resultats = $state({})

  const total = $derived(questions.length)
  const repondus = $derived(Object.keys(resultats).length)
  const rattrapes = $derived(Object.values(resultats).filter(Boolean).length)

  const titreModule = (id) => modules.find((m) => m.id === id)?.titre ?? id

  function noter(q, correct) {
    resultats[q.id] = correct
    enregistrerReponse(q, correct)
  }

  function recharger() {
    questions = questionsErreurs()
    resultats = {}
  }
</script>

<section class="mx-auto max-w-4xl py-12">
  <a href="#/" class="text-sm text-faint hover:text-fg-strong">← Accueil</a>
  <h1 class="mt-4 text-2xl font-semibold text-fg-strong">Réviser mes erreurs</h1>

  {#if total === 0}
    <div class="mt-8 rounded-lg border border-dashed border-border p-10 text-center">
      <p class="text-2xl">✅</p>
      <p class="mt-2 font-medium text-fg-strong">Aucun point faible en attente.</p>
      <p class="mt-1 text-sm text-muted">
        Fais quelques quiz ou un examen blanc : les questions que tu rates atterriront ici
        automatiquement pour être retravaillées.
      </p>
    </div>
  {:else}
    <p class="mt-2 text-muted">
      Les {total} question{total > 1 ? 's' : ''} que tu as ratée{total > 1 ? 's' : ''} et pas
      encore rattrapée{total > 1 ? 's' : ''}. {repondus
        ? `${rattrapes} / ${repondus} reprise${repondus > 1 ? 's' : ''} juste${rattrapes > 1 ? 's' : ''}.`
        : 'Une bonne réponse la fait sortir de la liste.'}
    </p>

    <div class="mt-8 space-y-5">
      {#each questions as q (q.id)}
        <div>
          <p class="mb-1 text-xs font-medium uppercase tracking-wide text-faint">
            {titreModule(q.module)}
          </p>
          <QuizCard {q} repondu={(c) => noter(q, c)} />
        </div>
      {/each}
    </div>

    <button
      onclick={recharger}
      class="mt-8 rounded-md border border-border px-4 py-1.5 text-sm font-medium text-muted hover:border-accentfg hover:text-accentfg"
    >
      Rafraîchir la liste
    </button>
  {/if}
</section>
