<script>
  import { marked } from 'marked'

  let { source = '', inline = false } = $props()

  const html = $derived(
    inline ? marked.parseInline(source ?? '') : marked.parse(source ?? ''),
  )
</script>

<!-- Contenu de confiance (rédigé par nous), rendu en HTML. -->
<div class="prose-vd" class:prose-vd--inline={inline}>{@html html}</div>
