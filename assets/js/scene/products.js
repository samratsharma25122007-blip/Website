import * as THREE from 'three';

/* =========================================================
   CATALOG — 8 departments, presented as illuminated walls.
   Every product is footwear so the boutique reads coherently.
   ========================================================= */
export const CATEGORIES = [
  {
    id: 'women', title: 'WOMEN', accent: '#e6a4b4',
    items: [
      { name: 'Aurora Heel',   price: 289, colors: ['#e6a4b4', '#3a2f2a', '#f6efe4'], sizes: [5,6,7,8,9], desc: 'A sculpted stiletto in buttered nappa leather with a mirror-gold heel core.' },
      { name: 'Silk Mule',     price: 219, colors: ['#c98b6b', '#8a5a44', '#1a1512'], sizes: [5,6,7,8],   desc: 'Barely-there mule cut from a single panel of vegetable-tanned hide.' },
      { name: 'Petal Flat',    price: 175, colors: ['#f0d9c2', '#d8a94a', '#b6c2b0'], sizes: [5,6,7,8,9], desc: 'A weightless ballet flat with a hand-rolled topline and memory sole.' },
    ],
  },
  {
    id: 'men', title: 'MEN', accent: '#7c9cbf',
    items: [
      { name: 'Oxford Noir',   price: 345, colors: ['#1a1512', '#4a3527', '#2b2b30'], sizes: [7,8,9,10,11,12], desc: 'A whole-cut oxford in hand-patinated calf, Goodyear-welted for life.' },
      { name: 'Harbor Loafer', price: 265, colors: ['#6b4a34', '#2b2320', '#8a6a4a'], sizes: [7,8,9,10,11],    desc: 'An unlined penny loafer with a feather-light blake stitch.' },
      { name: 'Slate Derby',   price: 298, colors: ['#3a3f45', '#5a4436', '#111'],    sizes: [8,9,10,11,12],   desc: 'A pebble-grain derby on a storm welt for city rain.' },
    ],
  },
  {
    id: 'kids', title: 'KIDS', accent: '#f4c86a',
    items: [
      { name: 'Sunny Sneaker', price: 95,  colors: ['#f4c86a', '#6fcf97', '#e6a4b4'], sizes: [10,11,12,13,1], desc: 'A featherweight play sneaker with a wipe-clean toe cap.' },
      { name: 'Buckle Boot',   price: 120, colors: ['#c98b6b', '#7c9cbf', '#3a2f2a'], sizes: [9,10,11,12,13], desc: 'A cosy ankle boot with a single easy buckle and warm shearling lining.' },
      { name: 'Cloud Slip',    price: 78,  colors: ['#b6c2b0', '#f0d9c2', '#c792ea'], sizes: [8,9,10,11,12],  desc: 'A no-lace slip-on that grows with little feet.' },
    ],
  },
  {
    id: 'sports', title: 'SPORTS', accent: '#6fcf97',
    items: [
      { name: 'Velocity Pro',  price: 210, colors: ['#6fcf97', '#111', '#d8a94a'],    sizes: [7,8,9,10,11,12], desc: 'A carbon-plated racer with an energy-return foam midsole.' },
      { name: 'Trail Forge',   price: 235, colors: ['#5a4436', '#3a3f45', '#f4a259'], sizes: [8,9,10,11,12],   desc: 'A rugged trail shoe with a self-cleaning lug outsole.' },
      { name: 'Court Ace',     price: 165, colors: ['#f6efe4', '#7c9cbf', '#e6a4b4'], sizes: [6,7,8,9,10,11],  desc: 'A low-profile court shoe with a herringbone grip.' },
    ],
  },
  {
    id: 'party', title: 'PARTY WEAR', accent: '#c792ea',
    items: [
      { name: 'Nocturne Heel', price: 420, colors: ['#c792ea', '#1a1512', '#d8a94a'], sizes: [5,6,7,8,9], desc: 'A crystal-dusted evening heel that catches every light.' },
      { name: 'Velvet Pump',   price: 330, colors: ['#5a2a4a', '#1a1512', '#8a1c3a'], sizes: [5,6,7,8],   desc: 'Deep-pile velvet over a sculpted last for the long night.' },
      { name: 'Gilt Sandal',   price: 375, colors: ['#d8a94a', '#e7c987', '#f6efe4'], sizes: [5,6,7,8,9], desc: 'Fine gilded straps that dissolve into the ankle.' },
    ],
  },
  {
    id: 'traditional', title: 'TRADITIONAL', accent: '#d98a5b',
    items: [
      { name: 'Zari Mojari',   price: 260, colors: ['#8a1c3a', '#d8a94a', '#1a4a3a'], sizes: [6,7,8,9,10], desc: 'A hand-embroidered mojari with real zari thread and a curled toe.' },
      { name: 'Kolhapuri',     price: 145, colors: ['#6b4a34', '#3a2f2a', '#c98b6b'], sizes: [6,7,8,9,10,11], desc: 'A braided open sandal, tanned the old way, softened by wear.' },
      { name: 'Silk Jutti',    price: 195, colors: ['#1a4a3a', '#8a1c3a', '#d8a94a'], sizes: [5,6,7,8,9], desc: 'Mirror-worked silk jutti on a whisper-soft leather sole.' },
    ],
  },
  {
    id: 'casual', title: 'CASUAL', accent: '#c9a27a',
    items: [
      { name: 'Weekend Boot',  price: 240, colors: ['#8a6a4a', '#3a2f2a', '#5a4436'], sizes: [7,8,9,10,11,12], desc: 'A chelsea boot in oiled suede with twin elastic gussets.' },
      { name: 'Canvas Low',    price: 89,  colors: ['#f6efe4', '#3a3f45', '#6fcf97'], sizes: [6,7,8,9,10,11],  desc: 'An honest canvas low-top with a vulcanised gum sole.' },
      { name: 'Espadrille',    price: 110, colors: ['#c9a27a', '#7c9cbf', '#e6a4b4'], sizes: [6,7,8,9,10],     desc: 'A hand-woven jute base under supple washed linen.' },
    ],
  },
  {
    id: 'new', title: 'NEW ARRIVALS', accent: '#ead9a0',
    items: [
      { name: 'Ghost Runner',  price: 320, colors: ['#e9e4dc', '#d8a94a', '#c792ea'], sizes: [7,8,9,10,11], desc: 'Our lightest ever — a translucent knit on a levitating foam.' },
      { name: 'Monolith Boot', price: 380, colors: ['#2b2b30', '#3a3f45', '#5a4436'], sizes: [8,9,10,11,12], desc: 'A single-piece moulded boot with a hidden lacing system.' },
      { name: 'Aurelian Slide',price: 155, colors: ['#d8a94a', '#1a1512', '#e6a4b4'], sizes: [6,7,8,9,10],  desc: 'A moulded slide with a gilded footbed. First of the season.' },
    ],
  },
];

/* =========================================================
   Shared shoe geometry — a recognisable mid-cut silhouette
   extruded from a hand-drawn side profile. Built once.
   ========================================================= */
function buildShoeGeometries() {
  // --- upper (side outline) ---
  const s = new THREE.Shape();
  s.moveTo(0.10, 0.08);
  s.lineTo(1.82, 0.07);
  s.quadraticCurveTo(2.02, 0.08, 2.00, 0.30);
  s.quadraticCurveTo(1.97, 0.52, 1.60, 0.52);
  s.quadraticCurveTo(1.30, 0.52, 1.15, 0.57);
  s.quadraticCurveTo(1.00, 0.63, 0.92, 0.88);
  s.quadraticCurveTo(0.86, 1.00, 0.64, 1.00);
  s.quadraticCurveTo(0.40, 1.00, 0.33, 0.83);
  s.quadraticCurveTo(0.29, 0.72, 0.20, 0.52);
  s.quadraticCurveTo(0.05, 0.30, 0.10, 0.08);

  const upper = new THREE.ExtrudeGeometry(s, {
    depth: 0.60, bevelEnabled: true, bevelThickness: 0.07, bevelSize: 0.07, bevelSegments: 4, curveSegments: 18, steps: 1,
  });

  // --- sole slab ---
  const sh = new THREE.Shape();
  sh.moveTo(0.06, 0.0);
  sh.lineTo(1.90, 0.0);
  sh.quadraticCurveTo(2.08, 0.0, 2.05, 0.15);
  sh.lineTo(1.86, 0.20);
  sh.lineTo(0.16, 0.20);
  sh.quadraticCurveTo(-0.02, 0.18, 0.06, 0.0);
  const sole = new THREE.ExtrudeGeometry(sh, {
    depth: 0.66, bevelEnabled: true, bevelThickness: 0.05, bevelSize: 0.05, bevelSegments: 3, curveSegments: 14, steps: 1,
  });

  // centre both on the same origin
  const recentre = (g, zDepth) => {
    g.computeBoundingBox();
    const b = g.boundingBox;
    const cx = (b.max.x + b.min.x) / 2;
    g.translate(-cx, -b.min.y, -zDepth / 2);
    g.computeVertexNormals();
  };
  recentre(upper, 0.60);
  recentre(sole, 0.66);
  // lift the upper so it sits on the sole
  upper.translate(0, 0.14, 0);

  return { upper, sole };
}

const GEO = buildShoeGeometries();

/**
 * Build one shoe as a THREE.Group. `colorHex` tints the leather upper.
 * `maps.leatherBump` (shared) adds physically-based grain.
 * Returns a group already presented in a gentle 3/4 view.
 */
export function makeShoe(colorHex, maps = {}) {
  const g = new THREE.Group();

  const col = new THREE.Color(colorHex);
  const isDark = col.getHSL({}).l < 0.26;

  // leather upper — physically based with clearcoat sheen + fine grain
  const upperMat = new THREE.MeshPhysicalMaterial({
    color: col, roughness: 0.58, metalness: 0.0,
    clearcoat: 0.35, clearcoatRoughness: 0.45,
    envMapIntensity: 0.9, sheen: 0.3, sheenRoughness: 0.7, sheenColor: new THREE.Color(0xffffff),
    bumpMap: maps.leatherBump || null, bumpScale: 0.012,
  });
  // rubber outsole — matte, slightly rough
  const soleMat = new THREE.MeshStandardMaterial({
    color: isDark ? new THREE.Color('#1e1b18') : new THREE.Color('#efe7d8'),
    roughness: 0.82, metalness: 0.0, envMapIntensity: 0.5,
    bumpMap: maps.leatherBump || null, bumpScale: 0.006,
  });

  const upper = new THREE.Mesh(GEO.upper, upperMat);
  const sole = new THREE.Mesh(GEO.sole, soleMat);
  upper.castShadow = sole.castShadow = true;
  upper.receiveShadow = sole.receiveShadow = true;
  g.add(sole, upper);

  // scale to a tidy display size and present at a 3/4 angle
  g.scale.setScalar(0.42);
  const holder = new THREE.Group();
  holder.add(g);
  g.rotation.y = -0.62;
  g.position.x = -0.2; // centre the visual mass
  holder.userData.spin = g; // the part we rotate for presentation
  holder.userData.upperMat = upperMat;
  return holder;
}

/**
 * Illuminated display pedestal — dark metal base + warm glowing top.
 */
export function makePedestal() {
  const grp = new THREE.Group();
  const base = new THREE.Mesh(
    new THREE.CylinderGeometry(0.30, 0.34, 0.18, 44),
    new THREE.MeshStandardMaterial({ color: '#1a1510', roughness: 0.28, metalness: 0.9, envMapIntensity: 1.3 }),
  );
  base.position.y = 0.09; base.castShadow = true; base.receiveShadow = true;
  const glow = new THREE.Mesh(
    new THREE.CylinderGeometry(0.27, 0.27, 0.04, 44),
    new THREE.MeshStandardMaterial({ color: '#fff2d8', emissive: '#ffcf7a', emissiveIntensity: 1.1, roughness: 0.5 }),
  );
  glow.position.y = 0.20; glow.receiveShadow = true;
  grp.add(base, glow);
  grp.userData.glow = glow.material;
  return grp;
}
