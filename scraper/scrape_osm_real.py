"""
scrape_osm_real.py
------------------
OPTIONAL / BONUS: a *real* data-collection script (not mock data).

Instead of scraping Google Maps or Justdial directly -- which both forbid
automated scraping in their Terms of Service -- this script pulls real
business/POI (point of interest) records from OpenStreetMap via the public
Overpass API (https://overpass-api.de). OSM data is community-maintained
under the Open Database License and Overpass explicitly exists to be queried
programmatically, so this is a legitimate, ToS-safe alternative to scraping
a directory site, while still being *real* data rather than generated data.

Usage:
    python scrape_osm_real.py --city "Mumbai" --limit 500

Notes:
- OSM records rarely include a phone number, so `phone` may be blank for many
  rows (this is expected and is called out in the README).
- "source" is set to "OpenStreetMap" for all rows collected this way.
- This script needs internet access to overpass-api.de, which may be blocked
  in sandboxed/offline environments -- if it fails to connect, fall back to
  generate_sample_data.py.
"""
import argparse
import csv
import time
import requests

OVERPASS_URL = "https://overpass-api.de/api/interpreter"

# OSM tags that roughly map to our business categories
CATEGORY_TAGS = {
    "Restaurant": 'amenity=restaurant',
    "Cafe": 'amenity=cafe',
    "Pharmacy": 'amenity=pharmacy',
    "Clinic": 'amenity=clinic',
    "Bakery": 'shop=bakery',
    "Clothing Store": 'shop=clothes',
    "Electronics Store": 'shop=electronics',
    "Grocery Store": 'shop=supermarket',
    "Hardware Store": 'shop=hardware',
    "Salon & Spa": 'shop=hairdresser',
    "Gym & Fitness Center": 'leisure=fitness_centre',
}


def build_query(city: str, tag: str, limit: int) -> str:
    key, value = tag.split("=")
    return f"""
    [out:json][timeout:60];
    area["name"="{city}"]["boundary"="administrative"]->.searchArea;
    (
      node["{key}"="{value}"](area.searchArea);
    );
    out center {limit};
    """


def fetch_category(city: str, category: str, tag: str, limit: int):
    query = build_query(city, tag, limit)
    resp = requests.post(OVERPASS_URL, data={"data": query}, timeout=90)
    resp.raise_for_status()
    elements = resp.json().get("elements", [])
    rows = []
    for el in elements:
        tags = el.get("tags", {})
        name = tags.get("name")
        if not name:
            continue
        addr_parts = [
            tags.get("addr:housenumber", ""),
            tags.get("addr:street", ""),
            tags.get("addr:suburb", ""),
        ]
        address = ", ".join([p for p in addr_parts if p]) or city
        rows.append({
            "business_name": name,
            "category": category,
            "city": city,
            "address": f"{address}, {city}",
            "phone": tags.get("phone", tags.get("contact:phone", "")),
            "source": "OpenStreetMap",
        })
    return rows


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--city", default="Mumbai")
    parser.add_argument("--limit", type=int, default=500)
    parser.add_argument("--out", default="scraped_data_osm.csv")
    args = parser.parse_args()

    all_rows = []
    per_category_limit = max(10, args.limit // len(CATEGORY_TAGS))

    for category, tag in CATEGORY_TAGS.items():
        try:
            rows = fetch_category(args.city, category, tag, per_category_limit)
            print(f"  {category}: {len(rows)} records")
            all_rows.extend(rows)
        except Exception as e:
            print(f"  {category}: failed ({e})")
        time.sleep(1)  # be polite to the free public Overpass instance
        if len(all_rows) >= args.limit:
            break

    all_rows = all_rows[: args.limit]
    with open(args.out, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=[
            "business_name", "category", "city", "address", "phone", "source"
        ])
        writer.writeheader()
        writer.writerows(all_rows)
    print(f"\nTotal: {len(all_rows)} listings -> {args.out}")


if __name__ == "__main__":
    main()
