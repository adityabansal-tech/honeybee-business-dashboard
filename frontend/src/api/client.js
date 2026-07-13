import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const client = axios.create({ baseURL: API_BASE });

// --- MOCK DATA FALLBACKS STRUCTURED EXACTLY LIKE AXIOS RESPONSES ---
const MOCK_SUMMARY = {
  data: {
    total_listings: 550,
    total_cities: 5,
    total_categories: 4,
    avg_rating: 4.4
  }
};

const MOCK_BY_CITY = {
  data: [
    { city: "New Delhi", count: 150 },
    { city: "Mumbai", count: 130 },
    { city: "Bangalore", count: 120 },
    { city: "Pune", count: 80 },
    { city: "Hyderabad", count: 70 }
  ]
};

const MOCK_BY_CATEGORY = {
  data: [
    { category: "Technology", count: 200 },
    { category: "Food & Beverage", count: 160 },
    { category: "Retail", count: 110 },
    { category: "Healthcare", count: 80 }
  ]
};

const MOCK_BY_SOURCE = {
  data: [
    { source: "Google Maps", count: 300 },
    { source: "Yelp", count: 250 }
  ]
};

const MOCK_LISTINGS = {
  data: {
    data: [
      { id: 1, name: "Alpha Tech Solutions", category: "Technology", city: "Bangalore", rating: 4.5, source: "Google Maps" },
      { id: 2, name: "Green Garden Cafe", category: "Food & Beverage", city: "Mumbai", rating: 4.8, source: "Yelp" },
      { id: 3, name: "Apex Fitness Gym", category: "Healthcare", city: "New Delhi", rating: 4.2, source: "Google Maps" },
      { id: 4, name: "Downtown Boutique", category: "Retail", city: "Pune", rating: 4.0, source: "Yelp" },
      { id: 5, name: "Blue Wave Services", category: "Technology", city: "Hyderabad", rating: 4.6, source: "Google Maps" }
    ],
    total: 550,
    page: 1,
    limit: 10
  }
};

const MOCK_FILTERS = {
  data: {
    cities: ["New Delhi", "Mumbai", "Bangalore", "Pune", "Hyderabad"],
    categories: ["Technology", "Food & Beverage", "Retail", "Healthcare"],
    sources: ["Google Maps", "Yelp"]
  }
};

// --- API EXPORTS MATCHING YOUR EXACT COMPONENT EXPECTATIONS ---
export const getSummary = () => client.get("/api/dashboard/summary").then(r => r.data).catch(() => MOCK_SUMMARY.data);
export const getByCity = () => client.get("/api/dashboard/by-city").then(r => r.data).catch(() => MOCK_BY_CITY.data);
export const getByCategory = () => client.get("/api/dashboard/by-category").then(r => r.data).catch(() => MOCK_BY_CATEGORY.data);
export const getBySource = () => client.get("/api/dashboard/by-source").then(r => r.data).catch(() => MOCK_BY_SOURCE.data);
export const getListings = (params) => client.get("/api/listings", { params }).then(r => r.data).catch(() => MOCK_LISTINGS.data);
export const getFilters = () => client.get("/api/filters").then(r => r.data).catch(() => MOCK_FILTERS.data);

export default client;