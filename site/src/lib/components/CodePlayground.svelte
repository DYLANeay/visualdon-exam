<script>
  import { onMount, onDestroy } from 'svelte'
  import { EditorView, basicSetup } from 'codemirror'
  import { javascript } from '@codemirror/lang-javascript'
  import { oneDark } from '@codemirror/theme-one-dark'
  import { EditorState } from '@codemirror/state'
  import { theme } from '../stores/theme.js'
  import { construireSandbox, chargerD3 } from '../playground/sandbox.js'

  let { code } = $props()

  const sourceInitiale = code.source
  let source = $state(code.source)
  let editeur // élément hôte CodeMirror
  let vue // EditorView
  let iframeSrc = $state('')
  let d3Source = '' // code de D3, chargé une fois

  let sombre = $state(false)
  const unsub = theme.subscribe(() => {
    sombre = document.documentElement.classList.contains('dark')
  })

  async function executer() {
    if (!d3Source) {
      try {
        d3Source = await chargerD3()
      } catch (e) {
        iframeSrc = `<p style="font:13px monospace;color:#ef4444;padding:12px">Impossible de charger D3 (${e.message}). Recharge la page (Ctrl+Shift+R).</p>`
        return
      }
    }
    iframeSrc = construireSandbox(source, sombre, d3Source)
  }

  function reinitialiser() {
    source = sourceInitiale
    if (vue) {
      vue.dispatch({
        changes: { from: 0, to: vue.state.doc.length, insert: sourceInitiale },
      })
    }
    executer()
  }

  onMount(() => {
    vue = new EditorView({
      doc: source,
      extensions: [
        basicSetup,
        javascript(),
        sombre ? oneDark : [],
        EditorView.updateListener.of((v) => {
          if (v.docChanged) source = v.state.doc.toString()
        }),
        EditorView.theme({
          '&': { fontSize: '13px', borderRadius: '0 0 8px 8px' },
          '.cm-scroller': { fontFamily: 'var(--font-mono)' },
        }),
      ],
      parent: editeur,
    })
    executer() // premier rendu
  })

  onDestroy(() => {
    unsub()
    vue?.destroy()
  })
</script>

<div class="my-4 overflow-hidden rounded-lg border border-border">
  <div
    class="flex items-center justify-between border-b border-border bg-surface px-3 py-1.5 text-xs"
  >
    <span class="font-mono text-faint uppercase">{code.langage ?? 'js'} · éditable</span>
    <div class="flex gap-2">
      <button
        onclick={reinitialiser}
        class="rounded px-2 py-0.5 text-muted transition-colors hover:text-fg-strong"
      >
        Réinitialiser
      </button>
      <button
        onclick={executer}
        class="rounded bg-accentfg px-2.5 py-0.5 font-medium text-white transition-opacity hover:opacity-90"
      >
        Exécuter ▸
      </button>
    </div>
  </div>

  <div class="grid md:grid-cols-2">
    <div bind:this={editeur} class="min-h-40 border-border max-md:border-b md:border-r"></div>
    <iframe
      title="Aperçu du code"
      sandbox="allow-scripts"
      srcdoc={iframeSrc}
      class="min-h-40 w-full bg-surface"
    ></iframe>
  </div>
</div>
