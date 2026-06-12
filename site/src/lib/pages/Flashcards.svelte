<script>
  import { get } from 'svelte/store'
  import { modules } from '../data/modules.js'
  import { toutesLesCartes, cartesModule } from '../flashcards/index.js'
  import { cartesEtat, majCarte } from '../stores/cards.js'
  import { reviser, estDue, ETAT_INITIAL } from '../flashcards/sm2.js'
  import { addXp } from '../stores/progress.js'
  import { melanger } from '../quiz/index.js'
  import Markdown from '../components/Markdown.svelte'

  let deck = $state(null) // null = écran de choix ; sinon 'all' | id module
  let file = $state([]) // cartes à réviser (dues)
  let index = $state(0)
  let retournee = $state(false)
  let faites = $state(0)

  const carteCourante = $derived(file[index] ?? null)
  const restantes = $derived(file.length - index)

  function nbDues(cartes) {
    const etats = get(cartesEtat)
    return cartes.filter((c) => estDue(etats[c.id])).length
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
    retournee = false
    deck = d.id
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
    if (q >= 4) addXp(2)
    faites += 1
    // Si "Encore", on remet la carte plus loin dans la file de session.
    if (q < 3) file = [...file, c]
    index += 1
    retournee = false
  }

  function quitter() {
    deck = null
  }
</script>

<section class="mx-auto max-w-2xl py-12">
  {#if deck === null}
    <h1 class="text-2xl font-semibold text-fg-strong">Flashcards</h1>
    <p class="mt-2 text-muted">
      Révision par <strong class="text-fg">répétition espacée</strong> : les cartes que tu
      maîtrises reviennent de moins en moins souvent.
    </p>

    <div class="mt-8 divide-y divide-border">
      {#each decks as d}
        {@const dues = nbDues(d.cartes)}
        <button
          onclick={() => demarrer(d)}
          class="flex w-full items-center justify-between py-4 text-left transition-colors hover:bg-surface"
        >
          <span class="font-medium text-fg-strong">{d.titre}</span>
          <span class="text-sm {dues ? 'text-accentfg' : 'text-faint'}">
            {dues ? `${dues} à réviser` : `${d.cartes.length} cartes`}
          </span>
        </button>
      {/each}
    </div>
  {:else if carteCourante}
    <div class="mb-6 flex items-center justify-between text-sm text-muted">
      <button onclick={quitter} class="hover:text-fg-strong">← Decks</button>
      <span>{restantes} restante{restantes > 1 ? 's' : ''}</span>
    </div>

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

    {#if retournee}
      <div class="mt-6 grid grid-cols-4 gap-2">
        {#each niveaux as n}
          <button
            onclick={() => noter(n.q)}
            class={`rounded-md border px-2 py-2 text-sm font-medium transition-colors ${n.classe}`}
          >
            {n.label}
          </button>
        {/each}
      </div>
    {/if}
  {:else}
    <div class="py-12 text-center">
      <p class="text-2xl">🎉</p>
      <p class="mt-2 text-lg font-semibold text-fg-strong">Session terminée !</p>
      <p class="mt-1 text-muted">{faites} carte{faites > 1 ? 's' : ''} révisée{faites > 1 ? 's' : ''}.</p>
      <button
        onclick={quitter}
        class="mt-6 rounded-md bg-accentfg px-5 py-2 font-medium text-white hover:opacity-90"
      >
        Retour aux decks
      </button>
    </div>
  {/if}
</section>
