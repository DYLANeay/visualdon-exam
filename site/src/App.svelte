<script>
  import { route } from './lib/router.js'
  import Accueil from './lib/pages/Accueil.svelte'
  import Modules from './lib/pages/Modules.svelte'
  import Module from './lib/pages/Module.svelte'
  import Essentiel from './lib/pages/Essentiel.svelte'
  import Quiz from './lib/pages/Quiz.svelte'
  import Examen from './lib/pages/Examen.svelte'
  import Flashcards from './lib/pages/Flashcards.svelte'
  import Erreurs from './lib/pages/Erreurs.svelte'
  import Podcasts from './lib/pages/Podcasts.svelte'
  import Placeholder from './lib/pages/Placeholder.svelte'
  import ThemeToggle from './lib/components/ThemeToggle.svelte'

  // /modules/<id> → détail ; /quiz/<id> → quiz du module
  const moduleId = $derived(
    $route.startsWith('/modules/') ? $route.slice('/modules/'.length) : null,
  )
  const quizId = $derived(
    $route.startsWith('/quiz/') ? $route.slice('/quiz/'.length) : null,
  )

  const nav = [
    { path: '/modules', label: 'Modules' },
    { path: '/essentiel', label: 'L’essentiel' },
    { path: '/examen', label: 'Examen blanc' },
    { path: '/flashcards', label: 'Flashcards' },
    { path: '/podcasts', label: 'Podcasts' },
  ]

  let menuOuvert = $state(false)
  // Referme le menu mobile à chaque changement de page.
  $effect(() => {
    $route
    menuOuvert = false
  })
</script>

<header class="sticky top-0 z-50 border-b border-border bg-bg/80 backdrop-blur-sm">
  <div class="mx-auto flex max-w-5xl items-center justify-between gap-4 px-6 py-3.5">
    <a href="#/" class="flex items-center gap-1.5 text-sm font-semibold tracking-tight text-fg-strong">
      <span class="grid size-6 place-items-center rounded bg-accentfg text-white text-xs font-bold">V</span>
      <span>VisualDon<span class="text-accentfg font-normal">·</span>Révisions</span>
    </a>

    <!-- Nav complète (desktop) -->
    <nav class="hidden items-center gap-1 text-sm md:flex">
      {#each nav as item}
        <a
          href={'#' + item.path}
          class={$route.startsWith(item.path)
            ? 'rounded-md px-3 py-1.5 font-medium text-accentfg bg-accentsurface'
            : 'rounded-md px-3 py-1.5 text-muted transition-colors hover:bg-surface hover:text-fg-strong'}
        >
          {item.label}
        </a>
      {/each}
      <div class="mx-2 h-4 w-px bg-border"></div>
      <ThemeToggle />
    </nav>

    <!-- Compact (mobile) -->
    <div class="flex items-center gap-2 md:hidden">
      <ThemeToggle />
      <button
        onclick={() => (menuOuvert = !menuOuvert)}
        aria-label="Menu"
        class="grid size-8 place-items-center rounded-md text-muted hover:bg-surface hover:text-fg-strong"
      >
        <svg class="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
          {#if menuOuvert}
            <path d="M6 6l12 12M18 6L6 18" />
          {:else}
            <path d="M4 7h16M4 12h16M4 17h16" />
          {/if}
        </svg>
      </button>
    </div>
  </div>

  <!-- Menu déroulant mobile -->
  {#if menuOuvert}
    <nav class="border-t border-border bg-bg md:hidden">
      {#each nav as item}
        <a
          href={'#' + item.path}
          class={`block border-b border-border px-6 py-3 text-sm ${
            $route.startsWith(item.path) ? 'font-medium text-accentfg bg-accentsurface' : 'text-fg hover:bg-surface'
          }`}
        >
          {item.label}
        </a>
      {/each}
    </nav>
  {/if}
</header>

<main class="mx-auto max-w-5xl px-6">
  {#if $route === '/'}
    <Accueil />
  {:else if quizId}
    <Quiz id={quizId} />
  {:else if moduleId}
    <Module id={moduleId} />
  {:else if $route.startsWith('/modules')}
    <Modules />
  {:else if $route === '/essentiel'}
    <Essentiel />
  {:else if $route === '/examen'}
    <Examen />
  {:else if $route === '/flashcards'}
    <Flashcards />
  {:else if $route === '/erreurs'}
    <Erreurs />
  {:else if $route === '/podcasts'}
    <Podcasts />
  {:else}
    <Placeholder titre="Page introuvable" description="Ce chemin ne mène nulle part. Retourne à l’accueil !" />
  {/if}
</main>

<footer class="mt-20 border-t border-border py-8 text-center text-xs text-faint">
  VisualDon · HEIG-VD / COMEM · Examen : 2 h sur papier, formulaire A4 r/v autorisé
</footer>
