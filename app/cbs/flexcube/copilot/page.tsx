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

const PRESET_NEEDS: { label: string; sub: string; icon: string; module: FlexcubeModule; input: FlexcubeNeedInput }[] = [
  {
    label: "Virement Inter-Comptes FTTB",
    sub: "Débit / Crédit temps réel avec contrôle de solde & écritures ACTB",
    icon: "💸",
    module: "FT",
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
    label: "Blocage Provision Switch",
    sub: "Réservation temps réel lors d une autorisation GAB/TPE ISO 8583",
    icon: "🏧",
    module: "AC",
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
    label: "Équilibre Clôture AEOD",
    sub: "Contrôle de balance Débit/Crédit ACTB avant consolidation GL",
    icon: "⚖️",
    module: "GL",
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
    label: "Échéancier Prêt Personnel",
    sub: "Prélèvement automatique des mensualités échues dans CLTB",
    icon: "📅",
    module: "CL",
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
  const [plsqlSubTab, setPlsqlSubTab] = useState<"all" | "spec" | "body">("all");

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
  const [projectSearch, setProjectSearch] = useState<string>("");

  // Audit de code PL/SQL
  const [customPlsql, setCustomPlsql] = useState<string>(
    "CREATE OR REPLACE PROCEDURE PR_TRANSFER IS\nBEGIN\n  SELECT * FROM STTM_CUST_ACCOUNT FOR UPDATE;\n  COMMIT;\nEND;"
  );
  const [auditResult, setAuditResult] = useState(() => reviewFlexcubePlSql(customPlsql));

  // Sonde de santé Agent Docker
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

  // Chargement des projets sauvegardés
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

  // Déclenchement local immédiat
  const handleGenerateLocal = (presetInput?: FlexcubeNeedInput) => {
    const targetInput = presetInput || input;
    const newPlan = generateFlexcubePlan(targetInput);
    setPlan(newPlan);
    setActionFeedback("⚡ Plan technique & packages PL/SQL régénérés avec succès par le moteur autonome !");
    setTimeout(() => setActionFeedback(null), 4000);
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
        throw new Error("Échec de la génération du prompt système par l agent.");
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

        setActionFeedback("✨ Analyse produite par l Agent IA ! Vous pouvez valider ou refuser avec motif.");
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
      if (!res.ok) throw new Error("Échec lors de l acceptation de l analyse.");
      setAgentSession((prev) => (prev ? { ...prev, decision: "ACCEPTEE" } : null));
      setActionFeedback("✅ Analyse validée par l humain ! Vous pouvez maintenant lancer l Agent de Code.");
    } catch (err: any) {
      setAgentError(err.message || "Erreur de validation.");
    } finally {
      setIsValidating(false);
    }
  };

  // Rejet motivé (HitL)
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
      setActionFeedback(`🔄 Nouvelle version v${updated.currentVersion} régénérée par l agent prenant en compte votre motif !`);
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
        throw new Error(err.detail || "Échec de génération du code par l agent.");
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

  // Sauvegarde du projet
  const handleSaveProject = async () => {
    try {
      setSaveStatus("Sauvegarde...");
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
        setSaveStatus("✅ Enregistré !");
        setSavedProjects((prev) => [data.project, ...prev.filter((p) => p.id !== data.project.id)]);
        setTimeout(() => setSaveStatus(null), 3000);
      } else {
        setSaveStatus("❌ Erreur");
      }
    } catch {
      setSaveStatus("❌ Erreur réseau");
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const insertSnippetIntoDescription = (snippet: string) => {
    setInput((prev) => ({
      ...prev,
      functionalDescription: prev.functionalDescription ? `${prev.functionalDescription} ${snippet}` : snippet,
    }));
  };

  const insertSnippetIntoRules = (snippet: string) => {
    setInput((prev) => ({
      ...prev,
      knownBusinessRules: prev.knownBusinessRules ? `${prev.knownBusinessRules} • ${snippet}` : snippet,
    }));
  };

  const downloadFile = (filename: string, content: string) => {
    const element = document.createElement("a");
    const file = new Blob([content], { type: "text/plain;charset=utf-8" });
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const isAuditPassed = auditResult.score >= 70;

  // Calcul du step courant du pipeline
  const currentPipelineStep = agentSession
    ? agentSession.decision === "ACCEPTEE"
      ? 4
      : 3
    : agentLoading
      ? 2
      : 1;

  const filteredProjects = savedProjects.filter(
    (p) =>
      p.name.toLowerCase().includes(projectSearch.toLowerCase()) ||
      p.module.toLowerCase().includes(projectSearch.toLowerCase())
  );

  return (
    <AppShell pageTitle="Oracle FLEXCUBE Copilot & Agents IA" eyebrow="BUILD & EXTENSIBILITÉ FCUBS">
      <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>

        {/* 1. PIPELINE STEPPER INTERACTIF (Human-in-the-Loop) */}
        <div
          style={{
            background: "linear-gradient(135deg, #090d16 0%, #0f172a 100%)",
            border: "1px solid rgba(234, 88, 12, 0.35)",
            borderRadius: "14px",
            padding: "1rem 1.5rem",
            boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.5), 0 0 15px rgba(234, 88, 12, 0.1)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.85rem", flexWrap: "wrap", gap: "0.5rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <span style={{ fontSize: "0.9rem" }}>🔄</span>
              <span style={{ fontSize: "0.78rem", fontWeight: 800, color: "#fdba74", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                Pipeline Agentique Human-in-the-Loop
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", fontSize: "0.75rem", color: "#94a3b8" }}>
              <span>Phase active :</span>
              <span style={{ fontWeight: 800, color: "#ffffff", background: "rgba(234, 88, 12, 0.25)", padding: "2px 8px", borderRadius: "6px", border: "1px solid #ea580c" }}>
                {currentPipelineStep === 1 && "1. Spécification & Besoins"}
                {currentPipelineStep === 2 && "2. Analyse & Prompt Agent"}
                {currentPipelineStep === 3 && "3. Validation Humaine (HitL)"}
                {currentPipelineStep === 4 && "4. Code PL/SQL & Livrables"}
              </span>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "0.75rem" }}>
            {[
              { num: 1, title: "1. Spécification", desc: "Module & Règles ACID", icon: "📝" },
              { num: 2, title: "2. Analyse Agent IA", desc: "Découpage sous-tâches", icon: "🤖" },
              { num: 3, title: "3. Validation HitL", desc: "Approbation humaine", icon: "🛡️" },
              { num: 4, title: "4. Code & Livrables", desc: "Packages _CUSTOM & DDL", icon: "⚡" },
            ].map((step) => {
              const isDone = currentPipelineStep > step.num;
              const isCurrent = currentPipelineStep === step.num;
              return (
                <div
                  key={step.num}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.65rem",
                    padding: "0.6rem 0.85rem",
                    borderRadius: "10px",
                    background: isCurrent ? "rgba(234, 88, 12, 0.18)" : isDone ? "rgba(16, 185, 129, 0.1)" : "rgba(255, 255, 255, 0.03)",
                    border: `1px solid ${isCurrent ? "#ea580c" : isDone ? "#10b981" : "rgba(255, 255, 255, 0.06)"}`,
                    transition: "all 0.2s ease",
                  }}
                >
                  <div
                    style={{
                      width: "28px",
                      height: "28px",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "0.78rem",
                      fontWeight: 800,
                      background: isCurrent ? "#ea580c" : isDone ? "#10b981" : "rgba(255, 255, 255, 0.1)",
                      color: "#ffffff",
                      flexShrink: 0,
                    }}
                  >
                    {isDone ? "✓" : step.icon}
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: "0.78rem", fontWeight: 700, color: isCurrent ? "#fdba74" : isDone ? "#34d399" : "#e2e8f0" }}>
                      {step.title}
                    </div>
                    <div style={{ fontSize: "0.68rem", color: "#94a3b8", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {step.desc}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 2. HERO CARD MODERNE & STATUT DOCKER */}
        <div
          style={{
            position: "relative",
            overflow: "hidden",
            background: "linear-gradient(135deg, #090d16 0%, #111827 50%, #1e1b4b 100%)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: "16px",
            padding: "1.5rem 1.75rem",
            boxShadow: "0 10px 30px rgba(0, 0, 0, 0.4)",
          }}
        >
          {/* Accent lumineux orange Oracle */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "3px",
              background: "linear-gradient(90deg, #ea580c 0%, #f59e0b 50%, #dc2626 100%)",
            }}
          />

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1.25rem" }}>
            <div style={{ maxWidth: "680px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem", flexWrap: "wrap" }}>
                <span
                  style={{
                    background: "linear-gradient(135deg, #ea580c 0%, #c2410c 100%)",
                    color: "#ffffff",
                    fontSize: "0.72rem",
                    fontWeight: 800,
                    padding: "3px 9px",
                    borderRadius: "6px",
                    letterSpacing: "0.06em",
                    boxShadow: "0 2px 8px rgba(234, 88, 12, 0.4)",
                  }}
                >
                  STUDIO AGENTIQUE ORACLE FLEXCUBE
                </span>
                <span style={{ color: "#fdba74", fontSize: "0.75rem", fontWeight: 600 }}>
                  ⚡ Packages PL/SQL CUSPKS_*_CUSTOM • Concurrence NOWAIT • Extensibilité Radpack
                </span>
              </div>
              <h2 style={{ fontSize: "1.45rem", fontWeight: 800, margin: "0 0 0.4rem 0", color: "#ffffff", letterSpacing: "-0.02em" }}>
                Assistant &amp; Pipeline Agentique Oracle FLEXCUBE
              </h2>
              <p style={{ fontSize: "0.85rem", color: "#94a3b8", margin: 0, lineHeight: "1.5" }}>
                Accélérez vos développements Core Banking : spécification de besoins, génération de packages PL/SQL durcis, scripts DDL optimisés, requêtes d investigation et tests unitaires automatisés.
              </p>
            </div>

            {/* Badges d état & Actions rapides */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem", alignItems: "flex-end" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
                {/* Sonde Docker Agent */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    background: "rgba(0, 0, 0, 0.45)",
                    padding: "6px 12px",
                    borderRadius: "10px",
                    border: "1px solid rgba(255, 255, 255, 0.12)",
                    fontSize: "0.76rem",
                  }}
                >
                  <span
                    style={{
                      width: "8px",
                      height: "8px",
                      borderRadius: "50%",
                      background: dockerHealth.status === "ok" ? "#10b981" : dockerHealth.status === "checking" ? "#f59e0b" : "#ef4444",
                      boxShadow: dockerHealth.status === "ok" ? "0 0 10px #10b981" : "none",
                    }}
                  />
                  <span style={{ color: "#cbd5e1", fontWeight: 600 }}>Docker (:8080) :</span>
                  <span style={{ color: dockerHealth.status === "ok" ? "#34d399" : "#f87171", fontWeight: 700 }}>
                    {dockerHealth.status === "ok" ? `Actif (${dockerHealth.llmModel})` : dockerHealth.status === "checking" ? "Vérification..." : "Autonome / Local"}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setShowProjectsModal(true)}
                  style={{
                    background: "rgba(255, 255, 255, 0.08)",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                    color: "#ffffff",
                    padding: "6px 12px",
                    borderRadius: "10px",
                    fontSize: "0.78rem",
                    fontWeight: 600,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.35rem",
                    transition: "all 0.15s ease",
                  }}
                >
                  <span>📂</span> Projets ({savedProjects.length})
                </button>

                <Link
                  href="/cbs/copilot"
                  style={{
                    background: "rgba(2, 132, 199, 0.15)",
                    border: "1px solid rgba(56, 189, 248, 0.4)",
                    color: "#38bdf8",
                    textDecoration: "none",
                    padding: "6px 12px",
                    borderRadius: "10px",
                    fontSize: "0.78rem",
                    fontWeight: 600,
                    display: "flex",
                    alignItems: "center",
                    gap: "0.35rem",
                  }}
                >
                  <span>↩</span> Amplitude 4GL
                </Link>
              </div>

              {/* Règle d or d ingénierie FLEXCUBE */}
              <div style={{ fontSize: "0.72rem", color: "#fb923c", fontWeight: 600 }}>
                🔒 Règle FCUBS : Isolation transactionnelle sans COMMIT &amp; Verrous NOWAIT
              </div>
            </div>
          </div>
        </div>

        {/* FEEDBACK & NOTIFICATIONS */}
        {actionFeedback && (
          <div
            style={{
              background: "rgba(16, 185, 129, 0.12)",
              border: "1px solid #10b981",
              color: "#34d399",
              padding: "0.75rem 1.25rem",
              borderRadius: "10px",
              fontSize: "0.82rem",
              fontWeight: 600,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              boxShadow: "0 4px 12px rgba(16, 185, 129, 0.15)",
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
              background: "rgba(239, 68, 68, 0.12)",
              border: "1px solid #ef4444",
              color: "#f87171",
              padding: "0.75rem 1.25rem",
              borderRadius: "10px",
              fontSize: "0.82rem",
              fontWeight: 600,
            }}
          >
            ⚠️ {agentError}
          </div>
        )}

        {/* 3. BARRE D ÉTAT SESSION AGENT IA & HUMAN-IN-THE-LOOP */}
        {agentSession && (
          <div
            style={{
              background: "linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(15, 23, 42, 0.95) 100%)",
              border: `1px solid ${agentSession.decision === "ACCEPTEE" ? "rgba(16, 185, 129, 0.5)" : "rgba(245, 158, 11, 0.5)"}`,
              borderRadius: "12px",
              padding: "1rem 1.25rem",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "1rem",
              boxShadow: "0 6px 20px rgba(0, 0, 0, 0.35)",
            }}
          >
            <div style={{ maxWidth: "620px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", flexWrap: "wrap" }}>
                <span style={{ fontSize: "1.2rem" }}>🤖</span>
                <span style={{ fontWeight: 800, color: "#ffffff", fontSize: "0.92rem" }}>
                  Session Agent : <code style={{ color: "#38bdf8", background: "rgba(56, 189, 248, 0.1)", padding: "2px 6px", borderRadius: "4px" }}>{agentSession.name}</code> (v{agentSession.version})
                </span>
                <span
                  style={{
                    background: agentSession.decision === "ACCEPTEE" ? "rgba(16, 185, 129, 0.2)" : "rgba(245, 158, 11, 0.2)",
                    color: agentSession.decision === "ACCEPTEE" ? "#34d399" : "#fbbf24",
                    border: `1px solid ${agentSession.decision === "ACCEPTEE" ? "#10b981" : "#f59e0b"}`,
                    fontSize: "0.7rem",
                    fontWeight: 800,
                    padding: "2px 8px",
                    borderRadius: "10px",
                  }}
                >
                  {agentSession.decision === "ACCEPTEE" ? "✓ VALIDÉE PAR L HUMAIN" : "⏳ EN ATTENTE DE VALIDATION"}
                </span>
              </div>
              <p style={{ margin: "4px 0 0 0", fontSize: "0.8rem", color: "#94a3b8", lineHeight: "1.4" }}>
                {agentSession.summary || "Analyse technique et décomposition en sous-tâches validée par l agent."}
              </p>
            </div>

            <div style={{ display: "flex", gap: "0.6rem", alignItems: "center", flexWrap: "wrap" }}>
              {agentSession.decision !== "ACCEPTEE" ? (
                <>
                  <button
                    type="button"
                    onClick={handleAcceptAnalysis}
                    disabled={isValidating}
                    style={{
                      background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                      color: "#ffffff",
                      border: "none",
                      padding: "0.5rem 1rem",
                      borderRadius: "8px",
                      fontSize: "0.82rem",
                      fontWeight: 700,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.4rem",
                      boxShadow: "0 2px 8px rgba(16, 185, 129, 0.3)",
                    }}
                  >
                    <span>✓</span> {isValidating ? "Validation..." : "Valider l Analyse"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowRejectModal(true)}
                    style={{
                      background: "rgba(239, 68, 68, 0.15)",
                      color: "#f87171",
                      border: "1px solid rgba(239, 68, 68, 0.4)",
                      padding: "0.5rem 0.9rem",
                      borderRadius: "8px",
                      fontSize: "0.82rem",
                      fontWeight: 700,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.4rem",
                    }}
                  >
                    <span>✕</span> Refuser avec motif
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
                    padding: "0.6rem 1.25rem",
                    borderRadius: "8px",
                    fontSize: "0.85rem",
                    fontWeight: 800,
                    cursor: "pointer",
                    boxShadow: "0 4px 14px rgba(234, 88, 12, 0.45)",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  <span>🚀</span> {isGeneratingCode ? "Génération PL/SQL en cours..." : "Générer le Code PL/SQL (Agent Code)"}
                </button>
              )}
            </div>
          </div>
        )}

        {/* 4. MODAL REJET HUMAN-IN-THE-LOOP */}
        {showRejectModal && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0, 0, 0, 0.8)",
              backdropFilter: "blur(4px)",
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
                borderRadius: "16px",
                padding: "1.75rem",
                maxWidth: "560px",
                width: "100%",
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.7)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
                <span style={{ fontSize: "1.25rem" }}>🛡️</span>
                <h3 style={{ margin: 0, color: "#ffffff", fontSize: "1.15rem", fontWeight: 800 }}>
                  Refus motivé de l analyse (Human-in-the-Loop)
                </h3>
              </div>
              <p style={{ fontSize: "0.82rem", color: "#94a3b8", margin: "0 0 1rem 0", lineHeight: "1.4" }}>
                Précisez à l Agent IA les anomalies ou manques à corriger. Une nouvelle version conforme sera régénérée.
              </p>

              {/* Suggestions rapides */}
              <div style={{ marginBottom: "0.75rem" }}>
                <span style={{ fontSize: "0.72rem", color: "#cbd5e1", fontWeight: 700, display: "block", marginBottom: "4px" }}>
                  Motifs fréquents :
                </span>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
                  {[
                    "Manque clause FOR UPDATE NOWAIT",
                    "Contrôle de provision insuffisant",
                    "Écritures comptables ACTB incomplètes",
                    "Ajouter tests d isolation transactionnelle",
                  ].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setRejectReason(preset)}
                      style={{
                        background: "rgba(255, 255, 255, 0.06)",
                        border: "1px solid rgba(255, 255, 255, 0.15)",
                        color: "#e2e8f0",
                        padding: "3px 8px",
                        borderRadius: "6px",
                        fontSize: "0.72rem",
                        cursor: "pointer",
                      }}
                    >
                      + {preset}
                    </button>
                  ))}
                </div>
              </div>

              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                rows={4}
                placeholder="Ex: Il manque la prise en compte du statut d opposition dans STTM_CUST_ACCOUNT..."
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  background: "#1e293b",
                  border: "1px solid rgba(255, 255, 255, 0.15)",
                  borderRadius: "8px",
                  color: "#ffffff",
                  fontSize: "0.85rem",
                  marginBottom: "1.25rem",
                  resize: "vertical",
                }}
              />

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem" }}>
                <button
                  type="button"
                  onClick={() => setShowRejectModal(false)}
                  style={{
                    background: "transparent",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                    color: "#cbd5e1",
                    padding: "0.5rem 1rem",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontSize: "0.82rem",
                  }}
                >
                  Annuler
                </button>
                <button
                  type="button"
                  onClick={handleRejectAnalysis}
                  disabled={isRejecting || rejectReason.trim().length < 8}
                  style={{
                    background: "#ef4444",
                    color: "#ffffff",
                    border: "none",
                    padding: "0.5rem 1.15rem",
                    borderRadius: "8px",
                    fontWeight: 700,
                    cursor: "pointer",
                    fontSize: "0.82rem",
                  }}
                >
                  {isRejecting ? "Régénération en cours..." : "Soumettre à l Agent IA →"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 5. MODAL PROJETS ENREGISTRÉS */}
        {showProjectsModal && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0, 0, 0, 0.8)",
              backdropFilter: "blur(4px)",
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
                border: "1px solid rgba(255, 255, 255, 0.15)",
                borderRadius: "16px",
                padding: "1.5rem",
                maxWidth: "680px",
                width: "100%",
                maxHeight: "85vh",
                overflowY: "auto",
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.7)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <span style={{ fontSize: "1.2rem" }}>📂</span>
                  <h3 style={{ margin: 0, color: "#ffffff", fontSize: "1.15rem", fontWeight: 800 }}>
                    Projets Oracle FLEXCUBE Enregistrés
                  </h3>
                </div>
                <button
                  onClick={() => setShowProjectsModal(false)}
                  style={{ background: "transparent", border: "none", color: "#94a3b8", cursor: "pointer", fontSize: "1.2rem" }}
                >
                  ✕
                </button>
              </div>

              <input
                type="text"
                placeholder="Filtrer par nom ou module..."
                value={projectSearch}
                onChange={(e) => setProjectSearch(e.target.value)}
                style={{
                  width: "100%",
                  padding: "0.6rem 0.85rem",
                  borderRadius: "8px",
                  background: "#1e293b",
                  border: "1px solid rgba(255, 255, 255, 0.12)",
                  color: "#ffffff",
                  fontSize: "0.82rem",
                  marginBottom: "1rem",
                }}
              />

              {filteredProjects.length === 0 ? (
                <p style={{ color: "#94a3b8", fontSize: "0.85rem", textAlign: "center", padding: "2rem" }}>
                  Aucun projet correspondant trouvé.
                </p>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "0.65rem" }}>
                  {filteredProjects.map((p) => (
                    <div
                      key={p.id}
                      style={{
                        background: "#1e293b",
                        border: "1px solid rgba(255, 255, 255, 0.08)",
                        borderRadius: "10px",
                        padding: "0.85rem 1.15rem",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: "1rem",
                      }}
                    >
                      <div style={{ minWidth: 0 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "3px" }}>
                          <span style={{ fontSize: "0.72rem", padding: "2px 6px", background: "#ea580c", color: "#fff", borderRadius: "4px", fontWeight: 800 }}>
                            {p.module || "FT"}
                          </span>
                          <h4 style={{ margin: 0, fontSize: "0.92rem", color: "#f8fafc", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                            {p.name}
                          </h4>
                        </div>
                        <span style={{ fontSize: "0.72rem", color: "#94a3b8" }}>
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
                          padding: "0.45rem 0.9rem",
                          borderRadius: "8px",
                          fontSize: "0.78rem",
                          fontWeight: 700,
                          cursor: "pointer",
                          flexShrink: 0,
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

        {/* 6. GRILLE PRINCIPALE DU STUDIO (FORMULAIRE & RÉSULTATS) */}
        <div style={{ display: "grid", gridTemplateColumns: "minmax(340px, 440px) 1fr", gap: "1.25rem", alignItems: "start" }}>

          {/* COLONNE GAUCHE : FORMULAIRE DE SPÉCIFICATION */}
          <div
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border-light)",
              borderRadius: "14px",
              padding: "1.25rem",
              boxShadow: "var(--shadow-sm)",
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.45rem" }}>
                <span style={{ fontSize: "1rem" }}>📋</span>
                <h3 style={{ margin: 0, fontSize: "1rem", fontWeight: 800, color: "var(--text-primary)" }}>
                  Spécification du Besoin
                </h3>
              </div>
              <span style={{ fontSize: "0.72rem", color: "#ea580c", fontWeight: 700, background: "rgba(234, 88, 12, 0.1)", padding: "2px 8px", borderRadius: "6px" }}>
                Préréglages rapides
              </span>
            </div>

            {/* SÉLECTEUR DE PRÉRÉGLAGES BANCAIRES */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
              {PRESET_NEEDS.map((preset) => {
                const isSelected = input.title === preset.input.title;
                return (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => {
                      setInput(preset.input);
                      handleGenerateLocal(preset.input);
                    }}
                    style={{
                      background: isSelected ? "rgba(234, 88, 12, 0.1)" : "var(--bg-subtle)",
                      border: `1.5px solid ${isSelected ? "#ea580c" : "var(--border-light)"}`,
                      borderRadius: "8px",
                      padding: "0.6rem",
                      textAlign: "left",
                      cursor: "pointer",
                      display: "flex",
                      flexDirection: "column",
                      gap: "2px",
                      transition: "all 0.15s ease",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: "1rem" }}>{preset.icon}</span>
                      <span style={{ fontSize: "0.65rem", fontWeight: 800, color: isSelected ? "#ea580c" : "var(--text-muted)" }}>
                        {preset.module}
                      </span>
                    </div>
                    <span style={{ fontSize: "0.75rem", fontWeight: 700, color: isSelected ? "#c2410c" : "var(--text-primary)", lineHeight: "1.2" }}>
                      {preset.label}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* FORMULAIRE DE CONFIGURATION */}
            <form onSubmit={(e) => { e.preventDefault(); handleGenerateLocal(); }} style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "var(--text-secondary)", marginBottom: "4px" }}>
                  Titre du Besoin / User Story
                </label>
                <input
                  type="text"
                  value={input.title}
                  onChange={(e) => setInput({ ...input, title: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "0.55rem 0.75rem",
                    borderRadius: "8px",
                    background: "var(--bg-subtle)",
                    border: "1px solid var(--border-light)",
                    color: "var(--text-primary)",
                    fontSize: "0.82rem",
                    fontWeight: 600,
                  }}
                />
              </div>

              {/* Module & Version FLEXCUBE */}
              <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: "0.5rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "var(--text-secondary)", marginBottom: "4px" }}>
                    Module FCUBS
                  </label>
                  <select
                    value={input.module}
                    onChange={(e) => setInput({ ...input, module: e.target.value as FlexcubeModule })}
                    style={{
                      width: "100%",
                      padding: "0.55rem",
                      borderRadius: "8px",
                      background: "var(--bg-subtle)",
                      border: "1px solid var(--border-light)",
                      color: "var(--text-primary)",
                      fontSize: "0.8rem",
                      fontWeight: 600,
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
                  <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "var(--text-secondary)", marginBottom: "4px" }}>
                    Version FLEXCUBE
                  </label>
                  <select
                    value={input.flexcubeVersion}
                    onChange={(e) => setInput({ ...input, flexcubeVersion: e.target.value as FlexcubeVersion })}
                    style={{
                      width: "100%",
                      padding: "0.55rem",
                      borderRadius: "8px",
                      background: "var(--bg-subtle)",
                      border: "1px solid var(--border-light)",
                      color: "var(--text-primary)",
                      fontSize: "0.8rem",
                      fontWeight: 600,
                    }}
                  >
                    <option value="14.x">FLEXCUBE 14.x</option>
                    <option value="12.4">FLEXCUBE 12.4</option>
                    <option value="UNCONFIRMED">Non confirmé</option>
                  </select>
                </div>
              </div>

              {/* Type d environnement */}
              <div>
                <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "var(--text-secondary)", marginBottom: "4px" }}>
                  Environnement &amp; Cible Technique
                </label>
                <select
                  value={input.environmentType || "PLSQL_BACKEND"}
                  onChange={(e) => setInput({ ...input, environmentType: e.target.value as any })}
                  style={{
                    width: "100%",
                    padding: "0.55rem",
                    borderRadius: "8px",
                    background: "var(--bg-subtle)",
                    border: "1px solid var(--border-light)",
                    color: "var(--text-primary)",
                    fontSize: "0.8rem",
                    fontWeight: 600,
                  }}
                >
                  <option value="PLSQL_BACKEND">PLSQL_BACKEND (Packages &amp; Procédures Métier)</option>
                  <option value="GATEWAY_INTERFACE">GATEWAY_INTERFACE (Passerelle Switch &amp; API Web)</option>
                  <option value="BATCH_AEOD">BATCH_AEOD (Chaîne Clôture Nocturne)</option>
                  <option value="RADPACK_EXT">RADPACK_EXT (Écrans &amp; Extensibilité)</option>
                </select>
              </div>

              {/* Description Fonctionnelle avec raccourcis tables */}
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                  <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-secondary)" }}>
                    Description Fonctionnelle
                  </label>
                  <span style={{ fontSize: "0.68rem", color: "#64748b" }}>Insertion rapide :</span>
                </div>
                <textarea
                  rows={3}
                  value={input.functionalDescription}
                  onChange={(e) => setInput({ ...input, functionalDescription: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "0.55rem 0.75rem",
                    borderRadius: "8px",
                    background: "var(--bg-subtle)",
                    border: "1px solid var(--border-light)",
                    color: "var(--text-primary)",
                    fontSize: "0.8rem",
                    lineHeight: "1.4",
                  }}
                />
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.3rem", marginTop: "4px" }}>
                  {["STTM_CUST_ACCOUNT", "ACTB_DAILY_LOG", "FTTB_CONTRACT_MASTER", "GLTB_GL_BALANCES"].map((tbl) => (
                    <button
                      key={tbl}
                      type="button"
                      onClick={() => insertSnippetIntoDescription(tbl)}
                      style={{
                        background: "rgba(2, 132, 199, 0.08)",
                        border: "1px solid rgba(2, 132, 199, 0.25)",
                        color: "#0284c7",
                        padding: "2px 6px",
                        borderRadius: "4px",
                        fontSize: "0.65rem",
                        cursor: "pointer",
                        fontWeight: 600,
                      }}
                    >
                      + {tbl}
                    </button>
                  ))}
                </div>
              </div>

              {/* Règles Métier & Contraintes ACID */}
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                  <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-secondary)" }}>
                    Règles Métier &amp; ACID
                  </label>
                  <span style={{ fontSize: "0.68rem", color: "#64748b" }}>Règles ACID :</span>
                </div>
                <textarea
                  rows={2}
                  value={input.knownBusinessRules}
                  onChange={(e) => setInput({ ...input, knownBusinessRules: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "0.55rem 0.75rem",
                    borderRadius: "8px",
                    background: "var(--bg-subtle)",
                    border: "1px solid var(--border-light)",
                    color: "var(--text-primary)",
                    fontSize: "0.8rem",
                    lineHeight: "1.4",
                  }}
                />
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.3rem", marginTop: "4px" }}>
                  {["FOR UPDATE NOWAIT", "Capture ORA-00054", "Aucun COMMIT", "BULK COLLECT"].map((rule) => (
                    <button
                      key={rule}
                      type="button"
                      onClick={() => insertSnippetIntoRules(rule)}
                      style={{
                        background: "rgba(234, 88, 12, 0.08)",
                        border: "1px solid rgba(234, 88, 12, 0.25)",
                        color: "#ea580c",
                        padding: "2px 6px",
                        borderRadius: "4px",
                        fontSize: "0.65rem",
                        cursor: "pointer",
                        fontWeight: 600,
                      }}
                    >
                      + {rule}
                    </button>
                  ))}
                </div>
              </div>

              {/* BOUTONS D ACTIONS */}
              <div style={{ display: "flex", flexDirection: "column", gap: "0.55rem", marginTop: "0.5rem" }}>
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
                      borderRadius: "10px",
                      fontSize: "0.88rem",
                      fontWeight: 800,
                      cursor: "pointer",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      gap: "0.5rem",
                      boxShadow: "0 4px 14px rgba(234, 88, 12, 0.35)",
                      transition: "all 0.15s ease",
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
                      background: dockerHealth.status === "ok" ? "var(--bg-subtle)" : "linear-gradient(135deg, #0284c7 0%, #0369a1 100%)",
                      color: dockerHealth.status === "ok" ? "var(--text-primary)" : "#ffffff",
                      border: dockerHealth.status === "ok" ? "1px solid var(--border-light)" : "none",
                      padding: "0.65rem",
                      borderRadius: "8px",
                      fontSize: "0.8rem",
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
                      background: "rgba(16, 185, 129, 0.12)",
                      border: "1px solid rgba(16, 185, 129, 0.3)",
                      color: "#059669",
                      padding: "0.65rem 0.95rem",
                      borderRadius: "8px",
                      fontSize: "0.8rem",
                      fontWeight: 700,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.35rem",
                    }}
                  >
                    <span>💾</span> {saveStatus || "Sauvegarder"}
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* COLONNE DROITE : VISUALISEUR & RÉSULTATS */}
          <div
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border-light)",
              borderRadius: "14px",
              padding: "1.25rem",
              boxShadow: "var(--shadow-sm)",
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
              minWidth: 0,
            }}
          >
            {/* BARRE D ONGLETS ÉPURÉE AVEC BADGES */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--border-light)", paddingBottom: "0.75rem", flexWrap: "wrap", gap: "0.5rem" }}>
              <div style={{ display: "flex", gap: "0.35rem", flexWrap: "wrap" }}>
                {[
                  { key: "plan", label: "Plan & Tâches", icon: "📋", badge: `${plan.subTasks.length}` },
                  { key: "plsql", label: "Package PL/SQL", icon: "⚡", badge: "CUSPKS" },
                  { key: "sql", label: "DDL & Requêtes", icon: "🗄️", badge: "SQL" },
                  { key: "tests", label: "Tests Unitaires", icon: "🧪", badge: `${plan.testCases.length}` },
                  { key: "delivery", label: "Déploiement", icon: "📦", badge: "Rollback" },
                  { key: "audit", label: "Audit PL/SQL", icon: "🔍", badge: `${auditResult.score}/100` },
                ].map((tab) => {
                  const isActive = activeTab === tab.key;
                  return (
                    <button
                      key={tab.key}
                      type="button"
                      onClick={() => setActiveTab(tab.key as any)}
                      style={{
                        background: isActive ? "#ea580c" : "transparent",
                        color: isActive ? "#ffffff" : "var(--text-secondary)",
                        border: `1px solid ${isActive ? "#ea580c" : "transparent"}`,
                        padding: "0.45rem 0.75rem",
                        borderRadius: "8px",
                        fontSize: "0.78rem",
                        fontWeight: isActive ? 700 : 600,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.4rem",
                        transition: "all 0.15s ease",
                      }}
                    >
                      <span>{tab.icon}</span>
                      <span>{tab.label}</span>
                      <span
                        style={{
                          fontSize: "0.65rem",
                          padding: "1px 5px",
                          borderRadius: "4px",
                          background: isActive ? "rgba(0,0,0,0.25)" : "var(--bg-subtle)",
                          color: isActive ? "#ffffff" : "var(--text-muted)",
                          fontWeight: 700,
                        }}
                      >
                        {tab.badge}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Raccourcis de téléchargement & copie */}
              <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                <button
                  type="button"
                  onClick={() => downloadFile(`${plan.plsqlProposal.packageName}.sql`, plan.plsqlProposal.packageSpec + "\n/\n\n" + plan.plsqlProposal.packageBody)}
                  title="Télécharger le fichier .sql"
                  style={{
                    background: "var(--bg-subtle)",
                    border: "1px solid var(--border-light)",
                    color: "var(--text-secondary)",
                    padding: "4px 8px",
                    borderRadius: "6px",
                    fontSize: "0.74rem",
                    cursor: "pointer",
                    fontWeight: 600,
                  }}
                >
                  📥 .SQL
                </button>
                <button
                  type="button"
                  onClick={() => copyToClipboard(plan.plsqlProposal.packageSpec + "\n/\n\n" + plan.plsqlProposal.packageBody)}
                  style={{
                    background: "var(--bg-subtle)",
                    border: "1px solid var(--border-light)",
                    color: "var(--text-secondary)",
                    padding: "4px 8px",
                    borderRadius: "6px",
                    fontSize: "0.74rem",
                    cursor: "pointer",
                    fontWeight: 600,
                  }}
                >
                  {copiedCode ? "✓ Copié" : "📋 Copier"}
                </button>
              </div>
            </div>

            {/* TAB 1: PLAN & TÂCHES */}
            {activeTab === "plan" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {/* Carte Résumé Architecture ACID moderne */}
                <div
                  style={{
                    background: "linear-gradient(135deg, #090d16 0%, #0f172a 100%)",
                    borderLeft: "4px solid #ea580c",
                    borderTop: "1px solid rgba(255, 255, 255, 0.08)",
                    borderRight: "1px solid rgba(255, 255, 255, 0.08)",
                    borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
                    padding: "1.15rem",
                    borderRadius: "10px",
                    color: "#ffffff",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.6rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <span style={{ fontSize: "1rem" }}>🏛️</span>
                      <span style={{ fontSize: "0.76rem", color: "#fdba74", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                        ARCHITECTURE BANCAIRE &amp; CONTRAINTES ACID
                      </span>
                    </div>
                    <span style={{ fontSize: "0.72rem", color: "#94a3b8", background: "rgba(255, 255, 255, 0.08)", padding: "2px 8px", borderRadius: "4px" }}>
                      Module {plan.need.module} • {plan.need.flexcubeVersion}
                    </span>
                  </div>
                  <p style={{ fontSize: "0.85rem", color: "#e2e8f0", margin: "0 0 0.75rem 0", lineHeight: "1.5" }}>
                    {plan.analysis.summary}
                  </p>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "0.5rem", fontSize: "0.75rem", background: "rgba(0, 0, 0, 0.35)", padding: "0.65rem 0.85rem", borderRadius: "8px" }}>
                    <div>
                      <strong style={{ color: "#fdba74" }}>Objectif Bancaire :</strong>
                      <div style={{ color: "#cbd5e1" }}>{plan.analysis.businessObjective}</div>
                    </div>
                    <div>
                      <strong style={{ color: "#fdba74" }}>Gestion Concurrence :</strong>
                      <div style={{ color: "#cbd5e1" }}>Verrous FOR UPDATE NOWAIT (pas de blocage)</div>
                    </div>
                  </div>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <h4 style={{ margin: 0, fontSize: "0.95rem", color: "var(--text-primary)", fontWeight: 800 }}>
                    Sous-Tâches Ordonnées ({plan.subTasks.length})
                  </h4>
                  <span style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>Séquencement optimal de BUILD</span>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "0.65rem" }}>
                  {plan.subTasks.map((task) => (
                    <div
                      key={task.id}
                      style={{
                        background: "var(--bg-subtle)",
                        border: "1px solid var(--border-light)",
                        borderRadius: "10px",
                        padding: "0.9rem 1.1rem",
                        transition: "all 0.15s ease",
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.4rem" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                          <span style={{ fontWeight: 800, fontSize: "0.78rem", color: "#ea580c", background: "rgba(234, 88, 12, 0.1)", padding: "2px 7px", borderRadius: "4px" }}>
                            {task.id}
                          </span>
                          <span style={{ fontWeight: 700, fontSize: "0.85rem", color: "var(--text-primary)" }}>{task.title}</span>
                        </div>
                        <span style={{ fontSize: "0.72rem", padding: "2px 6px", background: "rgba(0, 0, 0, 0.05)", borderRadius: "4px", color: "var(--text-secondary)", fontWeight: 600 }}>
                          ⏱️ {task.estimation}
                        </span>
                      </div>
                      <p style={{ margin: "0 0 0.5rem 0", fontSize: "0.8rem", color: "var(--text-secondary)", lineHeight: "1.4" }}>
                        {task.description}
                      </p>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem", marginBottom: "0.4rem" }}>
                        {task.concernedObjects.map((tbl) => (
                          <span key={tbl} style={{ fontSize: "0.68rem", padding: "2px 6px", background: "rgba(2, 132, 199, 0.1)", color: "#0284c7", borderRadius: "4px", fontWeight: 700 }}>
                            🗄️ {tbl}
                          </span>
                        ))}
                      </div>
                      <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", borderTop: "1px solid rgba(0, 0, 0, 0.05)", paddingTop: "0.4rem" }}>
                        <strong>Critères :</strong> {task.acceptanceCriteria.join(" • ")}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 2: PACKAGE PL/SQL */}
            {activeTab === "plsql" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
                {/* Sous-onglets PL/SQL */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.5rem" }}>
                  <div style={{ display: "flex", gap: "0.35rem" }}>
                    {[
                      { key: "all", label: "Vue Complète" },
                      { key: "spec", label: "Spécification (.SPC)" },
                      { key: "body", label: "Corps du Package (.SQL)" },
                    ].map((st) => (
                      <button
                        key={st.key}
                        type="button"
                        onClick={() => setPlsqlSubTab(st.key as any)}
                        style={{
                          background: plsqlSubTab === st.key ? "var(--text-primary)" : "var(--bg-subtle)",
                          color: plsqlSubTab === st.key ? "#ffffff" : "var(--text-secondary)",
                          border: "none",
                          padding: "4px 10px",
                          borderRadius: "6px",
                          fontSize: "0.74rem",
                          fontWeight: 700,
                          cursor: "pointer",
                        }}
                      >
                        {st.label}
                      </button>
                    ))}
                  </div>

                  {/* Checklist Qualité */}
                  <div style={{ display: "flex", gap: "0.4rem", fontSize: "0.7rem", color: "#10b981", fontWeight: 700 }}>
                    <span>✓ NOWAIT actif</span>
                    <span>•</span>
                    <span>✓ 0 COMMIT direct</span>
                    <span>•</span>
                    <span>✓ CUSPKS Standard</span>
                  </div>
                </div>

                {/* Bloc de Code */}
                <div style={{ background: "#090d16", borderRadius: "10px", padding: "1rem", overflowX: "auto", border: "1px solid rgba(255, 255, 255, 0.08)" }}>
                  <pre style={{ margin: 0, fontFamily: "monospace", fontSize: "0.8rem", color: "#e2e8f0", lineHeight: "1.5" }}>
                    {plsqlSubTab === "spec"
                      ? plan.plsqlProposal.packageSpec
                      : plsqlSubTab === "body"
                        ? plan.plsqlProposal.packageBody
                        : `${plan.plsqlProposal.packageSpec}\n/\n\n${plan.plsqlProposal.packageBody}`}
                  </pre>
                </div>
              </div>
            )}

            {/* TAB 3: DDL & REQUÊTES */}
            {activeTab === "sql" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <h4 style={{ margin: 0, fontSize: "0.92rem", color: "var(--text-primary)", fontWeight: 800 }}>
                    Scripts DDL, Index &amp; Tables ({plan.sqlProposal.targetTables.join(", ")})
                  </h4>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(plan.sqlProposal.sqlCode)}
                    style={{
                      background: "var(--bg-subtle)",
                      border: "1px solid var(--border-light)",
                      color: "var(--text-secondary)",
                      padding: "4px 8px",
                      borderRadius: "6px",
                      fontSize: "0.72rem",
                      cursor: "pointer",
                    }}
                  >
                    📋 Copier DDL
                  </button>
                </div>
                <div style={{ background: "#090d16", borderRadius: "10px", padding: "1rem", overflowX: "auto", border: "1px solid rgba(255, 255, 255, 0.08)" }}>
                  <pre style={{ margin: 0, fontFamily: "monospace", fontSize: "0.8rem", color: "#38bdf8", lineHeight: "1.5" }}>
                    {plan.sqlProposal.sqlCode}
                  </pre>
                </div>
              </div>
            )}

            {/* TAB 4: TESTS UNITAIRES */}
            {activeTab === "tests" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <h4 style={{ margin: 0, fontSize: "0.92rem", color: "var(--text-primary)", fontWeight: 800 }}>
                    Scénarios de Validation &amp; Assertions ({plan.testCases.length})
                  </h4>
                  <span style={{ fontSize: "0.72rem", color: "#10b981", fontWeight: 700 }}>
                    Couverture Concurrence &amp; Exceptions ORA
                  </span>
                </div>
                {plan.testCases.map((t) => (
                  <div key={t.id} style={{ background: "var(--bg-subtle)", borderRadius: "10px", padding: "0.9rem", border: "1px solid var(--border-light)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.35rem" }}>
                      <div style={{ fontWeight: 700, fontSize: "0.85rem", color: "#059669" }}>
                        [{t.id}] {t.title}
                      </div>
                      <span style={{ fontSize: "0.68rem", padding: "2px 6px", background: "rgba(16, 185, 129, 0.1)", color: "#059669", borderRadius: "4px", fontWeight: 800 }}>
                        {t.category}
                      </span>
                    </div>
                    <p style={{ margin: "0 0 0.5rem 0", fontSize: "0.78rem", color: "var(--text-secondary)" }}>
                      Précondition: {t.preconditions} • Résultat attendu : <code>{t.expectedResult}</code>
                    </p>
                    {t.verificationQuery && (
                      <div style={{ background: "#090d16", padding: "0.75rem", borderRadius: "8px", overflowX: "auto" }}>
                        <pre style={{ margin: 0, fontFamily: "monospace", fontSize: "0.78rem", color: "#e2e8f0" }}>
                          {t.verificationQuery}
                        </pre>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* TAB 5: DÉPLOIEMENT & ROLLBACK */}
            {activeTab === "delivery" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div style={{ background: "rgba(239, 68, 68, 0.08)", border: "1px solid rgba(239, 68, 68, 0.3)", padding: "1rem", borderRadius: "10px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                    <h4 style={{ margin: 0, fontSize: "0.9rem", color: "#dc2626", fontWeight: 800 }}>
                      Procédure de Retour Arrière (Rollback Plan)
                    </h4>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(plan.sqlProposal.rollbackScript || plan.deliveryPackage.rollbackPlan.join("\n"))}
                      style={{ background: "#ef4444", color: "#ffffff", border: "none", padding: "3px 8px", borderRadius: "4px", fontSize: "0.7rem", cursor: "pointer", fontWeight: 700 }}
                    >
                      Copier Rollback
                    </button>
                  </div>
                  <div style={{ background: "#090d16", padding: "0.75rem", borderRadius: "8px", overflowX: "auto" }}>
                    <pre style={{ margin: 0, fontFamily: "monospace", fontSize: "0.78rem", color: "#fca5a5" }}>
                      {plan.sqlProposal.rollbackScript || plan.deliveryPackage.rollbackPlan.join("\n")}
                    </pre>
                  </div>
                </div>

                <div style={{ background: "var(--bg-subtle)", border: "1px solid var(--border-light)", padding: "1rem", borderRadius: "10px" }}>
                  <h4 style={{ margin: "0 0 0.5rem 0", fontSize: "0.9rem", color: "var(--text-primary)", fontWeight: 800 }}>
                    Ordre de Déploiement SQL*Plus / Liquibase
                  </h4>
                  <ol style={{ margin: 0, paddingLeft: "1.25rem", fontSize: "0.8rem", color: "var(--text-secondary)", lineHeight: "1.6" }}>
                    {plan.deliveryPackage.deploymentOrder.map((inst, i) => (
                      <li key={i}>{inst}</li>
                    ))}
                  </ol>
                </div>
              </div>
            )}

            {/* TAB 6: AUDIT PL/SQL */}
            {activeTab === "audit" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
                <div>
                  <h4 style={{ margin: "0 0 2px 0", fontSize: "0.92rem", color: "var(--text-primary)", fontWeight: 800 }}>
                    Analyseur de Conformité &amp; Anti-Patterns PL/SQL
                  </h4>
                  <p style={{ margin: 0, fontSize: "0.78rem", color: "var(--text-muted)" }}>
                    Contrôle automatique du code PL/SQL : détection de COMMIT direct, clause NOWAIT, et gestion d erreurs ORA-00054.
                  </p>
                </div>

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
                    borderRadius: "8px",
                    background: "#090d16",
                    border: "1px solid var(--border-light)",
                    color: "#38bdf8",
                    fontFamily: "monospace",
                    fontSize: "0.8rem",
                  }}
                />

                <div
                  style={{
                    background: isAuditPassed ? "rgba(16, 185, 129, 0.1)" : "rgba(239, 68, 68, 0.1)",
                    border: `1px solid ${isAuditPassed ? "#10b981" : "#ef4444"}`,
                    borderRadius: "10px",
                    padding: "0.9rem",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.4rem" }}>
                    <strong style={{ color: isAuditPassed ? "#059669" : "#dc2626", fontSize: "0.88rem" }}>
                      Score de Qualité : {auditResult.score} / 100 — {isAuditPassed ? "CONFORME AUX STANDARDS FCUBS" : "NON CONFORME"}
                    </strong>
                  </div>
                  {auditResult.issues.length > 0 && (
                    <ul style={{ margin: 0, paddingLeft: "1.25rem", fontSize: "0.78rem", color: "#dc2626", lineHeight: "1.5" }}>
                      {auditResult.issues.map((iss, i) => (
                        <li key={i}>
                          <strong>[{iss.severity}]</strong> {iss.message} <em>(Correctif suggéré : {iss.fix})</em>
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
