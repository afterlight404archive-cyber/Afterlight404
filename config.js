// AFTERLIGHT — SITE CONFIG
// ═══════════════════════════════════════════════════════════════
// The Supabase project every visitor connects to automatically, kept in its own
// file (separate from supabase.js / the rest of the app code) so it's easy to
// find, swap, or exclude from version control on its own.
//
// The "key" below is the publishable/anon key — it is DESIGNED to be public and
// shipped to every visitor's browser. It is not a secret. Actual write access is
// controlled entirely by the Row Level Security policies from the Setup SQL
// (Admin Panel → Database), not by keeping this key hidden. Rotating it (if you
// ever suspect abuse) is done from Supabase → Project Settings → API.
window.AFTERLIGHT_DB_CONFIG = {
  url: 'https://yhpqyjdluppjmmhrybfy.supabase.co',
  key: 'sb_publishable_Jb2_sKuwvQvuZENEzT3L5A_Nv5up7cq'
};

// ═══════════════════════════════════════════════════════════════
// EMAILJS — sends the real "here's your 6-digit code" email on signup.
// EmailJS lets a static site (no backend) send email straight from the
// browser using a public key, same spirit as the Supabase key above: it's
// meant to be shipped to every visitor, not a secret. Actual sending still
// requires the visitor to be a human filling out YOUR site's signup form,
// so exposing it isn't a bypassable write-access hole the way a database
// key would be.
//
// TO SET THIS UP (~5 minutes, free tier = 200 emails/month):
//   1. Create a free account at https://www.emailjs.com
//   2. Email Services (left nav) → Add New Service → connect Gmail/Outlook/
//      any SMTP inbox you control → copy the "Service ID" it gives you.
//   3. Email Templates → Create New Template. Use these variable names in
//      the template body so they match what the code below sends:
//        {{to_email}}   — recipient's address
//        {{to_name}}    — the anonymous name they chose
//        {{passcode}}   — the 6-digit code
//      Example template body:
//        "Hi {{to_name}}, your AfterLight verification code is {{passcode}}.
//         It expires in 15 minutes."
//      Copy the "Template ID" it gives you.
//   4. Account → General → copy your "Public Key".
//   5. Paste all three below. That's it — no server, no secret key needed.
//
// Until these are filled in, the app automatically falls back to showing
// the code directly on-screen (the old "demo mode" behavior) so signup
// still works end-to-end while you're setting this up.
//
// You can also skip editing this file entirely and paste these three values
// into Admin → Email (OTP) instead — that path saves to this browser and,
// once connected, syncs to Supabase so every visitor's browser picks it up
// automatically. Whichever is filled in (admin panel or here) is used.
window.AFTERLIGHT_EMAILJS_CONFIG = {
  publicKey: '',   // e.g. 'AbCdEfGhIjKlMnOp'
  serviceId: '',   // e.g. 'service_xxxxxxx'
  templateId: ''   // e.g. 'template_xxxxxxx'
};

// ═══════════════════════════════════════════════════════════════
// GIPHY — powers the GIF picker in DMs (search box + results grid).
// Same spirit as the keys above: a public client key meant to be shipped
// to every visitor's browser, not a secret.
//
// TO SET THIS UP (~2 minutes, free):
//   1. Go to https://developers.giphy.com/dashboard/?create=true, sign up
//      or log in, and click "Create an API Key" (select "API", not "SDK").
//   2. Give it a name/description, agree to the terms, and it'll hand you
//      a key immediately. Beta keys are rate-limited to 100 calls/hour,
//      which is plenty for a site like this — you can apply to upgrade to
//      a production key later from the same dashboard if you outgrow it.
//   3. Copy the API key it gives you and paste it below.
//
// Until this is filled in, the GIF button will show a "not set up yet"
// message instead of results.
window.AFTERLIGHT_GIPHY_CONFIG = {
  apiKey: ''   // e.g. 'AbCdEfGhIjKlMnOpQrStUvWxYz123456'
};

// Prefers whatever's been pasted into Admin → Chat System → GIF Search
// (saved to localStorage and synced to every visitor via Supabase
// site_settings), and falls back to the window.AFTERLIGHT_GIPHY_CONFIG
// above if the admin panel hasn't been used yet — so either setup path
// works. This is the one place chat.js/profile.js/admin.js should read
// the Giphy key from.
function getGiphyConfig() {
  const local = (typeof localStorage !== 'undefined')
    ? { apiKey: localStorage.getItem('al-giphy-apikey') || '' }
    : null;
  if (local && local.apiKey) return local;
  const fileCfg = (typeof window !== 'undefined' && window.AFTERLIGHT_GIPHY_CONFIG) || null;
  if (!fileCfg || !fileCfg.apiKey) return { apiKey: '' };
  return fileCfg;
}

// getGiphyConfig() above only ever checks localStorage/config.js — it was
// written assuming refreshGiphyConfigFromDb() (admin.js) had already run,
// but that function only fires when an admin opens the admin panel's Chat
// tab. Every other visitor's browser (mobile included) never pulls the key
// down from Supabase at all, so their localStorage stays empty forever even
// after an admin has saved a key. site_settings is public-read, so any
// visitor can fetch it directly — this does that once, caches it to
// localStorage, and every future getGiphyConfig() call picks it up from
// there. Call this (and await it) before the very first GIF picker open in
// a session.
let giphySyncAttempted = false;
async function ensureGiphyConfigSynced() {
  if (giphySyncAttempted) return;
  giphySyncAttempted = true;
  if (localStorage.getItem('al-giphy-apikey')) return; // already have one cached
  if (typeof isDbConnected !== 'function' || !isDbConnected() || typeof sb === 'undefined' || !sb) return;
  try {
    const { data, error } = await sb.from('site_settings').select('value').eq('key', 'giphy_apikey').maybeSingle();
    if (error) throw error;
    if (data && data.value) localStorage.setItem('al-giphy-apikey', data.value);
  } catch (e) {
    console.error('Could not sync Giphy key from Supabase:', e);
  }
}
