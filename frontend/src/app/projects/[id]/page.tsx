"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { fetchApi } from "@/lib/api";

function titleCase(str?: string) {
  if (!str) return "";
  return str.replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    fetchApi(`/v1/projects/${id}`)
      .then((data) => setProject(data))
      .catch((err: any) => setError(err.message || "Failed to load project details"))
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
        <Link href="/projects" className="text-sm text-zinc-500 hover:text-zinc-900 underline">
          ← Back to projects
        </Link>
      </div>
    );
  }

  if (!project) return null;

  const locality = titleCase(project.locality || "Gurgaon");

  return (
    <div className="flex flex-col gap-6 max-w-3xl">
      <Link
        href="/projects"
        className="text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
      >
        ← Back to Projects
      </Link>

      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
          {project.developer_name} {project.apartment_name}
        </h1>
        <p className="text-zinc-500 text-sm mt-0.5">{locality}, Gurgaon</p>
      </div>

      {/* Badges */}
      <div className="flex items-center gap-2">
        <span className="text-xs px-2.5 py-0.5 rounded-full font-medium bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 capitalize">
          {project.project_status || "Project"}
        </span>
      </div>

      {/* Price */}
      {project.price_min && project.price_max ? (
        <p className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
          ₹ {Number(project.price_min).toFixed(2)} – {Number(project.price_max).toFixed(2)} Cr
        </p>
      ) : null}

      {/* Details Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm border border-zinc-200 dark:border-zinc-800 rounded-lg p-4 bg-white dark:bg-zinc-900">
        <div>
          <p className="text-zinc-500 text-xs mb-0.5">Total Units</p>
          <p className="font-medium text-zinc-900 dark:text-zinc-100">
            {project.total_units?.toLocaleString("en-IN") || "—"}
          </p>
        </div>
        <div>
          <p className="text-zinc-500 text-xs mb-0.5">Towers / Floors</p>
          <p className="font-medium text-zinc-900 dark:text-zinc-100">
            {project.total_towers ? `${project.total_towers} towers, ` : ""}
            {project.total_floors ? `${project.total_floors} floors` : "—"}
          </p>
        </div>
        <div>
          <p className="text-zinc-500 text-xs mb-0.5">Area Range</p>
          <p className="font-medium text-zinc-900 dark:text-zinc-100">
            {project.min_area_sqft} – {project.max_area_sqft} sqft
          </p>
        </div>
        <div>
          <p className="text-zinc-500 text-xs mb-0.5">Launch Date</p>
          <p className="font-medium text-zinc-900 dark:text-zinc-100">{project.launch_date || "—"}</p>
        </div>
        <div>
          <p className="text-zinc-500 text-xs mb-0.5">Possession</p>
          <p className="font-medium text-zinc-900 dark:text-zinc-100">{project.possession_date || "—"}</p>
        </div>
        <div>
          <p className="text-zinc-500 text-xs mb-0.5">RERA Number</p>
          <p className="font-medium text-zinc-900 dark:text-zinc-100 text-xs font-mono">
            {project.rera_number || "—"}
          </p>
        </div>
      </div>

      {/* Amenities */}
      {project.amenities && project.amenities.length > 0 && (
        <div className="flex flex-col gap-2">
          <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">Amenities</h2>
          <div className="flex flex-wrap gap-2">
            {project.amenities.map((a: string) => (
              <span
                key={a}
                className="text-xs px-2.5 py-1 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 capitalize"
              >
                {a}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
