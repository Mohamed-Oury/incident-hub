"use client";

import React, { useState } from "react";
import {
  OUTGOING_METADATA,
  OUTGOING_GLOSSARY,
  OUTGOING_GENERIC_VARS,
  OUTGOING_COMMON_STEPS,
  OUTGOING_COMMON_RAPPEL,
  OUTGOING_FILIALES_RULES,
  OUTGOING_DEPOSIT_STEPS,
  OUTGOING_VISA_CONTROLS,
  CYBERSOURCE_STEPS,
  CYBERSOURCE_IWO_ALGORITHM,
  OUTGOING_HYPOTHESES,
  OUTGOING_RECOMMANDATIONS,
  OUTGOING_POINTS_OUVERTS,
} from "./outgoing-data";
import {
  Send,
  FileCheck,
  Building2,
  FolderDown,
  AlertTriangle,
  HelpCircle,
  Lightbulb,
  CheckCircle2,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  Layers,
  ChevronRight,
  Copy,
  Check,
  Mail,
  Server,
  DollarSign,
  AlertCircle,
  Search,
  ArrowDown,
  Info,
  CheckCircle,
  XCircle,
  FileText,
} from "lucide-react";

type OutgoingSubTab =
  | "WORKFLOW_A"
  | "FILIALES_B"
  | "DEPOT_C"
  | "CYBERSOURCE_D"
  | "HYPOTHESES_RECO"
  | "GLOSSAIRE";

export function OutgoingClearingWorkflow() {
  const [activeTab, setActiveTab] = useState<OutgoingSubTab>("WORKFLOW_A");
  const [selectedFilialeFilter, setSelectedFilialeFilter] = useState<string>("ALL");
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(null), 2000);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem", width: "100%", maxWidth: "100%", minWidth: 0, boxSizing: "border-box" }}>
      {/* ========================================================================= */}
      {/* 1. EN-TÊTE PRINCIPAL : PROCÉDURE OUTGOING (RÉFÉRENTIEL TERRAIN)           */}
      {/* ========================================================================= */}
      <div
        style={{
          background: "linear-gradient(135deg, #0a1120 0%, #111e36 100%)",
          border: "1.5px solid #1e3a5f",
          borderRadius: "20px",
          padding: "1.85rem 2.2rem",
          boxShadow: "0 12px 30px -5px rgba(0, 0, 0, 0.45)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Glow décoratif */}
        <div
          style={{
            position: "absolute",
            right: "-40px",
            top: "-40px",
            width: "250px",
            height: "250px",
            background: "radial-gradient(circle, rgba(56, 189, 248, 0.12) 0%, transparent 70%)",
            borderRadius: "50%",
            pointerEvents: "none",
          }}
        />

        <div style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: "1.5rem" }}>
          <div style={{ flex: 1, minWidth: "260px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", flexWrap: "wrap", marginBottom: "0.5rem" }}>
              <span
                style={{
                  fontSize: "0.75rem",
                  fontWeight: 900,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  padding: "4px 12px",
                  borderRadius: "20px",
                  background: "rgba(56, 189, 248, 0.2)",
                  color: "#38bdf8",
                  border: "1px solid rgba(56, 189, 248, 0.5)",
                }}
              >
                {OUTGOING_METADATA.documentType}
              </span>
              <span
                style={{
                  fontSize: "0.75rem",
                  fontWeight: 800,
                  padding: "4px 12px",
                  borderRadius: "20px",
                  background: "rgba(16, 185, 129, 0.2)",
                  color: "#34d399",
                  border: "1px solid rgba(16, 185, 129, 0.5)",
                }}
              >
                {OUTGOING_METADATA.version}
              </span>
            </div>

            <h2 style={{ fontSize: "1.65rem", fontWeight: 900, color: "#ffffff", margin: "0 0 0.5rem", letterSpacing: "-0.02em" }}>
              {OUTGOING_METADATA.title}
            </h2>

            <p style={{ fontSize: "0.92rem", color: "#cbd5e1", margin: "0 0 1rem", maxWidth: "880px", lineHeight: 1.55 }}>
              Source : <strong style={{ color: "#38bdf8" }}>{OUTGOING_METADATA.source}</strong>
            </p>

            {/* Règle méthodologique de terrain */}
            <div
              style={{
                background: "#071224",
                borderLeft: "4px solid #38bdf8",
                borderTop: "1px solid #1e3a5f",
                borderRight: "1px solid #1e3a5f",
                borderBottom: "1px solid #1e3a5f",
                padding: "10px 16px",
                borderRadius: "8px",
                fontSize: "0.86rem",
                color: "#f1f5f9",
                display: "inline-flex",
                alignItems: "center",
                gap: "10px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
              }}
            >
              <span style={{ fontSize: "1.1rem" }}>⚖️</span>
              <span>
                <strong style={{ color: "#38bdf8" }}>Règle Méthodologique :</strong> {OUTGOING_METADATA.rule}
              </span>
            </div>
          </div>

          {/* Badges de Périmètre */}
          <div
            style={{
              background: "#07101f",
              border: "1.5px solid #1e3a5f",
              borderRadius: "14px",
              padding: "1.15rem 1.35rem",
              minWidth: "240px",
              display: "flex",
              flexDirection: "column",
              gap: "0.6rem",
              boxShadow: "0 4px 15px rgba(0,0,0,0.35)",
            }}
          >
            <div style={{ fontSize: "0.78rem", fontWeight: 900, color: "#38bdf8", textTransform: "uppercase", letterSpacing: "0.06em", display: "flex", alignItems: "center", gap: "6px" }}>
              <span>🌐</span>
              <span>Périmètre Outgoing Validé</span>
            </div>
            {OUTGOING_METADATA.perimetre.map((p, idx) => (
              <div key={idx} style={{ fontSize: "0.82rem", color: "#f1f5f9", display: "flex", alignItems: "flex-start", gap: "8px" }}>
                <span style={{ color: "#10b981", fontWeight: 900, fontSize: "0.95rem" }}>✓</span>
                <span>{p}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Légende du document */}
        <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", marginTop: "1.35rem", paddingTop: "1.15rem", borderTop: "1px solid #1e293b" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.82rem" }}>
            <span style={{ padding: "3px 9px", borderRadius: "6px", background: "rgba(16, 185, 129, 0.25)", color: "#34d399", fontWeight: 900, border: "1px solid #10b981" }}>
              [CONFIRMÉ]
            </span>
            <span style={{ color: "#e2e8f0" }}>Vient directement des notes de terrain manuscrites</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.82rem" }}>
            <span style={{ padding: "3px 9px", borderRadius: "6px", background: "rgba(245, 158, 11, 0.25)", color: "#fbbf24", fontWeight: 900, border: "1px solid #f59e0b" }}>
              [HYPOTHÈSE]
            </span>
            <span style={{ color: "#e2e8f0" }}>Déduction logique à valider formellement</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.82rem" }}>
            <span style={{ padding: "3px 9px", borderRadius: "6px", background: "rgba(56, 189, 248, 0.25)", color: "#38bdf8", fontWeight: 900, border: "1px solid #0284c7" }}>
              [RECO]
            </span>
            <span style={{ color: "#e2e8f0" }}>Recommandation d&apos;amélioration opérationnelle</span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. BARRE D'ONGLETS THÉMATIQUES (CONTRASTE ÉLEVÉ & PILLS MODERNES)         */}
      {/* ========================================================================= */}
      <div
        style={{
          display: "flex",
          gap: "8px",
          flexWrap: "wrap",
          background: "#080d19",
          padding: "8px",
          borderRadius: "16px",
          border: "1.5px solid #1e293b",
          boxShadow: "0 6px 18px rgba(0,0,0,0.3)",
        }}
      >
        <button
          type="button"
          onClick={() => setActiveTab("WORKFLOW_A")}
          style={{
            padding: "9px 18px",
            borderRadius: "10px",
            border: activeTab === "WORKFLOW_A" ? "1px solid #38bdf8" : "1px solid transparent",
            background: activeTab === "WORKFLOW_A" ? "linear-gradient(135deg, #0284c7, #0369a1)" : "#0f172a",
            color: "#ffffff",
            fontSize: "0.85rem",
            fontWeight: 800,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            boxShadow: activeTab === "WORKFLOW_A" ? "0 4px 12px rgba(2, 132, 199, 0.45)" : "none",
            transition: "all 0.15s ease",
          }}
        >
          <Layers size={16} color={activeTab === "WORKFLOW_A" ? "#ffffff" : "#38bdf8"} />
          <span>Partie A : Workflow Toutes Filiales</span>
          <span
            style={{
              fontSize: "0.68rem",
              background: activeTab === "WORKFLOW_A" ? "rgba(255,255,255,0.25)" : "#1e293b",
              color: "#ffffff",
              padding: "1px 6px",
              borderRadius: "8px",
              fontWeight: 900,
            }}
          >
            5 étapes
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("FILIALES_B")}
          style={{
            padding: "9px 18px",
            borderRadius: "10px",
            border: activeTab === "FILIALES_B" ? "1px solid #38bdf8" : "1px solid transparent",
            background: activeTab === "FILIALES_B" ? "linear-gradient(135deg, #0284c7, #0369a1)" : "#0f172a",
            color: "#ffffff",
            fontSize: "0.85rem",
            fontWeight: 800,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            boxShadow: activeTab === "FILIALES_B" ? "0 4px 12px rgba(2, 132, 199, 0.45)" : "none",
            transition: "all 0.15s ease",
          }}
        >
          <Building2 size={16} color={activeTab === "FILIALES_B" ? "#ffffff" : "#38bdf8"} />
          <span>Partie B : Spécificités &amp; Nommage</span>
          <span
            style={{
              fontSize: "0.68rem",
              background: activeTab === "FILIALES_B" ? "rgba(255,255,255,0.25)" : "#1e293b",
              color: "#ffffff",
              padding: "1px 6px",
              borderRadius: "8px",
              fontWeight: 900,
            }}
          >
            7 filiales
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("DEPOT_C")}
          style={{
            padding: "9px 18px",
            borderRadius: "10px",
            border: activeTab === "DEPOT_C" ? "1px solid #34d399" : "1px solid transparent",
            background: activeTab === "DEPOT_C" ? "linear-gradient(135deg, #059669, #047857)" : "#0f172a",
            color: "#ffffff",
            fontSize: "0.85rem",
            fontWeight: 800,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            boxShadow: activeTab === "DEPOT_C" ? "0 4px 12px rgba(16, 185, 129, 0.4)" : "none",
            transition: "all 0.15s ease",
          }}
        >
          <FolderDown size={16} color={activeTab === "DEPOT_C" ? "#ffffff" : "#34d399"} />
          <span>Partie C : Dépôt &amp; Contrôles VISA</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("CYBERSOURCE_D")}
          style={{
            padding: "9px 18px",
            borderRadius: "10px",
            border: activeTab === "CYBERSOURCE_D" ? "1px solid #c084fc" : "1px solid transparent",
            background: activeTab === "CYBERSOURCE_D" ? "linear-gradient(135deg, #7c3aed, #6d28d9)" : "#0f172a",
            color: "#ffffff",
            fontSize: "0.85rem",
            fontWeight: 800,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            boxShadow: activeTab === "CYBERSOURCE_D" ? "0 4px 12px rgba(139, 92, 246, 0.45)" : "none",
            transition: "all 0.15s ease",
          }}
        >
          <span>💳</span>
          <span>Partie D : Cybersource (Cameroun CM)</span>
          <span
            style={{
              fontSize: "0.68rem",
              background: activeTab === "CYBERSOURCE_D" ? "rgba(255,255,255,0.25)" : "#1e293b",
              color: "#ffffff",
              padding: "1px 6px",
              borderRadius: "8px",
              fontWeight: 900,
            }}
          >
            IWO
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("HYPOTHESES_RECO")}
          style={{
            padding: "9px 18px",
            borderRadius: "10px",
            border: activeTab === "HYPOTHESES_RECO" ? "1px solid #fbbf24" : "1px solid transparent",
            background: activeTab === "HYPOTHESES_RECO" ? "linear-gradient(135deg, #d97706, #b45309)" : "#0f172a",
            color: "#ffffff",
            fontSize: "0.85rem",
            fontWeight: 800,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            boxShadow: activeTab === "HYPOTHESES_RECO" ? "0 4px 12px rgba(245, 158, 11, 0.45)" : "none",
            transition: "all 0.15s ease",
          }}
        >
          <Lightbulb size={16} color={activeTab === "HYPOTHESES_RECO" ? "#ffffff" : "#fbbf24"} />
          <span>Hypothèses &amp; Recommandations</span>
          <span
            style={{
              fontSize: "0.68rem",
              background: activeTab === "HYPOTHESES_RECO" ? "rgba(255,255,255,0.25)" : "#1e293b",
              color: "#ffffff",
              padding: "1px 6px",
              borderRadius: "8px",
              fontWeight: 900,
            }}
          >
            9 H / 10 R
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("GLOSSAIRE")}
          style={{
            padding: "9px 18px",
            borderRadius: "10px",
            border: activeTab === "GLOSSAIRE" ? "1px solid #94a3b8" : "1px solid transparent",
            background: activeTab === "GLOSSAIRE" ? "#334155" : "#0f172a",
            color: "#ffffff",
            fontSize: "0.85rem",
            fontWeight: 800,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            transition: "all 0.15s ease",
          }}
        >
          <BookOpen size={16} color="#94a3b8" />
          <span>Glossaire &amp; Variables</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* 3. CONTENU DE L'ONGLET ACTIF (CARD SOLIDE, CONTRASTE ET VISIBILITÉ FORTE) */}
      {/* ========================================================================= */}

      {/* --- ONGLET 1 : PARTIE A - WORKFLOW TOUTES FILIALES --- */}
      {activeTab === "WORKFLOW_A" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "1.75rem" }}>
          {/* RAPPEL DES 3 PROCESS (CORRECTION DU CONTRASTE ET MISE EN VALEUR) */}
          <div
            style={{
              background: "linear-gradient(135deg, #071f33 0%, #0a2d4c 100%)",
              border: "2px solid #0284c7",
              borderRadius: "18px",
              padding: "1.5rem 1.75rem",
              boxShadow: "0 10px 25px -5px rgba(2, 132, 199, 0.35)",
              display: "flex",
              flexDirection: "column",
              gap: "1.1rem",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.75rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "10px",
                    background: "rgba(56, 189, 248, 0.2)",
                    border: "1px solid #38bdf8",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "1.2rem",
                  }}
                >
                  📌
                </div>
                <div>
                  <h3 style={{ fontSize: "1.1rem", fontWeight: 900, color: "#ffffff", margin: 0 }}>
                    {OUTGOING_COMMON_RAPPEL.title}
                  </h3>
                  <span style={{ fontSize: "0.75rem", color: "#38bdf8", fontWeight: 700 }}>
                    Règle invariable appliquée à l&apos;ensemble des filiales
                  </span>
                </div>
              </div>

              <span
                style={{
                  fontSize: "0.72rem",
                  fontWeight: 900,
                  padding: "4px 10px",
                  borderRadius: "20px",
                  background: "rgba(16, 185, 129, 0.25)",
                  color: "#34d399",
                  border: "1px solid #10b981",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "5px",
                }}
              >
                <CheckCircle2 size={13} />
                <span>[CONFIRMÉ TERRAIN]</span>
              </span>
            </div>

            {/* Visualisation des 3 process sous forme de 3 cartes distinctes */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "0.85rem" }}>
              <div
                style={{
                  background: "#041525",
                  border: "1px solid #1e3a5f",
                  borderRadius: "12px",
                  padding: "1rem",
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "10px",
                }}
              >
                <div
                  style={{
                    width: "28px",
                    height: "28px",
                    borderRadius: "8px",
                    background: "#0284c7",
                    color: "#ffffff",
                    fontWeight: 900,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "0.85rem",
                    flexShrink: 0,
                  }}
                >
                  1
                </div>
                <div>
                  <div style={{ fontSize: "0.88rem", fontWeight: 800, color: "#ffffff" }}>
                    Process Dual
                  </div>
                  <div style={{ fontSize: "0.8rem", color: "#93c5fd", marginTop: "2px" }}>
                    Saisir <code style={{ background: "#0c2744", color: "#38bdf8", padding: "1px 5px", borderRadius: "4px", fontWeight: 700 }}>Dual</code> dans la recherche
                  </div>
                </div>
              </div>

              <div
                style={{
                  background: "#041525",
                  border: "1px solid #1e3a5f",
                  borderRadius: "12px",
                  padding: "1rem",
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "10px",
                }}
              >
                <div
                  style={{
                    width: "28px",
                    height: "28px",
                    borderRadius: "8px",
                    background: "#0284c7",
                    color: "#ffffff",
                    fontWeight: 900,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "0.85rem",
                    flexShrink: 0,
                  }}
                >
                  2
                </div>
                <div>
                  <div style={{ fontSize: "0.88rem", fontWeight: 800, color: "#ffffff" }}>
                    Process Couverture VISA
                  </div>
                  <div style={{ fontSize: "0.8rem", color: "#93c5fd", marginTop: "2px" }}>
                    Saisir <code style={{ background: "#0c2744", color: "#38bdf8", padding: "1px 5px", borderRadius: "4px", fontWeight: 700 }}>VISA</code> et choisir le bon lien
                  </div>
                </div>
              </div>

              <div
                style={{
                  background: "#041525",
                  border: "1px solid #1e3a5f",
                  borderRadius: "12px",
                  padding: "1rem",
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "10px",
                }}
              >
                <div
                  style={{
                    width: "28px",
                    height: "28px",
                    borderRadius: "8px",
                    background: "#0284c7",
                    color: "#ffffff",
                    fontWeight: 900,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "0.85rem",
                    flexShrink: 0,
                  }}
                >
                  3
                </div>
                <div>
                  <div style={{ fontSize: "0.88rem", fontWeight: 800, color: "#ffffff" }}>
                    Process Génération Fichier
                  </div>
                  <div style={{ fontSize: "0.8rem", color: "#93c5fd", marginTop: "2px" }}>
                    Englobé dans l&apos;accolade du lien VISA
                  </div>
                </div>
              </div>
            </div>

            {/* Note d'explication de terrain verbatim */}
            <div
              style={{
                fontSize: "0.86rem",
                color: "#f1f5f9",
                lineHeight: 1.6,
                background: "rgba(3, 10, 20, 0.6)",
                padding: "0.85rem 1.15rem",
                borderRadius: "10px",
                borderLeft: "3px solid #38bdf8",
              }}
            >
              <strong>Précision des notes manuscrites :</strong> {OUTGOING_COMMON_RAPPEL.text}
            </div>
          </div>

          {/* STEPPER VISUEL DES 5 ÉTAPES OUTGOING */}
          <div
            style={{
              background: "#0b1220",
              border: "1.5px solid #1e293b",
              borderRadius: "20px",
              padding: "2rem",
              boxShadow: "0 10px 25px rgba(0,0,0,0.35)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem", marginBottom: "1.75rem" }}>
              <div>
                <h3 style={{ fontSize: "1.25rem", fontWeight: 900, color: "#ffffff", margin: "0 0 0.25rem" }}>
                  Déroulé pas à pas du traitement OUTGOING (Toutes filiales)
                </h3>
                <p style={{ fontSize: "0.84rem", color: "#94a3b8", margin: 0 }}>
                  Suivre rigoureusement chaque étape dans l&apos;IHM Payway avant de passer aux spécificités de nommage.
                </p>
              </div>

              <span
                style={{
                  fontSize: "0.75rem",
                  fontWeight: 800,
                  padding: "4px 10px",
                  borderRadius: "8px",
                  background: "#1e293b",
                  color: "#38bdf8",
                  border: "1px solid #334155",
                }}
              >
                Parcours Linéaire Payway
              </span>
            </div>

            {/* Liste chronologique avec connecteurs verticaux */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1.1rem" }}>
              {OUTGOING_COMMON_STEPS.map((step, idx) => (
                <div key={step.stepNumber} style={{ position: "relative" }}>
                  {/* Carte d'étape solide */}
                  <div
                    style={{
                      background: "#111c30",
                      border: "1.5px solid #223554",
                      borderRadius: "14px",
                      padding: "1.25rem 1.5rem",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      flexWrap: "wrap",
                      gap: "1.25rem",
                      boxShadow: "0 4px 14px rgba(0,0,0,0.25)",
                      transition: "transform 0.15s ease, border-color 0.15s ease",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "1.25rem", flex: 1, minWidth: "240px" }}>
                      {/* Numéro avec glow */}
                      <div
                        style={{
                          width: "44px",
                          height: "44px",
                          borderRadius: "12px",
                          background: "linear-gradient(135deg, #0284c7 0%, #0369a1 100%)",
                          color: "#ffffff",
                          fontWeight: 900,
                          fontSize: "1.2rem",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                          boxShadow: "0 4px 12px rgba(2, 132, 199, 0.4)",
                        }}
                      >
                        {step.stepNumber}
                      </div>

                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap", marginBottom: "4px" }}>
                          <span style={{ fontSize: "1.05rem", fontWeight: 800, color: "#ffffff" }}>
                            {step.title}
                          </span>
                          <span
                            style={{
                              fontSize: "0.7rem",
                              fontWeight: 900,
                              padding: "2px 8px",
                              borderRadius: "6px",
                              background: "rgba(16, 185, 129, 0.2)",
                              color: "#34d399",
                              border: "1px solid rgba(16, 185, 129, 0.5)",
                            }}
                          >
                            [{step.status}]
                          </span>
                        </div>

                        <div style={{ fontSize: "0.9rem", color: "#e2e8f0", lineHeight: 1.5 }}>
                          {step.action}
                        </div>
                      </div>
                    </div>

                    {/* Bloc indice de recherche Payway */}
                    {step.searchHint && (
                      <div
                        style={{
                          background: "#060b14",
                          border: "1.5px solid #0284c7",
                          borderRadius: "10px",
                          padding: "8px 14px",
                          fontSize: "0.85rem",
                          color: "#38bdf8",
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          fontFamily: "monospace",
                          boxShadow: "0 2px 8px rgba(0,0,0,0.4)",
                        }}
                      >
                        <Search size={14} color="#38bdf8" />
                        <span style={{ fontWeight: 700 }}>{step.searchHint}</span>
                      </div>
                    )}
                  </div>

                  {/* Connecteur visuel entre les étapes */}
                  {idx < OUTGOING_COMMON_STEPS.length - 1 && (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        height: "16px",
                        margin: "-2px 0",
                      }}
                    >
                      <div style={{ width: "2px", height: "100%", background: "#1e3a5f" }} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* --- ONGLET 2 : PARTIE B - SPÉCIFICITÉS PAR FILIALE & NOMMAGE --- */}
      {activeTab === "FILIALES_B" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "1.75rem" }}>
          <div
            style={{
              background: "#0b1220",
              border: "1.5px solid #1e293b",
              borderRadius: "20px",
              padding: "2rem",
              boxShadow: "0 10px 25px rgba(0,0,0,0.35)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem", marginBottom: "1.5rem" }}>
              <div>
                <h3 style={{ fontSize: "1.25rem", fontWeight: 900, color: "#ffffff", margin: "0 0 0.35rem" }}>
                  Règles de Nommage et Spécificités par Filiale
                </h3>
                <p style={{ fontSize: "0.85rem", color: "#94a3b8", margin: 0 }}>
                  Chaque filiale applique une règle stricte pour le renommage du préfixe « P », les flux LIS (UEMOA) ou Cybersource (Cameroun).
                </p>
              </div>

              {/* Filtres filiales avec contraste renforcé */}
              <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                <button
                  type="button"
                  onClick={() => setSelectedFilialeFilter("ALL")}
                  style={{
                    padding: "6px 12px",
                    borderRadius: "10px",
                    border: selectedFilialeFilter === "ALL" ? "1.5px solid #38bdf8" : "1px solid #334155",
                    background: selectedFilialeFilter === "ALL" ? "#0284c7" : "#111c30",
                    color: "#ffffff",
                    fontSize: "0.78rem",
                    fontWeight: 800,
                    cursor: "pointer",
                  }}
                >
                  Toutes ({OUTGOING_FILIALES_RULES.length})
                </button>
                {OUTGOING_FILIALES_RULES.map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setSelectedFilialeFilter(f.id)}
                    style={{
                      padding: "6px 12px",
                      borderRadius: "10px",
                      border: selectedFilialeFilter === f.id ? "1.5px solid #38bdf8" : "1px solid #334155",
                      background: selectedFilialeFilter === f.id ? "#0284c7" : "#111c30",
                      color: "#ffffff",
                      fontSize: "0.78rem",
                      fontWeight: 800,
                      cursor: "pointer",
                    }}
                  >
                    {f.filialeName}
                  </button>
                ))}
              </div>
            </div>

            {/* Tableau des règles de filiale */}
            <div style={{ overflowX: "auto", borderRadius: "14px", border: "1.5px solid #1e293b" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" }}>
                <thead>
                  <tr style={{ background: "#060b14", borderBottom: "2px solid #0284c7" }}>
                    <th style={{ padding: "14px 18px", color: "#38bdf8", fontWeight: 800, textAlign: "left", width: "24%" }}>
                      Filiale
                    </th>
                    <th style={{ padding: "14px 18px", color: "#38bdf8", fontWeight: 800, textAlign: "left", width: "56%" }}>
                      Spécificité de Traitement &amp; Règle de Nommage
                    </th>
                    <th style={{ padding: "14px 18px", color: "#38bdf8", fontWeight: 800, textAlign: "center", width: "20%" }}>
                      Statut Notes Terrain
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {OUTGOING_FILIALES_RULES.filter(
                    (f) => selectedFilialeFilter === "ALL" || f.id === selectedFilialeFilter
                  ).map((rule, idx) => (
                    <tr
                      key={rule.id}
                      style={{
                        background: idx % 2 === 0 ? "#0f172a" : "#131e33",
                        borderBottom: "1px solid #1e293b",
                      }}
                    >
                      <td style={{ padding: "16px 18px", verticalAlign: "top" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                          <span
                            style={{
                              width: "12px",
                              height: "12px",
                              borderRadius: "50%",
                              background: rule.tagColor,
                              display: "inline-block",
                              boxShadow: `0 0 8px ${rule.tagColor}`,
                            }}
                          />
                          <span style={{ fontWeight: 900, color: "#ffffff", fontSize: "1rem" }}>{rule.filialeName}</span>
                        </div>
                        {rule.hasOutgoing ? (
                          <span
                            style={{
                              fontSize: "0.72rem",
                              color: "#34d399",
                              marginTop: "6px",
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "4px",
                              fontWeight: 800,
                              background: "rgba(16, 185, 129, 0.15)",
                              padding: "2px 8px",
                              borderRadius: "6px",
                            }}
                          >
                            ✓ Flux Outgoing Actif
                          </span>
                        ) : (
                          <span
                            style={{
                              fontSize: "0.72rem",
                              color: "#f87171",
                              marginTop: "6px",
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "4px",
                              fontWeight: 800,
                              background: "rgba(239, 68, 68, 0.15)",
                              padding: "2px 8px",
                              borderRadius: "6px",
                            }}
                          >
                            ✕ Pas de flux outgoing
                          </span>
                        )}
                      </td>

                      <td style={{ padding: "16px 18px", verticalAlign: "top" }}>
                        <div style={{ fontWeight: 800, color: "#38bdf8", marginBottom: "6px", fontSize: "0.95rem" }}>
                          {rule.ruleTitle}
                        </div>
                        <div style={{ color: "#e2e8f0", lineHeight: 1.6 }}>
                          {rule.detail}
                        </div>
                        {rule.hasLisProcess && (
                          <div
                            style={{
                              marginTop: "8px",
                              fontSize: "0.8rem",
                              color: "#a7f3d0",
                              background: "rgba(16, 185, 129, 0.15)",
                              border: "1px solid rgba(16, 185, 129, 0.4)",
                              padding: "4px 10px",
                              borderRadius: "6px",
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "6px",
                            }}
                          >
                            <span>📌</span>
                            <span>2 process LIS en plus liés au circuit GIM (UEMOA)</span>
                          </div>
                        )}
                        {rule.hasCybersourceProcess && (
                          <div
                            style={{
                              marginTop: "8px",
                              fontSize: "0.8rem",
                              color: "#f3e8ff",
                              background: "rgba(168, 85, 247, 0.2)",
                              border: "1px solid rgba(168, 85, 247, 0.5)",
                              padding: "4px 10px",
                              borderRadius: "6px",
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "6px",
                            }}
                          >
                            <span>🎯</span>
                            <span>Exclusivité Cameroun : Intégration Cybersource quotidienne</span>
                          </div>
                        )}
                      </td>

                      <td style={{ padding: "16px 18px", textAlign: "center", verticalAlign: "top" }}>
                        <span
                          style={{
                            fontSize: "0.75rem",
                            fontWeight: 900,
                            padding: "4px 10px",
                            borderRadius: "6px",
                            background: "rgba(16, 185, 129, 0.25)",
                            color: "#34d399",
                            border: "1px solid #10b981",
                            display: "inline-block",
                          }}
                        >
                          [{rule.status}]
                        </span>
                        {rule.statusComment && (
                          <div
                            style={{
                              fontSize: "0.76rem",
                              color: "#fde047",
                              marginTop: "8px",
                              background: "rgba(245, 158, 11, 0.15)",
                              padding: "4px 8px",
                              borderRadius: "6px",
                              border: "1px solid rgba(245, 158, 11, 0.3)",
                            }}
                          >
                            ⚠️ {rule.statusComment}
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* --- ONGLET 3 : PARTIE C - DÉPÔT DES FICHIERS & CONTRÔLES VISA --- */}
      {activeTab === "DEPOT_C" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "1.75rem" }}>
          {/* Étapes de Dépôt C1, C2, NB */}
          <div
            style={{
              background: "#0b1220",
              border: "1.5px solid #1e293b",
              borderRadius: "20px",
              padding: "2rem",
              boxShadow: "0 10px 25px rgba(0,0,0,0.35)",
            }}
          >
            <div style={{ fontSize: "1.25rem", fontWeight: 900, color: "#ffffff", marginBottom: "1.25rem", display: "flex", alignItems: "center", gap: "8px" }}>
              <FolderDown size={22} color="#38bdf8" />
              <span>Dépôt des fichiers générés [CONFIRMÉ]</span>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "1.25rem" }}>
              {OUTGOING_DEPOSIT_STEPS.map((step) => (
                <div
                  key={step.code}
                  style={{
                    background: "#111c30",
                    border: "1.5px solid #223554",
                    borderRadius: "14px",
                    padding: "1.5rem",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    gap: "1rem",
                    boxShadow: "0 4px 14px rgba(0,0,0,0.25)",
                  }}
                >
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.6rem" }}>
                      <span
                        style={{
                          fontSize: "0.85rem",
                          fontWeight: 900,
                          color: "#ffffff",
                          background: "#0284c7",
                          padding: "3px 10px",
                          borderRadius: "6px",
                        }}
                      >
                        Étape {step.code}
                      </span>
                      <span
                        style={{
                          fontSize: "0.72rem",
                          fontWeight: 900,
                          color: "#34d399",
                          background: "rgba(16, 185, 129, 0.2)",
                          padding: "3px 8px",
                          borderRadius: "6px",
                          border: "1px solid #10b981",
                        }}
                      >
                        [{step.status}]
                      </span>
                    </div>

                    <div style={{ fontSize: "1.05rem", fontWeight: 800, color: "#ffffff", marginBottom: "6px" }}>
                      {step.label}
                    </div>
                    <div style={{ fontSize: "0.9rem", color: "#e2e8f0", lineHeight: 1.6 }}>
                      {step.action}
                    </div>
                  </div>

                  {step.statusComment && (
                    <div
                      style={{
                        fontSize: "0.78rem",
                        color: "#fde047",
                        background: "rgba(245, 158, 11, 0.15)",
                        padding: "6px 10px",
                        borderRadius: "6px",
                        border: "1px solid rgba(245, 158, 11, 0.3)",
                      }}
                    >
                      ⚠️ {step.statusComment}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* CONTRÔLES OBLIGATOIRES AVANT TRANSMISSION DES FICHIERS VISA */}
          <div
            style={{
              background: "linear-gradient(135deg, #052618 0%, #0a1f18 100%)",
              border: "2px solid #10b981",
              borderRadius: "20px",
              padding: "2rem",
              boxShadow: "0 10px 25px rgba(16, 185, 129, 0.2)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "1.25rem" }}>
              <div
                style={{
                  width: "42px",
                  height: "42px",
                  borderRadius: "12px",
                  background: "rgba(16, 185, 129, 0.25)",
                  border: "1.5px solid #10b981",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <ShieldCheck size={26} color="#34d399" />
              </div>
              <div>
                <h3 style={{ fontSize: "1.25rem", fontWeight: 900, color: "#ffffff", margin: 0 }}>
                  {OUTGOING_VISA_CONTROLS.title}
                </h3>
                <span style={{ fontSize: "0.82rem", color: "#a7f3d0", fontWeight: 600 }}>
                  Vérifications obligatoires pour chaque filiale avant transmission
                </span>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "1.25rem" }}>
              {OUTGOING_VISA_CONTROLS.items.map((ctrl, i) => (
                <div
                  key={i}
                  style={{
                    background: "#03140d",
                    border: "1.5px solid #059669",
                    borderRadius: "14px",
                    padding: "1.35rem",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
                  }}
                >
                  <div style={{ fontSize: "0.98rem", fontWeight: 900, color: "#34d399", marginBottom: "8px", display: "flex", alignItems: "center", gap: "6px" }}>
                    <span>✓</span>
                    <span>{ctrl.title}</span>
                  </div>
                  <div style={{ fontSize: "0.88rem", color: "#ecfdf5", lineHeight: 1.6 }}>
                    {ctrl.detail}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* --- ONGLET 4 : PARTIE D - CYBERSOURCE CAMEROUN (CS) --- */}
      {activeTab === "CYBERSOURCE_D" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "1.75rem" }}>
          {/* Avertissement exclusivité Cameroun */}
          <div
            style={{
              background: "linear-gradient(135deg, #2e1065 0%, #1e1b4b 100%)",
              border: "2px solid #8b5cf6",
              borderRadius: "18px",
              padding: "1.5rem 1.75rem",
              display: "flex",
              alignItems: "center",
              gap: "14px",
              boxShadow: "0 8px 24px rgba(139, 92, 246, 0.25)",
            }}
          >
            <div style={{ fontSize: "2rem" }}>🎯</div>
            <div>
              <div style={{ fontSize: "1.1rem", fontWeight: 900, color: "#ffffff", marginBottom: "4px" }}>
                Périmètre strict : Cameroun Uniquement (CM)
              </div>
              <div style={{ fontSize: "0.88rem", color: "#f3e8ff", lineHeight: 1.5 }}>
                {CYBERSOURCE_IWO_ALGORITHM.nb}
              </div>
            </div>
          </div>

          {/* Étapes D1 à D7 */}
          <div
            style={{
              background: "#0b1220",
              border: "1.5px solid #1e293b",
              borderRadius: "20px",
              padding: "2rem",
              boxShadow: "0 10px 25px rgba(0,0,0,0.35)",
            }}
          >
            <div style={{ fontSize: "1.25rem", fontWeight: 900, color: "#ffffff", marginBottom: "1.5rem" }}>
              Cycle complet du process CYBERSOURCE_OUTGOING (D1 à D7) :
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1.25rem" }}>
              {CYBERSOURCE_STEPS.map((s) => (
                <div
                  key={s.code}
                  style={{
                    background: "#111c30",
                    border: "1.5px solid #223554",
                    borderRadius: "14px",
                    padding: "1.35rem",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    gap: "1rem",
                    boxShadow: "0 4px 14px rgba(0,0,0,0.25)",
                  }}
                >
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.6rem" }}>
                      <span
                        style={{
                          fontSize: "0.85rem",
                          fontWeight: 900,
                          color: "#ffffff",
                          background: "#7c3aed",
                          padding: "3px 9px",
                          borderRadius: "6px",
                        }}
                      >
                        {s.code}
                      </span>
                      <span style={{ fontSize: "0.72rem", fontWeight: 900, color: "#34d399", background: "rgba(16, 185, 129, 0.2)", padding: "2px 7px", borderRadius: "4px" }}>
                        [{s.status}]
                      </span>
                    </div>

                    <div style={{ fontSize: "1rem", fontWeight: 800, color: "#ffffff", marginBottom: "6px" }}>
                      {s.title}
                    </div>
                    <div style={{ fontSize: "0.88rem", color: "#e2e8f0", lineHeight: 1.6 }}>
                      {s.description}
                    </div>

                    {s.subProcesses && (
                      <div style={{ marginTop: "10px", display: "flex", flexDirection: "column", gap: "5px" }}>
                        {s.subProcesses.map((sub, i) => (
                          <div
                            key={i}
                            style={{
                              fontSize: "0.82rem",
                              color: "#f3e8ff",
                              background: "#1e1438",
                              border: "1px solid #7c3aed",
                              padding: "5px 10px",
                              borderRadius: "6px",
                            }}
                          >
                            {sub}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ARBRE DE DÉCISION / ALGORITHME DU COMMERÇANT « IWO » */}
          <div
            style={{
              background: "#080d19",
              border: "2px solid #f59e0b",
              borderRadius: "20px",
              padding: "2rem",
              boxShadow: "0 10px 30px rgba(245, 158, 11, 0.2)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "1.25rem" }}>
              <div style={{ fontSize: "2rem" }}>⚖️</div>
              <div>
                <h3 style={{ fontSize: "1.3rem", fontWeight: 900, color: "#ffffff", margin: 0 }}>
                  {CYBERSOURCE_IWO_ALGORITHM.title}
                </h3>
                <div style={{ fontSize: "0.88rem", color: "#fde047", marginTop: "3px" }}>
                  {CYBERSOURCE_IWO_ALGORITHM.rule1} — {CYBERSOURCE_IWO_ALGORITHM.rule2}
                </div>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: "1.5rem", marginTop: "1.25rem" }}>
              {/* Cas 1 : IWO présent (OK) */}
              <div
                style={{
                  background: "#042517",
                  border: "2px solid #10b981",
                  borderRadius: "14px",
                  padding: "1.5rem",
                  boxShadow: "0 4px 15px rgba(16, 185, 129, 0.25)",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.85rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <CheckCircle size={20} color="#34d399" />
                    <span style={{ fontSize: "1rem", fontWeight: 900, color: "#ffffff" }}>
                      {CYBERSOURCE_IWO_ALGORITHM.casePositive.condition}
                    </span>
                  </div>
                  <span
                    style={{
                      fontSize: "0.75rem",
                      fontWeight: 900,
                      padding: "3px 10px",
                      borderRadius: "12px",
                      background: "#10b981",
                      color: "#ffffff",
                    }}
                  >
                    {CYBERSOURCE_IWO_ALGORITHM.casePositive.outcome}
                  </span>
                </div>
                <div style={{ fontSize: "0.88rem", color: "#ecfdf5", lineHeight: 1.6 }}>
                  {CYBERSOURCE_IWO_ALGORITHM.casePositive.action}
                </div>
              </div>

              {/* Cas 2 : IWO absent (Bloquant / voir avec Ulrich) */}
              <div
                style={{
                  background: "#320c0c",
                  border: "2px solid #ef4444",
                  borderRadius: "14px",
                  padding: "1.5rem",
                  boxShadow: "0 4px 15px rgba(239, 68, 68, 0.25)",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.85rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <XCircle size={20} color="#f87171" />
                    <span style={{ fontSize: "1rem", fontWeight: 900, color: "#ffffff" }}>
                      {CYBERSOURCE_IWO_ALGORITHM.caseNegative.condition}
                    </span>
                  </div>
                  <span
                    style={{
                      fontSize: "0.75rem",
                      fontWeight: 900,
                      padding: "3px 10px",
                      borderRadius: "12px",
                      background: "#ef4444",
                      color: "#ffffff",
                    }}
                  >
                    {CYBERSOURCE_IWO_ALGORITHM.caseNegative.outcome}
                  </span>
                </div>
                <div style={{ fontSize: "0.88rem", color: "#fee2e2", lineHeight: 1.6 }}>
                  {CYBERSOURCE_IWO_ALGORITHM.caseNegative.action}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- ONGLET 5 : HYPOTHÈSES, RECOMMANDATIONS & POINTS OUVERTS --- */}
      {activeTab === "HYPOTHESES_RECO" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
          {/* Hypothèses à valider (les 9 hypothèses) */}
          <div
            style={{
              background: "#0b1220",
              border: "1.5px solid #f59e0b",
              borderRadius: "20px",
              padding: "2rem",
              boxShadow: "0 10px 25px rgba(245, 158, 11, 0.15)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "1.25rem" }}>
              <span style={{ fontSize: "1.5rem" }}>💡</span>
              <div>
                <h3 style={{ fontSize: "1.25rem", fontWeight: 900, color: "#ffffff", margin: 0 }}>
                  Hypothèses à valider [HYPOTHÈSE] (9 identifiées)
                </h3>
                <span style={{ fontSize: "0.82rem", color: "#fde047" }}>
                  Déductions logiques basées sur le terrain, à confirmer formellement
                </span>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
              {OUTGOING_HYPOTHESES.map((hyp) => (
                <div
                  key={hyp.id}
                  style={{
                    background: "#111c30",
                    border: "1.5px solid #223554",
                    borderRadius: "12px",
                    padding: "1rem 1.25rem",
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "12px",
                  }}
                >
                  <span
                    style={{
                      fontSize: "0.8rem",
                      fontWeight: 900,
                      background: "rgba(245, 158, 11, 0.25)",
                      color: "#fbbf24",
                      border: "1px solid #f59e0b",
                      padding: "3px 9px",
                      borderRadius: "6px",
                      flexShrink: 0,
                    }}
                  >
                    H{hyp.id}
                  </span>
                  <div style={{ flex: 1 }}>
                    <span style={{ fontSize: "0.9rem", color: "#f1f5f9", lineHeight: 1.6 }}>
                      {hyp.text}
                    </span>
                    {hyp.category && (
                      <span
                        style={{
                          marginLeft: "10px",
                          fontSize: "0.72rem",
                          fontWeight: 700,
                          color: "#38bdf8",
                          background: "#081528",
                          border: "1px solid #1e3a5f",
                          padding: "2px 8px",
                          borderRadius: "4px",
                        }}
                      >
                        {hyp.category}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recommandations d'amélioration (les 10 recos) */}
          <div
            style={{
              background: "#0b1220",
              border: "1.5px solid #0284c7",
              borderRadius: "20px",
              padding: "2rem",
              boxShadow: "0 10px 25px rgba(2, 132, 199, 0.15)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "1.25rem" }}>
              <span style={{ fontSize: "1.5rem" }}>📋</span>
              <div>
                <h3 style={{ fontSize: "1.25rem", fontWeight: 900, color: "#ffffff", margin: 0 }}>
                  Recommandations d&apos;amélioration [RECO] (10 identifiées)
                </h3>
                <span style={{ fontSize: "0.82rem", color: "#93c5fd" }}>
                  Optimisations opérationnelles pour fiabiliser le cycle Outgoing
                </span>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "1rem" }}>
              {OUTGOING_RECOMMANDATIONS.map((reco) => (
                <div
                  key={reco.id}
                  style={{
                    background: "#111c30",
                    border: "1.5px solid #223554",
                    borderRadius: "12px",
                    padding: "1.1rem 1.25rem",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                    <span style={{ fontSize: "0.78rem", fontWeight: 900, color: "#38bdf8" }}>
                      RECO {reco.id}
                    </span>
                    <span style={{ fontSize: "0.72rem", color: "#e2e8f0", background: "#060b14", border: "1px solid #1e293b", padding: "2px 7px", borderRadius: "4px" }}>
                      {reco.targetProcess}
                    </span>
                  </div>
                  <div style={{ fontSize: "0.86rem", color: "#f1f5f9", lineHeight: 1.6 }}>
                    {reco.recommendation}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Points ouverts à confirmer (les 11 questions) */}
          <div
            style={{
              background: "#0b1220",
              border: "1.5px solid #334155",
              borderRadius: "20px",
              padding: "2rem",
              boxShadow: "0 10px 25px rgba(0,0,0,0.35)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "1.25rem" }}>
              <HelpCircle size={24} color="#94a3b8" />
              <div>
                <h3 style={{ fontSize: "1.25rem", fontWeight: 900, color: "#ffffff", margin: 0 }}>
                  Points ouverts (à confirmer lors des prochains ateliers terrain)
                </h3>
                <span style={{ fontSize: "0.82rem", color: "#94a3b8" }}>
                  11 interrogations formulées pour clarifier les zones d&apos;ombre
                </span>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "0.85rem" }}>
              {OUTGOING_POINTS_OUVERTS.map((pt) => (
                <div
                  key={pt.id}
                  style={{
                    background: "#111c30",
                    border: "1.5px solid #1e293b",
                    borderRadius: "10px",
                    padding: "0.9rem 1.1rem",
                    fontSize: "0.86rem",
                    color: "#f1f5f9",
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "10px",
                    lineHeight: 1.5,
                  }}
                >
                  <span style={{ color: "#38bdf8", fontWeight: 900 }}>{pt.id}.</span>
                  <span>{pt.question}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* --- ONGLET 6 : GLOSSAIRE & VARIABLES --- */}
      {activeTab === "GLOSSAIRE" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "1.75rem" }}>
          {/* Glossaire */}
          <div
            style={{
              background: "#0b1220",
              border: "1.5px solid #1e293b",
              borderRadius: "20px",
              padding: "2rem",
              boxShadow: "0 10px 25px rgba(0,0,0,0.35)",
            }}
          >
            <h3 style={{ fontSize: "1.25rem", fontWeight: 900, color: "#ffffff", margin: "0 0 1.25rem" }}>
              Glossaire Opérationnel Outgoing
            </h3>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "1.25rem" }}>
              {OUTGOING_GLOSSARY.map((g) => (
                <div
                  key={g.term}
                  style={{
                    background: "#111c30",
                    border: "1.5px solid #223554",
                    borderRadius: "12px",
                    padding: "1.25rem",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                    <span style={{ fontSize: "1rem", fontWeight: 900, color: "#38bdf8" }}>{g.term}</span>
                    <span style={{ fontSize: "0.7rem", fontWeight: 900, color: "#34d399", background: "rgba(16, 185, 129, 0.2)", padding: "2px 7px", borderRadius: "4px" }}>
                      [{g.status}]
                    </span>
                  </div>
                  <div style={{ fontSize: "0.88rem", color: "#e2e8f0", lineHeight: 1.6 }}>
                    {g.definition}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Variables génériques à remplacer */}
          <div
            style={{
              background: "#0b1220",
              border: "1.5px solid #1e293b",
              borderRadius: "20px",
              padding: "2rem",
              boxShadow: "0 10px 25px rgba(0,0,0,0.35)",
            }}
          >
            <h3 style={{ fontSize: "1.25rem", fontWeight: 900, color: "#ffffff", margin: "0 0 0.35rem" }}>
              Valeurs génériques à remplacer dans les commandes et noms de fichiers
            </h3>
            <p style={{ fontSize: "0.85rem", color: "#94a3b8", margin: "0 0 1.25rem" }}>
              Elles seront renseignées dynamiquement au fur et à mesure des retours de terrain.
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1rem" }}>
              {OUTGOING_GENERIC_VARS.map((v) => (
                <div
                  key={v.code}
                  style={{
                    background: "#060b14",
                    border: "1.5px solid #1e293b",
                    borderRadius: "10px",
                    padding: "0.9rem 1.15rem",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: "10px",
                  }}
                >
                  <div>
                    <code style={{ fontFamily: "monospace", color: "#38bdf8", fontWeight: 800, fontSize: "0.92rem" }}>
                      {v.code}
                    </code>
                    <div style={{ fontSize: "0.8rem", color: "#cbd5e1", marginTop: "3px" }}>
                      {v.description}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleCopy(v.code)}
                    style={{
                      background: copiedText === v.code ? "#10b981" : "#1e293b",
                      border: "none",
                      color: "#ffffff",
                      padding: "6px 10px",
                      borderRadius: "6px",
                      fontSize: "0.75rem",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                      fontWeight: 700,
                    }}
                  >
                    {copiedText === v.code ? <Check size={14} /> : <Copy size={14} />}
                    <span>{copiedText === v.code ? "Copié !" : "Copier"}</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
