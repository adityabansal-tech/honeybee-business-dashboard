import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const client = axios.create({ baseURL: API_BASE });

export const getSummary = () => client.get("/api/dashboard/summary").then(r => r.data);
export const getByCity = () => client.get("/api/dashboard/by-city").then(r => r.data);
export const getByCategory = () => client.get("/api/dashboard/by-category").then(r => r.data);
export const getBySource = () => client.get("/api/dashboard/by-source").then(r => r.data);
export const getListings = (params) => client.get("/api/listings", { params }).then(r => r.data);
export const getFilters = () => client.get("/api/filters").then(r => r.data);

export default client;
