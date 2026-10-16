// Hero timing (2026-10-16), for src/assets/hero/hero.mp4 (Kling, design/hero/kling-v3.mp4,
// leveled). The clip is a real camera push all the way into the lens; the lens covers the
// whole frame at 9.54s.
//
// VIDEO_TIMES maps scroll progress through the video (0..1, 101 steps) to video time. Half is
// even in time (keeps the head turn readable) and half even in measured zoom (lens width,
// then lens coverage), so the clip's fast final rush becomes one steady push.

export const LENS_FILLS_AT = 9.542

export const VIDEO_TIMES = [
  0.000, 0.133, 0.250, 0.358, 0.467, 0.575, 0.686, 0.803, 0.919, 1.050,
  1.162, 1.275, 1.393, 1.520, 1.644, 1.793, 1.933, 2.063, 2.202, 2.345,
  2.493, 2.624, 2.785, 2.966, 3.121, 3.286, 3.457, 3.598, 3.735, 3.884,
  4.040, 4.194, 4.342, 4.496, 4.647, 4.805, 4.984, 5.141, 5.276, 5.418,
  5.565, 5.701, 5.833, 5.965, 6.095, 6.221, 6.347, 6.470, 6.591, 6.708,
  6.825, 6.940, 7.052, 7.158, 7.259, 7.356, 7.453, 7.546, 7.637, 7.725,
  7.807, 7.884, 7.954, 8.017, 8.075, 8.132, 8.186, 8.242, 8.297, 8.353,
  8.407, 8.460, 8.511, 8.562, 8.611, 8.660, 8.709, 8.724, 8.738, 8.753,
  8.768, 8.784, 8.799, 8.814, 8.829, 8.845, 8.861, 8.876, 8.892, 8.908,
  8.925, 8.941, 8.958, 8.975, 8.992, 9.058, 9.184, 9.294, 9.376, 9.453,
  9.542,
]

export function videoTimeAt(progress: number) {
  const p = Math.min(1, Math.max(0, progress)) * (VIDEO_TIMES.length - 1)
  const i = Math.floor(p)
  const f = p - i
  const a = VIDEO_TIMES[i]
  const b = VIDEO_TIMES[Math.min(i + 1, VIDEO_TIMES.length - 1)]
  return a + (b - a) * f
}
