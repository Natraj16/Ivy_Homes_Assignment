"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/lib/auth";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await login(email, password);
      router.push("/listings");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    /* Full-viewport centering on canvas bg */
    <div style={{
      minHeight: "calc(100vh - 64px)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "48px 24px",
      background: "var(--color-canvas)",
      margin: "-32px -48px",
    }}>
      {/*
        Ditto card pattern:
        - bg: white (#fff) for the form itself
        - 24px radius
        - meadow border
        - generous padding
      */}
      <div style={{
        width: "100%",
        maxWidth: "400px",
        background: "var(--color-white)",
        borderRadius: "var(--radius-card)",
        border: "1.5px solid var(--color-border)",
        padding: "40px",
      }}>
        {/* Logo lockup */}
        <div style={{ marginBottom: "32px" }}>
          <span style={{ fontFamily: "var(--font-display)", fontSize: "26px", fontWeight: 700, color: "var(--color-primary)", letterSpacing: "-0.02em" }}>Ivy</span>
          <span style={{ fontFamily: "var(--font-ui)", fontSize: "22px", fontWeight: 400, color: "var(--color-ink)", letterSpacing: "-0.02em" }}>homes</span>
        </div>

        <h1 style={{ fontSize: "20px", fontWeight: 600, color: "var(--color-ink)", marginBottom: "24px", fontFamily: "var(--font-ui)" }}>
          Log in
        </h1>

        {/* Error banner — above form, light red tint */}
        {error && (
          <div style={{
            marginBottom: "16px",
            padding: "10px 14px",
            background: "#FEF2F2",
            border: "1px solid #FECACA",
            borderRadius: "12px",
          }}>
            <p style={{ fontSize: "14px", color: "var(--color-error)", fontFamily: "var(--font-ui)" }}>{error}</p>
          </div>
        )}

        <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label style={{ fontSize: "14px", fontWeight: 600, color: "var(--color-ink)", fontFamily: "var(--font-ui)" }}>
              Email
            </label>
            {/* Pill-shaped input — Ditto signature */}
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="demo1@ivy.homes"
              style={{
                width: "100%",
                height: "44px",
                padding: "0 18px",
                borderRadius: "9999px",
                border: "1.5px solid var(--color-border)",
                fontSize: "15px",
                fontFamily: "var(--font-ui)",
                color: "var(--color-body)",
                background: "var(--color-canvas)",
                outline: "none",
                boxSizing: "border-box",
              }}
              onFocus={e => (e.target.style.borderColor = "var(--color-primary)")}
              onBlur={e => (e.target.style.borderColor = "var(--color-border)")}
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label style={{ fontSize: "14px", fontWeight: 600, color: "var(--color-ink)", fontFamily: "var(--font-ui)" }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              style={{
                width: "100%",
                height: "44px",
                padding: "0 18px",
                borderRadius: "9999px",
                border: "1.5px solid var(--color-border)",
                fontSize: "15px",
                fontFamily: "var(--font-ui)",
                color: "var(--color-body)",
                background: "var(--color-canvas)",
                outline: "none",
                boxSizing: "border-box",
              }}
              onFocus={e => (e.target.style.borderColor = "var(--color-primary)")}
              onBlur={e => (e.target.style.borderColor = "var(--color-border)")}
            />
          </div>

          {/* Pill primary button */}
          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: "8px",
              width: "100%",
              height: "44px",
              borderRadius: "9999px",
              background: loading ? "var(--color-border)" : "var(--color-primary)",
              color: "#fff",
              fontSize: "15px",
              fontWeight: 600,
              fontFamily: "var(--font-ui)",
              border: "none",
              cursor: loading ? "not-allowed" : "pointer",
              transition: "background 0.15s ease",
            }}
          >
            {loading ? "Logging in…" : "Log in"}
          </button>
        </form>
      </div>
    </div>
  );
}
