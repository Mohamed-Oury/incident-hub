"use client";

import { useState } from "react";
import { AppShell } from "@/modules/layout/AppShell";
import { CBS_INCIDENTS } from "@/modules/cbs/cbs-data";
import { CbsIncidentModel } from "@/modules/cbs/types";

export default function CbsIncidentsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSeverity, setSelectedSeverity] = useState<string>("ALL");
  const [selectedDomain, setSelectedDomain] = useState<string>("ALL");
  const [expandedId, setExpandedId] = useState<string | null>(CBS_INCIDENTS[0]?.id || null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 15;

  const domains = ["ALL", ...Array.from(new Set(CBS_INCIDENTS.map((i) => i.domain)))];

  const filteredIncidents = CBS_INCIDENTS.filter((inc) => {
    const matchesSev = selectedSeverity === "ALL" || inc.severity === selectedSeverity;
    const matchesDom = selectedDomain === "ALL" || inc.domain === selectedDomain;
    const q = searchTerm.toLowerCase();
    const matchesSearch =
      inc.id.toLowerCase().includes(q) ||
      inc.reference.toLowerCase().includes(q) ||
      inc.title.toLowerCase().includes(q) ||
      inc.symptom.toLowerCase().includes(q) ||
      inc.rootCause.toLowerCase().includes(q);
    return matchesSev && matchesDom && matchesSearch;
  });

  const totalPages = Math.ceil(filteredIncidents.length / pageSize);
  const paginatedIncidents = filteredIncidents.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <AppShell pageTitle="200 Incidents Bancaires & RCA" eyebrow="BASE DE CONNAISSANCE PRODUCTION">
      <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        
        {/* Barre de recherche et filtres */}
        <div className="card" style={{ padding: "1.5rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem", marginBottom: "1rem" }}>
            <div>
              <h2 style={{ fontSize: "1.2rem", fontWeight: 700, margin: "0 0 0.25rem 0" }}>
                Registre des Incidents de Production &amp; Post-Mortem
              </h2>
              <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", margin: 0 }}>
                {filteredIncidents.length} incidents trouvés (sur {CBS_INCIDENTS.length} répertoriés) avec analyse de cause racine (RCA) et étapes de remédiation.
              </p>
            </div>

            <div style={{ minWidth: "280px" }}>
              <input
                type="text"
                placeholder="Rechercher (ex: ORA-00054, virement, swift, disk full)..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                style={{
                  width: "100%",
                  padding: "0.55rem 0.85rem",
                  fontSize: "0.85rem",
                  borderRadius: "var(--radius-sm)",
                  border: "1px solid var(--border-light)",
                  background: "var(--bg-subtle)",
                }}
              />
            </div>
          </div>

          {/* Filtres de sévérité & domaines */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", alignItems: "center" }}>
            <div style={{ display: "flex", gap: "4px" }}>
              {["ALL", "P1", "P2", "P3"].map((sev) => {
                const isSelected = selectedSeverity === sev;
                return (
                  <button
                    key={sev}
                    type="button"
                    onClick={() => {
                      setSelectedSeverity(sev);
                      setCurrentPage(1);
                    }}
                    style={{
                      padding: "4px 10px",
                      borderRadius: "6px",
                      border: "none",
                      background: isSelected
                        ? sev === "P1" ? "#dc2626" : sev === "P2" ? "#d97706" : sev === "P3" ? "#0284c7" : "#374151"
                        : "var(--bg-subtle)",
                      color: isSelected ? "#ffffff" : "var(--text-secondary)",
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                  >
                    {sev === "ALL" ? "Toutes sévérités" : sev}
                  </button>
                );
              })}
            </div>

            <div style={{ height: "20px", width: "1px", background: "var(--border-light)" }} />

            <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
              {domains.map((dom) => {
                const isSelected = selectedDomain === dom;
                return (
                  <button
                    key={dom}
                    type="button"
                    onClick={() => {
                      setSelectedDomain(dom);
                      setCurrentPage(1);
                    }}
                    style={{
                      padding: "3px 8px",
                      borderRadius: "14px",
                      border: isSelected ? "1px solid #0284c7" : "1px solid var(--border-light)",
                      background: isSelected ? "#0284c7" : "transparent",
                      color: isSelected ? "#ffffff" : "var(--text-muted)",
                      fontSize: "0.72rem",
                      cursor: "pointer",
                      fontWeight: isSelected ? 700 : 500,
                    }}
                  >
                    {dom}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Liste des incidents (accordéon / cartes) */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
          {paginatedIncidents.map((inc) => {
            const isExpanded = expandedId === inc.id;
            return (
              <div
                key={inc.id}
                className="card"
                style={{
                  border: isExpanded ? "1px solid #0284c7" : "1px solid var(--border-light)",
                  padding: "1.25rem",
                  transition: "all 0.15s ease",
                }}
              >
                {/* En-tête de l'incident */}
                <div
                  onClick={() => toggleExpand(inc.id)}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    cursor: "pointer",
                    gap: "1rem",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    <span
                      style={{
                        padding: "2px 8px",
                        borderRadius: "4px",
                        fontSize: "0.72rem",
                        fontWeight: 800,
                        color: "#ffffff",
                        background: inc.severity === "P1" ? "#dc2626" : inc.severity === "P2" ? "#d97706" : "#0284c7",
                      }}
                    >
                      {inc.severity}
                    </span>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <span style={{ fontFamily: "monospace", fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 700 }}>
                          {inc.reference}
                        </span>
                        <h3 style={{ fontSize: "0.95rem", fontWeight: 700, margin: 0, color: "var(--text-primary)" }}>
                          {inc.title}
                        </h3>
                      </div>
                      <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "2px" }}>
                        Domaine : <strong>{inc.domain}</strong> • Impact : {inc.businessImpact}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    <span style={{ fontSize: "0.8rem", color: "#0284c7", fontWeight: 600 }}>
                      {isExpanded ? "Masquer ▲" : "Voir RCA & Remédiation ▼"}
                    </span>
                  </div>
                </div>

                {/* Détail complet RCA en 6 blocs */}
                {isExpanded && (
                  <div
                    style={{
                      marginTop: "1.25rem",
                      paddingTop: "1.25rem",
                      borderTop: "1px solid var(--border-light)",
                      display: "flex",
                      flexDirection: "column",
                      gap: "1rem",
                      fontSize: "0.85rem",
                    }}
                  >
                    <div>
                      <strong style={{ color: "#e60028" }}>🚨 Symptôme constaté :</strong>
                      <p style={{ margin: "0.25rem 0 0 0", color: "var(--text-secondary)" }}>{inc.symptom}</p>
                    </div>

                    <div>
                      <strong style={{ color: "#0284c7" }}>🔍 Cause Racine (Root Cause) :</strong>
                      <p style={{ margin: "0.25rem 0 0 0", color: "var(--text-secondary)" }}>{inc.rootCause}</p>
                    </div>

                    {inc.logEvidence && (
                      <div>
                        <strong style={{ color: "var(--text-muted)" }}>💻 Preuve Logs / Trace Système :</strong>
                        <pre
                          style={{
                            background: "#0f172a",
                            color: "#38bdf8",
                            padding: "0.6rem 0.85rem",
                            borderRadius: "var(--radius-sm)",
                            fontFamily: "monospace",
                            fontSize: "0.8rem",
                            marginTop: "0.25rem",
                            overflowX: "auto",
                          }}
                        >
                          {inc.logEvidence}
                        </pre>
                      </div>
                    )}

                    <div style={{ background: "rgba(16, 185, 129, 0.05)", padding: "0.75rem 1rem", borderRadius: "var(--radius-sm)", border: "1px solid rgba(16, 185, 129, 0.2)" }}>
                      <strong style={{ color: "#065f46" }}>⚡ Étapes de Remédiation :</strong>
                      <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem", marginTop: "0.35rem" }}>
                        {inc.remediationSteps.map((step, idx) => (
                          <div key={idx} style={{ display: "flex", gap: "0.5rem", color: "#064e3b" }}>
                            <span style={{ fontWeight: 700 }}>{idx + 1}.</span>
                            <span>{step}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {inc.rollbackOrFallback && (
                      <div>
                        <strong style={{ color: "#d97706" }}>↩ Rollback / Plan de secours :</strong>
                        <p style={{ margin: "0.25rem 0 0 0", color: "var(--text-secondary)" }}>{inc.rollbackOrFallback}</p>
                      </div>
                    )}

                    <div>
                      <strong style={{ color: "var(--text-muted)" }}>🛡️ Règle Préventive Durable :</strong>
                      <p style={{ margin: "0.25rem 0 0 0", color: "var(--text-secondary)" }}>{inc.preventionRule}</p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {filteredIncidents.length === 0 && (
            <div className="card" style={{ padding: "3rem", textAlign: "center", color: "var(--text-muted)" }}>
              Aucun incident ne correspond aux critères sélectionnés.
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "0.5rem", marginTop: "1rem" }}>
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              style={{
                padding: "6px 12px",
                borderRadius: "var(--radius-sm)",
                border: "1px solid var(--border-light)",
                background: "var(--bg-card)",
                cursor: currentPage === 1 ? "not-allowed" : "pointer",
                fontSize: "0.8rem",
                opacity: currentPage === 1 ? 0.5 : 1,
              }}
            >
              ← Précédent
            </button>
            <span style={{ fontSize: "0.85rem", color: "var(--text-muted)", margin: "0 0.5rem" }}>
              Page <strong>{currentPage}</strong> sur <strong>{totalPages}</strong>
            </span>
            <button
              type="button"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              style={{
                padding: "6px 12px",
                borderRadius: "var(--radius-sm)",
                border: "1px solid var(--border-light)",
                background: "var(--bg-card)",
                cursor: currentPage === totalPages ? "not-allowed" : "pointer",
                fontSize: "0.8rem",
                opacity: currentPage === totalPages ? 0.5 : 1,
              }}
            >
              Suivant →
            </button>
          </div>
        )}

      </div>
    </AppShell>
  );
}
