// Jayanth's photos from the FIFA World Cup 2026 at Boston Stadium, where he volunteered on the
// Fan ID team (about-me.md §1c). Sent by him 2026-10-19, resized to WebP (src/assets/worldcup/).
// Left out: the staff dining room photo (other volunteers' faces) and a photo that is mostly
// someone's hair.
// Titles name only what the photo itself shows (shirt names, scoreboards, banners). Where the
// match is read off a scoreboard or flags rather than stated by Jayanth, that's noted.
import bostonNorwayEnd from '../assets/worldcup/boston-norway-end.webp'
import bigScreen from '../assets/worldcup/big-screen.webp'
import germanyLineUp from '../assets/worldcup/germany-line-up.webp'
import musialaSane from '../assets/worldcup/musiala-sane.webp'
import giantPuzzle from '../assets/worldcup/giant-puzzle.webp'
import volunteerKit from '../assets/worldcup/volunteer-kit.webp'
import wirtz from '../assets/worldcup/wirtz.webp'
import germanyDefence from '../assets/worldcup/germany-defence.webp'
import englandGhana from '../assets/worldcup/england-ghana.webp'
import englandGhanaPlay from '../assets/worldcup/england-ghana-play.webp'
import germanyParaguay from '../assets/worldcup/germany-paraguay.webp'
import franceNorway from '../assets/worldcup/france-norway.webp'
import standsScoreboard from '../assets/worldcup/stands-scoreboard.webp'
import norwayFans from '../assets/worldcup/norway-fans.webp'
import norwayEnd from '../assets/worldcup/norway-end.webp'
import fromTheStands from '../assets/worldcup/from-the-stands.webp'

export type Photo = { src: string; alt: string; title: string; subtitle?: string }

export const worldCupPhotos: Photo[] = [
  { src: bostonNorwayEnd, alt: 'Boston Stadium during a match, Norway fans in red behind the goal', title: 'Boston Stadium' },
  { src: bigScreen, alt: 'The big screen and the FIFA World Cup 2026 Boston banner over a full stand', title: 'Matchday in Boston' },
  { src: germanyLineUp, alt: 'Germany players lined up arm in arm before kick-off', title: 'Germany line up' },
  { src: musialaSane, alt: 'Musiala and Sané of Germany on the pitch', title: 'Musiala and Sané' },
  { src: giantPuzzle, alt: 'Volunteers around a giant FIFA World Cup 26 jigsaw puzzle', title: 'The giant puzzle' },
  { src: volunteerKit, alt: 'A bag of FIFA World Cup volunteer kit in a lift', title: 'My volunteer kit' },
  { src: wirtz, alt: 'Wirtz of Germany on the ball', title: 'Wirtz on the ball' },
  { src: germanyDefence, alt: 'A Germany defender with fans in the foreground', title: 'Germany' },
  // Scoreboard shows England and Ghana flags.
  { src: englandGhana, alt: 'England against Ghana, the scoreboard showing both flags', title: 'England vs Ghana' },
  { src: englandGhanaPlay, alt: 'England and Ghana players chasing the ball', title: 'England vs Ghana' },
  // Scoreboard reads Germany and Paraguay.
  { src: germanyParaguay, alt: 'A penalty in front of the Germany vs Paraguay scoreboard', title: 'Germany vs Paraguay' },
  // Scoreboard shows the French flag; Jayanth worked France vs Norway (about-me.md §1c).
  { src: franceNorway, alt: 'Norway fans in red as France attack', title: 'France vs Norway' },
  { src: standsScoreboard, alt: 'The stands and scoreboard on a sunny matchday', title: 'From the stands' },
  { src: norwayFans, alt: 'A stand full of Norway fans in red', title: 'Norway fans' },
  { src: norwayEnd, alt: 'Norway fans in red during play', title: 'Norway fans' },
  { src: fromTheStands, alt: 'The pitch seen from the stands', title: 'From the stands' },
]
