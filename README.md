# postToP Extension

postToP Extension is a Manifest V3 extension for Chromium browsers and Firefox that detects currently playing content on YouTube and YouTube Music, then publishes presence updates to the postToP backend.

## Stack

TypeScript, Preact, Webpack, Tailwind CSS, and Biome.

## Setup

```bash
npm install
npm run dev
```

`npm run dev` builds in watch mode and outputs assets to `dist/chrome/` and `dist/firefox/`.

## Build

```bash
npm run build          # both targets
npm run build:chrome
npm run build:firefox
```

Each target gets its own folder under `dist/`. They share every source file and `public/manifest.json`;
only the `background` key and Firefox's `browser_specific_settings` differ, and those live in
`webpack/manifest.js`.

## Releases

Prebuilt extension packages are available on GitHub Releases:

https://github.com/PostToP/Extension/releases

If you use a release package, extract it and load the unpacked folder as described below.

## Load the Extension (Chrome, Edge, Brave, Opera)

1. Open `chrome://extensions`.
2. Enable **Developer mode**.
3. Select **Load unpacked**.
4. Choose the `dist/chrome/` directory.

## Load the Extension (Firefox)

Firefox 127 or newer is required — earlier versions do not grant MV3 host permissions at install time.

1. Open `about:debugging#/runtime/this-firefox`.
2. Select **Load Temporary Add-on**.
3. Choose `dist/firefox/manifest.json`.

## Available Scripts

- `npm run dev` - Development build in watch mode
- `npm run build` - Production build of both targets
- `npm run build:chrome` / `npm run build:firefox` - Production build of a single target
- `npm run lint` - Static checks via Biome
- `npm run format` - Format source files via Biome

## Repository Structure

- `src/background` - MV3 background worker (service worker on Chromium, event page on Firefox) and WebSocket integration
- `src/script` - Content scripts for YouTube and YouTube Music
- `src/popup` - Extension popup UI
- `src/settings` - Options/settings page
- `src/common` - Shared models, utilities, and repositories
- `public` - Shared manifest and static assets
- `webpack/manifest.js` - Per-browser manifest overrides

## Host Permissions

The extension requests access to the following hosts:

- `https://music.youtube.com/*`
- `https://www.youtube.com/*`
- `https://posttopserver.devla.dev/*`
- `https://posttop.devla.dev/*`
- `http://localhost:3000/*` (local development)
