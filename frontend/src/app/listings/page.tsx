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
  if (filters.bedrooms) apiParams.bhk = filters.bedrooms;
  if (filters.minPrice) apiParams.min_price = filters.minPrice;
  if (filters.maxPrice) apiParams.max_price = filters.maxPrice;
  if (filters.furnishing) apiParams.furnishing = filters.furnishing;

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
    <div className="flex flex-col md:flex-row gap-7 items-start">
      {/* Sidebar */}
      <aside className="w-full md:w-[260px] shrink-0 bg-[var(--color-meadow)] rounded-[var(--radius-card)] p-6 flex flex-col gap-5 md:sticky md:top-[100px]">
        <p className="text-label-sm text-[var(--color-muted)] flex items-center">
          Filters {activeCount > 0 && <span className="bg-[var(--color-primary)] text-white rounded-full px-2 py-[1px] ml-1.5 text-[10px] leading-tight">{activeCount}</span>}
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
          <button onClick={() => setFilters(INIT)} className="btn-tertiary text-[13px] self-start">
            Clear all filters
          </button>
        )}
      </aside>

      {/* Main */}
      <div className="flex-1 min-w-0 flex flex-col gap-5">
        <div>
          <h1 className="text-display text-[var(--color-ink)]">Listings</h1>
          {!loading && (
            <p className="text-body-md text-[var(--color-muted)] mt-1">
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
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
              <div className="flex justify-center pt-4">
                <button onClick={loadMore} disabled={loading} className="btn-secondary h-10 px-6">
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
    <div className="flex flex-col gap-1.5">
      <label className="text-[13px] font-semibold text-[var(--color-muted)]">{label}</label>
      {children}
    </div>
  );
}

function ErrorBanner({ message }: { message: string }) {
  return (
    <div className="p-4 bg-[#FEF2F2] border border-[#FECACA] rounded-[var(--radius-sm)]">
      <p className="text-body-sm text-[var(--color-error)]">{message}</p>
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="py-20 px-6 text-center">
      <p className="text-[15px] text-[var(--color-muted)]">{message}</p>
    </div>
  );
}
