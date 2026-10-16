# Animated doodles

Your nine doodle stickers, each with its own loop. `source/` holds the PNGs you supplied;
`animate.py` turns them into animations in `out/`.

| Doodle | Motion | Frames |
|---|---|---|
| cannon | wheel spins clockwise, forever | 10 |
| plant | leaves sway and rustle; pot stays still | 50 |
| controller | right thumbstick circles in its well | 30 |
| dog | two ear twitches and one blink per loop | 60 |
| football | full clockwise turn | 48 |
| ramen | chopsticks lift the noodles and lower them back | 40 |
| owl | bends side to side from the perch up | 50 |
| sneaker | small hop with a squash (my pick; no motion was specified) | 30 |
| strawhat | Jolly Roger rocks gently side to side (anime / One Piece; source made from Jayanth's image on 2026-10-16 with a sticker border added) | 40 |

All run at 25 fps and are 192 × 192 px (2× the 96 px doodle slot in the lid-lift component).

## Which file to use

- **`<name>.webp`**: use this one. Animated WebP with smooth transparent edges. Upload these
  to the lid-lift component's **Doodles** property in Framer.
- `<name>.gif`: same animation as GIF. GIF transparency is on/off only, so edges are
  hard; it looks fine on a light background and a little jagged on others.
- `<name>-sprite.png` + `<name>.json`: every frame on one sheet, for CSS `steps()` or a
  canvas player. The JSON has the frame size, frame count, columns and fps.

Sizes: about 1.9 MB of WebP across all eight; the full-image motions (plant, football, owl)
are the heaviest at around 400 KB each. The encoders merge identical consecutive frames, so a
file's frame count can be lower than the table; timing is unchanged.

## How the motion is made

The sources are flat images, not layered artwork, so:

- the football is rotated as a whole;
- the plant, owl, controller stick, dog's ears and noodles are bent with smooth local warps
  (no cut-out edges, but extreme settings will smear);
- the blink paints eyelids in the sampled fur colour over each eye;
- the cannon's wheel is **redrawn** as vector shapes on top of the original, because the
  barrel shows through the gaps between spokes and rotating the pixels would spin it too.
  It closely matches but is not pixel-identical to your original wheel.

## Changing something

Edit the numbers in the doodle's function in `animate.py` (amplitudes, frame counts,
positions are all in source-image pixels), then re-run. It takes about 10 seconds:

```bash
python3 animate.py            # all nine
python3 animate.py owl dog    # just these
```

It needs Pillow and numpy. `preview.html` shows every animation on light and dark backgrounds;
serve this folder (the `doodles-preview` entry in `.claude/launch.json`) rather than opening
the file directly, or the images won't load.
