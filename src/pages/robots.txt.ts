// robots.txt, owned by the repo. The policy: everything is open. Search crawlers,
// assistants fetching a page for a reader, and model training are all welcome; a
// personal site is worth more found and cited than reserved.
//
// One `User-agent: *` group on purpose: a crawler obeys only its most specific
// matching group, so naming individual bots would add nothing and could make them
// skip the rules below.
import { abs } from '~/utils/ai'

export function GET() {
  const body = [
    '# samye.li is meant to be found, read and cited, by people and by machines.',
    '# Search, retrieval for an answer, and model training are all welcome.',
    '#',
    '# If you are a machine: /llms.txt describes this site in one file, and',
    '# /llms-full.txt has every page as markdown. Each page also answers',
    '# `Accept: text/markdown` at its own URL.',
    '',
    'User-agent: *',
    'Content-Signal: search=yes,ai-input=yes,ai-train=yes,use=full',
    'Allow: /',
    '',
    `Sitemap: ${abs('/sitemap-index.xml')}`,
    '',
  ].join('\n')
  return new Response(body, {
    headers: { 'content-type': 'text/plain; charset=utf-8' },
  })
}
