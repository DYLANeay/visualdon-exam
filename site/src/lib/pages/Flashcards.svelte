<script>
  import { get } from 'svelte/store'
  import { modules } from '../data/modules.js'
  import { toutesLesCartes, cartesModule } from '../flashcards/index.js'
  import { cartesEtat, majCarte, reinitialiserCartes } from '../stores/cards.js'
  import {
    reviser,
    estDue,
    ETAT_INITIAL,
    apercuIntervalle,
    maturite,
    aMonte,
  } from '../flashcards/sm2.js'
  import { exporterAnki } from '../flashcards/anki.js'
  import { melanger } from '../quiz/index.js'
  import Markdown from '../components/Markdown.svelte'

  let deck = $state(null) // null = écran de choix ; sinon 'all' | id module
  let file = $state([]) // cartes à réviser (dues)
  let index = $state(0)
  let retournee = $state(false)
  let faites = $state(0)
  let monteeCap = $state(0) // nombre de cartes ayant gagné en maturité
  let flash = $state(null) // message « level up » éphémère

  const carteCourante = $derived(file[index] ?? null)
  const restantes = $derived(file.length - index)
  const etatCourant = $derived(carteCourante ? ($cartesEtat[carteCourante.id] ?? ETAT_INITIAL) : ETAT_INITIAL)
  const maturiteCourante = $derived(maturite($cartesEtat[carteCourante?.id]))

  // Répartition des cartes par maturité (façon compteurs Anki).
  function repartition(cartes, etats) {
    const r = { nouvelle: 0, apprentissage: 0, 'mûre': 0 }
    for (const c of cartes) r[maturite(etats[c.id])]++
    return r
  }

  function nbDues(cartes, etats) {
    return cartes.filter((c) => estDue(etats[c.id])).length
  }

  const badgeMaturite = {
    nouvelle: { label: 'Nouvelle', classe: 'bg-surface text-muted' },
    apprentissage: { label: 'En apprentissage', classe: 'bg-warnsurface text-warnfg' },
    'mûre': { label: 'Mûre 🌳', classe: 'bg-green-500/10 text-green-600' },
  }

  const decks = $derived([
    { id: 'all', titre: 'Toutes les cartes', cartes: toutesLesCartes() },
    ...modules.map((m) => ({ id: m.id, titre: m.titre, cartes: cartesModule(m.id) })),
  ])

  function demarrer(d) {
    const etats = get(cartesEtat)
    const dues = d.cartes.filter((c) => estDue(etats[c.id]))
    file = melanger(dues.length ? dues : d.cartes) // tout réviser si rien n'est dû
    index = 0
    faites = 0
    monteeCap = 0
    retournee = false
    deck = d.id
  }

  function exporter(d) {
    exporterAnki(d.cartes, `visualdon-${d.id}.txt`)
  }

  const niveaux = [
    { label: 'Encore', q: 0, classe: 'border-red-500 text-red-500 hover:bg-red-500/10' },
    { label: 'Difficile', q: 3, classe: 'border-amber-500 text-warnfg hover:bg-warnsurface' },
    { label: 'Bien', q: 4, classe: 'border-accentfg text-accentfg hover:bg-accentsurface' },
    { label: 'Facile', q: 5, classe: 'border-green-500 text-green-600 hover:bg-green-500/10' },
  ]

  function noter(q) {
    const c = carteCourante
    if (!c) return
    const etat = get(cartesEtat)[c.id] ?? ETAT_INITIAL
    const suivant = reviser(etat, q)
    majCarte(c.id, suivant)
    faites += 1
    // « Level up » : la carte a gagné en maturité (apprentissage → mûre, etc.).
    if (aMonte(etat, suivant)) {
      monteeCap += 1
      flash = maturite(suivant) === 'mûre' ? 'Carte mûrie 🌳' : 'Carte apprise ✨'
      setTimeout(() => (flash = null), 1400)
    }
    // Si "Encore", on remet la carte plus loin dans la file de session.
    if (q < 3) file = [...file, c]
    index += 1
    retournee = false
  }

  function quitter() {
    deck = null
  }

  function reinitialiser() {
    if (
      window.confirm(
        'Réinitialiser les flashcards ? Tout l’historique de répétition espacée sera effacé et toutes les cartes redeviendront à réviser.',
      )
    ) {
      reinitialiserCartes()
      deck = null
    }
  }
</script>

<section class="mx-auto max-w-2xl py-12">
  {#if deck === null}
    <h1 class="text-2xl font-semibold text-fg-strong">Flashcards</h1>
    <p class="mt-2 text-muted">
      Révision par <strong class="text-fg">répétition espacée</strong> : les cartes que tu
      maîtrises reviennent de moins en moins souvent.
    </p>

    {@const total = repartition(toutesLesCartes(), $cartesEtat)}
    <div class="mt-6 flex flex-wrap items-center gap-4 rounded-lg border border-border p-4 text-sm">
      <span class="flex items-center gap-1.5"><span class="size-2.5 rounded-full bg-muted/40"></span>{total.nouvelle} nouvelles</span>
      <span class="flex items-center gap-1.5"><span class="size-2.5 rounded-full bg-amber-500"></span>{total.apprentissage} en apprentissage</span>
      <span class="flex items-center gap-1.5"><span class="size-2.5 rounded-full bg-green-500"></span>{total['mûre']} mûres 🌳</span>
    </div>

    <div class="mt-6 divide-y divide-border">
      {#each decks as d}
        {@const dues = nbDues(d.cartes, $cartesEtat)}
        {@const rep = repartition(d.cartes, $cartesEtat)}
        <div class="flex items-center gap-3 py-3">
          <button
            onclick={() => demarrer(d)}
            class="group flex flex-1 items-center justify-between gap-3 rounded-md px-2 py-1.5 text-left transition-colors hover:bg-surface"
          >
            <span class="min-w-0">
              <span class="font-medium text-fg-strong">{d.titre}</span>
              <!-- mini-barre de maturité -->
              <span class="mt-1 flex h-1 w-32 overflow-hidden rounded-full bg-surface">
                <span class="bg-muted/40" style="width:{(rep.nouvelle / d.cartes.length) * 100}%"></span>
                <span class="bg-amber-500" style="width:{(rep.apprentissage / d.cartes.length) * 100}%"></span>
                <span class="bg-green-500" style="width:{(rep['mûre'] / d.cartes.length) * 100}%"></span>
              </span>
            </span>
            <span class="shrink-0 text-sm {dues ? 'text-accentfg' : 'text-faint'}">
              {dues ? `${dues} à réviser` : `${d.cartes.length} cartes`}
            </span>
          </button>
          <button
            onclick={() => exporter(d)}
            title="Exporter ce deck vers Anki"
            aria-label="Exporter vers Anki"
            class="shrink-0 rounded-md border border-border p-1.5 text-faint transition-colors hover:border-accentfg hover:text-accentfg"
          >
            <svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 3v12m0 0l-4-4m4 4l4-4M4 17v2a2 2 0 002 2h12a2 2 0 002-2v-2" />
            </svg>
          </button>
        </div>
      {/each}
    </div>

    <div class="mt-8 flex items-center justify-between">
      <button
        onclick={reinitialiser}
        class="text-sm text-faint underline-offset-2 transition-colors hover:text-red-500 hover:underline"
      >
        Réinitialiser les flashcards
      </button>
      <button
        onclick={() => exporterAnki(toutesLesCartes(), 'visualdon-flashcards.txt')}
        class="rounded-md border border-border px-3 py-1.5 text-sm font-medium text-muted transition-colors hover:border-accentfg hover:text-accentfg"
      >
        ↓ Exporter tout vers Anki
      </button>
    </div>
    <p class="mt-3 text-xs text-faint">
      Le fichier <code>.txt</code> s’importe directement dans Anki (Fichier → Importer) :
      séparateur tabulation, HTML activé, tags par module.
    </p>
  {:else if carteCourante}
    <div class="mb-6 flex items-center justify-between text-sm text-muted">
      <button onclick={quitter} class="hover:text-fg-strong">← Decks</button>
      <div class="flex items-center gap-3">
        <span class="rounded-full px-2 py-0.5 text-xs font-medium {badgeMaturite[maturiteCourante].classe}">
          {badgeMaturite[maturiteCourante].label}
        </span>
        <span>{restantes} restante{restantes > 1 ? 's' : ''}</span>
      </div>
    </div>

    <div class="relative">
      {#if flash}
        <div class="pointer-events-none absolute -top-3 left-1/2 z-10 -translate-x-1/2 rounded-full bg-green-500 px-3 py-1 text-xs font-semibold text-white shadow">
          {flash}
        </div>
      {/if}
      <button
        onclick={() => (retournee = !retournee)}
        class="flex min-h-64 w-full flex-col items-center justify-center rounded-xl border border-border bg-surface p-8 text-center transition-colors hover:border-accentfg"
      >
        {#if !retournee}
          <span class="text-lg text-fg-strong"><Markdown source={carteCourante.recto} inline /></span>
          <span class="mt-6 text-xs text-faint">Cliquer pour retourner</span>
        {:else}
          <div class="text-fg"><Markdown source={carteCourante.verso} /></div>
        {/if}
      </button>
    </div>

    {#if retournee}
      <div class="mt-6 grid grid-cols-4 gap-2">
        {#each niveaux as n}
          <button
            onclick={() => noter(n.q)}
            class={`flex flex-col items-center gap-0.5 rounded-md border px-2 py-2 text-sm font-medium transition-colors ${n.classe}`}
          >
            <span>{n.label}</span>
            <span class="font-mono text-[10px] opacity-70">{apercuIntervalle(etatCourant, n.q)}</span>
          </button>
        {/each}
      </div>
    {/if}
  {:else}
    <div class="py-12 text-center">
      <p class="text-2xl">🎉</p>
      <p class="mt-2 text-lg font-semibold text-fg-strong">Session terminée !</p>
      <p class="mt-1 text-muted">
        {faites} carte{faites > 1 ? 's' : ''} révisée{faites > 1 ? 's' : ''}{monteeCap
          ? ` · ${monteeCap} cap${monteeCap > 1 ? 's' : ''} franchi${monteeCap > 1 ? 's' : ''} 🚀`
          : ''}.
      </p>
      <button
        onclick={quitter}
        class="mt-6 rounded-md bg-accentfg px-5 py-2 font-medium text-white hover:opacity-90"
      >
        Retour aux decks
      </button>
    </div>
  {/if}
</section>
