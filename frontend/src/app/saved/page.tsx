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
      const { getSavedListingIds } = await import("@/lib/favourites");
      const ids = getSavedListingIds();
      if (ids.length === 0) {
        setFavourites([]);
        return;
      }
      const results = await Promise.all(
        ids.map((id) => fetchApi(`/v1/listings/${id}`).catch(() => null))
      );
      setFavourites(results.filter(Boolean));
    } catch (e: any) {
      setError(e.message || "Failed to load saved listings.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleRemove = (id: string) => {
    setFavourites((prev) => prev.filter((f) => f.listing_id !== id));
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Saved Listings</h1>
        {!loading && (
          <p className="text-sm text-zinc-500">
            {favourites.length} saved {favourites.length === 1 ? "listing" : "listings"}
          </p>
        )}
      </div>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 dark:bg-red-950/30 rounded-md px-3 py-2">
          {error}
        </p>
      )}

      {loading ? (
        <CardSkeletonGrid count={6} />
      ) : favourites.length === 0 ? (
        <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 p-8 text-center flex flex-col items-center gap-3">
          <p className="text-sm text-zinc-500">You haven't saved any listings yet.</p>
          <Link
            href="/listings"
            className="rounded-md bg-zinc-900 text-white dark:bg-zinc-100 dark:text-black px-4 py-2 text-sm font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
          >
            Browse listings
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {favourites.map((item) => {
            const propType = (item.property_type || "Apartment").replace(/\b\w/g, (c: string) => c.toUpperCase());
            const aptName = item.apartment_name || (item.locality ? item.locality.replace(/\b\w/g, (c: string) => c.toUpperCase()) : "Gurgaon");
            return (
              <PropertyCard
                key={item.listing_id}
                id={item.listing_id}
                type="listing"
                title={`${item.bedroom} BHK ${propType} · ${aptName}`}
                locality={item.locality || "Gurgaon"}
                price={`₹ ${(item.price / 10000000).toFixed(2)} Cr`}
                beds={item.bedroom}
                baths={item.bathroom}
                area={item.carpet_area}
                isVerified={item.is_verified}
                isSaved={true}
                onSaveToggle={(id, saved) => {
                  if (!saved) handleRemove(id);
                }}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
