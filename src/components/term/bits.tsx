import { useEffect, useState, type ReactNode } from 'react'
import { ME } from '../../content/site'

// Petites briques partagées par le terminal.

/** Horloge qui avance d'elle-même ; null tant que le composant n'est pas monté. */
export function useNow(intervalMs: number): number | null {
  const [now, setNow] = useState<number | null>(null)
  useEffect(() => {
    setNow(Date.now())
    const id = setInterval(() => setNow(Date.now()), intervalMs)
    return () => clearInterval(id)
  }, [intervalMs])
  return now
}

export function lyonTime(ms: number, withSeconds = false): string {
  return new Intl.DateTimeFormat('en-GB', {
    timeZone: ME.timeZone,
    hour: '2-digit',
    minute: '2-digit',
    second: withSeconds ? '2-digit' : undefined,
  }).format(ms)
}

const SPINNER = '⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏'

/** Spinner braille, celui des CLI qui attendent le réseau. */
export function Spinner() {
  const [i, setI] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setI((n) => (n + 1) % SPINNER.length), 80)
    return () => clearInterval(id)
  }, [])
  return (
    <span className="text-pink" aria-hidden>
      {SPINNER[i]}
    </span>
  )
}

/** Le mini drapeau, aux couleurs pastel du thème. */
export function PrideFlag() {
  return (
    <span
      role="img"
      aria-label="pride flag"
      className="ml-[1ch] inline-block h-[0.8em] w-[2ch] rounded-[2px] align-[-0.05em]"
      style={{
        background:
          'linear-gradient(#f07a8c 0 16.66%, #f5b98a 0 33.33%, #f2d38a 0 50%, #9fd8a4 0 66.66%, #8fb4f5 0 83.33%, #c9a3f5 0)',
      }}
    />
  )
}

/** Une commande cliquable : elle s'écrit dans le shell et s'exécute. */
export function RunLink({
  cmd,
  children,
  className = 'text-blue',
}: {
  cmd: string
  children?: ReactNode
  className?: string
}) {
  return (
    <button
      type="button"
      onClick={() => runCommand(cmd)}
      className={`cursor-pointer underline decoration-transparent underline-offset-4 transition-colors hover:decoration-current ${className}`}
    >
      {children ?? cmd}
    </button>
  )
}

export const RUN_EVENT = 'simnjs:run'

export const QUAKE_EVENT = 'simnjs:quake'

export function toggleQuake() {
  window.dispatchEvent(new Event(QUAKE_EVENT))
}

export function runCommand(cmd: string) {
  window.dispatchEvent(new CustomEvent(RUN_EVENT, { detail: cmd }))
}

/** Lien externe, souligné au survol comme dans Windows Terminal (Ctrl+clic). */
export function ExtLink({
  href,
  children,
  className = 'text-blue',
}: {
  href: string
  children: ReactNode
  className?: string
}) {
  return (
    <a
      href={href}
      target={href.startsWith('mailto:') ? undefined : '_blank'}
      rel="noreferrer"
      className={`underline decoration-transparent underline-offset-4 transition-colors hover:decoration-current ${className}`}
    >
      {children}
    </a>
  )
}
