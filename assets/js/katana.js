/* =====================================================================
   Katana — the hero motion.
   • Suspended float + extremely slow breathing (continuous)
   • Scroll behaves like a luxury-commercial camera: slow dolly, orbit,
     and macro push-ins across each chapter (scrubbed, never spinning)
   • Reveals + progress rail
   ===================================================================== */
(() => {
  const orbit = document.getElementById('orbit');
  const floatEl = document.getElementById('float');
  const hint = document.getElementById('scrollHint');
  const chapters = [...document.querySelectorAll('.chapter')];
  const dots = [...document.querySelectorAll('.rail-dot')];
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- camera keyframes, one per chapter (the sword is the hero) ---- */
  // rot: degrees · sc: scale · tx/ty: screen offset as fraction of viewport
  // ty is tuned so the named feature settles near the viewport centre once
  // scaled (a feature's screen offset grows with the zoom factor); tx pushes
  // the blade away from that chapter's text column.
  const KF = [
    { rot: 18, sc: 1.00, tx:  0.00, ty:  0.00 }, // hero  — full blade, suspended
    { rot: 11, sc: 1.75, tx: -0.16, ty:  0.34 }, // blade — macro push into the steel
    { rot: 13, sc: 1.70, tx:  0.14, ty: -0.50 }, // tsuka — down to the wrap
    { rot:  7, sc: 2.15, tx: -0.14, ty: -0.40 }, // tsuba — tight on the guard
    { rot: 23, sc: 1.15, tx:  0.10, ty:  0.05 }, // saya  — tilt, pull back
    { rot: 18, sc: 1.00, tx:  0.00, ty:  0.00 }, // forge — full again
  ];

  const lerp = (a, b, t) => a + (b - a) * t;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

  // smoothed current camera
  const cam = { ...KF[0] };
  const target = { ...KF[0] };

  function readScroll() {
    const vh = innerHeight;
    // fractional chapter index (each chapter ≈ one viewport tall)
    const t = clamp(window.scrollY / vh, 0, KF.length - 1);
    const i = Math.floor(t);
    const f = t - i;
    const a = KF[i];
    const b = KF[Math.min(i + 1, KF.length - 1)];
    // ease the segment so the dolly settles into each chapter
    const e = f < 0.5 ? 2 * f * f : 1 - Math.pow(-2 * f + 2, 2) / 2;
    target.rot = lerp(a.rot, b.rot, e);
    target.sc  = lerp(a.sc,  b.sc,  e);
    target.tx  = lerp(a.tx,  b.tx,  e);
    target.ty  = lerp(a.ty,  b.ty,  e);
  }

  let start = 0;
  function tick(now) {
    if (!start) start = now;
    const el = (now - start) / 1000;

    // camera easing toward scroll target (slow, cinematic)
    const s = reduced ? 1 : 0.06;
    cam.rot = lerp(cam.rot, target.rot, s);
    cam.sc  = lerp(cam.sc,  target.sc,  s);
    cam.tx  = lerp(cam.tx,  target.tx,  s);
    cam.ty  = lerp(cam.ty,  target.ty,  s);

    // slow orbital drift layered on top (a few degrees, never a spin)
    const drift = reduced ? 0 : Math.sin(el * 0.18) * 2.2;

    const px = cam.tx * innerWidth;
    const py = cam.ty * innerHeight;
    orbit.style.transform =
      `translate(${px.toFixed(1)}px, ${py.toFixed(1)}px) rotate(${(cam.rot + drift).toFixed(2)}deg) scale(${cam.sc.toFixed(3)})`;

    // suspended float + extremely slow breathing
    if (!reduced) {
      const bob = Math.sin(el * 0.5) * 10;          // float, px
      const sway = Math.cos(el * 0.33) * 6;         // gentle drift, px
      const breathe = 1 + Math.sin(el * 0.28) * 0.006; // breathing scale
      floatEl.style.transform =
        `translate(${sway.toFixed(2)}px, ${bob.toFixed(2)}px) scale(${breathe.toFixed(4)})`;
    }

    requestAnimationFrame(tick);
  }

  let ticking = false;
  addEventListener('scroll', () => {
    if (!ticking) { requestAnimationFrame(() => { readScroll(); ticking = false; }); ticking = true; }
    if (hint) hint.style.opacity = window.scrollY > 60 ? '0' : '1';
  }, { passive: true });

  readScroll();
  requestAnimationFrame(tick);

  /* ---- reveals + progress rail ---- */
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (en.isIntersecting) {
        en.target.classList.add('in-view');
        const id = en.target.id;
        dots.forEach((d) => d.classList.toggle('is-active', d.getAttribute('href') === '#' + id));
      }
    });
  }, { threshold: 0.5 });
  chapters.forEach((c) => io.observe(c));
})();
