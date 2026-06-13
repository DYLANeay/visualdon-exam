import { mount } from 'svelte'
import './app.css'
import App from './App.svelte'

const app = mount(App, {
  target: document.getElementById('app'),
})

// Enregistre le service worker (PWA installable + hors-ligne). En dev, on le
// laisse de côté pour ne pas mettre en cache des modules en cours d'édition.
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register(import.meta.env.BASE_URL + 'sw.js')
  })
}

export default app
