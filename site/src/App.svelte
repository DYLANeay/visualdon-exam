<script>
  import { route } from './lib/router.js'
  import { progress } from './lib/stores/progress.js'
  import Accueil from './lib/pages/Accueil.svelte'
  import Modules from './lib/pages/Modules.svelte'
  import Module from './lib/pages/Module.svelte'
  import Essentiel from './lib/pages/Essentiel.svelte'
  import Placeholder from './lib/pages/Placeholder.svelte'
  import ThemeToggle from './lib/components/ThemeToggle.svelte'

  // /modules/<id> → page de détail d'un module
  const moduleId = $derived(
    $route.startsWith('/modules/') ? $route.slice('/modules/'.length) : null,
  )

  const nav = [
    { path: '/modules', label: 'Modules' },
    { path: '/essentiel', label: 'L’essentiel' },
    { path: '/examen', label: 'Examen blanc' },
    { path: '/flashcards', label: 'Flashcards' },
    { path: '/profil', label: 'Profil' },
  ]

  const placeholders = {
    '/examen': {
      titre: 'Examen blanc',
      description: 'Examens générés dynamiquement au format officiel : QCM 20 pts · D3 36 pts · cartographie 25 pts · éthique 15 pts.',
    },
    '/flashcards': {
      titre: 'Flashcards',
      description: 'Révision par répétition espacée : les cartes dues remontent automatiquement.',
    },
    '/profil': {
      titre: 'Profil',
      description: 'XP, badges, streak et export de ta progression.',
    },
  }
</script>

<header class="border-b border-border">
  <div class="mx-auto flex max-w-3xl items-center justify-between px-4 py-4">
    <a href="#/" class="font-semibold tracking-tight text-fg-strong">
      VisualDon<span class="text-accentfg">·</span>Révisions
    </a>
    <nav class="flex items-center gap-5 text-sm">
      {#each nav as item}
        <a
          href={'#' + item.path}
          class={$route.startsWith(item.path)
            ? 'font-medium text-accentfg'
            : 'text-muted transition-colors hover:text-fg-strong'}
        >
          {item.label}
        </a>
      {/each}
      <span class="rounded-full bg-accentsurface px-2.5 py-0.5 font-mono text-xs text-accentfg">
        {$progress.xp} XP
      </span>
      <ThemeToggle />
    </nav>
  </div>
</header>

<main class="px-4">
  {#if $route === '/'}
    <Accueil />
  {:else if moduleId}
    <Module id={moduleId} />
  {:else if $route.startsWith('/modules')}
    <Modules />
  {:else if $route === '/essentiel'}
    <Essentiel />
  {:else if placeholders[$route]}
    <Placeholder {...placeholders[$route]} />
  {:else}
    <Placeholder titre="Page introuvable" description="Ce chemin ne mène nulle part. Retourne à l’accueil !" />
  {/if}
</main>

<footer class="mt-16 border-t border-border py-8 text-center text-xs text-faint">
  VisualDon · HEIG-VD / COMEM · Examen : 2 h sur papier, formulaire A4 r/v autorisé
</footer>
