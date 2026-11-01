import type { APIRoute, GetStaticPaths } from 'astro'

import { markdownResponse, postDoc, postsOf } from '~/utils/ai'

export const getStaticPaths = (async () => {
  const posts = await postsOf('blog')
  return posts.map((post) => ({ params: { slug: post.id }, props: { post } }))
}) satisfies GetStaticPaths

export const GET: APIRoute = async ({ props }) => {
  const { post } = props as { post: Awaited<ReturnType<typeof postsOf>>[number] }
  return markdownResponse(await postDoc('blog', post), `/blog/${post.id}/`)
}
