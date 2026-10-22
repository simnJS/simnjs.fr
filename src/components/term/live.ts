import { useEffect, useState } from 'react'
import { getGithubActivity, getGithubProfile, type GhEvent, type GhProfile } from '../../lib/github'
import { getSpotifyTrack, type SpotifyTrack } from '../../lib/spotify'

// Données live partagées : une seule requête par source, même quand le
// fastfetch, la heatmap et le shell les affichent en même temps.

export type Remote<T> = { status: 'loading' } | { status: 'ok'; data: T } | { status: 'error' }

let profilePromise: Promise<GhProfile | null> | null = null

export function loadProfile(): Promise<GhProfile | null> {
  profilePromise ??= getGithubProfile()
    .then((p) => (p.weeks.length ? p : null))
    .catch(() => {
      profilePromise = null
      return null
    })
  return profilePromise
}

export function useGithubProfile(): Remote<GhProfile> {
  const [state, setState] = useState<Remote<GhProfile>>({ status: 'loading' })
  useEffect(() => {
    let alive = true
    loadProfile().then((p) => alive && setState(p ? { status: 'ok', data: p } : { status: 'error' }))
    return () => {
      alive = false
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
