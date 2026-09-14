"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { fetchApi } from "@/lib/api";

function titleCase(str?: string) {
  if (!str) return "";
  return str.replace(/\b\w/g, (c) => c.toUpperCase());
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
    import("@/lib/favourites").then(({ getSavedListingIds }) => {
      setIsSaved(getSavedListingIds().includes(id as string));
    });
    fetchApi(`/v1/listings/${id}`)
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
      const { saveListingId, removeListingId } = await import("@/lib/favourites");
      next ? saveListingId(id as string) : removeListingId(id as string);
    } catch {
      setIsSaved(!next);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto animate-pulse space-y-4 py-8">
        <div className="h-8 bg-zinc-200 dark:bg-zinc-800 rounded w-2/3" />
        <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-1/2" />
        <div className="h-64 bg-zinc-200 dark:bg-zinc-800 rounded-lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-12 text-center">
        <p className="text-sm text-red-600 mb-4">{error}</p>
        <Link href="/listings" className="text-sm text-zinc-500 hover:text-zinc-900 underline">
          ← Back to listings
        </Link>
      </div>
    );
  }

  if (!listing) return null;

  const propType = titleCase(listing.property_type || "Apartment");
  const locality = titleCase(listing.locality || "Gurgaon");
  const aptName = listing.apartment_name || locality;

  return (
    <div className="flex flex-col gap-6 max-w-3xl">
      {/* Back */}
      <Link
        href="/listings"
        className="text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
      >
        ← Back to Listings
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
            {listing.bedroom} BHK {propType} in {locality}
          </h1>
          <p className="text-zinc-500 text-sm mt-0.5">
            {aptName} · {locality} · {listing.bedroom} BHK · {propType}
          </p>
        </div>
        <button
          onClick={toggleSave}
          disabled={saving}
          className="text-xl leading-none p-1 cursor-pointer transition-colors"
          aria-label={isSaved ? "Remove from saved" : "Save listing"}
        >
          {isSaved ? (
            <span className="text-red-500">♥</span>
          ) : (
            <span className="text-zinc-400 hover:text-red-500 dark:text-zinc-500">♡</span>
          )}
        </button>
      </div>

      {/* Badges */}
      <div className="flex items-center gap-2">
        {listing.is_live && (
          <span className="text-xs px-2.5 py-0.5 rounded-full font-medium bg-green-100 text-green-700 dark:bg-green-950/60 dark:text-green-400 border border-green-200 dark:border-green-800">
            Live
          </span>
        )}
        {listing.is_verified && (
          <span className="text-xs px-2.5 py-0.5 rounded-full font-medium bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
            Verified
          </span>
        )}
        <span className="text-xs px-2.5 py-0.5 rounded-full font-medium bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 capitalize">
          {listing.property_type || "Property"}
        </span>
      </div>

      {/* Price */}
      <p className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
        ₹ {(listing.price / 10000000).toFixed(2)} Cr
      </p>

      {/* Details Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm border border-zinc-200 dark:border-zinc-800 rounded-lg p-4 bg-white dark:bg-zinc-900">
        <div>
          <p className="text-zinc-500 text-xs mb-0.5">Carpet Area</p>
          <p className="font-medium text-zinc-900 dark:text-zinc-100">
            {listing.carpet_area ? `${listing.carpet_area} sqft` : "—"}
          </p>
        </div>
        <div>
          <p className="text-zinc-500 text-xs mb-0.5">Super Built-up</p>
          <p className="font-medium text-zinc-900 dark:text-zinc-100">
            {listing.super_built_up_area ? `${listing.super_built_up_area} sqft` : "—"}
          </p>
        </div>
        <div>
          <p className="text-zinc-500 text-xs mb-0.5">Bedrooms</p>
          <p className="font-medium text-zinc-900 dark:text-zinc-100">{listing.bedroom || "—"}</p>
        </div>
        <div>
          <p className="text-zinc-500 text-xs mb-0.5">Bathrooms</p>
          <p className="font-medium text-zinc-900 dark:text-zinc-100">{listing.bathroom || "—"}</p>
        </div>
        <div>
          <p className="text-zinc-500 text-xs mb-0.5">Balcony</p>
          <p className="font-medium text-zinc-900 dark:text-zinc-100">{listing.balcony || "—"}</p>
        </div>
        <div>
          <p className="text-zinc-500 text-xs mb-0.5">Furnishing</p>
          <p className="font-medium text-zinc-900 dark:text-zinc-100 capitalize">
            {listing.furnishing || "—"}
          </p>
        </div>
        <div>
          <p className="text-zinc-500 text-xs mb-0.5">Facing</p>
          <p className="font-medium text-zinc-900 dark:text-zinc-100 capitalize">
            {listing.facing_direction || "—"}
          </p>
        </div>
        <div>
          <p className="text-zinc-500 text-xs mb-0.5">Floor</p>
          <p className="font-medium text-zinc-900 dark:text-zinc-100">
            {listing.floor ? `${listing.floor} / ${listing.total_floors}` : "—"}
          </p>
        </div>
        <div>
          <p className="text-zinc-500 text-xs mb-0.5">Parking</p>
          <p className="font-medium text-zinc-900 dark:text-zinc-100">
            {listing.covered_parking ? `${listing.covered_parking} covered` : "—"}
          </p>
        </div>
      </div>

      {/* Description */}
      {listing.description && (
        <div className="flex flex-col gap-2">
          <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">Description</h2>
          <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed whitespace-pre-line">
            {listing.description}
          </p>
        </div>
      )}

      {/* Contact Seller */}
      <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 p-4 bg-zinc-50 dark:bg-zinc-900/60 flex items-center justify-between">
        <div>
          <p className="text-xs text-zinc-500">
            Posted by <span className="capitalize">{listing.posted_by || "Seller"}</span>
          </p>
          <p className="font-medium text-sm text-zinc-900 dark:text-zinc-100">
            {listing.posted_by_name || "Ivy Homes Partner"}
          </p>
        </div>
        {listing.posted_by_contact && (
          <a
            href={`tel:${listing.posted_by_contact}`}
            className="rounded-md bg-zinc-900 text-white dark:bg-zinc-100 dark:text-black px-3 py-1.5 text-xs font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
          >
            Contact {listing.posted_by_contact}
          </a>
        )}
      </div>
    </div>
  );
}
