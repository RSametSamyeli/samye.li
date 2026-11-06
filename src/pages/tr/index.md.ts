import { homeDoc, markdownResponse } from '~/utils/ai'

export async function GET() {
  return markdownResponse(await homeDoc('tr'), '/tr/')
}
