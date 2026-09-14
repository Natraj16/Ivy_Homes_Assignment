"use client";

import { useState, useEffect } from "react";

function StatBlock({ value, label }: { value: string | React.ReactNode; label: string }) {
  return (
    <div className="flex flex-col gap-1 min-w-[120px]">
      <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider">{label}</span>
      <span className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 capitalize">{value}</span>
    </div>
  );
}

function Divider() {
  return <div className="hidden md:block w-px h-10 bg-zinc-200 dark:bg-zinc-800" />;
}

export default function Insights() {
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/local-data")
      .then((r) => r.json())
      .then((local) => {
        if (local?.analytics) setSummary(local.analytics);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load market analytics.");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="animate-pulse flex flex-col gap-6">
        <div className="h-6 bg-zinc-200 dark:bg-zinc-800 rounded w-40" />
        <div className="flex gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-16 bg-zinc-200 dark:bg-zinc-800 rounded-lg flex-1" />
          ))}
        </div>
        <div className="h-48 bg-zinc-200 dark:bg-zinc-800 rounded-lg" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 pb-12">
      <div>
        <h1 className="text-2xl font-semibold">Market Insights</h1>
        <p className="text-sm text-zinc-500">Gurgaon real estate analytics and locality trends.</p>
      </div>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 dark:bg-red-950/30 rounded-md px-3 py-2">
          {error}
        </p>
      )}

      {/* Market summary */}
      <section className="flex flex-col gap-3">
        {summary ? (
          <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-5 flex flex-col gap-6">
            <div className="flex flex-wrap gap-x-8 gap-y-4 items-start">
              {summary.city && (
                <>
                  <StatBlock value={summary.city} label="City" />
                  <Divider />
                </>
              )}
              {summary.total_listings != null && (
                <>
                  <StatBlock value={summary.total_listings.toLocaleString()} label="Total listings" />
                  <Divider />
                </>
              )}
              {summary.median_price != null && (
                <>
                  <StatBlock
                    value={`₹ ${(summary.median_price / 10000000).toFixed(2)} Cr`}
                    label="Median price"
                  />
                  <Divider />
                </>
              )}
              {summary.median_price_per_sqft != null && (
                <StatBlock
                  value={`₹ ${Math.round(summary.median_price_per_sqft).toLocaleString()}`}
                  label="Median ₹/sqft"
                />
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-zinc-200 dark:border-zinc-800">
              {/* By-locality breakdown */}
              {summary.by_locality && summary.by_locality.length > 0 && (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-3">
                    By locality
                  </p>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead>
                        <tr className="border-b border-zinc-200 dark:border-zinc-800 text-xs text-zinc-500">
                          <th className="pb-2 pr-4 font-medium">Locality</th>
                          <th className="pb-2 pr-4 font-medium">Count</th>
                          <th className="pb-2 font-medium">Median price</th>
                        </tr>
                      </thead>
                      <tbody>
                        {summary.by_locality.slice(0, 10).map((loc: any) => (
                          <tr
                            key={loc.locality}
                            className="border-b border-zinc-100 dark:border-zinc-800/60 last:border-0"
                          >
                            <td className="py-2.5 pr-4 capitalize text-zinc-900 dark:text-zinc-100">
                              {loc.locality}
                            </td>
                            <td className="py-2.5 pr-4 text-zinc-600 dark:text-zinc-400">
                              {loc.count.toLocaleString()}
                            </td>
                            <td className="py-2.5 text-zinc-900 dark:text-zinc-100">
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
                  <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-3">
                    By bedrooms
                  </p>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead>
                        <tr className="border-b border-zinc-200 dark:border-zinc-800 text-xs text-zinc-500">
                          <th className="pb-2 pr-4 font-medium">BHK</th>
                          <th className="pb-2 font-medium">Count</th>
                        </tr>
                      </thead>
                      <tbody>
                        {summary.by_bhk.map((stats: any) => (
                          <tr
                            key={stats.bedroom}
                            className="border-b border-zinc-100 dark:border-zinc-800/60 last:border-0"
                          >
                            <td className="py-2.5 pr-4 text-zinc-900 dark:text-zinc-100">
                              {stats.bedroom} BHK
                            </td>
                            <td className="py-2.5 text-zinc-600 dark:text-zinc-400">
                              {stats.count.toLocaleString()}
                            </td>
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
          <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-8 text-center text-sm text-zinc-500">
            No summary data available.
          </div>
        )}
      </section>
    </div>
  );
}
