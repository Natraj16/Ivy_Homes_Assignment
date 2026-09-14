export function CardSkeletonGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-lg border border-zinc-200 dark:border-zinc-800 p-4 flex flex-col gap-3 animate-pulse bg-white dark:bg-zinc-900">
          <div className="h-5 bg-zinc-200 dark:bg-zinc-800 rounded w-3/4" />
          <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-1/2" />
          <div className="h-5 bg-zinc-200 dark:bg-zinc-800 rounded w-1/3" />
          <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-2/3" />
        </div>
      ))}
    </div>
  );
}
