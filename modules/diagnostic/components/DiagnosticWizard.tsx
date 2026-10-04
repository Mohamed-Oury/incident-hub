"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const STEPS = [
  { id: 1, name: "Symptôme", desc: "Comportement observé & message d'erreur" },
  { id: 2, name: "Faits observés", desc: "Chiffres, volumétrie et constat objectif" },
  { id: 3, name: "Périmètre", desc: "Canaux, TPE/GAB, banques et filiales impactées" },
  { id: 4, name: "Point de rupture", desc: "Composant technique défaillant dans la chaîne" },
  { id: 5, name: "Hypothèses", desc: "Pistes d'analyse sans conclusion hâtive" },
  { id: 6, name: "Preuves / Logs", desc: "Extraits de trames ISO 8583 masquées et logs" },
  { id: 7, name: "Cause racine (RCA)", desc: "Justification technique formellement prouvée" },
  { id: 8, name: "Correction & Prévention", desc: "Actions curatives et contrôle post-action" },
];

interface DiagnosticResultData {
  initialAnalysis: {
    detectedDomain: string;
    channel: string;
    probableType: string;
    potentialMti: string;
    symptomSummary: string;
    suspectComponents: string[];
    confidenceScore: number;
  };
  flowMapping: Array<{
    component: string;
    status: "OK" | "TIMEOUT" | "ERROR" | "PENDING";
    timestamp?: string;
    details: string;
    mti?: string;
    de39?: string;
  }>;
  breakpointAnalysis: string;
  potentialTechnicalCauses?: string[];
  timeline: Array<{
    time: string;
    source: string;
    destination: string;
    mti?: string;
    de39?: string;
    status: string;
    description: string;
  }>;
  hypotheses: Array<{
    id: string;
    title: string;
    confidenceLevel?: string;
    supportingEvidenceCount?: number;
    contradictingEvidenceCount?: number;
    missingEvidenceCount?: number;
    probaPercent?: number;
    status: "PROPOSED" | "INVESTIGATING" | "SUPPORTED" | "CONFIRMED" | "REJECTED";
    evidenceCount: number;
    evidenceDetails: string[];
    potentialCauses?: string[];
    rationale: string;
  }>;
  similarIncidents: Array<{
    reference: string;
    title: string;
    symptom: string;
    breakpoint: string;
    rootCause: string;
    resolution: string;
    similarityPercent: number;
  }>;
  evidenceList: Array<{
    source: string;
    type: string;
    content: string;
    isVerified: boolean;
    timestamp?: string;
  }>;
  evidenceLedger?: Array<{
    id: string;
    information: string;
    source: string;
    type: string;
    status: string;
    rationale: string;
  }>;
  contradictionsDetected?: string[];
  missingEvidence?: string[];
  nextInvestigationStep?: string;
  rcaProposal: {
    summary: string;
    status: "PROPOSED_UNCONFIRMED" | "CONFIRMED_BY_OPERATOR" | "REJECTED_BY_OPERATOR";
    confidenceLevel: string;
    recommendedActions: string[];
    humanValidationRequired: boolean;
  };
  toolsCalled?: string[];
}

export function DiagnosticWizard() {
  const router = useRouter();
  const [mode, setMode] = useState<"GUIDED" | "COPILOT">("COPILOT");
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [createdRef, setCreatedRef] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Formulaire d'incident pour Mode Guidé & enregistrement DB
  const [formData, setFormData] = useState({
    title: "",
    domain: "",
    component: "",
    errorCode: "",
    severity: "",
    symptom: "",
    facts: "",
    scope: "",
    breakPoint: "",
    hypotheses: [
      { desc: "", status: "" },
      { desc: "", status: "" },
    ],
    evidence: "",
    rootCause: "",
    correction: "",
    prevention: "",
  });

  // État du Copilot Agentic
  const [copilotLoading, setCopilotLoading] = useState(false);
  const [copilotProgressStep, setCopilotProgressStep] = useState(0);
  const [copilotResult, setCopilotResult] = useState<DiagnosticResultData | null>(null);
  const [copilotError, setCopilotError] = useState<string | null>(null);
  const [operatorConfirmed, setOperatorConfirmed] = useState(false);

  // État de la modal de Poursuite d'Investigation
  const [isInvestigationModalOpen, setIsInvestigationModalOpen] = useState(false);
  const [investigationLogInput, setInvestigationLogInput] = useState("");
  const [selectedPresetCategory, setSelectedPresetCategory] = useState<"HOST" | "TCP" | "ISO" | "GAB_EJ" | "CUSTOM">("HOST");
  const [investigationHistory, setInvestigationHistory] = useState<
    Array<{ id: number; timestamp: string; category: string; content: string }>
  >([]);

  const PROGRESS_STEPS = [
    "Classification incident & canal",
    "Cartographie du flux transactionnel",
    "Recherche d'incidents similaires (KB)",
    "Décryptage ISO 8583 & DE39",
    "Formulation des hypothèses %",
    "Localisation du point de rupture",
    "Génération proposition RCA & Garde-fou",
  ];

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, STEPS.length));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  const addHypothesis = () => {
    setFormData({
      ...formData,
      hypotheses: [...formData.hypotheses, { desc: "", status: "OPEN" }],
    });
  };

  const handleRunCopilotAnalysis = async () => {
    setCopilotLoading(true);
    setCopilotError(null);
    setCopilotResult(null);
    setCopilotProgressStep(1);

    // Animation séquentielle des étapes d'analyse
    const timerInterval = setInterval(() => {
      setCopilotProgressStep((prev) => {
        if (prev < PROGRESS_STEPS.length) return prev + 1;
        clearInterval(timerInterval);
        return prev;
      });
    }, 350);

    try {
      const res = await fetch("/api/cbs/agentic/diagnostic/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formData.title || "Incident GAB non titré",
          domain: formData.domain,
          severity: formData.severity,
          symptom: formData.symptom || "Délai dépassé lors du retrait",
          facts: formData.facts,
          stan: "739214",
          errorCode: formData.errorCode,
          scope: formData.scope,
          rawLogs: formData.evidence,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.detail || data.error || "Impossible de contacter l'agent de diagnostic.");
      }

      setCopilotResult(data);
      setOperatorConfirmed(false);
    } catch (err: any) {
      setCopilotError(err.message || "Erreur lors de l'exécution de l'agent Copilot.");
    } finally {
      clearInterval(timerInterval);
      setCopilotLoading(false);
      setCopilotProgressStep(PROGRESS_STEPS.length);
    }
  };

  const handleSyncToGuidedForm = () => {
    if (!copilotResult) return;
    setFormData({
      ...formData,
      domain: copilotResult.initialAnalysis.detectedDomain,
      symptom: copilotResult.initialAnalysis.symptomSummary,
      breakPoint: copilotResult.breakpointAnalysis,
      rootCause: copilotResult.rcaProposal.summary,
      evidence: copilotResult.evidenceList.map((e) => `[${e.source}] ${e.content}`).join("\n"),
      correction: copilotResult.rcaProposal.recommendedActions.join("\n"),
      hypotheses: copilotResult.hypotheses.map((h) => ({
        desc: `${h.id}: ${h.title} (${h.probaPercent}%)`,
        status: h.status === "SUPPORTED" ? "PROBABLE" : h.status === "REJECTED" ? "REJECTED" : "OPEN",
      })),
    });
    setMode("GUIDED");
    setCurrentStep(7); // Aller directement à l'étape Cause Racine
  };

  const handleSaveIncident = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/incidents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Erreur lors de l'enregistrement de l'incident.");
      }

      setCreatedRef(data.incident.reference);
      setSavedSuccess(true);
    } catch (err: any) {
      setError(err.message || "Impossible de sauvegarder l'incident dans MySQL.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.75rem" }}>
      {/* Barre d'en-tête & Sélecteur de Mode (Copilot vs Guidé) */}
      <div
        style={{
          background: "linear-gradient(135deg, #18181b 0%, #09090b 100%)",
          color: "#ffffff",
          padding: "1.5rem",
          borderRadius: "16px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          boxShadow: "0 10px 25px -5px rgba(0,0,0,0.3)",
          border: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.4rem" }}>
            <span
              style={{
                background: "rgba(230,0,40,0.2)",
                color: "#ff4d6d",
                fontSize: "0.7rem",
                fontWeight: 800,
                padding: "0.2rem 0.6rem",
                borderRadius: "20px",
                letterSpacing: "0.08em",
                border: "1px solid rgba(230,0,40,0.4)",
              }}
            >
              MONÉTIQUE AGENTIC COPILOT V1
            </span>
            <span style={{ fontSize: "0.8rem", color: "#a1a1aa" }}>• ISO 8583 & Flow Orchestrator</span>
          </div>
          <h2 style={{ fontSize: "1.35rem", fontWeight: 800, color: "#ffffff", letterSpacing: "-0.02em" }}>
            Diagnostic Assistant Monétique
          </h2>
          <p style={{ fontSize: "0.85rem", color: "#a1a1aa", marginTop: "0.2rem" }}>
            L’agent propose et raisonne. Le moteur de diagnostic contrôle le processus. L’opérateur valide la conclusion.
          </p>
        </div>

        <div style={{ display: "flex", background: "#27272a", padding: "4px", borderRadius: "10px", border: "1px solid #3f3f46" }}>
          <button
            type="button"
            onClick={() => setMode("COPILOT")}
            style={{
              padding: "0.6rem 1.25rem",
              borderRadius: "8px",
              fontWeight: 700,
              fontSize: "0.85rem",
              cursor: "pointer",
              transition: "all 0.2s ease",
              border: "none",
              background: mode === "COPILOT" ? "#e60028" : "transparent",
              color: mode === "COPILOT" ? "#ffffff" : "#a1a1aa",
              boxShadow: mode === "COPILOT" ? "0 4px 12px rgba(230,0,40,0.4)" : "none",
            }}
          >
            🤖 Mode Diagnostic Copilot
          </button>
          <button
            type="button"
            onClick={() => setMode("GUIDED")}
            style={{
              padding: "0.6rem 1.25rem",
              borderRadius: "8px",
              fontWeight: 700,
              fontSize: "0.85rem",
              cursor: "pointer",
              transition: "all 0.2s ease",
              border: "none",
              background: mode === "GUIDED" ? "#3f3f46" : "transparent",
              color: mode === "GUIDED" ? "#ffffff" : "#a1a1aa",
            }}
          >
            🧑‍💻 Mode Guidé (8 étapes)
          </button>
        </div>
      </div>

      {/* Avertissement Règle de Gouvernance Monétique */}
      <div
        style={{
          background: "#fff1f2",
          borderLeft: "4px solid #e60028",
          padding: "1rem 1.25rem",
          borderRadius: "0 10px 10px 0",
          fontSize: "0.88rem",
          color: "#9f1239",
          display: "flex",
          alignItems: "center",
          gap: "0.85rem",
          boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
        }}
      >
        <span style={{ fontSize: "1.4rem" }}>⚖️</span>
        <div>
          <b>Règle fondamentale d'analyse monétique :</b> Une hypothèse ne devient jamais une RCA sans validation humaine.
          L'agent rassemble les faits, décode les trames ISO 8583 et cartographie la rupture, mais <b>l'opérateur conserve la décision finale</b>.
        </div>
      </div>

      {error && (
        <div style={{ padding: "0.85rem 1.25rem", background: "#fee2e2", color: "#991b1b", borderRadius: "8px", border: "1px solid #fca5a5", fontSize: "0.9rem" }}>
          ⚠️ {error}
        </div>
      )}

      {/* ========================================================================= */}
      {/* VUE 1 : MODE DIAGNOSTIC COPILOT (AGENTIC WORKFLOW)                      */}
      {/* ========================================================================= */}
      {mode === "COPILOT" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "1.75rem" }}>
          {/* Panneau de saisie & Lancement de l'agent */}
          <div style={{ background: "#ffffff", padding: "1.75rem", borderRadius: "14px", border: "1px solid #e4e4e7" }}>
            <h4 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "1rem", color: "#111827", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <span>🔎</span> Saisie de l'Incident Monétique à Analyser
            </h4>

            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, color: "#3f3f46", marginBottom: "0.3rem" }}>
                  Titre de l'incident *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Ex: GAB — Retraits rejetés suite à saturation pool de connexion"
                  style={{ width: "100%", padding: "0.7rem", borderRadius: "8px", border: "1px solid #d4d4d8", fontSize: "0.9rem" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, color: "#3f3f46", marginBottom: "0.3rem" }}>
                  Domaine
                </label>
                <select
                  value={formData.domain}
                  onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
                  style={{ width: "100%", padding: "0.7rem", borderRadius: "8px", border: "1px solid #d4d4d8", fontSize: "0.9rem" }}
                >
                  <option value="GAB">GAB / Automate Retrait</option>
                  <option value="TPE">TPE / Paiement Commerçant</option>
                  <option value="CARTE">Carte / Puce EMV</option>
                  <option value="INTERFACE">Interface ISO 8583</option>
                  <option value="PAYWAY">Switch Payway</option>
                  <option value="HOST">Host & Core Banking</option>
                </select>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, color: "#3f3f46", marginBottom: "0.3rem" }}>
                  Code Retour / MTI
                </label>
                <input
                  type="text"
                  value={formData.errorCode}
                  onChange={(e) => setFormData({ ...formData, errorCode: e.target.value })}
                  placeholder="Ex: DE39=00 ou DE39=91"
                  style={{ width: "100%", padding: "0.7rem", borderRadius: "8px", border: "1px solid #d4d4d8", fontSize: "0.9rem", fontFamily: "monospace" }}
                />
              </div>
            </div>

            <div style={{ marginBottom: "1.25rem" }}>
              <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, color: "#3f3f46", marginBottom: "0.3rem" }}>
                Symptôme constaté (Description de l'anomalie perçue) *
              </label>
              <textarea
                rows={2}
                value={formData.symptom}
                onChange={(e) => setFormData({ ...formData, symptom: e.target.value })}
                placeholder="Ex: Le client insère sa carte, saisit son PIN mais l'automate affiche 'Opération impossible - Délai dépassé'."
                style={{ width: "100%", padding: "0.7rem", borderRadius: "8px", border: "1px solid #d4d4d8", fontSize: "0.9rem" }}
              />
            </div>

            <button
              type="button"
              onClick={handleRunCopilotAnalysis}
              disabled={copilotLoading}
              style={{
                background: copilotLoading
                  ? "#a1a1aa"
                  : "linear-gradient(135deg, #e60028 0%, #b91c1c 100%)",
                color: "#ffffff",
                padding: "0.85rem 1.75rem",
                borderRadius: "10px",
                fontWeight: 700,
                fontSize: "0.95rem",
                cursor: copilotLoading ? "not-allowed" : "pointer",
                border: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.6rem",
                boxShadow: "0 4px 14px rgba(230,0,40,0.35)",
              }}
            >
              {copilotLoading ? (
                <>
                  <span className="animate-spin">⚙️</span> Analyse Agentic en cours... ({copilotProgressStep}/{PROGRESS_STEPS.length})
                </>
              ) : (
                <>
                  <span>✨</span> Lancer le Diagnostic Copilot Agentic
                </>
              )}
            </button>
          </div>

          {/* Animation & Étapes de progression de l'agent */}
          {copilotLoading && (
            <div style={{ background: "#ffffff", padding: "1.5rem", borderRadius: "14px", border: "1px solid #e4e4e7" }}>
              <h4 style={{ fontSize: "0.9rem", fontWeight: 700, color: "#71717a", marginBottom: "1rem" }}>
                PIPELINE DE RAISONNEMENT DIAGNOSTIC
              </h4>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "0.75rem" }}>
                {PROGRESS_STEPS.map((stepName, idx) => {
                  const stepNum = idx + 1;
                  const isDone = copilotProgressStep > stepNum;
                  const isCurrent = copilotProgressStep === stepNum;
                  return (
                    <div
                      key={idx}
                      style={{
                        padding: "0.75rem",
                        borderRadius: "8px",
                        background: isDone ? "#f0fdf4" : isCurrent ? "#fef2f2" : "#f4f4f5",
                        border: isDone ? "1px solid #bbf7d0" : isCurrent ? "1px solid #fca5a5" : "1px solid #e4e4e7",
                        fontSize: "0.8rem",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                      }}
                    >
                      <span>{isDone ? "✅" : isCurrent ? "🔄" : "⏳"}</span>
                      <span style={{ fontWeight: isCurrent ? 700 : 500, color: isDone ? "#166534" : isCurrent ? "#991b1b" : "#71717a" }}>
                        {stepName}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {copilotError && (
            <div style={{ padding: "1.25rem", background: "#fee2e2", color: "#991b1b", borderRadius: "10px", border: "1px solid #fca5a5" }}>
              ❌ <b>Erreur Diagnostic Agentic :</b> {copilotError}
            </div>
          )}

          {/* RÉSULTATS STRUCTURÉS DU DIAGNOSTIC AGENTIC */}
          {copilotResult && (
            <div style={{ display: "flex", flexDirection: "column", gap: "1.75rem" }}>
              {/* Card 1 : Context & Classification Initiale */}
              <div style={{ background: "#ffffff", padding: "1.75rem", borderRadius: "14px", border: "1px solid #e4e4e7" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                  <h3 style={{ fontSize: "1.1rem", fontWeight: 800, color: "#111827", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <span>🧠</span> 2. Contexte & Classification Initiale (Enrichissement)
                  </h3>
                  <span style={{ background: "#dcfce7", color: "#166534", padding: "0.25rem 0.75rem", borderRadius: "20px", fontWeight: 700, fontSize: "0.8rem" }}>
                    Confiance : {copilotResult.initialAnalysis.confidenceScore}%
                  </span>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem", background: "#f8fafc", padding: "1.25rem", borderRadius: "10px", border: "1px solid #e2e8f0" }}>
                  <div>
                    <span style={{ fontSize: "0.75rem", color: "#64748b", fontWeight: 600, display: "block" }}>DOMAINE DÉTECTÉ</span>
                    <strong style={{ fontSize: "0.95rem", color: "#0f172a" }}>{copilotResult.initialAnalysis.detectedDomain}</strong>
                  </div>
                  <div>
                    <span style={{ fontSize: "0.75rem", color: "#64748b", fontWeight: 600, display: "block" }}>CANAL / APPAREIL</span>
                    <strong style={{ fontSize: "0.95rem", color: "#0f172a" }}>{copilotResult.initialAnalysis.channel}</strong>
                  </div>
                  <div>
                    <span style={{ fontSize: "0.75rem", color: "#64748b", fontWeight: 600, display: "block" }}>TYPE PROBABLE</span>
                    <strong style={{ fontSize: "0.95rem", color: "#0f172a" }}>{copilotResult.initialAnalysis.probableType}</strong>
                  </div>
                  <div>
                    <span style={{ fontSize: "0.75rem", color: "#64748b", fontWeight: 600, display: "block" }}>MTI POTENTIEL</span>
                    <strong style={{ fontSize: "0.95rem", color: "#e60028", fontFamily: "monospace" }}>{copilotResult.initialAnalysis.potentialMti}</strong>
                  </div>
                </div>

                <div style={{ marginTop: "1rem" }}>
                  <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "#475569", display: "block", marginBottom: "0.4rem" }}>
                    COMPOSANTS SUSPECTS PAR ORDRE DE PRIORITÉ :
                  </span>
                  <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                    {copilotResult.initialAnalysis.suspectComponents.map((comp, idx) => (
                      <span key={idx} style={{ background: "#f1f5f9", color: "#334155", padding: "0.3rem 0.75rem", borderRadius: "6px", fontSize: "0.82rem", fontWeight: 600, border: "1px solid #cbd5e1" }}>
                        {idx + 1}. {comp}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Card 2 : Cartographie Visuelle du Flux Transactionnel */}
              <div style={{ background: "#ffffff", padding: "1.75rem", borderRadius: "14px", border: "1px solid #e4e4e7" }}>
                <h3 style={{ fontSize: "1.1rem", fontWeight: 800, color: "#111827", marginBottom: "1.25rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <span>🗺️</span> 3. Cartographie du Flux Transactionnel
                </h3>

                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.5rem", overflowX: "auto", paddingBottom: "0.5rem" }}>
                  {copilotResult.flowMapping.map((hop, idx) => {
                    const isError = hop.status === "ERROR" || hop.status === "TIMEOUT";
                    return (
                      <div key={idx} style={{ display: "flex", alignItems: "center", gap: "0.5rem", flex: 1, minWidth: "150px" }}>
                        <div
                          style={{
                            flex: 1,
                            padding: "1rem",
                            borderRadius: "12px",
                            background: isError ? "#fff1f2" : "#f0fdf4",
                            border: isError ? "2px solid #e60028" : "1px solid #86efac",
                            textAlign: "center",
                            boxShadow: isError ? "0 4px 12px rgba(230,0,40,0.15)" : "none",
                          }}
                        >
                          <div style={{ fontSize: "0.75rem", fontWeight: 800, color: isError ? "#9f1239" : "#166534", marginBottom: "0.2rem" }}>
                            {hop.component}
                          </div>
                          <div style={{ fontSize: "0.85rem", fontWeight: 700, color: isError ? "#e60028" : "#15803d" }}>
                            {hop.status === "OK" ? "✓ PASSED" : `⚠️ ${hop.status}`}
                          </div>
                          {hop.de39 && (
                            <span style={{ fontSize: "0.7rem", fontFamily: "monospace", background: "rgba(0,0,0,0.06)", padding: "0.1rem 0.4rem", borderRadius: "4px", marginTop: "0.3rem", display: "inline-block" }}>
                              DE39={hop.de39}
                            </span>
                          )}
                        </div>
                        {idx < copilotResult.flowMapping.length - 1 && (
                          <span style={{ fontSize: "1.2rem", color: "#a1a1aa", fontWeight: 700 }}>➔</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Card 3 : Point de Rupture & Timeline Séquentielle */}
              <div style={{ background: "#ffffff", padding: "1.75rem", borderRadius: "14px", border: "1px solid #e4e4e7" }}>
                <h3 style={{ fontSize: "1.1rem", fontWeight: 800, color: "#111827", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <span>🎯</span> 4. Localisation du Point de Rupture & Causes Techniques Possibles
                </h3>

                <div style={{ background: "#fff1f2", borderLeft: "4px solid #e60028", padding: "1.25rem", borderRadius: "0 8px 8px 0", marginBottom: "1.25rem" }}>
                  <span style={{ fontSize: "0.75rem", fontWeight: 800, color: "#9f1239", letterSpacing: "0.05em", display: "block" }}>
                    DIAGNOSTIC DE RUPTURE IDENTIFIÉ :
                  </span>
                  <p style={{ fontSize: "0.95rem", fontWeight: 700, color: "#881337", marginTop: "0.25rem" }}>
                    {copilotResult.breakpointAnalysis}
                  </p>
                </div>

                {copilotResult.potentialTechnicalCauses && copilotResult.potentialTechnicalCauses.length > 0 && (
                  <div style={{ background: "#f8fafc", padding: "1rem 1.25rem", borderRadius: "10px", border: "1px solid #cbd5e1", marginBottom: "1.25rem" }}>
                    <span style={{ fontSize: "0.8rem", fontWeight: 800, color: "#334155", display: "block", marginBottom: "0.4rem" }}>
                      CAUSES TECHNIQUES SOUS-JACENTES POSSIBLES AU POINT DE RUPTURE :
                    </span>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
                      {copilotResult.potentialTechnicalCauses.map((cause, idx) => (
                        <div key={idx} style={{ fontSize: "0.85rem", color: "#0f172a", fontWeight: 600 }}>
                          • {cause}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <h4 style={{ fontSize: "0.85rem", fontWeight: 700, color: "#475569", marginBottom: "0.75rem" }}>
                  CHRONOLOGIE DÉTAILLÉE DES ÉVÉNEMENTS (TIMELINE ISO 8583) :
                </h4>
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem" }}>
                    <thead>
                      <tr style={{ background: "#f8fafc", textAlign: "left", color: "#64748b", borderBottom: "1px solid #e2e8f0" }}>
                        <th style={{ padding: "0.6rem 0.8rem" }}>Horodatage</th>
                        <th style={{ padding: "0.6rem 0.8rem" }}>Flux (Source ➔ Dest)</th>
                        <th style={{ padding: "0.6rem 0.8rem" }}>MTI / DE39</th>
                        <th style={{ padding: "0.6rem 0.8rem" }}>Statut</th>
                        <th style={{ padding: "0.6rem 0.8rem" }}>Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      {copilotResult.timeline.map((evt, idx) => (
                        <tr key={idx} style={{ borderBottom: "1px solid #f1f5f9" }}>
                          <td style={{ padding: "0.6rem 0.8rem", fontFamily: "monospace", color: "#64748b" }}>{evt.time}</td>
                          <td style={{ padding: "0.6rem 0.8rem", fontWeight: 600, color: "#1e293b" }}>{evt.source} ➔ {evt.destination}</td>
                          <td style={{ padding: "0.6rem 0.8rem", fontFamily: "monospace", color: "#e60028" }}>
                            {evt.mti} {evt.de39 ? `(DE39=${evt.de39})` : ""}
                          </td>
                          <td style={{ padding: "0.6rem 0.8rem" }}>
                            <span style={{ fontSize: "0.75rem", fontWeight: 700, color: evt.status.includes("TIMEOUT") ? "#9f1239" : "#166534" }}>
                              {evt.status}
                            </span>
                          </td>
                          <td style={{ padding: "0.6rem 0.8rem", color: "#334155" }}>{evt.description}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Card 4 : Hypothèses Probabilisées avec Score d'Appui Transparent */}
              <div style={{ background: "#ffffff", padding: "1.75rem", borderRadius: "14px", border: "1px solid #e4e4e7" }}>
                <h3 style={{ fontSize: "1.1rem", fontWeight: 800, color: "#111827", marginBottom: "1.25rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <span>📊</span> 5. Émission des Hypothèses & Score d'Appui des Preuves
                </h3>

                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  {copilotResult.hypotheses.map((hyp) => (
                    <div
                      key={hyp.id}
                      style={{
                        padding: "1.25rem",
                        borderRadius: "12px",
                        border: hyp.status === "SUPPORTED" ? "2px solid #e60028" : "1px solid #e4e4e7",
                        background: hyp.status === "SUPPORTED" ? "#fff1f2" : "#ffffff",
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.6rem" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                          <span style={{ background: "#e60028", color: "#ffffff", padding: "0.2rem 0.5rem", borderRadius: "6px", fontWeight: 800, fontSize: "0.75rem" }}>
                            {hyp.id}
                          </span>
                          <strong style={{ fontSize: "0.95rem", color: "#0f172a" }}>{hyp.title}</strong>
                        </div>
                        <span
                          style={{
                            background: hyp.status === "SUPPORTED" ? "#dcfce7" : hyp.status === "REJECTED" ? "#fee2e2" : "#f1f5f9",
                            color: hyp.status === "SUPPORTED" ? "#15803d" : hyp.status === "REJECTED" ? "#991b1b" : "#475569",
                            padding: "0.3rem 0.75rem",
                            borderRadius: "20px",
                            fontWeight: 800,
                            fontSize: "0.8rem",
                          }}
                        >
                          CONFIANCE : {hyp.confidenceLevel || (hyp.probaPercent ? `${hyp.probaPercent}%` : "MOYENNE")}
                        </span>
                      </div>

                      {/* Pills de Ratios d'Appui */}
                      <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap", marginBottom: "0.75rem" }}>
                        <span style={{ background: "#dcfce7", color: "#166534", padding: "0.2rem 0.6rem", borderRadius: "6px", fontSize: "0.78rem", fontWeight: 700 }}>
                          ✓ Preuves d'appui : {hyp.supportingEvidenceCount ?? hyp.evidenceCount}
                        </span>
                        <span style={{ background: "#fee2e2", color: "#991b1b", padding: "0.2rem 0.6rem", borderRadius: "6px", fontSize: "0.78rem", fontWeight: 700 }}>
                          ❌ Contradictoires : {hyp.contradictingEvidenceCount ?? 0}
                        </span>
                        <span style={{ background: "#fef3c7", color: "#92400e", padding: "0.2rem 0.6rem", borderRadius: "6px", fontSize: "0.78rem", fontWeight: 700 }}>
                          ❓ Manquantes : {hyp.missingEvidenceCount ?? 0}
                        </span>
                      </div>

                      <p style={{ fontSize: "0.85rem", color: "#475569", marginBottom: "0.5rem" }}>
                        <b>Raisonnement agent :</b> {hyp.rationale}
                      </p>

                      {hyp.evidenceDetails.length > 0 && (
                        <div style={{ marginTop: "0.5rem" }}>
                          <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#64748b", display: "block", marginBottom: "0.2rem" }}>
                            PREUVES CONCRÈTES DE L'INCIDENT COURANT :
                          </span>
                          <ul style={{ margin: 0, paddingLeft: "1.2rem", fontSize: "0.82rem", color: "#334155" }}>
                            {hyp.evidenceDetails.map((ev, i) => (
                              <li key={i}>✓ {ev}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Card 5 : Incidents Similaires (Incident Memory) */}
              <div style={{ background: "#ffffff", padding: "1.75rem", borderRadius: "14px", border: "1px solid #e4e4e7" }}>
                <h3 style={{ fontSize: "1.1rem", fontWeight: 800, color: "#111827", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <span>📚</span> Incident Memory (Correspondance Base de Connaissances)
                </h3>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1rem" }}>
                  {copilotResult.similarIncidents.map((inc) => (
                    <div key={inc.reference} style={{ background: "#f8fafc", padding: "1rem", borderRadius: "10px", border: "1px solid #cbd5e1" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.4rem" }}>
                        <span style={{ fontWeight: 800, fontSize: "0.85rem", color: "#0f172a" }}>{inc.reference}</span>
                        <span style={{ background: "#dbeafe", color: "#1e40af", padding: "0.1rem 0.5rem", borderRadius: "12px", fontWeight: 700, fontSize: "0.75rem" }}>
                          {inc.similarityPercent}% match
                        </span>
                      </div>
                      <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "#1e293b", marginBottom: "0.4rem" }}>{inc.title}</div>
                      <p style={{ fontSize: "0.8rem", color: "#475569", margin: "0 0 0.4rem 0" }}>
                        <b>Point de rupture :</b> {inc.breakpoint}
                      </p>
                      <p style={{ fontSize: "0.8rem", color: "#166534", margin: 0 }}>
                        <b>Référence Historique KB (Non injectée comme preuve) :</b> {inc.resolution}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Card 6 : Evidence Ledger Normalisé & Filter Contradictions */}
              <div style={{ background: "#ffffff", padding: "1.75rem", borderRadius: "14px", border: "1px solid #e4e4e7" }}>
                <h3 style={{ fontSize: "1.1rem", fontWeight: 800, color: "#111827", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <span>🔬</span> Evidence Ledger (Registre des Preuves & Grounding Rules)
                </h3>

                {copilotResult.contradictionsDetected && copilotResult.contradictionsDetected.length > 0 && (
                  <div style={{ background: "#fff1f2", borderLeft: "4px solid #e60028", padding: "1rem 1.25rem", borderRadius: "0 8px 8px 0", marginBottom: "1.25rem" }}>
                    <span style={{ fontSize: "0.8rem", fontWeight: 800, color: "#9f1239", display: "block", marginBottom: "0.3rem" }}>
                      🛡️ DÉTECTEUR DE CONTRADICTIONS (FILTRE ANTI-HALLUCINATION) :
                    </span>
                    {copilotResult.contradictionsDetected.map((c, i) => (
                      <p key={i} style={{ fontSize: "0.85rem", color: "#881337", margin: "0.2rem 0", fontWeight: 600 }}>
                        {c}
                      </p>
                    ))}
                  </div>
                )}

                {copilotResult.evidenceLedger && copilotResult.evidenceLedger.length > 0 && (
                  <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem" }}>
                      <thead>
                        <tr style={{ background: "#f8fafc", textAlign: "left", color: "#64748b", borderBottom: "1px solid #e2e8f0" }}>
                          <th style={{ padding: "0.6rem 0.8rem" }}>ID</th>
                          <th style={{ padding: "0.6rem 0.8rem" }}>Énoncé / Fait</th>
                          <th style={{ padding: "0.6rem 0.8rem" }}>Source</th>
                          <th style={{ padding: "0.6rem 0.8rem" }}>Type & Statut Normalisé</th>
                          <th style={{ padding: "0.6rem 0.8rem" }}>Justification Ancrage</th>
                        </tr>
                      </thead>
                      <tbody>
                        {copilotResult.evidenceLedger.map((item) => {
                          const isRejected = item.type === "REJECTED_CONTRADICTION";
                          const isFact = item.type === "VERIFIED_EVIDENCE";
                          const isInference = item.type === "INFERENCE";
                          return (
                            <tr key={item.id} style={{ borderBottom: "1px solid #f1f5f9", background: isRejected ? "#fef2f2" : isInference ? "#fefce8" : "#ffffff" }}>
                              <td style={{ padding: "0.6rem 0.8rem", fontFamily: "monospace", fontWeight: 700, color: "#0f172a" }}>{item.id}</td>
                              <td style={{ padding: "0.6rem 0.8rem", fontWeight: 600, color: isRejected ? "#991b1b" : "#1e293b" }}>{item.information}</td>
                              <td style={{ padding: "0.6rem 0.8rem", color: "#64748b" }}>{item.source}</td>
                              <td style={{ padding: "0.6rem 0.8rem" }}>
                                <span
                                  style={{
                                    fontSize: "0.75rem",
                                    fontWeight: 700,
                                    padding: "0.2rem 0.55rem",
                                    borderRadius: "12px",
                                    background: isFact ? "#dcfce7" : isInference ? "#fef08a" : isRejected ? "#fee2e2" : "#f1f5f9",
                                    color: isFact ? "#15803d" : isInference ? "#854d0e" : isRejected ? "#991b1b" : "#475569",
                                  }}
                                >
                                  {isFact ? "✅ Preuve Factuelle" : isInference ? "🟡 Inférence Agent" : isRejected ? "❌ Contradiction Rejetée" : "⚪ Référence KB"}
                                </span>
                              </td>
                              <td style={{ padding: "0.6rem 0.8rem", color: "#334155" }}>{item.rationale}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Card 7 : Checklist des Preuves Manquantes & Investigation Itérative */}
              {copilotResult.missingEvidence && copilotResult.missingEvidence.length > 0 && (
                <div style={{ background: "#ffffff", padding: "1.75rem", borderRadius: "14px", border: "1px solid #e4e4e7" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                    <h3 style={{ fontSize: "1.1rem", fontWeight: 800, color: "#111827", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <span>❓</span> Checklist des Preuves Manquantes & Suivi d'Investigation
                    </h3>
                    <span style={{ background: "#fef3c7", color: "#92400e", padding: "0.25rem 0.75rem", borderRadius: "12px", fontWeight: 700, fontSize: "0.8rem" }}>
                      {copilotResult.missingEvidence.length} preuves identifiées
                    </span>
                  </div>

                  {/* Checklist des éléments manquants avec boutons d'action interactifs */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem", marginBottom: "1.25rem" }}>
                    {copilotResult.missingEvidence.map((item, idx) => {
                      const isProvided = item.includes("✅");
                      return (
                        <div
                          key={idx}
                          style={{
                            background: isProvided ? "#f0fdf4" : "#f8fafc",
                            padding: "0.75rem 1rem",
                            borderRadius: "10px",
                            border: isProvided ? "1px solid #bbf7d0" : "1px solid #e2e8f0",
                            fontSize: "0.88rem",
                            fontWeight: 600,
                            color: isProvided ? "#166534" : "#334155",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            gap: "0.75rem",
                          }}
                        >
                          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flex: 1 }}>
                            <span style={{ fontSize: "1rem" }}>{isProvided ? "✅" : "📋"}</span>
                            <span>{item}</span>
                          </div>
                          {!isProvided && (
                            <button
                              type="button"
                              onClick={() => {
                                let template = `[PREUVE COMPLÉMENTAIRE] ${item.replace("□ ", "")}`;
                                if (item.toLowerCase().includes("host")) {
                                  template = "[LOG HOST APPLICATIF] 10:15:22.019 ERR - Socket pool (host-01.bank.internal:10443) saturated: 64/64 active connections busy. Dropping incoming 0200 requests for STAN 739214.";
                                  setSelectedPresetCategory("HOST");
                                } else if (item.toLowerCase().includes("tcp") || item.toLowerCase().includes("reseau")) {
                                  template = "[TRACE TCP NETWORK] 10:15:25.802 WARN - TCP SYN-ACK timeout on port 10443 (Payway -> Host). Retries 3/3 exhausted.";
                                  setSelectedPresetCategory("TCP");
                                } else if (item.toLowerCase().includes("ej") || item.toLowerCase().includes("journal")) {
                                  template = "[ELECTRONIC JOURNAL ATM] 10:42:18.951 WARN - Presenter module sensor error code 04: Motor movement timeout on note transport.";
                                  setSelectedPresetCategory("GAB_EJ");
                                }
                                setInvestigationLogInput(template);
                                setIsInvestigationModalOpen(true);
                              }}
                              style={{
                                background: "#0284c7",
                                color: "#ffffff",
                                border: "none",
                                padding: "0.35rem 0.75rem",
                                borderRadius: "6px",
                                fontSize: "0.78rem",
                                fontWeight: 700,
                                cursor: "pointer",
                                whiteSpace: "nowrap",
                              }}
                            >
                              + Injecter cette preuve
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {copilotResult.nextInvestigationStep && (
                    <div style={{ background: "#eff6ff", borderLeft: "4px solid #0284c7", padding: "1rem 1.25rem", borderRadius: "0 8px 8px 0", marginBottom: "1.25rem" }}>
                      <span style={{ fontSize: "0.78rem", fontWeight: 800, color: "#0369a1", display: "block" }}>PROCHAINE ACTION D'INVESTIGATION RECOMMANDÉE :</span>
                      <p style={{ fontSize: "0.9rem", fontWeight: 700, color: "#0c4a6e", marginTop: "0.2rem", margin: 0 }}>
                        {copilotResult.nextInvestigationStep}
                      </p>
                    </div>
                  )}

                  {/* Historique des itérations d'investigation */}
                  {investigationHistory.length > 0 && (
                    <div style={{ background: "#f8fafc", padding: "1rem", borderRadius: "10px", border: "1px solid #e2e8f0", marginBottom: "1.25rem" }}>
                      <span style={{ fontSize: "0.78rem", fontWeight: 800, color: "#475569", display: "block", marginBottom: "0.5rem" }}>
                        📜 HISTORIQUE DES ITÉRATIONS D'INVESTIGATION ({investigationHistory.length} inj. effectuée{investigationHistory.length > 1 ? "s" : ""}) :
                      </span>
                      <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                        {investigationHistory.map((hist) => (
                          <div key={hist.id} style={{ fontSize: "0.8rem", color: "#334155", background: "#ffffff", padding: "0.5rem 0.75rem", borderRadius: "6px", border: "1px solid #cbd5e1" }}>
                            <span style={{ fontWeight: 800, color: "#0284c7" }}>Itération #{hist.id} [{hist.timestamp}]</span> - <span style={{ fontFamily: "monospace", color: "#0f172a" }}>{hist.content.substring(0, 90)}...</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => {
                      setInvestigationLogInput("");
                      setIsInvestigationModalOpen(true);
                    }}
                    style={{
                      background: "linear-gradient(135deg, #0284c7 0%, #0369a1 100%)",
                      color: "#ffffff",
                      padding: "0.85rem 1.75rem",
                      borderRadius: "10px",
                      fontWeight: 700,
                      fontSize: "0.92rem",
                      cursor: "pointer",
                      border: "none",
                      boxShadow: "0 4px 14px rgba(2,132,199,0.35)",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.6rem",
                    }}
                  >
                    <span>🔍</span> Poursuivre l'Investigation (Injecter des Logs Complémentaires)
                  </button>
                </div>
              )}

              {/* Card 6 : Cause Racine (RCA Proposée) & Gate de Validation Humaine */}
              <div
                style={{
                  background: operatorConfirmed
                    ? "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)"
                    : "linear-gradient(135deg, #fff1f2 0%, #ffe4e6 100%)",
                  padding: "2rem",
                  borderRadius: "16px",
                  border: operatorConfirmed ? "2px solid #22c55e" : "2px solid #e60028",
                  boxShadow: "0 10px 30px -5px rgba(0,0,0,0.08)",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                    <span style={{ fontSize: "1.8rem" }}>{operatorConfirmed ? "✅" : "⚠️"}</span>
                    <div>
                      <span style={{ fontSize: "0.75rem", fontWeight: 800, color: operatorConfirmed ? "#15803d" : "#9f1239", letterSpacing: "0.08em" }}>
                        {operatorConfirmed ? "RCA CONFIRMÉE PAR L'OPÉRATEUR" : "RCA PROPOSÉE — VALIDATION OPÉRATEUR REQUISE"}
                      </span>
                      <h3 style={{ fontSize: "1.25rem", fontWeight: 800, color: "#111827" }}>
                        7. Cause Racine (RCA) & Actions Curatives
                      </h3>
                    </div>
                  </div>
                  <span style={{ background: "#ffffff", padding: "0.4rem 0.8rem", borderRadius: "20px", fontWeight: 700, fontSize: "0.85rem", color: "#1e293b", border: "1px solid #cbd5e1" }}>
                    Certitude Agent : {copilotResult.rcaProposal.confidenceLevel}
                  </span>
                </div>

                <div style={{ background: "#ffffff", padding: "1.25rem", borderRadius: "10px", border: "1px solid rgba(0,0,0,0.1)", marginBottom: "1.25rem" }}>
                  <p style={{ fontSize: "0.95rem", lineHeight: "1.5", color: "#1e293b", margin: 0 }}>
                    {copilotResult.rcaProposal.summary}
                  </p>
                </div>

                <div style={{ marginBottom: "1.5rem" }}>
                  <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "#334155", display: "block", marginBottom: "0.5rem" }}>
                    ACTIONS CURATIVES & RUNBOOKS RECOMMANDÉS :
                  </span>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                    {copilotResult.rcaProposal.recommendedActions.map((act, i) => (
                      <div key={i} style={{ background: "#ffffff", padding: "0.6rem 0.9rem", borderRadius: "8px", fontSize: "0.85rem", fontWeight: 600, color: "#0f172a", border: "1px solid #e2e8f0" }}>
                        🛠️ {act}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Boutons d'Action & Gate Humaine */}
                <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "center", paddingTop: "1rem", borderTop: "1px solid rgba(0,0,0,0.08)" }}>
                  {!operatorConfirmed ? (
                    <button
                      type="button"
                      onClick={async () => {
                        setOperatorConfirmed(true);
                        // Auto-sauvegarde immédiate dans la BD avec statut VALIDATED
                        await handleSaveIncident();
                      }}
                      disabled={loading}
                      style={{
                        background: "#166534",
                        color: "#ffffff",
                        padding: "0.85rem 1.5rem",
                        borderRadius: "10px",
                        fontWeight: 700,
                        fontSize: "0.9rem",
                        cursor: loading ? "wait" : "pointer",
                        border: "none",
                        boxShadow: "0 4px 12px rgba(22,101,52,0.3)",
                      }}
                    >
                      {loading ? "💾 Enregistrement dans la BD..." : "✅ Confirmer la RCA & Enregistrer en BD"}
                    </button>
                  ) : (
                    <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                      <div style={{ background: "#dcfce7", color: "#15803d", padding: "0.6rem 1.25rem", borderRadius: "8px", fontWeight: 700, fontSize: "0.88rem" }}>
                        ✓ RCA Validée par l'opérateur et sauvegardée {createdRef ? `(${createdRef})` : ""}
                      </div>
                      <button
                        type="button"
                        className="btn-emerald"
                        onClick={() => router.push("/knowledge")}
                        style={{ padding: "0.6rem 1.25rem", fontSize: "0.88rem" }}
                      >
                        📚 Voir dans la Base de Connaissances (1ère Position) →
                      </button>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={handleSyncToGuidedForm}
                    style={{
                      background: "#0284c7",
                      color: "#ffffff",
                      padding: "0.85rem 1.5rem",
                      borderRadius: "10px",
                      fontWeight: 700,
                      fontSize: "0.9rem",
                      cursor: "pointer",
                      border: "none",
                      boxShadow: "0 4px 12px rgba(2,132,199,0.3)",
                    }}
                  >
                    📥 Synchroniser vers le Formulaire 8 Étapes
                  </button>

                  <button
                    type="button"
                    onClick={() => window.print()}
                    style={{
                      background: "#ffffff",
                      color: "#3f3f46",
                      padding: "0.85rem 1.25rem",
                      borderRadius: "10px",
                      fontWeight: 600,
                      fontSize: "0.9rem",
                      cursor: "pointer",
                      border: "1px solid #d4d4d8",
                    }}
                  >
                    📄 Exporter le Rapport PDF
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* VUE 2 : MODE GUIDÉ CLASSIQUE (FORMULAIRE METHODOLOGIQUE 8 ÉTAPES)       */}
      {/* ========================================================================= */}
      {mode === "GUIDED" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "1.75rem" }}>
          {/* Ruban Méthodologique */}
          <div style={{ background: "#ffffff", padding: "1.25rem", borderRadius: "14px", border: "1px solid #e4e4e7" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <div>
                <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#e60028", letterSpacing: "0.08em" }}>
                  MÉTHODOLOGIE D'ANALYSE EN 8 ÉTAPES
                </span>
                <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#111827" }}>
                  Étape {currentStep} / {STEPS.length} : {STEPS[currentStep - 1].name}
                </h3>
              </div>
              <span style={{ fontSize: "0.85rem", color: "#71717a" }}>
                {STEPS[currentStep - 1].desc}
              </span>
            </div>

            <div className="steps-ribbon">
              {STEPS.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setCurrentStep(s.id)}
                  className={`step-pill ${currentStep === s.id ? "active" : ""}`}
                  style={{ cursor: "pointer", border: currentStep === s.id ? "1px solid #e60028" : "1px solid #e4e4e7" }}
                >
                  <span
                    style={{
                      width: "20px",
                      height: "20px",
                      borderRadius: "50%",
                      background: currentStep === s.id ? "#e60028" : "#e4e4e7",
                      color: currentStep === s.id ? "#ffffff" : "#71717a",
                      display: "inline-grid",
                      placeItems: "center",
                      fontSize: "0.75rem",
                    }}
                  >
                    {s.id}
                  </span>
                  <span>{s.name}</span>
                </button>
              ))}
            </div>
          </div>

          {savedSuccess ? (
            <div style={{ background: "#ffffff", padding: "3rem", borderRadius: "14px", textAlign: "center", border: "1px solid #e4e4e7" }}>
              <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>✅</div>
              <h2 style={{ fontSize: "1.5rem", fontWeight: 800 }}>Incident {createdRef} enregistré dans MySQL</h2>
              <p style={{ color: "#71717a", marginTop: "0.5rem", marginBottom: "1.5rem" }}>
                L&apos;incident a été créé et lié à la base de données avec sa chaîne d&apos;observations et d&apos;audit.
              </p>
              <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
                {createdRef && (
                  <button
                    type="button"
                    className="btn-emerald"
                    onClick={() => router.push(`/incidents/${createdRef}`)}
                  >
                    Consulter la fiche détaillée →
                  </button>
                )}
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => router.push("/knowledge")}
                >
                  Voir la base de connaissances
                </button>
              </div>
            </div>
          ) : (
            /* Formulaire guidé par étape */
            <div style={{ background: "#ffffff", padding: "2rem", borderRadius: "14px", border: "1px solid #e4e4e7" }}>
              {currentStep === 1 && (
                <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                  <h4 style={{ fontSize: "1.1rem", fontWeight: 700 }}>1. Identification du problème & Symptôme initial</h4>
                  <div>
                    <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, marginBottom: "0.3rem" }}>
                      Titre de l&apos;incident *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="Ex. GAB — Retraits rejetés suite à saturation pool de connexion"
                      style={{ width: "100%", padding: "0.75rem", borderRadius: "8px", border: "1px solid #d4d4d8" }}
                    />
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, marginBottom: "0.3rem" }}>
                        Domaine
                      </label>
                      <select
                        value={formData.domain}
                        onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
                        style={{ width: "100%", padding: "0.75rem", borderRadius: "8px", border: "1px solid #d4d4d8" }}
                      >
                        <option value="GAB">GAB / Distributeur</option>
                        <option value="TPE">TPE / Paiement commerçant</option>
                        <option value="CARTE">Carte / EMV</option>
                        <option value="INTERFACE">Interface ISO 8583</option>
                        <option value="PAYWAY">Moteur Payway</option>
                        <option value="HOST">Host & Core Banking</option>
                        <option value="CLEARING">Clearing & Règlement</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, marginBottom: "0.3rem" }}>
                        Criticité
                      </label>
                      <select
                        value={formData.severity}
                        onChange={(e) => setFormData({ ...formData, severity: e.target.value })}
                        style={{ width: "100%", padding: "0.75rem", borderRadius: "8px", border: "1px solid #d4d4d8" }}
                      >
                        <option value="LOW">Faible (LOW)</option>
                        <option value="MEDIUM">Moyenne (MEDIUM)</option>
                        <option value="HIGH">Élevée (HIGH)</option>
                        <option value="CRITICAL">Critique (CRITICAL)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, marginBottom: "0.3rem" }}>
                      Symptôme constaté (Description du dysfonctionnement perçu par le client / guichet)
                    </label>
                    <textarea
                      rows={3}
                      value={formData.symptom}
                      onChange={(e) => setFormData({ ...formData, symptom: e.target.value })}
                      placeholder="Ex: Le client insère sa carte, saisit son code PIN mais l'automate affiche 'Opération impossible - Délais dépassé'."
                      style={{ width: "100%", padding: "0.75rem", borderRadius: "8px", border: "1px solid #d4d4d8" }}
                    />
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                  <h4 style={{ fontSize: "1.1rem", fontWeight: 700 }}>2. Faits observés (Objectifs & Mesurables)</h4>
                  <div>
                    <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, marginBottom: "0.3rem" }}>
                      Faits vérifiés sur le terrain ou sur les consoles
                    </label>
                    <textarea
                      rows={4}
                      value={formData.facts}
                      onChange={(e) => setFormData({ ...formData, facts: e.target.value })}
                      placeholder="Ex: 85 transactions échouées entre 10h12 et 10h34. Taux d'échec de 95% constaté sur la passerelle GAB."
                      style={{ width: "100%", padding: "0.75rem", borderRadius: "8px", border: "1px solid #d4d4d8" }}
                    />
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                  <h4 style={{ fontSize: "1.1rem", fontWeight: 700 }}>3. Périmètre d&apos;impact</h4>
                  <div>
                    <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, marginBottom: "0.3rem" }}>
                      Périmètre géographique & technique impacté
                    </label>
                    <textarea
                      rows={4}
                      value={formData.scope}
                      onChange={(e) => setFormData({ ...formData, scope: e.target.value })}
                      placeholder="Ex: 14 agences de la région Est, 28 automates NCR raccordés au contrôleur frontal NORD."
                      style={{ width: "100%", padding: "0.75rem", borderRadius: "8px", border: "1px solid #d4d4d8" }}
                    />
                  </div>
                </div>
              )}

              {currentStep === 4 && (
                <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                  <h4 style={{ fontSize: "1.1rem", fontWeight: 700 }}>4. Localisation du Point de Rupture</h4>
                  <p style={{ fontSize: "0.85rem", color: "#71717a" }}>
                    Chaîne technique : GAB/TPE → Frontal Payway → Host Switch → Issuer / Core Banking / HSM
                  </p>
                  <div>
                    <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, marginBottom: "0.3rem" }}>
                      Premier point de rupture identifié
                    </label>
                    <input
                      type="text"
                      value={formData.breakPoint}
                      onChange={(e) => setFormData({ ...formData, breakPoint: e.target.value })}
                      style={{ width: "100%", padding: "0.75rem", borderRadius: "8px", border: "1px solid #d4d4d8" }}
                    />
                  </div>
                </div>
              )}

              {currentStep === 5 && (
                <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                  <h4 style={{ fontSize: "1.1rem", fontWeight: 700 }}>5. Émission des Hypothèses</h4>
                  <p style={{ fontSize: "0.85rem", color: "#71717a" }}>
                    Formulez les explications possibles sans statuer définitivement.
                  </p>

                  {formData.hypotheses.map((h, idx) => (
                    <div key={idx} style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
                      <input
                        type="text"
                        value={h.desc}
                        onChange={(e) => {
                          const updated = [...formData.hypotheses];
                          updated[idx].desc = e.target.value;
                          setFormData({ ...formData, hypotheses: updated });
                        }}
                        placeholder={`Hypothèse #${idx + 1}`}
                        style={{ flex: 1, padding: "0.75rem", borderRadius: "8px", border: "1px solid #d4d4d8" }}
                      />
                      <select
                        value={h.status}
                        onChange={(e) => {
                          const updated = [...formData.hypotheses];
                          updated[idx].status = e.target.value;
                          setFormData({ ...formData, hypotheses: updated });
                        }}
                        style={{ padding: "0.75rem", borderRadius: "8px", border: "1px solid #d4d4d8" }}
                      >
                        <option value="OPEN">Ouverte</option>
                        <option value="PROBABLE">Probable</option>
                        <option value="REJECTED">Écartée</option>
                        <option value="CONFIRMED">Confirmée</option>
                      </select>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={addHypothesis}
                    style={{
                      alignSelf: "flex-start",
                      background: "#f4f4f5",
                      border: "1px dashed #a1a1aa",
                      padding: "0.5rem 1rem",
                      borderRadius: "6px",
                      cursor: "pointer",
                      fontSize: "0.85rem",
                      fontWeight: 600,
                    }}
                  >
                    + Ajouter une autre hypothèse
                  </button>
                </div>
              )}

              {currentStep === 6 && (
                <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                  <h4 style={{ fontSize: "1.1rem", fontWeight: 700 }}>6. Vérification & Preuves Techniques</h4>
                  <div>
                    <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, marginBottom: "0.3rem" }}>
                      Traces ISO 8583 masquées, logs système ou captures réseau
                    </label>
                    <textarea
                      rows={5}
                      value={formData.evidence}
                      onChange={(e) => setFormData({ ...formData, evidence: e.target.value })}
                      placeholder="0200 7238000008C08000 164500********9124..."
                      style={{ width: "100%", padding: "0.75rem", borderRadius: "8px", border: "1px solid #d4d4d8", fontFamily: "monospace", fontSize: "0.85rem" }}
                    />
                  </div>
                </div>
              )}

              {currentStep === 7 && (
                <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                  <h4 style={{ fontSize: "1.1rem", fontWeight: 700 }}>7. Cause Racine (RCA Formelle)</h4>
                  <div>
                    <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, marginBottom: "0.3rem" }}>
                      Cause racine démontrée & justification technique
                    </label>
                    <textarea
                      rows={4}
                      value={formData.rootCause}
                      onChange={(e) => setFormData({ ...formData, rootCause: e.target.value })}
                      placeholder="Ex: Déconnexion brutale du frontal consécutive au dépassement du pool max de sockets..."
                      style={{ width: "100%", padding: "0.75rem", borderRadius: "8px", border: "1px solid #d4d4d8" }}
                    />
                  </div>
                </div>
              )}

              {currentStep === 8 && (
                <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                  <h4 style={{ fontSize: "1.1rem", fontWeight: 700 }}>8. Correction, Contrôle post-action & Prévention</h4>
                  <div>
                    <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, marginBottom: "0.3rem" }}>
                      Actions de correction immédiate
                    </label>
                    <textarea
                      rows={3}
                      value={formData.correction}
                      onChange={(e) => setFormData({ ...formData, correction: e.target.value })}
                      placeholder="Ex: Augmentation de la taille du pool à 256 connexions et redémarrage du service frontal."
                      style={{ width: "100%", padding: "0.75rem", borderRadius: "8px", border: "1px solid #d4d4d8" }}
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, marginBottom: "0.3rem" }}>
                      Mesures préventives pérennes
                    </label>
                    <textarea
                      rows={3}
                      value={formData.prevention}
                      onChange={(e) => setFormData({ ...formData, prevention: e.target.value })}
                      placeholder="Ex: Création d'une sonde de supervision surveillant le seuil à 80% du pool."
                      style={{ width: "100%", padding: "0.75rem", borderRadius: "8px", border: "1px solid #d4d4d8" }}
                    />
                  </div>
                </div>
              )}

              {/* Boutons de navigation */}
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: "2rem", paddingTop: "1.5rem", borderTop: "1px solid #f4f4f5" }}>
                <button
                  type="button"
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  className="btn-secondary"
                  style={{ opacity: currentStep === 1 ? 0.5 : 1 }}
                >
                  ← Étape précédente
                </button>

                {currentStep < STEPS.length ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="btn-emerald"
                  >
                    Étape suivante →
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSaveIncident}
                    disabled={loading}
                    className="btn-emerald"
                  >
                    {loading ? "Enregistrement dans MySQL..." : "✓ Enregistrer dans la base de données"}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}
      {/* MODAL PERSONNALISEE : POURSUITE DE L INVESTIGATION (THEME CLAIR) */}
      {isInvestigationModalOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(15, 23, 42, 0.45)",
            backdropFilter: "blur(6px)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1.5rem",
          }}
        >
          <div
            style={{
              background: "#ffffff",
              color: "#1e293b",
              width: "100%",
              maxWidth: "680px",
              borderRadius: "16px",
              border: "1px solid #cbd5e1",
              boxShadow: "0 20px 45px -10px rgba(0, 0, 0, 0.18)",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* Header Modal */}
            <div
              style={{
                padding: "1.25rem 1.5rem",
                background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
                borderBottom: "1px solid #e2e8f0",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                <span style={{ fontSize: "1.4rem" }}>🔍</span>
                <div>
                  <h3 style={{ fontSize: "1.05rem", fontWeight: 800, color: "#0f172a", margin: 0 }}>
                    Poursuite des Investigations Monétiques
                  </h3>
                  <p style={{ fontSize: "0.78rem", color: "#64748b", margin: 0 }}>
                    Injectez de nouvelles preuves (logs applicatifs, trames TCP, EJ) pour affiner le diagnostic agentic.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsInvestigationModalOpen(false)}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#64748b",
                  fontSize: "1.3rem",
                  cursor: "pointer",
                  padding: "0.2rem 0.5rem",
                }}
              >
                ✕
              </button>
            </div>

            {/* Content Modal */}
            <div style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              {/* Presets rapides */}
              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, color: "#334155", marginBottom: "0.5rem" }}>
                  💡 Modèles de preuves prêtes à l&apos;emploi (Cliquer pour charger) :
                </label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedPresetCategory("HOST");
                      setInvestigationLogInput(
                        "[LOG HOST APPLICATIF] 10:15:22.019 ERR - Socket pool (host-01.bank.internal:10443) saturated: 64/64 active connections busy. Dropping incoming 0200 requests for STAN 739214."
                      );
                    }}
                    style={{
                      background: selectedPresetCategory === "HOST" ? "#0284c7" : "#f1f5f9",
                      color: selectedPresetCategory === "HOST" ? "#ffffff" : "#334155",
                      border: selectedPresetCategory === "HOST" ? "1px solid #0284c7" : "1px solid #cbd5e1",
                      padding: "0.4rem 0.75rem",
                      borderRadius: "6px",
                      fontSize: "0.78rem",
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    🖥️ Log Host Application
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedPresetCategory("TCP");
                      setInvestigationLogInput(
                        "[TRACE TCP NETWORK] 10:15:25.802 WARN - TCP SYN-ACK timeout on port 10443 (Payway -> Host). Retries 3/3 exhausted."
                      );
                    }}
                    style={{
                      background: selectedPresetCategory === "TCP" ? "#0284c7" : "#f1f5f9",
                      color: selectedPresetCategory === "TCP" ? "#ffffff" : "#334155",
                      border: selectedPresetCategory === "TCP" ? "1px solid #0284c7" : "1px solid #cbd5e1",
                      padding: "0.4rem 0.75rem",
                      borderRadius: "6px",
                      fontSize: "0.78rem",
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    🌐 Trace Network TCP
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedPresetCategory("ISO");
                      setInvestigationLogInput(
                        "[TRAME ISO 8583] MTI=0210 STAN=739214 DE39=91 DE44=HOST_TIMEOUT DE3=010000 DE4=000000005000 RRN=849201948201"
                      );
                    }}
                    style={{
                      background: selectedPresetCategory === "ISO" ? "#0284c7" : "#f1f5f9",
                      color: selectedPresetCategory === "ISO" ? "#ffffff" : "#334155",
                      border: selectedPresetCategory === "ISO" ? "1px solid #0284c7" : "1px solid #cbd5e1",
                      padding: "0.4rem 0.75rem",
                      borderRadius: "6px",
                      fontSize: "0.78rem",
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    💳 Trame ISO 8583
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedPresetCategory("GAB_EJ");
                      setInvestigationLogInput(
                        "[ELECTRONIC JOURNAL ATM] 10:42:18.951 WARN - Presenter module sensor error code 04: Motor movement timeout on note transport."
                      );
                    }}
                    style={{
                      background: selectedPresetCategory === "GAB_EJ" ? "#0284c7" : "#f1f5f9",
                      color: selectedPresetCategory === "GAB_EJ" ? "#ffffff" : "#334155",
                      border: selectedPresetCategory === "GAB_EJ" ? "1px solid #0284c7" : "1px solid #cbd5e1",
                      padding: "0.4rem 0.75rem",
                      borderRadius: "6px",
                      fontSize: "0.78rem",
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    📟 Journal Physique ATM EJ
                  </button>
                </div>
              </div>

              {/* Textarea Saisie de Logs */}
              <div>
                <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, color: "#334155", marginBottom: "0.4rem" }}>
                  Saisissez ou collez l&apos;extrait de preuves/logs système :
                </label>
                <textarea
                  rows={6}
                  value={investigationLogInput}
                  onChange={(e) => setInvestigationLogInput(e.target.value)}
                  placeholder="Ex: Collez ici les logs applicatifs Host, les traces TCP ou le journal EJ..."
                  style={{
                    width: "100%",
                    padding: "0.85rem",
                    borderRadius: "10px",
                    background: "#f8fafc",
                    border: "1px solid #cbd5e1",
                    color: "#0f172a",
                    fontFamily: "monospace",
                    fontSize: "0.85rem",
                    lineHeight: "1.4",
                    boxSizing: "border-box",
                  }}
                />
                <span style={{ fontSize: "0.75rem", color: "#64748b", marginTop: "0.3rem", display: "block" }}>
                  {investigationLogInput.length} caractères • Ces données seront intégrées au registre Evidence Ledger.
                </span>
              </div>
            </div>

            {/* Footer Modal */}
            <div
              style={{
                padding: "1.25rem 1.5rem",
                background: "#f8fafc",
                borderTop: "1px solid #e2e8f0",
                display: "flex",
                justifyContent: "flex-end",
                gap: "0.75rem",
              }}
            >
              <button
                type="button"
                onClick={() => setIsInvestigationModalOpen(false)}
                style={{
                  background: "#ffffff",
                  color: "#475569",
                  padding: "0.7rem 1.25rem",
                  borderRadius: "8px",
                  fontWeight: 600,
                  fontSize: "0.85rem",
                  cursor: "pointer",
                  border: "1px solid #cbd5e1",
                }}
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={() => {
                  if (!investigationLogInput.trim()) return;
                  const newEntry = {
                    id: investigationHistory.length + 1,
                    timestamp: new Date().toLocaleTimeString("fr-FR"),
                    category: selectedPresetCategory,
                    content: investigationLogInput.trim(),
                  };
                  setInvestigationHistory([...investigationHistory, newEntry]);
                  setFormData((prev) => ({
                    ...prev,
                    evidence: `${prev.evidence}\n[LOG COMPLÉMENTAIRE OPERATEUR] ${investigationLogInput.trim()}`,
                  }));
                  setIsInvestigationModalOpen(false);
                  handleRunCopilotAnalysis();
                }}
                disabled={!investigationLogInput.trim()}
                style={{
                  background: investigationLogInput.trim()
                    ? "linear-gradient(135deg, #0284c7 0%, #0369a1 100%)"
                    : "#cbd5e1",
                  color: "#ffffff",
                  padding: "0.7rem 1.5rem",
                  borderRadius: "8px",
                  fontWeight: 700,
                  fontSize: "0.85rem",
                  cursor: investigationLogInput.trim() ? "pointer" : "not-allowed",
                  border: "none",
                  boxShadow: investigationLogInput.trim() ? "0 4px 12px rgba(2,132,199,0.35)" : "none",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                <span>⚡</span> Re-lancer l&apos;Analyse avec l&apos;Agent
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
