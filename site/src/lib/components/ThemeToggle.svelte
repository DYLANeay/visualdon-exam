<script>
  import { theme, basculerTheme } from '../stores/theme.js'

  const libelle = { light: 'Clair', dark: 'Sombre', system: 'Système' }
</script>

<button
  onclick={basculerTheme}
  title={`Thème : ${libelle[$theme]} (cliquer pour changer)`}
  aria-label="Changer de thème"
  class="grid size-8 place-items-center rounded-md text-muted transition-colors hover:bg-surface hover:text-fg-strong"
>
  {#if $theme === 'light'}
    <!-- soleil -->
    <svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5L19 19M19 5l-1.5 1.5M6.5 17.5L5 19" />
    </svg>
  {:else if $theme === 'dark'}
    <!-- lune -->
    <svg class="size-4" viewBox="0 0 24 24" fill="currentColor">
      <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
    </svg>
  {:else}
    <!-- écran (système) -->
    <svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <rect x="3" y="4" width="18" height="12" rx="1.5" />
      <path d="M8 20h8M12 16v4" />
    </svg>
  {/if}
</button>
