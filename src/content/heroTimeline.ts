// Scroll-to-video-time map for the hero clip (design/hero/kling25.mp4, leveled).
// Generated 2026-10-16 by measuring the lens width in every frame: half of the scroll
// is spread evenly over time (so the head turn stays readable) and half evenly over
// zoom (so the clip's sudden rush into the lens feels like one steady push).
// times[i] is the video time at scroll progress i/100.

export const LENS_FILLS_AT = 9.333 // seconds: the lens covers the whole frame from here

export const HERO_TIMES = [
  0.0, 0.109, 0.205, 0.296, 0.386, 0.461, 0.534, 0.617, 0.7, 0.808,
  0.904, 1.004, 1.099, 1.192, 1.282, 1.375, 1.482, 1.591, 1.697, 1.812,
  1.944, 2.074, 2.196, 2.311, 2.458, 2.644, 2.811, 2.973, 3.113, 3.259,
  3.416, 3.564, 3.707, 3.84, 3.978, 4.133, 4.282, 4.433, 4.565, 4.69,
  4.834, 4.976, 5.114, 5.245, 5.388, 5.524, 5.653, 5.786, 5.925, 6.066,
  6.207, 6.339, 6.479, 6.641, 6.797, 6.924, 7.019, 7.104, 7.182, 7.269,
  7.361, 7.458, 7.563, 7.67, 7.776, 7.867, 7.941, 8.004, 8.06, 8.108,
  8.151, 8.192, 8.23, 8.266, 8.299, 8.331, 8.361, 8.39, 8.419, 8.446,
  8.473, 8.498, 8.524, 8.548, 8.572, 8.595, 8.618, 8.64, 8.663, 8.685,
  8.707, 8.729, 8.752, 8.777, 8.804, 8.833, 8.869, 8.913, 8.983, 9.147,
  9.333,
]

export function heroTimeAt(progress: number) {
  const p = Math.min(1, Math.max(0, progress)) * (HERO_TIMES.length - 1)
  const i = Math.floor(p)
  const f = p - i
  const a = HERO_TIMES[i]
  const b = HERO_TIMES[Math.min(i + 1, HERO_TIMES.length - 1)]
  return a + (b - a) * f
}
