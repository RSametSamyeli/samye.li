// Fetches GitHub contribution history into src/data/stats.json (X followers are manual).
// Runs daily from .github/workflows/stats.yml. On any failure the previous value is kept.
import { readFile, writeFile } from 'node:fs/promises'

const FILE = new URL('../src/data/stats.json', import.meta.url)
const GITHUB_USER = 'RSametSamyeli'

const prev = JSON.parse(await readFile(FILE, 'utf8').catch(() => '{}'))

async function getJson(url) {
  const res = await fetch(url, {
    headers: { 'user-agent': 'samye.li-stats' },
    signal: AbortSignal.timeout(20000),
  })
  if (!res.ok) throw new Error(`${url} -> ${res.status}`)
  return res.json()
}

// X has no free API for follower counts, so this value is maintained by hand
// in src/data/stats.json (x.followers) and is carried over unchanged.
const x = prev.x ?? null

let github = prev.github ?? null
try {
  const data = await getJson(
    `https://github-contributions-api.jogruber.de/v4/${GITHUB_USER}?y=last`
  )
  const days = (data?.contributions ?? []).map(({ date, count, level }) => ({
    date,
    count,
    level,
  }))
  if (days.length < 300) throw new Error('unexpected contribution data')
  github = { user: GITHUB_USER, total: data.total?.lastYear ?? 0, days }
} catch (e) {
  console.warn('GitHub fetch failed, keeping previous value:', e.message)
}

const next = { x, github }
if (
  JSON.stringify(next) ===
  JSON.stringify({ x: prev.x ?? null, github: prev.github ?? null })
) {
  console.log('No changes.')
} else {
  await writeFile(FILE, JSON.stringify(next, null, 2) + '\n')
  console.log(
    `Updated: X ${x?.followers} followers, GitHub ${github?.total} contributions`
  )
}
