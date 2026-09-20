"use client";

import { useState } from "react";
import { AppShell } from "@/modules/layout/AppShell";
import { CBS_LOG_RULES, CbsLogRule } from "@/modules/cbs/cbs-advanced-data";

export default function CbsLogAnalyzerPage() {
  const [logText, setLogText] = useState(
    `[2026-09-20T02:41:14.321] ERROR B_CPT_ARRETE: ORA-00054: resource busy and acquire with NOWAIT specified or timeout expired\n[2026-09-20T02:41:14.322] Process 14229 waiting on table AMPLITUDE.BKCOM\n[2026-09-20T02:41:14.323] Tuxedo Service SV_COMPTE returned TPESVCERR`
  );
  const [analyzedRules, setAnalyzedRules] = useState<CbsLogRule[]>([]);
  const [hasAnalyzed, setHasAnalyzed] = useState(false);

  const handleAnalyze = () => {
    const matched = CBS_LOG_RULES.filter((rule) => {
      if (typeof rule.pattern === "string") {
        return logText.includes(rule.pattern);
      }
      return (rule.pattern as RegExp).test(logText);
    });
    setAnalyzedRules(matched);
    setHasAnalyzed(true);
  };

  const loadSample = (type: string) => {
    if (type === "ora54") {
      setLogText(
        `ORA-00054: resource busy and acquire with NOWAIT specified or timeout expired\nTable locked: BKCOM\nAttempting exclusive lock on row NCP=01001554411`
      );
    } else if (type === "ora1653") {
      setLogText(
        `ORA-01653: unable to extend table AMPLITUDE.BKCOM by 8192 in tablespace DATA_AMP\nFailed transaction: INSERT INTO BKCOM VALUES ('001', '3711', ...)`
      );
    } else if (type === "crash") {
      setLogText(
        `Fatal error in batch B_DAT_ICNE: Segmentation fault (core dumped)\nSignal 11 received from kernel. Core file written to /amp/dump/core.9982`
      );
    }
  };

  return (
    <AppShell
      pageTitle="Analyseur & Décodeur de Logs Amplitude / AIX"
      eyebrow="AMPLITUDE IT BANKING"
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "24px", maxWidth: "1200px", margin: "0 auto" }}>
        
        {/* BANDEAU SUPÉRIEUR */}
        <div style={{
          background: "linear-gradient(135deg, #1e1b4b, #0f172a)",
          border: "1px solid #6366f1",
          borderRadius: "12px",
          padding: "24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "16px"
        }}>
          <div>
            <span style={{
              background: "#6366f1",
              color: "#ffffff",
              fontSize: "12px",
              fontWeight: 700,
              padding: "4px 10px",
              borderRadius: "9999px",
              textTransform: "uppercase"
            }}>
              Moteur d'Analyse Syntaxique de Traces
            </span>
            <h2 style={{ fontSize: "22px", fontWeight: 700, color: "#f8fafc", marginTop: "8px", marginBottom: "4px" }}>
              Décodeur d'Erreurs Batch, Alert Logs & AIX
            </h2>
            <p style={{ color: "#c7d2fe", fontSize: "14px", margin: 0 }}>
              Collez vos extraits de logs bruts pour identifier instantanément les causes d'arrêt de production et obtenir la commande de remédiation.
            </p>
          </div>

          <div style={{ display: "flex", gap: "8px" }}>
            <button
              onClick={() => loadSample("ora54")}
              style={{ background: "#1e293b", color: "#cbd5e1", border: "1px solid #334155", padding: "6px 12px", borderRadius: "6px", fontSize: "12px", cursor: "pointer" }}
            >
              Exemple ORA-00054
            </button>
            <button
              onClick={() => loadSample("ora1653")}
              style={{ background: "#1e293b", color: "#cbd5e1", border: "1px solid #334155", padding: "6px 12px", borderRadius: "6px", fontSize: "12px", cursor: "pointer" }}
            >
              Exemple ORA-01653
            </button>
            <button
              onClick={() => loadSample("crash")}
              style={{ background: "#1e293b", color: "#cbd5e1", border: "1px solid #334155", padding: "6px 12px", borderRadius: "6px", fontSize: "12px", cursor: "pointer" }}
            >
              Exemple SIGSEGV
            </button>
          </div>
        </div>

        {/* ZONE DE SAISIE DE LOG */}
        <div style={{ background: "#1e293b", borderRadius: "12px", border: "1px solid #334155", padding: "20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
            <label style={{ fontSize: "14px", fontWeight: 600, color: "#f8fafc" }}>
              Traces brutes (Log Batch Amplitude, Tuxedo, Syslog AIX, Oracle Alert Log) :
            </label>
            <span style={{ fontSize: "12px", color: "#94a3b8" }}>
              {logText.split("\n").length} lignes
            </span>
          </div>

          <textarea
            value={logText}
            onChange={(e) => setLogText(e.target.value)}
            rows={7}
            style={{
              width: "100%",
              padding: "14px",
              borderRadius: "8px",
              background: "#090d16",
              border: "1px solid #334155",
              color: "#38bdf8",
              fontFamily: "monospace",
              fontSize: "13px",
              lineHeight: "1.5",
              resize: "vertical"
            }}
          />

          <div style={{ marginTop: "14px", display: "flex", justifyContent: "flex-end" }}>
            <button
              onClick={handleAnalyze}
              style={{
                background: "#6366f1",
                color: "#ffffff",
                border: "none",
                borderRadius: "8px",
                padding: "10px 24px",
                fontSize: "14px",
                fontWeight: 700,
                cursor: "pointer",
                boxShadow: "0 4px 14px rgba(99, 102, 241, 0.4)"
              }}
            >
              🔍 Lancer l'Analyse Diagnostique
            </button>
          </div>
        </div>

        {/* RÉSULTATS D'ANALYSE */}
        {hasAnalyzed && (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <h3 style={{ fontSize: "18px", fontWeight: 700, color: "#f8fafc" }}>
              Résultats du diagnostic ({analyzedRules.length} anomalie{analyzedRules.length > 1 ? "s" : ""} détectée{analyzedRules.length > 1 ? "s" : ""})
            </h3>

            {analyzedRules.length === 0 ? (
              <div style={{
                background: "#0f172a",
                border: "1px solid #334155",
                borderRadius: "10px",
                padding: "24px",
                textAlign: "center",
                color: "#94a3b8"
              }}>
                Aucun motif critique standard identifié dans l'extrait fourni.
              </div>
            ) : (
              analyzedRules.map((r, idx) => (
                <div
                  key={idx}
                  style={{
                    background: "#1e293b",
                    border: `1px solid ${r.severity === "CRITICAL" ? "#ef4444" : "#f59e0b"}`,
                    borderRadius: "12px",
                    padding: "20px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px"
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{
                      background: r.severity === "CRITICAL" ? "#dc2626" : "#d97706",
                      color: "#ffffff",
                      fontSize: "11px",
                      fontWeight: 700,
                      padding: "3px 8px",
                      borderRadius: "4px"
                    }}>
                      {r.severity} • {r.source}
                    </span>
                    <span style={{ fontSize: "12px", color: "#94a3b8" }}>Reconnaissance de signature d'incident</span>
                  </div>

                  <h4 style={{ fontSize: "16px", fontWeight: 700, color: "#f8fafc", margin: 0 }}>
                    {r.title}
                  </h4>

                  <p style={{ fontSize: "14px", color: "#cbd5e1", margin: 0, lineHeight: "1.5" }}>
                    {r.explanation}
                  </p>

                  <div style={{
                    background: "#0f172a",
                    border: "1px solid #334155",
                    borderRadius: "8px",
                    padding: "14px",
                    marginTop: "4px"
                  }}>
                    <div style={{ fontSize: "12px", fontWeight: 700, color: "#38bdf8", textTransform: "uppercase", marginBottom: "4px" }}>
                      Plan d'action & Commande de secours :
                    </div>
                    <div style={{ fontSize: "13px", color: "#34d399", fontFamily: "monospace", lineHeight: "1.4" }}>
                      {r.recommendedAction}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

      </div>
    </AppShell>
  );
}
