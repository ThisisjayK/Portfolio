import type { CSSProperties } from "react"
import idleSheet from "./assets/frog/idle/idle_sheet_transparent.png"
import happySheet from "./assets/frog/happy/happy_sheet_transparent.png"
import sadSheet from "./assets/frog/sad/sad_sheet_transparent.png"
import sleepingSheet from "./assets/frog/sleeping/sleeping_sheet_transparent.png"
import confusedSheet from "./assets/frog/confused/confused_sheet_transparent.png"
import catchingSheet from "./assets/frog/catching/catching_sheet_transparent.png"
import fliesSheet from "./assets/frog/flies/flies_sheet_transparent.png"

export type FrogPose =
  | "idle"
  | "happy"
  | "sad"
  | "sleeping"
  | "confused"
  | "catching"
  | "flies"

// Frame counts here must match each sheet's actual strip length, and the
// steps(N) baked into the matching .frog-mascot--<pose> rule in index.css.
const POSES: Record<FrogPose, { sheet: string; frames: number; fps: number }> = {
  idle: { sheet: idleSheet, frames: 6, fps: 6 },
  happy: { sheet: happySheet, frames: 6, fps: 10 },
  sad: { sheet: sadSheet, frames: 5, fps: 4 },
  sleeping: { sheet: sleepingSheet, frames: 9, fps: 5 },
  confused: { sheet: confusedSheet, frames: 6, fps: 6 },
  catching: { sheet: catchingSheet, frames: 11, fps: 10 },
  flies: { sheet: fliesSheet, frames: 8, fps: 8 },
}

// These play once and hand control back via onDone, rather than looping.
const ONE_SHOT: ReadonlySet<FrogPose> = new Set(["catching"])

type FrogMascotProps = Readonly<{
  pose: FrogPose
  className?: string
  /** Fires when a one-shot pose (catching) finishes its cycle. */
  onDone?: () => void
}>

export default function FrogMascot({ pose, className, onDone }: FrogMascotProps) {
  const cfg = POSES[pose]
  const oneShot = ONE_SHOT.has(pose)
  const style = {
    "--frog-sheet": `url(${cfg.sheet})`,
    "--frog-frames": cfg.frames,
    "--frog-duration": `${cfg.frames / cfg.fps}s`,
  } as CSSProperties
  const classes = ["frog-mascot", `frog-mascot--${pose}`, className]
    .filter(Boolean)
    .join(" ")

  return (
    <div
      className={classes}
      style={style}
      onAnimationEnd={oneShot ? onDone : undefined}
      aria-hidden="true"
    />
  )
}
