"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { DEMO_USERS } from "@/modules/auth/types";

export default function LoginPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [email, setEmail] = useState("ourykohkoun@gmail.com");
  const [password, setPassword] = useState("123456");
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

      window.location.href = "/";
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
    <div className="login-container">
      <div className="login-card">
        <div style={{ textAlign: "center", marginBottom: "1.25rem" }}>
          <img
            src="/logo.png"
            alt="M.OURY Logo"
            style={{
              width: "68px",
              height: "68px",
              borderRadius: "50%",
              objectFit: "cover",
              border: "2px solid #e60028",
              boxShadow: "0 6px 16px rgba(230, 0, 40, 0.3)",
              background: "#ffffff",
              marginBottom: "0.5rem",
              display: "inline-block",
            }}
          />
          <h1 style={{ fontSize: "1.4rem", fontWeight: 800, color: "#111827", letterSpacing: "0.02em" }}>M.OURY</h1>
          <p style={{ fontSize: "0.8rem", fontWeight: 700, letterSpacing: "0.06em", color: "#e60028", textTransform: "uppercase" }}>
            EXPERT MONÉTIQUE HUB
          </p>
          <p style={{ fontSize: "0.8rem", color: "#6b7280", marginTop: "0.15rem" }}>
            Plateforme d&apos;exploitation et diagnostic d&apos;incidents monétiques
          </p>
        </div>

        {error && (
          <div
            style={{
              padding: "0.5rem 0.75rem",
              background: "#fee2e2",
              color: "#991b1b",
              borderRadius: "6px",
              fontSize: "0.82rem",
              marginBottom: "1rem",
              border: "1px solid #fca5a5",
            }}
          >
            {error}
          </div>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleLogin();
          }}
          style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}
        >
          <div>
            <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 600, marginBottom: "0.25rem", color: "#0f172a" }}>
              Adresse email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="votre.email@domaine.com"
              style={{
                width: "100%",
                padding: "0.6rem 0.85rem",
                borderRadius: "8px",
                border: "1px solid #cbd5e1",
                fontSize: "0.9rem",
                outline: "none",
              }}
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 600, marginBottom: "0.25rem", color: "#0f172a" }}>
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
                padding: "0.6rem 0.85rem",
                borderRadius: "8px",
                border: "1px solid #cbd5e1",
                fontSize: "0.9rem",
                outline: "none",
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-emerald"
            style={{ width: "100%", justifyContent: "center", padding: "0.65rem 1rem", fontSize: "0.9rem", marginTop: "0.25rem" }}
          >
            {loading ? "Vérification en cours..." : "Se connecter"}
          </button>
        </form>

        <div style={{ marginTop: "1.25rem", borderTop: "1px solid #f1f5f9", paddingTop: "1rem" }}>
          <p style={{ fontSize: "0.72rem", fontWeight: 700, color: "#64748b", textTransform: "uppercase", marginBottom: "0.5rem", textAlign: "center" }}>
            Accès rapide profil (1 clic)
          </p>
          <div style={{ display: "flex", justifyContent: "center" }}>
            {DEMO_USERS.map((user) => (
              <button
                key={user.id}
                type="button"
                className="demo-account-chip"
                style={{ width: "100%", textAlign: "center", alignItems: "center" }}
                onClick={() => handleLogin(user.email)}
              >
                <strong style={{ fontSize: "0.85rem", color: "#0f172a" }}>{user.name}</strong>
                <span style={{ fontSize: "0.72rem", color: "#e60028", fontWeight: 700 }}>{user.role}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Signature & Copyright */}
        <div style={{ marginTop: "1rem", textAlign: "center", fontSize: "0.72rem", color: "#6b7280", borderTop: "1px solid #f3f4f6", paddingTop: "0.75rem" }}>
          © {new Date().getFullYear() - 1} <strong>M.Oury</strong> • <span style={{ color: "#e60028", fontWeight: 600 }}>Ingénieur IT BANKING &amp; Expert Monétique - CBS</span>
        </div>
      </div>
    </div>
  );
}
