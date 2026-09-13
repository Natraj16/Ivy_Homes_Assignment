"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { fetchApi } from "@/lib/api";

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

  if (loading) return (
    <div className="max-w-6xl mx-auto animate-pulse space-y-4 py-8">
      <div className="h-10 bg-[var(--color-border)] rounded-full w-2/3" />
      <div className="h-72 bg-[var(--color-meadow)] rounded-[var(--radius-card)]" />
    </div>
  );

  if (error) return (
    <div className="py-12 text-center">
      <p className="text-body-md text-[var(--color-error)] mb-4">{error}</p>
      <Link href="/projects" className="text-label-md text-[var(--color-primary)] hover:underline">← Back to projects</Link>
    </div>
  );

  if (!project) return null;

  return (
    <div className="max-w-6xl mx-auto py-[var(--sp-24)]">
      {/* Breadcrumb */}
      <div className="mb-[var(--sp-32)]">
        <Link href="/projects" className="text-label text-[var(--color-primary)] hover:underline flex items-center gap-2">
          <span>←</span> Back to Projects
        </Link>
      </div>

      <div className="flex flex-col lg:flex-row gap-[var(--sp-48)]">
        
        {/* Left Column: Details */}
        <div className="flex-1 min-w-0 flex flex-col gap-[var(--sp-48)]">
          
          {/* Header */}
          <div>
            <div className="flex gap-2 mb-[var(--sp-16)]">
              <span className="chip">{project.project_status || "Project"}</span>
            </div>
            <h1 className="text-display text-[var(--color-ink)] mb-[var(--sp-8)]">
              {project.developer_name} {project.apartment_name}
            </h1>
            <p className="text-heading-sm text-[var(--color-muted)] capitalize">
              {project.locality}, Bangalore
            </p>
          </div>

          {/* Key Specifications Grid */}
          <div>
            <h2 className="text-heading-sm text-[var(--color-ink)] mb-[var(--sp-16)]">Key Specifications</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-[var(--sp-16)]">
              <div className="card text-center flex flex-col justify-center gap-1">
                <p className="text-label-sm text-[var(--color-muted)]">Launch Date</p>
                <p className="text-heading text-[var(--color-ink)]">{project.launch_date || "—"}</p>
              </div>
              <div className="card text-center flex flex-col justify-center gap-1">
                <p className="text-label-sm text-[var(--color-muted)]">Possession</p>
                <p className="text-heading text-[var(--color-ink)]">{project.possession_date || "—"}</p>
              </div>
              <div className="card text-center flex flex-col justify-center gap-1">
                <p className="text-label-sm text-[var(--color-muted)]">RERA</p>
                <p className="text-heading text-[var(--color-ink)] text-[12px] truncate px-2" title={project.rera_number}>{project.rera_number || "—"}</p>
              </div>
              <div className="card text-center flex flex-col justify-center gap-1">
                <p className="text-label-sm text-[var(--color-muted)]">Project ID</p>
                <p className="text-heading text-[var(--color-ink)]">{project.project_id || "—"}</p>
              </div>
            </div>
          </div>

          {/* Amenities */}
          {project.amenities && project.amenities.length > 0 && (
            <div>
              <h2 className="text-heading-sm text-[var(--color-ink)] mb-[var(--sp-16)]">Amenities</h2>
              <div className="flex flex-wrap gap-[var(--sp-12)]">
                {project.amenities.map((amenity: string, idx: number) => (
                  <span key={idx} className="chip-muted !px-4 !py-2 !rounded-[var(--radius-pill)]">
                    {amenity}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Pricing & Scope (Sticky) */}
        <div className="lg:w-[380px] shrink-0">
          <div className="card flex flex-col gap-[var(--sp-24)] lg:sticky lg:top-[100px]">
            
            <div className="flex items-center justify-between">
              <span className="chip">Project Scope</span>
            </div>

            <div className="flex flex-col gap-[var(--sp-8)]">
              <p className="text-label text-[var(--color-muted)]">Price Range</p>
              {project.price_min && project.price_max ? (
                <>
                  <p className="text-display text-[var(--color-primary)]">
                    ₹ {(project.price_min / 10000000).toFixed(2)} Cr
                  </p>
                  <p className="text-heading-sm text-[var(--color-muted)]">
                    to ₹ {(project.price_max / 10000000).toFixed(2)} Cr
                  </p>
                </>
              ) : (
                <p className="text-display text-[var(--color-primary)]">Price on request</p>
              )}
            </div>

            <div className="card-white flex flex-col mt-[var(--sp-8)] p-[var(--sp-16)] gap-[var(--sp-16)]">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-label text-[var(--color-ink)]">Area Range</p>
                  <p className="text-caption text-[var(--color-muted)]">Min to Max layout sizes</p>
                </div>
                <p className="text-heading-sm text-[var(--color-ink)] text-right">
                  {project.min_area_sqft} - {project.max_area_sqft}<br/>sqft
                </p>
              </div>
              
              <div className="w-full h-px bg-[var(--color-border)]" />
              
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-label text-[var(--color-ink)]">Inventory</p>
                  <p className="text-caption text-[var(--color-muted)]">Units / Available</p>
                </div>
                <p className="text-heading-sm text-[var(--color-ink)] text-right">
                  {project.total_units} / {project.total_listings}
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
