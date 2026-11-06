import { getCollection } from 'astro:content'
import rss from '@astrojs/rss'

import { SITE } from '~/config'

/** RSS 2.0 wants an email in <author>: "address (Name)". */
const AUTHOR = `sam@samye.li (${SITE.author})`

export async function GET(context) {
  const posts = (await getCollection('blog'))
    .filter((post) => !post.data.draft)
    .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf())

  const feedUrl = new URL('/rss.xml', context.site).href
  const iconUrl = new URL('/icon-512.png', context.site).href

  return rss({
    title: `${SITE.title} · Blog`,
    description: SITE.description,
    site: context.site,
    xmlns: { atom: 'http://www.w3.org/2005/Atom' },
    customData: [
      `<language>${SITE.lang}</language>`,
      `<atom:link href="${feedUrl}" rel="self" type="application/rss+xml"/>`,
      `<lastBuildDate>${new Date().toUTCString()}</lastBuildDate>`,
      `<image><title>${SITE.title}</title><url>${iconUrl}</url><link>${context.site}</link></image>`,
    ].join(''),
    items: posts.map((post) => ({
      title: post.data.title,
      // A post published elsewhere links to the original.
      link: post.data.redirect || `/blog/${post.id}/`,
      pubDate: post.data.pubDate,
      description: post.data.description,
      author: AUTHOR,
      categories: post.data.tags,
    })),
    stylesheet: '/rss-styles.xsl',
  })
}
