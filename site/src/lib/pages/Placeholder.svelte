<script>
  let { titre, description } = $props()
</script>

<section class="mx-auto max-w-3xl py-12">
  <h1 class="text-2xl font-semibold text-neutral-900">{titre}</h1>
  <p class="mt-2 text-neutral-500">{description}</p>
  <p class="mt-8 rounded-lg border border-dashed border-neutral-300 p-8 text-center text-sm text-neutral-400">
    En construction — bientôt disponible.
  </p>
</section>
