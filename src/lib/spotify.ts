import { createServerFn } from '@tanstack/react-start'
import { setResponseHeader } from '@tanstack/react-start/server'

// ─── Spotify — morceau en cours, sinon dernier écouté ───────────────────────
//
// Auth : flow Authorization Code confidentiel (client secret côté serveur).
// Le refresh token s'obtient une fois via `node scripts/spotify-auth.mjs`
// puis vit en variable d'environnement — Spotify ne le fait pas tourner sur
// ce flow, contrairement à PKCE.
//
// Rien n'est réhébergé ici : on n'affiche que des métadonnées et la pochette
// servie par le CDN Spotify, non modifiée, avec un lien vers le morceau.

export type SpotifyTrack = {
  title: string
  artists: string
  album: string
  albumArt: string | null
  url: string
  isPlaying: boolean
  // renseignés en lecture uniquement
  progressMs: number | null
  durationMs: number | null
  // renseigné hors lecture uniquement
  playedAt: string | null
  fetchedAt: string
}

const TOKEN_URL = 'https://accounts.spotify.com/api/token'
const API = 'https://api.spotify.com/v1'
// C'est la donnée la plus volatile du site : fenêtre courte.
const TTL_MS = 20_000

let token: { value: string; expiresAt: number } | null = null
let cache: { at: number; data: SpotifyTrack | null } | null = null
let inflight: Promise<SpotifyTrack | null> | null = null

async function accessToken(): Promise<string | null> {
  const id = process.env.SPOTIFY_CLIENT_ID?.trim()
  const secret = process.env.SPOTIFY_CLIENT_SECRET?.trim()
  const refresh = process.env.SPOTIFY_REFRESH_TOKEN?.trim()
  if (!id || !secret || !refresh) return null
  // Marge de 30 s : ne pas partir avec un token qui expire en vol.
  if (token && Date.now() < token.expiresAt - 30_000) return token.value
  try {
    const res = await fetch(TOKEN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${btoa(`${id}:${secret}`)}`,
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: refresh,
      }),
    })
    if (!res.ok) {
      console.log('[spotify] refresh token refusé:', res.status)
      return null
    }
    const j = (await res.json()) as {
      access_token?: string
      expires_in?: number
    }
    if (!j.access_token) return null
    token = {
      value: j.access_token,
      expiresAt: Date.now() + (j.expires_in ?? 3600) * 1000,
    }
    return token.value
  } catch {
    return null
  }
}

type RawTrack = {
  name?: string
  album?: { name?: string; images?: Array<{ url: string; width?: number }> }
  artists?: Array<{ name: string }>
  external_urls?: { spotify?: string }
  duration_ms?: number
}

function shapeTrack(
  t: RawTrack,
  s: { isPlaying: boolean; progressMs: number | null; playedAt: string | null },
): SpotifyTrack | null {
  if (!t.name) return null
  const images = t.album?.images ?? []
  // Spotify renvoie du plus grand au plus petit : on prend la plus petite
  // pochette encore nette à l'affichage plutôt que le 640×640.
  const art =
    [...images]
      .sort((a, b) => (a.width ?? 0) - (b.width ?? 0))
      .find((i) => (i.width ?? 0) >= 200) ?? images[0]
  return {
    title: t.name,
    artists: (t.artists ?? []).map((a) => a.name).join(', '),
    album: t.album?.name ?? '',
    albumArt: art?.url ?? null,
    url: t.external_urls?.spotify ?? 'https://open.spotify.com',
    isPlaying: s.isPlaying,
    progressMs: s.progressMs,
    durationMs: t.duration_ms ?? null,
    playedAt: s.playedAt,
    fetchedAt: new Date().toISOString(),
  }
}

async function fetchTrack(): Promise<SpotifyTrack | null> {
  const at = await accessToken()
  if (!at) return null
  const headers = { Authorization: `Bearer ${at}` }
  try {
    const res = await fetch(
      `${API}/me/player/currently-playing?additional_types=track`,
      { headers },
    )
    // 200 = quelque chose joue ; 204 = rien ; 202 = appareil en veille.
    if (res.status === 200) {
      const j = (await res.json()) as {
        is_playing?: boolean
        progress_ms?: number
        currently_playing_type?: string
        item?: RawTrack | null
      }
      if (j.item && j.currently_playing_type === 'track') {
        const shaped = shapeTrack(j.item, {
          isPlaying: j.is_playing === true,
          progressMs: j.progress_ms ?? null,
          playedAt: null,
        })
        if (shaped) return shaped
      }
    }
    // Rien en cours (ou un podcast) : on retombe sur le dernier morceau
    // écouté — sinon le module passerait le plus clair du temps vide.
    const rec = await fetch(`${API}/me/player/recently-played?limit=1`, {
      headers,
    })
    if (!rec.ok) return null
    const j = (await rec.json()) as {
      items?: Array<{ track?: RawTrack; played_at?: string }>
    }
    const last = j.items?.[0]
    if (!last?.track) return null
    return shapeTrack(last.track, {
      isPlaying: false,
      progressMs: null,
      playedAt: last.played_at ?? null,
    })
  } catch {
    return null
  }
}

function revalidate(): Promise<SpotifyTrack | null> {
  if (!inflight) {
    inflight = fetchTrack()
      .then((data) => {
        // Un échec transitoire (token indisponible, 429, cold start) ne doit
        // pas empoisonner le cache : mettre ce null en cache faisait
        // disparaître le bloc pendant toute la fenêtre de TTL. On conserve
        // la dernière valeur connue et on retentera au tick suivant.
        if (data) {
          cache = { at: Date.now(), data }
          return data
        }
        if (cache?.data) {
          cache = { at: Date.now(), data: cache.data }
          return cache.data
        }
        cache = { at: Date.now(), data: null }
        return null
      })
      .finally(() => {
        inflight = null
      })
  }
  return inflight
}

export const getSpotifyTrack = createServerFn({ method: 'GET' }).handler(
  async (): Promise<SpotifyTrack | null> => {
    try {
      setResponseHeader(
        'cache-control',
        'public, max-age=0, s-maxage=20, stale-while-revalidate=60',
      )
    } catch {
      // hors contexte de requête — sans effet
    }
    if (cache && Date.now() - cache.at < TTL_MS) return cache.data
    const refresh = revalidate()
    // Même politique que le reste du site : le périmé part tout de suite,
    // la revalidation suit en fond.
    if (cache) return cache.data
    return await refresh
  },
)
