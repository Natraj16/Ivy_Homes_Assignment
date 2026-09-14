"use client";

import { useState, useMemo } from "react";
import { usePaginated } from "@/lib/pagination";
import PropertyCard from "@/components/PropertyCard";
import { CardSkeletonGrid } from "@/components/LoadingSkeleton";

type Filters = { locality: string; status: string };
const INIT: Filters = { locality: "", status: "" };

export default function Projects() {
  const [filters, setFilters] = useState<Filters>(INIT);
  const apiParams: Record<string, string> = {};
  if (filters.locality) apiParams.locality = filters.locality;
  if (filters.status) apiParams.project_status = filters.status;

  const { items, loading, error, hasMore, loadMore } = usePaginated<any>("/v1/projects", apiParams);
  const filtered = useMemo(() => items.filter((p) => {
    if (filters.locality && p.locality?.toLowerCase() !== filters.locality.toLowerCase()) return false;
    if (filters.status && p.project_status?.toLowerCase() !== filters.status.toLowerCase()) return false;
    return true;
  }), [items, filters]);

  const activeCount = Object.values(filters).filter(Boolean).length;
  const set = (k: keyof Filters) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setFilters((f) => ({ ...f, [k]: e.target.value }));

  return (
    <div className="flex flex-col md:flex-row-reverse gap-7 items-start">
      <aside className="w-full md:w-[260px] shrink-0 bg-[var(--color-meadow)] rounded-[var(--radius-card)] p-6 flex flex-col gap-5 md:sticky md:top-[100px]">
        <p className="text-label-sm text-[var(--color-muted)] flex items-center">
          Filters {activeCount > 0 && <span className="bg-[var(--color-primary)] text-white rounded-full px-2 py-[1px] ml-1.5 text-[10px] leading-tight">{activeCount}</span>}
        </p>
        <div className="flex flex-col gap-1.5">
          <label className="text-[13px] font-semibold text-[var(--color-muted)]">Locality</label>
          <input type="text" value={filters.locality} onChange={set("locality")} placeholder="e.g. Whitefield" className="filter-input" />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-[13px] font-semibold text-[var(--color-muted)]">Status</label>
          <select value={filters.status} onChange={set("status")} className="filter-input">
            <option value="">Any</option>
            <option value="under construction">Under Construction</option>
            <option value="ready to move">Ready to Move</option>
          </select>
        </div>
        {activeCount > 0 && <button onClick={() => setFilters(INIT)} className="btn-tertiary text-[13px] self-start">Clear all filters</button>}
      </aside>

      <div className="flex-1 min-w-0 flex flex-col gap-5">
        <div>
          <h1 className="text-display text-[var(--color-ink)]">Projects</h1>
          {!loading && <p className="text-body-md text-[var(--color-muted)] mt-1">{filtered.length} {filtered.length === 1 ? "project" : "projects"} found</p>}
        </div>
        {error && <div className="p-4 bg-[#FEF2F2] border border-[#FECACA] rounded-[var(--radius-sm)]"><p className="text-body-sm text-[var(--color-error)]">{error}</p></div>}
        {loading && items.length === 0 ? <CardSkeletonGrid /> : filtered.length === 0 ? (
          <div className="py-20 px-6 text-center"><p className="text-[15px] text-[var(--color-muted)]">No projects match your filters.</p></div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {filtered.map((p) => (
                <PropertyCard key={p.project_id} id={p.project_id} type="project"
                  title={`${p.developer_name || ""} ${p.apartment_name || ""}`.trim()}
                  locality={p.locality || "Bangalore"}
                  price={p.price_min ? `₹ ${Number(p.price_min).toFixed(2)} – ${Number(p.price_max).toFixed(2)} Cr` : "Price on request"}
                  beds="" baths="" area={p.total_units ? `${p.total_units} units` : ""} />
              ))}
            </div>
            {hasMore && (
              <div className="flex justify-center pt-4">
                <button onClick={loadMore} disabled={loading} className="btn-secondary h-10 px-6">{loading ? "Loading…" : "Load more"}</button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
