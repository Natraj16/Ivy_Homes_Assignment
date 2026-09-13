"use client";

import { useState, useEffect } from "react";
import { fetchApi } from "@/lib/api";

function StatBlock({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col gap-1 min-w-[120px]">
      <span className="text-headline-md text-[#0018A8] font-bold">{value}</span>
      <span className="text-label-sm text-[#666] uppercase tracking-wider">{label}</span>
    </div>
  );
}

function Divider() {
  return <div className="hidden md:block w-px h-12 bg-[#E4E4E7]" />;
}

const CATEGORY_COLORS: Record<string, string> = {
  auth: "bg-purple-100 text-purple-700",
  filter: "bg-blue-100 text-blue-700",
  pagination: "bg-indigo-100 text-indigo-700",
  data: "bg-orange-100 text-orange-700",
  field: "bg-teal-100 text-teal-700",
  default: "bg-[#F8F8F8] text-[#303030]",
};

function categoryColor(cat: string) {
  const key = cat?.toLowerCase() || "";
  for (const [k, v] of Object.entries(CATEGORY_COLORS)) {
    if (key.includes(k)) return v;
  }
  return CATEGORY_COLORS.default;
}

export default function Insights() {
  const [summary, setSummary] = useState<any>(null);
  const [localData, setLocalData] = useState<any>({ answers: {}, findings: {} });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([
      fetchApi("/v1/analytics/summary").catch((e) => { setError(e.message); return null; }),
      fetch("/api/local-data").then((r) => r.json()).catch(() => ({})),
    ]).then(([s, local]) => {
      if (s) setSummary(s);
      setLocalData(local || {});
      setLoading(false);
    });
  }, []);

  // Normalise findings into an array of objects we can render as a table
  const findingRows: any[] = (() => {
    const f = localData?.findings;
    if (!f) return [];
    if (Array.isArray(f)) return f;
    // If it's a dict of categories → items
    if (typeof f === "object") {
      return Object.entries(f).flatMap(([category, items]: [string, any]) => {
        if (Array.isArray(items)) return items.map((item: any) => ({ ...item, category }));
        return [{ category, detail: JSON.stringify(items) }];
      });
    }
    return [];
  })();

  if (loading) return (
    <div className="animate-pulse flex flex-col gap-6">
      <div className="h-6 bg-[#E4E4E7] rounded w-40" />
      <div className="flex gap-8">
        {[1, 2, 3, 4].map((i) => <div key={i} className="h-12 bg-[#E4E4E7] rounded w-28" />)}
      </div>
      <div className="h-48 bg-[#E4E4E7] rounded-lg" />
    </div>
  );

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-headline-md text-[#303030]">Insights</h1>
        <p className="text-body-sm text-[#666] mt-0.5">Market analytics and API findings.</p>
      </div>

      {error && (
        <div className="px-4 py-3 rounded bg-red-50 border border-red-200">
          <p className="text-body-sm text-[#D92D20]">Could not load summary: {error}</p>
        </div>
      )}

      {/* Section A: Market summary */}
      <section className="flex flex-col gap-4">
        <h2 className="text-headline-sm text-[#303030]">Market summary</h2>

        {summary ? (
          <div className="bg-white rounded-lg border border-[#E4E4E7] px-6 py-5">
            <div className="flex flex-wrap gap-x-8 gap-y-5 items-start">
              {summary.city && <><StatBlock value={summary.city} label="City" /><Divider /></>}
              {summary.total_listings != null && <><StatBlock value={summary.total_listings.toLocaleString()} label="Total listings" /><Divider /></>}
              {summary.median_price != null && (
                <><StatBlock value={`₹ ${(summary.median_price / 10000000).toFixed(2)} Cr`} label="Median price" /><Divider /></>
              )}
              {summary.median_price_per_sqft != null && (
                <StatBlock value={`₹ ${summary.median_price_per_sqft.toLocaleString()}`} label="Median ₹/sqft" />
              )}
            </div>

            {/* By-bedroom breakdown */}
            {summary.by_bedroom && Object.keys(summary.by_bedroom).length > 0 && (
              <div className="mt-6 pt-5 border-t border-[#E4E4E7]">
                <p className="text-label-md text-[#666] mb-3">By bedrooms</p>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-body-sm">
                    <thead>
                      <tr className="border-b border-[#E4E4E7]">
                        <th className="pb-2 text-label-md text-[#666] font-semibold pr-6">BHK</th>
                        <th className="pb-2 text-label-md text-[#666] font-semibold pr-6">Count</th>
                        <th className="pb-2 text-label-md text-[#666] font-semibold pr-6">Median price</th>
                        <th className="pb-2 text-label-md text-[#666] font-semibold">Median ₹/sqft</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(summary.by_bedroom).map(([bhk, stats]: [string, any]) => (
                        <tr key={bhk} className="border-b border-[#E4E4E7] last:border-0">
                          <td className="py-2.5 pr-6 text-[#303030]">{bhk} BHK</td>
                          <td className="py-2.5 pr-6 text-[#303030]">{stats.count?.toLocaleString() ?? "—"}</td>
                          <td className="py-2.5 pr-6 text-[#303030]">
                            {stats.median_price ? `₹ ${(stats.median_price / 10000000).toFixed(2)} Cr` : "—"}
                          </td>
                          <td className="py-2.5 text-[#303030]">
                            {stats.median_price_per_sqft ? `₹ ${stats.median_price_per_sqft.toLocaleString()}` : "—"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        ) : (
          <p className="text-body-md text-[#666]">No summary data available from the API.</p>
        )}
      </section>

      {/* Section B: What we found */}
      <section className="flex flex-col gap-4">
        <h2 className="text-headline-sm text-[#303030]">What we found</h2>
        <p className="text-body-sm text-[#666]">Discrepancies between the API documentation and actual behaviour.</p>

        {findingRows.length > 0 ? (
          <div className="bg-white rounded-lg border border-[#E4E4E7] overflow-x-auto">
            <table className="w-full text-left text-body-sm">
              <thead className="border-b border-[#E4E4E7]">
                <tr>
                  <th className="px-4 py-3 text-label-md text-[#666] font-semibold w-[100px]">Category</th>
                  <th className="px-4 py-3 text-label-md text-[#666] font-semibold">Endpoint</th>
                  <th className="px-4 py-3 text-label-md text-[#666] font-semibold">Documented</th>
                  <th className="px-4 py-3 text-label-md text-[#666] font-semibold">Actual</th>
                  <th className="px-4 py-3 text-label-md text-[#666] font-semibold">Impact</th>
                </tr>
              </thead>
              <tbody>
                {findingRows.map((row, i) => (
                  <tr key={i} className="border-b border-[#E4E4E7] last:border-0 hover:bg-[#F8F8F8] transition-colors">
                    <td className="px-4 py-3">
                      <span className={`text-label-sm rounded-full px-2.5 py-0.5 ${categoryColor(row.category)}`}>
                        {row.category || "general"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-[#303030] font-mono text-body-sm max-w-[180px] truncate">
                      {row.endpoint || row.detail || "—"}
                    </td>
                    <td className="px-4 py-3 text-[#666] max-w-[200px]">{row.documented ?? "—"}</td>
                    <td className="px-4 py-3 text-[#303030] max-w-[200px]">{row.actual ?? "—"}</td>
                    <td className="px-4 py-3 text-[#666] max-w-[180px]">{row.impact ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          // Fallback: show answers JSON as a readable key-value table
          localData?.answers && Object.keys(localData.answers).length > 0 ? (
            <div className="bg-white rounded-lg border border-[#E4E4E7] overflow-x-auto">
              <table className="w-full text-left text-body-sm">
                <thead className="border-b border-[#E4E4E7]">
                  <tr>
                    <th className="px-4 py-3 text-label-md text-[#666] font-semibold w-1/3">Question</th>
                    <th className="px-4 py-3 text-label-md text-[#666] font-semibold">Finding</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(localData.answers).map(([key, val]) => (
                    <tr key={key} className="border-b border-[#E4E4E7] last:border-0 hover:bg-[#F8F8F8]">
                      <td className="px-4 py-3 text-[#666] align-top font-mono text-body-sm">{key}</td>
                      <td className="px-4 py-3 text-[#303030] align-top">
                        {typeof val === "object" ? JSON.stringify(val, null, 2) : String(val)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-body-md text-[#666]">No findings data available. Add findings to <code className="text-body-sm bg-[#F8F8F8] px-1.5 py-0.5 rounded">data/findings.json</code>.</p>
          )
        )}
      </section>
    </div>
  );
}
