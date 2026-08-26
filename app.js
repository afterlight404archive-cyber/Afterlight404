// ═══════════════════════════════════════════════════════════════
//  PREMIUM TOAST NOTIFICATIONS (replaces window.alert popups)
//  Glassmorphic, dark-luxury toast stack. Everything moves via
//  `transform`/`opacity`/`filter` only (composed from CSS custom
//  properties set here in JS) so stacking, entrance/exit, hover-lift
//  and swipe-to-dismiss stay GPU-composited and never touch layout.
// ═══════════════════════════════════════════════════════════════

const TOAST_MAX_VISIBLE = 4;
const TOAST_GAP = 12; // px between stacked toasts
const TOAST_TYPES = ['success', 'error', 'info', 'warning', 'loading'];
const TOAST_DEFAULT_TITLES = {
  success: 'Success', error: 'Something went wrong', info: 'Note',
  warning: 'Heads up', loading: 'Working on it'
};
// Small, quiet line-icons — deliberately not filled/bright, to match a
// calm rather than alarmed tone even for errors and warnings.
const TOAST_ICONS = {
  success: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12.5l5 5L20 6"></path></svg>',
  error: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9.25"></circle><path d="M12 7.4v6"></path><circle cx="12" cy="16.3" r="0.9" fill="currentColor" stroke="none"></circle></svg>',
  warning: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.6 3.6a1.6 1.6 0 0 1 2.8 0l8.2 14.6a1.6 1.6 0 0 1-1.4 2.4H3.8a1.6 1.6 0 0 1-1.4-2.4z"></path><path d="M12 9.4v4.4"></path><circle cx="12" cy="16.6" r="0.9" fill="currentColor" stroke="none"></circle></svg>',
  info: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9.25"></circle><circle cx="12" cy="7.6" r="0.9" fill="currentColor" stroke="none"></circle><path d="M12 11v5.5"></path></svg>',
  loading: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M12 3a9 9 0 1 1-6.36 2.64"></path></svg>'
};

let toastStackEl = null;
let activeToasts = []; // ordered newest-first

// message: string. opts: { type, title, duration }
//   type: 'success' (default) | 'error' | 'info' | 'warning' | 'loading'
//   duration: ms before auto-dismiss. Defaults to 3800, or 0 (persists
//     until manually dismissed/updated) for type 'loading'.
// Returns { dismiss(), update(message, opts) } so long-running actions can
// show a loading toast and morph it into a success/error toast when done:
//   const t = showToast('Uploading…', { type: 'loading' });
//   ...
//   t.update('Uploaded!', { type: 'success' });
function showToast(message, opts) {
  opts = opts || {};
  const type = TOAST_TYPES.includes(opts.type) ? opts.type : 'success';
  const duration = opts.duration != null ? opts.duration : (type === 'loading' ? 0 : 3800);
  const title = opts.title || TOAST_DEFAULT_TITLES[type];

  toastStackEl = toastStackEl || document.getElementById('toast-stack');
  if (!toastStackEl) { console.log(message); return null; }

  // Cap visible toasts at 4 — drop the oldest instantly to make room for
  // the new one rather than letting the stack grow unbounded.
  while (activeToasts.length >= TOAST_MAX_VISIBLE) {
    dismissToastRecord(activeToasts[activeToasts.length - 1], true);
  }

  const el = document.createElement('div');
  el.className = 'toast toast-' + type;
  el.setAttribute('role', type === 'error' ? 'alert' : 'status');
  el.innerHTML = `
    <div class="toast-icon-wrap">${TOAST_ICONS[type]}</div>
    <div class="toast-body">
      <div class="toast-title"></div>
      <div class="toast-msg"></div>
    </div>
    <button type="button" class="toast-close" aria-label="Dismiss notification">
      <svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"><line x1="4" y1="4" x2="16" y2="16"></line><line x1="16" y1="4" x2="4" y2="16"></line></svg>
    </button>
    ${duration > 0 ? '<div class="toast-progress-track"><div class="toast-progress-bar running"></div></div>' : ''}
  `;
  el.querySelector('.toast-title').textContent = title;
  el.querySelector('.toast-msg').textContent = message;

  const record = {
    el, type, duration, remaining: duration, startedAt: 0, timer: null,
    progressBar: el.querySelector('.toast-progress-bar'), removed: false
  };

  el.querySelector('.toast-close').addEventListener('click', () => dismissToastRecord(record));
  if (duration > 0) {
    el.addEventListener('mouseenter', () => pauseToastTimer(record));
    el.addEventListener('mouseleave', () => resumeToastTimer(record));
  }
  attachToastSwipe(el, record);

  toastStackEl.appendChild(el);
  activeToasts.unshift(record);
  repositionToasts();

  // Double rAF so the browser commits the initial (invisible, offset)
  // state in one frame before we flip to toast-show in the next — without
  // this the entrance transition can get collapsed/skipped entirely.
  requestAnimationFrame(() => requestAnimationFrame(() => {
    if (record.removed) return;
    el.classList.add('toast-show');
    if (duration > 0) startToastTimer(record);
  }));

  return {
    dismiss: () => dismissToastRecord(record),
    update: (newMessage, newOpts) => updateToastRecord(record, newMessage, newOpts)
  };
}

function startToastTimer(record) {
  record.startedAt = performance.now();
  if (record.progressBar) {
    record.progressBar.classList.remove('paused');
    record.progressBar.classList.add('running');
    record.progressBar.style.transitionDuration = record.remaining + 'ms';
    record.progressBar.style.transform = 'scaleX(1)';
    requestAnimationFrame(() => requestAnimationFrame(() => {
      if (record.removed) return;
      record.progressBar.style.transform = 'scaleX(0)';
    }));
  }
  record.timer = setTimeout(() => dismissToastRecord(record), record.remaining);
}

function pauseToastTimer(record) {
  if (record.removed || !record.timer) return;
  clearTimeout(record.timer);
  record.timer = null;
  record.remaining = Math.max(0, record.remaining - (performance.now() - record.startedAt));
  if (record.progressBar) {
    const frozen = getComputedStyle(record.progressBar).transform;
    record.progressBar.classList.remove('running');
    record.progressBar.classList.add('paused');
    record.progressBar.style.transform = frozen === 'none' ? 'scaleX(1)' : frozen;
  }
}

function resumeToastTimer(record) {
  if (record.removed || record.timer) return;
  if (record.remaining <= 40) { dismissToastRecord(record); return; }
  startToastTimer(record);
}

// skipAnimation is used when a 5th toast bumps the oldest off the stack —
// that one just needs to be gone, not gracefully animated out.
function dismissToastRecord(record, skipAnimation) {
  if (record.removed) return;
  record.removed = true;
  clearTimeout(record.timer);
  activeToasts = activeToasts.filter(r => r !== record);
  if (skipAnimation) { record.el.remove(); repositionToasts(); return; }
  record.el.classList.remove('toast-show', 'toast-dragging');
  record.el.classList.add('toast-hide');
  repositionToasts();
  setTimeout(() => record.el.remove(), 340);
}

// Morphs an existing toast in place (icon, title, message, type, timer) —
// e.g. turning a persistent "loading" toast into a "success" one.
function updateToastRecord(record, newMessage, newOpts) {
  if (record.removed) return;
  newOpts = newOpts || {};
  const type = TOAST_TYPES.includes(newOpts.type) ? newOpts.type : record.type;
  record.type = type;
  record.el.className = 'toast toast-' + type + ' toast-show';
  record.el.setAttribute('role', type === 'error' ? 'alert' : 'status');
  const iconWrap = record.el.querySelector('.toast-icon-wrap');
  if (iconWrap) iconWrap.outerHTML = `<div class="toast-icon-wrap">${TOAST_ICONS[type]}</div>`;
  record.el.querySelector('.toast-title').textContent = newOpts.title || TOAST_DEFAULT_TITLES[type];
  if (newMessage != null) record.el.querySelector('.toast-msg').textContent = newMessage;

  clearTimeout(record.timer);
  record.timer = null;
  const duration = newOpts.duration != null ? newOpts.duration : (type === 'loading' ? 0 : 3800);
  record.duration = duration;
  record.remaining = duration;

  let track = record.el.querySelector('.toast-progress-track');
  if (duration > 0) {
    if (!track) {
      track = document.createElement('div');
      track.className = 'toast-progress-track';
      track.innerHTML = '<div class="toast-progress-bar running"></div>';
      record.el.appendChild(track);
    }
    record.progressBar = track.querySelector('.toast-progress-bar');
    startToastTimer(record);
  } else if (track) {
    track.remove();
    record.progressBar = null;
  }
}

// Repositions every active toast via a per-toast `--stack-y` custom
// property (consumed by the `transform` in CSS) so the whole stack glides
// smoothly whenever one is added or removed — no layout, no jumping.
// On desktop the stack grows downward from the top; on mobile (bottom
// anchored, thumb-friendly) it grows upward instead.
function repositionToasts() {
  const stacksUpward = window.matchMedia('(max-width: 640px)').matches;
  let cumulative = 0;
  activeToasts.forEach(record => {
    const h = record.el.offsetHeight || 0;
    record.el.style.setProperty('--stack-y', (stacksUpward ? -cumulative : cumulative) + 'px');
    cumulative += h + TOAST_GAP;
  });
}

// Touch/pointer swipe-to-dismiss: the toast tracks the finger 1:1 while
// dragging, fades proportionally to drag distance, springs back if
// released short of the threshold, and flies out smoothly if released
// past it.
function attachToastSwipe(el, record) {
  const THRESHOLD = 90;
  let dragging = false, pointerId = null, startX = 0, dx = 0;

  el.addEventListener('pointerdown', e => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    // Don't hijack taps on the close (X) button — setPointerCapture below
    // retargets the browser's follow-up "click" to `el` instead of the
    // button, so the button's own click handler never fires and tapping
    // "cancel" on a toast silently does nothing. Let the button handle its
    // own click/tap normally instead of starting a swipe-drag.
    if (e.target.closest('.toast-close')) return;
    dragging = true; pointerId = e.pointerId; startX = e.clientX; dx = 0;
    el.classList.add('toast-dragging');
    pauseToastTimer(record);
    try { el.setPointerCapture(pointerId); } catch (err) {}
  });
  el.addEventListener('pointermove', e => {
    if (!dragging || e.pointerId !== pointerId) return;
    dx = e.clientX - startX;
    el.style.setProperty('--drag-x', dx + 'px');
    el.style.setProperty('--drag-fade', String(Math.max(0, 1 - Math.abs(dx) / 260)));
  });
  const endDrag = e => {
    if (!dragging || (pointerId != null && e.pointerId !== pointerId)) return;
    dragging = false;
    el.classList.remove('toast-dragging');
    if (Math.abs(dx) > THRESHOLD) {
      el.style.setProperty('--drag-x', (dx > 0 ? 420 : -420) + 'px');
      el.style.setProperty('--drag-fade', '0');
      dismissToastRecord(record);
    } else {
      el.style.setProperty('--drag-x', '0px');
      el.style.setProperty('--drag-fade', '1');
      resumeToastTimer(record);
    }
  };
  el.addEventListener('pointerup', endDrag);
  el.addEventListener('pointercancel', endDrag);
}

// Keep the stack correctly positioned across a desktop↔mobile breakpoint
// crossing (e.g. rotating a tablet, or resizing a browser window).
window.addEventListener('resize', () => { if (activeToasts.length) repositionToasts(); });

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
function notifPrefEnabled() { return alGet('al-notifications-enabled') === '1'; }
function setNotifPref(v) { alSet('al-notifications-enabled', v ? '1' : '0'); }

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
  if (alGet('al-notif-prompted') === '1') return;
  if (Notification.permission !== 'default') { alSet('al-notif-prompted', '1'); return; }
  const banner = document.getElementById('notif-optin-banner');
  if (banner) banner.style.display = 'flex';
}
function hideNotifOptInBanner() {
  const banner = document.getElementById('notif-optin-banner');
  if (banner) banner.style.display = 'none';
}
async function handleNotifOptIn(enable) {
  alSet('al-notif-prompted', '1');
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

// Both the notification bell dropdown and the profile menu previously relied
// on pure CSS (`right:0` / `left:0` relative to their own button) to
// position themselves. That only works if the button happens to sit flush
// against the actual screen edge — on mobile the bell isn't the rightmost
// header icon (the theme toggle + profile avatar sit to its right), so the
// dropdown's left edge routinely rendered off-screen. This computes the
// position from the anchor button's real on-screen position every time the
// dropdown opens, then clamps it to stay fully inside the viewport.
function positionFloatingDropdown(dropdownEl, anchorEl) {
  if (!dropdownEl || !anchorEl) return;
  const container = dropdownEl.offsetParent || document.body;
  const containerRect = container.getBoundingClientRect();
  const anchorRect = anchorEl.getBoundingClientRect();
  const margin = 12;
  const width = dropdownEl.offsetWidth || 280;

  // Default: right-align the dropdown to the anchor's right edge (matches
  // the original right:0 intent), then clamp to the real viewport edges.
  let desiredLeft = anchorRect.right - width;
  if (desiredLeft < margin) desiredLeft = margin;
  if (desiredLeft + width > window.innerWidth - margin) desiredLeft = window.innerWidth - width - margin;

  dropdownEl.style.left = (desiredLeft - containerRect.left) + 'px';
  dropdownEl.style.right = 'auto';
  dropdownEl.style.top = (anchorRect.bottom - containerRect.top + 8) + 'px';
}

// Re-clamp on resize/orientation change (e.g. exiting a full-screen webview
// like the one in the bug report screenshot) while a dropdown is open,
// instead of leaving it positioned for the old viewport size.
window.addEventListener('resize', () => {
  const dd = document.getElementById('notif-dropdown');
  if (dd && dd.classList.contains('open')) positionFloatingDropdown(dd, document.getElementById('notif-bell-wrap'));
  const pm = document.getElementById('profile-menu');
  if (pm && pm.classList.contains('open')) positionFloatingDropdown(pm, pm.closest('.profile-dropdown'));
});

function toggleNotifDropdown(e) {
  if (e) e.stopPropagation();
  const dd = document.getElementById('notif-dropdown');
  if (!dd) return;
  const menu = document.getElementById('profile-menu');
  if (menu) menu.classList.remove('open');
  const opening = !dd.classList.contains('open');
  dd.classList.toggle('open');
  if (opening) positionFloatingDropdown(dd, document.getElementById('notif-bell-wrap'));
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
  const savedSongs = alGet('al-songs');
  songs = savedSongs ? JSON.parse(savedSongs) : JSON.parse(JSON.stringify(DEFAULT_SONGS));
  if (!savedSongs) saveSongs();

  submissions = JSON.parse(alGet('al-submissions') || '[]');
  reports = JSON.parse(alGet('al-reports') || '[]');

  const savedUser = alGet('al-user');
  if (savedUser) currentUser = JSON.parse(savedUser);

  const savedAdmin = alGet('al-admin');
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
  setDesktopNavActive(sectionId);
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
  const hubPages = ['social', 'chats-list', 'friends', 'dm', 'chat', 'topic-chat'];
  document.body.classList.toggle('on-music-hub', hubPages.includes(page));
  if (typeof updateMusicHubNav === 'function') updateMusicHubNav(page);
  if (page !== 'topic-chat') currentTopicRoom = null;
  if (page !== 'dm' && page !== 'friends') dmActiveFriend = null;

  // Close realtime channels for pages we're leaving. Without this, every
  // room you ever visited kept an open websocket subscription for the whole
  // session — memory climbed, and on a long session Supabase starts
  // refusing new channels once the per-client limit is hit, which looked
  // like "chat randomly stops updating after a while".
  if (page !== 'chat' && page !== 'topic-chat' && typeof teardownRoomRealtime === 'function') {
    teardownRoomRealtime();
  }
  if (page !== 'dm' && typeof teardownDmRealtime === 'function') {
    teardownDmRealtime();
  }
  if (page === 'chat') initChat();
  if (page === 'admin') initAdmin();
  if (page === 'social') initSocialHub();
  if (page === 'chats-list') renderChatsListPage();
  if (page === 'friends') initFriendsPage();
  if (page === 'profile') renderProfilePage();
  if (page === 'home') setBottomNavActive('home');
  else if (page === 'submit') setBottomNavActive('submit');
  else if (page === 'chat' || page === 'topic-chat' || page === 'social' || page === 'chats-list' || page === 'friends' || page === 'dm' || page === 'profile' || page === 'edit-profile') setBottomNavActive('social');

  // Keep the top nav underline (Archive/About/Submit a Song/Social) in sync with
  // whatever page we just switched to. goToHomeSection() overrides this right
  // after with the specific section (archive vs about) since both live under
  // the 'home' page. Pages with no matching top-nav link (chat, profile, admin,
  // etc.) fall under "Social" since that's the flow they're reached from.
  if (page === 'home') setDesktopNavActive('home');
  else if (page === 'submit') setDesktopNavActive('submit');
  else if (page === 'social' || page === 'chat' || page === 'topic-chat' || page === 'chats-list' || page === 'friends' || page === 'dm' || page === 'profile' || page === 'edit-profile') setDesktopNavActive('social');
}

function updateMusicHubNav(page) {
  const items = document.querySelectorAll('.mhs-item');
  if (!items.length) return;
  let key = page;
  if (page === 'chat' || page === 'topic-chat') key = 'chats-list';
  if (page === 'dm') key = 'friends-messages';
  if (page === 'friends' && typeof friendsActiveTab !== 'undefined') {
    key = friendsActiveTab === 'messages' ? 'friends-messages' : 'friends';
  }
  items.forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-hub') === key);
  });
}

function setBottomNavActive(key) {
  document.querySelectorAll('.bottom-nav-item').forEach(b => b.classList.remove('active'));
  const btn = document.querySelector('.bottom-nav-item[data-bn="' + key + '"]');
  if (btn) btn.classList.add('active');
}

function setDesktopNavActive(key) {
  document.querySelectorAll('#desktop-nav a').forEach(a => a.classList.remove('active'));
  const link = document.querySelector('#desktop-nav a[data-nav="' + key + '"]');
  if (link) link.classList.add('active');
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
  alSet('al-theme', mode);
}

const savedTheme = alGet('al-theme') || 'system';
applyTheme(savedTheme);

themeCheckbox.addEventListener('change', () => {
  applyTheme(themeCheckbox.checked ? 'light' : 'dark');
});
sysBtn.addEventListener('click', () => { applyTheme('system'); });
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
  if ((alGet('al-theme') || 'system') === 'system') applyTheme('system');
});

// Header moon-icon button just drives the (visually hidden) legacy theme
// checkbox above, so the existing applyTheme()/localStorage logic doesn't
// need to change at all.
const btnHeaderTheme = document.getElementById('btn-header-theme');
if (btnHeaderTheme) {
  btnHeaderTheme.addEventListener('click', () => { themeCheckbox.click(); });
}

// ═══════════════════════════════════════════════════════════════
//  APP ICON THEME (favicon + PWA manifest icon)
// ═══════════════════════════════════════════════════════════════
// The in-app header logo (.logo-mark) already re-colors itself via CSS
// variables whenever the site theme flips (see --logo-ring/--logo-dot in
// styles.css), so it always tracks Light/Dark/System automatically.
// This section is about the browser-tab favicon and the icon used when
// someone "Add to Home Screen"s the site, which are plain image files and
// can't repaint themselves via CSS — they have to be swapped out for a
// different file. 'auto' (default) makes them follow the site theme too;
// Light/Dark lets a user pin the icon regardless of site theme.

const ICON_ASSETS = {
  dark: {
    manifest: 'manifest.json',
    favicon512: 'icons/icon-512.png',
    favicon192: 'icons/icon-192.png',
    favicon32: 'icons/icon-32.png',
    favicon16: 'icons/icon-16.png',
    favicon180: 'icons/icon-180.png',
  },
  light: {
    manifest: 'manifest-light.json',
    favicon512: 'icons/light/icon-512.png',
    favicon192: 'icons/light/icon-192.png',
    favicon32: 'icons/light/icon-32.png',
    favicon16: 'icons/light/icon-16.png',
    favicon180: 'icons/light/icon-180.png',
  },
};

function resolveIconTheme(pref) {
  if (pref === 'light' || pref === 'dark') return pref;
  // 'auto': follow whatever the site theme currently resolved to.
  return htmlEl.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
}

function applyIconTheme() {
  const pref = alGet('al-icon-theme') || 'auto';
  const assets = ICON_ASSETS[resolveIconTheme(pref)];

  const manifestLink = document.getElementById('app-manifest-link');
  if (manifestLink) manifestLink.setAttribute('href', assets.manifest);

  const map = {
    'app-favicon-512': assets.favicon512,
    'app-favicon-192': assets.favicon192,
    'app-favicon-32': assets.favicon32,
    'app-favicon-16': assets.favicon16,
    'app-favicon-180': assets.favicon180,
  };
  Object.keys(map).forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.setAttribute('href', map[id]);
  });
}

function setIconTheme(mode) {
  if (mode === 'auto') alRemove('al-icon-theme');
  else alSet('al-icon-theme', mode);
  applyIconTheme();
  updateIconThemeUI();
}

function updateIconThemeUI() {
  const mode = alGet('al-icon-theme') || 'auto';
  const order = ['auto', 'light', 'dark'];
  order.forEach((m) => {
    const btn = document.getElementById('icon-mode-' + m);
    if (btn) btn.classList.toggle('device-mode-active', m === mode);
  });
  const glider = document.getElementById('icon-theme-toggle-glider');
  if (glider) glider.style.transform = `translateX(${order.indexOf(mode) * 38}px)`;
}

// Keep the favicon/manifest in sync whenever the site theme changes (covers
// the header sun/moon toggle and the OS-level prefers-color-scheme switch,
// both of which already call applyTheme() above).
const _applyThemeOrig = applyTheme;
applyTheme = function (mode) {
  _applyThemeOrig(mode);
  applyIconTheme();
};

applyIconTheme();
updateIconThemeUI();

// ═══════════════════════════════════════════════════════════════
//  HEADER VOLUME PILL (mirrors the Analog HQ background-music toggle)
// ═══════════════════════════════════════════════════════════════
const volumePill = document.getElementById('volume-pill');
function updateVolumePillLabel(playing) {
  if (!volumePill) return;
  volumePill.classList.toggle('is-muted', !playing);
  volumePill.setAttribute('aria-label', playing ? 'Mute background music' : 'Unmute background music');
  volumePill.title = playing ? 'Mute background music' : 'Unmute background music';
}
if (volumePill) {
  volumePill.addEventListener('click', () => {
    if (window.AfterlightBGM) window.AfterlightBGM.toggle();
  });
}
document.addEventListener('afterlight-bgm-trackchange', (e) => {
  updateVolumePillLabel(!!(e.detail && e.detail.playing));
});
if (window.AfterlightBGM) updateVolumePillLabel(window.AfterlightBGM.isPlaying());

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
    alSet('al-paypal-id', val);
    document.getElementById('paypal-saved').style.display = 'block';
    setTimeout(() => { document.getElementById('paypal-saved').style.display = 'none'; }, 2000);
  }
});

const savedPaypal = alGet('al-paypal-id') || '';
if (savedPaypal) document.getElementById('paypal-id-input').value = savedPaypal;

document.getElementById('paypal-go-btn').addEventListener('click', () => {
  const id = alGet('al-paypal-id') || '';
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
  let users = JSON.parse(alGet('al-users') || '[]');
  const idx = users.findIndex(u => u.name === currentUser.name);
  if (idx > -1) {
    users[idx].totalSeconds = (users[idx].totalSeconds || 0) + elapsedSec;
    alSet('al-users', JSON.stringify(users));
  }
}

setInterval(trackUsage, 30000);
window.addEventListener('beforeunload', trackUsage);
document.addEventListener('visibilitychange', () => {
  if (document.hidden) trackUsage();
  else sessionStart = Date.now();
});

// ═══════════════════════════════════════════════════════════════
//  BACKGROUND-MUSIC PLAYER CARD (HERO)
//  Wired to the real background-music engine (bgmusic.js) rather
//  than a fake simulated progress bar. Play/Pause here IS the site's
//  background music toggle; Prev/Next switch between BACKGROUND
//  MUSIC TRACKS (e.g. "Ambient Piano", "Retro Arcade") — not archive
//  song titles. The card's title shows the current track's name. All
//  visual state (play icon, progress sweep) simply mirrors
//  window.AfterlightBGM, kept in sync via the
//  'afterlight-bgm-trackchange' event it fires. One card, same
//  markup, on every breakpoint — no separate mobile widget to
//  maintain.
// ═══════════════════════════════════════════════════════════════

function toggleVinyl() {
  if (window.AfterlightBGM) window.AfterlightBGM.toggle();
}

function vinylNext() {
  if (window.AfterlightBGM) window.AfterlightBGM.next();
}

function vinylPrev() {
  if (window.AfterlightBGM) window.AfterlightBGM.prev();
}

function syncVinylToBGM() {
  if (!window.AfterlightBGM) return;
  const playBtn = document.getElementById('vinyl-play-btn');
  const waveform = document.getElementById('hero-waveform');
  const trackBar = document.querySelector('.hero-track-bar');
  const card = document.getElementById('player-card');
  const title = document.getElementById('player-track-title');
  const progressTrack = document.getElementById('player-progress-track');
  const liveTime = document.getElementById('player-time-live');

  const playing = window.AfterlightBGM.isPlaying();
  const trackName = window.AfterlightBGM.getCurrentTrackName();

  if (playBtn) {
    playBtn.classList.toggle('is-playing', playing);
    playBtn.setAttribute('aria-label', playing ? 'Pause background music' : 'Play background music');
    playBtn.title = playing ? 'Pause background music' : 'Play background music';
  }
  if (waveform) waveform.querySelectorAll('span').forEach(s => s.style.animationPlayState = playing ? 'running' : 'paused');
  if (trackBar) trackBar.classList.toggle('playing', playing);
  if (card) card.classList.toggle('playing', playing);
  if (title) title.textContent = trackName || 'Background music';
  if (progressTrack) progressTrack.classList.toggle('playing', playing);
  if (liveTime) liveTime.textContent = playing ? '●' : '';
}

document.addEventListener('afterlight-bgm-trackchange', syncVinylToBGM);
document.addEventListener('DOMContentLoaded', syncVinylToBGM);

// ═══════════════════════════════════════════════════════════════
