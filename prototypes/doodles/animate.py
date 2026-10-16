#!/usr/bin/env python3
"""Animate the portfolio doodles.

Reads source/<name>.png and writes, for each doodle, into out/:
  <name>.webp         animated WebP, smooth transparent edges (use this on the site)
  <name>.gif          animated GIF, hard-edged transparency (alpha cut at 50%)
  <name>-sprite.png   sprite sheet, frames left to right then top to bottom
  <name>.json         frame size, frame count, columns and fps for the sprite sheet

The sources are flat images, so nothing here moves real layers. Rotations resample pixels,
the bends and wiggles are smooth local warps, the blink paints eyelids over the eyes, and
the cannon's wheel is redrawn as vector shapes so it can spin without dragging the barrel
behind it round too. Coordinates below are pixels in the source PNGs.

Needs Pillow and numpy:  python3 animate.py [name ...]
"""
import json
import math
import sys
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFilter

HERE = Path(__file__).resolve().parent
SRC, OUT = HERE / "source", HERE / "out"
SIZE = 192        # output frames are SIZE × SIZE: 2× the 96 px doodle slot, for retina screens
FPS = 25
TAU = 2 * math.pi


# ---------- image helpers (frames are float32, premultiplied RGBA, 0..1) ----------

def load(name, pad, clear=()):
    """Source image on a transparent canvas with `pad` px of room on every side for motion."""
    a = np.asarray(Image.open(SRC / f"{name}.png").convert("RGBA"), np.float32) / 255
    a = a.copy()
    for x0, y0, x1, y1 in clear:          # erase slivers of neighbouring stickers
        a[y0:y1, x0:x1] = 0
    h, w = a.shape[:2]
    img = np.zeros((h + 2 * pad, w + 2 * pad, 4), np.float32)
    img[pad:pad + h, pad:pad + w] = a
    img[..., :3] *= img[..., 3:4]
    return img


def grid(img):
    h, w = img.shape[:2]
    y, x = np.mgrid[0:h, 0:w].astype(np.float32)
    return x, y


def sample(img, sx, sy):
    """Bilinear lookup of img at (sx, sy); outside the image is transparent."""
    h, w = img.shape[:2]
    x0, y0 = np.floor(sx).astype(int), np.floor(sy).astype(int)
    fx, fy = (sx - x0)[..., None], (sy - y0)[..., None]

    def px(x, y):
        ok = ((x >= 0) & (x < w) & (y >= 0) & (y < h))[..., None]
        return img[np.clip(y, 0, h - 1), np.clip(x, 0, w - 1)] * ok

    return (px(x0, y0) * (1 - fx) * (1 - fy) + px(x0 + 1, y0) * fx * (1 - fy)
            + px(x0, y0 + 1) * (1 - fx) * fy + px(x0 + 1, y0 + 1) * fx * fy)


def smooth(e0, e1, v):
    t = np.clip((v - e0) / (e1 - e0), 0, 1)
    return t * t * (3 - 2 * t)


def rotate_about(x, y, px, py, phi):
    """Source coords for rotating by phi (radians, counter-clockwise on screen) about (px, py).
    `phi` may be an array, which is how the ears bend instead of rotating rigidly."""
    dx, dy = x - px, y - py
    c, s = np.cos(phi), np.sin(phi)
    return px + dx * c - dy * s, py + dx * s + dy * c


def polygon_weight(shape, points, blur, pad):
    """Soft 0..1 mask from a polygon in source coords, feathered by `blur` px."""
    h, w = shape[:2]
    m = Image.new("L", (w, h), 0)
    ImageDraw.Draw(m).polygon([(x + pad, y + pad) for x, y in points], fill=255)
    return np.asarray(m.filter(ImageFilter.GaussianBlur(blur)), np.float32) / 255


def median_colour(img, mask):
    a = img[..., 3]
    sel = mask & (a > 0.9)
    return np.median(img[sel][:, :3] / a[sel][:, None], axis=0)


def paint(frame, coverage, rgb):
    """Composite a flat colour over the frame with antialiased coverage (0..1)."""
    c = coverage[..., None]
    frame[..., :3] = frame[..., :3] * (1 - c) + np.asarray(rgb, np.float32) * c
    frame[..., 3:] = frame[..., 3:] * (1 - c) + c
    return frame


# ---------- the eight animations ----------

def cannon(n=10):
    """Wheel spins clockwise forever: 60° per loop, and the six spokes make that seamless."""
    pad = 12
    img = load("cannon", pad)
    cx, cy = 206 + pad, 111 + pad
    a = img[..., 3]
    rgb = img[..., :3] / np.maximum(a, 1e-6)[..., None]
    red = median_colour(img, (rgb[..., 0] > 0.6) & (rgb[..., 1] < 0.35))
    ink = median_colour(img, rgb.max(-1) < 0.25)
    to8 = lambda c: tuple(int(round(v * 255)) for v in c) + (255,)
    RED, INK = to8(red), to8(ink)

    K, R = 4, 110                       # supersampling factor, patch radius
    S, c = 2 * R * K, R * K
    P = lambda x, y: ((x - 206) * K + c, (y - 111) * K + c)   # source px → patch px

    # What sits behind the wheel and shows through the gaps: the barrel across the top and
    # the trail coming in from the lower left, both red with an ink outline. Edges that end
    # up inside the red (or under the hub) are hidden, so plain lines along each edge do.
    lb = lambda x: 95 + (x - 98) * 10 / 179          # barrel's lower edge
    trail_top, trail_bottom = [(60, 126.2), (205, 95)], [(60, 192.8), (205, 125)]
    behind = Image.new("L", (S, S), 0)
    d = ImageDraw.Draw(behind)
    d.polygon([P(60, -20), P(360, -20), P(360, lb(360)), P(60, lb(60))], fill=255)
    d.polygon([P(*trail_top[0]), P(*trail_top[1]), P(*trail_bottom[1]), P(*trail_bottom[0])], fill=255)
    edge = Image.new("L", (S, S), 0)
    d = ImageDraw.Draw(edge)
    for a, b in ([(60, lb(60)), (360, lb(360))], trail_top, trail_bottom):
        d.line([P(*a), P(*b)], fill=255, width=7 * K)

    def spoke(d, ang, extra, fill):
        """Spoke from the hub to under the rim. `extra` widens it (for the ink outline)."""
        hw = lambda r: 8 + extra
        t = math.radians(ang)
        ux, uy = math.cos(t), -math.sin(t)
        nx, ny = -uy, ux
        pts = []
        for r, side in ((0, 1), (78, 1), (78, -1), (0, -1)):
            w = hw(r) * side
            pts.append((c + (r * ux + w * nx) * K, c + (r * uy + w * ny) * K))
        d.polygon(pts, fill=fill)

    def disc(d, r, fill):
        d.ellipse([c - r * K, c - r * K, c + r * K, c + r * K], fill=fill)

    def ring(d, r, width, fill):
        d.ellipse([c - r * K, c - r * K, c + r * K, c + r * K], outline=fill, width=int(width * K))

    clip = Image.new("L", (S, S), 0)
    disc(ImageDraw.Draw(clip), 76, 255)

    x, y = grid(img)
    keep = (np.hypot(x - cx, y - cy) > 103).astype(np.float32)[..., None]
    frames = []
    for i in range(n):
        theta = -60 * i / n
        layer = Image.new("RGBA", (S, S), (0, 0, 0, 0))
        layer.paste(Image.new("RGBA", (S, S), RED), mask=ImageChops_multiply(behind, clip))
        layer.paste(Image.new("RGBA", (S, S), INK), mask=ImageChops_multiply(edge, clip))
        d = ImageDraw.Draw(layer)
        for k in range(6):
            spoke(d, theta + 90 + 60 * k, 7, INK)
        disc(d, 45, INK)                 # also forms the inner edge of each gap
        for k in range(6):
            spoke(d, theta + 90 + 60 * k, 0, RED)
        disc(d, 28.5, RED)
        disc(d, 12.5, INK)
        disc(d, 7.5, RED)
        ring(d, 81, 7.5, INK)
        ring(d, 98, 17, RED)
        ring(d, 106, 8.5, INK)
        wheel = layer.convert("RGBa").resize((2 * R, 2 * R), Image.LANCZOS)
        w = np.asarray(wheel, np.float32) / 255
        f = img * keep
        y0, x0 = int(cy - R), int(cx - R)
        region = f[y0:y0 + 2 * R, x0:x0 + 2 * R]
        f[y0:y0 + 2 * R, x0:x0 + 2 * R] = w + region * (1 - w[..., 3:4])
        frames.append(f)
    return frames


def ImageChops_multiply(a, b):
    return Image.fromarray((np.asarray(a, np.uint16) * np.asarray(b, np.uint16) // 255).astype(np.uint8))


def plant(n=50):
    """Leaves sway on a slow beat with a quicker rustle on top. The pot stays put."""
    pad = 24
    img = load("plant", pad, clear=[(0, 0, 329, 8)])
    x, y = grid(img)
    sy_ = y - pad
    w = np.clip((195 - sy_) / 195, 0, 1) ** 1.3
    frames = []
    for i in range(n):
        t = i / n
        dx = w * (7 * math.sin(TAU * t) + 2.5 * np.sin(TAU * 3 * t + (x - pad) / 25))
        dy = w * 1.5 * np.sin(TAU * 3 * t + (x - pad) / 30)
        frames.append(sample(img, x - dx, y - dy))
    return frames


def controller(n=30):
    """The right thumbstick circles in its well (squashed into an ellipse for the perspective)."""
    pad = 12
    img = load("controller", pad)
    x, y = grid(img)
    cx, cy, rx, ry = 255 + pad, 63 + pad, 27, 11.5
    r = np.hypot((x - cx) / rx, (y - cy) / ry)
    w = 1 - smooth(0.8, 1.35, r)
    frames = []
    for i in range(n):
        t = i / n
        dx, dy = 8 * math.cos(TAU * t), 3 * math.sin(TAU * t)
        frames.append(sample(img, x - dx * w, y - dy * w))
    return frames


def sneaker(n=30):
    """No motion was specified for this one: a small hop with a squash on take-off and landing."""
    pad = 20
    top = 60
    img = load("sneaker", pad)
    img = np.concatenate([np.zeros((top, img.shape[1], 4), np.float32), img])
    x, y = grid(img)
    bx, by = 230 + pad, 241 + pad + top          # bottom centre of the sole
    frames = []
    for i in range(n):
        t = i / n
        air = min(max((t - 0.15) / 0.7, 0), 1)
        lift = 42 * math.sin(math.pi * air)
        if t < 0.15:
            sq = 0.09 * math.sin(math.pi * t / 0.15)
        elif t > 0.85:
            sq = 0.09 * math.sin(math.pi * (t - 0.85) / 0.15)
        else:
            sq = 0
        sx_, sy_ = 1 + sq * 0.6, 1 - sq
        phi = math.radians(7 * math.sin(math.pi * air))   # toe tips up mid-air
        # inverse of: scale about the sole, rotate about the sole, lift
        ux, uy = x - bx, y - (by - lift)
        c, s = math.cos(phi), math.sin(phi)
        rx_, ry_ = ux * c - uy * s, ux * s + uy * c
        frames.append(sample(img, bx + rx_ / sx_, by + ry_ / sy_))
    return frames


def dog(n=60):
    """Two ear twitches and one blink per loop."""
    pad = 16
    img = load("dog", pad, clear=[(0, 290, 314, 301)])
    x, y = grid(img)
    left_ear = [(0, 42), (28, 14), (62, 6), (92, 18), (90, 45), (72, 80), (58, 100), (38, 100), (12, 72)]
    right_ear = [(320 - px, py) for px, py in left_ear]
    wl = polygon_weight(img.shape, left_ear, 5, pad)
    wr = polygon_weight(img.shape, right_ear, 5, pad)
    piv_l, piv_r = (85 + pad, 20 + pad), (235 + pad, 20 + pad)

    eyes = [(114.5 + pad, 80 + pad, 14.5, 12.5), (205 + pad, 80 + pad, 14, 12.5)]
    fur = [median_colour(img, (np.abs(x - ex) < rx) & (y > ey - ry - 7) & (y < ey - ry - 2)) for ex, ey, rx, ry in eyes]
    lash = (0.13, 0.10, 0.10)
    blink = {40: 0.4, 41: 0.85, 42: 1, 43: 1, 44: 0.85, 45: 0.4}

    def twitch(t):
        out = 0.0
        for t0 in (0.05, 0.55):
            u = (t - t0) / 0.3
            if 0 <= u <= 1:
                out += math.sin(2 * TAU * u) * math.sin(math.pi * u)
        return math.radians(12) * out

    K = 4
    h, w = img.shape[:2]
    frames = []
    for i in range(n):
        t = i / n
        a = twitch(t)
        sx, sy = rotate_about(x, y, *piv_l, a * wl)
        sx, sy = rotate_about(sx, sy, *piv_r, -a * wr)
        f = sample(img, sx, sy)
        closure = blink.get(round(i * 60 / n), 0)
        if closure:
            for (ex, ey, rx, ry), col in zip(eyes, fur):
                lid = Image.new("L", (w * K, h * K), 0)
                line = Image.new("L", (w * K, h * K), 0)
                dl, dn = ImageDraw.Draw(lid), ImageDraw.Draw(line)
                rx2, ry2 = rx + 2, ry + 2
                edge_y = ey - ry2 + closure * 2 * ry2
                dl.ellipse([(ex - rx2) * K, (ey - ry2) * K, (ex + rx2) * K, (ey + ry2) * K], fill=255)
                dl.rectangle([0, edge_y * K, w * K, h * K], fill=0)
                if closure >= 1:      # closed: a soft upturned line, like the dog is smiling
                    pts = [((ex + u * rx) * K, (ey + 2 - 3 * (1 - u * u)) * K) for u in np.linspace(-1, 1, 24)]
                else:
                    half = rx2 * math.sqrt(max(0, 1 - ((edge_y - ey) / ry2) ** 2))
                    pts = [((ex - half) * K, edge_y * K), ((ex + half) * K, edge_y * K)]
                dn.line(pts, fill=255, width=int(2.8 * K), joint="curve")
                down = lambda m: np.asarray(m.resize((w, h), Image.BOX), np.float32) / 255
                f = paint(f, down(lid), col)
                f = paint(f, down(line), lash)
        frames.append(f)
    return frames


def football(n=48):
    """Full turn per loop, clockwise."""
    pad = 10
    img = load("football", pad)
    x, y = grid(img)
    cx, cy = 141.5 + pad, 140.5 + pad
    return [sample(img, *rotate_about(x, y, cx, cy, -TAU * i / n)) for i in range(n)]


def ramen(n=40):
    """Chopsticks lift the noodles out of the bowl and lower them back; the strands stretch."""
    pad = 28                     # headroom: the chopsticks rise 18 px
    img = load("ramen", pad)
    x, y = grid(img)
    X, Y = x - pad, y - pad
    zone = smooth(10, 25, X) * (1 - smooth(210, 228, X))
    zone *= 1 - (1 - smooth(60, 68, X)) * smooth(96, 104, Y)      # leave the left sparkle alone
    w = zone * np.clip((165 - Y) / 70, 0, 1)
    frames = []
    for i in range(n):
        u = 18 * (1 - math.cos(TAU * i / n)) / 2
        frames.append(sample(img, x, y + u * w))
    return frames


def owl(n=50):
    """Bends side to side from the perch up; the feet and base stay still."""
    pad = 24
    img = load("owl", pad)
    x, y = grid(img)
    w = np.clip((275 - (y - pad)) / 258, 0, 1) ** 1.7
    frames = []
    for i in range(n):
        dx = 26 * math.sin(TAU * i / n) * w
        frames.append(sample(img, x - dx, y))
    return frames


def strawhat(n=40):
    """The Jolly Roger rocks gently side to side, like a flag in a light breeze."""
    pad = 40
    img = load("strawhat", pad)
    x, y = grid(img)
    cx, cy = 170 + pad, 200 + pad                 # centre of the skull
    return [sample(img, *rotate_about(x, y, cx, cy, math.radians(7) * math.sin(TAU * i / n)))
            for i in range(n)]


ANIMATIONS = {f.__name__: f for f in (cannon, plant, controller, sneaker, dog, football, ramen, owl, strawhat)}


# ---------- export ----------

def export(name, frames):
    alpha = np.max([f[..., 3] for f in frames], axis=0)
    ys, xs = np.nonzero(alpha > 0.02)
    H, W = alpha.shape
    if xs.min() == 0 or ys.min() == 0 or xs.max() == W - 1 or ys.max() == H - 1:
        print(f"WARNING {name}: motion reaches the canvas edge and is being clipped; raise its pad")
    x0, x1 = max(xs.min() - 2, 0), min(xs.max() + 3, W)
    y0, y1 = max(ys.min() - 2, 0), min(ys.max() + 3, H)
    scale = min((SIZE - 8) / (x1 - x0), (SIZE - 8) / (y1 - y0))
    w, h = round((x1 - x0) * scale), round((y1 - y0) * scale)
    out = []
    for f in frames:
        crop = (np.clip(f[y0:y1, x0:x1], 0, 1) * 255 + 0.5).astype(np.uint8)
        im = Image.frombytes("RGBa", (crop.shape[1], crop.shape[0]), crop.tobytes())
        im = im.resize((w, h), Image.LANCZOS).convert("RGBA")
        canvas = Image.new("RGBA", (SIZE, SIZE), (0, 0, 0, 0))
        canvas.paste(im, ((SIZE - w) // 2, (SIZE - h) // 2))
        out.append(canvas)

    ms = round(1000 / FPS)
    out[0].save(OUT / f"{name}.webp", save_all=True, append_images=out[1:], duration=ms, loop=0,
                quality=82, method=4)
    hard = []
    for im in out:
        im = im.copy()
        im.putalpha(im.getchannel("A").point(lambda v: 255 if v >= 128 else 0))
        hard.append(im)
    hard[0].save(OUT / f"{name}.gif", save_all=True, append_images=hard[1:], duration=ms, loop=0, disposal=2)

    cols = min(len(out), 10)
    rows = math.ceil(len(out) / cols)
    sheet = Image.new("RGBA", (cols * SIZE, rows * SIZE), (0, 0, 0, 0))
    for i, im in enumerate(out):
        sheet.paste(im, ((i % cols) * SIZE, (i // cols) * SIZE))
    sheet.save(OUT / f"{name}-sprite.png", optimize=True)
    meta = {"frameWidth": SIZE, "frameHeight": SIZE, "frames": len(out), "columns": cols, "fps": FPS}
    (OUT / f"{name}.json").write_text(json.dumps(meta, indent=2) + "\n")
    return len(out)


if __name__ == "__main__":
    OUT.mkdir(exist_ok=True)
    names = sys.argv[1:] or list(ANIMATIONS)
    for name in names:
        count = export(name, ANIMATIONS[name]())
        sizes = ", ".join(f"{ext} {(OUT / f'{name}{ext}').stat().st_size // 1024} KB"
                          for ext in (".webp", ".gif", "-sprite.png"))
        print(f"{name:10s} {count:3d} frames  {sizes}")
