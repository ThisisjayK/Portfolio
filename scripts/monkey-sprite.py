"""Monkey sprite generator -- source of truth for the two monkey sprites.

Regenerate public/monkey-*-sheet.png with:
    python3 scripts/monkey-sprite.py --sheets
Pass a pose name (hang, snack) to print its frames as ASCII instead. Not wired
into the build: the PNGs are committed, this only keeps the art editable.

Two loops sharing one rig.

  hang  -- hangs by its tail from a letter and waves hello
  snack -- sits on a box edge, legs swinging, eating a banana

Both are drawn from the same parts (head, muzzle, ears, torso, limbs, tail)
posed by parameters per frame, rather than hand-placed pixel by pixel. Shapes
are drawn supersampled and snapped back to a flat palette; the 1px details
(eyes, mouth, the HI) are stamped afterwards at final resolution, because
supersampling turns them to mush.
"""
import math
from PIL import Image, ImageDraw

SS = 4

# Warm brown reads on both themes (pink paper, green ink) without pulling
# toward either brand colour.
OUTLINE = "#2b1a0f"
FUR_DARK = "#5c3720"
FUR = "#8a5533"
BELLY = "#c08f5e"
FACE = "#dcae7d"
BANANA = "#f0c53f"
BANANA_DK = "#c2951c"
EYE = "#150c05"
WHITE = "#f6efe4"
# Deliberately short. FUR_DARK and BELLY were close enough to their
# neighbours that the downsample kept snapping between them and the parts
# came out muddy; four body tones is what this pixel budget supports.
PALETTE = [OUTLINE, FUR, FACE, BANANA, BANANA_DK, EYE, WHITE]


def hex2rgb(h):
    return tuple(int(h[i:i + 2], 16) for i in (1, 3, 5)) + (255,)


def rot(px, py, cx, cy, deg):
    a = math.radians(deg)
    c, s = math.cos(a), math.sin(a)
    dx, dy = px - cx, py - cy
    return cx + dx * c - dy * s, cy + dx * s + dy * c


class Rig:
    def __init__(self, w, h):
        self.w, self.h = w, h
        self.img = Image.new("RGBA", (w * SS, h * SS), (0, 0, 0, 0))
        self.d = ImageDraw.Draw(self.img)

    # Every part is drawn one pixel fatter in OUTLINE first, then filled. At
    # this size same-coloured parts otherwise merge into one silhouette and
    # the limbs vanish into the body.
    def disc(self, cx, cy, rx, ry, color, outline=True):
        if outline:
            self._ell(cx, cy, rx + 0.7, ry + 0.7, OUTLINE)
        self._ell(cx, cy, rx, ry, color)

    def _ell(self, cx, cy, rx, ry, color):
        self.d.ellipse([(cx - rx) * SS, (cy - ry) * SS,
                        (cx + rx) * SS, (cy + ry) * SS], fill=hex2rgb(color))

    def limb(self, pts, width, color, outline=True):
        if outline:
            self._stroke(pts, width + 1.0, OUTLINE)
        self._stroke(pts, width, color)

    def _stroke(self, pts, width, color):
        p = [(x * SS, y * SS) for x, y in pts]
        self.d.line(p, fill=hex2rgb(color), width=max(1, int(width * SS)),
                    joint="curve")
        # Round the ends so limbs read as tapered rather than chopped.
        r = width * SS / 2
        for x, y in (p[0], p[-1]):
            self.d.ellipse([x - r, y - r, x + r, y + r], fill=hex2rgb(color))

    def snap(self):
        """Downsample and force every pixel back onto the flat palette."""
        small = self.img.resize((self.w, self.h), Image.BOX)
        px = small.load()
        cells = {}
        for y in range(self.h):
            for x in range(self.w):
                r, g, b, a = px[x, y]
                if a < 110:
                    continue
                best, bd = PALETTE[0], 1e9
                for hx in PALETTE:
                    pr, pg, pb, _ = hex2rgb(hx)
                    ds = (pr - r) ** 2 + (pg - g) ** 2 + (pb - b) ** 2
                    if ds < bd:
                        bd, best = ds, hx
                cells[(x, y)] = best
        return cells


def curve(pts, n=24):
    """Quadratic-ish smoothing through a short list of control points."""
    out = []
    for i in range(n + 1):
        t = i / n * (len(pts) - 1)
        k = min(int(t), len(pts) - 2)
        f = t - k
        p0 = pts[max(k - 1, 0)]
        p1, p2 = pts[k], pts[k + 1]
        p3 = pts[min(k + 2, len(pts) - 1)]
        # Catmull-Rom
        x = 0.5 * ((2 * p1[0]) + (-p0[0] + p2[0]) * f +
                   (2 * p0[0] - 5 * p1[0] + 4 * p2[0] - p3[0]) * f * f +
                   (-p0[0] + 3 * p1[0] - 3 * p2[0] + p3[0]) * f ** 3)
        y = 0.5 * ((2 * p1[1]) + (-p0[1] + p2[1]) * f +
                   (2 * p0[1] - 5 * p1[1] + 4 * p2[1] - p3[1]) * f * f +
                   (-p0[1] + 3 * p1[1] - 3 * p2[1] + p3[1]) * f ** 3)
        out.append((x, y))
    return out


def face(cells, hx, hy, flip=False, mouth="smile", blink=False):
    """Stamp the 1px face details at final resolution."""
    ex = 2 if not flip else -2
    for dx in (-ex, ex):
        if blink:
            cells[(hx + dx, hy)] = EYE
            cells[(hx + dx - 1, hy)] = EYE
        else:
            cells[(hx + dx, hy - 1)] = EYE
            cells[(hx + dx, hy)] = EYE
            cells[(hx + dx + (1 if dx > 0 else -1), hy - 1)] = WHITE
    if mouth == "smile":
        for dx in (-1, 0, 1):
            cells[(hx + dx, hy + 3)] = OUTLINE
    elif mouth == "open":
        for dx in (-1, 0, 1):
            cells[(hx + dx, hy + 3)] = OUTLINE
            cells[(hx + dx, hy + 4)] = OUTLINE
    elif mouth == "chew":
        for dx in (-1, 0):
            cells[(hx + dx, hy + 3)] = OUTLINE


# 3x5 pixel glyphs, just enough for the greeting.
GLYPH = {
    "H": ["# #", "# #", "###", "# #", "# #"],
    "I": ["###", " # ", " # ", " # ", "###"],
    "!": [" # ", " # ", " # ", "   ", " # "],
}


def text(cells, x, y, s, color=OUTLINE):
    for ch in s:
        g = GLYPH.get(ch)
        if g:
            for r, line in enumerate(g):
                for c, v in enumerate(line):
                    if v == "#":
                        cells[(x + c, y + r)] = color
        x += 4


# ---------------------------------------------------------------- hang ----
# Hangs head-down from a letter. The tail is the topmost thing, hooked over
# the glyph; hips sit just under it and the body descends from there, which
# is the way a real tail-hang stacks up.
HANG_W, HANG_H = 32, 56
GRIP = (16.0, 4.0)          # the point that touches the letter
# The tail has to be longer than the glyph is tall, or the body hangs over the
# letter instead of below it. This drops everything from the hips down by a
# full x-height's worth of sprite pixels and lengthens the shaft to match.
TAIL_DROP = 16.0
HANG_FRAMES = 8


def hang_cells(i):
    t = i / HANG_FRAMES
    sway = math.sin(t * 2 * math.pi) * 5.0          # slow pendulum
    wave = math.sin(t * 2 * math.pi * 2)            # two waves per cycle

    r = Rig(HANG_W, HANG_H)
    gx, gy = GRIP

    def S(p):
        return rot(p[0], p[1], gx, gy, sway)

    D = TAIL_DROP
    hip = S((16, 15 + D))
    chest = S((16, 22 + D))
    head = S((16, 28.5 + D))
    sh_l = S((13.4, 22 + D))
    sh_r = S((18.6, 22 + D))

    # Tail: a thin shaft up out of the hips ending in a tight hook. The hook's
    # opening is where the letter's stroke passes through, so it has to stay
    # small -- a wide loop reads as a croquet hoop, not a tail.
    tail = curve([S((16, 15 + D)), S((15.4, 10 + D * 0.55)), S((15, 9)), (gx - 2.2, gy + 1.5),
                  (gx - 1.6, gy - 1.6), (gx + 1.8, gy - 1.4),
                  (gx + 2.2, gy + 1.8)])
    r.limb(tail, 1.6, FUR)

    # Legs hang down past the head, the way gravity actually leaves them on an
    # upside-down animal, and end up framing it. Tucking them up by the hips
    # instead just merged tail, hips and knees into one unreadable blob.
    for sx in (-1, 1):
        lag = math.sin(t * 2 * math.pi + sx * 0.6) * 0.8   # limbs trail the sway
        knee = S((16 + sx * 6.0 + lag, 21.5 + D))
        foot = S((16 + sx * 6.4 + lag * 1.6, 30.0 + D))
        r.limb([hip, knee, foot], 2.2, FUR)
        r.disc(foot[0], foot[1] + 0.4, 1.5, 1.3, FUR)

    r.limb([hip, chest], 5.0, FUR)                  # torso
    r.disc(*S((16, 19 + D)), 2.6, 3.0, FACE, outline=False)

    # Far arm hangs slack, behind the head.
    hand_r = S((20.4, 28 + D + wave * 0.6))
    r.limb([sh_r, S((20.6, 24.5 + D)), hand_r], 2.0, FUR)
    r.disc(hand_r[0], hand_r[1], 1.6, 1.5, FACE)

    # Head over the shoulders, smaller than the first pass: at 5px radius it
    # was swallowing the whole body.
    r.disc(head[0], head[1], 5.0, 4.6, FUR)
    for sx in (-1, 1):                              # ears
        e = S((16 + sx * 5.2, 27.2 + D))
        r.disc(e[0], e[1], 1.7, 1.7, FUR)
        r.disc(e[0], e[1], 0.8, 0.8, FACE, outline=False)
    r.disc(head[0], head[1] + 1.2, 3.3, 2.8, FACE, outline=False)  # muzzle

    # Waving arm drawn last, so it stays in front of the head instead of
    # disappearing behind it, and reaches clear of the silhouette.
    wx = 4.6 - wave * 1.6
    wy = 25.0 + D + abs(wave) * 1.4
    hand_l = S((wx, wy))
    r.limb([sh_l, S((10.0, 24.5 + D)), hand_l], 2.0, FUR)
    r.disc(hand_l[0], hand_l[1], 1.8, 1.7, FACE)

    cells = r.snap()
    hx, hy = int(round(head[0])), int(round(head[1]))
    face(cells, hx, hy - 1, mouth="smile", blink=(i == 5))
    # The greeting pops while the hand is up and out.
    if wave < -0.3:
        text(cells, max(0, int(round(wx)) - 5), int(round(wy)) - 9, "HI")
    return cells


# --------------------------------------------------------------- snack ----
# Sits on a horizontal edge: hips on the line, legs swinging underneath.
SNACK_W, SNACK_H = 34, 40
SEAT_Y = 18                  # the row the box's bottom border runs along
SNACK_FRAMES = 8


def snack_cells(i):
    t = i / SNACK_FRAMES
    swing = math.sin(t * 2 * math.pi) * 13.0        # legs kick back and forth
    # Banana comes up to the mouth twice a cycle.
    bite = max(0.0, math.sin(t * 2 * math.pi * 2))
    chewing = bite > 0.75

    r = Rig(SNACK_W, SNACK_H)
    hip = (16.0, SEAT_Y - 1.0)
    chest = (16.0, SEAT_Y - 8.0)
    head = (16.0, SEAT_Y - 13.5)

    # Tail curls out behind and down over the edge.
    r.limb(curve([(19, SEAT_Y - 2), (23, SEAT_Y - 1), (25.5, SEAT_Y + 3),
                  (23.5, SEAT_Y + 6), (21, SEAT_Y + 5)]), 2.0, FUR)

    # Legs dangle below the line and swing about the hip.
    for n, sx in enumerate((-1, 1)):
        ph = swing * (1.0 if n == 0 else 0.78)      # slight offset, less stiff
        knee = rot(16 + sx * 2.6, SEAT_Y + 6, *hip, ph)
        foot = rot(16 + sx * 3.2, SEAT_Y + 12, *hip, ph)
        r.limb([hip, knee, foot], 2.8, FUR)
        r.disc(foot[0], foot[1] + 0.6, 2.0, 1.5, FUR)

    r.limb([hip, chest], 5.6, FUR)                  # torso
    r.disc(16, SEAT_Y - 5, 3.2, 3.8, FACE, outline=False)

    # Both arms bring the banana up; the far arm rests on the knee.
    r.limb([(12.6, chest[1] + 1), (10.5, chest[1] + 4), (11.5, SEAT_Y + 1)],
           2.2, FUR)

    # The banana's bitten end has to land on the mouth (roughly 17, 7) at full
    # lift. Aiming it at the head centre instead just dragged it across the
    # eyes on the way up.
    by = head[1] + 6.5 - bite * 7.2                 # banana height
    bx = 22.5 - bite * 4.5
    r.limb([(19.4, chest[1] + 1), (21, chest[1] + 2.5), (bx + 1.2, by + 1.5)],
           2.2, FUR)

    r.disc(head[0], head[1], 6.0, 5.4, FUR)
    for sx in (-1, 1):
        r.disc(16 + sx * 6.2, head[1] - 0.5, 2.0, 2.0, FUR)
        r.disc(16 + sx * 6.2, head[1] - 0.5, 1.0, 1.0, FACE, outline=False)
    r.disc(head[0], head[1] + 1.4, 3.9, 3.3, FACE, outline=False)

    # Banana: a curved wedge, drawn over the hand.
    ban = curve([(bx, by + 3.2), (bx + 1.6, by + 0.6), (bx + 3.6, by - 1.0),
                 (bx + 5.4, by - 1.2)])
    r.limb(ban, 2.4, BANANA)
    r.limb(ban[-6:], 1.6, BANANA_DK, outline=False)
    r.disc(bx, by + 3.4, 1.0, 1.0, BANANA_DK, outline=False)

    cells = r.snap()
    hx, hy = int(round(head[0])), int(round(head[1]))
    face(cells, hx, hy - 1, mouth="open" if chewing else "chew",
         blink=chewing)
    return cells


POSES = {
    "hang": (HANG_W, HANG_H, HANG_FRAMES, hang_cells),
    "snack": (SNACK_W, SNACK_H, SNACK_FRAMES, snack_cells),
}

KEY = {OUTLINE: "@", FUR_DARK: "%", FUR: "#", BELLY: "+", FACE: "o",
       BANANA: "*", BANANA_DK: "=", EYE: "8", WHITE: "."}


def build_sheets(out="public"):
    """Write one horizontal sheet per pose. The CSS steps through by frame."""
    for name, (w, h, n, fn) in POSES.items():
        sheet = Image.new("RGBA", (w * n, h), (0, 0, 0, 0))
        px = sheet.load()
        for i in range(n):
            for (x, y), c in fn(i).items():
                if 0 <= x < w and 0 <= y < h:
                    px[i * w + x, y] = hex2rgb(c)
        path = f"{out}/monkey-{name}-sheet.png"
        sheet.save(path)
        print(f"{path}: {sheet.width}x{sheet.height}, {n} frames of {w}x{h}")


if __name__ == "__main__":
    import sys
    if "--sheets" in sys.argv:
        build_sheets()
        raise SystemExit
    which = sys.argv[1] if len(sys.argv) > 1 else "hang"
    w, h, n, fn = POSES[which]
    for i in range(n):
        print("%s frame %d" % (which, i + 1))
        cells = fn(i)
        for y in range(h):
            print("".join(KEY.get(cells.get((x, y)), ".") if (x, y) in cells
                          else " " for x in range(w)))
        print()

