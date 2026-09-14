"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { fetchApi } from "@/lib/api";

function titleCase(str?: string) {
  if (!str) return "";
  return str.replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function RentalDetail() {
  const { id } = useParams<{ id: string }>();
  const [rental, setRental] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    fetchApi(`/v1/rentals/${id}`)
      .then((data) => setRental(data))
      .catch((err: any) => setError(err.message || "Failed to load rental details"))
      .finally(() => setLoading(false));
  }, [id]);

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
        <Link href="/rentals" className="text-sm text-zinc-500 hover:text-zinc-900 underline">
          ← Back to rentals
        </Link>
      </div>
    );
  }

  if (!rental) return null;

  const locality = titleCase(rental.locality || "Gurgaon");
  const aptName = rental.apartment_name || locality;
  const propType = titleCase(rental.property_type || "Rental");

  return (
    <div className="flex flex-col gap-6 max-w-3xl">
      <Link
        href="/rentals"
        className="text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
      >
        ← Back to Rentals
      </Link>

      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
          {rental.title || `${rental.bedroom} BHK for rent in ${locality}`}
        </h1>
        <p className="text-zinc-500 text-sm mt-0.5">
          {aptName} · {locality} · {rental.bedroom} BHK · {propType}
        </p>
      </div>

      {/* Badges */}
      <div className="flex items-center gap-2">
        <span className="text-xs px-2.5 py-0.5 rounded-full font-medium bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 capitalize">
          {rental.property_type || "Rental"}
        </span>
        {rental.furnishing && (
          <span className="text-xs px-2.5 py-0.5 rounded-full font-medium bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 capitalize">
            {rental.furnishing}
          </span>
        )}
      </div>

      {/* Price */}
      <p className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
        ₹ {rental.price?.toLocaleString("en-IN")}
        <span className="text-base font-normal text-zinc-500"> / month</span>
      </p>

      {/* Details Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm border border-zinc-200 dark:border-zinc-800 rounded-lg p-4 bg-white dark:bg-zinc-900">
        <div>
          <p className="text-zinc-500 text-xs mb-0.5">Bedrooms</p>
          <p className="font-medium text-zinc-900 dark:text-zinc-100">{rental.bedroom || "—"}</p>
        </div>
        <div>
          <p className="text-zinc-500 text-xs mb-0.5">Bathrooms</p>
          <p className="font-medium text-zinc-900 dark:text-zinc-100">{rental.bathroom || "—"}</p>
        </div>
        <div>
          <p className="text-zinc-500 text-xs mb-0.5">Floor</p>
          <p className="font-medium text-zinc-900 dark:text-zinc-100">
            {rental.floor ? `${rental.floor} / ${rental.total_floors}` : "—"}
          </p>
        </div>
        <div>
          <p className="text-zinc-500 text-xs mb-0.5">Carpet Area</p>
          <p className="font-medium text-zinc-900 dark:text-zinc-100">
            {rental.carpet_area ? `${rental.carpet_area} sqft` : "—"}
          </p>
        </div>
        <div>
          <p className="text-zinc-500 text-xs mb-0.5">Furnishing</p>
          <p className="font-medium text-zinc-900 dark:text-zinc-100 capitalize">
            {rental.furnishing || "—"}
          </p>
        </div>
        <div>
          <p className="text-zinc-500 text-xs mb-0.5">Facing</p>
          <p className="font-medium text-zinc-900 dark:text-zinc-100 capitalize">
            {rental.facing_direction || "—"}
          </p>
        </div>
        <div>
          <p className="text-zinc-500 text-xs mb-0.5">Deposit</p>
          <p className="font-medium text-zinc-900 dark:text-zinc-100">
            ₹ {rental.deposit?.toLocaleString("en-IN") || "—"}
          </p>
        </div>
        <div>
          <p className="text-zinc-500 text-xs mb-0.5">Maintenance</p>
          <p className="font-medium text-zinc-900 dark:text-zinc-100">
            ₹ {rental.maintenance?.toLocaleString("en-IN") || "—"}
          </p>
        </div>
      </div>

      {/* Description */}
      {rental.description && (
        <div className="flex flex-col gap-2">
          <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">Description</h2>
          <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed whitespace-pre-line">
            {rental.description}
          </p>
        </div>
      )}

      {/* Contact Owner */}
      <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 p-4 bg-zinc-50 dark:bg-zinc-900/60 flex items-center justify-between">
        <div>
          <p className="text-xs text-zinc-500">
            Posted by <span className="capitalize">{rental.posted_by || "Owner"}</span>
          </p>
          <p className="font-medium text-sm text-zinc-900 dark:text-zinc-100">
            {rental.posted_by_name || "Ivy Homes Partner"}
          </p>
        </div>
        {rental.posted_by_contact && (
          <a
            href={`tel:${rental.posted_by_contact}`}
            className="rounded-md bg-zinc-900 text-white dark:bg-zinc-100 dark:text-black px-3 py-1.5 text-xs font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
          >
            Contact {rental.posted_by_contact}
          </a>
        )}
      </div>
    </div>
  );
}
