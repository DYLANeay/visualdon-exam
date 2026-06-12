<script>
  // Lecteur audio avec Media Session API : la lecture continue écran verrouillé,
  // avec titre et contrôles sur l'écran de verrouillage / les écouteurs.
  let { titre, sous_titre, src } = $props()

  let audio
  let joue = $state(false)
  let position = $state(0)
  let duree = $state(0)
  let vitesse = $state(1)
  const vitesses = [1, 1.25, 1.5, 2]

  function fmt(s) {
    if (!s || isNaN(s)) return '0:00'
    const m = Math.floor(s / 60)
    const r = Math.floor(s % 60)
    return `${m}:${String(r).padStart(2, '0')}`
  }

  function basculer() {
    if (!audio) return
    audio.paused ? audio.play() : audio.pause()
  }

  function changerVitesse() {
    const i = (vitesses.indexOf(vitesse) + 1) % vitesses.length
    vitesse = vitesses[i]
    if (audio) audio.playbackRate = vitesse
  }

  function seek(e) {
    if (audio) audio.currentTime = +e.target.value
  }

  function brancherMediaSession() {
    if (!('mediaSession' in navigator)) return
    navigator.mediaSession.metadata = new MediaMetadata({
      title: titre,
      artist: sous_titre,
      album: 'VisualDon · Révisions',
    })
    navigator.mediaSession.setActionHandler('play', () => audio?.play())
    navigator.mediaSession.setActionHandler('pause', () => audio?.pause())
    navigator.mediaSession.setActionHandler('seekbackward', () => {
      if (audio) audio.currentTime = Math.max(0, audio.currentTime - 15)
    })
    navigator.mediaSession.setActionHandler('seekforward', () => {
      if (audio) audio.currentTime = Math.min(duree, audio.currentTime + 30)
    })
  }
</script>

<div class="rounded-lg border border-border p-4">
  <audio
    bind:this={audio}
    {src}
    preload="metadata"
    onplay={() => { joue = true; brancherMediaSession() }}
    onpause={() => (joue = false)}
    ontimeupdate={() => (position = audio.currentTime)}
    onloadedmetadata={() => (duree = audio.duration)}
  ></audio>

  <div class="flex items-center gap-3">
    <button
      onclick={basculer}
      class="grid size-10 shrink-0 place-items-center rounded-full bg-accentfg text-white hover:opacity-90"
      aria-label={joue ? 'Pause' : 'Lecture'}
    >
      {#if joue}
        <svg class="size-5" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/></svg>
      {:else}
        <svg class="size-5" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
      {/if}
    </button>

    <div class="min-w-0 flex-1">
      <p class="truncate text-sm font-medium text-fg-strong">{titre}</p>
      <div class="mt-1 flex items-center gap-2">
        <span class="font-mono text-xs text-faint">{fmt(position)}</span>
        <input
          type="range" min="0" max={duree || 0} value={position} oninput={seek}
          class="h-1 flex-1 cursor-pointer accent-accentfg"
        />
        <span class="font-mono text-xs text-faint">{fmt(duree)}</span>
      </div>
    </div>

    <button
      onclick={changerVitesse}
      class="shrink-0 rounded border border-border px-2 py-1 font-mono text-xs text-muted hover:text-fg-strong"
    >
      {vitesse}×
    </button>
  </div>
</div>
