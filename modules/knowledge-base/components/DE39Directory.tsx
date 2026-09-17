"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { DE39_CATALOG, DE39Definition } from "../data/iso-de39-reference";

export function DE39Directory() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");

  const categories = [
    { key: "ALL", label: "Tous les codes" },
    { key: "APPROBATION", label: "Approbation (Succès)" },
    { key: "TECHNIQUE_RESEAU", label: "Technique, Réseau & Timeouts" },
    { key: "SECURITE_CRYPTO", label: "Cryptographie, PIN & EMV" },
    { key: "METIER_PORTEUR", label: "Porteur, Compte & Fraude" },
    { key: "GESTION_RESEAU", label: "Gestion Réseau (0800)" },
  ];

  const filteredCodes = useMemo(() => {
    return DE39_CATALOG.filter((item) => {
      const q = search.toLowerCase().trim();
      const matchSearch =
        !q ||
        item.code.toLowerCase().includes(q) ||
        item.label.toLowerCase().includes(q) ||
        item.meaning.toLowerCase().includes(q) ||
        item.impactIncident.toLowerCase().includes(q) ||
        item.recommendedAction.toLowerCase().includes(q);

      const matchCategory = selectedCategory === "ALL" || item.category === selectedCategory;

      return matchSearch && matchCategory;
    });
  }, [search, selectedCategory]);

  const getCategoryBadgeClass = (category: string) => {
    switch (category) {
      case "APPROBATION":
        return "badge-emerald";
      case "TECHNIQUE_RESEAU":
        return "badge";
      case "SECURITE_CRYPTO":
        return "badge badge-black";
      case "METIER_PORTEUR":
        return "badge badge-warning";
      default:
        return "badge";
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.75rem" }}>
      {/* Bannière de recherche DE39 */}
      <div className="hero-search">
        <div>
          <p className="eyebrow accent" style={{ color: "#34d399" }}>DICTIONNAIRE TECHNIQUE ISO 8583</p>
          <h2 style={{ fontSize: "1.4rem", fontWeight: 800 }}>Référentiel des Codes Réponse DE39 (Action Codes)</h2>
          <p style={{ fontSize: "0.92rem", color: "#94a3b8", marginTop: "0.3rem" }}>
            Identifiez instantanément la signification exacte, l&apos;impact dans la chaîne monétique et la conduite d&apos;analyse d&apos;incident recommandée.
          </p>
        </div>

        {/* Champ de recherche dédié */}
        <div className="search-input-wrapper">
          <span style={{ fontSize: "1.2rem" }}>🔎</span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher par code (ex: 91, 05, 55, 68), mot-clé (timeout, PIN, ARQC, provision)..."
            style={{ fontSize: "1.02rem" }}
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

        {/* Filtres par famille de codes */}
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", alignItems: "center" }}>
          <span style={{ fontSize: "0.82rem", color: "#94a3b8", fontWeight: 700, marginRight: "0.25rem" }}>
            Famille :
          </span>
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setSelectedCategory(cat.key)}
              style={{
                background: selectedCategory === cat.key ? "#e60028" : "#1f2937",
                color: selectedCategory === cat.key ? "#ffffff" : "#cbd5e1",
                border: "1px solid #374151",
                padding: "0.4rem 0.8rem",
                borderRadius: "6px",
                fontSize: "0.82rem",
                cursor: "pointer",
                fontWeight: 600,
                transition: "all 0.15s ease",
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Résumé des résultats */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.9rem", color: "#64748b" }}>
        <span>
          <strong>{filteredCodes.length}</strong> code{filteredCodes.length > 1 ? "s" : ""} référencé{filteredCodes.length > 1 ? "s" : ""}
        </span>
        <span style={{ fontSize: "0.82rem" }}>
          Format ISO 8583 : <b>an 2</b> (2 caractères alphanumériques)
        </span>
      </div>

      {/* Table détaillée des codes DE39 */}
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th style={{ width: "90px" }}>Code</th>
              <th style={{ width: "220px" }}>Libellé Standard</th>
              <th>Signification Technique</th>
              <th>Impact & Diagnostic d&apos;Incident</th>
              <th>Action Immédiate Exploitants</th>
              <th style={{ textAlign: "right", width: "130px" }}>Cas Associés</th>
            </tr>
          </thead>
          <tbody>
            {filteredCodes.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: "center", padding: "3rem", color: "#64748b" }}>
                  Aucun code DE39 ne correspond à votre recherche &quot;{search}&quot;.
                </td>
              </tr>
            ) : (
              filteredCodes.map((item) => (
                <tr key={item.code}>
                  <td>
                    <span
                      style={{
                        display: "inline-block",
                        background: item.code === "00" ? "#ecfdf5" : item.code === "91" || item.code === "96" ? "#fee2e2" : "#f1f5f9",
                        color: item.code === "00" ? "#059669" : item.code === "91" || item.code === "96" ? "#b91c1c" : "#0f172a",
                        padding: "0.35rem 0.65rem",
                        borderRadius: "6px",
                        fontWeight: 800,
                        fontSize: "0.95rem",
                        fontFamily: "monospace",
                        border: item.code === "00" ? "1px solid #a7f3d0" : item.code === "91" || item.code === "96" ? "1px solid #fca5a5" : "1px solid #cbd5e1",
                      }}
                    >
                      {item.code}
                    </span>
                  </td>
                  <td>
                    <strong style={{ color: "#0f172a", fontSize: "0.92rem", display: "block" }}>{item.label}</strong>
                    <span
                      className={getCategoryBadgeClass(item.category)}
                      style={{
                        fontSize: "0.68rem",
                        marginTop: "0.35rem",
                        background: item.category === "TECHNIQUE_RESEAU" ? "#fee2e2" : undefined,
                        color: item.category === "TECHNIQUE_RESEAU" ? "#991b1b" : undefined,
                      }}
                    >
                      {item.category.replace("_", " ")}
                    </span>
                  </td>
                  <td>
                    <p style={{ fontSize: "0.88rem", color: "#334155", lineHeight: "1.4" }}>
                      {item.meaning}
                    </p>
                  </td>
                  <td>
                    <div
                      style={{
                        fontSize: "0.84rem",
                        color: "#0f172a",
                        background: "#f8fafc",
                        padding: "0.6rem 0.8rem",
                        borderRadius: "8px",
                        borderLeft: "3px solid #111827",
                      }}
                    >
                      {item.impactIncident}
                    </div>
                  </td>
                  <td>
                    <p style={{ fontSize: "0.84rem", color: "#e60028", fontWeight: 600 }}>
                      👉 {item.recommendedAction}
                    </p>
                  </td>
                  <td style={{ textAlign: "right" }}>
                    <Link
                      href={`/knowledge?search=${item.code}`}
                      className="btn-secondary"
                      style={{ padding: "0.35rem 0.65rem", fontSize: "0.78rem", whiteSpace: "nowrap" }}
                    >
                      Filtrer cas →
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
