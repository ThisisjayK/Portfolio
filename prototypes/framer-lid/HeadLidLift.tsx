// Head lid lift: click the portrait, the top of the head pops off and the doodles fly out.
// Paste this into a Framer code file (Assets → Code → New component), then set the
// Portrait property to portrait-cutout.png.
import * as React from "react"
import { motion, MotionConfig, useReducedMotion } from "framer-motion"
import { addPropertyControls, ControlType } from "framer"

/**
 * @framerSupportedLayoutWidth fixed
 * @framerSupportedLayoutHeight fixed
 * @framerIntrinsicWidth 600
 * @framerIntrinsicHeight 680
 */

// Everything is laid out on a 600 × 680 stage, then scaled to fit the frame you draw in Framer.
const W = 600
const H = 680
const HEAD = { x: 150, y: 370, size: 300 }
const MAX_DOODLES = 10
const TILT = [-10, 6, 12, -14, 8, -6, 10]

// Where each doodle lands between the lifted lid and the head: one row for up to 4,
// otherwise two rows. Spacing tightens so the outer doodles stay clear of the speed lines.
function landingSpots(n: number) {
    const size = n <= 8 ? 96 : 80
    const rows = n <= 4 ? [n] : [Math.floor(n / 2), n - Math.floor(n / 2)]
    const rowY = rows.length === 1 ? [318] : [264, 368]
    const spots: { x: number; y: number; r: number; size: number }[] = []
    rows.forEach((count, row) => {
        const step = count > 1 ? Math.min(size + 18, 340 / (count - 1)) : 0
        for (let j = 0; j < count; j++) {
            spots.push({
                x: 300 + (j - (count - 1) / 2) * step,
                y: rowY[row] + (j % 2 ? -8 : 4),
                r: TILT[spots.length % TILT.length],
                size,
            })
        }
    })
    return spots
}

// Confetti. Fixed values, not Math.random(), so Framer's pre-rendered HTML matches the client.
const BITS = [
    [96, 214, 40], [150, 300, 200], [262, 206, 90], [352, 312, 310], [455, 214, 150],
    [508, 300, 20], [118, 430, 260], [214, 420, 120], [395, 425, 330], [492, 440, 70],
    [300, 330, 180], [160, 236, 290],
]
const BIT_SHAPES = [
    '<circle cx="10" cy="10" r="5" stroke-width="2.5"/>',
    '<path d="M2 12q4-8 8 0t8 0" stroke-width="2.5"/>',
    '<path d="M4 4l12 5l-7 7z" fill="#fff" stroke-width="2.5"/>',
]
const SPEED_LINES = ["M52 236L84 336", "M30 256L58 340", "M548 236L516 336", "M570 256L542 340"]

// Doodles drawn on a 120 × 120 grid: ink outlines plus halftone shading.
// `ht` is the halftone pattern url, unique per instance so two copies on a page don't clash.
function doodles(ht: string) {
    const shade = (d: string, stroke = true) =>
        `<path d="${d}" fill="#fff" stroke="none"/><path d="${d}" fill="${ht}"${stroke ? "" : ' stroke="none"'}/>`
    return [
        { label: "Arsenal", svg: `
            ${shade("M22 84L94 38Q104 32 109 41Q113 50 104 55L32 98Z")}
            <path d="M70 53L79 67" stroke-width="3.5"/>
            <ellipse cx="106" cy="47" rx="6" ry="10" transform="rotate(-32 106 47)" fill="#111"/>
            <circle cx="48" cy="82" r="24" fill="#fff"/>
            <circle cx="48" cy="82" r="17" stroke-width="3"/>
            <path d="M48 65V99M31 82H65M36 70L60 94M60 70L36 94" stroke-width="3.5"/>
            <circle cx="48" cy="82" r="6" fill="#111"/>
            <path d="M12 110H104"/>` },
        { label: "Drake", svg: `
            <path d="M34 32L27 12L47 24Z" fill="#111"/>
            <path d="M86 32L93 12L73 24Z" fill="#111"/>
            <path d="M60 20C88 20 98 44 98 68C98 96 82 110 60 110C38 110 22 96 22 68C22 44 32 20 60 20Z" fill="#fff"/>
            <ellipse cx="60" cy="90" rx="24" ry="16" fill="${ht}" stroke="none"/>
            <path d="M47 84l6 5l7-5l7 5l6-5M52 94l8 5l8-5" stroke-width="3"/>
            <circle cx="45" cy="52" r="14" fill="#fff"/>
            <circle cx="75" cy="52" r="14" fill="#fff"/>
            <circle cx="47" cy="54" r="6" fill="#111" stroke="none"/>
            <circle cx="73" cy="54" r="6" fill="#111" stroke="none"/>
            <circle cx="45" cy="51" r="2" fill="#fff" stroke="none"/>
            <circle cx="71" cy="51" r="2" fill="#fff" stroke="none"/>
            <path d="M55 66H65L60 75Z" fill="#111" stroke-width="3"/>
            <path d="M24 66Q36 80 32 100M96 66Q84 80 88 100"/>` },
        { label: "Plants", svg: `
            ${shade("M58 72C30 76 12 58 14 36C38 34 54 50 58 72Z")}
            <path d="M58 72Q38 58 22 42" stroke-width="3"/>
            <path d="M62 72C90 76 108 58 106 36C82 34 66 50 62 72Z" fill="#fff"/>
            <path d="M62 72Q82 58 98 42" stroke-width="3"/>
            <path d="M60 74C38 54 36 24 60 8C84 24 82 54 60 74Z" fill="#fff"/>
            <path d="M60 70V16M60 30L49 24M60 44L47 39M60 30L71 24M60 44L73 39" stroke-width="3"/>
            ${shade("M36 82H84L78 112H42Z")}
            <path d="M32 70H88V82H32Z" fill="#fff"/>` },
        { label: "Video games", svg: `
            <path d="M32 44H88C102 44 110 58 113 76C116 94 104 104 93 94L83 82H37L27 94C16 104 4 94 7 76C10 58 18 44 32 44Z" fill="#fff"/>
            <path d="M28 52h8v6h6v8h-6v6h-8v-6h-6v-8h6Z" fill="#111" stroke="none"/>
            <circle cx="88" cy="51" r="4.5" fill="#111" stroke="none"/>
            <circle cx="97" cy="60" r="4.5" fill="#fff" stroke-width="3"/>
            <circle cx="88" cy="69" r="4.5" fill="#111" stroke="none"/>
            <circle cx="79" cy="60" r="4.5" fill="#fff" stroke-width="3"/>
            <circle cx="48" cy="70" r="7" fill="${ht}" stroke-width="4"/>
            <circle cx="72" cy="70" r="7" fill="${ht}" stroke-width="4"/>
            <path d="M53 54h4M63 54h4" stroke-width="3"/>` },
        { label: "Animals", svg: `
            <path d="M60 24C84 24 96 44 96 64C96 90 80 106 60 106C40 106 24 90 24 64C24 44 36 24 60 24Z" fill="#fff"/>
            ${shade("M34 32C16 30 8 54 14 76C20 84 30 72 32 58Z")}
            ${shade("M86 32C104 30 112 54 106 76C100 84 90 72 88 58Z")}
            <ellipse cx="75" cy="55" rx="12" ry="11" fill="${ht}" stroke="none"/>
            <circle cx="46" cy="56" r="4.5" fill="#111" stroke="none"/>
            <circle cx="75" cy="56" r="4.5" fill="#111" stroke="none"/>
            <ellipse cx="60" cy="80" rx="17" ry="13" fill="#fff"/>
            <path d="M52 72Q60 66 68 72Q65 80 60 80Q55 80 52 72Z" fill="#111" stroke-width="3"/>
            <path d="M56 89Q60 100 64 89" fill="#fff" stroke-width="3"/>
            <path d="M60 80V86M51 86Q60 93 69 86" stroke-width="3.5"/>` },
        { label: "Running", svg: `
            <path d="M4 56H18M2 68H14M6 80H16" stroke-width="4"/>
            <path d="M22 82C22 64 32 54 46 52L58 44C64 54 74 58 86 60C100 62 110 70 112 82Z" fill="#fff"/>
            <path d="M86 60C100 62 110 70 112 82H92C94 72 91 64 86 60Z" fill="${ht}" stroke="none"/>
            <path d="M50 60L58 54M56 64L64 58M62 67L70 61" stroke-width="3.5"/>
            <path d="M38 74Q62 66 86 76" stroke-width="3.5"/>
            <path d="M18 82H114C116 90 112 96 104 96H24C18 96 14 90 18 82Z" fill="#fff"/>
            <path d="M30 96v-5M44 96v-5M58 96v-5M72 96v-5M86 96v-5M100 96v-5" stroke-width="3"/>` },
        { label: "Trekking", svg: `
            <path d="M30 104L64 28L98 104Z" fill="#fff" stroke="none"/>
            <path d="M64 28L98 104H76Z" fill="${ht}" stroke="none"/>
            <path d="M52 55L64 28L76 55L70 50L64 58L58 50Z" fill="#fff" stroke-width="3.5"/>
            <path d="M30 104L64 28L98 104Z"/>
            <path d="M6 104L38 60L70 104Z" fill="#fff" stroke="none"/>
            <path d="M38 60L70 104H54Z" fill="${ht}" stroke="none"/>
            <path d="M6 104L38 60L70 104Z"/>
            <path d="M64 28V10"/>
            <path d="M64 10L80 15L64 20Z" fill="#111" stroke-width="3"/>
            <path d="M2 104H118"/>` },
    ]
}

type Img = { src: string; srcSet?: string; alt?: string }

type Props = {
    portrait?: Img
    openPortrait?: Img
    doodleImages?: Img[]
    hint: string
    cut: number
    rimCenter: number
    rimWidth: number
    ink: string
    style?: React.CSSProperties
}

export default function HeadLidLift(props: Props) {
    const {
        portrait, openPortrait, doodleImages,
        hint = "Pop the lid", cut = 30, rimCenter = 53.3, rimWidth = 58.4, ink = "#111111", style,
    } = props
    const [open, setOpen] = React.useState(false)
    const reduced = useReducedMotion()
    const uid = React.useId().replace(/:/g, "")
    const ht = `url(#${uid}-ht)`, htd = `url(#${uid}-htd)`

    // Your uploaded doodles if there are any, otherwise the built-in placeholder drawings.
    const uploaded = (doodleImages ?? []).filter(d => d?.src).slice(0, MAX_DOODLES)
    const items = React.useMemo(
        () => uploaded.length
            ? uploaded.map((image, i) => ({ key: `upload-${i}`, image, svg: "" }))
            : doodles(ht).map(d => ({ key: d.label, image: undefined, svg: d.svg })),
        [ht, uploaded.map(d => d.src).join("|")]
    )
    const spots = React.useMemo(() => landingSpots(items.length), [items.length])

    // Scale the 600 × 680 stage to fit whatever size the frame is.
    const box = React.useRef<HTMLDivElement>(null)
    const [scale, setScale] = React.useState(1)
    React.useLayoutEffect(() => {
        const el = box.current
        if (!el) return
        const fit = () => setScale(Math.min(el.clientWidth / W, el.clientHeight / H) || 1)
        fit()
        const ro = new ResizeObserver(fit)
        ro.observe(el)
        return () => ro.disconnect()
    }, [])

    // Rim geometry in head-box pixels, derived from the percentages in the property controls.
    const s = HEAD.size
    const rim = { cx: (rimCenter / 100) * s, cy: (cut / 100) * s, rx: (rimWidth / 200) * s, ry: s * 0.047 }
    const origin = { x: HEAD.x + rim.cx, y: HEAD.y + rim.cy }
    const state = open ? "open" : "closed"
    const src = portrait?.src

    const headBox: React.CSSProperties = { position: "absolute", left: HEAD.x, top: HEAD.y, width: s, height: s }
    const img: React.CSSProperties = { position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", userSelect: "none" }
    const rimShape = (cls: string) => (
        <svg viewBox={`0 0 ${s} ${s}`} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", overflow: "visible" }} aria-hidden>
            <motion.g
                key={cls}
                style={{ transformBox: "fill-box", originX: 0.5, originY: 0.5 }}
                variants={{
                    closed: { scaleY: 0, transition: { delay: 0.76, duration: 0.14 } },
                    open: { scaleY: 1, transition: { delay: 0.11, duration: 0.26 } },
                }}
            >
                <ellipse cx={rim.cx} cy={rim.cy} rx={rim.rx} ry={rim.ry} fill="#fff" />
                <ellipse cx={rim.cx} cy={rim.cy} rx={rim.rx} ry={rim.ry} fill={htd} stroke={ink} strokeWidth={5} />
            </motion.g>
        </svg>
    )

    return (
        <MotionConfig reducedMotion="user">
            <div ref={box} style={{ ...style, position: "relative", width: "100%", height: "100%", overflow: "hidden" }}>
                <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden>
                    <defs>
                        <pattern id={`${uid}-ht`} width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                            <circle cx="2.5" cy="2.5" r="1.2" fill={ink} />
                        </pattern>
                        <pattern id={`${uid}-htd`} width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                            <circle cx="2.5" cy="2.5" r="1.9" fill={ink} />
                        </pattern>
                    </defs>
                </svg>

                <motion.div
                    initial={false}
                    animate={state}
                    style={{
                        position: "absolute", width: W, height: H,
                        left: "50%", top: "50%", marginLeft: -W / 2, marginTop: -H / 2, scale,
                    }}
                >
                    {/* Bottom of the head, below the cut line */}
                    <motion.div
                        style={{ ...headBox, zIndex: 1, originY: 1 }}
                        variants={{
                            closed: { scaleY: [1, 0.96, 1], transition: { delay: 0.85, duration: 0.26 } },
                            open: { scaleY: [1, 0.95, 1.02, 1], transition: { duration: 0.65, times: [0, 0.2, 0.45, 1] } },
                        }}
                    >
                        {/* With an open portrait set, the face crossfades to it while the lid is up */}
                        {src && (
                            <motion.img
                                src={src} srcSet={portrait?.srcSet} alt=""
                                style={{ ...img, clipPath: `inset(${cut}% 0 0 0)` }}
                                variants={openPortrait?.src ? {
                                    closed: { opacity: 1, transition: { delay: 0.8, duration: 0.15 } },
                                    open: { opacity: 0, transition: { delay: 0.1, duration: 0.15 } },
                                } : undefined}
                            />
                        )}
                        {openPortrait?.src && (
                            <motion.img
                                src={openPortrait.src} srcSet={openPortrait.srcSet} alt=""
                                style={{ ...img, clipPath: `inset(${cut}% 0 0 0)` }}
                                variants={{
                                    closed: { opacity: 0, transition: { delay: 0.8, duration: 0.15 } },
                                    open: { opacity: 1, transition: { delay: 0.1, duration: 0.15 } },
                                }}
                            />
                        )}
                    </motion.div>

                    {/* The opening at the top of the head */}
                    <div style={{ ...headBox, zIndex: 2, pointerEvents: "none" }}>{rimShape("rim")}</div>

                    {/* Speed lines */}
                    <svg viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0, zIndex: 2, pointerEvents: "none" }} aria-hidden>
                        {SPEED_LINES.map((d, i) => (
                            <motion.path
                                key={d} d={d} fill="none" stroke={ink} strokeWidth={4} strokeLinecap="round"
                                variants={{
                                    closed: { pathLength: 0, opacity: 0, transition: { duration: 0.2 } },
                                    open: { pathLength: 1, opacity: 1, transition: { delay: 0.52 + i * 0.06, duration: 0.35 } },
                                }}
                            />
                        ))}
                    </svg>

                    {/* Confetti */}
                    {BITS.map(([x, y, r], i) => (
                        <motion.div
                            key={i} aria-hidden
                            style={{ position: "absolute", left: x - 10, top: y - 10, width: 20, height: 20, zIndex: 3, pointerEvents: "none" }}
                            variants={{
                                closed: { opacity: 0, transition: { duration: 0.2 } },
                                open: {
                                    opacity: [0, 1], x: [origin.x - x, 0], y: [origin.y - y, 0], scale: [0.2, 1], rotate: [0, r],
                                    transition: { delay: 0.2 + i * 0.025, duration: 0.8, ease: [0.15, 0.85, 0.3, 1.1] },
                                },
                            }}
                        >
                            <svg viewBox="0 0 20 20" fill="none" stroke={ink} strokeLinecap="round" strokeLinejoin="round"
                                style={{ width: "100%", height: "100%", overflow: "visible" }}
                                dangerouslySetInnerHTML={{ __html: BIT_SHAPES[i % BIT_SHAPES.length] }} />
                        </motion.div>
                    ))}

                    {/* Doodles */}
                    {items.map((d, i) => {
                        const { x, y, r, size } = spots[i]
                        const dx = origin.x - x, dy = origin.y - y
                        return (
                            <motion.div
                                key={d.key} aria-hidden
                                style={{
                                    position: "absolute", left: x - size / 2, top: y - size / 2,
                                    width: size, height: size, zIndex: 3, pointerEvents: "none",
                                }}
                                variants={{
                                    closed: {
                                        x: dx, y: dy, scale: 0.3, rotate: 0, opacity: 0,
                                        transition: { delay: i * 0.03, duration: 0.38, ease: [0.55, 0, 0.75, 0.3] },
                                    },
                                    open: {
                                        x: [dx, dx * 0.85, dx * 0.1, 0], y: [dy, dy * 0.85, -24, 0],
                                        scale: [0.3, 0.45, 1.06, 1], rotate: [0, 0, r, r], opacity: [0, 1, 1, 1],
                                        transition: { delay: 0.22 + i * 0.07, duration: 0.9, times: [0, 0.15, 0.7, 1], ease: [0.2, 0.8, 0.2, 1] },
                                    },
                                }}
                            >
                                {/* Gentle float once landed */}
                                <motion.div
                                    style={{ width: "100%", height: "100%" }}
                                    animate={open && !reduced
                                        ? { y: -7, transition: { delay: 1.2 + i * 0.07, duration: 1.5 + i * 0.17, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" } }
                                        : { y: 0, transition: { duration: 0.2 } }}
                                >
                                    {d.image ? (
                                        <img
                                            src={d.image.src} srcSet={d.image.srcSet} alt="" draggable={false}
                                            style={{ width: "100%", height: "100%", objectFit: "contain", userSelect: "none" }}
                                        />
                                    ) : (
                                        <svg viewBox="0 0 120 120" fill="none" stroke={ink} strokeWidth={5}
                                            strokeLinecap="round" strokeLinejoin="round"
                                            style={{ width: "100%", height: "100%", overflow: "visible" }}
                                            dangerouslySetInnerHTML={{ __html: d.svg.replaceAll("#111", ink) }} />
                                    )}
                                </motion.div>
                            </motion.div>
                        )
                    })}

                    {/* The lid: top of the head above the cut line, with its underside */}
                    <motion.div
                        style={{ ...headBox, zIndex: 4, pointerEvents: "none", originX: rimCenter / 100, originY: cut / 100 }}
                        variants={{
                            closed: { x: 0, y: 0, rotate: 0, transition: { delay: 0.38, duration: 0.48, ease: [0.6, 0, 0.4, 1] } },
                            open: {
                                x: [0, 0, -8, -6], y: [0, 6, -296, -272], rotate: [0, 0, -13, -10],
                                transition: { duration: 1, times: [0, 0.12, 0.68, 1], ease: [0.3, 0.6, 0.3, 1] },
                            },
                        }}
                    >
                        {rimShape("underside")}
                        {/* Overlap the bottom piece by a hair so no seam shows when closed */}
                        {src && <img src={src} srcSet={portrait?.srcSet} alt="" style={{ ...img, clipPath: `inset(0 0 calc(${100 - cut}% - 1.5px) 0)` }} />}
                    </motion.div>

                    {/* Click target */}
                    <button
                        type="button"
                        onClick={() => setOpen(o => !o)}
                        aria-expanded={open}
                        aria-label={open ? "Close my head" : portrait?.alt ? `${portrait.alt}. Open to see what is on my mind` : "Open my head to see what is on my mind"}
                        style={{ ...headBox, zIndex: 5, padding: 0, border: 0, background: "none", cursor: "pointer", borderRadius: "50%" }}
                    />

                    {/* Hint bubble */}
                    {hint && (
                        <motion.div
                            aria-hidden
                            style={{
                                position: "absolute", left: origin.x, top: HEAD.y + 14, zIndex: 6, pointerEvents: "none",
                                translateX: "-50%", translateY: "-100%",
                            }}
                            variants={{ closed: { opacity: 1, transition: { delay: 1 } }, open: { opacity: 0, transition: { duration: 0.15 } } }}
                        >
                            <motion.div
                                animate={reduced ? { y: 0 } : { y: [0, -6, 0] }}
                                transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                                style={{
                                    position: "relative", background: ink, color: "#fff", padding: "8px 12px", borderRadius: 4,
                                    font: "700 12px/1.2 system-ui, sans-serif", letterSpacing: "0.08em", textTransform: "uppercase", whiteSpace: "nowrap",
                                }}
                            >
                                {hint}
                                <span style={{
                                    position: "absolute", left: "50%", bottom: -7, marginLeft: -7,
                                    borderLeft: "7px solid transparent", borderRight: "7px solid transparent", borderTop: `7px solid ${ink}`,
                                }} />
                            </motion.div>
                        </motion.div>
                    )}
                </motion.div>
            </div>
        </MotionConfig>
    )
}

addPropertyControls(HeadLidLift, {
    portrait: { type: ControlType.ResponsiveImage, title: "Portrait" },
    openPortrait: { type: ControlType.ResponsiveImage, title: "Open portrait" },
    doodleImages: {
        type: ControlType.Array, title: "Doodles", maxCount: MAX_DOODLES,
        control: { type: ControlType.ResponsiveImage },
    },
    hint: { type: ControlType.String, title: "Hint", defaultValue: "Pop the lid" },
    cut: { type: ControlType.Number, title: "Cut line %", defaultValue: 30, min: 10, max: 60, step: 0.5, unit: "%" },
    rimCenter: { type: ControlType.Number, title: "Rim center %", defaultValue: 53.3, min: 20, max: 80, step: 0.1, unit: "%" },
    rimWidth: { type: ControlType.Number, title: "Rim width %", defaultValue: 58.4, min: 20, max: 90, step: 0.1, unit: "%" },
    ink: { type: ControlType.Color, title: "Ink", defaultValue: "#111111" },
})
