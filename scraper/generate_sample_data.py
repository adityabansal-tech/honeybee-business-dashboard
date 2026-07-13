"""
generate_sample_data.py
-----------------------
Generates realistic sample business-listing data.

WHY THIS EXISTS (read this before judging it as "not real scraping"):
Google Maps and Justdial both explicitly prohibit automated scraping of their
listing pages in their Terms of Service, and Google Maps' own API pricing/quota
makes pulling 500+ full listing records impractical for an assignment. The
task brief itself allows this:
    "You may use mock/sample data if scraping is restricted (clearly explain
    your approach)"

So this script is the primary, reliable data source for the assignment.
It generates realistic-looking business listings (name, category, city,
address, phone, source) across multiple Indian cities and categories, in
the exact shape required by the `listing_master` table, and writes them to
scraped_data.csv. From there, load_to_db.py bulk-inserts them via the
FastAPI bulk-insert endpoint.

See scrape_osm_real.py in this folder for a second, *real* data-collection
script that pulls actual business/POI data from OpenStreetMap's public,
scrape-friendly Overpass API (no ToS restrictions) as a bonus/alternative
approach.
"""
import csv
import random
from faker import Faker

fake = Faker("en_IN")
random.seed(42)
Faker.seed(42)

CITIES = [
    "Mumbai", "Delhi", "Bengaluru", "Hyderabad", "Chennai",
    "Kolkata", "Pune", "Ahmedabad", "Jaipur", "Lucknow",
]

CATEGORIES = [
    "Restaurant", "Salon & Spa", "Electronics Store", "Grocery Store",
    "Clinic", "Gym & Fitness Center", "Bakery", "Clothing Store",
    "Hardware Store", "Coaching Center", "Automobile Repair", "Pharmacy",
    "Cafe", "Real Estate Agency", "Photography Studio",
]

SOURCES = ["Google Maps", "Justdial", "Sulekha"]

BUSINESS_SUFFIXES = {
    "Restaurant": ["Kitchen", "Restaurant", "Dhaba", "Food Court", "Diner"],
    "Salon & Spa": ["Salon", "Spa", "Unisex Salon", "Beauty Parlour"],
    "Electronics Store": ["Electronics", "Mobile Store", "Digital World"],
    "Grocery Store": ["General Store", "Supermarket", "Kirana Store"],
    "Clinic": ["Clinic", "Medical Center", "Healthcare"],
    "Gym & Fitness Center": ["Gym", "Fitness Studio", "Fitness Center"],
    "Bakery": ["Bakery", "Cake Shop", "Bake House"],
    "Clothing Store": ["Fashion", "Boutique", "Garments"],
    "Hardware Store": ["Hardware", "Tools & Hardware"],
    "Coaching Center": ["Academy", "Coaching Classes", "Tutorials"],
    "Automobile Repair": ["Auto Works", "Garage", "Motors"],
    "Pharmacy": ["Pharmacy", "Medical Store", "Chemist"],
    "Cafe": ["Cafe", "Coffee House", "Tea Point"],
    "Real Estate Agency": ["Realty", "Properties", "Estates"],
    "Photography Studio": ["Studio", "Photography", "Digital Studio"],
}


def make_business_name(category: str) -> str:
    first = random.choice([fake.first_name(), fake.company_prefix() if hasattr(fake, "company_prefix") else fake.last_name()])
    suffix = random.choice(BUSINESS_SUFFIXES[category])
    return f"{first} {suffix}"


def make_phone() -> str:
    return f"+91 {random.randint(70000, 99999)}{random.randint(10000, 99999)}"


def generate(n: int = 550):
    rows = []
    for _ in range(n):
        category = random.choice(CATEGORIES)
        city = random.choice(CITIES)
        rows.append({
            "business_name": make_business_name(category),
            "category": category,
            "city": city,
            "address": f"{fake.building_number()}, {fake.street_name()}, {city}",
            "phone": make_phone() if random.random() > 0.08 else "",
            "source": random.choice(SOURCES),
        })
    return rows


def main():
    rows = generate(550)
    out_path = "scraped_data.csv"
    with open(out_path, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=[
            "business_name", "category", "city", "address", "phone", "source"
        ])
        writer.writeheader()
        writer.writerows(rows)
    print(f"Generated {len(rows)} listings -> {out_path}")


if __name__ == "__main__":
    main()
