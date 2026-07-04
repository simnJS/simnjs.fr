import { createServerFn } from '@tanstack/react-start'

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
let eventsCache: {
  at: number
  data: { events: GhEvent[]; fetchedAt: string }
} | null = null
// ttl par entrée : court quand le sweep de commits a échoué/timeout, pour
// que le poll suivant retente vite au lieu d'afficher 5 min un chiffre bas.
let profileCache: { at: number; ttl: number; data: GhProfile } | null = null

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
        const firstMsg = e.payload.commits?.[0]?.message?.split('\n')[0] ?? ''
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
        if (firstMsg) {
          message = firstMsg
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
        // count/message later via the compare API. Skip branch creations
        // (before is all zeros — nothing to compare against).
        if (!firstMsg && e.payload.before && e.payload.head) {
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

// ─── Push enrichment (compare API, parallel) ────────────────────────────────

// Recover the real commit count (and first message for public rows) of each
// push group by comparing oldest `before` → newest `head`. Needed because the
// authenticated events endpoint strips commits/size from push payloads.
async function enrichPushes(events: ShapedEvent[]): Promise<ShapedEvent[]> {
  const headers = ghHeaders()
  return Promise.all(
    events.map(async (e) => {
      const p = e._push
      if (!p) return e
      try {
        const res = await fetch(
          `https://api.github.com/repos/${p.repo}/compare/${p.before}...${p.head}?per_page=1`,
          { headers },
        )
        if (!res.ok) return e
        const j = (await res.json()) as {
          total_commits?: number
          commits?: Array<{ commit?: { message?: string } }>
        }
        if (typeof j.total_commits === 'number' && j.total_commits > 0) {
          e.count = j.total_commits
        }
        const firstMsg = j.commits?.[0]?.commit?.message?.split('\n')[0]
        if (firstMsg && !e.private) e.message = firstMsg
        return e
      } catch {
        return e
      }
    }),
  )
}

// ─── Title enrichment (lazy, parallel) ──────────────────────────────────────

async function enrichTitles(events: GhEvent[]): Promise<GhEvent[]> {
  const headers = ghHeaders()
  const tasks = events.map(async (e) => {
    if (e.private) return e
    if (e.type !== 'pr' && e.type !== 'issue') return e
    if (e.message.includes(' · ')) return e // already has a title
    const numMatch = e.message.match(/#(\d+)/)
    if (!numMatch) return e
    const number = numMatch[1]
    const endpoint =
      e.type === 'pr'
        ? `https://api.github.com/repos/${e.repo}/pulls/${number}`
        : `https://api.github.com/repos/${e.repo}/issues/${number}`
    try {
      const res = await fetch(endpoint, { headers })
      if (!res.ok) return e
      const j = (await res.json()) as { title?: string }
      if (!j.title) return e
      const action = e.message.split(' ')[0]
      return { ...e, message: `${action} #${number} · ${j.title}` }
    } catch {
      return e
    }
  })
  return Promise.all(tasks)
}

// ─── Public API ─────────────────────────────────────────────────────────────

export const getGithubActivity = createServerFn({ method: 'GET' }).handler(
  async (): Promise<{ events: GhEvent[]; fetchedAt: string }> => {
    if (eventsCache && Date.now() - eventsCache.at < TTL_MS) {
      return eventsCache.data
    }
    try {
      // Authenticated user endpoint: returns public + private events.
      // Falls back to /events/public behaviour if the token is missing.
      const endpoint = process.env.GITHUB_TOKEN?.trim()
        ? `https://api.github.com/users/${LOGIN}/events?per_page=100`
        : `https://api.github.com/users/${LOGIN}/events/public?per_page=100`
      const res = await fetch(endpoint, { headers: ghHeaders() })
      if (!res.ok) {
        return (
          eventsCache?.data ?? {
            events: [],
            fetchedAt: new Date().toISOString(),
          }
        )
      }
      const raw = (await res.json()) as RawEvent[]
      const shaped = shape(raw)
      const withCounts = await enrichPushes(shaped)
      const enriched = await enrichTitles(withCounts)
      const events = enriched.map((e) => {
        const { _push, ...rest } = e as ShapedEvent
        return rest
      })
      const data = { events, fetchedAt: new Date().toISOString() }
      eventsCache = { at: Date.now(), data }
      return data
    } catch {
      return (
        eventsCache?.data ?? {
          events: [],
          fetchedAt: new Date().toISOString(),
        }
      )
    }
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

export const getGithubProfile = createServerFn({ method: 'GET' }).handler(
  async (): Promise<GhProfile> => {
    if (profileCache && Date.now() - profileCache.at < profileCache.ttl) {
      return profileCache.data
    }
    const token = process.env.GITHUB_TOKEN?.trim()
    if (!token) return profileCache?.data ?? EMPTY_PROFILE
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
        return profileCache?.data ?? EMPTY_PROFILE
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
      if (!c) return profileCache?.data ?? EMPTY_PROFILE

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

      // Real commit count across all accessible repos (private included) —
      // totalCommitContributions only covers public ones. Fall back to it if
      // the sweep fails, and cap its duration so a cold start never blocks
      // the whole profile response (the next poll gets the full number).
      let totalCommits = c.totalCommitContributions
      const since = new Date(Date.now() - 365 * 86_400_000).toISOString()
      const counted = await Promise.race([
        countCommitsSince(authorIds, since),
        new Promise<null>((resolve) => {
          setTimeout(() => resolve(null), 6_500)
        }),
      ]).catch(() => null)
      if (counted != null) totalCommits = Math.max(totalCommits, counted)

      const data: GhProfile = {
        totalContributions: c.contributionCalendar.totalContributions,
        totalCommits,
        totalPRs: c.totalPullRequestContributions,
        totalIssues: c.totalIssueContributions,
        totalActiveRepos: c.totalRepositoriesWithContributedCommits,
        longestStreak: longest,
        currentStreak: current,
        weeks,
        fetchedAt: new Date().toISOString(),
      }
      profileCache = {
        at: Date.now(),
        ttl: counted != null ? PROFILE_TTL_MS : TTL_MS,
        data,
      }
      return data
    } catch (err) {
      console.log('[github] getGithubProfile threw:', err instanceof Error ? err.message : String(err))
      return profileCache?.data ?? EMPTY_PROFILE
    }
  },
)
