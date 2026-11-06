import { BRAND_ICONS } from '~/utils/brand'
import { generateBrandIcon } from '~/utils/og-image/generator'

import type { APIRoute } from 'astro'
import type { BrandIcon } from '~/utils/brand'

/**
 * The favicon, the touch icon and the app icons, drawn from the brand mark at
 * build time (`src/utils/brand.ts`): /favicon.svg, /favicon.ico,
 * /apple-touch-icon.png, /icon-192.png, /icon-512.png and /icon-mask.png.
 */
export const GET: APIRoute = async ({ params, url }) => {
  const { body, contentType } = await generateBrandIcon(
    params.brandIcon as BrandIcon,
    url
  )
  return new Response(typeof body === 'string' ? body : new Uint8Array(body), {
    headers: { 'Content-Type': contentType },
  })
}

export function getStaticPaths() {
  return Object.keys(BRAND_ICONS).map((brandIcon) => ({
    params: { brandIcon },
  }))
}
