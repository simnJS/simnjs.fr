import { createServerFn } from '@tanstack/react-start'
import { setResponseHeader } from '@tanstack/react-start/server'

// ─── Types ──────────────────────────────────────────────────────────────────

export type GhEventType =
  | 'push'
  | 'pr'
  | 'release'
  | 'issue'
  | 'create'
  | 'public'
  | 'fork'

export type GhEvent = {
  id: string
  type: GhEventType
  repo: string
  createdAt: string
  message: string
  url: string
  count?: number
  private?: boolean
}

export type GhDay = {
  date: string
  count: number
  level: 0 | 1 | 2 | 3 | 4
}

export type GhProfile = {
  totalContributions: number
  totalCommits: number
  totalPRs: number
  totalIssues: number
  totalActiveRepos: number
  longestStreak: number
  currentStreak: number
  weeks: Array<{ days: GhDay[] }>
  fetchedAt: string
}

type RawEvent = {
  id: string
  type: string
  public?: boolean
  created_at: string
  repo: { name: string }
  payload: {
    action?: string
    ref?: string
    ref_type?: string
    number?: number
    commits?: Array<{ message: string; sha: string }>
    size?: number
    distinct_size?: number
    before?: string
    head?: string
    pull_request?: { number?: number; title?: string; merged?: boolean }
    issue?: { number?: number; title?: string }
    release?: { name: string | null; tag_name: string; html_url: string }
    forkee?: { full_name: string; html_url: string }
  }
}

// ─── Identity ───────────────────────────────────────────────────────────────

const LOGIN = 'simnJS'
// Alt accounts whose commits count as mine — work signed with git emails
// linked to these accounts instead of the main one.
const AUTHOR_LOGINS = [LOGIN, 'simn24']

// ─── Cache ──────────────────────────────────────────────────────────────────

// Orgs whose events should count toward stats but stay anonymous in the feed.
const PRIVATE_ORG_PREFIXES = ['Ca-Stake-Engine-Ou-Quoi-La/', 'Roblox-Simon/']

const TTL_MS = 60_000
// The profile sweep (repo listing + per-repo commit counts) is heavier,
// refresh it less often.
const PROFILE_TTL_MS = 300_000
// Budget d'attente du sweep de commits dans le chemin de réponse. Au-delà on
// répond sans lui — il continue en fond et rejoint le cache (voir plus bas).
const SWEEP_BUDGET_MS = 2_500

// Caches mémoire en stale-while-revalidate : on sert toujours ce qu'on a,
// même périmé, et on revalide en fond. Bloquer sur le fetch ne servait qu'à
// faire attendre le visiteur pour une donnée qui bouge peu.
// Note : sur Vercel le process est éphémère, ces caches ne survivent pas aux
// cold starts — le vrai cache partagé est côté CDN (routeRules, vite.config).
type Cached<T> = { at: number; ttl: number; data: T }

function isFresh(c: Cached<unknown> | null): boolean {
  return c !== null && Date.now() - c.at < c.ttl
}

type EventsData = { events: GhEvent[]; fetchedAt: string }

let eventsCache: Cached<EventsData> | null = null
// ttl par entrée : court quand le sweep de commits a échoué/timeout, pour
// que le poll suivant retente vite au lieu d'afficher 5 min un chiffre bas.
let profileCache: Cached<GhProfile> | null = null

// Requêtes en vol : sans ça, N visiteurs arrivant ensemble sur une instance
// froide déclenchaient N sweeps complets en parallèle.
let eventsInflight: Promise<EventsData | null> | null = null
let profileInflight: Promise<GhProfile | null> | null = null

function timeoutNull(ms: number): Promise<null> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(null), ms)
  })
}

// Cache CDN — c'est lui le vrai cache partagé. Les caches mémoire ci-dessus
// ne valent que pour une instance chaude ; sur Vercel chaque cold start
// repartait de zéro et refaisait tout le travail pour un seul visiteur.
// s-maxage borne les appels à l'API GitHub à un par fenêtre quel que soit le
// trafic, stale-while-revalidate sert la version précédente instantanément
// pendant que le edge régénère en fond.
function edgeCache(sMaxAge: number, swr: number): void {
  try {
    setResponseHeader(
      'cache-control',
      `public, max-age=0, s-maxage=${sMaxAge}, stale-while-revalidate=${swr}`,
    )
  } catch {
    // hors contexte de requête (appel direct en test) — sans effet
  }
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function ghHeaders(): Record<string, string> {
  const h: Record<string, string> = {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    'User-Agent': 'simnjs-portfolio',
  }
  const token = process.env.GITHUB_TOKEN?.trim()
  if (token) h.Authorization = `Bearer ${token}`
  return h
}

function isBotRef(ref?: string | null): boolean {
  if (!ref) return false
  return /dependabot|renovate|snyk-bot/i.test(ref)
}

function levelOf(count: number, max: number): 0 | 1 | 2 | 3 | 4 {
  if (count === 0) return 0
  if (max <= 1) return 1
  const r = count / max
  if (r <= 0.25) return 1
  if (r <= 0.5) return 2
  if (r <= 0.75) return 3
  return 4
}

// ─── Events shaping ─────────────────────────────────────────────────────────

// The authenticated /users/{login}/events endpoint returns slim push payloads
// (no commits array, no size) — only ref/before/head. `_push` carries what we
// need to recover the real commit count and message via the compare API.
type ShapedEvent = GhEvent & {
  _push?: { repo: string; before: string; head: string }
}

function shape(raw: RawEvent[]): ShapedEvent[] {
  const out: ShapedEvent[] = []
  // dedup/group key → index in out
  const groupIdx = new Map<string, number>()

  for (const e of raw) {
    const repo = e.repo.name
    const repoUrl = `https://github.com/${repo}`
    const isPrivate =
      e.public === false ||
      PRIVATE_ORG_PREFIXES.some((p) => repo.startsWith(p))
    let evt: ShapedEvent | null = null
    let groupKey: string | null = null

    switch (e.type) {
      case 'PushEvent': {
        if (isBotRef(e.payload.ref)) break
        const size = e.payload.size
        const commitCount = e.payload.commits?.length ?? 0
        // Only skip when we're sure nothing happened
        // (size === 0 with empty commits = force-push that reset the branch).
        // size === null/undefined just means GitHub didn't include the count.
        if (size === 0 && commitCount === 0) break
        const branch = (e.payload.ref ?? '').replace(/^refs\/heads\//, '')
        // payload.commits est ordonné du plus ancien au plus récent :
        // on affiche le dernier commit, pas le premier.
        const payloadCommits = e.payload.commits
        const newestMsg =
          payloadCommits?.[payloadCommits.length - 1]?.message?.split(
            '\n',
          )[0] ?? ''
        // distinct_size = commits actually new to the repo (excludes commits
        // re-pushed by merges/force-pushes); fall back to size, then to the
        // (capped at 20) commits array.
        const distinct = e.payload.distinct_size
        const n =
          typeof distinct === 'number' && distinct > 0
            ? distinct
            : typeof size === 'number'
              ? size
              : commitCount
        let message: string
        if (newestMsg) {
          message = newestMsg
        } else if (n > 0) {
          message = `${n} commit${n > 1 ? 's' : ''} → ${branch}`
        } else {
          message = `→ ${branch}`
        }
        groupKey = `push::${repo}::${branch}`
        evt = {
          id: e.id,
          type: 'push',
          repo,
          createdAt: e.created_at,
          message,
          url: repoUrl,
          count: Math.max(n, 1),
        }
        // Slim payload (authenticated endpoint): recover the real commit
        // count/message later via the API. Skip branch creations
        // (before is all zeros — nothing to compare against).
        if (!newestMsg && e.payload.before && e.payload.head) {
          if (!/^0+$/.test(e.payload.before)) {
            evt._push = { repo, before: e.payload.before, head: e.payload.head }
          }
        }
        break
      }
      case 'PullRequestEvent': {
        const number = e.payload.pull_request?.number ?? e.payload.number
        if (number == null) break
        const merged = e.payload.pull_request?.merged
        const action =
          e.payload.action === 'closed' && merged
            ? 'merged'
            : (e.payload.action ?? 'opened')
        const title = e.payload.pull_request?.title
        evt = {
          id: e.id,
          type: 'pr',
          repo,
          createdAt: e.created_at,
          message: title
            ? `${action} #${number} · ${title}`
            : `${action} #${number}`,
          url: `${repoUrl}/pull/${number}`,
        }
        break
      }
      case 'IssuesEvent': {
        const number = e.payload.issue?.number
        if (number == null) break
        const title = e.payload.issue?.title
        const action = e.payload.action ?? 'opened'
        evt = {
          id: e.id,
          type: 'issue',
          repo,
          createdAt: e.created_at,
          message: title
            ? `${action} #${number} · ${title}`
            : `${action} #${number}`,
          url: `${repoUrl}/issues/${number}`,
        }
        break
      }
      case 'ReleaseEvent': {
        const r = e.payload.release
        if (!r) break
        evt = {
          id: e.id,
          type: 'release',
          repo,
          createdAt: e.created_at,
          message: r.name || r.tag_name,
          url: r.html_url,
        }
        break
      }
      case 'CreateEvent': {
        if (isBotRef(e.payload.ref)) break
        const kind = e.payload.ref_type
        const ref = e.payload.ref
        if (kind === 'repository') {
          evt = {
            id: e.id,
            type: 'create',
            repo,
            createdAt: e.created_at,
            message: 'new repo',
            url: repoUrl,
          }
        } else if (kind === 'tag' && ref) {
          evt = {
            id: e.id,
            type: 'create',
            repo,
            createdAt: e.created_at,
            message: `tag · ${ref}`,
            url: repoUrl,
          }
        } else if (kind === 'branch' && ref) {
          // skip branch creations — too noisy
          break
        }
        break
      }
      case 'PublicEvent': {
        evt = {
          id: e.id,
          type: 'public',
          repo,
          createdAt: e.created_at,
          message: 'open-sourced',
          url: repoUrl,
        }
        break
      }
      case 'ForkEvent': {
        const f = e.payload.forkee
        if (!f) break
        evt = {
          id: e.id,
          type: 'fork',
          repo,
          createdAt: e.created_at,
          message: `forked → ${f.full_name}`,
          url: f.html_url,
        }
        break
      }
    }

    if (!evt) continue

    // Mask everything identifying on private events.
    // Group key still uses the real repo so we can fold repeats together,
    // but the displayed repo, message and URL are stripped.
    if (isPrivate) {
      evt = {
        ...evt,
        repo: 'private',
        message: '',
        url: `https://github.com/${LOGIN}`,
        private: true,
      }
    }

    if (groupKey && groupIdx.has(groupKey)) {
      // Fold into the existing row: sum commit counts, not push counts.
      // Keep folding even once the feed is full so ×N stays accurate.
      const row = out[groupIdx.get(groupKey)!]
      row.count = (row.count ?? 1) + (evt.count ?? 1)
      // Events arrive newest first: widen the compare span down to the
      // oldest push of the group so ×N covers all its commits.
      if (row._push && evt._push) row._push.before = evt._push.before
    } else if (out.length < 12) {
      if (groupKey) groupIdx.set(groupKey, out.length)
      out.push(evt)
    }
  }

  return out
}

// ─── Push enrichment (parallel) ─────────────────────────────────────────────

// Recover the real commit count and message of each push group. Needed
// because the authenticated events endpoint strips commits/size from push
// payloads. Count: compare oldest `before` → newest `head`. Message: the
// `head` commit itself — the group's NEWEST commit (skipped for private rows,
// whose message is masked anyway).
type Patch = [id: string, fields: Partial<GhEvent>]

async function enrichPushes(events: ShapedEvent[]): Promise<Patch[]> {
  const headers = ghHeaders()
  const out = await Promise.all(
    events.map(async (e): Promise<Patch | null> => {
      const p = e._push
      if (!p) return null
      const [cmp, head] = await Promise.all([
        fetch(
          `https://api.github.com/repos/${p.repo}/compare/${p.before}...${p.head}?per_page=1`,
          { headers },
        )
          .then((r) =>
            r.ok ? (r.json() as Promise<{ total_commits?: number }>) : null,
          )
          .catch(() => null),
        e.private
          ? Promise.resolve(null)
          : fetch(`https://api.github.com/repos/${p.repo}/commits/${p.head}`, {
              headers,
            })
              .then((r) =>
                r.ok
                  ? (r.json() as Promise<{ commit?: { message?: string } }>)
                  : null,
              )
              .catch(() => null),
      ])
      const fields: Partial<GhEvent> = {}
      if (
        cmp &&
        typeof cmp.total_commits === 'number' &&
        cmp.total_commits > 0
      ) {
        fields.count = cmp.total_commits
      }
      const newestMsg = head?.commit?.message?.split('\n')[0]
      if (newestMsg) fields.message = newestMsg
      return Object.keys(fields).length > 0 ? [e.id, fields] : null
    }),
  )
  return out.filter((p): p is Patch => p !== null)
}

// ─── Title enrichment (lazy, parallel) ──────────────────────────────────────

async function enrichTitles(events: GhEvent[]): Promise<Patch[]> {
  const headers = ghHeaders()
  const tasks = events.map(async (e): Promise<Patch | null> => {
    if (e.private) return null
    if (e.type !== 'pr' && e.type !== 'issue') return null
    if (e.message.includes(' · ')) return null // already has a title
    const numMatch = e.message.match(/#(\d+)/)
    if (!numMatch) return null
    const number = numMatch[1]
    const endpoint =
      e.type === 'pr'
        ? `https://api.github.com/repos/${e.repo}/pulls/${number}`
        : `https://api.github.com/repos/${e.repo}/issues/${number}`
    try {
      const res = await fetch(endpoint, { headers })
      if (!res.ok) return null
      const j = (await res.json()) as { title?: string }
      if (!j.title) return null
      const action = e.message.split(' ')[0]
      return [e.id, { message: `${action} #${number} · ${j.title}` }]
    } catch {
      return null
    }
  })
  const out = await Promise.all(tasks)
  return out.filter((p): p is Patch => p !== null)
}

// ─── Public API ─────────────────────────────────────────────────────────────

async function fetchEvents(): Promise<EventsData | null> {
  try {
    // Authenticated user endpoint: returns public + private events.
    // Falls back to /events/public behaviour if the token is missing.
    const endpoint = process.env.GITHUB_TOKEN?.trim()
      ? `https://api.github.com/users/${LOGIN}/events?per_page=100`
      : `https://api.github.com/users/${LOGIN}/events/public?per_page=100`
    const res = await fetch(endpoint, { headers: ghHeaders() })
    if (!res.ok) return null
    const raw = (await res.json()) as RawEvent[]
    const shaped = shape(raw)
    // Les deux passes portent sur des événements disjoints (pushes d'un côté,
    // PR/issues de l'autre) : les enchaîner additionnait leurs latences pour
    // rien. Chacune renvoie des patches, appliqués ensuite par id.
    const [pushPatches, titlePatches] = await Promise.all([
      enrichPushes(shaped),
      enrichTitles(shaped),
    ])
    const patches = new Map<string, Partial<GhEvent>>([
      ...pushPatches,
      ...titlePatches,
    ])
    const events: GhEvent[] = shaped.map((e) => {
      const { _push, ...rest } = e
      return { ...rest, ...patches.get(e.id) }
    })
    const data: EventsData = { events, fetchedAt: new Date().toISOString() }
    eventsCache = { at: Date.now(), ttl: TTL_MS, data }
    return data
  } catch {
    return null
  }
}

function revalidateEvents(): Promise<EventsData | null> {
  if (!eventsInflight) {
    eventsInflight = fetchEvents().finally(() => {
      eventsInflight = null
    })
  }
  return eventsInflight
}

export const getGithubActivity = createServerFn({ method: 'GET' }).handler(
  async (): Promise<EventsData> => {
    edgeCache(60, 600)
    if (isFresh(eventsCache)) return eventsCache!.data
    const refresh = revalidateEvents()
    // Périmé mais présent : on le sert tel quel et on laisse la revalidation
    // finir en fond — le poll suivant récupère la version à jour. Attendre
    // ici, c'était faire patienter le visiteur pour un feed qui bouge peu.
    if (eventsCache) return eventsCache.data
    return (
      (await refresh) ?? { events: [], fetchedAt: new Date().toISOString() }
    )
  },
)

const PROFILE_QUERY = `
query Profile($login: String!) {
  user(login: $login) {
    contributionsCollection {
      totalCommitContributions
      totalPullRequestContributions
      totalIssueContributions
      totalRepositoriesWithContributedCommits
      contributionCalendar {
        totalContributions
        weeks {
          contributionDays {
            date
            contributionCount
          }
        }
      }
    }
  }
${AUTHOR_LOGINS.map(
  (l, i) => `  author${i}: user(login: ${JSON.stringify(l)}) { id }`,
).join('\n')}
}`

// ─── Real commit count ──────────────────────────────────────────────────────
// GitHub's contributionsCollection buries every private-repo contribution in
// restrictedContributionsCount, even for your own token. To show a real
// commit count we sum default-branch commits authored by AUTHOR_LOGINS across
// every accessible repo pushed within the window.

type RepoRef = { owner: string; name: string }

async function listReposPushedSince(sinceIso: string): Promise<RepoRef[]> {
  const headers = ghHeaders()
  const out: RepoRef[] = []
  for (let page = 1; page <= 5; page++) {
    const res = await fetch(
      `https://api.github.com/user/repos?per_page=100&page=${page}&sort=pushed&direction=desc&affiliation=owner,collaborator,organization_member`,
      { headers },
    )
    if (!res.ok) break
    const batch = (await res.json()) as Array<{
      full_name: string
      pushed_at: string | null
    }>
    for (const r of batch) {
      // Sorted by pushed_at desc — past the window, nothing left to count.
      if (!r.pushed_at || r.pushed_at < sinceIso) return out
      const [owner, name] = r.full_name.split('/')
      out.push({ owner, name })
    }
    if (batch.length < 100) break
  }
  return out
}

async function countCommitsSince(
  authorIds: string[],
  sinceIso: string,
): Promise<number | null> {
  if (authorIds.length === 0) return null
  const repos = await listReposPushedSince(sinceIso)
  if (repos.length === 0) return 0
  const headers = { ...ghHeaders(), 'Content-Type': 'application/json' }

  const fields: string[] = []
  repos.forEach((r, ri) => {
    authorIds.forEach((id, ai) => {
      fields.push(
        `r${ri}_a${ai}: repository(owner: ${JSON.stringify(r.owner)}, name: ${JSON.stringify(r.name)}) { defaultBranchRef { target { ... on Commit { history(author: {id: ${JSON.stringify(id)}}, since: $since) { totalCount } } } } }`,
      )
    })
  })

  const CHUNK = 40
  const chunks: string[][] = []
  for (let i = 0; i < fields.length; i += CHUNK) {
    chunks.push(fields.slice(i, i + CHUNK))
  }
  const sums = await Promise.all(
    chunks.map(async (chunk) => {
      const query = `query Commits($since: GitTimestamp!) {\n${chunk.join('\n')}\n}`
      const res = await fetch('https://api.github.com/graphql', {
        method: 'POST',
        headers,
        body: JSON.stringify({ query, variables: { since: sinceIso } }),
      })
      if (!res.ok) return null
      const j = (await res.json()) as {
        data?: Record<
          string,
          {
            defaultBranchRef?: {
              target?: { history?: { totalCount?: number } }
            } | null
          } | null
        > | null
      }
      if (!j.data) return null
      let sum = 0
      for (const key of Object.keys(j.data)) {
        sum += j.data[key]?.defaultBranchRef?.target?.history?.totalCount ?? 0
      }
      return sum
    }),
  )
  // One failed chunk means an incomplete (understated) total — bail out and
  // let the caller fall back instead of showing a silently wrong number.
  if (sums.some((s) => s == null)) return null
  return sums.reduce<number>((a, b) => a + (b ?? 0), 0)
}

const EMPTY_PROFILE: GhProfile = {
  totalContributions: 0,
  totalCommits: 0,
  totalPRs: 0,
  totalIssues: 0,
  totalActiveRepos: 0,
  longestStreak: 0,
  currentStreak: 0,
  weeks: [],
  fetchedAt: new Date(0).toISOString(),
}

async function fetchProfile(): Promise<GhProfile | null> {
  const token = process.env.GITHUB_TOKEN?.trim()
  if (!token) return null
  try {
    const res = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        ...ghHeaders(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: PROFILE_QUERY,
        variables: { login: LOGIN },
      }),
    })
    if (!res.ok) {
      const errText = await res.text().catch(() => '')
      console.log('[github] GraphQL error body:', errText.slice(0, 300))
      return null
    }
    const j = (await res.json()) as {
      data?: {
        user?: {
          contributionsCollection?: {
            totalCommitContributions: number
            totalPullRequestContributions: number
            totalIssueContributions: number
            totalRepositoriesWithContributedCommits: number
            contributionCalendar: {
              totalContributions: number
              weeks: Array<{
                contributionDays: Array<{
                  date: string
                  contributionCount: number
                }>
              }>
            }
          }
        }
      } & Record<string, { id?: string } | undefined>
    }
    const c = j.data?.user?.contributionsCollection
    if (!c) return null

    const authorIds = AUTHOR_LOGINS.map(
      (_, i) => j.data?.[`author${i}`]?.id,
    ).filter((id): id is string => typeof id === 'string')

    const flatDays: Array<{ date: string; count: number }> = []
    const weeks: Array<{ days: GhDay[] }> = c.contributionCalendar.weeks.map(
      (w) => {
        const days: GhDay[] = w.contributionDays.map((d) => {
          flatDays.push({ date: d.date, count: d.contributionCount })
          return { date: d.date, count: d.contributionCount, level: 0 }
        })
        return { days }
      },
    )

    const max = Math.max(...flatDays.map((d) => d.count), 1)
    weeks.forEach((w) =>
      w.days.forEach((d) => {
        d.level = levelOf(d.count, max)
      }),
    )

    // Streaks
    const sorted = [...flatDays].sort((a, b) => a.date.localeCompare(b.date))
    let longest = 0
    let run = 0
    for (const d of sorted) {
      if (d.count > 0) {
        run += 1
        if (run > longest) longest = run
      } else {
        run = 0
      }
    }
    let current = 0
    let ci = sorted.length - 1
    // Today without contributions (yet) doesn't break the streak.
    if (ci >= 0 && sorted[ci].count === 0) ci--
    for (; ci >= 0; ci--) {
      if (sorted[ci].count > 0) current += 1
      else break
    }

    const base: GhProfile = {
      totalContributions: c.contributionCalendar.totalContributions,
      // Real commit count across all accessible repos (private included) —
      // totalCommitContributions only covers public ones. The sweep below
      // raises it when it lands.
      totalCommits: c.totalCommitContributions,
      totalPRs: c.totalPullRequestContributions,
      totalIssues: c.totalIssueContributions,
      totalActiveRepos: c.totalRepositoriesWithContributedCommits,
      longestStreak: longest,
      currentStreak: current,
      weeks,
      fetchedAt: new Date().toISOString(),
    }

    // Le sweep (listing des repos + comptage par repo) est la partie lente.
    // On lui laisse un petit budget dans le chemin de réponse ; au-delà on
    // répond sans lui et il rejoint le cache dès qu'il aboutit. Avant, son
    // résultat était purement jeté au timeout : le chiffre restait bas
    // jusqu'à ce qu'un cycle complet repasse, d'où le refresh manuel.
    const since = new Date(Date.now() - 365 * 86_400_000).toISOString()
    const sweep = countCommitsSince(authorIds, since).catch(() => null)
    const counted = await Promise.race([sweep, timeoutNull(SWEEP_BUDGET_MS)])

    const data: GhProfile =
      counted != null
        ? { ...base, totalCommits: Math.max(base.totalCommits, counted) }
        : base
    profileCache = {
      at: Date.now(),
      ttl: counted != null ? PROFILE_TTL_MS : TTL_MS,
      data,
    }

    if (counted == null) {
      void sweep.then((late) => {
        // Ne pas écraser une entrée plus récente écrite entre-temps.
        if (late == null || profileCache?.data !== data) return
        profileCache = {
          at: Date.now(),
          ttl: PROFILE_TTL_MS,
          data: { ...data, totalCommits: Math.max(data.totalCommits, late) },
        }
      })
    }
    return data
  } catch (err) {
    console.log(
      '[github] getGithubProfile threw:',
      err instanceof Error ? err.message : String(err),
    )
    return null
  }
}

function revalidateProfile(): Promise<GhProfile | null> {
  if (!profileInflight) {
    profileInflight = fetchProfile().finally(() => {
      profileInflight = null
    })
  }
  return profileInflight
}

export const getGithubProfile = createServerFn({ method: 'GET' }).handler(
  async (): Promise<GhProfile> => {
    // Le profil bouge beaucoup moins que le feed : fenêtre plus large.
    edgeCache(300, 3600)
    if (isFresh(profileCache)) return profileCache!.data
    const refresh = revalidateProfile()
    // Même logique que le feed : le périmé part tout de suite, la
    // revalidation suit en fond.
    if (profileCache) return profileCache.data
    return (await refresh) ?? EMPTY_PROFILE
  },
)
