<script>
  import { modules } from '../data/modules.js'
  import { questionsModule, melanger } from '../quiz/index.js'
  import { progress } from '../stores/progress.js'
  import QuizCard from '../components/QuizCard.svelte'

  let { id } = $props()

  const meta = $derived(modules.find((m) => m.id === id))
  const questions = $derived(melanger(questionsModule(id)))

  let resultats = $state({}) // id question → bool
  let enregistre = $state(false)

  const total = $derived(questions.length)
  const repondus = $derived(Object.keys(resultats).length)
  const justes = $derived(Object.values(resultats).filter(Boolean).length)
  const fini = $derived(total > 0 && repondus === total)

  function noter(q, correct) {
    resultats[q.id] = correct
  }

  // Marque le module maîtrisé quand le quiz est réussi (≥ 70%).
  $effect(() => {
    if (fini && !enregistre) {
      enregistre = true
      const ratio = justes / total
      progress.update((p) => ({
        ...p,
        modules: {
          ...p.modules,
          [id]: {
            statut: ratio >= 0.7 ? 'maîtrisé' : 'en cours',
            meilleurScore: Math.max(p.modules[id]?.meilleurScore ?? 0, Math.round(ratio * 100)),
          },
        },
      }))
    }
  })
</script>

<section class="mx-auto max-w-4xl py-12">
  <a href={`#/modules/${id}`} class="text-sm text-faint hover:text-fg-strong">
    ← {meta?.titre ?? 'Module'}
  </a>
  <h1 class="mt-4 text-2xl font-semibold text-fg-strong">Quiz - {meta?.titre}</h1>

  {#if total === 0}
    <p class="mt-8 rounded-lg border border-dashed border-border p-8 text-center text-sm text-faint">
      Les questions de ce module arrivent bientôt.
    </p>
  {:else}
    <p class="mt-2 text-muted">{repondus} / {total} répondues · {justes} justes</p>

    <div class="mt-8 space-y-5">
      {#each questions as q (q.id)}
        <QuizCard {q} repondu={(c) => noter(q, c)} />
      {/each}
    </div>

    {#if fini}
      <div class="mt-8 rounded-lg border border-accentborder bg-accentsurface p-6 text-center">
        <p class="text-lg font-semibold text-fg-strong">
          Score : {justes} / {total} ({Math.round((justes / total) * 100)} %)
        </p>
        <p class="mt-1 text-sm text-muted">
          {justes === total ? 'Sans faute, bravo ! 🎉' : justes / total >= 0.7 ? 'Module maîtrisé ✓' : 'Continue à réviser, tu y es presque.'}
        </p>
      </div>
    {/if}
  {/if}
</section>
