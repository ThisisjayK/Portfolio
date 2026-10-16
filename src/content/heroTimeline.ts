// Hero timing (2026-10-16).
// The clip (Kling 2.5, leveled) is a real camera push until 6.75s; after that the model
// inflated the goggles instead of moving the camera, so the hero stops the video at
// 6.75s and continues the push in code by zooming the whole frame toward the lens.
//
// VIDEO_TIMES maps progress through the video phase (0..1, 51 steps) to video time.
// Half is even in time (keeps the head turn readable), half even in measured zoom
// (shoulder width), so the push feels steady.

export const VIDEO_CUT = 6.75

// Where to zoom: the warm hotspot just above the nose bridge, as a fraction of the
// video frame (measured on the 6.75s frame).
export const LENS_TARGET = { x: 0.5195, y: 0.3635 }
// Lens width as a fraction of the video frame width (same frame).
export const LENS_WIDTH = 0.198

// Final zoom: the lens fills the screen and the nose-bridge notch has left the frame.
export const ZOOM_MAX = 12

export const VIDEO_TIMES = [
  0.000, 0.262, 0.452, 0.602, 0.753, 0.906, 1.047, 1.190, 1.331, 1.454,
  1.566, 1.669, 1.764, 1.850, 1.932, 2.012, 2.094, 2.176, 2.252, 2.327,
  2.400, 2.474, 2.549, 2.630, 2.714, 2.804, 2.899, 2.999, 3.108, 3.225,
  3.350, 3.484, 3.628, 3.781, 3.941, 4.103, 4.276, 4.454, 4.633, 4.813,
  4.994, 5.175, 5.351, 5.525, 5.699, 5.868, 6.040, 6.212, 6.384, 6.557,
  6.750,
]

export function videoTimeAt(progress: number) {
  const p = Math.min(1, Math.max(0, progress)) * (VIDEO_TIMES.length - 1)
  const i = Math.floor(p)
  const f = p - i
  const a = VIDEO_TIMES[i]
  const b = VIDEO_TIMES[Math.min(i + 1, VIDEO_TIMES.length - 1)]
  return a + (b - a) * f
}

// Zoom over the code phase (0..1). Exponential, so equal scroll gives equal perceived
// zoom; it starts a little gentler to match the speed the video phase ends at.
export function zoomAt(progress: number) {
  const q = Math.min(1, Math.max(0, progress))
  return Math.exp(Math.log(ZOOM_MAX) * (0.68 * q + 0.32 * q * q))
}
