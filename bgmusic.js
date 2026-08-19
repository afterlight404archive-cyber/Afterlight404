/* ===================================================================
   bgmusic.js — original, fully browser-generated background music.
   Nothing here is a sample or a file — every note is synthesized
   live with the Web Audio API, so there's no melody being copied and
   nothing to claim rights over.
   ===================================================================
   This is a small PLAYLIST of independent tracks (see TRACKS below).
   Only one plays at a time; the vinyl widget on the homepage (and the
   speaker icon in the header) control the same shared engine:

     - Play/Pause  → toggle()
     - Next        → next()   (switches to the next track in TRACKS)
     - Prev        → prev()   (switches to the previous track)

   Add more tracks over time by pushing another { name, start, stop }
   entry onto TRACKS — nothing else needs to change.

   Tracks included so far:
     1. "Ambient Piano"           — soft, endless, never-repeating
                                     piano wander (the original track).
     2. "Retro Arcade"            — an actual 8-bit chiptune loop:
                                     pulse-wave arpeggios, a bouncy
                                     triangle bassline, and a soft
                                     noise hi-hat moving at a real
                                     arcade tempo (100 BPM), filtered
                                     and kept gentle so it still reads
                                     as calm rather than frantic.
     3. "Acoustic Fingerpicking"  — a Travis-picking guitar loop built
                                     from real Karplus-Strong plucked-
                                     string synthesis (no samples),
                                     played over a soft, familiar
                                     chord progression.
     4. "Neon Pulse"              — a hypnotic, echo-drenched electronic
                                     pulse in the vein of atmospheric
                                     mobile-game soundtracks: a deep sub
                                     bass heartbeat under a glassy,
                                     minor-key arpeggio that trails off
                                     into its own delayed repeats. No
                                     melody is copied from anywhere —
                                     it's an original progression built
                                     from scratch with oscillators and a
                                     feedback delay line.

   Plays as soon as the visitor lands, if the browser allows it; if
   the browser's autoplay policy blocks audio before any interaction
   (most do), it starts the instant they first click/tap/scroll
   anywhere on the page. It only stops when they hit mute, and that
   choice (and the last track picked) is remembered for next time.

   Public API (used by index.html / app.js's vinyl widget):
     window.AfterlightBGM.toggle()
     window.AfterlightBGM.isPlaying()
     window.AfterlightBGM.next()
     window.AfterlightBGM.prev()
     window.AfterlightBGM.getCurrentTrackName()
     window.AfterlightBGM.getTracks()
   Fires a 'afterlight-bgm-trackchange' event on `document` (detail:
   { name, index, playing }) whenever play state or track changes, so
   any UI (like the vinyl widget) can stay in sync without polling.
   ================================================================= */
(function () {
  'use strict';

  const STORAGE_KEY = 'al-bgm-enabled';
  const TRACK_STORAGE_KEY = 'al-bgm-track';

  let ctx = null;
  let master = null;
  let dry = null;
  let convolver = null;
  let wetGain = null;
  let wetFilter = null;
  let playing = false;

  // ═══════════════════════════════════════════════════════════════
  //  SHARED AUDIO GRAPH (every track routes through this same
  //  dry + procedural-reverb chain, so switching tracks doesn't
  //  change the overall "room" feel)
  // ═══════════════════════════════════════════════════════════════

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

  function fadeTo(value, seconds) {
    if (!ctx) return;
    const now = ctx.currentTime;
    master.gain.cancelScheduledValues(now);
    master.gain.setValueAtTime(master.gain.value, now);
    master.gain.linearRampToValueAtTime(value, now + seconds);
  }

  // ═══════════════════════════════════════════════════════════════
  //  TRACK 1 — "Ambient Piano" (the original track, unchanged)
  // ═══════════════════════════════════════════════════════════════

  const SCALE = [
    130.81, 146.83, 164.81, 196.00, 220.00,           // C3 D3 E3 G3 A3
    261.63, 293.66, 329.63, 392.00, 440.00, 523.25,   // C4 D4 E4 G4 A4 C5
  ];
  const DRONE_NOTES = [65.41, 73.42, 87.31, 98.00];   // C2 D2 F2 G2 — root tones

  let phraseTimer = null;
  let droneTimer = null;
  let melodyIdx = Math.floor(Math.random() * SCALE.length);

  function playPianoNote(freq, startTime, velocity) {
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
    if (!playing || currentTrackIndex !== 0) return;
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

    droneTimer = setTimeout(playDrone, dur * 1000 * 0.55);
  }

  function playPhrase() {
    if (!playing || currentTrackIndex !== 0) return;
    const now = ctx.currentTime;
    const noteCount = 4 + Math.floor(Math.random() * 5); // 4–8 notes
    let t = now + 0.05;

    for (let i = 0; i < noteCount; i++) {
      const step = Math.random() < 0.7
        ? (Math.random() < 0.5 ? -1 : 1) * (Math.random() < 0.8 ? 1 : 2)
        : (Math.random() < 0.5 ? -1 : 1) * 3;
      melodyIdx = Math.max(0, Math.min(SCALE.length - 1, melodyIdx + step));

      const velocity = 0.6 + Math.random() * 0.4;
      playPianoNote(SCALE[melodyIdx], t, velocity);
      t += 0.5 + Math.random() * 0.6;
    }

    const gap = 0.15 + Math.random() * 0.35;
    const totalWait = (t - now) + gap;
    phraseTimer = setTimeout(() => { if (playing) playPhrase(); }, totalWait * 1000);
  }

  function startPianoTrack() {
    playPhrase();
    droneTimer = setTimeout(playDrone, 3000);
  }
  function stopPianoTrack() {
    if (phraseTimer) { clearTimeout(phraseTimer); phraseTimer = null; }
    if (droneTimer) { clearTimeout(droneTimer); droneTimer = null; }
  }

  // ═══════════════════════════════════════════════════════════════
  //  TRACK 2 — "Retro Arcade"
  //  A proper 8-bit overworld-style loop: real chiptune instruments
  //  (pulse-wave arpeggios, a bouncy triangle bassline, a soft noise
  //  hi-hat) moving at an actual arcade tempo, so it reads instantly
  //  as "retro game" — but everything is kept soft, filtered, and
  //  harmonically simple so the vibe stays calm and easy to sit with
  //  rather than frantic. Chords last a full bar each, so it still
  //  breathes, it just isn't dead air between notes anymore.
  // ═══════════════════════════════════════════════════════════════

  const ARCADE_BPM = 100;
  const ARCADE_BEAT = 60 / ARCADE_BPM;         // seconds per beat
  const ARCADE_STEP = ARCADE_BEAT / 4;          // 16th-note step
  const ARCADE_BAR_SECONDS = ARCADE_BEAT * 4;   // 4 beats per bar
  // [root, third, fifth] triads in Hz — the same easy, unmistakably
  // "game overworld" natural-minor progression as before.
  const ARCADE_PROGRESSION = [
    [220.00, 261.63, 329.63], // Am
    [174.61, 220.00, 261.63], // F
    [130.81, 164.81, 196.00], // C
    [196.00, 246.94, 293.66], // G
    [220.00, 261.63, 329.63], // Am
    [146.83, 174.61, 220.00], // Dm
    [196.00, 246.94, 293.66], // G
    [130.81, 164.81, 196.00], // C
    [220.00, 261.63, 329.63], // Am
    [174.61, 220.00, 261.63], // F
    [130.81, 164.81, 196.00], // C
    [164.81, 196.00, 246.94], // Em
    [146.83, 174.61, 220.00], // Dm
    [196.00, 246.94, 293.66], // G
    [220.00, 261.63, 329.63], // Am
    [164.81, 207.65, 246.94], // E — gentle tension right before the loop resets
  ];
  // Classic NES-style 16-step arpeggio shape: root-third-fifth-third,
  // with an octave "flourish" on the last step of every other bar.
  const ARCADE_ARP_PATTERN = [0, 1, 2, 1, 0, 1, 2, 1, 0, 1, 2, 1, 0, 1, 2, 3];

  let arcadeTimer = null;
  let arcadeBarIdx = 0;
  let arcadeFilter = null; // shared lowpass so the pulse lead stays soft, not harsh

  function playArcadeBlip(freq, startTime, velocity, dur) {
    // Punchy, fast-decaying pulse note — the classic 8-bit "plink" —
    // but routed through a gentle lowpass so it stays warm and calm
    // rather than buzzy.
    const g = ctx.createGain();
    const peak = 0.09 * velocity;
    g.gain.setValueAtTime(0, startTime);
    g.gain.linearRampToValueAtTime(peak, startTime + 0.006);
    g.gain.exponentialRampToValueAtTime(0.0008, startTime + dur);
    g.connect(arcadeFilter);
    g.connect(convolver);

    const osc = ctx.createOscillator();
    osc.type = 'square';
    osc.frequency.value = freq;
    osc.connect(g);
    osc.start(startTime);
    osc.stop(startTime + dur + 0.02);
  }

  function playArcadeBass(freq, startTime, dur) {
    // A bouncy, staccato-ish triangle bass note on the downbeat of
    // each bar — gives real rhythmic lift instead of one long drone.
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, startTime);
    g.gain.linearRampToValueAtTime(0.11, startTime + 0.01);
    g.gain.exponentialRampToValueAtTime(0.001, startTime + dur);
    g.connect(dry);
    g.connect(convolver);

    const osc = ctx.createOscillator();
    osc.type = 'triangle';
    osc.frequency.value = freq / 2; // an octave down
    osc.connect(g);
    osc.start(startTime);
    osc.stop(startTime + dur + 0.05);
  }

  function playArcadeHat(startTime, velocity) {
    // A very soft filtered-noise tick on the off-beats — just enough
    // rhythmic texture to feel like a game loop, never loud enough to
    // break the calm mood.
    const bufSize = Math.floor(ctx.sampleRate * 0.05);
    const buf = ctx.createBuffer(1, bufSize, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < bufSize; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / bufSize);

    const src = ctx.createBufferSource();
    src.buffer = buf;

    const hp = ctx.createBiquadFilter();
    hp.type = 'highpass';
    hp.frequency.value = 5000;

    const g = ctx.createGain();
    g.gain.setValueAtTime(0.02 * velocity, startTime);
    g.gain.exponentialRampToValueAtTime(0.0005, startTime + 0.045);

    src.connect(hp);
    hp.connect(g);
    g.connect(dry);
    src.start(startTime);
    src.stop(startTime + 0.06);
  }

  function playArcadeBar() {
    if (!playing || currentTrackIndex !== 1) return;
    const chord = ARCADE_PROGRESSION[arcadeBarIdx % ARCADE_PROGRESSION.length];
    const barStart = ctx.currentTime + 0.03;

    playArcadeBass(chord[0], barStart, ARCADE_BAR_SECONDS * 0.9);

    // A proper 16th-note arpeggio across the bar — real arcade motion
    // — while the harmony itself only changes once per bar, which is
    // what keeps the whole thing feeling unhurried and calm.
    ARCADE_ARP_PATTERN.forEach((idx, i) => {
      const t = barStart + i * ARCADE_STEP;
      const isFlourish = idx === 3;
      const freq = isFlourish ? chord[0] * 2 : chord[idx];
      const velocity = (i % 4 === 0) ? 0.85 : 0.55; // gentle accent on the beat
      playArcadeBlip(freq, t, velocity, ARCADE_STEP * 1.7);
      if (i % 2 === 1) playArcadeHat(t, 0.6);
    });

    arcadeBarIdx = (arcadeBarIdx + 1) % ARCADE_PROGRESSION.length;
    arcadeTimer = setTimeout(() => { if (playing) playArcadeBar(); }, ARCADE_BAR_SECONDS * 1000);
  }

  function startArcadeTrack() {
    if (!arcadeFilter) {
      arcadeFilter = ctx.createBiquadFilter();
      arcadeFilter.type = 'lowpass';
      arcadeFilter.frequency.value = 3200;
      arcadeFilter.Q.value = 0.7;
      arcadeFilter.connect(master);
    }
    arcadeBarIdx = 0;
    playArcadeBar();
  }
  function stopArcadeTrack() {
    if (arcadeTimer) { clearTimeout(arcadeTimer); arcadeTimer = null; }
  }

  // ═══════════════════════════════════════════════════════════════
  //  TRACK 3 — "Acoustic Fingerpicking"
  //  A gentle fingerstyle guitar loop synthesized with real
  //  Karplus-Strong string physical modeling (a short filtered noise
  //  burst fed through a decaying delay line) — not a sample, an
  //  actual plucked-string algorithm — playing a classic alternating-
  //  bass Travis-picking pattern over a soft, familiar chord
  //  progression.
  // ═══════════════════════════════════════════════════════════════

  const GUITAR_BPM = 76;
  const GUITAR_STEP = 60 / GUITAR_BPM / 2; // 8th-note step

  // Each chord: two alternating bass notes (root/fifth, low strings)
  // plus three treble notes picked in the higher register — real
  // open-position guitar-chord pitches.
  const GUITAR_PROGRESSION = [
    { bass: [110.00, 164.81], treble: [261.63, 329.63, 440.00] }, // Am
    { bass: [87.31, 130.81], treble: [220.00, 261.63, 349.23] },  // F
    { bass: [130.81, 196.00], treble: [329.63, 392.00, 523.25] }, // C
    { bass: [98.00, 146.83], treble: [246.94, 293.66, 392.00] },  // G
    { bass: [82.41, 123.47], treble: [196.00, 246.94, 329.63] },  // Em
    { bass: [110.00, 164.81], treble: [261.63, 329.63, 440.00] }, // Am
    { bass: [87.31, 130.81], treble: [220.00, 261.63, 349.23] },  // F
    { bass: [98.00, 146.83], treble: [246.94, 293.66, 392.00] },  // G
  ];
  // Classic Travis pattern across 8 eighth-notes per bar:
  // bass, treble, treble, treble, bass(fifth), treble, treble, treble
  const GUITAR_PATTERN = [
    { src: 'bass', i: 0 }, { src: 'treble', i: 0 }, { src: 'treble', i: 1 }, { src: 'treble', i: 0 },
    { src: 'bass', i: 1 }, { src: 'treble', i: 2 }, { src: 'treble', i: 1 }, { src: 'treble', i: 0 },
  ];

  let guitarTimer = null;
  let guitarBarIdx = 0;
  const pluckBufferCache = new Map();

  function getPluckBuffer(freq) {
    // Karplus-Strong plucked-string synthesis: seed a short buffer
    // with filtered noise (the "pick" excitation), then repeatedly
    // feed it through an averaging delay line the length of one
    // period of the note — that averaging + decay is what physically
    // produces a plucked-string timbre.
    const key = Math.round(freq * 10);
    if (pluckBufferCache.has(key)) return pluckBufferCache.get(key);

    const sr = ctx.sampleRate;
    const period = Math.max(2, Math.round(sr / freq));
    const duration = 2.6;
    const length = Math.floor(sr * duration);
    const buf = ctx.createBuffer(1, length, sr);
    const data = buf.getChannelData(0);

    // Seed: band-limited noise burst (simple one-pole smoothing gives
    // it a softer, warmer "nylon-ish" pluck rather than a harsh click).
    let lp = 0;
    for (let i = 0; i < period; i++) {
      const white = Math.random() * 2 - 1;
      lp += 0.5 * (white - lp);
      data[i] = lp;
    }
    const decay = 0.9965; // higher = longer sustain
    for (let i = period; i < length; i++) {
      data[i] = decay * 0.5 * (data[i - period] + data[i - period + 1] || 0);
    }
    pluckBufferCache.set(key, buf);
    return buf;
  }

  function playPluck(freq, startTime, velocity) {
    const buf = getPluckBuffer(freq);
    const src = ctx.createBufferSource();
    src.buffer = buf;

    const g = ctx.createGain();
    g.gain.setValueAtTime(0, startTime);
    g.gain.linearRampToValueAtTime(0.5 * velocity, startTime + 0.004);
    g.gain.exponentialRampToValueAtTime(0.0008, startTime + 2.4);

    src.connect(g);
    g.connect(dry);
    g.connect(convolver);
    src.start(startTime);
    src.stop(startTime + 2.6);
  }

  function playGuitarBar() {
    if (!playing || currentTrackIndex !== 2) return;
    const chord = GUITAR_PROGRESSION[guitarBarIdx % GUITAR_PROGRESSION.length];
    const barStart = ctx.currentTime + 0.03;

    GUITAR_PATTERN.forEach((note, i) => {
      const t = barStart + i * GUITAR_STEP;
      const freq = chord[note.src][note.i];
      const velocity = note.src === 'bass' ? 0.85 : (0.5 + Math.random() * 0.2);
      playPluck(freq, t, velocity);
    });

    guitarBarIdx = (guitarBarIdx + 1) % GUITAR_PROGRESSION.length;
    guitarTimer = setTimeout(() => { if (playing) playGuitarBar(); }, GUITAR_PATTERN.length * GUITAR_STEP * 1000);
  }

  function startGuitarTrack() {
    guitarBarIdx = 0;
    playGuitarBar();
  }
  function stopGuitarTrack() {
    if (guitarTimer) { clearTimeout(guitarTimer); guitarTimer = null; }
  }

  // ═══════════════════════════════════════════════════════════════
  //  TRACK 4 — "Neon Pulse"
  //  A hypnotic electronic pulse in the spirit of moody, echo-heavy
  //  mobile-game soundtracks: a slow sub-bass heartbeat under a
  //  glassy minor-key arpeggio, run through its own feedback delay
  //  line so notes trail off into repeating, decaying echoes instead
  //  of a room reverb. Everything here — the chord progression, the
  //  arp pattern, the delay timing — is original and built from
  //  oscillators, not sampled or copied from any existing track.
  // ═══════════════════════════════════════════════════════════════

  const NEON_BPM = 96;
  const NEON_STEP = 60 / NEON_BPM / 2; // 8th-note step
  const NEON_BAR_SECONDS = (60 / NEON_BPM) * 4;

  // A dark, minor-key progression (Am — F — Cmaj7-ish — G), each entry
  // giving the sub root plus a 4-note arpeggio built above it.
  const NEON_PROGRESSION = [
    { sub: 55.00, arp: [220.00, 261.63, 329.63, 392.00] }, // Am
    { sub: 43.65, arp: [174.61, 220.00, 261.63, 329.63] }, // F
    { sub: 32.70, arp: [130.81, 164.81, 196.00, 246.94] }, // C
    { sub: 49.00, arp: [196.00, 246.94, 293.66, 349.23] }, // G
  ];
  // 8 steps per bar; a rest (null) on some steps is what gives the
  // delay line room to be heard rather than being masked by new notes.
  const NEON_ARP_PATTERN = [0, null, 2, 1, 3, null, 1, 2];

  let neonTimer = null;
  let neonBarIdx = 0;
  let neonDelay = null;
  let neonFeedback = null;
  let neonDelayFilter = null;

  function ensureNeonDelay() {
    if (neonDelay) return;
    // A short, filtered feedback delay — this is what makes each
    // plucked note trail off into its own soft, dwindling echoes.
    neonDelay = ctx.createDelay(2.0);
    neonDelay.delayTime.value = NEON_STEP * 3; // dotted, off-grid echo feel
    neonFeedback = ctx.createGain();
    neonFeedback.gain.value = 0.42;
    neonDelayFilter = ctx.createBiquadFilter();
    neonDelayFilter.type = 'lowpass';
    neonDelayFilter.frequency.value = 2200; // each repeat gets a little darker

    neonDelay.connect(neonFeedback);
    neonFeedback.connect(neonDelayFilter);
    neonDelayFilter.connect(neonDelay); // feedback loop
    neonDelay.connect(master);
    neonDelay.connect(convolver);
  }

  function playNeonSub(freq, startTime) {
    // The slow, breathing heartbeat under everything else.
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, startTime);
    g.gain.linearRampToValueAtTime(0.16, startTime + 0.4);
    g.gain.exponentialRampToValueAtTime(0.001, startTime + NEON_BAR_SECONDS * 0.95);
    g.connect(dry);

    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.value = freq;
    osc.connect(g);
    osc.start(startTime);
    osc.stop(startTime + NEON_BAR_SECONDS);
  }

  function playNeonArpNote(freq, startTime) {
    // A glassy, bell-like pluck (two detuned sines) that feeds both
    // the dry room reverb and the dedicated echo delay line.
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, startTime);
    g.gain.linearRampToValueAtTime(0.11, startTime + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0006, startTime + 1.4);
    g.connect(dry);
    g.connect(convolver);
    g.connect(neonDelay);

    const osc1 = ctx.createOscillator();
    osc1.type = 'sine';
    osc1.frequency.value = freq;
    osc1.detune.value = -4;
    osc1.connect(g);
    osc1.start(startTime);
    osc1.stop(startTime + 1.5);

    const osc2 = ctx.createOscillator();
    osc2.type = 'triangle';
    osc2.frequency.value = freq * 2;
    const g2 = ctx.createGain();
    g2.gain.setValueAtTime(0, startTime);
    g2.gain.linearRampToValueAtTime(0.025, startTime + 0.01);
    g2.gain.exponentialRampToValueAtTime(0.0004, startTime + 0.9);
    osc2.connect(g2);
    g2.connect(dry);
    g2.connect(neonDelay);
    osc2.start(startTime);
    osc2.stop(startTime + 1.0);
  }

  function playNeonBar() {
    if (!playing || currentTrackIndex !== 3) return;
    const chord = NEON_PROGRESSION[neonBarIdx % NEON_PROGRESSION.length];
    const barStart = ctx.currentTime + 0.03;

    playNeonSub(chord.sub, barStart);

    NEON_ARP_PATTERN.forEach((idx, i) => {
      if (idx === null) return;
      const t = barStart + i * NEON_STEP;
      playNeonArpNote(chord.arp[idx], t);
    });

    neonBarIdx = (neonBarIdx + 1) % NEON_PROGRESSION.length;
    neonTimer = setTimeout(() => { if (playing) playNeonBar(); }, NEON_BAR_SECONDS * 1000);
  }

  function startNeonTrack() {
    ensureNeonDelay();
    neonBarIdx = 0;
    playNeonBar();
  }
  function stopNeonTrack() {
    if (neonTimer) { clearTimeout(neonTimer); neonTimer = null; }
  }

  // ═══════════════════════════════════════════════════════════════
  //  PLAYLIST — add more tracks here later, nothing else needs to
  //  change (Next/Prev, persistence, and the vinyl widget all just
  //  read from this array).
  // ═══════════════════════════════════════════════════════════════

  const TRACKS = [
    { id: 'piano', name: 'Ambient Piano', start: startPianoTrack, stop: stopPianoTrack },
    { id: 'arcade', name: 'Retro Arcade', start: startArcadeTrack, stop: stopArcadeTrack },
    { id: 'guitar', name: 'Acoustic Fingerpicking', start: startGuitarTrack, stop: stopGuitarTrack },
    { id: 'neon', name: 'Neon Pulse', start: startNeonTrack, stop: stopNeonTrack },
  ];

  let currentTrackIndex = 0;
  try {
    const saved = parseInt(alGet(TRACK_STORAGE_KEY), 10);
    if (!isNaN(saved) && saved >= 0 && saved < TRACKS.length) currentTrackIndex = saved;
  } catch (e) {}

  function notifyBGMState() {
    document.dispatchEvent(new CustomEvent('afterlight-bgm-trackchange', {
      detail: { name: TRACKS[currentTrackIndex].name, index: currentTrackIndex, playing }
    }));
  }

  // ═══════════════════════════════════════════════════════════════
  //  PLAYBACK CONTROL
  // ═══════════════════════════════════════════════════════════════

  function start() {
    ensureContext();
    if (ctx.state === 'suspended') ctx.resume();
    const wasAlreadyPlaying = playing;
    playing = true;
    fadeTo(0.8, 2.0);
    if (!wasAlreadyPlaying) TRACKS[currentTrackIndex].start();
    updateIcon();
    notifyBGMState();
  }

  function stop() {
    if (!playing) { updateIcon(); return; }
    playing = false;
    TRACKS[currentTrackIndex].stop();
    if (ctx) fadeTo(0, 0.6);
    updateIcon();
    notifyBGMState();
  }

  function toggle() {
    if (playing) {
      stop();
      try { alSet(STORAGE_KEY, '0'); } catch (e) {}
    } else {
      start();
      try { alSet(STORAGE_KEY, '1'); } catch (e) {}
    }
  }

  // Switches to a different track in the playlist. If music is
  // currently playing, dips the volume briefly (so the switch doesn't
  // click/pop), stops the old track's scheduling, and starts the new
  // one. If paused, just remembers the new choice for next play.
  function switchTrack(newIndex) {
    TRACKS[currentTrackIndex].stop();
    currentTrackIndex = (newIndex + TRACKS.length) % TRACKS.length;
    try { alSet(TRACK_STORAGE_KEY, String(currentTrackIndex)); } catch (e) {}

    if (playing) {
      fadeTo(0, 0.25);
      setTimeout(() => {
        TRACKS[currentTrackIndex].start();
        fadeTo(0.8, 0.6);
      }, 260);
    }
    notifyBGMState();
  }

  function next() { switchTrack(currentTrackIndex + 1); }
  function prev() { switchTrack(currentTrackIndex - 1); }

  function updateIcon() {
    const btn = document.getElementById('bgm-toggle-btn');
    if (!btn) return;
    btn.classList.toggle('is-playing', playing);
    btn.setAttribute('aria-pressed', playing ? 'true' : 'false');
    btn.setAttribute('aria-label', playing ? 'Mute background music' : 'Play background music');
    btn.title = playing ? 'Mute background music' : 'Play background music';
  }

  function wasExplicitlyMuted() {
    try { return alGet(STORAGE_KEY) === '0'; } catch (e) { return false; }
  }

  function attemptAutoplay() {
    if (wasExplicitlyMuted()) { updateIcon(); notifyBGMState(); return; }

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

  window.AfterlightBGM = {
    toggle,
    isPlaying: () => playing,
    next,
    prev,
    getCurrentTrackName: () => TRACKS[currentTrackIndex].name,
    getTracks: () => TRACKS.map(t => t.name),
  };
})();
