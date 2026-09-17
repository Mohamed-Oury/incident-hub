"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { parseIso8583Message, IsoParseResult } from "../data/iso-message-parser";

const SAMPLE_MESSAGES = [
  {
    label: "0200 Retrait GAB Nominal",
    msg: "02007238200108E1800016497010123456789001000000000005000009171200001234561200000917601105112345678901234123456789012ATM00001COMMERCE0000001AGENCE PRINCIPALE DAKAR  952",
    desc: "Trame 0200 avec PAN, Montant 500.00, STAN 123456, GAB ATM00001",
  },
  {
    label: "0210 Réponse Accord 00",
    msg: "02107230000102E080001649701012345678900100000000000500000917120000123456120000091712345678901298765400ATM00001",
    desc: "Trame réponse 0210 avec DE38=987654 (Auth Code) et DE39=00 (Accord)",
  },
  {
    label: "0800 Echo Test Réseau",
    msg: "0800820000000000000004000000000000000917120000123456301",
    desc: "Gestion réseau Echo Test avec DE7 (Date/Heure), DE11 (STAN) et DE70=301",
  },
];

export function IsoMessageParserTool() {
  const [inputMessage, setInputMessage] = useState<string>(SAMPLE_MESSAGES[0].msg);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filterCategory, setFilterCategory] = useState<string>("ALL");

  const parsed = useMemo(() => {
    return parseIso8583Message(inputMessage);
  }, [inputMessage]);

  const filteredFields = useMemo(() => {
    return parsed.fields.filter((field) => {
      const q = searchTerm.toLowerCase().trim();
      const spec = field.spec;
      const matchSearch =
        !q ||
        `de${field.de}`.includes(q) ||
        field.de.toString().includes(q) ||
        (spec && spec.name.toLowerCase().includes(q)) ||
        field.displayValue.toLowerCase().includes(q) ||
        (spec && spec.category.toLowerCase().includes(q));

      const matchCategory = filterCategory === "ALL" || (spec && spec.category === filterCategory);
      return matchSearch && matchCategory;
    });
  }, [parsed, searchTerm, filterCategory]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.75rem" }}>
      {/* Bannière d'en-tête */}
      <div className="hero-search">
        <div>
          <p className="eyebrow accent" style={{ color: "#34d399" }}>ANALYSE &amp; FORENSICS MONÉTIQUE</p>
          <h2 style={{ fontSize: "1.4rem", fontWeight: 800 }}>Parseur Complet de Trames ISO 8583</h2>
          <p style={{ fontSize: "0.92rem", color: "#94a3b8", marginTop: "0.3rem" }}>
            Collez une trame brute de logs Switch ou Automate (avec ou sans TPDU). Le parseur extrait instantanément le MTI, résout le Bitmap et découpe chaque champ DE avec masquage PCI-DSS automatique.
          </p>
        </div>
      </div>

      {/* Saisie de la trame brute */}
      <div className="card" style={{ display: "flex", flexDirection: "column", gap: "1rem", background: "#ffffff", border: "1px solid #e2e8f0" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.5rem" }}>
          <label style={{ fontWeight: 700, fontSize: "0.95rem", color: "#0f172a" }}>
            Trame ISO 8583 Brute (Hexadécimal ou ASCII) :
          </label>
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            <span style={{ fontSize: "0.82rem", color: "#64748b", alignSelf: "center", fontWeight: 600 }}>Exemples :</span>
            {SAMPLE_MESSAGES.map((sample, idx) => (
              <button
                key={idx}
                onClick={() => setInputMessage(sample.msg)}
                className="btn-ghost"
                style={{ fontSize: "0.8rem", padding: "0.3rem 0.65rem", background: "#f8fafc", border: "1px solid #cbd5e1" }}
              >
                {sample.label}
              </button>
            ))}
          </div>
        </div>

        <textarea
          rows={3}
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Collez la trame ISO 8583 ici (ex: 02007238200108E18000...)"
          style={{
            fontFamily: "var(--font-mono, monospace)",
            fontSize: "0.95rem",
            fontWeight: 600,
            letterSpacing: "0.5px",
            color: "#047857",
            background: "#f0fdf4",
            border: "2px solid #a7f3d0",
            borderRadius: "8px",
            padding: "0.85rem",
            width: "100%",
            outline: "none",
            resize: "vertical",
          }}
        />

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: "0.8rem", color: "#64748b" }}>
            Longueur totale : <b>{inputMessage.replace(/\s/g, "").length}</b> caractères
          </span>
          <button
            onClick={() => setInputMessage("")}
            className="btn-ghost"
            style={{ padding: "0.35rem 1rem", fontSize: "0.82rem" }}
          >
            Effacer
          </button>
        </div>

        {parsed.errors.length > 0 && (
          <div style={{ background: "#fee2e2", border: "1px solid #fca5a5", padding: "0.75rem 1rem", borderRadius: "8px" }}>
            {parsed.errors.map((err, idx) => (
              <p key={idx} style={{ color: "#991b1b", fontSize: "0.85rem", margin: 0, fontWeight: 600 }}>❌ {err}</p>
            ))}
          </div>
        )}

        {parsed.warnings.length > 0 && (
          <div style={{ background: "#fef3c7", border: "1px solid #fde68a", padding: "0.75rem 1rem", borderRadius: "8px" }}>
            {parsed.warnings.map((warn, idx) => (
              <p key={idx} style={{ color: "#92400e", fontSize: "0.85rem", margin: 0, fontWeight: 500 }}>⚠️ {warn}</p>
            ))}
          </div>
        )}
      </div>

      {/* Synthèse Métier & Exploitation */}
      <div className="grid-metrics">
        <div className="metric-card">
          <span className="metric-label">Message MTI</span>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <p className="metric-value" style={{ color: "#047857", margin: 0 }}>
              {parsed.mti || "—"}
            </p>
            {parsed.mtiDef && (
              <Link href={`/mti?search=${parsed.mti}`} style={{ fontSize: "0.75rem", color: "#0369a1", textDecoration: "underline" }}>
                Fiche MTI ➜
              </Link>
            )}
          </div>
          <span style={{ fontSize: "0.8rem", color: "#64748b" }}>
            {parsed.mtiDef ? parsed.mtiDef.name : "Type de message"}
          </span>
        </div>

        <div className="metric-card">
          <span className="metric-label">Compte / Carte (DE2)</span>
          <p className="metric-value" style={{ color: "#0f172a", fontSize: "1.15rem", fontFamily: "monospace" }}>
            {parsed.criticalInsights.pan || "N/A"}
          </p>
          <span style={{ fontSize: "0.75rem", color: "#059669", fontWeight: 700 }}>
            🔒 Masqué PCI-DSS
          </span>
        </div>

        <div className="metric-card">
          <span className="metric-label">Montant (DE4)</span>
          <p className="metric-value" style={{ color: "#b45309" }}>
            {parsed.criticalInsights.amount ? `${parsed.criticalInsights.amount}` : "0.00"}
          </p>
          <span style={{ fontSize: "0.8rem", color: "#64748b" }}>
            STAN: <b>{parsed.criticalInsights.stan || "—"}</b>
          </span>
        </div>

        <div className="metric-card">
          <span className="metric-label">Code Réponse (DE39)</span>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <p
              className="metric-value"
              style={{
                color: parsed.criticalInsights.responseCode === "00" ? "#059669" : "#b91c1c",
                margin: 0,
              }}
            >
              {parsed.criticalInsights.responseCode || "—"}
            </p>
            {parsed.criticalInsights.responseCode && (
              <Link
                href={`/de39?search=${parsed.criticalInsights.responseCode}`}
                style={{ fontSize: "0.75rem", color: "#0369a1", textDecoration: "underline" }}
              >
                Diagnostic DE39 ➜
              </Link>
            )}
          </div>
          <span style={{ fontSize: "0.8rem", color: "#64748b" }}>
            {parsed.criticalInsights.responseCode === "00" ? "Approuvé / Honoré" : parsed.criticalInsights.responseCode ? "Refus / Rejet" : "Demande initiale"}
          </span>
        </div>
      </div>

      {/* Tableau détaillé des Champs Découpés */}
      <div className="card" style={{ display: "flex", flexDirection: "column", gap: "1.25rem", background: "#ffffff", border: "1px solid #e2e8f0" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <h3 style={{ fontSize: "1.1rem", fontWeight: 800, color: "#0f172a" }}>
              Découpage Séquentiel des Champs ({parsed.fields.length} DE Décodés)
            </h3>
            <p style={{ fontSize: "0.85rem", color: "#64748b" }}>
              Bitmap : <code style={{ color: "#0369a1", fontWeight: 700 }}>{parsed.bitmapHex}</code> ({parsed.isSecondaryBitmap ? "Primaire + Secondaire" : "Primaire"})
            </p>
          </div>

          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
            <input
              type="text"
              placeholder="Filtrer un champ (ex: DE2, montant, PIN)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input"
              style={{ width: "250px", fontSize: "0.85rem", padding: "0.5rem 0.85rem" }}
            />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="input"
              style={{ fontSize: "0.85rem", padding: "0.5rem 0.85rem", width: "auto" }}
            >
              <option value="ALL">Toutes catégories</option>
              <option value="IDENTIFICATION">Identification</option>
              <option value="MONTANT">Montants &amp; Devises</option>
              <option value="TRACE">Trace &amp; Audit (STAN/RRN)</option>
              <option value="DONNEES_CARTE">Données Carte &amp; EMV</option>
              <option value="TERMINAL">Terminal &amp; Commerçant</option>
              <option value="SECURITE">Sécurité &amp; PIN</option>
              <option value="RESEAU">Réseau &amp; Routage</option>
            </select>
          </div>
        </div>

        <div className="table-wrapper" style={{ border: "1px solid #e2e8f0", borderRadius: "12px", overflow: "hidden" }}>
          <table>
            <thead>
              <tr style={{ background: "#f8fafc", borderBottom: "2px solid #e2e8f0" }}>
                <th style={{ width: "85px", padding: "1rem", color: "#0f172a", fontWeight: 800, fontSize: "0.8rem" }}>ÉLÉMENT</th>
                <th style={{ width: "200px", padding: "1rem", color: "#0f172a", fontWeight: 800, fontSize: "0.8rem" }}>NOM NORMATIF</th>
                <th style={{ width: "95px", padding: "1rem", color: "#0f172a", fontWeight: 800, fontSize: "0.8rem" }}>FORMAT</th>
                <th style={{ width: "80px", padding: "1rem", color: "#0f172a", fontWeight: 800, fontSize: "0.8rem" }}>TAILLE</th>
                <th style={{ padding: "1rem", color: "#0f172a", fontWeight: 800, fontSize: "0.8rem" }}>VALEUR DÉCODÉE</th>
                <th style={{ width: "130px", padding: "1rem", color: "#0f172a", fontWeight: 800, fontSize: "0.8rem" }}>CATÉGORIE</th>
              </tr>
            </thead>
            <tbody>
              {filteredFields.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: "center", padding: "3rem", color: "#64748b" }}>
                    Aucun champ DE ne correspond aux critères.
                  </td>
                </tr>
              ) : (
                filteredFields.map((f) => {
                  const spec = f.spec;
                  return (
                    <tr key={f.de} style={{ borderBottom: "1px solid #f1f5f9" }}>
                      <td style={{ padding: "0.85rem 1rem", verticalAlign: "middle" }}>
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            background: "#ecfdf5",
                            color: "#047857",
                            border: "1.5px solid #059669",
                            padding: "0.25rem 0.55rem",
                            borderRadius: "6px",
                            fontWeight: 900,
                            fontSize: "0.82rem",
                            fontFamily: "monospace",
                          }}
                        >
                          DE {f.de}
                        </span>
                      </td>

                      <td style={{ padding: "0.85rem 1rem", verticalAlign: "middle" }}>
                        <strong style={{ color: "#0f172a", fontSize: "0.9rem", display: "block" }}>
                          {spec ? spec.name : `Champ DE ${f.de}`}
                        </strong>
                        <span style={{ fontSize: "0.75rem", color: "#64748b" }}>
                          Offsets: [{f.offsetStart}..{f.offsetEnd}]
                        </span>
                      </td>

                      <td style={{ padding: "0.85rem 1rem", verticalAlign: "middle" }}>
                        <code style={{ fontSize: "0.78rem", background: "#f0f9ff", color: "#0369a1", padding: "0.2rem 0.4rem", borderRadius: "4px", border: "1px solid #bae6fd" }}>
                          {spec ? spec.format : "ans"}
                        </code>
                      </td>

                      <td style={{ padding: "0.85rem 1rem", verticalAlign: "middle", fontSize: "0.85rem", color: "#0f172a", fontWeight: 600 }}>
                        {f.length} car.
                        {f.lengthHeader && (
                          <span style={{ display: "block", fontSize: "0.7rem", color: "#64748b" }}>
                            (Hdr: {f.lengthHeader})
                          </span>
                        )}
                      </td>

                      <td style={{ padding: "0.85rem 1rem", verticalAlign: "middle" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                          <code
                            style={{
                              fontSize: "0.85rem",
                              fontWeight: 700,
                              color: f.isMasked ? "#059669" : "#0f172a",
                              background: f.isMasked ? "#ecfdf5" : "#f8fafc",
                              border: f.isMasked ? "1px solid #a7f3d0" : "1px solid #e2e8f0",
                              padding: "0.3rem 0.6rem",
                              borderRadius: "6px",
                              fontFamily: "monospace",
                              wordBreak: "break-all",
                            }}
                          >
                            {f.displayValue}
                          </code>
                          {f.de === 55 && (
                            <span className="badge" style={{ fontSize: "0.68rem", background: "#fef3c7", color: "#92400e" }}>
                              EMV / ICC TLV
                            </span>
                          )}
                        </div>
                      </td>

                      <td style={{ padding: "0.85rem 1rem", verticalAlign: "middle" }}>
                        <span className="badge" style={{ fontSize: "0.72rem", background: "#f1f5f9", color: "#334155" }}>
                          {spec ? spec.category.replace("_", " ") : "EXTERNE"}
                        </span>
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
