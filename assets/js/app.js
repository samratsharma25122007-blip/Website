import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { GTAOPass } from 'three/addons/postprocessing/GTAOPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';

import { buildWorld } from './scene/world.js';
import { createAudio } from './audio.js';
import { createUI } from './ui.js';
import { createControls } from './controls.js';

const loader = document.getElementById('loader');
const loaderBar = document.getElementById('loaderBar');
const loaderHint = document.getElementById('loaderHint');
const setProgress = (p, hint) => { loaderBar.style.width = Math.round(p * 100) + '%'; if (hint) loaderHint.textContent = hint; };

boot().catch((err) => {
  console.error(err);
  loaderHint.textContent = 'Your browser could not open the boutique (WebGL required).';
});

async function boot() {
  const canvas = document.getElementById('scene');
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.92;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  setProgress(0.15, 'Warming the lights…');

  const scene = new THREE.Scene();
  scene.background = new THREE.Color('#0e0b08');
  scene.fog = new THREE.FogExp2('#140f0a', 0.023);

  const camera = new THREE.PerspectiveCamera(56, window.innerWidth / window.innerHeight, 0.1, 140);

  // image-based lighting for believable PBR (glass, leather, metal)
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  setProgress(0.35, 'Polishing the floors…');

  // wait for display fonts so canvas signage renders crisply
  try { await Promise.race([document.fonts.ready, wait(2500)]); } catch (e) {}
  setProgress(0.55, 'Arranging the collection…');

  const ctx = { scene, camera, renderer };
  const world = buildWorld(ctx);
  ctx.world = world;
  setProgress(0.78, 'Lighting the displays…');

  // ---------- post-processing ----------
  const composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));

  // GTAO — soft contact ambient occlusion for realistic grounding
  const gtao = new GTAOPass(scene, camera, window.innerWidth, window.innerHeight);
  gtao.output = GTAOPass.OUTPUT.Default;
  gtao.updateGtaoMaterial({ radius: 0.5, distanceExponent: 1.0, thickness: 1.0, scale: 1.1, samples: 16, screenSpaceRadius: false });
  composer.addPass(gtao);

  const bloom = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 0.34, 0.45, 0.92);
  composer.addPass(bloom);
  composer.addPass(new ShaderPass(VignetteGrain));
  composer.addPass(new OutputPass());
  ctx.composer = composer;

  // ---------- systems ----------
  const audio = createAudio();
  ctx.audio = audio;
  const ui = createUI(ctx);
  ctx.ui = ui;
  const controls = createControls(ctx);
  ctx.controls = controls;

  ui.buildChips((i) => controls.turnTo(i));

  // ---------- explore → enter ----------
  document.getElementById('exploreBtn').addEventListener('click', () => {
    audio.unlock();
    document.getElementById('mallUI').classList.add('is-hidden');
    controls.enter(() => {
      document.getElementById('storeUI').classList.remove('is-hidden');
      ui.revealStoreUI();
      document.getElementById('soundBtn').classList.add('is-on');
      const nudge = document.querySelector('.nudge');
      nudge.classList.add('show');
      setTimeout(() => nudge.classList.remove('show'), 6000);
    });
  });
  document.getElementById('homeBtn').addEventListener('click', () => controls.turnTo(0));

  // ---------- resize ----------
  window.addEventListener('resize', () => {
    const w = window.innerWidth, h = window.innerHeight;
    camera.aspect = w / h; camera.updateProjectionMatrix();
    renderer.setSize(w, h); composer.setSize(w, h);
    bloom.setSize(w, h); gtao.setSize(w, h);
  });

  // ---------- reveal ----------
  setProgress(1.0, 'Welcome');
  await wait(500);
  loader.classList.add('is-done');
  document.getElementById('mallUI').classList.remove('is-hidden');

  // ---------- loop ----------
  const clock = new THREE.Clock();
  renderer.setAnimationLoop(() => {
    const dt = Math.min(clock.getDelta(), 0.05);
    const t = clock.elapsedTime;
    controls.update(dt, t);

    // drifting dust
    const pos = world.particles.geometry.attributes.position;
    for (let i = 1; i < pos.count * 3; i += 3) {
      pos.array[i] += Math.sin(t * 0.3 + i) * 0.0006 + 0.0009;
      if (pos.array[i] > 4.4) pos.array[i] = 0;
    }
    pos.needsUpdate = true;

    // foot-traffic silhouettes
    const walkers = world.mall.userData.walkers;
    if (walkers) walkers.children.forEach((p) => {
      p.position.x += p.userData.speed * p.userData.dir;
      if (Math.abs(p.position.x) > 5) p.userData.dir *= -1;
      p.lookAt(camera.position.x, p.position.y, camera.position.z);
    });

    VignetteGrain.uniforms.uTime.value = t;
    composer.render();
  });
}

function wait(ms) { return new Promise((r) => setTimeout(r, ms)); }

/* subtle cinematic vignette + film grain */
const VignetteGrain = {
  uniforms: { tDiffuse: { value: null }, uTime: { value: 0 } },
  vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`,
  fragmentShader: `
    uniform sampler2D tDiffuse; uniform float uTime; varying vec2 vUv;
    float rand(vec2 c){ return fract(sin(dot(c, vec2(12.9898,78.233))) * 43758.5453); }
    void main(){
      vec4 col = texture2D(tDiffuse, vUv);
      float d = distance(vUv, vec2(0.5));
      float vig = smoothstep(0.92, 0.32, d);
      col.rgb *= mix(0.74, 1.0, vig);
      col.rgb += (rand(vUv + fract(uTime)) - 0.5) * 0.03;
      gl_FragColor = col;
    }`,
};
