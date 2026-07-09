# TOASTY TOES — The Immersive Footwear Boutique

A first-person, real-time 3D shopping *experience* — not a storefront page. You
land in a luxury shopping-mall corridor with the Toasty Toes boutique glowing
ahead. Press **Explore Collection**, the glass doors slide open, the camera
physically walks across the threshold, and you're standing inside the store.
From there you *turn your head* toward each department and browse every shoe on
its own illuminated display — exactly as you would in a real flagship boutique.

The camera never leaves first person. There are no page transitions, no floating
webpages, no loading screens between departments — just a continuous, breathing
space.

## The experience

- **Outside → inside, in one continuous move.** The mall corridor and the
  boutique are one connected 3D space. Clicking *Explore* opens the doors and
  dollies the camera from the corridor to the centre of the store — a single
  cinematic walk, with footfalls, a glass-door whoosh and the ambience shifting
  from "mall" to "interior".
- **Turn your head to shop.** Eight departments (Women, Men, Kids, Sports,
  Party Wear, Traditional, Casual, New Arrivals) line the walls of an octagonal
  boutique. The floating filter chips — or the ◄ ► arrow keys — smoothly rotate
  the camera to face a department, like turning to look at another wall.
- **Living product displays.** Every shoe rests on its own lit pedestal and
  turns slowly for presentation. Hover one and its spotlight brightens, it spins
  to face you, and a frosted-glass card fades in with price, colours (which
  re-tint the actual 3D shoe), sizes, Quick View and Add to Bag.
- **A glass shopping bag.** Opening the bag blurs the boutique behind a floating
  glass panel instead of navigating away — the store stays visible.
- **Atmosphere.** Warm retail lighting, real cast shadows, ambient occlusion,
  polished-stone floor reflections, drifting dust in the light, distant
  foot-traffic silhouettes, a magnetic cursor with inertia, and synthesised
  mall ambience with an optional sound toggle.

## Craft & rendering

Built with **Three.js / WebGL** and **GSAP**. Everything is generated in code —
there are **no 3D model files or image textures to download**:

- The mall, storefront, sliding doors, shelving and shoes are all **procedural
  geometry**. Shoes are extruded from a hand-drawn side profile and finished
  with physically-based leather (clearcoat sheen + procedural grain).
- Wood grain, polished stone, plaster and leather are **procedural canvas
  textures** used as colour / roughness / bump maps.
- **Realism:** PCF soft **shadow maps** (per-department key lights), **GTAO**
  ambient occlusion, image-based lighting for PBR reflections, planar floor
  reflections, plus subtle bloom, vignette and film grain.
- **Sound** is fully synthesised with the Web Audio API — a warm ambient pad,
  room tone, footsteps, the door whoosh and UI ticks. No audio files.

## Tech notes

- **Zero build step, fully self-contained.** Three.js and GSAP are vendored
  under `assets/vendor/`, so the site loads offline with no third-party CDN at
  runtime. Just serve the folder.
- **Performance:** capped device-pixel-ratio, half-resolution planar
  reflections, 512px shadow maps on the department key lights, shared geometry
  and textures across all 24 products, and throttled raycasting — aiming at a
  smooth 60 FPS. Respects `prefers-reduced-motion`.

## Structure

```
index.html                     Markup, import map, and all glass-UI overlays
assets/css/style.css           Luxury glass UI, cursor, cart, product card
assets/js/app.js               Renderer, IBL, post-processing, main loop
assets/js/controls.js          First-person camera, cinematic entry, raycasting
assets/js/ui.js                DOM overlay: cursor, product card, cart, chips
assets/js/audio.js             Web-Audio ambience, footsteps, door, UI sounds
assets/js/scene/world.js       Mall corridor + boutique interior + lighting
assets/js/scene/products.js    Catalog + procedural shoe & pedestal geometry
assets/js/scene/textures.js    Procedural wood / stone / plaster / leather maps
assets/vendor/                 Vendored Three.js + GSAP (no runtime CDN)
```

## Running

It's fully static:

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

Best on a desktop GPU. Sound is off until you press *Explore Collection* (and
can be toggled any time with the button in the lower-left). Fonts load from
Google Fonts and degrade gracefully to system serif/sans if offline.
