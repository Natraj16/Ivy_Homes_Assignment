"use client";

import { useState, useMemo, useEffect } from "react";
import { usePaginated } from "@/lib/pagination";
import { fetchApi } from "@/lib/api";
import PropertyCard from "@/components/PropertyCard";
import { CardSkeletonGrid } from "@/components/LoadingSkeleton";
import FilterSidebar, { Filters } from "@/components/FilterSidebar";

const INIT: Filters = { locality: "", bedrooms: "", minPrice: "", maxPrice: "", propertyType: "", furnishing: "" };

export default function Listings() {
  const [filters, setFilters] = useState<Filters>(INIT);
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchApi("/v1/favourites")
      .then((res: any) => setSavedIds(new Set((res.results || []).map((f: any) => f.listing_id))))
      .catch(() => { });
  }, []);

  const apiParams: Record<string, string> = {};
  if (filters.locality) apiParams.locality = filters.locality;
  if (filters.bedrooms) apiParams.bhk = filters.bedrooms;
  if (filters.minPrice) apiParams.min_price = filters.minPrice;
  if (filters.maxPrice) apiParams.max_price = filters.maxPrice;
  if (filters.propertyType) apiParams.property_type = filters.propertyType;
  if (filters.furnishing) apiParams.furnishing = filters.furnishing;

  const { items, loading, error, hasMore, loadMore } = usePaginated<any>("/v1/listings", apiParams);

  const filtered = useMemo(() => items.filter((item) => {
    if (filters.locality && item.locality?.toLowerCase() !== filters.locality.toLowerCase()) return false;
    if (filters.bedrooms && item.bedroom?.toString() !== filters.bedrooms) return false;
    if (filters.minPrice && (item.price || 0) < parseInt(filters.minPrice)) return false;
    if (filters.maxPrice && (item.price || 0) > parseInt(filters.maxPrice)) return false;
    if (filters.propertyType && item.property_type?.toLowerCase() !== filters.propertyType.toLowerCase()) return false;
    if (filters.furnishing && item.furnishing?.toLowerCase() !== filters.furnishing.toLowerCase()) return false;
    return true;
  }), [items, filters]);

  const handleSaveToggle = (id: string, saved: boolean) => setSavedIds((prev) => {
    const next = new Set(prev); saved ? next.add(id) : next.delete(id); return next;
  });

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold">Listings</h1>
        <p className="text-sm text-zinc-500">
          {items.length} total loaded · {filtered.length} shown after filters
        </p>
      </div>

      {/* Filter bar */}
      <FilterSidebar filters={filters} onChange={setFilters} onClear={() => setFilters(INIT)} />

      {/* Error */}
      {error && (
        <p className="text-sm text-red-600 bg-red-50 dark:bg-red-950/30 rounded-md px-3 py-2">{error}</p>
      )}

      {/* Cards */}
      {loading && items.length === 0 ? (
        <CardSkeletonGrid />
      ) : filtered.length === 0 ? (
        <p className="text-sm text-zinc-500 py-12 text-center">No listings match your filters.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((listing) => {
            const propType = (listing.property_type || "Apartment").replace(/\b\w/g, (c: string) => c.toUpperCase());
            const aptName = listing.apartment_name || (listing.locality ? listing.locality.replace(/\b\w/g, (c: string) => c.toUpperCase()) : "Gurgaon");
            return (
              <PropertyCard
                key={listing.listing_id}
                id={listing.listing_id}
                type="listing"
                title={`${listing.bedroom} BHK ${propType} · ${aptName}`}
                locality={listing.locality || "Gurgaon"}
                price={`₹ ${(listing.price / 10000000).toFixed(2)} Cr`}
                beds={listing.bedroom}
                baths={listing.bathroom}
                area={listing.carpet_area}
                isVerified={listing.is_verified}
                isSaved={savedIds.has(listing.listing_id)}
                onSaveToggle={handleSaveToggle}
              />
            );
          })}
        </div>
      )}

      {/* Load more sentinel */}
      <div className="h-10 flex items-center justify-center">
        {loading && items.length > 0 && (
          <span className="text-sm text-zinc-500">Loading more…</span>
        )}
        {!loading && hasMore && (
          <button onClick={loadMore} className="text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 underline">
            Load more
          </button>
        )}
        {!loading && !hasMore && items.length > 0 && (
          <span className="text-sm text-zinc-400">End of results ({items.length} items loaded)</span>
        )}
      </div>
    </div>
  );
}
