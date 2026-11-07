/**
 * The brands named on the home and projects pages, by slug, with where each
 * brand's own logo lives. The logos are fetched when the site is built
 * (src/pages/brands/[slug].png.ts) and turned into one-colour wordmarks, so
 * none is kept in the repository and the pages load them from this site. A
 * brand without a usable logo (no `src`) shows its name instead.
 */
export interface Logo {
  name: string
  /** the logo file: the brand's site or Wikimedia Commons, SVG preferred */
  src?: string
  /**
   * How the colour logo becomes one colour: `alpha`, every visible pixel
   * (solid marks); `luma`, by darkness (marks with white letters cut into
   * colour, which `alpha` would fill in).
   */
  mode?: 'alpha' | 'luma'
  /**
   * Optical correction to the equal-area size: above 1 for marks whose
   * letters are small inside the artwork (a tagline, an emblem beside them).
   */
  scale?: number
}

const commons = (file: string) =>
  `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(file)}`

export const LOGOS = {
  sony: { name: 'Sony', src: commons('Sony Group logo.svg') },
  turktelekom: {
    scale: 1.4,
    name: 'Türk Telekom',
    src: commons('Türk Telekom logo.svg'),
  },
  pegasus: {
    name: 'Pegasus Airlines',
    src: commons('Pegasus Airlines logo.svg'),
  },
  lcwaikiki: { name: 'LC Waikiki', src: commons('LC Waikiki logo.svg') },
  koton: { name: 'Koton', src: commons('Koton logo.svg') },
  toshiba: { name: 'Toshiba', src: commons('Toshiba logo.svg') },
  oyak: { name: 'OYAK', src: commons('OYAK logo.svg'), mode: 'luma' },
  vakko: { name: 'Vakko', src: 'https://www.vakko.com/assets/img/logo2.svg' },
  pierrecardin: {
    scale: 1.15,
    name: 'Pierre Cardin',
    src: 'https://www.pierrecardin.com.tr/logo-black.svg',
  },
  uspolo: {
    scale: 1.35,
    name: 'U.S. Polo Assn.',
    src: 'https://tr.uspoloassn.com/logo.svg',
  },
  otokoc: {
    name: 'Otokoç',
    src: 'https://www.otokoc.com.tr/getContentAsset/ad7c5119-9efd-47a1-8a50-e2d8fe665747/dfc3d011-8f63-43f6-9ed8-4b444333a1d0/header-logo.svg?language=tr-TR',
  },
  agesa: {
    scale: 1.1,
    name: 'AgeSA',
    src: 'https://www.agesa.com.tr/i/assets/images/svg/logo.svg',
    mode: 'luma',
  },
  // the site's only logo is an anniversary mark: the name instead
  sarar: { name: 'Sarar' },
} satisfies Record<string, Logo>

export type LogoSlug = keyof typeof LOGOS

/** The wordmark's path, or none: show the name. */
export const logoUrl = (slug: LogoSlug) =>
  'src' in LOGOS[slug] ? `/brands/${slug}.png` : undefined

/**
 * A wordmark's display size so that marks of any shape carry the same visual
 * weight, as logo walls do: equal area, not equal height (a long mark is
 * shorter, a compact one taller), within a height range.
 */
export function opticalSize(
  intrinsic: { width: number; height: number },
  area: number,
  maxHeight: number,
  scale = 1
) {
  const ratio = intrinsic.width / intrinsic.height
  const height = Math.min(maxHeight, Math.sqrt(area / ratio) * scale)
  return { width: Math.round(height * ratio), height: Math.round(height) }
}
