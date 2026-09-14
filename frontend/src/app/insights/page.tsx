"use client";

import { useState, useEffect } from "react";
import { fetchApi } from "@/lib/api";

function StatBlock({ value, label }: { value: string | React.ReactNode; label: string }) {
  return (
    <div className="flex flex-col gap-1 min-w-[120px]">
      <span className="text-label-sm text-[#666] uppercase tracking-wider">{label}</span>
      <span className="text-headline-md text-[#0018A8] font-bold capitalize">{value}</span>
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
    fetch("/api/local-data")
      .then((r) => r.json())
      .then((local) => {
        setLocalData(local || {});
        if (local?.analytics) setSummary(local.analytics);
        setLoading(false);
      })
      .catch((e) => {
        setError("Failed to load local data.");
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
    <div className="flex flex-col gap-12 pb-12">
      <div>
        <h1 className="text-headline-md text-[#303030]">Insights</h1>
        <p className="text-body-sm text-[#666] mt-0.5">Market analytics and API findings.</p>
      </div>

      {error && (
        <div className="px-4 py-3 rounded bg-red-50 border border-red-200">
          <p className="text-body-sm text-[#D92D20]">{error}</p>
        </div>
      )}

      {/* Section A: Market summary */}
      <section className="flex flex-col gap-4">
        <h2 className="text-headline-sm text-[#303030]">Market summary</h2>

        {summary ? (
          <div className="bg-white rounded-lg border border-[#E4E4E7] px-6 py-6">
            <div className="flex flex-wrap gap-x-12 gap-y-6 items-start">
              {summary.city && <><StatBlock value={summary.city} label="City" /><Divider /></>}
              {summary.total_listings != null && <><StatBlock value={summary.total_listings.toLocaleString()} label="Total listings" /><Divider /></>}
              {summary.median_price != null && (
                <><StatBlock value={`₹ ${(summary.median_price / 10000000).toFixed(2)} Cr`} label="Median price" /><Divider /></>
              )}
              {summary.median_price_per_sqft != null && (
                <StatBlock value={`₹ ${Math.round(summary.median_price_per_sqft).toLocaleString()}`} label="Median ₹/sqft" />
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-8 pt-6 border-t border-[#E4E4E7]">
              {/* By-locality breakdown */}
              {summary.by_locality && summary.by_locality.length > 0 && (
                <div>
                  <p className="text-label-md text-[#666] mb-4 font-medium">By locality</p>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-body-sm">
                      <thead>
                        <tr className="border-b border-[#E4E4E7]">
                          <th className="pb-3 text-label-sm text-[#666] uppercase tracking-wider font-semibold pr-6">Locality</th>
                          <th className="pb-3 text-label-sm text-[#666] uppercase tracking-wider font-semibold pr-6">Count</th>
                          <th className="pb-3 text-label-sm text-[#666] uppercase tracking-wider font-semibold">Median price</th>
                        </tr>
                      </thead>
                      <tbody>
                        {summary.by_locality.slice(0, 10).map((loc: any) => (
                          <tr key={loc.locality} className="border-b border-[#E4E4E7] last:border-0 hover:bg-[#F8F8F8] transition-colors">
                            <td className="py-3 pr-6 text-[#303030] capitalize">{loc.locality}</td>
                            <td className="py-3 pr-6 text-[#303030]">{loc.count.toLocaleString()}</td>
                            <td className="py-3 text-[#303030]">
                              {loc.median_price ? `₹ ${(loc.median_price / 10000000).toFixed(2)} Cr` : "—"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* By-bedroom breakdown */}
              {summary.by_bhk && summary.by_bhk.length > 0 && (
                <div>
                  <p className="text-label-md text-[#666] mb-4 font-medium">By bedrooms</p>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-body-sm">
                      <thead>
                        <tr className="border-b border-[#E4E4E7]">
                          <th className="pb-3 text-label-sm text-[#666] uppercase tracking-wider font-semibold pr-6">BHK</th>
                          <th className="pb-3 text-label-sm text-[#666] uppercase tracking-wider font-semibold">Count</th>
                        </tr>
                      </thead>
                      <tbody>
                        {summary.by_bhk.map((stats: any) => (
                          <tr key={stats.bedroom} className="border-b border-[#E4E4E7] last:border-0 hover:bg-[#F8F8F8] transition-colors">
                            <td className="py-3 pr-6 text-[#303030]">{stats.bedroom} BHK</td>
                            <td className="py-3 text-[#303030]">{stats.count.toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-[#E4E4E7] px-6 py-12 text-center">
            <p className="text-body-md text-[#666]">No summary data available.</p>
          </div>
        )}
      </section>

      {/* Section B: Data Discoveries */}
      <section className="flex flex-col gap-4">
        <div>
          <h2 className="text-headline-sm text-[#303030]">Data discoveries</h2>
          <p className="text-body-sm text-[#666] mt-1">Additional insights and anomalies discovered during data analysis.</p>
        </div>

        {localData?.answers && Object.keys(localData.answers).length > 0 ? (
          <div className="bg-white rounded-lg border border-[#E4E4E7] overflow-x-auto mt-2">
            <table className="w-full text-left text-body-sm">
              <thead className="border-b border-[#E4E4E7] bg-[#F8F8F8]">
                <tr>
                  <th className="px-6 py-4 text-label-sm text-[#666] uppercase tracking-wider font-semibold w-1/3">Question</th>
                  <th className="px-6 py-4 text-label-sm text-[#666] uppercase tracking-wider font-semibold">Answer</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(localData.answers).map(([key, val]) => {
                  const QUESTION_MAP: Record<string, string> = {
                    total_listing_records: "How many total listing records are there?",
                    unique_properties: "How many unique physical properties do those records describe?",
                    active_listings: "How many listings are currently active?",
                    corrupt_listing_ids: "Which listing IDs contain physically impossible values?",
                    total_monthly_rent: "What is the total monthly rent of all active rental listings?",
                    avg_price_per_sqft_2bhk: "What is the average price per square foot for a 2BHK?",
                    costliest_project: "What is the ID and max price of the most expensive project?",
                    listings_last_7_days: "How many listings were added in the last 7 days?",
                    fake_listing_ids: "Which listing IDs appear to be deliberately fake?",
                    projects_with_wrong_listing_count: "How many projects have an incorrect listing count?"
                  };
                  return (
                    <tr key={key} className="border-b border-[#E4E4E7] last:border-0 hover:bg-[#F4F6FF] transition-colors">
                      <td className="px-6 py-4 text-[#666] align-top text-body-sm pr-6">
                        {QUESTION_MAP[key] || key.replace(/_/g, ' ')}
                      </td>
                      <td className="px-6 py-4 text-[#303030] align-top">
                        {typeof val === "object" ? (
                          <pre className="font-mono text-xs whitespace-pre-wrap bg-[#F8F8F8] p-2 rounded border border-[#E4E4E7]">{JSON.stringify(val, null, 2)}</pre>
                        ) : String(val)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-[#E4E4E7] px-6 py-12 text-center mt-2">
            <p className="text-body-md text-[#666]">No data discoveries available yet. Run the analysis scripts to populate.</p>
          </div>
        )}
      </section>
    </div>
  );
}
