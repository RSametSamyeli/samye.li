import { lodosDoc, markdownResponse } from '~/utils/ai'

export async function GET() {
  return markdownResponse(await lodosDoc(), '/lodos/')
}
