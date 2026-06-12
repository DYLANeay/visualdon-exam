<script>
  import { modules } from '../data/modules.js'
  import { contenuModule } from '../content/index.js'
  import Markdown from '../components/Markdown.svelte'

  // Agrège l'essentiel + les pièges de chaque module, dans l'ordre des cours.
  const fiches = modules
    .map((m) => ({ meta: m, contenu: contenuModule(m.id) }))
    .filter((f) => f.contenu)
</script>

<section class="mx-auto max-w-3xl py-12">
  <div class="flex items-start justify-between gap-4">
    <div>
      <h1 class="text-2xl font-semibold text-fg-strong">L’essentiel</h1>
      <p class="mt-2 text-muted">
        Tous les fondamentaux du cours, condensés. La base idéale pour ton
        <strong class="font-medium text-fg">formulaire A4</strong> autorisé à l’examen.
      </p>
    </div>
    <button
      onclick={() => window.print()}
      class="shrink-0 rounded-md border border-border px-3 py-1.5 text-sm text-muted transition-colors hover:border-accentfg hover:text-accentfg"
    >
      Imprimer
    </button>
  </div>

  <div class="mt-10 space-y-10">
    {#each fiches as { meta, contenu }}
      <section class="break-inside-avoid">
        <h2 class="flex items-baseline gap-2 border-b border-border pb-2">
          <span class="font-mono text-sm text-accentfg">
            {String(meta.numero).padStart(2, '0')}
          </span>
          <a href={`#/modules/${meta.id}`} class="font-semibold text-fg-strong hover:text-accentfg">
            {meta.titre}
          </a>
        </h2>

        {#if contenu.essentiel?.length}
          <ul class="mt-3 space-y-1.5">
            {#each contenu.essentiel as point}
              <li class="flex gap-2 text-sm text-fg">
                <span class="text-accentfg">▸</span>
                <span><Markdown source={point} inline /></span>
              </li>
            {/each}
          </ul>
        {/if}

        {#if contenu.pieges?.length}
          <ul class="mt-3 space-y-1.5">
            {#each contenu.pieges as piege}
              <li class="flex gap-2 text-sm text-muted">
                <span class="text-warnfg">⚠</span>
                <span><Markdown source={piege} inline /></span>
              </li>
            {/each}
          </ul>
        {/if}
      </section>
    {/each}
  </div>
</section>
