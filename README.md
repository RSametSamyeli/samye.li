<div align="center">

# samye.li

**The personal site and blog of Samet Samyeli.**

[![CI](https://github.com/RSametSamyeli/samye.li/actions/workflows/ci.yml/badge.svg)](https://github.com/RSametSamyeli/samye.li/actions/workflows/ci.yml)

[samye.li](https://samye.li) · [lodos.md](https://lodos.md) · [X](https://x.com/SametSamyeli2) · [LinkedIn](https://www.linkedin.com/in/sametsamyeli/) · [Medium](https://medium.com/@sametsamyeli) · [sam@samye.li](mailto:sam@samye.li)

</div>

---

## About me

I'm Samet, a senior full-stack engineer and tech founder based in Istanbul. For 12+ years I've been designing and running production systems: async Python and TypeScript backends, PostgreSQL schemas, real-time event flows, and the Next.js/React products on top of them.

- **Building [lodos.md](https://lodos.md):** the company that runs itself. An AI team that learns your company and works across every department, while you make the decisions and nobody else can see your data.
- **Founded [gazla.co](https://gazla.co):** a startup community of 50,000+ people and 280+ startups, bootstrapped with zero funding.
- **Previously:** a clinical-grade, HIPAA-compliant MRI visualization platform at ACANIO (with a contribution to [OHIF](https://ohif.org/)), and e-commerce for Vakko, Koton, LC Waikiki and US Polo at Akinon.
- **Beyond code:** co-founded the Open Software Network (AYA) after the 2023 Türkiye earthquakes, building [AfetHarita](https://afetharita.com) and [deprem.io](https://deprem.io) with 25,000+ volunteer developers. Mediterranean ILCA sailing champion.

## About this repo

This is the source of [samye.li](https://samye.li): my home on the web, where I keep my blog, notes, projects and a page about what I'm building. It's a static [Astro](https://astro.build) site, built in a Docker image and served by nginx.

| | |
|---|---|
| **Framework** | Astro 7, Markdown/MDX content collections |
| **Styling** | UnoCSS (Tailwind-compatible utilities), Inter + DM Mono |
| **Search** | Pagefind, fully static |
| **Theme** | Based on [AntfuStyle](https://github.com/lin-stephanie/astro-antfustyle-theme) by Stephanie Lin |
| **Hosting** | Docker → nginx on Coolify, behind Cloudflare |
| **Deploys** | Every push to `main` deploys automatically via a GitHub webhook |
| **Checks** | [CI](.github/workflows/ci.yml) runs formatting, lint, `astro check`, the build and [`verify-build`](scripts/verify-build.mjs) (titles, descriptions, canonicals, OG images, JSON-LD, internal links, sitemap, house style) on every push and PR |

## Brand

The mark (a lowercase **s** and the accent dot of samye**.**li), the favicon, the app and touch icons and every share card are drawn from one file, [`src/utils/brand.ts`](src/utils/brand.ts), at build time with [Satori](https://github.com/vercel/satori). Change a colour there and every icon and OG image follows. Each post and page gets its own card: what it is, when it was published, its title and its description.

## Security and caching

Security issues can be reported as [`/.well-known/security.txt`](https://samye.li/.well-known/security.txt) describes (RFC 9116). nginx sends a Content Security Policy, `nosniff`, a strict referrer policy, a locked-down permissions policy and frame protection on every response ([`nginx/security-headers.conf`](nginx/security-headers.conf)); HSTS is set at Cloudflare. Hashed assets are cached for a year, pages and the markdown mirrors are revalidated on every request, and client work under `/branding/` is kept out of search engines with `X-Robots-Tag`.

## Two languages

The home page, the lodos.md page and the projects are published in English at the root and in Turkish under [`/tr/`](https://samye.li/tr/), with the same paths. [`src/i18n.ts`](src/i18n.ts) holds the interface text and which pages are translated; Turkish page text lives in `src/content/home/tr/` and `src/pages/tr/`. Each translated page names the other with `hreflang` (and `x-default` English), in its `<head>` and in the sitemap; its share card, JSON-LD, breadcrumbs and markdown mirror are in its own language. The blog and the notes are written in English. There is no automatic redirect by browser language (search engines crawl from one place); a TR/EN switch in the navigation leads to the same page in the other language.

## Built to be read by machines too

The site is meant to be found, read and cited by people and by AI assistants alike. Every machine-readable file is generated from the same content the pages render from, so nothing drifts out of date.

- **[`/llms.txt`](https://samye.li/llms.txt):** a one-file summary of the site and its author, following [llmstxt.org](https://llmstxt.org).
- **[`/llms-full.txt`](https://samye.li/llms-full.txt):** every page as plain markdown, in one file.
- **Markdown mirrors:** every page has a clean markdown copy, e.g. [`/index.md`](https://samye.li/index.md), [`/lodos.md`](https://samye.li/lodos.md), [`/projects.md`](https://samye.li/projects.md).
- **Content negotiation:** request any page with `Accept: text/markdown` and you get the markdown at the same URL. HTML responses advertise it with `Link: <...>; rel="alternate"; type="text/markdown"`.
- **Open `robots.txt`:** search, retrieval and training are all welcome.
- **Structured data:** one linked JSON-LD graph per page: `Person` and `WebSite` everywhere, `ProfilePage` on the home page, `BlogPosting` with a visible author byline on posts, and `BreadcrumbList`.
- **Search hygiene:** a sitemap of real pages only, with each post's last change; posts published on Medium redirect there and name it canonical; the 404 page is `noindex`.
- **IndexNow:** after every deploy a [workflow](.github/workflows/indexnow.yml) tells Bing (and through it ChatGPT search and Copilot), Yandex and others which pages exist, so changes are picked up in minutes.

```sh
curl -H "Accept: text/markdown" https://samye.li/lodos/
```

## Activity data

The home page shows my X followers and a GitHub contribution graph, read at build time from [`src/data/stats.json`](src/data/stats.json). A [daily GitHub Action](.github/workflows/stats.yml) refreshes the GitHub contributions and commits the file only when something changed, which triggers a deploy. X has no free API for follower counts, so that number is updated by hand.

## Project structure

```text
src/
├── content/
│   ├── blog/            # blog posts (Markdown; can redirect to Medium)
│   ├── shorts/          # short notes
│   ├── home/            # home page and lodos.md page text
│   └── projects/        # projects (data.json)
├── data/stats.json      # X followers + GitHub contributions
├── pages/               # routes, plus the .md mirrors, llms.txt and robots.txt
├── utils/
│   ├── ai.ts            # builds every machine-readable projection
│   ├── brand.ts         # the mark and colours: icons and OG images
│   └── og-image/        # the share cards (Satori → PNG)
└── config.ts            # site info, navigation, social links
public/icons/            # project logos (lodos.md, gazla.co)
scripts/fetch-stats.mjs  # refreshes stats.json
nginx/                   # static serving, markdown negotiation, security headers
Dockerfile               # build with pnpm, serve with nginx (with a healthcheck)
```

## Writing

| To add | Create |
|---|---|
| A blog post | `src/content/blog/<slug>.md` |
| A Medium post | the same, with `redirect:` and `platform: Medium` in the frontmatter |
| A short note | `src/content/shorts/<slug>.md` |
| A project | an entry in `src/content/projects/data.json` |

Push to `main` and the site, its markdown mirrors and `llms.txt` update on their own.

## Running locally

Requires Node 22.12+ and pnpm.

```sh
pnpm install
pnpm dev        # http://localhost:4321
pnpm build      # static output in dist/
```

## Credits and license

The theme is based on [Astro AntfuStyle Theme](https://github.com/lin-stephanie/astro-antfustyle-theme) by Stephanie Lin, itself inspired by [antfu.me](https://antfu.me), and is used under the [MIT License](LICENSE). The code in this repo is MIT licensed. The writing and personal content are © Samet Samyeli.
