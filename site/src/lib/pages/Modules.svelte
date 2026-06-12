<script>
  import { modules } from '../data/modules.js'
  import { progress } from '../stores/progress.js'

  function statut(id) {
    return $progress.modules[id]?.statut ?? 'à faire'
  }
</script>

<section class="mx-auto max-w-4xl py-12">
  <h1 class="text-2xl font-semibold text-fg-strong">Modules</h1>
  <p class="mt-2 text-muted">
    Un module par cours évalué. Résumés, quiz et code à venir.
  </p>

  <ul class="mt-8 divide-y divide-border">
    {#each modules as m}
      <li>
        <a
          href={`#/modules/${m.id}`}
          class="flex items-baseline gap-4 py-4 transition-colors hover:bg-surface"
        >
          <span class="w-8 shrink-0 font-mono text-sm text-faint">
            {String(m.numero).padStart(2, '0')}
          </span>
          <div class="min-w-0 flex-1">
            <h2 class="font-medium text-fg-strong">{m.titre}</h2>
            <p class="truncate text-sm text-muted">{m.resume}</p>
          </div>
          <span class="shrink-0 text-xs text-faint">{statut(m.id)}</span>
        </a>
      </li>
    {/each}
  </ul>
</section>
