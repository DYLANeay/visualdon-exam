import { writable } from 'svelte/store'

const PREFIX = 'visualdon:'

// Store Svelte synchronisé avec localStorage.
export function persisted(key, initial) {
  const storageKey = PREFIX + key
  let value = initial
  try {
    const raw = localStorage.getItem(storageKey)
    if (raw !== null) value = JSON.parse(raw)
  } catch {
    // valeur corrompue : on repart de l'état initial
  }

  const store = writable(value)
  store.subscribe((v) => {
    localStorage.setItem(storageKey, JSON.stringify(v))
  })
  return store
}
