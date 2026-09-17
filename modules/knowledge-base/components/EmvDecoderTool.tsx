"use client";

import { useState, useMemo } from "react";
import { parseEmvTlv, decodeTvrHex } from "../data/emv-tlv-decoder";

const SAMPLE_EMV_BLOBS = [
  {
    label: "DE55 Retrait EMV avec PIN Incorrect (TVR 0000048000)",
    hex: "9F26084D5E12F9884511A29F2701809F10120110A00003220000000000000000000000009F3704C8912A349F3602005A950500000480009A032409179C01019F02060000000500005F2A020952820238009F1A020952",
    desc: "Contient TVR Tag 95 avec alerte PIN try limit exceeded et Floor Limit",
  },
  {
    label: "DE55 Nominal Achat Sans Contact",
    hex: "9F2608A1B2C3D4E5F607189F2701409F100706010A03A000009F37047B8901CD9F36020112950500000000009A032409179F02060000000250005F2A02095282022000",
    desc: "Cryptogramme TC (40), TVR à zéro (0000000000), transaction nominale",
  },
];

export function EmvDecoderTool() {
  const [inputHex, setInputHex] = useState<string>(SAMPLE_EMV_BLOBS[0].hex);
  const [tvrInput, setTvrInput] = useState<string>("0000048000");
  const [activeTab, setActiveTab] = useState<"DE55" | "TVR_TOOL">("DE55");
  const [searchTerm, setSearchTerm] = useState<string>("");

  const decodedTlv = useMemo(() => {
    return parseEmvTlv(inputHex);
  }, [inputHex]);

  const standaloneTvr = useMemo(() => {
    return decodeTvrHex(tvrInput);
  }, [tvrInput]);

  const filteredTags = useMemo(() => {
    return decodedTlv.tags.filter((t) => {
      const q = searchTerm.toLowerCase().trim();
      return (
        !q ||
        t.tag.toLowerCase().includes(q) ||
        t.name.toLowerCase().includes(q) ||
        t.rawHex.toLowerCase().includes(q) ||
        (t.spec && t.spec.description.toLowerCase().includes(q))
      );
    });
  }, [decodedTlv, searchTerm]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.75rem" }}>
      {/* En-tête */}
      <div className="hero-search">
        <div>
          <p className="eyebrow accent" style={{ color: "#34d399" }}>INGÉNIERIE EMV &amp; SÉCURITÉ PUCE</p>
          <h2 style={{ fontSize: "1.4rem", fontWeight: 800 }}>Décodeur EMV / DE55 &amp; Analyseur de TVR (Tag 95)</h2>
          <p style={{ fontSize: "0.92rem", color: "#94a3b8", marginTop: "0.3rem" }}>
            Décodez instantanément les paquets TLV du champ ISO DE55, inspectez les cryptogrammes (ARQC/TC/AAC) et identifiez la cause exacte d&apos;un refus par l&apos;analyse bit-à-bit du TVR.
          </p>
        </div>
      </div>

      {/* Onglets : Décodeur TLV DE55 vs Analyseur TVR Dédié */}
      <div style={{ display: "flex", gap: "0.75rem", borderBottom: "2px solid #e2e8f0", paddingBottom: "0.5rem" }}>
        <button
          onClick={() => setActiveTab("DE55")}
          className={activeTab === "DE55" ? "btn-primary" : "btn-ghost"}
          style={{ fontSize: "0.9rem" }}
        >
          💳 Décodeur TLV DE55 Complet ({decodedTlv.tags.length} Tags)
        </button>
        <button
          onClick={() => setActiveTab("TVR_TOOL")}
          className={activeTab === "TVR_TOOL" ? "btn-primary" : "btn-ghost"}
          style={{ fontSize: "0.9rem" }}
        >
          🔬 Analyseur Bit-à-Bit TVR (Tag 95)
        </button>
      </div>

      {activeTab === "DE55" ? (
        <>
          {/* Saisie TLV DE55 */}
          <div className="card" style={{ display: "flex", flexDirection: "column", gap: "1rem", background: "#ffffff", border: "1px solid #e2e8f0" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.5rem" }}>
              <label style={{ fontWeight: 700, fontSize: "0.95rem", color: "#0f172a" }}>
                Paquet Hexadécimal DE55 (Données Puce EMV) :
              </label>
              <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                <span style={{ fontSize: "0.82rem", color: "#64748b", alignSelf: "center", fontWeight: 600 }}>Exemples :</span>
                {SAMPLE_EMV_BLOBS.map((sample, idx) => (
                  <button
                    key={idx}
                    onClick={() => setInputHex(sample.hex)}
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
              value={inputHex}
              onChange={(e) => setInputHex(e.target.value)}
              placeholder="Collez les données DE55 ici (ex: 9F26084D5E...)"
              style={{
                fontFamily: "var(--font-mono, monospace)",
                fontSize: "0.95rem",
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

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "0.8rem", color: "#64748b" }}>
                Longueur brute : <b>{inputHex.replace(/\s/g, "").length / 2}</b> octets ({decodedTlv.tags.length} tags reconnus)
              </span>
              <button onClick={() => setInputHex("")} className="btn-ghost" style={{ padding: "0.35rem 1rem", fontSize: "0.82rem" }}>
                Effacer
              </button>
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
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                <h3 style={{ fontSize: "1.05rem", fontWeight: 800, color: "#0f172a" }}>
                  Diagnostic Sécurité : TVR Détecté (Tag 95 = {decodedTlv.tvrSummary.rawHex})
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
            </div>
          )}

          {/* Tableau des Tags TLV Décodés */}
          <div className="card" style={{ display: "flex", flexDirection: "column", gap: "1.25rem", background: "#ffffff", border: "1px solid #e2e8f0" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
              <div>
                <h3 style={{ fontSize: "1.1rem", fontWeight: 800, color: "#0f172a" }}>
                  Détail des {decodedTlv.tags.length} Tags TLV
                </h3>
                <p style={{ fontSize: "0.85rem", color: "#64748b" }}>
                  Structure Tag-Length-Value selon le standard EMV Book 3
                </p>
              </div>

              <input
                type="text"
                placeholder="Rechercher tag (ex: 9F26, 95, ARQC, AID)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input"
                style={{ width: "260px", fontSize: "0.85rem", padding: "0.5rem 0.85rem" }}
              />
            </div>

            <div className="table-wrapper" style={{ border: "1px solid #e2e8f0", borderRadius: "12px", overflow: "hidden" }}>
              <table>
                <thead>
                  <tr style={{ background: "#f8fafc", borderBottom: "2px solid #e2e8f0" }}>
                    <th style={{ width: "90px", padding: "1rem", color: "#0f172a", fontWeight: 800, fontSize: "0.8rem" }}>TAG</th>
                    <th style={{ width: "230px", padding: "1rem", color: "#0f172a", fontWeight: 800, fontSize: "0.8rem" }}>LIBELLÉ DU CHAMP</th>
                    <th style={{ width: "80px", padding: "1rem", color: "#0f172a", fontWeight: 800, fontSize: "0.8rem" }}>TAILLE</th>
                    <th style={{ padding: "1rem", color: "#0f172a", fontWeight: 800, fontSize: "0.8rem" }}>VALEUR HEXADÉCIMALE</th>
                    <th style={{ width: "280px", padding: "1rem", color: "#0f172a", fontWeight: 800, fontSize: "0.8rem" }}>RÔLE &amp; CONDUITE EXPLOITANT</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTags.length === 0 ? (
                    <tr>
                      <td colSpan={5} style={{ textAlign: "center", padding: "3rem", color: "#64748b" }}>
                        Aucun tag ne correspond à votre filtre.
                      </td>
                    </tr>
                  ) : (
                    filteredTags.map((t) => (
                      <tr key={t.tag} style={{ borderBottom: "1px solid #f1f5f9" }}>
                        <td style={{ padding: "0.9rem 1rem", verticalAlign: "middle" }}>
                          <span
                            style={{
                              display: "inline-block",
                              background: t.spec?.criticalForOperator ? "#ecfdf5" : "#f1f5f9",
                              color: t.spec?.criticalForOperator ? "#047857" : "#334155",
                              border: t.spec?.criticalForOperator ? "1.5px solid #059669" : "1px solid #cbd5e1",
                              padding: "0.25rem 0.55rem",
                              borderRadius: "6px",
                              fontWeight: 900,
                              fontFamily: "monospace",
                              fontSize: "0.85rem",
                            }}
                          >
                            {t.tag}
                          </span>
                        </td>

                        <td style={{ padding: "0.9rem 1rem", verticalAlign: "middle" }}>
                          <strong style={{ color: "#0f172a", fontSize: "0.92rem", display: "block" }}>
                            {t.name}
                          </strong>
                          {t.spec?.format && (
                            <span style={{ fontSize: "0.75rem", color: "#64748b" }}>
                              Format: {t.spec.format}
                            </span>
                          )}
                        </td>

                        <td style={{ padding: "0.9rem 1rem", verticalAlign: "middle", fontSize: "0.85rem", color: "#0f172a", fontWeight: 600 }}>
                          {t.length} oct.
                        </td>

                        <td style={{ padding: "0.9rem 1rem", verticalAlign: "middle" }}>
                          <code
                            style={{
                              fontSize: "0.84rem",
                              fontWeight: 700,
                              color: "#0369a1",
                              background: "#f0f9ff",
                              border: "1px solid #bae6fd",
                              padding: "0.3rem 0.6rem",
                              borderRadius: "6px",
                              fontFamily: "monospace",
                              wordBreak: "break-all",
                            }}
                          >
                            {t.displayValue}
                          </code>
                        </td>

                        <td style={{ padding: "0.9rem 1rem", verticalAlign: "middle" }}>
                          <p style={{ fontSize: "0.82rem", color: "#334155", margin: 0, lineHeight: 1.4 }}>
                            {t.spec?.description || "Champ propriétaire."}
                          </p>
                          {t.spec?.diagnosticTip && (
                            <p style={{ fontSize: "0.78rem", color: "#b45309", margin: "0.25rem 0 0 0", fontWeight: 600 }}>
                              💡 {t.spec.diagnosticTip}
                            </p>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        /* ONGLET ANALYSEUR TVR BIT-À-BIT */
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <div className="card" style={{ display: "flex", flexDirection: "column", gap: "1rem", background: "#ffffff", border: "1px solid #e2e8f0" }}>
            <label style={{ fontWeight: 700, fontSize: "0.95rem", color: "#0f172a" }}>
              Saisie manuelle du TVR (5 octets / 10 caractères hexadécimaux) :
            </label>
            <div style={{ display: "flex", gap: "0.75rem" }}>
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
    </div>
  );
}
