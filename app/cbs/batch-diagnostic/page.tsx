"use client";

import { useState } from "react";
import { AppShell } from "@/modules/layout/AppShell";
import { CBS_BATCH_DIAGNOSTICS } from "@/modules/cbs/cbs-advanced-data";
import { CbsBatchIncidentScenario } from "@/modules/cbs/cbs-advanced-data";

export default function CbsBatchDiagnosticPage() {
  const [selectedScenario, setSelectedScenario] = useState<CbsBatchIncidentScenario>(CBS_BATCH_DIAGNOSTICS[0]);
  const [customStep, setCustomStep] = useState("");
  const [customErrorCode, setCustomErrorCode] = useState("");
  const [sidParam, setSidParam] = useState("142");
  const [serialParam, setSerialParam] = useState("45901");
  const [copied, setCopied] = useState(false);

  // Calculateur de Cut-off
  const [currentHour, setCurrentHour] = useState("03:30");
  const [remainingBatches, setRemainingBatches] = useState(4);
  const [avgBatchMinutes, setAvgBatchMinutes] = useState(30);

  // Calcul de l'heure estimée de fin
  const calculateEstimatedEnd = () => {
    const [h, m] = currentHour.split(":").map(Number);
    const totalRemainingMinutes = remainingBatches * avgBatchMinutes + selectedScenario.slaImpactMinutes;
    const endTotalMinutes = (h * 60 + m + totalRemainingMinutes) % (24 * 60);
    const endH = Math.floor(endTotalMinutes / 60);
    const endM = endTotalMinutes % 60;
    const formatted = `${String(endH).padStart(2, "0")}:${String(endM).padStart(2, "0")}`;
    const isPastCutoff = (endH > 7 && endH < 12) || (endH === 7 && endM > 0);
    return { formatted, totalRemainingMinutes, isPastCutoff };
  };

  const slaResult = calculateEstimatedEnd();

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getRecoveryScript = () => {
    return selectedScenario.recoveryCommand
      .replace(":SID", sidParam)
      .replace(":SERIAL", serialParam)
      .replace(":NUM_DAT", "DAT-2026-9901");
  };

  return (
    <AppShell
      pageTitle="Diagnostic de Blocage EOD & Calculateur Cut-off"
      eyebrow="AMPLITUDE IT BANKING"
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "24px", maxWidth: "1200px", margin: "0 auto" }}>
        
        {/* EN-TÊTE D'URGENCE RUN */}
        <div style={{
          background: "linear-gradient(135deg, #1e293b, #0f172a)",
          border: "1px solid rgba(239, 68, 68, 0.4)",
          borderRadius: "12px",
          padding: "24px",
          boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.3)"
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
            <div>
              <span style={{ 
                background: "#dc2626", 
                color: "#ffffff", 
                fontSize: "12px", 
                fontWeight: 700, 
                padding: "4px 10px", 
                borderRadius: "9999px",
                letterSpacing: "0.05em",
                textTransform: "uppercase"
              }}>
                Astreinte Production EOD / BOD
              </span>
              <h2 style={{ fontSize: "22px", fontWeight: 700, color: "#f8fafc", marginTop: "8px", marginBottom: "4px" }}>
                Arbre de Décision & Résolution Immédiate de Blocage
              </h2>
              <p style={{ color: "#94a3b8", fontSize: "14px" }}>
                Guide d'action rapide sous pression temporelle : diagnostic du verrou, Go/No-Go agences et calcul du cut-off de 07h00.
              </p>
            </div>
            
            <div style={{
              background: slaResult.isPastCutoff ? "rgba(239, 68, 68, 0.15)" : "rgba(34, 197, 94, 0.15)",
              border: `1px solid ${slaResult.isPastCutoff ? "#ef4444" : "#22c55e"}`,
              padding: "12px 18px",
              borderRadius: "10px",
              textAlign: "right"
            }}>
              <div style={{ fontSize: "11px", textTransform: "uppercase", color: "#94a3b8", fontWeight: 600 }}>
                Fin Estimée de la Chaîne
              </div>
              <div style={{ fontSize: "24px", fontWeight: 800, color: slaResult.isPastCutoff ? "#ef4444" : "#22c55e" }}>
                {slaResult.formatted} {slaResult.isPastCutoff ? "⚠️ RETARD BOD" : "✅ DANS LES SLA"}
              </div>
              <div style={{ fontSize: "11px", color: "#cbd5e1" }}>
                Cut-off Agences : 07h00 (SLA Banques)
              </div>
            </div>
          </div>
        </div>

        {/* CONTENU PRINCIPAL : 2 COLONNES */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
          
          {/* COLONNE GAUCHE : SÉLECTION DE L'INCIDENT ET CALCULATEUR */}
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            
            {/* SÉLECTION DU SCÉNARIO DE BLOCAGE */}
            <div style={{ background: "#1e293b", borderRadius: "12px", border: "1px solid #334155", padding: "20px" }}>
              <h3 style={{ fontSize: "16px", fontWeight: 600, color: "#f1f5f9", marginBottom: "14px", display: "flex", alignItems: "center", gap: "8px" }}>
                <span>🚨</span> Incidents Types Identifiés
              </h3>
              
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {CBS_BATCH_DIAGNOSTICS.map((sc) => (
                  <button
                    key={sc.id}
                    onClick={() => setSelectedScenario(sc)}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-start",
                      textAlign: "left",
                      padding: "12px 14px",
                      borderRadius: "8px",
                      border: selectedScenario.id === sc.id ? "2px solid #3b82f6" : "1px solid #334155",
                      background: selectedScenario.id === sc.id ? "rgba(59, 130, 246, 0.12)" : "#0f172a",
                      cursor: "pointer",
                      transition: "all 0.15s ease"
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", width: "100%", alignItems: "center" }}>
                      <span style={{ fontWeight: 700, color: "#f8fafc", fontSize: "13px" }}>
                        {sc.stepCode} — {sc.errorCode}
                      </span>
                      <span style={{
                        fontSize: "11px",
                        fontWeight: 600,
                        padding: "2px 8px",
                        borderRadius: "4px",
                        background: sc.severity.includes("CRITIQUE") ? "rgba(239, 68, 68, 0.2)" : "rgba(234, 179, 8, 0.2)",
                        color: sc.severity.includes("CRITIQUE") ? "#ef4444" : "#eab308"
                      }}>
                        {sc.severity}
                      </span>
                    </div>
                    <span style={{ fontSize: "12px", color: "#94a3b8", marginTop: "4px" }}>
                      {sc.stepName}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* CALCULATEUR D'HEURE DE FIN & CUT-OFF SLA */}
            <div style={{ background: "#1e293b", borderRadius: "12px", border: "1px solid #334155", padding: "20px" }}>
              <h3 style={{ fontSize: "16px", fontWeight: 600, color: "#f1f5f9", marginBottom: "14px", display: "flex", alignItems: "center", gap: "8px" }}>
                <span>⏱️</span> Simulateur de Fenêtre de Tir (Cut-Off)
              </h3>
              
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div>
                  <label style={{ fontSize: "12px", color: "#94a3b8", display: "block", marginBottom: "6px" }}>
                    Heure Actuelle (HH:MM)
                  </label>
                  <input
                    type="time"
                    value={currentHour}
                    onChange={(e) => setCurrentHour(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "8px 12px",
                      borderRadius: "6px",
                      background: "#0f172a",
                      border: "1px solid #475569",
                      color: "#f8fafc",
                      fontSize: "14px"
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: "12px", color: "#94a3b8", display: "block", marginBottom: "6px" }}>
                    Étapes Restantes EOD
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={remainingBatches}
                    onChange={(e) => setRemainingBatches(Number(e.target.value))}
                    style={{
                      width: "100%",
                      padding: "8px 12px",
                      borderRadius: "6px",
                      background: "#0f172a",
                      border: "1px solid #475569",
                      color: "#f8fafc",
                      fontSize: "14px"
                    }}
                  />
                </div>
              </div>

              <div style={{ marginTop: "14px" }}>
                <label style={{ fontSize: "12px", color: "#94a3b8", display: "block", marginBottom: "6px" }}>
                  Durée moyenne par étape restante (minutes)
                </label>
                <input
                  type="range"
                  min="10"
                  max="60"
                  value={avgBatchMinutes}
                  onChange={(e) => setAvgBatchMinutes(Number(e.target.value))}
                  style={{ width: "100%", accentColor: "#3b82f6" }}
                />
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "#64748b" }}>
                  <span>10 min</span>
                  <span style={{ color: "#38bdf8", fontWeight: 600 }}>{avgBatchMinutes} min / étape</span>
                  <span>60 min</span>
                </div>
              </div>

              <div style={{
                marginTop: "16px",
                padding: "12px",
                borderRadius: "8px",
                background: "#0f172a",
                border: "1px solid #334155",
                fontSize: "12px",
                color: "#94a3b8"
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                  <span>Impact de l'incident en cours :</span>
                  <strong style={{ color: "#ef4444" }}>+{selectedScenario.slaImpactMinutes} minutes</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>Temps total de traitement estimé :</span>
                  <strong style={{ color: "#f8fafc" }}>{slaResult.totalRemainingMinutes} minutes</strong>
                </div>
              </div>
            </div>

          </div>

          {/* COLONNE DROITE : PLAN D'ACTION ET SCRIPT DE RÉSOLUTION */}
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            
            <div style={{ background: "#1e293b", borderRadius: "12px", border: "1px solid #334155", padding: "20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                <h3 style={{ fontSize: "18px", fontWeight: 700, color: "#f8fafc" }}>
                  {selectedScenario.stepCode} — {selectedScenario.stepName}
                </h3>
                <span style={{
                  fontSize: "12px",
                  fontWeight: 700,
                  padding: "4px 10px",
                  borderRadius: "6px",
                  background: selectedScenario.bypassAllowed ? "rgba(34, 197, 94, 0.15)" : "rgba(239, 68, 68, 0.15)",
                  color: selectedScenario.bypassAllowed ? "#22c55e" : "#ef4444",
                  border: `1px solid ${selectedScenario.bypassAllowed ? "#22c55e" : "#ef4444"}`
                }}>
                  {selectedScenario.bypassAllowed ? "BYPASS AUTORISÉ" : "STRICTEMENT NON-BYPASSABLE"}
                </span>
              </div>

              {/* ERREUR & CAUSE RACINE */}
              <div style={{ marginBottom: "16px" }}>
                <div style={{ fontSize: "12px", textTransform: "uppercase", color: "#64748b", fontWeight: 600 }}>Message d'erreur système</div>
                <div style={{
                  background: "#0f172a",
                  padding: "10px 12px",
                  borderRadius: "6px",
                  border: "1px solid #ef4444",
                  color: "#f87171",
                  fontFamily: "monospace",
                  fontSize: "13px",
                  marginTop: "4px"
                }}>
                  {selectedScenario.errorMessage}
                </div>
              </div>

              <div style={{ marginBottom: "16px" }}>
                <div style={{ fontSize: "12px", textTransform: "uppercase", color: "#64748b", fontWeight: 600 }}>Cause Racine (RCA)</div>
                <p style={{ color: "#e2e8f0", fontSize: "14px", marginTop: "4px", lineHeight: "1.5" }}>
                  {selectedScenario.rootCause}
                </p>
              </div>

              <div style={{ marginBottom: "16px" }}>
                <div style={{ fontSize: "12px", textTransform: "uppercase", color: "#64748b", fontWeight: 600 }}>Action d'urgence recommandée</div>
                <p style={{ color: "#38bdf8", fontSize: "14px", marginTop: "4px", lineHeight: "1.5", fontWeight: 500 }}>
                  {selectedScenario.immediateAction}
                </p>
              </div>

              {/* PARAMÈTRES DYNAMIQUES DU SCRIPT */}
              {selectedScenario.id === "eod_ora_00054" && (
                <div style={{
                  background: "rgba(59, 130, 246, 0.1)",
                  border: "1px solid #3b82f6",
                  padding: "12px",
                  borderRadius: "8px",
                  marginBottom: "16px",
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "10px"
                }}>
                  <div>
                    <label style={{ fontSize: "11px", color: "#93c5fd", display: "block" }}>SID de la session bloquante</label>
                    <input
                      type="text"
                      value={sidParam}
                      onChange={(e) => setSidParam(e.target.value)}
                      style={{ width: "100%", padding: "6px 8px", background: "#0f172a", border: "1px solid #3b82f6", color: "#fff", borderRadius: "4px" }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: "11px", color: "#93c5fd", display: "block" }}>SERIAL# de la session</label>
                    <input
                      type="text"
                      value={serialParam}
                      onChange={(e) => setSerialParam(e.target.value)}
                      style={{ width: "100%", padding: "6px 8px", background: "#0f172a", border: "1px solid #3b82f6", color: "#fff", borderRadius: "4px" }}
                    />
                  </div>
                </div>
              )}

              {/* SCRIPT DE COMMANDE SHELL / SQL PRÊT À L'EMPLOI */}
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                  <div style={{ fontSize: "12px", textTransform: "uppercase", color: "#64748b", fontWeight: 600 }}>
                    Commandes de reprise et déblocage
                  </div>
                  <button
                    onClick={() => handleCopy(getRecoveryScript())}
                    style={{
                      background: copied ? "#22c55e" : "#3b82f6",
                      color: "#fff",
                      border: "none",
                      borderRadius: "4px",
                      padding: "4px 10px",
                      fontSize: "12px",
                      cursor: "pointer",
                      fontWeight: 600
                    }}
                  >
                    {copied ? "Copié !" : "Copier la commande"}
                  </button>
                </div>
                <pre style={{
                  background: "#090d16",
                  padding: "14px",
                  borderRadius: "8px",
                  border: "1px solid #334155",
                  color: "#34d399",
                  fontFamily: "monospace",
                  fontSize: "13px",
                  whiteSpace: "pre-wrap",
                  overflowX: "auto"
                }}>
                  {getRecoveryScript()}
                </pre>
              </div>

              {selectedScenario.bypassProcedure && (
                <div style={{
                  marginTop: "16px",
                  background: "rgba(234, 179, 8, 0.1)",
                  border: "1px solid #eab308",
                  padding: "12px",
                  borderRadius: "8px",
                  fontSize: "13px",
                  color: "#fef08a"
                }}>
                  <strong>Protocole de Bypass Exceptionnel :</strong> {selectedScenario.bypassProcedure}
                </div>
              )}

            </div>

          </div>

        </div>

      </div>
    </AppShell>
  );
}
