import { projectsDoc, markdownResponse } from '~/utils/ai'

export async function GET() {
  return markdownResponse(await projectsDoc('tr'), '/tr/projects/')
}
