"use client";

import { useState } from "react";
import { AppShell } from "@/modules/layout/AppShell";
import {
  DevelopmentNeedInput,
  CopilotFullPlan,
  CodeReviewFinding,
} from "@/modules/cbs/copilot/types";
import {
  generateCopilotPlan,
  analyzeCbsFailure,
  review4GlCode,
} from "@/modules/cbs/copilot/engine";

export default function CbsCopilotPage() {
  const [activeTab, setActiveTab] = useState<"NEED" | "TASKS" | "CODE" | "PER_SCREEN" | "TESTS" | "DELIVERY" | "FAILURE" | "REVIEW">("NEED");

  // Formulaire Saisie du besoin
  const [needInput, setNeedInput] = useState<DevelopmentNeedInput>({
    title: "Consultation du solde et dernières opérations compte client",
    functionalDescription:
      "Ajouter une fonctionnalité permettant à un gestionnaire d'agence de rechercher un compte client par numéro de compte, d'afficher son solde disponible et de consulter ses dernières opérations comptables.",
    bankingDomain: "Comptes & Relation Client",
    targetUsers: "Gestionnaire de compte / Chargé de clientèle agence",
    knownBusinessRules:
      "Contrôle d'existence du compte, contrôle d'habilitation agence, interdiction de consultation sur compte sous séquestre sans profil Superviseur.",
    inputData: "Numéro de compte (24 caractères)",
    expectedOutput: "Nom du titulaire, solde disponible formaté, statut juridique, historique 10 derniers mouvements",
    specialConstraints: "Temps de réponse inférieur à 300ms, masquage des informations confidentielles non nécessaires",
    amplitudeVersion: "v11.x",
    technicalEnvironment: "Informix / AIX",
    nominalExample: "Compte 001001234567 -> Affiche 'M. DIOP - Solde 1 540 000 XOF - Actif'",
    errorExample: "Compte 999999999999 -> Rejet 'Compte introuvable dans le référentiel CBS'",
  });

  const [generatedPlan, setGeneratedPlan] = useState<CopilotFullPlan>(() => generateCopilotPlan(needInput));

  // Onglet Analyse Point de Rupture
  const [failureInput, setFailureInput] = useState<string>(
    "Erreur SQLCA.SQLCODE = -143 (Deadlock detected on table bkcom during batch UPDATE) - Transaction aborted"
  );
  const [failureResult, setFailureResult] = useState<any>(() => analyzeCbsFailure(failureInput));

  // Onglet Revue de Code 4GL
  const [codeReviewInput, setCodeReviewInput] = useState<string>(`MAIN
    DEFINE v_cpt CHAR(24)
    DEFINE v_solde DECIMAL(18,3)

    SELECT solde_disponible
      FROM bkcom
     WHERE num_compte = v_cpt

    BEGIN WORK
    DELETE FROM bkcom
END MAIN`);
  const [reviewFindings, setReviewFindings] = useState<CodeReviewFinding[]>(() => review4GlCode(codeReviewInput));

  const handleGeneratePlan = () => {
    const plan = generateCopilotPlan(needInput);
    setGeneratedPlan(plan);
    setActiveTab("TASKS");
  };

  const handleExportFullDossier = () => {
    if (!generatedPlan) return;
    const p = generatedPlan;
    const markdown = `# DOSSIER COMPLET DE DÉVELOPPEMENT CBS AMPLITUDE
## MODULE : CBS 4GL DEVELOPMENT COPILOT
**Titre :** ${p.need.title}  
**Domaine :** ${p.need.bankingDomain} | **Version Amplitude :** ${p.need.amplitudeVersion}  
**Environnement :** ${p.need.technicalEnvironment}  
**Date de génération :** ${new Date(p.generatedDate).toLocaleString("fr-FR")}  
**Règle d'or :** Proposition technique à adapter au dictionnaire de données et aux conventions du projet. Ne jamais considérer comme prêt à déployer sans validation.

---

### 1. SYNTHÈSE & ANALYSE FONCTIONNELLE
- **Objectif :** ${p.analysis.businessObjective}
- **Acteurs :** ${p.analysis.actors.join(", ")}
- **Préconditions :** ${p.analysis.preconditions.join(" / ")}
- **Règles Métier :**
${p.analysis.businessRules.map((r) => `  * ${r}`).join("\n")}
- **Questions à trancher :**
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

    const blob = new Blob([markdown], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `DOSSIER_DEV_CBS_${p.need.title.replace(/\s+/g, "_")}.md`;
    a.click();
  };

  return (
    <AppShell pageTitle="CBS 4GL Development Copilot" eyebrow="INGÉNIERIE & ATELIER DE DÉVELOPPEMENT AMPLITUDE">
      <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        
        {/* EN-TÊTE COPILOT AVEC ACTION EXPORT DOSSIER */}
        <div className="card" style={{ background: "linear-gradient(135deg, #1e1b4b 0%, #0f172a 100%)", color: "#ffffff", border: "1px solid #3730a3" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
            <div>
              <span style={{ fontSize: "0.75rem", letterSpacing: "0.1em", fontWeight: 800, color: "#818cf8", textTransform: "uppercase" }}>
                ATELIER DE CONCEPTION &amp; DÉVELOPPEMENT CBS AMPLITUDE
              </span>
              <h2 style={{ fontSize: "1.35rem", fontWeight: 800, marginTop: "0.2rem" }}>
                CBS 4GL Development Copilot
              </h2>
              <p style={{ fontSize: "0.85rem", color: "#cbd5e1", marginTop: "0.25rem", maxWidth: "800px" }}>
                Transformez un besoin fonctionnel bancaire en plan de développement structuré : analyse, sous-tâches, code Informix 4GL, masque d&apos;écran <code>.per</code>, requêtes SQL, jeux d&apos;essais et plan de rollback.
              </p>
            </div>

            <button
              type="button"
              onClick={handleExportFullDossier}
              className="btn-primary"
              style={{ background: "#4f46e5", border: "none", display: "flex", alignItems: "center", gap: "0.5rem" }}
            >
              📦 Générer le Dossier Complet (.md)
            </button>
          </div>
        </div>

        {/* NAVIGATION PAR ONGLETS */}
        <div style={{ display: "flex", gap: "0.5rem", borderBottom: "1px solid var(--border-light)", paddingBottom: "0.5rem", flexWrap: "wrap" }}>
          <button
            onClick={() => setActiveTab("NEED")}
            className={`btn-ghost ${activeTab === "NEED" ? "btn-primary" : ""}`}
          >
            📝 1. Expression du Besoin
          </button>
          <button
            onClick={() => setActiveTab("TASKS")}
            className={`btn-ghost ${activeTab === "TASKS" ? "btn-primary" : ""}`}
          >
            📋 2. Sous-Tâches &amp; Analyse
          </button>
          <button
            onClick={() => setActiveTab("CODE")}
            className={`btn-ghost ${activeTab === "CODE" ? "btn-primary" : ""}`}
          >
            💻 3. Code Informix 4GL
          </button>
          <button
            onClick={() => setActiveTab("PER_SCREEN")}
            className={`btn-ghost ${activeTab === "PER_SCREEN" ? "btn-primary" : ""}`}
          >
            🖥️ 4. Écran Masque (.per)
          </button>
          <button
            onClick={() => setActiveTab("TESTS")}
            className={`btn-ghost ${activeTab === "TESTS" ? "btn-primary" : ""}`}
          >
            🧪 5. Jeux de Tests
          </button>
          <button
            onClick={() => setActiveTab("DELIVERY")}
            className={`btn-ghost ${activeTab === "DELIVERY" ? "btn-primary" : ""}`}
          >
            🚀 6. Dossier de Livraison
          </button>
          <button
            onClick={() => setActiveTab("FAILURE")}
            className={`btn-ghost ${activeTab === "FAILURE" ? "btn-primary" : ""}`}
            style={{ color: "#ef4444" }}
          >
            🚨 7. Point de Rupture (RUN)
          </button>
          <button
            onClick={() => setActiveTab("REVIEW")}
            className={`btn-ghost ${activeTab === "REVIEW" ? "btn-primary" : ""}`}
            style={{ color: "#f59e0b" }}
          >
            🔍 8. Revue de Code 4GL
          </button>
        </div>

        {/* 1. ONGLET EXPRESSION DU BESOIN */}
        {activeTab === "NEED" && (
          <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "1.5rem" }}>
            <div className="card">
              <h3 style={{ fontSize: "1.1rem", fontWeight: 800, marginBottom: "0.5rem" }}>
                Paramètres du Besoin Métier
              </h3>
              <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "1rem" }}>
                Renseignez le contexte bancaire pour permettre au Copilot de calibrer l&apos;analyse fonctionnelle et l&apos;architecture technique.
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, marginBottom: "0.2rem" }}>
                    Titre du besoin :
                  </label>
                  <input
                    type="text"
                    value={needInput.title}
                    onChange={(e) => setNeedInput({ ...needInput, title: e.target.value })}
                    className="input"
                  />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, marginBottom: "0.2rem" }}>
                      Domaine bancaire CBS :
                    </label>
                    <input
                      type="text"
                      value={needInput.bankingDomain}
                      onChange={(e) => setNeedInput({ ...needInput, bankingDomain: e.target.value })}
                      className="input"
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, marginBottom: "0.2rem" }}>
                      Version d&apos;Amplitude :
                    </label>
                    <select
                      value={needInput.amplitudeVersion}
                      onChange={(e) => setNeedInput({ ...needInput, amplitudeVersion: e.target.value as any })}
                      className="input"
                    >
                      <option value="v10.x">Amplitude v10.x (Informix C-ISAM / Forms)</option>
                      <option value="v11.x">Amplitude v11.x (Informix Dynamic Server / Tuxedo)</option>
                      <option value="v12.x">Amplitude v12.x (Oracle / WebLogic SOA)</option>
                      <option value="v13.x">Amplitude v13.x (Cloud Native / REST API)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, marginBottom: "0.2rem" }}>
                    Description fonctionnelle détaillée :
                  </label>
                  <textarea
                    rows={4}
                    value={needInput.functionalDescription}
                    onChange={(e) => setNeedInput({ ...needInput, functionalDescription: e.target.value })}
                    className="input"
                  />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, marginBottom: "0.2rem" }}>
                      Utilisateurs cibles :
                    </label>
                    <input
                      type="text"
                      value={needInput.targetUsers}
                      onChange={(e) => setNeedInput({ ...needInput, targetUsers: e.target.value })}
                      className="input"
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, marginBottom: "0.2rem" }}>
                      Données d&apos;entrée :
                    </label>
                    <input
                      type="text"
                      value={needInput.inputData}
                      onChange={(e) => setNeedInput({ ...needInput, inputData: e.target.value })}
                      className="input"
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, marginBottom: "0.2rem" }}>
                    Règles métier connues :
                  </label>
                  <textarea
                    rows={2}
                    value={needInput.knownBusinessRules}
                    onChange={(e) => setNeedInput({ ...needInput, knownBusinessRules: e.target.value })}
                    className="input"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleGeneratePlan}
                  className="btn-primary"
                  style={{ alignSelf: "flex-start", marginTop: "0.5rem" }}
                >
                  Analyser &amp; Décomposer en Sous-Tâches →
                </button>
              </div>
            </div>

            {/* RÈGLES D'OR & EXEMPLES */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div className="card" style={{ borderLeft: "5px solid #e60028" }}>
                <h4 style={{ fontSize: "0.95rem", fontWeight: 800, color: "#e60028" }}>
                  ⚠️ Règle Impérative de Conception
                </h4>
                <p style={{ fontSize: "0.85rem", color: "#374151", marginTop: "0.4rem", lineHeight: "1.5" }}>
                  Le code généré par le Copilot est une proposition technique à adapter à la version exacte d&apos;Amplitude, au dictionnaire de données et aux conventions du projet. Il ne doit <b>jamais être considéré comme prêt à déployer automatiquement</b> sans recette préalable.
                </p>
              </div>

              <div className="card" style={{ background: "#f8fafc" }}>
                <h4 style={{ fontSize: "0.9rem", fontWeight: 800 }}>Modèles de Besoins Prêts à l&apos;Emploi</h4>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginTop: "0.5rem" }}>
                  <button
                    type="button"
                    onClick={() => {
                      setNeedInput({
                        title: "Blocage préventif d'un compte client sur alerte fraude",
                        functionalDescription: "Permettre au service conformité d'appliquer immédiatement une opposition administrative sur un compte avec gel des débits et traçage dans la table d'audit.",
                        bankingDomain: "Sécurité & Conformité",
                        targetUsers: "Agent Conformité / Risques",
                        knownBusinessRules: "Double signature obligatoire si solde > 50M FCFA.",
                        inputData: "Numéro de compte, Motif du blocage, Code agent",
                        expectedOutput: "Compte basculé en statut 'BLQ', accusé de réception imprimé",
                        specialConstraints: "Interdiction d'annuler les écritures déjà compensées",
                        amplitudeVersion: "v11.x",
                        technicalEnvironment: "Informix / AIX",
                        nominalExample: "Compte 00100456 -> Passage en statut 'BLQ'",
                        errorExample: "Compte déjà clôturé -> Rejet",
                      });
                    }}
                    className="btn-ghost"
                    style={{ textAlign: "left", fontSize: "0.8rem", border: "1px solid #cbd5e1" }}
                  >
                    🛡️ Cas 1 : Blocage préventif de compte (Conformité)
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setNeedInput({
                        title: "Extraction nocturne des soldes débiteurs non autorisés",
                        functionalDescription: "Programme batch exécuté lors de l'EOD pour identifier tous les comptes présentant un solde négatif sans autorisation de découvert et générer le fichier pour le recouvrement.",
                        bankingDomain: "Engagements & Recouvrement",
                        targetUsers: "Batch Automatique EOD / Direction des Risques",
                        knownBusinessRules: "Exclure les comptes du personnel et comptes internes de la banque.",
                        inputData: "Date valeur d'arrêté EOD",
                        expectedOutput: "Fichier CSV normé déposé sur le serveur SFTP sécurisé",
                        specialConstraints: "Temps de traitement batch < 5 minutes sur 500 000 comptes",
                        amplitudeVersion: "v12.x",
                        technicalEnvironment: "Oracle / Linux",
                        nominalExample: "520 comptes débiteurs extraits",
                        errorExample: "Aucun compte en anomalie",
                      });
                    }}
                    className="btn-ghost"
                    style={{ textAlign: "left", fontSize: "0.8rem", border: "1px solid #cbd5e1" }}
                  >
                    ⚙️ Cas 2 : Batch EOD d'extraction des découverts
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. ONGLET SOUS-TÂCHES & ANALYSE */}
        {activeTab === "TASKS" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            {/* Synthèse fonctionnelle */}
            <div className="card" style={{ background: "#f8fafc" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
                <h3 style={{ fontSize: "1.1rem", fontWeight: 800 }}>Synthèse de l&apos;Analyse Fonctionnelle</h3>
                <span style={{ fontSize: "0.75rem", background: "#e0e7ff", color: "#3730a3", padding: "0.2rem 0.6rem", borderRadius: "4px", fontWeight: 700 }}>
                  Domaine : {generatedPlan.need.bankingDomain}
                </span>
              </div>
              <p style={{ fontSize: "0.9rem", color: "#334155", lineHeight: "1.5" }}>
                {generatedPlan.analysis.businessObjective}
              </p>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1rem", marginTop: "1rem" }}>
                <div style={{ background: "#ffffff", padding: "0.75rem", borderRadius: "6px", border: "1px solid #e2e8f0" }}>
                  <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#64748b" }}>Règles Métier Identifiées :</span>
                  <ul style={{ margin: "0.3rem 0 0 1rem", padding: 0, fontSize: "0.8rem", color: "#0f172a" }}>
                    {generatedPlan.analysis.businessRules.map((r, i) => (
                      <li key={i}>{r}</li>
                    ))}
                  </ul>
                </div>

                <div style={{ background: "#ffffff", padding: "0.75rem", borderRadius: "6px", border: "1px solid #e2e8f0" }}>
                  <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#b91c1c" }}>Points à Vérifier (Dictionnaire) :</span>
                  <ul style={{ margin: "0.3rem 0 0 1rem", padding: 0, fontSize: "0.8rem", color: "#b91c1c" }}>
                    {generatedPlan.analysis.unresolvedQuestions.map((q, i) => (
                      <li key={i}>{q}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Liste ordonnée des sous-tâches */}
            <div>
              <h3 style={{ fontSize: "1.1rem", fontWeight: 800, marginBottom: "0.75rem" }}>
                Plan de Décomposition Technique (Sous-Tâches Ordonnées)
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
                {generatedPlan.subTasks.map((task) => (
                  <div
                    key={task.id}
                    className="card"
                    style={{
                      borderLeft: `5px solid ${
                        task.priority === "BLOQUANTE" ? "#ef4444" : task.priority === "HAUTE" ? "#f59e0b" : "#3b82f6"
                      }`,
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "0.5rem" }}>
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                          <span style={{ fontWeight: 800, fontFamily: "monospace", color: "#1e3a8a" }}>{task.id}</span>
                          <span style={{ fontSize: "0.72rem", background: "#f1f5f9", padding: "0.15rem 0.45rem", borderRadius: "4px", fontWeight: 700 }}>
                            {task.type}
                          </span>
                          <h4 style={{ fontSize: "0.95rem", fontWeight: 800, margin: 0 }}>{task.title}</h4>
                        </div>
                        <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginTop: "0.3rem" }}>
                          {task.description}
                        </p>
                      </div>

                      <div style={{ textAlign: "right" }}>
                        <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#64748b" }}>
                          Est : <b>{task.estimation}</b>
                        </span>
                      </div>
                    </div>

                    <div style={{ marginTop: "0.75rem", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", fontSize: "0.8rem", background: "#f8fafc", padding: "0.6rem", borderRadius: "6px" }}>
                      <div>
                        <b>Entrées :</b> {task.inputs} <br />
                        <b>Sorties :</b> {task.outputs}
                      </div>
                      <div>
                        <b>Fichiers :</b> <code>{task.concernedFiles.join(", ")}</code>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 3. ONGLET CODE INFORMIX 4GL */}
        {activeTab === "CODE" && (
          <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: "1.5rem" }}>
            <div className="card" style={{ background: "#0f172a", color: "#f8fafc" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
                <span style={{ fontSize: "0.8rem", fontFamily: "monospace", color: "#38bdf8", fontWeight: 700 }}>
                  SOURCE : {generatedPlan.code4GlProposal.entryPoint}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(generatedPlan.code4GlProposal.code4Gl);
                    alert("Code 4GL copié !");
                  }}
                  className="btn-ghost"
                  style={{ fontSize: "0.75rem", padding: "0.2rem 0.5rem", color: "#cbd5e1", border: "1px solid #475569" }}
                >
                  📋 Copier le 4GL
                </button>
              </div>

              <pre
                style={{
                  fontFamily: "monospace",
                  fontSize: "0.8rem",
                  lineHeight: "1.4",
                  overflowX: "auto",
                  padding: "0.75rem",
                  background: "#1e293b",
                  borderRadius: "6px",
                  maxHeight: "600px",
                }}
              >
                {generatedPlan.code4GlProposal.code4Gl}
              </pre>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div className="card">
                <h4 style={{ fontSize: "0.95rem", fontWeight: 800, marginBottom: "0.5rem" }}>
                  Architecture &amp; Variables 4GL
                </h4>
                <div style={{ fontSize: "0.82rem", display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                  <p><b>Type :</b> {generatedPlan.code4GlProposal.programType}</p>
                  <p><b>Paramètres :</b> {generatedPlan.code4GlProposal.parameters.join(", ")}</p>
                  <p><b>Gestion Erreurs :</b> {generatedPlan.code4GlProposal.errorHandling}</p>
                  <p><b>Contrôle Transactions :</b> {generatedPlan.code4GlProposal.transactionControl}</p>
                </div>
              </div>

              <div className="card">
                <h4 style={{ fontSize: "0.95rem", fontWeight: 800, marginBottom: "0.5rem" }}>
                  Requête SQL Associée
                </h4>
                <pre
                  style={{
                    fontFamily: "monospace",
                    fontSize: "0.78rem",
                    padding: "0.6rem",
                    background: "#f1f5f9",
                    borderRadius: "6px",
                    overflowX: "auto",
                  }}
                >
                  {generatedPlan.sqlProposal.sqlCode}
                </pre>
              </div>
            </div>
          </div>
        )}

        {/* 4. ONGLET ÉCRAN MASQUE (.PER) */}
        {activeTab === "PER_SCREEN" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            {generatedPlan.perScreen ? (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
                <div className="card">
                  <h3 style={{ fontSize: "1.1rem", fontWeight: 800, marginBottom: "0.5rem" }}>
                    Maquette Visuelle Indicative (Terminal 24x80)
                  </h3>
                  <pre
                    style={{
                      fontFamily: "monospace",
                      fontSize: "0.78rem",
                      background: "#09090b",
                      color: "#22c55e",
                      padding: "1rem",
                      borderRadius: "8px",
                      overflowX: "auto",
                      lineHeight: "1.3",
                    }}
                  >
                    {generatedPlan.perScreen.visualMockupAscii}
                  </pre>
                </div>

                <div className="card">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                    <h3 style={{ fontSize: "1.1rem", fontWeight: 800 }}>Source Masque (.per)</h3>
                    <span style={{ fontSize: "0.75rem", fontFamily: "monospace", color: "#64748b" }}>
                      {generatedPlan.perScreen.screenName}
                    </span>
                  </div>
                  <pre
                    style={{
                      fontFamily: "monospace",
                      fontSize: "0.78rem",
                      background: "#f8fafc",
                      padding: "1rem",
                      borderRadius: "8px",
                      overflowX: "auto",
                      border: "1px solid #e2e8f0",
                    }}
                  >
                    {generatedPlan.perScreen.perCodeSnippet}
                  </pre>
                </div>
              </div>
            ) : (
              <div className="card" style={{ textAlign: "center", padding: "3rem" }}>
                <span style={{ fontSize: "2rem" }}>ℹ️</span>
                <h4 style={{ marginTop: "0.5rem" }}>Aucune IHM requise pour ce besoin</h4>
                <p style={{ fontSize: "0.85rem", color: "#64748b" }}>
                  Ce traitement est qualifié comme service Batch ou API interne sans interaction écran .per.
                </p>
              </div>
            )}
          </div>
        )}

        {/* 5. ONGLET JEUX DE TESTS */}
        {activeTab === "TESTS" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <h3 style={{ fontSize: "1.1rem", fontWeight: 800 }}>Matrice des Scénarios de Test Unitaires</h3>
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th style={{ width: "90px" }}>ID</th>
                    <th style={{ width: "120px" }}>Catégorie</th>
                    <th>Intitulé du Test</th>
                    <th>Préconditions</th>
                    <th>Résultat Attendu</th>
                  </tr>
                </thead>
                <tbody>
                  {generatedPlan.testCases.map((tc) => (
                    <tr key={tc.id}>
                      <td style={{ fontWeight: 800, fontFamily: "monospace" }}>{tc.id}</td>
                      <td>
                        <span style={{ fontSize: "0.75rem", fontWeight: 700, padding: "0.2rem 0.5rem", borderRadius: "4px", background: "#f1f5f9" }}>
                          {tc.category}
                        </span>
                      </td>
                      <td style={{ fontWeight: 700 }}>{tc.title}</td>
                      <td style={{ fontSize: "0.82rem", color: "#475569" }}>{tc.preconditions}</td>
                      <td style={{ fontSize: "0.82rem", color: "#047857", fontWeight: 600 }}>{tc.expectedResult}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 6. ONGLET DOSSIER DE LIVRAISON */}
        {activeTab === "DELIVERY" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
            <div className="card">
              <h3 style={{ fontSize: "1.1rem", fontWeight: 800, marginBottom: "0.75rem" }}>
                Procédure de Déploiement &amp; Fichiers
              </h3>
              <div style={{ fontSize: "0.85rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <p><b>Fichiers modifiés :</b></p>
                <ul style={{ margin: "0 0 0 1rem", padding: 0 }}>
                  {generatedPlan.deliveryPackage.modifiedFiles.map((f, i) => (
                    <li key={i}><code>{f}</code></li>
                  ))}
                </ul>

                <p style={{ marginTop: "0.5rem" }}><b>Ordre d&apos;installation séquentiel :</b></p>
                <ol style={{ margin: "0 0 0 1rem", padding: 0 }}>
                  {generatedPlan.deliveryPackage.installationOrder.map((step, i) => (
                    <li key={i}>{step}</li>
                  ))}
                </ol>
              </div>
            </div>

            <div className="card" style={{ borderLeft: "5px solid #dc2626" }}>
              <h3 style={{ fontSize: "1.1rem", fontWeight: 800, color: "#dc2626", marginBottom: "0.75rem" }}>
                Plan de Retour Arrière Immédiat (Rollback)
              </h3>
              <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "0.75rem" }}>
                En cas d&apos;anomalie bloquante constatée lors des tests pilotes en production, appliquer rigoureusement ce plan en moins de 10 minutes :
              </p>
              <ul style={{ margin: "0 0 0 1rem", padding: 0, fontSize: "0.85rem", color: "#991b1b", display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                {generatedPlan.deliveryPackage.rollbackPlan.map((r, i) => (
                  <li key={i}><b>{r}</b></li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* 7. ONGLET POINT DE RUPTURE (RUN) */}
        {activeTab === "FAILURE" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
            <div className="card">
              <h3 style={{ fontSize: "1.1rem", fontWeight: 800, marginBottom: "0.5rem" }}>
                Diagnostic du Point de Rupture (Crash / Timeout)
              </h3>
              <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "1rem" }}>
                Collez un extrait de log, une erreur SQLCA ou le comportement anormal observé en production.
              </p>

              <textarea
                rows={4}
                value={failureInput}
                onChange={(e) => setFailureInput(e.target.value)}
                className="input"
                style={{ fontFamily: "monospace", fontSize: "0.8rem" }}
              />

              <button
                type="button"
                onClick={() => setFailureResult(analyzeCbsFailure(failureInput))}
                className="btn-primary"
                style={{ alignSelf: "flex-start", marginTop: "0.75rem", background: "#ef4444" }}
              >
                Diagnostiquer la Rupture →
              </button>
            </div>

            {failureResult && (
              <div className="card" style={{ background: "#fef2f2", border: "1px solid #fecaca" }}>
                <h4 style={{ fontSize: "1rem", fontWeight: 800, color: "#991b1b", marginBottom: "0.5rem" }}>
                  Résultat du Diagnostic RUN
                </h4>
                <div style={{ fontSize: "0.85rem", display: "flex", flexDirection: "column", gap: "0.4rem", color: "#7f1d1d" }}>
                  <p><b>Étape concernée :</b> {failureResult.step}</p>
                  <p><b>Programme probable :</b> <code>{failureResult.probableProgram}</code></p>
                  <p><b>Cause racine possible :</b> {failureResult.rootCause}</p>
                  <p><b>Correction proposée :</b> {failureResult.recommendedFix}</p>
                  <p><b>Test de validation :</b> {failureResult.validationTest}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 8. ONGLET REVUE DE CODE 4GL */}
        {activeTab === "REVIEW" && (
          <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1.2fr", gap: "1.5rem" }}>
            <div className="card">
              <h3 style={{ fontSize: "1.1rem", fontWeight: 800, marginBottom: "0.5rem" }}>
                Revue Statique de Code 4GL
              </h3>
              <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "0.75rem" }}>
                Collez votre code 4GL pour détecter les erreurs de transactions, verrous et failles de sécurité :
              </p>

              <textarea
                rows={12}
                value={codeReviewInput}
                onChange={(e) => setCodeReviewInput(e.target.value)}
                className="input"
                style={{ fontFamily: "monospace", fontSize: "0.8rem", background: "#0f172a", color: "#f8fafc" }}
              />

              <button
                type="button"
                onClick={() => setReviewFindings(review4GlCode(codeReviewInput))}
                className="btn-primary"
                style={{ alignSelf: "flex-start", marginTop: "0.75rem" }}
              >
                Lancer la Revue de Code →
              </button>
            </div>

            <div className="card">
              <h3 style={{ fontSize: "1.1rem", fontWeight: 800, marginBottom: "0.75rem" }}>
                Anomalies &amp; Recommandations ({reviewFindings.length})
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {reviewFindings.length === 0 ? (
                  <p style={{ color: "#10b981", fontWeight: 700 }}>✓ Aucune anomalie bloquante détectée.</p>
                ) : (
                  reviewFindings.map((f) => (
                    <div
                      key={f.id}
                      style={{
                        padding: "0.75rem",
                        borderRadius: "6px",
                        background: f.severity === "BLOQUANTE" ? "#fef2f2" : "#fffbeb",
                        border: `1px solid ${f.severity === "BLOQUANTE" ? "#f87171" : "#fcd34d"}`,
                        fontSize: "0.82rem",
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 800 }}>
                        <span style={{ color: f.severity === "BLOQUANTE" ? "#b91c1c" : "#b45309" }}>
                          [{f.severity}] {f.description} ({f.location})
                        </span>
                        <span>{f.category}</span>
                      </div>
                      <p style={{ margin: "0.3rem 0", color: "#374151" }}>{f.explanation}</p>
                      <p style={{ margin: 0, color: "#047857", fontWeight: 700 }}>👉 {f.proposedFix}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
