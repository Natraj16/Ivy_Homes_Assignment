"use client";

import { useState, useMemo } from "react";
import { usePaginated } from "@/lib/pagination";
import PropertyCard from "@/components/PropertyCard";
import { CardSkeletonGrid } from "@/components/LoadingSkeleton";

type Filters = { locality: string; status: string };
const INIT: Filters = { locality: "", status: "" };

export default function Projects() {
  const [filters, setFilters] = useState<Filters>(INIT);
  const apiParams: Record<string, string> = {};
  if (filters.locality) apiParams.locality = filters.locality;
  if (filters.status) apiParams.project_status = filters.status;

  const { items, loading, error, hasMore, loadMore } = usePaginated<any>("/v1/projects", apiParams);
  const filtered = useMemo(() => items.filter((p) => {
    if (filters.locality && p.locality?.toLowerCase() !== filters.locality.toLowerCase()) return false;
    if (filters.status && p.project_status?.toLowerCase() !== filters.status.toLowerCase()) return false;
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
          <input type="text" value={filters.locality} onChange={set("locality")} placeholder="e.g. Whitefield" className="filter-input" />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <label style={{ fontSize: "13px", fontWeight: 600, color: "var(--color-muted)" }}>Status</label>
          <select value={filters.status} onChange={set("status")} className="filter-input">
            <option value="">Any</option>
            <option value="under construction">Under Construction</option>
            <option value="ready to move">Ready to Move</option>
          </select>
        </div>
        {activeCount > 0 && <button onClick={() => setFilters(INIT)} className="btn-tertiary" style={{ fontSize: "13px" }}>Clear all filters</button>}
      </aside>

      <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: "20px" }}>
        <div>
          <h1 className="text-headline-md" style={{ color: "var(--color-ink)" }}>Projects</h1>
          {!loading && <p style={{ fontSize: "14px", color: "var(--color-muted)", marginTop: "4px" }}>{filtered.length} {filtered.length === 1 ? "project" : "projects"} found</p>}
        </div>
        {error && <div style={{ padding: "10px 16px", background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: "12px" }}><p style={{ fontSize: "14px", color: "var(--color-error)" }}>{error}</p></div>}
        {loading && items.length === 0 ? <CardSkeletonGrid /> : filtered.length === 0 ? (
          <div style={{ padding: "80px 24px", textAlign: "center" }}><p style={{ fontSize: "15px", color: "var(--color-muted)" }}>No projects match your filters.</p></div>
        ) : (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "16px" }}>
              {filtered.map((p) => (
                <PropertyCard key={p.project_id} id={p.project_id} type="project"
                  title={`${p.developer_name || ""} ${p.apartment_name || ""}`.trim()}
                  locality={p.locality || "Bangalore"}
                  price={p.price_min ? `₹ ${(p.price_min / 10000000).toFixed(1)} – ${(p.price_max / 10000000).toFixed(1)} Cr` : "Price on request"}
                  beds="" baths="" area={p.total_units ? `${p.total_units} units` : ""} />
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
