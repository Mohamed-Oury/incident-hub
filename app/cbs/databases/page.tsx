"use client";

import { useState } from "react";
import { AppShell } from "@/modules/layout/AppShell";
import { CBS_DB_ERRORS } from "@/modules/cbs/cbs-data";

export default function CbsDatabasesPage() {
  const [activeTab, setActiveTab] = useState<"ora" | "comparison">("ora");
  const [searchCode, setSearchCode] = useState("");
  const [selectedError, setSelectedError] = useState(CBS_DB_ERRORS[0]);

  const filteredErrors = CBS_DB_ERRORS.filter((err) => {
    const q = searchCode.toLowerCase();
    return (
      err.code.toLowerCase().includes(q) ||
      err.name.toLowerCase().includes(q) ||
      err.symptom.toLowerCase().includes(q) ||
      err.rootCause.toLowerCase().includes(q)
    );
  });

  return (
    <AppShell pageTitle="SGBD Oracle & Informix Bancaire" eyebrow="BASE DE DONNÉES & PERFORMANCE">
      <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        
        {/* Navigation Onglets */}
        <div style={{ display: "flex", gap: "0.5rem", borderBottom: "1px solid var(--border-light)", paddingBottom: "0.5rem" }}>
          <button
            type="button"
            onClick={() => setActiveTab("ora")}
            style={{
              padding: "0.5rem 1rem",
              borderRadius: "var(--radius-sm)",
              border: "none",
              background: activeTab === "ora" ? "#0284c7" : "transparent",
              color: activeTab === "ora" ? "#ffffff" : "var(--text-secondary)",
              fontWeight: 700,
              cursor: "pointer",
              fontSize: "0.85rem",
            }}
          >
            📕 Dictionnaire Erreurs ORA &amp; Informix
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("comparison")}
            style={{
              padding: "0.5rem 1rem",
              borderRadius: "var(--radius-sm)",
              border: "none",
              background: activeTab === "comparison" ? "#0284c7" : "transparent",
              color: activeTab === "comparison" ? "#ffffff" : "var(--text-secondary)",
              fontWeight: 700,
              cursor: "pointer",
              fontSize: "0.85rem",
            }}
          >
            ⚖️ Comparatif Oracle vs Informix Dynamic Server (IDS)
          </button>
        </div>

        {activeTab === "ora" && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "1.5rem", alignItems: "start" }}>
            
            {/* Liste gauche des codes ORA */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              <input
                type="text"
                placeholder="Rechercher code (ex: ORA-00054, ORA-01555)..."
                value={searchCode}
                onChange={(e) => setSearchCode(e.target.value)}
                style={{
                  width: "100%",
                  padding: "0.5rem 0.85rem",
                  fontSize: "0.85rem",
                  borderRadius: "var(--radius-sm)",
                  border: "1px solid var(--border-light)",
                  background: "var(--bg-subtle)",
                }}
              />

              {filteredErrors.map((err) => {
                const isSelected = selectedError.code === err.code;
                return (
                  <div
                    key={err.code}
                    onClick={() => setSelectedError(err)}
                    className="card"
                    style={{
                      padding: "1rem",
                      cursor: "pointer",
                      border: isSelected ? "2px solid #0284c7" : "1px solid var(--border-light)",
                      background: isSelected ? "rgba(2, 132, 199, 0.05)" : "var(--bg-card)",
                      transition: "all 0.15s ease",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.25rem" }}>
                      <span style={{ fontFamily: "monospace", fontWeight: 800, color: "#e60028", fontSize: "0.9rem" }}>
                        {err.code}
                      </span>
                      <span
                        style={{
                          fontSize: "0.7rem",
                          background: "#fee2e2",
                          color: "#991b1b",
                          padding: "1px 6px",
                          borderRadius: "4px",
                          fontWeight: 700,
                        }}
                      >
                        {err.severity}
                      </span>
                    </div>
                    <div style={{ fontSize: "0.82rem", fontWeight: 600, color: "var(--text-primary)", marginBottom: "0.25rem" }}>
                      {err.name}
                    </div>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {err.symptom}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Fiche droite détaillée avec requêtes SQL de résolution */}
            {selectedError && (
              <div className="card" style={{ padding: "1.75rem", border: "1px solid var(--border-light)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
                  <div>
                    <span style={{ fontSize: "0.75rem", background: "#0284c7", color: "#ffffff", padding: "2px 8px", borderRadius: "4px", fontWeight: 700 }}>
                      MOTEUR: {errEngine(selectedError.engine)}
                    </span>
                    <h3 style={{ fontSize: "1.4rem", fontFamily: "monospace", fontWeight: 800, color: "#e60028", margin: "0.4rem 0 0.2rem 0" }}>
                      {selectedError.code}
                    </h3>
                    <div style={{ fontSize: "1rem", fontWeight: 700, color: "var(--text-primary)" }}>
                      {selectedError.name}
                    </div>
                  </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                  
                  <div>
                    <h4 style={{ fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-muted)", marginBottom: "0.35rem" }}>
                      Symptômes Constatés
                    </h4>
                    <p style={{ fontSize: "0.88rem", color: "var(--text-secondary)", margin: 0, lineHeight: "1.5" }}>
                      {selectedError.symptom}
                    </p>
                  </div>

                  <div>
                    <h4 style={{ fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-muted)", marginBottom: "0.35rem" }}>
                      Cause Racine (Root Cause)
                    </h4>
                    <p style={{ fontSize: "0.88rem", color: "var(--text-secondary)", margin: 0, lineHeight: "1.5" }}>
                      {selectedError.rootCause}
                    </p>
                  </div>

                  {selectedError.diagnosticQueries.length > 0 && (
                    <div>
                      <h4 style={{ fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-muted)", marginBottom: "0.35rem" }}>
                        Requêtes de Diagnostic SGBD
                      </h4>
                      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                        {selectedError.diagnosticQueries.map((q, idx) => (
                          <pre
                            key={idx}
                            style={{
                              background: "#0f172a",
                              color: "#38bdf8",
                              padding: "0.75rem 1rem",
                              borderRadius: "var(--radius-sm)",
                              fontFamily: "monospace",
                              fontSize: "0.8rem",
                              overflowX: "auto",
                              border: "1px solid rgba(56, 189, 248, 0.2)",
                              margin: 0,
                            }}
                          >
                            {q}
                          </pre>
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <h4 style={{ fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-muted)", marginBottom: "0.35rem" }}>
                      Étapes de Résolution
                    </h4>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
                      {selectedError.resolutionSteps.map((step, idx) => (
                        <div key={idx} style={{ display: "flex", gap: "0.5rem", fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                          <span style={{ color: "#0284c7", fontWeight: 700 }}>{idx + 1}.</span>
                          <span>{step}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div style={{ background: "rgba(16, 185, 129, 0.05)", padding: "0.85rem 1rem", borderRadius: "var(--radius-sm)", border: "1px solid rgba(16,185,129,0.2)" }}>
                    <h4 style={{ fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "#065f46", marginBottom: "0.25rem" }}>
                      🛡️ Mesure Préventive Durable
                    </h4>
                    <p style={{ fontSize: "0.85rem", color: "#064e3b", margin: 0, lineHeight: "1.45" }}>
                      {selectedError.prevention}
                    </p>
                  </div>

                </div>
              </div>
            )}

          </div>
        )}

        {activeTab === "comparison" && (
          <div className="card" style={{ padding: "1.5rem" }}>
            <h3 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "0.5rem" }}>
              Comparatif d&apos;Architecture : Oracle Database vs IBM Informix Dynamic Server (IDS)
            </h3>
            <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "1.5rem" }}>
              Amplitude fonctionne historiquement avec ces deux moteurs transactionnels. Voici les correspondances clés en production bancaire.
            </p>

            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem" }}>
                <thead>
                  <tr style={{ background: "var(--bg-subtle)", textAlign: "left" }}>
                    <th style={{ padding: "0.75rem 1rem", borderBottom: "1px solid var(--border-light)" }}>Fonctionnalité</th>
                    <th style={{ padding: "0.75rem 1rem", borderBottom: "1px solid var(--border-light)", color: "#e60028" }}>Oracle Database (19c/21c)</th>
                    <th style={{ padding: "0.75rem 1rem", borderBottom: "1px solid var(--border-light)", color: "#0284c7" }}>IBM Informix Dynamic Server (IDS 14)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ padding: "0.75rem 1rem", fontWeight: 600, borderBottom: "1px solid var(--border-light)" }}>Stockage / Fichiers</td>
                    <td style={{ padding: "0.75rem 1rem", borderBottom: "1px solid var(--border-light)" }}>Tablespaces, Datafiles, ASM</td>
                    <td style={{ padding: "0.75rem 1rem", borderBottom: "1px solid var(--border-light)" }}>Dbspaces, Chunks, Raw Devices / Cooked</td>
                  </tr>
                  <tr>
                    <td style={{ padding: "0.75rem 1rem", fontWeight: 600, borderBottom: "1px solid var(--border-light)" }}>Journaux de Transactions</td>
                    <td style={{ padding: "0.75rem 1rem", borderBottom: "1px solid var(--border-light)" }}>Redo Logs, Archive Logs (ARCHIVELOG mode)</td>
                    <td style={{ padding: "0.75rem 1rem", borderBottom: "1px solid var(--border-light)" }}>Logical Logs, Physical Log (onbar / ontape)</td>
                  </tr>
                  <tr>
                    <td style={{ padding: "0.75rem 1rem", fontWeight: 600, borderBottom: "1px solid var(--border-light)" }}>Outils CLI d&apos;administration</td>
                    <td style={{ padding: "0.75rem 1rem", borderBottom: "1px solid var(--border-light)", fontFamily: "monospace" }}>sqlplus / as sysdba, srvctl, rman</td>
                    <td style={{ padding: "0.75rem 1rem", borderBottom: "1px solid var(--border-light)", fontFamily: "monospace" }}>onstat, oncheck, onmode, dbaccess</td>
                  </tr>
                  <tr>
                    <td style={{ padding: "0.75rem 1rem", fontWeight: 600, borderBottom: "1px solid var(--border-light)" }}>Supervision des verrous</td>
                    <td style={{ padding: "0.75rem 1rem", borderBottom: "1px solid var(--border-light)", fontFamily: "monospace" }}>v$locked_object, v$session, v$lock</td>
                    <td style={{ padding: "0.75rem 1rem", borderBottom: "1px solid var(--border-light)", fontFamily: "monospace" }}>onstat -k (locks), onstat -u (users)</td>
                  </tr>
                  <tr>
                    <td style={{ padding: "0.75rem 1rem", fontWeight: 600, borderBottom: "1px solid var(--border-light)" }}>Sauvegarde à chaud</td>
                    <td style={{ padding: "0.75rem 1rem", borderBottom: "1px solid var(--border-light)" }}>RMAN (Recovery Manager) avec NetBackup/Commvault</td>
                    <td style={{ padding: "0.75rem 1rem", borderBottom: "1px solid var(--border-light)" }}>ON-Bar (avec Storage Manager) ou ontape -s -L 0</td>
                  </tr>
                  <tr>
                    <td style={{ padding: "0.75rem 1rem", fontWeight: 600, borderBottom: "1px solid var(--border-light)" }}>Haute Disponibilité</td>
                    <td style={{ padding: "0.75rem 1rem", borderBottom: "1px solid var(--border-light)" }}>Oracle RAC (Real Application Clusters), Data Guard</td>
                    <td style={{ padding: "0.75rem 1rem", borderBottom: "1px solid var(--border-light)" }}>Informix HDR (High-Availability Data Replication), RSS</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </AppShell>
  );
}

function errEngine(engine: string) {
  return engine || "Oracle";
}
