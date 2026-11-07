import { defineConfig, fontProviders, logHandlers } from 'astro/config'
import sitemap from '@astrojs/sitemap'
import unocss from 'unocss/astro'
import astroExpressiveCode from 'astro-expressive-code'
import mdx from '@astrojs/mdx'
import { unified } from '@astrojs/markdown-remark'

import { remarkPlugins, rehypePlugins } from './plugins'
import cloudflarePages from './src/integrations/cloudflare-pages'
import { SITE } from './src/config'
import { sitemapIndex } from './src/utils/sitemap'
import { alternatesOf, isMirror, LOCALES } from './src/i18n'

const sansFallbacks = [
  'ui-sans-serif',
  'system-ui',
  '"Apple Color Emoji"',
  '"Segoe UI Emoji"',
  '"Segoe UI Symbol"',
  '"Noto Color Emoji"',
  'sans-serif',
]

const monoFallbacks = [
  'ui-monospace',
  'SFMono-Regular',
  'Menlo',
  'Monaco',
  'Consolas',
  '"Liberation Mono"',
  '"Courier New"',
  'monospace',
]

const sitemapPosts = sitemapIndex(SITE.website)

// https://docs.astro.build/en/reference/configuration-reference/
export default defineConfig({
  site: SITE.website,
  base: SITE.base,
  build: {
    inlineStylesheets: 'never',
  },
  integrations: [
    sitemap({
      // posts published elsewhere, and the Turkish-interface mirrors of
      // English pages (noindex: the English page is the one to find)
      filter: (page) =>
        !sitemapPosts.skip.has(page) && !isMirror(new URL(page).pathname),
      serialize: (item) => {
        const lastmod = sitemapPosts.lastmod.get(item.url)
        // a page that exists in both languages lists both, and English as the
        // default for everyone else (hreflang in the sitemap)
        const alternates = alternatesOf(new URL(item.url).pathname)
        const links = alternates && [
          ...alternates.map((a) => ({
            lang: LOCALES[a.locale].lang,
            url: new URL(a.path, SITE.website).href,
          })),
          {
            lang: 'x-default',
            url: new URL(alternates[0].path, SITE.website).href,
          },
        ]
        return { ...item, ...(lastmod && { lastmod }), ...(links && { links }) }
      },
    }),
    unocss({ injectReset: true }),
    astroExpressiveCode(),
    mdx(),
    // last: reads the finished pages to write dist/_headers and dist/_redirects
    cloudflarePages(),
  ],
  markdown: {
    syntaxHighlight: false,
    processor: unified({
      remarkPlugins: remarkPlugins,
      rehypePlugins: rehypePlugins,
    }),
  },
  fonts: [
    // Geist and Geist Mono, Vercel's typefaces (SIL OFL). latin-ext carries
    // Turkish: ğ, ş, ı, İ are not in the latin subset.
    {
      provider: fontProviders.fontsource(),
      name: 'Geist',
      cssVariable: '--font-sans',
      weights: ['100 900'],
      styles: ['normal'],
      subsets: ['latin', 'latin-ext'],
      formats: ['woff2'],
      fallbacks: sansFallbacks,
    },
    {
      provider: fontProviders.fontsource(),
      name: 'Geist Mono',
      cssVariable: '--font-mono',
      weights: ['100 900'],
      styles: ['normal'],
      subsets: ['latin', 'latin-ext'],
      formats: ['woff2'],
      fallbacks: monoFallbacks,
    },
    // the share cards: Satori reads WOFF, not WOFF2
    {
      provider: fontProviders.google(),
      name: 'Geist',
      cssVariable: '--font-og-sans',
      weights: [400, 700],
      styles: ['normal'],
      subsets: ['latin', 'latin-ext'],
      formats: ['woff'],
      fallbacks: sansFallbacks,
    },
  ],
  image: {
    // https://docs.astro.build/en/guides/images/#responsive-image-behavior
    // Used for all local (except `/public`) and authorized remote images using `![]()` syntax; not configurable per-image
    // Used for all `<Image />` and `<Picture />` components unless overridden with `layout` prop
    layout: 'constrained',
    responsiveStyles: true,
    domains: SITE.imageDomains,
  },
  vite: {
    logLevel: 'warn',
    build: { chunkSizeWarningLimit: 1200 },
  },
  logger: logHandlers.node({ level: 'info' }),
  experimental: {
    contentIntellisense: true,
    chromeDevtoolsWorkspace: true,
  },
})
