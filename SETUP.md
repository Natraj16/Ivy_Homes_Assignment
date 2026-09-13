# Ivy Homes Assignment - Setup Instructions

## ✅ What's Ready

Your workspace is now set up with:
- ✅ Project structure (backend/, frontend/, data/, analysis/)
- ✅ API client script (`backend/api_client.py`)
- ✅ Analysis script (`backend/analyzer.py`)
- ✅ Submission template (`submission.json`)
- ✅ Python dependencies installed
- ✅ Git repository initialized

---

## 🔑 Next Step: Configure Your Credentials

### 1. Check Your Email
Look for the registration confirmation email from **Ivy Homes**. It contains:
- API Key: `IVY26-E9D2ECCA680D` ✅ (you have this)
- City: `Gurgaon` ✅ (you have this)
- Assigned Locality: `Sector 82` ✅ (you have this)
- **Demo Account Password**: `[YOUR_PASSWORD]` ← **You need this**
- Demo emails: `demo1@ivy.homes`, `demo2@ivy.homes`, `demo3@ivy.homes`

### 2. Update Configuration
Create `.env` file by copying `.env.example`:
```bash
cp .env.example .env
```

Then edit `.env` and replace `YOUR_PASSWORD_HERE` with the password from your email.

---

## 📥 Download Data from API

Once you have your password configured:

```bash
python backend/api_client.py
```

This will:
1. ✓ Connect to health endpoint (test connection)
2. ✓ Login with demo1@ivy.homes + your password
3. ✓ Download all listings, rentals, projects
4. ✓ Save to `data/` directory

---

## 📊 Analyze Your Data

After download completes:

```bash
python backend/analyzer.py
```

This will:
1. ✓ Answer Q1-Q10 based on your data
2. ✓ Show statistics
3. ✓ Save answers to `analysis/answers.json`

---

## ✨ Current Status

| Component | Status |
|-----------|--------|
| Project Structure | ✅ Ready |
| Python Setup | ✅ Ready |
| API Client | ✅ Ready (needs password) |
| Data Download | ⏳ Waiting for password |
| Analysis Script | ✅ Ready |
| Frontend | 🔲 To build |
| Findings | 🔲 To discover |

---

## 📋 What You Have

**API_REFERENCE.md Key Facts:**
- API key goes in **query parameter**: `?api_key=IVY26-E9D2ECCA680D`
- Login endpoint: `POST /auth/login` with email/password
- Auth header: `Authorization: Bearer {token}`
- Pagination: uses `page` and `limit` (not offset)
- Rate limit: 1200 req/min (very generous)
- Health endpoint: `/health` (unauthenticated)

**Your Key Endpoints:**
- GET `/v1/listings` - All sale listings
- GET `/v1/rentals` - All rental listings  
- GET `/v1/projects` - All builder projects
- GET `/v1/analytics/summary` - Aggregated stats
- GET `/v1/favourites` - Saved listings
- GET `/auth/logout` - End session

---

## 🚀 Quick Start Summary

```bash
# 1. Edit .env with your password
nano .env

# 2. Download data
python backend/api_client.py

# 3. Analyze and get answers
python backend/analyzer.py

# 4. Check results
cat analysis/answers.json

# 5. Start building frontend
cd frontend
npx create-next-app@latest .
```

---

## ⏰ Timeline

- **Today (Sept 12):** ← You are here
  - Configure credentials
  - Download data
  - Start analysis
  
- **Tomorrow (Sept 13):**
  - Build frontend (auth, listings, filters)
  - Find API discrepancies
  - Finalize answers
  
- **Sept 14 (Deadline):**
  - Polish and test
  - Submit before 23:59 IST

---

**Once you provide the password from your email, you can start downloading data!**
