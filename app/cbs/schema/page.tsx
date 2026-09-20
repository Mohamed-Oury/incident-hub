"use client";

import { useState } from "react";
import { AppShell } from "@/modules/layout/AppShell";
import { CBS_SCHEMA_TABLES, CbsTableDefinition } from "@/modules/cbs/cbs-advanced-data";

export default function CbsSchemaPage() {
  const [tables] = useState<CbsTableDefinition[]>(CBS_SCHEMA_TABLES);
  const [selectedTable, setSelectedTable] = useState<CbsTableDefinition>(CBS_SCHEMA_TABLES[0]);
  const [searchQuery, setSearchQuery] = useState("");
  const [copied, setCopied] = useState(false);

  const filteredTables = tables.filter((t) => {
    return (
      t.tableName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.module.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.columns.some((c) => c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.description.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  });

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AppShell
      pageTitle="Dictionnaire de Données & Schéma Relationnel CBS"
      eyebrow="AMPLITUDE IT BANKING"
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "24px", maxWidth: "1200px", margin: "0 auto" }}>
        
        {/* BANDEAU SUPÉRIEUR */}
        <div style={{
          background: "linear-gradient(135deg, #1e293b, #0f172a)",
          border: "1px solid #334155",
          borderRadius: "12px",
          padding: "24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "16px"
        }}>
          <div>
            <span style={{
              background: "#0284c7",
              color: "#ffffff",
              fontSize: "12px",
              fontWeight: 700,
              padding: "4px 10px",
              borderRadius: "9999px",
              textTransform: "uppercase"
            }}>
              Modèle Conceptuel Amplitude
            </span>
            <h2 style={{ fontSize: "22px", fontWeight: 700, color: "#f8fafc", marginTop: "8px", marginBottom: "4px" }}>
              Explorateur du Dictionnaire des Tables Maîtresses
            </h2>
            <p style={{ color: "#94a3b8", fontSize: "14px", margin: 0 }}>
              Structure relationnelle, clés primaires/étrangères et règles de gestion des tables bancaires centrales.
            </p>
          </div>

          <div>
            <input
              type="text"
              placeholder="Rechercher champ, table, solde..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                padding: "8px 14px",
                borderRadius: "8px",
                background: "#0f172a",
                border: "1px solid #334155",
                color: "#f8fafc",
                fontSize: "13px",
                minWidth: "280px"
              }}
            />
          </div>
        </div>

        {/* 2 COLONNES : LISTE DES TABLES & DÉTAIL */}
        <div style={{ display: "grid", gridTemplateColumns: "1.1fr 2fr", gap: "24px", alignItems: "start" }}>
          
          {/* LISTE DES TABLES SCROLLABLE */}
          <div style={{
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            maxHeight: "calc(100vh - 210px)",
            overflowY: "auto",
            paddingRight: "8px"
          }}>
            {filteredTables.map((t) => (
              <div
                key={t.tableName}
                onClick={() => setSelectedTable(t)}
                style={{
                  background: selectedTable.tableName === t.tableName ? "#1e293b" : "#0f172a",
                  border: selectedTable.tableName === t.tableName ? "2px solid #0284c7" : "1px solid #334155",
                  borderRadius: "10px",
                  padding: "14px",
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                  flexShrink: 0
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                  <span style={{ fontSize: "15px", fontWeight: 800, color: "#f8fafc", fontFamily: "monospace" }}>
                    {t.tableName}
                  </span>
                  <span style={{ fontSize: "11px", color: "#38bdf8", background: "rgba(2, 132, 199, 0.15)", padding: "2px 6px", borderRadius: "4px" }}>
                    {t.module}
                  </span>
                </div>
                <p style={{ fontSize: "12px", color: "#94a3b8", margin: 0 }}>
                  {t.description}
                </p>
              </div>
            ))}
          </div>

          {/* DÉTAIL DE LA TABLE SÉLECTIONNÉE (FIGÉ / STICKY) */}
          <div style={{
            background: "#1e293b",
            borderRadius: "12px",
            border: "1px solid #334155",
            padding: "24px",
            position: "sticky",
            top: "24px",
            maxHeight: "calc(100vh - 120px)",
            overflowY: "auto"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
              <div>
                <h3 style={{ fontSize: "20px", fontWeight: 800, color: "#f8fafc", fontFamily: "monospace" }}>
                  TABLE {selectedTable.tableName}
                </h3>
                <div style={{ fontSize: "13px", color: "#94a3b8" }}>
                  Module : <strong style={{ color: "#38bdf8" }}>{selectedTable.module}</strong> | Clé primaire : <strong style={{ color: "#facc15" }}>({selectedTable.primaryKey.join(", ")})</strong>
                </div>
              </div>

              <button
                onClick={() => handleCopy(selectedTable.sampleQuery)}
                style={{
                  background: copied ? "#22c55e" : "#0284c7",
                  color: "#ffffff",
                  border: "none",
                  borderRadius: "6px",
                  padding: "6px 14px",
                  fontSize: "12px",
                  fontWeight: 600,
                  cursor: "pointer"
                }}
              >
                {copied ? "Copié !" : "Copier Requête Exemple"}
              </button>
            </div>

            {/* COLONNES DE LA TABLE */}
            <div style={{ marginBottom: "20px" }}>
              <div style={{ fontSize: "13px", fontWeight: 700, color: "#f8fafc", marginBottom: "8px" }}>
                Attributs & Colonnes :
              </div>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "12px" }}>
                  <thead>
                    <tr style={{ background: "#0f172a", color: "#94a3b8", borderBottom: "1px solid #334155" }}>
                      <th style={{ padding: "8px 10px" }}>Colonne</th>
                      <th style={{ padding: "8px 10px" }}>Type</th>
                      <th style={{ padding: "8px 10px" }}>Description Métier</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedTable.columns.map((col, idx) => (
                      <tr key={idx} style={{ borderBottom: "1px solid #334155" }}>
                        <td style={{ padding: "8px 10px", fontFamily: "monospace", fontWeight: 700, color: selectedTable.primaryKey.includes(col.name) ? "#facc15" : "#38bdf8" }}>
                          {col.name} {selectedTable.primaryKey.includes(col.name) && "🔑"}
                        </td>
                        <td style={{ padding: "8px 10px", color: "#94a3b8", fontFamily: "monospace" }}>
                          {col.type}
                        </td>
                        <td style={{ padding: "8px 10px", color: "#e2e8f0" }}>
                          {col.description}
                          {col.sensitive && (
                            <span style={{ marginLeft: "6px", fontSize: "10px", color: "#f87171", background: "rgba(239, 68, 68, 0.2)", padding: "2px 4px", borderRadius: "3px" }}>
                              Donnée sensible
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* REQUÊTE D'EXEMPLE & RÈGLES */}
            <div style={{ marginBottom: "16px" }}>
              <div style={{ fontSize: "12px", fontWeight: 600, color: "#cbd5e1", marginBottom: "4px" }}>
                Exemple de SELECT d'exploitation :
              </div>
              <pre style={{
                background: "#090d16",
                borderRadius: "6px",
                padding: "10px 14px",
                border: "1px solid #334155",
                color: "#34d399",
                fontFamily: "monospace",
                fontSize: "12px",
                margin: 0
              }}>
                {selectedTable.sampleQuery}
              </pre>
            </div>

            <div style={{
              background: "rgba(234, 179, 8, 0.1)",
              border: "1px solid #eab308",
              borderRadius: "8px",
              padding: "12px",
              fontSize: "12px",
              color: "#fef08a"
            }}>
              <strong>⚠️ Règle d'exploitation critique :</strong> {selectedTable.criticalNotes}
            </div>

          </div>

        </div>

      </div>
    </AppShell>
  );
}
