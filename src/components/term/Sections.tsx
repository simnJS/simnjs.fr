import { useState, type ReactNode } from 'react'
import { Link } from '@tanstack/react-router'
import { FileText, Github, Linkedin, Mail } from 'lucide-react'
import { CLIENTS } from '../../content/clients'
import { ME, PROJECTS, STACK, type Project } from '../../content/site'
import { useTerm } from '../../i18n/term'
import { eventLine } from '../../term/shell'
import { ExtLink } from './bits'
import { useGithubActivity, useGithubProfile } from './live'

// Les sections de la page d'accueil : visuelles d'abord, avec le terminal
// en filigrane (titres en ❯, fenêtres, code coloré).

function SectionTitle({ id, children, aside }: { id?: string; children: ReactNode; aside?: ReactNode }) {
  return (
    <div className="mb-8 mt-28 flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
      <h2 id={id} className="text-[clamp(1.75rem,4vw,2.5rem)] font-extrabold tracking-[-0.03em]">
        <span className="text-pink">❯ </span>
        {children}
      </h2>
      {aside && <div className="text-[13px] text-muted">{aside}</div>}
    </div>
  )
}

// ─── Projets ────────────────────────────────────────────────────────────────

const KEYWORDS = /^(using|class|for|let|in|return|override|suspends|void|int|string|array|editable|assert|player_save)$/

/** Coloration minimale, juste assez pour qu'un extrait se lise comme du code. */
function CodeArt({ code }: { code: string }) {
  return (
    <pre className="h-full overflow-hidden bg-bg p-5 text-[12.5px] leading-[1.7] text-fg">
      {code.split('\n').map((line, i) => (
        <div key={i}>
          {line.split(/("[^"]*"|#.*$|\/\/.*$|\$|\b\d[\d_.]*\b|\b[A-Za-z_]+\b)/).map((tok, j) => {
            if (!tok) return null
            let cls = ''
            if (tok.startsWith('"')) cls = 'text-green'
            else if (tok.startsWith('#') || tok.startsWith('//')) cls = 'text-muted'
            else if (tok === '$') cls = 'text-pink'
            else if (/^\d/.test(tok)) cls = 'text-yellow'
            else if (KEYWORDS.test(tok)) cls = 'text-pink'
            else if (/^[A-Z]/.test(tok)) cls = 'text-blue'
            return (
              <span key={j} className={cls}>
                {tok}
              </span>
            )
          })}
          {line === '' && ' '}
        </div>
      ))}
    </pre>
  )
}

// Courbe d'audience d'une journée type : creux le matin, pic en soirée.
const HOURS = Array.from({ length: 24 }, (_, h) => 0.18 + 0.82 * Math.max(0, Math.sin(((h - 7) / 24) * Math.PI * 2 - 0.4)) ** 1.6)

/** Illustration d'Engine Players : l'audience heure par heure. */
function ChartArt() {
  return (
    <div className="flex h-full flex-col bg-bg p-5">
      <div className="text-[12px] text-muted">players online, last 24h</div>
      <div className="mt-3 flex flex-1 items-end gap-[3px]">
        {HOURS.map((v, h) => (
          <span
            key={h}
            className={`flex-1 rounded-t-[2px] ${v > 0.85 ? 'bg-pink' : 'bg-pink/35'}`}
            style={{ height: `${Math.round(v * 100)}%` }}
          />
        ))}
      </div>
      <div className="mt-2 flex justify-between text-[11px] text-muted">
        <span>00h</span>
        <span>06h</span>
        <span>12h</span>
        <span>18h</span>
        <span>24h</span>
      </div>
    </div>
  )
}

function ProjectCard({ p, wide = false, compact = false }: { p: Project; wide?: boolean; compact?: boolean }) {
  const t = useTerm()
  const className =
    'group flex h-full flex-col overflow-hidden rounded-lg border border-line bg-panel transition-colors hover:border-pink/60 focus-visible:border-pink'
  const inner = (
    <>
      <div className="flex h-9 items-center justify-between border-b border-line bg-chrome px-3 text-[12px] text-dim">
        <span className="flex items-center gap-2">
          <FileText size={13} className="text-pink" aria-hidden />
          {p.slug}.md
        </span>
        <span>{p.year}</span>
      </div>
      <div
        className={`relative overflow-hidden ${wide ? 'aspect-[16/9] md:aspect-[24/9]' : compact ? 'aspect-[16/7]' : 'aspect-[16/9]'}`}
        style={{ background: p.imageBg }}
      >
        {p.image ? (
          <img
            src={p.image}
            alt=""
            loading="lazy"
            className={`absolute inset-0 h-full w-full transition-transform duration-500 group-hover:scale-[1.03] ${
              p.imageBg ? 'object-contain p-4' : 'object-cover'
            }`}
            // Logo carré : ses bords se fondent dans la couleur de fond, sans cadre visible.
            style={p.imageBg ? { maskImage: 'radial-gradient(closest-side, #000 80%, transparent 100%)' } : undefined}
          />
        ) : p.visual === 'chart' ? (
          <ChartArt />
        ) : (
          p.code && <CodeArt code={p.code} />
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-xl font-bold tracking-tight">{p.title}</h3>
        <p className="mt-2 flex-1 text-dim">{t.projects.desc[p.slug]}</p>
        <p className="mt-4 flex flex-wrap gap-x-3 text-[13px] text-mauve">
          {p.tags.map((tag) => (
            <span key={tag}>#{tag}</span>
          ))}
        </p>
      </div>
    </>
  )
  if (p.caseStudy)
    return (
      <Link to="/work/$slug" params={{ slug: p.caseStudy }} className={className}>
        {inner}
      </Link>
    )
  return (
    <a href={p.href} target="_blank" rel="noreferrer" className={className}>
      {inner}
    </a>
  )
}

export function Projects() {
  const t = useTerm()
  const products = PROJECTS.filter((p) => !p.tags.includes('oss'))
  const oss = PROJECTS.filter((p) => p.tags.includes('oss'))
  return (
    <section>
      <SectionTitle id="projects">{t.titles.projects}</SectionTitle>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {products.map((p, i) => (
          <div key={p.slug} className={i === 0 ? 'md:col-span-2' : ''}>
            <ProjectCard p={p} wide={i === 0} />
          </div>
        ))}
      </div>
      <h3 className="mb-6 mt-16 text-xl font-bold">
        <span className="text-pink">❯ </span>
        {t.titles.oss}
      </h3>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {oss.map((p) => (
          <ProjectCard key={p.slug} p={p} compact />
        ))}
      </div>
    </section>
  )
}

// ─── Clients ──────────────────────────────────────────────────────────────

export function Clients() {
  const t = useTerm()
  return (
    <section>
      <SectionTitle>{t.titles.clients}</SectionTitle>
      <ul className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {CLIENTS.map((c) => {
          const logo = c.logo && (
            <img
              src={c.logo}
              alt=""
              className={
                c.shape === 'tile'
                  ? 'size-12 rounded-md object-cover'
                  : `max-h-10 max-w-[70%] object-contain opacity-80 transition-opacity group-hover:opacity-100 ${
                      c.logo.endsWith('.svg') ? 'grayscale invert' : 'brightness-0 invert'
                    }`
              }
            />
          )
          const body = (
            <>
              <span className="flex h-14 w-full items-center justify-center">{logo}</span>
              <span className="text-[13px] text-dim">{c.name}</span>
            </>
          )
          const cls =
            'group flex h-32 flex-col items-center justify-center gap-3 rounded-lg border border-line bg-panel transition-colors hover:border-pink/60'
          return (
            <li key={c.name}>
              {c.url ? (
                <a href={c.url} target="_blank" rel="noreferrer" className={cls}>
                  {body}
                </a>
              ) : (
                <div className={cls}>{body}</div>
              )}
            </li>
          )
        })}
      </ul>
    </section>
  )
}

// ─── Stack ──────────────────────────────────────────────────────────────────

// Slugs simple-icons ; null = pas de logo officiel, on affiche un monogramme.
const ICONS: Record<string, string | null> = {
  UEFN: 'unrealengine',
  Roblox: 'roblox',
  'Stake Engine': null,
  's&box': null,
  Verse: 'epicgames',
  Luau: 'luau',
  'roblox-ts': null,
  TypeScript: 'typescript',
  React: 'react',
  'TanStack Start': 'tanstack',
  Svelte: 'svelte',
  Tailwind: 'tailwindcss',
  'Node.js': 'nodedotjs',
  Convex: 'convex',
  Stripe: 'stripe',
  Vercel: 'vercel',
  Rust: 'rust',
  Python: 'python',
  Tauri: 'tauri',
  'discord.js': 'discorddotjs',
  'Claude Code': 'claude',
  MCP: 'modelcontextprotocol',
  Remotion: null,
}

function TechIcon({ name }: { name: string }) {
  const slug = ICONS[name]
  const [failed, setFailed] = useState(false)
  if (!slug || failed)
    return (
      <span className="grid size-6 place-items-center rounded bg-pink/15 text-[11px] font-bold text-pink" aria-hidden>
        {name.replace(/[^A-Za-z]/g, '').slice(0, 2)}
      </span>
    )
  return (
    <img
      src={`https://cdn.simpleicons.org/${slug}/f5a3c7`}
      alt=""
      width={24}
      height={24}
      loading="lazy"
      onError={() => setFailed(true)}
      className="size-6"
    />
  )
}

export function Stack() {
  const t = useTerm()
  return (
    <section>
      <SectionTitle id="stack">{t.titles.stack}</SectionTitle>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {STACK.map(({ table, entries }) => (
          <div key={table}>
            <h3 className="mb-3 text-[13px] text-muted">[{table}]</h3>
            <ul className="flex flex-wrap gap-2">
              {entries
                .flatMap(([, values]) => values)
                .map((name) => (
                  <li key={name} className="flex items-center gap-2.5 rounded-lg border border-line bg-panel px-3 py-2">
                    <TechIcon name={name} />
                    <span>{name}</span>
                  </li>
                ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  )
}

// ─── Activité GitHub ──────────────────────────────────────────────────────

const HEAT = ['#1c1c24', '#4b3342', '#7c4f68', '#b7789b', '#f5a3c7']

export function Activity() {
  const t = useTerm()
  const profile = useGithubProfile()
  const events = useGithubActivity(60_000)
  return (
    <section>
      <SectionTitle
        id="activity"
        aside={<ExtLink href={ME.github} className="text-muted">github.com/simnJS</ExtLink>}
      >
        {t.titles.activity}
      </SectionTitle>

      {profile.status === 'ok' && (
        <div className="mb-8 rounded-lg border border-line bg-panel p-5">
          <div className="overflow-x-auto pb-1">
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
          <div className="mt-4 flex flex-wrap gap-x-8 gap-y-2">
            {(
              [
                [profile.data.totalContributions, 'contributions'],
                [profile.data.totalCommits, 'commits'],
                [profile.data.totalPRs, 'pull requests'],
                [`${profile.data.currentStreak}d`, 'streak'],
              ] as Array<[number | string, string]>
            ).map(([v, k]) => (
              <span key={k}>
                <span className="text-lg font-bold text-pink">{typeof v === 'number' ? v.toLocaleString('en') : v}</span>{' '}
                <span className="text-dim">{k}</span>
              </span>
            ))}
          </div>
        </div>
      )}

      {events.status === 'ok' && events.data.length > 0 && (
        <div className="rounded-lg border border-line bg-panel">
          <div className="flex h-9 items-center border-b border-line bg-chrome px-3 text-[12px] text-dim">
            tail -f ~/activity.log
          </div>
          <div className="p-4">
            {events.data.slice(0, 6).map((e) => (
              <div key={e.id} className="term-line">
                {eventLine(e, t).node}
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  )
}

// ─── À propos, contact, fin ─────────────────────────────────────────────────

export function About() {
  const t = useTerm()
  return (
    <section>
      <SectionTitle>{t.titles.about}</SectionTitle>
      <div className="max-w-[62ch] space-y-5 text-[1.05rem] leading-relaxed">
        {t.bio.map((p) => (
          <p key={p}>{p}</p>
        ))}
      </div>
    </section>
  )
}

export function Contact() {
  const t = useTerm()
  const [copied, setCopied] = useState(false)
  const button =
    'inline-flex items-center gap-2 rounded-md border border-line px-4 py-2.5 transition-colors hover:border-pink hover:text-pink'
  return (
    <section>
      <SectionTitle id="contact">{t.titles.contact}</SectionTitle>
      <p className="text-lg text-dim">{t.contact.title}</p>
      <a
        href={`mailto:${ME.email}`}
        className="mt-3 inline-block break-all text-[clamp(1.75rem,6vw,4rem)] font-extrabold tracking-[-0.03em] text-pink underline decoration-transparent decoration-2 underline-offset-8 transition-colors hover:decoration-pink"
      >
        {ME.email}
      </a>
      <div className="mt-8 flex flex-wrap gap-3">
        <a href={ME.github} target="_blank" rel="noreferrer" className={button}>
          <Github size={16} aria-hidden /> GitHub
        </a>
        <a href={ME.linkedin} target="_blank" rel="noreferrer" className={button}>
          <Linkedin size={16} aria-hidden /> LinkedIn
        </a>
        <button
          type="button"
          className={button}
          onClick={() =>
            navigator.clipboard?.writeText(ME.discord).then(() => {
              setCopied(true)
              setTimeout(() => setCopied(false), 1800)
            })
          }
        >
          <Mail size={16} aria-hidden /> {copied ? t.copied : `Discord: ${ME.discord}`}
        </button>
      </div>
    </section>
  )
}

export function Exit() {
  return (
    <footer className="mt-28 border-t border-line pt-6 text-[13px] text-muted">
      <p>[process exited with code 0 (0x00000000)]</p>
      <p>
        © {new Date().getFullYear()} {ME.fullName} ({ME.handle})
      </p>
    </footer>
  )
}
