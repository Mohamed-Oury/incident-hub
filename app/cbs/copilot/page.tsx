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
      expectedOutput: "Nom/Prénom titulaire (BKCLI), solde comptable, indisponibilités, solde disponible, historique 10 derniers mouvements",
      specialConstraints: "Temps de réponse inférieur à 300ms, masquage des informations confidentielles non nécessaires",
      amplitudeVersion: "v11.x",
      technicalEnvironment: "Informix / AIX",
      nominalExample: "Agence 00100, Compte 001001234567 -> Affiche 'M. DIOP - Solde 1 540 000 XOF - Actif'",
      errorExample: "Compte 999999999999 -> Rejet 'Compte introuvable dans le référentiel BKCPT'",
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
      expectedOutput: "Numéro d'événement BKTRA généré, solde après écriture, accusé d'imputation comptable",
      specialConstraints: "Exécution dans une transaction unique (BEGIN WORK / COMMIT WORK) avec ROLLBACK immédiat en cas d'incident.",
      amplitudeVersion: "v11.x",
      technicalEnvironment: "Informix / AIX",
      nominalExample: "Débit 500 000 XOF sur CPT-A, Crédit 500 000 XOF sur CPT-B -> Statut SUCCÈS",
      errorExample: "CPT-A solde insuffisant -> Rejet 'Provision insuffisante (Solde dispo < Montant)'",
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
      expectedOutput: "Nouveau SIND calculé, confirmation de prise de garantie",
      specialConstraints: "Latence maximale 120ms pour respecter le SLA Switch monétique.",
      amplitudeVersion: "v11.x",
      technicalEnvironment: "Informix / AIX",
      nominalExample: "Autorisation 50 000 XOF GAB -> SIND passe de 10 000 à 60 000 XOF",
      errorExample: "Dépassement du découvert autorisé -> Code réponse monétique 51 (Fonds insuffisants)",
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
      expectedOutput: "Rapport d'équilibre de balance, code retour 0 (GO BOD) ou 99 (NO GO BOD)",
      specialConstraints: "Exécution sans IHM en mode CLI Unix AIX, journalisation détaillée des comptes déséquilibrés.",
      amplitudeVersion: "v11.x",
      technicalEnvironment: "Informix / AIX",
      nominalExample: "Total Débit XOF = Total Crédit XOF -> Basculement EOD autorisé",
      errorExample: "Écart de 1 250 XOF détecté sur chapitre 4110 -> Blocage immédiat de la chaîne EOD",
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
  expectedOutput: "",
  specialConstraints: "",
  amplitudeVersion: "v11.x",
  technicalEnvironment: "Informix / AIX",
  nominalExample: "",
  errorExample: "",
};

export default function CbsCopilotPage() {
  const [activeTab, setActiveTab] = useState<
    "NEED" | "TASKS" | "CODE" | "PER_SCREEN" | "SQL"
  >("NEED");

  // Formulaire Saisie du besoin (Vide par défaut, aucune donnée d'exemple pré-remplie)
  const [needInput, setNeedInput] = useState<DevelopmentNeedInput>(EMPTY_NEED);
  const [generatedPlan, setGeneratedPlan] = useState<CopilotFullPlan>(() => generateCopilotPlan(EMPTY_NEED));

  // Projets enregistrés & Persistance
  const [savedProjects, setSavedProjects] = useState<CopilotProject[]>([]);
  const [showProjectsModal, setShowProjectsModal] = useState<boolean>(false);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

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

      // Fallback localStorage
      try {
        const local = localStorage.getItem("cbs_copilot_projects");
        if (local) {
          setSavedProjects(JSON.parse(local));
        }
      } catch (err) {
        console.error("Erreur localStorage:", err);
      }
    }
    fetchSavedProjects();
  }, []);

  // Génération du plan
  const handleGeneratePlan = () => {
    const plan = generateCopilotPlan(needInput);
    setGeneratedPlan(plan);
    setActiveTab("TASKS");
  };

  // Sélection d'un préréglage
  const handleSelectPreset = (preset: typeof PRESET_NEEDS[0]) => {
    setNeedInput(preset.input);
    const plan = generateCopilotPlan(preset.input);
    setGeneratedPlan(plan);
  };

  // Sauvegarder le projet en cours (API + LocalStorage)
  const handleSaveProject = async () => {
    setSaveStatus("Enregistrement en cours...");
    const project: CopilotProject = {
      id: "PROJ-" + Date.now(),
      name: needInput.title,
      domain: needInput.bankingDomain,
      amplitudeVersion: needInput.amplitudeVersion,
      input: needInput,
      plan: generatedPlan,
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
    if (proj.plan) {
      setGeneratedPlan(proj.plan);
    } else {
      setGeneratedPlan(generateCopilotPlan(proj.input));
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
    if (!generatedPlan) return;
    const p = generatedPlan;
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

                  <div style={{ minWidth: 0 }}>
                    <label style={{ fontSize: "0.82rem", fontWeight: 600, color: "#334155", display: "block", marginBottom: "4px" }}>
                      Données en Sortie Attendues
                    </label>
                    <input
                      type="text"
                      value={needInput.expectedOutput}
                      onChange={(e) => setNeedInput({ ...needInput, expectedOutput: e.target.value })}
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

                <button
                  type="button"
                  onClick={handleGeneratePlan}
                  style={{
                    backgroundColor: "#0284c7",
                    color: "#ffffff",
                    border: "none",
                    borderRadius: "8px",
                    padding: "0.8rem 1.25rem",
                    fontSize: "0.95rem",
                    fontWeight: 700,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.6rem",
                    marginTop: "0.5rem",
                    boxShadow: "0 2px 6px rgba(2, 132, 199, 0.3)",
                  }}
                >
                  <span>⚡</span>
                  <span>Générer la Solution Technique &amp; Code 4GL</span>
                </button>
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
            {/* Synthèse fonctionnelle */}
            <div style={{ backgroundColor: "#ffffff", borderRadius: "12px", border: "1px solid #e2e8f0", padding: "1.5rem", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem", flexWrap: "wrap", gap: "1rem" }}>
                <div>
                  <span style={{ fontSize: "0.75rem", color: "#0284c7", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 700 }}>
                    SYNTHÈSE TECHNIQUE &amp; FONCTIONNELLE
                  </span>
                  <h3 style={{ fontSize: "1.25rem", fontWeight: 700, margin: "4px 0", color: "#0f172a" }}>
                    {generatedPlan.analysis.summary}
                  </h3>
                  <p style={{ fontSize: "0.88rem", color: "#475569", margin: 0 }}>
                    {generatedPlan.analysis.businessObjective}
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
                    {generatedPlan.analysis.preconditions.map((p, i) => (
                      <li key={i}>{p}</li>
                    ))}
                  </ul>
                </div>

                <div style={{ backgroundColor: "#f8fafc", padding: "0.85rem", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
                  <div style={{ fontSize: "0.75rem", color: "#64748b", fontWeight: 700, marginBottom: "0.4rem" }}>RÈGLES MÉTIER CONTRÔLÉES</div>
                  <ul style={{ margin: 0, paddingLeft: "1.1rem", fontSize: "0.82rem", color: "#334155", lineHeight: "1.5" }}>
                    {generatedPlan.analysis.businessRules.map((r, i) => (
                      <li key={i}>{r}</li>
                    ))}
                  </ul>
                </div>

                <div style={{ backgroundColor: "#fef2f2", padding: "0.85rem", borderRadius: "8px", border: "1px solid #fecaca" }}>
                  <div style={{ fontSize: "0.75rem", color: "#b91c1c", fontWeight: 700, marginBottom: "0.4rem" }}>RISQUES TECHNIQUES</div>
                  <ul style={{ margin: 0, paddingLeft: "1.1rem", fontSize: "0.82rem", color: "#991b1b", lineHeight: "1.5" }}>
                    {generatedPlan.analysis.technicalRisks.map((tr, i) => (
                      <li key={i}>{tr}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Liste des sous-tâches ordonnées */}
            <div style={{ backgroundColor: "#ffffff", borderRadius: "12px", border: "1px solid #e2e8f0", padding: "1.5rem", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
              <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "1rem", color: "#0f172a" }}>
                Plan de Développement &amp; Sous-Tâches ({generatedPlan.subTasks.length} Tâches Ordonnées)
              </h3>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", width: "100%", boxSizing: "border-box" }}>
                {generatedPlan.subTasks.map((task) => (
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
                        }}
                      >
                        {task.id}
                      </span>
                      <div style={{ fontSize: "0.75rem", color: "#64748b", marginTop: "4px" }}>{task.estimation}</div>
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
          </div>
        )}

        {/* --------------------------------------------------------------------- */}
        {/* ONGLET 3 : CODE INFORMIX 4GL (THEME CLAIR AVEC TÉLÉCHARGEMENT) */}
        {/* --------------------------------------------------------------------- */}
        {activeTab === "CODE" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem", width: "100%", boxSizing: "border-box" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.75rem" }}>
              <div>
                <h3 style={{ fontSize: "1.15rem", fontWeight: 700, margin: 0, color: "#0f172a" }}>
                  Code Informix 4GL Généré (Sopra Banking Amplitude)
                </h3>
                <p style={{ fontSize: "0.82rem", color: "#64748b", margin: "2px 0 0 0" }}>
                  Programme autonome exploitant les tables <code>BKCPT</code>, <code>BKCLI</code> et <code>BKTRA</code> avec gestion transactionnelle et contrôle <code>SQLCA.SQLCODE</code>.
                </p>
              </div>

              <div style={{ display: "flex", gap: "0.5rem" }}>
                <button
                  onClick={() => copyToClipboard(generatedPlan.code4GlProposal.code4Gl, "4gl")}
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
                      generatedPlan.code4GlProposal.code4Gl,
                      `${generatedPlan.code4GlProposal.entryPoint.split(" ")[0].toLowerCase() || "p_cbs_traitement"}.4gl`,
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
                <code>{generatedPlan.code4GlProposal.code4Gl}</code>
              </pre>
            </div>

            {/* Notes d'architecture */}
            <div style={{ backgroundColor: "#ffffff", borderRadius: "8px", border: "1px solid #e2e8f0", padding: "1rem" }}>
              <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "#0369a1", marginBottom: "0.4rem" }}>
                RECOMMANDATIONS D&apos;EXPLOITATION RUN / BUILD AMPLITUDE
              </div>
              <ul style={{ margin: 0, paddingLeft: "1.25rem", fontSize: "0.82rem", color: "#334155", lineHeight: "1.6" }}>
                {generatedPlan.code4GlProposal.importantNotes.map((note, i) => (
                  <li key={i}>{note}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* --------------------------------------------------------------------- */}
        {/* ONGLET 4 : ECRAN MASQUE (.PER) */}
        {/* --------------------------------------------------------------------- */}
        {activeTab === "PER_SCREEN" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem", width: "100%", boxSizing: "border-box" }}>
            {generatedPlan.perScreen ? (
              <>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.75rem" }}>
                  <div>
                    <h3 style={{ fontSize: "1.15rem", fontWeight: 700, margin: 0, color: "#0f172a" }}>
                      Conception du Masque d&apos;Écran Formulaire (.per)
                    </h3>
                    <p style={{ fontSize: "0.82rem", color: "#64748b", margin: "2px 0 0 0" }}>
                      Masque terminal Curses 24x80 pour AIX / Linux avec mapping champs tables <code>BKCPT</code> et <code>BKCLI</code>.
                    </p>
                  </div>

                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <button
                      onClick={() => copyToClipboard(generatedPlan.perScreen!.perCodeSnippet, "per")}
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
                          generatedPlan.perScreen!.perCodeSnippet,
                          generatedPlan.perScreen!.screenName,
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

                {/* Rendu visuel ASCII du masque terminal */}
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
                    {generatedPlan.perScreen.visualMockupAscii}
                  </pre>
                </div>

                {/* Code source .per */}
                <div style={{ backgroundColor: "#ffffff", borderRadius: "8px", border: "1px solid #e2e8f0", padding: "1.25rem", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
                  <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "#0284c7", marginBottom: "0.6rem" }}>
                    📄 SOURCE INFORMIX FORMULAIRE ({generatedPlan.perScreen.screenName})
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
                    {generatedPlan.perScreen.perCodeSnippet}
                  </pre>
                </div>
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
                  onClick={() => copyToClipboard(generatedPlan.sqlProposal.sqlCode, "sql")}
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
                  onClick={() => downloadFile(generatedPlan.sqlProposal.sqlCode, "cbs_requetes_optimisees.sql", "text/plain")}
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
                <code>{generatedPlan.sqlProposal.sqlCode}</code>
              </pre>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1rem" }}>
              <div style={{ backgroundColor: "#ffffff", borderRadius: "8px", border: "1px solid #fecaca", padding: "1rem" }}>
                <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "#b91c1c", marginBottom: "0.4rem" }}>
                  ⚠️ RISQUES DE PERFORMANCE &amp; FULL TABLE SCAN
                </div>
                <ul style={{ margin: 0, paddingLeft: "1.25rem", fontSize: "0.82rem", color: "#475569", lineHeight: "1.5" }}>
                  {generatedPlan.sqlProposal.performanceRisks.map((r, i) => (
                    <li key={i}>{r}</li>
                  ))}
                </ul>
              </div>

              <div style={{ backgroundColor: "#ffffff", borderRadius: "8px", border: "1px solid #a7f3d0", padding: "1rem" }}>
                <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "#047857", marginBottom: "0.4rem" }}>
                  🔒 CONSIGNES DE SÉCURITÉ &amp; CONFIDENTIALITÉ
                </div>
                <ul style={{ margin: 0, paddingLeft: "1.25rem", fontSize: "0.82rem", color: "#475569", lineHeight: "1.5" }}>
                  {generatedPlan.sqlProposal.securityPrecautions.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </div>
            </div>
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
    </div>
  );
}
