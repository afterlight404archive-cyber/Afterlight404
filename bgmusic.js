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
     1. "Ambient Piano"        — soft, endless, never-repeating piano
                                  wander (the original track).
     2. "Retro Arcade (Slow)"  — a slow, chill 16-bit-arcade-style
                                  loop. It's a genuinely composed
                                  16-chord progression, 75s per chord,
                                  so it plays as one continuous, no-gap
                                  20-minute loop before wrapping back
                                  to the top — it just keeps looping
                                  like that until Next/Prev is pressed.

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
  //  TRACK 2 — "Retro Arcade (Slow)"
  //  A slow, chill take on a 16-bit arcade/overworld loop: a gentle
  //  square-wave arpeggio + sustained triangle bassline over a fixed
  //  16-chord progression. Each chord holds for 75 seconds, so the
  //  whole progression is exactly 16 × 75s = 1200s — a real, seamless
  //  20-minute loop with zero gap between chords or on wraparound.
  //  It just keeps looping like that until Next/Prev is pressed.
  // ═══════════════════════════════════════════════════════════════

  const ARCADE_BAR_SECONDS = 75; // 16 bars × 75s = 1200s = 20:00 exactly
  // [root, third, fifth] triads in Hz — a simple i–VI–III–VII-flavoured
  // natural-minor progression, easy on the ear and unmistakably
  // "game overworld" without ever picking up tempo.
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
  const ARCADE_ARP_PATTERN = [0, 1, 2, 1, 0, 2]; // indices into the triad

  let arcadeTimer = null;
  let arcadeBarIdx = 0;

  function playArcadeBlip(freq, startTime, velocity, dur) {
    const g = ctx.createGain();
    const peak = 0.1 * velocity;
    g.gain.setValueAtTime(0, startTime);
    g.gain.linearRampToValueAtTime(peak, startTime + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0006, startTime + dur);
    g.connect(dry);
    g.connect(convolver);

    const osc = ctx.createOscillator();
    osc.type = 'square';
    osc.frequency.value = freq;
    osc.connect(g);
    osc.start(startTime);
    osc.stop(startTime + dur + 0.05);
  }

  function playArcadeBass(freq, startTime, dur) {
    // One long, softly-sustained root note under the whole bar — the
    // "no pause" part: it never actually goes silent between chords.
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, startTime);
    g.gain.linearRampToValueAtTime(0.085, startTime + 3);
    g.gain.setValueAtTime(0.085, startTime + dur - 3);
    g.gain.linearRampToValueAtTime(0, startTime + dur);
    g.connect(dry);
    g.connect(convolver);

    const osc = ctx.createOscillator();
    osc.type = 'triangle';
    osc.frequency.value = freq / 2; // an octave down
    osc.connect(g);
    osc.start(startTime);
    osc.stop(startTime + dur + 0.1);
  }

  function playArcadeBar() {
    if (!playing || currentTrackIndex !== 1) return;
    const chord = ARCADE_PROGRESSION[arcadeBarIdx % ARCADE_PROGRESSION.length];
    const barStart = ctx.currentTime + 0.05;

    playArcadeBass(chord[0], barStart, ARCADE_BAR_SECONDS);

    // A deliberately slow, spaced-out arpeggio — this is the "slow"
    // part: notes land roughly every ~6s rather than a fast chiptune
    // gallop, leaving plenty of open air around each blip.
    const noteGap = ARCADE_BAR_SECONDS / (ARCADE_ARP_PATTERN.length * 2);
    let t = barStart + 0.6;
    ARCADE_ARP_PATTERN.forEach((idx, i) => {
      const accentHigh = i % 3 === 2; // occasional higher blip for character
      const freq = chord[idx] * (accentHigh ? 2 : 1);
      playArcadeBlip(freq, t, accentHigh ? 0.5 : 0.8, 1.8);
      t += noteGap;
    });

    arcadeBarIdx = (arcadeBarIdx + 1) % ARCADE_PROGRESSION.length;
    // Next chord is scheduled to start exactly as this one ends —
    // zero gap, so the 20-minute loop never has a silent seam.
    arcadeTimer = setTimeout(() => { if (playing) playArcadeBar(); }, ARCADE_BAR_SECONDS * 1000);
  }

  function startArcadeTrack() {
    arcadeBarIdx = 0;
    playArcadeBar();
  }
  function stopArcadeTrack() {
    if (arcadeTimer) { clearTimeout(arcadeTimer); arcadeTimer = null; }
  }

  // ═══════════════════════════════════════════════════════════════
  //  PLAYLIST — add more tracks here later, nothing else needs to
  //  change (Next/Prev, persistence, and the vinyl widget all just
  //  read from this array).
  // ═══════════════════════════════════════════════════════════════

  const TRACKS = [
    { id: 'piano', name: 'Ambient Piano', start: startPianoTrack, stop: stopPianoTrack },
    { id: 'arcade', name: 'Retro Arcade (Slow)', start: startArcadeTrack, stop: stopArcadeTrack },
  ];

  let currentTrackIndex = 0;
  try {
    const saved = parseInt(localStorage.getItem(TRACK_STORAGE_KEY), 10);
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
      try { localStorage.setItem(STORAGE_KEY, '0'); } catch (e) {}
    } else {
      start();
      try { localStorage.setItem(STORAGE_KEY, '1'); } catch (e) {}
    }
  }

  // Switches to a different track in the playlist. If music is
  // currently playing, dips the volume briefly (so the switch doesn't
  // click/pop), stops the old track's scheduling, and starts the new
  // one. If paused, just remembers the new choice for next play.
  function switchTrack(newIndex) {
    TRACKS[currentTrackIndex].stop();
    currentTrackIndex = (newIndex + TRACKS.length) % TRACKS.length;
    try { localStorage.setItem(TRACK_STORAGE_KEY, String(currentTrackIndex)); } catch (e) {}

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
    try { return localStorage.getItem(STORAGE_KEY) === '0'; } catch (e) { return false; }
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
