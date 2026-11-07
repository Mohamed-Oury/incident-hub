"use client";

import { useState, useMemo } from "react";
import {
  parseEmvTlv,
  decodeTvrHex,
  decodeTsiHex,
  decodeAipHex,
  decodeCvmResultsHex,
} from "../data/emv-tlv-decoder";

const SAMPLE_EMV_BLOBS = [
  {
    label: "DE55 Retrait EMV avec PIN Incorrect (TVR 0000048000)",
    hex: "9F26084D5E12F9884511A29F2701809F10120110A00003220000000000000000000000009F3704C8912A349F3602005A950500000480009A032409179C01019F02060000000500005F2A020952820238009F1A020952",
    desc: "Cryptogramme ARQC (80), TVR Tag 95 avec alerte PIN try limit exceeded et Floor Limit",
  },
  {
    label: "DE55 Nominal Achat Sans Contact NFC (TC 40)",
    hex: "9F2608A1B2C3D4E5F607189F2701409F100706010A03A000009F37047B8901CD9F36020112950500000000009A032409179F02060000000250005F2A02095282022000",
    desc: "Cryptogramme TC (40), TVR à zéro (0000000000), transaction nominale approuvée hors-ligne",
  },
  {
    label: "DE55 Refus Local AAC par la Puce (SDA Failed)",
    hex: "9F2608D9E8F7A6B5C4D3E29F2701009F100801102000000000009F3704123456789F3602003B950580000080009A032409189C01019F02060000001000005F2A02095282021800",
    desc: "Cryptogramme AAC (00), TVR 8000008000 (SDA Failed + Floor limit) : transaction rejetée par la carte",
  },
  {
    label: "DE55 Retrait International DDA & PIN Online (TSI E800)",
    hex: "9F2608554433221100FFEE9F2701809F10120110A00003240000000000000000000000009F3704A9B8C7D69F36020088950500000080009B02E800820238009F34030201029A032409189C01019F02060000000800005F2A0208409F1A020840",
    desc: "Retrait USA en USD avec vérification DDA, PIN Online validé (Tag 9F34=020102) et TSI complet (E800)",
  },
  {
    label: "DE55 Échec Exécution Script Émetteur (Tag 71/72)",
    hex: "9F260811223344556677889F2701809F100706010A03A000009F3704556677889F36020077950500000000209B02A0009A032409189F02060000000300005F2A02097882023800",
    desc: "TVR 0000000020 signalant un échec d'exécution du script de mise à jour de la puce émetteur",
  },
];

export function EmvDecoderTool() {
  const [inputHex, setInputHex] = useState<string>(SAMPLE_EMV_BLOBS[0].hex);
  const [tvrInput, setTvrInput] = useState<string>("0000048000");
  const [tsiInput, setTsiInput] = useState<string>("E800");
  const [aipInput, setAipInput] = useState<string>("3800");
  const [cvmInput, setCvmInput] = useState<string>("020102");
  const [activeTab, setActiveTab] = useState<"DE55" | "SECURITY_AUDIT" | "TVR_TOOL" | "TSI_TOOL" | "AIP_CVM_TOOL">("DE55");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [copiedTag, setCopiedTag] = useState<string | null>(null);

  // État du Copilot Agent EMV
  const [copilotLoading, setCopilotLoading] = useState(false);
  const [copilotResult, setCopilotResult] = useState<{
    summaryTitle: string;
    cryptoType: string;
    riskLevel: string;
    tvrAnalysisDetail: string;
    recommendedActions: string[];
    copilotExplanation: string;
  } | null>(null);
  const [copilotError, setCopilotError] = useState<string | null>(null);

  const decodedTlv = useMemo(() => {
    return parseEmvTlv(inputHex);
  }, [inputHex]);

  const standaloneTvr = useMemo(() => {
    return decodeTvrHex(tvrInput);
  }, [tvrInput]);

  const standaloneTsi = useMemo(() => {
    return decodeTsiHex(tsiInput);
  }, [tsiInput]);

  const standaloneAip = useMemo(() => {
    return decodeAipHex(aipInput);
  }, [aipInput]);

  const standaloneCvm = useMemo(() => {
    return decodeCvmResultsHex(cvmInput);
  }, [cvmInput]);

  const handleRunEmvCopilot = async () => {
    setCopilotLoading(true);
    setCopilotError(null);
    try {
      const res = await fetch("/api/cbs/agentic/decoders/emv/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          inputHex: inputHex,
          tvrRaw: decodedTlv.tvrSummary?.rawHex || "",
          parsedTagsCount: decodedTlv.tags.length,
          criticalFlags: decodedTlv.tvrSummary?.criticalFlags || [],
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.detail || data.error || "Impossible de contacter l'agent Copilot EMV.");
      }
      setCopilotResult(data);
    } catch (err: any) {
      setCopilotError(err.message || "Erreur d'analyse Copilot EMV.");
    } finally {
      setCopilotLoading(false);
    }
  };

  const handleCopyTag = (tag: string, value: string) => {
    navigator.clipboard.writeText(value);
    setCopiedTag(tag);
    setTimeout(() => setCopiedTag(null), 2000);
  };

  const filteredTags = useMemo(() => {
    return decodedTlv.tags.filter((t) => {
      const q = searchTerm.toLowerCase().trim();
      return (
        !q ||
        t.tag.toLowerCase().includes(q) ||
        t.name.toLowerCase().includes(q) ||
        t.rawHex.toLowerCase().includes(q) ||
        (t.formattedValue && t.formattedValue.toLowerCase().includes(q)) ||
        (t.spec && t.spec.description.toLowerCase().includes(q))
      );
    });
  }, [decodedTlv, searchTerm]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.75rem" }}>
      {/* En-tête */}
      <div className="hero-search">
        <div>
          <p className="eyebrow accent" style={{ color: "#34d399" }}>INGÉNIERIE EMV, PUCE &amp; FORENSIQUE ISO DE55</p>
          <h2 style={{ fontSize: "1.4rem", fontWeight: 800 }}>Décodeur EMV Avancé &amp; Analyseur de Risques TVR / TSI / AIP</h2>
          <p style={{ fontSize: "0.92rem", color: "#94a3b8", marginTop: "0.3rem" }}>
            Décodez exhaustivement les paquets TLV du champ ISO DE55, inspectez les cryptogrammes (ARQC/TC/AAC), analysez bit-à-bit les décisions terminal (TVR Tag 95), les étapes exécutées (TSI Tag 9B) et les profils de sécurité carte (AIP Tag 82).
          </p>
        </div>
      </div>

      {/* Barre d'Onglets Spécialisés */}
      <div style={{ display: "flex", gap: "0.5rem", borderBottom: "2px solid #e2e8f0", paddingBottom: "0.5rem", flexWrap: "wrap" }}>
        <button
          onClick={() => setActiveTab("DE55")}
          className={activeTab === "DE55" ? "btn-primary" : "btn-ghost"}
          style={{ fontSize: "0.85rem" }}
        >
          💳 Décodeur TLV DE55 ({decodedTlv.tags.length} Tags)
        </button>
        <button
          onClick={() => setActiveTab("SECURITY_AUDIT")}
          className={activeTab === "SECURITY_AUDIT" ? "btn-primary" : "btn-ghost"}
          style={{ fontSize: "0.85rem" }}
        >
          🚨 Audit de Sécurité &amp; Décision Cryptographique
        </button>
        <button
          onClick={() => setActiveTab("TVR_TOOL")}
          className={activeTab === "TVR_TOOL" ? "btn-primary" : "btn-ghost"}
          style={{ fontSize: "0.85rem" }}
        >
          🔬 Analyseur TVR (Tag 95 - 40 bits)
        </button>
        <button
          onClick={() => setActiveTab("TSI_TOOL")}
          className={activeTab === "TSI_TOOL" ? "btn-primary" : "btn-ghost"}
          style={{ fontSize: "0.85rem" }}
        >
          ⚙️ Analyseur TSI (Tag 9B - 16 bits)
        </button>
        <button
          onClick={() => setActiveTab("AIP_CVM_TOOL")}
          className={activeTab === "AIP_CVM_TOOL" ? "btn-primary" : "btn-ghost"}
          style={{ fontSize: "0.85rem" }}
        >
          🛡️ Profil Carte AIP (Tag 82) &amp; CVM (Tag 9F34)
        </button>
      </div>

      {/* CONTENU ONGLET 1 : DÉCODEUR TLV DE55 */}
      {activeTab === "DE55" && (
        <>
          {/* Saisie TLV DE55 */}
          <div className="card" style={{ display: "flex", flexDirection: "column", gap: "1rem", background: "#ffffff", border: "1px solid #e2e8f0" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.5rem" }}>
              <label style={{ fontWeight: 700, fontSize: "0.95rem", color: "#0f172a" }}>
                Paquet Hexadécimal DE55 (Données Puce EMV) :
              </label>
              <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                <span style={{ fontSize: "0.82rem", color: "#64748b", alignSelf: "center", fontWeight: 600 }}>Exemples réels :</span>
                {SAMPLE_EMV_BLOBS.map((sample, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setInputHex(sample.hex);
                      if (sample.hex.includes("9505")) {
                        const m = sample.hex.match(/9505([0-9A-Fa-f]{10})/);
                        if (m) setTvrInput(m[1]);
                      }
                      if (sample.hex.includes("9B02")) {
                        const m = sample.hex.match(/9B02([0-9A-Fa-f]{4})/);
                        if (m) setTsiInput(m[1]);
                      }
                      if (sample.hex.includes("8202")) {
                        const m = sample.hex.match(/8202([0-9A-Fa-f]{4})/);
                        if (m) setAipInput(m[1]);
                      }
                      if (sample.hex.includes("9F3403")) {
                        const m = sample.hex.match(/9F3403([0-9A-Fa-f]{6})/);
                        if (m) setCvmInput(m[1]);
                      }
                    }}
                    className="btn-ghost"
                    style={{ fontSize: "0.78rem", padding: "0.3rem 0.65rem", background: "#f8fafc", border: "1px solid #cbd5e1" }}
                  >
                    {sample.label}
                  </button>
                ))}
              </div>
            </div>

            <textarea
              rows={3}
              value={inputHex}
              onChange={(e) => setInputHex(e.target.value)}
              placeholder="Collez les données DE55 ici (ex: 9F26084D5E...)"
              style={{
                fontFamily: "var(--font-mono, monospace)",
                fontSize: "0.92rem",
                fontWeight: 600,
                color: "#047857",
                background: "#f0fdf4",
                border: "2px solid #a7f3d0",
                borderRadius: "8px",
                padding: "0.85rem",
                width: "100%",
                outline: "none",
              }}
            />

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.5rem" }}>
              <span style={{ fontSize: "0.8rem", color: "#64748b" }}>
                Longueur brute : <b>{Math.floor(inputHex.replace(/\s/g, "").length / 2)}</b> octets ({decodedTlv.tags.length} tags reconnus)
              </span>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <button
                  onClick={() => {
                    const jsonStr = JSON.stringify(decodedTlv, null, 2);
                    navigator.clipboard.writeText(jsonStr);
                    alert("Structure JSON des tags EMV copiée dans le presse-papier !");
                  }}
                  className="btn-ghost"
                  style={{ padding: "0.35rem 0.85rem", fontSize: "0.8rem" }}
                >
                  📋 Exporter JSON
                </button>
                <button onClick={() => setInputHex("")} className="btn-ghost" style={{ padding: "0.35rem 0.85rem", fontSize: "0.8rem" }}>
                  Effacer
                </button>
              </div>
            </div>
          </div>

          {/* Synthèse TVR Détecté */}
          {decodedTlv.tvrSummary && (
            <div
              className="card"
              style={{
                borderLeft: "4px solid #b91c1c",
                background: decodedTlv.tvrSummary.criticalFlags.length > 0 ? "#fef2f2" : "#f8fafc",
                border: "1px solid #e2e8f0",
                borderLeftWidth: "4px",
                borderLeftColor: decodedTlv.tvrSummary.criticalFlags.length > 0 ? "#b91c1c" : "#059669",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem", flexWrap: "wrap", gap: "0.5rem" }}>
                <h3 style={{ fontSize: "1rem", fontWeight: 800, color: "#0f172a", margin: 0 }}>
                  Diagnostic Sécurité : TVR Détecté (Tag 95 = <code>{decodedTlv.tvrSummary.rawHex}</code>)
                </h3>
                <button
                  onClick={() => {
                    setTvrInput(decodedTlv.tvrSummary?.rawHex || "");
                    setActiveTab("TVR_TOOL");
                  }}
                  className="btn-primary"
                  style={{ fontSize: "0.78rem", padding: "0.35rem 0.75rem" }}
                >
                  Voir l&apos;arbre de décision complet ➜
                </button>
              </div>

              {decodedTlv.tvrSummary.criticalFlags.length > 0 ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
                  <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "#991b1b" }}>
                    Anomalies Critiques Expliquant le Refus / Dégradation :
                  </span>
                  {decodedTlv.tvrSummary.criticalFlags.map((flag, i) => (
                    <p key={i} style={{ color: "#b91c1c", fontSize: "0.86rem", margin: 0, fontWeight: 600 }}>
                      🚨 {flag}
                    </p>
                  ))}
                </div>
              ) : (
                <p style={{ color: "#059669", fontSize: "0.88rem", margin: 0, fontWeight: 600 }}>
                  ✅ Aucun drapeau critique d&apos;échec dans le TVR. Contrôles de sécurité terminaux nominaux.
                </p>
              )}

              {/* Bouton de Lancement du Copilot EMV Agent */}
              <div style={{ marginTop: "1rem", paddingTop: "0.75rem", borderTop: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.5rem" }}>
                <button
                  type="button"
                  onClick={handleRunEmvCopilot}
                  disabled={copilotLoading || !inputHex.trim()}
                  style={{
                    background: copilotLoading
                      ? "#a1a1aa"
                      : "linear-gradient(135deg, #0284c7 0%, #0369a1 100%)",
                    color: "#ffffff",
                    padding: "0.6rem 1.25rem",
                    borderRadius: "8px",
                    fontWeight: 700,
                    fontSize: "0.85rem",
                    cursor: copilotLoading ? "not-allowed" : "pointer",
                    border: "none",
                    boxShadow: "0 4px 12px rgba(2,132,199,0.3)",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  {copilotLoading ? (
                    <>⚙️ Analyse Experte EMV Agentic en cours...</>
                  ) : (
                    <>✨ Lancer l&apos;Analyse Experte Copilot EMV (Tag 95 &amp; TVR)</>
                  )}
                </button>
              </div>

              {copilotError && (
                <div style={{ marginTop: "0.75rem", padding: "0.75rem", background: "#fef2f2", color: "#991b1b", borderRadius: "8px", fontSize: "0.85rem", border: "1px solid #fecaca" }}>
                  ⚠️ {copilotError}
                </div>
              )}
            </div>
          )}

          {/* Rendu du Résultat de l'Agent Copilot */}
          {copilotResult && (
            <div
              className="card"
              style={{
                background: "#f0fdf4",
                border: "2px solid #86efac",
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #bbf7d0", paddingBottom: "0.5rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <span style={{ fontSize: "1.2rem" }}>🤖</span>
                  <h4 style={{ margin: 0, fontWeight: 800, color: "#166534", fontSize: "1.05rem" }}>
                    {copilotResult.summaryTitle}
                  </h4>
                </div>
                <span
                  style={{
                    padding: "0.25rem 0.75rem",
                    borderRadius: "9999px",
                    fontSize: "0.75rem",
                    fontWeight: 800,
                    background: copilotResult.riskLevel === "CRITICAL" ? "#ef4444" : copilotResult.riskLevel === "WARNING" ? "#f59e0b" : "#10b981",
                    color: "#ffffff",
                  }}
                >
                  NIVEAU : {copilotResult.riskLevel}
                </span>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1rem" }}>
                <div>
                  <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#15803d" }}>Type Cryptogramme :</span>
                  <p style={{ margin: "0.2rem 0 0", fontWeight: 700, color: "#1e293b", fontSize: "0.9rem" }}>{copilotResult.cryptoType}</p>
                </div>
                <div>
                  <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#15803d" }}>Diagnostic TVR Détecté :</span>
                  <p style={{ margin: "0.2rem 0 0", color: "#334155", fontSize: "0.85rem" }}>{copilotResult.tvrAnalysisDetail}</p>
                </div>
              </div>

              <div>
                <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#15803d" }}>Explication Métier &amp; Impact Monétique :</span>
                <p style={{ margin: "0.2rem 0 0", color: "#1e293b", fontSize: "0.88rem", lineHeight: 1.5 }}>
                  {copilotResult.copilotExplanation}
                </p>
              </div>

              <div>
                <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#15803d" }}>Actions Recommandées pour l&apos;Opérateur :</span>
                <ul style={{ margin: "0.4rem 0 0", paddingLeft: "1.2rem", fontSize: "0.85rem", color: "#166534", display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                  {copilotResult.recommendedActions.map((action, i) => (
                    <li key={i}>{action}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Liste Détaillée des Tags TLV Décodés */}
          <div className="card" style={{ display: "flex", flexDirection: "column", gap: "1rem", background: "#ffffff", border: "1px solid #e2e8f0" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.5rem" }}>
              <h3 style={{ fontSize: "1.05rem", fontWeight: 800, color: "#0f172a", margin: 0 }}>
                Structure des Tags TLV Extraits ({filteredTags.length} / {decodedTlv.tags.length})
              </h3>
              <input
                type="text"
                placeholder="Filtrer par tag, nom ou valeur..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  padding: "0.4rem 0.8rem",
                  fontSize: "0.82rem",
                  borderRadius: "6px",
                  border: "1px solid #cbd5e1",
                  width: "240px",
                }}
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {filteredTags.map((tagObj, idx) => (
                <div
                  key={`${tagObj.tag}-${idx}`}
                  style={{
                    border: tagObj.spec?.criticalForOperator ? "1.5px solid #0284c7" : "1px solid #e2e8f0",
                    borderRadius: "8px",
                    padding: "0.85rem",
                    background: tagObj.spec?.criticalForOperator ? "#f0f9ff" : "#f8fafc",
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.4rem",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.5rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <span
                        style={{
                          background: tagObj.spec?.criticalForOperator ? "#0284c7" : "#475569",
                          color: "#ffffff",
                          fontFamily: "monospace",
                          fontWeight: 800,
                          fontSize: "0.85rem",
                          padding: "0.2rem 0.5rem",
                          borderRadius: "4px",
                        }}
                      >
                        Tag {tagObj.tag}
                      </span>
                      <span style={{ fontWeight: 800, fontSize: "0.92rem", color: "#0f172a" }}>
                        {tagObj.name}
                      </span>
                      {tagObj.isConstructed && (
                        <span style={{ background: "#e0e7ff", color: "#3730a3", fontSize: "0.7rem", fontWeight: 700, padding: "0.1rem 0.4rem", borderRadius: "4px" }}>
                          Template Construit
                        </span>
                      )}
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <span style={{ fontSize: "0.75rem", color: "#64748b" }}>
                        Longueur : <b>{tagObj.length}</b> octet(s)
                      </span>
                      <button
                        onClick={() => handleCopyTag(tagObj.tag, tagObj.rawHex)}
                        className="btn-ghost"
                        style={{ padding: "0.2rem 0.5rem", fontSize: "0.72rem" }}
                      >
                        {copiedTag === tagObj.tag ? "✅ Copié" : "📋 Copier"}
                      </button>
                    </div>
                  </div>

                  {/* Valeur brute & Valeur interprétée */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.2rem", marginTop: "0.2rem" }}>
                    <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", flexWrap: "wrap" }}>
                      <span style={{ fontSize: "0.75rem", color: "#64748b", fontWeight: 700 }}>Valeur Brute (Hex) :</span>
                      <code style={{ fontSize: "0.82rem", fontFamily: "monospace", color: "#0f172a", wordBreak: "break-all" }}>
                        {tagObj.displayValue}
                      </code>
                    </div>

                    {tagObj.formattedValue && (
                      <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", flexWrap: "wrap" }}>
                        <span style={{ fontSize: "0.75rem", color: "#0284c7", fontWeight: 700 }}>Interprétation Métier :</span>
                        <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "#0369a1" }}>
                          💡 {tagObj.formattedValue}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Astuce de Diagnostic si disponible */}
                  {tagObj.spec?.diagnosticTip && (
                    <div style={{ marginTop: "0.3rem", padding: "0.4rem 0.6rem", background: "#ffffff", borderRadius: "6px", border: "1px dashed #bae6fd" }}>
                      <p style={{ margin: 0, fontSize: "0.78rem", color: "#0369a1", lineHeight: 1.4 }}>
                        ℹ️ <b>Astuce Exploitation :</b> {tagObj.spec.diagnosticTip}
                      </p>
                    </div>
                  )}

                  {/* Sous-tags si Template Construit (ex: 77) */}
                  {tagObj.children && tagObj.children.length > 0 && (
                    <div style={{ marginTop: "0.5rem", paddingLeft: "1rem", borderLeft: "2px solid #38bdf8", display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                      <span style={{ fontSize: "0.75rem", fontWeight: 800, color: "#0284c7" }}>
                        ↳ Sous-Tags Encapsulés ({tagObj.children.length}) :
                      </span>
                      {tagObj.children.map((child, cIdx) => (
                        <div key={cIdx} style={{ fontSize: "0.8rem", background: "#ffffff", padding: "0.35rem 0.6rem", borderRadius: "4px", border: "1px solid #e2e8f0" }}>
                          <b>Tag {child.tag}</b> ({child.name}) : <code style={{ color: "#047857" }}>{child.displayValue}</code>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* CONTENU ONGLET 2 : AUDIT DE SÉCURITÉ CRYPTOGRAMME & RISQUE */}
      {activeTab === "SECURITY_AUDIT" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          {/* Synthèse globale du risque */}
          <div
            className="card"
            style={{
              background:
                decodedTlv.securityAudit.riskLevel === "CRITIQUE"
                  ? "#fef2f2"
                  : decodedTlv.securityAudit.riskLevel === "MOYEN"
                  ? "#fffbeb"
                  : "#f0fdf4",
              border: `2px solid ${
                decodedTlv.securityAudit.riskLevel === "CRITIQUE"
                  ? "#ef4444"
                  : decodedTlv.securityAudit.riskLevel === "MOYEN"
                  ? "#f59e0b"
                  : "#10b981"
              }`,
              padding: "1.25rem",
              display: "flex",
              flexDirection: "column",
              gap: "0.85rem",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.5rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <span style={{ fontSize: "1.5rem" }}>
                  {decodedTlv.securityAudit.riskLevel === "CRITIQUE" ? "🛑" : decodedTlv.securityAudit.riskLevel === "MOYEN" ? "⚠️" : "✅"}
                </span>
                <div>
                  <h3 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 800, color: "#0f172a" }}>
                    {decodedTlv.securityAudit.riskVerdictLabel}
                  </h3>
                  <p style={{ margin: "0.2rem 0 0", fontSize: "0.8rem", color: "#64748b" }}>
                    Évaluation automatique du paquet EMV selon les critères EMV Book 3 &amp; 4
                  </p>
                </div>
              </div>

              <span
                style={{
                  padding: "0.35rem 0.85rem",
                  borderRadius: "9999px",
                  fontSize: "0.8rem",
                  fontWeight: 900,
                  background:
                    decodedTlv.securityAudit.riskLevel === "CRITIQUE"
                      ? "#dc2626"
                      : decodedTlv.securityAudit.riskLevel === "MOYEN"
                      ? "#d97706"
                      : "#059669",
                  color: "#ffffff",
                }}
              >
                RISQUE {decodedTlv.securityAudit.riskLevel}
              </span>
            </div>

            {/* Grille des Métriques Clés */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "0.75rem" }}>
              <div style={{ background: "#ffffff", padding: "0.75rem", borderRadius: "8px", border: "1px solid #cbd5e1" }}>
                <span style={{ fontSize: "0.75rem", color: "#64748b", fontWeight: 700 }}>Cryptogramme (Tag 9F27 / 9F26)</span>
                <p style={{ margin: "0.25rem 0 0", fontSize: "1rem", fontWeight: 800, color: "#0f172a" }}>
                  {decodedTlv.securityAudit.cryptogramType}
                </p>
                <span style={{ fontSize: "0.72rem", color: "#0284c7" }}>
                  {decodedTlv.securityAudit.cryptogramType === "ARQC"
                    ? "Demande en ligne vers Switch"
                    : decodedTlv.securityAudit.cryptogramType === "TC"
                    ? "Accord hors-ligne accepté"
                    : decodedTlv.securityAudit.cryptogramType === "AAC"
                    ? "Refus local absolu puce"
                    : "Non défini"}
                </span>
              </div>

              <div style={{ background: "#ffffff", padding: "0.75rem", borderRadius: "8px", border: "1px solid #cbd5e1" }}>
                <span style={{ fontSize: "0.75rem", color: "#64748b", fontWeight: 700 }}>Compteur ATC (Tag 9F36)</span>
                <p style={{ margin: "0.25rem 0 0", fontSize: "1rem", fontWeight: 800, color: "#0f172a" }}>
                  {decodedTlv.securityAudit.atcDecimal !== undefined ? `#${decodedTlv.securityAudit.atcDecimal}` : "N/A"}
                </p>
                <span style={{ fontSize: "0.72rem", color: "#059669" }}>Incrémenté à chaque opération</span>
              </div>

              <div style={{ background: "#ffffff", padding: "0.75rem", borderRadius: "8px", border: "1px solid #cbd5e1" }}>
                <span style={{ fontSize: "0.75rem", color: "#64748b", fontWeight: 700 }}>Montant Autorisé (Tag 9F02)</span>
                <p style={{ margin: "0.25rem 0 0", fontSize: "1rem", fontWeight: 800, color: "#0f172a" }}>
                  {decodedTlv.securityAudit.amountFormatted || "0.00"} {decodedTlv.securityAudit.currencyLabel || ""}
                </p>
                <span style={{ fontSize: "0.72rem", color: "#64748b" }}>
                  {decodedTlv.securityAudit.transactionTypeLabel || "Opération standard"}
                </span>
              </div>

              <div style={{ background: "#ffffff", padding: "0.75rem", borderRadius: "8px", border: "1px solid #cbd5e1" }}>
                <span style={{ fontSize: "0.75rem", color: "#64748b", fontWeight: 700 }}>Aléa Terminal (Tag 9F37)</span>
                <p style={{ margin: "0.25rem 0 0", fontSize: "0.95rem", fontWeight: 800, fontFamily: "monospace", color: "#0f172a" }}>
                  {decodedTlv.securityAudit.unpredictableNumberHex || "Non transmis"}
                </p>
                <span style={{ fontSize: "0.72rem", color: "#64748b" }}>Garantie anti-rejeu</span>
              </div>
            </div>

            {/* Motifs Forensiques */}
            <div>
              <span style={{ fontSize: "0.8rem", fontWeight: 800, color: "#0f172a" }}>
                Facteurs de Risque &amp; Constats de Contrôle :
              </span>
              <ul style={{ margin: "0.35rem 0 0", paddingLeft: "1.2rem", fontSize: "0.85rem", color: "#334155", display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                {decodedTlv.securityAudit.forensicReasons.map((reason, idx) => (
                  <li key={idx}>{reason}</li>
                ))}
              </ul>
            </div>

            {/* Actions Recommandées pour l'Exploitation Monétique */}
            <div style={{ background: "#ffffff", padding: "0.85rem", borderRadius: "8px", border: "1px dashed #cbd5e1" }}>
              <span style={{ fontSize: "0.8rem", fontWeight: 800, color: "#166534" }}>
                📋 Conduite à Tenir pour l&apos;Exploitant Monétique / Switch :
              </span>
              <ul style={{ margin: "0.35rem 0 0", paddingLeft: "1.2rem", fontSize: "0.85rem", color: "#15803d", display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                {decodedTlv.securityAudit.recommendedActions.map((action, idx) => (
                  <li key={idx}>{action}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* CONTENU ONGLET 3 : ANALYSEUR TVR DÉDIÉ (TAG 95) */}
      {activeTab === "TVR_TOOL" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {/* Saisie directe TVR */}
          <div className="card" style={{ display: "flex", flexDirection: "column", gap: "1rem", background: "#ffffff", border: "1px solid #e2e8f0" }}>
            <label style={{ fontWeight: 700, fontSize: "0.95rem", color: "#0f172a" }}>
              Saisie manuelle du TVR (5 octets / 10 caractères hexadécimaux) :
            </label>
            <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
              <input
                type="text"
                maxLength={10}
                value={tvrInput}
                onChange={(e) => setTvrInput(e.target.value.toUpperCase())}
                placeholder="Ex: 0000048000"
                style={{
                  fontFamily: "monospace",
                  fontSize: "1.2rem",
                  fontWeight: 900,
                  letterSpacing: "2px",
                  color: "#047857",
                  background: "#f0fdf4",
                  border: "2px solid #a7f3d0",
                  padding: "0.5rem 1rem",
                  borderRadius: "8px",
                  width: "280px",
                }}
              />
              <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", alignItems: "center" }}>
                <span style={{ fontSize: "0.8rem", color: "#64748b", fontWeight: 600 }}>Presets :</span>
                <button onClick={() => setTvrInput("0000048000")} className="btn-ghost" style={{ fontSize: "0.78rem" }}>
                  PIN faux (0000048000)
                </button>
                <button onClick={() => setTvrInput("0040000000")} className="btn-ghost" style={{ fontSize: "0.78rem" }}>
                  Carte Expirée (0040000000)
                </button>
                <button onClick={() => setTvrInput("4000000000")} className="btn-ghost" style={{ fontSize: "0.78rem" }}>
                  SDA Échoué (4000000000)
                </button>
                <button onClick={() => setTvrInput("0000000020")} className="btn-ghost" style={{ fontSize: "0.78rem" }}>
                  Script Échoué (0000000020)
                </button>
                <button onClick={() => setTvrInput("0000000000")} className="btn-ghost" style={{ fontSize: "0.78rem" }}>
                  Zéro Nominal (0000000000)
                </button>
              </div>
            </div>
          </div>

          {/* Grille détaillée des 40 bits TVR */}
          <div className="card" style={{ display: "flex", flexDirection: "column", gap: "1rem", background: "#ffffff", border: "1px solid #e2e8f0" }}>
            <h3 style={{ fontSize: "1.1rem", fontWeight: 800, color: "#0f172a" }}>
              Décomposition des 40 Bits du TVR (Terminal Verification Results)
            </h3>
            <p style={{ fontSize: "0.88rem", color: "#64748b" }}>
              Chaque bit représente un test de sécurité précis exécuté par le terminal. Les bits à 1 signalent les anomalies.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {[1, 2, 3, 4, 5].map((byteNum) => {
                const byteBits = standaloneTvr.results.filter((b) => b.byte === byteNum);
                const byteLabels = [
                  "Octet 1 : Authentification des Données Carte (Offline CAM)",
                  "Octet 2 : Contrôle des Dates & Restrictions d'Application",
                  "Octet 3 : Vérification du Porteur (CVM & PIN)",
                  "Octet 4 : Gestion des Risques Terminal (Plafonds & Sélections)",
                  "Octet 5 : Décision Terminal & Authentification Émetteur",
                ];

                return (
                  <div key={byteNum} style={{ border: "1px solid #e2e8f0", borderRadius: "8px", padding: "1rem", background: "#f8fafc" }}>
                    <h4 style={{ fontSize: "0.95rem", fontWeight: 800, color: "#0f172a", marginBottom: "0.75rem" }}>
                      {byteLabels[byteNum - 1]}
                    </h4>

                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "0.6rem" }}>
                      {byteBits.map((bit) => (
                        <div
                          key={`${bit.byte}-${bit.bit}`}
                          style={{
                            display: "flex",
                            alignItems: "flex-start",
                            gap: "0.6rem",
                            padding: "0.5rem 0.75rem",
                            borderRadius: "6px",
                            background: bit.isSet
                              ? bit.severity === "CRITICAL"
                                ? "#fee2e2"
                                : "#fef3c7"
                              : "#ffffff",
                            border: bit.isSet
                              ? bit.severity === "CRITICAL"
                                ? "1.5px solid #f87171"
                                : "1.5px solid #fcd34d"
                              : "1px solid #e2e8f0",
                          }}
                        >
                          <span
                            style={{
                              fontSize: "0.8rem",
                              fontWeight: 900,
                              fontFamily: "monospace",
                              padding: "0.15rem 0.4rem",
                              borderRadius: "4px",
                              background: bit.isSet ? (bit.severity === "CRITICAL" ? "#dc2626" : "#d97706") : "#e2e8f0",
                              color: bit.isSet ? "#ffffff" : "#64748b",
                            }}
                          >
                            b{bit.bit}
                          </span>
                          <div style={{ display: "flex", flexDirection: "column" }}>
                            <span style={{ fontSize: "0.82rem", fontWeight: 700, color: bit.isSet ? "#0f172a" : "#475569" }}>
                              {bit.label}
                            </span>
                            <span style={{ fontSize: "0.75rem", color: bit.isSet ? "#991b1b" : "#64748b" }}>
                              {bit.meaning}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* CONTENU ONGLET 4 : ANALYSEUR TSI (TAG 9B) */}
      {activeTab === "TSI_TOOL" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <div className="card" style={{ display: "flex", flexDirection: "column", gap: "1rem", background: "#ffffff", border: "1px solid #e2e8f0" }}>
            <label style={{ fontWeight: 700, fontSize: "0.95rem", color: "#0f172a" }}>
              Saisie du TSI (2 octets / 4 caractères hexadécimaux) :
            </label>
            <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
              <input
                type="text"
                maxLength={4}
                value={tsiInput}
                onChange={(e) => setTsiInput(e.target.value.toUpperCase())}
                placeholder="Ex: E800"
                style={{
                  fontFamily: "monospace",
                  fontSize: "1.2rem",
                  fontWeight: 900,
                  letterSpacing: "2px",
                  color: "#0369a1",
                  background: "#f0f9ff",
                  border: "2px solid #bae6fd",
                  padding: "0.5rem 1rem",
                  borderRadius: "8px",
                  width: "200px",
                }}
              />
              <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", alignItems: "center" }}>
                <span style={{ fontSize: "0.8rem", color: "#64748b", fontWeight: 600 }}>Presets :</span>
                <button onClick={() => setTsiInput("E800")} className="btn-ghost" style={{ fontSize: "0.78rem" }}>
                  Complet Nominal (E800)
                </button>
                <button onClick={() => setTsiInput("6800")} className="btn-ghost" style={{ fontSize: "0.78rem" }}>
                  Sans Auth Hors-Ligne (6800)
                </button>
                <button onClick={() => setTsiInput("A000")} className="btn-ghost" style={{ fontSize: "0.78rem" }}>
                  Sans CVM Porteur (A000)
                </button>
                <button onClick={() => setTsiInput("0000")} className="btn-ghost" style={{ fontSize: "0.78rem" }}>
                  Aucune Action (0000)
                </button>
              </div>
            </div>
          </div>

          {/* Grille Checklist TSI */}
          <div className="card" style={{ display: "flex", flexDirection: "column", gap: "1rem", background: "#ffffff", border: "1px solid #e2e8f0" }}>
            <h3 style={{ fontSize: "1.05rem", fontWeight: 800, color: "#0f172a", margin: 0 }}>
              Suivi des Étapes de Sécurité Réellement Exécutées (TSI Tag 9B)
            </h3>
            <p style={{ fontSize: "0.85rem", color: "#64748b", margin: 0 }}>
              Le TSI prouve formellement si une étape EMV obligatoire a été tentée ou ignorée par le lecteur.
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "0.75rem" }}>
              {standaloneTsi.results.map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "0.6rem",
                    padding: "0.75rem",
                    borderRadius: "8px",
                    background: item.isSet ? "#f0fdf4" : "#f8fafc",
                    border: item.isSet ? "1.5px solid #86efac" : "1px solid #e2e8f0",
                  }}
                >
                  <span style={{ fontSize: "1.2rem" }}>{item.isSet ? "✅" : "⚪"}</span>
                  <div>
                    <span style={{ fontSize: "0.85rem", fontWeight: 700, color: item.isSet ? "#166534" : "#64748b" }}>
                      {item.label}
                    </span>
                    <p style={{ margin: "0.2rem 0 0", fontSize: "0.75rem", color: item.isSet ? "#15803d" : "#94a3b8" }}>
                      {item.meaning}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* CONTENU ONGLET 5 : PROFIL AIP (TAG 82) & CVM (TAG 9F34) */}
      {activeTab === "AIP_CVM_TOOL" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {/* Saisie AIP & CVM */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "1rem" }}>
            {/* AIP */}
            <div className="card" style={{ display: "flex", flexDirection: "column", gap: "0.75rem", background: "#ffffff", border: "1px solid #e2e8f0" }}>
              <label style={{ fontWeight: 700, fontSize: "0.9rem", color: "#0f172a" }}>
                AIP - Profil d&apos;Interchange Applicatif (Tag 82, 2 octets) :
              </label>
              <input
                type="text"
                maxLength={4}
                value={aipInput}
                onChange={(e) => setAipInput(e.target.value.toUpperCase())}
                placeholder="Ex: 3800"
                style={{
                  fontFamily: "monospace",
                  fontSize: "1.1rem",
                  fontWeight: 900,
                  letterSpacing: "2px",
                  color: "#0369a1",
                  background: "#f0f9ff",
                  border: "2px solid #bae6fd",
                  padding: "0.5rem 0.85rem",
                  borderRadius: "8px",
                }}
              />
              <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
                <span style={{ fontSize: "0.75rem", color: "#64748b" }}>Presets :</span>
                <button onClick={() => setAipInput("3800")} className="btn-ghost" style={{ fontSize: "0.75rem" }}>DDA + CVM (3800)</button>
                <button onClick={() => setAipInput("2000")} className="btn-ghost" style={{ fontSize: "0.75rem" }}>Sans Contact (2000)</button>
                <button onClick={() => setAipInput("1800")} className="btn-ghost" style={{ fontSize: "0.75rem" }}>SDA + CVM (1800)</button>
              </div>
            </div>

            {/* CVM */}
            <div className="card" style={{ display: "flex", flexDirection: "column", gap: "0.75rem", background: "#ffffff", border: "1px solid #e2e8f0" }}>
              <label style={{ fontWeight: 700, fontSize: "0.9rem", color: "#0f172a" }}>
                CVM Results - Résultat Vérification Porteur (Tag 9F34, 3 octets) :
              </label>
              <input
                type="text"
                maxLength={6}
                value={cvmInput}
                onChange={(e) => setCvmInput(e.target.value.toUpperCase())}
                placeholder="Ex: 020102"
                style={{
                  fontFamily: "monospace",
                  fontSize: "1.1rem",
                  fontWeight: 900,
                  letterSpacing: "2px",
                  color: "#047857",
                  background: "#f0fdf4",
                  border: "2px solid #a7f3d0",
                  padding: "0.5rem 0.85rem",
                  borderRadius: "8px",
                }}
              />
              <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
                <span style={{ fontSize: "0.75rem", color: "#64748b" }}>Presets :</span>
                <button onClick={() => setCvmInput("020102")} className="btn-ghost" style={{ fontSize: "0.75rem" }}>Online PIN Succès (020102)</button>
                <button onClick={() => setCvmInput("010001")} className="btn-ghost" style={{ fontSize: "0.75rem" }}>Offline PIN Échec (010001)</button>
                <button onClick={() => setCvmInput("1E0302")} className="btn-ghost" style={{ fontSize: "0.75rem" }}>Signature Succès (1E0302)</button>
              </div>
            </div>
          </div>

          {/* Analyse Détaillée AIP */}
          <div className="card" style={{ display: "flex", flexDirection: "column", gap: "0.75rem", background: "#ffffff", border: "1px solid #e2e8f0" }}>
            <h3 style={{ fontSize: "1rem", fontWeight: 800, color: "#0f172a", margin: 0 }}>
              Capacités Cryptographiques Supportées par la Puce (AIP = <code>{aipInput}</code>)
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "0.6rem" }}>
              {standaloneAip.results.map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "0.5rem",
                    padding: "0.6rem",
                    borderRadius: "6px",
                    background: item.isSet ? "#f0fdf4" : "#f8fafc",
                    border: item.isSet ? "1.5px solid #86efac" : "1px solid #e2e8f0",
                  }}
                >
                  <span>{item.isSet ? "🛡️" : "⚪"}</span>
                  <div>
                    <span style={{ fontSize: "0.82rem", fontWeight: 700, color: item.isSet ? "#166534" : "#64748b" }}>
                      {item.label}
                    </span>
                    <p style={{ margin: "0.15rem 0 0", fontSize: "0.72rem", color: item.isSet ? "#15803d" : "#94a3b8" }}>
                      {item.meaning}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Analyse Détaillée CVM Results */}
          <div className="card" style={{ display: "flex", flexDirection: "column", gap: "0.75rem", background: "#ffffff", border: "1px solid #e2e8f0" }}>
            <h3 style={{ fontSize: "1rem", fontWeight: 800, color: "#0f172a", margin: 0 }}>
              Décomposition du Résultat CVM (Tag 9F34 = <code>{cvmInput}</code>)
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "0.75rem" }}>
              <div style={{ background: "#f8fafc", padding: "0.75rem", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
                <span style={{ fontSize: "0.72rem", color: "#64748b", fontWeight: 700 }}>Octet 1 : Méthode Tentée</span>
                <p style={{ margin: "0.2rem 0 0", fontSize: "0.88rem", fontWeight: 800, color: "#0f172a" }}>
                  {standaloneCvm.methodDescription}
                </p>
                <code style={{ fontSize: "0.75rem", color: "#0284c7" }}>0x{standaloneCvm.methodHex}</code>
              </div>

              <div style={{ background: "#f8fafc", padding: "0.75rem", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
                <span style={{ fontSize: "0.72rem", color: "#64748b", fontWeight: 700 }}>Octet 2 : Condition d&apos;Application</span>
                <p style={{ margin: "0.2rem 0 0", fontSize: "0.88rem", fontWeight: 800, color: "#0f172a" }}>
                  {standaloneCvm.conditionDescription}
                </p>
                <code style={{ fontSize: "0.75rem", color: "#0284c7" }}>0x{standaloneCvm.conditionHex}</code>
              </div>

              <div
                style={{
                  background: standaloneCvm.status === "SUCCESS" ? "#f0fdf4" : standaloneCvm.status === "FAILED" ? "#fef2f2" : "#f8fafc",
                  padding: "0.75rem",
                  borderRadius: "8px",
                  border: `1.5px solid ${standaloneCvm.status === "SUCCESS" ? "#86efac" : standaloneCvm.status === "FAILED" ? "#fca5a5" : "#cbd5e1"}`,
                }}
              >
                <span style={{ fontSize: "0.72rem", color: standaloneCvm.status === "SUCCESS" ? "#166534" : "#991b1b", fontWeight: 700 }}>
                  Octet 3 : Résultat de la Vérification
                </span>
                <p
                  style={{
                    margin: "0.2rem 0 0",
                    fontSize: "0.88rem",
                    fontWeight: 800,
                    color: standaloneCvm.status === "SUCCESS" ? "#15803d" : standaloneCvm.status === "FAILED" ? "#b91c1c" : "#334155",
                  }}
                >
                  {standaloneCvm.resultDescription}
                </p>
                <code style={{ fontSize: "0.75rem", color: standaloneCvm.status === "SUCCESS" ? "#166534" : "#dc2626" }}>
                  0x{standaloneCvm.resultHex}
                </code>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
