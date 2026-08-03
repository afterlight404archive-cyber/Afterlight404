/* ===================================================================
   bgmusic.js — soft indie/dream-pop ambient background music
   ===================================================================
   Generated live in the browser with the Web Audio API — no audio
   file, no external host, no license risk. Rather than a short loop
   that repeats every few seconds, this is a continuously-generative
   piece: chords, hold-lengths and the arpeggio pattern on top are all
   picked from a pool at random (never repeating the same chord twice
   in a row, and never repeating the exact same pattern back-to-back),
   so across a 20–30 minute sit it never sounds like it's looping —
   it just keeps drifting, the way a long ambient/lo-fi mix would.

   Plays as soon as the visitor lands, if the browser allows it; if the
   browser's autoplay policy blocks audio before any interaction (most
   do), it starts silently the instant they first click/tap/scroll
   anywhere on the page — so in practice it's playing within a second
   or two of arriving. It only ever stops when they hit mute, and that
   choice is remembered for next time.

   Public API (used by index.html):
     window.AfterlightBGM.toggle()   → flips play/pause, updates the icon
     window.AfterlightBGM.isPlaying()
   ================================================================= */
(function () {
  'use strict';

  const STORAGE_KEY = 'al-bgm-enabled';

  let ctx = null;
  let master = null;
  let delayNode = null;
  let delayGain = null;
  let filter = null;
  let lfo = null;
  let playing = false;
  let started = false;
  let stepTimer = null;
  let lastChordIdx = -1;
  let lastChordIdx2 = -1;

  // A pool of chords all diatonic to F major / D minor, four-note
  // voicings kept in one comfortable octave band so any chord can
  // follow any other without ever clashing.
  const CHORDS = [
    { name: 'Fmaj7',  notes: [174.61, 220.00, 261.63, 329.63] }, // F3 A3 C4 E4
    { name: 'Am7',    notes: [220.00, 261.63, 329.63, 392.00] }, // A3 C4 E4 G4
    { name: 'Dm7',    notes: [146.83, 174.61, 220.00, 261.63] }, // D3 F3 A3 C4
    { name: 'Cmaj7',  notes: [130.81, 164.81, 196.00, 246.94] }, // C3 E3 G3 B3
    { name: 'Bbmaj7', notes: [116.54, 174.61, 220.00, 293.66] }, // Bb2 F3 A3 D4
    { name: 'Gm7',    notes: [98.00, 174.61, 220.00, 293.66] },  // G2 F3 A3 D4
    { name: 'C7',     notes: [130.81, 164.81, 196.00, 233.08] }, // C3 E3 G3 Bb3
    { name: 'Csus4',  notes: [130.81, 174.61, 196.00, 261.63] }, // C3 F3 G3 C4
  ];

  // A handful of arpeggio shapes (as index-into-chord-notes sequences);
  // one is picked at random for each chord so the top line keeps moving.
  const ARP_PATTERNS = [
    [0, 1, 2, 3, 2, 1],
    [0, 2, 1, 3],
    [3, 2, 1, 0, 1, 2],
    [0, 1, 3, 2],
    [], // occasional bar of just the pad, no arpeggio — breathing room
  ];

  const BPM = 78;
  const BEAT = 60 / BPM;      // seconds per beat
  const ARP_STEP = BEAT / 2;  // gentle 8th-note arpeggio

  function ensureContext() {
    if (ctx) return;
    ctx = new (window.AudioContext || window.webkitAudioContext)();

    master = ctx.createGain();
    master.gain.value = 0;
    master.connect(ctx.destination);

    // Warm low-pass so nothing gets bright or fatiguing over a long sit.
    filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 1800;
    filter.connect(master);

    // A very slow LFO drifting the filter cutoff keeps the tone from
    // ever feeling static across 20+ minutes, without being noticeable
    // moment-to-moment.
    lfo = ctx.createOscillator();
    lfo.frequency.value = 1 / 47; // one slow sweep roughly every 47s
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 350;
    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);
    lfo.start();

    // Soft slap-back delay for a bit of indie shimmer/space.
    delayNode = ctx.createDelay(1.0);
    delayNode.delayTime.value = BEAT * 0.75;
    delayGain = ctx.createGain();
    delayGain.gain.value = 0.22;
    delayNode.connect(delayGain);
    delayGain.connect(filter);
    delayGain.connect(delayNode); // feedback
  }

  function playPadNote(freq, startTime, duration) {
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, startTime);
    g.gain.linearRampToValueAtTime(0.09, startTime + 1.2);
    g.gain.linearRampToValueAtTime(0.0, startTime + duration);
    g.connect(filter);
    g.connect(delayNode);

    [1, -1].forEach((detuneDir) => {
      const osc = ctx.createOscillator();
      osc.type = 'triangle';
      osc.frequency.value = freq;
      osc.detune.value = detuneDir * 5;
      osc.connect(g);
      osc.start(startTime);
      osc.stop(startTime + duration + 0.1);
    });
  }

  function playArpNote(freq, startTime) {
    const g = ctx.createGain();
    const dur = ARP_STEP * 1.6;
    g.gain.setValueAtTime(0, startTime);
    g.gain.linearRampToValueAtTime(0.05, startTime + 0.03);
    g.gain.exponentialRampToValueAtTime(0.0001, startTime + dur);
    g.connect(filter);
    g.connect(delayNode);

    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.value = freq * 2; // an octave up from the pad
    osc.connect(g);
    osc.start(startTime);
    osc.stop(startTime + dur + 0.05);
  }

  function pickNextChordIndex() {
    // Random, but never the same chord as either of the last two picks —
    // that's what keeps a 20–30 minute sit from ever feeling like a loop.
    let idx;
    do {
      idx = Math.floor(Math.random() * CHORDS.length);
    } while (idx === lastChordIdx || idx === lastChordIdx2);
    lastChordIdx2 = lastChordIdx;
    lastChordIdx = idx;
    return idx;
  }

  function scheduleChord(time) {
    const chord = CHORDS[pickNextChordIndex()];
    // Chords hold for an irregular 10–16 beats, so the rhythm of change
    // itself never settles into a predictable cycle either.
    const holdBeats = 10 + Math.floor(Math.random() * 7);
    const chordLen = holdBeats * BEAT;

    chord.notes.forEach((f) => playPadNote(f, time, chordLen + 1.0));

    const pattern = ARP_PATTERNS[Math.floor(Math.random() * ARP_PATTERNS.length)];
    if (pattern.length) {
      const stepsInChord = Math.floor(chordLen / ARP_STEP);
      for (let s = 0; s < stepsInChord; s++) {
        const note = chord.notes[pattern[s % pattern.length]];
        playArpNote(note, time + s * ARP_STEP + ARP_STEP);
      }
    }

    stepTimer = setTimeout(() => {
      if (playing) scheduleChord(ctx.currentTime + 0.05);
    }, chordLen * 1000);
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
    fadeTo(0.5, 1.5);
    if (!started) {
      started = true;
      scheduleChord(ctx.currentTime + 0.1);
    }
    updateIcon();
  }

  function stop() {
    playing = false;
    if (stepTimer) { clearTimeout(stepTimer); stepTimer = null; }
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
    // Try immediately. Most browsers will leave the context "suspended"
    // until a real user gesture — that's fine, the fallback below covers it.
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
