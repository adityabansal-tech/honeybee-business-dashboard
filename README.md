# Business Listings Dashboard — Honeybee Digital Python Intern Assignment

A full-stack app that collects business listing data, stores it in MySQL, serves
it through a FastAPI backend, and visualizes it in a React dashboard (city-wise,
category-wise, and source-wise counts).

**Tech stack:** React (Vite) · FastAPI · MySQL (SQLAlchemy + PyMySQL) · Recharts

---

## 1. Data Collection Approach (important — read this first)

Google Maps and Justdial both prohibit automated scraping of their listing
pages in their Terms of Service, and the assignment brief explicitly allows
for this:

> "You may use mock/sample data if scraping is restricted (clearly explain your approach)"

So I used **two** approaches, both included in `scraper/`:

1. **`generate_sample_data.py`** (primary, used for the submitted demo data)
   Generates 550 realistic business listings — Indian business names, 15
   categories, 10 major cities, addresses, phone numbers, and a `source` field
   randomly tagged as Google Maps / Justdial / Sulekha — in exactly the shape
   the `listing_master` table expects. This is what was actually loaded into
   the database for this submission.

2. **`scrape_osm_real.py`** (bonus — a genuinely real scraper, not mock data)
   Pulls actual business/POI records from **OpenStreetMap's public Overpass
   API**, which is explicitly designed for programmatic queries and carries no
   scraping restrictions (unlike Google Maps/Justdial). It's real-world data
   collected with real HTTP requests and JSON parsing — just from an open,
   ToS-friendly source instead of a restricted one. Note: OSM records often
   lack a phone number, so that field may be blank for rows collected this way.
   This script needs outbound internet access to `overpass-api.de`.

Either CSV output gets loaded into MySQL with `load_to_db.py`.

---

## 2. Project Structure

```
honeybee-assignment/
├── backend/                 # FastAPI app
│   ├── app/
│   │   ├── main.py          # API routes
│   │   ├── models.py        # SQLAlchemy ORM model (listing_master)
│   │   ├── schemas.py       # Pydantic request/response schemas
│   │   ├── crud.py          # DB query helpers
│   │   └── database.py      # DB engine/session setup
│   ├── requirements.txt
│   └── .env.example
├── scraper/
│   ├── generate_sample_data.py   # primary data source (see section 1)
│   ├── scrape_osm_real.py        # bonus real scraper (OpenStreetMap)
│   ├── load_to_db.py             # loads a CSV into MySQL via the API
│   └── scraped_data.csv          # the 550 generated listings used for this submission
├── database/
│   ├── schema.sql                # CREATE TABLE statement (via mysqldump --no-data)
│   └── listing_master_dump.sql   # full data dump (schema + 550 rows)
├── frontend/                 # React (Vite) dashboard
│   ├── src/
│   │   ├── App.jsx
│   │   ├── components/       # StatCard, BarChartCard, PieChartCard, ListingsTable
│   │   └── api/client.js     # axios client for the FastAPI backend
│   └── .env.example
└── README.md
```

---

## 3. Setup Instructions

### Prerequisites
- Python 3.10+
- Node.js 18+
- MySQL 8 or MariaDB 10+ running locally

### 3.1 Database
```bash
mysql -u root -p
```
```sql
CREATE DATABASE business_dashboard;
CREATE USER 'dashboard_user'@'localhost' IDENTIFIED BY 'dashboard_pass123';
GRANT ALL PRIVILEGES ON business_dashboard.* TO 'dashboard_user'@'localhost';
FLUSH PRIVILEGES;
```
(Or just import the ready-made dump: `mysql -u root -p business_dashboard < database/listing_master_dump.sql`
— this already contains schema + all 550 demo rows, so you can skip straight to step 3.3.)

### 3.2 Backend (FastAPI)
```bash
cd backend
python -m venv venv && source venv/bin/activate   # optional but recommended
pip install -r requirements.txt
cp .env.example .env        # edit DB credentials if different from defaults
uvicorn app.main:app --reload
```
API will be live at `http://localhost:8000`. Interactive docs at `http://localhost:8000/docs`.

The app auto-creates the `listing_master` table on first run if it doesn't exist.

### 3.3 Load data (skip if you imported the .sql dump directly)
```bash
cd scraper
pip install faker requests   # if not already installed
python generate_sample_data.py     # writes scraped_data.csv (550 rows)
python load_to_db.py               # bulk-inserts into MySQL via the running API
```

### 3.4 Frontend (React)
```bash
cd frontend
npm install
cp .env.example .env    # points VITE_API_BASE_URL at the backend
npm run dev
```
Dashboard will be live at `http://localhost:5173`.

---

## 4. API Reference

| Method | Endpoint                     | Purpose                                   |
|--------|-------------------------------|--------------------------------------------|
| POST   | `/api/listings`               | Insert a single listing                    |
| POST   | `/api/listings/bulk`          | Bulk insert (used by the scraper loader)   |
| GET    | `/api/listings`               | Fetch listings, filterable by city/category/source, paginated |
| GET    | `/api/dashboard/summary`      | Total listings / cities / categories / sources |
| GET    | `/api/dashboard/by-city`      | Count grouped by city                      |
| GET    | `/api/dashboard/by-category`  | Count grouped by category                  |
| GET    | `/api/dashboard/by-source`    | Count grouped by source                    |
| GET    | `/api/filters`                | Distinct cities/categories/sources (for dropdowns) |

---

## 5. Challenges Faced

- **Scraping restrictions**: Google Maps and Justdial both disallow automated
  scraping in their ToS, and Google's Places API has tight quotas/costs that
  make pulling 500+ full records impractical for a take-home assignment. I
  addressed this the way the brief anticipates — generating realistic sample
  data — but also built a second, genuinely real scraper against OpenStreetMap's
  open Overpass API to show the actual scraping/parsing logic on a source
  that's legitimately open to it.
- **Bulk insert performance**: for 500+ rows, inserting one row at a time over
  HTTP would be slow, so the loader batches rows (100 per request) into
  `/api/listings/bulk`, which uses SQLAlchemy's `bulk_save_objects` instead of
  one `INSERT` per row.
- **Chart readability with many categories**: 15 categories made a vertical
  bar chart cramped, so the category breakdown uses a horizontal bar layout
  instead, which scales better with more labels.

---

## 6. Evaluation Notes

- **Functionality**: end-to-end tested locally — data generated → loaded into
  MySQL → served by FastAPI → rendered in the React dashboard with live counts.
- **API Design**: RESTful routes, Pydantic validation, bulk endpoint separate
  from single-insert for clarity, CORS configured for the Vite dev server.
- **Data Accuracy**: dashboard aggregation endpoints use SQL `GROUP BY` +
  `COUNT`, not client-side computation, so counts always reflect the DB state.
