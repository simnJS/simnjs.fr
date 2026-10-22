export const LOCALES = ['fr', 'en', 'es'] as const
export type Locale = (typeof LOCALES)[number]

export const DEFAULT_LOCALE: Locale = 'fr'

export const LOCALE_META: Record<Locale, { label: string; flag: string }> = {
  fr: { label: 'FR', flag: '🇫🇷' },
  en: { label: 'EN', flag: '🇬🇧' },
  es: { label: 'ES', flag: '🇪🇸' },
}

type Dict = {
  caseStudy: {
    kicker: string
    back: string
    visit: string
    stack: string
    cta: string
    ctaButton: string
    liveTitle: string
    livePlaying: string
    liveVisits: string
    liveMembers: string
    liveLikes: string
    liveFavs: string
  }
}

export type Dictionary = Dict

// Les textes de l'accueil v2 (terminal) sont dans ./term.ts ; ici restent
// ceux des études de cas.
export const translations: Record<Locale, Dict> = {
  fr: {
    caseStudy: {
      kicker: '// étude de cas',
      back: 'retour',
      visit: 'Voir le site',
      stack: 'Stack',
      cta: 'Un projet dans le même genre ?',
      ctaButton: 'Écris-moi',
      liveTitle: 'En direct de Roblox',
      livePlaying: 'en ligne',
      liveVisits: 'visites',
      liveMembers: 'membres',
      liveLikes: 'likes',
      liveFavs: 'favoris',
    },
  },
  en: {
    caseStudy: {
      kicker: '// case study',
      back: 'back',
      visit: 'Visit site',
      stack: 'Stack',
      cta: 'Got a similar project in mind?',
      ctaButton: 'Write me',
      liveTitle: 'Live from Roblox',
      livePlaying: 'playing now',
      liveVisits: 'visits',
      liveMembers: 'members',
      liveLikes: 'likes',
      liveFavs: 'favorites',
    },
  },
  es: {
    caseStudy: {
      kicker: '// caso de estudio',
      back: 'volver',
      visit: 'Ver el sitio',
      stack: 'Stack',
      cta: '¿Tienes un proyecto parecido?',
      ctaButton: 'Escríbeme',
      liveTitle: 'En directo desde Roblox',
      livePlaying: 'jugando ahora',
      liveVisits: 'visitas',
      liveMembers: 'miembros',
      liveLikes: 'likes',
      liveFavs: 'favoritos',
    },
  },
}
