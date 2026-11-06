/**
 * The site's languages. English is the default and lives at the root; Turkish
 * lives under /tr/ with the same paths (/projects/ and /tr/projects/), so a
 * page and its translation are found from each other by the prefix alone.
 *
 * Only the pages in TRANSLATED_PAGES exist in both languages. The blog and the
 * notes are written in English; Turkish pages link to them as English.
 */
export const LOCALES = {
  en: {
    lang: 'en',
    ogLocale: 'en_US',
    intl: 'en-US',
    name: 'English',
    short: 'EN',
    home: '/',
  },
  tr: {
    lang: 'tr',
    ogLocale: 'tr_TR',
    intl: 'tr-TR',
    name: 'Türkçe',
    short: 'TR',
    home: '/tr/',
  },
} as const

export type Locale = keyof typeof LOCALES
export const DEFAULT_LOCALE: Locale = 'en'

/** Pages with a Turkish translation, by their English path. */
export const TRANSLATED_PAGES = [
  '/',
  '/lodos/',
  '/projects/',
  '/now/',
  '/uses/',
  '/beliefs/',
  '/colophon/',
] as const

const withSlash = (path: string) => (path.endsWith('/') ? path : `${path}/`)

/** The language of a page, from its path. */
export function localeOf(pathname: string): Locale {
  return /^\/tr(\/|$)/.test(pathname) ? 'tr' : 'en'
}

/** A page's English path: /tr/projects/ -> /projects/. */
export function englishPath(pathname: string) {
  return withSlash(pathname.replace(/^\/tr(?=\/|$)/, '') || '/')
}

/** A path in the given language: localized('/projects/', 'tr') -> /tr/projects/. */
export function localized(path: string, locale: Locale) {
  const en = englishPath(path)
  return locale === 'tr' ? (en === '/' ? '/tr/' : `/tr${en}`) : en
}

/**
 * The versions of a page in every language, for hreflang and the sitemap, or
 * undefined for a page that exists in one language only.
 */
export function alternatesOf(pathname: string) {
  const en = englishPath(pathname)
  if (!(TRANSLATED_PAGES as readonly string[]).includes(en)) return undefined
  return (Object.keys(LOCALES) as Locale[]).map((locale) => ({
    locale,
    path: localized(en, locale),
  }))
}

/**
 * Where the language switch leads: the same page in the other language when it
 * has one, else that language's home page.
 */
export function counterpartOf(pathname: string) {
  const from = localeOf(pathname)
  const to: Locale = from === 'en' ? 'tr' : 'en'
  const alternates = alternatesOf(pathname)
  return {
    locale: to,
    path: alternates?.find((a) => a.locale === to)?.path ?? LOCALES[to].home,
  }
}

/** Interface text, in each language. */
export const STRINGS = {
  en: {
    tagline: 'Senior Full-Stack Engineer, Founder of lodos.md',
    description:
      'Senior full-stack engineer and founder of gazla.co and lodos.md. Writing about software architecture, security and AI.',
    jobTitle: 'Senior Full-Stack Engineer',
    /** the home page's share card: the line above the name, and under it */
    ogKicker: 'Senior Full-Stack Engineer · Tech Founder',
    ogDescription:
      'Building lodos.md and gazla.co. Writing about software architecture, security and AI.',
    home: 'Home',
    homeLabel: 'home',
    blog: 'Blog',
    projects: 'Projects',
    notes: 'Notes',
    mainMenu: 'Main menu',
    navigation: 'Navigation',
    skipToContent: 'Skip to content',
    search: 'Search',
    toggleTheme: 'Toggle theme',
    darkMode: 'Dark mode',
    rssFeed: 'RSS feed',
    scrollToTop: 'Scroll to top',
    tableOfContents: 'Table of contents',
    openTableOfContents: 'Open table of contents',
    elsewhere: 'Elsewhere',
    source: 'Source',
    switchTo: 'Türkçe',
    activity: 'Activity',
    followersOnX: 'followers on X',
    contributionsLastYear: 'contributions in the last year',
    contributionsOn: (n: number, date: string) =>
      `${n} contribution${n === 1 ? '' : 's'} on ${date}`,
    contributionsTotal: (n: string) =>
      `${n} GitHub contributions in the last year`,
    portraitAlt: 'Portrait of Samet Samyeli',
    categories: {} as Record<string, string>,
    pages: 'Pages',
    now: 'Now',
    uses: 'Uses',
    beliefs: 'Beliefs',
    colophon: 'Colophon',
    lastUpdated: (date: string) => `Last updated ${date}`,
    aboutAuthor: 'About the author',
    authorBio:
      'Senior full-stack engineer in Istanbul. I am building lodos.md, the company that runs itself: an AI team that works across every department while you make the decisions.',
    authorLinks: {
      lodos: 'See lodos.md',
      now: 'What I am doing now',
      follow: 'Follow on X',
      rss: 'Subscribe via RSS',
    },
  },
  tr: {
    tagline: 'Kıdemli Full-Stack Mühendis, lodos.md Kurucusu',
    description:
      "Kıdemli full-stack mühendis; gazla.co ve lodos.md'nin kurucusu. Yazılım mimarisi, güvenlik ve yapay zekâ üzerine yazıyor.",
    jobTitle: 'Kıdemli Full-Stack Mühendis',
    ogKicker: 'Kıdemli Full-Stack Mühendis · Girişimci',
    ogDescription:
      "lodos.md ve gazla.co'nun kurucusu. Yazılım mimarisi, güvenlik ve yapay zekâ üzerine yazıyor.",
    home: 'Ana sayfa',
    homeLabel: 'ana sayfa',
    blog: 'Blog',
    projects: 'Projeler',
    notes: 'Notlar',
    mainMenu: 'Ana menü',
    navigation: 'Gezinme',
    skipToContent: 'İçeriğe geç',
    search: 'Ara',
    toggleTheme: 'Temayı değiştir',
    darkMode: 'Koyu mod',
    rssFeed: 'RSS beslemesi',
    scrollToTop: 'Başa dön',
    tableOfContents: 'İçindekiler',
    openTableOfContents: 'İçindekileri aç',
    elsewhere: 'Diğer kanallar',
    source: 'Kaynak kod',
    switchTo: 'English',
    activity: 'Aktivite',
    followersOnX: 'X takipçisi',
    contributionsLastYear: 'son bir yılda GitHub katkısı',
    contributionsOn: (n: number, date: string) => `${date}: ${n} katkı`,
    contributionsTotal: (n: string) => `Son bir yılda ${n} GitHub katkısı`,
    portraitAlt: "Samet Samyeli'nin portresi",
    categories: {
      'Building Now': 'Şu an geliştirdiklerim',
      'Open Source & Community': 'Açık kaynak ve topluluk',
      'Side Projects': 'Yan projeler',
    } as Record<string, string>,
    pages: 'Sayfalar',
    now: 'Şu an',
    uses: 'Kullandıklarım',
    beliefs: 'İnandıklarım',
    colophon: 'Künye',
    lastUpdated: (date: string) => `Son güncelleme: ${date}`,
    aboutAuthor: 'Yazar hakkında',
    authorBio:
      "İstanbul'da kıdemli full-stack mühendis. Kendi kendini yöneten şirket lodos.md'yi geliştiriyorum: kararları siz verirken her departmanda çalışan bir yapay zekâ ekibi.",
    authorLinks: {
      lodos: "lodos.md'yi incele",
      now: 'Şu an ne yapıyorum',
      follow: "X'te takip et",
      rss: 'RSS ile abone ol',
    },
  },
} as const

/** The interface text of the page at this path. */
export const stringsFor = (pathname: string) => STRINGS[localeOf(pathname)]
