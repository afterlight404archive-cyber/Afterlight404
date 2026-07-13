# AFTERLIGHT:404ARCHIVE — All Files

10 separate files, bundled into this one document just so it's one thing to download. They are NOT meant to be combined — your site still needs all 10 as separate files.

**How to use this on GitHub:** for each section below, click **Add file → Create new file** in your repo, type the exact filename shown in the heading (e.g. `index.html`), then copy everything inside that section's code block into it and commit. Repeat for all 10.

---

## `index.html`

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, viewport-fit=cover, interactive-widget=resizes-content">
<meta name="theme-color" content="#0C0B0F">
<meta name="format-detection" content="telephone=no">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<title>AFTERLIGHT:404ARCHIVE</title>
<meta name="description" content="A personal archive of niche indie, alternative & pop songs — with meanings, lyrics, and the moods they live in. Curated by JK.">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=IBM+Plex+Mono:wght@400;500&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet">
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.js"></script>
<script src="https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js"></script>
<link rel="stylesheet" href="styles.css">
</head>
<body>
<svg width="0" height="0" style="position:absolute" aria-hidden="true">
  <defs>
    <linearGradient id="noteGoldGrad" x1="10%" y1="0%" x2="90%" y2="100%">
      <stop offset="0%" stop-color="#f7e4b8"/>
      <stop offset="45%" stop-color="#c8a96e"/>
      <stop offset="100%" stop-color="#8f6f3e"/>
    </linearGradient>
    <symbol id="premNoteIcon" viewBox="0 0 32 32">
      <ellipse cx="10.2" cy="24.4" rx="6.3" ry="4.7" transform="rotate(-18 10.2 24.4)"/>
      <path d="M15.4 24.4V5.1c0-.86.53-1.62 1.34-1.92c3.62-1.34 7.62.36 9.02 3.98c1 2.6.24 5.42-1.86 7.06c-.52.4-1.26.06-1.26-.6c0-.28.12-.54.36-.72c1.32-1.02 1.82-2.76 1.2-4.34c-.9-2.32-3.42-3.42-5.7-2.6c-.4.14-.66.52-.66.94v17.5h-2.44z"/>
    </symbol>
  </defs>
</svg>
<div id="toast-stack" aria-live="polite" aria-atomic="true"></div>
<div class="notif-optin-banner" id="notif-optin-banner" style="display:none;">
  <span class="notif-optin-icon">🔔</span>
  <div class="notif-optin-text">
    <strong>Turn on notifications?</strong>
    <span>Get notified when someone messages you, or when a song you submitted is reviewed. You can change this anytime in Site Settings.</span>
  </div>
  <div class="notif-optin-actions">
    <button class="notif-optin-btn primary" onclick="handleNotifOptIn(true)">Enable</button>
    <button class="notif-optin-btn" onclick="handleNotifOptIn(false)">Not now</button>
  </div>
</div>
<!-- HEADER -->
<header>
  <div class="header-left">
    <div class="auth-bar" id="auth-bar">
      <button class="auth-btn" id="btn-login">Log In</button>
      <button class="auth-btn primary" id="btn-signup">Sign Up</button>
    </div>
  </div>
  <a href="#" class="logo header-center" onclick="showPage('home');return false;">
    <span class="logo-full">AfterLight<span class="colon">:</span><span class="four">404</span></span>
  </a>
  <div class="header-right">
    <div class="notif-bell-wrap" id="notif-bell-wrap" style="display:none;">
      <button class="notif-bell-btn" onclick="toggleNotifDropdown(event)" aria-label="Notifications">
        🔔<span class="notif-bell-badge" id="notif-bell-badge" style="display:none;">0</span>
      </button>
      <div class="notif-dropdown" id="notif-dropdown">
        <div class="notif-dropdown-header">
          <span>Notifications</span>
          <button class="notif-mark-read-btn" onclick="markAllNotificationsRead()">Mark all read</button>
        </div>
        <div class="notif-dropdown-list" id="notif-dropdown-list"></div>
      </div>
    </div>
    <div class="theme-toggle-wrap">
      <span class="theme-icon">☽</span>
      <label class="theme-switch">
        <input type="checkbox" id="theme-checkbox">
        <span class="theme-track"></span>
      </label>
      <span class="theme-icon">☀</span>
      <button class="theme-mode-btn active-mode" id="sys-btn" title="Follow system preference">sys</button>
    </div>
  </div>
</header>
<div class="subnav-row" id="desktop-nav-row">
  <nav id="desktop-nav">
    <a href="#archive" onclick="goToHomeSection('archive');return false;">Archive</a>
    <a href="#about" onclick="goToHomeSection('about');return false;">About</a>
    <a href="#submit" onclick="showPage('submit');return false;">Submit a Song</a>
    <a href="#social" onclick="showPage('social');return false;">Social</a>
  </nav>
</div>


<!-- DONATE MODAL -->
<div class="donate-overlay" id="donate-overlay">
  <div class="donate-modal">
    <button class="donate-close" id="close-donate">✕</button>
    <div class="donate-modal-title">Support JK ♡</div>
    <p class="donate-modal-sub">
      AfterLight:404Archive is made with love &amp; zero ads.<br>
      If it means something to you, buy me a coffee via PayPal.
    </p>
    <div class="paypal-input-wrap" id="paypal-setup" style="display:none;">
      <label>Your PayPal.me username or PayPal email</label>
      <input class="paypal-input" id="paypal-id-input" type="text" placeholder="paypal.me/yourname  or  you@email.com">
      <div class="paypal-saved" id="paypal-saved">✓ Saved!</div>
    </div>
    <button class="paypal-go-btn" id="paypal-go-btn">♡ &nbsp;Donate via PayPal</button>
    <p class="paypal-note" id="paypal-note-text">
      You'll be taken to PayPal to complete your donation securely.<br>
      Any amount is genuinely appreciated.
    </p>
    <p class="paypal-note" style="margin-top:10px;">
      <span style="color:var(--accent2);cursor:pointer;text-decoration:underline;" id="toggle-paypal-setup">⚙ Creator: connect your PayPal</span>
    </p>
  </div>
</div>

<!-- ── AUTH MODALS ── -->

<!-- USER LOGIN -->
<div class="auth-overlay" id="user-login-overlay">
  <div class="auth-modal">
    <button class="auth-close" onclick="closeAuth()">✕</button>
    <div class="auth-modal-title">Welcome back</div>
    <p class="auth-modal-sub">Log in to comment, chat, and submit songs.</p>
    <div class="form-group">
      <label>Anonymous Name</label>
      <input class="form-input" type="text" id="ul-name" placeholder="e.g. midnight_echo, vinyl_ghost">
      <p class="anon-hint">Pick a creative alias. No real names. Offensive terms are filtered.</p>
    </div>
    <div class="form-group">
      <label>Password</label>
      <input class="form-input" type="password" id="ul-pass" placeholder="••••••••">
    </div>
    <button class="form-btn" onclick="handleUserLogin()">Log In</button>
    <div class="form-divider">or</div>
    <button class="google-btn" onclick="handleGoogleLogin()">
      <svg viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
      Continue with Google
    </button>
    <p class="auth-error" id="ul-error"></p>
    <p class="auth-switch">No account? <a onclick="showSignup()">Sign up</a></p>
  </div>
</div>

<!-- USER SIGNUP -->
<div class="auth-overlay" id="user-signup-overlay">
  <div class="auth-modal">
    <button class="auth-close" onclick="closeAuth()">✕</button>
    <div class="auth-modal-title">Join the archive</div>
    <p class="auth-modal-sub">Create an account to participate.</p>
    <div class="form-group">
      <label>Real Name</label>
      <input class="form-input" type="text" id="us-realname" placeholder="e.g. Jordan Reyes" autocomplete="name">
      <p class="anon-hint">Kept private. Never shown publicly — only your anonymous name is visible to others.</p>
    </div>
    <div class="form-group">
      <label>Anonymous Name</label>
      <input class="form-input" type="text" id="us-name" placeholder="e.g. midnight_echo, vinyl_ghost">
      <p class="anon-hint">Must be 3–20 chars. Letters, numbers, underscores, hyphens only. No offensive terms.</p>
    </div>
    <div class="form-group">
      <label>Gender</label>
      <select class="form-input" id="us-gender">
        <option value="">Select one…</option>
        <option value="female">Female</option>
        <option value="male">Male</option>
        <option value="nonbinary">Non-binary</option>
        <option value="other">Other</option>
      </select>
      <p class="anon-hint">Used to show you a relevant set of profile pictures. Kept private.</p>
    </div>
    <div class="form-group">
      <label>Email</label>
      <input class="form-input" type="email" id="us-email" placeholder="you@email.com" autocomplete="email">
    </div>
    <div class="form-group">
      <label>Password</label>
      <input class="form-input" type="password" id="us-pass" placeholder="••••••••">
    </div>
    <div class="form-group">
      <label>Confirm Password</label>
      <input class="form-input" type="password" id="us-pass2" placeholder="••••••••">
    </div>
    <!-- Honeypot: invisible to real people, but a script that fills every
         input on the form will fill this too. If it's non-empty on submit,
         we quietly treat the signup as a bot and drop it. -->
    <div style="position:absolute;left:-9999px;top:-9999px;height:0;overflow:hidden;" aria-hidden="true">
      <label for="us-website">Website</label>
      <input type="text" id="us-website" name="website" tabindex="-1" autocomplete="off">
    </div>
    <!-- Cloudflare Turnstile renders here only if the admin enabled it in
         Admin → Safety & Bots. Hidden/no-op otherwise. -->
    <div id="turnstile-widget-signup" style="margin:4px 0 12px;">
    </div>
    <button class="form-btn" onclick="handleUserSignup()">Create Account</button>
    <p class="anon-hint" style="text-align:center;margin-top:10px;">Already have a Google-linked account? <a onclick="closeAuth();handleGoogleLogin();" style="cursor:pointer;">Continue with Google</a> from the log in screen instead — signing up always uses email + password.</p>
    <p class="auth-error" id="us-error"></p>
    <p class="auth-switch">Already have an account? <a onclick="showLogin()">Log in</a></p>
  </div>
</div>

<!-- VERIFY EMAIL — shown right after signup, before the account exists.
     Not a .auth-overlay on purpose: closeAuth() must never dismiss it, only
     verifying the code (or explicitly cancelling back to the signup form). -->
<div class="forced-overlay" id="verify-email-overlay">
  <div class="auth-modal">
    <div class="auth-modal-title">Verify your email</div>
    <p class="auth-modal-sub">We sent a 6-digit code to <strong id="ve-email-display"></strong>. Enter it below to confirm it's really you.</p>
    <div class="form-group">
      <label>Verification Code</label>
      <input class="form-input" type="text" inputmode="numeric" maxlength="6" id="ve-code" placeholder="000000" style="letter-spacing:6px;text-align:center;font-family:var(--mono);font-size:18px;" onkeydown="if(event.key==='Enter'){event.preventDefault();handleVerifyEmail();}">
    </div>
    <button class="form-btn" onclick="handleVerifyEmail()">Verify &amp; Continue</button>
    <p class="auth-error" id="ve-error"></p>
    <p class="auth-switch"><a onclick="resendVerificationCode()">Resend code</a> &nbsp;·&nbsp; <a onclick="cancelVerification()">Use a different email</a></p>
  </div>
</div>

<!-- GOOGLE ALIAS (fallback for "Continue with Google" when Supabase isn't connected — login-only, see submitGoogleAlias) -->
<div class="auth-overlay" id="google-alias-overlay">
  <div class="auth-modal">
    <button class="auth-close" onclick="closeAuth()">✕</button>
    <div class="auth-modal-title">Continue with Google</div>
    <p class="auth-modal-sub">Enter the anonymous name of your existing Google-linked account.</p>
    <div class="form-group">
      <label>Anonymous Name</label>
      <input class="form-input" type="text" id="ga-name" placeholder="e.g. midnight_echo, vinyl_ghost" autocomplete="off" onkeydown="if(event.key==='Enter'){event.preventDefault();submitGoogleAlias();}">
      <p class="anon-hint">Must match an account you already created — Google can't create a new one.</p>
    </div>
    <button class="form-btn" onclick="submitGoogleAlias()">Continue</button>
    <p class="auth-error" id="ga-error"></p>
  </div>
</div>

<!-- FORCED AVATAR PICKER — shown once, right after a new account is created.
     Not a .auth-overlay on purpose: it must never be dismissed by closeAuth() or
     a stray backdrop click, only by picking an avatar (or, in the rare case the
     library is completely empty, the "Skip for now" escape hatch). -->
<div class="forced-overlay" id="forced-avatar-overlay">
  <div class="auth-modal">
    <div class="auth-modal-title">Complete your profile</div>
    <p class="auth-modal-sub" id="fa-subtitle">Almost there — pick an avatar and tell people a bit about yourself. You can change any of this later from your profile settings.</p>

    <div class="form-group">
      <label>Profile Picture</label>
      <div class="forced-avatar-grid" id="forced-avatar-grid" style="margin-bottom:0;"></div>
    </div>

    <div class="form-group" style="text-align:left;">
      <label>Username</label>
      <div id="fa-username-display" style="font-family:var(--mono);font-size:14px;color:var(--accent);padding:2px 0 4px;"></div>
      <p class="anon-hint">This is the name others see. Change it anytime in Settings.</p>
    </div>

    <div class="form-group" style="text-align:left;">
      <label>Bio</label>
      <textarea class="form-input" id="fa-bio" maxlength="300" placeholder="Tell us a bit about yourself and the artists you love..." style="min-height:80px;resize:vertical;font-family:var(--sans);line-height:1.6;" oninput="document.getElementById('fa-bio-count').textContent=this.value.length"></textarea>
      <p class="anon-hint"><span id="fa-bio-count">0</span>/300</p>
    </div>

    <div class="form-group" style="text-align:left;">
      <label>Pronouns <span style="color:var(--muted);font-weight:400;">(optional)</span></label>
      <select class="form-input" id="fa-pronouns" onchange="document.getElementById('fa-pronouns-custom').style.display = this.value==='custom' ? 'block' : 'none';">
        <option value="">Prefer not to say</option>
        <option value="she/her">she/her</option>
        <option value="he/him">he/him</option>
        <option value="they/them">they/them</option>
        <option value="custom">Other / custom</option>
      </select>
      <input class="form-input" type="text" id="fa-pronouns-custom" placeholder="e.g. xe/xem" style="display:none;margin-top:8px;">
    </div>

    <div class="form-group" style="text-align:left;">
      <label>Favorite Genres / Vibe <span style="color:var(--muted);font-weight:400;">(optional)</span></label>
      <input class="form-input" type="text" id="fa-genre" maxlength="80" placeholder="e.g. shoegaze, 90s R&amp;B, ambient">
      <p class="anon-hint">Shows on your profile so others know your taste at a glance.</p>
    </div>

    <button class="form-btn" onclick="saveProfileSetup()">Finish Setup</button>
    <p class="auth-error" id="fa-error"></p>
    <button class="form-btn" id="fa-skip-btn" onclick="skipForcedAvatar()" style="display:none;background:transparent;color:var(--dim);border:1px solid var(--border2);box-shadow:none;margin-top:8px;">Skip for now</button>
  </div>
</div>

<!-- ADMIN ACCESS CODE -->
<div class="auth-overlay" id="admin-code-overlay">
  <div class="auth-modal">
    <button class="auth-close" onclick="closeAuth()">✕</button>
    <div class="auth-modal-title">Admin Access</div>
    <p class="auth-modal-sub">Enter the admin access code to proceed.</p>
    <div class="form-group">
      <label>Access Code</label>
      <input class="form-input" type="password" id="admin-access-code" placeholder="••••••••" autocomplete="off" onkeydown="if(event.key==='Enter'){event.preventDefault();verifyAdminCode();}">
    </div>
    <button class="form-btn" onclick="verifyAdminCode()">Verify Code</button>
    <p class="auth-error" id="ac-error"></p>
  </div>
</div>

<!-- ADMIN LOGIN -->
<div class="auth-overlay" id="admin-login-overlay">
  <div class="auth-modal">
    <button class="auth-close" onclick="closeAuth()">✕</button>
    <div class="auth-modal-title">Admin Access</div>
    <p class="auth-modal-sub">Restricted to site administrators only.</p>
    <div class="form-group">
      <label>Admin Email</label>
      <input class="form-input" type="email" id="al-email" placeholder="admin@afterlight.com">
    </div>
    <div class="form-group">
      <label>Password</label>
      <input class="form-input" type="password" id="al-pass" placeholder="••••••••">
    </div>
    <button class="form-btn" onclick="handleAdminLogin()">Access Dashboard</button>
    <div class="form-divider">or</div>
    <button class="google-btn" onclick="handleAdminGoogle()">
      <svg viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
      Sign in with Google
    </button>
    <p class="auth-error" id="al-error"></p>
  </div>
</div>

<!-- ADMIN GOOGLE EMAIL -->
<div class="auth-overlay" id="admin-google-overlay">
  <div class="auth-modal">
    <button class="auth-close" onclick="closeAuth()">✕</button>
    <div class="auth-modal-title">Admin Google Access</div>
    <p class="auth-modal-sub">Enter the authorized admin Gmail to continue.</p>
    <div class="form-group">
      <label>Admin Email</label>
      <input class="form-input" type="email" id="ag-email" placeholder="admin@afterlight.com" autocomplete="off" onkeydown="if(event.key==='Enter'){event.preventDefault();submitAdminGoogleEmail();}">
    </div>
    <button class="form-btn" onclick="submitAdminGoogleEmail()">Continue</button>
    <p class="auth-error" id="ag-error"></p>
  </div>
</div>

<!-- SUBMISSION DETAIL MODAL (admin: click a submission to see everything) -->
<div class="auth-overlay" id="submission-detail-overlay">
  <div class="auth-modal sub-detail-modal">
    <button class="auth-close" onclick="closeSubmissionDetail()">✕</button>
    <div class="auth-modal-title" id="sd-title">Submission</div>
    <div class="sub-detail-status" id="sd-status">Pending</div>
    <div class="sub-detail-grid">
      <div class="sub-detail-field"><label>Song Title</label><div class="val" id="sd-song-title"></div></div>
      <div class="sub-detail-field"><label>Artist</label><div class="val" id="sd-artist"></div></div>
      <div class="sub-detail-field"><label>Year · Album</label><div class="val" id="sd-year"></div></div>
      <div class="sub-detail-field"><label>Mood</label><div class="val" id="sd-mood"></div></div>
      <div class="sub-detail-field"><label>Genres</label><div class="val" id="sd-genres"></div></div>
      <div class="sub-detail-field"><label>Listen Link</label><div class="val" id="sd-link"></div></div>
      <div class="sub-detail-field full"><label>Description — what the song is about</label><div class="val" id="sd-about"></div></div>
      <div class="sub-detail-field full"><label>What it really means — interpretation</label><div class="val" id="sd-meaning"></div></div>
      <div class="sub-detail-field full"><label>Key Lyrics</label><div class="val" id="sd-lyrics"></div></div>
      <div class="sub-detail-field full"><label>Fun Fact</label><div class="val" id="sd-funfact"></div></div>
      <div class="sub-detail-field"><label>Submitted By</label><div class="val" id="sd-submitted-by"></div></div>
      <div class="sub-detail-field"><label>Submitted At</label><div class="val" id="sd-submitted-at"></div></div>
    </div>
    <div class="sub-detail-actions" id="sd-actions">
      <button class="approve-btn" id="sd-approve-btn">Approve</button>
      <button class="reject-btn" id="sd-reject-btn">Reject</button>
    </div>
  </div>
</div>

<!-- ADMIN: USER DETAIL -->
<div class="auth-overlay" id="user-detail-overlay">
  <div class="auth-modal sub-detail-modal">
    <button class="auth-close" onclick="closeUserDetail()">✕</button>
    <div class="auth-modal-title" id="ud-title">User</div>
    <div class="sub-detail-status" id="ud-status">Active</div>
    <div class="sub-detail-grid">
      <div class="sub-detail-field"><label>Anonymous Name</label><div class="val" id="ud-name"></div></div>
      <div class="sub-detail-field"><label>Real Name</label><div class="val" id="ud-realname"></div></div>
      <div class="sub-detail-field"><label>Email</label><div class="val" id="ud-email"></div></div>
      <div class="sub-detail-field"><label>Gender</label><div class="val" id="ud-gender"></div></div>
      <div class="sub-detail-field"><label>Friend Code</label><div class="val" id="ud-code"></div></div>
      <div class="sub-detail-field"><label>Account Created</label><div class="val" id="ud-created"></div></div>
      <div class="sub-detail-field"><label>Time on Site</label><div class="val" id="ud-usage"></div></div>
      <div class="sub-detail-field"><label>Sign-up Method</label><div class="val" id="ud-method"></div></div>
      <div class="sub-detail-field"><label>Song Submissions</label><div class="val" id="ud-submits"></div></div>
      <div class="sub-detail-field full"><label>Bio</label><div class="val" id="ud-bio"></div></div>
    </div>
    <div class="sub-detail-actions" id="ud-actions">
      <button class="block-btn" id="ud-block-btn">Block User</button>
      <button class="delete-btn" id="ud-delete-btn">Delete Account</button>
    </div>
  </div>
</div>

<!-- REPORT USER / MESSAGE -->
<div class="auth-overlay" id="report-overlay">
  <div class="auth-modal">
    <button class="auth-close" onclick="closeReportModal()">✕</button>
    <div class="auth-modal-title">Report</div>
    <p class="auth-modal-sub" id="report-modal-sub">Tell us what's going on. Reports are only visible to admins.</p>
    <div class="form-group">
      <label>Reason</label>
      <select class="form-input" id="report-category">
        <option value="harassment">Harassment or bullying</option>
        <option value="hate_speech">Hate speech</option>
        <option value="spam">Spam</option>
        <option value="inappropriate">Inappropriate content</option>
        <option value="impersonation">Impersonation</option>
        <option value="other">Other</option>
      </select>
    </div>
    <div class="form-group">
      <label>Details (optional)</label>
      <textarea class="form-input" id="report-details" rows="4" placeholder="Anything else that would help us look into this..."></textarea>
    </div>
    <button class="primary" style="width:100%;" onclick="submitReportModal()">Submit Report</button>
  </div>
</div>


<!-- MESSAGE ACTIONS SHEET (tap a chat message to open) -->
<!-- FLOATING MESSAGE ACTION BUBBLE -->
<div class="bubble-backdrop" id="bubble-backdrop" onclick="closeMsgActions()"></div>
<div class="msg-action-bubble" id="msg-action-bubble">
  <div class="bubble-emoji-row" id="bubble-emoji-row"></div>
  <button class="bubble-action" onclick="startReplyFromSheet()"><span class="ba-icon">↩</span> Reply</button>
  <button class="bubble-action" onclick="openEmojiPicker()"><span class="ba-icon">😀</span> More reactions</button>
  <button class="bubble-action" id="msg-action-report" onclick="reportMsgFromSheet()" style="display:none;"><span class="ba-icon">🚩</span> Report</button>
  <button class="bubble-action danger" id="msg-action-delete" onclick="deleteMsgFromSheet()" style="display:none;"><span class="ba-icon">🗑</span> Delete</button>
</div>

<!-- FULL EMOJI PICKER -->
<div class="emoji-picker-overlay" id="emoji-picker-overlay" onclick="if(event.target===this) closeEmojiPicker()">
  <div class="emoji-picker-sheet">
    <div class="emoji-picker-header">
      <span>Choose a reaction</span>
      <button class="reply-banner-cancel" onclick="closeEmojiPicker()">✕</button>
    </div>
    <div class="emoji-picker-body" id="emoji-picker-body"></div>
  </div>
</div>

<!-- USER SETTINGS OVERLAY -->
<div class="auth-overlay" id="user-settings-overlay" style="z-index:4000;">
  <div class="auth-modal" style="max-width:420px;">
    <button class="auth-close" onclick="closeUserSettings()">✕</button>
    <div class="auth-modal-title">Site Settings</div>
    <p class="auth-modal-sub">Preview layout &amp; theme preferences.</p>

    <div class="settings-panel active" id="settings-panel-site">

      <div class="settings-block">
        <div class="settings-block-label">Preview layout</div>
        <p class="anon-hint">By default the site automatically matches your screen — phone gets the Mobile UI, computer gets the Desktop UI. Force a specific layout here if you want to preview another size.</p>
        <div class="device-toggle-panel" id="device-toggle" title="Preview viewport size">
          <div class="device-toggle-glider" id="device-toggle-glider"></div>
          <button class="device-toggle-btn" id="mode-auto" onclick="setDeviceMode('auto')" title="Automatic (matches your screen)">
            <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor"><path d="M12 2.5l1.9 5.6 5.6 1.9-5.6 1.9L12 17.5l-1.9-5.6L4.5 10l5.6-1.9z"/><path d="M19 15.5l.8 2.3 2.3.8-2.3.8-.8 2.3-.8-2.3-2.3-.8 2.3-.8z"/></svg>
          </button>
          <button class="device-toggle-btn" id="mode-mobile" onclick="setDeviceMode('mobile')" title="Mobile view">
            <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="7" y="2" width="10" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>
          </button>
          <button class="device-toggle-btn" id="mode-tablet" onclick="setDeviceMode('tablet')" title="Tablet view">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="2" width="16" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>
          </button>
          <button class="device-toggle-btn" id="mode-desktop" onclick="setDeviceMode('desktop')" title="Desktop view">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="13" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
          </button>
        </div>
      </div>

      <div class="settings-block">
        <div class="settings-block-label">Theme</div>
        <p class="anon-hint" style="margin-top:0;">Use the sun/moon switch in the header to toggle Light, Dark, or System theme.</p>
      </div>

      <div class="settings-block" style="margin-bottom:0;">
        <div class="settings-block-label">Notifications</div>
        <p class="anon-hint" style="margin-top:0;">Get notified when someone messages you, or when a song you submitted is reviewed.</p>
        <label class="settings-toggle-row" for="notif-settings-checkbox">
          <span class="theme-switch">
            <input type="checkbox" id="notif-settings-checkbox" onchange="handleNotifSettingsToggle(this.checked)">
            <span class="theme-track"></span>
          </span>
          <span class="settings-toggle-label" id="notif-settings-label">Off</span>
        </label>
        <p class="anon-hint" id="notif-settings-hint" style="margin-top:8px;margin-bottom:0;"></p>
      </div>

    </div>
  </div>
</div>

<!-- MOBILE NAV OVERLAY -->
<!-- BOTTOM MOBILE NAV BAR -->
<nav class="bottom-nav" id="bottom-nav">
  <button class="bottom-nav-item" data-bn="home" onclick="showPage('home');setBottomNavActive('home');return false;">
    <span class="bn-icon">◈</span><span class="bn-label">Archive</span>
  </button>
  <button class="bottom-nav-item" data-bn="about" onclick="showPage('home');document.getElementById('about').scrollIntoView({behavior:'smooth'});setBottomNavActive('about');return false;">
    <span class="bn-icon">✦</span><span class="bn-label">About</span>
  </button>
  <button class="bottom-nav-item" data-bn="submit" onclick="showPage('submit');setBottomNavActive('submit');return false;">
    <span class="bn-icon">♪</span><span class="bn-label">Submit</span>
  </button>
  <button class="bottom-nav-item" data-bn="social" onclick="showPage('social');setBottomNavActive('social');return false;">
    <span class="bn-icon">◐</span><span class="bn-label">Social</span><span class="bn-badge" id="bn-social-badge"></span>
  </button>
  <button class="bottom-nav-item" data-bn="account" id="bottom-nav-account" onclick="handleBottomNavAccount();return false;">
    <span class="bn-icon">⚙</span><span class="bn-label" id="bottom-nav-account-label">Log In</span>
  </button>
</nav>


<!-- ── HOME PAGE ── -->
<div class="page-section active" id="page-home">

<!-- HERO -->
<section class="hero">
  <div class="hero-bg-text">SONGS</div>

  <!-- Floating music notes -->
  <span class="music-note-float" style="top:15%;left:8%;animation-delay:0s;font-size:24px;">♪</span>
  <span class="music-note-float" style="top:65%;left:5%;animation-delay:2s;font-size:16px;">♫</span>
  <span class="music-note-float" style="top:25%;right:5%;animation-delay:4s;font-size:20px;">♩</span>
  <span class="music-note-float" style="top:72%;right:8%;animation-delay:1s;font-size:14px;">♬</span>
  <span class="music-note-float" style="top:40%;left:2%;animation-delay:3s;font-size:12px;">♭</span>

  <div class="hero-inner">
    <div class="hero-content">
      <div class="hero-eyebrow">Personal Archive · Est. 2024</div>
      <h1 id="hero-title">Songs that found me<br>in the <em>dark</em></h1>
      <p class="hero-sub" id="hero-sub">
        A nerd's archive of niche indie, alternative &amp; pop — with liner notes, meanings, and the exact moods they belong to. No algorithms. Just obsession.
      </p>
      <div class="hero-meta">
        <div class="meta-item">
          <label>Songs archived</label>
          <span id="stat-songs">06</span>
        </div>
        <div class="meta-item">
          <label>Moods mapped</label>
          <span>07</span>
        </div>
        <div class="meta-item">
          <label>Genres</label>
          <span>03</span>
        </div>
      </div>
      <div style="margin-top:32px;">
        <div class="waveform-deco" id="hero-waveform">
          <span></span><span></span><span></span><span></span><span></span>
          <span></span><span></span><span></span><span></span><span></span>
          <span></span><span></span><span></span><span></span><span></span>
        </div>
      </div>
    </div>
    <div class="hero-vinyl-side">
      <div class="vinyl-widget">
        <div style="position:relative;display:inline-block;">
          <div class="vinyl-outer" id="hero-vinyl"></div>
          <div class="vinyl-arm" id="hero-vinyl-arm"></div>
        </div>
        <div class="vinyl-controls">
          <button class="vinyl-btn" onclick="vinylPrev()" title="Prev">⏮</button>
          <button class="vinyl-btn vinyl-play-btn" id="vinyl-play-btn" onclick="toggleVinyl()">▶</button>
          <button class="vinyl-btn" onclick="vinylNext()" title="Next">⏭</button>
        </div>
        <div class="vinyl-now-playing" id="vinyl-now-playing">— click play to spin —</div>
      </div>
    </div>
  </div>

  <div class="hero-track-bar">
    <div class="hero-track-progress" id="hero-track-progress"></div>
    <div class="hero-track-needle" id="hero-track-needle"></div>
  </div>
  <div class="scroll-hint">Scroll</div>
</section>

<!-- MOOD FILTER -->
<section class="mood-section" id="archive">
  <div class="section-label">// Filter by mood</div>
  <div class="mood-bar" id="mood-bar"></div>
</section>

<!-- SONG ARCHIVE -->
<section class="archive-section">
  <div class="archive-header">
    <h2 id="archive-title">The Archive</h2>
    <span class="count-tag" id="count-tag">06 entries</span>
  </div>
  <div class="song-grid" id="song-grid"></div>
</section>

<!-- ABOUT -->
<section class="about-strip" id="about">
  <div>
    <div class="about-title" id="about-title">Not a blog.<br>An <em>obsession</em>.</div>
    <p class="about-body" id="about-body">
      AfterLight:404Archive is a personal site by JK — a place to document the songs that don't chart, don't trend, but live rent-free in your head for years.<br><br>
      Every entry includes the full story: what the song is about, what it <em>actually</em> means, a key lyric breakdown, and the precise mood it belongs to. Think liner notes for the internet age.<br><br>
      Songs are added slowly, intentionally. No algorithms. No hot takes. Just a nerd with a playlist and too many feelings about chord progressions.
    </p>
  </div>
  <div class="stat-grid">
    <div class="stat-cell"><label>Genre focus</label><span style="font-size:16px;font-family:var(--mono);">Indie · Alt · Pop</span></div>
    <div class="stat-cell"><label>Updated</label><span style="font-size:16px;font-family:var(--mono);">Whenever</span></div>
    <div class="stat-cell"><label>Curator</label><span style="font-size:16px;font-family:var(--mono);">JK</span></div>
    <div class="stat-cell"><label>Bias level</label><span style="font-size:16px;font-family:var(--mono);">Extreme</span></div>
  </div>
</section>

</div><!-- /page-home -->

<!-- ── SUBMIT SONG PAGE ── -->
<div class="page-section" id="page-submit">
<section class="submit-section">
  <div class="submit-intro">
    <h2 id="submit-title">Submit Your Own Song</h2>
    <p id="submit-desc">
      Found a song that lives rent-free in your head? Share it with the archive. 
      Every submission gets reviewed before it goes live — this isn't a free-for-all, 
      it's a curation. Tell us why it matters, what it means to you, and the exact 
      moment it soundtracked. If it resonates, it stays.
    </p>
  </div>
  <div id="submit-form-wrap">
    <div class="submit-login-wall" id="submit-login-wall">
      <p>Sign up or log in to submit a song to the archive.</p>
      <button class="auth-btn primary" onclick="showSignup()">Get Started</button>
    </div>
    <form class="submit-form" id="submit-form" style="display:none;">
      <div class="form-group">
        <label>Song Title</label>
        <input class="form-input" type="text" id="sub-title" placeholder="e.g. Motion Sickness" required>
      </div>
      <div class="form-group">
        <label>Artist</label>
        <input class="form-input" type="text" id="sub-artist" placeholder="e.g. Phoebe Bridgers" required>
      </div>
      <div class="form-group">
        <label>Year · Album</label>
        <input class="form-input" type="text" id="sub-year" placeholder="e.g. 2017 · Stranger in the Alps">
      </div>
      <div class="form-group">
        <label>Mood</label>
        <select class="form-input" id="sub-mood"></select>
      </div>
      <div class="form-group full">
        <label>Description — what the song is about</label>
        <textarea class="form-input" id="sub-about" placeholder="Describe the song, its sound, its atmosphere..." required></textarea>
      </div>
      <div class="form-group full">
        <label>What it really means — your interpretation</label>
        <textarea class="form-input" id="sub-meaning" placeholder="Dig deeper. What's the song actually about?" required></textarea>
      </div>
      <div class="form-group full">
        <label>Key Lyrics</label>
        <textarea class="form-input" id="sub-lyrics" placeholder="Paste the most devastating lines here..." required></textarea>
      </div>
      <div class="form-group full">
        <label>Fun Fact <span style="color:var(--muted);font-weight:400;">(optional)</span></label>
        <textarea class="form-input" id="sub-funfact" placeholder="Any trivia, backstory, or behind-the-scenes detail about this song?"></textarea>
      </div>
      <div class="form-group full">
        <label>Spotify / Listen Link</label>
        <input class="form-input" type="url" id="sub-link" placeholder="https://open.spotify.com/track/...">
      </div>
      <div class="form-group">
        <label>Genre 1</label>
        <input class="form-input" type="text" id="sub-genre1" placeholder="e.g. Indie Folk">
      </div>
      <div class="form-group">
        <label>Genre 2</label>
        <input class="form-input" type="text" id="sub-genre2" placeholder="e.g. Alternative">
      </div>
      <button type="submit" class="form-btn">Submit to Archive</button>
    </form>
  </div>
</section>
</div>

<!-- ── CHAT PAGE ── -->
<div class="page-section" id="page-chat">
<section class="chat-section">
  <div id="chat-login-wall" style="display:none;">
    <div class="submit-login-wall">
      <p>Sign up or log in to join the conversation.</p>
      <button class="auth-btn primary" onclick="showSignup()">Get Started</button>
    </div>
  </div>
  <div class="chat-layout" id="chat-layout">
    <div class="chat-main">
      <div class="chat-header">
        <button class="chat-back-btn" onclick="showPage('chats-list')" aria-label="Back">‹</button>
        <div class="chat-header-avatar is-global chat-drawer-toggle-avatar" onclick="openChatDrawer()">◐</div>
        <div class="chat-header-titles">
          <h4 id="chat-room-title"># Global Chat</h4>
          <span class="count-tag" id="chat-room-meta"><span class="chat-online-dot"></span>0 online</span>
        </div>
        <button class="chat-header-icon-btn" onclick="showToast('Search coming soon.')" aria-label="Search">🔍</button>
        <button class="chat-header-icon-btn" onclick="openChatDrawer()" aria-label="Rooms">☰</button>
      </div>
      <div class="chat-pinned-banner" id="chat-pinned-banner">
        <span class="chat-pinned-label">Pinned</span>
        <span class="chat-pinned-text">Welcome to Global Chat! Be respectful and keep it about music.</span>
        <button class="chat-pinned-close" onclick="document.getElementById('chat-pinned-banner').style.display='none'" aria-label="Dismiss">✕</button>
      </div>
      <div class="chat-messages" id="chat-messages"></div>
      <div class="reply-banner" id="chat-reply-banner" style="display:none;">
        <div class="reply-banner-text">Replying to <span id="chat-reply-author"></span>: <span id="chat-reply-preview"></span></div>
        <button class="reply-banner-cancel" onclick="cancelReply('global')">✕</button>
      </div>
      <div class="chat-input-wrap" id="chat-input-wrap" style="position:relative;">
        <div class="mention-dropdown" id="chat-mention-dropdown"></div>
        <input type="text" class="chat-input" id="chat-input" placeholder="Share your favorite song...">
        <button class="chat-send-circle" onclick="sendChat()" aria-label="Send">➤</button>
      </div>
    </div>
  </div>
</section>
</div>

<!-- ── CHATS LIST (Global / My Rooms / Trending Rooms) ── -->
<div class="page-section" id="page-chats-list">
<section class="chats-list-section">
  <div class="chats-list-topbar">
    <h2>Chats</h2>
    <button class="chats-list-add-btn" onclick="openCreateRoomSheet()" aria-label="Create a room">+</button>
  </div>
  <div class="chats-list-body" id="chats-list-body"></div>
</section>
</div>

<!-- ── SOCIAL HUB ── -->
<div class="page-section" id="page-social">
<section class="social-hub-section">
  <div id="social-login-wall" style="display:none;">
    <div class="submit-login-wall">
      <p>Sign up or log in to connect with other listeners.</p>
      <button class="auth-btn primary" onclick="showSignup()">Get Started</button>
    </div>
  </div>
  <div id="social-hub-body" style="display:none;">
    <div class="social-hub-header">
      <div class="social-hub-eyebrow">Connect</div>
      <h2>Social</h2>
      <p class="social-hub-sub">Talk in the rooms, or add friends and message them one-on-one.</p>
    </div>
    <div class="social-hub-cards">
      <div class="social-hub-card" onclick="showPage('chats-list');setBottomNavActive('social');">
        <div class="shc-icon">◐</div>
        <div class="shc-text">
          <div class="shc-title">Chats</div>
          <div class="shc-desc">Global &amp; topic chat rooms — talk with everyone.</div>
        </div>
        <div class="shc-arrow">›</div>
      </div>
      <div class="social-hub-card" onclick="showPage('friends')">
        <div class="shc-icon">☺</div>
        <div class="shc-text">
          <div class="shc-title">Friends</div>
          <div class="shc-desc">Add friends by username and message them privately.</div>
        </div>
        <span class="shc-badge" id="social-hub-friend-badge" style="display:none;"></span>
        <div class="shc-arrow">›</div>
      </div>
    </div>
    <div class="social-hub-friends-preview" id="social-hub-friends-preview"></div>
  </div>
</section>
</div>

<!-- ── FRIENDS ── -->
<div class="page-section" id="page-friends">
<section class="friends-section">
  <div class="friends-page-header">
    <button class="topic-back-btn friends-back-btn" onclick="showPage('social')">‹</button>
    <div class="friends-page-title">Friends</div>
    <button class="friends-compose-btn" onclick="toggleFriendsAddPanel()" aria-label="Add a friend">✎</button>
  </div>

  <div class="friends-add-panel" id="friends-add-panel">
    <div class="friends-add-row">
      <input type="text" class="chat-search" id="friend-search-input" placeholder="Search by username or #000-000 code...">
      <button class="form-btn" onclick="searchFriendUsers()">Search</button>
    </div>
    <div class="friends-search-results" id="friend-search-results"></div>
    <div class="friends-your-code" id="friends-your-code"></div>
  </div>

  <div class="friends-search-bar">
    <input type="text" class="chat-search" id="friends-page-search" placeholder="Search friends..." oninput="renderMessagesTab()">
  </div>

  <div class="friends-tabs">
    <button class="friends-tab-btn active" data-tab="messages" onclick="switchFriendsTab('messages')">Messages</button>
    <button class="friends-tab-btn" id="friends-tab-requests-btn" data-tab="requests" onclick="switchFriendsTab('requests')">Requests</button>
  </div>

  <div class="friends-body">
    <div class="friends-tab-panel" id="friends-messages-tab">
      <div class="friends-list msg-list" id="friends-messages-list"></div>
    </div>

    <div class="friends-tab-panel" id="friends-requests-tab" style="display:none;">
      <div class="friends-block" id="friend-requests-block" style="display:none;">
        <div class="friends-block-title">Friend Requests</div>
        <div class="friends-list" id="friend-requests-list"></div>
      </div>
      <div class="friends-block" id="friend-outgoing-block" style="display:none;">
        <div class="friends-block-title">Pending (sent)</div>
        <div class="friends-list" id="friend-outgoing-list"></div>
      </div>
      <p class="friends-empty" id="friends-requests-empty">No pending requests. Tap ✎ above to add someone.</p>
    </div>
  </div>
  <div class="topic-chat-meta" id="friends-meta" style="display:none;">—</div>
</section>
</div>

<!-- ── FULL-PAGE PROFILE VIEW ── -->
<div class="page-section" id="page-profile">
  <div class="ig-page-header">
    <button class="ig-back-btn" onclick="showPage('home')" aria-label="Back">←</button>
    <div class="ig-page-title">Profile</div>
  </div>
  <div class="ig-page-body">
    <div class="pv-hero">
      <div id="pv-avatar-wrap"></div>
      <div class="pv-name" id="pv-name">—</div>
      <div class="pv-username" id="pv-username">@—</div>
      <div class="pv-pronouns" id="pv-pronouns"></div>
      <div class="pv-bio" id="pv-bio"></div>
      <div id="pv-genre-wrap"></div>
    </div>

    <div class="pv-actions">
      <button class="pv-edit-btn" onclick="openEditProfilePage()">Edit Profile</button>
      <button class="pv-share-btn" onclick="shareProfile()">Share Profile</button>
    </div>

    <div class="pv-stats">
      <div class="pv-stat">
        <div class="stat-label">Joined</div>
        <div class="stat-value" id="pv-stat-joined">—</div>
      </div>
      <div class="pv-stat">
        <div class="stat-label">Time on site</div>
        <div class="stat-value" id="pv-stat-usage">—</div>
      </div>
      <div class="pv-stat">
        <div class="stat-label">Your code</div>
        <div class="stat-value" id="pv-stat-code">—</div>
      </div>
    </div>

    <div class="pv-section">
      <div class="pv-section-head">
        <h3>Friends</h3>
        <button class="pv-see-all" onclick="showPage('friends')">See all</button>
      </div>
      <div class="friends-list" id="pv-friends-list"></div>
    </div>

    <div class="pv-section">
      <div class="pv-section-head">
        <h3>Saved Songs</h3>
      </div>
      <div class="pv-saved-grid" id="pv-saved-songs"></div>
    </div>
  </div>
</div>

<!-- ── FULL-PAGE EDIT PROFILE (matches reference layout) ── -->
<div class="page-section" id="page-edit-profile">
  <div class="ig-page-header">
    <button class="ig-back-btn" onclick="showPage('profile')" aria-label="Back">←</button>
    <div class="ig-page-title">Edit profile</div>
    <button class="ig-header-action" onclick="saveUserSettings()">Save</button>
  </div>
  <div class="ig-page-body">
    <div class="avatar-edit-hero">
      <img class="avatar-current" id="settings-avatar-preview" style="display:none;">
      <div class="avatar-current-fallback" id="settings-avatar-preview-fallback">?</div>
      <button type="button" class="avatar-edit-link" onclick="toggleAvatarEditPicker()">Edit picture or avatar</button>
      <div class="avatar-edit-picker" id="avatar-edit-picker">
        <div class="avatar-grid" id="settings-avatar-grid"></div>
        <p class="anon-hint" id="settings-avatar-hint">Choose from the profile pictures uploaded by the site owner.</p>
      </div>
    </div>

    <div class="pill-field">
      <label>Name</label>
      <input type="text" id="settings-realname" maxlength="60" placeholder="Your real name">
    </div>

    <div class="pill-field">
      <label>Username</label>
      <input type="text" id="settings-name" placeholder="3–20 chars, no spaces">
    </div>
    <p class="pill-hint" id="settings-name-limit" style="color:var(--accent);"></p>

    <div class="pill-field pill-select">
      <label>Pronouns</label>
      <select id="settings-pronouns" onchange="document.getElementById('settings-pronouns-custom-wrap').style.display = this.value==='custom' ? 'block' : 'none';">
        <option value="">Prefer not to say</option>
        <option value="she/her">she/her</option>
        <option value="he/him">he/him</option>
        <option value="they/them">they/them</option>
        <option value="custom">Other / custom</option>
      </select>
    </div>
    <div class="pill-field" id="settings-pronouns-custom-wrap" style="display:none;">
      <label>Custom pronouns</label>
      <input type="text" id="settings-pronouns-custom" placeholder="e.g. xe/xem">
    </div>

    <div class="pill-field">
      <label>Bio</label>
      <textarea id="settings-bio" maxlength="300" placeholder="Tell us a bit about yourself and the artists you love..." oninput="document.getElementById('settings-bio-count').textContent=this.value.length"></textarea>
    </div>
    <p class="pill-hint"><span id="settings-bio-count">0</span>/300</p>

    <div class="pill-field">
      <label>Favorite Genres / Vibe</label>
      <input type="text" id="settings-genre" maxlength="80" placeholder="e.g. shoegaze, 90s R&amp;B, ambient">
    </div>

    <div class="pill-field pill-select">
      <label>Gender</label>
      <select id="settings-gender" onchange="renderAvatarPicker((getCurrentUserRecord()||{}).avatar || null)">
        <option value="">Prefer not to say</option>
        <option value="female">Female</option>
        <option value="male">Male</option>
        <option value="nonbinary">Non-binary</option>
        <option value="other">Other</option>
      </select>
    </div>
    <p class="pill-hint">Changing this updates the set of profile pictures you can choose from above.</p>

    <button class="form-btn" onclick="saveUserSettings()">Save Changes</button>
    <p class="auth-error" id="settings-error" style="margin-top:10px;"></p>
    <p id="settings-ok" style="display:none;font-family:var(--mono);font-size:11px;color:var(--green);margin-top:10px;"></p>
  </div>
</div>

<!-- ── DIRECT MESSAGE (1:1) ── -->
<div class="page-section" id="page-dm">
<section class="chat-section">
  <div class="dm-empty-state" id="page-dm-empty">
    <div class="dm-empty-icon">💬</div>
    <div class="dm-empty-title">Your Messages</div>
    <div class="dm-empty-sub">Select a conversation to start chatting.</div>
  </div>
  <div class="dm-content" id="page-dm-content" style="display:none;">
    <div class="chat-header">
      <button class="topic-back-btn dm-back-btn" onclick="showPage('friends')" style="margin-right:10px;">‹</button>
      <div class="dm-avatar" id="dm-header-avatar"></div>
      <h4 id="dm-header-name">@friend</h4>
      <span class="count-tag" id="dm-header-meta">0 messages</span>
    </div>
    <div class="chat-messages" id="dm-messages"></div>
    <div class="chat-input-wrap" style="position:relative;">
      <button class="dm-share-btn" onclick="openSongSharePicker()" title="Share a song">♪</button>
      <input type="text" class="chat-input" id="dm-input" placeholder="Message your friend...">
      <button class="chat-send" onclick="sendDmText()">Send</button>
    </div>
  </div>
</section>
</div>

<!-- ── USER PROFILE VIEW MODAL ── -->
<div class="auth-overlay" id="user-profile-overlay">
  <div class="auth-modal" style="max-width:400px;text-align:center;">
    <button class="auth-close" onclick="closeUserProfileView()">✕</button>
    <div class="profile-view-avatar" id="profile-view-avatar">??</div>
    <div class="auth-modal-title" id="profile-view-name" style="margin-top:14px;">@user</div>
    <div class="profile-view-code" id="profile-view-code">#000-000</div>
    <p class="auth-modal-sub" id="profile-view-bio" style="text-align:left;margin-top:16px;">—</p>
    <div class="friend-row-actions" id="profile-view-actions" style="justify-content:center;margin-top:10px;"></div>
    <div id="profile-view-songs-wrap" style="display:none;margin-top:22px;text-align:left;">
      <div class="friends-block-title">Songs uploaded</div>
      <div class="friends-list" id="profile-view-songs-list" style="margin-top:10px;"></div>
    </div>
  </div>
</div>

<!-- ── SONG SHARE PICKER MODAL ── -->
<div class="auth-overlay" id="song-share-overlay">
  <div class="auth-modal" style="max-width:460px;">
    <button class="auth-close" onclick="closeSongSharePicker()">✕</button>
    <div class="auth-modal-title">Share a song</div>
    <p class="auth-modal-sub">Send a track from the archive to <span id="song-share-target-name">your friend</span> as a recommendation.</p>
    <input type="text" class="chat-search" id="song-share-search" oninput="renderSongSharePicker()" placeholder="Search the archive...">
    <div class="song-share-list" id="song-share-list"></div>
  </div>
</div>

<!-- ── SEND-TO-FRIEND BOTTOM SHEET (share a song from the archive/modal) ── -->
<div class="sheet-overlay" id="song-recipient-sheet">
  <div class="sheet-panel">
    <div class="sheet-handle"></div>
    <div class="sheet-header">
      <div>
        <div class="sheet-title">Send to a friend</div>
        <div class="sheet-sub" id="song-recipient-sheet-sub">Sending — as a DM</div>
      </div>
      <button class="sheet-close" onclick="closeSongRecipientSheet()">✕</button>
    </div>
    <div class="sheet-list" id="song-recipient-list"></div>
  </div>
</div>

<!-- ── DEDICATED TOPIC CHAT PAGE ── -->
<div class="page-section" id="page-topic-chat">
<section class="chat-section">
  <div class="topic-chat-header">
    <button class="chat-back-btn" onclick="showPage('chats-list')" aria-label="Back">‹</button>
    <div class="chat-header-avatar chat-drawer-toggle-avatar" id="topic-chat-avatar" onclick="openChatDrawer()">#</div>
    <div class="topic-chat-title-wrap">
      <div class="topic-chat-title" id="topic-chat-title">#topic</div>
      <div class="topic-chat-meta" id="topic-chat-meta">0 messages</div>
    </div>
    <button class="chat-header-icon-btn" onclick="showToast('Search coming soon.')" aria-label="Search">🔍</button>
    <button class="chat-header-icon-btn" onclick="openChatDrawer()" aria-label="Rooms">☰</button>
  </div>
  <div class="topic-chat-body">
    <div class="topic-chat-messages" id="topic-chat-messages"></div>
    <div class="reply-banner" id="topic-chat-reply-banner" style="display:none;">
      <div class="reply-banner-text">Replying to <span id="topic-chat-reply-author"></span>: <span id="topic-chat-reply-preview"></span></div>
      <button class="reply-banner-cancel" onclick="cancelReply('topic')">✕</button>
    </div>
    <div class="topic-chat-input-wrap" id="topic-chat-input-wrap" style="position:relative;">
      <div class="mention-dropdown" id="topic-chat-mention-dropdown"></div>
      <input type="text" class="chat-input" id="topic-chat-input" placeholder="Say something... (@ to mention)">
      <button class="chat-send-circle" onclick="sendTopicChat()" aria-label="Send">➤</button>
    </div>
  </div>
</section>
</div>

<!-- ── CHAT ROOM DRAWER (Discord-style, shared by Global Chat & Topic Chats) ── -->
<div class="chat-drawer-backdrop" id="chat-drawer-backdrop" onclick="closeChatDrawer()"></div>
<div class="chat-drawer" id="chat-drawer">
  <div class="chat-drawer-header">
    <h3>Chats</h3>
    <div class="chat-drawer-header-actions">
      <button class="chat-drawer-add" onclick="openCreateRoomSheet()" aria-label="Create room">+</button>
      <button class="chat-drawer-close" onclick="closeChatDrawer()" aria-label="Close">✕</button>
    </div>
  </div>
  <div class="chat-drawer-body">
    <input type="text" class="chat-search" id="room-search" placeholder="Search rooms...">
    <div class="room-list" id="room-list"></div>
  </div>
  <div class="chat-drawer-footer">
    <button class="chat-drawer-create-btn" onclick="openCreateRoomSheet()">+ Create Room</button>
  </div>
</div>
<div class="chat-drawer-edge-hint" id="chat-drawer-edge-hint" onclick="openChatDrawer()"></div>

<!-- ── CREATE ROOM SHEET ── -->
<div class="create-room-overlay" id="create-room-overlay" onclick="if(event.target===this)closeCreateRoomSheet()">
  <div class="create-room-sheet" style="position:relative;">
    <div class="create-room-sheet-handle"></div>
    <button class="chat-drawer-close create-room-close" onclick="closeCreateRoomSheet()" aria-label="Close">✕</button>
    <div class="create-room-title">Create a Room</div>
    <div class="create-room-sub">Start a new chat room around a song or artist.</div>
    <div class="create-room-label">Room Name</div>
    <input type="text" id="new-room-name" placeholder="Enter room name...">
    <div class="create-room-label">Description</div>
    <textarea id="new-room-desc" placeholder="What's this room about?"></textarea>
    <div class="create-room-label">Category</div>
    <select id="new-room-category">
      <option value="music-discussion">🎵 Music Discussion</option>
      <option value="genre">🎧 Genre Specific</option>
      <option value="fanclub">⭐ Artist Fanclub</option>
      <option value="general">💬 General Chat</option>
    </select>
    <div class="create-room-label">Privacy</div>
    <div class="create-room-privacy">
      <button type="button" class="privacy-option active" id="privacy-public" onclick="setRoomPrivacy('public')">
        <span class="privacy-icon">🔓</span>
        <span class="privacy-text"><strong>Public</strong><small>Anyone can join</small></span>
      </button>
      <button type="button" class="privacy-option" id="privacy-private" onclick="setRoomPrivacy('private')">
        <span class="privacy-icon">🔒</span>
        <span class="privacy-text"><strong>Private</strong><small>Invite only</small></span>
      </button>
    </div>
    <button class="form-btn" onclick="createRoom()">Create Room</button>
  </div>
</div>

<!-- ── ADMIN PANEL ── -->
<div class="page-section" id="page-admin">
<section class="admin-section">
  <div class="admin-header">
    <div class="admin-header-titles">
      <div class="admin-eyebrow"><span class="dot"></span>Control Center</div>
      <h2>Admin Dashboard</h2>
    </div>
    <button class="auth-btn" onclick="adminLogout()">Log Out</button>
  </div>

  <div class="admin-stats-strip">
    <div class="admin-stat-card"><span class="stat-icon">♪</span><span class="stat-num" id="admin-stat-songs">00</span><span class="stat-lbl">Songs Live</span></div>
    <div class="admin-stat-card"><span class="stat-icon">◍</span><span class="stat-num" id="admin-stat-users">00</span><span class="stat-lbl">Registered Users</span></div>
    <div class="admin-stat-card"><span class="stat-icon">✉</span><span class="stat-num" id="admin-stat-pending">00</span><span class="stat-lbl">Pending Submissions</span></div>
    <div class="admin-stat-card"><span class="stat-icon">❖</span><span class="stat-num" id="admin-stat-rooms">00</span><span class="stat-lbl">Chat Rooms</span></div>
  </div>

  <div class="admin-grid">
    <div class="admin-nav">
      <div class="admin-nav-group-label">Content</div>
      <div class="admin-nav-item active" onclick="showAdminTab('site')"><span class="ni-icon">⚙</span>Site Settings</div>
      <div class="admin-nav-item" onclick="showAdminTab('songs')"><span class="ni-icon">♪</span>Manage Songs</div>
      <div class="admin-nav-item" onclick="showAdminTab('add')"><span class="ni-icon">＋</span>Add New Song</div>
      <div class="admin-nav-item" onclick="showAdminTab('genres')"><span class="ni-icon">▤</span>Genres</div>
      <div class="admin-nav-item" onclick="showAdminTab('moods')"><span class="ni-icon">◐</span>Moods</div>
      <div class="admin-nav-group-label">Community</div>
      <div class="admin-nav-item" onclick="showAdminTab('users')"><span class="ni-icon">◍</span>Users</div>
      <div class="admin-nav-item" onclick="showAdminTab('avatars')"><span class="ni-icon">▣</span>Avatars</div>
      <div class="admin-nav-item" onclick="showAdminTab('submissions')"><span class="ni-icon">✉</span>Submissions<span class="ni-badge" id="admin-nav-pending-badge" style="display:none;"></span></div>
      <div class="admin-nav-item" onclick="showAdminTab('reports')"><span class="ni-icon">🚩</span>Reports<span class="ni-badge" id="admin-nav-reports-badge" style="display:none;"></span></div>
      <div class="admin-nav-item" onclick="showAdminTab('chat')"><span class="ni-icon">❖</span>Chat System</div>
      <div class="admin-nav-item" onclick="showAdminTab('safety')"><span class="ni-icon">🛡</span>Safety &amp; Bots</div>
      <div class="admin-nav-item" onclick="showAdminTab('email')"><span class="ni-icon">📧</span>Email (OTP)</div>
      <div class="admin-nav-group-label">System</div>
      <div class="admin-nav-item" onclick="showAdminTab('livestats')"><span class="ni-icon">◉</span>Live Stats<span class="ni-badge" id="admin-nav-live-badge" style="display:none;"></span></div>
      <div class="admin-nav-item" onclick="showAdminTab('database')"><span class="ni-icon">▦</span>Database</div>
    </div>
    <div class="admin-panel" id="admin-panel">
      <!-- Site Settings -->
      <div id="admin-tab-site">
        <h3>Site Settings</h3>
        <div class="admin-form">
          <div class="form-group full">
            <label>Hero Title</label>
            <input class="form-input" type="text" id="adm-hero-title" value="Songs that found me\nin the dark">
          </div>
          <div class="form-group full">
            <label>Hero Subtitle</label>
            <textarea class="form-input" id="adm-hero-sub">A nerd's archive of niche indie, alternative & pop — with liner notes, meanings, and the exact moods they belong to. No algorithms. Just obsession.</textarea>
          </div>
          <div class="form-group full">
            <label>About Title</label>
            <input class="form-input" type="text" id="adm-about-title" value="Not a blog.\nAn obsession.">
          </div>
          <div class="form-group full">
            <label>About Body</label>
            <textarea class="form-input" id="adm-about-body">AfterLight:404Archive is a personal site by JK — a place to document the songs that don't chart, don't trend, but live rent-free in your head for years.</textarea>
          </div>
          <div class="form-group full">
            <label>Archive Section Title</label>
            <input class="form-input" type="text" id="adm-archive-title" value="The Archive">
          </div>
          <div class="form-group full">
            <label>Submit Page Title</label>
            <input class="form-input" type="text" id="adm-submit-title" value="Submit Your Own Song">
          </div>
          <div class="form-group full">
            <label>Submit Page Description</label>
            <textarea class="form-input" id="adm-submit-desc">Found a song that lives rent-free in your head? Share it with the archive.</textarea>
          </div>
          <div class="form-group">
            <label>Accent Color</label>
            <div class="color-picker-wrap">
              <input type="color" id="adm-accent" value="#C8A96E">
              <span style="font-family:var(--mono);font-size:12px;color:var(--muted);">Warm amber</span>
            </div>
          </div>
          <div class="form-group">
            <label>Secondary Color</label>
            <div class="color-picker-wrap">
              <input type="color" id="adm-accent2" value="#7B6FA0">
              <span style="font-family:var(--mono);font-size:12px;color:var(--muted);">Dusty violet</span>
            </div>
          </div>
          <button class="form-btn" onclick="saveSiteSettings()">Save Changes</button>
        </div>

        <h3 style="margin-top:40px;">Admin Access Code</h3>
        <p style="font-family:var(--mono);font-size:11px;color:var(--muted);line-height:1.7;margin-bottom:18px;max-width:560px;">
          This is the code someone enters (after clicking the logo 5 times) before they even see the admin login form.
          It's a light front-door lock, not a strong secret — like the rest of this site's auth, it's checked in the
          browser, so treat it as a deterrent for casual visitors rather than a real security boundary. The real gate
          is your admin email + password below. The code is stored as a hash, not plain text, and the field below is
          always blank — it never shows the current code back to you (or anyone else).
        </p>
        <div class="admin-form">
          <div class="form-group">
            <label>Set New Access Code</label>
            <input class="form-input" type="text" id="adm-access-code-input" placeholder="Leave blank to keep current code" autocomplete="off">
          </div>
          <button class="form-btn" onclick="saveAdminAccessCode()" style="align-self:end;">Save Code</button>
          <p class="auth-error" id="adm-access-code-ok" style="display:none;color:var(--green);grid-column:1/-1;"></p>
        </div>

        <h3 style="margin-top:40px;">Admin Login Credentials</h3>
        <p style="font-family:var(--mono);font-size:11px;color:var(--muted);line-height:1.7;margin-bottom:18px;max-width:560px;">
          This is the real admin email + password used on the login screen. Changing it here updates it for every
          browser (once Supabase is connected — otherwise it only applies to this browser). The password is stored
          as a hash, never in plain text, and these fields stay blank on load.
        </p>
        <div class="admin-form">
          <div class="form-group">
            <label>Admin Email</label>
            <input class="form-input" type="email" id="adm-login-email-input" placeholder="Leave blank to keep current email" autocomplete="off">
          </div>
          <div class="form-group">
            <label>New Password</label>
            <input class="form-input" type="password" id="adm-login-pass-input" placeholder="Leave blank to keep current password" autocomplete="new-password">
          </div>
          <div class="form-group">
            <label>Confirm New Password</label>
            <input class="form-input" type="password" id="adm-login-pass-input2" placeholder="Confirm new password" autocomplete="new-password">
          </div>
          <button class="form-btn" onclick="saveAdminLoginCredentials()" style="align-self:end;">Save Credentials</button>
          <p class="auth-error" id="adm-login-cred-ok" style="display:none;color:var(--green);grid-column:1/-1;"></p>
          <p class="auth-error" id="adm-login-cred-err" style="display:none;grid-column:1/-1;"></p>
        </div>

        <h3 style="margin-top:40px;">👑 Owner Account</h3>
        <p style="font-family:var(--mono);font-size:11px;color:var(--muted);line-height:1.7;margin-bottom:18px;max-width:560px;">
          Link one chat/user account (by @username) as the site Owner. That account gets a gold profile
          frame, a crown badge, an OWNER tag everywhere its name appears, and the power to ban/unban any
          user directly from their public profile card — no need to open this dashboard. Only one owner
          account at a time.
        </p>
        <div class="admin-form">
          <div class="form-group">
            <label>Owner's @username</label>
            <input class="form-input" type="text" id="adm-owner-username-input" placeholder="e.g. jk">
          </div>
          <button class="form-btn" onclick="saveOwnerUsername()" style="align-self:end;">Set as Owner</button>
          <p class="auth-error" id="adm-owner-ok" style="display:none;color:var(--green);grid-column:1/-1;"></p>
          <p class="auth-error" id="adm-owner-err" style="display:none;grid-column:1/-1;"></p>
          <p style="font-family:var(--mono);font-size:10.5px;color:var(--dim);grid-column:1/-1;">
            Current owner: <strong id="adm-owner-current" style="color:var(--accent);">none set</strong>
            <button class="form-btn" style="margin-left:10px;padding:4px 10px;font-size:9px;background:transparent;border:1px solid var(--red);color:var(--red);" onclick="clearOwnerUsername()">Remove Owner</button>
          </p>
        </div>
      </div>
      <!-- Manage Songs -->
      <div id="admin-tab-songs" style="display:none;">
        <h3>Manage Songs</h3>
        <div class="admin-songs-list" id="admin-songs-list"></div>
      </div>
      <!-- Add Song -->
      <div id="admin-tab-add" style="display:none;">
        <h3>Add New Song</h3>
        <div class="admin-form">
          <div class="form-group">
            <label>Number</label>
            <input class="form-input" type="text" id="adm-song-num" placeholder="#007">
          </div>
          <div class="form-group">
            <label>Title</label>
            <input class="form-input" type="text" id="adm-song-title" placeholder="Song Title">
          </div>
          <div class="form-group">
            <label>Artist</label>
            <input class="form-input" type="text" id="adm-song-artist" placeholder="Artist Name">
          </div>
          <div class="form-group">
            <label>Year · Album</label>
            <input class="form-input" type="text" id="adm-song-year" placeholder="2024 · Album Name">
          </div>
          <div class="form-group">
            <label>Mood</label>
            <select class="form-input" id="adm-song-mood"></select>
          </div>
          <div class="form-group full">
            <label>Description</label>
            <textarea class="form-input" id="adm-song-about"></textarea>
          </div>
          <div class="form-group full">
            <label>Meaning</label>
            <textarea class="form-input" id="adm-song-meaning"></textarea>
          </div>
          <div class="form-group full">
            <label>Lyrics</label>
            <textarea class="form-input" id="adm-song-lyrics"></textarea>
          </div>
          <div class="form-group full">
            <label>Fun Fact</label>
            <textarea class="form-input" id="adm-song-funfact"></textarea>
          </div>
          <div class="form-group full">
            <label>Credit / Copyright</label>
            <input class="form-input" type="text" id="adm-song-credit">
          </div>
          <div class="form-group full">
            <label>Spotify Link</label>
            <input class="form-input" type="url" id="adm-song-spotify">
          </div>
          <div class="form-group">
            <label>Genre 1</label>
            <input class="form-input" type="text" id="adm-song-genre1">
          </div>
          <div class="form-group">
            <label>Genre 2</label>
            <input class="form-input" type="text" id="adm-song-genre2">
          </div>
          <button class="form-btn" onclick="addSongFromAdmin()">Add Song</button>
        </div>
      </div>
      <!-- Users -->
      <div id="admin-tab-users" style="display:none;">
        <h3>Registered Users</h3>
        <div style="display:flex;gap:10px;margin-bottom:14px;flex-wrap:wrap;">
          <input type="text" class="chat-search" id="admin-user-search" oninput="renderAdminUsers()" placeholder="Search by username, real name, or email..." style="flex:1;min-width:180px;margin-bottom:0;">
          <select class="form-input" id="admin-user-sort" onchange="renderAdminUsers()" style="max-width:220px;flex-shrink:0;">
            <option value="newest">Newest signups</option>
            <option value="oldest">Oldest signups</option>
            <option value="most-time">Most time on site</option>
            <option value="least-time">Least time on site</option>
            <option value="most-submits">Most submissions</option>
            <option value="az">Username A–Z</option>
            <option value="za">Username Z–A</option>
            <option value="blocked-first">Blocked first</option>
          </select>
        </div>
        <div class="admin-songs-list" id="admin-users-list"></div>
      </div>
      <!-- Avatars -->
      <div id="admin-tab-avatars" style="display:none;">
        <h3>Profile Pictures</h3>
        <p style="font-family:var(--mono);font-size:11px;color:var(--muted);margin-bottom:20px;">Upload the profile pictures users are allowed to choose from, tagged by gender. Users can only pick from images uploaded here — no outside images.</p>
        <div style="display:flex;gap:8px;margin-bottom:16px;flex-wrap:wrap;" id="admin-avatar-filter-tabs">
          <button class="sub-bulk-btn active" onclick="setAdminAvatarFilter('all', this)">All</button>
          <button class="sub-bulk-btn" onclick="setAdminAvatarFilter('female', this)">Female</button>
          <button class="sub-bulk-btn" onclick="setAdminAvatarFilter('male', this)">Male</button>
          <button class="sub-bulk-btn" onclick="setAdminAvatarFilter('any', this)">Unisex</button>
        </div>
        <div class="admin-avatar-grid" id="admin-avatar-grid"></div>
        <div style="margin-top:24px;padding-top:24px;border-top:1px solid var(--border);">
          <div class="form-group full">
            <label>Upload Image</label>
            <input class="form-input" type="file" accept="image/*" id="adm-new-avatar" style="padding:8px;">
            <p class="anon-hint">JPG or PNG. Will be auto-cropped to a square and resized.</p>
          </div>
          <div class="form-group full">
            <label>Assign To</label>
            <select class="form-input" id="adm-new-avatar-gender">
              <option value="any">Unisex — shown to everyone</option>
              <option value="female">Female</option>
              <option value="male">Male</option>
            </select>
            <p class="anon-hint">Users only see avatars tagged for their own gender, plus anything marked Unisex.</p>
          </div>
          <button class="form-btn" onclick="addAvatar()" style="max-width:200px;">Add Avatar</button>
          <p class="auth-error" id="adm-avatar-error" style="margin-top:10px;"></p>
        </div>
      </div>
      <!-- Genres -->
      <div id="admin-tab-genres" style="display:none;">
        <h3>Manage Genres</h3>
        <p style="font-family:var(--mono);font-size:11px;color:var(--muted);margin-bottom:20px;">Add, edit, or remove genre tags used across the archive.</p>
        <div class="admin-songs-list" id="admin-genres-list"></div>
        <div style="margin-top:24px;padding-top:24px;border-top:1px solid var(--border);">
          <div class="form-group full">
            <label>Add New Genre</label>
            <input class="form-input" type="text" id="adm-new-genre" placeholder="e.g. Dream Pop, Shoegaze, Post-Punk">
          </div>
          <button class="form-btn" onclick="addGenre()" style="max-width:200px;">Add Genre</button>
        </div>
      </div>

      <!-- Moods -->
      <div id="admin-tab-moods" style="display:none;">
        <h3>Manage Moods</h3>
        <p style="font-family:var(--mono);font-size:11px;color:var(--muted);margin-bottom:20px;">Moods power the filter bar and the colored tags on every song. Add, rename, recolor, or remove them.</p>
        <div class="admin-songs-list" id="admin-moods-list"></div>
        <div style="margin-top:24px;padding-top:24px;border-top:1px solid var(--border);">
          <div class="admin-form" style="grid-template-columns: 1fr 1fr 80px;">
            <div class="form-group">
              <label>Mood Key (no spaces)</label>
              <input class="form-input" type="text" id="adm-new-mood-key" placeholder="e.g. nostalgic">
            </div>
            <div class="form-group">
              <label>Display Label</label>
              <input class="form-input" type="text" id="adm-new-mood-label" placeholder="e.g. nostalgic ache">
            </div>
            <div class="form-group">
              <label>Color</label>
              <input class="form-input" type="color" id="adm-new-mood-color" value="#C8A96E" style="padding:4px;height:42px;cursor:pointer;">
            </div>
          </div>
          <button class="form-btn" onclick="addMood()" style="max-width:200px;margin-top:8px;">Add Mood</button>
        </div>
      </div>

      <!-- Submissions -->
      <div id="admin-tab-submissions" style="display:none;">
        <h3>Pending Submissions</h3>
        <div class="sub-bulk-toolbar" id="sub-bulk-toolbar">
          <button class="sub-bulk-btn" id="sub-select-toggle-btn" onclick="toggleSubmissionSelectMode()">Select</button>
          <button class="sub-bulk-btn" id="sub-accept-all-btn" onclick="approveAllSubmissions()">Accept All</button>
          <button class="sub-bulk-btn approve" id="sub-approve-selected-btn" style="display:none;" onclick="approveSelectedSubmissions()">Approve Selected (0)</button>
          <button class="sub-bulk-btn" id="sub-cancel-select-btn" style="display:none;" onclick="toggleSubmissionSelectMode()">Cancel</button>
        </div>
        <div class="admin-songs-list" id="admin-submissions-list"></div>
      </div>

      <!-- Reports -->
      <div id="admin-tab-reports" style="display:none;">
        <h3>User Reports</h3>
        <p style="font-family:var(--mono);font-size:11px;color:var(--muted);margin-bottom:20px;">Reports filed by users on other users or chat messages. Only visible here — the reporter and reported user never see this list.</p>
        <div class="admin-songs-list" id="admin-reports-list"></div>
      </div>

      <!-- Chat System -->
      <div id="admin-tab-chat" style="display:none;">
        <h3>Chat System</h3>
        <p style="font-family:var(--mono);font-size:11px;color:var(--muted);margin-bottom:20px;">Full control over the chat system — toggle it on or off, manage rooms, and moderate messages.</p>

        <div class="admin-card" style="margin-bottom:20px;">
          <div class="admin-row">
            <div>
              <div style="font-family:var(--mono);font-size:12px;color:var(--text);font-weight:600;">Chat system enabled</div>
              <div style="font-family:var(--mono);font-size:10px;color:var(--muted);margin-top:4px;">Turn this off to hide chat site-wide (nav links disappear, page blocked).</div>
            </div>
            <label class="chat-enable-switch">
              <input type="checkbox" id="adm-chat-enabled" onchange="toggleChatSystem()" checked>
              <span class="chat-enable-track"><span class="chat-enable-thumb"></span></span>
            </label>
          </div>
        </div>

        <div class="admin-card" style="margin-bottom:20px;">
          <div class="admin-row">
            <div>
              <div style="font-family:var(--mono);font-size:12px;color:var(--text);font-weight:600;">AI moderation</div>
              <div style="font-family:var(--mono);font-size:10px;color:var(--muted);margin-top:4px;">Screens every chat/room/DM message for harassment, hate, sexual content, violence, self-harm, and grooming signals before it posts. Requires the <code>moderate-message</code> Edge Function + an OpenAI key — see Database tab.</div>
            </div>
            <label class="chat-enable-switch">
              <input type="checkbox" id="adm-moderation-enabled" onchange="toggleModerationSystem()" checked>
              <span class="chat-enable-track"><span class="chat-enable-thumb"></span></span>
            </label>
          </div>
          <div id="adm-moderation-status" style="font-family:var(--mono);font-size:10px;color:var(--muted);margin-top:10px;"></div>
        </div>

        <h4 style="font-family:var(--mono);font-size:11px;letter-spacing:0.1em;text-transform:uppercase;color:var(--accent);margin-bottom:12px;">All Rooms</h4>
        <div class="admin-songs-list" id="admin-chat-rooms-list"></div>

        <div id="admin-chat-room-detail" style="margin-top:24px;"></div>
      </div>

      <!-- Email (OTP): EmailJS config, so signup verification codes actually
           get emailed instead of just showing on-screen in "demo mode". -->
      <div id="admin-tab-email" style="display:none;">
        <h3>Email (OTP)</h3>
        <p style="font-family:var(--mono);font-size:11px;color:var(--muted);margin-bottom:20px;line-height:1.7;">Paste your EmailJS details here and signup verification codes will be emailed for real, instead of just appearing on-screen. All three values below are meant to be public (same spirit as the Supabase key on the Database tab) — EmailJS has no separate "secret" key for this. If you save while connected to Supabase, these sync to every visitor's browser through <code style="color:var(--accent2);">site_settings</code>; otherwise they're saved to this browser only.</p>

        <div id="adm-emailjs-status" style="font-family:var(--mono);font-size:10px;color:var(--muted);margin-bottom:16px;padding:10px 12px;border:1px solid var(--border);border-radius:6px;background:var(--bg);"></div>

        <div class="admin-form" style="grid-template-columns: 1fr;margin-bottom:12px;">
          <div class="form-group full">
            <label>Public Key</label>
            <input class="form-input" type="text" id="adm-emailjs-publickey" placeholder="e.g. AbCdEfGhIjKlMnOp">
            <p class="anon-hint">EmailJS dashboard → Account → General → "Public Key".</p>
          </div>
          <div class="form-group full">
            <label>Service ID</label>
            <input class="form-input" type="text" id="adm-emailjs-serviceid" placeholder="e.g. service_xxxxxxx">
            <p class="anon-hint">EmailJS dashboard → Email Services → your connected inbox → "Service ID".</p>
          </div>
          <div class="form-group full">
            <label>Template ID</label>
            <input class="form-input" type="text" id="adm-emailjs-templateid" placeholder="e.g. template_xxxxxxx">
            <p class="anon-hint">EmailJS dashboard → Email Templates → your template → "Template ID". The template body must use <code style="color:var(--accent2);">{{to_email}}</code>, <code style="color:var(--accent2);">{{to_name}}</code> and <code style="color:var(--accent2);">{{passcode}}</code> as its variables.</p>
          </div>
        </div>
        <div style="display:flex;gap:10px;flex-wrap:wrap;margin-bottom:24px;">
          <button class="form-btn secondary" style="max-width:200px;" onclick="saveEmailjsConfig()">Save</button>
          <button class="form-btn secondary" style="max-width:220px;" onclick="sendTestVerificationEmail()">Send Test Email</button>
        </div>
        <p style="font-family:var(--mono);font-size:10px;color:var(--muted);margin-top:-14px;margin-bottom:24px;" id="adm-emailjs-test-result"></p>

        <div class="settings-divider"></div>

        <h4 style="font-family:var(--mono);font-size:11px;letter-spacing:0.1em;text-transform:uppercase;color:var(--accent);margin:20px 0 12px;">EmailJS setup (once, ~5 minutes, free tier = 200 emails/month)</h4>
        <div style="font-family:var(--sans);font-size:13px;color:var(--dim);line-height:1.8;">
          <p style="margin-bottom:10px;"><strong style="color:var(--text);">1.</strong> Create a free account at <span style="color:var(--accent);">emailjs.com</span>.</p>
          <p style="margin-bottom:10px;"><strong style="color:var(--text);">2.</strong> Email Services → Add New Service → connect Gmail/Outlook/any inbox you control → copy the Service ID.</p>
          <p style="margin-bottom:10px;"><strong style="color:var(--text);">3.</strong> Email Templates → Create New Template using the <code style="color:var(--accent2);">to_email</code> / <code style="color:var(--accent2);">to_name</code> / <code style="color:var(--accent2);">passcode</code> variables above → copy the Template ID.</p>
          <p style="margin-bottom:10px;"><strong style="color:var(--text);">4.</strong> Account → General → copy the Public Key.</p>
          <p>Paste all three above and click Save. Until they're filled in (here or in <code style="color:var(--accent2);">config.js</code>), signup falls back to showing the code on-screen so it's never blocked.</p>
        </div>
      </div>

      <!-- Safety & Bots: Cloudflare Turnstile + OpenAI moderation config -->
      <div id="admin-tab-safety" style="display:none;">
        <h3>Safety &amp; Bots</h3>
        <p style="font-family:var(--mono);font-size:11px;color:var(--muted);margin-bottom:20px;line-height:1.7;">Two independent layers: Turnstile stops bots from signing up, OpenAI moderation screens chat text once real people are in. Both need a small Supabase Edge Function to hold the secret keys — a static page like this one can never keep a secret safe in its own source, so the widget/toggle below only stores the <em>public</em> half of each setup.</p>

        <h4 style="font-family:var(--mono);font-size:11px;letter-spacing:0.1em;text-transform:uppercase;color:var(--accent);margin-bottom:12px;">Cloudflare Turnstile (bot check on signup)</h4>
        <div class="admin-card" style="margin-bottom:20px;">
          <div class="admin-row">
            <div>
              <div style="font-family:var(--mono);font-size:12px;color:var(--text);font-weight:600;">Turnstile enabled</div>
              <div style="font-family:var(--mono);font-size:10px;color:var(--muted);margin-top:4px;">Shows a Cloudflare "prove you're not a robot" widget on the signup form and blocks submission until it passes. Works alongside the existing honeypot field.</div>
            </div>
            <label class="chat-enable-switch">
              <input type="checkbox" id="adm-turnstile-enabled" onchange="toggleTurnstileSystem()">
              <span class="chat-enable-track"><span class="chat-enable-thumb"></span></span>
            </label>
          </div>
          <div id="adm-turnstile-status" style="font-family:var(--mono);font-size:10px;color:var(--muted);margin-top:10px;"></div>
        </div>

        <div class="admin-form" style="grid-template-columns: 1fr;margin-bottom:12px;">
          <div class="form-group full">
            <label>Turnstile Site Key (public)</label>
            <input class="form-input" type="text" id="adm-turnstile-sitekey" placeholder="0x4AAAAAAAxxxxxxxxxxxxxx">
            <p class="anon-hint">From Cloudflare dashboard → Turnstile → your widget → "Site Key". Safe to expose in page source — it's the secret key that must never go here.</p>
          </div>
        </div>
        <button class="form-btn secondary" style="max-width:200px;margin-bottom:24px;" onclick="saveTurnstileSiteKey()">Save Site Key</button>

        <div class="settings-divider"></div>

        <h4 style="font-family:var(--mono);font-size:11px;letter-spacing:0.1em;text-transform:uppercase;color:var(--accent);margin:20px 0 12px;">Turnstile setup (once)</h4>
        <div style="font-family:var(--sans);font-size:13px;color:var(--dim);line-height:1.8;margin-bottom:16px;">
          <p style="margin-bottom:10px;"><strong style="color:var(--text);">1.</strong> In <span style="color:var(--accent);">dash.cloudflare.com</span> → <strong style="color:var(--text);">Turnstile</strong> → Add Widget. Domain = your hosted site's domain, mode = Managed.</p>
          <p style="margin-bottom:10px;"><strong style="color:var(--text);">2.</strong> Copy the <strong style="color:var(--text);">Site Key</strong> into the field above and click Save.</p>
          <p style="margin-bottom:10px;"><strong style="color:var(--text);">3.</strong> Copy the <strong style="color:var(--text);">Secret Key</strong> — this one is dangerous to expose, it must live only in Supabase, never in this file.</p>
          <p style="margin-bottom:10px;"><strong style="color:var(--text);">4.</strong> Paste it in your Supabase project's own secrets page — <span style="color:var(--accent);">Edge Functions → Secrets</span> — add key <code style="color:var(--accent2);">TURNSTILE_SECRET_KEY</code>, value = your secret key, and Save. No CLI needed.</p>
          <p><strong style="color:var(--text);">5.</strong> Toggle Turnstile on above. The signup form will now render a real widget and refuse to submit until Cloudflare confirms the visitor passed.</p>
        </div>
        <p style="font-family:var(--mono);font-size:11px;color:var(--accent);margin-bottom:16px;">✓ The <code style="color:var(--accent2);">verify-turnstile</code> function below is already deployed to your project — step 4 (pasting your secret key) is the only thing left to do. <strong>Important:</strong> Turnstile is currently switched ON but this secret isn't set yet, so every signup attempt right now is being rejected — either paste the secret key now, or turn Turnstile off above until you do.</p>
        <a href="https://supabase.com/dashboard/project/yhpqyjdluppjmmhrybfy/functions/secrets" target="_blank" rel="noopener" class="form-btn secondary" style="max-width:260px;display:inline-block;text-align:center;text-decoration:none;margin-bottom:16px;">Open Secrets Page →</a>
        <pre style="background:var(--bg);border:1px solid var(--border);border-radius:6px;padding:14px;font-family:var(--mono);font-size:10px;color:var(--dim);overflow-x:auto;white-space:pre;line-height:1.6;margin-bottom:8px;" id="turnstile-fn-code">// supabase/functions/verify-turnstile/index.ts
// Deno Edge Function — verifies a Turnstile token server-side, where the
// secret key can actually stay secret.
//
// Every browser sends an OPTIONS "preflight" request before the real POST
// when calling a function like this cross-origin — it must be handled
// explicitly and return CORS headers, or the browser blocks the real
// request before it's ever sent (this looks identical to "verification
// always fails" from the signup form, even with a correct secret key).
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { token, remoteip } = await req.json();
    const secret = Deno.env.get("TURNSTILE_SECRET_KEY");

    if (!secret) {
      return new Response(JSON.stringify({ success: false, reason: "TURNSTILE_SECRET_KEY not set in Supabase secrets yet" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    const body = new URLSearchParams();
    body.set("secret", secret);
    body.set("response", token ?? "");
    if (remoteip) body.set("remoteip", remoteip);

    const cfRes = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      { method: "POST", body }
    );
    const outcome = await cfRes.json();

    return new Response(JSON.stringify({ success: !!outcome.success, errorCodes: outcome["error-codes"] || [] }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, reason: String(error) }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  }
});</pre>
        <button class="form-btn secondary" style="max-width:200px;" onclick="copyTurnstileFnCode()">Copy Function Code</button>
        <p style="font-family:var(--mono);font-size:10px;color:var(--muted);margin-top:8px;" id="turnstile-copy-confirm"></p>

        <div class="settings-divider"></div>

        <h4 style="font-family:var(--mono);font-size:11px;letter-spacing:0.1em;text-transform:uppercase;color:var(--accent);margin:20px 0 12px;">OpenAI Moderation (chat/DM screening)</h4>
        <p style="font-family:var(--mono);font-size:11px;color:var(--muted);margin-bottom:16px;line-height:1.7;">This reuses the <strong style="color:var(--text);">AI moderation</strong> toggle already in the Chat System tab — flip it there. This section just holds the OpenAI-specific config and the Edge Function code it calls, since that toggle didn't have setup instructions yet.</p>

        <div class="admin-form" style="grid-template-columns: 1fr 1fr;margin-bottom:12px;">
          <div class="form-group">
            <label>Model</label>
            <select class="form-input" id="adm-moderation-model">
              <option value="omni-moderation-latest" selected>omni-moderation-latest</option>
              <option value="text-moderation-latest">text-moderation-latest (legacy)</option>
            </select>
          </div>
          <div class="form-group">
            <label>On flagged message</label>
            <select class="form-input" id="adm-moderation-action">
              <option value="block" selected>Block from posting</option>
              <option value="flag">Allow, but flag for admin review</option>
            </select>
          </div>
        </div>
        <button class="form-btn secondary" style="max-width:200px;margin-bottom:24px;" onclick="saveModerationConfig()">Save Config</button>

        <h4 style="font-family:var(--mono);font-size:11px;letter-spacing:0.1em;text-transform:uppercase;color:var(--accent);margin-bottom:12px;">Moderation setup (once)</h4>
        <div style="font-family:var(--sans);font-size:13px;color:var(--dim);line-height:1.8;margin-bottom:16px;">
          <p style="margin-bottom:10px;"><strong style="color:var(--text);">1.</strong> Get an API key at <span style="color:var(--accent);">platform.openai.com</span> → API Keys. The Moderation endpoint is free to call.</p>
          <p style="margin-bottom:10px;"><strong style="color:var(--text);">2.</strong> Paste it in your Supabase project's own secrets page — <span style="color:var(--accent);">Edge Functions → Secrets</span> (or go straight to <code style="color:var(--accent2);">/dashboard/project/_/functions/secrets</code>) — add key <code style="color:var(--accent2);">OPENAI_API_KEY</code>, value <code style="color:var(--accent2);">sk-...</code>, and Save. No CLI needed, and it never touches this site's code or your browser — this is deliberate: unlike the Supabase/EmailJS keys elsewhere in this panel, an OpenAI key is a real secret, so there's no paste-it-here box on this page on purpose.</p>
          <p><strong style="color:var(--text);">3.</strong> Make sure Database (Supabase) is connected above and the AI moderation toggle in Chat System is on — <code style="color:var(--accent2);">moderateText()</code> already calls this function for every chat/DM send.</p>
        </div>
        <p style="font-family:var(--mono);font-size:11px;color:var(--accent);margin-bottom:16px;">✓ The <code style="color:var(--accent2);">moderate-message</code> function below is already deployed to your project — step 2 (pasting your key) is the only thing left to do.</p>
        <a href="https://supabase.com/dashboard/project/yhpqyjdluppjmmhrybfy/functions/secrets" target="_blank" rel="noopener" class="form-btn secondary" style="max-width:260px;display:inline-block;text-align:center;text-decoration:none;margin-bottom:16px;">Open Secrets Page →</a>
        <pre style="background:var(--bg);border:1px solid var(--border);border-radius:6px;padding:14px;font-family:var(--mono);font-size:10px;color:var(--dim);overflow-x:auto;white-space:pre;line-height:1.6;margin-bottom:8px;" id="moderation-fn-code">// supabase/functions/moderate-message/index.ts
// Deno Edge Function — screens one chat message with OpenAI's Moderation
// endpoint and returns a verdict the client already knows how to handle:
// { action: 'allow' | 'block' | 'self_harm', text, supportMessage? }
//
// Every browser sends an OPTIONS "preflight" request before the real POST
// when calling a function like this cross-origin — it must be handled
// explicitly and return CORS headers, or the browser blocks the real
// request before it's ever sent, and every message silently stops
// reaching this function at all (even with a correct OpenAI key).
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const ACTION_ON_FLAG = "block"; // or "flag" — mirrors the admin dropdown

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { text } = await req.json();
    const apiKey = Deno.env.get("OPENAI_API_KEY");

    if (!apiKey) {
      // Fail open rather than break chat entirely just because no key is set yet.
      return new Response(JSON.stringify({ action: "allow", text }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    const res = await fetch("https://api.openai.com/v1/moderations", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ model: "omni-moderation-latest", input: text }),
    });
    const data = await res.json();
    const result = data.results?.[0];

    if (!result) {
      return new Response(JSON.stringify({ action: "allow", text }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200,
      });
    }
    if (result.categories?.["self-harm"] || result.categories?.["self-harm/intent"]) {
      return new Response(JSON.stringify({
        action: "self_harm",
        text,
        supportMessage:
          "If you're struggling, you don't have to go through it alone — reach out to someone you trust or a crisis line.",
      }), { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 });
    }
    if (result.flagged) {
      return new Response(JSON.stringify({ action: ACTION_ON_FLAG, text }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200,
      });
    }
    return new Response(JSON.stringify({ action: "allow", text }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ action: "allow", error: String(error) }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200,
    });
  }
});</pre>
        <button class="form-btn secondary" style="max-width:200px;" onclick="copyModerationFnCode()">Copy Function Code</button>
        <p style="font-family:var(--mono);font-size:10px;color:var(--muted);margin-top:8px;" id="moderation-copy-confirm"></p>
      </div>

      <!-- Database / Supabase -->
      <div id="admin-tab-livestats" style="display:none;">
        <div class="admin-row" style="margin-bottom:16px;">
          <h3 style="margin-bottom:0;">Live Stats</h3>
          <button class="form-btn secondary" style="max-width:140px;" onclick="loadLiveStatsCounts();renderLiveStatsPresence();">↻ Refresh</button>
        </div>
        <p style="font-family:var(--mono);font-size:11px;color:var(--muted);margin-bottom:20px;line-height:1.7;" id="ls-data-source-note">Local mode — connect Supabase (Database tab) for site-wide live stats across every visitor, not just this device.</p>

        <h4 style="font-family:var(--mono);font-size:11px;letter-spacing:0.1em;text-transform:uppercase;color:var(--accent);margin-bottom:12px;">Right Now</h4>
        <div class="admin-stats-strip" style="grid-template-columns:repeat(3,1fr);margin-bottom:24px;">
          <div class="admin-stat-card"><span class="stat-icon">🟢</span><span class="stat-num" id="ls-online-total">0</span><span class="stat-lbl">Online Now</span></div>
          <div class="admin-stat-card"><span class="stat-icon">◍</span><span class="stat-num" id="ls-online-signed-in">0</span><span class="stat-lbl">Signed In</span></div>
          <div class="admin-stat-card"><span class="stat-icon">◌</span><span class="stat-num" id="ls-online-guests">0</span><span class="stat-lbl">Guests Browsing</span></div>
        </div>

        <h4 style="font-family:var(--mono);font-size:11px;letter-spacing:0.1em;text-transform:uppercase;color:var(--accent);margin-bottom:12px;">Growth &amp; Activity</h4>
        <div class="admin-stats-strip" style="grid-template-columns:repeat(4,1fr);margin-bottom:8px;">
          <div class="admin-stat-card"><span class="stat-icon">◍</span><span class="stat-num" id="ls-total-accounts">0</span><span class="stat-lbl">Total Accounts</span></div>
          <div class="admin-stat-card"><span class="stat-icon">＋</span><span class="stat-num" id="ls-new-today">0</span><span class="stat-lbl">New Today</span></div>
          <div class="admin-stat-card"><span class="stat-icon">✉</span><span class="stat-num" id="ls-total-messages">0</span><span class="stat-lbl">Chat Messages</span></div>
          <div class="admin-stat-card"><span class="stat-icon">⚠</span><span class="stat-num" id="ls-bot-signups">—</span><span class="stat-lbl">Possible Bot Signups</span></div>
        </div>
        <p style="font-family:var(--mono);font-size:9.5px;color:var(--muted);margin-bottom:28px;line-height:1.6;">"Possible Bot Signups" flags accounts created in rapid bursts — 3 or more signups within 10 seconds of each other. It's a heuristic based on timing patterns, not a certainty a real script wrote them. Always check the Users tab before deleting anything it flags.</p>

        <div class="settings-divider"></div>

        <h4 style="font-family:var(--mono);font-size:11px;letter-spacing:0.1em;text-transform:uppercase;color:var(--accent);margin:20px 0 12px;">Who's Online</h4>
        <div class="admin-songs-list" id="ls-online-list">
          <p style="font-family:var(--mono);font-size:11px;color:var(--muted);">No live presence data yet.</p>
        </div>
      </div>

      <div id="admin-tab-database" style="display:none;">
        <h3>Database Connection</h3>
        <p style="font-family:var(--mono);font-size:11px;color:var(--muted);margin-bottom:20px;line-height:1.7;">
          By default this site stores everything in your browser only — songs, moods, chat messages, ratings. Nobody else sees your changes. Connect a free Supabase project to make all of that shared and permanent across every visitor.
        </p>

        <div class="admin-card" id="db-status-card" style="margin-bottom:24px;">
          <div class="admin-row">
            <div>
              <div style="font-family:var(--mono);font-size:12px;font-weight:600;" id="db-status-label">⚪ Not connected — running in local mode</div>
              <div style="font-family:var(--mono);font-size:10px;color:var(--muted);margin-top:4px;" id="db-status-sub">Songs, moods, and chat are saved only on this device.</div>
            </div>
          </div>
        </div>

        <div id="db-connect-form">
          <div class="admin-form" style="grid-template-columns: 1fr;">
            <div class="form-group full">
              <label>Supabase Project URL</label>
              <input class="form-input" type="text" id="db-url" placeholder="https://xxxxxxxxxxxx.supabase.co">
            </div>
            <div class="form-group full">
              <label>Supabase Anon (Public) Key</label>
              <input class="form-input" type="text" id="db-key" placeholder="eyJhbGciOi...">
            </div>
          </div>
          <div style="display:flex;gap:10px;margin-top:8px;flex-wrap:wrap;">
            <button class="form-btn" style="max-width:200px;" onclick="connectSupabase()">Connect</button>
            <button class="form-btn secondary" style="max-width:160px;" onclick="testSupabaseConnection()">Test Connection</button>
          </div>
          <p class="auth-error" id="db-error" style="display:none;"></p>
        </div>

        <div id="db-connected-actions" style="display:none;margin-top:8px;">
          <div style="display:flex;gap:10px;flex-wrap:wrap;align-items:center;">
            <button class="form-btn secondary" style="max-width:160px;" onclick="syncNowToSupabase()">Sync Now</button>
            <button class="form-btn danger" style="max-width:200px;" onclick="disconnectSupabase()">Disconnect</button>
          </div>
          <p style="font-family:var(--mono);font-size:10px;color:var(--muted);margin-top:8px;" id="db-last-sync"></p>
        </div>

        <div class="settings-divider"></div>

        <h4 style="font-family:var(--mono);font-size:11px;letter-spacing:0.1em;text-transform:uppercase;color:var(--accent);margin-bottom:12px;">Setup Guide</h4>
        <div style="font-family:var(--sans);font-size:13px;color:var(--dim);line-height:1.8;">
          <p style="margin-bottom:10px;"><strong style="color:var(--text);">1.</strong> Go to <span style="color:var(--accent);">supabase.com</span> → create a free account → "New Project"</p>
          <p style="margin-bottom:10px;"><strong style="color:var(--text);">2.</strong> Once created, go to <strong style="color:var(--text);">Project Settings → API</strong></p>
          <p style="margin-bottom:10px;"><strong style="color:var(--text);">3.</strong> Copy the <strong style="color:var(--text);">Project URL</strong> and the <strong style="color:var(--text);">anon public</strong> key into the fields above</p>
          <p style="margin-bottom:10px;"><strong style="color:var(--text);">4.</strong> In Supabase: <strong style="color:var(--text);">Authentication → Sign In / Providers → Anonymous</strong> → toggle it on. This is what lets each visitor's browser get a real, invisible identity the database can check writes against — no email or password involved, and visitors never see it.</p>
          <p style="margin-bottom:10px;"><strong style="color:var(--text);">5.</strong> Run the setup SQL (below) once in your Supabase project's SQL Editor to create the required tables</p>
          <p style="margin-bottom:10px;"><strong style="color:var(--text);">6.</strong> Click Connect — your site will now sync data for every visitor. You'll be asked for your admin password once more; this sets up a real, authenticated Supabase account behind your admin login, which is what's actually allowed to add/edit/delete songs, moods, genres, and admin settings in the database (everyone else gets read-only access to those). If that step doesn't complete right away — e.g. your Supabase project requires email confirmation — finish it via the confirmation email or in Supabase → Authentication → Users, then click "Sync Now" above.</p>
          <p><strong style="color:var(--text);">7.</strong> Chat messages, DMs, friend requests, and user profiles are now tied to each visitor's real (if anonymous) session — nobody holding only your public anon key can write as someone else, or read another person's DMs or friend requests, from outside the app.</p>
          <p><strong style="color:var(--text);">8.</strong> The new <strong style="color:var(--text);">Live Stats</strong> tab (in the sidebar) shows who's on the site right now, plus account/message growth — it uses Supabase Realtime, which is on by default for new projects, so there's nothing extra to set up.</p>
        </div>

        <button class="form-btn secondary" style="max-width:240px;margin-top:16px;" onclick="copySetupSQL()">Copy Setup SQL</button>
        <p style="font-family:var(--mono);font-size:10px;color:var(--muted);margin-top:8px;" id="sql-copy-confirm"></p>

        <div class="settings-divider"></div>

        <h4 style="font-family:var(--mono);font-size:11px;letter-spacing:0.1em;text-transform:uppercase;color:var(--accent);margin-bottom:12px;">Real Google Sign-In Setup (optional)</h4>
        <p style="font-family:var(--mono);font-size:11px;color:var(--muted);margin-bottom:16px;line-height:1.7;">
          The "Continue/Sign in with Google" buttons work as a simple alias picker until you do this setup — after that, they use real Google accounts. This needs Supabase connected above <strong style="color:var(--text);">and</strong> the site hosted at a real https:// address (Google won't redirect back to a local file).
        </p>
        <div style="font-family:var(--sans);font-size:13px;color:var(--dim);line-height:1.8;">
          <p style="margin-bottom:10px;"><strong style="color:var(--text);">1.</strong> Host this file somewhere with a real URL — e.g. drag it into <span style="color:var(--accent);">netlify.com/drop</span>, or use GitHub Pages / Vercel.</p>
          <p style="margin-bottom:10px;"><strong style="color:var(--text);">2.</strong> In <span style="color:var(--accent);">console.cloud.google.com</span>, create a project → <strong style="color:var(--text);">APIs & Services → OAuth consent screen</strong> (External, add your app name + support email).</p>
          <p style="margin-bottom:10px;"><strong style="color:var(--text);">3.</strong> Go to <strong style="color:var(--text);">Credentials → Create Credentials → OAuth Client ID</strong>, type "Web application".</p>
          <p style="margin-bottom:10px;"><strong style="color:var(--text);">4.</strong> Under Authorized redirect URIs, add: <code style="color:var(--accent2);">https://YOUR-PROJECT-REF.supabase.co/auth/v1/callback</code> (find YOUR-PROJECT-REF in your Supabase project URL above).</p>
          <p style="margin-bottom:10px;"><strong style="color:var(--text);">5.</strong> Copy the generated Client ID + Client Secret.</p>
          <p style="margin-bottom:10px;"><strong style="color:var(--text);">6.</strong> In your Supabase dashboard: <strong style="color:var(--text);">Authentication → Providers → Google</strong> → enable it → paste the Client ID + Secret → Save.</p>
          <p style="margin-bottom:10px;"><strong style="color:var(--text);">7.</strong> Still in Supabase: <strong style="color:var(--text);">Authentication → URL Configuration</strong> → set Site URL to your hosted URL from step 1, and add it under Redirect URLs too.</p>
          <p><strong style="color:var(--text);">8.</strong> Reload the live site and try "Continue with Google" — it should now show the real Google account picker. For admin, make sure the Google account you'll sign in with matches the Admin Email set above in Site Settings.</p>
        </div>
      </div>

    </div>
  </div>
</section>
</div>

<!-- FOOTER -->
<footer>
  <div class="footer-logo">AfterLight<span style="color:var(--accent)">:</span><span style="color:var(--accent2)">404</span>Archive</div>
  <button class="donate-btn open-donate-btn footer-donate-btn">♡ <span class="donate-text">Donate</span></button>
  <div class="footer-copy">
    All song credits belong to their respective artists &amp; labels.<br>
    This site is non-commercial. For love of music only. © 2026 JK.
  </div>
</footer>

<!-- SONG DETAIL MODAL -->
<div class="modal-overlay" id="modal" role="dialog" aria-modal="true">
  <div class="modal">
    <div class="modal-header">
      <div class="modal-eyebrow">
        <span id="m-number"></span>
        <span id="m-year"></span>
        <span id="m-mood-tag" class="song-mood-tag"></span>
      </div>
      <div class="modal-title" id="m-title"></div>
      <div class="modal-artist" id="m-artist"></div>
      <div id="m-uploader-wrap"></div>
      <button class="modal-share-btn-top" onclick="shareCurrentModalSong()" title="Share to a friend">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.6" y1="10.6" x2="15.4" y2="6.4"></line><line x1="8.6" y1="13.4" x2="15.4" y2="17.6"></line></svg>
        Share
      </button>
      <button class="close-btn" id="close-modal">✕</button>
    </div>
    <div class="modal-body">
      <div class="modal-section">
        <div class="modal-section-label">About the song</div>
        <p class="modal-desc" id="m-about"></p>
      </div>
      <div class="modal-section">
        <div class="modal-section-label">What it really means</div>
        <p class="modal-meaning" id="m-meaning"></p>
      </div>
      <div class="modal-section">
        <div class="modal-section-label">Key lyrics</div>
        <div class="lyric-block" id="m-lyrics"></div>
        <p class="copyright-notice" id="m-credit"></p>
      </div>
      <div class="modal-section" id="m-funfact-section" style="display:none;">
        <div class="modal-section-label">Fun fact</div>
        <p class="modal-desc" id="m-funfact"></p>
      </div>
      <div class="modal-action-row">
        <a href="#" class="listen-link" id="m-listen" target="_blank" rel="noopener">▶ Listen on Spotify</a>
      </div>

      <!-- COMMENTS -->
      <div class="comments-section">
        <div class="comments-header">Comments</div>
        <div class="comment-list" id="comment-list"></div>
        <div id="comment-form-wrap">
          <div class="comment-login-prompt" id="comment-login-prompt">
            <a onclick="showLogin()">Log in</a> or <a onclick="showSignup()">sign up</a> to share your thoughts.
          </div>
          <div class="comment-form" id="comment-form" style="display:none;">
            <textarea class="comment-textarea" id="comment-text" placeholder="What does this song mean to you?"></textarea>
            <button class="comment-submit" onclick="postComment()">Post Comment</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<script src="app.js"></script>
<script src="config.js"></script>
<script src="supabase.js"></script>
<script src="songs.js"></script>
<script src="auth.js"></script>
<script src="chat.js"></script>
<script src="profile.js"></script>
<script src="admin.js"></script>
<script>
//  INIT
// ═══════════════════════════════════════════════════════════════

loadData();
migrateAdminSecrets();
initSupabaseClient();
initLivePresence();
handleGoogleAuthCallback();
renderMoodBar();
renderSongGrid();
updateAuthUI();
updateCommentForm();
updateSubmitForm();
applySiteSettings();
initDeviceMode();
setBottomNavActive('home');
applyChatEnabledState();
updateSocialBadge();
refreshModerationEnabledFromDb();
refreshTurnstileEnabledFromDb();
refreshEmailjsConfigFromDb();
if (currentUser) {
  pushUserProfile();
  pullFriendRequests().then(updateSocialBadge);
  const savedToken = localStorage.getItem('al-session-token');
  const savedUser = localStorage.getItem('al-session-user');
  if (savedToken && savedUser === currentUser.name && isDbConnected()) {
    ensureAnonSession().then(() => subscribeAliasSession(currentUser.name, savedToken));
  }
}

// Init vinyl label and waveform paused state
const vinylEl = document.getElementById('hero-vinyl');
if (vinylEl) {
  vinylEl.innerHTML = `
    <div class="vinyl-label">
      <div class="vinyl-label-text">After<br>Light</div>
      <div class="vinyl-hole"></div>
    </div>`;
}
document.querySelectorAll('.waveform-deco span').forEach(s => {
  s.style.animationPlayState = 'paused';
  s.style.height = '4px';
});
updateVinylLabel();

if (isDbConnected()) {
  pullSharedDataFromSupabase().then(() => {
    renderMoodBar();
    renderSongGrid();
  });
}

// ── ON-SCREEN KEYBOARD HANDLING (chat/DM/topic-chat input bars) ──
// Mobile keyboards shrink/pan the *visual* viewport, not the layout viewport
// our position:fixed chat pages are sized against — that mismatch is what was
// causing the empty gap below the input bar and the need to manually scroll
// to reach it. window.visualViewport reports the actual visible area, so we
// track it live and let the CSS above pin the chat page to it directly.
//
// The open/close toggle itself is driven by focus/blur on the chat inputs
// rather than a height-difference heuristic — some browsers resize
// window.innerHeight right along with the visual viewport when the keyboard
// opens, which made a height-diff threshold unreliable (it just never
// crossed the threshold, so the old gap-causing CSS stayed active).
(function () {
  const vv = window.visualViewport;
  const root = document.documentElement;

  function syncViewportVars() {
    if (!vv) return;
    root.style.setProperty('--vvh', vv.height + 'px');
    root.style.setProperty('--vv-top', vv.offsetTop + 'px');
  }

  function scrollActiveIntoView() {
    const active = document.activeElement;
    if (active && active.classList && active.classList.contains('chat-input')) {
      requestAnimationFrame(() => { try { active.scrollIntoView({ block: 'end' }); } catch (e) {} });
    }
  }

  if (vv) {
    vv.addEventListener('resize', () => { syncViewportVars(); scrollActiveIntoView(); });
    vv.addEventListener('scroll', syncViewportVars);
    syncViewportVars();
  }

  // Delegated so it also covers any chat-input rendered after page load.
  document.addEventListener('focusin', e => {
    if (!e.target.classList || !e.target.classList.contains('chat-input')) return;
    document.body.classList.add('kb-open');
    syncViewportVars();
    scrollActiveIntoView();
  });
  document.addEventListener('focusout', e => {
    if (!e.target.classList || !e.target.classList.contains('chat-input')) return;
    // Give focus a moment to land on whatever's next (e.g. tapping the send
    // button) before deciding the keyboard actually closed.
    setTimeout(() => {
      const stillTyping = document.activeElement && document.activeElement.classList &&
        document.activeElement.classList.contains('chat-input');
      if (!stillTyping) { document.body.classList.remove('kb-open'); syncViewportVars(); }
    }, 120);
  });
})();

// Close auth on Escape
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') { closeAuth(); closeMsgActions(); }
});
document.addEventListener('scroll', () => closeMsgActions(), true);

// ── IMMERSIVE / FULLSCREEN MODE ──
// Mobile browsers won't hide their address bar for a plain page load — the
// Fullscreen API requires an actual user gesture. So on the very first tap
// or touch anywhere on the page, we ask the browser to go fullscreen, which
// hides the URL bar until the person explicitly backs/swipes out. This is a
// best-effort enhancement: some browsers (notably iOS Safari) don't support
// requesting fullscreen on arbitrary elements, so it silently no-ops there.
(function () {
  let triedFullscreen = false;
  function goFullscreen() {
    if (triedFullscreen) return;
    triedFullscreen = true;
    const el = document.documentElement;
    const request = el.requestFullscreen || el.webkitRequestFullscreen || el.mozRequestFullScreen || el.msRequestFullscreen;
    if (request) {
      try { request.call(el).catch(() => { triedFullscreen = false; }); }
      catch (e) { triedFullscreen = false; }
    }
  }
  document.addEventListener('touchend', goFullscreen, { once: true, passive: true });
  document.addEventListener('click', goFullscreen, { once: true });
})();

// ── ENTER KEY = SUBMIT ──
// Lets people hit Enter in a text/password field (login, signup, edit
// profile, admin forms, room creation, etc.) instead of having to reach
// for the mouse to click Log In / Save / Create. We climb up from the
// focused field to the smallest surrounding block that contains a
// primary action button, then click that button. Textareas are left
// alone so Enter still inserts a newline there, and any field that
// already has its own onkeydown handler (e.g. the verify-email code
// box) is respected — this only fires if that handler didn't already
// handle + preventDefault the keypress.
(function () {
  const PRIMARY_BTN_SELECTOR = '.form-btn:not(.google-btn):not(:disabled), .ig-header-action:not(:disabled)';
  const SUBMIT_TAG_TYPES = ['text', 'password', 'email', 'search', 'tel', 'number', 'url', ''];

  function findPrimaryButton(fromEl) {
    let node = fromEl.parentElement;
    let hops = 0;
    while (node && node !== document.body && hops < 8) {
      const btn = node.querySelector(PRIMARY_BTN_SELECTOR);
      if (btn && isVisible(btn)) return btn;
      node = node.parentElement;
      hops++;
    }
    return null;
  }

  function isVisible(el) {
    return !!(el.offsetWidth || el.offsetHeight || el.getClientRects().length);
  }

  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Enter' || e.defaultPrevented) return;
    const el = e.target;
    if (!el || el.tagName !== 'INPUT') return;
    if (!SUBMIT_TAG_TYPES.includes((el.type || '').toLowerCase())) return;
    if (!isVisible(el)) return;
    const btn = findPrimaryButton(el);
    if (btn) {
      e.preventDefault();
      btn.click();
    }
  });
})();

// ── DEVTOOLS DETERRENTS ──
// Note: none of this can actually stop someone determined to open dev
// tools (browsers always allow it from their own menu, and JS can't see
// or block that). This is a light deterrent against casual right-click
// → Inspect / F12 / Ctrl+U only.
(function () {
  // Disable right-click context menu
  document.addEventListener('contextmenu', function (e) { e.preventDefault(); });

  // Block common devtools / view-source keyboard shortcuts
  document.addEventListener('keydown', function (e) {
    const k = e.key;
    const mod = e.ctrlKey || e.metaKey;
    if (k === 'F12') { e.preventDefault(); return; }
    if (mod && e.shiftKey && ['I', 'i', 'J', 'j', 'C', 'c'].includes(k)) { e.preventDefault(); return; }
    if (mod && (k === 'U' || k === 'u')) { e.preventDefault(); return; }
  });

  // Heuristic: an undocked/docked DevTools panel changes the gap between
  // outer and inner window dimensions. Not foolproof, but catches the
  // common case and shows a warning overlay while it looks open.
  //
  // Mobile browsers don't have a desktop-style DevTools split-pane at all —
  // this check was firing there anyway because the address bar showing/
  // hiding on scroll changes that same outer/inner gap, which falsely
  // triggered the overlay and blocked the whole site on phones. Skipped
  // entirely on touch/narrow-viewport devices, where it can't be accurate.
  const isMobileLike = ('ontouchstart' in window) || navigator.maxTouchPoints > 0 || window.matchMedia('(pointer: coarse)').matches;
  if (isMobileLike) return;

  let warningShown = false;
  function showWarning() {
    if (warningShown) return;
    warningShown = true;
    if (document.getElementById('devtools-block-overlay')) return;
    const overlay = document.createElement('div');
    overlay.id = 'devtools-block-overlay';
    overlay.innerHTML = '<div class="devtools-block-msg">Developer tools are disabled on this site.<br><span>Please close them to continue.</span></div>';
    document.body.appendChild(overlay);
  }
  function hideWarning() {
    warningShown = false;
    const el = document.getElementById('devtools-block-overlay');
    if (el) el.remove();
  }
  const THRESHOLD = 160;
  setInterval(function () {
    const widthDiff = window.outerWidth - window.innerWidth;
    const heightDiff = window.outerHeight - window.innerHeight;
    if (widthDiff > THRESHOLD || heightDiff > THRESHOLD) showWarning();
    else hideWarning();
  }, 800);
})();
</script>
</body>
</html>

```

---

## `styles.css`

```css
  *, *::before, *::after {
    box-sizing: border-box; margin: 0; padding: 0;
    -webkit-tap-highlight-color: transparent;
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }

  /* Re-enable selection only where typing happens */
  input, textarea, [contenteditable] {
    -webkit-user-select: text;
    -moz-user-select: text;
    -ms-user-select: text;
    user-select: text;
    -webkit-touch-callout: default;
  }

  html {
    -webkit-text-size-adjust: 100%;
    text-size-adjust: 100%;
    text-rendering: optimizeLegibility;
    overflow-x: hidden;
    max-width: 100%;
  }

  body {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    font-synthesis: none;
    max-width: 100%;
  }

  img, svg, video { max-width: 100%; height: auto; }

  button, a, input, textarea, select, [onclick] {
    -webkit-tap-highlight-color: transparent !important;
    outline: none;
  }
  button:focus, a:focus { outline: none; }
  button:focus-visible, a:focus-visible, input:focus-visible, textarea:focus-visible {
    outline: 2px solid var(--accent, #C8A96E);
    outline-offset: 2px;
  }

  :root {
    --bg:       #08070D;
    --surface:  #0F0D18;
    --card:     #141221;
    --border:   #221F33;
    --border2:  #342F4A;
    --text:     #E8E4F8;
    --muted:    #5E5878;
    --dim:      #9890B8;
    --accent:   #C8A96E;
    --accent2:  #7B6FA0;
    --accent-glow: rgba(200,169,110,0.18);
    --accent2-glow: rgba(123,111,160,0.18);
    --red:      #B85C5C;
    --green:    #4caf8a;
    --header-bg: rgba(8,7,13,0.90);
    --mono:     'IBM Plex Mono', monospace;
    --serif:    'Playfair Display', Georgia, serif;
    --sans:     'Inter', sans-serif;
    --shadow-card: 0 4px 24px rgba(0,0,0,0.45), 0 1px 4px rgba(0,0,0,0.3);
    --shadow-glow: 0 0 40px rgba(200,169,110,0.08);
    --radius: 4px;
    --card-hover: #1a1730;
    --modal-grad-start: #131020;
  }

  #devtools-block-overlay {
    position: fixed;
    inset: 0;
    z-index: 999999;
    background: var(--bg);
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 24px;
  }
  #devtools-block-overlay .devtools-block-msg {
    font-family: var(--sans);
    font-size: 17px;
    color: var(--text);
    line-height: 1.7;
  }
  #devtools-block-overlay .devtools-block-msg span {
    display: block;
    margin-top: 6px;
    font-family: var(--mono);
    font-size: 12px;
    color: var(--muted);
    letter-spacing: 0.03em;
  }

  [data-theme="light"] {
    --bg:       #EAE6DC;
    --surface:  #E1DCCE;
    --card:     #D8D2C0;
    --border:   #C6BFA9;
    --border2:  #AFA68C;
    --text:     #2B2720;
    --muted:    #847C68;
    --dim:      #4D473B;
    --accent:   #A87C3F;
    --accent2:  #6B5B8A;
    --red:      #9C4A45;
    --green:    #3C7A5C;
    --header-bg: rgba(234,230,220,0.88);
    --card-hover: #CDC5AC;
    --modal-grad-start: #F1ECDF;
  }

  html { scroll-behavior: smooth; }

  /* ── GLOBAL TAP / PRESS FEEDBACK ──
     Applies a quick, springy scale-down to essentially every tappable
     element site-wide, so buttons, cards, nav items, pills, icons, list
     rows, etc. all feel responsive to touch/click without needing this
     added one-by-one. Anything that opts out can add .no-tap-fx. */
  button, a, [onclick], .song-card, .mood-btn, .bottom-nav-item,
  .admin-nav-item, .settings-tab-btn, .room-item, .avatar-option,
  .avatar-none-option, .reaction-pill, .theme-mode-btn, .chat-msg,
  .device-toggle-panel, .clickable {
    transition: transform 0.16s cubic-bezier(0.34,1.56,0.64,1),
                background 0.18s ease, color 0.18s ease,
                border-color 0.18s ease, box-shadow 0.18s ease,
                opacity 0.18s ease;
    will-change: transform;
  }
  button:not(:disabled):active,
  a:active,
  [onclick]:not(.no-tap-fx):active,
  .song-card:active,
  .mood-btn:active,
  .bottom-nav-item:active,
  .admin-nav-item:active,
  .settings-tab-btn:active,
  .room-item:active,
  .avatar-option:active,
  .avatar-none-option:active,
  .reaction-pill:active,
  .theme-mode-btn:active,
  .chat-msg:active,
  .clickable:active {
    transform: scale(0.96);
  }
  /* Larger surfaces (cards) want a subtler press so they don't feel jumpy */
  .song-card:active { transform: scale(0.985); }
  .modal:active, .auth-modal:active, .donate-modal:active { transform: none; }
  /* Icon-only round buttons (close buttons etc.) get a touch more squash */
  .close-btn:active, .auth-close:active, .donate-close:active {
    transform: scale(0.88) rotate(-4deg);
  }
  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after { transition-duration: 0.001ms !important; animation-duration: 0.001ms !important; }
  }

  body { background: var(--bg); color: var(--text); font-family: var(--sans); font-weight: 300; line-height: 1.7; overflow-x: hidden; }
  body::before { content: ''; position: fixed; inset: 0; background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E"); opacity: 0.032; pointer-events: none; z-index: 9999; }
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: var(--bg); }
  ::-webkit-scrollbar-thumb { background: var(--border2); border-radius: 2px; }

  /* ── GLOBAL DEPTH & GLOW ── */
  body::after {
    content: '';
    position: fixed;
    top: -40%;
    left: 50%;
    transform: translateX(-50%);
    width: 80vw;
    height: 60vh;
    background: radial-gradient(ellipse at 50% 0%, rgba(123,111,160,0.07) 0%, transparent 70%);
    pointer-events: none;
    z-index: 0;
  }

  /* ── VINYL PLAYER WIDGET ── */
  .vinyl-widget {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    margin: 0 auto;
  }
  .vinyl-outer {
    width: 220px;
    height: 220px;
    border-radius: 50%;
    background:
      repeating-conic-gradient(
        from 0deg,
        #1a1628 0deg 2deg,
        #0f0d18 2deg 4deg
      );
    box-shadow:
      0 0 0 2px #2a2638,
      0 0 0 4px #0f0d18,
      0 8px 48px rgba(0,0,0,0.7),
      0 0 60px rgba(123,111,160,0.15);
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    animation: vinylSpin 8s linear infinite;
    animation-play-state: paused;
  }
  .vinyl-outer.spinning { animation-play-state: running; }
  .vinyl-label {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    background: radial-gradient(circle at 40% 35%, #2a2240, #1a1528);
    border: 1px solid #342F4A;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    box-shadow: inset 0 2px 8px rgba(0,0,0,0.5), 0 0 20px rgba(200,169,110,0.12);
    position: relative;
    z-index: 2;
  }
  .vinyl-label-text {
    font-family: var(--serif);
    font-size: 9px;
    font-weight: 700;
    color: var(--accent);
    letter-spacing: 0.08em;
    text-align: center;
    line-height: 1.4;
  }
  .vinyl-hole {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: #08070D;
    border: 1px solid #342F4A;
    margin-top: 4px;
  }
  .vinyl-arm {
    position: absolute;
    top: 8px;
    right: -12px;
    width: 90px;
    height: 3px;
    background: linear-gradient(90deg, #C8A96E, #8a6d42);
    border-radius: 2px;
    transform-origin: right center;
    transform: rotate(-20deg);
    box-shadow: 0 2px 8px rgba(200,169,110,0.3);
    transition: transform 0.8s ease;
    z-index: 3;
  }
  .vinyl-arm::before {
    content: '';
    position: absolute;
    right: -8px;
    top: -8px;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: radial-gradient(circle at 40% 35%, #C8A96E, #7a5d2e);
    box-shadow: 0 2px 12px rgba(200,169,110,0.4);
  }
  .vinyl-arm::after {
    content: '';
    position: absolute;
    left: -4px;
    top: -2px;
    width: 8px;
    height: 8px;
    border-radius: 1px;
    background: #C8A96E;
    transform: rotate(20deg);
    box-shadow: 0 1px 6px rgba(200,169,110,0.5);
  }
  .vinyl-outer.spinning ~ .vinyl-arm { transform: rotate(-4deg); }
  .vinyl-controls {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-top: 20px;
  }
  .vinyl-btn {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: var(--card);
    border: 1px solid var(--border2);
    color: var(--dim);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 13px;
    transition: all 0.2s;
    box-shadow: 0 2px 8px rgba(0,0,0,0.3);
  }
  .vinyl-btn:hover { border-color: var(--accent); color: var(--accent); box-shadow: 0 0 12px rgba(200,169,110,0.2); }
  .vinyl-play-btn {
    width: 48px;
    height: 48px;
    font-size: 16px;
    background: linear-gradient(135deg, var(--accent), #8a6d42);
    border-color: var(--accent);
    color: var(--bg);
    box-shadow: 0 4px 20px rgba(200,169,110,0.35);
  }
  .vinyl-play-btn:hover { background: linear-gradient(135deg, #d4ba80, var(--accent)); transform: scale(1.08); }
  .vinyl-now-playing {
    font-family: var(--mono);
    font-size: 10px;
    color: var(--muted);
    letter-spacing: 0.12em;
    text-transform: uppercase;
    margin-top: 12px;
    text-align: center;
    min-height: 16px;
    transition: all 0.3s;
  }
  .vinyl-now-playing span {
    color: var(--accent);
  }
  @keyframes vinylSpin {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
  }

  /* ── FLOATING MUSIC NOTES DECORATION ── */
  .music-note-float {
    position: absolute;
    font-size: 18px;
    opacity: 0.06;
    pointer-events: none;
    user-select: none;
    animation: floatNote 12s ease-in-out infinite;
    color: var(--accent2);
  }
  @keyframes floatNote {
    0%, 100% { transform: translateY(0) rotate(-10deg); opacity: 0.06; }
    50% { transform: translateY(-20px) rotate(10deg); opacity: 0.1; }
  }

  /* ── 3D CARD LIFT ── */
  .song-card {
    transition: background 0.22s, transform 0.22s, box-shadow 0.22s !important;
  }
  .song-card:hover {
    transform: translateY(-3px) !important;
    box-shadow: 0 12px 40px rgba(0,0,0,0.5), 0 0 0 1px var(--border2), var(--shadow-glow) !important;
  }

  /* ── WAVEFORM DECORATION ── */
  .waveform-deco {
    display: flex;
    align-items: center;
    gap: 3px;
    height: 24px;
    opacity: 0.35;
  }
  .waveform-deco span {
    display: block;
    width: 3px;
    background: var(--accent);
    border-radius: 2px;
    animation: waveAnim 1.2s ease-in-out infinite;
  }
  @keyframes waveAnim {
    0%, 100% { height: 4px; }
    50% { height: 20px; }
  }
  .waveform-deco span:nth-child(1) { animation-delay: 0s; height: 8px; }
  .waveform-deco span:nth-child(2) { animation-delay: 0.1s; height: 14px; }
  .waveform-deco span:nth-child(3) { animation-delay: 0.2s; height: 20px; }
  .waveform-deco span:nth-child(4) { animation-delay: 0.1s; height: 14px; }
  .waveform-deco span:nth-child(5) { animation-delay: 0s; height: 8px; }

  /* ── HERO VISUAL TRACK ── */
  .hero-track-bar {
    position: absolute;
    bottom: 80px;
    left: 48px;
    right: 48px;
    height: 1px;
    background: linear-gradient(90deg, transparent, var(--border2), transparent);
    pointer-events: none;
  }
  .hero-track-needle {
    position: absolute;
    left: 28%;
    top: -4px;
    width: 1px;
    height: 8px;
    background: var(--accent);
    box-shadow: 0 0 6px var(--accent);
  }
  .hero-track-progress {
    position: absolute;
    left: 0;
    top: 0;
    width: 28%;
    height: 100%;
    background: linear-gradient(90deg, transparent, var(--accent));
    opacity: 0.6;
  }

  /* ── GLASSMORPHISM CARDS ── */
  .glass-card {
    background: rgba(20,18,33,0.7);
    backdrop-filter: blur(12px);
    border: 1px solid rgba(52,47,74,0.8);
    box-shadow: 0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.04);
  }

  /* ── HERO VINYL SECTION ── */
  .hero-inner {
    display: grid;
    grid-template-columns: 1fr auto;
    gap: 48px;
    align-items: center;
    position: relative;
    z-index: 1;
  }
  .hero-content { flex: 1; }
  .hero-vinyl-side {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0;
  }

  /* ── HEADER ── */
  header { position: sticky; top: 0; z-index: 100; border-bottom: 1px solid var(--border); background: var(--header-bg); backdrop-filter: blur(20px) saturate(180%); -webkit-backdrop-filter: blur(20px) saturate(180%); padding: 0 20px; height: 60px; display: grid; grid-template-columns: 1fr auto 1fr; align-items: center; column-gap: 12px; box-shadow: 0 1px 0 rgba(255,255,255,0.03), 0 4px 24px rgba(0,0,0,0.4); }
  .header-left { display: flex; align-items: center; gap: 18px; justify-self: start; min-width: 0; }
  .header-center { justify-self: center; }
  .header-right { display: flex; align-items: center; gap: 14px; justify-self: end; }
  .logo { font-family: var(--mono); font-size: 14px; font-weight: 500; letter-spacing: 0.02em; color: var(--text); text-decoration: none; display: flex; align-items: center; gap: 6px; white-space: nowrap; flex-shrink: 0; }
  .logo .colon { color: var(--accent); }
  .logo .four { color: var(--accent2); }

  nav { display: flex; gap: 28px; align-items: center; }
  nav a { font-family: var(--mono); font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase; color: var(--muted); text-decoration: none; transition: color 0.2s; }
  nav a:hover { color: var(--accent); }
  .subnav-row { display: flex; justify-content: center; align-items: center; height: 44px; padding: 0 20px; border-bottom: 1px solid var(--border); background: var(--header-bg); position: sticky; top: 60px; z-index: 99; }

  /* ── AUTH BUTTONS IN HEADER ── */
  .auth-bar { display: flex; align-items: center; gap: 12px; min-width: 0; }
  .auth-btn { font-family: var(--mono); font-size: 10px; letter-spacing: 0.1em; text-transform: uppercase; color: var(--text); background: transparent; border: 1px solid var(--border2); padding: 6px 14px; cursor: pointer; border-radius: 2px; transition: all 0.18s; text-decoration: none; }
  .auth-btn:hover { border-color: var(--accent); color: var(--accent); }
  .auth-btn.primary { background: var(--accent); color: var(--bg); border-color: var(--accent); }
  .auth-btn.primary:hover { background: transparent; color: var(--accent); }
  .user-badge { font-family: var(--mono); font-size: 11px; color: var(--text); display: flex; align-items: center; gap: 8px; background: var(--surface); border: 1px solid var(--border2); padding: 5px 12px 5px 5px; border-radius: 100px; transition: border-color 0.15s, background 0.15s; min-width: 0; }
  .user-badge:hover { border-color: var(--accent); background: var(--card); }
  .user-badge .anon-name { color: var(--text); font-weight: 500; letter-spacing: 0.01em; }
  .user-badge-pfp { width: 24px; height: 24px; border-radius: 50%; object-fit: cover; flex-shrink: 0; display: block; }
  .user-badge-pfp-fallback { display: flex; align-items: center; justify-content: center; background: var(--accent2); color: var(--text); font-size: 9px; font-weight: 700; }
  .logout-link { color: var(--red); cursor: pointer; font-size: 10px; text-decoration: underline; }

  /* ── THEME TOGGLE ── */
  .theme-toggle-wrap { display: flex; align-items: center; gap: 8px; }
  .theme-icon { font-size: 14px; color: var(--muted); user-select: none; line-height: 1; }
  .theme-switch { position: relative; width: 48px; height: 24px; flex-shrink: 0; }
  .theme-switch input { opacity: 0; width: 0; height: 0; }
  .theme-track { position: absolute; inset: 0; background: var(--border2); border-radius: 12px; cursor: pointer; transition: background 0.2s, border-color 0.2s; border: 1px solid var(--border2); }
  .theme-track::before { content: ''; position: absolute; width: 16px; height: 16px; left: 3px; top: 3px; background: var(--text); border-radius: 50%; box-shadow: 0 1px 3px rgba(0,0,0,0.35); transition: transform 0.25s cubic-bezier(0.34,1.56,0.64,1); }
  .theme-switch input:checked + .theme-track { background: var(--accent2); border-color: var(--accent2); }
  .theme-switch input:checked + .theme-track::before { transform: translateX(24px); }
  .settings-toggle-row:hover .theme-track { border-color: var(--accent); }
  .theme-mode-btn { font-family: var(--mono); font-size: 9px; letter-spacing: 0.12em; text-transform: uppercase; color: var(--muted); background: transparent; border: 1px solid var(--border); padding: 3px 7px; cursor: pointer; border-radius: 2px; transition: all 0.15s; white-space: nowrap; }
  .theme-mode-btn:hover, .theme-mode-btn.active-mode { border-color: var(--accent2); color: var(--accent2); }

  /* ── DONATE (footer + profile menu) ── */
  .donate-btn { font-family: var(--mono); font-size: 10px; letter-spacing: 0.1em; text-transform: uppercase; color: var(--accent); background: rgba(200,169,110,0.08); border: 1px solid var(--accent); padding: 6px 14px; cursor: pointer; border-radius: 2px; transition: all 0.18s; text-decoration: none; display: inline-flex; align-items: center; gap: 6px; white-space: nowrap; }
  .donate-btn:hover { background: rgba(200,169,110,0.18); }
  .footer-donate-btn { margin-top: 14px; }
  .donate-overlay { position: fixed; inset: 0; background: rgba(8,7,12,0.88); z-index: 2000; display: none; align-items: center; justify-content: center; padding: 24px; opacity: 0; pointer-events: none; transition: opacity 0.22s; backdrop-filter: blur(8px); }
  .donate-overlay.open { display: flex; opacity: 1; pointer-events: all; }
  .donate-modal { background: var(--surface); border: 1px solid var(--border2); max-width: 400px; width: 100%; padding: 40px 36px 36px; position: relative; transform: translateY(20px); transition: transform 0.25s; text-align: center; max-height: 88vh; overflow-y: auto; -webkit-overflow-scrolling: touch; }
  .donate-overlay.open .donate-modal { transform: translateY(0); }
  .donate-modal-title { font-family: var(--serif); font-size: 24px; font-weight: 700; margin-bottom: 8px; color: var(--text); }
  .donate-modal-sub { font-family: var(--mono); font-size: 11px; color: var(--muted); letter-spacing: 0.07em; line-height: 1.75; margin-bottom: 28px; }
  .paypal-input-wrap { margin-bottom: 20px; text-align: left; }
  .paypal-input-wrap label { font-family: var(--mono); font-size: 9px; letter-spacing: 0.18em; text-transform: uppercase; color: var(--muted); display: block; margin-bottom: 6px; }
  .paypal-input { width: 100%; background: var(--bg); border: 1px solid var(--border2); color: var(--text); font-family: var(--mono); font-size: 13px; padding: 10px 14px; outline: none; transition: border-color 0.15s; }
  .paypal-input:focus { border-color: var(--accent); }
  .paypal-go-btn { display: block; width: 100%; background: #003087; color: #fff; border: none; font-family: var(--mono); font-size: 12px; letter-spacing: 0.1em; text-transform: uppercase; padding: 13px 20px; cursor: pointer; transition: background 0.18s; margin-bottom: 12px; border-radius: 2px; }
  .paypal-go-btn:hover { background: #005cc5; }
  .paypal-note { font-family: var(--mono); font-size: 9px; color: var(--muted); letter-spacing: 0.06em; line-height: 1.6; }
  .paypal-saved { font-family: var(--mono); font-size: 10px; color: var(--green); margin-top: 6px; display: none; letter-spacing: 0.08em; }
  .donate-close { position: absolute; top: 14px; right: 16px; background: none; border: 1px solid var(--border); color: var(--muted); width: 28px; height: 28px; cursor: pointer; font-size: 13px; display: flex; align-items: center; justify-content: center; transition: all 0.15s; border-radius: 2px; }
  .donate-close:hover { border-color: var(--red); color: var(--red); }

  /* ── HERO ── */
  .hero { min-height: 92vh; display: flex; flex-direction: column; justify-content: center; padding: 80px 48px 80px; position: relative; border-bottom: 1px solid var(--border); overflow: hidden; background: radial-gradient(ellipse at 70% 50%, rgba(123,111,160,0.06) 0%, transparent 60%), radial-gradient(ellipse at 20% 80%, rgba(200,169,110,0.04) 0%, transparent 50%); }
  .hero-bg-text { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-family: var(--serif); font-size: clamp(100px, 18vw, 240px); font-weight: 900; color: transparent; -webkit-text-stroke: 1px rgba(123,111,160,0.08); white-space: nowrap; pointer-events: none; user-select: none; letter-spacing: -4px; }
  .hero-eyebrow { font-family: var(--mono); font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; color: var(--accent); margin-bottom: 24px; display: flex; align-items: center; gap: 12px; }
  .hero-eyebrow::before { content: ''; display: block; width: 32px; height: 1px; background: var(--accent); }
  h1 { font-family: var(--serif); font-size: clamp(36px, 6vw, 84px); font-weight: 900; line-height: 1.05; letter-spacing: -2px; max-width: 820px; position: relative; }
  h1 em { font-style: italic; color: var(--accent); }
  .hero-sub { margin-top: 28px; font-size: 15px; color: var(--dim); max-width: 520px; line-height: 1.75; position: relative; }
  .hero-meta { margin-top: 48px; display: flex; gap: 40px; position: relative; }
  .meta-item label { display: block; font-family: var(--mono); font-size: 10px; letter-spacing: 0.15em; text-transform: uppercase; color: var(--muted); margin-bottom: 4px; }
  .meta-item span { font-family: var(--mono); font-size: 22px; font-weight: 500; color: var(--text); }
  .scroll-hint { position: absolute; bottom: 32px; right: 48px; font-family: var(--mono); font-size: 10px; letter-spacing: 0.15em; text-transform: uppercase; color: var(--muted); display: flex; align-items: center; gap: 10px; writing-mode: vertical-rl; }
  .scroll-hint::after { content: ''; display: block; width: 1px; height: 48px; background: var(--border2); }

  /* ── MOOD FILTER ── */
  .mood-section { padding: 64px 48px 0; border-bottom: 1px solid var(--border); }
  .section-label { font-family: var(--mono); font-size: 10px; letter-spacing: 0.2em; text-transform: uppercase; color: var(--muted); margin-bottom: 24px; }
  .mood-bar { display: flex; gap: 10px; flex-wrap: wrap; padding-bottom: 32px; }
  .mood-btn { font-family: var(--mono); font-size: 11px; letter-spacing: 0.08em; padding: 8px 18px; border-radius: 100px; border: 1px solid var(--border2); background: transparent; color: var(--dim); cursor: pointer; transition: all 0.22s; display: flex; align-items: center; gap: 8px; }
  .mood-btn:hover, .mood-btn.active { border-color: var(--mood-c, var(--accent)); color: var(--mood-c, var(--accent)); background: color-mix(in oklab, var(--mood-c, var(--accent)) 10%, transparent); box-shadow: 0 0 16px color-mix(in oklab, var(--mood-c, var(--accent)) 20%, transparent); }
  .mood-btn .mood-dot { width: 6px; height: 6px; border-radius: 50%; background: currentColor; flex-shrink: 0; }

  /* ── ARCHIVE ── */
  .archive-section { padding: 48px 48px 80px; }
  .archive-header { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 40px; }
  h2 { font-family: var(--serif); font-size: clamp(24px, 3vw, 36px); font-weight: 700; letter-spacing: -0.5px; }
  .count-tag { font-family: var(--mono); font-size: 11px; color: var(--muted); letter-spacing: 0.1em; }
  .song-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: 1px; border: 1px solid var(--border); border-radius: var(--radius); overflow: hidden; box-shadow: var(--shadow-card); }

  /* ── SONG CARD ── */
  .song-card { background: var(--card); padding: 28px; cursor: pointer; position: relative; border-right: 1px solid var(--border); border-bottom: 1px solid var(--border); display: flex; flex-direction: column; gap: 16px; }
  .song-card::before { content: ''; position: absolute; inset: 0; background: linear-gradient(135deg, rgba(255,255,255,0.018) 0%, transparent 50%); pointer-events: none; }
  .song-card:hover { background: var(--card-hover); }
  .card-top { display: flex; justify-content: space-between; align-items: flex-start; gap: 12px; }
  .song-number { font-family: var(--mono); font-size: 10px; color: var(--muted); letter-spacing: 0.1em; flex-shrink: 0; margin-top: 4px; }
  .song-mood-tag { font-family: var(--mono); font-size: 9px; letter-spacing: 0.15em; text-transform: uppercase; padding: 3px 10px; border-radius: 1px; flex-shrink: 0; }
  .song-title { font-family: var(--serif); font-size: 20px; font-weight: 700; line-height: 1.2; color: var(--text); flex: 1; }
  .song-artist { font-family: var(--mono); font-size: 11px; color: var(--accent); letter-spacing: 0.05em; margin-top: 2px; }
  .song-year { font-family: var(--mono); font-size: 10px; color: var(--muted); }
  .song-desc { font-size: 13px; color: var(--dim); line-height: 1.65; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
  .card-footer { display: flex; justify-content: space-between; align-items: center; margin-top: auto; padding-top: 16px; border-top: 1px solid var(--border); }
  .genre-pills { display: flex; gap: 6px; flex-wrap: wrap; }
  .genre-pill { font-family: var(--mono); font-size: 9px; letter-spacing: 0.1em; text-transform: uppercase; color: var(--muted); border: 1px solid var(--border); padding: 2px 8px; border-radius: 1px; }
  .read-more { font-family: var(--mono); font-size: 10px; letter-spacing: 0.12em; text-transform: uppercase; color: var(--accent2); display: flex; align-items: center; gap: 6px; white-space: nowrap; }
  .read-more::after { content: '→'; }

  /* ── RATING SYSTEM (LOCKED AFTER VOTE) ── */
  .rating-wrap { display: flex; flex-direction: column; align-items: stretch; gap: 10px; padding-top: 14px; border-top: 1px solid var(--border); margin-top: 4px; }
  .rating-your-row { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
  .rating-label { font-family: var(--mono); font-size: 9px; letter-spacing: 0.12em; text-transform: uppercase; color: var(--muted); white-space: nowrap; }
  .rating-stars { display: flex; gap: 7px; align-items: center; }
  .rating-note { font-size: 21px; cursor: default; user-select: none; line-height: 1; color: var(--border2); position: relative; transition: color 0.15s, transform 0.15s; }
  .rating-note-icon { width: 19px; height: 19px; display: block; fill: currentColor; transition: fill 0.2s, filter 0.25s; }
  .rating-note.filled { color: var(--accent); }
  .rating-note.filled .rating-note-icon { fill: url(#noteGoldGrad); filter: drop-shadow(0 0 5px rgba(200,169,110,0.55)) drop-shadow(0 0 11px rgba(200,169,110,0.3)); }
  .rating-note.locked { cursor: default; }
  .rating-stars:not(.is-locked) .rating-note:hover { transform: scale(1.18) rotate(-4deg); }
  .rating-count { font-family: var(--mono); font-size: 10px; color: var(--muted); margin-left: 4px; letter-spacing: 0.05em; }
  .rating-locked-msg {
    font-family: var(--mono); font-size: 9px; letter-spacing: 0.06em; color: var(--green);
    background: color-mix(in oklab, var(--green) 14%, transparent);
    border: 1px solid color-mix(in oklab, var(--green) 35%, transparent);
    padding: 3px 9px; border-radius: 100px;
    opacity: 0; transform: scale(0.9); transition: opacity 0.3s, transform 0.3s;
    white-space: nowrap;
  }
  .rating-locked-msg.visible { opacity: 1; transform: scale(1); }

  /* Community average — separate from the visitor's own vote above, so it's
     obvious at a glance what YOU rated vs. what everyone rated it overall. */
  .rating-community { display: flex; align-items: center; gap: 10px; }
  .rating-avg-badge {
    display: flex; align-items: center; gap: 4px; flex-shrink: 0;
    font-family: var(--mono); font-size: 13px; font-weight: 700; color: var(--accent);
  }
  .rating-avg-badge .star { font-size: 12px; }
  .rating-bar-track { flex: 1; height: 5px; min-width: 32px; border-radius: 3px; background: var(--border2); overflow: hidden; }
  .rating-bar-fill { display: block; height: 100%; border-radius: 3px; background: linear-gradient(90deg, var(--accent2), var(--accent)); transition: width 0.5s cubic-bezier(0.22,1,0.36,1); }
  .rating-count-text { font-family: var(--mono); font-size: 9.5px; color: var(--muted); white-space: nowrap; flex-shrink: 0; }
  .rating-empty { font-family: var(--mono); font-size: 9.5px; color: var(--muted); font-style: italic; letter-spacing: 0.02em; }

  /* ── MODAL ── */
  .modal-overlay { position: fixed; inset: 0; background: rgba(4,3,8,0.94); z-index: 1000; display: none; align-items: flex-start; justify-content: center; padding: 40px 20px; overflow-y: auto; backdrop-filter: blur(16px); opacity: 0; pointer-events: none; transition: opacity 0.25s; }
  .modal-overlay.open { display: flex; opacity: 1; pointer-events: all; }
  .modal { background: linear-gradient(135deg, var(--modal-grad-start) 0%, var(--surface) 100%); border: 1px solid var(--border2); max-width: 760px; width: 100%; position: relative; transform: translateY(24px) scale(0.98); transition: transform 0.3s cubic-bezier(0.34,1.56,0.64,1), opacity 0.25s; box-shadow: 0 24px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.04), 0 0 60px rgba(123,111,160,0.08); border-radius: 6px; overflow: hidden; }
  .modal-overlay.open .modal { transform: translateY(0) scale(1); }
  .modal-overlay.open .modal { transform: translateY(0); }
  .modal-header { padding: 36px 40px 28px; border-bottom: 1px solid var(--border); position: relative; }
  .modal-eyebrow { font-family: var(--mono); font-size: 10px; letter-spacing: 0.2em; text-transform: uppercase; color: var(--muted); margin-bottom: 12px; display: flex; gap: 16px; align-items: center; }
  .modal-title { font-family: var(--serif); font-size: clamp(24px, 4vw, 42px); font-weight: 900; letter-spacing: -1px; line-height: 1.1; margin-bottom: 6px; }
  .modal-artist { font-family: var(--mono); font-size: 13px; color: var(--accent); letter-spacing: 0.05em; }
  .close-btn { position: absolute; top: 28px; right: 32px; background: none; border: 1px solid var(--border); color: var(--muted); width: 36px; height: 36px; cursor: pointer; font-family: var(--mono); font-size: 16px; display: flex; align-items: center; justify-content: center; transition: all 0.15s; }
  .close-btn:hover { border-color: var(--red); color: var(--red); }
  .modal-body { padding: 36px 40px; }
  .modal-section { margin-bottom: 36px; }
  .modal-section-label { font-family: var(--mono); font-size: 10px; letter-spacing: 0.2em; text-transform: uppercase; color: var(--accent); margin-bottom: 14px; display: flex; align-items: center; gap: 10px; }
  .modal-section-label::after { content: ''; flex: 1; height: 1px; background: var(--border); max-width: 60px; }
  .modal-desc { font-size: 15px; color: var(--dim); line-height: 1.8; }
  .modal-meaning { font-size: 14px; color: var(--dim); line-height: 1.8; font-style: italic; border-left: 2px solid var(--accent2); padding-left: 20px; }
  .lyric-block { background: var(--bg); border: 1px solid var(--border); padding: 24px 28px; font-family: var(--mono); font-size: 13px; line-height: 2; color: var(--dim); white-space: pre-line; }
  .lyric-block .highlight { color: var(--text); font-weight: 500; }
  .copyright-notice { font-family: var(--mono); font-size: 10px; color: var(--muted); letter-spacing: 0.05em; margin-top: 12px; line-height: 1.6; }
  .listen-link { display: inline-flex; align-items: center; gap: 10px; margin-top: 20px; font-family: var(--mono); font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase; color: var(--text); border: 1px solid var(--border2); padding: 10px 20px; text-decoration: none; transition: all 0.18s; }
  .listen-link:hover { border-color: var(--accent); color: var(--accent); }

  /* ── COMMENTS SECTION ── */
  .comments-section { margin-top: 32px; padding-top: 32px; border-top: 1px solid var(--border); }
  .comments-header { font-family: var(--serif); font-size: 18px; font-weight: 700; margin-bottom: 20px; color: var(--text); }
  .comment-list { display: flex; flex-direction: column; gap: 16px; margin-bottom: 24px; }
  .comment-item { background: var(--bg); border: 1px solid var(--border); padding: 16px 20px; border-radius: 2px; }
  .comment-meta { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
  .comment-author { font-family: var(--mono); font-size: 11px; color: var(--accent); letter-spacing: 0.05em; }
  .comment-time { font-family: var(--mono); font-size: 9px; color: var(--muted); }
  .comment-text { font-size: 13px; color: var(--dim); line-height: 1.7; }
  .comment-form { display: flex; flex-direction: column; gap: 12px; }
  .comment-textarea { background: var(--bg); border: 1px solid var(--border2); color: var(--text); font-family: var(--sans); font-size: 14px; padding: 12px 16px; outline: none; resize: vertical; min-height: 80px; transition: border-color 0.15s; }
  .comment-textarea:focus { border-color: var(--accent); }
  .comment-submit { align-self: flex-start; font-family: var(--mono); font-size: 10px; letter-spacing: 0.12em; text-transform: uppercase; color: var(--bg); background: var(--accent); border: 1px solid var(--accent); padding: 8px 20px; cursor: pointer; border-radius: 2px; transition: all 0.18s; }
  .comment-submit:hover { background: transparent; color: var(--accent); }
  .comment-login-prompt { font-family: var(--mono); font-size: 11px; color: var(--muted); padding: 16px; background: var(--bg); border: 1px solid var(--border); text-align: center; }
  .comment-login-prompt a { color: var(--accent); cursor: pointer; text-decoration: underline; }

  /* ── ABOUT ── */
  .about-strip { border-top: 1px solid var(--border); padding: 64px 48px; display: grid; grid-template-columns: 1fr 1fr; gap: 64px; align-items: center; }
  .about-title { font-family: var(--serif); font-size: clamp(22px, 3vw, 32px); font-weight: 700; line-height: 1.3; margin-bottom: 16px; }
  .about-title em { font-style: italic; color: var(--accent); }
  .about-body { font-size: 14px; color: var(--dim); line-height: 1.85; }
  .stat-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1px; border: 1px solid var(--border); }
  .stat-cell { padding: 24px; background: var(--card); border-right: 1px solid var(--border); border-bottom: 1px solid var(--border); }
  .stat-cell label { font-family: var(--mono); font-size: 9px; letter-spacing: 0.2em; text-transform: uppercase; color: var(--muted); display: block; margin-bottom: 8px; }
  .stat-cell span { font-family: var(--serif); font-size: 28px; font-weight: 700; color: var(--accent); }

  /* ── FOOTER ── */
  footer { border-top: 1px solid var(--border); padding: 32px 48px; display: flex; justify-content: space-between; align-items: center; gap: 24px; flex-wrap: wrap; }
  .footer-logo { font-family: var(--mono); font-size: 13px; font-weight: 500; color: var(--dim); }
  .footer-copy { font-family: var(--mono); font-size: 10px; color: var(--muted); letter-spacing: 0.08em; line-height: 1.7; text-align: right; }

  .song-card.hidden { display: none; }

  /* ── AUTH MODALS ── */
  .auth-overlay { position: fixed; inset: 0; background: rgba(8,7,12,0.92); z-index: 3000; display: none; align-items: center; justify-content: center; padding: 24px; opacity: 0; pointer-events: none; transition: opacity 0.25s; backdrop-filter: blur(8px); overflow-y: auto; }
  .auth-overlay.open { display: flex; opacity: 1; pointer-events: all; }
  .auth-modal { background: linear-gradient(145deg, #151223 0%, var(--surface) 100%); border: 1px solid var(--border2); max-width: 420px; width: 100%; padding: 40px 36px 36px; position: relative; transform: translateY(20px) scale(0.97); transition: transform 0.28s cubic-bezier(0.34,1.56,0.64,1); max-height: 88vh; overflow-y: auto; -webkit-overflow-scrolling: touch; border-radius: 8px; box-shadow: 0 24px 64px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04); }
  .auth-overlay.open .auth-modal { transform: translateY(0) scale(1); }
  .auth-overlay.open .auth-modal { transform: translateY(0); }
  .auth-modal-title { font-family: var(--serif); font-size: 24px; font-weight: 700; margin-bottom: 4px; color: var(--text); }
  .auth-modal-sub { font-family: var(--mono); font-size: 11px; color: var(--muted); letter-spacing: 0.07em; line-height: 1.75; margin-bottom: 28px; }
  .form-group { margin-bottom: 18px; }
  .form-group label { font-family: var(--mono); font-size: 9px; letter-spacing: 0.18em; text-transform: uppercase; color: var(--muted); display: block; margin-bottom: 6px; }
  .form-input { width: 100%; background: var(--bg); border: 1px solid var(--border2); color: var(--text); font-family: var(--sans); font-size: 14px; padding: 10px 14px; outline: none; transition: border-color 0.15s; }
  .form-input:focus { border-color: var(--accent); }
  .form-btn { display: block; width: 100%; background: linear-gradient(135deg, var(--accent) 0%, #a87d3a 100%); color: var(--bg); border: 1px solid var(--accent); font-family: var(--mono); font-size: 12px; letter-spacing: 0.1em; text-transform: uppercase; padding: 12px 20px; cursor: pointer; transition: all 0.18s; margin-top: 8px; border-radius: 3px; font-weight: 500; box-shadow: 0 2px 16px rgba(200,169,110,0.2); }
  .form-btn:hover { background: transparent; color: var(--accent); box-shadow: none; }
  .form-btn.secondary { background: transparent; color: var(--text); border-color: var(--border2); }
  .form-btn.secondary:hover { border-color: var(--accent); color: var(--accent); }
  .form-divider { display: flex; align-items: center; gap: 12px; margin: 20px 0; font-family: var(--mono); font-size: 10px; color: var(--muted); text-transform: uppercase; letter-spacing: 0.1em; }
  .form-divider::before, .form-divider::after { content: ''; flex: 1; height: 1px; background: var(--border); }
  .google-btn { display: flex; align-items: center; justify-content: center; gap: 10px; width: 100%; background: var(--bg); border: 1px solid var(--border2); color: var(--text); font-family: var(--mono); font-size: 12px; letter-spacing: 0.05em; padding: 12px 20px; cursor: pointer; transition: all 0.18s; border-radius: 2px; }
  .google-btn:hover { border-color: var(--accent); }
  .google-btn svg { width: 18px; height: 18px; }
  .auth-switch { text-align: center; font-family: var(--mono); font-size: 11px; color: var(--muted); margin-top: 20px; }
  .auth-switch a { color: var(--accent); cursor: pointer; text-decoration: underline; }
  .auth-error { font-family: var(--mono); font-size: 11px; color: var(--red); margin-top: 8px; display: none; }
  .auth-close { position: absolute; top: 14px; right: 16px; background: none; border: 1px solid var(--border); color: var(--muted); width: 28px; height: 28px; cursor: pointer; font-size: 13px; display: flex; align-items: center; justify-content: center; transition: all 0.15s; border-radius: 2px; }
  .auth-close:hover { border-color: var(--red); color: var(--red); }
  .anon-hint { font-family: var(--mono); font-size: 10px; color: var(--muted); margin-top: 6px; line-height: 1.5; }

  /* ── SUBMIT SONG PAGE ── */
  .submit-section { padding: 64px 48px 80px; border-top: 1px solid var(--border); }
  .submit-intro { max-width: 600px; margin-bottom: 40px; }
  .submit-intro h2 { margin-bottom: 16px; }
  .submit-intro p { font-size: 14px; color: var(--dim); line-height: 1.8; }
  .submit-form { max-width: 700px; display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
  .submit-form .form-group.full { grid-column: 1 / -1; }
  .submit-form textarea.form-input { min-height: 120px; resize: vertical; font-family: var(--sans); line-height: 1.6; }
  .submit-form .form-btn { grid-column: 1 / -1; max-width: 200px; }
  .submit-login-wall { text-align: center; padding: 60px 20px; border: 1px solid var(--border); background: var(--card); }
  .submit-login-wall p { font-family: var(--mono); font-size: 13px; color: var(--dim); margin-bottom: 20px; }

  /* ── CHAT SECTION ── */
  .chat-section { padding: 0; border-top: none; flex: 1; display: flex; flex-direction: column; min-height: 0; }
  .chat-layout { display: grid; grid-template-columns: 1fr; gap: 0; border: none; flex: 1; min-height: 0; overflow: hidden; border-radius: 0; box-shadow: none; }
  .chat-sidebar { background: var(--card); padding: 20px; display: flex; flex-direction: column; gap: 16px; overflow: hidden; border-right: 1px solid var(--border); }
  .chat-sidebar h3 { font-family: var(--serif); font-size: 16px; font-weight: 700; margin-bottom: 4px; flex-shrink: 0; }
  .chat-search { background: var(--bg); border: 1px solid var(--border2); color: var(--text); font-family: var(--mono); font-size: 12px; padding: 8px 12px; outline: none; width: 100%; border-radius: 3px; flex-shrink: 0; }
  .chat-search:focus { border-color: var(--accent); }
  .room-list { display: flex; flex-direction: column; gap: 4px; overflow-y: auto; flex: 1; }
  .room-item { font-family: var(--mono); font-size: 11px; color: var(--dim); padding: 8px 10px; cursor: pointer; border-radius: 3px; transition: all 0.15s; border-left: 2px solid transparent; flex-shrink: 0; }
  .room-item:hover, .room-item.active { background: var(--bg); color: var(--text); border-left-color: var(--accent); }
  .room-item .room-meta { font-size: 9px; color: var(--muted); margin-top: 2px; }
  .chat-main { background: var(--surface); display: flex; flex-direction: column; height: 100%; overflow: hidden; }
  .chat-header { display: flex; align-items: center; gap: 4px; padding: 16px 20px; border-bottom: 1px solid var(--border); flex-shrink: 0; }
  .chat-header h4 { font-family: var(--serif); font-size: 18px; font-weight: 700; flex: 1; min-width: 0; }
  .chat-header .count-tag { flex-shrink: 0; }
  .chat-header-avatar, .topic-chat-header .chat-header-avatar {
    width: 36px; height: 36px; border-radius: 50%; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
    background: color-mix(in oklab, var(--accent2) 20%, transparent); color: var(--accent2);
    font-weight: 700; font-size: 15px; margin-right: 10px;
  }
  .chat-header-avatar.is-global { background: color-mix(in oklab, var(--accent) 20%, transparent); color: var(--accent); }
  .chat-header-titles { flex: 1; min-width: 0; display: flex; flex-direction: column; }
  .chat-header-titles h4 { flex: none; }
  .chat-header-titles .count-tag { margin-top: 1px; }
  .chat-messages { flex: 1; overflow-y: auto; display: flex; flex-direction: column; gap: 12px; padding: 16px 20px; min-height: 0; }
  .chat-msg { display: flex; gap: 10px; align-items: flex-start; }
  .chat-msg-avatar { width: 28px; height: 28px; border-radius: 50%; background: var(--accent2); display: flex; align-items: center; justify-content: center; font-family: var(--mono); font-size: 10px; color: var(--text); flex-shrink: 0; position: relative; cursor: pointer; }
  .chat-msg-body { flex: 1; }
  .chat-msg-name { font-family: var(--mono); font-size: 10px; color: var(--accent); margin-bottom: 2px; }
  .chat-msg-text { font-size: 13px; color: var(--dim); line-height: 1.5; }
  .chat-msg-time { font-family: var(--mono); font-size: 9px; color: var(--muted); margin-top: 2px; }
  .chat-input-wrap { display: flex; gap: 10px; align-items: center; padding: 12px 16px; background: var(--card); border-top: 1px solid var(--border); flex-shrink: 0; }
  .chat-input { flex: 1; min-width: 0; background: var(--bg); border: 1px solid var(--border2); color: var(--text); font-family: var(--sans); font-size: 14px; padding: 10px 14px; outline: none; border-radius: 3px; }
  .chat-input:focus { border-color: var(--accent); box-shadow: 0 0 0 2px var(--accent-glow); }
  .chat-send { font-family: var(--mono); font-size: 10px; letter-spacing: 0.1em; text-transform: uppercase; color: var(--bg); background: linear-gradient(135deg, var(--accent), #a88048); border: 1px solid var(--accent); padding: 10px 20px; cursor: pointer; transition: all 0.18s; border-radius: 3px; white-space: nowrap; flex-shrink: 0; box-shadow: 0 2px 12px rgba(200,169,110,0.25); }
  .chat-send:hover { background: transparent; color: var(--accent); box-shadow: none; }

  /* ── CHAT: message interactivity (tap for actions, mentions, reactions, replies) ── */
  .chat-msg { cursor: pointer; padding: 6px 8px; margin: 0 -8px; border-radius: 6px; transition: background 0.12s, transform 0.16s cubic-bezier(0.34,1.56,0.64,1); position: relative; }
  .chat-msg:hover { background: color-mix(in oklab, var(--accent) 6%, transparent); }
  .chat-msg:active { background: color-mix(in oklab, var(--accent) 12%, transparent); }

  /* ── DISCORD-STYLE CHAT ROOM DRAWER ── */
  .chat-drawer-toggle {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 34px;
    height: 34px;
    flex-shrink: 0;
    background: var(--card);
    border: 1px solid var(--border2);
    border-radius: 8px;
    color: var(--text);
    cursor: pointer;
    margin-right: 10px;
    font-size: 14px;
    transition: all 0.15s;
  }
  .chat-drawer-toggle:hover { border-color: var(--accent); color: var(--accent); }
  .chat-drawer-toggle span { display: block; width: 15px; height: 2px; background: currentColor; border-radius: 2px; position: relative; }
  .chat-drawer-toggle span::before, .chat-drawer-toggle span::after { content: ''; position: absolute; left: 0; width: 15px; height: 2px; background: currentColor; border-radius: 2px; }
  .chat-drawer-toggle span::before { top: -5px; }
  .chat-drawer-toggle span::after { top: 5px; }

  .chat-drawer-backdrop {
    position: fixed; inset: 0;
    background: rgba(0,0,0,0.55);
    backdrop-filter: blur(1px);
    opacity: 0; pointer-events: none;
    transition: opacity 0.25s ease;
    z-index: 300;
  }
  .chat-drawer-backdrop.open { opacity: 1; pointer-events: all; }

  .chat-drawer {
    position: fixed;
    top: 0; bottom: 0; left: 0;
    width: 82vw;
    max-width: 300px;
    background: var(--card);
    border-right: 1px solid var(--border);
    z-index: 301;
    display: flex;
    flex-direction: column;
    transform: translateX(-100%);
    transition: transform 0.28s cubic-bezier(.32,.72,.35,1);
    box-shadow: 8px 0 32px rgba(0,0,0,0.5);
    padding-top: env(safe-area-inset-top);
  }
  .chat-drawer.open { transform: translateX(0); }
  .chat-drawer-header {
    display: flex; align-items: center; justify-content: space-between;
    padding: 18px 16px 14px; border-bottom: 1px solid var(--border); flex-shrink: 0;
  }
  .chat-drawer-header h3 { font-family: var(--serif); font-size: 17px; font-weight: 700; }
  .chat-drawer-close {
    width: 30px; height: 30px; border-radius: 50%; background: var(--bg);
    border: 1px solid var(--border2); color: var(--dim); font-size: 14px;
    display: flex; align-items: center; justify-content: center; cursor: pointer;
  }
  .chat-drawer-close:hover { color: var(--accent); border-color: var(--accent); }
  .chat-drawer-body { flex: 1; overflow-y: auto; padding: 14px 14px 0; display: flex; flex-direction: column; min-height: 0; }
  .chat-drawer .chat-search { flex-shrink: 0; margin-bottom: 12px; }
  .chat-drawer .room-list { gap: 3px; }
  .chat-drawer .room-item {
    display: flex; align-items: center; gap: 8px;
    font-size: 13px; padding: 10px 10px; border-radius: 6px;
  }
  .chat-drawer .room-hash { color: var(--muted); font-weight: 600; flex-shrink: 0; }
  .chat-drawer .room-item.active .room-hash, .chat-drawer .room-item:hover .room-hash { color: var(--accent); }
  .chat-drawer .room-item-name { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .chat-drawer .room-meta { margin-top: 0; flex-shrink: 0; }
  .chat-drawer .chat-create-room { flex-shrink: 0; padding: 14px 0 18px; margin-top: 8px; }

  .chat-drawer-header-actions { display: flex; align-items: center; gap: 8px; }
  .chat-drawer-add {
    width: 30px; height: 30px; border-radius: 50%;
    background: var(--accent2); border: 1px solid var(--accent2); color: #fff;
    font-size: 16px; line-height: 1; display: flex; align-items: center; justify-content: center;
    cursor: pointer; transition: all 0.15s; flex-shrink: 0;
  }
  .chat-drawer-add:hover { transform: scale(1.06); }

  /* ── CREATE ROOM SHEET ── */
  .create-room-overlay {
    position: fixed; inset: 0; z-index: 3700; background: rgba(8,7,12,0.6); backdrop-filter: blur(4px);
    display: none; align-items: flex-end; justify-content: center;
  }
  .create-room-overlay.open { display: flex; }
  .create-room-sheet {
    background: var(--surface); border: 1px solid var(--border2); border-bottom: none;
    border-radius: 20px 20px 0 0; width: 100%; max-width: 460px;
    padding: 22px 22px calc(22px + env(safe-area-inset-bottom));
    box-shadow: 0 -8px 40px rgba(0,0,0,0.4);
    animation: msgSlideIn 0.28s cubic-bezier(0.22,1,0.36,1);
  }
  @media (min-width: 720px) {
    .create-room-overlay { align-items: center; }
    .create-room-sheet { border-radius: 20px; }
  }
  .create-room-sheet-handle { width: 36px; height: 4px; border-radius: 4px; background: var(--border2); margin: 0 auto 18px; display: none; }
  @media (max-width: 719px) { .create-room-sheet-handle { display: block; } }
  .create-room-title { font-family: var(--serif); font-size: 20px; font-weight: 700; margin-bottom: 4px; }
  .create-room-sub { font-family: var(--sans); font-size: 12.5px; color: var(--muted); margin-bottom: 18px; }
  .create-room-label { font-family: var(--mono); font-size: 10px; letter-spacing: 0.1em; text-transform: uppercase; color: var(--muted); margin-bottom: 8px; }
  .create-room-sheet input {
    width: 100%; background: var(--bg); border: 1px solid var(--border2); color: var(--text);
    font-family: var(--sans); font-size: 14px; padding: 12px 14px; border-radius: 10px; outline: none; margin-bottom: 18px;
  }
  .create-room-sheet input:focus { border-color: var(--accent2); box-shadow: 0 0 0 2px var(--accent2-glow); }
  .create-room-sheet .form-btn { width: 100%; border-radius: 10px; padding: 13px; }
  .create-room-close { position: absolute; top: 16px; right: 16px; }

  .chat-drawer-edge-hint {
    position: fixed; left: 0; top: 50%; transform: translateY(-50%);
    width: 4px; height: 56px; border-radius: 0 6px 6px 0;
    background: var(--accent); opacity: 0.35; z-index: 90;
    pointer-events: none; transition: opacity 0.2s;
  }
  body:not(.on-chat-page) .chat-drawer-edge-hint,
  body:not(.on-chat-page) .chat-drawer-toggle { display: none; }

  /* ── DESKTOP: room list becomes a persistent sidebar instead of a drawer ──
     Applies at real desktop widths (min-width:1025px, no manual preview
     override active), and whenever the admin's device-preview toggle is
     explicitly set to "Desktop". Mobile/tablet keep the sliding drawer. */
  @media (min-width: 1025px) {
    html:not([data-device]) body.on-chat-page #page-chat.active,
    html:not([data-device]) body.on-chat-page #page-topic-chat.active { padding-left: 280px; }
    html:not([data-device]) body.on-chat-page .chat-drawer {
      transform: translateX(0) !important; top: 60px; width: 280px; max-width: 280px;
      box-shadow: none; z-index: 40;
    }
    html:not([data-device]) body.on-chat-page .chat-drawer-backdrop,
    html:not([data-device]) body.on-chat-page .chat-drawer-close,
    html:not([data-device]) body.on-chat-page .chat-drawer-toggle,
    html:not([data-device]) body.on-chat-page .chat-drawer-edge-hint { display: none !important; }
  }
  html[data-device="desktop"] body.on-chat-page #page-chat.active,
  html[data-device="desktop"] body.on-chat-page #page-topic-chat.active { padding-left: 280px; }
  html[data-device="desktop"] body.on-chat-page .chat-drawer {
    transform: translateX(0) !important; top: 60px; width: 280px; max-width: 280px;
    box-shadow: none; z-index: 40;
  }
  html[data-device="desktop"] body.on-chat-page .chat-drawer-backdrop,
  html[data-device="desktop"] body.on-chat-page .chat-drawer-close,
  html[data-device="desktop"] body.on-chat-page .chat-drawer-toggle,
  html[data-device="desktop"] body.on-chat-page .chat-drawer-edge-hint { display: none !important; }

  /* Sidebar cards — Global Chat card + My Rooms rows, matching the reference design */
  .drawer-global-card {
    display: flex; align-items: center; gap: 12px; padding: 12px; border-radius: 14px; cursor: pointer;
    background: color-mix(in oklab, var(--accent2) 9%, transparent); border: 1px solid transparent;
    transition: border-color 0.18s, background 0.18s; margin-bottom: 4px;
  }
  .drawer-global-card:hover { border-color: var(--border2); }
  .drawer-global-card.active { border-color: var(--accent2); background: color-mix(in oklab, var(--accent2) 16%, transparent); }
  .drawer-global-avatar {
    width: 40px; height: 40px; border-radius: 50%; flex-shrink: 0; position: relative;
    background: linear-gradient(135deg, var(--accent2), var(--accent)); display: flex; align-items: center; justify-content: center;
    color: #fff; font-family: var(--serif); font-size: 16px; font-weight: 700;
  }
  .drawer-global-avatar .gca-dot { position: absolute; bottom: 0; right: 0; width: 10px; height: 10px; border-radius: 50%; background: var(--green); border: 2px solid var(--surface); }
  .drawer-global-text { flex: 1; min-width: 0; }
  .drawer-global-name { font-family: var(--sans); font-weight: 700; font-size: 13.5px; color: var(--text); }
  .drawer-global-sub { font-family: var(--sans); font-size: 11px; color: var(--muted); margin-top: 1px; }
  .drawer-global-count { font-family: var(--mono); font-size: 10px; color: var(--dim); flex-shrink: 0; text-align: right; }

  .drawer-room-row {
    display: flex; align-items: center; gap: 12px; padding: 9px 10px; border-radius: 12px; cursor: pointer;
    border: 1px solid transparent; transition: border-color 0.18s, background 0.18s; margin-bottom: 3px;
  }
  .drawer-room-row:hover { background: color-mix(in oklab, var(--accent2) 7%, transparent); }
  .drawer-room-row.active { border-color: var(--accent2); background: color-mix(in oklab, var(--accent2) 14%, transparent); }
  .drawer-room-avatar {
    width: 36px; height: 36px; border-radius: 10px; flex-shrink: 0;
    background: linear-gradient(135deg, color-mix(in oklab, var(--accent2) 55%, var(--bg)), color-mix(in oklab, var(--accent) 35%, var(--bg)));
    display: flex; align-items: center; justify-content: center; color: var(--text);
    font-family: var(--serif); font-size: 13.5px; font-weight: 700;
  }
  .drawer-room-text { flex: 1; min-width: 0; }
  .drawer-room-name { font-family: var(--sans); font-weight: 600; font-size: 13px; color: var(--text); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .drawer-room-meta { font-family: var(--sans); font-size: 10.5px; color: var(--muted); margin-top: 1px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .drawer-room-chev { color: var(--muted); font-size: 15px; flex-shrink: 0; }

  .chat-drawer-footer { flex-shrink: 0; padding: 12px 14px calc(12px + env(safe-area-inset-bottom)); border-top: 1px solid var(--border); }
  .chat-drawer-create-btn {
    width: 100%; padding: 10px; border-radius: 10px; cursor: pointer; text-align: center;
    background: transparent; border: 1px dashed var(--border2); color: var(--dim);
    font-family: var(--sans); font-weight: 600; font-size: 12.5px; transition: border-color 0.16s, color 0.16s, background 0.16s;
  }
  .chat-drawer-create-btn:hover { border-color: var(--accent2); color: var(--accent2); background: color-mix(in oklab, var(--accent2) 8%, transparent); }

  .chat-drawer-section-label {
    font-family: var(--mono); font-size: 10px; letter-spacing: 0.12em; text-transform: uppercase;
    color: var(--muted); margin: 14px 4px 6px;
  }
  .chat-drawer-section-label:first-child { margin-top: 0; }

  .mention { color: var(--accent); font-weight: 600; background: color-mix(in oklab, var(--accent) 12%, transparent); padding: 0 3px; border-radius: 3px; }

  .msg-reply-quote { display: flex; align-items: center; gap: 6px; font-family: var(--mono); font-size: 10px; color: var(--muted); border-left: 2px solid var(--accent2); padding: 3px 8px; margin-bottom: 4px; background: color-mix(in oklab, var(--accent2) 6%, transparent); border-radius: 0 3px 3px 0; }
  .msg-reply-quote .reply-quote-author { color: var(--accent2); font-weight: 600; }
  .msg-reply-quote.deleted { font-style: italic; opacity: 0.6; }

  .msg-reactions { display: flex; flex-wrap: wrap; gap: 5px; margin-top: 6px; }
  .reaction-pill { display: inline-flex; align-items: center; gap: 4px; font-family: var(--mono); font-size: 11px; background: var(--card); border: 1px solid var(--border2); padding: 2px 8px; border-radius: 100px; cursor: pointer; transition: border-color 0.15s, background 0.15s, color 0.15s, transform 0.15s; color: var(--dim); transform: scale(1); animation: reactionAppear 0.28s cubic-bezier(0.34, 1.56, 0.64, 1); }
  .reaction-pill:hover { border-color: var(--accent); }
  .reaction-pill:active { transform: scale(0.88); }
  .reaction-pill.mine { border-color: var(--accent); background: color-mix(in oklab, var(--accent) 14%, transparent); color: var(--accent); }
  .reaction-pill.pop { animation: reactionPop 0.36s cubic-bezier(0.34, 1.56, 0.64, 1); }

  @keyframes reactionAppear {
    from { opacity: 0; transform: scale(0.4) translateY(6px); }
    to   { opacity: 1; transform: scale(1) translateY(0); }
  }
  @keyframes reactionPop {
    0%   { transform: scale(1); }
    35%  { transform: scale(1.4); }
    60%  { transform: scale(0.9); }
    100% { transform: scale(1); }
  }

  /* ── message send-in animation ── */
  @keyframes msgSlideIn {
    from { opacity: 0; transform: translateY(16px) scale(0.97); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }
  .chat-msg.msg-send-in { animation: msgSlideIn 0.34s cubic-bezier(0.22, 1, 0.36, 1); }
  .chat-msg.msg-send-in .msg-reactions { animation: none; }

  /* ── smoother input bar interactions ── */
  .chat-input-wrap, .topic-chat-input-wrap { transition: box-shadow 0.25s ease; }
  .chat-input-wrap:focus-within, .topic-chat-input-wrap:focus-within { box-shadow: 0 -4px 24px rgba(0,0,0,0.35); }
  .chat-input { transition: border-color 0.2s ease, box-shadow 0.25s ease, transform 0.2s cubic-bezier(0.22, 1, 0.36, 1); }
  .chat-input:focus { transform: translateY(-1px); }
  .chat-send { transition: transform 0.16s cubic-bezier(0.34, 1.56, 0.64, 1), background 0.18s, color 0.18s, box-shadow 0.18s; }
  .chat-send:active { transform: scale(0.9); }

  @keyframes inputSentPulse {
    0%   { box-shadow: 0 0 0 0 var(--accent-glow); border-color: var(--accent); }
    60%  { box-shadow: 0 0 0 6px transparent; }
    100% { box-shadow: none; border-color: var(--border2); }
  }
  .chat-input.input-sent-pulse { animation: inputSentPulse 0.4s ease-out; }

  /* Reply banner above input */
  .reply-banner { display: flex; align-items: center; justify-content: space-between; gap: 10px; background: var(--card); border: 1px solid var(--border2); border-bottom: none; padding: 8px 14px; font-family: var(--sans); font-size: 12px; color: var(--dim); }
  .reply-banner-text { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .reply-banner-text span { color: var(--accent); font-weight: 600; }
  .reply-banner-cancel { background: none; border: none; color: var(--muted); font-size: 13px; cursor: pointer; flex-shrink: 0; padding: 2px 4px; }
  .reply-banner-cancel:hover { color: var(--red); }

  /* ═══════════════════════════════════════════════════════════════
     MOBILE CHATS LIST PAGE (Global / My Rooms / Trending Rooms)
     ═══════════════════════════════════════════════════════════════ */
  .chats-list-section { padding: 18px 18px calc(24px + env(safe-area-inset-bottom)); max-width: 640px; margin: 0 auto; }
  .chats-list-topbar { display: flex; align-items: center; justify-content: space-between; margin-bottom: 18px; }
  .chats-list-topbar h2 { font-family: var(--serif); font-size: 26px; font-weight: 800; }
  .chats-list-add-btn {
    width: 40px; height: 40px; border-radius: 12px; border: none; flex-shrink: 0;
    background: linear-gradient(135deg, var(--accent2), #5b4f80); color: #fff; font-size: 20px;
    display: flex; align-items: center; justify-content: center; cursor: pointer;
    box-shadow: 0 6px 18px color-mix(in oklab, var(--accent2) 45%, transparent);
    transition: transform 0.16s cubic-bezier(0.34,1.56,0.64,1);
  }
  .chats-list-add-btn:active { transform: scale(0.9); }

  .chats-list-sectionlabel {
    font-family: var(--mono); font-size: 10.5px; letter-spacing: 0.14em; text-transform: uppercase;
    color: var(--muted); margin: 20px 2px 10px; display: flex; align-items: center; justify-content: space-between;
  }
  .chats-list-sectionlabel:first-of-type { margin-top: 0; }
  .see-all-link { background: none; border: none; font-family: var(--sans); font-weight: 600; font-size: 12.5px; color: var(--accent2); cursor: pointer; text-transform: none; letter-spacing: 0; padding: 0; }
  .see-all-link:hover { color: var(--accent); }

  .global-chat-card {
    display: flex; align-items: center; gap: 14px; padding: 16px; border-radius: 16px; cursor: pointer;
    background: color-mix(in oklab, var(--accent2) 9%, var(--card)); border: 1px solid var(--border2);
    transition: border-color 0.18s, transform 0.16s;
  }
  .global-chat-card:hover { border-color: var(--accent2); }
  .global-chat-card:active { transform: scale(0.98); }
  .global-chat-avatar {
    width: 52px; height: 52px; border-radius: 50%; flex-shrink: 0; position: relative;
    background: linear-gradient(135deg, var(--accent2), var(--accent)); display: flex; align-items: center; justify-content: center;
    color: #fff; font-family: var(--serif); font-size: 20px; font-weight: 700;
  }
  .global-chat-avatar::before { content: '◐'; }
  .global-chat-avatar .gca-dot { position: absolute; bottom: 1px; right: 1px; width: 13px; height: 13px; border-radius: 50%; background: var(--green); border: 2px solid var(--card); }
  .global-chat-text { flex: 1; min-width: 0; }
  .global-chat-title { font-family: var(--sans); font-weight: 700; font-size: 16.5px; color: var(--text); }
  .global-chat-sub { font-family: var(--sans); font-size: 12.5px; color: var(--dim); margin-top: 2px; }
  .global-chat-desc { font-family: var(--sans); font-size: 12px; color: var(--muted); margin-top: 3px; }

  .room-list-cards { display: flex; flex-direction: column; gap: 10px; }
  .room-row {
    display: flex; align-items: center; gap: 13px; padding: 12px; border-radius: 14px; cursor: pointer;
    background: var(--card); border: 1px solid var(--border); transition: border-color 0.18s, transform 0.16s;
  }
  .room-row:hover { border-color: var(--accent2); }
  .room-row:active { transform: scale(0.98); }
  .room-row-avatar {
    width: 46px; height: 46px; border-radius: 13px; flex-shrink: 0;
    background: linear-gradient(135deg, color-mix(in oklab, var(--accent2) 55%, var(--bg)), color-mix(in oklab, var(--accent) 35%, var(--bg)));
    display: flex; align-items: center; justify-content: center; color: var(--text);
    font-family: var(--serif); font-size: 17px; font-weight: 700;
  }
  .room-row-text { flex: 1; min-width: 0; }
  .room-row-name { font-family: var(--sans); font-weight: 700; font-size: 14.5px; color: var(--text); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .room-row-meta { font-family: var(--sans); font-size: 12px; color: var(--muted); margin-top: 2px; }
  .room-row-dot { width: 9px; height: 9px; border-radius: 50%; background: var(--accent2); flex-shrink: 0; }
  .room-row-chev { color: var(--muted); font-size: 16px; flex-shrink: 0; }

  /* ═══════════════════════════════════════════════════════════════
     MOBILE-STYLE CHAT HEADER (back / title / search / rooms icons)
     ═══════════════════════════════════════════════════════════════ */
  .chat-drawer-toggle-avatar { cursor: pointer; }
  .chat-back-btn, .chat-header-icon-btn {
    background: none; border: none; color: var(--text); cursor: pointer;
    display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  }
  .chat-back-btn { font-size: 26px; width: 30px; height: 30px; margin-right: 2px; }
  .chat-header-icon-btn { font-size: 16px; width: 34px; height: 34px; border-radius: 50%; transition: background 0.15s; }
  .chat-header-icon-btn:hover { background: color-mix(in oklab, var(--accent2) 12%, transparent); }
  .chat-online-dot { display: inline-block; width: 7px; height: 7px; border-radius: 50%; background: var(--green); margin-right: 5px; vertical-align: middle; }

  .chat-pinned-banner {
    display: flex; align-items: center; gap: 10px; padding: 9px 16px;
    background: color-mix(in oklab, var(--accent) 10%, transparent); border-bottom: 1px solid var(--border);
    font-family: var(--sans); font-size: 12px; flex-shrink: 0;
  }
  .chat-pinned-label { font-family: var(--mono); font-size: 9.5px; letter-spacing: 0.08em; text-transform: uppercase; color: var(--accent); font-weight: 700; flex-shrink: 0; }
  .chat-pinned-text { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; color: var(--dim); }
  .chat-pinned-close { background: none; border: none; color: var(--muted); cursor: pointer; font-size: 12px; flex-shrink: 0; }
  .chat-pinned-close:hover { color: var(--red); }

  /* ── unified rounded "pill" input bar: input + send only ──
     Overrides the base .chat-input-wrap/.chat-input box styling so the whole
     bar reads as one seamless rounded shape instead of a boxed input floating
     inside a separate bar (which caused a double-border glitch). */
  .chat-input-wrap, .topic-chat-input-wrap {
    background: var(--card) !important;
    border: 1px solid var(--border2) !important;
    border-top: 1px solid var(--border2) !important;
    border-radius: 999px !important;
    margin: 12px 16px calc(12px + env(safe-area-inset-bottom)) !important;
    padding: 6px 6px 6px 20px !important;
    gap: 10px !important;
  }
  .chat-input-wrap:focus-within, .topic-chat-input-wrap:focus-within {
    border-color: var(--accent2) !important;
    box-shadow: 0 0 0 2px var(--accent2-glow) !important;
  }
  .chat-input-wrap .chat-input, .topic-chat-input-wrap .chat-input {
    background: transparent !important;
    border: none !important;
    box-shadow: none !important;
    border-radius: 0 !important;
    padding: 10px 0 !important;
    transform: none !important;
  }
  .chat-input-wrap .chat-input:focus, .topic-chat-input-wrap .chat-input:focus {
    border: none !important;
    box-shadow: none !important;
    transform: none !important;
  }
  .chat-input-wrap .chat-input:focus-visible, .topic-chat-input-wrap .chat-input:focus-visible {
    outline: none !important;
  }
  .chat-send-circle {
    width: 38px; height: 38px; border-radius: 50%; flex-shrink: 0; border: none; cursor: pointer;
    background: linear-gradient(135deg, var(--accent2), #5b4f80); color: #fff; font-size: 15px;
    display: flex; align-items: center; justify-content: center;
    box-shadow: 0 4px 14px color-mix(in oklab, var(--accent2) 45%, transparent);
    transition: transform 0.16s cubic-bezier(0.34,1.56,0.64,1);
  }
  .chat-send-circle:active { transform: scale(0.88); }

  /* ═══════════════════════════════════════════════════════════════
     CREATE ROOM SHEET — extra fields (description / category / privacy)
     ═══════════════════════════════════════════════════════════════ */
  .create-room-sheet textarea {
    width: 100%; background: var(--bg); border: 1px solid var(--border2); color: var(--text);
    font-family: var(--sans); font-size: 14px; padding: 12px 14px; border-radius: 10px; outline: none;
    margin-bottom: 18px; resize: vertical; min-height: 64px;
  }
  .create-room-sheet textarea:focus { border-color: var(--accent2); box-shadow: 0 0 0 2px var(--accent2-glow); }
  .create-room-sheet select {
    width: 100%; background: var(--bg); border: 1px solid var(--border2); color: var(--text);
    font-family: var(--sans); font-size: 14px; padding: 12px 14px; border-radius: 10px; outline: none;
    margin-bottom: 18px; appearance: none; cursor: pointer;
  }
  .create-room-sheet select:focus { border-color: var(--accent2); box-shadow: 0 0 0 2px var(--accent2-glow); }
  .create-room-privacy { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 20px; }
  .privacy-option {
    display: flex; align-items: center; gap: 10px; padding: 12px; border-radius: 12px; cursor: pointer;
    background: var(--bg); border: 1px solid var(--border2); text-align: left; font-family: var(--sans);
    transition: border-color 0.16s, background 0.16s;
  }
  .privacy-option .privacy-icon { font-size: 17px; flex-shrink: 0; }
  .privacy-option .privacy-text { display: flex; flex-direction: column; min-width: 0; }
  .privacy-option .privacy-text strong { font-size: 13.5px; color: var(--text); }
  .privacy-option .privacy-text small { font-size: 11px; color: var(--muted); margin-top: 1px; }
  .privacy-option.active { border-color: var(--accent2); background: color-mix(in oklab, var(--accent2) 14%, var(--bg)); }
  .privacy-option.active .privacy-icon { filter: none; }

  /* @ mention autocomplete dropdown */
  .mention-dropdown { position: absolute; bottom: 100%; left: 0; margin-bottom: 6px; width: 220px; max-height: 200px; overflow-y: auto; background: var(--surface); border: 1px solid var(--border2); border-radius: 4px; box-shadow: 0 8px 24px rgba(0,0,0,0.3); display: none; z-index: 50; }
  .mention-dropdown.open { display: block; }
  .mention-option { display: flex; align-items: center; gap: 8px; padding: 8px 12px; cursor: pointer; font-family: var(--mono); font-size: 12px; color: var(--text); }
  .mention-option:hover, .mention-option.highlighted { background: color-mix(in oklab, var(--accent) 12%, transparent); }
  .mention-option .mo-avatar { width: 20px; height: 20px; border-radius: 50%; background: var(--accent2); display: flex; align-items: center; justify-content: center; font-size: 9px; color: var(--text); flex-shrink: 0; }

  /* ── FLOATING MESSAGE ACTION BUBBLE (Instagram / WhatsApp style) ── */
  .msg-action-bubble {
    position: fixed;
    z-index: 3500;
    background: var(--surface);
    border: 1px solid var(--border2);
    border-radius: 18px;
    padding: 6px 4px 4px;
    box-shadow: 0 8px 32px rgba(0,0,0,0.55), 0 2px 8px rgba(0,0,0,0.3);
    display: none;
    flex-direction: column;
    align-items: stretch;
    min-width: 200px;
    max-width: 260px;
    pointer-events: all;
    transform-origin: top left;
  }
  .msg-action-bubble.open {
    display: flex;
    animation: bubblePop 0.18s cubic-bezier(0.34,1.4,0.64,1);
  }
  @keyframes bubblePop {
    from { opacity: 0; transform: scale(0.82); }
    to   { opacity: 1; transform: scale(1); }
  }

  /* emoji strip at top */
  .bubble-emoji-row {
    display: flex;
    justify-content: space-around;
    padding: 2px 8px 8px;
    border-bottom: 1px solid var(--border);
    margin-bottom: 2px;
    gap: 2px;
  }
  .bubble-emoji-btn {
    font-size: 22px;
    background: none;
    border: none;
    cursor: pointer;
    padding: 4px 3px;
    border-radius: 10px;
    line-height: 1;
    transition: transform 0.12s, background 0.12s;
  }
  .bubble-emoji-btn:active { transform: scale(1.3); background: var(--card); }

  /* action rows */
  .bubble-action {
    font-family: var(--mono);
    font-size: 12px;
    color: var(--dim);
    background: none;
    border: none;
    padding: 10px 16px;
    text-align: left;
    cursor: pointer;
    border-radius: 8px;
    display: flex;
    align-items: center;
    gap: 10px;
    letter-spacing: 0.03em;
    transition: background 0.12s, color 0.12s;
    width: 100%;
  }
  .bubble-action:active, .bubble-action:hover { background: var(--card); color: var(--text); }
  .bubble-action.danger { color: var(--red); }
  .bubble-action.danger:active, .bubble-action.danger:hover { background: color-mix(in oklab, var(--red) 10%, transparent); }
  .bubble-action .ba-icon { font-size: 14px; width: 18px; text-align: center; flex-shrink: 0; }

  /* dim backdrop — no blur so message is still visible */
  .bubble-backdrop {
    position: fixed; inset: 0;
    z-index: 3499;
    display: none;
  }
  .bubble-backdrop.open { display: block; }

  /* Full emoji picker */
  .emoji-picker-overlay { position: fixed; inset: 0; background: rgba(8,7,12,0.7); backdrop-filter: blur(4px); z-index: 3600; display: none; align-items: flex-end; justify-content: center; opacity: 0; pointer-events: none; transition: opacity 0.2s; }
  .emoji-picker-overlay.open { display: flex; }
  .emoji-picker-overlay.open { opacity: 1; pointer-events: all; }
  .emoji-picker-sheet { background: var(--surface); border: 1px solid var(--border2); border-bottom: none; border-radius: 16px 16px 0 0; width: 100%; max-width: 440px; height: 60vh; display: flex; flex-direction: column; transform: translateY(100%); transition: transform 0.25s cubic-bezier(0.4,0,0.2,1); }
  .emoji-picker-overlay.open .emoji-picker-sheet { transform: translateY(0); }
  .emoji-picker-header { display: flex; align-items: center; justify-content: space-between; padding: 16px 18px; border-bottom: 1px solid var(--border); font-family: var(--mono); font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase; color: var(--muted); }
  .emoji-picker-body { flex: 1; overflow-y: auto; padding: 12px 14px calc(14px + env(safe-area-inset-bottom)); -webkit-overflow-scrolling: touch; }
  .emoji-picker-cat-label { font-family: var(--mono); font-size: 9px; letter-spacing: 0.14em; text-transform: uppercase; color: var(--muted); margin: 14px 4px 8px; }
  .emoji-picker-cat-label:first-child { margin-top: 0; }
  .emoji-picker-grid { display: grid; grid-template-columns: repeat(8, 1fr); gap: 2px; }
  .emoji-picker-grid button { font-size: 22px; background: none; border: none; cursor: pointer; padding: 6px; border-radius: 6px; line-height: 1; }
  .emoji-picker-grid button:hover { background: var(--card); }
  @media (max-width: 480px) { .emoji-picker-grid { grid-template-columns: repeat(6, 1fr); } }

  .chat-create-room { margin-top: 12px; padding-top: 12px; border-top: 1px solid var(--border); }
  .chat-create-room input { width: 100%; background: var(--bg); border: 1px solid var(--border2); color: var(--text); font-family: var(--mono); font-size: 11px; padding: 8px 10px; margin-bottom: 8px; outline: none; }
  .chat-create-room input:focus { border-color: var(--accent); }
  .chat-create-room .form-btn { width: 100%; margin-top: 0; }

  /* ── DEDICATED TOPIC CHAT PAGE ── */
  .topic-chat-header {
    display: flex; align-items: center; gap: 4px;
    padding: 16px 20px; margin-bottom: 0; border-bottom: 1px solid var(--border); flex-shrink: 0;
  }
  .topic-back-btn {
    display: flex; align-items: center; gap: 8px;
    font-family: var(--mono); font-size: 11px; letter-spacing: 0.08em; text-transform: uppercase;
    color: var(--dim); background: var(--card); border: 1px solid var(--border2);
    padding: 9px 16px; border-radius: 6px; cursor: pointer; transition: all 0.18s; flex-shrink: 0;
  }
  .topic-back-btn:hover { color: var(--accent); border-color: var(--accent); background: color-mix(in oklab, var(--accent) 8%, transparent); }
  .topic-chat-title-wrap { flex: 1; min-width: 0; }
  .topic-chat-title { font-family: var(--serif); font-size: 18px; font-weight: 700; line-height: 1.2; }
  .topic-chat-meta { font-family: var(--mono); font-size: 10px; color: var(--muted); margin-top: 2px; }
  .topic-chat-body {
    border: none; background: var(--surface);
    display: flex; flex-direction: column; flex: 1; min-height: 0; overflow: hidden;
    border-radius: 0; box-shadow: none;
  }
  .topic-chat-messages {
    flex: 1; overflow-y: auto; padding: 24px;
    display: flex; flex-direction: column; gap: 14px; min-height: 0;
  }
  .topic-chat-input-wrap {
    display: flex; gap: 10px; padding: 12px 16px; border-top: 1px solid var(--border); background: var(--card);
    align-items: center; flex-shrink: 0;
  }
  .topic-chat-input-wrap .chat-input { flex: 1; min-width: 0; border-radius: 3px; }
  .topic-chat-input-wrap .chat-send { flex-shrink: 0; white-space: nowrap; }

  /* room list: global vs topic rooms visually distinct */
  .room-item.is-global { border-left: 2px solid var(--accent); }
  .room-item .room-go-icon { float: right; opacity: 0.5; font-size: 11px; }

  /* ── CHAT ENABLE TOGGLE (admin) ── */
  .chat-enable-switch { display: inline-flex; cursor: pointer; }
  .chat-enable-switch input { display: none; }
  .chat-enable-track {
    width: 44px; height: 24px; border-radius: 100px;
    background: var(--border2); position: relative; transition: background 0.2s; display: inline-block;
  }
  .chat-enable-thumb {
    position: absolute; top: 3px; left: 3px; width: 18px; height: 18px;
    border-radius: 50%; background: var(--text); transition: transform 0.2s;
  }
  .chat-enable-switch input:checked + .chat-enable-track { background: var(--accent); }
  .chat-enable-switch input:checked + .chat-enable-track .chat-enable-thumb { transform: translateX(20px); background: var(--bg); }

  /* ── ADMIN PANEL ── */
  .admin-section { position: relative; padding: 40px 48px 80px; min-height: 100vh; overflow: hidden; }
  .admin-section::before {
    content: ''; position: absolute; top: -200px; left: 50%; transform: translateX(-50%);
    width: 900px; height: 420px; background: radial-gradient(ellipse at center, var(--accent-glow), transparent 70%);
    pointer-events: none; z-index: 0;
  }
  .admin-header, .admin-stats-strip, .admin-grid { position: relative; z-index: 1; }
  .admin-header { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 32px; padding-bottom: 22px; border-bottom: 1px solid var(--border); gap: 20px; flex-wrap: wrap; }
  .admin-header-titles { display: flex; flex-direction: column; gap: 7px; }
  .admin-eyebrow { display: flex; align-items: center; gap: 8px; font-family: var(--mono); font-size: 10px; letter-spacing: 0.22em; text-transform: uppercase; color: var(--accent); }
  .admin-eyebrow .dot { width: 6px; height: 6px; border-radius: 50%; background: var(--green); box-shadow: 0 0 8px var(--green); flex-shrink: 0; }
  .admin-header h2 { font-family: var(--serif); font-size: 30px; font-weight: 700; letter-spacing: -0.01em; }

  /* Overview stat strip */
  .admin-stats-strip { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; margin-bottom: 28px; }
  .admin-stat-card { background: var(--card); border: 1px solid var(--border); border-radius: 10px; padding: 18px 20px; display: flex; flex-direction: column; gap: 7px; transition: all 0.2s; }
  .admin-stat-card:hover { border-color: var(--border2); transform: translateY(-2px); box-shadow: var(--shadow-card); }
  .admin-stat-card .stat-icon { font-size: 15px; color: var(--accent); opacity: 0.85; }
  .admin-stat-card .stat-num { font-family: var(--serif); font-size: 28px; font-weight: 700; color: var(--text); line-height: 1; }
  .admin-stat-card .stat-lbl { font-family: var(--mono); font-size: 9.5px; letter-spacing: 0.12em; text-transform: uppercase; color: var(--muted); }

  .admin-grid { display: grid; grid-template-columns: 230px 1fr; gap: 28px; align-items: start; }
  .admin-nav { display: flex; flex-direction: column; gap: 2px; background: var(--surface); border: 1px solid var(--border); border-radius: 12px; padding: 10px; position: sticky; top: 20px; }
  .admin-nav-group-label { font-family: var(--mono); font-size: 9px; letter-spacing: 0.16em; text-transform: uppercase; color: var(--muted); padding: 14px 12px 6px; }
  .admin-nav-group-label:first-child { padding-top: 6px; }
  .admin-nav-item { display: flex; align-items: center; gap: 10px; font-family: var(--mono); font-size: 11.5px; letter-spacing: 0.04em; text-transform: uppercase; color: var(--dim); padding: 10px 12px; cursor: pointer; border-radius: 7px; border: 1px solid transparent; transition: all 0.16s; }
  .admin-nav-item .ni-icon { font-size: 13px; width: 16px; text-align: center; opacity: 0.7; flex-shrink: 0; }
  .admin-nav-item .ni-badge { margin-left: auto; background: var(--accent); color: var(--bg); font-family: var(--mono); font-size: 9px; font-weight: 700; padding: 1px 6px; border-radius: 20px; letter-spacing: 0; }
  .admin-nav-item:hover { background: var(--card); border-color: var(--border2); color: var(--text); }
  .admin-nav-item.active { background: var(--accent-glow); border-color: var(--accent); color: var(--accent); }
  .admin-nav-item:hover .ni-icon, .admin-nav-item.active .ni-icon { opacity: 1; }
  .admin-panel { background: var(--card); border: 1px solid var(--border); border-radius: 12px; padding: 32px; box-shadow: var(--shadow-card); }
  .admin-panel h3 { font-family: var(--serif); font-size: 21px; font-weight: 700; margin-bottom: 24px; }
  .admin-form { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; }
  .admin-form .form-group.full { grid-column: 1 / -1; }
  .admin-form textarea.form-input { min-height: 100px; resize: vertical; font-family: var(--sans); line-height: 1.6; }
  .admin-form .form-btn { grid-column: 1 / -1; max-width: 200px; justify-self: start; }
  .color-picker-wrap { display: flex; align-items: center; gap: 12px; }
  .color-picker-wrap input[type="color"] { width: 48px; height: 36px; border: 1px solid var(--border2); background: var(--bg); cursor: pointer; border-radius: 5px; }
  .admin-card { background: var(--bg); border: 1px solid var(--border); border-radius: 10px; padding: 16px 18px; }
  .admin-row { display: flex; justify-content: space-between; align-items: center; gap: 16px; flex-wrap: wrap; }
  .admin-songs-list { display: flex; flex-direction: column; gap: 8px; }
  .admin-song-row { display: flex; justify-content: space-between; align-items: center; padding: 13px 16px; background: var(--bg); border: 1px solid var(--border); border-radius: 9px; transition: all 0.18s; }
  .admin-song-row .song-info { font-family: var(--mono); font-size: 12px; color: var(--text); }
  .admin-song-row .song-info span { color: var(--muted); font-size: 10px; }
  .admin-song-row .actions { display: flex; gap: 8px; }
  .admin-song-row .actions button { font-family: var(--mono); font-size: 9px; letter-spacing: 0.1em; text-transform: uppercase; padding: 5px 11px; cursor: pointer; border: 1px solid var(--border2); border-radius: 5px; background: transparent; color: var(--dim); transition: all 0.15s; }
  .admin-song-row .actions button:hover { border-color: var(--red); color: var(--red); }
  .admin-song-row .actions button.edit-btn:hover { border-color: var(--accent); color: var(--accent); }
  .admin-song-row.clickable { cursor: pointer; }
  .admin-song-row.clickable:hover { border-color: var(--accent); background: var(--surface); transform: translateX(2px); box-shadow: 0 3px 14px rgba(0,0,0,0.28); }
  .sub-bulk-toolbar { display: flex; gap: 10px; margin-bottom: 16px; flex-wrap: wrap; }
  .sub-bulk-btn { font-family: var(--mono); font-size: 10px; letter-spacing: 0.1em; text-transform: uppercase; padding: 9px 16px; cursor: pointer; border-radius: 7px; border: 1px solid var(--border2); background: transparent; color: var(--dim); transition: all 0.15s; }
  .sub-bulk-btn:hover { border-color: var(--accent); color: var(--accent); }
  .sub-bulk-btn.approve { background: var(--accent); color: var(--bg); border-color: var(--accent); }
  .sub-bulk-btn.approve:hover { background: transparent; color: var(--accent); }
  .sub-bulk-btn.active { border-color: var(--accent); color: var(--accent); }
  .admin-song-row .sub-select-checkbox { width: 16px; height: 16px; margin-right: 14px; accent-color: var(--accent); cursor: pointer; flex-shrink: 0; }
  .admin-song-row.select-mode { display: flex; align-items: center; }

  /* Submission detail modal */
  .sub-detail-modal { max-width: 640px; }
  .sub-detail-status { display: inline-block; font-family: var(--mono); font-size: 9px; letter-spacing: 0.1em; text-transform: uppercase; padding: 3px 10px; border-radius: 20px; border: 1px solid var(--border2); color: var(--dim); margin-bottom: 18px; }
  .sub-detail-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 4px 24px; margin-bottom: 20px; }
  .sub-detail-field { padding: 10px 0; border-bottom: 1px solid var(--border); }
  .sub-detail-field.full { grid-column: 1 / -1; }
  .sub-detail-field label { display: block; font-family: var(--mono); font-size: 9px; letter-spacing: 0.1em; text-transform: uppercase; color: var(--muted); margin-bottom: 6px; }
  .sub-detail-field .val { font-size: 13px; color: var(--text); line-height: 1.7; white-space: pre-wrap; word-break: break-word; }
  .sub-detail-field .val.empty { color: var(--muted); font-style: italic; }
  .sub-detail-field .val a { color: var(--accent); }
  .sub-detail-actions { display: flex; gap: 10px; margin-top: 8px; }
  .sub-detail-actions button { flex: 1; font-family: var(--mono); font-size: 10px; letter-spacing: 0.1em; text-transform: uppercase; padding: 12px; cursor: pointer; border-radius: 2px; transition: all 0.15s; }
  .sub-detail-actions .approve-btn { background: var(--accent); color: var(--bg); border: 1px solid var(--accent); }
  .sub-detail-actions .approve-btn:hover { background: transparent; color: var(--accent); }
  .sub-detail-actions .reject-btn { background: transparent; color: var(--dim); border: 1px solid var(--border2); }
  .sub-detail-actions .reject-btn:hover { border-color: var(--red); color: var(--red); }
  .sub-detail-status.status-active { border-color: var(--green); color: var(--green); }
  .sub-detail-status.status-blocked { border-color: var(--red); color: var(--red); }
  .sub-detail-actions .block-btn { background: transparent; color: var(--dim); border: 1px solid var(--border2); }
  .sub-detail-actions .block-btn:hover { border-color: var(--accent); color: var(--accent); }
  .sub-detail-actions .block-btn.is-blocked { border-color: var(--green); color: var(--green); }
  .sub-detail-actions .delete-btn { background: transparent; color: var(--red); border: 1px solid var(--red); }
  .sub-detail-actions .delete-btn:hover { background: var(--red); color: #fff; }
  .admin-song-row .song-info .blocked-tag { color: var(--red); font-weight: 600; }

  /* ── SOCIAL HUB ── */
  .social-hub-section { flex: 1; display: flex; flex-direction: column; min-height: 0; overflow-y: auto; padding: 28px 20px 40px; }
  .social-hub-eyebrow { font-family: var(--mono); font-size: 10px; letter-spacing: 0.22em; text-transform: uppercase; color: var(--accent); margin-bottom: 8px; }
  .social-hub-header h2 { font-family: var(--serif); font-size: 26px; font-weight: 700; margin-bottom: 6px; }
  .social-hub-sub { font-family: var(--mono); font-size: 11px; color: var(--muted); line-height: 1.7; margin-bottom: 28px; max-width: 480px; }
  .social-hub-cards { display: flex; flex-direction: column; gap: 14px; max-width: 560px; }
  .social-hub-card {
    display: flex; align-items: center; gap: 18px;
    background: var(--card); border: 1px solid var(--border2); border-radius: 14px;
    padding: 22px 24px; cursor: pointer; transition: transform 0.18s, box-shadow 0.18s, border-color 0.18s, background 0.18s; position: relative;
  }
  .social-hub-card:hover {
    border-color: var(--accent);
    background: color-mix(in oklab, var(--accent) 5%, var(--card));
    transform: translateY(-3px);
    box-shadow: 0 14px 30px rgba(0,0,0,0.22);
  }
  .social-hub-card .shc-icon {
    font-size: 21px; color: var(--accent); flex-shrink: 0;
    width: 48px; height: 48px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    background: color-mix(in oklab, var(--accent) 14%, transparent);
    transition: transform 0.18s;
  }
  .social-hub-card:hover .shc-icon { transform: scale(1.08); }
  .social-hub-card:nth-child(2) .shc-icon { color: var(--accent2); background: color-mix(in oklab, var(--accent2) 16%, transparent); }
  .social-hub-card .shc-text { flex: 1; min-width: 0; }
  .social-hub-card .shc-title { font-family: var(--serif); font-size: 17px; font-weight: 700; color: var(--text); margin-bottom: 3px; }
  .social-hub-card .shc-desc { font-family: var(--sans); font-size: 12px; color: var(--dim); line-height: 1.5; }
  .social-hub-card .shc-arrow { font-size: 20px; color: var(--muted); flex-shrink: 0; transition: transform 0.18s, color 0.18s; }
  .social-hub-card:hover .shc-arrow { transform: translateX(3px); color: var(--accent); }
  .shc-badge { position: absolute; top: 14px; right: 34px; background: var(--accent); color: var(--bg); font-family: var(--mono); font-size: 10px; font-weight: 700; padding: 2px 7px; border-radius: 100px; }
  .social-hub-card { border-radius: 18px; padding: 22px; box-shadow: var(--shadow-card); }
  .social-hub-card .shc-icon { border-radius: 14px; }
  .social-hub-friends-preview { margin-top: 28px; max-width: 560px; }

  /* Center the hub content on tablet/desktop, where the page has far more
     width available than the card column needs — previously everything
     stayed pinned to the left edge, leaving a large dead zone on the right. */
  @media (min-width: 721px) {
    .social-hub-section { align-items: center; }
    .social-hub-header, .social-hub-cards, .social-hub-friends-preview {
      width: 100%; margin-left: auto; margin-right: auto;
    }
    #social-login-wall .submit-login-wall { max-width: 480px; margin-left: auto; margin-right: auto; border-radius: 14px; }
    .social-hub-header { text-align: center; }
    .social-hub-eyebrow, .social-hub-sub { margin-left: auto; margin-right: auto; }
  }

  /* ── FRIENDS PAGE ── */
  .friends-section { flex: 1; display: flex; flex-direction: column; min-height: 0; }
  .friends-body { flex: 1; overflow-y: auto; padding: 18px 20px 40px; display: flex; flex-direction: column; gap: 8px; }
  .friends-add-row { display: flex; gap: 8px; align-items: stretch; }
  .friends-add-row .chat-search { flex: 1; min-width: 0; }
  .friends-add-row .form-btn { display: block; width: auto; flex: 0 0 auto; margin-top: 0; padding: 10px 20px; white-space: nowrap; }
  .friends-search-results { display: flex; flex-direction: column; gap: 6px; }
  .friends-block { margin-top: 22px; }
  .friends-block-title { font-family: var(--mono); font-size: 10px; letter-spacing: 0.12em; text-transform: uppercase; color: var(--muted); margin-bottom: 10px; }
  .friends-list { display: flex; flex-direction: column; gap: 8px; }
  .friend-row {
    display: flex; align-items: center; gap: 12px;
    background: var(--card); border: 1px solid var(--border); border-radius: 8px;
    padding: 10px 12px;
  }
  .friend-row-avatar {
    width: 36px; height: 36px; border-radius: 50%; background: var(--accent2);
    display: flex; align-items: center; justify-content: center;
    font-family: var(--mono); font-size: 12px; color: var(--text); flex-shrink: 0;
    position: relative;
  }
  .presence-dot {
    display: inline-block; width: 9px; height: 9px; border-radius: 50%; flex-shrink: 0;
    background: var(--green); vertical-align: middle;
  }
  .presence-dot.away { background: var(--accent); }
  .friend-row-avatar .presence-dot {
    position: absolute; bottom: -1px; right: -1px; border: 2px solid var(--surface);
  }
  .friend-row-info { flex: 1; min-width: 0; }
  .friend-row-name { font-family: var(--mono); font-size: 13px; color: var(--text); font-weight: 600; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .friend-row-sub { font-family: var(--sans); font-size: 11px; color: var(--muted); margin-top: 1px; }
  .friend-row-actions { display: flex; gap: 6px; flex-shrink: 0; }
  .friend-row-actions button {
    font-family: var(--mono); font-size: 10px; letter-spacing: 0.06em; text-transform: uppercase;
    padding: 7px 12px; border-radius: 5px; cursor: pointer; transition: all 0.15s; white-space: nowrap;
    border: 1px solid var(--border2); background: transparent; color: var(--dim);
  }
  .friend-row-actions button.primary { background: var(--accent); color: var(--bg); border-color: var(--accent); }
  .friend-row-actions button.primary:hover { background: transparent; color: var(--accent); }
  .friend-row-actions button.danger:hover { border-color: var(--red); color: var(--red); }
  .friend-row-actions button:hover:not(.primary):not(.danger) { border-color: var(--accent); color: var(--accent); }
  .friends-empty { font-family: var(--mono); font-size: 11px; color: var(--muted); padding: 10px 2px; }

  .friend-row-name .frn-code { color: var(--accent2); font-weight: 400; margin-left: 6px; letter-spacing: 0.02em; }
  .friend-row-avatar, .friend-row-name { cursor: pointer; }

  .friends-your-code {
    margin-top: 4px; font-family: var(--mono); font-size: 11px; color: var(--dim);
    background: var(--card); border: 1px dashed var(--border2); border-radius: 6px;
    padding: 10px 14px; display: flex; align-items: center; justify-content: space-between; gap: 10px;
  }
  .friends-your-code .fyc-code { color: var(--accent); font-weight: 700; font-size: 14px; letter-spacing: 0.05em; cursor: pointer; }
  .friends-your-code .fyc-copy { font-family: var(--mono); font-size: 9px; letter-spacing: 0.08em; text-transform: uppercase; color: var(--muted); background: none; border: 1px solid var(--border2); border-radius: 4px; padding: 5px 9px; cursor: pointer; }
  .friends-your-code .fyc-copy:hover { border-color: var(--accent); color: var(--accent); }

  /* ── FRIENDS PAGE — redesigned (header, tabs, message rows) ── */
  .friends-page-header {
    display: flex; align-items: center; gap: 12px;
    padding: 16px 20px 6px; flex-shrink: 0;
  }
  .friends-back-btn { padding: 8px 12px; flex-shrink: 0; }
  .friends-page-title { flex: 1; min-width: 0; font-family: var(--serif); font-size: 22px; font-weight: 700; }
  .friends-compose-btn {
    width: 38px; height: 38px; border-radius: 10px; flex-shrink: 0;
    background: var(--accent2); border: 1px solid var(--accent2); color: #fff;
    font-size: 15px; cursor: pointer; display: flex; align-items: center; justify-content: center;
    transition: all 0.18s; box-shadow: 0 2px 12px color-mix(in oklab, var(--accent2) 40%, transparent);
  }
  .friends-compose-btn:hover { transform: translateY(-1px) scale(1.04); }
  [data-theme="light"] .friends-compose-btn { color: #fff; }

  .friends-add-panel {
    display: none; flex-direction: column; gap: 10px;
    padding: 4px 20px 16px; flex-shrink: 0;
    border-bottom: 1px solid var(--border);
  }
  .friends-add-panel.open { display: flex; }

  .friends-search-bar { padding: 14px 20px 10px; flex-shrink: 0; }
  .friends-search-bar .chat-search { border-radius: 10px; padding: 10px 14px; }

  .friends-tabs {
    display: flex; gap: 4px; padding: 0 20px 12px; flex-shrink: 0;
    border-bottom: 1px solid var(--border);
  }
  .friends-tab-btn {
    position: relative; font-family: var(--mono); font-size: 12px; font-weight: 600;
    letter-spacing: 0.02em; color: var(--muted); background: none; border: none;
    padding: 8px 4px 12px; margin-right: 20px; cursor: pointer; transition: color 0.15s;
  }
  .friends-tab-btn::after {
    content: ''; position: absolute; left: 0; right: 0; bottom: -1px; height: 2px;
    background: var(--accent2); border-radius: 2px; opacity: 0; transform: scaleX(0.6);
    transition: opacity 0.18s, transform 0.18s;
  }
  .friends-tab-btn.active { color: var(--text); }
  .friends-tab-btn.active::after { opacity: 1; transform: scaleX(1); }
  .ftb-badge {
    display: inline-flex; align-items: center; justify-content: center;
    min-width: 16px; height: 16px; padding: 0 4px; margin-left: 6px;
    border-radius: 100px; background: var(--red); color: #fff;
    font-family: var(--mono); font-size: 9px; font-weight: 700; vertical-align: middle;
  }

  .friends-tab-panel { display: flex; flex-direction: column; min-height: 0; }

  /* message-preview row (Messages tab) */
  .msg-list { gap: 2px; }
  .msg-row {
    display: flex; align-items: center; gap: 12px;
    padding: 11px 10px; border-radius: 12px; cursor: pointer;
    transition: background 0.15s;
  }
  .msg-row:hover { background: var(--card); }
  .msg-row.active { background: color-mix(in oklab, var(--accent2) 12%, transparent); }
  .msg-row .friend-row-avatar { width: 46px; height: 46px; font-size: 14px; }
  .msg-row .friend-row-name { font-family: var(--sans); font-weight: 600; font-size: 14px; }
  .msg-row-preview {
    font-family: var(--sans); font-size: 12.5px; color: var(--muted);
    margin-top: 2px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
  }
  .msg-row-preview.unread { color: var(--text); font-weight: 600; }
  .msg-row-meta { display: flex; flex-direction: column; align-items: flex-end; gap: 6px; flex-shrink: 0; }
  .msg-row-time { font-family: var(--mono); font-size: 10px; color: var(--muted); white-space: nowrap; }
  .msg-row-badge {
    display: inline-flex; align-items: center; justify-content: center;
    min-width: 18px; height: 18px; padding: 0 5px; border-radius: 100px;
    background: var(--accent2); color: #fff; font-family: var(--mono); font-size: 10px; font-weight: 700;
  }

  /* ── DM EMPTY STATE (desktop split view) ── */
  .dm-empty-state {
    display: none; flex: 1; flex-direction: column; align-items: center; justify-content: center;
    gap: 8px; text-align: center; padding: 40px;
  }
  .dm-empty-icon { font-size: 38px; opacity: 0.5; }
  .dm-empty-title { font-family: var(--serif); font-size: 18px; font-weight: 700; color: var(--text); }
  .dm-empty-sub { font-family: var(--sans); font-size: 12.5px; color: var(--muted); }
  .dm-content { flex: 1; min-height: 0; flex-direction: column; }

  /* ── DESKTOP: Friends list becomes a persistent left column, DM the right panel ──
     Mirrors the same trick used for the chat room drawer above. */
  @media (min-width: 1025px) {
    html:not([data-device]) body.on-friends-page #page-friends,
    html:not([data-device]) body.on-friends-page #page-dm {
      display: flex !important; opacity: 1 !important; transform: none !important;
      position: fixed; top: 104px; bottom: 0; z-index: 50;
      background: var(--surface); overflow: hidden;
    }
    html:not([data-device]) body.on-friends-page #page-friends { left: 0; width: 360px; border-right: 1px solid var(--border); }
    html:not([data-device]) body.on-friends-page #page-dm { left: 360px; right: 0; }
    html:not([data-device]) body.on-friends-page .dm-empty-state { display: flex; }
  }
  html[data-device="desktop"] body.on-friends-page #page-friends,
  html[data-device="desktop"] body.on-friends-page #page-dm {
    display: flex !important; opacity: 1 !important; transform: none !important;
    position: fixed; top: 104px; bottom: 0; z-index: 50;
    background: var(--surface); overflow: hidden;
  }
  html[data-device="desktop"] body.on-friends-page #page-friends { left: 0; width: 360px; border-right: 1px solid var(--border); }
  html[data-device="desktop"] body.on-friends-page #page-dm { left: 360px; right: 0; }
  html[data-device="desktop"] body.on-friends-page .dm-empty-state { display: flex; }
  @media (min-width: 1025px) {
    html:not([data-device]) body.on-friends-page .dm-back-btn,
    html:not([data-device]) body.on-friends-page .friends-back-btn { display: none; }
  }
  html[data-device="desktop"] body.on-friends-page .dm-back-btn,
  html[data-device="desktop"] body.on-friends-page .friends-back-btn { display: none; }

  .profile-view-avatar {
    width: 64px; height: 64px; border-radius: 50%; background: var(--accent2);
    display: flex; align-items: center; justify-content: center; margin: 0 auto;
    font-family: var(--mono); font-size: 20px; color: var(--text);
    position: relative;
  }
  .profile-view-code {
    font-family: var(--mono); font-size: 16px; letter-spacing: 0.06em; color: var(--accent);
    font-weight: 700; margin-top: 6px; cursor: pointer;
  }

  /* ── OWNER ACCOUNT: gold frame, crown badge, OWNER tag, ban button ── */
  .owner-frame {
    box-shadow: 0 0 0 2px var(--bg), 0 0 0 4px #d4af37, 0 0 12px rgba(212,175,55,0.55) !important;
  }
  .owner-crown {
    position: absolute; bottom: -3px; right: -3px; font-size: 11px; line-height: 1;
    background: radial-gradient(circle at 30% 30%, #f6e2a0, #d4af37 70%);
    border-radius: 50%; width: 16px; height: 16px; min-width: 16px;
    display: flex; align-items: center; justify-content: center;
    box-shadow: 0 0 6px rgba(212,175,55,0.85), 0 0 0 1px rgba(0,0,0,0.35);
    pointer-events: none;
  }
  .profile-view-avatar .owner-crown { width: 22px; height: 22px; font-size: 14px; bottom: 0; right: 0; }
  .owner-tag {
    display: inline-block; font-family: var(--mono); font-size: 8.5px; font-weight: 700;
    letter-spacing: 0.08em; padding: 1.5px 7px; border-radius: 20px;
    background: linear-gradient(135deg, #f4d675, #b8862f); color: #2a1e05;
    vertical-align: middle; white-space: nowrap;
  }
  .owner-ban-btn {
    font-family: var(--mono); font-size: 10px; letter-spacing: 0.06em; text-transform: uppercase;
    padding: 7px 14px; border-radius: 5px; cursor: pointer; transition: all 0.15s;
    border: 1px solid var(--red); background: transparent; color: var(--red);
  }
  .owner-ban-btn:hover { background: var(--red); color: #fff; }
  .owner-ban-btn.is-banned { border-color: var(--green); color: var(--green); }
  .owner-ban-btn.is-banned:hover { background: var(--green); color: #fff; }

  /* ── DIRECT MESSAGE PAGE ── */
  .dm-avatar {
    width: 32px; height: 32px; border-radius: 50%; background: var(--accent2);
    display: flex; align-items: center; justify-content: center;
    font-family: var(--mono); font-size: 11px; color: var(--text); flex-shrink: 0; margin-right: 10px;
  }
  .dm-share-btn {
    flex-shrink: 0; width: 40px; height: 40px; border-radius: 3px;
    background: var(--bg); border: 1px solid var(--border2); color: var(--accent);
    font-size: 17px; cursor: pointer; transition: all 0.15s; display:flex; align-items:center; justify-content:center;
  }
  .dm-share-btn:hover { border-color: var(--accent); background: var(--accent-glow); }
  .dm-song-card {
    display: flex; align-items: center; gap: 10px; margin-top: 6px;
    background: var(--bg); border: 1px solid var(--border2); border-left: 3px solid var(--accent);
    border-radius: 6px; padding: 10px 12px; cursor: pointer; transition: all 0.15s; max-width: 320px;
  }
  .dm-song-card:hover { border-color: var(--accent); }
  .dm-song-card .dsc-note { font-size: 16px; color: var(--accent); flex-shrink: 0; }
  .dm-song-card .dsc-info { min-width: 0; }
  .dm-song-card .dsc-title { font-family: var(--serif); font-size: 13px; font-weight: 700; color: var(--text); overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
  .dm-song-card .dsc-artist { font-family: var(--mono); font-size: 10px; color: var(--muted); margin-top: 2px; }
  .dm-song-tag { font-family: var(--mono); font-size: 9px; letter-spacing: 0.08em; text-transform: uppercase; color: var(--accent2); margin-bottom: 3px; }

  /* Song share picker */
  .song-share-list { max-height: 320px; overflow-y: auto; display: flex; flex-direction: column; gap: 6px; margin-top: 14px; }
  .song-share-row {
    display: flex; align-items: center; gap: 10px; padding: 9px 10px;
    border: 1px solid var(--border); border-radius: 6px; cursor: pointer; transition: all 0.15s;
  }
  .song-share-row:hover { border-color: var(--accent); background: color-mix(in oklab, var(--accent) 6%, transparent); }
  .song-share-row .ssr-title { font-family: var(--serif); font-size: 13px; font-weight: 700; color: var(--text); }
  .song-share-row .ssr-artist { font-family: var(--mono); font-size: 10px; color: var(--muted); }

  /* ── song uploader credit (on cards + in the song modal) ── */
  .song-card-uploader { font-family: var(--mono); font-size: 10px; color: var(--muted); margin-top: 4px; letter-spacing: 0.03em; cursor: pointer; width: fit-content; }
  .song-card-uploader:hover { color: var(--accent); text-decoration: underline; }
  .song-uploader-row { display: flex; align-items: center; gap: 8px; margin-top: 10px; cursor: pointer; width: fit-content; }
  .song-uploader-row .user-badge-pfp, .song-uploader-row .user-badge-pfp-fallback { width: 22px; height: 22px; }
  .song-uploader-row .user-badge-pfp-fallback { font-size: 9px; }
  .song-uploader-label { font-family: var(--mono); font-size: 10px; color: var(--muted); letter-spacing: 0.05em; }
  .song-uploader-name { color: var(--text); font-weight: 600; }
  .song-uploader-row:hover .song-uploader-name { color: var(--accent); text-decoration: underline; }
  .modal-action-row { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
  .modal-share-btn { display: inline-flex; align-items: center; gap: 8px; margin-top: 20px; font-family: var(--mono); font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase; color: var(--text); background: none; border: 1px solid var(--border2); padding: 10px 20px; cursor: pointer; transition: all 0.18s; }
  .modal-share-btn:hover { border-color: var(--accent); color: var(--accent); }
  .modal-share-btn-top {
    position: absolute; top: 28px; right: 78px;
    display: inline-flex; align-items: center; gap: 7px;
    font-family: var(--mono); font-size: 10px; letter-spacing: 0.1em; text-transform: uppercase;
    color: var(--muted); background: none; border: 1px solid var(--border);
    height: 36px; padding: 0 14px; cursor: pointer; transition: all 0.15s;
  }
  .modal-share-btn-top:hover { border-color: var(--accent); color: var(--accent); }
  .modal-share-btn-top svg { width: 14px; height: 14px; flex-shrink: 0; }

  /* ── bottom sheet (song → friend share picker) ── */
  .sheet-overlay { position: fixed; inset: 0; background: rgba(8,7,12,0.75); z-index: 3200; display: none; align-items: flex-end; justify-content: center; opacity: 0; pointer-events: none; transition: opacity 0.25s; backdrop-filter: blur(6px); }
  .sheet-overlay.open { display: flex; opacity: 1; pointer-events: all; }
  .sheet-panel { background: linear-gradient(180deg, #17142a 0%, var(--surface) 100%); border: 1px solid var(--border2); border-bottom: none; width: 100%; max-width: 520px; max-height: 78vh; border-radius: 18px 18px 0 0; padding: 10px 22px 28px; transform: translateY(100%); transition: transform 0.32s cubic-bezier(0.34,1.56,0.64,1); display: flex; flex-direction: column; box-shadow: 0 -20px 60px rgba(0,0,0,0.55); }
  .sheet-overlay.open .sheet-panel { transform: translateY(0); }
  .sheet-handle { width: 36px; height: 4px; background: var(--border2); border-radius: 2px; margin: 6px auto 16px; flex-shrink: 0; }
  .sheet-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; margin-bottom: 4px; flex-shrink: 0; }
  .sheet-title { font-family: var(--serif); font-size: 19px; font-weight: 700; color: var(--text); }
  .sheet-sub { font-family: var(--mono); font-size: 10px; color: var(--muted); letter-spacing: 0.06em; margin: 4px 0 16px; flex-shrink: 0; }
  .sheet-close { background: none; border: none; color: var(--muted); font-size: 18px; cursor: pointer; line-height: 1; padding: 2px 4px; }
  .sheet-close:hover { color: var(--accent); }
  .sheet-list { overflow-y: auto; display: flex; flex-direction: column; gap: 6px; -webkit-overflow-scrolling: touch; padding-bottom: 4px; }
  .sheet-friend-row { display: flex; align-items: center; gap: 12px; padding: 10px 8px; border-radius: 10px; cursor: pointer; transition: background 0.15s, border-color 0.15s; border: 1px solid transparent; }
  .sheet-friend-row:hover { background: color-mix(in oklab, var(--accent) 8%, transparent); border-color: var(--border2); }
  .sheet-friend-row.sent { opacity: 0.55; pointer-events: none; }
  .sheet-friend-row .user-badge-pfp, .sheet-friend-row .user-badge-pfp-fallback { width: 38px; height: 38px; font-size: 12px; }
  .sheet-friend-name { font-family: var(--mono); font-size: 13px; color: var(--text); font-weight: 600; }
  .sheet-friend-sent-tag { margin-left: auto; font-family: var(--mono); font-size: 9px; letter-spacing: 0.08em; text-transform: uppercase; color: var(--accent); flex-shrink: 0; }
  .sheet-empty { font-family: var(--mono); font-size: 11px; color: var(--muted); padding: 24px 4px; text-align: center; line-height: 1.7; }
  .sheet-empty a { color: var(--accent); cursor: pointer; text-decoration: underline; }

  /* ── PAGE SECTIONS (show/hide) ── */
  .page-section {
    display: none;
    opacity: 0;
    transform: translateY(10px);
  }
  .page-section.active {
    display: block;
    animation: pageIn 0.32s cubic-bezier(0.22,1,0.36,1) forwards;
  }
  @keyframes pageIn {
    from { opacity: 0; transform: translateY(10px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  /* Chat pages behave like a full-screen app view (WhatsApp/Instagram style):
     fixed under the sticky header, stretching down to the bottom nav (mobile)
     or to the bottom of the viewport (tablet/desktop), full width, no card box. */
  #page-chat.active, #page-topic-chat.active, #page-social.active, #page-friends.active, #page-dm.active {
    display: flex;
    flex-direction: column;
    position: fixed;
    top: 60px; left: 0; right: 0; bottom: 0;
    z-index: 50;
    background: var(--surface);
    overflow: hidden;
  }
  @media (max-width: 720px) {
    #page-chat.active, #page-topic-chat.active, #page-social.active, #page-friends.active, #page-dm.active { bottom: calc(58px + env(safe-area-inset-bottom)); }
  }
  /* Above 720px the .subnav-row (Archive/About/Submit/Social links) is visible
     and sits sticky right under the 60px header, so these fixed full-screen
     pages need to start below it too (60px header + 44px subnav row) — otherwise
     their content renders underneath the subnav row and gets clipped/hidden
     behind it. */
  @media (min-width: 721px) {
    #page-chat.active, #page-topic-chat.active, #page-social.active, #page-friends.active, #page-dm.active { top: 104px; }
  }
  /* The admin device-preview toggle can force data-device="mobile" even at a
     wide real viewport, in which case .subnav-row is hidden regardless of
     width — so these pages should stay flush under just the 60px header. */
  [data-device="mobile"] #page-chat.active, [data-device="mobile"] #page-topic-chat.active,
  [data-device="mobile"] #page-social.active, [data-device="mobile"] #page-friends.active,
  [data-device="mobile"] #page-dm.active { top: 60px !important; }
  [data-device="mobile"] #page-chat.active, [data-device="mobile"] #page-topic-chat.active,
  [data-device="mobile"] #page-social.active, [data-device="mobile"] #page-friends.active, [data-device="mobile"] #page-dm.active {
    bottom: calc(58px + env(safe-area-inset-bottom)) !important;
  }
  #page-chat.active #chat-login-wall, #page-social.active #social-login-wall { padding: 24px 20px; }

  /* On-screen keyboard support: the layout viewport doesn't actually shrink or
     pan the way the keyboard does, so a plain position:fixed box (the rule
     above) either leaves a dead gap where the now-hidden bottom nav used to be,
     or ends up scrolled partly out of view behind the keyboard. --vvh/--vv-top
     are kept in sync with window.visualViewport by JS below, and while the
     keyboard is open we pin these pages exactly to that visible area instead. */
  :root { --vvh: 100vh; --vv-top: 0px; }
  body.kb-open #page-chat.active, body.kb-open #page-topic-chat.active,
  body.kb-open #page-social.active, body.kb-open #page-friends.active,
  body.kb-open #page-dm.active {
    top: var(--vv-top, 0px) !important;
    bottom: auto !important;
    height: var(--vvh, 100vh) !important;
  }

  /* ── RATING POP ANIMATION ── */
  @keyframes ratingPop {
    0%   { transform: scale(1); }
    25%  { transform: scale(1.65); }
    50%  { transform: scale(0.82); }
    70%  { transform: scale(1.18); }
    85%  { transform: scale(0.96); }
    100% { transform: scale(1); }
  }
  @keyframes ratingBurst {
    0%   { opacity: 0.55; transform: scale(0.3); }
    100% { opacity: 0; transform: scale(2.2); }
  }
  .rating-note { position: relative; display: inline-flex; }
  .rating-note.pop { animation: ratingPop 0.55s cubic-bezier(0.34, 1.56, 0.64, 1); }
  .rating-note.glow .rating-note-icon { filter: drop-shadow(0 0 8px rgba(200,169,110,0.75)) drop-shadow(0 0 18px rgba(200,169,110,0.45)); }
  .rating-note.pop::after {
    content: '';
    position: absolute; inset: -6px;
    border-radius: 50%;
    background: radial-gradient(circle, var(--accent) 0%, transparent 70%);
    animation: ratingBurst 0.55s ease-out;
    pointer-events: none;
  }

  /* ── PROFILE DROPDOWN ── */
  .profile-dropdown { position: relative; }
  .profile-menu {
    position: absolute; top: calc(100% + 8px); left: 0;
    background: var(--surface); border: 1px solid var(--border2);
    border-radius: 4px; padding: 8px 0; min-width: 200px;
    max-width: calc(100vw - 24px);
    opacity: 0; pointer-events: none; transform: translateY(-4px);
    transition: all 0.2s; z-index: 250;
    box-shadow: 0 12px 32px rgba(0,0,0,0.35);
  }
  .profile-menu.open { opacity: 1; pointer-events: all; transform: translateY(0); }
  .profile-menu-item {
    font-family: var(--mono); font-size: 11px; color: var(--dim);
    padding: 10px 16px; cursor: pointer; transition: all 0.15s;
    display: flex; align-items: center; gap: 10px; border: none; background: none; width: 100%; text-align: left;
  }
  .profile-menu-item:hover { background: var(--card); color: var(--accent); }
  .profile-menu-item .icon { font-size: 14px; width: 20px; text-align: center; }
  .profile-menu-divider { height: 1px; background: var(--border); margin: 6px 0; }
  .profile-menu-header {
    font-family: var(--mono); font-size: 9px; letter-spacing: 0.15em; text-transform: uppercase;
    color: var(--muted); padding: 8px 16px 4px;
  }

  /* ── NOTIFICATION BELL + DROPDOWN ── */
  .notif-bell-wrap { position: relative; }
  .notif-bell-btn {
    position: relative; background: none; border: none; cursor: pointer;
    font-size: 17px; width: 36px; height: 36px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center; color: var(--dim);
    transition: background 0.15s, color 0.15s;
  }
  .notif-bell-btn:hover { background: color-mix(in oklab, var(--accent2) 12%, transparent); color: var(--text); }
  .notif-bell-badge {
    position: absolute; top: 2px; right: 2px; min-width: 15px; height: 15px; padding: 0 3px;
    border-radius: 8px; background: var(--accent2); color: #fff;
    font-family: var(--mono); font-size: 9px; font-weight: 700;
    display: flex; align-items: center; justify-content: center;
  }
  .notif-dropdown {
    position: absolute; top: calc(100% + 8px); right: 0;
    background: var(--surface); border: 1px solid var(--border2);
    border-radius: 10px; width: 320px; max-width: calc(100vw - 24px);
    max-height: 420px; display: flex; flex-direction: column;
    opacity: 0; pointer-events: none; transform: translateY(-4px);
    transition: all 0.2s; z-index: 250;
    box-shadow: 0 12px 32px rgba(0,0,0,0.35);
  }
  .notif-dropdown.open { opacity: 1; pointer-events: all; transform: translateY(0); }
  .notif-dropdown-header {
    display: flex; align-items: center; justify-content: space-between;
    padding: 12px 14px; border-bottom: 1px solid var(--border);
    font-family: var(--sans); font-weight: 700; font-size: 13px; color: var(--text); flex-shrink: 0;
  }
  .notif-mark-read-btn {
    background: none; border: none; color: var(--accent2); cursor: pointer;
    font-family: var(--sans); font-size: 11px; font-weight: 600; padding: 0;
  }
  .notif-mark-read-btn:hover { color: var(--accent); }
  .notif-dropdown-list { overflow-y: auto; padding: 6px; }
  .notif-item {
    display: flex; align-items: flex-start; gap: 10px; padding: 10px; border-radius: 8px;
    cursor: pointer; transition: background 0.15s;
  }
  .notif-item:hover { background: var(--card); }
  .notif-item.unread { background: color-mix(in oklab, var(--accent2) 8%, transparent); }
  .notif-item-icon { font-size: 14px; flex-shrink: 0; margin-top: 1px; }
  .notif-item-text { flex: 1; min-width: 0; }
  .notif-item-title { font-family: var(--sans); font-size: 12.5px; font-weight: 600; color: var(--text); }
  .notif-item-body { font-family: var(--sans); font-size: 11.5px; color: var(--muted); margin-top: 2px; }
  .notif-item-time { font-family: var(--mono); font-size: 9.5px; color: var(--muted); margin-top: 4px; }

  /* ── NOTIFICATION OPT-IN BANNER ── */
  .notif-optin-banner {
    display: none; align-items: center; gap: 14px;
    position: fixed; left: 50%; bottom: 20px; transform: translateX(-50%);
    width: min(92vw, 480px); z-index: 900;
    background: var(--surface); border: 1px solid var(--border2); border-radius: 14px;
    padding: 16px; box-shadow: 0 16px 40px rgba(0,0,0,0.4);
  }
  .notif-optin-icon { font-size: 22px; flex-shrink: 0; }
  .notif-optin-text { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 3px; }
  .notif-optin-text strong { font-family: var(--sans); font-size: 13.5px; color: var(--text); }
  .notif-optin-text span { font-family: var(--sans); font-size: 11.5px; color: var(--muted); line-height: 1.4; }
  .notif-optin-actions { display: flex; flex-direction: column; gap: 6px; flex-shrink: 0; }
  .notif-optin-btn {
    font-family: var(--sans); font-weight: 600; font-size: 11.5px; white-space: nowrap;
    padding: 8px 14px; border-radius: 8px; cursor: pointer; border: 1px solid var(--border2);
    background: transparent; color: var(--dim); transition: all 0.15s;
  }
  .notif-optin-btn.primary { background: var(--accent2); color: #fff; border-color: var(--accent2); }
  .notif-optin-btn.primary:hover { opacity: 0.9; }
  .notif-optin-btn:not(.primary):hover { border-color: var(--accent2); color: var(--accent2); }
  @media (max-width: 560px) {
    .notif-optin-banner { flex-direction: column; align-items: stretch; text-align: center; }
    .notif-optin-actions { flex-direction: row; }
    .notif-optin-actions button { flex: 1; }
  }


  /* ── DEVICE PREVIEW TOGGLE (segmented pill, used inside Settings) ── */
  .device-toggle-btn {
    display: flex; align-items: center; justify-content: center;
    width: 38px; height: 34px;
    border-radius: 100px;
    background: transparent;
    border: none;
    color: var(--muted);
    cursor: pointer;
    transition: color 0.2s, background 0.2s;
    position: relative;
    font-size: 15px;
  }
  .device-toggle-btn.device-mode-active {
    color: var(--bg);
  }
  .device-toggle-btn:hover:not(.device-mode-active) {
    color: var(--text);
  }
  .device-toggle-glider {
    position: absolute;
    top: 4px; left: 4px;
    width: 38px; height: 34px;
    border-radius: 100px;
    background: var(--accent);
    transition: transform 0.28s cubic-bezier(0.4,0,0.2,1);
    z-index: -1;
    box-shadow: 0 2px 8px rgba(200,169,110,0.35);
  }

  /* ── SETTINGS MODAL TABS ── */
  .settings-tabs { display: flex; gap: 4px; background: var(--bg); border: 1px solid var(--border); border-radius: 3px; padding: 4px; margin-bottom: 22px; }
  .settings-tab-btn { flex: 1; font-family: var(--mono); font-size: 10px; letter-spacing: 0.08em; text-transform: uppercase; color: var(--dim); background: transparent; border: none; padding: 9px 6px; cursor: pointer; border-radius: 2px; transition: all 0.15s; text-align: center; }
  .settings-tab-btn:hover { color: var(--accent); }
  .settings-tab-btn.active { background: var(--accent); color: var(--bg); }
  .settings-panel { display: none; }
  .settings-panel.active { display: block; animation: pageIn 0.26s cubic-bezier(0.22,1,0.36,1) forwards; }
  .settings-block-label { font-family: var(--mono); font-size: 9px; letter-spacing: 0.18em; text-transform: uppercase; color: var(--muted); margin-bottom: 6px; }
  .settings-block { background: var(--card); border: 1px solid var(--border); padding: 16px 18px; border-radius: 10px; margin-bottom: 14px; }
  .settings-block .anon-hint { margin-bottom: 14px; }
  .settings-block .anon-hint:last-child { margin-bottom: 0; }
  .settings-toggle-row { display: inline-flex; align-items: center; gap: 12px; cursor: pointer; }
  .settings-toggle-label { font-family: var(--sans); font-size: 13px; color: var(--dim); transition: color 0.2s; }
  .settings-toggle-label.is-on { color: var(--accent); font-weight: 500; }

  /* Instagram-style "Edit profile" pill fields: bordered rounded box with a
     small label sitting above the value, both inside the same box. */
  .pill-field { border: 1.5px solid var(--border2); border-radius: 14px; padding: 10px 16px 9px; margin-bottom: 10px; background: transparent; transition: border-color 0.15s; }
  .pill-field:focus-within { border-color: var(--accent); }
  .pill-field label { display: block; font-family: var(--sans); font-size: 12.5px; color: var(--muted); margin-bottom: 2px; }
  .pill-field input, .pill-field textarea, .pill-field select { width: 100%; background: transparent; border: none; outline: none; color: var(--text); font-family: var(--sans); font-size: 15.5px; padding: 0; }
  .pill-field textarea { min-height: 44px; line-height: 1.5; resize: vertical; font-family: var(--sans); }
  .pill-field select { appearance: none; -webkit-appearance: none; cursor: pointer; padding-right: 20px; }
  .pill-field.pill-select { position: relative; }
  .pill-field.pill-select::after { content: '⌄'; position: absolute; right: 16px; top: 30px; color: var(--muted); font-size: 16px; pointer-events: none; }
  .pill-hint { font-family: var(--mono); font-size: 9.5px; color: var(--muted); letter-spacing: 0.04em; margin: -4px 0 12px 4px; }

  /* ── Themed native <select> dropdown options ──
     Browsers render the closed <select> using our CSS, but the open
     options list is drawn by the OS/browser itself and ignores most
     styling — this is why it showed up as a plain white panel with
     black text, and was unreadable in dark mode. Setting color-scheme
     plus option colors is the most reliable cross-browser way to bring
     the open list in line with the site's palette and fonts. */
  .pill-field select,
  select.form-input,
  .create-room-sheet select {
    color-scheme: dark;
  }
  [data-theme="light"] .pill-field select,
  [data-theme="light"] select.form-input,
  [data-theme="light"] .create-room-sheet select {
    color-scheme: light;
  }
  .pill-field select option,
  select.form-input option,
  .create-room-sheet select option {
    background: var(--card);
    color: var(--text);
    font-family: var(--sans);
    font-size: 15px;
    padding: 10px 12px;
  }
  .pill-field select option:checked,
  .pill-field select option:hover,
  .pill-field select option:focus,
  select.form-input option:checked,
  select.form-input option:hover,
  select.form-input option:focus,
  .create-room-sheet select option:checked,
  .create-room-sheet select option:hover,
  .create-room-sheet select option:focus {
    background: var(--accent);
    color: var(--bg);
  }

  .avatar-edit-hero { display: flex; flex-direction: column; align-items: center; text-align: center; margin-bottom: 26px; }
  .avatar-edit-hero .avatar-current, .avatar-edit-hero .avatar-current-fallback { width: 92px; height: 92px; font-size: 26px; margin-bottom: 12px; }
  .avatar-edit-link { font-family: var(--sans); font-size: 14px; color: var(--accent2); cursor: pointer; font-weight: 600; background: none; border: none; }
  .avatar-edit-link:hover { text-decoration: underline; }
  .avatar-edit-picker { max-height: 0; overflow: hidden; transition: max-height 0.25s ease; width: 100%; }
  .avatar-edit-picker.open { max-height: 320px; margin-top: 16px; }
  .avatar-edit-picker .avatar-grid { justify-content: center; }

  /* Profile stats row (joined / time on site) */
  .profile-stats { display: flex; gap: 10px; }
  .profile-stat { flex: 1; }
  .profile-stat .stat-label { font-family: var(--mono); font-size: 8.5px; letter-spacing: 0.14em; text-transform: uppercase; color: var(--muted); margin-bottom: 4px; }
  .profile-stat .stat-value { font-family: var(--mono); font-size: 13px; color: var(--text); }

  /* Avatar picker (user-facing, choose from admin-uploaded avatars only) */
  .avatar-picker-row { display: flex; align-items: center; gap: 14px; margin-bottom: 18px; }

  /* ── IG-STYLE FULL-PAGE HEADER (Profile / Edit Profile) ── */
  .ig-page-header {
    display: flex; align-items: center; gap: 18px;
    padding: 18px 20px 16px;
    position: sticky; top: 60px; z-index: 5;
    background: var(--header-bg);
    backdrop-filter: blur(20px) saturate(180%);
    -webkit-backdrop-filter: blur(20px) saturate(180%);
    border-bottom: 1px solid var(--border);
  }
  .ig-page-header .ig-back-btn {
    background: none; border: none; color: var(--text); font-size: 22px;
    cursor: pointer; padding: 4px; line-height: 1; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
    transition: color 0.15s, transform 0.15s;
  }
  .ig-page-header .ig-back-btn:hover { color: var(--accent); transform: translateX(-2px); }
  .ig-page-header .ig-page-title { font-family: var(--serif); font-size: 24px; font-weight: 700; color: var(--text); flex: 1; min-width: 0; }
  .ig-page-header .ig-header-action {
    font-family: var(--mono); font-size: 11px; letter-spacing: 0.06em; text-transform: uppercase;
    color: var(--accent); background: none; border: none; cursor: pointer; padding: 6px 4px; flex-shrink: 0;
  }
  .ig-header-action:hover { text-decoration: underline; }

  .ig-page-body { max-width: 560px; margin: 0 auto; padding: 32px 20px 48px; }

  /* ── FULL-PAGE PROFILE VIEW ── */
  .pv-hero { display: flex; flex-direction: column; align-items: center; text-align: center; margin-bottom: 28px; }
  .pv-avatar, .pv-avatar-fallback {
    width: 104px; height: 104px; border-radius: 50%; object-fit: cover;
    border: 2px solid var(--accent); background: var(--surface); margin-bottom: 16px;
  }
  .pv-avatar-fallback { display: flex; align-items: center; justify-content: center; font-family: var(--mono); font-size: 30px; color: var(--muted); }
  .pv-name { font-family: var(--serif); font-size: 26px; font-weight: 700; color: var(--text); }
  .pv-username { font-family: var(--mono); font-size: 13px; color: var(--accent); margin-top: 4px; }
  .pv-pronouns { font-family: var(--sans); font-size: 12px; color: var(--muted); margin-top: 2px; }
  .pv-bio { font-family: var(--sans); font-size: 14px; line-height: 1.6; color: var(--dim); margin-top: 14px; max-width: 420px; white-space: pre-wrap; }
  .pv-genre-pill { display: inline-block; margin-top: 12px; font-family: var(--mono); font-size: 10px; letter-spacing: 0.06em; text-transform: uppercase; color: var(--accent2); background: rgba(200,169,110,0.1); border: 1px solid var(--accent2); padding: 5px 12px; border-radius: 100px; }

  .pv-actions { display: flex; gap: 10px; margin: 22px 0 8px; }
  .pv-actions button {
    flex: 1; font-family: var(--mono); font-size: 11px; letter-spacing: 0.06em; text-transform: uppercase;
    padding: 11px 10px; border-radius: 10px; cursor: pointer; transition: all 0.15s;
  }
  .pv-actions .pv-edit-btn { background: var(--accent); color: var(--bg); border: 1px solid var(--accent); font-weight: 600; }
  .pv-actions .pv-edit-btn:hover { background: transparent; color: var(--accent); }
  .pv-actions .pv-share-btn { background: transparent; color: var(--text); border: 1px solid var(--border2); }
  .pv-actions .pv-share-btn:hover { border-color: var(--accent); color: var(--accent); }

  .pv-stats { display: flex; gap: 10px; margin: 24px 0; }
  .pv-stat { flex: 1; background: var(--card); border: 1px solid var(--border); border-radius: 12px; padding: 12px 10px; text-align: center; }
  .pv-stat .stat-label { font-family: var(--mono); font-size: 8px; letter-spacing: 0.12em; text-transform: uppercase; color: var(--muted); margin-bottom: 5px; }
  .pv-stat .stat-value { font-family: var(--mono); font-size: 15px; color: var(--text); font-weight: 600; }

  .pv-section { margin-top: 30px; }
  .pv-section-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px; }
  .pv-section-head h3 { font-family: var(--serif); font-size: 17px; font-weight: 700; color: var(--text); }
  .pv-section-head .pv-see-all { font-family: var(--mono); font-size: 10px; letter-spacing: 0.05em; text-transform: uppercase; color: var(--accent); cursor: pointer; background: none; border: none; }
  .pv-see-all:hover { text-decoration: underline; }
  .pv-empty { font-family: var(--mono); font-size: 11px; color: var(--muted); text-align: center; padding: 20px 0; }
  .pv-saved-grid { display: flex; flex-direction: column; gap: 8px; }

  /* Save/bookmark button on song cards */
  .card-top-actions { display: flex; flex-direction: column; align-items: flex-end; gap: 10px; flex-shrink: 0; }
  .song-save-btn {
    width: 30px; height: 30px; border-radius: 50%;
    background: var(--card); flex-shrink: 0;
    border: 1px solid var(--border2); color: var(--muted);
    display: flex; align-items: center; justify-content: center;
    font-size: 14px; line-height: 1; cursor: pointer; transition: all 0.15s;
    box-shadow: 0 2px 6px rgba(0,0,0,0.18);
  }
  .song-save-btn:hover { border-color: var(--accent); color: var(--accent); transform: scale(1.08); }
  .song-save-btn.saved { color: var(--accent); border-color: var(--accent); background: rgba(200,169,110,0.16); }
  .avatar-current { width: 56px; height: 56px; border-radius: 50%; object-fit: cover; border: 2px solid var(--accent); background: var(--surface); flex-shrink: 0; }
  .avatar-current-fallback { width: 56px; height: 56px; border-radius: 50%; border: 2px solid var(--border2); background: var(--surface); flex-shrink: 0; display: flex; align-items: center; justify-content: center; font-family: var(--mono); font-size: 18px; color: var(--muted); }
  .avatar-grid { display: flex; flex-wrap: wrap; gap: 10px; max-height: 168px; overflow-y: auto; padding: 2px; }
  .avatar-option { width: 46px; height: 46px; border-radius: 50%; object-fit: cover; cursor: pointer; border: 2px solid transparent; transition: all 0.15s; opacity: 0.7; }
  .avatar-option:hover { opacity: 1; border-color: var(--border2); }
  .avatar-option.selected { opacity: 1; border-color: var(--accent); box-shadow: 0 0 0 2px var(--accent); }
  .avatar-none-option { width: 46px; height: 46px; border-radius: 50%; border: 2px dashed var(--border2); display: flex; align-items: center; justify-content: center; cursor: pointer; font-size: 14px; color: var(--muted); transition: all 0.15s; }
  .avatar-none-option:hover, .avatar-none-option.selected { border-color: var(--accent); color: var(--accent); }

  /* Forced avatar picker — shown once right after signup. Deliberately a separate
     overlay class from .auth-overlay so a stray closeAuth() call can never dismiss it. */
  .forced-overlay { position: fixed; inset: 0; background: rgba(8,7,12,0.95); z-index: 3600; display: none; align-items: center; justify-content: center; padding: 24px; opacity: 0; pointer-events: none; transition: opacity 0.25s; backdrop-filter: blur(10px); overflow-y: auto; }
  .forced-overlay.open { display: flex; opacity: 1; pointer-events: all; }
  .forced-overlay .auth-modal { transform: translateY(20px) scale(0.97); transition: transform 0.28s cubic-bezier(0.34,1.56,0.64,1); text-align: center; }
  .forced-overlay.open .auth-modal { transform: translateY(0) scale(1); }
  .forced-overlay .auth-modal-sub { text-align: left; }
  .forced-avatar-grid { display: flex; flex-wrap: wrap; gap: 16px; justify-content: center; margin: 4px 0 20px; }
  .forced-avatar-grid .avatar-option { width: 64px; height: 64px; }

  /* Admin avatar upload grid */
  .admin-avatar-grid { display: flex; flex-wrap: wrap; gap: 28px 14px; margin-bottom: 24px; }
  .admin-avatar-item { position: relative; width: 64px; height: 64px; }
  .admin-avatar-item img { width: 64px; height: 64px; border-radius: 50%; object-fit: cover; border: 1px solid var(--border2); }
  .admin-avatar-item .remove-avatar-btn { position: absolute; top: -6px; right: -6px; width: 20px; height: 20px; border-radius: 50%; background: var(--red); color: #fff; border: none; font-size: 11px; line-height: 1; cursor: pointer; display: flex; align-items: center; justify-content: center; }
  .admin-avatar-item .avatar-gender-badge { position: absolute; bottom: -6px; left: 50%; transform: translateX(-50%); font-family: var(--mono); font-size: 8px; font-weight: 700; letter-spacing: 0.05em; padding: 1px 6px; border-radius: 20px; white-space: nowrap; border: 1px solid var(--border2); background: var(--bg); color: var(--dim); }
  .admin-avatar-item .avatar-gender-badge.badge-female { color: var(--accent2); border-color: var(--accent2); }
  .admin-avatar-item .avatar-gender-badge.badge-male { color: var(--accent); border-color: var(--accent); }
  .admin-avatar-item .avatar-gender-badge.badge-any { color: var(--muted); }

  /* Device toggle, restyled as an inline panel control (used inside Settings) */
  .device-toggle-panel { display: flex; align-items: center; gap: 2px; background: var(--surface); border: 1px solid var(--border2); border-radius: 100px; padding: 4px; position: relative; width: max-content; }
  .device-toggle-panel .device-toggle-glider { position: absolute; top: 4px; left: 4px; width: 38px; height: 34px; border-radius: 100px; background: var(--accent); transition: transform 0.28s cubic-bezier(0.4,0,0.2,1); z-index: 0; box-shadow: 0 2px 8px rgba(200,169,110,0.35); }
  .device-toggle-panel .device-toggle-btn { position: relative; z-index: 1; }

  /* ── BOTTOM MOBILE NAV BAR ── */
  .bottom-nav {
    display: none;
    position: fixed;
    left: 50%;
    bottom: calc(14px + env(safe-area-inset-bottom));
    transform: translateX(-50%);
    z-index: 200;
    width: calc(100% - 24px);
    max-width: 460px;
    background: var(--header-bg);
    backdrop-filter: blur(20px) saturate(180%);
    -webkit-backdrop-filter: blur(20px) saturate(180%);
    border: 1px solid var(--border2);
    border-radius: 22px;
    padding: 7px;
    align-items: stretch;
    justify-content: space-around;
    gap: 3px;
    box-shadow: 0 10px 32px rgba(0,0,0,0.45), 0 2px 8px rgba(0,0,0,0.3);
  }
  .bottom-nav-item {
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    gap: 3px;
    flex: 1;
    min-width: 0;
    background: none; border: none;
    color: var(--muted);
    font-family: var(--mono); font-size: 9px; letter-spacing: 0.04em; text-transform: uppercase;
    text-decoration: none;
    padding: 7px 2px;
    border-radius: 15px;
    cursor: pointer;
    position: relative;
    transition: color 0.15s, transform 0.16s cubic-bezier(0.34,1.56,0.64,1), background 0.15s;
  }
  .bottom-nav-item + .bottom-nav-item::before {
    content: "";
    position: absolute;
    left: -2px;
    top: 20%;
    bottom: 20%;
    width: 1px;
    background: var(--border);
  }
  .bottom-nav-item .bn-icon { font-size: 18px; line-height: 1; transition: transform 0.16s cubic-bezier(0.34,1.56,0.64,1); }
  .bottom-nav-item span.bn-label { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 100%; }
  .bottom-nav-item.active, .bottom-nav-item:active { color: var(--accent); background: var(--card); }
  .bottom-nav-item.active .bn-icon { transform: scale(1.12); }
  .bottom-nav-item:active { transform: scale(0.94); }
  .bottom-nav-item .bn-badge { position: relative; top: -8px; left: 9px; width: 6px; height: 6px; border-radius: 50%; background: var(--accent2); display: none; }

  @media (max-width: 900px) {
    .hero-inner { grid-template-columns: 1fr; gap: 24px; }
    .hero-vinyl-side { display: none; }
  }
  @media (max-width: 720px) {
    .bottom-nav { display: flex; }
    body { padding-bottom: calc(76px + env(safe-area-inset-bottom)); }
    body.on-chat-page .bottom-nav { display: none !important; }
    body.on-chat-page { padding-bottom: 0 !important; }
  }
  [data-device="mobile"] .bottom-nav { display: flex !important; }
  [data-device="mobile"] body { padding-bottom: calc(76px + env(safe-area-inset-bottom)) !important; }
  [data-device="mobile"] body.on-chat-page .bottom-nav { display: none !important; }
  [data-device="mobile"] body.on-chat-page { padding-bottom: 0 !important; }
  [data-device="tablet"] .bottom-nav { display: none !important; }
  [data-device="desktop"] .bottom-nav { display: none !important; }

  /* ── DEVICE MODE OVERRIDES ── */
  [data-device="mobile"] .song-grid { grid-template-columns: 1fr !important; }
  [data-device="mobile"] .hero { padding: 60px 20px 40px !important; min-height: auto !important; }
  [data-device="mobile"] .archive-section { padding: 32px 20px 48px !important; }
  [data-device="mobile"] .mood-section { padding: 40px 20px 0 !important; }
  [data-device="mobile"] .about-strip { grid-template-columns: 1fr !important; padding: 40px 20px !important; gap: 32px !important; }
  [data-device="mobile"] .chat-layout { grid-template-columns: 1fr !important; }
  [data-device="mobile"] .admin-grid { grid-template-columns: 1fr !important; }
  [data-device="mobile"] .admin-stats-strip { grid-template-columns: repeat(2, 1fr) !important; }
  [data-device="mobile"] .admin-nav { flex-direction: row !important; flex-wrap: wrap !important; overflow-x: visible !important; position: static !important; }
  [data-device="mobile"] .admin-nav-item { flex: 1 1 auto !important; justify-content: center !important; }
  [data-device="mobile"] .admin-nav-group-label { display: none !important; }
  [data-device="mobile"] .admin-song-row:not(.select-mode) { flex-direction: column !important; align-items: flex-start !important; gap: 12px !important; }
  [data-device="mobile"] .admin-song-row:not(.select-mode) .actions { width: 100% !important; flex-wrap: wrap !important; }
  [data-device="mobile"] .submit-form { grid-template-columns: 1fr !important; }
  [data-device="mobile"] .modal-header { padding: 24px 20px 18px !important; }
  [data-device="mobile"] .modal-body { padding: 24px 20px !important; }
  [data-device="mobile"] .hero-meta { gap: 20px !important; flex-wrap: wrap !important; }
  [data-device="mobile"] nav { display: none !important; }
  [data-device="mobile"] .subnav-row { display: none !important; }
  [data-device="mobile"] header { padding: 0 14px !important; }
  [data-device="mobile"] .logo { font-size: 13px !important; }
  [data-device="mobile"] .header-left { gap: 8px !important; }
  [data-device="mobile"] .header-right { gap: 8px !important; }
  [data-device="mobile"] .theme-toggle-wrap { gap: 0 !important; }
  [data-device="mobile"] .theme-toggle-wrap .theme-icon { display: none !important; }
  [data-device="mobile"] .theme-switch { width: 34px !important; height: 20px !important; }
  [data-device="mobile"] #sys-btn { display: none !important; }
  [data-device="mobile"] .notif-bell-wrap { display: flex !important; align-items: center !important; }
  [data-device="mobile"] .notif-bell-btn { width: 30px !important; height: 30px !important; font-size: 15px !important; }
  [data-device="mobile"] .user-badge { padding: 3px 6px 3px 3px !important; gap: 4px !important; }
  [data-device="mobile"] .user-badge-pfp, [data-device="mobile"] .user-badge-pfp-fallback { width: 22px !important; height: 22px !important; }
  [data-device="mobile"] .user-badge .anon-name { max-width: 58px !important; overflow: hidden !important; text-overflow: ellipsis !important; white-space: nowrap !important; font-size: 10.5px !important; }
  [data-device="mobile"] .profile-chevron { display: none !important; }
  [data-device="mobile"] .auth-bar { gap: 6px !important; }
  [data-device="mobile"] .auth-btn { padding: 6px 10px !important; font-size: 9px !important; }
  [data-device="mobile"] .footer-donate-btn { align-self: flex-start !important; }
  [data-device="mobile"] .rating-wrap { flex-wrap: wrap !important; }
  [data-device="mobile"] .admin-form { grid-template-columns: 1fr !important; }
  [data-device="mobile"] .footer-copy { text-align: left !important; }
  [data-device="mobile"] footer { flex-direction: column !important; align-items: flex-start !important; }

  [data-device="tablet"] .song-grid { grid-template-columns: repeat(2, 1fr) !important; }
  [data-device="tablet"] .hero { padding: 60px 32px 48px !important; }
  [data-device="tablet"] .archive-section { padding: 40px 32px 60px !important; }
  [data-device="tablet"] .mood-section { padding: 48px 32px 0 !important; }
  [data-device="tablet"] .about-strip { grid-template-columns: 1fr !important; padding: 48px 32px !important; gap: 40px !important; }
  [data-device="tablet"] .chat-layout { grid-template-columns: 1fr !important; }
  [data-device="tablet"] .admin-grid { grid-template-columns: 200px 1fr !important; }
  [data-device="tablet"] .submit-form { grid-template-columns: 1fr 1fr !important; }
  [data-device="tablet"] .modal-header { padding: 28px 28px 22px !important; }
  [data-device="tablet"] .modal-body { padding: 28px 28px !important; }
  [data-device="tablet"] .hero-meta { gap: 28px !important; }
  [data-device="tablet"] nav { display: flex !important; }
  [data-device="tablet"] .admin-form { grid-template-columns: 1fr 1fr !important; }
  [data-device="tablet"] .footer-copy { text-align: right !important; }
  [data-device="tablet"] footer { flex-direction: row !important; align-items: center !important; }

  [data-device="desktop"] .song-grid { grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)) !important; }
  [data-device="desktop"] .hero { padding: 80px 48px 60px !important; min-height: 92vh !important; }
  [data-device="desktop"] .archive-section { padding: 48px 48px 80px !important; }
  [data-device="desktop"] .mood-section { padding: 64px 48px 0 !important; }
  [data-device="desktop"] .about-strip { grid-template-columns: 1fr 1fr !important; padding: 64px 48px !important; gap: 64px !important; }
  [data-device="desktop"] .chat-layout { grid-template-columns: 1fr !important; }
  [data-device="desktop"] .admin-grid { grid-template-columns: 240px 1fr !important; }
  [data-device="desktop"] .submit-form { grid-template-columns: 1fr 1fr !important; }
  [data-device="desktop"] .modal-header { padding: 36px 40px 28px !important; }
  [data-device="desktop"] .modal-body { padding: 36px 40px !important; }
  [data-device="desktop"] .hero-meta { gap: 40px !important; }
  [data-device="desktop"] nav { display: flex !important; }
  [data-device="desktop"] .admin-form { grid-template-columns: 1fr 1fr !important; }
  [data-device="desktop"] .footer-copy { text-align: right !important; }
  [data-device="desktop"] footer { flex-direction: row !important; align-items: center !important; }

  /* ── REAL TABLET BREAKPOINT ──
     Mirrors the [data-device="tablet"] preview rules above, but applies to
     actual tablet-sized browsers/windows (not just the admin device preview
     toggle). Without this, real tablets fell into the plain desktop styles,
     which are too wide for the viewport and caused content/header to get
     cut off or crowd together. */
  @media (min-width: 721px) and (max-width: 1024px) {
    .song-grid { grid-template-columns: repeat(2, 1fr); }
    .hero { padding: 56px 28px 44px; }
    .archive-section, .submit-section, .admin-section { padding: 40px 28px 60px; }
    .mood-section { padding: 44px 28px 0; }
    .about-strip { grid-template-columns: 1fr; padding: 48px 28px; gap: 40px; }
    .chat-layout { grid-template-columns: 1fr; }
    .admin-grid { grid-template-columns: 200px 1fr; }
    .submit-form { grid-template-columns: 1fr 1fr; }
    .modal-header { padding: 28px 26px 22px; }
    .modal-body { padding: 24px 26px; }
    .hero-meta { gap: 22px; flex-wrap: wrap; }
    .footer-copy { text-align: right; }
    footer { flex-direction: row; align-items: center; }

    /* Header: everything on desktop (logo + full nav + theme toggle +
       donate + auth/profile) doesn't fit a tablet-width viewport at full
       size, which was causing the nav/profile controls to crowd, clip, or
       overlap. Shrink gaps/padding so it all fits on one line. */
    header { padding: 0 18px; }
    .logo { font-size: 12.5px; }
    nav#desktop-nav { gap: 14px; }
    nav a { font-size: 9.5px; }
    .header-left, .header-right { gap: 8px; }
    .theme-toggle-wrap { gap: 5px; }
    .theme-icon { font-size: 12px; }
    .theme-switch { width: 38px; height: 21px; }
    .theme-switch .theme-track::before { width: 15px; height: 15px; }
    .theme-switch input:checked + .theme-track::before { transform: translateX(17px); }
    #sys-btn { padding: 3px 5px; font-size: 8px; }
    .auth-bar { gap: 6px; }
    .auth-btn { padding: 6px 10px; font-size: 9px; }
    .user-badge { padding: 4px 8px 4px 4px; gap: 6px; }
    .user-badge .anon-name { max-width: 90px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  }

  /* ── RESPONSIVE ── */
  @media (max-width: 720px) {
    header { padding: 0 12px; }
    .subnav-row { display: none; }
    .logo { font-size: 13px; }
    nav#desktop-nav { display: none; }
    .header-left, .header-right { gap: 6px; }
    .theme-toggle-wrap { gap: 0; }
    .theme-toggle-wrap .theme-icon { display: none; }
    .theme-switch { width: 34px; height: 20px; }
    .theme-track::before { width: 14px; height: 14px; }
    .theme-switch input:checked + .theme-track::before { transform: translateX(14px); }
    #sys-btn { display: none; }
    .auth-btn { padding: 6px 8px; font-size: 9px; }
    .notif-bell-btn { width: 30px; height: 30px; font-size: 15px; }
    .user-badge { padding: 3px 6px 3px 3px; gap: 4px; }
    .user-badge-pfp, .user-badge-pfp-fallback { width: 22px; height: 22px; }
    .user-badge .anon-name { max-width: 58px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 10.5px; }
    .profile-chevron { display: none; }
    .hero { padding: 56px 20px 44px; }
    .hero h1 { letter-spacing: -0.02em; }
    .mood-section { padding: 40px 20px 0; }
    .archive-section, .submit-section, .admin-section { padding: 36px 20px 56px; }
    .about-strip { grid-template-columns: 1fr; gap: 36px; padding: 44px 20px; }
    footer { padding: 24px 20px; flex-direction: column; align-items: flex-start; gap: 12px; }
    .footer-copy { text-align: left; }
    .modal { border-radius: 14px 14px 0 0; max-width: 100%; margin-top: auto; }
    .modal-overlay { align-items: flex-end; padding: 0; }
    .modal-header { padding: 24px 20px 16px; }
    .modal-body { padding: 20px 20px 28px; }
    .modal-share-btn-top { top: 20px; right: 62px; height: 32px; padding: 0 10px; font-size: 0; gap: 0; }
    .modal-share-btn-top svg { width: 15px; height: 15px; }
    .close-btn { top: 20px; right: 20px; width: 32px; height: 32px; }
    .modal-eyebrow { flex-wrap: wrap; row-gap: 6px; padding-right: 82px; }
    .modal-title { font-size: 28px; }
    .hero-meta { gap: 20px; flex-wrap: wrap; }
    .song-grid { grid-template-columns: 1fr; gap: 12px; }
    .rating-wrap { flex-wrap: wrap; }
    .submit-form { grid-template-columns: 1fr; }
    .chat-layout { grid-template-columns: 1fr; }
    .admin-grid { grid-template-columns: 1fr; }
    .admin-form { grid-template-columns: 1fr !important; }
    .admin-stats-strip { grid-template-columns: repeat(2, 1fr); gap: 10px; }
    .admin-stat-card { padding: 14px 16px; gap: 4px; }
    .admin-stat-card .stat-num { font-size: 22px; }
    .admin-stat-card .stat-lbl { font-size: 8.5px; }
    .admin-nav { flex-direction: row; flex-wrap: wrap; gap: 6px; position: static; }
    .admin-nav-item { flex: 1 1 auto; justify-content: center; font-size: 10px; padding: 9px 8px; white-space: nowrap; }
    .admin-nav-group-label { display: none; }
    .admin-song-row:not(.select-mode) { flex-direction: column; align-items: flex-start; gap: 12px; }
    .admin-song-row:not(.select-mode) .actions { width: 100%; flex-wrap: wrap; }
    .admin-song-row:not(.select-mode) .actions button { flex: 1 1 auto; min-width: 84px; }
    .auth-bar { gap: 4px; }
  }  @media (max-height: 700px) {
    .auth-overlay, .donate-overlay { align-items: flex-start; padding-top: 20px; padding-bottom: 20px; }
    .auth-modal, .donate-modal { max-height: none; }
  }

  /* ---- Floating toast notifications (replaces window.alert popups) ---- */
  #toast-stack {
    position: fixed;
    top: 22px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 99999;
    display: flex;
    flex-direction: column;
    gap: 10px;
    align-items: center;
    pointer-events: none;
    width: min(92vw, 420px);
  }
  .toast {
    pointer-events: auto;
    width: 100%;
    background: var(--bg);
    border: 1px solid var(--accent);
    border-radius: 8px;
    box-shadow: 0 12px 32px rgba(0,0,0,0.35), 0 0 0 1px rgba(200,169,110,0.06);
    padding: 16px 18px;
    display: flex;
    align-items: flex-start;
    gap: 12px;
    opacity: 0;
    transform: translateY(-14px) scale(0.98);
    transition: opacity 0.28s ease, transform 0.28s ease;
  }
  .toast.toast-show { opacity: 1; transform: translateY(0) scale(1); }
  .toast.toast-hide { opacity: 0; transform: translateY(-10px) scale(0.98); }
  .toast-icon {
    flex-shrink: 0;
    width: 22px; height: 22px;
    border-radius: 50%;
    background: rgba(200,169,110,0.14);
    color: var(--accent);
    display: flex; align-items: center; justify-content: center;
    font-family: var(--mono);
    font-size: 12px;
    margin-top: 1px;
  }
  .toast.toast-error .toast-icon { background: rgba(200,90,90,0.14); color: #c85a5a; }
  .toast.toast-error { border-color: #c85a5a; }
  .toast-body { flex: 1; min-width: 0; }
  .toast-msg { font-family: var(--sans); font-size: 13px; line-height: 1.55; color: var(--text); font-weight: 300; }
  .toast-close {
    flex-shrink: 0;
    background: none; border: none; cursor: pointer;
    color: var(--muted); font-size: 15px; line-height: 1;
    padding: 2px; margin-top: 1px;
    transition: color 0.15s;
  }
  .toast-close:hover { color: var(--accent); }
  @media (max-width: 640px) {
    #toast-stack { top: 12px; width: 94vw; }
    .toast { padding: 14px 14px; }
  }

```

---

## `app.js`

```javascript
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

```

---

## `config.js`

```javascript
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

```

---

## `supabase.js`

```javascript
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


```

---

## `songs.js`

```javascript
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

```

---

## `auth.js`

```javascript
//  REAL GOOGLE SIGN-IN (via Supabase Auth)
//  Login-only by design: Google can log someone into an account that
//  already exists (matched by email against a normal email+password
//  signup, or a previously Google-linked account), but it can never
//  create a brand-new account. Someone with no matching account gets
//  signed back out immediately and told to sign up with email first.
//
//  Only works once: (1) Supabase is connected, (2) the Google provider is
//  enabled in that Supabase project with a Google Cloud OAuth client, and
//  (3) the site is served from a real https:// URL matching Supabase's
//  configured Site URL / Redirect URLs. Falls back to the simulated
//  alias-entry modal otherwise (e.g. while testing locally as a file) —
//  that fallback is login-only too, for the same reason.
// ═══════════════════════════════════════════════════════════════

function sanitizeGoogleAlias(rawName) {
  let base = String(rawName || 'user').toLowerCase().replace(/[^a-z0-9_-]/g, '_').replace(/_+/g, '_').replace(/^_|_$/g, '');
  if (base.length < 3) base = (base + '_user').slice(0, 20);
  if (base.length > 20) base = base.slice(0, 20);
  return base;
}

async function startGoogleAuth(intent) {
  if (!isDbConnected()) {
    // No Supabase connection yet — fall back to the simulated flow.
    if (intent === 'admin') { showAdminGoogleFallback(); } else { showGoogleAlias(); }
    return;
  }
  localStorage.setItem('al-google-intent', intent); // 'user' or 'admin', read back after the redirect
  const { error } = await sb.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: window.location.origin + window.location.pathname }
  });
  if (error) {
    showToast('Google sign-in failed to start: ' + error.message + '\n\nMake sure the Google provider is enabled in your Supabase project and this exact URL is added as a Redirect URL there.', {type:'error'});
    localStorage.removeItem('al-google-intent');
  }
}

// Called once on page load. If Supabase just redirected back here after a
// Google login, this picks up the session and finishes signing the person in.
async function handleGoogleAuthCallback() {
  if (!sb) return;
  try {
    const { data: { session } } = await sb.auth.getSession();
    if (!session || !session.user) return;
    const intent = localStorage.getItem('al-google-intent') || 'user';
    localStorage.removeItem('al-google-intent');
    const email = session.user.email;
    const displayName = (session.user.user_metadata && (session.user.user_metadata.full_name || session.user.user_metadata.name)) || (email ? email.split('@')[0] : 'user');

    if (intent === 'admin') {
      const storedEmail = getAdminEmail();
      if (email === storedEmail) {
        currentAdmin = { email: email };
        saveAdmin();
        showPage('admin');
      } else {
        showToast('That Google account (' + email + ') is not the authorized admin email. Set the admin email in Site Settings first if this should be allowed.', {type:'error'});
        await sb.auth.signOut();
      }
    } else {
      let users = JSON.parse(localStorage.getItem('al-users') || '[]');
      // Google is login-only now — it must never be a second way to create an
      // account. Match against an account that's already linked to this exact
      // Google email (a previous successful Google login) OR one that was
      // registered the normal way (email + password) using this same email.
      // If neither matches, sign the person back out of the Supabase session
      // immediately and tell them to sign up first — no account gets created
      // here under any circumstance.
      let account = users.find(u => u.googleEmail === email);
      if (!account) {
        account = users.find(u => (u.email || '').toLowerCase() === (email || '').toLowerCase());
        if (account) {
          // First successful Google login for an existing email/password
          // account — link it so future Google logins match instantly.
          account.googleEmail = email;
          localStorage.setItem('al-users', JSON.stringify(users));
        }
      }
      if (!account) {
        showToast('No account found for ' + email + '. Sign up with your email and password first — then Google sign-in will work for that account.', { type: 'error', duration: 10000 });
        await sb.auth.signOut();
        closeAuth();
        return;
      }
      if (account.blocked) {
        showToast('This account has been blocked by the site owner.', { type: 'error' });
        await sb.auth.signOut();
        closeAuth();
        return;
      }
      currentUser = { name: account.name };
      saveUser();
      closeAuth();
      updateAuthUI();
      updateCommentForm();
      updateSubmitForm();
      await pushUserProfile();
      updateSocialBadge();
    }
  } catch (e) {
    console.error('Google auth callback failed:', e);
  } finally {
    // Clean the #access_token=... hash Supabase leaves in the URL after redirect
    if (window.location.hash.includes('access_token')) {
      history.replaceState(null, '', window.location.pathname + window.location.search);
    }
  }
}

// ═══════════════════════════════════════════════════════════════
function getOwnerUsername() {
  return localStorage.getItem('al-owner-username') || '';
}
function isOwnerName(name) {
  const owner = getOwnerUsername();
  return !!owner && !!name && owner.toLowerCase() === String(name).toLowerCase();
}
// Extra class to splice onto any avatar element's class list.
function ownerFrameClass(name) {
  return isOwnerName(name) ? ' owner-frame' : '';
}
// Small crown badge meant to sit inside a position:relative avatar circle.
function ownerCrownHTML(name) {
  return isOwnerName(name) ? '<span class="owner-crown" title="Site Owner">👑</span>' : '';
}
// Inline gold "OWNER" pill meant to sit next to a username.
function ownerTagHTML(name) {
  return isOwnerName(name) ? '<span class="owner-tag">OWNER</span>' : '';
}
// The signed-in user is allowed to ban/unban if they ARE the owner account.
function currentUserIsOwner() {
  return !!currentUser && isOwnerName(currentUser.name);
}

//  AUTH — USER
// ═══════════════════════════════════════════════════════════════

function showLogin() { closeAuth(); document.getElementById('user-login-overlay').classList.add('open'); document.body.style.overflow='hidden'; }
function showSignup() { closeAuth(); document.getElementById('user-signup-overlay').classList.add('open'); document.body.style.overflow='hidden'; maybeRenderTurnstileWidget('signup'); }
function showAdminLogin() { closeAuth(); document.getElementById('admin-login-overlay').classList.add('open'); document.body.style.overflow='hidden'; }
function closeAuth() {
  document.querySelectorAll('.auth-overlay').forEach(o => o.classList.remove('open'));
  document.body.style.overflow = '';
  document.querySelectorAll('.auth-error').forEach(e => { e.style.display='none'; e.textContent=''; });
}

// User passwords are stored as salted SHA-256 hashes (never plain text), using the
// same hashText() helper used for the admin secrets. The account's own lowercased
// name is used as the salt so identical passwords on different accounts don't
// produce identical hashes.
async function hashUserPassword(name, pass) {
  return hashText(String(name || '').toLowerCase() + ':' + pass);
}

// ── SINGLE-DEVICE SESSION TRACKING (alias+password accounts) ────────────
// See alias_login/alias_signup in the setup SQL. Each successful login gets a
// fresh session_token from the server; this browser remembers the one it was
// given and listens (via Realtime) for its own user_auth row to change. If it
// changes to a different token, another device just logged in as this same
// account — so this one logs itself out and shows a floating notice.
let aliasSessionChannel = null;

function setActiveAliasSession(name, token) {
  if (!token) return;
  localStorage.setItem('al-session-token', token);
  localStorage.setItem('al-session-user', name);
  subscribeAliasSession(name, token);
}

function subscribeAliasSession(username, myToken) {
  if (!sb || !isDbConnected()) return;
  teardownAliasSession(false);
  aliasSessionChannel = sb.channel('alias-session-' + username)
    .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'user_auth', filter: 'username=eq.' + username }, (payload) => {
      const newToken = payload.new && payload.new.session_token;
      if (newToken && newToken !== myToken) handleForcedLogout();
    })
    .subscribe();
}

function teardownAliasSession(clearStorage) {
  if (aliasSessionChannel) { try { sb.removeChannel(aliasSessionChannel); } catch (e) {} aliasSessionChannel = null; }
  if (clearStorage) { localStorage.removeItem('al-session-token'); localStorage.removeItem('al-session-user'); }
}

function handleForcedLogout() {
  teardownAliasSession(true);
  userLogout();
  showToast('You were logged out — this account just signed in on another device.', { type: 'error', duration: 6000 });
}

// Pulls the shared profile fields down from Supabase so a brand-new device
// that has never seen this account before still gets code/bio/gender/avatar.
async function finishAliasLogin(name, token, users, local) {
  try {
    const { data: rows } = await sb.from('users').select('username,code,bio,gender,avatar,blocked').eq('username', name).limit(1);
    const remote = rows && rows[0];
    if (!local) {
      local = { name: name, password: 'cloud', created: Date.now(), avatar: null, gender: '', bio: '', totalSeconds: 0, code: null };
      users.push(local);
    }
    if (remote) {
      local.code = remote.code || local.code;
      local.bio = remote.bio || local.bio;
      local.gender = remote.gender || local.gender;
      local.avatar = remote.avatar || local.avatar;
      // Keep this device's copy of blocked status in sync with the server's —
      // it's the source of truth now (alias_login already rejects blocked
      // logins server-side; this just keeps the local admin/owner UI honest).
      local.blocked = !!remote.blocked;
    }
    localStorage.setItem('al-users', JSON.stringify(users));
  } catch (e) { console.error('Profile pull failed:', e); }
  if (local && local.blocked) { showToast('This account has been blocked by the site owner.', { type: 'error' }); return; }
  currentUser = { name: name };
  saveUser();
  setActiveAliasSession(name, token);
  closeAuth();
  updateAuthUI();
  updateCommentForm();
  updateSubmitForm();
  await pushUserProfile();
  updateSocialBadge();
}

async function handleUserLogin() {
  const name = document.getElementById('ul-name').value.trim();
  const pass = document.getElementById('ul-pass').value;
  const err = document.getElementById('ul-error');
  err.style.display = 'none';
  let users = JSON.parse(localStorage.getItem('al-users') || '[]');
  let local = users.find(u => u.name === name);

  if (isDbConnected()) {
    await ensureAnonSession();
    try {
      const { data: token, error } = await sb.rpc('alias_login', { p_username: name, p_password: pass });
      if (!error && token) { await finishAliasLogin(name, token, users, local); return; }
      // Not in the cloud yet — could be a real invalid login, or an older
      // local-only account made before cross-device sync existed. Only take
      // the local fallback (and silently migrate it to the cloud) if we
      // actually have a matching local record with a matching password.
      if (local && local.password !== 'google_oauth' && local.password !== 'cloud') {
        const enteredHash = await hashUserPassword(local.name, pass);
        if (local.password === enteredHash) {
          if (local.blocked) { err.textContent = 'This account has been blocked by the site owner.'; err.style.display = 'block'; return; }
          try {
            const { data: newToken, error: migrateErr } = await sb.rpc('alias_signup', { p_username: name, p_password: pass });
            if (!migrateErr && newToken) { await finishAliasLogin(name, newToken, users, local); return; }
          } catch (e) { console.error('Cloud migration failed:', e); }
          // Cloud unavailable or name already claimed elsewhere — still let them
          // in locally on this device rather than lock them out entirely.
          currentUser = { name: local.name };
          saveUser(); closeAuth(); updateAuthUI(); updateCommentForm(); updateSubmitForm();
          await pushUserProfile(); updateSocialBadge();
          return;
        }
      }
      err.textContent = (error && error.message) ? error.message : 'Invalid name or password.';
      err.style.display = 'block';
      return;
    } catch (e) {
      err.textContent = 'Could not reach the server — try again.';
      err.style.display = 'block';
      return;
    }
  }

  // Supabase not connected at all — local-only mode, exactly as before.
  // Works only on this device until Supabase is set up.
  const enteredHash = local ? await hashUserPassword(local.name, pass) : null;
  if (!local || local.password !== enteredHash) { err.textContent = 'Invalid name or password.'; err.style.display = 'block'; return; }
  if (local.blocked) { err.textContent = 'This account has been blocked by the site owner.'; err.style.display = 'block'; return; }
  currentUser = { name: local.name };
  saveUser();
  closeAuth();
  updateAuthUI();
  updateCommentForm();
  updateSubmitForm();
  await pushUserProfile();
  updateSocialBadge();
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

async function handleUserSignup() {
  // Honeypot check: real people never see or fill this field. If it has a
  // value, a bot filled the whole form programmatically — bail out quietly
  // without telling the bot anything useful.
  const honeypot = document.getElementById('us-website');
  if (honeypot && honeypot.value.trim() !== '') { return; }
  if (!canAttemptSignupNow()) return;
  const err0 = document.getElementById('us-error');
  if (isTurnstileEnabledCached()) {
    const token = getTurnstileToken('signup');
    if (!token) {
      if (err0) { err0.textContent = 'Please complete the verification check above.'; err0.style.display = 'block'; }
      return;
    }
    const human = await verifyTurnstileToken(token);
    if (!human) {
      if (err0) { err0.textContent = "Verification failed — please retry the check above."; err0.style.display = 'block'; }
      if (window.turnstile && turnstileWidgetIds.signup) turnstile.reset(turnstileWidgetIds.signup);
      return;
    }
  }
  const realName = document.getElementById('us-realname').value.trim();
  const name = document.getElementById('us-name').value.trim();
  const gender = document.getElementById('us-gender').value;
  const email = document.getElementById('us-email').value.trim();
  const pass = document.getElementById('us-pass').value;
  const pass2 = document.getElementById('us-pass2').value;
  const err = document.getElementById('us-error');
  if (!realName || realName.length < 2) { err.textContent = 'Please enter your real name.'; err.style.display='block'; return; }
  if (!isValidAnonName(name)) { err.textContent = 'Anonymous name must be 3–20 chars, alphanumeric/underscore/hyphen only, and not offensive.'; err.style.display='block'; return; }
  if (!gender) { err.textContent = 'Please select a gender.'; err.style.display='block'; return; }
  if (!isValidEmail(email)) { err.textContent = 'Please enter a valid email address.'; err.style.display='block'; return; }
  if (pass.length < 6) { err.textContent = 'Password must be at least 6 characters.'; err.style.display='block'; return; }
  if (pass !== pass2) { err.textContent = 'Passwords do not match.'; err.style.display='block'; return; }
  let users = JSON.parse(localStorage.getItem('al-users') || '[]');
  if (users.find(u => u.name === name)) { err.textContent = 'That anonymous name is already taken.'; err.style.display='block'; return; }
  if (users.find(u => (u.email || '').toLowerCase() === email.toLowerCase())) { err.textContent = 'An account with that email already exists.'; err.style.display='block'; return; }
  // Don't write the account yet — hold it as a pending signup until the
  // email code checks out, so nobody can create an account with an email
  // they don't actually control.
  const passHash = await hashUserPassword(name, pass);
  pendingSignup = {
    // pass (plaintext) is kept only for the 15-min verification window, purely so
    // it can be sent once to alias_signup() for real server-side bcrypt hashing —
    // it's never stored anywhere after handleVerifyEmail() runs, and passHash is
    // still what's used for the local-only fallback path.
    realName: realName, name: name, gender: gender, email: email,
    passHash: passHash, pass: pass, code: generateVerificationCode(), expires: Date.now() + 15 * 60 * 1000
  };
  localStorage.setItem('al-pending-signup', JSON.stringify(pendingSignup));
  closeAuth();
  await sendVerificationEmail(pendingSignup.email, pendingSignup.code, pendingSignup.name);
  showVerifyEmail();
}

function generateVerificationCode() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

// Sends the real verification email via EmailJS (see config.js for setup steps).
// Falls back to the old "show the code on-screen" demo behavior if EmailJS
// hasn't been configured yet, or if the send fails for any reason — so
// signup never gets someone stuck with no way to get their code.
let emailjsInitializedKey = null;
// Prefers whatever's been pasted into the admin panel (Email (OTP) tab, saved
// to localStorage and synced via Supabase site_settings), and falls back to
// the file-based window.AFTERLIGHT_EMAILJS_CONFIG in config.js if the admin
// panel hasn't been used yet — so either setup path works.
function getEmailjsConfig() {
  const local = (typeof localStorage !== 'undefined') ? {
    publicKey: localStorage.getItem('al-emailjs-publickey') || '',
    serviceId: localStorage.getItem('al-emailjs-serviceid') || '',
    templateId: localStorage.getItem('al-emailjs-templateid') || ''
  } : null;
  if (local && local.publicKey && local.serviceId && local.templateId) return local;
  const fileCfg = (typeof window !== 'undefined' && window.AFTERLIGHT_EMAILJS_CONFIG) || null;
  if (!fileCfg || !fileCfg.publicKey || !fileCfg.serviceId || !fileCfg.templateId) return null;
  return fileCfg;
}
function ensureEmailjsInitialized(cfg) {
  if (typeof emailjs === 'undefined') return;
  // Re-init if this is the first time, or if the admin just changed the
  // public key from the panel (which calls resetEmailjsInitState()).
  if (emailjsInitializedKey === cfg.publicKey) return;
  try {
    emailjs.init({ publicKey: cfg.publicKey });
    emailjsInitializedKey = cfg.publicKey;
  } catch (e) {
    console.error('EmailJS init failed:', e);
  }
}
// Called by the admin panel after saving new EmailJS settings, so the next
// send re-initializes with the new public key instead of keeping the old one.
function resetEmailjsInitState() {
  emailjsInitializedKey = null;
}

async function sendVerificationEmail(email, code, name) {
  const cfg = getEmailjsConfig();
  if (!cfg || typeof emailjs === 'undefined') {
    // Not configured (or the SDK failed to load) — keep the flow testable.
    console.log('[AfterLight] Verification code for ' + email + ': ' + code);
    showToast('Demo mode — email sending isn\'t configured yet (Admin → Email (OTP), or config.js), so here is your code directly: ' + code, { duration: 14000 });
    return;
  }
  ensureEmailjsInitialized(cfg);
  try {
    await emailjs.send(cfg.serviceId, cfg.templateId, {
      to_email: email,
      to_name: name || 'there',
      passcode: code
    });
    showToast('Verification code sent to ' + email + ' — check your inbox (and spam folder).');
  } catch (e) {
    console.error('EmailJS send failed:', e);
    // Don't strand the user without their code just because email delivery
    // failed (bad template/service ID, EmailJS outage, monthly quota hit, etc).
    showToast('Couldn\'t email your code (' + (e && e.text ? e.text : 'delivery failed') + ') — here it is directly instead: ' + code, { type: 'error', duration: 14000 });
  }
}

// Called by the "Send Test Email" button on the admin panel's Email (OTP)
// tab, using whatever's currently in the three fields (not necessarily saved
// yet), so the admin can verify their EmailJS setup works before relying on
// it for real signups.
async function sendTestVerificationEmail() {
  const result = document.getElementById('adm-emailjs-test-result');
  const to = (prompt('Send a test verification email to:') || '').trim();
  if (!to) return;
  const cfg = {
    publicKey: (document.getElementById('adm-emailjs-publickey').value || '').trim(),
    serviceId: (document.getElementById('adm-emailjs-serviceid').value || '').trim(),
    templateId: (document.getElementById('adm-emailjs-templateid').value || '').trim()
  };
  if (!cfg.publicKey || !cfg.serviceId || !cfg.templateId) {
    if (result) result.textContent = 'Fill in all three fields above first (they don\'t need to be saved yet to test).';
    return;
  }
  if (typeof emailjs === 'undefined') {
    if (result) result.textContent = 'EmailJS SDK failed to load — check your internet connection and reload.';
    return;
  }
  if (result) result.textContent = 'Sending test email…';
  try {
    emailjs.init({ publicKey: cfg.publicKey });
    emailjsInitializedKey = null; // a real send later should still re-init from the saved/cached config
    const testCode = generateVerificationCode();
    await emailjs.send(cfg.serviceId, cfg.templateId, {
      to_email: to,
      to_name: 'there',
      passcode: testCode
    });
    if (result) result.textContent = 'Sent! Check ' + to + ' (and spam) for code ' + testCode + '.';
  } catch (e) {
    console.error('EmailJS test send failed:', e);
    if (result) result.textContent = 'Failed: ' + (e && e.text ? e.text : 'delivery failed') + ' — double check the Service ID and Template ID.';
  }
}

function showVerifyEmail() {
  const disp = document.getElementById('ve-email-display');
  const codeInput = document.getElementById('ve-code');
  const err = document.getElementById('ve-error');
  if (disp && pendingSignup) disp.textContent = pendingSignup.email;
  if (codeInput) codeInput.value = '';
  if (err) { err.style.display = 'none'; err.textContent = ''; }
  document.getElementById('verify-email-overlay').classList.add('open');
  document.body.style.overflow = 'hidden';
  if (codeInput) setTimeout(() => codeInput.focus(), 100);
}

async function resendVerificationCode() {
  if (!pendingSignup) return;
  pendingSignup.code = generateVerificationCode();
  pendingSignup.expires = Date.now() + 15 * 60 * 1000;
  localStorage.setItem('al-pending-signup', JSON.stringify(pendingSignup));
  await sendVerificationEmail(pendingSignup.email, pendingSignup.code, pendingSignup.name);
}

function cancelVerification() {
  pendingSignup = null;
  localStorage.removeItem('al-pending-signup');
  document.getElementById('verify-email-overlay').classList.remove('open');
  document.body.style.overflow = '';
  showSignup();
}

async function handleVerifyEmail() {
  const err = document.getElementById('ve-error');
  err.style.display = 'none';
  if (!canAttemptVerifyNow()) return;
  if (!pendingSignup) {
    err.textContent = 'Your signup session expired. Please sign up again.';
    err.style.display = 'block';
    return;
  }
  if (Date.now() > pendingSignup.expires) {
    err.textContent = 'That code expired. Tap "Resend code" to get a new one.';
    err.style.display = 'block';
    return;
  }
  const entered = document.getElementById('ve-code').value.trim();
  if (entered !== pendingSignup.code) {
    registerFailedVerifyAttempt();
    err.textContent = 'Incorrect code. Double-check it and try again.';
    err.style.display = 'block';
    return;
  }
  resetVerifyAttempts();
  let users = JSON.parse(localStorage.getItem('al-users') || '[]');
  if (users.find(u => u.name === pendingSignup.name)) {
    err.textContent = 'That username was just taken. Please sign up again with a different one.';
    err.style.display = 'block';
    return;
  }
  users.push({
    name: pendingSignup.name, realName: pendingSignup.realName, email: pendingSignup.email,
    password: pendingSignup.passHash, created: Date.now(), avatar: null, gender: pendingSignup.gender,
    bio: '', pronouns: '', favoriteGenre: '', emailVerified: true, totalSeconds: 0,
    code: generateFriendCode(new Set(users.map(u => u.code).filter(Boolean)))
  });
  localStorage.setItem('al-users', JSON.stringify(users));
  currentUser = { name: pendingSignup.name };
  saveUser();
  // Register the real, cross-device account (bcrypt-hashed server-side) if
  // Supabase is connected. If not connected, or if this fails for any reason,
  // the account still works fine on this one device via the local passHash.
  let cloudToken = null;
  if (isDbConnected()) {
    try {
      await ensureAnonSession();
      const { data, error } = await sb.rpc('alias_signup', { p_username: pendingSignup.name, p_password: pendingSignup.pass });
      if (error) throw error;
      cloudToken = data;
    } catch (e) {
      console.error('Cloud account setup failed — this account will only work on this device until Supabase is set up:', e.message);
    }
  }
  pendingSignup = null;
  localStorage.removeItem('al-pending-signup');
  if (cloudToken) setActiveAliasSession(currentUser.name, cloudToken);
  document.getElementById('verify-email-overlay').classList.remove('open');
  document.body.style.overflow = '';
  updateAuthUI();
  updateCommentForm();
  updateSubmitForm();
  await pushUserProfile();
  updateSocialBadge();
  showToast('Email verified — welcome to the archive!');
  showForcedAvatarPicker();
}

function handleGoogleLogin() { startGoogleAuth('user'); }

function showGoogleAlias() {
  closeAuth();
  document.getElementById('google-alias-overlay').classList.add('open');
  document.body.style.overflow = 'hidden';
  const input = document.getElementById('ga-name');
  if (input) { input.value = ''; input.focus(); }
}

function submitGoogleAlias() {
  const input = document.getElementById('ga-name');
  const err = document.getElementById('ga-error');
  const name = input ? input.value.trim() : '';
  if (!isValidAnonName(name)) { err.textContent = 'Invalid name.'; err.style.display = 'block'; return; }
  let users = JSON.parse(localStorage.getItem('al-users') || '[]');
  const existing = users.find(u => u.name === name);
  // Google is login-only — this fallback (used only while Supabase isn't
  // connected, so there's no real email to check) can no longer create a
  // brand-new account either. It only continues if this alias already
  // belongs to an account previously linked via Google sign-in.
  if (!existing || existing.password !== 'google_oauth') {
    err.textContent = 'No Google-linked account found for that name. Sign up with email and password first, then Google sign-in will work for that account.';
    err.style.display = 'block';
    return;
  }
  if (existing.blocked) {
    err.textContent = 'This account has been blocked by the site owner.';
    err.style.display = 'block';
    return;
  }
  currentUser = { name: name };
  saveUser();
  closeAuth();
  updateAuthUI();
  updateCommentForm();
  updateSubmitForm();
  pushUserProfile();
  updateSocialBadge();
}

function userLogout() {
  teardownAliasSession(true);
  currentUser = null;
  saveUser();
  updateAuthUI();
  updateCommentForm();
  updateSubmitForm();
  stopSocialPolling();
  dmActiveFriend = null;
  updateSocialBadge();
}

function userPfpHTML(name) {
  const users = JSON.parse(localStorage.getItem('al-users') || '[]');
  const record = users.find(u => u.name === name);
  const chosen = record && record.avatar ? getAvatars().find(a => a.id === record.avatar) : null;
  if (chosen) return `<img class="user-badge-pfp" src="${chosen.src}" alt="">`;
  return `<span class="user-badge-pfp user-badge-pfp-fallback">${escapeHtml(name.slice(0, 2).toUpperCase())}</span>`;
}

function updateAuthUI() {
  const bar = document.getElementById('auth-bar');
  if (currentUser) {
    bar.innerHTML = `
      <div class="profile-dropdown">
        <div class="user-badge" onclick="toggleProfileMenu(event)" style="cursor:pointer;">
          ${userPfpHTML(currentUser.name)}
          <span class="anon-name">${escapeHtml(currentUser.name)}</span>
          ${ownerTagHTML(currentUser.name)}
          <span class="profile-chevron" style="font-size:9px;color:var(--muted);">▼</span>
        </div>
        <div class="profile-menu" id="profile-menu">
          <div class="profile-menu-header">@${escapeHtml(currentUser.name)} ${ownerTagHTML(currentUser.name)}</div>
          <div class="profile-menu-divider"></div>
          <button class="profile-menu-item" onclick="closeProfileMenu();showPage('profile')">
            <span class="icon">☻</span> Profile
          </button>
          <button class="profile-menu-item" onclick="closeProfileMenu();openUserSettings()">
            <span class="icon">⚙</span> Site Settings
          </button>
          <button class="profile-menu-item open-donate-btn" onclick="closeProfileMenu()">
            <span class="icon">♡</span> Donate
          </button>
          <div class="profile-menu-divider"></div>
          <button class="profile-menu-item" onclick="userLogout()">
            <span class="icon" style="color:var(--red);">↪</span> <span style="color:var(--red);">Log out</span>
          </button>
        </div>
      </div>
    `;
  } else {
    bar.innerHTML = `
      <button class="auth-btn" id="btn-login" onclick="showLogin()">Log In</button>
      <button class="auth-btn primary" id="btn-signup" onclick="showSignup()">Sign Up</button>
    `;
  }
  updateBottomNavAccount();
  syncNotificationsForCurrentUser();
}

function updateBottomNavAccount() {
  const icon = document.querySelector('#bottom-nav-account .bn-icon');
  const label = document.getElementById('bottom-nav-account-label');
  if (!icon || !label) return;
  if (currentUser) {
    icon.textContent = '☻';
    label.textContent = 'Profile';
  } else {
    icon.textContent = '⚙';
    label.textContent = 'Log In';
  }
}

function openUserSettings() {
  // Close the profile menu
  const menu = document.getElementById('profile-menu');
  if (menu) menu.classList.remove('open');
  // Open the site-settings overlay
  document.getElementById('user-settings-overlay').classList.add('open');
  document.body.style.overflow = 'hidden';
  updateDeviceModeUI();
  updateNotifSettingsToggleUI();
}

function closeUserSettings() {
  document.getElementById('user-settings-overlay').classList.remove('open');
  document.body.style.overflow = '';
}

function openEditProfilePage() {
  if (!currentUser) return;
  pendingAvatarSelection = undefined;
  trackUsage(); // flush latest time before showing stats
  showPage('edit-profile');
  renderUserSettings();
}

function renderProfilePage() {
  if (!currentUser) { showPage('home'); return; }
  trackUsage();
  const record = getCurrentUserRecord() || {};

  const avatarWrap = document.getElementById('pv-avatar-wrap');
  const chosen = record.avatar ? getAvatars().find(a => a.id === record.avatar) : null;
  avatarWrap.innerHTML = chosen
    ? `<img class="pv-avatar" src="${chosen.src}" alt="">`
    : `<div class="pv-avatar-fallback">${escapeHtml(currentUser.name.slice(0, 2).toUpperCase())}</div>`;

  document.getElementById('pv-name').innerHTML = escapeHtml(record.realName || currentUser.name) + ' ' + ownerTagHTML(currentUser.name);
  document.getElementById('pv-username').textContent = '@' + currentUser.name;
  document.getElementById('pv-pronouns').textContent = record.pronouns || '';
  document.getElementById('pv-bio').textContent = record.bio || '';
  const genreWrap = document.getElementById('pv-genre-wrap');
  genreWrap.innerHTML = record.favoriteGenre ? `<span class="pv-genre-pill">${escapeHtml(record.favoriteGenre)}</span>` : '';

  document.getElementById('pv-stat-joined').textContent = record.created ? new Date(record.created).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : '—';
  document.getElementById('pv-stat-usage').textContent = formatUsageTime(record.totalSeconds);
  document.getElementById('pv-stat-code').textContent = record.code || getUserCode(currentUser.name) || '—';

  const friends = getFriendsList();
  const friendsList = document.getElementById('pv-friends-list');
  friendsList.innerHTML = friends.length
    ? friends.slice(0, 6).map(n => friendRowHTML(n, null)).join('')
    : '<p class="pv-empty">No friends yet — head to Social to find people.</p>';

  const saved = getSavedSongNumbers();
  const savedWrap = document.getElementById('pv-saved-songs');
  if (saved.length === 0) {
    savedWrap.innerHTML = '<p class="pv-empty">No saved songs yet — tap the ♡ on any song to save it here.</p>';
  } else {
    savedWrap.innerHTML = saved.map(num => {
      const song = songs.find(s => s.number === num);
      if (!song) return '';
      const mood = MOOD_MAP[song.mood] || MOOD_MAP['3am'];
      return `<div class="dm-song-card" onclick="openSongModalByNumber('${escapeHtml(song.number)}')">
        <div class="dsc-note">♪</div>
        <div class="dsc-info">
          <div class="dsc-title">${escapeHtml(song.title)}</div>
          <div class="dsc-artist">${escapeHtml(song.artist)} · <span style="color:${mood.color}">${escapeHtml(mood.label)}</span></div>
        </div>
      </div>`;
    }).join('');
  }
}

async function shareProfile() {
  if (!currentUser) return;
  const record = getCurrentUserRecord() || {};
  const code = record.code || getUserCode(currentUser.name) || '';
  const text = `Check out my AfterLight:404 profile — @${currentUser.name}${code ? ' (' + code + ')' : ''}`;
  if (navigator.share) {
    try { await navigator.share({ title: 'AfterLight:404', text }); return; } catch (e) { /* cancelled */ return; }
  }
  try {
    await navigator.clipboard.writeText(text);
    showToast('Profile info copied!');
  } catch (e) {
    showToast(text);
  }
}

function getCurrentUserRecord() {
  if (!currentUser) return null;
  const users = JSON.parse(localStorage.getItem('al-users') || '[]');
  return users.find(u => u.name === currentUser.name) || null;
}

function getSavedSongNumbers() {
  const record = getCurrentUserRecord();
  return (record && Array.isArray(record.saved)) ? record.saved : [];
}

function isSongSaved(number) {
  return getSavedSongNumbers().includes(number);
}

function toggleSaveSong(number, btnEl) {
  if (!currentUser) { showLogin(); return; }
  let users = JSON.parse(localStorage.getItem('al-users') || '[]');
  const idx = users.findIndex(u => u.name === currentUser.name);
  if (idx === -1) return;
  const saved = Array.isArray(users[idx].saved) ? users[idx].saved.slice() : [];
  const pos = saved.indexOf(number);
  let nowSaved;
  if (pos === -1) { saved.push(number); nowSaved = true; }
  else { saved.splice(pos, 1); nowSaved = false; }
  users[idx] = { ...users[idx], saved: saved };
  localStorage.setItem('al-users', JSON.stringify(users));
  if (btnEl) {
    btnEl.classList.toggle('saved', nowSaved);
    btnEl.textContent = nowSaved ? '♥' : '♡';
  }
  showToast(nowSaved ? 'Saved to your profile' : 'Removed from saved');
  const profilePage = document.getElementById('page-profile');
  if (profilePage && profilePage.classList.contains('active')) renderProfilePage();
}

const DEFAULT_AVATARS = [
  {id:"default-f1", gender:"female", src:"data:image/jpeg;base64,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"},
  {id:"default-f2", gender:"female", src:"data:image/jpeg;base64,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"},
  {id:"default-f3", gender:"female", src:"data:image/jpeg;base64,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"},
  {id:"default-f4", gender:"female", src:"data:image/jpeg;base64,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"},
  {id:"default-m1", gender:"male", src:"data:image/jpeg;base64,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"},
  {id:"default-m2", gender:"male", src:"data:image/jpeg;base64,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"},
  {id:"default-m3", gender:"male", src:"data:image/jpeg;base64,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"},
  {id:"default-m4", gender:"male", src:"data:image/jpeg;base64,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"},
  {id:"default-m5", gender:"male", src:"data:image/jpeg;base64,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"},
  {id:"default-m6", gender:"male", src:"data:image/jpeg;base64,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"},
  {id:"default-m7", gender:"male", src:"data:image/jpeg;base64,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"},
  {id:"default-m8", gender:"male", src:"data:image/jpeg;base64,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"},
];

// Returns the full avatar library: [{id, src, gender}], gender is 'male' | 'female' | 'any'.
// On first run (nobody has touched al-avatars yet) this seeds the 12 built-in avatars so
// there's something to pick from immediately; the admin can add more or remove any of
// these later from Admin → Avatars, same as their own uploads.
function getAvatars() {
  const raw = localStorage.getItem('al-avatars');
  if (raw === null) {
    localStorage.setItem('al-avatars', JSON.stringify(DEFAULT_AVATARS));
    return DEFAULT_AVATARS.slice();
  }
  try { return JSON.parse(raw) || []; } catch (e) { return []; }
}

// Avatars a given gender should see: their own gender's avatars plus any tagged 'any'.
// Falls back to the full library if that combination comes up empty (e.g. no gender
// selected, or the admin hasn't tagged anything yet for that gender) so nobody ever
// gets stuck looking at an empty picker.
function getAvatarsForGender(gender) {
  const all = getAvatars();
  // Owner privilege: no gender filtering, full library always unlocked.
  if (currentUserIsOwner()) return all;
  if (!gender) return all;
  const matched = all.filter(a => a.gender === gender || a.gender === 'any' || !a.gender);
  return matched.length ? matched : all;
}

function formatUsageTime(totalSeconds) {
  totalSeconds = totalSeconds || 0;
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  if (hours > 0) return hours + 'h ' + minutes + 'm';
  if (minutes > 0) return minutes + 'm';
  return '< 1m';
}

// Username changes are capped at 2 per rolling 30-day window. Each user
// record keeps a `nameChangeLog` array of timestamps (ms); only entries
// from the last 30 days count toward the cap.
const USERNAME_CHANGE_LIMIT = 2;
const USERNAME_CHANGE_WINDOW_MS = 30 * 24 * 60 * 60 * 1000;

function getRecentNameChanges(record) {
  const log = (record && record.nameChangeLog) || [];
  const cutoff = Date.now() - USERNAME_CHANGE_WINDOW_MS;
  return log.filter(ts => ts > cutoff);
}

function getUsernameChangeStatus(record) {
  const recent = getRecentNameChanges(record).sort((a, b) => a - b);
  const remaining = Math.max(0, USERNAME_CHANGE_LIMIT - recent.length);
  const nextAvailable = recent.length >= USERNAME_CHANGE_LIMIT
    ? new Date(recent[0] + USERNAME_CHANGE_WINDOW_MS)
    : null;
  return { remaining, nextAvailable, allowed: remaining > 0 };
}

function renderUserSettings() {
  if (!currentUser) return;
  const record = getCurrentUserRecord() || {};
  const display = document.getElementById('settings-username-display');
  if (display) display.textContent = '@' + currentUser.name;
  const codeBox = document.getElementById('settings-your-code');
  if (codeBox) codeBox.innerHTML = yourCodeBoxHTML(record.code);
  const nameInput = document.getElementById('settings-name');
  if (nameInput) nameInput.value = currentUser.name;

  const realNameInput = document.getElementById('settings-realname');
  if (realNameInput) realNameInput.value = record.realName || '';

  const limitEl = document.getElementById('settings-name-limit');
  if (limitEl) {
    const status = getUsernameChangeStatus(record);
    if (status.allowed) {
      limitEl.textContent = `You can change your username ${status.remaining} more time${status.remaining === 1 ? '' : 's'} this month.`;
    } else {
      limitEl.textContent = `Username change limit reached. You can change it again on ${status.nextAvailable.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}.`;
    }
  }

  const joinedEl = document.getElementById('settings-joined-display');
  if (joinedEl) joinedEl.textContent = record.created ? new Date(record.created).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : '—';

  const usageEl = document.getElementById('settings-usage-display');
  if (usageEl) usageEl.textContent = formatUsageTime(record.totalSeconds);

  const genderEl = document.getElementById('settings-gender');
  if (genderEl) genderEl.value = record.gender || '';

  const bioEl = document.getElementById('settings-bio');
  if (bioEl) bioEl.value = record.bio || '';
  const bioCount = document.getElementById('settings-bio-count');
  if (bioCount) bioCount.textContent = (record.bio || '').length;

  const pronounsEl = document.getElementById('settings-pronouns');
  const pronounsCustomEl = document.getElementById('settings-pronouns-custom');
  const pronounsCustomWrapEl = document.getElementById('settings-pronouns-custom-wrap');
  if (pronounsEl) {
    const known = ['', 'she/her', 'he/him', 'they/them'];
    const val = record.pronouns || '';
    if (val && !known.includes(val)) {
      pronounsEl.value = 'custom';
      if (pronounsCustomEl) pronounsCustomEl.value = val;
      if (pronounsCustomWrapEl) pronounsCustomWrapEl.style.display = 'block';
    } else {
      pronounsEl.value = val;
      if (pronounsCustomEl) pronounsCustomEl.value = '';
      if (pronounsCustomWrapEl) pronounsCustomWrapEl.style.display = 'none';
    }
  }
  const genreEl = document.getElementById('settings-genre');
  if (genreEl) genreEl.value = record.favoriteGenre || '';

  renderAvatarPicker(record.avatar || null);
}

function toggleAvatarEditPicker() {
  const picker = document.getElementById('avatar-edit-picker');
  if (picker) picker.classList.toggle('open');
}

function renderAvatarPicker(selectedAvatarId) {
  const selected = pendingAvatarSelection !== undefined ? pendingAvatarSelection : selectedAvatarId;
  const genderEl = document.getElementById('settings-gender');
  const record = getCurrentUserRecord() || {};
  const gender = genderEl ? genderEl.value : (record.gender || '');
  const avatars = getAvatarsForGender(gender);
  const grid = document.getElementById('settings-avatar-grid');
  const hint = document.getElementById('settings-avatar-hint');

  if (grid) {
    if (avatars.length === 0) {
      grid.innerHTML = '';
      if (hint) hint.textContent = 'No profile pictures have been uploaded by the site owner yet — check back soon!';
    } else {
      if (hint) hint.textContent = 'Choose from the profile pictures uploaded by the site owner.';
      grid.innerHTML = `
        <div class="avatar-none-option ${!selected ? 'selected' : ''}" title="No avatar" onclick="pickAvatar(null)">✕</div>
        ${avatars.map(a => `<img class="avatar-option ${selected === a.id ? 'selected' : ''}" src="${a.src}" title="Select" onclick="pickAvatar('${a.id}')">`).join('')}
      `;
    }
  }

  const preview = document.getElementById('settings-avatar-preview');
  const fallback = document.getElementById('settings-avatar-preview-fallback');
  const chosen = selected ? getAvatars().find(a => a.id === selected) : null;
  if (chosen && preview && fallback) {
    preview.src = chosen.src;
    preview.style.display = 'block';
    fallback.style.display = 'none';
  } else if (preview && fallback) {
    preview.style.display = 'none';
    fallback.style.display = 'flex';
    fallback.textContent = currentUser ? currentUser.name.slice(0, 2).toUpperCase() : '?';
  }
}

function pickAvatar(avatarId) {
  pendingAvatarSelection = avatarId;
  renderAvatarPicker(avatarId);
}

// Shown once, right after a brand-new account is created. Blocks the rest of the
// site until the person picks a profile picture — no close button, no backdrop
// dismiss — matching the same admin-provided-photos-only rule as the settings
// picker, just filtered to their chosen gender (plus anything marked Unisex).
function showForcedAvatarPicker() {
  const record = getCurrentUserRecord() || {};
  const avatars = getAvatarsForGender(record.gender || '');
  const grid = document.getElementById('forced-avatar-grid');
  const subtitle = document.getElementById('fa-subtitle');
  const skipBtn = document.getElementById('fa-skip-btn');
  const err = document.getElementById('fa-error');
  const usernameDisplay = document.getElementById('fa-username-display');
  const bioEl = document.getElementById('fa-bio');
  const bioCount = document.getElementById('fa-bio-count');
  const pronounsEl = document.getElementById('fa-pronouns');
  const pronounsCustomEl = document.getElementById('fa-pronouns-custom');
  const genreEl = document.getElementById('fa-genre');
  if (!grid || !subtitle || !skipBtn) return;
  err.style.display = 'none';
  profileSetupSelectedAvatar = record.avatar || null;

  if (usernameDisplay) usernameDisplay.textContent = currentUser ? currentUser.name : '';
  if (bioEl) { bioEl.value = record.bio || ''; if (bioCount) bioCount.textContent = bioEl.value.length; }
  if (pronounsEl) {
    const known = ['', 'she/her', 'he/him', 'they/them'];
    const val = record.pronouns || '';
    if (val && !known.includes(val)) {
      pronounsEl.value = 'custom';
      if (pronounsCustomEl) { pronounsCustomEl.value = val; pronounsCustomEl.style.display = 'block'; }
    } else {
      pronounsEl.value = val;
      if (pronounsCustomEl) { pronounsCustomEl.value = ''; pronounsCustomEl.style.display = 'none'; }
    }
  }
  if (genreEl) genreEl.value = record.favoriteGenre || '';

  if (avatars.length === 0) {
    // Nothing to choose from at all (admin hasn't uploaded anything yet) —
    // don't trap the person with zero options. Let them through and they
    // can set the rest of their profile now, and pick an avatar later once
    // some exist.
    grid.innerHTML = '';
    subtitle.textContent = "The site owner hasn't added any profile pictures yet, so you can finish the rest of your profile now and pick one later from Settings.";
  } else {
    subtitle.textContent = "Almost there — pick an avatar and tell people a bit about yourself. You can change any of this later from your profile settings.";
    grid.innerHTML = avatars.map(a => `<img class="avatar-option${profileSetupSelectedAvatar === a.id ? ' selected' : ''}" src="${a.src}" title="Select" onclick="selectProfileSetupAvatar('${a.id}')">`).join('');
  }
  skipBtn.style.display = 'block';

  document.getElementById('forced-avatar-overlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function selectProfileSetupAvatar(avatarId) {
  profileSetupSelectedAvatar = avatarId;
  document.querySelectorAll('#forced-avatar-grid .avatar-option').forEach(img => img.classList.remove('selected'));
  const grid = document.getElementById('forced-avatar-grid');
  const avatars = getAvatarsForGender((getCurrentUserRecord() || {}).gender || '');
  const idx = avatars.findIndex(a => a.id === avatarId);
  if (grid && idx > -1 && grid.children[idx]) grid.children[idx].classList.add('selected');
}

async function saveProfileSetup() {
  if (!currentUser) return;
  const err = document.getElementById('fa-error');
  const record = getCurrentUserRecord() || {};
  const avatars = getAvatarsForGender(record.gender || '');
  if (avatars.length > 0 && !profileSetupSelectedAvatar) {
    err.textContent = 'Pick an avatar to continue, or tap "Skip for now".';
    err.style.display = 'block';
    return;
  }
  const bio = (document.getElementById('fa-bio').value || '').trim().slice(0, 300);
  const pronounsSelect = document.getElementById('fa-pronouns').value;
  const pronounsCustom = (document.getElementById('fa-pronouns-custom').value || '').trim();
  const pronouns = pronounsSelect === 'custom' ? pronounsCustom : pronounsSelect;
  const favoriteGenre = (document.getElementById('fa-genre').value || '').trim().slice(0, 80);

  let users = JSON.parse(localStorage.getItem('al-users') || '[]');
  const idx = users.findIndex(u => u.name === currentUser.name);
  if (idx === -1) return;
  users[idx] = { ...users[idx], avatar: profileSetupSelectedAvatar || users[idx].avatar, bio: bio, pronouns: pronouns, favoriteGenre: favoriteGenre };
  localStorage.setItem('al-users', JSON.stringify(users));
  closeForcedAvatarPicker();
  await pushUserProfile();
  showToast('Profile saved!');
  const editProfilePage = document.getElementById('page-edit-profile');
  if (editProfilePage && editProfilePage.classList.contains('active')) renderUserSettings();
}

function skipForcedAvatar() {
  closeForcedAvatarPicker();
}

function closeForcedAvatarPicker() {
  document.getElementById('forced-avatar-overlay').classList.remove('open');
  document.body.style.overflow = '';
  profileSetupSelectedAvatar = null;
}

function saveUserSettings() {
  const newName = document.getElementById('settings-name').value.trim();
  const err = document.getElementById('settings-error');
  const ok = document.getElementById('settings-ok');
  err.style.display = 'none'; ok.style.display = 'none';

  if (!isValidAnonName(newName)) {
    err.textContent = 'Name must be 3–20 chars, alphanumeric/underscore/hyphen, and not offensive.';
    err.style.display = 'block'; return;
  }

  let users = JSON.parse(localStorage.getItem('al-users') || '[]');
  const oldName = currentUser.name;
  const isRenaming = newName !== oldName;
  const currentRecord = users.find(u => u.name === oldName) || {};

  if (isRenaming) {
    const status = getUsernameChangeStatus(currentRecord);
    if (!status.allowed) {
      err.textContent = `You've already changed your username ${USERNAME_CHANGE_LIMIT} times this month. You can change it again on ${status.nextAvailable.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}.`;
      err.style.display = 'block';
      document.getElementById('settings-name').value = oldName;
      return;
    }
  }

  const existing = users.find(u => u.name === newName);
  if (existing && isRenaming) {
    err.textContent = 'That username is already taken.'; err.style.display = 'block'; return;
  }

  const gender = document.getElementById('settings-gender').value;
  const bio = document.getElementById('settings-bio').value.trim().slice(0, 300);
  const realName = document.getElementById('settings-realname').value.trim().slice(0, 60);
  const pronounsSelect = document.getElementById('settings-pronouns').value;
  const pronounsCustom = (document.getElementById('settings-pronouns-custom').value || '').trim();
  const pronouns = pronounsSelect === 'custom' ? pronounsCustom : pronounsSelect;
  const favoriteGenre = document.getElementById('settings-genre').value.trim().slice(0, 80);

  let remainingAfterSave = null;
  users = users.map(u => {
    if (u.name !== oldName) return u;
    const updated = { ...u, name: newName, gender: gender, bio: bio, realName: realName, pronouns: pronouns, favoriteGenre: favoriteGenre };
    if (pendingAvatarSelection !== undefined) updated.avatar = pendingAvatarSelection;
    if (isRenaming) {
      const log = getRecentNameChanges(u);
      log.push(Date.now());
      updated.nameChangeLog = log;
      remainingAfterSave = Math.max(0, USERNAME_CHANGE_LIMIT - log.length);
    }
    return updated;
  });
  localStorage.setItem('al-users', JSON.stringify(users));
  currentUser = { name: newName };
  pendingAvatarSelection = undefined;
  saveUser();
  updateAuthUI();
  renderUserSettings();
  pushUserProfile();
  ok.textContent = isRenaming
    ? `✓ Settings saved! (${remainingAfterSave} username change${remainingAfterSave === 1 ? '' : 's'} left this month)`
    : '✓ Settings saved!';
  ok.style.display = 'block';
  setTimeout(() => { ok.style.display = 'none'; }, 2200);
}

// ═══════════════════════════════════════════════════════════════

```

---

## `chat.js`

```javascript
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

```

---

## `profile.js`

```javascript
function backfillFriendCodes() {
  let users = JSON.parse(localStorage.getItem('al-users') || '[]');
  let changed = false;
  const used = new Set(users.map(u => u.code).filter(Boolean));
  users.forEach(u => {
    if (!u.code) {
      u.code = generateFriendCode(used);
      used.add(u.code);
      changed = true;
    }
  });
  if (changed) localStorage.setItem('al-users', JSON.stringify(users));
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
  const users = JSON.parse(localStorage.getItem('al-users') || '[]');
  const u = users.find(x => x.name === name);
  return u ? u.code : null;
}

//  PROFILE DROPDOWN & DEVICE MODE
// ═══════════════════════════════════════════════════════════════

function toggleProfileMenu(e) {
  e.stopPropagation();
  const menu = document.getElementById('profile-menu');
  if (menu) menu.classList.toggle('open');
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
    localStorage.removeItem('al-device-mode');
  } else {
    html.setAttribute('data-device', mode);
    localStorage.setItem('al-device-mode', mode);
  }
  updateDeviceModeUI();
}

function updateDeviceModeUI() {
  const mode = localStorage.getItem('al-device-mode') || 'auto';
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
  const saved = localStorage.getItem('al-device-mode');
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
  return JSON.parse(localStorage.getItem('al-friend-requests') || '[]');
}
function saveFriendRequests(list) {
  localStorage.setItem('al-friend-requests', JSON.stringify(list));
}
function getDmMessages(withUser) {
  const raw = localStorage.getItem('al-dm-' + pairKey(currentUser.name, withUser));
  return raw ? JSON.parse(raw) : [];
}
function saveDmMessages(withUser, msgs) {
  localStorage.setItem('al-dm-' + pairKey(currentUser.name, withUser), JSON.stringify(msgs));
}
function getDmReadMap() {
  return JSON.parse(localStorage.getItem('al-dm-read') || '{}');
}
function markDmRead(withUser) {
  if (!currentUser) return;
  const map = getDmReadMap();
  map[pairKey(currentUser.name, withUser)] = Date.now();
  localStorage.setItem('al-dm-read', JSON.stringify(map));
}
function getDmPreview(withUser) {
  const msgs = getDmMessages(withUser);
  if (!msgs.length) return { text: '', time: 0, unread: 0, mine: false };
  const last = msgs[msgs.length - 1];
  const readMap = getDmReadMap();
  const readAt = readMap[pairKey(currentUser.name, withUser)] || 0;
  const unread = msgs.filter(m => m.from !== currentUser.name && m.time > readAt).length;
  const text = last.songKey ? '🎵 Shared a song' : (last.text || '');
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
  await ensureAnonSession();
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
  const local = JSON.parse(localStorage.getItem('al-users') || '[]');
  return local
    .filter(u => asCode ? u.code === asCode : u.name.toLowerCase().includes(q.toLowerCase()))
    .filter(u => !currentUser || u.name.toLowerCase() !== currentUser.name.toLowerCase())
    .map(u => ({ name: u.name, code: u.code }));
}

async function pullFriendRequests() {
  if (!isDbConnected() || !currentUser) return;
  await ensureAnonSession();
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
  await ensureAnonSession();
  try {
    const key = pairKey(currentUser.name, withUser);
    const { data } = await sb.from('dm_messages').select('*').eq('pair_key', key).order('created_at', { ascending: true });
    if (data) {
      const msgs = data.map(m => ({ id: 'dm_' + m.id, from: m.sender, to: m.recipient, text: m.text, songKey: m.song_key, time: new Date(m.created_at).getTime() }));
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
    const users = JSON.parse(localStorage.getItem('al-users') || '[]');
    const target = users.find(u => u.name === name);
    const banned = !!(target && target.blocked);
    actionsHtml += `<button class="owner-ban-btn${banned ? ' is-banned' : ''}" id="profile-ban-btn" onclick="ownerToggleBanUser('${escapeJs(name)}')">${banned ? 'Unban User' : 'Ban User'}</button>`;
  }
  actionsEl.innerHTML = actionsHtml;

  document.getElementById('user-profile-overlay').classList.add('open');
  document.body.style.overflow = 'hidden';

  let code = knownCode || getUserCode(name) || null;
  let bio = '', gender = '';
  const localRec = JSON.parse(localStorage.getItem('al-users') || '[]').find(u => u.name === name);
  if (localRec) { bio = localRec.bio || ''; gender = localRec.gender || ''; if (!code) code = localRec.code; }
  if (isDbConnected() && (!code || !localRec || showBanControl)) {
    try {
      const { data } = await sb.from('users').select('code,bio,gender,blocked').eq('username', name).limit(1);
      if (data && data[0]) {
        code = code || data[0].code; bio = bio || data[0].bio || ''; gender = gender || data[0].gender || '';
        // Ban button can be stale if the block/unban happened on another device — true
        // it up against the server before the owner acts on it.
        if (showBanControl) {
          let users = JSON.parse(localStorage.getItem('al-users') || '[]');
          const i = users.findIndex(u => u.name === name);
          if (i !== -1) { users[i] = { ...users[i], blocked: !!data[0].blocked }; localStorage.setItem('al-users', JSON.stringify(users)); }
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
  if (!preview) return;
  if (friends.length === 0) {
    preview.innerHTML = '<p class="friends-empty">You haven\'t added any friends yet — head to the Friends tab to find people.</p>';
    return;
  }
  preview.innerHTML = '<div class="friends-block-title">Your Friends</div><div class="friends-list">' +
    friends.slice(0, 6).map(n => friendRowHTML(n, null)).join('') + '</div>';
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
  document.getElementById('friends-messages-tab').style.display = tab === 'messages' ? 'flex' : 'none';
  document.getElementById('friends-requests-tab').style.display = tab === 'requests' ? 'flex' : 'none';
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
    listEl.innerHTML = '<p class="friends-empty">No friends yet — tap ✎ above to add someone.</p>';
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

  document.getElementById('friends-meta').textContent = friends.length + ' friend' + (friends.length === 1 ? '' : 's') +
    (incoming.length ? ' · ' + incoming.length + ' request' + (incoming.length === 1 ? '' : 's') : '');

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
  }, 7000);
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
  markDmRead(name);
  renderMessagesTab();
  pullDmMessages(name).then(() => { renderDmMessages(); markDmRead(name); renderMessagesTab(); });
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
  container.innerHTML = msgs.map(m => {
    const mine = m.from === currentUser.name;
    const sendIn = (m.id === lastSentMsgId) ? 'msg-send-in' : '';
    let bodyHtml;
    if (m.songKey) {
      const song = songs.find(s => s.number === m.songKey);
      if (song) {
        const mood = MOOD_MAP[song.mood] || MOOD_MAP['3am'];
        bodyHtml = `<div class="dm-song-tag">${mine ? 'You shared' : escapeHtml(m.from) + ' shared'} a song</div>
          <div class="dm-song-card" onclick="openSongModalByNumber('${escapeHtml(song.number)}')">
            <div class="dsc-note">♪</div>
            <div class="dsc-info">
              <div class="dsc-title">${escapeHtml(song.title)}</div>
              <div class="dsc-artist">${escapeHtml(song.artist)} · <span style="color:${mood.color}">${escapeHtml(mood.label)}</span></div>
            </div>
          </div>` + (m.text ? `<div class="chat-msg-text" style="margin-top:6px;">${linkifyText(m.text)}</div>` : '');
      } else {
        bodyHtml = `<div class="chat-msg-text" style="font-style:italic;opacity:0.6;">Shared a song that\'s no longer in the archive.</div>`;
      }
    } else {
      bodyHtml = `<div class="chat-msg-text">${linkifyText(m.text)}</div>`;
    }
    return `
    <div class="chat-msg ${sendIn}" style="cursor:default;">
      <div class="chat-msg-avatar${ownerFrameClass(mine ? currentUser.name : m.from)}" onclick="openUserProfileView('${escapeJs(mine ? currentUser.name : m.from)}')" style="cursor:pointer;">${escapeHtml((mine ? currentUser.name : m.from).slice(0,2).toUpperCase())}${ownerCrownHTML(mine ? currentUser.name : m.from)}</div>
      <div class="chat-msg-body">
        <div class="chat-msg-name" onclick="openUserProfileView('${escapeJs(mine ? currentUser.name : m.from)}')" style="cursor:pointer;">${mine ? 'You' : escapeHtml(m.from)} ${ownerTagHTML(mine ? currentUser.name : m.from)}</div>
        ${bodyHtml}
        <div class="chat-msg-time">${new Date(m.time).toLocaleTimeString()}</div>
      </div>
    </div>`;
  }).join('');
  container.scrollTop = container.scrollHeight;
  clearAnimationMarkers();
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

async function sendDmMessage(text, songKey) {
  if (!currentUser || !dmActiveFriend) return;
  if (!canSendMessageNow()) return;
  let finalText = text || '';
  if (finalText) {
    const verdict = await moderateText(finalText, 'dm', pairKey(currentUser.name, dmActiveFriend));
    const moderated = handleModerationVerdict(verdict, finalText);
    if (moderated === null) return;
    finalText = moderated;
  }
  const msgs = getDmMessages(dmActiveFriend);
  const newMsg = { id: 'local_' + Date.now(), from: currentUser.name, to: dmActiveFriend, text: finalText, songKey: songKey || null, time: Date.now() };
  msgs.push(newMsg);
  saveDmMessages(dmActiveFriend, msgs);
  if (isDbConnected()) {
    sb.from('dm_messages').insert({
      pair_key: pairKey(currentUser.name, dmActiveFriend), sender: currentUser.name, recipient: dmActiveFriend,
      text: finalText || null, song_key: songKey || null
    }).then(() => {});
    notifyUser(dmActiveFriend, 'dm', '@' + currentUser.name + ' sent you a message',
      (finalText || (songKey ? 'Shared a song 🎵' : '')).slice(0, 140), 'dm', currentUser.name, currentUser.name);
  }
  lastSentMsgId = newMsg.id;
  renderDmMessages();
  markDmRead(dmActiveFriend);
  renderMessagesTab();
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
  renderComments(idx);
  updateCommentForm();
  const modal = document.getElementById('modal');
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

// ═══════════════════════════════════════════════════════════════

```

---

## `admin.js`

```javascript
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
  const checkbox = document.getElementById('adm-moderation-enabled');
  if (checkbox) checkbox.checked = enabled;
  const status = document.getElementById('adm-moderation-status');
  if (status) {
    if (!isDbConnected()) {
      status.textContent = 'Not connected to Supabase — moderation can\'t run (there\'s no Edge Function to call). Connect a database in the Database tab first.';
    } else {
      status.textContent = enabled
        ? 'Moderation is ON — messages are checked before they post.'
        : 'Moderation is OFF — messages post unchecked. Turn this back on before going public.';
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
  const status = document.getElementById('adm-turnstile-status');
  if (status) {
    if (!enabled) {
      status.textContent = 'Turnstile is OFF — anyone can submit the signup form (honeypot still runs).';
    } else if (!getTurnstileSiteKeyCached()) {
      status.textContent = 'Turnstile is ON but no Site Key is saved yet — add one above or the widget won\'t render.';
    } else if (!isDbConnected()) {
      status.textContent = 'Turnstile is ON, but Supabase isn\'t connected — the verify-turnstile function can\'t be reached, so signups will fail. Connect a database first.';
    } else {
      status.textContent = 'Turnstile is ON — signups require passing the check below the form.';
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
    });
  });
}

function getTurnstileToken(formKey) {
  if (!window.turnstile || !turnstileWidgetIds[formKey]) return null;
  return turnstile.getResponse(turnstileWidgetIds[formKey]) || null;
}

// Calls the verify-turnstile Edge Function (see Admin → Safety & Bots for
// the code to deploy). Fails closed: if it can't be verified, treat as not
// human rather than silently letting the signup through.
async function verifyTurnstileToken(token) {
  if (!isDbConnected() || !sb) return false;
  try {
    const { data, error } = await sb.functions.invoke('verify-turnstile', { body: { token } });
    if (error || !data) return false;
    return !!data.success;
  } catch (e) {
    console.error('Turnstile verification call failed:', e);
    return false;
  }
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
  msgs.splice(idx, 1);
  saveMessages(roomName, msgs);
  viewAdminRoom(roomName);
  renderAdminChat();
}

function adminClearRoom(roomName) {
  if (!confirm('Delete ALL messages in #' + roomName + '? This cannot be undone.')) return;
  saveMessages(roomName, []);
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
  if (tab === 'users') refreshUsersBlockedFromSupabase().then(renderAdminUsers);

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

// Pulls current blocked status for every known user down from Supabase, so the
// admin Users tab reflects blocks/unblocks made from other devices or by the
// site owner, not just whatever this browser last knew locally.
async function refreshUsersBlockedFromSupabase() {
  if (!isDbConnected()) return;
  try {
    const { data: rows } = await sb.from('users').select('username,blocked');
    if (!rows) return;
    const blockedSet = new Set(rows.filter(r => r.blocked).map(r => r.username));
    let users = JSON.parse(localStorage.getItem('al-users') || '[]');
    users = users.map(u => ({ ...u, blocked: blockedSet.has(u.name) }));
    localStorage.setItem('al-users', JSON.stringify(users));
  } catch (e) {
    console.error('Refresh blocked statuses failed:', e);
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
    credit: 'Submitted by ' + sub.submittedBy, spotify: sub.spotify
  };
  songs.push(newSong);

  if (isDbConnected() && sb) {
    try {
      await sb.from('songs').upsert({
        song_key: newSong.number, title: newSong.title, artist: newSong.artist, year: newSong.year,
        mood: newSong.mood, about: newSong.about, meaning: newSong.meaning, lyrics: newSong.lyrics,
        credit: newSong.credit, spotify: newSong.spotify, genre: newSong.genre
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
    spotify: document.getElementById('adm-song-spotify').value
  };
  songs.push(newSong);
  saveSongs();
  if (isDbConnected()) {
    sb.from('songs').upsert({
      song_key: newSong.number, title: newSong.title, artist: newSong.artist, year: newSong.year,
      mood: newSong.mood, about: newSong.about, meaning: newSong.meaning, lyrics: newSong.lyrics,
      fun_fact: newSong.funFact, credit: newSong.credit, spotify: newSong.spotify, genre: newSong.genre
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

```

---
