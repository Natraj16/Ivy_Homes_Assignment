"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { fetchApi } from "@/lib/api";

export default function RentalDetail() {
  const params = useParams();
  const [rental, setRental] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (params.id) {
      fetchApi(`/v1/rentals/${params.id}`)
        .then((data) => setRental(data))
        .catch((err: any) => setError(err.message || "Failed to load rental details"))
        .finally(() => setLoading(false));
    }
  }, [params.id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div style={{ color: 'red' }}>Error: {error}</div>;
  if (!rental) return <div>Rental not found.</div>;

  return (
    <div className="py-[var(--space-md)]">
      <div className="flex flex-col gap-6 max-w-5xl mx-auto">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-display text-[#111111]">{rental.title || `${rental.bedroom} BHK in ${rental.locality}`}</h1>
            <p className="text-body-lg text-[var(--color-secondary)] uppercase mt-2">{rental.property_type} • {rental.apartment_name}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-[var(--space-lg)] mt-[var(--space-sm)]">
          <div>
            <h2 className="text-headline-sm mb-[var(--space-sm)]">Description</h2>
            <p className="text-body-md text-[#111111] bg-white p-[var(--space-md)] rounded-[var(--radius-lg)] border border-[var(--color-tertiary)] shadow-sm">
              {rental.description || "No description provided by the poster."}
            </p>
            
            <h2 className="text-headline-sm mt-[var(--space-lg)] mb-[var(--space-sm)]">Key Specifications</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-[var(--radius-md)] border border-[var(--color-tertiary)] shadow-sm">
                <p className="text-caption text-[var(--color-secondary)]">FURNISHING</p>
                <p className="text-headline-sm mt-1 capitalize">{rental.furnishing}</p>
              </div>
              <div className="bg-white p-4 rounded-[var(--radius-md)] border border-[var(--color-tertiary)] shadow-sm">
                <p className="text-caption text-[var(--color-secondary)]">BATHROOMS</p>
                <p className="text-headline-sm mt-1">{rental.bathroom}</p>
              </div>
              <div className="bg-white p-4 rounded-[var(--radius-md)] border border-[var(--color-tertiary)] shadow-sm">
                <p className="text-caption text-[var(--color-secondary)]">POSTED BY</p>
                <p className="text-headline-sm mt-1 capitalize">{rental.posted_by}</p>
              </div>
              <div className="bg-white p-4 rounded-[var(--radius-md)] border border-[var(--color-tertiary)] shadow-sm">
                <p className="text-caption text-[var(--color-secondary)]">CONTACT</p>
                <p className="text-headline-sm mt-1">{rental.posted_by_contact}</p>
              </div>
            </div>
          </div>
          
          <div>
            {/* The Tinted Container Pattern */}
            <div className="bg-[#F5F7FF] rounded-[var(--radius-xl)] p-[var(--space-md)]">
              <span className="chip bg-[#001489] text-white text-[10px] mb-[var(--space-sm)]">FINANCIALS</span>
              
              <div className="bg-white rounded-[var(--radius-lg)] p-0 shadow-sm overflow-hidden mt-2">
                <div className="flex justify-between items-center px-6 py-4 border-b border-[var(--color-tertiary)]">
                  <div>
                    <p className="text-label-lg text-[#111111]">Security Deposit</p>
                    <p className="text-body-sm text-[var(--color-secondary)]">Refundable</p>
                  </div>
                  <p className="text-headline-sm text-[#111111]">₹ {rental.deposit.toLocaleString()}</p>
                </div>

                <div className="flex justify-between items-center px-6 py-4 border-b border-[var(--color-tertiary)]">
                  <div>
                    <p className="text-label-lg text-[#111111]">Maintenance</p>
                    <p className="text-body-sm text-[var(--color-secondary)]">Monthly fee</p>
                  </div>
                  <p className="text-headline-sm text-[#111111]">₹ {rental.maintenance.toLocaleString()}</p>
                </div>

                <div className="flex justify-between items-center px-6 py-6 bg-white">
                  <div>
                    <p className="text-headline-sm text-[#111111]">Monthly Rent</p>
                    <p className="text-body-sm text-[var(--color-secondary)]">Excludes maintenance</p>
                  </div>
                  <p className="text-headline-lg text-[var(--color-primary)]">₹ {rental.price.toLocaleString()}/mo</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
