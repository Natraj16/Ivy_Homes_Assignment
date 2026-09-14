import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col gap-12 py-8 max-w-5xl mx-auto w-full">
      {/* Hero Section */}
      <section className="flex flex-col items-center text-center gap-4 py-8 md:py-12">
        <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 px-3 py-1 rounded-full">
          Gurgaon Real Estate
        </span>
        <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 max-w-2xl">
          Discover verified homes & market intelligence
        </h1>
        <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 max-w-xl">
          Explore curated apartments, transparent rental listings, and verified builder projects across Gurgaon's top localities.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 mt-4">
          <Link
            href="/listings"
            className="rounded-md bg-zinc-900 text-white dark:bg-zinc-100 dark:text-black px-5 py-2.5 text-sm font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
          >
            Browse Listings
          </Link>
          <Link
            href="/rentals"
            className="rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 px-5 py-2.5 text-sm font-medium hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
          >
            Explore Rentals
          </Link>
          <Link
            href="/insights"
            className="rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 px-5 py-2.5 text-sm font-medium hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
          >
            Market Insights
          </Link>
        </div>
      </section>

      {/* Explore Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Listings Card */}
        <Link
          href="/listings"
          className="group rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 flex flex-col justify-between hover:border-zinc-400 dark:hover:border-zinc-600 transition-colors shadow-xs"
        >
          <div>
            <div className="w-10 h-10 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mb-4 text-zinc-700 dark:text-zinc-300">
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors">
              Verified Properties for Sale
            </h2>
            <p className="text-sm text-zinc-500 mt-1">
              Browse 2 BHK, 3 BHK, 4 BHK and luxury apartments with verified measurements and pricing.
            </p>
          </div>
          <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300 mt-6 inline-flex items-center gap-1">
            View listings →
          </span>
        </Link>

        {/* Rentals Card */}
        <Link
          href="/rentals"
          className="group rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 flex flex-col justify-between hover:border-zinc-400 dark:hover:border-zinc-600 transition-colors shadow-xs"
        >
          <div>
            <div className="w-10 h-10 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mb-4 text-zinc-700 dark:text-zinc-300">
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors">
              Rental Homes
            </h2>
            <p className="text-sm text-zinc-500 mt-1">
              Find apartments and flats for rent across prime Gurgaon sectors with verified monthly rent data.
            </p>
          </div>
          <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300 mt-6 inline-flex items-center gap-1">
            View rentals →
          </span>
        </Link>

        {/* Projects Card */}
        <Link
          href="/projects"
          className="group rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 flex flex-col justify-between hover:border-zinc-400 dark:hover:border-zinc-600 transition-colors shadow-xs"
        >
          <div>
            <div className="w-10 h-10 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mb-4 text-zinc-700 dark:text-zinc-300">
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors">
              New Projects & Developments
            </h2>
            <p className="text-sm text-zinc-500 mt-1">
              Explore ongoing and newly completed residential communities by top developers.
            </p>
          </div>
          <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300 mt-6 inline-flex items-center gap-1">
            View projects →
          </span>
        </Link>

        {/* Insights Card */}
        <Link
          href="/insights"
          className="group rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 flex flex-col justify-between hover:border-zinc-400 dark:hover:border-zinc-600 transition-colors shadow-xs"
        >
          <div>
            <div className="w-10 h-10 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mb-4 text-zinc-700 dark:text-zinc-300">
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors">
              Analytics & Insights
            </h2>
            <p className="text-sm text-zinc-500 mt-1">
              Analyze median property rates, locality distributions, price per sqft metrics, and data discoveries.
            </p>
          </div>
          <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300 mt-6 inline-flex items-center gap-1">
            View analytics →
          </span>
        </Link>
      </section>

      {/* Highlights Bar */}
      <section className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
          <div className="flex flex-col gap-1">
            <span className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">10+</span>
            <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Prime Gurgaon Sectors</span>
          </div>
          <div className="flex flex-col gap-1 sm:border-x sm:border-zinc-200 dark:sm:border-zinc-800">
            <span className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">100%</span>
            <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Verified Carpet Area</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">Transparent</span>
            <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Price Analytics</span>
          </div>
        </div>
      </section>
    </div>
  );
}
