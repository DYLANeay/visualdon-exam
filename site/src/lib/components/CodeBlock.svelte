<script>
  // Bloc de code : statique par défaut, playground interactif si `editable`.
  import CodePlayground from './CodePlayground.svelte'
  let { code } = $props()
</script>

{#if code.editable}
  <CodePlayground {code} />
{:else}
  <figure class="my-4 overflow-hidden rounded-lg border border-border">
    <figcaption
      class="flex items-center justify-between border-b border-border bg-surface px-3 py-1.5 text-xs text-faint"
    >
      <span class="font-mono uppercase">{code.langage ?? 'js'}</span>
    </figcaption>
    <pre class="overflow-x-auto p-3 text-sm leading-relaxed"><code class="font-mono"
        >{code.source}</code
      ></pre>
  </figure>
{/if}
