"use client";

import { useState } from "react";
import { AppShell } from "@/modules/layout/AppShell";
import {
  CBS_4GL_PER_COURSES,
  Cbs4GlPerScreenCourse
} from "@/modules/cbs/cbs-4gl-per-screens-data";

export default function PerScreensPage() {
  const [selectedPerCourse, setSelectedPerCourse] = useState<Cbs4GlPerScreenCourse>(CBS_4GL_PER_COURSES[0]);
  const [activePerSubTab, setActivePerSubTab] = useState<"per" | "4gl" | "terminal" | "directives">("per");
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
              Dans les systèmes bancaires sous Unix / AIX (ex: Amplitude Core Banking), les masques d&apos;écran <code>.per</code> sont compilés avec <code>form4gl</code> en fichiers <code>.frm</code>. Découvrez la structure complète (DATABASE, SCREEN, TABLES, ATTRIBUTES, INSTRUCTIONS) du niveau débutant au niveau expert.
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

        {/* SÉLECTEUR DE NIVEAU (4 NIVEAUX DE FORMATION) */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: "14px"
        }}>
          {CBS_4GL_PER_COURSES.map((course) => {
            const isSelected = selectedPerCourse.id === course.id;
            return (
              <div
                key={course.id}
                onClick={() => setSelectedPerCourse(course)}
                style={{
                  background: isSelected ? "rgba(16, 185, 129, 0.12)" : "#1e293b",
                  border: isSelected ? "2px solid #10b981" : "1px solid #334155",
                  borderRadius: "10px",
                  padding: "16px",
                  cursor: "pointer",
                  transition: "all 0.2s ease"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                  <span style={{
                    fontSize: "11px",
                    fontWeight: 800,
                    padding: "3px 8px",
                    borderRadius: "4px",
                    background: isSelected ? "#059669" : "#334155",
                    color: "#ffffff"
                  }}>
                    {course.level}
                  </span>
                  <span style={{ fontSize: "12px", color: "#94a3b8", fontFamily: "monospace" }}>
                    Niveau {course.levelOrder}/4
                  </span>
                </div>
                <div style={{ fontSize: "14px", fontWeight: 700, color: "#f8fafc", marginBottom: "4px" }}>
                  {course.title}
                </div>
                <div style={{ fontSize: "12px", color: "#94a3b8", lineHeight: "1.4" }}>
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
          <div style={{ display: "flex", gap: "8px", borderBottom: "1px solid #334155", paddingBottom: "12px" }}>
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
              🖥️ Rendu Terminal VT100
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

          {/* VUE 4 : DIRECTIVES ET ANALYSE DÉTAILLÉE */}
          {activePerSubTab === "directives" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div style={{
                background: "#1e293b",
                border: "1px solid #334155",
                borderRadius: "8px",
                padding: "18px",
                color: "#e2e8f0",
                fontSize: "13px",
                lineHeight: "1.7",
                whiteSpace: "pre-line"
              }}>
                {selectedPerCourse.detailedAnalysis}
              </div>
            </div>
          )}

        </div>

      </div>
    </AppShell>
  );
}
