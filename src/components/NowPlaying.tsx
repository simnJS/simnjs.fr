import { useEffect, useRef, useState } from 'react'
import { Music } from 'lucide-react'
import { getSpotifyTrack, type SpotifyTrack } from '../lib/spotify'
import type { Dictionary } from '../i18n/translations'

// Plus court que le feed GitHub : un morceau dure ~3 min, au-delà l'info
// serait périmée à l'écran.
const REFRESH_MS = 25_000

export function NowPlaying({ t }: { t: Dictionary }) {
  const [track, setTrack] = useState<SpotifyTrack | null>(null)
  const [progress, setProgress] = useState(0)
  // Point de repère du dernier fetch, pour extrapoler la progression.
  const base = useRef<{ at: number; ms: number } | null>(null)
  const mounted = useRef(true)

  useEffect(() => {
    mounted.current = true
    const load = async () => {
      try {
        const data = await getSpotifyTrack()
        if (!mounted.current) return
        // Un rafraîchissement qui échoue ne doit jamais effacer ce qui est
        // déjà affiché, sinon le bloc disparaît puis réapparaît au moindre
        // hoquet réseau. On garde la dernière valeur connue.
        if (!data) return
        setTrack(data)
        if (data.progressMs != null) {
          base.current = { at: Date.now(), ms: data.progressMs }
          setProgress(data.progressMs)
        } else {
          base.current = null
        }
      } catch {
        // Module secondaire : son échec ne doit rien casser autour.
      }
    }
    load()
    const id = setInterval(load, REFRESH_MS)
    return () => {
      mounted.current = false
      clearInterval(id)
    }
  }, [])

  // Fait avancer la barre entre deux fetches — sinon elle resterait figée
  // 25 s d'affilée, ce qui se voit tout de suite.
  const duration = track?.durationMs ?? null
  const playing = track?.isPlaying === true
  useEffect(() => {
    if (!playing || duration == null) return
    const id = setInterval(() => {
      const b = base.current
      if (!b) return
      setProgress(Math.min(b.ms + (Date.now() - b.at), duration))
    }, 1000)
    return () => clearInterval(id)
  }, [playing, duration])

  // Non configuré ou API muette : on ne rend rien plutôt qu'un bloc vide.
  if (!track) return null

  const pct =
    duration && duration > 0
      ? Math.min(100, Math.max(0, (progress / duration) * 100))
      : 0

  return (
    <div className="mt-10 flex items-center gap-4 border-2 border-ink bg-bg p-4 shadow-[4px_4px_0_0_var(--color-ink)]">
      {track.albumArt ? (
        <img
          src={track.albumArt}
          alt=""
          width={64}
          height={64}
          loading="lazy"
          className="h-16 w-16 shrink-0 border-2 border-ink object-cover"
        />
      ) : (
        <span className="grid h-16 w-16 shrink-0 place-items-center border-2 border-ink bg-violet">
          <Music size={24} strokeWidth={3} />
        </span>
      )}

      <div className="min-w-0 flex-1">
        <span
          className={`inline-block border-2 border-ink px-2 py-0.5 font-display text-[10px] uppercase tracking-wider ${
            playing ? 'bg-cyan' : 'bg-bg'
          }`}
        >
          {playing ? `● ${t.spotify.playing}` : t.spotify.lastPlayed}
        </span>

        <a
          href={track.url}
          target="_blank"
          rel="noreferrer"
          className="mt-1.5 block truncate font-display text-lg leading-tight hover:text-coral"
          title={`${track.title} — ${track.artists}`}
        >
          {track.title}
        </a>
        <div className="truncate font-mono text-xs text-ink/70">
          {track.artists}
        </div>

        {playing && duration != null && (
          <div className="mt-2 h-2 w-full border-2 border-ink">
            <div
              className="h-full bg-violet transition-[width] duration-1000 ease-linear"
              style={{ width: `${pct}%` }}
            />
          </div>
        )}
      </div>

      {/* Attribution exigée par les conditions de la Web API Spotify. */}
      <a
        href={track.url}
        target="_blank"
        rel="noreferrer"
        className="hidden shrink-0 self-end font-mono text-[10px] uppercase tracking-wider text-ink/50 hover:text-ink sm:block"
      >
        {t.spotify.via}
      </a>
    </div>
  )
}
