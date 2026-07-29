"""Breaching-whale sprite generator -- source of truth for the footer sprite.

Regenerate public/whale-breach-sheet.png with:
    python3 scripts/whale-sprite.py --sheet
Run without arguments to print the frames as ASCII. Not wired into the build:
the PNG is committed, this only exists so the art stays editable.

A whole humpback launches out of the water nose-first, arcs over, and dives
back in. The arc is ballistic and the body is drawn tangent to it, so the
whale leaves steeply, goes flat at the apex and re-enters steeply -- the shape
a real breach makes. No water is drawn: the footer's wave band clips the
bottom rows, which is what sells the exit and the entry.
"""
import math
from PIL import Image, ImageDraw

W, H = 80, 64          # frame size
WATERLINE = 50         # rows at/below this are hidden by the footer wave
SS = 4                 # supersample factor for rotation

# --- palette -----------------------------------------------------------
# Greys nudged blue so the whale reads against the navy wave rather than
# muddying into it; the pale belly and flippers are the humpback tell.
BACK_HI = "#59626f"
BODY_MID = "#2e3540"
BODY_DARK = "#1b2028"
BELLY = "#aebdc8"
FIN_PALE = "#d2dfe7"
PALETTE = [BACK_HI, BODY_MID, BODY_DARK, BELLY, FIN_PALE]

LEN = 42.0             # nose-to-peduncle length, in frame pixels


def hex2rgb(h):
    return tuple(int(h[i:i + 2], 16) for i in (1, 3, 5))


# Upper and lower half-height profiles, sampled along the body from nose (0)
# to peduncle (1). Kept asymmetric: the head is blunter underneath and the
# back carries the dorsal hump.
# The blunt, rounded rostrum is the humpback tell -- taper it to a point and
# the silhouette reads as a dolphin instead.
UPPER = [(0.00, 1.8), (0.04, 3.1), (0.10, 4.2), (0.20, 5.1), (0.32, 5.4),
         (0.45, 5.0), (0.58, 4.4), (0.72, 3.2), (0.86, 1.9), (1.00, 1.0)]
LOWER = [(0.00, 1.8), (0.04, 3.6), (0.10, 4.9), (0.20, 5.8), (0.32, 6.0),
         (0.45, 5.0), (0.58, 3.9), (0.72, 2.6), (0.86, 1.5), (1.00, 0.9)]


def interp(table, t):
    for i in range(len(table) - 1):
        t0, v0 = table[i]
        t1, v1 = table[i + 1]
        if t0 <= t <= t1:
            k = (t - t0) / (t1 - t0)
            return v0 + (v1 - v0) * k
    return table[-1][1]


def spine(t):
    """Body centerline: a gentle arch, belly down."""
    return -LEN * t, -math.sin(t * math.pi) * 1.1


def body_polygon(n=60):
    up, lo = [], []
    for i in range(n + 1):
        t = i / n
        x, y = spine(t)
        u = interp(UPPER, t)
        d = interp(LOWER, t)
        # Dorsal hump: a low, rounded rise two-thirds back, humpback style.
        if 0.5 < t < 0.72:
            u += math.sin((t - 0.5) / 0.22 * math.pi) * 1.9
        up.append((x, y - u))
        lo.append((x, y + d))
    return up + lo[::-1]


def lobe(root, tip, bow, w_root, w_tip=0.5, n=18):
    """Tapered wedge swept along an arced centerline (used for the flukes)."""
    rx, ry = root
    tx, ty = tip
    spine_pts, half = [], []
    for i in range(n + 1):
        t = i / n
        x = rx + (tx - rx) * t
        y = ry + (ty - ry) * t - math.sin(t * math.pi) * bow
        spine_pts.append((x, y))
        half.append(w_root + (w_tip - w_root) * (t ** 1.7))
    up, lo = [], []
    for i, (x, y) in enumerate(spine_pts):
        j, k = min(i + 1, n), max(i - 1, 0)
        dx = spine_pts[j][0] - spine_pts[k][0]
        dy = spine_pts[j][1] - spine_pts[k][1]
        L = math.hypot(dx, dy) or 1.0
        nx, ny = -dy / L, dx / L
        up.append((x + nx * half[i], y + ny * half[i]))
        lo.append((x - nx * half[i], y - ny * half[i]))
    return up + lo[::-1]


TAIL_X, TAIL_Y = spine(1.0)
# Flukes spread back and out from the peduncle, seen near edge-on.
FLUKE_UP = lobe((TAIL_X, TAIL_Y), (TAIL_X - 8.5, TAIL_Y - 6.5), 0.9, 2.0)
FLUKE_DN = lobe((TAIL_X, TAIL_Y), (TAIL_X - 9.0, TAIL_Y + 5.5), -0.9, 2.1)
# The long humpback pectoral, thrown back and down from behind the head.
PX, PY = spine(0.26)
PECTORAL = lobe((PX, PY + 3.0), (PX - 9.0, PY + 12.0), -1.6, 2.2, 0.7)


# The arc anchors on the whale's mid-body. Putting that point at the exact
# centre of a square canvas means rotate() spins about it without expand=True,
# whose bounding-box recentring would otherwise decouple pose from position.
ANCHOR = spine(0.5)
HALF = 36


def draw_local():
    """Render the whale once, facing right (+x forward), anchor at centre."""
    side = HALF * 2 * SS
    ox, oy = side / 2 - ANCHOR[0] * SS, side / 2 - ANCHOR[1] * SS
    img = Image.new("RGBA", (side, side), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)

    def P(pts):
        return [(ox + x * SS, oy + y * SS) for x, y in pts]

    # Far flipper first so it sits behind the body.
    d.polygon(P([(x, y - 5.0) for x, y in PECTORAL]), fill=hex2rgb(BODY_DARK) + (255,))
    d.polygon(P(FLUKE_UP), fill=hex2rgb(BODY_MID) + (255,))
    d.polygon(P(FLUKE_DN), fill=hex2rgb(BODY_DARK) + (255,))

    body = body_polygon()
    d.polygon(P(body), fill=hex2rgb(BODY_MID) + (255,))

    # Pale belly: the lower profile pulled up a little and filled light.
    belly = []
    n = 60
    for i in range(n + 1):
        t = i / n
        x, y = spine(t)
        belly.append((x, y + interp(LOWER, t)))
    for i in range(n, -1, -1):
        t = i / n
        x, y = spine(t)
        belly.append((x, y + interp(LOWER, t) * 0.45))
    d.polygon(P(belly), fill=hex2rgb(BELLY) + (255,))

    # Ventral pleats: the throat grooves, as a few darker strokes.
    for k in range(5):
        t = 0.06 + k * 0.055
        x, y = spine(t)
        d.line(P([(x, y + interp(LOWER, t) * 0.5),
                  (x - 1.5, y + interp(LOWER, t) * 0.95)]),
               fill=hex2rgb(BODY_MID) + (255,), width=SS)

    # Rim light along the back.
    back = [(x, y) for x, y in body[:61]]
    d.line(P(back), fill=hex2rgb(BACK_HI) + (255,), width=int(SS * 1.4))

    # Near flipper on top of the body, pale like a real humpback's.
    d.polygon(P(PECTORAL), fill=hex2rgb(FIN_PALE) + (255,))

    # Eye.
    ex, ey = spine(0.13)
    d.ellipse(P([(ex - 0.9, ey + 0.4), (ex + 0.9, ey + 2.2)]),
              fill=hex2rgb(BODY_DARK) + (255,))
    return img


LOCAL = draw_local()

# --- the arc -----------------------------------------------------------
# Ballistic: constant horizontal speed, parabolic rise and fall. Tuned so the
# whale is fully under the waterline at both ends of the cycle.
X0, X1 = 12.0, 70.0
Y_BASE, APEX = 82.0, 58.0
N_FRAMES = 14


def arc(t):
    x = X0 + (X1 - X0) * t
    y = Y_BASE - APEX * 4 * t * (1 - t)
    dx = X1 - X0
    dy = -APEX * 4 * (1 - 2 * t)
    return x, y, math.degrees(math.atan2(dy, dx))


def snap(rgba):
    """Force downsampled pixels back onto the flat palette."""
    r, g, b, a = rgba
    if a < 110:
        return None
    best, bd = PALETTE[0], 1e9
    for h in PALETTE:
        pr, pg, pb = hex2rgb(h)
        dsq = (pr - r) ** 2 + (pg - g) ** 2 + (pb - b) ** 2
        if dsq < bd:
            bd, best = dsq, h
    return best


def frame_cells(i):
    t = i / (N_FRAMES - 1)
    cx, cy, ang = arc(t)
    # PIL rotates counter-clockwise; screen y grows downward, so negate.
    # No expand: the anchor is the canvas centre and stays put.
    rot = LOCAL.rotate(-ang, resample=Image.NEAREST)
    big = Image.new("RGBA", (W * SS, H * SS), (0, 0, 0, 0))
    big.alpha_composite(rot, (int(cx * SS - rot.width / 2),
                              int(cy * SS - rot.height / 2)))
    small = big.resize((W, H), Image.BOX)
    px = small.load()
    cells = {}
    for y in range(H):
        for x in range(W):
            c = snap(px[x, y])
            if c:
                cells[(x, y)] = c
    return cells


def runs(cells):
    """Collapse to horizontal same-color runs so pxcli draws in few calls."""
    out = []
    for y in range(H):
        x = 0
        while x < W:
            c = cells.get((x, y))
            if c is None:
                x += 1
                continue
            x2 = x
            while x2 + 1 < W and cells.get((x2 + 1, y)) == c:
                x2 += 1
            out.append((x, y, x2 - x + 1, c))
            x = x2 + 1
    return out


def build_sheet(path="public/whale-breach-sheet.png"):
    """One blank frame (the pause between breaches) then the fourteen of the
    leap, laid out left to right. The CSS steps through them by frame width."""
    n = N_FRAMES + 1
    sheet = Image.new("RGBA", (W * n, H), (0, 0, 0, 0))
    for i in range(N_FRAMES):
        px = sheet.load()
        for (x, y), c in frame_cells(i).items():
            px[(i + 1) * W + x, y] = hex2rgb(c) + (255,)
    sheet.save(path)
    print(f"{path}: {sheet.width}x{sheet.height}, {n} frames of {W}px")


if __name__ == "__main__":
    import sys
    if "--sheet" in sys.argv:
        build_sheet()
        raise SystemExit
    key = {BACK_HI: "o", BODY_MID: "#", BODY_DARK: "@", BELLY: "+",
           FIN_PALE: "%"}
    for i in range(N_FRAMES):
        cells = frame_cells(i)
        print("frame %d  angle=%.0f" % (i + 1, arc(i / (N_FRAMES - 1))[2]))
        for y in range(H):
            row = "".join(key.get(cells.get((x, y)), ".") for x in range(W))
            print(row if y < WATERLINE else row.replace(".", "~"),
                  "<-- waterline" if y == WATERLINE else "")
        print()
