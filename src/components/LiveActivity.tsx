import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  ArrowUpRight,
  Flame,
  GitBranch,
  GitCommit,
  GitFork,
  GitPullRequest,
  Globe,
  MessageSquare,
  Package,
  RefreshCw,
  Sparkles,
} from 'lucide-react'
import {
  getGithubActivity,
  getGithubProfile,
  type GhEvent,
  type GhEventType,
  type GhProfile,
} from '../lib/github'
import type { Dictionary } from '../i18n/translations'

const REFRESH_MS = 60_000

type Filter = 'all' | 'code' | 'prs' | 'releases'

const ACCENTS: Record<GhEventType, string> = {
  push: 'bg-cyan',
  pr: 'bg-violet',
  release: 'bg-yellow',
  issue: 'bg-coral',
  create: 'bg-coral',
  public: 'bg-yellow',
  fork: 'bg-cyan',
}

const FILTER_OF: Record<GhEventType, Exclude<Filter, 'all'>> = {
  push: 'code',
  create: 'code',
  public: 'code',
  fork: 'code',
  pr: 'prs',
  issue: 'prs',
  release: 'releases',
}

function Icon({ type }: { type: GhEventType }) {
  const props = { size: 16, strokeWidth: 2.5 }
  switch (type) {
    case 'push':
      return <GitCommit {...props} />
    case 'pr':
      return <GitPullRequest {...props} />
    case 'release':
      return <Package {...props} />
    case 'issue':
      return <MessageSquare {...props} />
    case 'create':
      return <GitBranch {...props} />
    case 'public':
      return <Globe {...props} />
    case 'fork':
      return <GitFork {...props} />
    default:
      return <Sparkles {...props} />
  }
}

function formatRelative(iso: string, time: Dictionary['github']['time']): string {
  const diff = Math.max(0, Date.now() - new Date(iso).getTime())
  const s = Math.floor(diff / 1000)
  if (s < 60) return time.now
  const m = Math.floor(s / 60)
  if (m < 60) return `${m}${time.minute}`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}${time.hour}`
  const d = Math.floor(h / 24)
  if (d < 30) return `${d}${time.day}`
  const mo = Math.floor(d / 30)
  if (mo < 12) return `${mo}${time.month}`
  const y = Math.floor(mo / 12)
  return `${y}${time.year}`
}

export function LiveActivity({ t }: { t: Dictionary }) {
  const [events, setEvents] = useState<GhEvent[]>([])
  const [profile, setProfile] = useState<GhProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [filter, setFilter] = useState<Filter>('all')
  const [, setTick] = useState(0)
  const seenIds = useRef<Set<string>>(new Set())
  const mounted = useRef(true)

  const load = useCallback(async (manual = false) => {
    if (manual) setRefreshing(true)
    try {
      const [a, p] = await Promise.all([
        getGithubActivity(),
        getGithubProfile(),
      ])
      if (!mounted.current) return
      setEvents(a.events)
      setProfile(p)
    } catch {
      // silent — keep previous data
    } finally {
      if (mounted.current) {
        setLoading(false)
        setRefreshing(false)
      }
    }
  }, [])

  useEffect(() => {
    mounted.current = true
    load()
    const id = setInterval(() => load(), REFRESH_MS)
    const ticker = setInterval(() => setTick((n) => n + 1), 30_000)
    return () => {
      mounted.current = false
      clearInterval(id)
      clearInterval(ticker)
    }
  }, [load])

  const visibleEvents = useMemo(() => {
    if (filter === 'all') return events
    return events.filter((e) => FILTER_OF[e.type] === filter)
  }, [events, filter])

  return (
    <section id="now" className="border-b-2 border-ink">
      <div className="mx-auto max-w-6xl px-6 py-20">
        {/* Header */}
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionTitle index="04" title={t.sections.now} />
          <div className="flex items-center gap-3 font-mono text-xs">
            <span className="inline-flex items-center gap-2 border-2 border-ink bg-coral px-2 py-1 font-display tracking-wider shadow-[3px_3px_0_0_var(--color-ink)]">
              ● {t.github.live}
            </span>
            <button
              onClick={() => load(true)}
              disabled={refreshing}
              className="inline-flex items-center gap-1.5 border-2 border-ink bg-bg px-2 py-1 font-display tracking-wider shadow-[3px_3px_0_0_var(--color-ink)] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none disabled:cursor-not-allowed disabled:opacity-50"
              aria-label={t.github.refresh}
            >
              <RefreshCw
                size={12}
                strokeWidth={3}
                className={refreshing ? 'animate-spin' : ''}
              />
              {refreshing ? t.github.refreshing : t.github.refresh}
            </button>
          </div>
        </div>

        {/* Stats */}
        <Stats profile={profile} t={t} />

        {/* Heatmap */}
        <Heatmap profile={profile} t={t} />

        {/* Filters */}
        <div className="mt-12 flex flex-wrap items-center gap-3">
          {(['all', 'code', 'prs', 'releases'] as const).map((f) => (
            <FilterChip
              key={f}
              active={filter === f}
              onClick={() => setFilter(f)}
              label={t.github.filters[f]}
            />
          ))}
        </div>

        {/* Feed */}
        <div className="mt-6 border-2 border-ink bg-bg shadow-[6px_6px_0_0_var(--color-ink)]">
          {loading ? (
            <Skeleton />
          ) : visibleEvents.length === 0 ? (
            <Empty msg={t.github.empty} />
          ) : (
            <ul className="divide-y-2 divide-ink">
              {visibleEvents.map((e) => (
                <EventRow
                  key={e.id}
                  event={e}
                  t={t}
                  isNew={!seenIds.current.has(e.id)}
                  onSeen={() => seenIds.current.add(e.id)}
                />
              ))}
            </ul>
          )}
        </div>

        <a
          href="https://github.com/simnJS"
          target="_blank"
          rel="noreferrer"
          className="mt-8 inline-flex items-center gap-2 border-b-2 border-ink font-display text-sm hover:text-coral"
        >
          {t.github.viewMore}
          <ArrowUpRight size={16} strokeWidth={3} />
        </a>
      </div>
    </section>
  )
}

// ─── Stats banner ───────────────────────────────────────────────────────────

function Stats({
  profile,
  t,
}: {
  profile: GhProfile | null
  t: Dictionary
}) {
  const items = [
    {
      n: profile ? profile.totalCommits.toLocaleString() : '—',
      label: t.github.stats.commits,
      color: 'bg-cyan',
    },
    {
      n: profile ? profile.totalPRs.toString() : '—',
      label: t.github.stats.prs,
      color: 'bg-violet',
    },
    {
      n: profile ? profile.totalActiveRepos.toString() : '—',
      label: t.github.stats.repos,
      color: 'bg-yellow',
    },
    {
      n: profile ? `${profile.currentStreak}` : '—',
      label: t.github.stats.streak,
      color: 'bg-coral',
      icon: <Flame size={18} strokeWidth={3} />,
    },
  ]
  return (
    <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((it, i) => (
        <div
          key={i}
          className="relative overflow-hidden border-2 border-ink bg-bg p-4 shadow-[4px_4px_0_0_var(--color-ink)]"
        >
          <div className="flex items-center justify-between">
            <div className="font-display text-4xl leading-none">{it.n}</div>
            <span
              className={`${it.color} grid h-8 w-8 place-items-center border-2 border-ink`}
            >
              {it.icon ?? <Sparkles size={16} strokeWidth={3} />}
            </span>
          </div>
          <div className="mt-3 font-mono text-xs uppercase tracking-wider text-ink/70">
            {it.label}
          </div>
        </div>
      ))}
    </div>
  )
}

// ─── Heatmap ────────────────────────────────────────────────────────────────

const LEVELS = [
  'bg-bg',
  'bg-cyan/30',
  'bg-cyan/60',
  'bg-cyan',
  'bg-violet',
] as const

function Heatmap({
  profile,
  t,
}: {
  profile: GhProfile | null
  t: Dictionary
}) {
  if (!profile || profile.weeks.length === 0) {
    return (
      <div className="mt-10 border-2 border-ink bg-bg p-6 shadow-[4px_4px_0_0_var(--color-ink)]">
        <HeatmapHeader profile={null} t={t} />
        <div className="mt-6 h-24 animate-pulse bg-ink/10" />
      </div>
    )
  }
  return (
    <div className="mt-10 border-2 border-ink bg-bg p-6 shadow-[4px_4px_0_0_var(--color-ink)]">
      <HeatmapHeader profile={profile} t={t} />
      <div className="mt-6 overflow-x-auto">
        <div className="flex gap-[2px]">
          {profile.weeks.map((w, wi) => (
            <div key={wi} className="flex flex-col gap-[2px]">
              {w.days.map((d) => (
                <span
                  key={d.date}
                  title={`${d.date} · ${d.count}`}
                  className={`${LEVELS[d.level]} h-[11px] w-[11px] border ${
                    d.level === 0 ? 'border-ink/15' : 'border-ink/40'
                  }`}
                />
              ))}
            </div>
          ))}
        </div>
        <div className="mt-3 flex items-center gap-2 font-mono text-xs text-ink/60">
          <span>{t.github.heatmap.less}</span>
          {LEVELS.map((cls, i) => (
            <span
              key={i}
              className={`${cls} h-[11px] w-[11px] border ${
                i === 0 ? 'border-ink/15' : 'border-ink/40'
              }`}
            />
          ))}
          <span>{t.github.heatmap.more}</span>
        </div>
      </div>
    </div>
  )
}

function HeatmapHeader({
  profile,
  t,
}: {
  profile: GhProfile | null
  t: Dictionary
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3">
      <h3 className="font-display text-xl md:text-2xl">{t.github.heatmap.title}</h3>
      {profile && (
        <div className="font-mono text-xs text-ink/70">
          <span className="font-display text-lg text-ink">
            {profile.totalContributions.toLocaleString()}
          </span>{' '}
          {t.github.heatmap.totalSuffix}
        </div>
      )}
    </div>
  )
}

// ─── Filter chips ───────────────────────────────────────────────────────────

function FilterChip({
  active,
  onClick,
  label,
}: {
  active: boolean
  onClick: () => void
  label: string
}) {
  return (
    <button
      onClick={onClick}
      className={
        'border-2 border-ink px-3 py-1 font-display text-sm transition-all ' +
        (active
          ? 'bg-yellow shadow-[3px_3px_0_0_var(--color-ink)]'
          : 'bg-bg hover:bg-yellow/30')
      }
    >
      {label}
    </button>
  )
}

// ─── Event row ──────────────────────────────────────────────────────────────

function EventRow({
  event,
  t,
  isNew,
  onSeen,
}: {
  event: GhEvent
  t: Dictionary
  isNew: boolean
  onSeen: () => void
}) {
  useEffect(() => {
    if (isNew) onSeen()
  }, [isNew, onSeen])

  const accent = ACCENTS[event.type]
  const count = event.count && event.count > 1 ? event.count : null
  const repoLabel = event.private
    ? t.github.privateLabel
    : (event.repo.split('/')[1] ?? event.repo)
  const messageLabel = event.private ? t.github.privateMessage : event.message

  return (
    <li className={isNew ? 'animate-row-in' : ''}>
      <a
        href={event.url}
        target="_blank"
        rel="noreferrer"
        className="group flex items-center gap-4 px-4 py-3 transition-colors hover:bg-yellow/30"
      >
        <span
          className={`${accent} grid h-8 w-8 shrink-0 place-items-center border-2 border-ink`}
        >
          <Icon type={event.type} />
        </span>
        <span className="border-2 border-ink bg-bg px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider">
          {t.github.types[event.type as keyof typeof t.github.types] ?? event.type}
        </span>
        {count && (
          <span className="border-2 border-ink bg-yellow px-2 py-0.5 font-display text-[11px]">
            ×{count}
          </span>
        )}
        {event.private && (
          <span className="border-2 border-ink bg-ink px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-bg">
            {t.github.privateLabel}
          </span>
        )}
        <span
          className={`hidden font-mono text-sm md:inline ${event.private ? 'italic text-ink/40' : 'text-ink/70'}`}
        >
          {repoLabel}
        </span>
        <span
          className={`min-w-0 flex-1 truncate font-sans text-sm ${event.private ? 'italic text-ink/40' : ''}`}
        >
          {messageLabel}
        </span>
        <span className="shrink-0 font-mono text-xs text-ink/60">
          {formatRelative(event.createdAt, t.github.time)}
        </span>
        <ArrowUpRight
          size={14}
          strokeWidth={3}
          className={`shrink-0 transition-opacity ${event.private ? 'opacity-0' : 'opacity-0 group-hover:opacity-100'}`}
        />
      </a>
    </li>
  )
}

function Skeleton() {
  return (
    <ul>
      {[0, 1, 2, 3].map((i) => (
        <li
          key={i}
          className="flex items-center gap-4 border-b-2 border-ink px-4 py-3 last:border-b-0"
        >
          <span className="h-8 w-8 border-2 border-ink bg-ink/10" />
          <span className="h-3 w-12 bg-ink/10" />
          <span className="h-3 flex-1 bg-ink/10" />
          <span className="h-3 w-8 bg-ink/10" />
        </li>
      ))}
    </ul>
  )
}

function Empty({ msg }: { msg: string }) {
  return (
    <div className="px-4 py-8 text-center font-mono text-sm text-ink/60">
      {msg}
    </div>
  )
}

function SectionTitle({ index, title }: { index: string; title: string }) {
  return (
    <div className="flex items-end gap-4">
      <span className="font-mono text-sm text-ink/60">// {index}</span>
      <h2 className="font-display text-4xl leading-none md:text-6xl">{title}</h2>
    </div>
  )
}
