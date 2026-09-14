"use client";

import { useState, useMemo } from "react";
import { usePaginated } from "@/lib/pagination";
import PropertyCard from "@/components/PropertyCard";
import { CardSkeletonGrid } from "@/components/LoadingSkeleton";
import FilterSidebar, { Filters } from "@/components/FilterSidebar";

const INIT: Filters = { locality: "", bedrooms: "", minPrice: "", maxPrice: "", propertyType: "" };

export default function Rentals() {
  const [filters, setFilters] = useState<Filters>(INIT);
  const apiParams: Record<string, string> = {};
  if (filters.locality) apiParams.locality = filters.locality;
  if (filters.bedrooms) apiParams.bhk = filters.bedrooms;
  if (filters.minPrice) apiParams.min_price = filters.minPrice;
  if (filters.maxPrice) apiParams.max_price = filters.maxPrice;
  if (filters.propertyType) apiParams.property_type = filters.propertyType;
  if (filters.furnishing) apiParams.furnishing = filters.furnishing;

  const { items: filtered, loading, error, page, setPage, limit, total } = usePaginated<any>("/v1/rentals", apiParams);

  return (
    <div className="flex flex-col md:flex-row gap-7 items-start">
      <FilterSidebar filters={filters} onChange={setFilters} onClear={() => setFilters(INIT)} />

      <div className="flex-1 min-w-0 flex flex-col gap-6 mt-1">
        <div>
          <h1 className="text-[28px] font-semibold text-[#111827]">Rentals in Bangalore</h1>
          {!loading && <p className="text-body-md text-[var(--color-muted)] mt-1">{filtered.length} {filtered.length === 1 ? "rental" : "rentals"} in Bangalore</p>}
        </div>
        {error && <div className="p-4 bg-[#FEF2F2] border border-[#FECACA] rounded-[var(--radius-sm)]"><p className="text-body-sm text-[var(--color-error)]">{error}</p></div>}
        {loading && filtered.length === 0 ? <CardSkeletonGrid /> : filtered.length === 0 ? (
          <div className="py-20 px-6 text-center"><p className="text-[15px] text-[var(--color-muted)]">No rentals match your filters.</p></div>
        ) : (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filtered.map((r) => (
                <PropertyCard key={r.listing_id} id={r.listing_id} type="rental"
                  title={r.title || `${r.bedroom} BHK Rental`}
                  locality={r.locality || "Bangalore"}
                  price={`₹ ${r.price?.toLocaleString("en-IN")}/mo`}
                  beds={r.bedroom} baths={r.bathroom} area={`${r.carpet_area} sqft`} />
              ))}
            </div>
            {total > limit && (
              <div className="flex items-center justify-center gap-4 mt-8 pt-4 border-t border-[#E4E4E7]">
                <button 
                  disabled={page === 1} 
                  onClick={() => setPage(page - 1)} 
                  className="px-4 py-2 bg-white border border-[#E4E4E7] rounded-full text-sm font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <span className="text-sm text-[#666]">
                  Page <span className="font-semibold text-[#111827]">{page}</span> of {Math.ceil(total / limit)}
                </span>
                <button 
                  disabled={page >= Math.ceil(total / limit)} 
                  onClick={() => setPage(page + 1)} 
                  className="px-4 py-2 bg-white border border-[#E4E4E7] rounded-full text-sm font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
