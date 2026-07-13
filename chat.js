//  CHAT
// ═══════════════════════════════════════════════════════════════

function initChat() {
  const wall = document.getElementById('chat-login-wall');
  const layout = document.getElementById('chat-layout');
  if (!currentUser) { wall.style.display = 'block'; layout.style.display = 'none'; return; }
  wall.style.display = 'none'; layout.style.display = 'grid';
  currentRoom = 'general';
  renderRoomList();
  syncRoomMessages('general').then(renderChatMessages);
  attachMentionAutocomplete('chat-input', 'chat-mention-dropdown');
  startChatPolling();
}

// Previously, messages only ever got pulled from Supabase when a room was first
// opened (syncRoomMessages calls above/below) — so if you stayed in a room, a
// message someone else sent from another device just never appeared until you
// left and re-entered, or reloaded the page. This polls whatever's actually
// visible (global chat room or an open topic thread) every few seconds and only
// re-renders when something genuinely changed, so an open chat behaves live
// without constantly resetting your scroll position for no reason.
let chatPollTimer = null;
function startChatPolling() {
  if (chatPollTimer) return;
  chatPollTimer = setInterval(async () => {
    if (!currentUser || !isDbConnected()) return;
    const chatPageVisible = (document.getElementById('page-chat') && document.getElementById('page-chat').classList.contains('active')) || isChatDrawerOpen();
    if (chatPageVisible && currentRoom) {
      const before = getMessages(currentRoom).map(m => m.id).join(',');
      await syncRoomMessages(currentRoom);
      if (getMessages(currentRoom).map(m => m.id).join(',') !== before) renderChatMessages();
      renderRoomList();
    }
    if (currentTopicRoom) {
      const before = getMessages(currentTopicRoom).map(m => m.id).join(',');
      await syncRoomMessages(currentTopicRoom);
      if (getMessages(currentTopicRoom).map(m => m.id).join(',') !== before) renderTopicChatMessages();
    }
  }, 5000);
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
  renderRoomList();
  syncRoomMessages(name).then(renderChatMessages);
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
      const msgs = data.map(m => migrateMessage({ id: m.id ? String(m.id) : undefined, author: m.author, text: m.text, time: new Date(m.created_at).getTime(), replyTo: m.reply_to || null, reactions: m.reactions || {} }));
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
        const preview = orig.text.length > 60 ? orig.text.slice(0, 60) + '…' : orig.text;
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
        <div class="chat-msg-text">${linkifyText(m.text)}</div>
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
  meta.innerHTML = isGlobal
    ? '<span class="chat-online-dot"></span>' + getLiveOnlineCount().toLocaleString() + ' online'
    : msgs.length + ' messages';
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
  if (!currentUser) return;
  const input = document.getElementById('chat-input');
  const text = input.value.trim();
  if (!text) return;
  if (!canSendMessageNow()) return;
  input.value = '';
  const verdict = await moderateText(text, 'global', currentRoom);
  const finalText = handleModerationVerdict(verdict, text);
  if (finalText === null) return;
  const msgs = getMessages(currentRoom);
  const newMsg = { id: 'm_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8), author: currentUser.name, text: finalText, time: Date.now(), replyTo: replyContext.global, reactions: {} };
  msgs.push(newMsg);
  saveMessages(currentRoom, msgs);
  if (isDbConnected()) {
    sb.from('chat_messages').insert({ room: currentRoom, author: currentUser.name, text: finalText, reply_to: newMsg.replyTo }).then(({ error }) => {
      if (error) {
        console.error('Chat send failed:', error);
        showToast('That message only saved on this device — it failed to sync (' + error.message + '), so other people won\'t see it.', { type: 'error', duration: 8000 });
      }
    });
  }
  lastSentMsgId = newMsg.id;
  cancelReply('global');
  renderChatMessages();
  renderRoomList();
  // Keep the keyboard bar focused so chatting stays uninterrupted, and give
  // the input a quick smooth "settle" pulse to confirm the send landed.
  input.focus();
  input.classList.remove('input-sent-pulse');
  void input.offsetWidth; // restart animation
  input.classList.add('input-sent-pulse');
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
  syncRoomMessages(name).then(renderTopicChatMessages);
  attachMentionAutocomplete('topic-chat-input', 'topic-chat-mention-dropdown');
  renderRoomList();
  closeChatDrawer();
  startChatPolling();
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
  if (!currentUser || !currentTopicRoom) return;
  const input = document.getElementById('topic-chat-input');
  const text = input.value.trim();
  if (!text) return;
  if (!canSendMessageNow()) return;
  input.value = '';
  const verdict = await moderateText(text, 'topic', currentTopicRoom);
  const finalText = handleModerationVerdict(verdict, text);
  if (finalText === null) return;
  const msgs = getMessages(currentTopicRoom);
  const newMsg = { id: 'm_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8), author: currentUser.name, text: finalText, time: Date.now(), replyTo: replyContext.topic, reactions: {} };
  msgs.push(newMsg);
  saveMessages(currentTopicRoom, msgs);
  if (isDbConnected()) {
    sb.from('chat_messages').insert({ room: currentTopicRoom, author: currentUser.name, text: finalText, reply_to: newMsg.replyTo }).then(({ error }) => {
      if (error) {
        console.error('Topic chat send failed:', error);
        showToast('That message only saved on this device — it failed to sync (' + error.message + '), so other people won\'t see it.', { type: 'error', duration: 8000 });
      }
    });
  }
  lastSentMsgId = newMsg.id;
  cancelReply('topic');
  renderTopicChatMessages();
  input.focus();
  input.classList.remove('input-sent-pulse');
  void input.offsetWidth;
  input.classList.add('input-sent-pulse');
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
let replyContext = { global: null, topic: null };

function findMessage(room, id) {
  return getMessages(room).find(m => m.id === id) || null;
}

function openMsgActions(room, id, anchorEl) {
  const msg = findMessage(room, id);
  if (!msg) return;
  activeMsgAction = { room, id };

  // populate emoji row
  const quickRow = document.getElementById('bubble-emoji-row');
  quickRow.innerHTML = QUICK_EMOJIS.map(e => `<button class="bubble-emoji-btn" onclick="quickReact('${e}')">${e}</button>`).join('');

  // show/hide delete
  const deleteBtn = document.getElementById('msg-action-delete');
  const canDelete = currentUser && (msg.author === currentUser.name || currentAdmin);
  deleteBtn.style.display = canDelete ? 'flex' : 'none';

  // show report only for messages that aren't your own
  const reportBtn = document.getElementById('msg-action-report');
  reportBtn.style.display = (currentUser && msg.author !== currentUser.name) ? 'flex' : 'none';

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
}

function quickReact(emoji) {
  if (!activeMsgAction) return;
  toggleReaction(activeMsgAction.room, activeMsgAction.id, emoji);
  closeMsgActions();
}

function refreshChatView(room) {
  if (room === currentRoom) renderChatMessages();
  if (room === currentTopicRoom) renderTopicChatMessages();
}

function startReplyFromSheet() {
  if (!activeMsgAction) return;
  const { room, id } = activeMsgAction;
  const msg = findMessage(room, id);
  if (!msg) return;
  const isGlobal = room === currentRoom;
  const key = isGlobal ? 'global' : 'topic';
  replyContext[key] = id;

  const authorEl = document.getElementById((isGlobal ? 'chat' : 'topic-chat') + '-reply-author');
  const previewEl = document.getElementById((isGlobal ? 'chat' : 'topic-chat') + '-reply-preview');
  const bannerEl = document.getElementById((isGlobal ? 'chat' : 'topic-chat') + '-reply-banner');
  authorEl.textContent = '@' + msg.author;
  previewEl.textContent = msg.text.length > 40 ? msg.text.slice(0, 40) + '…' : msg.text;
  bannerEl.style.display = 'flex';

  closeMsgActions();
  document.getElementById(isGlobal ? 'chat-input' : 'topic-chat-input').focus();
}

function cancelReply(which) {
  replyContext[which] = null;
  const prefix = which === 'global' ? 'chat' : 'topic-chat';
  const bannerEl = document.getElementById(prefix + '-reply-banner');
  if (bannerEl) bannerEl.style.display = 'none';
}

function deleteMsgFromSheet() {
  if (!activeMsgAction) return;
  if (!confirm('Delete this message?')) return;
  const { room, id } = activeMsgAction;
  let msgs = getMessages(room);
  msgs = msgs.filter(m => m.id !== id);
  saveMessages(room, msgs);
  if (isDbConnected() && sb) {
    sb.from('chat_messages').delete().eq('room', room).eq('id', id).then(() => {});
  }
  closeMsgActions();
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
