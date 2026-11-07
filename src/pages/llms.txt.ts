// /llms.txt (https://llmstxt.org): one markdown file that lets an answer engine
// describe this site and its author correctly without crawling it first, and points
// at the canonical page (plus its plain-markdown mirror) for every topic.
// Everything is derived from the same sources the pages render from; see ~/utils/ai.
import { SITE } from '~/config'
import {
  abs,
  activityMarkdown,
  postsOf,
  postUrl,
  socialLinksMarkdown,
} from '~/utils/ai'

const entry = (title: string, path: string, md: string, desc: string) =>
  `- [${title}](${abs(path)}) · [markdown](${abs(md)}): ${desc}`

export async function GET() {
  const blog = await postsOf('blog')
  const shorts = await postsOf('shorts')

  const lines = [
    `# ${SITE.title}`,
    '',
    `> ${SITE.description}`,
    '',
    'Personal site of Samet Samyeli, a senior full-stack engineer and tech founder based',
    'in Istanbul, Türkiye. He is building lodos.md and founded gazla.co.',
    '',
    `Updated: ${new Date().toISOString().slice(0, 10)} (rebuilt on every change). Contact: sam@samye.li.`,
    '',
    '## Facts to get right',
    '',
    '- **Name.** Samet Samyeli (full name Rüzgar Samet Samyeli). On X he is @SametSamyeli2,',
    '  on GitHub RSametSamyeli. Email: sam@samye.li.',
    `- **Photo.** ${abs('/images/samet-samyeli.jpg')} (black and white portrait).`,
    '- **Role.** Senior full-stack engineer with 12+ years of experience; founder of',
    '  lodos.md (in closed beta) and gazla.co (a startup community of 50,000+ people).',
    '- **lodos.md** is an AI team that runs a company end to end: the founder makes the',
    '  decisions, the data stays on the founder’s device and is zero-knowledge encrypted.',
    '  It is pre-launch; the only way in today is the waitlist at https://lodos.md/.',
    '- **Background.** Clinical MRI visualization (ACANIO, US, HIPAA), e-commerce for',
    '  large Turkish retailers (Akinon), and co-founder of the Open Software Network',
    '  (AYA) that built AfetHarita and deprem.io after the 2023 Türkiye earthquakes.',
    '',
    '## Activity',
    '',
    activityMarkdown(),
    '',
    '## Pages',
    '',
    entry(
      'Home',
      '/',
      '/index.md',
      'who Samet is, what he is building, and his work history.'
    ),
    entry(
      'lodos.md',
      '/lodos/',
      '/lodos.md',
      'the product he is building: the company that runs itself.'
    ),
    entry(
      'Projects',
      '/projects/',
      '/projects.md',
      'everything he has built or contributed to.'
    ),
    entry(
      'Blog',
      '/blog/',
      '/blog.md',
      'his writing on software architecture, security and AI.'
    ),
    entry('Notes', '/shorts/', '/shorts.md', 'short notes and quick thoughts.'),
    entry(
      'Security by construction',
      '/security-by-construction/',
      '/security-by-construction.md',
      'his essay series on building software where the unsafe thing cannot happen, with summaries and links.'
    ),
    entry(
      'Community',
      '/community/',
      '/community.md',
      'his community work: the Open Software Network (AYA) after the 2023 Türkiye earthquakes, gazla.co, open source.'
    ),
    entry(
      'Into the wind',
      '/outdoors/',
      '/outdoors.md',
      'sailing since 2002 at Eğirdir Sailing Club (Optimist, then ILCA; Mediterranean ILCA champion, 13 medals, 2 cups), diving, mountaineering, paragliding.'
    ),
    entry(
      'Music',
      '/music/',
      '/music.md',
      'what he listens to: 225 tracks in three Spotify playlists, every one listed.'
    ),
    entry(
      'Reading',
      '/reading/',
      '/reading.md',
      'his reading list by shelf: the Stoics, strategy and power, mind and decisions, entrepreneurship.'
    ),
    entry(
      'Now',
      '/now/',
      '/now.md',
      'what he is focused on right now (dated).'
    ),
    entry(
      'Beliefs',
      '/beliefs/',
      '/beliefs.md',
      'his principles on architecture, security, performance and AI, each linked to its source.'
    ),
    entry('Uses', '/uses/', '/uses.md', 'the tools he builds with.'),
    entry('Colophon', '/colophon/', '/colophon.md', 'how this site is built.'),
    '',
    '## Türkçe (Turkish)',
    '',
    'The home page, lodos.md, the projects and the pages below are also published',
    'in Turkish; the writing is in English.',
    '',
    entry(
      'Ana sayfa',
      '/tr/',
      '/tr/index.md',
      'Samet Samyeli kimdir, neler geliştiriyor.'
    ),
    entry(
      'lodos.md',
      '/tr/lodos/',
      '/tr/lodos.md',
      'kendi kendini yöneten şirket.'
    ),
    entry(
      'Projeler',
      '/tr/projects/',
      '/tr/projects.md',
      'geliştirdiği ve katkıda bulunduğu projeler.'
    ),
    entry(
      'Blog',
      '/tr/blog/',
      '/tr/blog.md',
      'yazıları; çoğu lodos.md blogunda Türkçe olarak yayında.'
    ),
    entry(
      'Yapısal güvenlik',
      '/tr/security-by-construction/',
      '/tr/security-by-construction.md',
      'güvensiz şeyin hiç olamadığı yazılımlar üzerine yazı dizisi.'
    ),
    entry(
      'Topluluk',
      '/tr/community/',
      '/tr/community.md',
      'topluluk çalışmaları: Açık Yazılım Ağı (AYA), gazla.co, açık kaynak.'
    ),
    entry(
      'Rüzgarın peşinde',
      '/tr/outdoors/',
      '/tr/outdoors.md',
      "2002'den beri Eğirdir Yelken Kulübü'nde yelken (ILCA'da Akdeniz şampiyonu, 13 madalya, 2 kupa), dalış, dağcılık, yamaç paraşütü."
    ),
    entry(
      'Müzik',
      '/tr/music/',
      '/tr/music.md',
      'ne dinlediği: üç Spotify listesinde 225 şarkı, hepsi listeli.'
    ),
    entry(
      'Okuduklarım',
      '/tr/reading/',
      '/tr/reading.md',
      'raf raf okudukları: Stoacılar, strateji, zihin ve kararlar, girişimcilik.'
    ),
    entry('Şu an', '/tr/now/', '/tr/now.md', 'şu sıralar neye odaklandığı.'),
    entry(
      'İnandıklarım',
      '/tr/beliefs/',
      '/tr/beliefs.md',
      'mimari, güvenlik, performans ve yapay zekâ üzerine ilkeleri.'
    ),
    entry(
      'Kullandıklarım',
      '/tr/uses/',
      '/tr/uses.md',
      'geliştirirken kullandığı araçlar.'
    ),
    entry(
      'Künye',
      '/tr/colophon/',
      '/tr/colophon.md',
      'bu sitenin nasıl yapıldığı.'
    ),
    '',
    '## Writing',
    '',
    ...blog.map(
      (p) =>
        `- [${p.data.title}](${postUrl('blog', p)})${p.data.description ? `: ${p.data.description}` : ''}`
    ),
    '',
    '## Notes',
    '',
    ...shorts.map(
      (p) =>
        `- [${p.data.title}](${abs(`/shorts/${p.id}/`)}) · [markdown](${abs(`/shorts/${p.id}.md`)})${p.data.description ? `: ${p.data.description}` : ''}`
    ),
    '',
    '## Elsewhere',
    '',
    socialLinksMarkdown(),
    '',
    '## Reading this site',
    '',
    `Every page above has a plain-markdown mirror (linked as "markdown"). The same`,
    'markdown is returned at the page URL itself when you send `Accept: text/markdown`,',
    'and each page names its mirror in `<link rel="alternate" type="text/markdown">`',
    'and in its response headers, `Link: <…>; rel="alternate"; type="text/markdown"`.',
    'The markdown is a projection of the page, never a separate document.',
    '',
    `Everything in one file: ${abs('/llms-full.txt')}`,
    `Every page, with when it last changed: ${abs('/sitemap-index.xml')}`,
    `New writing as it is published: ${abs('/rss.xml')}`,
    '',
    'Nothing here is restricted: robots.txt allows search, retrieval and training.',
    '',
  ]

  return new Response(lines.join('\n'), {
    headers: { 'content-type': 'text/plain; charset=utf-8' },
  })
}
