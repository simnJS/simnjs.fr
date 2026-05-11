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
GITHUB_TOKEN=  # optionnel, mais recommandé pour passer de 60 à 5000 req/h sur l'API GitHub
```

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
