"use client";

import { useState } from "react";
import { GuiMockupData } from "./cbs-screen-builder";

interface GeneroGuiWindowProps {
  data?: GuiMockupData;
  title?: string;
  domain?: string;
}

export function GeneroGuiWindow({ data, title = "Consultation & Opérations Guichet", domain = "Comptes & Guichet" }: GeneroGuiWindowProps) {
  const [activeTabId, setActiveTabId] = useState<string>(data?.tabs?.[0]?.id || "tab_mvt");
  const [selectedRowIndex, setSelectedRowIndex] = useState<number>(0);
  const [isMaximized, setIsMaximized] = useState<boolean>(false);

  // Valeurs par défaut si pas de données fournies
  const windowTitle = data?.windowTitle || `Banque Amplitude - ${title}`;
  const headerFields = data?.headerFields || [
    { label: "Code Agence", value: "01001", tag: "f001" },
    { label: "Date Système", value: "26/09/2026", tag: "f002" },
    { label: "N° Compte", value: "01001009845", tag: "f003" },
    { label: "Statut", value: "ACTIF / NORMAL", type: "badge", tag: "f004" }
  ];

  const leftPanel = data?.leftPanel || {
    title: "Informations Métier & Tiers",
    fields: [
      { label: "Code Tiers / Client", value: "CLI-008472", tag: "f010" },
      { label: "Raison Sociale / Nom", value: "SOCIETE COMMERCIALE SENEGALAISE SA", tag: "f011" },
      { label: "Segment Clientèle", value: "ENTREPRISES CORPORATE", tag: "f012" },
      { label: "Gestionnaire", value: "GEST_AG01 (M. M. DIOP)", tag: "f013" }
    ]
  };

  const rightPanel = data?.rightPanel || {
    title: "Synthèse Financière & Soldes",
    fields: [
      { label: "Solde Comptable", value: "28,450,000.00 XOF", highlight: true, tag: "f014" },
      { label: "Montant Bloqué / Réserve", value: "1,200,000.00 XOF", tag: "f015" },
      { label: "Disponible Immédiat", value: "27,250,000.00 XOF", highlight: true, tag: "f016" },
      { label: "Autorisation Découvert", value: "5,000,000.00 XOF", tag: "f017" }
    ]
  };

  const tabs = data?.tabs || [
    {
      id: "tab_mvt",
      label: "Derniers Mouvements Bancaires",
      type: "table",
      table: {
        columns: ["Réf Écriture", "Date Valeur", "Libellé Opération", "Débit (XOF)", "Crédit (XOF)"],
        rows: [
          ["MVT-2026-0901", "26/09/2026", "VIREMENT COMMERCIAL SALAIRES", "4,500,000.00", "-"],
          ["MVT-2026-0902", "25/09/2026", "REMISE CHEQUE BANQUE CENTRALE", "-", "12,000,000.00"],
          ["MVT-2026-0903", "25/09/2026", "COMMISSION FRAIS DE TENUE TRIM.", "125,000.00", "-"],
          ["MVT-2026-0904", "24/09/2026", "REGLEMENT FACTURE TELECOM", "340,000.00", "-"]
        ]
      }
    },
    {
      id: "tab_params",
      label: "Paramètres & Sécurité",
      type: "form",
      fields: [
        { label: "Devise Principale", value: "XOF - Franc CFA UEMOA", tag: "c01" },
        { label: "Nature du Produit", value: "COMPTE COURANT COMMERCIAL AVEC FACILITE", tag: "c02" },
        { label: "Contrôle Double Visa", value: "OUI (Requis pour montants > 5,000,000 XOF)", tag: "c03" },
        { label: "Mode Clôture Journalière", value: "AUTOMATIQUE LORS DU BATCH EOD DE 23H00", tag: "c04" }
      ]
    }
  ];

  const actions = data?.actions || [
    { label: "Valider (F10)", keyShortcut: "F10", style: "primary", icon: "✓" },
    { label: "Nouveau (F2)", keyShortcut: "F2", style: "secondary", icon: "➕" },
    { label: "Export Excel", keyShortcut: "Ctrl+E", style: "secondary", icon: "📊" },
    { label: "Imprimer (Ctrl+P)", keyShortcut: "Ctrl+P", style: "secondary", icon: "🖨️" },
    { label: "Fermer (ESC)", keyShortcut: "ESC", style: "danger", icon: "✕" }
  ];

  const statusBar = data?.statusBar || {
    user: "OPR_AG01",
    agency: "01001 (ABIDJAN PLATEAU)",
    accountingDate: "26/09/2026",
    environment: "Amplitude v11.x - Genero GWC/GDC Runtime"
  };

  const activeTab = tabs.find((t) => t.id === activeTabId) || tabs[0];

  return (
    <div style={{
      background: "#0f172a",
      borderRadius: "10px",
      border: "1px solid #334155",
      boxShadow: "0 10px 30px rgba(0,0,0,0.5), 0 0 1px 1px rgba(255,255,255,0.05)",
      overflow: "hidden",
      display: "flex",
      flexDirection: "column",
      fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    }}>
      {/* 1. BARRE DE TITRE FENÊTRE GUI (GDC / GWC) */}
      <div style={{
        background: "linear-gradient(90deg, #1e293b 0%, #0f172a 100%)",
        borderBottom: "1px solid #334155",
        padding: "8px 14px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ fontSize: "14px" }}>🏛️</span>
          <span style={{ fontSize: "13px", fontWeight: 700, color: "#f8fafc", letterSpacing: "0.02em" }}>
            {windowTitle}
          </span>
          <span style={{
            fontSize: "10px",
            fontWeight: 800,
            background: "#064e3b",
            color: "#34d399",
            border: "1px solid #059669",
            padding: "2px 6px",
            borderRadius: "4px"
          }}>
            GENERO GUI (LAYOUT / VBOX)
          </span>
        </div>

        {/* BOUTONS FENÊTRE OS */}
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <button
            title="Réduire"
            style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#f59e0b", border: "none", cursor: "pointer" }}
          />
          <button
            title="Agrandir"
            onClick={() => setIsMaximized(!isMaximized)}
            style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#10b981", border: "none", cursor: "pointer" }}
          />
          <button
            title="Fermer"
            style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#ef4444", border: "none", cursor: "pointer" }}
          />
        </div>
      </div>

      {/* 2. BARRE D'OUTILS ET D'ACTIONS GENERO (ACTIONS / TOOLBAR) */}
      <div style={{
        background: "#1e293b",
        borderBottom: "1px solid #334155",
        padding: "6px 14px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: "8px"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap" }}>
          {actions.map((act, idx) => (
            <button
              key={idx}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "5px",
                padding: "5px 11px",
                borderRadius: "5px",
                fontSize: "11px",
                fontWeight: 700,
                cursor: "pointer",
                transition: "all 0.15s ease",
                border: act.style === "primary"
                  ? "1px solid #10b981"
                  : act.style === "danger"
                    ? "1px solid #ef4444"
                    : "1px solid #475569",
                background: act.style === "primary"
                  ? "linear-gradient(135deg, #059669, #047857)"
                  : act.style === "danger"
                    ? "#7f1d1d"
                    : "#334155",
                color: "#ffffff"
              }}
            >
              <span>{act.icon}</span>
              <span>{act.label}</span>
            </button>
          ))}
        </div>

        <div style={{ fontSize: "11px", color: "#94a3b8", display: "flex", alignItems: "center", gap: "10px" }}>
          <span>Domaine : <strong style={{ color: "#e2e8f0" }}>{domain}</strong></span>
          <span style={{ color: "#334155" }}>|</span>
          <span style={{ color: "#38bdf8" }}>SCHEMA: amplitude_db</span>
        </div>
      </div>

      {/* 3. CORPS DU FORMULAIRE : VBOX CONTENEUR PRINCIPAL */}
      <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: "14px", background: "#0b1329" }}>

        {/* CONTENEUR 1 : GRID EN-TÊTE D'ÉCRAN */}
        <div style={{
          background: "#1e293b",
          border: "1px solid #334155",
          borderRadius: "8px",
          padding: "12px 16px"
        }}>
          <div style={{ fontSize: "10px", fontWeight: 800, color: "#64748b", textTransform: "uppercase", marginBottom: "8px" }}>
            Conteneur : GRID (En-tête Identifiant & Contexte Guichet)
          </div>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "12px",
            alignItems: "center"
          }}>
            {headerFields.map((hf, idx) => (
              <div key={idx} style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
                <span style={{ fontSize: "11px", color: "#94a3b8", fontWeight: 600 }}>
                  {hf.label} :
                </span>
                {hf.type === "badge" ? (
                  <span style={{
                    display: "inline-block",
                    padding: "3px 8px",
                    background: "#064e3b",
                    color: "#34d399",
                    border: "1px solid #10b981",
                    borderRadius: "4px",
                    fontSize: "11px",
                    fontWeight: 800,
                    width: "fit-content"
                  }}>
                    {hf.value}
                  </span>
                ) : (
                  <input
                    type="text"
                    readOnly
                    value={hf.value}
                    style={{
                      background: "#0f172a",
                      border: "1px solid #475569",
                      borderRadius: "4px",
                      padding: "5px 8px",
                      color: "#f8fafc",
                      fontSize: "12px",
                      fontFamily: "monospace",
                      fontWeight: 600
                    }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* CONTENEUR 2 : HBOX AVEC SPLITTER (CÔTE À CÔTE) */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: "14px",
          position: "relative"
        }}>
          {/* PANNEAU GAUCHE HBOX */}
          <div style={{
            background: "#1e293b",
            border: "1px solid #334155",
            borderRadius: "8px",
            padding: "12px 16px"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px", borderBottom: "1px solid #334155", paddingBottom: "6px" }}>
              <span style={{ fontSize: "12px", fontWeight: 800, color: "#38bdf8" }}>
                📋 {leftPanel.title}
              </span>
              <span style={{ fontSize: "10px", color: "#64748b", fontFamily: "monospace" }}>HBOX [Gauche]</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {leftPanel.fields.map((f, idx) => (
                <div key={idx} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "8px" }}>
                  <span style={{ fontSize: "11px", color: "#94a3b8" }}>{f.label} :</span>
                  <input
                    type="text"
                    readOnly
                    value={f.value}
                    style={{
                      background: "#0f172a",
                      border: "1px solid #475569",
                      borderRadius: "4px",
                      padding: "4px 8px",
                      color: "#f1f5f9",
                      fontSize: "12px",
                      fontWeight: 600,
                      width: "60%",
                      textAlign: "left"
                    }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* PANNEAU DROIT HBOX */}
          <div style={{
            background: "#1e293b",
            border: "1px solid #334155",
            borderRadius: "8px",
            padding: "12px 16px"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px", borderBottom: "1px solid #334155", paddingBottom: "6px" }}>
              <span style={{ fontSize: "12px", fontWeight: 800, color: "#34d399" }}>
                💰 {rightPanel.title}
              </span>
              <span style={{ fontSize: "10px", color: "#64748b", fontFamily: "monospace" }}>HBOX [Droite]</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {rightPanel.fields.map((f, idx) => (
                <div key={idx} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "8px" }}>
                  <span style={{ fontSize: "11px", color: "#94a3b8" }}>{f.label} :</span>
                  <input
                    type="text"
                    readOnly
                    value={f.value}
                    style={{
                      background: f.highlight ? "#064e3b" : "#0f172a",
                      border: f.highlight ? "1px solid #10b981" : "1px solid #475569",
                      borderRadius: "4px",
                      padding: "4px 8px",
                      color: f.highlight ? "#ffffff" : "#f1f5f9",
                      fontSize: "12px",
                      fontWeight: 700,
                      fontFamily: "monospace",
                      width: "55%",
                      textAlign: "right"
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CONTENEUR 3 : FOLDER & PAGE (ONGLETS GRAPHIQUES) */}
        <div style={{
          background: "#1e293b",
          border: "1px solid #334155",
          borderRadius: "8px",
          overflow: "hidden"
        }}>
          {/* EN-TÊTE D'ONGLETS FOLDER */}
          <div style={{
            display: "flex",
            background: "#0f172a",
            borderBottom: "1px solid #334155",
            padding: "4px 8px 0 8px",
            gap: "4px"
          }}>
            {tabs.map((tab) => {
              const isSelected = tab.id === activeTabId;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTabId(tab.id)}
                  style={{
                    padding: "7px 14px",
                    borderTopLeftRadius: "6px",
                    borderTopRightRadius: "6px",
                    border: isSelected ? "1px solid #334155" : "1px solid transparent",
                    borderBottom: isSelected ? "1px solid #1e293b" : "1px solid #334155",
                    background: isSelected ? "#1e293b" : "transparent",
                    color: isSelected ? "#38bdf8" : "#94a3b8",
                    fontSize: "11px",
                    fontWeight: 700,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px"
                  }}
                >
                  <span>{tab.type === "table" ? "📊" : "⚙️"}</span>
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* CONTENU DE LA PAGE ACTIVE */}
          <div style={{ padding: "14px" }}>
            {activeTab.type === "table" && activeTab.table ? (
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "11px" }}>
                  <thead>
                    <tr style={{ background: "#0f172a", borderBottom: "1px solid #334155" }}>
                      {activeTab.table.columns.map((col, idx) => (
                        <th
                          key={idx}
                          style={{
                            padding: "8px 10px",
                            textAlign: col.includes("XOF") || col.includes("Débit") || col.includes("Crédit") ? "right" : "left",
                            color: "#94a3b8",
                            fontWeight: 700,
                            borderRight: "1px solid #1e293b"
                          }}
                        >
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {activeTab.table.rows.map((row, rIdx) => {
                      const isRowSelected = selectedRowIndex === rIdx;
                      return (
                        <tr
                          key={rIdx}
                          onClick={() => setSelectedRowIndex(rIdx)}
                          style={{
                            background: isRowSelected
                              ? "rgba(56, 189, 248, 0.15)"
                              : rIdx % 2 === 0
                                ? "#1e293b"
                                : "#172554",
                            cursor: "pointer",
                            borderBottom: "1px solid #334155"
                          }}
                        >
                          {row.map((cell, cIdx) => (
                            <td
                              key={cIdx}
                              style={{
                                padding: "7px 10px",
                                color: isRowSelected ? "#ffffff" : "#e2e8f0",
                                fontFamily: cIdx === 0 || cIdx === 1 || cIdx >= 3 ? "monospace" : "inherit",
                                textAlign: cIdx >= 3 ? "right" : "left",
                                fontWeight: isRowSelected ? 700 : 500,
                                borderRight: "1px solid #1e293b"
                              }}
                            >
                              {cell}
                            </td>
                          ))}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "10px" }}>
                {activeTab.fields?.map((f, idx) => (
                  <div key={idx} style={{ background: "#0f172a", padding: "10px 12px", borderRadius: "6px", border: "1px solid #334155" }}>
                    <div style={{ fontSize: "11px", color: "#94a3b8", marginBottom: "4px" }}>{f.label}</div>
                    <div style={{ fontSize: "12px", fontWeight: 700, color: "#f8fafc" }}>{f.value}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>

      {/* 4. BARRE D'ÉTAT DU RUNTIME (STATUS BAR) */}
      <div style={{
        background: "#020617",
        borderTop: "1px solid #1e293b",
        padding: "5px 14px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        fontSize: "10px",
        color: "#64748b"
      }}>
        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          <span>Utilisateur : <strong style={{ color: "#cbd5e1" }}>{statusBar.user}</strong></span>
          <span>•</span>
          <span>Agence : <strong style={{ color: "#cbd5e1" }}>{statusBar.agency}</strong></span>
          <span>•</span>
          <span>Date Valeur : <strong style={{ color: "#cbd5e1" }}>{statusBar.accountingDate}</strong></span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#10b981", display: "inline-block" }}></span>
          <span style={{ color: "#94a3b8" }}>{statusBar.environment}</span>
        </div>
      </div>
    </div>
  );
}
