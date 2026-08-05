//  ADMIN SECRETS — hashing helpers
//  Secrets are stored as SHA-256 hashes (never plain text) so that
//  looking at localStorage or the page source doesn't reveal them.
//  Note: this is still a client-side check, not real server-side auth —
//  see the "Admin Access Code" note in the panel for what that does and doesn't protect against.
// ═══════════════════════════════════════════════════════════════

async function hashText(text) {
  const str = String(text == null ? '' : text);
  try {
    if (window.crypto && window.crypto.subtle && window.isSecureContext !== false) {
      const buf = await window.crypto.subtle.digest('SHA-256', new TextEncoder().encode(str));
      return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
    }
  } catch (e) { /* fall through to fallback below */ }
  // Fallback (e.g. file:// pages where crypto.subtle is unavailable): a simple
  // non-cryptographic hash. Not secure, but still avoids storing plain text.
  let h1 = 0xdeadbeef, h2 = 0x41c6ce57;
  for (let i = 0; i < str.length; i++) {
    const ch = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return 'fb_' + (h1 >>> 0).toString(16).padStart(8, '0') + (h2 >>> 0).toString(16).padStart(8, '0');
}

const DEFAULT_ADMIN_CODE = 'admin404';
const DEFAULT_ADMIN_EMAIL = 'jk@afterlight.com';
const DEFAULT_ADMIN_PASS = 'admin404';

// One-time migration from the old plain-text 'al-admin-code' key, if present.
async function migrateAdminSecrets() {
  const legacyCode = localStorage.getItem('al-admin-code');
  if (legacyCode && !localStorage.getItem('al-admin-code-hash')) {
    localStorage.setItem('al-admin-code-hash', await hashText(legacyCode));
  }
  if (legacyCode) localStorage.removeItem('al-admin-code');
}

async function getAdminCodeHash() {
  return localStorage.getItem('al-admin-code-hash') || await hashText(DEFAULT_ADMIN_CODE);
}

function getAdminEmail() {
  return localStorage.getItem('al-admin-email') || DEFAULT_ADMIN_EMAIL;
}

async function getAdminPassHash() {
  return localStorage.getItem('al-admin-pass-hash') || await hashText(DEFAULT_ADMIN_PASS);
}

//  MODERATION: user reports
//  Any signed-in user can file a report on another user or on a specific
//  chat message. Reads are admin-only (see RLS) — reporters and reported
//  users never see report contents, only admin does, in the Reports tab.
// ═══════════════════════════════════════════════════════════════

function saveReports() {
  localStorage.setItem('al-reports', JSON.stringify(reports));
}

async function pullReportsFromSupabase() {
  if (!isDbConnected() || !sb) return;
  try {
    const { data, error } = await sb.from('reports').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    reports = (data || []).map(r => ({
      id: r.id, reporter: r.reporter, reportedUser: r.reported_user, category: r.category,
      details: r.details, contextType: r.context_type, contextRef: r.context_ref,
      status: r.status, createdAt: r.created_at ? new Date(r.created_at).getTime() : Date.now()
    }));
    saveReports();
  } catch (e) { console.error('Pull reports from Supabase failed:', e); }
}

let reportsChannel = null;
function initReportsRealtime() {
  if (!sb || !currentAdmin) return;
  teardownReportsRealtime();
  try {
    reportsChannel = sb.channel('reports-admin')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'reports' }, () => {
        pullReportsFromSupabase().then(() => {
          if (document.getElementById('admin-tab-reports')) renderAdminReports();
        });
      })
      .subscribe();
  } catch (e) { console.error('Reports realtime init failed:', e); }
}
function teardownReportsRealtime() {
  if (reportsChannel) { try { sb.removeChannel(reportsChannel); } catch (e) {} reportsChannel = null; }
}

// Central place any "Report" button calls. Best-effort against Supabase
// (falls back to a local-only cache, same pattern as submissions) so a
// report never gets silently dropped on the floor even if the write fails.
async function fileReport(reportedUser, category, details, contextType, contextRef) {
  if (!currentUser) return false;
  const report = {
    reporter: currentUser.name, reportedUser: reportedUser || null, category,
    details: details || '', contextType: contextType || null, contextRef: contextRef || null,
    status: 'pending', createdAt: Date.now()
  };
  if (isDbConnected() && sb) {
    try {
      await ensureAnonSession();
      const { data, error } = await sb.from('reports').insert({
        reporter: report.reporter, reported_user: report.reportedUser, category: report.category,
        details: report.details, context_type: report.contextType, context_ref: report.contextRef
      }).select().single();
      if (error) throw error;
      report.id = data.id;
    } catch (e) { console.error('File report to Supabase failed, saved locally only:', e); }
  }
  reports.push(report);
  saveReports();
  return true;
}

// Holds what the currently-open report modal is about, set by whichever
// "Report" button opened it (profile card or a chat message).
let activeReportTarget = null;

function openReportModal(reportedUser, contextType, contextRef) {
  if (!currentUser) { showToast('Log in to file a report.', { type: 'error' }); return; }
  activeReportTarget = { reportedUser: reportedUser || null, contextType: contextType || null, contextRef: contextRef || null };
  document.getElementById('report-modal-sub').textContent = reportedUser
    ? `Reporting @${reportedUser}. Reports are only visible to admins.`
    : "Tell us what's going on. Reports are only visible to admins.";
  document.getElementById('report-category').value = 'harassment';
  document.getElementById('report-details').value = '';
  document.getElementById('report-overlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeReportModal() {
  document.getElementById('report-overlay').classList.remove('open');
  document.body.style.overflow = '';
  activeReportTarget = null;
}

async function submitReportModal() {
  if (!activeReportTarget) { closeReportModal(); return; }
  const category = document.getElementById('report-category').value;
  const details = document.getElementById('report-details').value.trim();
  const { reportedUser, contextType, contextRef } = activeReportTarget;
  closeReportModal();
  await fileReport(reportedUser, category, details, contextType, contextRef);
  showToast('Report submitted. Our team will review it.');
}

// Wired to the "Report" button in the chat message action bubble.
function reportMsgFromSheet() {
  if (!activeMsgAction) return;
  const { room, id } = activeMsgAction;
  const msg = findMessage(room, id);
  closeMsgActions();
  if (!msg) return;
  const preview = (msg.text || '').slice(0, 200);
  openReportModal(msg.author, 'chat_message', preview);
}

function saveUser() {
  if (currentUser) localStorage.setItem('al-user', JSON.stringify(currentUser));
  else localStorage.removeItem('al-user');
}

function saveAdmin() {
  if (currentAdmin) localStorage.setItem('al-admin', JSON.stringify(currentAdmin));
  else localStorage.removeItem('al-admin');
}

// ═══════════════════════════════════════════════════════════════
//  AUTH — ADMIN
// ═══════════════════════════════════════════════════════════════

function isNetworkishError(e) {
  if (!e) return false;
  const msg = String(e.message || e).toLowerCase();
  return msg.includes('fetch') || msg.includes('network') || msg.includes('load failed') || msg.includes('offline') || e.status === 0;
}

function isRateLimitError(e) {
  if (!e) return false;
  const msg = String(e.message || e).toLowerCase();
  return msg.includes('rate limit') || msg.includes('too many requests') || e.status === 429;
}

async function handleAdminLogin() {
  const email = document.getElementById('al-email').value.trim();
  const pass = document.getElementById('al-pass').value;
  const err = document.getElementById('al-error');
  err.style.display = 'none';

  const [storedEmail, storedHash, enteredHash] = [getAdminEmail(), await getAdminPassHash(), await hashText(pass)];
  const matchesLocalRecord = email === storedEmail && enteredHash === storedHash;

  let supabaseAuthWarning = null;
  let usedLocalFallback = false;
  const localFallbackMsg = "Couldn't reach/confirm Supabase — logged in with a local-only session instead. Changes won't sync until the database is reachable.";

  if (isDbConnected() && sb) {
    let error;
    try {
      ({ error } = await sb.auth.signInWithPassword({ email, password: pass }));
    } catch (e) {
      error = e;
    }

    if (error && isRateLimitError(error) && matchesLocalRecord) {
      // Supabase's free-tier email sending is capped very low (as few as 2-4/hr),
      // and every signUp attempt below sends a confirmation email — so repeated
      // login attempts can trip this fast. There's nothing more we can do until
      // the limit resets, so just let the admin in locally instead of blocking.
      usedLocalFallback = true;
      supabaseAuthWarning = "Supabase's email rate limit was hit (too many account-creation attempts) — logged in with a local-only session instead. Wait ~1 hour, then reopen Site Settings > Database to finish connecting Supabase.";
    } else if (error && isNetworkishError(error) && matchesLocalRecord) {
      // Supabase couldn't actually be reached — most likely the site isn't
      // deployed/online yet, or you're offline. Rather than lock you out
      // entirely, log in with a local-only admin session so you can still get
      // in and check things; nothing will sync to Supabase until it's reachable.
      usedLocalFallback = true;
      supabaseAuthWarning = localFallbackMsg;
    } else if (error) {
      // No Supabase Auth account exists yet for this admin — this is expected
      // the very first time an admin logs in on a freshly-connected database
      // (creating the account has to happen somewhere, and there's no separate
      // "create admin" step in Setup SQL). If what was typed matches the local
      // admin email/password on file — which itself is only reachable after
      // passing the secret 5-click access code — treat this as first-time setup
      // and provision the real Supabase Auth account now, then sign in for real.
      // Only try this ONCE per browser (flag below) — retrying signUp on every
      // failed login attempt is what triggers the rate limit above.
      const alreadyAttemptedSignup = localStorage.getItem('al-admin-signup-attempted') === '1';
      if (matchesLocalRecord && !alreadyAttemptedSignup) {
        localStorage.setItem('al-admin-signup-attempted', '1');
        const { error: signUpError } = await sb.auth.signUp({ email, password: pass });
        if (!signUpError) {
          ({ error } = await sb.auth.signInWithPassword({ email, password: pass }));
          if (error && !error.message?.toLowerCase().includes('confirm')) {
            err.textContent = 'Account created, but sign-in failed: ' + error.message; err.style.display = 'block'; return;
          }
          if (error) {
            // Project has email confirmation turned on — account exists but needs
            // verifying before a session can be issued.
            err.textContent = 'Admin account created — check ' + email + '\'s inbox (or the Supabase Auth settings) to confirm it, then log in again.';
            err.style.display = 'block'; return;
          }
        } else if (signUpError.message?.toLowerCase().includes('already registered')) {
          // Account exists in Supabase but with a different password than the
          // local record — the two are out of sync, most likely because it was
          // created manually in the Supabase dashboard with a different password.
          err.textContent = 'An admin account already exists on Supabase with a different password than saved locally. Reset it from the Supabase Auth dashboard, or log in with that password.';
          err.style.display = 'block'; return;
        } else if (isRateLimitError(signUpError)) {
          usedLocalFallback = true;
          supabaseAuthWarning = "Supabase's email rate limit was hit — logged in with a local-only session instead. Wait ~1 hour before trying to connect Supabase again.";
        } else if (isNetworkishError(signUpError)) {
          usedLocalFallback = true;
          supabaseAuthWarning = localFallbackMsg;
        } else {
          err.textContent = 'Could not create admin account: ' + signUpError.message; err.style.display = 'block'; return;
        }
      } else if (matchesLocalRecord) {
        // Signup was already tried earlier in this browser — don't hit
        // Supabase's email sending again, just get the admin in locally.
        usedLocalFallback = true;
        supabaseAuthWarning = "Couldn't sign in to Supabase yet (account may still need email confirmation, or the rate limit hasn't reset) — logged in with a local-only session instead.";
      } else {
        err.textContent = 'Invalid admin credentials.'; err.style.display = 'block'; return;
      }
    } else {
      // Successful real Supabase sign-in — clear the one-shot signup flag so a
      // future device/browser can still self-provision if ever needed again.
      localStorage.removeItem('al-admin-signup-attempted');
    }

    if (!usedLocalFallback) {
      // Keep the local hash in sync purely so this browser can still show the admin
      // panel instantly next time without a network round trip — it is never the
      // thing that grants write access, and it is never uploaded to Supabase.
      localStorage.setItem('al-admin-email', email);
      localStorage.setItem('al-admin-pass-hash', await hashText(pass));
    }
  } else {
    // Local-only mode (no Supabase connected yet): fall back to the local hash
    // check, since there's no server to verify against. This only protects
    // against casual on-device tampering, same as any other client-side check —
    // it's fine because there's no remote attacker who can read this device's
    // localStorage.
    if (!matchesLocalRecord) {
      err.textContent = 'Invalid admin credentials.'; err.style.display = 'block'; return;
    }
  }

  currentAdmin = { email: email };
  saveAdmin();
  closeAuth();
  showPage('admin');
  if (supabaseAuthWarning) showToast(supabaseAuthWarning, {type:'error'});
}

function handleAdminGoogle() { startGoogleAuth('admin'); }

function showAdminGoogleFallback() {
  closeAuth();
  document.getElementById('admin-google-overlay').classList.add('open');
  document.body.style.overflow = 'hidden';
  const input = document.getElementById('ag-email');
  if (input) { input.value = getAdminEmail(); input.focus(); input.select(); }
}

function submitAdminGoogleEmail() {
  const input = document.getElementById('ag-email');
  const err = document.getElementById('ag-error');
  const email = input ? input.value.trim() : '';
  const storedEmail = getAdminEmail();
  if (email !== storedEmail) { err.textContent = 'Unauthorized Gmail address.'; err.style.display = 'block'; return; }
  currentAdmin = { email: email };
  saveAdmin();
  closeAuth();
  showPage('admin');
  // This simulated alias picker doesn't open a real Supabase Auth session (it
  // never has a password to sign in with), so protected-table writes won't work
  // until real Google Sign-In is set up, or the admin logs in with email+password instead.
  if (isDbConnected() && sb) showToast('You\'re in as admin locally, but Supabase writes are locked in this simulated Google sign-in mode. Use the email + password admin login instead, or finish the real Google Sign-In setup, to get write access.', {type:'error'});
}

function adminLogout() {
  currentAdmin = null;
  saveAdmin();
  teardownSubmissionsRealtime();
  teardownReportsRealtime();
  if (isDbConnected() && sb) { sb.auth.signOut().catch(() => {}); }
  showPage('home');
}

// ═══════════════════════════════════════════════════════════════
//  CHAT SYSTEM — ADMIN CONTROL
// ═══════════════════════════════════════════════════════════════

function isChatEnabled() {
  const v = localStorage.getItem('al-chat-enabled');
  return v === null ? true : v === 'true';
}

function setChatEnabled(val) {
  localStorage.setItem('al-chat-enabled', val ? 'true' : 'false');
  applyChatEnabledState();
}

function applyChatEnabledState() {
  const enabled = isChatEnabled();
  document.querySelectorAll('a[href="#chat"]').forEach(a => {
    a.style.display = enabled ? '' : 'none';
  });
  const checkbox = document.getElementById('adm-chat-enabled');
  if (checkbox) checkbox.checked = enabled;
}

function toggleChatSystem() {
  const checkbox = document.getElementById('adm-chat-enabled');
  setChatEnabled(checkbox.checked);
}

// ═══════════════════════════════════════════════════════════════
//  AI MODERATION — ADMIN ON/OFF TOGGLE
//  Unlike most admin toggles on this site, this one is synced through
//  Supabase (a `site_settings` key/value table) instead of staying purely
//  local — the whole point is one admin flips it once and it applies for
//  every visitor's browser, not just the device that toggled it.
// ═══════════════════════════════════════════════════════════════

// Fast local cache so moderateText() doesn't need a network round-trip on
// every single keystroke/send — refreshed from Supabase on load and
// whenever the admin toggles it.
function isModerationEnabledCached() {
  const v = localStorage.getItem('al-moderation-enabled');
  return v === null ? true : v === 'true';
}

async function refreshModerationEnabledFromDb() {
  if (!isDbConnected() || !sb) return;
  try {
    const { data, error } = await sb.from('site_settings').select('value').eq('key', 'moderation_enabled').maybeSingle();
    if (error) throw error;
    const enabled = data ? data.value === 'true' : true; // default on if no row yet
    localStorage.setItem('al-moderation-enabled', enabled ? 'true' : 'false');
    applyModerationEnabledState();
  } catch (e) {
    console.error('Could not load moderation setting from Supabase (falling back to last-known/local value):', e);
  }
}

async function setModerationEnabled(val) {
  localStorage.setItem('al-moderation-enabled', val ? 'true' : 'false');
  applyModerationEnabledState();
  if (isDbConnected() && sb) {
    try {
      await sb.from('site_settings').upsert({ key: 'moderation_enabled', value: val ? 'true' : 'false' });
    } catch (e) {
      console.error('Could not sync moderation setting to Supabase — it will only apply on this device until this succeeds:', e);
      showToast('Saved locally, but could not sync to Supabase — other visitors won\'t see this change yet.', { type: 'error' });
    }
  }
}

function applyModerationEnabledState() {
  const enabled = isModerationEnabledCached();
  // Mirror onto the Safety tab's copy of this switch and its status line.
  const mirror = document.getElementById('adm-moderation-enabled-safety');
  if (mirror) mirror.checked = enabled;
  const mirrorStatus = document.getElementById('adm-moderation-status-safety');
  if (mirrorStatus) {
    if (!isDbConnected()) {
      mirrorStatus.textContent = 'Supabase not connected — there is no Edge Function to call. Connect a database first.';
      mirrorStatus.className = 'setup-status is-warn';
    } else {
      mirrorStatus.textContent = enabled ? 'ON — every message is checked before it posts.' : 'OFF — messages post unchecked.';
      mirrorStatus.className = enabled ? 'setup-status is-on' : 'setup-status is-off';
    }
  }
  const checkbox = document.getElementById('adm-moderation-enabled');
  if (checkbox) checkbox.checked = enabled;
  const status = document.getElementById('adm-moderation-status');
  if (status) {
    if (!isDbConnected()) {
      status.textContent = 'Supabase not connected — there is no Edge Function to call. Connect a database first.';
      status.className = 'setup-status is-warn';
    } else {
      status.textContent = enabled
        ? 'ON — every message is checked before it posts.'
        : 'OFF — messages post unchecked.';
      status.className = enabled ? 'setup-status is-on' : 'setup-status is-off';
    }
  }
}

function toggleModerationSystem() {
  const checkbox = document.getElementById('adm-moderation-enabled');
  setModerationEnabled(checkbox.checked);
}

// ═══════════════════════════════════════════════════════════════
//  CLOUDFLARE TURNSTILE — bot check on signup. Same local-cache-plus-
//  Supabase-sync pattern as AI moderation above: the ON/OFF flag and the
//  (public) site key sync through site_settings so every visitor's browser
//  agrees, but the actual token verification always happens server-side
//  in the verify-turnstile Edge Function — never trust a client-side
//  "yes I'm human" claim on its own.
// ═══════════════════════════════════════════════════════════════
let turnstileScriptLoaded = false;
let turnstileWidgetIds = {};

function isTurnstileEnabledCached() {
  return localStorage.getItem('al-turnstile-enabled') === 'true';
}
function getTurnstileSiteKeyCached() {
  return localStorage.getItem('al-turnstile-sitekey') || '';
}

async function refreshTurnstileEnabledFromDb() {
  if (!isDbConnected() || !sb) return;
  try {
    const { data, error } = await sb.from('site_settings').select('value').eq('key', 'turnstile_enabled').maybeSingle();
    if (error) throw error;
    const enabled = data ? data.value === 'true' : false;
    localStorage.setItem('al-turnstile-enabled', enabled ? 'true' : 'false');
    const { data: keyRow } = await sb.from('site_settings').select('value').eq('key', 'turnstile_sitekey').maybeSingle();
    if (keyRow && keyRow.value) localStorage.setItem('al-turnstile-sitekey', keyRow.value);
    const { data: strictRow } = await sb.from('site_settings').select('value').eq('key', 'turnstile_strict').maybeSingle();
    if (strictRow) localStorage.setItem('al-turnstile-strict', strictRow.value === 'true' ? 'true' : 'false');
    applyTurnstileState();
    maybeRenderTurnstileWidget('signup');
  } catch (e) {
    console.error('Could not load Turnstile setting from Supabase (falling back to last-known/local value):', e);
  }
}

async function setTurnstileEnabled(val) {
  localStorage.setItem('al-turnstile-enabled', val ? 'true' : 'false');
  applyTurnstileState();
  maybeRenderTurnstileWidget('signup');
  if (isDbConnected() && sb) {
    try {
      await sb.from('site_settings').upsert({ key: 'turnstile_enabled', value: val ? 'true' : 'false' });
    } catch (e) {
      console.error('Could not sync Turnstile setting to Supabase — it will only apply on this device until this succeeds:', e);
      showToast('Saved locally, but could not sync to Supabase — other visitors won\'t see this change yet.', { type: 'error' });
    }
  }
}

function applyTurnstileState() {
  const enabled = isTurnstileEnabledCached();
  const checkbox = document.getElementById('adm-turnstile-enabled');
  if (checkbox) checkbox.checked = enabled;
  const keyInput = document.getElementById('adm-turnstile-sitekey');
  if (keyInput) keyInput.value = getTurnstileSiteKeyCached();
  const strictBox = document.getElementById('adm-turnstile-strict');
  if (strictBox) strictBox.checked = isTurnstileStrictMode();
  const status = document.getElementById('adm-turnstile-status');
  if (status) {
    if (!enabled) {
      status.textContent = 'OFF — anyone can submit the signup form. The invisible honeypot field still runs.';
      status.className = 'setup-status is-off';
    } else if (!getTurnstileSiteKeyCached()) {
      status.textContent = 'ON, but no Site Key saved — go back to step 2. Nothing will render until you do.';
      status.className = 'setup-status is-warn';
    } else if (!isDbConnected()) {
      status.textContent = 'ON, but Supabase is not connected — verify-turnstile cannot be reached and signups WILL fail. Turn this off or connect a database.';
      status.className = 'setup-status is-warn';
    } else {
      status.textContent = 'ON and working — signups require passing the check.';
      status.className = 'setup-status is-on';
    }
  }
}

function toggleTurnstileSystem() {
  const checkbox = document.getElementById('adm-turnstile-enabled');
  setTurnstileEnabled(checkbox.checked);
}

async function saveTurnstileSiteKey() {
  const val = (document.getElementById('adm-turnstile-sitekey').value || '').trim();
  localStorage.setItem('al-turnstile-sitekey', val);
  applyTurnstileState();
  maybeRenderTurnstileWidget('signup');
  if (isDbConnected() && sb) {
    try {
      await sb.from('site_settings').upsert({ key: 'turnstile_sitekey', value: val });
      showToast('Site key saved.');
    } catch (e) {
      console.error('Could not sync Turnstile site key to Supabase:', e);
      showToast('Saved locally, but could not sync to Supabase.', { type: 'error' });
    }
  } else {
    showToast('Site key saved locally.');
  }
}

function loadTurnstileScript(cb) {
  if (turnstileScriptLoaded) { cb(); return; }
  const s = document.createElement('script');
  s.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
  s.async = true; s.defer = true;
  s.onload = () => { turnstileScriptLoaded = true; cb(); };
  document.head.appendChild(s);
}

// Renders (or tears down) the widget in a given form's container —
// e.g. maybeRenderTurnstileWidget('signup') targets #turnstile-widget-signup.
function maybeRenderTurnstileWidget(formKey) {
  const container = document.getElementById('turnstile-widget-' + formKey);
  if (!container) return;
  container.innerHTML = '';
  delete turnstileWidgetIds[formKey];
  if (!isTurnstileEnabledCached() || !getTurnstileSiteKeyCached()) return;
  loadTurnstileScript(() => {
    if (!window.turnstile) return;
    turnstileWidgetIds[formKey] = turnstile.render(container, {
      sitekey: getTurnstileSiteKeyCached(),
      theme: 'dark',
      // A Turnstile token expires after about 5 minutes. Without this, a
      // form left open longer than that submits an already-dead token and
      // reports it as a failed bot check — neither true, nor something the
      // visitor can do anything about. 'auto' silently re-issues instead.
      'refresh-expired': 'auto',
      'retry': 'auto',
      'error-callback': function () {
        console.error('Turnstile widget error — check the Site Key matches this exact domain.');
        return true; // keep the widget alive rather than leaving a blank box
      }
    });
  });
}

function getTurnstileToken(formKey) {
  if (!window.turnstile || !turnstileWidgetIds[formKey]) return null;
  return turnstile.getResponse(turnstileWidgetIds[formKey]) || null;
}

// A Turnstile token is SINGLE USE and expires after ~5 minutes. Once it has
// been sent to Cloudflare's siteverify endpoint it is spent, and sending it
// again returns "timeout-or-duplicate" — which the old code reported as
// "Verification failed", forever, no matter how many times you passed the
// widget. This forces a brand new token after every attempt.
function resetTurnstileWidget(formKey) {
  try {
    if (window.turnstile && turnstileWidgetIds[formKey]) {
      turnstile.reset(turnstileWidgetIds[formKey]);
    }
  } catch (e) { /* widget already gone — nothing to reset */ }
}

// Verifies a Turnstile token via the verify-turnstile Edge Function.
//
// Returns { ok, reason } instead of a bare boolean, because the old version
// collapsed FOUR completely different situations into a single "false":
//   · Supabase not connected
//   · the Edge Function was never deployed
//   · the function errored or returned junk
//   · Cloudflare genuinely judged the visitor to be a bot
//
// Only the last of those is the visitor's problem. The first three are
// server-side faults, and reporting them as "Verification failed — please
// retry the check above" sent people into an unwinnable loop: the widget
// says Success (Cloudflare's browser-side challenge passes fine), the site
// says failed, retrying changes nothing. Nobody could create an account.
async function verifyTurnstileToken(token) {
  if (!token) return { ok: false, reason: 'no-token' };
  if (!isDbConnected() || !sb) return { ok: false, reason: 'infra', detail: 'Supabase is not connected' };
  try {
    const { data, error } = await sb.functions.invoke('verify-turnstile', { body: { token } });
    if (error) {
      const msg = error.message || String(error);
      console.error('Turnstile verify call failed:', msg);
      if (/not ?found|404|does not exist/i.test(msg)) {
        return { ok: false, reason: 'infra', detail: 'the verify-turnstile function is not deployed' };
      }
      return { ok: false, reason: 'infra', detail: msg };
    }
    if (!data || typeof data.success === 'undefined') {
      return { ok: false, reason: 'infra', detail: 'the function returned no verdict' };
    }
    if (data.success) return { ok: true };
    // Cloudflare answered, and said no. Distinguish a spent token — that's
    // still a mechanical problem, not a bot.
    const codes = (data['error-codes'] || data.errorCodes || []).join(',');
    if (/timeout-or-duplicate/i.test(codes)) {
      return { ok: false, reason: 'stale-token' };
    }
    return { ok: false, reason: 'rejected', detail: codes };
  } catch (e) {
    console.error('Turnstile verify threw:', e);
    return { ok: false, reason: 'infra', detail: e.message || 'network error' };
  }
}

// When the bot check itself is broken, should signups be blocked or allowed?
//
// The old behaviour was to block, unconditionally. That means a single
// undeployed Edge Function takes your entire site offline for new users,
// with no error message anywhere that says why. Default is now to allow
// through on INFRASTRUCTURE failures only (a real "you are a bot" verdict
// from Cloudflare still blocks), because:
//   · the honeypot field, send cooldowns and database rate limits all
//     still apply, so this is not an unprotected door
//   · row-level security is what actually guards your data, and it is
//     unaffected either way
//   · a site nobody can sign up to is a worse outcome than a site that
//     briefly leans on its other defences
// Flip this on in Admin → Safety & Bots if you would rather block.
function isTurnstileStrictMode() {
  return localStorage.getItem('al-turnstile-strict') === 'true';
}
async function setTurnstileStrictMode(val) {
  localStorage.setItem('al-turnstile-strict', val ? 'true' : 'false');
  if (isDbConnected() && sb) {
    try { await sb.from('site_settings').upsert({ key: 'turnstile_strict', value: val ? 'true' : 'false' }); }
    catch (e) { console.error('Could not sync strict-mode setting:', e); }
  }
  refreshSafetyStatus();
}
function toggleTurnstileStrict() {
  const cb = document.getElementById('adm-turnstile-strict');
  if (cb) setTurnstileStrictMode(cb.checked);
}

function copyTurnstileFnCode() {
  const code = document.getElementById('turnstile-fn-code').textContent;
  navigator.clipboard.writeText(code).then(() => {
    const c = document.getElementById('turnstile-copy-confirm');
    if (c) { c.textContent = 'Copied.'; setTimeout(() => c.textContent = '', 2500); }
  });
}

function saveModerationConfig() {
  const model = document.getElementById('adm-moderation-model').value;
  const action = document.getElementById('adm-moderation-action').value;
  localStorage.setItem('al-moderation-model', model);
  localStorage.setItem('al-moderation-action', action);
  if (isDbConnected() && sb) {
    sb.from('site_settings').upsert({ key: 'moderation_model', value: model }).then(() => {});
    sb.from('site_settings').upsert({ key: 'moderation_action', value: action }).then(() => {});
  }
  showToast('Saved — remember to redeploy the Edge Function if you changed the on-flag action.');
}

function copyModerationFnCode() {
  const code = document.getElementById('moderation-fn-code').textContent;
  navigator.clipboard.writeText(code).then(() => {
    const c = document.getElementById('moderation-copy-confirm');
    if (c) { c.textContent = 'Copied.'; setTimeout(() => c.textContent = '', 2500); }
  });
}

// ═══════════════════════════════════════════════════════════════
//  EMAILJS — sends the real signup verification code by email instead of
//  just showing it on-screen. Same local-cache-plus-Supabase-sync pattern
//  as the settings above: all three values (public key, service ID,
//  template ID) are meant to be public — EmailJS has no separate secret
//  key for this flow, unlike Turnstile/OpenAI — so there's no Edge
//  Function needed here, they can be safely synced to every visitor's
//  browser through site_settings just like the Turnstile site key.
//  auth.js (getEmailjsConfig) reads whatever's saved here, falling back
//  to window.AFTERLIGHT_EMAILJS_CONFIG from config.js if nothing's been
//  saved from this panel yet.
// ═══════════════════════════════════════════════════════════════
function getEmailjsConfigCached() {
  return {
    publicKey: localStorage.getItem('al-emailjs-publickey') || '',
    serviceId: localStorage.getItem('al-emailjs-serviceid') || '',
    templateId: localStorage.getItem('al-emailjs-templateid') || ''
  };
}

async function refreshEmailjsConfigFromDb() {
  if (!isDbConnected() || !sb) return;
  try {
    const { data, error } = await sb.from('site_settings').select('key,value')
      .in('key', ['emailjs_publickey', 'emailjs_serviceid', 'emailjs_templateid']);
    if (error) throw error;
    (data || []).forEach(row => {
      if (row.key === 'emailjs_publickey') localStorage.setItem('al-emailjs-publickey', row.value || '');
      if (row.key === 'emailjs_serviceid') localStorage.setItem('al-emailjs-serviceid', row.value || '');
      if (row.key === 'emailjs_templateid') localStorage.setItem('al-emailjs-templateid', row.value || '');
    });
    applyEmailjsAdminUI();
  } catch (e) {
    console.error('Could not load EmailJS settings from Supabase (falling back to last-known/local value):', e);
  }
}

function applyEmailjsAdminUI() {
  const cfg = getEmailjsConfigCached();
  const pk = document.getElementById('adm-emailjs-publickey');
  const sid = document.getElementById('adm-emailjs-serviceid');
  const tid = document.getElementById('adm-emailjs-templateid');
  if (pk) pk.value = cfg.publicKey;
  if (sid) sid.value = cfg.serviceId;
  if (tid) tid.value = cfg.templateId;
  const status = document.getElementById('adm-emailjs-status');
  if (status) {
    if (cfg.publicKey && cfg.serviceId && cfg.templateId) {
      status.textContent = 'Configured — signup verification codes will be sent by real email.' +
        (isDbConnected() ? '' : ' (Not synced to Supabase — connect a database on the Database tab so other admins/devices get this too.)');
    } else if (window.AFTERLIGHT_EMAILJS_CONFIG && window.AFTERLIGHT_EMAILJS_CONFIG.publicKey) {
      status.textContent = 'Not set here, but config.js has a fallback configured — that will be used instead.';
    } else {
      status.textContent = 'Not configured yet — signup is in demo mode: verification codes just show on-screen instead of being emailed.';
    }
  }
}

function renderAdminEmail() {
  applyEmailjsAdminUI();
  refreshEmailjsConfigFromDb();
  const result = document.getElementById('adm-emailjs-test-result');
  if (result) result.textContent = '';
}

async function saveEmailjsConfig() {
  const publicKey = (document.getElementById('adm-emailjs-publickey').value || '').trim();
  const serviceId = (document.getElementById('adm-emailjs-serviceid').value || '').trim();
  const templateId = (document.getElementById('adm-emailjs-templateid').value || '').trim();
  localStorage.setItem('al-emailjs-publickey', publicKey);
  localStorage.setItem('al-emailjs-serviceid', serviceId);
  localStorage.setItem('al-emailjs-templateid', templateId);
  resetEmailjsInitState();
  applyEmailjsAdminUI();
  if (isDbConnected() && sb) {
    try {
      await Promise.all([
        sb.from('site_settings').upsert({ key: 'emailjs_publickey', value: publicKey }),
        sb.from('site_settings').upsert({ key: 'emailjs_serviceid', value: serviceId }),
        sb.from('site_settings').upsert({ key: 'emailjs_templateid', value: templateId })
      ]);
      showToast('EmailJS settings saved and synced to Supabase.');
    } catch (e) {
      console.error('Could not sync EmailJS settings to Supabase:', e);
      showToast('Saved locally, but could not sync to Supabase — other visitors won\'t get this until it syncs.', { type: 'error' });
    }
  } else {
    showToast('EmailJS settings saved locally.');
  }
}

function renderAdminSafety() {
  applyTurnstileState();
  refreshTurnstileEnabledFromDb();
  const savedModel = localStorage.getItem('al-moderation-model');
  const savedAction = localStorage.getItem('al-moderation-action');
  if (savedModel) document.getElementById('adm-moderation-model').value = savedModel;
  if (savedAction) document.getElementById('adm-moderation-action').value = savedAction;
}

function renderAdminChat() {
  applyChatEnabledState();
  applyModerationEnabledState();
  refreshModerationEnabledFromDb();
  renderAdminOverviewStats();
  const list = document.getElementById('admin-chat-rooms-list');
  if (!list) return;
  const rooms = getRooms();
  list.innerHTML = rooms.map(r => {
    const msgs = getMessages(r.name);
    const isGeneral = r.name === 'general';
    return `
    <div class="admin-song-row">
      <div class="song-info">
        #${escapeHtml(r.name)} ${isGeneral ? '<span style="color:var(--accent);font-size:10px;">(global)</span>' : ''}
        <div style="font-family:var(--mono);font-size:10px;color:var(--muted);margin-top:2px;">${msgs.length} messages · created by ${escapeHtml(r.creator)}</div>
      </div>
      <div class="actions">
        <button class="edit-btn" onclick="viewAdminRoom('${r.name}')">View / Moderate</button>
        ${isGeneral ? '' : `<button onclick="adminRenameRoom('${r.name}')">Rename</button><button onclick="adminDeleteRoom('${r.name}')">Delete</button>`}
      </div>
    </div>`;
  }).join('');
}

function viewAdminRoom(name) {
  const detail = document.getElementById('admin-chat-room-detail');
  const msgs = getMessages(name);
  detail.innerHTML = `
    <div style="border-top:1px solid var(--border);padding-top:20px;">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;">
        <h4 style="font-family:var(--serif);font-size:18px;">Moderating #${escapeHtml(name)}</h4>
        <button class="link-btn" onclick="document.getElementById('admin-chat-room-detail').innerHTML=''">Close</button>
      </div>
      ${msgs.length === 0 ? '<p style="font-family:var(--mono);font-size:11px;color:var(--muted);">No messages in this room.</p>' : ''}
      <div style="display:flex;flex-direction:column;gap:8px;max-height:400px;overflow-y:auto;">
        ${msgs.map((m, i) => `
          <div class="admin-song-row">
            <div class="song-info">
              <span style="color:var(--accent);">${escapeHtml(m.author)}</span> · <span style="color:var(--muted);font-size:10px;">${new Date(m.time).toLocaleString()}</span>
              <div style="margin-top:4px;color:var(--text);">${escapeHtml(m.text)}</div>
            </div>
            <div class="actions">
              <button onclick="adminDeleteMessage('${name}', ${i})">Delete</button>
            </div>
          </div>
        `).join('')}
      </div>
      ${msgs.length > 0 ? `<button class="form-btn danger" style="margin-top:14px;max-width:220px;" onclick="adminClearRoom('${name}')">Clear All Messages</button>` : ''}
    </div>
  `;
}

function adminDeleteMessage(roomName, idx) {
  if (!confirm('Delete this message?')) return;
  const msgs = getMessages(roomName);
  const msg = msgs[idx];
  msgs.splice(idx, 1);
  saveMessages(roomName, msgs);
  // Also delete server-side, or syncRoomMessages() will just pull the
  // "deleted" message straight back out of Supabase on the next load.
  if (isDbConnected() && msg && msg.id && /^\d+$/.test(String(msg.id))) {
    sb.from('chat_messages').delete().eq('id', Number(msg.id)).then(() => {});
  }
  viewAdminRoom(roomName);
  renderAdminChat();
}

function adminClearRoom(roomName) {
  if (!confirm('Delete ALL messages in #' + roomName + '? This cannot be undone.')) return;
  saveMessages(roomName, []);
  // Same reason as adminDeleteMessage: the local cache is only half the
  // picture. Without this, the room re-fills from Supabase on refresh.
  if (isDbConnected()) {
    sb.from('chat_messages').delete().eq('room', roomName).then(() => {});
  }
  viewAdminRoom(roomName);
  renderAdminChat();
}

function adminRenameRoom(oldName) {
  const newNameRaw = prompt('Rename #' + oldName + ' to:', oldName);
  if (!newNameRaw) return;
  const newName = newNameRaw.trim().toLowerCase().replace(/[^a-z0-9_-]/g, '').replace(/\s+/g, '-');
  if (!newName || newName.length < 2) { showToast('Invalid name.', {type:'error'}); return; }
  if (newName === 'general') { showToast('That name is reserved.', {type:'error'}); return; }
  const rooms = getRooms();
  if (rooms.find(r => r.name === newName)) { showToast('A room with that name already exists.', {type:'error'}); return; }
  const room = rooms.find(r => r.name === oldName);
  if (!room) return;
  room.name = newName;
  saveRooms(rooms);
  // migrate messages to new key
  const msgs = getMessages(oldName);
  saveMessages(newName, msgs);
  localStorage.removeItem('al-chat-' + oldName);
  document.getElementById('admin-chat-room-detail').innerHTML = '';
  renderAdminChat();
}

function adminDeleteRoom(name) {
  if (name === 'general') { showToast('The global chat room cannot be deleted.', {type:'error'}); return; }
  if (!confirm('Delete #' + name + ' and all its messages? This cannot be undone.')) return;
  const rooms = getRooms().filter(r => r.name !== name);
  saveRooms(rooms);
  localStorage.removeItem('al-chat-' + name);
  // getRooms() only ever reads from localStorage, but the room row (and its
  // messages) still exist in Supabase's chat_rooms/chat_messages tables until
  // deleted here — leaving them meant the channel could reappear wherever
  // that data still gets read from, and the messages would linger forever.
  if (isDbConnected()) {
    sb.from('chat_messages').delete().eq('room', name).then(() => {});
    sb.from('chat_rooms').delete().eq('name', name).then(() => {});
  }
  document.getElementById('admin-chat-room-detail').innerHTML = '';
  renderAdminChat();
}

// ═══════════════════════════════════════════════════════════════
//  ADMIN PANEL
// ═══════════════════════════════════════════════════════════════

async function initAdmin() {
  if (!currentAdmin) { showPage('home'); return; }
  showAdminTab('site');
  renderAdminSongs();
  renderAdminUsers();
  renderAdminAvatars();
  renderAdminSubmissions();
  renderAdminReports();
  renderAdminOverviewStats();
  // Access code + admin login fields are intentionally left blank —
  // secrets are stored as hashes and are never redisplayed, even to the admin.

  await pullUsersFromSupabase();
  renderAdminUsers();

  await pullSubmissionsFromSupabase();
  renderAdminUsers();
  renderAdminSubmissions();
  initSubmissionsRealtime();

  await pullReportsFromSupabase();
  renderAdminReports();
  initReportsRealtime();
}

// Populates the at-a-glance stat strip at the top of the admin dashboard, plus
// the small pending-count badge on the Submissions nav item. Called on load and
// again whenever songs, users, submissions, or chat rooms change, so it always
// reflects the current state without needing a manual refresh.
function renderAdminOverviewStats() {
  const songsEl = document.getElementById('admin-stat-songs');
  const usersEl = document.getElementById('admin-stat-users');
  const pendingEl = document.getElementById('admin-stat-pending');
  const roomsEl = document.getElementById('admin-stat-rooms');
  const badge = document.getElementById('admin-nav-pending-badge');
  if (!songsEl) return;

  const songCount = typeof songs !== 'undefined' ? songs.length : 0;
  const userCount = JSON.parse(localStorage.getItem('al-users') || '[]').length;
  const pendingCount = submissions.length;
  const roomCount = typeof getRooms === 'function' ? getRooms().length : 0;

  songsEl.textContent = String(songCount).padStart(2, '0');
  usersEl.textContent = String(userCount).padStart(2, '0');
  pendingEl.textContent = String(pendingCount).padStart(2, '0');
  roomsEl.textContent = String(roomCount).padStart(2, '0');

  if (badge) {
    if (pendingCount > 0) { badge.textContent = pendingCount; badge.style.display = 'inline-block'; }
    else { badge.style.display = 'none'; }
  }
}

function showAdminTab(tab) {
  // Recompute the Safety & Bots readout whenever that tab is opened, so it
  // reflects reality instead of whatever it said the last time.
  if (tab === 'safety' && typeof refreshSafetyStatus === 'function') {
    setTimeout(refreshSafetyStatus, 0);
  }
  document.querySelectorAll('.admin-nav-item').forEach(i => i.classList.remove('active'));
  document.querySelectorAll('[id^="admin-tab-"]').forEach(t => t.style.display = 'none');
  document.querySelector('.admin-nav-item[onclick="showAdminTab(\''+tab+'\')"]').classList.add('active');
  const adminPanel = document.getElementById('admin-tab-' + tab);
  adminPanel.style.display = 'block';
  adminPanel.style.animation = 'none';
  void adminPanel.offsetWidth;
  adminPanel.style.animation = 'pageIn 0.24s cubic-bezier(0.22,1,0.36,1) forwards';
  if (tab === 'genres') renderAdminGenres();
  if (tab === 'avatars') renderAdminAvatars();
  if (tab === 'moods') renderAdminMoods();
  if (tab === 'chat') renderAdminChat();
  if (tab === 'safety') renderAdminSafety();
  if (tab === 'email') renderAdminEmail();
  if (tab === 'database') {
    const cfg = getDbConfig();
    if (cfg) {
      document.getElementById('db-url').value = cfg.url;
      document.getElementById('db-key').value = cfg.key;
    }
    updateDbStatusUI();
  }
  if (tab === 'site') refreshOwnerAdminDisplay();
  if (tab === 'users') pullUsersFromSupabase().then(renderAdminUsers);

  if (tab === 'livestats') {
    loadLiveStatsCounts();
    renderLiveStatsPresence();
    if (liveStatsRefreshTimer) clearInterval(liveStatsRefreshTimer);
    liveStatsRefreshTimer = setInterval(() => { loadLiveStatsCounts(); renderLiveStatsPresence(); }, 8000);
  } else if (liveStatsRefreshTimer) {
    clearInterval(liveStatsRefreshTimer);
    liveStatsRefreshTimer = null;
  }
}

// Pulls the FULL users table down from Supabase and merges it into the local
// 'al-users' cache that renderAdminUsers() reads from.
//
// This used to only refresh the `blocked` flag on users this browser already
// knew about locally (see git history / old name refreshUsersBlockedFromSupabase)
// — which meant anyone who signed up on a friend's device was invisible in the
// admin panel forever, no matter how many times you reloaded. Now it also adds
// any account that exists in Supabase but not in this browser's local cache.
//
// Note the Supabase `users` table only has a subset of the fields the local
// record carries (no realName/email/totalSeconds/password — those are
// local-only/device-specific today), so a user pulled in fresh from another
// device will show "Not provided" for those until they log in on this device.
// That's a real gap worth knowing about, not a bug in this function.
async function pullUsersFromSupabase() {
  if (!isDbConnected()) return;
  try {
    const { data: rows, error } = await sb.from('users').select('*');
    if (error) throw error;
    if (!rows) return;
    let users = JSON.parse(localStorage.getItem('al-users') || '[]');
    const byName = new Map(users.map(u => [u.name, u]));
    rows.forEach(r => {
      const existing = byName.get(r.username);
      if (existing) {
        existing.code = r.code || existing.code;
        existing.bio = (r.bio != null) ? r.bio : existing.bio;
        existing.gender = r.gender || existing.gender;
        existing.avatar = r.avatar || existing.avatar;
        existing.blocked = !!r.blocked;
      } else {
        // Account this browser has never seen before — signed up on another
        // device. Add a stub so it actually shows up in the Users tab.
        const stub = {
          name: r.username,
          code: r.code || '',
          bio: r.bio || '',
          gender: r.gender || '',
          avatar: r.avatar || null,
          blocked: !!r.blocked,
          created: r.created_at ? new Date(r.created_at).getTime() : Date.now(),
          totalSeconds: 0,
          realName: '',
          email: '',
          password: null
        };
        users.push(stub);
        byName.set(r.username, stub);
      }
    });
    localStorage.setItem('al-users', JSON.stringify(users));
  } catch (e) {
    console.error('Pull users from Supabase failed:', e);
  }
}

function refreshOwnerAdminDisplay() {
  const el = document.getElementById('adm-owner-current');
  if (!el) return;
  const owner = getOwnerUsername();
  el.textContent = owner ? '@' + owner : 'none set';
}

function saveSiteSettings() {
  const settings = {
    heroTitle: document.getElementById('adm-hero-title').value,
    heroSub: document.getElementById('adm-hero-sub').value,
    aboutTitle: document.getElementById('adm-about-title').value,
    aboutBody: document.getElementById('adm-about-body').value,
    archiveTitle: document.getElementById('adm-archive-title').value,
    submitTitle: document.getElementById('adm-submit-title').value,
    submitDesc: document.getElementById('adm-submit-desc').value,
    accent: document.getElementById('adm-accent').value,
    accent2: document.getElementById('adm-accent2').value
  };
  localStorage.setItem('al-site-settings', JSON.stringify(settings));
  applySiteSettings();
  showToast('Settings saved!');
}

function saveOwnerUsername() {
  const input = document.getElementById('adm-owner-username-input');
  const ok = document.getElementById('adm-owner-ok');
  const err = document.getElementById('adm-owner-err');
  ok.style.display = 'none'; err.style.display = 'none';
  const name = (input.value || '').trim().replace(/^@/, '');
  if (!name) { err.textContent = 'Enter a username first.'; err.style.display = 'block'; return; }
  const users = JSON.parse(localStorage.getItem('al-users') || '[]');
  const match = users.find(u => u.name.toLowerCase() === name.toLowerCase());
  if (!match) { err.textContent = `No account named @${name} found. They need to sign up first.`; err.style.display = 'block'; return; }
  localStorage.setItem('al-owner-username', match.name);
  input.value = '';
  refreshOwnerAdminDisplay();
  ok.textContent = `✓ @${match.name} is now the Owner account.`;
  ok.style.display = 'block';
  setTimeout(() => { ok.style.display = 'none'; }, 3000);
  // Live-refresh anything on screen that shows the owner badge right now.
  updateAuthUI();
  if (typeof currentRoom !== 'undefined' && currentRoom) refreshChatView(currentRoom);
  // Push to Supabase so the owner badge/ban powers show up on every device,
  // not just this browser.
  pushAdminSettingsToSupabase();
}

function clearOwnerUsername() {
  localStorage.removeItem('al-owner-username');
  refreshOwnerAdminDisplay();
  updateAuthUI();
  showToast('Owner badge removed.');
  pushAdminSettingsToSupabase();
}

async function saveAdminAccessCode() {
  const input = document.getElementById('adm-access-code-input');
  const ok = document.getElementById('adm-access-code-ok');
  const code = input.value.trim();
  if (!code) return; // blank = keep current code, nothing to do
  if (code.length < 4) {
    showToast('Access code should be at least 4 characters.', {type:'error'});
    return;
  }
  localStorage.setItem('al-admin-code-hash', await hashText(code));
  input.value = '';
  await pushAdminSettingsToSupabase();
  if (ok) {
    ok.textContent = '✓ Access code updated' + (isDbConnected() ? ' for all visitors.' : ' for this browser.');
    ok.style.display = 'block';
    setTimeout(() => { ok.style.display = 'none'; }, 2500);
  }
}

async function saveAdminLoginCredentials() {
  const emailInput = document.getElementById('adm-login-email-input');
  const passInput = document.getElementById('adm-login-pass-input');
  const passInput2 = document.getElementById('adm-login-pass-input2');
  const ok = document.getElementById('adm-login-cred-ok');
  const err = document.getElementById('adm-login-cred-err');
  ok.style.display = 'none'; err.style.display = 'none';

  const newEmail = emailInput.value.trim();
  const newPass = passInput.value;
  const newPass2 = passInput2.value;

  if (newPass || newPass2) {
    if (newPass.length < 6) {
      err.textContent = 'Password should be at least 6 characters.'; err.style.display = 'block'; return;
    }
    if (newPass !== newPass2) {
      err.textContent = 'Passwords do not match.'; err.style.display = 'block'; return;
    }
  }
  if (!newEmail && !newPass) return; // nothing to change

  if (newEmail) localStorage.setItem('al-admin-email', newEmail);
  if (newPass) localStorage.setItem('al-admin-pass-hash', await hashText(newPass));
  await pushAdminSettingsToSupabase();

  // Keep the real Supabase Auth account (the one that actually grants write access
  // to protected tables) in sync too, if we currently have an authenticated session.
  let authSyncFailed = false;
  if (isDbConnected() && sb && (newEmail || newPass)) {
    try {
      const patch = {};
      if (newEmail) patch.email = newEmail;
      if (newPass) patch.password = newPass;
      const { error } = await sb.auth.updateUser(patch);
      if (error) authSyncFailed = true;
    } catch (e) { authSyncFailed = true; }
  }

  emailInput.value = ''; passInput.value = ''; passInput2.value = '';
  ok.textContent = '✓ Admin login updated' + (isDbConnected() ? ' for every browser.' : ' for this browser.');
  ok.style.display = 'block';
  setTimeout(() => { ok.style.display = 'none'; }, 2500);
  if (authSyncFailed) showToast('Local admin login was updated, but the matching Supabase Auth account could not be updated automatically. Update it manually in Supabase → Authentication → Users so your login and your database write access stay in sync.', {type:'error'});
}

function applySiteSettings() {
  const raw = localStorage.getItem('al-site-settings');
  if (!raw) return;
  const s = JSON.parse(raw);
  if (s.heroTitle) document.getElementById('hero-title').innerHTML = escapeHtml(s.heroTitle).replace(/\n/g, '<br>');
  if (s.heroSub) document.getElementById('hero-sub').textContent = s.heroSub;
  if (s.aboutTitle) document.getElementById('about-title').innerHTML = escapeHtml(s.aboutTitle).replace(/\n/g, '<br>').replace(/&lt;em&gt;/g, '<em>').replace(/&lt;\/em&gt;/g, '</em>');
  if (s.aboutBody) document.getElementById('about-body').innerHTML = escapeHtml(s.aboutBody).replace(/\n/g, '<br>').replace(/&lt;em&gt;/g, '<em>').replace(/&lt;\/em&gt;/g, '</em>');
  if (s.archiveTitle) document.getElementById('archive-title').textContent = s.archiveTitle;
  if (s.submitTitle) document.getElementById('submit-title').textContent = s.submitTitle;
  if (s.submitDesc) document.getElementById('submit-desc').textContent = s.submitDesc;
  if (s.accent) document.documentElement.style.setProperty('--accent', s.accent);
  if (s.accent2) document.documentElement.style.setProperty('--accent2', s.accent2);
}

function renderAdminSongs() {
  const list = document.getElementById('admin-songs-list');
  list.innerHTML = songs.map((s, i) => `
    <div class="admin-song-row">
      <div class="song-info">${s.number} — ${escapeHtml(s.title)} <span>by ${escapeHtml(s.artist)}</span></div>
      <div class="actions">
        <button class="edit-btn" onclick="editSong(${i})">Edit</button>
        <button onclick="deleteSong(${i})">Delete</button>
      </div>
    </div>
  `).join('');
  renderAdminOverviewStats();
}

// Counts a user's submissions: pending ones still sitting in the review queue,
// plus already-approved songs credited to them (approved submissions are removed
// from the submissions queue once added to the archive, so both sources are needed for
// a true lifetime total).
function getSubmissionCount(name) {
  if (!name) return 0;
  const pending = submissions.filter(s => s.submittedBy === name).length;
  const approved = (typeof songs !== 'undefined' ? songs : [])
    .filter(s => s.credit === 'Submitted by ' + name).length;
  return pending + approved;
}

function renderAdminUsers() {
  const list = document.getElementById('admin-users-list');
  const users = JSON.parse(localStorage.getItem('al-users') || '[]');
  renderAdminOverviewStats();
  if (users.length === 0) { list.innerHTML = '<p style="color:var(--muted);font-family:var(--mono);font-size:12px;">No users yet.</p>'; return; }

  const searchEl = document.getElementById('admin-user-search');
  const query = searchEl ? searchEl.value.trim().toLowerCase() : '';
  const indexed = users.map((u, i) => ({ u, i, submits: getSubmissionCount(u.name) }));
  const filtered = query
    ? indexed.filter(({ u }) =>
        (u.name || '').toLowerCase().includes(query) ||
        (u.realName || '').toLowerCase().includes(query) ||
        (u.email || '').toLowerCase().includes(query))
    : indexed;

  if (filtered.length === 0) { list.innerHTML = '<p style="color:var(--muted);font-family:var(--mono);font-size:12px;">No users match your search.</p>'; return; }

  const sortEl = document.getElementById('admin-user-sort');
  const sortBy = sortEl ? sortEl.value : 'newest';
  const sorted = filtered.slice().sort((a, b) => {
    switch (sortBy) {
      case 'oldest': return (a.u.created || 0) - (b.u.created || 0);
      case 'most-time': return (b.u.totalSeconds || 0) - (a.u.totalSeconds || 0);
      case 'least-time': return (a.u.totalSeconds || 0) - (b.u.totalSeconds || 0);
      case 'most-submits': return b.submits - a.submits;
      case 'az': return a.u.name.localeCompare(b.u.name);
      case 'za': return b.u.name.localeCompare(a.u.name);
      case 'blocked-first': return (b.u.blocked ? 1 : 0) - (a.u.blocked ? 1 : 0);
      case 'newest':
      default: return (b.u.created || 0) - (a.u.created || 0);
    }
  });

  list.innerHTML = sorted.map(({ u, i, submits }) => `
    <div class="admin-song-row clickable" onclick="openUserDetail(${i})">
      <div class="song-info">${escapeHtml(u.name)}${u.blocked ? ' <span class="blocked-tag">· BLOCKED</span>' : ''} <span>joined ${new Date(u.created).toLocaleDateString()} · ${formatUsageTime(u.totalSeconds)} on site · ${submits} submission${submits === 1 ? '' : 's'}${u.gender ? ' · ' + escapeHtml(u.gender) : ''}</span></div>
    </div>
  `).join('');
}

function openUserDetail(idx) {
  const users = JSON.parse(localStorage.getItem('al-users') || '[]');
  const u = users[idx];
  if (!u) return;
  document.getElementById('ud-title').textContent = '@' + u.name;

  const statusEl = document.getElementById('ud-status');
  statusEl.textContent = u.blocked ? 'Blocked' : 'Active';
  statusEl.className = 'sub-detail-status ' + (u.blocked ? 'status-blocked' : 'status-active');

  const setVal = (id, text) => {
    const el = document.getElementById(id);
    if (text && String(text).trim()) { el.textContent = text; el.classList.remove('empty'); }
    else { el.textContent = 'Not provided'; el.classList.add('empty'); }
  };
  setVal('ud-name', u.name);
  setVal('ud-realname', u.realName);
  setVal('ud-email', u.email);
  setVal('ud-gender', u.gender ? (u.gender.charAt(0).toUpperCase() + u.gender.slice(1)) : '');
  setVal('ud-code', u.code);
  document.getElementById('ud-created').textContent = u.created ? new Date(u.created).toLocaleString() : '—';
  document.getElementById('ud-usage').textContent = formatUsageTime(u.totalSeconds);
  document.getElementById('ud-method').textContent = u.password === 'google_oauth' ? 'Google' : 'Email & Password';
  document.getElementById('ud-submits').textContent = String(getSubmissionCount(u.name));
  setVal('ud-bio', u.bio);

  const blockBtn = document.getElementById('ud-block-btn');
  blockBtn.textContent = u.blocked ? 'Unblock User' : 'Block User';
  blockBtn.className = 'block-btn' + (u.blocked ? ' is-blocked' : '');
  blockBtn.onclick = () => toggleBlockUser(idx);

  document.getElementById('ud-delete-btn').onclick = () => deleteUserAccount(idx);

  document.getElementById('user-detail-overlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeUserDetail() {
  document.getElementById('user-detail-overlay').classList.remove('open');
  document.body.style.overflow = '';
}

// Pushes a block/unblock to Supabase (via the set_user_blocked RPC, so it's
// enforced server-side and takes effect for every device, not just this one)
// and reports back whether it actually succeeded. Best-effort: if Supabase
// isn't connected, this silently no-ops and the local-only behavior applies.
async function syncBlockedToSupabase(name, blocked) {
  if (!isDbConnected()) return true;
  try {
    const { error } = await sb.rpc('set_user_blocked', { p_username: name, p_blocked: blocked });
    if (error) { showToast(error.message || 'Could not sync block status to the server.', { type: 'error' }); return false; }
    return true;
  } catch (e) {
    console.error('set_user_blocked failed:', e);
    showToast('Could not reach the server — block may not sync to other devices.', { type: 'error' });
    return false;
  }
}

async function toggleBlockUser(idx) {
  let users = JSON.parse(localStorage.getItem('al-users') || '[]');
  const u = users[idx];
  if (!u) return;
  const willBlock = !u.blocked;
  if (willBlock && !confirm(`Block @${u.name}? They won't be able to log in until unblocked.`)) return;
  const ok = await syncBlockedToSupabase(u.name, willBlock);
  if (!ok) return;
  users = JSON.parse(localStorage.getItem('al-users') || '[]');
  const i = users.findIndex(x => x.name === u.name);
  if (i !== -1) users[i] = { ...users[i], blocked: willBlock };
  localStorage.setItem('al-users', JSON.stringify(users));
  // If the blocked user is currently logged in on this device, sign them out immediately.
  if (willBlock && currentUser && currentUser.name === u.name) {
    currentUser = null;
    saveUser();
    updateAuthUI();
    updateCommentForm();
    updateSubmitForm();
    updateSocialBadge();
  }
  renderAdminUsers();
  openUserDetail(i === -1 ? idx : i);
}

// Owner-only: ban/unban a user by name, from anywhere (e.g. their public profile
// card), without needing to open the full admin dashboard first.
async function ownerToggleBanUser(name) {
  if (!currentUserIsOwner()) return;
  if (isOwnerName(name)) { showToast('The owner account can\'t be banned.', {type:'error'}); return; }
  let users = JSON.parse(localStorage.getItem('al-users') || '[]');
  const idx = users.findIndex(u => u.name === name);
  if (idx === -1) { showToast('Could not find that account.', {type:'error'}); return; }
  const u = users[idx];
  const willBan = !u.blocked;
  if (willBan && !confirm(`Ban @${u.name}? They won't be able to log in or chat until unbanned.`)) return;
  const ok = await syncBlockedToSupabase(u.name, willBan);
  if (!ok) return;
  users = JSON.parse(localStorage.getItem('al-users') || '[]');
  const i = users.findIndex(x => x.name === name);
  if (i !== -1) users[i] = { ...users[i], blocked: willBan };
  localStorage.setItem('al-users', JSON.stringify(users));
  if (willBan && currentUser && currentUser.name === u.name) {
    currentUser = null;
    saveUser();
    updateAuthUI();
    updateCommentForm();
    updateSubmitForm();
    updateSocialBadge();
  }
  showToast(willBan ? `@${u.name} has been banned.` : `@${u.name} has been unbanned.`);
  openUserProfileView(name);
}

function deleteUserAccount(idx) {
  let users = JSON.parse(localStorage.getItem('al-users') || '[]');
  const u = users[idx];
  if (!u) return;
  if (!confirm(`Permanently delete @${u.name}'s account? This cannot be undone.`)) return;
  const wasCurrent = currentUser && currentUser.name === u.name;
  users.splice(idx, 1);
  localStorage.setItem('al-users', JSON.stringify(users));
  // Without this, the row survives in Supabase's `users` table, and
  // pullUsersFromSupabase() (which adds back any account it finds in the DB
  // that this browser doesn't have locally) re-creates the "deleted" account
  // the moment the admin panel refreshes or is reopened.
  if (isDbConnected()) {
    sb.rpc('admin_delete_user_account', { p_username: u.name }).then(({ error }) => {
      if (error) {
        console.error('Server-side account delete failed:', error);
        showToast('Deleted locally, but the account may reappear — server delete failed: ' + error.message, {type:'error'});
      }
    });
  }
  if (wasCurrent) {
    currentUser = null;
    saveUser();
    updateAuthUI();
    updateCommentForm();
    updateSubmitForm();
    updateSocialBadge();
  }
  closeUserDetail();
  renderAdminUsers();
}

let adminAvatarFilter = 'all';

function setAdminAvatarFilter(filter, btn) {
  adminAvatarFilter = filter;
  document.querySelectorAll('#admin-avatar-filter-tabs .sub-bulk-btn').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  renderAdminAvatars();
}

const GENDER_BADGE_LABEL = { female: 'F', male: 'M', any: 'Unisex' };

function renderAdminAvatars() {
  const grid = document.getElementById('admin-avatar-grid');
  if (!grid) return;
  let avatars = getAvatars();
  if (adminAvatarFilter !== 'all') avatars = avatars.filter(a => (a.gender || 'any') === adminAvatarFilter);
  if (avatars.length === 0) { grid.innerHTML = '<p style="color:var(--muted);font-family:var(--mono);font-size:12px;">No profile pictures match this filter.</p>'; return; }
  grid.innerHTML = avatars.map(a => `
    <div class="admin-avatar-item">
      <img src="${a.src}">
      <span class="avatar-gender-badge badge-${a.gender || 'any'}">${GENDER_BADGE_LABEL[a.gender || 'any']}</span>
      <button class="remove-avatar-btn" onclick="removeAvatar('${a.id}')" title="Remove">✕</button>
    </div>
  `).join('');
}

function addAvatar() {
  const input = document.getElementById('adm-new-avatar');
  const genderSel = document.getElementById('adm-new-avatar-gender');
  const err = document.getElementById('adm-avatar-error');
  err.style.display = 'none';
  const file = input.files && input.files[0];
  if (!file) { err.textContent = 'Choose an image file first.'; err.style.display = 'block'; return; }
  if (!file.type.startsWith('image/')) { err.textContent = 'File must be an image.'; err.style.display = 'block'; return; }
  const gender = genderSel ? genderSel.value : 'any';

  const reader = new FileReader();
  reader.onload = (e) => {
    const img = new Image();
    img.onload = () => {
      // Crop to a centered square, then downscale to keep storage small.
      const size = 160;
      const canvas = document.createElement('canvas');
      canvas.width = size; canvas.height = size;
      const ctx = canvas.getContext('2d');
      const minSide = Math.min(img.width, img.height);
      const sx = (img.width - minSide) / 2;
      const sy = (img.height - minSide) / 2;
      ctx.drawImage(img, sx, sy, minSide, minSide, 0, 0, size, size);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.85);

      const avatars = getAvatars();
      avatars.push({ id: 'av_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7), src: dataUrl, gender: gender });
      localStorage.setItem('al-avatars', JSON.stringify(avatars));
      input.value = '';
      renderAdminAvatars();
    };
    img.onerror = () => { err.textContent = 'Could not read that image.'; err.style.display = 'block'; };
    img.src = e.target.result;
  };
  reader.onerror = () => { err.textContent = 'Could not read that file.'; err.style.display = 'block'; };
  reader.readAsDataURL(file);
}

function removeAvatar(id) {
  if (!confirm('Remove this profile picture? Users who selected it will lose it.')) return;
  let avatars = getAvatars();
  avatars = avatars.filter(a => a.id !== id);
  localStorage.setItem('al-avatars', JSON.stringify(avatars));
  // Clear this avatar from any users who had it selected
  let users = JSON.parse(localStorage.getItem('al-users') || '[]');
  users = users.map(u => u.avatar === id ? { ...u, avatar: null } : u);
  localStorage.setItem('al-users', JSON.stringify(users));
  renderAdminAvatars();
}

let submissionSelectMode = false;
let selectedSubmissionIndexes = new Set();

function renderAdminSubmissions() {
  const list = document.getElementById('admin-submissions-list');
  const subs = submissions;
  renderAdminOverviewStats();

  const toolbar = document.getElementById('sub-bulk-toolbar');
  const selectToggleBtn = document.getElementById('sub-select-toggle-btn');
  const acceptAllBtn = document.getElementById('sub-accept-all-btn');
  const approveSelectedBtn = document.getElementById('sub-approve-selected-btn');
  const cancelSelectBtn = document.getElementById('sub-cancel-select-btn');

  if (toolbar) toolbar.style.display = subs.length ? 'flex' : 'none';
  if (selectToggleBtn) { selectToggleBtn.style.display = submissionSelectMode ? 'none' : 'inline-block'; }
  if (acceptAllBtn) { acceptAllBtn.style.display = submissionSelectMode ? 'none' : 'inline-block'; }
  if (approveSelectedBtn) {
    approveSelectedBtn.style.display = submissionSelectMode ? 'inline-block' : 'none';
    approveSelectedBtn.textContent = `Approve Selected (${selectedSubmissionIndexes.size})`;
  }
  if (cancelSelectBtn) { cancelSelectBtn.style.display = submissionSelectMode ? 'inline-block' : 'none'; }

  if (subs.length === 0) { list.innerHTML = '<p style="color:var(--muted);font-family:var(--mono);font-size:12px;">No pending submissions.</p>'; return; }
  list.innerHTML = subs.map((sub, i) => `
    <div class="admin-song-row ${submissionSelectMode ? 'select-mode' : 'clickable'}" ${submissionSelectMode ? '' : `onclick="openSubmissionDetail(${i})"`}>
      ${submissionSelectMode ? `<input type="checkbox" class="sub-select-checkbox" ${selectedSubmissionIndexes.has(i) ? 'checked' : ''} onchange="toggleSubmissionSelect(${i}, this.checked)">` : ''}
      <div class="song-info">${escapeHtml(sub.title)} <span>by ${escapeHtml(sub.artist)} — submitted by ${escapeHtml(sub.submittedBy)}</span></div>
      <div class="actions">
        ${submissionSelectMode ? '' : `
        <button class="edit-btn" onclick="event.stopPropagation();approveSubmission(${i})">Approve</button>
        <button onclick="event.stopPropagation();rejectSubmission(${i})">Reject</button>
        `}
      </div>
    </div>
  `).join('');
}

const REPORT_CATEGORY_LABELS = {
  harassment: 'Harassment or bullying', hate_speech: 'Hate speech', spam: 'Spam',
  inappropriate: 'Inappropriate content', impersonation: 'Impersonation', other: 'Other'
};

function renderAdminReports() {
  const list = document.getElementById('admin-reports-list');
  if (!list) return;
  const badge = document.getElementById('admin-nav-reports-badge');
  const pending = reports.filter(r => r.status === 'pending');
  if (badge) {
    if (pending.length > 0) { badge.textContent = pending.length; badge.style.display = 'inline-block'; }
    else { badge.style.display = 'none'; }
  }
  if (reports.length === 0) { list.innerHTML = '<p style="color:var(--muted);font-family:var(--mono);font-size:12px;">No reports filed.</p>'; return; }
  list.innerHTML = reports.map((r, i) => `
    <div class="admin-song-row">
      <div class="song-info">
        ${r.reportedUser ? `@${escapeHtml(r.reportedUser)}` : '(no user tagged)'} <span class="blocked-tag" style="color:${r.status === 'pending' ? 'var(--red)' : 'var(--muted)'};">· ${escapeHtml(r.status.toUpperCase())}</span>
        <span>${escapeHtml(REPORT_CATEGORY_LABELS[r.category] || r.category)} — reported by @${escapeHtml(r.reporter)}${r.contextType === 'chat_message' ? ' (chat message)' : ''} · ${new Date(r.createdAt).toLocaleString()}</span>
        ${r.details ? `<div style="font-family:var(--mono);font-size:11px;color:var(--text);margin-top:6px;">"${escapeHtml(r.details)}"</div>` : ''}
        ${r.contextRef && r.contextType === 'chat_message' ? `<div style="font-family:var(--mono);font-size:11px;color:var(--muted);margin-top:4px;font-style:italic;">Message: "${escapeHtml(r.contextRef)}"</div>` : ''}
      </div>
      <div class="actions">
        ${r.reportedUser ? `<button class="edit-btn" onclick="event.stopPropagation();viewReportedUser('${escapeJs(r.reportedUser)}')">View Profile</button>` : ''}
        ${r.reportedUser ? `<button onclick="event.stopPropagation();blockReportedUser('${escapeJs(r.reportedUser)}', ${i})">Block User</button>` : ''}
        ${r.status === 'pending' ? `<button onclick="event.stopPropagation();dismissReport(${i})">Dismiss</button>` : ''}
      </div>
    </div>
  `).join('');
}

async function setReportStatus(idx, status) {
  const r = reports[idx];
  if (!r) return;
  r.status = status;
  saveReports();
  renderAdminReports();
  if (isDbConnected() && sb && r.id) {
    try { await sb.from('reports').update({ status }).eq('id', r.id); }
    catch (e) { console.error('Update report status failed:', e); }
  }
}

function dismissReport(idx) { setReportStatus(idx, 'dismissed'); }

function viewReportedUser(name) {
  openUserProfileView(name);
}

// Blocks the reported user (same local block flag admin uses in the Users
// tab) and marks the report resolved. toggleBlockUser handles its own
// confirmation prompt, so we just check whether the block actually happened.
function blockReportedUser(name, idx) {
  let users = JSON.parse(localStorage.getItem('al-users') || '[]');
  const uIdx = users.findIndex(u => u.name === name);
  if (uIdx === -1) { showToast('Could not find that account.', { type: 'error' }); return; }
  toggleBlockUser(uIdx);
  const after = JSON.parse(localStorage.getItem('al-users') || '[]')[uIdx];
  if (after && after.blocked) setReportStatus(idx, 'resolved');
}

function toggleSubmissionSelectMode() {
  selectedSubmissionIndexes.clear();
  renderAdminSubmissions();
}

function toggleSubmissionSelect(idx, checked) {
  if (checked) selectedSubmissionIndexes.add(idx);
  else selectedSubmissionIndexes.delete(idx);
  const approveSelectedBtn = document.getElementById('sub-approve-selected-btn');
  if (approveSelectedBtn) approveSelectedBtn.textContent = `Approve Selected (${selectedSubmissionIndexes.size})`;
}

async function approveAllSubmissions() {
  const subs = submissions.slice();
  if (subs.length === 0) return;
  if (!confirm(`Approve all ${subs.length} pending submission(s)? This will add them all to the archive.`)) return;
  const count = subs.length;
  for (const sub of subs) { await addApprovedSongFromSubmission(sub); }
  saveSongs();
  submissions = [];
  saveSubmissions();
  renderSongGrid();
  renderAdminSongs();
  renderAdminSubmissions();
  document.getElementById('stat-songs').textContent = String(songs.length).padStart(2,'0');
  showToast(`${count} submission${count === 1 ? '' : 's'} approved and added to the archive!`);
}

async function approveSelectedSubmissions() {
  if (selectedSubmissionIndexes.size === 0) { showToast('No submissions selected.', {type:'error'}); return; }
  const indexesToApprove = [...selectedSubmissionIndexes].sort((a,b) => a-b);
  if (!confirm(`Approve ${indexesToApprove.length} selected submission(s)?`)) return;
  const count = indexesToApprove.length;
  for (const i of indexesToApprove) { if (submissions[i]) await addApprovedSongFromSubmission(submissions[i]); }
  saveSongs();
  submissions = submissions.filter((sub, i) => !selectedSubmissionIndexes.has(i));
  saveSubmissions();
  submissionSelectMode = false;
  selectedSubmissionIndexes.clear();
  renderSongGrid();
  renderAdminSongs();
  renderAdminSubmissions();
  document.getElementById('stat-songs').textContent = String(songs.length).padStart(2,'0');
  showToast(`${count} submission${count === 1 ? '' : 's'} approved and added to the archive!`);
}

// Adds the approved song locally AND (when connected) to the shared Supabase
// songs table + removes the reviewed row from the shared submissions queue,
// so the archive and the queue both stay in sync across every browser.
async function addApprovedSongFromSubmission(sub) {
  const moodData = MOOD_MAP[sub.mood] || MOOD_MAP['3am'];
  const songKey = '#'+String(songs.length+1).padStart(3,'0');
  const newSong = {
    number: songKey, title: sub.title, artist: sub.artist, year: sub.year, mood: sub.mood,
    moodColor: moodData.color, moodBg: moodData.bg, genre: sub.genre,
    about: sub.about, meaning: sub.meaning, lyrics: sub.lyrics, funFact: sub.funFact,
    credit: 'Submitted by ' + sub.submittedBy, spotify: sub.spotify, youtube: sub.youtube
  };
  songs.push(newSong);

  if (isDbConnected() && sb) {
    try {
      await sb.from('songs').upsert({
        song_key: newSong.number, title: newSong.title, artist: newSong.artist, year: newSong.year,
        mood: newSong.mood, about: newSong.about, meaning: newSong.meaning, lyrics: newSong.lyrics,
        credit: newSong.credit, spotify: newSong.spotify, youtube: newSong.youtube, genre: newSong.genre
      }, { onConflict: 'song_key' });
      if (sub.id) await sb.from('submissions').delete().eq('id', sub.id);
    } catch (e) { console.error('Approve: Supabase sync failed (kept locally):', e); }
  }
}

function openSubmissionDetail(idx) {
  const sub = submissions[idx];
  if (!sub) return;
  document.getElementById('sd-title').textContent = sub.title || '(untitled)';
  document.getElementById('sd-status').textContent = sub.status || 'pending';
  document.getElementById('sd-song-title').textContent = sub.title || '—';
  document.getElementById('sd-artist').textContent = sub.artist || '—';
  document.getElementById('sd-year').textContent = sub.year || '—';
  document.getElementById('sd-mood').textContent = sub.mood || '—';
  document.getElementById('sd-genres').textContent = (sub.genre && sub.genre.length) ? sub.genre.join(', ') : '—';
  const linkEl = document.getElementById('sd-link');
  if (sub.spotify) { linkEl.innerHTML = `<a href="${escapeHtml(sub.spotify)}" target="_blank" rel="noopener">${escapeHtml(sub.spotify)}</a>`; linkEl.classList.remove('empty'); }
  else { linkEl.textContent = 'No link provided'; linkEl.classList.add('empty'); }
  const ytLinkEl = document.getElementById('sd-yt-link');
  if (sub.youtube) { ytLinkEl.innerHTML = `<a href="${escapeHtml(sub.youtube)}" target="_blank" rel="noopener">${escapeHtml(sub.youtube)}</a>`; ytLinkEl.classList.remove('empty'); }
  else { ytLinkEl.textContent = 'No link provided'; ytLinkEl.classList.add('empty'); }
  const setLong = (id, text) => {
    const el = document.getElementById(id);
    if (text && text.trim()) { el.textContent = text; el.classList.remove('empty'); }
    else { el.textContent = 'Not provided'; el.classList.add('empty'); }
  };
  setLong('sd-about', sub.about);
  setLong('sd-meaning', sub.meaning);
  setLong('sd-lyrics', sub.lyrics);
  setLong('sd-funfact', sub.funFact);
  document.getElementById('sd-submitted-by').textContent = sub.submittedBy || 'Unknown';
  document.getElementById('sd-submitted-at').textContent = sub.submittedAt ? new Date(sub.submittedAt).toLocaleString() : '—';

  const approveBtn = document.getElementById('sd-approve-btn');
  const rejectBtn = document.getElementById('sd-reject-btn');
  approveBtn.onclick = () => { approveSubmission(idx); closeSubmissionDetail(); };
  rejectBtn.onclick = () => { if (confirm('Reject this submission?')) { rejectSubmission(idx); closeSubmissionDetail(); } };

  document.getElementById('submission-detail-overlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeSubmissionDetail() {
  document.getElementById('submission-detail-overlay').classList.remove('open');
  document.body.style.overflow = '';
}

function addSongFromAdmin() {
  const mood = document.getElementById('adm-song-mood').value;
  const moodData = MOOD_MAP[mood];
  const newSong = {
    number: document.getElementById('adm-song-num').value || '#'+String(songs.length+1).padStart(3,'0'),
    title: document.getElementById('adm-song-title').value,
    artist: document.getElementById('adm-song-artist').value,
    year: document.getElementById('adm-song-year').value,
    mood: mood,
    moodColor: moodData.color,
    moodBg: moodData.bg,
    genre: [document.getElementById('adm-song-genre1').value, document.getElementById('adm-song-genre2').value].filter(Boolean),
    about: document.getElementById('adm-song-about').value,
    meaning: document.getElementById('adm-song-meaning').value,
    lyrics: document.getElementById('adm-song-lyrics').value,
    funFact: document.getElementById('adm-song-funfact').value,
    credit: document.getElementById('adm-song-credit').value,
    spotify: document.getElementById('adm-song-spotify').value,
    youtube: document.getElementById('adm-song-youtube').value
  };
  songs.push(newSong);
  saveSongs();
  if (isDbConnected()) {
    sb.from('songs').upsert({
      song_key: newSong.number, title: newSong.title, artist: newSong.artist, year: newSong.year,
      mood: newSong.mood, about: newSong.about, meaning: newSong.meaning, lyrics: newSong.lyrics,
      fun_fact: newSong.funFact, credit: newSong.credit, spotify: newSong.spotify, youtube: newSong.youtube, genre: newSong.genre
    }, { onConflict: 'song_key' }).then(() => {});
  }
  renderSongGrid();
  renderAdminSongs();
  document.getElementById('adm-song-num').value = '';
  document.getElementById('adm-song-title').value = '';
  document.getElementById('adm-song-artist').value = '';
  document.getElementById('adm-song-year').value = '';
  document.getElementById('adm-song-about').value = '';
  document.getElementById('adm-song-meaning').value = '';
  document.getElementById('adm-song-lyrics').value = '';
  document.getElementById('adm-song-funfact').value = '';
  document.getElementById('adm-song-credit').value = '';
  document.getElementById('adm-song-spotify').value = '';
  document.getElementById('adm-song-youtube').value = '';
  document.getElementById('adm-song-genre1').value = '';
  document.getElementById('adm-song-genre2').value = '';
  showToast('Song added!');
}

function deleteSong(idx) {
  if (!confirm('Delete this song?')) return;
  const songKey = songs[idx].number;
  songs.splice(idx, 1);
  saveSongs();
  if (isDbConnected()) {
    sb.from('songs').delete().eq('song_key', songKey).then(() => {});
  }
  renderSongGrid();
  renderAdminSongs();
}

function editSong(idx) {
  const s = songs[idx];
  document.getElementById('adm-song-num').value = s.number;
  document.getElementById('adm-song-title').value = s.title;
  document.getElementById('adm-song-artist').value = s.artist;
  document.getElementById('adm-song-year').value = s.year;
  document.getElementById('adm-song-mood').value = s.mood;
  document.getElementById('adm-song-about').value = s.about;
  document.getElementById('adm-song-meaning').value = s.meaning;
  document.getElementById('adm-song-lyrics').value = s.lyrics;
  document.getElementById('adm-song-funfact').value = s.funFact || '';
  document.getElementById('adm-song-credit').value = s.credit;
  document.getElementById('adm-song-spotify').value = s.spotify;
  document.getElementById('adm-song-youtube').value = s.youtube || '';
  document.getElementById('adm-song-genre1').value = s.genre[0] || '';
  document.getElementById('adm-song-genre2').value = s.genre[1] || '';
  songs.splice(idx, 1);
  saveSongs();
  showAdminTab('add');
}

async function approveSubmission(idx) {
  const sub = submissions[idx];
  if (!sub) return;
  await addApprovedSongFromSubmission(sub);
  saveSongs();
  submissions.splice(idx, 1);
  saveSubmissions();
  renderSongGrid();
  renderAdminSongs();
  renderAdminSubmissions();
  document.getElementById('stat-songs').textContent = String(songs.length).padStart(2,'0');
  showToast(`"${sub.title || 'Song'}" approved and added to the archive!`);
  if (sub.submittedBy) {
    notifyUser(sub.submittedBy, 'submission_approved', `Your submission "${sub.title || 'Song'}" was approved! 🎉`, "It's now live in the archive.", 'home', null, null);
  }
}

async function rejectSubmission(idx) {
  const sub = submissions[idx];
  if (!sub) return;
  submissions.splice(idx, 1);
  saveSubmissions();
  if (isDbConnected() && sb && sub.id) {
    try { await sb.from('submissions').delete().eq('id', sub.id); }
    catch (e) { console.error('Reject: Supabase delete failed:', e); }
  }
  renderAdminSubmissions();
  if (sub.submittedBy) {
    notifyUser(sub.submittedBy, 'submission_rejected', `Your submission "${sub.title || 'Song'}" wasn't approved`, "It didn't make the cut this time — feel free to try another.", 'submit', null, null);
  }
}

// ═══════════════════════════════════════════════════════════════
//  ADMIN ACCESS CODE (5-click logo)
// ═══════════════════════════════════════════════════════════════

let logoClickCount = 0;
let logoClickTimer = null;
const LOGO_TAP_MAX_GAP_MS = 400; // taps must land back-to-back — any pause longer than this resets the count

document.querySelector('.logo').addEventListener('click', (e) => {
  logoClickCount++;
  if (logoClickTimer) clearTimeout(logoClickTimer);
  logoClickTimer = setTimeout(() => { logoClickCount = 0; }, LOGO_TAP_MAX_GAP_MS);
  if (logoClickCount === 5) {
    e.preventDefault();
    logoClickCount = 0;
    clearTimeout(logoClickTimer);
    showAdminCodeOverlay();
  }
});

function showAdminCodeOverlay() {
  document.getElementById('admin-code-overlay').classList.add('open');
  document.body.style.overflow = 'hidden';
  const input = document.getElementById('admin-access-code');
  if (input) { input.value = ''; input.focus(); }
}

async function verifyAdminCode() {
  const input = document.getElementById('admin-access-code');
  const code = input ? input.value.trim() : '';
  const err = document.getElementById('ac-error');
  const [enteredHash, storedHash] = [await hashText(code), await getAdminCodeHash()];
  if (enteredHash !== storedHash) {
    if (err) { err.textContent = 'Invalid access code.'; err.style.display = 'block'; }
    return;
  }
  closeAuth();
  showAdminLogin();
}

// ═══════════════════════════════════════════════════════════════
//  GENRE MANAGEMENT (ADMIN)
// ═══════════════════════════════════════════════════════════════

function getGenres() {
  const raw = localStorage.getItem('al-genres');
  if (raw) return JSON.parse(raw);
  const defaults = ["Indie Pop", "Art Pop", "Indie Folk", "Alternative", "Piano Ballad", "Chamber Pop", "Indie Rock", "Alt Folk", "Post-Punk"];
  localStorage.setItem('al-genres', JSON.stringify(defaults));
  return defaults;
}

function saveGenres(genres) {
  localStorage.setItem('al-genres', JSON.stringify(genres));
  if (isDbConnected()) {
    sb.from('genres').delete().neq('name', '__never__').then(() => {
      const rows = genres.map(g => ({ name: g }));
      if (rows.length) sb.from('genres').insert(rows).then(() => {});
    });
  }
}

function renderAdminGenres() {
  const list = document.getElementById('admin-genres-list');
  if (!list) return;
  const genres = getGenres();
  if (genres.length === 0) {
    list.innerHTML = '<p style="color:var(--muted);font-family:var(--mono);font-size:12px;">No genres defined yet.</p>';
    return;
  }
  list.innerHTML = genres.map((g, i) => `
    <div class="admin-song-row">
      <div class="song-info">${escapeHtml(g)}</div>
      <div class="actions">
        <button class="edit-btn" onclick="editGenre(${i})">Edit</button>
        <button onclick="deleteGenre(${i})">Delete</button>
      </div>
    </div>
  `).join('');
}

function addGenre() {
  const input = document.getElementById('adm-new-genre');
  if (!input) return;
  const name = input.value.trim();
  if (!name) { showToast('Enter a genre name.', {type:'error'}); return; }
  const genres = getGenres();
  if (genres.find(g => g.toLowerCase() === name.toLowerCase())) { showToast('Genre already exists.', {type:'error'}); return; }
  genres.push(name);
  saveGenres(genres);
  input.value = '';
  renderAdminGenres();
  updateHomeStats();
}

function editGenre(idx) {
  const genres = getGenres();
  const newName = prompt('Rename genre:', genres[idx]);
  if (!newName || !newName.trim()) return;
  const trimmed = newName.trim();
  if (genres.find((g, i) => i !== idx && g.toLowerCase() === trimmed.toLowerCase())) {
    showToast('Genre already exists.', {type:'error'}); return;
  }
  genres[idx] = trimmed;
  saveGenres(genres);
  renderAdminGenres();
}

function deleteGenre(idx) {
  if (!confirm('Delete this genre?')) return;
  const genres = getGenres();
  genres.splice(idx, 1);
  saveGenres(genres);
  renderAdminGenres();
  updateHomeStats();
}

// ═══════════════════════════════════════════════════════════════
//  MOOD MANAGEMENT (ADMIN)
// ═══════════════════════════════════════════════════════════════

function renderAdminMoods() {
  const list = document.getElementById('admin-moods-list');
  if (!list) return;
  const keys = Object.keys(MOOD_MAP);
  if (keys.length === 0) {
    list.innerHTML = '<p style="color:var(--muted);font-family:var(--mono);font-size:12px;">No moods defined yet.</p>';
    return;
  }
  list.innerHTML = keys.map(key => {
    const m = MOOD_MAP[key];
    return `
    <div class="admin-song-row">
      <div class="song-info" style="display:flex;align-items:center;gap:10px;">
        <span style="width:14px;height:14px;border-radius:50%;background:${m.color};flex-shrink:0;border:1px solid var(--border2);"></span>
        <span>${escapeHtml(m.label)}</span>
        <span style="font-family:var(--mono);font-size:10px;color:var(--muted);">#${escapeHtml(key)}</span>
      </div>
      <div class="actions">
        <button class="edit-btn" onclick="editMood('${key}')">Edit</button>
        <button onclick="deleteMood('${key}')">Delete</button>
      </div>
    </div>
  `;
  }).join('');
}

function addMood() {
  const keyInput = document.getElementById('adm-new-mood-key');
  const labelInput = document.getElementById('adm-new-mood-label');
  const colorInput = document.getElementById('adm-new-mood-color');
  const key = keyInput.value.trim().toLowerCase().replace(/\s+/g, '-');
  const label = labelInput.value.trim();
  const color = colorInput.value;
  if (!key || !label) { showToast('Enter both a mood key and a display label.', {type:'error'}); return; }
  if (MOOD_MAP[key]) { showToast('A mood with that key already exists.', {type:'error'}); return; }
  MOOD_MAP[key] = { label, color, bg: hexToRgba(color, 0.12) };
  saveMoodMap(MOOD_MAP);
  keyInput.value = ''; labelInput.value = ''; colorInput.value = '#C8A96E';
  renderAdminMoods();
  renderMoodBar();
}

function editMood(key) {
  const m = MOOD_MAP[key];
  if (!m) return;
  const newLabel = prompt('Rename mood label:', m.label);
  if (newLabel === null || !newLabel.trim()) return;
  const newColor = prompt('Set hex color (e.g. #C8A96E):', m.color) || m.color;
  MOOD_MAP[key] = { label: newLabel.trim(), color: newColor, bg: hexToRgba(newColor, 0.12) };
  saveMoodMap(MOOD_MAP);
  renderAdminMoods();
  renderMoodBar();
  renderSongGrid();
}

function deleteMood(key) {
  if (!confirm('Delete this mood? Songs using it will fall back to the first available mood.')) return;
  delete MOOD_MAP[key];
  saveMoodMap(MOOD_MAP);
  renderAdminMoods();
  renderMoodBar();
}

function hexToRgba(hex, alpha) {
  hex = hex.replace('#', '');
  if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
  const r = parseInt(hex.substring(0,2), 16);
  const g = parseInt(hex.substring(2,4), 16);
  const b = parseInt(hex.substring(4,6), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

// ═══════════════════════════════════════════════════════════════


// ═══════════════════════════════════════════════════════════════
//  SAFETY & BOTS — status dashboard
//
//  The panel used to have no way of telling you what was actually
//  running. A switch could be ON while the Edge Function it depends on
//  had never been deployed, and nothing anywhere said so — you found out
//  when signups started silently failing. This checks each dependency
//  for real and reports it in plain language.
// ═══════════════════════════════════════════════════════════════

function toggleModerationFromSafety() {
  const cb = document.getElementById('adm-moderation-enabled-safety');
  if (!cb) return;
  setModerationEnabled(cb.checked);
  refreshSafetyStatus();
}

function safetyStatusRow(label, state, detail) {
  const cls = state === 'on' ? 'is-on' : state === 'warn' ? 'is-warn' : 'is-off';
  const icon = state === 'on' ? '✓' : state === 'warn' ? '!' : '○';
  return '<div style="display:flex;align-items:flex-start;gap:10px;flex-wrap:wrap;">' +
    '<span class="setup-status ' + cls + '" style="margin-top:0;flex:0 0 auto;">' + icon + ' ' + escapeHtml(label) + '</span>' +
    '<span style="font-family:var(--sans);font-size:12px;color:var(--dim);line-height:1.6;flex:1;min-width:200px;">' +
    escapeHtml(detail) + '</span></div>';
}

async function refreshSafetyStatus() {
  const el = document.getElementById('safety-status-readout');
  if (!el) return;
  el.innerHTML = '<div style="font-family:var(--mono);font-size:11px;color:var(--muted);">Checking…</div>';

  const rows = [];

  // Database — everything else depends on it.
  if (isDbConnected()) {
    rows.push(safetyStatusRow('Database', 'on', 'Connected to Supabase. Both systems can reach their Edge Functions.'));
  } else {
    rows.push(safetyStatusRow('Database', 'warn', 'Not connected. Neither Turnstile nor AI moderation can work until you connect Supabase in the Database tab.'));
  }

  // Turnstile.
  const tsOn = isTurnstileEnabledCached();
  const tsKey = getTurnstileSiteKeyCached();
  if (!tsOn) {
    rows.push(safetyStatusRow('Turnstile', 'off', 'Switched off. The invisible honeypot field still catches simple bots — this is a safe state to leave it in.'));
  } else if (!tsKey) {
    rows.push(safetyStatusRow('Turnstile', 'warn', 'Switched on but no Site Key saved (step 2). The widget will not render and signups will be blocked.'));
  } else if (!isDbConnected()) {
    rows.push(safetyStatusRow('Turnstile', 'warn', 'Switched on but Supabase is not connected, so tokens cannot be verified. Signups will fail — turn it off or connect a database.'));
  } else {
    // Actually call the function rather than assuming it exists.
    let fnOk = false, fnMsg = '';
    try {
      const { error } = await sb.functions.invoke('verify-turnstile', { body: { token: 'status-probe' } });
      if (error && /not found|404/i.test(error.message || '')) fnMsg = 'the verify-turnstile function is not deployed yet (step 4)';
      else fnOk = true;
    } catch (e) { fnMsg = 'could not reach verify-turnstile (' + (e.message || 'network error') + ')'; }
    rows.push(fnOk
      ? safetyStatusRow('Turnstile', 'on', 'On, Site Key saved, and the verify-turnstile function responded. Signups are protected.')
      : safetyStatusRow('Turnstile', 'warn', 'On, but ' + fnMsg + '. ' + (isTurnstileStrictMode() ? 'Strict mode is ON, so NOBODY can sign up right now — deploy the function or turn strict mode off.' : 'Strict mode is off, so signups are being let through without the check for now.')));
  }

  // Moderation.
  const modOn = isModerationEnabledCached();
  if (!modOn) {
    rows.push(safetyStatusRow('AI Moderation', 'off', 'Switched off. Chat and DM messages post without being screened.'));
  } else if (!isDbConnected()) {
    rows.push(safetyStatusRow('AI Moderation', 'warn', 'Switched on but Supabase is not connected. Messages are allowed through unchecked rather than chat breaking.'));
  } else {
    let fnOk = false, fnMsg = '';
    try {
      const { data, error } = await sb.functions.invoke('moderate-message', { body: { text: 'hello', context: 'status-probe' } });
      if (error && /not found|404/i.test(error.message || '')) fnMsg = 'the moderate-message function is not deployed yet (step 2)';
      else if (data) fnOk = true;
      else fnMsg = 'the function responded but returned nothing usable';
    } catch (e) { fnMsg = 'could not reach moderate-message (' + (e.message || 'network error') + ')'; }
    rows.push(fnOk
      ? safetyStatusRow('AI Moderation', 'on', 'On and the moderate-message function responded. Messages are being screened.')
      : safetyStatusRow('AI Moderation', 'warn', 'On, but ' + fnMsg + '. Messages are currently posting unchecked.'));
  }

  // Always-on protections worth naming, so it's clear you are not unprotected
  // just because both switches are off.
  rows.push(safetyStatusRow('Always on', 'on',
    'Honeypot field on signup, per-message send cooldowns, database-level rate limits (1 message/second per person), message length caps, and row-level security on every table.'));

  el.innerHTML = rows.join('<div style="height:2px;"></div>');
}
