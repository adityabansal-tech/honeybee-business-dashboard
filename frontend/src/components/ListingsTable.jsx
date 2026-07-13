import { useEffect, useState } from "react";
import { getListings, getFilters } from "../api/client";

const PAGE_SIZE = 10;

export default function ListingsTable() {
  const [rows, setRows] = useState([]);
  const [filters, setFilters] = useState({ cities: [], categories: [], sources: [] });
  const [city, setCity] = useState("");
  const [category, setCategory] = useState("");
  const [source, setSource] = useState("");
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getFilters().then(setFilters).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    getListings({
      skip: page * PAGE_SIZE,
      limit: PAGE_SIZE,
      city: city || undefined,
      category: category || undefined,
      source: source || undefined,
    })
      .then(setRows)
      .finally(() => setLoading(false));
  }, [page, city, category, source]);

  return (
    <div className="table-card">
      <h2>Business Listings</h2>
      <div className="filters-row">
        <select value={city} onChange={(e) => { setCity(e.target.value); setPage(0); }}>
          <option value="">All cities</option>
          {filters.cities.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={category} onChange={(e) => { setCategory(e.target.value); setPage(0); }}>
          <option value="">All categories</option>
          {filters.categories.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={source} onChange={(e) => { setSource(e.target.value); setPage(0); }}>
          <option value="">All sources</option>
          {filters.sources.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {loading ? (
        <div className="state-msg">Loading listings…</div>
      ) : rows.length === 0 ? (
        <div className="state-msg">No listings match these filters.</div>
      ) : (
        <>
          <table>
            <thead>
              <tr>
                <th>Business</th>
                <th>Category</th>
                <th>City</th>
                <th>Phone</th>
                <th>Source</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id}>
                  <td>{r.business_name}</td>
                  <td>{r.category}</td>
                  <td>{r.city}</td>
                  <td>{r.phone || "—"}</td>
                  <td><span className="badge">{r.source}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="pagination">
            <button disabled={page === 0} onClick={() => setPage((p) => p - 1)}>Previous</button>
            <button disabled={rows.length < PAGE_SIZE} onClick={() => setPage((p) => p + 1)}>Next</button>
          </div>
        </>
      )}
    </div>
  );
}
