"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { parseIso8583Message, IsoParseResult } from "../data/iso-message-parser";

const SAMPLE_MESSAGES = [
  {
    label: "0200 Retrait GAB Nominal",
    msg: "02007238200108E1800016497010123456789001000000000005000009171200001234561200000917601105112345678901234123456789012ATM00001COMMERCE0000001AGENCE PRINCIPALE DAKAR  952",
    desc: "Trame 0200 avec PAN, Montant 500.00 XOF, STAN 123456, GAB ATM00001",
  },
  {
    label: "0210 Réponse Accord 00",
    msg: "0210702000000600000016497010123456789001000000000005000012345698765400",
    desc: "Trame réponse 0210 avec DE38=987654 (Auth Code) et DE39=00 (Accord)",
  },
  {
    label: "0210 Rejet 51 (Provision Insuffisante)",
    msg: "0210702000000600000016497010123456789001000000000005000012345698765451",
    desc: "Trame 0210 refusée avec DE39=51 (Provision insuffisante sur le CBS)",
  },
  {
    label: "0200 Retrait EMV (Tags DE55)",
    msg: "020070200000020000001649701012345678900100000000000500001234560469F26084D5E12F9884511A2950500000480009F3602005A",
    desc: "Trame puce EMV avec DE55 TLV (ARQC 9F26, TVR 95, ATC 9F36)",
  },
  {
    label: "0200 avec PIN Block Chiffré (DE52)",
    msg: "02007020000000001000164970101234567890010000000000050000123456A1B2C3D4E5F60718",
    desc: "Trame avec DE52 (PIN Block DES/3DES 16 hex chars masqué PCI-DSS)",
  },
  {
    label: "0420 Extourne GAB (DE90)",
    msg: "042080000000000000000000004000000000020012345609171200000000001234500000012345",
    desc: "Extourne/Reversal 0420 avec DE90 (MTI, STAN, horodatage d'origine)",
  },
  {
    label: "0800 Echo Test Réseau",
    msg: "0800820000000000000004000000000000000917120000123456301",
    desc: "Gestion réseau Echo Test avec DE7 (Date/Heure), DE11 (STAN) et DE70=301",
  },
  {
    label: "Trame avec Header TPDU (6000010000...)",
    msg: "600001000002007238200108E1800016497010123456789001000000000005000009171200001234561200000917601105112345678901234123456789012ATM00001COMMERCE0000001AGENCE PRINCIPALE DAKAR  952",
    desc: "Trame préfixée par un en-tête TPDU de 10 caractères hex (routage Switch)",
  },
  {
    label: "Dump Wireshark / Hex Editor",
    msg: `0000   02 00 72 38 20 01 08 e1 80 00 16 49 70 10 12 34   ..r8 ...Ip.4
0010   56 78 90 01 00 00 00 00 00 05 00 00 09 17 12 00   Vx..............
0020   00 12 34 56 12 00 00 09 17 60 11 05 11 23 45 67   ..4V.....\`...#Eg
0030   89 01 23 41 23 45 67 89 01 24 15 44 41 4b 41 52   ..#A#Eg..$.DAKAR`,
    desc: "Dump brut copié directement depuis Wireshark ou tcpdump",
  },
];

export function IsoMessageParserTool() {
  const [inputMessage, setInputMessage] = useState<string>(SAMPLE_MESSAGES[0].msg);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filterCategory, setFilterCategory] = useState<string>("ALL");
  const [expandedEmvDe, setExpandedEmvDe] = useState<boolean>(true);
  const [copyFeedback, setCopyFeedback] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = sessionStorage.getItem("ndc_to_iso_payload");
      if (stored) {
        setInputMessage(stored);
        sessionStorage.removeItem("ndc_to_iso_payload");
      }
    }
  }, []);

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
        (field.interpretation && field.interpretation.toLowerCase().includes(q)) ||
        (spec && spec.category.toLowerCase().includes(q));

      const matchCategory = filterCategory === "ALL" || (spec && spec.category === filterCategory);
      return matchSearch && matchCategory;
    });
  }, [parsed, searchTerm, filterCategory]);

  const handleCopyJson = () => {
    const jsonStr = JSON.stringify(
      {
        mti: parsed.mti,
        mtiDescription: parsed.mtiDef?.name,
        bitmapHex: parsed.bitmapHex,
        totalFields: parsed.fields.length,
        criticalInsights: parsed.criticalInsights,
        fields: parsed.fields.map((f) => ({
          de: f.de,
          name: f.spec?.name,
          format: f.spec?.format,
          length: f.length,
          value: f.displayValue,
          isMasked: f.isMasked,
          interpretation: f.interpretation,
        })),
        errors: parsed.errors,
        warnings: parsed.warnings,
      },
      null,
      2
    );
    navigator.clipboard.writeText(jsonStr);
    setCopyFeedback("JSON copié !");
    setTimeout(() => setCopyFeedback(null), 2500);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.75rem" }}>
      {/* Bannière d'en-tête */}
      <div className="hero-search">
        <div>
          <p className="eyebrow accent" style={{ color: "#34d399" }}>
            ANALYSE &amp; FORENSICS MONÉTIQUE
          </p>
          <h2 style={{ fontSize: "1.4rem", fontWeight: 800 }}>
            Parseur Universel de Trames ISO 8583 (DE1 à DE128)
          </h2>
          <p style={{ fontSize: "0.92rem", color: "#94a3b8", marginTop: "0.3rem" }}>
            Décodage en temps réel des trames brutes Switch, GAB ou TPE. Prise en charge automatique des formats Wireshark/Hex dump, en-têtes TPDU/ISO, masquage PCI-DSS et décomposition des tags EMV TLV (DE55).
          </p>
        </div>
      </div>

      {/* Saisie de la trame brute */}
      <div
        className="card"
        style={{ display: "flex", flexDirection: "column", gap: "1rem", background: "#ffffff", border: "1px solid #e2e8f0" }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.5rem" }}>
          <label style={{ fontWeight: 700, fontSize: "0.95rem", color: "#0f172a" }}>
            Trame ISO 8583 Brute (Hex, ASCII, TPDU, ou Dump Wireshark) :
          </label>
          <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
            <span style={{ fontSize: "0.8rem", color: "#64748b", alignSelf: "center", fontWeight: 600 }}>Exemples :</span>
            {SAMPLE_MESSAGES.map((sample, idx) => (
              <button
                key={idx}
                onClick={() => setInputMessage(sample.msg)}
                className="btn-ghost"
                title={sample.desc}
                style={{ fontSize: "0.78rem", padding: "0.25rem 0.55rem", background: "#f8fafc", border: "1px solid #cbd5e1" }}
              >
                {sample.label}
              </button>
            ))}
          </div>
        </div>

        <textarea
          rows={4}
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Collez la trame ISO 8583 ici (ex: 02007238200108E18000... ou dump Wireshark avec offsets)"
          style={{
            fontFamily: "var(--font-mono, monospace)",
            fontSize: "0.92rem",
            fontWeight: 600,
            letterSpacing: "0.4px",
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

        {/* Barre d'état & En-têtes détectés */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
            <span style={{ fontSize: "0.8rem", color: "#64748b" }}>
              Longueur : <b>{inputMessage.replace(/\s/g, "").length}</b> car.
            </span>

            {parsed.detectedFormat === "WIRESHARK_HEX_DUMP" && (
              <span className="badge" style={{ background: "#e0f2fe", color: "#0369a1", fontSize: "0.75rem", fontWeight: 700 }}>
                📡 Format Wireshark extrait
              </span>
            )}
            {parsed.tpduHeader && (
              <span className="badge" style={{ background: "#fef3c7", color: "#92400e", fontSize: "0.75rem", fontWeight: 700 }}>
                🏷️ TPDU: {parsed.tpduHeader}
              </span>
            )}
            {parsed.isoHeader && (
              <span className="badge" style={{ background: "#f3e8ff", color: "#6b21a8", fontSize: "0.75rem", fontWeight: 700 }}>
                📦 Header ISO: {parsed.isoHeader}
              </span>
            )}
            {parsed.tcpLengthHeader && (
              <span className="badge" style={{ background: "#f1f5f9", color: "#334155", fontSize: "0.75rem", fontWeight: 700 }}>
                📏 TCP Length: {parsed.tcpLengthHeader}
              </span>
            )}
          </div>

          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button
              onClick={handleCopyJson}
              className="btn-ghost"
              style={{ padding: "0.35rem 0.85rem", fontSize: "0.82rem", background: "#f8fafc", border: "1px solid #cbd5e1" }}
            >
              {copyFeedback ? `✅ ${copyFeedback}` : "📋 Copier JSON"}
            </button>
            <button
              onClick={() => setInputMessage("")}
              className="btn-ghost"
              style={{ padding: "0.35rem 0.85rem", fontSize: "0.82rem" }}
            >
              Effacer
            </button>
          </div>
        </div>

        {/* Notes de nettoyage */}
        {parsed.sanitizationNotes.length > 0 && (
          <div style={{ background: "#f8fafc", border: "1px dashed #cbd5e1", padding: "0.5rem 0.85rem", borderRadius: "6px" }}>
            <span style={{ fontSize: "0.75rem", color: "#475569", fontWeight: 600 }}>ℹ️ Traitement automatique : </span>
            <span style={{ fontSize: "0.75rem", color: "#64748b" }}>{parsed.sanitizationNotes.join(" · ")}</span>
          </div>
        )}

        {parsed.errors.length > 0 && (
          <div style={{ background: "#fee2e2", border: "1px solid #fca5a5", padding: "0.75rem 1rem", borderRadius: "8px" }}>
            {parsed.errors.map((err, idx) => (
              <p key={idx} style={{ color: "#991b1b", fontSize: "0.85rem", margin: 0, fontWeight: 600 }}>
                ❌ {err}
              </p>
            ))}
          </div>
        )}

        {parsed.warnings.length > 0 && (
          <div style={{ background: "#fef3c7", border: "1px solid #fde68a", padding: "0.75rem 1rem", borderRadius: "8px" }}>
            {parsed.warnings.map((warn, idx) => (
              <p key={idx} style={{ color: "#92400e", fontSize: "0.85rem", margin: 0, fontWeight: 500 }}>
                ⚠️ {warn}
              </p>
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
              <Link
                href={`/hub/mti?search=${parsed.mti}`}
                style={{ fontSize: "0.75rem", color: "#0369a1", textDecoration: "underline" }}
              >
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
            Devise: <b>{parsed.criticalInsights.currency || "Non spécifiée"}</b>
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
                href={`/hub/de39?search=${parsed.criticalInsights.responseCode}`}
                style={{ fontSize: "0.75rem", color: "#0369a1", textDecoration: "underline" }}
              >
                Diagnostic DE39 ➜
              </Link>
            )}
          </div>
          <span style={{ fontSize: "0.8rem", color: "#64748b" }}>
            {parsed.criticalInsights.responseDescription ||
              (parsed.criticalInsights.responseCode === "00"
                ? "Approuvé / Honoré"
                : parsed.criticalInsights.responseCode
                ? "Refus / Rejet"
                : "Demande initiale (0200/0100)")}
          </span>
        </div>
      </div>

      {/* Cartouche d'Insights Avancés */}
      {(parsed.criticalInsights.procCode ||
        parsed.criticalInsights.posEntryMode ||
        parsed.criticalInsights.stan ||
        parsed.criticalInsights.tid ||
        parsed.criticalInsights.emvParsed) && (
        <div
          className="card"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "1rem",
            background: "#f8fafc",
            border: "1px solid #e2e8f0",
            padding: "1rem 1.25rem",
          }}
        >
          {parsed.criticalInsights.procCode && (
            <div>
              <span style={{ fontSize: "0.75rem", color: "#64748b", fontWeight: 700, textTransform: "uppercase" }}>
                Opération (DE3)
              </span>
              <p style={{ margin: "0.2rem 0 0", fontSize: "0.88rem", fontWeight: 700, color: "#0f172a" }}>
                {parsed.criticalInsights.procCodeDescription || parsed.criticalInsights.procCode}
              </p>
            </div>
          )}

          {parsed.criticalInsights.posEntryMode && (
            <div>
              <span style={{ fontSize: "0.75rem", color: "#64748b", fontWeight: 700, textTransform: "uppercase" }}>
                Mode Saisie / Lecture (DE22)
              </span>
              <p style={{ margin: "0.2rem 0 0", fontSize: "0.88rem", fontWeight: 700, color: "#0f172a" }}>
                {parsed.criticalInsights.posEntryModeDescription || parsed.criticalInsights.posEntryMode}
              </p>
            </div>
          )}

          {parsed.criticalInsights.stan && (
            <div>
              <span style={{ fontSize: "0.75rem", color: "#64748b", fontWeight: 700, textTransform: "uppercase" }}>
                STAN (DE11) / RRN (DE37)
              </span>
              <p style={{ margin: "0.2rem 0 0", fontSize: "0.88rem", fontWeight: 700, color: "#0f172a", fontFamily: "monospace" }}>
                STAN: {parsed.criticalInsights.stan} {parsed.criticalInsights.rrn ? `· RRN: ${parsed.criticalInsights.rrn}` : ""}
              </p>
            </div>
          )}

          {parsed.criticalInsights.tid && (
            <div>
              <span style={{ fontSize: "0.75rem", color: "#64748b", fontWeight: 700, textTransform: "uppercase" }}>
                Terminal TID (DE41) / Agence
              </span>
              <p style={{ margin: "0.2rem 0 0", fontSize: "0.88rem", fontWeight: 700, color: "#0f172a" }}>
                {parsed.criticalInsights.tid} {parsed.criticalInsights.acceptorName ? `(${parsed.criticalInsights.acceptorName})` : ""}
              </p>
            </div>
          )}

          {parsed.criticalInsights.diagnosticAdvice && (
            <div style={{ gridColumn: "1 / -1", borderTop: "1px dashed #cbd5e1", paddingTop: "0.75rem" }}>
              <span style={{ fontSize: "0.75rem", color: "#b91c1c", fontWeight: 700 }}>
                💡 Action d&apos;exploitation recommandée (DE39) :
              </span>
              <p style={{ margin: "0.2rem 0 0", fontSize: "0.85rem", color: "#7f1d1d" }}>
                {parsed.criticalInsights.diagnosticAdvice}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Décomposition Dédiée EMV / DE55 si présent */}
      {parsed.criticalInsights.emvParsed && (
        <div
          className="card"
          style={{
            background: "#fffbeb",
            border: "1.5px solid #fde68a",
            display: "flex",
            flexDirection: "column",
            gap: "0.85rem",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <span style={{ fontSize: "1.1rem" }}>💳</span>
              <h4 style={{ margin: 0, fontWeight: 800, color: "#92400e", fontSize: "0.98rem" }}>
                Décomposition des Tags EMV TLV (DE55) — {parsed.criticalInsights.emvParsed.tags.length} Tags extraits
              </h4>
            </div>
            <button
              onClick={() => setExpandedEmvDe(!expandedEmvDe)}
              className="btn-ghost"
              style={{ fontSize: "0.78rem", padding: "0.25rem 0.6rem", background: "#fef3c7" }}
            >
              {expandedEmvDe ? "Masquer les tags ▲" : "Afficher les tags ▼"}
            </button>
          </div>

          {expandedEmvDe && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "0.75rem" }}>
              {parsed.criticalInsights.emvParsed.tags.map((t, idx) => (
                <div
                  key={idx}
                  style={{
                    background: "#ffffff",
                    border: "1px solid #fef08a",
                    padding: "0.6rem 0.85rem",
                    borderRadius: "6px",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <code style={{ fontWeight: 800, color: "#b45309", fontSize: "0.85rem" }}>Tag {t.tag}</code>
                    <span style={{ fontSize: "0.72rem", color: "#64748b" }}>{t.length} octets</span>
                  </div>
                  <strong style={{ display: "block", fontSize: "0.82rem", color: "#0f172a", marginTop: "0.2rem" }}>
                    {t.name}
                  </strong>
                  <code
                    style={{
                      display: "block",
                      marginTop: "0.3rem",
                      fontSize: "0.78rem",
                      wordBreak: "break-all",
                      background: "#f8fafc",
                      padding: "0.2rem 0.4rem",
                      borderRadius: "4px",
                      color: "#334155",
                    }}
                  >
                    {t.displayValue}
                  </code>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tableau détaillé des Champs Découpés */}
      <div
        className="card"
        style={{ display: "flex", flexDirection: "column", gap: "1.25rem", background: "#ffffff", border: "1px solid #e2e8f0" }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <h3 style={{ fontSize: "1.1rem", fontWeight: 800, color: "#0f172a" }}>
              Découpage Séquentiel des Champs ({parsed.fields.length} DE Décodés)
            </h3>
            <p style={{ fontSize: "0.85rem", color: "#64748b" }}>
              Bitmap : <code style={{ color: "#0369a1", fontWeight: 700 }}>{parsed.bitmapHex}</code> (
              {parsed.isSecondaryBitmap ? "Primaire + Secondaire 128 bits" : "Primaire 64 bits"})
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
                <th style={{ width: "85px", padding: "1rem", color: "#0f172a", fontWeight: 800, fontSize: "0.8rem" }}>
                  ÉLÉMENT
                </th>
                <th style={{ width: "220px", padding: "1rem", color: "#0f172a", fontWeight: 800, fontSize: "0.8rem" }}>
                  NOM NORMATIF
                </th>
                <th style={{ width: "95px", padding: "1rem", color: "#0f172a", fontWeight: 800, fontSize: "0.8rem" }}>
                  FORMAT
                </th>
                <th style={{ width: "80px", padding: "1rem", color: "#0f172a", fontWeight: 800, fontSize: "0.8rem" }}>
                  TAILLE
                </th>
                <th style={{ padding: "1rem", color: "#0f172a", fontWeight: 800, fontSize: "0.8rem" }}>
                  VALEUR DÉCODÉE &amp; INTERPRÉTATION
                </th>
                <th style={{ width: "130px", padding: "1rem", color: "#0f172a", fontWeight: 800, fontSize: "0.8rem" }}>
                  CATÉGORIE
                </th>
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
                        <Link
                          href={`/hub/de?search=DE${f.de}`}
                          title={`Voir la fiche détaillée de DE${f.de} dans le Référentiel Champs DE`}
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
                            textDecoration: "none",
                          }}
                        >
                          DE {f.de}
                        </Link>
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
                        <code
                          style={{
                            fontSize: "0.78rem",
                            background: "#f0f9ff",
                            color: "#0369a1",
                            padding: "0.2rem 0.4rem",
                            borderRadius: "4px",
                            border: "1px solid #bae6fd",
                          }}
                        >
                          {spec ? spec.format : "ans"}
                        </code>
                      </td>

                      <td
                        style={{
                          padding: "0.85rem 1rem",
                          verticalAlign: "middle",
                          fontSize: "0.85rem",
                          color: "#0f172a",
                          fontWeight: 600,
                        }}
                      >
                        {f.length} car.
                        {f.lengthHeader && (
                          <span style={{ display: "block", fontSize: "0.7rem", color: "#64748b" }}>
                            (Hdr: {f.lengthHeader})
                          </span>
                        )}
                      </td>

                      <td style={{ padding: "0.85rem 1rem", verticalAlign: "middle" }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
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
                                EMV / ICC TLV ({f.emvTags ? f.emvTags.length : 0} tags)
                              </span>
                            )}
                            {f.error && (
                              <span className="badge" style={{ fontSize: "0.68rem", background: "#fee2e2", color: "#991b1b" }}>
                                ⚠️ {f.error}
                              </span>
                            )}
                          </div>

                          {f.interpretation && (
                            <span style={{ fontSize: "0.8rem", color: "#475569", fontWeight: 600 }}>
                              💡 {f.interpretation}
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
