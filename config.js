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
