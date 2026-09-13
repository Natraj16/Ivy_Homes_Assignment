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
      const data: any = await fetchApi("/v1/favourites");
      setFavourites(data.results || []);
    } catch (e: any) {
      setError(e.message || "Failed to load saved listings.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);
  const handleRemove = (id: string) => setFavourites((prev) => prev.filter((f) => f.listing_id !== id));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <div>
        <h1 className="text-headline-md" style={{ color: "var(--color-ink)" }}>Saved</h1>
        {!loading && (
          <p style={{ fontSize: "14px", color: "var(--color-muted)", marginTop: "4px" }}>
            {favourites.length} saved {favourites.length === 1 ? "listing" : "listings"}
          </p>
        )}
      </div>

      {error && (
        <div style={{ padding: "10px 16px", background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: "12px" }}>
          <p style={{ fontSize: "14px", color: "var(--color-error)" }}>{error}</p>
        </div>
      )}

      {loading ? (
        <CardSkeletonGrid count={6} />
      ) : favourites.length === 0 ? (
        /* Empty state — Ditto: icon + copy + pill button */
        <div style={{ padding: "80px 24px", display: "flex", flexDirection: "column", alignItems: "center", gap: "16px", textAlign: "center" }}>
          <div style={{ width: "56px", height: "56px", borderRadius: "9999px", background: "var(--color-meadow)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="24" height="24" fill="none" stroke="var(--color-muted)" viewBox="0 0 24 24" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
          <p style={{ fontSize: "15px", color: "var(--color-muted)" }}>You haven't saved any listings yet.</p>
          <Link href="/listings" className="btn-primary" style={{ textDecoration: "none" }}>
            Browse listings
          </Link>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "16px" }}>
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
