# Media Streaming App

A Next.js media streaming app for public Google Drive videos with playlist persistence.

## Features

- Stream videos from public Google Drive links
- Playlist management with localStorage persistence
- Custom controls: play/pause, seek, volume, speed, fullscreen
- Auto-play next video
- Keyboard shortcuts (Space, Left Arrow, Right Arrow)
- Responsive dark UI with Tailwind CSS

## Tech Stack

- Next.js (App Router)
- React + TypeScript
- Tailwind CSS
- HLS.js
- Lucide React

## Setup

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Google Drive URL Formats Supported

- `https://drive.google.com/file/d/<ID>/view`
- `https://drive.google.com/open?id=<ID>`
- `https://drive.google.com/uc?id=<ID>&export=download`

Videos must be publicly shared.

## Scripts

- `npm run dev` - start dev server
- `npm run build` - production build
- `npm run start` - run production server
- `npm run lint` - run ESLint

## Project Structure

```text
app/
components/
lib/
public/
```

## Notes

- Playlist data is stored in browser localStorage.
- Google Drive metadata access is limited for public files, so fallback titles are generated when needed.
