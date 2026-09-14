"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { isAuthenticated, logout } from "@/lib/auth";

const NAV_LINKS = [
  { href: "/listings", label: "Listings" },
  { href: "/rentals", label: "Rentals" },
  { href: "/projects", label: "Projects" },
  { href: "/saved", label: "Saved" },
  { href: "/insights", label: "Insights" },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isAuth, setIsAuth] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    const authed = isAuthenticated();
    setIsAuth(authed);
    if (authed && typeof window !== "undefined") {
      try {
        const user = JSON.parse(localStorage.getItem("ivy_user") || "{}");
        setUserEmail(user.email || "");
      } catch { }
    }
  }, [pathname]);

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  return (
    <header className="sticky top-0 z-10 bg-white dark:bg-black border-b border-zinc-200 dark:border-zinc-800">
      <nav className="max-w-6xl mx-auto flex items-center justify-between px-4 py-3">
        {/* Brand */}
        <Link href="/" className="font-semibold text-lg tracking-tight">
          Ivy Homes
        </Link>

        {/* Nav links + auth */}
        <div className="flex items-center gap-1 sm:gap-4 text-sm">
          {isAuth && (
            <>
              {NAV_LINKS.map(({ href, label }) => {
                const active = pathname?.startsWith(href);
                return (
                  <Link
                    key={href}
                    href={href}
                    className={`px-2 py-1 rounded-md transition-colors ${
                      active
                        ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-black"
                        : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                    }`}
                  >
                    {label}
                  </Link>
                );
              })}

              {/* Divider */}
              <div className="hidden sm:block w-px h-5 bg-zinc-200 dark:bg-zinc-700 mx-1" />

              {/* Email */}
              {userEmail && (
                <span className="hidden sm:inline text-xs text-zinc-500 max-w-[160px] truncate">
                  {userEmail}
                </span>
              )}

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="border border-zinc-300 dark:border-zinc-700 rounded-md px-3 py-1.5 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              >
                Log out
              </button>
            </>
          )}

          {!isAuth && pathname !== "/login" && (
            <Link
              href="/login"
              className="bg-zinc-900 text-white dark:bg-zinc-100 dark:text-black rounded-md px-3 py-1.5 text-sm font-medium hover:opacity-90 transition-opacity"
            >
              Log in
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
