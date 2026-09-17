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
      <div className="card" style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.75rem" }}>
          <label style={{ fontWeight: 700, fontSize: "0.95rem", color: "#e2e8f0" }}>
            Saisie du Bitmap (Hexadécimal ou Binaire) :
          </label>
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            <span style={{ fontSize: "0.82rem", color: "#94a3b8", alignSelf: "center" }}>Exemples rapides :</span>
            {SAMPLE_BITMAPS.map((sample, idx) => (
              <button
                key={idx}
                onClick={() => setInputHex(sample.hex)}
                className="btn-ghost"
                style={{ fontSize: "0.78rem", padding: "0.25rem 0.6rem" }}
                title={sample.desc}
              >
                {sample.label}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", gap: "0.75rem" }}>
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
              letterSpacing: "1.5px",
              color: "#34d399",
              background: "#0f172a",
              border: "1px solid #334155",
            }}
          />
          <button
            onClick={() => setInputHex("")}
            className="btn-ghost"
            style={{ padding: "0 1rem" }}
          >
            Effacer
          </button>
        </div>

        {decoded.warnings.length > 0 && (
          <div style={{ background: "rgba(245, 158, 11, 0.1)", border: "1px solid #f59e0b", padding: "0.75rem 1rem", borderRadius: "8px" }}>
            {decoded.warnings.map((w, idx) => (
              <p key={idx} style={{ color: "#fbbf24", fontSize: "0.85rem", margin: 0 }}>⚠️ {w}</p>
            ))}
          </div>
        )}
      </div>

      {/* Synthèse Décodage */}
      <div className="grid-metrics">
        <div className="metric-card">
          <span className="metric-label">Format Détecté</span>
          <p className="metric-value" style={{ color: "#38bdf8" }}>
            {decoded.isSecondaryPresent ? "Primaire + Secondaire" : "Primaire Seul"}
          </p>
          <span className="text-muted" style={{ fontSize: "0.8rem" }}>
            {decoded.totalBits} bits ({decoded.normalizedHex.length / 2} octets)
          </span>
        </div>

        <div className="metric-card">
          <span className="metric-label">Champs Présents</span>
          <p className="metric-value" style={{ color: "#34d399" }}>
            {decoded.presentFields.length} DE
          </p>
          <span className="text-muted" style={{ fontSize: "0.8rem" }}>
            {decoded.isSecondaryPresent ? "Inclus DE1 (Extension)" : "Champs DE1 à DE64"}
          </span>
        </div>

        <div className="metric-card">
          <span className="metric-label">Bit 1 (Secondary Map)</span>
          <p className="metric-value" style={{ color: decoded.isSecondaryPresent ? "#10b981" : "#94a3b8" }}>
            {decoded.isSecondaryPresent ? "ACTIF (1)" : "INACTIF (0)"}
          </p>
          <span className="text-muted" style={{ fontSize: "0.8rem" }}>
            {decoded.isSecondaryPresent ? "Trame étendue (DE65-128)" : "Trame standard"}
          </span>
        </div>
      </div>

      {/* Grille Visuelle des Bits (64 ou 128 bits) */}
      <div className="card" style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h3 style={{ fontSize: "1.05rem", fontWeight: 700, color: "#f8fafc" }}>
            Matrice Binaire du Bitmap (Visualisation des bits 1 à {decoded.totalBits})
          </h3>
          <span style={{ fontSize: "0.8rem", color: "#94a3b8" }}>
            Vert = Présent (1) | Gris = Absent (0)
          </span>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(36px, 1fr))",
            gap: "5px",
            background: "#0f172a",
            padding: "1rem",
            borderRadius: "8px",
            border: "1px solid #1e293b",
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
                  background: isSet ? "#065f46" : "#1e293b",
                  border: isSet ? "1px solid #10b981" : "1px solid #334155",
                  color: isSet ? "#a7f3d0" : "#64748b",
                  borderRadius: "4px",
                  fontSize: "0.72rem",
                  fontWeight: 700,
                  cursor: isSet ? "pointer" : "default",
                  transition: "all 0.15s ease",
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
      <div className="card" style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#f8fafc" }}>
              Détail des {decoded.presentFields.length} Champs DE Détectés
            </h3>
            <p style={{ fontSize: "0.85rem", color: "#94a3b8" }}>
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
              style={{ width: "240px", fontSize: "0.85rem", padding: "0.4rem 0.75rem" }}
            />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="input"
              style={{ fontSize: "0.85rem", padding: "0.4rem 0.75rem" }}
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

        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th style={{ width: "80px" }}>Élément</th>
                <th style={{ width: "180px" }}>Nom Normatif</th>
                <th style={{ width: "100px" }}>Format</th>
                <th style={{ width: "110px" }}>Catégorie</th>
                <th style={{ width: "110px" }}>Position</th>
                <th>Rôle Monétique &amp; Description</th>
              </tr>
            </thead>
            <tbody>
              {filteredFields.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: "center", padding: "2rem", color: "#94a3b8" }}>
                    Aucun champ DE correspondant au filtre.
                  </td>
                </tr>
              ) : (
                filteredFields.map((field) => {
                  const spec = field.spec;
                  return (
                    <tr key={field.de}>
                      <td>
                        <span
                          className="badge badge-emerald"
                          style={{ fontWeight: 800, fontSize: "0.85rem" }}
                        >
                          DE {field.de}
                        </span>
                      </td>
                      <td style={{ fontWeight: 600, color: "#f1f5f9" }}>
                        {spec ? spec.name : `Champ Propriétaire DE ${field.de}`}
                      </td>
                      <td>
                        <code style={{ fontSize: "0.8rem", color: "#38bdf8", background: "#0f172a", padding: "0.2rem 0.4rem", borderRadius: "4px" }}>
                          {spec ? spec.format : "ans"}
                        </code>
                      </td>
                      <td>
                        <span className="badge" style={{ fontSize: "0.72rem" }}>
                          {spec ? spec.category : "EXTERNE"}
                        </span>
                      </td>
                      <td style={{ fontSize: "0.8rem", color: "#94a3b8" }}>
                        Octet {field.bytePosition} (bit {field.bitInByte})
                      </td>
                      <td style={{ fontSize: "0.85rem", color: "#cbd5e1" }}>
                        {spec ? spec.description : "Élément de données privatif ou non renseigné dans la norme standard."}
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
