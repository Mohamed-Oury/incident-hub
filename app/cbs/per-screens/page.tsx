"use client";

import { useState } from "react";
import { AppShell } from "@/modules/layout/AppShell";
import {
  CBS_4GL_PER_COURSES,
  Cbs4GlPerScreenCourse
} from "@/modules/cbs/cbs-4gl-per-screens-data";
import { GeneroGuiWindow } from "@/modules/cbs/GeneroGuiWindow";

export default function PerScreensPage() {
  const [selectedPerCourse, setSelectedPerCourse] = useState<Cbs4GlPerScreenCourse>(CBS_4GL_PER_COURSES[4] || CBS_4GL_PER_COURSES[0]);
  const [activePerSubTab, setActivePerSubTab] = useState<"gui" | "per" | "4gl" | "terminal" | "directives">("gui");
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopy = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  return (
    <AppShell pageTitle="Cursus Écrans .per (Form-4GL)" eyebrow="FORMATION & CERTIF CBS">
      <div style={{ display: "flex", flexDirection: "column", gap: "24px", maxWidth: "1280px", margin: "0 auto", paddingBottom: "40px" }}>

        {/* BANNIÈRE DE PRÉSENTATION DU CURSUS .PER */}
        <div style={{
          background: "linear-gradient(135deg, #064e3b, #047857)",
          border: "1px solid #10b981",
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
              background: "#022c22",
              color: "#34d399",
              padding: "4px 10px",
              borderRadius: "6px",
              fontSize: "11px",
              fontWeight: 800,
              letterSpacing: "0.05em",
              textTransform: "uppercase"
            }}>
              Module Maîtrise IHM Informix 4GL & Amplitude CBS
            </span>
            <h2 style={{ fontSize: "20px", fontWeight: 800, color: "#ffffff", marginTop: "8px", marginBottom: "4px" }}>
              Cursus Spécialiste : Conception & Maîtrise des Écrans Form-4GL (.per)
            </h2>
            <p style={{ fontSize: "13px", color: "#a7f3d0", maxWidth: "750px", lineHeight: "1.5", margin: 0 }}>
              Découvrez la structure complète des écrans bancaires : du mode caractère terminal classique (VT100 80x24 avec <code>DATABASE</code> & <code>SCREEN</code>) à l&apos;IHM Graphique moderne Four Js Genero (<code>SCHEMA</code>, <code>LAYOUT</code>, <code>GRID</code>, <code>HBOX</code>, <code>VBOX</code>, <code>FOLDER</code>, <code>TABLE</code>) pour clients Desktop GDC et Web GWC d&apos;Amplitude.
            </p>
          </div>
          <div style={{
            background: "rgba(0, 0, 0, 0.3)",
            padding: "12px 18px",
            borderRadius: "10px",
            border: "1px solid rgba(52, 211, 153, 0.4)",
            textAlign: "right"
          }}>
            <div style={{ fontSize: "12px", color: "#6ee7b7", fontWeight: 600 }}>Niveau actuel sélectionné</div>
            <div style={{ fontSize: "18px", fontWeight: 900, color: "#ffffff" }}>
              {selectedPerCourse.level}
            </div>
          </div>
        </div>

        {/* SÉLECTEUR DE NIVEAU (5 NIVEAUX DE FORMATION) */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: "14px"
        }}>
          {CBS_4GL_PER_COURSES.map((course) => {
            const isSelected = selectedPerCourse.id === course.id;
            return (
              <div
                key={course.id}
                onClick={() => setSelectedPerCourse(course)}
                style={{
                  background: isSelected ? "#064e3b" : "#1e293b",
                  border: isSelected ? "2px solid #34d399" : "1px solid #334155",
                  boxShadow: isSelected
                    ? "0 4px 20px rgba(16, 185, 129, 0.4), inset 0 0 0 1px #34d399"
                    : "none",
                  borderRadius: "10px",
                  padding: "16px",
                  cursor: "pointer",
                  transform: isSelected ? "translateY(-2px)" : "none",
                  transition: "all 0.2s ease"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                  <span style={{
                    fontSize: "11px",
                    fontWeight: 900,
                    padding: "4px 10px",
                    borderRadius: "4px",
                    background: isSelected ? "#022c22" : "#334155",
                    color: isSelected ? "#34d399" : "#ffffff",
                    border: isSelected ? "1px solid #10b981" : "none",
                    boxShadow: isSelected ? "0 2px 6px rgba(0, 0, 0, 0.4)" : "none",
                    letterSpacing: "0.04em"
                  }}>
                    {course.level}
                  </span>
                  <span style={{
                    fontSize: "12px",
                    color: isSelected ? "#6ee7b7" : "#94a3b8",
                    fontWeight: 800,
                    fontFamily: "monospace"
                  }}>
                    Niveau {course.levelOrder}/5
                  </span>
                </div>
                <div style={{
                  fontSize: "14px",
                  fontWeight: 900,
                  color: "#ffffff",
                  marginBottom: "6px",
                  lineHeight: "1.4"
                }}>
                  {course.title}
                </div>
                <div style={{
                  fontSize: "12px",
                  color: isSelected ? "#d1fae5" : "#94a3b8",
                  fontWeight: isSelected ? 600 : 400,
                  lineHeight: "1.5"
                }}>
                  {course.summary}
                </div>
              </div>
            );
          })}
        </div>

        {/* FICHE DÉTAILLÉE DU NIVEAU SÉLECTIONNÉ */}
        <div style={{
          background: "#0f172a",
          border: "1px solid #334155",
          borderRadius: "12px",
          padding: "24px",
          display: "flex",
          flexDirection: "column",
          gap: "20px"
        }}>
          {/* EN-TÊTE DU NIVEAU */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "12px", borderBottom: "1px solid #1e293b", paddingBottom: "16px" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
                <span style={{ fontSize: "18px" }}>🖥️</span>
                <h3 style={{ fontSize: "18px", fontWeight: 800, color: "#f8fafc", margin: 0 }}>
                  {selectedPerCourse.title}
                </h3>
                <span style={{
                  background: "#1e293b",
                  border: "1px solid #475569",
                  color: "#38bdf8",
                  fontSize: "11px",
                  padding: "2px 8px",
                  borderRadius: "4px",
                  fontFamily: "monospace"
                }}>
                  {selectedPerCourse.compilationAndRuntime.commandAix}
                </span>
              </div>
              <p style={{ fontSize: "13px", color: "#94a3b8", margin: 0 }}>
                {selectedPerCourse.summary}
              </p>
            </div>
            <div style={{ display: "flex", gap: "8px" }}>
              <button
                onClick={() => handleCopy(
                  activePerSubTab === "per" ? selectedPerCourse.perSourceCode :
                    activePerSubTab === "4gl" ? selectedPerCourse.fourGlSourceCode :
                      selectedPerCourse.terminalMockup,
                  selectedPerCourse.id
                )}
                style={{
                  background: "#1e293b",
                  border: "1px solid #475569",
                  color: copiedCode === selectedPerCourse.id ? "#34d399" : "#cbd5e1",
                  padding: "6px 14px",
                  borderRadius: "6px",
                  fontSize: "12px",
                  fontWeight: 600,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px"
                }}
              >
                {copiedCode === selectedPerCourse.id ? "✓ Copié !" : "📋 Copier le code"}
              </button>
            </div>
          </div>

          {/* OBJECTIFS CLÉS & DIRECTIVES SPÉCIFIQUES */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "16px"
          }}>
            <div style={{ background: "#1e293b", padding: "14px 18px", borderRadius: "8px", border: "1px solid #334155" }}>
              <div style={{ fontSize: "12px", fontWeight: 700, color: "#34d399", marginBottom: "8px", textTransform: "uppercase" }}>
                🎯 Objectifs pédagogiques
              </div>
              <ul style={{ margin: 0, paddingLeft: "18px", fontSize: "12px", color: "#cbd5e1", lineHeight: "1.6" }}>
                {selectedPerCourse.objectives.map((obj, idx) => (
                  <li key={idx}>{obj}</li>
                ))}
              </ul>
            </div>

            <div style={{ background: "#1e293b", padding: "14px 18px", borderRadius: "8px", border: "1px solid #334155" }}>
              <div style={{ fontSize: "12px", fontWeight: 700, color: "#38bdf8", marginBottom: "8px", textTransform: "uppercase" }}>
                ⚡ Directives .per clés
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                {selectedPerCourse.keyDirectives.map((kd, idx) => (
                  <span
                    key={idx}
                    title={`${kd.role} — Ex: ${kd.example}`}
                    style={{
                      background: "#0f172a",
                      border: "1px solid #3b82f6",
                      color: "#93c5fd",
                      fontFamily: "monospace",
                      fontSize: "11px",
                      padding: "3px 8px",
                      borderRadius: "4px"
                    }}
                  >
                    {kd.directive}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* SOUS-ONGLETS DE VUE DU CODE ET DU RENDU */}
          <div style={{ display: "flex", gap: "8px", borderBottom: "1px solid #334155", paddingBottom: "12px", flexWrap: "wrap" }}>
            <button
              onClick={() => setActivePerSubTab("gui")}
              style={{
                padding: "6px 14px",
                borderRadius: "6px",
                fontSize: "12px",
                fontWeight: 800,
                border: activePerSubTab === "gui" ? "2px solid #34d399" : "1px solid #334155",
                background: activePerSubTab === "gui" ? "#064e3b" : "#1e293b",
                color: activePerSubTab === "gui" ? "#34d399" : "#94a3b8",
                boxShadow: activePerSubTab === "gui" ? "0 2px 10px rgba(16, 185, 129, 0.4)" : "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "6px"
              }}
            >
              <span>🖥️</span> Rendu IHM Graphique (Client Web / GDC)
            </button>
            <button
              onClick={() => setActivePerSubTab("per")}
              style={{
                padding: "6px 14px",
                borderRadius: "6px",
                fontSize: "12px",
                fontWeight: 700,
                border: activePerSubTab === "per" ? "1px solid #10b981" : "1px solid #334155",
                background: activePerSubTab === "per" ? "#064e3b" : "#1e293b",
                color: activePerSubTab === "per" ? "#34d399" : "#94a3b8",
                cursor: "pointer"
              }}
            >
              📄 Code Source .PER
            </button>
            <button
              onClick={() => setActivePerSubTab("4gl")}
              style={{
                padding: "6px 14px",
                borderRadius: "6px",
                fontSize: "12px",
                fontWeight: 700,
                border: activePerSubTab === "4gl" ? "1px solid #38bdf8" : "1px solid #334155",
                background: activePerSubTab === "4gl" ? "#0c4a6e" : "#1e293b",
                color: activePerSubTab === "4gl" ? "#7dd3fc" : "#94a3b8",
                cursor: "pointer"
              }}
            >
              ⚙️ Programme 4GL Associé
            </button>
            <button
              onClick={() => setActivePerSubTab("terminal")}
              style={{
                padding: "6px 14px",
                borderRadius: "6px",
                fontSize: "12px",
                fontWeight: 700,
                border: activePerSubTab === "terminal" ? "1px solid #f59e0b" : "1px solid #334155",
                background: activePerSubTab === "terminal" ? "#78350f" : "#1e293b",
                color: activePerSubTab === "terminal" ? "#fcd34d" : "#94a3b8",
                cursor: "pointer"
              }}
            >
              📟 Rendu Terminal VT100
            </button>
            <button
              onClick={() => setActivePerSubTab("directives")}
              style={{
                padding: "6px 14px",
                borderRadius: "6px",
                fontSize: "12px",
                fontWeight: 700,
                border: activePerSubTab === "directives" ? "1px solid #a855f7" : "1px solid #334155",
                background: activePerSubTab === "directives" ? "#581c87" : "#1e293b",
                color: activePerSubTab === "directives" ? "#d8b4fe" : "#94a3b8",
                cursor: "pointer"
              }}
            >
              💡 Guide & Analyse Détaillée
            </button>
          </div>

          {/* VUE 0 : RENDU IHM GRAPHIQUE MODERNE (GENERO GDC / WEB) */}
          {activePerSubTab === "gui" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "8px" }}>
                <span style={{ fontSize: "12px", color: "#34d399", fontWeight: 700 }}>
                  Aperçu IHM Graphique Genero (Four Js / Amplitude Desktop GDC & Web GWC)
                </span>
                <span style={{ fontSize: "11px", color: "#38bdf8", fontWeight: 600 }}>
                  Architecture Conteneurs : SCHEMA • LAYOUT • VBOX • HBOX (SPLITTER) • GRID • TABLE
                </span>
              </div>
              <GeneroGuiWindow title={selectedPerCourse.title} />
            </div>
          )}

          {/* VUE 1 : CODE SOURCE DU .PER */}
          {activePerSubTab === "per" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "12px", color: "#64748b", fontFamily: "monospace" }}>
                  Compilation : {selectedPerCourse.compilationAndRuntime.commandAix}
                </span>
                <span style={{ fontSize: "11px", color: "#10b981", fontWeight: 600 }}>
                  Syntaxe Form-4GL conforme Informix 7.3+ & Amplitude CBS
                </span>
              </div>
              <pre style={{
                margin: 0,
                background: "#020617",
                border: "1px solid #1e293b",
                borderRadius: "8px",
                padding: "16px",
                color: "#e2e8f0",
                fontFamily: "Consolas, Monaco, 'Courier New', monospace",
                fontSize: "13px",
                lineHeight: "1.5",
                overflowX: "auto"
              }}>
                {selectedPerCourse.perSourceCode}
              </pre>
            </div>
          )}

          {/* VUE 2 : PROGRAMME 4GL QUI PILOTE L'ÉCRAN */}
          {activePerSubTab === "4gl" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "12px", color: "#64748b", fontFamily: "monospace" }}>
                  Exemple de programme Informix 4GL manipulant le formulaire
                </span>
                <span style={{ fontSize: "11px", color: "#38bdf8", fontWeight: 600 }}>
                  Instructions OPEN FORM / DISPLAY FORM / INPUT / CONSTRUCT / DISPLAY ARRAY
                </span>
              </div>
              <pre style={{
                margin: 0,
                background: "#020617",
                border: "1px solid #1e293b",
                borderRadius: "8px",
                padding: "16px",
                color: "#7dd3fc",
                fontFamily: "Consolas, Monaco, 'Courier New', monospace",
                fontSize: "13px",
                lineHeight: "1.5",
                overflowX: "auto"
              }}>
                {selectedPerCourse.fourGlSourceCode}
              </pre>
            </div>
          )}

          {/* VUE 3 : RENDU TERMINAL VT100 / AIX */}
          {activePerSubTab === "terminal" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "12px", color: "#f59e0b", fontWeight: 600 }}>
                  Aperçu tel qu&apos;affiché dans une session Putty / Terminal Unix AIX 80x24
                </span>
                <span style={{ fontSize: "11px", color: "#94a3b8" }}>
                  Police fixe VT100 & bordures ASCII
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
                {selectedPerCourse.terminalMockup}
              </pre>
            </div>
          )}

          {/* VUE 4 : DIRECTIVES ET ANALYSE DÉTAILLÉE SOUS FORME DE TABLEAU STRUCTURÉ */}
          {activePerSubTab === "directives" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              {/* BANDEAU INTRODUCTIF DU GUIDE */}
              <div style={{
                background: "linear-gradient(135deg, #1e1b4b, #312e81)",
                border: "1px solid #6366f1",
                borderRadius: "8px",
                padding: "16px 20px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "12px"
              }}>
                <div>
                  <div style={{ fontSize: "11px", fontWeight: 800, color: "#a5b4fc", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    Tableau de Référence & Guide Technique d&apos;Ingénierie .PER
                  </div>
                  <div style={{ fontSize: "16px", fontWeight: 800, color: "#ffffff", marginTop: "4px" }}>
                    Analyse Détaillée des Directives & Architecture des Écrans Bancaires
                  </div>
                  <div style={{ fontSize: "12px", color: "#c7d2fe", marginTop: "4px" }}>
                    {selectedPerCourse.isGuiModern ? (
                      <span>Mode Standard Actuel : <strong>IHM Graphique Genero (SCHEMA, LAYOUT, Conteneurs Flex, Widgets Riches)</strong></span>
                    ) : (
                      <span>Mode Historique : <strong>Masque Caractère VT100 / AIX (DATABASE, SCREEN 80x24, Délimiteurs)</strong></span>
                    )}
                  </div>
                </div>
                <div style={{
                  background: "rgba(0, 0, 0, 0.35)",
                  padding: "8px 14px",
                  borderRadius: "6px",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  fontSize: "12px",
                  color: "#e0e7ff",
                  fontFamily: "monospace"
                }}>
                  Compilateur : {selectedPerCourse.compilationAndRuntime.generatedBinary}
                </div>
              </div>

              {/* TABLEAU 1 : DIRECTIVES CLÉS & SYNTAXE DU NIVEAU */}
              <div style={{
                background: "#0f172a",
                border: "1px solid #334155",
                borderRadius: "8px",
                overflow: "hidden"
              }}>
                <div style={{
                  background: "#1e293b",
                  padding: "12px 18px",
                  borderBottom: "1px solid #334155",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center"
                }}>
                  <span style={{ fontSize: "13px", fontWeight: 800, color: "#f8fafc" }}>
                    ⚡ Directives Clés & Instructions Fondamentales ({selectedPerCourse.keyDirectives.length} éléments)
                  </span>
                  <span style={{ fontSize: "11px", color: "#94a3b8" }}>
                    Syntaxes applicables au niveau {selectedPerCourse.level}
                  </span>
                </div>

                <div style={{ overflowX: "auto" }}>
                  <table style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    fontSize: "12px",
                    textAlign: "left"
                  }}>
                    <thead>
                      <tr style={{ background: "#090d16", borderBottom: "1px solid #334155", color: "#94a3b8", textTransform: "uppercase", fontSize: "11px", letterSpacing: "0.04em" }}>
                        <th style={{ padding: "12px 16px", width: "240px" }}>Directive / Mot-Clé</th>
                        <th style={{ padding: "12px 16px" }}>Rôle dans l&apos;Écran Bancaire</th>
                        <th style={{ padding: "12px 16px", width: "320px" }}>Exemple Concret de Syntaxe</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedPerCourse.keyDirectives.map((kd, idx) => (
                        <tr
                          key={idx}
                          style={{
                            borderBottom: "1px solid #1e293b",
                            background: idx % 2 === 0 ? "rgba(15, 23, 42, 0.6)" : "rgba(30, 41, 59, 0.4)",
                            transition: "background 0.15s ease"
                          }}
                        >
                          <td style={{ padding: "12px 16px", verticalAlign: "top" }}>
                            <span style={{
                              background: "#022c22",
                              color: "#34d399",
                              border: "1px solid #059669",
                              borderRadius: "4px",
                              padding: "3px 8px",
                              fontFamily: "monospace",
                              fontSize: "12px",
                              fontWeight: 700,
                              display: "inline-block"
                            }}>
                              {kd.directive}
                            </span>
                          </td>
                          <td style={{ padding: "12px 16px", color: "#e2e8f0", lineHeight: "1.5", verticalAlign: "top" }}>
                            {kd.role}
                          </td>
                          <td style={{ padding: "12px 16px", verticalAlign: "top" }}>
                            <code style={{
                              background: "#020617",
                              color: "#38bdf8",
                              border: "1px solid #1e293b",
                              borderRadius: "4px",
                              padding: "4px 8px",
                              fontFamily: "monospace",
                              fontSize: "11px",
                              display: "block",
                              whiteSpace: "pre-wrap",
                              wordBreak: "break-all"
                            }}>
                              {kd.example}
                            </code>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* TABLEAU 2 : ANALYSE FONCTIONNELLE ET TECHNIQUE EN SECTIONS */}
              <div style={{
                background: "#0f172a",
                border: "1px solid #334155",
                borderRadius: "8px",
                overflow: "hidden"
              }}>
                <div style={{
                  background: "#1e293b",
                  padding: "12px 18px",
                  borderBottom: "1px solid #334155",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center"
                }}>
                  <span style={{ fontSize: "13px", fontWeight: 800, color: "#f8fafc" }}>
                    📖 Guide Analytique & Comportement d&apos;Ingénierie
                  </span>
                  <span style={{ fontSize: "11px", color: "#38bdf8", fontWeight: 700 }}>
                    Four Js Genero & CBS Amplitude
                  </span>
                </div>

                <div style={{ overflowX: "auto" }}>
                  <table style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    fontSize: "12px",
                    textAlign: "left"
                  }}>
                    <thead>
                      <tr style={{ background: "#090d16", borderBottom: "1px solid #334155", color: "#94a3b8", textTransform: "uppercase", fontSize: "11px", letterSpacing: "0.04em" }}>
                        <th style={{ padding: "12px 16px", width: "190px" }}>Axe d&apos;Analyse</th>
                        <th style={{ padding: "12px 16px" }}>Spécification & Règle d&apos;Architecture</th>
                        <th style={{ padding: "12px 16px", width: "260px" }}>Impact Opérationnel Guichet</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedPerCourse.isGuiModern ? (
                        <>
                          <tr style={{ borderBottom: "1px solid #1e293b", background: "rgba(15, 23, 42, 0.6)" }}>
                            <td style={{ padding: "14px 16px", verticalAlign: "top" }}>
                              <strong style={{ color: "#38bdf8", display: "block" }}>1. Découplage SGBD</strong>
                              <span style={{ fontSize: "11px", color: "#94a3b8" }}>SCHEMA vs DATABASE</span>
                            </td>
                            <td style={{ padding: "14px 16px", color: "#e2e8f0", lineHeight: "1.6", verticalAlign: "top" }}>
                              L&apos;instruction <code>SCHEMA amplitude_db</code> remplace l&apos;ancienne dépendance à la base physique en ligne. Le compilateur Genero (<code>fglform -M</code>) s&apos;appuie sur le schéma abstrait exporté. Le binaire <code>.42f</code> est autonome et déployable sur tous les environnements.
                            </td>
                            <td style={{ padding: "14px 16px", color: "#34d399", verticalAlign: "top", fontSize: "11px", lineHeight: "1.5" }}>
                              ✓ Portabilité stricte Dev / Recette / Prod<br />
                              ✓ Pas d&apos;échec de compilation si base coupée<br />
                              ✓ Respect des types de données du dictionnaire
                            </td>
                          </tr>

                          <tr style={{ borderBottom: "1px solid #1e293b", background: "rgba(30, 41, 59, 0.4)" }}>
                            <td style={{ padding: "14px 16px", verticalAlign: "top" }}>
                              <strong style={{ color: "#38bdf8", display: "block" }}>2. Conteneurs Flex</strong>
                              <span style={{ fontSize: "11px", color: "#94a3b8" }}>LAYOUT, VBOX, HBOX</span>
                            </td>
                            <td style={{ padding: "14px 16px", color: "#e2e8f0", lineHeight: "1.6", verticalAlign: "top" }}>
                              Suppression définitive du carcan 80x24. <code>LAYOUT</code> déclare la fenêtre racine. <code>VBOX</code> empile les sections verticalement. <code>HBOX (SPLITTER)</code> agence les blocs KYC et Soldes côte à côte avec séparateur redimensionnable à la souris.
                            </td>
                            <td style={{ padding: "14px 16px", color: "#34d399", verticalAlign: "top", fontSize: "11px", lineHeight: "1.5" }}>
                              ✓ Redimensionnement fluide sur écran large<br />
                              ✓ Ergonomie moderne pour les télé-opérateurs<br />
                              ✓ Splitter ajustable pour vue 360° du compte
                            </td>
                          </tr>

                          <tr style={{ borderBottom: "1px solid #1e293b", background: "rgba(15, 23, 42, 0.6)" }}>
                            <td style={{ padding: "14px 16px", verticalAlign: "top" }}>
                              <strong style={{ color: "#38bdf8", display: "block" }}>3. Onglets & Grilles</strong>
                              <span style={{ fontSize: "11px", color: "#94a3b8" }}>FOLDER, PAGE, TABLE</span>
                            </td>
                            <td style={{ padding: "14px 16px", color: "#e2e8f0", lineHeight: "1.6", verticalAlign: "top" }}>
                              <code>FOLDER</code> et <code>PAGE</code> permettent de naviguer par onglets (Mouvements, Cartes, Prêts) sans ouvrir de pop-up. Le composant <code>TABLE</code> gère nativement le tri de colonnes au clic, la taille variable des colonnes, le défilement et l&apos;événement <code>DOUBLECLICK</code>.
                            </td>
                            <td style={{ padding: "14px 16px", color: "#34d399", verticalAlign: "top", fontSize: "11px", lineHeight: "1.5" }}>
                              ✓ Consultation ultra-rapide des écritures<br />
                              ✓ Double-clic immédiat vers le détail écriture<br />
                              ✓ Tri instantané sans requête SQL supplémentaire
                            </td>
                          </tr>

                          <tr style={{ borderBottom: "1px solid #1e293b", background: "rgba(30, 41, 59, 0.4)" }}>
                            <td style={{ padding: "14px 16px", verticalAlign: "top" }}>
                              <strong style={{ color: "#38bdf8", display: "block" }}>4. Contrôles & Sécurité</strong>
                              <span style={{ fontSize: "11px", color: "#94a3b8" }}>STYLES, WIDGETS, PCI-DSS</span>
                            </td>
                            <td style={{ padding: "14px 16px", color: "#e2e8f0", lineHeight: "1.6", verticalAlign: "top" }}>
                              Gestion des <code>COMBOBOX</code>, <code>BUTTONEDIT</code> avec loupe de recherche, <code>CHECKBOX</code>, <code>PROGRESSBAR</code>, et masquage strict <code>INVISIBLE</code> pour la conformité PCI-DSS (codes PIN et mots de passe superviseur). Feuilles de style <code>.4st</code> via <code>STYLE=&quot;mandatory&quot;</code> ou <code>STYLE=&quot;kpi_positive&quot;</code>.
                            </td>
                            <td style={{ padding: "14px 16px", color: "#34d399", verticalAlign: "top", fontSize: "11px", lineHeight: "1.5" }}>
                              ✓ Conformité auditable PCI-DSS et BCEAO<br />
                              ✓ Réduction des erreurs de saisie guichet<br />
                              ✓ Raccourcis LOV intégrés dans le champ
                            </td>
                          </tr>
                        </>
                      ) : (
                        <>
                          <tr style={{ borderBottom: "1px solid #1e293b", background: "rgba(15, 23, 42, 0.6)" }}>
                            <td style={{ padding: "14px 16px", verticalAlign: "top" }}>
                              <strong style={{ color: "#38bdf8", display: "block" }}>Structure & Catalogue</strong>
                              <span style={{ fontSize: "11px", color: "#94a3b8" }}>DATABASE, SCREEN, TABLES</span>
                            </td>
                            <td style={{ padding: "14px 16px", color: "#e2e8f0", lineHeight: "1.6", verticalAlign: "top" }}>
                              Liaison stricte avec le dictionnaire de données Informix. Les colonnes SQL imposent leur taille et leur typage. La grille SCREEN délimite la matrice 80 colonnes par 24 lignes.
                            </td>
                            <td style={{ padding: "14px 16px", color: "#fcd34d", verticalAlign: "top", fontSize: "11px", lineHeight: "1.5" }}>
                              Compatible terminaux passifs VT100 / VT220 et émulations SSH AIX.
                            </td>
                          </tr>

                          <tr style={{ borderBottom: "1px solid #1e293b", background: "rgba(30, 41, 59, 0.4)" }}>
                            <td style={{ padding: "14px 16px", verticalAlign: "top" }}>
                              <strong style={{ color: "#38bdf8", display: "block" }}>Contrôles Déclaratifs</strong>
                              <span style={{ fontSize: "11px", color: "#94a3b8" }}>ATTRIBUTES & VALIDATION</span>
                            </td>
                            <td style={{ padding: "14px 16px", color: "#e2e8f0", lineHeight: "1.6", verticalAlign: "top" }}>
                              Déclaration des contraintes : <code>REQUIRED</code>, <code>NOENTRY</code>, <code>AUTONEXT</code>, <code>PICTURE</code>, <code>INCLUDE</code>. Rejet immédiat des saisies non conformes par le moteur d&apos;écran.
                            </td>
                            <td style={{ padding: "14px 16px", color: "#fcd34d", verticalAlign: "top", fontSize: "11px", lineHeight: "1.5" }}>
                              Zéro ligne de code 4GL pour les validations élémentaires.
                            </td>
                          </tr>

                          <tr style={{ borderBottom: "1px solid #1e293b", background: "rgba(15, 23, 42, 0.6)" }}>
                            <td style={{ padding: "14px 16px", verticalAlign: "top" }}>
                              <strong style={{ color: "#38bdf8", display: "block" }}>Interaction & Défilement</strong>
                              <span style={{ fontSize: "11px", color: "#94a3b8" }}>SCREEN RECORD & ARRAY</span>
                            </td>
                            <td style={{ padding: "14px 16px", color: "#e2e8f0", lineHeight: "1.6", verticalAlign: "top" }}>
                              Gestion de listes défilantes avec <code>SCREEN RECORD</code>, <code>INPUT ARRAY</code>, fonctions <code>ARR_CURR()</code> et <code>SCR_LINE()</code> pour synchroniser tableau mémoire et écran.
                            </td>
                            <td style={{ padding: "14px 16px", color: "#fcd34d", verticalAlign: "top", fontSize: "11px", lineHeight: "1.5" }}>
                              Navigation paginée par bloc de 5 à 15 lignes.
                            </td>
                          </tr>
                        </>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* TABLEAU 3 : RÈGLES D'OR & EXPLOITATION PRODUCTION */}
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
                gap: "16px"
              }}>
                <div style={{
                  background: "#0f172a",
                  border: "1px solid #334155",
                  borderRadius: "8px",
                  padding: "16px"
                }}>
                  <div style={{ fontSize: "12px", fontWeight: 800, color: "#34d399", textTransform: "uppercase", marginBottom: "10px" }}>
                    ⭐ Règles d&apos;Or d&apos;Ingénierie Bancaire ({selectedPerCourse.goldenRules.length})
                  </div>
                  <ul style={{ margin: 0, paddingLeft: "18px", fontSize: "12px", color: "#cbd5e1", lineHeight: "1.6" }}>
                    {selectedPerCourse.goldenRules.map((rule, idx) => (
                      <li key={idx} style={{ marginBottom: "6px" }}>{rule}</li>
                    ))}
                  </ul>
                </div>

                <div style={{
                  background: "#0f172a",
                  border: "1px solid #334155",
                  borderRadius: "8px",
                  padding: "16px"
                }}>
                  <div style={{ fontSize: "12px", fontWeight: 800, color: "#f59e0b", textTransform: "uppercase", marginBottom: "10px" }}>
                    🛠️ Compilation, Variables d&apos;Environnement & Troubleshooting
                  </div>
                  <div style={{ fontSize: "12px", color: "#cbd5e1", lineHeight: "1.6", display: "flex", flexDirection: "column", gap: "6px" }}>
                    <div>
                      <strong style={{ color: "#e2e8f0" }}>Commande :</strong>{" "}
                      <code style={{ background: "#020617", color: "#38bdf8", padding: "2px 6px", borderRadius: "4px" }}>
                        {selectedPerCourse.compilationAndRuntime.commandAix}
                      </code>
                    </div>
                    <div>
                      <strong style={{ color: "#e2e8f0" }}>Binaire produit :</strong>{" "}
                      <span style={{ color: "#34d399", fontFamily: "monospace" }}>
                        {selectedPerCourse.compilationAndRuntime.generatedBinary}
                      </span>
                    </div>
                    <div>
                      <strong style={{ color: "#e2e8f0" }}>Diagnostic fréquent :</strong>{" "}
                      <span style={{ color: "#f87171" }}>
                        {selectedPerCourse.compilationAndRuntime.troubleshooting}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          )}

        </div>

      </div>
    </AppShell>
  );
}
