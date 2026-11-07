/**
 * The host's half of the site, written beside the build: Cloudflare Pages
 * reads `_headers` and `_redirects` from the folder it serves (dist/). Both
 * are derived here, at the end of every build, from what the build produced,
 * so they cannot drift from the pages they describe:
 *
 *   - every response carries the security headers: a Content Security
 *     Policy, nosniff, a strict referrer policy, a locked-down permissions
 *     policy, and frame and opener isolation. HSTS is set at Cloudflare's
 *     edge for the whole zone (SSL/TLS > Edge Certificates), not here.
 *   - caching: hashed files (/_astro/, Pagefind's index) for a year,
 *     immutable; generated images and icons for a day; everything else,
 *     pages included, revalidated on every request against its ETag
 *     (Pages' default: `public, max-age=0, must-revalidate`).
 *   - markdown and text files say they are UTF-8, so a Turkish ğ or ş
 *     arrives as itself.
 *   - every page with a markdown mirror names it in a `Link` header, as its
 *     <head> does, for agents that read headers before bodies; the mirror in
 *     turn names the page as canonical, so search engines index the page and
 *     never the copy.
 *   - a post published elsewhere (`redirect:` in its frontmatter) answers
 *     with a 301 to where it lives, and so does its markdown copy; the
 *     meta-refresh page Astro writes stays as the fallback.
 *   - the project's own *.pages.dev addresses stay out of search engines;
 *     samye.li is the only address to index.
 *
 * Static only, on purpose: no Pages Functions, so nothing runs on the
 * request path, and every rule here applies (a Function's response skips
 * `_headers` and `_redirects`). scripts/verify-build.mjs checks the result.
 *
 * https://developers.cloudflare.com/pages/configuration/headers/
 * https://developers.cloudflare.com/pages/configuration/redirects/
 */
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import type { AstroIntegration } from 'astro'

/** Cloudflare's limits: header rules, and characters on one line of each file. */
const MAX_HEADER_RULES = 100
const MAX_HEADER_LINE = 2000
const MAX_STATIC_REDIRECTS = 2000
const MAX_REDIRECT_LINE = 1000

/**
 * What a page may load. Scripts and styles stay on this origin; inline ones
 * are allowed because Astro inlines small scripts (the theme, before first
 * paint) and the client router swaps pages in place, re-running them through
 * an empty data: script, so data: is allowed for scripts too.
 * 'wasm-unsafe-eval' is Pagefind's search index. Images may come from any
 * https origin (project and link icons). Cloudflare's analytics beacon is
 * allowed for when Web Analytics is on. Video frames come only from
 * YouTube's privacy-enhanced domain, loaded on play.
 */
const CSP: Record<string, string[]> = {
  'default-src': ["'self'"],
  'script-src': [
    "'self'",
    "'unsafe-inline'",
    "'wasm-unsafe-eval'",
    'data:',
    'https://static.cloudflareinsights.com',
  ],
  'style-src': ["'self'", "'unsafe-inline'"],
  'img-src': ["'self'", 'data:', 'https:'],
  'font-src': ["'self'", 'data:'],
  'connect-src': ["'self'", 'https://cloudflareinsights.com'],
  'worker-src': ["'self'", 'blob:'],
  'manifest-src': ["'self'"],
  'frame-src': ['https://www.youtube-nocookie.com'],
  'object-src': ["'none'"],
  'base-uri': ["'self'"],
  'form-action': ["'self'"],
  'frame-ancestors': ["'self'"],
  'upgrade-insecure-requests': [],
}

const SECURITY: Record<string, string> = {
  'Content-Security-Policy': Object.entries(CSP)
    .map(([directive, sources]) => [directive, ...sources].join(' '))
    .join('; '),
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy':
    'camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()',
  'Cross-Origin-Opener-Policy': 'same-origin',
  'X-Frame-Options': 'SAMEORIGIN',
}

const IMMUTABLE = { 'Cache-Control': 'public, max-age=31536000, immutable' }
const ONE_DAY = { 'Cache-Control': 'public, max-age=86400' }

type Rule = [pattern: string, headers: Record<string, string>]

/** The fixed rules. A path matched by several gets the headers of all of them. */
const RULES: Rule[] = [
  ['/*', SECURITY],
  // the project's own addresses: production and every preview
  ['https://:project.pages.dev/*', { 'X-Robots-Tag': 'noindex' }],
  ['https://:version.:project.pages.dev/*', { 'X-Robots-Tag': 'noindex' }],

  // file names that carry a hash of their content: never change, never refetch
  ['/_astro/*', IMMUTABLE],
  ['/pagefind/fragment/*', IMMUTABLE],
  ['/pagefind/index/*', IMMUTABLE],
  ['/pagefind/filter/*', IMMUTABLE],
  ['/pagefind/*.pf_meta', IMMUTABLE],
  // generated at build time under fixed names: a day is fresh enough
  ['/og-images/*', ONE_DAY],
  ['/brands/*', ONE_DAY],
  ['/favicon.svg', ONE_DAY],
  ['/favicon.ico', ONE_DAY],
  ['/apple-touch-icon.png', ONE_DAY],
  ['/icon-*', ONE_DAY],

  // client work shared by link: reachable, never indexed
  ['/branding/*', { 'X-Robots-Tag': 'noindex, nofollow' }],

  ['/*.md', { 'Content-Type': 'text/markdown; charset=utf-8' }],
  ['/*.txt', { 'Content-Type': 'text/plain; charset=utf-8' }],
]

/** Every file under a folder, as site paths ('/blog/x/index.html'). */
async function sitePaths(root: string): Promise<string[]> {
  const entries = await fs.readdir(root, {
    recursive: true,
    withFileTypes: true,
  })
  return entries
    .filter((entry) => entry.isFile())
    .map((entry) =>
      `/${path.relative(root, path.join(entry.parentPath, entry.name))}`
        .split(path.sep)
        .join('/')
    )
}

/** The attributes of each `<tag ...>` in a document. */
function tags(html: string, name: string) {
  return [...html.matchAll(new RegExp(`<${name}\\b([^>]*)>`, 'gi'))].map(
    ([, attrs]) =>
      Object.fromEntries(
        [...attrs.matchAll(/([\w-]+)="([^"]*)"/g)].map(([, k, v]) => [
          k.toLowerCase(),
          v.replace(/&amp;/g, '&'),
        ])
      )
  )
}

/** '/blog/x/index.html' -> '/blog/x/', '/404.html' -> '/404' */
const pageOf = (file: string) =>
  file.endsWith('/index.html')
    ? file.slice(0, -'index.html'.length)
    : file.replace(/\.html$/, '')

const markdownLink = (href: string) =>
  `<${href}>; rel="alternate"; type="text/markdown"`
const canonicalLink = (href: string) => `<${href}>; rel="canonical"`

/**
 * Two `Link` rules per page with a markdown mirror: the page names its
 * mirror, the mirror names the page as canonical. Where every page in a
 * folder has its mirror beside it as `<folder>/<slug>.md` (the blog, the
 * notes), a pair of pattern rules covers the folder, so a new post never
 * needs rules of its own and the file stays well below Cloudflare's 100.
 */
function linkRules(
  mirrors: Map<string, string>,
  pages: string[],
  origin: string
): Rule[] {
  const byFolder = new Map<string, string[]>()
  for (const page of pages) {
    const match = /^(\/.+\/)[^/]+\/$/.exec(page)
    if (match) byFolder.set(match[1], [...(byFolder.get(match[1]) ?? []), page])
  }
  const covered = new Set<string>()
  const rules: Rule[] = []
  for (const [folder, children] of byFolder) {
    const all = children.every(
      (page) => mirrors.get(page) === `${page.slice(0, -1)}.md`
    )
    if (!all) continue
    rules.push(
      [`${folder}:slug/`, { Link: markdownLink(`${folder}:slug.md`) }],
      [`${folder}*.md`, { Link: canonicalLink(`${origin}${folder}:splat/`) }]
    )
    for (const page of children) covered.add(page)
  }
  for (const [page, href] of mirrors)
    if (!covered.has(page))
      rules.push(
        [page, { Link: markdownLink(href) }],
        [href, { Link: canonicalLink(`${origin}${page}`) }]
      )
  return rules.sort(([a], [b]) => a.localeCompare(b))
}

function serializeHeaders(rules: Rule[]) {
  const blocks = rules.map(([pattern, headers]) =>
    [
      pattern,
      ...Object.entries(headers).map(([name, value]) => `  ${name}: ${value}`),
    ].join('\n')
  )
  return `# Generated by src/integrations/cloudflare-pages.ts on every build.\n\n${blocks.join('\n\n')}\n`
}

export default function cloudflarePages(): AstroIntegration {
  let origin = ''
  return {
    name: 'samye.li:cloudflare-pages',
    hooks: {
      'astro:config:done': ({ config }) => {
        if (!config.site) throw new Error('cloudflare-pages: `site` is not set')
        origin = new URL(config.site).origin
      },
      'astro:build:done': async ({ dir, logger }) => {
        const root = fileURLToPath(dir)
        const files = await sitePaths(root)
        const htmlFiles = files.filter((file) => file.endsWith('.html'))

        const mirrors = new Map<string, string>()
        const redirects = new Map<string, string>()
        const pages: string[] = []
        for (const file of htmlFiles) {
          const html = await fs.readFile(path.join(root, file), 'utf8')
          const page = pageOf(file)
          const refresh = tags(html, 'meta').find(
            (meta) => meta['http-equiv']?.toLowerCase() === 'refresh'
          )
          const target = refresh?.content?.match(/url=(.+)$/i)?.[1]
          if (target) {
            redirects.set(page, target)
            continue
          }
          pages.push(page)
          const mirror = tags(html, 'link').find(
            (link) => link.rel === 'alternate' && link.type === 'text/markdown'
          )?.href
          if (mirror) mirrors.set(page, mirror)
        }

        const rules = [...RULES, ...linkRules(mirrors, pages, origin)]
        const headers = serializeHeaders(rules)
        if (rules.length > MAX_HEADER_RULES - 10)
          logger.warn(
            `_headers: ${rules.length} of ${MAX_HEADER_RULES} rules; time for more pattern rules`
          )
        if (rules.length > MAX_HEADER_RULES)
          throw new Error(
            `_headers: ${rules.length} rules, Cloudflare Pages reads ${MAX_HEADER_RULES}`
          )
        for (const line of headers.split('\n'))
          if (line.length > MAX_HEADER_LINE)
            throw new Error(
              `_headers: a line over ${MAX_HEADER_LINE} characters`
            )

        // both spellings of each address: the rule matches the path as asked
        // and the post's markdown copy, which only says it moved
        const fileSet = new Set(files)
        const redirectLines = [...redirects]
          .sort(([a], [b]) => a.localeCompare(b))
          .flatMap(([from, to]) =>
            [from, from.replace(/\/$/, ''), `${from.replace(/\/$/, '')}.md`]
              .filter((p, i, all) => p && all.indexOf(p) === i)
              .filter((p) => !p.endsWith('.md') || fileSet.has(p))
              .map((p) => `${p} ${to} 301`)
          )
        if (redirectLines.length > MAX_STATIC_REDIRECTS)
          throw new Error(
            `_redirects: ${redirectLines.length} rules, Cloudflare Pages reads ${MAX_STATIC_REDIRECTS}`
          )
        for (const line of redirectLines)
          if (line.length > MAX_REDIRECT_LINE)
            throw new Error(
              `_redirects: over ${MAX_REDIRECT_LINE} characters: ${line}`
            )

        await fs.writeFile(path.join(root, '_headers'), headers)
        await fs.writeFile(
          path.join(root, '_redirects'),
          `# Generated by src/integrations/cloudflare-pages.ts on every build.\n# Posts published elsewhere: a permanent redirect to where they live.\n\n${redirectLines.join('\n')}\n`
        )
        logger.info(
          `_headers: ${rules.length} rules (${mirrors.size} markdown mirrors); _redirects: ${redirectLines.length} rules`
        )
      },
    },
  }
}
