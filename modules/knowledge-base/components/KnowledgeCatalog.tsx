"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { IncidentRecord } from "@/modules/incidents/types";
import {
  SessionUser,
  canEditIncident,
  canDeleteIncident,
} from "@/modules/auth/types";
import { useSubsidiary } from "@/modules/layout/SubsidiaryContext";

interface KnowledgeCatalogProps {
  initialIncidents: IncidentRecord[];
  initialSearch?: string;
  currentUser?: SessionUser | null;
}

export function KnowledgeCatalog({
  initialIncidents,
  initialSearch = "",
  currentUser,
}: KnowledgeCatalogProps) {
  const [incidents, setIncidents] = useState<IncidentRecord[]>(initialIncidents);
  const { subsidiary: selectedSubsidiary, setSubsidiary } = useSubsidiary();
  const [search, setSearch] = useState(initialSearch);
  const [selectedDomain, setSelectedDomain] = useState<string>("ALL");
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [deletingRef, setDeletingRef] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const pageSize = 10;

  // Détermination de la filiale d'un incident (par défaut, tous les incidents actuels sont rattachés à SGABS)
  const getIncidentSubsidiary = (inc: IncidentRecord): "AFG" | "SGABS" => {
    if (inc.subsidiary === "AFG") return "AFG";
    return "SGABS";
  };

  // Compteurs d'incidents par filiale
  const counts = useMemo(() => {
    let afg = 0;
    let sgabs = 0;
    for (const inc of incidents) {
      if (getIncidentSubsidiary(inc) === "AFG") afg++;
      else sgabs++;
    }
    return { afg, sgabs };
  }, [incidents]);

  // Incidents restreints à la filiale sélectionnée
  const subsidiaryIncidents = useMemo(() => {
    return incidents.filter((inc) => getIncidentSubsidiary(inc) === selectedSubsidiary);
  }, [incidents, selectedSubsidiary]);

  const handleToggleSubsidiary = (subsidiary: "AFG" | "SGABS") => {
    setSubsidiary(subsidiary);
    setCurrentPage(1);
    setSelectedDomain("ALL");
  };

  // Seul le SuperAdmin peut supprimer ou modifier; l'Admin ne peut que modifier; les autres rôles n'ont pas accès
  const allowEdit = canEditIncident(currentUser);
  const allowDelete = canDeleteIncident(currentUser);

  const handleDeleteIncident = async (inc: IncidentRecord) => {
    if (!allowDelete) return;
    if (
      !window.confirm(
        `Confirmez-vous la suppression définitive de l'incident ${inc.reference} ("${inc.title}") de la base de connaissances ?`
      )
    ) {
      return;
    }

    setDeletingRef(inc.reference);
    setFeedback(null);

    try {
      const res = await fetch(`/api/incidents/${encodeURIComponent(inc.reference)}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Impossible de supprimer l'incident.");
      }

      setIncidents((prev) => prev.filter((item) => item.reference !== inc.reference));
      setFeedback({
        type: "success",
        message: `L'incident ${inc.reference} ("${inc.title}") a été supprimé de la base de connaissances.`,
      });
    } catch (err: any) {
      setFeedback({
        type: "error",
        message: err.message || "Erreur lors de la suppression.",
      });
    } finally {
      setDeletingRef(null);
    }
  };

  const domains = useMemo(() => {
    const list = Array.from(new Set(subsidiaryIncidents.map((i) => i.domain).filter(Boolean)));
    return ["ALL", ...list];
  }, [subsidiaryIncidents]);

  const filteredIncidents = useMemo(() => {
    return subsidiaryIncidents.filter((inc) => {
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
  }, [subsidiaryIncidents, search, selectedDomain, selectedStatus]);

  const totalPages = Math.ceil(filteredIncidents.length / pageSize) || 1;
  const safePage = Math.min(currentPage, totalPages);

  const paginatedIncidents = useMemo(() => {
    const start = (safePage - 1) * pageSize;
    return filteredIncidents.slice(start, start + pageSize);
  }, [filteredIncidents, safePage, pageSize]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {/* 🏦 TOGGLE FILIALES BANCAIRES TRAITÉES (AFG & SGABS) */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "1rem",
          background: "#ffffff",
          padding: "1rem 1.35rem",
          borderRadius: "16px",
          border: "1px solid #e2e8f0",
          boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.85rem" }}>
          <div
            style={{
              width: "42px",
              height: "42px",
              borderRadius: "12px",
              background: selectedSubsidiary === "AFG" ? "#ffffff" : "#e60028",
              color: "#ffffff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 800,
              fontSize: "1.1rem",
              padding: selectedSubsidiary === "AFG" ? "4px" : "0",
              border: selectedSubsidiary === "AFG" ? "1.5px solid #00a800" : "none",
              boxShadow: selectedSubsidiary === "AFG" ? "0 4px 12px rgba(0,168,0,0.3)" : "0 4px 10px rgba(230,0,40,0.25)",
              transition: "all 0.2s ease",
            }}
          >
            {selectedSubsidiary === "AFG" ? (
              <img src="/afg-logo.png" alt="AFG Bank" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
            ) : (
              "🔴"
            )}
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <span style={{ fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "#64748b", fontWeight: 800 }}>
                FILIALE TRAITÉE
              </span>
              <span
                style={{
                  fontSize: "0.7rem",
                  fontWeight: 700,
                  padding: "0.1rem 0.5rem",
                  borderRadius: "999px",
                  background: selectedSubsidiary === "AFG" ? "#f0fdf4" : "#fef2f2",
                  color: selectedSubsidiary === "AFG" ? "#15803d" : "#e60028",
                  border: `1px solid ${selectedSubsidiary === "AFG" ? "#bbf7d0" : "#fecaca"}`,
                }}
              >
                {selectedSubsidiary === "AFG" ? "AFG Bank (Atlantic Group)" : "Société Générale de Banques"}
              </span>
            </div>
            <div style={{ fontSize: "1rem", fontWeight: 800, color: "#0f172a", marginTop: "0.15rem" }}>
              {selectedSubsidiary === "AFG" ? "AFG Bank (Atlantic Group)" : "SGABS (Société Générale Sénégal)"}
            </div>
          </div>
        </div>

        {/* Boutons Toggle Switcher AFG / SGABS */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            background: "#f1f5f9",
            padding: "0.3rem",
            borderRadius: "12px",
            border: "1px solid #e2e8f0",
            gap: "0.3rem",
          }}
        >
          {/* Bouton AFG (Sélectionné par défaut) */}
          <button
            type="button"
            onClick={() => handleToggleSubsidiary("AFG")}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.6rem",
              padding: "0.55rem 1.1rem",
              borderRadius: "10px",
              border: selectedSubsidiary === "AFG" ? "1px solid #008800" : "1px solid transparent",
              background: selectedSubsidiary === "AFG" ? "#00a800" : "transparent",
              color: selectedSubsidiary === "AFG" ? "#ffffff" : "#475569",
              fontWeight: 800,
              fontSize: "0.86rem",
              cursor: "pointer",
              transition: "all 0.15s ease",
            }}
          >
            <span>🏛️ AFG Bank</span>
            <span
              style={{
                padding: "0.15rem 0.55rem",
                borderRadius: "999px",
                fontSize: "0.72rem",
                fontWeight: 800,
                background: selectedSubsidiary === "AFG" ? "rgba(255,255,255,0.25)" : "#e2e8f0",
                color: selectedSubsidiary === "AFG" ? "#ffffff" : "#64748b",
              }}
            >
              {counts.afg}
            </span>
          </button>

          {/* Bouton SGABS */}
          <button
            type="button"
            onClick={() => handleToggleSubsidiary("SGABS")}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.6rem",
              padding: "0.55rem 1.1rem",
              borderRadius: "10px",
              border: selectedSubsidiary === "SGABS" ? "1px solid #e60028" : "1px solid transparent",
              background: selectedSubsidiary === "SGABS" ? "#e60028" : "transparent",
              color: selectedSubsidiary === "SGABS" ? "#ffffff" : "#475569",
              fontWeight: 800,
              fontSize: "0.86rem",
              cursor: "pointer",
              transition: "all 0.15s ease",
            }}
          >
            <span>🔴 SGABS</span>
            <span
              style={{
                padding: "0.15rem 0.55rem",
                borderRadius: "999px",
                fontSize: "0.72rem",
                fontWeight: 800,
                background: selectedSubsidiary === "SGABS" ? "rgba(255,255,255,0.28)" : "#e2e8f0",
                color: selectedSubsidiary === "SGABS" ? "#ffffff" : "#64748b",
              }}
            >
              {counts.sgabs}
            </span>
          </button>
        </div>
      </div>
      {feedback && (
        <div
          style={{
            padding: "0.9rem 1.25rem",
            borderRadius: "12px",
            fontWeight: 700,
            fontSize: "0.88rem",
            background: feedback.type === "success" ? "#ecfdf5" : "#fef2f2",
            color: feedback.type === "success" ? "#065f46" : "#991b1b",
            border: `1px solid ${feedback.type === "success" ? "#a7f3d0" : "#fecaca"}`,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span>
            {feedback.type === "success" ? "✅ " : "⚠️ "}
            {feedback.message}
          </span>
          <button
            type="button"
            onClick={() => setFeedback(null)}
            style={{ background: "none", border: "none", cursor: "pointer", fontWeight: 800, color: "inherit" }}
          >
            ✕
          </button>
        </div>
      )}
      {/* Barre de recherche et filtres */}
      <div className="hero-search">
        <div>
          <p
            className="eyebrow accent"
            style={{ color: selectedSubsidiary === "AFG" ? "#4ade80" : "#e60028" }}
          >
            BASE DE CONNAISSANCES EXPERTE — {selectedSubsidiary === "AFG" ? "AFG BANK (ATLANTIC GROUP)" : "SOCIÉTÉ GÉNÉRALE (SGABS)"}
          </p>
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
                background: selectedDomain === d ? (selectedSubsidiary === "AFG" ? "#00a800" : "#e60028") : "#1f2937",
                color: selectedDomain === d ? "#ffffff" : "#d1d5db",
                border: `1px solid ${selectedDomain === d ? (selectedSubsidiary === "AFG" ? "#166534" : "#99001b") : "#374151"}`,
                padding: "0.35rem 0.75rem",
                borderRadius: "6px",
                fontSize: "0.8rem",
                cursor: "pointer",
                fontWeight: 600,
                transition: "all 0.15s ease",
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
              <th style={{ width: "95px" }}>Filiale</th>
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
                <td colSpan={8} style={{ textAlign: "center", padding: "3.5rem 1.5rem", color: "#64748b" }}>
                  {selectedSubsidiary === "AFG" && counts.afg === 0 ? (
                    <div style={{ maxWidth: "560px", margin: "0 auto", display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem" }}>
                      <div
                        style={{
                          width: "72px",
                          height: "72px",
                          borderRadius: "16px",
                          background: "#ffffff",
                          border: "1.5px solid #00a800",
                          boxShadow: "0 4px 14px rgba(0, 168, 0, 0.25)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          padding: "8px",
                        }}
                      >
                        <img src="/afg-logo.png" alt="AFG Bank Logo" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                      </div>
                      <div>
                        <h3 style={{ fontSize: "1.15rem", fontWeight: 800, color: "#0f172a" }}>
                          Aucun incident répertorié pour AFG Bank
                        </h3>
                        <p style={{ fontSize: "0.88rem", color: "#64748b", marginTop: "0.35rem", lineHeight: 1.5 }}>
                          La base de connaissances pour <strong>AFG Bank (Atlantic Group)</strong> est actuellement vide. Tous les incidents existants ({counts.sgabs}) sont affectés à la filiale <strong>SGABS (Société Générale)</strong>.
                        </p>
                      </div>
                      <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", justifyContent: "center" }}>
                        <button
                          type="button"
                          onClick={() => handleToggleSubsidiary("SGABS")}
                          style={{
                            background: "#e60028",
                            color: "#ffffff",
                            border: "none",
                            padding: "0.55rem 1.15rem",
                            borderRadius: "8px",
                            fontWeight: 800,
                            fontSize: "0.85rem",
                            cursor: "pointer",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "0.5rem",
                          }}
                        >
                          <span>🔴 Voir les {counts.sgabs} incidents SGABS</span>
                        </button>
                        <Link
                          href="/hub/incidents/new"
                          className="btn-secondary"
                          style={{ fontSize: "0.85rem", padding: "0.55rem 1rem", fontWeight: 700 }}
                        >
                          ➕ Déclarer un incident AFG
                        </Link>
                      </div>
                    </div>
                  ) : (
                    <div>Aucun incident ne correspond à vos filtres pour la filiale {selectedSubsidiary}.</div>
                  )}
                </td>
              </tr>
            ) : (
              paginatedIncidents.map((inc) => {
                const isValidated = inc.knowledgeStatus === "VALIDATED";
                const incSubsidiary = getIncidentSubsidiary(inc);
                return (
                  <tr key={inc.reference}>
                    <td>
                      <b style={{ color: "#0f172a" }}>{inc.reference}</b>
                    </td>
                    <td>
                      <span
                        style={{
                          display: "inline-block",
                          padding: "0.2rem 0.55rem",
                          borderRadius: "6px",
                          fontSize: "0.74rem",
                          fontWeight: 800,
                          background: incSubsidiary === "AFG" ? "#f0fdf4" : "#fef2f2",
                          color: incSubsidiary === "AFG" ? "#15803d" : "#e60028",
                          border: `1px solid ${incSubsidiary === "AFG" ? "#bbf7d0" : "#fecaca"}`,
                        }}
                      >
                        {incSubsidiary === "AFG" ? "AFG Bank" : "SGABS"}
                      </span>
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
                      <div style={{ display: "inline-flex", gap: "0.4rem", alignItems: "center", justifyContent: "flex-end" }}>
                        <Link
                          href={`/hub/incidents/${inc.reference}`}
                          className="btn-secondary"
                          style={{ padding: "0.35rem 0.65rem", fontSize: "0.78rem" }}
                        >
                          Consulter
                        </Link>
                        {allowEdit && (
                          <Link
                            href={`/hub/incidents/${inc.reference}/edit`}
                            className="btn-emerald"
                            style={{ padding: "0.35rem 0.65rem", fontSize: "0.78rem", fontWeight: 700 }}
                          >
                            ✏️ Modifier
                          </Link>
                        )}
                        {allowDelete && (
                          <button
                            type="button"
                            disabled={deletingRef === inc.reference}
                            onClick={() => handleDeleteIncident(inc)}
                            style={{
                              padding: "0.35rem 0.65rem",
                              fontSize: "0.78rem",
                              fontWeight: 700,
                              borderRadius: "8px",
                              border: "1px solid #fecaca",
                              background: "#fef2f2",
                              color: "#dc2626",
                              cursor: deletingRef === inc.reference ? "wait" : "pointer",
                            }}
                          >
                            {deletingRef === inc.reference ? "..." : "🗑️ Supprimer"}
                          </button>
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
                    border: safePage === pageNumber ? `1.5px solid ${selectedSubsidiary === "AFG" ? "#00a800" : "#e60028"}` : "1px solid #cbd5e1",
                    background: safePage === pageNumber ? (selectedSubsidiary === "AFG" ? "#00a800" : "#e60028") : "#ffffff",
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
