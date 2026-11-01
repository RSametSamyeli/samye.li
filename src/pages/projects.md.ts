import { projectsDoc, markdownResponse } from '~/utils/ai'

export async function GET() {
  return markdownResponse(await projectsDoc(), '/projects/')
}
