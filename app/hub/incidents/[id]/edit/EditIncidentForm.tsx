"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  IncidentRecord,
  HypothesisItem,
  EvidenceItem,
  PreventionItem,
  Severity,
  KnowledgeStatus,
  HypothesisStatus,
} from "@/modules/incidents/types";

interface StepConfig {
  id: number;
  title: string;
  shortTitle: string;
  subtitle: string;
  icon: string;
}

const EDIT_STEPS: StepConfig[] = [
  {
    id: 1,
    title: "Identification & Classification",
    shortTitle: "Identification",
    subtitle: "Titre, canal, composant technique, code erreur et criticité",
    icon: "🏷️",
  },
  {
    id: 2,
    title: "Symptômes & Constats Terrain",
    shortTitle: "Constats Terrain",
    subtitle: "Symptôme perçu, faits objectifs mesurés, périmètre et contexte",
    icon: "🔍",
  },
  {
    id: 3,
    title: "Investigation, Hypothèses & Preuves",
    shortTitle: "Investigation",
    subtitle: "Pistes techniques évaluées, traces ISO 8583 et logs horodatés",
    icon: "🧬",
  },
  {
    id: 4,
    title: "Cause Racine Formelle (RCA)",
    shortTitle: "Cause Racine",
    subtitle: "Catégorie de panne, démonstration technique et preuves de corrélation",
    icon: "🎯",
  },
  {
    id: 5,
    title: "Résolution, Prévention & Validation",
    shortTitle: "Résolution & Bilan",
    subtitle: "Actions curatives, contrôle post-action, prévention et récapitulatif",
    icon: "🛡️",
  },
];

const DOMAIN_SUGGESTIONS = [
  "GAB",
  "GAB / Reversal",
  "TPE / POS",
  "Switch / Routage",
  "Carte / EMV",
  "HSM / Cryptographie",
  "CBS Amplitude",
  "CBS FLEXCUBE",
  "Compensation / Clearing",
];

const COMPONENT_SUGGESTIONS = [
  "Frontal Payway",
  "Switch National",
  "Host CBS",
  "HSM Thales PayShield",
  "Base Oracle CBS",
  "Module Dispenseur GAB",
  "Passerelle GIMAC / VISA",
];

const ERROR_CODE_SUGGESTIONS = [
  "DE39=91",
  "DE39=05",
  "DE39=55",
  "DE39=68",
  "DE39=96",
  "MTI=0400",
  "ORA-01653",
  "ST-SAVE-004",
];

const RCA_CATEGORY_SUGGESTIONS = [
  "Système & Infrastructure",
  "Core Banking / Host CBS",
  "Paramétrage ISO 8583 / Switch",
  "HSM & Cryptographie (ZPK/ZMK)",
  "Réseau & Télécom Interbancaire",
  "Matériel GAB / Dispenseur",
  "Partenaire Externe / Émetteur",
];

const SEVERITY_OPTIONS: Array<{
  value: Severity;
  label: string;
  desc: string;
  bg: string;
  border: string;
  text: string;
  badgeBg: string;
}> = [
  {
    value: "LOW",
    label: "Faible (LOW)",
    desc: "Impact mineur ou isolé sans interruption de service",
    bg: "#f8fafc",
    border: "#cbd5e1",
    text: "#334155",
    badgeBg: "#e2e8f0",
  },
  {
    value: "MEDIUM",
    label: "Moyenne (MEDIUM)",
    desc: "Dégradation partielle avec contournement actif",
    bg: "#eff6ff",
    border: "#93c5fd",
    text: "#1d4ed8",
    badgeBg: "#dbeafe",
  },
  {
    value: "HIGH",
    label: "Élevée (HIGH)",
    desc: "Fort taux de rejet ou indisponibilité sur un canal clé",
    bg: "#fffbeb",
    border: "#fcd34d",
    text: "#b45309",
    badgeBg: "#fef3c7",
  },
  {
    value: "CRITICAL",
    label: "Critique (CRITICAL)",
    desc: "Arrêt majeur de production, risque financier ou SLA P1",
    bg: "#fef2f2",
    border: "#fca5a5",
    text: "#b91c1c",
    badgeBg: "#fee2e2",
  },
];

export function EditIncidentForm({ incident }: { incident: IncidentRecord }) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saveFeedback, setSaveFeedback] = useState<string | null>(null);

  // Étape 1 : Identification
  const [title, setTitle] = useState(incident.title);
  const [description, setDescription] = useState(incident.description || "");
  const [domain, setDomain] = useState(incident.domain || "GAB");
  const [component, setComponent] = useState(incident.component || "Frontal Payway");
  const [errorCode, setErrorCode] = useState(incident.errorCode || "DE39=91");
  const [environment, setEnvironment] = useState(incident.environment || "PRODUCTION");
  const [severity, setSeverity] = useState<Severity>(incident.severity || "HIGH");
  const [knowledgeStatus, setKnowledgeStatus] = useState<KnowledgeStatus>(
    incident.knowledgeStatus || "VALIDATED"
  );

  // Étape 2 : Symptômes & Constats Terrain
  const [symptom, setSymptom] = useState(incident.observations?.[0]?.symptom || "");
  const [facts, setFacts] = useState(incident.observations?.[0]?.facts || "");
  const [scope, setScope] = useState(incident.observations?.[0]?.scope || "");
  const [context, setContext] = useState(incident.observations?.[0]?.context || "");

  // Étape 3 : Hypothèses & Preuves
  const [hypotheses, setHypotheses] = useState<HypothesisItem[]>(
    incident.hypotheses && incident.hypotheses.length > 0
      ? incident.hypotheses.map((h) => ({
          description: h.description || "",
          status: h.status || "OPEN",
          evidence: h.evidence || "",
        }))
      : [
          {
            description: "Anomalie de traitement ou timeout sur le composant cible",
            status: "CONFIRMED",
            evidence: "Corrélé avec les logs applicatifs et trames ISO.",
          },
        ]
  );

  const [evidenceList, setEvidenceList] = useState<EvidenceItem[]>(
    incident.evidence && incident.evidence.length > 0
      ? incident.evidence.map((e) => ({
          type: e.type || "Log Applicatif",
          source: e.source || incident.component || "Système",
          content: e.content || "",
        }))
      : [
          {
            type: "Log Applicatif",
            source: incident.component || "Frontal Monétique",
            content: "",
          },
        ]
  );

  // Étape 4 : Cause Racine (RCA)
  const [rootCauseCategory, setRootCauseCategory] = useState(
    incident.rootCause?.category || "Système & Infrastructure"
  );
  const [rootCauseDescription, setRootCauseDescription] = useState(
    incident.rootCause?.description || ""
  );
  const [rootCauseJustification, setRootCauseJustification] = useState(
    incident.rootCause?.justification || ""
  );

  // Étape 5 : Résolution & Prévention
  const [resolutionActions, setResolutionActions] = useState(
    incident.resolution?.actions || ""
  );
  const [resolutionResult, setResolutionResult] = useState(
    incident.resolution?.result || ""
  );
  const [preventionList, setPreventionList] = useState<PreventionItem[]>(
    incident.prevention && incident.prevention.length > 0
      ? incident.prevention.map((p) => ({
          action: p.action || "",
          owner: p.owner || "Équipe Monétique",
          priority: p.priority || "HIGH",
          status: p.status || "DONE",
        }))
      : [
          {
            action: "Renforcement de la supervision et alerte sur seuil de rejet",
            owner: "Exploitation Monétique",
            priority: "HIGH",
            status: "DONE",
          },
        ]
  );

  // Vérification de complétude par étape
  const isStepComplete = (stepId: number): boolean => {
    switch (stepId) {
      case 1:
        return Boolean(title.trim() && domain.trim() && component.trim());
      case 2:
        return Boolean(symptom.trim() && facts.trim());
      case 3:
        return hypotheses.some((h) => h.description.trim().length > 0);
      case 4:
        return Boolean(rootCauseCategory.trim() && rootCauseDescription.trim());
      case 5:
        return Boolean(resolutionActions.trim());
      default:
        return false;
    }
  };

  const completedStepsCount = EDIT_STEPS.filter((s) => isStepComplete(s.id)).length;
  const progressPercent = Math.round((completedStepsCount / EDIT_STEPS.length) * 100);

  // Gestionnaires d'hypothèses
  const addHypothesis = () => {
    setHypotheses([
      ...hypotheses,
      { description: "", status: "OPEN", evidence: "" },
    ]);
  };

  const updateHypothesis = (
    idx: number,
    field: keyof HypothesisItem,
    value: string
  ) => {
    const next = [...hypotheses];
    next[idx] = { ...next[idx], [field]: value };
    setHypotheses(next);
  };

  const removeHypothesis = (idx: number) => {
    if (hypotheses.length <= 1) return;
    setHypotheses(hypotheses.filter((_, i) => i !== idx));
  };

  // Gestionnaires de preuves
  const addEvidence = () => {
    setEvidenceList([
      ...evidenceList,
      { type: "Trame ISO 8583", source: component || "Switch", content: "" },
    ]);
  };

  const updateEvidence = (
    idx: number,
    field: keyof EvidenceItem,
    value: string
  ) => {
    const next = [...evidenceList];
    next[idx] = { ...next[idx], [field]: value };
    setEvidenceList(next);
  };

  const removeEvidence = (idx: number) => {
    if (evidenceList.length <= 1) return;
    setEvidenceList(evidenceList.filter((_, i) => i !== idx));
  };

  // Gestionnaires de mesures préventives
  const addPrevention = () => {
    setPreventionList([
      ...preventionList,
      {
        action: "",
        owner: "Exploitation Monétique",
        priority: "HIGH",
        status: "DONE",
      },
    ]);
  };

  const updatePrevention = (
    idx: number,
    field: keyof PreventionItem,
    value: string
  ) => {
    const next = [...preventionList];
    next[idx] = { ...next[idx], [field]: value };
    setPreventionList(next);
  };

  const removePrevention = (idx: number) => {
    if (preventionList.length <= 1) return;
    setPreventionList(preventionList.filter((_, i) => i !== idx));
  };

  const handleSave = async (redirectAfterSave = true) => {
    if (!title.trim()) {
      setError("Le titre de l'incident est obligatoire (Étape 1).");
      setCurrentStep(1);
      return;
    }

    setLoading(true);
    setError(null);
    setSaveFeedback(null);

    try {
      const cleanedHypotheses = hypotheses.filter((h) => h.description.trim().length > 0);
      const cleanedEvidence = evidenceList.filter((e) => e.content.trim().length > 0);
      const cleanedPrevention = preventionList.filter((p) => p.action.trim().length > 0);

      const res = await fetch(`/api/incidents/${encodeURIComponent(incident.reference)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          domain: domain.trim(),
          component: component.trim(),
          errorCode: errorCode.trim(),
          environment,
          severity,
          knowledgeStatus,
          symptom: symptom.trim(),
          facts: facts.trim(),
          scope: scope.trim(),
          context: context.trim(),
          hypotheses: cleanedHypotheses,
          evidence: cleanedEvidence,
          rootCauseCategory: rootCauseCategory.trim(),
          rootCauseDescription: rootCauseDescription.trim(),
          rootCauseJustification: rootCauseJustification.trim(),
          resolutionActions: resolutionActions.trim(),
          resolutionResult: resolutionResult.trim(),
          prevention: cleanedPrevention,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Erreur lors de la mise à jour de l'incident.");
      }

      if (redirectAfterSave) {
        router.push(`/hub/incidents/${incident.reference}`);
        router.refresh();
      } else {
        setSaveFeedback("Modifications enregistrées avec succès.");
        router.refresh();
        setTimeout(() => setSaveFeedback(null), 3500);
      }
    } catch (err: any) {
      setError(err.message || "Impossible de sauvegarder les modifications.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleSave(true);
  };

  const activeStepObj = EDIT_STEPS.find((s) => s.id === currentStep) || EDIT_STEPS[0];
  const currentSeverityMeta =
    SEVERITY_OPTIONS.find((s) => s.value === severity) || SEVERITY_OPTIONS[2];

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: "0.82rem",
    fontWeight: 700,
    color: "#1e293b",
    marginBottom: "0.4rem",
    letterSpacing: "0.01em",
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "0.75rem 0.95rem",
    borderRadius: "10px",
    border: "1px solid #cbd5e1",
    background: "#f8fafc",
    fontSize: "0.9rem",
    color: "#0f172a",
    outline: "none",
    transition: "all 0.15s ease",
    boxSizing: "border-box",
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "1.5rem",
        maxWidth: "1240px",
      }}
    >
      {/* BARRE SUPÉRIEURE : Identité de l'incident + Actions rapides */}
      <div
        style={{
          background: "#ffffff",
          borderRadius: "16px",
          border: "1px solid #e2e8f0",
          padding: "1.25rem 1.5rem",
          boxShadow: "0 4px 16px -6px rgba(15, 23, 42, 0.05)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "1rem",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.85rem", flexWrap: "wrap" }}>
          <span
            style={{
              background: "#0f172a",
              color: "#ffffff",
              fontWeight: 800,
              fontSize: "0.85rem",
              padding: "0.4rem 0.85rem",
              borderRadius: "8px",
              fontFamily: "monospace",
              letterSpacing: "0.04em",
            }}
          >
            {incident.reference}
          </span>

          <span
            style={{
              background:
                knowledgeStatus === "VALIDATED" ? "#ecfdf5" : "#fffbeb",
              color: knowledgeStatus === "VALIDATED" ? "#047857" : "#b45309",
              border:
                knowledgeStatus === "VALIDATED"
                  ? "1px solid #a7f3d0"
                  : "1px solid #fde68a",
              fontWeight: 700,
              fontSize: "0.78rem",
              padding: "0.35rem 0.75rem",
              borderRadius: "999px",
            }}
          >
            {knowledgeStatus === "VALIDATED"
              ? "✓ Connaissance Validée"
              : "📋 Scénario de Référence"}
          </span>

          <span
            style={{
              background: currentSeverityMeta.badgeBg,
              color: currentSeverityMeta.text,
              border: `1px solid ${currentSeverityMeta.border}`,
              fontWeight: 800,
              fontSize: "0.78rem",
              padding: "0.35rem 0.75rem",
              borderRadius: "999px",
            }}
          >
            Criticité : {severity}
          </span>

          {errorCode && (
            <code
              style={{
                background: "#f1f5f9",
                border: "1px solid #cbd5e1",
                color: "#0f172a",
                padding: "0.3rem 0.65rem",
                borderRadius: "6px",
                fontSize: "0.8rem",
                fontWeight: 700,
              }}
            >
              {errorCode}
            </code>
          )}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
          <Link
            href={`/hub/incidents/${incident.reference}`}
            style={{
              padding: "0.6rem 1rem",
              borderRadius: "10px",
              border: "1px solid #cbd5e1",
              background: "#ffffff",
              color: "#475569",
              fontSize: "0.83rem",
              fontWeight: 700,
              textDecoration: "none",
            }}
          >
            ← Retour à la fiche
          </Link>

          <button
            type="button"
            disabled={loading}
            onClick={() => handleSave(false)}
            style={{
              padding: "0.6rem 1.1rem",
              borderRadius: "10px",
              border: "1px solid #059669",
              background: "#ecfdf5",
              color: "#047857",
              fontSize: "0.83rem",
              fontWeight: 700,
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            💾 Enregistrer sans quitter
          </button>

          <button
            type="submit"
            disabled={loading}
            style={{
              padding: "0.6rem 1.25rem",
              borderRadius: "10px",
              border: "none",
              background: "linear-gradient(135deg, #059669 0%, #047857 100%)",
              color: "#ffffff",
              fontSize: "0.84rem",
              fontWeight: 800,
              cursor: loading ? "not-allowed" : "pointer",
              boxShadow: "0 4px 12px rgba(5, 150, 105, 0.25)",
            }}
          >
            {loading ? "Enregistrement..." : "✓ Valider & Fermer"}
          </button>
        </div>
      </div>

      {/* BANDEAUX D'ALERTE / CONFIRMATION */}
      {error && (
        <div
          style={{
            padding: "0.95rem 1.25rem",
            background: "#fef2f2",
            color: "#991b1b",
            borderRadius: "12px",
            border: "1px solid #fca5a5",
            fontSize: "0.88rem",
            fontWeight: 600,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span>⚠️ {error}</span>
          <button
            type="button"
            onClick={() => setError(null)}
            style={{
              background: "transparent",
              border: "none",
              color: "#991b1b",
              fontWeight: 800,
              cursor: "pointer",
            }}
          >
            ✕
          </button>
        </div>
      )}

      {saveFeedback && (
        <div
          style={{
            padding: "0.95rem 1.25rem",
            background: "#ecfdf5",
            color: "#065f46",
            borderRadius: "12px",
            border: "1px solid #6ee7b7",
            fontSize: "0.88rem",
            fontWeight: 700,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span>✅ {saveFeedback}</span>
          <button
            type="button"
            onClick={() => setSaveFeedback(null)}
            style={{
              background: "transparent",
              border: "none",
              color: "#065f46",
              fontWeight: 800,
              cursor: "pointer",
            }}
          >
            ✕
          </button>
        </div>
      )}

      {/* STEPPER MULTI-ÉTAPES INTERACTIF */}
      <div
        style={{
          background: "#ffffff",
          borderRadius: "16px",
          border: "1px solid #e2e8f0",
          padding: "1.25rem 1.5rem",
          boxShadow: "0 2px 10px -4px rgba(15, 23, 42, 0.04)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "0.9rem",
            flexWrap: "wrap",
            gap: "0.5rem",
          }}
        >
          <div style={{ fontSize: "0.8rem", fontWeight: 700, color: "#64748b" }}>
            PARCOURS D&apos;ÉDITION STRUCTURÉ — Étape {currentStep} sur {EDIT_STEPS.length}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
            <div
              style={{
                width: "140px",
                height: "7px",
                background: "#f1f5f9",
                borderRadius: "999px",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: `${progressPercent}%`,
                  height: "100%",
                  background: "linear-gradient(90deg, #10b981 0%, #059669 100%)",
                  transition: "width 0.25s ease",
                }}
              />
            </div>
            <span style={{ fontSize: "0.78rem", fontWeight: 800, color: "#059669" }}>
              {completedStepsCount}/{EDIT_STEPS.length} sections complètes ({progressPercent}%)
            </span>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(185px, 1fr))",
            gap: "0.65rem",
          }}
        >
          {EDIT_STEPS.map((step) => {
            const isActive = step.id === currentStep;
            const isDone = isStepComplete(step.id);

            return (
              <button
                key={step.id}
                type="button"
                onClick={() => setCurrentStep(step.id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  padding: "0.8rem 0.95rem",
                  borderRadius: "12px",
                  border: isActive
                    ? "2px solid #059669"
                    : isDone
                    ? "1px solid #a7f3d0"
                    : "1px solid #e2e8f0",
                  background: isActive
                    ? "linear-gradient(135deg, #ecfdf5 0%, #f0fdf4 100%)"
                    : isDone
                    ? "#f8fafc"
                    : "#ffffff",
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "all 0.15s ease",
                }}
              >
                <div
                  style={{
                    width: "34px",
                    height: "34px",
                    borderRadius: "10px",
                    background: isActive
                      ? "#059669"
                      : isDone
                      ? "#d1fae5"
                      : "#f1f5f9",
                    color: isActive
                      ? "#ffffff"
                      : isDone
                      ? "#065f46"
                      : "#64748b",
                    display: "grid",
                    placeItems: "center",
                    fontWeight: 800,
                    fontSize: "0.9rem",
                    flexShrink: 0,
                  }}
                >
                  {isDone && !isActive ? "✓" : step.id}
                </div>

                <div style={{ minWidth: 0, flex: 1 }}>
                  <div
                    style={{
                      fontSize: "0.7rem",
                      fontWeight: 800,
                      textTransform: "uppercase",
                      letterSpacing: "0.04em",
                      color: isActive ? "#047857" : "#64748b",
                    }}
                  >
                    Étape {step.id}
                  </div>
                  <div
                    style={{
                      fontSize: "0.85rem",
                      fontWeight: 800,
                      color: isActive ? "#064e3b" : "#0f172a",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {step.icon} {step.shortTitle}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* GRILLE PRINCIPALE : Contenu de l'étape (Gauche) + Panneau Synthèse Temps-Réel (Droite) */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 1fr) 320px",
          gap: "1.5rem",
          alignItems: "start",
        }}
      >
        {/* CARTE PRINCIPALE DE L'ÉTAPE ACTIVE */}
        <div
          style={{
            background: "#ffffff",
            borderRadius: "16px",
            border: "1px solid #e2e8f0",
            padding: "2rem",
            boxShadow: "0 6px 20px -8px rgba(15, 23, 42, 0.06)",
          }}
        >
          {/* En-tête de l'étape */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              paddingBottom: "1.25rem",
              marginBottom: "1.5rem",
              borderBottom: "1px solid #f1f5f9",
              gap: "1rem",
              flexWrap: "wrap",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.85rem" }}>
              <div
                style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "12px",
                  background: "#ecfdf5",
                  border: "1px solid #a7f3d0",
                  display: "grid",
                  placeItems: "center",
                  fontSize: "1.35rem",
                }}
              >
                {activeStepObj.icon}
              </div>
              <div>
                <span
                  style={{
                    fontSize: "0.73rem",
                    fontWeight: 800,
                    color: "#059669",
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                  }}
                >
                  Étape {activeStepObj.id} sur {EDIT_STEPS.length}
                </span>
                <h2
                  style={{
                    fontSize: "1.22rem",
                    fontWeight: 800,
                    color: "#0f172a",
                    margin: "0.1rem 0 0.2rem 0",
                  }}
                >
                  {activeStepObj.title}
                </h2>
                <p style={{ fontSize: "0.84rem", color: "#64748b", margin: 0 }}>
                  {activeStepObj.subtitle}
                </p>
              </div>
            </div>

            <span
              style={{
                fontSize: "0.76rem",
                fontWeight: 700,
                padding: "0.3rem 0.7rem",
                borderRadius: "999px",
                background: isStepComplete(currentStep) ? "#ecfdf5" : "#fffbeb",
                color: isStepComplete(currentStep) ? "#047857" : "#b45309",
                border: isStepComplete(currentStep)
                  ? "1px solid #a7f3d0"
                  : "1px solid #fde68a",
              }}
            >
              {isStepComplete(currentStep) ? "✓ Section complète" : "⚡ Champs requis"}
            </span>
          </div>

          {/* ============================================================== */}
          {/* ÉTAPE 1 : IDENTIFICATION & CLASSIFICATION                      */}
          {/* ============================================================== */}
          {currentStep === 1 && (
            <div style={{ display: "flex", flexDirection: "column", gap: "1.35rem" }}>
              <div>
                <label style={labelStyle}>
                  Titre de l&apos;incident <span style={{ color: "#dc2626" }}>*</span>
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ex: GAB — Client débité malgré retrait non distribué"
                  style={{
                    ...inputStyle,
                    fontSize: "0.96rem",
                    fontWeight: 600,
                    background: "#ffffff",
                  }}
                />
              </div>

              <div>
                <label style={labelStyle}>Description synthétique / Résumé exécutif</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Synthèse claire de l'incident pour le catalogue de connaissances..."
                  style={{ ...inputStyle, background: "#ffffff", lineHeight: 1.5 }}
                />
              </div>

              {/* Grille Domaine / Composant / Code erreur / Environnement */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                  gap: "1.1rem",
                }}
              >
                <div>
                  <label style={labelStyle}>
                    Domaine / Canal <span style={{ color: "#dc2626" }}>*</span>
                  </label>
                  <input
                    type="text"
                    value={domain}
                    onChange={(e) => setDomain(e.target.value)}
                    placeholder="Ex: GAB / Reversal"
                    style={{ ...inputStyle, background: "#ffffff" }}
                  />
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "0.35rem",
                      marginTop: "0.45rem",
                    }}
                  >
                    {DOMAIN_SUGGESTIONS.map((item) => (
                      <button
                        key={item}
                        type="button"
                        onClick={() => setDomain(item)}
                        style={{
                          padding: "0.2rem 0.55rem",
                          borderRadius: "6px",
                          fontSize: "0.72rem",
                          fontWeight: 600,
                          border:
                            domain === item
                              ? "1px solid #059669"
                              : "1px solid #e2e8f0",
                          background: domain === item ? "#ecfdf5" : "#f8fafc",
                          color: domain === item ? "#047857" : "#475569",
                          cursor: "pointer",
                        }}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label style={labelStyle}>
                    Composant concerné <span style={{ color: "#dc2626" }}>*</span>
                  </label>
                  <input
                    type="text"
                    value={component}
                    onChange={(e) => setComponent(e.target.value)}
                    placeholder="Ex: Frontal Payway"
                    style={{ ...inputStyle, background: "#ffffff" }}
                  />
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "0.35rem",
                      marginTop: "0.45rem",
                    }}
                  >
                    {COMPONENT_SUGGESTIONS.map((item) => (
                      <button
                        key={item}
                        type="button"
                        onClick={() => setComponent(item)}
                        style={{
                          padding: "0.2rem 0.55rem",
                          borderRadius: "6px",
                          fontSize: "0.72rem",
                          fontWeight: 600,
                          border:
                            component === item
                              ? "1px solid #059669"
                              : "1px solid #e2e8f0",
                          background: component === item ? "#ecfdf5" : "#f8fafc",
                          color: component === item ? "#047857" : "#475569",
                          cursor: "pointer",
                        }}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                  gap: "1.1rem",
                }}
              >
                <div>
                  <label style={labelStyle}>Code Erreur / Clé Technique</label>
                  <input
                    type="text"
                    value={errorCode}
                    onChange={(e) => setErrorCode(e.target.value)}
                    placeholder="Ex: DE39=91, ORA-01653..."
                    style={{
                      ...inputStyle,
                      background: "#ffffff",
                      fontFamily: "monospace",
                      fontWeight: 700,
                    }}
                  />
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "0.35rem",
                      marginTop: "0.45rem",
                    }}
                  >
                    {ERROR_CODE_SUGGESTIONS.map((code) => (
                      <button
                        key={code}
                        type="button"
                        onClick={() => setErrorCode(code)}
                        style={{
                          padding: "0.2rem 0.5rem",
                          borderRadius: "6px",
                          fontSize: "0.72rem",
                          fontFamily: "monospace",
                          fontWeight: 700,
                          border:
                            errorCode === code
                              ? "1px solid #059669"
                              : "1px solid #e2e8f0",
                          background: errorCode === code ? "#ecfdf5" : "#f8fafc",
                          color: errorCode === code ? "#047857" : "#475569",
                          cursor: "pointer",
                        }}
                      >
                        {code}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label style={labelStyle}>Environnement d&apos;exploitation</label>
                  <select
                    value={environment}
                    onChange={(e) => setEnvironment(e.target.value)}
                    style={{ ...inputStyle, background: "#ffffff" }}
                  >
                    <option value="PRODUCTION">🟢 PRODUCTION</option>
                    <option value="PRE-PRODUCTION">🟡 PRÉ-PRODUCTION / UAT</option>
                    <option value="DRP / PRA">🟠 SITE DE SECOURS (DRP / PRA)</option>
                  </select>
                </div>
              </div>

              {/* Cartes de sélection de Criticité */}
              <div>
                <label style={labelStyle}>Niveau de Criticité (Impact Métier & SLA)</label>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                    gap: "0.75rem",
                  }}
                >
                  {SEVERITY_OPTIONS.map((opt) => {
                    const selected = severity === opt.value;
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setSeverity(opt.value)}
                        style={{
                          padding: "0.85rem 1rem",
                          borderRadius: "12px",
                          border: selected
                            ? `2px solid ${opt.text}`
                            : `1px solid ${opt.border}`,
                          background: selected ? opt.bg : "#ffffff",
                          textAlign: "left",
                          cursor: "pointer",
                          transition: "all 0.15s ease",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom: "0.25rem",
                          }}
                        >
                          <span
                            style={{
                              fontSize: "0.82rem",
                              fontWeight: 800,
                              color: opt.text,
                            }}
                          >
                            {opt.label}
                          </span>
                          {selected && (
                            <span
                              style={{
                                fontSize: "0.75rem",
                                fontWeight: 800,
                                color: opt.text,
                              }}
                            >
                              ✓
                            </span>
                          )}
                        </div>
                        <div style={{ fontSize: "0.74rem", color: "#64748b", lineHeight: 1.35 }}>
                          {opt.desc}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Statut dans la Base de Connaissances */}
              <div>
                <label style={labelStyle}>Statut de Capitalisation (Base de Connaissances)</label>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                    gap: "0.75rem",
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setKnowledgeStatus("VALIDATED")}
                    style={{
                      padding: "0.9rem 1.1rem",
                      borderRadius: "12px",
                      border:
                        knowledgeStatus === "VALIDATED"
                          ? "2px solid #059669"
                          : "1px solid #cbd5e1",
                      background:
                        knowledgeStatus === "VALIDATED" ? "#ecfdf5" : "#ffffff",
                      textAlign: "left",
                      cursor: "pointer",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "0.86rem",
                        fontWeight: 800,
                        color: "#065f46",
                        marginBottom: "0.2rem",
                      }}
                    >
                      ✓ Connaissance Validée (VALIDATED)
                    </div>
                    <div style={{ fontSize: "0.76rem", color: "#475569" }}>
                      Incident résolu et vérifié, utilisé en priorité par le moteur IA et les runbooks.
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setKnowledgeStatus("REFERENCE_SCENARIO")}
                    style={{
                      padding: "0.9rem 1.1rem",
                      borderRadius: "12px",
                      border:
                        knowledgeStatus === "REFERENCE_SCENARIO"
                          ? "2px solid #d97706"
                          : "1px solid #cbd5e1",
                      background:
                        knowledgeStatus === "REFERENCE_SCENARIO"
                          ? "#fffbeb"
                          : "#ffffff",
                      textAlign: "left",
                      cursor: "pointer",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "0.86rem",
                        fontWeight: 800,
                        color: "#92400e",
                        marginBottom: "0.2rem",
                      }}
                    >
                      📋 Scénario de Référence (REFERENCE_SCENARIO)
                    </div>
                    <div style={{ fontSize: "0.76rem", color: "#475569" }}>
                      Cas d&apos;école ou modèle théorique conservé pour la formation et l&apos;entraînement.
                    </div>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* ÉTAPE 2 : SYMPTÔMES & CONSTATS TERRAIN                         */}
          {/* ============================================================== */}
          {currentStep === 2 && (
            <div style={{ display: "flex", flexDirection: "column", gap: "1.35rem" }}>
              <div>
                <label style={labelStyle}>
                  Symptôme constaté sur le terrain <span style={{ color: "#dc2626" }}>*</span>
                </label>
                <p style={{ fontSize: "0.78rem", color: "#64748b", margin: "0 0 0.45rem 0" }}>
                  Décrivez le comportement visible côté client, GAB/TPE ou supervision (messages d&apos;erreur, étape du flux).
                </p>
                <textarea
                  rows={5}
                  value={symptom}
                  onChange={(e) => setSymptom(e.target.value)}
                  placeholder="Ex: Le client demande 100 000 XOF. L'ATM ne distribue aucun billet. Le compte est pourtant débité..."
                  style={{
                    ...inputStyle,
                    background: "#ffffff",
                    lineHeight: 1.55,
                    fontFamily: "inherit",
                  }}
                />
              </div>

              <div>
                <label style={labelStyle}>
                  Faits observés et mesurés <span style={{ color: "#dc2626" }}>*</span>
                </label>
                <p style={{ fontSize: "0.78rem", color: "#64748b", margin: "0 0 0.45rem 0" }}>
                  Éléments factuels et chiffrés : volumétrie d&apos;échecs, plage horaire précise, taux de rejet, codes retour.
                </p>
                <textarea
                  rows={4}
                  value={facts}
                  onChange={(e) => setFacts(e.target.value)}
                  placeholder="Ex: 42 transactions rejetées entre 11h15 et 11h40 avec code DE39=91 sur le frontal Payway..."
                  style={{ ...inputStyle, background: "#ffffff", lineHeight: 1.55 }}
                />
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                  gap: "1.1rem",
                }}
              >
                <div>
                  <label style={labelStyle}>Périmètre technique & géographique impacté</label>
                  <textarea
                    rows={3}
                    value={scope}
                    onChange={(e) => setScope(e.target.value)}
                    placeholder="Ex: Parc GAB agence centrale, porteurs VISA internationaux, filiale..."
                    style={{ ...inputStyle, background: "#ffffff", lineHeight: 1.5 }}
                  />
                </div>

                <div>
                  <label style={labelStyle}>Contexte opérationnel lors de l&apos;incident</label>
                  <textarea
                    rows={3}
                    value={context}
                    onChange={(e) => setContext(e.target.value)}
                    placeholder="Ex: Fin de mois, exécution batch EOD, post-mise en production..."
                    style={{ ...inputStyle, background: "#ffffff", lineHeight: 1.5 }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* ÉTAPE 3 : INVESTIGATION, HYPOTHÈSES & PREUVES                  */}
          {/* ============================================================== */}
          {currentStep === 3 && (
            <div style={{ display: "flex", flexDirection: "column", gap: "1.75rem" }}>
              {/* Sous-section Hypothèses */}
              <div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "0.85rem",
                    flexWrap: "wrap",
                    gap: "0.5rem",
                  }}
                >
                  <div>
                    <h4 style={{ fontSize: "0.96rem", fontWeight: 800, color: "#0f172a", margin: 0 }}>
                      1. Hypothèses d&apos;investigation évaluées
                    </h4>
                    <p style={{ fontSize: "0.78rem", color: "#64748b", margin: "0.15rem 0 0 0" }}>
                      Documentez les pistes écartées (REJECTED) et la piste confirmée (CONFIRMED).
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={addHypothesis}
                    style={{
                      padding: "0.45rem 0.85rem",
                      borderRadius: "8px",
                      border: "1px dashed #059669",
                      background: "#ecfdf5",
                      color: "#047857",
                      fontSize: "0.78rem",
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                  >
                    + Ajouter une hypothèse
                  </button>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
                  {hypotheses.map((hyp, idx) => {
                    const statusColors: Record<
                      HypothesisStatus,
                      { bg: string; border: string; text: string }
                    > = {
                      CONFIRMED: { bg: "#ecfdf5", border: "#6ee7b7", text: "#047857" },
                      PROBABLE: { bg: "#eff6ff", border: "#93c5fd", text: "#1d4ed8" },
                      OPEN: { bg: "#fffbeb", border: "#fcd34d", text: "#b45309" },
                      REJECTED: { bg: "#f8fafc", border: "#cbd5e1", text: "#64748b" },
                    };
                    const col = statusColors[hyp.status] || statusColors.OPEN;

                    return (
                      <div
                        key={idx}
                        style={{
                          padding: "1rem",
                          borderRadius: "12px",
                          border: `1px solid ${col.border}`,
                          background: col.bg,
                          display: "flex",
                          flexDirection: "column",
                          gap: "0.65rem",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            gap: "0.65rem",
                            alignItems: "center",
                            flexWrap: "wrap",
                          }}
                        >
                          <span
                            style={{
                              fontSize: "0.75rem",
                              fontWeight: 800,
                              color: col.text,
                              minWidth: "90px",
                            }}
                          >
                            Hypothèse #{idx + 1}
                          </span>

                          <input
                            type="text"
                            value={hyp.description}
                            onChange={(e) =>
                              updateHypothesis(idx, "description", e.target.value)
                            }
                            placeholder="Description de la piste technique..."
                            style={{
                              ...inputStyle,
                              flex: 1,
                              background: "#ffffff",
                              padding: "0.55rem 0.8rem",
                            }}
                          />

                          <select
                            value={hyp.status}
                            onChange={(e) =>
                              updateHypothesis(
                                idx,
                                "status",
                                e.target.value as HypothesisStatus
                              )
                            }
                            style={{
                              padding: "0.55rem 0.75rem",
                              borderRadius: "8px",
                              border: `1px solid ${col.border}`,
                              background: "#ffffff",
                              color: col.text,
                              fontWeight: 800,
                              fontSize: "0.78rem",
                            }}
                          >
                            <option value="CONFIRMED">✓ CONFIRMÉE</option>
                            <option value="PROBABLE">⚡ PROBABLE</option>
                            <option value="OPEN">⏳ OUVERTE</option>
                            <option value="REJECTED">✕ ÉCARTÉE</option>
                          </select>

                          {hypotheses.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeHypothesis(idx)}
                              title="Supprimer cette hypothèse"
                              style={{
                                background: "#ffffff",
                                border: "1px solid #fecaca",
                                color: "#dc2626",
                                borderRadius: "8px",
                                padding: "0.45rem 0.65rem",
                                cursor: "pointer",
                                fontSize: "0.78rem",
                                fontWeight: 700,
                              }}
                            >
                              🗑️
                            </button>
                          )}
                        </div>

                        <input
                          type="text"
                          value={hyp.evidence || ""}
                          onChange={(e) =>
                            updateHypothesis(idx, "evidence", e.target.value)
                          }
                          placeholder="Preuve ou constat justifiant le statut de cette hypothèse..."
                          style={{
                            ...inputStyle,
                            background: "#ffffff",
                            padding: "0.5rem 0.8rem",
                            fontSize: "0.82rem",
                          }}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Sous-section Preuves & Logs */}
              <div style={{ paddingTop: "1rem", borderTop: "1px solid #e2e8f0" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "0.85rem",
                    flexWrap: "wrap",
                    gap: "0.5rem",
                  }}
                >
                  <div>
                    <h4 style={{ fontSize: "0.96rem", fontWeight: 800, color: "#0f172a", margin: 0 }}>
                      2. Preuves techniques, Traces ISO 8583 & Logs
                    </h4>
                    <p style={{ fontSize: "0.78rem", color: "#64748b", margin: "0.15rem 0 0 0" }}>
                      Extraits de journaux EJ, trames ISO masquées ou logs système appuyant le diagnostic.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={addEvidence}
                    style={{
                      padding: "0.45rem 0.85rem",
                      borderRadius: "8px",
                      border: "1px dashed #0284c7",
                      background: "#f0f9ff",
                      color: "#0369a1",
                      fontSize: "0.78rem",
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                  >
                    + Ajouter une preuve / trace
                  </button>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
                  {evidenceList.map((ev, idx) => (
                    <div
                      key={idx}
                      style={{
                        padding: "1rem",
                        borderRadius: "12px",
                        border: "1px solid #e2e8f0",
                        background: "#f8fafc",
                        display: "flex",
                        flexDirection: "column",
                        gap: "0.65rem",
                      }}
                    >
                      <div style={{ display: "flex", gap: "0.65rem", flexWrap: "wrap" }}>
                        <select
                          value={ev.type}
                          onChange={(e) => updateEvidence(idx, "type", e.target.value)}
                          style={{
                            padding: "0.5rem 0.75rem",
                            borderRadius: "8px",
                            border: "1px solid #cbd5e1",
                            background: "#ffffff",
                            fontSize: "0.8rem",
                            fontWeight: 700,
                          }}
                        >
                          <option value="Log Applicatif">🖥️ Log Applicatif</option>
                          <option value="Capture Trame">💳 Capture Trame ISO 8583</option>
                          <option value="Journal EJ GAB">📟 Journal EJ GAB</option>
                          <option value="Log Base de Données">🗄️ Log Base de Données / CBS</option>
                          <option value="Trace Réseau TCP">🌐 Trace Réseau TCP</option>
                          <option value="Mail NOC">📩 Alerte / Mail NOC</option>
                        </select>

                        <input
                          type="text"
                          value={ev.source || ""}
                          onChange={(e) => updateEvidence(idx, "source", e.target.value)}
                          placeholder="Source (ex: Syslog Frontal Payway, Oracle Alert Log...)"
                          style={{
                            ...inputStyle,
                            flex: 1,
                            background: "#ffffff",
                            padding: "0.5rem 0.75rem",
                            fontSize: "0.82rem",
                          }}
                        />

                        {evidenceList.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeEvidence(idx)}
                            style={{
                              background: "#ffffff",
                              border: "1px solid #fecaca",
                              color: "#dc2626",
                              borderRadius: "8px",
                              padding: "0.45rem 0.65rem",
                              cursor: "pointer",
                              fontSize: "0.78rem",
                            }}
                          >
                            🗑️
                          </button>
                        )}
                      </div>

                      <textarea
                        rows={2}
                        value={ev.content}
                        onChange={(e) => updateEvidence(idx, "content", e.target.value)}
                        placeholder="Collez l'extrait de log ou la trame ISO (PAN masqué)..."
                        style={{
                          ...inputStyle,
                          background: "#0f172a",
                          color: "#e2e8f0",
                          fontFamily: "monospace",
                          fontSize: "0.82rem",
                          border: "1px solid #334155",
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* ÉTAPE 4 : CAUSE RACINE FORMELLE (RCA)                          */}
          {/* ============================================================== */}
          {currentStep === 4 && (
            <div style={{ display: "flex", flexDirection: "column", gap: "1.35rem" }}>
              <div
                style={{
                  padding: "0.9rem 1.15rem",
                  borderRadius: "12px",
                  background: "linear-gradient(135deg, #ecfdf5 0%, #f0fdf4 100%)",
                  border: "1px solid #a7f3d0",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: "0.5rem",
                }}
              >
                <div style={{ fontSize: "0.83rem", color: "#065f46", fontWeight: 700 }}>
                  🎯 La Cause Racine (RCA) documentée ici alimente directement le Diagnostic Assistant et le Post-Mortem PDF.
                </div>
                {incident.rootCause?.validatedBy && (
                  <span
                    style={{
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      color: "#047857",
                      background: "#ffffff",
                      padding: "0.25rem 0.65rem",
                      borderRadius: "6px",
                      border: "1px solid #a7f3d0",
                    }}
                  >
                    Validé par : {incident.rootCause.validatedBy}
                  </span>
                )}
              </div>

              <div>
                <label style={labelStyle}>
                  Catégorie de la cause racine <span style={{ color: "#dc2626" }}>*</span>
                </label>
                <input
                  type="text"
                  required
                  value={rootCauseCategory}
                  onChange={(e) => setRootCauseCategory(e.target.value)}
                  placeholder="Ex: Système & Infrastructure, Core Banking, HSM..."
                  style={{ ...inputStyle, background: "#ffffff", fontWeight: 600 }}
                />
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "0.4rem",
                    marginTop: "0.5rem",
                  }}
                >
                  {RCA_CATEGORY_SUGGESTIONS.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setRootCauseCategory(cat)}
                      style={{
                        padding: "0.25rem 0.6rem",
                        borderRadius: "6px",
                        fontSize: "0.73rem",
                        fontWeight: 600,
                        border:
                          rootCauseCategory === cat
                            ? "1px solid #059669"
                            : "1px solid #e2e8f0",
                        background:
                          rootCauseCategory === cat ? "#ecfdf5" : "#f8fafc",
                        color: rootCauseCategory === cat ? "#047857" : "#475569",
                        cursor: "pointer",
                      }}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label style={labelStyle}>
                  Description formelle de la cause racine <span style={{ color: "#dc2626" }}>*</span>
                </label>
                <p style={{ fontSize: "0.78rem", color: "#64748b", margin: "0 0 0.45rem 0" }}>
                  Expliquez précisément le mécanisme technique ayant provoqué la défaillance.
                </p>
                <textarea
                  rows={5}
                  required
                  value={rootCauseDescription}
                  onChange={(e) => setRootCauseDescription(e.target.value)}
                  placeholder="Détaillez la démonstration technique de la panne..."
                  style={{ ...inputStyle, background: "#ffffff", lineHeight: 1.55 }}
                />
              </div>

              <div>
                <label style={labelStyle}>Justification & Preuves de corrélation</label>
                <p style={{ fontSize: "0.78rem", color: "#64748b", margin: "0 0 0.45rem 0" }}>
                  Indiquez pourquoi cette cause est formellement retenue (concordance horodatée, reproduction, logs).
                </p>
                <textarea
                  rows={3}
                  value={rootCauseJustification}
                  onChange={(e) => setRootCauseJustification(e.target.value)}
                  placeholder="Concordance avec les traces ISO 8583 et logs horodatés..."
                  style={{ ...inputStyle, background: "#ffffff", lineHeight: 1.5 }}
                />
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* ÉTAPE 5 : RÉSOLUTION, PRÉVENTION & RÉCAPITULATIF               */}
          {/* ============================================================== */}
          {currentStep === 5 && (
            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              <div>
                <label style={labelStyle}>
                  Actions correctives déployées (Runbook de rétablissement){" "}
                  <span style={{ color: "#dc2626" }}>*</span>
                </label>
                <textarea
                  rows={4}
                  required
                  value={resolutionActions}
                  onChange={(e) => setResolutionActions(e.target.value)}
                  placeholder="Redémarrage de service, purge de session bloquante, bascule de lien, réalignement de clé..."
                  style={{ ...inputStyle, background: "#ffffff", lineHeight: 1.55 }}
                />
              </div>

              <div>
                <label style={labelStyle}>Résultat après contrôle post-action</label>
                <input
                  type="text"
                  value={resolutionResult}
                  onChange={(e) => setResolutionResult(e.target.value)}
                  placeholder="Ex: Reprise nominale des transactions à 100%, temps de réponse < 400ms."
                  style={{ ...inputStyle, background: "#ffffff" }}
                />
              </div>

              {/* Mesures préventives */}
              <div style={{ paddingTop: "0.75rem", borderTop: "1px solid #e2e8f0" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "0.75rem",
                    flexWrap: "wrap",
                    gap: "0.5rem",
                  }}
                >
                  <div>
                    <label style={{ ...labelStyle, marginBottom: 0 }}>
                      Mesures préventives pérennes (Anti-récurrence)
                    </label>
                    <p style={{ fontSize: "0.76rem", color: "#64748b", margin: "0.1rem 0 0 0" }}>
                      Actions de monitoring, d&apos;architecture ou de gouvernance pour éviter la répétition de l&apos;incident.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={addPrevention}
                    style={{
                      padding: "0.4rem 0.8rem",
                      borderRadius: "8px",
                      border: "1px dashed #059669",
                      background: "#ecfdf5",
                      color: "#047857",
                      fontSize: "0.76rem",
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                  >
                    + Ajouter une mesure préventive
                  </button>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "0.65rem" }}>
                  {preventionList.map((prev, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: "flex",
                        gap: "0.6rem",
                        alignItems: "center",
                        flexWrap: "wrap",
                        background: "#f8fafc",
                        padding: "0.75rem",
                        borderRadius: "10px",
                        border: "1px solid #e2e8f0",
                      }}
                    >
                      <input
                        type="text"
                        value={prev.action}
                        onChange={(e) => updatePrevention(idx, "action", e.target.value)}
                        placeholder="Action préventive..."
                        style={{
                          ...inputStyle,
                          flex: 2,
                          minWidth: "220px",
                          background: "#ffffff",
                          padding: "0.5rem 0.75rem",
                          fontSize: "0.83rem",
                        }}
                      />
                      <input
                        type="text"
                        value={prev.owner || ""}
                        onChange={(e) => updatePrevention(idx, "owner", e.target.value)}
                        placeholder="Responsable"
                        style={{
                          ...inputStyle,
                          flex: 1,
                          minWidth: "140px",
                          background: "#ffffff",
                          padding: "0.5rem 0.75rem",
                          fontSize: "0.82rem",
                        }}
                      />
                      <select
                        value={prev.priority || "HIGH"}
                        onChange={(e) => updatePrevention(idx, "priority", e.target.value)}
                        style={{
                          padding: "0.5rem 0.65rem",
                          borderRadius: "8px",
                          border: "1px solid #cbd5e1",
                          background: "#ffffff",
                          fontSize: "0.78rem",
                          fontWeight: 700,
                        }}
                      >
                        <option value="CRITICAL">P1 Critique</option>
                        <option value="HIGH">P2 Haute</option>
                        <option value="MEDIUM">P3 Moyenne</option>
                      </select>
                      {preventionList.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removePrevention(idx)}
                          style={{
                            background: "#ffffff",
                            border: "1px solid #fecaca",
                            color: "#dc2626",
                            borderRadius: "8px",
                            padding: "0.4rem 0.6rem",
                            cursor: "pointer",
                          }}
                        >
                          🗑️
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Carte de vérification finale avant validation */}
              <div
                style={{
                  background: "#f8fafc",
                  borderRadius: "14px",
                  border: "1px solid #cbd5e1",
                  padding: "1.25rem",
                }}
              >
                <div
                  style={{
                    fontSize: "0.84rem",
                    fontWeight: 800,
                    color: "#0f172a",
                    marginBottom: "0.75rem",
                  }}
                >
                  📋 Vérification rapide avant enregistrement final
                </div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                    gap: "0.65rem",
                  }}
                >
                  {EDIT_STEPS.map((st) => {
                    const ok = isStepComplete(st.id);
                    return (
                      <div
                        key={st.id}
                        onClick={() => setCurrentStep(st.id)}
                        style={{
                          padding: "0.65rem 0.85rem",
                          borderRadius: "10px",
                          background: "#ffffff",
                          border: ok ? "1px solid #a7f3d0" : "1px solid #fde68a",
                          cursor: "pointer",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "#1e293b" }}>
                          {st.icon} {st.shortTitle}
                        </span>
                        <span
                          style={{
                            fontSize: "0.72rem",
                            fontWeight: 800,
                            color: ok ? "#059669" : "#d97706",
                          }}
                        >
                          {ok ? "✓ OK" : "À vérifier"}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* BARRE DE NAVIGATION BASSE DU WIZARD */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: "2rem",
              paddingTop: "1.25rem",
              borderTop: "1px solid #e2e8f0",
              flexWrap: "wrap",
              gap: "0.75rem",
            }}
          >
            <button
              type="button"
              onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
              disabled={currentStep === 1}
              style={{
                padding: "0.75rem 1.25rem",
                borderRadius: "10px",
                border: "1px solid #cbd5e1",
                background: currentStep === 1 ? "#f8fafc" : "#ffffff",
                color: currentStep === 1 ? "#94a3b8" : "#334155",
                fontWeight: 700,
                fontSize: "0.86rem",
                cursor: currentStep === 1 ? "not-allowed" : "pointer",
              }}
            >
              ← Étape précédente
            </button>

            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              {currentStep < EDIT_STEPS.length ? (
                <>
                  <button
                    type="button"
                    disabled={loading}
                    onClick={() => handleSave(true)}
                    style={{
                      padding: "0.75rem 1.15rem",
                      borderRadius: "10px",
                      border: "1px solid #cbd5e1",
                      background: "#ffffff",
                      color: "#0f172a",
                      fontWeight: 700,
                      fontSize: "0.84rem",
                      cursor: loading ? "not-allowed" : "pointer",
                    }}
                  >
                    ✓ Enregistrer directement
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setCurrentStep((prev) => Math.min(EDIT_STEPS.length, prev + 1))
                    }
                    style={{
                      padding: "0.75rem 1.45rem",
                      borderRadius: "10px",
                      border: "none",
                      background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
                      color: "#ffffff",
                      fontWeight: 800,
                      fontSize: "0.86rem",
                      cursor: "pointer",
                      boxShadow: "0 4px 12px rgba(15, 23, 42, 0.18)",
                    }}
                  >
                    Étape suivante ({EDIT_STEPS[currentStep]?.shortTitle}) →
                  </button>
                </>
              ) : (
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    padding: "0.8rem 1.75rem",
                    borderRadius: "10px",
                    border: "none",
                    background: "linear-gradient(135deg, #059669 0%, #047857 100%)",
                    color: "#ffffff",
                    fontWeight: 800,
                    fontSize: "0.9rem",
                    cursor: loading ? "not-allowed" : "pointer",
                    boxShadow: "0 6px 16px rgba(5, 150, 105, 0.3)",
                  }}
                >
                  {loading
                    ? "Validation en cours..."
                    : "✓ Valider et Enregistrer l'Incident"}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* PANNEAU LATÉRAL DROIT : Aperçu Temps-Réel & Navigation Rapide */}
        <aside
          style={{
            background: "#ffffff",
            borderRadius: "16px",
            border: "1px solid #e2e8f0",
            padding: "1.35rem",
            position: "sticky",
            top: "1.25rem",
            display: "flex",
            flexDirection: "column",
            gap: "1.1rem",
            boxShadow: "0 4px 16px -6px rgba(15, 23, 42, 0.05)",
          }}
        >
          <div
            style={{
              paddingBottom: "0.85rem",
              borderBottom: "1px solid #f1f5f9",
            }}
          >
            <span
              style={{
                fontSize: "0.7rem",
                fontWeight: 800,
                color: "#059669",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
              }}
            >
              APERÇU EN TEMPS RÉEL
            </span>
            <h3
              style={{
                fontSize: "0.95rem",
                fontWeight: 800,
                color: "#0f172a",
                margin: "0.2rem 0 0 0",
                lineHeight: 1.35,
              }}
            >
              {title || "Incident sans titre"}
            </h3>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.65rem", fontSize: "0.8rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: "0.5rem" }}>
              <span style={{ color: "#64748b", fontWeight: 600 }}>Domaine :</span>
              <strong style={{ color: "#0f172a", textAlign: "right" }}>{domain || "—"}</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", gap: "0.5rem" }}>
              <span style={{ color: "#64748b", fontWeight: 600 }}>Composant :</span>
              <strong style={{ color: "#0f172a", textAlign: "right" }}>{component || "—"}</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", gap: "0.5rem" }}>
              <span style={{ color: "#64748b", fontWeight: 600 }}>Code clé :</span>
              <code
                style={{
                  background: "#f1f5f9",
                  padding: "0.1rem 0.45rem",
                  borderRadius: "4px",
                  fontWeight: 700,
                  color: "#047857",
                }}
              >
                {errorCode || "—"}
              </code>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", gap: "0.5rem" }}>
              <span style={{ color: "#64748b", fontWeight: 600 }}>Hypothèses :</span>
              <strong style={{ color: "#0f172a" }}>
                {hypotheses.filter((h) => h.description.trim()).length} piste(s)
              </strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", gap: "0.5rem" }}>
              <span style={{ color: "#64748b", fontWeight: 600 }}>Preuves / Logs :</span>
              <strong style={{ color: "#0f172a" }}>
                {evidenceList.filter((e) => e.content.trim()).length} extrait(s)
              </strong>
            </div>
          </div>

          <div
            style={{
              padding: "0.85rem",
              borderRadius: "10px",
              background: "#f8fafc",
              border: "1px solid #e2e8f0",
              fontSize: "0.78rem",
            }}
          >
            <div style={{ fontWeight: 800, color: "#334155", marginBottom: "0.3rem" }}>
              🎯 Cause Racine (RCA)
            </div>
            <div style={{ color: "#059669", fontWeight: 700, marginBottom: "0.2rem" }}>
              {rootCauseCategory || "Non catégorisée"}
            </div>
            <div
              style={{
                color: "#64748b",
                display: "-webkit-box",
                WebkitLineClamp: 3,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                lineHeight: 1.4,
              }}
            >
              {rootCauseDescription || "Aucune description RCA renseignée."}
            </div>
          </div>

          <div
            style={{
              padding: "0.85rem",
              borderRadius: "10px",
              background: "#f8fafc",
              border: "1px solid #e2e8f0",
              fontSize: "0.78rem",
            }}
          >
            <div style={{ fontWeight: 800, color: "#334155", marginBottom: "0.3rem" }}>
              🛡️ Action Corrective
            </div>
            <div
              style={{
                color: "#64748b",
                display: "-webkit-box",
                WebkitLineClamp: 3,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                lineHeight: 1.4,
              }}
            >
              {resolutionActions || "Aucune action corrective renseignée."}
            </div>
          </div>

          <div style={{ fontSize: "0.74rem", color: "#94a3b8", lineHeight: 1.4 }}>
            💡 Astuce : Vous pouvez cliquer directement sur n&apos;importe quelle étape ci-dessus et enregistrer à tout moment.
          </div>
        </aside>
      </div>
    </form>
  );
}
