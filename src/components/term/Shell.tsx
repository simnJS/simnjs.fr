import { useCallback, useEffect, useMemo, useRef, useState, type KeyboardEvent, type ReactNode } from 'react'
import { useI18n } from '../../i18n/I18nProvider'
import { useTerm } from '../../i18n/term'
import {
  complete,
  displayPath,
  execute,
  highlight,
  predict,
  type Line,
  type ShellCtx,
} from '../../term/shell'
import { PromptHeader } from './Prompt'
import { RUN_EVENT, RunLink, Spinner } from './bits'

// Le shell interactif, réglé comme le PowerShell de simnJS : prédictions
// grisées tirées de l'historique, Tab qui ouvre un menu, ↑↓ qui cherchent
// par préfixe, et la commande colorée pendant la frappe.

type Entry = { id: number; cwd: string[]; cmd: string; lines: Line[] | null }
type Menu = { start: number; items: string[]; index: number }

const HISTORY_KEY = 'simnjs.history'
const SUGGESTIONS = ['help', 'projects', 'activity', 'spotify', 'contact', 'boykisser']

function readHistory(): string[] {
  try {
    const raw = JSON.parse(window.localStorage.getItem(HISTORY_KEY) ?? '[]')
    return Array.isArray(raw) ? raw.filter((x) => typeof x === 'string').slice(-100) : []
  } catch {
    return []
  }
}

function writeHistory(h: string[]) {
  try {
    window.localStorage.setItem(HISTORY_KEY, JSON.stringify(h.slice(-100)))
  } catch {
    // stockage indisponible (navigation privée) : l'historique vit en mémoire
  }
}

function Highlighted({ text, caret, ghost }: { text: string; caret?: number; ghost?: string }) {
  const parts = highlight(text)
  const out: ReactNode[] = []
  let pos = 0
  parts.forEach((p, i) => {
    const end = pos + p.text.length
    if (caret !== undefined && caret >= pos && caret < end) {
      out.push(<span key={`${i}a`} className={p.cls}>{p.text.slice(0, caret - pos)}</span>)
      out.push(<Caret key="caret" />)
      out.push(<span key={`${i}b`} className={p.cls}>{p.text.slice(caret - pos)}</span>)
    } else out.push(<span key={i} className={p.cls}>{p.text}</span>)
    pos = end
  })
  if (caret !== undefined && caret >= text.length) out.push(<Caret key="caret" />)
  if (ghost) out.push(<span key="ghost" className="text-muted">{ghost}</span>)
  return <>{out}</>
}

function Caret() {
  return <span className="caret -mr-[2px] inline-block h-[1.15em] w-[2px] translate-y-[0.2em] bg-pink" aria-hidden />
}

export function Shell() {
  const t = useTerm()
  const { setLocale } = useI18n()
  const [entries, setEntries] = useState<Entry[]>([])
  const [input, setInput] = useState('')
  const [caret, setCaret] = useState(0)
  const [cwd, setCwd] = useState<string[]>([])
  const [menu, setMenu] = useState<Menu | null>(null)
  const [focused, setFocused] = useState(false)
  const [history, setHistory] = useState<string[]>([])
  const nav = useRef<{ prefix: string; index: number } | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const promptRef = useRef<HTMLDivElement>(null)
  const nextId = useRef(0)

  useEffect(() => setHistory(readHistory()), [])

  const ctx: ShellCtx = useMemo(() => ({ t, cwd, setCwd, setLocale, history }), [t, cwd, setLocale, history])
  const ctxRef = useRef(ctx)
  ctxRef.current = ctx

  const run = useCallback(async (src: string) => {
    const cmd = src.trim()
    setInput('')
    setCaret(0)
    setMenu(null)
    nav.current = null
    if (cmd) {
      setHistory((h) => {
        const next = h[h.length - 1] === cmd ? h : [...h, cmd]
        writeHistory(next)
        return next
      })
    }
    if (/^(clear|cls)$/i.test(cmd)) {
      setEntries([])
      return
    }
    const id = nextId.current++
    const at = ctxRef.current.cwd
    setEntries((e) => [...e, { id, cwd: at, cmd: src, lines: cmd ? null : [] }])
    if (!cmd) return
    let lines: Line[]
    try {
      lines = await execute(cmd, { ...ctxRef.current, history: [...ctxRef.current.history, cmd] })
    } catch {
      lines = [{ text: ctxRef.current.t.errors.network }]
    }
    setEntries((e) => e.map((x) => (x.id === id ? { ...x, lines } : x)))
  }, [])

  // Les liens « commande » de la page s'exécutent ici.
  useEffect(() => {
    const onRun = (e: Event) => {
      run((e as CustomEvent<string>).detail)
      if (window.matchMedia('(pointer: fine)').matches) inputRef.current?.focus({ preventScroll: true })
    }
    window.addEventListener(RUN_EVENT, onRun)
    return () => window.removeEventListener(RUN_EVENT, onRun)
  }, [run])

  // Le prompt reste en vue après chaque commande.
  useEffect(() => {
    if (entries.length) promptRef.current?.scrollIntoView({ block: 'nearest' })
  }, [entries])

  const ghost = caret === input.length && !menu ? predict(input, history) : ''

  function set(value: string, at = value.length) {
    setInput(value)
    setCaret(at)
    requestAnimationFrame(() => inputRef.current?.setSelectionRange(at, at))
  }

  function onKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    const el = e.currentTarget
    if (e.key === 'Enter') {
      e.preventDefault()
      run(input)
      return
    }
    if (e.key === 'Tab') {
      e.preventDefault()
      if (menu) {
        const index = (menu.index + (e.shiftKey ? -1 : 1) + menu.items.length) % menu.items.length
        setMenu({ ...menu, index })
        set(input.slice(0, menu.start) + menu.items[index])
        return
      }
      const { start, items } = complete(input, ctx)
      if (!items.length) return
      if (items.length === 1) {
        const item = items[0]
        set(input.slice(0, start) + item + (item.endsWith('/') ? '' : ' '))
        return
      }
      let common = items[0]
      for (const it of items) while (!it.startsWith(common)) common = common.slice(0, -1)
      if (common.length > input.length - start) set(input.slice(0, start) + common)
      setMenu({ start, items, index: -1 })
      return
    }
    if (e.key === 'Escape') {
      // Ligne vide : Échap remonte jusqu'au tiroir, qui se ferme.
      if (!menu && !input) return
      e.preventDefault()
      if (menu) setMenu(null)
      else set('')
      return
    }
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      e.preventDefault()
      const prefix = nav.current?.prefix ?? input.slice(0, caret)
      const matches = [...new Set([...history].reverse())].filter((h) => h.startsWith(prefix))
      let index = (nav.current?.index ?? -1) + (e.key === 'ArrowUp' ? 1 : -1)
      if (index >= matches.length) index = matches.length - 1
      if (index < 0) {
        nav.current = null
        set(prefix)
        return
      }
      nav.current = { prefix, index }
      set(matches[index])
      return
    }
    if ((e.key === 'ArrowRight' || e.key === 'End') && ghost && el.selectionStart === input.length) {
      e.preventDefault()
      set(input + ghost)
      return
    }
    if (e.ctrlKey && e.key.toLowerCase() === 'l') {
      e.preventDefault()
      setEntries([])
      return
    }
    if (e.ctrlKey && e.key.toLowerCase() === 'c' && el.selectionStart === el.selectionEnd) {
      e.preventDefault()
      setEntries((x) => [...x, { id: nextId.current++, cwd, cmd: `${input}^C`, lines: [] }])
      set('')
    }
  }

  return (
    <div className="mt-2" onClick={(e) => {
      if (!(e.target as HTMLElement).closest('a,button') && !window.getSelection()?.toString()) inputRef.current?.focus({ preventScroll: true })
    }}>
      <div aria-live="polite">
        {entries.map((entry) => (
          <div key={entry.id} className="mb-3">
            <PromptHeader path={displayPath(entry.cwd)} />
            <div className="term-line">
              <span className="text-pink" aria-hidden>❯ </span>
              <Highlighted text={entry.cmd} />
            </div>
            {entry.lines === null ? (
              <div className="term-line text-dim"><Spinner /></div>
            ) : (
              entry.lines.map((l, i) => (
                <div key={i} className="term-line">
                  {l.node ?? l.text}
                </div>
              ))
            )}
          </div>
        ))}
      </div>

      <div ref={promptRef} className="scroll-mb-24">
        <PromptHeader path={displayPath(cwd)} />
        {/* 16px sur écran tactile : en dessous, iOS zoome sur le champ et la page reste zoomée. */}
        <div className="term-line relative cursor-text pointer-coarse:text-[16px]">
          <span className="text-pink" aria-hidden>❯ </span>
          <Highlighted text={input} caret={focused ? caret : undefined} ghost={ghost} />
          {!focused && !input && <span className="inline-block h-[1.15em] w-[2px] translate-y-[0.2em] bg-pink/50" aria-hidden />}
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => {
              setInput(e.target.value)
              setCaret(e.target.selectionStart ?? e.target.value.length)
              setMenu(null)
              nav.current = null
            }}
            onSelect={(e) => setCaret(e.currentTarget.selectionStart ?? input.length)}
            onKeyDown={onKeyDown}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            aria-label="terminal"
            autoComplete="off"
            autoCapitalize="off"
            autoCorrect="off"
            spellCheck={false}
            enterKeyHint="go"
            className="absolute inset-y-0 left-[2ch] right-0 w-[calc(100%-2ch)] bg-transparent p-0 font-mono text-transparent caret-transparent outline-none selection:bg-transparent"
          />
        </div>

        {menu && (
          <div className="term-line flex flex-wrap gap-x-[2ch]" role="listbox" aria-label="completions">
            {menu.items.map((item, i) => (
              <span key={item} role="option" aria-selected={i === menu.index} className={i === menu.index ? 'bg-pink text-bg' : 'text-pink'}>
                {item}
              </span>
            ))}
          </div>
        )}

        <div className="term-line mt-1 text-muted">
          {t.hint}{' '}
          {SUGGESTIONS.map((s, i) => (
            <span key={s}>
              {i > 0 && '  '}
              <RunLink cmd={s} className={s === 'boykisser' ? 'text-pink' : 'text-yellow'} />
            </span>
          ))}
        </div>
        <div className="term-line hidden text-muted md:block">{t.keys}</div>
      </div>
    </div>
  )
}
