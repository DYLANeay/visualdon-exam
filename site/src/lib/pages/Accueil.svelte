<script>
  import { progress } from '../stores/progress.js'
  import { modules } from '../data/modules.js'

  const sections = [
    { href: '#/modules', titre: 'Modules', desc: `${modules.length} cours à maîtriser, avec quiz et code modifiable.` },
    { href: '#/essentiel', titre: 'L’essentiel', desc: 'La synthèse des fondamentaux — la base de ton formulaire A4.' },
    { href: '#/examen', titre: 'Examen blanc', desc: 'Un examen généré au format officiel : 2 h, 96 points.' },
    { href: '#/flashcards', titre: 'Flashcards', desc: 'Répétition espacée pour ne rien oublier.' },
  ]
</script>

<section class="mx-auto max-w-4xl py-16 text-center">
  <h1 class="text-4xl font-semibold tracking-tight text-fg-strong">
    Révise VisualDon, <span class="text-accentfg">sans stress</span>.
  </h1>
  <p class="mt-4 text-lg text-muted">
    Tout le cours, l’examen type et les exercices préparatoires — en quiz,
    flashcards et code à manipuler. Le cours 11 (scrollytelling) n’est pas évalué,
    on n’en parle donc pas.
  </p>
  <p class="mt-6 text-sm text-faint">{$progress.xp} XP accumulés</p>
</section>

<section class="mx-auto grid max-w-3xl gap-4 pb-16 sm:grid-cols-2">
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
