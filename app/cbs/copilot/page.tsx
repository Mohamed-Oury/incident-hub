"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  DevelopmentNeedInput,
  CopilotFullPlan,
  CodeReviewFinding,
  CopilotProject,
} from "@/modules/cbs/copilot/types";
import {
  generateCopilotPlan,
  analyzeCbsFailure,
  review4GlCode,
} from "@/modules/cbs/copilot/engine";
import { CBS_SCHEMA_TABLES, CbsTableDefinition } from "@/modules/cbs/cbs-advanced-data";

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

export default function CbsCopilotPage() {
  const [activeTab, setActiveTab] = useState<
    "NEED" | "TASKS" | "CODE" | "PER_SCREEN" | "SQL" | "TESTS" | "DELIVERY" | "FAILURE" | "REVIEW" | "DICTIONARY"
  >("NEED");

  // Formulaire Saisie du besoin
  const [needInput, setNeedInput] = useState<DevelopmentNeedInput>(PRESET_NEEDS[0].input);
  const [generatedPlan, setGeneratedPlan] = useState<CopilotFullPlan>(() => generateCopilotPlan(PRESET_NEEDS[0].input));

  // Onglet Analyse Point de Rupture
  const [failureInput, setFailureInput] = useState<string>(
    "Erreur SQLCA.SQLCODE = -143 (Deadlock detected on table bkcpt during batch UPDATE) - Transaction aborted"
  );
  const [failureResult, setFailureResult] = useState<any>(() => analyzeCbsFailure(failureInput));

  // Onglet Revue de Code 4GL
  const [codeReviewInput, setCodeReviewInput] = useState<string>(`MAIN
    DEFINE v_age VARCHAR(5)
    DEFINE v_ncp VARCHAR(11)
    DEFINE v_sol DECIMAL(19,4)

    SELECT sol
      FROM bkcpt
     WHERE ncp = v_ncp

    BEGIN WORK
    DELETE FROM bkcpt
END MAIN`);
  const [reviewFindings, setReviewFindings] = useState<CodeReviewFinding[]>(() => review4GlCode(codeReviewInput));

  // Projets enregistrés & Persistance
  const [savedProjects, setSavedProjects] = useState<CopilotProject[]>([]);
  const [showProjectsModal, setShowProjectsModal] = useState<boolean>(false);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [dbSearch, setDbSearch] = useState<string>("");
  const [selectedDbTable, setSelectedDbTable] = useState<CbsTableDefinition>(CBS_SCHEMA_TABLES[1]); // BKCPT par défaut

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

  // Filtrage du dictionnaire de tables
  const filteredTables = CBS_SCHEMA_TABLES.filter(
    (t) =>
      t.tableName.toLowerCase().includes(dbSearch.toLowerCase()) ||
      t.module.toLowerCase().includes(dbSearch.toLowerCase()) ||
      t.description.toLowerCase().includes(dbSearch.toLowerCase())
  );

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
            onClick={() => setActiveTab("DICTIONARY")}
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
              cursor: "pointer",
              fontWeight: 600,
            }}
            title="Cliquez pour consulter le dictionnaire des tables Amplitude"
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
          { key: "TESTS", label: "6. Jeux de Tests", icon: "🧪" },
          { key: "DELIVERY", label: "7. Dossier de Livraison", icon: "🚀" },
          { key: "FAILURE", label: "8. Point de Rupture RUN", icon: "🚨", alert: true },
          { key: "REVIEW", label: "9. Revue de Code 4GL", icon: "🔍", warning: true },
          { key: "DICTIONARY", label: "10. Dictionnaire BD", icon: "🗃️", success: true },
        ].map((tab) => {
          const isActive = activeTab === tab.key;
          let bg = isActive ? "#0284c7" : "#f8fafc";
          let color = isActive ? "#ffffff" : "#475569";
          let border = isActive ? "1px solid #0284c7" : "1px solid #e2e8f0";

          if (!isActive && tab.alert) {
            color = "#b91c1c";
            bg = "#fef2f2";
            border = "1px solid #fecaca";
          } else if (!isActive && tab.warning) {
            color = "#b45309";
            bg = "#fffbeb";
            border = "1px solid #fde68a";
          } else if (!isActive && tab.success) {
            color = "#047857";
            bg = "#ecfdf5";
            border = "1px solid #a7f3d0";
          }

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
                  <button
                    onClick={() => setActiveTab("DICTIONARY")}
                    style={{ background: "none", border: "none", color: "#0284c7", fontSize: "0.78rem", cursor: "pointer", fontWeight: 600, textDecoration: "underline" }}
                  >
                    Voir toutes les tables →
                  </button>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  {CBS_SCHEMA_TABLES.slice(0, 4).map((t) => (
                    <div
                      key={t.tableName}
                      onClick={() => {
                        setSelectedDbTable(t);
                        setActiveTab("DICTIONARY");
                      }}
                      style={{
                        padding: "0.6rem 0.8rem",
                        backgroundColor: "#f8fafc",
                        border: "1px solid #e2e8f0",
                        borderRadius: "8px",
                        cursor: "pointer",
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

              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {generatedPlan.subTasks.map((task) => (
                  <div
                    key={task.id}
                    style={{
                      backgroundColor: "#f8fafc",
                      border: "1px solid #e2e8f0",
                      borderRadius: "8px",
                      padding: "1rem",
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                      gap: "1rem",
                      alignItems: "center",
                    }}
                  >
                    <div>
                      <span
                        style={{
                          backgroundColor: "#eff6ff",
                          color: "#1d4ed8",
                          border: "1px solid #bfdbfe",
                          padding: "2px 8px",
                          borderRadius: "4px",
                          fontSize: "0.75rem",
                          fontWeight: 700,
                        }}
                      >
                        {task.id}
                      </span>
                      <div style={{ fontSize: "0.75rem", color: "#64748b", marginTop: "4px" }}>{task.estimation}</div>
                    </div>

                    <div>
                      <div style={{ fontWeight: 700, fontSize: "0.9rem", color: "#0f172a" }}>{task.title}</div>
                      <div style={{ fontSize: "0.8rem", color: "#475569", marginTop: "2px" }}>{task.description}</div>
                    </div>

                    <div>
                      <div style={{ fontSize: "0.72rem", color: "#64748b", fontWeight: 600 }}>CRITÈRES D&apos;ACCEPTATION</div>
                      <div style={{ fontSize: "0.78rem", color: "#334155", marginTop: "2px" }}>
                        {task.acceptanceCriteria[0]}
                      </div>
                    </div>

                    <div>
                      <div style={{ fontSize: "0.72rem", color: "#64748b", fontWeight: 600 }}>FICHIERS CIBLES</div>
                      <div style={{ fontSize: "0.78rem", color: "#4338ca", fontFamily: "monospace" }}>
                        {task.concernedFiles.join(", ")}
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
        {/* ONGLET 6 : JEUX DE TESTS & RECETTE */}
        {/* --------------------------------------------------------------------- */}
        {activeTab === "TESTS" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem", width: "100%", boxSizing: "border-box" }}>
            <h3 style={{ fontSize: "1.15rem", fontWeight: 700, margin: 0, color: "#0f172a" }}>
              Matrice de Qualification &amp; Recette Technique ({generatedPlan.testCases.length} Cas de Test)
            </h3>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {generatedPlan.testCases.map((tc) => (
                <div
                  key={tc.id}
                  style={{
                    backgroundColor: "#ffffff",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                    padding: "1rem",
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                    gap: "1rem",
                    alignItems: "center",
                    boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
                  }}
                >
                  <div>
                    <span
                      style={{
                        backgroundColor:
                          tc.category === "NOMINAL"
                            ? "#ecfdf5"
                            : tc.category === "ERREUR"
                            ? "#fef2f2"
                            : tc.category === "DROITS"
                            ? "#fffbeb"
                            : "#eff6ff",
                        color:
                          tc.category === "NOMINAL"
                            ? "#047857"
                            : tc.category === "ERREUR"
                            ? "#b91c1c"
                            : tc.category === "DROITS"
                            ? "#b45309"
                            : "#1d4ed8",
                        border: "1px solid currentColor",
                        padding: "2px 8px",
                        borderRadius: "4px",
                        fontSize: "0.72rem",
                        fontWeight: 700,
                      }}
                    >
                      {tc.id} • {tc.category}
                    </span>
                  </div>

                  <div>
                    <div style={{ fontWeight: 700, fontSize: "0.9rem", color: "#0f172a" }}>{tc.title}</div>
                    <div style={{ fontSize: "0.78rem", color: "#64748b", marginTop: "4px" }}>
                      <strong>Préconditions :</strong> {tc.preconditions}
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: "0.72rem", color: "#64748b", fontWeight: 600 }}>RÉSULTAT ATTENDU</div>
                    <div style={{ fontSize: "0.82rem", color: "#334155", marginTop: "2px" }}>{tc.expectedResult}</div>
                  </div>

                  <div style={{ textAlign: "right" }}>
                    <span
                      style={{
                        backgroundColor: "#f1f5f9",
                        color: "#0284c7",
                        border: "1px solid #cbd5e1",
                        padding: "4px 10px",
                        borderRadius: "6px",
                        fontSize: "0.75rem",
                        fontWeight: 700,
                      }}
                    >
                      A_TESTER
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --------------------------------------------------------------------- */}
        {/* ONGLET 7 : DOSSIER DE LIVRAISON & PLAN DE ROLLBACK */}
        {/* --------------------------------------------------------------------- */}
        {activeTab === "DELIVERY" && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "1.5rem", width: "100%", boxSizing: "border-box" }}>
            <div style={{ backgroundColor: "#ffffff", borderRadius: "12px", border: "1px solid #e2e8f0", padding: "1.5rem", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
              <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "0.75rem", color: "#0369a1" }}>
                📦 Procédure d&apos;Installation &amp; Fiche MEP
              </h3>
              <div style={{ fontSize: "0.82rem", color: "#64748b", marginBottom: "1rem" }}>
                Ordre strict d&apos;exécution sur le serveur de production AIX / Linux :
              </div>
              <ol style={{ margin: 0, paddingLeft: "1.25rem", fontSize: "0.85rem", color: "#1e293b", lineHeight: "1.6" }}>
                {generatedPlan.deliveryPackage.installationOrder.map((step, idx) => (
                  <li key={idx} style={{ marginBottom: "0.5rem" }}>
                    <code style={{ color: "#1d4ed8", backgroundColor: "#f1f5f9", padding: "3px 6px", borderRadius: "4px", border: "1px solid #e2e8f0" }}>
                      {step}
                    </code>
                  </li>
                ))}
              </ol>
            </div>

            <div style={{ backgroundColor: "#ffffff", borderRadius: "12px", border: "1px solid #fecaca", padding: "1.5rem", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
              <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "0.75rem", color: "#b91c1c" }}>
                🚨 Plan de Retour Arrière Immédiat (Rollback)
              </h3>
              <div style={{ fontSize: "0.82rem", color: "#64748b", marginBottom: "1rem" }}>
                À exécuter sous 10 minutes en cas d&apos;anomalie critique constatée :
              </div>
              <ul style={{ margin: 0, paddingLeft: "1.25rem", fontSize: "0.85rem", color: "#991b1b", lineHeight: "1.6" }}>
                {generatedPlan.deliveryPackage.rollbackPlan.map((r, idx) => (
                  <li key={idx} style={{ marginBottom: "0.4rem" }}>
                    {r}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* --------------------------------------------------------------------- */}
        {/* ONGLET 8 : POINT DE RUPTURE RUN (DIAGNOSTIC D'INCIDENTS PRODUCTION) */}
        {/* --------------------------------------------------------------------- */}
        {activeTab === "FAILURE" && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "1.5rem", width: "100%", boxSizing: "border-box" }}>
            <div style={{ backgroundColor: "#ffffff", borderRadius: "12px", border: "1px solid #fecaca", padding: "1.5rem", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
              <h3 style={{ fontSize: "1.15rem", fontWeight: 700, marginBottom: "0.5rem", color: "#b91c1c" }}>
                🚨 Diagnostic d&apos;un Point de Rupture Core Banking (RUN)
              </h3>
              <p style={{ fontSize: "0.82rem", color: "#64748b", marginBottom: "1rem" }}>
                Collez un message d&apos;erreur Informix (SQLCA.SQLCODE), Oracle (ORA-XXXXX) ou log batch. Le Copilot en identifiera la cause racine et la procédure de résolution.
              </p>

              <div style={{ marginBottom: "1rem" }}>
                <span style={{ fontSize: "0.75rem", color: "#64748b", fontWeight: 700 }}>Erreurs de production fréquentes :</span>
                <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap", marginTop: "0.4rem" }}>
                  {[
                    "SQLCODE = -143 (Deadlock detected on table bkcpt)",
                    "SQLCODE = -154 (Lock Timeout on table bkcom)",
                    "SQLCODE = 100 (Row Not Found)",
                    "ORA-00054 (resource busy and acquire with NOWAIT specified)",
                    "ORA-01555 (snapshot too old: rollback segment too small)",
                  ].map((err, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setFailureInput(err);
                        setFailureResult(analyzeCbsFailure(err));
                      }}
                      style={{
                        padding: "0.3rem 0.6rem",
                        backgroundColor: "#fef2f2",
                        color: "#991b1b",
                        border: "1px solid #fecaca",
                        borderRadius: "4px",
                        fontSize: "0.72rem",
                        cursor: "pointer",
                        fontWeight: 600,
                      }}
                    >
                      {err.split(" ")[0]} {err.split(" ")[1] || ""}
                    </button>
                  ))}
                </div>
              </div>

              <textarea
                rows={4}
                value={failureInput}
                onChange={(e) => setFailureInput(e.target.value)}
                style={{
                  width: "100%",
                  backgroundColor: "#ffffff",
                  border: "1px solid #cbd5e1",
                  borderRadius: "6px",
                  padding: "0.75rem",
                  color: "#0f172a",
                  fontSize: "0.85rem",
                  fontFamily: "monospace",
                  boxSizing: "border-box",
                }}
              />

              <button
                onClick={() => setFailureResult(analyzeCbsFailure(failureInput))}
                style={{
                  backgroundColor: "#dc2626",
                  color: "#ffffff",
                  border: "none",
                  borderRadius: "6px",
                  padding: "0.6rem 1.25rem",
                  fontSize: "0.85rem",
                  fontWeight: 700,
                  marginTop: "0.75rem",
                  cursor: "pointer",
                }}
              >
                🔍 Lancer le Diagnostic
              </button>
            </div>

            {/* Résultat du diagnostic */}
            <div style={{ backgroundColor: "#ffffff", borderRadius: "12px", border: "1px solid #e2e8f0", padding: "1.5rem", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
              <h4 style={{ fontSize: "1rem", fontWeight: 700, color: "#b91c1c", margin: "0 0 1rem 0" }}>
                Rapport d&apos;Investigation d&apos;Incident
              </h4>

              {failureResult && (
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", fontSize: "0.85rem" }}>
                  <div style={{ backgroundColor: "#fef2f2", border: "1px solid #fecaca", padding: "0.75rem", borderRadius: "6px" }}>
                    <span style={{ fontSize: "0.72rem", color: "#991b1b", fontWeight: 700 }}>CAUSE RACINE DÉTECTÉE</span>
                    <div style={{ color: "#7f1d1d", fontWeight: 700, marginTop: "2px" }}>{failureResult.rootCause}</div>
                  </div>

                  <div style={{ backgroundColor: "#ecfdf5", border: "1px solid #a7f3d0", padding: "0.75rem", borderRadius: "6px" }}>
                    <span style={{ fontSize: "0.72rem", color: "#047857", fontWeight: 700 }}>PROCÉDURE DE RÉPARATION RECOMMANDÉE</span>
                    <div style={{ color: "#065f46", marginTop: "2px" }}>{failureResult.recommendedFix}</div>
                  </div>

                  <div style={{ backgroundColor: "#f8fafc", border: "1px solid #e2e8f0", padding: "0.75rem", borderRadius: "6px" }}>
                    <span style={{ fontSize: "0.72rem", color: "#64748b", fontWeight: 700 }}>CONTRÔLES SGBD À EXÉCUTER</span>
                    <ul style={{ margin: "4px 0 0 0", paddingLeft: "1.2rem", color: "#334155" }}>
                      {failureResult.checksToPerform.map((c: string, idx: number) => (
                        <li key={idx}><code>{c}</code></li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* --------------------------------------------------------------------- */}
        {/* ONGLET 9 : REVUE DE CODE 4GL AUTOMATISÉE */}
        {/* --------------------------------------------------------------------- */}
        {activeTab === "REVIEW" && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "1.5rem", width: "100%", boxSizing: "border-box" }}>
            <div style={{ backgroundColor: "#ffffff", borderRadius: "12px", border: "1px solid #fde68a", padding: "1.5rem", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
              <h3 style={{ fontSize: "1.15rem", fontWeight: 700, marginBottom: "0.5rem", color: "#b45309" }}>
                🔍 Revue Automatique de Code Informix 4GL
              </h3>
              <p style={{ fontSize: "0.82rem", color: "#64748b", marginBottom: "1rem" }}>
                Vérification statique : détection des requêtes SELECT sans INTO, transactions orphelines, absence de <code>WHENEVER ERROR</code> et suppressions non restreintes.
              </p>

              <textarea
                rows={12}
                value={codeReviewInput}
                onChange={(e) => setCodeReviewInput(e.target.value)}
                style={{
                  width: "100%",
                  backgroundColor: "#ffffff",
                  border: "1px solid #cbd5e1",
                  borderRadius: "6px",
                  padding: "0.75rem",
                  color: "#0f172a",
                  fontSize: "0.85rem",
                  fontFamily: "monospace",
                  boxSizing: "border-box",
                }}
              />

              <button
                onClick={() => setReviewFindings(review4GlCode(codeReviewInput))}
                style={{
                  backgroundColor: "#d97706",
                  color: "#ffffff",
                  border: "none",
                  borderRadius: "6px",
                  padding: "0.6rem 1.25rem",
                  fontSize: "0.85rem",
                  fontWeight: 700,
                  marginTop: "0.75rem",
                  cursor: "pointer",
                }}
              >
                ⚡ Analyser le Code
              </button>
            </div>

            {/* Constats de revue */}
            <div style={{ backgroundColor: "#ffffff", borderRadius: "12px", border: "1px solid #e2e8f0", padding: "1.5rem", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
              <h4 style={{ fontSize: "1rem", fontWeight: 700, color: "#b45309", margin: "0 0 1rem 0" }}>
                Anomalies &amp; Failles Détectées ({reviewFindings.length})
              </h4>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {reviewFindings.length === 0 ? (
                  <div style={{ padding: "2rem", textAlign: "center", color: "#047857", fontWeight: 600 }}>
                    ✅ Aucune anomalie critique détectée dans ce fragment de code 4GL !
                  </div>
                ) : (
                  reviewFindings.map((f) => (
                    <div
                      key={f.id}
                      style={{
                        backgroundColor: f.severity === "BLOQUANTE" ? "#fef2f2" : "#fffbeb",
                        border: f.severity === "BLOQUANTE" ? "1px solid #fecaca" : "1px solid #fde68a",
                        borderRadius: "6px",
                        padding: "0.85rem",
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontWeight: 700, color: f.severity === "BLOQUANTE" ? "#b91c1c" : "#b45309", fontSize: "0.85rem" }}>
                          [{f.severity}] {f.description}
                        </span>
                        <span style={{ fontSize: "0.72rem", color: "#64748b" }}>{f.location}</span>
                      </div>
                      <div style={{ fontSize: "0.8rem", color: "#334155", marginTop: "4px" }}>{f.explanation}</div>
                      <div style={{ fontSize: "0.78rem", color: "#047857", marginTop: "6px", fontWeight: 600 }}>
                        Correction : {f.proposedFix}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* --------------------------------------------------------------------- */}
        {/* ONGLET 10 : EXPLORATEUR DICTIONNAIRE BD AMPLITUDE */}
        {/* --------------------------------------------------------------------- */}
        {activeTab === "DICTIONARY" && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1.5rem", width: "100%", boxSizing: "border-box" }}>
            {/* Colonne latérale : Liste des tables */}
            <div style={{ backgroundColor: "#ffffff", borderRadius: "12px", border: "1px solid #e2e8f0", padding: "1.25rem", height: "calc(100vh - 200px)", display: "flex", flexDirection: "column", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
              <div style={{ marginBottom: "1rem" }}>
                <h4 style={{ fontSize: "1rem", fontWeight: 700, color: "#0284c7", margin: "0 0 0.5rem 0" }}>
                  Tables Maîtresses Amplitude
                </h4>
                <input
                  type="text"
                  placeholder="Filtrer (ex: BKCPT, BKTRA, soldes)..."
                  value={dbSearch}
                  onChange={(e) => setDbSearch(e.target.value)}
                  style={{
                    width: "100%",
                    backgroundColor: "#ffffff",
                    border: "1px solid #cbd5e1",
                    borderRadius: "6px",
                    padding: "0.5rem 0.75rem",
                    color: "#0f172a",
                    fontSize: "0.8rem",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                {filteredTables.map((tbl) => {
                  const isSel = selectedDbTable.tableName === tbl.tableName;
                  return (
                    <div
                      key={tbl.tableName}
                      onClick={() => setSelectedDbTable(tbl)}
                      style={{
                        padding: "0.6rem 0.75rem",
                        backgroundColor: isSel ? "#eff6ff" : "#f8fafc",
                        border: isSel ? "1px solid #3b82f6" : "1px solid #e2e8f0",
                        borderRadius: "6px",
                        cursor: "pointer",
                        transition: "all 0.1s ease",
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontWeight: 700, color: isSel ? "#1d4ed8" : "#0f172a", fontSize: "0.85rem" }}>
                          {tbl.tableName}
                        </span>
                        <span style={{ fontSize: "0.7rem", color: "#64748b" }}>{tbl.columns.length} col.</span>
                      </div>
                      <div style={{ fontSize: "0.75rem", color: "#64748b", marginTop: "2px" }}>{tbl.module}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Panneau principal : Détail de la table sélectionnée */}
            <div style={{ backgroundColor: "#ffffff", borderRadius: "12px", border: "1px solid #e2e8f0", padding: "1.5rem", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem", flexWrap: "wrap", gap: "0.5rem" }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <h3 style={{ fontSize: "1.4rem", fontWeight: 800, margin: 0, color: "#0f172a" }}>
                      {selectedDbTable.tableName}
                    </h3>
                    <span style={{ backgroundColor: "#eff6ff", color: "#1d4ed8", border: "1px solid #bfdbfe", padding: "2px 8px", borderRadius: "4px", fontSize: "0.75rem", fontWeight: 600 }}>
                      {selectedDbTable.module}
                    </span>
                  </div>
                  <p style={{ fontSize: "0.85rem", color: "#475569", margin: "4px 0 0 0" }}>
                    {selectedDbTable.description}
                  </p>
                </div>

                <div style={{ textAlign: "right" }}>
                  <span style={{ fontSize: "0.72rem", color: "#64748b", display: "block" }}>CLÉ PRIMAIRE (PK)</span>
                  <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "#0284c7", fontFamily: "monospace" }}>
                    ({selectedDbTable.primaryKey.join(", ")})
                  </span>
                </div>
              </div>

              {/* Colonnes de la table */}
              <div style={{ marginBottom: "1.5rem" }}>
                <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "#0f172a", marginBottom: "0.6rem" }}>
                  Structure des Colonnes ({selectedDbTable.columns.length} champs réels)
                </div>
                <div style={{ maxHeight: "320px", overflowY: "auto", border: "1px solid #e2e8f0", borderRadius: "6px" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.8rem", textAlign: "left" }}>
                    <thead style={{ backgroundColor: "#f8fafc", borderBottom: "1px solid #e2e8f0", color: "#475569" }}>
                      <tr>
                        <th style={{ padding: "0.5rem 0.75rem" }}>Colonne</th>
                        <th style={{ padding: "0.5rem 0.75rem" }}>Type SGBD</th>
                        <th style={{ padding: "0.5rem 0.75rem" }}>Description Amplitude</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedDbTable.columns.map((col, idx) => (
                        <tr
                          key={col.name}
                          style={{
                            borderBottom: "1px solid #e2e8f0",
                            backgroundColor: idx % 2 === 0 ? "#ffffff" : "#f8fafc",
                          }}
                        >
                          <td style={{ padding: "0.5rem 0.75rem", fontWeight: 700, color: selectedDbTable.primaryKey.includes(col.name) ? "#0284c7" : "#0f172a", fontFamily: "monospace" }}>
                            {col.name} {selectedDbTable.primaryKey.includes(col.name) ? "🔑" : ""}
                          </td>
                          <td style={{ padding: "0.5rem 0.75rem", color: "#4338ca", fontFamily: "monospace" }}>
                            {col.type}
                          </td>
                          <td style={{ padding: "0.5rem 0.75rem", color: "#334155" }}>
                            {col.description}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Requête SQL de consultation de référence */}
              <div>
                <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "#0f172a", marginBottom: "0.4rem" }}>
                  Requête SQL Type d&apos;Exploitation
                </div>
                <div style={{ backgroundColor: "#f8fafc", border: "1px solid #cbd5e1", borderRadius: "6px", padding: "0.85rem", position: "relative" }}>
                  <pre style={{ margin: 0, fontSize: "0.82rem", color: "#0369a1", fontFamily: "monospace", overflowX: "auto" }}>
                    {selectedDbTable.sampleQuery}
                  </pre>
                </div>
                <div style={{ fontSize: "0.75rem", color: "#b91c1c", marginTop: "6px" }}>
                  ⚠️ {selectedDbTable.criticalNotes}
                </div>
              </div>
            </div>
          </div>
        )}
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
