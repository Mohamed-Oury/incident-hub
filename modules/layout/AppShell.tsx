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
        { href: "/cbs/flexcube/academy", label: "FLEXCUBE Academy (75 QCM)", icon: "🎯" },
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

        {/* Universe Switcher Widget in Sidebar */}
        {!collapsed && (
          <div style={{ padding: "0.6rem 0.85rem", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "3px",
                background: "rgba(0,0,0,0.4)",
                padding: "3px",
                borderRadius: "8px",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <Link
                href="/hub"
                title="Espace Monétique & Cartes"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0.68rem",
                  fontWeight: !isCbsUniverse ? 700 : 500,
                  padding: "6px 2px",
                  borderRadius: "6px",
                  textDecoration: "none",
                  color: !isCbsUniverse ? "#ffffff" : "#94a3b8",
                  background: !isCbsUniverse ? "var(--sg-red-600, #e60028)" : "transparent",
                  transition: "all 0.2s",
                }}
              >
                💳 Monét.
              </Link>
              <Link
                href="/cbs"
                title="Sopra Amplitude (4GL & .per)"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0.68rem",
                  fontWeight: isAmplitudeUniverse ? 700 : 500,
                  padding: "6px 2px",
                  borderRadius: "6px",
                  textDecoration: "none",
                  color: isAmplitudeUniverse ? "#ffffff" : "#94a3b8",
                  background: isAmplitudeUniverse ? "#0284c7" : "transparent",
                  transition: "all 0.2s",
                }}
              >
                🏦 Amplit.
              </Link>
              <Link
                href="/cbs/flexcube"
                title="Oracle FLEXCUBE (PL/SQL & AEOD)"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0.68rem",
                  fontWeight: isFlexcubeUniverse ? 700 : 500,
                  padding: "6px 2px",
                  borderRadius: "6px",
                  textDecoration: "none",
                  color: isFlexcubeUniverse ? "#ffffff" : "#94a3b8",
                  background: isFlexcubeUniverse ? "#ea580c" : "transparent",
                  transition: "all 0.2s",
                }}
              >
                🏛️ FLEXC.
              </Link>
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
        <header className="topbar">
          <div>
            <p className="eyebrow">{eyebrow}</p>
            <h1 className="page-title">{pageTitle}</h1>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <Link
              href="/"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.4rem",
                background: "linear-gradient(135deg, #7d1538 0%, #a01e4a 100%)",
                color: "#ffffff",
                padding: "0.45rem 0.95rem",
                borderRadius: "10px",
                fontSize: "0.82rem",
                fontWeight: 700,
                textDecoration: "none",
                boxShadow: "0 2px 8px rgba(125, 21, 56, 0.3)",
                transition: "all 0.15s ease",
              }}
            >
              ← Portfolio Mr. Oury
            </Link>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                background: "rgba(0,0,0,0.35)",
                border: "1px solid var(--border-light)",
                borderRadius: "20px",
                padding: "2px 4px",
                gap: "2px",
              }}
            >
              <Link
                href="/hub"
                title="Monétique Hub"
                style={{
                  fontSize: "0.75rem",
                  fontWeight: !isCbsUniverse ? 700 : 500,
                  color: !isCbsUniverse ? "#ffffff" : "var(--text-muted)",
                  background: !isCbsUniverse ? "var(--sg-red-600)" : "transparent",
                  padding: "4px 10px",
                  borderRadius: "16px",
                  textDecoration: "none",
                  transition: "all 0.15s ease",
                }}
              >
                💳 Monétique
              </Link>
              <Link
                href="/cbs"
                title="Sopra Amplitude"
                style={{
                  fontSize: "0.75rem",
                  fontWeight: isAmplitudeUniverse ? 700 : 500,
                  color: isAmplitudeUniverse ? "#ffffff" : "var(--text-muted)",
                  background: isAmplitudeUniverse ? "#0284c7" : "transparent",
                  padding: "4px 10px",
                  borderRadius: "16px",
                  textDecoration: "none",
                  transition: "all 0.15s ease",
                }}
              >
                🏦 Amplitude
              </Link>
              <Link
                href="/cbs/flexcube"
                title="Oracle FLEXCUBE"
                style={{
                  fontSize: "0.75rem",
                  fontWeight: isFlexcubeUniverse ? 700 : 500,
                  color: isFlexcubeUniverse ? "#ffffff" : "var(--text-muted)",
                  background: isFlexcubeUniverse ? "#ea580c" : "transparent",
                  padding: "4px 10px",
                  borderRadius: "16px",
                  textDecoration: "none",
                  transition: "all 0.15s ease",
                }}
              >
                🏛️ FLEXCUBE
              </Link>
            </div>

            {/* Header épuré : rôle et déconnexion */}
            <div className="user-badge">
              <div className="user-avatar">
                {currentUser?.name ? currentUser.name.slice(0, 2).toUpperCase() : initialUser?.name ? initialUser.name.slice(0, 2).toUpperCase() : "AD"}
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="btn-logout"
                title="Se déconnecter"
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
