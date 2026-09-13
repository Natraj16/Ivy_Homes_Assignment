"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { fetchApi } from "@/lib/api";

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
    <Link href={href} style={{ display: "block", textDecoration: "none" }}>
      {/*
        Ditto card pattern:
        - bg: --color-meadow (not pure white)
        - radius: 24px
        - NO shadow at rest
        - subtle lift on hover via transform
      */}
      <article
        style={{
          background: "var(--color-white)",
          border: "1.5px solid var(--color-border)",
          borderRadius: "var(--radius-card)",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          height: "100%",
          transition: "transform 0.15s ease, border-color 0.15s ease",
        }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
          (e.currentTarget as HTMLElement).style.borderColor = "var(--color-primary)";
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
          (e.currentTarget as HTMLElement).style.borderColor = "var(--color-border)";
        }}
      >
        {/* Image area — 16:9 aspect ratio, meadow-tinted placeholder */}
        <div style={{ position: "relative", aspectRatio: "16/9", background: "var(--color-meadow)", flexShrink: 0 }}>
          {/* House icon placeholder — no broken img */}
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="40" height="40" fill="none" viewBox="0 0 24 24" stroke="var(--color-border-strong)" strokeWidth={1.2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 22V12h6v10" />
            </svg>
          </div>

          {/* Verified chip — pill shape (Ditto) */}
          {isVerified && (
            <span style={{
              position: "absolute", bottom: "10px", left: "10px",
              background: "var(--color-primary)", color: "#fff",
              borderRadius: "9999px", padding: "3px 10px",
              fontSize: "11px", fontWeight: 700, letterSpacing: "0.04em", textTransform: "uppercase",
            }}>
              Verified
            </span>
          )}

          {/* Save heart */}
          {canSave && (
            <button
              onClick={toggleSave}
              disabled={saving}
              aria-label={saved ? "Remove from saved" : "Save listing"}
              style={{
                position: "absolute", top: "10px", right: "10px",
                width: "32px", height: "32px",
                background: "white",
                border: "1.5px solid var(--color-border)",
                borderRadius: "9999px",
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer",
                transition: "all 0.15s ease",
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" strokeWidth={2}
                fill={saved ? "var(--color-primary)" : "none"}
                stroke={saved ? "var(--color-primary)" : "#888"}
              >
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
          )}
        </div>

        {/* Body */}
        <div style={{ padding: "16px 20px", display: "flex", flexDirection: "column", gap: "6px", flex: 1 }}>
          {/* Price — anchoring element, primary color */}
          <p style={{ fontSize: "18px", fontWeight: 700, color: "var(--color-primary)", letterSpacing: "-0.01em", lineHeight: 1.2 }}>
            {price}
          </p>

          {/* Facts line */}
          {(beds || baths) && (
            <p style={{ fontSize: "13px", color: "var(--color-muted)", lineHeight: 1.4 }}>
              {beds} bed · {baths} bath · {area}
            </p>
          )}
          {!beds && area && (
            <p style={{ fontSize: "13px", color: "var(--color-muted)", lineHeight: 1.4 }}>{area}</p>
          )}

          {/* Title */}
          <p style={{ fontSize: "14px", fontWeight: 500, color: "var(--color-ink)", lineHeight: 1.4, display: "-webkit-box", WebkitLineClamp: 1, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
            {title}
          </p>

          {/* Locality — with pin icon */}
          <p style={{ fontSize: "13px", color: "var(--color-muted)", display: "flex", alignItems: "center", gap: "4px", marginTop: "4px" }}>
            <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <circle cx="12" cy="11" r="3" />
            </svg>
            {locality}
          </p>
        </div>
      </article>
    </Link>
  );
}
