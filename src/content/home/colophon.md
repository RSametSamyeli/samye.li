A personal site should be fast, readable, and honest about how it is made. This page is the honest part.

samye.li is a static site, built from Markdown and a few TypeScript files: no database, no tracking, nothing that runs on a server when you read it. The source is [on GitHub](https://github.com/RSametSamyeli/samye.li).

## Stack

- **[Astro](https://astro.build)** with Markdown and MDX content collections, **UnoCSS**, and Vercel's **Geist** and **Geist Mono** typefaces.
- Started from the [AntfuStyle](https://github.com/lin-stephanie/astro-antfustyle-theme) theme by Stephanie Lin, then trimmed and rebuilt.
- Static files on **Cloudflare Pages**, served from Cloudflare's network. A push to `main` goes live only after CI passes: formatting, lint, types, the build, and a check of every page's links, metadata and response headers.

## Design

- Dark by default, with a light theme a click away.
- The mark, an "s" with the accent dot of samye**.**li, is drawn in code. The favicon, the app icons and every share card are generated from it at build time with Satori.
- Secondary text uses a colour measured for contrast in both themes (WCAG AA), checked with axe on every page type.

## For machines

- Every page has a plain Markdown copy, returned at the page's own URL to clients that ask for `text/markdown`, and named in its `<head>` and a `Link` header. [llms.txt](/llms.txt) and [llms-full.txt](/llms-full.txt) describe the whole site.
- Linked JSON-LD (Person, ProfilePage, BlogPosting, breadcrumbs), English and Turkish pages paired with hreflang, a sitemap with last-change dates, and IndexNow pings after each deploy.
- robots.txt welcomes search engines, answer engines and training.

## Checks

- CI runs formatting, lint, type checks and the build, then a script that reads the built site: titles, descriptions, canonical URLs, share images, structured data, internal links, hreflang pairs, the sitemap and the house style.
- A Content Security Policy and other security headers on every response, and a [security.txt](/.well-known/security.txt) for reporting issues.

## Privacy

- No cookies and no third-party trackers. A video loads from YouTube's privacy-enhanced domain only when you press play.
