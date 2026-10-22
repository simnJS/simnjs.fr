import { useEffect, useState } from 'react'
import { createFileRoute, notFound, useNavigate } from '@tanstack/react-router'
import { CASE_STUDIES } from '../content/caseStudies'
import { ME } from '../content/site'
import { getRobloxStats, type RbxStats } from '../lib/roblox'
import { useI18n } from '../i18n/I18nProvider'
import type { Dictionary } from '../i18n/translations'
import { Window } from '../components/term/Window'
import { PromptHeader, PromptLine } from '../components/term/Prompt'
import { ExtLink } from '../components/term/bits'

const SITE_URL = 'https://simnjs.fr'

export const Route = createFileRoute('/work/$slug')({
  loader: ({ params }) => {
    if (!CASE_STUDIES[params.slug]) throw notFound()
  },
  head: ({ params }) => {
    const cs = CASE_STUDIES[params.slug]
    if (!cs) return {}
    // Le SSR rend la locale par défaut (fr) : les meta suivent.
    const c = cs.content.fr
    const url = `${SITE_URL}/work/${cs.slug}`
    const og = `${SITE_URL}${cs.ogImage}`
    return {
      meta: [
        { title: c.metaTitle },
        { name: 'description', content: c.metaDescription },
        { property: 'og:type', content: 'article' },
        { property: 'og:url', content: url },
        { property: 'og:title', content: c.metaTitle },
        { property: 'og:description', content: c.metaDescription },
        { property: 'og:image', content: og },
        { property: 'og:image:alt', content: cs.title },
        { name: 'twitter:title', content: c.metaTitle },
        { name: 'twitter:description', content: c.metaDescription },
        { name: 'twitter:image', content: og },
        { name: 'twitter:image:alt', content: cs.title },
      ],
      links: [{ rel: 'canonical', href: url }],
    }
  },
  component: CaseStudyPage,
})

// L'étude de cas s'ouvre comme un fichier dans `less` : front matter,
// Markdown à l'écran, (END) en bas, et q pour revenir au terminal.
function CaseStudyPage() {
  const { slug } = Route.useParams()
  const { t, locale } = useI18n()
  const navigate = useNavigate()
  const cs = CASE_STUDIES[slug]
  const c = cs.content[locale] ?? cs.content.fr
  const url = `${SITE_URL}/work/${cs.slug}`
  const stats = useRobloxStats(cs.live === 'roblox')

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = document.activeElement
      if (e.key !== 'q' || e.ctrlKey || e.metaKey || e.altKey) return
      if (el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA')) return
      navigate({ to: '/', hash: 'projects' })
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [navigate])

  const jsonld = JSON.stringify({
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CreativeWork',
        '@id': `${url}#work`,
        name: cs.title,
        url,
        description: cs.content.fr.metaDescription,
        image: `${SITE_URL}${cs.ogImage}`,
        author: { '@id': `${SITE_URL}/#person` },
        keywords: cs.stack.join(', '),
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'simnJS', item: `${SITE_URL}/` },
          { '@type': 'ListItem', position: 2, name: cs.title, item: url },
        ],
      },
    ],
  })

  const front: Array<[string, string]> = [
    ['title', cs.title],
    ['year', cs.year],
    ['tag', c.tag],
    ['live', cs.liveUrl.replace(/^https?:\/\//, '').replace(/\/$/, '')],
  ]

  return (
    <Window tabs={false} title={`${cs.slug}.md`}>
      <main>
        <script
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: jsonld }}
        />
        <PromptHeader path="~\simnJS\projects" />
        <PromptLine>
          <span className="text-yellow">less</span> {cs.slug}.md
        </PromptLine>

        <article className="mt-6 max-w-[80ch]">
          <div className="text-muted">
            <div className="term-line">---</div>
            {front.map(([k, v]) => (
              <div key={k} className="term-line">
                <span className="text-blue">{k}</span>: <span className={k === 'live' ? '' : 'text-green'}>{k === 'live' ? <ExtLink href={cs.liveUrl}>{v}</ExtLink> : v}</span>
              </div>
            ))}
            <div className="term-line">---</div>
          </div>

          <h1 className="mt-8 text-[clamp(1.75rem,5vw,2.75rem)] font-bold leading-tight">
            <span className="text-muted"># </span>
            <span className="text-pink">{cs.title}</span>
          </h1>
          <p className="mt-4 text-base leading-relaxed">{c.intro}</p>

          <div className="mt-8 grid border border-line sm:grid-cols-3">
            {cs.metrics.map((m, i) => (
              <div key={i} className="border-line p-[1.5ch] max-sm:border-b sm:border-r sm:last:border-r-0 max-sm:last:border-b-0">
                <div className="text-xl font-bold text-pink">
                  {m.live && stats ? stats[m.live].toLocaleString() : m.n}
                </div>
                <div className="text-dim">{m.label[locale] ?? m.label.fr}</div>
              </div>
            ))}
          </div>

          {cs.live === 'roblox' && stats && <RobloxLive t={t} stats={stats} />}

          {cs.image && (
            <img
              src={cs.image}
              alt={cs.title}
              className="mt-10 aspect-[16/9] w-full rounded-md border border-line object-cover"
            />
          )}

          {c.sections.map((s) => (
            <section key={s.heading} className="mt-10">
              <h2 className="text-lg font-bold">
                <span className="text-muted">## </span>
                <span className="text-blue">{s.heading}</span>
              </h2>
              {s.body.split('\n\n').map((p, pi) => (
                <p key={pi} className="mt-3 leading-relaxed text-fg/90">
                  {p}
                </p>
              ))}
            </section>
          ))}

          <section className="mt-10">
            <h2 className="text-lg font-bold">
              <span className="text-muted">## </span>
              <span className="text-blue">{t.caseStudy.stack}</span>
            </h2>
            <p className="term-line mt-3">
              stack = [
              {cs.stack.map((s, i) => (
                <span key={s}>
                  {i > 0 && ', '}
                  <span className="text-green">"{s}"</span>
                </span>
              ))}
              ]
            </p>
          </section>

          <p className="mt-12 text-lg font-bold text-pink">{t.caseStudy.cta}</p>
          <div className="mt-4 flex flex-wrap gap-[2ch]">
            <a
              href={cs.liveUrl}
              target="_blank"
              rel="noreferrer"
              className="rounded border border-pink px-[1.5ch] py-1.5 text-pink transition-colors hover:bg-pink hover:text-bg"
            >
              [ {t.caseStudy.visit} ]
            </a>
            <a
              href={`mailto:${ME.email}`}
              className="rounded border border-line px-[1.5ch] py-1.5 transition-colors hover:border-mauve hover:text-mauve"
            >
              [ {t.caseStudy.ctaButton} ]
            </a>
          </div>
        </article>

        <div className="term-line mt-12">
          <span className="bg-fg px-[0.5ch] text-bg">(END)</span>{' '}
          <a href="/#projects" className="text-muted underline decoration-transparent underline-offset-4 hover:decoration-current">
            q {t.caseStudy.back}
          </a>
        </div>
      </main>
    </Window>
  )
}

// ─── Stats Roblox en direct ─────────────────────────────────────────────────

// Récupère les stats du groupe et les rafraîchit toutes les 60 s. Partagé entre
// les métriques (visites cumulées) et le tableau des jeux.
function useRobloxStats(enabled: boolean): RbxStats | null {
  const [stats, setStats] = useState<RbxStats | null>(null)

  useEffect(() => {
    if (!enabled) return
    let mounted = true
    const load = () => {
      getRobloxStats()
        .then((s) => {
          if (mounted && s) setStats(s)
        })
        .catch(() => {
          // silencieux — on garde les dernières données affichées
        })
    }
    load()
    const id = setInterval(load, 60_000)
    return () => {
      mounted = false
      clearInterval(id)
    }
  }, [enabled])

  return stats
}

function RobloxLive({ t, stats }: { t: Dictionary; stats: RbxStats }) {
  const num = (n: number) => n.toLocaleString('en')
  return (
    <div className="mt-6 rounded-md border border-line">
      <div className="flex flex-wrap items-center justify-between gap-x-[3ch] border-b border-line bg-panel px-[1.5ch] leading-8">
        <span className="text-green">● {t.caseStudy.liveTitle}</span>
        <span className="text-dim">
          <span className="text-fg">{num(stats.totalPlaying)}</span> {t.caseStudy.livePlaying}{'   '}
          <span className="text-fg">{num(stats.totalVisits)}</span> {t.caseStudy.liveVisits}{'   '}
          <span className="text-fg">{num(stats.members)}</span> {t.caseStudy.liveMembers}
        </span>
      </div>
      <ul>
        {stats.games.map((g) => (
          <li key={g.url} className="border-b border-line last:border-b-0">
            <a
              href={g.url}
              target="_blank"
              rel="noreferrer"
              className="grid grid-cols-[2ch_1fr_auto] gap-x-[1ch] px-[1.5ch] py-1.5 transition-colors hover:bg-panel sm:grid-cols-[2ch_1fr_12ch_16ch]"
            >
              <span className={g.playing > 0 ? 'text-green' : 'text-muted'}>●</span>
              <span className="truncate text-blue">{g.name}</span>
              <span className="text-right">
                {num(g.playing)} <span className="text-dim">{t.caseStudy.livePlaying}</span>
              </span>
              <span className="hidden text-right text-dim sm:block">
                {num(g.visits)} {t.caseStudy.liveVisits}
              </span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}
