# KUROGANE — The Hero Katana

A cinematic single-page website built around one legendary, handcrafted katana.
The sword *is* the brand: it stays suspended on screen and the page moves the
"camera" around it as you scroll — slow dolly, orbit, and macro push-ins that
reveal each detail in turn.

## The experience

- **Suspended hero** — the katana floats with an extremely slow breathing
  motion, a moving mirror reflection sliding down the steel, drifting dust,
  occasional sparks, and cherry-blossom petals passing in front of the blade.
- **Scroll = camera** — each chapter re-frames the sword like a luxury product
  commercial: a macro of the blade, the diamond-wrapped handle, the guard, then
  a pull-back for the dragon saya, and finally a return to the full blade.
- **The details** — folded Damascus core, a Hamon temper line, mirror edge with
  micro-scratches; matte-black diamond leather wrap over crimson rayskin;
  minimal forged-steel tsuba with engraved glyphs; gunmetal fuchi & kashira;
  and a black-lacquer saya with a hand-painted crimson dragon and brass end cap.
- **Palette** — 95% black, gunmetal, steel and deep grey, with only the smallest
  breath of crimson and gold.

## Craft notes

The katana is rendered as a hand-built, layered **SVG** (gradients, turbulence
filters for the Damascus folds and rayskin, a masked reflection band) rather
than a 3D model — this keeps it razor-sharp at any zoom, loads instantly, and
runs everywhere with no assets to download. Motion is driven by lightweight
vanilla JavaScript on `requestAnimationFrame`; the atmosphere (dust, sparks,
petals) is a single `<canvas>`.

Everything respects `prefers-reduced-motion`, and the layout adapts to mobile.

## Structure

```
index.html              Markup + the inline SVG katana and saya artwork
assets/css/style.css    Dark luxury styling, cinematic layout, responsive rules
assets/js/katana.js     Scroll-scrubbed camera, float/breathe, reveals, rail
assets/js/atmosphere.js Canvas dust, sparks, and cherry-blossom petals
```

## Running

It's fully static — open `index.html` in a browser, or serve the folder:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

Fonts (Cormorant Garamond, Manrope, Shippori Mincho) load from Google Fonts and
degrade gracefully to system serif/sans if offline.
