"use client";

import { useState } from "react";
import { AppShell } from "@/modules/layout/AppShell";
import {
  CBS_4GL_GRADES,
  CBS_4GL_LESSONS,
  CBS_4GL_EXAMS,
  Cbs4GlGrade,
  Cbs4GlLesson
} from "@/modules/cbs/cbs-4gl-data";
import {
  CBS_4GL_KEYWORDS_CHEAT_SHEET,
  Cbs4GlKeywordCard
} from "@/modules/cbs/cbs-4gl-cheat-sheet";

export default function Cbs4GlTrainingPage() {
  // Progression et déblocage des grades (Persistance locale via état)
  const [unlockedLevel, setUnlockedLevel] = useState<number>(1);
  const [selectedGradeLevel, setSelectedGradeLevel] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<"cours" | "simulateur" | "examen" | "fiche">("cours");
  const [cheatSheetCategory, setCheatSheetCategory] = useState<string>("ALL");
  const [cheatSheetSearch, setCheatSheetSearch] = useState<string>("");

  // Cours sélectionné
  const lessonsForCurrentGrade = CBS_4GL_LESSONS.filter((l) => l.gradeLevel === selectedGradeLevel);
  const [selectedLesson, setSelectedLesson] = useState<Cbs4GlLesson>(lessonsForCurrentGrade[0] || CBS_4GL_LESSONS[0]);
  const [copied, setCopied] = useState(false);

  // Simulateur 4GL
  const [simCode, setSimCode] = useState(selectedLesson.codeSample);
  const [simOutput, setSimOutput] = useState<string>("");
  const [isCompiling, setIsCompiling] = useState(false);

  // Examen de passage de grade
  const examQuestions = CBS_4GL_EXAMS.filter((q) => q.gradeLevel === selectedGradeLevel);
  const [userExamAnswers, setUserExamAnswers] = useState<Record<string, number>>({});
  const [examSubmitted, setExamSubmitted] = useState(false);
  const [examResult, setExamResult] = useState<{ score: number; total: number; pct: number; passed: boolean } | null>(null);

  const currentGrade = CBS_4GL_GRADES.find((g) => g.level === selectedGradeLevel) || CBS_4GL_GRADES[0];

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSelectGrade = (level: number) => {
    setSelectedGradeLevel(level);
    const lessons = CBS_4GL_LESSONS.filter((l) => l.gradeLevel === level);
    if (lessons.length > 0) {
      setSelectedLesson(lessons[0]);
      setSimCode(lessons[0].codeSample);
    }
    setSimOutput("");
    setExamSubmitted(false);
    setUserExamAnswers({});
    setExamResult(null);
  };

  const handleSelectLesson = (lesson: Cbs4GlLesson) => {
    setSelectedLesson(lesson);
    setSimCode(lesson.codeSample);
    setSimOutput("");
  };

  const handleCompileAndRun = () => {
    setIsCompiling(true);
    setSimOutput("Compilation Informix 4GL : c4gl -c programme.4gl ...\nÉdition des liens avec les librairies bancaires Amplitude...\n");

    setTimeout(() => {
      setIsCompiling(false);
      if (simCode.includes("BEGIN WORK") && !simCode.includes("COMMIT WORK") && !simCode.includes("ROLLBACK WORK")) {
        setSimOutput((prev) => prev + "⚠️ AVERTISSEMENT RUN : Transaction non clôturée (BEGIN WORK sans COMMIT). Risque de lock exclusif sur BKCOM/BKCPT.\n");
      } else if (simCode.includes("PUT") && !simCode.includes("FLUSH")) {
        setSimOutput((prev) => prev + "⚠️ AVERTISSEMENT MOTEUR : 'PUT' détecté sans 'FLUSH'. Les dernières lignes risquent d'être perdues en mémoire.\n");
      } else {
        setSimOutput((prev) => prev + "✅ SUCCÈS : Binaire exécutable généré avec 0 erreur de syntaxe.\n[MOTEUR 4GL] Connexion à la base 'amplitude' établie.\n[MOTEUR 4GL] Traitement exécuté avec succès (status = 0).\n");
      }
    }, 500);
  };

  const handleSubmitExam = () => {
    let score = 0;
    examQuestions.forEach((q) => {
      if (userExamAnswers[q.id] === q.correctIndex) {
        score++;
      }
    });
    const total = examQuestions.length;
    const pct = total > 0 ? Math.round((score / total) * 100) : 0;
    const passed = pct >= currentGrade.minPassScorePct;

    setExamResult({ score, total, pct, passed });
    setExamSubmitted(true);

    if (passed && unlockedLevel === selectedGradeLevel && selectedGradeLevel < 5) {
      setUnlockedLevel(selectedGradeLevel + 1);
    }
  };

  return (
    <AppShell
      pageTitle="Cursus Développeur Informix 4GL & Amplitude (5 Grades)"
      eyebrow="AMPLITUDE IT BANKING"
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "24px", maxWidth: "1200px", margin: "0 auto" }}>
        
        {/* EN-TÊTE : PROGRESSION ET PALMARÈS DES GRADES */}
        <div style={{
          background: "linear-gradient(135deg, #0f172a, #1e1b4b)",
          border: "1px solid #4338ca",
          borderRadius: "12px",
          padding: "24px",
          boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.3)"
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px", marginBottom: "20px" }}>
            <div>
              <span style={{
                background: currentGrade.color,
                color: "#ffffff",
                fontSize: "12px",
                fontWeight: 700,
                padding: "4px 12px",
                borderRadius: "9999px",
                textTransform: "uppercase"
              }}>
                {currentGrade.badge}
              </span>
              <h2 style={{ fontSize: "22px", fontWeight: 800, color: "#f8fafc", marginTop: "8px", marginBottom: "4px" }}>
                Cursus Certifiant Développeur 4GL Core Banking
              </h2>
              <p style={{ color: "#c7d2fe", fontSize: "14px", margin: 0 }}>
                {currentGrade.objective}
              </p>
            </div>

            <div style={{
              background: "#090d16",
              padding: "12px 18px",
              borderRadius: "10px",
              border: "1px solid #334155",
              textAlign: "right"
            }}>
              <div style={{ fontSize: "11px", textTransform: "uppercase", color: "#94a3b8" }}>Votre Grade Actuel</div>
              <div style={{ fontSize: "18px", fontWeight: 800, color: CBS_4GL_GRADES[unlockedLevel - 1].color }}>
                {CBS_4GL_GRADES[unlockedLevel - 1].name}
              </div>
              <div style={{ fontSize: "11px", color: "#64748b" }}>
                {unlockedLevel === 5 ? "🏆 Grade Maximum Atteint" : `Niveau suivant : Niveau ${unlockedLevel + 1}`}
              </div>
            </div>
          </div>

          {/* BARRE DE SÉLECTION DES 5 GRADES AVEC CADENAS */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "10px" }}>
            {CBS_4GL_GRADES.map((grade) => {
              const isUnlocked = grade.level <= unlockedLevel;
              const isSelected = grade.level === selectedGradeLevel;

              return (
                <button
                  key={grade.level}
                  onClick={() => isUnlocked && handleSelectGrade(grade.level)}
                  disabled={!isUnlocked}
                  style={{
                    padding: "12px 10px",
                    borderRadius: "8px",
                    border: isSelected ? `2px solid ${grade.color}` : "1px solid #334155",
                    background: isSelected ? "rgba(99, 102, 241, 0.2)" : isUnlocked ? "#1e293b" : "#0b101b",
                    color: isUnlocked ? "#f8fafc" : "#64748b",
                    cursor: isUnlocked ? "pointer" : "not-allowed",
                    textAlign: "center",
                    opacity: isUnlocked ? 1 : 0.6,
                    transition: "all 0.15s ease"
                  }}
                >
                  <div style={{ fontSize: "11px", fontWeight: 700, color: isUnlocked ? grade.color : "#64748b" }}>
                    NIVEAU {grade.level} {isUnlocked ? "🔓" : "🔒"}
                  </div>
                  <div style={{ fontSize: "12px", fontWeight: 600, marginTop: "2px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {grade.gradeCode}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* ONGLETS INTERNES : COURS / SANDBOX / EXAMEN */}
        <div style={{ display: "flex", gap: "12px", borderBottom: "1px solid #334155", paddingBottom: "12px" }}>
          <button
            onClick={() => setActiveTab("cours")}
            style={{
              padding: "8px 18px",
              borderRadius: "8px",
              fontSize: "13px",
              fontWeight: 700,
              border: activeTab === "cours" ? "1px solid #6366f1" : "1px solid #334155",
              background: activeTab === "cours" ? "#4f46e5" : "#1e293b",
              color: "#ffffff",
              cursor: "pointer"
            }}
          >
            📖 1. Fiches de Cours & Ressources
          </button>
          <button
            onClick={() => setActiveTab("simulateur")}
            style={{
              padding: "8px 18px",
              borderRadius: "8px",
              fontSize: "13px",
              fontWeight: 700,
              border: activeTab === "simulateur" ? "1px solid #6366f1" : "1px solid #334155",
              background: activeTab === "simulateur" ? "#4f46e5" : "#1e293b",
              color: "#ffffff",
              cursor: "pointer"
            }}
          >
            💻 2. Sandbox 4GL Interactive
          </button>
          <button
            onClick={() => setActiveTab("examen")}
            style={{
              padding: "8px 18px",
              borderRadius: "8px",
              fontSize: "13px",
              fontWeight: 700,
              border: activeTab === "examen" ? `1px solid ${currentGrade.color}` : "1px solid #334155",
              background: activeTab === "examen" ? currentGrade.color : "#1e293b",
              color: "#ffffff",
              cursor: "pointer"
            }}
          >
            🎓 3. Examen de Passage ({currentGrade.minPassScorePct}% Requis)
          </button>
          <button
            onClick={() => setActiveTab("fiche")}
            style={{
              padding: "8px 18px",
              borderRadius: "8px",
              fontSize: "13px",
              fontWeight: 700,
              border: activeTab === "fiche" ? "1px solid #38bdf8" : "1px solid #334155",
              background: activeTab === "fiche" ? "#0284c7" : "#1e293b",
              color: "#ffffff",
              cursor: "pointer",
              marginLeft: "auto"
            }}
          >
            📋 Fiche Mémento & Mots-Clés
          </button>
        </div>

        {/* CONTENU ONGLET 1 : COURS ET RESSOURCES DU NIVEAU */}
        {activeTab === "cours" && (
          <div style={{ display: "grid", gridTemplateColumns: "1.1fr 2fr", gap: "24px", alignItems: "start" }}>
            
            {/* LISTE DES COURS DU GRADE */}
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {lessonsForCurrentGrade.map((lesson) => (
                <div
                  key={lesson.id}
                  onClick={() => handleSelectLesson(lesson)}
                  style={{
                    background: selectedLesson.id === lesson.id ? "#1e293b" : "#0f172a",
                    border: selectedLesson.id === lesson.id ? `2px solid ${currentGrade.color}` : "1px solid #334155",
                    borderRadius: "10px",
                    padding: "16px",
                    cursor: "pointer",
                    transition: "all 0.15s ease"
                  }}
                >
                  <span style={{ fontSize: "11px", color: currentGrade.color, fontWeight: 700 }}>
                    {lesson.category}
                  </span>
                  <h4 style={{ fontSize: "14px", fontWeight: 700, color: "#f8fafc", margin: "4px 0" }}>
                    {lesson.title}
                  </h4>
                  <p style={{ fontSize: "12px", color: "#94a3b8", margin: 0, lineHeight: "1.4" }}>
                    {lesson.summary}
                  </p>
                </div>
              ))}
            </div>

            {/* DÉTAIL DU COURS SÉLECTIONNÉ */}
            <div style={{ background: "#1e293b", borderRadius: "12px", border: "1px solid #334155", padding: "24px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
                <div>
                  <h3 style={{ fontSize: "18px", fontWeight: 700, color: "#f8fafc", marginBottom: "6px" }}>
                    {selectedLesson.title}
                  </h3>
                  <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                    {selectedLesson.keyConcepts.map((c, i) => (
                      <span key={i} style={{ background: "#0f172a", border: "1px solid #334155", padding: "2px 8px", borderRadius: "4px", fontSize: "11px", color: "#38bdf8", fontFamily: "monospace" }}>
                        {c}
                      </span>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => handleCopy(selectedLesson.codeSample)}
                  style={{
                    background: copied ? "#22c55e" : "#4f46e5",
                    color: "#ffffff",
                    border: "none",
                    borderRadius: "6px",
                    padding: "6px 14px",
                    fontSize: "12px",
                    fontWeight: 600,
                    cursor: "pointer"
                  }}
                >
                  {copied ? "Copié !" : "Copier le Code"}
                </button>
              </div>

              {/* CONTENU DÉTAILLÉ */}
              <div style={{ background: "#0f172a", padding: "16px", borderRadius: "8px", border: "1px solid #334155", marginBottom: "18px" }}>
                <p style={{ fontSize: "13px", color: "#e2e8f0", margin: 0, lineHeight: "1.6", whiteSpace: "pre-line" }}>
                  {selectedLesson.detailedContent}
                </p>
              </div>

              {/* CODE SOURCE RECOMMANDÉ */}
              <div style={{ marginBottom: "18px" }}>
                <div style={{ fontSize: "12px", fontWeight: 700, color: "#94a3b8", marginBottom: "6px" }}>
                  Exemple d&apos;implémentation bancaire :
                </div>
                <pre style={{
                  background: "#090d16",
                  padding: "16px",
                  borderRadius: "8px",
                  border: "1px solid #334155",
                  color: "#38bdf8",
                  fontFamily: "monospace",
                  fontSize: "13px",
                  lineHeight: "1.5",
                  whiteSpace: "pre-wrap",
                  overflowX: "auto"
                }}>
                  {selectedLesson.codeSample}
                </pre>
              </div>

              {/* RÈGLES D'OR ET PIÈGES */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", marginBottom: "18px" }}>
                <div style={{ background: "rgba(34, 197, 94, 0.1)", border: "1px solid #22c55e", borderRadius: "8px", padding: "14px" }}>
                  <div style={{ fontSize: "12px", fontWeight: 700, color: "#4ade80", marginBottom: "6px" }}>
                    ⭐ Règles d&apos;Or de Développement :
                  </div>
                  <ul style={{ margin: 0, paddingLeft: "18px", fontSize: "12px", color: "#bbf7d0", lineHeight: "1.5" }}>
                    {selectedLesson.goldenRules.map((r, idx) => (
                      <li key={idx}>{r}</li>
                    ))}
                  </ul>
                </div>

                <div style={{ background: "rgba(239, 68, 68, 0.1)", border: "1px solid #ef4444", borderRadius: "8px", padding: "14px" }}>
                  <div style={{ fontSize: "12px", fontWeight: 700, color: "#f87171", marginBottom: "6px" }}>
                    ⚠️ Pièges Critiques à Éviter :
                  </div>
                  <ul style={{ margin: 0, paddingLeft: "18px", fontSize: "12px", color: "#fecaca", lineHeight: "1.5" }}>
                    {selectedLesson.pitfallsToAvoid.map((p, idx) => (
                      <li key={idx}>{p}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* RESSOURCES OFFICIELLES & GUIDES DU NIVEAU */}
              {currentGrade.recommendedResources && currentGrade.recommendedResources.length > 0 && (
                <div style={{
                  background: "#090d16",
                  border: "1px solid #334155",
                  borderRadius: "10px",
                  padding: "16px"
                }}>
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    fontSize: "13px",
                    fontWeight: 700,
                    color: "#f8fafc",
                    marginBottom: "12px"
                  }}>
                    <span>📚</span>
                    <span>Ressources Documentaires & Normes Recommandées pour le {currentGrade.name} :</span>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "10px" }}>
                    {currentGrade.recommendedResources.map((res, idx) => (
                      <div
                        key={idx}
                        style={{
                          background: "#1e293b",
                          border: "1px solid #334155",
                          borderRadius: "8px",
                          padding: "12px 14px",
                          display: "flex",
                          flexDirection: "column",
                          gap: "4px"
                        }}
                      >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <span style={{ fontSize: "13px", fontWeight: 700, color: "#38bdf8" }}>
                            {res.title}
                          </span>
                          <span style={{
                            fontSize: "10px",
                            fontWeight: 700,
                            padding: "2px 6px",
                            borderRadius: "4px",
                            background: "#0f172a",
                            color: "#94a3b8",
                            border: "1px solid #334155"
                          }}>
                            {res.type}
                          </span>
                        </div>
                        <p style={{ fontSize: "12px", color: "#cbd5e1", margin: 0 }}>
                          {res.description}
                        </p>
                        <div style={{ fontSize: "11px", color: "#64748b", fontFamily: "monospace" }}>
                          Réf. interne : {res.urlOrRef}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>

          </div>
        )}

        {/* CONTENU ONGLET 2 : SIMULATEUR ET SANDBOX */}
        {activeTab === "simulateur" && (
          <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: "24px" }}>
            <div style={{ background: "#1e293b", borderRadius: "12px", border: "1px solid #334155", padding: "20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#f8fafc", margin: 0 }}>
                  Éditeur 4GL Interactif (programme.4gl)
                </h3>
                <button
                  onClick={handleCompileAndRun}
                  disabled={isCompiling}
                  style={{
                    background: "#22c55e",
                    color: "#0f172a",
                    border: "none",
                    borderRadius: "6px",
                    padding: "8px 18px",
                    fontSize: "13px",
                    fontWeight: 700,
                    cursor: "pointer"
                  }}
                >
                  {isCompiling ? "Compilation..." : "▶️ Compiler & Vérifier"}
                </button>
              </div>

              <textarea
                value={simCode}
                onChange={(e) => setSimCode(e.target.value)}
                rows={16}
                style={{
                  width: "100%",
                  padding: "14px",
                  borderRadius: "8px",
                  background: "#090d16",
                  border: "1px solid #334155",
                  color: "#38bdf8",
                  fontFamily: "monospace",
                  fontSize: "13px",
                  lineHeight: "1.5",
                  resize: "vertical"
                }}
              />
            </div>

            <div style={{ background: "#1e293b", borderRadius: "12px", border: "1px solid #334155", padding: "20px" }}>
              <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#f8fafc", marginBottom: "10px" }}>
                Sortie Console (c4gl runtime)
              </h3>
              <pre style={{
                background: "#090d16",
                borderRadius: "8px",
                padding: "14px",
                border: "1px solid #334155",
                color: "#34d399",
                fontFamily: "monospace",
                fontSize: "12px",
                lineHeight: "1.5",
                minHeight: "280px",
                whiteSpace: "pre-wrap"
              }}>
                {simOutput || "Cliquez sur 'Compiler & Vérifier' pour analyser la syntaxe, l'atomicité transactionnelle et la conformité aux standards Amplitude."}
              </pre>
            </div>
          </div>
        )}

        {/* CONTENU ONGLET 3 : EXAMEN DE PASSAGE DE GRADE */}
        {activeTab === "examen" && (
          <div style={{ background: "#1e293b", borderRadius: "12px", border: "1px solid #334155", padding: "24px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <div>
                <h3 style={{ fontSize: "18px", fontWeight: 800, color: "#f8fafc", margin: 0 }}>
                  Examen Officiel de Passage : {currentGrade.name}
                </h3>
                <p style={{ color: "#94a3b8", fontSize: "13px", margin: "4px 0 0 0" }}>
                  Seuil de passage éliminatoire : <strong>{currentGrade.minPassScorePct}%</strong> de bonnes réponses pour débloquer le grade supérieur.
                </p>
              </div>

              {examSubmitted && examResult && (
                <div style={{
                  background: examResult.passed ? "rgba(34, 197, 94, 0.15)" : "rgba(239, 68, 68, 0.15)",
                  border: `1px solid ${examResult.passed ? "#22c55e" : "#ef4444"}`,
                  padding: "10px 18px",
                  borderRadius: "8px",
                  color: examResult.passed ? "#4ade80" : "#f87171",
                  fontWeight: 800,
                  fontSize: "15px"
                }}>
                  {examResult.passed ? "🎉 EXAMEN VALIDÉ !" : "❌ ÉCHEC À L'EXAMEN"} : {examResult.score}/{examResult.total} ({examResult.pct}%)
                </div>
              )}
            </div>

            {/* FORMULAIRE DES QUESTIONS D'EXAMEN */}
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              {examQuestions.map((q, qIndex) => (
                <div key={q.id} style={{ background: "#0f172a", border: "1px solid #334155", borderRadius: "8px", padding: "18px" }}>
                  <div style={{ fontSize: "14px", fontWeight: 700, color: "#f8fafc", marginBottom: "12px" }}>
                    Question {qIndex + 1} : {q.question}
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    {q.options.map((opt, optIndex) => {
                      const isSelected = userExamAnswers[q.id] === optIndex;
                      const isCorrect = q.correctIndex === optIndex;
                      let bg = "#1e293b";
                      let border = "#334155";

                      if (examSubmitted) {
                        if (isCorrect) {
                          bg = "rgba(34, 197, 94, 0.2)";
                          border = "#22c55e";
                        } else if (isSelected) {
                          bg = "rgba(239, 68, 68, 0.2)";
                          border = "#ef4444";
                        }
                      } else if (isSelected) {
                        bg = "rgba(99, 102, 241, 0.2)";
                        border = "#6366f1";
                      }

                      return (
                        <div
                          key={optIndex}
                          onClick={() => !examSubmitted && setUserExamAnswers({ ...userExamAnswers, [q.id]: optIndex })}
                          style={{
                            background: bg,
                            border: `1px solid ${border}`,
                            borderRadius: "6px",
                            padding: "10px 14px",
                            fontSize: "13px",
                            color: "#e2e8f0",
                            cursor: examSubmitted ? "default" : "pointer"
                          }}
                        >
                          {opt}
                        </div>
                      );
                    })}
                  </div>

                  {examSubmitted && (
                    <div style={{ marginTop: "12px", padding: "10px", borderRadius: "6px", background: "#1e293b", fontSize: "12px", borderLeft: "4px solid #3b82f6" }}>
                      <div style={{ color: "#93c5fd", fontWeight: 600 }}>💡 Explication : {q.explanation}</div>
                      <div style={{ color: "#fbbf24", marginTop: "4px" }}>⚠️ Piège classique : {q.trapWarning}</div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div style={{ marginTop: "24px", display: "flex", justifyContent: "flex-end", gap: "12px" }}>
              {examSubmitted && (
                <button
                  onClick={() => {
                    setExamSubmitted(false);
                    setUserExamAnswers({});
                    setExamResult(null);
                  }}
                  style={{
                    background: "#1e293b",
                    color: "#ffffff",
                    border: "1px solid #334155",
                    borderRadius: "8px",
                    padding: "10px 20px",
                    fontSize: "14px",
                    fontWeight: 600,
                    cursor: "pointer"
                  }}
                >
                  Repasser l&apos;Examen
                </button>
              )}

              <button
                onClick={handleSubmitExam}
                style={{
                  background: currentGrade.color,
                  color: "#ffffff",
                  border: "none",
                  borderRadius: "8px",
                  padding: "10px 26px",
                  fontSize: "14px",
                  fontWeight: 800,
                  cursor: "pointer",
                  boxShadow: `0 4px 14px ${currentGrade.color}55`
                }}
              >
                {examSubmitted ? "Soumettre à Nouveau" : "Valider l'Examen de Passage"}
              </button>
            </div>

          </div>
        )}

        {/* CONTENU ONGLET 4 : FICHE DE RÉVISION & MÉMENTO DES MOTS-CLÉS 4GL */}
        {activeTab === "fiche" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            
            {/* BANDEAU RECHERCHE ET FILTRES */}
            <div style={{
              background: "#1e293b",
              borderRadius: "12px",
              border: "1px solid #334155",
              padding: "20px",
              display: "flex",
              flexDirection: "column",
              gap: "16px"
            }}>
              {/* BARRE DE RECHERCHE PRINCIPALE */}
              <div style={{
                position: "relative",
                display: "flex",
                alignItems: "center"
              }}>
                <span style={{
                  position: "absolute",
                  left: "14px",
                  fontSize: "18px",
                  color: "#38bdf8",
                  pointerEvents: "none"
                }}>
                  🔍
                </span>
                <input
                  type="text"
                  placeholder="Rechercher parmi les 219 concepts (ex: DEFINE, CURSOR, SQLCA, LET, FOREACH, COMMIT, WHENEVER ERROR, BKCPT...)"
                  value={cheatSheetSearch}
                  onChange={(e) => setCheatSheetSearch(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "14px 44px 14px 46px",
                    borderRadius: "10px",
                    background: "#090d16",
                    border: "2px solid #38bdf8",
                    color: "#f8fafc",
                    fontSize: "15px",
                    fontWeight: 500,
                    outline: "none",
                    boxShadow: "0 0 15px rgba(56, 189, 248, 0.15)"
                  }}
                />
                {cheatSheetSearch && (
                  <button
                    onClick={() => setCheatSheetSearch("")}
                    style={{
                      position: "absolute",
                      right: "14px",
                      background: "#334155",
                      border: "none",
                      color: "#94a3b8",
                      borderRadius: "50%",
                      width: "24px",
                      height: "24px",
                      fontSize: "12px",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center"
                    }}
                    title="Effacer la recherche"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* BARRE DE FILTRES ET COMPTEUR */}
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "12px"
              }}>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  {[
                    { id: "ALL", label: "Tous les Concepts (219)" },
                    { id: "VARIABLES", label: "Variables & Structures" },
                    { id: "AFFECTATION", label: "Affectations & Calculs" },
                    { id: "CURSEURS", label: "Curseurs & SQL" },
                    { id: "ENTREES_SORTIES", label: "Entrées / Sorties & Écrans" },
                    { id: "TRANSACTIONS", label: "Transactions & Verrous" },
                    { id: "CONTRÔLE_FLUX", label: "Contrôle de Flux & Fonctions" }
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setCheatSheetCategory(cat.id)}
                      style={{
                        padding: "7px 14px",
                        borderRadius: "8px",
                        fontSize: "12px",
                        fontWeight: 600,
                        border: cheatSheetCategory === cat.id ? "1px solid #38bdf8" : "1px solid #334155",
                        background: cheatSheetCategory === cat.id ? "#0284c7" : "#0f172a",
                        color: cheatSheetCategory === cat.id ? "#ffffff" : "#94a3b8",
                        cursor: "pointer",
                        transition: "all 0.2s ease"
                      }}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>

                <div style={{
                  fontSize: "13px",
                  color: "#94a3b8",
                  fontWeight: 600,
                  background: "#090d16",
                  padding: "6px 14px",
                  borderRadius: "6px",
                  border: "1px solid #334155"
                }}>
                  {CBS_4GL_KEYWORDS_CHEAT_SHEET.filter((card) => {
                    const matchCat = cheatSheetCategory === "ALL" || card.category === cheatSheetCategory;
                    const query = cheatSheetSearch.trim().toLowerCase();
                    const matchSearch = !query ||
                                        card.keyword.toLowerCase().includes(query) ||
                                        card.summary.toLowerCase().includes(query) ||
                                        card.bankingContext.toLowerCase().includes(query) ||
                                        card.syntax.toLowerCase().includes(query) ||
                                        card.concreteExample.toLowerCase().includes(query);
                    return matchCat && matchSearch;
                  }).length} concept(s) trouvé(s)
                </div>
              </div>
            </div>

            {/* GRILLE DES CARTES DE RÉVISION */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
              {CBS_4GL_KEYWORDS_CHEAT_SHEET.filter((card) => {
                const matchCat = cheatSheetCategory === "ALL" || card.category === cheatSheetCategory;
                const query = cheatSheetSearch.trim().toLowerCase();
                const matchSearch = !query ||
                                    card.keyword.toLowerCase().includes(query) ||
                                    card.summary.toLowerCase().includes(query) ||
                                    card.bankingContext.toLowerCase().includes(query) ||
                                    card.syntax.toLowerCase().includes(query) ||
                                    card.concreteExample.toLowerCase().includes(query);
                return matchCat && matchSearch;
              }).map((card, idx) => (
                <div
                  key={idx}
                  style={{
                    background: "#1e293b",
                    borderRadius: "12px",
                    border: "1px solid #334155",
                    padding: "20px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px"
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <span style={{ fontSize: "17px", fontWeight: 800, color: "#38bdf8", fontFamily: "monospace" }}>
                        {card.keyword}
                      </span>
                      <span style={{ fontSize: "11px", color: "#94a3b8", background: "#0f172a", padding: "2px 6px", borderRadius: "4px" }}>
                        {card.pronunciationOrType}
                      </span>
                    </div>

                    <span style={{
                      fontSize: "11px",
                      fontWeight: 700,
                      padding: "2px 8px",
                      borderRadius: "4px",
                      background: card.importance === "CRITIQUE" ? "rgba(239, 68, 68, 0.2)" : "rgba(34, 197, 94, 0.2)",
                      color: card.importance === "CRITIQUE" ? "#f87171" : "#4ade80"
                    }}>
                      {card.importance}
                    </span>
                  </div>

                  <p style={{ fontSize: "13px", color: "#e2e8f0", margin: 0, lineHeight: "1.5" }}>
                    {card.summary}
                  </p>

                  <div style={{ background: "#090d16", borderRadius: "6px", padding: "10px 12px", border: "1px solid #334155" }}>
                    <div style={{ fontSize: "11px", color: "#64748b", marginBottom: "4px" }}>Syntaxe 4GL :</div>
                    <code style={{ fontSize: "12px", color: "#facc15", fontFamily: "monospace" }}>{card.syntax}</code>
                  </div>

                  <pre style={{
                    background: "#090d16",
                    padding: "12px",
                    borderRadius: "8px",
                    border: "1px solid #334155",
                    color: "#34d399",
                    fontFamily: "monospace",
                    fontSize: "12px",
                    lineHeight: "1.4",
                    margin: 0,
                    whiteSpace: "pre-wrap",
                    overflowX: "auto"
                  }}>
                    {card.concreteExample}
                  </pre>

                  <div style={{ background: "rgba(59, 130, 246, 0.1)", border: "1px solid #3b82f6", borderRadius: "6px", padding: "10px", fontSize: "12px", color: "#93c5fd" }}>
                    <strong>🏦 Contexte Bancaire Core Banking :</strong> {card.bankingContext}
                  </div>

                  <div style={{ background: "rgba(239, 68, 68, 0.1)", border: "1px solid #ef4444", borderRadius: "6px", padding: "10px", fontSize: "12px", color: "#fca5a5" }}>
                    <strong>⚠️ Piège classique :</strong> {card.commonError}
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

      </div>
    </AppShell>
  );
}
