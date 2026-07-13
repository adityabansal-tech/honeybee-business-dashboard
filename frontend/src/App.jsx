import { useEffect, useState } from "react";
import "./App.css";
import StatCard from "./components/StatCard";
import BarChartCard from "./components/BarChartCard";
import PieChartCard from "./components/PieChartCard";
import ListingsTable from "./components/ListingsTable";
import { getSummary, getByCity, getByCategory, getBySource } from "./api/client";

function HoneycombMark() {
  return (
    <svg className="brand-mark" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 2 L34.6 11 V29 L20 38 L5.4 29 V11 Z" stroke="#D98E04" strokeWidth="2" fill="none" />
      <path d="M20 10 L28 14.5 V23.5 L20 28 L12 23.5 V14.5 Z" fill="#D98E04" opacity="0.15" stroke="#D98E04" strokeWidth="1.5" />
    </svg>
  );
}

export default function App() {
  const [summary, setSummary] = useState(null);
  const [byCity, setByCity] = useState([]);
  const [byCategory, setByCategory] = useState([]);
  const [bySource, setBySource] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    Promise.all([getSummary(), getByCity(), getByCategory(), getBySource()])
      .then(([s, c, cat, src]) => {
        setSummary(s);
        setByCity(c);
        setByCategory(cat);
        setBySource(src);
      })
      .catch(() => setError(
        "Couldn't reach the API. Make sure the FastAPI backend is running on http://localhost:8000."
      ));
  }, []);

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="brand">
          <HoneycombMark />
          <div>
            <h1>Business Listings Dashboard</h1>
            <div className="subtitle">Honeybee Digital · Python Intern Assignment</div>
          </div>
        </div>
        <div className="header-meta">
          <div><span className="dot"></span>Connected to MySQL via FastAPI</div>
        </div>
      </header>

      {error ? (
        <div className="state-msg">{error}</div>
      ) : !summary ? (
        <div className="state-msg">Loading dashboard…</div>
      ) : (
        <>
          <section className="stat-grid">
            <StatCard label="Total Listings" value={summary.total_listings} accent />
            <StatCard label="Cities Covered" value={summary.total_cities} />
            <StatCard label="Categories" value={summary.total_categories} />
            <StatCard label="Sources" value={summary.total_sources} />
          </section>

          <section className="chart-grid">
            <BarChartCard
              title="City-wise Business Count"
              note="Number of listings collected per city"
              data={byCity}
            />
            <PieChartCard
              title="Source-wise Distribution"
              note="Where each listing was collected from"
              data={bySource}
            />
          </section>

          <section className="chart-grid">
            <BarChartCard
              title="Category-wise Business Count"
              note="Listings grouped by business category"
              data={byCategory}
              fullWidth
              horizontal
            />
          </section>

          <ListingsTable />
        </>
      )}
    </div>
  );
}
