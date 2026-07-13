from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime


class ListingBase(BaseModel):
    business_name: str = Field(..., max_length=255)
    category: str = Field(..., max_length=100)
    city: str = Field(..., max_length=100)
    address: Optional[str] = Field(None, max_length=500)
    phone: Optional[str] = Field(None, max_length=50)
    source: str = Field(..., max_length=50)


class ListingCreate(ListingBase):
    pass


class BulkListingCreate(BaseModel):
    listings: List[ListingCreate]


class ListingOut(ListingBase):
    id: int
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class CountItem(BaseModel):
    label: str
    count: int


class DashboardSummary(BaseModel):
    total_listings: int
    total_cities: int
    total_categories: int
    total_sources: int
