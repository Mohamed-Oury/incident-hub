"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { SessionUser, ROLE_LABELS, UserRole } from "@/modules/auth/types";

interface AppShellProps {
  children: React.ReactNode;
  user?: SessionUser | null;
  pageTitle?: string;
  eyebrow?: string;
}

export function AppShell({ children, user: initialUser, pageTitle = "Vue d'ensemble", eyebrow = "EXPLOITATION MONÉTIQUE" }: AppShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [currentUser, setCurrentUser] = useState<SessionUser | null>(initialUser || null);

  // Si le composant parent (ex: Page Client) n'a pas passé user, on le récupère automatiquement via la session
  useEffect(() => {
    if (!currentUser) {
      fetch("/api/auth/me")
        .then((res) => res.ok ? res.json() : { user: null })
        .then((data) => {
          if (data.user) {
            setCurrentUser(data.user);
          }
        })
        .catch(() => { });
    }
  }, [currentUser]);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  };

  const userRole: UserRole = currentUser?.role || initialUser?.role || "ADMIN";

  const isCbsUniverse = pathname.startsWith("/cbs");
  const isFlexcubeUniverse = pathname.startsWith("/cbs/flexcube");
  const isAmplitudeUniverse = isCbsUniverse && !isFlexcubeUniverse;

  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    exploitation: true,
    decoders: true,
    referentials: true,
    advanced: true,
    cbs_core: true,
    cbs_ops: true,
    cbs_academy: true,
  });

  const toggleGroup = (groupKey: string) => {
    setOpenGroups((prev) => ({ ...prev, [groupKey]: !prev[groupKey] }));
  };

  // Sections Monétique
  const monetiqueNavSections = [
    {
      key: "exploitation",
      title: "EXPLOITATION",
      icon: "⚡",
      roleRequired: "ROLE_EXPLOITATION",
      items: [
        { href: "/hub", label: "Vue d'ensemble", icon: "⊞" },
        { href: "/knowledge", label: "Base de connaissance", icon: "📚" },
        { href: "/diagnostic", label: "Diagnostic Assistant", icon: "⚡" },
        { href: "/training-monetique/antiseche", label: "Antisèche Monétique", icon: "🧠" },
        { href: "/mti", label: "Référentiel MTI", icon: "📬" },
        { href: "/de39", label: "Référentiel DE39", icon: "🏷️" },
        { href: "/run-supervision", label: "Supervision & Runbook", icon: "🖥️" },

      ],
    },
    {
      key: "decoders",
      title: "DÉCODEURS",
      icon: "🧮",
      roleRequired: "ROLE_DECODEURS",
      items: [
        { href: "/parser", label: "Parseur Trame ISO", icon: "🔍" },
        { href: "/bitmap", label: "Décodeur Bitmap", icon: "🧮" },
        { href: "/emv", label: "Décodeur EMV / DE55", icon: "💳" },
        { href: "/atm-ej", label: "Journal GAB (ATM EJ)", icon: "🖨️" },
      ],
    },
    {
      key: "advanced",
      title: "EXPERTISE & OUTILS",
      icon: "🛠️",
      roleRequired: "ROLE_EXPERTISE",
      items: [
        { href: "/crypto-hsm", label: "Diagnostic Clés HSM", icon: "🔐" },
        //{ href: "/timeout-matrix", label: "Matrice Time-Outs", icon: "⏱️" },
        { href: "/post-mortem", label: "Générateur Rapport", icon: "📑" },
      ],
    },
    {
      key: "referentials",
      title: "FORMATION & CERTIF",
      icon: "🎓",
      roleRequired: "ROLE_REFERENTIELS",
      items: [
        { href: "/training-monetique", label: "Formation Monétique & Certif", icon: "💳" },
        //{ href: "/audit", label: "Piste d'audit", icon: "🛡️" },
      ],
    },
  ];

  // Sections CBS Amplitude & IT Banking
  const cbsNavSections = [
    {
      key: "cbs_core",
      title: "CORE BANKING",
      icon: "🏦",
      roleRequired: "ROLE_EXPLOITATION",
      items: [
        { href: "/cbs", label: "Tableau de bord CBS", icon: "⊞" },
        { href: "/cbs/copilot", label: "4GL Development Copilot", icon: "🤖" },
        { href: "/cbs/memo-conception", label: "Antisèche 4GL & .PER", icon: "🧠" },
        { href: "/cbs/per-studio", label: "Studio Créateur .per", icon: "✨" },
        { href: "/cbs/domains", label: "Domaines Métier", icon: "📑" },
        { href: "/cbs/schema", label: "Dictionnaire de Données", icon: "🔍" },
      ],
    },
    {
      key: "cbs_academy",
      title: "FORMATION & CERTIF",
      icon: "🎓",
      roleRequired: "ROLE_REFERENTIELS",
      items: [

        { href: "/cbs/training-4gl", label: "Cursus Développement 4GL", icon: "👨‍💻" },
        { href: "/cbs/per-screens", label: "Écrans .per", icon: "🖥️" },
        { href: "/cbs/academy", label: "CBS Academy", icon: "🎯" },

      ],
    },
    {
      key: "cbs_ops",
      title: "IT BANKING OPS",
      icon: "🖥️",
      roleRequired: "ROLE_EXPERTISE",
      items: [
        { href: "/cbs/log-analyzer", label: "Analyseur de Logs & Traces", icon: "📜" },
        { href: "/cbs/unix", label: "Commandes AIX/Unix", icon: "💻" },
        { href: "/cbs/incidents", label: "Incidents RCA & Run", icon: "🚨" },
      ],
    },
  ];

  // Sections Oracle FLEXCUBE
  const flexcubeNavSections = [
    {
      key: "cbs_core",
      title: "ORACLE FLEXCUBE",
      icon: "🏛️",
      roleRequired: "ROLE_EXPLOITATION",
      items: [
        { href: "/cbs/flexcube", label: "Tableau de bord FCUBS", icon: "⊞" },
        { href: "/cbs/flexcube/copilot", label: "Studio Copilot PL/SQL", icon: "⚡" },
        { href: "/cbs/flexcube/antiseche", label: "Antisèche FLEXCUBE", icon: "🧠" },
        { href: "/cbs/flexcube/knowledge", label: "Dictionnaire Tables", icon: "🔍" },
      ],
    },
    {
      key: "cbs_academy",
      title: "FORMATION & CERTIF",
      icon: "🎓",
      roleRequired: "ROLE_REFERENTIELS",
      items: [
        { href: "/cbs/flexcube/training", label: "Cursus Certifiant (5 Niveaux)", icon: "👨‍💻" },
        { href: "/cbs/flexcube/academy", label: "FLEXCUBE Academy", icon: "🎯" },
      ],
    },
    {
      key: "cbs_ops",
      title: "FCUBS RUN & BATCH",
      icon: "⚙️",
      roleRequired: "ROLE_EXPERTISE",
      items: [
        { href: "/cbs/flexcube/incidents", label: "Incidents RUN & AEOD", icon: "🚨" },
      ],
    },
  ];

  const currentNavSections = isFlexcubeUniverse
    ? flexcubeNavSections
    : isCbsUniverse
      ? cbsNavSections
      : monetiqueNavSections;

  // Filtrage strict : Seul ADMIN voit TOUT. Les autres ne voient QUE leur section respective.
  const authorizedSections = currentNavSections.filter((section) => {
    if (userRole === "ADMIN") return true;
    return section.roleRequired === userRole;
  });

  return (
    <div className="shell">
      {/* Sidebar FIXÉE & RÉDUCTIBLE */}
      <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>
        <div className="brand">
          <img
            src="/logo.png"
            alt="BANKING CBS & MONÉTIQUE HUB Logo"
            className="brand-logo-img"
            style={{
              width: "42px",
              height: "42px",
              borderRadius: "10px",
              objectFit: "cover",
              border: "1px solid #10b981",
              boxShadow: "0 0 12px rgba(16, 185, 129, 0.35)",
              background: "#0f172a",
              flexShrink: 0,
            }}
          />
          <div className="brand-text">
            BANKING
            <b>{isFlexcubeUniverse ? "ORACLE FLEXCUBE" : isCbsUniverse ? "CBS AMPLITUDE" : "MONÉTIQUE HUB"}</b>
          </div>
          <button
            type="button"
            className="btn-toggle-sidebar"
            onClick={() => setCollapsed(!collapsed)}
            title={collapsed ? "Agrandir le menu" : "Réduire le menu"}
          >
            {collapsed ? "»" : "«"}
          </button>
        </div>

        {/* Badge Univers Actif dans la Sidebar */}
        {!collapsed && (
          <div style={{ padding: "0.5rem 0.85rem 0.75rem", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                background: isFlexcubeUniverse ? "rgba(234, 88, 12, 0.12)" : isAmplitudeUniverse ? "rgba(2, 132, 199, 0.12)" : "rgba(225, 29, 72, 0.12)",
                border: `1px solid ${isFlexcubeUniverse ? "rgba(234, 88, 12, 0.3)" : isAmplitudeUniverse ? "rgba(2, 132, 199, 0.3)" : "rgba(225, 29, 72, 0.3)"}`,
                borderRadius: "8px",
                padding: "6px 10px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <span style={{ fontSize: "0.9rem" }}>
                  {isFlexcubeUniverse ? "🏛️" : isAmplitudeUniverse ? "🏦" : "💳"}
                </span>
                <span style={{ fontSize: "0.74rem", fontWeight: 700, color: isFlexcubeUniverse ? "#fb923c" : isAmplitudeUniverse ? "#38bdf8" : "#fda4af" }}>
                  {isFlexcubeUniverse ? "Oracle FLEXCUBE" : isAmplitudeUniverse ? "Sopra Amplitude" : "Monétique Hub"}
                </span>
              </div>
              <span
                style={{
                  fontSize: "0.62rem",
                  fontWeight: 800,
                  textTransform: "uppercase",
                  padding: "1px 5px",
                  borderRadius: "4px",
                  background: isFlexcubeUniverse ? "#ea580c" : isAmplitudeUniverse ? "#0284c7" : "var(--sg-red-600)",
                  color: "#ffffff",
                }}
              >
                Actif
              </span>
            </div>
          </div>
        )}

        <nav className="nav-menu" aria-label="Navigation principale">
          {authorizedSections.map((section) => {
            const hasActiveChild = section.items.some((item) => pathname === item.href);
            const isOpen = openGroups[section.key] ?? true;

            return (
              <div key={section.key} className="nav-group">
                {!collapsed ? (
                  <button
                    type="button"
                    onClick={() => toggleGroup(section.key)}
                    className={`nav-group-header ${hasActiveChild ? "active-group" : ""}`}
                  >
                    <span style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <span style={{ fontSize: "0.9rem" }}>{section.icon}</span>
                      <span style={{ fontSize: "0.72rem", letterSpacing: "0.08em", fontWeight: 700, color: "#94a3b8" }}>
                        {section.title}
                      </span>
                    </span>
                    <span className={`nav-chevron ${isOpen ? "expanded" : ""}`}>▶</span>
                  </button>
                ) : null}

                {(isOpen || collapsed) && (
                  <div className={!collapsed ? "nav-submenu" : ""}>
                    {section.items.map((item) => {
                      const isActive = pathname === item.href;
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          className={`nav-item ${isActive ? "active" : ""}`}
                          title={collapsed ? `${section.title} - ${item.label}` : undefined}
                        >
                          <span className="nav-icon">{item.icon}</span>
                          <span className="nav-label">{item.label}</span>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        <div className="sidebar-footer" style={{ flexDirection: "column", alignItems: "flex-start", gap: "0.6rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
            <span style={{ fontSize: "1.1rem" }}>🛡️</span>
            <div>
              Environnement sécurisé
              <br />
              <b>Données sensibles masquées</b>
            </div>
          </div>
        </div>
      </aside>

      {/* Contenu avec marge dynamique */}
      <div className={`content ${collapsed ? "collapsed-margin" : ""}`}>
        <header className="topbar" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem", flexWrap: "nowrap" }}>
          <div style={{ minWidth: 0, flex: "1 1 auto" }}>
            <p className="eyebrow" style={{ margin: "0 0 2px 0", fontSize: "0.72rem", letterSpacing: "0.06em", fontWeight: 700, color: "var(--text-muted)" }}>{eyebrow}</p>
            <h1 className="page-title" style={{ margin: 0, fontSize: "1.35rem", fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.02em" }}>{pageTitle}</h1>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "0.65rem", flexShrink: 0 }}>
            {/* Bouton retour vers Portfolio discret & moderne */}
            <Link
              href="/"
              title="Retour au Portfolio"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.35rem",
                background: "rgba(15, 23, 42, 0.05)",
                border: "1px solid var(--border-light)",
                color: "var(--text-secondary)",
                padding: "0.4rem 0.8rem",
                borderRadius: "8px",
                fontSize: "0.78rem",
                fontWeight: 600,
                textDecoration: "none",
                transition: "all 0.15s ease",
              }}
            >
              <span>←</span> Portfolio
            </Link>

            {/* Switcher 3 Univers avec pillules fluides */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                background: "rgba(15, 23, 42, 0.04)",
                border: "1px solid var(--border-light)",
                borderRadius: "10px",
                padding: "3px",
                gap: "2px",
              }}
            >
              <Link
                href="/hub"
                title="Espace Monétique & Cartes"
                style={{
                  fontSize: "0.75rem",
                  fontWeight: !isCbsUniverse ? 700 : 500,
                  color: !isCbsUniverse ? "#ffffff" : "var(--text-muted)",
                  background: !isCbsUniverse ? "var(--sg-red-600)" : "transparent",
                  padding: "4px 10px",
                  borderRadius: "7px",
                  textDecoration: "none",
                  transition: "all 0.15s ease",
                  boxShadow: !isCbsUniverse ? "0 1px 3px rgba(125, 21, 56, 0.3)" : "none",
                }}
              >
                💳 Monétique
              </Link>
              <Link
                href="/cbs"
                title="Espace Sopra Amplitude 4GL"
                style={{
                  fontSize: "0.75rem",
                  fontWeight: isAmplitudeUniverse ? 700 : 500,
                  color: isAmplitudeUniverse ? "#ffffff" : "var(--text-muted)",
                  background: isAmplitudeUniverse ? "#0284c7" : "transparent",
                  padding: "4px 10px",
                  borderRadius: "7px",
                  textDecoration: "none",
                  transition: "all 0.15s ease",
                  boxShadow: isAmplitudeUniverse ? "0 1px 3px rgba(2, 132, 199, 0.3)" : "none",
                }}
              >
                🏦 Amplitude
              </Link>
              <Link
                href="/cbs/flexcube"
                title="Espace Oracle FLEXCUBE"
                style={{
                  fontSize: "0.75rem",
                  fontWeight: isFlexcubeUniverse ? 700 : 500,
                  color: isFlexcubeUniverse ? "#ffffff" : "var(--text-muted)",
                  background: isFlexcubeUniverse ? "#ea580c" : "transparent",
                  padding: "4px 10px",
                  borderRadius: "7px",
                  textDecoration: "none",
                  transition: "all 0.15s ease",
                  boxShadow: isFlexcubeUniverse ? "0 1px 3px rgba(234, 88, 12, 0.3)" : "none",
                }}
              >
                🏛️ FLEXCUBE
              </Link>
            </div>

            {/* Header épuré : rôle et déconnexion */}
            <div className="user-badge" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <div
                className="user-avatar"
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
                  color: "#38bdf8",
                  fontSize: "0.75rem",
                  fontWeight: 800,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "1px solid rgba(56, 189, 248, 0.3)",
                }}
              >
                {currentUser?.name ? currentUser.name.slice(0, 2).toUpperCase() : initialUser?.name ? initialUser.name.slice(0, 2).toUpperCase() : "AD"}
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="btn-logout"
                title="Se déconnecter"
                style={{
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  color: "#ef4444",
                  background: "rgba(239, 68, 68, 0.08)",
                  border: "1px solid rgba(239, 68, 68, 0.2)",
                  padding: "4px 8px",
                  borderRadius: "6px",
                  cursor: "pointer",
                }}
              >
                Déconnexion
              </button>
            </div>
          </div>
        </header>

        <main className="view-container">
          {children}

          {/* Signature & Copyright global */}
          <footer
            style={{
              marginTop: "auto",
              paddingTop: "2.5rem",
              paddingBottom: "1.5rem",
              borderTop: "1px solid var(--border-light)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "1rem",
              fontSize: "0.82rem",
              color: "var(--text-muted)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
              <img
                src="/logo.png"
                alt="BANKING CBS & MONÉTIQUE HUB Logo"
                style={{ width: "24px", height: "24px", borderRadius: "6px", border: "1px solid #10b981", background: "#0f172a" }}
              />
              <span>
                Plateforme globale d&apos;ingénierie &amp; exploitation Banking Core (Sopra Amplitude 4GL &amp; Oracle FLEXCUBE PL/SQL) et Monétique (ISO 8583, EMV, GAB, HSM)
              </span>
            </div>
            <div style={{ textAlign: "right" }}>
              © {new Date().getFullYear()} <strong style={{ color: "var(--text-primary)" }}>M.Oury</strong> —{" "}
              <span style={{ color: "var(--sg-red-600)", fontWeight: 600 }}>
                Ingénieur IT BANKING &amp; Expert Monétique - CBS
              </span>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}
