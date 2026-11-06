import { experimental_getFontFileURL, fontData } from 'astro:assets'
import { decode } from 'html-entities'
import satori from 'satori'
import fs from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

import { BRAND_ICONS, markMarkup } from '~/utils/brand'
import { ogImageMarkup } from '~/utils/og-image/template/markup'

import type { html } from 'satori-html'
import type { BrandIcon } from '~/utils/brand'
import type { OgImageManifestItem } from '~/utils/og-image/manifest'

type SatoriNode = ReturnType<typeof html>
interface SatoriFont {
  name: string
  weight: 400 | 700
  style: 'normal'
  data: ArrayBuffer
}

const fontCache = new Map<string, Promise<ArrayBuffer>>()

/**
 * Recursively unescapes HTML entities in a given virtual DOM node's children.
 *
 * Fix accidental HTML entity escaping in 'satori-html'.
 * @see https://github.com/natemoo-re/satori-html/issues/20#issuecomment-1999332693
 */
function unescapeHTML(node: SatoriNode) {
  const children = node?.props?.children
  if (!children) {
    return
  } else if (Array.isArray(children)) {
    for (const n of children) {
      unescapeHTML(n)
    }
  } else if (typeof children === 'object') {
    unescapeHTML(children)
  } else if (typeof children === 'string') {
    node.props.children = decode(children)
  }
}

/**
 * Loads every weight of the `--font-og-sans` family (Satori reads WOFF, not
 * WOFF2), each file fetched once per build.
 * @see https://docs.astro.build/en/guides/fonts/#accessing-font-data-programmatically
 */
async function getSatoriFonts(requestUrl: URL): Promise<SatoriFont[]> {
  const faces = (fontData['--font-og-sans'] ?? []).filter(
    (face) => (face.style ?? 'normal') === 'normal'
  )

  const fonts = await Promise.all(
    faces.map(async (face) => {
      const source = face.src.find((item) => item.format === 'woff')
      if (!source) return undefined

      const url = experimental_getFontFileURL(source.url, requestUrl)
      let data = fontCache.get(url)
      if (!data) {
        data = fetch(url).then((response) => {
          if (!response.ok)
            throw new Error(`Failed to fetch OG font file: ${url}`)
          return response.arrayBuffer()
        })
        fontCache.set(url, data)
      }

      return {
        name: 'Inter',
        weight: Number(face.weight) >= 600 ? 700 : 400,
        style: 'normal',
        data: await data,
      } satisfies SatoriFont
    })
  )

  const loaded = fonts.filter((font) => font !== undefined)
  if (!loaded.some((font) => font.weight === 700))
    throw new Error(
      "'--font-og-sans' needs a bold (700) WOFF face for the mark and the OG titles."
    )
  return loaded
}

/**
 * Renders Satori markup to an SVG string, text drawn as paths.
 */
async function renderSvg(
  node: SatoriNode,
  size: { width: number; height: number },
  requestUrl: URL
) {
  unescapeHTML(node)
  return satori(node, { ...size, fonts: await getSatoriFonts(requestUrl) })
}

/**
 * Rasterizes an SVG string to a PNG buffer.
 */
function svgToPng(svg: string, width?: number) {
  const image = sharp(Buffer.from(svg))
  return (width ? image.resize(width, width) : image)
    .png({ compressionLevel: 9, quality: 100 })
    .toBuffer()
}

/**
 * Packs PNG images into one ICO file (PNG-compressed entries, supported by
 * every browser since IE Vista).
 */
function pngsToIco(images: { size: number; png: Buffer }[]) {
  const header = Buffer.alloc(6)
  header.writeUInt16LE(0, 0) // reserved
  header.writeUInt16LE(1, 2) // type: icon
  header.writeUInt16LE(images.length, 4)

  let offset = 6 + 16 * images.length
  const entries = images.map(({ size, png }) => {
    const entry = Buffer.alloc(16)
    entry.writeUInt8(size >= 256 ? 0 : size, 0) // width (0 means 256)
    entry.writeUInt8(size >= 256 ? 0 : size, 1) // height
    entry.writeUInt8(0, 2) // palette
    entry.writeUInt8(0, 3) // reserved
    entry.writeUInt16LE(1, 4) // colour planes
    entry.writeUInt16LE(32, 6) // bits per pixel
    entry.writeUInt32LE(png.length, 8)
    entry.writeUInt32LE(offset, 12)
    offset += png.length
    return entry
  })

  return Buffer.concat([header, ...entries, ...images.map((i) => i.png)])
}

/** The author's portrait as a data URL for Satori, read and sized once. */
let portraitData: Promise<string> | null = null
const getPortrait = () =>
  (portraitData ??= fs
    .readFile(path.resolve('src/assets/samet-samyeli.jpg'))
    .then((file) =>
      sharp(file).resize(640, 640).jpeg({ quality: 85 }).toBuffer()
    )
    .then((jpeg) => `data:image/jpeg;base64,${jpeg.toString('base64')}`))

/**
 * Generates an Open Graph image as a PNG buffer.
 */
export async function generateOgImageBuffer(
  item: OgImageManifestItem,
  requestUrl: URL
) {
  const portrait = item.portrait ? await getPortrait() : undefined
  const svg = await renderSvg(
    ogImageMarkup({ ...item, portrait }),
    { width: 1200, height: 630 },
    requestUrl
  )
  return svgToPng(svg)
}

/**
 * Generates one of the brand icons: the SVG favicon as text, the others as
 * binary PNG or ICO data.
 */
export async function generateBrandIcon(
  name: BrandIcon,
  requestUrl: URL
): Promise<{ body: string | Buffer; contentType: string }> {
  const { size, variant } = BRAND_ICONS[name]
  const svg = await renderSvg(
    markMarkup(size, variant),
    { width: size, height: size },
    requestUrl
  )

  if (name.endsWith('.svg')) return { body: svg, contentType: 'image/svg+xml' }

  if (name.endsWith('.ico')) {
    const images = await Promise.all(
      [16, 32, 48].map(async (px) => ({
        size: px,
        png: await svgToPng(svg, px),
      }))
    )
    return { body: pngsToIco(images), contentType: 'image/x-icon' }
  }

  return { body: await svgToPng(svg), contentType: 'image/png' }
}
