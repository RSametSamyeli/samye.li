import { getCollection } from 'astro:content'

import {
  OG_IMAGE_DIR,
  FALLBACK_OG_IMAGE_SLUG,
  FALLBACK_OG_IMAGE_FILENAME,
  checkPublicOgImageExists,
  getOgImageConfig,
  getPagePathname,
  getPostPathname,
  pathnameToOgImageSlug,
  pathnameToOgImageFile,
  withOgImageDocsHint,
} from '~/utils/og-image/routing'

import type { CollectionEntry } from 'astro:content'
import type { OgImageCollectionConfig } from '~/types'

export interface OgImageManifestItem {
  slug: string
  authorOrBrand: string
  title: string
  /** what the page is, and for posts when it was published: "Blog · Nov 2, 2026" */
  kicker: string
  /** a line under the title, if the page has one */
  description: string
  /** show the author's portrait (the home page's card) */
  portrait?: boolean
}

export interface PostEntry {
  id: string
  data: object & {
    title?: unknown
    description?: unknown
    pubDate?: unknown
    ogImage?: unknown
    draft?: unknown
    redirect?: unknown
  }
}

const ANSI_YELLOW = '\x1b[33m' // Yellow color for warnings
const ANSI_BOLD = '\x1b[1m' // Bold text
const ANSI_RESET = '\x1b[0m' // Reset color

/**
 * Returns a formatted timestamp in HH:MM:SS format.
 */
function timestamp() {
  return new Intl.DateTimeFormat([], {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).format(new Date())
}

/**
 * Checks if a value is a valid background type.
 */

/**
 * Checks whether a content entry should get a generated OG image manifest item.
 *
 * @example
 * title 'Post' + ogImage true -> true
 * title 'Post' + ogImage false -> false
 * title 'Post' + ogImage 'custom.png' -> false
 * title '' + ogImage true -> false
 * title = authorOrBrand + ogImage true -> false
 * missing title + ogImage true -> false
 */
const textOf = (value: unknown) =>
  typeof value === 'string' ? value.trim() : ''

/** "Nov 2, 2026": the date as the site shows it, in UTC as it is stored. */
const formatCardDate = (date: Date) =>
  new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date)

function shouldGenerateOgImage<
  T extends { title?: unknown; ogImage?: unknown },
>(
  authorOrBrand: string,
  data: T
): data is T & { title: string; ogImage: true } {
  return (
    typeof data.title === 'string' &&
    !!data.title?.trim() &&
    data.title !== authorOrBrand &&
    data.ogImage === true
  )
}

/**
 * Adds a generated OG image manifest item unless a static public image blocks the endpoint pathname.
 *
 * @example
 * / + page context -> adds slug index
 * / + fallback context -> adds slug og-image
 * /blog/ + no public conflict -> adds slug blog
 * /blog/getting-started/ + no public conflict -> adds slug blog/getting-started
 * /blog/getting-started/ + public/og-images/blog/getting-started.png exists -> warning + skipped
 */
function addManifestItem(
  manifest: Map<string, OgImageManifestItem>,
  pathname: string,
  authorOrBrand: string,
  card: Pick<
    OgImageManifestItem,
    'title' | 'kicker' | 'description' | 'portrait'
  >,
  context: 'fallback' | 'page' = 'page'
) {
  const slug =
    context === 'fallback'
      ? FALLBACK_OG_IMAGE_SLUG
      : pathnameToOgImageSlug(pathname)
  const filename =
    context === 'fallback'
      ? FALLBACK_OG_IMAGE_FILENAME
      : pathnameToOgImageFile(pathname)

  if (checkPublicOgImageExists(filename).exists) {
    const publicPath = `public/${OG_IMAGE_DIR}/${filename}`
    const endpointPath = `/${OG_IMAGE_DIR}/${filename}`

    console.warn(
      `${ANSI_YELLOW}${ANSI_BOLD}${timestamp()}${ANSI_RESET}${ANSI_YELLOW} [WARN]${ANSI_RESET} Skipping OG image endpoint: \`${endpointPath}\`. ${withOgImageDocsHint(
        context === 'fallback'
          ? `'${publicPath}' already exists. Delete it to let the endpoint generate the fallback image.`
          : `'${publicPath}' already exists. Delete it to generate \`${endpointPath}\`, or set \`ogImage\` to '${filename}' to use it explicitly.`
      )}`
    )

    return
  }

  if (manifest.has(slug)) {
    console.warn(
      `${ANSI_YELLOW}${ANSI_BOLD}${timestamp()}${ANSI_RESET}${ANSI_YELLOW} [WARN]${ANSI_RESET} Skipping OG image endpoint: \`${slug}\`. Multiple routes are defined to build the same URL path, please check and ensure they are unique.`
    )
    return
  }

  manifest.set(slug, {
    slug,
    authorOrBrand,
    ...card,
  })
}

/**
 * Adds an OG image manifest item for a routed post collection entry.
 *
 * @example
 * collection blog + pathnamePrefix /blog + id getting-started
 * -> pathname /blog/getting-started/ -> slug blog/getting-started
 *
 * collection articles + pathnamePrefix /writing + id nested/note
 * -> pathname /writing/nested/note/ -> slug writing/nested/note
 *
 * draft post -> skipped
 * redirected post -> skipped
 * post with ogImage false, 'fallback', or custom image -> skipped
 */
function addPostManifestItem(
  manifest: Map<string, OgImageManifestItem>,
  collection: OgImageCollectionConfig,
  post: PostEntry,
  authorOrBrand: string
) {
  if (post.data.draft || post.data.redirect) return
  if (!shouldGenerateOgImage(authorOrBrand, post.data)) return

  const pathname = getPostPathname(collection.pathnamePrefix, post.id)
  const date =
    post.data.pubDate instanceof Date ? formatCardDate(post.data.pubDate) : ''
  addManifestItem(manifest, pathname, authorOrBrand, {
    title: post.data.title,
    kicker: [collection.label, date].filter(Boolean).join(' · '),
    description: textOf(post.data.description),
  })
}

/**
 * Adds an OG image manifest item for a static MDX page collection entry.
 *
 * @example
 * page id index -> pathname / -> slug index
 * page id blog -> pathname /blog/ -> slug blog
 * page id projects -> pathname /projects/ -> slug projects
 * page with ogImage false, 'fallback', or custom image -> skipped
 */
function addPageManifestItem(
  manifest: Map<string, OgImageManifestItem>,
  page: CollectionEntry<'pages'>,
  authorOrBrand: string
) {
  if (!shouldGenerateOgImage(authorOrBrand, page.data)) return

  const pathname = getPagePathname(page.id)
  addManifestItem(manifest, pathname, authorOrBrand, {
    title: page.data.title,
    kicker: authorOrBrand,
    description: textOf(page.data.subtitle || page.data.description),
  })
}

/**
 * Collects the build-time OG image manifest for the dynamic image endpoint.
 * Includes fallback slug 'og-image' unless `public/og-images/og-image.png` blocks the endpoint.
 *
 * @example
 * FEATURES.ogImage disabled -> []
 * configured collection blog + pathnamePrefix /notes + id getting-started -> includes slug notes/getting-started
 * configured collection blog + public conflict -> warning + generated manifest item skipped
 */
export async function getOgImageManifest() {
  const config = getOgImageConfig()
  if (!config) return []

  const { authorOrBrand, fallbackKicker, fallbackTitle, collections } = config
  const manifest = new Map<string, OgImageManifestItem>()

  addManifestItem(
    manifest,
    '/',
    authorOrBrand,
    {
      title: authorOrBrand,
      kicker: fallbackKicker,
      description: fallbackTitle,
      portrait: true,
    },
    'fallback'
  )

  const pages = await getCollection('pages')
  for (const page of pages) addPageManifestItem(manifest, page, authorOrBrand)

  for (const collection of collections) {
    const posts = await getCollection(collection.collection)
    for (const post of posts)
      addPostManifestItem(manifest, collection, post, authorOrBrand)
  }

  return Array.from(manifest.values())
}
