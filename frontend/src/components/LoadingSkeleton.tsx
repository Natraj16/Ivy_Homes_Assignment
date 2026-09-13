// Pulsing skeleton — uses meadow surface to match card bg
export function CardSkeleton() {
  return (
    <div style={{
      background: "var(--color-white)",
      border: "1.5px solid var(--color-border)",
      borderRadius: "var(--radius-card)",
      overflow: "hidden",
    }} className="animate-pulse">
      <div style={{ aspectRatio: "16/9", background: "var(--color-meadow)" }} />
      <div style={{ padding: "16px 20px", display: "flex", flexDirection: "column", gap: "10px" }}>
        <div style={{ height: "16px", background: "var(--color-meadow)", borderRadius: "9999px", width: "45%" }} />
        <div style={{ height: "12px", background: "var(--color-meadow)", borderRadius: "9999px", width: "70%" }} />
        <div style={{ height: "12px", background: "var(--color-meadow)", borderRadius: "9999px", width: "55%" }} />
        <div style={{ height: "12px", background: "var(--color-meadow)", borderRadius: "9999px", width: "35%", marginTop: "4px" }} />
      </div>
    </div>
  );
}

export function CardSkeletonGrid({ count = 9 }: { count?: number }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "16px" }}>
      {Array.from({ length: count }).map((_, i) => <CardSkeleton key={i} />)}
    </div>
  );
}
