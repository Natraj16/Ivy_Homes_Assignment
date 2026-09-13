"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { fetchApi } from "@/lib/api";

function FactRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex justify-between items-baseline py-4 border-b border-[var(--color-border)] last:border-0">
      <span className="text-body text-[var(--color-muted)]">{label}</span>
      <span className="text-body-md text-[var(--color-ink)] font-medium text-right max-w-[60%]">{value}</span>
    </div>
  );
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

  if (loading) return (
    <div className="max-w-5xl mx-auto animate-pulse space-y-4 py-8">
      <div className="h-10 bg-[var(--color-border)] rounded-full w-2/3" />
      <div className="h-72 bg-[var(--color-meadow)] rounded-[var(--radius-card)]" />
    </div>
  );

  if (error) return (
    <div className="py-12 text-center">
      <p className="text-body-md text-[var(--color-error)] mb-4">{error}</p>
      <Link href="/rentals" className="text-label-md text-[var(--color-primary)] hover:underline">← Back to rentals</Link>
    </div>
  );

  if (!rental) return null;

  return (
    <div className="max-w-6xl mx-auto py-[var(--sp-24)]">
      {/* Breadcrumb */}
      <div className="mb-[var(--sp-32)]">
        <Link href="/rentals" className="text-label text-[var(--color-primary)] hover:underline flex items-center gap-2">
          <span>←</span> Back to Rentals
        </Link>
      </div>

      <div className="flex flex-col lg:flex-row gap-[var(--sp-48)]">
        
        {/* Left Column: Details */}
        <div className="flex-1 min-w-0 flex flex-col gap-[var(--sp-48)]">
          
          {/* Header */}
          <div>
            <div className="flex gap-2 mb-[var(--sp-16)]">
              <span className="chip">{rental.property_type || "Rental"}</span>
              {rental.furnishing && <span className="chip-muted">{rental.furnishing}</span>}
            </div>
            <h1 className="text-display text-[var(--color-ink)] mb-[var(--sp-8)]">
              {rental.title || `${rental.bedroom} BHK for rent in ${rental.locality}`}
            </h1>
            <p className="text-heading-sm text-[var(--color-muted)] capitalize">
              {rental.apartment_name} • {rental.locality}
            </p>
          </div>

          {/* Description */}
          {rental.description && (
            <div>
              <h2 className="text-heading-sm text-[var(--color-ink)] mb-[var(--sp-16)]">About this property</h2>
              <div className="card-white shadow-sm leading-relaxed text-body text-[var(--color-body)]">
                {rental.description}
              </div>
            </div>
          )}

          {/* Key Specifications Grid */}
          <div>
            <h2 className="text-heading-sm text-[var(--color-ink)] mb-[var(--sp-16)]">Key Specifications</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-[var(--sp-16)]">
              <div className="card text-center flex flex-col justify-center gap-1">
                <p className="text-label-sm text-[var(--color-muted)]">Bedrooms</p>
                <p className="text-heading text-[var(--color-ink)]">{rental.bedroom || "—"}</p>
              </div>
              <div className="card text-center flex flex-col justify-center gap-1">
                <p className="text-label-sm text-[var(--color-muted)]">Bathrooms</p>
                <p className="text-heading text-[var(--color-ink)]">{rental.bathroom || "—"}</p>
              </div>
              <div className="card text-center flex flex-col justify-center gap-1">
                <p className="text-label-sm text-[var(--color-muted)]">Floor</p>
                <p className="text-heading text-[var(--color-ink)]">{rental.floor ? `${rental.floor} / ${rental.total_floors}` : "—"}</p>
              </div>
              <div className="card text-center flex flex-col justify-center gap-1">
                <p className="text-label-sm text-[var(--color-muted)]">Area</p>
                <p className="text-heading text-[var(--color-ink)]">{rental.carpet_area ? `${rental.carpet_area} sqft` : "—"}</p>
              </div>
            </div>
          </div>

          {/* Contact details */}
          <div>
            <h2 className="text-heading-sm text-[var(--color-ink)] mb-[var(--sp-16)]">Contact Information</h2>
            <div className="card-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <p className="text-label text-[var(--color-muted)] mb-1">Posted by {rental.posted_by}</p>
                <p className="text-heading-sm text-[var(--color-ink)]">{rental.posted_by_name || "Owner"}</p>
              </div>
              <a href={`tel:${rental.posted_by_contact}`} className="btn-primary whitespace-nowrap">
                Call {rental.posted_by_contact}
              </a>
            </div>
          </div>

        </div>

        {/* Right Column: Financials (Sticky) */}
        <div className="lg:w-[380px] shrink-0">
          <div className="card flex flex-col gap-[var(--sp-24)] lg:sticky lg:top-[100px]">
            
            <div className="flex items-center justify-between">
              <span className="chip">Financials</span>
            </div>

            <div className="flex flex-col gap-[var(--sp-8)]">
              <p className="text-label text-[var(--color-muted)]">Monthly Rent</p>
              <p className="text-display text-[var(--color-primary)]">
                ₹ {rental.price?.toLocaleString("en-IN")}
                <span className="text-body-md text-[var(--color-muted)]">/mo</span>
              </p>
              <p className="text-caption text-[var(--color-muted)]">Excludes maintenance</p>
            </div>

            <div className="card-white flex flex-col mt-[var(--sp-8)] p-[var(--sp-16)] gap-[var(--sp-16)]">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-label text-[var(--color-ink)]">Security Deposit</p>
                  <p className="text-caption text-[var(--color-muted)]">Refundable</p>
                </div>
                <p className="text-heading-sm text-[var(--color-ink)]">₹ {rental.deposit?.toLocaleString("en-IN") || "—"}</p>
              </div>
              
              <div className="w-full h-px bg-[var(--color-border)]" />
              
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-label text-[var(--color-ink)]">Maintenance</p>
                  <p className="text-caption text-[var(--color-muted)]">Monthly fee</p>
                </div>
                <p className="text-heading-sm text-[var(--color-ink)]">₹ {rental.maintenance?.toLocaleString("en-IN") || "—"}</p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
