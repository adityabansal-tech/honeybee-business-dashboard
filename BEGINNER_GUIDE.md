# Beginner's Guide — Run, Record, Push, and Deploy

This assumes you've never done this before. Follow it top to bottom, in order.
Don't skip steps — each one depends on the one before it.

---

## PART 1 — Run It On Your Own Laptop First

Do this before anything else. If it doesn't run locally, it won't run deployed either.

### 1.1 Install the tools (one-time only)

**Python** (3.10 or newer)
- Windows/Mac: download from https://www.python.org/downloads/ and install.
- Check it worked by opening a terminal (Command Prompt on Windows, Terminal on Mac) and typing:
  ```
  python --version
  ```

**Node.js** (18 or newer — this gives you `npm`)
- Download from https://nodejs.org (choose the "LTS" version).
- Check it worked:
  ```
  node --version
  npm --version
  ```

**MySQL** (the database)
- Easiest for beginners: install **MySQL Community Server** from
  https://dev.mysql.com/downloads/mysql/ — during install it'll ask you to set
  a root password. Remember it, you'll need it in a minute.
- On Mac, an easier alternative is `brew install mysql` if you have Homebrew.

### 1.2 Unzip the project
Unzip `honeybee-business-dashboard.zip` somewhere easy to find, like your Desktop.

### 1.3 Create the database
Open a terminal, then:
```
mysql -u root -p
```
Type your root password when asked. Then paste this in and press Enter:
```sql
CREATE DATABASE business_dashboard;
CREATE USER 'dashboard_user'@'localhost' IDENTIFIED BY 'dashboard_pass123';
GRANT ALL PRIVILEGES ON business_dashboard.* TO 'dashboard_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### 1.4 Start the backend
```
cd honeybee-assignment/backend
python -m venv venv
```
Activate the virtual environment:
- Windows: `venv\Scripts\activate`
- Mac/Linux: `source venv/bin/activate`

Then:
```
pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --reload
```
Leave this terminal window open and running. Open `http://localhost:8000/docs`
in your browser — you should see the interactive API docs. That means it's working.

### 1.5 Load the sample data (in a NEW terminal window — keep the backend running)
```
cd honeybee-assignment/scraper
pip install faker requests
python generate_sample_data.py
python load_to_db.py
```
You should see "Inserted batch..." messages ending in "Total inserted: 550".

### 1.6 Start the frontend (in ANOTHER new terminal window)
```
cd honeybee-assignment/frontend
npm install
cp .env.example .env
npm run dev
```
It'll print a URL like `http://localhost:5173` — open that in your browser.
You should see the dashboard with charts and numbers. 🎉

**At this point you should have 3 terminal windows open**: one running MySQL
(started automatically as a background service by the installer), one running
the backend (`uvicorn`), one running the frontend (`npm run dev`).

---

## PART 2 — Push to GitHub

If you've never used Git before:

1. Create a free account at https://github.com if you don't have one.
2. Click the "+" in the top right → "New repository". Name it something like
   `honeybee-business-dashboard`. Keep it **Public** (so the recruiter can view it
   without logging in). Don't check "Add a README" — you already have one.
3. On your computer, open a terminal in the `honeybee-assignment` folder and run:
   ```
   git init
   git add .
   git commit -m "Business listings dashboard - Honeybee Digital assignment"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/honeybee-business-dashboard.git
   git push -u origin main
   ```
   Replace `YOUR_USERNAME` with your actual GitHub username. It'll ask you to
   log in the first time (GitHub may ask you to use a "personal access token"
   instead of your password — GitHub will show you a link to create one if so).

That's it — your code is now on GitHub. Double check: the assignment asked for
**separate folders for frontend and backend**, which you already have.

---

## PART 3 — Record the Demo Video (3–5 minutes)

**Recording tool**: the easiest free option is **Loom** (https://loom.com) —
just install the browser extension, click record, pick "screen + camera" or
"screen only". Alternatively, Windows has the free built-in **Xbox Game Bar**
(Win + G) and Mac has **QuickTime Player** (File → New Screen Recording).

### Script — read this out loud while sharing your screen

**[0:00–0:20] Intro**
> "Hi, I'm [your name]. This is my submission for the Python Development Intern
> assignment — a Business Listings Dashboard built with React, FastAPI, and MySQL."

**[0:20–1:10] Data collection approach**
> "For data collection, the assignment allows mock data if scraping is restricted —
> and it is: Google Maps and Justdial both prohibit automated scraping in their
> Terms of Service. So I built a generator that creates 550 realistic business
> listings — names, categories, cities, addresses, phone numbers — matching the
> exact schema needed. I also built a second script that pulls *real* data from
> OpenStreetMap's open API, since that source doesn't have scraping restrictions —
> I can show that code too if useful."
*(Open `scraper/generate_sample_data.py` and `scraper/scrape_osm_real.py` briefly on screen.)*

**[1:10–1:40] Database**
> "Here's the MySQL table, `listing_master`, with the fields the assignment asked
> for — business name, category, city, address, phone, source, and created_at."
*(Open a MySQL client or terminal and run `SELECT * FROM listing_master LIMIT 5;`)*

**[1:40–2:40] Backend API**
> "The backend is FastAPI. Here's the interactive docs page."
*(Show `http://localhost:8000/docs`)*
> "There's a bulk-insert endpoint used by the scraper loader, a filtered listings
> endpoint, and three aggregation endpoints — by city, category, and source —
> which do the counting directly in SQL with GROUP BY, so the numbers are always
> accurate."
*(Click "Try it out" on `/api/dashboard/by-city` to show a live response.)*

**[2:40–3:40] Frontend dashboard**
> "And here's the dashboard."
*(Switch to `http://localhost:5173`)*
> "Summary cards at the top, a city-wise bar chart, a source-wise pie chart, and
> a category breakdown. Below that, a filterable, paginated table of the raw
> listings — you can filter by city, category, or source."
*(Click a filter dropdown to show it updating live.)*

**[3:40–4:15] Wrap-up / challenges**
> "The main challenge was the scraping restriction, which I addressed by
> documenting my reasoning clearly in the README rather than trying to bypass
> a site's Terms of Service. The other challenge was making the bulk insert
> efficient for 500+ rows — I batch them instead of inserting one at a time."

**[4:15–4:30] Close**
> "That's the full stack — thanks for watching. The code, README, and SQL dump
> are all in the GitHub repo."

*(Tip: record it in one take if you can, but it's fine to pause and re-record
sections — just trim it in Loom's editor after.)*

---

## PART 4 — Deploy It Online (so the recruiter can click a live link)

This is optional — the assignment only requires GitHub + video + SQL dump —
but a live link is a strong bonus that makes you stand out. Here's the
simplest free path I could verify still works right now (some services like
PlanetScale killed their free tier, so I'm pointing you to ones that haven't).

### 4.1 Database → Aiven (free forever, no credit card)
1. Go to https://aiven.io/free-mysql-database and sign up.
2. Create a new MySQL service (free tier: 1GB storage).
3. Once it's ready, Aiven shows you a connection string / host, port, username,
   password, and database name — copy all of these down.
4. Import your data: from your computer, run:
   ```
   mysql -h <aiven-host> -P <aiven-port> -u <aiven-user> -p <database-name> < database/listing_master_dump.sql
   ```
   (It'll ask for the password Aiven gave you.)

### 4.2 Backend → Render (free tier)
1. Go to https://render.com, sign up, and connect your GitHub account.
2. Click **New → Web Service**, pick your `honeybee-business-dashboard` repo.
3. Set:
   - **Root Directory**: `backend`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
4. Under **Environment Variables**, add the Aiven credentials from step 4.1:
   `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`
5. Click **Create Web Service**. Render gives you a URL like
   `https://your-app.onrender.com`.
   - Note: Render's free tier sleeps after 15 minutes of no traffic, so the
     first request after a while takes 30–60 seconds to "wake up" — this is
     normal and fine for a demo/assignment, not a bug.

### 4.3 Frontend → Vercel (free tier)
1. Go to https://vercel.com, sign up, connect GitHub.
2. Click **Add New → Project**, pick the same repo.
3. Set **Root Directory** to `frontend`.
4. Add an environment variable: `VITE_API_BASE_URL` = your Render URL from step 4.2
   (e.g. `https://your-app.onrender.com`).
5. Click **Deploy**. You'll get a live URL like `https://your-app.vercel.app`.

### 4.4 One last edit — allow your live frontend to talk to your live backend
Your backend currently only allows `localhost` origins (this is a CORS setting
for security). Open `backend/app/main.py`, find this part:
```python
allow_origins=["http://localhost:5173", "http://localhost:3000"],
```
Add your Vercel URL to that list, e.g.:
```python
allow_origins=["http://localhost:5173", "http://localhost:3000", "https://your-app.vercel.app"],
```
Commit and push this change to GitHub — Render will auto-redeploy.

That's it — you now have a live, working link to include in your submission
email alongside the GitHub repo, video, and SQL dump.
