"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [email, setEmail] = useState("mohaourydiallo@gmail.com");
  const [password, setPassword] = useState("admin123");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogin = async (demoEmail?: string) => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: demoEmail ? undefined : email,
          password: demoEmail ? undefined : password,
          demoEmail,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Échec de connexion.");
      }

      // Redirection dynamique post-connexion (callbackUrl ou /admin/dashboard pour admin)
      const searchParams = new URLSearchParams(window.location.search);
      const callbackUrl = searchParams.get("callbackUrl");

      window.location.href = callbackUrl || data.redirectTo || "/admin/dashboard";
    } catch (err: any) {
      setError(err.message || "Impossible de se connecter.");
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) {
    return null;
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "radial-gradient(circle at 50% 20%, rgba(125, 21, 56, 0.35) 0%, #0f172a 75%)",
        padding: "1.5rem",
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          background: "rgba(30, 41, 59, 0.8)",
          backdropFilter: "blur(16px)",
          borderRadius: "20px",
          padding: "2.25rem",
          width: "100%",
          maxWidth: "440px",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
          border: "1px solid rgba(255, 255, 255, 0.12)",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
          <div
            style={{
              width: "60px",
              height: "60px",
              borderRadius: "16px",
              background: "linear-gradient(135deg, #7d1538 0%, #a01e4a 100%)",
              color: "#ffffff",
              display: "grid",
              placeItems: "center",
              fontWeight: 900,
              fontSize: "1.5rem",
              margin: "0 auto 0.75rem",
              boxShadow: "0 6px 20px rgba(125, 21, 56, 0.4)",
            }}
          >
            MO
          </div>

          <h1 style={{ fontSize: "1.5rem", fontWeight: 900, color: "#ffffff", letterSpacing: "-0.02em" }}>
            Espace Sécurisé
          </h1>
          <p style={{ fontSize: "0.82rem", fontWeight: 700, color: "#f8d0db", textTransform: "uppercase", letterSpacing: "0.06em", marginTop: "0.2rem" }}>
            PORTFOLIO ADMIN &amp; MONÉTIQUE HUB
          </p>
        </div>

        {error && (
          <div
            style={{
              padding: "0.75rem 1rem",
              background: "rgba(239, 68, 68, 0.2)",
              color: "#fca5a5",
              borderRadius: "10px",
              fontSize: "0.85rem",
              marginBottom: "1.25rem",
              border: "1px solid rgba(239, 68, 68, 0.3)",
            }}
          >
            ⚠️ {error}
          </div>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleLogin();
          }}
          style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
        >
          <div>
            <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, marginBottom: "0.35rem", color: "#cbd5e1" }}>
              Adresse email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="mohaourydiallo@gmail.com"
              style={{
                width: "100%",
                padding: "0.75rem 1rem",
                borderRadius: "10px",
                background: "rgba(15, 23, 42, 0.8)",
                border: "1px solid rgba(255, 255, 255, 0.15)",
                color: "#ffffff",
                fontSize: "0.92rem",
                outline: "none",
              }}
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, marginBottom: "0.35rem", color: "#cbd5e1" }}>
              Mot de passe
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              style={{
                width: "100%",
                padding: "0.75rem 1rem",
                borderRadius: "10px",
                background: "rgba(15, 23, 42, 0.8)",
                border: "1px solid rgba(255, 255, 255, 0.15)",
                color: "#ffffff",
                fontSize: "0.92rem",
                outline: "none",
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              background: "linear-gradient(135deg, #7d1538 0%, #a01e4a 100%)",
              color: "#ffffff",
              padding: "0.85rem",
              borderRadius: "10px",
              fontWeight: 800,
              fontSize: "0.95rem",
              border: "none",
              cursor: loading ? "wait" : "pointer",
              boxShadow: "0 4px 15px rgba(125, 21, 56, 0.4)",
              marginTop: "0.5rem",
            }}
          >
            {loading ? "Connexion en cours..." : "Se connecter →"}
          </button>
        </form>

        <div style={{ marginTop: "1.5rem", textAlign: "center" }}>
          <Link href="/" style={{ fontSize: "0.85rem", color: "#cbd5e1", textDecoration: "none" }}>
            ← Retourner au Portfolio public
          </Link>
        </div>
      </div>
    </div>
  );
}
