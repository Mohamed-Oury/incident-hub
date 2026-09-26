"use client";

import { useState, useEffect } from "react";
import { AppShell } from "@/modules/layout/AppShell";
import {
  CustomPerScreen,
  CbsPerScreenLayoutType,
  CbsPerSyntaxMode,
  CbsPerSchemaHeader,
  generateCustomPerScreen
} from "@/modules/cbs/cbs-screen-builder";
import { GeneroGuiWindow } from "@/modules/cbs/GeneroGuiWindow";

export default function PerStudioPage() {
  const [studioPrompt, setStudioPrompt] = useState<string>("");
  const [studioTitle, setStudioTitle] = useState<string>("Écran Consultation Guichet & Soldes");
  const [studioDomain, setStudioDomain] = useState<string>("Comptes & Guichet");
  const [studioLayoutType, setStudioLayoutType] = useState<CbsPerScreenLayoutType>("STANDARD_FORM");
  const [studioSyntaxMode, setStudioSyntaxMode] = useState<CbsPerSyntaxMode>("GUI_GENERO");
  const [studioSchemaHeader, setStudioSchemaHeader] = useState<CbsPerSchemaHeader>("SCHEMA");
  const [activeStudioPreviewTab, setActiveStudioPreviewTab] = useState<"gui" | "per" | "4gl" | "terminal" | "fields">("gui");
  const [currentCustomScreen, setCurrentCustomScreen] = useState<CustomPerScreen | null>(null);
  const [savedScreensList, setSavedScreensList] = useState<CustomPerScreen[]>([]);
  const [isGeneratingScreen, setIsGeneratingScreen] = useState<boolean>(false);
  const [isSavingScreen, setIsSavingScreen] = useState<boolean>(false);
  const [studioStatusMessage, setStudioStatusMessage] = useState<string>("");
  const [studioSubView, setStudioSubView] = useState<"createur" | "historique">("createur");

  // Rechargement des écrans en base
  const refreshScreens = async () => {
    try {
      const res = await fetch("/api/cbs/screens");
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.screens)) {
          setSavedScreensList(data.screens);
        }
      }
    } catch (_) { }
  };

  useEffect(() => {
    refreshScreens();
  }, []);

  // Génération dynamique de l'écran .per via le formulaire de description
  const handleGenerateScreen = async () => {
    if (!studioPrompt.trim()) {
      setStudioStatusMessage("⚠️ Veuillez saisir une description de votre besoin pour l'écran.");
      return;
    }

    setIsGeneratingScreen(true);
    setStudioStatusMessage("Génération du masque .per et liaison avec le dictionnaire Amplitude...");

    try {
      const res = await fetch("/api/cbs/screens", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "GENERATE",
          title: studioTitle,
          description: studioPrompt,
          domain: studioDomain,
          screenLayoutType: studioLayoutType,
          syntaxMode: studioSyntaxMode,
          schemaHeaderType: studioSchemaHeader,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.screen) {
          setCurrentCustomScreen(data.screen);
          setActiveStudioPreviewTab("gui");
          setStudioStatusMessage("✓ Écran généré avec succès ! Vous pouvez le modifier et le sauvegarder en base.");
        }
      } else {
        const localGenerated = generateCustomPerScreen({
          title: studioTitle,
          description: studioPrompt,
          domain: studioDomain,
          screenLayoutType: studioLayoutType,
          syntaxMode: studioSyntaxMode,
          schemaHeaderType: studioSchemaHeader,
        });
        setCurrentCustomScreen(localGenerated);
        setActiveStudioPreviewTab("gui");
        setStudioStatusMessage("✓ Écran généré avec succès (moteur local) !");
      }
    } catch (_) {
      const localGenerated = generateCustomPerScreen({
        title: studioTitle,
        description: studioPrompt,
        domain: studioDomain,
        screenLayoutType: studioLayoutType,
        syntaxMode: studioSyntaxMode,
        schemaHeaderType: studioSchemaHeader,
      });
      setCurrentCustomScreen(localGenerated);
      setActiveStudioPreviewTab("gui");
      setStudioStatusMessage("✓ Écran généré avec succès !");
    } finally {
      setIsGeneratingScreen(false);
    }
  };

  // Sauvegarde dans la base de données
  const handleSaveScreen = async () => {
    if (!currentCustomScreen) return;

    setIsSavingScreen(true);
    setStudioStatusMessage("Sauvegarde en cours dans la base de données...");

    try {
      const res = await fetch("/api/cbs/screens", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "SAVE",
          screen: currentCustomScreen,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setStudioStatusMessage(data.message || "✓ Écran .per sauvegardé avec succès dans la base de données !");
        await refreshScreens();
      } else {
        setStudioStatusMessage("⚠️ Erreur lors de la sauvegarde sur le serveur.");
      }
    } catch (_) {
      setStudioStatusMessage("⚠️ Erreur réseau lors de la sauvegarde.");
    } finally {
      setIsSavingScreen(false);
    }
  };

  // Suppression d'un écran de l'historique
  const handleDeleteScreen = async (id: string) => {
    if (!confirm("Confirmer la suppression de cet écran .per de la base de données ?")) return;
    try {
      const res = await fetch(`/api/cbs/screens?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setSavedScreensList((prev) => prev.filter((s) => s.id !== id));
        if (currentCustomScreen?.id === id) {
          setCurrentCustomScreen(null);
        }
        setStudioStatusMessage("✓ Écran supprimé de la base.");
      }
    } catch (_) { }
  };

  return (
    <AppShell pageTitle="Studio Créateur d'Écrans .per" eyebrow="FORMATION & CERTIF CBS">
      <div style={{ display: "flex", flexDirection: "column", gap: "24px", maxWidth: "1280px", margin: "0 auto", paddingBottom: "40px" }}>

        {/* BANNIÈRE DU STUDIO */}
        <div style={{
          background: "linear-gradient(135deg, #78350f, #b45309)",
          border: "1px solid #f59e0b",
          borderRadius: "12px",
          padding: "20px 24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "16px"
        }}>
          <div>
            <span style={{
              background: "#451a03",
              color: "#fcd34d",
              padding: "4px 10px",
              borderRadius: "6px",
              fontSize: "11px",
              fontWeight: 800,
              letterSpacing: "0.05em",
              textTransform: "uppercase"
            }}>
              Générateur Assisté & Rendu Live Form-4GL
            </span>
            <h2 style={{ fontSize: "20px", fontWeight: 800, color: "#ffffff", marginTop: "8px", marginBottom: "4px" }}>
              Studio Créateur d&apos;Écrans .per & Historique en Base
            </h2>
            <p style={{ fontSize: "13px", color: "#fef3c7", maxWidth: "750px", lineHeight: "1.5", margin: 0 }}>
              Décrivez votre besoin métier bancaire en langage naturel : le studio génère automatiquement l&apos;écran <code>.per</code> complet (DATABASE, SCREEN, TABLES, ATTRIBUTES avec formatages et validations, INSTRUCTIONS), le squelette 4GL et le rendu VT100. Vous pouvez éditer le code et le persister dans la base de données !
            </p>
          </div>
          <div style={{ display: "flex", gap: "10px" }}>
            <button
              onClick={() => {
                setStudioSubView("createur");
              }}
              style={{
                padding: "8px 16px",
                borderRadius: "8px",
                fontWeight: 700,
                fontSize: "12px",
                border: studioSubView === "createur" ? "2px solid #ffffff" : "1px solid #d97706",
                background: studioSubView === "createur" ? "#92400e" : "rgba(0,0,0,0.3)",
                color: "#ffffff",
                cursor: "pointer"
              }}
            >
              🛠️ Atelier Créateur
            </button>
            <button
              onClick={() => {
                setStudioSubView("historique");
                refreshScreens();
              }}
              style={{
                padding: "8px 16px",
                borderRadius: "8px",
                fontWeight: 700,
                fontSize: "12px",
                border: studioSubView === "historique" ? "2px solid #ffffff" : "1px solid #d97706",
                background: studioSubView === "historique" ? "#92400e" : "rgba(0,0,0,0.3)",
                color: "#ffffff",
                cursor: "pointer"
              }}
            >
              📚 Historique des Écrans ({savedScreensList.length})
            </button>
          </div>
        </div>

        {/* MESSAGE DE NOTIFICATION / STATUS */}
        {studioStatusMessage && (
          <div style={{
            padding: "12px 16px",
            borderRadius: "8px",
            background: studioStatusMessage.startsWith("⚠️") ? "rgba(239, 68, 68, 0.15)" : "rgba(16, 185, 129, 0.15)",
            border: studioStatusMessage.startsWith("⚠️") ? "1px solid #ef4444" : "1px solid #10b981",
            color: studioStatusMessage.startsWith("⚠️") ? "#fca5a5" : "#6ee7b7",
            fontSize: "13px",
            fontWeight: 600,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}>
            <span>{studioStatusMessage}</span>
            <button
              onClick={() => setStudioStatusMessage("")}
              style={{ background: "transparent", border: "none", color: "inherit", cursor: "pointer", fontSize: "14px" }}
            >
              ✕
            </button>
          </div>
        )}

        {/* SOUS-VUE 1 : ATELIER CRÉATEUR */}
        {studioSubView === "createur" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>

            {/* FORMULAIRE DE DESCRIPTION DU BESOIN */}
            <div style={{
              background: "#0f172a",
              border: "1px solid #334155",
              borderRadius: "12px",
              padding: "20px"
            }}>
              <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#f8fafc", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
                <span>✍️</span> 1. Décrivez l&apos;écran bancaire que vous souhaitez générer
              </h3>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "16px", marginBottom: "16px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "12px", color: "#94a3b8", marginBottom: "6px", fontWeight: 600 }}>
                    Titre ou Libellé de l&apos;écran
                  </label>
                  <input
                    type="text"
                    value={studioTitle}
                    onChange={(e) => setStudioTitle(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      borderRadius: "6px",
                      background: "#1e293b",
                      border: "1px solid #475569",
                      color: "#f8fafc",
                      fontSize: "13px"
                    }}
                    placeholder="Ex: Écran Saisie Virement SEPA & Validation"
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "12px", color: "#94a3b8", marginBottom: "6px", fontWeight: 600 }}>
                    Domaine Bancaire Amplitude
                  </label>
                  <select
                    value={studioDomain}
                    onChange={(e) => setStudioDomain(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      borderRadius: "6px",
                      background: "#1e293b",
                      border: "1px solid #475569",
                      color: "#f8fafc",
                      fontSize: "13px"
                    }}
                  >
                    <option value="Comptes & Guichet">Comptes, Soldes & Guichet Agence</option>
                    <option value="Clientèle & KYC">Clientèle, Tiers & Conformité KYC/PPE</option>
                    <option value="Virements & Transferts">Virements, Transferts & Compensation (SEPA/RTGS)</option>
                    <option value="Monétique & Cartes">Monétique, Cartes & Terminaux GAB/ATM</option>
                    <option value="Chèques & Effets">Chèques, Chéquiers, Effets & Compensation</option>
                    <option value="Crédits & Prêts">Crédits, Engagements, Prêts & Échéanciers</option>
                    <option value="Sécurité & Habilitations">Sécurité, Habilitations, Double Visa & Risques</option>
                    <option value="Comptabilité & Balance">Comptabilité Générale, Grand Livre & Balance EOD</option>
                    <option value="Opérations Internationales & Credoc">Opérations Internationales, Crédoc & Remdoc</option>
                    <option value="Trésorerie & Change Devises">Trésorerie, Forex & Arbitrage Devises</option>
                    <option value="Contentieux & Recouvrement">Contentieux, Douteux & Recouvrement</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "12px", color: "#94a3b8", marginBottom: "6px", fontWeight: 600 }}>
                    Type de disposition / IHM
                  </label>
                  <select
                    value={studioLayoutType}
                    onChange={(e) => setStudioLayoutType(e.target.value as any)}
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      borderRadius: "6px",
                      background: "#1e293b",
                      border: "1px solid #475569",
                      color: "#f8fafc",
                      fontSize: "13px"
                    }}
                  >
                    <option value="STANDARD_FORM">Formulaire Standard 80x24 (Saisie fiche mono-enregistrement)</option>
                    <option value="TABLE_ARRAY">Grille Défilante Scrollable (SCREEN RECORD & DISPLAY ARRAY)</option>
                    <option value="MODAL_POPUP">Fenêtre Modale Pop-up / Liste de Valeurs (LOV & ATTRIBUTE BORDER)</option>
                    <option value="SECURE_AUTH">Écran Haute Sécurité (NOECHO, Saisie PIN & Double Visa)</option>
                    <option value="MASTER_DETAIL">Master-Détail (En-tête Dossier + Lignes d'écritures avec solde)</option>
                    <option value="WIZARD_STEPS">Assistant Guidé Multi-Étapes (Instruction par étapes F7/F8)</option>
                    <option value="SPLIT_DASHBOARD">Tableau de Bord / Split KPIs (Synthèse + Événements récents)</option>
                    <option value="SEARCH_FILTER">Moteur de Recherche Multi-critères (CONSTRUCT dynamique & filtres)</option>
                  </select>
                </div>
              </div>

              {/* SÉLECTEUR DE MODE SYNTAXE & EN-TÊTE FORM-4GL */}
              <div style={{
                background: "#0f172a",
                border: "1px solid #334155",
                borderRadius: "8px",
                padding: "14px 16px",
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                gap: "14px"
              }}>
                <div>
                  <label style={{ display: "block", fontSize: "12px", color: "#38bdf8", marginBottom: "6px", fontWeight: 700 }}>
                    Architecture & Rendu Form
                  </label>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button
                      type="button"
                      onClick={() => setStudioSyntaxMode("GUI_GENERO")}
                      style={{
                        flex: 1,
                        padding: "8px 10px",
                        borderRadius: "6px",
                        fontSize: "12px",
                        fontWeight: 700,
                        cursor: "pointer",
                        border: studioSyntaxMode === "GUI_GENERO" ? "1px solid #10b981" : "1px solid #334155",
                        background: studioSyntaxMode === "GUI_GENERO" ? "#064e3b" : "#1e293b",
                        color: studioSyntaxMode === "GUI_GENERO" ? "#34d399" : "#94a3b8",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "6px"
                      }}
                    >
                      <span>🖥️</span> IHM Graphique Genero
                    </button>
                    <button
                      type="button"
                      onClick={() => setStudioSyntaxMode("TERMINAL_LEGACY")}
                      style={{
                        flex: 1,
                        padding: "8px 10px",
                        borderRadius: "6px",
                        fontSize: "12px",
                        fontWeight: 700,
                        cursor: "pointer",
                        border: studioSyntaxMode === "TERMINAL_LEGACY" ? "1px solid #f59e0b" : "1px solid #334155",
                        background: studioSyntaxMode === "TERMINAL_LEGACY" ? "#78350f" : "#1e293b",
                        color: studioSyntaxMode === "TERMINAL_LEGACY" ? "#fcd34d" : "#94a3b8",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "6px"
                      }}
                    >
                      <span>📟</span> Terminal VT100
                    </button>
                  </div>
                  <div style={{ fontSize: "11px", color: "#64748b", marginTop: "5px" }}>
                    {studioSyntaxMode === "GUI_GENERO"
                      ? "✓ Utilise LAYOUT, VBOX, HBOX (SPLITTER), GRID, FOLDER, TABLE"
                      : "✓ Utilise la grille fixe ASCII 80x24 et la section SCREEN standard"}
                  </div>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "12px", color: "#34d399", marginBottom: "6px", fontWeight: 700 }}>
                    Directive d&apos;En-tête de Schéma
                  </label>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button
                      type="button"
                      onClick={() => setStudioSchemaHeader("SCHEMA")}
                      style={{
                        flex: 1,
                        padding: "8px 10px",
                        borderRadius: "6px",
                        fontSize: "12px",
                        fontWeight: 700,
                        cursor: "pointer",
                        border: studioSchemaHeader === "SCHEMA" ? "1px solid #10b981" : "1px solid #334155",
                        background: studioSchemaHeader === "SCHEMA" ? "#064e3b" : "#1e293b",
                        color: studioSchemaHeader === "SCHEMA" ? "#34d399" : "#94a3b8",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "6px"
                      }}
                    >
                      <span>SCHEMA</span> (Amplitude)
                    </button>
                    <button
                      type="button"
                      onClick={() => setStudioSchemaHeader("DATABASE")}
                      style={{
                        flex: 1,
                        padding: "8px 10px",
                        borderRadius: "6px",
                        fontSize: "12px",
                        fontWeight: 700,
                        cursor: "pointer",
                        border: studioSchemaHeader === "DATABASE" ? "1px solid #475569" : "1px solid #334155",
                        background: studioSchemaHeader === "DATABASE" ? "#334155" : "#1e293b",
                        color: studioSchemaHeader === "DATABASE" ? "#f1f5f9" : "#94a3b8",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "6px"
                      }}
                    >
                      <span>DATABASE</span> (Informix Legacy)
                    </button>
                  </div>
                  <div style={{ fontSize: "11px", color: "#64748b", marginTop: "5px" }}>
                    {studioSchemaHeader === "SCHEMA"
                      ? "✓ Découplage de compilation garanti sans connexion SGBD active"
                      : "Exige la présence physique de la base lors du form4gl"}
                  </div>
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "12px", color: "#94a3b8", marginBottom: "6px", fontWeight: 600 }}>
                  Description libre de votre besoin (champs souhaités, règles de gestion, contrôles obligatoires, montants...)
                </label>
                <textarea
                  rows={4}
                  value={studioPrompt}
                  onChange={(e) => setStudioPrompt(e.target.value)}
                  placeholder="Exemple : Je veux un écran de saisie de virement international avec code agence, compte donneur d'ordre, nom bénéficiaire, IBAN/BIC, montant en devises, motif économique, vérification que le montant est > 0 et formatage avec séparateurs de milliers. En bas de l'écran, prévois une ligne de statut avec les touches fonction F1:Aide, F3:Valider, F12:Quitter."
                  style={{
                    width: "100%",
                    padding: "12px",
                    borderRadius: "6px",
                    background: "#1e293b",
                    border: "1px solid #475569",
                    color: "#f8fafc",
                    fontSize: "13px",
                    lineHeight: "1.5",
                    fontFamily: "inherit"
                  }}
                />
              </div>

              {/* BOUTONS D'EXEMPLES PRÉDÉFINIS POUR GAGNER DU TEMPS */}
              <div style={{ marginTop: "12px", display: "flex", flexWrap: "wrap", alignItems: "center", gap: "8px" }}>
                <span style={{ fontSize: "11px", color: "#64748b", fontWeight: 600 }}>Idées rapides :</span>
                <button
                  type="button"
                  onClick={() => {
                    setStudioTitle("Saisie Virement SEPA Immédiat");
                    setStudioDomain("Virements & Transferts");
                    setStudioLayoutType("STANDARD_FORM");
                    setStudioPrompt("Écran pour émettre un virement immédiat avec compte débit (11 cars), compte crédit (IBAN), titulaire, montant supérieur à 0 avec séparateur de milliers et décimales, date d'exécution (MDY), motif économique, et code devise par défaut EUR ou XOF.");
                  }}
                  style={{ background: "#1e293b", border: "1px solid #334155", color: "#cbd5e1", fontSize: "11px", padding: "4px 8px", borderRadius: "4px", cursor: "pointer" }}
                >
                  ⚡ Virement SEPA
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setStudioTitle("Consultation Historique Mouvements Compte");
                    setStudioDomain("Comptes & Guichet");
                    setStudioLayoutType("TABLE_ARRAY");
                    setStudioPrompt("Écran avec en-tête pour le numéro de compte et le solde comptable, suivi d'une table scrollable de 10 lignes affichant la date de valeur, le libellé de l'opération, le débit et le crédit, avec pagination page suivante/précédente.");
                  }}
                  style={{ background: "#1e293b", border: "1px solid #334155", color: "#cbd5e1", fontSize: "11px", padding: "4px 8px", borderRadius: "4px", cursor: "pointer" }}
                >
                  ⚡ Historique Défilant (ARRAY)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setStudioTitle("Validation Forçage Plafond Carte GAB");
                    setStudioDomain("Monétique & Cartes");
                    setStudioLayoutType("SECURE_AUTH");
                    setStudioPrompt("Écran de forçage monétique réservé au chef d'agence : affiche le numéro de carte masqué, le plafond actuel, le nouveau plafond demandé, le code superviseur obligatoire saisi en NOECHO, et un champ de confirmation O/N.");
                  }}
                  style={{ background: "#1e293b", border: "1px solid #334155", color: "#cbd5e1", fontSize: "11px", padding: "4px 8px", borderRadius: "4px", cursor: "pointer" }}
                >
                  ⚡ Sécurité & NOECHO
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setStudioTitle("Saisie Dossier & Imputations Comptables Multi-Lignes");
                    setStudioDomain("Comptabilité & Balance");
                    setStudioLayoutType("MASTER_DETAIL");
                    setStudioPrompt("Écran en-tête de dossier comptable avec référence, date de valeur et devise, relié à une grille de lignes de débit et crédit avec contrôle strict de l'écart à zéro.");
                  }}
                  style={{ background: "#1e293b", border: "1px solid #334155", color: "#cbd5e1", fontSize: "11px", padding: "4px 8px", borderRadius: "4px", cursor: "pointer" }}
                >
                  ⚡ Master-Détail
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setStudioTitle("Instruction Prêt Immobilier & Simulation");
                    setStudioDomain("Crédits & Prêts");
                    setStudioLayoutType("WIZARD_STEPS");
                    setStudioPrompt("Assistant guidé pour prêt bancaire en 3 étapes : identification du tiers, calcul de la mensualité et amortissement, et validation du comité de crédit.");
                  }}
                  style={{ background: "#1e293b", border: "1px solid #334155", color: "#cbd5e1", fontSize: "11px", padding: "4px 8px", borderRadius: "4px", cursor: "pointer" }}
                >
                  ⚡ Assistant Multi-Étapes
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setStudioTitle("Supervision Temps Réel Flux Monétique & Agence");
                    setStudioDomain("Monétique & Cartes");
                    setStudioLayoutType("SPLIT_DASHBOARD");
                    setStudioPrompt("Tableau de bord partagé entre indicateurs volumétriques de compensation, alertes de risque/GAB en panne et liste des derniers événements survenus.");
                  }}
                  style={{ background: "#1e293b", border: "1px solid #334155", color: "#cbd5e1", fontSize: "11px", padding: "4px 8px", borderRadius: "4px", cursor: "pointer" }}
                >
                  ⚡ Dashboard KPIs
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setStudioTitle("Recherche Multi-critères Tiers & Comptes");
                    setStudioDomain("Clientèle & KYC");
                    setStudioLayoutType("SEARCH_FILTER");
                    setStudioPrompt("Formulaire de recherche dynamique avec directive CONSTRUCT 4GL sur le code tiers, nom, compte et agence avec affichage immédiat de la liste de résultats.");
                  }}
                  style={{ background: "#1e293b", border: "1px solid #334155", color: "#cbd5e1", fontSize: "11px", padding: "4px 8px", borderRadius: "4px", cursor: "pointer" }}
                >
                  ⚡ Recherche CONSTRUCT
                </button>
              </div>

              {/* BOUTON D'ACTION PRINCIPAL : GÉNÉRER */}
              <div style={{ marginTop: "18px", display: "flex", justifyContent: "flex-end" }}>
                <button
                  type="button"
                  disabled={isGeneratingScreen}
                  onClick={handleGenerateScreen}
                  style={{
                    background: "linear-gradient(135deg, #d97706, #b45309)",
                    color: "#ffffff",
                    border: "none",
                    padding: "10px 24px",
                    borderRadius: "8px",
                    fontSize: "14px",
                    fontWeight: 700,
                    cursor: isGeneratingScreen ? "not-allowed" : "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    boxShadow: "0 4px 12px rgba(217, 119, 6, 0.4)"
                  }}
                >
                  {isGeneratingScreen ? "⚙️ Génération Form-4GL en cours..." : "✨ Générer le code .per & l'IHM"}
                </button>
              </div>
            </div>

            {/* SECTION RÉSULTAT : CODE ÉDITABLE, 4GL ASSOCIÉ & TERMINAL VT100 */}
            {currentCustomScreen && (
              <div style={{
                background: "#0f172a",
                border: "1px solid #334155",
                borderRadius: "12px",
                padding: "24px",
                display: "flex",
                flexDirection: "column",
                gap: "20px"
              }}>
                {/* EN-TÊTE DU RÉSULTAT AVEC SAUVEGARDE */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px", borderBottom: "1px solid #1e293b", paddingBottom: "16px" }}>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
                      <span style={{ fontSize: "20px" }}>🖥️</span>
                      <h3 style={{ fontSize: "18px", fontWeight: 800, color: "#f8fafc", margin: 0 }}>
                        {currentCustomScreen.title}
                      </h3>
                      <span style={{
                        background: "#064e3b",
                        border: "1px solid #10b981",
                        color: "#34d399",
                        fontSize: "11px",
                        padding: "2px 8px",
                        borderRadius: "4px",
                        fontFamily: "monospace"
                      }}>
                        {currentCustomScreen.name}.per
                      </span>
                    </div>
                    <div style={{ fontSize: "12px", color: "#94a3b8" }}>
                      Domaine : <strong style={{ color: "#e2e8f0" }}>{currentCustomScreen.domain}</strong> | Table principale : <code style={{ color: "#38bdf8" }}>{currentCustomScreen.primaryTable}</code> {currentCustomScreen.secondaryTable && (<span>| Table liée : <code style={{ color: "#38bdf8" }}>{currentCustomScreen.secondaryTable}</code></span>)}
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: "10px" }}>
                    <button
                      onClick={handleSaveScreen}
                      disabled={isSavingScreen}
                      style={{
                        background: "#10b981",
                        color: "#ffffff",
                        border: "none",
                        padding: "8px 18px",
                        borderRadius: "6px",
                        fontSize: "13px",
                        fontWeight: 700,
                        cursor: isSavingScreen ? "not-allowed" : "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        boxShadow: "0 2px 8px rgba(16, 185, 129, 0.4)"
                      }}
                    >
                      {isSavingScreen ? "Sauvegarde..." : "💾 Sauvegarder dans la Base"}
                    </button>
                  </div>
                </div>

                {/* BARRE D'ONGLETS DE PRÉVISUALISATION ET ÉDITION */}
                <div style={{ display: "flex", gap: "8px", borderBottom: "1px solid #334155", paddingBottom: "12px", flexWrap: "wrap" }}>
                  <button
                    type="button"
                    onClick={() => setActiveStudioPreviewTab("gui")}
                    style={{
                      padding: "6px 14px",
                      borderRadius: "6px",
                      fontSize: "12px",
                      fontWeight: 800,
                      border: activeStudioPreviewTab === "gui" ? "2px solid #34d399" : "1px solid #334155",
                      background: activeStudioPreviewTab === "gui" ? "#064e3b" : "#1e293b",
                      color: activeStudioPreviewTab === "gui" ? "#34d399" : "#94a3b8",
                      boxShadow: activeStudioPreviewTab === "gui" ? "0 2px 10px rgba(16, 185, 129, 0.4)" : "none",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px"
                    }}
                  >
                    <span>🖥️</span> Rendu IHM Graphique (Client Web / GDC)
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveStudioPreviewTab("per")}
                    style={{
                      padding: "6px 14px",
                      borderRadius: "6px",
                      fontSize: "12px",
                      fontWeight: 700,
                      border: activeStudioPreviewTab === "per" ? "1px solid #10b981" : "1px solid #334155",
                      background: activeStudioPreviewTab === "per" ? "#064e3b" : "#1e293b",
                      color: activeStudioPreviewTab === "per" ? "#34d399" : "#94a3b8",
                      cursor: "pointer"
                    }}
                  >
                    📄 Masque .per Éditable
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveStudioPreviewTab("4gl")}
                    style={{
                      padding: "6px 14px",
                      borderRadius: "6px",
                      fontSize: "12px",
                      fontWeight: 700,
                      border: activeStudioPreviewTab === "4gl" ? "1px solid #38bdf8" : "1px solid #334155",
                      background: activeStudioPreviewTab === "4gl" ? "#0c4a6e" : "#1e293b",
                      color: activeStudioPreviewTab === "4gl" ? "#7dd3fc" : "#94a3b8",
                      cursor: "pointer"
                    }}
                  >
                    ⚙️ Programme 4GL Associé
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveStudioPreviewTab("terminal")}
                    style={{
                      padding: "6px 14px",
                      borderRadius: "6px",
                      fontSize: "12px",
                      fontWeight: 700,
                      border: activeStudioPreviewTab === "terminal" ? "1px solid #f59e0b" : "1px solid #334155",
                      background: activeStudioPreviewTab === "terminal" ? "#78350f" : "#1e293b",
                      color: activeStudioPreviewTab === "terminal" ? "#fcd34d" : "#94a3b8",
                      cursor: "pointer"
                    }}
                  >
                    📟 Rendu Terminal VT100
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveStudioPreviewTab("fields")}
                    style={{
                      padding: "6px 14px",
                      borderRadius: "6px",
                      fontSize: "12px",
                      fontWeight: 700,
                      border: activeStudioPreviewTab === "fields" ? "1px solid #a855f7" : "1px solid #334155",
                      background: activeStudioPreviewTab === "fields" ? "#581c87" : "#1e293b",
                      color: activeStudioPreviewTab === "fields" ? "#d8b4fe" : "#94a3b8",
                      cursor: "pointer"
                    }}
                  >
                    🔍 Champs & Dictionnaire ({currentCustomScreen.fieldsConfig?.length || 0})
                  </button>
                </div>

                {/* VUE 1 : RENDU IHM GRAPHIQUE GENERO GDC / WEB */}
                {activeStudioPreviewTab === "gui" && (
                  <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "8px" }}>
                      <span style={{ fontSize: "12px", color: "#34d399", fontWeight: 700 }}>
                        Aperçu IHM Graphique Genero (Four Js / Amplitude Desktop GDC & Web GWC)
                      </span>
                      <span style={{ fontSize: "11px", color: "#38bdf8", fontWeight: 600 }}>
                        Architecture Conteneurs : {currentCustomScreen.schemaHeaderType || "SCHEMA"} • LAYOUT • VBOX • HBOX (SPLITTER) • GRID • TABLE
                      </span>
                    </div>
                    <GeneroGuiWindow data={currentCustomScreen.guiMockupData} title={currentCustomScreen.title} domain={currentCustomScreen.domain} />
                  </div>
                )}

                {/* VUE 2 : ZONE D'ÉDITION DU CODE .PER */}
                {activeStudioPreviewTab === "per" && (
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                      <label style={{ fontSize: "13px", fontWeight: 700, color: "#34d399", display: "flex", alignItems: "center", gap: "6px" }}>
                        <span>📄</span> Masque Form-4GL (.per) — Entièrement Éditable
                      </label>
                      <span style={{ fontSize: "11px", color: "#64748b" }}>
                        Modifiez directement les libellés, champs ou directives ci-dessous
                      </span>
                    </div>
                    <textarea
                      rows={16}
                      value={currentCustomScreen.perSourceCode}
                      onChange={(e) => setCurrentCustomScreen({ ...currentCustomScreen, perSourceCode: e.target.value })}
                      style={{
                        width: "100%",
                        padding: "16px",
                        borderRadius: "8px",
                        background: "#020617",
                        border: "1px solid #334155",
                        color: "#e2e8f0",
                        fontFamily: "Consolas, Monaco, 'Courier New', monospace",
                        fontSize: "13px",
                        lineHeight: "1.45"
                      }}
                    />
                  </div>
                )}

                {/* VUE 3 : RENDU TERMINAL VT100 */}
                {activeStudioPreviewTab === "terminal" && (
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                      <label style={{ fontSize: "13px", fontWeight: 700, color: "#f59e0b", display: "flex", alignItems: "center", gap: "6px" }}>
                        <span>📟</span> Rendu Écran Terminal VT100 (Format Écran 80x24)
                      </label>
                      <span style={{ fontSize: "11px", color: "#94a3b8" }}>
                        Aperçu fidèle de la compilation sous Unix
                      </span>
                    </div>
                    <pre style={{
                      margin: 0,
                      background: "#000000",
                      border: "2px solid #334155",
                      borderRadius: "8px",
                      padding: "20px",
                      color: "#4ade80",
                      fontFamily: "'Courier New', Courier, monospace",
                      fontSize: "13px",
                      lineHeight: "1.3",
                      overflowX: "auto",
                      boxShadow: "inset 0 0 20px rgba(0, 255, 0, 0.05)"
                    }}>
                      {currentCustomScreen.terminalMockup}
                    </pre>
                  </div>
                )}

                {/* VUE 4 : SQUELETTE DE CODE 4GL */}
                {activeStudioPreviewTab === "4gl" && (
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                      <label style={{ fontSize: "13px", fontWeight: 700, color: "#38bdf8", display: "flex", alignItems: "center", gap: "6px" }}>
                        <span>⚙️</span> Squelette Informix 4GL Associé (Contrôles, DIALOG, Saisie)
                      </label>
                      <span style={{ fontSize: "11px", color: "#64748b" }}>
                        Modifiable avant intégration dans vos modules
                      </span>
                    </div>
                    <textarea
                      rows={14}
                      value={currentCustomScreen.fourGlSourceCode}
                      onChange={(e) => setCurrentCustomScreen({ ...currentCustomScreen, fourGlSourceCode: e.target.value })}
                      style={{
                        width: "100%",
                        padding: "16px",
                        borderRadius: "8px",
                        background: "#020617",
                        border: "1px solid #334155",
                        color: "#7dd3fc",
                        fontFamily: "Consolas, Monaco, 'Courier New', monospace",
                        fontSize: "13px",
                        lineHeight: "1.45"
                      }}
                    />
                  </div>
                )}

                {/* VUE 5 : LISTE DES CHAMPS ET DICTIONNAIRE */}
                {activeStudioPreviewTab === "fields" && (
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    <div style={{ fontSize: "12px", color: "#d8b4fe", fontWeight: 700 }}>
                      Champs détectés et liés au dictionnaire de données Amplitude CBS
                    </div>
                    <div style={{ overflowX: "auto" }}>
                      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px" }}>
                        <thead>
                          <tr style={{ background: "#1e293b", borderBottom: "1px solid #334155", textAlign: "left" }}>
                            <th style={{ padding: "8px 10px", color: "#94a3b8" }}>Tag</th>
                            <th style={{ padding: "8px 10px", color: "#94a3b8" }}>Table</th>
                            <th style={{ padding: "8px 10px", color: "#94a3b8" }}>Colonne</th>
                            <th style={{ padding: "8px 10px", color: "#94a3b8" }}>Type</th>
                            <th style={{ padding: "8px 10px", color: "#94a3b8" }}>Attributs Form-4GL</th>
                            <th style={{ padding: "8px 10px", color: "#94a3b8" }}>Commentaires</th>
                          </tr>
                        </thead>
                        <tbody>
                          {currentCustomScreen.fieldsConfig?.map((f, idx) => (
                            <tr key={idx} style={{ borderBottom: "1px solid #1e293b", background: idx % 2 === 0 ? "#0f172a" : "#172554" }}>
                              <td style={{ padding: "8px 10px", fontFamily: "monospace", color: "#34d399", fontWeight: 700 }}>{f.tag}</td>
                              <td style={{ padding: "8px 10px", color: "#f1f5f9" }}>{f.table}</td>
                              <td style={{ padding: "8px 10px", fontFamily: "monospace", color: "#38bdf8" }}>{f.column}</td>
                              <td style={{ padding: "8px 10px", color: "#cbd5e1" }}>{f.type}</td>
                              <td style={{ padding: "8px 10px", color: "#fbbf24", fontFamily: "monospace", fontSize: "11px" }}>{f.attributes.join(", ") || "-"}</td>
                              <td style={{ padding: "8px 10px", color: "#94a3b8", fontSize: "11px" }}>{f.comments || "-"}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

              </div>
            )}

          </div>
        )}

        {/* SOUS-VUE 2 : HISTORIQUE DES ÉCRANS SAUVEGARDÉS */}
        {studioSubView === "historique" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#f8fafc", margin: 0 }}>
                📚 Écrans Form-4GL enregistrés dans la Base ({savedScreensList.length})
              </h3>
              <button
                onClick={refreshScreens}
                style={{
                  background: "#1e293b",
                  border: "1px solid #475569",
                  color: "#cbd5e1",
                  padding: "6px 12px",
                  borderRadius: "6px",
                  fontSize: "12px",
                  cursor: "pointer"
                }}
              >
                🔄 Actualiser
              </button>
            </div>

            {savedScreensList.length === 0 ? (
              <div style={{
                background: "#0f172a",
                border: "1px dashed #334155",
                borderRadius: "12px",
                padding: "48px 24px",
                textAlign: "center"
              }}>
                <div style={{ fontSize: "36px", marginBottom: "12px" }}>📂</div>
                <div style={{ fontSize: "15px", fontWeight: 700, color: "#f8fafc", marginBottom: "6px" }}>
                  Aucun écran .per sauvegardé pour le moment
                </div>
                <p style={{ fontSize: "13px", color: "#94a3b8", maxWidth: "500px", margin: "0 auto 18px auto" }}>
                  Basculez sur l&apos;Atelier Créateur, décrivez votre écran bancaire et cliquez sur &quot;Sauvegarder dans la Base&quot; pour le retrouver ici.
                </p>
                <button
                  onClick={() => setStudioSubView("createur")}
                  style={{
                    background: "#d97706",
                    color: "#ffffff",
                    border: "none",
                    padding: "8px 18px",
                    borderRadius: "6px",
                    fontSize: "13px",
                    fontWeight: 700,
                    cursor: "pointer"
                  }}
                >
                  Aller au Créateur ➔
                </button>
              </div>
            ) : (
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
                gap: "16px"
              }}>
                {savedScreensList.map((screen) => (
                  <div
                    key={screen.id}
                    style={{
                      background: "#0f172a",
                      border: "1px solid #334155",
                      borderRadius: "10px",
                      padding: "18px",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      gap: "14px"
                    }}
                  >
                    <div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                        <span style={{
                          background: "#1e293b",
                          border: "1px solid #38bdf8",
                          color: "#38bdf8",
                          fontFamily: "monospace",
                          fontSize: "11px",
                          padding: "2px 8px",
                          borderRadius: "4px"
                        }}>
                          {screen.name}.per
                        </span>
                        <span style={{ fontSize: "11px", color: "#64748b" }}>
                          {screen.createdAt ? new Date(screen.createdAt).toLocaleDateString("fr-FR", { hour: "2-digit", minute: "2-digit" }) : "Récemment"}
                        </span>
                      </div>
                      <div style={{ fontSize: "15px", fontWeight: 700, color: "#f8fafc", marginBottom: "4px" }}>
                        {screen.title}
                      </div>
                      <div style={{ fontSize: "12px", color: "#94a3b8", marginBottom: "8px", lineHeight: "1.4" }}>
                        {screen.description}
                      </div>
                      <div style={{ fontSize: "11px", color: "#6ee7b7" }}>
                        Domaine : <strong>{screen.domain}</strong>
                      </div>
                    </div>

                    <div style={{ display: "flex", gap: "8px", borderTop: "1px solid #1e293b", paddingTop: "12px" }}>
                      <button
                        onClick={() => {
                          setCurrentCustomScreen(screen);
                          setStudioSubView("createur");
                        }}
                        style={{
                          flex: 1,
                          background: "#0284c7",
                          color: "#ffffff",
                          border: "none",
                          padding: "6px 12px",
                          borderRadius: "6px",
                          fontSize: "12px",
                          fontWeight: 700,
                          cursor: "pointer"
                        }}
                      >
                        ✏️ Charger & Éditer
                      </button>
                      <button
                        onClick={() => handleDeleteScreen(screen.id)}
                        style={{
                          background: "rgba(239, 68, 68, 0.1)",
                          border: "1px solid #ef4444",
                          color: "#fca5a5",
                          padding: "6px 10px",
                          borderRadius: "6px",
                          fontSize: "12px",
                          cursor: "pointer"
                        }}
                        title="Supprimer de la base"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </AppShell>
  );
}
