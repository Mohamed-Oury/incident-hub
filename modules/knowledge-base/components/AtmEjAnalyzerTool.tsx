"use client";

import { useState, useMemo } from "react";
import { parseAtmElectronicJournal, EjAnalysisResult } from "../data/atm-ej-analyzer";

const SAMPLE_EJ_LOGS = [
  {
    label: "Incident 1 : Bourrage Billets (Bill Jam)",
    log: `14:32:01 ATM: GAB-AG-04 TID: 88776655
14:32:03 CARD INSERTED: PAN 4970101234567890
14:32:08 PIN ENTERED (EPP OK)
14:32:11 AUTH OK (HOST APPROVED, RC:00) AMOUNT: 50000 STAN: 045123
14:32:14 DISPENSE REQ: 5 NOTES OF 10000 XOF
14:32:17 HARDWARE ERROR: STACKER JAMMED IN TRANSPORT MODULE
14:32:18 BILL JAM SENSOR TRIGGERED
14:32:20 CARD EJECTED
14:32:25 TRANSACTION ABORTED - SHUTTER NOT OPENED`,
    desc: "Échec mécanique distributeur. Billets coincés avant sortie.",
  },
  {
    label: "Incident 2 : Oubli Client / Rétractation",
    log: `16:15:10 ATM: NCR-CENTRE-01 TID: 11223344
16:15:12 CARD READ: PAN 5352109876543210
16:15:18 PIN OK
16:15:22 HOST APPROVED RC:00 AMOUNT: 20000 STAN: 088912
16:15:25 DISPENSE REQ: 2 NOTES
16:15:28 SHUTTER OPENED - BILLS PRESENTED
16:15:30 CARD EJECTED AND TAKEN
16:15:58 PRESENT TIMEOUT (30 SECONDS EXCEEDED)
16:16:00 BILLS RETRACTED TO CASSETTE REJECT
16:16:02 SHUTTER CLOSED`,
    desc: "Billets présentés mais oubliés par le client et avalés dans le bac de rejet.",
  },
  {
    label: "Cas Nominal : Prise Effectuée (Contestation Frauduleuse)",
    log: `11:05:01 ATM: WINC-AG-02 TID: 44556677
11:05:04 CARD INSERTED: PAN 4023601122334455
11:05:09 PIN ENTERED
11:05:12 RESPONSE: 00 (AUTH OK) AMOUNT: 100000 STAN: 012345
11:05:15 DISPENSE START: 10 NOTES
11:05:18 SHUTTER OPENED - BILLS PRESENTED
11:05:22 CARD TAKEN
11:05:24 BILLS TAKEN - EXIT SENSOR CLEARED
11:05:25 DISPENSE OK - TRANSACTION COMPLETE`,
    desc: "Distribution complète et confirmée par les capteurs de sortie.",
  },
];

export function AtmEjAnalyzerTool() {
  const [rawLogInput, setRawLogInput] = useState<string>(SAMPLE_EJ_LOGS[0].log);

  const analysis = useMemo(() => {
    return parseAtmElectronicJournal(rawLogInput);
  }, [rawLogInput]);

  const summary = analysis.summary;

  const getVerdictBadge = () => {
    switch (summary.claimAdvice) {
      case "FAVORABLE_RECREDIT":
        return {
          bg: "#fef2f2",
          border: "#f87171",
          color: "#b91c1c",
          label: "RECRÉDIT CLIENT RECOMMANDÉ (Incident GAB Démontré)",
        };
      case "UNFAVORABLE_REJECT_CLAIM":
        return {
          bg: "#ecfdf5",
          border: "#10b981",
          color: "#047857",
          label: "REJET DE LA RÉCLAMATION (Billets Validés Sortis)",
        };
      default:
        return {
          bg: "#fef3c7",
          border: "#f59e0b",
          color: "#b45309",
          label: "INVESTIGATION CONTRADICTOIRE REQUISE",
        };
    }
  };

  const verdictBadge = getVerdictBadge();

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.75rem" }}>
      {/* En-tête */}
      <div className="hero-search">
        <div>
          <p className="eyebrow accent" style={{ color: "#34d399" }}>AUDIT &amp; RÉCLAMATIONS CLIENTS GAB</p>
          <h2 style={{ fontSize: "1.4rem", fontWeight: 800 }}>Analyseur de Journal Électronique GAB (ATM EJ Analyzer)</h2>
          <p style={{ fontSize: "0.92rem", color: "#94a3b8", marginTop: "0.3rem" }}>
            Analysez instantanément les logs journaliers d&apos;automates (NCR, Diebold Nixdorf, Wincor, Hyosung). Détectez les bourrages, rétractions, et générez la conclusion opposable pour le back-office réclamations.
          </p>
        </div>
      </div>

      {/* Saisie du journal EJ */}
      <div className="card" style={{ display: "flex", flexDirection: "column", gap: "1rem", background: "#ffffff", border: "1px solid #e2e8f0" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.5rem" }}>
          <label style={{ fontWeight: 700, fontSize: "0.95rem", color: "#0f172a" }}>
            Extrait du Journal Électronique (EJ Log) :
          </label>
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            <span style={{ fontSize: "0.82rem", color: "#64748b", alignSelf: "center", fontWeight: 600 }}>Scénarios types :</span>
            {SAMPLE_EJ_LOGS.map((sample, idx) => (
              <button
                key={idx}
                onClick={() => setRawLogInput(sample.log)}
                className="btn-ghost"
                style={{ fontSize: "0.8rem", padding: "0.3rem 0.65rem", background: "#f8fafc", border: "1px solid #cbd5e1" }}
              >
                {sample.label}
              </button>
            ))}
          </div>
        </div>

        <textarea
          rows={6}
          value={rawLogInput}
          onChange={(e) => setRawLogInput(e.target.value)}
          placeholder="Collez ici les lignes de journal GAB / EJ..."
          style={{
            fontFamily: "var(--font-mono, monospace)",
            fontSize: "0.88rem",
            fontWeight: 600,
            color: "#0f172a",
            background: "#f8fafc",
            border: "1.5px solid #cbd5e1",
            borderRadius: "8px",
            padding: "0.85rem",
            width: "100%",
            outline: "none",
            lineHeight: 1.5,
          }}
        />

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: "0.8rem", color: "#64748b" }}>
            Fabricant détecté : <b>{summary.vendor}</b> | GAB : <b>{summary.atmId || "Non spécifié"}</b>
          </span>
          <button
            onClick={() => setRawLogInput("")}
            className="btn-ghost"
            style={{ padding: "0.35rem 1rem", fontSize: "0.82rem" }}
          >
            Effacer
          </button>
        </div>
      </div>

      {/* VERDICT OPPOSABLE & DÉCISION BACK-OFFICE */}
      <div
        className="card"
        style={{
          background: verdictBadge.bg,
          border: `2px solid ${verdictBadge.border}`,
          borderRadius: "12px",
          padding: "1.25rem 1.5rem",
          display: "flex",
          flexDirection: "column",
          gap: "0.75rem",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.5rem" }}>
          <span
            style={{
              fontSize: "0.82rem",
              fontWeight: 900,
              textTransform: "uppercase",
              padding: "0.35rem 0.75rem",
              borderRadius: "6px",
              background: verdictBadge.color,
              color: "#ffffff",
              letterSpacing: "0.05em",
            }}
          >
            {verdictBadge.label}
          </span>
          <span style={{ fontSize: "0.85rem", color: "#64748b", fontWeight: 600 }}>
            Audit Piste Forensique GAB
          </span>
        </div>

        <h3 style={{ fontSize: "1.2rem", fontWeight: 800, color: "#0f172a", margin: 0 }}>
          {summary.verdictExplanation}
        </h3>

        <div style={{ background: "#ffffff", padding: "0.85rem 1rem", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
          <span style={{ fontSize: "0.8rem", textTransform: "uppercase", fontWeight: 800, color: "#059669" }}>
            👉 Conduite d&apos;Exploitation &amp; Réconciliation :
          </span>
          <p style={{ fontSize: "0.88rem", color: "#334155", margin: "0.3rem 0 0 0", lineHeight: 1.5, fontWeight: 500 }}>
            {summary.recommendedOperatorAction}
          </p>
        </div>
      </div>

      {/* Métriques clés extraites du log */}
      <div className="grid-metrics">
        <div className="metric-card">
          <span className="metric-label">Carte Porteur</span>
          <p className="metric-value" style={{ color: "#0f172a", fontSize: "1.15rem", fontFamily: "monospace" }}>
            {summary.panDetected || "Non détecté"}
          </p>
          <span style={{ fontSize: "0.75rem", color: "#059669", fontWeight: 700 }}>
            🔒 Masqué PCI-DSS
          </span>
        </div>

        <div className="metric-card">
          <span className="metric-label">Montant &amp; STAN</span>
          <p className="metric-value" style={{ color: "#0369a1" }}>
            {summary.amountDetected ? `${summary.amountDetected}` : "—"}
          </p>
          <span style={{ fontSize: "0.8rem", color: "#64748b" }}>
            STAN: <b>{summary.stanDetected || "—"}</b>
          </span>
        </div>

        <div className="metric-card">
          <span className="metric-label">Statut Mécanique</span>
          <p
            className="metric-value"
            style={{
              color: summary.hasBillJam ? "#dc2626" : summary.hasRetract ? "#d97706" : "#059669",
              fontSize: "1.1rem",
            }}
          >
            {summary.hasBillJam ? "BOURRAGE (JAM)" : summary.hasRetract ? "RÉTRACTÉ" : "MÉCANIQUE OK"}
          </p>
          <span style={{ fontSize: "0.8rem", color: "#64748b" }}>
            Billets distribués : <b>{summary.totalDispensedNotes}</b>
          </span>
        </div>
      </div>

      {/* Chronologie détaillée des événements automates */}
      <div className="card" style={{ display: "flex", flexDirection: "column", gap: "1rem", background: "#ffffff", border: "1px solid #e2e8f0" }}>
        <h3 style={{ fontSize: "1.1rem", fontWeight: 800, color: "#0f172a" }}>
          Chronologie Décodée des Événements ({analysis.events.length} Étapes)
        </h3>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
          {analysis.events.length === 0 ? (
            <p style={{ color: "#64748b", textAlign: "center", padding: "2rem" }}>
              Aucun événement identifiable dans le journal saisi.
            </p>
          ) : (
            analysis.events.map((evt, idx) => (
              <div
                key={idx}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "0.75rem 1rem",
                  borderRadius: "8px",
                  background:
                    evt.severity === "CRITICAL"
                      ? "#fef2f2"
                      : evt.severity === "SUCCESS"
                      ? "#ecfdf5"
                      : evt.severity === "WARNING"
                      ? "#fffbeb"
                      : "#f8fafc",
                  border:
                    evt.severity === "CRITICAL"
                      ? "1px solid #fecaca"
                      : evt.severity === "SUCCESS"
                      ? "1px solid #a7f3d0"
                      : evt.severity === "WARNING"
                      ? "1px solid #fde68a"
                      : "1px solid #e2e8f0",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <span
                    style={{
                      width: "28px",
                      height: "28px",
                      borderRadius: "50%",
                      display: "grid",
                      placeItems: "center",
                      fontSize: "0.8rem",
                      fontWeight: 800,
                      background:
                        evt.severity === "CRITICAL"
                          ? "#ef4444"
                          : evt.severity === "SUCCESS"
                          ? "#10b981"
                          : evt.severity === "WARNING"
                          ? "#f59e0b"
                          : "#94a3b8",
                      color: "#ffffff",
                    }}
                  >
                    {idx + 1}
                  </span>
                  <div>
                    <strong style={{ color: "#0f172a", fontSize: "0.88rem", display: "block" }}>
                      {evt.description}
                    </strong>
                    <code style={{ fontSize: "0.75rem", color: "#64748b" }}>{evt.rawLogLine}</code>
                  </div>
                </div>

                <span
                  style={{
                    fontSize: "0.72rem",
                    fontWeight: 800,
                    padding: "0.2rem 0.5rem",
                    borderRadius: "4px",
                    background: "#ffffff",
                    border: "1px solid #cbd5e1",
                    color: "#334155",
                  }}
                >
                  {evt.eventType}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
