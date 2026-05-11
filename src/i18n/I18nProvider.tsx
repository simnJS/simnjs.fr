import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import {
  DEFAULT_LOCALE,
  LOCALES,
  type Dictionary,
  type Locale,
  translations,
} from './translations'

const STORAGE_KEY = 'app.locale'
const COOKIE_KEY = 'app.locale'
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365

type I18nContextValue = {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: Dictionary
}

const I18nContext = createContext<I18nContextValue | null>(null)

function isLocale(value: string | null | undefined): value is Locale {
  return !!value && (LOCALES as readonly string[]).includes(value)
}

function readCookie(name: string): string | null {
  if (typeof document === 'undefined') return null
  const match = document.cookie.match(
    new RegExp('(?:^|; )' + name.replace(/[.$?*|{}()[\]\\/+^]/g, '\\$&') + '=([^;]*)'),
  )
  return match ? decodeURIComponent(match[1]) : null
}

function writeCookie(name: string, value: string) {
  if (typeof document === 'undefined') return
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax`
}

function detectBrowserLocale(): Locale {
  if (typeof navigator === 'undefined') return DEFAULT_LOCALE
  const languages = [navigator.language, ...(navigator.languages ?? [])]
  for (const lang of languages) {
    if (!lang) continue
    const short = lang.toLowerCase().split('-')[0]
    if (isLocale(short)) return short
  }
  return DEFAULT_LOCALE
}

function resolveInitialLocale(): Locale {
  if (typeof window === 'undefined') return DEFAULT_LOCALE
  const stored = window.localStorage.getItem(STORAGE_KEY)
  if (isLocale(stored)) return stored
  const cookie = readCookie(COOKIE_KEY)
  if (isLocale(cookie)) return cookie
  return detectBrowserLocale()
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    const resolved = resolveInitialLocale()
    setLocaleState(resolved)
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (!hydrated) return
    if (typeof document !== 'undefined') {
      document.documentElement.lang = locale
    }
    try {
      window.localStorage.setItem(STORAGE_KEY, locale)
    } catch {}
    writeCookie(COOKIE_KEY, locale)
  }, [locale, hydrated])

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next)
  }, [])

  const value = useMemo<I18nContextValue>(
    () => ({ locale, setLocale, t: translations[locale] }),
    [locale, setLocale],
  )

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useI18n() {
  const ctx = useContext(I18nContext)
  if (!ctx) {
    throw new Error('useI18n doit être utilisé dans <I18nProvider>')
  }
  return ctx
}
