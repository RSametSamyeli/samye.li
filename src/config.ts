import { STRINGS } from './i18n'

import type { Site, Ui, Features } from './types'

export const SITE: Site = {
  website: 'https://samye.li/',
  base: '/',
  title: 'Samet Samyeli',
  description: STRINGS.en.description,
  author: 'Samet Samyeli',
  xHandle: '@SametSamyeli2',
  lang: 'en',
  ogLocale: 'en_US',
  imageDomains: [],
}

/** How each post collection is named to readers: in search, on OG images. */
export const COLLECTION_LABELS = {
  blog: 'Blog',
  shorts: 'Notes',
} as const satisfies Record<'blog' | 'shorts', string>

export const UI: Ui = {
  socialLinks: [
    {
      link: 'https://github.com/RSametSamyeli',
      title: 'Samet Samyeli on GitHub',
      displayMode: 'alwaysIcon',
      icon: 'i-uil-github-alt',
    },
    {
      link: 'https://www.linkedin.com/in/sametsamyeli/',
      title: 'Samet Samyeli on LinkedIn',
      displayMode: 'alwaysIcon',
      icon: 'i-ri-linkedin-box-fill',
    },
    {
      link: 'https://x.com/SametSamyeli2',
      title: 'Samet Samyeli on X',
      displayMode: 'alwaysIcon',
      icon: 'i-ri-twitter-x-fill',
    },
    {
      link: 'https://medium.com/@sametsamyeli',
      title: 'Samet Samyeli on Medium',
      displayMode: 'alwaysIcon',
      icon: 'i-ri-medium-fill',
    },
    {
      link: 'mailto:sam@samye.li',
      title: 'Email Samet Samyeli',
      displayMode: 'alwaysIcon',
      icon: 'i-ri-mail-line',
    },
  ],
  postView: {
    postMetaStyle: 'minimal',
    useCoverAltAsCaption: true,
  },
  groupView: {
    maxGroupColumns: 3,
    showGroupItemColorOnHover: true,
  },
  externalLink: {
    newTab: false,
    cursorType: '',
    showNewTabIcon: false,
  },
}

/**
 * Globally controls whether to enable special features:
 *  - Set to `false` or `[false, {...}]` to disable the feature.
 *  - Set to `[true, {...}]` to enable and configure the feature.
 */
export const FEATURES: Features = {
  // off: the pages appear at once, as on vercel.com
  slideEnterAnim: [false, { enterStep: 80 }],
  ogImage: [
    true,
    {
      authorOrBrand: SITE.title,
      fallbackKicker: STRINGS.en.ogKicker,
      fallbackTitle: STRINGS.en.ogDescription,
      collections: [
        {
          collection: 'blog',
          pathnamePrefix: '/blog',
          label: COLLECTION_LABELS.blog,
        },
        {
          collection: 'shorts',
          pathnamePrefix: '/shorts',
          label: COLLECTION_LABELS.shorts,
        },
      ],
    },
  ],
  toc: [
    true,
    {
      minHeadingLevel: 2,
      maxHeadingLevel: 4,
      displayPosition: 'right',
      displayMode: 'always',
    },
  ],
  share: [
    true,
    {
      twitter: [true, '@SametSamyeli2'],
      bluesky: false,
      mastodon: false,
      facebook: false,
      pinterest: false,
      reddit: false,
      telegram: false,
      whatsapp: false,
      email: false,
    },
  ],
  search: [
    true,
    {
      includes: ['blog', 'shorts'],
      filter: true,
      navHighlight: true,
      batchLoadSize: [true, 5],
      maxItemsPerPage: [true, 3],
    },
  ],
  tag: [
    true,
    {
      displayPosition: 'right',
      displayMode: 'always',
      filterMode: 'AND',
    },
  ],
}
