# Filip Urbánoš — oficiálny web

Bilingual (SK/EN) athlete site + password-protected admin CMS.
Stack: Next.js 16, React 19, Tailwind 4, Vercel Blob.

Live: https://filip-urbanos.vercel.app

## Local development

```bash
npm install
npm run dev
```

Open http://localhost:3000 (or the port Next prints).

### Admin (local)

- URL: `/admin/login`
- Default password (only when `ADMIN_PASSWORD` is unset and not production): `filip-admin`
- Set stronger values in `.env.local` (copy from `.env.example`)

## Environment variables

| Variable | Required in prod | Purpose |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | recommended | Canonical URL for sitemap / OG |
| `ADMIN_PASSWORD` | **yes** | Bootstrap admin password |
| `ADMIN_SECRET` | **yes** | HMAC session signing + sealing auth file |
| `BLOB_READ_WRITE_TOKEN` | **yes** for durable CMS | Vercel Blob read/write |
| `CMS_DRIVER` | optional | Force `fs` or `blob` (default: blob if token set) |

## CMS storage: git seed vs production truth

- **Local (no Blob token):** reads/writes `data/content.json` and `data/auth.json`.
- **Production (Blob token set):** durable store is Vercel Blob:
  - `cms/content.json` — tournaments, albums, photos, videos, partners
  - `cms/auth.json` — password hash (**encrypted** with `ADMIN_SECRET`; never plain on CDN)
  - `uploads/...` — public media files

`data/content.json` in git is only a **seed**. Editing it locally does **not** update live Vercel content. To change live tournaments/media/partners, use **Admin** on production (or sync Blob intentionally).

On first Blob read, if `cms/content.json` is missing, the app seeds it from the repo `data/content.json`.

## Admin modules

- Turnaje (live / upcoming / completed + matches + optional album)
- Albumy / Fotky / Videá
- Partneri
- Správy (kontaktný formulár → `cms/inquiries.json`, sealed on Blob)
- Nastavenia (zmena hesla)

## Media uploads

- Prefer **YouTube/Vimeo links** for long videos (smaller page, better playback).
- File upload (admin → Videá) goes to Blob in production; max ~150MB.
- Local `public/uploads/*.mp4` is gitignored — it will **404 on Vercel** until you re-upload via admin or host externally.

If a video shows on localhost but not on production:

1. Open production `/admin/videos`
2. Re-upload the file (or paste a YouTube URL)
3. Confirm `/media` plays

## Deploy

Push to `main` on GitHub (`filipurbanos/filip-urbanos`). Vercel builds from that branch.

After deploy:

1. Confirm env vars on the Vercel project
2. Log in to `/admin` once (migrates legacy plaintext auth → sealed)
3. Spot-check `/results`, `/media`, `/partners`

## Security notes

- Admin pages: middleware + HMAC cookie
- Admin APIs: `isAdminAuthenticated()` on each route
- Login: basic IP rate limit (8 attempts / 15 min per instance)
- Password change invalidates older sessions (auth epoch in cookie)
