<script>
  let { titre, description } = $props()
</script>

<section class="mx-auto max-w-4xl py-12">
  <h1 class="text-2xl font-semibold text-fg-strong">{titre}</h1>
  <p class="mt-2 text-muted">{description}</p>
  <p class="mt-8 rounded-lg border border-dashed border-border p-8 text-center text-sm text-faint">
    En construction — bientôt disponible.
  </p>
</section>
