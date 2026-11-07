#!/usr/bin/env node
// Checks the built site (dist/) for what search engines, answer engines and
// readers rely on, so a change that breaks one fails CI instead of shipping:
//
//   - every page: a title, a meta description of useful length, one <h1>,
//     <html lang>, a canonical URL (unless noindex), an OG image that exists,
//     and JSON-LD that parses into a @graph
//   - every internal link, image and script points at a file that exists
//   - the sitemap lists only real pages; llms.txt links resolve
//   - no em dash anywhere in the output (house style)
//   - the host's rules (Cloudflare Pages): _headers sends the security
//     headers on every path and names each page's markdown mirror, within
//     Cloudflare's limits; _redirects answers each moved post with a 301
//
// Run after `pnpm build`:  node scripts/verify-build.mjs
import fs from 'node:fs'
import path from 'node:path'

const DIST = path.resolve('dist')
const SITE = 'https://samye.li'
/** client work shared by link: served as authored, not checked */
const SKIP = [/^branding\//]

const problems = []
const fail = (file, message) => problems.push(`${file}: ${message}`)

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name)
    return entry.isDirectory() ? walk(full) : [full]
  })
}

const files = walk(DIST)
  .map((f) => path.relative(DIST, f).split(path.sep).join('/'))
  .filter((f) => !SKIP.some((re) => re.test(f)))

/** Whether a site path (/blog/x/, /rss.xml, /og-images/x.png) is a built file. */
function exists(sitePath) {
  const clean = decodeURIComponent(sitePath.split(/[?#]/)[0])
  if (SKIP.some((re) => re.test(clean.slice(1)))) return true
  const target = path.join(DIST, clean)
  if (clean.endsWith('/')) return fs.existsSync(path.join(target, 'index.html'))
  return (
    fs.existsSync(target) ||
    fs.existsSync(`${target}.html`) ||
    fs.existsSync(path.join(target, 'index.html'))
  )
}

const attr = (html, re) => re.exec(html)?.[1]
const decode = (s) =>
  s
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")

/** '/blog/x/' -> the redirect stub's target, or the page's markdown mirror */
const stubs = new Map()
const mirrors = new Map()
const pageOf = (file) => `/${file}`.replace(/(^|\/)index\.html$/, '$1')

for (const file of files.filter((f) => f.endsWith('.html'))) {
  const html = fs.readFileSync(path.join(DIST, file), 'utf8')

  // A redirect stub (posts published elsewhere): only its own rules apply.
  if (/<meta http-equiv="refresh"/.test(html)) {
    if (!/<meta name="robots" content="noindex"/.test(html))
      fail(file, 'redirect without noindex')
    const target = attr(
      html,
      /<meta http-equiv="refresh" content="0;url=([^"]+)"/
    )
    if (target) stubs.set(pageOf(file), decode(target))
    continue
  }

  const head = html.slice(0, html.indexOf('</head>'))
  const title = attr(head, /<title>([^<]*)<\/title>/)
  const description = attr(head, /<meta name="description" content="([^"]*)"/)
  const noindex = /<meta name="robots" content="noindex/.test(head)
  const canonical = attr(head, /<link rel="canonical" href="([^"]*)"/)
  const ogImage = attr(head, /<meta property="og:image" content="([^"]*)"/)
  const mirror = attr(
    head,
    /<link rel="alternate" type="text\/markdown" href="([^"]+)"/
  )
  if (mirror) {
    mirrors.set(pageOf(file), mirror)
    if (!exists(mirror)) fail(file, `markdown mirror missing: ${mirror}`)
  }

  if (!title?.trim()) fail(file, 'no <title>')
  else if (decode(title).length > 70)
    fail(file, `title is ${decode(title).length} characters (max 70)`)
  if (!description) fail(file, 'no meta description')
  else if (!noindex) {
    const n = decode(description).length
    if (n < 50 || n > 240) fail(file, `meta description is ${n} characters`)
  }
  if (!/<html[^>]* lang="[a-z-]+"/.test(html)) fail(file, 'no <html lang>')
  const h1s = (html.match(/<h1[\s>]/g) ?? []).length
  if (h1s !== 1) fail(file, `${h1s} <h1> elements`)
  if (!noindex) {
    if (!canonical?.startsWith(`${SITE}/`)) fail(file, 'no canonical URL')
  }
  if (ogImage) {
    if (!ogImage.startsWith(`${SITE}/`))
      fail(file, `OG image off-site: ${ogImage}`)
    else if (!exists(ogImage.slice(SITE.length)))
      fail(file, `OG image missing: ${ogImage}`)
  } else if (!noindex) fail(file, 'no og:image')

  for (const [, json] of html.matchAll(
    /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g
  )) {
    try {
      const data = JSON.parse(json)
      if (!Array.isArray(data['@graph'])) fail(file, 'JSON-LD without @graph')
    } catch (error) {
      fail(file, `JSON-LD does not parse: ${error.message}`)
    }
  }

  // Languages: <html lang> follows the path (/tr/ is Turkish), and every
  // hreflang alternate exists and points back (Google ignores one-way pairs).
  const lang = attr(html, /<html[^>]* lang="([a-z-]+)"/)
  const expected = /^tr(\/|$)/.test(file) ? 'tr' : 'en'
  if (lang && lang !== expected)
    fail(file, `html lang="${lang}", expected ${expected}`)
  const alternates = [
    ...head.matchAll(
      /<link rel="alternate" hreflang="([^"]+)" href="([^"]+)"/g
    ),
  ].map(([, hreflang, href]) => ({ hreflang, href }))
  if (alternates.length) {
    const self = canonical
    if (!alternates.some((a) => a.href === self && a.hreflang === lang))
      fail(file, 'hreflang set does not include the page itself')
    if (!alternates.some((a) => a.hreflang === 'x-default'))
      fail(file, 'hreflang without x-default')
    for (const { hreflang, href } of alternates) {
      if (hreflang === 'x-default' || href === self) continue
      const target = href.slice(SITE.length)
      if (!href.startsWith(SITE) || !exists(target)) {
        fail(file, `hreflang ${hreflang} target missing: ${href}`)
        continue
      }
      const other = fs.readFileSync(
        path.join(DIST, target, 'index.html'),
        'utf8'
      )
      if (!other.includes(`hreflang="${lang}" href="${self}"`))
        fail(file, `hreflang ${hreflang} -> ${href} does not link back`)
    }
  }

  for (const [, ref] of html.matchAll(/\s(?:href|src)="(\/[^"]*)"/g)) {
    if (ref.startsWith('//') || ref.startsWith('/cdn-cgi/')) continue
    if (!exists(ref)) fail(file, `broken internal link: ${ref}`)
  }
  for (const [, img] of html.matchAll(/<img\b([^>]*)>/g)) {
    if (!/\salt(=|\s|\/|$)/.test(img)) fail(file, 'image without alt')
  }
}

// Sitemap: every URL is a real page (no redirect stubs, no 404), and says
// when it last changed (Bing and the answer engines behind it crawl by it).
for (const file of files.filter((f) => /^sitemap-\d+\.xml$/.test(f))) {
  const xml = fs.readFileSync(path.join(DIST, file), 'utf8')
  for (const [entry] of xml.matchAll(/<url>[\s\S]*?<\/url>/g))
    if (!/<lastmod>\d{4}-\d{2}-\d{2}T[^<]+<\/lastmod>/.test(entry))
      fail(file, `no lastmod: ${/<loc>([^<]+)/.exec(entry)?.[1]}`)
  for (const [, loc] of xml.matchAll(/<loc>([^<]+)<\/loc>/g)) {
    const page = loc.slice(SITE.length)
    if (!loc.startsWith(SITE) || !exists(page)) {
      fail(file, `URL not built: ${loc}`)
      continue
    }
    const html = fs.readFileSync(
      path.join(DIST, page.endsWith('/') ? `${page}index.html` : page),
      'utf8'
    )
    if (/http-equiv="refresh"|name="robots" content="noindex/.test(html))
      fail(file, `URL is a redirect or noindex: ${loc}`)
  }
}

// llms.txt: every link on this site resolves.
for (const file of ['llms.txt']) {
  const text = fs.readFileSync(path.join(DIST, file), 'utf8')
  for (const [url] of text.matchAll(/https:\/\/samye\.li\/[^\s)]*/g)) {
    if (!exists(url.slice(SITE.length))) fail(file, `broken link: ${url}`)
  }
}

// House style: no em dashes in anything a reader or a model sees.
for (const file of files.filter((f) => /\.(html|md|txt|xml)$/.test(f))) {
  if (fs.readFileSync(path.join(DIST, file), 'utf8').includes('—'))
    fail(file, 'contains an em dash')
}

// Math: KaTeX's markup without its stylesheet reads as every formula twice.
for (const file of files.filter((f) => f.endsWith('.html'))) {
  const html = fs.readFileSync(path.join(DIST, file), 'utf8')
  if (html.includes('class="katex"') && !/katex[^"]*\.css/.test(html))
    fail(
      file,
      'math without the KaTeX stylesheet (see src/styles/markdown.css)'
    )
}

// The host's rules: Cloudflare Pages reads dist/_headers and dist/_redirects.
// https://developers.cloudflare.com/pages/configuration/headers/
function readRules(file) {
  if (!fs.existsSync(path.join(DIST, file))) {
    fail(file, 'not built (src/integrations/cloudflare-pages.ts)')
    return ''
  }
  return fs.readFileSync(path.join(DIST, file), 'utf8')
}

/** A rule's pattern as a regular expression, with its placeholders named. */
function matcher(pattern) {
  const names = []
  const source = pattern
    .split(/(:[a-z]+|\*)/)
    .map((part) => {
      if (part === '*') {
        names.push('splat')
        return '(.*)'
      }
      if (/^:[a-z]+$/.test(part)) {
        names.push(part.slice(1))
        return '([^/.]+)'
      }
      return part.replace(/[.+?^${}()|[\]\\]/g, '\\$&')
    })
    .join('')
  const re = new RegExp(`^${source}$`)
  return (url) => {
    const m = re.exec(url)
    return m && Object.fromEntries(names.map((name, i) => [name, m[i + 1]]))
  }
}

const headerRules = []
for (const line of readRules('_headers').split('\n')) {
  if (line.length > 2000) fail('_headers', 'a line over 2,000 characters')
  if (!line.trim() || line.startsWith('#')) continue
  if (!/^\s/.test(line)) {
    headerRules.push({
      pattern: line.trim(),
      match: matcher(line.trim()),
      headers: {},
    })
    continue
  }
  const [, name, value] = /^\s+([^:]+):\s*(.*)$/.exec(line) ?? []
  if (name) headerRules.at(-1).headers[name.toLowerCase()] = value
}
if (headerRules.length > 100)
  fail('_headers', `${headerRules.length} rules (Cloudflare Pages reads 100)`)

/** The headers a path is served with: those of every rule that matches it. */
function headersFor(url) {
  const out = {}
  for (const rule of headerRules) {
    const params = rule.match(url)
    if (!params) continue
    for (const [name, value] of Object.entries(rule.headers)) {
      const filled = value.replace(
        /:([a-z]+)/g,
        (all, key) => params[key] ?? all
      )
      out[name] = out[name] ? `${out[name]}, ${filled}` : filled
    }
  }
  return out
}

const everywhere = headersFor('/')
const csp = everywhere['content-security-policy'] ?? ''
for (const directive of [
  "default-src 'self'",
  "object-src 'none'",
  "frame-ancestors 'self'",
  "base-uri 'self'",
])
  if (!csp.includes(directive)) fail('_headers', `CSP without ${directive}`)
const expected = {
  'x-content-type-options': 'nosniff',
  'referrer-policy': 'strict-origin-when-cross-origin',
  'cross-origin-opener-policy': 'same-origin',
  'x-frame-options': 'SAMEORIGIN',
  'strict-transport-security': 'max-age=31536000; includeSubDomains',
  'vary': 'Accept, Accept-Encoding',
}
for (const [name, value] of Object.entries(expected))
  if (everywhere[name] !== value)
    fail('_headers', `${name} is not ${value} on /`)
if (!everywhere['permissions-policy'])
  fail('_headers', 'no Permissions-Policy on /')
// two rules setting one header join it with a comma: a cache policy twice is wrong
for (const url of [
  '/',
  '/_astro/x.css',
  '/pagefind/index/x.pf_index',
  '/og-images/x.png',
  '/x.md',
]) {
  const cache = headersFor(url)['cache-control']
  if (cache && cache.split('max-age').length > 2)
    fail('_headers', `${url}: Cache-Control set twice (${cache})`)
}
if (!headersFor('/_astro/x.js')['cache-control']?.includes('immutable'))
  fail('_headers', '/_astro/ is not cached as immutable')
if (headersFor('/index.md')['content-type'] !== 'text/markdown; charset=utf-8')
  fail('_headers', 'markdown is not served as text/markdown; charset=utf-8')
if (headersFor('/llms.txt')['content-type'] !== 'text/plain; charset=utf-8')
  fail('_headers', 'text is not served as text/plain; charset=utf-8')
if (!headersFor('/branding/x/')['x-robots-tag']?.includes('noindex'))
  fail('_headers', '/branding/ is not noindex')
if (headersFor('/')['x-robots-tag'])
  fail('_headers', 'the site itself is sent X-Robots-Tag')

// every page's markdown mirror, named in its Link header too, and the mirror
// naming the page as canonical (search engines index the page, not the copy)
for (const [page, mirror] of mirrors) {
  const link = headersFor(page).link
  if (link !== `<${mirror}>; rel="alternate"; type="text/markdown"`)
    fail(
      '_headers',
      `${page}: Link is ${link ?? 'missing'}, expected ${mirror}`
    )
  const canonical = headersFor(mirror).link
  if (canonical !== `<${SITE}${page}>; rel="canonical"`)
    fail(
      '_headers',
      `${mirror}: Link is ${canonical ?? 'missing'}, expected canonical ${SITE}${page}`
    )
}

// every moved post: a 301 to where it lives, under both spellings
const redirects = new Map()
for (const line of readRules('_redirects').split('\n')) {
  if (!line.trim() || line.startsWith('#')) continue
  if (line.length > 1000) fail('_redirects', `over 1,000 characters: ${line}`)
  const [from, to, status] = line.trim().split(/\s+/)
  if (status !== '301')
    fail('_redirects', `${from}: status ${status}, expected 301`)
  redirects.set(from, to)
}
if (redirects.size > 2000)
  fail('_redirects', `${redirects.size} rules (Cloudflare Pages reads 2,000)`)
// (and its markdown copy, which only says the post moved)
for (const [page, target] of stubs) {
  const bare = page.replace(/\/$/, '')
  for (const from of [page, bare, `${bare}.md`]) {
    if (from.endsWith('.md') && !exists(from)) continue
    if (redirects.get(from) !== target)
      fail('_redirects', `${from} does not redirect to ${target}`)
  }
}

// Markdown at a page's own address (Accept: text/markdown, rewritten at
// Cloudflare's edge to /_markdown/<page>/index.md): every page has its twin,
// the same bytes as its mirror (an English post's, for its Turkish-interface
// page), naming the page as canonical; a moved post's twin redirects too.
const twinOf = (page) => `/_markdown${page}index.md`
for (const page of files
  .filter((f) => f.endsWith('.html'))
  .map(pageOf)
  .filter(
    (p) => p.endsWith('/') && !stubs.has(p) && !p.startsWith('/branding/')
  )) {
  const mirror = mirrors.get(page) ?? mirrors.get(page.replace(/^\/tr\//, '/'))
  const twin = twinOf(page)
  if (!mirror) {
    fail(page, 'no markdown to answer Accept: text/markdown with')
    continue
  }
  if (!exists(twin)) {
    fail(twin.slice(1), 'missing')
    continue
  }
  const same = fs
    .readFileSync(path.join(DIST, twin))
    .equals(fs.readFileSync(path.join(DIST, mirror)))
  if (!same) fail(twin.slice(1), `differs from ${mirror}`)
  if (headersFor(twin).link !== `<${SITE}${page}>; rel="canonical"`)
    fail('_headers', `${twin}: Link is ${headersFor(twin).link ?? 'missing'}`)
}
for (const [page, target] of stubs)
  if (redirects.get(twinOf(page)) !== target)
    fail('_redirects', `${twinOf(page)} does not redirect to ${target}`)

if (problems.length) {
  console.error(`verify-build: ${problems.length} problem(s)\n`)
  for (const p of problems) console.error(`  ${p}`)
  process.exit(1)
}
console.log(
  `verify-build: ${files.filter((f) => f.endsWith('.html')).length} pages, sitemap, llms.txt, _headers (${headerRules.length} rules) and _redirects (${redirects.size}) OK`
)
