"use client";

import React from "react";

export type Filters = {
  locality?: string;
  bedrooms?: string;
  minPrice?: string;
  maxPrice?: string;
  propertyType?: string;
  furnishing?: string;
};

interface FilterSidebarProps {
  filters: Filters;
  onChange: (f: Filters) => void;
  onClear: () => void;
}

const LOCALITIES = [
  "sector 65",
  "dwarka expressway",
  "golf course road",
  "sohna road",
  "sector 49",
  "mg road",
  "dlf phase 3",
  "new gurgaon",
  "sector 82",
  "sector 56",
];

const PROPERTY_TYPES = ["Apartment", "Independent House", "Villa"];

const FURNISHING_OPTIONS = [
  { value: "unfurnished", label: "Unfurnished" },
  { value: "semi-furnished", label: "Semi-furnished" },
  { value: "fully-furnished", label: "Fully-furnished" },
];

export default function FilterSidebar({ filters, onChange, onClear }: FilterSidebarProps) {
  const set = (key: keyof Filters, val: string) => {
    onChange({ ...filters, [key]: val });
  };

  const activeCount = Object.values(filters).filter(Boolean).length;

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-4 flex flex-wrap gap-3 items-end">
      {/* Locality */}
      <div>
        <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">Locality</label>
        <select
          value={filters.locality}
          onChange={(e) => set("locality", e.target.value)}
          className="rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 px-2 py-1.5 text-sm outline-hidden focus:ring-1 focus:ring-zinc-400 dark:focus:ring-zinc-600"
        >
          <option value="" className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100">
            Any
          </option>
          {LOCALITIES.map((loc) => (
            <option
              key={loc}
              value={loc}
              className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100"
            >
              {loc.replace(/\b\w/g, (c) => c.toUpperCase())}
            </option>
          ))}
        </select>
      </div>

      {/* Bedrooms */}
      <div>
        <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">Bedrooms</label>
        <select
          value={filters.bedrooms}
          onChange={(e) => set("bedrooms", e.target.value)}
          className="rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 px-2 py-1.5 text-sm outline-hidden focus:ring-1 focus:ring-zinc-400 dark:focus:ring-zinc-600"
        >
          <option value="" className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100">
            Any
          </option>
          {["1", "2", "3", "4", "5"].map((b) => (
            <option
              key={b}
              value={b}
              className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100"
            >
              {b} BHK
            </option>
          ))}
        </select>
      </div>

      {/* Min Price */}
      <div>
        <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">Min price</label>
        <input
          type="number"
          value={filters.minPrice}
          onChange={(e) => set("minPrice", e.target.value)}
          placeholder="₹"
          className="w-28 rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 px-2 py-1.5 text-sm outline-hidden focus:ring-1 focus:ring-zinc-400 dark:focus:ring-zinc-600"
        />
      </div>

      {/* Max Price */}
      <div>
        <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">Max price</label>
        <input
          type="number"
          value={filters.maxPrice}
          onChange={(e) => set("maxPrice", e.target.value)}
          placeholder="₹"
          className="w-28 rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 px-2 py-1.5 text-sm outline-hidden focus:ring-1 focus:ring-zinc-400 dark:focus:ring-zinc-600"
        />
      </div>

      {/* Furnishing */}
      <div>
        <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">Furnishing</label>
        <select
          value={filters.furnishing}
          onChange={(e) => set("furnishing", e.target.value)}
          className="rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 px-2 py-1.5 text-sm outline-hidden focus:ring-1 focus:ring-zinc-400 dark:focus:ring-zinc-600"
        >
          <option value="" className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100">
            Any
          </option>
          {FURNISHING_OPTIONS.map((f) => (
            <option
              key={f.value}
              value={f.value}
              className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100"
            >
              {f.label}
            </option>
          ))}
        </select>
      </div>

      {/* Property Type */}
      <div>
        <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">Property type</label>
        <select
          value={filters.propertyType}
          onChange={(e) => set("propertyType", e.target.value)}
          className="rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 px-2 py-1.5 text-sm outline-hidden focus:ring-1 focus:ring-zinc-400 dark:focus:ring-zinc-600"
        >
          <option value="" className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100">
            Any
          </option>
          {PROPERTY_TYPES.map((t) => (
            <option
              key={t}
              value={t}
              className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100"
            >
              {t}
            </option>
          ))}
        </select>
      </div>

      {/* Clear */}
      {activeCount > 0 && (
        <button
          onClick={onClear}
          className="text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 underline pb-1 cursor-pointer transition-colors"
        >
          Clear filters
        </button>
      )}
    </div>
  );
}
