import type { Locale } from '../i18n/translations'

// ─── Édite ici pour ajouter/modifier les études de cas ──────────────────────
// Une entrée par projet. Les cartes de la section Work pointent automatiquement
// vers /work/<slug> dès qu'une étude de cas existe pour leur `projectKey`.
// Les paragraphes se séparent par des lignes vides (\n\n).

export type CaseStudySection = {
  heading: string
  body: string
}

export type CaseStudyContent = {
  metaTitle: string
  metaDescription: string
  tag: string
  intro: string
  sections: CaseStudySection[]
}

export type CaseStudy = {
  slug: string
  projectKey: string
  title: string
  year: string
  accent: string
  image?: string
  ogImage: string
  liveUrl: string
  stack: string[]
  metrics: Array<{ n: string; label: Record<Locale, string> }>
  content: Record<Locale, CaseStudyContent>
}

export const CASE_STUDIES: Record<string, CaseStudy> = {
  'safia-creative': {
    slug: 'safia-creative',
    projectKey: 'safia',
    title: 'Safia Creative',
    year: '2024 →',
    accent: 'bg-yellow',
    image: '/projects/safia.jpg',
    ogImage: '/og-safia-creative.png',
    liveUrl: 'https://fortnite.gg/creator/safia',
    stack: ['UEFN', 'Verse', 'Fortnite Creative', 'Analytics'],
    metrics: [
      {
        n: '3M+',
        label: { fr: 'Plays cumulés', en: 'Total plays', es: 'Plays totales' },
      },
      {
        n: '10+',
        label: {
          fr: 'Expériences publiées',
          en: 'Experiences shipped',
          es: 'Experiencias publicadas',
        },
      },
      {
        n: '2024',
        label: { fr: 'Studio fondé en', en: 'Studio founded', es: 'Estudio fundado' },
      },
    ],
    content: {
      fr: {
        metaTitle: 'Safia Creative — studio UEFN de Simon GAY (simnJS)',
        metaDescription:
          'Étude de cas : Safia Creative, le studio UEFN fondé par Simon GAY (simnJS). Maps Fortnite Creative scriptées en Verse, 3M+ plays cumulés, 10+ expériences publiées.',
        tag: 'UEFN · Studio',
        intro:
          'Safia Creative est le studio UEFN que j\'ai fondé et que je dirige : nous concevons, scriptons et publions des expériences Fortnite Creative qui totalisent plus de 3 millions de plays.',
        sections: [
          {
            heading: 'Le contexte',
            body: 'Fortnite Creative est devenu une vraie plateforme UGC : Epic reverse 40 % des revenus de l\'Item Shop aux créateurs, proportionnellement au temps de jeu généré. Pour exister sur ce marché, il ne suffit pas de construire une belle map — il faut de la rétention, des systèmes de jeu solides et un rythme de publication soutenu.\n\nJ\'ai fondé Safia Creative en 2024 pour attaquer ce marché sérieusement, avec une approche studio : pipeline de production, outillage, et itération guidée par les données plutôt que des maps one-shot.',
          },
          {
            heading: 'Mon rôle',
            body: 'Je dirige le studio et je porte la double casquette créative et technique : conception des expériences, scripting Verse de l\'ensemble des systèmes de jeu, publication et suivi analytics.\n\nConcrètement, ça va du game design des boucles de rétention jusqu\'au code de persistance des données joueurs, en passant par l\'optimisation des métriques de découverte (miniatures, titres, temps de session) qui décident de la visibilité d\'une map dans l\'écosystème Fortnite.',
          },
          {
            heading: 'La tech',
            body: 'Tout le gameplay est scripté en Verse, le langage d\'Epic pour UEFN. Les systèmes récurrents — progression persistante des joueurs, boutiques en jeu, événements timés, UI custom — sont construits comme des modules réutilisables d\'une map à l\'autre, ce qui permet de publier vite sans repartir de zéro.\n\nChaque expérience est instrumentée : on suit les plays, le temps de session et la rétention pour décider quoi itérer. C\'est cette boucle build → mesure → itération qui a fait passer le studio de zéro à plusieurs millions de plays.',
          },
          {
            heading: 'Les résultats',
            body: 'Plus de 3 millions de plays cumulés et une dizaine d\'expériences publiées depuis 2024. Le studio continue de publier et d\'itérer — l\'activité en temps réel est visible sur la section Now de ce site.',
          },
        ],
      },
      en: {
        metaTitle: 'Safia Creative — UEFN studio by Simon GAY (simnJS)',
        metaDescription:
          'Case study: Safia Creative, the UEFN studio founded by Simon GAY (simnJS). Fortnite Creative maps scripted in Verse, 3M+ total plays, 10+ shipped experiences.',
        tag: 'UEFN · Studio',
        intro:
          'Safia Creative is the UEFN studio I founded and run: we design, script and ship Fortnite Creative experiences totalling over 3 million plays.',
        sections: [
          {
            heading: 'Context',
            body: 'Fortnite Creative has become a real UGC platform: Epic shares 40% of Item Shop revenue with creators, proportional to the playtime they generate. To exist in this market, a pretty map is not enough — you need retention, solid game systems and a steady release cadence.\n\nI founded Safia Creative in 2024 to attack this market seriously, with a studio approach: production pipeline, tooling, and data-driven iteration instead of one-shot maps.',
          },
          {
            heading: 'My role',
            body: 'I run the studio and wear both the creative and technical hats: designing the experiences, scripting every game system in Verse, publishing, and tracking analytics.\n\nIn practice that ranges from designing retention loops to writing the player-data persistence code, plus optimising the discovery metrics (thumbnails, titles, session time) that decide a map\'s visibility inside the Fortnite ecosystem.',
          },
          {
            heading: 'The tech',
            body: 'All gameplay is scripted in Verse, Epic\'s language for UEFN. Recurring systems — persistent player progression, in-game shops, timed events, custom UI — are built as modules reused across maps, which lets us ship fast without starting from scratch.\n\nEvery experience is instrumented: we track plays, session time and retention to decide what to iterate on. That build → measure → iterate loop is what took the studio from zero to millions of plays.',
          },
          {
            heading: 'Results',
            body: 'Over 3 million total plays and about ten experiences shipped since 2024. The studio keeps shipping and iterating — live activity is visible in the Now section of this site.',
          },
        ],
      },
      es: {
        metaTitle: 'Safia Creative — estudio UEFN de Simon GAY (simnJS)',
        metaDescription:
          'Caso de estudio: Safia Creative, el estudio UEFN fundado por Simon GAY (simnJS). Mapas de Fortnite Creative en Verse, 3M+ plays totales, 10+ experiencias publicadas.',
        tag: 'UEFN · Studio',
        intro:
          'Safia Creative es el estudio UEFN que fundé y dirijo: diseñamos, programamos y publicamos experiencias de Fortnite Creative que suman más de 3 millones de plays.',
        sections: [
          {
            heading: 'El contexto',
            body: 'Fortnite Creative se ha convertido en una verdadera plataforma UGC: Epic reparte el 40% de los ingresos de la Item Shop entre los creadores, en proporción al tiempo de juego generado. Para existir en este mercado no basta con un mapa bonito — hacen falta retención, sistemas de juego sólidos y un ritmo de publicación constante.\n\nFundé Safia Creative en 2024 para atacar este mercado en serio, con enfoque de estudio: pipeline de producción, herramientas e iteración guiada por datos en lugar de mapas one-shot.',
          },
          {
            heading: 'Mi rol',
            body: 'Dirijo el estudio con doble rol creativo y técnico: diseño de las experiencias, programación en Verse de todos los sistemas de juego, publicación y seguimiento de analytics.\n\nEn la práctica va desde el diseño de los bucles de retención hasta el código de persistencia de datos de jugadores, pasando por la optimización de las métricas de descubrimiento (miniaturas, títulos, tiempo de sesión) que deciden la visibilidad de un mapa en el ecosistema Fortnite.',
          },
          {
            heading: 'La tecnología',
            body: 'Todo el gameplay está programado en Verse, el lenguaje de Epic para UEFN. Los sistemas recurrentes — progresión persistente, tiendas en juego, eventos temporizados, UI custom — se construyen como módulos reutilizables entre mapas, lo que permite publicar rápido sin empezar de cero.\n\nCada experiencia está instrumentada: seguimos plays, tiempo de sesión y retención para decidir qué iterar. Ese bucle build → medir → iterar llevó al estudio de cero a millones de plays.',
          },
          {
            heading: 'Los resultados',
            body: 'Más de 3 millones de plays totales y una decena de experiencias publicadas desde 2024. El estudio sigue publicando e iterando — la actividad en vivo se ve en la sección Now de este sitio.',
          },
        ],
      },
    },
  },
}

// projectKey → slug, pour lier les cartes de la section Work.
export const CASE_STUDY_SLUG_BY_PROJECT: Record<string, string> =
  Object.fromEntries(
    Object.values(CASE_STUDIES).map((c) => [c.projectKey, c.slug]),
  )
