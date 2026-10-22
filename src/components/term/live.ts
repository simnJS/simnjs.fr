import { useEffect, useState } from 'react'
import { getGithubActivity, getGithubProfile, type GhEvent, type GhProfile } from '../../lib/github'
import { getSpotifyTrack, type SpotifyTrack } from '../../lib/spotify'

// Données live partagées : une seule requête par source, même quand le
// fastfetch, la heatmap et le shell les affichent en même temps.

export type Remote<T> = { status: 'loading' } | { status: 'ok'; data: T } | { status: 'error' }

// Profil GitHub : le serveur répond d'abord avec les seuls commits publics,
// puis le comptage complet (repos privés et orgas) arrive en différé. On
// relance donc vite au début, puis chaque minute, sans jamais faire baisser
// le total déjà affiché.
let profile: Remote<GhProfile> = { status: 'loading' }
const listeners = new Set<() => void>()
let polling = false

function setProfile(next: Remote<GhProfile>) {
  profile = next
  listeners.forEach((l) => l())
}

async function pollProfile(attempt: number) {
  const p = await getGithubProfile().catch(() => null)
  if (p && p.weeks.length) {
    const prev = profile.status === 'ok' ? profile.data : null
    setProfile({ status: 'ok', data: prev ? { ...p, totalCommits: Math.max(p.totalCommits, prev.totalCommits) } : p })
  } else if (profile.status !== 'ok' && attempt >= 3) {
    setProfile({ status: 'error' })
  }
  const delay = attempt < 4 ? 5_000 * (attempt + 1) : 60_000
  setTimeout(() => {
    if (document.visibilityState === 'visible') pollProfile(attempt + 1)
    else setTimeout(() => pollProfile(attempt + 1), 60_000)
  }, delay)
}

export function useGithubProfile(): Remote<GhProfile> {
  const [state, setState] = useState(profile)
  useEffect(() => {
    const update = () => setState(profile)
    listeners.add(update)
    update()
    if (!polling) {
      polling = true
      pollProfile(0)
    }
    return () => {
      listeners.delete(update)
    }
  }, [])
  return state
}

export async function loadActivity(): Promise<GhEvent[] | null> {
  try {
    return (await getGithubActivity()).events
  } catch {
    return null
  }
}

export function useGithubActivity(refreshMs: number): Remote<GhEvent[]> {
  const [state, setState] = useState<Remote<GhEvent[]>>({ status: 'loading' })
  useEffect(() => {
    let alive = true
    const load = () =>
      loadActivity().then((events) => {
        if (!alive) return
        // Une erreur pendant un rafraîchissement garde l'ancien affichage.
        setState((prev) => (events ? { status: 'ok', data: events } : prev.status === 'ok' ? prev : { status: 'error' }))
      })
    load()
    const id = setInterval(() => document.visibilityState === 'visible' && load(), refreshMs)
    return () => {
      alive = false
      clearInterval(id)
    }
  }, [refreshMs])
  return state
}

export async function loadSpotify(): Promise<SpotifyTrack | null> {
  try {
    return await getSpotifyTrack()
  } catch {
    return null
  }
}

export function useSpotify(refreshMs: number): SpotifyTrack | null {
  const [track, setTrack] = useState<SpotifyTrack | null>(null)
  useEffect(() => {
    let alive = true
    const load = () => loadSpotify().then((t) => alive && setTrack(t))
    load()
    const id = setInterval(() => document.visibilityState === 'visible' && load(), refreshMs)
    return () => {
      alive = false
      clearInterval(id)
    }
  }, [refreshMs])
  return track
}
