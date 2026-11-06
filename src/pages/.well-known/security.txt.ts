import { SITE } from '~/config'

/**
 * RFC 9116: how to report a security issue. Rebuilt on every deploy, so the
 * required Expires date always lies a year ahead.
 */
export function GET() {
  const expires = new Date()
  expires.setUTCFullYear(expires.getUTCFullYear() + 1)

  const lines = [
    'Contact: mailto:sam@samye.li',
    `Expires: ${expires.toISOString().replace(/\.\d{3}Z$/, 'Z')}`,
    'Preferred-Languages: en, tr',
    `Canonical: ${new URL('/.well-known/security.txt', SITE.website).href}`,
    '',
  ]

  return new Response(lines.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
}
