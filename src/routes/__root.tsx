import { type ReactNode } from 'react'
import { HeadContent, Scripts, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'

import appCss from '../styles.css?url'
import { I18nProvider } from '../i18n/I18nProvider'

const SITE_URL = 'https://simnjs.fr'
const SITE_TITLE = 'simnJS (Simon GAY) — UGC Creator & Studio Founder · Lyon'
const SITE_DESC =
  'Portfolio de Simon GAY, alias simnJS — software engineer à Lyon. Founder de Safia Creative (UEFN, 3M+ plays sur Fortnite) et Play & Chill (slots & casino pour Stake Engine).'
const OG_IMAGE = `${SITE_URL}/og.png`

const JSONLD = JSON.stringify({
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Person',
      '@id': `${SITE_URL}/#person`,
      name: 'Simon GAY',
      givenName: 'Simon',
      familyName: 'GAY',
      alternateName: 'simnJS',
      url: SITE_URL,
      mainEntityOfPage: `${SITE_URL}/`,
      email: 'mailto:contact@simnjs.fr',
      image: `${SITE_URL}/logo512.png`,
      jobTitle: 'UGC Creator & Studio Founder',
      worksFor: [
        {
          '@type': 'Organization',
          name: 'Safia Creative',
          url: 'https://fortnite.gg/creator/safia',
        },
        {
          '@type': 'Organization',
          name: 'Play & Chill',
          url: 'https://playandchill.bet/',
        },
      ],
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Lyon',
        addressCountry: 'FR',
      },
      sameAs: [
        'https://github.com/simnJS',
        'https://www.linkedin.com/in/simon-gay-806103388/',
        'https://fortnite.gg/creator/safia',
        'https://playandchill.bet/',
        'https://stakeplayercount.com/',
        'https://www.uefnstore.com/',
        'https://www.roblox.com/communities/35788348/Playn-Chill',
      ],
      knowsAbout: [
        'UEFN',
        'Fortnite Creative',
        'Verse',
        'Roblox',
        'Luau',
        'Stake Engine',
        's&box',
        'TypeScript',
        'Node.js',
        'Rust',
      ],
    },
    {
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      url: SITE_URL,
      name: 'simnJS',
      alternateName: 'Portfolio de Simon GAY',
      inLanguage: ['fr', 'en', 'es'],
      publisher: { '@id': `${SITE_URL}/#person` },
    },
  ],
})

function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <p className="font-mono text-sm uppercase tracking-widest text-ink/60">
        // 404
      </p>
      <h1 className="mt-4 font-display leading-none tracking-tighter text-[clamp(5rem,22vw,14rem)]">
        <span>4</span>
        <span className="text-coral">0</span>
        <span>4</span>
      </h1>
      <p className="mt-6 max-w-sm font-mono text-sm text-ink/70">
        Cette page n&apos;existe pas (ou pas encore).
      </p>
      <a
        href="/"
        className="mt-10 inline-flex items-center gap-2 border-2 border-ink bg-yellow px-6 py-3 font-display shadow-[6px_6px_0_0_var(--color-ink)] transition-all hover:translate-x-1.5 hover:translate-y-1.5 hover:shadow-none"
      >
        ← Retour à l&apos;accueil
      </a>
    </main>
  )
}

export const Route = createRootRoute({
  notFoundComponent: NotFound,
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: SITE_TITLE },
      { name: 'description', content: SITE_DESC },
      { name: 'author', content: 'Simon GAY' },
      {
        name: 'keywords',
        content:
          'simnJS, Simon GAY, UEFN, Fortnite Creative, Roblox, Stake Engine, UGC creator, slot games, Verse, Luau, s&box, Discord bot, Lyon, freelance, Safia Creative, Play & Chill',
      },
      { name: 'theme-color', content: '#0A0A0A' },
      { name: 'color-scheme', content: 'light' },
      { name: 'robots', content: 'index, follow, max-image-preview:large' },

      // Open Graph
      { property: 'og:type', content: 'website' },
      { property: 'og:url', content: SITE_URL },
      { property: 'og:site_name', content: 'simnJS' },
      { property: 'og:title', content: SITE_TITLE },
      { property: 'og:description', content: SITE_DESC },
      { property: 'og:image', content: OG_IMAGE },
      { property: 'og:image:width', content: '1200' },
      { property: 'og:image:height', content: '630' },
      { property: 'og:image:alt', content: 'simnJS — portfolio Neo-Brutalism' },
      { property: 'og:locale', content: 'fr_FR' },
      { property: 'og:locale:alternate', content: 'en_US' },
      { property: 'og:locale:alternate', content: 'es_ES' },

      // Twitter Card
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: SITE_TITLE },
      { name: 'twitter:description', content: SITE_DESC },
      { name: 'twitter:image', content: OG_IMAGE },
      { name: 'twitter:image:alt', content: 'simnJS portfolio' },
    ],
    links: [
      { rel: 'stylesheet', href: appCss },
      // Le canonical est posé par chaque route (index, work/$slug).
      { rel: 'icon', href: '/favicon.ico', sizes: '48x48 32x32 16x16' },
      { rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' },
      { rel: 'apple-touch-icon', href: '/logo192.png' },
      { rel: 'manifest', href: '/manifest.json' },
      { rel: 'alternate', hrefLang: 'fr', href: SITE_URL },
      { rel: 'alternate', hrefLang: 'en', href: SITE_URL },
      { rel: 'alternate', hrefLang: 'es', href: SITE_URL },
      { rel: 'alternate', hrefLang: 'x-default', href: SITE_URL },
      { rel: 'me', href: 'https://github.com/simnJS' },
      { rel: 'me', href: 'https://www.linkedin.com/in/simon-gay-806103388/' },
      {
        rel: 'preload',
        href: '/fonts/archivo-black.woff2',
        as: 'font',
        type: 'font/woff2',
        crossOrigin: 'anonymous',
      },
      {
        rel: 'preload',
        href: '/fonts/space-grotesk.woff2',
        as: 'font',
        type: 'font/woff2',
        crossOrigin: 'anonymous',
      },
    ],
  }),
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: ReactNode }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <HeadContent />
        <script
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: JSONLD }}
        />
      </head>
      <body suppressHydrationWarning>
        <I18nProvider>{children}</I18nProvider>
        <TanStackDevtools
          config={{
            position: 'bottom-right',
          }}
          plugins={[
            {
              name: 'Tanstack Router',
              render: <TanStackRouterDevtoolsPanel />,
            },
          ]}
        />
        <Scripts />
      </body>
    </html>
  )
}
