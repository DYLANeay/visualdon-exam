import { writable } from 'svelte/store'

const KEY = 'visualdon:theme' // 'light' | 'dark' | 'system'

function lirePref() {
  try {
    return localStorage.getItem(KEY) ?? 'system'
  } catch {
    return 'system'
  }
}

function systemeSombre() {
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

// Applique (ou non) la classe .dark sur <html> selon la préférence.
function appliquer(pref) {
  const sombre = pref === 'dark' || (pref === 'system' && systemeSombre())
  document.documentElement.classList.toggle('dark', sombre)
}

export const theme = writable(lirePref())

theme.subscribe((pref) => {
  try {
    localStorage.setItem(KEY, pref)
  } catch {
    // stockage indisponible : on applique quand même
  }
  appliquer(pref)
})

// Suit le système en temps réel quand la préférence est 'system'.
window
  .matchMedia('(prefers-color-scheme: dark)')
  .addEventListener('change', () => {
    if (lirePref() === 'system') appliquer('system')
  })

// Cycle clair → sombre → système → clair…
export function basculerTheme() {
  theme.update((p) =>
    p === 'light' ? 'dark' : p === 'dark' ? 'system' : 'light',
  )
}
