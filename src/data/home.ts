/**
 * The home page, in both languages: one source for the page (src/components/
 * views/Home.astro) and for its markdown mirror (homeDoc in src/utils/ai.ts),
 * so the two cannot drift apart. Rich text is inline markdown, links and bold
 * only: rendered by `inline()` below on the page, used as is in the mirror.
 */
import type { Locale } from '~/i18n'
import type { LogoSlug } from '~/data/logos'

type Text = Record<Locale, string>

export interface Venture {
  name: string
  /** a path on this site (/lodos/) or a URL */
  href: string
  icon: string
  description: Text
  /** one line of numbers */
  facts: Text
}

export interface Role {
  company: string
  role: Text
  /** e.g. 2024–2026 */
  years: string
  place: Text
  /** what the work was, in a sentence or two */
  description: Text
  /** the brands the work was for, shown as logo chips */
  clients?: LogoSlug[]
}

export interface Interest {
  /** the page, by its English path; its name is STRINGS[locale][key] */
  key: 'community' | 'outdoors' | 'music' | 'reading'
  /** a photo for the card (in public/), or none: the card shows `figure` */
  image?: string
  /** what the card shows instead of a photo: a number and what it counts */
  figure?: { value: string; label: Text }
  description: Text
}

export const HOME = {
  bio: {
    en: "Senior full-stack engineer in Istanbul. For 12+ years I've designed and run production systems: async Python and TypeScript backends, PostgreSQL schemas, real-time event flows and the Next.js/React products on top of them. Today all of it goes into one thing: [lodos.md](/lodos/), the company that runs itself.",
    tr: "İstanbul'da yaşayan kıdemli bir full-stack mühendisim. 12 yılı aşkın süredir canlıda çalışan sistemler tasarlıyor ve işletiyorum: asenkron Python ve TypeScript backend'ler, PostgreSQL şemaları, gerçek zamanlı olay akışları ve bunların üzerinde çalışan Next.js/React ürünleri. Bugün bunların hepsi tek bir işe gidiyor: kendi kendini yöneten şirket [lodos.md](/tr/lodos/).",
  } satisfies Text,

  facts: [
    { icon: 'i-ri-map-pin-line', text: { en: 'Istanbul', tr: 'İstanbul' } },
    {
      icon: 'i-ri-code-s-slash-line',
      text: { en: '12+ years in production', tr: '12+ yıl canlıda' },
    },
    {
      icon: 'i-ri-sailboat-line',
      text: { en: 'Sailing since 2002', tr: "2002'den beri yelken" },
    },
  ],

  building: [
    {
      name: 'lodos.md',
      href: '/lodos/',
      icon: '/icons/lodos.svg',
      description: {
        en: 'The company that runs itself: an AI team that learns your company and works across every department. You make the decisions; nobody else can see your data. Built in five months, with its own AI.',
        tr: 'Kendi kendini yöneten şirket: şirketinizi öğrenen ve her departmanda çalışan bir yapay zekâ ekibi. Kararları siz verirsiniz, verilerinizi sizden başka kimse göremez. Beş ayda, kendi yapay zekâsıyla geliştirildi.',
      },
      facts: {
        en: 'Closed beta · 1,200+ on the waitlist',
        tr: 'Kapalı beta · bekleme listesinde 1.200+ kişi',
      },
    },
    {
      name: 'gazla.co',
      href: 'https://gazla.co',
      icon: '/icons/gazla.svg',
      description: {
        en: 'A community where founders find each other, grown with zero outside funding. Paused while I build lodos.md; the community is still there.',
        tr: "Girişimcilerin birbirini bulduğu, hiç dış yatırım almadan büyüttüğüm bir topluluk. lodos.md'yi geliştirirken ara verdim; topluluk yerinde duruyor.",
      },
      facts: {
        en: '50,000+ people · 280+ startups',
        tr: '50.000+ kişi · 280+ girişim',
      },
    },
  ] satisfies Venture[],

  previously: [
    {
      company: 'ACANIO',
      role: {
        en: 'Senior Full-Stack & Lead Developer',
        tr: 'Kıdemli Full-Stack ve Lider Geliştirici',
      },
      years: '2024–2026',
      place: {
        en: 'Orlando, Florida, USA · remote',
        tr: 'Orlando, Florida, ABD · uzaktan',
      },
      description: {
        en: 'A clinical-grade brain and orthopedic MRI platform used by physicians in active patient care: AI-assisted overlays on DICOM images, custom Cornerstone3D tools in WebGL, and a grayscale tool for the open-source [OHIF](https://ohif.org/) viewer.',
        tr: 'Hekimlerin aktif hasta bakımında kullandığı, klinik düzeyde bir beyin ve ortopedi MR platformu: DICOM görüntülerinin üzerinde yapay zekâ destekli katmanlar, WebGL ile özel Cornerstone3D araçları ve açık kaynak [OHIF](https://ohif.org/) görüntüleyicisine bir gri tonlama aracı.',
      },
    },
    {
      company: 'Nuevo',
      role: {
        en: 'Senior Frontend Developer',
        tr: 'Kıdemli Frontend Geliştirici',
      },
      years: '2023–2024',
      place: { en: 'Istanbul · remote', tr: 'İstanbul · uzaktan' },
      description: {
        en: 'Financial platforms for AgeSA (formerly Avivasa) and enterprise projects for OTOKOÇ and OYAK, in React and Next.js; load times down 40%.',
        tr: 'AgeSA (eski adıyla Avivasa) finans platformları ile OTOKOÇ ve OYAK kurumsal projeleri, React ve Next.js ile; yüklenme süreleri %40 kısaldı.',
      },
      clients: ['agesa', 'otokoc', 'oyak'],
    },
    {
      company: 'T-Soft',
      role: {
        en: 'Senior Frontend Developer',
        tr: 'Kıdemli Frontend Geliştirici',
      },
      years: '2023',
      place: { en: 'Istanbul · remote', tr: 'İstanbul · uzaktan' },
      description: {
        en: 'The Sarar, Toshiba and Pierre Cardin storefronts, delivered on my own and true to the Figma designs to the pixel.',
        tr: 'Sarar, Toshiba ve Pierre Cardin e-ticaret siteleri; tek başıma, Figma tasarımlarına piksel piksel sadık.',
      },
      clients: ['sarar', 'toshiba', 'pierrecardin'],
    },
    {
      company: 'Akinon',
      role: { en: 'Frontend Developer', tr: 'Frontend Geliştirici' },
      years: '2022–2023',
      place: { en: 'Istanbul · remote', tr: 'İstanbul · uzaktan' },
      description: {
        en: 'Storefronts for Vakko, Koton, LC Waikiki and U.S. Polo Assn., and core work on Akinext, the Next.js commerce framework 70% faster than the stack it replaced.',
        tr: "Vakko, Koton, LC Waikiki ve U.S. Polo Assn. e-ticaret siteleri ve yerini aldığı altyapıdan %70 daha hızlı Next.js ticaret çatısı Akinext'in çekirdek geliştirmesi.",
      },
      clients: ['vakko', 'koton', 'lcwaikiki', 'uspolo'],
    },
  ] satisfies Role[],

  /** where I worked before the companies above */
  alsoWith: ['sony', 'pegasus', 'turktelekom'] satisfies LogoSlug[],

  beyond: [
    {
      key: 'community',
      image: '/images/community/afetharita-map.webp',
      description: {
        en: 'Co-founder of the Open Software Network (AYA): 25,000+ volunteers after the 2023 earthquakes, and AfetHarita, used by AFAD.',
        tr: "Açık Yazılım Ağı'nın (AYA) kurucularından biri: 2023 depremlerinden sonra 25.000'den fazla gönüllü ve AFAD'ın da kullandığı AfetHarita.",
      },
    },
    {
      key: 'outdoors',
      image: '/images/outdoors/sailing.webp',
      description: {
        en: 'Sailing since 2002 and Mediterranean ILCA champion; diving, paragliding and the open road.',
        tr: "2002'den beri yelken ve ILCA'da Akdeniz şampiyonluğu; dalış, yamaç paraşütü ve yol.",
      },
    },
    {
      key: 'music',
      image: '/images/music/Ue4mNQbj9V4.webp',
      description: {
        en: 'Rock and Anatolian rock, from Queen to Cem Karaca, in three playlists.',
        tr: "Queen'den Cem Karaca'ya rock ve Anadolu rock, üç çalma listesinde.",
      },
    },
    {
      key: 'reading',
      description: {
        en: 'The Stoics, Robert Greene, and how companies get built.',
        tr: 'Stoacılar, Robert Greene ve şirketlerin nasıl kurulduğu.',
      },
    },
  ] satisfies Interest[],

  contact: {
    en: 'Building something, running a community, or just want to talk about sailing? Write to me.',
    tr: 'Bir şey mi geliştiriyorsunuz, bir topluluk mu yürütüyorsunuz, yoksa sadece yelken mi konuşmak istiyorsunuz? Yazın.',
  } satisfies Text,
}

/** The section names on the home page. */
export const HOME_LABELS = {
  building: { en: 'Currently building', tr: 'Şu an geliştirdiklerim' },
  activity: { en: 'Activity', tr: 'Aktivite' },
  writing: { en: 'Latest writing', tr: 'Son yazılar' },
  previously: { en: 'Previously', tr: 'Daha önce' },
  beyond: { en: 'Beyond code', tr: 'Kodun ötesinde' },
  contact: { en: 'Get in touch', tr: 'İletişim' },
  allPosts: { en: 'All posts', tr: 'Tüm yazılar' },
  aboutLodos: { en: 'Explore lodos.md', tr: "lodos.md'yi tanıyın" },
  email: { en: 'Email me', tr: 'E-posta gönderin' },
  clients: { en: 'Brands', tr: 'Markalar' },
  alsoWith: { en: 'Before that', tr: 'Öncesi' },
  andMore: { en: 'and more', tr: 've dahası' },
} satisfies Record<string, Text>

const escape = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

/**
 * Inline markdown to HTML: `[text](href)` and `**bold**`, the text escaped.
 * Only for the strings above, which are ours; links outside the site open
 * with rel="noopener".
 */
export function inline(md: string) {
  return escape(md)
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(
      /\[([^\]]+)\]\(([^)\s]+)\)/g,
      (_m, text: string, href: string) =>
        `<a href="${href}"${/^https?:/.test(href) ? ' rel="noopener"' : ''}>${text}</a>`
    )
}
