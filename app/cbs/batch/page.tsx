"use client";

import { useState } from "react";
import { AppShell } from "@/modules/layout/AppShell";
import { CBS_EOD_STEPS } from "@/modules/cbs/cbs-data";
import { CbsBatchStep } from "@/modules/cbs/types";

export default function CbsBatchPage() {
  const [selectedStep, setSelectedStep] = useState<CbsBatchStep | null>(CBS_EOD_STEPS[7] || CBS_EOD_STEPS[0]);
  
  // États pour le Simulateur de Crise EOD
  const [simStatus, setSimStatus] = useState<"idle" | "investigating" | "locking_found" | "killed" | "resumed">("idle");
  const [logs, setLogs] = useState<string[]>([]);

  const startSimulator = () => {
    setSimStatus("investigating");
    setLogs([
      "[02:41:12] ALERTE RUN : Batch EOD stoppé à 73% sur l'étape 8 (Calcul des Intérêts & Agios).",
      "[02:41:14] Code retour : ORA-00054: resource busy and acquire with NOWAIT specified or timeout expired.",
      "[02:41:15] La table BKCOM est verrouillée en mode exclusif.",
      "[02:41:16] Procédure d'escalade : identifier la session coupable dans v$locked_object.",
    ]);
  };

  const checkLocks = () => {
    setSimStatus("locking_found");
    setLogs((prev) => [
      ...prev,
      "[02:42:05] SQL> SELECT s.sid, s.serial#, s.username, s.program, s.status FROM v$session s, v$locked_object l WHERE s.sid = l.session_id;",
      "[02:42:06] >>> RÉSULTAT : SID=142, SERIAL#=45901, USER=BATCH_USER, PROGRAM=SQL*Plus, STATUS=INACTIVE (Lancé par un exploitant et resté ouvert sans COMMIT).",
      "[02:42:07] Action recommandée : Exécuter 'ALTER SYSTEM KILL SESSION '142,45901' IMMEDIATE;'",
    ]);
  };

  const killSession = () => {
    setSimStatus("killed");
    setLogs((prev) => [
      ...prev,
      "[02:43:00] SQL> ALTER SYSTEM KILL SESSION '142,45901' IMMEDIATE;",
      "[02:43:02] Session 142 marquée killed. Rollback des verrous exclusifs sur BKCOM terminé.",
      "[02:43:04] Verrous libérés. La ressource est désormais disponible pour le batch.",
    ]);
  };

  const resumeBatch = () => {
    setSimStatus("resumed");
    setLogs((prev) => [
      ...prev,
      "[02:43:45] Reprise du batch Amplitude depuis le point de reprise (Checkpoint #73)...",
      "[02:44:10] Étape 8 terminée avec succès (0 erreur).",
      "[02:45:00] Étape 9 (Édition des journaux et états réglementaires) terminée.",
      "[02:45:30] Étape 10 : Basculement de la date système de J vers J+1 effectué.",
      "[02:45:32] SUCCÈS : Chaîne EOD terminée à 100%. Agences prêtes pour BOD (Begin of Day).",
    ]);
  };

  const resetSimulator = () => {
    setSimStatus("idle");
    setLogs([]);
  };

  return (
    <AppShell pageTitle="Run & Batch Nocturne (EOD / BOD)" eyebrow="EXPLOITATION & ORCHESTRATION">
      <div style={{ display: "flex", flexDirection: "column", gap: "1.75rem" }}>
        
        {/* Simulateur Interactif de Crise EOD */}
        <div
          className="card"
          style={{
            padding: "1.5rem 1.75rem",
            background: "linear-gradient(135deg, #1e1b4b 0%, #0f172a 100%)",
            border: "1px solid #4338ca",
            color: "#ffffff",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem", marginBottom: "1rem" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.35rem" }}>
                <span style={{ background: "#ef4444", color: "#ffffff", fontSize: "0.72rem", fontWeight: 700, padding: "2px 8px", borderRadius: "4px" }}>
                  SIMULATEUR DE CRISE DE NUIT
                </span>
                <span style={{ color: "#a5b4fc", fontSize: "0.82rem" }}>Incident Fréquent Production</span>
              </div>
              <h2 style={{ fontSize: "1.3rem", fontWeight: 800, margin: 0, color: "#f8fafc" }}>
                Blocage Batch EOD à 73% (Erreur ORA-00054 / Verrou BKCOM)
              </h2>
              <p style={{ fontSize: "0.85rem", color: "#cbd5e1", marginTop: "0.25rem", margin: 0 }}>
                Entraînez-vous à débloquer un batch de production bancaire sans relancer l&apos;intégralité de la chaîne.
              </p>
            </div>

            <div style={{ display: "flex", gap: "0.5rem" }}>
              {simStatus === "idle" && (
                <button
                  type="button"
                  onClick={startSimulator}
                  style={{
                    padding: "0.6rem 1.25rem",
                    background: "#dc2626",
                    color: "#ffffff",
                    border: "none",
                    borderRadius: "var(--radius-sm)",
                    fontWeight: 700,
                    cursor: "pointer",
                    fontSize: "0.85rem",
                  }}
                >
                  ▶ Simuler l&apos;Alerte à 02h40
                </button>
              )}

              {simStatus === "investigating" && (
                <button
                  type="button"
                  onClick={checkLocks}
                  style={{
                    padding: "0.6rem 1.25rem",
                    background: "#d97706",
                    color: "#ffffff",
                    border: "none",
                    borderRadius: "var(--radius-sm)",
                    fontWeight: 700,
                    cursor: "pointer",
                    fontSize: "0.85rem",
                  }}
                >
                  🔍 Détecter les sessions verrouillantes (v$lock)
                </button>
              )}

              {simStatus === "locking_found" && (
                <button
                  type="button"
                  onClick={killSession}
                  style={{
                    padding: "0.6rem 1.25rem",
                    background: "#ef4444",
                    color: "#ffffff",
                    border: "none",
                    borderRadius: "var(--radius-sm)",
                    fontWeight: 700,
                    cursor: "pointer",
                    fontSize: "0.85rem",
                  }}
                >
                  ⚡ Tuer la session orpheline (ALTER SYSTEM KILL)
                </button>
              )}

              {simStatus === "killed" && (
                <button
                  type="button"
                  onClick={resumeBatch}
                  style={{
                    padding: "0.6rem 1.25rem",
                    background: "#059669",
                    color: "#ffffff",
                    border: "none",
                    borderRadius: "var(--radius-sm)",
                    fontWeight: 700,
                    cursor: "pointer",
                    fontSize: "0.85rem",
                  }}
                >
                  ▶ Reprendre le Batch depuis le Checkpoint
                </button>
              )}

              {simStatus === "resumed" && (
                <button
                  type="button"
                  onClick={resetSimulator}
                  style={{
                    padding: "0.6rem 1.25rem",
                    background: "#4b5563",
                    color: "#ffffff",
                    border: "none",
                    borderRadius: "var(--radius-sm)",
                    fontWeight: 700,
                    cursor: "pointer",
                    fontSize: "0.85rem",
                  }}
                >
                  🔄 Réinitialiser la simulation
                </button>
              )}
            </div>
          </div>

          {/* Console de sortie du simulateur */}
          {logs.length > 0 && (
            <div
              style={{
                background: "#030712",
                border: "1px solid rgba(255,255,255,0.15)",
                borderRadius: "var(--radius-sm)",
                padding: "1rem",
                fontFamily: "monospace",
                fontSize: "0.82rem",
                lineHeight: "1.6",
                maxHeight: "220px",
                overflowY: "auto",
              }}
            >
              {logs.map((line, idx) => (
                <div
                  key={idx}
                  style={{
                    color: line.includes("ALERTE") || line.includes("ORA-") || line.includes("RÉSULTAT")
                      ? "#f87171"
                      : line.includes("SUCCÈS") || line.includes("terminée avec succès")
                      ? "#4ade80"
                      : line.includes("SQL>")
                      ? "#38bdf8"
                      : "#e2e8f0",
                  }}
                >
                  {line}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pipeline Complet des 10 Étapes EOD */}
        <div>
          <h3 style={{ fontSize: "1.15rem", fontWeight: 700, marginBottom: "0.25rem", color: "var(--text-primary)" }}>
            Chaîne Officielle des 10 Étapes EOD Amplitude
          </h3>
          <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "1rem" }}>
            Cliquez sur une étape pour consulter sa durée cible, ses tables impactées, risques et commandes de reprise.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "0.75rem", marginBottom: "1.5rem" }}>
            {CBS_EOD_STEPS.map((step) => {
              const isSelected = selectedStep?.sequence === step.sequence;
              return (
                <div
                  key={step.sequence}
                  onClick={() => setSelectedStep(step)}
                  className="card"
                  style={{
                    padding: "0.85rem 1rem",
                    cursor: "pointer",
                    border: isSelected ? "2px solid #0284c7" : step.isCritical ? "1px solid rgba(239,68,68,0.4)" : "1px solid var(--border-light)",
                    background: isSelected ? "rgba(2, 132, 199, 0.06)" : "var(--bg-card)",
                    transition: "all 0.15s ease",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.25rem" }}>
                    <span style={{ fontSize: "0.75rem", fontWeight: 700, color: step.isCritical ? "#e60028" : "#0284c7" }}>
                      ÉTAPE {step.sequence}
                    </span>
                    <span style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>{step.expectedDuration}</span>
                  </div>
                  <h4 style={{ fontSize: "0.85rem", fontWeight: 700, margin: "0 0 0.25rem 0", color: "var(--text-primary)" }}>
                    {step.name}
                  </h4>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {step.description}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Fiche Détaillée de l'étape sélectionnée */}
        {selectedStep && (
          <div className="card" style={{ padding: "1.75rem", border: "1px solid var(--border-light)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem", marginBottom: "1.25rem" }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.35rem" }}>
                  <span style={{ background: "#0284c7", color: "#ffffff", fontSize: "0.72rem", fontWeight: 700, padding: "2px 8px", borderRadius: "4px" }}>
                    SÉQUENCE N°{selectedStep.sequence} / 10
                  </span>
                  <span style={{ background: "#e0f2fe", color: "#0369a1", fontSize: "0.72rem", fontWeight: 700, padding: "2px 8px", borderRadius: "4px" }}>
                    CODE: {selectedStep.code}
                  </span>
                  {selectedStep.isCritical && (
                    <span style={{ background: "#fee2e2", color: "#b91c1c", fontSize: "0.72rem", fontWeight: 700, padding: "2px 8px", borderRadius: "4px" }}>
                      CRITIQUE BLOQUANT
                    </span>
                  )}
                </div>
                <h3 style={{ fontSize: "1.25rem", fontWeight: 800, margin: 0, color: "var(--text-primary)" }}>
                  {selectedStep.name}
                </h3>
              </div>

              <div style={{ textAlign: "right", fontSize: "0.85rem" }}>
                <div style={{ color: "var(--text-muted)" }}>Durée estimée moyenne</div>
                <div style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--text-primary)" }}>{selectedStep.expectedDuration}</div>
              </div>
            </div>

            <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: "1.5", marginBottom: "1.5rem" }}>
              {selectedStep.description}
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.25rem" }}>
              
              {/* Domaine rattaché */}
              <div style={{ background: "var(--bg-subtle)", padding: "1rem", borderRadius: "var(--radius-sm)" }}>
                <h4 style={{ fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-muted)", marginBottom: "0.5rem" }}>
                  Domaine Bancaire Rattaché
                </h4>
                <div style={{ fontSize: "0.9rem", fontWeight: 700, color: "#0284c7" }}>
                  {selectedStep.domain}
                </div>
              </div>

              {/* Statut Critique */}
              <div style={{ background: selectedStep.isCritical ? "rgba(239, 68, 68, 0.05)" : "rgba(16, 185, 129, 0.05)", border: `1px solid ${selectedStep.isCritical ? "rgba(239,68,68,0.2)" : "rgba(16,185,129,0.2)"}`, padding: "1rem", borderRadius: "var(--radius-sm)" }}>
                <h4 style={{ fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.05em", color: selectedStep.isCritical ? "#b91c1c" : "#065f46", marginBottom: "0.5rem" }}>
                  Impact de tolérance aux pannes
                </h4>
                <p style={{ fontSize: "0.85rem", color: selectedStep.isCritical ? "#7f1d1d" : "#064e3b", margin: 0, lineHeight: "1.45" }}>
                  {selectedStep.isCritical
                    ? "Étape critique bloquante. Tout échec nécessite une intervention immédiate de l'astreinte DBA/Exploitant avant bascule de date."
                    : "Étape non bloquante immédiate. En cas d'anomalie, un flag de rejet partiel est posé pour correction ultérieure en journée."}
                </p>
              </div>

            </div>
          </div>
        )}

      </div>
    </AppShell>
  );
}
