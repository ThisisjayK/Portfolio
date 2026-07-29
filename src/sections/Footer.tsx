import { useEffect, useState } from "react";

// Hand-traced from the reference pixel-art wave: a 37x20 grid ('.' background,
// 'N' the navy body, 'L' the light-blue wake beneath and behind it), sampled
// cell-by-cell off the actual artwork rather than generated from a formula.
// Tiled left-to-right with its own background gap between repeats (the wave
// doesn't reach the tile's right or bottom edges), instead of stretched into
// a continuous band.
const WAVE_TILE_ROWS: string[] = [
  ".....................................",
  "......................NNNNL..........",
  ".....................NNNNNNNN.....NN.NNLLLNN.",
  "...................NNNNNNNNNNNNNNNNNNNLLNNLN.",
  ".................NNNNNNNNNNNNNNNNNNNLLNNLLL..",
  "...............NNNNNNNNNNNNNNNNNNNNNLLNNNNNLL...",
  "NNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNLLNNNNLLNNNNNL...",
  "NNNNNNNNNNNNNNNNNNNNLLLNNNNNNNNNNNLNLNNNLLLLNN..",
  "NNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNLLLLNNNLLLLLLNNN..",
  "NNNNNNNNNNNNNNNNNNNNNNNNNNNNNNLLLLNNNNNLNL...",
  "LLLNNNNNNNNNNNNLLNNNNNNNNNNLLLNNNLNNNL.......",
  "LLLNNNNNNLLLLLLLLNNNNNNNLLLLLLNNLNLN.......",
  "LLLLLLLLLLLLLLLLNNNNLLLLLLLLLNLLL........",
  "LLLLLLLLLLLLLLLNNNNLLLLLLLLLLL.........",
  "LLLLLLLLLLLLLLLNNLLLLLLLLLL...........",
  "........LLLLLLLLLLLL.................",
  "..........LLLLLLLL...................",
  ".....................................",
  ".....................................",
  ".....................................",
  ".....................................",
];

const WAVE_WIDTH = 1200;
const WAVE_HEIGHT = 40;
const WAVE_CELL = 2;
const TILE_COLS = WAVE_TILE_ROWS[0].length;
const TILE_ROWS = WAVE_TILE_ROWS.length;
const TILE_WIDTH = TILE_COLS * WAVE_CELL;
const WAVE_REPEATS = Math.ceil(WAVE_WIDTH / TILE_WIDTH);

// Run-length encodes one colour's cells per row, per tile repeat, into
// closed rects - far fewer path commands than one rect per cell, while
// still landing on crisp cell boundaries.
function buildTilePath(cell: string) {
  let d = "";
  for (let rep = 0; rep < WAVE_REPEATS; rep++) {
    const originX = rep * TILE_WIDTH;
    for (let row = 0; row < TILE_ROWS; row++) {
      const line = WAVE_TILE_ROWS[row];
      const y = row * WAVE_CELL;
      let col = 0;
      while (col < TILE_COLS) {
        if (line[col] !== cell) {
          col++;
          continue;
        }
        const start = col;
        while (col < TILE_COLS && line[col] === cell) col++;
        const x = originX + start * WAVE_CELL;
        const w = (col - start) * WAVE_CELL;
        d += `M${x},${y} H${x + w} V${y + WAVE_CELL} H${x} Z `;
      }
    }
  }
  return d.trim();
}

// Below the waterline (half the strip, where the tile's own wake cells
// already cluster) a full-width band closes every gap between tiles, so the
// water reads as one continuous surface there. Above it, only the tile's
// own L cells draw - everywhere else stays bare page background, the sky
// the wave leaps out of, which stays deliberately unfilled.
const WATERLINE_ROW = 10;
const WATERLINE_Y = WATERLINE_ROW * WAVE_CELL;

const PIXEL_WAVE_NAVY = buildTilePath("N");
const PIXEL_WAVE_FOAM =
  buildTilePath("L") + ` M0,${WATERLINE_Y} H${WAVE_WIDTH} V${WAVE_HEIGHT} H0 Z`;

// Keeps the 400px-wide whale sprite mostly on screen (a little overflow past
// the right edge is fine - .foot-whale-clip already clips it, and body's own
// overflow:hidden means it's cropped rather than adding a scrollbar).
const WHALE_LEFT_MIN = 5;
const WHALE_LEFT_MAX = 75;
type WhaleSpot = { left: number; mirrored: boolean };

// The sprite is only ever drawn facing one way, so a spot on the right half
// of its range gets mirrored (scaleX(-1), same trick the shark fin's swim
// animation already uses) - otherwise every breach on that side would look
// like it was launched backwards.
function randomWhaleSpot(): WhaleSpot {
  const left = WHALE_LEFT_MIN + Math.random() * (WHALE_LEFT_MAX - WHALE_LEFT_MIN);
  const mid = (WHALE_LEFT_MIN + WHALE_LEFT_MAX) / 2;
  return { left, mirrored: left > mid };
}

export function Footer() {
  // Re-rolled once per breach cycle so the whale doesn't always leap from the
  // same spot facing the same way. foot-whale-breach (footer.css) holds on a
  // blank frame for nearly the whole 30s cycle, so re-rolling here - whenever
  // it happens to land within that window - is invisible; only the ~2s leap
  // itself shows the new spot.
  const [whaleSpot, setWhaleSpot] = useState(randomWhaleSpot);
  useEffect(() => {
    const id = window.setInterval(() => setWhaleSpot(randomWhaleSpot()), 30_000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <footer className="foot" aria-hidden="true">
      <div className="foot-wave-clip">
        <svg
          className="foot-wave"
          viewBox={`0 0 ${WAVE_WIDTH} ${WAVE_HEIGHT}`}
          preserveAspectRatio="none"
        >
          <path
            className="foot-wave__navy"
            d={PIXEL_WAVE_FOAM}
            shapeRendering="crispEdges"
          />
          <path
            className="foot-wave__foam"
            d={PIXEL_WAVE_NAVY}
            shapeRendering="crispEdges"
          />
        </svg>
      </div>
      <div className="foot-shark-wrap">
        <img
          className="foot-shark"
          src={`${import.meta.env.BASE_URL}shark-fin.png`}
          alt=""
          aria-hidden="true"
        />
        <span className="foot-shark-ripple foot-shark-ripple--a" />
        <span className="foot-shark-ripple foot-shark-ripple--b" />
      </div>
      {/* Breaching whale. The wrapper's bottom edge sits on the waterline and
          clips, so the sprite's lower rows are simply hidden and the whale
          reads as launching out of the water and diving back under it.
          Position and facing are re-rolled every cycle (see randomWhaleSpot
          above) so it doesn't always breach from the same spot the same way. */}
      <div className="foot-whale-clip" style={{ left: `${whaleSpot.left}%` }}>
        <span
          className="foot-whale"
          style={{
            backgroundImage: `url(${import.meta.env.BASE_URL}whale-breach-sheet.png)`,
            transform: whaleSpot.mirrored ? "scaleX(-1)" : undefined,
          }}
        />
      </div>
    </footer>
  );
}
