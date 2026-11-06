// Machine-readable projections of the site: /llms.txt, /llms-full.txt and a plain
// markdown mirror of every page (/index.md, /lodos.md, /blog/<slug>.md, ...).
//
// Everything here is DERIVED from the same sources the HTML pages render from (the
// content collections, the page frontmatter, src/config.ts and src/data/stats.json).
// No sentence lives only in these files, so they cannot drift away from the site.
import { getCollection, getEntry } from 'astro:content'

import { SITE, UI } from '~/config'
import stats from '~/data/stats.json'
import projectsData from '~/content/projects/data.json'
import { getFilteredPosts, getSortedPosts } from '~/utils/data'

export const ORIGIN = SITE.website.replace(/\/$/, '')
export const abs = (path: string) => `${ORIGIN}${path}`

/**
 * Which HTML paths have a markdown mirror, and where it lives. This is the single
 * answer used by the <link rel="alternate"> tag. nginx.conf mirrors the same rule
 * for `Accept: text/markdown` and the `Link` header; keep the two in sync.
 *   /            -> /index.md
 *   /lodos/      -> /lodos.md
 *   /blog/x/     -> /blog/x.md
 */
export function markdownMirrorPath(pathname: string): string | null {
  const p = pathname.replace(/\/+$/, '') || '/'
  if (p === '/') return '/index.md'
  if (/^\/(lodos|projects|blog|shorts)$/.test(p)) return `${p}.md`
  if (/^\/(blog|shorts)\/[^/.]+$/.test(p)) return `${p}.md`
  return null
}

/** Page frontmatter (title/subtitle/description) from the `pages` collection. */
async function pageMeta(file: string) {
  const pages = await getCollection('pages')
  const entry = pages.find((p) => p.filePath?.endsWith(`src/pages/${file}`))
  if (!entry) throw new Error(`Page not found: ${file}`)
  return entry.data as {
    title: string
    subtitle?: string
    description?: string
  }
}

/**
 * Turn the site's markdown into plain, portable markdown:
 * `:link[text]{id=URL ...}` directives become normal links, relative links become
 * absolute, and raw HTML blocks are dropped (the social links they held are emitted
 * separately from config).
 */
export function plainMarkdown(body: string): string {
  return body
    .replace(/:link\[([^\]]+)\]\{id=(\S+?)(?:\s[^}]*)?\}/g, '[$1]($2)')
    .replace(/\]\(\.\/([^)]*)\)/g, (_m, p) => `](${abs('/' + p)})`)
    .replace(/<p>[\s\S]*?<\/p>/g, '')
    .replace(/\n-{3,}\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

/** A standard header every mirror starts with. */
function docHeader(title: string, canonical: string, description?: string) {
  return [
    `# ${title}`,
    '',
    ...(description ? [`> ${description}`, ''] : []),
    `Source: ${canonical}`,
    '',
  ].join('\n')
}

const fmt = new Intl.NumberFormat('en-US')

export function socialLinksMarkdown() {
  return UI.socialLinks.map((l) => `- [${l.title}](${l.link})`).join('\n')
}

export function activityMarkdown() {
  const lines: string[] = []
  if (stats.x)
    lines.push(
      `- ${fmt.format(stats.x.followers)} followers on X ([@${stats.x.handle}](https://x.com/${stats.x.handle}))`
    )
  if (stats.github)
    lines.push(
      `- ${fmt.format(stats.github.total)} GitHub contributions in the last year ([${stats.github.user}](https://github.com/${stats.github.user}))`
    )
  return lines.join('\n')
}

async function homeBody(id: string) {
  const entry = await getEntry('home', id)
  if (!entry?.body) throw new Error(`Home entry not found: ${id}`)
  return plainMarkdown(entry.body)
}

export async function homeDoc() {
  const meta = await pageMeta('index.mdx')
  return [
    docHeader(`${meta.title}: ${meta.subtitle}`, abs('/'), SITE.description),
    `![Portrait of ${SITE.author}](${abs('/images/samet-samyeli.jpg')})`,
    '',
    await homeBody('intro'),
    '',
    '## Activity',
    '',
    activityMarkdown(),
    '',
    (await homeBody('index')).replace(/^\*\*(.+?)\*\*$/gm, '## $1'),
    '',
    '## Links',
    '',
    socialLinksMarkdown(),
    '',
  ].join('\n')
}

export async function lodosDoc() {
  const meta = await pageMeta('lodos.mdx')
  return [
    docHeader(
      `${meta.title}: ${meta.subtitle}`,
      abs('/lodos/'),
      meta.description
    ),
    await homeBody('lodos'),
    '',
  ].join('\n')
}

export async function projectsDoc() {
  const meta = await pageMeta('projects.mdx')
  // data.json order is the display order (the collection loader does not keep it).
  const groups = new Map<string, typeof projectsData>()
  for (const p of projectsData) {
    const list = groups.get(p.category) ?? []
    list.push(p)
    groups.set(p.category, list)
  }
  const sections = [...groups].map(
    ([category, list]) =>
      `## ${category}\n\n` +
      list.map((p) => `- [${p.id}](${p.link}): ${p.desc}`).join('\n')
  )
  return [
    docHeader(meta.title, abs('/projects/'), meta.subtitle),
    sections.join('\n\n'),
    '',
  ].join('\n')
}

type Collection = 'blog' | 'shorts'

export async function postsOf(collection: Collection) {
  return getSortedPosts(await getFilteredPosts(collection))
}

const isoDate = (d: Date) => d.toISOString().slice(0, 10)

/** Canonical URL of a post. Redirect posts (Medium) point at the real article. */
export function postUrl(
  collection: Collection,
  post: { id: string; data: { redirect?: string } }
) {
  return post.data.redirect || abs(`/${collection}/${post.id}/`)
}

export async function listDoc(collection: Collection) {
  const meta = await pageMeta(`${collection}/index.mdx`)
  const posts = await postsOf(collection)
  const items = posts.map((p) => {
    const where = p.data.platform ? ` (on ${p.data.platform})` : ''
    const desc = p.data.description ? `: ${p.data.description}` : ''
    return `- ${isoDate(p.data.pubDate)} · [${p.data.title}](${postUrl(collection, p)})${where}${desc}`
  })
  return [
    docHeader(meta.title, abs(`/${collection}/`), meta.subtitle),
    items.join('\n') || '_Nothing published yet._',
    '',
  ].join('\n')
}

export async function postDoc(
  collection: Collection,
  post: Awaited<ReturnType<typeof postsOf>>[number]
) {
  const { data } = post
  const facts = [
    `Published: ${isoDate(data.pubDate)}`,
    `Author: ${SITE.author}`,
    data.tags?.length ? `Tags: ${data.tags.join(', ')}` : null,
  ].filter(Boolean)
  const body = data.redirect
    ? `This article is published on ${data.platform || 'another site'}. Read the full text at ${data.redirect}`
    : plainMarkdown(post.body ?? '')
  return [
    docHeader(data.title, abs(`/${collection}/${post.id}/`), data.description),
    facts.join('\n'),
    '',
    body,
    '',
  ].join('\n')
}

export function markdownResponse(doc: string, canonicalPath: string) {
  return new Response(doc, {
    headers: {
      'content-type': 'text/markdown; charset=utf-8',
      'link': `<${abs(canonicalPath)}>; rel="canonical"`,
    },
  })
}
