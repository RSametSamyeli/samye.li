import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'

/**
 * What the sitemap needs to know about the posts, read straight from their
 * frontmatter: the config runs before content collections exist.
 *
 * - `skip`: URLs that are not pages of this site (posts published elsewhere,
 *   whose URL here only redirects) and so stay out of the sitemap
 * - `lastmod`: each page's last change, so crawlers revisit what changed: a
 *   post's from its frontmatter, a page's from its `updated:` or, failing
 *   that, the last commit to its text and data (a change to the design is
 *   not a change to the page). A list page changes with its newest post.
 */
export function sitemapIndex(site: string) {
  const skip = new Set<string>([new URL('/404/', site).href])
  const lastmod = new Map<string, string>()

  for (const collection of ['blog', 'shorts']) {
    const dir = path.join('src/content', collection)
    if (!fs.existsSync(dir)) continue

    for (const file of fs.readdirSync(dir)) {
      if (!/^[^_].*\.mdx?$/.test(file)) continue
      const text = fs.readFileSync(path.join(dir, file), 'utf8')
      const front = /^---\n([\s\S]*?)\n---/.exec(text)?.[1] ?? ''
      const field = (name: string) =>
        new RegExp(`^${name}:\\s*['"]?([^'"\\n]*)`, 'm')
          .exec(front)?.[1]
          ?.trim()

      const url = new URL(
        `/${collection}/${file.replace(/\.mdx?$/, '')}/`,
        site
      ).href
      if (field('redirect') || field('draft') === 'true') {
        skip.add(url)
        continue
      }
      const date = field('lastModDate') || field('pubDate')
      if (date && !Number.isNaN(Date.parse(date)))
        lastmod.set(url, new Date(date).toISOString())
    }
  }

  // the newest post of each collection: when its list last changed
  const newest = (collection: string) =>
    [...lastmod]
      .filter(([url]) => new URL(url).pathname.startsWith(`/${collection}/`))
      .map(([, date]) => date)
      .sort()
      .at(-1)

  for (const file of walk('src/pages')) {
    if (!/\.(mdx|astro)$/.test(file) || file.includes('[')) continue
    const route = path
      .relative('src/pages', file)
      .replace(/\.(mdx|astro)$/, '')
      .replace(/(^|\/)index$/, '')
    if (route === '404') continue
    const url = new URL(route ? `/${route}/` : '/', site).href

    // a page that says when it last changed (updated: in its frontmatter)
    const front =
      /^---\n([\s\S]*?)\n---/.exec(fs.readFileSync(file, 'utf8'))?.[1] ?? ''
    const updated = /^updated:\s*['"]?([^'"\n]+)/m.exec(front)?.[1]?.trim()
    if (updated && !Number.isNaN(Date.parse(updated))) {
      lastmod.set(url, new Date(updated).toISOString())
      continue
    }

    // else the last commit to what it is made of
    const name = route.replace(/^tr\/?/, '')
    const dates = [
      lastCommit([
        file,
        path.join('src/content/home', `${route || 'index'}.md`),
        ...(PAGE_DATA[name] ?? []),
      ]),
      ['blog', 'shorts'].includes(name) ? newest(name) : undefined,
    ].filter((date): date is string => Boolean(date))
    if (dates.length) lastmod.set(url, dates.sort().at(-1)!)
  }

  return { skip, lastmod }
}

/** Pages made from data as well as their own text. */
const PAGE_DATA: Record<string, string[]> = {
  '': ['src/data/home.ts'],
  'projects': ['src/content/projects/data.json'],
  'reading': ['src/data/books.ts'],
  'music': ['src/data/music.ts', 'src/data/playlists.json'],
}

/** Whether git has the whole history (a shallow clone would date everything today). */
const fullHistory = (() => {
  try {
    return (
      execFileSync('git', ['rev-parse', '--is-shallow-repository'], {
        encoding: 'utf8',
      }).trim() === 'false'
    )
  } catch {
    return false
  }
})()

/** When any of these files was last committed, or nothing if unknown. */
function lastCommit(files: string[]): string | undefined {
  const tracked = files.filter((file) => fs.existsSync(file))
  if (!fullHistory || !tracked.length) return undefined
  try {
    const date = execFileSync(
      'git',
      ['log', '-1', '--format=%cI', '--', ...tracked],
      { encoding: 'utf8' }
    ).trim()
    return date ? new Date(date).toISOString() : undefined
  } catch {
    return undefined
  }
}

function walk(dir: string): string[] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name)
    return entry.isDirectory() ? walk(full) : [full]
  })
}
