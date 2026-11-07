/**
 * A brand's logo, fetched at build time and made a one-colour wordmark: a
 * PNG 96 px tall (at most 480 wide), black on transparent, trimmed to the
 * mark. The pages show it as is in the light theme and inverted to white in
 * the dark (`.brand-logo`, src/styles/layout.css), as vercel.com shows its
 * customers. When the file cannot be fetched or read, the brand's name set
 * in type instead, so a site being down never breaks a build.
 */
import sharp from 'sharp'

import type { Logo } from '~/data/logos'

const HEIGHT = 96
const MAX_WIDTH = 480
const TIMEOUT = 15_000

async function fetchBytes(url: string) {
  const res = await fetch(url, {
    // Wikimedia asks for an identifying agent; brand sites want a browser's
    headers: { 'User-Agent': 'Mozilla/5.0 (samye.li build; sam@samye.li)' },
    redirect: 'follow',
    signal: AbortSignal.timeout(TIMEOUT),
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return Buffer.from(await res.arrayBuffer())
}

/** The colour logo as a black mask: by alpha, or by darkness ('luma'). */
async function toWordmark(bytes: Buffer, mode: 'alpha' | 'luma') {
  const meta = await sharp(bytes, { limitInputPixels: false }).metadata()
  // an SVG is rasterised at a density that gives about 400 px of height
  const density =
    meta.format === 'svg'
      ? Math.min(
          600,
          Math.max(72, Math.round((72 * 400) / (meta.height || 100)))
        )
      : undefined
  const { data, info } = await sharp(bytes, {
    density,
    limitInputPixels: false,
  })
    .trim()
    .resize({ height: HEIGHT, width: MAX_WIDTH, fit: 'inside' })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true })
  for (let i = 0; i < data.length; i += 4) {
    const alpha = data[i + 3] / 255
    const luma =
      (0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2]) / 255
    const mask = mode === 'luma' ? alpha * Math.min(1, (1 - luma) * 1.6) : alpha
    data[i] = data[i + 1] = data[i + 2] = 0
    data[i + 3] = Math.round(mask * 255)
  }
  return sharp(data, { raw: info }).png().toBuffer()
}

/** The name in type, black on transparent: the fallback. */
function nameInType(name: string) {
  const escaped = name.replace(/&/g, '&amp;').replace(/</g, '&lt;')
  const width = Math.min(MAX_WIDTH, 24 + name.length * 34)
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${HEIGHT}"><text x="0" y="68" font-family="Helvetica, Arial, sans-serif" font-size="60" font-weight="700" letter-spacing="-1" fill="#000">${escaped}</text></svg>`
  return sharp(Buffer.from(svg)).trim().png().toBuffer()
}

async function render(logo: Logo) {
  if (logo.src)
    try {
      return await toWordmark(await fetchBytes(logo.src), logo.mode ?? 'alpha')
    } catch (error) {
      console.warn(
        `logos: ${logo.name} not fetched (${(error as Error).message}); setting its name in type`
      )
    }
  return nameInType(logo.name)
}

/**
 * Each brand's wordmark, fetched once per build and shared: the endpoint
 * serves the PNG, the pages read its size (for width/height, and for sizing
 * marks to the same visual weight).
 */
const cache = new Map<
  string,
  Promise<{ png: Buffer; width: number; height: number }>
>()

export function getWordmark(logo: Logo) {
  let entry = cache.get(logo.name)
  if (!entry) {
    entry = render(logo).then(async (png) => {
      const { width = 1, height = 1 } = await sharp(png).metadata()
      return { png, width, height }
    })
    cache.set(logo.name, entry)
  }
  return entry
}
