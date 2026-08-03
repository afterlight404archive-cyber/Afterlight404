/* ===================================================================
   bgmusic.js — original ambient piano, in the spirit of C418's
   Minecraft soundtrack (sparse notes, long reverb tails, lots of open
   space) — but a fully original composition generated live in the
   browser, so there's no melody or sample being copied and nothing to
   claim rights over.
   ===================================================================
   How it works:
   - A handful of soft piano-style notes, picked from a simple major
     scale, are played in short 3–6 note phrases with a long, generous
     reverb tail (built procedurally, not sampled from anywhere).
   - Between phrases there's a real pause — 4 to 10 seconds of near
     silence, just like the Minecraft soundtrack's pacing — which is
     what gives this style its calm, "exploring alone" feel.
   - A very quiet, slow-moving low drone occasionally underpins it for
     warmth, without ever becoming a "song" you'd recognize.
   - Notes, phrase shapes, gaps and drone timing are all randomized
     with no fixed cycle, so a 20–30 minute sit never repeats itself.

   Plays as soon as the visitor lands, if the browser allows it; if
   the browser's autoplay policy blocks audio before any interaction
   (most do), it starts the instant they first click/tap/scroll
   anywhere on the page. It only stops when they hit mute, and that
   choice is remembered for next time.

   Public API (used by index.html):
     window.AfterlightBGM.toggle()
     window.AfterlightBGM.isPlaying()
   ================================================================= */
(function () {
  'use strict';

  const STORAGE_KEY = 'al-bgm-enabled';

  let ctx = null;
  let master = null;
  let dry = null;
  let convolver = null;
  let wetGain = null;
  let wetFilter = null;
  let playing = false;
  let started = false;
  let phraseTimer = null;
  let droneTimer = null;

  // A simple, warm major scale (C major, two octaves) — deliberately
  // plain and consonant, the way the Minecraft soundtrack leans on
  // open, unresolved-feeling piano tones rather than busy harmony.
  const SCALE = [
    130.81, 146.83, 164.81, 196.00, 220.00,           // C3 D3 E3 G3 A3
    261.63, 293.66, 329.63, 392.00, 440.00, 523.25,   // C4 D4 E4 G4 A4 C5
  ];
  const DRONE_NOTES = [65.41, 73.42, 87.31, 98.00];   // C2 D2 F2 G2 — root tones

  function buildReverbImpulse() {
    // A procedurally-generated reverb tail (no sample, no file) — soft,
    // lightly filtered noise with a long exponential decay, giving the
    // notes that big, airy "room" trail without ever sounding harsh.
    const duration = 4.2;
    const decayPow = 3.2;
    const rate = ctx.sampleRate;
    const length = Math.floor(rate * duration);
    const impulse = ctx.createBuffer(2, length, rate);
    for (let ch = 0; ch < 2; ch++) {
      const data = impulse.getChannelData(ch);
      let lp = 0;
      for (let i = 0; i < length; i++) {
        const white = Math.random() * 2 - 1;
        lp += 0.06 * (white - lp); // gentle low-pass so it's soft, not hissy
        const env = Math.pow(1 - i / length, decayPow);
        data[i] = lp * env;
      }
    }
    return impulse;
  }

  function ensureContext() {
    if (ctx) return;
    ctx = new (window.AudioContext || window.webkitAudioContext)();

    master = ctx.createGain();
    master.gain.value = 0;
    master.connect(ctx.destination);

    dry = ctx.createGain();
    dry.gain.value = 0.55;
    dry.connect(master);

    convolver = ctx.createConvolver();
    convolver.buffer = buildReverbImpulse();
    convolver.normalize = true;

    wetFilter = ctx.createBiquadFilter();
    wetFilter.type = 'lowpass';
    wetFilter.frequency.value = 2600;

    wetGain = ctx.createGain();
    wetGain.gain.value = 0.55; // a generous, spacious tail like the reference style

    convolver.connect(wetFilter);
    wetFilter.connect(wetGain);
    wetGain.connect(master);
  }

  function playPianoNote(freq, startTime, velocity) {
    // Two slightly detuned tones (a soft fundamental + a quiet octave
    // partial) with a fast attack and a slow piano-like decay.
    const g = ctx.createGain();
    const peak = 0.16 * velocity;
    g.gain.setValueAtTime(0, startTime);
    g.gain.linearRampToValueAtTime(peak, startTime + 0.008);
    g.gain.exponentialRampToValueAtTime(0.0008, startTime + 3.6);
    g.connect(dry);
    g.connect(convolver);

    const osc1 = ctx.createOscillator();
    osc1.type = 'triangle';
    osc1.frequency.value = freq;
    osc1.detune.value = -3;
    osc1.connect(g);
    osc1.start(startTime);
    osc1.stop(startTime + 4);

    const osc2 = ctx.createOscillator();
    osc2.type = 'sine';
    osc2.frequency.value = freq * 2;
    const g2 = ctx.createGain();
    g2.gain.setValueAtTime(0, startTime);
    g2.gain.linearRampToValueAtTime(peak * 0.18, startTime + 0.008);
    g2.gain.exponentialRampToValueAtTime(0.0006, startTime + 2.4);
    osc2.connect(g2);
    g2.connect(dry);
    g2.connect(convolver);
    osc2.start(startTime);
    osc2.stop(startTime + 2.6);
  }

  function playDrone() {
    if (!playing) return;
    const freq = DRONE_NOTES[Math.floor(Math.random() * DRONE_NOTES.length)];
    const start = ctx.currentTime + 0.2;
    const dur = 22 + Math.random() * 14; // 22–36s, very slow
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, start);
    g.gain.linearRampToValueAtTime(0.035, start + 6);
    g.gain.linearRampToValueAtTime(0.0, start + dur);
    g.connect(dry);
    g.connect(convolver);

    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.value = freq;
    osc.connect(g);
    osc.start(start);
    osc.stop(start + dur + 0.5);

    droneTimer = setTimeout(playDrone, dur * 1000 * 0.9);
  }

  function playPhrase() {
    if (!playing) return;
    const now = ctx.currentTime;
    const noteCount = 3 + Math.floor(Math.random() * 4); // 3–6 notes
    let t = now + 0.1;
    let idx = Math.floor(Math.random() * SCALE.length);

    for (let i = 0; i < noteCount; i++) {
      // Mostly small steps up or down the scale, occasionally a leap —
      // gives a gentle, wandering melodic shape rather than randomness.
      const step = Math.random() < 0.7
        ? (Math.random() < 0.5 ? -1 : 1) * (Math.random() < 0.8 ? 1 : 2)
        : (Math.random() < 0.5 ? -1 : 1) * 3;
      idx = Math.max(0, Math.min(SCALE.length - 1, idx + step));

      const velocity = 0.6 + Math.random() * 0.4;
      playPianoNote(SCALE[idx], t, velocity);

      // Notes don't fall on a strict grid — small timing variation
      // keeps it feeling played, not sequenced.
      t += 0.55 + Math.random() * 0.85;
    }

    // The real character of this style: a long rest before the next
    // phrase, so it never feels busy or loop-like.
    const rest = 4 + Math.random() * 6;
    const totalWait = (t - now) + rest;
    phraseTimer = setTimeout(() => { if (playing) playPhrase(); }, totalWait * 1000);
  }

  function fadeTo(value, seconds) {
    if (!ctx) return;
    const now = ctx.currentTime;
    master.gain.cancelScheduledValues(now);
    master.gain.setValueAtTime(master.gain.value, now);
    master.gain.linearRampToValueAtTime(value, now + seconds);
  }

  function start() {
    ensureContext();
    if (ctx.state === 'suspended') ctx.resume();
    playing = true;
    fadeTo(0.8, 2.0);
    if (!started) {
      started = true;
      playPhrase();
      droneTimer = setTimeout(playDrone, 3000);
    }
    updateIcon();
  }

  function stop() {
    playing = false;
    if (phraseTimer) { clearTimeout(phraseTimer); phraseTimer = null; }
    if (droneTimer) { clearTimeout(droneTimer); droneTimer = null; }
    if (ctx) fadeTo(0, 0.6);
    updateIcon();
  }

  function toggle() {
    if (playing) {
      stop();
      try { localStorage.setItem(STORAGE_KEY, '0'); } catch (e) {}
    } else {
      start();
      try { localStorage.setItem(STORAGE_KEY, '1'); } catch (e) {}
    }
  }

  function updateIcon() {
    const btn = document.getElementById('bgm-toggle-btn');
    if (!btn) return;
    btn.classList.toggle('is-playing', playing);
    btn.setAttribute('aria-pressed', playing ? 'true' : 'false');
    btn.setAttribute('aria-label', playing ? 'Mute background music' : 'Play background music');
    btn.title = playing ? 'Mute background music' : 'Play background music';
  }

  function wasExplicitlyMuted() {
    try { return localStorage.getItem(STORAGE_KEY) === '0'; } catch (e) { return false; }
  }

  function attemptAutoplay() {
    if (wasExplicitlyMuted()) { updateIcon(); return; }

    ensureContext();
    start();
    if (ctx.state === 'running') return;

    const kick = () => {
      start();
      ['pointerdown', 'touchstart', 'keydown', 'scroll', 'wheel'].forEach((evt) =>
        document.removeEventListener(evt, kick, true)
      );
    };
    ['pointerdown', 'touchstart', 'keydown', 'scroll', 'wheel'].forEach((evt) =>
      document.addEventListener(evt, kick, true)
    );
  }

  document.addEventListener('DOMContentLoaded', function () {
    const btn = document.getElementById('bgm-toggle-btn');
    if (btn) btn.addEventListener('click', toggle);
    attemptAutoplay();
  });

  window.AfterlightBGM = { toggle, isPlaying: () => playing };
})();
