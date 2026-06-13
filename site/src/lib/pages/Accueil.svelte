<script>
  import { modules } from '../data/modules.js'
  import { toutesLesCartes } from '../flashcards/index.js'
  import { estDue } from '../flashcards/sm2.js'
  import { cartesEtat } from '../stores/cards.js'
  import { stats, estFaible } from '../stores/stats.js'

  // Combien de cartes sont dues aujourd'hui (répétition espacée) ?
  const cartesDues = $derived(
    toutesLesCartes().filter((c) => estDue($cartesEtat[c.id])).length,
  )
  // Combien de points faibles à rattraper (questions ratées non rectifiées) ?
  const erreurs = $derived(
    Object.values($stats.questions).filter((st) => estFaible(st)).length,
  )
  const aReviser = $derived(cartesDues > 0 || erreurs > 0)

  const sections = [
    { href: '#/modules', titre: 'Modules', desc: `${modules.length} cours à maîtriser, avec quiz et code modifiable.` },
    { href: '#/essentiel', titre: 'L’essentiel', desc: 'La synthèse des fondamentaux - la base de ton formulaire A4.' },
    { href: '#/examen', titre: 'Examen blanc', desc: 'Un examen généré au format officiel : 2 h, 96 points.' },
    { href: '#/flashcards', titre: 'Flashcards', desc: 'Répétition espacée pour ne rien oublier.' },
  ]
</script>

<section class="mx-auto max-w-4xl py-16 text-center">
  <h1 class="text-4xl font-semibold tracking-tight text-fg-strong">
    Révise VisualDon, <span class="text-accentfg">sans stress</span>.
  </h1>
  <p class="mt-4 text-lg text-muted">
    Tout le cours, l’examen type et les exercices préparatoires - en quiz,
    flashcards et code à manipuler. Le cours 11 (scrollytelling) n’est pas évalué,
    on n’en parle donc pas.
  </p>
</section>

{#if aReviser}
  <section class="mx-auto mb-12 max-w-4xl rounded-xl border border-accentborder bg-accentsurface p-6">
    <h2 class="text-sm font-semibold text-fg-strong">À réviser aujourd’hui</h2>
    <div class="mt-4 flex flex-wrap gap-3">
      {#if cartesDues > 0}
        <a
          href="#/flashcards"
          class="flex items-center gap-3 rounded-lg border border-border bg-bg px-4 py-3 transition-colors hover:border-accentfg"
        >
          <span class="text-2xl font-bold text-accentfg">{cartesDues}</span>
          <span class="text-sm text-fg">carte{cartesDues > 1 ? 's' : ''} due{cartesDues > 1 ? 's' : ''}<br /><span class="text-faint">répétition espacée</span></span>
        </a>
      {/if}
      {#if erreurs > 0}
        <a
          href="#/erreurs"
          class="flex items-center gap-3 rounded-lg border border-border bg-bg px-4 py-3 transition-colors hover:border-accentfg"
        >
          <span class="text-2xl font-bold text-amber-600">{erreurs}</span>
          <span class="text-sm text-fg">erreur{erreurs > 1 ? 's' : ''} à rattraper<br /><span class="text-faint">tes points faibles</span></span>
        </a>
      {/if}
    </div>
  </section>
{/if}

<section class="mx-auto grid max-w-4xl gap-4 pb-16 sm:grid-cols-2">
  {#each sections as s}
    <a
      href={s.href}
      class="rounded-lg border border-border p-6 transition-colors hover:border-accentfg"
    >
      <h2 class="font-medium text-fg-strong">{s.titre}</h2>
      <p class="mt-1 text-sm text-muted">{s.desc}</p>
    </a>
  {/each}
</section>
