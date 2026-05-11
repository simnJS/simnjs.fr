import { HeadContent, Scripts, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'

import appCss from '../styles.css?url'
import { I18nProvider } from '../i18n/I18nProvider'

const SITE_URL = 'https://simnjs.fr'
const SITE_TITLE = 'simnJS — UGC Creator & Studio Founder · Lyon'
const SITE_DESC =
  'Software engineer à Lyon. Founder de Safia Creative (UEFN, 3M+ plays sur Fortnite) et Play & Chill (slots & casino pour Stake Engine). UGC, tooling, bots.'
const OG_IMAGE = `${SITE_URL}/og.png`

const PERSON_JSONLD = JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Simon GAY',
  alternateName: 'simnJS',
  url: SITE_URL,
  email: 'mailto:contact@simnjs.fr',
  image: `${SITE_URL}/logo512.png`,
  jobTitle: 'UGC Creator & Studio Founder',
  worksFor: [
    {
      '@type': 'Organization',
      name: 'Safia Creative',
      url: 'https://www.safia-creative.com/',
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
    'https://www.safia-creative.com/',
    'https://playandchill.bet/',
    'https://stakeplayercount.com/',
    'https://www.uefnstore.com/',
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
})

export const Route = createRootRoute({
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
          'UEFN, Fortnite Creative, Roblox, Stake Engine, UGC creator, slot games, Verse, Luau, s&box, Discord bot, Lyon, freelance, simnJS, Safia Creative, Play & Chill',
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
      { rel: 'canonical', href: SITE_URL },
      { rel: 'icon', href: '/favicon.ico', sizes: 'any' },
      { rel: 'apple-touch-icon', href: '/logo192.png' },
      { rel: 'manifest', href: '/manifest.json' },
      { rel: 'alternate', hrefLang: 'fr', href: SITE_URL },
      { rel: 'alternate', hrefLang: 'en', href: SITE_URL },
      { rel: 'alternate', hrefLang: 'es', href: SITE_URL },
      { rel: 'alternate', hrefLang: 'x-default', href: SITE_URL },
      {
        rel: 'preconnect',
        href: 'https://fonts.googleapis.com',
      },
      {
        rel: 'preconnect',
        href: 'https://fonts.gstatic.com',
        crossOrigin: 'anonymous',
      },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Archivo+Black&family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;700&display=swap',
      },
    ],
  }),
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
        <script
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: PERSON_JSONLD }}
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
