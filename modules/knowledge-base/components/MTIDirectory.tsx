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
      {/* En-tête */}
      <div className="hero-search">
        <div>
          <p className="eyebrow accent" style={{ color: "#34d399" }}>NORME ISO 8583 - TYPOLOGIE DES MESSAGES</p>
          <h2 style={{ fontSize: "1.4rem", fontWeight: 800 }}>Référentiel des Codes MTI (Message Type Identifier)</h2>
          <p style={{ fontSize: "0.92rem", color: "#94a3b8", marginTop: "0.3rem" }}>
            Maîtrisez la structure à 4 chiffres du MTI (0100, 0200, 0400, 0800...), leur signification métier, le flux transactionnel et les diagnostics d&apos;exploitation.
          </p>
        </div>
      </div>

      {/* Onglets : Catalogue vs Anatomie des 4 Chiffres */}
      <div style={{ display: "flex", gap: "0.75rem", borderBottom: "1px solid #1e293b", paddingBottom: "0.5rem" }}>
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
          <div className="card" style={{ background: "#0f172a", border: "1px solid #1e293b" }}>
            <h3 style={{ fontSize: "1.1rem", fontWeight: 800, color: "#f8fafc", marginBottom: "0.5rem" }}>
              Comment est composé un code MTI (4 chiffres) ?
            </h3>
            <p style={{ fontSize: "0.9rem", color: "#94a3b8", lineHeight: 1.6 }}>
              Dans la norme ISO 8583, chaque position du code MTI à 4 chiffres (ex: <code style={{ color: "#34d399", fontWeight: 800 }}>0200</code>) a une fonction normalisée précise.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.25rem" }}>
            {MTI_DIGITS_STRUCTURE.map((digit) => (
              <div key={digit.digitPosition} className="card" style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <div
                    style={{
                      width: "36px",
                      height: "36px",
                      borderRadius: "8px",
                      background: "#065f46",
                      color: "#34d399",
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
                    <h4 style={{ fontSize: "0.98rem", fontWeight: 700, color: "#f8fafc", margin: 0 }}>
                      {digit.digitRole}
                    </h4>
                    <span style={{ fontSize: "0.78rem", color: "#94a3b8" }}>Position {digit.digitPosition}</span>
                  </div>
                </div>
                <p style={{ fontSize: "0.85rem", color: "#cbd5e1", margin: 0 }}>
                  {digit.description}
                </p>

                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginTop: "0.5rem" }}>
                  {digit.values.map((v) => (
                    <div
                      key={v.value}
                      style={{
                        background: "#0f172a",
                        padding: "0.5rem 0.75rem",
                        borderRadius: "6px",
                        border: "1px solid #1e293b",
                        fontSize: "0.82rem",
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.2rem" }}>
                        <strong style={{ color: "#38bdf8", fontFamily: "monospace" }}>Chiffre &apos;{v.value}&apos;</strong>
                        <span style={{ color: "#34d399", fontWeight: 600 }}>{v.meaning}</span>
                      </div>
                      <p style={{ margin: 0, color: "#94a3b8", fontSize: "0.78rem" }}>{v.description}</p>
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
          {/* Barre de Recherche et Filtres */}
          <div className="card" style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "center" }}>
              <input
                type="text"
                className="input"
                placeholder="Rechercher par MTI (ex: 0200, 0400), nom, champ ou cas d'usage..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ flex: 1, minWidth: "260px" }}
              />
              <select
                className="input"
                value={selectedDirection}
                onChange={(e) => setSelectedDirection(e.target.value)}
                style={{ width: "200px" }}
              >
                <option value="ALL">Toutes directions</option>
                <option value="REQUEST">Demandes (Requests)</option>
                <option value="RESPONSE">Réponses (Responses)</option>
                <option value="ADVICE">Avis (Advices)</option>
              </select>
            </div>

            {/* Chips de Catégorie */}
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
              {categories.map((c) => (
                <button
                  key={c.key}
                  onClick={() => setSelectedCategory(c.key)}
                  className={`btn-ghost ${selectedCategory === c.key ? "btn-primary" : ""}`}
                  style={{
                    fontSize: "0.82rem",
                    padding: "0.35rem 0.75rem",
                    borderRadius: "6px",
                  }}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          {/* Nombre de Résultats */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "0.9rem", color: "#94a3b8" }}>
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
                }}
              >
                <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "0.5rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                      <span
                        style={{
                          fontSize: "1.3rem",
                          fontWeight: 900,
                          fontFamily: "monospace",
                          color: "#34d399",
                          background: "#064e3b",
                          padding: "0.2rem 0.6rem",
                          borderRadius: "6px",
                          border: "1px solid #059669",
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

                  <h3 style={{ fontSize: "1.05rem", fontWeight: 700, color: "#f8fafc", margin: "0.2rem 0 0 0" }}>
                    {mti.name}
                  </h3>

                  <p style={{ fontSize: "0.88rem", color: "#cbd5e1", lineHeight: 1.5, margin: 0 }}>
                    {mti.meaning}
                  </p>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", background: "#0f172a", padding: "0.85rem", borderRadius: "6px", border: "1px solid #1e293b" }}>
                  <div>
                    <span style={{ fontSize: "0.75rem", textTransform: "uppercase", fontWeight: 700, color: "#94a3b8" }}>
                      Champs Clés ISO Présents :
                    </span>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem", marginTop: "0.3rem" }}>
                      {mti.keyFields.map((f, idx) => (
                        <span
                          key={idx}
                          style={{
                            fontSize: "0.75rem",
                            background: "#1e293b",
                            color: "#38bdf8",
                            padding: "0.15rem 0.45rem",
                            borderRadius: "4px",
                            fontFamily: "monospace",
                          }}
                        >
                          {f}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span style={{ fontSize: "0.75rem", textTransform: "uppercase", fontWeight: 700, color: "#fbbf24" }}>
                      ⚡ Conduite d&apos;Analyse Incident :
                    </span>
                    <p style={{ fontSize: "0.82rem", color: "#fde68a", margin: "0.2rem 0 0 0", lineHeight: 1.4 }}>
                      {mti.diagnosticAdvice}
                    </p>
                  </div>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #1e293b", paddingTop: "0.75rem" }}>
                  <span style={{ fontSize: "0.75rem", color: "#64748b" }}>{mti.isoVersion}</span>
                  <Link
                    href={`/knowledge?search=${mti.mti}`}
                    className="btn-ghost"
                    style={{ fontSize: "0.8rem", color: "#34d399", textDecoration: "none" }}
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
