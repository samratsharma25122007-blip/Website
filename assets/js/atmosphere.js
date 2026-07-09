/* =====================================================================
   Atmosphere — drifting dust, occasional sparks, cherry-blossom petals.
   Physically gentle: nothing magical, everything slow.
   ===================================================================== */
(() => {
  const canvas = document.getElementById('atmosphere');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let W, H, DPR;
  function resize() {
    DPR = Math.min(window.devicePixelRatio || 1, 2);
    W = canvas.width  = Math.floor(innerWidth  * DPR);
    H = canvas.height = Math.floor(innerHeight * DPR);
    canvas.style.width = innerWidth + 'px';
    canvas.style.height = innerHeight + 'px';
  }
  resize();
  addEventListener('resize', resize, { passive: true });

  const rand = (a, b) => a + Math.random() * (b - a);

  /* ---------- Dust motes ---------- */
  const dust = [];
  const DUST_N = reduced ? 26 : 70;
  for (let i = 0; i < DUST_N; i++) {
    dust.push({
      x: Math.random() * W, y: Math.random() * H,
      r: rand(0.4, 1.7) * DPR,
      vx: rand(-0.12, 0.12) * DPR, vy: rand(-0.16, 0.05) * DPR,
      a: rand(0.05, 0.32), tw: rand(0.002, 0.01), ph: Math.random() * 6.28,
    });
  }

  /* ---------- Cherry-blossom petals ---------- */
  const petals = [];
  const PETAL_N = reduced ? 5 : 14;
  function makePetal(top) {
    return {
      x: Math.random() * W,
      y: top ? -20 * DPR : Math.random() * H,
      size: rand(7, 15) * DPR,
      vx: rand(-0.25, 0.35) * DPR,
      vy: rand(0.25, 0.7) * DPR,
      rot: Math.random() * 6.28,
      vr: rand(-0.015, 0.015),
      sway: rand(0.4, 1.1),
      swayPh: Math.random() * 6.28,
      flip: rand(0.6, 1),
      a: rand(0.5, 0.9),
    };
  }
  for (let i = 0; i < PETAL_N; i++) petals.push(makePetal(false));

  function drawPetal(p) {
    const s = p.size;
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rot);
    ctx.scale(1, p.flip * (0.6 + 0.4 * Math.sin(p.swayPh)));
    const g = ctx.createLinearGradient(0, -s, 0, s);
    g.addColorStop(0, `rgba(255,225,232,${p.a})`);
    g.addColorStop(1, `rgba(224,150,170,${p.a * 0.85})`);
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.moveTo(0, -s);
    ctx.bezierCurveTo(s * 0.7, -s * 0.6, s * 0.5, s * 0.6, 0, s);
    ctx.bezierCurveTo(-s * 0.5, s * 0.6, -s * 0.7, -s * 0.6, 0, -s);
    ctx.fill();
    ctx.strokeStyle = `rgba(180,90,110,${p.a * 0.4})`;
    ctx.lineWidth = 0.6 * DPR;
    ctx.beginPath(); ctx.moveTo(0, -s * 0.7); ctx.lineTo(0, s * 0.7); ctx.stroke();
    ctx.restore();
  }

  /* ---------- Sparks (rare, near the blade centre) ---------- */
  const sparks = [];
  function spawnSpark() {
    const cx = W * 0.5 + rand(-0.06, 0.06) * W;
    const cy = H * rand(0.25, 0.7);
    sparks.push({
      x: cx, y: cy,
      vx: rand(-0.4, 0.4) * DPR, vy: rand(-0.9, -0.2) * DPR,
      life: 1, decay: rand(0.006, 0.018),
      r: rand(0.6, 1.5) * DPR,
    });
  }

  let t = 0, sparkTimer = 0;
  function frame() {
    t += 1;
    ctx.clearRect(0, 0, W, H);

    // dust
    for (const d of dust) {
      d.x += d.vx; d.y += d.vy; d.ph += d.tw;
      if (d.x < 0) d.x = W; if (d.x > W) d.x = 0;
      if (d.y < 0) d.y = H; if (d.y > H) d.y = 0;
      const a = d.a * (0.6 + 0.4 * Math.sin(d.ph));
      ctx.beginPath();
      ctx.fillStyle = `rgba(200,208,220,${a})`;
      ctx.arc(d.x, d.y, d.r, 0, 6.283);
      ctx.fill();
    }

    // petals
    for (const p of petals) {
      p.swayPh += 0.02;
      p.x += p.vx + Math.sin(p.swayPh) * p.sway * DPR;
      p.y += p.vy;
      p.rot += p.vr;
      if (p.y > H + 30 * DPR || p.x < -40 * DPR || p.x > W + 40 * DPR) {
        Object.assign(p, makePetal(true));
      }
      drawPetal(p);
    }

    // sparks
    if (!reduced) {
      sparkTimer -= 1;
      if (sparkTimer <= 0) { spawnSpark(); sparkTimer = rand(70, 220); }
      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i];
        s.x += s.vx; s.y += s.vy; s.vy += 0.008 * DPR; s.life -= s.decay;
        if (s.life <= 0) { sparks.splice(i, 1); continue; }
        ctx.beginPath();
        ctx.fillStyle = `rgba(255,${150 + s.life * 80 | 0},90,${s.life})`;
        ctx.shadowBlur = 8 * DPR; ctx.shadowColor = 'rgba(255,120,60,0.9)';
        ctx.arc(s.x, s.y, s.r, 0, 6.283);
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }

    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
})();
