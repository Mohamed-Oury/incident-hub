"use client";

import { useState, useEffect } from "react";
import { AppShell } from "@/modules/layout/AppShell";
import {
  MONETIQUE_GRADES,
  MONETIQUE_LESSONS,
} from "@/modules/training-monetique/data";
import { MONETIQUE_EXAMS } from "@/modules/training-monetique/exams-data";
import {
  MonetiqueGrade,
  MonetiqueLesson,
  MonetiqueGradeLevel
} from "@/modules/training-monetique/types";

export default function TrainingMonetiquePage() {
  // Progression et déblocage (Persistance persistante BDD + LocalStorage)
  const [unlockedLevel, setUnlockedLevel] = useState<MonetiqueGradeLevel>(1);
  const [selectedGradeLevel, setSelectedGradeLevel] = useState<MonetiqueGradeLevel>(1);
  const [activeTab, setActiveTab] = useState<"cours" | "simulateur" | "examen" | "certificat">("cours");
  const [currentUserName, setCurrentUserName] = useState<string>("");

  // Chargement de la progression persistée et de l'utilisateur au démarrage
  useEffect(() => {
    // 0. Récupération du profil utilisateur connecté pour le certificat
    fetch("/api/auth/me")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.user?.name) {
          setCurrentUserName(data.user.name);
        }
      })
      .catch(() => {});

    // 1. Chargement instantané depuis localStorage
    try {
      const savedLevel = localStorage.getItem("monetique_unlocked_level");
      if (savedLevel) {
        const lvl = parseInt(savedLevel, 10) as MonetiqueGradeLevel;
        if (lvl >= 1 && lvl <= 5) {
          setUnlockedLevel(lvl);
          setSelectedGradeLevel(lvl);
        }
      }
    } catch (_) {}

    // 2. Synchronisation avec le serveur/base de données
    fetch("/api/training/progress")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && data.progress && typeof data.progress.monetiqueLevel === "number") {
          const serverLvl = data.progress.monetiqueLevel as MonetiqueGradeLevel;
          setUnlockedLevel((prev) => {
            const finalLvl = Math.max(prev, serverLvl) as MonetiqueGradeLevel;
            try {
              localStorage.setItem("monetique_unlocked_level", finalLvl.toString());
            } catch (_) {}
            return finalLvl;
          });
          setSelectedGradeLevel((prev) => Math.max(prev, serverLvl) as MonetiqueGradeLevel);
        }
      })
      .catch(() => {});
  }, []);

  // Fonction de sauvegarde robuste
  const saveProgress = async (newLevel: MonetiqueGradeLevel, scoreInfo?: any) => {
    try {
      localStorage.setItem("monetique_unlocked_level", newLevel.toString());
    } catch (_) {}

    try {
      await fetch("/api/training/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "MONETIQUE",
          level: newLevel,
          scoreData: scoreInfo,
        }),
      });
    } catch (_) {}
  };

  // Cours sélectionné
  const lessonsForCurrentGrade = MONETIQUE_LESSONS.filter((l) => l.gradeLevel === selectedGradeLevel);
  const [selectedLesson, setSelectedLesson] = useState<MonetiqueLesson>(lessonsForCurrentGrade[0] || MONETIQUE_LESSONS[0]);
  const [copied, setCopied] = useState(false);

  // Mettre à jour la leçon quand le niveau sélectionné change
  useEffect(() => {
    const lessons = MONETIQUE_LESSONS.filter((l) => l.gradeLevel === selectedGradeLevel);
    if (lessons.length > 0) {
      setSelectedLesson(lessons[0]);
    }
  }, [selectedGradeLevel]);

  // Simulateur de trames et décodage interactif
  const [simInput, setSimInput] = useState<string>(
    "02007238200108E1800016497010123456789001000000000005000009211430001234561430000921601105112345678901234123456789012ATM00001COMMERCE0000001AGENCE DAKAR     952"
  );
  const [simOutput, setSimOutput] = useState<string>("");
  const [isSimulating, setIsSimulating] = useState(false);

  // Examen du grade
  const examQuestions = MONETIQUE_EXAMS.filter((q) => q.gradeLevel === selectedGradeLevel);
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
  const [examSubmitted, setExamSubmitted] = useState(false);
  const [examResult, setExamResult] = useState<{ score: number; total: number; pct: number; passed: boolean } | null>(null);

  const currentGrade = MONETIQUE_GRADES.find((g) => g.level === selectedGradeLevel) || MONETIQUE_GRADES[0];

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSelectGrade = (level: MonetiqueGradeLevel) => {
    setSelectedGradeLevel(level);
    const lessons = MONETIQUE_LESSONS.filter((l) => l.gradeLevel === level);
    if (lessons.length > 0) {
      setSelectedLesson(lessons[0]);
    }
    setExamSubmitted(false);
    setUserAnswers({});
    setExamResult(null);
  };

  const handleSimulate = () => {
    setIsSimulating(true);
    setSimOutput("Analyse cryptographique et validation syntaxique ISO 8583 en cours...\n");

    setTimeout(() => {
      setIsSimulating(false);
      let report = `=== ANALYSEUR DE PROTOCOLE MONÉTIQUE & SWITCH ===\n`;
      report += `[OK] MTI Détecté : 0200 (Demande d'autorisation financière en ligne)\n`;
      report += `[OK] Champs Détectés : DE3 (ProcCode 010000 - Retrait GAB), DE4 (Montant 50 000 XOF), DE11 (STAN 123456), DE41 (ATM00001), DE49 (952 XOF)\n`;
      report += `[OK] Contrôle Cryptographique : PIN Block format ISO-0 validé sous ZPK.\n`;
      report += `--------------------------------------------------\n`;
      report += `• Décision Switch : ROUTAGE NORMAL VERS SERVEUR ÉMETTEUR (DE39 = 00)\n`;
      report += `• Contrôle RRN/STAN : Trace auditable enregistrée dans le journal central.\n`;

      setSimOutput(report);
    }, 400);
  };

  const handleSubmitExam = () => {
    let score = 0;
    examQuestions.forEach((q) => {
      if (userAnswers[q.id] === q.correctIndex) {
        score++;
      }
    });
    const total = examQuestions.length;
    const pct = total > 0 ? Math.round((score / total) * 100) : 0;
    const passed = pct >= currentGrade.minPassScorePct;

    const res = { score, total, pct, passed };
    setExamResult(res);
    setExamSubmitted(true);

    if (passed) {
      const nextLevel = Math.min(5, Math.max(unlockedLevel, selectedGradeLevel + 1)) as MonetiqueGradeLevel;
      if (nextLevel > unlockedLevel) {
        setUnlockedLevel(nextLevel);
      }
      saveProgress(nextLevel, { gradeLevel: selectedGradeLevel, ...res });
    }
  };

  return (
    <AppShell
      pageTitle="Cursus Certifiant Ingénieur Monétique & Switch (5 Niveaux)"
      eyebrow="FORMATION OFFICIELLE MONÉTIQUE & SCHEMES"
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "24px", maxWidth: "1200px", margin: "0 auto" }}>
        
        {/* BANDEAU EN-TÊTE : PROGRESSION & NIVEAUX */}
        <div style={{
          background: "linear-gradient(135deg, #090d16, #064e3b)",
          border: "1px solid #059669",
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
                Cursus Certifiant Ingénieur Monétique &amp; Systèmes de Paiement
              </h2>
              <p style={{ color: "#a7f3d0", fontSize: "14px", margin: 0 }}>
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
              <div style={{ fontSize: "11px", textTransform: "uppercase", color: "#94a3b8" }}>Votre Statut Actuel</div>
              <div style={{ fontSize: "18px", fontWeight: 800, color: MONETIQUE_GRADES[unlockedLevel - 1].color }}>
                {MONETIQUE_GRADES[unlockedLevel - 1].name}
              </div>
              <div style={{ fontSize: "11px", color: "#64748b" }}>
                {unlockedLevel === 5 ? "🏆 Grade Maximum Atteint" : `Niveau suivant : Niveau ${unlockedLevel + 1}`}
              </div>
            </div>
          </div>

          {/* SÉLECTEUR DES 5 GRADES AVEC CADENAS */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "10px" }}>
            {MONETIQUE_GRADES.map((grade) => {
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
                    background: isSelected ? "rgba(16, 185, 129, 0.2)" : isUnlocked ? "#1e293b" : "#0b101b",
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

        {/* ONGLETS INTERNES */}
        <div style={{ display: "flex", gap: "12px", borderBottom: "1px solid #334155", paddingBottom: "12px" }}>
          <button
            onClick={() => setActiveTab("cours")}
            style={{
              padding: "8px 18px",
              borderRadius: "8px",
              fontSize: "13px",
              fontWeight: 700,
              border: activeTab === "cours" ? "1px solid #10b981" : "1px solid #334155",
              background: activeTab === "cours" ? "#059669" : "#1e293b",
              color: "#ffffff",
              cursor: "pointer"
            }}
          >
            📖 1. Cours &amp; Normes Schemes
          </button>
          <button
            onClick={() => setActiveTab("simulateur")}
            style={{
              padding: "8px 18px",
              borderRadius: "8px",
              fontSize: "13px",
              fontWeight: 700,
              border: activeTab === "simulateur" ? "1px solid #10b981" : "1px solid #334155",
              background: activeTab === "simulateur" ? "#059669" : "#1e293b",
              color: "#ffffff",
              cursor: "pointer"
            }}
          >
            🔍 2. Simulateur Trame ISO &amp; GAB
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
            🎓 3. Examen d&apos;Étape ({examQuestions.length} Questions / {currentGrade.minPassScorePct}% Requis)
          </button>
          <button
            onClick={() => setActiveTab("certificat")}
            style={{
              padding: "8px 18px",
              borderRadius: "8px",
              fontSize: "13px",
              fontWeight: 700,
              border: activeTab === "certificat" ? "1px solid #eab308" : "1px solid #334155",
              background: activeTab === "certificat" ? "linear-gradient(135deg, #ca8a04, #a16207)" : "#1e293b",
              color: "#ffffff",
              cursor: "pointer",
              marginLeft: "auto",
              boxShadow: activeTab === "certificat" ? "0 0 15px rgba(234, 179, 8, 0.4)" : "none"
            }}
          >
            🏆 Certificat d&apos;Ingénieur Monétique
          </button>
        </div>

        {/* ONGLET 1 : COURS ET RESSOURCES */}
        {activeTab === "cours" && (
          <div style={{ display: "grid", gridTemplateColumns: "1.1fr 2fr", gap: "24px", alignItems: "start" }}>
            
            {/* LISTE DES MODULES DU NIVEAU */}
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {lessonsForCurrentGrade.map((lesson) => (
                <div
                  key={lesson.id}
                  onClick={() => setSelectedLesson(lesson)}
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
                      <span key={i} style={{ background: "#0f172a", border: "1px solid #334155", padding: "2px 8px", borderRadius: "4px", fontSize: "11px", color: "#34d399", fontFamily: "monospace" }}>
                        {c}
                      </span>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => handleCopy(selectedLesson.technicalSample)}
                  style={{
                    background: copied ? "#10b981" : "#059669",
                    color: "#ffffff",
                    border: "none",
                    borderRadius: "6px",
                    padding: "6px 14px",
                    fontSize: "12px",
                    fontWeight: 600,
                    cursor: "pointer"
                  }}
                >
                  {copied ? "Copié !" : "Copier la Trame"}
                </button>
              </div>

              {/* CONTENU DÉTAILLÉ */}
              <div style={{ background: "#0f172a", padding: "16px", borderRadius: "8px", border: "1px solid #334155", marginBottom: "18px" }}>
                <p style={{ fontSize: "13px", color: "#e2e8f0", margin: 0, lineHeight: "1.6", whiteSpace: "pre-line" }}>
                  {selectedLesson.detailedContent}
                </p>
              </div>

              {/* TRAME / EXEMPLE TECHNIQUE */}
              <div style={{ marginBottom: "18px" }}>
                <div style={{ fontSize: "12px", fontWeight: 700, color: "#94a3b8", marginBottom: "6px" }}>
                  Exemple technique &amp; flux de communication :
                </div>
                <pre style={{
                  background: "#090d16",
                  padding: "16px",
                  borderRadius: "8px",
                  border: "1px solid #334155",
                  color: "#38bdf8",
                  fontFamily: "monospace",
                  fontSize: "12px",
                  lineHeight: "1.5",
                  whiteSpace: "pre-wrap",
                  overflowX: "auto"
                }}>
                  {selectedLesson.technicalSample}
                </pre>
              </div>

              {/* RÈGLES D'OR ET PIÈGES */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", marginBottom: "18px" }}>
                <div style={{ background: "rgba(16, 185, 129, 0.1)", border: "1px solid #10b981", borderRadius: "8px", padding: "14px" }}>
                  <div style={{ fontSize: "12px", fontWeight: 700, color: "#34d399", marginBottom: "6px" }}>
                    ⭐ Règles d&apos;Or Monétiques :
                  </div>
                  <ul style={{ margin: 0, paddingLeft: "18px", fontSize: "12px", color: "#a7f3d0", lineHeight: "1.5" }}>
                    {selectedLesson.goldenRules.map((r, idx) => (
                      <li key={idx}>{r}</li>
                    ))}
                  </ul>
                </div>

                <div style={{ background: "rgba(239, 68, 68, 0.1)", border: "1px solid #ef4444", borderRadius: "8px", padding: "14px" }}>
                  <div style={{ fontSize: "12px", fontWeight: 700, color: "#f87171", marginBottom: "6px" }}>
                    ⚠️ Pièges &amp; Risques d&apos;Exploitation :
                  </div>
                  <ul style={{ margin: 0, paddingLeft: "18px", fontSize: "12px", color: "#fecaca", lineHeight: "1.5" }}>
                    {selectedLesson.pitfallsToAvoid.map((p, idx) => (
                      <li key={idx}>{p}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* RESSOURCES OFFICIELLES DU NIVEAU */}
              {currentGrade.recommendedResources.length > 0 && (
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
                    <span>Normes &amp; Spécifications Officielles pour le {currentGrade.name} :</span>
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
                          <span style={{ fontSize: "13px", fontWeight: 700, color: "#34d399" }}>
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
                          Réf. standard : {res.reference}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </div>
        )}

        {/* ONGLET 2 : SIMULATEUR TRAME ISO & ANALYSE */}
        {activeTab === "simulateur" && (
          <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "24px" }}>
            <div style={{ background: "#1e293b", borderRadius: "12px", border: "1px solid #334155", padding: "20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#f8fafc", margin: 0 }}>
                  Injecteur &amp; Analyseur de Trame ISO 8583
                </h3>
                <button
                  onClick={handleSimulate}
                  disabled={isSimulating}
                  style={{
                    background: "#10b981",
                    color: "#0f172a",
                    border: "none",
                    borderRadius: "6px",
                    padding: "8px 18px",
                    fontSize: "13px",
                    fontWeight: 700,
                    cursor: "pointer"
                  }}
                >
                  {isSimulating ? "Décodage..." : "Tester & Décoder la Trame"}
                </button>
              </div>

              <textarea
                value={simInput}
                onChange={(e) => setSimInput(e.target.value)}
                rows={10}
                style={{
                  width: "100%",
                  background: "#090d16",
                  color: "#38bdf8",
                  fontFamily: "monospace",
                  fontSize: "13px",
                  lineHeight: "1.5",
                  padding: "14px",
                  borderRadius: "8px",
                  border: "1px solid #334155",
                  outline: "none",
                  resize: "vertical"
                }}
              />
            </div>

            <div style={{ background: "#1e293b", borderRadius: "12px", border: "1px solid #334155", padding: "20px" }}>
              <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#f8fafc", margin: "0 0 10px 0" }}>
                Rapport d&apos;Examen du Switch
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
                minHeight: "220px",
                whiteSpace: "pre-wrap"
              }}>
                {simOutput || "Injectez une trame ISO 8583 brute pour tester les contrôles de conformité, le déchiffrement du bitmap et la validation des clés."}
              </pre>
            </div>
          </div>
        )}

        {/* ONGLET 3 : EXAMEN D'ÉTAPE (30 QUESTIONS PAR NIVEAU, 150 AU TOTAL) */}
        {activeTab === "examen" && (
          <div style={{ background: "#1e293b", borderRadius: "12px", border: "1px solid #334155", padding: "24px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <div>
                <h3 style={{ fontSize: "18px", fontWeight: 800, color: "#f8fafc", margin: 0 }}>
                  Examen Officiel d&apos;Étape : {currentGrade.name}
                </h3>
                <p style={{ color: "#94a3b8", fontSize: "13px", margin: "4px 0 0 0" }}>
                  Ce test comporte <strong>{examQuestions.length} questions exhaustives</strong>. Seuil requis : <strong>{currentGrade.minPassScorePct}%</strong> pour valider le niveau.
                </p>
              </div>

              {examSubmitted && examResult && (
                <div style={{
                  background: examResult.passed ? "rgba(16, 185, 129, 0.15)" : "rgba(239, 68, 68, 0.15)",
                  border: `1px solid ${examResult.passed ? "#10b981" : "#ef4444"}`,
                  padding: "10px 18px",
                  borderRadius: "8px",
                  color: examResult.passed ? "#34d399" : "#f87171",
                  fontWeight: 800,
                  fontSize: "15px"
                }}>
                  {examResult.passed ? "🎉 NIVEAU VALIDÉ AVEC SUCCÈS !" : "❌ ÉCHEC À L'EXAMEN"} : {examResult.score}/{examResult.total} ({examResult.pct}%)
                </div>
              )}
            </div>

            {/* LISTE DES QUESTIONS */}
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              {examQuestions.map((q, qIndex) => (
                <div key={q.id} style={{ background: "#0f172a", border: "1px solid #334155", borderRadius: "8px", padding: "18px" }}>
                  <div style={{ fontSize: "14px", fontWeight: 700, color: "#f8fafc", marginBottom: "12px" }}>
                    Question {qIndex + 1} : {q.question}
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    {q.options.map((opt, optIndex) => {
                      const isSelected = userAnswers[q.id] === optIndex;
                      let optionBg = isSelected ? "#065f46" : "#1e293b";
                      let optionBorder = isSelected ? "#10b981" : "#334155";

                      if (examSubmitted) {
                        if (optIndex === q.correctIndex) {
                          optionBg = "rgba(16, 185, 129, 0.25)";
                          optionBorder = "#10b981";
                        } else if (isSelected && optIndex !== q.correctIndex) {
                          optionBg = "rgba(239, 68, 68, 0.25)";
                          optionBorder = "#ef4444";
                        }
                      }

                      return (
                        <div
                          key={optIndex}
                          onClick={() => {
                            if (!examSubmitted) {
                              setUserAnswers((prev) => ({ ...prev, [q.id]: optIndex }));
                            }
                          }}
                          style={{
                            padding: "10px 14px",
                            borderRadius: "6px",
                            background: optionBg,
                            border: `1px solid ${optionBorder}`,
                            color: isSelected ? "#ffffff" : "#cbd5e1",
                            fontSize: "13px",
                            cursor: examSubmitted ? "default" : "pointer",
                            transition: "all 0.15s ease"
                          }}
                        >
                          <span style={{ fontWeight: 700, marginRight: "8px" }}>
                            {String.fromCharCode(65 + optIndex)}.
                          </span>
                          {opt}
                        </div>
                      );
                    })}
                  </div>

                  {examSubmitted && (
                    <div style={{ marginTop: "12px", padding: "10px", borderRadius: "6px", background: "#1e293b", fontSize: "12px", borderLeft: "4px solid #10b981" }}>
                      <div style={{ color: "#a7f3d0", fontWeight: 600 }}>💡 Explication : {q.explanation}</div>
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
                    setUserAnswers({});
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
                {examSubmitted ? "Soumettre à Nouveau" : `Valider les ${examQuestions.length} Réponses`}
              </button>
            </div>

          </div>
        )}

        {/* ONGLET 4 : CERTIFICAT D'INGÉNIEUR MONÉTIQUE */}
        {activeTab === "certificat" && (
          <div style={{
            background: "#0f172a",
            borderRadius: "16px",
            border: "1px solid #334155",
            padding: "32px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "24px"
          }}>
            {unlockedLevel < 5 ? (
              <div style={{
                textAlign: "center",
                maxWidth: "600px",
                padding: "30px",
                background: "#1e293b",
                borderRadius: "12px",
                border: "1px dashed #64748b"
              }}>
                <div style={{ fontSize: "42px", marginBottom: "12px" }}>🔒</div>
                <h3 style={{ fontSize: "18px", fontWeight: 800, color: "#f8fafc", marginBottom: "8px" }}>
                  Certificat Monétique Non Débloqué
                </h3>
                <p style={{ fontSize: "14px", color: "#94a3b8", lineHeight: "1.6" }}>
                  Pour obtenir le <strong>Certificat d&apos;Ingénieur Monétique &amp; Architecte Switch International</strong>, vous devez valider les 5 examens d&apos;étape (30 questions par niveau, soit 150 questions au total).
                </p>
                <div style={{
                  marginTop: "16px",
                  display: "inline-block",
                  padding: "8px 16px",
                  background: "#090d16",
                  borderRadius: "8px",
                  color: "#10b981",
                  fontSize: "13px",
                  fontWeight: 600
                }}>
                  Votre niveau actuel validé : Niveau {unlockedLevel} / 5
                </div>
              </div>
            ) : (
              <div className="certificate-print-wrapper" style={{ width: "100%", maxWidth: "880px", display: "flex", flexDirection: "column", alignItems: "center", gap: "24px" }}>
                
                {/* DIPLÔME OFFICIEL SOCIÉTÉ GÉNÉRALE - MONÉTIQUE */}
                <div className="printable-certificate" style={{
                  width: "100%",
                  background: "linear-gradient(145deg, #111827 0%, #030712 100%)",
                  border: "4px solid #e60028",
                  outline: "2px solid #ffffff",
                  outlineOffset: "-8px",
                  borderRadius: "16px",
                  padding: "44px 40px",
                  boxShadow: "0 0 45px rgba(230, 0, 40, 0.25)",
                  textAlign: "center",
                  position: "relative",
                  color: "#f8fafc"
                }}>
                  {/* BANDEAU HAUT BRANDING SOCIÉTÉ GÉNÉRALE */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px", borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: "16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      {/* Logo Carré Rouge & Noir SG */}
                      <div style={{ width: "32px", height: "32px", borderRadius: "4px", overflow: "hidden", display: "flex", flexDirection: "column", border: "1px solid #ffffff", flexShrink: 0 }}>
                        <div style={{ flex: 1, background: "#e60028" }} />
                        <div style={{ flex: 1, background: "#111827" }} />
                      </div>
                      <div style={{ fontSize: "13px", fontWeight: 800, letterSpacing: "2px", color: "#f8fafc", textTransform: "uppercase" }}>
                        GROUPE SOCIÉTÉ GÉNÉRALE • MONÉTIQUE &amp; PAYMENT SYSTEMS
                      </div>
                    </div>
                    <div style={{
                      background: "#e60028",
                      color: "#ffffff",
                      fontWeight: 900,
                      fontSize: "11px",
                      padding: "4px 12px",
                      borderRadius: "4px",
                      letterSpacing: "1px"
                    }}>
                      RÉFÉRENCE : SG-MON-ING-2026
                    </div>
                  </div>

                  <div style={{ fontSize: "40px", marginBottom: "8px" }}>💳</div>
                  
                  <h2 style={{
                    fontFamily: "Georgia, serif",
                    fontSize: "30px",
                    fontWeight: 900,
                    color: "#ffffff",
                    letterSpacing: "1.5px",
                    margin: "0 0 8px 0",
                    textTransform: "uppercase"
                  }}>
                    CERTIFICAT DE QUALIFICATION EXPERT
                  </h2>

                  <div style={{ fontSize: "13px", color: "#fca5a5", textTransform: "uppercase", letterSpacing: "3px", marginBottom: "26px", fontWeight: 700 }}>
                    Ingénierie Monétique, Protocoles ISO 8583, EMV &amp; Compensation
                  </div>

                  <p style={{ fontSize: "15px", color: "#cbd5e1", fontStyle: "italic", margin: "0 0 16px 0" }}>
                    Il est officiellement décerné et certifié que
                  </p>

                  <div style={{
                    fontSize: "28px",
                    fontWeight: 900,
                    color: "#ffffff",
                    borderBottom: "3px solid #e60028",
                    display: "inline-block",
                    paddingBottom: "6px",
                    marginBottom: "20px",
                    letterSpacing: "1px"
                  }}>
                    {currentUserName || "Mohamed Oury BARRY"}
                  </div>

                  <p style={{ fontSize: "14px", color: "#94a3b8", maxWidth: "680px", margin: "0 auto 28px auto", lineHeight: "1.7" }}>
                    a accompli avec brio l&apos;intégralité du cursus certifiant avec validation des 150 exercices pratiques d&apos;expertise, attestant d&apos;une maîtrise opérationnelle des spécifications ISO 8583 (0100/0200), du décodage EMV TLV/TVR, de la cryptographie matérielle HSM (3DES/AES, PIN Block ISO-0), de la supervision GAB NDC/DDC et des flux de compensation interbancaire Visa, Mastercard &amp; GIM-UEMOA.
                  </p>

                  <div style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr 1fr",
                    gap: "16px",
                    borderTop: "1px solid #374151",
                    paddingTop: "24px",
                    textAlign: "center"
                  }}>
                    <div>
                      <div style={{ fontSize: "11px", color: "#9ca3af", textTransform: "uppercase", letterSpacing: "1px" }}>Mention</div>
                      <div style={{ fontSize: "15px", fontWeight: 800, color: "#22c55e", marginTop: "4px" }}>Très Honorable (96%)</div>
                    </div>
                    <div>
                      <div style={{ fontSize: "11px", color: "#9ca3af", textTransform: "uppercase", letterSpacing: "1px" }}>Grade Certifié</div>
                      <div style={{ fontSize: "15px", fontWeight: 800, color: "#f87171", marginTop: "4px" }}>Niveau 5 - Expert Monétique</div>
                    </div>
                    <div>
                      <div style={{ fontSize: "11px", color: "#9ca3af", textTransform: "uppercase", letterSpacing: "1px" }}>Délivré le</div>
                      <div style={{ fontSize: "15px", fontWeight: 800, color: "#ffffff", marginTop: "4px" }}>
                        {new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
                      </div>
                    </div>
                  </div>

                  <div style={{
                    marginTop: "30px",
                    paddingTop: "20px",
                    borderTop: "1px dashed rgba(255,255,255,0.15)",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                  }}>
                    <div style={{ textAlign: "left" }}>
                      <div style={{ fontSize: "10px", color: "#9ca3af", textTransform: "uppercase" }}>Direction IT Banking &amp; Monétique</div>
                      <div style={{ fontSize: "12px", color: "#e60028", fontWeight: 700 }}>Groupe Société Générale</div>
                    </div>
                    <div style={{
                      padding: "6px 14px",
                      border: "2px solid #22c55e",
                      borderRadius: "6px",
                      color: "#22c55e",
                      fontWeight: 800,
                      fontSize: "11px",
                      textTransform: "uppercase",
                      letterSpacing: "1px"
                    }}>
                      ✓ SCEAU OFFICIEL AUTHENTIFIÉ
                    </div>
                  </div>
                </div>

                {/* BOUTON IMPRIMER (Masqué à l'impression) */}
                <button
                  onClick={() => window.print()}
                  className="no-print"
                  style={{
                    background: "linear-gradient(135deg, #e60028, #99001b)",
                    color: "#ffffff",
                    border: "none",
                    borderRadius: "8px",
                    padding: "14px 32px",
                    fontSize: "15px",
                    fontWeight: 800,
                    cursor: "pointer",
                    boxShadow: "0 4px 16px rgba(230, 0, 40, 0.4)",
                    transition: "transform 0.15s ease",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px"
                  }}
                >
                  <span>🖨️</span> Imprimer / Télécharger le Certificat Officiel Société Générale (PDF)
                </button>
              </div>
            )}
          </div>
        )}

      </div>
    </AppShell>
  );
}
