import { forwardRef } from "react"
import type { HTMLAttributes } from "react"
import { motion, type HTMLMotionProps } from "motion/react"
import { useIsMobile } from "../hooks/useIsMobile"

type Props = HTMLMotionProps<"div">

/* The overlay pages (case study, teardown, volunteer detail) and their
   in-page reveals all share this one enter/exit wrapper. On mobile the whole
   site drops motion-driven chrome, so this renders a plain div there instead
   of a motion.div - content just mounts and unmounts instantly, no fade/slide.
   `rest` still carries motion-only props (variants, whileHover, ...) in its
   type even though none of this file's callers pass them, so it needs a cast
   to plug into a plain div - same trade-off the project already makes at
   every other React Bits / motion boundary. */
export const AnimatedPage = forwardRef<HTMLDivElement, Props>(function AnimatedPage(
  { initial, animate, exit, transition, ...rest },
  ref,
) {
  const mobile = useIsMobile()
  if (mobile) {
    return <div ref={ref} {...(rest as HTMLAttributes<HTMLDivElement>)} />
  }
  return (
    <motion.div
      ref={ref}
      initial={initial}
      animate={animate}
      exit={exit}
      transition={transition}
      {...rest}
    />
  )
})
