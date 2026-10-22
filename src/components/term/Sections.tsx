import { useEffect, useRef, useState, type HTMLAttributes, type KeyboardEvent, type ReactNode } from 'react'
import { Link } from '@tanstack/react-router'
import { ME, PROJECTS, PROJECT_TAGS, type Project, type ProjectTag } from '../../content/site'
import { useTerm } from '../../i18n/term'
import { aboutLines, clientLines, contactLines, eventLine, stackLines, type Line } from '../../term/shell'
import { CommandHeading, PromptHeader, PromptLine } from './Prompt'
import { ExtLink, Spinner } from './bits'
import { useGithubActivity, useGithubProfile } from './live'

// Les sections de la page : des commandes déjà exécutées, dont la sortie
// est la même que celle du shell quand c'est un fichier (cat ~/stack.toml…).

export function Lines({ lines, className = '' }: { lines: Line[]; className?: string }) {
  return (
    <div className={className}>
      {lines.map((l, i) => (
        <div key={i} className="term-line">
          {l.node ?? l.text}
        </div>
      ))}
    </div>
  )
}

// ─── ~/projects : un gestionnaire de fichiers à deux volets ────────────────

function ProjectLink({ p, className, children, ...rest }: {
  p: Project
  className?: string
  children: ReactNode
} & HTMLAttributes<HTMLAnchorElement>) {
  if (p.caseStudy)
    return (
      <Link to="/work/$slug" params={{ slug: p.caseStudy }} className={className} {...rest}>
        {children}
      </Link>
    )
  return (
    <a href={p.href} target="_blank" rel="noreferrer" className={className} {...rest}>
      {children}
    </a>
  )
}

function Preview({ p }: { p: Project }) {
  const t = useTerm()
  return (
    <div className="overflow-hidden rounded-md border border-line">
      <div className="flex items-center justify-between border-b border-line bg-panel px-[1ch] text-[13px] leading-8 text-dim">
        <span>
          {t.projects.preview}: <span className="text-fg">{p.slug}.md</span>
        </span>
        <span className="text-mauve">{p.tags.map((x) => `#${x}`).join(' ')}</span>
      </div>
      {p.image ? (
        <img
          key={p.image}
          src={p.image}
          alt={p.title}
          className="aspect-[16/10] w-full border-b border-line object-cover"
        />
      ) : (
        <div className="grid aspect-[16/10] w-full place-items-center border-b border-line bg-[radial-gradient(circle,var(--color-line)_1px,transparent_1px)] [background-size:12px_12px]">
          <span className="bg-bg px-[1ch] text-2xl font-bold text-pink">{p.title}</span>
        </div>
      )}
      <div className="space-y-3 p-[2ch]">
        <p className="term-line">
          <span className="font-bold text-pink"># {p.title}</span> <span className="text-muted">{p.year}</span>
        </p>
        <p className="text-dim">{t.projects.desc[p.slug]}</p>
        <p className="term-line">
          <span className="text-blue">stack</span> = [
          {p.stack.map((s, i) => (
            <span key={s}>
              {i > 0 && ', '}
              <span className="text-green">"{s}"</span>
            </span>
          ))}
          ]
        </p>
        <p className="flex flex-wrap gap-x-[3ch]">
          {p.caseStudy && (
            <Link to="/work/$slug" params={{ slug: p.caseStudy }} className="text-blue underline decoration-transparent underline-offset-4 hover:decoration-current">
              {t.projects.caseStudy}
            </Link>
          )}
          <ExtLink href={p.href}>{t.projects.visit}</ExtLink>
          {p.repo && <ExtLink href={`https://github.com/${p.repo}`}>{t.projects.source}</ExtLink>}
        </p>
      </div>
    </div>
  )
}

export function Projects() {
  const t = useTerm()
  const [tag, setTag] = useState<ProjectTag | null>(null)
  const [selected, setSelected] = useState(PROJECTS[0].slug)
  const listRef = useRef<HTMLUListElement>(null)
  const list = tag ? PROJECTS.filter((p) => p.tags.includes(tag)) : PROJECTS
  const current = list.find((p) => p.slug === selected) ?? list[0]

  function onKeyDown(e: KeyboardEvent<HTMLUListElement>) {
    const keys: Record<string, number> = { ArrowDown: 1, j: 1, ArrowUp: -1, k: -1 }
    const d = keys[e.key]
    if (!d) return
    e.preventDefault()
    const links = [...(listRef.current?.querySelectorAll<HTMLAnchorElement>('a') ?? [])]
    const i = links.indexOf(document.activeElement as HTMLAnchorElement)
    links[(i + d + links.length) % links.length]?.focus()
  }

  return (
    <section>
      <CommandHeading id="projects">
        ls -la ~/projects{tag ? ` --tag=${tag}` : ''}
      </CommandHeading>
      <div className="term-line mb-3 flex flex-wrap gap-x-[2ch]" role="group" aria-label="filter">
        {[null, ...PROJECT_TAGS].map((x) => (
          <button
            key={x ?? 'all'}
            type="button"
            onClick={() => setTag(x)}
            aria-pressed={tag === x}
            className={tag === x ? 'text-pink' : 'text-muted transition-colors hover:text-fg'}
          >
            {x ? `--tag=${x}` : t.projects.all}
          </button>
        ))}
      </div>
      <div className="grid gap-[3ch] md:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)]">
        <ul ref={listRef} onKeyDown={onKeyDown} data-keynav className="min-w-0">
          {list.map((p) => {
            const on = current?.slug === p.slug
            return (
              <li key={p.slug}>
                <ProjectLink
                  p={p}
                  onMouseEnter={() => setSelected(p.slug)}
                  onFocus={() => setSelected(p.slug)}
                  className={`block px-[1ch] py-1 outline-none transition-colors md:py-0 ${on ? 'bg-select' : 'hover:bg-panel'} focus-visible:outline-pink`}
                >
                  <span className="term-line flex gap-x-[1ch]">
                    <span className={on ? 'text-pink' : 'text-transparent'} aria-hidden>❯</span>
                    <span className="hidden text-muted lg:inline">-rw-r--r--</span>
                    <span className="text-dim">{p.year}</span>
                    <span className={`truncate ${p.caseStudy ? 'font-bold text-blue' : 'text-fg'}`}>{p.slug}.md</span>
                  </span>
                  <span className="block pl-[2ch] text-[13px] text-dim md:hidden">{t.projects.desc[p.slug]}</span>
                </ProjectLink>
              </li>
            )
          })}
          <li className="term-line px-[1ch] text-muted">
            {list.length} {list.length > 1 ? 'files' : 'file'}
          </li>
        </ul>
        <div className="hidden md:block">{current && <Preview p={current} />}</div>
      </div>
    </section>
  )
}

// ─── gh contributions ──────────────────────────────────────────────────────

const HEAT = ['#1c1c24', '#4b3342', '#7c4f68', '#b7789b', '#f5a3c7']

export function Contributions() {
  const t = useTerm()
  const profile = useGithubProfile()
  return (
    <section>
      <CommandHeading id="activity">gh contributions --last 12mo</CommandHeading>
      {profile.status === 'loading' && (
        <div className="term-line text-dim">
          <Spinner /> {t.ff.loading}
        </div>
      )}
      {profile.status === 'error' && (
        <div className="term-line text-dim">
          {t.heat.unavailable} <ExtLink href={ME.github}>github.com/simnJS</ExtLink>
        </div>
      )}
      {profile.status === 'ok' && (
        <>
          <div className="overflow-x-auto pb-2">
            <div className="flex w-max gap-[3px]" role="img" aria-label={t.contributions(profile.data.totalContributions)}>
              {profile.data.weeks.map((w, i) => (
                <div key={i} className="flex flex-col gap-[3px]">
                  {w.days.map((d) => (
                    <span
                      key={d.date}
                      title={`${d.date}: ${d.count}`}
                      className="block size-[11px] rounded-[2px]"
                      style={{ background: HEAT[d.level] }}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
          <div className="term-line mt-1 flex flex-wrap items-center justify-between gap-x-[3ch] text-dim">
            <span>{t.contributions(profile.data.totalContributions)}</span>
            <span className="flex items-center gap-[0.5ch] text-muted" aria-hidden>
              {t.heat.less}
              {HEAT.map((c) => (
                <span key={c} className="inline-block size-[11px] rounded-[2px]" style={{ background: c }} />
              ))}
              {t.heat.more}
            </span>
          </div>
          <div className="term-line mt-2 flex flex-wrap gap-x-[3ch]">
            {(
              [
                ['commits', profile.data.totalCommits],
                ['prs', profile.data.totalPRs],
                ['repos', profile.data.totalActiveRepos],
                ['streak', `${profile.data.currentStreak}d`],
                ['best', `${profile.data.longestStreak}d`],
              ] as Array<[string, number | string]>
            ).map(([k, v]) => (
              <span key={k}>
                <span className="text-pink">{k}</span> <span>{typeof v === 'number' ? v.toLocaleString('en') : v}</span>
              </span>
            ))}
          </div>
        </>
      )}
    </section>
  )
}

// ─── tail -f ~/activity.log ─────────────────────────────────────────────────

export function ActivityLog() {
  const t = useTerm()
  const state = useGithubActivity(60_000)
  const seen = useRef<Set<string> | null>(null)
  const [fresh, setFresh] = useState<Set<string>>(new Set())

  // Les événements arrivés depuis le premier chargement s'allument en rose.
  useEffect(() => {
    if (state.status !== 'ok') return
    const ids = state.data.map((e) => e.id)
    if (seen.current) {
      const added = ids.filter((id) => !seen.current!.has(id))
      if (added.length) {
        setFresh(new Set(added))
        setTimeout(() => setFresh(new Set()), 4000)
      }
    }
    seen.current = new Set(ids)
  }, [state])

  return (
    <section>
      <CommandHeading>tail -f ~/activity.log</CommandHeading>
      {state.status === 'loading' && (
        <div className="term-line text-dim">
          <Spinner /> {t.activity.loading}
        </div>
      )}
      {state.status === 'error' && <div className="term-line text-red">{t.errors.network}</div>}
      {state.status === 'ok' && (
        <div>
          {state.data.length === 0 && <div className="term-line text-dim">{t.activity.empty}</div>}
          {state.data.slice(0, 12).map((e) => (
            <div key={e.id} className={`term-line transition-colors duration-1000 ${fresh.has(e.id) ? 'bg-pink/10' : ''}`}>
              {eventLine(e, t).node}
            </div>
          ))}
          <div className="term-line text-muted">
            {t.activity.following} <span className="caret inline-block h-[1.15em] w-[2px] translate-y-[0.2em] bg-muted" aria-hidden />
          </div>
        </div>
      )}
    </section>
  )
}

// ─── Fichiers ──────────────────────────────────────────────────────────────

export function Clients() {
  const t = useTerm()
  return (
    <section>
      <CommandHeading>cat ~/clients.txt</CommandHeading>
      <Lines lines={clientLines(t)} />
    </section>
  )
}

export function Stack() {
  const t = useTerm()
  return (
    <section>
      <CommandHeading id="stack">cat ~/stack.toml</CommandHeading>
      <Lines lines={stackLines(t)} />
    </section>
  )
}

export function About() {
  const t = useTerm()
  return (
    <section>
      <CommandHeading>cat ~/about.md</CommandHeading>
      <Lines lines={aboutLines(t)} className="max-w-[72ch]" />
    </section>
  )
}

export function Contact() {
  const t = useTerm()
  const [copied, setCopied] = useState(false)
  return (
    <section>
      <CommandHeading id="contact">contact</CommandHeading>
      <p className="mb-5 mt-2 text-[clamp(1.5rem,4vw,2.25rem)] font-bold leading-tight text-pink">{t.contact.title}</p>
      <Lines lines={contactLines()} />
      <div className="mt-5 flex flex-wrap gap-[2ch]">
        <a
          href={`mailto:${ME.email}`}
          className="rounded border border-pink px-[1.5ch] py-1.5 text-pink transition-colors hover:bg-pink hover:text-bg"
        >
          [ {t.contact.mail} ]
        </a>
        <button
          type="button"
          onClick={() =>
            navigator.clipboard?.writeText(ME.discord).then(() => {
              setCopied(true)
              setTimeout(() => setCopied(false), 1800)
            })
          }
          className="rounded border border-line px-[1.5ch] py-1.5 text-fg transition-colors hover:border-mauve hover:text-mauve"
        >
          [ {copied ? t.copied : t.contact.discord} ]
        </button>
      </div>
    </section>
  )
}

export function Exit() {
  return (
    <footer className="mt-14">
      <PromptHeader />
      <PromptLine>
        <span className="text-yellow">exit</span>
      </PromptLine>
      <div className="term-line mt-3 text-muted">[process exited with code 0 (0x00000000)]</div>
      <div className="term-line text-muted">
        © {new Date().getFullYear()} {ME.fullName} ({ME.handle})
      </div>
    </footer>
  )
}
