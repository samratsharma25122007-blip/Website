import * as THREE from 'three';
import { Reflector } from 'three/addons/objects/Reflector.js';
import { CATEGORIES, makeShoe, makePedestal } from './products.js';
import { woodMaps, stoneMaps, plasterBump, leatherBump, contactShadow } from './textures.js';

/* Canvas-generated signage texture (no font assets to load). */
function signTexture(text, accent = '#ffd98a', sub = '') {
  const c = document.createElement('canvas');
  c.width = 1024; c.height = 256;
  const x = c.getContext('2d');
  x.clearRect(0, 0, c.width, c.height);
  x.fillStyle = accent;
  x.textAlign = 'center';
  x.textBaseline = 'middle';
  x.font = '600 118px "Cormorant Garamond", Georgia, serif';
  x.shadowColor = accent; x.shadowBlur = 40;
  x.fillText(text, 512, sub ? 108 : 128);
  if (sub) {
    x.shadowBlur = 0;
    x.font = '400 30px "Manrope", sans-serif';
    x.fillStyle = 'rgba(246,239,228,0.7)';
    x.fillText(sub, 512, 196);
  }
  const t = new THREE.CanvasTexture(c);
  t.anisotropy = 4; t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

/**
 * Build the entire environment. Returns handles the rest of the app uses.
 */
export function buildWorld(ctx) {
  const { scene } = ctx;
  const R = 5.2;                 // centre → wall distance
  const N = CATEGORIES.length + 1; // +1 for the entrance wall
  const step = (Math.PI * 2) / N;

  const shoes = [];              // raycast targets
  const wallGroups = [];         // per-category groups (for camera turning)

  // ---------- shared procedural textures ----------
  const wood = woodMaps();
  const stone = stoneMaps();
  const plaster = plasterBump();
  const leatherT = leatherBump();
  const maps = { leatherBump: leatherT };
  const contactTex = contactShadow();

  // ---------- MATERIALS ----------
  const wallMat  = new THREE.MeshStandardMaterial({ color: '#cfc1a6', roughness: 0.96, metalness: 0.0, envMapIntensity: 0.28, bumpMap: plaster, bumpScale: 0.04 });
  const woodMat  = new THREE.MeshStandardMaterial({ color: '#5c3f28', roughness: 0.55, metalness: 0.05, envMapIntensity: 0.8, map: wood.map, bumpMap: wood.bumpMap, bumpScale: 0.03 });
  const metalMat = new THREE.MeshStandardMaterial({ color: '#12100c', roughness: 0.32, metalness: 0.92, envMapIntensity: 1.2 });
  const glassMat = new THREE.MeshPhysicalMaterial({ color: '#dfeef2', roughness: 0.03, metalness: 0, transmission: 0.92, thickness: 0.4, transparent: true, opacity: 0.22, envMapIntensity: 1.6, ior: 1.46 });
  const ledMat   = (hex) => new THREE.MeshStandardMaterial({ color: hex, emissive: hex, emissiveIntensity: 1.6, roughness: 0.4 });

  // ============================================================
  //  STORE — reflective floor (planar Reflector) + a warm rug on top
  // ============================================================
  const store = new THREE.Group();
  scene.add(store);

  const dpr = Math.min(window.devicePixelRatio, 2);
  const reflector = new Reflector(new THREE.CircleGeometry(R + 2.2, 64), {
    textureWidth: Math.floor(window.innerWidth * dpr * 0.5),
    textureHeight: Math.floor(window.innerHeight * dpr * 0.5),
    color: 0x181410,
  });
  reflector.rotation.x = -Math.PI / 2;
  reflector.position.y = 0.001;
  store.add(reflector);

  // polished-stone tiles over the reflection (textured, receives shadows)
  const gloss = new THREE.Mesh(
    new THREE.CircleGeometry(R + 2.2, 64),
    new THREE.MeshStandardMaterial({ color: '#4a4034', roughness: 0.16, metalness: 0.0, transparent: true, opacity: 0.62, envMapIntensity: 1.0, map: stone.map, roughnessMap: stone.roughnessMap }),
  );
  gloss.rotation.x = -Math.PI / 2; gloss.position.y = 0.012; gloss.receiveShadow = true; store.add(gloss);

  // ceiling
  const ceiling = new THREE.Mesh(new THREE.CircleGeometry(R + 2.2, 64), new THREE.MeshStandardMaterial({ color: '#e4d9c4', roughness: 0.95, envMapIntensity: 0.25 }));
  ceiling.rotation.x = Math.PI / 2; ceiling.position.y = 4.4; store.add(ceiling);

  // central warm ceiling light + soft cove glow
  const cove = new THREE.Mesh(new THREE.RingGeometry(1.6, 2.4, 48), ledMat('#ffe9c2'));
  cove.material.emissiveIntensity = 0.7;
  cove.rotation.x = Math.PI / 2; cove.position.y = 4.36; store.add(cove);

  // fill only — shadows come from the per-wall key lights (point-light cube
  // shadows are the most expensive, so this one stays shadowless for 60fps)
  const centerLight = new THREE.PointLight('#ffd6a0', 12, 20, 2.0); centerLight.position.set(0, 3.8, 0);
  store.add(centerLight);
  store.add(new THREE.HemisphereLight('#ffe9cf', '#1c130c', 0.26));
  const ambientFill = new THREE.AmbientLight('#ffedd4', 0.07); store.add(ambientFill);

  // ---------- build one wall per angle ----------
  let catIndex = 0;
  for (let i = 0; i < N; i++) {
    const a = i * step;                       // wall angle
    const px = Math.sin(a) * R, pz = Math.cos(a) * R;
    const isEntrance = (i === 0);

    const panelW = 2 * R * Math.tan(step / 2) + 0.2;

    // the entrance side stays OPEN so the camera can see through the
    // facade doors into the boutique — the mall builds its doors + logo.
    if (isEntrance) continue;

    const wall = new THREE.Group();
    wall.position.set(px, 0, pz);
    wall.rotation.y = a + Math.PI;            // local +Z faces the room centre
    store.add(wall);

    // back panel
    const panel = new THREE.Mesh(new THREE.PlaneGeometry(panelW, 4.4), wallMat);
    panel.position.y = 2.2; panel.receiveShadow = true; wall.add(panel);

    // ---- category wall ----
    const cat = CATEGORIES[catIndex++];
    const accent = cat.accent;

    // illuminated alcove behind the shelf (receives shoe shadows)
    const alcove = new THREE.Mesh(new THREE.PlaneGeometry(panelW - 0.6, 2.4), new THREE.MeshStandardMaterial({ color: '#e7d8bd', emissive: '#e0bf82', emissiveIntensity: 0.16, roughness: 0.92, envMapIntensity: 0.18 }));
    alcove.position.set(0, 1.55, 0.02); alcove.receiveShadow = true; wall.add(alcove);

    // wooden frame around the alcove
    const frameMat = woodMat;
    const fw = panelW - 0.4, fh = 2.7;
    [[0, 1.55 + fh / 2, 0.05, fw, 0.12], [0, 1.55 - fh / 2, 0.05, fw, 0.12], [-fw / 2, 1.55, 0.05, 0.12, fh], [fw / 2, 1.55, 0.05, 0.12, fh]]
      .forEach(([x, y, z, w, h]) => {
        const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, 0.16), frameMat);
        m.position.set(x, y, z); m.castShadow = true; m.receiveShadow = true; wall.add(m);
      });

    // category sign (emissive → bloom picks it up)
    const sign = new THREE.Mesh(new THREE.PlaneGeometry(3.0, 0.75), new THREE.MeshBasicMaterial({ map: signTexture(cat.title, accent), transparent: true }));
    sign.position.set(0, 3.55, 0.12); wall.add(sign);
    const signGlow = new THREE.PointLight(accent, 2.0, 4, 2); signGlow.position.set(0, 3.4, 0.6); wall.add(signGlow);
    // key light that grounds the shoes with real cast shadows
    const wallWash = new THREE.SpotLight('#ffe6bd', 10, 7, 0.85, 0.6, 1.6);
    wallWash.position.set(0, 3.7, 1.6); wallWash.target.position.set(0, 1.2, 0.1);
    wallWash.castShadow = true; wallWash.shadow.mapSize.set(512, 512);
    wallWash.shadow.camera.near = 0.5; wallWash.shadow.camera.far = 8; wallWash.shadow.bias = -0.0018; wallWash.shadow.radius = 4;
    wall.add(wallWash, wallWash.target);

    // glass shelf + warm LED strip under it
    const shelf = new THREE.Mesh(new THREE.BoxGeometry(panelW - 0.7, 0.05, 0.55), glassMat);
    shelf.position.set(0, 1.15, 0.4); shelf.receiveShadow = true; wall.add(shelf);
    const led = new THREE.Mesh(new THREE.BoxGeometry(panelW - 0.9, 0.03, 0.05), ledMat('#ffdca0'));
    led.material.emissiveIntensity = 1.0;
    led.position.set(0, 1.30, 0.66); wall.add(led);
    const ledUnder = new THREE.Mesh(new THREE.BoxGeometry(panelW - 0.9, 0.03, 0.05), ledMat('#ffdca0'));
    ledUnder.material.emissiveIntensity = 1.0;
    ledUnder.position.set(0, 1.12, 0.66); wall.add(ledUnder);

    // products on illuminated pedestals — spread evenly, any count
    const n = cat.items.length;
    const spanW = Math.min(panelW - 0.9, Math.max(0.001, n - 1) * 1.45);
    const dispScale = n > 3 ? Math.max(0.72, 3 / n) : 1;   // shrink a little when crowded
    cat.items.forEach((item, k) => {
      const x = n === 1 ? 0 : (k / (n - 1) - 0.5) * spanW;
      const disp = new THREE.Group();
      disp.position.set(x, 1.18, 0.42);
      disp.scale.setScalar(dispScale);
      wall.add(disp);

      // soft contact shadow grounding the pedestal on the shelf
      const cshadow = new THREE.Mesh(
        new THREE.PlaneGeometry(1.0, 0.7),
        new THREE.MeshBasicMaterial({ map: contactTex, transparent: true, opacity: 0.7, depthWrite: false }),
      );
      cshadow.rotation.x = -Math.PI / 2; cshadow.position.y = 0.006; disp.add(cshadow);

      const ped = makePedestal();
      disp.add(ped);

      const shoe = makeShoe(item.colors[0], maps);
      shoe.position.y = 0.24 + (k === 1 ? 0.06 : 0); // vary heights slightly
      disp.add(shoe);

      // pick out the raycast target(s)
      shoe.traverse((o) => { if (o.isMesh) { o.userData.pickRoot = shoe; shoes.push(o); } });

      shoe.userData = {
        ...shoe.userData,
        product: item, category: cat, accent,
        spin: shoe.userData.spin,
        pedestal: ped.userData.glow,
        baseY: shoe.position.y,
        rot0: shoe.userData.spin.rotation.y,
      };
      disp.userData.shoe = shoe;
    });

    wall.userData = { category: cat, angle: a, index: catIndex - 1, signGlow, alcove: alcove.material };
    wallGroups.push(wall);
  }

  // ============================================================
  //  MALL — corridor extending toward the viewer (+Z), the store
  //  facade is the entrance wall we just built at angle 0.
  // ============================================================
  const mall = new THREE.Group();
  scene.add(mall);
  buildMall(mall, { wallMat, woodMat, metalMat, glassMat, ledMat, stone });

  // ---------- floating dust in the light ----------
  const particles = buildParticles(scene);

  return { store, mall, reflector, particles, shoes, wallGroups, R, step };
}

/* ============================================================
   MALL builder (kept separate for readability)
   ============================================================ */
function buildMall(mall, m) {
  const { wallMat, woodMat, metalMat, glassMat, ledMat, stone } = m;

  // corridor floor (polished stone) — extends in +Z
  const corridor = new THREE.Mesh(
    new THREE.PlaneGeometry(16, 34),
    new THREE.MeshStandardMaterial({ color: '#43392f', roughness: 0.16, metalness: 0.0, envMapIntensity: 1.0, map: stone.map.clone(), roughnessMap: stone.roughnessMap }),
  );
  corridor.material.map.repeat.set(5, 10);
  corridor.rotation.x = -Math.PI / 2; corridor.position.set(0, 0.002, 17); corridor.receiveShadow = true; mall.add(corridor);

  // corridor ceiling with runs of light panels
  const cCeil = new THREE.Mesh(new THREE.PlaneGeometry(16, 34), new THREE.MeshStandardMaterial({ color: '#efe7d8', roughness: 0.9 }));
  cCeil.rotation.x = Math.PI / 2; cCeil.position.set(0, 4.6, 17); mall.add(cCeil);
  for (let z = 4; z < 32; z += 4) {
    const p = new THREE.Mesh(new THREE.PlaneGeometry(2.4, 1.0), ledMat('#fff2da'));
    p.material.emissiveIntensity = 1.0; p.rotation.x = Math.PI / 2; p.position.set(0, 4.55, z); mall.add(p);
    const pl = new THREE.PointLight('#ffedcf', 8, 12, 2); pl.position.set(0, 4.2, z); mall.add(pl);
  }

  // side walls with neighbouring storefronts (blurred, non-interactive)
  const neighbours = ['MAISON', 'ATELIER', 'LUMIÈRE', 'ORNO', 'SÉVIGNÉ', 'AURUM'];
  [-1, 1].forEach((side) => {
    const sx = side * 7.4;
    // long wall
    const w = new THREE.Mesh(new THREE.PlaneGeometry(34, 4.6), wallMat);
    w.rotation.y = -side * Math.PI / 2; w.position.set(sx, 2.3, 17); mall.add(w);

    for (let n = 0; n < neighbours.length; n++) {
      const z = 5 + n * 4.4;
      // storefront glass
      const g = new THREE.Mesh(new THREE.PlaneGeometry(3.2, 3.0), glassMat.clone());
      g.material.opacity = 0.4; g.material.color = new THREE.Color('#cdd8dc');
      g.rotation.y = -side * Math.PI / 2; g.position.set(sx - side * 0.05, 1.7, z); mall.add(g);
      // warm interior glow behind the glass
      const glow = new THREE.Mesh(new THREE.PlaneGeometry(3.0, 2.8), new THREE.MeshBasicMaterial({ color: '#d9b98a' }));
      glow.rotation.y = -side * Math.PI / 2; glow.position.set(sx - side * 0.12, 1.7, z); mall.add(glow);
      // black frame
      const frame = new THREE.Mesh(new THREE.BoxGeometry(0.08, 3.2, 3.4), metalMat);
      frame.position.set(sx, 1.7, z); mall.add(frame);
      // little sign
      const sc = document.createElement('canvas'); sc.width = 512; sc.height = 128;
      const cx = sc.getContext('2d'); cx.fillStyle = 'rgba(20,16,12,0.9)'; cx.font = '500 54px "Cormorant Garamond", serif';
      cx.textAlign = 'center'; cx.textBaseline = 'middle'; cx.fillText(neighbours[n], 256, 64);
      const tex = new THREE.CanvasTexture(sc); tex.colorSpace = THREE.SRGBColorSpace;
      const s = new THREE.Mesh(new THREE.PlaneGeometry(2.2, 0.55), new THREE.MeshBasicMaterial({ map: tex, transparent: true, opacity: 0.5 }));
      s.rotation.y = -side * Math.PI / 2; s.position.set(sx - side * 0.06, 3.3, z); mall.add(s);
    }

    // indoor plants + benches along the corridor
    for (let n = 0; n < 3; n++) {
      const z = 8 + n * 8;
      mall.add(makePlant(sx - side * 1.1, z));
      const bench = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.4, 0.5), woodMat);
      bench.position.set(sx - side * 1.9, 0.32, z + 2); bench.castShadow = true; bench.receiveShadow = true; mall.add(bench);
    }
  });

  // gentle foot-traffic silhouettes drifting far down the corridor
  const walkers = new THREE.Group();
  for (let i = 0; i < 6; i++) {
    const person = new THREE.Mesh(
      new THREE.PlaneGeometry(0.6, 1.7),
      new THREE.MeshBasicMaterial({ color: '#1a140e', transparent: true, opacity: 0.5 }),
    );
    person.position.set((Math.sin(i * 2.1) * 4), 0.85, 12 + i * 3);
    person.userData.speed = 0.004 + (i % 3) * 0.002;
    person.userData.dir = i % 2 ? 1 : -1;
    walkers.add(person);
  }
  mall.add(walkers);
  mall.userData.walkers = walkers;

  // ---- Toasty Toes FACADE at the open edge of the boutique ----
  const facade = new THREE.Group();
  facade.position.set(0, 0, 4.8);
  mall.add(facade);

  // full-height glass either side of the doors
  [-1, 1].forEach((side) => {
    const gp = new THREE.Mesh(new THREE.PlaneGeometry(2.4, 4.2), glassMat.clone());
    gp.material.opacity = 0.22;
    gp.position.set(side * 2.6, 2.1, 0); facade.add(gp);
    const fr = new THREE.Mesh(new THREE.BoxGeometry(0.1, 4.4, 0.1), metalMat);
    fr.position.set(side * 1.4, 2.2, 0.02); facade.add(fr);
  });
  // top beam + warm interior spill
  const beam = new THREE.Mesh(new THREE.BoxGeometry(8, 0.4, 0.4), woodMat);
  beam.position.set(0, 4.3, 0); facade.add(beam);

  // glowing logo above the doors
  const sc = document.createElement('canvas'); sc.width = 1024; sc.height = 256;
  const g2 = sc.getContext('2d');
  g2.textAlign = 'center'; g2.textBaseline = 'middle';
  g2.fillStyle = '#ffe6b0'; g2.shadowColor = '#ffcf7a'; g2.shadowBlur = 50;
  g2.font = '600 130px "Cormorant Garamond", serif';
  g2.fillText('TOASTY TOES', 512, 128);
  const logoTex = new THREE.CanvasTexture(sc); logoTex.colorSpace = THREE.SRGBColorSpace;
  const logo = new THREE.Mesh(new THREE.PlaneGeometry(5.2, 1.3), new THREE.MeshBasicMaterial({ map: logoTex, transparent: true }));
  logo.position.set(0, 3.5, 0.05); facade.add(logo);
  const logoLight = new THREE.PointLight('#ffcf7a', 6, 8, 2); logoLight.position.set(0, 3.4, 0.8); facade.add(logoLight);

  // ---- the two sliding glass doors ----
  const doorL = makeDoor(glassMat, metalMat, -1);
  const doorR = makeDoor(glassMat, metalMat, 1);
  doorL.position.set(-0.7, 0, 0.05); doorR.position.set(0.7, 0, 0.05);
  facade.add(doorL, doorR);

  // warm light spilling from inside the store toward the mall (casts the facade's shadow)
  const spill = new THREE.SpotLight('#ffdca0', 40, 16, 0.7, 0.5, 1.4);
  spill.position.set(0, 3.4, -1); spill.target.position.set(0, 0.5, 6);
  spill.castShadow = true; spill.shadow.mapSize.set(512, 512); spill.shadow.camera.near = 0.5; spill.shadow.camera.far = 18; spill.shadow.bias = -0.002;
  facade.add(spill, spill.target);

  mall.userData.doors = { left: doorL, right: doorR };
}

function makeDoor(glassMat, metalMat, side) {
  const d = new THREE.Group();
  const glass = new THREE.Mesh(new THREE.PlaneGeometry(1.36, 4.0), glassMat.clone());
  glass.material.opacity = 0.32; glass.position.y = 2.05; d.add(glass);
  const frame = new THREE.Mesh(new THREE.BoxGeometry(1.44, 4.1, 0.06), new THREE.MeshStandardMaterial({ color: '#0e0b08', roughness: 0.3, metalness: 0.9 }));
  frame.position.y = 2.05; frame.position.z = -0.02; frame.castShadow = true; d.add(frame);
  // slim vertical handle
  const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 1.2, 12), new THREE.MeshStandardMaterial({ color: '#d8b878', roughness: 0.25, metalness: 1 }));
  handle.position.set(side * 0.55, 1.8, 0.08); d.add(handle);
  return d;
}

function makePlant(x, z) {
  const g = new THREE.Group();
  const pot = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.26, 0.5, 20), new THREE.MeshStandardMaterial({ color: '#2b2420', roughness: 0.8 }));
  pot.position.y = 0.25; g.add(pot);
  const foliageMat = new THREE.MeshStandardMaterial({ color: '#2f4a34', roughness: 0.9 });
  for (let i = 0; i < 14; i++) {
    const leaf = new THREE.Mesh(new THREE.ConeGeometry(0.09, 1.0 + Math.random() * 0.6, 6), foliageMat);
    const ang = (i / 14) * Math.PI * 2;
    leaf.position.set(Math.cos(ang) * 0.12, 0.9 + Math.random() * 0.3, Math.sin(ang) * 0.12);
    leaf.rotation.z = Math.cos(ang) * 0.5; leaf.rotation.x = Math.sin(ang) * 0.5;
    g.add(leaf);
  }
  g.position.set(x, 0, z);
  return g;
}

/* floating dust motes */
function buildParticles(scene) {
  const COUNT = 420;
  const pos = new Float32Array(COUNT * 3);
  for (let i = 0; i < COUNT; i++) {
    pos[i * 3] = (Math.random() - 0.5) * 18;
    pos[i * 3 + 1] = Math.random() * 4.2;
    pos[i * 3 + 2] = (Math.random() - 0.3) * 26;
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const mat = new THREE.PointsMaterial({ color: '#ffe9c4', size: 0.03, transparent: true, opacity: 0.5, depthWrite: false, blending: THREE.AdditiveBlending });
  const pts = new THREE.Points(geo, mat);
  scene.add(pts);
  return pts;
}
