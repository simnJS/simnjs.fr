import { useEffect, useState } from 'react'
import { Link, createFileRoute, notFound } from '@tanstack/react-router'
import {
  ArrowLeft,
  ArrowUpRight,
  Mail,
  Star,
  ThumbsUp,
  Users,
} from 'lucide-react'
import { CASE_STUDIES } from '../content/caseStudies'
import { getRobloxStats, type RbxStats } from '../lib/roblox'
import { useI18n } from '../i18n/I18nProvider'
import { LanguageSelector } from '../i18n/LanguageSelector'
import type { Dictionary } from '../i18n/translations'

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

function CaseStudyPage() {
  const { slug } = Route.useParams()
  const { t, locale } = useI18n()
  const cs = CASE_STUDIES[slug]
  const c = cs.content[locale] ?? cs.content.fr
  const url = `${SITE_URL}/work/${cs.slug}`
  const stats = useRobloxStats(cs.live === 'roblox')

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
          {
            '@type': 'ListItem',
            position: 1,
            name: 'simnJS',
            item: `${SITE_URL}/`,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: cs.title,
            item: url,
          },
        ],
      },
    ],
  })

  const chipColors = ['bg-yellow', 'bg-coral', 'bg-cyan', 'bg-violet']
  const chipRots = ['rotate-1', '-rotate-1', 'rotate-2', '-rotate-2']

  return (
    <main className="min-h-screen">
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: jsonld }}
      />

      {/* Top bar */}
      <header className="border-b-2 border-ink">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link to="/" className="font-display text-xl tracking-tight">
            simnJS<span className="text-coral">.</span>
          </Link>
          <div className="flex items-center gap-3">
            <LanguageSelector />
            <Link
              to="/"
              hash="work"
              className="inline-flex items-center gap-2 border-2 border-ink bg-bg px-3 py-1.5 font-display text-sm shadow-[3px_3px_0_0_var(--color-ink)] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none"
            >
              <ArrowLeft size={14} strokeWidth={3} />
              {t.caseStudy.back}
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="border-b-2 border-ink">
        <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
          <p className="font-mono text-sm text-ink/60">{t.caseStudy.kicker}</p>
          <h1 className="mt-4 font-display text-5xl leading-[0.95] tracking-tight md:text-8xl">
            {cs.title}
          </h1>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <span
              className={`${cs.accent} inline-block border-2 border-ink px-3 py-1 font-display text-sm shadow-[3px_3px_0_0_var(--color-ink)]`}
            >
              {c.tag}
            </span>
            <span className="inline-block border-2 border-ink bg-bg px-3 py-1 font-mono text-sm shadow-[3px_3px_0_0_var(--color-ink)]">
              {cs.year}
            </span>
          </div>
          <p className="mt-10 max-w-3xl font-display text-2xl leading-tight md:text-3xl">
            {c.intro}
          </p>

          {/* Metrics */}
          <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {cs.metrics.map((m, i) => (
              <div
                key={i}
                className="border-2 border-ink bg-bg p-4 shadow-[4px_4px_0_0_var(--color-ink)]"
              >
                <div className="font-display text-3xl">
                  {m.live && stats ? stats[m.live].toLocaleString() : m.n}
                </div>
                <div className="mt-1 font-mono text-xs uppercase tracking-wider text-ink/70">
                  {m.label[locale] ?? m.label.fr}
                </div>
              </div>
            ))}
          </div>

          {cs.live === 'roblox' && stats && <RobloxLive t={t} stats={stats} />}
        </div>
      </section>

      {/* Image */}
      {cs.image && (
        <section className="border-b-2 border-ink">
          <div className="mx-auto max-w-6xl px-6 py-16">
            <div
              className={`${cs.accent} relative aspect-[16/9] overflow-hidden border-2 border-ink shadow-[8px_8px_0_0_var(--color-ink)]`}
            >
              <img
                src={cs.image}
                alt={cs.title}
                className="absolute inset-0 h-full w-full object-cover"
              />
            </div>
          </div>
        </section>
      )}

      {/* Sections */}
      <section className="border-b-2 border-ink">
        <div className="mx-auto max-w-6xl space-y-16 px-6 py-16 md:py-20">
          {c.sections.map((s, i) => (
            <div key={i} className="grid gap-6 md:grid-cols-5 md:gap-12">
              <div className="md:col-span-2">
                <div className="flex items-end gap-4">
                  <span className="font-mono text-sm text-ink/60">
                    // {String(i + 1).padStart(2, '0')}
                  </span>
                  <h2 className="font-display text-2xl leading-none md:text-3xl">
                    {s.heading}
                  </h2>
                </div>
              </div>
              <div className="space-y-4 md:col-span-3">
                {s.body.split('\n\n').map((p, pi) => (
                  <p key={pi} className="text-base leading-relaxed text-ink/80 md:text-lg">
                    {p}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Stack */}
      <section className="border-b-2 border-ink bg-ink text-bg">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <h2 className="font-display text-3xl md:text-4xl">{t.caseStudy.stack}</h2>
          <div className="mt-8 flex flex-wrap gap-3">
            {cs.stack.map((s, i) => (
              <span
                key={s}
                className={`${chipColors[i % 4]} ${chipRots[i % 4]} inline-block border-2 border-bg px-4 py-2 font-display text-lg text-ink shadow-[4px_4px_0_0_var(--color-bg)]`}
              >
                {s}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-b-2 border-ink">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-6 px-6 py-16">
          <p className="font-display text-2xl md:text-3xl">{t.caseStudy.cta}</p>
          <div className="flex flex-wrap gap-4">
            <a
              href={cs.liveUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 border-2 border-ink bg-yellow px-5 py-3 font-display shadow-[4px_4px_0_0_var(--color-ink)] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none"
            >
              {t.caseStudy.visit}
              <ArrowUpRight size={16} strokeWidth={3} />
            </a>
            <a
              href="mailto:contact@simnjs.fr"
              className="inline-flex items-center gap-2 border-2 border-ink bg-bg px-5 py-3 font-display shadow-[4px_4px_0_0_var(--color-ink)] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none"
            >
              <Mail size={16} strokeWidth={2.5} />
              {t.caseStudy.ctaButton}
            </a>
          </div>
        </div>
      </section>

      <footer className="bg-ink py-6 text-bg">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 font-mono text-xs">
          <span>
            © {new Date().getFullYear()} Simon GAY (simnJS) — {t.footer.built}
          </span>
        </div>
      </footer>
    </main>
  )
}

// ─── Stats Roblox en direct ─────────────────────────────────────────────────

// Récupère les stats du groupe et les rafraîchit toutes les 60 s. Partagé entre
// les cartes de métriques (visites cumulées) et le bloc live détaillé.
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
  return (
    <div className="mt-8 border-2 border-ink bg-bg shadow-[6px_6px_0_0_var(--color-ink)]">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-ink px-4 py-3">
        <span className="inline-flex items-center gap-2 border-2 border-ink bg-coral px-2 py-1 font-display text-xs tracking-wider shadow-[3px_3px_0_0_var(--color-ink)]">
          ● {t.caseStudy.liveTitle}
        </span>
        <div className="flex flex-wrap items-center gap-4 font-mono text-xs text-ink/70">
          <span>
            <span className="font-display text-base text-ink">
              {stats.totalPlaying.toLocaleString()}
            </span>{' '}
            {t.caseStudy.livePlaying}
          </span>
          <span>
            <span className="font-display text-base text-ink">
              {stats.totalVisits.toLocaleString()}
            </span>{' '}
            {t.caseStudy.liveVisits}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Users size={13} strokeWidth={2.5} />
            <span className="font-display text-base text-ink">
              {stats.members.toLocaleString()}
            </span>{' '}
            {t.caseStudy.liveMembers}
          </span>
        </div>
      </div>
      <ul className="divide-y-2 divide-ink">
        {stats.games.map((g) => (
          <li key={g.url}>
            <a
              href={g.url}
              target="_blank"
              rel="noreferrer"
              className="group flex items-center gap-4 px-4 py-3 transition-colors hover:bg-yellow/30"
            >
              <span
                className={`h-2.5 w-2.5 shrink-0 border-2 border-ink ${g.playing > 0 ? 'bg-coral' : 'bg-bg'}`}
              />
              <span className="min-w-0 flex-1 truncate font-display text-sm">
                {g.name}
              </span>
              <span className="shrink-0 font-mono text-xs text-ink/70">
                {g.playing.toLocaleString()} {t.caseStudy.livePlaying}
              </span>
              <span className="hidden shrink-0 font-mono text-xs text-ink/60 sm:inline">
                {g.visits.toLocaleString()} {t.caseStudy.liveVisits}
              </span>
              {typeof g.likes === 'number' && (
                <span
                  className="hidden shrink-0 items-center gap-1 font-mono text-xs text-ink/60 md:inline-flex"
                  title={t.caseStudy.liveLikes}
                  aria-label={t.caseStudy.liveLikes}
                >
                  <ThumbsUp size={12} strokeWidth={2.5} />
                  {g.likes.toLocaleString()}
                </span>
              )}
              <span
                className="hidden shrink-0 items-center gap-1 font-mono text-xs text-ink/60 md:inline-flex"
                title={t.caseStudy.liveFavs}
                aria-label={t.caseStudy.liveFavs}
              >
                <Star size={12} strokeWidth={2.5} />
                {g.favorites.toLocaleString()}
              </span>
              <ArrowUpRight
                size={14}
                strokeWidth={3}
                className="shrink-0 opacity-0 transition-opacity group-hover:opacity-100"
              />
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}
