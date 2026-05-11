import { type ReactNode, useRef } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import {
  ArrowUpRight,
  Github,
  Globe,
  Mail,
  Star,
} from 'lucide-react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { useI18n } from '../i18n/I18nProvider'
import { LanguageSelector } from '../i18n/LanguageSelector'
import type { Dictionary } from '../i18n/translations'
import { LiveActivity } from '../components/LiveActivity'

gsap.registerPlugin(ScrollTrigger, useGSAP)

export const Route = createFileRoute('/')({ component: Home })

// ─── Édite ici pour mettre à jour ───────────────────────────────────────────
const ME = {
  name: 'simnJS',
  fullName: 'Simon GAY',
  location: 'Lyon, FR',
  email: 'contact@simnjs.fr',
  website: 'https://simnjs.fr',
  github: 'https://github.com/simnJS',
  studio: { name: 'Safia Creative', url: 'https://www.safia-creative.com/' },
}

type ProjectKey = 'safia' | 'playandchill' | 'stakeplayer' | 'uefnstore'

const PROJECTS: Array<{
  n: string
  key: ProjectKey
  title: string
  accent: string
  year: string
  href: string
  image?: string
}> = [
  {
    n: '01',
    key: 'safia',
    title: 'Safia Creative',
    accent: 'bg-yellow',
    year: '2024 →',
    href: 'https://www.safia-creative.com/',
    image: '/projects/safia.jpg',
  },
  {
    n: '02',
    key: 'playandchill',
    title: 'Play & Chill',
    accent: 'bg-coral',
    year: '2025 →',
    href: 'https://playandchill.bet/',
    image: '/projects/playandchill.png',
  },
  {
    n: '03',
    key: 'stakeplayer',
    title: 'StakePlayerCount',
    accent: 'bg-cyan',
    year: '2025 →',
    href: 'https://stakeplayercount.com/',
    image: '/projects/stakeplayer.jpg',
  },
  {
    n: '04',
    key: 'uefnstore',
    title: 'UEFN Store',
    accent: 'bg-violet',
    year: '2026 →',
    href: 'https://www.uefnstore.com/',
    image: '/projects/uefnstore.jpg',
  },
]

const STACK = [
  'UEFN',
  'Verse',
  'Stake Engine',
  's&box',
  'TypeScript',
  'Node.js',
  'Rust',
  'Discord.js',
]

// Stats Hero : ajuste ces 4 valeurs quand les chiffres évoluent.
const HERO_STATS = {
  players: '3M+',
  maps: '10+',
  platforms: '4',
  years: '5+',
}
// ────────────────────────────────────────────────────────────────────────────

function Home() {
  const { t } = useI18n()
  const container = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

      // ── Intro overlay ──
      tl.set('[data-intro-letter]', { yPercent: 110 })
        .to('[data-intro-letter]', {
          yPercent: 0,
          stagger: 0.035,
          duration: 0.5,
          ease: 'back.out(1.4)',
        })
        .to(
          '[data-intro-letter]',
          {
            yPercent: -110,
            stagger: 0.02,
            duration: 0.3,
            ease: 'power3.in',
          },
          '+=0.25',
        )
        .to(
          '[data-intro-overlay]',
          {
            yPercent: -100,
            duration: 0.6,
            ease: 'power4.inOut',
          },
          '-=0.1',
        )
        .set('[data-intro-overlay]', { display: 'none' })

      // ── Hero entrance ──
      tl.from('[data-anim="hero-line"]', {
        yPercent: 110,
        opacity: 0,
        stagger: 0.12,
        duration: 0.9,
      }, '-=0.4')
        .from(
          '[data-anim="hero-highlight"]',
          { scaleX: 0, duration: 0.6, ease: 'power2.out' },
          '-=0.4',
        )
        .from(
          '[data-anim="hero-sticker"]',
          {
            y: 30,
            opacity: 0,
            scale: 0.6,
            rotation: '+=8',
            stagger: 0.08,
            duration: 0.7,
            ease: 'back.out(1.6)',
          },
          '-=0.2',
        )
        .from(
          '[data-anim="hero-stat"]',
          { y: 30, opacity: 0, stagger: 0.06, duration: 0.6 },
          '-=0.4',
        )

      // ── Floating shape loop ──
      gsap.to('[data-anim="floating-shape"]', {
        y: -14,
        rotation: '+=4',
        repeat: -1,
        yoyo: true,
        duration: 2.6,
        ease: 'sine.inOut',
      })

      const trig = (trigger: string | Element) => ({
        trigger,
        start: 'top 90%',
        toggleActions: 'play none none none' as const,
      })

      // ── Section titles reveal on scroll ──
      gsap.utils.toArray<HTMLElement>('[data-anim="section-title"]').forEach((el) => {
        gsap.from(el.children, {
          y: 40,
          opacity: 0,
          stagger: 0.08,
          duration: 0.7,
          ease: 'power3.out',
          clearProps: 'transform,opacity',
          scrollTrigger: trig(el),
        })
      })

      // ── Stack chips pop ──
      gsap.from('[data-anim="stack-chip"]', {
        scale: 0,
        opacity: 0,
        stagger: 0.04,
        duration: 0.5,
        ease: 'back.out(2)',
        clearProps: 'transform,opacity',
        scrollTrigger: trig('[data-anim="stack-grid"]'),
      })

      // ── Contact title big entrance ──
      gsap.from('[data-anim="contact-kicker"]', {
        y: 20,
        opacity: 0,
        duration: 0.5,
        clearProps: 'transform,opacity',
        scrollTrigger: trig('[data-anim="contact-title"]'),
      })
      gsap.from('[data-anim="contact-title"]', {
        scale: 0.7,
        opacity: 0,
        duration: 0.9,
        ease: 'back.out(1.4)',
        clearProps: 'transform,opacity',
        scrollTrigger: trig('[data-anim="contact-title"]'),
      })

      // Force ScrollTrigger to recompute positions once images/fonts load
      const refresh = () => ScrollTrigger.refresh()
      if (document.readyState === 'complete') {
        requestAnimationFrame(refresh)
      } else {
        window.addEventListener('load', refresh, { once: true })
      }
    },
    { scope: container },
  )

  return (
    <main ref={container} className="min-h-screen overflow-x-hidden">
      <IntroOverlay />
      <Nav t={t} />
      <Hero t={t} />
      <Work t={t} />
      <Stack t={t} />
      <LiveActivity t={t} />
      <About t={t} />
      <Contact t={t} />
      <Footer t={t} />
    </main>
  )
}

function IntroOverlay() {
  const chars = Array.from('simnJS.')
  return (
    <div
      data-intro-overlay
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-ink"
      aria-hidden
    >
      <h1 className="flex font-display leading-none tracking-tighter text-bg text-[clamp(3rem,15vw,11rem)]">
        {chars.map((char, i) => (
          <span key={i} className="inline-block overflow-hidden">
            <span
              data-intro-letter
              className={`inline-block ${char === '.' ? 'text-coral' : ''}`}
            >
              {char}
            </span>
          </span>
        ))}
      </h1>
    </div>
  )
}

function Nav({ t }: { t: Dictionary }) {
  return (
    <header className="sticky top-0 z-40 border-b-2 border-ink bg-bg/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <a
          href="#top"
          className="font-display text-2xl tracking-tight"
        >
          {ME.name}<span className="text-coral">.</span>
        </a>
        <nav className="hidden gap-6 font-mono text-sm md:flex">
          <a href="#work" className="hover:text-coral">{t.nav.work}</a>
          <a href="#stack" className="hover:text-coral">{t.nav.stack}</a>
          <a href="#now" className="hover:text-coral">{t.nav.now}</a>
          <a href="#about" className="hover:text-coral">{t.nav.about}</a>
        </nav>
        <div className="flex items-center gap-3">
          <LanguageSelector />
          <a
            href="#contact"
            className="group relative inline-flex items-center gap-2 border-2 border-ink bg-yellow px-4 py-2 font-display text-sm shadow-[4px_4px_0_0_var(--color-ink)] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none"
          >
            {t.nav.contact}
            <ArrowUpRight size={16} strokeWidth={3} />
          </a>
        </div>
      </div>
    </header>
  )
}

function Hero({ t }: { t: Dictionary }) {
  return (
    <section id="top" className="relative border-b-2 border-ink">
      <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
        <h1 className="font-display text-6xl leading-[0.95] tracking-tight md:text-[9rem]">
          <span data-anim="hero-line" className="block">{t.hero.tagline[0]}</span>
          <span data-anim="hero-line" className="relative block">
            <span className="relative z-10">{t.hero.tagline[1]}</span>
            <span
              data-anim="hero-highlight"
              className="absolute inset-x-0 bottom-2 -z-0 h-6 origin-left bg-yellow md:h-10"
            />
          </span>
          <span data-anim="hero-line" className="block">{t.hero.tagline[2]}</span>
        </h1>

        <div className="mt-12 flex flex-wrap items-center gap-4">
          <span data-anim="hero-sticker" className="inline-block">
            <Sticker rotate="-rotate-3" color="bg-cyan">
              {t.hero.roles.ugc}
            </Sticker>
          </span>
          <span data-anim="hero-sticker" className="inline-block">
            <Sticker rotate="rotate-2" color="bg-coral">
              {t.hero.roles.obsessed}
            </Sticker>
          </span>
          <span data-anim="hero-sticker" className="inline-block">
            <Sticker rotate="-rotate-1" color="bg-violet">
              {t.hero.roles.tech}
            </Sticker>
          </span>
        </div>

        <div className="mt-16 grid grid-cols-2 gap-4 md:grid-cols-4">
          <div data-anim="hero-stat">
            <Stat n={HERO_STATS.players} label={t.hero.stats.players} />
          </div>
          <div data-anim="hero-stat">
            <Stat n={HERO_STATS.maps} label={t.hero.stats.maps} />
          </div>
          <div data-anim="hero-stat">
            <Stat n={HERO_STATS.platforms} label={t.hero.stats.platforms} />
          </div>
          <div data-anim="hero-stat">
            <Stat n={HERO_STATS.years} label={t.hero.stats.years} />
          </div>
        </div>
      </div>

      <FloatingShape className="right-8 top-32 hidden md:block" />
    </section>
  )
}

function Sticker({
  children,
  color,
  rotate,
}: {
  children: ReactNode
  color: string
  rotate: string
}) {
  return (
    <span
      className={`${color} ${rotate} inline-block border-2 border-ink px-3 py-1 font-display text-sm shadow-[3px_3px_0_0_var(--color-ink)]`}
    >
      {children}
    </span>
  )
}

function Stat({ n, label }: { n: string; label: string }) {
  return (
    <div className="border-2 border-ink bg-bg p-4 shadow-[4px_4px_0_0_var(--color-ink)]">
      <div className="font-display text-3xl">{n}</div>
      <div className="mt-1 font-mono text-xs uppercase tracking-wider text-ink/70">
        {label}
      </div>
    </div>
  )
}

function FloatingShape({ className }: { className?: string }) {
  return (
    <div
      className={`absolute ${className} pointer-events-none`}
      aria-hidden
    >
      <div data-anim="floating-shape" className="relative">
        <div className="h-32 w-32 rotate-12 border-2 border-ink bg-violet shadow-[6px_6px_0_0_var(--color-ink)]" />
        <Star
          size={28}
          strokeWidth={3}
          className="absolute -right-4 -top-4 fill-yellow"
        />
      </div>
    </div>
  )
}

function Work({ t }: { t: Dictionary }) {
  return (
    <section id="work" className="border-b-2 border-ink">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <SectionTitle index="01" title={t.sections.work} />
        <div
          data-anim="project-grid"
          className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
        >
          {PROJECTS.map((p) => (
            <ProjectCard key={p.n} project={p} t={t} />
          ))}
        </div>
      </div>
    </section>
  )
}

function ProjectCard({
  project: p,
  t,
}: {
  project: (typeof PROJECTS)[number]
  t: Dictionary
}) {
  const meta = t.projects[p.key]
  return (
    <a
      data-anim="project-card"
      href={p.href}
      target="_blank"
      rel="noreferrer"
      className="group block border-2 border-ink bg-bg shadow-[6px_6px_0_0_var(--color-ink)] transition-all hover:translate-x-1.5 hover:translate-y-1.5 hover:shadow-none"
    >
      <div
        className={`${p.accent} relative aspect-[4/3] overflow-hidden border-b-2 border-ink`}
      >
        {p.image && (
          <img
            src={p.image}
            alt={p.title}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}
        <span className="absolute left-3 top-3 z-10 border-2 border-ink bg-bg px-1.5 py-0.5 font-mono text-[10px]">
          {p.n}
        </span>
        <span className="absolute right-3 top-3 z-10 border-2 border-ink bg-bg px-1.5 py-0.5 font-mono text-[10px]">
          {p.year}
        </span>
        <ArrowUpRight
          size={22}
          strokeWidth={3}
          className="absolute right-3 bottom-3 z-10 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1"
        />
        <div className="absolute left-3 bottom-3 z-10 border-2 border-ink bg-bg px-2 py-0.5 font-display text-xs leading-tight">
          {meta.tag}
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-display text-lg leading-tight">{p.title}</h3>
        <p className="mt-2 text-xs leading-snug text-ink/80">{meta.desc}</p>
      </div>
    </a>
  )
}

function Stack({ t }: { t: Dictionary }) {
  return (
    <section id="stack" className="border-b-2 border-ink bg-ink text-bg">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <SectionTitle index="02" title={t.sections.stack} inverted />
        <div data-anim="stack-grid" className="mt-12 flex flex-wrap gap-3">
          {STACK.map((s, i) => {
            const colors = ['bg-yellow', 'bg-coral', 'bg-cyan', 'bg-violet']
            const rot = ['rotate-1', '-rotate-1', 'rotate-2', '-rotate-2']
            return (
              <span
                key={s}
                data-anim="stack-chip"
                className={`${colors[i % 4]} ${rot[i % 4]} inline-block border-2 border-bg px-4 py-2 font-display text-lg text-ink shadow-[4px_4px_0_0_var(--color-bg)]`}
              >
                {s}
              </span>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function About({ t }: { t: Dictionary }) {
  return (
    <section id="about" className="border-b-2 border-ink">
      <div className="mx-auto grid max-w-6xl gap-12 px-6 py-20 md:grid-cols-5">
        <div className="md:col-span-2">
          <SectionTitle index="03" title={t.sections.about} />
        </div>
        <div className="md:col-span-3">
          <p className="font-display text-3xl leading-tight md:text-4xl">
            {t.about.bio}
          </p>
        </div>
      </div>
    </section>
  )
}

function Contact({ t }: { t: Dictionary }) {
  return (
    <section id="contact" className="border-b-2 border-ink bg-yellow">
      <div className="mx-auto max-w-6xl px-6 py-24 text-center">
        <p data-anim="contact-kicker" className="font-mono text-sm uppercase tracking-widest">
          {t.contact.kicker}
        </p>
        <h2 data-anim="contact-title" className="mt-4 font-display text-5xl leading-none md:text-8xl">
          {t.contact.title}
        </h2>
        <a
          href={`mailto:${ME.email}`}
          className="mt-10 inline-flex items-center gap-3 border-2 border-ink bg-bg px-8 py-4 font-display text-xl shadow-[6px_6px_0_0_var(--color-ink)] transition-all hover:translate-x-1.5 hover:translate-y-1.5 hover:shadow-none"
        >
          <Mail size={20} strokeWidth={3} />
          {ME.email}
        </a>
        <div className="mt-8 flex justify-center gap-4">
          <Social href={ME.github} label={t.contact.github}>
            <Github size={20} strokeWidth={2.5} />
          </Social>
          <Social href={ME.website} label={t.contact.website}>
            <Globe size={20} strokeWidth={2.5} />
          </Social>
          <Social href={ME.studio.url} label={t.contact.studio}>
            <Star size={20} strokeWidth={2.5} />
          </Social>
        </div>
      </div>
    </section>
  )
}

function Social({
  href,
  label,
  children,
}: {
  href: string
  label: string
  children: ReactNode
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      className="grid h-12 w-12 place-items-center border-2 border-ink bg-bg shadow-[3px_3px_0_0_var(--color-ink)] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none"
    >
      {children}
    </a>
  )
}

function Footer({ t }: { t: Dictionary }) {
  return (
    <footer className="bg-ink py-6 text-bg">
      <div className="mx-auto flex max-w-6xl items-center justify-center px-6 font-mono text-xs uppercase tracking-wider">
        <span>© {new Date().getFullYear()} {ME.name} — {t.footer.built}</span>
      </div>
    </footer>
  )
}

function SectionTitle({
  index,
  title,
  inverted,
}: {
  index: string
  title: string
  inverted?: boolean
}) {
  return (
    <div data-anim="section-title" className="flex items-end gap-4">
      <span
        className={`font-mono text-sm ${inverted ? 'text-bg/60' : 'text-ink/60'}`}
      >
        // {index}
      </span>
      <h2 className="font-display text-4xl leading-none md:text-6xl">
        {title}
      </h2>
    </div>
  )
}
