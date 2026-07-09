import * as THREE from 'three';

/* =========================================================
   Procedural PBR textures drawn to canvas — no image files.
   Gives wood grain, polished stone, plaster and leather the
   micro-detail that separates "realistic" from "cartoon".
   ========================================================= */
function canvas(size = 512) {
  const c = document.createElement('canvas');
  c.width = c.height = size;
  return c;
}
function tex(c, { srgb = false, repeat = 1 } = {}) {
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(repeat, repeat);
  t.anisotropy = 8;
  if (srgb) t.colorSpace = THREE.SRGBColorSpace;
  return t;
}
const rnd = (a, b) => a + Math.random() * (b - a);

/* ---------- WOOD: warm walnut with visible grain ---------- */
export function woodMaps() {
  const S = 512, c = canvas(S), x = c.getContext('2d');
  const g = x.createLinearGradient(0, 0, 0, S);
  g.addColorStop(0, '#5a3d27'); g.addColorStop(0.5, '#6b4a30'); g.addColorStop(1, '#4e3421');
  x.fillStyle = g; x.fillRect(0, 0, S, S);
  // long grain streaks
  for (let i = 0; i < 260; i++) {
    const y = rnd(0, S), w = rnd(0.6, 2.2), l = rnd(0.05, 0.35);
    x.strokeStyle = `rgba(${30 + rnd(0, 40) | 0},${20 + rnd(0, 26) | 0},${10 + rnd(0, 16) | 0},${rnd(0.05, 0.22)})`;
    x.lineWidth = w; x.beginPath();
    let px = 0, py = y;
    x.moveTo(px, py);
    while (px < S) { px += rnd(20, 60); py = y + Math.sin(px * 0.02 + i) * rnd(2, 9); x.lineTo(px, py); }
    x.stroke();
  }
  // a few darker knots
  for (let i = 0; i < 5; i++) {
    const kx = rnd(0, S), ky = rnd(0, S), r = rnd(4, 12);
    const rg = x.createRadialGradient(kx, ky, 0, kx, ky, r * 2.4);
    rg.addColorStop(0, 'rgba(20,12,6,0.7)'); rg.addColorStop(1, 'rgba(20,12,6,0)');
    x.fillStyle = rg; x.beginPath(); x.arc(kx, ky, r * 2.4, 0, 7); x.fill();
  }
  // bump = grayscale of the same grain
  const bc = canvas(S), bx = bc.getContext('2d');
  bx.drawImage(c, 0, 0);
  const id = bx.getImageData(0, 0, S, S), d = id.data;
  for (let i = 0; i < d.length; i += 4) { const v = (d[i] + d[i + 1] + d[i + 2]) / 3; d[i] = d[i + 1] = d[i + 2] = v; }
  bx.putImageData(id, 0, 0);
  return { map: tex(c, { srgb: true }), bumpMap: tex(bc) };
}

/* ---------- POLISHED STONE FLOOR ---------- */
export function stoneMaps() {
  const S = 512, c = canvas(S), x = c.getContext('2d');
  x.fillStyle = '#2c2620'; x.fillRect(0, 0, S, S);
  // soft mottling
  for (let i = 0; i < 1400; i++) {
    const r = rnd(1, 6);
    x.fillStyle = `rgba(${rnd(60, 96) | 0},${rnd(50, 78) | 0},${rnd(38, 62) | 0},${rnd(0.02, 0.09)})`;
    x.beginPath(); x.arc(rnd(0, S), rnd(0, S), r, 0, 7); x.fill();
  }
  // marble veins
  for (let i = 0; i < 10; i++) {
    x.strokeStyle = `rgba(${rnd(120, 170) | 0},${rnd(100, 140) | 0},${rnd(80, 110) | 0},${rnd(0.05, 0.16)})`;
    x.lineWidth = rnd(0.5, 1.6); x.beginPath();
    let px = rnd(0, S), py = 0; x.moveTo(px, py);
    while (py < S) { py += rnd(18, 44); px += rnd(-30, 30); x.lineTo(px, py); }
    x.stroke();
  }
  // roughness: mostly glossy with faint smudges
  const rc = canvas(S), rx = rc.getContext('2d');
  rx.fillStyle = '#2a2a2a'; rx.fillRect(0, 0, S, S); // low roughness base
  for (let i = 0; i < 500; i++) {
    rx.fillStyle = `rgba(255,255,255,${rnd(0.02, 0.10)})`;
    rx.beginPath(); rx.arc(rnd(0, S), rnd(0, S), rnd(6, 26), 0, 7); rx.fill();
  }
  return { map: tex(c, { srgb: true, repeat: 3 }), roughnessMap: tex(rc, { repeat: 3 }) };
}

/* ---------- PLASTER WALL: subtle relief ---------- */
export function plasterBump() {
  const S = 256, c = canvas(S), x = c.getContext('2d');
  x.fillStyle = '#808080'; x.fillRect(0, 0, S, S);
  for (let i = 0; i < 4000; i++) {
    const v = rnd(96, 160) | 0;
    x.fillStyle = `rgba(${v},${v},${v},0.5)`;
    x.fillRect(rnd(0, S), rnd(0, S), rnd(1, 2), rnd(1, 2));
  }
  return tex(c, { repeat: 4 });
}

/* ---------- LEATHER GRAIN (fine bump for shoes) ---------- */
export function leatherBump() {
  const S = 256, c = canvas(S), x = c.getContext('2d');
  x.fillStyle = '#808080'; x.fillRect(0, 0, S, S);
  for (let i = 0; i < 9000; i++) {
    const v = rnd(70, 190) | 0;
    x.fillStyle = `rgba(${v},${v},${v},0.6)`;
    x.beginPath(); x.arc(rnd(0, S), rnd(0, S), rnd(0.6, 1.8), 0, 7); x.fill();
  }
  return tex(c, { repeat: 3 });
}

/* ---------- soft round contact shadow (fake AO under objects) ---------- */
let _contact = null;
export function contactShadow() {
  if (_contact) return _contact;
  const S = 128, c = canvas(S), x = c.getContext('2d');
  const g = x.createRadialGradient(S / 2, S / 2, 0, S / 2, S / 2, S / 2);
  g.addColorStop(0, 'rgba(0,0,0,0.55)'); g.addColorStop(0.6, 'rgba(0,0,0,0.28)'); g.addColorStop(1, 'rgba(0,0,0,0)');
  x.fillStyle = g; x.fillRect(0, 0, S, S);
  _contact = new THREE.CanvasTexture(c);
  return _contact;
}
