/**
 * The sidebar's structure (src/components/nav/SideNav.astro): its groups and
 * their pages, by English path, with the label key (STRINGS) and an icon for
 * each. Kept here so unocss.config.ts can safelist the icons, which the
 * content scan does not read from component code.
 */
import type { STRINGS } from '~/i18n'

type Label = keyof (typeof STRINGS)['en']

export interface NavItem {
  path: string
  label: Label
  icon: string
  /** left out of the sidebar for now; the page itself stays (notes, until there are some) */
  hidden?: boolean
}

export interface NavGroup {
  /** the group's heading; the first group has none */
  title?: Label
  items: NavItem[]
}

export const NAV_GROUPS: NavGroup[] = [
  {
    items: [
      { path: '/', label: 'home', icon: 'i-ri-home-5-line' },
      { path: '/projects/', label: 'projects', icon: 'i-ri-stack-line' },
    ],
  },
  {
    title: 'writing',
    items: [
      { path: '/blog/', label: 'blog', icon: 'i-ri-article-line' },
      {
        path: '/security-by-construction/',
        label: 'securityByConstruction',
        icon: 'i-ri-shield-keyhole-line',
      },
      {
        path: '/shorts/',
        label: 'notes',
        icon: 'i-ri-sticky-note-line',
        hidden: true,
      },
    ],
  },
  {
    title: 'beyondCode',
    items: [
      { path: '/community/', label: 'community', icon: 'i-ri-group-line' },
      { path: '/outdoors/', label: 'outdoors', icon: 'i-ri-sailboat-line' },
      { path: '/reading/', label: 'reading', icon: 'i-ri-book-open-line' },
      { path: '/music/', label: 'music', icon: 'i-ri-music-2-line' },
    ],
  },
  {
    title: 'aboutMe',
    items: [
      { path: '/now/', label: 'now', icon: 'i-ri-pulse-line' },
      { path: '/beliefs/', label: 'beliefs', icon: 'i-ri-compass-3-line' },
      { path: '/uses/', label: 'uses', icon: 'i-ri-tools-line' },
    ],
  },
]
