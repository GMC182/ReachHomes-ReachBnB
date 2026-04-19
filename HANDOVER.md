# Project Handover & System Advisory
**Project Name:** ReachHomes Admin Dashboard
**Current Date:** Sun, 19 Apr 2026

## 🚀 Execution Guide
To run the project in development mode:
1. Ensure dependencies are installed: `npm install`
2. Start the integrated Express/Vite server: `npm run dev` (This executes `tsx server.ts`)
3. Access the application on **Port 3000**.

## 🏗️ Architecture Overview
- **Vite/React (Frontend):** Modern, responsive dashboard using Tailwind CSS and `lucide-react`.
- **Express (Full-Stack Backend):** 
  - Functions as a Vite middleware during development.
  - Serves as a static file provider in production.
  - Custom API endpoints located in `server.ts`.

## 🗄️ Database Strategy (Dual-Storage)
The application implements a **Hybrid Resilience Layer** for state persistence:
- **Primary (MySQL):** Triggered if `DB_HOST` and `DB_USER` are set in `.env`.
- **Secondary (SQLite Fallback):** Automatically active if MySQL connection times out (10s) or fails after 3 attempts. 
- **Encryption:** MySQL schemas are strictly typed; SQLite uses local `sqlite.db`.

## ⚠️ Stability & Performance Policies
- **API Guarding:** All `/api/*` routes are strictly enforced to return `application/json`. A catch-all middleware in `server.ts` prevents fallbacks to HTML (Vite index) for API errors.
- **Rate Limiting:** `/api` is limited to **5,000 requests per 10 minutes**.
- **Cold Boot Handling:** The frontend `DatabaseService.ts` detects server thermal-up (HTML "Starting Server..." page) and implements a 10s backoff retry loop.
- **429 Handling:** Frontend handles 429 "Too Many Requests" by pausing for 30s before retrying state synchronization.

## 🔑 Key Environment Variables
Declare these in `.env.example` before sharing:
- `DB_HOST`: Database hostname.
- `DB_USER`: Database username.
- `DB_PASSWORD`: Database password.
- `DB_NAME`: Database name.
- `DB_PORT`: Default 3306.
- `DB_SSL`: Set to `'true'` for managed SSL connections (e.g., Aiven, DigitalOcean).

## 🛠️ Components of Interest
- `server.ts`: Single point of truth for API routes, rate limiting, and DB initialization.
- `src/services/DatabaseService.ts`: Manages state synchronization, auth state, and retry logic.
- `src/App.tsx`: Role-based routing and initialization logic.
