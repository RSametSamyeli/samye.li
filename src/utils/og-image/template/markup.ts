import { BRAND, escapeHtml, markHtml, toSatori } from '~/utils/brand'

import type { OgImageManifestItem } from '~/utils/og-image/manifest'

/** Characters of the title above which the type steps down a size. */
const LONG_TITLE = 48

/**
 * The share card, 1200 × 630: the mark and the site's name at the top, then
 * the kicker (what the page is, and when), the title, and a line of
 * description. Dark, like the site, with a glow of the accent in one corner.
 */
export function ogImageMarkup({
  kicker,
  title,
  description,
  portrait,
  lang = 'en',
}: Pick<OgImageManifestItem, 'kicker' | 'title' | 'description'> & {
  /** the page's language: the kicker is upper-cased by its rules */
  lang?: string
  /** the author's portrait as a data URL, shown at the right */
  portrait?: string
}) {
  const titleSize = title.length > LONG_TITLE ? 64 : 76

  const kickerHtml = kicker
    ? `<div style="display: flex; margin-bottom: 24px; font-size: ${portrait ? 21 : 26}px; font-weight: 700; letter-spacing: 0.08em; color: ${BRAND.accent};">${escapeHtml(kicker.toLocaleUpperCase(lang))}</div>`
    : ''
  const descriptionHtml = description
    ? `<div style="display: block; margin-top: 28px; font-size: 30px; line-height: 1.4; color: ${BRAND.muted}; overflow: hidden; line-clamp: 2;">${escapeHtml(description)}</div>`
    : ''

  const portraitHtml = portrait
    ? `<img src="${portrait}" width="300" height="300" style="position: absolute; right: 80px; top: 165px; width: 300px; height: 300px; border-radius: 9999px; border: 2px solid rgba(255, 255, 255, 0.12);" />`
    : ''

  return toSatori(`<div
    style="display: flex; flex-direction: column; justify-content: space-between; width: 100%; height: 100%; padding: 72px ${portrait ? 440 : 80}px 72px 80px; background-color: ${BRAND.ink}; background-image: radial-gradient(circle at 100% 0%, rgba(255, 45, 106, 0.22) 0%, rgba(255, 45, 106, 0) 52%); font-family: 'Inter'; color: ${BRAND.paper};"
  >
    <div style="display: flex; align-items: center;">
      ${markHtml(64)}
      <div style="display: flex; margin-left: 20px; font-size: 32px; font-weight: 700; letter-spacing: -0.02em;">
        samye<span style="color: ${BRAND.accent};">.</span>li
      </div>
    </div>
    <div style="display: flex; flex-direction: column;">
      ${kickerHtml}
      <div style="display: block; font-size: ${titleSize}px; font-weight: 700; line-height: 1.08; letter-spacing: -0.03em; overflow: hidden; line-clamp: 3;">${escapeHtml(title)}</div>
      ${descriptionHtml}
    </div>
    ${portraitHtml}
  </div>`)
}
