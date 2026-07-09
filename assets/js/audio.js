/* =========================================================
   Fully synthesised sound — no audio files to load.
   Mall ambience pad + brown-noise room tone, plus one-shot
   footsteps, a glass-door whoosh and soft UI ticks.
   ========================================================= */
export function createAudio() {
  let ctx = null, master = null, ambGain = null, on = false, started = false;
  const nodes = {};

  function ensure() {
    if (ctx) return;
    const AC = window.AudioContext || window.webkitAudioContext;
    ctx = new AC();
    master = ctx.createGain(); master.gain.value = 0.0; master.connect(ctx.destination);
    ambGain = ctx.createGain(); ambGain.gain.value = 0.0; ambGain.connect(master);
  }

  // warm evolving pad from a few detuned oscillators
  function buildAmbience() {
    if (started) return; started = true;
    const chord = [110, 164.81, 220, 277.18]; // A minor-ish warmth
    chord.forEach((f, i) => {
      const o = ctx.createOscillator(); o.type = i % 2 ? 'sine' : 'triangle';
      o.frequency.value = f;
      const g = ctx.createGain(); g.gain.value = 0.06 / (i + 1);
      const lfo = ctx.createOscillator(); lfo.frequency.value = 0.05 + i * 0.03;
      const lfoG = ctx.createGain(); lfoG.gain.value = 0.03;
      lfo.connect(lfoG); lfoG.connect(g.gain);
      o.connect(g); g.connect(ambGain); o.start(); lfo.start();
    });

    // brown-noise room tone
    const bufSize = 2 * ctx.sampleRate;
    const buffer = ctx.createBuffer(1, bufSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let last = 0;
    for (let i = 0; i < bufSize; i++) {
      const white = Math.random() * 2 - 1;
      last = (last + 0.02 * white) / 1.02; data[i] = last * 3.2;
    }
    const noise = ctx.createBufferSource(); noise.buffer = buffer; noise.loop = true;
    const nf = ctx.createBiquadFilter(); nf.type = 'lowpass'; nf.frequency.value = 480;
    const ng = ctx.createGain(); ng.gain.value = 0.05;
    noise.connect(nf); nf.connect(ng); ng.connect(ambGain); noise.start();
  }

  function fade(node, to, t = 0.6) {
    if (!node) return;
    node.gain.cancelScheduledValues(ctx.currentTime);
    node.gain.setValueAtTime(node.gain.value, ctx.currentTime);
    node.gain.linearRampToValueAtTime(to, ctx.currentTime + t);
  }

  return {
    get on() { return on; },
    unlock() { ensure(); if (ctx.state === 'suspended') ctx.resume(); },
    enable() {
      ensure(); if (ctx.state === 'suspended') ctx.resume();
      buildAmbience(); on = true;
      fade(master, 0.9, 1.2); fade(ambGain, 0.5, 2.0);
    },
    toggle() {
      ensure(); if (ctx.state === 'suspended') ctx.resume();
      if (!started) buildAmbience();
      on = !on; fade(master, on ? 0.9 : 0.0, 0.8);
      return on;
    },
    setInterior(v) { if (started) fade(ambGain, v ? 0.28 : 0.5, 1.6); },

    tick() {
      if (!ctx || !on) return;
      const o = ctx.createOscillator(); o.type = 'sine'; o.frequency.value = 880;
      const g = ctx.createGain(); g.gain.value = 0.0;
      o.connect(g); g.connect(master);
      const t = ctx.currentTime;
      g.gain.setValueAtTime(0.0, t); g.gain.linearRampToValueAtTime(0.05, t + 0.005); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.12);
      o.start(t); o.stop(t + 0.14);
    },
    footstep() {
      if (!ctx || !on) return;
      const bufSize = 0.15 * ctx.sampleRate;
      const buffer = ctx.createBuffer(1, bufSize, ctx.sampleRate);
      const d = buffer.getChannelData(0);
      for (let i = 0; i < bufSize; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufSize, 4);
      const src = ctx.createBufferSource(); src.buffer = buffer;
      const f = ctx.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = 300;
      const g = ctx.createGain(); g.gain.value = 0.35;
      src.connect(f); f.connect(g); g.connect(master); src.start();
    },
    door() {
      if (!ctx || !on) return;
      const bufSize = 1.4 * ctx.sampleRate;
      const buffer = ctx.createBuffer(1, bufSize, ctx.sampleRate);
      const d = buffer.getChannelData(0);
      for (let i = 0; i < bufSize; i++) d[i] = (Math.random() * 2 - 1);
      const src = ctx.createBufferSource(); src.buffer = buffer;
      const f = ctx.createBiquadFilter(); f.type = 'bandpass'; f.frequency.value = 700; f.Q.value = 0.7;
      const g = ctx.createGain();
      const t = ctx.currentTime;
      g.gain.setValueAtTime(0.0, t); g.gain.linearRampToValueAtTime(0.14, t + 0.4); g.gain.linearRampToValueAtTime(0.0, t + 1.3);
      f.frequency.setValueAtTime(500, t); f.frequency.linearRampToValueAtTime(1400, t + 1.2);
      src.connect(f); f.connect(g); g.connect(master); src.start();
    },
  };
}
