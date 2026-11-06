import { z } from 'astro/zod'
import type { SchemaContext } from 'astro:content'

/* Pages */
export const pageSchema = z.object({
  title: z
    .string()
    .trim()
    .default('')
    .describe(
      'Sets the page title, formatted with `SITE.title` as `<pageTitle> - <siteTitle>` for metadata. If empty or the same as `SITE.title`, only `<siteTitle>` is displayed. Page-specific OG images also require a non-empty title different from `FEATURES.ogImage[1].authorOrBrand`; otherwise the fallback OG image is used.'
    ),
  subtitle: z
    .string()
    .trim()
    .default('')
    .describe(
      'Provides a page subtitle. If provided, it will be displayed below the title. If not needed, leave the field as an empty string or delete it.'
    ),
  description: z
    .string()
    .trim()
    .default('')
    .describe(
      'Provides a brief description, used in meta tags for SEO and sharing purposes. If not needed, leave the field as an empty string or delete it, and the `SITE.description` will be used directly.'
    ),
  updated: z.coerce
    .date()
    .optional()
    .describe(
      'When the page last changed in substance (a /now page). Shown as "Last updated", and used for dateModified and the sitemap.'
    ),
  ogImage: z
    .union([z.literal('fallback'), z.string(), z.boolean()])
    .default(true)
    .describe(
      "Controls OG image metadata. Set to `true` or omit the field to generate a page-specific OG image from the final pathname, such as `/blog/foo/` -> `/og-images/blog/foo.png`; if the `title` is empty or matches `FEATURES.ogImage[1].authorOrBrand`, the fallback is used. Set to 'fallback' to use `/og-images/og-image.png`, or false to omit OG image metadata. To use a custom image, place it in `public/og-images/` and set this field to its relative path (for example, `custom.png` or `blog/custom.png`). Missing images fall back to `/og-images/og-image.png`."
    ),
})

/* Posts */
export const postSchema = ({ image }: SchemaContext) =>
  z.object({
    title: z
      .string()
      .trim()
      .min(1)
      .max(60)
      .describe(
        "**Required**. Sets the post title, limited to **60 characters**. This follows [Moz's recommendation](https://moz.com/learn/seo/title-tag), ensuring approximately 90% of titles display correctly in SERPs and preventing truncation on smaller screens or social platforms. Page-specific OG images also require a title different from `FEATURES.ogImage[1].authorOrBrand`; otherwise the fallback OG image is used."
      ),
    subtitle: z
      .string()
      .trim()
      .default('')
      .describe(
        'Provides a post subtitle. If provided, it will be displayed below the title. If not needed, leave the field as an empty string or delete it.'
      ),
    description: z
      .string()
      .trim()
      .default('')
      .describe(
        'Provides a brief description, used in meta tags for SEO and sharing purposes. If not needed, leave the field as an empty string or delete it, and the `SITE.description` will be used directly.'
      ),
    tags: z
      .array(z.string())
      .default([])
      .describe(
        'Adds tags to the post. These are displayed in post metadata and can also be used by list/card view tag filters on pages that enable them. If not needed, leave the field as an empty array or delete it.'
      ),
    cover: z
      .union([image(), z.url()])
      .default('')
      .describe(
        'Defines a cover image for the post. Specify either a URL or a path relative to the current directory. If not needed, leave the field as an empty string or delete it.'
      ),
    coverAlt: z
      .string()
      .trim()
      .default('')
      .describe(
        'Defines the cover image alt text. If `UI.postView.useCoverAltAsCaption` is `true`, it is also shown below the cover image as a caption. If not needed, leave the field as an empty string or delete it.'
      ),
    pubDate: z.coerce
      .date()
      .describe(
        '**Required**. Specifies the publication date. See supported formats [here](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/parse#examples).'
      ),
    lastModDate: z
      .union([z.coerce.date(), z.literal('')])
      .optional()
      .describe(
        'Tracks the last modified date. If not needed, leave the field as an empty string or delete it.'
      ),
    minutesRead: z
      .union([z.number(), z.boolean()])
      .default(true)
      .describe(
        'Provides an estimated reading time. Set a positive number to override it manually, set `true` or delete the field to auto-generate it, and set `false` to hide it.'
      ),
    radio: z
      .boolean()
      .default(false)
      .describe(
        'Indicates if the post includes audio content or links to an external audio source. If `true`, an icon will be added to the post item in the list.'
      ),
    video: z
      .boolean()
      .default(false)
      .describe(
        'Indicates if the post includes video content or links to an external video source. If `true`, an icon will be added to the post item in the list.'
      ),
    platform: z
      .string()
      .trim()
      .default('')
      .describe(
        'Specifies the platform where the audio or video content is published. If provided, the platform name will be displayed. If not needed, leave the field as an empty string or delete it.'
      ),
    ogImage: z
      .union([z.literal('fallback'), z.string(), z.boolean()])
      .default(true)
      .describe(
        "Controls OG image metadata. Set to `true` or omit the field to generate a page-specific OG image from the final pathname, such as `/blog/foo/` -> `/og-images/blog/foo.png`; if the `title` is empty or matches `FEATURES.ogImage[1].authorOrBrand`, the fallback is used. Set to 'fallback' to use `/og-images/og-image.png`, or false to omit OG image metadata. To use a custom image, place it in `public/og-images/` and set this field to its relative path (for example, `custom.png` or `blog/custom.png`). Missing images fall back to `/og-images/og-image.png`."
      ),
    toc: z
      .boolean()
      .default(true)
      .describe(
        'Controls whether the table of contents (TOC) is generated for the post.'
      ),
    share: z
      .boolean()
      .default(true)
      .describe('Controls whether social sharing is available for the post.'),
    search: z
      .boolean()
      .default(true)
      .describe(
        'Controls whether search is available for the post. If `true`, search will be enabled; otherwise, it will be disabled.'
      ),
    redirect: z
      .union([z.url(), z.literal('')])
      .default('')
      .describe(
        'Defines a URL to redirect the post. If not needed, leave the field as an empty string or delete it.'
      ),
    draft: z
      .boolean()
      .default(false)
      .describe(
        'Marks the post as a draft. If `true`, it is only visible in development and excluded from production builds.'
      ),
  })

/* Projects */
export const projectSchema = z.object({
  id: z.string().describe('**Required**. Name of the project to be displayed.'),
  link: z
    .union([z.url(), z.string().regex(/^\/[^/]/, 'A path on this site')])
    .describe(
      '**Required**. URL linking to the project page or repository, or a path on this site (`/lodos/`).'
    ),
  desc: z
    .string()
    .describe('**Required**. A brief description summarizing the project.'),
  descTr: z
    .string()
    .describe(
      '**Required**. The description in Turkish, for the /tr/projects/ page.'
    ),
  icon: z
    .string()
    .regex(
      /^(i-[\w-]+(:[\w-]+)?|\/[\w./-]+\.(svg|png|webp))$/,
      'Icon must be a UnoCSS icon (`i-<collection>-<icon>`) or an image in `public/` (`/icons/x.svg`).'
    )
    .describe(
      "**Required**. Icon representing the project: a [UnoCSS icon](https://icones.js.org/) as `i-<collection>-<icon>` or `i-<collection>:<icon>`, or the path of an image in `public/` such as `/icons/lodos.svg` for the project's own logo."
    ),
  category: z.string().describe('**Required**. Category of the project.'),
})
