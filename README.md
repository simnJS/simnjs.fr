# Portfolio — simnJS

Portfolio Neo-Brutalism construit avec TanStack Start, React 19 et Tailwind v4.

Site live : [simnjs.fr](https://simnjs.fr)

## Stack

- **TanStack Start** (file-based routing + server functions)
- **React 19** + **TypeScript**
- **Tailwind CSS v4**
- **GSAP** + ScrollTrigger pour les animations
- **lucide-react** pour les icônes
- i18n maison (FR / EN / ES)

## Sections

- `Hero` — intro animée
- `Work` — 4 projets (Safia Creative, Play & Chill, StakePlayerCount, UEFN Store)
- `Stack` — technos
- `Now` — feed live de l'activité GitHub (events + heatmap + stats annuelles)
  et le morceau en cours d'écoute sur Spotify
- `About` / `Contact`

## Développement

```bash
pnpm install
pnpm dev
```

Le site tourne sur `http://localhost:3000`.

### Variables d'environnement

Copie `.env.example` vers `.env` puis renseigne :

```bash
GITHUB_TOKEN=  # optionnel — PAT classic avec scopes `repo` + `read:org`
```

Sans token : 60 req/h et événements publics uniquement. Avec un PAT **classic**
(scopes `repo` + `read:org`) : 5000 req/h et l'activité de **tous** les repos
(privés et orgas comprises) apparaît — anonymisée pour les repos privés
(repo affiché comme `private`, message vidé, pas d'URL réelle).

Un fine-grained token ne convient pas : il est limité à un seul owner (compte
_ou_ orga) et ne remonte pas les événements privés via l'API Events.

Le token est lu uniquement côté serveur (`src/lib/github.ts`).

#### Spotify (optionnel)

Alimente le bloc « en écoute » de la section `Now`. Sans ces variables, le
bloc ne s'affiche pas — le reste de la section fonctionne normalement.

```bash
SPOTIFY_CLIENT_ID=
SPOTIFY_CLIENT_SECRET=
SPOTIFY_REFRESH_TOKEN=
```

Crée une app sur le [dashboard Spotify](https://developer.spotify.com/dashboard)
avec `http://127.0.0.1:8888/callback` en Redirect URI (Spotify refuse
`http://localhost`), renseigne les deux premières valeurs, puis lance **une
seule fois** :

```bash
node scripts/spotify-auth.mjs
```

Le script ouvre le flow OAuth et affiche le refresh token à coller dans `.env`.
L'API est gratuite ; une app en mode développement couvre 25 comptes déclarés
à la main, ce qui suffit pour son propre compte.

Seules des métadonnées sont affichées (titre, artiste, pochette servie par le
CDN Spotify, lien vers le morceau) — aucun fichier audio n'est réhébergé.

### Mise en cache

Les données live passent par un cache CDN (`s-maxage` + `stale-while-revalidate`
posés dans les server functions). Le site tourne sur Vercel, où le process est
éphémère : les caches mémoire ne survivent pas aux cold starts, c'est le edge
qui mutualise les réponses entre visiteurs et borne les appels aux API tierces.

## Build production

```bash
pnpm build
pnpm preview
```

## Tests

```bash
pnpm test
```
