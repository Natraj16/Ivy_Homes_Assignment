"use client";

import { useState, useMemo } from "react";
import { usePaginated } from "@/lib/pagination";
import PropertyCard from "@/components/PropertyCard";
import { CardSkeletonGrid } from "@/components/LoadingSkeleton";
import FilterSidebar, { Filters } from "@/components/FilterSidebar";

const INIT: Filters = { locality: "", bedrooms: "", minPrice: "", maxPrice: "", propertyType: "", furnishing: "" };

export default function Rentals() {
  const [filters, setFilters] = useState<Filters>(INIT);
  const apiParams: Record<string, string> = {};
  if (filters.locality) apiParams.locality = filters.locality;
  if (filters.bedrooms) apiParams.bhk = filters.bedrooms;
  if (filters.minPrice) apiParams.min_price = filters.minPrice;
  if (filters.maxPrice) apiParams.max_price = filters.maxPrice;
  if (filters.propertyType) apiParams.property_type = filters.propertyType;
  if (filters.furnishing) apiParams.furnishing = filters.furnishing;

  const { items, loading, error, hasMore, loadMore } = usePaginated<any>("/v1/rentals", apiParams);
  const filtered = useMemo(() => items.filter((r) => {
    if (filters.locality && r.locality?.toLowerCase() !== filters.locality.toLowerCase()) return false;
    if (filters.bedrooms && r.bedroom?.toString() !== filters.bedrooms) return false;
    if (filters.minPrice && (r.price || 0) < parseInt(filters.minPrice)) return false;
    if (filters.maxPrice && (r.price || 0) > parseInt(filters.maxPrice)) return false;
    if (filters.propertyType && r.property_type?.toLowerCase() !== filters.propertyType.toLowerCase()) return false;
    if (filters.furnishing && r.furnishing?.toLowerCase() !== filters.furnishing.toLowerCase()) return false;
    return true;
  }), [items, filters]);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Rentals</h1>
        <p className="text-sm text-zinc-500">
          {items.length} total loaded · {filtered.length} shown after filters
        </p>
      </div>

      <FilterSidebar filters={filters} onChange={setFilters} onClear={() => setFilters(INIT)} />

      {error && (
        <p className="text-sm text-red-600 bg-red-50 dark:bg-red-950/30 rounded-md px-3 py-2">{error}</p>
      )}

      {loading && items.length === 0 ? (
        <CardSkeletonGrid />
      ) : filtered.length === 0 ? (
        <p className="text-sm text-zinc-500 py-12 text-center">No rentals match your filters.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((r) => (
            <PropertyCard key={r.listing_id} id={r.listing_id} type="rental"
              title={r.title || `${r.bedroom} BHK Rental`}
              locality={r.locality || "Gurgaon"}
              price={`₹ ${r.price?.toLocaleString("en-IN")}/mo`}
              beds={r.bedroom} baths={r.bathroom} area={`${r.carpet_area} sqft`} />
          ))}
        </div>
      )}

      <div className="h-10 flex items-center justify-center">
        {loading && items.length > 0 && <span className="text-sm text-zinc-500">Loading more…</span>}
        {!loading && hasMore && (
          <button onClick={loadMore} className="text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 underline">Load more</button>
        )}
        {!loading && !hasMore && items.length > 0 && (
          <span className="text-sm text-zinc-400">End of results ({items.length} items loaded)</span>
        )}
      </div>
    </div>
  );
}
