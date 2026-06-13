import { createClient } from '@supabase/supabase-js'

// Clés publiques Supabase, injectées au build (cf. .env / variables GitHub Actions).
// La clé « anon » est conçue pour être publique : ce sont les règles RLS côté
// Supabase qui protègent les données (chaque personne ne voit que sa ligne).
const url = import.meta.env.VITE_SUPABASE_URL
const cle = import.meta.env.VITE_SUPABASE_ANON_KEY

// Tant que le projet n'est pas configuré, la synchro reste désactivée et le site
// fonctionne normalement en local (localStorage seul).
export const syncConfigure = Boolean(url && cle)

export const supabase = syncConfigure
  ? createClient(url, cle, {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
    })
  : null
