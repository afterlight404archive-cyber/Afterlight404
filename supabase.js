//  SUPABASE CONNECTION MODULE
// ═══════════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════════
let sb = null; // the active supabase client, or null if running local-only

// Default database every visitor connects to automatically. Read from window.AFTERLIGHT_DB_CONFIG,
// which lives in config.js — a separate file so the actual project URL/key never has to be
// pasted into (or found inside) the main app code. It's still safe to expose publicly if it
// does end up committed somewhere — this is the publishable/anon key, meant to be used
// client-side — but keeping it in one small, swappable file makes it easy to rotate, keep
// out of a public repo, or generate per-deploy without touching supabase.js. See config.js.
const DEFAULT_DB_CONFIG = (typeof window !== 'undefined' && window.AFTERLIGHT_DB_CONFIG) || null;

function getDbConfig() {
  const raw = localStorage.getItem('al-db-config');
  if (raw) return JSON.parse(raw);
  if (DEFAULT_DB_CONFIG && DEFAULT_DB_CONFIG.url && DEFAULT_DB_CONFIG.key) return DEFAULT_DB_CONFIG;
  return null;
}

function isDbConnected() {
  return !!getDbConfig() && !!sb;
}

function initSupabaseClient() {
  const cfg = getDbConfig();
  if (!cfg || !cfg.url || !cfg.key) { sb = null; return; }
  try {
    sb = window.supabase.createClient(cfg.url, cfg.key);
    ensureAnonSession();
  } catch (e) {
    console.error('Supabase init failed:', e);
    sb = null;
  }
  updateDbStatusUI();
}

function updateDbStatusUI() {
  const label = document.getElementById('db-status-label');
  const sub = document.getElementById('db-status-sub');
  const connectForm = document.getElementById('db-connect-form');
  const connectedActions = document.getElementById('db-connected-actions');
  if (!label) return; // panel not open yet
  if (isDbConnected()) {
    const cfg = getDbConfig();
    label.textContent = '🟢 Connected to Supabase';
    label.style.color = 'var(--accent2)';
    sub.textContent = cfg.url + ' — songs, moods, and chat now sync for every visitor.';
    connectForm.style.display = 'none';
    connectedActions.style.display = 'block';
  } else {
    label.textContent = '⚪ Not connected — running in local mode';
    label.style.color = 'var(--text)';
    sub.textContent = 'Songs, moods, and chat are saved only on this device.';
    connectForm.style.display = 'block';
    connectedActions.style.display = 'none';
  }
}

async function testSupabaseConnection() {
  const url = document.getElementById('db-url').value.trim();
  const key = document.getElementById('db-key').value.trim();
  const errEl = document.getElementById('db-error');
  errEl.style.display = 'none';
  if (!url || !key) { errEl.textContent = 'Enter both the URL and key first.'; errEl.style.display = 'block'; return; }
  try {
    const testClient = window.supabase.createClient(url, key);
    const { error } = await testClient.from('songs').select('id').limit(1);
    if (error && error.code !== 'PGRST116') {
      // table missing is okay at this stage (means SQL not run yet) — surface other errors
      if (error.message && error.message.toLowerCase().includes('does not exist')) {
        errEl.textContent = '✓ Connection works, but tables are missing. Run the Setup SQL first, then connect.';
        errEl.style.color = 'var(--accent2)';
        errEl.style.display = 'block';
        return;
      }
      throw error;
    }
    errEl.textContent = '✓ Connection successful. You can hit Connect now.';
    errEl.style.color = 'var(--accent2)';
    errEl.style.display = 'block';
  } catch (e) {
    errEl.textContent = '✕ Could not connect: ' + (e.message || 'check your URL and key.');
    errEl.style.color = 'var(--red)';
    errEl.style.display = 'block';
  }
}

async function connectSupabase() {
  const url = document.getElementById('db-url').value.trim();
  const key = document.getElementById('db-key').value.trim();
  const errEl = document.getElementById('db-error');
  errEl.style.display = 'none';
  if (!url || !key) { errEl.textContent = 'Enter both the URL and key first.'; errEl.style.display = 'block'; return; }
  if (!url.startsWith('https://') || !url.includes('supabase.co')) {
    errEl.textContent = 'That doesn\'t look like a valid Supabase URL.'; errEl.style.display = 'block'; return;
  }
  localStorage.setItem('al-db-config', JSON.stringify({ url, key }));
  initSupabaseClient();
  if (!sb) { errEl.textContent = 'Failed to initialize connection.'; errEl.style.display = 'block'; return; }
  initLivePresence();

  // The songs/moods/genres/admin_settings tables only accept writes from an authenticated
  // Supabase session (see the setup SQL). Establish that now, since we're about to push
  // this browser's local data up as the initial seed.
  const authOk = await ensureSupabaseAuthSession();

  // Push current local data up, then pull shared data back down
  const failures = authOk ? await pushLocalDataToSupabase() : [];
  await pullSharedDataFromSupabase();
  updateDbStatusUI();
  renderMoodBar();
  renderSongGrid();

  const lastSyncEl = document.getElementById('db-last-sync');
  if (lastSyncEl && authOk) lastSyncEl.textContent = 'Last synced: ' + new Date().toLocaleString();

  if (!authOk) {
    showToast('Connected, but the initial data push for songs/moods/genres/admin settings was skipped because no authenticated Supabase session could be established. Click "Sync Now" below after fixing your Supabase Auth user (Authentication → Users) to push that data.', {type:'error'});
  } else if (failures.length) {
    showToast('Connected, but some data failed to push: ' + failures.map(f => f.table + ' (' + f.error + ')').join('; ') + '. Click "Sync Now" to retry once fixed.', {type:'error'});
  } else {
    showToast('Connected! Your songs, moods, and chat are now synced to Supabase for all visitors.');
  }
}

// Makes sure we hold a real Supabase Auth session for the current admin, creating the
// matching Auth user via self-service sign-up the first time if one doesn't exist yet.
// Returns true if a session is active afterward, false otherwise.
async function ensureSupabaseAuthSession() {
  if (!sb || !currentAdmin) return false;
  try {
    const { data: sessionData } = await sb.auth.getSession();
    if (sessionData && sessionData.session) return true;
  } catch (e) { /* fall through and try to establish one */ }

  const email = currentAdmin.email;
  const pass = prompt('Enter your admin password once more to finish setting up secure Supabase write access for ' + email + ':');
  if (!pass) return false;

  try {
    const signIn = await sb.auth.signInWithPassword({ email, password: pass });
    if (!signIn.error) return true;

    // No matching Supabase Auth user yet — create one via self-service sign-up.
    const signUp = await sb.auth.signUp({ email, password: pass });
    if (!signUp.error && signUp.data && signUp.data.session) return true;
    if (!signUp.error) {
      showToast('Almost done: check ' + email + ' for a confirmation email from Supabase, click it, then come back and click "Sync Now" below.');
      return false;
    }
    showToast('Could not set up Supabase write access automatically (' + signUp.error.message + '). Create the user manually in Supabase → Authentication → Users, then click "Sync Now" below.', {type:'error'});
    return false;
  } catch (e) {
    console.error('ensureSupabaseAuthSession failed:', e);
    return false;
  }
}

// Gives this browser a real, anonymous Supabase Auth session the first time it needs
// one — no email or password involved, invisible to the visitor. This is what lets the
// database tell "a real visitor's browser" apart from "someone who only has the public
// anon key", for chat messages, DMs, friend requests, and profile edits. Supabase
// stores the session in this browser's localStorage, so the same browser keeps the
// same identity on future visits.
async function ensureAnonSession() {
  if (!sb) return;
  try {
    const { data } = await sb.auth.getSession();
    if (data && data.session) return;
    const { error } = await sb.auth.signInAnonymously();
    if (error) console.error('Anonymous session setup failed:', error.message);
  } catch (e) {
    console.error('Anonymous session setup failed:', e);
  }
}

// ═══════════════════════════════════════════════════════════════
//  LIVE STATS (Supabase Realtime Presence + aggregate counts)
//  Every visitor's browser silently joins a shared "site-presence" channel the
//  moment Supabase is connected — this is what powers "Online Right Now" in the
//  admin panel. It costs each visitor nothing (no UI, no data collected beyond a
//  display name if they're signed in) and is torn down cleanly on disconnect.
// ═══════════════════════════════════════════════════════════════

let livePresenceChannel = null;
let livePresenceRetrackTimer = null;
let liveStatsRefreshTimer = null; // only ticks while the admin has the Live Stats tab open

function initLivePresence() {
  if (!sb || livePresenceChannel) return;
  try {
    livePresenceChannel = sb.channel('site-presence', {
      config: { presence: { key: (crypto.randomUUID ? crypto.randomUUID() : String(Date.now()) + Math.random()) } }
    });
    livePresenceChannel
      .on('presence', { event: 'sync' }, () => {
        renderLiveStatsPresence();
        if (document.getElementById('room-list')) renderRoomList();
        if (document.getElementById('chats-list-body')) renderChatsListPage();
        if (document.getElementById('friends-messages-list')) renderMessagesTab();
        if (document.getElementById('dm-header-name')) renderDmHeaderPresence();
      })
      .subscribe((status) => { if (status === 'SUBSCRIBED') trackLivePresence(); });
    // Re-track periodically so login/logout while the tab is open (or across a long
    // session) is reflected within ~20s, without needing to hook every auth function.
    if (!livePresenceRetrackTimer) livePresenceRetrackTimer = setInterval(trackLivePresence, 20000);
  } catch (e) {
    console.error('Live presence init failed:', e);
    livePresenceChannel = null;
  }
}

function trackLivePresence() {
  if (!livePresenceChannel) return;
  try {
    livePresenceChannel.track({
      name: currentUser ? currentUser.name : null,
      isAdmin: !!currentAdmin,
      away: document.hidden,
      online_at: new Date().toISOString()
    });
  } catch (e) { console.error('Live presence track failed:', e); }
}
// Re-track immediately when the tab is backgrounded/foregrounded, so friends
// see "Away" almost instantly instead of waiting for the 20s retrack timer.
document.addEventListener('visibilitychange', () => { if (livePresenceChannel) trackLivePresence(); });

// Returns 'online' | 'away' | 'offline' for a given username, based on the
// shared presence channel above. 'offline' just means we don't currently see
// them in presence — could be truly offline, or Supabase isn't connected.
function getFriendPresence(name) {
  if (!livePresenceChannel || !name) return 'offline';
  try {
    const state = livePresenceChannel.presenceState();
    const entries = Object.values(state).map(arr => arr[0]).filter(Boolean);
    const match = entries.find(e => e.name && e.name.toLowerCase() === name.toLowerCase());
    if (!match) return 'offline';
    return match.away ? 'away' : 'online';
  } catch (e) { return 'offline'; }
}

function teardownLivePresence() {
  if (livePresenceRetrackTimer) { clearInterval(livePresenceRetrackTimer); livePresenceRetrackTimer = null; }
  if (livePresenceChannel && sb) {
    try { sb.removeChannel(livePresenceChannel); } catch (e) { /* ignore */ }
  }
  livePresenceChannel = null;
  renderLiveStatsPresence();
}

// Reads the current presence state and updates the "Right Now" cards + who's-online
// list + the small live-count badge on the nav item. Safe to call any time — the
// elements exist in the DOM whether or not the Live Stats tab is currently visible.
function getLiveOnlineCount() {
  if (!livePresenceChannel) return 1;
  try {
    const state = livePresenceChannel.presenceState();
    const n = Object.values(state).length;
    return n > 0 ? n : 1;
  } catch (e) { return 1; }
}
function renderLiveStatsPresence() {
  const totalEl = document.getElementById('ls-online-total');
  const signedInEl = document.getElementById('ls-online-signed-in');
  const guestsEl = document.getElementById('ls-online-guests');
  const listEl = document.getElementById('ls-online-list');
  const badge = document.getElementById('admin-nav-live-badge');
  if (!totalEl) return;

  if (!livePresenceChannel) {
    totalEl.textContent = '1';
    signedInEl.textContent = currentAdmin ? '1' : '0';
    guestsEl.textContent = currentAdmin ? '0' : '1';
    if (listEl) listEl.innerHTML = '<p style="font-family:var(--mono);font-size:11px;color:var(--muted);">Not connected to Supabase, so only this device is visible — that\'s you.</p>';
    if (badge) badge.style.display = 'none';
    return;
  }

  let entries = [];
  try {
    const state = livePresenceChannel.presenceState();
    entries = Object.values(state).map(arr => arr[0]).filter(Boolean);
  } catch (e) { entries = []; }

  const total = entries.length;
  const signedIn = entries.filter(e => e.name).length;
  const guests = total - signedIn;

  totalEl.textContent = String(total);
  signedInEl.textContent = String(signedIn);
  guestsEl.textContent = String(guests);

  if (badge) {
    if (total > 0) { badge.textContent = total; badge.style.display = 'inline-block'; }
    else { badge.style.display = 'none'; }
  }

  if (listEl) {
    if (entries.length === 0) {
      listEl.innerHTML = '<p style="font-family:var(--mono);font-size:11px;color:var(--muted);">No live presence data yet.</p>';
    } else {
      // Signed-in visitors first, most recently active first within each group.
      const sorted = entries.slice().sort((a, b) => {
        if (!!b.name !== !!a.name) return (b.name ? 1 : 0) - (a.name ? 1 : 0);
        return new Date(b.online_at || 0) - new Date(a.online_at || 0);
      });
      listEl.innerHTML = sorted.map(e => {
        const label = e.name ? escapeHtml(e.name) : 'Guest (not signed in)';
        const tag = e.isAdmin ? ' <span style="color:var(--accent);">· admin</span>' : '';
        return `<div class="admin-song-row"><div class="song-info">${label}${tag}</div></div>`;
      }).join('');
    }
  }
}

// ═══════════════════════════════════════════════════════════════
async function loadLiveStatsCounts() {
  const elAccounts = document.getElementById('ls-total-accounts');
  const elToday = document.getElementById('ls-new-today');
  const elMsgs = document.getElementById('ls-total-messages');
  const elBots = document.getElementById('ls-bot-signups');
  const elSource = document.getElementById('ls-data-source-note');
  if (!elAccounts) return;

  if (isDbConnected() && sb) {
    try {
      const [accountsRes, messagesRes] = await Promise.all([
        sb.from('users').select('*', { count: 'exact', head: true }),
        sb.from('chat_messages').select('*', { count: 'exact', head: true })
      ]);
      const todayStart = new Date(); todayStart.setHours(0, 0, 0, 0);
      const todayRes = await sb.from('users').select('*', { count: 'exact', head: true }).gte('created_at', todayStart.toISOString());

      // Bot/spam-burst heuristic: a run of 3+ accounts created within 10 seconds of
      // each other. Real human signups don't cluster like that; a script does. This
      // is a signal to go look at the Users tab, not an automatic verdict.
      const { data: recentUsers } = await sb.from('users').select('created_at').order('created_at', { ascending: true }).limit(1000);
      let burstCount = 0;
      if (recentUsers && recentUsers.length > 1) {
        let runLength = 1;
        for (let i = 1; i < recentUsers.length; i++) {
          const gap = new Date(recentUsers[i].created_at) - new Date(recentUsers[i - 1].created_at);
          if (gap <= 10000) { runLength++; } else { if (runLength >= 3) burstCount += runLength; runLength = 1; }
        }
        if (runLength >= 3) burstCount += runLength;
      }

      elAccounts.textContent = String(accountsRes.count ?? 0);
      elMsgs.textContent = String(messagesRes.count ?? 0);
      elToday.textContent = String(todayRes.count ?? 0);
      elBots.textContent = String(burstCount);
      if (elSource) elSource.textContent = 'Live from Supabase — reflects every visitor to the site, not just this device.';
    } catch (e) {
      console.error('Live stats load failed:', e);
      if (elSource) elSource.textContent = 'Could not load live counts from Supabase — check your connection on the Database tab.';
    }
  } else {
    const users = JSON.parse(localStorage.getItem('al-users') || '[]');
    const rooms = typeof getRooms === 'function' ? getRooms() : [];
    let msgCount = 0;
    rooms.forEach(r => { msgCount += (typeof getMessages === 'function' ? getMessages(r.name).length : 0); });
    elAccounts.textContent = String(users.length);
    elMsgs.textContent = String(msgCount);
    elToday.textContent = '—';
    elBots.textContent = '—';
    if (elSource) elSource.textContent = 'Local mode — connect Supabase (Database tab) for site-wide live stats across every visitor, not just this device.';
  }
}

async function syncNowToSupabase() {
  if (!isDbConnected() || !sb) { showToast('Connect to Supabase first.', {type:'error'}); return; }
  const authOk = await ensureSupabaseAuthSession();
  const failures = await pushLocalDataToSupabase();
  await pullSharedDataFromSupabase();
  updateDbStatusUI();
  renderMoodBar();
  renderSongGrid();

  const lastSyncEl = document.getElementById('db-last-sync');
  if (lastSyncEl) lastSyncEl.textContent = 'Last synced: ' + new Date().toLocaleString();

  if (!authOk) {
    showToast('Pulled shared data, but pushing admin-only data (songs/moods/genres/admin settings) still needs an authenticated Supabase session — see the message above.', {type:'error'});
  } else if (failures.length) {
    showToast('Synced with problems: ' + failures.map(f => f.table + ' (' + f.error + ')').join('; '), {type:'error'});
  } else {
    showToast('Synced!');
  }
}

function disconnectSupabase() {
  if (!confirm('Disconnect from Supabase? The site will go back to local-only mode (data stays in this browser only). Your Supabase project and its data are NOT deleted.')) return;
  localStorage.removeItem('al-db-config');
  teardownLivePresence();
  sb = null;
  updateDbStatusUI();
  showToast('Disconnected. Running in local mode again.');
}

// Push whatever is currently in localStorage up to Supabase (first connect = seed the DB).
// Returns an array of { table, error } for anything that failed, instead of swallowing
// failures silently — a failed push used to look identical to a successful one.
async function pushLocalDataToSupabase() {
  const failures = [];
  if (!sb) return failures;

  async function tryPush(table, rows, onConflict) {
    if (!rows.length) return;
    const { error } = await sb.from(table).upsert(rows, { onConflict });
    if (error) { console.error('Push to ' + table + ' failed:', error); failures.push({ table, error: error.message }); }
  }

  // songs
  const songRows = songs.map(s => ({
    song_key: s.number, title: s.title, artist: s.artist, year: s.year,
    mood: s.mood, about: s.about, meaning: s.meaning, lyrics: s.lyrics,
    credit: s.credit, spotify: s.spotify, genre: s.genre
  }));
  await tryPush('songs', songRows, 'song_key');

  // moods
  const moodRows = Object.keys(MOOD_MAP).map(key => ({
    mood_key: key, label: MOOD_MAP[key].label, color: MOOD_MAP[key].color, bg: MOOD_MAP[key].bg
  }));
  await tryPush('moods', moodRows, 'mood_key');

  // genres
  const genreRows = getGenres().map(g => ({ name: g }));
  await tryPush('genres', genreRows, 'name');

  // chat rooms
  // Only push rooms someone actually created (owns_alias(creator) needs a real
  // account behind the name). The 4 built-in "system" rooms are seeded directly
  // in the Setup SQL instead — pushing them here always failed RLS for every
  // visitor, including the real admin, since no account is named "system".
  const roomRows = getRooms().filter(r => r.creator !== 'system').map(r => ({ name: r.name, creator: r.creator, created_at: new Date(r.created).toISOString() }));
  await tryPush('chat_rooms', roomRows, 'name');

  const adminErr = await pushAdminSettingsToSupabase();
  if (adminErr) failures.push({ table: 'admin_settings', error: adminErr });

  return failures;
}

// Push just the admin lock (access code hash + login email) up to Supabase, so changing
// it in the panel applies to every browser, not just this one.
//
// SECURITY NOTE: admin_pass_hash is deliberately NEVER written here. This table is
// publicly readable (any visitor's anon key can select from it — that's required so the
// "5 taps on the logo" access-code gate and is_site_admin() email check work from any
// browser). admin_pass_hash used to be an unsalted SHA-256 of your REAL admin login
// password — the same one used for sb.auth.signInWithPassword — which meant it was an
// offline-crackable copy of your actual password, sitting in a table anyone could read.
// The real login check is sb.auth.signInWithPassword() itself (see handleAdminLogin);
// the local hash is now only ever compared locally and only ever stored in
// localStorage, never synced to Supabase.
// Returns an error message string on failure, or null on success/no-op.
async function pushAdminSettingsToSupabase() {
  if (!sb) return null;
  try {
    const row = {
      id: 1,
      access_code_hash: await getAdminCodeHash(),
      admin_email: getAdminEmail(),
      owner_username: getOwnerUsername() || null
    };
    const { error } = await sb.from('admin_settings').upsert(row, { onConflict: 'id' });
    if (error) { console.error('Push admin settings to Supabase failed:', error); return error.message; }
    return null;
  } catch (e) {
    console.error('Push admin settings to Supabase failed:', e);
    return e.message || String(e);
  }
}

// Pull shared data down from Supabase and overwrite local state
async function pullSharedDataFromSupabase() {
  if (!sb) return;
  try {
    const { data: songData } = await sb.from('songs').select('*');
    if (songData && songData.length) {
      songs = songData.map(s => ({
        number: s.song_key, title: s.title, artist: s.artist, year: s.year,
        mood: s.mood, about: s.about, meaning: s.meaning, lyrics: s.lyrics,
        credit: s.credit, spotify: s.spotify, genre: s.genre || []
      }));
      saveSongs();
    }

    const { data: moodData } = await sb.from('moods').select('*');
    if (moodData && moodData.length) {
      const map = {};
      moodData.forEach(m => { map[m.mood_key] = { label: m.label, color: m.color, bg: m.bg }; });
      MOOD_MAP = map;
      saveMoodMap(MOOD_MAP);
    }

    const { data: genreData } = await sb.from('genres').select('*');
    if (genreData && genreData.length) {
      saveGenres(genreData.map(g => g.name));
    }

    const { data: roomData } = await sb.from('chat_rooms').select('*');
    if (roomData && roomData.length) {
      saveRooms(roomData.map(r => ({ name: r.name, creator: r.creator, created: new Date(r.created_at).getTime() })));
    }

    const { data: ratingRows } = await sb.from('song_ratings').select('song_key,value');
    if (ratingRows) {
      const agg = {};
      ratingRows.forEach(r => {
        if (!agg[r.song_key]) agg[r.song_key] = { sum: 0, count: 0 };
        agg[r.song_key].sum += r.value;
        agg[r.song_key].count += 1;
      });
      ratingStats = agg;
      saveRatingStats();
    }

    const { data: adminRows } = await sb.from('admin_settings').select('*').eq('id', 1).limit(1);
    if (adminRows && adminRows.length) {
      const a = adminRows[0];
      if (a.access_code_hash) localStorage.setItem('al-admin-code-hash', a.access_code_hash);
      if (a.admin_email) localStorage.setItem('al-admin-email', a.admin_email);
      // Owner is a shared, site-wide setting, so an explicit "no owner" (null) from
      // Supabase should clear it locally too, not just leave whatever was here before.
      if (a.owner_username) localStorage.setItem('al-owner-username', a.owner_username);
      else localStorage.removeItem('al-owner-username');
      // admin_pass_hash is no longer synced from Supabase at all (see pushAdminSettingsToSupabase) —
      // each browser's local copy is set only by typing the password in on that device (see
      // saveAdminLoginCredentials / handleAdminLogin), never pulled from a shared table.
    }

    // Comments were previously 100% localStorage (never shared). Pull everyone's
    // comments, grouped by song_key, into the same per-song cache format the UI reads.
    const { data: commentRows } = await sb.from('comments').select('song_key,author,text,created_at').order('created_at', { ascending: true });
    if (commentRows) {
      const bySong = {};
      commentRows.forEach(c => {
        if (!bySong[c.song_key]) bySong[c.song_key] = [];
        bySong[c.song_key].push({ author: c.author, text: c.text, time: new Date(c.created_at).getTime() });
      });
      Object.keys(bySong).forEach(key => localStorage.setItem('al-comments-' + key, JSON.stringify(bySong[key])));
    }
  } catch (e) {
    console.error('Pull from Supabase failed:', e);
  }
}

// Sends a single comment straight to Supabase the moment it's posted (not batched with
// the rest of Sync Now) so other visitors see it without the poster having to hit Sync.
// Returns an error message string on failure, or null on success/not-connected.
async function pushCommentToSupabase(songKey, author, text) {
  if (!sb) return null;
  try {
    const { error } = await sb.from('comments').insert({ song_key: String(songKey), author, text });
    if (error) { console.error('Push comment failed:', error); return error.message; }
    return null;
  } catch (e) {
    console.error('Push comment failed:', e);
    return e.message || String(e);
  }
}

function copySetupSQL() {
  const sql = `-- AfterLight:404Archive — Supabase setup
-- Run this once in your Supabase project's SQL Editor

create table if not exists songs (
  id bigint generated always as identity primary key,
  song_key text unique not null,
  title text, artist text, year text, mood text,
  about text, meaning text, lyrics text, credit text, spotify text,
  genre text[]
);

create table if not exists moods (
  id bigint generated always as identity primary key,
  mood_key text unique not null,
  label text, color text, bg text
);

create table if not exists genres (
  id bigint generated always as identity primary key,
  name text unique not null
);

create table if not exists chat_rooms (
  id bigint generated always as identity primary key,
  name text unique not null,
  creator text,
  created_at timestamptz default now()
);

create table if not exists chat_messages (
  id bigint generated always as identity primary key,
  room text not null,
  author text not null,
  text text not null,
  reply_to bigint,
  created_at timestamptz default now()
);

-- The 4 built-in rooms are seeded here, once, rather than pushed from the client.
-- No account is named "system", so owns_alias('system') can never be true — pushing
-- these from the browser (as pushLocalDataToSupabase used to) failed RLS for every
-- visitor, including the real admin.
insert into chat_rooms (name, creator) values
  ('general', 'system'),
  ('melodrama', 'system'),
  ('phoebe-bridgers', 'system'),
  ('3am-spiral', 'system')
on conflict (name) do nothing;

-- Song comments were never synced to Supabase at all before — 100% per-browser
-- localStorage. This table + its policies below make them shared like chat.
create table if not exists comments (
  id bigint generated always as identity primary key,
  song_key text not null,
  author text not null,
  text text not null,
  created_at timestamptz default now()
);
create index if not exists comments_song_key_idx on comments (song_key);

create table if not exists users (
  id bigint generated always as identity primary key,
  username text unique not null,
  code text unique,
  bio text,
  gender text,
  avatar text,
  owner_id uuid,
  blocked boolean not null default false,
  created_at timestamptz default now()
);

create extension if not exists pgcrypto;

-- ═══════════════════════════════════════════════════════════════
--  ALIAS ACCOUNTS: real cross-device login + single-device sessions
--  Passwords for alias+password accounts now live ONLY here, bcrypt-hashed
--  via pgcrypto — never sent to a browser, and readable only by the one
--  session currently logged in as that account (see the policy below).
--  All reads/writes go through alias_signup / alias_login / alias_change_password,
--  which run as this table's owner and so bypass RLS entirely — no client,
--  logged in or not, can write this table any other way.
--  session_token is reissued every time alias_login succeeds. Every logged-in
--  browser listens (via Realtime) for ITS OWN row to change; if the token it
--  sees is no longer the one it was given, another device just logged in as
--  the same account, so it logs itself out and shows a notice.
-- ═══════════════════════════════════════════════════════════════
create table if not exists user_auth (
  username text primary key references users(username) on delete cascade,
  password_hash text not null,
  owner_id uuid,
  session_token uuid not null default gen_random_uuid(),
  updated_at timestamptz default now()
);
alter table user_auth enable row level security;
drop policy if exists "Owner reads own auth row" on user_auth;
create policy "Owner reads own auth row" on user_auth for select to authenticated using (owner_id = auth.uid());

create or replace function alias_signup(p_username text, p_password text)
returns uuid
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  v_token uuid := gen_random_uuid();
begin
  if p_username is null or char_length(p_username) < 3 then
    raise exception 'Invalid username.';
  end if;
  if p_password is null or char_length(p_password) < 6 then
    raise exception 'Password must be at least 6 characters.';
  end if;
  if exists (select 1 from user_auth where username = p_username) then
    raise exception 'That anonymous name is already taken.';
  end if;
  -- upsert, not insert: a row may already exist here from before password
  -- accounts were tracked server-side (e.g. an old local-only profile sync).
  insert into users (username, owner_id) values (p_username, auth.uid())
    on conflict (username) do update set owner_id = excluded.owner_id;
  insert into user_auth (username, password_hash, owner_id, session_token)
    values (p_username, crypt(p_password, gen_salt('bf')), auth.uid(), v_token);
  return v_token;
end;
$$;

create or replace function alias_login(p_username text, p_password text)
returns uuid
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  v_hash text;
  v_token uuid := gen_random_uuid();
begin
  select password_hash into v_hash from user_auth where username = p_username;
  if v_hash is null or crypt(p_password, v_hash) <> v_hash then
    raise exception 'Invalid name or password.';
  end if;
  if exists (select 1 from users where username = p_username and blocked) then
    raise exception 'This account has been blocked by the site owner.';
  end if;
  update user_auth set owner_id = auth.uid(), session_token = v_token, updated_at = now() where username = p_username;
  update users set owner_id = auth.uid() where username = p_username;
  return v_token;
end;
$$;

create or replace function alias_change_password(p_username text, p_old_password text, p_new_password text)
returns boolean
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  v_hash text;
begin
  select password_hash into v_hash from user_auth where username = p_username and owner_id = auth.uid();
  if v_hash is null or crypt(p_old_password, v_hash) <> v_hash then
    raise exception 'Current password is incorrect.';
  end if;
  if p_new_password is null or char_length(p_new_password) < 6 then
    raise exception 'New password must be at least 6 characters.';
  end if;
  update user_auth set password_hash = crypt(p_new_password, gen_salt('bf')), updated_at = now() where username = p_username;
  return true;
end;
$$;

grant execute on function alias_signup(text, text) to anon, authenticated;
grant execute on function alias_login(text, text) to anon, authenticated;
grant execute on function alias_change_password(text, text, text) to anon, authenticated;

-- Lets each logged-in browser hear its OWN session_token change in real time.
-- Safe to re-run: skips quietly if already added to the publication.
do $$
begin
  alter publication supabase_realtime add table user_auth;
exception when duplicate_object then
  null;
end $$;

create table if not exists friend_requests (
  id bigint generated always as identity primary key,
  from_user text not null,
  to_user text not null,
  status text not null default 'pending',
  created_at timestamptz default now()
);

create table if not exists dm_messages (
  id bigint generated always as identity primary key,
  pair_key text not null,
  sender text not null,
  recipient text not null,
  text text,
  song_key text,
  created_at timestamptz default now()
);

-- Generic public key/value store used by Moderation, Turnstile, and EmailJS
-- settings (Admin → Safety & Bots, Email (OTP)) — this table was referenced
-- by that code already, but never actually got created here, so every read/
-- write to it was silently failing. Values are meant to be public (site
-- keys / feature flags), not secrets; write access is admin-only (its RLS
-- policies are set up further below, after is_site_admin() exists).
create table if not exists site_settings (
  key text primary key,
  value text
);

create table if not exists admin_settings (
  id bigint primary key,
  access_code_hash text,
  admin_email text,
  owner_username text
);

-- BOOTSTRAP SEED: is_site_admin() (defined further below) grants write access only to
-- whoever's signed-in email matches admin_settings.admin_email — but writing to
-- admin_settings itself requires is_site_admin() to already be true. Without this seed
-- row, that check compares your email to NULL forever, no one ever passes it, and the
-- admin email/access-code can never be set through the app at all. This creates row id=1
-- with the app's built-in default admin email the first time this SQL runs; after that,
-- logging in as that default admin and changing the email in the panel updates this row
-- normally. Safe to re-run — does nothing once the row already exists.
insert into admin_settings (id, admin_email) values (1, 'jk@afterlight.com')
  on conflict (id) do nothing;

-- Powers the "X people rated this song, average Y" community rating shown
-- under each song. voter_id is a random id generated in the visitor's own
-- browser (localStorage) — rating doesn't require an account. The unique
-- constraint stops a single browser from voting on the same song twice; the
-- lack of any update/delete policy below means a vote can't be changed via
-- the API once cast, matching the "locked after vote" UI.
create table if not exists song_ratings (
  id bigint generated always as identity primary key,
  song_key text not null,
  voter_id text not null,
  value smallint not null check (value between 1 and 5),
  created_at timestamptz default now(),
  unique (song_key, voter_id)
);

-- SECURITY FIX: this table is publicly readable (see policy below), and it used to also
-- store admin_pass_hash — an unsalted hash of your REAL admin login password, the same
-- one used to sign in to Supabase Auth. That made your real password crackable offline by
-- anyone with the public anon key. It's no longer written here at all (see
-- pushAdminSettingsToSupabase in the app); this line removes it from any project that ran
-- an older version of this SQL. Safe to re-run.
alter table admin_settings drop column if exists admin_pass_hash;

-- Make sure these columns exist even if this SQL was run before on an older version
-- of this file (safe to re-run; does nothing if the columns are already there).
alter table chat_messages add column if not exists reply_to bigint;
alter table users add column if not exists owner_id uuid;
alter table users add column if not exists blocked boolean not null default false;
alter table admin_settings add column if not exists owner_username text;

-- Allow public read access (so visitors can see songs/chat without logging in)
alter table songs enable row level security;
alter table moods enable row level security;
alter table genres enable row level security;
alter table chat_rooms enable row level security;
alter table chat_messages enable row level security;
alter table comments enable row level security;
alter table site_settings enable row level security;
alter table users enable row level security;
alter table friend_requests enable row level security;
alter table dm_messages enable row level security;
alter table admin_settings enable row level security;
alter table song_ratings enable row level security;

-- ═══════════════════════════════════════════════════════════════
--  IDENTITY HELPERS
--  Every visitor's browser silently holds a real, server-issued Supabase session —
--  either an "anonymous" one (created automatically the moment the site loads) for
--  local alias+password accounts, or a real one for admin / "Continue with Google"
--  logins. These functions are what the policies below use to tell those apart, so
--  that "someone with the anon key" is no longer enough to write as another person
--  or unlock admin-only tables.
-- ═══════════════════════════════════════════════════════════════

-- True only if the currently logged-in local alias (checked by username) is the one
-- this session actually signed in/up as. Writes to chat/DMs/friend requests/profiles
-- are gated on this instead of just trusting whatever author/sender name is passed in.
create or replace function owns_alias(p_username text)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from users u
    where u.username = p_username
      and u.owner_id is not null
      and u.owner_id = auth.uid()
  );
$$;

-- True only for a REAL session (admin, or a "Continue with Google" user) — false for
-- the anonymous session every ordinary visitor now silently holds, and false if there
-- is no session at all.
create or replace function is_real_session()
returns boolean
language sql
stable
set search_path = public
as $$
  select auth.uid() is not null
    and coalesce((auth.jwt() ->> 'is_anonymous')::boolean, false) = false;
$$;

-- True only for the actual site admin: a real session whose email matches the admin
-- email on record. This matters because regular visitors can ALSO get a real
-- (non-anonymous) session via "Continue with Google" — is_real_session() alone would
-- wrongly include them, so admin-only tables check this instead.
create or replace function is_site_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select is_real_session()
    and lower(coalesce(auth.jwt() ->> 'email', '')) =
        lower(coalesce((select admin_email from admin_settings where id = 1), '__none__'));
$$;

-- True only if the CALLER's session is currently signed in as the alias set
-- as the site owner (admin_settings.owner_username), the same alias account
-- the "Ban User" button appears on. This is what lets the owner ban/unban
-- from their profile card without needing a real (non-anonymous) session —
-- the owner is usually just a regular alias+password account, not the admin.
create or replace function is_owner_session()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from users u
    join admin_settings s on s.id = 1
    where u.username = s.owner_username
      and u.owner_id is not null
      and u.owner_id = auth.uid()
  );
$$;

-- SECURITY: 'blocked' must never be able to move through the ordinary
-- "update your own profile" path (see "Own session updates users" below) —
-- otherwise a blocked user could simply unblock themselves the next time
-- their profile syncs. This trigger snaps 'blocked' back to its previous
-- value on every update, no matter which policy or client call the write
-- came through, unless the caller is the admin or the site owner.
create or replace function guard_users_blocked()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.blocked is distinct from old.blocked and not (is_site_admin() or is_owner_session()) then
    new.blocked := old.blocked;
  end if;
  return new;
end;
$$;
drop trigger if exists trg_guard_users_blocked on users;
create trigger trg_guard_users_blocked before update on users
  for each row execute function guard_users_blocked();

-- The one and only way 'blocked' should change: called by the admin panel's
-- Block/Unblock button or the owner's Ban/Unban button. Runs as this table's
-- owner (bypassing RLS) so it works for the owner's anonymous alias session
-- too, but still checks authorization itself, and the owner account can
-- never be blocked even by the admin.
create or replace function set_user_blocked(p_username text, p_blocked boolean)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not (is_site_admin() or is_owner_session()) then
    raise exception 'Not authorized.';
  end if;
  if exists (select 1 from admin_settings where id = 1 and owner_username = p_username) then
    raise exception 'The owner account can''t be blocked.';
  end if;
  update users set blocked = p_blocked where username = p_username;
end;
$$;
grant execute on function set_user_blocked(text, boolean) to anon, authenticated;

-- Clear out any older, wide-open policies from a previous version of this SQL before
-- creating the tightened ones below (safe no-ops on a fresh project).
drop policy if exists "Public upsert users" on users;
drop policy if exists "Public update users" on users;
drop policy if exists "Admin delete users" on users;
drop policy if exists "Public read friend_requests" on friend_requests;
drop policy if exists "Public write friend_requests" on friend_requests;
drop policy if exists "Public read dm_messages" on dm_messages;
drop policy if exists "Public write dm_messages" on dm_messages;
drop policy if exists "Public insert chat_messages" on chat_messages;
drop policy if exists "Public insert chat_rooms" on chat_rooms;
drop policy if exists "Admin write songs" on songs;
drop policy if exists "Admin write moods" on moods;
drop policy if exists "Admin write genres" on genres;
drop policy if exists "Admin write admin_settings" on admin_settings;

create policy "Public read songs" on songs for select using (true);
create policy "Public read moods" on moods for select using (true);
create policy "Public read genres" on genres for select using (true);
create policy "Public read chat_rooms" on chat_rooms for select using (true);
create policy "Public read chat_messages" on chat_messages for select using (true);

-- Ratings: readable by everyone (needed to show the community average/count),
-- and anyone can cast one — no login required. There is deliberately no
-- update/delete policy, so once a row exists it can't be changed via the
-- API; the unique (song_key, voter_id) constraint on the table is what
-- actually stops a single browser voting twice on the same song.
create policy "Public read song_ratings" on song_ratings for select using (true);
create policy "Public insert song_ratings" on song_ratings for insert with check (value between 1 and 5);

-- Profile read stays public (it's an intentional public directory, for friend search)
-- but writes now require the session that's currently logged in as that exact alias.
-- The app sets owner_id itself the moment you log in/sign up, so this can't be spoofed
-- by someone who only has your anon key.
create policy "Public read users" on users for select using (true);
create policy "Own session inserts users" on users for insert to authenticated with check (owner_id = auth.uid());
-- Note: this lets a user update their own row's bio/gender/avatar/etc., but the
-- trg_guard_users_blocked trigger above stops 'blocked' from moving through this
-- path, so a blocked account can't just unblock itself on next profile sync.
create policy "Own session updates users" on users for update to authenticated using (owner_id = auth.uid()) with check (owner_id = auth.uid());
create policy "Admin deletes users" on users for delete using (is_site_admin());

-- Friend requests & DMs: previously readable AND writable by anyone with the anon key.
-- Now: only the two people involved can read a given row, and only the session logged
-- in as the sender can create one. Responding (accept/decline) or removing a friend
-- requires being logged in as the sender OR the recipient, matched by owns_alias().
create policy "Participants read friend_requests" on friend_requests for select to authenticated using (owns_alias(from_user) or owns_alias(to_user));
create policy "Sender creates friend_requests" on friend_requests for insert to authenticated with check (owns_alias(from_user));
create policy "Sender updates friend_requests" on friend_requests for update to authenticated using (owns_alias(from_user)) with check (owns_alias(from_user));
create policy "Recipient responds friend_requests" on friend_requests for update to authenticated using (owns_alias(to_user)) with check (owns_alias(to_user));
create policy "Either party deletes friend_requests" on friend_requests for delete to authenticated using (owns_alias(from_user) or owns_alias(to_user));

create policy "Participants read dm_messages" on dm_messages for select to authenticated using (owns_alias(sender) or owns_alias(recipient));
create policy "Sender sends dm_messages" on dm_messages for insert to authenticated with check (owns_alias(sender));

-- Chat: anyone can still read, but sending/creating a room now requires being logged
-- in as the author, and deleting a message requires being its author OR the admin.
create policy "Session sends chat_messages" on chat_messages for insert to authenticated with check (owns_alias(author));
create policy "Owner or admin deletes chat_messages" on chat_messages for delete to authenticated using (owns_alias(author) or is_site_admin());

-- Comments: same shape as chat — public read, sending requires being logged in as the
-- author, deleting requires being the author or the admin.
create policy "Public read comments" on comments for select using (true);
create policy "Session sends comments" on comments for insert to authenticated with check (owns_alias(author));
create policy "Owner or admin deletes comments" on comments for delete to authenticated using (owns_alias(author) or is_site_admin());

drop policy if exists "Public read site_settings" on site_settings;
drop policy if exists "Admin writes site_settings" on site_settings;
create policy "Public read site_settings" on site_settings for select using (true);
create policy "Admin writes site_settings" on site_settings for all to authenticated using (is_site_admin()) with check (is_site_admin());

create policy "Session creates chat_rooms" on chat_rooms for insert to authenticated with check (owns_alias(creator) or is_site_admin());

-- Admin-only write access for songs/moods/genres/admin_settings now requires the real
-- site-admin session specifically (see is_site_admin() above) — not just any signed-in
-- visitor, since regular users can also get a real session via "Continue with Google".
-- To make this work:
--   1. In Supabase: Authentication → Users → Add user, using the SAME email + password
--      as your admin login on the site (Admin Panel → Account → Admin Login Credentials).
--   2. Logging into the site as admin now also signs you into Supabase Auth behind the
--      scenes, which is what actually unlocks these writes.
-- Visitors who are not signed in can still read songs/moods/genres (needed for the site
-- to display them), but can no longer insert, update, or delete them via the API.
create policy "Admin write songs" on songs for all using (is_site_admin()) with check (is_site_admin());
create policy "Admin write moods" on moods for all using (is_site_admin()) with check (is_site_admin());
create policy "Admin write genres" on genres for all using (is_site_admin()) with check (is_site_admin());

-- admin_settings holds your access-code HASH and admin email (never your real password or
-- a hash of it — see the drop column migration above). Read stays public so the secret
-- "5 clicks on the logo" access-code gate and admin email can sync to any browser you log
-- in from — but WRITE now requires the real site-admin session, so nobody else — anonymous
-- visitor or Google-signed-in regular user — can overwrite these to lock you out or plant
-- their own admin credentials.
create policy "Public read admin_settings" on admin_settings for select using (true);
create policy "Admin write admin_settings" on admin_settings for all using (is_site_admin()) with check (is_site_admin());

-- ═══════════════════════════════════════════════════════════════
--  ANTI-SPAM: length limits + server-side rate limiting
--  The RLS policies above already stop someone from posting AS another
--  person. These add limits on HOW MUCH and HOW FAST — a signed-in bot
--  script could otherwise still flood messages or spin up accounts one
--  after another. Safe to re-run (drops before recreating).
-- ═══════════════════════════════════════════════════════════════

alter table chat_messages drop constraint if exists chat_messages_text_length;
alter table chat_messages add constraint chat_messages_text_length check (char_length(text) between 1 and 2000);
alter table comments drop constraint if exists comments_text_length;
alter table comments add constraint comments_text_length check (char_length(text) between 1 and 2000);

alter table dm_messages drop constraint if exists dm_messages_text_length;
alter table dm_messages add constraint dm_messages_text_length check (text is null or char_length(text) <= 2000);

alter table chat_rooms drop constraint if exists chat_rooms_name_length;
alter table chat_rooms add constraint chat_rooms_name_length check (char_length(name) between 2 and 40);

-- No more than one chat message per author per second.
create or replace function enforce_chat_rate_limit()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  last_msg_time timestamptz;
begin
  select max(created_at) into last_msg_time from chat_messages where author = new.author;
  if last_msg_time is not null and (now() - last_msg_time) < interval '1 second' then
    raise exception 'Sending too fast — please slow down.';
  end if;
  return new;
end;
$$;

drop trigger if exists trg_chat_rate_limit on chat_messages;
create trigger trg_chat_rate_limit
  before insert on chat_messages
  for each row execute function enforce_chat_rate_limit();

-- Same idea for DMs, keyed on sender.
create or replace function enforce_dm_rate_limit()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  last_msg_time timestamptz;
begin
  select max(created_at) into last_msg_time from dm_messages where sender = new.sender;
  if last_msg_time is not null and (now() - last_msg_time) < interval '1 second' then
    raise exception 'Sending too fast — please slow down.';
  end if;
  return new;
end;
$$;

drop trigger if exists trg_dm_rate_limit on dm_messages;
create trigger trg_dm_rate_limit
  before insert on dm_messages
  for each row execute function enforce_dm_rate_limit();

-- No more than 5 new accounts created site-wide in any 60-second window —
-- catches the "spin up a bunch of accounts fast" bot pattern the Live
-- Stats bot-burst heuristic already flags, and actually blocks it instead
-- of just reporting it after the fact.
create or replace function enforce_signup_burst_limit()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  recent_count int;
begin
  select count(*) into recent_count from users where created_at > now() - interval '60 seconds';
  if recent_count >= 5 then
    raise exception 'Too many accounts are being created right now — please try again in a minute.';
  end if;
  return new;
end;
$$;

drop trigger if exists trg_signup_burst_limit on users;
create trigger trg_signup_burst_limit
  before insert on users
  for each row execute function enforce_signup_burst_limit();

-- ═══════════════════════════════════════════════════════════════
--  NOTIFICATIONS: DMs, friend requests/accepts, submission reviews
--  from_user is who/what TRIGGERED the notification (null for admin/system
--  events like a submission review). The insert policy below only lets a
--  session write a row for username = itself unless it's creating one on
--  behalf of another real, owned alias (from_user) or is the site admin —
--  so nobody can spam fake notifications as someone else.
-- ═══════════════════════════════════════════════════════════════
create table if not exists notifications (
  id bigint generated always as identity primary key,
  username text not null,
  type text not null,
  title text not null,
  body text,
  link_page text,
  link_arg text,
  from_user text,
  read boolean not null default false,
  created_at timestamptz default now()
);
alter table notifications enable row level security;
drop policy if exists "Owner reads own notifications" on notifications;
drop policy if exists "Owner updates own notifications" on notifications;
drop policy if exists "Sender or admin inserts notifications" on notifications;
create policy "Owner reads own notifications" on notifications for select to authenticated using (owns_alias(username));
create policy "Owner updates own notifications" on notifications for update to authenticated using (owns_alias(username)) with check (owns_alias(username));
create policy "Sender or admin inserts notifications" on notifications for insert to authenticated with check (owns_alias(coalesce(from_user, username)) or is_site_admin());

-- So a signed-in browser sees new notifications the instant they're inserted.
do $$
begin
  alter publication supabase_realtime add table notifications;
exception when duplicate_object then
  null;
end $$;

-- ═══════════════════════════════════════════════════════════════
--  SUBMISSIONS: pending song submissions awaiting admin review.
--  Anyone logged into their own alias can submit (insert) as themselves.
--  Only the submitter or the site admin can read a given row — the admin
--  needs to see the whole queue, a regular visitor only ever their own.
--  Only the admin can delete a row, which is what approving/rejecting does
--  (approving also copies the song into the songs table first).
-- ═══════════════════════════════════════════════════════════════
create table if not exists submissions (
  id bigint generated always as identity primary key,
  title text, artist text, year text, mood text,
  about text, meaning text, lyrics text, fun_fact text, spotify text,
  genre text[],
  submitted_by text not null,
  created_at timestamptz default now()
);
alter table submissions enable row level security;
drop policy if exists "Owner or admin reads submissions" on submissions;
drop policy if exists "Owner creates submissions" on submissions;
drop policy if exists "Admin deletes submissions" on submissions;
create policy "Owner or admin reads submissions" on submissions for select to authenticated using (owns_alias(submitted_by) or is_site_admin());
create policy "Owner creates submissions" on submissions for insert to authenticated with check (owns_alias(submitted_by));
create policy "Admin deletes submissions" on submissions for delete to authenticated using (is_site_admin());

-- So the admin panel sees new submissions the instant they land, no refresh needed.
do $$
begin
  alter publication supabase_realtime add table submissions;
exception when duplicate_object then
  null;
end $$;

-- ═══════════════════════════════════════════════════════════════
--  REPORTS: user-filed reports on other users / chat messages, for
--  admin moderation review. Anyone logged in can file a report as
--  themselves (reporter). Reads are admin-only — deliberately NOT visible
--  to the reporter or the reported user, so nobody can see who reported
--  them or retaliate. Only admin can update (mark reviewed/dismissed)
--  or delete.
-- ═══════════════════════════════════════════════════════════════
create table if not exists reports (
  id bigint generated always as identity primary key,
  reporter text not null,
  reported_user text,
  category text not null,
  details text,
  context_type text,
  context_ref text,
  status text not null default 'pending',
  created_at timestamptz default now()
);
alter table reports enable row level security;
drop policy if exists "Admin reads reports" on reports;
drop policy if exists "Owner files reports" on reports;
drop policy if exists "Admin updates reports" on reports;
drop policy if exists "Admin deletes reports" on reports;
create policy "Admin reads reports" on reports for select to authenticated using (is_site_admin());
create policy "Owner files reports" on reports for insert to authenticated with check (owns_alias(reporter));
create policy "Admin updates reports" on reports for update to authenticated using (is_site_admin()) with check (is_site_admin());
create policy "Admin deletes reports" on reports for delete to authenticated using (is_site_admin());

-- So the admin panel's Reports queue updates live as new reports come in.
do $$
begin
  alter publication supabase_realtime add table reports;
exception when duplicate_object then
  null;
end $$;

`;

  const confirmEl = document.getElementById('sql-copy-confirm');
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(sql).then(() => {
      confirmEl.style.color = 'var(--green)';
      confirmEl.textContent = '✓ Copied to clipboard! Paste into Supabase → SQL Editor → Run.';
    }).catch(() => {
      fallbackCopy(sql, confirmEl);
    });
  } else {
    fallbackCopy(sql, confirmEl);
  }
}

