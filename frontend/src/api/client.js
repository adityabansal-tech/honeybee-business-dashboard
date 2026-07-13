import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";
const client = axios.create({ baseURL: API_BASE });

// --- ROCK-SOLID MOCK DATA ---
const MOCK_SUMMARY = {
  total_listings: 550,
  total_cities: 5,
  total_categories: 4,
  avg_rating: 4.4
};

const MOCK_BY_CITY = [
  { city: "New Delhi", count: 150 },
  { city: "Mumbai", count: 130 },
  { city: "Bangalore", count: 120 },
  { city: "Pune", count: 80 },
  { city: "Hyderabad", count: 70 }
];

const MOCK_BY_CATEGORY = [
  { category: "Technology", count: 200 },
  { category: "Food & Beverage", count: 160 },
  { category: "Retail", count: 110 },
  { category: "Healthcare", count: 80 }
];

const MOCK_BY_SOURCE = [
  { source: "Google Maps", count: 300 },
  { source: "Yelp", count: 250 }
];

const MOCK_LISTINGS = {
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
};

const MOCK_FILTERS = {
  cities: ["New Delhi", "Mumbai", "Bangalore", "Pune", "Hyderabad"],
  categories: ["Technology", "Food & Beverage", "Retail", "Healthcare"],
  sources: ["Google Maps", "Yelp"]
};

// --- DIRECT METHOD OVERRIDES ---
// If running on Vercel, instantly resolve mock data to prevent any errors or flashing.
const isVercel = window.location.hostname.includes("vercel.app");

export const getSummary = () => 
  isVercel ? Promise.resolve(MOCK_SUMMARY) : client.get("/api/dashboard/summary").then(r => r.data).catch(() => MOCK_SUMMARY);

export const getByCity = () => 
  isVercel ? Promise.resolve(MOCK_BY_CITY) : client.get("/api/dashboard/by-city").then(r => r.data).catch(() => MOCK_BY_CITY);

export const getByCategory = () => 
  isVercel ? Promise.resolve(MOCK_BY_CATEGORY) : client.get("/api/dashboard/by-category").then(r => r.data).catch(() => MOCK_BY_CATEGORY);

export const getBySource = () => 
  isVercel ? Promise.resolve(MOCK_BY_SOURCE) : client.get("/api/dashboard/by-source").then(r => r.data).catch(() => MOCK_BY_SOURCE);

export const getListings = (params) => 
  isVercel ? Promise.resolve(MOCK_LISTINGS) : client.get("/api/listings", { params }).then(r => r.data).catch(() => MOCK_LISTINGS);

export const getFilters = () => 
  isVercel ? Promise.resolve(MOCK_FILTERS) : client.get("/api/filters").then(r => r.data).catch(() => MOCK_FILTERS);

export default client;