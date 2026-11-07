"use client";

import { useState, useEffect } from "react";

export default function LoginPage() {
  const [mounted, setMounted] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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

      const searchParams = new URLSearchParams(window.location.search);
      const callbackUrl = searchParams.get("callbackUrl");

      window.location.href = callbackUrl || data.redirectTo || "/hub";
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
    <div className="login-root">
      <style>{`
        html, body {
          margin: 0;
          padding: 0;
          height: 100vh;
          overflow: hidden;
        }

        .login-root {
          height: 100vh;
          max-height: 100vh;
          width: 100vw;
          margin: 0;
          padding: 0;
          display: flex;
          background: #060b13;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
          color: #f8fafc;
          overflow: hidden;
        }

        .login-container {
          display: flex;
          width: 100%;
          height: 100vh;
          max-height: 100vh;
          overflow: hidden;
        }

        /* COLONNE GAUCHE : L'IMAGE D'ARCHITECTURE S'AFFICHE ENTIÈREMENT SANS ROGNAGE */
        .login-visual-pane {
          position: relative;
          flex: 1 1 auto;
          height: 100vh;
          max-height: 100vh;
          background: #030712;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1.5rem;
          box-sizing: border-box;
        }

        .login-hero-img {
          width: 100%;
          height: 100%;
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
          object-position: center;
          display: block;
          filter: drop-shadow(0 20px 40px rgba(0, 0, 0, 0.85));
        }

        .login-visual-pane::after {
          content: "";
          position: absolute;
          inset: 0;
          pointer-events: none;
          box-shadow: inset 0 0 60px 20px #030712;
        }

        /* COLONNE DROITE : FORMULAIRE PARFAITEMENT CENTRÉ VERTICALEMENT */
        .login-form-pane {
          flex: 0 0 440px;
          width: 440px;
          min-width: 380px;
          height: 100vh;
          max-height: 100vh;
          background: #080e1a;
          border-left: 1px solid rgba(255, 255, 255, 0.08);
          display: flex;
          flex-direction: column;
          justifyContent: center;
          align-items: center;
          padding: 2rem 2.75rem;
          box-sizing: border-box;
          overflow: hidden;
          position: relative;
        }

        .login-card-inner {
          width: 100%;
          max-width: 420px;
          margin: auto 0;
          display: flex;
          flex-direction: column;
        }

        .login-input {
          width: 100%;
          padding: 0.72rem 1rem;
          border-radius: 10px;
          background: rgba(15, 23, 42, 0.85);
          border: 1px solid rgba(255, 255, 255, 0.12);
          color: #ffffff;
          font-size: 0.9rem;
          outline: none;
          box-sizing: border-box;
          transition: all 0.2s ease;
        }

        .login-input:focus {
          border-color: #00a800 !important;
          box-shadow: 0 0 0 3px rgba(0, 168, 0, 0.2) !important;
          background: rgba(15, 23, 42, 1);
        }

        .login-submit-btn {
          width: 100%;
          background: linear-gradient(135deg, #00a800 0%, #15803d 100%);
          color: #ffffff;
          padding: 0.8rem 1.25rem;
          border-radius: 10px;
          font-weight: 800;
          font-size: 0.95rem;
          border: none;
          cursor: pointer;
          box-shadow: 0 6px 20px rgba(0, 168, 0, 0.35);
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }

        .login-submit-btn:hover:not(:disabled) {
          filter: brightness(1.1);
          transform: translateY(-1px);
          box-shadow: 0 8px 24px rgba(0, 168, 0, 0.45);
        }

        .login-submit-btn:disabled {
          opacity: 0.7;
          cursor: wait;
        }

        /* RESPONSIVE DESIGN POUR TRÈS PETITS ÉCRANS */
        @media (max-height: 580px) {
          .login-form-pane {
            overflow-y: auto;
            padding-top: 1.5rem;
            padding-bottom: 1.5rem;
          }
          .visual-content-top {
            padding: 1rem 1.5rem;
          }
          .visual-content-bottom {
            padding: 1rem 1.5rem;
          }
        }

        @media (max-width: 1024px) {
          html, body, .login-root, .login-container {
            height: auto;
            overflow-y: auto;
          }
          .login-container {
            flex-direction: column;
          }
          .login-visual-pane {
            min-height: 240px;
            height: 240px;
            flex: none;
          }
          .login-form-pane {
            flex: 1;
            height: auto;
            max-height: none;
            overflow: visible;
            border-left: none;
            border-top: 1px solid rgba(255, 255, 255, 0.08);
            padding: 2rem 1.5rem;
          }
        }
      `}</style>

      <div className="login-container">
        {/* =================================================================== */}
        {/* 1. COLONNE GAUCHE : L'IMAGE D'ARCHITECTURE EN PLEINE RÉSOLUTION    */}
        {/* =================================================================== */}
        <section className="login-visual-pane" aria-label="Visualisation Architecture IT Banking">
          <img
            src="/login-hero.jpg"
            alt="Architecture Monétique & Core Banking — Mohamed Oury Diallo"
            className="login-hero-img"
          />
        </section>

        {/* =================================================================== */}
        {/* 2. COLONNE DROITE : FORMULAIRE DE CONNEXION (CENTRÉ, SANS SCROLL)   */}
        {/* =================================================================== */}
        <section className="login-form-pane" aria-label="Formulaire d'authentification">
          <div className="login-card-inner">
            {/* Header Identité Plateforme */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.85rem", marginBottom: "1.25rem" }}>
              <div
                style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "12px",
                  background: "linear-gradient(135deg, #00a800 0%, #15803d 100%)",
                  display: "grid",
                  placeItems: "center",
                  fontWeight: 900,
                  fontSize: "1.15rem",
                  color: "#ffffff",
                  boxShadow: "0 4px 16px rgba(0, 168, 0, 0.45)",
                  flexShrink: 0,
                }}
              >
                ⚡
              </div>
              <div>
                <div
                  style={{
                    fontSize: "0.7rem",
                    fontWeight: 800,
                    letterSpacing: "0.12em",
                    color: "#4ade80",
                    textTransform: "uppercase",
                  }}
                >
                  BANKING COMMAND CENTER
                </div>
                <div
                  style={{
                    fontSize: "1.15rem",
                    fontWeight: 900,
                    color: "#ffffff",
                    letterSpacing: "-0.01em",
                  }}
                >
                  Monétique &amp; Multi-CBS Hub
                </div>
              </div>
            </div>

            {/* Titre & Description de Connexion */}
            <div style={{ marginBottom: "1.15rem" }}>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.4rem",
                  padding: "0.25rem 0.65rem",
                  borderRadius: "8px",
                  background: "rgba(0, 168, 0, 0.12)",
                  border: "1px solid rgba(74, 222, 128, 0.3)",
                  marginBottom: "0.6rem",
                }}
              >
                <span style={{ fontSize: "0.72rem" }}>🔒</span>
                <span
                  style={{
                    fontSize: "0.68rem",
                    fontWeight: 800,
                    color: "#4ade80",
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                  }}
                >
                  AUTHENTIFICATION RBAC • PCI-DSS • ISO 8583
                </span>
              </div>

              <h1
                style={{
                  fontSize: "1.55rem",
                  fontWeight: 900,
                  color: "#ffffff",
                  letterSpacing: "-0.02em",
                  margin: "0 0 0.35rem 0",
                  lineHeight: 1.2,
                }}
              >
                Connexion à votre espace
              </h1>

              <p style={{ fontSize: "0.82rem", color: "#94a3b8", margin: 0, lineHeight: 1.4 }}>
                Supervision Monétique, Amplitude, FLEXCUBE &amp; Référentiel de Production.
              </p>
            </div>

            {/* Alerte Erreur */}
            {error && (
              <div
                style={{
                  padding: "0.7rem 1rem",
                  background: "rgba(239, 68, 68, 0.14)",
                  color: "#fca5a5",
                  borderRadius: "10px",
                  fontSize: "0.84rem",
                  fontWeight: 600,
                  marginBottom: "1rem",
                  border: "1px solid rgba(239, 68, 68, 0.35)",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                <span>⚠️</span>
                <span>{error}</span>
              </div>
            )}

            {/* Formulaire de connexion */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleLogin();
              }}
              style={{ display: "flex", flexDirection: "column", gap: "0.9rem" }}
            >
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.8rem",
                    fontWeight: 700,
                    marginBottom: "0.35rem",
                    color: "#cbd5e1",
                  }}
                >
                  Adresse email professionnelle
                </label>
                <input
                  className="login-input"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nom.prenom@banque.com"
                />
              </div>

              <div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "0.35rem",
                  }}
                >
                  <label
                    style={{
                      fontSize: "0.8rem",
                      fontWeight: 700,
                      color: "#cbd5e1",
                    }}
                  >
                    Mot de passe
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    style={{
                      background: "transparent",
                      border: "none",
                      color: "#94a3b8",
                      fontSize: "0.74rem",
                      fontWeight: 600,
                      cursor: "pointer",
                      padding: 0,
                    }}
                  >
                    {showPassword ? "🙈 Masquer" : "👁️ Afficher"}
                  </button>
                </div>

                <input
                  className="login-input"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="login-submit-btn"
                style={{ marginTop: "0.25rem" }}
              >
                {loading ? "Authentification en cours..." : "Se connecter au Hub →"}
              </button>
            </form>

            {/* Raccourci de test SuperAdmin */}
            <div
              style={{
                marginTop: "1rem",
                padding: "0.75rem 1rem",
                borderRadius: "10px",
                background: "rgba(15, 23, 42, 0.6)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div style={{ fontSize: "0.76rem", color: "#94a3b8" }}>
                Accès rapide : <strong style={{ color: "#ffffff" }}>SuperAdmin</strong>
              </div>
              <button
                type="button"
                onClick={() => handleLogin("mohaourydiallo@gmail.com")}
                disabled={loading}
                style={{
                  background: "rgba(0, 168, 0, 0.15)",
                  color: "#4ade80",
                  border: "1px solid rgba(74, 222, 128, 0.35)",
                  padding: "0.3rem 0.7rem",
                  borderRadius: "8px",
                  fontSize: "0.74rem",
                  fontWeight: 700,
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                }}
              >
                Accès Express ⚡
              </button>
            </div>

            {/* Encart Gouvernance & Sécurité */}
            <div
              style={{
                marginTop: "1.25rem",
                paddingTop: "0.85rem",
                borderTop: "1px solid rgba(255, 255, 255, 0.08)",
                display: "flex",
                flexDirection: "column",
                gap: "0.3rem",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.45rem",
                  fontSize: "0.74rem",
                  color: "#94a3b8",
                }}
              >
                <span>🛡️</span>
                <span>
                  Environnement bancaire protégé &amp; conforme :{" "}
                  <strong style={{ color: "#e2e8f0" }}>PCI-DSS &amp; ISO 8583</strong>
                </span>
              </div>
              <div
                style={{
                  fontSize: "0.7rem",
                  color: "#64748b",
                  lineHeight: 1.35,
                }}
              >
                Toutes les tentatives d&apos;authentification et sessions sont journalisées dans la piste d&apos;audit.
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
