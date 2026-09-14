"use client";

import React, { useState } from "react";

export type Filters = {
  locality: string;
  bedrooms: string;
  minPrice: string;
  maxPrice: string;
  propertyType: string;
};

interface FilterSidebarProps {
  filters: Filters;
  onChange: (f: Filters) => void;
  onClear: () => void;
}

export default function FilterSidebar({ filters, onChange, onClear }: FilterSidebarProps) {
  const set = (key: keyof Filters, val: string) => {
    onChange({ ...filters, [key]: val });
  };

  const activeCount = Object.values(filters).filter(Boolean).length;

  return (
    <aside className="w-full md:w-[340px] shrink-0 bg-white border border-[#E4E4E7] rounded-2xl p-6 flex flex-col gap-7 md:sticky md:top-24">
      {/* Map View Button */}
      <button className="self-start bg-[#171717] hover:bg-black text-white rounded-full px-4 py-2 flex items-center gap-2 text-sm font-medium transition-colors">
        <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
        </svg>
        Map view
      </button>

      {/* Apartment / Location */}
      <div className="flex flex-col gap-3">
        <label className="text-sm text-[#6B7280]">Apartment / Location</label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="#9CA3AF" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            value={filters.locality}
            onChange={(e) => set("locality", e.target.value)}
            placeholder="Search upto 3 localities"
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#E4E4E7] rounded-full text-sm text-[#303030] placeholder-[#9CA3AF] focus:outline-none focus:border-[#0018A8]"
          />
        </div>
      </div>

      {/* Select BHK */}
      <div className="flex flex-col gap-3">
        <label className="text-sm text-[#6B7280]">Select BHK</label>
        <div className="flex flex-wrap gap-2">
          {["2", "3", "4"].map((bhk) => {
            const isSelected = filters.bedrooms === bhk;
            return (
              <button
                key={bhk}
                onClick={() => set("bedrooms", isSelected ? "" : bhk)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors border ${
                  isSelected 
                    ? "bg-[#0018A8] border-[#0018A8] text-white" 
                    : "bg-white border-[#E4E4E7] text-[#111827] hover:bg-gray-50"
                }`}
              >
                {bhk} BHK
              </button>
            );
          })}
        </div>
      </div>

      {/* Budget */}
      <div className="flex flex-col gap-3">
        <label className="text-sm text-[#6B7280]">Budget</label>
        <div className="flex justify-between text-[15px] font-semibold text-[#111827] px-1">
          <span>₹ 0</span>
          <span>₹ 5 Cr</span>
        </div>
        <div className="px-1 mt-1">
          {/* Simple range slider for now, visually styled with accent-black */}
          <input
            type="range"
            min="0"
            max="50000000"
            step="1000000"
            value={filters.maxPrice || 50000000}
            onChange={(e) => set("maxPrice", e.target.value)}
            className="w-full h-1 bg-[#E4E4E7] rounded-lg appearance-none cursor-pointer accent-[#171717]"
          />
        </div>
      </div>

      {/* Property Type */}
      <div className="flex flex-col gap-3">
        <label className="text-sm text-[#6B7280]">Property Type</label>
        <div className="flex flex-wrap gap-2">
          {["Apartment", "Independent House", "Villa"].map((ptype) => {
            const isSelected = filters.propertyType === ptype;
            return (
              <button
                key={ptype}
                onClick={() => set("propertyType", isSelected ? "" : ptype)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors border ${
                  isSelected 
                    ? "bg-[#0018A8] border-[#0018A8] text-white" 
                    : "bg-white border-[#E4E4E7] text-[#111827] hover:bg-gray-50"
                }`}
              >
                {ptype}
              </button>
            );
          })}
        </div>
      </div>

      {activeCount > 0 && (
        <button onClick={onClear} className="text-[#0018A8] text-sm font-medium self-start mt-2 hover:underline">
          Clear all filters
        </button>
      )}
    </aside>
  );
}
