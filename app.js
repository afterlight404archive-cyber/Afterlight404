// ═══════════════════════════════════════════════════════════════
//  FLOATING TOAST NOTIFICATIONS (replaces window.alert popups)
// ═══════════════════════════════════════════════════════════════
function showToast(message, opts) {
  opts = opts || {};
  const type = opts.type || 'success';
  const duration = opts.duration || 3800;
  const stack = document.getElementById('toast-stack');
  if (!stack) { console.log(message); return; }

  const toast = document.createElement('div');
  toast.className = 'toast' + (type === 'error' ? ' toast-error' : '');
  toast.innerHTML = `
    <div class="toast-icon">${type === 'error' ? '!' : '✓'}</div>
    <div class="toast-body"><div class="toast-msg"></div></div>
    <button class="toast-close" aria-label="Dismiss">×</button>
  `;
  toast.querySelector('.toast-msg').textContent = message;

  let hideTimer;
  const remove = () => {
    clearTimeout(hideTimer);
    toast.classList.remove('toast-show');
    toast.classList.add('toast-hide');
    setTimeout(() => toast.remove(), 260);
  };
  toast.querySelector('.toast-close').onclick = remove;

  stack.appendChild(toast);
  requestAnimationFrame(() => requestAnimationFrame(() => toast.classList.add('toast-show')));
  hideTimer = setTimeout(remove, duration);
  return toast;
}

// ═══════════════════════════════════════════════════════════════
//  STATE
// ═══════════════════════════════════════════════════════════════

let songs = [];
let submissions = [];
let reports = [];
let currentUser = null;
let currentAdmin = null;
// Holds the in-progress signup while the person is verifying their email —
// the account itself isn't written to al-users until the code checks out.
let pendingSignup = null;

// ═══════════════════════════════════════════════════════════════
//  ANTI-SPAM: send cooldowns + signup throttling
//  Client-side only — makes casual bots/spam-clicking harder, but is not
//  a substitute for server-side enforcement (Supabase RLS). See the
//  companion SQL file for the DB-level rules that actually can't be bypassed.
// ═══════════════════════════════════════════════════════════════
const CHAT_SEND_COOLDOWN_MS = 1200;   // min gap between chat/DM messages
const SIGNUP_COOLDOWN_MS = 4000;      // min gap between signup submissions
const VERIFY_ATTEMPT_LIMIT = 6;       // max wrong-code guesses before lockout
const VERIFY_LOCKOUT_MS = 60000;

let lastMessageSentAt = 0;
let lastSignupAttemptAt = 0;
let verifyAttemptCount = 0;
let verifyLockedUntil = 0;

// Call at the top of any send-message function. Returns false (and toasts)
// if the user is sending too fast.
function canSendMessageNow() {
  const now = Date.now();
  if (now - lastMessageSentAt < CHAT_SEND_COOLDOWN_MS) {
    showToast('Sending a little fast — give it a second.', { type: 'error' });
    return false;
  }
  lastMessageSentAt = now;
  return true;
}

// Call at the top of handleUserSignup. Returns false (and toasts) if
// signups are being submitted too quickly (classic bot-burst pattern).
function canAttemptSignupNow() {
  const now = Date.now();
  if (now - lastSignupAttemptAt < SIGNUP_COOLDOWN_MS) {
    showToast('Please wait a moment before trying again.', { type: 'error' });
    return false;
  }
  lastSignupAttemptAt = now;
  return true;
}

// Call at the top of handleVerifyEmail. Locks out further guesses for a
// while after too many wrong codes, so the 6-digit code can't just be
// brute-forced client-side.
function canAttemptVerifyNow() {
  const now = Date.now();
  if (now < verifyLockedUntil) {
    const secs = Math.ceil((verifyLockedUntil - now) / 1000);
    showToast(`Too many attempts. Try again in ${secs}s.`, { type: 'error' });
    return false;
  }
  return true;
}
function registerFailedVerifyAttempt() {
  verifyAttemptCount++;
  if (verifyAttemptCount >= VERIFY_ATTEMPT_LIMIT) {
    verifyLockedUntil = Date.now() + VERIFY_LOCKOUT_MS;
    verifyAttemptCount = 0;
  }
}
function resetVerifyAttempts() {
  verifyAttemptCount = 0;
  verifyLockedUntil = 0;
}
let profileSetupSelectedAvatar = null;
let currentModalSong = null;
let currentRoom = 'general';
let sessionStart = Date.now();
let pendingAvatarSelection = undefined; // undefined = unchanged, null = no avatar, string = chosen avatar id
let dmActiveFriend = null;
let socialPollInterval = null;
let songPickerTarget = null; // username the song picker is currently sharing to
let songRecipientSongNumber = null; // song number currently queued up in the "send to a friend" bottom sheet

// ═══════════════════════════════════════════════════════════════
//  NOTIFICATIONS
//  In-app bell + (opt-in) browser Notification API. Fires for: new DMs,
//  friend requests/accepts, and submission approvals/rejections. Delivery
//  to the bell always works once Supabase is connected — the browser popup
//  on top of that only fires if the person explicitly turned it on (via the
//  one-time banner or Site Settings), matching what was promised.
// ═══════════════════════════════════════════════════════════════

const notifState = { items: [], channel: null, initedForUser: null };

// Central place any feature calls to notify someone — DRYs up the insert.
// from_user is who/what triggered it (null for admin/system events); the RLS
// policy only allows a session to write as itself, an alias it owns, or admin.
function notifyUser(username, type, title, body, linkPage, linkArg, fromUser) {
  if (!isDbConnected() || !username) return;
  try {
    sb.from('notifications').insert({
      username: username, type: type, title: title, body: body || null,
      link_page: linkPage || null, link_arg: linkArg || null, from_user: fromUser || null
    }).then(() => {}).catch(() => {});
  } catch (e) { /* best-effort — never block the action that triggered it */ }
}

function notifBrowserSupported() { return typeof Notification !== 'undefined'; }
function notifPrefEnabled() { return localStorage.getItem('al-notifications-enabled') === '1'; }
function setNotifPref(v) { localStorage.setItem('al-notifications-enabled', v ? '1' : '0'); }

// Fires the actual OS-level popup — only if the person opted in AND the
// browser permission is granted. Wrapped defensively since some browsers
// (mobile Safari, some in-app webviews) don't support this at all.
function sendBrowserNotification(title, body) {
  if (!notifBrowserSupported() || !notifPrefEnabled() || Notification.permission !== 'granted') return;
  try {
    const n = new Notification(title, { body: body || '', tag: 'afterlight-notif' });
    n.onclick = () => { window.focus(); n.close(); };
  } catch (e) { /* ignore — non-fatal */ }
}

async function requestBrowserNotifPermission() {
  if (!notifBrowserSupported()) { showToast("Your browser doesn't support notifications.", { type: 'error' }); return false; }
  if (Notification.permission === 'granted') { setNotifPref(true); return true; }
  if (Notification.permission === 'denied') {
    showToast('Notifications are blocked for this site in your browser settings.', { type: 'error' });
    setNotifPref(false);
    return false;
  }
  try {
    const perm = await Notification.requestPermission();
    setNotifPref(perm === 'granted');
    return perm === 'granted';
  } catch (e) { return false; }
}

// One-time opt-in banner, shown after login if we've never asked before and
// the browser permission is still in its default (unanswered) state.
function maybeShowNotifOptInBanner() {
  if (!notifBrowserSupported()) return;
  if (localStorage.getItem('al-notif-prompted') === '1') return;
  if (Notification.permission !== 'default') { localStorage.setItem('al-notif-prompted', '1'); return; }
  const banner = document.getElementById('notif-optin-banner');
  if (banner) banner.style.display = 'flex';
}
function hideNotifOptInBanner() {
  const banner = document.getElementById('notif-optin-banner');
  if (banner) banner.style.display = 'none';
}
async function handleNotifOptIn(enable) {
  localStorage.setItem('al-notif-prompted', '1');
  hideNotifOptInBanner();
  if (enable) {
    const ok = await requestBrowserNotifPermission();
    showToast(ok ? 'Notifications enabled! 🔔' : "Not enabled — you can turn this on later in Site Settings.");
  }
  updateNotifSettingsToggleUI();
}

// Reflects current permission/preference in the Site Settings toggle.
function updateNotifSettingsToggleUI() {
  const cb = document.getElementById('notif-settings-checkbox');
  const label = document.getElementById('notif-settings-label');
  const hint = document.getElementById('notif-settings-hint');
  if (!cb) return;
  const supported = notifBrowserSupported();
  const on = supported && notifPrefEnabled() && Notification.permission === 'granted';
  cb.checked = on;
  cb.disabled = !supported;
  if (label) { label.textContent = on ? 'On' : 'Off'; label.classList.toggle('is-on', on); }
  if (hint) {
    hint.textContent = !supported
      ? "Your browser doesn't support notifications."
      : Notification.permission === 'denied'
        ? 'Blocked by your browser. Allow notifications for this site in your browser settings, then toggle this on.'
        : '';
  }
}
async function handleNotifSettingsToggle(checked) {
  if (checked) {
    const ok = await requestBrowserNotifPermission();
    if (ok) showToast('Notifications enabled! 🔔');
  } else {
    setNotifPref(false);
    showToast('Notifications turned off.');
  }
  updateNotifSettingsToggleUI();
}

async function pullNotifications() {
  if (!currentUser || !isDbConnected()) { renderNotifDropdown(); return; }
  try {
    const { data, error } = await sb.from('notifications')
      .select('*')
      .eq('username', currentUser.name)
      .order('created_at', { ascending: false })
      .limit(30);
    if (!error && data) notifState.items = data;
  } catch (e) { console.error('pullNotifications failed:', e); }
  renderNotifDropdown();
}

function initNotificationsRealtime() {
  if (!sb || !currentUser) return;
  teardownNotificationsRealtime();
  try {
    notifState.channel = sb.channel('notifications-' + currentUser.name)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'notifications', filter: 'username=eq.' + currentUser.name }, (payload) => {
        const row = payload.new;
        notifState.items.unshift(row);
        renderNotifDropdown();
        sendBrowserNotification(row.title, row.body || '');
      })
      .subscribe();
  } catch (e) { console.error('Notifications realtime init failed:', e); }
}
function teardownNotificationsRealtime() {
  if (notifState.channel && sb) {
    try { sb.removeChannel(notifState.channel); } catch (e) { /* ignore */ }
  }
  notifState.channel = null;
}

// Called from updateAuthUI() every time auth state changes — cheap to call
// repeatedly since it only actually (re)inits when the logged-in user changes.
function syncNotificationsForCurrentUser() {
  const wrap = document.getElementById('notif-bell-wrap');
  if (!currentUser) {
    if (wrap) wrap.style.display = 'none';
    teardownNotificationsRealtime();
    notifState.items = [];
    notifState.initedForUser = null;
    hideNotifOptInBanner();
    return;
  }
  if (wrap) wrap.style.display = '';
  if (notifState.initedForUser !== currentUser.name) {
    notifState.initedForUser = currentUser.name;
    pullNotifications();
    initNotificationsRealtime();
    maybeShowNotifOptInBanner();
  }
}

const NOTIF_ICONS = { dm: '✉', friend_request: '👤', friend_accept: '✓', submission_approved: '✓', submission_rejected: '✕' };

function renderNotifDropdown() {
  const badge = document.getElementById('notif-bell-badge');
  const list = document.getElementById('notif-dropdown-list');
  const unread = notifState.items.filter(n => !n.read).length;
  if (badge) {
    if (unread > 0) { badge.textContent = unread > 9 ? '9+' : String(unread); badge.style.display = 'flex'; }
    else badge.style.display = 'none';
  }
  if (!list) return;
  if (!notifState.items.length) {
    list.innerHTML = '<p class="friends-empty">No notifications yet.</p>';
    return;
  }
  list.innerHTML = notifState.items.map(n => {
    const icon = NOTIF_ICONS[n.type] || '🔔';
    const timeStr = n.created_at ? formatDmRowTime(new Date(n.created_at).getTime()) : '';
    return `<div class="notif-item${n.read ? '' : ' unread'}" onclick="handleNotifClick(${n.id})">
      <span class="notif-item-icon">${icon}</span>
      <div class="notif-item-text">
        <div class="notif-item-title">${escapeHtml(n.title)}</div>
        ${n.body ? `<div class="notif-item-body">${escapeHtml(n.body)}</div>` : ''}
        <div class="notif-item-time">${timeStr}</div>
      </div>
    </div>`;
  }).join('');
}

async function handleNotifClick(id) {
  const n = notifState.items.find(x => x.id === id);
  if (!n) return;
  if (!n.read) {
    n.read = true;
    renderNotifDropdown();
    if (isDbConnected()) { try { await sb.from('notifications').update({ read: true }).eq('id', id); } catch (e) {} }
  }
  closeNotifDropdown();
  if (n.link_page === 'dm' && n.link_arg) { showPage('friends'); openDm(n.link_arg); }
  else if (n.link_page) { showPage(n.link_page); }
}

async function markAllNotificationsRead() {
  notifState.items.forEach(n => n.read = true);
  renderNotifDropdown();
  if (currentUser && isDbConnected()) {
    try { await sb.from('notifications').update({ read: true }).eq('username', currentUser.name).eq('read', false); } catch (e) {}
  }
}

function toggleNotifDropdown(e) {
  if (e) e.stopPropagation();
  const dd = document.getElementById('notif-dropdown');
  if (!dd) return;
  const menu = document.getElementById('profile-menu');
  if (menu) menu.classList.remove('open');
  dd.classList.toggle('open');
}
function closeNotifDropdown() {
  const dd = document.getElementById('notif-dropdown');
  if (dd) dd.classList.remove('open');
}
document.addEventListener('click', (e) => {
  const wrap = document.getElementById('notif-bell-wrap');
  if (wrap && !wrap.contains(e.target)) closeNotifDropdown();
});


// Aggregate counts (accounts, messages, growth, bot-burst heuristic). Pulls live from
// Supabase when connected (site-wide, every visitor); otherwise falls back to
// this-device-only numbers from localStorage.
function fallbackCopy(text, confirmEl) {
  try {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.cssText = 'position:fixed;top:-9999px;left:-9999px;opacity:0;';
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(ta);
    if (ok) {
      if (confirmEl) { confirmEl.style.color = 'var(--green)'; confirmEl.textContent = '✓ Copied to clipboard! Paste into Supabase → SQL Editor → Run.'; }
    } else {
      if (confirmEl) { confirmEl.style.color = 'var(--red)'; confirmEl.textContent = '✕ Auto-copy failed — select all below and copy manually.'; }
    }
  } catch(e) {
    if (confirmEl) { confirmEl.style.color = 'var(--red)'; confirmEl.textContent = '✕ Auto-copy failed — use Ctrl+A then Ctrl+C on the SQL text.'; }
  }
}

function loadData() {
  const savedSongs = localStorage.getItem('al-songs');
  songs = savedSongs ? JSON.parse(savedSongs) : JSON.parse(JSON.stringify(DEFAULT_SONGS));
  if (!savedSongs) saveSongs();

  submissions = JSON.parse(localStorage.getItem('al-submissions') || '[]');
  reports = JSON.parse(localStorage.getItem('al-reports') || '[]');

  const savedUser = localStorage.getItem('al-user');
  if (savedUser) currentUser = JSON.parse(savedUser);

  const savedAdmin = localStorage.getItem('al-admin');
  if (savedAdmin) currentAdmin = JSON.parse(savedAdmin);

  backfillFriendCodes();
}

// Every account gets a unique #000-000 style code the first time we see it
// without one (new signups get theirs immediately at signup instead).
//  PAGE NAVIGATION
// ═══════════════════════════════════════════════════════════════

// The header/menu "Archive" and "About" links point at sections further down the
// home page (id="archive", id="about"), but just calling showPage('home') always
// snaps scroll back to the very top — so those links looked broken. This shows the
// home page first, then scrolls to the requested section once it's visible.
function goToHomeSection(sectionId) {
  showPage('home');
  requestAnimationFrame(() => {
    const el = document.getElementById(sectionId);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
}

function showPage(page) {
  if ((page === 'chat' || page === 'topic-chat') && !isChatEnabled()) {
    page = 'home';
  }
  if ((page === 'friends' || page === 'dm' || page === 'profile' || page === 'edit-profile' || page === 'chats-list') && !currentUser) {
    page = 'social';
  }
  document.querySelectorAll('.page-section').forEach(s => s.classList.remove('active'));
  document.getElementById('page-' + page).classList.add('active');
  window.scrollTo(0, 0);
  closeChatDrawer();
  document.body.classList.toggle('on-chat-page', page === 'chat' || page === 'topic-chat');
  document.body.classList.toggle('on-friends-page', page === 'friends' || page === 'dm');
  if (page !== 'topic-chat') currentTopicRoom = null;
  if (page !== 'dm' && page !== 'friends') dmActiveFriend = null;
  if (page === 'chat') initChat();
  if (page === 'admin') initAdmin();
  if (page === 'social') initSocialHub();
  if (page === 'chats-list') renderChatsListPage();
  if (page === 'friends') initFriendsPage();
  if (page === 'profile') renderProfilePage();
  if (page === 'home') setBottomNavActive('home');
  else if (page === 'submit') setBottomNavActive('submit');
  else if (page === 'chat' || page === 'topic-chat' || page === 'social' || page === 'chats-list' || page === 'friends' || page === 'dm' || page === 'profile' || page === 'edit-profile') setBottomNavActive('account');
}

function setBottomNavActive(key) {
  document.querySelectorAll('.bottom-nav-item').forEach(b => b.classList.remove('active'));
  const btn = document.querySelector('.bottom-nav-item[data-bn="' + key + '"]');
  if (btn) btn.classList.add('active');
}

function handleBottomNavAccount() {
  if (currentUser) {
    showPage('profile');
  } else {
    showLogin();
  }
}

// ═══════════════════════════════════════════════════════════════
//  THEME TOGGLE
// ═══════════════════════════════════════════════════════════════

const themeCheckbox = document.getElementById('theme-checkbox');
const sysBtn = document.getElementById('sys-btn');
const htmlEl = document.documentElement;

function applyTheme(mode) {
  if (mode === 'light') {
    htmlEl.setAttribute('data-theme', 'light');
    themeCheckbox.checked = true;
    sysBtn.classList.remove('active-mode');
  } else if (mode === 'dark') {
    htmlEl.removeAttribute('data-theme');
    themeCheckbox.checked = false;
    sysBtn.classList.remove('active-mode');
  } else {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (!prefersDark) htmlEl.setAttribute('data-theme', 'light');
    else htmlEl.removeAttribute('data-theme');
    themeCheckbox.checked = !prefersDark;
    sysBtn.classList.add('active-mode');
  }
  localStorage.setItem('al-theme', mode);
}

const savedTheme = localStorage.getItem('al-theme') || 'system';
applyTheme(savedTheme);

themeCheckbox.addEventListener('change', () => {
  applyTheme(themeCheckbox.checked ? 'light' : 'dark');
});
sysBtn.addEventListener('click', () => { applyTheme('system'); });
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
  if ((localStorage.getItem('al-theme') || 'system') === 'system') applyTheme('system');
});

// ═══════════════════════════════════════════════════════════════
//  DONATE
// ═══════════════════════════════════════════════════════════════

const donateOverlay = document.getElementById('donate-overlay');
document.addEventListener('click', e => {
  if (e.target.closest('.open-donate-btn')) {
    donateOverlay.classList.add('open'); document.body.style.overflow = 'hidden';
  }
});
function closeDonate() { donateOverlay.classList.remove('open'); document.body.style.overflow = ''; }
document.getElementById('close-donate').addEventListener('click', closeDonate);
donateOverlay.addEventListener('click', e => { if (e.target === donateOverlay) closeDonate(); });

document.getElementById('toggle-paypal-setup').addEventListener('click', () => {
  const el = document.getElementById('paypal-setup');
  const visible = el.style.display !== 'none';
  el.style.display = visible ? 'none' : 'block';
});

document.getElementById('paypal-id-input').addEventListener('input', () => {
  const val = document.getElementById('paypal-id-input').value.trim();
  if (val) {
    localStorage.setItem('al-paypal-id', val);
    document.getElementById('paypal-saved').style.display = 'block';
    setTimeout(() => { document.getElementById('paypal-saved').style.display = 'none'; }, 2000);
  }
});

const savedPaypal = localStorage.getItem('al-paypal-id') || '';
if (savedPaypal) document.getElementById('paypal-id-input').value = savedPaypal;

document.getElementById('paypal-go-btn').addEventListener('click', () => {
  const id = localStorage.getItem('al-paypal-id') || '';
  if (!id) {
    document.getElementById('paypal-setup').style.display = 'block';
    document.getElementById('paypal-id-input').focus();
    return;
  }
  let url;
  if (id.includes('@')) {
    url = 'https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=' + encodeURIComponent(id) + '&item_name=AfterLight+404Archive+Donation&currency_code=USD';
  } else {
    const slug = id.replace(/https?:\/\/paypal\.me\//i, '').replace(/paypal\.me\//i, '');
    url = 'https://paypal.me/' + encodeURIComponent(slug);
  }
  window.open(url, '_blank', 'noopener');
});

// ═══════════════════════════════════════════════════════════════
//  INIT
// ═══════════════════════════════════════════════════════════════
//  MOBILE MENU
// ═══════════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════════
//  USAGE TIME TRACKING
// ═══════════════════════════════════════════════════════════════

function trackUsage() {
  if (!currentUser) { sessionStart = Date.now(); return; }
  const elapsedSec = Math.round((Date.now() - sessionStart) / 1000);
  sessionStart = Date.now();
  if (elapsedSec <= 0 || elapsedSec > 3600) return; // ignore stale/huge gaps (e.g. laptop sleep)
  let users = JSON.parse(localStorage.getItem('al-users') || '[]');
  const idx = users.findIndex(u => u.name === currentUser.name);
  if (idx > -1) {
    users[idx].totalSeconds = (users[idx].totalSeconds || 0) + elapsedSec;
    localStorage.setItem('al-users', JSON.stringify(users));
  }
}

setInterval(trackUsage, 30000);
window.addEventListener('beforeunload', trackUsage);
document.addEventListener('visibilitychange', () => {
  if (document.hidden) trackUsage();
  else sessionStart = Date.now();
});

// ═══════════════════════════════════════════════════════════════
//  VINYL PLAYER (HERO DECORATION)
// ═══════════════════════════════════════════════════════════════

let vinylPlaying = false;
let vinylSongIndex = 0;
let vinylTrackInterval = null;
let vinylProgress = 0;

function toggleVinyl() {
  vinylPlaying = !vinylPlaying;
  const vinyl = document.getElementById('hero-vinyl');
  const playBtn = document.getElementById('vinyl-play-btn');
  const waveform = document.getElementById('hero-waveform');
  if (!vinyl) return;
  if (vinylPlaying) {
    vinyl.classList.add('spinning');
    if (playBtn) playBtn.textContent = '⏸';
    if (waveform) { waveform.querySelectorAll('span').forEach(s => s.style.animationPlayState = 'running'); }
    updateVinylLabel();
    startVinylProgress();
  } else {
    vinyl.classList.remove('spinning');
    if (playBtn) playBtn.textContent = '▶';
    if (waveform) { waveform.querySelectorAll('span').forEach(s => s.style.animationPlayState = 'paused'); }
    clearInterval(vinylTrackInterval);
  }
}

function startVinylProgress() {
  clearInterval(vinylTrackInterval);
  const progressBar = document.getElementById('hero-track-progress');
  const needle = document.getElementById('hero-track-needle');
  vinylTrackInterval = setInterval(() => {
    vinylProgress = (vinylProgress + 0.15) % 100;
    if (progressBar) progressBar.style.width = vinylProgress + '%';
    if (needle) needle.style.left = vinylProgress + '%';
    if (vinylProgress >= 99.85) vinylNext();
  }, 100);
}

function updateVinylLabel() {
  const nowPlaying = document.getElementById('vinyl-now-playing');
  if (!nowPlaying) return;
  const s = songs[vinylSongIndex % Math.max(songs.length, 1)];
  if (s) nowPlaying.innerHTML = `<span>${escapeHtml(s.title)}</span> — ${escapeHtml(s.artist)}`;
  else nowPlaying.innerHTML = '— click play to spin —';
}

function vinylNext() {
  vinylSongIndex = (vinylSongIndex + 1) % Math.max(songs.length, 1);
  vinylProgress = 0;
  updateVinylLabel();
  if (vinylPlaying) startVinylProgress();
}

function vinylPrev() {
  vinylSongIndex = (vinylSongIndex - 1 + Math.max(songs.length, 1)) % Math.max(songs.length, 1);
  vinylProgress = 0;
  updateVinylLabel();
  if (vinylPlaying) startVinylProgress();
}

// ═══════════════════════════════════════════════════════════════
