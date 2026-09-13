"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { fetchApi } from "@/lib/api";

export default function ListingDetail() {
  const { id } = useParams<{ id: string }>();
  const [listing, setListing] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isSaved, setIsSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!id) return;
    
    // Check saved status synchronously if possible
    import('@/lib/favourites').then(({ getSavedListingIds }) => {
      setIsSaved(getSavedListingIds().includes(id as string));
    });

    fetchApi(`/v1/listing/${id}`)
      .then((l) => setListing(l))
      .catch((e) => setError(e.message || "Failed to load listing."))
      .finally(() => setLoading(false));
  }, [id]);

  const toggleSave = async () => {
    if (saving) return;
    setSaving(true);
    const next = !isSaved;
    setIsSaved(next);
    try {
      const { saveListingId, removeListingId } = await import('@/lib/favourites');
      if (!next) {
        removeListingId(id as string);
      } else {
        saveListingId(id as string);
      }
    } catch {
      setIsSaved(!next);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="max-w-6xl mx-auto animate-pulse space-y-4 py-8">
      <div className="h-10 bg-[var(--color-border)] rounded-full w-2/3" />
      <div className="h-72 bg-[var(--color-meadow)] rounded-[var(--radius-card)]" />
    </div>
  );

  if (error) return (
    <div className="py-12 text-center">
      <p className="text-body-md text-[var(--color-error)] mb-4">{error}</p>
      <Link href="/listings" className="text-label-md text-[var(--color-primary)] hover:underline">← Back to listings</Link>
    </div>
  );

  if (!listing) return null;

  const priceFormatted = `₹ ${(listing.price / 10000000).toFixed(2)} Cr`;

  return (
    <div className="max-w-6xl mx-auto py-[var(--sp-24)]">
      {/* Breadcrumb */}
      <div className="mb-[var(--sp-32)]">
        <Link href="/listings" className="text-label text-[var(--color-primary)] hover:underline flex items-center gap-2">
          <span>←</span> Back to Listings
        </Link>
      </div>

      <div className="flex flex-col lg:flex-row gap-[var(--sp-48)]">
        {/* Left Column: Details */}
        <div className="flex-1 min-w-0 flex flex-col gap-[var(--sp-48)]">
          
          {/* Header */}
          <div>
            <div className="flex gap-2 mb-[var(--sp-16)]">
              <span className="chip">{listing.property_type || "Property"}</span>
              {listing.is_verified && <span className="chip bg-[var(--color-success)] text-white">Verified</span>}
            </div>
            <h1 className="text-display text-[var(--color-ink)] mb-[var(--sp-8)]">
              {`${listing.bedroom} BHK ${listing.property_type || "Apartment"} in ${listing.locality}`}
            </h1>
            <p className="text-heading-sm text-[var(--color-muted)] capitalize">
              {listing.apartment_name} • {listing.locality}
            </p>
          </div>

          {/* Description */}
          {listing.description && (
            <div>
              <h2 className="text-heading-sm text-[var(--color-ink)] mb-[var(--sp-16)]">About this property</h2>
              <div className="card-white shadow-sm leading-relaxed text-body text-[var(--color-body)]">
                {listing.description}
              </div>
            </div>
          )}

          {/* Key Specifications Grid */}
          <div>
            <h2 className="text-heading-sm text-[var(--color-ink)] mb-[var(--sp-16)]">Key Specifications</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-[var(--sp-16)]">
              <div className="card text-center flex flex-col justify-center gap-1">
                <p className="text-label-sm text-[var(--color-muted)]">Bedrooms</p>
                <p className="text-heading text-[var(--color-ink)]">{listing.bedroom || "—"}</p>
              </div>
              <div className="card text-center flex flex-col justify-center gap-1">
                <p className="text-label-sm text-[var(--color-muted)]">Bathrooms</p>
                <p className="text-heading text-[var(--color-ink)]">{listing.bathroom || "—"}</p>
              </div>
              <div className="card text-center flex flex-col justify-center gap-1">
                <p className="text-label-sm text-[var(--color-muted)]">Furnishing</p>
                <p className="text-heading text-[var(--color-ink)] capitalize">{listing.furnishing || "—"}</p>
              </div>
              <div className="card text-center flex flex-col justify-center gap-1">
                <p className="text-label-sm text-[var(--color-muted)]">Carpet Area</p>
                <p className="text-heading text-[var(--color-ink)]">{listing.carpet_area ? `${listing.carpet_area} sqft` : "—"}</p>
              </div>
            </div>
          </div>

          {/* Additional details */}
          <div>
             <h2 className="text-heading-sm text-[var(--color-ink)] mb-[var(--sp-16)]">More Details</h2>
             <div className="card-white grid grid-cols-1 sm:grid-cols-2 gap-[var(--sp-16)]">
                <div className="flex justify-between py-2 border-b border-[var(--color-border)] last:border-0">
                  <span className="text-body text-[var(--color-muted)]">Super Built-up Area</span>
                  <span className="text-body-md text-[var(--color-ink)] font-medium">{listing.super_built_up_area ? `${listing.super_built_up_area} sqft` : "—"}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-[var(--color-border)] last:border-0">
                  <span className="text-body text-[var(--color-muted)]">Floor</span>
                  <span className="text-body-md text-[var(--color-ink)] font-medium">{listing.floor ? `${listing.floor} / ${listing.total_floors}` : "—"}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-[var(--color-border)] last:border-0">
                  <span className="text-body text-[var(--color-muted)]">Balcony</span>
                  <span className="text-body-md text-[var(--color-ink)] font-medium">{listing.balcony || "—"}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-[var(--color-border)] last:border-0">
                  <span className="text-body text-[var(--color-muted)]">Facing Direction</span>
                  <span className="text-body-md text-[var(--color-ink)] font-medium capitalize">{listing.facing_direction || "—"}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-[var(--color-border)] last:border-0">
                  <span className="text-body text-[var(--color-muted)]">Covered Parking</span>
                  <span className="text-body-md text-[var(--color-ink)] font-medium">{listing.covered_parking || "—"}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-[var(--color-border)] last:border-0">
                  <span className="text-body text-[var(--color-muted)]">Listing ID</span>
                  <span className="text-body-md text-[var(--color-ink)] font-medium font-mono text-[13px]">{listing.listing_id}</span>
                </div>
             </div>
          </div>
        </div>

        {/* Right Column: Pricing & Actions (Sticky) */}
        <div className="lg:w-[380px] shrink-0">
          <div className="card flex flex-col gap-[var(--sp-24)] lg:sticky lg:top-[100px]">
            
            <div className="flex items-center justify-between">
              <span className="chip">For Sale</span>
            </div>

            <div className="flex flex-col gap-[var(--sp-8)]">
              <p className="text-label text-[var(--color-muted)]">Asking Price</p>
              <p className="text-display text-[var(--color-primary)]">
                {priceFormatted}
              </p>
              <p className="text-caption text-[var(--color-muted)]">
                {listing.bedroom} bed · {listing.bathroom} bath · {listing.carpet_area} sqft
              </p>
            </div>

            <div className="flex flex-col gap-[var(--sp-12)] mt-[var(--sp-8)]">
              <button
                onClick={toggleSave}
                disabled={saving}
                className={isSaved ? "btn-secondary" : "btn-primary"}
                style={{ width: "100%" }}
              >
                {isSaved ? "Saved ✓" : "Save Listing"}
              </button>
            </div>

            <div className="card-white flex flex-col p-[var(--sp-16)] gap-2 mt-[var(--sp-8)]">
               <p className="text-label text-[var(--color-ink)]">Interested?</p>
               <p className="text-body-sm text-[var(--color-muted)]">Contact Ivy Homes for a viewing or offer.</p>
               {listing.posted_by_contact && (
                 <a href={`tel:${listing.posted_by_contact}`} className="text-label-md text-[var(--color-primary)] hover:underline mt-2 inline-block">
                   Call {listing.posted_by_name || "Agent"}
                 </a>
               )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
