import { markdownResponse, TEXT_PAGES, textPageDoc } from '~/utils/ai'

import type { APIRoute } from 'astro'
import type { TextPage } from '~/utils/ai'

/** /tr/now.md, /tr/uses.md, /tr/beliefs.md, /tr/colophon.md */
export const GET: APIRoute = async ({ params }) => {
  const name = params.textPage as TextPage
  return markdownResponse(await textPageDoc(name, 'tr'), `/tr/${name}/`)
}

export function getStaticPaths() {
  return TEXT_PAGES.map((textPage) => ({ params: { textPage } }))
}
