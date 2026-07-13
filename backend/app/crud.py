from sqlalchemy.orm import Session
from sqlalchemy import func
from . import models, schemas


def create_listing(db: Session, listing: schemas.ListingCreate) -> models.ListingMaster:
    db_listing = models.ListingMaster(**listing.model_dump())
    db.add(db_listing)
    db.commit()
    db.refresh(db_listing)
    return db_listing


def bulk_create_listings(db: Session, listings: list[schemas.ListingCreate]) -> int:
    objects = [models.ListingMaster(**item.model_dump()) for item in listings]
    db.bulk_save_objects(objects)
    db.commit()
    return len(objects)


def get_listings(db: Session, skip: int = 0, limit: int = 100,
                  city: str | None = None, category: str | None = None,
                  source: str | None = None):
    query = db.query(models.ListingMaster)
    if city:
        query = query.filter(models.ListingMaster.city == city)
    if category:
        query = query.filter(models.ListingMaster.category == category)
    if source:
        query = query.filter(models.ListingMaster.source == source)
    return query.offset(skip).limit(limit).all()


def count_all(db: Session) -> int:
    return db.query(func.count(models.ListingMaster.id)).scalar()


def count_by_city(db: Session):
    rows = (
        db.query(models.ListingMaster.city, func.count(models.ListingMaster.id))
        .group_by(models.ListingMaster.city)
        .order_by(func.count(models.ListingMaster.id).desc())
        .all()
    )
    return [{"label": r[0], "count": r[1]} for r in rows]


def count_by_category(db: Session):
    rows = (
        db.query(models.ListingMaster.category, func.count(models.ListingMaster.id))
        .group_by(models.ListingMaster.category)
        .order_by(func.count(models.ListingMaster.id).desc())
        .all()
    )
    return [{"label": r[0], "count": r[1]} for r in rows]


def count_by_source(db: Session):
    rows = (
        db.query(models.ListingMaster.source, func.count(models.ListingMaster.id))
        .group_by(models.ListingMaster.source)
        .order_by(func.count(models.ListingMaster.id).desc())
        .all()
    )
    return [{"label": r[0], "count": r[1]} for r in rows]


def distinct_cities(db: Session):
    return [r[0] for r in db.query(models.ListingMaster.city).distinct().all()]


def distinct_categories(db: Session):
    return [r[0] for r in db.query(models.ListingMaster.category).distinct().all()]


def distinct_sources(db: Session):
    return [r[0] for r in db.query(models.ListingMaster.source).distinct().all()]
