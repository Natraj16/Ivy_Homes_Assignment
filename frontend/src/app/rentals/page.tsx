"use client";

import { useState, useMemo } from "react";
import { usePaginated } from "@/lib/pagination";
import PropertyCard from "@/components/PropertyCard";
import { CardSkeletonGrid } from "@/components/LoadingSkeleton";

type Filters = { locality: string; bedrooms: string; furnishing: string };
const INIT: Filters = { locality: "", bedrooms: "", furnishing: "" };

export default function Rentals() {
  const [filters, setFilters] = useState<Filters>(INIT);
  const apiParams: Record<string, string> = {};
  if (filters.locality) apiParams.locality = filters.locality;
  if (filters.bedrooms) apiParams.bhk = filters.bedrooms;
  if (filters.furnishing) apiParams.furnishing = filters.furnishing;

  const { items, loading, error, hasMore, loadMore } = usePaginated<any>("/v1/rentals", apiParams);
  const filtered = useMemo(() => items.filter((r) => {
    if (filters.locality && r.locality?.toLowerCase() !== filters.locality.toLowerCase()) return false;
    if (filters.bedrooms && r.bedroom?.toString() !== filters.bedrooms) return false;
    if (filters.furnishing && r.furnishing?.toLowerCase() !== filters.furnishing.toLowerCase()) return false;
    return true;
  }), [items, filters]);

  const activeCount = Object.values(filters).filter(Boolean).length;
  const set = (k: keyof Filters) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setFilters((f) => ({ ...f, [k]: e.target.value }));

  return (
    <div style={{ display: "flex", gap: "28px" }}>
      <aside style={{ width: "260px", flexShrink: 0, background: "var(--color-meadow)", borderRadius: "var(--radius-card)", padding: "24px", display: "flex", flexDirection: "column", gap: "20px", alignSelf: "flex-start", position: "sticky", top: "80px" }}>
        <p style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--color-muted)" }}>
          Filters {activeCount > 0 && <span style={{ background: "var(--color-primary)", color: "#fff", borderRadius: "9999px", padding: "1px 7px", marginLeft: "6px", fontSize: "10px" }}>{activeCount}</span>}
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <label style={{ fontSize: "13px", fontWeight: 600, color: "var(--color-muted)" }}>Locality</label>
          <input type="text" value={filters.locality} onChange={set("locality")} placeholder="e.g. Koramangala" className="filter-input" />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <label style={{ fontSize: "13px", fontWeight: 600, color: "var(--color-muted)" }}>Bedrooms</label>
          <input type="number" min={1} value={filters.bedrooms} onChange={set("bedrooms")} placeholder="Any" className="filter-input" />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <label style={{ fontSize: "13px", fontWeight: 600, color: "var(--color-muted)" }}>Furnishing</label>
          <select value={filters.furnishing} onChange={set("furnishing")} className="filter-input">
            <option value="">Any</option>
            <option value="fully-furnished">Fully Furnished</option>
            <option value="semi-furnished">Semi-Furnished</option>
            <option value="unfurnished">Unfurnished</option>
          </select>
        </div>
        {activeCount > 0 && <button onClick={() => setFilters(INIT)} className="btn-tertiary" style={{ fontSize: "13px" }}>Clear all filters</button>}
      </aside>

      <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: "20px" }}>
        <div>
          <h1 className="text-headline-md" style={{ color: "var(--color-ink)" }}>Rentals</h1>
          {!loading && <p style={{ fontSize: "14px", color: "var(--color-muted)", marginTop: "4px" }}>{filtered.length} {filtered.length === 1 ? "rental" : "rentals"} in Bangalore</p>}
        </div>
        {error && <div style={{ padding: "10px 16px", background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: "12px" }}><p style={{ fontSize: "14px", color: "var(--color-error)" }}>{error}</p></div>}
        {loading && items.length === 0 ? <CardSkeletonGrid /> : filtered.length === 0 ? (
          <div style={{ padding: "80px 24px", textAlign: "center" }}><p style={{ fontSize: "15px", color: "var(--color-muted)" }}>No rentals match your filters.</p></div>
        ) : (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "16px" }}>
              {filtered.map((r) => (
                <PropertyCard key={r.listing_id} id={r.listing_id} type="rental"
                  title={r.title || `${r.bedroom} BHK Rental`}
                  locality={r.locality || "Bangalore"}
                  price={`₹ ${r.price?.toLocaleString("en-IN")}/mo`}
                  beds={r.bedroom} baths={r.bathroom} area={`${r.carpet_area} sqft`} />
              ))}
            </div>
            {hasMore && (
              <div style={{ display: "flex", justifyContent: "center", paddingTop: "12px" }}>
                <button onClick={loadMore} disabled={loading} className="btn-secondary" style={{ height: "40px" }}>{loading ? "Loading…" : "Load more"}</button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
