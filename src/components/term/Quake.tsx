import { useEffect, useRef, useState } from 'react'
import { SquareTerminal, X } from 'lucide-react'
import { useTerm } from '../../i18n/term'
import { QUAKE_EVENT } from './bits'
import { Fastfetch } from './Fastfetch'
import { PromptHeader, PromptLine } from './Prompt'
import { Shell } from './Shell'

// Le terminal en « quake mode », comme dans Windows Terminal : il descend du
// haut de l'écran avec ` et remonte avec Échap. Monté à la première ouverture,
// il garde ensuite son historique.

export function QuakeTerminal() {
  const t = useTerm()
  const [open, setOpen] = useState(false)
  const [ready, setReady] = useState(false)
  const panel = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onToggle = () => setOpen((o) => !o)
    const onKey = (e: KeyboardEvent) => {
      // La touche sous Échap : ` en QWERTY, ² en AZERTY (même code physique).
      const hotkey = e.code === 'Backquote' || e.key === '`' || e.key === '²'
      if (hotkey && !e.ctrlKey && !e.metaKey && !e.altKey) {
        const el = document.activeElement as HTMLElement | null
        const typing = el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.isContentEditable)
        if (typing && !panel.current?.contains(el)) return
        e.preventDefault()
        setOpen((o) => !o)
      } else if (e.key === 'Escape' && !e.defaultPrevented) {
        setOpen(false)
      }
    }
    window.addEventListener(QUAKE_EVENT, onToggle)
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener(QUAKE_EVENT, onToggle)
      window.removeEventListener('keydown', onKey)
    }
  }, [])

  useEffect(() => {
    if (open) {
      setReady(true)
      const id = requestAnimationFrame(() =>
        panel.current?.querySelector<HTMLInputElement>('input[aria-label="terminal"]')?.focus({ preventScroll: true }),
      )
      return () => cancelAnimationFrame(id)
    }
    if (panel.current?.contains(document.activeElement)) (document.activeElement as HTMLElement).blur()
  }, [open, ready])

  // Sur mobile, le clavier virtuel recouvre le bas de l'écran sans redimensionner
  // la page : le tiroir se cale sur la partie visible pour garder le prompt en vue.
  useEffect(() => {
    const vv = window.visualViewport
    const el = panel.current
    if (!open || !vv || !el) return
    const fit = () => {
      el.style.setProperty('--vv-top', `${vv.offsetTop}px`)
      el.style.setProperty('--vv-h', `${vv.height}px`)
      const focused = document.activeElement as HTMLElement | null
      if (focused && el.contains(focused)) focused.scrollIntoView({ block: 'nearest' })
    }
    fit()
    vv.addEventListener('resize', fit)
    vv.addEventListener('scroll', fit)
    return () => {
      vv.removeEventListener('resize', fit)
      vv.removeEventListener('scroll', fit)
      el.style.removeProperty('--vv-top')
      el.style.removeProperty('--vv-h')
    }
  }, [open])

  return (
    <>
      {open && <div className="fixed inset-0 z-40 bg-chrome/60" onClick={() => setOpen(false)} aria-hidden />}
      <div
        ref={panel}
        role="dialog"
        aria-label="terminal"
        inert={!open}
        className={`fixed inset-x-0 top-[var(--vv-top,0px)] z-50 mx-auto flex h-[min(78svh,var(--vv-h,78svh))] max-w-[1180px] flex-col border-x border-b border-line bg-bg shadow-[0_30px_80px_rgba(0,0,0,0.6)] transition-transform duration-200 ease-out motion-reduce:transition-none sm:rounded-b-xl ${
          open ? 'translate-y-0' : '-translate-y-[105%]'
        }`}
      >
        <div className="flex h-10 shrink-0 items-center justify-between border-b border-line bg-chrome px-3 text-[13px]">
          <span className="flex items-center gap-2">
            <SquareTerminal size={14} className="text-pink" aria-hidden />
            pwsh
          </span>
          <span className="hidden text-muted sm:pointer-fine:inline">{t.quake.hint}</span>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label={t.quake.close}
            className="rounded p-1 text-muted transition-colors hover:text-fg"
          >
            <X size={16} aria-hidden />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-[2ch] py-3">
          {ready && (
            <>
              <PromptHeader />
              <PromptLine>
                <span className="text-yellow">fastfetch</span>
              </PromptLine>
              <Fastfetch delay={150} />
              <Shell />
            </>
          )}
        </div>
      </div>
    </>
  )
}
