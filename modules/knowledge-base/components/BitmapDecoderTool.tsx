"use client";

import { useState, useMemo } from "react";
import { decodeIsoBitmap, ISO_DE_DEFINITIONS } from "../data/iso-bitmap-decoder";

const SAMPLE_BITMAPS = [
  { label: "Trame Retrait GAB nominal (0200)", hex: "7238200108E18000", desc: "Bitmap primaire (64 bits) avec DE2, DE3, DE4, DE11, DE14, DE22, DE25, DE35, DE41, DE42, DE52" },
  { label: "Trame EMV avec Bitmap Étendu (128 bits)", hex: "B238200108E180000000000000000020", desc: "Bit 1 actif -> Bitmap secondaire présent avec DE55 (EMV) et DE128" },
  { label: "Echo Test Réseau (0800)", hex: "0200000000000002", desc: "Bitmap DE7 (Date/Time) et DE70 (Network Info Code)" },
];

export function BitmapDecoderTool() {
  const [inputHex, setInputHex] = useState<string>("7238200108E18000");
  const [filterCategory, setFilterCategory] = useState<string>("ALL");
  const [searchTerm, setSearchTerm] = useState<string>("");

  const decoded = useMemo(() => {
    return decodeIsoBitmap(inputHex);
  }, [inputHex]);

  const filteredFields = useMemo(() => {
    return decoded.presentFields.filter((item) => {
      const q = searchTerm.toLowerCase().trim();
      const spec = item.spec;
      const matchSearch =
        !q ||
        `de${item.de}`.includes(q) ||
        item.de.toString().includes(q) ||
        (spec && spec.name.toLowerCase().includes(q)) ||
        (spec && spec.description.toLowerCase().includes(q)) ||
        (spec && spec.format.toLowerCase().includes(q));

      const matchCategory =
        filterCategory === "ALL" || (spec && spec.category === filterCategory);

      return matchSearch && matchCategory;
    });
  }, [decoded, searchTerm, filterCategory]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.75rem" }}>
      {/* En-tête */}
      <div className="hero-search">
        <div>
          <p className="eyebrow accent" style={{ color: "#34d399" }}>OUTIL D&apos;INGÉNIERIE MONÉTIQUE</p>
          <h2 style={{ fontSize: "1.4rem", fontWeight: 800 }}>Décodeur de Bitmaps ISO 8583 (Primaire &amp; Secondaire)</h2>
          <p style={{ fontSize: "0.92rem", color: "#94a3b8", marginTop: "0.3rem" }}>
            Saisissez un Bitmap hexadécimal (16 ou 32 octets) ou binaire pour extraire immédiatement la liste exacte des Data Elements (DE) présents dans la trame monétique.
          </p>
        </div>
      </div>

      {/* Zone de saisie & Exemples */}
      <div className="card" style={{ display: "flex", flexDirection: "column", gap: "1.25rem", background: "#ffffff", border: "1px solid #e2e8f0" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.75rem" }}>
          <label style={{ fontWeight: 700, fontSize: "0.95rem", color: "#0f172a" }}>
            Saisie du Bitmap (Hexadécimal ou Binaire) :
          </label>
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            <span style={{ fontSize: "0.82rem", color: "#64748b", alignSelf: "center", fontWeight: 600 }}>Exemples :</span>
            {SAMPLE_BITMAPS.map((sample, idx) => (
              <button
                key={idx}
                onClick={() => setInputHex(sample.hex)}
                className="btn-ghost"
                style={{ fontSize: "0.8rem", padding: "0.3rem 0.65rem", background: "#f8fafc", border: "1px solid #cbd5e1" }}
                title={sample.desc}
              >
                {sample.label}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", gap: "0.75rem" }}>
          <div style={{ position: "relative", flex: 1 }}>
            <input
              type="text"
              className="input"
              value={inputHex}
              onChange={(e) => setInputHex(e.target.value)}
              placeholder="Ex: 7238200108E18000 ou B238200108E18000..."
              style={{
                fontFamily: "var(--font-mono, monospace)",
                fontSize: "1.05rem",
                fontWeight: 700,
                letterSpacing: "1px",
                color: "#047857",
                background: "#f0fdf4",
                border: "2px solid #a7f3d0",
              }}
            />
          </div>
          <button
            onClick={() => setInputHex("")}
            className="btn-ghost"
            style={{ padding: "0 1.25rem", fontWeight: 600 }}
          >
            Effacer
          </button>
        </div>

        {decoded.warnings.length > 0 && (
          <div style={{ background: "#fef3c7", border: "1px solid #fde68a", padding: "0.75rem 1rem", borderRadius: "8px" }}>
            {decoded.warnings.map((w, idx) => (
              <p key={idx} style={{ color: "#92400e", fontSize: "0.85rem", margin: 0, fontWeight: 500 }}>⚠️ {w}</p>
            ))}
          </div>
        )}
      </div>

      {/* Synthèse Décodage */}
      <div className="grid-metrics">
        <div className="metric-card">
          <span className="metric-label">Format Détecté</span>
          <p className="metric-value" style={{ color: "#0369a1" }}>
            {decoded.isSecondaryPresent ? "Primaire + Secondaire" : "Primaire Seul"}
          </p>
          <span className="text-muted" style={{ fontSize: "0.8rem", color: "#64748b" }}>
            {decoded.totalBits} bits ({decoded.normalizedHex.length / 2} octets)
          </span>
        </div>

        <div className="metric-card">
          <span className="metric-label">Champs Présents</span>
          <p className="metric-value" style={{ color: "#059669" }}>
            {decoded.presentFields.length} DE
          </p>
          <span className="text-muted" style={{ fontSize: "0.8rem", color: "#64748b" }}>
            {decoded.isSecondaryPresent ? "Inclus DE1 (Extension)" : "Champs DE1 à DE64"}
          </span>
        </div>

        <div className="metric-card">
          <span className="metric-label">Bit 1 (Secondary Map)</span>
          <p className="metric-value" style={{ color: decoded.isSecondaryPresent ? "#059669" : "#64748b" }}>
            {decoded.isSecondaryPresent ? "ACTIF (1)" : "INACTIF (0)"}
          </p>
          <span className="text-muted" style={{ fontSize: "0.8rem", color: "#64748b" }}>
            {decoded.isSecondaryPresent ? "Trame étendue (DE65-128)" : "Trame standard"}
          </span>
        </div>
      </div>

      {/* Grille Visuelle des Bits (64 ou 128 bits) */}
      <div className="card" style={{ display: "flex", flexDirection: "column", gap: "1rem", background: "#ffffff", border: "1px solid #e2e8f0" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h3 style={{ fontSize: "1.05rem", fontWeight: 700, color: "#0f172a" }}>
            Matrice Binaire du Bitmap (Visualisation des bits 1 à {decoded.totalBits})
          </h3>
          <span style={{ fontSize: "0.82rem", color: "#64748b", fontWeight: 500 }}>
            Vert = Présent (1) | Gris = Absent (0)
          </span>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(36px, 1fr))",
            gap: "5px",
            background: "#f8fafc",
            padding: "1rem",
            borderRadius: "8px",
            border: "1px solid #e2e8f0",
          }}
        >
          {Array.from({ length: decoded.totalBits }).map((_, idx) => {
            const deNum = idx + 1;
            const isSet = decoded.binaryString[idx] === "1";
            return (
              <div
                key={deNum}
                title={`DE${deNum}: ${isSet ? "Présent" : "Absent"}${ISO_DE_DEFINITIONS[deNum] ? " - " + ISO_DE_DEFINITIONS[deNum].name : ""}`}
                style={{
                  height: "36px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  background: isSet ? "#ecfdf5" : "#ffffff",
                  border: isSet ? "1.5px solid #059669" : "1px solid #e2e8f0",
                  color: isSet ? "#047857" : "#94a3b8",
                  borderRadius: "4px",
                  fontSize: "0.75rem",
                  fontWeight: 800,
                  cursor: isSet ? "pointer" : "default",
                  transition: "all 0.15s ease",
                  boxShadow: isSet ? "0 1px 3px rgba(5, 150, 105, 0.2)" : "none",
                }}
                onClick={() => {
                  if (isSet) setSearchTerm(`de${deNum}`);
                }}
              >
                <span>{deNum}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Liste Détaillée des Champs DE Présents */}
      <div className="card" style={{ display: "flex", flexDirection: "column", gap: "1.25rem", background: "#ffffff", border: "1px solid #e2e8f0" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#0f172a" }}>
              Détail des {decoded.presentFields.length} Champs DE Détectés
            </h3>
            <p style={{ fontSize: "0.85rem", color: "#64748b" }}>
              Spécifications formelles ISO 8583 associées aux bits activés
            </p>
          </div>

          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
            <input
              type="text"
              placeholder="Filtrer DE (ex: DE2, PIN, montant)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input"
              style={{ width: "240px", fontSize: "0.85rem", padding: "0.5rem 0.85rem", background: "#ffffff", border: "1px solid #cbd5e1" }}
            />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="input"
              style={{ fontSize: "0.85rem", padding: "0.5rem 0.85rem", background: "#ffffff", border: "1px solid #cbd5e1", width: "auto" }}
            >
              <option value="ALL">Toutes les catégories</option>
              <option value="IDENTIFICATION">Identification</option>
              <option value="MONTANT">Montants &amp; Devises</option>
              <option value="TRACE">Trace &amp; Audit (STAN/RRN)</option>
              <option value="DONNEES_CARTE">Données Carte &amp; EMV</option>
              <option value="TERMINAL">Terminal &amp; Commerçant</option>
              <option value="SECURITE">Sécurité &amp; Cryptographie (PIN/MAC)</option>
              <option value="RESEAU">Réseau &amp; Routage</option>
            </select>
          </div>
        </div>

        <div className="table-wrapper" style={{ border: "1px solid #e2e8f0", borderRadius: "12px", boxShadow: "0 1px 3px rgba(0,0,0,0.05)", overflow: "hidden" }}>
          <table>
            <thead>
              <tr style={{ background: "#f8fafc", borderBottom: "2px solid #e2e8f0" }}>
                <th style={{ width: "90px", padding: "1rem 1.25rem", color: "#0f172a", fontWeight: 800, fontSize: "0.8rem", letterSpacing: "0.05em" }}>ÉLÉMENT</th>
                <th style={{ width: "220px", padding: "1rem 1.25rem", color: "#0f172a", fontWeight: 800, fontSize: "0.8rem", letterSpacing: "0.05em" }}>NOM NORMATIF</th>
                <th style={{ width: "110px", padding: "1rem 1.25rem", color: "#0f172a", fontWeight: 800, fontSize: "0.8rem", letterSpacing: "0.05em" }}>FORMAT</th>
                <th style={{ width: "140px", padding: "1rem 1.25rem", color: "#0f172a", fontWeight: 800, fontSize: "0.8rem", letterSpacing: "0.05em" }}>CATÉGORIE</th>
                <th style={{ width: "130px", padding: "1rem 1.25rem", color: "#0f172a", fontWeight: 800, fontSize: "0.8rem", letterSpacing: "0.05em" }}>POSITION</th>
                <th style={{ padding: "1rem 1.25rem", color: "#0f172a", fontWeight: 800, fontSize: "0.8rem", letterSpacing: "0.05em" }}>RÔLE MONÉTIQUE &amp; DESCRIPTION</th>
              </tr>
            </thead>
            <tbody>
              {filteredFields.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: "center", padding: "3rem", color: "#64748b", fontSize: "0.95rem" }}>
                    Aucun champ DE ne correspond à vos critères de recherche.
                  </td>
                </tr>
              ) : (
                filteredFields.map((field) => {
                  const spec = field.spec;
                  
                  // Palette par catégorie
                  const getCatStyle = (cat?: string) => {
                    switch (cat) {
                      case "DONNEES_CARTE":
                        return { bg: "#ecfdf5", color: "#047857", border: "#a7f3d0" };
                      case "TRACE":
                        return { bg: "#eff6ff", color: "#1d4ed8", border: "#bfdbfe" };
                      case "MONTANT":
                        return { bg: "#fef3c7", color: "#b45309", border: "#fde68a" };
                      case "SECURITE":
                        return { bg: "#fdf2f8", color: "#be185d", border: "#fbcfe8" };
                      case "TERMINAL":
                        return { bg: "#f5f3ff", color: "#6d28d9", border: "#ddd6fe" };
                      case "IDENTIFICATION":
                        return { bg: "#f0fdfa", color: "#0f766e", border: "#99f6e4" };
                      default:
                        return { bg: "#f1f5f9", color: "#334155", border: "#cbd5e1" };
                    }
                  };

                  const catStyle = getCatStyle(spec?.category);

                  return (
                    <tr
                      key={field.de}
                      style={{
                        borderBottom: "1px solid #f1f5f9",
                        transition: "background 0.15s ease",
                      }}
                    >
                      {/* Badge DE */}
                      <td style={{ padding: "1rem 1.25rem", verticalAlign: "middle" }}>
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            background: "#ecfdf5",
                            color: "#047857",
                            border: "1.5px solid #059669",
                            padding: "0.3rem 0.65rem",
                            borderRadius: "6px",
                            fontWeight: 900,
                            fontSize: "0.85rem",
                            fontFamily: "monospace",
                            boxShadow: "0 1px 2px rgba(5, 150, 105, 0.15)",
                          }}
                        >
                          DE {field.de}
                        </span>
                      </td>

                      {/* Nom normatif */}
                      <td style={{ padding: "1rem 1.25rem", verticalAlign: "middle" }}>
                        <span style={{ fontWeight: 700, color: "#0f172a", fontSize: "0.92rem", display: "block" }}>
                          {spec ? spec.name : `Champ Propriétaire DE ${field.de}`}
                        </span>
                        {spec?.lengthType && (
                          <span style={{ fontSize: "0.75rem", color: "#64748b", fontWeight: 500 }}>
                            {spec.lengthType} (Max: {spec.maxLength})
                          </span>
                        )}
                      </td>

                      {/* Format */}
                      <td style={{ padding: "1rem 1.25rem", verticalAlign: "middle" }}>
                        <code
                          style={{
                            fontSize: "0.82rem",
                            fontWeight: 700,
                            color: "#0369a1",
                            background: "#f0f9ff",
                            border: "1px solid #bae6fd",
                            padding: "0.25rem 0.55rem",
                            borderRadius: "6px",
                            fontFamily: "monospace",
                          }}
                        >
                          {spec ? spec.format : "ans"}
                        </code>
                      </td>

                      {/* Catégorie */}
                      <td style={{ padding: "1rem 1.25rem", verticalAlign: "middle" }}>
                        <span
                          style={{
                            display: "inline-block",
                            background: catStyle.bg,
                            color: catStyle.color,
                            border: `1px solid ${catStyle.border}`,
                            padding: "0.25rem 0.6rem",
                            borderRadius: "6px",
                            fontSize: "0.75rem",
                            fontWeight: 700,
                            letterSpacing: "0.02em",
                          }}
                        >
                          {spec ? spec.category.replace("_", " ") : "EXTERNE"}
                        </span>
                      </td>

                      {/* Position Octet / Bit */}
                      <td style={{ padding: "1rem 1.25rem", verticalAlign: "middle" }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.1rem" }}>
                          <span style={{ fontSize: "0.84rem", color: "#0f172a", fontWeight: 600 }}>
                            Octet {field.bytePosition}
                          </span>
                          <span style={{ fontSize: "0.75rem", color: "#64748b" }}>
                            bit {field.bitInByte} / 8
                          </span>
                        </div>
                      </td>

                      {/* Rôle & Description */}
                      <td style={{ padding: "1rem 1.25rem", verticalAlign: "middle" }}>
                        <p style={{ fontSize: "0.88rem", color: "#334155", lineHeight: 1.5, margin: 0, fontWeight: 450 }}>
                          {spec ? spec.description : "Élément de données privatif ou non renseigné dans la norme standard."}
                        </p>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
