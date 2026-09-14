"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { fetchApi } from "@/lib/api";
import PropertyCard from "@/components/PropertyCard";
import { CardSkeletonGrid } from "@/components/LoadingSkeleton";

export default function Saved() {
  const [favourites, setFavourites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const { getSavedListingIds } = await import('@/lib/favourites');
      const ids = getSavedListingIds();
      if (ids.length === 0) {
        setFavourites([]);
        return;
      }
      const results = await Promise.all(
        ids.map(id => fetchApi(`/v1/listings/${id}`).catch(() => null))
      );
      setFavourites(results.filter(Boolean));
    } catch (e: any) {
      setError(e.message || "Failed to load saved listings.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);
  const handleRemove = (id: string) => setFavourites((prev) => prev.filter((f) => f.listing_id !== id));

  return (
    <div className="flex flex-col gap-6 py-4">
      <div>
        <h1 className="text-display text-[var(--color-ink)]">Saved Listings</h1>
        {!loading && (
          <p className="text-body-md text-[var(--color-muted)] mt-1">
            {favourites.length} saved {favourites.length === 1 ? "listing" : "listings"}
          </p>
        )}
      </div>

      {error && (
        <div className="bg-[#FEF2F2] border border-[#FECACA] rounded-[var(--radius-sm)] p-4">
          <p className="text-body-sm text-[var(--color-error)]">{error}</p>
        </div>
      )}

      {loading ? (
        <CardSkeletonGrid count={6} />
      ) : favourites.length === 0 ? (
        /* Empty state */
        <div className="py-20 px-6 flex flex-col items-center gap-4 text-center">
          <div className="w-14 h-14 rounded-full bg-[var(--color-meadow)] flex items-center justify-center">
            <svg width="24" height="24" fill="none" stroke="var(--color-muted)" viewBox="0 0 24 24" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
          <p className="text-body-md text-[var(--color-muted)]">You haven't saved any listings yet.</p>
          <Link href="/listings" className="btn-primary">
            Browse listings
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {favourites.map((item) => (
            <PropertyCard
              key={item.listing_id}
              id={item.listing_id}
              type="listing"
              title={`${item.bedroom} BHK ${item.property_type || "Apartment"} · ${item.apartment_name || item.locality}`}
              locality={item.locality || "Bangalore"}
              price={`₹ ${(item.price / 10000000).toFixed(2)} Cr`}
              beds={item.bedroom}
              baths={item.bathroom}
              area={`${item.carpet_area} sqft`}
              isVerified={item.is_verified}
              isSaved={true}
              onSaveToggle={(id, saved) => { if (!saved) handleRemove(id); }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
