"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { fetchApi } from "@/lib/api";

export default function ProjectDetail() {
  const params = useParams();
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (params.id) {
      fetchApi(`/v1/projects/${params.id}`)
        .then((data) => setProject(data))
        .catch((err: any) => setError(err.message || "Failed to load project details"))
        .finally(() => setLoading(false));
    }
  }, [params.id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div style={{ color: 'red' }}>Error: {error}</div>;
  if (!project) return <div>Project not found.</div>;

  return (
    <div className="py-[var(--space-md)]">
      <div className="flex flex-col gap-6 max-w-5xl mx-auto">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-display text-[#111111]">{project.developer_name} {project.apartment_name}</h1>
            <p className="text-body-lg text-[var(--color-secondary)] uppercase mt-2">{project.locality}, Gurgaon</p>
          </div>
          <span className="chip shadow-sm bg-[var(--color-neutral-20)]">{project.project_status}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-[var(--space-lg)] mt-[var(--space-sm)]">
          <div>
            <h2 className="text-headline-sm mb-[var(--space-sm)]">Key Specifications</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-[var(--radius-md)] border border-[var(--color-tertiary)] shadow-sm">
                <p className="text-caption text-[var(--color-secondary)]">LAUNCH DATE</p>
                <p className="text-headline-sm mt-1">{project.launch_date}</p>
              </div>
              <div className="bg-white p-4 rounded-[var(--radius-md)] border border-[var(--color-tertiary)] shadow-sm">
                <p className="text-caption text-[var(--color-secondary)]">POSSESSION</p>
                <p className="text-headline-sm mt-1">{project.possession_date}</p>
              </div>
              <div className="bg-white p-4 rounded-[var(--radius-md)] border border-[var(--color-tertiary)] shadow-sm">
                <p className="text-caption text-[var(--color-secondary)]">RERA NUMBER</p>
                <p className="text-headline-sm mt-1 text-[var(--color-primary)]">{project.rera_number}</p>
              </div>
              <div className="bg-white p-4 rounded-[var(--radius-md)] border border-[var(--color-tertiary)] shadow-sm">
                <p className="text-caption text-[var(--color-secondary)]">PROJECT ID</p>
                <p className="text-headline-sm mt-1">{project.project_id}</p>
              </div>
            </div>

            <h2 className="text-headline-sm mt-[var(--space-lg)] mb-[var(--space-sm)]">Amenities</h2>
            <div className="flex flex-wrap gap-[var(--space-xs)] mb-[var(--space-md)]">
              {project.amenities?.map((amenity: string, idx: number) => (
                <span key={idx} className="chip bg-white border border-[var(--color-tertiary)] text-[var(--color-secondary)] px-4 py-2 text-label-md">{amenity}</span>
              ))}
            </div>
          </div>
          
          <div>
            {/* The Tinted Container Pattern */}
            <div className="bg-[#F5F7FF] rounded-[var(--radius-xl)] p-[var(--space-md)]">
              <span className="chip bg-[#001489] text-white text-[10px] mb-[var(--space-sm)]">PROJECT SCOPE</span>
              
              <div className="bg-white rounded-[var(--radius-lg)] p-0 shadow-sm overflow-hidden mt-2">
                <div className="flex justify-between items-center px-6 py-4 border-b border-[var(--color-tertiary)]">
                  <div>
                    <p className="text-label-lg text-[#111111]">Area Range</p>
                    <p className="text-body-sm text-[var(--color-secondary)]">Min to Max layout sizes</p>
                  </div>
                  <p className="text-headline-sm text-[#111111]">{project.min_area_sqft} - {project.max_area_sqft} sqft</p>
                </div>

                <div className="flex justify-between items-center px-6 py-4 border-b border-[var(--color-tertiary)]">
                  <div>
                    <p className="text-label-lg text-[#111111]">Inventory Details</p>
                    <p className="text-body-sm text-[var(--color-secondary)]">Total units / Available listings</p>
                  </div>
                  <p className="text-headline-sm text-[#111111]">{project.total_units} / {project.total_listings}</p>
                </div>

                <div className="flex justify-between items-center px-6 py-6 bg-white">
                  <div>
                    <p className="text-headline-sm text-[#111111]">Price Range</p>
                    <p className="text-body-sm text-[var(--color-secondary)]">Based on available configurations</p>
                  </div>
                  <div className="text-right">
                    <p className="text-headline-lg text-[var(--color-primary)]">₹ {(project.price_min / 10000000).toFixed(2)} Cr</p>
                    <p className="text-label-md text-[var(--color-secondary)] mt-1">to ₹ {(project.price_max / 10000000).toFixed(2)} Cr</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
