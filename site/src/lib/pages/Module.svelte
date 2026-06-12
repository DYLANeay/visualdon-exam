<script>
  import { modules } from '../data/modules.js'
  import { contenuModule } from '../content/index.js'
  import Markdown from '../components/Markdown.svelte'
  import CodeBlock from '../components/CodeBlock.svelte'

  let { id } = $props()

  const meta = $derived(modules.find((m) => m.id === id))
  const contenu = $derived(contenuModule(id))
</script>

<article class="mx-auto max-w-3xl py-12">
  <a href="#/modules" class="text-sm text-neutral-400 hover:text-neutral-900">
    ← Tous les modules
  </a>

  {#if meta}
    <p class="mt-6 font-mono text-sm text-accent-600">
      Cours {String(meta.numero).padStart(2, '0')}
    </p>
    <h1 class="mt-1 text-3xl font-semibold tracking-tight text-neutral-900">
      {meta.titre}
    </h1>
  {/if}

  {#if contenu}
    {#if contenu.accroche}
      <p class="mt-4 text-lg text-neutral-500">
        <Markdown source={contenu.accroche} inline />
      </p>
    {/if}

    {#each contenu.sections ?? [] as section}
      <section class="mt-10">
        <h2 class="text-xl font-semibold text-neutral-900">{section.titre}</h2>
        {#if section.corps}
          <Markdown source={section.corps} />
        {/if}
        {#if section.code}
          <CodeBlock code={section.code} />
        {/if}
      </section>
    {/each}

    {#if contenu.essentiel?.length}
      <section class="mt-12 rounded-lg border border-accent-100 bg-accent-50 p-5">
        <h2 class="text-sm font-semibold tracking-wide text-accent-700 uppercase">
          L’essentiel
        </h2>
        <ul class="mt-3 space-y-2">
          {#each contenu.essentiel as point}
            <li class="flex gap-2 text-sm text-neutral-700">
              <span class="text-accent-500">▸</span>
              <span><Markdown source={point} inline /></span>
            </li>
          {/each}
        </ul>
      </section>
    {/if}

    {#if contenu.pieges?.length}
      <section class="mt-6 rounded-lg border border-amber-200 bg-amber-50 p-5">
        <h2 class="text-sm font-semibold tracking-wide text-amber-700 uppercase">
          Pièges classiques
        </h2>
        <ul class="mt-3 space-y-2">
          {#each contenu.pieges as piege}
            <li class="flex gap-2 text-sm text-neutral-700">
              <span class="text-amber-500">⚠</span>
              <span><Markdown source={piege} inline /></span>
            </li>
          {/each}
        </ul>
      </section>
    {/if}
  {:else}
    <p
      class="mt-10 rounded-lg border border-dashed border-neutral-300 p-8 text-center text-sm text-neutral-400"
    >
      Contenu de ce module en cours de rédaction.
    </p>
  {/if}
</article>
