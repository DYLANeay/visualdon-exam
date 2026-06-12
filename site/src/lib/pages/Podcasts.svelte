<script>
  import { podcastMaster, podcastsModules } from '../data/podcasts.js'
  import AudioPlayer from '../components/AudioPlayer.svelte'

  const dispoModules = podcastsModules.filter((p) => p.disponible)
  const aucun = !podcastMaster.disponible && dispoModules.length === 0
</script>

<section class="mx-auto max-w-2xl py-12">
  <h1 class="text-2xl font-semibold text-fg-strong">Podcasts</h1>
  <p class="mt-2 text-muted">
    Des épisodes de révision générés à partir du cours, à écouter partout — la lecture
    continue même écran verrouillé.
  </p>

  {#if aucun}
    <p class="mt-8 rounded-lg border border-dashed border-border p-8 text-center text-sm text-faint">
      Les podcasts arrivent bientôt. (Génération via <code class="font-mono">scripts/podcasts/generer.sh</code>)
    </p>
  {:else}
    {#if podcastMaster.disponible}
      <h2 class="mt-10 mb-3 text-sm font-semibold tracking-wide text-accentfg uppercase">
        À écouter en priorité
      </h2>
      <AudioPlayer
        titre={podcastMaster.titre}
        sous_titre={podcastMaster.sous_titre}
        src={podcastMaster.fichier}
      />
    {/if}

    {#if dispoModules.length}
      <h2 class="mt-10 mb-3 text-sm font-semibold tracking-wide text-muted uppercase">
        Par module
      </h2>
      <div class="space-y-3">
        {#each dispoModules as p}
          <AudioPlayer titre={p.titre} sous_titre={p.sous_titre} src={p.fichier} />
        {/each}
      </div>
    {/if}
  {/if}
</section>
