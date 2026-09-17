"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { MTI_CATALOG, MTI_DIGITS_STRUCTURE, MTIDefinition } from "../data/iso-mti-reference";

export function MTIDirectory() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [selectedDirection, setSelectedDirection] = useState<string>("ALL");
  const [activeTab, setActiveTab] = useState<"CATALOG" | "STRUCTURE">("CATALOG");

  const categories = [
    { key: "ALL", label: "Tous les MTI" },
    { key: "AUTORISATION", label: "Autorisation (01xx)" },
    { key: "FINANCIER", label: "Financier (02xx)" },
    { key: "REVERSAL_CHARGEBACK", label: "Annulation & Extourne (04xx)" },
    { key: "RECONCILIATION", label: "Réconciliation & Totaux (05xx)" },
    { key: "GESTION_RESEAU", label: "Gestion Réseau & Echo (08xx)" },
  ];

  const filteredMTIs = useMemo(() => {
    return MTI_CATALOG.filter((item) => {
      const q = search.toLowerCase().trim();
      const matchSearch =
        !q ||
        item.mti.includes(q) ||
        item.name.toLowerCase().includes(q) ||
        item.meaning.toLowerCase().includes(q) ||
        item.operationalUsage.toLowerCase().includes(q) ||
        item.diagnosticAdvice.toLowerCase().includes(q) ||
        item.keyFields.some((f) => f.toLowerCase().includes(q));

      const matchCategory = selectedCategory === "ALL" || item.category === selectedCategory;
      const matchDirection = selectedDirection === "ALL" || item.direction === selectedDirection;

      return matchSearch && matchCategory && matchDirection;
    });
  }, [search, selectedCategory, selectedDirection]);

  const getCategoryBadgeClass = (category: string) => {
    switch (category) {
      case "AUTORISATION":
        return "badge badge-warning";
      case "FINANCIER":
        return "badge-emerald";
      case "REVERSAL_CHARGEBACK":
        return "badge badge-black";
      case "RECONCILIATION":
        return "badge";
      case "GESTION_RESEAU":
        return "badge badge-emerald";
      default:
        return "badge";
    }
  };

  const getDirectionBadge = (dir: string) => {
    switch (dir) {
      case "REQUEST":
        return <span style={{ color: "#38bdf8", fontWeight: 700 }}>Demande (Request) ➜</span>;
      case "RESPONSE":
        return <span style={{ color: "#34d399", fontWeight: 700 }}>⬅ Réponse (Response)</span>;
      case "ADVICE":
        return <span style={{ color: "#fbbf24", fontWeight: 700 }}>Avis (Advice) ➜</span>;
      default:
        return <span>{dir}</span>;
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.75rem" }}>
      {/* En-tête avec bannière hero-search */}
      <div className="hero-search">
        <div>
          <p className="eyebrow accent" style={{ color: "#34d399" }}>NORME ISO 8583 - TYPOLOGIE DES MESSAGES</p>
          <h2 style={{ fontSize: "1.4rem", fontWeight: 800 }}>Référentiel des Codes MTI (Message Type Identifier)</h2>
          <p style={{ fontSize: "0.92rem", color: "#94a3b8", marginTop: "0.3rem" }}>
            Maîtrisez la structure à 4 chiffres du MTI (0100, 0200, 0400, 0800...), leur signification métier, le flux transactionnel et les diagnostics d&apos;exploitation.
          </p>
        </div>

        {/* Barre de recherche intégrée */}
        <div className="search-input-wrapper">
          <span style={{ fontSize: "1.2rem" }}>🔎</span>
          <input
            type="text"
            placeholder="Rechercher par MTI (ex: 0200, 0400), nom, champ clé (PIN, DE55) ou cas d'usage..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ fontSize: "1rem" }}
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              style={{ background: "none", border: "none", cursor: "pointer", color: "#64748b", fontWeight: "bold" }}
            >
              ✕
            </button>
          )}
        </div>

        {/* Filtres par famille et direction */}
        <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap", alignItems: "center" }}>
          <span style={{ fontSize: "0.82rem", color: "#94a3b8", fontWeight: 700, marginRight: "0.25rem" }}>
            Catégorie :
          </span>
          {categories.map((c) => (
            <button
              key={c.key}
              onClick={() => setSelectedCategory(c.key)}
              style={{
                background: selectedCategory === c.key ? "#e60028" : "#1f2937",
                color: selectedCategory === c.key ? "#ffffff" : "#cbd5e1",
                border: "1px solid #374151",
                padding: "0.4rem 0.8rem",
                borderRadius: "6px",
                fontSize: "0.82rem",
                cursor: "pointer",
                fontWeight: 600,
                transition: "all 0.15s ease",
              }}
            >
              {c.label}
            </button>
          ))}

          <div style={{ marginLeft: "auto" }}>
            <select
              value={selectedDirection}
              onChange={(e) => setSelectedDirection(e.target.value)}
              style={{
                background: "#1e293b",
                color: "#f8fafc",
                border: "1px solid #334155",
                borderRadius: "6px",
                padding: "0.4rem 0.8rem",
                fontSize: "0.82rem",
                cursor: "pointer",
              }}
            >
              <option value="ALL">Toutes directions</option>
              <option value="REQUEST">Demandes (Requests)</option>
              <option value="RESPONSE">Réponses (Responses)</option>
              <option value="ADVICE">Avis (Advices)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Onglets : Catalogue vs Anatomie des 4 Chiffres */}
      <div style={{ display: "flex", gap: "0.75rem", borderBottom: "2px solid #e2e8f0", paddingBottom: "0.5rem" }}>
        <button
          onClick={() => setActiveTab("CATALOG")}
          className={activeTab === "CATALOG" ? "btn-primary" : "btn-ghost"}
          style={{ fontSize: "0.9rem" }}
        >
          📖 Catalogue Détaillé des MTI ({MTI_CATALOG.length})
        </button>
        <button
          onClick={() => setActiveTab("STRUCTURE")}
          className={activeTab === "STRUCTURE" ? "btn-primary" : "btn-ghost"}
          style={{ fontSize: "0.9rem" }}
        >
          🧩 Anatomie &amp; Décomposition des 4 Chiffres
        </button>
      </div>

      {activeTab === "STRUCTURE" ? (
        /* VUE ANATOMIE DES 4 CHIFFRES */
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <div className="card" style={{ background: "#ffffff", border: "1px solid #e2e8f0" }}>
            <h3 style={{ fontSize: "1.1rem", fontWeight: 800, color: "#0f172a", marginBottom: "0.5rem" }}>
              Comment est composé un code MTI (4 chiffres) ?
            </h3>
            <p style={{ fontSize: "0.92rem", color: "#475569", lineHeight: 1.6 }}>
              Dans la norme ISO 8583, chaque position du code MTI à 4 chiffres (ex: <code style={{ color: "#059669", fontWeight: 800, background: "#ecfdf5", padding: "0.15rem 0.4rem", borderRadius: "4px" }}>0200</code>) a une fonction normalisée précise.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.25rem" }}>
            {MTI_DIGITS_STRUCTURE.map((digit) => (
              <div key={digit.digitPosition} className="card" style={{ display: "flex", flexDirection: "column", gap: "0.85rem", background: "#ffffff", border: "1px solid #e2e8f0" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <div
                    style={{
                      width: "38px",
                      height: "38px",
                      borderRadius: "8px",
                      background: "#059669",
                      color: "#ffffff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "1.1rem",
                      fontWeight: 800,
                    }}
                  >
                    #{digit.digitPosition}
                  </div>
                  <div>
                    <h4 style={{ fontSize: "0.98rem", fontWeight: 700, color: "#0f172a", margin: 0 }}>
                      {digit.digitRole}
                    </h4>
                    <span style={{ fontSize: "0.78rem", color: "#64748b" }}>Position {digit.digitPosition}</span>
                  </div>
                </div>
                <p style={{ fontSize: "0.85rem", color: "#475569", margin: 0 }}>
                  {digit.description}
                </p>

                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginTop: "0.5rem" }}>
                  {digit.values.map((v) => (
                    <div
                      key={v.value}
                      style={{
                        background: "#f8fafc",
                        padding: "0.6rem 0.75rem",
                        borderRadius: "6px",
                        border: "1px solid #e2e8f0",
                        fontSize: "0.82rem",
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.2rem" }}>
                        <strong style={{ color: "#0369a1", fontFamily: "monospace", fontSize: "0.9rem" }}>Chiffre &apos;{v.value}&apos;</strong>
                        <span style={{ color: "#059669", fontWeight: 700 }}>{v.meaning}</span>
                      </div>
                      <p style={{ margin: 0, color: "#64748b", fontSize: "0.78rem" }}>{v.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* VUE CATALOGUE DES MTI */
        <>
          {/* Nombre de Résultats */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "0.9rem", color: "#64748b" }}>
              <b>{filteredMTIs.length}</b> type(s) de message MTI affiché(s)
            </span>
          </div>

          {/* Grille des Cartes MTI */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))", gap: "1.25rem" }}>
            {filteredMTIs.map((mti) => (
              <div
                key={mti.mti}
                className="card"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  gap: "1rem",
                  borderLeft: "4px solid #059669",
                  background: "#ffffff",
                  border: "1px solid #e2e8f0",
                  borderLeftWidth: "4px",
                  borderLeftColor: "#059669",
                }}
              >
                <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "0.5rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                      <span
                        style={{
                          fontSize: "1.25rem",
                          fontWeight: 900,
                          fontFamily: "monospace",
                          color: "#047857",
                          background: "#ecfdf5",
                          padding: "0.25rem 0.65rem",
                          borderRadius: "6px",
                          border: "1px solid #a7f3d0",
                        }}
                      >
                        {mti.mti}
                      </span>
                      <span className={getCategoryBadgeClass(mti.category)} style={{ fontSize: "0.75rem" }}>
                        {mti.category}
                      </span>
                    </div>
                    <div style={{ fontSize: "0.8rem" }}>{getDirectionBadge(mti.direction)}</div>
                  </div>

                  <h3 style={{ fontSize: "1.05rem", fontWeight: 700, color: "#0f172a", margin: "0.2rem 0 0 0" }}>
                    {mti.name}
                  </h3>

                  <p style={{ fontSize: "0.9rem", color: "#334155", lineHeight: 1.5, margin: 0 }}>
                    {mti.meaning}
                  </p>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", background: "#f8fafc", padding: "0.9rem", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
                  <div>
                    <span style={{ fontSize: "0.75rem", textTransform: "uppercase", fontWeight: 700, color: "#64748b" }}>
                      Champs Clés ISO Présents :
                    </span>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem", marginTop: "0.3rem" }}>
                      {mti.keyFields.map((f, idx) => (
                        <span
                          key={idx}
                          style={{
                            fontSize: "0.75rem",
                            background: "#ffffff",
                            color: "#0369a1",
                            border: "1px solid #cbd5e1",
                            padding: "0.2rem 0.5rem",
                            borderRadius: "4px",
                            fontFamily: "monospace",
                            fontWeight: 600,
                          }}
                        >
                          {f}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span style={{ fontSize: "0.75rem", textTransform: "uppercase", fontWeight: 700, color: "#b45309" }}>
                      ⚡ Conduite d&apos;Analyse Incident :
                    </span>
                    <p style={{ fontSize: "0.84rem", color: "#92400e", margin: "0.2rem 0 0 0", lineHeight: 1.45, fontWeight: 500 }}>
                      {mti.diagnosticAdvice}
                    </p>
                  </div>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #e2e8f0", paddingTop: "0.75rem" }}>
                  <span style={{ fontSize: "0.75rem", color: "#64748b", fontWeight: 500 }}>{mti.isoVersion}</span>
                  <Link
                    href={`/knowledge?search=${mti.mti}`}
                    className="btn-ghost"
                    style={{ fontSize: "0.8rem", color: "#059669", textDecoration: "none", fontWeight: 600 }}
                  >
                    Voir incidents associés ➜
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
