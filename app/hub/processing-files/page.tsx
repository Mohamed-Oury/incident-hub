"use client";

import { useState } from "react";
import { AppShell } from "@/modules/layout/AppShell";
import { useSubsidiary } from "@/modules/layout/SubsidiaryContext";
import { MINDMAP_INCOMING_FLOWS } from "@/modules/processing-files/data";
import { NetworkId } from "@/modules/processing-files/types";

export default function ProcessingFilesPage() {
  const { isAFG, setSubsidiary } = useSubsidiary();

  const [direction, setDirection] = useState<"INCOMING" | "OUTGOING">("INCOMING");
  const [selectedNetwork, setSelectedNetwork] = useState<NetworkId>("GIMAC");
  const [showOriginalCaptures, setShowOriginalCaptures] = useState<boolean>(false);
  const [activeBranchId, setActiveBranchId] = useState<"ALL" | "compta" | "onus">("ALL");

  const currentFlow =
    MINDMAP_INCOMING_FLOWS.find((f) => f.networkId === selectedNetwork) ||
    MINDMAP_INCOMING_FLOWS[0];

  // Si l'utilisateur n'est pas sur AFG BANK
  if (!isAFG) {
    return (
      <AppShell>
        <div style={{ padding: "3rem 1.5rem", maxWidth: "800px", margin: "4rem auto", textAlign: "center" }}>
          <div
            style={{
              background: "#ffffff",
              borderRadius: "20px",
              padding: "3.5rem 2.5rem",
              border: "1px solid #e2e8f0",
              boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.05)",
            }}
          >
            <div
              style={{
                width: "68px",
                height: "68px",
                borderRadius: "16px",
                background: "rgba(239, 68, 68, 0.1)",
                color: "#dc2626",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "2rem",
                marginBottom: "1.25rem",
              }}
            >
              🔒
            </div>
            <h2 style={{ fontSize: "1.5rem", fontWeight: 900, color: "#0f172a", margin: "0 0 0.5rem" }}>
              Module réservé à AFG BANK
            </h2>
            <p style={{ fontSize: "0.95rem", color: "#64748b", lineHeight: 1.6, maxWidth: "560px", margin: "0 auto 1.75rem" }}>
              Le parcours de traitement de fichiers de clearing (<strong>GIMAC</strong>, <strong>VISA</strong> et <strong>GIM</strong>) est exclusivement activé pour l'entité <strong>AFG Bank</strong>.
            </p>
            <button
              type="button"
              onClick={() => setSubsidiary("AFG")}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.6rem",
                padding: "0.75rem 1.75rem",
                borderRadius: "12px",
                border: "none",
                background: "linear-gradient(135deg, #059669, #047857)",
                color: "#ffffff",
                fontWeight: 800,
                fontSize: "0.92rem",
                cursor: "pointer",
                boxShadow: "0 4px 12px rgba(5, 150, 105, 0.35)",
              }}
            >
              <span>🏛️</span>
              <span>Basculez sur AFG Bank pour y accéder</span>
            </button>
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div style={{ padding: "1.75rem", maxWidth: "1720px", margin: "0 auto" }}>
        {/* ========================================================================= */}
        {/* 1. HEADER PRINCIPAL AFG BANK                                              */}
        {/* ========================================================================= */}
        <div
          style={{
            position: "relative",
            overflow: "hidden",
            background: "linear-gradient(135deg, #0b1120 0%, #172136 100%)",
            color: "#ffffff",
            borderRadius: "20px",
            padding: "2rem 2.25rem",
            marginBottom: "1.5rem",
            border: "1px solid #334155",
            boxShadow: "0 10px 25px -5px rgba(11, 17, 32, 0.4)",
          }}
        >
          <div
            style={{
              position: "absolute",
              right: "-60px",
              top: "-60px",
              width: "300px",
              height: "300px",
              background: `radial-gradient(circle, ${currentFlow.themeColor.accent}25 0%, transparent 70%)`,
              borderRadius: "50%",
              pointerEvents: "none",
            }}
          />

          <div
            style={{
              position: "relative",
              zIndex: 1,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              flexWrap: "wrap",
              gap: "1.5rem",
            }}
          >
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.5rem" }}>
                <span
                  style={{
                    fontSize: "0.72rem",
                    fontWeight: 900,
                    color: currentFlow.themeColor.text,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    background: currentFlow.themeColor.badgeBg,
                    padding: "0.25rem 0.65rem",
                    borderRadius: "6px",
                    border: `1px solid ${currentFlow.themeColor.accent}40`,
                  }}
                >
                  🏛️ AFG BANK • CLEARING OPÉRATIONNEL
                </span>
                <span
                  style={{
                    fontSize: "0.72rem",
                    fontWeight: 700,
                    color: "#94a3b8",
                    background: "rgba(255, 255, 255, 0.08)",
                    padding: "0.25rem 0.65rem",
                    borderRadius: "6px",
                  }}
                >
                  3 Réseaux Complets à 100%
                </span>
              </div>

              <h1
                style={{
                  fontSize: "1.85rem",
                  fontWeight: 900,
                  margin: 0,
                  letterSpacing: "-0.02em",
                  color: "#ffffff",
                }}
              >
                Parcours de Traitement de Fichiers (Clearing)
              </h1>
              <p
                style={{
                  fontSize: "0.92rem",
                  color: "#cbd5e1",
                  margin: "0.45rem 0 0",
                  maxWidth: "920px",
                  lineHeight: 1.5,
                }}
              >
                Supervision exacte des parcours de compensation : <strong>GIMAC (CEMAC)</strong>, <strong>GIM (UEMOA)</strong> et <strong>VISA (International)</strong>.
              </p>
            </div>

            {/* COMMANDES D'ACTION & SWITCHERS */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "0.75rem" }}>
              {/* SÉLECTEUR DIRECTION INCOMING / OUTGOING */}
              <div
                style={{
                  display: "inline-flex",
                  background: "rgba(15, 23, 42, 0.6)",
                  padding: "0.3rem",
                  borderRadius: "12px",
                  border: "1px solid #475569",
                  backdropFilter: "blur(10px)",
                }}
              >
                <button
                  type="button"
                  onClick={() => setDirection("INCOMING")}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    padding: "0.55rem 1.15rem",
                    borderRadius: "9px",
                    border: "none",
                    fontSize: "0.82rem",
                    fontWeight: 800,
                    cursor: "pointer",
                    background: direction === "INCOMING" ? "#ffffff" : "transparent",
                    color: direction === "INCOMING" ? "#0f172a" : "#cbd5e1",
                    boxShadow: direction === "INCOMING" ? "0 4px 12px rgba(0,0,0,0.2)" : "none",
                    transition: "all 0.15s ease",
                  }}
                >
                  <span>📥</span>
                  <span>Processing_Files_Incoming</span>
                  <span
                    style={{
                      background: "#10b981",
                      color: "#ffffff",
                      fontSize: "0.65rem",
                      padding: "0.15rem 0.45rem",
                      borderRadius: "999px",
                      fontWeight: 900,
                    }}
                  >
                    Actif (3/3)
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setDirection("OUTGOING")}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    padding: "0.55rem 1.15rem",
                    borderRadius: "9px",
                    border: "none",
                    fontSize: "0.82rem",
                    fontWeight: 800,
                    cursor: "pointer",
                    background: direction === "OUTGOING" ? "#ffffff" : "transparent",
                    color: direction === "OUTGOING" ? "#0f172a" : "#cbd5e1",
                    boxShadow: direction === "OUTGOING" ? "0 4px 12px rgba(0,0,0,0.2)" : "none",
                    transition: "all 0.15s ease",
                  }}
                >
                  <span>📤</span>
                  <span>Processing_Files_Outgoing</span>
                  <span
                    style={{
                      background: "#f59e0b",
                      color: "#ffffff",
                      fontSize: "0.65rem",
                      padding: "0.15rem 0.45rem",
                      borderRadius: "999px",
                      fontWeight: 900,
                    }}
                  >
                    En attente
                  </span>
                </button>
              </div>

              {/* BOUTON VOIR CAPTURES SOURCES */}
              <button
                type="button"
                onClick={() => setShowOriginalCaptures(!showOriginalCaptures)}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.45rem",
                  padding: "0.45rem 0.9rem",
                  borderRadius: "8px",
                  border: "1px solid #475569",
                  background: showOriginalCaptures ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.05)",
                  color: "#f8fafc",
                  fontSize: "0.78rem",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                <span>🔍</span>
                <span>{showOriginalCaptures ? "Masquer les descriptions sources" : "Inspecter les descriptions sources"}</span>
              </button>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* BANDEAU DES CAPTURES SOURCES (COLLAPSIBLE)                                */}
        {/* ========================================================================= */}
        {showOriginalCaptures && (
          <div
            style={{
              background: "#0c1322",
              borderRadius: "16px",
              padding: "1.5rem",
              marginBottom: "1.5rem",
              border: "1px solid #334155",
              boxShadow: "0 8px 25px rgba(0,0,0,0.3)",
            }}
          >
            <strong style={{ fontSize: "0.95rem", color: "#f8fafc", display: "block", marginBottom: "1rem" }}>
              Captures Mind Map transmises par l'utilisateur pour les 3 réseaux :
            </strong>

            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {/* GIMAC */}
              <div style={{ background: "#000000", padding: "0.75rem 1rem", borderRadius: "8px", border: "1px solid #1e293b" }}>
                <div style={{ fontSize: "0.75rem", color: "#f59e0b", marginBottom: "0.4rem", fontWeight: 800 }}>
                  ⭐ 1. GIMAC (CEMAC) :
                </div>
                <div style={{ fontSize: "0.8rem", color: "#cbd5e1", lineHeight: 1.6 }}>
                  [GIMAC (CEMAC)] ➔ [GABON ET CAM] ➔ [RECUPERATION SUR MACHINE DISTANTE] ➔ [SAUVEGARDE + DEPOT] ➔ 2 branches : Comptabilisation (Gabon/Cam ➔ J-1 ➔ Mail opération) / ON-US (Gabon uniquement ➔ Mail opération)
                </div>
              </div>

              {/* VISA */}
              <div style={{ background: "#000000", padding: "0.75rem 1rem", borderRadius: "8px", border: "1px solid #1e293b" }}>
                <div style={{ fontSize: "0.75rem", color: "#34d399", marginBottom: "0.4rem", fontWeight: 800 }}>
                  💳 2. VISA (International) :
                </div>
                <div style={{ fontSize: "0.8rem", color: "#cbd5e1", lineHeight: 1.6 }}>
                  [VISA] ➔ [RECUPERATION DU FICHIER PAR MAIL] ➔ [DEPOSER SUR WINSCP DE FACON INDIVIDUEL POUR CHAQUE FILIALE] ➔ [DONNER TOUS LES DROITS (777) AU FICHIER] ➔ [Copier le nom du fichier déposer] ➔ [SE CONNECTER SUR PAYWAY] ➔ (1-Intégration / 2-Réconciliation / 3-Settlement CRE) ➔ [4-Génération du fichier de règlement (DE)...] ➔ [1-Supprimer transactions décalées] ➔ Branches : Dashboard (CIV, Mali, Mad, Gabon) / Appli Ulrich (Guinée, Comores) / Cameroun (Ancienne appli) ➔ [Transmettre par mail à l'operation]
                </div>
              </div>

              {/* GIM */}
              <div style={{ background: "#000000", padding: "0.75rem 1rem", borderRadius: "8px", border: "1px solid #1e293b" }}>
                <div style={{ fontSize: "0.75rem", color: "#38bdf8", marginBottom: "0.4rem", fontWeight: 800 }}>
                  🔷 3. GIM (UEMOA) :
                </div>
                <div style={{ fontSize: "0.8rem", color: "#cbd5e1", lineHeight: 1.6 }}>
                  [GIM (UEMOA)] ➔ [Se connecter sur GIM] ➔ [Récupérer LIS + pdf] ➔ [Zipper 3 pdf] ➔ [Récupérer zippés + LIS] ➔ [Déposer dans répertoire] ➔ 3 branches : 1-Génération CRE (WinSCP ➔ Payway ➔ 4 processus ➔ Dashboard ➔ DE) / 2-Générer xls depuis appli Ulrich / 3-Fichiers à transmettre (DE, xls, dossier zippé)
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* PARCOURS OUTGOING : EN ATTENTE DU SCHÉMA SORTANT                          */}
        {/* ========================================================================= */}
        {direction === "OUTGOING" ? (
          <div
            style={{
              background: "#ffffff",
              borderRadius: "20px",
              border: "2px dashed #cbd5e1",
              padding: "4.5rem 2rem",
              textAlign: "center",
              boxShadow: "0 1px 3px rgba(0,0,0,0.02)",
            }}
          >
            <div
              style={{
                width: "72px",
                height: "72px",
                borderRadius: "18px",
                background: "#fef3c7",
                color: "#d97706",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "2.25rem",
                marginBottom: "1.25rem",
              }}
            >
              📤
            </div>
            <h3 style={{ fontSize: "1.45rem", fontWeight: 900, color: "#0f172a", margin: "0 0 0.6rem" }}>
              Processing_Files_Outgoing : En attente de votre capture Outgoing
            </h3>
            <p
              style={{
                fontSize: "0.95rem",
                color: "#64748b",
                maxWidth: "680px",
                margin: "0 auto 1.75rem",
                lineHeight: 1.6,
              }}
            >
              Les 3 parcours entrants (Incoming) sont désormais tous validés. Dès que vous transmettrez la capture du traitement sortant (Outgoing), elle sera intégrée avec la même rigueur.
            </p>
          </div>
        ) : (
          /* ========================================================================= */
          /* PARCOURS INCOMING ACTIF (3 RÉSEAUX)                                       */
          /* ========================================================================= */
          <div>
            {/* SÉLECTEUR DES 3 RÉSEAUX INTERBANCAIRES */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
                gap: "1.25rem",
                marginBottom: "1.75rem",
              }}
            >
              {MINDMAP_INCOMING_FLOWS.map((flow) => {
                const isSelected = selectedNetwork === flow.networkId;
                return (
                  <button
                    key={flow.networkId}
                    type="button"
                    onClick={() => setSelectedNetwork(flow.networkId)}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      justifyContent: "space-between",
                      gap: "1rem",
                      padding: "1.25rem 1.4rem",
                      borderRadius: "16px",
                      background: isSelected ? flow.themeColor.bg : "#ffffff",
                      border: `2px solid ${isSelected ? flow.themeColor.accent : "#e2e8f0"}`,
                      cursor: "pointer",
                      textAlign: "left",
                      boxShadow: isSelected
                        ? `0 10px 25px -5px ${flow.themeColor.glow}`
                        : "0 1px 3px rgba(0,0,0,0.03)",
                      transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
                    }}
                  >
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.4rem" }}>
                        <span
                          style={{
                            width: "10px",
                            height: "10px",
                            borderRadius: "50%",
                            background: flow.themeColor.accent,
                            boxShadow: `0 0 8px ${flow.themeColor.accent}`,
                          }}
                        />
                        <span
                          style={{
                            fontSize: "0.72rem",
                            fontWeight: 900,
                            letterSpacing: "0.06em",
                            color: isSelected ? flow.themeColor.text : "#64748b",
                            textTransform: "uppercase",
                          }}
                        >
                          {flow.badge}
                        </span>
                      </div>

                      <h3
                        style={{
                          fontSize: "1.25rem",
                          fontWeight: 900,
                          color: isSelected ? "#ffffff" : "#0f172a",
                          margin: "0 0 0.35rem",
                        }}
                      >
                        {flow.networkName}
                      </h3>

                      <p
                        style={{
                          fontSize: "0.82rem",
                          color: isSelected ? "#cbd5e1" : "#64748b",
                          margin: "0 0 0.75rem",
                          lineHeight: 1.4,
                        }}
                      >
                        {flow.zone}
                      </p>

                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <span
                          style={{
                            fontSize: "0.72rem",
                            fontWeight: 800,
                            padding: "0.2rem 0.55rem",
                            borderRadius: "6px",
                            background: "#10b981",
                            color: "#ffffff",
                          }}
                        >
                          ✅ Parcours Validé 100%
                        </span>
                        <span
                          style={{
                            fontSize: "0.72rem",
                            fontWeight: 800,
                            padding: "0.2rem 0.55rem",
                            borderRadius: "6px",
                            background: isSelected ? flow.themeColor.badgeBg : "#f1f5f9",
                            color: isSelected ? flow.themeColor.text : "#475569",
                          }}
                        >
                          Devise : {flow.currency}
                        </span>
                      </div>
                    </div>

                    <div
                      style={{
                        width: "36px",
                        height: "36px",
                        borderRadius: "10px",
                        background: isSelected ? flow.themeColor.accent : "#f1f5f9",
                        color: isSelected ? "#ffffff" : "#64748b",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "1.1rem",
                        flexShrink: 0,
                      }}
                    >
                      {flow.networkId === "GIMAC" ? "⭐" : flow.networkId === "VISA" ? "💳" : "🔷"}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* ===================================================================== */}
            {/* 1. AFFICHAGE DU RÉSEAU VISA                                           */}
            {/* ===================================================================== */}
            {selectedNetwork === "VISA" && currentFlow.visaWorkflow && (
              <div>
                <div
                  style={{
                    background: "#04140e",
                    borderRadius: "20px",
                    padding: "2.25rem",
                    border: "2px solid #059669",
                    boxShadow: "0 20px 40px rgba(0,0,0,0.5)",
                    marginBottom: "2rem",
                    overflowX: "auto",
                  }}
                >
                  {/* EN-TÊTE VISA */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      flexWrap: "wrap",
                      gap: "1rem",
                      marginBottom: "2rem",
                      paddingBottom: "1.25rem",
                      borderBottom: "1px solid #0f3928",
                    }}
                  >
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <span style={{ fontSize: "1.2rem" }}>🗺️</span>
                        <h3 style={{ color: "#ecfdf5", fontSize: "1.25rem", fontWeight: 900, margin: 0 }}>
                          Schéma Mind Map : VISA (International)
                        </h3>
                      </div>
                      <p style={{ color: "#34d399", fontSize: "0.85rem", margin: "0.35rem 0 0", fontWeight: 600 }}>
                        Transcription mot à mot des captures VISA • Mail ➔ WinSCP ➔ Payway ➔ Génération CRE ➔ Dashboard / Ulrich / Cameroun ➔ Mail
                      </p>
                    </div>

                    <span
                      style={{
                        background: "rgba(16, 185, 129, 0.2)",
                        border: "1px solid #10b981",
                        color: "#a7f3d0",
                        fontSize: "0.78rem",
                        fontWeight: 800,
                        padding: "0.35rem 0.85rem",
                        borderRadius: "8px",
                      }}
                    >
                      Multi-filiales : CIV, Mali, Mad, Gabon, Guinée, Comores, Cameroun
                    </span>
                  </div>

                  {/* 1. TRONC INITIAL (MAIL ➔ WINSCP ➔ DROITS ➔ COPIE NOM ➔ PAYWAY) */}
                  <div style={{ marginBottom: "2.5rem" }}>
                    <div style={{ fontSize: "0.75rem", fontWeight: 800, color: "#34d399", textTransform: "uppercase", marginBottom: "0.85rem", letterSpacing: "0.08em" }}>
                      1. Tronc Commun d'Initialisation & Dépôt Fichiers
                    </div>

                    <div style={{ display: "flex", alignItems: "center", minWidth: "1200px" }}>
                      <div
                        style={{
                          background: "#065f46",
                          border: "2px solid #10b981",
                          borderRadius: "14px",
                          padding: "1rem 1.4rem",
                          color: "#ffffff",
                          fontWeight: 900,
                          fontSize: "0.95rem",
                          textAlign: "center",
                          minWidth: "160px",
                          boxShadow: "0 0 20px rgba(16, 185, 129, 0.35)",
                          flexShrink: 0,
                        }}
                      >
                        {currentFlow.rootNodeTitle}
                      </div>

                      {currentFlow.visaWorkflow.prePaywaySteps.map((st, idx) => (
                        <div key={idx} style={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
                          <div style={{ width: "35px", height: "2px", background: "#10b981", position: "relative" }}>
                            <div style={{ position: "absolute", right: "-2px", top: "-4px", width: 0, height: 0, borderTop: "5px solid transparent", borderBottom: "5px solid transparent", borderLeft: "6px solid #10b981" }} />
                          </div>

                          <div
                            style={{
                              background: "#08291c",
                              border: "1.5px solid #059669",
                              borderRadius: "12px",
                              padding: "0.85rem 1.15rem",
                              color: "#e2e8f0",
                              fontWeight: 800,
                              fontSize: "0.82rem",
                              textAlign: "center",
                              maxWidth: "240px",
                              lineHeight: 1.35,
                            }}
                          >
                            {st}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 2. ÉTAPE PAYWAY : 3 PROCESSUS (INTÉGRATION, RÉCONCILIATION, SETTLEMENT CRE) */}
                  <div style={{ marginBottom: "2.5rem", borderTop: "1px dashed #0f3928", paddingTop: "2rem" }}>
                    <div style={{ fontSize: "0.75rem", fontWeight: 800, color: "#34d399", textTransform: "uppercase", marginBottom: "0.85rem", letterSpacing: "0.08em" }}>
                      2. Traitement sur Payway (Recherche & Exécution des 3 Processus)
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: "1rem" }}>
                      {currentFlow.visaWorkflow.paywayActions.map((act, aIdx) => (
                        <div
                          key={aIdx}
                          style={{
                            background: "#08291c",
                            borderRadius: "14px",
                            padding: "1.25rem",
                            border: "1.5px solid #059669",
                          }}
                        >
                          <div style={{ fontSize: "0.88rem", fontWeight: 900, color: "#a7f3d0", marginBottom: "0.5rem" }}>
                            {act.title}
                          </div>
                          <div style={{ fontSize: "0.8rem", color: "#cbd5e1", lineHeight: 1.5, background: "#041a12", padding: "0.75rem", borderRadius: "8px", border: "1px solid #0a3d29" }}>
                            {act.detail}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 3. SETTLEMENT & NETTOYAGE PRÉALABLE */}
                  <div style={{ marginBottom: "2.5rem", borderTop: "1px dashed #0f3928", paddingTop: "2rem" }}>
                    <div style={{ fontSize: "0.75rem", fontWeight: 800, color: "#34d399", textTransform: "uppercase", marginBottom: "0.85rem", letterSpacing: "0.08em" }}>
                      3. Étape Clé de Génération DE & Contrôle Préalable
                    </div>

                    <div style={{ display: "flex", gap: "1.25rem", flexWrap: "wrap" }}>
                      <div
                        style={{
                          flex: 1,
                          minWidth: "320px",
                          background: "#08291c",
                          borderRadius: "14px",
                          padding: "1.25rem",
                          border: "2px solid #10b981",
                          color: "#ecfdf5",
                          boxShadow: "0 0 15px rgba(16, 185, 129, 0.2)",
                        }}
                      >
                        <div style={{ fontSize: "0.72rem", color: "#34d399", fontWeight: 900, textTransform: "uppercase", marginBottom: "0.3rem" }}>
                          Étape Pivot :
                        </div>
                        <div style={{ fontSize: "0.92rem", fontWeight: 900 }}>
                          {currentFlow.visaWorkflow.settlementGenerationTitle}
                        </div>
                      </div>

                      <div
                        style={{
                          flex: 1,
                          minWidth: "320px",
                          background: "#041a12",
                          borderRadius: "14px",
                          padding: "1.25rem",
                          border: "1.5px solid #047857",
                          color: "#fef3c7",
                        }}
                      >
                        <div style={{ fontSize: "0.72rem", color: "#fbbf24", fontWeight: 900, textTransform: "uppercase", marginBottom: "0.3rem" }}>
                          Contrôle de nettoyage obligatoire :
                        </div>
                        <div style={{ fontSize: "0.88rem", fontWeight: 800 }}>
                          {currentFlow.visaWorkflow.cleanStepTitle}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 4. DÉVERSEMENT PAR FILIALES ET APPLICATIONS */}
                  <div style={{ borderTop: "1px dashed #0f3928", paddingTop: "2rem" }}>
                    <div style={{ fontSize: "0.75rem", fontWeight: 800, color: "#34d399", textTransform: "uppercase", marginBottom: "1.25rem", letterSpacing: "0.08em" }}>
                      4. Ventilation par Applications & Groupes de Filiales
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                      {currentFlow.visaWorkflow.streams.map((stream, sIdx) => (
                        <div
                          key={sIdx}
                          style={{
                            background: "#08291c",
                            borderRadius: "16px",
                            padding: "1.5rem",
                            border: "1.5px solid #10b981",
                          }}
                        >
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.5rem", marginBottom: "1rem" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                              <span
                                style={{
                                  background: "#065f46",
                                  border: "1px solid #10b981",
                                  color: "#a7f3d0",
                                  fontSize: "0.72rem",
                                  fontWeight: 900,
                                  padding: "0.25rem 0.6rem",
                                  borderRadius: "6px",
                                }}
                              >
                                {stream.appType}
                              </span>
                              <strong style={{ fontSize: "1rem", color: "#ecfdf5" }}>
                                {stream.title}
                              </strong>
                            </div>
                            <span style={{ fontSize: "0.78rem", color: "#34d399", fontWeight: 800 }}>
                              Filiales : {stream.filiales}
                            </span>
                          </div>

                          {stream.detailProcess && (
                            <div style={{ background: "#041a12", borderRadius: "10px", padding: "0.85rem 1rem", border: "1px solid #0f3928", fontSize: "0.82rem", color: "#cbd5e1", lineHeight: 1.5, marginBottom: "1rem" }}>
                              {stream.detailProcess}
                            </div>
                          )}

                          {/* Enchaînement final */}
                          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
                            {stream.finalSteps.map((fst, fIdx) => (
                              <div key={fIdx} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                {fIdx > 0 && <span style={{ color: "#10b981", fontWeight: 900 }}>➔</span>}
                                <span
                                  style={{
                                    background: fst.includes("Transmettre par mail") ? "#064e3b" : "#0f3928",
                                    border: `1.5px solid ${fst.includes("Transmettre par mail") ? "#10b981" : "#047857"}`,
                                    color: fst.includes("Transmettre par mail") ? "#a7f3d0" : "#e2e8f0",
                                    fontSize: "0.82rem",
                                    fontWeight: 800,
                                    padding: "0.5rem 0.9rem",
                                    borderRadius: "8px",
                                  }}
                                >
                                  {fst.includes("Transmettre par mail") ? "✉️ " : ""}{fst}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* TABLEAU RÉCAPITULATIF TEXTUEL VISA */}
                <div
                  style={{
                    background: "#ffffff",
                    borderRadius: "18px",
                    border: "1px solid #e2e8f0",
                    padding: "1.75rem",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
                  }}
                >
                  <h3 style={{ fontSize: "1.1rem", fontWeight: 900, color: "#0f172a", margin: "0 0 1rem" }}>
                    Détail Textuel Conforme du Parcours VISA (International)
                  </h3>

                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))", gap: "1.5rem" }}>
                    <div style={{ background: "#f8fafc", borderRadius: "14px", padding: "1.25rem", border: "1px solid #e2e8f0" }}>
                      <strong style={{ fontSize: "0.92rem", color: "#0f172a", display: "block", marginBottom: "0.75rem" }}>
                        Initialisation & Payway
                      </strong>
                      <ol style={{ margin: 0, paddingLeft: "1.25rem", fontSize: "0.84rem", color: "#334155", lineHeight: 1.8 }}>
                        <li><code>VISA</code></li>
                        <li><code>RECUPERATION DU FICHIER PAR MAIL</code></li>
                        <li><code>DEPOSER SUR WINSCP DE FACON INDIVIDUEL POUR CHAQUE FILIALE</code></li>
                        <li><code>DONNER TOUS LES DROITS (777) AU FICHIER</code></li>
                        <li><code>Copier le nom du fichier déposer</code></li>
                        <li><code>SE CONNECTER SUR PAYWAY</code></li>
                        <li style={{ paddingLeft: "0.5rem", color: "#059669", fontWeight: 700 }}>➔ 1-Process intégration fichier VISA</li>
                        <li style={{ paddingLeft: "0.5rem", color: "#059669", fontWeight: 700 }}>➔ 2-Faire la réconciliation</li>
                        <li style={{ paddingLeft: "0.5rem", color: "#059669", fontWeight: 700 }}>➔ 3-Génération du fichier CRE (Settlement)</li>
                      </ol>
                    </div>

                    <div style={{ background: "#f8fafc", borderRadius: "14px", padding: "1.25rem", border: "1px solid #e2e8f0" }}>
                      <strong style={{ fontSize: "0.92rem", color: "#0f172a", display: "block", marginBottom: "0.75rem" }}>
                        Filiales CIV, Mali, Madagascar, Gabon, Guinée & Comores
                      </strong>
                      <ul style={{ margin: 0, paddingLeft: "1.25rem", fontSize: "0.84rem", color: "#334155", lineHeight: 1.8 }}>
                        <li><code>4-Génération du fichier de règlement (DE) sur la base du fichier CRE</code></li>
                        <li><code>1-Supprimer du fichier toutes les transactions décalées en bas</code></li>
                        <li style={{ marginTop: "0.5rem" }}>
                          <strong>Dashboard Monétique :</strong><br />
                          CIV, Mali, Madagascar, Gabon ➔ Retirer l'heure ➔ <span style={{ color: "#059669", fontWeight: 800 }}>Transmettre par mail</span>
                        </li>
                        <li style={{ marginTop: "0.5rem" }}>
                          <strong>Appli Ulrich :</strong><br />
                          Guinée et Comores ➔ <span style={{ color: "#059669", fontWeight: 800 }}>Transmettre par mail</span>
                        </li>
                      </ul>
                    </div>

                    <div style={{ background: "#f8fafc", borderRadius: "14px", padding: "1.25rem", border: "1px solid #e2e8f0" }}>
                      <strong style={{ fontSize: "0.92rem", color: "#0f172a", display: "block", marginBottom: "0.75rem" }}>
                        Filiale Cameroun
                      </strong>
                      <ul style={{ margin: 0, paddingLeft: "1.25rem", fontSize: "0.84rem", color: "#334155", lineHeight: 1.8 }}>
                        <li><code>3-Pour le Cameroun, sur la base du fichier LIS (initialement récupéré), utilisé l'ancienne application</code></li>
                        <li><code>4-Generer le DE</code></li>
                        <li style={{ color: "#059669", fontWeight: 800 }}><code>Transmettre par mail à l'operation</code></li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ===================================================================== */}
            {/* 2. AFFICHAGE DU RÉSEAU GIM (UEMOA)                                    */}
            {/* ===================================================================== */}
            {selectedNetwork === "GIM" && (
              <div>
                <div
                  style={{
                    background: "#050b14",
                    borderRadius: "20px",
                    padding: "2.25rem",
                    border: "2px solid #1e3a8a",
                    boxShadow: "0 20px 40px rgba(0,0,0,0.5)",
                    marginBottom: "2rem",
                    overflowX: "auto",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      flexWrap: "wrap",
                      gap: "1rem",
                      marginBottom: "2rem",
                      paddingBottom: "1.25rem",
                      borderBottom: "1px solid #1e293b",
                    }}
                  >
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <span style={{ fontSize: "1.2rem" }}>🗺️</span>
                        <h3 style={{ color: "#f8fafc", fontSize: "1.25rem", fontWeight: 900, margin: 0 }}>
                          Schéma Mind Map : GIM (UEMOA)
                        </h3>
                      </div>
                      <p style={{ color: "#60a5fa", fontSize: "0.85rem", margin: "0.35rem 0 0", fontWeight: 600 }}>
                        Transcription mot à mot des captures GIM • Fichiers LIS & PDF ➔ Génération CRE ➔ Dashboard ➔ Obtention DE
                      </p>
                    </div>

                    <span
                      style={{
                        background: "rgba(59, 130, 246, 0.2)",
                        border: "1px solid #3b82f6",
                        color: "#93c5fd",
                        fontSize: "0.78rem",
                        fontWeight: 800,
                        padding: "0.35rem 0.85rem",
                        borderRadius: "8px",
                      }}
                    >
                      3 Branches d'aboutissement
                    </span>
                  </div>

                  {/* Tronc initial GIM */}
                  <div style={{ marginBottom: "2.5rem" }}>
                    <div style={{ fontSize: "0.75rem", fontWeight: 800, color: "#60a5fa", textTransform: "uppercase", marginBottom: "0.85rem", letterSpacing: "0.08em" }}>
                      1. Tronc Initial de Récupération & Préparation
                    </div>

                    <div style={{ display: "flex", alignItems: "center", minWidth: "1200px" }}>
                      <div
                        style={{
                          background: "#1e3a8a",
                          border: "2px solid #3b82f6",
                          borderRadius: "14px",
                          padding: "1rem 1.4rem",
                          color: "#ffffff",
                          fontWeight: 900,
                          fontSize: "0.95rem",
                          textAlign: "center",
                          minWidth: "170px",
                          boxShadow: "0 0 20px rgba(59, 130, 246, 0.35)",
                          flexShrink: 0,
                        }}
                      >
                        {currentFlow.rootNodeTitle}
                      </div>

                      {currentFlow.commonPreSteps?.map((stepTitle, idx) => (
                        <div key={idx} style={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
                          <div style={{ width: "35px", height: "2px", background: "#3b82f6", position: "relative" }}>
                            <div style={{ position: "absolute", right: "-2px", top: "-4px", width: 0, height: 0, borderTop: "5px solid transparent", borderBottom: "5px solid transparent", borderLeft: "6px solid #3b82f6" }} />
                          </div>

                          <div
                            style={{
                              background: "#0f1f38",
                              border: "1.5px solid #2563eb",
                              borderRadius: "12px",
                              padding: "0.85rem 1.15rem",
                              color: "#e2e8f0",
                              fontWeight: 800,
                              fontSize: "0.82rem",
                              textAlign: "center",
                              maxWidth: "230px",
                              lineHeight: 1.35,
                            }}
                          >
                            {stepTitle}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 3 branches GIM */}
                  <div style={{ borderTop: "1px dashed #1e3a8a", paddingTop: "2rem" }}>
                    <div style={{ fontSize: "0.75rem", fontWeight: 800, color: "#60a5fa", textTransform: "uppercase", marginBottom: "1.25rem", letterSpacing: "0.08em" }}>
                      2. Branches de Traitement depuis "Déposer dans mon répertoire de traitement pour la filiale"
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "1.75rem" }}>
                      {/* BRANCHE 1 CRE */}
                      <div
                        style={{
                          background: "#081326",
                          borderRadius: "16px",
                          padding: "1.5rem",
                          border: "1.5px solid #3b82f6",
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.25rem" }}>
                          <span
                            style={{
                              fontSize: "0.72rem",
                              fontWeight: 900,
                              color: "#ffffff",
                              background: "#2563eb",
                              padding: "0.25rem 0.65rem",
                              borderRadius: "6px",
                            }}
                          >
                            BRANCHE PRINCIPALE 1
                          </span>
                          <strong style={{ fontSize: "1.05rem", color: "#f8fafc" }}>
                            1-Génération du CRE
                          </strong>
                        </div>

                        <div style={{ display: "flex", alignItems: "center", overflowX: "auto", paddingBottom: "1rem" }}>
                          <div
                            style={{
                              background: "#1e3a8a",
                              border: "1.5px solid #3b82f6",
                              borderRadius: "12px",
                              padding: "0.85rem 1.15rem",
                              color: "#ffffff",
                              fontWeight: 800,
                              fontSize: "0.82rem",
                              textAlign: "center",
                              minWidth: "170px",
                              flexShrink: 0,
                            }}
                          >
                            1-Génération du CRE
                          </div>

                          <div style={{ width: "35px", height: "2px", background: "#3b82f6", flexShrink: 0 }} />

                          <div
                            style={{
                              background: "#0f1f38",
                              border: "1.5px solid #2563eb",
                              borderRadius: "12px",
                              padding: "0.85rem 1.15rem",
                              color: "#e2e8f0",
                              fontWeight: 800,
                              fontSize: "0.82rem",
                              textAlign: "center",
                              minWidth: "190px",
                              flexShrink: 0,
                            }}
                          >
                            déposer le fichier sur WinSCP
                          </div>

                          <div style={{ width: "35px", height: "2px", background: "#3b82f6", flexShrink: 0 }} />

                          <div
                            style={{
                              background: "#0f1f38",
                              border: "1.5px solid #2563eb",
                              borderRadius: "12px",
                              padding: "0.85rem 1.15rem",
                              color: "#e2e8f0",
                              fontWeight: 800,
                              fontSize: "0.82rem",
                              textAlign: "center",
                              minWidth: "180px",
                              flexShrink: 0,
                            }}
                          >
                            Se connecter à Payway
                          </div>

                          <div style={{ width: "35px", height: "2px", background: "#3b82f6", flexShrink: 0 }} />

                          <div
                            style={{
                              background: "#172554",
                              border: "2px solid #60a5fa",
                              borderRadius: "14px",
                              padding: "1rem 1.25rem",
                              minWidth: "290px",
                              flexShrink: 0,
                              boxShadow: "0 0 15px rgba(59, 130, 246, 0.2)",
                            }}
                          >
                            <div style={{ fontSize: "0.82rem", fontWeight: 900, color: "#93c5fd", marginBottom: "0.6rem" }}>
                              Suivre le process de génération du fichier CRE GIM sur Payway,
                            </div>
                            <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
                              {currentFlow.gimBranches?.[0].paywaySubProcesses?.map((proc, pIdx) => (
                                <div
                                  key={pIdx}
                                  style={{
                                    background: "#0f172a",
                                    borderRadius: "6px",
                                    padding: "0.35rem 0.55rem",
                                    fontSize: "0.74rem",
                                    color: "#cbd5e1",
                                    borderLeft: "3px solid #38bdf8",
                                    fontWeight: 700,
                                  }}
                                >
                                  {proc}
                                </div>
                              ))}
                            </div>
                          </div>

                          <div style={{ width: "35px", height: "2px", background: "#10b981", flexShrink: 0 }} />

                          <div
                            style={{
                              background: "#064e3b",
                              border: "2px solid #10b981",
                              borderRadius: "14px",
                              padding: "1rem 1.25rem",
                              color: "#ecfdf5",
                              fontWeight: 800,
                              fontSize: "0.82rem",
                              maxWidth: "320px",
                              lineHeight: 1.45,
                              boxShadow: "0 0 20px rgba(16, 185, 129, 0.35)",
                              flexShrink: 0,
                            }}
                          >
                            <div style={{ fontSize: "0.68rem", fontWeight: 900, color: "#34d399", marginBottom: "0.3rem", textTransform: "uppercase" }}>
                              🎯 ABOUTISSEMENT CLÉ :
                            </div>
                            {currentFlow.gimBranches?.[0].finalOutcome}
                          </div>
                        </div>
                      </div>

                      {/* BRANCHE 2 & BRANCHE 3 */}
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))", gap: "1.25rem" }}>
                        <div style={{ background: "#081326", borderRadius: "14px", padding: "1.25rem", border: "1.5px solid #2563eb", display: "flex", alignItems: "center", gap: "1rem" }}>
                          <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "#2563eb", color: "#ffffff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, flexShrink: 0 }}>
                            2
                          </div>
                          <div>
                            <div style={{ fontSize: "0.72rem", color: "#60a5fa", fontWeight: 800, textTransform: "uppercase" }}>Branche Parallèle 2</div>
                            <div style={{ fontSize: "0.92rem", fontWeight: 900, color: "#ffffff", marginTop: "0.2rem" }}>
                              {currentFlow.gimBranches?.[1].title}
                            </div>
                          </div>
                        </div>

                        <div style={{ background: "#081326", borderRadius: "14px", padding: "1.25rem", border: "1.5px solid #10b981", display: "flex", alignItems: "center", gap: "1rem" }}>
                          <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "#059669", color: "#ffffff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, flexShrink: 0 }}>
                            3
                          </div>
                          <div>
                            <div style={{ fontSize: "0.72rem", color: "#34d399", fontWeight: 800, textTransform: "uppercase" }}>Branche Parallèle 3 (Livrables)</div>
                            <div style={{ fontSize: "0.92rem", fontWeight: 900, color: "#ffffff", marginTop: "0.2rem" }}>
                              {currentFlow.gimBranches?.[2].title}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ===================================================================== */}
            {/* 3. AFFICHAGE DU RÉSEAU GIMAC (CEMAC)                                  */}
            {/* ===================================================================== */}
            {selectedNetwork === "GIMAC" && (
              <div>
                <div
                  style={{
                    background: "#080703",
                    borderRadius: "20px",
                    padding: "2.25rem",
                    border: "2px solid #5a4013",
                    boxShadow: "0 20px 40px rgba(0,0,0,0.5)",
                    marginBottom: "2rem",
                    overflowX: "auto",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      flexWrap: "wrap",
                      gap: "1rem",
                      marginBottom: "2rem",
                      paddingBottom: "1.25rem",
                      borderBottom: "1px solid #2e210b",
                    }}
                  >
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <span style={{ fontSize: "1.2rem" }}>🗺️</span>
                        <h3 style={{ color: "#fef3c7", fontSize: "1.25rem", fontWeight: 900, margin: 0 }}>
                          Schéma Mind Map : GIMAC (CEMAC)
                        </h3>
                      </div>
                      <p style={{ color: "#d97706", fontSize: "0.85rem", margin: "0.35rem 0 0", fontWeight: 600 }}>
                        Structure mot pour mot issue des captures GIMAC • Tronc commun ➔ 2 branches finales
                      </p>
                    </div>

                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      <button
                        type="button"
                        onClick={() => setActiveBranchId("ALL")}
                        style={{
                          padding: "0.4rem 0.85rem",
                          borderRadius: "8px",
                          border: `1px solid ${activeBranchId === "ALL" ? "#f59e0b" : "#45310e"}`,
                          background: activeBranchId === "ALL" ? "#78350f" : "transparent",
                          color: "#fde68a",
                          fontSize: "0.78rem",
                          fontWeight: 700,
                          cursor: "pointer",
                        }}
                      >
                        Toutes les branches (2)
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveBranchId("compta")}
                        style={{
                          padding: "0.4rem 0.85rem",
                          borderRadius: "8px",
                          border: `1px solid ${activeBranchId === "compta" ? "#3b82f6" : "#45310e"}`,
                          background: activeBranchId === "compta" ? "#1e3a8a" : "transparent",
                          color: "#bfdbfe",
                          fontSize: "0.78rem",
                          fontWeight: 700,
                          cursor: "pointer",
                        }}
                      >
                        Branche 1 : Comptabilisation
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveBranchId("onus")}
                        style={{
                          padding: "0.4rem 0.85rem",
                          borderRadius: "8px",
                          border: `1px solid ${activeBranchId === "onus" ? "#10b981" : "#45310e"}`,
                          background: activeBranchId === "onus" ? "#064e3b" : "transparent",
                          color: "#a7f3d0",
                          fontSize: "0.78rem",
                          fontWeight: 700,
                          cursor: "pointer",
                        }}
                      >
                        Branche 2 : ON-US
                      </button>
                    </div>
                  </div>

                  {/* Tronc commun GIMAC */}
                  <div style={{ marginBottom: "2rem" }}>
                    <div style={{ fontSize: "0.75rem", fontWeight: 800, color: "#d97706", textTransform: "uppercase", marginBottom: "0.85rem", letterSpacing: "0.08em" }}>
                      1. Tronc Commun d'Initialisation (Gabon & Cameroun)
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "0", minWidth: "900px" }}>
                      <div
                        style={{
                          background: "#45310e",
                          border: "2px solid #b45309",
                          borderRadius: "14px",
                          padding: "1rem 1.4rem",
                          color: "#fef3c7",
                          fontWeight: 900,
                          fontSize: "0.95rem",
                          textAlign: "center",
                          minWidth: "170px",
                          boxShadow: "0 0 20px rgba(245, 158, 11, 0.25)",
                        }}
                      >
                        {currentFlow.rootNodeTitle}
                      </div>

                      {currentFlow.commonPreSteps?.map((stepTitle, idx) => (
                        <div key={idx} style={{ display: "flex", alignItems: "center" }}>
                          <div style={{ width: "40px", height: "2px", background: "#b45309", position: "relative" }}>
                            <div style={{ position: "absolute", right: "-2px", top: "-4px", width: 0, height: 0, borderTop: "5px solid transparent", borderBottom: "5px solid transparent", borderLeft: "6px solid #b45309" }} />
                          </div>

                          <div
                            style={{
                              background: "#261a06",
                              border: "1.5px solid #854d0e",
                              borderRadius: "12px",
                              padding: "0.85rem 1.15rem",
                              color: "#fde68a",
                              fontWeight: 800,
                              fontSize: "0.82rem",
                              textAlign: "center",
                              maxWidth: "220px",
                              lineHeight: 1.35,
                            }}
                          >
                            {stepTitle}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Branches GIMAC */}
                  <div style={{ marginTop: "2.5rem", borderTop: "1px dashed #45310e", paddingTop: "2rem" }}>
                    <div style={{ fontSize: "0.75rem", fontWeight: 800, color: "#d97706", textTransform: "uppercase", marginBottom: "1.25rem", letterSpacing: "0.08em" }}>
                      2. Déversement & Actions Spécifiques par Branche
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
                      {currentFlow.exactBranches
                        ?.filter((br) => activeBranchId === "ALL" || (activeBranchId === "compta" && br.id === "gimac_branch_compta") || (activeBranchId === "onus" && br.id === "gimac_branch_onus"))
                        .map((branch) => (
                          <div
                            key={branch.id}
                            style={{
                              background: "#140e04",
                              borderRadius: "16px",
                              padding: "1.5rem",
                              border: `1.5px solid ${branch.badgeColor}50`,
                            }}
                          >
                            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.25rem" }}>
                              <span
                                style={{
                                  fontSize: "0.72rem",
                                  fontWeight: 900,
                                  color: branch.badgeColor,
                                  background: `${branch.badgeColor}20`,
                                  padding: "0.25rem 0.65rem",
                                  borderRadius: "6px",
                                  border: `1px solid ${branch.badgeColor}40`,
                                }}
                              >
                                {branch.scope}
                              </span>
                              <strong style={{ fontSize: "1rem", color: "#fef3c7" }}>
                                {branch.title}
                              </strong>
                            </div>

                            <div style={{ display: "flex", alignItems: "center", overflowX: "auto", paddingBottom: "0.75rem" }}>
                              {branch.steps.map((st, sIdx) => {
                                const isFinal = sIdx === branch.steps.length - 1;
                                return (
                                  <div key={sIdx} style={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
                                    {sIdx > 0 && (
                                      <div style={{ width: "35px", height: "2px", background: isFinal ? "#10b981" : "#854d0e", position: "relative" }}>
                                        <div style={{ position: "absolute", right: "-2px", top: "-4px", width: 0, height: 0, borderTop: "5px solid transparent", borderBottom: "5px solid transparent", borderLeft: `6px solid ${isFinal ? "#10b981" : "#854d0e"}` }} />
                                      </div>
                                    )}

                                    <div
                                      style={{
                                        background: isFinal ? "#064e3b" : "#261a06",
                                        border: `1.5px solid ${isFinal ? "#10b981" : "#b45309"}`,
                                        borderRadius: "12px",
                                        padding: "0.85rem 1.1rem",
                                        color: isFinal ? "#a7f3d0" : "#fde68a",
                                        fontWeight: 800,
                                        fontSize: "0.82rem",
                                        maxWidth: "230px",
                                        textAlign: "center",
                                        lineHeight: 1.35,
                                        boxShadow: isFinal ? "0 0 15px rgba(16, 185, 129, 0.3)" : "none",
                                      }}
                                    >
                                      {isFinal && <div style={{ fontSize: "0.68rem", fontWeight: 900, color: "#34d399", marginBottom: "0.25rem" }}>ÉTAPE FINALE</div>}
                                      {st}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </AppShell>
  );
}
