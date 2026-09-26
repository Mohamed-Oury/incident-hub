"use client";

import { useState, useEffect } from "react";
import { AppShell } from "@/modules/layout/AppShell";
import {
  CustomPerScreen,
  generateCustomPerScreen
} from "@/modules/cbs/cbs-screen-builder";

export default function PerStudioPage() {
  const [studioPrompt, setStudioPrompt] = useState<string>("");
  const [studioTitle, setStudioTitle] = useState<string>("Écran Consultation Guichet & Soldes");
  const [studioDomain, setStudioDomain] = useState<string>("Comptes & Guichet");
  const [studioLayoutType, setStudioLayoutType] = useState<"STANDARD_FORM" | "TABLE_ARRAY" | "MODAL_POPUP" | "SECURE_AUTH">("STANDARD_FORM");
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
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.screen) {
          setCurrentCustomScreen(data.screen);
          setStudioStatusMessage("✓ Écran généré avec succès ! Vous pouvez le modifier et le sauvegarder en base.");
        }
      } else {
        const localGenerated = generateCustomPerScreen({
          title: studioTitle,
          description: studioPrompt,
          domain: studioDomain,
          screenLayoutType: studioLayoutType,
        });
        setCurrentCustomScreen(localGenerated);
        setStudioStatusMessage("✓ Écran généré avec succès (moteur local) !");
      }
    } catch (_) {
      const localGenerated = generateCustomPerScreen({
        title: studioTitle,
        description: studioPrompt,
        domain: studioDomain,
        screenLayoutType: studioLayoutType,
      });
      setCurrentCustomScreen(localGenerated);
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
                    <option value="Virements & Transferts">Virements, Transferts & Compensation</option>
                    <option value="Monétique & Cartes">Monétique, Cartes & Terminaux GAB</option>
                    <option value="Crédits & Prêts">Crédits, Engagements & Découverts</option>
                    <option value="Sécurité & Habilitations">Habilitations, Double Validation & Risque</option>
                    <option value="Comptabilité & Balance">Comptabilité Générale & Déclaratif</option>
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
                    <option value="STANDARD_FORM">Formulaire Standard 80x24 (Saisie mono-enregistrement)</option>
                    <option value="TABLE_ARRAY">Écran Mixte avec Grille Défilante (DISPLAY ARRAY)</option>
                    <option value="MODAL_POPUP">Fenêtre Modale / Confirmation (Encadré centré)</option>
                    <option value="SECURE_AUTH">Écran Sécurisé (Masquage NOECHO & Double Clé)</option>
                  </select>
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

                {/* ZONE D'ÉDITION DU CODE .PER */}
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

                {/* APERÇU LIVE VT100 / TERMINAL BANCAIRE */}
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                    <label style={{ fontSize: "13px", fontWeight: 700, color: "#f59e0b", display: "flex", alignItems: "center", gap: "6px" }}>
                      <span>📺</span> Rendu Écran Terminal VT100 (Format Écran 80x24)
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

                {/* SQUELETTE DE CODE 4GL DE PILOTAGE */}
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                    <label style={{ fontSize: "13px", fontWeight: 700, color: "#38bdf8", display: "flex", alignItems: "center", gap: "6px" }}>
                      <span>⚙️</span> Squelette Informix 4GL Associé (Contrôles, ON KEY, Saisie)
                    </label>
                    <span style={{ fontSize: "11px", color: "#64748b" }}>
                      Modifiable avant intégration dans vos modules
                    </span>
                  </div>
                  <textarea
                    rows={12}
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
