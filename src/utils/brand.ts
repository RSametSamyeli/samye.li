import { html } from 'satori-html'

/**
 * The site's brand in one place. The mark (favicon, app and touch icons) and
 * the share cards are all drawn from these tokens at build time, so changing a
 * colour here changes every icon and every OG image with it.
 *
 * The mark is the wordmark's own idea: a lowercase "s" and the accent dot of
 * "samye.li".
 */
export const BRAND = {
  name: 'samye.li',
  /** background of the mark and the share cards */
  ink: '#0a0a0a',
  /** the letter and the card titles */
  paper: '#ededed',
  /** the dot, and accents on dark backgrounds */
  accent: '#ff2d6a',
  /** secondary text on the cards */
  muted: '#a1a1a1',
} as const

/** The icons generated from the mark (see `src/pages/[brandIcon].ts`). */
export const BRAND_ICONS = {
  'favicon.svg': { size: 512, variant: 'rounded' },
  'favicon.ico': { size: 48, variant: 'rounded' },
  'apple-touch-icon.png': { size: 180, variant: 'square' },
  'icon-192.png': { size: 192, variant: 'rounded' },
  'icon-512.png': { size: 512, variant: 'rounded' },
  'icon-mask.png': { size: 512, variant: 'maskable' },
} as const satisfies Record<string, { size: number; variant: MarkVariant }>

export type BrandIcon = keyof typeof BRAND_ICONS

/**
 * - `rounded`: a rounded tile, for browser tabs and app launchers
 * - `square`: full bleed, for iOS, which rounds the corners itself
 * - `maskable`: full bleed with the letter inside the 80% safe zone, for
 *   Android adaptive icons
 */
export type MarkVariant = 'rounded' | 'square' | 'maskable'

/**
 * Satori markup from an HTML string that is already safe: satori-html escapes
 * every interpolated value, so nested markup is built as one string first.
 */
export const toSatori = (markup: string) =>
  html(Object.assign([markup], { raw: [markup] }))

/** Escapes text for use inside the markup strings. */
export const escapeHtml = (text: string) =>
  text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')

/**
 * The mark as an HTML string for Satori, `size` pixels square. The letter is
 * set in Inter Bold; the dot is a circle rather than a glyph, so it stays round
 * and sits on the baseline at every size.
 */
export function markHtml(size: number, variant: MarkVariant = 'rounded') {
  const scale = variant === 'maskable' ? 0.62 : 0.78
  const fontSize = Math.round(size * scale)
  const dot = Math.round(fontSize * 0.17)
  const radius = variant === 'rounded' ? Math.round(size * 0.22) : 0

  return `<div
    style="display: flex; align-items: center; justify-content: center; width: ${size}px; height: ${size}px; background: ${BRAND.ink}; border-radius: ${radius}px;"
  >
    <div
      style="display: flex; align-items: flex-end; margin-top: -${Math.round(fontSize * 0.23)}px;"
    >
      <div
        style="display: flex; font-family: 'Geist'; font-weight: 700; font-size: ${fontSize}px; line-height: 1; letter-spacing: -0.04em; color: ${BRAND.paper};"
      >
        s
      </div>
      <div
        style="display: flex; width: ${dot}px; height: ${dot}px; margin-left: ${Math.round(dot * 0.25)}px; margin-bottom: ${Math.round(fontSize * 0.205)}px; border-radius: 9999px; background: ${BRAND.accent};"
      ></div>
    </div>
  </div>`
}

/** The mark as Satori markup. */
export const markMarkup = (size: number, variant: MarkVariant = 'rounded') =>
  toSatori(markHtml(size, variant))
