<script>
  import { syncConfigure } from '../sync/supabase.js'
  import {
    utilisateur,
    statutSync,
    derniereSync,
    connecter,
    deconnecter,
    synchroniser,
  } from '../sync/sync.js'

  let email = $state('')
  let envoye = $state(false)
  let erreur = $state('')
  let envoiEnCours = $state(false)

  const libelleStatut = $derived(
    {
      inactif: 'Synchro non configurée',
      deconnecte: 'Non connecté',
      synchro: 'Synchronisation…',
      ok: 'À jour',
      erreur: 'Erreur de synchro',
    }[$statutSync] ?? '',
  )

  async function envoyer(e) {
    e.preventDefault()
    erreur = ''
    envoiEnCours = true
    const { error } = await connecter(email.trim())
    envoiEnCours = false
    if (error) erreur = error.message
    else envoye = true
  }

  function heure(ts) {
    return ts ? new Date(ts).toLocaleTimeString('fr-CH', { hour: '2-digit', minute: '2-digit' }) : ''
  }
</script>

<section class="mx-auto max-w-xl py-12">
  <a href="#/" class="text-sm text-faint hover:text-fg-strong">← Accueil</a>
  <h1 class="mt-4 text-2xl font-semibold text-fg-strong">Compte &amp; synchronisation</h1>

  {#if !syncConfigure}
    <div class="mt-6 rounded-lg border border-dashed border-border p-6 text-sm text-muted">
      <p class="font-medium text-fg-strong">La synchronisation n’est pas encore activée.</p>
      <p class="mt-2">
        Tes données restent enregistrées <strong>sur cet appareil</strong> (localStorage).
        Pour synchroniser entre plusieurs appareils, il faut configurer le projet Supabase
        (voir <code>site/SYNC.md</code>).
      </p>
    </div>
  {:else if $utilisateur}
    <p class="mt-2 text-muted">
      Connecté en tant que <strong class="text-fg-strong">{$utilisateur.email}</strong>.
      Ta progression, tes flashcards et tes examens se synchronisent automatiquement.
    </p>

    <div class="mt-6 flex items-center gap-3 rounded-lg border border-border p-4 text-sm">
      <span
        class="size-2.5 rounded-full {$statutSync === 'ok'
          ? 'bg-green-500'
          : $statutSync === 'erreur'
            ? 'bg-red-500'
            : 'bg-amber-500'}"
      ></span>
      <span class="text-fg">{libelleStatut}</span>
      {#if $derniereSync}<span class="text-faint">· dernière synchro à {heure($derniereSync)}</span>{/if}
    </div>

    <div class="mt-6 flex gap-3">
      <button
        onclick={synchroniser}
        class="rounded-md bg-accentfg px-4 py-2 text-sm font-medium text-white hover:opacity-90"
      >
        Synchroniser maintenant
      </button>
      <button
        onclick={deconnecter}
        class="rounded-md border border-border px-4 py-2 text-sm font-medium text-muted hover:border-red-500 hover:text-red-500"
      >
        Se déconnecter
      </button>
    </div>
  {:else if envoye}
    <div class="mt-6 rounded-lg border border-accentborder bg-accentsurface p-6 text-sm">
      <p class="text-2xl">📧</p>
      <p class="mt-2 font-medium text-fg-strong">Lien envoyé à {email} !</p>
      <p class="mt-1 text-muted">
        Ouvre ta boîte mail et clique sur le lien pour te connecter. Tu peux faire ça depuis
        n’importe quel appareil — tes données s’y synchroniseront.
      </p>
    </div>
  {:else}
    <p class="mt-2 text-muted">
      Connecte-toi avec ton e-mail (sans mot de passe) pour retrouver ta progression sur tous
      tes appareils. On t’envoie un <strong class="text-fg">lien magique</strong>.
    </p>

    <form onsubmit={envoyer} class="mt-6 flex flex-col gap-3 sm:flex-row">
      <input
        type="email"
        bind:value={email}
        required
        placeholder="ton.email@exemple.com"
        class="flex-1 rounded-md border border-border bg-bg px-3 py-2 text-sm text-fg placeholder:text-faint focus:border-accentfg focus:outline-none"
      />
      <button
        type="submit"
        disabled={envoiEnCours}
        class="rounded-md bg-accentfg px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50"
      >
        {envoiEnCours ? 'Envoi…' : 'Recevoir le lien'}
      </button>
    </form>
    {#if erreur}<p class="mt-3 text-sm text-red-500">{erreur}</p>{/if}
  {/if}
</section>
