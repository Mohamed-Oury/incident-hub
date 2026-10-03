"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  DevelopmentNeedInput,
  CopilotFullPlan,
  CopilotProject,
} from "@/modules/cbs/copilot/types";
import { generateCopilotPlan } from "@/modules/cbs/copilot/engine";
import { CBS_SCHEMA_TABLES } from "@/modules/cbs/cbs-advanced-data";
import { GeneroGuiWindow } from "@/modules/cbs/GeneroGuiWindow";
import { parsePerToGuiMockupData } from "@/modules/cbs/cbs-screen-builder";

// Préréglages de besoins bancaires courants
const PRESET_NEEDS: { label: string; icon: string; input: DevelopmentNeedInput }[] = [
  {
    label: "Consultation Solde & Tiers (BKCPT + BKCLI)",
    icon: "💳",
    input: {
      title: "Consultation du solde et dernières opérations compte client",
      functionalDescription:
        "Ajouter une fonctionnalité permettant à un gestionnaire d'agence de rechercher un compte client par agence et numéro de compte, d'afficher son solde disponible (SOL - SIND + DEB) et de consulter ses dernières opérations comptables.",
      bankingDomain: "Comptes & Relation Client",
      targetUsers: "Gestionnaire de compte / Chargé de clientèle agence",
      knownBusinessRules:
        "Contrôle d'existence du compte dans BKCPT, contrôle d'habilitation agence, interdiction de consultation sur compte sous séquestre ou contentieux (ETA='D') sans profil Superviseur.",
      inputData: "Code agence (5 car.) et numéro de compte racine (11 chiffres)",
      specialConstraints: "Temps de réponse inférieur à 300ms, masquage des informations confidentielles non nécessaires",
      amplitudeVersion: "v11.x",
      technicalEnvironment: "Informix / AIX",
    },
  },
  {
    label: "Virement Inter-Comptes (BKCPT + BKTRA)",
    icon: "💸",
    input: {
      title: "Passation d'un virement inter-comptes avec contrôle de provision",
      functionalDescription:
        "Programme de débit du compte donneur d'ordre et crédit du compte bénéficiaire avec vérification temps réel de la provision disponible et écriture dans le journal des mouvements BKTRA.",
      bankingDomain: "Virements & Moyens de Paiement",
      targetUsers: "Agent d'exploitation / Automate d'échanges",
      knownBusinessRules:
        "Solde disponible suffisant (SOL - SIND >= Montant), même devise pour les deux comptes ou appel au module de change, interdiction si compte donneur d'ordre clôturé (ETA='F').",
      inputData: "Compte émetteur, Compte destinataire, Montant, Devise, Motif",
      specialConstraints: "Exécution dans une transaction unique (BEGIN WORK / COMMIT WORK) avec ROLLBACK immédiat en cas d'incident.",
      amplitudeVersion: "v11.x",
      technicalEnvironment: "Informix / AIX",
    },
  },
  {
    label: "Blocage Provision Monétique (BKCPT.SIND)",
    icon: "🏧",
    input: {
      title: "Prise et libération d'une pré-autorisation monétique GAB/TPE",
      functionalDescription:
        "Mise à jour du montant des indisponibilités (SIND) sur BKCPT lors d'une demande d'autorisation ISO 8583 (0100), puis libération ou imputation définitive lors du clearing (0200/0220).",
      bankingDomain: "Monétique & Cartes",
      targetUsers: "Interface Switch Monétique ↔ Core Banking Amplitude",
      knownBusinessRules:
        "Augmenter BKCPT.SIND de la valeur autorisée. Si délai d'expiration de 7 jours dépassé sans présentation de compensation, libérer la provision réservée.",
      inputData: "Identifiant compte BKCPT, Numéro d'autorisation (STAN/RRN), Montant de la réservation",
      specialConstraints: "Latence maximale 120ms pour respecter le SLA Switch monétique.",
      amplitudeVersion: "v11.x",
      technicalEnvironment: "Informix / AIX",
    },
  },
  {
    label: "Batch Arrêté EOD & Grand Livre (BKCOM)",
    icon: "⚙️",
    input: {
      title: "Contrôle de balance générale d'arrêté journalier EOD",
      functionalDescription:
        "Traitement batch nocturne vérifiant l'égalité Débit/Crédit sur les comptes de Grand Livre BKCOM avant autorisation du basculement à J+1 (BOD).",
      bankingDomain: "Comptabilité Générale & EOD",
      targetUsers: "Opérateur de nuit / Responsable de chaîne Batch",
      knownBusinessRules:
        "Somme(SDC) = Somme(SCC) pour chaque devise gérée dans BKDEV. Tolérance d'écart = 0.0000.",
      inputData: "Code devise, Date de journée comptable",
      specialConstraints: "Exécution sans IHM en mode CLI Unix AIX, journalisation détaillée des comptes déséquilibrés.",
      amplitudeVersion: "v11.x",
      technicalEnvironment: "Informix / AIX",
    },
  },
];

const EMPTY_NEED: DevelopmentNeedInput = {
  title: "",
  functionalDescription: "",
  bankingDomain: "",
  targetUsers: "",
  knownBusinessRules: "",
  inputData: "",
  specialConstraints: "",
  amplitudeVersion: "v11.x",
  technicalEnvironment: "Informix / AIX",
  existing4GlFileName: "",
  existing4GlContent: "",
  existingPerFileName: "",
  existingPerContent: "",
};

interface DockerHealth {
  status: "ok" | "down" | "checking";
  llmProvider?: string;
  llmModel?: string;
}

interface AgentSession {
  name: string;
  version: number;
  decision: "EN_ATTENTE" | "REFUSEE" | "ACCEPTEE";
  history: Array<{
    version: number;
    decision: string;
    reason?: string | null;
    createdAt?: string;
  }>;
}

export default function CbsCopilotPage() {
  const [activeTab, setActiveTab] = useState<
    "NEED" | "TASKS" | "CODE" | "PER_SCREEN" | "SQL"
  >("NEED");
  const [perScreenSubTab, setPerScreenSubTab] = useState<
    "GUI_COMPILER" | "SOURCE_CODE" | "ASCII_MOCKUP"
  >("GUI_COMPILER");

  // Formulaire Saisie du besoin (Vide par défaut, aucune donnée d'exemple pré-remplie)
  const [needInput, setNeedInput] = useState<DevelopmentNeedInput>(EMPTY_NEED);
  const [generatedPlan, setGeneratedPlan] = useState<CopilotFullPlan | null>(null);

  // Projets enregistrés & Persistance
  const [savedProjects, setSavedProjects] = useState<CopilotProject[]>([]);
  const [showProjectsModal, setShowProjectsModal] = useState<boolean>(false);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // État de l'agent Docker (:8080)
  const [dockerHealth, setDockerHealth] = useState<DockerHealth>({ status: "checking" });
  const [agentLoading, setAgentLoading] = useState<boolean>(false);
  const [agentStepMessage, setAgentStepMessage] = useState<string>("");
  const [agentError, setAgentError] = useState<string | null>(null);
  const [agentSession, setAgentSession] = useState<AgentSession | null>(null);

  // Modal de refus / Human-in-the-loop
  const [showRejectModal, setShowRejectModal] = useState<boolean>(false);
  const [rejectReason, setRejectReason] = useState<string>("");
  const [isRejecting, setIsRejecting] = useState<boolean>(false);
  const [isValidating, setIsValidating] = useState<boolean>(false);
  const [isGeneratingCode, setIsGeneratingCode] = useState<boolean>(false);
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);
  const [showHistoryAccordion, setShowHistoryAccordion] = useState<boolean>(false);

  // Vérifier la disponibilité de l'agent Docker (:8080)
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

  // Charger les projets enregistrés depuis l'API et le localStorage
  useEffect(() => {
    async function fetchSavedProjects() {
      try {
        const res = await fetch("/api/cbs/copilot");
        if (res.ok) {
          const data = await res.json();
          if (data.projects && Array.isArray(data.projects)) {
            setSavedProjects(data.projects);
            return;
          }
        }
      } catch (e) {
        console.warn("Échec lecture API copilot, bascule sur localStorage:", e);
      }

      // Fallback localStorage (filtrer les écrans .per et vérifier l'intégrité)
      try {
        const local = localStorage.getItem("cbs_copilot_projects");
        if (local) {
          const parsed = JSON.parse(local);
          if (Array.isArray(parsed)) {
            const valid = parsed.filter(
              (p: any) =>
                p &&
                !p.input?.isPerScreen &&
                !p.isPerScreen &&
                p.plan &&
                p.plan.analysis &&
                p.plan.code4GlProposal
            );
            setSavedProjects(valid);
          }
        }
      } catch (err) {
        console.error("Erreur localStorage:", err);
      }
    }
    fetchSavedProjects();
  }, []);

  // Génération du plan local
  const handleGeneratePlan = () => {
    const plan = generateCopilotPlan(needInput);
    setGeneratedPlan(plan);
    setActiveTab("TASKS");
  };

  // Workflow Agent IA (Docker :8080)
  const handleRunAgenticWorkflow = async () => {
    if (!needInput.title.trim()) {
      alert("Veuillez renseigner au moins un titre pour le besoin.");
      return;
    }
    setAgentLoading(true);
    setAgentError(null);
    setActionFeedback(null);
    setAgentStepMessage("1/2 — Envoi du besoin & construction du prompt système (POST /api/v1/prompts/generate)...");

    try {
      // Découpage propre des données en entrée
      const inputDataArray = needInput.inputData
        ? needInput.inputData
            .split(/[\n,;]+/)
            .map((s) => s.trim())
            .filter(Boolean)
        : ["Compte à débiter", "Compte à créditer", "Montant"];

      // Préparation du payload exact pour l'agent
      const promptPayload: Record<string, any> = {
        amplitudeVersion: needInput.amplitudeVersion.replace(".x", ""), // e.g. "v11"
        bankingDomain: needInput.bankingDomain || "Virements & Moyens de Paiement",
        functionalDescription: needInput.functionalDescription || needInput.title,
        inputData: inputDataArray.length > 0 ? inputDataArray : ["Paramètres par défaut"],
        knownBusinessRules:
          needInput.knownBusinessRules ||
          "Contrôle d'existence des comptes dans BKCPT, contrôle du solde disponible et mise à jour de BKTRA.",
        targetUsers: needInput.targetUsers || "Agents de guichet et chargés de clientèle",
        technicalEnvironment: needInput.technicalEnvironment || "Informix-4GL 7.50 sur AIX, base Informix",
        title: needInput.title,
      };

      // Inclure les fichiers 4GL et PER uniquement s'ils sont renseignés
      if (needInput.existing4GlContent && needInput.existing4GlContent.trim()) {
        promptPayload.existing4GlFileName = needInput.existing4GlFileName || "programme.4gl";
        promptPayload.existing4GlContent = needInput.existing4GlContent;
      }

      if (needInput.existingPerContent && needInput.existingPerContent.trim()) {
        promptPayload.existingPerFileName = needInput.existingPerFileName || "ecran.per";
        promptPayload.existingPerContent = needInput.existingPerContent;
      }

      const promptRes = await fetch("/api/cbs/agentic/prompts/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(promptPayload),
      });

      if (!promptRes.ok) {
        const err = await promptRes.json().catch(() => ({}));
        throw new Error(err.detail || err.error || "Erreur lors de la génération du prompt agent.");
      }

      const promptData = await promptRes.json();
      const slugName = promptData.name;

      setAgentStepMessage(`2/2 — Analyse et décomposition en sous-tâches par le LLM (${slugName})...`);

      // Étape 2: POST /api/v1/analyses/{name}
      let analysisRes = await fetch(`/api/cbs/agentic/analyses/${slugName}`, {
        method: "POST",
      });

      let analysisData: any = null;
      let historyData: any[] = [];

      if (analysisRes.status === 409) {
        // Une analyse existe déjà -> récupération directe avec historique complet
        const getRes = await fetch(`/api/cbs/agentic/analyses/${slugName}`);
        if (!getRes.ok) {
          throw new Error("Impossible de récupérer l'analyse existante pour ce besoin.");
        }
        const existingHistory = await getRes.json();
        analysisData = existingHistory.latest;
        historyData = existingHistory.history || [];
      } else if (!analysisRes.ok) {
        const err = await analysisRes.json().catch(() => ({}));
        throw new Error(err.detail || err.error || "Erreur lors de l'analyse par l'agent IA.");
      } else {
        analysisData = await analysisRes.json();
        historyData = [
          {
            version: analysisData.version,
            decision: analysisData.decision,
            reason: null,
            createdAt: new Date().toISOString(),
          },
        ];
      }

      // Mise à jour de la session agent
      setAgentSession({
        name: slugName,
        version: analysisData.version,
        decision: analysisData.decision,
        history: historyData,
      });

      // Consolidation avec le plan complet
      const basePlan = generateCopilotPlan(needInput);
      const mergedPlan: CopilotFullPlan = {
        ...basePlan,
        need: needInput,
        analysis: {
          summary: analysisData.analysis?.summary || basePlan.analysis.summary,
          businessObjective: analysisData.analysis?.businessObjective || basePlan.analysis.businessObjective,
          actors: analysisData.analysis?.actors || basePlan.analysis.actors,
          preconditions: analysisData.analysis?.preconditions || basePlan.analysis.preconditions,
          postconditions: analysisData.analysis?.postconditions || basePlan.analysis.postconditions,
          businessRules: analysisData.analysis?.businessRules || basePlan.analysis.businessRules,
          requiredData: analysisData.analysis?.requiredData || basePlan.analysis.requiredData,
          cbsDependencies: analysisData.analysis?.cbsDependencies || basePlan.analysis.cbsDependencies,
          unresolvedQuestions: analysisData.analysis?.unresolvedQuestions || basePlan.analysis.unresolvedQuestions,
          technicalRisks: analysisData.analysis?.technicalRisks || basePlan.analysis.technicalRisks,
        },
        subTasks: (analysisData.subTasks || []).map((st: any) => ({
          id: st.id,
          title: st.title,
          description: st.description,
          type: st.type,
          priority: st.priority,
          dependencies: st.dependencies || [],
          estimation: st.estimation || "0.5 jour",
          inputs: st.inputs || "",
          outputs: st.outputs || "",
          acceptanceCriteria: st.acceptanceCriteria || [],
          concernedFiles: st.concernedFiles || [],
          status: st.status || "A_VALIDER",
        })),
      };

      setGeneratedPlan(mergedPlan);
      setActiveTab("TASKS");
      setActionFeedback("✨ Analyse et sous-tâches produites avec succès par l'Agent Docker (:8080) !");
      setTimeout(() => setActionFeedback(null), 5000);
    } catch (err: any) {
      console.error("Erreur Agentic:", err);
      setAgentError(err.message || "Erreur de communication avec l'agent Docker.");
    } finally {
      setAgentLoading(false);
      setAgentStepMessage("");
    }
  };

  // Validation / Acceptation Human-in-the-loop
  const handleAcceptAnalysis = async () => {
    if (!agentSession) return;
    setIsValidating(true);
    setAgentError(null);
    try {
      const res = await fetch(`/api/cbs/agentic/analyses/${agentSession.name}/accept`, {
        method: "POST",
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || err.error || "Échec de validation de l'analyse.");
      }
      const updated = await res.json();
      setAgentSession((prev) =>
        prev
          ? {
              ...prev,
              decision: "ACCEPTEE",
              history: [
                ...prev.history.filter((h) => h.version !== updated.version),
                {
                  version: updated.version,
                  decision: "ACCEPTEE",
                  reason: null,
                  createdAt: new Date().toISOString(),
                },
              ],
            }
          : null
      );

      // Mettre à jour les sous-tâches en statut VALIDE
      setGeneratedPlan((prev) => ({
        ...prev,
        subTasks: prev.subTasks.map((t) => ({ ...t, status: "VALIDE" })),
      }));
      setActionFeedback("✅ Analyse acceptée et sous-tâches validées avec succès !");
      setTimeout(() => setActionFeedback(null), 4000);
    } catch (err: any) {
      setAgentError(err.message || "Erreur lors de la validation.");
    } finally {
      setIsValidating(false);
    }
  };

  // Génération du code 4GL & écran .per via l'Agent Code (Brique 3 - POST /api/v1/code/{name})
  const handleGenerateAgentCode = async () => {
    if (!agentSession) return;
    setIsGeneratingCode(true);
    setAgentError(null);
    try {
      const res = await fetch(`/api/cbs/agentic/code/${agentSession.name}`, {
        method: "POST",
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || err.error || "Échec de la génération de code 4GL & .per par l'agent.");
      }
      const codeResult = await res.json();

      setGeneratedPlan((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          code4GlProposal: {
            ...prev.code4GlProposal,
            code4Gl: codeResult.code4Gl || prev.code4GlProposal?.code4Gl || "",
            programObjective: codeResult.explanation || prev.code4GlProposal?.programObjective || "",
          },
          perScreen: codeResult.codePer
            ? {
                ...(prev.perScreen || {
                  screenName: codeResult.screenName || "ecran.per",
                  title: "Écran d'affichage & saisie web Genero",
                  screenType: "Web GUI (GRID Layout)",
                  dimensions: "Interactive Responsive Web",
                  inputFieldList: [],
                  readOnlyFieldList: [],
                  buttons: ["VALIDER", "ANNULER"],
                  messages: [],
                  perCodeSnippet: "",
                  visualMockupAscii: "",
                  amplitudeIntegrationNotes: [],
                }),
                screenName: codeResult.screenName || prev.perScreen?.screenName || "ecran.per",
                perCodeSnippet: codeResult.codePer,
              }
            : prev.perScreen,
        };
      });

      setActiveTab("CODE");
      setActionFeedback("🚀 Code Informix 4GL et Écran Web (.per) générés avec succès par l'Agent IA (Brique 3) !");
      setTimeout(() => setActionFeedback(null), 5000);
    } catch (err: any) {
      console.error("Erreur Génération Code Agent:", err);
      setAgentError(err.message || "Erreur lors de la génération du code.");
    } finally {
      setIsGeneratingCode(false);
    }
  };

  // Rejet / Demande de révision Human-in-the-loop
  const handleRejectAnalysis = async () => {
    if (!agentSession) return;
    if (!rejectReason.trim() || rejectReason.trim().length < 10) {
      alert("Veuillez fournir un motif de refus explicatif d'au moins 10 caractères.");
      return;
    }
    setIsRejecting(true);
    setAgentError(null);
    try {
      const res = await fetch(`/api/cbs/agentic/analyses/${agentSession.name}/reject`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason: rejectReason.trim() }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || err.error || "Échec du refus de l'analyse.");
      }

      const updated = await res.json();
      setAgentSession((prev) =>
        prev
          ? {
              ...prev,
              version: updated.version,
              decision: "EN_ATTENTE",
              history: [
                ...prev.history,
                {
                  version: prev.version,
                  decision: "REFUSEE",
                  reason: rejectReason.trim(),
                  createdAt: new Date().toISOString(),
                },
              ],
            }
          : null
      );

      // Intégration de la nouvelle version produite par l'agent
      setGeneratedPlan((prev) => ({
        ...prev,
        analysis: {
          summary: updated.analysis?.summary || prev.analysis.summary,
          businessObjective: updated.analysis?.businessObjective || prev.analysis.businessObjective,
          actors: updated.analysis?.actors || prev.analysis.actors,
          preconditions: updated.analysis?.preconditions || prev.analysis.preconditions,
          postconditions: updated.analysis?.postconditions || prev.analysis.postconditions,
          businessRules: updated.analysis?.businessRules || prev.analysis.businessRules,
          requiredData: updated.analysis?.requiredData || prev.analysis.requiredData,
          cbsDependencies: updated.analysis?.cbsDependencies || prev.analysis.cbsDependencies,
          unresolvedQuestions: updated.analysis?.unresolvedQuestions || prev.analysis.unresolvedQuestions,
          technicalRisks: updated.analysis?.technicalRisks || prev.analysis.technicalRisks,
        },
        subTasks: (updated.subTasks || []).map((st: any) => ({
          id: st.id,
          title: st.title,
          description: st.description,
          type: st.type,
          priority: st.priority,
          dependencies: st.dependencies || [],
          estimation: st.estimation || "0.5 jour",
          inputs: st.inputs || "",
          outputs: st.outputs || "",
          acceptanceCriteria: st.acceptanceCriteria || [],
          concernedFiles: st.concernedFiles || [],
          status: st.status || "A_VALIDER",
        })),
      }));

      setShowRejectModal(false);
      setRejectReason("");
      setActionFeedback(`🔄 Nouvelle version v${updated.version} régénérée par l'agent suite à votre retour !`);
      setTimeout(() => setActionFeedback(null), 5000);
    } catch (err: any) {
      setAgentError(err.message || "Erreur lors du rejet de l'analyse.");
    } finally {
      setIsRejecting(false);
    }
  };

  // Sélection d'un préréglage : remplit le formulaire sans forcer de plan par défaut
  const handleSelectPreset = (preset: typeof PRESET_NEEDS[0]) => {
    setNeedInput(preset.input);
  };

  // Sauvegarder le projet en cours (API + LocalStorage)
  const handleSaveProject = async () => {
    if (!safePlan) {
      alert("Veuillez d'abord analyser ou découper un besoin avant d'enregistrer le projet.");
      return;
    }
    setSaveStatus("Enregistrement en cours...");
    const project: CopilotProject = {
      id: "PROJ-" + Date.now(),
      name: needInput.title || safePlan.need.title,
      domain: needInput.bankingDomain || safePlan.need.bankingDomain,
      amplitudeVersion: needInput.amplitudeVersion || safePlan.need.amplitudeVersion,
      input: needInput,
      plan: safePlan,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      const res = await fetch("/api/cbs/copilot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ project }),
      });

      if (res.ok) {
        const data = await res.json();
        setSavedProjects((prev) => [data.project || project, ...prev.filter((p) => p.id !== project.id)]);
      } else {
        setSavedProjects((prev) => [project, ...prev.filter((p) => p.id !== project.id)]);
      }
    } catch (err) {
      setSavedProjects((prev) => [project, ...prev.filter((p) => p.id !== project.id)]);
    }

    try {
      const updated = [project, ...savedProjects.filter((p) => p.id !== project.id)];
      localStorage.setItem("cbs_copilot_projects", JSON.stringify(updated));
    } catch (err) {
      console.warn("Erreur écriture localStorage:", err);
    }

    setSaveStatus("✅ Projet enregistré avec succès !");
    setTimeout(() => setSaveStatus(null), 3500);
  };

  // Charger un projet sauvegardé
  const handleLoadProject = (proj: CopilotProject) => {
    setNeedInput(proj.input);
    if (proj.plan && proj.plan.analysis && Array.isArray(proj.plan.subTasks)) {
      setGeneratedPlan(proj.plan);
    } else {
      setGeneratedPlan(generateCopilotPlan(proj.input || EMPTY_NEED));
    }
    setShowProjectsModal(false);
    setActiveTab("TASKS");
  };

  // Supprimer un projet
  const handleDeleteProject = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await fetch(`/api/cbs/copilot?id=${id}`, { method: "DELETE" });
    } catch (err) {
      console.warn("Suppression API échouée, suppression locale");
    }
    const updated = savedProjects.filter((p) => p.id !== id);
    setSavedProjects(updated);
    try {
      localStorage.setItem("cbs_copilot_projects", JSON.stringify(updated));
    } catch (err) {}
  };

  // Téléchargement d'un fichier texte
  const downloadFile = (content: string, filename: string, mimeType = "text/plain") => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Copie dans le presse-papier avec feedback
  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Export complet du dossier markdown
  const handleExportFullDossier = () => {
    if (!safePlan) {
      alert("Aucune analyse ni tâche n'a encore été générée pour l'export.");
      return;
    }
    const p = safePlan;
    const markdown = `# DOSSIER COMPLET DE DÉVELOPPEMENT CBS AMPLITUDE
## MODULE : CBS 4GL DEVELOPMENT COPILOT
**Titre :** ${p.need.title}  
**Domaine :** ${p.need.bankingDomain} | **Version Amplitude :** ${p.need.amplitudeVersion}  
**Environnement :** ${p.need.technicalEnvironment}  
**Date de génération :** ${new Date(p.generatedDate).toLocaleString("fr-FR")}  
**Règle d'or :** Proposition technique alignée sur les tables maîtresses Amplitude (BKCPT, BKCLI, BKTRA, BKCOM). À tester et valider en environnement de recette avant livraison en production.

---

### 1. SYNTHÈSE & ANALYSE FONCTIONNELLE
- **Objectif :** ${p.analysis.businessObjective}
- **Acteurs :** ${p.analysis.actors.join(", ")}
- **Préconditions :** ${p.analysis.preconditions.join(" / ")}
- **Règles Métier :**
${p.analysis.businessRules.map((r) => `  * ${r}`).join("\n")}
- **Points de vigilance :**
${p.analysis.unresolvedQuestions.map((q) => `  ! ${q}`).join("\n")}

---

### 2. PLAN DE DÉVELOPPEMENT & SOUS-TÂCHES
${p.subTasks
  .map(
    (t) => `#### [${t.id}] ${t.title} (${t.type} - Priorité: ${t.priority})
- **Description :** ${t.description}
- **Estimation :** ${t.estimation} | **Fichiers :** ${t.concernedFiles.join(", ")}
- **Critères d'acceptation :** ${t.acceptanceCriteria.join(" ; ")}`
  )
  .join("\n\n")}

---

### 3. PROPOSITION DE CODE INFORMIX 4GL
\`\`\`informix
${p.code4GlProposal.code4Gl}
\`\`\`

---

### 4. REQUÊTES SQL OPTIMISÉES SGBD
\`\`\`sql
${p.sqlProposal.sqlCode}
\`\`\`

---

${
  p.perScreen
    ? `### 5. CONCEPTION DE L'ÉCRAN FORMULAIRE (.PER)
**Nom du masque :** \`${p.perScreen.screenName}\`  
**Dimensions :** ${p.perScreen.dimensions}  
**Maquette Visuelle :**
\`\`\`text
${p.perScreen.visualMockupAscii}
\`\`\`
**Source .per :**
\`\`\`text
${p.perScreen.perCodeSnippet}
\`\`\`
---`
    : ""
}

### 6. PLAN DE TESTS UNITAIRES
${p.testCases
  .map(
    (tc) => `* **[${tc.id}] ${tc.title}** (${tc.category})
  - Préconditions : ${tc.preconditions}
  - Résultat attendu : ${tc.expectedResult}`
  )
  .join("\n")}

---

### 7. DOSSIER DE LIVRAISON & PLAN DE ROLLBACK
- **Fichiers modifiés :** ${p.deliveryPackage.modifiedFiles.join(", ")}
- **Ordre d'installation :**
${p.deliveryPackage.installationOrder.map((s) => `  ${s}`).join("\n")}
- **Plan de Rollback Immédiat :**
${p.deliveryPackage.rollbackPlan.map((r) => `  ${r}`).join("\n")}
`;

    downloadFile(markdown, `DOSSIER_DEV_CBS_${p.need.title.replace(/\s+/g, "_")}.md`, "text/markdown");
  };

  const safePlan =
    generatedPlan &&
    generatedPlan.analysis &&
    generatedPlan.code4GlProposal &&
    generatedPlan.sqlProposal &&
    Array.isArray(generatedPlan.subTasks)
      ? generatedPlan
      : null;

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f8fafc",
        color: "#0f172a",
        fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        display: "flex",
        flexDirection: "column",
        overflowX: "hidden",
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      {/* ========================================================================= */}
      {/* 1. TOPBAR CLAIRE : RETOUR CBS, BRANDING, STATUS BD, ACTIONS DE PERSISTANCE */}
      {/* ========================================================================= */}
      <header
        style={{
          minHeight: "64px",
          backgroundColor: "#ffffff",
          borderBottom: "1px solid #e2e8f0",
          padding: "0.75rem 1.5rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "1rem",
          position: "sticky",
          top: 0,
          zIndex: 100,
          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
          boxSizing: "border-box",
          width: "100%",
        }}
      >
        {/* Bouton de retour vers CBS Amplitude & Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
          <Link
            href="/cbs"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.45rem 0.9rem",
              backgroundColor: "#f1f5f9",
              color: "#0284c7",
              border: "1px solid #cbd5e1",
              borderRadius: "8px",
              fontSize: "0.85rem",
              fontWeight: 700,
              textDecoration: "none",
              transition: "all 0.15s ease",
            }}
            title="Quitter l'atelier et revenir au portail Core Banking Amplitude"
          >
            <span style={{ fontSize: "1.1rem" }}>←</span>
            <span>Retour CBS Amplitude</span>
          </Link>

          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
            <span style={{ fontSize: "1.6rem" }}>🤖</span>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
                <span style={{ fontWeight: 800, fontSize: "1.05rem", color: "#0f172a" }}>
                  CBS 4GL Development Copilot
                </span>
                <span
                  style={{
                    backgroundColor: "#eff6ff",
                    color: "#1d4ed8",
                    border: "1px solid #bfdbfe",
                    fontSize: "0.68rem",
                    fontWeight: 700,
                    padding: "2px 8px",
                    borderRadius: "6px",
                    textTransform: "uppercase",
                  }}
                >
                  Studio Dédié
                </span>
              </div>
              <div style={{ fontSize: "0.75rem", color: "#64748b" }}>
                Amplitude v11 / v12 • Informix 4GL &amp; Oracle SGBD • Conception &amp; Build
              </div>
            </div>
          </div>
        </div>

        {/* Indicateur SGBD & Actions projet */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", flexWrap: "wrap" }}>
          {/* Badge BD active */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.45rem",
              backgroundColor: "#ecfdf5",
              border: "1px solid #a7f3d0",
              borderRadius: "6px",
              padding: "0.4rem 0.75rem",
              fontSize: "0.75rem",
              color: "#047857",
              fontWeight: 600,
            }}
            title="Dictionnaire des 220 tables Amplitude connecté"
          >
            <span style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#10b981" }} />
            <span>Dictionnaire BK* Connecté ({CBS_SCHEMA_TABLES.length} tables)</span>
          </div>

          {/* Badge Agent Docker :8080 */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.45rem",
              backgroundColor: dockerHealth.status === "ok" ? "#eff6ff" : dockerHealth.status === "checking" ? "#fefce8" : "#fef2f2",
              border: `1px solid ${
                dockerHealth.status === "ok" ? "#bfdbfe" : dockerHealth.status === "checking" ? "#fef08a" : "#fecaca"
              }`,
              borderRadius: "6px",
              padding: "0.4rem 0.75rem",
              fontSize: "0.75rem",
              color:
                dockerHealth.status === "ok" ? "#1e40af" : dockerHealth.status === "checking" ? "#854d0e" : "#991b1b",
              fontWeight: 600,
            }}
            title={
              dockerHealth.status === "ok"
                ? `Agent IA Docker opérationnel sur :8080 (${dockerHealth.llmModel})`
                : dockerHealth.status === "checking"
                ? "Connexion à http://localhost:8080 en cours..."
                : "Agent Docker injoignable sur http://localhost:8080"
            }
          >
            <span
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                backgroundColor:
                  dockerHealth.status === "ok"
                    ? "#3b82f6"
                    : dockerHealth.status === "checking"
                    ? "#eab308"
                    : "#ef4444",
              }}
            />
            <span>
              {dockerHealth.status === "ok"
                ? `Agent Docker Connecté (${dockerHealth.llmModel})`
                : dockerHealth.status === "checking"
                ? "Agent Docker (Vérification...)"
                : "Agent Docker Déconnecté (:8080)"}
            </span>
          </div>

          {/* Bouton Mes Projets */}
          <button
            onClick={() => setShowProjectsModal(true)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
              backgroundColor: "#ffffff",
              color: "#334155",
              border: "1px solid #cbd5e1",
              borderRadius: "6px",
              padding: "0.45rem 0.85rem",
              fontSize: "0.82rem",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            <span>📂</span>
            <span>Mes Projets ({savedProjects.length})</span>
          </button>

          {/* Bouton Sauvegarder Projet */}
          <button
            onClick={handleSaveProject}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
              backgroundColor: "#0284c7",
              color: "#ffffff",
              border: "none",
              borderRadius: "6px",
              padding: "0.45rem 0.85rem",
              fontSize: "0.82rem",
              fontWeight: 600,
              cursor: "pointer",
              boxShadow: "0 1px 2px rgba(2, 132, 199, 0.2)",
            }}
          >
            <span>💾</span>
            <span>Sauvegarder (BD)</span>
          </button>

          {/* Bouton Export Dossier */}
          <button
            onClick={handleExportFullDossier}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
              backgroundColor: "#4f46e5",
              color: "#ffffff",
              border: "none",
              borderRadius: "6px",
              padding: "0.45rem 0.85rem",
              fontSize: "0.82rem",
              fontWeight: 600,
              cursor: "pointer",
              boxShadow: "0 1px 2px rgba(79, 70, 229, 0.2)",
            }}
          >
            <span>📦</span>
            <span>Dossier (.md)</span>
          </button>
        </div>
      </header>

      {/* Notification Toast de Sauvegarde */}
      {saveStatus && (
        <div
          style={{
            position: "fixed",
            top: "76px",
            right: "24px",
            zIndex: 999,
            backgroundColor: "#047857",
            border: "1px solid #059669",
            color: "#ffffff",
            padding: "0.6rem 1.2rem",
            borderRadius: "8px",
            fontSize: "0.85rem",
            fontWeight: 600,
            boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
          }}
        >
          {saveStatus}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. BARRE D'ONGLETS RESPONSIVE (AVEC RETOUR À LA LIGNE POUR ÉVITER LE DÉPASSEMENT) */}
      {/* ========================================================================= */}
      <nav
        style={{
          backgroundColor: "#ffffff",
          borderBottom: "1px solid #e2e8f0",
          padding: "0.6rem 1.5rem",
          display: "flex",
          flexWrap: "wrap",
          gap: "0.45rem",
          boxSizing: "border-box",
          width: "100%",
        }}
      >
        {[
          { key: "NEED", label: "1. Besoin Métier", icon: "📝" },
          { key: "TASKS", label: "2. Analyse & Tâches", icon: "📋" },
          { key: "CODE", label: "3. Code Informix 4GL", icon: "💻" },
          { key: "PER_SCREEN", label: "4. Écran Masque (.per)", icon: "🖥️" },
          { key: "SQL", label: "5. Requêtes SQL & Index", icon: "🗄️" },
        ].map((tab) => {
          const isActive = activeTab === tab.key;
          const bg = isActive ? "#0284c7" : "#f8fafc";
          const color = isActive ? "#ffffff" : "#475569";
          const border = isActive ? "1px solid #0284c7" : "1px solid #e2e8f0";

          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.4rem",
                padding: "0.45rem 0.85rem",
                borderRadius: "6px",
                border,
                fontSize: "0.82rem",
                fontWeight: isActive ? 700 : 600,
                backgroundColor: bg,
                color,
                cursor: "pointer",
                transition: "all 0.15s ease",
                whiteSpace: "nowrap",
                boxShadow: isActive ? "0 2px 4px rgba(2,132,199,0.2)" : "none",
              }}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          );
        })}
      </nav>

      {/* ========================================================================= */}
      {/* 3. CORPS DE L'ESPACE DE TRAVAIL (THEME CLAIR SANS AUCUN DÉPASSEMENT) */}
      {/* ========================================================================= */}
      <main
        style={{
          flex: 1,
          padding: "1.5rem",
          maxWidth: "1600px",
          width: "100%",
          margin: "0 auto",
          boxSizing: "border-box",
          overflowX: "hidden",
        }}
      >
        {/* --------------------------------------------------------------------- */}
        {/* ONGLET 1 : EXPRESSION DU BESOIN AVEC PRÉRÉGLAGES BANCAIRES */}
        {/* --------------------------------------------------------------------- */}
        {activeTab === "NEED" && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))", gap: "1.5rem", width: "100%", boxSizing: "border-box" }}>
            {/* Formulaire de saisie */}
            <div
              style={{
                backgroundColor: "#ffffff",
                borderRadius: "12px",
                border: "1px solid #e2e8f0",
                padding: "1.5rem",
                boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
                minWidth: 0,
                boxSizing: "border-box",
              }}
            >
              <div style={{ marginBottom: "1rem" }}>
                <h3 style={{ fontSize: "1.2rem", fontWeight: 700, margin: 0, color: "#0f172a" }}>
                  Paramètres du Besoin Métier Core Banking
                </h3>
                <p style={{ fontSize: "0.85rem", color: "#64748b", margin: "4px 0 0 0" }}>
                  Précisez le besoin fonctionnel. Le Copilot générera le code 4GL, le masque .per et les requêtes SQL correspondants.
                </p>
              </div>

              {/* Barre de pré-réglages rapides */}
              <div style={{ marginBottom: "1.25rem" }}>
                <span style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "#64748b", fontWeight: 700 }}>
                  MODÈLES PRÉDÉFINIS AMPLITUDE :
                </span>
                <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginTop: "0.4rem" }}>
                  {PRESET_NEEDS.map((preset, idx) => {
                    const isSelected = needInput.title === preset.input.title;
                    return (
                      <button
                        key={idx}
                        onClick={() => handleSelectPreset(preset)}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "0.35rem",
                          padding: "0.35rem 0.75rem",
                          backgroundColor: isSelected ? "#eff6ff" : "#f8fafc",
                          color: isSelected ? "#1d4ed8" : "#334155",
                          border: isSelected ? "1px solid #3b82f6" : "1px solid #e2e8f0",
                          borderRadius: "6px",
                          fontSize: "0.78rem",
                          fontWeight: isSelected ? 700 : 500,
                          cursor: "pointer",
                        }}
                      >
                        <span>{preset.icon}</span>
                        <span>{preset.label}</span>
                      </button>
                    );
                  })}
                  <button
                    onClick={() => {
                      setNeedInput(EMPTY_NEED);
                      setGeneratedPlan(generateCopilotPlan(EMPTY_NEED));
                    }}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.35rem",
                      padding: "0.35rem 0.75rem",
                      backgroundColor: "#fff1f2",
                      color: "#be123c",
                      border: "1px dashed #f43f5e",
                      borderRadius: "6px",
                      fontSize: "0.78rem",
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                    title="Vider tous les champs d'expression du besoin"
                  >
                    <span>🗑️</span>
                    <span>Vider les champs</span>
                  </button>
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "1rem", width: "100%", boxSizing: "border-box" }}>
                <div>
                  <label style={{ fontSize: "0.82rem", fontWeight: 600, color: "#334155", display: "block", marginBottom: "4px" }}>
                    Titre du besoin ou de la User Story *
                  </label>
                  <input
                    type="text"
                    value={needInput.title}
                    onChange={(e) => setNeedInput({ ...needInput, title: e.target.value })}
                    style={{
                      width: "100%",
                      backgroundColor: "#ffffff",
                      border: "1px solid #cbd5e1",
                      borderRadius: "6px",
                      padding: "0.6rem 0.8rem",
                      color: "#0f172a",
                      fontSize: "0.88rem",
                      boxSizing: "border-box",
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: "0.82rem", fontWeight: 600, color: "#334155", display: "block", marginBottom: "4px" }}>
                    Description fonctionnelle détaillée *
                  </label>
                  <textarea
                    rows={4}
                    value={needInput.functionalDescription}
                    onChange={(e) => setNeedInput({ ...needInput, functionalDescription: e.target.value })}
                    style={{
                      width: "100%",
                      backgroundColor: "#ffffff",
                      border: "1px solid #cbd5e1",
                      borderRadius: "6px",
                      padding: "0.6rem 0.8rem",
                      color: "#0f172a",
                      fontSize: "0.88rem",
                      fontFamily: "inherit",
                      boxSizing: "border-box",
                    }}
                  />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1rem", width: "100%" }}>
                  <div style={{ minWidth: 0 }}>
                    <label style={{ fontSize: "0.82rem", fontWeight: 600, color: "#334155", display: "block", marginBottom: "4px" }}>
                      Domaine Métier Amplitude
                    </label>
                    <input
                      type="text"
                      value={needInput.bankingDomain}
                      onChange={(e) => setNeedInput({ ...needInput, bankingDomain: e.target.value })}
                      style={{
                        width: "100%",
                        backgroundColor: "#ffffff",
                        border: "1px solid #cbd5e1",
                        borderRadius: "6px",
                        padding: "0.55rem 0.75rem",
                        color: "#0f172a",
                        fontSize: "0.85rem",
                        boxSizing: "border-box",
                      }}
                    />
                  </div>

                  <div style={{ minWidth: 0 }}>
                    <label style={{ fontSize: "0.82rem", fontWeight: 600, color: "#334155", display: "block", marginBottom: "4px" }}>
                      Profils Utilisateurs Cibles
                    </label>
                    <input
                      type="text"
                      value={needInput.targetUsers}
                      onChange={(e) => setNeedInput({ ...needInput, targetUsers: e.target.value })}
                      style={{
                        width: "100%",
                        backgroundColor: "#ffffff",
                        border: "1px solid #cbd5e1",
                        borderRadius: "6px",
                        padding: "0.55rem 0.75rem",
                        color: "#0f172a",
                        fontSize: "0.85rem",
                        boxSizing: "border-box",
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: "0.82rem", fontWeight: 600, color: "#334155", display: "block", marginBottom: "4px" }}>
                    Règles Métier connues &amp; Contrôles de Sécurité
                  </label>
                  <textarea
                    rows={2}
                    value={needInput.knownBusinessRules}
                    onChange={(e) => setNeedInput({ ...needInput, knownBusinessRules: e.target.value })}
                    style={{
                      width: "100%",
                      backgroundColor: "#ffffff",
                      border: "1px solid #cbd5e1",
                      borderRadius: "6px",
                      padding: "0.55rem 0.75rem",
                      color: "#0f172a",
                      fontSize: "0.85rem",
                      boxSizing: "border-box",
                    }}
                  />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1rem", width: "100%" }}>
                  <div style={{ minWidth: 0 }}>
                    <label style={{ fontSize: "0.82rem", fontWeight: 600, color: "#334155", display: "block", marginBottom: "4px" }}>
                      Données en Entrée
                    </label>
                    <input
                      type="text"
                      value={needInput.inputData}
                      onChange={(e) => setNeedInput({ ...needInput, inputData: e.target.value })}
                      style={{
                        width: "100%",
                        backgroundColor: "#ffffff",
                        border: "1px solid #cbd5e1",
                        borderRadius: "6px",
                        padding: "0.55rem 0.75rem",
                        color: "#0f172a",
                        fontSize: "0.85rem",
                        boxSizing: "border-box",
                      }}
                    />
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1rem", width: "100%" }}>
                  <div style={{ minWidth: 0 }}>
                    <label style={{ fontSize: "0.82rem", fontWeight: 600, color: "#334155", display: "block", marginBottom: "4px" }}>
                      Version Core Banking Amplitude
                    </label>
                    <select
                      value={needInput.amplitudeVersion}
                      onChange={(e) => setNeedInput({ ...needInput, amplitudeVersion: e.target.value as any })}
                      style={{
                        width: "100%",
                        backgroundColor: "#ffffff",
                        border: "1px solid #cbd5e1",
                        borderRadius: "6px",
                        padding: "0.55rem 0.75rem",
                        color: "#0f172a",
                        fontSize: "0.85rem",
                        boxSizing: "border-box",
                      }}
                    >
                      <option value="v10.x">Amplitude v10.x (Informix natif)</option>
                      <option value="v11.x">Amplitude v11.x (Informix / AIX standard)</option>
                      <option value="v12.x">Amplitude v12.x (Oracle Enterprise / Linux)</option>
                      <option value="v13.x">Amplitude v13.x (API REST / Tuxedo)</option>
                    </select>
                  </div>

                  <div style={{ minWidth: 0 }}>
                    <label style={{ fontSize: "0.82rem", fontWeight: 600, color: "#334155", display: "block", marginBottom: "4px" }}>
                      Environnement SGBD &amp; OS
                    </label>
                    <select
                      value={needInput.technicalEnvironment}
                      onChange={(e) => setNeedInput({ ...needInput, technicalEnvironment: e.target.value as any })}
                      style={{
                        width: "100%",
                        backgroundColor: "#ffffff",
                        border: "1px solid #cbd5e1",
                        borderRadius: "6px",
                        padding: "0.55rem 0.75rem",
                        color: "#0f172a",
                        fontSize: "0.85rem",
                        boxSizing: "border-box",
                      }}
                    >
                      <option value="Informix / AIX">Informix Dynamic Server / IBM AIX</option>
                      <option value="Oracle / Linux">Oracle Database 19c / Red Hat Linux</option>
                      <option value="WebLogic / Tuxedo">Oracle Tuxedo / WebLogic Middleware</option>
                    </select>
                  </div>
                </div>

                {/* Fichiers existants optionnels (4GL & .PER) */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1rem", width: "100%" }}>
                  {/* Upload Fichier .4GL */}
                  <div
                    style={{
                      backgroundColor: "#f8fafc",
                      border: "1px dashed #cbd5e1",
                      borderRadius: "8px",
                      padding: "1rem",
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.5rem",
                    }}
                  >
                    <label style={{ fontSize: "0.83rem", fontWeight: 700, color: "#1e293b", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                      📄 Fichier .4GL à modifier <span style={{ fontSize: "0.75rem", fontWeight: 400, color: "#64748b" }}>(Optionnel)</span>
                    </label>
                    <p style={{ fontSize: "0.78rem", color: "#64748b", margin: 0 }}>
                      Charger le code Informix-4GL existant si le besoin concerne l&apos;amélioration ou la correction d&apos;un programme.
                    </p>

                    {needInput.existing4GlContent ? (
                      <div
                        style={{
                          backgroundColor: "#ffffff",
                          border: "1px solid #cbd5e1",
                          borderRadius: "6px",
                          padding: "0.5rem 0.75rem",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "#0284c7" }}>
                            ✓ {needInput.existing4GlFileName || "programme.4gl"}
                          </span>
                          <span style={{ fontSize: "0.75rem", color: "#64748b", marginLeft: "0.5rem" }}>
                            ({Math.round((needInput.existing4GlContent.length / 1024) * 10) / 10} KB)
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setNeedInput({ ...needInput, existing4GlFileName: "", existing4GlContent: "" })}
                          style={{
                            backgroundColor: "transparent",
                            border: "none",
                            color: "#ef4444",
                            fontWeight: 700,
                            cursor: "pointer",
                            fontSize: "0.85rem",
                          }}
                          title="Supprimer le fichier 4GL"
                        >
                          ✕
                        </button>
                      </div>
                    ) : (
                      <input
                        type="file"
                        accept=".4gl,.txt,.src"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = (evt) => {
                              const content = evt.target?.result as string;
                              setNeedInput((prev) => ({
                                ...prev,
                                existing4GlFileName: file.name,
                                existing4GlContent: content || "",
                              }));
                            };
                            reader.readAsText(file);
                          }
                        }}
                        style={{ fontSize: "0.8rem", color: "#334155" }}
                      />
                    )}
                  </div>

                  {/* Upload Fichier .PER */}
                  <div
                    style={{
                      backgroundColor: "#f8fafc",
                      border: "1px dashed #cbd5e1",
                      borderRadius: "8px",
                      padding: "1rem",
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.5rem",
                    }}
                  >
                    <label style={{ fontSize: "0.83rem", fontWeight: 700, color: "#1e293b", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                      🖥️ Fichier .PER (Masque d&apos;écran) <span style={{ fontSize: "0.75rem", fontWeight: 400, color: "#64748b" }}>(Optionnel)</span>
                    </label>
                    <p style={{ fontSize: "0.78rem", color: "#64748b", margin: 0 }}>
                      Charger le masque d&apos;écran Form-4GL / Genero existant s&apos;il doit être adapté ou réutilisé.
                    </p>

                    {needInput.existingPerContent ? (
                      <div
                        style={{
                          backgroundColor: "#ffffff",
                          border: "1px solid #cbd5e1",
                          borderRadius: "6px",
                          padding: "0.5rem 0.75rem",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "#059669" }}>
                            ✓ {needInput.existingPerFileName || "ecran.per"}
                          </span>
                          <span style={{ fontSize: "0.75rem", color: "#64748b", marginLeft: "0.5rem" }}>
                            ({Math.round((needInput.existingPerContent.length / 1024) * 10) / 10} KB)
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setNeedInput({ ...needInput, existingPerFileName: "", existingPerContent: "" })}
                          style={{
                            backgroundColor: "transparent",
                            border: "none",
                            color: "#ef4444",
                            fontWeight: 700,
                            cursor: "pointer",
                            fontSize: "0.85rem",
                          }}
                          title="Supprimer le fichier .PER"
                        >
                          ✕
                        </button>
                      </div>
                    ) : (
                      <input
                        type="file"
                        accept=".per,.txt,.form"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = (evt) => {
                              const content = evt.target?.result as string;
                              setNeedInput((prev) => ({
                                ...prev,
                                existingPerFileName: file.name,
                                existingPerContent: content || "",
                              }));
                            };
                            reader.readAsText(file);
                          }
                        }}
                        style={{ fontSize: "0.8rem", color: "#334155" }}
                      />
                    )}
                  </div>
                </div>

                {/* Affichage d'erreur éventuelle */}
                {agentError && (
                  <div
                    style={{
                      padding: "0.75rem 1rem",
                      borderRadius: "8px",
                      backgroundColor: "#fef2f2",
                      border: "1px solid #fecaca",
                      color: "#b91c1c",
                      fontSize: "0.85rem",
                      lineHeight: "1.4",
                    }}
                  >
                    ⚠️ <strong>Erreur Agent Docker :</strong> {agentError}
                  </div>
                )}

                {/* État de chargement en direct de l'agent Docker */}
                {agentLoading && (
                  <div
                    style={{
                      padding: "0.85rem 1rem",
                      borderRadius: "8px",
                      backgroundColor: "#eff6ff",
                      border: "1px solid #bfdbfe",
                      color: "#1e40af",
                      fontSize: "0.85rem",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.75rem",
                    }}
                  >
                    <span style={{ fontSize: "1.2rem" }}>⏳</span>
                    <div>
                      <strong style={{ display: "block" }}>Agent IA en cours d&apos;exécution...</strong>
                      <div style={{ fontSize: "0.8rem", color: "#3b82f6", marginTop: "2px" }}>
                        {agentStepMessage}
                      </div>
                    </div>
                  </div>
                )}

                {/* Boutons d'action : Agent Docker vs Génération Locale */}
                <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", marginTop: "0.5rem" }}>
                  <button
                    type="button"
                    onClick={handleRunAgenticWorkflow}
                    disabled={agentLoading}
                    style={{
                      flex: "1 1 260px",
                      backgroundColor: agentLoading ? "#94a3b8" : "#4f46e5",
                      color: "#ffffff",
                      border: "none",
                      borderRadius: "8px",
                      padding: "0.85rem 1.25rem",
                      fontSize: "0.95rem",
                      fontWeight: 700,
                      cursor: agentLoading ? "not-allowed" : "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "0.6rem",
                      boxShadow: "0 2px 6px rgba(79, 70, 229, 0.3)",
                      transition: "all 0.15s ease",
                    }}
                  >
                    <span>🤖</span>
                    <span>
                      {agentLoading ? "Analyse Agent en cours..." : "Analyser & Découper avec l'Agent IA (Docker :8080)"}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={handleGeneratePlan}
                    disabled={agentLoading}
                    style={{
                      flex: "1 1 200px",
                      backgroundColor: "#0284c7",
                      color: "#ffffff",
                      border: "none",
                      borderRadius: "8px",
                      padding: "0.85rem 1.25rem",
                      fontSize: "0.92rem",
                      fontWeight: 700,
                      cursor: agentLoading ? "not-allowed" : "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "0.6rem",
                      boxShadow: "0 2px 6px rgba(2, 132, 199, 0.25)",
                    }}
                  >
                    <span>⚡</span>
                    <span>Génération Technique Locale</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Panneau d'informations & Table d'assistance */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem", minWidth: 0, boxSizing: "border-box" }}>
              {/* Carte Méthodologie Amplitude */}
              <div
                style={{
                  backgroundColor: "#ffffff",
                  borderRadius: "12px",
                  border: "1px solid #e2e8f0",
                  padding: "1.25rem",
                  boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
                }}
              >
                <h4 style={{ fontSize: "0.95rem", fontWeight: 700, margin: "0 0 0.5rem 0", color: "#0369a1" }}>
                  📐 Méthodologie de Conception Amplitude
                </h4>
                <ul style={{ margin: 0, paddingLeft: "1.25rem", fontSize: "0.82rem", color: "#334155", lineHeight: "1.6" }}>
                  <li><strong>Modèle Relationnel :</strong> Tables maîtresses BK* (BKCPT pour les comptes, BKCLI pour les tiers, BKTRA pour les transactions).</li>
                  <li><strong>Contrôle Transactions :</strong> Encadrer les écritures DML par <code>BEGIN WORK</code> / <code>COMMIT WORK</code> avec <code>WHENEVER ERROR CONTINUE</code>.</li>
                  <li><strong>Conventions 4GL :</strong> Déclaration obligatoire des variables avec <code>DEFINE</code>, normalisation des codes retours (0=Succès, &gt;0=Erreur).</li>
                  <li><strong>IHM Formulaire :</strong> Masques <code>.per</code> compilés avec <code>form4gl</code> (format 24x80 terminal AIX Curses).</li>
                </ul>
              </div>

              {/* Carte Tables Clés Liées */}
              <div
                style={{
                  backgroundColor: "#ffffff",
                  borderRadius: "12px",
                  border: "1px solid #e2e8f0",
                  padding: "1.25rem",
                  boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem", flexWrap: "wrap", gap: "0.5rem" }}>
                  <h4 style={{ fontSize: "0.95rem", fontWeight: 700, margin: 0, color: "#047857" }}>
                    🗃️ Tables Amplitude Maîtresses
                  </h4>
                  <Link
                    href="/cbs/schema"
                    style={{ background: "none", border: "none", color: "#0284c7", fontSize: "0.78rem", cursor: "pointer", fontWeight: 600, textDecoration: "underline" }}
                  >
                    Voir toutes les tables (Schéma) →
                  </Link>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  {CBS_SCHEMA_TABLES.slice(0, 4).map((t) => (
                    <div
                      key={t.tableName}
                      style={{
                        padding: "0.6rem 0.8rem",
                        backgroundColor: "#f8fafc",
                        border: "1px solid #e2e8f0",
                        borderRadius: "8px",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <div>
                        <span style={{ fontWeight: 700, color: "#0f172a", fontSize: "0.85rem" }}>{t.tableName}</span>
                        <span style={{ fontSize: "0.75rem", color: "#64748b", marginLeft: "0.5rem" }}>({t.module})</span>
                      </div>
                      <span style={{ fontSize: "0.72rem", color: "#1d4ed8", backgroundColor: "#eff6ff", border: "1px solid #bfdbfe", padding: "2px 6px", borderRadius: "4px", fontWeight: 600 }}>
                        PK: {t.primaryKey.join(", ")}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --------------------------------------------------------------------- */}
        {/* ONGLET 2 : SOUS-TÂCHES & ANALYSE FONCTIONNELLE */}
        {/* --------------------------------------------------------------------- */}
        {activeTab === "TASKS" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem", width: "100%", boxSizing: "border-box" }}>
            {/* Feedback d'action (validation, rejet, génération) */}
            {actionFeedback && (
              <div
                style={{
                  padding: "0.85rem 1.25rem",
                  borderRadius: "8px",
                  backgroundColor: "#ecfdf5",
                  border: "1px solid #a7f3d0",
                  color: "#065f46",
                  fontSize: "0.88rem",
                  fontWeight: 600,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <span>{actionFeedback}</span>
                <button
                  onClick={() => setActionFeedback(null)}
                  style={{ background: "none", border: "none", color: "#047857", cursor: "pointer", fontSize: "1rem" }}
                >
                  ✕
                </button>
              </div>
            )}

            {/* Bandeau Human-in-the-loop Agent Docker */}
            {agentSession && (
              <div
                style={{
                  backgroundColor: "#ffffff",
                  borderRadius: "12px",
                  border: `2px solid ${
                    agentSession.decision === "ACCEPTEE"
                      ? "#10b981"
                      : agentSession.decision === "REFUSEE"
                      ? "#ef4444"
                      : "#3b82f6"
                  }`,
                  padding: "1.25rem 1.5rem",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
                  display: "flex",
                  flexDirection: "column",
                  gap: "1rem",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
                    <span style={{ fontSize: "1.7rem" }}>🤖</span>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", flexWrap: "wrap" }}>
                        <span style={{ fontWeight: 800, fontSize: "1rem", color: "#0f172a" }}>
                          Session Agent : {agentSession.name}
                        </span>
                        <span
                          style={{
                            backgroundColor: "#f1f5f9",
                            color: "#475569",
                            padding: "2px 8px",
                            borderRadius: "4px",
                            fontSize: "0.75rem",
                            fontWeight: 700,
                          }}
                        >
                          Version {agentSession.version}
                        </span>
                        <span
                          style={{
                            backgroundColor:
                              agentSession.decision === "ACCEPTEE"
                                ? "#dcfce7"
                                : agentSession.decision === "REFUSEE"
                                ? "#fee2e2"
                                : "#fef3c7",
                            color:
                              agentSession.decision === "ACCEPTEE"
                                ? "#15803d"
                                : agentSession.decision === "REFUSEE"
                                ? "#b91c1c"
                                : "#b45309",
                            padding: "3px 10px",
                            borderRadius: "6px",
                            fontSize: "0.75rem",
                            fontWeight: 700,
                          }}
                        >
                          {agentSession.decision === "ACCEPTEE"
                            ? "✅ ANALYSE VALIDÉE PAR L'HUMAIN"
                            : agentSession.decision === "REFUSEE"
                            ? "❌ ANALYSE REFUSÉE"
                            : "⏳ EN ATTENTE DE VALIDATION HUMAINE"}
                        </span>
                      </div>
                      <div style={{ fontSize: "0.78rem", color: "#64748b", marginTop: "3px" }}>
                        Moteur : Agent Docker :8080 ({dockerHealth.llmModel || "gemini-2.5-flash"}) • Contrôle Humain requis pour accepter ou renvoyer en révision
                      </div>
                    </div>
                  </div>

                  {/* Boutons Human-in-the-loop */}
                  <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", flexWrap: "wrap" }}>
                    {agentSession.decision === "EN_ATTENTE" && (
                      <>
                        <button
                          type="button"
                          onClick={handleAcceptAnalysis}
                          disabled={isValidating || isRejecting}
                          style={{
                            backgroundColor: "#16a34a",
                            color: "#ffffff",
                            border: "none",
                            borderRadius: "6px",
                            padding: "0.55rem 1.1rem",
                            fontSize: "0.85rem",
                            fontWeight: 700,
                            cursor: isValidating ? "not-allowed" : "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: "0.45rem",
                            boxShadow: "0 1px 3px rgba(22, 163, 74, 0.3)",
                          }}
                        >
                          <span>{isValidating ? "Validation..." : "✅ Valider / Accepter"}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setShowRejectModal(true)}
                          disabled={isValidating || isRejecting}
                          style={{
                            backgroundColor: "#ef4444",
                            color: "#ffffff",
                            border: "none",
                            borderRadius: "6px",
                            padding: "0.55rem 1.1rem",
                            fontSize: "0.85rem",
                            fontWeight: 700,
                            cursor: isRejecting ? "not-allowed" : "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: "0.45rem",
                            boxShadow: "0 1px 3px rgba(239, 68, 68, 0.3)",
                          }}
                        >
                          <span>❌ Rejeter &amp; Demander des corrections</span>
                        </button>
                      </>
                    )}

                    {agentSession.decision === "ACCEPTEE" && (
                      <button
                        type="button"
                        onClick={handleGenerateAgentCode}
                        disabled={isGeneratingCode}
                        style={{
                          backgroundColor: "#4f46e5",
                          color: "#ffffff",
                          border: "none",
                          borderRadius: "6px",
                          padding: "0.55rem 1.1rem",
                          fontSize: "0.85rem",
                          fontWeight: 700,
                          cursor: isGeneratingCode ? "not-allowed" : "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: "0.45rem",
                          boxShadow: "0 2px 6px rgba(79, 70, 229, 0.3)",
                        }}
                      >
                        <span>🤖</span>
                        <span>
                          {isGeneratingCode
                            ? "Génération 4GL & .PER en cours..."
                            : "🚀 Générer le Code 4GL & Écran Web (.per)"}
                        </span>
                      </button>
                    )}

                    {agentSession.history && agentSession.history.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setShowHistoryAccordion(!showHistoryAccordion)}
                        style={{
                          backgroundColor: "#f8fafc",
                          color: "#334155",
                          border: "1px solid #cbd5e1",
                          borderRadius: "6px",
                          padding: "0.55rem 0.85rem",
                          fontSize: "0.82rem",
                          fontWeight: 600,
                          cursor: "pointer",
                        }}
                      >
                        <span>📜 Historique ({agentSession.history.length} itérations)</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Historique dépliable des décisions et révisions */}
                {showHistoryAccordion && agentSession.history && agentSession.history.length > 0 && (
                  <div
                    style={{
                      borderTop: "1px solid #e2e8f0",
                      paddingTop: "0.75rem",
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.5rem",
                    }}
                  >
                    <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "#475569" }}>
                      CYCLE DES ITÉRATIONS &amp; MOTIFS DES DÉCISIONS :
                    </div>
                    {agentSession.history.map((h, idx) => (
                      <div
                        key={idx}
                        style={{
                          fontSize: "0.8rem",
                          backgroundColor: "#f8fafc",
                          border: "1px solid #e2e8f0",
                          borderRadius: "6px",
                          padding: "0.6rem 0.85rem",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          gap: "1rem",
                        }}
                      >
                        <div>
                          <strong>Version v{h.version}</strong> — Statut :{" "}
                          <span
                            style={{
                              color:
                                h.decision === "ACCEPTEE"
                                  ? "#16a34a"
                                  : h.decision === "REFUSEE"
                                  ? "#dc2626"
                                  : "#d97706",
                              fontWeight: 700,
                            }}
                          >
                            {h.decision}
                          </span>
                          {h.reason && (
                            <div style={{ color: "#475569", marginTop: "3px", fontStyle: "italic" }}>
                              Motif du refus : « {h.reason} »
                            </div>
                          )}
                        </div>
                        {h.createdAt && (
                          <div style={{ fontSize: "0.72rem", color: "#94a3b8", whiteSpace: "nowrap" }}>
                            {new Date(h.createdAt).toLocaleTimeString("fr-FR")}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Contenu de l'analyse ou Message d'état vide par défaut */}
            {!safePlan ? (
              <div
                style={{
                  backgroundColor: "#ffffff",
                  borderRadius: "12px",
                  border: "1px dashed #cbd5e1",
                  padding: "4rem 2rem",
                  textAlign: "center",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "1rem",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.02)",
                }}
              >
                <div style={{ fontSize: "3.2rem" }}>📋</div>
                <h3 style={{ fontSize: "1.25rem", fontWeight: 700, color: "#0f172a", margin: 0 }}>
                  Aucune analyse ni tâche générée pour le moment
                </h3>
                <p style={{ fontSize: "0.88rem", color: "#64748b", maxWidth: "560px", margin: 0, lineHeight: "1.6" }}>
                  Pour lancer la décomposition de votre besoin bancaire, retournez sur l&apos;onglet <strong>1. Saisie du Besoin</strong>, renseignez votre expression de besoin ou choisissez un modèle, puis cliquez sur <strong>🤖 Analyser &amp; Découper avec l&apos;Agent IA</strong> ou <strong>⚡ Génération Technique Locale</strong>.
                </p>
                <button
                  type="button"
                  onClick={() => setActiveTab("NEED")}
                  style={{
                    marginTop: "0.5rem",
                    backgroundColor: "#0284c7",
                    color: "#ffffff",
                    border: "none",
                    borderRadius: "8px",
                    padding: "0.75rem 1.4rem",
                    fontSize: "0.88rem",
                    fontWeight: 700,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    boxShadow: "0 2px 4px rgba(2, 132, 199, 0.25)",
                  }}
                >
                  <span>←</span>
                  <span>Accéder à la Saisie du Besoin</span>
                </button>
              </div>
            ) : (
              <>
                {/* Synthèse fonctionnelle */}
                <div style={{ backgroundColor: "#ffffff", borderRadius: "12px", border: "1px solid #e2e8f0", padding: "1.5rem", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem", flexWrap: "wrap", gap: "1rem" }}>
                    <div>
                      <span style={{ fontSize: "0.75rem", color: "#0284c7", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 700 }}>
                        SYNTHÈSE TECHNIQUE &amp; FONCTIONNELLE
                      </span>
                      <h3 style={{ fontSize: "1.25rem", fontWeight: 700, margin: "4px 0", color: "#0f172a" }}>
                        {safePlan.analysis.summary}
                      </h3>
                      <p style={{ fontSize: "0.88rem", color: "#475569", margin: 0 }}>
                        {safePlan.analysis.businessObjective}
                      </p>
                    </div>
                    <button
                      onClick={() => setActiveTab("CODE")}
                      style={{
                        backgroundColor: "#0284c7",
                        color: "#ffffff",
                        border: "none",
                        borderRadius: "6px",
                        padding: "0.5rem 1rem",
                        fontSize: "0.85rem",
                        fontWeight: 600,
                        cursor: "pointer",
                      }}
                    >
                      Voir le Code 4GL →
                    </button>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1rem", marginTop: "1rem" }}>
                    <div style={{ backgroundColor: "#f8fafc", padding: "0.85rem", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
                      <div style={{ fontSize: "0.75rem", color: "#64748b", fontWeight: 700, marginBottom: "0.4rem" }}>PRÉCONDITIONS CBS</div>
                      <ul style={{ margin: 0, paddingLeft: "1.1rem", fontSize: "0.82rem", color: "#334155", lineHeight: "1.5" }}>
                        {safePlan.analysis.preconditions.map((p, i) => (
                          <li key={i}>{p}</li>
                        ))}
                      </ul>
                    </div>

                    <div style={{ backgroundColor: "#f8fafc", padding: "0.85rem", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
                      <div style={{ fontSize: "0.75rem", color: "#64748b", fontWeight: 700, marginBottom: "0.4rem" }}>RÈGLES MÉTIER CONTRÔLÉES</div>
                      <ul style={{ margin: 0, paddingLeft: "1.1rem", fontSize: "0.82rem", color: "#334155", lineHeight: "1.5" }}>
                        {safePlan.analysis.businessRules.map((r, i) => (
                          <li key={i}>{r}</li>
                        ))}
                      </ul>
                    </div>

                    <div style={{ backgroundColor: "#fef2f2", padding: "0.85rem", borderRadius: "8px", border: "1px solid #fecaca" }}>
                      <div style={{ fontSize: "0.75rem", color: "#b91c1c", fontWeight: 700, marginBottom: "0.4rem" }}>RISQUES TECHNIQUES</div>
                      <ul style={{ margin: 0, paddingLeft: "1.1rem", fontSize: "0.82rem", color: "#991b1b", lineHeight: "1.5" }}>
                        {safePlan.analysis.technicalRisks.map((tr, i) => (
                          <li key={i}>{tr}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Liste des sous-tâches ordonnées */}
                <div style={{ backgroundColor: "#ffffff", borderRadius: "12px", border: "1px solid #e2e8f0", padding: "1.5rem", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
                  <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "1rem", color: "#0f172a" }}>
                    Plan de Développement &amp; Sous-Tâches ({safePlan.subTasks.length} Tâches Ordonnées)
                  </h3>

                  <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", width: "100%", boxSizing: "border-box" }}>
                    {safePlan.subTasks.map((task) => (
                      <div
                        key={task.id}
                        style={{
                          backgroundColor: "#f8fafc",
                          border: "1px solid #e2e8f0",
                          borderRadius: "10px",
                          padding: "1rem 1.25rem",
                          display: "grid",
                          gridTemplateColumns: "100px 1.5fr 1.2fr 1fr",
                          gap: "1.25rem",
                          alignItems: "start",
                          width: "100%",
                          boxSizing: "border-box",
                        }}
                      >
                        <div style={{ minWidth: 0 }}>
                          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                            <span
                              style={{
                                backgroundColor: "#eff6ff",
                                color: "#1d4ed8",
                                border: "1px solid #bfdbfe",
                                padding: "2px 8px",
                                borderRadius: "4px",
                                fontSize: "0.75rem",
                                fontWeight: 700,
                                display: "inline-block",
                                alignSelf: "flex-start",
                              }}
                            >
                              {task.id}
                            </span>

                            {/* Statut de la tâche */}
                            <span
                              style={{
                                display: "inline-block",
                                fontSize: "0.68rem",
                                fontWeight: 700,
                                padding: "2px 6px",
                                borderRadius: "4px",
                                alignSelf: "flex-start",
                                backgroundColor:
                                  task.status === "VALIDE"
                                    ? "#dcfce7"
                                    : task.status === "REJETE"
                                    ? "#fee2e2"
                                    : task.status === "A_VALIDER"
                                    ? "#fef3c7"
                                    : "#f1f5f9",
                                color:
                                  task.status === "VALIDE"
                                    ? "#166534"
                                    : task.status === "REJETE"
                                    ? "#991b1b"
                                    : task.status === "A_VALIDER"
                                    ? "#92400e"
                                    : "#475569",
                                border: `1px solid ${
                                  task.status === "VALIDE"
                                    ? "#bbf7d0"
                                    : task.status === "REJETE"
                                    ? "#fecaca"
                                    : task.status === "A_VALIDER"
                                    ? "#fde68a"
                                    : "#cbd5e1"
                                }`,
                              }}
                            >
                              {task.status || "A_VALIDER"}
                            </span>

                            <div style={{ fontSize: "0.73rem", color: "#64748b", marginTop: "2px" }}>{task.estimation}</div>
                          </div>
                        </div>

                        <div style={{ minWidth: 0 }}>
                          <div style={{ fontWeight: 700, fontSize: "0.92rem", color: "#0f172a", wordBreak: "break-word" }}>{task.title}</div>
                          <div style={{ fontSize: "0.82rem", color: "#475569", marginTop: "4px", lineHeight: "1.4", wordBreak: "break-word" }}>{task.description}</div>
                        </div>

                        <div style={{ minWidth: 0 }}>
                          <div style={{ fontSize: "0.72rem", color: "#64748b", fontWeight: 700, textTransform: "uppercase" }}>CRITÈRES D&apos;ACCEPTATION</div>
                          <div style={{ fontSize: "0.8rem", color: "#334155", marginTop: "4px", lineHeight: "1.4", wordBreak: "break-word" }}>
                            {task.acceptanceCriteria[0]}
                          </div>
                        </div>

                        <div style={{ minWidth: 0 }}>
                          <div style={{ fontSize: "0.72rem", color: "#64748b", fontWeight: 700, textTransform: "uppercase", marginBottom: "4px" }}>FICHIERS CIBLES</div>
                          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem" }}>
                            {task.concernedFiles.map((file, fIdx) => (
                              <span
                                key={fIdx}
                                style={{
                                  display: "inline-block",
                                  maxWidth: "100%",
                                  fontSize: "0.74rem",
                                  color: "#4338ca",
                                  fontFamily: "monospace",
                                  backgroundColor: "#e0e7ff",
                                  border: "1px solid #c7d2fe",
                                  padding: "2px 6px",
                                  borderRadius: "4px",
                                  wordBreak: "break-all",
                                  overflowWrap: "anywhere",
                                  whiteSpace: "normal",
                                }}
                              >
                                {file}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* --------------------------------------------------------------------- */}
        {/* ONGLET 3 : CODE INFORMIX 4GL (THEME CLAIR AVEC TÉLÉCHARGEMENT) */}
        {/* --------------------------------------------------------------------- */}
        {activeTab === "CODE" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem", width: "100%", boxSizing: "border-box" }}>
            {!safePlan ? (
              <div
                style={{
                  backgroundColor: "#ffffff",
                  borderRadius: "12px",
                  border: "1px dashed #cbd5e1",
                  padding: "4rem 2rem",
                  textAlign: "center",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "1rem",
                }}
              >
                <div style={{ fontSize: "3.2rem" }}>💻</div>
                <h3 style={{ fontSize: "1.25rem", fontWeight: 700, color: "#0f172a", margin: 0 }}>
                  Aucun code Informix 4GL généré
                </h3>
                <p style={{ fontSize: "0.88rem", color: "#64748b", maxWidth: "540px", margin: 0, lineHeight: "1.6" }}>
                  Le programme 4GL complet (structure, curseurs, contrôles transactionnels et SQLCA) apparaîtra ici après analyse du besoin.
                </p>
                <button
                  type="button"
                  onClick={() => setActiveTab("NEED")}
                  style={{
                    marginTop: "0.5rem",
                    backgroundColor: "#0284c7",
                    color: "#ffffff",
                    border: "none",
                    borderRadius: "8px",
                    padding: "0.75rem 1.4rem",
                    fontSize: "0.88rem",
                    fontWeight: 700,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  <span>←</span>
                  <span>Accéder à la Saisie du Besoin</span>
                </button>
              </div>
            ) : (
              <>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.75rem" }}>
                  <div>
                    <h3 style={{ fontSize: "1.15rem", fontWeight: 700, margin: 0, color: "#0f172a" }}>
                      Code Informix 4GL Généré (Sopra Banking Amplitude)
                    </h3>
                    <p style={{ fontSize: "0.82rem", color: "#64748b", margin: "2px 0 0 0" }}>
                      Programme autonome exploitant les tables <code>BKCPT</code>, <code>BKCLI</code> et <code>BKTRA</code> avec gestion transactionnelle et contrôle <code>SQLCA.SQLCODE</code>.
                    </p>
                  </div>

                  <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", alignItems: "center" }}>
                    {agentSession?.decision === "ACCEPTEE" && (
                      <button
                        onClick={handleGenerateAgentCode}
                        disabled={isGeneratingCode}
                        style={{
                          backgroundColor: "#4f46e5",
                          color: "#ffffff",
                          border: "none",
                          borderRadius: "6px",
                          padding: "0.45rem 0.85rem",
                          fontSize: "0.82rem",
                          fontWeight: 600,
                          cursor: isGeneratingCode ? "not-allowed" : "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: "0.4rem",
                        }}
                      >
                        <span>🤖</span>
                        <span>{isGeneratingCode ? "Génération 4GL/PER..." : "Régénérer avec l'Agent IA"}</span>
                      </button>
                    )}

                    <button
                      onClick={() => copyToClipboard(safePlan.code4GlProposal.code4Gl, "4gl")}
                      style={{
                        backgroundColor: "#ffffff",
                        color: "#334155",
                        border: "1px solid #cbd5e1",
                        borderRadius: "6px",
                        padding: "0.45rem 0.85rem",
                        fontSize: "0.82rem",
                        fontWeight: 600,
                        cursor: "pointer",
                      }}
                    >
                      {copiedKey === "4gl" ? "✅ Copié !" : "📋 Copier le Code"}
                    </button>

                    <button
                      onClick={() =>
                        downloadFile(
                          safePlan.code4GlProposal.code4Gl,
                          `${safePlan.code4GlProposal.entryPoint.split(" ")[0].toLowerCase() || "p_cbs_traitement"}.4gl`,
                          "text/plain"
                        )
                      }
                      style={{
                        backgroundColor: "#0284c7",
                        color: "#ffffff",
                        border: "none",
                        borderRadius: "6px",
                        padding: "0.45rem 0.85rem",
                        fontSize: "0.82rem",
                        fontWeight: 600,
                        cursor: "pointer",
                      }}
                    >
                      💾 Télécharger (.4gl)
                    </button>
                  </div>
                </div>

                <div
                  style={{
                    backgroundColor: "#ffffff",
                    border: "1px solid #cbd5e1",
                    borderRadius: "8px",
                    padding: "1rem",
                    overflowX: "auto",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                  }}
                >
                  <pre
                    style={{
                      margin: 0,
                      fontSize: "0.85rem",
                      lineHeight: "1.5",
                      fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
                      color: "#0f172a",
                    }}
                  >
                    <code>{safePlan.code4GlProposal.code4Gl}</code>
                  </pre>
                </div>

                {/* Notes d'architecture */}
                <div style={{ backgroundColor: "#ffffff", borderRadius: "8px", border: "1px solid #e2e8f0", padding: "1rem" }}>
                  <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "#0369a1", marginBottom: "0.4rem" }}>
                    RECOMMANDATIONS D&apos;EXPLOITATION RUN / BUILD AMPLITUDE
                  </div>
                  <ul style={{ margin: 0, paddingLeft: "1.25rem", fontSize: "0.82rem", color: "#334155", lineHeight: "1.6" }}>
                    {safePlan.code4GlProposal.importantNotes.map((note, i) => (
                      <li key={i}>{note}</li>
                    ))}
                  </ul>
                </div>
              </>
            )}
          </div>
        )}

        {/* --------------------------------------------------------------------- */}
        {/* ONGLET 4 : ECRAN MASQUE (.PER) */}
        {/* --------------------------------------------------------------------- */}
        {activeTab === "PER_SCREEN" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem", width: "100%", boxSizing: "border-box" }}>
            {!safePlan ? (
              <div
                style={{
                  backgroundColor: "#ffffff",
                  borderRadius: "12px",
                  border: "1px dashed #cbd5e1",
                  padding: "4rem 2rem",
                  textAlign: "center",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "1rem",
                }}
              >
                <div style={{ fontSize: "3.2rem" }}>🖥️</div>
                <h3 style={{ fontSize: "1.25rem", fontWeight: 700, color: "#0f172a", margin: 0 }}>
                  Aucun masque d&apos;écran (.per) généré
                </h3>
                <p style={{ fontSize: "0.88rem", color: "#64748b", maxWidth: "540px", margin: 0, lineHeight: "1.6" }}>
                  Le masque d&apos;écran terminal 24x80 ainsi que la maquette visuelle seront construits dès la validation du besoin.
                </p>
                <button
                  type="button"
                  onClick={() => setActiveTab("NEED")}
                  style={{
                    marginTop: "0.5rem",
                    backgroundColor: "#0284c7",
                    color: "#ffffff",
                    border: "none",
                    borderRadius: "8px",
                    padding: "0.75rem 1.4rem",
                    fontSize: "0.88rem",
                    fontWeight: 700,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  <span>←</span>
                  <span>Accéder à la Saisie du Besoin</span>
                </button>
              </div>
            ) : safePlan.perScreen ? (
              <>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.75rem" }}>
                  <div>
                    <h3 style={{ fontSize: "1.15rem", fontWeight: 700, margin: 0, color: "#0f172a" }}>
                      Conception du Masque d&apos;Écran Formulaire (.per)
                    </h3>
                    <p style={{ fontSize: "0.82rem", color: "#64748b", margin: "2px 0 0 0" }}>
                      Compilateur &amp; Rendu Interactif Genero Web GUI (GWC / GDC) pour masques <code>{safePlan.perScreen.screenName}</code>.
                    </p>
                  </div>

                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <button
                      onClick={() => copyToClipboard(safePlan.perScreen!.perCodeSnippet, "per")}
                      style={{
                        backgroundColor: "#ffffff",
                        color: "#334155",
                        border: "1px solid #cbd5e1",
                        borderRadius: "6px",
                        padding: "0.45rem 0.85rem",
                        fontSize: "0.82rem",
                        fontWeight: 600,
                        cursor: "pointer",
                      }}
                    >
                      {copiedKey === "per" ? "✅ Copié !" : "📋 Copier la Forme"}
                    </button>

                    <button
                      onClick={() =>
                        downloadFile(
                          safePlan.perScreen!.perCodeSnippet,
                          safePlan.perScreen!.screenName,
                          "text/plain"
                        )
                      }
                      style={{
                        backgroundColor: "#0284c7",
                        color: "#ffffff",
                        border: "none",
                        borderRadius: "6px",
                        padding: "0.45rem 0.85rem",
                        fontSize: "0.82rem",
                        fontWeight: 600,
                        cursor: "pointer",
                      }}
                    >
                      💾 Télécharger (.per)
                    </button>
                  </div>
                </div>

                {/* SÉLECTEUR DE MODE DE VUE SOUS-ONGLETS */}
                <div style={{ display: "flex", gap: "0.5rem", borderBottom: "1px solid #cbd5e1", paddingBottom: "0.5rem" }}>
                  {[
                    { key: "GUI_COMPILER", label: "🖥️ Rendu Interactif Genero Web GUI (Compilateur)", icon: "🚀" },
                    { key: "SOURCE_CODE", label: "📄 Code Source .PER", icon: "📝" },
                    { key: "ASCII_MOCKUP", label: "📺 Maquette Visuelle Terminal Curses", icon: "📟" }
                  ].map((st) => {
                    const isSubActive = perScreenSubTab === st.key;
                    return (
                      <button
                        key={st.key}
                        onClick={() => setPerScreenSubTab(st.key as any)}
                        style={{
                          padding: "0.45rem 0.85rem",
                          borderRadius: "6px",
                          border: isSubActive ? "1px solid #0284c7" : "1px solid #e2e8f0",
                          backgroundColor: isSubActive ? "#eff6ff" : "#ffffff",
                          color: isSubActive ? "#1d4ed8" : "#475569",
                          fontSize: "0.82rem",
                          fontWeight: isSubActive ? 700 : 500,
                          cursor: "pointer",
                          transition: "all 0.15s ease",
                        }}
                      >
                        {st.label}
                      </button>
                    );
                  })}
                </div>

                {/* SUB-TAB 1: COMPILATEUR & RENDU INTERACTIF GENERO WEB GUI */}
                {perScreenSubTab === "GUI_COMPILER" && (
                  <div style={{ width: "100%", boxSizing: "border-box" }}>
                    <div style={{
                      backgroundColor: "#ecfdf5",
                      border: "1px solid #a7f3d0",
                      borderRadius: "8px",
                      padding: "0.6rem 1rem",
                      marginBottom: "0.75rem",
                      fontSize: "0.82rem",
                      color: "#065f46",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between"
                    }}>
                      <span>
                        ✨ <strong>Compilateur Genero Web GUI Actif :</strong> Vous pouvez tester la saisie dans les champs et cliquer sur les boutons d&apos;action (F10, F2, ESC) pour simuler l&apos;exécution événementielle 4GL.
                      </span>
                      <span style={{ fontSize: "0.75rem", fontWeight: 700, backgroundColor: "#047857", color: "#ffffff", padding: "2px 8px", borderRadius: "4px" }}>
                        LIVE TEST
                      </span>
                    </div>

                    <GeneroGuiWindow
                      data={parsePerToGuiMockupData(
                        safePlan.perScreen.perCodeSnippet,
                        safePlan.need.title,
                        safePlan.need.bankingDomain
                      )}
                      title={safePlan.need.title}
                      domain={safePlan.need.bankingDomain}
                    />
                  </div>
                )}

                {/* SUB-TAB 2: CODE SOURCE .PER */}
                {perScreenSubTab === "SOURCE_CODE" && (
                  <div style={{ backgroundColor: "#ffffff", borderRadius: "8px", border: "1px solid #e2e8f0", padding: "1.25rem", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
                    <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "#0284c7", marginBottom: "0.6rem" }}>
                      📄 SOURCE INFORMIX FORMULAIRE ({safePlan.perScreen.screenName})
                    </div>
                    <pre
                      style={{
                        margin: 0,
                        backgroundColor: "#f8fafc",
                        border: "1px solid #cbd5e1",
                        borderRadius: "6px",
                        padding: "1rem",
                        fontSize: "0.85rem",
                        lineHeight: "1.4",
                        fontFamily: "ui-monospace, monospace",
                        color: "#0f172a",
                        overflowX: "auto",
                        maxWidth: "100%",
                        boxSizing: "border-box",
                      }}
                    >
                      {safePlan.perScreen.perCodeSnippet}
                    </pre>
                  </div>
                )}

                {/* SUB-TAB 3: MAQUETTE VISUELLE ASCII */}
                {perScreenSubTab === "ASCII_MOCKUP" && (
                  <div style={{ backgroundColor: "#ffffff", borderRadius: "8px", border: "1px solid #e2e8f0", padding: "1.25rem", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
                    <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "#4338ca", marginBottom: "0.6rem" }}>
                      🖥️ MAQUETTE VISUELLE TERMINAL CURSES (24 LIGNES x 80 COLONNES)
                    </div>
                    <pre
                      style={{
                        margin: 0,
                        backgroundColor: "#f8fafc",
                        border: "1px solid #cbd5e1",
                        borderRadius: "6px",
                        padding: "1rem",
                        fontSize: "0.82rem",
                        lineHeight: "1.3",
                        fontFamily: "ui-monospace, monospace",
                        color: "#0f172a",
                        overflowX: "auto",
                        maxWidth: "100%",
                        boxSizing: "border-box",
                      }}
                    >
                      {safePlan.perScreen.visualMockupAscii}
                    </pre>
                  </div>
                )}
              </>
            ) : (
              <div style={{ padding: "3rem", textAlign: "center", color: "#64748b" }}>
                Ce besoin ne requiert pas de masque d&apos;écran formulaire interactif (programme purement batch ou API).
              </div>
            )}
          </div>
        )}

        {/* --------------------------------------------------------------------- */}
        {/* ONGLET 5 : REQUÊTES SQL & INDEX */}
        {/* --------------------------------------------------------------------- */}
        {activeTab === "SQL" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem", width: "100%", boxSizing: "border-box" }}>
            {!safePlan ? (
              <div
                style={{
                  backgroundColor: "#ffffff",
                  borderRadius: "12px",
                  border: "1px dashed #cbd5e1",
                  padding: "4rem 2rem",
                  textAlign: "center",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "1rem",
                }}
              >
                <div style={{ fontSize: "3.2rem" }}>🗄️</div>
                <h3 style={{ fontSize: "1.25rem", fontWeight: 700, color: "#0f172a", margin: 0 }}>
                  Aucune requête SQL générée
                </h3>
                <p style={{ fontSize: "0.88rem", color: "#64748b", maxWidth: "540px", margin: 0, lineHeight: "1.6" }}>
                  Les requêtes SQL optimisées et les analyses de performances SGBD seront affichées après traitement de l&apos;expression de besoin.
                </p>
                <button
                  type="button"
                  onClick={() => setActiveTab("NEED")}
                  style={{
                    marginTop: "0.5rem",
                    backgroundColor: "#0284c7",
                    color: "#ffffff",
                    border: "none",
                    borderRadius: "8px",
                    padding: "0.75rem 1.4rem",
                    fontSize: "0.88rem",
                    fontWeight: 700,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  <span>←</span>
                  <span>Accéder à la Saisie du Besoin</span>
                </button>
              </div>
            ) : (
              <>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.75rem" }}>
                  <div>
                    <h3 style={{ fontSize: "1.15rem", fontWeight: 700, margin: 0, color: "#0f172a" }}>
                      Requêtes SQL &amp; Optimisation SGBD (Informix / Oracle)
                    </h3>
                    <p style={{ fontSize: "0.82rem", color: "#64748b", margin: "2px 0 0 0" }}>
                      Requêtes indexées sur <code>BKCPT</code>, <code>BKCLI</code> et <code>BKTRA</code> garantissant l&apos;absence de Full Table Scan et respectant la concurrence.
                    </p>
                  </div>

                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <button
                      onClick={() => copyToClipboard(safePlan.sqlProposal.sqlCode, "sql")}
                      style={{
                        backgroundColor: "#ffffff",
                        color: "#334155",
                        border: "1px solid #cbd5e1",
                        borderRadius: "6px",
                        padding: "0.45rem 0.85rem",
                        fontSize: "0.82rem",
                        fontWeight: 600,
                        cursor: "pointer",
                      }}
                    >
                      {copiedKey === "sql" ? "✅ Copié !" : "📋 Copier SQL"}
                    </button>

                    <button
                      onClick={() => downloadFile(safePlan.sqlProposal.sqlCode, "cbs_requetes_optimisees.sql", "text/plain")}
                      style={{
                        backgroundColor: "#0284c7",
                        color: "#ffffff",
                        border: "none",
                        borderRadius: "6px",
                        padding: "0.45rem 0.85rem",
                        fontSize: "0.82rem",
                        fontWeight: 600,
                        cursor: "pointer",
                      }}
                    >
                      💾 Télécharger (.sql)
                    </button>
                  </div>
                </div>

                <div style={{ backgroundColor: "#ffffff", border: "1px solid #cbd5e1", borderRadius: "8px", padding: "1rem", overflowX: "auto", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
                  <pre
                    style={{
                      margin: 0,
                      fontSize: "0.85rem",
                      lineHeight: "1.5",
                      fontFamily: "ui-monospace, monospace",
                      color: "#0369a1",
                    }}
                  >
                    <code>{safePlan.sqlProposal.sqlCode}</code>
                  </pre>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1rem" }}>
                  <div style={{ backgroundColor: "#ffffff", borderRadius: "8px", border: "1px solid #fecaca", padding: "1rem" }}>
                    <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "#b91c1c", marginBottom: "0.4rem" }}>
                      ⚠️ RISQUES DE PERFORMANCE &amp; FULL TABLE SCAN
                    </div>
                    <ul style={{ margin: 0, paddingLeft: "1.25rem", fontSize: "0.82rem", color: "#475569", lineHeight: "1.5" }}>
                      {safePlan.sqlProposal.performanceRisks.map((r, i) => (
                        <li key={i}>{r}</li>
                      ))}
                    </ul>
                  </div>

                  <div style={{ backgroundColor: "#ffffff", borderRadius: "8px", border: "1px solid #a7f3d0", padding: "1rem" }}>
                    <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "#047857", marginBottom: "0.4rem" }}>
                      🔒 CONSIGNES DE SÉCURITÉ &amp; CONFIDENTIALITÉ
                    </div>
                    <ul style={{ margin: 0, paddingLeft: "1.25rem", fontSize: "0.82rem", color: "#475569", lineHeight: "1.5" }}>
                      {safePlan.sqlProposal.securityPrecautions.map((s, i) => (
                        <li key={i}>{s}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* --------------------------------------------------------------------- */}
      </main>

      {/* ========================================================================= */}
      {/* 4. MODALE DE GESTION DES PROJETS SAUVEGARDÉS */}
      {/* ========================================================================= */}
      {showProjectsModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(15, 23, 42, 0.5)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
          onClick={() => setShowProjectsModal(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "700px",
              maxWidth: "95vw",
              maxHeight: "80vh",
              backgroundColor: "#ffffff",
              border: "1px solid #cbd5e1",
              borderRadius: "12px",
              padding: "1.5rem",
              display: "flex",
              flexDirection: "column",
              boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
              boxSizing: "border-box",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <h3 style={{ fontSize: "1.2rem", fontWeight: 700, margin: 0, color: "#0f172a" }}>
                📂 Projets de Développement Enregistrés ({savedProjects.length})
              </h3>
              <button
                onClick={() => setShowProjectsModal(false)}
                style={{ background: "none", border: "none", color: "#64748b", fontSize: "1.2rem", cursor: "pointer" }}
              >
                ✕
              </button>
            </div>

            <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {savedProjects.length === 0 ? (
                <div style={{ padding: "3rem", textAlign: "center", color: "#64748b" }}>
                  Aucun projet sauvegardé pour le moment. Cliquez sur <strong>💾 Sauvegarder (BD)</strong> pour conserver vos développements.
                </div>
              ) : (
                savedProjects.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => handleLoadProject(p)}
                    style={{
                      padding: "1rem",
                      backgroundColor: "#f8fafc",
                      border: "1px solid #e2e8f0",
                      borderRadius: "8px",
                      cursor: "pointer",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      transition: "border-color 0.15s ease",
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 700, color: "#0f172a", fontSize: "0.95rem" }}>{p.name}</div>
                      <div style={{ fontSize: "0.78rem", color: "#64748b", marginTop: "4px" }}>
                        Domaine : <span style={{ color: "#0284c7" }}>{p.domain}</span> • Mis à jour le : {new Date(p.updatedAt).toLocaleString("fr-FR")}
                      </div>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                      <span style={{ fontSize: "0.8rem", color: "#0284c7", fontWeight: 600 }}>Ouvrir →</span>
                      <button
                        onClick={(e) => handleDeleteProject(p.id, e)}
                        style={{
                          background: "none",
                          border: "none",
                          color: "#ef4444",
                          cursor: "pointer",
                          fontSize: "1rem",
                          padding: "4px",
                        }}
                        title="Supprimer ce projet"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal de Rejet de l'analyse / Human-in-the-loop */}
      {showRejectModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(15, 23, 42, 0.65)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            padding: "1rem",
          }}
        >
          <div
            style={{
              backgroundColor: "#ffffff",
              borderRadius: "12px",
              padding: "1.75rem",
              maxWidth: "600px",
              width: "100%",
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.2)",
              display: "flex",
              flexDirection: "column",
              gap: "1.25rem",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <span style={{ fontSize: "1.4rem" }}>❌</span>
                <h3 style={{ fontSize: "1.15rem", fontWeight: 700, margin: 0, color: "#0f172a" }}>
                  Refuser l&apos;analyse &amp; Demander une révision
                </h3>
              </div>
              <button
                onClick={() => setShowRejectModal(false)}
                style={{ background: "none", border: "none", color: "#64748b", fontSize: "1.2rem", cursor: "pointer" }}
              >
                ✕
              </button>
            </div>

            <p style={{ fontSize: "0.85rem", color: "#475569", margin: 0, lineHeight: "1.5" }}>
              Expliquez à l&apos;agent IA pourquoi cette proposition ne convient pas (critères manquants, tables omises, contraintes réglementaires...). L&apos;agent produira une nouvelle version tenant compte de vos observations.
            </p>

            <div>
              <label style={{ fontSize: "0.82rem", fontWeight: 600, color: "#334155", display: "block", marginBottom: "6px" }}>
                Motif du refus (minimum 10 caractères) *
              </label>
              <textarea
                rows={5}
                placeholder="Exemple : Il faut impérativement contrôler le solde disponible (SOL - SIND) et vérifier que le compte n'est pas sous séquestre dans BKCPT.ETA..."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  borderRadius: "8px",
                  border: "1px solid #cbd5e1",
                  fontSize: "0.88rem",
                  fontFamily: "inherit",
                  boxSizing: "border-box",
                }}
              />
              <div style={{ fontSize: "0.72rem", color: rejectReason.trim().length >= 10 ? "#16a34a" : "#dc2626", marginTop: "4px" }}>
                {rejectReason.trim().length} / 10 caractères minimum
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem" }}>
              <button
                type="button"
                onClick={() => setShowRejectModal(false)}
                disabled={isRejecting}
                style={{
                  padding: "0.6rem 1.1rem",
                  borderRadius: "6px",
                  border: "1px solid #cbd5e1",
                  backgroundColor: "#ffffff",
                  color: "#475569",
                  fontWeight: 600,
                  fontSize: "0.85rem",
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
                  padding: "0.6rem 1.25rem",
                  borderRadius: "6px",
                  border: "none",
                  backgroundColor: isRejecting || rejectReason.trim().length < 10 ? "#94a3b8" : "#dc2626",
                  color: "#ffffff",
                  fontWeight: 700,
                  fontSize: "0.85rem",
                  cursor: isRejecting || rejectReason.trim().length < 10 ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                <span>{isRejecting ? "Génération de la nouvelle version..." : "Confirmer le rejet et ré-analyser"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
