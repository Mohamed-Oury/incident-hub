"use client";

import { useState } from "react";
import { AppShell } from "@/modules/layout/AppShell";
import { CBS_DOMAINS } from "@/modules/cbs/cbs-data";
import { CbsFunctionalDomain } from "@/modules/cbs/types";

export default function CbsDomainsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDomain, setSelectedDomain] = useState<CbsFunctionalDomain | null>(CBS_DOMAINS[0]);

  const filteredDomains = CBS_DOMAINS.filter((d) => {
    const q = searchTerm.toLowerCase();
    return (
      d.name.toLowerCase().includes(q) ||
      d.summary.toLowerCase().includes(q) ||
      d.tables.some((t) => t.toLowerCase().includes(q)) ||
      d.businessOperations.some((op) => op.toLowerCase().includes(q))
    );
  });

  return (
    <AppShell pageTitle="8 Domaines Métier Amplitude" eyebrow="RÉFÉRENTIEL CORE BANKING">
      <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        
        {/* Header descriptif & Recherche */}
        <div className="card" style={{ padding: "1.25rem 1.5rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
            <div>
              <h2 style={{ fontSize: "1.2rem", fontWeight: 700, margin: "0 0 0.25rem 0" }}>
                Cartographie Fonctionnelle Amplitude
              </h2>
              <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", margin: 0 }}>
                Découvrez les tables clés (BK*), les opérations temps réel et les batchs de nuit par module métier.
              </p>
            </div>

            <div style={{ minWidth: "260px" }}>
              <input
                type="text"
                placeholder="Rechercher (ex: BKCOM, virement, agios, carte)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: "100%",
                  padding: "0.5rem 0.85rem",
                  fontSize: "0.85rem",
                  borderRadius: "var(--radius-sm)",
                  border: "1px solid var(--border-light)",
                  background: "var(--bg-subtle)",
                }}
              />
            </div>
          </div>
        </div>

        {/* Disposition Deux Colonnes : Liste des Domaines & Détail complet */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "1.5rem", alignItems: "start" }}>
          
          {/* Colonne Gauche : Liste des domaines */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {filteredDomains.map((domain) => {
              const isSelected = selectedDomain?.id === domain.id;
              return (
                <div
                  key={domain.id}
                  onClick={() => setSelectedDomain(domain)}
                  className="card"
                  style={{
                    padding: "1rem 1.25rem",
                    cursor: "pointer",
                    border: isSelected ? "2px solid #0284c7" : "1px solid var(--border-light)",
                    background: isSelected ? "rgba(2, 132, 199, 0.05)" : "var(--bg-card)",
                    transition: "all 0.15s ease",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.35rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <span style={{ fontSize: "1.3rem" }}>📑</span>
                      <h3 style={{ fontSize: "0.95rem", fontWeight: 700, margin: 0, color: "var(--text-primary)" }}>
                        {domain.name}
                      </h3>
                    </div>
                    <span
                      style={{
                        fontSize: "0.7rem",
                        padding: "2px 6px",
                        borderRadius: "4px",
                        background: "#e0f2fe",
                        color: "#0369a1",
                        fontWeight: 600,
                      }}
                    >
                      {domain.tables.length} tables
                    </span>
                  </div>
                  <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", margin: "0 0 0.5rem 0", lineHeight: "1.4" }}>
                    {domain.summary}
                  </p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                    {domain.tables.slice(0, 3).map((table) => (
                      <span
                        key={table}
                        style={{
                          fontSize: "0.68rem",
                          fontFamily: "monospace",
                          background: "var(--bg-subtle)",
                          padding: "1px 5px",
                          borderRadius: "3px",
                          border: "1px solid var(--border-light)",
                          color: "var(--text-muted)",
                        }}
                      >
                        {table}
                      </span>
                    ))}
                    {domain.tables.length > 3 && (
                      <span style={{ fontSize: "0.68rem", color: "var(--text-muted)", alignSelf: "center" }}>
                        +{domain.tables.length - 3}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}

            {filteredDomains.length === 0 && (
              <div className="card" style={{ padding: "2rem", textAlign: "center", color: "var(--text-muted)" }}>
                Aucun domaine ne correspond à &quot;{searchTerm}&quot;
              </div>
            )}
          </div>

          {/* Colonne Droite : Fiche Détaillée du Domaine Sélectionné */}
          {selectedDomain ? (
            <div className="card" style={{ padding: "1.75rem", border: "1px solid var(--border-light)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
                <span style={{ fontSize: "2.2rem" }}>📑</span>
                <div>
                  <h2 style={{ fontSize: "1.3rem", fontWeight: 800, margin: 0, color: "var(--text-primary)" }}>
                    {selectedDomain.name}
                  </h2>
                  <span style={{ fontSize: "0.8rem", color: "#0284c7", fontWeight: 600 }}>
                    Code Module : {selectedDomain.code} ({selectedDomain.id})
                  </span>
                </div>
              </div>

              <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: "1.5", marginBottom: "1.5rem" }}>
                {selectedDomain.summary}
              </p>

              {/* Section Tables BK */}
              <div style={{ marginBottom: "1.5rem" }}>
                <h4 style={{ fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-muted)", marginBottom: "0.6rem" }}>
                  Tables Oracle / Informix Principales ({selectedDomain.tables.length})
                </h4>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: "0.5rem" }}>
                  {selectedDomain.tables.map((tbl) => (
                    <div
                      key={tbl}
                      style={{
                        padding: "0.5rem 0.75rem",
                        background: "#0f172a",
                        color: "#38bdf8",
                        fontFamily: "monospace",
                        fontSize: "0.82rem",
                        fontWeight: 700,
                        borderRadius: "var(--radius-sm)",
                        border: "1px solid rgba(56, 189, 248, 0.2)",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.4rem",
                      }}
                    >
                      <span>🗄️</span> {tbl}
                    </div>
                  ))}
                </div>
              </div>

              {/* Section Opérations Métier */}
              <div style={{ marginBottom: "1.5rem" }}>
                <h4 style={{ fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-muted)", marginBottom: "0.6rem" }}>
                  Opérations Temps Réel &amp; Événements
                </h4>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                  {selectedDomain.businessOperations.map((op, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.6rem",
                        padding: "0.45rem 0.6rem",
                        background: "var(--bg-subtle)",
                        borderRadius: "var(--radius-sm)",
                        fontSize: "0.85rem",
                      }}
                    >
                      <span style={{ color: "#10b981", fontWeight: 700 }}>✔</span>
                      <span>{op}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Section Batchs de Nuit */}
              <div style={{ marginBottom: "1.5rem" }}>
                <h4 style={{ fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-muted)", marginBottom: "0.6rem" }}>
                  Traitements Batch Nocturnes (EOD)
                </h4>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                  {selectedDomain.batchProcesses.map((b, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.6rem",
                        padding: "0.45rem 0.6rem",
                        background: "rgba(220, 38, 38, 0.05)",
                        border: "1px solid rgba(220, 38, 38, 0.15)",
                        borderRadius: "var(--radius-sm)",
                        fontSize: "0.85rem",
                      }}
                    >
                      <span style={{ color: "#dc2626", fontWeight: 700 }}>⚙️</span>
                      <span style={{ fontFamily: "monospace", fontWeight: 600 }}>{b}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Section Risques Clés */}
              <div>
                <h4 style={{ fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-muted)", marginBottom: "0.6rem" }}>
                  Points de Risque &amp; Vigilance Run
                </h4>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                  {selectedDomain.keyRisks.map((r, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.6rem",
                        padding: "0.45rem 0.6rem",
                        background: "rgba(234, 179, 8, 0.05)",
                        border: "1px solid rgba(234, 179, 8, 0.2)",
                        borderRadius: "var(--radius-sm)",
                        fontSize: "0.85rem",
                      }}
                    >
                      <span style={{ color: "#d97706", fontWeight: 700 }}>⚠️</span>
                      <span>{r}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          ) : null}

        </div>

      </div>
    </AppShell>
  );
}
