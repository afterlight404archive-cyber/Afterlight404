//  CHAT
// ═══════════════════════════════════════════════════════════════

function initChat() {
  const wall = document.getElementById('chat-login-wall');
  const layout = document.getElementById('chat-layout');
  if (!currentUser) { wall.style.display = 'block'; layout.style.display = 'none'; return; }
  wall.style.display = 'none'; layout.style.display = 'grid';
  currentRoom = 'general';
  clearRoomUnread('general');
  renderRoomList();
  syncRoomMessages('general').then(renderChatMessages);
  subscribeToRoom('general');
  attachMentionAutocomplete('chat-input', 'chat-mention-dropdown');
}

function getRooms() {
  const raw = localStorage.getItem('al-chat-rooms');
  if (raw) return JSON.parse(raw);
  const defaults = [
    { name: 'general', created: Date.now(), creator: 'system' },
    { name: 'melodrama', created: Date.now(), creator: 'system' },
    { name: 'phoebe-bridgers', created: Date.now(), creator: 'system' },
    { name: '3am-spiral', created: Date.now(), creator: 'system' }
  ];
  localStorage.setItem('al-chat-rooms', JSON.stringify(defaults));
  return defaults;
}

function saveRooms(rooms) {
  localStorage.setItem('al-chat-rooms', JSON.stringify(rooms));
}

// Ensures every message has the fields needed for reactions/replies/ids,
// backfilling older messages that predate those features.
function migrateMessage(m) {
  if (!m.id) m.id = 'm_' + m.time + '_' + Math.random().toString(36).slice(2, 8);
  if (!m.reactions) m.reactions = {};
  if (m.replyTo === undefined) m.replyTo = null;
  return m;
}

function getMessages(room) {
  const raw = localStorage.getItem('al-chat-' + room);
  if (!raw) return [];
  const msgs = JSON.parse(raw).map(migrateMessage);
  return msgs;
}

function saveMessages(room, msgs) {
  localStorage.setItem('al-chat-' + room, JSON.stringify(msgs));
}

function getUserNames() {
  const users = JSON.parse(localStorage.getItem('al-users') || '[]');
  return users.map(u => u.name);
}

// Wraps @username occurrences (for known users) in a styled mention span.
function linkifyText(text) {
  const escaped = escapeHtml(text);
  const names = getUserNames();
  if (names.length === 0) return escaped;
  const namesPattern = names.map(n => n.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');
  const re = new RegExp('@(' + namesPattern + ')\\b', 'gi');
  return escaped.replace(re, '<span class="mention">@$1</span>');
}

// Mobile "Chats" list page: Global Chat card + My Rooms + Trending Rooms.
function renderChatsListPage() {
  const body = document.getElementById('chats-list-body');
  if (!body) return;
  const rooms = getRooms().filter(r => r.name !== 'general');
  const msgsByRoom = {};
  rooms.forEach(r => { msgsByRoom[r.name] = getMessages(r.name); });

  const mine = currentUser
    ? rooms.filter(r => r.creator === currentUser.name || (msgsByRoom[r.name] || []).some(m => m.author === currentUser.name))
    : [];
  const mineNames = new Set(mine.map(r => r.name));
  const trending = rooms
    .filter(r => !mineNames.has(r.name))
    .sort((a, b) => (msgsByRoom[b.name] || []).length - (msgsByRoom[a.name] || []).length)
    .slice(0, 6);

  const roomRowHTML = (r, showDot) => {
    showDot = showDot || isRoomUnread(r.name);
    const count = (msgsByRoom[r.name] || []).length;
    const meta = r.description ? escapeHtml(r.description) : (count + ' message' + (count === 1 ? '' : 's'));
    return `<div class="room-row" onclick="openTopicChat('${escapeJs(r.name)}')">
      <div class="room-row-avatar">${escapeHtml(r.name.slice(0, 1).toUpperCase())}</div>
      <div class="room-row-text">
        <div class="room-row-name">${escapeHtml(r.name)}</div>
        <div class="room-row-meta">${meta}</div>
      </div>
      ${showDot ? '<span class="room-row-dot"></span>' : ''}
      <span class="room-row-chev">›</span>
    </div>`;
  };

  let html = `
    <div class="chats-list-sectionlabel">Global</div>
    <div class="global-chat-card" onclick="showPage('chat')">
      <div class="global-chat-avatar"><span class="gca-dot"></span></div>
      <div class="global-chat-text">
        <div class="global-chat-title">Global Chat</div>
        <div class="global-chat-sub">${getLiveOnlineCount().toLocaleString()} online</div>
        <div class="global-chat-desc">Talk about anything music.</div>
      </div>
      <span class="room-row-chev">›</span>
    </div>`;

  if (mine.length) {
    html += `<div class="chats-list-sectionlabel">My Rooms</div>
      <div class="room-list-cards">${mine.map(r => roomRowHTML(r, true)).join('')}</div>`;
  }
  if (trending.length) {
    html += `<div class="chats-list-sectionlabel">Trending Rooms<button class="see-all-link" onclick="openChatDrawer()">See all</button></div>
      <div class="room-list-cards">${trending.map(r => roomRowHTML(r, false)).join('')}</div>`;
  }
  if (!mine.length && !trending.length) {
    html += `<p class="friends-empty">No rooms yet. Tap + above to create one.</p>`;
  }
  body.innerHTML = html;
}

function renderRoomList() {
  const list = document.getElementById('room-list');
  const search = document.getElementById('room-search').value.toLowerCase();
  const rooms = getRooms().filter(r => r.name.toLowerCase().includes(search));
  const activeName = currentTopicRoom || currentRoom;
  const globalRoom = rooms.find(r => r.name === 'general');
  const otherRooms = rooms.filter(r => r.name !== 'general');

  let html = '';
  if (globalRoom) {
    const active = activeName === 'general' ? 'active' : '';
    html += `<div class="drawer-global-card ${active}" onclick="switchRoom('general')">
      <div class="drawer-global-avatar">◐<span class="gca-dot"></span></div>
      <div class="drawer-global-text">
        <div class="drawer-global-name">Global Chat</div>
        <div class="drawer-global-sub">Join the conversation</div>
      </div>
      <div class="drawer-global-count">${getLiveOnlineCount().toLocaleString()} online</div>
    </div>`;
  }
  if (otherRooms.length) {
    html += '<div class="chat-drawer-section-label">My Rooms</div>';
    html += otherRooms.map(r => {
      const msgs = getMessages(r.name);
      const active = r.name === activeName ? 'active' : '';
      const meta = r.description ? escapeHtml(r.description) : (msgs.length + ' message' + (msgs.length === 1 ? '' : 's'));
      return `<div class="drawer-room-row ${active}" onclick="openTopicChat('${escapeJs(r.name)}')">
        <div class="drawer-room-avatar">${escapeHtml(r.name.slice(0, 1).toUpperCase())}</div>
        <div class="drawer-room-text">
          <div class="drawer-room-name">${escapeHtml(r.name)}</div>
          <div class="drawer-room-meta">${meta}</div>
        </div>
        <span class="drawer-room-chev">›</span>
      </div>`;
    }).join('');
  }
  list.innerHTML = html || '<p class="friends-empty">No rooms match your search.</p>';
}

// "general" stays inline in the Global Chat layout
function switchRoom(name) {
  currentRoom = name;
  currentTopicRoom = null;
  if (!document.getElementById('page-chat').classList.contains('active')) {
    document.querySelectorAll('.page-section').forEach(s => s.classList.remove('active'));
    document.getElementById('page-chat').classList.add('active');
  }
  clearRoomUnread(name);
  renderRoomList();
  syncRoomMessages(name).then(renderChatMessages);
  subscribeToRoom(name);
  closeChatDrawer();
}

// ═══════════════════════════════════════════════════════════════
//  DISCORD-STYLE ROOM DRAWER (open/close, swipe gestures)
// ═══════════════════════════════════════════════════════════════

function openChatDrawer() {
  const drawer = document.getElementById('chat-drawer');
  const backdrop = document.getElementById('chat-drawer-backdrop');
  if (!drawer || !backdrop) return;
  drawer.classList.add('open');
  backdrop.classList.add('open');
  renderRoomList();
}

function closeChatDrawer() {
  const drawer = document.getElementById('chat-drawer');
  const backdrop = document.getElementById('chat-drawer-backdrop');
  if (!drawer || !backdrop) return;
  drawer.classList.remove('open');
  backdrop.classList.remove('open');
}

function isChatDrawerOpen() {
  const drawer = document.getElementById('chat-drawer');
  return !!(drawer && drawer.classList.contains('open'));
}

// Swipe-to-open (from left screen edge) and swipe-to-close, only while on a chat page.
(function initChatDrawerSwipe() {
  let startX = null, startY = null, tracking = false, fromEdge = false;
  const EDGE_ZONE = 28;
  const THRESHOLD = 60;

  document.addEventListener('touchstart', (e) => {
    if (!document.body.classList.contains('on-chat-page')) return;
    if (e.touches.length !== 1) return;
    const t = e.touches[0];
    startX = t.clientX; startY = t.clientY;
    fromEdge = startX <= EDGE_ZONE;
    tracking = fromEdge || isChatDrawerOpen();
  }, { passive: true });

  document.addEventListener('touchmove', (e) => {
    if (!tracking || startX === null) return;
    const t = e.touches[0];
    const dx = t.clientX - startX;
    const dy = t.clientY - startY;
    if (Math.abs(dy) > Math.abs(dx)) return; // vertical scroll, ignore
    if (fromEdge && dx > THRESHOLD) { openChatDrawer(); tracking = false; }
    else if (isChatDrawerOpen() && dx < -THRESHOLD) { closeChatDrawer(); tracking = false; }
  }, { passive: true });

  document.addEventListener('touchend', () => { startX = null; startY = null; tracking = false; });
})();

async function syncRoomMessages(room) {
  if (!isDbConnected()) return;
  try {
    const { data } = await sb.from('chat_messages').select('*').eq('room', room).order('created_at', { ascending: true });
    if (data) {
      const msgs = data.map(m => migrateMessage({ id: m.id ? String(m.id) : undefined, author: m.author, text: m.text, gifUrl: m.gif_url || null, time: new Date(m.created_at).getTime(), replyTo: m.reply_to || null, reactions: m.reactions || {} }));
      saveMessages(room, msgs);
    }
  } catch (e) { console.error('Chat sync failed:', e); }
}

// Tracks the single message/reaction that should play an entrance animation
// on the very next render, so we don't replay animations on unrelated re-renders.
let lastSentMsgId = null;
let lastReactionPop = null; // { room, id, emoji }

// Shared HTML builder used by both the global chat and topic chat message lists.
function renderMessageListHTML(msgs, room) {
  if (msgs.length === 0) {
    return '<p style="font-family:var(--mono);font-size:11px;color:var(--muted);text-align:center;padding:40px 0;">No messages yet. Start the conversation.</p>';
  }
  const byId = {};
  msgs.forEach(m => { byId[m.id] = m; });

  return msgs.map(m => {
    let replyHtml = '';
    if (m.replyTo) {
      const orig = byId[m.replyTo];
      if (orig) {
        const origText = orig.text || (orig.gifUrl ? '🖼️ Sent a GIF' : '');
        const preview = origText.length > 60 ? origText.slice(0, 60) + '…' : origText;
        replyHtml = `<div class="msg-reply-quote"><span class="reply-quote-author">@${escapeHtml(orig.author)}</span> ${escapeHtml(preview)}</div>`;
      } else {
        replyHtml = `<div class="msg-reply-quote deleted">Original message was deleted</div>`;
      }
    }

    const reactionEntries = Object.entries(m.reactions || {}).filter(([, users]) => users && users.length > 0);
    let reactionsHtml = '';
    if (reactionEntries.length > 0) {
      reactionsHtml = `<div class="msg-reactions">` + reactionEntries.map(([emoji, users]) => {
        const mine = currentUser && users.includes(currentUser.name) ? 'mine' : '';
        const pop = (lastReactionPop && lastReactionPop.room === room && lastReactionPop.id === m.id && lastReactionPop.emoji === emoji) ? 'pop' : '';
        return `<span class="reaction-pill ${mine} ${pop}" onclick="event.stopPropagation();toggleReaction('${room}','${m.id}','${emoji}')">${emoji} ${users.length}</span>`;
      }).join('') + `</div>`;
    }

    const sendIn = (m.id === lastSentMsgId) ? 'msg-send-in' : '';
    return `
    <div class="chat-msg ${sendIn}" data-msg-id="${m.id}" data-room="${room}">
      <div class="chat-msg-avatar${ownerFrameClass(m.author)}" onclick="event.stopPropagation();openUserProfileView('${escapeJs(m.author)}')">${escapeHtml(m.author.slice(0,2).toUpperCase())}${ownerCrownHTML(m.author)}</div>
      <div class="chat-msg-body">
        <div class="chat-msg-name" onclick="event.stopPropagation();openUserProfileView('${escapeJs(m.author)}')" style="cursor:pointer;">${escapeHtml(m.author)} ${ownerTagHTML(m.author)}</div>
        ${replyHtml}
        ${m.gifUrl
          ? `<img class="dm-gif-image" src="${escapeHtml(m.gifUrl)}" alt="GIF" loading="lazy" onclick="event.stopPropagation();window.open('${escapeJs(m.gifUrl)}','_blank')">`
          : `<div class="chat-msg-text">${linkifyText(m.text)}</div>`}
        <div class="chat-msg-time">${new Date(m.time).toLocaleTimeString()}</div>
        ${reactionsHtml}
      </div>
    </div>
  `;
  }).join('');
}

// Clears the one-shot animation markers once the HTML that used them has
// actually been rendered into the DOM (called right after container.innerHTML = ...).
function clearAnimationMarkers() {
  lastSentMsgId = null;
  lastReactionPop = null;
}

function renderChatMessages() {
  const container = document.getElementById('chat-messages');
  const title = document.getElementById('chat-room-title');
  const meta = document.getElementById('chat-room-meta');
  const isGlobal = currentRoom === 'general';
  title.textContent = isGlobal ? '# Global Chat' : '#' + currentRoom;
  const msgs = getMessages(currentRoom);
  meta.innerHTML = (isGlobal
    ? '<span class="chat-online-dot"></span>' + getLiveOnlineCount().toLocaleString() + ' online'
    : msgs.length + ' messages') + ' <span class="chat-live-dot"></span>';
  setChatLiveIndicator(roomChannelStatus);
  container.innerHTML = renderMessageListHTML(msgs, currentRoom);
  container.scrollTop = container.scrollHeight;
  attachLongPress(container);
  clearAnimationMarkers();
}

// ═══════════════════════════════════════════════════════════════
//  AI MODERATION — calls the moderate-message Edge Function before any
//  chat/DM text gets saved locally or written to Supabase. See the
//  "moderate-message" Edge Function for what it actually checks.
// ═══════════════════════════════════════════════════════════════
async function moderateText(text, context, roomOrThreadId) {
  // If Supabase isn't connected (local-only/offline mode), there's no
  // server to run moderation on — allow through unchanged rather than
  // blocking everything, same "local mode" trade-off used elsewhere.
  if (!isDbConnected() || !sb) return { action: 'allow', text };
  // Admin can turn this off site-wide from the Chat System tab.
  if (!isModerationEnabledCached()) return { action: 'allow', text };
  try {
    const { data, error } = await sb.functions.invoke('moderate-message', {
      body: {
        text,
        context,
        authorId: currentUser ? currentUser.name : null,
        authorName: currentUser ? currentUser.name : null,
        roomOrThreadId: roomOrThreadId || null,
      },
    });
    if (error || !data) {
      console.error('Moderation call failed:', error);
      // Fail open on infra errors (don't let a network blip stop all chat),
      // but this is a judgment call — flip to { action: 'block' } if you'd
      // rather chat go silent than risk an unmoderated message getting through.
      return { action: 'allow', text };
    }
    return data;
  } catch (e) {
    console.error('Moderation call threw:', e);
    return { action: 'allow', text };
  }
}

// Shared handling for a moderation verdict. Returns the (possibly masked)
// text to actually send, or null if the message should NOT be posted.
function handleModerationVerdict(verdict, originalText) {
  if (verdict.action === 'self_harm') {
    showToast(verdict.supportMessage || "If you're struggling, you don't have to go through it alone — reach out to someone you trust or a crisis line.", { type: 'error', duration: 9000 });
    return null;
  }
  if (verdict.action === 'block') {
    showToast("That message was removed — it doesn't meet our community guidelines.", { type: 'error' });
    return null;
  }
  return verdict.text || originalText;
}

async function sendChat() {
  await sendChatToRoom(currentRoom, 'chat-input', 'global', renderChatMessages);
}

let lastRoomCreatedAt = 0;
let newRoomPrivacy = 'public';
function setRoomPrivacy(v) {
  newRoomPrivacy = v;
  const pub = document.getElementById('privacy-public');
  const priv = document.getElementById('privacy-private');
  if (pub) pub.classList.toggle('active', v === 'public');
  if (priv) priv.classList.toggle('active', v === 'private');
}
function openCreateRoomSheet() {
  if (!currentUser) { showSignup(); return; }
  document.getElementById('create-room-overlay').classList.add('open');
  const input = document.getElementById('new-room-name');
  input.value = '';
  const desc = document.getElementById('new-room-desc');
  if (desc) desc.value = '';
  const cat = document.getElementById('new-room-category');
  if (cat) cat.selectedIndex = 0;
  setRoomPrivacy('public');
  setTimeout(() => input.focus(), 50);
}
function closeCreateRoomSheet() {
  document.getElementById('create-room-overlay').classList.remove('open');
}
function createRoom() {
  if (!currentUser) return;
  if (Date.now() - lastRoomCreatedAt < 5000) { showToast('Please wait a moment before creating another room.', {type:'error'}); return; }
  const input = document.getElementById('new-room-name');
  let name = input.value.trim().toLowerCase().replace(/[^a-z0-9_-]/g, '').replace(/\s+/g, '-');
  if (!name || name.length < 2) { showToast('Room name too short.', {type:'error'}); return; }
  if (name === 'general') { showToast('That name is reserved.', {type:'error'}); return; }
  const rooms = getRooms();
  if (rooms.find(r => r.name === name)) { showToast('Room already exists.', {type:'error'}); return; }
  const descInput = document.getElementById('new-room-desc');
  const catInput = document.getElementById('new-room-category');
  const description = descInput ? descInput.value.trim().slice(0, 140) : '';
  const category = catInput ? catInput.value : 'music-discussion';
  rooms.push({ name: name, created: Date.now(), creator: currentUser.name, description: description, category: category, privacy: newRoomPrivacy });
  lastRoomCreatedAt = Date.now();
  saveRooms(rooms);
  if (isDbConnected()) {
    sb.from('chat_rooms').insert({ name: name, creator: currentUser.name }).then(() => {});
  }
  input.value = '';
  closeCreateRoomSheet();
  renderRoomList();
  openTopicChat(name);
}

document.getElementById('chat-input').addEventListener('keydown', e => {
  if (e.key === 'Enter' && !document.getElementById('chat-mention-dropdown').classList.contains('open')) sendChat();
});
document.getElementById('room-search').addEventListener('input', renderRoomList);

// ═══════════════════════════════════════════════════════════════
//  DEDICATED TOPIC CHAT PAGE
// ═══════════════════════════════════════════════════════════════

let currentTopicRoom = null;

function openTopicChat(name) {
  if (!currentUser) { showSignup(); return; }
  currentTopicRoom = name;
  document.querySelectorAll('.page-section').forEach(s => s.classList.remove('active'));
  document.getElementById('page-topic-chat').classList.add('active');
  document.body.classList.add('on-chat-page');
  window.scrollTo(0, 0);
  clearRoomUnread(name);
  syncRoomMessages(name).then(renderTopicChatMessages);
  subscribeToRoom(name);
  attachMentionAutocomplete('topic-chat-input', 'topic-chat-mention-dropdown');
  renderRoomList();
  closeChatDrawer();
}

function backToGlobalChat() {
  currentTopicRoom = null;
  showPage('chat');
}

function renderTopicChatMessages() {
  if (!currentTopicRoom) return;
  const titleEl = document.getElementById('topic-chat-title');
  const metaEl = document.getElementById('topic-chat-meta');
  const avatarEl = document.getElementById('topic-chat-avatar');
  const container = document.getElementById('topic-chat-messages');
  titleEl.textContent = '#' + currentTopicRoom;
  if (avatarEl) avatarEl.textContent = currentTopicRoom.slice(0, 1).toUpperCase();
  const msgs = getMessages(currentTopicRoom);
  metaEl.textContent = msgs.length + ' messages · dedicated topic chat';
  container.innerHTML = renderMessageListHTML(msgs, currentTopicRoom);
  container.scrollTop = container.scrollHeight;
  attachLongPress(container);
  clearAnimationMarkers();
}

async function sendTopicChat() {
  await sendChatToRoom(currentTopicRoom, 'topic-chat-input', 'topic', renderTopicChatMessages);
}

document.getElementById('topic-chat-input').addEventListener('keydown', e => {
  if (e.key === 'Enter' && !document.getElementById('topic-chat-mention-dropdown').classList.contains('open')) sendTopicChat();
});

// ═══════════════════════════════════════════════════════════════
//  @ MENTION AUTOCOMPLETE
// ═══════════════════════════════════════════════════════════════

function attachMentionAutocomplete(inputId, dropdownId) {
  const input = document.getElementById(inputId);
  const dropdown = document.getElementById(dropdownId);
  if (!input || !dropdown || input.dataset.mentionBound) return;
  input.dataset.mentionBound = 'true';

  function currentMentionQuery() {
    const val = input.value;
    const pos = input.selectionStart;
    const upToCursor = val.slice(0, pos);
    const match = upToCursor.match(/@([a-zA-Z0-9_-]*)$/);
    return match ? match[1] : null;
  }

  function renderDropdown() {
    const query = currentMentionQuery();
    if (query === null) { dropdown.classList.remove('open'); dropdown.innerHTML = ''; return; }
    const names = getUserNames().filter(n => n.toLowerCase().startsWith(query.toLowerCase()));
    if (names.length === 0) { dropdown.classList.remove('open'); dropdown.innerHTML = ''; return; }
    dropdown.innerHTML = names.slice(0, 8).map(n => `
      <div class="mention-option" onmousedown="event.preventDefault();applyMention('${inputId}','${n}')">
        <span class="mo-avatar">${escapeHtml(n.slice(0,2).toUpperCase())}</span>@${escapeHtml(n)}
      </div>
    `).join('');
    dropdown.classList.add('open');
  }

  input.addEventListener('input', renderDropdown);
  input.addEventListener('keyup', e => { if (e.key === 'ArrowUp' || e.key === 'ArrowDown' || e.key === 'Escape') { if (e.key === 'Escape') dropdown.classList.remove('open'); } });
  input.addEventListener('blur', () => { setTimeout(() => dropdown.classList.remove('open'), 150); });
  input.addEventListener('click', renderDropdown);
}

function applyMention(inputId, name) {
  const input = document.getElementById(inputId);
  const val = input.value;
  const pos = input.selectionStart;
  const upToCursor = val.slice(0, pos);
  const match = upToCursor.match(/@([a-zA-Z0-9_-]*)$/);
  if (!match) return;
  const before = val.slice(0, match.index);
  const after = val.slice(pos);
  const newVal = before + '@' + name + ' ' + after;
  input.value = newVal;
  const newPos = (before + '@' + name + ' ').length;
  input.setSelectionRange(newPos, newPos);
  input.focus();
  const dropdownId = inputId === 'chat-input' ? 'chat-mention-dropdown' : 'topic-chat-mention-dropdown';
  document.getElementById(dropdownId).classList.remove('open');
}

// ═══════════════════════════════════════════════════════════════
//  MESSAGE ACTIONS: react, reply, delete (tap a message, Instagram-style)
// ═══════════════════════════════════════════════════════════════

const QUICK_EMOJIS = ['❤️', '😂', '😮', '😢', '🔥', '👍'];
let activeMsgAction = null; // { room, id }
let replyContext = { global: null, topic: null, dm: null };

// DM threads are identified to the shared action-sheet code with a
// "dm:<friendName>" pseudo-room string so openMsgActions/toggleReaction/etc.
// can tell a DM apart from a global/topic room without a parallel code path.
function isDmRoom(room) {
  return typeof room === 'string' && room.indexOf('dm:') === 0;
}
function dmFriendFromRoom(room) {
  return room.slice(3);
}
// Global/room chat messages use `author`; DM messages use `from`. Read
// whichever is present so shared code doesn't need to branch every time.
function msgAuthorName(msg) {
  return msg.author || msg.from;
}

function findMessage(room, id) {
  if (isDmRoom(room)) return getDmMessages(dmFriendFromRoom(room)).find(m => m.id === id) || null;
  return getMessages(room).find(m => m.id === id) || null;
}

function openMsgActions(room, id, anchorEl) {
  const msg = findMessage(room, id);
  if (!msg) return;
  activeMsgAction = { room, id };

  // populate emoji row
  const quickRow = document.getElementById('bubble-emoji-row');
  quickRow.innerHTML = QUICK_EMOJIS.map(e => `<button class="bubble-emoji-btn" onclick="quickReact('${e}')">${e}</button>`).join('');

  const authorName = msgAuthorName(msg);

  // show/hide delete
  const deleteBtn = document.getElementById('msg-action-delete');
  const canDelete = currentUser && (authorName === currentUser.name || currentAdmin);
  deleteBtn.style.display = canDelete ? 'flex' : 'none';

  // show report only for messages that aren't your own
  const reportBtn = document.getElementById('msg-action-report');
  reportBtn.style.display = (currentUser && authorName !== currentUser.name) ? 'flex' : 'none';

  // position bubble near the message
  const bubble = document.getElementById('msg-action-bubble');
  bubble.classList.add('open');
  document.getElementById('bubble-backdrop').classList.add('open');

  // Calculate position
  const rect = anchorEl ? anchorEl.getBoundingClientRect() : { top: window.innerHeight / 2, left: window.innerWidth / 2, width: 0, height: 0 };
  const bw = 220; // approx bubble width
  const bh = 170; // approx bubble height
  const margin = 8;

  let top = rect.top - bh - margin;
  let left = rect.left;

  // flip below if no room above
  if (top < margin) top = rect.bottom + margin;
  // clamp horizontally
  if (left + bw > window.innerWidth - margin) left = window.innerWidth - bw - margin;
  if (left < margin) left = margin;
  // clamp vertically
  if (top + bh > window.innerHeight - margin) top = window.innerHeight - bh - margin;

  bubble.style.top = top + 'px';
  bubble.style.left = left + 'px';
  bubble.style.transformOrigin = rect.top > window.innerHeight / 2 ? 'bottom left' : 'top left';
}

function closeMsgActions() {
  document.getElementById('msg-action-bubble').classList.remove('open');
  document.getElementById('bubble-backdrop').classList.remove('open');
  activeMsgAction = null;
}

// Attach long-press to all .chat-msg elements in a container
function attachLongPress(container) {
  container.querySelectorAll('.chat-msg').forEach(el => {
    let timer = null;
    let moved = false;

    const start = (e) => {
      moved = false;
      timer = setTimeout(() => {
        if (!moved) {
          e.preventDefault();
          const id = el.dataset.msgId;
          const room = el.dataset.room;
          openMsgActions(room, id, el);
        }
      }, 420);
    };
    const cancel = () => { clearTimeout(timer); };
    const move = () => { moved = true; clearTimeout(timer); };

    el.addEventListener('pointerdown', start, { passive: true });
    el.addEventListener('pointerup', cancel);
    el.addEventListener('pointercancel', cancel);
    el.addEventListener('pointermove', move);

    // right-click on desktop
    el.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      openMsgActions(el.dataset.room, el.dataset.msgId, el);
    });
  });
}

function toggleReaction(room, id, emoji) {
  if (!currentUser) return;
  if (isDmRoom(room)) { toggleDmReaction(dmFriendFromRoom(room), id, emoji); return; }
  const msgs = getMessages(room);
  const msg = msgs.find(m => m.id === id);
  if (!msg) return;
  if (!msg.reactions[emoji]) msg.reactions[emoji] = [];
  const idx = msg.reactions[emoji].indexOf(currentUser.name);
  if (idx > -1) msg.reactions[emoji].splice(idx, 1);
  else msg.reactions[emoji].push(currentUser.name);
  if (msg.reactions[emoji].length === 0) delete msg.reactions[emoji];
  saveMessages(room, msgs);
  // Only pop the pill if the reaction still exists (i.e. it wasn't just removed).
  lastReactionPop = msg.reactions[emoji] ? { room, id, emoji } : null;
  refreshChatView(room);

  // Persist to Supabase so other people actually see the reaction — this was
  // previously local-only, so a reaction never left your own browser. Only a
  // numeric (DB) id can be written; a still-pending/local-only message just
  // keeps the reaction locally until it syncs.
  if (isDbConnected() && sb && /^\d+$/.test(String(id))) {
    sb.from('chat_messages').update({ reactions: msg.reactions }).eq('id', Number(id)).then(() => {});
  }
}

function quickReact(emoji) {
  if (!activeMsgAction) return;
  toggleReaction(activeMsgAction.room, activeMsgAction.id, emoji);
  closeMsgActions();
}

function refreshChatView(room) {
  if (isDmRoom(room)) { if (dmFriendFromRoom(room) === dmActiveFriend) renderDmMessages(); return; }
  if (room === currentRoom) renderChatMessages();
  if (room === currentTopicRoom) renderTopicChatMessages();
}

function startReplyFromSheet() {
  if (!activeMsgAction) return;
  const { room, id } = activeMsgAction;
  const msg = findMessage(room, id);
  if (!msg) return;

  let key, prefix, inputId;
  if (isDmRoom(room)) { key = 'dm'; prefix = 'dm'; inputId = 'dm-input'; }
  else if (room === currentRoom) { key = 'global'; prefix = 'chat'; inputId = 'chat-input'; }
  else { key = 'topic'; prefix = 'topic-chat'; inputId = 'topic-chat-input'; }
  replyContext[key] = id;

  const authorName = msgAuthorName(msg);
  const previewSource = msg.text || (msg.songKey ? '🎵 Shared a song' : '');
  const authorEl = document.getElementById(prefix + '-reply-author');
  const previewEl = document.getElementById(prefix + '-reply-preview');
  const bannerEl = document.getElementById(prefix + '-reply-banner');
  authorEl.textContent = key === 'dm' && authorName === currentUser.name ? 'yourself' : '@' + authorName;
  previewEl.textContent = previewSource.length > 40 ? previewSource.slice(0, 40) + '…' : previewSource;
  bannerEl.style.display = 'flex';

  closeMsgActions();
  document.getElementById(inputId).focus();
}

function cancelReply(which) {
  replyContext[which] = null;
  const prefix = which === 'global' ? 'chat' : which === 'topic' ? 'topic-chat' : 'dm';
  const bannerEl = document.getElementById(prefix + '-reply-banner');
  if (bannerEl) bannerEl.style.display = 'none';
}

async function deleteMsgFromSheet() {
  if (!activeMsgAction) return;
  if (!confirm('Delete this message?')) return;
  const { room, id } = activeMsgAction;
  closeMsgActions();

  if (isDmRoom(room)) {
    await deleteDmMessageById(dmFriendFromRoom(room), id);
    return;
  }

  // The database id is a bigint. The old code passed the browser-generated
  // string id ("m_1699..."), so the delete never matched a row — the message
  // vanished locally and came straight back on the next sync.
  const isDbRow = /^\d+$/.test(String(id));

  if (isDbConnected() && sb && isDbRow) {
    const { error } = await sb.from('chat_messages').delete().eq('id', Number(id));
    if (error) {
      showToast(/policy|row-level/i.test(error.message)
        ? "You can only delete your own messages."
        : 'Could not delete: ' + error.message, { type: 'error' });
      return;
    }
  }
  const msgs = getMessages(room).filter(m => m.id !== id);
  saveMessages(room, msgs);
  refreshChatView(room);
  renderRoomList();
}

// ═══════════════════════════════════════════════════════════════
//  FULL EMOJI PICKER
// ═══════════════════════════════════════════════════════════════

const EMOJI_CATEGORIES = {
  'Smileys': ['😀','😃','😄','😁','😆','😅','🤣','😂','🙂','🙃','😉','😊','😇','🥰','😍','🤩','😘','😗','😚','😙','😋','😛','😜','🤪','😝','🤑','🤗','🤭','🤫','🤔','🤐','🤨','😐','😑','😶','😏','😒','🙄','😬','🤥','😌','😔','😪','🤤','😴','😷','🤒','🤕','🤢','🤮','🤧','🥵','🥶','🥴','😵','🤯','🤠','🥳','😎','🤓','🧐'],
  'Emotions': ['😕','😟','🙁','☹️','😮','😯','😲','😳','🥺','😦','😧','😨','😰','😥','😢','😭','😱','😖','😣','😞','😓','😩','😫','🥱','😤','😡','😠','🤬','😈','👿','💀','☠️','💩','🤡','👹','👺','👻','👽','🤖'],
  'Hearts': ['❤️','🧡','💛','💚','💙','💜','🖤','🤍','🤎','💔','❣️','💕','💞','💓','💗','💖','💘','💝','💟','♥️'],
  'Gestures': ['👋','🤚','🖐️','✋','🖖','👌','🤌','🤏','✌️','🤞','🤟','🤘','🤙','👈','👉','👆','🖕','👇','☝️','👍','👎','✊','👊','🤛','🤜','👏','🙌','👐','🤲','🙏','✍️','💪'],
  'People': ['👶','🧒','👦','👧','🧑','👱','👨','🧔','👩','🧓','👴','👵','😺','😸','😹','😻','😼','😽','🙀','😿','😾'],
  'Animals': ['🐶','🐱','🐭','🐹','🐰','🦊','🐻','🐼','🐨','🐯','🦁','🐮','🐷','🐸','🐵','🐔','🐧','🐦','🐤','🦆','🦅','🦉','🦇','🐺','🐗','🐴','🦄','🐝','🐛','🦋','🐌','🐞','🐢','🐍','🦖','🐙','🦑','🦀','🐠','🐬','🐳','🐘','🦒','🦓','🦍'],
  'Food': ['🍎','🍐','🍊','🍋','🍌','🍉','🍇','🍓','🫐','🍈','🍒','🍑','🥭','🍍','🥥','🥝','🍅','🍆','🥑','🍕','🍔','🍟','🌭','🥪','🌮','🌯','🍿','🧂','🥓','🍳','🧇','🥞','🧀','🍗','🍖','🍤','🍣','🍜','🍝','🍲','🥗','🍱','🍙','🍚','🍘','🍥','🍡','🍦','🍧','🍨','🍩','🍪','🎂','🍰','🧁','🥧','🍫','🍬','🍭','☕','🍵','🧃','🥤','🍺','🍷','🥂'],
  'Activities': ['⚽','🏀','🏈','⚾','🎾','🏐','🏉','🎱','🏓','🏸','🥊','🎯','🎮','🎲','🎸','🎹','🥁','🎤','🎧','🎨','🎬','🎭','🎪','🚀','✈️','🚗','🚲','⛷️','🏂','🏄','🎣'],
  'Symbols': ['⭐','🌟','✨','⚡','🔥','💥','☀️','🌙','🌈','☁️','❄️','💧','🌊','🎵','🎶','💫','💯','✅','❌','❓','❗','💤','💬','👀','🕊️']
};

function openEmojiPicker() {
  const body = document.getElementById('emoji-picker-body');
  body.innerHTML = Object.entries(EMOJI_CATEGORIES).map(([cat, emojis]) => `
    <div class="emoji-picker-cat-label">${cat}</div>
    <div class="emoji-picker-grid">
      ${emojis.map(e => `<button onclick="pickFromFullPicker('${e}')">${e}</button>`).join('')}
    </div>
  `).join('');
  document.getElementById('emoji-picker-overlay').classList.add('open');
}

function closeEmojiPicker() {
  document.getElementById('emoji-picker-overlay').classList.remove('open');
}

function pickFromFullPicker(emoji) {
  if (!activeMsgAction) { closeEmojiPicker(); return; }
  toggleReaction(activeMsgAction.room, activeMsgAction.id, emoji);
  closeEmojiPicker();
  closeMsgActions();
}


// ═══════════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════════
//  LIVE CHAT (Supabase Realtime)
//
//  This is what was missing. Before, chat_messages was fetched exactly
//  twice — once when you opened the chat page, once when you switched
//  rooms — and never again. Nothing subscribed to new rows, and the
//  table was never even added to the `supabase_realtime` publication,
//  so the server had nothing to push. Other people's messages only
//  appeared if you left the room and came back.
//
//  Now: one channel per room, opened when you enter and torn down when
//  you leave. INSERT appends, DELETE removes, both re-render instantly.
// ═══════════════════════════════════════════════════════════════

let roomChannel = null;          // active realtime channel
let roomChannelName = null;      // which room it's for
let roomChannelStatus = 'idle';  // idle | connecting | live | error

// Messages sent from THIS browser echo back over realtime a moment later.
// We stash the temp id against the text+author so the echo replaces the
// optimistic copy instead of showing the message twice.
const pendingLocalSends = [];

// Resolves the real (numeric) Supabase row id for a message that was posted
// optimistically under a temp id. moderateAfterSend awaits this instead of
// just snapshotting target.id, so a moderation verdict that comes back
// before the insert has finished promoting the id no longer gets silently
// dropped — it waits for the real id, then applies the mask/delete.
// Resolves to null if the message never made it into the DB (offline/local
// mode, or the insert failed).
const dbIdResolvers = {}; // tempId -> { promise, resolve }
function registerPendingDbId(tempId) {
  let resolve;
  const promise = new Promise((res) => { resolve = res; });
  dbIdResolvers[tempId] = { promise, resolve };
}
function resolvePendingDbId(tempId, id) {
  const entry = dbIdResolvers[tempId];
  if (entry) {
    entry.resolve(id);
    delete dbIdResolvers[tempId];
  }
}

function setChatLiveIndicator(state) {
  roomChannelStatus = state;
  document.querySelectorAll('.chat-live-dot').forEach(el => {
    el.classList.toggle('is-live', state === 'live');
    el.classList.toggle('is-error', state === 'error');
    el.title = state === 'live' ? 'Live — new messages appear instantly'
             : state === 'error' ? 'Live connection lost — messages may be delayed'
             : 'Connecting…';
  });
}

function teardownRoomRealtime() {
  if (roomChannel && sb) {
    try { sb.removeChannel(roomChannel); } catch (e) { /* ignore */ }
  }
  roomChannel = null;
  roomChannelName = null;
  setChatLiveIndicator('idle');
}

// Opens (or re-points) the live channel for one room.
function subscribeToRoom(room) {
  if (!isDbConnected() || !sb || !room) { teardownRoomRealtime(); return; }
  if (roomChannelName === room && roomChannel) return; // already listening
  teardownRoomRealtime();
  roomChannelName = room;
  setChatLiveIndicator('connecting');

  try {
    roomChannel = sb.channel('room-' + room)
      .on('postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'chat_messages', filter: 'room=eq.' + room },
        payload => handleIncomingChatRow(room, payload.new))
      .on('postgres_changes',
        { event: 'DELETE', schema: 'public', table: 'chat_messages' },
        payload => handleDeletedChatRow(room, payload.old))
      .on('postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'chat_messages', filter: 'room=eq.' + room },
        payload => handleUpdatedChatRow(room, payload.new))
      .subscribe(status => {
        if (status === 'SUBSCRIBED') setChatLiveIndicator('live');
        else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') setChatLiveIndicator('error');
      });
  } catch (e) {
    console.error('Chat realtime subscribe failed:', e);
    setChatLiveIndicator('error');
  }
}

// A new row landed for this room.
function handleIncomingChatRow(room, row) {
  if (!row) return;
  const msgs = getMessages(room);
  const dbId = String(row.id);

  // Already have it (e.g. a sync raced the realtime event)? Do nothing.
  if (msgs.some(m => m.id === dbId)) return;

  // Is this the echo of a message we just sent optimistically? If so,
  // upgrade the temp row to the real DB id rather than appending a copy.
  const pendingIdx = pendingLocalSends.findIndex(
    p => p.room === room && p.author === row.author && p.text === row.text && (p.gifUrl || null) === (row.gif_url || null)
  );
  if (pendingIdx > -1) {
    const pending = pendingLocalSends.splice(pendingIdx, 1)[0];
    const local = msgs.find(m => m.id === pending.tempId);
    if (local) {
      local.id = dbId;
      local.time = new Date(row.created_at).getTime();
      local.replyTo = row.reply_to != null ? String(row.reply_to) : null;
      saveMessages(room, msgs);
      refreshChatView(room);
      return;
    }
  }

  msgs.push(migrateMessage({
    id: dbId,
    author: row.author,
    text: row.text,
    gifUrl: row.gif_url || null,
    time: new Date(row.created_at).getTime(),
    replyTo: row.reply_to != null ? String(row.reply_to) : null,
    reactions: {}
  }));
  msgs.sort((a, b) => a.time - b.time);
  saveMessages(room, msgs);
  refreshChatView(room);
  renderRoomList();

  // Someone else said something while you're looking elsewhere on the site.
  if (currentUser && row.author !== currentUser.name && room !== currentRoom && room !== currentTopicRoom) {
    markRoomUnread(room);
  }
}

// A row was updated (reaction toggled, or moderation masked the text) —
// by someone else, possibly. Patch our local copy and re-render.
function handleUpdatedChatRow(room, row) {
  if (!row || row.id == null) return;
  const dbId = String(row.id);
  const msgs = getMessages(room);
  const target = msgs.find(m => m.id === dbId);
  if (!target) return;
  target.reactions = row.reactions || {};
  if (row.text !== undefined && row.text !== null && row.text !== target.text) target.text = row.text;
  saveMessages(room, msgs);
  refreshChatView(room);
}

function handleDeletedChatRow(room, oldRow) {
  if (!oldRow || oldRow.id == null) return;
  const dbId = String(oldRow.id);
  [room, currentRoom, currentTopicRoom].filter(Boolean).forEach(r => {
    const msgs = getMessages(r);
    const next = msgs.filter(m => m.id !== dbId);
    if (next.length !== msgs.length) {
      saveMessages(r, next);
      refreshChatView(r);
    }
  });
}

// Small unread marker so rooms in the drawer show a dot.
function markRoomUnread(room) {
  try {
    const set = JSON.parse(localStorage.getItem('al-unread-rooms') || '[]');
    if (!set.includes(room)) {
      set.push(room);
      localStorage.setItem('al-unread-rooms', JSON.stringify(set));
    }
  } catch (e) { /* ignore */ }
  renderRoomList();
}
function clearRoomUnread(room) {
  try {
    const set = JSON.parse(localStorage.getItem('al-unread-rooms') || '[]');
    localStorage.setItem('al-unread-rooms', JSON.stringify(set.filter(r => r !== room)));
  } catch (e) { /* ignore */ }
}
function isRoomUnread(room) {
  try { return JSON.parse(localStorage.getItem('al-unread-rooms') || '[]').includes(room); }
  catch (e) { return false; }
}

// Shared send path for both the global room and topic rooms — the two used
// to be near-identical copies that drifted apart, and both carried the same
// two bugs: reply_to was sent as a local string id (the column is bigint, so
// every reply silently failed to reach the database), and nothing checked
// whether the insert succeeded.
// Runs moderation AFTER a message is already visible/sent, so typing → send
// feels instant instead of waiting on the moderate-message round trip.
// Looks the message up by its stable `localId` (survives the tempId → DB id
// promotion below) and removes it — locally and in Supabase — if flagged.
async function moderateAfterSend(room, text, context, localId) {
  const verdict = await moderateText(text, context, room);

  // Figure out the real DB row id for this message, waiting for the insert
  // to finish if it hasn't yet — instead of just checking target.id once
  // and giving up. Without this, a fast moderation verdict racing ahead of
  // the insert would silently skip the mask/delete and the raw text would
  // sit in Supabase forever (visible again on next refresh).
  async function resolveDbId() {
    const msgs = getMessages(room);
    const target = msgs.find(m => m.localId === localId);
    if (target && /^\d+$/.test(String(target.id))) return Number(target.id);
    const entry = dbIdResolvers[localId];
    if (!entry) return null; // never registered (offline/local mode) or already resolved+cleared with no id
    const id = await entry.promise;
    return id != null ? Number(id) : null;
  }

  if (verdict.action !== 'block' && verdict.action !== 'self_harm') {
    // Allowed, but the moderator may have returned masked/cleaned text —
    // patch the already-sent message in place if so.
    if (verdict.text && verdict.text !== text) {
      const msgs = getMessages(room);
      const target = msgs.find(m => m.localId === localId);
      if (target) {
        target.text = verdict.text;
        saveMessages(room, msgs);
        refreshChatView(room);
        if (isDbConnected() && sb) {
          const dbId = await resolveDbId();
          if (dbId != null) {
            sb.from('chat_messages').update({ text: verdict.text }).eq('id', dbId).then(() => {});
          }
        }
      }
    }
    return;
  }

  // Flagged — delete it after the fact.
  const msgs = getMessages(room);
  const target = msgs.find(m => m.localId === localId);
  if (isDbConnected() && sb) {
    const dbId = await resolveDbId();
    if (dbId != null) {
      await sb.from('chat_messages').delete().eq('id', dbId);
    }
  }
  saveMessages(room, msgs.filter(m => m.localId !== localId));
  refreshChatView(room);
  renderRoomList();

  if (verdict.action === 'self_harm') {
    showToast(verdict.supportMessage || "If you're struggling, you don't have to go through it alone — reach out to someone you trust or a crisis line.", { type: 'error', duration: 9000 });
  } else {
    showToast("That message was removed — it doesn't meet our community guidelines.", { type: 'error' });
  }
}

// gifUrl is optional — pass it (with inputId left pointing at the room's
// text input) to post a GIF instead of/alongside typed text, same idea as
// sendDmMessage(text, songKey, gifUrl) in profile.js.
// ---- GIF sharing in room/global chat (reuses the DM's Giphy picker modal
// and loadGifResults() from profile.js — see handleGifPicked() there) ----
let gifRoomTarget = null; // { room, inputId, replyKey, rerender }
async function openGifSharePickerForRoom() {
  if (!currentUser) { showSignup(); return; }
  const isGlobal = currentRoom === 'general';
  gifRoomTarget = {
    room: currentRoom,
    inputId: isGlobal ? 'chat-input' : 'topic-chat-input',
    replyKey: isGlobal ? 'global' : 'topic',
    rerender: isGlobal ? renderChatMessages : renderTopicChatMessages
  };
  gifShareContext = 'room';
  document.getElementById('gif-share-target-name').textContent = isGlobal ? 'Global Chat' : '#' + currentRoom;
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
function sendGifToRoom(url) {
  if (!gifRoomTarget) return;
  sendChatToRoom(gifRoomTarget.room, gifRoomTarget.inputId, gifRoomTarget.replyKey, gifRoomTarget.rerender, url);
}

async function sendChatToRoom(room, inputId, replyKey, rerender, gifUrl) {
  if (!currentUser || !room) return;
  const input = document.getElementById(inputId);
  if (!input) return;
  const text = input.value.trim();
  if (!text && !gifUrl) return;
  if (text.length > 2000) {
    showToast('That message is too long (2000 characters max).', { type: 'error' });
    return;
  }
  if (!canSendMessageNow()) return;

  input.value = '';

  // Only a numeric (database) id is a valid reply target. A reply to a
  // message that only exists locally is sent as a plain message instead of
  // failing the whole insert.
  const rawReply = replyContext[replyKey];
  const replyDbId = rawReply && /^\d+$/.test(String(rawReply)) ? Number(rawReply) : null;

  const tempId = 'tmp_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8);
  const msgs = getMessages(room);
  const newMsg = {
    id: tempId, localId: tempId, author: currentUser.name, text: text, gifUrl: gifUrl || null,
    time: Date.now(), replyTo: rawReply || null, reactions: {}, pending: true
  };
  msgs.push(newMsg);
  saveMessages(room, msgs);
  lastSentMsgId = tempId;
  cancelReply(replyKey);
  rerender();
  renderRoomList();

  input.focus();
  input.classList.remove('input-sent-pulse');
  void input.offsetWidth;
  input.classList.add('input-sent-pulse');

  // Kick off moderation in the background — do NOT await it. The message is
  // already posted; if it gets flagged, moderateAfterSend deletes it once
  // the verdict comes back instead of holding up the send. It awaits the DB
  // id via registerPendingDbId/resolvePendingDbId below rather than racing
  // the insert below, so the mask/delete never gets silently dropped.
  registerPendingDbId(tempId);
  if (text) moderateAfterSend(room, text, room === 'general' ? 'global' : 'topic', tempId);

  if (!isDbConnected() || !sb) { resolvePendingDbId(tempId, null); return; } // local-only mode, nothing more to do

  pendingLocalSends.push({ room, author: currentUser.name, text: text, gifUrl: gifUrl || null, tempId });

  const { data, error } = await sb.from('chat_messages')
    .insert({ room: room, author: currentUser.name, text: text || null, gif_url: gifUrl || null, reply_to: replyDbId })
    .select('id, created_at')
    .single();

  if (error) {
    // Roll the optimistic message back and say what happened, instead of
    // leaving it sitting there looking sent when it never left the browser.
    resolvePendingDbId(tempId, null);
    const idx = pendingLocalSends.findIndex(p => p.tempId === tempId);
    if (idx > -1) pendingLocalSends.splice(idx, 1);
    const list = getMessages(room).filter(m => m.id !== tempId);
    saveMessages(room, list);
    rerender();
    const friendly = /rate|too fast|slow down/i.test(error.message)
      ? 'Sending too fast — wait a second and try again.'
      : /row-level security|policy/i.test(error.message)
        ? 'Your session expired. Log out and back in to keep chatting.'
        : 'Message failed to send: ' + error.message;
    showToast(friendly, { type: 'error' });
    input.value = text;
    return;
  }

  resolvePendingDbId(tempId, data && data.id != null ? data.id : null);

  // Insert succeeded. Promote the temp row now rather than waiting for the
  // realtime echo, so the message is immediately replyable/deletable.
  // `localId` is left untouched so moderateAfterSend can still find it.
  if (data && data.id != null) {
    const idx = pendingLocalSends.findIndex(p => p.tempId === tempId);
    if (idx > -1) pendingLocalSends.splice(idx, 1);
    const list = getMessages(room);
    const local = list.find(m => m.id === tempId);
    if (local) {
      local.id = String(data.id);
      delete local.pending;
      if (data.created_at) local.time = new Date(data.created_at).getTime();
      saveMessages(room, list);
      if (lastSentMsgId === tempId) lastSentMsgId = local.id;
      rerender();
    }
  }
}
