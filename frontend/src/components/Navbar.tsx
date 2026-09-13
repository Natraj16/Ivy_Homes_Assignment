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
      } catch {}
    }
  }, [pathname]);

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  return (
    /* Ditto pattern: nav sits on --color-meadow, no shadow */
    <header className="sticky top-0 z-50" style={{ background: "var(--color-meadow)" }}>
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "0 48px",
          height: "64px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "24px",
          borderBottom: "1.5px solid var(--color-border)",
        }}
      >
        {/* Logo — always links to listings */}
        <Link href="/listings" style={{ display: "flex", alignItems: "baseline", gap: "1px", textDecoration: "none" }}>
          <span style={{ fontFamily: "var(--font-display)", fontSize: "22px", fontWeight: 700, color: "var(--color-primary)", letterSpacing: "-0.02em", lineHeight: 1 }}>Ivy</span>
          <span style={{ fontFamily: "var(--font-ui)", fontSize: "20px", fontWeight: 400, color: "var(--color-ink)", letterSpacing: "-0.02em", lineHeight: 1 }}>homes</span>
        </Link>

        {/* Center nav — only when authenticated */}
        {isAuth && (
          <nav style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            {NAV_LINKS.map(({ href, label }) => {
              const active = pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  style={{
                    padding: "6px 16px",
                    borderRadius: "9999px",
                    fontSize: "14px",
                    fontWeight: 500,
                    fontFamily: "var(--font-ui)",
                    letterSpacing: "-0.01em",
                    textDecoration: "none",
                    transition: "all 0.15s ease",
                    background: active ? "var(--color-primary)" : "transparent",
                    color: active ? "#fff" : "var(--color-ink)",
                  }}
                >
                  {label}
                </Link>
              );
            })}
          </nav>
        )}

        {/* Right: email + logout / login */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          {isAuth ? (
            <>
              {userEmail && (
                <span style={{ fontSize: "13px", color: "var(--color-muted)", fontFamily: "var(--font-ui)", maxWidth: "200px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {userEmail}
                </span>
              )}
              <button
                onClick={handleLogout}
                style={{
                  height: "36px",
                  padding: "0 18px",
                  borderRadius: "9999px",
                  border: "1.5px solid var(--color-border-strong)",
                  background: "transparent",
                  color: "var(--color-ink)",
                  fontSize: "14px",
                  fontWeight: 500,
                  fontFamily: "var(--font-ui)",
                  cursor: "pointer",
                }}
              >
                Log out
              </button>
            </>
          ) : pathname !== "/login" ? (
            <Link
              href="/login"
              style={{
                height: "36px",
                padding: "0 18px",
                borderRadius: "9999px",
                background: "var(--color-primary)",
                color: "#fff",
                fontSize: "14px",
                fontWeight: 600,
                fontFamily: "var(--font-ui)",
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
              }}
            >
              Log in
            </Link>
          ) : null}
        </div>
      </div>
    </header>
  );
}
