# Synchronisation multi-appareils (Supabase)

La progression (modules, flashcards SM-2, points faibles, examens blancs) vit dans le
`localStorage` du navigateur. Pour la retrouver sur plusieurs appareils, on la
sauvegarde dans **Supabase** (base Postgres + auth gratuites), chaque personne ne voyant
que ses propres données grâce aux règles **RLS**.

Tant que les clés ne sont pas configurées, le site fonctionne normalement en local : la
synchro est simplement masquée.

## 1. Créer le projet Supabase (≈ 5 min)

1. Va sur [supabase.com](https://supabase.com) → **New project** (gratuit).
2. Note le mot de passe de la base (pas nécessaire pour la suite, mais à garder).
3. Une fois le projet prêt, ouvre **Project Settings → API** et récupère :
   - **Project URL** (ex. `https://abcd.supabase.co`)
   - **anon public key** (longue chaîne `eyJ…`)

## 2. Créer la table + les règles de sécurité

Dans **SQL Editor**, colle et exécute :

```sql
-- Une ligne de données par utilisateur.
create table public.sync (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  data       jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

-- Chacun ne lit/écrit QUE sa propre ligne.
alter table public.sync enable row level security;

create policy "lire ses données"  on public.sync
  for select using (auth.uid() = user_id);
create policy "créer ses données" on public.sync
  for insert with check (auth.uid() = user_id);
create policy "modifier ses données" on public.sync
  for update using (auth.uid() = user_id);
```

## 3. Activer la connexion par e-mail (lien magique)

- **Authentication → Providers → Email** : activé par défaut (lien magique inclus).
- **Authentication → URL Configuration** : ajoute l'URL du site déployé dans
  **Redirect URLs**, par ex. `https://<utilisateur>.github.io/visualdon-exam/`
  (et `http://localhost:5173/visualdon-exam/` pour le dev).

## 4. Brancher les clés

### En local

Crée `site/.env` (déjà ignoré par git) à partir de `.env.example` :

```
VITE_SUPABASE_URL=https://abcd.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ…
```

### En production (GitHub Pages)

Dépôt → **Settings → Secrets and variables → Actions → Variables** → **New repository
variable**, deux fois :

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

Le workflow de déploiement les injecte au build. (Ce sont des valeurs **publiques** par
conception — la clé `anon` est protégée par RLS — donc des *variables*, pas des *secrets*.)

## 5. Utilisation

- Une icône ☁️ apparaît dans l'en-tête → page **Compte & synchronisation**.
- Saisis ton e-mail → tu reçois un **lien magique** → clic → connecté.
- À partir de là, la progression se synchronise automatiquement (push 2 s après chaque
  changement, et re-tirage au retour sur l'onglet). Connecte-toi avec le **même e-mail**
  sur un autre appareil pour tout retrouver — les données sont **fusionnées** sans perte
  (meilleur score conservé, carte la plus avancée conservée, examens cumulés).
