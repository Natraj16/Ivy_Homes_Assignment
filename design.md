# Ivy Homes — Frontend Design & Build Spec

This is a build spec for a real-estate web app on top of the Ivy Homes
Property API. The API and dataset have already been reverse-engineered
(see `FINDINGS.md` / `ANSWERS.md` — paste your Part 2/3 results into this repo
alongside this file); this document is about what to *build*, not what to
find.

**Stack:** Next.js 14+ (App Router), TypeScript, Tailwind CSS, deployed to
Vercel. Client-side data fetching via a small typed API wrapper (no heavy
state library needed — React state + `fetch` + a simple cache is enough for
this scope).

---

## 1. Brand & visual language

Ivy Homes is a property marketplace, so the UI should read as **trustworthy,
calm, and information-dense without feeling cluttered** — closer to a modern
listings portal (think Zillow/99acres/NoBroker) than a marketing site.

**Palette**
- Primary (brand): deep ivy green `#1F5C4A` — used for primary buttons, active
  nav state, links
- Accent: warm gold/amber `#C89B3C` — used sparingly, for "verified" badges,
  price highlights
- Neutral scale: `#0B0F0E` (near-black text) → `#F6F7F6` (page background),
  with a mid grey `#6B7570` for secondary text
- Semantic: success `#2E7D32`, warning `#B45309`, error `#B3261E`
- Surfaces: white cards on the `#F6F7F6` background, `1px solid #E4E7E5`
  borders, no heavy drop shadows — a soft `shadow-sm` on hover only

**Typography**
- Font: Inter (or system UI stack fallback) — clean, legible at small sizes
  for dense data (price/sqft/bedroom counts)
- Scale: 12/14/16/20/24/32px, weight 400 body / 600 headings / 700 price
  figures
- Prices are always right-aligned or visually anchored where they appear in
  a list, and always formatted as `₹1.45 Cr` / `₹42,000/mo` style
  (Indian numbering, not raw digits) — write a shared `formatINR()` helper

**Layout**
- Max content width ~1280px, centered, with a persistent top nav
  (logo, Browse / Rentals / Projects / Saved / Insights, user menu)
- Listings/rentals/projects pages: filter sidebar (or filter bar collapsing
  to a drawer on mobile) + grid/list of cards
- Property cards: image (or placeholder), price, bedroom/bathroom/area line,
  locality, a "verified" badge when `is_verified` is true, save/heart icon
- Detail pages: large image area, key facts table, description block
  (rendered as-is, but see §5 on treating seller text as untrusted data),
  contact block, "similar listings" strip
- Mobile-first responsive; the assignment is graded as a web app, but it
  should not break on a narrow viewport

**Tone of copy:** plain, factual, no marketing fluff. Empty/error states
should say what happened and what to do next, not just "Oops."

---

## 2. Information architecture

| Route | Purpose |
|---|---|
| `/login` | Auth against `POST /auth/login`, redirects to `/listings` on success |
| `/listings` | Browse sale listings — filters, pagination |
| `/listings/[id]` | Listing detail |
| `/rentals` | Browse rentals — filters, pagination |
| `/rentals/[id]` | Rental detail |
| `/projects` | Browse builder projects |
| `/projects/[id]` | Project detail — its listings, `total_listings` vs actual count |
| `/saved` | Favourited listings for the logged-in user |
| `/insights` | Analytics summary + your own discoveries surfaced for a human |
| `/` | Redirects to `/listings` if authed, else `/login` |

Auth is required for everything except `/login`. Use a simple
`(authenticated)` route group with a layout that checks for a valid token
and redirects otherwise.

---

## 3. Auth & session (build this first)

- `POST /auth/login` with `{ email, password }` → store `{ token, expires_in,
  user }` in `localStorage` (client-only, this is a demo app) plus a cookie
  or memory copy so SSR-guarded routes can check it.
- Compute and store an absolute expiry timestamp (`Date.now() +
  expires_in*1000`), not just the raw `expires_in`, so a refresh doesn't
  reset the clock.
- On every API call, attach `Authorization: Bearer <token>` and the
  `api_key` query param.
- On a `401`, clear the session and redirect to `/login` with a "session
  expired" message.
- Requirement from the brief: **session must survive a page refresh and
  still work 30 minutes in** — since tokens last 24h this is just "don't
  lose the token on reload," which `localStorage` handles for free. Don't
  build a refresh flow; the API doesn't have one.
- Provide a visible logout button that calls `POST /auth/logout` and clears
  local state.

---

## 4. Data layer

Build one small typed client, e.g. `lib/api.ts`:

```ts
type Page<T> = { total: number; page: number; page_size: number; results: T[] };

async function apiFetch<T>(path: string, params?: Record<string, any>): Promise<T> {
  const url = new URL(BASE_URL + path);
  url.searchParams.set("api_key", API_KEY);
  Object.entries(params ?? {}).forEach(([k, v]) => v != null && url.searchParams.set(k, String(v)));
  const res = await fetch(url, { headers: { Authorization: `Bearer ${getToken()}` } });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new ApiError(res.status, body.detail ?? res.statusText);
  }
  return res.json();
}
```

**Pagination:** write one generic `fetchAllPages<T>(path, params)` helper
that follows `total`/`page_size` to pull a full dataset (used for insights
calculations and for "load everything once" per the assignment's own
advice), and a separate `usePaginated(path, params)` hook for the UI (page
through incrementally, don't force-load everything just to render page 1).

**Filters:** implement locality/bhk/price-range/furnishing as real query
params where the API honors them, but since some documented filters may not
actually filter server-side (this is exactly the kind of thing your
findings should already have identified), the client should always apply a
client-side filter pass over whatever the server returns, so filters work
correctly for the user regardless of server behavior. Note in code comments
which filters needed this workaround and why.

**Errors:** a shared `<ErrorState detail={...} />` component that just shows
the server's `detail` message — the brief says these are written to be
useful, so don't paraphrase them into something vaguer.

---

## 5. Page-by-page requirements

### Listings / Rentals / Projects (browse)
- Paginated or infinite-scroll grid of cards
- Filter bar: locality, bedrooms, price range, furnishing (listings/rentals);
  locality + status for projects
- Sort control where the API supports it
- Empty state, loading skeletons, error state
- Card shows: image placeholder (no image field in the API — use a
  deterministic placeholder per locality/type, not a broken `<img>`), price
  formatted in INR, bedroom/bathroom, area, locality, verified badge

### Detail pages
- Reachable directly by URL (`/listings/[id]` etc.) — implement as a real
  dynamic route, not a client-only modal, so deep links work
- Show all fields from the API object, area and price clearly labeled with
  units
- Seller `description` field: render as plain text, clearly visually
  separated from verified/structured fields — treat it as untrusted
  seller-supplied copy, not as something to trust for facts
- "Similar listings" strip on listing detail pages using
  `/v1/listings/{id}/similar`
- Save/unsave button wired to the favourites endpoints

### Saved (`/saved`)
- `GET /v1/favourites` on load
- Add via card heart icon anywhere in the app, remove from this page or from
  any card
- Must persist across reload and re-login (this is just "trust the server,"
  since favourites are server-side per user — don't cache this locally in a
  way that can go stale)

### Insights (`/insights`)
This is the page a human reviewer will actually read closely. Two sections:

**A. What the API documents** — render `GET /v1/analytics/summary` faithfully:
city, total listings, median price, median price/sqft, by-locality and
by-bhk breakdowns (simple bar/table, not overbuilt charts).

**B. What you found** — this is the important part. Surface your Part 2
answers and Part 3 findings as a readable dashboard, not a raw JSON dump:
- total records vs unique properties vs active listings, with the delta
  explained (why they differ)
- corrupt / fake listing counts, with the reasoning method named (not just
  the count — "listings with X impossible" is more useful than a bare number)
- rent totals for your assigned locality
- price/sqft for 2BHKs, with your exclusions noted
- costliest project
- listings in the last 7 days relative to `REFERENCE`
- projects whose reported listing count disagrees with reality, and by how
  much
- a short "documentation vs reality" list pulled from your findings —
  category, what was documented, what's actually true

Populate this section from a local JSON/data file you commit (your answers +
findings), not by recomputing everything live on page load — recomputation
is expensive and not the point; this page is a report, not a live query
engine.

---

## 6. State & structure

- No Redux/Zustand needed. React Context for the auth session; component
  state + light custom hooks (`useListings`, `useFavourites`) for data.
- Directory shape:
  ```
  app/
    login/
    (app)/
      listings/[id]/
      rentals/[id]/
      projects/[id]/
      saved/
      insights/
      layout.tsx        # auth guard + nav
  lib/
    api.ts
    auth.ts
    format.ts           # formatINR, formatDate, etc.
  components/
    PropertyCard.tsx
    FilterBar.tsx
    Pagination.tsx
    ErrorState.tsx
    LoadingSkeleton.tsx
  data/
    findings.json        # your Part 3 output
    answers.json          # your Part 2 output
  ```

---

## 7. Acceptance checklist (mirrors the assignment's "six things")

- [ ] Login works against real credentials; session survives refresh and
      lasts 30+ minutes
- [ ] Listings browse with working locality/bhk/price/furnishing filters
      (client-enforced if the server doesn't)
- [ ] Listing detail reachable by direct URL
- [ ] Favourites: add/remove/list, persists after reload and re-login
- [ ] Rentals and projects browsable with correct prices and correct areas
      (watch units — this is exactly the kind of thing the doc gets wrong)
- [ ] Insights screen shows the documented analytics *and* your own
      discoveries in a way a non-technical reviewer can read in one pass

Everything past this list is optional polish — the brief is explicit that a
small, correct app beats a large, wrong one.
