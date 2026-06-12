<script>
  import { get } from 'svelte/store'
  import { progress, niveau } from '../stores/progress.js'
  import { cartesEtat } from '../stores/cards.js'
  import { theme } from '../stores/theme.js'
  import { badges } from '../data/badges.js'
  import { modules } from '../data/modules.js'

  const niv = $derived(niveau($progress.xp))
  const maitrise = $derived(
    modules.filter((m) => $progress.modules[m.id]?.statut === 'maîtrisé').length,
  )

  // Export : un seul fichier JSON avec toute la progression.
  function exporter() {
    const data = {
      version: 1,
      exporte: new Date().toISOString(),
      progress: get(progress),
      cards: get(cartesEtat),
      theme: get(theme),
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `visualdon-progression-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  let messageImport = $state('')
  function importer(e) {
    const fichier = e.target.files?.[0]
    if (!fichier) return
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result)
        if (data.progress) progress.set(data.progress)
        if (data.cards) cartesEtat.set(data.cards)
        if (data.theme) theme.set(data.theme)
        messageImport = '✓ Progression importée.'
      } catch {
        messageImport = '✗ Fichier invalide.'
      }
    }
    reader.readAsText(fichier)
  }

  function reset() {
    if (!confirm('Réinitialiser toute ta progression ? Cette action est irréversible.')) return
    progress.set({ xp: 0, badges: [], streak: { count: 0, lastDay: null }, modules: {} })
    cartesEtat.set({})
    messageImport = 'Progression réinitialisée.'
  }
</script>

<section class="mx-auto max-w-3xl py-12">
  <h1 class="text-2xl font-semibold text-fg-strong">Ton profil</h1>

  <!-- Stats principales -->
  <div class="mt-8 grid gap-4 sm:grid-cols-3">
    <div class="rounded-lg border border-border p-5">
      <p class="text-3xl font-bold text-fg-strong">Niv. {niv.n}</p>
      <p class="mt-1 text-sm text-muted">{$progress.xp} XP</p>
      <div class="mt-3 h-1.5 overflow-hidden rounded-full bg-surface">
        <div class="h-full bg-accentfg" style={`width:${niv.dansNiveau}%`}></div>
      </div>
      <p class="mt-1 text-xs text-faint">{niv.versSuivant} XP avant le niveau {niv.n + 1}</p>
    </div>
    <div class="rounded-lg border border-border p-5">
      <p class="text-3xl font-bold text-fg-strong">🔥 {$progress.streak?.count ?? 0}</p>
      <p class="mt-1 text-sm text-muted">jours d’affilée</p>
    </div>
    <div class="rounded-lg border border-border p-5">
      <p class="text-3xl font-bold text-fg-strong">{maitrise} / {modules.length}</p>
      <p class="mt-1 text-sm text-muted">modules maîtrisés</p>
    </div>
  </div>

  <!-- Badges -->
  <h2 class="mt-12 text-lg font-semibold text-fg-strong">Badges</h2>
  <div class="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
    {#each badges as b}
      {@const obtenu = $progress.badges.includes(b.id)}
      <div
        class={`rounded-lg border p-4 ${obtenu ? 'border-accentborder bg-accentsurface' : 'border-border opacity-50'}`}
      >
        <p class="text-2xl">{obtenu ? b.emoji : '🔒'}</p>
        <p class="mt-1 text-sm font-medium text-fg-strong">{b.titre}</p>
        <p class="text-xs text-muted">{b.desc}</p>
      </div>
    {/each}
  </div>

  <!-- Progression par module -->
  <h2 class="mt-12 text-lg font-semibold text-fg-strong">Modules</h2>
  <div class="mt-4 divide-y divide-border">
    {#each modules as m}
      {@const e = $progress.modules[m.id]}
      <div class="flex items-center justify-between py-3 text-sm">
        <a href={`#/modules/${m.id}`} class="text-fg hover:text-accentfg">{m.titre}</a>
        <span class={e?.statut === 'maîtrisé' ? 'text-green-600' : e ? 'text-warnfg' : 'text-faint'}>
          {e?.statut ?? 'à faire'}{e?.meilleurScore ? ` · ${e.meilleurScore} %` : ''}
        </span>
      </div>
    {/each}
  </div>

  <!-- Sauvegarde -->
  <h2 class="mt-12 text-lg font-semibold text-fg-strong">Sauvegarde</h2>
  <p class="mt-1 text-sm text-muted">
    Ta progression vit dans ce navigateur. Exporte-la pour la retrouver sur une autre machine.
  </p>
  <div class="mt-4 flex flex-wrap items-center gap-3">
    <button onclick={exporter} class="rounded-md bg-accentfg px-4 py-1.5 text-sm font-medium text-white hover:opacity-90">
      Exporter
    </button>
    <label class="cursor-pointer rounded-md border border-border px-4 py-1.5 text-sm text-fg hover:border-accentfg">
      Importer
      <input type="file" accept="application/json" onchange={importer} class="hidden" />
    </label>
    <button onclick={reset} class="rounded-md border border-red-500 px-4 py-1.5 text-sm text-red-500 hover:bg-red-500/10">
      Réinitialiser
    </button>
    {#if messageImport}<span class="text-sm text-muted">{messageImport}</span>{/if}
  </div>
</section>
