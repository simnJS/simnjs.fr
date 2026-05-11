import { useEffect, useRef, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { useI18n } from './I18nProvider'
import { LOCALES, LOCALE_META, type Locale } from './translations'

export function LanguageSelector() {
  const { locale, setLocale, t } = useI18n()
  const [open, setOpen] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    function onPointerDown(event: PointerEvent) {
      if (!wrapperRef.current) return
      if (!wrapperRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    function onKey(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  const current = LOCALE_META[locale]

  function choose(next: Locale) {
    setLocale(next)
    setOpen(false)
  }

  return (
    <div ref={wrapperRef} className="relative">
      <button
        type="button"
        aria-label={t.selector.label}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-2 border-2 border-ink bg-bg px-3 py-2 font-mono text-xs uppercase tracking-wider shadow-[3px_3px_0_0_var(--color-ink)] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none"
      >
        <span aria-hidden>{current.flag}</span>
        <span>{current.label}</span>
        <ChevronDown
          size={14}
          strokeWidth={3}
          className={`transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <ul
          role="listbox"
          aria-label={t.selector.label}
          className="absolute right-0 z-50 mt-2 min-w-[8rem] border-2 border-ink bg-bg shadow-[4px_4px_0_0_var(--color-ink)]"
        >
          {LOCALES.map((code) => {
            const meta = LOCALE_META[code]
            const active = code === locale
            return (
              <li key={code}>
                <button
                  type="button"
                  role="option"
                  aria-selected={active}
                  onClick={() => choose(code)}
                  className={`flex w-full items-center gap-2 px-3 py-2 text-left font-mono text-xs uppercase tracking-wider transition-colors ${
                    active ? 'bg-yellow' : 'hover:bg-yellow/60'
                  }`}
                >
                  <span aria-hidden>{meta.flag}</span>
                  <span>{meta.label}</span>
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
