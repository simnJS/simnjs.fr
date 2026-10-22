import { useEffect, useState, type ReactNode } from 'react'
import {
  Activity,
  FolderGit2,
  Layers,
  Mail,
  Minus,
  Square,
  SquareTerminal,
  X,
  type LucideIcon,
} from 'lucide-react'
import { useI18n } from '../../i18n/I18nProvider'
import { LOCALES } from '../../i18n/translations'
import { toggleQuake } from './bits'

// La fenêtre Windows Terminal. Ses onglets servent de navigation et suivent
// le défilement ; le sélecteur de langue tient dans la barre.

export const TABS: Array<{ id: string; label: string; icon: LucideIcon }> = [
  { id: 'top', label: 'simnJS', icon: SquareTerminal },
  { id: 'projects', label: 'projects', icon: FolderGit2 },
  { id: 'stack', label: 'stack', icon: Layers },
  { id: 'activity', label: 'activity', icon: Activity },
  { id: 'contact', label: 'contact', icon: Mail },
]

// L'onglet actif est la dernière section dont le titre a passé le tiers haut
// de l'écran ; tout en bas de page, c'est la dernière.
function useActiveTab(): string {
  const [active, setActive] = useState('top')
  useEffect(() => {
    let raf = 0
    const update = () => {
      raf = 0
      let current = TABS[0].id
      for (const { id } of TABS) {
        const el = document.getElementById(id)
        if (el && el.getBoundingClientRect().top <= window.innerHeight * 0.35) current = id
      }
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) current = TABS[TABS.length - 1].id
      setActive(current)
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])
  return active
}

function go(id: string) {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (id === 'top') window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' })
  else document.getElementById(id)?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' })
}

export function Window({
  children,
  tabs = true,
  title = 'simnJS',
}: {
  children: ReactNode
  tabs?: boolean
  // Titre de l'onglet unique quand la page n'a pas de navigation par sections.
  title?: string
}) {
  const active = useActiveTab()
  const { locale, setLocale } = useI18n()
  return (
    <div className="mx-auto max-w-[1180px] sm:px-4 sm:py-6">
      <div className="border-line bg-bg sm:rounded-xl sm:border">
        <header className="sticky top-0 z-30 flex h-11 items-end gap-1 border-b border-line bg-chrome/95 pl-2 pr-1 backdrop-blur sm:rounded-t-xl">
          <nav aria-label="sections" className="flex min-w-0 flex-1 items-end gap-1 overflow-x-auto">
            {(tabs ? TABS : TABS.slice(0, 1)).map(({ id, label, icon: Icon }) => {
              const on = active === id || !tabs
              return (
                <a
                  key={id}
                  href={tabs ? `#${id}` : '/'}
                  onClick={(e) => {
                    if (!tabs) return
                    e.preventDefault()
                    go(id)
                  }}
                  aria-current={on ? 'true' : undefined}
                  className={
                    'flex h-9 shrink-0 items-center gap-2 rounded-t-lg px-3 text-[13px] transition-colors ' +
                    (on ? 'bg-bg text-fg' : 'text-dim hover:bg-panel hover:text-fg')
                  }
                >
                  <Icon size={14} strokeWidth={2} className={on ? 'text-pink' : ''} aria-hidden />
                  <span className={on ? '' : 'hidden md:inline'}>{tabs ? label : title}</span>
                </a>
              )
            })}
          </nav>
          <button
            type="button"
            onClick={toggleQuake}
            className="mb-1.5 flex h-7 shrink-0 items-center gap-1.5 rounded-md border border-line px-2 text-[12px] text-dim transition-colors hover:border-pink hover:text-pink"
          >
            <SquareTerminal size={13} aria-hidden />
            terminal
            <kbd className="hidden font-mono text-muted sm:inline">`</kbd>
          </button>
          <div className="flex h-9 items-center gap-1 pl-2 text-[13px]" role="group" aria-label="language">
            {LOCALES.map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => setLocale(l)}
                aria-pressed={locale === l}
                className={
                  'rounded px-1.5 py-0.5 transition-colors ' +
                  (locale === l ? 'text-pink' : 'text-muted hover:text-fg')
                }
              >
                {l}
              </button>
            ))}
          </div>
          <div className="hidden h-9 items-center gap-6 px-4 text-muted lg:flex" aria-hidden>
            <Minus size={14} strokeWidth={1.5} />
            <Square size={11} strokeWidth={1.5} />
            <X size={15} strokeWidth={1.5} />
          </div>
        </header>
        <div className="px-5 pb-10 pt-2 sm:px-10">{children}</div>
      </div>
    </div>
  )
}
