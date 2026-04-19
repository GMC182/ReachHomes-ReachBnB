# ReachHomes — Deployment Guide

## Stack
- **Frontend:** Vite + React 19 + TypeScript + Tailwind CSS
- **Backend:** Express 5 + TypeScript (tsx)
- **Database:** SQLite (primary, persistent) / MySQL (optional upgrade)
- **Hosting:** Render.com (free tier, permanent)

---

## Render.com Deployment (Free, Permanent)

### First-Time Setup

1. Go to [https://render.com](https://render.com) and sign up / log in with GitHub
2. Click **"New +"** → **"Web Service"**
3. Connect the GitHub repo: `GMC182/ReachHomes-ReachBnB`
4. Use these settings:

| Setting | Value |
|---|---|
| Name | `reachhomes-reachbnb` |
| Runtime | `Node` |
| Build Command | `npm install && npm run build` |
| Start Command | `NODE_ENV=production npx tsx server.ts` |
| Plan | `Free` |

5. Add **Environment Variables**:
   - `NODE_ENV` = `production`
   - `PORT` = `10000`

6. Add **Persistent Disk** (for SQLite):
   - Name: `sqlite-data`
   - Mount Path: `/data`
   - Size: `1 GB`

7. Click **"Create Web Service"**

### Auto-Deploy from GitHub

Every push to `main` branch automatically triggers a new deploy on Render.

To also trigger via webhook, add `RENDER_DEPLOY_HOOK` as a GitHub Actions secret:
1. In Render dashboard → your service → **Settings** → **Deploy Hook** → copy URL
2. In GitHub repo → **Settings** → **Secrets** → **Actions** → add `RENDER_DEPLOY_HOOK`

---

## Custom Domain (immo3.reachleads.pro)

1. In Render dashboard → your service → **Settings** → **Custom Domains**
2. Add `immo3.reachleads.pro`
3. Render will show a CNAME target (e.g. `reachhomes-reachbnb.onrender.com`)
4. In your DNS provider (Cloudflare), update the CNAME for `immo3` to point to the Render URL

---

## Local Development

```bash
npm install
cp .env.example .env
npm run dev
# App runs on http://localhost:3000
```

---

## Database

- **SQLite** is used by default (no configuration needed)
- In production on Render, the DB is stored at `/data/reachhomes.db` (persistent disk)
- To upgrade to **MySQL**, set these env vars in Render:
  - `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `DB_PORT`, `DB_SSL`
