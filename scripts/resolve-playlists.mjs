// Finds each track on Apple's public iTunes Search API (no key needed) and writes
// src/content/playlists.json with the 30-second preview URL, cover art and Apple Music link.
// Run: npm run playlists. Re-run if a preview stops playing (Apple can change preview URLs).
import { readFile, writeFile } from 'node:fs/promises'

const source = JSON.parse(await readFile(new URL('./playlists-source.json', import.meta.url), 'utf8'))
const norm = (s) => s.toLowerCase().replace(/\(.*?\)|\[.*?\]/g, '').replace(/[^a-z0-9 ]/g, '').trim()
const out = { playlists: [] }
let missing = 0

for (const pl of source.playlists) {
  const tracks = []
  for (const t of pl.tracks) {
    const url = `https://itunes.apple.com/search?term=${encodeURIComponent(`${t.title} ${t.artist}`)}&entity=song&limit=10`
    const res = await fetch(url)
    const { results = [] } = await res.json()
    // Prefer an exact title + the named artist; fall back to the same title by any artist.
    const hit =
      results.find((r) => norm(r.trackName) === norm(t.title) && norm(r.artistName).includes(norm(t.artist)) && r.previewUrl) ||
      results.find((r) => norm(r.trackName) === norm(t.title) && r.previewUrl)
    if (!hit) {
      console.warn(`  no preview found: ${t.title} - ${t.artist}`)
      missing++
      continue
    }
    tracks.push({
      title: hit.trackName,
      artist: hit.artistName,
      album: hit.collectionName,
      preview: hit.previewUrl,
      art: hit.artworkUrl100.replace('100x100bb', '600x600bb'),
      apple: hit.trackViewUrl,
    })
  }
  out.playlists.push({ name: pl.name, appleUrl: pl.appleUrl, tracks })
  console.log(`${pl.name}: ${tracks.length} of ${pl.tracks.length} tracks`)
}
await writeFile(new URL('../src/content/playlists.json', import.meta.url), JSON.stringify(out, null, 2) + '\n')
if (missing) console.log(`${missing} track(s) skipped.`)
