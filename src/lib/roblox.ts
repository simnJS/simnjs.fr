import { createServerFn } from '@tanstack/react-start'
import { setResponseHeader } from '@tanstack/react-start/server'

// ─── Play'n Chill (Roblox) — stats live du groupe ────────────────────────────

const GROUP_ID = 35788348

export type RbxGame = {
  name: string
  playing: number
  visits: number
  favorites: number
  // undefined si l'endpoint votes n'a pas répondu (plutôt qu'un faux 0)
  likes?: number
  url: string
}

export type RbxStats = {
  members: number
  totalPlaying: number
  totalVisits: number
  games: RbxGame[]
  fetchedAt: string
}

const TTL_MS = 60_000
let cache: { at: number; data: RbxStats } | null = null

// roproxy en premier (roblox.com bloque certains ranges datacenter),
// puis l'API officielle en secours.
async function rbxFetch<T>(path: string): Promise<T | null> {
  for (const host of ['roproxy.com', 'roblox.com']) {
    try {
      const res = await fetch(`https://${path.replace('{host}', host)}`, {
        headers: { Accept: 'application/json' },
      })
      if (!res.ok) continue
      return (await res.json()) as T
    } catch {
      continue
    }
  }
  return null
}

export const getRobloxStats = createServerFn({ method: 'GET' }).handler(
  async (): Promise<RbxStats | null> => {
    // Cache mutualisé au edge : le cache mémoire ne survit pas aux cold
    // starts sur Vercel, chaque visiteur repayait la chaîne d'appels Roblox.
    try {
      setResponseHeader(
        'cache-control',
        'public, max-age=0, s-maxage=60, stale-while-revalidate=600',
      )
    } catch {
      // hors contexte de requête — sans effet
    }
    if (cache && Date.now() - cache.at < TTL_MS) return cache.data

    const group = await rbxFetch<{ memberCount?: number }>(
      `groups.{host}/v1/groups/${GROUP_ID}`,
    )
    const list = await rbxFetch<{
      data?: Array<{ id: number; rootPlace?: { id: number } }>
    }>(`games.{host}/v2/groups/${GROUP_ID}/games?accessFilter=2&limit=50`)

    const universes = list?.data ?? []
    if (universes.length === 0) return cache?.data ?? null

    const ids = universes.map((g) => g.id).join(',')
    const stats = await rbxFetch<{
      data?: Array<{
        id: number
        name: string
        playing?: number
        visits?: number
        favoritedCount?: number
        rootPlaceId?: number
      }>
    }>(`games.{host}/v1/games?universeIds=${ids}`)
    if (!stats?.data) return cache?.data ?? null

    const votes = await rbxFetch<{
      data?: Array<{ id: number; upVotes?: number; downVotes?: number }>
    }>(`games.{host}/v1/games/votes?universeIds=${ids}`)
    const upVotesByUniverse = new Map(
      (votes?.data ?? []).map((v) => [v.id, v.upVotes]),
    )

    const placeByUniverse = new Map(
      universes.map((g) => [g.id, g.rootPlace?.id]),
    )
    const games: RbxGame[] = stats.data
      .map((g) => ({
        name: g.name,
        playing: g.playing ?? 0,
        visits: g.visits ?? 0,
        favorites: g.favoritedCount ?? 0,
        likes: upVotesByUniverse.get(g.id),
        url: `https://www.roblox.com/games/${g.rootPlaceId ?? placeByUniverse.get(g.id) ?? ''}`,
      }))
      .sort((a, b) => b.playing - a.playing || b.visits - a.visits)

    const data: RbxStats = {
      members: group?.memberCount ?? 0,
      totalPlaying: games.reduce((s, g) => s + g.playing, 0),
      totalVisits: games.reduce((s, g) => s + g.visits, 0),
      games,
      fetchedAt: new Date().toISOString(),
    }
    cache = { at: Date.now(), data }
    return data
  },
)
