import { LOGOS } from '~/data/logos'
import { getWordmark } from '~/utils/logo-fetch'

import type { APIRoute, GetStaticPaths } from 'astro'
import type { Logo } from '~/data/logos'

/** One wordmark per brand that has a logo, fetched when the site is built. */
export const getStaticPaths = (() =>
  Object.entries(LOGOS)
    .filter(([, logo]) => 'src' in logo)
    .map(([slug, logo]) => ({
      params: { slug },
      props: { logo },
    }))) satisfies GetStaticPaths

export const GET: APIRoute<{ logo: Logo }> = async ({ props }) =>
  new Response(new Uint8Array((await getWordmark(props.logo)).png), {
    headers: { 'Content-Type': 'image/png' },
  })
