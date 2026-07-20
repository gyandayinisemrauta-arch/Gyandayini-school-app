# Gyan Dayini Bal Mandir — School Management System

## Files in this package
- `index.html` — main app page
- `style.css` — all styling
- `app.js` — all app logic (Firebase, forms, dashboard, etc.)
- `manifest.json` — makes the app installable on phone home screens (PWA)
- `sw.js` — service worker (lets the app open even with no signal)
- `icon-192.png`, `icon-512.png` — app icons

## Setup (one-time)

1. **Firebase**: Open `app.js`, find the `firebaseConfig` object near the top,
   and replace the placeholder values with your real Firebase project keys
   (see the comment block right above it for step-by-step instructions).

2. **Hosting (GitHub Pages)**:
   - Create a GitHub repository
   - Upload **all 7 files** in this folder to the repository (keep them in
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
- The app works offline and automatically syncs once back online.
- To make future changes, edit these files and re-upload them to GitHub
  (overwriting the old ones) — the live link updates automatically.
