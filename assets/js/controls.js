import * as THREE from 'three';
import gsap from 'gsap';

/* =========================================================
   First-person camera rig + boutique interactions.
   States: 'mall' → 'entering' → 'store'
   ========================================================= */
export function createControls(ctx) {
  const { camera, world, audio, ui } = ctx;
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2(-2, -2);
  const mouse = { x: 0, y: 0, tx: 0, ty: 0 };

  const state = { name: 'mall', baseYaw: 0, basePitch: 0, active: null, canPick: false, cat: 0 };
  camera.rotation.order = 'YXZ';
  camera.position.set(0, 1.62, 20);

  // wall target yaws (face-the-wall angles) for each category
  const wallYaw = world.wallGroups.map((w) => w.userData.angle + Math.PI);

  let needsRaycast = false;

  // ---------- pointer / look ----------
  function onPointerMove(e) {
    mouse.tx = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.ty = (e.clientY / window.innerHeight) * 2 - 1;
    ui.moveCursor(e.clientX, e.clientY);
    // don't raycast when the pointer is over a UI surface
    if (e.target.closest && e.target.closest('.product,.chips,.topbar,.cart,.quick,.sound,.mallUI')) return;
    pointer.x = mouse.tx; pointer.y = -mouse.ty;
    needsRaycast = state.canPick;
  }

  function onClick(e) {
    if (e.target.closest && e.target.closest('.product,.chips,.topbar,.cart,.quick,.sound,.mallUI')) return;
    if (state.name !== 'store') return;
    pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
    pointer.y = -((e.clientY / window.innerHeight) * 2 - 1);
    const hit = pick();
    if (hit) { setActive(hit); audio.tick(); }
  }

  function pick() {
    raycaster.setFromCamera(pointer, camera);
    const hits = raycaster.intersectObjects(world.shoes, false);
    return hits.length ? hits[0].object.userData.pickRoot : null;
  }

  // ---------- highlight a product ----------
  function setActive(shoe) {
    if (state.active === shoe) return;
    if (state.active) {
      gsap.to(state.active.userData.pedestal, { emissiveIntensity: 1.1, duration: 0.6 });
      state.active.userData.hot = false;
    }
    state.active = shoe;
    if (shoe) {
      gsap.to(shoe.userData.pedestal, { emissiveIntensity: 2.6, duration: 0.5 });
      shoe.userData.hot = true;
      ui.showProduct(shoe.userData, () => shoe);
    }
  }

  // ---------- turn toward a category (turn your head) ----------
  function turnTo(index, opts = {}) {
    state.cat = index;
    const target = shortestYaw(state.baseYaw, wallYaw[index]);
    gsap.to(state, { baseYaw: target, duration: opts.fast ? 1.1 : 1.7, ease: 'power3.inOut' });
    ui.setActiveChip(index);
    audio.tick();
  }

  function shortestYaw(from, to) {
    let d = ((to - from) % (Math.PI * 2));
    if (d > Math.PI) d -= Math.PI * 2;
    if (d < -Math.PI) d += Math.PI * 2;
    return from + d;
  }

  // ---------- the cinematic entry ----------
  function enter(onArrive) {
    if (state.name !== 'mall') return;
    state.name = 'entering';
    audio.enable(); audio.door();

    const doors = world.mall.userData.doors;
    const tl = gsap.timeline({
      onComplete() {
        state.name = 'store';
        audio.setInterior(true);
        state.canPick = true;
        // face the department nearest to where we're looking
        let best = 0, bestD = Infinity;
        wallYaw.forEach((wy, i) => { const d = Math.abs(shortestYaw(state.baseYaw, wy) - state.baseYaw); if (d < bestD) { bestD = d; best = i; } });
        turnTo(best, { fast: true });
        onArrive && onArrive();
      },
    });

    // doors slide open
    tl.to(doors.left.position, { x: -2.3, duration: 1.6, ease: 'power2.inOut' }, 0);
    tl.to(doors.right.position, { x: 2.3, duration: 1.6, ease: 'power2.inOut' }, 0);

    // walk forward across the threshold to the centre of the store
    const walk = { z: camera.position.z, step: 0 };
    tl.to(walk, {
      z: 0, duration: 4.4, ease: 'power2.inOut',
      onUpdate() {
        camera.position.z = walk.z;
        // subtle head bob + footfalls
        camera.position.y = 1.62 + Math.sin(walk.z * 2.4) * 0.03;
        const s = Math.floor((20 - walk.z) / 1.4);
        if (s !== walk.step) { walk.step = s; audio.footstep(); }
      },
    }, 0.5);

    // settle exposure as we move inside
    tl.to(ctx.renderer, { toneMappingExposure: 1.0, duration: 3.5, ease: 'power1.inOut' }, 0.8);

    return tl;
  }

  // ---------- keyboard: turn head with arrows ----------
  function onKey(e) {
    if (state.name !== 'store') return;
    if (e.key === 'ArrowRight') turnTo((state.cat + 1) % wallYaw.length);
    else if (e.key === 'ArrowLeft') turnTo((state.cat - 1 + wallYaw.length) % wallYaw.length);
  }

  window.addEventListener('pointermove', onPointerMove);
  window.addEventListener('click', onClick);
  window.addEventListener('keydown', onKey);

  // ---------- per-frame ----------
  function update(dt, t) {
    // eased look (cursor inertia)
    mouse.x += (mouse.tx - mouse.x) * Math.min(1, dt * 4);
    mouse.y += (mouse.ty - mouse.y) * Math.min(1, dt * 4);

    if (needsRaycast) { needsRaycast = false; const h = pick(); if (h) setActive(h); ui.setHot(!!h); }

    const parY = mouse.x * 0.16;
    const parX = -mouse.y * 0.10;
    const bob = state.name === 'store' ? Math.sin(t * 0.6) * 0.006 : 0;
    camera.rotation.y = state.baseYaw + parY;
    camera.rotation.x = state.basePitch + parX + bob;

    if (state.name === 'store') {
      camera.position.x = Math.sin(t * 0.25) * 0.04;
      camera.position.z = Math.cos(t * 0.2) * 0.04;
      camera.position.y = 1.62 + Math.sin(t * 0.5) * 0.01;
    }

    // presentation spin for every shoe, faster for the active one
    world.wallGroups.forEach((w) => {
      w.children.forEach((disp) => {
        const shoe = disp.userData && disp.userData.shoe;
        if (!shoe) return;
        const spin = shoe.userData.spin;
        const speed = shoe.userData.hot ? 0.9 : 0.12;
        spin.rotation.y += speed * dt;
        const targetY = shoe.userData.baseY + (shoe.userData.hot ? 0.08 : 0);
        shoe.position.y += (targetY - shoe.position.y) * Math.min(1, dt * 5);
      });
    });
  }

  return { state, update, turnTo, enter, setActive };
}
