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
  // `n` est la valeur affichée ; `live` la remplace par une stat en temps réel
  // (le bloc `live` doit alors être renseigné, ex : 'roblox').
  metrics: Array<{ n: string; label: Record<Locale, string>; live?: 'totalVisits' }>
  content: Record<Locale, CaseStudyContent>
  // Bloc de stats en temps réel affiché sur la page (ex : CCU Roblox).
  live?: 'roblox'
}

export const CASE_STUDIES: Record<string, CaseStudy> = {
  'play-and-chill': {
    slug: 'play-and-chill',
    projectKey: 'playandchill',
    title: 'Play & Chill',
    year: '2025 →',
    accent: 'bg-coral',
    image: '/projects/playandchill.png',
    ogImage: '/og-play-and-chill.png',
    liveUrl: 'https://playandchill.bet/',
    stack: ['Stake Engine', 'TypeScript', 'React', 'Maths & RNG'],
    metrics: [
      {
        n: '2025',
        label: { fr: 'Studio fondé en', en: 'Studio founded', es: 'Estudio fundado' },
      },
      {
        n: '100%',
        label: {
          fr: 'Maths & front maison',
          en: 'In-house math & front-end',
          es: 'Maths y front propios',
        },
      },
      {
        n: 'RGS',
        label: {
          fr: 'Résultats côté serveur',
          en: 'Server-side outcomes',
          es: 'Resultados server-side',
        },
      },
    ],
    content: {
      fr: {
        metaTitle: 'Play & Chill · studio casino Stake Engine de Simon GAY (simnJS)',
        metaDescription:
          'Étude de cas : Play & Chill, le studio de Simon GAY (simnJS) qui produit slots et jeux casino pour Stake Engine, la plateforme de jeux tiers de Stake.com.',
        tag: 'Casino · Studio',
        intro:
          'Play & Chill est mon studio casino : nous concevons et produisons des slots et des jeux pour Stake Engine, la plateforme qui ouvre le catalogue de Stake.com aux studios indépendants.',
        sections: [
          {
            heading: 'Le contexte',
            body: 'En 2025, Stake, un des plus gros casinos en ligne au monde, a ouvert son catalogue aux studios tiers avec Stake Engine : des équipes indépendantes peuvent y publier leurs propres jeux et toucher une part des revenus, sans monter un opérateur, gérer des licences ni acquérir des joueurs. Historiquement, le développement de jeux casino était verrouillé par une poignée de studios B2B établis. Cette porte-là ne s\'ouvre pas souvent.\n\nJ\'ai fondé Play & Chill pour prendre cette vague tôt, avec la même logique que Safia Creative sur Fortnite : arriver sur une plateforme UGC naissante avec une vraie capacité de production.',
          },
          {
            heading: 'Mon rôle',
            body: 'Je dirige le studio et la production : game design des slots, modèles mathématiques, développement front-end et pipeline.\n\nSur un jeu casino, la moitié du travail est invisible : le modèle mathématique (RTP, volatilité, table des gains) doit être simulé sur des millions de spins et validé avant toute publication. L\'autre moitié, celle qu\'on voit (le rendu, le game feel, les animations), décide si les joueurs restent. Je travaille sur les deux.',
          },
          {
            heading: 'La tech',
            body: 'Les jeux tournent sur le RGS de Stake Engine : chaque résultat est calculé côté serveur, le front ne fait que le mettre en scène. Le front est en TypeScript/React, construit au-dessus du web SDK de Stake Engine que nous avons adapté à nos besoins.\n\nPour enchaîner les jeux sans repartir de zéro, tout est industrialisé : templates de jeu réutilisables, simulateurs pour valider les modèles mathématiques, et de l\'outillage maison autour de l\'écosystème, dont stake-dev-tool, publié en open source, et StakePlayerCount, notre tracker d\'audience des jeux Stake Engine.',
          },
          {
            heading: 'La suite',
            body: 'Le studio produit en continu et le pipeline s\'affine à chaque jeu. L\'objectif : faire de Play & Chill un studio reconnu de l\'écosystème Stake Engine, comme Safia Creative l\'est devenu sur Fortnite Creative. Les sorties s\'annoncent sur playandchill.bet.',
          },
        ],
      },
      en: {
        metaTitle: 'Play & Chill · Stake Engine casino studio by Simon GAY (simnJS)',
        metaDescription:
          'Case study: Play & Chill, the studio by Simon GAY (simnJS) building slots and casino games for Stake Engine, Stake.com\'s third-party games platform.',
        tag: 'Casino · Studio',
        intro:
          'Play & Chill is my casino studio: we design and ship slots and games for Stake Engine, the platform opening Stake.com\'s catalogue to independent studios.',
        sections: [
          {
            heading: 'Context',
            body: 'In 2025, Stake, one of the biggest online casinos in the world, opened its catalogue to third-party studios with Stake Engine: independent teams can publish their own games and earn a revenue share, without becoming an operator, handling licences or acquiring players. Historically, casino game development was locked up by a handful of established B2B studios. That door doesn\'t open often.\n\nI founded Play & Chill to catch that wave early, with the same logic as Safia Creative on Fortnite: show up on a nascent UGC platform with real production capacity.',
          },
          {
            heading: 'My role',
            body: 'I run the studio and its production: slot game design, math models, front-end development and pipeline.\n\nHalf the work on a casino game is invisible: the math model (RTP, volatility, paytable) has to be simulated over millions of spins and validated before anything ships. The other half, the visible one (rendering, game feel, animations), decides whether players stay. I work on both.',
          },
          {
            heading: 'The tech',
            body: 'Games run on Stake Engine\'s RGS: every outcome is computed server-side, the front-end only stages it. The front-end is TypeScript/React, built on top of Stake Engine\'s web SDK, which we adapted to our needs.\n\nTo ship game after game without starting over, everything is industrialised: reusable game templates, simulators to validate math models, and in-house tooling around the ecosystem, including stake-dev-tool, released open source, and StakePlayerCount, our audience tracker for Stake Engine games.',
          },
          {
            heading: 'What\'s next',
            body: 'The studio ships continuously and the pipeline sharpens with every game. The goal: make Play & Chill a recognised studio in the Stake Engine ecosystem, the way Safia Creative became one on Fortnite Creative. Releases are announced on playandchill.bet.',
          },
        ],
      },
      es: {
        metaTitle: 'Play & Chill · estudio casino Stake Engine de Simon GAY (simnJS)',
        metaDescription:
          'Caso de estudio: Play & Chill, el estudio de Simon GAY (simnJS) que produce slots y juegos de casino para Stake Engine, la plataforma de juegos de terceros de Stake.com.',
        tag: 'Casino · Studio',
        intro:
          'Play & Chill es mi estudio de casino: diseñamos y publicamos slots y juegos para Stake Engine, la plataforma que abre el catálogo de Stake.com a estudios independientes.',
        sections: [
          {
            heading: 'El contexto',
            body: 'En 2025, Stake, uno de los casinos online más grandes del mundo, abrió su catálogo a estudios terceros con Stake Engine: equipos independientes pueden publicar sus propios juegos y cobrar una parte de los ingresos, sin montar un operador, gestionar licencias ni captar jugadores. Históricamente, el desarrollo de juegos de casino estaba cerrado a un puñado de estudios B2B establecidos. Esa puerta no se abre a menudo.\n\nFundé Play & Chill para tomar esa ola temprano, con la misma lógica que Safia Creative en Fortnite: llegar a una plataforma UGC naciente con capacidad real de producción.',
          },
          {
            heading: 'Mi rol',
            body: 'Dirijo el estudio y su producción: diseño de slots, modelos matemáticos, desarrollo front-end y pipeline.\n\nLa mitad del trabajo en un juego de casino es invisible: el modelo matemático (RTP, volatilidad, tabla de pagos) debe simularse sobre millones de spins y validarse antes de publicar. La otra mitad, la visible (render, game feel, animaciones), decide si los jugadores se quedan. Trabajo en ambas.',
          },
          {
            heading: 'La tecnología',
            body: 'Los juegos corren sobre el RGS de Stake Engine: cada resultado se calcula en el servidor, el front solo lo pone en escena. El front es TypeScript/React, construido sobre el web SDK de Stake Engine, adaptado a nuestras necesidades.\n\nPara encadenar juegos sin empezar de cero, todo está industrializado: templates reutilizables, simuladores para validar los modelos matemáticos y herramientas propias del ecosistema, incluyendo stake-dev-tool, publicado open source, y StakePlayerCount, nuestro tracker de audiencia de juegos Stake Engine.',
          },
          {
            heading: 'Lo que viene',
            body: 'El estudio produce en continuo y el pipeline mejora con cada juego. El objetivo: hacer de Play & Chill un estudio reconocido del ecosistema Stake Engine, como Safia Creative lo es en Fortnite Creative. Los lanzamientos se anuncian en playandchill.bet.',
          },
        ],
      },
    },
  },
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
        metaTitle: 'Safia Creative · studio UEFN de Simon GAY (simnJS)',
        metaDescription:
          'Étude de cas : Safia Creative, le studio UEFN fondé par Simon GAY (simnJS). Maps Fortnite Creative scriptées en Verse, 3M+ plays cumulés, 10+ expériences publiées.',
        tag: 'UEFN · Studio',
        intro:
          'Safia Creative est le studio UEFN que j\'ai fondé et que je dirige : nous concevons, scriptons et publions des expériences Fortnite Creative qui totalisent plus de 3 millions de plays.',
        sections: [
          {
            heading: 'Le contexte',
            body: 'Fortnite Creative est devenu une vraie plateforme UGC : Epic reverse 40 % des revenus de l\'Item Shop aux créateurs, proportionnellement au temps de jeu généré. Pour exister sur ce marché, une belle map ne suffit pas : il faut de la rétention, des systèmes de jeu solides et un rythme de publication soutenu.\n\nJ\'ai fondé Safia Creative en 2024 pour attaquer ce marché sérieusement, avec une approche studio : pipeline de production, outillage, et itération guidée par les données plutôt que des maps one-shot.',
          },
          {
            heading: 'Mon rôle',
            body: 'Je dirige le studio et je porte la double casquette créative et technique : conception des expériences, scripting Verse de l\'ensemble des systèmes de jeu, publication et suivi analytics.\n\nConcrètement, ça va du game design des boucles de rétention jusqu\'au code de persistance des données joueurs, en passant par l\'optimisation des métriques de découverte (miniatures, titres, temps de session) qui décident de la visibilité d\'une map dans l\'écosystème Fortnite.',
          },
          {
            heading: 'La tech',
            body: 'Tout le gameplay est scripté en Verse, le langage d\'Epic pour UEFN. Les systèmes récurrents (progression persistante des joueurs, boutiques en jeu, événements timés, UI custom) sont construits comme des modules réutilisables d\'une map à l\'autre, ce qui permet de publier vite sans repartir de zéro.\n\nChaque expérience est instrumentée : on suit les plays, le temps de session et la rétention pour décider quoi itérer. Cette boucle build → mesure → itération a fait passer le studio de zéro à plusieurs millions de plays.',
          },
          {
            heading: 'Les résultats',
            body: 'Plus de 3 millions de plays cumulés et une dizaine d\'expériences publiées depuis 2024. Le studio continue de publier et d\'itérer. L\'activité en temps réel est visible sur la section Now de ce site.',
          },
        ],
      },
      en: {
        metaTitle: 'Safia Creative · UEFN studio by Simon GAY (simnJS)',
        metaDescription:
          'Case study: Safia Creative, the UEFN studio founded by Simon GAY (simnJS). Fortnite Creative maps scripted in Verse, 3M+ total plays, 10+ shipped experiences.',
        tag: 'UEFN · Studio',
        intro:
          'Safia Creative is the UEFN studio I founded and run: we design, script and ship Fortnite Creative experiences totalling over 3 million plays.',
        sections: [
          {
            heading: 'Context',
            body: 'Fortnite Creative has become a real UGC platform: Epic shares 40% of Item Shop revenue with creators, proportional to the playtime they generate. To exist in this market, a pretty map is not enough: you need retention, solid game systems and a steady release cadence.\n\nI founded Safia Creative in 2024 to attack this market seriously, with a studio approach: production pipeline, tooling, and data-driven iteration instead of one-shot maps.',
          },
          {
            heading: 'My role',
            body: 'I run the studio and wear both the creative and technical hats: designing the experiences, scripting every game system in Verse, publishing, and tracking analytics.\n\nIn practice that ranges from designing retention loops to writing the player-data persistence code, plus optimising the discovery metrics (thumbnails, titles, session time) that decide a map\'s visibility inside the Fortnite ecosystem.',
          },
          {
            heading: 'The tech',
            body: 'All gameplay is scripted in Verse, Epic\'s language for UEFN. Recurring systems (persistent player progression, in-game shops, timed events, custom UI) are built as modules reused across maps, which lets us ship fast without starting from scratch.\n\nEvery experience is instrumented: we track plays, session time and retention to decide what to iterate on. That build → measure → iterate loop took the studio from zero to millions of plays.',
          },
          {
            heading: 'Results',
            body: 'Over 3 million total plays and about ten experiences shipped since 2024. The studio keeps shipping and iterating. Live activity is visible in the Now section of this site.',
          },
        ],
      },
      es: {
        metaTitle: 'Safia Creative · estudio UEFN de Simon GAY (simnJS)',
        metaDescription:
          'Caso de estudio: Safia Creative, el estudio UEFN fundado por Simon GAY (simnJS). Mapas de Fortnite Creative en Verse, 3M+ plays totales, 10+ experiencias publicadas.',
        tag: 'UEFN · Studio',
        intro:
          'Safia Creative es el estudio UEFN que fundé y dirijo: diseñamos, programamos y publicamos experiencias de Fortnite Creative que suman más de 3 millones de plays.',
        sections: [
          {
            heading: 'El contexto',
            body: 'Fortnite Creative se ha convertido en una verdadera plataforma UGC: Epic reparte el 40% de los ingresos de la Item Shop entre los creadores, en proporción al tiempo de juego generado. Para existir en este mercado no basta con un mapa bonito: hacen falta retención, sistemas de juego sólidos y un ritmo de publicación constante.\n\nFundé Safia Creative en 2024 para atacar este mercado en serio, con enfoque de estudio: pipeline de producción, herramientas e iteración guiada por datos en lugar de mapas one-shot.',
          },
          {
            heading: 'Mi rol',
            body: 'Dirijo el estudio con doble rol creativo y técnico: diseño de las experiencias, programación en Verse de todos los sistemas de juego, publicación y seguimiento de analytics.\n\nEn la práctica va desde el diseño de los bucles de retención hasta el código de persistencia de datos de jugadores, pasando por la optimización de las métricas de descubrimiento (miniaturas, títulos, tiempo de sesión) que deciden la visibilidad de un mapa en el ecosistema Fortnite.',
          },
          {
            heading: 'La tecnología',
            body: 'Todo el gameplay está programado en Verse, el lenguaje de Epic para UEFN. Los sistemas recurrentes (progresión persistente, tiendas en juego, eventos temporizados, UI custom) se construyen como módulos reutilizables entre mapas, lo que permite publicar rápido sin empezar de cero.\n\nCada experiencia está instrumentada: seguimos plays, tiempo de sesión y retención para decidir qué iterar. Ese bucle build → medir → iterar llevó al estudio de cero a millones de plays.',
          },
          {
            heading: 'Los resultados',
            body: 'Más de 3 millones de plays totales y una decena de experiencias publicadas desde 2024. El estudio sigue publicando e iterando. La actividad en vivo se ve en la sección Now de este sitio.',
          },
        ],
      },
    },
  },
  stakeplayercount: {
    slug: 'stakeplayercount',
    projectKey: 'stakeplayer',
    title: 'StakePlayerCount',
    year: '2025 →',
    accent: 'bg-cyan',
    image: '/projects/stakeplayer.jpg',
    ogImage: '/og-stakeplayercount.png',
    liveUrl: 'https://stakeplayercount.com/',
    stack: ['TypeScript', 'Node.js', 'Analytics', 'Stake Engine'],
    metrics: [
      {
        n: '2025',
        label: { fr: 'Lancé en', en: 'Launched', es: 'Lanzado en' },
      },
      {
        n: '24/7',
        label: {
          fr: 'Collecte en continu',
          en: 'Continuous tracking',
          es: 'Recogida continua',
        },
      },
      {
        n: '100%',
        label: {
          fr: 'Du catalogue suivi',
          en: 'Of the catalogue tracked',
          es: 'Del catálogo seguido',
        },
      },
    ],
    content: {
      fr: {
        metaTitle: 'StakePlayerCount · analytics temps réel des jeux Stake Engine',
        metaDescription:
          'Étude de cas : StakePlayerCount, le tracker de Simon GAY (simnJS) qui suit en temps réel les joueurs, le turnover et les heures de pointe des jeux Stake Engine.',
        tag: 'Stake Engine · Analytics',
        intro:
          'Quand Stake Engine a ouvert, aucun outil ne permettait aux créateurs de suivre leur nombre de joueurs. StakePlayerCount comble ce vide : player counts en temps réel, historique et heures de pointe pour tous les jeux de la plateforme.',
        sections: [
          {
            heading: 'Le contexte',
            body: 'Quand Stake Engine a ouvert, les studios publiaient à l\'aveugle : aucune donnée publique sur l\'audience des jeux. Impossible de savoir combien de joueurs sont en ligne sur ton propre jeu, encore moins sur ceux des autres. Pour un écosystème où chaque jeu représente des mois de production, c\'était un angle mort énorme.\n\nStakePlayerCount est né de notre propre besoin chez Play & Chill : on voulait ces chiffres, ils n\'existaient nulle part. Alors on a construit l\'outil, puis on l\'a ouvert à tout le monde.',
          },
          {
            heading: 'Le produit',
            body: 'Player counts en temps réel sur les jeux Stake Engine, historique, heures de pointe, turnover : de quoi répondre aux questions qu\'un studio se pose vraiment. Quel créneau pour sortir un jeu ? Quels thèmes performent ? Comment se situe mon jeu par rapport au marché ?\n\nL\'outil est public : les studios de l\'écosystème peuvent suivre leurs jeux et le marché dans son ensemble, sans rien installer.',
          },
          {
            heading: 'La tech',
            body: 'Un collecteur interroge le catalogue en continu et historise tout ; le site restitue les données en dashboards temps réel. TypeScript de bout en bout.\n\nLe vrai défi n\'est pas le dashboard, c\'est la fiabilité de la collecte dans la durée : un service qui doit tourner 24/7, encaisser les évolutions de la plateforme et ne jamais perdre d\'historique.',
          },
          {
            heading: 'La suite',
            body: 'L\'outil évolue avec l\'écosystème : nouvelles métriques, nouvelles vues, à mesure que Stake Engine grandit. Les chiffres sont en ligne sur stakeplayercount.com.',
          },
        ],
      },
      en: {
        metaTitle: 'StakePlayerCount · real-time analytics for Stake Engine games',
        metaDescription:
          'Case study: StakePlayerCount, the tracker by Simon GAY (simnJS) following live player counts, turnover and peak hours for Stake Engine games.',
        tag: 'Stake Engine · Analytics',
        intro:
          'When Stake Engine opened, creators had no tool to track their player counts. StakePlayerCount fills that gap: real-time player counts, history and peak hours for every game on the platform.',
        sections: [
          {
            heading: 'Context',
            body: 'When Stake Engine opened, studios were shipping blind: no public data on game audiences. No way to know how many players are online on your own game, let alone anyone else\'s. For an ecosystem where each game represents months of production, that was a huge blind spot.\n\nStakePlayerCount was born from our own need at Play & Chill: we wanted those numbers and they existed nowhere. So we built the tool, then opened it to everyone.',
          },
          {
            heading: 'The product',
            body: 'Real-time player counts for Stake Engine games, history, peak hours, turnover: answers to the questions a studio actually asks. When should we release? Which themes perform? How does my game compare to the market?\n\nThe tool is public: studios in the ecosystem can track their own games and the wider market without installing anything.',
          },
          {
            heading: 'The tech',
            body: 'A collector polls the catalogue continuously and stores everything; the site renders it as real-time dashboards. TypeScript end to end.\n\nThe real challenge isn\'t the dashboard, it\'s collection reliability over time: a service that must run 24/7, absorb platform changes and never lose history.',
          },
          {
            heading: 'What\'s next',
            body: 'The tool grows with the ecosystem: new metrics and new views as Stake Engine expands. The numbers are live on stakeplayercount.com.',
          },
        ],
      },
      es: {
        metaTitle: 'StakePlayerCount · analytics en tiempo real de juegos Stake Engine',
        metaDescription:
          'Caso de estudio: StakePlayerCount, el tracker de Simon GAY (simnJS) que sigue en tiempo real los jugadores, el turnover y las horas punta de los juegos Stake Engine.',
        tag: 'Stake Engine · Analytics',
        intro:
          'Cuando Stake Engine abrió, los creadores no tenían ninguna herramienta para seguir su número de jugadores. StakePlayerCount llena ese vacío: player counts en tiempo real, histórico y horas punta para todos los juegos de la plataforma.',
        sections: [
          {
            heading: 'El contexto',
            body: 'Cuando Stake Engine abrió, los estudios publicaban a ciegas: ningún dato público sobre la audiencia de los juegos. Imposible saber cuántos jugadores hay en tu propio juego, y menos en los de otros. Para un ecosistema donde cada juego representa meses de producción, era un punto ciego enorme.\n\nStakePlayerCount nació de nuestra propia necesidad en Play & Chill: queríamos esos números y no existían en ningún sitio. Así que construimos la herramienta y la abrimos a todos.',
          },
          {
            heading: 'El producto',
            body: 'Player counts en tiempo real de los juegos Stake Engine, histórico, horas punta, turnover: respuestas a las preguntas que un estudio realmente se hace. ¿Cuándo lanzar? ¿Qué temas funcionan? ¿Cómo se compara mi juego con el mercado?\n\nLa herramienta es pública: los estudios del ecosistema pueden seguir sus propios juegos y el mercado en su conjunto sin instalar nada.',
          },
          {
            heading: 'La tecnología',
            body: 'Un colector consulta el catálogo en continuo y lo historiza todo; el sitio lo muestra en dashboards en tiempo real. TypeScript de punta a punta.\n\nEl verdadero reto no es el dashboard, es la fiabilidad de la recogida en el tiempo: un servicio que debe funcionar 24/7, absorber los cambios de la plataforma y no perder nunca el histórico.',
          },
          {
            heading: 'Lo que viene',
            body: 'La herramienta evoluciona con el ecosistema: nuevas métricas y vistas a medida que Stake Engine crece. Los números están en stakeplayercount.com.',
          },
        ],
      },
    },
  },
  'uefn-store': {
    slug: 'uefn-store',
    projectKey: 'uefnstore',
    title: 'UEFN Store',
    year: '2026 →',
    accent: 'bg-violet',
    image: '/projects/uefnstore.jpg',
    ogImage: '/og-uefn-store.png',
    liveUrl: 'https://www.uefnstore.com/',
    stack: ['UEFN', 'Verse', 'TypeScript', 'Marketplace'],
    metrics: [
      {
        n: '2026',
        label: { fr: 'Lancé en', en: 'Launched', es: 'Lanzado en' },
      },
      {
        n: '4',
        label: {
          fr: 'Types d\'assets (Verse, 3D, UI, templates)',
          en: 'Asset types (Verse, 3D, UI, templates)',
          es: 'Tipos de assets (Verse, 3D, UI, templates)',
        },
      },
      {
        n: '3M+',
        label: {
          fr: 'Plays derrière les assets',
          en: 'Plays behind the assets',
          es: 'Plays detrás de los assets',
        },
      },
    ],
    content: {
      fr: {
        metaTitle: 'UEFN Store · marketplace d\'assets pour créateurs Fortnite',
        metaDescription:
          'Étude de cas : UEFN Store, la marketplace de Simon GAY (simnJS), avec scripts Verse, 3D, UI et templates prêts à l\'emploi pour les créateurs Fortnite Creative.',
        tag: 'UEFN · Marketplace',
        intro:
          'UEFN Store, c\'est simple : une marketplace d\'assets prêts à l\'emploi pour les créateurs Fortnite, avec scripts Verse, modèles 3D, kits UI et templates, issus de la production réelle de Safia Creative.',
        sections: [
          {
            heading: 'Le contexte',
            body: 'Des dizaines de milliers de créateurs construisent sur UEFN, et tous refont les mêmes choses : systèmes de progression, boutiques en jeu, UI, mécaniques de base en Verse. Chaque studio réinvente la roue dans son coin.\n\nAprès deux ans à produire des maps chez Safia Creative, le constat était simple : nos systèmes internes, éprouvés en production, valaient de l\'or pour les autres créateurs. Autant en faire un produit.',
          },
          {
            heading: 'Le produit',
            body: 'Une marketplace d\'assets prêts à l\'emploi pour Fortnite Creative : scripts Verse, modèles 3D, kits UI, templates de maps complets. Chaque asset est documenté et pensé pour s\'intégrer en minutes, pas en jours.\n\nLa différence avec un asset store généraliste : tout vient de la production réelle d\'un studio. Ce sont des systèmes déjà validés sur des maps qui totalisent plus de 3 millions de plays.',
          },
          {
            heading: 'Mon rôle',
            body: 'Je porte le produit de bout en bout : la plateforme web (catalogue, comptes, paiement, livraison des assets) comme le contenu. Les assets Verse sortent directement du pipeline Safia Creative, nettoyés, généralisés et documentés pour la revente.\n\nC\'est la suite logique du studio : la production alimente le store, le store finance la production.',
          },
          {
            heading: 'La suite',
            body: 'Le store est lancé en 2026 et le catalogue grandit en continu, alimenté par la production du studio. À explorer sur uefnstore.com.',
          },
        ],
      },
      en: {
        metaTitle: 'UEFN Store · asset marketplace for Fortnite creators',
        metaDescription:
          'Case study: UEFN Store, the marketplace by Simon GAY (simnJS), with ready-to-use Verse scripts, 3D, UI and templates for Fortnite Creative creators.',
        tag: 'UEFN · Marketplace',
        intro:
          'UEFN Store is simple: a marketplace of ready-to-use assets for Fortnite creators, with Verse scripts, 3D models, UI kits and templates, straight from Safia Creative\'s real production.',
        sections: [
          {
            heading: 'Context',
            body: 'Tens of thousands of creators build on UEFN, and they all rebuild the same things: progression systems, in-game shops, UI, core Verse mechanics. Every studio reinvents the wheel in its corner.\n\nAfter two years shipping maps at Safia Creative, the conclusion was obvious: our internal, production-proven systems were gold for other creators. Might as well make them a product.',
          },
          {
            heading: 'The product',
            body: 'A marketplace of ready-to-use assets for Fortnite Creative: Verse scripts, 3D models, UI kits, full map templates. Every asset is documented and designed to integrate in minutes, not days.\n\nThe difference with a generic asset store: everything comes from a studio\'s real production. These are systems already validated on maps totalling over 3 million plays.',
          },
          {
            heading: 'My role',
            body: 'I own the product end to end: the web platform (catalogue, accounts, payment, asset delivery) and the content. Verse assets come straight out of the Safia Creative pipeline, cleaned up, generalised and documented for resale.\n\nIt\'s the studio\'s logical next step: production feeds the store, the store funds production.',
          },
          {
            heading: 'What\'s next',
            body: 'The store launched in 2026 and the catalogue keeps growing, fed by the studio\'s production. Browse it at uefnstore.com.',
          },
        ],
      },
      es: {
        metaTitle: 'UEFN Store · marketplace de assets para creadores de Fortnite',
        metaDescription:
          'Caso de estudio: UEFN Store, la marketplace de Simon GAY (simnJS), con scripts Verse, 3D, UI y templates listos para usar para creadores de Fortnite Creative.',
        tag: 'UEFN · Marketplace',
        intro:
          'UEFN Store es simple: una marketplace de assets listos para usar para creadores de Fortnite, con scripts Verse, modelos 3D, kits de UI y templates, salidos de la producción real de Safia Creative.',
        sections: [
          {
            heading: 'El contexto',
            body: 'Decenas de miles de creadores construyen en UEFN, y todos rehacen las mismas cosas: sistemas de progresión, tiendas en juego, UI, mecánicas básicas en Verse. Cada estudio reinventa la rueda por su cuenta.\n\nTras dos años publicando mapas en Safia Creative, la conclusión era obvia: nuestros sistemas internos, probados en producción, valían oro para otros creadores. Mejor convertirlos en producto.',
          },
          {
            heading: 'El producto',
            body: 'Una marketplace de assets listos para usar para Fortnite Creative: scripts Verse, modelos 3D, kits de UI, templates de mapas completos. Cada asset está documentado y pensado para integrarse en minutos, no en días.\n\nLa diferencia con un asset store genérico: todo viene de la producción real de un estudio. Son sistemas ya validados en mapas que suman más de 3 millones de plays.',
          },
          {
            heading: 'Mi rol',
            body: 'Llevo el producto de punta a punta: la plataforma web (catálogo, cuentas, pago, entrega de assets) y el contenido. Los assets Verse salen directamente del pipeline de Safia Creative, limpiados, generalizados y documentados para la venta.\n\nEs el paso lógico del estudio: la producción alimenta la store, la store financia la producción.',
          },
          {
            heading: 'Lo que viene',
            body: 'La store se lanzó en 2026 y el catálogo crece en continuo, alimentado por la producción del estudio. Explóralo en uefnstore.com.',
          },
        ],
      },
    },
  },
  tacline: {
    slug: 'tacline',
    projectKey: 'tacline',
    title: 'Tacline',
    year: '2026 →',
    accent: 'bg-yellow',
    image: '/projects/tacline.png',
    ogImage: '/og-tacline.png',
    liveUrl: 'https://tacline.co/fr',
    stack: ['Airsoft', 'SaaS', 'Web', 'Paiements'],
    metrics: [
      {
        n: '2026',
        label: { fr: 'Lancement', en: 'Launch', es: 'Lanzamiento' },
      },
      {
        n: 'BETA',
        label: {
          fr: 'Bêta publique en cours',
          en: 'Public beta running',
          es: 'Beta pública en curso',
        },
      },
      {
        n: 'Dev',
        label: {
          fr: 'Mon rôle sur le projet',
          en: 'My role on the project',
          es: 'Mi rol en el proyecto',
        },
      },
    ],
    content: {
      fr: {
        metaTitle: 'Tacline · la plateforme qui connecte joueurs et organisateurs d\'airsoft',
        metaDescription:
          'Étude de cas : Tacline, la plateforme airsoft sur laquelle Simon GAY (simnJS) est développeur, avec recherche de parties, carte des terrains, inscriptions et paiement en ligne.',
        tag: 'Airsoft · SaaS',
        intro:
          'Le monde de l\'airsoft est compliqué, surtout pour les nouveaux joueurs. Tacline le simplifie : une plateforme pour trouver des parties, explorer les terrains et s\'inscrire en ligne. J\'y contribue comme développeur.',
        sections: [
          {
            heading: 'Le contexte',
            body: 'L\'airsoft est un monde difficile à pénétrer quand on débute : les parties s\'organisent dans des groupes Facebook fermés, les terrains se trouvent par bouche-à-oreille, et un nouveau joueur ne sait ni où jouer, ni avec qui, ni comment s\'inscrire. Une friction énorme pour un sport qui gagnerait à accueillir plus de monde.\n\nTacline attaque exactement ce problème : connecter les joueurs et les organisateurs pour des parties accessibles, organisées et sécurisées.',
          },
          {
            heading: 'Le produit',
            body: 'Recherche de parties par ville et par date, carte interactive des terrains, inscriptions avec paiement intégré, et des outils de gestion pour les organisateurs et les propriétaires de terrains.\n\nTout ce qui se réglait avant à coups de messages privés et de virements entre inconnus passe par un seul endroit, avec un vrai parcours d\'inscription.',
          },
          {
            heading: 'Mon rôle',
            body: 'Je suis développeur sur le projet. Tacline n\'est pas mon produit, c\'est celui de son fondateur. Je construis la plateforme au quotidien : fonctionnalités, fiabilité, itérations en bêta.\n\nC\'est un projet différent de mes studios : un vrai SaaS en équipe, avec un product owner, des utilisateurs réels et un rythme de livraison soutenu. Exactement le genre de contexte où j\'aime coder.',
          },
          {
            heading: 'La suite',
            body: 'La plateforme est en bêta publique et s\'améliore en continu avec les retours des joueurs et des organisateurs. Rendez-vous sur tacline.co.',
          },
        ],
      },
      en: {
        metaTitle: 'Tacline · the platform connecting airsoft players and organizers',
        metaDescription:
          'Case study: Tacline, the airsoft platform where Simon GAY (simnJS) works as a developer, with game discovery, field map, sign-ups and online payment.',
        tag: 'Airsoft · SaaS',
        intro:
          'The airsoft world is complicated, especially for new players. Tacline simplifies it: a platform to find games, explore fields and register online. I contribute as a developer.',
        sections: [
          {
            heading: 'Context',
            body: 'Airsoft is a hard world to break into: games are organised in closed Facebook groups, fields are found by word of mouth, and a new player doesn\'t know where to play, with whom, or how to sign up. Huge friction for a sport that would benefit from welcoming more people.\n\nTacline attacks exactly that problem: connecting players and organizers for accessible, organised and safe games.',
          },
          {
            heading: 'The product',
            body: 'Game search by city and date, an interactive map of fields, registrations with integrated payment, and management tools for organizers and field owners.\n\nEverything that used to happen through private messages and bank transfers between strangers now goes through one place, with a real sign-up flow.',
          },
          {
            heading: 'My role',
            body: 'I\'m a developer on the project. Tacline isn\'t my product, it\'s its founder\'s. I build the platform day to day: features, reliability, beta iterations.\n\nIt\'s a different kind of project from my studios: a real team SaaS, with a product owner, real users and a steady shipping pace. Exactly the kind of context I love coding in.',
          },
          {
            heading: 'What\'s next',
            body: 'The platform is in public beta and improves continuously with feedback from players and organizers. See it at tacline.co.',
          },
        ],
      },
      es: {
        metaTitle: 'Tacline · la plataforma que conecta jugadores y organizadores de airsoft',
        metaDescription:
          'Caso de estudio: Tacline, la plataforma de airsoft donde Simon GAY (simnJS) trabaja como desarrollador, con búsqueda de partidas, mapa de campos, inscripciones y pago online.',
        tag: 'Airsoft · SaaS',
        intro:
          'El mundo del airsoft es complicado, sobre todo para los nuevos jugadores. Tacline lo simplifica: una plataforma para encontrar partidas, explorar campos e inscribirse online. Contribuyo como desarrollador.',
        sections: [
          {
            heading: 'El contexto',
            body: 'El airsoft es un mundo difícil de penetrar cuando empiezas: las partidas se organizan en grupos cerrados de Facebook, los campos se encuentran por el boca a boca, y un jugador nuevo no sabe dónde jugar, con quién ni cómo inscribirse. Una fricción enorme para un deporte al que le vendría bien acoger a más gente.\n\nTacline ataca exactamente ese problema: conectar jugadores y organizadores para partidas accesibles, organizadas y seguras.',
          },
          {
            heading: 'El producto',
            body: 'Búsqueda de partidas por ciudad y fecha, mapa interactivo de campos, inscripciones con pago integrado, y herramientas de gestión para organizadores y propietarios de campos.\n\nTodo lo que antes se resolvía con mensajes privados y transferencias entre desconocidos pasa ahora por un solo lugar, con un flujo de inscripción real.',
          },
          {
            heading: 'Mi rol',
            body: 'Soy desarrollador en el proyecto. Tacline no es mi producto, es el de su fundador. Construyo la plataforma en el día a día: funcionalidades, fiabilidad, iteraciones en beta.\n\nEs un proyecto distinto a mis estudios: un SaaS real en equipo, con product owner, usuarios reales y un ritmo de entrega constante. Exactamente el tipo de contexto en el que me gusta programar.',
          },
          {
            heading: 'Lo que viene',
            body: 'La plataforma está en beta pública y mejora en continuo con el feedback de jugadores y organizadores. Está en tacline.co.',
          },
        ],
      },
    },
  },
  'playn-chill': {
    slug: 'playn-chill',
    projectKey: 'playnchill',
    title: "Play'n Chill",
    year: '2026 →',
    accent: 'bg-cyan',
    image: '/projects/planet-tycoon.png',
    ogImage: '/og-playn-chill.png',
    liveUrl: 'https://www.roblox.com/communities/35788348/Playn-Chill',
    stack: ['Roblox', 'roblox-ts', 'Luau', 'Live ops'],
    live: 'roblox',
    metrics: [
      {
        n: '3',
        label: { fr: 'Jeux publiés', en: 'Games shipped', es: 'Juegos publicados' },
      },
      {
        n: '2026',
        label: { fr: 'Studio fondé en', en: 'Studio founded', es: 'Estudio fundado' },
      },
      {
        n: '50K+',
        live: 'totalVisits',
        label: {
          fr: 'Visites cumulées',
          en: 'Total visits',
          es: 'Visitas totales',
        },
      },
    ],
    content: {
      fr: {
        metaTitle: "Play'n Chill · studio Roblox de Simon GAY (simnJS)",
        metaDescription:
          "Étude de cas : Play'n Chill, le studio Roblox fondé par Simon GAY (simnJS). Planet Tycoon, Weapons RNG, 100 Players Enter Youtubers, stats des jeux en direct.",
        tag: 'Roblox · Studio',
        intro:
          "Play'n Chill est mon studio Roblox : trois jeux publiés en quelques mois (Planet Tycoon, Weapons RNG, 100 Players Enter Youtubers) pour attaquer la plus grosse plateforme UGC du monde.",
        sections: [
          {
            heading: 'Le contexte',
            body: 'Roblox est la plus grosse plateforme UGC du monde : des dizaines de millions de joueurs quotidiens et un modèle qui rémunère directement les studios. Après Fortnite Creative avec Safia et Stake Engine avec Play & Chill, c\'était la suite logique : appliquer la même recette (production rapide, itération guidée par les données) au plus gros marché.\n\nJ\'ai fondé Play\'n Chill début 2026 avec une ambition affichée dans la description du groupe : « Creating the next generation of Roblox games ».',
          },
          {
            heading: 'Les jeux',
            body: 'Trois jeux publiés en cinq mois : 100 Players Enter Youtubers en février, Weapons RNG en mai, Planet Tycoon en juin, soit un rythme d\'un jeu toutes les six à huit semaines.\n\nChaque sortie teste un genre porteur de la plateforme (arène multijoueur, RNG, tycoon) pour identifier ce qui accroche avant d\'investir plus lourd. Planet Tycoon, le dernier né, est aussi le plus prometteur : plus de 2 000 favoris dès ses premières semaines.',
          },
          {
            heading: 'La tech',
            body: 'Les jeux sont développés en TypeScript via roblox-ts, compilé en Luau, ce qui applique le typage fort et l\'outillage TS au moteur Roblox. Les briques communes (UI kit, systèmes de progression, monétisation) sont partagées entre les jeux pour tenir la cadence de sortie.\n\nEt comme pour mes autres studios, tout est mesuré : les chiffres de cette page sont branchés en direct sur l\'API Roblox. Joueurs en ligne, visites et membres du groupe se mettent à jour en temps réel.',
          },
          {
            heading: 'La suite',
            body: 'Le studio itère : les genres validés reçoivent des mises à jour de contenu, les prochains prototypes sont en production. Le groupe et les jeux sont sur roblox.com.',
          },
        ],
      },
      en: {
        metaTitle: "Play'n Chill · Roblox studio by Simon GAY (simnJS)",
        metaDescription:
          "Case study: Play'n Chill, the Roblox studio founded by Simon GAY (simnJS). Planet Tycoon, Weapons RNG, 100 Players Enter Youtubers, with live game stats.",
        tag: 'Roblox · Studio',
        intro:
          "Play'n Chill is my Roblox studio: three games shipped in a few months (Planet Tycoon, Weapons RNG, 100 Players Enter Youtubers) to attack the biggest UGC platform in the world.",
        sections: [
          {
            heading: 'Context',
            body: 'Roblox is the biggest UGC platform in the world: tens of millions of daily players and a model that pays studios directly. After Fortnite Creative with Safia and Stake Engine with Play & Chill, it was the logical next step: apply the same recipe (fast production, data-driven iteration) to the biggest market.\n\nI founded Play\'n Chill in early 2026 with the ambition stated in the group description: "Creating the next generation of Roblox games".',
          },
          {
            heading: 'The games',
            body: 'Three games shipped in five months: 100 Players Enter Youtubers in February, Weapons RNG in May, Planet Tycoon in June, a game every six to eight weeks.\n\nEach release tests one of the platform\'s proven genres (multiplayer arena, RNG, tycoon) to find what sticks before investing heavier. Planet Tycoon, the latest, is also the most promising: over 2,000 favourites within its first weeks.',
          },
          {
            heading: 'The tech',
            body: 'The games are built in TypeScript via roblox-ts, compiled to Luau, which brings strong typing and the TS toolchain to the Roblox engine. Shared building blocks (UI kit, progression systems, monetisation) are reused across games to hold the release cadence.\n\nAnd like my other studios, everything is measured: the numbers on this page are wired straight into the Roblox API. Live players, visits and group members update in real time.',
          },
          {
            heading: "What's next",
            body: 'The studio iterates: validated genres get content updates, the next prototypes are in production. The group and games are on roblox.com.',
          },
        ],
      },
      es: {
        metaTitle: "Play'n Chill · estudio Roblox de Simon GAY (simnJS)",
        metaDescription:
          "Caso de estudio: Play'n Chill, el estudio Roblox fundado por Simon GAY (simnJS). Planet Tycoon, Weapons RNG, 100 Players Enter Youtubers, con stats en directo.",
        tag: 'Roblox · Studio',
        intro:
          "Play'n Chill es mi estudio Roblox: tres juegos publicados en pocos meses (Planet Tycoon, Weapons RNG, 100 Players Enter Youtubers) para atacar la plataforma UGC más grande del mundo.",
        sections: [
          {
            heading: 'El contexto',
            body: 'Roblox es la plataforma UGC más grande del mundo: decenas de millones de jugadores diarios y un modelo que paga directamente a los estudios. Después de Fortnite Creative con Safia y Stake Engine con Play & Chill, era el paso lógico: aplicar la misma receta (producción rápida, iteración guiada por datos) al mercado más grande.\n\nFundé Play\'n Chill a principios de 2026 con la ambición escrita en la descripción del grupo: «Creating the next generation of Roblox games».',
          },
          {
            heading: 'Los juegos',
            body: 'Tres juegos publicados en cinco meses: 100 Players Enter Youtubers en febrero, Weapons RNG en mayo, Planet Tycoon en junio, un juego cada seis a ocho semanas.\n\nCada lanzamiento prueba un género probado de la plataforma (arena multijugador, RNG, tycoon) para identificar qué funciona antes de invertir más fuerte. Planet Tycoon, el último, es también el más prometedor: más de 2.000 favoritos en sus primeras semanas.',
          },
          {
            heading: 'La tecnología',
            body: 'Los juegos se desarrollan en TypeScript vía roblox-ts, compilado a Luau, lo que aplica el tipado fuerte y el toolchain de TS al motor de Roblox. Las piezas comunes (UI kit, sistemas de progresión, monetización) se comparten entre juegos para mantener la cadencia.\n\nY como en mis otros estudios, todo se mide: los números de esta página están conectados en directo a la API de Roblox. Jugadores en línea, visitas y miembros del grupo se actualizan en tiempo real.',
          },
          {
            heading: 'Lo que viene',
            body: 'El estudio itera: los géneros validados reciben actualizaciones de contenido y los próximos prototipos están en producción. El grupo y los juegos están en roblox.com.',
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
