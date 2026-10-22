import { type ReactNode } from 'react'
import { HeadContent, Scripts, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'

import appCss from '../styles.css?url'
import { I18nProvider } from '../i18n/I18nProvider'
import { NotFoundPage } from '../components/term/NotFound'

const SITE_URL = 'https://simnjs.fr'
const SITE_TITLE = 'simnJS (Simon GAY), software engineer in Lyon'
const SITE_DESC =
  "Portfolio de Simon GAY, alias simnJS, software engineer à Lyon. Il dirige Play'n Chill (slots pour Stake Engine, jeux Roblox) et construit des outils Verse pour les créateurs Fortnite."
// ?v= force Discord, Twitter et LinkedIn à recharger l'aperçu après un changement d'image.
const OG_IMAGE = `${SITE_URL}/og.png?v=2`
const OG_ALT = 'simnJS : Simon GAY, software engineer à Lyon, avec le boykisser en points'

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
      email: 'mailto:pro@simnjs.fr',
      image: `${SITE_URL}/logo512.png`,
      jobTitle: 'Software engineer, studio founder',
      worksFor: [
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
        'https://playandchill.bet/',
        'https://engineplayers.com/',
        'https://store.simnjs.fr/',
        'https://stakedevtool.com/',
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
  return <NotFoundPage />
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
          "simnJS, Simon GAY, UEFN, Fortnite Creative, Roblox, Stake Engine, slot games, Verse, Luau, s&box, Rust, TypeScript, Lyon, freelance, Play'n Chill",
      },
      // Aussi la couleur de la barre des aperçus Discord.
      { name: 'theme-color', content: '#f5a3c7' },
      { name: 'color-scheme', content: 'dark' },
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
      { property: 'og:image:alt', content: OG_ALT },
      { property: 'og:locale', content: 'fr_FR' },
      { property: 'og:locale:alternate', content: 'en_US' },
      { property: 'og:locale:alternate', content: 'es_ES' },

      // Twitter Card
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: SITE_TITLE },
      { name: 'twitter:description', content: SITE_DESC },
      { name: 'twitter:image', content: OG_IMAGE },
      { name: 'twitter:image:alt', content: OG_ALT },
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
        href: '/fonts/jetbrains-mono.woff2',
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
