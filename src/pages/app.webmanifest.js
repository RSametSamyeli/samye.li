import { SITE } from '~/config'
import { BRAND } from '~/utils/brand'
import { withBasePath } from '~/utils/path'

export async function GET() {
  // https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Manifest
  const manifest = {
    id: withBasePath('/'),
    name: SITE.title,
    short_name: 'samye.li',
    description: SITE.description,
    lang: SITE.lang,
    icons: [
      {
        src: withBasePath('/icon-192.png'),
        type: 'image/png',
        sizes: '192x192',
      },
      {
        src: withBasePath('/icon-512.png'),
        type: 'image/png',
        sizes: '512x512',
      },
      {
        src: withBasePath('/icon-mask.png'),
        type: 'image/png',
        sizes: '512x512',
        purpose: 'maskable',
      },
    ],
    scope: withBasePath('/'),
    start_url: withBasePath('/'),
    display: 'standalone',
    theme_color: BRAND.ink,
    background_color: BRAND.ink,
  }

  return new Response(JSON.stringify(manifest), {
    headers: {
      'Content-Type': 'application/manifest+json; charset=utf-8',
    },
  })
}
