import { listDoc, markdownResponse } from '~/utils/ai'

export async function GET() {
  return markdownResponse(await listDoc('blog', 'tr'), '/tr/blog/')
}
