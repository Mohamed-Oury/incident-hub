"use client";

import { useState, useEffect } from "react";

export default function LoginPage() {
  const [mounted, setMounted] = useState(false);
  const [email, setEmail] = useState("mohaourydiallo@gmail.com");
  const [password, setPassword] = useState("admin123");
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

        /* COLONNE GAUCHE : IMAGE PLEIN ÉCRAN SANS AUCUN DÉBORDEMENT */
        .login-visual-pane {
          position: relative;
          flex: 1 1 56%;
          height: 100vh;
          max-height: 100vh;
          background: #020617;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          justifyContent: space-between;
        }

        .login-hero-img {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
          display: block;
        }

        .login-visual-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            180deg,
            rgba(6, 11, 19, 0.85) 0%,
            rgba(6, 11, 19, 0.25) 35%,
            rgba(6, 11, 19, 0.55) 65%,
            rgba(6, 11, 19, 0.95) 100%
          );
          z-index: 1;
        }

        .visual-content-top {
          position: relative;
          z-index: 2;
          padding: 1.75rem 2.25rem;
          display: flex;
          justifyContent: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 0.75rem;
        }

        .visual-content-bottom {
          position: relative;
          z-index: 2;
          padding: 1.75rem 2.25rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        /* COLONNE DROITE : FORMULAIRE PARFAITEMENT CENTRÉ VERTICALEMENT */
        .login-form-pane {
          flex: 0 0 44%;
          height: 100vh;
          max-height: 100vh;
          background: #080e1a;
          border-left: 1px solid rgba(255, 255, 255, 0.08);
          display: flex;
          flex-direction: column;
          justifyContent: center;
          align-items: center;
          padding: 2rem 3rem;
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
        {/* 1. COLONNE GAUCHE : L'IMAGE PREND TOUT L'ESPACE                     */}
        {/* =================================================================== */}
        <section className="login-visual-pane" aria-label="Visualisation Architecture IT Banking">
          {/* L'image de fond qui couvre toute la surface */}
          <img
            src="/login-hero.jpg"
            alt="Architecture Monétique & Core Banking — Mohamed Oury Diallo"
            className="login-hero-img"
          />

          {/* Voile sombre dégradé pour sublimer les informations */}
          <div className="login-visual-overlay" />

          {/* En-tête supérieur gauche : Identité de la plateforme */}
          <div className="visual-content-top">
            <div style={{ display: "flex", alignItems: "center", gap: "0.85rem" }}>
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
                }}
              >
                ⚡
              </div>
              <div>
                <div
                  style={{
                    fontSize: "0.72rem",
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

            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.4rem 0.9rem",
                borderRadius: "999px",
                background: "rgba(0, 168, 0, 0.16)",
                border: "1px solid rgba(74, 222, 128, 0.35)",
                color: "#86efac",
                fontSize: "0.75rem",
                fontWeight: 700,
                backdropFilter: "blur(8px)",
              }}
            >
              <span
                style={{
                  width: "7px",
                  height: "7px",
                  borderRadius: "50%",
                  background: "#4ade80",
                  boxShadow: "0 0 8px #4ade80",
                }}
              />
              PCI-DSS • ISO 8583 • CORE BANKING
            </span>
          </div>

          {/* En-tête inférieur gauche : Signature experte en Glassmorphism */}
          <div className="visual-content-bottom">
            <div
              style={{
                padding: "1rem 1.35rem",
                borderRadius: "16px",
                background: "rgba(8, 14, 26, 0.85)",
                backdropFilter: "blur(16px)",
                border: "1px solid rgba(255, 255, 255, 0.12)",
                boxShadow: "0 16px 36px -8px rgba(0, 0, 0, 0.65)",
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.5rem" }}>
                <span
                  style={{
                    fontSize: "0.7rem",
                    fontWeight: 800,
                    color: "#4ade80",
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                  }}
                >
                  Supervision &amp; Ingénierie de Production
                </span>
                <span
                  style={{
                    fontSize: "0.72rem",
                    color: "#fde68a",
                    fontWeight: 800,
                    background: "rgba(251, 191, 36, 0.14)",
                    padding: "0.15rem 0.5rem",
                    borderRadius: "6px",
                    border: "1px solid rgba(251, 191, 36, 0.3)",
                  }}
                >
                  Expert IT Banking
                </span>
              </div>

              <div style={{ fontSize: "0.9rem", fontWeight: 800, color: "#ffffff", lineHeight: 1.35 }}>
                Architecture Monétique &amp; Systèmes Bancaires Core
              </div>

              <p style={{ fontSize: "0.8rem", color: "#cbd5e1", margin: 0, lineHeight: 1.45 }}>
                GAB / TPE • Switch ISO 8583 • HSM PayShield • CBS Sopra Amplitude &amp; Oracle FLEXCUBE.
              </p>

              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginTop: "0.2rem", paddingTop: "0.5rem", borderTop: "1px solid rgba(255, 255, 255, 0.08)" }}>
                <div
                  style={{
                    width: "26px",
                    height: "26px",
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #00a800 0%, #15803d 100%)",
                    display: "grid",
                    placeItems: "center",
                    fontWeight: 900,
                    fontSize: "0.7rem",
                    color: "#ffffff",
                  }}
                >
                  MO
                </div>
                <div style={{ fontSize: "0.78rem", color: "#f8fafc", fontWeight: 700 }}>
                  Conception &amp; Référentiel par <strong style={{ color: "#ffffff" }}>Mohamed Oury Diallo</strong>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =================================================================== */}
        {/* 2. COLONNE DROITE : FORMULAIRE DE CONNEXION (SANS SCROLL)           */}
        {/* =================================================================== */}
        <section className="login-form-pane" aria-label="Formulaire d'authentification">
          <div className="login-card-inner">
            {/* Header Formulaire */}
            <div style={{ marginBottom: "1.25rem" }}>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.4rem",
                  padding: "0.25rem 0.65rem",
                  borderRadius: "8px",
                  background: "rgba(0, 168, 0, 0.12)",
                  border: "1px solid rgba(74, 222, 128, 0.3)",
                  marginBottom: "0.65rem",
                }}
              >
                <span style={{ fontSize: "0.72rem" }}>🔒</span>
                <span
                  style={{
                    fontSize: "0.7rem",
                    fontWeight: 800,
                    color: "#4ade80",
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                  }}
                >
                  AUTHENTIFICATION RBAC SÉCURISÉE
                </span>
              </div>

              <h1
                style={{
                  fontSize: "1.6rem",
                  fontWeight: 900,
                  color: "#ffffff",
                  letterSpacing: "-0.02em",
                  margin: "0 0 0.35rem 0",
                  lineHeight: 1.2,
                }}
              >
                Connexion à votre espace
              </h1>

              <p style={{ fontSize: "0.85rem", color: "#94a3b8", margin: 0, lineHeight: 1.4 }}>
                Identifiez-vous pour accéder aux modules de supervision (Monétique, Amplitude, FLEXCUBE).
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
