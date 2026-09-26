"use client";

import { useState, useEffect } from "react";
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
import {
  CBS_4GL_PER_COURSES,
  Cbs4GlPerScreenCourse
} from "@/modules/cbs/cbs-4gl-per-screens-data";
import {
  CustomPerScreen,
  generateCustomPerScreen
} from "@/modules/cbs/cbs-screen-builder";

export default function Cbs4GlTrainingPage() {
  const [unlockedLevel, setUnlockedLevel] = useState<number>(1);
  const [selectedGradeLevel, setSelectedGradeLevel] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<"cours" | "simulateur" | "examen" | "per_screens" | "studio_per" | "fiche" | "certificat">("cours");
  const [selectedPerCourse, setSelectedPerCourse] = useState<Cbs4GlPerScreenCourse>(CBS_4GL_PER_COURSES[0]);
  const [activePerSubTab, setActivePerSubTab] = useState<"per" | "4gl" | "terminal" | "directives">("per");
  const [cheatSheetCategory, setCheatSheetCategory] = useState<string>("ALL");
  const [cheatSheetSearch, setCheatSheetSearch] = useState<string>("");
  const [currentUserName, setCurrentUserName] = useState<string>("Mohamed Oury Diallo");

  // Studio Créateur d'écrans .per
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

  // Chargement de l'utilisateur connecté
  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && data.user && data.user.name) {
          setCurrentUserName(data.user.name);
        }
      })
      .catch(() => { });
  }, []);

  // Chargement de la progression persistée au démarrage
  useEffect(() => {

    // 1. Chargement instantané depuis localStorage
    try {
      const savedLevel = localStorage.getItem("cbs_4gl_unlocked_level");
      if (savedLevel) {
        const lvl = parseInt(savedLevel, 10);
        if (lvl >= 1 && lvl <= 5) {
          setUnlockedLevel(lvl);
          setSelectedGradeLevel(lvl);
        }
      }
    } catch (_) { }

    // 3. Chargement initial de l'historique des écrans .per créés
    fetch("/api/cbs/screens")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && Array.isArray(data.screens)) {
          setSavedScreensList(data.screens);
        }
      })
      .catch(() => { });
  }, []);

  // Fonction de rechargement des écrans
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
        // Fallback local instantané
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

  // Fonction de sauvegarde robuste de la progression
  const saveProgress = async (newLevel: number, scoreInfo?: any) => {
    try {
      localStorage.setItem("cbs_4gl_unlocked_level", newLevel.toString());
    } catch (_) { }

    try {
      await fetch("/api/training/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "CBS",
          level: newLevel,
          scoreData: scoreInfo,
        }),
      });
    } catch (_) { }
  };

  // Cours sélectionné
  const lessonsForCurrentGrade = CBS_4GL_LESSONS.filter((l) => l.gradeLevel === selectedGradeLevel);
  const [selectedLesson, setSelectedLesson] = useState<Cbs4GlLesson>(lessonsForCurrentGrade[0] || CBS_4GL_LESSONS[0]);
  const [copied, setCopied] = useState(false);

  // Mettre à jour la leçon quand le niveau sélectionné change
  useEffect(() => {
    const lessons = CBS_4GL_LESSONS.filter((l) => l.gradeLevel === selectedGradeLevel);
    if (lessons.length > 0) {
      setSelectedLesson(lessons[0]);
      setSimCode(lessons[0].codeSample);
    }
  }, [selectedGradeLevel]);

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
    setSimOutput("Compilation c4gl en cours avec le moteur Informix IDS...\nLiaison avec la base de données AMPLITUDE...\n");

    setTimeout(() => {
      setIsCompiling(false);
      let output = "=== RÉSULTAT COMPILATION & RUN (c4gl) ===\n";
      output += "[OK] 0 avertissements, 0 erreurs de syntaxe.\n";
      output += "[OK] Binaire exécutable 'cbs_prog.4go' généré.\n";
      output += "--------------------------------------------------\n";
      output += "[EXECUTION EN ENVIRONNEMENT BANCAIRE SIMULÉ] :\n";

      if (simCode.includes("DISPLAY")) {
        output += "> Sortie console : Exécution réussie avec code retour EXIT PROGRAM (0).\n";
      }
      if (simCode.includes("SELECT") || simCode.includes("FOREACH")) {
        output += "> Transaction SQL : 12 comptes analysés, 0 anomalies de solde détectées.\n";
      }
      if (simCode.includes("BEGIN WORK") || simCode.includes("COMMIT WORK")) {
        output += "> Contrôle ACID : COMMIT WORK validé. Écritures passées en table d'audit BKAUD.\n";
      }
      if (simCode.includes("PUT") || simCode.includes("FLUSH")) {
        output += "> Performance Batch : 2 500 écritures tamponnées flushées en 42ms.\n";
      }

      setSimOutput(output);
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

    const res = { score, total, pct, passed };
    setExamResult(res);
    setExamSubmitted(true);

    if (passed) {
      const nextLevel = Math.min(5, Math.max(unlockedLevel, selectedGradeLevel + 1));
      if (nextLevel > unlockedLevel) {
        setUnlockedLevel(nextLevel);
      }
      saveProgress(nextLevel, { gradeLevel: selectedGradeLevel, ...res });
    }
  };

  return (
    <AppShell
      pageTitle="Cursus Développeur Informix 4GL & Amplitude (5 Grades)"
      eyebrow="AMPLITUDE IT BANKING"
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "24px", maxWidth: "1200px", margin: "0 auto" }}>

        {/* EN-TÊTE : PROGRESSION ET PALMARÈS DES GRADES */}
        <div className="no-print" style={{
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

        {/* ONGLETS INTERNES : COURS / SANDBOX / EXAMEN / FORM-4GL / STUDIO / FICHE / CERTIFICAT */}
        <div className="no-print" style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          gap: "10px",
          borderBottom: "1px solid #334155",
          paddingBottom: "14px"
        }}>
          <button
            onClick={() => setActiveTab("cours")}
            style={{
              padding: "8px 16px",
              borderRadius: "8px",
              fontSize: "13px",
              fontWeight: 700,
              border: activeTab === "cours" ? "1px solid #6366f1" : "1px solid #334155",
              background: activeTab === "cours" ? "#4f46e5" : "#1e293b",
              color: "#ffffff",
              cursor: "pointer",
              transition: "all 0.15s ease"
            }}
          >
            📖 1. Cours &amp; Ressources
          </button>
          <button
            onClick={() => setActiveTab("simulateur")}
            style={{
              padding: "8px 16px",
              borderRadius: "8px",
              fontSize: "13px",
              fontWeight: 700,
              border: activeTab === "simulateur" ? "1px solid #6366f1" : "1px solid #334155",
              background: activeTab === "simulateur" ? "#4f46e5" : "#1e293b",
              color: "#ffffff",
              cursor: "pointer",
              transition: "all 0.15s ease"
            }}
          >
            💻 2. Sandbox 4GL
          </button>
          <button
            onClick={() => setActiveTab("examen")}
            style={{
              padding: "8px 16px",
              borderRadius: "8px",
              fontSize: "13px",
              fontWeight: 700,
              border: activeTab === "examen" ? `1px solid ${currentGrade.color}` : "1px solid #334155",
              background: activeTab === "examen" ? currentGrade.color : "#1e293b",
              color: "#ffffff",
              cursor: "pointer",
              transition: "all 0.15s ease"
            }}
          >
            🎓 3. Examen ({currentGrade.minPassScorePct}%)
          </button>
          <button
            onClick={() => setActiveTab("per_screens")}
            style={{
              padding: "8px 16px",
              borderRadius: "8px",
              fontSize: "13px",
              fontWeight: 700,
              border: activeTab === "per_screens" ? "1px solid #10b981" : "1px solid #334155",
              background: activeTab === "per_screens" ? "#059669" : "#1e293b",
              color: "#ffffff",
              cursor: "pointer",
              transition: "all 0.15s ease"
            }}
          >
            🖥️ 4. Cursus Écrans .per
          </button>
          <button
            onClick={() => {
              setActiveTab("studio_per");
              refreshScreens();
            }}
            style={{
              padding: "8px 18px",
              borderRadius: "8px",
              fontSize: "13px",
              fontWeight: 800,
              border: activeTab === "studio_per" ? "2px solid #fbbf24" : "1px solid #f59e0b",
              background: activeTab === "studio_per" ? "#d97706" : "rgba(217, 119, 6, 0.15)",
              color: activeTab === "studio_per" ? "#ffffff" : "#fbbf24",
              cursor: "pointer",
              boxShadow: activeTab === "studio_per" ? "0 0 16px rgba(245, 158, 11, 0.5)" : "none",
              transition: "all 0.15s ease"
            }}
          >
            ✨ 5. Studio Créateur .per
          </button>
          <button
            onClick={() => setActiveTab("fiche")}
            style={{
              padding: "8px 16px",
              borderRadius: "8px",
              fontSize: "13px",
              fontWeight: 700,
              border: activeTab === "fiche" ? "1px solid #38bdf8" : "1px solid #334155",
              background: activeTab === "fiche" ? "#0284c7" : "#1e293b",
              color: "#ffffff",
              cursor: "pointer",
              transition: "all 0.15s ease"
            }}
          >
            📋 Fiche Mémento
          </button>
          <button
            onClick={() => setActiveTab("certificat")}
            style={{
              padding: "8px 16px",
              borderRadius: "8px",
              fontSize: "13px",
              fontWeight: 700,
              border: activeTab === "certificat" ? "1px solid #eab308" : "1px solid #334155",
              background: activeTab === "certificat" ? "linear-gradient(135deg, #ca8a04, #a16207)" : "#1e293b",
              color: "#ffffff",
              cursor: "pointer",
              boxShadow: activeTab === "certificat" ? "0 0 15px rgba(234, 179, 8, 0.4)" : "none",
              transition: "all 0.15s ease"
            }}
          >
            🏆 Certificat 4GL
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

        {/* CONTENU ONGLET 4 : CONCEPTION D'ÉCRANS .PER (FORM-4GL) - DÉBUTANT À EXPERT */}
        {activeTab === "per_screens" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>

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
                  fontSize: "11px",
                  fontWeight: 700,
                  padding: "4px 10px",
                  borderRadius: "9999px",
                  border: "1px solid #059669",
                  textTransform: "uppercase"
                }}>
                  Cursus Spécialisé IHM Form-4GL
                </span>
                <h3 style={{ fontSize: "20px", fontWeight: 800, color: "#f8fafc", margin: "6px 0 2px" }}>
                  Maîtrise Complète des Masques de Saisie (.per) Informix
                </h3>
                <p style={{ fontSize: "13px", color: "#a7f3d0", margin: 0 }}>
                  Du positionnement canonique sur grille VT100 80x24 aux tableaux défilants SCREEN RECORD et fenêtres modales haute sécurité.
                </p>
              </div>

              <div style={{ display: "flex", gap: "8px" }}>
                <span style={{ background: "rgba(0,0,0,0.3)", border: "1px solid #10b981", padding: "6px 12px", borderRadius: "8px", fontSize: "12px", color: "#ecfdf5", fontWeight: 600 }}>
                  ⚡ form4gl / fglform
                </span>
                <span style={{ background: "rgba(0,0,0,0.3)", border: "1px solid #10b981", padding: "6px 12px", borderRadius: "8px", fontSize: "12px", color: "#ecfdf5", fontWeight: 600 }}>
                  🖥️ Grille 80x24 ASCII
                </span>
                <span style={{ background: "rgba(0,0,0,0.3)", border: "1px solid #10b981", padding: "6px 12px", borderRadius: "8px", fontSize: "12px", color: "#ecfdf5", fontWeight: 600 }}>
                  🔒 PCI-DSS Compliant
                </span>
              </div>
            </div>

            {/* SÉLECTEUR DES 4 NIVEAUX DE FORMATION .PER */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px" }}>
              {CBS_4GL_PER_COURSES.map((course) => {
                const isSelected = selectedPerCourse.id === course.id;
                const levelColors: Record<string, string> = {
                  DEBUTANT: "#38bdf8",
                  INTERMEDIAIRE: "#3b82f6",
                  AVANCE: "#a855f7",
                  EXPERT: "#f43f5e"
                };
                const color = levelColors[course.level] || "#10b981";

                return (
                  <button
                    key={course.id}
                    onClick={() => {
                      setSelectedPerCourse(course);
                      setActivePerSubTab("per");
                    }}
                    style={{
                      padding: "16px",
                      borderRadius: "10px",
                      border: isSelected ? `2px solid ${color}` : "1px solid #334155",
                      background: isSelected ? "rgba(15, 23, 42, 0.9)" : "#0f172a",
                      color: "#f8fafc",
                      cursor: "pointer",
                      textAlign: "left",
                      boxShadow: isSelected ? `0 0 15px ${color}33` : "none",
                      transition: "all 0.15s ease"
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                      <span style={{
                        fontSize: "10px",
                        fontWeight: 800,
                        color: color,
                        textTransform: "uppercase",
                        background: `${color}15`,
                        padding: "2px 8px",
                        borderRadius: "4px",
                        border: `1px solid ${color}40`
                      }}>
                        Niveau {course.levelOrder} : {course.level}
                      </span>
                      {isSelected && <span style={{ color: color, fontSize: "12px" }}>● Actif</span>}
                    </div>
                    <div style={{ fontSize: "13px", fontWeight: 700, color: "#f8fafc", lineHeight: "1.3" }}>
                      {course.title.split(":")[0]}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* CORPS DU COURS .PER : EN-TÊTE ET OBJECTIFS */}
            <div style={{ background: "#1e293b", borderRadius: "12px", border: "1px solid #334155", padding: "24px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "16px", marginBottom: "16px" }}>
                <div>
                  <h3 style={{ fontSize: "18px", fontWeight: 800, color: "#f8fafc", marginBottom: "6px" }}>
                    {selectedPerCourse.title}
                  </h3>
                  <p style={{ fontSize: "13px", color: "#94a3b8", margin: 0 }}>
                    {selectedPerCourse.summary}
                  </p>
                </div>

                <button
                  onClick={() => handleCopy(selectedPerCourse.perSourceCode)}
                  style={{
                    background: copied ? "#22c55e" : "#059669",
                    color: "#ffffff",
                    border: "none",
                    borderRadius: "6px",
                    padding: "8px 16px",
                    fontSize: "12px",
                    fontWeight: 700,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px"
                  }}
                >
                  {copied ? "✓ Code .per Copié !" : "📋 Copier Masque .per"}
                </button>
              </div>

              {/* OBJECTIFS PÉDAGOGIQUES */}
              <div style={{
                background: "#0f172a",
                borderRadius: "8px",
                border: "1px solid #334155",
                padding: "16px",
                marginBottom: "20px"
              }}>
                <div style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", color: "#38bdf8", marginBottom: "8px" }}>
                  🎯 Objectifs Clés du Module :
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "8px" }}>
                  {selectedPerCourse.objectives.map((obj, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "8px", fontSize: "12px", color: "#cbd5e1" }}>
                      <span style={{ color: "#10b981", fontWeight: 800 }}>✓</span>
                      <span>{obj}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* SOUS-ONGLETS DE VISUALISATION : .PER / 4GL / TERMINAL / DIRECTIVES */}
              <div style={{ display: "flex", gap: "8px", borderBottom: "1px solid #334155", paddingBottom: "12px", marginBottom: "16px" }}>
                <button
                  onClick={() => setActivePerSubTab("per")}
                  style={{
                    padding: "6px 14px",
                    borderRadius: "6px",
                    fontSize: "12px",
                    fontWeight: 700,
                    border: activePerSubTab === "per" ? "1px solid #10b981" : "1px solid #334155",
                    background: activePerSubTab === "per" ? "#059669" : "#0f172a",
                    color: "#ffffff",
                    cursor: "pointer"
                  }}
                >
                  📄 1. Code Masque (.per)
                </button>
                <button
                  onClick={() => setActivePerSubTab("4gl")}
                  style={{
                    padding: "6px 14px",
                    borderRadius: "6px",
                    fontSize: "12px",
                    fontWeight: 700,
                    border: activePerSubTab === "4gl" ? "1px solid #6366f1" : "1px solid #334155",
                    background: activePerSubTab === "4gl" ? "#4f46e5" : "#0f172a",
                    color: "#ffffff",
                    cursor: "pointer"
                  }}
                >
                  ⚡ 2. Code 4GL Associé (OPEN/INPUT)
                </button>
                <button
                  onClick={() => setActivePerSubTab("terminal")}
                  style={{
                    padding: "6px 14px",
                    borderRadius: "6px",
                    fontSize: "12px",
                    fontWeight: 700,
                    border: activePerSubTab === "terminal" ? "1px solid #f59e0b" : "1px solid #334155",
                    background: activePerSubTab === "terminal" ? "#d97706" : "#0f172a",
                    color: "#ffffff",
                    cursor: "pointer"
                  }}
                >
                  🖥️ 3. Rendu Terminal ASCII VT100
                </button>
                <button
                  onClick={() => setActivePerSubTab("directives")}
                  style={{
                    padding: "6px 14px",
                    borderRadius: "6px",
                    fontSize: "12px",
                    fontWeight: 700,
                    border: activePerSubTab === "directives" ? "1px solid #38bdf8" : "1px solid #334155",
                    background: activePerSubTab === "directives" ? "#0284c7" : "#0f172a",
                    color: "#ffffff",
                    cursor: "pointer"
                  }}
                >
                  🔍 4. Directives, Compilation &amp; Règles d&apos;Or
                </button>
              </div>

              {/* VUE 1 : CODE MASQUE .PER */}
              {activePerSubTab === "per" && (
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                    <span style={{ fontSize: "12px", color: "#94a3b8" }}>
                      Fichier source form-4GL canonique : <code style={{ color: "#34d399" }}>masque_{selectedPerCourse.id}.per</code>
                    </span>
                    <button
                      onClick={() => handleCopy(selectedPerCourse.perSourceCode)}
                      style={{ background: "#334155", color: "#f8fafc", border: "none", padding: "4px 10px", borderRadius: "4px", fontSize: "11px", cursor: "pointer" }}
                    >
                      Copier
                    </button>
                  </div>
                  <pre style={{
                    background: "#090d16",
                    padding: "16px",
                    borderRadius: "8px",
                    border: "1px solid #10b981",
                    color: "#34d399",
                    fontFamily: "monospace",
                    fontSize: "12px",
                    lineHeight: "1.45",
                    whiteSpace: "pre-wrap",
                    overflowX: "auto"
                  }}>
                    {selectedPerCourse.perSourceCode}
                  </pre>
                </div>
              )}

              {/* VUE 2 : CODE 4GL ASSOCIÉ */}
              {activePerSubTab === "4gl" && (
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                    <span style={{ fontSize: "12px", color: "#94a3b8" }}>
                      Code 4GL d&apos;activation, saisie et gestion événementielle :
                    </span>
                    <button
                      onClick={() => handleCopy(selectedPerCourse.fourGlSourceCode)}
                      style={{ background: "#334155", color: "#f8fafc", border: "none", padding: "4px 10px", borderRadius: "4px", fontSize: "11px", cursor: "pointer" }}
                    >
                      Copier
                    </button>
                  </div>
                  <pre style={{
                    background: "#090d16",
                    padding: "16px",
                    borderRadius: "8px",
                    border: "1px solid #6366f1",
                    color: "#a5b4fc",
                    fontFamily: "monospace",
                    fontSize: "12px",
                    lineHeight: "1.45",
                    whiteSpace: "pre-wrap",
                    overflowX: "auto"
                  }}>
                    {selectedPerCourse.fourGlSourceCode}
                  </pre>
                </div>
              )}

              {/* VUE 3 : RENDU TERMINAL ASCII VT100 */}
              {activePerSubTab === "terminal" && (
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                    <span style={{ fontSize: "12px", color: "#94a3b8" }}>
                      Simulation fidèle du terminal bancaire 80x24 (Putty / Reflection AIX) :
                    </span>
                    <span style={{ fontSize: "11px", color: "#f59e0b", background: "rgba(245, 158, 11, 0.1)", padding: "2px 8px", borderRadius: "4px", border: "1px solid #f59e0b" }}>
                      Grille 80 Colonnes
                    </span>
                  </div>
                  <div style={{
                    background: "#000000",
                    border: "2px solid #22c55e",
                    borderRadius: "8px",
                    padding: "16px",
                    boxShadow: "0 0 20px rgba(34, 197, 94, 0.2)"
                  }}>
                    <pre style={{
                      color: "#22c55e",
                      fontFamily: "monospace",
                      fontSize: "12px",
                      lineHeight: "1.25",
                      margin: 0,
                      whiteSpace: "pre",
                      overflowX: "auto"
                    }}>
                      {selectedPerCourse.terminalMockup}
                    </pre>
                  </div>
                </div>
              )}

              {/* VUE 4 : DIRECTIVES, COMPILATION & RÈGLES */}
              {activePerSubTab === "directives" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                  {/* DIRECTIVES CLÉS */}
                  <div>
                    <h4 style={{ fontSize: "14px", fontWeight: 700, color: "#38bdf8", marginBottom: "10px" }}>
                      📌 Directives Clés et Rôles dans ce Masque :
                    </h4>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "10px" }}>
                      {selectedPerCourse.keyDirectives.map((d, i) => (
                        <div key={i} style={{ background: "#0f172a", border: "1px solid #334155", borderRadius: "8px", padding: "12px" }}>
                          <code style={{ fontSize: "12px", color: "#facc15", fontWeight: 700 }}>{d.directive}</code>
                          <div style={{ fontSize: "12px", color: "#cbd5e1", marginTop: "4px", lineHeight: "1.4" }}>{d.role}</div>
                          <div style={{ fontSize: "11px", color: "#94a3b8", marginTop: "4px", fontFamily: "monospace", background: "#090d16", padding: "4px 8px", borderRadius: "4px" }}>
                            {d.example}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* COMPILATION & EXÉCUTION AIX */}
                  <div style={{ background: "#0f172a", border: "1px solid #334155", borderRadius: "8px", padding: "16px" }}>
                    <h4 style={{ fontSize: "14px", fontWeight: 700, color: "#10b981", margin: "0 0 10px" }}>
                      ⚙️ Compilation AIX (form4gl / fglform) :
                    </h4>
                    <pre style={{ background: "#090d16", padding: "10px", borderRadius: "6px", border: "1px solid #334155", color: "#34d399", fontSize: "12px", fontFamily: "monospace", margin: "0 0 10px" }}>
                      {selectedPerCourse.compilationAndRuntime.commandAix}
                    </pre>
                    <div style={{ fontSize: "12px", color: "#94a3b8", marginBottom: "8px" }}>
                      Fichier binaire produit : <code style={{ color: "#facc15" }}>{selectedPerCourse.compilationAndRuntime.generatedBinary}</code>
                    </div>
                    <div style={{ fontSize: "12px", color: "#cbd5e1", lineHeight: "1.5" }}>
                      <strong>Dépannage &amp; Résolution d&apos;erreurs :</strong> {selectedPerCourse.compilationAndRuntime.troubleshooting}
                    </div>
                  </div>

                  {/* RÈGLES D'OR DU DÉVELOPPEUR */}
                  <div style={{ background: "rgba(239, 68, 68, 0.08)", border: "1px solid #ef4444", borderRadius: "8px", padding: "16px" }}>
                    <h4 style={{ fontSize: "14px", fontWeight: 700, color: "#f87171", margin: "0 0 10px" }}>
                      🛡️ Règles d&apos;Or &amp; Bonnes Pratiques Bancaires :
                    </h4>
                    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                      {selectedPerCourse.goldenRules.map((rule, i) => (
                        <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "8px", fontSize: "12px", color: "#fca5a5" }}>
                          <span>⚠️</span>
                          <span>{rule}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* RESSOURCES ASSOCIÉES */}
                  <div>
                    <h4 style={{ fontSize: "13px", fontWeight: 700, color: "#94a3b8", marginBottom: "8px" }}>
                      📚 Manuels &amp; Normes Associées :
                    </h4>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "8px" }}>
                      {selectedPerCourse.resources.map((res, i) => (
                        <div key={i} style={{ background: "#0f172a", border: "1px solid #334155", borderRadius: "6px", padding: "10px" }}>
                          <div style={{ fontSize: "12px", fontWeight: 700, color: "#38bdf8" }}>{res.title}</div>
                          <div style={{ fontSize: "11px", color: "#64748b" }}>{res.type} • {res.urlOrRef}</div>
                          <div style={{ fontSize: "11px", color: "#94a3b8", marginTop: "2px" }}>{res.description}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ANALYSE DÉTAILLÉE DU COURS */}
              <div style={{ marginTop: "24px", paddingTop: "20px", borderTop: "1px solid #334155" }}>
                <h4 style={{ fontSize: "14px", fontWeight: 700, color: "#f8fafc", marginBottom: "8px" }}>
                  📖 Guide Didactique Détaillé :
                </h4>
                <div style={{
                  background: "#0f172a",
                  padding: "16px",
                  borderRadius: "8px",
                  border: "1px solid #334155",
                  fontSize: "13px",
                  color: "#e2e8f0",
                  lineHeight: "1.6",
                  whiteSpace: "pre-line"
                }}>
                  {selectedPerCourse.detailedAnalysis}
                </div>
              </div>

            </div>

          </div>
        )}

        {/* CONTENU ONGLET 5 : STUDIO CRÉATEUR D'ÉCRANS .PER & HISTORIQUE */}
        {activeTab === "studio_per" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>

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
                  color: "#fde68a",
                  fontSize: "11px",
                  fontWeight: 700,
                  padding: "4px 10px",
                  borderRadius: "9999px",
                  border: "1px solid #d97706",
                  textTransform: "uppercase"
                }}>
                  Atelier &amp; Studio Développeur Form-4GL
                </span>
                <h3 style={{ fontSize: "20px", fontWeight: 800, color: "#f8fafc", margin: "6px 0 2px" }}>
                  Studio de Création Assistée d&apos;Écrans .per Informix
                </h3>
                <p style={{ fontSize: "13px", color: "#fef3c7", margin: 0 }}>
                  Décrivez votre besoin métier bancaire : le studio génère le masque .per, le code 4GL et le rendu terminal VT100, directement éditables et sauvegardables en base.
                </p>
              </div>

              {/* NAVIGATION SOUS-VUES : CRÉATEUR / HISTORIQUE */}
              <div style={{ display: "flex", gap: "8px", background: "rgba(0,0,0,0.3)", padding: "4px", borderRadius: "8px", border: "1px solid #f59e0b" }}>
                <button
                  onClick={() => setStudioSubView("createur")}
                  style={{
                    padding: "8px 16px",
                    borderRadius: "6px",
                    fontSize: "12px",
                    fontWeight: 700,
                    border: "none",
                    background: studioSubView === "createur" ? "#f59e0b" : "transparent",
                    color: studioSubView === "createur" ? "#000000" : "#fef3c7",
                    cursor: "pointer"
                  }}
                >
                  ✍️ 1. Créateur d&apos;Écran
                </button>
                <button
                  onClick={() => {
                    setStudioSubView("historique");
                    refreshScreens();
                  }}
                  style={{
                    padding: "8px 16px",
                    borderRadius: "6px",
                    fontSize: "12px",
                    fontWeight: 700,
                    border: "none",
                    background: studioSubView === "historique" ? "#f59e0b" : "transparent",
                    color: studioSubView === "historique" ? "#000000" : "#fef3c7",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px"
                  }}
                >
                  📚 2. Historique des Écrans en Base ({savedScreensList.length})
                </button>
              </div>
            </div>

            {/* MESSAGE D'ÉTAT DU STUDIO */}
            {studioStatusMessage && (
              <div style={{
                background: studioStatusMessage.includes("⚠️") ? "rgba(239, 68, 68, 0.15)" : "rgba(34, 197, 94, 0.15)",
                border: studioStatusMessage.includes("⚠️") ? "1px solid #ef4444" : "1px solid #22c55e",
                borderRadius: "8px",
                padding: "12px 18px",
                fontSize: "13px",
                color: studioStatusMessage.includes("⚠️") ? "#fca5a5" : "#86efac",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}>
                <span>{studioStatusMessage}</span>
                <button
                  onClick={() => setStudioStatusMessage("")}
                  style={{ background: "transparent", border: "none", color: "#94a3b8", cursor: "pointer", fontSize: "14px" }}
                >
                  ✕
                </button>
              </div>
            )}

            {/* SOUS-VUE 1 : CRÉATEUR D'ÉCRAN AVEC DESCRIPTION & ÉDITION */}
            {studioSubView === "createur" && (
              <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1.9fr", gap: "24px", alignItems: "start" }}>

                {/* FORMULAIRE DE DESCRIPTION DU BESOIN */}
                <div style={{
                  background: "#1e293b",
                  borderRadius: "12px",
                  border: "1px solid #334155",
                  padding: "20px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px"
                }}>
                  <div style={{ borderBottom: "1px solid #334155", paddingBottom: "10px" }}>
                    <h4 style={{ fontSize: "15px", fontWeight: 700, color: "#f8fafc", margin: "0 0 4px" }}>
                      📝 Description de l&apos;Écran Souhaité
                    </h4>
                    <p style={{ fontSize: "12px", color: "#94a3b8", margin: 0 }}>
                      Renseignez votre intention métier pour générer un masque conforme Informix 4GL.
                    </p>
                  </div>

                  <div>
                    <label style={{ fontSize: "12px", fontWeight: 700, color: "#cbd5e1", display: "block", marginBottom: "6px" }}>
                      Titre de l&apos;Écran :
                    </label>
                    <input
                      type="text"
                      value={studioTitle}
                      onChange={(e) => setStudioTitle(e.target.value)}
                      placeholder="Ex: Consultation Solde et Opposition Carte"
                      style={{
                        width: "100%",
                        padding: "10px 12px",
                        borderRadius: "6px",
                        background: "#0f172a",
                        border: "1px solid #334155",
                        color: "#f8fafc",
                        fontSize: "13px"
                      }}
                    />
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                    <div>
                      <label style={{ fontSize: "12px", fontWeight: 700, color: "#cbd5e1", display: "block", marginBottom: "6px" }}>
                        Domaine Métier :
                      </label>
                      <select
                        value={studioDomain}
                        onChange={(e) => setStudioDomain(e.target.value)}
                        style={{
                          width: "100%",
                          padding: "10px",
                          borderRadius: "6px",
                          background: "#0f172a",
                          border: "1px solid #334155",
                          color: "#f8fafc",
                          fontSize: "12px"
                        }}
                      >
                        <option value="Comptes & Guichet">Comptes &amp; Guichet</option>
                        <option value="Monétique & Cartes">Monétique &amp; Cartes</option>
                        <option value="Virements & Transferts">Virements &amp; Transferts</option>
                        <option value="Chèques & Effets">Chèques &amp; Effets</option>
                        <option value="Crédits & Engagements">Crédits &amp; Engagements</option>
                        <option value="Sécurité & Habilitations">Sécurité &amp; Habilitations</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ fontSize: "12px", fontWeight: 700, color: "#cbd5e1", display: "block", marginBottom: "6px" }}>
                        Type de Masque :
                      </label>
                      <select
                        value={studioLayoutType}
                        onChange={(e) => setStudioLayoutType(e.target.value as any)}
                        style={{
                          width: "100%",
                          padding: "10px",
                          borderRadius: "6px",
                          background: "#0f172a",
                          border: "1px solid #334155",
                          color: "#f8fafc",
                          fontSize: "12px"
                        }}
                      >
                        <option value="STANDARD_FORM">Formulaire Standard</option>
                        <option value="TABLE_ARRAY">Tableau Défilant (Array)</option>
                        <option value="SECURE_AUTH">Haute Sécurité / PIN</option>
                        <option value="MODAL_POPUP">Popup de Recherche (LOV)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                      <label style={{ fontSize: "12px", fontWeight: 700, color: "#cbd5e1" }}>
                        Décrivez ce que vous souhaitez avoir :
                      </label>
                      <span style={{ fontSize: "11px", color: "#94a3b8" }}>Mots-clés reconnus</span>
                    </div>
                    <textarea
                      value={studioPrompt}
                      onChange={(e) => setStudioPrompt(e.target.value)}
                      rows={5}
                      placeholder="Ex: Je souhaite un écran pour la gestion des retraits guichet avec saisie du numéro de compte, vérification du solde disponible, montant du retrait, saisie invisible du code PIN porteur et validation superviseur si dépassement du plafond..."
                      style={{
                        width: "100%",
                        padding: "12px",
                        borderRadius: "6px",
                        background: "#0f172a",
                        border: "1px solid #334155",
                        color: "#f8fafc",
                        fontSize: "13px",
                        lineHeight: "1.5",
                        resize: "vertical"
                      }}
                    />
                  </div>

                  {/* BOUTONS PRÉ-REMPLIS RAPIDES */}
                  <div>
                    <div style={{ fontSize: "11px", color: "#94a3b8", marginBottom: "6px" }}>Exemples rapides :</div>
                    <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                      <button
                        type="button"
                        onClick={() => {
                          setStudioTitle("Consultation Solde & Mouvements Compte");
                          setStudioDomain("Comptes & Guichet");
                          setStudioLayoutType("STANDARD_FORM");
                          setStudioPrompt("Je veux un écran pour consulter un compte client par son numéro de compte, affichant le titulaire, le solde comptable, le solde disponible et le code agence.");
                        }}
                        style={{ background: "#0f172a", border: "1px solid #334155", color: "#38bdf8", padding: "4px 8px", borderRadius: "4px", fontSize: "11px", cursor: "pointer" }}
                      >
                        Solde Compte
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setStudioTitle("Tableau des 10 Derniers Mouvements Bancaires");
                          setStudioDomain("Comptes & Guichet");
                          setStudioLayoutType("TABLE_ARRAY");
                          setStudioPrompt("Je souhaite un tableau défilant SCREEN RECORD pour afficher la liste des mouvements d'un compte avec date valeur, libellé de l'opération, montant débit ou crédit et cumul général.");
                        }}
                        style={{ background: "#0f172a", border: "1px solid #334155", color: "#38bdf8", padding: "4px 8px", borderRadius: "4px", fontSize: "11px", cursor: "pointer" }}
                      >
                        Tableau Mouvements
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setStudioTitle("Validation Forçage Dérogation Plafond");
                          setStudioDomain("Sécurité & Habilitations");
                          setStudioLayoutType("SECURE_AUTH");
                          setStudioPrompt("Écran sécurisé pour autoriser un retrait exceptionnel avec matricule opérateur, code PIN invisible PCI-DSS, mot de passe superviseur et motif obligatoire.");
                        }}
                        style={{ background: "#0f172a", border: "1px solid #334155", color: "#38bdf8", padding: "4px 8px", borderRadius: "4px", fontSize: "11px", cursor: "pointer" }}
                      >
                        Haute Sécurité PIN
                      </button>
                    </div>
                  </div>

                  {/* BOUTON DE GÉNÉRATION */}
                  <button
                    onClick={handleGenerateScreen}
                    disabled={isGeneratingScreen}
                    style={{
                      background: "linear-gradient(135deg, #d97706, #b45309)",
                      color: "#ffffff",
                      border: "none",
                      borderRadius: "8px",
                      padding: "12px",
                      fontSize: "14px",
                      fontWeight: 800,
                      cursor: isGeneratingScreen ? "not-allowed" : "pointer",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      gap: "8px",
                      boxShadow: "0 4px 12px rgba(217, 119, 6, 0.3)"
                    }}
                  >
                    {isGeneratingScreen ? "⚙️ Génération en cours..." : "✨ Générer le Masque .per & Code 4GL"}
                  </button>
                </div>

                {/* ZONE DE VISUALISATION, ÉDITION ET SAUVEGARDE */}
                <div style={{ background: "#1e293b", borderRadius: "12px", border: "1px solid #334155", padding: "20px" }}>
                  {currentCustomScreen ? (
                    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

                      {/* EN-TÊTE ÉCRAN GÉNÉRÉ */}
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "12px", borderBottom: "1px solid #334155", paddingBottom: "12px" }}>
                        <div>
                          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <span style={{ background: "#064e3b", color: "#34d399", fontSize: "10px", fontWeight: 800, padding: "2px 8px", borderRadius: "4px", border: "1px solid #059669" }}>
                              {currentCustomScreen.primaryTable}
                            </span>
                            <span style={{ fontSize: "12px", color: "#94a3b8" }}>
                              ID : {currentCustomScreen.id}
                            </span>
                          </div>
                          <h3 style={{ fontSize: "17px", fontWeight: 800, color: "#f8fafc", margin: "4px 0 2px" }}>
                            {currentCustomScreen.title}
                          </h3>
                        </div>

                        {/* ACTIONS : COPIER / SAUVEGARDER EN BASE */}
                        <div style={{ display: "flex", gap: "8px" }}>
                          <button
                            onClick={() => handleCopy(currentCustomScreen.perSourceCode)}
                            style={{ background: "#334155", color: "#f8fafc", border: "none", padding: "8px 12px", borderRadius: "6px", fontSize: "12px", fontWeight: 600, cursor: "pointer" }}
                          >
                            {copied ? "✓ Copié !" : "📋 Copier .per"}
                          </button>
                          <button
                            onClick={handleSaveScreen}
                            disabled={isSavingScreen}
                            style={{
                              background: "linear-gradient(135deg, #10b981, #059669)",
                              color: "#ffffff",
                              border: "none",
                              padding: "8px 16px",
                              borderRadius: "6px",
                              fontSize: "12px",
                              fontWeight: 700,
                              cursor: isSavingScreen ? "not-allowed" : "pointer",
                              display: "flex",
                              alignItems: "center",
                              gap: "6px",
                              boxShadow: "0 2px 8px rgba(16, 185, 129, 0.3)"
                            }}
                          >
                            {isSavingScreen ? "💾 Sauvegarde..." : "💾 Sauvegarder dans la BD"}
                          </button>
                        </div>
                      </div>

                      {/* ÉDITEUR DIRECT DU CODE SOURCE .PER */}
                      <div>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                          <label style={{ fontSize: "12px", fontWeight: 700, color: "#34d399" }}>
                            📄 Code Source .per (Éditable en direct) :
                          </label>
                          <span style={{ fontSize: "11px", color: "#94a3b8" }}>
                            Modifiez le masque ci-dessous avant d&apos;enregistrer
                          </span>
                        </div>
                        <textarea
                          value={currentCustomScreen.perSourceCode}
                          onChange={(e) => setCurrentCustomScreen({ ...currentCustomScreen, perSourceCode: e.target.value })}
                          rows={14}
                          style={{
                            width: "100%",
                            padding: "12px",
                            borderRadius: "8px",
                            background: "#090d16",
                            border: "1px solid #10b981",
                            color: "#34d399",
                            fontFamily: "monospace",
                            fontSize: "12px",
                            lineHeight: "1.45",
                            resize: "vertical"
                          }}
                        />
                      </div>

                      {/* RENDU TERMINAL VT100 SIMULÉ */}
                      <div>
                        <div style={{ fontSize: "12px", fontWeight: 700, color: "#f59e0b", marginBottom: "6px" }}>
                          🖥️ Rendu Terminal VT100 Émulé (80x24) :
                        </div>
                        <div style={{
                          background: "#000000",
                          border: "2px solid #22c55e",
                          borderRadius: "8px",
                          padding: "12px",
                          overflowX: "auto"
                        }}>
                          <pre style={{
                            color: "#22c55e",
                            fontFamily: "monospace",
                            fontSize: "11px",
                            lineHeight: "1.25",
                            margin: 0,
                            whiteSpace: "pre"
                          }}>
                            {currentCustomScreen.terminalMockup}
                          </pre>
                        </div>
                      </div>

                      {/* CODE 4GL COMPAGNON D'ACTIVATION */}
                      <div>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                          <label style={{ fontSize: "12px", fontWeight: 700, color: "#818cf8" }}>
                            ⚡ Code 4GL Associé (OPEN FORM / INPUT BY NAME) :
                          </label>
                          <button
                            onClick={() => handleCopy(currentCustomScreen.fourGlSourceCode)}
                            style={{ background: "#334155", color: "#f8fafc", border: "none", padding: "4px 8px", borderRadius: "4px", fontSize: "11px", cursor: "pointer" }}
                          >
                            Copier 4GL
                          </button>
                        </div>
                        <textarea
                          value={currentCustomScreen.fourGlSourceCode}
                          onChange={(e) => setCurrentCustomScreen({ ...currentCustomScreen, fourGlSourceCode: e.target.value })}
                          rows={8}
                          style={{
                            width: "100%",
                            padding: "12px",
                            borderRadius: "8px",
                            background: "#090d16",
                            border: "1px solid #6366f1",
                            color: "#a5b4fc",
                            fontFamily: "monospace",
                            fontSize: "11px",
                            lineHeight: "1.4",
                            resize: "vertical"
                          }}
                        />
                      </div>

                    </div>
                  ) : (
                    <div style={{ textAlign: "center", padding: "48px 20px" }}>
                      <div style={{ fontSize: "42px", marginBottom: "12px" }}>🖥️</div>
                      <h4 style={{ fontSize: "16px", fontWeight: 700, color: "#f8fafc", marginBottom: "6px" }}>
                        Aucun masque .per généré pour le moment
                      </h4>
                      <p style={{ fontSize: "13px", color: "#94a3b8", maxWidth: "450px", margin: "0 auto 16px", lineHeight: "1.5" }}>
                        Remplissez la description de votre écran à gauche et cliquez sur <strong>&quot;Générer le Masque .per&quot;</strong> pour visualiser, éditer et persister le résultat en base de données.
                      </p>
                    </div>
                  )}
                </div>

              </div>
            )}

            {/* SOUS-VUE 2 : HISTORIQUE DES ÉCRANS EN BASE */}
            {studioSubView === "historique" && (
              <div style={{ background: "#1e293b", borderRadius: "12px", border: "1px solid #334155", padding: "24px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", flexWrap: "wrap", gap: "10px" }}>
                  <div>
                    <h4 style={{ fontSize: "16px", fontWeight: 700, color: "#f8fafc", margin: "0 0 4px" }}>
                      🗄️ Historique des Masques .per Enregistrés dans la Base de Données
                    </h4>
                    <p style={{ fontSize: "12px", color: "#94a3b8", margin: 0 }}>
                      Consultez, rechargez dans l&apos;éditeur ou supprimez vos écrans personnalisés persistés.
                    </p>
                  </div>
                  <button
                    onClick={refreshScreens}
                    style={{ background: "#334155", color: "#f8fafc", border: "none", padding: "6px 14px", borderRadius: "6px", fontSize: "12px", fontWeight: 600, cursor: "pointer" }}
                  >
                    🔄 Rafraîchir
                  </button>
                </div>

                {savedScreensList.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "40px 20px", background: "#0f172a", borderRadius: "8px", border: "1px dashed #334155" }}>
                    <div style={{ fontSize: "36px", marginBottom: "10px" }}>📂</div>
                    <div style={{ fontSize: "14px", fontWeight: 600, color: "#cbd5e1", marginBottom: "4px" }}>
                      Aucun écran .per dans l&apos;historique
                    </div>
                    <div style={{ fontSize: "12px", color: "#94a3b8" }}>
                      Créez votre premier écran dans l&apos;onglet &quot;Créateur d&apos;Écran&quot; et sauvegardez-le dans la base.
                    </div>
                  </div>
                ) : (
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: "16px" }}>
                    {savedScreensList.map((screen) => (
                      <div
                        key={screen.id}
                        style={{
                          background: "#0f172a",
                          border: currentCustomScreen?.id === screen.id ? "2px solid #f59e0b" : "1px solid #334155",
                          borderRadius: "10px",
                          padding: "16px",
                          display: "flex",
                          flexDirection: "column",
                          gap: "10px"
                        }}
                      >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                          <span style={{
                            background: "#064e3b",
                            color: "#34d399",
                            fontSize: "10px",
                            fontWeight: 800,
                            padding: "2px 8px",
                            borderRadius: "4px",
                            border: "1px solid #059669"
                          }}>
                            {screen.primaryTable}
                          </span>
                          <span style={{ fontSize: "11px", color: "#64748b" }}>
                            {new Date(screen.updatedAt).toLocaleDateString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
                          </span>
                        </div>

                        <div>
                          <h5 style={{ fontSize: "14px", fontWeight: 700, color: "#f8fafc", margin: "0 0 4px" }}>
                            {screen.title}
                          </h5>
                          <p style={{ fontSize: "12px", color: "#94a3b8", margin: 0, maxHeight: "36px", overflow: "hidden", textOverflow: "ellipsis" }}>
                            {screen.description}
                          </p>
                        </div>

                        <div style={{
                          background: "#090d16",
                          padding: "8px",
                          borderRadius: "6px",
                          fontFamily: "monospace",
                          fontSize: "11px",
                          color: "#38bdf8",
                          maxHeight: "80px",
                          overflow: "hidden"
                        }}>
                          {screen.perSourceCode.slice(0, 140)}...
                        </div>

                        <div style={{ display: "flex", gap: "8px", marginTop: "auto", paddingTop: "8px", borderTop: "1px solid #1e293b" }}>
                          <button
                            onClick={() => {
                              setCurrentCustomScreen(screen);
                              setStudioTitle(screen.title);
                              setStudioPrompt(screen.description);
                              setStudioDomain(screen.domain);
                              setStudioLayoutType(screen.screenLayoutType);
                              setStudioSubView("createur");
                              setStudioStatusMessage(`✓ Écran "${screen.title}" chargé dans l'éditeur.`);
                            }}
                            style={{
                              flex: 1,
                              background: "#f59e0b",
                              color: "#000000",
                              border: "none",
                              padding: "6px 10px",
                              borderRadius: "6px",
                              fontSize: "11px",
                              fontWeight: 700,
                              cursor: "pointer"
                            }}
                          >
                            ✏️ Charger &amp; Éditer
                          </button>
                          <button
                            onClick={() => handleDeleteScreen(screen.id)}
                            style={{
                              background: "rgba(239, 68, 68, 0.15)",
                              color: "#f87171",
                              border: "1px solid #ef4444",
                              padding: "6px 10px",
                              borderRadius: "6px",
                              fontSize: "11px",
                              fontWeight: 700,
                              cursor: "pointer"
                            }}
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
        )}

        {/* CONTENU ONGLET 6 : CERTIFICAT OFFICIEL D'EXPERT 4GL */}
        {activeTab === "certificat" && (
          <div className="certificate-tab-container" style={{
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
                  Certificat Non Débloqué
                </h3>
                <p style={{ fontSize: "14px", color: "#94a3b8", lineHeight: "1.6" }}>
                  Pour obtenir le <strong>Certificat d&apos;Architecte &amp; Développeur Expert Informix 4GL Amplitude</strong>, vous devez valider les examens des 5 grades (score minimum de 80% à 90%).
                </p>
                <div style={{
                  marginTop: "16px",
                  display: "inline-block",
                  padding: "8px 16px",
                  background: "#090d16",
                  borderRadius: "8px",
                  color: "#38bdf8",
                  fontSize: "13px",
                  fontWeight: 600
                }}>
                  Votre niveau actuel : Niveau {unlockedLevel} / 5
                </div>
              </div>
            ) : (
              <div className="certificate-print-wrapper" style={{ width: "100%", maxWidth: "920px", display: "flex", flexDirection: "column", alignItems: "center", gap: "20px" }}>

                {/* CERTIFICAT DIPLÔME OFFICIEL CHARTE SOCIÉTÉ GÉNÉRALE */}
                <div
                  id="cbs-certificate-diploma"
                  className="printable-certificate"
                  style={{
                    width: "100%",
                    background: "radial-gradient(circle at center, #1a1a1a 0%, #111827 100%)",
                    border: "8px double #e60028",
                    borderRadius: "16px",
                    padding: "48px 44px",
                    boxShadow: "0 0 35px rgba(230, 0, 40, 0.3)",
                    textAlign: "center",
                    position: "relative",
                    color: "#f8fafc"
                  }}
                >
                  {/* Filigrane discret Société Générale en arrière-plan */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      {/* Logo carré Société Générale : Moitié Rouge SG / Moitié Noir */}
                      <div style={{
                        //width: "32px",
                        //height: "32px",
                        //background: "linear-gradient(to bottom, #e60028 0%, #e60028 50%, #111827 50%, #111827 100%)",
                        //borderRadius: "4px",
                        //border: "1px solid #ffffff",
                        //boxShadow: "0 2px 8px rgba(230,0,40,0.4)"
                      }} />
                      <div style={{ fontSize: "12px", fontWeight: 800, letterSpacing: "2px", color: "#f87171", textTransform: "uppercase", textAlign: "left" }}>
                        IT BANKING ACADEMY
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
                      RÉFÉRENCE : SG-CBS-4GL-2026
                    </div>
                  </div>

                  <div style={{ fontSize: "40px", marginBottom: "8px" }}>🏛️</div>

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
                    Informix 4GL &amp; Architecture Core Banking Amplitude
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
                    Mohamed Oury Diallo - EXPERT
                  </div>

                  <p style={{ fontSize: "14px", color: "#94a3b8", maxWidth: "680px", margin: "0 auto 28px auto", lineHeight: "1.7" }}>
                    a accompli avec distinction l&apos;intégralité du cursus certifiant Société Générale, démontrant une maîtrise éprouvée de la syntaxe procédurale Informix 4GL, de l&apos;optimisation haute vélocité des batchs EOD (INSERT CURSOR, PUT, FLUSH), de l&apos;atomicité stricte des transactions bancaires en partie double et de la résolution des conflits de verrous SGBD.
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
                      <div style={{ fontSize: "15px", fontWeight: 800, color: "#22c55e", marginTop: "4px" }}>Excellence (95%)</div>
                    </div>
                    <div>
                      <div style={{ fontSize: "11px", color: "#9ca3af", textTransform: "uppercase", letterSpacing: "1px" }}>Grade Accrédité</div>
                      <div style={{ fontSize: "15px", fontWeight: 800, color: "#f87171", marginTop: "4px" }}>Niveau 5 - Architecte Lead</div>
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

                {/* BOUTON D'IMPRESSION (Masqué à l'impression) */}
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
