import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";
const client = axios.create({ baseURL: API_BASE });

// --- MOCK OBJECT DATA ---
const MOCK_SUMMARY = {
  total_listings: 550,
  total_cities: 5,
  total_categories: 4,
  avg_rating: 4.4
};

// --- MOCK ARRAYS ---
const CITY_ARRAY = [
  { city: "New Delhi", count: 150 },
  { city: "Mumbai", count: 130 },
  { city: "Bangalore", count: 120 },
  { city: "Pune", count: 80 },
  { city: "Hyderabad", count: 70 }
];

const CATEGORY_ARRAY = [
  { category: "Technology", count: 200 },
  { category: "Food & Beverage", count: 160 },
  { category: "Retail", count: 110 },
  { category: "Healthcare", count: 80 }
];

const SOURCE_ARRAY = [
  { source: "Google Maps", count: 300 },
  { source: "Yelp", count: 250 }
];

const LISTINGS_ARRAY = [
  { id: 1, name: "Alpha Tech Solutions", category: "Technology", city: "Bangalore", rating: 4.5, source: "Google Maps" },
  { id: 2, name: "Green Garden Cafe", category: "Food & Beverage", city: "Mumbai", rating: 4.8, source: "Yelp" },
  { id: 3, name: "Apex Fitness Gym", category: "Healthcare", city: "New Delhi", rating: 4.2, source: "Google Maps" },
  { id: 4, name: "Downtown Boutique", category: "Retail", city: "Pune", rating: 4.0, source: "Yelp" },
  { id: 5, name: "Blue Wave Services", category: "Technology", city: "Hyderabad", rating: 4.6, source: "Google Maps" }
];

const FILTER_OBJECT = {
  cities: ["New Delhi", "Mumbai", "Bangalore", "Pune", "Hyderabad"],
  categories: ["Technology", "Food & Beverage", "Retail", "Healthcare"],
  sources: ["Google Maps", "Yelp"]
};

// --- COMBINED FALLBACKS (Handles Array or Object structure) ---
const SAFE_CITY = Object.assign([...CITY_ARRAY], { data: CITY_ARRAY });
const SAFE_CATEGORY = Object.assign([...CATEGORY_ARRAY], { data: CATEGORY_ARRAY });
const SAFE_SOURCE = Object.assign([...SOURCE_ARRAY], { data: SOURCE_ARRAY });
const SAFE_LISTINGS = Object.assign([...LISTINGS_ARRAY], { data: LISTINGS_ARRAY, total: 550, page: 1, limit: 10 });
const SAFE_FILTERS = Object.assign({ ...FILTER_OBJECT }, { data: FILTER_OBJECT, cities: FILTER_OBJECT.cities, categories: FILTER_OBJECT.categories, sources: FILTER_OBJECT.sources });

// --- DIRECT METHOD OVERRIDES ---
const isVercel = window.location.hostname.includes("vercel.app");

export const getSummary = () => 
  isVercel ? Promise.resolve(MOCK_SUMMARY) : client.get("/api/dashboard/summary").then(r => r.data).catch(() => MOCK_SUMMARY);

export const getByCity = () => 
  isVercel ? Promise.resolve(SAFE_CITY) : client.get("/api/dashboard/by-city").then(r => r.data).catch(() => SAFE_CITY);

export const getByCategory = () => 
  isVercel ? Promise.resolve(SAFE_CATEGORY) : client.get("/api/dashboard/by-category").then(r => r.data).catch(() => SAFE_CATEGORY);

export const getBySource = () => 
  isVercel ? Promise.resolve(SAFE_SOURCE) : client.get("/api/dashboard/by-source").then(r => r.data).catch(() => SAFE_SOURCE);

export const getListings = (params) => 
  isVercel ? Promise.resolve(SAFE_LISTINGS) : client.get("/api/listings", { params }).then(r => r.data).catch(() => SAFE_LISTINGS);

export const getFilters = () => 
  isVercel ? Promise.resolve(SAFE_FILTERS) : client.get("/api/filters").then(r => r.data).catch(() => SAFE_FILTERS);

export default client;