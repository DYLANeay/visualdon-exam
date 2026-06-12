import { readable } from 'svelte/store'

// Routing par hash (#/modules, #/examen…) : aucune config serveur requise,
// compatible GitHub Pages.
function currentPath() {
  return window.location.hash.replace(/^#/, '') || '/'
}

export const route = readable(currentPath(), (set) => {
  const update = () => set(currentPath())
  window.addEventListener('hashchange', update)
  return () => window.removeEventListener('hashchange', update)
})

export function navigate(path) {
  window.location.hash = path
}
