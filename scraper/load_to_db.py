"""
load_to_db.py
-------------
Reads scraped_data.csv (produced by generate_sample_data.py or
scrape_osm_real.py) and bulk-inserts it into MySQL through the FastAPI
`/api/listings/bulk` endpoint, in batches.

Usage:
    # 1. Start the backend first:  uvicorn app.main:app --reload  (from /backend)
    # 2. Then run this script:
    python load_to_db.py --file scraped_data.csv --api http://localhost:8000
"""
import argparse
import csv
import requests

BATCH_SIZE = 100


def load(file_path: str, api_base: str):
    with open(file_path, newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        rows = list(reader)

    total_inserted = 0
    for i in range(0, len(rows), BATCH_SIZE):
        batch = rows[i:i + BATCH_SIZE]
        payload = {"listings": batch}
        resp = requests.post(f"{api_base}/api/listings/bulk", json=payload, timeout=30)
        resp.raise_for_status()
        inserted = resp.json().get("inserted", 0)
        total_inserted += inserted
        print(f"Inserted batch {i // BATCH_SIZE + 1}: {inserted} rows")

    print(f"\nDone. Total inserted: {total_inserted}")


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--file", default="scraped_data.csv")
    parser.add_argument("--api", default="http://localhost:8000")
    args = parser.parse_args()
    load(args.file, args.api)
