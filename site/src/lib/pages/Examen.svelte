<script>
  import { onDestroy } from 'svelte'
  import { genererExamen } from '../quiz/index.js'
  import { addXp, awardBadge } from '../stores/progress.js'
  import QuizCard from '../components/QuizCard.svelte'

  let examen = $state(null)
  let resultats = $state({}) // id question → bool
  let demarre = $state(false)
  let termine = $state(false)
  let secondes = $state(2 * 60 * 60) // 2 h
  let timer

  const pointsMax = $derived(
    examen
      ? examen.sections.reduce(
          (s, sec) => s + sec.questions.reduce((a, q) => a + q.points, 0),
          0,
        )
      : 0,
  )
  const pointsObtenus = $derived(
    examen
      ? examen.sections.reduce(
          (s, sec) =>
            s +
            sec.questions.reduce(
              (a, q) => a + (resultats[q.id] ? q.points : 0),
              0,
            ),
          0,
        )
      : 0,
  )
  const nbQuestions = $derived(
    examen ? examen.sections.reduce((s, sec) => s + sec.questions.length, 0) : 0,
  )
  const nbRepondus = $derived(Object.keys(resultats).length)

  const tempsFormate = $derived(
    `${String(Math.floor(secondes / 3600)).padStart(2, '0')}:${String(
      Math.floor((secondes % 3600) / 60),
    ).padStart(2, '0')}:${String(secondes % 60).padStart(2, '0')}`,
  )

  function lancer() {
    examen = genererExamen()
    resultats = {}
    demarre = true
    termine = false
    secondes = 2 * 60 * 60
    timer = setInterval(() => {
      secondes -= 1
      if (secondes <= 0) terminer()
    }, 1000)
  }

  function noter(q, correct) {
    resultats[q.id] = correct
  }

  function terminer() {
    clearInterval(timer)
    termine = true
    const note = pointsMax ? pointsObtenus / pointsMax : 0
    addXp(Math.round(note * 100))
    awardBadge('premier-examen')
    if (note === 1) awardBadge('examen-parfait')
  }

  onDestroy(() => clearInterval(timer))
</script>

<section class="mx-auto max-w-3xl py-12">
  {#if !demarre}
    <h1 class="text-2xl font-semibold text-fg-strong">Examen blanc</h1>
    <p class="mt-2 text-muted">
      Un examen généré au format officiel, différent à chaque fois :
    </p>
    <ul class="mt-4 space-y-1 text-sm text-fg">
      <li>▸ <strong>Partie 1 · QCM</strong> — 10 questions (20 pts)</li>
      <li>▸ <strong>Partie 2 · D3.js</strong> — 18 affirmations (36 pts)</li>
      <li>▸ <strong>Partie 3 · Cartographie</strong> — (25 pts)</li>
      <li>▸ <strong>Partie 4 · Éthique et biais</strong> — (15 pts)</li>
    </ul>
    <p class="mt-4 text-sm text-faint">Durée indicative : 2 h, comme le vrai examen.</p>
    <button
      onclick={lancer}
      class="mt-8 rounded-lg bg-accentfg px-6 py-3 font-medium text-white transition-opacity hover:opacity-90"
    >
      Lancer un examen blanc
    </button>
  {:else}
    <!-- Barre fixe : chrono + progression -->
    <div
      class="sticky top-0 z-10 -mx-4 mb-8 flex items-center justify-between border-b border-border bg-bg/90 px-4 py-3 backdrop-blur"
    >
      <span class="font-mono text-sm {secondes < 300 ? 'text-red-500' : 'text-fg'}">
        ⏱ {tempsFormate}
      </span>
      <span class="text-sm text-muted">{nbRepondus} / {nbQuestions}</span>
      {#if !termine}
        <button
          onclick={terminer}
          class="rounded-md bg-accentfg px-3 py-1 text-sm font-medium text-white hover:opacity-90"
        >
          Terminer
        </button>
      {/if}
    </div>

    {#if termine}
      <div class="mb-8 rounded-lg border border-accentborder bg-accentsurface p-6 text-center">
        <p class="text-3xl font-bold text-fg-strong">{pointsObtenus} / {pointsMax}</p>
        <p class="mt-1 text-muted">
          {Math.round((pointsObtenus / pointsMax) * 100)} % — {pointsObtenus / pointsMax >= 0.5 ? 'au-dessus de la moyenne 👍' : 'continue à réviser, tu vas y arriver !'}
        </p>
        <button
          onclick={lancer}
          class="mt-4 rounded-md border border-accentfg px-4 py-1.5 text-sm font-medium text-accentfg hover:bg-accentsurface"
        >
          Nouvel examen
        </button>
      </div>
    {/if}

    {#each examen.sections as sec}
      <h2 class="mt-10 mb-4 border-b border-border pb-2 text-lg font-semibold text-fg-strong">
        {sec.titre}
      </h2>
      {#if sec.questions.length === 0}
        <p class="text-sm text-faint">Pas encore de question disponible pour cette partie.</p>
      {:else}
        <div class="space-y-5">
          {#each sec.questions as q (q.id)}
            <QuizCard {q} repondu={(c) => noter(q, c)} />
          {/each}
        </div>
      {/if}
    {/each}
  {/if}
</section>
