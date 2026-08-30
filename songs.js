//  DATA & CONFIG
// ═══════════════════════════════════════════════════════════════

const DEFAULT_SONGS = [
  {
    number: "#001", title: "Sober", artist: "Lorde",
    year: "2017 · Melodrama", mood: "3am",
    moodColor: "#7B6FA0", moodBg: "rgba(123,111,160,0.12)",
    genre: ["Indie Pop","Art Pop"],
    about: "Sober is the centrepiece of Lorde's masterpiece Melodrama — an album about a house party that becomes a metaphor for falling apart and rebuilding. This track captures the specific electricity of a night that feels limitless, and the dread of knowing morning will collapse it. It's about the persona you build when you're intoxicated — confident, magnetic, untouchable — and the quiet grief of watching it dissolve.\n\nLorde produced this with Jack Antonoff, and the production choice is deliberate: the song starts intimate and expands into something almost euphoric before pulling back. It mirrors the feeling of a high perfectly.",
    meaning: "On the surface it's about a party. Underneath, it's about identity — who are you when the substance drops away? Lorde was 19 when she wrote this, processing her first real heartbreak and the strange freedom/loneliness of fame. The recurring question \"are you getting enough love?\" isn't directed at a lover — it's directed at herself.",
    lyrics: "Baby really hurt me\nCrying in the taxi\nHe don't wanna know me\nSays he made the big mistake of dancing in my storm\n\n<span class=\"highlight\">But I can't stop thinking\nI can't stop drinking\nThe two things I know feel\nSo real when I'm this gone</span>\n\nOn the altar of the party, forgive me for what I do",
    credit: "Lyrics © 2017 Lorde (Ella Yelich-O'Connor) / Joel Little / Jack Antonoff. Published by Songs of Universal Inc. All rights reserved. Shared here for educational commentary under fair use principles.",
    spotify: "https://open.spotify.com/track/3qhlB30KknSejmIvZZLjOD"
  },
  {
    number: "#002", title: "Motion Sickness", artist: "Phoebe Bridgers",
    year: "2017 · Stranger in the Alps", mood: "drive",
    moodColor: "#B85C5C", moodBg: "rgba(184,92,92,0.1)",
    genre: ["Indie Folk","Alternative"],
    about: "Phoebe Bridgers' debut single is a song about a manipulative relationship told with the calm of someone who has already escaped. She reportedly wrote it about musician Ryan Adams, who was her mentor before she realised the dynamic was unhealthy. The brilliance is in the tone: there's no screaming, no dramatic climax — just the quiet devastation of someone who finally sees clearly.\n\nThe production is sparse indie folk, which makes the emotional payload heavier. When the song opens up in the chorus, it doesn't feel like a release — it feels like relief.",
    meaning: "The title is perfect. Motion sickness is what happens when your body can't reconcile what it sees with what it feels — a perfect metaphor for being in a relationship where the other person constantly rewrites reality. Phoebe felt sick because she trusted someone who was always moving the goalposts. The song is about recovering your own perception.",
    lyrics: "I hate your mom\nI hate it when she opens her mouth\n\n<span class=\"highlight\">You put me in the backseat\nNow I'm motion sick\nI'm over it</span>\n\nYou said when you met me\nYou were bored\nAnd you were in a band\nWhen everything I did\nWas for you",
    credit: "Lyrics © 2017 Phoebe Bridgers. Published by Dead Oceans / Epitaph. All rights reserved. Brief excerpt shared for critical commentary and analysis.",
    spotify: "https://open.spotify.com/track/59MJquOAlXEsqXEijBMCBJ"
  },
  {
    number: "#003", title: "Liability", artist: "Lorde",
    year: "2017 · Melodrama", mood: "hollow",
    moodColor: "#C8A96E", moodBg: "rgba(200,169,110,0.1)",
    genre: ["Art Pop","Piano Ballad"],
    about: "The most nakedly confessional song on Melodrama — just Lorde and a piano, no production armour. After the frenetic party sounds of the album's first half, this arrives like a door slamming. She writes about being told she's \"too much\" — too intense, too weird, too emotional — and slowly realising she might have to be enough for herself.\n\nIt's four minutes and it doesn't do anything clever. It doesn't need to. The simplicity is the point: sometimes the most precise description of loneliness is just saying it plainly.",
    meaning: "Lorde has said this song is about a specific relationship ending, but it's really about the fear that your personality — the things that make you interesting — are also the things that make you impossible to love. It's the gap between how you see yourself and how others experience you. The devastating twist: she ends up befriending herself. The \"you\" in the second half isn't a lover anymore.",
    lyrics: "They say \"You're a little much for me\nYou're a liability\nYou're a little much for me\"\n\n<span class=\"highlight\">So they pull back, make other plans\nI understand, I'm a liability\nGet you wild, make you leave\nI'm a little much for\nEveryone</span>",
    credit: "Lyrics © 2017 Lorde (Ella Yelich-O'Connor) / Jack Antonoff. Published by Songs of Universal Inc. All rights reserved. Brief excerpt shared for educational commentary.",
    spotify: "https://open.spotify.com/track/6cxBJSBGSe7dCHEXg76QPVO"
  },
  {
    number: "#004", title: "Death With Dignity", artist: "Sufjan Stevens",
    year: "2015 · Carrie & Lowell", mood: "golden",
    moodColor: "#C8A96E", moodBg: "rgba(200,169,110,0.1)",
    genre: ["Indie Folk","Chamber Pop"],
    about: "Carrie & Lowell is Sufjan Stevens processing the death of his mother — a woman who abandoned him as a child, struggled with addiction, and died before they could fully reconcile. Death With Dignity opens the album and sets the tone: grief so complicated it barely sounds like grief. It's quiet, guitar-driven, and impossibly gentle for what it's describing.\n\nThe title comes from a legal term for assisted dying. Sufjan isn't using it clinically — he's asking whether there's a way to lose someone gracefully when the relationship was never clean.",
    meaning: "This isn't just a song about death. It's about the specific grief of loving someone who couldn't really show up for you — and missing them anyway. Sufjan writes \"spirit of my silence I can hear you, but I'm afraid to be near you\" and it captures something most grief songs miss: the ambivalence. He loved a ghost before she was one.",
    lyrics: "<span class=\"highlight\">Spirit of my silence I can hear you\nBut I'm afraid to be near you\nAnd I don't know where to begin</span>\n\nForgive me, mother, for\nI am your son\nAnd I have forgotten\nThe face of my father",
    credit: "Lyrics © 2015 Sufjan Stevens. Published by Asthmatic Kitty Records. All rights reserved. Brief excerpt shared for critical educational analysis.",
    spotify: "https://open.spotify.com/track/1tKCkhKYTaR2OjwcVXiVgq"
  },
  {
    number: "#005", title: "Hardline", artist: "Julien Baker",
    year: "2021 · Little Oblivions", mood: "rage",
    moodColor: "#B85C5C", moodBg: "rgba(184,92,92,0.1)",
    genre: ["Indie Rock","Alt Folk"],
    about: "Little Oblivions is Julien Baker's most sonically ambitious record — she added a full band for the first time — and Hardline is where that decision pays off most. It's a song about relapsing, about the maddening logic of self-destruction when you can see exactly what you're doing and can't stop.\n\nThe production starts spare and builds to something overwhelming, which mirrors the subject perfectly. Baker is one of the most direct lyricists working — she doesn't dress things in metaphor. She says exactly what happened and lets the music carry the weight.",
    meaning: "Baker grew up deeply religious and much of her work lives in the tension between faith, self-loathing, and recovery. Hardline is about the specific theology of giving up on yourself — the moment where you stop fighting not because you want to fail but because fighting is exhausting. It's the most uncomfortable kind of honest.",
    lyrics: "<span class=\"highlight\">I know what I'm doing\nI know what I'm doing is wrong\nI'm my problem\nI'm looking for someone to blame</span>\n\nI wanna feel it again\nAnd I know what it costs\nI know it's not worth it",
    credit: "Lyrics © 2021 Julien Baker. Published by Matador Records. All rights reserved. Brief excerpt shared for educational critical commentary.",
    spotify: "https://open.spotify.com/track/2s8NZDMSVUFuRuCkMxfJtX"
  },
  {
    number: "#006", title: "Wet Dream", artist: "Wet Leg",
    year: "2021 · Single", mood: "ghost",
    moodColor: "#7B6FA0", moodBg: "rgba(123,111,160,0.12)",
    genre: ["Indie Rock","Post-Punk"],
    about: "Wet Leg arrived fully formed with this debut single — two women from the Isle of Wight delivering one of the driest breakup songs in recent indie rock memory. The premise is simple: an ex texts to say he had a dream about her. Her response is total, weaponised indifference.\n\nThe song became a viral moment but it's more than a meme. The riff is genuinely great, the production is tight, and the deadpan delivery hides real craft. Rhian Teasdale's vocal is doing a lot — she sounds bored in a way that clearly took effort.",
    meaning: "The joke is obvious: she doesn't care. But the deeper read is more interesting. Wet Dream is about the power dynamic that shifts after a relationship ends — the person who left trying to re-enter the narrative, and the person who stayed learning to be completely unimpressed. It's a song about having the last word without raising your voice.",
    lyrics: "<span class=\"highlight\">Are you sure you want to be with me?\nI've nothing to offer\nChic physique, antique\nFifteenth century wardrobe</span>\n\nAnd I'm feeling fine\nIn my mind, in my head, I'm okay\nAnd you're in my bed, in my dream\nAnd I don't care",
    credit: "Lyrics © 2021 Wet Leg (Rhian Teasdale / Hester Chambers). Published by Domino Recording Co. All rights reserved. Brief excerpt shared for educational commentary.",
    spotify: "https://open.spotify.com/track/7tJCm2mFdAKqJrfSSXTIpH"
  }
];

const DEFAULT_MOOD_MAP = {
  '3am':    { label: '3am spiral',    color: '#7B6FA0', bg: 'rgba(123,111,160,0.12)' },
  'drive':  { label: 'night drive',   color: '#B85C5C', bg: 'rgba(184,92,92,0.1)' },
  'hollow': { label: 'hollow chest',  color: '#C8A96E', bg: 'rgba(200,169,110,0.1)' },
  'golden': { label: 'golden hour',   color: '#C8A96E', bg: 'rgba(200,169,110,0.1)' },
  'rage':   { label: 'quiet rage',    color: '#B85C5C', bg: 'rgba(184,92,92,0.1)' },
  'ghost':  { label: 'ghost mode',    color: '#7B6FA0', bg: 'rgba(123,111,160,0.12)' },
  'dissolve':{label:'dissolve',      color: '#9990B8', bg: 'rgba(153,144,184,0.1)' }
};

function getMoodMap() {
  const raw = alGet('al-moods');
  if (raw) {
    try { return JSON.parse(raw); } catch(e) { /* fall through */ }
  }
  alSet('al-moods', JSON.stringify(DEFAULT_MOOD_MAP));
  return DEFAULT_MOOD_MAP;
}

function saveMoodMap(map) {
  alSet('al-moods', JSON.stringify(map));
  if (typeof isDbConnected === 'function' && isDbConnected()) {
    sb.from('moods').delete().neq('mood_key', '__never__').then(() => {
      const rows = Object.keys(map).map(key => ({
        mood_key: key, label: map[key].label, color: map[key].color, bg: map[key].bg
      }));
      if (rows.length) sb.from('moods').insert(rows).then(() => {});
    });
  }
}

let MOOD_MAP = getMoodMap();

const OFFENSIVE_WORDS = ['fuck','shit','bitch','cunt','nigger','nigga','faggot','retard','slut','whore','asshole','dick','cock','pussy','kill yourself','kys','rape','nazi','hitler'];

function isOffensive(name) {
  const lower = name.toLowerCase();
  return OFFENSIVE_WORDS.some(w => lower.includes(w));
}

// Was referenced by signup, the Google-alias picker, and the settings name-change
// form, but never actually defined — meaning every one of those silently threw an
// error and failed. Restored here: 3–20 chars, letters/numbers/underscore/hyphen
// only, and not on the offensive-words list.
function isValidAnonName(name) {
  if (!name || name.length < 3 || name.length > 20) return false;
  if (!/^[a-zA-Z0-9_-]+$/.test(name)) return false;
  if (isOffensive(name)) return false;
  return true;
}

// ═══════════════════════════════════════════════════════════════
function saveSongs() {
  alSet('al-songs', JSON.stringify(songs));
}

function saveSubmissions() {
  alSet('al-submissions', JSON.stringify(submissions));
}

// Pulls the pending-review queue from Supabase (admin sees everyone's; a
// regular signed-in visitor would only ever see their own, per RLS) and
// replaces the in-memory + cached copy with it. Best-effort: on any failure
// (not connected, no session yet, RLS denial) it just keeps whatever was
// already loaded from localStorage, so the panel still shows something.
async function pullSubmissionsFromSupabase() {
  if (!isDbConnected() || !sb) return;
  try {
    const { data, error } = await sb.from('submissions').select('*').order('created_at', { ascending: true });
    if (error) throw error;
    submissions = (data || []).map(r => ({
      id: r.id, title: r.title, artist: r.artist, year: r.year, mood: r.mood,
      about: r.about, meaning: r.meaning, lyrics: r.lyrics, funFact: r.fun_fact,
      spotify: r.spotify, youtube: r.youtube, genre: r.genre || [], submittedBy: r.submitted_by,
      submittedAt: r.created_at ? new Date(r.created_at).getTime() : Date.now()
    }));
    saveSubmissions();
  } catch (e) { console.error('Pull submissions from Supabase failed:', e); }
}

// So the admin panel's submissions queue updates live as new songs come in,
// without needing to reopen the tab. Mirrors initNotificationsRealtime.
let submissionsChannel = null;
function initSubmissionsRealtime() {
  if (!sb || !currentAdmin) return;
  teardownSubmissionsRealtime();
  try {
    submissionsChannel = sb.channel('submissions-admin')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'submissions' }, () => {
        pullSubmissionsFromSupabase().then(() => {
          if (document.getElementById('admin-tab-submissions')) renderAdminSubmissions();
        });
      })
      .subscribe();
  } catch (e) { console.error('Submissions realtime init failed:', e); }
}
function teardownSubmissionsRealtime() {
  if (submissionsChannel) { try { sb.removeChannel(submissionsChannel); } catch (e) {} submissionsChannel = null; }
}

// ═══════════════════════════════════════════════════════════════
//  RENDER SONG GRID
// ═══════════════════════════════════════════════════════════════

function renderSongGrid() {
  const featuredGrid = document.getElementById('song-grid-featured');
  const classicGrid = document.getElementById('song-grid');
  const loadWrap = document.getElementById('archive-load-more-wrap');
  // Featured bento grid retired — classic cards only (title, artist, info + ratings)
  if (featuredGrid) {
    featuredGrid.innerHTML = '';
    featuredGrid.style.display = 'none';
  }
  if (classicGrid) classicGrid.innerHTML = '';

  const INITIAL_VISIBLE = 6; // first batch; rest behind Load more
  archiveExpanded = false;

  songs.forEach((s, i) => {
    const mood = MOOD_MAP[s.mood] || MOOD_MAP['3am'];
    if (!classicGrid) return;
    const card = document.createElement('div');
    card.className = 'song-card song-card-classic' + (i >= INITIAL_VISIBLE ? ' archive-pending' : '');
    card.dataset.mood = s.mood;
    card.dataset.index = i;
    const aboutLine = (s.about || '').split('\n')[0];
    const genres = Array.isArray(s.genre) ? s.genre : [];
    card.innerHTML = `
      <div class="card-top">
        <div>
          <div class="song-title">${escapeHtml(s.title)}</div>
          <div class="song-artist">${escapeHtml(s.artist)}</div>
          <div class="song-year">${escapeHtml(s.year || '')}</div>
        </div>
        <div class="card-top-actions">
          <button class="song-save-btn${isSongSaved(s.number) ? ' saved' : ''}" onclick="event.stopPropagation();toggleSaveSong('${escapeJs(s.number)}', this)" title="Save song">${isSongSaved(s.number) ? '♥' : '♡'}</button>
          <span class="song-mood-tag" style="background:${mood.bg};color:${mood.color};">${mood.label}</span>
        </div>
      </div>
      <div class="song-number">${escapeHtml(s.number)}</div>
      ${getSongUploader(s) ? (isDeletedUploader(getSongUploader(s))
          ? `<div class="song-card-uploader song-card-uploader-deleted">↑ uploaded by a deleted user</div>`
          : `<div class="song-card-uploader" onclick="event.stopPropagation();openUserProfileView('${escapeJs(getSongUploader(s))}')">↑ uploaded by @${escapeHtml(getSongUploader(s))}</div>`) : ''}
      <div class="song-desc">${escapeHtml(aboutLine)}</div>
      <div class="card-footer">
        <div class="genre-pills">
          ${genres.map(g => `<span class="genre-pill">${escapeHtml(g)}</span>`).join('')}
        </div>
        <span class="read-more">Read more</span>
      </div>
      <div class="rating-wrap" data-song="${String(s.number).replace('#','')}">
        <div class="rating-your-row">
          <span class="rating-label">Your Rating</span>
          <div class="rating-stars">
            <span class="rating-note" data-val="1"><svg class="rating-note-icon"><use href="#premNoteIcon"/></svg></span>
            <span class="rating-note" data-val="2"><svg class="rating-note-icon"><use href="#premNoteIcon"/></svg></span>
            <span class="rating-note" data-val="3"><svg class="rating-note-icon"><use href="#premNoteIcon"/></svg></span>
            <span class="rating-note" data-val="4"><svg class="rating-note-icon"><use href="#premNoteIcon"/></svg></span>
            <span class="rating-note" data-val="5"><svg class="rating-note-icon"><use href="#premNoteIcon"/></svg></span>
          </div>
          <span class="rating-count"></span>
          <span class="rating-locked-msg">✓ Rated</span>
        </div>
        <div class="rating-community" data-role="community">${ratingCommunityHtml(String(s.number).replace('#',''))}</div>
        <div class="rating-actions"></div>
      </div>
    `;
    classicGrid.appendChild(card);
  });

  if (loadWrap) {
    loadWrap.style.display = songs.length > INITIAL_VISIBLE ? 'flex' : 'none';
  }
  const loadBtn = document.getElementById('archive-load-more-btn');
  if (loadBtn) loadBtn.disabled = false;

  initRatings();
  initMoodFilter();
  initModal();
  updateHomeStats();
}

let archiveExpanded = false;
function loadMoreArchiveRecords() {
  archiveExpanded = true;
  document.querySelectorAll('.song-card-classic.archive-pending').forEach(c => {
    c.classList.remove('archive-pending');
  });
  const loadWrap = document.getElementById('archive-load-more-wrap');
  if (loadWrap) loadWrap.style.display = 'none';
  applyArchiveFilters();
}

// Keeps the "Songs archived / Moods mapped / Genres" hero counters (the
// ones a photo of the site once caught stuck at 06/07/03 forever) in sync
// with whatever's actually in the archive right now — called after every
// song, mood, or genre add/edit/delete, plus on first load.

// ── Recently Added (hero) — optimized ──────────────────────────
// Goals: no double-render from updateHomeStats + renderSongGrid,
// skip DOM work when the top-6 fingerprint is unchanged, O(1) index
// (no indexOf), cheap string escape, event delegation (one listener).
let _recentFingerprint = '';
let _recentRaf = 0;
let _recentDelegated = false;

function _escapeAttr(t) {
  return String(t == null ? '' : t)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function _ensureRecentDelegation(grid) {
  if (_recentDelegated || !grid) return;
  _recentDelegated = true;
  grid.addEventListener('click', function (e) {
    const row = e.target.closest('.recent-song-bar, .dm-song-card');
    if (!row || !grid.contains(row)) return;
    const i = +row.getAttribute('data-index');
    if (Number.isFinite(i)) openSongFromRecent(i);
  });
}

function renderRecentlyAdded(force) {
  // Coalesce rapid calls (stats + grid refresh in the same tick)
  if (!force) {
    if (_recentRaf) return;
    _recentRaf = requestAnimationFrame(function () {
      _recentRaf = 0;
      renderRecentlyAdded(true);
    });
    return;
  }

  const grid = document.getElementById('recently-added-grid');
  if (!grid || typeof songs === 'undefined') return;
  _ensureRecentDelegation(grid);

  const n = songs.length;
  if (!n) {
    if (_recentFingerprint !== 'empty') {
      _recentFingerprint = 'empty';
      grid.innerHTML = '<p class="recently-added-empty">No songs yet — be the first to submit one.</p>';
    }
    return;
  }

  // Newest first without allocating a reversed copy of the full array
  const take = Math.min(6, n);
  // Fingerprint: song numbers of the last `take` entries (newest end)
  let fp = String(n) + ':';
  for (let k = 0; k < take; k++) {
    const s = songs[n - 1 - k];
    fp += (s && s.number != null ? s.number : k) + ',';
  }
  if (fp === _recentFingerprint) return;
  _recentFingerprint = fp;

  const parts = new Array(take);
  for (let k = 0; k < take; k++) {
    const i = n - 1 - k;
    const s = songs[i];
    const mood = (typeof MOOD_MAP !== 'undefined' && s && MOOD_MAP[s.mood]) ? MOOD_MAP[s.mood] : null;
    const title = _escapeAttr(s.title || '');
    const artist = _escapeAttr(s.artist || '');
    const moodLabel = mood ? _escapeAttr(mood.label || s.mood || '') : '';
    const moodColor = mood && mood.color ? mood.color : 'var(--accent)';
    // Same bar style as Saved Songs (dm-song-card): note + title + artist · mood
    parts[k] =
      '<button type="button" class="dm-song-card recent-song-bar" data-index="' + i + '" title="' + title + ' — ' + artist + '">' +
        '<div class="dsc-note">♪</div>' +
        '<div class="dsc-info">' +
          '<div class="dsc-title">' + title + '</div>' +
          '<div class="dsc-artist">' + artist +
            (moodLabel ? ' · <span style="color:' + moodColor + '">' + moodLabel + '</span>' : '') +
          '</div>' +
        '</div>' +
      '</button>';
  }
  grid.innerHTML = parts.join('');
}

function openSongFromRecent(index) {
  if (typeof window.openSongModal === 'function') {
    window.openSongModal(index);
    return;
  }
  const card = document.querySelector('.song-card[data-index="' + index + '"]');
  if (card) card.click();
}

function updateHomeStats() {
  const songsEl = document.getElementById('stat-songs');
  const moodsEl = document.getElementById('stat-moods');
  const genresEl = document.getElementById('stat-genres');
  if (songsEl) songsEl.textContent = '#/' + String(songs.length).padStart(4, '0');
  if (moodsEl) moodsEl.textContent = String(Object.keys(MOOD_MAP).length).padStart(3, '0');
  if (genresEl && typeof getGenres === 'function') {
    genresEl.textContent = String(getGenres().length);
  }
  renderRecentlyAdded();
}

function escapeHtml(t) {
  const d = document.createElement('div');
  d.textContent = t;
  return d.innerHTML;
}

// Songs added via the submission/approval flow get a credit string of the form
// "Submitted by <name>" — this pulls the uploader's username back out of that,
// so cards/modals can show who uploaded a song and link to their profile.
// Songs added straight through the admin panel (no submitter) return null.
function getSongUploader(s) {
  if (!s || !s.credit) return null;
  const prefix = 'Submitted by ';
  if (s.credit.indexOf(prefix) !== 0) return null;
  const name = s.credit.slice(prefix.length).trim();
  return name || null;
}

// The uploader's account may have since been deleted — see
// admin_delete_user_account/alias_delete_account in setup.sql, which
// anonymize (not delete) credit on their approved songs to this marker
// instead of leaving a link to a profile that no longer exists.
function isDeletedUploader(name) {
  return name === '[deleted user]';
}

// Lyrics are shown to every visitor, and can come from admin edits, approved
// submissions, or (if Supabase is connected) directly from the database — so
// they're treated as untrusted text. This escapes them and only re-adds line
// breaks, instead of trusting raw HTML (which would let arbitrary <script>/
// event-handler markup run in every viewer's browser).
function renderLyricsHtml(text) {
  // Escape everything by default (lyrics are untrusted text — see note above),
  // then re-enable just the one whitelisted tag pair used to bold key lines,
  // so it's rendered as real markup instead of showing up as literal text.
  return escapeHtml(text == null ? '' : text)
    .replace(/&lt;span class="highlight"&gt;/g, '<span class="highlight">')
    .replace(/&lt;\/span&gt;/g, '</span>')
    .replace(/\n/g, '<br>');
}

// ═══════════════════════════════════════════════════════════════
//  RATING SYSTEM (LOCKED AFTER VOTE)
// ═══════════════════════════════════════════════════════════════

// A stable, anonymous per-browser id used only to stop the same browser
// rating a song twice (both locally and, if connected, via a unique
// constraint in Supabase) — no account/login required to rate.
function getVoterId() {
  let id = alGet('al-voter-id');
  if (!id) {
    id = (crypto.randomUUID ? crypto.randomUUID() : 'v-' + Date.now() + '-' + Math.random().toString(36).slice(2));
    alSet('al-voter-id', id);
  }
  return id;
}

// { [songKey]: { sum, count } } — the shared "how many people rated this,
// and what's the average" data behind each song's community rating row.
// Loaded from a local cache immediately (so it paints instantly on
// refresh), then replaced with the real aggregate pulled from Supabase's
// song_ratings table in pullSharedDataFromSupabase (if connected).
function loadRatingStats() {
  try { return JSON.parse(alGet('al-rating-stats') || '{}'); }
  catch (e) { return {}; }
}
function saveRatingStats() {
  alSet('al-rating-stats', JSON.stringify(ratingStats));
}
let ratingStats = loadRatingStats();

function getRatingDisplay(songKey) {
  const s = ratingStats[songKey];
  if (!s || !s.count) return { avg: 0, count: 0 };
  return { avg: s.sum / s.count, count: s.count };
}

// Optimistic local bump the instant someone votes, so the bar/score/count
// update immediately instead of waiting on a round trip — the next real
// pull from Supabase (on reload, or after a manual sync) reconciles it
// against the authoritative shared total.
function recordLocalVote(songKey, value) {
  if (!ratingStats[songKey]) ratingStats[songKey] = { sum: 0, count: 0 };
  ratingStats[songKey].sum += value;
  ratingStats[songKey].count += 1;
  saveRatingStats();
}

function ratingCommunityHtml(songKey) {
  const { avg, count } = getRatingDisplay(songKey);
  if (!count) return `<span class="rating-empty">No ratings yet — be the first</span>`;
  const pct = Math.max(4, Math.round((avg / 5) * 100));
  return `
    <span class="rating-avg-badge"><span class="star">★</span>${avg.toFixed(1)}</span>
    <span class="rating-bar-track"><span class="rating-bar-fill" style="width:${pct}%"></span></span>
    <span class="rating-count-text">${count} rating${count === 1 ? '' : 's'}</span>
  `;
}

// Writes this browser's vote to the shared song_ratings table (public insert,
// no update/delete — see copySetupSQL — so once cast it's locked server-side
// too, matching the locked-after-vote UI). No-ops silently if Supabase isn't
// connected, or if this voter already has a row for this song.
async function pushSongRating(songKey, value) {
  if (!sb) return;
  try {
    await sb.from('song_ratings').insert({ song_key: songKey, voter_id: getVoterId(), value });
  } catch (e) {
    console.error('Rating sync failed:', e);
  }
}

// ═══════════════════════════════════════════════════════════════
//  MOOD FILTER
// ═══════════════════════════════════════════════════════════════

// Only this many mood chips show by default — the rest sit behind a
// "Show more" toggle so the filter bar doesn't dominate the page once
// there are a lot of moods.
const MOOD_BAR_VISIBLE_COUNT = 5;

function renderMoodBar() {
  const bar = document.getElementById('mood-bar');
  if (bar) {
    const keys = Object.keys(MOOD_MAP);
    let html = `<button class="mood-btn active" data-mood="all"><span class="mood-dot"></span> All</button>`;
    keys.forEach((key, i) => {
      const m = MOOD_MAP[key];
      const extra = i >= MOOD_BAR_VISIBLE_COUNT ? ' mood-btn-extra' : '';
      html += `<button class="mood-btn${extra}" data-mood="${key}" style="--mood-c:${m.color}"><span class="mood-dot"></span> ${escapeHtml(m.label)}</button>`;
    });
    const hiddenCount = keys.length - MOOD_BAR_VISIBLE_COUNT;
    if (hiddenCount > 0) {
      html += `<button class="mood-more-btn" id="mood-more-btn" type="button" data-hidden-count="${hiddenCount}">+ ${hiddenCount} more</button>`;
    }
    bar.innerHTML = html;
    bar.classList.remove('mood-bar-expanded');
    initMoodFilter();
    initMoodShowMore();
  }
  populateMoodSelects();
  renderSubmitMoodPills();
  updateHomeStats();
}

function initMoodShowMore() {
  const bar = document.getElementById('mood-bar');
  const btn = document.getElementById('mood-more-btn');
  if (!bar || !btn || btn.dataset.bound) return;
  btn.dataset.bound = '1';
  const hiddenCount = btn.dataset.hiddenCount;
  btn.addEventListener('click', () => {
    const expanded = bar.classList.toggle('mood-bar-expanded');
    btn.textContent = expanded ? 'Show less' : `+ ${hiddenCount} more`;
    btn.setAttribute('aria-expanded', expanded ? 'true' : 'false');
  });
}

function populateMoodSelects() {
  const optsHtml = Object.keys(MOOD_MAP).map(key =>
    `<option value="${key}">${escapeHtml(MOOD_MAP[key].label)}</option>`
  ).join('');
  ['adm-song-mood', 'sub-mood'].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      const prevVal = el.value;
      el.innerHTML = optsHtml;
      if (Object.keys(MOOD_MAP).includes(prevVal)) el.value = prevVal;
    }
  });
}

let archiveSearchQuery = '';
let archiveSearchBound = false;

function getActiveMoodFilter() {
  const active = document.querySelector('.mood-btn.active');
  return active ? (active.dataset.mood || 'all') : 'all';
}

function songMatchesSearch(s, q) {
  if (!q) return true;
  const hay = [
    s.title, s.artist, s.year, s.number, s.mood, s.about,
    (s.genre || []).join(' '), s.credit || ''
  ].join(' ').toLowerCase();
  return hay.includes(q);
}

function applyArchiveFilters() {
  const cards = document.querySelectorAll('.song-card');
  const countTag = document.getElementById('count-tag');
  const loadWrap = document.getElementById('archive-load-more-wrap');
  const mood = getActiveMoodFilter();
  const q = (archiveSearchQuery || '').trim().toLowerCase();
  const searching = !!q || mood !== 'all';
  let visible = 0;
  let firstVisibleIdx = -1;
  let pendingMatches = 0;

  // When searching/filtering, expand so matches in classic cards aren't hidden behind Load more
  if (searching && !archiveExpanded) {
    archiveExpanded = true;
    document.querySelectorAll('.song-card-classic.archive-pending').forEach(c => c.classList.remove('archive-pending'));
    if (loadWrap) loadWrap.style.display = 'none';
  }

  cards.forEach(card => {
    const i = +card.dataset.index;
    const s = (typeof songs !== 'undefined' && songs[i]) ? songs[i] : null;
    const moodOk = mood === 'all' || card.dataset.mood === mood;
    const searchOk = !s ? !q : songMatchesSearch(s, q);
    const match = moodOk && searchOk;
    const pending = card.classList.contains('archive-pending');
    card.classList.toggle('hidden', !match || pending);
    if (match && !pending) {
      visible++;
      if (firstVisibleIdx < 0) firstVisibleIdx = i;
    }
    if (match && pending) pendingMatches++;
  });

  if (countTag) {
    const totalMatch = visible + pendingMatches;
    const label = totalMatch === 1 ? ' entry' : ' entries';
    countTag.textContent = String(totalMatch).padStart(2, '0') + label;
  }
  if (loadWrap && !archiveExpanded && !searching) {
    loadWrap.style.display = pendingMatches > 0 || document.querySelectorAll('.song-card-classic.archive-pending').length ? 'flex' : 'none';
  }
  return firstVisibleIdx;
}

function initArchiveSearch() {
  const input = document.getElementById('archive-search-input');
  const clearBtn = document.getElementById('archive-search-clear');
  if (!input || archiveSearchBound) return;
  archiveSearchBound = true;

  let debounce = 0;
  const run = () => {
    archiveSearchQuery = input.value || '';
    if (clearBtn) clearBtn.style.display = archiveSearchQuery.trim() ? 'flex' : 'none';
    applyArchiveFilters();
  };

  input.addEventListener('input', () => {
    clearTimeout(debounce);
    debounce = setTimeout(run, 120);
  });

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      clearTimeout(debounce);
      run();
      // Open the first matching song when Enter is pressed
      const first = applyArchiveFilters();
      if (first >= 0) {
        if (typeof window.openSongModal === 'function') window.openSongModal(first);
        else {
          const card = document.querySelector('.song-card[data-index="' + first + '"]');
          if (card && !card.classList.contains('hidden')) card.click();
        }
      }
    } else if (e.key === 'Escape') {
      input.value = '';
      run();
      input.blur();
    }
  });

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      input.value = '';
      run();
      input.focus();
    });
  }
}

function initMoodFilter() {
  const moodBtns = document.querySelectorAll('.mood-btn:not([data-filter-bound])');
  const countTag = document.getElementById('count-tag');
  initArchiveSearch();
  moodBtns.forEach(btn => {
    btn.dataset.filterBound = '1';
    btn.addEventListener('click', () => {
      document.querySelectorAll('.mood-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      applyArchiveFilters();
    });
  });
  // Re-apply current search after grid re-render
  applyArchiveFilters();
}

// ═══════════════════════════════════════════════════════════════
//  MODAL (with comments)
// ═══════════════════════════════════════════════════════════════

function initModal() {
  const modal = document.getElementById('modal');
  const closeBtn = document.getElementById('close-modal');
  const cards = document.querySelectorAll('.song-card');

  cards.forEach((card, i) => {
    card.addEventListener('click', (e) => {
      if (e.target.closest('.rating-wrap')) return;
      openModal(i);
    });
  });

  window.renderModalFunFact = function(funFact) {
    const section = document.getElementById('m-funfact-section');
    const el = document.getElementById('m-funfact');
    if (funFact && funFact.trim()) {
      el.textContent = funFact;
      section.style.display = '';
    } else {
      section.style.display = 'none';
    }
  };

  window.renderModalUploader = function(s) {
    const wrap = document.getElementById('m-uploader-wrap');
    const uploader = getSongUploader(s);
    if (!uploader) { wrap.innerHTML = ''; return; }
    if (isDeletedUploader(uploader)) {
      wrap.innerHTML = `
        <div class="song-uploader-row song-uploader-row-deleted">
          <span class="song-uploader-label">Uploaded by a deleted user</span>
        </div>`;
      return;
    }
    wrap.innerHTML = `
      <div class="song-uploader-row" onclick="openUserProfileView('${escapeJs(uploader)}')">
        ${userPfpHTML(uploader)}
        <span class="song-uploader-label">Uploaded by <span class="song-uploader-name">@${escapeHtml(uploader)}</span></span>
      </div>`;
  };

  window.openSongModal = openModal;
  function openModal(idx) {
    currentModalSong = idx;
    const s = songs[idx];
    const mood = MOOD_MAP[s.mood] || MOOD_MAP['3am'];
    document.getElementById('m-number').textContent = s.number;
    document.getElementById('m-year').textContent = s.year;
    const mTag = document.getElementById('m-mood-tag');
    mTag.textContent = mood.label;
    mTag.style.background = mood.bg;
    mTag.style.color = mood.color;
    document.getElementById('m-title').textContent = s.title;
    document.getElementById('m-artist').textContent = s.artist;
    document.getElementById('m-about').textContent = s.about;
    document.getElementById('m-meaning').textContent = s.meaning;
    document.getElementById('m-lyrics').innerHTML = renderLyricsHtml(s.lyrics);
    document.getElementById('m-credit').textContent = s.credit;
    renderModalFunFact(s.funFact);
    renderModalUploader(s);
    document.getElementById('m-listen').href = s.spotify || '#';
    const ytLink = document.getElementById('m-listen-yt');
    if (s.youtube) { ytLink.href = s.youtube; ytLink.style.display = ''; }
    else { ytLink.style.display = 'none'; ytLink.href = '#'; }
    renderComments(idx);
    updateCommentForm();
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
    refreshCommentsForSong(s.number).then(() => { if (currentModalSong === idx) renderComments(idx); });
  }

  function closeModal() {
    modal.classList.remove('open');
    document.body.style.overflow = '';
    currentModalSong = null;
  }

  closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
}

// ═══════════════════════════════════════════════════════════════
//  COMMENTS
// ═══════════════════════════════════════════════════════════════

function getComments(songKey) {
  const key = 'al-comments-' + songKey;
  const raw = alGet(key);
  return raw ? JSON.parse(raw) : [];
}

function saveComments(songKey, comments) {
  alSet('al-comments-' + songKey, JSON.stringify(comments));
}

// Pulls just this one song's comments fresh from Supabase (if connected) so opening a
// song shows recent comments from other visitors without waiting for a full Sync Now.
async function refreshCommentsForSong(songKey) {
  if (typeof sb === 'undefined' || !sb) return;
  try {
    const { data, error } = await sb.from('comments').select('id,author,text,created_at').eq('song_key', String(songKey)).order('created_at', { ascending: true });
    if (!error && data) {
      saveComments(songKey, data.map(c => ({ id: c.id, author: c.author, text: c.text, time: new Date(c.created_at).getTime() })));
    }
  } catch (e) { console.error('Refresh comments failed:', e); }
}

function renderComments(songIdx) {
  const list = document.getElementById('comment-list');
  const s = songs[songIdx];
  const songKey = s ? s.number : songIdx;
  const comments = getComments(songKey);
  if (comments.length === 0) {
    list.innerHTML = '<p style="font-family:var(--mono);font-size:11px;color:var(--muted);">No comments yet. Be the first.</p>';
    return;
  }
  list.innerHTML = comments.map(c => `
    <div class="comment-item">
      <div class="comment-meta">
        <span class="comment-author">${escapeHtml(c.author)}</span>
        <span class="comment-time">${new Date(c.time).toLocaleString()}</span>
        ${canDeleteComment(c) ? `<button class="comment-delete-btn" title="Delete this comment"
          onclick="handleDeleteComment('${escapeJs(String(songKey))}', '${escapeJs(String(c.id != null ? c.id : ''))}', ${c.time})">Delete</button>` : ''}
      </div>
      <div class="comment-text">${escapeHtml(c.text)}</div>
    </div>
  `).join('');
}

function updateCommentForm() {
  const prompt = document.getElementById('comment-login-prompt');
  const form = document.getElementById('comment-form');
  if (currentUser) {
    prompt.style.display = 'none';
    form.style.display = 'flex';
  } else {
    prompt.style.display = 'block';
    form.style.display = 'none';
  }
}

async function postComment() {
  if (!currentUser || currentModalSong === null) return;
  const text = document.getElementById('comment-text').value.trim();
  if (!text) return;
  const s = songs[currentModalSong];
  const songKey = s ? s.number : currentModalSong;

  if (text.length > 2000) {
    showToast('That comment is too long (2000 characters max).', { type: 'error' });
    return;
  }

  const localTime = Date.now();
  const comments = getComments(songKey);
  comments.push({ id: null, author: currentUser.name, text: text, time: localTime });
  saveComments(songKey, comments);
  document.getElementById('comment-text').value = '';
  renderComments(currentModalSong);

  if (isDbConnected() && sb) {
    // Ask for the inserted row back, so the comment carries its real
    // database id immediately and the Delete button works without a
    // reload. Previously nothing was returned and the local copy had no
    // id at all, which is why comments could never be removed.
    const { data, error } = await sb.from('comments')
      .insert({ song_key: String(songKey), author: currentUser.name, text: text })
      .select('id, created_at')
      .single();

    const list = getComments(songKey);
    const local = list.find(c => c.time === localTime && c.author === currentUser.name);

    if (error) {
      // Don't leave a comment sitting there looking posted when it never
      // left the browser — take it back and say why.
      if (local) saveComments(songKey, list.filter(c => c !== local));
      renderComments(currentModalSong);
      showToast(/policy|row-level/i.test(error.message)
        ? 'Your session expired — log out and back in to comment.'
        : 'Comment failed to post: ' + error.message, { type: 'error' });
      document.getElementById('comment-text').value = text;
      return;
    }
    if (local && data) {
      local.id = data.id;
      if (data.created_at) local.time = new Date(data.created_at).getTime();
      saveComments(songKey, list);
      renderComments(currentModalSong);
    }
  }
}

// You can remove your own comments; the admin can remove anyone's. This
// mirrors the "Owner or admin deletes comments" policy in the setup SQL,
// so the button only shows where the delete will actually be allowed.
function canDeleteComment(c) {
  if (!c) return false;
  if (currentAdmin) return true;
  return !!(currentUser && c.author === currentUser.name);
}

async function handleDeleteComment(songKey, id, time) {
  if (!confirm('Delete this comment? This cannot be undone.')) return;

  const list = getComments(songKey);
  const target = id
    ? list.find(c => String(c.id) === String(id))
    : list.find(c => c.time === time);
  if (!target) return;
  if (!canDeleteComment(target)) {
    showToast('You can only delete your own comments.', { type: 'error' });
    return;
  }

  if (isDbConnected() && sb && target.id != null) {
    const { error } = await sb.from('comments').delete().eq('id', target.id);
    if (error) {
      showToast(/policy|row-level/i.test(error.message)
        ? 'You can only delete your own comments.'
        : 'Could not delete comment: ' + error.message, { type: 'error' });
      return;
    }
  }

  saveComments(songKey, list.filter(c => c !== target));
  if (currentModalSong !== null) renderComments(currentModalSong);
  showToast('Comment deleted.');
}

// ═══════════════════════════════════════════════════════════════
//  SUBMIT SONG
// ═══════════════════════════════════════════════════════════════

function updateSubmitForm() {
  const wall = document.getElementById('submit-login-wall');
  const layout = document.getElementById('submit-layout');
  if (!wall || !layout) return;
  if (currentUser) { wall.style.display = 'none'; layout.style.display = 'grid'; renderSubmitMoodPills(); }
  else { wall.style.display = 'block'; layout.style.display = 'none'; }
}

// Builds the "The Vibe" pill picker on the submit form from MOOD_MAP,
// keeping the hidden #sub-mood <select> (still populated by
// populateMoodSelects) as the actual source of truth so the submit
// handler below doesn't need to change.
function renderSubmitMoodPills() {
  const wrap = document.getElementById('sub-mood-pills');
  const select = document.getElementById('sub-mood');
  if (!wrap || !select) return;
  const keys = Object.keys(MOOD_MAP);
  if (keys.length && !keys.includes(select.value)) select.value = keys[0];
  wrap.innerHTML = keys.map(key => {
    const m = MOOD_MAP[key];
    const active = select.value === key ? ' active' : '';
    return `<button type="button" class="mood-btn submit-mood-btn${active}" data-mood="${key}" style="--mood-c:${m.color}"><span class="mood-dot"></span> ${escapeHtml(m.label)}</button>`;
  }).join('');
  wrap.querySelectorAll('.submit-mood-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      wrap.querySelectorAll('.submit-mood-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      select.value = btn.dataset.mood;
    });
  });
}

document.getElementById('submit-form').addEventListener('submit', async function(e) {
  e.preventDefault();
  if (!currentUser) return;
  const form = this;
  const submission = {
    title: document.getElementById('sub-title').value.trim(),
    artist: document.getElementById('sub-artist').value.trim(),
    year: [document.getElementById('sub-year').value.trim(), document.getElementById('sub-album').value.trim()].filter(Boolean).join(' · '),
    mood: document.getElementById('sub-mood').value,
    about: document.getElementById('sub-about').value.trim(),
    meaning: document.getElementById('sub-meaning').value.trim(),
    lyrics: document.getElementById('sub-lyrics').value.trim(),
    funFact: document.getElementById('sub-funfact').value.trim(),
    spotify: document.getElementById('sub-link').value.trim(),
    youtube: document.getElementById('sub-youtube').value.trim(),
    genre: [document.getElementById('sub-genre1').value.trim(), document.getElementById('sub-genre2').value.trim()].filter(Boolean),
    submittedBy: currentUser.name,
    submittedAt: Date.now(),
    status: 'pending'
  };

  // Push to Supabase so the admin (on any device) sees it in the review
  // queue. This is the only copy that matters — admin.js reads the
  // Submissions tab from Supabase, not from this browser's local cache — so
  // unlike some other best-effort writes on this site, a failure here is
  // NOT safe to silently swallow behind a "saved locally only" fallback:
  // the submission would sit in this browser's localStorage forever,
  // invisible to the admin, while the visitor was told it worked.
  let savedToSupabase = false;
  let submitError = null;
  if (isDbConnected() && sb) {
    try {
      // Submissions require a real Auth session tied to this username (RLS).
      // If the Edge Function failed at signup, the user may look "logged in"
      // locally but have no JWT — writes then fail with a confusing RLS error.
      const { data: sessWrap } = await sb.auth.getSession();
      const sess = sessWrap && sessWrap.session;
      if (!sess || !sess.user) {
        throw new Error('Your login is only saved on this device — the server session is missing. Log out and log back in once, then try again.');
      }
      const { data, error } = await sb.from('submissions').insert({
        title: submission.title, artist: submission.artist, year: submission.year, mood: submission.mood,
        about: submission.about, meaning: submission.meaning, lyrics: submission.lyrics,
        fun_fact: submission.funFact, spotify: submission.spotify, youtube: submission.youtube, genre: submission.genre,
        submitted_by: submission.submittedBy
      }).select().single();
      if (error) throw error;
      submission.id = data.id;
      savedToSupabase = true;
    } catch (e) {
      console.error('Submit to Supabase failed:', e);
      submitError = e;
    }
  }

  submissions.push(submission);
  saveSubmissions();

  if (savedToSupabase || !isDbConnected()) {
    // Either it really reached the shared database, or there is no database
    // connected at all (pure local-only mode) — in both cases what we told
    // the visitor is true.
    showToast('Song submitted for review! It will appear after admin approval.');
    form.reset();
    renderSubmitMoodPills();
  } else {
    // Supabase IS connected but the write was rejected (commonly: row-level
    // security blocking the write because this browser doesn't have a real
    // authenticated session — e.g. anonymous sign-ins are disabled in
    // Supabase Auth settings). Say so honestly instead of pretending it worked.
    showToast("Couldn't submit — the site's database rejected the save (" +
      (submitError && submitError.message ? submitError.message : 'unknown error') +
      "). It was NOT sent to admin for review. Please try again shortly, or let the site owner know.",
      { type: 'error', duration: 8000 });
  }
});

// ═══════════════════════════════════════════════════════════════
//  RATING POP ANIMATION
// ═══════════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════════
//  RATING ENGINE
//
//  Rewritten. What was wrong before:
//    · Two competing implementations, one of them dead (removed above).
//    · A rating was permanent — no way to change it, no way to remove it,
//      and the database had no UPDATE or DELETE policy to allow either.
//    · The community average only refreshed on a full page reload.
//    · Casting a vote wrote an optimistic +1 into a localStorage cache
//      that was never reconciled if the database write failed, so the
//      "12 ratings" you saw could be a number only your browser believed.
//
//  Now: rate, change your mind, or remove it entirely. Every action goes
//  to Supabase first and the local cache follows the server, not the
//  other way round.
// ═══════════════════════════════════════════════════════════════

// Reads this browser's own rating for a song.
function getMyRating(songKey) {
  const v = parseInt(alGet('al-rating-' + songKey) || '0', 10);
  return Number.isFinite(v) && v >= 1 && v <= 5 ? v : 0;
}
function setMyRating(songKey, value) {
  if (value) alSet('al-rating-' + songKey, String(value));
  else alRemove('al-rating-' + songKey);
}

// Recomputes one song's community aggregate straight from the database, so
// the number on screen is the real shared total rather than a local guess.
async function refreshRatingStats(songKey) {
  if (!isDbConnected() || !sb) return false;
  try {
    const { data, error } = await sb.from('song_ratings').select('value').eq('song_key', songKey);
    if (error) throw error;
    const sum = (data || []).reduce((a, r) => a + r.value, 0);
    ratingStats[songKey] = { sum: sum, count: (data || []).length };
    saveRatingStats();
    return true;
  } catch (e) {
    console.error('Rating refresh failed:', e);
    return false;
  }
}

// Casts or changes a vote. Upsert on (song_key, voter_id) means voting
// again simply replaces the old value instead of being rejected by the
// unique constraint the way a bare insert was.
async function saveSongRating(songKey, value) {
  if (!isDbConnected() || !sb) {
    // Local-only mode: keep the optimistic cache so the UI still moves.
    const prev = getMyRating(songKey);
    if (!ratingStats[songKey]) ratingStats[songKey] = { sum: 0, count: 0 };
    if (prev) ratingStats[songKey].sum += (value - prev);
    else { ratingStats[songKey].sum += value; ratingStats[songKey].count += 1; }
    saveRatingStats();
    return { ok: true, local: true };
  }
  try {
    const { error } = await sb.from('song_ratings')
      .upsert({ song_key: songKey, voter_id: getVoterId(), value: value, updated_at: new Date().toISOString() },
              { onConflict: 'song_key,voter_id' });
    if (error) throw error;
    await refreshRatingStats(songKey);
    return { ok: true };
  } catch (e) {
    console.error('Rating save failed:', e);
    return { ok: false, error: e.message || String(e) };
  }
}

// Removes this browser's vote entirely.
async function removeSongRating(songKey) {
  const prev = getMyRating(songKey);
  if (!isDbConnected() || !sb) {
    if (prev && ratingStats[songKey]) {
      ratingStats[songKey].sum = Math.max(0, ratingStats[songKey].sum - prev);
      ratingStats[songKey].count = Math.max(0, ratingStats[songKey].count - 1);
      saveRatingStats();
    }
    return { ok: true, local: true };
  }
  try {
    const { error } = await sb.from('song_ratings').delete()
      .eq('song_key', songKey).eq('voter_id', getVoterId());
    if (error) throw error;
    await refreshRatingStats(songKey);
    return { ok: true };
  } catch (e) {
    console.error('Rating delete failed:', e);
    return { ok: false, error: e.message || String(e) };
  }
}

// Repaints every visible copy of one song's rating widget (a song can be on
// screen in the grid and the modal at the same time).
function repaintRating(songKey) {
  document.querySelectorAll('.rating-wrap[data-song="' + CSS.escape(songKey) + '"]').forEach(paintRatingWrap);
}

function paintRatingWrap(wrap) {
  const songKey = wrap.dataset.song;
  const mine = getMyRating(songKey);
  const notes = wrap.querySelectorAll('.rating-note');
  const countEl = wrap.querySelector('.rating-count');
  const lockMsg = wrap.querySelector('.rating-locked-msg');
  const starsWrap = wrap.querySelector('.rating-stars');
  const communityEl = wrap.querySelector('.rating-community');
  const actionsEl = wrap.querySelector('.rating-actions');

  notes.forEach((n, i) => {
    n.classList.toggle('filled', i < mine);
    n.style.cursor = 'pointer';
    n.style.opacity = '1';
    n.setAttribute('role', 'button');
    n.setAttribute('tabindex', '0');
    n.setAttribute('aria-label', (i + 1) + ' out of 5');
  });
  if (countEl) countEl.textContent = mine > 0 ? mine + '/5' : '';
  if (lockMsg) lockMsg.classList.toggle('visible', false); // nothing is locked any more
  if (starsWrap) starsWrap.classList.remove('is-locked');
  if (communityEl) communityEl.innerHTML = ratingCommunityHtml(songKey);
  if (actionsEl) {
    actionsEl.innerHTML = mine > 0
      ? '<button class="rating-clear-btn" onclick="event.stopPropagation();handleClearRating(\'' + escapeJs(songKey) + '\')">Remove my rating</button>' +
        '<span class="rating-changehint">Tap a different note to change it</span>'
      : '';
  }
}

async function handleRatingClick(songKey, value) {
  const previous = getMyRating(songKey);
  if (previous === value) {
    // Tapping the note you already picked removes the rating — the same
    // gesture people expect from every other star widget.
    return handleClearRating(songKey);
  }
  setMyRating(songKey, value);
  repaintRating(songKey);
  playRatingPop(songKey, value);

  const res = await saveSongRating(songKey, value);
  if (!res.ok) {
    setMyRating(songKey, previous || 0);
    repaintRating(songKey);
    showToast('Could not save your rating: ' + res.error, { type: 'error' });
    return;
  }
  repaintRating(songKey);
  showToast(previous ? 'Rating updated to ' + value + '/5.' : 'Rated ' + value + '/5 — thanks!');
}

async function handleClearRating(songKey) {
  const previous = getMyRating(songKey);
  if (!previous) return;
  setMyRating(songKey, 0);
  repaintRating(songKey);

  const res = await removeSongRating(songKey);
  if (!res.ok) {
    setMyRating(songKey, previous);
    repaintRating(songKey);
    showToast('Could not remove your rating: ' + res.error, { type: 'error' });
    return;
  }
  repaintRating(songKey);
  showToast('Your rating was removed.');
}

function playRatingPop(songKey, value) {
  document.querySelectorAll('.rating-wrap[data-song="' + CSS.escape(songKey) + '"]').forEach(wrap => {
    wrap.querySelectorAll('.rating-note').forEach((n, i) => {
      if (i >= value) return;
      setTimeout(() => {
        n.classList.add('pop', 'glow');
        setTimeout(() => n.classList.remove('pop'), 550);
        setTimeout(() => n.classList.remove('glow'), 1250);
      }, i * 60);
    });
  });
}

function initRatings() {
  document.querySelectorAll('.rating-wrap').forEach(wrap => {
    if (wrap.dataset.bound === '1') { paintRatingWrap(wrap); return; }
    wrap.dataset.bound = '1';

    const songKey = wrap.dataset.song;
    const notes = wrap.querySelectorAll('.rating-note');

    notes.forEach((note, idx) => {
      note.addEventListener('click', e => {
        e.stopPropagation();
        handleRatingClick(songKey, idx + 1);
      });
      note.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault(); e.stopPropagation();
          handleRatingClick(songKey, idx + 1);
        }
      });
      note.addEventListener('mouseenter', () => {
        notes.forEach((n, i) => n.classList.toggle('filled', i <= idx));
      });
    });

    wrap.addEventListener('mouseleave', () => {
      const mine = getMyRating(songKey);
      notes.forEach((n, i) => n.classList.toggle('filled', i < mine));
    });

    paintRatingWrap(wrap);
  });
}
