import { markdownResponse, TEXT_PAGES, textPageDoc } from '~/utils/ai'

import type { APIRoute } from 'astro'
import type { TextPage } from '~/utils/ai'

/** /now.md, /uses.md, /beliefs.md, /colophon.md: the text pages as markdown. */
export const GET: APIRoute = async ({ params }) => {
  const name = params.textPage as TextPage
  return markdownResponse(await textPageDoc(name), `/${name}/`)
}

export function getStaticPaths() {
  return TEXT_PAGES.map((textPage) => ({ params: { textPage } }))
}
