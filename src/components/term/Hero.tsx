import { ME } from '../../content/site'
import { useTerm } from '../../i18n/term'
import { Boykisser } from './Boykisser'
import { ExtLink, PrideFlag, lyonTime, useNow } from './bits'
import { useSpotify } from './live'

const PLATFORMS = ['UEFN', 'Roblox', 'Stake Engine', 's&box', 'Verse', 'Rust']

export function Hero() {
  const t = useTerm()
  const now = useNow(15_000)
  const track = useSpotify(30_000)

  // grid-cols-1 borne la colonne à l'écran : sinon, sur mobile, un titre
  // Spotify long (tronqué, donc sans retour à la ligne) élargit toute la page.
  return (
    <section
      id="top"
      className="grid min-h-[min(780px,calc(100svh-7rem))] grid-cols-1 items-center gap-x-10 gap-y-12 py-12 md:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)]"
    >
      <div>
        <p className="text-dim">
          <span className="text-pink">❯</span> whoami
        </p>
        <h1 className="mt-4 text-[clamp(3.25rem,10vw,7.25rem)] font-extrabold leading-[0.9] tracking-[-0.045em]">
          {ME.handle}
          <span
            className="caret ml-[0.06em] inline-block h-[0.78em] w-[0.12em] translate-y-[0.04em] bg-pink"
            aria-hidden
          />
        </h1>
        <p className="mt-5 text-lg text-dim">
          {t.ff.os}, {t.ff.host}
          <PrideFlag />
        </p>
        <p className="mt-6 max-w-[48ch] text-[1.05rem] leading-relaxed">{t.hero.tagline}</p>

        <ul className="mt-6 flex flex-wrap gap-2" aria-label="platforms">
          {PLATFORMS.map((p) => (
            <li key={p} className="rounded-full border border-line px-3 py-1 text-[13px] text-dim">
              {p}
            </li>
          ))}
        </ul>

        <div className="mt-9 flex flex-wrap gap-3">
          <a
            href="#projects"
            className="rounded-md bg-pink px-5 py-3 font-bold text-bg transition-colors hover:bg-[#f8bcd7]"
          >
            {t.hero.projects}
          </a>
          <a
            href="#contact"
            className="rounded-md border border-line px-5 py-3 transition-colors hover:border-pink hover:text-pink"
          >
            {t.hero.contact}
          </a>
        </div>

        <p className="mt-8 flex flex-wrap gap-x-5 gap-y-1 text-[13px] text-muted">
          <span>
            <span className="text-green">●</span> Lyon {now === null ? '' : lyonTime(now)}
          </span>
          {track && (
            <span className="min-w-0 truncate">
              <span className="text-pink">♪</span> {t.hero.listening}{' '}
              <ExtLink href={track.url} className="text-dim">
                {track.artists} - {track.title}
              </ExtLink>
            </span>
          )}
        </p>
      </div>

      <div className="flex flex-col items-center">
        <Boykisser max={520} delay={250} />
        <p className="mt-5 text-[13px] text-muted">{t.hero.poke}</p>
      </div>
    </section>
  )
}
