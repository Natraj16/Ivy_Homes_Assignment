"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

interface PropertyCardProps {
  id: string;
  title: string;
  locality: string;
  price: string;
  beds: number | string;
  baths: number | string;
  area: string;
  type: "listing" | "rental" | "project";
  isVerified?: boolean;
  isSaved?: boolean;
  onSaveToggle?: (id: string, saved: boolean) => void;
}

export default function PropertyCard({
  id, title, locality, price, beds, baths, area, type,
  isVerified, isSaved: isSavedProp = false, onSaveToggle,
}: PropertyCardProps) {
  const href = `/${type}s/${id}`;
  const [saved, setSaved] = useState(isSavedProp);
  const [saving, setSaving] = useState(false);
  const canSave = type === "listing";

  useEffect(() => {
    import('@/lib/favourites').then(({ getSavedListingIds }) => {
      setSaved(getSavedListingIds().includes(id) || isSavedProp);
    });
  }, [id, isSavedProp]);

  const toggleSave = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (saving) return;
    setSaving(true);
    const next = !saved;
    setSaved(next);
    try {
      const { saveListingId, removeListingId } = await import('@/lib/favourites');
      if (!next) {
        removeListingId(id);
      } else {
        saveListingId(id);
      }
      onSaveToggle?.(id, next);
    } catch {
      setSaved(!next);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Link href={href} className="block group h-full">
      <article className="bg-white border border-[#E4E4E7] rounded-[20px] overflow-hidden flex flex-col h-full transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">
        
        {/* Image Area */}
        <div className="relative aspect-[4/3] bg-[#F4F6FF] shrink-0">
          {/* House icon placeholder */}
          <div className="absolute inset-0 flex items-center justify-center">
            <svg width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="#D1D5DB" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 22V12h6v10" />
            </svg>
          </div>

          {/* Badges Overlay */}
          <div className="absolute top-3 right-3 flex items-center gap-2">
            {isVerified && (
              <span className="bg-[#0018A8] text-white text-[10px] font-bold tracking-wide px-3 py-1 rounded-full">
                Ivy Signature
              </span>
            )}
            <span className="bg-white text-[#EA580C] text-[10px] font-bold tracking-wide px-3 py-1 rounded-full">
              Coming Soon
            </span>
          </div>
        </div>

        {/* Body Area */}
        <div className="p-4 flex flex-col flex-1">
          {/* Title & Price Row */}
          <div className="flex justify-between items-start gap-4 mb-1">
            <h3 className="font-semibold text-[#111827] text-[15px] leading-snug line-clamp-1">{title}</h3>
            <span className="font-semibold text-[#111827] text-[15px] whitespace-nowrap">{price}</span>
          </div>
          
          {/* Locality */}
          <p className="text-[#6B7280] text-[13px] mb-4">{locality}</p>

          <div className="mt-auto pt-2 flex items-center justify-between">
            {/* Features Row */}
            <div className="flex items-center gap-2 text-[#6B7280] text-xs">
              {beds && (
                <div className="flex items-center gap-1.5 border border-[#E5E7EB] rounded-md px-2 py-1">
                  <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  <span>{beds}</span>
                </div>
              )}
              {area && (
                <div className="flex items-center gap-1.5 border border-[#E5E7EB] rounded-md px-2 py-1">
                  <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                  </svg>
                  <span>{area} sq. ft.</span>
                </div>
              )}
              {baths && (
                <div className="flex items-center gap-1.5 border border-[#E5E7EB] rounded-md px-2 py-1">
                  <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
                  </svg>
                  <span>{baths} Bath</span>
                </div>
              )}
            </div>

            {/* Heart Icon */}
            {canSave && (
              <button 
                onClick={toggleSave} 
                className="text-[#9CA3AF] hover:text-[#EF4444] transition-colors p-1 ml-2"
                disabled={saving}
              >
                <svg width="20" height="20" fill={saved ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor" className={saved ? "text-[#EF4444]" : ""}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </article>
    </Link>
  );
}
