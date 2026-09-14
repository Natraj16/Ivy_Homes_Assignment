# Ivy Homes — Internship Assignment

Welcome to my submission for the Ivy Homes engineering internship! I've built a full-stack Next.js application that implements all six required screens, featuring a premium UI, robust authentication, and a custom client-side persistent Favourites system.

Below is a breakdown of how to run the project, alongside my thoughts and processes while reverse-engineering the provided API.

---

## How to Run It

The project is a standard Next.js 14 application using the App Router.

```bash
# 1. Navigate to the frontend directory
cd frontend

# 2. Install dependencies
npm install

# 3. Set up your environment variables
# Copy the example file and paste your API key inside
cp .env.example .env.local
# Edit .env.local -> NEXT_PUBLIC_IVY_API_KEY=IVY26-E9D2ECCA680D

# 4. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. You can log in using `demo1@ivy.homes` (password: `cbed6d7335`).

---

## Navigating the Documentation: What I Distrusted and Why

Working with the API was an exercise in trust-but-verify. I quickly learned to test endpoints in isolation using Python scripts before wiring them up to the frontend. Here's how I handled the discrepancies:

1. **The Missing Favourites Endpoint:** 
   The documentation confidently listed `GET`, `POST`, and `DELETE` endpoints for `/v1/favourites`. When saving a property failed, I assumed my payload was wrong. After testing various permutations of `{"id": ...}` and `{"listing_id": ...}`, I realized the endpoint simply returned `404 Not Found` for everything.
   **What I did:** Since the prompt required saved listings to persist across reloads and re-logins, I built a custom `localStorage` manager (`lib/favourites.ts`) keyed specifically to the logged-in user's email. When you visit the Saved page, it grabs those local IDs and hydrates them by fetching their full details from the server!

2. **The Case of the Plural Route:** 
   The docs stated that fetching a single listing used `GET /v1/listing/{listing_id}`. I implemented this, but it threw a `404`. 
   **What I did:** I remembered that the bulk endpoint was plural (`/v1/listings`), so on a hunch, I tested `GET /v1/listings/{id}`. It worked perfectly! I updated the app's routing to match the actual server implementation.

3. **Currencies in Crores:** 
   The documentation explicitly promised that "Money is in Indian rupees, integer, everywhere." However, when rendering projects, the prices looked completely broken (e.g., `0.0 Cr`). 
   **What I did:** Upon inspecting the raw JSON response, I saw `price_min` and `price_max` were actually being returned as decimal Crores (e.g., `4.54`). I adjusted my frontend formatting logic to account for this so the UI wouldn't accidentally divide it by 10 million again.

---

## What I Checked That Turned Out to be Fine (Failed Hypotheses)

Not every hunch I had about the API being broken turned out to be true. A few of my hypotheses failed, which taught me to respect the API's actual capabilities before rewriting things myself:

- **Hypothesis: "The backend filters are entirely broken."**
  Because there were so many undocumented quirks, I initially assumed backend parameters like `bhk=2` or `min_price` simply didn't work, and that I'd have to download the entire dataset and filter it purely on the client side. 
  **Result:** I wrote a Python script to hit `/v1/listings?bhk=2` expecting a random assortment of listings. To my surprise, it strictly returned 2-BHK properties! The backend filtering *does* work quite well. While I still added a client-side filtering layer for maximum robustness and instant UI feedback, the server was doing its job properly.

- **Hypothesis: "Browsing listings requires a Bearer Token."**
  Early on, while testing the API with curl, I received a `401 Unauthorized: missing bearer token` error when hitting `/v1/listings?limit=1`. I panicked and thought the entire application had to be locked behind the login screen.
  **Result:** It turned out I had just forgotten to pass the `X-API-Key` header properly in my terminal script. Once the API key was provided, the endpoint was perfectly accessible to public (unauthenticated) users, just as it should be.

- **Hypothesis: "The API uses American spelling for Favourites."**
  When `/v1/favourites` threw a 404, my immediate thought was "Ah, the developer must have used American spelling (`/v1/favorites`) in the code, but British spelling in the docs!" 
  **Result:** I excitedly tested `/v1/favorites`... and got another `404 Not Found`. It wasn't a typo; the endpoint was just genuinely never shipped.

---

## What I Would Do With Another Two Days

If I had another 48 hours to polish and expand this application, I would focus on the following:

1. **Interactive Map View:** I would integrate `Leaflet` or `Mapbox` to plot all listings and projects geographically. Users could browse by panning around Gurgaon, making the discovery process much more intuitive.
2. **Data Visualization on the Insights Page:** Right now, the analytics are displayed as raw stat blocks and tables. I would use a library like `Recharts` or `Chart.js` to create beautiful, interactive bar charts (e.g., average price by locality) and pie charts for furnishing distribution.
3. **Advanced State Management:** While `localStorage` works great for the assignment's scope, scaling the app would benefit from a tool like `Zustand` or `Redux`. This would allow the "Saved" heart icons to sync instantaneously across multiple browser tabs without requiring manual React context propagation.
4. **End-to-End Testing:** I would write robust E2E tests using Cypress or Playwright to simulate the entire user journey (Login -> Browse -> Filter -> Save -> View Saved). This would ensure that any future unannounced changes to the API would be caught immediately in CI/CD.

---

## API Discrepancies Found

The following differences were found between `API_REFERENCE.md` and the actual API. All are handled in the codebase or logged.

| # | Endpoint | Category | Documented | Actual | How Found |
|---|----------|----------|-----------|--------|-----------|
| 1 | `*` | auth | Append API key as a query parameter: `?api_key=...` | API key must be sent in the `X-API-Key` request header. | Got a 401 Unauthorized with detail string to use the header. |
| 2 | `/auth/login` | auth | Returns `{ "token": "...", "expires_in": 86400 }` | Returns `access_token`, `refresh_token`, and `expires_in` is 900 (15 minutes). | The login response JSON didn't contain 'token'. |
| 3 | `/v1/listings` | pagination | Pagination uses `page` and `limit` (max 200). | Pagination uses `offset` instead of `page`, max limit is strictly 50. | The limit=100 parameter resulted in only 50 records. |
| 4 | `/v1/listings` | completeness | Returns active sale listings. Inactive/withdrawn excluded. | The endpoint returns listings where `is_live: false`. | Found 708 listings with is_live set to false. |
| 5 | `/v1/projects` | units | Money: Indian rupees, integer, everywhere in the API | `price_min` and `price_max` are floats representing Crores. | `price_max` was 4.54 instead of 45400000. |
| 6 | `/v1/favourites` | missing_endpoint | `GET`, `POST`, `DELETE` /v1/favourites/{id} | The endpoint returns 404 Not Found and does not seem to exist. | When implementing the Saved feature, calls returned 404. |
| 7 | `/v1/listing/{id}` | consistency | `GET /v1/listing/{listing_id}` | The endpoint is actually plural: `/v1/listings/{id}`. | fetch('/v1/listing/...') returned a 404 Not Found error. |
| 8 | `/v1/listings` | duplicates | Every listing_id is globally unique, one physical property. | Listings contain duplicates describing the identical physical property. | Analysis of the data revealed multiple identical records. |
| 9 | `/v1/listings` | data_quality | N/A | Certain listings have physically impossible values (e.g., floor > total). | Compared floor vs total_floors across all listings (6 violations). |
| 10 | `/v1/listings` | fraud | N/A | Several listings are fake or fraudulently submitted. | Detected 6 fake listing_ids during deep analysis. |

---

## AI & Tools Used

As permitted and encouraged by the assignment guidelines, this project was developed with the assistance of LLMs to accelerate boilerplate generation, data analysis, and UI styling:
- **Claude**: Used for high-level planning and architecting the approach to the assignment, specifically strategizing how to safely probe the API, scrape the data, identify documentation discrepancies, and compute the required answers.
- **Google DeepMind Antigravity**: Used as an agentic coding assistant to pair-program the Next.js frontend, refactor the UI to match the Ditto aesthetic tokens, and execute Python data analysis scripts.
- **Python**: Used in isolated scripts to probe the API for rate limits, pagination maximums, and data anomalies (like duplicates and physically impossible values).
