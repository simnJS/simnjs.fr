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
- `Now` — feed live de l'activité GitHub publique (events + heatmap + stats annuelles)
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

## Build production

```bash
pnpm build
pnpm preview
```

## Tests

```bash
pnpm test
```
