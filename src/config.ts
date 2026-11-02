import type { Site, Ui, Features } from './types'

export const SITE: Site = {
  website: 'https://samye.li/',
  base: '/',
  title: 'Samet Samyeli',
  description:
    'Senior full-stack engineer and founder of gazla.co and lodos.md. Writing about software architecture, security and AI.',
  author: 'Samet Samyeli',
  lang: 'en',
  ogLocale: 'en_US',
  imageDomains: [],
}

export const UI: Ui = {
  internalNavs: [
    {
      path: '/blog',
      title: 'Blog',
      displayMode: 'alwaysText',
      text: 'Blog',
    },
    {
      path: '/projects',
      title: 'Projects',
      displayMode: 'alwaysText',
      text: 'Projects',
    },
    {
      path: '/shorts',
      title: 'Notes',
      displayMode: 'iconToTextOnMobile',
      text: 'Notes',
      icon: 'i-meteor-icons-grid',
    },
  ],
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
  navBarLayout: {
    left: [],
    right: [
      'internalNavs',
      'hr',
      'socialLinks',
      'hr',
      'searchButton',
      'themeButton',
      'rssLink',
    ],
    mergeOnMobile: true,
  },
  tabbedLayoutTabs: false,
  postView: {
    postMetaStyle: 'minimal',
    useCoverAltAsCaption: true,
  },
  groupView: {
    maxGroupColumns: 3,
    showGroupItemColorOnHover: true,
  },
  githubView: {
    monorepos: [],
    mainLogoOverrides: [],
    subLogoMatches: [
      [/theme/, 'i-unjs-theme-colors'],
      [/github/, 'https://github.githubassets.com/favicons/favicon.svg'],
      [/tweet/, 'i-prime-twitter'],
      [/ins/, 'i-skill-icons-instagram'],
      [/bluesky/, 'i-logos-bluesky'],
    ],
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
  slideEnterAnim: [true, { enterStep: 80 }],
  ogImage: [
    true,
    {
      authorOrBrand: `${SITE.title}`,
      fallbackTitle: `${SITE.description}`,
      fallbackBgType: 'plum',
      collections: [
        { collection: 'blog', pathnamePrefix: '/blog' },
        { collection: 'shorts', pathnamePrefix: '/shorts' },
      ],
    },
  ],
  toc: [
    true,
    {
      minHeadingLevel: 2,
      maxHeadingLevel: 4,
      displayPosition: 'right',
      displayMode: 'content',
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
  giscus: false,
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
      displayMode: 'content',
      filterMode: 'AND',
    },
  ],
}
