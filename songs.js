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
  const raw = localStorage.getItem('al-moods');
  if (raw) {
    try { return JSON.parse(raw); } catch(e) { /* fall through */ }
  }
  localStorage.setItem('al-moods', JSON.stringify(DEFAULT_MOOD_MAP));
  return DEFAULT_MOOD_MAP;
}

function saveMoodMap(map) {
  localStorage.setItem('al-moods', JSON.stringify(map));
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
  localStorage.setItem('al-songs', JSON.stringify(songs));
}

function saveSubmissions() {
  localStorage.setItem('al-submissions', JSON.stringify(submissions));
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
      spotify: r.spotify, genre: r.genre || [], submittedBy: r.submitted_by,
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
  const grid = document.getElementById('song-grid');
  grid.innerHTML = '';
  songs.forEach((s, i) => {
    const mood = MOOD_MAP[s.mood] || MOOD_MAP['3am'];
    const card = document.createElement('div');
    card.className = 'song-card';
    card.dataset.mood = s.mood;
    card.dataset.index = i;
    card.innerHTML = `
      <div class="card-top">
        <div>
          <div class="song-title">${escapeHtml(s.title)}</div>
          <div class="song-artist">${escapeHtml(s.artist)}</div>
          <div class="song-year">${escapeHtml(s.year)}</div>
        </div>
        <div class="card-top-actions">
          <button class="song-save-btn${isSongSaved(s.number) ? ' saved' : ''}" onclick="event.stopPropagation();toggleSaveSong('${escapeJs(s.number)}', this)" title="Save song">${isSongSaved(s.number) ? '♥' : '♡'}</button>
          <span class="song-mood-tag" style="background:${mood.bg};color:${mood.color};">${mood.label}</span>
        </div>
      </div>
      <div class="song-number">${s.number}</div>
      ${getSongUploader(s) ? `<div class="song-card-uploader" onclick="event.stopPropagation();openUserProfileView('${escapeJs(getSongUploader(s))}')">↑ uploaded by @${escapeHtml(getSongUploader(s))}</div>` : ''}
      <div class="song-desc">${escapeHtml(s.about.split('\\n')[0])}</div>
      <div class="card-footer">
        <div class="genre-pills">
          ${s.genre.map(g => `<span class="genre-pill">${escapeHtml(g)}</span>`).join('')}
        </div>
        <span class="read-more">Read more</span>
      </div>
      <div class="rating-wrap" data-song="${s.number.replace('#','')}">
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
        <div class="rating-community" data-role="community">${ratingCommunityHtml(s.number.replace('#',''))}</div>
      </div>
    `;
    grid.appendChild(card);
  });
  initRatings();
  initMoodFilter();
  initModal();
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
  let id = localStorage.getItem('al-voter-id');
  if (!id) {
    id = (crypto.randomUUID ? crypto.randomUUID() : 'v-' + Date.now() + '-' + Math.random().toString(36).slice(2));
    localStorage.setItem('al-voter-id', id);
  }
  return id;
}

// { [songKey]: { sum, count } } — the shared "how many people rated this,
// and what's the average" data behind each song's community rating row.
// Loaded from a local cache immediately (so it paints instantly on
// refresh), then replaced with the real aggregate pulled from Supabase's
// song_ratings table in pullSharedDataFromSupabase (if connected).
function loadRatingStats() {
  try { return JSON.parse(localStorage.getItem('al-rating-stats') || '{}'); }
  catch (e) { return {}; }
}
function saveRatingStats() {
  localStorage.setItem('al-rating-stats', JSON.stringify(ratingStats));
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

function initRatings() {
  document.querySelectorAll('.rating-wrap').forEach(wrap => {
    const songKey = wrap.dataset.song;
    const notes = wrap.querySelectorAll('.rating-note');
    const countEl = wrap.querySelector('.rating-count');
    const lockMsg = wrap.querySelector('.rating-locked-msg');
    const saved = localStorage.getItem('al-rating-' + songKey);
    let currentRating = saved ? parseInt(saved, 10) : 0;
    let isLocked = currentRating > 0;

    function render() {
      notes.forEach((note, idx) => {
        note.classList.toggle('filled', idx < currentRating);
      });
      countEl.textContent = currentRating > 0 ? currentRating + '/5' : '';
      lockMsg.classList.toggle('visible', isLocked);
      notes.forEach(n => {
        n.style.cursor = isLocked ? 'default' : 'pointer';
        n.style.opacity = isLocked && !n.classList.contains('filled') ? '0.3' : '1';
      });
    }

    render();

    notes.forEach((note, idx) => {
      note.addEventListener('click', (e) => {
        e.stopPropagation();
        if (isLocked) return;
        const val = idx + 1;
        currentRating = val;
        isLocked = true;
        localStorage.setItem('al-rating-' + songKey, val);
        render();
      });
      note.addEventListener('mouseenter', () => {
        if (isLocked) return;
        notes.forEach((n, i) => n.classList.toggle('filled', i <= idx));
      });
    });

    wrap.addEventListener('mouseleave', () => {
      if (isLocked) return;
      notes.forEach((n, i) => n.classList.toggle('filled', i < currentRating));
    });
  });
}

// ═══════════════════════════════════════════════════════════════
//  MOOD FILTER
// ═══════════════════════════════════════════════════════════════

function renderMoodBar() {
  const bar = document.getElementById('mood-bar');
  if (bar) {
    let html = `<button class="mood-btn active" data-mood="all"><span class="mood-dot"></span> All</button>`;
    Object.keys(MOOD_MAP).forEach(key => {
      const m = MOOD_MAP[key];
      html += `<button class="mood-btn" data-mood="${key}" style="--mood-c:${m.color}"><span class="mood-dot"></span> ${escapeHtml(m.label)}</button>`;
    });
    bar.innerHTML = html;
    initMoodFilter();
  }
  populateMoodSelects();
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

function initMoodFilter() {
  const moodBtns = document.querySelectorAll('.mood-btn');
  const cards = document.querySelectorAll('.song-card');
  const countTag = document.getElementById('count-tag');
  moodBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      moodBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const mood = btn.dataset.mood;
      let visible = 0;
      cards.forEach(card => {
        const match = mood === 'all' || card.dataset.mood === mood;
        card.classList.toggle('hidden', !match);
        if (match) visible++;
      });
      if (countTag) countTag.textContent = String(visible).padStart(2, '0') + ' entries';
    });
  });
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

  function renderModalFunFact(funFact) {
    const section = document.getElementById('m-funfact-section');
    const el = document.getElementById('m-funfact');
    if (funFact && funFact.trim()) {
      el.textContent = funFact;
      section.style.display = '';
    } else {
      section.style.display = 'none';
    }
  }

  window.renderModalUploader = function(s) {
    const wrap = document.getElementById('m-uploader-wrap');
    const uploader = getSongUploader(s);
    if (!uploader) { wrap.innerHTML = ''; return; }
    wrap.innerHTML = `
      <div class="song-uploader-row" onclick="openUserProfileView('${escapeJs(uploader)}')">
        ${userPfpHTML(uploader)}
        <span class="song-uploader-label">Uploaded by <span class="song-uploader-name">@${escapeHtml(uploader)}</span></span>
      </div>`;
  };

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
  const raw = localStorage.getItem(key);
  return raw ? JSON.parse(raw) : [];
}

function saveComments(songKey, comments) {
  localStorage.setItem('al-comments-' + songKey, JSON.stringify(comments));
}

// Pulls just this one song's comments fresh from Supabase (if connected) so opening a
// song shows recent comments from other visitors without waiting for a full Sync Now.
async function refreshCommentsForSong(songKey) {
  if (typeof sb === 'undefined' || !sb) return;
  try {
    const { data, error } = await sb.from('comments').select('author,text,created_at').eq('song_key', String(songKey)).order('created_at', { ascending: true });
    if (!error && data) {
      saveComments(songKey, data.map(c => ({ author: c.author, text: c.text, time: new Date(c.created_at).getTime() })));
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

  const comments = getComments(songKey);
  comments.push({ author: currentUser.name, text: text, time: Date.now() });
  saveComments(songKey, comments);
  document.getElementById('comment-text').value = '';
  renderComments(currentModalSong);

  if (typeof sb !== 'undefined' && sb) {
    const err = await pushCommentToSupabase(songKey, currentUser.name, text);
    if (err) showToast('Comment saved on this device, but failed to sync to Supabase: ' + err, {type:'error'});
  }
}

// ═══════════════════════════════════════════════════════════════
//  SUBMIT SONG
// ═══════════════════════════════════════════════════════════════

function updateSubmitForm() {
  const wall = document.getElementById('submit-login-wall');
  const form = document.getElementById('submit-form');
  if (currentUser) { wall.style.display = 'none'; form.style.display = 'grid'; }
  else { wall.style.display = 'block'; form.style.display = 'none'; }
}

document.getElementById('submit-form').addEventListener('submit', async function(e) {
  e.preventDefault();
  if (!currentUser) return;
  const form = this;
  const submission = {
    title: document.getElementById('sub-title').value.trim(),
    artist: document.getElementById('sub-artist').value.trim(),
    year: document.getElementById('sub-year').value.trim(),
    mood: document.getElementById('sub-mood').value,
    about: document.getElementById('sub-about').value.trim(),
    meaning: document.getElementById('sub-meaning').value.trim(),
    lyrics: document.getElementById('sub-lyrics').value.trim(),
    funFact: document.getElementById('sub-funfact').value.trim(),
    spotify: document.getElementById('sub-link').value.trim(),
    genre: [document.getElementById('sub-genre1').value.trim(), document.getElementById('sub-genre2').value.trim()].filter(Boolean),
    submittedBy: currentUser.name,
    submittedAt: Date.now(),
    status: 'pending'
  };

  // Push to Supabase so the admin (on any device) sees it in the review
  // queue — falls back to local-only storage if not connected or the
  // write fails for any reason, same pattern used elsewhere on the site.
  if (isDbConnected() && sb) {
    try {
      await ensureAnonSession();
      const { data, error } = await sb.from('submissions').insert({
        title: submission.title, artist: submission.artist, year: submission.year, mood: submission.mood,
        about: submission.about, meaning: submission.meaning, lyrics: submission.lyrics,
        fun_fact: submission.funFact, spotify: submission.spotify, genre: submission.genre,
        submitted_by: submission.submittedBy
      }).select().single();
      if (error) throw error;
      submission.id = data.id;
    } catch (e) {
      console.error('Submit to Supabase failed, saved locally only:', e);
    }
  }

  submissions.push(submission);
  saveSubmissions();
  showToast('Song submitted for review! It will appear after admin approval.');
  form.reset();
});

// ═══════════════════════════════════════════════════════════════
//  RATING POP ANIMATION
// ═══════════════════════════════════════════════════════════════

// Override the original initRatings to add pop animation
const _originalInitRatings = initRatings;
initRatings = function() {
  document.querySelectorAll('.rating-wrap').forEach(wrap => {
    const songKey = wrap.dataset.song;
    const starsWrap = wrap.querySelector('.rating-stars');
    const notes = wrap.querySelectorAll('.rating-note');
    const countEl = wrap.querySelector('.rating-count');
    const lockMsg = wrap.querySelector('.rating-locked-msg');
    const communityEl = wrap.querySelector('.rating-community');
    const saved = localStorage.getItem('al-rating-' + songKey);
    let currentRating = saved ? parseInt(saved, 10) : 0;
    let isLocked = currentRating > 0;

    function render() {
      notes.forEach((note, idx) => {
        note.classList.toggle('filled', idx < currentRating);
      });
      if (countEl) countEl.textContent = currentRating > 0 ? currentRating + '/5' : '';
      if (lockMsg) lockMsg.classList.toggle('visible', isLocked);
      if (starsWrap) starsWrap.classList.toggle('is-locked', isLocked);
      notes.forEach(n => {
        n.style.cursor = isLocked ? 'default' : 'pointer';
        n.style.opacity = isLocked && !n.classList.contains('filled') ? '0.3' : '1';
      });
    }

    render();

    notes.forEach((note, idx) => {
      note.addEventListener('click', (e) => {
        e.stopPropagation();
        if (isLocked) return;
        const val = idx + 1;
        currentRating = val;
        isLocked = true;
        localStorage.setItem('al-rating-' + songKey, val);
        render();
        // POP ANIMATION (staggered cascade)
        notes.forEach((n, i) => {
          if (i < val) {
            const delay = i * 60;
            setTimeout(() => {
              n.classList.add('pop');
              n.classList.add('glow');
              setTimeout(() => { n.classList.remove('pop'); }, 550);
              setTimeout(() => { n.classList.remove('glow'); }, 1250);
            }, delay);
          }
        });
        // Update (and share) the overall community rating for this song.
        recordLocalVote(songKey, val);
        if (communityEl) communityEl.innerHTML = ratingCommunityHtml(songKey);
        pushSongRating(songKey, val);
      });
      note.addEventListener('mouseenter', () => {
        if (isLocked) return;
        notes.forEach((n, i) => n.classList.toggle('filled', i <= idx));
      });
    });

    wrap.addEventListener('mouseleave', () => {
      if (isLocked) return;
      notes.forEach((n, i) => n.classList.toggle('filled', i < currentRating));
    });
  });
};

// ═══════════════════════════════════════════════════════════════
