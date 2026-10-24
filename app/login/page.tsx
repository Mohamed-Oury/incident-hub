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
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background:
          "radial-gradient(circle at 20% 20%, rgba(16, 185, 129, 0.14) 0%, transparent 45%), radial-gradient(circle at 85% 80%, rgba(125, 21, 56, 0.28) 0%, transparent 50%), #070d19",
        padding: "1.5rem",
        fontFamily:
          "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        color: "#f8fafc",
      }}
    >
      <style>{`
        .login-split-shell {
          width: 100%;
          max-width: 1220px;
          min-height: 680px;
          display: grid;
          grid-template-columns: 1.25fr 0.95fr;
          background: rgba(15, 23, 42, 0.82);
          backdrop-filter: blur(20px);
          border-radius: 28px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0 30px 70px -15px rgba(0, 0, 0, 0.65);
          overflow: hidden;
        }
        .login-input:focus {
          border-color: #10b981 !important;
          box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.18) !important;
        }
        @media (max-width: 960px) {
          .login-split-shell {
            grid-template-columns: 1fr;
            max-width: 540px;
          }
        }
      `}</style>

      <div className="login-split-shell">
        {/* ================================================================ */}
        {/* COLONNE GAUCHE : VISUEL REPRÉSENTATIF DE LA PLATEFORME           */}
        {/* ================================================================ */}
        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "2.25rem",
            background:
              "linear-gradient(160deg, #0b1324 0%, #0f172a 60%, #17152b 100%)",
            borderRight: "1px solid rgba(255, 255, 255, 0.08)",
            overflow: "hidden",
          }}
        >
          {/* En-tête de la colonne gauche */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "0.75rem",
              flexWrap: "wrap",
              zIndex: 2,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <div
                style={{
                  width: "42px",
                  height: "42px",
                  borderRadius: "12px",
                  background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                  display: "grid",
                  placeItems: "center",
                  fontWeight: 900,
                  fontSize: "1.1rem",
                  color: "#ffffff",
                  boxShadow: "0 4px 14px rgba(16, 185, 129, 0.35)",
                }}
              >
                ⚡
              </div>
              <div>
                <div
                  style={{
                    fontSize: "0.72rem",
                    fontWeight: 800,
                    letterSpacing: "0.1em",
                    color: "#34d399",
                    textTransform: "uppercase",
                  }}
                >
                  BANKING COMMAND CENTER
                </div>
                <div
                  style={{
                    fontSize: "1.05rem",
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
                gap: "0.45rem",
                padding: "0.35rem 0.8rem",
                borderRadius: "999px",
                background: "rgba(16, 185, 129, 0.14)",
                border: "1px solid rgba(16, 185, 129, 0.35)",
                color: "#6ee7b7",
                fontSize: "0.74rem",
                fontWeight: 700,
              }}
            >
              <span
                style={{
                  width: "7px",
                  height: "7px",
                  borderRadius: "50%",
                  background: "#10b981",
                  boxShadow: "0 0 8px #10b981",
                }}
              />
              PCI-DSS • ISO 8583 • CBS
            </span>
          </div>

          {/* Cadre central : Image générée de l'architecture Monétique & CBS avec signature */}
          <div
            style={{
              margin: "1.25rem 0",
              borderRadius: "18px",
              overflow: "hidden",
              border: "1px solid rgba(255, 255, 255, 0.16)",
              boxShadow: "0 20px 45px -10px rgba(0, 0, 0, 0.65)",
              position: "relative",
              background: "#131c27",
              zIndex: 2,
            }}
          >
            <img
              src="/login-hero.jpg?v=signed"
              alt="Architecture Monétique & Core Banking — by Mohamed Oury Diallo, Expert IT Banking"
              style={{
                width: "100%",
                height: "auto",
                maxHeight: "410px",
                objectFit: "contain",
                display: "block",
              }}
            />
            <div
              style={{
                padding: "0.85rem 1.2rem",
                background: "rgba(7, 13, 25, 0.92)",
                borderTop: "1px solid rgba(255, 255, 255, 0.08)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "0.75rem",
              }}
            >
              <div style={{ fontSize: "0.78rem", color: "#cbd5e1", lineHeight: 1.4 }}>
                <strong style={{ color: "#ffffff" }}>
                  Supervision de bout en bout :
                </strong>{" "}
                GAB/TPE • Switch ISO 8583 • HSM • Amplitude &amp; FLEXCUBE
              </div>

              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "0.3rem 0.75rem",
                  borderRadius: "8px",
                  background: "linear-gradient(135deg, rgba(16, 185, 129, 0.16) 0%, rgba(217, 119, 6, 0.16) 100%)",
                  border: "1px solid rgba(251, 191, 36, 0.4)",
                }}
              >
                <span style={{ fontSize: "0.74rem", color: "#fde68a", fontWeight: 800 }}>
                  Mohamed Oury Diallo
                </span>
                <span style={{ color: "rgba(255,255,255,0.3)" }}>•</span>
                <span style={{ fontSize: "0.72rem", color: "#6ee7b7", fontWeight: 700 }}>
                  Expert IT Banking (Monetique &amp; CBS)
                </span>
              </div>
            </div>
          </div>

          {/* Pied de la colonne gauche : Les 3 univers couverts */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "0.75rem",
              zIndex: 2,
            }}
          >
            <div
              style={{
                padding: "0.85rem",
                borderRadius: "14px",
                background: "rgba(30, 41, 59, 0.55)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
              }}
            >
              <div style={{ fontSize: "0.78rem", fontWeight: 800, color: "#fda4af" }}>
                💳 Monétique Hub
              </div>
              <div style={{ fontSize: "0.72rem", color: "#94a3b8", marginTop: "0.2rem", lineHeight: 1.35 }}>
                Trames ISO 8583, EMV TLV, Journaux GAB EJ, Clés HSM &amp; RCA
              </div>
            </div>

            <div
              style={{
                padding: "0.85rem",
                borderRadius: "14px",
                background: "rgba(30, 41, 59, 0.55)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
              }}
            >
              <div style={{ fontSize: "0.78rem", fontWeight: 800, color: "#fcd34d" }}>
                🏛️ CBS Amplitude
              </div>
              <div style={{ fontSize: "0.72rem", color: "#94a3b8", marginTop: "0.2rem", lineHeight: 1.35 }}>
                Informix 4GL, Studio .per Genero, Batch EOD/BOD &amp; Tables BK*
              </div>
            </div>

            <div
              style={{
                padding: "0.85rem",
                borderRadius: "14px",
                background: "rgba(30, 41, 59, 0.55)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
              }}
            >
              <div style={{ fontSize: "0.78rem", fontWeight: 800, color: "#6ee7b7" }}>
                🏦 Oracle FLEXCUBE
              </div>
              <div style={{ fontSize: "0.72rem", color: "#94a3b8", marginTop: "0.2rem", lineHeight: 1.35 }}>
                Architecture 12.x/14.x, PL/SQL, AEOD, Tables STTM/ACVW &amp; Copilot
              </div>
            </div>
          </div>
        </div>

        {/* ================================================================ */}
        {/* COLONNE DROITE : FORMULAIRE DE CONNEXION SÉCURISÉ                */}
        {/* ================================================================ */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "2.75rem 2.5rem",
            background: "rgba(15, 23, 42, 0.92)",
          }}
        >
          <div style={{ maxWidth: "400px", width: "100%", margin: "0 auto" }}>
            {/* Badge identité */}
            <div style={{ marginBottom: "2rem" }}>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.65rem",
                  marginBottom: "1rem",
                }}
              >
                <div
                  style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "14px",
                    background: "linear-gradient(135deg, #7d1538 0%, #a01e4a 100%)",
                    color: "#ffffff",
                    display: "grid",
                    placeItems: "center",
                    fontWeight: 900,
                    fontSize: "1.15rem",
                    boxShadow: "0 8px 22px rgba(125, 21, 56, 0.45)",
                  }}
                >
                  MO
                </div>
                <div>
                  <span
                    style={{
                      fontSize: "0.7rem",
                      fontWeight: 800,
                      color: "#f472b6",
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                      display: "block",
                    }}
                  >
                    AUTHENTIFICATION RBAC
                  </span>
                  <span style={{ fontSize: "0.85rem", color: "#cbd5e1", fontWeight: 700 }}>
                    Portail d&apos;Exploitation Bancaire
                  </span>
                </div>
              </div>

              <h1
                style={{
                  fontSize: "1.65rem",
                  fontWeight: 900,
                  color: "#ffffff",
                  letterSpacing: "-0.02em",
                  margin: "0 0 0.4rem 0",
                }}
              >
                Connexion à votre espace
              </h1>
              <p style={{ fontSize: "0.86rem", color: "#94a3b8", margin: 0, lineHeight: 1.5 }}>
                Saisissez vos identifiants pour accéder aux modules autorisés par votre profil (Monétique, Amplitude, FLEXCUBE).
              </p>
            </div>

            {/* Message d'erreur éventuel */}
            {error && (
              <div
                style={{
                  padding: "0.85rem 1rem",
                  background: "rgba(239, 68, 68, 0.16)",
                  color: "#fca5a5",
                  borderRadius: "12px",
                  fontSize: "0.84rem",
                  fontWeight: 600,
                  marginBottom: "1.35rem",
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

            {/* Formulaire */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleLogin();
              }}
              style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}
            >
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.8rem",
                    fontWeight: 700,
                    marginBottom: "0.45rem",
                    color: "#e2e8f0",
                  }}
                >
                  Adresse email professionnelle
                </label>
                <div style={{ position: "relative" }}>
                  <input
                    className="login-input"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nom.prenom@banque.com"
                    style={{
                      width: "100%",
                      padding: "0.85rem 1rem",
                      borderRadius: "12px",
                      background: "rgba(2, 6, 23, 0.65)",
                      border: "1px solid rgba(255, 255, 255, 0.14)",
                      color: "#ffffff",
                      fontSize: "0.92rem",
                      outline: "none",
                      transition: "all 0.15s ease",
                      boxSizing: "border-box",
                    }}
                  />
                </div>
              </div>

              <div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "0.45rem",
                  }}
                >
                  <label
                    style={{
                      fontSize: "0.8rem",
                      fontWeight: 700,
                      color: "#e2e8f0",
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
                      fontSize: "0.75rem",
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
                  style={{
                    width: "100%",
                    padding: "0.85rem 1rem",
                    borderRadius: "12px",
                    background: "rgba(2, 6, 23, 0.65)",
                    border: "1px solid rgba(255, 255, 255, 0.14)",
                    color: "#ffffff",
                    fontSize: "0.92rem",
                    outline: "none",
                    transition: "all 0.15s ease",
                    boxSizing: "border-box",
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
                  padding: "0.95rem 1.25rem",
                  borderRadius: "12px",
                  fontWeight: 800,
                  fontSize: "0.95rem",
                  border: "none",
                  cursor: loading ? "wait" : "pointer",
                  boxShadow: "0 8px 22px rgba(125, 21, 56, 0.45)",
                  marginTop: "0.4rem",
                  transition: "transform 0.15s ease, box-shadow 0.15s ease",
                }}
              >
                {loading ? "Authentification en cours..." : "Se connecter au Hub →"}
              </button>
            </form>

            {/* Encart Gouvernance & Sécurité */}
            <div
              style={{
                marginTop: "2rem",
                paddingTop: "1.35rem",
                borderTop: "1px solid rgba(255, 255, 255, 0.08)",
                display: "flex",
                flexDirection: "column",
                gap: "0.55rem",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  fontSize: "0.76rem",
                  color: "#94a3b8",
                }}
              >
                <span>🔒</span>
                <span>
                  Contrôle d&apos;accès granulaire par rôle :{" "}
                  <strong style={{ color: "#e2e8f0" }}>
                    SuperAdmin, Admin &amp; Rôles Modules
                  </strong>
                </span>
              </div>
              <div
                style={{
                  fontSize: "0.73rem",
                  color: "#64748b",
                  lineHeight: 1.4,
                }}
              >
                Les sessions sont protégées par jeton signé et journalisées conformément aux exigences de sécurité monétique.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
