samye.li is a static site, built from Markdown and a few TypeScript files. The source is [on GitHub](https://github.com/RSametSamyeli/samye.li).

## Stack

- **[Astro](https://astro.build)** with Markdown and MDX content collections, **UnoCSS**, and the **Inter** and **DM Mono** typefaces.
- Started from the [AntfuStyle](https://github.com/lin-stephanie/astro-antfustyle-theme) theme by Stephanie Lin, then trimmed and rebuilt.
- Built in Docker and served by nginx on **Coolify** (Hetzner), behind **Cloudflare**. Every push to `main` deploys.

## Design

- Dark by default, with a light theme a click away.
- The mark, an "s" with the accent dot of samye**.**li, is drawn in code. The favicon, the app icons and every share card are generated from it at build time with Satori.
- Secondary text uses a colour measured for contrast in both themes (WCAG AA), checked with axe on every page type.

## For machines

- Every page has a plain Markdown copy, also returned at the page's own URL to clients that ask for `text/markdown`. [llms.txt](/llms.txt) and [llms-full.txt](/llms-full.txt) describe the whole site.
- Linked JSON-LD (Person, ProfilePage, BlogPosting, breadcrumbs), English and Turkish pages paired with hreflang, a sitemap with last-change dates, and IndexNow pings after each deploy.
- robots.txt welcomes search engines, answer engines and training.

## Checks

- CI runs formatting, lint, type checks and the build, then a script that reads the built site: titles, descriptions, canonical URLs, share images, structured data, internal links, hreflang pairs, the sitemap and the house style.
- A Content Security Policy and other security headers on every response, and a [security.txt](/.well-known/security.txt) for reporting issues.

## Privacy

- No cookies and no third-party trackers.
