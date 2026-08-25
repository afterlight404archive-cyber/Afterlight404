function backfillFriendCodes() {
  let users = JSON.parse(alGet('al-users') || '[]');
  let changed = false;
  const used = new Set(users.map(u => u.code).filter(Boolean));
  users.forEach(u => {
    if (!u.code) {
      u.code = generateFriendCode(used);
      used.add(u.code);
      changed = true;
    }
  });
  if (changed) alSet('al-users', JSON.stringify(users));
}

// ── OWNER ACCOUNT (gold frame / crown / ban powers) ──────────────────────
// A single @username, set from Admin → Site Settings, gets a special look
// and moderation powers everywhere their name or avatar shows up on-site.
function generateFriendCode(usedSet) {
  let code;
  let attempts = 0;
  do {
    const n = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
    code = '#' + n.slice(0, 3) + '-' + n.slice(3);
    attempts++;
  } while (usedSet && usedSet.has(code) && attempts < 50);
  return code;
}

function getUserCode(name) {
  const users = JSON.parse(alGet('al-users') || '[]');
  const u = users.find(x => x.name === name);
  return u ? u.code : null;
}

//  PROFILE DROPDOWN & DEVICE MODE
// ═══════════════════════════════════════════════════════════════

function toggleProfileMenu(e) {
  e.stopPropagation();
  const menu = document.getElementById('profile-menu');
  if (!menu) return;
  const dd = document.getElementById('notif-dropdown');
  if (dd) dd.classList.remove('open');
  const opening = !menu.classList.contains('open');
  menu.classList.toggle('open');
  if (opening) positionFloatingDropdown(menu, menu.closest('.profile-dropdown'));
}

function closeProfileMenu() {
  const menu = document.getElementById('profile-menu');
  if (menu) menu.classList.remove('open');
}

document.addEventListener('click', (e) => {
  const menu = document.getElementById('profile-menu');
  if (menu && !e.target.closest('.profile-dropdown')) {
    menu.classList.remove('open');
  }
});

function setDeviceMode(mode) {
  const html = document.documentElement;
  if (mode === 'auto') {
    html.removeAttribute('data-device');
    alRemove('al-device-mode');
  } else {
    html.setAttribute('data-device', mode);
    alSet('al-device-mode', mode);
  }
  updateDeviceModeUI();
}

function updateDeviceModeUI() {
  const mode = alGet('al-device-mode') || 'auto';
  const order = ['auto', 'mobile', 'tablet', 'desktop'];
  order.forEach(m => {
    const btn = document.getElementById('mode-' + m);
    if (btn) btn.classList.toggle('device-mode-active', m === mode);
  });
  const glider = document.getElementById('device-toggle-glider');
  if (glider) {
    const idx = order.indexOf(mode);
    glider.style.transform = `translateX(${idx * 38}px)`;
  }
}

function initDeviceMode() {
  // No saved preference = automatic: let the page respond naturally to the
  // visitor's actual screen size (phone -> Mobile UI, desktop -> Desktop UI).
  // A saved preference means the user explicitly forced a preview mode in Settings.
  const saved = alGet('al-device-mode');
  if (saved) document.documentElement.setAttribute('data-device', saved);
  else document.documentElement.removeAttribute('data-device');
  updateDeviceModeUI();
}

// ═══════════════════════════════════════════════════════════════
//  SOCIAL — FRIENDS & DIRECT MESSAGES
// ═══════════════════════════════════════════════════════════════
//
//  Storage model mirrors the rest of the app: everything is written to
//  localStorage first (so the site always works standalone), and mirrored
//  to Supabase when a database is connected so friend requests/DMs work
//  across different browsers & devices. Usernames are the only identifier
//  (there's no server-side auth), so — same as chat — treat this as a
//  friendly, good-faith system rather than a hardened private inbox.

function pairKey(a, b) {
  return [a, b].map(s => s.toLowerCase()).sort().join('__');
}

function yourCodeBoxHTML(code) {
  if (!code) return '';
  return `<span>Your code: <span class="fyc-code" onclick="copyFriendCode('${escapeJs(code)}', this)">${escapeHtml(code)}</span></span>
          <button class="fyc-copy" onclick="copyFriendCode('${escapeJs(code)}', this)">Copy</button>`;
}

function copyFriendCode(code, el) {
  const flash = () => {
    if (!el) return;
    const orig = el.textContent;
    el.textContent = 'Copied!';
    setTimeout(() => { el.textContent = orig; }, 1400);
  };
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(code).then(flash).catch(() => { fallbackCopy(code, null); flash(); });
  } else {
    fallbackCopy(code, null);
    flash();
  }
}

// ---- local storage ----
function getFriendRequests() {
  return JSON.parse(alGet('al-friend-requests') || '[]');
}
function saveFriendRequests(list) {
  alSet('al-friend-requests', JSON.stringify(list));
}
function getDmMessages(withUser) {
  const raw = alGet('al-dm-' + pairKey(currentUser.name, withUser));
  return raw ? JSON.parse(raw) : [];
}
function saveDmMessages(withUser, msgs) {
  alSet('al-dm-' + pairKey(currentUser.name, withUser), JSON.stringify(msgs));
}
function getDmReadMap() {
  return JSON.parse(alGet('al-dm-read') || '{}');
}
function markDmRead(withUser) {
  if (!currentUser) return;
  const map = getDmReadMap();
  map[pairKey(currentUser.name, withUser)] = Date.now();
  alSet('al-dm-read', JSON.stringify(map));
}
function getDmPreview(withUser) {
  const msgs = getDmMessages(withUser);
  if (!msgs.length) return { text: '', time: 0, unread: 0, mine: false };
  const last = msgs[msgs.length - 1];
  const readMap = getDmReadMap();
  const readAt = readMap[pairKey(currentUser.name, withUser)] || 0;
  const unread = msgs.filter(m => m.from !== currentUser.name && m.time > readAt).length;
  const text = last.songKey ? '🎵 Shared a song' : (last.gifUrl ? '🖼️ Sent a GIF' : (last.text || ''));
  return { text, time: last.time, unread, mine: last.from === currentUser.name };
}
function formatDmRowTime(ts) {
  const d = new Date(ts), now = new Date();
  if (d.toDateString() === now.toDateString()) return d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  const diffDays = Math.floor((now - d) / 86400000);
  if (diffDays < 7) return d.toLocaleDateString([], { weekday: 'short' });
  return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
}

// Friends = accepted requests involving currentUser
function getFriendsList() {
  if (!currentUser) return [];
  const reqs = getFriendRequests();
  const names = new Set();
  reqs.forEach(r => {
    if (r.status !== 'accepted') return;
    if (r.from === currentUser.name) names.add(r.to);
    if (r.to === currentUser.name) names.add(r.from);
  });
  return Array.from(names).sort((a, b) => a.localeCompare(b));
}
function getIncomingRequests() {
  if (!currentUser) return [];
  return getFriendRequests().filter(r => r.to === currentUser.name && r.status === 'pending');
}
function getOutgoingRequests() {
  if (!currentUser) return [];
  return getFriendRequests().filter(r => r.from === currentUser.name && r.status === 'pending');
}
function areFriends(name) {
  return getFriendsList().some(n => n.toLowerCase() === name.toLowerCase());
}
function friendshipStatusWith(name) {
  if (!currentUser || name.toLowerCase() === currentUser.name.toLowerCase()) return 'self';
  const reqs = getFriendRequests();
  const accepted = reqs.find(r => r.status === 'accepted' &&
    ((r.from === currentUser.name && r.to === name) || (r.to === currentUser.name && r.from === name)));
  if (accepted) return 'friends';
  const outPending = reqs.find(r => r.status === 'pending' && r.from === currentUser.name && r.to === name);
  if (outPending) return 'pending-outgoing';
  const inPending = reqs.find(r => r.status === 'pending' && r.to === currentUser.name && r.from === name);
  if (inPending) return 'pending-incoming';
  return 'none';
}

// ---- Supabase mirror ----
// Pushes this browser's profile up AND claims ownership of the alias for the current
// session (owner_id), which is what the database now checks before letting this
// browser send chat messages, DMs, or friend requests, or edit this profile again.
async function pushUserProfile() {
  if (!isDbConnected() || !currentUser) return;

  let ownerId = null;
  try {
    const { data } = await sb.auth.getSession();
    ownerId = data && data.session ? data.session.user.id : null;
  } catch (e) { console.error('Could not read Supabase session:', e); }
  if (!ownerId) return; // no session established — skip rather than write an unowned row
  const rec = getCurrentUserRecord() || {};
  sb.from('users').upsert({ username: currentUser.name, code: rec.code || null, bio: rec.bio || '', gender: rec.gender || '', avatar: rec.avatar || null, owner_id: ownerId }, { onConflict: 'username' }).then(() => {});
}

function normalizeCodeQuery(q) {
  // turns "047382", "#047-382", "047-382" etc into the canonical "#047-382" form
  const digits = q.replace(/[^0-9]/g, '');
  if (digits.length !== 6) return null;
  return '#' + digits.slice(0, 3) + '-' + digits.slice(3);
}

async function searchUsersRemote(query) {
  const q = query.trim();
  if (!q) return [];
  const asCode = normalizeCodeQuery(q);
  if (isDbConnected()) {
    try {
      let data;
      if (asCode) {
        const res = await sb.from('users').select('username,code').eq('code', asCode).limit(5);
        data = res.data;
      } else {
        const res = await sb.from('users').select('username,code').ilike('username', '%' + q + '%').limit(20);
        data = res.data;
      }
      if (data) return data
        .filter(d => !currentUser || d.username.toLowerCase() !== currentUser.name.toLowerCase())
        .map(d => ({ name: d.username, code: d.code }));
    } catch (e) { console.error('User search failed:', e); }
  }
  // local fallback (local-only mode, or supabase not connected)
  const local = JSON.parse(alGet('al-users') || '[]');
  return local
    .filter(u => asCode ? u.code === asCode : u.name.toLowerCase().includes(q.toLowerCase()))
    .filter(u => !currentUser || u.name.toLowerCase() !== currentUser.name.toLowerCase())
    .map(u => ({ name: u.name, code: u.code }));
}

async function pullFriendRequests() {
  if (!isDbConnected() || !currentUser) return;

  try {
    const { data } = await sb.from('friend_requests').select('*')
      .or('from_user.eq.' + currentUser.name + ',to_user.eq.' + currentUser.name);
    if (data) {
      const mapped = data.map(r => ({ id: 'fr_' + r.id, from: r.from_user, to: r.to_user, status: r.status, time: new Date(r.created_at).getTime() }));
      // merge with any purely-local requests that haven't synced yet, avoiding dupes
      const local = getFriendRequests().filter(r => !String(r.id).startsWith('fr_'));
      saveFriendRequests(mapped.concat(local));
    }
  } catch (e) { console.error('Friend request sync failed:', e); }
}

async function pullDmMessages(withUser) {
  if (!isDbConnected() || !currentUser) return;

  try {
    const key = pairKey(currentUser.name, withUser);
    const { data } = await sb.from('dm_messages').select('*').eq('pair_key', key).order('created_at', { ascending: true });
    if (data) {
      const msgs = data.map(m => ({
        id: 'dm_' + m.id, from: m.sender, to: m.recipient, text: m.text, songKey: m.song_key, gifUrl: m.gif_url || null,
        time: new Date(m.created_at).getTime(),
        replyTo: m.reply_to != null ? 'dm_' + m.reply_to : null,
        reactions: m.reactions || {}
      }));
      saveDmMessages(withUser, msgs);
    }
  } catch (e) { console.error('DM sync failed:', e); }
}

// ---- friend actions ----
async function searchFriendUsers() {
  const input = document.getElementById('friend-search-input');
  const resultsEl = document.getElementById('friend-search-results');
  const q = input.value.trim();
  if (!q) { resultsEl.innerHTML = ''; return; }
  resultsEl.innerHTML = '<p class="friends-empty">Searching…</p>';
  const results = await searchUsersRemote(q);
  if (results.length === 0) {
    resultsEl.innerHTML = '<p class="friends-empty">No users found matching "' + escapeHtml(q) + '".</p>';
    return;
  }
  resultsEl.innerHTML = results.map(r => friendRowHTML(r.name, r.code)).join('');
}

// Small colored dot overlaid on an avatar showing online/away status.
// Omits the dot entirely when we can't see them (offline / not connected) —
// no dot is more honest than a fake gray "offline" dot for someone we have
// no real data on.
function presenceDotHTML(name) {
  const p = getFriendPresence(name);
  if (p === 'offline') return '';
  return `<span class="presence-dot ${p}"></span>`;
}

function friendRowHTML(name, code) {
  const initials = escapeHtml(name.slice(0, 2).toUpperCase());
  const status = friendshipStatusWith(name);
  const displayCode = code || getUserCode(name);
  let actions = '';
  if (status === 'friends') {
    actions = `<button class="primary" onclick="openDm('${escapeJs(name)}')">Message</button>
               <button class="danger" onclick="removeFriend('${escapeJs(name)}')">Remove</button>`;
  } else if (status === 'pending-outgoing') {
    actions = `<button disabled style="opacity:0.5;cursor:default;">Requested</button>`;
  } else if (status === 'pending-incoming') {
    actions = `<button class="primary" onclick="respondFriendRequest('${escapeJs(name)}',true)">Accept</button>
               <button class="danger" onclick="respondFriendRequest('${escapeJs(name)}',false)">Decline</button>`;
  } else {
    actions = `<button class="primary" onclick="sendFriendRequest('${escapeJs(name)}')">Add Friend</button>`;
  }
  return `
    <div class="friend-row" data-user="${escapeHtml(name)}">
      <div class="friend-row-avatar${ownerFrameClass(name)}" onclick="openUserProfileView('${escapeJs(name)}','${escapeJs(displayCode || '')}')">${initials}${ownerCrownHTML(name)}${status === 'friends' ? presenceDotHTML(name) : ''}</div>
      <div class="friend-row-info">
        <div class="friend-row-name" onclick="openUserProfileView('${escapeJs(name)}','${escapeJs(displayCode || '')}')">@${escapeHtml(name)}${displayCode ? `<span class="frn-code">${escapeHtml(displayCode)}</span>` : ''} ${ownerTagHTML(name)}</div>
        <div class="friend-row-sub">${status === 'friends' ? 'Friends' : status === 'pending-outgoing' ? 'Request sent' : status === 'pending-incoming' ? 'Wants to be friends' : ''}</div>
      </div>
      <div class="friend-row-actions">${actions}</div>
    </div>`;
}

// ---- profile view (tap an avatar/name anywhere to see someone's code + bio) ----
async function openUserProfileView(name, knownCode) {
  const avatarEl = document.getElementById('profile-view-avatar');
  avatarEl.className = 'profile-view-avatar' + ownerFrameClass(name);
  avatarEl.innerHTML = escapeHtml(name.slice(0, 2).toUpperCase()) + ownerCrownHTML(name);
  document.getElementById('profile-view-name').innerHTML = '@' + escapeHtml(name) + ' ' + ownerTagHTML(name);
  document.getElementById('profile-view-code').textContent = 'Loading…';
  document.getElementById('profile-view-bio').textContent = '';
  const status = friendshipStatusWith(name);
  const actionsEl = document.getElementById('profile-view-actions');
  let actionsHtml = status === 'friends'
    ? `<button class="primary" onclick="closeUserProfileView();openDm('${escapeJs(name)}')">Message</button>`
    : status === 'none' ? `<button class="primary" onclick="sendFriendRequest('${escapeJs(name)}');closeUserProfileView();">Add Friend</button>` : '';
  // Anyone logged in can report someone else's profile (not their own).
  if (currentUser && currentUser.name !== name) {
    actionsHtml += `<button class="danger" onclick="openReportModal('${escapeJs(name)}','profile',null)">Report User</button>`;
  }
  // Owner-only moderation control, hidden for everyone else and for the owner's own card.
  const showBanControl = currentUserIsOwner() && !isOwnerName(name);
  if (showBanControl) {
    const users = JSON.parse(alGet('al-users') || '[]');
    const target = users.find(u => u.name === name);
    const banned = !!(target && target.blocked);
    actionsHtml += `<button class="owner-ban-btn${banned ? ' is-banned' : ''}" id="profile-ban-btn" onclick="ownerToggleBanUser('${escapeJs(name)}')">${banned ? 'Unban User' : 'Ban User'}</button>`;
  }
  actionsEl.innerHTML = actionsHtml;

  document.getElementById('user-profile-overlay').classList.add('open');
  document.body.style.overflow = 'hidden';

  let code = knownCode || getUserCode(name) || null;
  let bio = '', gender = '';
  const localRec = JSON.parse(alGet('al-users') || '[]').find(u => u.name === name);
  if (localRec) { bio = localRec.bio || ''; gender = localRec.gender || ''; if (!code) code = localRec.code; }
  if (isDbConnected() && (!code || !localRec || showBanControl)) {
    try {
      const { data } = await sb.from('users').select('code,bio,gender,blocked').eq('username', name).limit(1);
      if (data && data[0]) {
        code = code || data[0].code; bio = bio || data[0].bio || ''; gender = gender || data[0].gender || '';
        // Ban button can be stale if the block/unban happened on another device — true
        // it up against the server before the owner acts on it.
        if (showBanControl) {
          let users = JSON.parse(alGet('al-users') || '[]');
          const i = users.findIndex(u => u.name === name);
          if (i !== -1) { users[i] = { ...users[i], blocked: !!data[0].blocked }; alSet('al-users', JSON.stringify(users)); }
          const btn = document.getElementById('profile-ban-btn');
          if (btn) {
            const banned = !!data[0].blocked;
            btn.textContent = banned ? 'Unban User' : 'Ban User';
            btn.className = 'owner-ban-btn' + (banned ? ' is-banned' : '');
          }
        }
      }
    } catch (e) { console.error('Profile lookup failed:', e); }
  }
  document.getElementById('profile-view-code').textContent = code || '— no code on record —';
  document.getElementById('profile-view-bio').textContent = bio || (gender ? '' : 'No bio yet.');

  const uploaded = songs.filter(s => getSongUploader(s) === name);
  const songsWrap = document.getElementById('profile-view-songs-wrap');
  const songsList = document.getElementById('profile-view-songs-list');
  if (uploaded.length === 0) {
    songsWrap.style.display = 'none';
  } else {
    songsWrap.style.display = '';
    songsList.innerHTML = uploaded.map(s => `
      <div class="dm-song-card" onclick="closeUserProfileView();openSongModalByNumber('${escapeJs(s.number)}')">
        <div class="dsc-note">♪</div>
        <div class="dsc-info">
          <div class="dsc-title">${escapeHtml(s.title)}</div>
          <div class="dsc-artist">${escapeHtml(s.artist)}</div>
        </div>
      </div>`).join('');
  }
}
function closeUserProfileView() {
  document.getElementById('user-profile-overlay').classList.remove('open');
  document.body.style.overflow = '';
}

function escapeJs(s) {
  return String(s).replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

async function sendFriendRequest(name) {
  if (!currentUser || name.toLowerCase() === currentUser.name.toLowerCase()) return;
  const reqs = getFriendRequests();
  if (reqs.find(r => r.status !== 'declined' &&
      ((r.from === currentUser.name && r.to === name) || (r.to === currentUser.name && r.from === name)))) {
    renderFriendsPage(); return;
  }
  const newReq = { id: 'local_' + Date.now(), from: currentUser.name, to: name, status: 'pending', time: Date.now() };
  reqs.push(newReq);
  saveFriendRequests(reqs);
  if (isDbConnected()) {
    sb.from('friend_requests').insert({ from_user: currentUser.name, to_user: name, status: 'pending' }).then(({ error }) => {
      if (error) { showToast('Friend request saved on this device, but failed to sync: ' + error.message, {type:'error'}); return; }
      pullFriendRequests().then(renderFriendsPage);
    });
    notifyUser(name, 'friend_request', '@' + currentUser.name + ' sent you a friend request', null, 'friends', null, currentUser.name);
  }
  showToast('Friend request sent to @' + name + '.');
  renderFriendsPage();
}

async function respondFriendRequest(fromName, accept) {
  if (!currentUser) return;
  let reqs = getFriendRequests();
  const req = reqs.find(r => r.status === 'pending' && r.to === currentUser.name && r.from === fromName);
  if (!req) return;
  req.status = accept ? 'accepted' : 'declined';
  saveFriendRequests(reqs);
  if (isDbConnected() && String(req.id).startsWith('fr_')) {
    const rowId = req.id.replace('fr_', '');
    sb.from('friend_requests').update({ status: req.status }).eq('id', rowId).then(() => {});
  } else if (isDbConnected()) {
    // request was created locally and may not have synced with an id yet — best effort update by names
    sb.from('friend_requests').update({ status: req.status }).eq('from_user', fromName).eq('to_user', currentUser.name).then(() => {});
  }
  if (accept) {
    notifyUser(fromName, 'friend_accept', '@' + currentUser.name + ' accepted your friend request', null, 'dm', currentUser.name, currentUser.name);
  }
  renderFriendsPage();
  updateSocialBadge();
}

async function removeFriend(name) {
  if (!confirm('Remove @' + name + ' as a friend?')) return;
  let reqs = getFriendRequests();
  reqs = reqs.filter(r => !((r.from === currentUser.name && r.to === name) || (r.to === currentUser.name && r.from === name)));
  saveFriendRequests(reqs);
  if (isDbConnected()) {
    sb.from('friend_requests').delete()
      .or(`and(from_user.eq.${currentUser.name},to_user.eq.${name}),and(from_user.eq.${name},to_user.eq.${currentUser.name})`).then(() => {});
  }
  renderFriendsPage();
}

// ---- rendering ----
function initSocialHub() {
  const wall = document.getElementById('social-login-wall');
  const body = document.getElementById('social-hub-body');
  if (!currentUser) {
    wall.style.display = 'block'; body.style.display = 'none';
    return;
  }
  wall.style.display = 'none'; body.style.display = 'block';
  pullFriendRequests().then(() => {
    updateSocialBadge();
    renderSocialHubPreview();
  });
  renderSocialHubPreview();
  startSocialPolling();
}

function renderSocialHubPreview() {
  const friends = getFriendsList();
  const incoming = getIncomingRequests();
  const badge = document.getElementById('social-hub-friend-badge');
  if (badge) {
    if (incoming.length > 0) { badge.style.display = 'inline-block'; badge.textContent = incoming.length; }
    else badge.style.display = 'none';
  }
  const preview = document.getElementById('social-hub-friends-preview');
  const viewAll = document.getElementById('social-hub-view-all');
  if (!preview) return;
  if (friends.length === 0) {
    preview.innerHTML = '<p class="friends-empty">You haven\'t added any friends yet — head to Friends to find people.</p>';
    if (viewAll) viewAll.style.display = 'none';
    return;
  }
  if (viewAll) viewAll.style.display = 'block';
  preview.innerHTML = friends.slice(0, 4).map(n => {
    const initials = escapeHtml(n.slice(0, 2).toUpperCase());
    const presence = getFriendPresence(n);
    const code = getUserCode(n) || '';
    let sub = presence === 'online' ? 'Online' : presence === 'away' ? 'Away' : 'Offline · Last seen recently';
    return `
      <div class="sh-network-row">
        <div class="friend-row-avatar${ownerFrameClass(n)}" onclick="openUserProfileView('${escapeJs(n)}','')">${initials}${ownerCrownHTML(n)}${presenceDotHTML(n)}</div>
        <div class="sh-network-info">
          <div class="sh-network-name">@${escapeHtml(n)}${code ? ` <span class="frn-code">${escapeHtml(code)}</span>` : ''}</div>
          <div class="sh-network-sub">${sub}</div>
        </div>
        <div class="sh-network-actions">
          <button class="sh-msg-btn" onclick="openDm('${escapeJs(n)}')">Message</button>
          <button class="sh-remove-btn" onclick="removeFriend('${escapeJs(n)}')">Remove</button>
        </div>
      </div>`;
  }).join('');
}

function initFriendsPage() {
  if (!currentUser) return;
  document.getElementById('friend-search-input').value = '';
  document.getElementById('friend-search-results').innerHTML = '';
  document.getElementById('friends-add-panel').classList.remove('open');
  document.getElementById('friends-page-search').value = '';
  const yourCodeEl = document.getElementById('friends-your-code');
  if (yourCodeEl) yourCodeEl.innerHTML = yourCodeBoxHTML(getUserCode(currentUser.name));
  switchFriendsTab(friendsActiveTab || 'messages');
  pullFriendRequests().then(renderFriendsPage);
  renderFriendsPage();
  startSocialPolling();
}

function toggleFriendsAddPanel() {
  const el = document.getElementById('friends-add-panel');
  const open = el.classList.toggle('open');
  if (open) document.getElementById('friend-search-input').focus();
}

let friendsActiveTab = 'messages';
function switchFriendsTab(tab) {
  friendsActiveTab = tab;
  document.querySelectorAll('.friends-tab-btn').forEach(b => b.classList.toggle('active', b.dataset.tab === tab));
  const msgTab = document.getElementById('friends-messages-tab');
  const gridTab = document.getElementById('friends-grid-tab');
  const reqTab = document.getElementById('friends-requests-tab');
  if (msgTab) msgTab.style.display = tab === 'messages' ? 'flex' : 'none';
  if (gridTab) gridTab.style.display = tab === 'friends' ? 'flex' : 'none';
  if (reqTab) reqTab.style.display = tab === 'requests' ? 'flex' : 'none';
  if (tab === 'friends') renderFriendsGrid();
  if (typeof updateMusicHubNav === 'function') updateMusicHubNav('friends');
}

function messageRowHTML(name) {
  const initials = escapeHtml(name.slice(0, 2).toUpperCase());
  const preview = getDmPreview(name);
  const timeStr = preview.time ? formatDmRowTime(preview.time) : '';
  const subText = preview.text
    ? escapeHtml((preview.mine ? 'You: ' : '') + preview.text)
    : 'Say hi 👋';
  return `
    <div class="msg-row${dmActiveFriend === name ? ' active' : ''}" data-user="${escapeHtml(name)}" onclick="openDm('${escapeJs(name)}')">
      <div class="friend-row-avatar${ownerFrameClass(name)}">${initials}${ownerCrownHTML(name)}${presenceDotHTML(name)}</div>
      <div class="friend-row-info">
        <div class="friend-row-name">@${escapeHtml(name)} ${ownerTagHTML(name)}</div>
        <div class="msg-row-preview${preview.unread ? ' unread' : ''}">${subText}</div>
      </div>
      <div class="msg-row-meta">
        ${timeStr ? `<span class="msg-row-time">${timeStr}</span>` : ''}
        ${preview.unread ? `<span class="msg-row-badge">${preview.unread}</span>` : ''}
      </div>
    </div>`;
}

function renderMessagesTab() {
  const listEl = document.getElementById('friends-messages-list');
  if (!listEl || !currentUser) return;
  const friends = getFriendsList();
  const searchEl = document.getElementById('friends-page-search');
  const q = searchEl ? searchEl.value.trim().toLowerCase() : '';
  const filtered = q ? friends.filter(n => n.toLowerCase().includes(q)) : friends;
  const withPreview = filtered.map(n => ({ name: n, preview: getDmPreview(n) }));
  withPreview.sort((a, b) => (b.preview.time - a.preview.time) || a.name.localeCompare(b.name));
  if (withPreview.length) {
    listEl.innerHTML = withPreview.map(f => messageRowHTML(f.name)).join('');
  } else if (friends.length) {
    listEl.innerHTML = '<p class="friends-empty">No matches.</p>';
  } else {
    listEl.innerHTML = '<p class="friends-empty">No friends yet — tap the pen above to add someone.</p>';
  }
}

function friendCardHTML(name) {
  const initials = escapeHtml(name.slice(0, 2).toUpperCase());
  const presence = getFriendPresence(name);
  let statusHtml = '';
  if (presence === 'online') {
    statusHtml = `<div class="fc-status fc-online"><span class="fc-status-dot"></span> Online</div>`;
  } else if (presence === 'away') {
    statusHtml = `<div class="fc-status fc-away"><span class="fc-status-dot"></span> Away</div>`;
  } else {
    statusHtml = `<div class="fc-status fc-offline">Last seen recently</div>`;
  }
  return `
    <div class="friend-card" data-user="${escapeHtml(name)}">
      <div class="friend-card-top">
        <div class="friend-card-avatar${ownerFrameClass(name)}" onclick="openUserProfileView('${escapeJs(name)}','')">${initials}${ownerCrownHTML(name)}${presenceDotHTML(name)}</div>
        <div class="friend-card-info">
          <div class="friend-card-name" onclick="openUserProfileView('${escapeJs(name)}','')">${escapeHtml(name)} ${ownerTagHTML(name)}</div>
          <div class="friend-card-handle">@${escapeHtml(name)}</div>
        </div>
        <button class="friend-card-more" onclick="removeFriend('${escapeJs(name)}')" title="Remove friend" aria-label="Remove">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="18" y1="8" x2="23" y2="13"/><line x1="23" y1="8" x2="18" y2="13"/></svg>
        </button>
      </div>
      ${statusHtml}
      <div class="friend-card-actions">
        <button class="fc-btn primary" onclick="openDm('${escapeJs(name)}')">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
          Message
        </button>
        <button class="fc-btn" onclick="openUserProfileView('${escapeJs(name)}','')">View Profile</button>
      </div>
    </div>`;
}

function renderFriendsGrid() {
  const grid = document.getElementById('friends-cards-grid');
  if (!grid || !currentUser) return;
  const friends = getFriendsList();
  const searchEl = document.getElementById('friends-page-search');
  const q = searchEl ? searchEl.value.trim().toLowerCase() : '';
  const filtered = q ? friends.filter(n => n.toLowerCase().includes(q)) : friends;
  let html = filtered.map(n => friendCardHTML(n)).join('');
  html += `
    <div class="friend-card friend-card-empty" onclick="toggleFriendsAddPanel()">
      <div class="fce-icon">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>
      </div>
      <div class="fce-title">Find more curators</div>
      <div class="fce-sub">Explore the global archive to connect.</div>
    </div>`;
  if (!filtered.length && friends.length) {
    grid.innerHTML = '<p class="friends-empty">No matches.</p>' + html;
  } else {
    grid.innerHTML = html;
  }
}

let dmPreviewsRefreshing = false;
async function refreshDmPreviews() {
  if (!currentUser || dmPreviewsRefreshing || !isDbConnected()) return;
  dmPreviewsRefreshing = true;
  const friends = getFriendsList();
  try { await Promise.all(friends.map(n => pullDmMessages(n))); } catch (e) {}
  dmPreviewsRefreshing = false;
  renderMessagesTab();
}

function renderFriendsPage() {
  if (!currentUser) return;
  const incoming = getIncomingRequests();
  const outgoing = getOutgoingRequests();
  const friends = getFriendsList();

  const incBlock = document.getElementById('friend-requests-block');
  const incList = document.getElementById('friend-requests-list');
  if (incoming.length > 0) {
    incBlock.style.display = 'block';
    incList.innerHTML = incoming.map(r => friendRowHTML(r.from, null)).join('');
  } else { incBlock.style.display = 'none'; incList.innerHTML = ''; }

  const outBlock = document.getElementById('friend-outgoing-block');
  const outList = document.getElementById('friend-outgoing-list');
  if (outgoing.length > 0) {
    outBlock.style.display = 'block';
    outList.innerHTML = outgoing.map(r => friendRowHTML(r.to, null)).join('');
  } else { outBlock.style.display = 'none'; outList.innerHTML = ''; }

  const reqEmpty = document.getElementById('friends-requests-empty');
  if (reqEmpty) reqEmpty.style.display = (incoming.length === 0 && outgoing.length === 0) ? 'block' : 'none';

  const reqTabBtn = document.getElementById('friends-tab-requests-btn');
  if (reqTabBtn) {
    let badge = reqTabBtn.querySelector('.ftb-badge');
    if (incoming.length > 0) {
      if (!badge) { badge = document.createElement('span'); badge.className = 'ftb-badge'; reqTabBtn.appendChild(badge); }
      badge.textContent = incoming.length;
    } else if (badge) { badge.remove(); }
  }

  renderMessagesTab();
  renderFriendsGrid();

  const metaEl = document.getElementById('friends-meta');
  if (metaEl) {
    metaEl.textContent = friends.length + ' friend' + (friends.length === 1 ? '' : 's') +
      (incoming.length ? ' · ' + incoming.length + ' request' + (incoming.length === 1 ? '' : 's') : '');
  }

  updateSocialBadge();
  refreshDmPreviews();
}

function updateSocialBadge() {
  const count = currentUser ? getIncomingRequests().length : 0;
  const bnBadge = document.getElementById('bn-social-badge');
  if (bnBadge) bnBadge.style.display = count > 0 ? 'block' : 'none';
  const hubBadge = document.getElementById('social-hub-friend-badge');
  if (hubBadge) {
    if (count > 0) { hubBadge.style.display = 'inline-block'; hubBadge.textContent = count; }
    else hubBadge.style.display = 'none';
  }
}

function startSocialPolling() {
  stopSocialPolling();
  if (!currentUser) return;
  socialPollInterval = setInterval(() => {
    if (!currentUser) return;
    const onFriends = document.getElementById('page-friends').classList.contains('active');
    const onSocial = document.getElementById('page-social').classList.contains('active');
    const onDm = document.getElementById('page-dm').classList.contains('active');
    if (onFriends) pullFriendRequests().then(renderFriendsPage);
    else if (onSocial) pullFriendRequests().then(() => { updateSocialBadge(); renderSocialHubPreview(); });
    else if (onDm && dmActiveFriend) pullDmMessages(dmActiveFriend).then(() => { renderDmMessages(); refreshDmPreviews(); });
  }, 15000);
}
function stopSocialPolling() {
  if (socialPollInterval) { clearInterval(socialPollInterval); socialPollInterval = null; }
}

// ---- direct messages ----
function openDm(name) {
  if (!currentUser) return;
  if (!areFriends(name)) { showToast('You can only message friends. Send a friend request first.', {type:'error'}); return; }
  dmActiveFriend = name;
  document.getElementById('dm-header-name').textContent = '@' + name;
  document.getElementById('dm-header-avatar').textContent = name.slice(0, 2).toUpperCase();
  document.getElementById('page-dm-empty').style.display = 'none';
  document.getElementById('page-dm-content').style.display = 'flex';
  showPage('dm');
  document.getElementById('dm-input').value = '';
  cancelReply('dm');
  markDmRead(name);
  renderMessagesTab();
  pullDmMessages(name).then(() => { renderDmMessages(); markDmRead(name); renderMessagesTab(); });
  subscribeToDm(name);
  renderDmMessages();
  startSocialPolling();
}

// Shows "Online"/"Away" (with a colored dot) plus the message count in the DM
// header — falls back to just the message count if we can't see their presence.
function renderDmHeaderPresence() {
  if (!dmActiveFriend) return;
  const meta = document.getElementById('dm-header-meta');
  if (!meta) return;
  const msgs = getDmMessages(dmActiveFriend);
  const presence = getFriendPresence(dmActiveFriend);
  const label = presence === 'online' ? 'Online' : presence === 'away' ? 'Away' : null;
  meta.innerHTML = (label ? `<span class="presence-dot ${presence}"></span>${label} · ` : '')
    + msgs.length + ' message' + (msgs.length === 1 ? '' : 's');
}

function renderDmMessages() {
  if (!dmActiveFriend || !currentUser) return;
  const container = document.getElementById('dm-messages');
  const msgs = getDmMessages(dmActiveFriend);
  renderDmHeaderPresence();
  if (msgs.length === 0) {
    container.innerHTML = '<p style="font-family:var(--mono);font-size:11px;color:var(--muted);text-align:center;padding:40px 0;">No messages yet. Say hi, or share a song 🎵</p>';
    return;
  }
  const byId = {};
  msgs.forEach(m => { byId[m.id] = m; });
  const room = 'dm:' + dmActiveFriend;

  container.innerHTML = msgs.map(m => {
    const mine = m.from === currentUser.name;
    const sendIn = (m.id === lastSentMsgId) ? 'msg-send-in' : '';

    let replyHtml = '';
    if (m.replyTo) {
      const orig = byId[m.replyTo];
      if (orig) {
        const origAuthor = orig.from === currentUser.name ? 'You' : orig.from;
        const origPreview = orig.text || (orig.songKey ? '🎵 Shared a song' : (orig.gifUrl ? '🖼️ Sent a GIF' : ''));
        const preview = origPreview.length > 60 ? origPreview.slice(0, 60) + '…' : origPreview;
        replyHtml = `<div class="msg-reply-quote"><span class="reply-quote-author">@${escapeHtml(origAuthor)}</span> ${escapeHtml(preview)}</div>`;
      } else {
        replyHtml = `<div class="msg-reply-quote deleted">Original message was deleted</div>`;
      }
    }

    let bodyHtml;
    if (m.songKey) {
      const song = songs.find(s => s.number === m.songKey);
      if (song) {
        const mood = MOOD_MAP[song.mood] || MOOD_MAP['3am'];
        bodyHtml = `<div class="dm-song-tag">${mine ? 'You shared' : escapeHtml(m.from) + ' shared'} a song</div>
          <div class="dm-song-card" onclick="event.stopPropagation();openSongModalByNumber('${escapeHtml(song.number)}')">
            <div class="dsc-note">♪</div>
            <div class="dsc-info">
              <div class="dsc-title">${escapeHtml(song.title)}</div>
              <div class="dsc-artist">${escapeHtml(song.artist)} · <span style="color:${mood.color}">${escapeHtml(mood.label)}</span></div>
            </div>
          </div>` + (m.text ? `<div class="chat-msg-text" style="margin-top:6px;">${linkifyText(m.text)}</div>` : '');
      } else {
        bodyHtml = `<div class="chat-msg-text" style="font-style:italic;opacity:0.6;">Shared a song that\'s no longer in the archive.</div>`;
      }
    } else if (m.gifUrl) {
      bodyHtml = `<img class="dm-gif-image" src="${escapeHtml(m.gifUrl)}" alt="GIF" loading="lazy">`
        + (m.text ? `<div class="chat-msg-text" style="margin-top:6px;">${linkifyText(m.text)}</div>` : '');
    } else {
      bodyHtml = `<div class="chat-msg-text">${linkifyText(m.text)}</div>`;
    }

    const reactionEntries = Object.entries(m.reactions || {}).filter(([, users]) => users && users.length > 0);
    let reactionsHtml = '';
    if (reactionEntries.length > 0) {
      reactionsHtml = `<div class="msg-reactions">` + reactionEntries.map(([emoji, users]) => {
        const mineReact = users.includes(currentUser.name) ? 'mine' : '';
        const pop = (lastReactionPop && lastReactionPop.room === room && lastReactionPop.id === m.id && lastReactionPop.emoji === emoji) ? 'pop' : '';
        return `<span class="reaction-pill ${mineReact} ${pop}" onclick="event.stopPropagation();toggleReaction('${room}','${m.id}','${emoji}')">${emoji} ${users.length}</span>`;
      }).join('') + `</div>`;
    }

    return `
    <div class="chat-msg ${sendIn}" data-msg-id="${m.id}" data-room="${room}">
      <div class="chat-msg-avatar${ownerFrameClass(mine ? currentUser.name : m.from)}" onclick="event.stopPropagation();openUserProfileView('${escapeJs(mine ? currentUser.name : m.from)}')" style="cursor:pointer;">${escapeHtml((mine ? currentUser.name : m.from).slice(0,2).toUpperCase())}${ownerCrownHTML(mine ? currentUser.name : m.from)}</div>
      <div class="chat-msg-body">
        <div class="chat-msg-name" onclick="event.stopPropagation();openUserProfileView('${escapeJs(mine ? currentUser.name : m.from)}')" style="cursor:pointer;">${mine ? 'You' : escapeHtml(m.from)} ${ownerTagHTML(mine ? currentUser.name : m.from)}</div>
        ${replyHtml}
        ${bodyHtml}
        <div class="chat-msg-time">${new Date(m.time).toLocaleTimeString()}</div>
        ${reactionsHtml}
      </div>
    </div>`;
  }).join('');
  container.scrollTop = container.scrollHeight;
  attachLongPress(container);
  clearAnimationMarkers();
}

// ---- DM reactions & delete (shared action-sheet calls into these for
// "dm:<friend>" pseudo-rooms — see isDmRoom/dmFriendFromRoom in chat.js) ----
function toggleDmReaction(friend, id, emoji) {
  if (!currentUser) return;
  const msgs = getDmMessages(friend);
  const msg = msgs.find(m => m.id === id);
  if (!msg) return;
  if (!msg.reactions) msg.reactions = {};
  if (!msg.reactions[emoji]) msg.reactions[emoji] = [];
  const idx = msg.reactions[emoji].indexOf(currentUser.name);
  if (idx > -1) msg.reactions[emoji].splice(idx, 1);
  else msg.reactions[emoji].push(currentUser.name);
  if (msg.reactions[emoji].length === 0) delete msg.reactions[emoji];
  saveDmMessages(friend, msgs);
  lastReactionPop = msg.reactions[emoji] ? { room: 'dm:' + friend, id, emoji } : null;
  if (dmActiveFriend === friend) renderDmMessages();

  // Only a numeric (database) id is a valid reaction target — a still-local
  // message keeps the reaction locally until it syncs, same as room chat.
  const dbMatch = /^dm_(\d+)$/.exec(String(id));
  if (isDbConnected() && sb && dbMatch) {
    sb.from('dm_messages').update({ reactions: msg.reactions }).eq('id', Number(dbMatch[1])).then(() => {});
  }
}

async function deleteDmMessageById(friend, id) {
  const dbMatch = /^dm_(\d+)$/.exec(String(id));
  if (isDbConnected() && sb && dbMatch) {
    const { error } = await sb.from('dm_messages').delete().eq('id', Number(dbMatch[1]));
    if (error) {
      showToast(/policy|row-level/i.test(error.message)
        ? "You can only delete your own messages."
        : 'Could not delete: ' + error.message, { type: 'error' });
      return;
    }
  }
  const msgs = getDmMessages(friend).filter(m => m.id !== id);
  saveDmMessages(friend, msgs);
  if (dmActiveFriend === friend) renderDmMessages();
  refreshDmPreviews();
  renderMessagesTab();
}

function sendDmText() {
  if (!currentUser || !dmActiveFriend) return;
  const input = document.getElementById('dm-input');
  const text = input.value.trim();
  if (!text) return;
  sendDmMessage(text, null);
  input.value = '';
  input.focus();
  input.classList.remove('input-sent-pulse');
  void input.offsetWidth;
  input.classList.add('input-sent-pulse');
}

// Moderates a DM AFTER it's already been sent/shown, so sending doesn't wait
// on the moderate-message round trip. Deletes the message (locally + DB) if
// it's later flagged.
async function moderateDmAfterSend(friend, text, localId) {
  if (!text) return;
  const verdict = await moderateText(text, 'dm', pairKey(currentUser.name, friend));
  if (verdict.action !== 'block' && verdict.action !== 'self_harm') {
    if (verdict.text && verdict.text !== text) {
      const msgs = getDmMessages(friend);
      const target = msgs.find(m => m.id === localId);
      if (target) {
        target.text = verdict.text;
        saveDmMessages(friend, msgs);
        if (friend === dmActiveFriend) renderDmMessages();
      }
    }
    return;
  }
  const msgs = getDmMessages(friend).filter(m => m.id !== localId);
  saveDmMessages(friend, msgs);
  if (friend === dmActiveFriend) renderDmMessages();
  if (verdict.action === 'self_harm') {
    showToast(verdict.supportMessage || "If you're struggling, you don't have to go through it alone — reach out to someone you trust or a crisis line.", { type: 'error', duration: 9000 });
  } else {
    showToast("That message was removed — it doesn't meet our community guidelines.", { type: 'error' });
  }
}

async function sendDmMessage(text, songKey, gifUrl) {
  if (!currentUser || !dmActiveFriend) return;
  if (!canSendMessageNow()) return;
  const finalText = text || '';
  const friend = dmActiveFriend;
  const msgs = getDmMessages(friend);

  // Only a numeric (database) id is a valid reply target — replying to a
  // message that only exists locally still sends fine, it just doesn't
  // carry the reply link to the DB (same trade-off as room chat).
  const rawReply = replyContext.dm;
  const replyDbMatch = rawReply ? /^dm_(\d+)$/.exec(String(rawReply)) : null;
  const replyDbId = replyDbMatch ? Number(replyDbMatch[1]) : null;

  const newMsg = { id: 'local_' + Date.now(), from: currentUser.name, to: friend, text: finalText, songKey: songKey || null, gifUrl: gifUrl || null, time: Date.now(), replyTo: rawReply || null, reactions: {} };
  msgs.push(newMsg);
  saveDmMessages(friend, msgs);
  cancelReply('dm');
  if (isDbConnected()) {
    sb.from('dm_messages').insert({
      pair_key: pairKey(currentUser.name, friend), sender: currentUser.name, recipient: friend,
      text: finalText || null, song_key: songKey || null, gif_url: gifUrl || null, reply_to: replyDbId
    }).then(() => {});
    notifyUser(friend, 'dm', '@' + currentUser.name + ' sent you a message',
      (finalText || (songKey ? 'Shared a song 🎵' : (gifUrl ? 'Sent a GIF 🖼️' : ''))).slice(0, 140), 'dm', currentUser.name, currentUser.name);
  }
  lastSentMsgId = newMsg.id;
  renderDmMessages();
  markDmRead(friend);
  renderMessagesTab();

  // Moderate in the background — doesn't block the send.
  if (finalText) moderateDmAfterSend(friend, finalText, newMsg.id);
}

document.getElementById('dm-input').addEventListener('keydown', e => {
  if (e.key === 'Enter') sendDmText();
});
document.getElementById('friend-search-input').addEventListener('keydown', e => {
  if (e.key === 'Enter') { e.preventDefault(); searchFriendUsers(); }
});

// ---- song sharing ----
function openSongSharePicker() {
  if (!dmActiveFriend) return;
  songPickerTarget = dmActiveFriend;
  document.getElementById('song-share-target-name').textContent = '@' + dmActiveFriend;
  document.getElementById('song-share-search').value = '';
  renderSongSharePicker();
  document.getElementById('song-share-overlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeSongSharePicker() {
  document.getElementById('song-share-overlay').classList.remove('open');
  document.body.style.overflow = '';
  songPickerTarget = null;
}
function renderSongSharePicker() {
  const q = (document.getElementById('song-share-search').value || '').toLowerCase().trim();
  const list = document.getElementById('song-share-list');
  const filtered = songs.filter(s => !q || s.title.toLowerCase().includes(q) || s.artist.toLowerCase().includes(q));
  if (filtered.length === 0) {
    list.innerHTML = '<p class="friends-empty">No songs match.</p>';
    return;
  }
  list.innerHTML = filtered.map(s => `
    <div class="song-share-row" onclick="shareSongToDm('${escapeHtml(s.number)}')">
      <div>
        <div class="ssr-title">${escapeHtml(s.title)}</div>
        <div class="ssr-artist">${escapeHtml(s.artist)}</div>
      </div>
    </div>`).join('');
}
function shareSongToDm(number) {
  if (!songPickerTarget) return;
  sendDmMessage('', number);
  closeSongSharePicker();
}

// ---- GIF sharing (Giphy) ----
// Shared by DM and room/global chat — gifShareContext says which one a pick
// should be routed to. handleGifPicked() (chat.js) is the single place that
// branches on it, so the search/grid code here doesn't need to know about
// rooms at all.
let gifShareSearchTimer = null;
let gifShareContext = 'dm'; // 'dm' | 'room'

async function openGifSharePicker() {
  if (!dmActiveFriend) return;
  gifShareContext = 'dm';
  document.getElementById('gif-share-target-name').textContent = '@' + dmActiveFriend;
  document.getElementById('gif-share-search').value = '';
  document.getElementById('gif-share-overlay').classList.add('open');
  document.body.style.overflow = 'hidden';
  document.getElementById('gif-share-grid').innerHTML =
    '<p class="friends-empty" style="grid-column:1/-1;">Loading…</p>';
  await ensureGiphyConfigSynced();
  const cfg = getGiphyConfig();
  if (!cfg.apiKey) {
    document.getElementById('gif-share-grid').innerHTML =
      '<p class="friends-empty" style="grid-column:1/-1;">GIF search isn\'t set up yet — add a free Giphy API key in Admin → Chat System, or config.js.</p>';
    return;
  }
  loadGifResults('trending');
}
function closeGifSharePicker() {
  document.getElementById('gif-share-overlay').classList.remove('open');
  document.body.style.overflow = '';
}
function onGifShareSearchInput() {
  clearTimeout(gifShareSearchTimer);
  const q = document.getElementById('gif-share-search').value.trim();
  gifShareSearchTimer = setTimeout(() => loadGifResults(q || 'trending'), 350);
}
async function loadGifResults(query) {
  const cfg = getGiphyConfig();
  const grid = document.getElementById('gif-share-grid');
  if (!cfg.apiKey) return;
  grid.innerHTML = '<p class="friends-empty" style="grid-column:1/-1;">Loading…</p>';
  try {
    const endpoint = query === 'trending'
      ? `https://api.giphy.com/v1/gifs/trending?api_key=${encodeURIComponent(cfg.apiKey)}&limit=20&rating=pg-13`
      : `https://api.giphy.com/v1/gifs/search?api_key=${encodeURIComponent(cfg.apiKey)}&q=${encodeURIComponent(query)}&limit=20&rating=pg-13`;
    const res = await fetch(endpoint);
    const data = await res.json();
    if (data.meta && data.meta.status && data.meta.status !== 200) {
      console.error('Giphy API error:', data.meta.msg);
      grid.innerHTML = '<p class="friends-empty" style="grid-column:1/-1;">Couldn\'t load GIFs — check the API key in Admin → Chat System.</p>';
      return;
    }
    const results = data.data || [];
    if (results.length === 0) {
      grid.innerHTML = '<p class="friends-empty" style="grid-column:1/-1;">No GIFs found.</p>';
      return;
    }
    grid.innerHTML = results.map(r => {
      const imgs = r.images || {};
      const tiny = imgs.fixed_width || imgs.fixed_width_small || imgs.preview_gif;
      const full = imgs.fixed_width || imgs.original;
      if (!tiny || !full || !tiny.url || !full.url) return '';
      return `<div class="gif-share-item" onclick="handleGifPicked('${escapeJs(full.url)}')">
        <img src="${escapeHtml(tiny.url)}" alt="${escapeHtml(r.title || 'GIF')}" loading="lazy">
      </div>`;
    }).join('');
  } catch (e) {
    console.error('Giphy search failed:', e);
    grid.innerHTML = '<p class="friends-empty" style="grid-column:1/-1;">Couldn\'t load GIFs — try again.</p>';
  }
}
// Routes a picked GIF to whichever picker opened it (DM vs room/global
// chat). Room-side handling (openGifSharePickerForRoom) lives in chat.js.
function handleGifPicked(url) {
  if (gifShareContext === 'room') {
    if (typeof sendGifToRoom === 'function') sendGifToRoom(url);
  } else {
    if (!dmActiveFriend) return;
    sendDmMessage('', null, url);
  }
  closeGifSharePicker();
}

// ---- share a song from the archive/modal straight to a friend's DMs ----
// Opens a bottom sheet listing every friend (pfp + username); tapping one sends
// the song into that friend's DM thread immediately, no need to already be in
// a conversation with them.
function shareCurrentModalSong() {
  if (currentModalSong === null || !songs[currentModalSong]) return;
  openSongShareSheet(songs[currentModalSong].number);
}

function openSongShareSheet(songNumber) {
  if (!currentUser) { showToast('Log in to share songs with friends.', {type:'error'}); showLogin(); return; }
  songRecipientSongNumber = songNumber;
  const song = songs.find(s => s.number === songNumber);
  document.getElementById('song-recipient-sheet-sub').textContent = song
    ? `Sending "${song.title}" — as a DM`
    : 'Sending — as a DM';
  renderSongRecipientList();
  document.getElementById('song-recipient-sheet').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeSongRecipientSheet() {
  document.getElementById('song-recipient-sheet').classList.remove('open');
  document.body.style.overflow = '';
  songRecipientSongNumber = null;
}

function renderSongRecipientList() {
  const list = document.getElementById('song-recipient-list');
  const friends = getFriendsList();
  if (friends.length === 0) {
    list.innerHTML = `<p class="sheet-empty">You don't have any friends yet.<br><a onclick="closeSongRecipientSheet();closeModalIfOpen();showPage('friends')">Add friends</a> to start sharing songs.</p>`;
    return;
  }
  list.innerHTML = friends.map(name => `
    <div class="sheet-friend-row" id="song-recipient-row-${escapeHtml(name)}" onclick="sendSongToFriend('${escapeJs(name)}')">
      ${userPfpHTML(name)}
      <span class="sheet-friend-name">@${escapeHtml(name)}</span>
    </div>`).join('');
}

function closeModalIfOpen() {
  const modal = document.getElementById('modal');
  if (modal && modal.classList.contains('open')) {
    modal.classList.remove('open');
    currentModalSong = null;
  }
}

function sendSongToFriend(friendName) {
  if (!currentUser || !songRecipientSongNumber) return;
  if (!canSendMessageNow()) { showToast('Slow down a bit before sending more messages.', {type:'error'}); return; }
  const row = document.getElementById('song-recipient-row-' + friendName);
  const msgs = getDmMessages(friendName);
  const newMsg = { id: 'local_' + Date.now(), from: currentUser.name, to: friendName, text: '', songKey: songRecipientSongNumber, time: Date.now() };
  msgs.push(newMsg);
  saveDmMessages(friendName, msgs);
  if (isDbConnected()) {
    sb.from('dm_messages').insert({
      pair_key: pairKey(currentUser.name, friendName), sender: currentUser.name, recipient: friendName,
      text: null, song_key: songRecipientSongNumber
    }).then(() => {});
  }
  if (friendName === dmActiveFriend) { lastSentMsgId = newMsg.id; renderDmMessages(); }
  markDmRead(friendName);
  renderMessagesTab();
  if (row) {
    row.classList.add('sent');
    row.insertAdjacentHTML('beforeend', '<span class="sheet-friend-sent-tag">Sent ✓</span>');
  }
  showToast(`Sent to @${friendName}!`);
}

// Global song-modal opener (usable from outside the archive grid, e.g. from a shared-song DM card)
function openSongModalByNumber(number) {
  const idx = songs.findIndex(s => s.number === number);
  if (idx === -1) { showToast('That song is no longer in the archive.', {type:'error'}); return; }
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
  const modal = document.getElementById('modal');
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

// ═══════════════════════════════════════════════════════════════


// ═══════════════════════════════════════════════════════════════
//  LIVE DIRECT MESSAGES
//
//  DMs previously relied entirely on a 7-second poll that only ran while
//  the DM page was open. Anywhere else on the site, a message from a
//  friend was invisible until you happened to navigate back. dm_messages
//  was also missing from the realtime publication, so there was nothing
//  to subscribe to even if the code had tried.
// ═══════════════════════════════════════════════════════════════

let dmChannel = null;
let dmChannelFriend = null;

function teardownDmRealtime() {
  if (dmChannel && sb) {
    try { sb.removeChannel(dmChannel); } catch (e) { /* ignore */ }
  }
  dmChannel = null;
  dmChannelFriend = null;
}

function subscribeToDm(friendName) {
  if (!isDbConnected() || !sb || !currentUser || !friendName) { teardownDmRealtime(); return; }
  if (dmChannelFriend === friendName && dmChannel) return;
  teardownDmRealtime();
  dmChannelFriend = friendName;

  const key = pairKey(currentUser.name, friendName);
  try {
    dmChannel = sb.channel('dm-' + key)
      .on('postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'dm_messages', filter: 'pair_key=eq.' + key },
        payload => {
          const row = payload.new;
          if (!row) return;
          const msgs = getDmMessages(friendName);
          // dm_ prefix matches the id format pullDmMessages uses, so this
          // message is recognized as "already have it" on the next poll
          // instead of being appended a second time.
          const dbId = 'dm_' + row.id;
          if (msgs.some(m => String(m.id) === dbId)) return;

          // Is this the echo of a message THIS browser just sent optimistically?
          // The optimistic copy is stored with `from`/`to` fields (see
          // sendDmMessage) — the old code checked `m.author`, which never
          // existed on a locally-created message, so this never matched and
          // every message you sent got duplicated when its own echo arrived.
          // It also crashed renderDmMessages() for *incoming* messages, since
          // they were pushed with an `author` field instead of `from`, and
          // rendering reads m.from — so the whole thread failed to redraw
          // until the next 15s poll quietly fixed the field names.
          if (row.sender === currentUser.name) {
            const local = msgs.find(m => m.from === currentUser.name && m.text === (row.text || '') &&
                                          Math.abs(m.time - new Date(row.created_at).getTime()) < 15000);
            if (local) {
              // Promote the optimistic local copy to its real DB id instead
              // of appending a duplicate.
              local.id = dbId;
              local.time = new Date(row.created_at).getTime();
              local.reactions = row.reactions || local.reactions || {};
              local.replyTo = row.reply_to != null ? 'dm_' + row.reply_to : (local.replyTo || null);
              saveDmMessages(friendName, msgs);
              if (dmActiveFriend === friendName) renderDmMessages();
              return;
            }
          }

          msgs.push({
            id: dbId,
            from: row.sender,
            to: row.recipient,
            text: row.text || '',
            songKey: row.song_key || null,
            gifUrl: row.gif_url || null,
            time: new Date(row.created_at).getTime(),
            replyTo: row.reply_to != null ? 'dm_' + row.reply_to : null,
            reactions: row.reactions || {}
          });
          msgs.sort((a, b) => a.time - b.time);
          saveDmMessages(friendName, msgs);
          if (dmActiveFriend === friendName) { renderDmMessages(); markDmRead(friendName); }
          refreshDmPreviews();
          renderMessagesTab();
        })
      .on('postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'dm_messages', filter: 'pair_key=eq.' + key },
        payload => {
          // Reaction toggles (and moderation edits) land here — mirrors
          // handleUpdatedChatRow's job for room chat.
          const row = payload.new;
          if (!row) return;
          const dbId = 'dm_' + row.id;
          const msgs = getDmMessages(friendName);
          const target = msgs.find(m => String(m.id) === dbId);
          if (!target) return;
          target.text = row.text;
          target.reactions = row.reactions || {};
          saveDmMessages(friendName, msgs);
          if (dmActiveFriend === friendName) renderDmMessages();
        })
      .on('postgres_changes',
        { event: 'DELETE', schema: 'public', table: 'dm_messages', filter: 'pair_key=eq.' + key },
        payload => {
          // Requires dm_messages to have replica identity full (set in
          // setup.sql) so payload.old carries the full deleted row.
          const oldRow = payload.old;
          if (!oldRow) return;
          const dbId = 'dm_' + oldRow.id;
          const msgs = getDmMessages(friendName).filter(m => String(m.id) !== dbId);
          saveDmMessages(friendName, msgs);
          if (dmActiveFriend === friendName) renderDmMessages();
          refreshDmPreviews();
          renderMessagesTab();
        })
      .subscribe();
  } catch (e) {
    console.error('DM realtime subscribe failed:', e);
  }
}
