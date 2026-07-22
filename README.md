# Gyan Dayini Bal Mandir — School Management System

## Files in this package (8 total)
- `index.html` — main app page
- `style.css` — all styling
- `app.js` — all app logic (Firebase, forms, dashboard, etc.)
- `manifest.json` — makes the app installable on phone home screens (PWA)
- `sw.js` — service worker (lets the app open even with no signal)
- `icon-192.png`, `icon-512.png` — app icons
- `README.md` — this file

## ⚠️ Important: this update fixes 2 real bugs
1. Removed an unstable Firestore "offline persistence" feature that could
   cause the app to hang on a spinning loader on some devices/browsers.
2. Fixed the service worker so it always loads the **latest** version of
   the app instead of getting stuck on an old cached copy — this may be
   why earlier fixes didn't seem to show up for you.

Because of fix #2, after uploading these files, **please do a hard refresh**
on your phone once (Chrome menu → the app's page → pull down to refresh, or
clear the site's storage in Chrome settings → Site settings → your GitHub
Pages URL → Clear & reset) so the old service worker gets replaced.

## Setup (one-time)

1. **Firebase**: Open `app.js`, find the `firebaseConfig` object near the top,
   and replace the placeholder values with your real Firebase project keys
   (see the comment block right above it for step-by-step instructions).

2. **Hosting (GitHub Pages)**:
   - Create a GitHub repository
   - Upload **all 8 files** in this folder to the repository (keep them in
     the same folder — do not put them in subfolders)
   - In the repo, go to Settings → Pages → set Branch to `main`, folder to
     `/ (root)` → Save
   - You'll get a link like `https://yourusername.github.io/repo-name/`

3. Open that link on your phone, log in, and you're done. On Chrome, use
   "Add to Home Screen" from the menu to install it like a normal app.

## Demo login
- Username: `admin`  Password: `admin123`

## Notes
- All data is stored in Firebase Firestore (free tier) — no other backend needed.
- The app needs an internet connection to save/load data (offline persistence
  was removed for stability — see above). It shows a clear "Offline" banner
  when there's no connection instead of silently failing.
- To make future changes, edit these files and re-upload them to GitHub
  (overwriting the old ones) — the live link updates within a few seconds
  thanks to the network-first service worker.
