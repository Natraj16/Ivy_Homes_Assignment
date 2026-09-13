"use client";

import { useState, useMemo, useEffect } from "react";
import { usePaginated } from "@/lib/pagination";
import { fetchApi } from "@/lib/api";
import PropertyCard from "@/components/PropertyCard";
import { CardSkeletonGrid } from "@/components/LoadingSkeleton";

type Filters = { locality: string; bedrooms: string; minPrice: string; maxPrice: string; furnishing: string };
const INIT: Filters = { locality: "", bedrooms: "", minPrice: "", maxPrice: "", furnishing: "" };

export default function Listings() {
  const [filters, setFilters] = useState<Filters>(INIT);
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchApi("/v1/favourites")
      .then((res: any) => setSavedIds(new Set((res.results || []).map((f: any) => f.listing_id))))
      .catch(() => {});
  }, []);

  const apiParams: Record<string, string> = {};
  if (filters.locality) apiParams.locality = filters.locality;
  if (filters.bedrooms) apiParams.bedroom = filters.bedrooms;

  const { items, loading, error, hasMore, loadMore } = usePaginated<any>("/v1/listings", apiParams);

  const filtered = useMemo(() => items.filter((item) => {
    if (filters.locality && item.locality?.toLowerCase() !== filters.locality.toLowerCase()) return false;
    if (filters.bedrooms && item.bedroom?.toString() !== filters.bedrooms) return false;
    if (filters.minPrice && (item.price || 0) < parseInt(filters.minPrice)) return false;
    if (filters.maxPrice && (item.price || 0) > parseInt(filters.maxPrice)) return false;
    if (filters.furnishing && item.furnishing?.toLowerCase() !== filters.furnishing.toLowerCase()) return false;
    return true;
  }), [items, filters]);

  const activeCount = Object.values(filters).filter(Boolean).length;
  const set = (k: keyof Filters) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setFilters((f) => ({ ...f, [k]: e.target.value }));
  const handleSaveToggle = (id: string, saved: boolean) => setSavedIds((prev) => {
    const next = new Set(prev); saved ? next.add(id) : next.delete(id); return next;
  });

  return (
    <div style={{ display: "flex", gap: "28px" }}>
      {/* Sidebar — Ditto: meadow bg, no shadow, 24px radius */}
      <aside style={{
        width: "260px",
        flexShrink: 0,
        background: "var(--color-meadow)",
        borderRadius: "var(--radius-card)",
        padding: "24px",
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        alignSelf: "flex-start",
        position: "sticky",
        top: "80px",
      }}>
        <p style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--color-muted)" }}>
          Filters {activeCount > 0 && <span style={{ background: "var(--color-primary)", color: "#fff", borderRadius: "9999px", padding: "1px 7px", marginLeft: "6px", fontSize: "10px" }}>{activeCount}</span>}
        </p>

        <SidebarField label="Locality">
          <input type="text" value={filters.locality} onChange={set("locality")} placeholder="e.g. Whitefield" className="filter-input" />
        </SidebarField>
        <SidebarField label="Bedrooms">
          <input type="number" min={1} value={filters.bedrooms} onChange={set("bedrooms")} placeholder="Any" className="filter-input" />
        </SidebarField>
        <SidebarField label="Min price (₹)">
          <input type="number" value={filters.minPrice} onChange={set("minPrice")} placeholder="0" className="filter-input" />
        </SidebarField>
        <SidebarField label="Max price (₹)">
          <input type="number" value={filters.maxPrice} onChange={set("maxPrice")} placeholder="No limit" className="filter-input" />
        </SidebarField>
        <SidebarField label="Furnishing">
          <select value={filters.furnishing} onChange={set("furnishing")} className="filter-input">
            <option value="">Any</option>
            <option value="fully-furnished">Fully Furnished</option>
            <option value="semi-furnished">Semi-Furnished</option>
            <option value="unfurnished">Unfurnished</option>
          </select>
        </SidebarField>

        {activeCount > 0 && (
          <button onClick={() => setFilters(INIT)} className="btn-tertiary" style={{ fontSize: "13px" }}>
            Clear all filters
          </button>
        )}
      </aside>

      {/* Main */}
      <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: "20px" }}>
        <div>
          <h1 className="text-headline-md" style={{ color: "var(--color-ink)" }}>Listings</h1>
          {!loading && (
            <p style={{ fontSize: "14px", color: "var(--color-muted)", marginTop: "4px" }}>
              {filtered.length} {filtered.length === 1 ? "listing" : "listings"} in Bangalore
            </p>
          )}
        </div>

        {error && <ErrorBanner message={error} />}

        {loading && items.length === 0 ? (
          <CardSkeletonGrid />
        ) : filtered.length === 0 ? (
          <EmptyState message="No listings match your filters." />
        ) : (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "16px" }}>
              {filtered.map((listing) => (
                <PropertyCard
                  key={listing.listing_id}
                  id={listing.listing_id}
                  type="listing"
                  title={`${listing.bedroom} BHK ${listing.property_type || "Apartment"} · ${listing.apartment_name || listing.locality}`}
                  locality={listing.locality || "Bangalore"}
                  price={`₹ ${(listing.price / 10000000).toFixed(2)} Cr`}
                  beds={listing.bedroom}
                  baths={listing.bathroom}
                  area={`${listing.carpet_area} sqft`}
                  isVerified={listing.is_verified}
                  isSaved={savedIds.has(listing.listing_id)}
                  onSaveToggle={handleSaveToggle}
                />
              ))}
            </div>
            {hasMore && (
              <div style={{ display: "flex", justifyContent: "center", paddingTop: "12px" }}>
                <button onClick={loadMore} disabled={loading} className="btn-secondary" style={{ height: "40px" }}>
                  {loading ? "Loading…" : "Load more"}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function SidebarField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
      <label style={{ fontSize: "13px", fontWeight: 600, color: "var(--color-muted)" }}>{label}</label>
      {children}
    </div>
  );
}

function ErrorBanner({ message }: { message: string }) {
  return (
    <div style={{ padding: "10px 16px", background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: "12px" }}>
      <p style={{ fontSize: "14px", color: "var(--color-error)" }}>{message}</p>
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div style={{ padding: "80px 24px", textAlign: "center" }}>
      <p style={{ fontSize: "15px", color: "var(--color-muted)" }}>{message}</p>
    </div>
  );
}
