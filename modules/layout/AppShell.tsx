"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { SessionUser } from "@/modules/auth/types";

interface AppShellProps {
  children: React.ReactNode;
  user?: SessionUser | null;
  pageTitle?: string;
  eyebrow?: string;
}

export function AppShell({ children, user, pageTitle = "Vue d'ensemble", eyebrow = "EXPLOITATION MONÉTIQUE" }: AppShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  };

  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    exploitation: true,
    decoders: true,
    referentials: false,
    advanced: true,
  });

  const toggleGroup = (groupKey: string) => {
    setOpenGroups((prev) => ({ ...prev, [groupKey]: !prev[groupKey] }));
  };

  const navSections = [
    {
      key: "exploitation",
      title: "EXPLOITATION",
      icon: "⚡",
      items: [
        { href: "/", label: "Vue d'ensemble", icon: "⊞" },
        { href: "/knowledge", label: "Base de connaissance", icon: "📚" },
        { href: "/diagnostic", label: "Diagnostic Assistant", icon: "⚡" },
      ],
    },
    {
      key: "decoders",
      title: "DÉCODEURS",
      icon: "🧮",
      items: [
        { href: "/parser", label: "Parseur Trame ISO", icon: "🔍" },
        { href: "/bitmap", label: "Décodeur Bitmap", icon: "🧮" },
        { href: "/emv", label: "Décodeur EMV / DE55", icon: "💳" },
        { href: "/atm-ej", label: "Journal GAB (ATM EJ)", icon: "🖨️" },
      ],
    },
    {
      key: "referentials",
      title: "RÉFÉRENTIELS",
      icon: "📖",
      items: [
        { href: "/mti", label: "Référentiel MTI", icon: "📬" },
        { href: "/de39", label: "Référentiel DE39", icon: "🏷️" },
        { href: "/audit", label: "Piste d'audit", icon: "🛡️" },
      ],
    },
    {
      key: "advanced",
      title: "EXPERTISE & OUTILS",
      icon: "🛠️",
      items: [
        { href: "/crypto-hsm", label: "Diagnostic Clés HSM", icon: "🔐" },
        { href: "/timeout-matrix", label: "Matrice Time-Outs", icon: "⏱️" },
        { href: "/post-mortem", label: "Générateur Rapport", icon: "📑" },
      ],
    },
  ];

  return (
    <div className="shell">
      {/* Sidebar FIXÉE & RÉDUCTIBLE */}
      <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>
        <div className="brand">
          <img
            src="/logo.png"
            alt="M.OURY Logo"
            className="brand-logo-img"
            style={{
              width: "42px",
              height: "42px",
              borderRadius: "50%",
              objectFit: "cover",
              border: "2px solid #e60028",
              boxShadow: "0 0 10px rgba(230, 0, 40, 0.4)",
              background: "#ffffff",
              flexShrink: 0,
            }}
          />
          <div className="brand-text">
            M.OURY
            <b>MONÉTIQUE HUB</b>
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

        <nav className="nav-menu" aria-label="Navigation principale">
          {navSections.map((section) => {
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

          <div style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
            <Link href="/incidents/new" className="btn-emerald" style={{ padding: "0.5rem 1rem", fontSize: "0.85rem" }}>
              + Déclarer incident
            </Link>

            {/* Header épuré : rôle et déconnexion */}
            <div className="user-badge">
              <div className="user-avatar">
                {user?.role ? user.role.slice(0, 2) : "AD"}
              </div>
              <div style={{ display: "flex", flexDirection: "column", fontSize: "0.82rem" }}>
                <span style={{ color: "var(--sg-red-600)", fontWeight: 700, fontSize: "0.78rem" }}>
                  {user?.role || "ADMIN"}
                </span>
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
                alt="Logo M.OURY"
                style={{ width: "24px", height: "24px", borderRadius: "50%", border: "1px solid #e60028" }}
              />
              <span>
                Plateforme d&apos;exploitation monétique avancée
              </span>
            </div>
            <div style={{ textAlign: "right" }}>
              © {new Date().getFullYear() - 1} <strong style={{ color: "var(--text-primary)" }}>M.Oury</strong> —{" "}
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
