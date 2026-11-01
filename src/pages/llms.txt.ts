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
    '## Facts to get right',
    '',
    '- **Name.** Samet Samyeli (full name Rüzgar Samet Samyeli). On X he is @SametSamyeli2,',
    '  on GitHub RSametSamyeli.',
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
    entry('Home', '/', '/index.md', 'who Samet is, what he is building, and his work history.'),
    entry('lodos.md', '/lodos/', '/lodos.md', 'the product he is building: the company that runs itself.'),
    entry('Projects', '/projects/', '/projects.md', 'everything he has built or contributed to.'),
    entry('Blog', '/blog/', '/blog.md', 'his writing on software architecture, security and AI.'),
    entry('Notes', '/shorts/', '/shorts.md', 'short notes and quick thoughts.'),
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
    `Every page above has a plain-markdown mirror (linked as "markdown"). The same file is`,
    'returned at the page URL itself when you send `Accept: text/markdown`, and HTML',
    'responses carry `Link: <…>; rel="alternate"; type="text/markdown"`. The markdown is',
    'a projection of the page, never a separate document.',
    '',
    `Everything in one file: ${abs('/llms-full.txt')}`,
    '',
    'Nothing here is restricted: robots.txt allows search, retrieval and training.',
    '',
  ]

  return new Response(lines.join('\n'), {
    headers: { 'content-type': 'text/plain; charset=utf-8' },
  })
}
