<script>
  import { modules } from '../data/modules.js'
  import { contenuModule } from '../content/index.js'
  import { questionsModule } from '../quiz/index.js'
  import Markdown from '../components/Markdown.svelte'
  import CodeBlock from '../components/CodeBlock.svelte'

  let { id } = $props()

  const meta = $derived(modules.find((m) => m.id === id))
  const contenu = $derived(contenuModule(id))
  const nbQuestions = $derived(questionsModule(id).length)
</script>

<article class="mx-auto max-w-3xl py-12">
  <a href="#/modules" class="text-sm text-faint hover:text-fg-strong">
    ← Tous les modules
  </a>

  {#if meta}
    <p class="mt-6 font-mono text-sm text-accentfg">
      Cours {String(meta.numero).padStart(2, '0')}
    </p>
    <h1 class="mt-1 text-3xl font-semibold tracking-tight text-fg-strong">
      {meta.titre}
    </h1>
  {/if}

  {#if contenu}
    {#if contenu.accroche}
      <p class="mt-4 text-lg text-muted">
        <Markdown source={contenu.accroche} inline />
      </p>
    {/if}

    {#each contenu.sections ?? [] as section}
      <section class="mt-10">
        <h2 class="text-xl font-semibold text-fg-strong">{section.titre}</h2>
        {#if section.corps}
          <Markdown source={section.corps} />
        {/if}
        {#if section.code}
          <CodeBlock code={section.code} />
        {/if}
      </section>
    {/each}

    {#if contenu.essentiel?.length}
      <section class="mt-12 rounded-lg border border-accentborder bg-accentsurface p-5">
        <h2 class="text-sm font-semibold tracking-wide text-accentfg uppercase">
          L’essentiel
        </h2>
        <ul class="mt-3 space-y-2">
          {#each contenu.essentiel as point}
            <li class="flex gap-2 text-sm text-fg">
              <span class="text-accentfg">▸</span>
              <span><Markdown source={point} inline /></span>
            </li>
          {/each}
        </ul>
      </section>
    {/if}

    {#if contenu.pieges?.length}
      <section class="mt-6 rounded-lg border border-warnborder bg-warnsurface p-5">
        <h2 class="text-sm font-semibold tracking-wide text-warnfg uppercase">
          Pièges classiques
        </h2>
        <ul class="mt-3 space-y-2">
          {#each contenu.pieges as piege}
            <li class="flex gap-2 text-sm text-fg">
              <span class="text-warnfg">⚠</span>
              <span><Markdown source={piege} inline /></span>
            </li>
          {/each}
        </ul>
      </section>
    {/if}
  {:else}
    <p
      class="mt-10 rounded-lg border border-dashed border-border p-8 text-center text-sm text-faint"
    >
      Contenu de ce module en cours de rédaction.
    </p>
  {/if}

  {#if nbQuestions > 0}
    <a
      href={`#/quiz/${id}`}
      class="mt-12 flex items-center justify-between rounded-lg bg-accentfg px-5 py-4 text-white transition-opacity hover:opacity-90"
    >
      <span class="font-medium">Tester mes connaissances</span>
      <span class="text-sm opacity-80">{nbQuestions} questions →</span>
    </a>
  {/if}
</article>
