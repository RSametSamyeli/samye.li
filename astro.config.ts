import { defineConfig, fontProviders, logHandlers } from 'astro/config'
import sitemap from '@astrojs/sitemap'
import unocss from 'unocss/astro'
import astroExpressiveCode from 'astro-expressive-code'
import mdx from '@astrojs/mdx'
import { unified } from '@astrojs/markdown-remark'

import { remarkPlugins, rehypePlugins } from './plugins'
import { SITE } from './src/config'
import { sitemapIndex } from './src/utils/sitemap'
import { alternatesOf, LOCALES } from './src/i18n'

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
      filter: (page) => !sitemapPosts.skip.has(page),
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
  ],
  markdown: {
    syntaxHighlight: false,
    processor: unified({
      remarkPlugins: remarkPlugins,
      rehypePlugins: rehypePlugins,
    }),
  },
  fonts: [
    {
      provider: fontProviders.fontsource(),
      name: 'Inter',
      cssVariable: '--font-sans',
      weights: ['100 900'],
      styles: ['normal'],
      subsets: ['latin'],
      formats: ['woff2'],
      fallbacks: sansFallbacks,
    },
    {
      provider: fontProviders.fontsource(),
      name: 'DM Mono',
      cssVariable: '--font-mono',
      weights: [400],
      styles: ['normal'],
      subsets: ['latin'],
      formats: ['woff2'],
      fallbacks: monoFallbacks,
    },
    {
      provider: fontProviders.fontsource(),
      name: 'Roboto Condensed',
      cssVariable: '--font-condensed',
      weights: [400],
      styles: ['normal'],
      subsets: ['latin'],
      formats: ['woff2'],
      fallbacks: sansFallbacks,
    },
    {
      provider: fontProviders.google(),
      name: 'Inter',
      cssVariable: '--font-og-sans',
      weights: [400, 700],
      styles: ['normal'],
      subsets: ['latin'],
      formats: ['woff'],
      fallbacks: sansFallbacks,
      options: {
        experimental: {
          variableAxis: {
            opsz: ['24'],
          },
        },
      },
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
