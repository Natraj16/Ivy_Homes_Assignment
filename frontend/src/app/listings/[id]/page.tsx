"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { fetchApi } from "@/lib/api";

function FactRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex justify-between items-baseline py-3 border-b border-[#E4E4E7] last:border-0">
      <span className="text-body-sm text-[#666]">{label}</span>
      <span className="text-body-md text-[#303030] text-right max-w-[60%]">{value}</span>
    </div>
  );
}

export default function ListingDetail() {
  const { id } = useParams<{ id: string }>();
  const [listing, setListing] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isSaved, setIsSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!id) return;
    Promise.all([
      fetchApi(`/v1/listing/${id}`),
      fetchApi("/v1/favourites"),
    ])
      .then(([l, favs]: [any, any]) => {
        setListing(l);
        setIsSaved((favs.results || []).some((f: any) => f.listing_id === id));
      })
      .catch((e) => setError(e.message || "Failed to load listing."))
      .finally(() => setLoading(false));
  }, [id]);

  const toggleSave = async () => {
    if (saving) return;
    setSaving(true);
    const next = !isSaved;
    setIsSaved(next);
    try {
      if (!next) {
        await fetchApi(`/v1/favourites/${id}`, { method: "DELETE" });
      } else {
        await fetchApi("/v1/favourites", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id }),
        });
      }
    } catch {
      setIsSaved(!next);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="max-w-5xl mx-auto animate-pulse space-y-4 py-4">
      <div className="h-6 bg-[#E4E4E7] rounded w-64" />
      <div className="h-72 bg-[#E4E4E7] rounded-lg" />
    </div>
  );

  if (error) return (
    <div className="py-12 text-center">
      <p className="text-body-md text-[#D92D20] mb-4">{error}</p>
      <Link href="/listings" className="text-label-md text-[#0018A8] hover:underline">← Back to listings</Link>
    </div>
  );

  if (!listing) return null;

  const priceFormatted = `₹ ${(listing.price / 10000000).toFixed(2)} Cr`;

  return (
    <div className="max-w-5xl mx-auto">
      {/* Breadcrumb */}
      <div className="mb-5">
        <Link href="/listings" className="text-body-sm text-[#0018A8] hover:underline">← Listings</Link>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left: image + description + facts */}
        <div className="flex-1 min-w-0 flex flex-col gap-6">
          {/* Image placeholder */}
          <div className="w-full aspect-video bg-[#E4E4E7] rounded-lg flex items-center justify-center">
            <svg className="w-16 h-16 text-[#d4d4d8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2}
                d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d="M9 22V12h6v10" />
            </svg>
          </div>

          {/* Description */}
          {listing.description && (
            <div>
              <p className="text-label-md text-[#666] mb-2">Seller's description</p>
              <div className="bg-[#F8F8F8] rounded-md p-4">
                <p className="text-body-md text-[#303030] leading-relaxed">{listing.description}</p>
              </div>
            </div>
          )}

          {/* Fact table */}
          <div className="bg-white rounded-lg border border-[#E4E4E7] px-5 py-2">
            <FactRow label="Property type" value={listing.property_type || "—"} />
            <FactRow label="Apartment" value={listing.apartment_name || "—"} />
            <FactRow label="Locality" value={listing.locality || "—"} />
            <FactRow label="Bedrooms" value={listing.bedroom ?? "—"} />
            <FactRow label="Bathrooms" value={listing.bathroom ?? "—"} />
            <FactRow label="Carpet area" value={`${listing.carpet_area} sqft`} />
            {listing.super_built_up_area && (
              <FactRow label="Super built-up area" value={`${listing.super_built_up_area} sqft`} />
            )}
            <FactRow label="Furnishing" value={listing.furnishing || "—"} />
            <FactRow label="Verified" value={listing.is_verified ? "Yes" : "No"} />
            <FactRow label="Listing ID" value={<span className="font-mono text-body-sm">{listing.listing_id}</span>} />
          </div>
        </div>

        {/* Right: sticky price panel */}
        <div className="lg:w-[320px] shrink-0">
          <div className="bg-white rounded-lg border border-[#E4E4E7] p-5 flex flex-col gap-4 lg:sticky lg:top-[80px]">
            <div>
              <p className="text-headline-md text-[#0018A8] font-bold">{priceFormatted}</p>
              <p className="text-body-sm text-[#666] mt-0.5">
                {listing.bedroom} bed · {listing.bathroom} bath · {listing.carpet_area} sqft
              </p>
            </div>

            {listing.is_verified && (
              <span className="self-start text-label-sm bg-[#EEF2FF] text-[#0018A8] rounded-full px-3 py-1">
                Verified
              </span>
            )}

            <button
              onClick={toggleSave}
              disabled={saving}
              className={`w-full h-11 rounded-xl text-label-md font-semibold transition-colors ${
                isSaved
                  ? "bg-[#EEF2FF] text-[#0018A8] hover:bg-[#dde4ff]"
                  : "bg-[#0018A8] text-white hover:bg-[#0014c2]"
              } disabled:opacity-60`}
            >
              {isSaved ? "Saved ✓" : "Save listing"}
            </button>

            <div className="border-t border-[#E4E4E7] pt-4">
              <p className="text-label-md text-[#303030] mb-1">Interested?</p>
              <p className="text-body-sm text-[#666]">Contact Ivy Homes for a viewing or offer.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
