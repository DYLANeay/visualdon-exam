<script>
  // Affichage d'un extrait de code. La version éditable (playground CodeMirror +
  // iframe) arrivera à l'étape 4 ; pour l'instant on rend un bloc lisible et marqué.
  let { code } = $props()
</script>

<figure class="my-4 overflow-hidden rounded-lg border border-neutral-200">
  <figcaption
    class="flex items-center justify-between border-b border-neutral-100 bg-neutral-50 px-3 py-1.5 text-xs text-neutral-400"
  >
    <span class="font-mono uppercase">{code.langage ?? 'js'}</span>
    {#if code.editable}
      <span class="text-accent-600">éditable bientôt</span>
    {/if}
  </figcaption>
  <pre class="overflow-x-auto p-3 text-sm leading-relaxed"><code class="font-mono"
      >{code.source}</code
    ></pre>
</figure>
