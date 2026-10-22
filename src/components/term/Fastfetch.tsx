import type { CSSProperties, ReactNode } from 'react'
import {
  AppWindow,
  Boxes,
  Clock,
  Code,
  Gamepad2,
  GitCommitHorizontal,
  Globe,
  Mail,
  MapPin,
  Music,
  Play,
  SquareTerminal,
  type LucideIcon,
} from 'lucide-react'
import { ME, PALETTE } from '../../content/site'
import { useTerm, type TermDict } from '../../i18n/term'
import { Boykisser } from './Boykisser'
import { ExtLink, PrideFlag, Spinner, useNow } from './bits'
import { useGithubProfile, useSpotify } from './live'

// La sortie de `fastfetch`, avec la config de simnJS : logo à gauche,
// modules clé/valeur à droite, clés en rose et titre en bleu.

const SINCE = Date.parse(ME.since)

function uptime(t: TermDict, now: number): string {
  const s = Math.max(0, Math.floor((now - SINCE) / 1000))
  const years = Math.floor(s / (365.25 * 86400))
  const days = Math.floor((s - years * 365.25 * 86400) / 86400)
  const rest = s % 86400
  const clock = [rest / 3600, (rest % 3600) / 60, rest % 60]
    .map((v) => String(Math.floor(v)).padStart(2, '0'))
    .join(':')
  return t.ff.uptime(years, days, clock)
}

export function Fastfetch({
  print = true,
  delay = 900,
  heading = false,
}: {
  // `print` : la sortie s'imprime ligne par ligne (premier affichage).
  print?: boolean
  delay?: number
  // Le fastfetch du hero porte le h1 de la page.
  heading?: boolean
}) {
  const t = useTerm()
  const now = useNow(1000)
  const profile = useGithubProfile()
  const track = useSpotify(30_000)

  let i = 0
  const row = (node: ReactNode, key: string) => {
    const style = { '--i': i++, '--print-delay': `${delay}ms` } as CSSProperties
    return (
      <div key={key} className={`term-line ${print ? 'printed' : ''}`} style={style}>
        {node}
      </div>
    )
  }
  const field = (Icon: LucideIcon, key: string, value: ReactNode) =>
    row(
      <span className="grid grid-cols-[13ch_1fr]">
        <span className="text-pink">
          <Icon size={13} strokeWidth={2.2} className="mr-[1ch] inline align-[-0.1em]" aria-hidden />
          {key}
        </span>
        <span>{value}</span>
      </span>,
      key,
    )
  const gap = () => row('', `gap-${i}`)

  const Title = heading ? 'h1' : 'div'
  const lines: ReactNode[] = [
    row(
      <Title className="font-normal">
        <span className="text-blue">{ME.handle}</span>@<span className="text-blue">{ME.host}</span>
        <span className="sr-only">, {t.ff.os}</span>
      </Title>,
      'title',
    ),
    row('-'.repeat(ME.handle.length + ME.host.length + 1), 'sep'),
    field(AppWindow, 'os', t.ff.os),
    field(
      MapPin,
      'host',
      <>
        {t.ff.host}
        <PrideFlag />
      </>,
    ),
    field(Clock, 'uptime', <span suppressHydrationWarning>{uptime(t, now ?? Date.now())}</span>),
    gap(),
    field(Gamepad2, 'studio', t.ff.studio),
    field(Boxes, 'engines', 'UEFN, Roblox, Stake Engine, s&box'),
    field(Code, 'langs', 'Verse, TypeScript, Rust, Luau'),
    field(SquareTerminal, 'shell', t.ff.shell),
    gap(),
    field(Play, 'plays', t.ff.plays),
    field(
      GitCommitHorizontal,
      'commits',
      profile.status === 'ok' ? (
        t.ff.commits(profile.data.totalCommits, profile.data.currentStreak)
      ) : profile.status === 'loading' ? (
        <span className="text-dim">
          <Spinner /> {t.ff.loading}
        </span>
      ) : (
        <ExtLink href={ME.github}>github.com/simnJS</ExtLink>
      ),
    ),
    track &&
      field(
        Music,
        'media',
        <ExtLink href={track.url} className="text-fg">
          {track.artists} - {track.title}
        </ExtLink>,
      ),
    gap(),
    field(Globe, 'web', <ExtLink href={`https://${ME.site}`}>{ME.site}</ExtLink>),
    field(Mail, 'mail', <ExtLink href={`mailto:${ME.email}`}>{ME.email}</ExtLink>),
    gap(),
    row(
      <span className="flex gap-[1ch]" aria-hidden>
        {PALETTE.map((c) => (
          <span key={c} className="inline-block size-[0.75em] rounded-full align-middle" style={{ background: c }} />
        ))}
      </span>,
      'colors',
    ),
  ]

  return (
    <div className="grid gap-x-[3ch] gap-y-4 py-[1.6em] md:grid-cols-[auto_1fr]">
      <div className="pl-[2ch]">
        <Boykisser delay={print ? delay : 0} className="mt-[0.4em]" />
        <p
          className={`term-line mt-3 italic text-pink ${print ? 'printed' : ''}`}
          style={{ '--i': 18, '--print-delay': `${delay}ms` } as CSSProperties}
        >
          {'  '}you like kissing boys, don't you? :3
        </p>
      </div>
      <div className="min-w-0">{lines}</div>
    </div>
  )
}
