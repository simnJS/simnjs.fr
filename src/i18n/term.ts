import { useI18n } from './I18nProvider'
import type { Locale } from './translations'

// Textes de la v2 « terminal ». Les commandes, chemins et noms de fichiers
// restent en anglais dans toutes les langues : c'est un shell.

export type TermDict = {
  hero: {
    tagline: string
    projects: string
    contact: string
    poke: string
    listening: string
  }
  titles: {
    projects: string
    oss: string
    clients: string
    stack: string
    activity: string
    about: string
    contact: string
  }
  quake: { open: string; close: string; hint: string }
  ff: {
    os: string
    host: string
    uptime: (years: number, days: number, clock: string) => string
    studio: string
    shell: string
    plays: string
    commits: (commits: number, streak: number) => string
    loading: string
  }
  hint: string
  keys: string
  help: {
    title: string
    pipes: string
    cmds: Record<string, string>
  }
  errors: {
    notFound: (cmd: string) => string
    noDir: (path: string) => string
    noFile: (path: string) => string
    isDir: (path: string) => string
    unknownProject: (name: string) => string
    usage: (usage: string) => string
    network: string
  }
  whoami: string
  bio: string[]
  opening: (url: string) => string
  langSet: string
  copied: string
  sudo: string
  spotify: { playing: string; last: string; quiet: string }
  roblox: { title: string; playing: string; visits: string; members: string }
  activity: { loading: string; empty: string; hidden: string; following: string }
  contributions: (total: number) => string
  heat: { less: string; more: string; unavailable: string }
  projects: {
    all: string
    caseStudy: string
    visit: string
    source: string
    preview: string
    desc: Record<string, string>
  }
  clients: string
  stack: string
  contact: { title: string; mail: string; discord: string }
  notFound: string
  back: string
}

const DESC_EN: Record<string, string> = {
  'play-and-chill':
    'My casino studio. Original slot games for Stake Engine, on our own Pixi.js front-end engine.',
  'playn-chill':
    'My Roblox studio. Planet Tycoon, Weapons RNG, 100 Players Enter Youtubers: a new game every six to eight weeks.',
  'engine-players':
    'Real-time tracker for Stake Engine games: player counts, turnover, peak hours.',
  'simnjs-store':
    'Ready-to-use Verse code, game systems and UI for UEFN creators, tested in-game.',
  tacline:
    'Platform connecting airsoft players and organizers: game discovery, field map, sign-ups and online payment.',
  'stake-dev-tool':
    'Open-source workbench and cloud platform for Stake Engine slot games. 6k+ downloads.',
  'hangar-ai':
    'Terminal multiplexer for CLI coding agents, with a shared task board they drive over MCP.',
  'prism-verse':
    'Typed player data for UEFN Verse: one schema, generated persistence and migrations, and a lock against breaking changes.',
  'verse-on-github':
    'I got Verse into GitHub Linguist and highlight.js, so .verse files finally get colors on GitHub.',
}

const DESC_FR: Record<string, string> = {
  'play-and-chill':
    'Mon studio casino. Des slots originaux pour Stake Engine, sur notre propre moteur front Pixi.js.',
  'playn-chill':
    'Mon studio Roblox. Planet Tycoon, Weapons RNG, 100 Players Enter Youtubers : un nouveau jeu toutes les six à huit semaines.',
  'engine-players':
    'Tracker temps réel des jeux Stake Engine : joueurs, turnover, heures de pointe.',
  'simnjs-store':
    'Du code Verse prêt à l’emploi, des systèmes de jeu et de l’UI pour les créateurs UEFN, testés en jeu.',
  tacline:
    'Plateforme qui connecte joueurs et organisateurs d’airsoft : recherche de parties, carte des terrains, inscriptions et paiement en ligne.',
  'stake-dev-tool':
    'Atelier open source et plateforme cloud pour les slots Stake Engine. 6k+ téléchargements.',
  'hangar-ai':
    'Multiplexeur de terminaux pour agents de code en CLI, avec un tableau de tâches partagé qu’ils pilotent via MCP.',
  'prism-verse':
    'Données joueur typées pour Verse : un schéma, la persistance et les migrations générées, et un verrou contre les changements cassants.',
  'verse-on-github':
    'J’ai fait entrer Verse dans GitHub Linguist et highlight.js : les fichiers .verse ont enfin leurs couleurs sur GitHub.',
}

const DESC_ES: Record<string, string> = {
  'play-and-chill':
    'Mi estudio de casino. Slots originales para Stake Engine, sobre nuestro propio motor front-end en Pixi.js.',
  'playn-chill':
    'Mi estudio de Roblox. Planet Tycoon, Weapons RNG, 100 Players Enter Youtubers: un juego nuevo cada seis a ocho semanas.',
  'engine-players':
    'Tracker en tiempo real de los juegos de Stake Engine: jugadores, turnover, horas pico.',
  'simnjs-store':
    'Código Verse listo para usar, sistemas de juego y UI para creadores de UEFN, probados en el juego.',
  tacline:
    'Plataforma que conecta jugadores y organizadores de airsoft: búsqueda de partidas, mapa de campos, inscripciones y pago en línea.',
  'stake-dev-tool':
    'Banco de trabajo open source y plataforma cloud para slots de Stake Engine. Más de 6k descargas.',
  'hangar-ai':
    'Multiplexor de terminales para agentes de código en CLI, con un tablero de tareas compartido que controlan por MCP.',
  'prism-verse':
    'Datos de jugador tipados para Verse: un esquema, persistencia y migraciones generadas, y un bloqueo contra cambios incompatibles.',
  'verse-on-github':
    'Llevé Verse a GitHub Linguist y highlight.js: los archivos .verse por fin tienen colores en GitHub.',
}

export const TERM: Record<Locale, TermDict> = {
  en: {
    hero: {
      tagline:
        "I make games and the tools around them. I run Play'n Chill, a studio shipping slot games on Stake Engine and Roblox games, and I build Verse tools for Fortnite creators.",
      projects: 'See the projects',
      contact: 'Get in touch',
      poke: 'poke him :3',
      listening: 'listening to',
    },
    titles: {
      projects: 'Projects',
      oss: 'Open source',
      clients: 'Worked with',
      stack: 'Stack',
      activity: 'GitHub activity',
      about: 'About',
      contact: 'Contact',
    },
    quake: {
      open: 'terminal',
      close: 'close the terminal',
      hint: 'press ` anywhere to open the terminal, then type help',
    },
    ff: {
      os: 'Simon GAY, software engineer',
      host: 'Lyon, France',
      uptime: (y, d, c) => `${y} years, ${d} days, ${c}`,
      studio: "Play'n Chill (slots, Roblox)",
      shell: 'Claude Code, agents side by side',
      plays: '3M+ across 10+ experiences',
      commits: (c, s) => `${c.toLocaleString('en')} in the last 12 months, ${s}-day streak`,
      loading: 'asking github.com…',
    },
    hint: 'type a command, or click one:',
    keys: 'Tab completes, ↑↓ walks the history, → takes the grey suggestion',
    help: {
      title: 'commands',
      pipes: 'pipe output into grep, head or wc, like projects | grep stake',
      cmds: {
        help: 'show this list',
        whoami: 'who is behind this terminal',
        fastfetch: 'print the system info again',
        ls: 'list files',
        cd: 'change directory',
        cat: 'print a file',
        open: 'open a project in a new tab',
        projects: 'list my projects',
        activity: 'my latest GitHub activity, live',
        spotify: 'what I am listening to',
        roblox: 'live players in my Roblox games',
        contact: 'how to reach me',
        lang: 'switch language: lang fr, en or es',
        history: 'the commands you typed',
        clear: 'clear the screen',
        boykisser: ':3',
      },
    },
    errors: {
      notFound: (c) => `${c}: command not found. Type help to see what works.`,
      noDir: (p) => `cd: no such directory: ${p}`,
      noFile: (p) => `cat: ${p}: no such file`,
      isDir: (p) => `cat: ${p}: is a directory, try ls ${p}`,
      unknownProject: (n) => `open: no project called ${n}. Type projects to see them.`,
      usage: (u) => `usage: ${u}`,
      network: 'The request did not go through. Try again in a minute.',
    },
    whoami:
      "simnJS (Simon GAY), software engineer in Lyon. I run Play'n Chill and build tools for game creators.",
    bio: [
      "Software engineer in Lyon. I run Play'n Chill, a studio that ships slot games on Stake Engine and a new Roblox game every six to eight weeks.",
      'I also build Verse tools and game systems for Fortnite creators, and the tooling I am missing along the way, usually with a few AI agents running side by side.',
    ],
    opening: (u) => `opening ${u}`,
    langSet: 'language set to English',
    copied: 'copied to the clipboard',
    sudo: 'simnJS is not in the sudoers file. This incident will be reported to a boykisser :3',
    spotify: {
      playing: 'now playing',
      last: 'last played',
      quiet: 'Spotify is quiet right now.',
    },
    roblox: { title: "Play'n Chill on Roblox, live", playing: 'playing', visits: 'visits', members: 'members' },
    activity: {
      loading: 'connecting to github.com/simnJS',
      empty: 'No public activity in the last few days.',
      hidden: 'private repo, content hidden',
      following: 'following, new events show up here',
    },
    contributions: (n) => `${n.toLocaleString('en')} contributions in the last year`,
    heat: { less: 'less', more: 'more', unavailable: 'The contribution graph is not available right now. It lives on' },
    projects: {
      all: 'all',
      caseStudy: 'read the case study',
      visit: 'open the site',
      source: 'source',
      preview: 'preview',
      desc: DESC_EN,
    },
    clients: 'studios, creators and brands I have worked with',
    stack: 'what I build with',
    contact: {
      title: 'Got a project? Write me.',
      mail: 'send a mail',
      discord: 'copy my Discord',
    },
    notFound: 'This page does not exist. The terminal is still on the home page.',
    back: 'back to the terminal',
  },
  fr: {
    hero: {
      tagline:
        "Je fais des jeux et les outils qui vont avec. Je dirige Play'n Chill, un studio qui sort des slots sur Stake Engine et des jeux Roblox, et je code des outils Verse pour les créateurs Fortnite.",
      projects: 'Voir les projets',
      contact: 'Me contacter',
      poke: 'touche-le :3',
      listening: 'en écoute',
    },
    titles: {
      projects: 'Projets',
      oss: 'Open source',
      clients: 'Ils m’ont fait confiance',
      stack: 'Stack',
      activity: 'Activité GitHub',
      about: 'À propos',
      contact: 'Contact',
    },
    quake: {
      open: 'terminal',
      close: 'fermer le terminal',
      hint: 'appuie sur ` n’importe où pour ouvrir le terminal, puis tape help',
    },
    ff: {
      os: 'Simon GAY, ingénieur logiciel',
      host: 'Lyon, France',
      uptime: (y, d, c) => `${y} ans, ${d} jours, ${c}`,
      studio: "Play'n Chill (slots, Roblox)",
      shell: 'Claude Code, agents en parallèle',
      plays: '3M+ sur 10+ expériences',
      commits: (c, s) => `${c.toLocaleString('fr')} sur 12 mois, série de ${s} j`,
      loading: 'on demande à github.com…',
    },
    hint: 'tape une commande, ou clique dessus :',
    keys: 'Tab complète, ↑↓ parcourt l’historique, → prend la suggestion grisée',
    help: {
      title: 'commandes',
      pipes: 'enchaîne avec grep, head ou wc, par exemple projects | grep stake',
      cmds: {
        help: 'affiche cette liste',
        whoami: 'qui est derrière ce terminal',
        fastfetch: 'réaffiche les infos système',
        ls: 'liste les fichiers',
        cd: 'change de dossier',
        cat: 'affiche un fichier',
        open: 'ouvre un projet dans un nouvel onglet',
        projects: 'liste mes projets',
        activity: 'ma dernière activité GitHub, en direct',
        spotify: 'ce que j’écoute',
        roblox: 'les joueurs en direct sur mes jeux Roblox',
        contact: 'comment me joindre',
        lang: 'change de langue : lang fr, en ou es',
        history: 'les commandes que tu as tapées',
        clear: 'efface l’écran',
        boykisser: ':3',
      },
    },
    errors: {
      notFound: (c) => `${c} : commande introuvable. Tape help pour voir ce qui marche.`,
      noDir: (p) => `cd : dossier introuvable : ${p}`,
      noFile: (p) => `cat : ${p} : fichier introuvable`,
      isDir: (p) => `cat : ${p} est un dossier, essaie ls ${p}`,
      unknownProject: (n) => `open : aucun projet nommé ${n}. Tape projects pour les voir.`,
      usage: (u) => `usage : ${u}`,
      network: 'La requête n’est pas passée. Réessaie dans une minute.',
    },
    whoami:
      "simnJS (Simon GAY), ingénieur logiciel à Lyon. Je dirige Play'n Chill et je fais des outils pour les créateurs de jeux.",
    bio: [
      "Ingénieur logiciel à Lyon. Je dirige Play'n Chill, un studio qui sort des slots sur Stake Engine et un nouveau jeu Roblox toutes les six à huit semaines.",
      'Je fais aussi des outils Verse et des systèmes de jeu pour les créateurs Fortnite, et l’outillage qui me manque en route, souvent avec quelques agents IA en parallèle.',
    ],
    opening: (u) => `ouverture de ${u}`,
    langSet: 'langue : français',
    copied: 'copié dans le presse-papiers',
    sudo: 'simnJS n’est pas dans le fichier sudoers. Cet incident sera signalé à un boykisser :3',
    spotify: {
      playing: 'en écoute',
      last: 'dernier son',
      quiet: 'Spotify est silencieux pour l’instant.',
    },
    roblox: { title: "Play'n Chill sur Roblox, en direct", playing: 'en jeu', visits: 'visites', members: 'membres' },
    activity: {
      loading: 'connexion à github.com/simnJS',
      empty: 'Pas d’activité publique ces derniers jours.',
      hidden: 'repo privé, contenu masqué',
      following: 'en écoute, les nouveaux événements arrivent ici',
    },
    contributions: (n) => `${n.toLocaleString('fr')} contributions sur les 12 derniers mois`,
    heat: { less: 'moins', more: 'plus', unavailable: 'Le graphe des contributions n’est pas disponible pour l’instant. Il est aussi sur' },
    projects: {
      all: 'tout',
      caseStudy: 'lire l’étude de cas',
      visit: 'ouvrir le site',
      source: 'code source',
      preview: 'aperçu',
      desc: DESC_FR,
    },
    clients: 'studios, créateurs et marques avec qui j’ai bossé',
    stack: 'ce avec quoi je construis',
    contact: {
      title: 'Un projet ? Écris-moi.',
      mail: 'envoyer un mail',
      discord: 'copier mon Discord',
    },
    notFound: 'Cette page n’existe pas. Le terminal t’attend sur l’accueil.',
    back: 'retour au terminal',
  },
  es: {
    hero: {
      tagline:
        "Hago juegos y las herramientas que los rodean. Dirijo Play'n Chill, un estudio que publica slots en Stake Engine y juegos de Roblox, y programo herramientas Verse para creadores de Fortnite.",
      projects: 'Ver los proyectos',
      contact: 'Contactarme',
      poke: 'tócalo :3',
      listening: 'escuchando',
    },
    titles: {
      projects: 'Proyectos',
      oss: 'Open source',
      clients: 'Han confiado en mí',
      stack: 'Stack',
      activity: 'Actividad en GitHub',
      about: 'Sobre mí',
      contact: 'Contacto',
    },
    quake: {
      open: 'terminal',
      close: 'cerrar la terminal',
      hint: 'pulsa ` en cualquier parte para abrir la terminal, y escribe help',
    },
    ff: {
      os: 'Simon GAY, ingeniero de software',
      host: 'Lyon, Francia',
      uptime: (y, d, c) => `${y} años, ${d} días, ${c}`,
      studio: "Play'n Chill (slots, Roblox)",
      shell: 'Claude Code, agentes en paralelo',
      plays: '3M+ en 10+ experiencias',
      commits: (c, s) => `${c.toLocaleString('es')} en 12 meses, racha de ${s} días`,
      loading: 'preguntando a github.com…',
    },
    hint: 'escribe un comando, o haz clic en uno:',
    keys: 'Tab completa, ↑↓ recorre el historial, → acepta la sugerencia gris',
    help: {
      title: 'comandos',
      pipes: 'encadena con grep, head o wc, por ejemplo projects | grep stake',
      cmds: {
        help: 'muestra esta lista',
        whoami: 'quién está detrás de esta terminal',
        fastfetch: 'vuelve a mostrar la info del sistema',
        ls: 'lista los archivos',
        cd: 'cambia de carpeta',
        cat: 'muestra un archivo',
        open: 'abre un proyecto en una pestaña nueva',
        projects: 'lista mis proyectos',
        activity: 'mi última actividad en GitHub, en vivo',
        spotify: 'lo que estoy escuchando',
        roblox: 'jugadores en vivo en mis juegos de Roblox',
        contact: 'cómo contactarme',
        lang: 'cambia de idioma: lang fr, en o es',
        history: 'los comandos que escribiste',
        clear: 'limpia la pantalla',
        boykisser: ':3',
      },
    },
    errors: {
      notFound: (c) => `${c}: comando no encontrado. Escribe help para ver qué funciona.`,
      noDir: (p) => `cd: no existe la carpeta: ${p}`,
      noFile: (p) => `cat: ${p}: no existe el archivo`,
      isDir: (p) => `cat: ${p} es una carpeta, prueba ls ${p}`,
      unknownProject: (n) => `open: no hay ningún proyecto llamado ${n}. Escribe projects para verlos.`,
      usage: (u) => `uso: ${u}`,
      network: 'La petición no salió bien. Vuelve a intentarlo en un minuto.',
    },
    whoami:
      "simnJS (Simon GAY), ingeniero de software en Lyon. Dirijo Play'n Chill y hago herramientas para creadores de juegos.",
    bio: [
      "Ingeniero de software en Lyon. Dirijo Play'n Chill, un estudio que publica slots en Stake Engine y un juego nuevo de Roblox cada seis a ocho semanas.",
      'También hago herramientas Verse y sistemas de juego para creadores de Fortnite, y las herramientas que me faltan por el camino, casi siempre con varios agentes de IA en paralelo.',
    ],
    opening: (u) => `abriendo ${u}`,
    langSet: 'idioma: español',
    copied: 'copiado al portapapeles',
    sudo: 'simnJS no está en el archivo sudoers. Este incidente será reportado a un boykisser :3',
    spotify: {
      playing: 'sonando ahora',
      last: 'último tema',
      quiet: 'Spotify está en silencio ahora mismo.',
    },
    roblox: { title: "Play'n Chill en Roblox, en vivo", playing: 'jugando', visits: 'visitas', members: 'miembros' },
    activity: {
      loading: 'conectando con github.com/simnJS',
      empty: 'No hay actividad pública en los últimos días.',
      hidden: 'repo privado, contenido oculto',
      following: 'escuchando, los nuevos eventos aparecen aquí',
    },
    contributions: (n) => `${n.toLocaleString('es')} contribuciones en el último año`,
    heat: { less: 'menos', more: 'más', unavailable: 'El gráfico de contribuciones no está disponible ahora. También está en' },
    projects: {
      all: 'todo',
      caseStudy: 'leer el caso de estudio',
      visit: 'abrir el sitio',
      source: 'código',
      preview: 'vista previa',
      desc: DESC_ES,
    },
    clients: 'estudios, creadores y marcas con los que he trabajado',
    stack: 'con lo que construyo',
    contact: {
      title: '¿Un proyecto? Escríbeme.',
      mail: 'enviar un correo',
      discord: 'copiar mi Discord',
    },
    notFound: 'Esta página no existe. La terminal te espera en la página de inicio.',
    back: 'volver a la terminal',
  },
}

export function useTerm(): TermDict {
  return TERM[useI18n().locale]
}
