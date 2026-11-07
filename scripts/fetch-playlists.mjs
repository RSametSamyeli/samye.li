#!/usr/bin/env node
// Refreshes src/data/playlists.json from Spotify's public embed pages: each
// playlist's name and every track (title, artists, duration). No API
// key: the embed page carries the data it renders. If Spotify can't be reached
// or changes its page, the file is left as it was and the script says why.
//
//   node scripts/fetch-playlists.mjs
import fs from 'node:fs'

const OUT = 'src/data/playlists.json'
// artists the site never shows (src/data/music-exclude.json): their tracks are
// dropped here, so they are not in the data either
const EXCLUDED = new Set(
  JSON.parse(fs.readFileSync('src/data/music-exclude.json', 'utf8')).artists
)
const IDS = [
  '5RTS12RZR2eHCv4LKigZdG', // Yabancı Efsanelerim
  '0vfhsfluwMrsT03LwEQo4K', // Türkçe Efsanelerim
  '20Drs7DsecnABZWNOE1PKu', // Elektro Müezzin
]

/** "Come Together - Remastered 2009" -> "Come Together" (and similar edition tags). */
export function cleanTitle(title) {
  return title
    .replace(
      /\s+-\s+(\d{4}\s+)?(Remaster(ed)?|Digital Remaster|Mono|Stereo)(\s+(Version|\d{4}))*(\s*\/.*)?$/i,
      ''
    )
    .replace(/\s+\((\d{4}\s+)?Remaster(ed)?(\s+\d{4})?(\s+Version)?\)$/i, '')
    .replace(/\s+-\s+(Single|Album|Radio)\s+(Version|Edit)$/i, '')
    .replace(/\s+-\s+Live$/i, ' (Live)')
    .trim()
}

async function fetchPlaylist(id) {
  const res = await fetch(`https://open.spotify.com/embed/playlist/${id}`, {
    headers: { 'User-Agent': 'Mozilla/5.0 (samye.li playlist refresh)' },
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const html = await res.text()
  const json =
    /<script id="__NEXT_DATA__" type="application\/json">(.*?)<\/script>/s.exec(
      html
    )?.[1]
  if (!json) throw new Error('no __NEXT_DATA__ in the embed page')
  const entity = JSON.parse(json)?.props?.pageProps?.state?.data?.entity
  if (!entity?.trackList?.length) throw new Error('no tracks in the embed data')
  return {
    id,
    name: entity.name,
    url: `https://open.spotify.com/playlist/${id}`,
    tracks: entity.trackList
      .map((t) => ({
        title: cleanTitle(t.title),
        artists: t.subtitle
          .split(/,\s*/)
          .map((a) => a.trim())
          .filter(Boolean),
        duration: Math.round(t.duration / 1000),
      }))
      .filter((t) => !t.artists.some((a) => EXCLUDED.has(a))),
  }
}

try {
  const playlists = []
  for (const id of IDS) playlists.push(await fetchPlaylist(id))
  const next = JSON.stringify({ playlists }, null, 2) + '\n'
  const prev = fs.existsSync(OUT) ? fs.readFileSync(OUT, 'utf8') : ''
  if (next === prev) console.log('playlists: unchanged')
  else {
    fs.writeFileSync(OUT, next)
    console.log(
      `playlists: ${playlists.map((p) => `${p.name} (${p.tracks.length})`).join(', ')}`
    )
  }
} catch (error) {
  console.error(`playlists: not refreshed (${error.message}); keeping ${OUT}`)
}
