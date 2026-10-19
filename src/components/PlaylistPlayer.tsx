// A small music player for Jayanth's Apple Music playlists on the Drake page (2026-10-19), in
// the site's own type and colours. It plays Apple's free 30-second previews (the iTunes Search
// API, resolved into src/content/playlists.json by `npm run playlists`); full songs can't be
// played outside Apple's own player without MusicKit and a paid developer account. Pick a
// playlist, pick a song, and it carries on to the next preview and loops. Cover art is the only
// colour on the card. Keyboard: Tab to a control; the slider seeks with the arrow keys.
import { useEffect, useRef, useState } from 'react'
import data from '../content/playlists.json'
import './PlaylistPlayer.css'

type Track = { title: string; artist: string; album: string; preview: string; art: string; apple: string }
type Playlist = { name: string; appleUrl: string; tracks: Track[] }
const playlists = (data as { playlists: Playlist[] }).playlists.filter((p) => p.tracks.length)

// Show 5 songs, "View more" opens up to 10 (Jayanth, 2026-10-19). The player only plays what's shown.
const FIRST = 5
const MAX = 10

const clock = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`

const Icon = ({ d, fill }: { d: string; fill?: boolean }) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className="pp-icon">
    <path d={d} fill={fill ? 'currentColor' : 'none'} />
  </svg>
)

export default function PlaylistPlayer() {
  const audio = useRef<HTMLAudioElement>(null)
  const [pl, setPl] = useState(0)
  const [i, setI] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [time, setTime] = useState(0)
  const [length, setLength] = useState(30)
  const [open, setOpen] = useState(false)

  const list = playlists[pl]
  const songs = list ? list.tracks.slice(0, MAX) : []
  const track = songs[i]
  const more = songs.length > FIRST
  const shown = open || i >= FIRST ? songs : songs.slice(0, FIRST)

  // Load the selected preview; keep playing if something was already playing.
  const resume = useRef(false)
  useEffect(() => {
    const a = audio.current
    if (!a || !track) return
    a.src = track.preview
    setTime(0)
    if (resume.current) a.play().catch(() => setPlaying(false))
    resume.current = false
    if ('mediaSession' in navigator) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: track.title,
        artist: track.artist,
        album: track.album,
        artwork: [{ src: track.art, sizes: '600x600', type: 'image/jpeg' }],
      })
    }
  }, [track])

  const go = (n: number, play = playing) => {
    resume.current = play
    setI((n + songs.length) % songs.length)
    if (play) setPlaying(true)
  }

  const toggle = () => {
    const a = audio.current
    if (!a || !track) return
    if (a.paused) {
      if (!a.src) a.src = track.preview
      a.play().then(() => setPlaying(true)).catch(() => setPlaying(false))
    } else {
      a.pause()
      setPlaying(false)
    }
  }

  const choosePlaylist = (n: number) => {
    if (n === pl) return
    audio.current?.pause()
    setPlaying(false)
    resume.current = false
    setPl(n)
    setI(0)
    setOpen(false)
  }

  if (!track) return null
  const progress = length ? Math.min(100, (time / length) * 100) : 0

  return (
    <section className="pp" aria-label="Playlists" data-hop>
      <audio
        ref={audio}
        preload="none"
        onTimeUpdate={(e) => setTime(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => setLength(e.currentTarget.duration || 30)}
        onEnded={() => go(i + 1, true)}
        onPause={() => setPlaying(false)}
        onPlay={() => setPlaying(true)}
      />

      <div className="pp-tabs" role="tablist" aria-label="Choose a playlist">
        {playlists.map((p, n) => (
          <button
            key={p.name}
            type="button"
            role="tab"
            aria-selected={n === pl}
            className="pp-tab"
            data-label={p.name}
            onClick={() => choosePlaylist(n)}
          >
            <span className="pp-tab-name" data-label={p.name}>
              {p.name}
            </span>
          </button>
        ))}
      </div>

      <div className="pp-now">
        <img className="pp-art" src={track.art} alt={`Cover of ${track.album}`} width={600} height={600} />
        <div className="pp-meta">
          <p className="pp-title display">{track.title}</p>
          <p className="pp-artist">{track.artist}</p>
        </div>
      </div>

      <div className="pp-bar">
        <input
          className="pp-seek"
          type="range"
          min={0}
          max={length}
          step={0.1}
          value={time}
          aria-label="Seek"
          style={{ ['--pp-progress' as string]: `${progress}%` }}
          onChange={(e) => {
            const t = Number(e.target.value)
            if (audio.current) audio.current.currentTime = t
            setTime(t)
          }}
        />
        <div className="pp-times mono">
          <span>{clock(time)}</span>
          <span>{clock(length)}</span>
        </div>
      </div>

      <div className="pp-controls">
        <button type="button" className="pp-btn" aria-label="Previous song" onClick={() => go(i - 1)}>
          <Icon d="M18 5v14M16 5L7 12l9 7z" />
        </button>
        <button type="button" className="pp-play" aria-label={playing ? 'Pause' : 'Play'} onClick={toggle}>
          {playing ? <Icon d="M9 6v12M15 6v12" /> : <Icon d="M8 5l11 7-11 7z" />}
        </button>
        <button type="button" className="pp-btn" aria-label="Next song" onClick={() => go(i + 1)}>
          <Icon d="M6 5v14M8 5l9 7-9 7z" />
        </button>
      </div>

      <ol className="pp-list">
        {shown.map((t, n) => (
          <li key={t.title + n}>
            <button
              type="button"
              className="pp-row"
              aria-current={n === i ? 'true' : undefined}
              onClick={() => go(n, true)}
            >
              <span className="pp-num mono" aria-hidden="true">
                {String(n + 1).padStart(2, '0')}
              </span>
              <span className="pp-row-title" data-label={t.title}>
                {t.title}
              </span>
              <span className="pp-row-artist">{t.artist}</span>
            </button>
          </li>
        ))}
      </ol>

      {more && i < FIRST && (
        <button type="button" className="pp-more mono" aria-expanded={open} onClick={() => setOpen((v) => !v)}>
          {open ? 'View less' : 'View more'}
        </button>
      )}

      <p className="pp-foot mono">
        30-second previews ·{' '}
        <a href={list.appleUrl} target="_blank" rel="noreferrer">
          Open {list.name} in Apple Music
        </a>
      </p>
    </section>
  )
}
