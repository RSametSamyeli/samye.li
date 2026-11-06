// /llms-full.txt: every page of the site as plain markdown, in one file, for a
// reader that would rather fetch once than follow links. Built from the same
// projections as the per-page mirrors in ~/utils/ai.
import {
  homeDoc,
  listDoc,
  lodosDoc,
  postDoc,
  postsOf,
  projectsDoc,
} from '~/utils/ai'

export async function GET() {
  const shorts = await postsOf('shorts')
  const docs = [
    await homeDoc(),
    await lodosDoc(),
    await projectsDoc(),
    await listDoc('blog'),
    await listDoc('shorts'),
    ...(await Promise.all(shorts.map((p) => postDoc('shorts', p)))),
    // The same pages in Turkish, for answers in Turkish
    await homeDoc('tr'),
    await lodosDoc('tr'),
    await projectsDoc('tr'),
  ]
  return new Response(docs.join('\n---\n\n'), {
    headers: { 'content-type': 'text/plain; charset=utf-8' },
  })
}
