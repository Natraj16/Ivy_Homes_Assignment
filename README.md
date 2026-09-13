# Ivy Homes — Internship Assignment

A full-stack web app built against the Ivy Homes property API. Implements the six required screens — Login, Browse Listings, Listing Detail, Saved Listings, Rentals & Projects, and an Insights dashboard — with real authentication, persistent sessions, client-side filtering, and a clean dashboard UI styled with Ivy's brand tokens.

---

## Demo

| URL | Credentials |
|-----|-------------|
| http://localhost:3000 | `demo1@ivy.homes` / *(see `.env.local`)* |

---

## Repo structure

```
ivy_homes_assignment/
├── frontend/               # Next.js 14 App Router — the submission
│   ├── src/
│   │   ├── app/
│   │   │   ├── login/          # Screen 1 — Auth
│   │   │   ├── listings/       # Screen 2 — Browse + Screen 3 — Detail
│   │   │   ├── saved/          # Screen 4 — Saved listings
│   │   │   ├── rentals/        # Screen 5a — Rentals
│   │   │   ├── projects/       # Screen 5b — Projects
│   │   │   ├── insights/       # Screen 6 — Analytics + findings
│   │   │   └── api/local-data/ # Internal route — serves data/findings.json
│   │   ├── components/
│   │   │   ├── Navbar.tsx
│   │   │   ├── PropertyCard.tsx
│   │   │   └── LoadingSkeleton.tsx
│   │   └── lib/
│   │       ├── api.ts          # Fetch wrapper — auth headers, 401 recovery
│   │       ├── auth.ts         # Login, silent token refresh, logout
│   │       └── pagination.ts   # usePaginated hook — offset-based
│   └── .env.example
├── data/
│   └── findings.json       # API discrepancies (surfaced in Insights screen)
├── API_REFERENCE.md        # Original API docs (provided)
├── statement.md            # Assignment brief (provided)
└── submission.json         # Filled submission answers
```

---

## Quick start

```bash
# 1. Install dependencies
cd frontend
npm install

# 2. Create environment file
cp .env.example .env.local
# → edit .env.local and paste your API key

# 3. Start dev server
npm run dev
# → open http://localhost:3000
```

---

## The six required screens

| # | Route | Description |
|---|-------|-------------|
| 1 | `/login` | Real auth against `POST /auth/login`. Session survives page refresh via `localStorage`. Token auto-refreshed using `POST /auth/refresh` before the 15-minute access token expires. |
| 2 | `/listings` | Paginated list (offset-based, 50/page). Sidebar filters: locality, bedrooms, price range, furnishing. All filters applied client-side as a second pass — server may ignore some. |
| 3 | `/listings/[id]` | Two-column detail page: image + fact table on the left, sticky price/save panel on the right. |
| 4 | `/saved` | Favourites persisted server-side via `POST /v1/favourites`. Survives re-login. Empty state with CTA. |
| 5 | `/rentals` `/projects` | Browsable with sidebar filters. Correct per-month rent and correct Crore-formatted project prices. |
| 6 | `/insights` | Section A: live data from `GET /v1/analytics/summary` shown as stat blocks + by-bedroom table. Section B: API discrepancy findings table, populated from `data/findings.json`. |

---

## API discrepancies found

The following differences were found between `API_REFERENCE.md` and the actual API. All are handled in the codebase.

| # | Endpoint | Documented | Actual | Fix applied |
|---|----------|-----------|--------|-------------|
| 1 | `*` | API key as `?api_key=` query param | Must be in `X-API-Key` header | Both sent; header takes precedence |
| 2 | `POST /auth/login` | Returns `{ "token": "...", "expires_in": 86400 }` | Returns `access_token`, `refresh_token`, `expires_in: 900` (15 min) | Silent refresh via `POST /auth/refresh` before expiry |
| 3 | `GET /v1/listings` | Pagination: `?page=N&limit=200` | Pagination: `?offset=N&limit=50` (max 50 enforced) | `usePaginated` hook uses offset arithmetic |
| 4 | `GET /v1/listings/{id}` | Plural path for detail | Returns 404; correct path is singular `/v1/listing/{id}` | Detail page calls singular endpoint |
| 5 | `GET /v1/listings` | Inactive listings excluded server-side | Returns listings with `is_live: false` | Noted in Insights; `is_live` surfaced in data |
| 6 | `GET /v1/projects` | Prices are integers in Rupees | `price_min`/`price_max` are floats in Crores | Display code divides by 10M and formats |

---

## Tech stack

- **Framework:** Next.js 14 (App Router) + TypeScript
- **Styling:** Tailwind CSS + CSS custom properties (Ivy brand tokens)
- **Auth:** JWT via `localStorage`, 15-minute access token silently refreshed with refresh token
- **State:** `useState` / `useEffect` / custom hooks — no external state library
- **API:** `https://solve.ivy.homes` — all requests via typed `fetchApi()` wrapper

---

## Environment variables

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_IVY_API_KEY` | ✅ | API key issued per candidate |

Copy `frontend/.env.example` → `frontend/.env.local` and fill in your key.
