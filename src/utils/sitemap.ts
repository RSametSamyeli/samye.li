import fs from 'node:fs'
import path from 'node:path'

/**
 * What the sitemap needs to know about the posts, read straight from their
 * frontmatter: the config runs before content collections exist.
 *
 * - `skip`: URLs that are not pages of this site (posts published elsewhere,
 *   whose URL here only redirects) and so stay out of the sitemap
 * - `lastmod`: each post's last change, so crawlers revisit what changed
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

  return { skip, lastmod }
}
