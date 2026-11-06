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

for (const file of files.filter((f) => f.endsWith('.html'))) {
  const html = fs.readFileSync(path.join(DIST, file), 'utf8')

  // A redirect stub (posts published elsewhere): only its own rules apply.
  if (/<meta http-equiv="refresh"/.test(html)) {
    if (!/<meta name="robots" content="noindex"/.test(html))
      fail(file, 'redirect without noindex')
    continue
  }

  const head = html.slice(0, html.indexOf('</head>'))
  const title = attr(head, /<title>([^<]*)<\/title>/)
  const description = attr(head, /<meta name="description" content="([^"]*)"/)
  const noindex = /<meta name="robots" content="noindex/.test(head)
  const canonical = attr(head, /<link rel="canonical" href="([^"]*)"/)
  const ogImage = attr(head, /<meta property="og:image" content="([^"]*)"/)

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

// Sitemap: every URL is a real page (no redirect stubs, no 404).
for (const file of files.filter((f) => /^sitemap-\d+\.xml$/.test(f))) {
  const xml = fs.readFileSync(path.join(DIST, file), 'utf8')
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

if (problems.length) {
  console.error(`verify-build: ${problems.length} problem(s)\n`)
  for (const p of problems) console.error(`  ${p}`)
  process.exit(1)
}
console.log(
  `verify-build: ${files.filter((f) => f.endsWith('.html')).length} pages, sitemap and llms.txt OK`
)
