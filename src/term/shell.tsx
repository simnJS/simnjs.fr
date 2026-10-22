import type { ReactNode } from 'react'
import { CLIENTS } from '../content/clients'
import { ME, PROJECTS, STACK, type Project } from '../content/site'
import type { TermDict } from '../i18n/term'
import { LOCALES, type Locale } from '../i18n/translations'
import { getRobloxStats } from '../lib/roblox'
import type { GhEvent } from '../lib/github'
import { BOYKISSER } from './boykisser'
import { BOYKISSER_EVENT } from '../components/term/Boykisser'
import { Fastfetch } from '../components/term/Fastfetch'
import { ExtLink, RunLink, lyonTime } from '../components/term/bits'
import { loadActivity, loadSpotify } from '../components/term/live'

// Le moteur du shell : tokenizer, pipes, système de fichiers virtuel,
// complétion et commandes. Chaque commande rend des lignes avec leur texte
// brut, ce qui permet de les passer à grep, head ou wc.

export type Line = { text: string; node?: ReactNode }

const line = (text: string, node?: ReactNode): Line => ({ text, node })
const blank = line('')
const colored = (text: string, cls: string) => line(text, <span className={cls}>{text}</span>)

export type ShellCtx = {
  t: TermDict
  cwd: string[]
  setCwd: (cwd: string[]) => void
  setLocale: (l: Locale) => void
  history: string[]
}

type Io = { stdin: Line[] | null; piped: boolean }

type Command = {
  run: (args: string[], ctx: ShellCtx, io: Io) => Line[] | Promise<Line[]>
  complete?: (args: string[], ctx: ShellCtx) => string[]
  // Absente de help : les petites surprises se trouvent en tapant.
  hidden?: boolean
}

// ─── Tokenizer ──────────────────────────────────────────────────────────────

export type Token = { text: string; start: number; end: number; quoted: boolean }

export function tokenize(src: string): Token[] {
  const out: Token[] = []
  let cur = ''
  let start = -1
  let quote: string | null = null
  let quoted = false
  const push = (end: number) => {
    if (start >= 0) out.push({ text: cur, start, end, quoted })
    cur = ''
    start = -1
    quoted = false
  }
  for (let i = 0; i < src.length; i++) {
    const ch = src[i]
    if (quote) {
      if (ch === quote) quote = null
      else cur += ch
      continue
    }
    if (ch === '"' || ch === "'") {
      if (start < 0) start = i
      quote = ch
      quoted = true
      continue
    }
    if (ch === '|') {
      push(i)
      out.push({ text: '|', start: i, end: i + 1, quoted: false })
      continue
    }
    if (/\s/.test(ch)) {
      push(i)
      continue
    }
    if (start < 0) start = i
    cur += ch
  }
  push(src.length)
  return out
}

function stages(src: string): string[][] {
  const result: string[][] = [[]]
  for (const tok of tokenize(src)) {
    if (tok.text === '|' && !tok.quoted) result.push([])
    else result[result.length - 1].push(tok.text)
  }
  return result
}

// ─── Système de fichiers virtuel ──────────────────────────────────────────

const HOME_FILES = ['about.md', 'clients.txt', 'contact.txt', 'stack.toml']

export function displayPath(cwd: string[]): string {
  return ['~\\simnJS', ...cwd].join('\\')
}

function resolve(cwd: string[], arg: string): string[] {
  let p = arg.replace(/\\/g, '/')
  let base = [...cwd]
  if (p.startsWith('~')) {
    base = []
    p = p.replace(/^~\/?/, '').replace(/^simnJS\/?/i, '')
  }
  for (const seg of p.split('/')) {
    if (!seg || seg === '.') continue
    if (seg === '..') base.pop()
    else base.push(seg)
  }
  return base
}

const isDir = (p: string[]) => p.length === 0 || (p.length === 1 && p[0] === 'projects')

function projectOf(p: string[]): Project | undefined {
  if (p.length !== 2 || p[0] !== 'projects') return undefined
  return PROJECTS.find((x) => `${x.slug}.md` === p[1])
}

const isFile = (p: string[]) => (p.length === 1 && HOME_FILES.includes(p[0])) || !!projectOf(p)

function entries(dir: string[]): Array<{ name: string; dir: boolean }> {
  if (dir.length === 0) return [{ name: 'projects', dir: true }, ...HOME_FILES.map((name) => ({ name, dir: false }))]
  return PROJECTS.map((p) => ({ name: `${p.slug}.md`, dir: false }))
}

function completePath(cwd: string[], partial: string, filesToo: boolean): string[] {
  const slash = partial.replace(/\\/g, '/').lastIndexOf('/')
  const head = slash >= 0 ? partial.slice(0, slash + 1) : ''
  const dir = resolve(cwd, head || '.')
  if (!isDir(dir)) return []
  const tail = partial.slice(head.length).toLowerCase()
  return entries(dir)
    .filter((e) => (filesToo || e.dir) && e.name.toLowerCase().startsWith(tail))
    .map((e) => head + e.name + (e.dir ? '/' : ''))
}

// ─── Contenu des fichiers (partagé avec les sections de la page) ─────────────

export function aboutLines(t: TermDict): Line[] {
  return [colored('# about', 'text-pink'), blank, ...t.bio.flatMap((p, i) => (i ? [blank, line(p)] : [line(p)]))]
}

export function stackLines(t: TermDict): Line[] {
  const out: Line[] = [colored(`# ${t.stack}`, 'text-muted')]
  for (const { table, entries } of STACK) {
    out.push(blank, colored(`[${table}]`, 'text-mauve'))
    for (const [key, values] of entries) {
      const text = `${key} = [${values.map((v) => `"${v}"`).join(', ')}]`
      out.push(
        line(
          text,
          <>
            <span className="text-blue">{key}</span> = [
            {values.map((v, i) => (
              <span key={v}>
                {i > 0 && ', '}
                <span className="text-green">"{v}"</span>
              </span>
            ))}
            ]
          </>,
        ),
      )
    }
  }
  return out
}

export function clientLines(t: TermDict): Line[] {
  return [
    colored(`# ${t.clients}`, 'text-muted'),
    blank,
    ...CLIENTS.map((c) =>
      line(c.name, c.url ? <ExtLink href={c.url} className="text-fg">{c.name}</ExtLink> : c.name),
    ),
  ]
}

const CONTACTS: Array<[string, string, string]> = [
  ['mail', ME.email, `mailto:${ME.email}`],
  ['github', 'github.com/simnJS', ME.github],
  ['linkedin', 'linkedin.com/in/simon-gay', ME.linkedin],
  ['web', ME.site, `https://${ME.site}`],
]

export function contactLines(): Line[] {
  return [
    ...CONTACTS.map(([k, label, href]) =>
      line(`${k} ${label}`, <><span className="inline-block w-[10ch] text-pink">{k}</span><ExtLink href={href}>{label}</ExtLink></>),
    ),
    line(`discord ${ME.discord}`, <><span className="inline-block w-[10ch] text-pink">discord</span>{ME.discord}</>),
  ]
}

function projectLines(p: Project, t: TermDict): Line[] {
  const meta: Array<[string, string]> = [
    ['year', String(p.year)],
    ['tags', p.tags.join(', ')],
    ['stack', p.stack.join(', ')],
  ]
  const links: Line[] = []
  if (p.caseStudy)
    links.push(line(`case study /work/${p.caseStudy}`, <a href={`/work/${p.caseStudy}`} className="text-blue underline decoration-transparent underline-offset-4 hover:decoration-current">{t.projects.caseStudy}</a>))
  links.push(line(p.href, <ExtLink href={p.href}>{p.href.replace(/^https?:\/\//, '').replace(/\/$/, '')}</ExtLink>))
  if (p.repo) links.push(line(`source ${p.repo}`, <ExtLink href={`https://github.com/${p.repo}`}>github.com/{p.repo}</ExtLink>))
  return [
    colored(`# ${p.title}`, 'text-pink'),
    blank,
    ...meta.map(([k, v]) => line(`${k} ${v}`, <><span className="inline-block w-[8ch] text-dim">{k}</span>{v}</>)),
    blank,
    line(t.projects.desc[p.slug]),
    blank,
    ...links,
  ]
}

function readFile(path: string[], t: TermDict): Line[] {
  const p = projectOf(path)
  if (p) return projectLines(p, t)
  switch (path[0]) {
    case 'about.md':
      return aboutLines(t)
    case 'stack.toml':
      return stackLines(t)
    case 'clients.txt':
      return clientLines(t)
    default:
      return contactLines()
  }
}

// ─── Commandes ───────────────────────────────────────────────────────────────

const err = (text: string) => colored(text, 'text-red')

const EVENT_COLORS: Record<string, string> = {
  push: 'text-green',
  pr: 'text-mauve',
  release: 'text-yellow',
  issue: 'text-red',
  create: 'text-blue',
  fork: 'text-cyan',
  public: 'text-pink',
}

export function eventStamp(iso: string): string {
  const d = Date.parse(iso)
  const day = new Intl.DateTimeFormat('en-CA', { timeZone: ME.timeZone, month: '2-digit', day: '2-digit' }).format(d)
  return `${day} ${lyonTime(d)}`
}

export function eventLine(e: GhEvent, t: TermDict): Line {
  const repo = e.private ? 'private' : e.repo
  const msg = e.private ? t.activity.hidden : e.message
  const count = e.count && e.count > 1 ? ` ×${e.count}` : ''
  const text = `${eventStamp(e.createdAt)} ${e.type} ${repo} ${msg}${count}`
  return line(
    text,
    <span className="grid grid-cols-[12ch_8ch_1fr] gap-x-[1ch] max-sm:grid-cols-[6ch_1fr] max-sm:[&>*:first-child]:hidden">
      <span className="text-muted">{eventStamp(e.createdAt)}</span>
      <span className={EVENT_COLORS[e.type] ?? 'text-fg'}>{e.type}{count}</span>
      <span className="min-w-0 truncate">
        {e.private ? <span className="text-muted">{repo}</span> : <ExtLink href={e.url} className="text-blue">{repo}</ExtLink>}
        <span className={e.private ? 'text-muted' : 'text-dim'}> {msg}</span>
      </span>
    </span>,
  )
}

function bar(progress: number, width = 24): string {
  const filled = Math.round(Math.max(0, Math.min(1, progress)) * width)
  return '━'.repeat(filled) + '─'.repeat(width - filled)
}

function openUrl(url: string) {
  window.open(url, url.startsWith('mailto:') ? '_self' : '_blank', 'noopener')
}

function findProject(name: string): Project | undefined {
  const q = name.toLowerCase().replace(/\.md$/, '').replace(/^.*[\\/]/, '')
  return PROJECTS.find((p) => p.slug === q) ?? PROJECTS.find((p) => p.slug.startsWith(q) || p.title.toLowerCase().startsWith(q))
}

const OPEN_TARGETS: Record<string, string> = {
  github: ME.github,
  linkedin: ME.linkedin,
  mail: `mailto:${ME.email}`,
}

export const COMMANDS: Record<string, Command> = {
  help: {
    run: (_a, { t }) => [
      colored(t.help.title, 'text-dim'),
      blank,
      ...Object.keys(t.help.cmds).map((name) =>
        line(`${name} ${t.help.cmds[name]}`, (
          <span className="grid grid-cols-[12ch_1fr] items-start gap-x-[1ch]">
            <RunLink cmd={name} className={name === 'boykisser' ? 'text-pink text-left' : 'text-yellow text-left'} />
            <span className="text-dim">{t.help.cmds[name]}</span>
          </span>
        )),
      ),
      blank,
      colored(t.help.pipes, 'text-muted'),
    ],
  },

  whoami: { run: (_a, { t }) => [line(t.whoami)] },

  fastfetch: { run: () => [line('fastfetch', <Fastfetch delay={150} />)] },

  ls: {
    run: (args, ctx, io) => {
      const long = args.some((a) => /^-\w*l/.test(a))
      const target = args.find((a) => !a.startsWith('-')) ?? '.'
      const path = resolve(ctx.cwd, target)
      if (isFile(path)) return [line(path[path.length - 1])]
      if (!isDir(path)) return [err(ctx.t.errors.noDir(target))]
      const list = entries(path)
      const rel = (name: string) => [...path, name].join('/')
      const item = (e: { name: string; dir: boolean }) => (
        <RunLink
          key={e.name}
          cmd={e.dir ? `cd ${rel(e.name)}` : `cat ${rel(e.name)}`}
          className={e.dir ? 'text-blue font-bold' : 'text-fg'}
        >
          {e.name}
          {e.dir ? '/' : ''}
        </RunLink>
      )
      if (long || io.piped)
        return list.map((e) => {
          const project = path.length ? PROJECTS.find((p) => `${p.slug}.md` === e.name) : undefined
          const year = String(project?.year ?? 2026)
          const perms = e.dir ? 'drwxr-xr-x' : '-rw-r--r--'
          return line(
            long ? `${perms} simnjs ${year} ${e.name}` : e.name,
            long ? <><span className="text-muted">{perms} simnjs {year} </span>{item(e)}</> : item(e),
          )
        })
      return [line(list.map((e) => e.name).join('  '), <span className="flex flex-wrap gap-x-[2ch]">{list.map(item)}</span>)]
    },
    complete: (args, ctx) => completePath(ctx.cwd, args[args.length - 1] ?? '', true),
  },

  cd: {
    run: (args, ctx) => {
      const path = resolve(ctx.cwd, args[0] ?? '~')
      if (!isDir(path)) return [err(ctx.t.errors.noDir(args[0]))]
      ctx.setCwd(path)
      return []
    },
    complete: (args, ctx) => completePath(ctx.cwd, args[args.length - 1] ?? '', false),
  },

  cat: {
    run: (args, ctx, io) => {
      if (!args.length) return io.stdin ?? [err(ctx.t.errors.usage('cat <file>'))]
      return args.flatMap((a) => {
        const path = resolve(ctx.cwd, a)
        if (isDir(path)) return [err(ctx.t.errors.isDir(a))]
        if (!isFile(path)) return [err(ctx.t.errors.noFile(a))]
        return readFile(path, ctx.t)
      })
    },
    complete: (args, ctx) => completePath(ctx.cwd, args[args.length - 1] ?? '', true),
  },

  open: {
    run: (args, ctx) => {
      const name = args[0]
      if (!name) return [err(ctx.t.errors.usage('open <project>'))]
      const url = OPEN_TARGETS[name.toLowerCase()] ?? findProject(name)?.href
      if (!url) return [err(ctx.t.errors.unknownProject(name))]
      openUrl(url)
      return [colored(ctx.t.opening(url.replace(/^mailto:/, '')), 'text-dim')]
    },
    complete: (args) => {
      const q = (args[args.length - 1] ?? '').toLowerCase()
      return [...PROJECTS.map((p) => p.slug), ...Object.keys(OPEN_TARGETS)].filter((s) => s.startsWith(q))
    },
  },

  projects: {
    run: (_a, { t }) =>
      PROJECTS.map((p) =>
        line(`${p.slug} ${p.title} ${p.tags.join(' ')} ${t.projects.desc[p.slug]}`, (
          <span className="grid grid-cols-[17ch_1fr] items-start gap-x-[1ch] max-sm:grid-cols-1">
            <RunLink cmd={`cat projects/${p.slug}.md`} className="text-left font-bold text-blue">
              {p.slug}
            </RunLink>
            <span className="text-dim">
              {t.projects.desc[p.slug]} <span className="text-mauve">{p.tags.map((tag) => `#${tag}`).join(' ')}</span>
            </span>
          </span>
        )),
      ),
  },

  activity: {
    run: async (args, { t }) => {
      const events = await loadActivity()
      if (!events) return [err(t.errors.network)]
      if (!events.length) return [colored(t.activity.empty, 'text-dim')]
      const n = Number(args[0]) || 8
      return events.slice(0, n).map((e) => eventLine(e, t))
    },
  },

  spotify: {
    run: async (_a, { t }) => {
      const track = await loadSpotify()
      if (!track) return [colored(t.spotify.quiet, 'text-dim')]
      const out: Line[] = [
        colored(track.isPlaying ? `♪ ${t.spotify.playing}` : t.spotify.last, 'text-pink'),
        line(`${track.artists} - ${track.title}`, <ExtLink href={track.url} className="text-fg">{track.artists} - {track.title}</ExtLink>),
      ]
      if (track.isPlaying && track.progressMs != null && track.durationMs) {
        const fmt = (ms: number) => `${Math.floor(ms / 60000)}:${String(Math.floor(ms / 1000) % 60).padStart(2, '0')}`
        const text = `${bar(track.progressMs / track.durationMs)} ${fmt(track.progressMs)} / ${fmt(track.durationMs)}`
        out.push(colored(text, 'text-dim'))
      }
      return out
    },
  },

  roblox: {
    run: async (_a, { t }) => {
      const stats = await getRobloxStats().catch(() => null)
      if (!stats) return [err(t.errors.network)]
      const num = (n: number) => n.toLocaleString('en')
      return [
        colored(t.roblox.title, 'text-pink'),
        colored(`${num(stats.totalPlaying)} ${t.roblox.playing}, ${num(stats.totalVisits)} ${t.roblox.visits}, ${num(stats.members)} ${t.roblox.members}`, 'text-dim'),
        blank,
        ...stats.games.map((g) =>
          line(`${g.name} ${g.playing} ${g.visits}`, (
            <span className="grid grid-cols-[minmax(0,32ch)_10ch_1fr] gap-x-[1ch] max-sm:grid-cols-[1fr_8ch]">
              <ExtLink href={g.url} className="truncate text-blue">{g.name}</ExtLink>
              <span className="text-green">{num(g.playing)}</span>
              <span className="text-dim max-sm:hidden">{num(g.visits)} {t.roblox.visits}</span>
            </span>
          )),
        ),
      ]
    },
  },

  contact: { run: () => contactLines() },

  lang: {
    run: (args, ctx) => {
      const l = args[0] as Locale
      if (!LOCALES.includes(l)) return [err(ctx.t.errors.usage(`lang ${LOCALES.join('|')}`))]
      ctx.setLocale(l)
      return []
    },
    complete: (args) => LOCALES.filter((l) => l.startsWith(args[args.length - 1] ?? '')),
  },

  history: {
    run: (_a, { history }) =>
      history.map((h, i) => line(`${i + 1} ${h}`, <><span className="inline-block w-[5ch] text-right text-muted">{i + 1}</span>{'  '}{h}</>)),
  },

  clear: { run: () => [] },

  boykisser: {
    run: () => {
      window.dispatchEvent(new CustomEvent(BOYKISSER_EVENT, { detail: 'kiss' }))
      return [...BOYKISSER.map((l) => colored(l, 'text-pink leading-[1.15]')), blank, colored(':3', 'text-pink')]
    },
  },

  // ─── Outils de pipe ───
  grep: {
    run: (args, ctx, io) => {
      const flags = args.filter((a) => a.startsWith('-'))
      const pattern = args.find((a) => !a.startsWith('-'))
      if (!pattern) return [err(ctx.t.errors.usage('… | grep <pattern>'))]
      const invert = flags.some((f) => f.includes('v'))
      const q = pattern.toLowerCase()
      return (io.stdin ?? []).filter((l) => l.text.toLowerCase().includes(q) !== invert)
    },
  },
  head: {
    run: (args, _c, io) => {
      const n = Number(args.find((a) => /^\d+$/.test(a)) ?? args.find((a) => /^-\d+$/.test(a))?.slice(1) ?? 10)
      return (io.stdin ?? []).slice(0, n)
    },
  },
  wc: { run: (_a, _c, io) => [line(String((io.stdin ?? []).filter((l) => l.text !== '').length))] },
  echo: { run: (args, _c, io) => io.stdin ?? [line(args.join(' '))] },
  date: {
    run: () => {
      const d = new Intl.DateTimeFormat('en-GB', { timeZone: ME.timeZone, dateStyle: 'full', timeStyle: 'long' }).format(Date.now())
      return [line(d)]
    },
  },

  // ─── Surprises ───
  sudo: { hidden: true, run: (_a, { t }) => [err(t.sudo)] },
  rm: { hidden: true, run: () => [colored('rm: nice try :3', 'text-pink')] },
  exit: { hidden: true, run: () => [colored('exit: nice try, you are staying :3', 'text-pink')] },
  vim: { hidden: true, run: () => [colored('vim: you would never get out anyway. try cat instead.', 'text-dim')] },
}

// Alias usuels.
COMMANDS.neofetch = { ...COMMANDS.fastfetch, hidden: true }
COMMANDS.dir = { ...COMMANDS.ls, hidden: true }
COMMANDS.cls = { ...COMMANDS.clear, hidden: true }
COMMANDS.kiss = { ...COMMANDS.boykisser, hidden: true }
COMMANDS.mail = {
  hidden: true,
  run: () => {
    openUrl(`mailto:${ME.email}`)
    return [colored(ME.email, 'text-dim')]
  },
}

export const COMMAND_NAMES = Object.keys(COMMANDS)
  .filter((n) => !COMMANDS[n].hidden)
  .sort()

// ─── Exécution et complétion ─────────────────────────────────────────────────

export async function execute(src: string, ctx: ShellCtx): Promise<Line[]> {
  let stdin: Line[] | null = null
  const list = stages(src).filter((s) => s.length)
  for (let k = 0; k < list.length; k++) {
    const [name, ...args] = list[k]
    const cmd = COMMANDS[name.toLowerCase()]
    if (!cmd) return [err(ctx.t.errors.notFound(name))]
    stdin = await cmd.run(args, ctx, { stdin, piped: k < list.length - 1 })
  }
  return stdin ?? []
}

/** Candidats pour le dernier mot de `input` (le curseur est en fin de ligne). */
export function complete(input: string, ctx: ShellCtx): { start: number; items: string[] } {
  const tokens = tokenize(input)
  const trailing = /\s$/.test(input) || input === ''
  const pipeAt = tokens.map((t) => t.text).lastIndexOf('|')
  const stage = tokens.slice(pipeAt + 1)
  const current = trailing ? null : stage[stage.length - 1]
  const start = current ? current.start : input.length
  const words = stage.map((t) => t.text)
  if (stage.length === 0 || (stage.length === 1 && current)) {
    const q = (current?.text ?? '').toLowerCase()
    return { start, items: COMMAND_NAMES.filter((n) => n.startsWith(q)) }
  }
  const cmd = COMMANDS[words[0].toLowerCase()]
  const args = current ? words.slice(1) : [...words.slice(1), '']
  return { start, items: cmd?.complete?.(args, ctx) ?? [] }
}

/** Suggestion grisée façon PSReadLine : l'historique d'abord, puis les commandes. */
export function predict(input: string, history: string[]): string {
  if (!input.trim()) return ''
  for (let i = history.length - 1; i >= 0; i--) {
    if (history[i].startsWith(input) && history[i] !== input) return history[i].slice(input.length)
  }
  if (!/\s/.test(input)) {
    const hit = COMMAND_NAMES.find((n) => n.startsWith(input) && n !== input)
    if (hit) return hit.slice(input.length)
  }
  return ''
}

/** Coloration à la PSReadLine : commande en jaune, options et pipes atténués, chaînes en cyan. */
export function highlight(input: string): Array<{ text: string; cls: string }> {
  const out: Array<{ text: string; cls: string }> = []
  let pos = 0
  let expectCommand = true
  for (const tok of tokenize(input)) {
    if (tok.start > pos) out.push({ text: input.slice(pos, tok.start), cls: '' })
    const raw = input.slice(tok.start, tok.end)
    let cls = 'text-fg'
    if (tok.text === '|' && !tok.quoted) {
      cls = 'text-muted'
      expectCommand = true
    } else if (expectCommand) {
      cls = COMMANDS[tok.text.toLowerCase()] ? 'text-yellow' : 'text-red'
      expectCommand = false
    } else if (tok.quoted) cls = 'text-cyan'
    else if (tok.text.startsWith('-')) cls = 'text-muted'
    out.push({ text: raw, cls })
    pos = tok.end
  }
  if (pos < input.length) out.push({ text: input.slice(pos), cls: '' })
  return out
}
