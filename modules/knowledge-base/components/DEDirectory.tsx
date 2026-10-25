"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { DE_CATALOG, DE_FORMAT_GUIDES, DECategory, DEDefinition } from "../data/iso-de-reference";

export function DEDirectory({ initialSearch = "" }: { initialSearch?: string }) {
  const [search, setSearch] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [selectedBitmap, setSelectedBitmap] = useState<string>("ALL");
  const [selectedFormatType, setSelectedFormatType] = useState<string>("ALL");
  const [activeTab, setActiveTab] = useState<"CARDS" | "TABLE" | "RULES">("CARDS");

  const categories: Array<{ key: "ALL" | DECategory; label: string }> = [
    { key: "ALL", label: "Tous les champs" },
    { key: "DONNEES_CARTE", label: "Données Carte & EMV" },
    { key: "MONTANT", label: "Montants & Devises" },
    { key: "TRACE", label: "Trace & Audit (STAN/RRN)" },
    { key: "TERMINAL", label: "Terminal & Accepteur" },
    { key: "IDENTIFICATION", label: "Identification & Comptes" },
    { key: "SECURITE", label: "Sécurité & Crypto (PIN/MAC)" },
    { key: "RESEAU", label: "Réseau & Routage" },
  ];

  const filteredDEs = useMemo(() => {
    return DE_CATALOG.filter((item) => {
      const q = search.toLowerCase().trim();
      const matchSearch =
        !q ||
        item.code.toLowerCase().includes(q) ||
        `de ${item.de}`.includes(q) ||
        item.de.toString() === q ||
        item.name.toLowerCase().includes(q) ||
        item.frenchTitle.toLowerCase().includes(q) ||
        item.format.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.monetiqueRole.toLowerCase().includes(q) ||
        item.diagnosticAdvice.toLowerCase().includes(q) ||
        item.exampleValue.toLowerCase().includes(q);

      const matchCategory = selectedCategory === "ALL" || item.category === selectedCategory;
      const matchBitmap = selectedBitmap === "ALL" || item.bitmapBlock === selectedBitmap;
      const matchFormat =
        selectedFormatType === "ALL" ||
        (selectedFormatType === "PCI" ? Boolean(item.pciSensitive) : item.lengthType === selectedFormatType);

      return matchSearch && matchCategory && matchBitmap && matchFormat;
    });
  }, [search, selectedCategory, selectedBitmap, selectedFormatType]);

  const getCategoryStyle = (category: DECategory) => {
    switch (category) {
      case "DONNEES_CARTE":
        return { bg: "#ecfdf5", color: "#047857", border: "#a7f3d0", label: "CARTE & EMV" };
      case "MONTANT":
        return { bg: "#fef3c7", color: "#b45309", border: "#fde68a", label: "MONTANT & DEVISE" };
      case "TRACE":
        return { bg: "#eff6ff", color: "#1d4ed8", border: "#bfdbfe", label: "TRACE & AUDIT" };
      case "TERMINAL":
        return { bg: "#f5f3ff", color: "#6d28d9", border: "#ddd6fe", label: "TERMINAL / GAB / TPE" };
      case "IDENTIFICATION":
        return { bg: "#f0fdfa", color: "#0f766e", border: "#99f6e4", label: "IDENTIFICATION & CBS" };
      case "SECURITE":
        return { bg: "#fdf2f8", color: "#be185d", border: "#fbcfe8", label: "SÉCURITÉ & HSM" };
      case "RESEAU":
        return { bg: "#f1f5f9", color: "#334155", border: "#cbd5e1", label: "RÉSEAU & SWITCH" };
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.75rem" }}>
      {/* En-tête avec bannière hero-search */}
      <div className="hero-search">
        <div>
          <p className="eyebrow accent" style={{ color: "#34d399" }}>
            NORME ISO 8583 - DICTIONNAIRE DES CHAMPS DE DONNÉES
          </p>
          <h2 style={{ fontSize: "1.4rem", fontWeight: 800 }}>
            Référentiel des Champs DE (Data Elements DE1 à DE128)
          </h2>
          <p style={{ fontSize: "0.92rem", color: "#94a3b8", marginTop: "0.3rem" }}>
            Identifiez instantanément le format normatif, la description technique, le rôle exact dans la chaîne monétique (GAB/TPE → Switch → CBS) et la conduite de diagnostic d&apos;incident pour chaque champ ISO 8583.
          </p>
        </div>

        {/* Barre de recherche intégrée */}
        <div className="search-input-wrapper">
          <span style={{ fontSize: "1.2rem" }}>🔎</span>
          <input
            type="text"
            placeholder="Rechercher par champ (ex: DE2, DE3, DE39, DE55, DE90), mot-clé (PAN, STAN, RRN, PIN, EMV, extourne, compte CBS)..."
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

        {/* Filtres par famille, bitmap et format */}
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

          <div style={{ marginLeft: "auto", display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            <select
              value={selectedBitmap}
              onChange={(e) => setSelectedBitmap(e.target.value)}
              style={{
                background: "#1e293b",
                color: "#f8fafc",
                border: "1px solid #334155",
                borderRadius: "6px",
                padding: "0.4rem 0.75rem",
                fontSize: "0.82rem",
                cursor: "pointer",
              }}
            >
              <option value="ALL">Tous Bitmaps (DE1–128)</option>
              <option value="PRIMARY">Bitmap Primaire (DE1–DE64)</option>
              <option value="SECONDARY">Bitmap Secondaire (DE65–DE128)</option>
            </select>

            <select
              value={selectedFormatType}
              onChange={(e) => setSelectedFormatType(e.target.value)}
              style={{
                background: "#1e293b",
                color: "#f8fafc",
                border: "1px solid #334155",
                borderRadius: "6px",
                padding: "0.4rem 0.75rem",
                fontSize: "0.82rem",
                cursor: "pointer",
              }}
            >
              <option value="ALL">Tous Formats</option>
              <option value="FIXED">Longueur Fixe (FIXED)</option>
              <option value="LLVAR">Variable 2 pos. (LLVAR)</option>
              <option value="LLLVAR">Variable 3 pos. (LLLVAR)</option>
              <option value="PCI">🔒 Données sensibles PCI-DSS</option>
            </select>
          </div>
        </div>
      </div>

      {/* Onglets : Vue Fiches Détaillées / Vue Tableau Synthétique / Règles de Formatage */}
      <div style={{ display: "flex", gap: "0.75rem", borderBottom: "2px solid #e2e8f0", paddingBottom: "0.5rem", flexWrap: "wrap" }}>
        <button
          onClick={() => setActiveTab("CARDS")}
          className={activeTab === "CARDS" ? "btn-primary" : "btn-ghost"}
          style={{ fontSize: "0.9rem" }}
        >
          📖 Fiches Détaillées &amp; Rôles ({filteredDEs.length})
        </button>
        <button
          onClick={() => setActiveTab("TABLE")}
          className={activeTab === "TABLE" ? "btn-primary" : "btn-ghost"}
          style={{ fontSize: "0.9rem" }}
        >
          📋 Vue Tableau Synthétique ({filteredDEs.length})
        </button>
        <button
          onClick={() => setActiveTab("RULES")}
          className={activeTab === "RULES" ? "btn-primary" : "btn-ghost"}
          style={{ fontSize: "0.9rem" }}
        >
          🧩 Anatomie des Formats &amp; Cadrage ISO 8583
        </button>
      </div>

      {activeTab === "RULES" ? (
        /* VUE ANATOMIE DES FORMATS ISO 8583 */
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <div className="card" style={{ background: "#ffffff", border: "1px solid #e2e8f0" }}>
            <h3 style={{ fontSize: "1.1rem", fontWeight: 800, color: "#0f172a", marginBottom: "0.5rem" }}>
              Comment lire la spécification d&apos;un champ Data Element (DE) ?
            </h3>
            <p style={{ fontSize: "0.92rem", color: "#475569", lineHeight: 1.6, margin: 0 }}>
              Chaque champ DE de la norme ISO 8583 est défini par son <b>numéro de bit (1 à 128)</b> dans le Bitmap, son <b>alphabet de données</b> (<code style={{ color: "#0369a1", fontWeight: 700 }}>n</code>, <code style={{ color: "#0369a1", fontWeight: 700 }}>an</code>, <code style={{ color: "#0369a1", fontWeight: 700 }}>ans</code>, <code style={{ color: "#0369a1", fontWeight: 700 }}>b</code>, <code style={{ color: "#0369a1", fontWeight: 700 }}>z</code>) et son <b>mode d&apos;encodage de longueur</b> (<code style={{ color: "#059669", fontWeight: 700 }}>FIXED</code>, <code style={{ color: "#059669", fontWeight: 700 }}>LLVAR</code>, <code style={{ color: "#059669", fontWeight: 700 }}>LLLVAR</code>).
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1.25rem" }}>
            {DE_FORMAT_GUIDES.map((guide) => (
              <div
                key={guide.symbol}
                className="card"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.85rem",
                  background: "#ffffff",
                  border: "1px solid #e2e8f0",
                  borderTop: "4px solid #059669",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "0.5rem" }}>
                  <h4 style={{ fontSize: "1rem", fontWeight: 800, color: "#0f172a", margin: 0 }}>
                    {guide.title}
                  </h4>
                  <code
                    style={{
                      background: "#ecfdf5",
                      color: "#047857",
                      border: "1px solid #a7f3d0",
                      padding: "0.2rem 0.55rem",
                      borderRadius: "6px",
                      fontWeight: 800,
                      fontSize: "0.82rem",
                    }}
                  >
                    {guide.symbol}
                  </code>
                </div>

                <p style={{ fontSize: "0.88rem", color: "#334155", margin: 0, lineHeight: 1.5 }}>
                  {guide.meaning}
                </p>

                <div style={{ display: "flex", flexDirection: "column", gap: "0.45rem" }}>
                  {guide.examples.map((ex, idx) => (
                    <div
                      key={idx}
                      style={{
                        background: "#f8fafc",
                        padding: "0.55rem 0.75rem",
                        borderRadius: "6px",
                        border: "1px solid #e2e8f0",
                        fontSize: "0.82rem",
                        color: "#0f172a",
                        fontFamily: "monospace",
                      }}
                    >
                      {ex}
                    </div>
                  ))}
                </div>

                <div
                  style={{
                    marginTop: "auto",
                    background: "#fffbeb",
                    border: "1px solid #fde68a",
                    padding: "0.65rem 0.8rem",
                    borderRadius: "6px",
                    fontSize: "0.82rem",
                    color: "#92400e",
                    fontWeight: 500,
                  }}
                >
                  ⚡ <b>Règle d&apos;exploitation :</b> {guide.ruleDetails}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : activeTab === "TABLE" ? (
        /* VUE TABLEAU SYNTHÉTIQUE */
        <>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.9rem", color: "#64748b" }}>
            <span>
              <strong>{filteredDEs.length}</strong> champ{filteredDEs.length > 1 ? "s" : ""} DE référencé{filteredDEs.length > 1 ? "s" : ""}
            </span>
            <span style={{ fontSize: "0.82rem" }}>
              Bitmap Primaire : <b>DE1 à DE64</b> · Bitmap Secondaire : <b>DE65 à DE128</b>
            </span>
          </div>

          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th style={{ width: "90px" }}>Champ</th>
                  <th style={{ width: "230px" }}>Nom Normatif &amp; Libellé</th>
                  <th style={{ width: "130px" }}>Format &amp; Taille</th>
                  <th>Description Technique</th>
                  <th>Rôle dans la Chaîne Monétique</th>
                  <th>Conduite de Diagnostic</th>
                  <th style={{ textAlign: "right", width: "120px" }}>Cas Associés</th>
                </tr>
              </thead>
              <tbody>
                {filteredDEs.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ textAlign: "center", padding: "3rem", color: "#64748b" }}>
                      Aucun champ DE ne correspond à votre recherche &quot;{search}&quot;.
                    </td>
                  </tr>
                ) : (
                  filteredDEs.map((item) => {
                    const catStyle = getCategoryStyle(item.category);
                    return (
                      <tr key={item.de}>
                        <td>
                          <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem", alignItems: "flex-start" }}>
                            <span
                              style={{
                                display: "inline-block",
                                background: item.bitmapBlock === "PRIMARY" ? "#ecfdf5" : "#eff6ff",
                                color: item.bitmapBlock === "PRIMARY" ? "#047857" : "#1d4ed8",
                                border: item.bitmapBlock === "PRIMARY" ? "1px solid #a7f3d0" : "1px solid #bfdbfe",
                                padding: "0.3rem 0.6rem",
                                borderRadius: "6px",
                                fontWeight: 900,
                                fontSize: "0.92rem",
                                fontFamily: "monospace",
                              }}
                            >
                              {item.code}
                            </span>
                            {item.pciSensitive && (
                              <span
                                style={{
                                  fontSize: "0.65rem",
                                  background: "#fee2e2",
                                  color: "#991b1b",
                                  padding: "0.1rem 0.4rem",
                                  borderRadius: "4px",
                                  fontWeight: 700,
                                }}
                              >
                                🔒 PCI-DSS
                              </span>
                            )}
                          </div>
                        </td>
                        <td>
                          <strong style={{ color: "#0f172a", fontSize: "0.9rem", display: "block" }}>
                            {item.frenchTitle}
                          </strong>
                          <span style={{ fontSize: "0.78rem", color: "#64748b", display: "block", marginTop: "0.15rem" }}>
                            {item.name}
                          </span>
                          <span
                            style={{
                              display: "inline-block",
                              marginTop: "0.35rem",
                              background: catStyle.bg,
                              color: catStyle.color,
                              border: `1px solid ${catStyle.border}`,
                              padding: "0.15rem 0.5rem",
                              borderRadius: "4px",
                              fontSize: "0.68rem",
                              fontWeight: 700,
                            }}
                          >
                            {catStyle.label}
                          </span>
                        </td>
                        <td>
                          <code
                            style={{
                              fontSize: "0.84rem",
                              fontWeight: 700,
                              color: "#0369a1",
                              background: "#f0f9ff",
                              border: "1px solid #bae6fd",
                              padding: "0.2rem 0.5rem",
                              borderRadius: "5px",
                              fontFamily: "monospace",
                              display: "inline-block",
                            }}
                          >
                            {item.format}
                          </code>
                          <span style={{ display: "block", fontSize: "0.75rem", color: "#64748b", marginTop: "0.25rem", fontWeight: 600 }}>
                            {item.lengthType} (max {item.maxLength})
                          </span>
                        </td>
                        <td>
                          <p style={{ fontSize: "0.85rem", color: "#334155", lineHeight: 1.45, margin: 0 }}>
                            {item.description}
                          </p>
                        </td>
                        <td>
                          <div
                            style={{
                              fontSize: "0.84rem",
                              color: "#0f172a",
                              background: "#f8fafc",
                              padding: "0.6rem 0.75rem",
                              borderRadius: "8px",
                              borderLeft: "3px solid #059669",
                              lineHeight: 1.45,
                            }}
                          >
                            {item.monetiqueRole}
                          </div>
                        </td>
                        <td>
                          <p style={{ fontSize: "0.83rem", color: "#92400e", lineHeight: 1.45, margin: 0, fontWeight: 500 }}>
                            ⚡ {item.diagnosticAdvice}
                          </p>
                        </td>
                        <td style={{ textAlign: "right" }}>
                          <Link
                            href={`/hub/knowledge?search=${item.code}`}
                            className="btn-secondary"
                            style={{ padding: "0.35rem 0.65rem", fontSize: "0.78rem", whiteSpace: "nowrap" }}
                          >
                            Filtrer cas →
                          </Link>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        /* VUE FICHES DÉTAILLÉES DES CHAMPS DE */
        <>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.5rem" }}>
            <span style={{ fontSize: "0.9rem", color: "#64748b" }}>
              <b>{filteredDEs.length}</b> champ(s) Data Element affiché(s) sur {DE_CATALOG.length}
            </span>
            <div style={{ display: "flex", gap: "0.75rem", fontSize: "0.8rem", color: "#64748b" }}>
              <Link href="/hub/bitmap" style={{ color: "#059669", fontWeight: 700, textDecoration: "none" }}>
                🧮 Ouvrir le Décodeur Bitmap →
              </Link>
              <Link href="/hub/parser" style={{ color: "#0369a1", fontWeight: 700, textDecoration: "none" }}>
                🔍 Ouvrir le Parseur Trame ISO →
              </Link>
            </div>
          </div>

          {filteredDEs.length === 0 ? (
            <div className="card" style={{ textAlign: "center", padding: "3rem", color: "#64748b", background: "#ffffff" }}>
              Aucun champ DE ne correspond à votre recherche &quot;{search}&quot;.
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(380px, 1fr))", gap: "1.25rem" }}>
              {filteredDEs.map((item: DEDefinition) => {
                const catStyle = getCategoryStyle(item.category);
                return (
                  <div
                    key={item.de}
                    className="card"
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      gap: "1rem",
                      background: "#ffffff",
                      border: "1px solid #e2e8f0",
                      borderLeft: `4px solid ${item.bitmapBlock === "PRIMARY" ? "#059669" : "#2563eb"}`,
                    }}
                  >
                    {/* En-tête de la carte DE */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.55rem" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "0.5rem", flexWrap: "wrap" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
                          <span
                            style={{
                              fontSize: "1.15rem",
                              fontWeight: 900,
                              fontFamily: "monospace",
                              color: item.bitmapBlock === "PRIMARY" ? "#047857" : "#1d4ed8",
                              background: item.bitmapBlock === "PRIMARY" ? "#ecfdf5" : "#eff6ff",
                              padding: "0.25rem 0.65rem",
                              borderRadius: "6px",
                              border: item.bitmapBlock === "PRIMARY" ? "1px solid #a7f3d0" : "1px solid #bfdbfe",
                            }}
                          >
                            {item.code}
                          </span>
                          <span
                            style={{
                              background: catStyle.bg,
                              color: catStyle.color,
                              border: `1px solid ${catStyle.border}`,
                              padding: "0.2rem 0.55rem",
                              borderRadius: "6px",
                              fontSize: "0.72rem",
                              fontWeight: 700,
                            }}
                          >
                            {catStyle.label}
                          </span>
                          {item.pciSensitive && (
                            <span
                              style={{
                                background: "#fee2e2",
                                color: "#991b1b",
                                border: "1px solid #fca5a5",
                                padding: "0.2rem 0.5rem",
                                borderRadius: "6px",
                                fontSize: "0.7rem",
                                fontWeight: 800,
                              }}
                            >
                              🔒 PCI-DSS
                            </span>
                          )}
                        </div>

                        <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                          <code
                            style={{
                              fontSize: "0.8rem",
                              fontWeight: 700,
                              color: "#0369a1",
                              background: "#f0f9ff",
                              border: "1px solid #bae6fd",
                              padding: "0.2rem 0.5rem",
                              borderRadius: "5px",
                              fontFamily: "monospace",
                            }}
                          >
                            {item.format}
                          </code>
                          <span
                            style={{
                              fontSize: "0.72rem",
                              fontWeight: 700,
                              color: "#475569",
                              background: "#f1f5f9",
                              padding: "0.2rem 0.45rem",
                              borderRadius: "5px",
                            }}
                          >
                            {item.lengthType}
                          </span>
                        </div>
                      </div>

                      <div>
                        <h3 style={{ fontSize: "1.04rem", fontWeight: 800, color: "#0f172a", margin: "0.15rem 0 0 0" }}>
                          {item.frenchTitle}
                        </h3>
                        <span style={{ fontSize: "0.8rem", color: "#64748b", fontWeight: 600 }}>
                          Norme ISO : {item.name} · Bit #{item.de} ({item.bitmapBlock === "PRIMARY" ? "Bitmap Primaire" : "Bitmap Secondaire"})
                        </span>
                      </div>

                      {/* Description technique */}
                      <p style={{ fontSize: "0.88rem", color: "#334155", lineHeight: 1.5, margin: 0 }}>
                        {item.description}
                      </p>
                    </div>

                    {/* Bloc Rôle Monétique + Exemple + Diagnostic */}
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "0.7rem",
                        background: "#f8fafc",
                        padding: "0.9rem",
                        borderRadius: "8px",
                        border: "1px solid #e2e8f0",
                      }}
                    >
                      <div>
                        <span style={{ fontSize: "0.74rem", textTransform: "uppercase", fontWeight: 800, color: "#047857" }}>
                          🎯 Rôle dans la Chaîne Monétique &amp; CBS :
                        </span>
                        <p style={{ fontSize: "0.85rem", color: "#0f172a", margin: "0.2rem 0 0 0", lineHeight: 1.45, fontWeight: 500 }}>
                          {item.monetiqueRole}
                        </p>
                      </div>

                      <div>
                        <span style={{ fontSize: "0.73rem", textTransform: "uppercase", fontWeight: 700, color: "#64748b" }}>
                          Exemple de Valeur / Trame :
                        </span>
                        <div
                          style={{
                            marginTop: "0.25rem",
                            background: "#ffffff",
                            border: "1px solid #cbd5e1",
                            padding: "0.4rem 0.65rem",
                            borderRadius: "6px",
                            fontFamily: "monospace",
                            fontSize: "0.8rem",
                            color: "#0369a1",
                            fontWeight: 600,
                            wordBreak: "break-all",
                          }}
                        >
                          {item.exampleValue}
                        </div>
                      </div>

                      <div>
                        <span style={{ fontSize: "0.74rem", textTransform: "uppercase", fontWeight: 800, color: "#b45309" }}>
                          ⚡ Conduite d&apos;Analyse Incident :
                        </span>
                        <p style={{ fontSize: "0.83rem", color: "#92400e", margin: "0.2rem 0 0 0", lineHeight: 1.45, fontWeight: 500 }}>
                          {item.diagnosticAdvice}
                        </p>
                      </div>
                    </div>

                    {/* Pied de carte : MTI typiques & liens */}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        borderTop: "1px solid #e2e8f0",
                        paddingTop: "0.75rem",
                        flexWrap: "wrap",
                        gap: "0.5rem",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "0.3rem", flexWrap: "wrap" }}>
                        <span style={{ fontSize: "0.72rem", color: "#64748b", fontWeight: 600 }}>MTI :</span>
                        {item.typicalMtis.map((mti) => (
                          <Link
                            key={mti}
                            href={`/hub/mti?search=${mti}`}
                            style={{
                              fontSize: "0.72rem",
                              fontFamily: "monospace",
                              fontWeight: 700,
                              background: "#f1f5f9",
                              color: "#334155",
                              padding: "0.12rem 0.4rem",
                              borderRadius: "4px",
                              textDecoration: "none",
                              border: "1px solid #cbd5e1",
                            }}
                          >
                            {mti}
                          </Link>
                        ))}
                      </div>

                      <div style={{ display: "flex", gap: "0.6rem", alignItems: "center" }}>
                        {item.de === 39 && (
                          <Link
                            href="/hub/de39"
                            style={{ fontSize: "0.78rem", color: "#e60028", textDecoration: "none", fontWeight: 700 }}
                          >
                            Catalogue DE39 ➜
                          </Link>
                        )}
                        {item.de === 55 && (
                          <Link
                            href="/hub/emv"
                            style={{ fontSize: "0.78rem", color: "#0369a1", textDecoration: "none", fontWeight: 700 }}
                          >
                            Décodeur EMV ➜
                          </Link>
                        )}
                        <Link
                          href={`/hub/knowledge?search=${item.code}`}
                          className="btn-ghost"
                          style={{ fontSize: "0.8rem", color: "#059669", textDecoration: "none", fontWeight: 600 }}
                        >
                          Voir incidents associés ➜
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}
