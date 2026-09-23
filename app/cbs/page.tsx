import Link from "next/link";
import { AppShell } from "@/modules/layout/AppShell";
import {
  CBS_DOMAINS,
  CBS_EOD_STEPS,
  CBS_DB_ERRORS,
  CBS_UNIX_COMMANDS,
  CBS_INCIDENTS,
  CBS_QUIZ,
  CBS_RANKS,
} from "@/modules/cbs/cbs-data";

export default function CbsDashboardPage() {
  const userXp = 480;
  const currentRank = CBS_RANKS[3]; // "Administrateur Core Junior"
  const nextRank = CBS_RANKS[4];
  const xpNeeded = nextRank.minXp - currentRank.minXp;
  const currentProgress = userXp - currentRank.minXp;
  const progressPercent = Math.min(100, Math.max(0, Math.round((currentProgress / xpNeeded) * 100)));

  const p1IncidentsCount = CBS_INCIDENTS.filter((i) => i.severity === "P1").length;
  const p2IncidentsCount = CBS_INCIDENTS.filter((i) => i.severity === "P2").length;

  const quickModules = [
    {
      title: "CBS 4GL Development Copilot",
      count: "Studio Dédié & SGBD",
      desc: "Transformation d'un besoin en plan 4GL, masque .per, requêtes SQL et tests unitaires",
      href: "/cbs/copilot",
      icon: "🤖",
      badge: "Nouveau • Studio",
      badgeColor: "#8b5cf6",
    },
    {
      title: "8 Domaines Métier",
      count: `${CBS_DOMAINS.length} domaines`,
      desc: "Comptabilité, Soldes, Virements, Crédits, Épargne, Monétique CBS",
      href: "/cbs/domains",
      icon: "📑",
      badge: "Architecture",
      badgeColor: "#0284c7",
    },
    {
      title: "Run & Batch EOD / BOD",
      count: `${CBS_EOD_STEPS.length} étapes + Simu`,
      desc: "Chaîne batch quotidienne de J à J+1, blocage 73% (ORA-00054), rollback",
      href: "/cbs/batch",
      icon: "⚙️",
      badge: "Critique Run",
      badgeColor: "#dc2626",
    },
    {
      title: "Oracle & Informix SGBD",
      count: `${CBS_DB_ERRORS.length} erreurs & scripts`,
      desc: "Dictionnaire ORA-00054, ORA-01555, ORA-01653, verrous v$locked_object",
      href: "/cbs/databases",
      icon: "🗄️",
      badge: "Base de Données",
      badgeColor: "#d97706",
    },
    {
      title: "120 Commandes AIX/Unix",
      count: `${CBS_UNIX_COMMANDS.length} outils CLI`,
      desc: "errpt, lsvg, nmon, kill -9, crontab, chfs, netstat, ipcrm, grep batch",
      href: "/cbs/unix",
      icon: "💻",
      badge: "Système & OS",
      badgeColor: "#059669",
    },
    {
      title: "200 Incidents & RCA",
      count: `${CBS_INCIDENTS.length} cas résolus`,
      desc: "Base de connaissances de production : diagnostic, commande, fix & prévention",
      href: "/cbs/incidents",
      icon: "🚨",
      badge: `${p1IncidentsCount} P1 Critiques`,
      badgeColor: "#e60028",
    },
    {
      title: "CBS Academy & Certif",
      count: `${CBS_QUIZ.length} questions QCM`,
      desc: "Entraînement interactif QCM, scoring en direct, gain d'XP et rangs",
      href: "/cbs/academy",
      icon: "🎯",
      badge: "Certification",
      badgeColor: "#7c3aed",
    },
  ];

  return (
    <AppShell pageTitle="Core Banking Amplitude & IT Banking" eyebrow="UNIVERS PRODUCTION BANCAIRE">
      <div style={{ display: "flex", flexDirection: "column", gap: "1.75rem" }}>
        
        {/* Bannière Hero CBS */}
        <div
          style={{
            background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0c4a6e 100%)",
            borderRadius: "var(--radius-lg)",
            padding: "1.75rem 2rem",
            color: "#ffffff",
            border: "1px solid rgba(255,255,255,0.1)",
            boxShadow: "var(--shadow-md)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "1.5rem",
          }}
        >
          <div style={{ maxWidth: "680px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.5rem" }}>
              <span
                style={{
                  background: "#0284c7",
                  color: "#ffffff",
                  fontSize: "0.72rem",
                  fontWeight: 700,
                  padding: "3px 8px",
                  borderRadius: "6px",
                  letterSpacing: "0.05em",
                }}
              >
                CORE BANKING SYSTEM
              </span>
              <span style={{ color: "#94a3b8", fontSize: "0.82rem" }}>Amplitude v11 / v12 • AIX / Linux • Oracle</span>
            </div>
            <h2 style={{ fontSize: "1.5rem", fontWeight: 800, margin: "0 0 0.5rem 0", color: "#f8fafc" }}>
              Portail d&apos;Exploitation &amp; Ingénierie CBS
            </h2>
            <p style={{ fontSize: "0.9rem", color: "#cbd5e1", lineHeight: "1.5", margin: 0 }}>
              Pilotage des arrêtés journaliers (EOD/BOD), résolution des incidents RUN/BUILD, référentiel de tables Amplitude (BK*), requêtes d&apos;urgence SGBD et préparation à l&apos;accréditation CBS.
            </p>
          </div>

          {/* Gamification Card : Rang actuel */}
          <div
            style={{
              background: "rgba(15, 23, 42, 0.75)",
              border: "1px solid rgba(255, 255, 255, 0.15)",
              borderRadius: "var(--radius-md)",
              padding: "1.25rem 1.5rem",
              minWidth: "260px",
              backdropFilter: "blur(8px)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
              <span style={{ fontSize: "0.75rem", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Progression Expert
              </span>
              <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "#38bdf8" }}>{userXp} XP</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.75rem" }}>
              <span style={{ fontSize: "1.6rem" }}>🏅</span>
              <div>
                <div style={{ fontWeight: 700, fontSize: "0.95rem", color: "#f1f5f9" }}>{currentRank.name}</div>
                <div style={{ fontSize: "0.75rem", color: "#94a3b8" }}>Niveau {currentRank.level} / 10</div>
              </div>
            </div>
            {/* Progress bar */}
            <div style={{ background: "rgba(255,255,255,0.1)", borderRadius: "6px", height: "8px", overflow: "hidden" }}>
              <div
                style={{
                  background: "linear-gradient(90deg, #0284c7, #38bdf8)",
                  width: `${progressPercent}%`,
                  height: "100%",
                  borderRadius: "6px",
                }}
              />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.7rem", color: "#64748b", marginTop: "4px" }}>
              <span>Prochain : {nextRank.name}</span>
              <span>{progressPercent}%</span>
            </div>
          </div>
        </div>

        {/* Chiffres clés / Métriques */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
          <div className="card" style={{ padding: "1.25rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600 }}>INCIDENTS RÉFÉRENCÉS</div>
                <div style={{ fontSize: "1.8rem", fontWeight: 800, color: "var(--text-primary)", marginTop: "4px" }}>
                  {CBS_INCIDENTS.length}
                </div>
              </div>
              <span style={{ fontSize: "1.5rem" }}>🚨</span>
            </div>
            <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginTop: "0.5rem" }}>
              <strong style={{ color: "#e60028" }}>{p1IncidentsCount} P1 Bloquants</strong> • {p2IncidentsCount} P2 Majeurs
            </div>
          </div>

          <div className="card" style={{ padding: "1.25rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600 }}>COMMANDES AIX / UNIX</div>
                <div style={{ fontSize: "1.8rem", fontWeight: 800, color: "var(--text-primary)", marginTop: "4px" }}>
                  {CBS_UNIX_COMMANDS.length}
                </div>
              </div>
              <span style={{ fontSize: "1.5rem" }}>💻</span>
            </div>
            <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginTop: "0.5rem" }}>
              Diagnostic système, LVM, disques, mémoire
            </div>
          </div>

          <div className="card" style={{ padding: "1.25rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600 }}>QUESTIONS CBS ACADEMY</div>
                <div style={{ fontSize: "1.8rem", fontWeight: 800, color: "var(--text-primary)", marginTop: "4px" }}>
                  {CBS_QUIZ.length}
                </div>
              </div>
              <span style={{ fontSize: "1.5rem" }}>🎯</span>
            </div>
            <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginTop: "0.5rem" }}>
              8 catégories d&apos;évaluation technique &amp; métier
            </div>
          </div>

          <div className="card" style={{ padding: "1.25rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600 }}>CHAÎNE BATCH EOD</div>
                <div style={{ fontSize: "1.8rem", fontWeight: 800, color: "#0284c7", marginTop: "4px" }}>
                  {CBS_EOD_STEPS.length} étapes
                </div>
              </div>
              <span style={{ fontSize: "1.5rem" }}>⚙️</span>
            </div>
            <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginTop: "0.5rem" }}>
              De la clôture agence au basculement J+1
            </div>
          </div>
        </div>

        {/* Bannière Vedette Espace Dédié : CBS 4GL Development Copilot */}
        <div
          style={{
            background: "linear-gradient(135deg, #1e1b4b 0%, #0f172a 60%, #1e293b 100%)",
            border: "1px solid #4338ca",
            borderRadius: "var(--radius-lg)",
            padding: "1.5rem 1.75rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "1.25rem",
            boxShadow: "0 8px 24px rgba(67, 56, 202, 0.2)",
          }}
        >
          <div style={{ maxWidth: "720px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.35rem" }}>
              <span
                style={{
                  backgroundColor: "#4f46e5",
                  color: "#ffffff",
                  fontSize: "0.72rem",
                  fontWeight: 800,
                  padding: "2px 8px",
                  borderRadius: "6px",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                ESPACE DE TRAVAIL DÉDIÉ
              </span>
              <span style={{ color: "#a5b4fc", fontSize: "0.8rem", fontWeight: 600 }}>
                ⚡ Studio Plein Écran sans Sidebar ni Header
              </span>
            </div>
            <h3 style={{ fontSize: "1.3rem", fontWeight: 800, color: "#ffffff", margin: "0 0 0.4rem 0" }}>
              CBS 4GL Development Copilot
            </h3>
            <p style={{ fontSize: "0.88rem", color: "#cbd5e1", margin: 0, lineHeight: "1.5" }}>
              Passez d&apos;un besoin fonctionnel bancaire à un plan technique 4GL structuré : sous-tâches, code Informix 4GL connecté aux tables <code>BKCPT</code> et <code>BKCLI</code>, masque d&apos;écran <code>.per</code>, requêtes SQL indexées, diagnostic de point de rupture et persistance base de données.
            </p>
          </div>

          <Link
            href="/cbs/copilot"
            style={{
              backgroundColor: "#4f46e5",
              color: "#ffffff",
              textDecoration: "none",
              padding: "0.75rem 1.35rem",
              borderRadius: "8px",
              fontWeight: 700,
              fontSize: "0.92rem",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              boxShadow: "0 4px 12px rgba(79, 70, 229, 0.4)",
              transition: "transform 0.15s ease",
            }}
          >
            <span>🚀 Ouvrir le Studio 4GL</span>
            <span>→</span>
          </Link>
        </div>

        {/* Grille des Modules Opérationnels */}
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
            <h3 style={{ fontSize: "1.15rem", fontWeight: 700, color: "var(--text-primary)" }}>
              Modules Spécialisés Amplitude
            </h3>
            <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
              Accès direct aux procédures d&apos;exploitation et bases de diagnostic
            </span>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "1.25rem" }}>
            {quickModules.map((m) => (
              <Link
                key={m.href}
                href={m.href}
                className="card"
                style={{
                  padding: "1.5rem",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  transition: "transform 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease",
                  border: "1px solid var(--border-light)",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.75rem" }}>
                    <span style={{ fontSize: "2rem" }}>{m.icon}</span>
                    <span
                      style={{
                        background: `${m.badgeColor}15`,
                        color: m.badgeColor,
                        border: `1px solid ${m.badgeColor}40`,
                        fontSize: "0.72rem",
                        fontWeight: 700,
                        padding: "2px 8px",
                        borderRadius: "12px",
                      }}
                    >
                      {m.badge}
                    </span>
                  </div>
                  <h4 style={{ fontSize: "1.05rem", fontWeight: 700, margin: "0 0 0.35rem 0", color: "var(--text-primary)" }}>
                    {m.title}
                  </h4>
                  <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: "1.45", margin: 0 }}>
                    {m.desc}
                  </p>
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginTop: "1.25rem",
                    paddingTop: "0.75rem",
                    borderTop: "1px solid var(--border-light)",
                    fontSize: "0.8rem",
                    color: "var(--text-muted)",
                  }}
                >
                  <span style={{ fontWeight: 600 }}>{m.count}</span>
                  <span style={{ color: "#0284c7", fontWeight: 700 }}>Ouvrir →</span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Schéma d'Architecture & Flux Bancaires */}
        <div className="card" style={{ padding: "1.5rem" }}>
          <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "0.5rem" }}>
            Architecture Simplifiée d&apos;Intégration Amplitude &amp; Monétique
          </h3>
          <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "1.25rem" }}>
            Visualisation des liaisons entre les serveurs frontaux monétiques et le Core Banking System bancaire.
          </p>

          <div
            style={{
              background: "#0f172a",
              color: "#e2e8f0",
              padding: "1.5rem",
              borderRadius: "var(--radius-md)",
              fontFamily: "monospace",
              fontSize: "0.82rem",
              lineHeight: "1.6",
              overflowX: "auto",
            }}
          >
            <div style={{ color: "#38bdf8", fontWeight: 700, marginBottom: "0.5rem" }}>
              [CANAUX / DAB / TPE] ───&gt; [SWITCH MONÉTIQUE (ISO 8583)]
            </div>
            <div style={{ paddingLeft: "40px", color: "#94a3b8" }}>
              │ (Autorisations en ligne 24/7, contrôle PIN HSM, Stand-in)
            </div>
            <div style={{ paddingLeft: "40px", color: "#f59e0b", fontWeight: 700 }}>
              ▼ Interface Fichiers / API Temps Réel
            </div>
            <div style={{ color: "#10b981", fontWeight: 700, margin: "0.5rem 0" }}>
              [SERVEUR FRONT-OFFICE / WEBSERVICES AMPLITUDE]
            </div>
            <div style={{ paddingLeft: "40px", color: "#94a3b8" }}>
              │ Contrôle solde instantané &amp; blocage de provision (BKCOM / BKSOL)
            </div>
            <div style={{ paddingLeft: "40px", color: "#ef4444", fontWeight: 700 }}>
              ▼ Clôture Journalière (Batch de Compensation)
            </div>
            <div style={{ color: "#e60028", fontWeight: 700 }}>
              [CORE BANKING AMPLITUDE BATCH EOD] ───&gt; [SGBD ORACLE / INFORMIX]
            </div>
            <div style={{ paddingLeft: "40px", color: "#cbd5e1" }}>
              • Écriture comptable définitive dans BKEVE / BKCOM<br />
              • Calcul des agios, commissions de change et frais interbancaires<br />
              • Basculement date comptable système (J → J+1)
            </div>
          </div>
        </div>

      </div>
    </AppShell>
  );
}
