"use client";

import { useState, useMemo, useEffect } from "react";
import { usePaginated } from "@/lib/pagination";
import { fetchApi } from "@/lib/api";
import PropertyCard from "@/components/PropertyCard";
import { CardSkeletonGrid } from "@/components/LoadingSkeleton";
import FilterSidebar, { Filters } from "@/components/FilterSidebar";

const INIT: Filters = { locality: "", bedrooms: "", minPrice: "", maxPrice: "", propertyType: "" };

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
  if (filters.propertyType) apiParams.property_type = filters.propertyType;

  const { items: filtered, loading, error, page, setPage, limit, total } = usePaginated<any>("/v1/listings", apiParams);



  const activeCount = Object.values(filters).filter(Boolean).length;
  const handleSaveToggle = (id: string, saved: boolean) => setSavedIds((prev) => {
    const next = new Set(prev); saved ? next.add(id) : next.delete(id); return next;
  });

  return (
    <div className="flex flex-col md:flex-row gap-7 items-start">
      {/* Sidebar */}
      <FilterSidebar filters={filters} onChange={setFilters} onClear={() => setFilters(INIT)} />

      {/* Main */}
      <div className="flex-1 min-w-0 flex flex-col gap-6 mt-1">
        <div>
          <h1 className="text-[28px] font-semibold text-[#111827]">Homes in Bangalore</h1>
          {!loading && (
            <p className="text-body-md text-[var(--color-muted)] mt-1">
              {filtered.length} {filtered.length === 1 ? "listing" : "listings"} in Bangalore
            </p>
          )}
        </div>

        {error && <ErrorBanner message={error} />}

        {loading && filtered.length === 0 ? (
          <CardSkeletonGrid />
        ) : filtered.length === 0 ? (
          <EmptyState message="No listings match your filters." />
        ) : (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
