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
    <div className="flex flex-col md:flex-row gap-7 items-start">
      <aside className="w-full md:w-[260px] shrink-0 bg-[var(--color-meadow)] rounded-[var(--radius-card)] p-6 flex flex-col gap-5 md:sticky md:top-[100px]">
        <p className="text-label-sm text-[var(--color-muted)] flex items-center">
          Filters {activeCount > 0 && <span className="bg-[var(--color-primary)] text-white rounded-full px-2 py-[1px] ml-1.5 text-[10px] leading-tight">{activeCount}</span>}
        </p>
        <div className="flex flex-col gap-1.5">
          <label className="text-[13px] font-semibold text-[var(--color-muted)]">Locality</label>
          <input type="text" value={filters.locality} onChange={set("locality")} placeholder="e.g. Koramangala" className="filter-input" />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-[13px] font-semibold text-[var(--color-muted)]">Bedrooms</label>
          <input type="number" min={1} value={filters.bedrooms} onChange={set("bedrooms")} placeholder="Any" className="filter-input" />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-[13px] font-semibold text-[var(--color-muted)]">Furnishing</label>
          <select value={filters.furnishing} onChange={set("furnishing")} className="filter-input">
            <option value="">Any</option>
            <option value="fully-furnished">Fully Furnished</option>
            <option value="semi-furnished">Semi-Furnished</option>
            <option value="unfurnished">Unfurnished</option>
          </select>
        </div>
        {activeCount > 0 && <button onClick={() => setFilters(INIT)} className="btn-tertiary text-[13px] self-start">Clear all filters</button>}
      </aside>

      <div className="flex-1 min-w-0 flex flex-col gap-5">
        <div>
          <h1 className="text-display text-[var(--color-ink)]">Rentals</h1>
          {!loading && <p className="text-body-md text-[var(--color-muted)] mt-1">{filtered.length} {filtered.length === 1 ? "rental" : "rentals"} in Bangalore</p>}
        </div>
        {error && <div className="p-4 bg-[#FEF2F2] border border-[#FECACA] rounded-[var(--radius-sm)]"><p className="text-body-sm text-[var(--color-error)]">{error}</p></div>}
        {loading && items.length === 0 ? <CardSkeletonGrid /> : filtered.length === 0 ? (
          <div className="py-20 px-6 text-center"><p className="text-[15px] text-[var(--color-muted)]">No rentals match your filters.</p></div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map((r) => (
                <PropertyCard key={r.listing_id} id={r.listing_id} type="rental"
                  title={r.title || `${r.bedroom} BHK Rental`}
                  locality={r.locality || "Bangalore"}
                  price={`₹ ${r.price?.toLocaleString("en-IN")}/mo`}
                  beds={r.bedroom} baths={r.bathroom} area={`${r.carpet_area} sqft`} />
              ))}
            </div>
            {hasMore && (
              <div className="flex justify-center pt-4">
                <button onClick={loadMore} disabled={loading} className="btn-secondary h-10 px-6">{loading ? "Loading…" : "Load more"}</button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
