/**
 * The music page's data: the playlists as Spotify has them
 * (src/data/playlists.json, refreshed by scripts/fetch-playlists.mjs) and what
 * the site says about each. Counts, durations and top artists are computed, so
 * they follow the playlists as they change.
 */
import data from '~/data/playlists.json'
import exclude from '~/data/music-exclude.json'
import { LOCALES } from '~/i18n'

import type { Locale } from '~/i18n'

type Text = Record<Locale, string>

export interface Track {
  title: string
  artists: string[]
  duration: number
}

/** What the site says about each playlist, by its Spotify id. */
/** tagline: what an English reader should know the Turkish name means */
const ABOUT: Record<string, { tagline: string; sound: Text }> = {
  '5RTS12RZR2eHCv4LKigZdG': {
    tagline: 'My foreign legends',
    sound: {
      en: 'Classic rock, hard rock and the heavier side, from the sixties to the two-thousands.',
      tr: 'Altmışlardan iki binlere classic rock, hard rock ve daha ağır taraf.',
    },
  },
  '0vfhsfluwMrsT03LwEQo4K': {
    tagline: 'My Turkish legends',
    sound: {
      en: 'Anatolian rock and the classics of Turkish pop.',
      tr: 'Anadolu rock ve Türkçe popun klasikleri.',
    },
  },
  '20Drs7DsecnABZWNOE1PKu': {
    tagline: 'Electric muezzin',
    sound: {
      en: 'For now and then: new Anatolian psychedelia, folk turned electric.',
      tr: 'Ara ara dinlediklerim: yeni Anadolu psikedeliği, elektriğe geçmiş halk müziği.',
    },
  },
}

/**
 * Videos shown above a playlist's section, by its Spotify id: thumbnails are
 * kept on this site (public/images/music/<id>.webp), so nothing loads from
 * YouTube until one is played.
 */
export interface Video {
  /** the YouTube id */
  id: string
  /** artist and song */
  title: string
  caption: Text
  /** where to start, in seconds */
  start?: number
}

export const VIDEOS: Record<string, Video[]> = {
  /** at the top of the page, under the introduction */
  'top': [
    {
      id: 'Ue4mNQbj9V4',
      title: 'The Doors, Riders on the Storm',
      caption: { en: '1971, unofficial video', tr: '1971, gayriresmî klip' },
    },
    {
      id: '-fWw7FE9tTo',
      title: 'Iggy Pop, The Passenger',
      caption: {
        en: 'From Lust for Life, 1977',
        tr: 'Lust for Life albümünden, 1977',
      },
    },
  ],
  // Yabancı Efsanelerim
  '5RTS12RZR2eHCv4LKigZdG': [
    {
      id: 'n4RjJKxsamQ',
      title: 'Scorpions, Wind of Change',
      caption: {
        en: 'From Crazy World, 1990',
        tr: 'Crazy World albümünden, 1990',
      },
    },
  ],
  // Türkçe Efsanelerim
  '0vfhsfluwMrsT03LwEQo4K': [
    {
      id: 'F-k_Fr67bPQ',
      title: 'Erkin Koray, Cemalim',
      caption: { en: '1974, on TRT', tr: "1974, TRT'de" },
    },
  ],
  // Elektro Müezzin
  '20Drs7DsecnABZWNOE1PKu': [
    {
      id: 'FyQ_5uLyFMo',
      title: 'Altın Gün, Goca Dünya',
      caption: { en: 'Live on KEXP', tr: "KEXP'te canlı" },
      start: 28,
    },
  ],
}

/** The line that leads into the playlists, after the videos at the top. */
export const LEAD: Text = {
  en: 'Below are the three playlists I keep on Spotify, read straight from them.',
  tr: "Aşağıda Spotify'da tuttuğum üç çalma listesi var; doğrudan listelerden okunuyor.",
}

/** Artists by number of tracks they appear on, most first. */
function rankArtists(tracks: Track[]) {
  const counts = new Map<string, number>()
  for (const track of tracks)
    for (const artist of track.artists)
      counts.set(artist, (counts.get(artist) ?? 0) + 1)
  return [...counts]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(([name, count]) => ({ name, count }))
}

/**
 * Artists the site does not show, by the owner's wish
 * (src/data/music-exclude.json): their tracks are left out of everything
 * below, though they stay in the playlists on Spotify. The fetch script drops
 * them too; this guards data written before.
 */
const EXCLUDED_ARTISTS = new Set(exclude.artists)

export const PLAYLISTS = data.playlists.map((source) => {
  const playlist = {
    ...source,
    tracks: source.tracks.filter(
      (t) => !t.artists.some((a) => EXCLUDED_ARTISTS.has(a))
    ),
  }
  const artists = rankArtists(playlist.tracks)
  return {
    ...playlist,
    about: ABOUT[playlist.id],
    artists,
    seconds: playlist.tracks.reduce((sum, t) => sum + t.duration, 0),
  }
})

const allTracks = PLAYLISTS.flatMap((p) => p.tracks)
export const TOTALS = {
  tracks: allTracks.length,
  artists: new Set(allTracks.flatMap((t) => t.artists)).size,
  seconds: allTracks.reduce((sum, t) => sum + t.duration, 0),
  topArtists: rankArtists(allTracks),
}

/** 6 h 48 min / 6 sa 48 dk */
export function formatHours(seconds: number, locale: Locale) {
  const h = Math.floor(seconds / 3600)
  const m = Math.round((seconds % 3600) / 60)
  return locale === 'tr' ? `${h} sa ${m} dk` : `${h} h ${m} min`
}

/** 4:19 */
export function formatTrack(seconds: number) {
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`
}

/** ISO 8601 duration for schema.org: PT4M19S */
const isoDuration = (seconds: number) =>
  `PT${Math.floor(seconds / 60)}M${seconds % 60}S`

/** The playlists as JSON-LD: a MusicPlaylist each, with their recordings. */
export function musicSchema(locale: Locale, pageUrl: string) {
  return PLAYLISTS.map((p) => ({
    '@type': 'MusicPlaylist',
    '@id': `${pageUrl}#${p.id}`,
    'name': p.name,
    'url': p.url,
    'description': p.about?.sound[locale],
    'numTracks': p.tracks.length,
    'inLanguage': LOCALES[locale].lang,
    'track': p.tracks.map((t) => ({
      '@type': 'MusicRecording',
      'name': t.title,
      'byArtist': t.artists.map((name) => ({ '@type': 'MusicGroup', name })),
      'duration': isoDuration(t.duration),
    })),
  }))
}

/** The playlists as markdown, every track listed, for the mirror. */
export function musicMarkdown(locale: Locale) {
  const tr = locale === 'tr'
  return [
    LEAD[locale],
    ...PLAYLISTS.map((p) =>
      [
        `## ${p.name}`,
        '',
        `${p.about?.sound[locale] ?? ''} ${p.tracks.length} ${tr ? 'şarkı' : 'tracks'}, ${p.artists.length} ${tr ? 'sanatçı' : 'artists'}, ${formatHours(p.seconds, locale)}. ${p.url}`,
        '',
        ...p.tracks.map(
          (t, i) =>
            `${i + 1}. ${t.title} (${t.artists.join(', ')}, ${formatTrack(t.duration)})`
        ),
      ].join('\n')
    ),
  ].join('\n\n')
}
