from fastapi import FastAPI, Depends, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import Optional

from . import models, schemas, crud
from .database import engine, get_db

# Create tables on startup if they don't exist
models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Business Listings Dashboard API",
    description="API for storing and analyzing scraped business listing data",
    version="1.0.0",
)

# Allow the React dev server to call this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000", "https://honeybee-business-dashboard.vercel.app"],    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {"message": "Business Listings Dashboard API is running"}


# ---------- Part 3: Insert Listings APIs ----------

@app.post("/api/listings", response_model=schemas.ListingOut, status_code=201)
def insert_listing(listing: schemas.ListingCreate, db: Session = Depends(get_db)):
    """Insert a single business listing."""
    return crud.create_listing(db, listing)


@app.post("/api/listings/bulk", status_code=201)
def insert_listings_bulk(payload: schemas.BulkListingCreate, db: Session = Depends(get_db)):
    """Bulk insert scraped listings into MySQL (used by the scraper script)."""
    if not payload.listings:
        raise HTTPException(status_code=400, detail="No listings provided")
    inserted = crud.bulk_create_listings(db, payload.listings)
    return {"inserted": inserted}


@app.get("/api/listings", response_model=list[schemas.ListingOut])
def fetch_listings(
    skip: int = 0,
    limit: int = 100,
    city: Optional[str] = None,
    category: Optional[str] = None,
    source: Optional[str] = None,
    db: Session = Depends(get_db),
):
    """Fetch raw listings, optionally filtered by city/category/source."""
    return crud.get_listings(db, skip, limit, city, category, source)


# ---------- Part 4: Dashboard aggregation APIs ----------

@app.get("/api/dashboard/summary", response_model=schemas.DashboardSummary)
def dashboard_summary(db: Session = Depends(get_db)):
    return schemas.DashboardSummary(
        total_listings=crud.count_all(db),
        total_cities=len(crud.distinct_cities(db)),
        total_categories=len(crud.distinct_categories(db)),
        total_sources=len(crud.distinct_sources(db)),
    )


@app.get("/api/dashboard/by-city", response_model=list[schemas.CountItem])
def dashboard_by_city(db: Session = Depends(get_db)):
    return crud.count_by_city(db)


@app.get("/api/dashboard/by-category", response_model=list[schemas.CountItem])
def dashboard_by_category(db: Session = Depends(get_db)):
    return crud.count_by_category(db)


@app.get("/api/dashboard/by-source", response_model=list[schemas.CountItem])
def dashboard_by_source(db: Session = Depends(get_db)):
    return crud.count_by_source(db)


@app.get("/api/filters")
def available_filters(db: Session = Depends(get_db)):
    """Helper endpoint so the frontend can populate filter dropdowns."""
    return {
        "cities": crud.distinct_cities(db),
        "categories": crud.distinct_categories(db),
        "sources": crud.distinct_sources(db),
    }
