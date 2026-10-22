// ─── Édite ici pour mettre à jour le site ───────────────────────────────────
// Les textes traduits (descriptions, messages du terminal) sont dans
// src/i18n/term.ts, indexés par les `slug` ci-dessous.

export const ME = {
  handle: 'simnJS',
  fullName: 'Simon GAY',
  host: 'lyon',
  email: 'pro@simnjs.fr',
  site: 'simnjs.fr',
  github: 'https://github.com/simnJS',
  linkedin: 'https://www.linkedin.com/in/simon-gay-806103388/',
  discord: 'simnjs_',
  // Création du compte GitHub : point de départ de l'« uptime » du fastfetch.
  since: '2021-06-28T09:00:25Z',
  timeZone: 'Europe/Paris',
}

export type ProjectTag = 'stake' | 'roblox' | 'uefn' | 'saas' | 'oss'

export const PROJECT_TAGS: ProjectTag[] = ['stake', 'roblox', 'uefn', 'saas', 'oss']

export type Project = {
  // Nom du fichier dans ~/projects (et clé des traductions).
  slug: string
  title: string
  year: number
  href: string
  image?: string
  repo?: string
  // Slug de l'étude de cas (src/content/caseStudies.ts), si elle existe.
  caseStudy?: string
  tags: ProjectTag[]
  stack: string[]
}

export const PROJECTS: Project[] = [
  {
    slug: 'play-and-chill',
    title: 'Play & Chill',
    year: 2025,
    href: 'https://playandchill.bet/',
    image: '/projects/playandchill.png',
    caseStudy: 'play-and-chill',
    tags: ['stake'],
    stack: ['Stake Engine', 'TypeScript', 'React', 'Pixi.js'],
  },
  {
    slug: 'playn-chill',
    title: "Play'n Chill",
    year: 2026,
    href: 'https://www.roblox.com/communities/35788348/Playn-Chill',
    image: '/projects/playnchill-roblox.png',
    caseStudy: 'playn-chill',
    tags: ['roblox'],
    stack: ['Roblox', 'roblox-ts', 'Luau'],
  },
  {
    slug: 'engine-players',
    title: 'Engine Players',
    year: 2025,
    href: 'https://engineplayers.com/',
    image: '/projects/stakeplayer.jpg',
    caseStudy: 'stakeplayercount',
    tags: ['stake', 'saas'],
    stack: ['TypeScript', 'Node.js', 'Stake Engine'],
  },
  {
    slug: 'simnjs-store',
    title: 'simnJS Store',
    year: 2026,
    href: 'https://store.simnjs.fr/',
    tags: ['uefn', 'saas'],
    stack: ['TanStack Start', 'Convex', 'Stripe', 'Verse'],
  },
  {
    slug: 'tacline',
    title: 'Tacline',
    year: 2026,
    href: 'https://tacline.co/fr',
    image: '/projects/tacline.png',
    caseStudy: 'tacline',
    tags: ['saas'],
    stack: ['TypeScript', 'React', 'Stripe'],
  },
  {
    slug: 'stake-dev-tool',
    title: 'Stake Dev Tool',
    year: 2025,
    href: 'https://stakedevtool.com/',
    repo: 'Stake-Dev-Tool/stake-dev-tool',
    tags: ['stake', 'oss'],
    stack: ['Rust', 'Svelte', 'Tauri'],
  },
  {
    slug: 'hangar-ai',
    title: 'Hangar.AI',
    year: 2026,
    href: 'https://github.com/simnJS/hangar-ai',
    repo: 'simnJS/hangar-ai',
    tags: ['oss'],
    stack: ['Tauri', 'React', 'Rust', 'MCP'],
  },
  {
    slug: 'prism-verse',
    title: 'prism-verse',
    year: 2026,
    href: 'https://github.com/simnJS/prism-verse',
    repo: 'simnJS/prism-verse',
    tags: ['uefn', 'oss'],
    stack: ['TypeScript', 'Verse'],
  },
  {
    slug: 'verse-on-github',
    title: 'Verse on GitHub',
    year: 2026,
    href: 'https://github.com/github-linguist/linguist/pull/7440',
    repo: 'simnJS/highlightjs-verse',
    tags: ['uefn', 'oss'],
    stack: ['TextMate', 'highlight.js'],
  },
]

// Rendu en ~/stack.toml : une table par domaine, une clé par usage.
export const STACK: Array<{ table: string; entries: Array<[string, string[]]> }> = [
  {
    table: 'games',
    entries: [
      ['engines', ['UEFN', 'Roblox', 'Stake Engine', 's&box']],
      ['languages', ['Verse', 'Luau', 'roblox-ts']],
    ],
  },
  {
    table: 'web',
    entries: [
      ['front', ['TypeScript', 'React', 'TanStack Start', 'Svelte', 'Tailwind']],
      ['back', ['Node.js', 'Convex', 'Stripe', 'Vercel']],
    ],
  },
  {
    table: 'systems',
    entries: [
      ['languages', ['Rust', 'Python']],
      ['desktop', ['Tauri']],
      ['bots', ['discord.js']],
    ],
  },
  {
    table: 'ai',
    entries: [
      ['agents', ['Claude Code', 'MCP']],
      ['video', ['Remotion']],
    ],
  },
]

// Les 8 couleurs normales du schéma, affichées par le module « colors ».
export const PALETTE = [
  '#1c1c24',
  '#f07a8c',
  '#9fd8a4',
  '#f2d38a',
  '#8fb4f5',
  '#c9a3f5',
  '#8fd8e0',
  '#c8c8d4',
]
