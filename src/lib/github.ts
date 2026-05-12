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
    pull_request?: { number?: number; title?: string; merged?: boolean }
    issue?: { number?: number; title?: string }
    release?: { name: string | null; tag_name: string; html_url: string }
    forkee?: { full_name: string; html_url: string }
  }
}

// ─── Cache ──────────────────────────────────────────────────────────────────

// Orgs whose events should count toward stats but stay anonymous in the feed.
const PRIVATE_ORG_PREFIXES = ['Ca-Stake-Engine-Ou-Quoi-La/']

const TTL_MS = 60_000
let eventsCache: {
  at: number
  data: { events: GhEvent[]; fetchedAt: string }
} | null = null
let profileCache: { at: number; data: GhProfile } | null = null

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

function shape(raw: RawEvent[]): GhEvent[] {
  const out: GhEvent[] = []
  // dedup/group key → index in out
  const groupIdx = new Map<string, number>()

  for (const e of raw) {
    const repo = e.repo.name
    const repoUrl = `https://github.com/${repo}`
    const isPrivate =
      e.public === false ||
      PRIVATE_ORG_PREFIXES.some((p) => repo.startsWith(p))
    let evt: GhEvent | null = null
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
        const n = typeof size === 'number' ? size : commitCount
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
        url: 'https://github.com/simnJS',
        private: true,
      }
    }

    if (groupKey && groupIdx.has(groupKey)) {
      const idx = groupIdx.get(groupKey)!
      out[idx].count = (out[idx].count ?? 1) + 1
    } else {
      if (groupKey) groupIdx.set(groupKey, out.length)
      out.push(evt)
    }

    if (out.length >= 12) break
  }

  return out
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
      const endpoint = process.env.GITHUB_TOKEN
        ? 'https://api.github.com/users/simnJS/events?per_page=100'
        : 'https://api.github.com/users/simnJS/events/public?per_page=100'
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
      const enriched = await enrichTitles(shaped)
      const data = { events: enriched, fetchedAt: new Date().toISOString() }
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
}`

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
    if (profileCache && Date.now() - profileCache.at < TTL_MS) {
      return profileCache.data
    }
    const token = process.env.GITHUB_TOKEN?.trim()
    console.log('[github] getGithubProfile invoked, token present:', !!token, 'length:', token?.length ?? 0)
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
          variables: { login: 'simnJS' },
        }),
      })
      console.log('[github] GraphQL status:', res.status)
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
        }
      }
      const c = j.data?.user?.contributionsCollection
      console.log('[github] contributionsCollection present:', !!c, 'totalContrib:', c?.contributionCalendar?.totalContributions)
      if (!c) return profileCache?.data ?? EMPTY_PROFILE

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
      for (let i = sorted.length - 1; i >= 0; i--) {
        if (sorted[i].count > 0) current += 1
        else break
      }

      const data: GhProfile = {
        totalContributions: c.contributionCalendar.totalContributions,
        totalCommits: c.totalCommitContributions,
        totalPRs: c.totalPullRequestContributions,
        totalIssues: c.totalIssueContributions,
        totalActiveRepos: c.totalRepositoriesWithContributedCommits,
        longestStreak: longest,
        currentStreak: current,
        weeks,
        fetchedAt: new Date().toISOString(),
      }
      profileCache = { at: Date.now(), data }
      return data
    } catch (err) {
      console.log('[github] getGithubProfile threw:', err instanceof Error ? err.message : String(err))
      return profileCache?.data ?? EMPTY_PROFILE
    }
  },
)
