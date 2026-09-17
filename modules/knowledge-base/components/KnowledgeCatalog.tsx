"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { IncidentRecord } from "@/modules/incidents/types";

interface KnowledgeCatalogProps {
  initialIncidents: IncidentRecord[];
}

export function KnowledgeCatalog({ initialIncidents }: KnowledgeCatalogProps) {
  const [search, setSearch] = useState("");
  const [selectedDomain, setSelectedDomain] = useState<string>("ALL");
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 10;

  const domains = useMemo(() => {
    const list = Array.from(new Set(initialIncidents.map((i) => i.domain).filter(Boolean)));
    return ["ALL", ...list];
  }, [initialIncidents]);

  const filteredIncidents = useMemo(() => {
    return initialIncidents.filter((inc) => {
      const q = search.toLowerCase();
      const matchQuery =
        !search ||
        inc.reference.toLowerCase().includes(q) ||
        inc.title.toLowerCase().includes(q) ||
        (inc.component && inc.component.toLowerCase().includes(q)) ||
        (inc.errorCode && inc.errorCode.toLowerCase().includes(q)) ||
        (inc.description && inc.description.toLowerCase().includes(q));

      const matchDomain = selectedDomain === "ALL" || inc.domain === selectedDomain;
      const matchStatus =
        selectedStatus === "ALL" ||
        (selectedStatus === "VALIDATED" && inc.knowledgeStatus === "VALIDATED") ||
        (selectedStatus === "REFERENCE_SCENARIO" && inc.knowledgeStatus === "REFERENCE_SCENARIO");

      return matchQuery && matchDomain && matchStatus;
    });
  }, [initialIncidents, search, selectedDomain, selectedStatus]);

  const totalPages = Math.ceil(filteredIncidents.length / pageSize) || 1;
  const safePage = Math.min(currentPage, totalPages);

  const paginatedIncidents = useMemo(() => {
    const start = (safePage - 1) * pageSize;
    return filteredIncidents.slice(start, start + pageSize);
  }, [filteredIncidents, safePage, pageSize]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {/* Barre de recherche et filtres */}
      <div className="hero-search">
        <div>
          <p className="eyebrow accent" style={{ color: "#e60028" }}>BASE DE CONNAISSANCES EXPERTE</p>
          <h2 style={{ fontSize: "1.35rem", fontWeight: 800 }}>Catalogue des Incidents Monétiques Capitalisés</h2>
          <p style={{ fontSize: "0.9rem", color: "#94a3b8", marginTop: "0.25rem" }}>
            Recherche par MTI, code réponse DE39, STAN, canal (GAB, TPE, EMV, HSM, Switch) ou composant technique.
          </p>
        </div>

        <div className="search-input-wrapper">
          <span style={{ fontSize: "1.2rem" }}>🔍</span>
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Rechercher par DE39 (ex: 91), composant (CBS, Host, HSM), STAN, MTI..."
          />
          {search && (
            <button
              onClick={() => {
                setSearch("");
                setCurrentPage(1);
              }}
              style={{ background: "none", border: "none", cursor: "pointer", color: "#64748b", fontWeight: "bold" }}
            >
              ✕
            </button>
          )}
        </div>

        {/* Filtres par domaine et statut */}
        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", alignItems: "center" }}>
          <span style={{ fontSize: "0.8rem", color: "#94a3b8", fontWeight: 700 }}>Domaine :</span>
          {domains.map((d) => (
            <button
              key={d}
              onClick={() => {
                setSelectedDomain(d!);
                setCurrentPage(1);
              }}
              style={{
                background: selectedDomain === d ? "#e60028" : "#1f2937",
                color: selectedDomain === d ? "#ffffff" : "#d1d5db",
                border: "1px solid #374151",
                padding: "0.35rem 0.75rem",
                borderRadius: "6px",
                fontSize: "0.8rem",
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              {d === "ALL" ? "Tous" : d}
            </button>
          ))}

          <span style={{ fontSize: "0.8rem", color: "#94a3b8", fontWeight: 700, marginLeft: "1rem" }}>Statut :</span>
          <select
            value={selectedStatus}
            onChange={(e) => {
              setSelectedStatus(e.target.value);
              setCurrentPage(1);
            }}
            style={{
              background: "#111827",
              color: "#ffffff",
              border: "1px solid #374151",
              borderRadius: "6px",
              padding: "0.35rem 0.75rem",
              fontSize: "0.8rem",
            }}
          >
            <option value="ALL">Tous les statuts</option>
            <option value="VALIDATED">Validé (RCA & Résolution prouvées)</option>
            <option value="REFERENCE_SCENARIO">Scénario de référence</option>
          </select>
        </div>
      </div>

      {/* Résumé des résultats */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.88rem", color: "#64748b" }}>
        <span>
          Affichage de <strong>{paginatedIncidents.length > 0 ? (safePage - 1) * pageSize + 1 : 0}</strong> à{" "}
          <strong>{Math.min(safePage * pageSize, filteredIncidents.length)}</strong> sur{" "}
          <strong>{filteredIncidents.length}</strong> incidents
        </span>

        {/* Contrôles de pagination en haut */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <button
            type="button"
            disabled={safePage <= 1}
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            className="btn-secondary"
            style={{ padding: "0.3rem 0.7rem", fontSize: "0.8rem", opacity: safePage <= 1 ? 0.5 : 1 }}
          >
            ← Précédent
          </button>
          <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "#0f172a" }}>
            Page {safePage} / {totalPages}
          </span>
          <button
            type="button"
            disabled={safePage >= totalPages}
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            className="btn-secondary"
            style={{ padding: "0.3rem 0.7rem", fontSize: "0.8rem", opacity: safePage >= totalPages ? 0.5 : 1 }}
          >
            Suivant →
          </button>
        </div>
      </div>

      {/* Table des incidents paginée */}
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th style={{ width: "110px" }}>Référence</th>
              <th>Titre de l&apos;incident</th>
              <th>Domaine</th>
              <th>Composant</th>
              <th>Clés / Code</th>
              <th>Statut Connaissance</th>
              <th style={{ textAlign: "right" }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {paginatedIncidents.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: "center", padding: "3rem", color: "#64748b" }}>
                  Aucun incident ne correspond à votre recherche.
                </td>
              </tr>
            ) : (
              paginatedIncidents.map((inc) => {
                const isValidated = inc.knowledgeStatus === "VALIDATED";
                return (
                  <tr key={inc.reference}>
                    <td>
                      <b style={{ color: "#0f172a" }}>{inc.reference}</b>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600, color: "#0f172a" }}>{inc.title}</div>
                      {inc.description && (
                        <div style={{ fontSize: "0.8rem", color: "#64748b", marginTop: "0.15rem", maxWidth: "480px" }}>
                          {inc.description.length > 95 ? inc.description.slice(0, 95) + "..." : inc.description}
                        </div>
                      )}
                    </td>
                    <td>
                      <span className="badge badge-black">{inc.domain || "GÉNÉRAL"}</span>
                    </td>
                    <td>
                      <span style={{ fontWeight: 600, color: "#334155" }}>{inc.component || "—"}</span>
                    </td>
                    <td>
                      <code style={{ background: "#fef2f2", border: "1px solid #fee2e2", padding: "0.2rem 0.45rem", borderRadius: "4px", fontSize: "0.82rem", color: "#e60028", fontWeight: 700 }}>
                        {inc.errorCode || "ISO"}
                      </code>
                    </td>
                    <td>
                      <span className={`badge ${isValidated ? "badge-emerald" : "badge-warning"}`}>
                        {isValidated ? "✓ Validé" : "Scénario Réf"}
                      </span>
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <div style={{ display: "inline-flex", gap: "0.4rem" }}>
                        <Link
                          href={`/incidents/${inc.reference}`}
                          className="btn-secondary"
                          style={{ padding: "0.35rem 0.65rem", fontSize: "0.78rem" }}
                        >
                          Consulter
                        </Link>
                        {!isValidated && (
                          <Link
                            href={`/incidents/${inc.reference}/edit`}
                            className="btn-emerald"
                            style={{ padding: "0.35rem 0.65rem", fontSize: "0.78rem" }}
                          >
                            Traiter →
                          </Link>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination en bas de tableau avec sélecteur de pages */}
      {totalPages > 1 && (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "0.35rem", marginTop: "0.5rem", flexWrap: "wrap" }}>
          <button
            type="button"
            disabled={safePage <= 1}
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            className="btn-secondary"
            style={{ padding: "0.35rem 0.75rem", fontSize: "0.8rem", opacity: safePage <= 1 ? 0.5 : 1 }}
          >
            ←
          </button>

          {(() => {
            const maxVisible = 10;
            let startPage = 1;
            if (totalPages > maxVisible) {
              if (safePage <= Math.floor(maxVisible / 2)) {
                startPage = 1;
              } else if (safePage + Math.floor(maxVisible / 2) >= totalPages) {
                startPage = totalPages - maxVisible + 1;
              } else {
                startPage = safePage - Math.floor(maxVisible / 2);
              }
            }
            const pagesCount = Math.min(maxVisible, totalPages);
            return Array.from({ length: pagesCount }, (_, i) => {
              const pageNumber = startPage + i;
              return (
                <button
                  key={pageNumber}
                  onClick={() => setCurrentPage(pageNumber)}
                  style={{
                    minWidth: "36px",
                    height: "36px",
                    padding: "0 0.5rem",
                    borderRadius: "8px",
                    border: safePage === pageNumber ? "1.5px solid #e60028" : "1px solid #cbd5e1",
                    background: safePage === pageNumber ? "#e60028" : "#ffffff",
                    color: safePage === pageNumber ? "#ffffff" : "#0f172a",
                    fontWeight: 700,
                    fontSize: "0.85rem",
                    cursor: "pointer",
                    transition: "all 0.15s ease",
                  }}
                >
                  {pageNumber}
                </button>
              );
            });
          })()}

          <button
            type="button"
            disabled={safePage >= totalPages}
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            className="btn-secondary"
            style={{ padding: "0.35rem 0.75rem", fontSize: "0.8rem", opacity: safePage >= totalPages ? 0.5 : 1 }}
          >
            →
          </button>
        </div>
      )}
    </div>
  );
}
