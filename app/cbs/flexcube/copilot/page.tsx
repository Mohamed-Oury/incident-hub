// app/cbs/flexcube/copilot/page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { AppShell } from "@/modules/layout/AppShell";
import { FlexcubeNeedInput, FlexcubeFullPlan, FlexcubeModule, FlexcubeVersion } from "@/modules/cbs/flexcube/types";
import { generateFlexcubePlan, reviewFlexcubePlSql } from "@/modules/cbs/flexcube/engine/flexcube-copilot-engine";

interface DockerHealth {
  status: "checking" | "ok" | "down";
  llmProvider?: string;
  llmModel?: string;
}

interface AgentSession {
  name: string;
  version: number;
  decision: "EN_ATTENTE" | "ACCEPTEE" | "REFUSEE";
  summary?: string;
  subTasksCount?: number;
  rejectionHistory?: string[];
}

interface SavedProject {
  id: string;
  name: string;
  module: string;
  flexcubeVersion: string;
  input: FlexcubeNeedInput;
  plan: FlexcubeFullPlan;
  agentSessionName?: string;
  createdAt: string;
  updatedAt: string;
}

const PRESET_NEEDS: { label: string; icon: string; input: FlexcubeNeedInput }[] = [
  {
    label: "Virement de Fonds Inter-Comptes (FTTB + ACTB)",
    icon: "💸",
    input: {
      title: "Passation d un virement compte à compte avec contrôle de provision",
      functionalDescription: "Programme de débit du compte émetteur dans STTM_CUST_ACCOUNT et crédit du compte destinataire avec génération des écritures dans ACTB_DAILY_LOG et enregistrement dans FTTB_CONTRACT_MASTER.",
      module: "FT",
      targetUsers: "Gestionnaire Agence / Automate de Virements",
      knownBusinessRules: "Vérification solde disponible >= montant, comptes dans la même agence ou agence régionale, interdiction si compte frappé d opposition (AC_STAT_NO_DR = 'Y').",
      inputData: "Code agence, Compte débit, Compte crédit, Montant, Devise, Motif",
      specialConstraints: "Verrouillage avec NOWAIT pour éviter ORA-00054, pas de COMMIT intermédiaire dans le package Custom.",
      flexcubeVersion: "14.x",
      environmentType: "PLSQL_BACKEND"
    }
  },
  {
    label: "Blocage de Provision Monétique Switch (Hold ST/AC)",
    icon: "🏧",
    input: {
      title: "Réservation de solde temps réel lors d une autorisation GAB/TPE",
      functionalDescription: "Prise d une indisponibilité (Hold) sur STTM_CUST_ACCOUNT lors de la réception d un message ISO 8583 (0100/0200) depuis le Switch monétique via la Gateway.",
      module: "AC",
      targetUsers: "Passerelle Gateway Switch Monétique",
      knownBusinessRules: "Augmentation de ACY_BLOCK_BAL de la valeur autorisée. Si délai de 7 jours dépassé sans clearing, libération automatique du montant.",
      inputData: "Identifiant compte (BRANCH_CODE, CUST_AC_NO), Référence autorisation (STAN/RRN), Montant",
      specialConstraints: "Latence maximale 200ms pour tenir le SLA de la passerelle Gateway.",
      flexcubeVersion: "14.x",
      environmentType: "GATEWAY_INTERFACE"
    }
  },
  {
    label: "Contrôle d Équilibre Comptable de Clôture (AC/GL)",
    icon: "⚖️",
    input: {
      title: "Contrôle de balance journalière Débit/Crédit avant phase EOFI",
      functionalDescription: "Vérification en fin de journée que la somme des débits égale la somme des crédits sur ACTB_DAILY_LOG pour chaque devise avant consolidation dans GLTB_GL_BALANCES.",
      module: "GL",
      targetUsers: "Opérateur de Clôture / Batch Nocturne AEOD",
      knownBusinessRules: "Somme(LCY_AMOUNT) Débit = Somme(LCY_AMOUNT) Crédit pour chaque agence et devise. Tolérance d écart = 0.000.",
      inputData: "Code agence, Date de journée comptable",
      specialConstraints: "Exécution optimisée ensembliste avec BULK COLLECT pour traiter 500 000 écritures sans saturation PGA.",
      flexcubeVersion: "12.4",
      environmentType: "BATCH_AEOD"
    }
  },
  {
    label: "Échéancier Prélèvement Prêt Personnel (CLTB)",
    icon: "📅",
    input: {
      title: "Prélèvement automatique des mensualités de crédit échues",
      functionalDescription: "Parcours des échéances dans CLTB_ACCOUNT_SCHEDULES arrivées à terme et génération du débit automatique sur le compte courant de l emprunteur.",
      module: "CL",
      targetUsers: "Moteur de Prêt Batch Consumer Lending",
      knownBusinessRules: "Prélèvement prioritaire des intérêts puis du capital. Si provision insuffisante, passage en statut impayé et calcul des pénalités.",
      inputData: "Numéro de contrat prêt, Date d échéance",
      specialConstraints: "Traitement tolérant aux exceptions individuelles avec SAVE EXCEPTIONS.",
      flexcubeVersion: "14.x",
      environmentType: "PLSQL_BACKEND"
    }
  }
];

export default function FlexcubeCopilotPage() {
  const [activeTab, setActiveTab] = useState<"plan" | "plsql" | "sql" | "tests" | "delivery" | "audit">("plan");

  const [input, setInput] = useState<FlexcubeNeedInput>({
    title: PRESET_NEEDS[0].input.title,
    functionalDescription: PRESET_NEEDS[0].input.functionalDescription,
    module: PRESET_NEEDS[0].input.module,
    targetUsers: PRESET_NEEDS[0].input.targetUsers,
    knownBusinessRules: PRESET_NEEDS[0].input.knownBusinessRules,
    inputData: PRESET_NEEDS[0].input.inputData,
    specialConstraints: PRESET_NEEDS[0].input.specialConstraints,
    flexcubeVersion: PRESET_NEEDS[0].input.flexcubeVersion,
    environmentType: PRESET_NEEDS[0].input.environmentType,
  });

  const [plan, setPlan] = useState<FlexcubeFullPlan>(() => generateFlexcubePlan(PRESET_NEEDS[0].input));
  const [copiedCode, setCopiedCode] = useState(false);

  // État Agent IA Docker (:8080)
  const [dockerHealth, setDockerHealth] = useState<DockerHealth>({ status: "checking" });
  const [agentLoading, setAgentLoading] = useState<boolean>(false);
  const [agentStepMessage, setAgentStepMessage] = useState<string>("");
  const [agentError, setAgentError] = useState<string | null>(null);
  const [agentSession, setAgentSession] = useState<AgentSession | null>(null);

  // Modal de rejet Human-in-the-Loop
  const [showRejectModal, setShowRejectModal] = useState<boolean>(false);
  const [rejectReason, setRejectReason] = useState<string>("");
  const [isRejecting, setIsRejecting] = useState<boolean>(false);
  const [isValidating, setIsValidating] = useState<boolean>(false);
  const [isGeneratingCode, setIsGeneratingCode] = useState<boolean>(false);
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  // Gestion des projets persistés
  const [savedProjects, setSavedProjects] = useState<SavedProject[]>([]);
  const [showProjectsModal, setShowProjectsModal] = useState<boolean>(false);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  // Audit de code PL/SQL
  const [customPlsql, setCustomPlsql] = useState<string>(
    "CREATE OR REPLACE PROCEDURE PR_TRANSFER IS\nBEGIN\n  SELECT * FROM STTM_CUST_ACCOUNT FOR UPDATE;\n  COMMIT;\nEND;"
  );
  const [auditResult, setAuditResult] = useState(() => reviewFlexcubePlSql(customPlsql));

  // Vérification de la disponibilité de l'agent Docker (:8080)
  useEffect(() => {
    fetch("/api/cbs/agentic/health")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data && data.status === "ok") {
          setDockerHealth({
            status: "ok",
            llmProvider: data.llm_provider || "google",
            llmModel: data.llm_model || "gemini-2.5-flash",
          });
        } else {
          setDockerHealth({ status: "down" });
        }
      })
      .catch(() => setDockerHealth({ status: "down" }));
  }, []);

  // Chargement des projets enregistrés
  useEffect(() => {
    fetch("/api/cbs/flexcube/copilot")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data && data.projects && Array.isArray(data.projects)) {
          setSavedProjects(data.projects);
        }
      })
      .catch((e) => console.warn("Échec chargement projets FLEXCUBE:", e));
  }, []);

  // Déclenchement local immédiat (Moteur TypeScript autonome)
  const handleGenerateLocal = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const newPlan = generateFlexcubePlan(input);
    setPlan(newPlan);
    setActionFeedback("⚡ Plan technique & packages PL/SQL régénérés avec le moteur autonome !");
  };

  // Workflow Agent IA (Docker :8080)
  const handleRunAgenticWorkflow = async () => {
    if (!input.title || !input.functionalDescription) {
      setAgentError("Veuillez renseigner au moins le titre et la description fonctionnelle.");
      return;
    }

    setAgentLoading(true);
    setAgentError(null);
    setActionFeedback(null);
    setAgentStepMessage("1/2 — Construction du prompt système d ingénierie FLEXCUBE...");

    try {
      const payload = {
        title: input.title,
        functionalDescription: input.functionalDescription,
        module: input.module,
        targetUsers: input.targetUsers || "Opérateur ou automate bancaire",
        knownBusinessRules: input.knownBusinessRules || "Règles standard FCUBS",
        inputData: input.inputData ? input.inputData.split(",").map((s) => s.trim()) : ["Paramètres par défaut"],
        specialConstraints: input.specialConstraints || null,
        flexcubeVersion: input.flexcubeVersion || "14.x",
        environmentType: input.environmentType || "PLSQL_BACKEND",
      };

      const promptRes = await fetch("/api/cbs/agentic/flexcube/prompts/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!promptRes.ok) {
        throw new Error("Échec génération du prompt système FLEXCUBE par l agent.");
      }

      const promptData = await promptRes.json();
      const slugName = promptData.name;

      setAgentStepMessage(`2/2 — Décomposition et analyse par l Agent d Analyse LLM (${slugName})...`);

      const analysisRes = await fetch(`/api/cbs/agentic/flexcube/analyses/${slugName}`, {
        method: "POST",
      });

      if (!analysisRes.ok) {
        const err = await analysisRes.json().catch(() => ({}));
        throw new Error(err.detail || "Échec lors de l analyse par l agent IA.");
      }

      const analysisData = await analysisRes.json();
      const currentVer = analysisData.versions?.find((v: any) => v.version === analysisData.currentVersion);

      if (currentVer && currentVer.result) {
        setAgentSession({
          name: slugName,
          version: analysisData.currentVersion,
          decision: analysisData.decision,
          summary: currentVer.result.analysis?.summary,
          subTasksCount: currentVer.result.subTasks?.length,
          rejectionHistory: analysisData.history?.filter((h: any) => h.decision === "REFUSEE").map((h: any) => h.reason),
        });

        // Mise à jour des sous-tâches du plan avec celles de l agent
        if (currentVer.result.subTasks && currentVer.result.subTasks.length > 0) {
          const mappedTasks = currentVer.result.subTasks.map((t: any) => ({
            id: t.id,
            title: t.title,
            description: t.description || "",
            type: "PLSQL_PACKAGE" as const,
            priority: "HAUTE" as const,
            estimation: t.estimation || "1 jour",
            inputs: t.inputs || "",
            outputs: t.outputs || "",
            concernedObjects: t.concernedFiles || ["STTM_CUST_ACCOUNT"],
            dependencies: t.dependencies || [],
            acceptanceCriteria: t.acceptanceCriteria || [],
            status: "A_FAIRE" as const,
          }));
          setPlan((prev) => ({
            ...prev,
            subTasks: mappedTasks,
            analysis: {
              ...prev.analysis,
              summary: currentVer.result.analysis?.summary || prev.analysis.summary,
              businessObjective: currentVer.result.analysis?.businessObjective || prev.analysis.businessObjective,
            },
          }));
        }

        setActionFeedback("✨ Analyse produite avec succès par l Agent IA ! Vous pouvez valider ou refuser.");
      }
    } catch (err: any) {
      console.error("Erreur Agentic FLEXCUBE:", err);
      setAgentError(err.message || "Erreur de communication avec l agent Docker.");
      handleGenerateLocal();
    } finally {
      setAgentLoading(false);
      setAgentStepMessage("");
    }
  };

  // Validation humaine (Accept)
  const handleAcceptAnalysis = async () => {
    if (!agentSession) return;
    setIsValidating(true);
    setAgentError(null);
    try {
      const res = await fetch(`/api/cbs/agentic/flexcube/analyses/${agentSession.name}/accept`, {
        method: "POST",
      });
      if (!res.ok) {
        throw new Error("Échec lors de l acceptation de l analyse.");
      }
      setAgentSession((prev) => (prev ? { ...prev, decision: "ACCEPTEE" } : null));
      setActionFeedback("✅ Analyse validée par l humain ! Vous pouvez lancer l Agent de Code PL/SQL.");
    } catch (err: any) {
      setAgentError(err.message || "Erreur de validation.");
    } finally {
      setIsValidating(false);
    }
  };

  // Rejet motivé (Reject - Human-in-the-Loop)
  const handleRejectAnalysis = async () => {
    if (!agentSession || !rejectReason.trim()) return;
    setIsRejecting(true);
    setAgentError(null);
    try {
      const res = await fetch(`/api/cbs/agentic/flexcube/analyses/${agentSession.name}/reject`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason: rejectReason }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || "Échec lors du rejet de l analyse.");
      }
      const updated = await res.json();
      const currentVer = updated.versions?.find((v: any) => v.version === updated.currentVersion);

      setAgentSession({
        name: agentSession.name,
        version: updated.currentVersion,
        decision: updated.decision,
        summary: currentVer?.result?.analysis?.summary,
        subTasksCount: currentVer?.result?.subTasks?.length,
        rejectionHistory: updated.history?.filter((h: any) => h.decision === "REFUSEE").map((h: any) => h.reason),
      });

      if (currentVer && currentVer.result && currentVer.result.subTasks) {
        const mappedTasks = currentVer.result.subTasks.map((t: any) => ({
          id: t.id,
          title: t.title,
          description: t.description || "",
          type: "PLSQL_PACKAGE" as const,
          priority: "HAUTE" as const,
          estimation: t.estimation || "1 jour",
          inputs: t.inputs || "",
          outputs: t.outputs || "",
          concernedObjects: t.concernedFiles || ["STTM_CUST_ACCOUNT"],
          dependencies: t.dependencies || [],
          acceptanceCriteria: t.acceptanceCriteria || [],
          status: "A_FAIRE" as const,
        }));
        setPlan((prev) => ({
          ...prev,
          subTasks: mappedTasks,
          analysis: {
            ...prev.analysis,
            summary: currentVer.result.analysis?.summary || prev.analysis.summary,
          },
        }));
      }

      setShowRejectModal(false);
      setRejectReason("");
      setActionFeedback(`🔄 Nouvelle version v${updated.currentVersion} régénérée par l agent avec prise en compte du motif !`);
    } catch (err: any) {
      setAgentError(err.message || "Erreur lors du rejet de l analyse.");
    } finally {
      setIsRejecting(false);
    }
  };

  // Génération du code source PL/SQL par l Agent de Code
  const handleGenerateAgentCode = async () => {
    if (!agentSession) return;
    setIsGeneratingCode(true);
    setAgentError(null);
    try {
      const res = await fetch(`/api/cbs/agentic/flexcube/code/${agentSession.name}`, {
        method: "POST",
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || "Échec lors de la génération de code par l agent.");
      }
      const codeData = await res.json();
      setPlan((prev) => ({
        ...prev,
        plsqlProposal: {
          ...prev.plsqlProposal,
          packageName: codeData.packageName || prev.plsqlProposal.packageName,
          packageSpec: codeData.packageSpecification || prev.plsqlProposal.packageSpec,
          packageBody: codeData.packageBody || prev.plsqlProposal.packageBody,
        },
        sqlProposal: {
          ...prev.sqlProposal,
          sqlCode: codeData.ddlScript ? codeData.ddlScript : prev.sqlProposal.sqlCode,
          rollbackScript: codeData.rollbackScript || prev.sqlProposal.rollbackScript,
        },
        testCases: codeData.unitTestPlSql
          ? [
              {
                id: "TC-AGENT-01",
                category: "NOMINAL",
                title: "Validation Suite PL/SQL Agent Code",
                preconditions: "Compte configuré dans STTM_CUST_ACCOUNT",
                testSteps: ["Exécution du bloc PL/SQL de test", "Contrôle code retour"],
                expectedResult: "ST-SAVE-001 (Succès)",
                verificationQuery: codeData.unitTestPlSql,
                actualStatus: "A_TESTER",
              },
              ...prev.testCases,
            ]
          : prev.testCases,
      }));
      setActiveTab("plsql");
      setActionFeedback("🚀 Package PL/SQL _CUSTOM et scripts DDL générés avec succès par l Agent de Code !");
    } catch (err: any) {
      setAgentError(err.message || "Erreur lors de la génération de code par l agent.");
    } finally {
      setIsGeneratingCode(false);
    }
  };

  // Sauvegarde du projet dans l API de persistance
  const handleSaveProject = async () => {
    try {
      setSaveStatus("Sauvegarde en cours...");
      const res = await fetch("/api/cbs/flexcube/copilot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          project: {
            name: input.title,
            module: input.module,
            flexcubeVersion: input.flexcubeVersion,
            input,
            plan,
            agentSessionName: agentSession?.name,
          },
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setSaveStatus("✅ Projet sauvegardé avec succès !");
        setSavedProjects((prev) => [data.project, ...prev.filter((p) => p.id !== data.project.id)]);
        setTimeout(() => setSaveStatus(null), 3500);
      } else {
        setSaveStatus("❌ Échec de la sauvegarde.");
      }
    } catch (e) {
      setSaveStatus("❌ Erreur réseau lors de la sauvegarde.");
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const isAuditPassed = auditResult.score >= 70;

  return (
    <AppShell pageTitle="Oracle FLEXCUBE Copilot & Agents IA" eyebrow="BUILD & EXTENSIBILITÉ FCUBS">
      <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        
        {/* En-tête avec statut Agent Docker et bascule Multi-CBS */}
        <div
          style={{
            background: "linear-gradient(135deg, #1e1e38 0%, #0f172a 100%)",
            border: "1px solid rgba(234, 88, 12, 0.3)",
            borderRadius: "var(--radius-lg)",
            padding: "1.25rem 1.75rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "1rem",
            boxShadow: "0 8px 24px rgba(234, 88, 12, 0.15)",
          }}
        >
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.35rem" }}>
              <span
                style={{
                  background: "#ea580c",
                  color: "#ffffff",
                  fontSize: "0.72rem",
                  fontWeight: 800,
                  padding: "2px 8px",
                  borderRadius: "6px",
                  letterSpacing: "0.05em",
                }}
              >
                STUDIO AGENTIQUE FLEXCUBE
              </span>
              <span style={{ color: "#fdba74", fontSize: "0.8rem", fontWeight: 600 }}>
                ⚡ Packages PL/SQL • Concurrence NOWAIT • Extensibilité Radpack
              </span>
            </div>
            <h2 style={{ fontSize: "1.35rem", fontWeight: 800, margin: 0, color: "#ffffff" }}>
              Assistant &amp; Pipeline Agentique Oracle FLEXCUBE
            </h2>
            <p style={{ fontSize: "0.85rem", color: "#cbd5e1", margin: "0.35rem 0 0 0" }}>
              Transformez vos spécifications bancaires en packages PL/SQL durcis <code>_CUSTOM</code>, scripts DDL et tests unitaires automatisés.
            </p>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
            {/* Widget Statut Docker Agent */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                background: "rgba(0,0,0,0.4)",
                padding: "6px 12px",
                borderRadius: "8px",
                border: "1px solid rgba(255,255,255,0.1)",
                fontSize: "0.78rem",
              }}
            >
              <span
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  background: dockerHealth.status === "ok" ? "#10b981" : dockerHealth.status === "checking" ? "#f59e0b" : "#ef4444",
                }}
              />
              <span style={{ color: "#e2e8f0", fontWeight: 600 }}>
                Agent IA Docker (:8080) :
              </span>
              <span style={{ color: dockerHealth.status === "ok" ? "#34d399" : "#f87171", fontWeight: 700 }}>
                {dockerHealth.status === "ok" ? `Actif (${dockerHealth.llmModel})` : dockerHealth.status === "checking" ? "Vérification..." : "Autonome / Local"}
              </span>
            </div>

            <button
              type="button"
              onClick={() => setShowProjectsModal(true)}
              style={{
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.2)",
                color: "#ffffff",
                padding: "0.5rem 0.9rem",
                borderRadius: "8px",
                fontSize: "0.82rem",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              📂 Projets ({savedProjects.length})
            </button>

            <Link
              href="/cbs/copilot"
              style={{
                background: "rgba(2, 132, 199, 0.15)",
                border: "1px solid #0284c7",
                color: "#38bdf8",
                textDecoration: "none",
                padding: "0.5rem 0.9rem",
                borderRadius: "8px",
                fontSize: "0.82rem",
                fontWeight: 600,
              }}
            >
              ↩ Studio Amplitude 4GL
            </Link>
          </div>
        </div>

        {/* Feedback / Notifications */}
        {actionFeedback && (
          <div
            style={{
              background: "rgba(16, 185, 129, 0.15)",
              border: "1px solid #10b981",
              color: "#34d399",
              padding: "0.75rem 1rem",
              borderRadius: "8px",
              fontSize: "0.85rem",
              fontWeight: 600,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span>{actionFeedback}</span>
            <button
              onClick={() => setActionFeedback(null)}
              style={{ background: "transparent", border: "none", color: "#34d399", cursor: "pointer", fontSize: "1rem" }}
            >
              ✕
            </button>
          </div>
        )}

        {agentError && (
          <div
            style={{
              background: "rgba(239, 68, 68, 0.15)",
              border: "1px solid #ef4444",
              color: "#f87171",
              padding: "0.75rem 1rem",
              borderRadius: "8px",
              fontSize: "0.85rem",
              fontWeight: 600,
            }}
          >
            ⚠️ {agentError}
          </div>
        )}

        {/* Barre d état Session Agent IA & Human-in-the-Loop */}
        {agentSession && (
          <div
            style={{
              background: "rgba(30, 41, 59, 0.85)",
              border: "1px solid rgba(56, 189, 248, 0.3)",
              borderRadius: "var(--radius-md)",
              padding: "1rem 1.25rem",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "1rem",
            }}
          >
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <span style={{ fontSize: "1.1rem" }}>🤖</span>
                <span style={{ fontWeight: 700, color: "#f8fafc", fontSize: "0.9rem" }}>
                  Session Agent IA : {agentSession.name} (v{agentSession.version})
                </span>
                <span
                  style={{
                    background: agentSession.decision === "ACCEPTEE" ? "rgba(16, 185, 129, 0.2)" : "rgba(245, 158, 11, 0.2)",
                    color: agentSession.decision === "ACCEPTEE" ? "#34d399" : "#fbbf24",
                    border: `1px solid ${agentSession.decision === "ACCEPTEE" ? "#10b981" : "#f59e0b"}`,
                    fontSize: "0.7rem",
                    fontWeight: 800,
                    padding: "2px 8px",
                    borderRadius: "12px",
                  }}
                >
                  {agentSession.decision === "ACCEPTEE" ? "VALIDÉE PAR L HUMAIN" : "EN ATTENTE DE VALIDATION"}
                </span>
              </div>
              <p style={{ margin: "4px 0 0 0", fontSize: "0.8rem", color: "#94a3b8" }}>
                {agentSession.summary || "Analyse en cours de traitement par l agent LLM."}
              </p>
            </div>

            <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
              {agentSession.decision !== "ACCEPTEE" ? (
                <>
                  <button
                    type="button"
                    onClick={handleAcceptAnalysis}
                    disabled={isValidating}
                    style={{
                      background: "#10b981",
                      color: "#ffffff",
                      border: "none",
                      padding: "0.45rem 0.9rem",
                      borderRadius: "6px",
                      fontSize: "0.82rem",
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                  >
                    {isValidating ? "Validation..." : "✓ Valider l Analyse"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowRejectModal(true)}
                    style={{
                      background: "rgba(239, 68, 68, 0.2)",
                      color: "#f87171",
                      border: "1px solid #ef4444",
                      padding: "0.45rem 0.9rem",
                      borderRadius: "6px",
                      fontSize: "0.82rem",
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                  >
                    ✕ Refuser avec motif
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={handleGenerateAgentCode}
                  disabled={isGeneratingCode}
                  style={{
                    background: "linear-gradient(135deg, #ea580c 0%, #f97316 100%)",
                    color: "#ffffff",
                    border: "none",
                    padding: "0.5rem 1.1rem",
                    borderRadius: "6px",
                    fontSize: "0.85rem",
                    fontWeight: 700,
                    cursor: "pointer",
                    boxShadow: "0 2px 8px rgba(234, 88, 12, 0.4)",
                  }}
                >
                  {isGeneratingCode ? "Génération PL/SQL..." : "🚀 Générer le Code PL/SQL (Agent Code)"}
                </button>
              )}
            </div>
          </div>
        )}

        {/* Modal Human-in-the-Loop : Rejet motivé */}
        {showRejectModal && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.75)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1000,
              padding: "1rem",
            }}
          >
            <div
              style={{
                background: "#0f172a",
                border: "1px solid #ef4444",
                borderRadius: "var(--radius-lg)",
                padding: "1.5rem",
                maxWidth: "540px",
                width: "100%",
                boxShadow: "0 20px 40px rgba(0,0,0,0.5)",
              }}
            >
              <h3 style={{ margin: "0 0 0.5rem 0", color: "#f8fafc", fontSize: "1.15rem" }}>
                Refus motivé de l analyse (Human-in-the-Loop)
              </h3>
              <p style={{ fontSize: "0.85rem", color: "#94a3b8", margin: "0 0 1rem 0" }}>
                Indiquez à l Agent d Analyse ce qui doit être corrigé ou enrichi (ex: tables manquantes, verrous NOWAIT, tests unitaires). L agent produira une nouvelle version conforme.
              </p>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                rows={4}
                placeholder="Ex: Il manque une sous-tâche pour la vérification du plafond journalier dans STTM_CUST_ACCOUNT..."
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  background: "#1e293b",
                  border: "1px solid var(--border-light)",
                  borderRadius: "6px",
                  color: "#ffffff",
                  fontSize: "0.85rem",
                  marginBottom: "1rem",
                }}
              />
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem" }}>
                <button
                  type="button"
                  onClick={() => setShowRejectModal(false)}
                  style={{
                    background: "transparent",
                    border: "1px solid var(--border-light)",
                    color: "#cbd5e1",
                    padding: "0.45rem 0.9rem",
                    borderRadius: "6px",
                    cursor: "pointer",
                  }}
                >
                  Annuler
                </button>
                <button
                  type="button"
                  onClick={handleRejectAnalysis}
                  disabled={isRejecting || rejectReason.trim().length < 10}
                  style={{
                    background: "#ef4444",
                    color: "#ffffff",
                    border: "none",
                    padding: "0.45rem 1rem",
                    borderRadius: "6px",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  {isRejecting ? "Régénération par l agent..." : "Soumettre à l Agent IA →"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal des projets sauvegardés */}
        {showProjectsModal && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.75)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1000,
              padding: "1rem",
            }}
          >
            <div
              style={{
                background: "#0f172a",
                border: "1px solid rgba(255,255,255,0.15)",
                borderRadius: "var(--radius-lg)",
                padding: "1.5rem",
                maxWidth: "640px",
                width: "100%",
                maxHeight: "80vh",
                overflowY: "auto",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                <h3 style={{ margin: 0, color: "#ffffff", fontSize: "1.15rem" }}>
                  Projets Oracle FLEXCUBE Enregistrés
                </h3>
                <button
                  onClick={() => setShowProjectsModal(false)}
                  style={{ background: "transparent", border: "none", color: "#94a3b8", cursor: "pointer", fontSize: "1.2rem" }}
                >
                  ✕
                </button>
              </div>

              {savedProjects.length === 0 ? (
                <p style={{ color: "#94a3b8", fontSize: "0.9rem" }}>Aucun projet FLEXCUBE sauvegardé pour l instant.</p>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                  {savedProjects.map((p) => (
                    <div
                      key={p.id}
                      style={{
                        background: "#1e293b",
                        border: "1px solid rgba(255,255,255,0.08)",
                        borderRadius: "8px",
                        padding: "0.9rem 1.1rem",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                          <span style={{ fontSize: "0.72rem", padding: "2px 6px", background: "#ea580c", color: "#fff", borderRadius: "4px", fontWeight: 700 }}>
                            {p.module || "FT"}
                          </span>
                          <h4 style={{ margin: 0, fontSize: "0.95rem", color: "#f8fafc" }}>{p.name}</h4>
                        </div>
                        <span style={{ fontSize: "0.75rem", color: "#94a3b8" }}>
                          FCUBS {p.flexcubeVersion} • {new Date(p.updatedAt).toLocaleDateString()}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setInput(p.input);
                          setPlan(p.plan);
                          setShowProjectsModal(false);
                          setActionFeedback(`Projet « ${p.name} » chargé avec succès !`);
                        }}
                        style={{
                          background: "#0284c7",
                          color: "#ffffff",
                          border: "none",
                          padding: "0.4rem 0.8rem",
                          borderRadius: "6px",
                          fontSize: "0.8rem",
                          fontWeight: 600,
                          cursor: "pointer",
                        }}
                      >
                        Charger
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Grille principale : Formulaire & Sortie */}
        <div style={{ display: "grid", gridTemplateColumns: "minmax(320px, 420px) 1fr", gap: "1.5rem", alignItems: "start" }}>
          
          {/* Colonne Gauche : Formulaire de Spécification */}
          <div className="card" style={{ padding: "1.25rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ margin: 0, fontSize: "1.05rem", fontWeight: 700, color: "var(--text-primary)" }}>
                Spécification du Besoin
              </h3>
              <span style={{ fontSize: "0.75rem", color: "#fb923c", fontWeight: 600 }}>Préréglages bancaires :</span>
            </div>

            {/* Sélecteur de Préréglages */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
              {PRESET_NEEDS.map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => {
                    setInput(preset.input);
                    handleGenerateLocal();
                  }}
                  style={{
                    background: input.title === preset.input.title ? "rgba(234, 88, 12, 0.2)" : "rgba(255,255,255,0.04)",
                    border: `1px solid ${input.title === preset.input.title ? "#ea580c" : "var(--border-light)"}`,
                    color: input.title === preset.input.title ? "#fb923c" : "var(--text-secondary)",
                    padding: "0.5rem",
                    borderRadius: "6px",
                    fontSize: "0.72rem",
                    fontWeight: 600,
                    textAlign: "left",
                    cursor: "pointer",
                    lineHeight: "1.25",
                  }}
                >
                  <span style={{ marginRight: "4px" }}>{preset.icon}</span>
                  {preset.label.split("(")[0]}
                </button>
              ))}
            </div>

            <form onSubmit={(e) => { e.preventDefault(); handleGenerateLocal(); }} style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, color: "var(--text-muted)", marginBottom: "4px" }}>
                  Titre du Besoin / User Story
                </label>
                <input
                  type="text"
                  value={input.title}
                  onChange={(e) => setInput({ ...input, title: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "0.55rem 0.75rem",
                    borderRadius: "6px",
                    background: "var(--bg-secondary)",
                    border: "1px solid var(--border-light)",
                    color: "var(--text-primary)",
                    fontSize: "0.85rem",
                  }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, color: "var(--text-muted)", marginBottom: "4px" }}>
                    Module FCUBS
                  </label>
                  <select
                    value={input.module}
                    onChange={(e) => setInput({ ...input, module: e.target.value as FlexcubeModule })}
                    style={{
                      width: "100%",
                      padding: "0.55rem",
                      borderRadius: "6px",
                      background: "var(--bg-secondary)",
                      border: "1px solid var(--border-light)",
                      color: "var(--text-primary)",
                      fontSize: "0.82rem",
                    }}
                  >
                    <option value="FT">FT - Funds Transfer</option>
                    <option value="AC">AC - Accounts &amp; Balances</option>
                    <option value="GL">GL - General Ledger</option>
                    <option value="CL">CL - Consumer Lending</option>
                    <option value="ST">ST - Core Customer</option>
                    <option value="LC">LC - Letters of Credit</option>
                    <option value="DE">DE - Data Entry</option>
                    <option value="GW">GW - Gateway Interface</option>
                    <option value="AEOD">AEOD - Batch Engine</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, color: "var(--text-muted)", marginBottom: "4px" }}>
                    Version FLEXCUBE
                  </label>
                  <select
                    value={input.flexcubeVersion}
                    onChange={(e) => setInput({ ...input, flexcubeVersion: e.target.value as FlexcubeVersion })}
                    style={{
                      width: "100%",
                      padding: "0.55rem",
                      borderRadius: "6px",
                      background: "var(--bg-secondary)",
                      border: "1px solid var(--border-light)",
                      color: "var(--text-primary)",
                      fontSize: "0.82rem",
                    }}
                  >
                    <option value="14.x">FLEXCUBE 14.x</option>
                    <option value="12.4">FLEXCUBE 12.4</option>
                    <option value="UNCONFIRMED">Non confirmé</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, color: "var(--text-muted)", marginBottom: "4px" }}>
                  Description Fonctionnelle
                </label>
                <textarea
                  rows={3}
                  value={input.functionalDescription}
                  onChange={(e) => setInput({ ...input, functionalDescription: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "0.55rem 0.75rem",
                    borderRadius: "6px",
                    background: "var(--bg-secondary)",
                    border: "1px solid var(--border-light)",
                    color: "var(--text-primary)",
                    fontSize: "0.82rem",
                  }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, color: "var(--text-muted)", marginBottom: "4px" }}>
                  Règles Métier &amp; Tables
                </label>
                <textarea
                  rows={2}
                  value={input.knownBusinessRules}
                  onChange={(e) => setInput({ ...input, knownBusinessRules: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "0.55rem 0.75rem",
                    borderRadius: "6px",
                    background: "var(--bg-secondary)",
                    border: "1px solid var(--border-light)",
                    color: "var(--text-primary)",
                    fontSize: "0.82rem",
                  }}
                />
              </div>

              {/* Boutons d actions : Workflow Agentique vs Mode Autonome */}
              <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem", marginTop: "0.5rem" }}>
                {dockerHealth.status === "ok" ? (
                  <button
                    type="button"
                    onClick={handleRunAgenticWorkflow}
                    disabled={agentLoading}
                    style={{
                      background: "linear-gradient(135deg, #ea580c 0%, #c2410c 100%)",
                      color: "#ffffff",
                      border: "none",
                      padding: "0.75rem",
                      borderRadius: "8px",
                      fontSize: "0.9rem",
                      fontWeight: 800,
                      cursor: "pointer",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      gap: "0.5rem",
                      boxShadow: "0 4px 12px rgba(234, 88, 12, 0.3)",
                    }}
                  >
                    <span>🤖</span>
                    <span>{agentLoading ? agentStepMessage : "Lancer le Workflow Agent IA (Docker :8080)"}</span>
                  </button>
                ) : null}

                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <button
                    type="submit"
                    style={{
                      flex: 1,
                      background: dockerHealth.status === "ok" ? "rgba(255,255,255,0.06)" : "linear-gradient(135deg, #0284c7 0%, #0369a1 100%)",
                      color: "#ffffff",
                      border: dockerHealth.status === "ok" ? "1px solid var(--border-light)" : "none",
                      padding: "0.65rem",
                      borderRadius: "8px",
                      fontSize: "0.82rem",
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                  >
                    ⚡ {dockerHealth.status === "ok" ? "Moteur Local (Rapide)" : "Générer le Plan (Autonome)"}
                  </button>

                  <button
                    type="button"
                    onClick={handleSaveProject}
                    style={{
                      background: "rgba(16, 185, 129, 0.15)",
                      border: "1px solid #10b981",
                      color: "#34d399",
                      padding: "0.65rem 0.9rem",
                      borderRadius: "8px",
                      fontSize: "0.82rem",
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                  >
                    💾 Sauvegarder
                  </button>
                </div>
                {saveStatus && <span style={{ fontSize: "0.75rem", color: "#34d399", textAlign: "center" }}>{saveStatus}</span>}
              </div>
            </form>
          </div>

          {/* Colonne Droite : Visualiseur & Résultats */}
          <div className="card" style={{ padding: "1.25rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
            {/* Onglets de Navigation */}
            <div style={{ display: "flex", gap: "0.4rem", borderBottom: "1px solid var(--border-light)", paddingBottom: "0.75rem", overflowX: "auto" }}>
              {[
                { key: "plan", label: "Plan & Tâches", icon: "📋" },
                { key: "plsql", label: "Package PL/SQL", icon: "⚡" },
                { key: "sql", label: "DDL & Requêtes", icon: "🗄️" },
                { key: "tests", label: "Tests Unitaires", icon: "🧪" },
                { key: "delivery", label: "Déploiement & Rollback", icon: "📦" },
                { key: "audit", label: "Audit PL/SQL", icon: "🔍" },
              ].map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActiveTab(tab.key as any)}
                  style={{
                    background: activeTab === tab.key ? "rgba(234, 88, 12, 0.15)" : "transparent",
                    color: activeTab === tab.key ? "#ea580c" : "var(--text-muted)",
                    border: `1px solid ${activeTab === tab.key ? "#ea580c" : "transparent"}`,
                    padding: "0.45rem 0.85rem",
                    borderRadius: "6px",
                    fontSize: "0.82rem",
                    fontWeight: activeTab === tab.key ? 700 : 500,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.35rem",
                    whiteSpace: "nowrap",
                  }}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            {/* TAB 1: Plan & Tâches Ordonnées */}
            {activeTab === "plan" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div style={{ background: "rgba(15, 23, 42, 0.6)", padding: "1rem", borderRadius: "8px", border: "1px solid var(--border-light)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                    <span style={{ fontSize: "0.75rem", color: "#fb923c", fontWeight: 700, textTransform: "uppercase" }}>
                      RÉSUMÉ ARCHITECTURE &amp; RISQUES ACID
                    </span>
                    <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Module {plan.need.module}</span>
                  </div>
                  <p style={{ fontSize: "0.88rem", color: "#cbd5e1", margin: "0 0 0.5rem 0", lineHeight: "1.5" }}>
                    {plan.analysis.summary}
                  </p>
                  <div style={{ fontSize: "0.8rem", color: "#94a3b8" }}>
                    <strong>Objectif Bancaire :</strong> {plan.analysis.businessObjective}
                  </div>
                </div>

                <h4 style={{ margin: 0, fontSize: "0.95rem", color: "var(--text-primary)", fontWeight: 700 }}>
                  Sous-Tâches Découpées ({plan.subTasks.length})
                </h4>

                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                  {plan.subTasks.map((task) => (
                    <div
                      key={task.id}
                      style={{
                        background: "var(--bg-secondary)",
                        border: "1px solid var(--border-light)",
                        borderRadius: "8px",
                        padding: "0.85rem 1rem",
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.35rem" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                          <span style={{ fontWeight: 800, fontSize: "0.8rem", color: "#ea580c" }}>{task.id}</span>
                          <span style={{ fontWeight: 700, fontSize: "0.88rem", color: "var(--text-primary)" }}>{task.title}</span>
                        </div>
                        <span style={{ fontSize: "0.72rem", padding: "2px 6px", background: "rgba(255,255,255,0.06)", borderRadius: "4px", color: "#94a3b8" }}>
                          {task.estimation}
                        </span>
                      </div>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", marginTop: "0.4rem" }}>
                        {task.concernedObjects.map((tbl) => (
                          <span key={tbl} style={{ fontSize: "0.7rem", padding: "1px 6px", background: "rgba(2, 132, 199, 0.15)", color: "#38bdf8", borderRadius: "4px" }}>
                            {tbl}
                          </span>
                        ))}
                      </div>
                      <div style={{ marginTop: "0.5rem", fontSize: "0.78rem", color: "var(--text-muted)" }}>
                        <strong>Critères :</strong> {task.acceptanceCriteria.join(" • ")}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 2: Package PL/SQL _CUSTOM */}
            {activeTab === "plsql" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>
                    Package Spécification &amp; Body conforme aux règles Oracle FLEXCUBE ({plan.plsqlProposal.packageName})
                  </span>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(plan.plsqlProposal.packageSpec + "\n/\n\n" + plan.plsqlProposal.packageBody)}
                    style={{
                      background: "rgba(255,255,255,0.08)",
                      border: "1px solid var(--border-light)",
                      color: "#ffffff",
                      padding: "4px 10px",
                      borderRadius: "6px",
                      fontSize: "0.78rem",
                      cursor: "pointer",
                    }}
                  >
                    {copiedCode ? "Copié !" : "📋 Copier Package"}
                  </button>
                </div>

                <div style={{ background: "#0f172a", borderRadius: "8px", padding: "1rem", overflowX: "auto" }}>
                  <pre style={{ margin: 0, fontFamily: "monospace", fontSize: "0.82rem", color: "#e2e8f0", lineHeight: "1.5" }}>
                    {plan.plsqlProposal.packageSpec}
                    {"\n/\n\n"}
                    {plan.plsqlProposal.packageBody}
                  </pre>
                </div>
              </div>
            )}

            {/* TAB 3: DDL & Requêtes SQL */}
            {activeTab === "sql" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <h4 style={{ margin: 0, fontSize: "0.95rem", color: "var(--text-primary)" }}>
                  Scripts DDL &amp; Requêtes SGBD Optimisées ({plan.sqlProposal.targetTables.join(", ")})
                </h4>
                <div style={{ background: "#0f172a", borderRadius: "8px", padding: "1rem", overflowX: "auto" }}>
                  <pre style={{ margin: 0, fontFamily: "monospace", fontSize: "0.82rem", color: "#38bdf8" }}>
                    {plan.sqlProposal.sqlCode}
                  </pre>
                </div>
              </div>
            )}

            {/* TAB 4: Tests Unitaires PL/SQL */}
            {activeTab === "tests" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <h4 style={{ margin: 0, fontSize: "0.95rem", color: "var(--text-primary)" }}>
                  Scénarios de Validation &amp; Assertions ({plan.testCases.length})
                </h4>
                {plan.testCases.map((t) => (
                  <div key={t.id} style={{ background: "var(--bg-secondary)", borderRadius: "8px", padding: "1rem", border: "1px solid var(--border-light)" }}>
                    <div style={{ fontWeight: 700, fontSize: "0.9rem", color: "#34d399", marginBottom: "0.25rem" }}>
                      [{t.id}] {t.title} ({t.category})
                    </div>
                    <p style={{ margin: "0 0 0.5rem 0", fontSize: "0.82rem", color: "var(--text-secondary)" }}>
                      Précondition: {t.preconditions} • Résultat attendu : <code>{t.expectedResult}</code>
                    </p>
                    {t.verificationQuery && (
                      <div style={{ background: "#0f172a", padding: "0.75rem", borderRadius: "6px", overflowX: "auto" }}>
                        <pre style={{ margin: 0, fontFamily: "monospace", fontSize: "0.8rem", color: "#e2e8f0" }}>
                          {t.verificationQuery}
                        </pre>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* TAB 5: Déploiement & Rollback */}
            {activeTab === "delivery" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div style={{ background: "rgba(239, 68, 68, 0.08)", border: "1px solid rgba(239, 68, 68, 0.3)", padding: "1rem", borderRadius: "8px" }}>
                  <h4 style={{ margin: "0 0 0.5rem 0", fontSize: "0.95rem", color: "#f87171" }}>
                    Procédure de Retour Arrière (Rollback Plan)
                  </h4>
                  <div style={{ background: "#0f172a", padding: "0.75rem", borderRadius: "6px", overflowX: "auto" }}>
                    <pre style={{ margin: 0, fontFamily: "monospace", fontSize: "0.8rem", color: "#fca5a5" }}>
                      {plan.sqlProposal.rollbackScript || plan.deliveryPackage.rollbackPlan.join("\n")}
                    </pre>
                  </div>
                </div>

                <div style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-light)", padding: "1rem", borderRadius: "8px" }}>
                  <h4 style={{ margin: "0 0 0.5rem 0", fontSize: "0.95rem", color: "var(--text-primary)" }}>
                    Ordre de Déploiement SQL*Plus / Liquibase
                  </h4>
                  <ol style={{ margin: 0, paddingLeft: "1.25rem", fontSize: "0.82rem", color: "var(--text-secondary)", lineHeight: "1.6" }}>
                    {plan.deliveryPackage.deploymentOrder.map((inst, i) => (
                      <li key={i}>{inst}</li>
                    ))}
                  </ol>
                </div>
              </div>
            )}

            {/* TAB 6: Audit de Code PL/SQL */}
            {activeTab === "audit" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <h4 style={{ margin: 0, fontSize: "0.95rem", color: "var(--text-primary)" }}>
                  Analyseur de Conformité PL/SQL &amp; Anti-Patterns
                </h4>
                <p style={{ margin: 0, fontSize: "0.82rem", color: "var(--text-secondary)" }}>
                  Collez un script ou une procédure pour auditer la conformité aux règles Oracle FLEXCUBE (pas de COMMIT direct, utilisation de NOWAIT, capture ORA-00054).
                </p>
                <textarea
                  rows={4}
                  value={customPlsql}
                  onChange={(e) => {
                    setCustomPlsql(e.target.value);
                    setAuditResult(reviewFlexcubePlSql(e.target.value));
                  }}
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    borderRadius: "6px",
                    background: "#0f172a",
                    border: "1px solid var(--border-light)",
                    color: "#38bdf8",
                    fontFamily: "monospace",
                    fontSize: "0.82rem",
                  }}
                />

                <div
                  style={{
                    background: isAuditPassed ? "rgba(16, 185, 129, 0.1)" : "rgba(239, 68, 68, 0.1)",
                    border: `1px solid ${isAuditPassed ? "#10b981" : "#ef4444"}`,
                    borderRadius: "8px",
                    padding: "1rem",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                    <strong style={{ color: isAuditPassed ? "#34d399" : "#f87171", fontSize: "0.9rem" }}>
                      Score de Qualité : {auditResult.score} / 100 — {isAuditPassed ? "CONFORME" : "NON CONFORME"}
                    </strong>
                  </div>
                  {auditResult.issues.length > 0 && (
                    <ul style={{ margin: 0, paddingLeft: "1.25rem", fontSize: "0.82rem", color: "#f87171" }}>
                      {auditResult.issues.map((iss, i) => (
                        <li key={i}>
                          <strong>[{iss.severity}]</strong> {iss.message} <em>(Correction : {iss.fix})</em>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            )}

          </div>
        </div>

      </div>
    </AppShell>
  );
}
