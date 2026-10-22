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
            body: 'En 2025, Stake, un des plus gros casinos en ligne au monde, a ouvert son catalogue aux studios tiers avec Stake Engine : des équipes indépendantes peuvent y publier leurs propres jeux et toucher une part des revenus, sans monter un opérateur, gérer des licences ni acquérir des joueurs. Historiquement, le développement de jeux casino était verrouillé par une poignée de studios B2B établis. Cette porte-là ne s\'ouvre pas souvent.\n\nJ\'ai fondé Play & Chill pour prendre cette vague tôt, avec une conviction simple : arriver tôt sur une plateforme UGC naissante, avec une vraie capacité de production.',
          },
          {
            heading: 'Mon rôle',
            body: 'Je dirige le studio et la production : game design des slots, modèles mathématiques, développement front-end et pipeline.\n\nSur un jeu casino, la moitié du travail est invisible : le modèle mathématique (RTP, volatilité, table des gains) doit être simulé sur des millions de spins et validé avant toute publication. L\'autre moitié, celle qu\'on voit (le rendu, le game feel, les animations), décide si les joueurs restent. Je travaille sur les deux.',
          },
          {
            heading: 'La tech',
            body: 'Les jeux tournent sur le RGS de Stake Engine : chaque résultat est calculé côté serveur, le front ne fait que le mettre en scène. Le front est en TypeScript/React, construit au-dessus du web SDK de Stake Engine que nous avons adapté à nos besoins.\n\nPour enchaîner les jeux sans repartir de zéro, tout est industrialisé : templates de jeu réutilisables, simulateurs pour valider les modèles mathématiques, et de l\'outillage maison autour de l\'écosystème, dont stake-dev-tool, publié en open source, et Engine Players, notre tracker d\'audience des jeux Stake Engine.',
          },
          {
            heading: 'La suite',
            body: 'Le studio produit en continu et le pipeline s\'affine à chaque jeu. L\'objectif : faire de Play & Chill un studio reconnu de l\'écosystème Stake Engine. Les sorties s\'annoncent sur playandchill.bet.',
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
            body: 'In 2025, Stake, one of the biggest online casinos in the world, opened its catalogue to third-party studios with Stake Engine: independent teams can publish their own games and earn a revenue share, without becoming an operator, handling licences or acquiring players. Historically, casino game development was locked up by a handful of established B2B studios. That door doesn\'t open often.\n\nI founded Play & Chill to catch that wave early, with a simple conviction: show up early on a nascent UGC platform, with real production capacity.',
          },
          {
            heading: 'My role',
            body: 'I run the studio and its production: slot game design, math models, front-end development and pipeline.\n\nHalf the work on a casino game is invisible: the math model (RTP, volatility, paytable) has to be simulated over millions of spins and validated before anything ships. The other half, the visible one (rendering, game feel, animations), decides whether players stay. I work on both.',
          },
          {
            heading: 'The tech',
            body: 'Games run on Stake Engine\'s RGS: every outcome is computed server-side, the front-end only stages it. The front-end is TypeScript/React, built on top of Stake Engine\'s web SDK, which we adapted to our needs.\n\nTo ship game after game without starting over, everything is industrialised: reusable game templates, simulators to validate math models, and in-house tooling around the ecosystem, including stake-dev-tool, released open source, and Engine Players, our audience tracker for Stake Engine games.',
          },
          {
            heading: 'What\'s next',
            body: 'The studio ships continuously and the pipeline sharpens with every game. The goal: make Play & Chill a recognised studio in the Stake Engine ecosystem. Releases are announced on playandchill.bet.',
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
            body: 'En 2025, Stake, uno de los casinos online más grandes del mundo, abrió su catálogo a estudios terceros con Stake Engine: equipos independientes pueden publicar sus propios juegos y cobrar una parte de los ingresos, sin montar un operador, gestionar licencias ni captar jugadores. Históricamente, el desarrollo de juegos de casino estaba cerrado a un puñado de estudios B2B establecidos. Esa puerta no se abre a menudo.\n\nFundé Play & Chill para tomar esa ola temprano, con una convicción simple: llegar pronto a una plataforma UGC naciente, con capacidad real de producción.',
          },
          {
            heading: 'Mi rol',
            body: 'Dirijo el estudio y su producción: diseño de slots, modelos matemáticos, desarrollo front-end y pipeline.\n\nLa mitad del trabajo en un juego de casino es invisible: el modelo matemático (RTP, volatilidad, tabla de pagos) debe simularse sobre millones de spins y validarse antes de publicar. La otra mitad, la visible (render, game feel, animaciones), decide si los jugadores se quedan. Trabajo en ambas.',
          },
          {
            heading: 'La tecnología',
            body: 'Los juegos corren sobre el RGS de Stake Engine: cada resultado se calcula en el servidor, el front solo lo pone en escena. El front es TypeScript/React, construido sobre el web SDK de Stake Engine, adaptado a nuestras necesidades.\n\nPara encadenar juegos sin empezar de cero, todo está industrializado: templates reutilizables, simuladores para validar los modelos matemáticos y herramientas propias del ecosistema, incluyendo stake-dev-tool, publicado open source, y Engine Players, nuestro tracker de audiencia de juegos Stake Engine.',
          },
          {
            heading: 'Lo que viene',
            body: 'El estudio produce en continuo y el pipeline mejora con cada juego. El objetivo: hacer de Play & Chill un estudio reconocido del ecosistema Stake Engine. Los lanzamientos se anuncian en playandchill.bet.',
          },
        ],
      },
    },
  },
  stakeplayercount: {
    slug: 'stakeplayercount',
    projectKey: 'stakeplayer',
    title: 'Engine Players',
    year: '2025 →',
    accent: 'bg-cyan',
    image: '/projects/stakeplayer.jpg',
    ogImage: '/og-stakeplayercount.png',
    liveUrl: 'https://engineplayers.com/',
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
        metaTitle: 'Engine Players · analytics temps réel des jeux Stake Engine',
        metaDescription:
          'Étude de cas : Engine Players, le tracker de Simon GAY (simnJS) qui suit en temps réel les joueurs, le turnover et les heures de pointe des jeux Stake Engine.',
        tag: 'Stake Engine · Analytics',
        intro:
          'Quand Stake Engine a ouvert, aucun outil ne permettait aux créateurs de suivre leur nombre de joueurs. Engine Players comble ce vide : player counts en temps réel, historique et heures de pointe pour tous les jeux de la plateforme.',
        sections: [
          {
            heading: 'Le contexte',
            body: 'Quand Stake Engine a ouvert, les studios publiaient à l\'aveugle : aucune donnée publique sur l\'audience des jeux. Impossible de savoir combien de joueurs sont en ligne sur ton propre jeu, encore moins sur ceux des autres. Pour un écosystème où chaque jeu représente des mois de production, c\'était un angle mort énorme.\n\nEngine Players est né de notre propre besoin chez Play & Chill : on voulait ces chiffres, ils n\'existaient nulle part. Alors on a construit l\'outil, puis on l\'a ouvert à tout le monde.',
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
            body: 'L\'outil évolue avec l\'écosystème : nouvelles métriques, nouvelles vues, à mesure que Stake Engine grandit. Les chiffres sont en ligne sur engineplayers.com.',
          },
        ],
      },
      en: {
        metaTitle: 'Engine Players · real-time analytics for Stake Engine games',
        metaDescription:
          'Case study: Engine Players, the tracker by Simon GAY (simnJS) following live player counts, turnover and peak hours for Stake Engine games.',
        tag: 'Stake Engine · Analytics',
        intro:
          'When Stake Engine opened, creators had no tool to track their player counts. Engine Players fills that gap: real-time player counts, history and peak hours for every game on the platform.',
        sections: [
          {
            heading: 'Context',
            body: 'When Stake Engine opened, studios were shipping blind: no public data on game audiences. No way to know how many players are online on your own game, let alone anyone else\'s. For an ecosystem where each game represents months of production, that was a huge blind spot.\n\nEngine Players was born from our own need at Play & Chill: we wanted those numbers and they existed nowhere. So we built the tool, then opened it to everyone.',
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
            body: 'The tool grows with the ecosystem: new metrics and new views as Stake Engine expands. The numbers are live on engineplayers.com.',
          },
        ],
      },
      es: {
        metaTitle: 'Engine Players · analytics en tiempo real de juegos Stake Engine',
        metaDescription:
          'Caso de estudio: Engine Players, el tracker de Simon GAY (simnJS) que sigue en tiempo real los jugadores, el turnover y las horas punta de los juegos Stake Engine.',
        tag: 'Stake Engine · Analytics',
        intro:
          'Cuando Stake Engine abrió, los creadores no tenían ninguna herramienta para seguir su número de jugadores. Engine Players llena ese vacío: player counts en tiempo real, histórico y horas punta para todos los juegos de la plataforma.',
        sections: [
          {
            heading: 'El contexto',
            body: 'Cuando Stake Engine abrió, los estudios publicaban a ciegas: ningún dato público sobre la audiencia de los juegos. Imposible saber cuántos jugadores hay en tu propio juego, y menos en los de otros. Para un ecosistema donde cada juego representa meses de producción, era un punto ciego enorme.\n\nEngine Players nació de nuestra propia necesidad en Play & Chill: queríamos esos números y no existían en ningún sitio. Así que construimos la herramienta y la abrimos a todos.',
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
            body: 'La herramienta evoluciona con el ecosistema: nuevas métricas y vistas a medida que Stake Engine crece. Los números están en engineplayers.com.',
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
            body: 'Roblox est la plus grosse plateforme UGC du monde : des dizaines de millions de joueurs quotidiens et un modèle qui rémunère directement les studios. Après Stake Engine avec Play & Chill, c\'était la suite logique : appliquer la même recette (production rapide, itération guidée par les données) au plus gros marché.\n\nJ\'ai fondé Play\'n Chill début 2026 avec une ambition affichée dans la description du groupe : « Creating the next generation of Roblox games ».',
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
            body: 'Roblox is the biggest UGC platform in the world: tens of millions of daily players and a model that pays studios directly. After Stake Engine with Play & Chill, it was the logical next step: apply the same recipe (fast production, data-driven iteration) to the biggest market.\n\nI founded Play\'n Chill in early 2026 with the ambition stated in the group description: "Creating the next generation of Roblox games".',
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
            body: 'Roblox es la plataforma UGC más grande del mundo: decenas de millones de jugadores diarios y un modelo que paga directamente a los estudios. Después de Stake Engine con Play & Chill, era el paso lógico: aplicar la misma receta (producción rápida, iteración guiada por datos) al mercado más grande.\n\nFundé Play\'n Chill a principios de 2026 con la ambición escrita en la descripción del grupo: «Creating the next generation of Roblox games».',
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
