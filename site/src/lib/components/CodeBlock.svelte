<script>
  // Affichage d'un extrait de code. La version éditable (playground CodeMirror +
  // iframe) arrivera à l'étape 4 ; pour l'instant on rend un bloc lisible et marqué.
  let { code } = $props()
</script>

<figure class="my-4 overflow-hidden rounded-lg border border-border">
  <figcaption
    class="flex items-center justify-between border-b border-border bg-surface px-3 py-1.5 text-xs text-faint"
  >
    <span class="font-mono uppercase">{code.langage ?? 'js'}</span>
    {#if code.editable}
      <span class="text-accentfg">éditable bientôt</span>
    {/if}
  </figcaption>
  <pre class="overflow-x-auto p-3 text-sm leading-relaxed"><code class="font-mono"
      >{code.source}</code
    ></pre>
</figure>
