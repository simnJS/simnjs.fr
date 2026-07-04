export const LOCALES = ['fr', 'en', 'es'] as const
export type Locale = (typeof LOCALES)[number]

export const DEFAULT_LOCALE: Locale = 'fr'

export const LOCALE_META: Record<Locale, { label: string; flag: string }> = {
  fr: { label: 'FR', flag: '🇫🇷' },
  en: { label: 'EN', flag: '🇬🇧' },
  es: { label: 'ES', flag: '🇪🇸' },
}

type Dict = {
  nav: { work: string; stack: string; about: string; contact: string; now: string }
  hero: {
    tagline: [string, string, string]
    roles: { ugc: string; obsessed: string; tech: string }
    stats: {
      players: string
      maps: string
      platforms: string
      years: string
    }
  }
  sections: {
    work: string
    stack: string
    about: string
    now: string
  }
  github: {
    live: string
    subtitle: string
    empty: string
    error: string
    viewMore: string
    refreshedJustNow: string
    refreshedAgo: string
    refresh: string
    refreshing: string
    groupedSuffix: string
    privateLabel: string
    privateMessage: string
    types: {
      push: string
      pr: string
      release: string
      issue: string
      create: string
      public: string
      fork: string
    }
    time: {
      now: string
      minute: string
      hour: string
      day: string
      month: string
      year: string
    }
    stats: {
      commits: string
      prs: string
      repos: string
      streak: string
    }
    filters: {
      all: string
      code: string
      prs: string
      releases: string
    }
    heatmap: {
      title: string
      totalSuffix: string
      less: string
      more: string
    }
  }
  workFilters: {
    all: string
    fortnite: string
    stake: string
    saas: string
    roblox: string
    opensource: string
  }
  projects: {
    safia: { tag: string; desc: string }
    playandchill: { tag: string; desc: string }
    stakeplayer: { tag: string; desc: string }
    uefnstore: { tag: string; desc: string }
    tacline: { tag: string; desc: string }
    playnchill: { tag: string; desc: string }
  }
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
  about: {
    bio: string
  }
  contact: {
    kicker: string
    title: string
    github: string
    linkedin: string
    discord: string
    discordCopied: string
  }
  footer: {
    built: string
  }
  selector: {
    label: string
  }
}

export const translations: Record<Locale, Dict> = {
  fr: {
    nav: { work: '/work', stack: '/stack', about: '/about', contact: 'CONTACT', now: '/now' },
    hero: {
      tagline: ['Je construis', 'des mondes', 'jouables.'],
      roles: {
        ugc: 'UEFN · ROBLOX · STAKE · S&BOX',
        obsessed: 'SAFIA CREATIVE / FOUNDER',
        tech: 'AVAILABLE FOR COLLABS',
      },
      stats: {
        players: 'Plays cumulés',
        maps: 'Expériences publiées',
        platforms: 'Plateformes',
        years: 'Années',
      },
    },
    sections: {
      work: 'Selected Work',
      stack: 'Stack & Toys',
      about: 'About',
      now: 'Now',
    },
    github: {
      live: 'LIVE',
      subtitle: 'Activité publique sur github.com/simnJS',
      empty: 'Pas d\'activité récente.',
      error: 'Impossible de joindre GitHub.',
      viewMore: 'Voir tout sur GitHub',
      refreshedJustNow: 'à l\'instant',
      refreshedAgo: 'il y a',
      refresh: 'Actualiser',
      refreshing: 'Actualisation…',
      groupedSuffix: 'pushes',
      privateLabel: 'privé',
      privateMessage: '— contenu masqué —',
      types: {
        push: 'push',
        pr: 'pr',
        release: 'release',
        issue: 'issue',
        create: 'new',
        public: 'public',
        fork: 'fork',
      },
      time: {
        now: 'à l\'instant',
        minute: 'min',
        hour: 'h',
        day: 'j',
        month: 'mois',
        year: 'an',
      },
      stats: {
        commits: 'Commits',
        prs: 'Pull Requests',
        repos: 'Repos actifs',
        streak: 'Streak actuelle',
      },
      filters: {
        all: 'Tout',
        code: 'Code',
        prs: 'PRs',
        releases: 'Releases',
      },
      heatmap: {
        title: 'Contributions (12 derniers mois)',
        totalSuffix: 'contributions cette année',
        less: 'moins',
        more: 'plus',
      },
    },
    workFilters: {
      all: 'Tout',
      fortnite: 'Fortnite',
      stake: 'Stake',
      saas: 'SaaS',
      roblox: 'Roblox',
      opensource: 'Open Source',
    },
    projects: {
      safia: {
        tag: 'UEFN · Studio',
        desc: 'Le studio que je dirige. Maps Fortnite Creative scriptées en Verse, 3M+ plays cumulés.',
      },
      playandchill: {
        tag: 'Casino · Studio',
        desc: 'Mon studio casino. Production de slots et jeux pour Stake Engine.',
      },
      stakeplayer: {
        tag: 'Stake Engine · Analytics',
        desc: 'Tracker temps réel pour les jeux Stake Engine : player counts, turnover, peak hours.',
      },
      uefnstore: {
        tag: 'UEFN · Marketplace',
        desc: 'Marketplace d\'assets prêts à l\'emploi pour les créateurs Fortnite : Verse, 3D, UI, templates.',
      },
      tacline: {
        tag: 'Airsoft · SaaS',
        desc: 'Plateforme qui connecte joueurs et organisateurs d\'airsoft : recherche de parties, carte des terrains, inscriptions et paiement en ligne.',
      },
      playnchill: {
        tag: 'Roblox · Studio',
        desc: 'Mon studio Roblox. Planet Tycoon, Weapons RNG, 100 Players Enter Youtubers, un jeu publié toutes les six à huit semaines.',
      },
    },
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
    about: {
      bio: `Software engineer à Lyon. Je dirige Safia Creative (UEFN, 3M+ plays cumulés sur Fortnite) et Play & Chill (slots et jeux casino pour Stake Engine). Entre les deux, je code tout ce qui me tombe sous la main : outils, bots, systèmes scalables.`,
    },
    contact: {
      kicker: '// un projet ? un café ?',
      title: 'Écris-moi.',
      github: 'GitHub',
      linkedin: 'LinkedIn',
      discord: 'Discord',
      discordCopied: 'Copié !',
    },
    footer: {
      built: 'built with care',
    },
    selector: { label: 'Langue' },
  },
  en: {
    nav: { work: '/work', stack: '/stack', about: '/about', contact: 'CONTACT', now: '/now' },
    hero: {
      tagline: ['I build', 'playable', 'worlds.'],
      roles: {
        ugc: 'UEFN · ROBLOX · STAKE · S&BOX',
        obsessed: 'SAFIA CREATIVE / FOUNDER',
        tech: 'AVAILABLE FOR COLLABS',
      },
      stats: {
        players: 'Total plays',
        maps: 'Experiences shipped',
        platforms: 'Platforms',
        years: 'Years',
      },
    },
    sections: {
      work: 'Selected Work',
      stack: 'Stack & Toys',
      about: 'About',
      now: 'Now',
    },
    github: {
      live: 'LIVE',
      subtitle: 'Public activity from github.com/simnJS',
      empty: 'No recent activity.',
      error: 'Could not reach GitHub.',
      viewMore: 'See more on GitHub',
      refreshedJustNow: 'just now',
      refreshedAgo: 'refreshed',
      refresh: 'Refresh',
      refreshing: 'Refreshing…',
      groupedSuffix: 'pushes',
      privateLabel: 'private',
      privateMessage: '— content hidden —',
      types: {
        push: 'push',
        pr: 'pr',
        release: 'release',
        issue: 'issue',
        create: 'new',
        public: 'public',
        fork: 'fork',
      },
      time: {
        now: 'just now',
        minute: 'm',
        hour: 'h',
        day: 'd',
        month: 'mo',
        year: 'y',
      },
      stats: {
        commits: 'Commits',
        prs: 'Pull Requests',
        repos: 'Active repos',
        streak: 'Current streak',
      },
      filters: {
        all: 'All',
        code: 'Code',
        prs: 'PRs',
        releases: 'Releases',
      },
      heatmap: {
        title: 'Contributions (last 12 months)',
        totalSuffix: 'contributions this year',
        less: 'less',
        more: 'more',
      },
    },
    workFilters: {
      all: 'All',
      fortnite: 'Fortnite',
      stake: 'Stake',
      saas: 'SaaS',
      roblox: 'Roblox',
      opensource: 'Open Source',
    },
    projects: {
      safia: {
        tag: 'UEFN · Studio',
        desc: 'The studio I run. Fortnite Creative maps scripted in Verse, 3M+ total plays.',
      },
      playandchill: {
        tag: 'Casino · Studio',
        desc: 'My casino studio. Slot games and casino content built for Stake Engine.',
      },
      stakeplayer: {
        tag: 'Stake Engine · Analytics',
        desc: 'Real-time tracker for Stake Engine games: player counts, turnover, peak hours.',
      },
      uefnstore: {
        tag: 'UEFN · Marketplace',
        desc: 'Marketplace of ready-to-use assets for Fortnite creators: Verse, 3D, UI, templates.',
      },
      tacline: {
        tag: 'Airsoft · SaaS',
        desc: 'Platform connecting airsoft players and organizers: game discovery, field map, sign-ups and online payment.',
      },
      playnchill: {
        tag: 'Roblox · Studio',
        desc: "My Roblox studio. Planet Tycoon, Weapons RNG, 100 Players Enter Youtubers, a game shipped every six to eight weeks.",
      },
    },
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
    about: {
      bio: `Software engineer in Lyon. I run Safia Creative (UEFN, 3M+ plays on Fortnite) and Play & Chill (slots and casino games on Stake Engine). In between, I build whatever falls into my hands: tools, bots, scalable systems.`,
    },
    contact: {
      kicker: '// got a project? a coffee?',
      title: 'Write me.',
      github: 'GitHub',
      linkedin: 'LinkedIn',
      discord: 'Discord',
      discordCopied: 'Copied!',
    },
    footer: {
      built: 'built with care',
    },
    selector: { label: 'Language' },
  },
  es: {
    nav: { work: '/work', stack: '/stack', about: '/about', contact: 'CONTACTO', now: '/now' },
    hero: {
      tagline: ['Construyo', 'mundos', 'jugables.'],
      roles: {
        ugc: 'UEFN · ROBLOX · STAKE · S&BOX',
        obsessed: 'SAFIA CREATIVE / FOUNDER',
        tech: 'AVAILABLE FOR COLLABS',
      },
      stats: {
        players: 'Plays totales',
        maps: 'Experiencias publicadas',
        platforms: 'Plataformas',
        years: 'Años',
      },
    },
    sections: {
      work: 'Trabajos seleccionados',
      stack: 'Stack & Juguetes',
      about: 'Sobre mí',
      now: 'Ahora',
    },
    github: {
      live: 'EN VIVO',
      subtitle: 'Actividad pública en github.com/simnJS',
      empty: 'Sin actividad reciente.',
      error: 'No se pudo contactar a GitHub.',
      viewMore: 'Ver más en GitHub',
      refreshedJustNow: 'ahora mismo',
      refreshedAgo: 'hace',
      refresh: 'Actualizar',
      refreshing: 'Actualizando…',
      groupedSuffix: 'pushes',
      privateLabel: 'privado',
      privateMessage: '— contenido oculto —',
      types: {
        push: 'push',
        pr: 'pr',
        release: 'release',
        issue: 'issue',
        create: 'nuevo',
        public: 'público',
        fork: 'fork',
      },
      time: {
        now: 'ahora mismo',
        minute: 'min',
        hour: 'h',
        day: 'd',
        month: 'mes',
        year: 'a',
      },
      stats: {
        commits: 'Commits',
        prs: 'Pull Requests',
        repos: 'Repos activos',
        streak: 'Racha actual',
      },
      filters: {
        all: 'Todo',
        code: 'Código',
        prs: 'PRs',
        releases: 'Releases',
      },
      heatmap: {
        title: 'Contribuciones (12 meses)',
        totalSuffix: 'contribuciones este año',
        less: 'menos',
        more: 'más',
      },
    },
    workFilters: {
      all: 'Todo',
      fortnite: 'Fortnite',
      stake: 'Stake',
      saas: 'SaaS',
      roblox: 'Roblox',
      opensource: 'Open Source',
    },
    projects: {
      safia: {
        tag: 'UEFN · Studio',
        desc: 'El estudio que dirijo. Mapas de Fortnite Creative en Verse, 3M+ plays acumuladas.',
      },
      playandchill: {
        tag: 'Casino · Studio',
        desc: 'Mi estudio de casino. Slots y juegos para Stake Engine.',
      },
      stakeplayer: {
        tag: 'Stake Engine · Analytics',
        desc: 'Tracker en tiempo real para juegos de Stake Engine: player counts, turnover, peak hours.',
      },
      uefnstore: {
        tag: 'UEFN · Marketplace',
        desc: 'Marketplace de assets listos para usar para creadores Fortnite: Verse, 3D, UI, templates.',
      },
      tacline: {
        tag: 'Airsoft · SaaS',
        desc: 'Plataforma que conecta jugadores y organizadores de airsoft: búsqueda de partidas, mapa de campos, inscripciones y pago online.',
      },
      playnchill: {
        tag: 'Roblox · Studio',
        desc: 'Mi estudio Roblox. Planet Tycoon, Weapons RNG, 100 Players Enter Youtubers, un juego publicado cada seis a ocho semanas.',
      },
    },
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
    about: {
      bio: `Ingeniero de software en Lyon. Dirijo Safia Creative (UEFN, 3M+ plays en Fortnite) y Play & Chill (slots y juegos de casino para Stake Engine). Entre medio, codeo todo lo que me cae en las manos: herramientas, bots, sistemas escalables.`,
    },
    contact: {
      kicker: '// ¿un proyecto? ¿un café?',
      title: 'Escríbeme.',
      github: 'GitHub',
      linkedin: 'LinkedIn',
      discord: 'Discord',
      discordCopied: '¡Copiado!',
    },
    footer: {
      built: 'hecho con cuidado',
    },
    selector: { label: 'Idioma' },
  },
}

export type Dictionary = Dict
