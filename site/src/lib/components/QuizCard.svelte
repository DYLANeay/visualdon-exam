<script>
  import Markdown from './Markdown.svelte'
  import CodeBlock from './CodeBlock.svelte'

  // q : une question (cf. quiz/SCHEMA.md). repondu(estCorrect) remonte le résultat.
  let { q, repondu } = $props()

  let choix = $state(null) // index QCM, ou true/false, ou 'revele' pour ouvert
  let valide = $state(false)
  let justification = $state('') // texte rédigé par l'élève (vrai/faux)

  const estCorrect = $derived(
    q.type === 'qcm'
      ? choix === q.correct
      : q.type === 'vrai-faux'
        ? choix === q.reponse
        : null, // ouvert : auto-évalué
  )

  function choisir(v) {
    if (valide) return
    choix = v
  }

  function valider() {
    if (valide || choix === null) return
    valide = true
    if (q.type !== 'ouvert') repondu?.(estCorrect)
  }

  function autoNoter(reussi) {
    valide = true
    repondu?.(reussi)
  }

  function classeOption(i, vOption) {
    const v = q.type === 'qcm' ? i : vOption
    if (!valide) return choix === v ? 'border-accentfg bg-accentsurface' : 'border-border hover:border-accentfg'
    const bonne = q.type === 'qcm' ? i === q.correct : vOption === q.reponse
    if (bonne) return 'border-green-500 bg-green-500/10'
    if (choix === v) return 'border-red-500 bg-red-500/10'
    return 'border-border opacity-60'
  }
</script>

<div class="rounded-lg border border-border p-5">
  <div class="flex items-start justify-between gap-3">
    <h3 class="font-medium text-fg-strong">
      <Markdown source={q.question} inline />
    </h3>
    <span class="shrink-0 font-mono text-xs text-faint">{q.points} pts</span>
  </div>

  {#if q.code}
    <div class="mt-3">
      <CodeBlock code={{ langage: q.langage ?? 'js', source: q.code, editable: false }} />
    </div>
  {/if}

  {#if q.type === 'qcm'}
    <div class="mt-4 space-y-2">
      {#each q.options as opt, i}
        <button
          onclick={() => choisir(i)}
          disabled={valide}
          class={`flex w-full gap-2 rounded-md border px-3 py-2 text-left text-sm transition-colors ${classeOption(i)}`}
        >
          <span class="font-mono text-faint">{String.fromCharCode(65 + i)}</span>
          <span class="text-fg"><Markdown source={opt} inline /></span>
        </button>
      {/each}
    </div>
  {:else if q.type === 'vrai-faux'}
    <div class="mt-4 flex gap-2">
      {#each [['Vrai', true], ['Faux', false]] as [label, v]}
        <button
          onclick={() => choisir(v)}
          disabled={valide}
          class={`flex-1 rounded-md border px-3 py-2 text-sm font-medium transition-colors ${classeOption(null, v)}`}
        >
          {label}
        </button>
      {/each}
    </div>

    <!-- Justification : à l'examen, un « faux » sans justification ne rapporte rien. -->
    {#if !valide}
      <label class="mt-3 block">
        <span class="text-xs text-faint">
          Justifie ta réponse {choix === false ? '(obligatoire à l’examen si c’est faux)' : '(entraîne-toi à rédiger)'}
        </span>
        <textarea
          bind:value={justification}
          rows="2"
          placeholder="Pourquoi ? Rédige comme sur ta copie…"
          class="mt-1 w-full resize-y rounded-md border border-border bg-bg px-3 py-2 text-sm text-fg placeholder:text-faint focus:border-accentfg focus:outline-none"
        ></textarea>
      </label>
    {:else if justification.trim()}
      <div class="mt-3 rounded-md border border-border p-3 text-sm">
        <p class="text-xs font-medium uppercase tracking-wide text-faint">Ta justification</p>
        <p class="mt-1 whitespace-pre-wrap text-fg">{justification}</p>
      </div>
    {/if}
  {:else}
    <!-- Question ouverte : on révèle le corrigé puis l'élève s'auto-note -->
    {#if !valide}
      <button
        onclick={() => (valide = true)}
        class="mt-4 rounded-md border border-border px-3 py-1.5 text-sm text-muted hover:border-accentfg hover:text-accentfg"
      >
        Voir le corrigé
      </button>
    {/if}
  {/if}

  {#if q.type !== 'ouvert' && !valide}
    <button
      onclick={valider}
      disabled={choix === null}
      class="mt-4 rounded-md bg-accentfg px-4 py-1.5 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-40"
    >
      Valider
    </button>
  {/if}

  {#if valide}
    {#if q.type !== 'ouvert'}
      <p class={`mt-4 text-sm font-medium ${estCorrect ? 'text-green-600' : 'text-red-500'}`}>
        {estCorrect ? '✓ Correct !' : '✗ Pas tout à fait.'}
      </p>
    {/if}

    {#if q.explication}
      <div class="mt-2 rounded-md bg-surface p-3 text-sm text-fg">
        {#if q.type === 'vrai-faux'}
          <p class="mb-1 text-xs font-medium uppercase tracking-wide text-faint">Justification attendue</p>
        {/if}
        <Markdown source={q.explication} inline />
      </div>
    {/if}

    {#if q.corrige?.length}
      <ul class="mt-2 space-y-1 rounded-md bg-surface p-3 text-sm text-fg">
        {#each q.corrige as point}
          <li class="flex gap-2"><span class="text-accentfg">▸</span><span>{point}</span></li>
        {/each}
      </ul>
    {/if}

    {#if q.type === 'ouvert'}
      <div class="mt-3 flex items-center gap-2 text-sm">
        <span class="text-muted">Tu avais juste ?</span>
        <button onclick={() => autoNoter(true)} class="rounded border border-green-500 px-2 py-0.5 text-green-600 hover:bg-green-500/10">Oui</button>
        <button onclick={() => autoNoter(false)} class="rounded border border-red-500 px-2 py-0.5 text-red-500 hover:bg-red-500/10">Non</button>
      </div>
    {/if}
  {/if}
</div>
