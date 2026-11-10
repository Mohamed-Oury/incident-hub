"use client";

import { useState } from "react";
import { AppShell } from "@/modules/layout/AppShell";
import { useSubsidiary } from "@/modules/layout/SubsidiaryContext";
import {
  WeeklyActivityReport,
  ActivityItem,
  DayProgress,
  DifficultyActionPair,
  NextWeekGoal,
  ActivityStatus,
} from "@/modules/activity-report/types";
import {
  SAMPLE_PROJET_ALPHA,
  SAMPLE_SGABS_REPORT,
  SAMPLE_AFG_REPORT,
} from "@/modules/activity-report/templates";
import {
  FileText,
  Presentation,
  Printer,
  Plus,
  Trash2,
  CheckCircle2,
  Clock,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Building2,
  Calendar,
  User,
  ArrowRight,
  ShieldCheck,
  BarChart3,
  ListTodo,
  CalendarDays,
} from "lucide-react";

export default function ActivityReportPage() {
  const { isAFG } = useSubsidiary();

  // Entité par défaut calquée sur la filiale active
  const [report, setReport] = useState<WeeklyActivityReport>(
    isAFG ? { ...SAMPLE_AFG_REPORT } : { ...SAMPLE_SGABS_REPORT }
  );

  const [activeTab, setActiveTab] = useState<"FORM" | "PREVIEW">("FORM");
  const [isExportingPptx, setIsExportingPptx] = useState(false);
  const [isExportingPdf, setIsExportingPdf] = useState(false);

  const isCurrentAFG = report.subsidiary === "AFG";

  // Thème dynamique selon l'entité
  const theme = isCurrentAFG
    ? {
        primary: "#00a800",
        primaryDark: "#15803d",
        accent: "#10b981",
        bgLight: "#f0fdf4",
        border: "#bbf7d0",
        textOnPrimary: "#ffffff",
        badgeBg: "rgba(0, 168, 0, 0.12)",
        entityName: "AFG Bank (Atlantic Financial Group)",
        entityShort: "AFG Bank",
      }
    : {
        primary: "#e60028",
        primaryDark: "#99001b",
        accent: "#f43f5e",
        bgLight: "#fef2f2",
        border: "#fecaca",
        textOnPrimary: "#ffffff",
        badgeBg: "rgba(230, 0, 40, 0.12)",
        entityName: "SGABS (Société Générale)",
        entityShort: "SGABS",
      };

  // Bascule d'entité
  const handleSwitchEntity = (entity: "SGABS" | "AFG") => {
    if (entity === "AFG") {
      setReport({ ...SAMPLE_AFG_REPORT });
    } else {
      setReport({ ...SAMPLE_SGABS_REPORT });
    }
  };

  // Charger le modèle Projet Alpha fourni en pièce jointe
  const handleLoadAlphaTemplate = () => {
    setReport({ ...SAMPLE_PROJET_ALPHA, subsidiary: report.subsidiary });
  };

  // Réinitialiser vierge
  const handleResetBlank = () => {
    setReport({
      id: `CRA-${Date.now()}`,
      subsidiary: report.subsidiary,
      projectName: "",
      weekNumber: 45,
      year: 2026,
      startDate: "2 novembre 2026",
      endDate: "6 novembre 2026",
      authorName: "Mohamed Diallo",
      authorRole: "Lead Support & Exploitation Monétique",
      recipient: "Direction & Management",
      executiveSummary: "",
      deliveredTasksText: "0 / 0",
      deliveredTasksLabel: "tâches livrées",
      completionRateText: "0 %",
      completionRateLabel: "taux de réalisation",
      vigilancePointsText: "0",
      vigilancePointsLabel: "point de vigilance",
      activities: [],
      dailyProgress: [
        { dayName: "Lundi", planned: 0, completed: 0 },
        { dayName: "Mardi", planned: 0, completed: 0 },
        { dayName: "Mercredi", planned: 0, completed: 0 },
        { dayName: "Jeudi", planned: 0, completed: 0 },
        { dayName: "Vendredi", planned: 0, completed: 0 },
      ],
      dailyTakeaway: "",
      difficultiesAndActions: [],
      nextWeekGoals: [],
    });
  };

  // Gestion des activités (Tableau Slide 3)
  const handleAddActivity = () => {
    const newAct: ActivityItem = {
      id: `act-${Date.now()}`,
      name: "Nouvelle activité",
      owner: report.authorName.split(" ")[0] || "Mohamed",
      status: "En cours",
      progress: 50,
    };
    setReport((prev) => ({ ...prev, activities: [...prev.activities, newAct] }));
  };

  const handleUpdateActivity = (index: number, updates: Partial<ActivityItem>) => {
    setReport((prev) => {
      const copy = [...prev.activities];
      copy[index] = { ...copy[index], ...updates };
      return { ...prev, activities: copy };
    });
  };

  const handleDeleteActivity = (index: number) => {
    setReport((prev) => {
      const copy = prev.activities.filter((_, i) => i !== index);
      return { ...prev, activities: copy };
    });
  };

  // Gestion du suivi journalier (Slide 4)
  const handleUpdateDaily = (index: number, updates: Partial<DayProgress>) => {
    setReport((prev) => {
      const copy = [...prev.dailyProgress];
      copy[index] = { ...copy[index], ...updates };
      return { ...prev, dailyProgress: copy };
    });
  };

  // Gestion des difficultés & actions (Slide 5)
  const handleAddDifficultyAction = () => {
    const newPair: DifficultyActionPair = {
      id: `diff-${Date.now()}`,
      difficulty: "Difficulté opérationnelle",
      correctiveAction: "Action corrective ciblée",
    };
    setReport((prev) => ({
      ...prev,
      difficultiesAndActions: [...prev.difficultiesAndActions, newPair],
    }));
  };

  const handleUpdateDifficultyAction = (index: number, updates: Partial<DifficultyActionPair>) => {
    setReport((prev) => {
      const copy = [...prev.difficultiesAndActions];
      copy[index] = { ...copy[index], ...updates };
      return { ...prev, difficultiesAndActions: copy };
    });
  };

  const handleDeleteDifficultyAction = (index: number) => {
    setReport((prev) => ({
      ...prev,
      difficultiesAndActions: prev.difficultiesAndActions.filter((_, i) => i !== index),
    }));
  };

  // Gestion de la semaine prochaine (Slide 6)
  const handleAddGoal = () => {
    const nextId = (report.nextWeekGoals.length > 0
      ? Math.max(...report.nextWeekGoals.map((g) => g.id))
      : 0) + 1;
    const newGoal: NextWeekGoal = {
      id: nextId,
      title: "Nouvel objectif",
      deadline: "Vendredi",
    };
    setReport((prev) => ({
      ...prev,
      nextWeekGoals: [...prev.nextWeekGoals, newGoal],
    }));
  };

  const handleUpdateGoal = (index: number, updates: Partial<NextWeekGoal>) => {
    setReport((prev) => {
      const copy = [...prev.nextWeekGoals];
      copy[index] = { ...copy[index], ...updates };
      return { ...prev, nextWeekGoals: copy };
    });
  };

  const handleDeleteGoal = (index: number) => {
    setReport((prev) => ({
      ...prev,
      nextWeekGoals: prev.nextWeekGoals.filter((_, i) => i !== index),
    }));
  };

  // Téléchargement PowerPoint (.pptx)
  const handleExportPptx = async () => {
    try {
      setIsExportingPptx(true);
      const res = await fetch("/api/export/activity-report/powerpoint", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ report }),
      });

      if (!res.ok) throw new Error("Échec de la génération PowerPoint");

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `CRA_${report.subsidiary}_Semaine_${report.weekNumber}_${report.year}.pptx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      alert(`Erreur export PowerPoint : ${err.message}`);
    } finally {
      setIsExportingPptx(false);
    }
  };

  // Téléchargement PDF (.pdf)
  const handleExportPdf = async () => {
    try {
      setIsExportingPdf(true);
      const res = await fetch("/api/export/activity-report/pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ report }),
      });

      if (!res.ok) throw new Error("Échec de la génération PDF");

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `CRA_${report.subsidiary}_Semaine_${report.weekNumber}_${report.year}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      alert(`Erreur export PDF : ${err.message}`);
    } finally {
      setIsExportingPdf(false);
    }
  };

  return (
    <AppShell>
      <div style={{ maxWidth: "1400px", margin: "0 auto", width: "100%" }}>
        {/* ========================================================================= */}
        {/* BANDEAU SUPÉRIEUR & SÉLECTEUR D'ENTITÉ                                   */}
        {/* ========================================================================= */}
        <div
          style={{
            background: "linear-gradient(135deg, #0b1120 0%, #1e293b 100%)",
            borderRadius: "16px",
            padding: "1.5rem 1.75rem",
            marginBottom: "1.5rem",
            border: "1px solid #334155",
            color: "#ffffff",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "1.25rem",
          }}
        >
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.4rem" }}>
              <span
                style={{
                  fontSize: "0.72rem",
                  fontWeight: 900,
                  textTransform: "uppercase",
                  padding: "3px 10px",
                  borderRadius: "6px",
                  background: theme.primary,
                  color: "#ffffff",
                  letterSpacing: "0.08em",
                }}
              >
                {theme.entityShort}
              </span>
              <span style={{ fontSize: "0.85rem", color: "#94a3b8" }}>
                Générateur Exécutif Hebdomadaire (CRA)
              </span>
            </div>
            <h1 style={{ fontSize: "1.7rem", fontWeight: 800, margin: 0, letterSpacing: "-0.02em" }}>
              Compte Rendu d&apos;Activités Hebdomadaire
            </h1>
            <p style={{ fontSize: "0.9rem", color: "#94a3b8", margin: "0.3rem 0 0" }}>
              Modèle conforme PowerPoint (Synthèse, Activités, Suivi journalier, Difficultés &amp; S+1).
            </p>
          </div>

          {/* SÉLECTEUR ENTITÉ BANCAIRE (SGABS vs AFG) */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "0.5rem" }}>
            <div style={{ fontSize: "0.75rem", color: "#94a3b8", fontWeight: 600 }}>
              SÉLECTIONNEZ L&apos;ENTITÉ CIBLE :
            </div>
            <div
              style={{
                display: "inline-flex",
                background: "rgba(15, 23, 42, 0.8)",
                padding: "4px",
                borderRadius: "12px",
                border: "1px solid #334155",
                gap: "4px",
              }}
            >
              <button
                type="button"
                onClick={() => handleSwitchEntity("SGABS")}
                style={{
                  padding: "0.45rem 1rem",
                  borderRadius: "8px",
                  border: "none",
                  fontWeight: !isCurrentAFG ? 800 : 600,
                  fontSize: "0.82rem",
                  cursor: "pointer",
                  background: !isCurrentAFG ? "#e60028" : "transparent",
                  color: !isCurrentAFG ? "#ffffff" : "#94a3b8",
                  transition: "all 0.15s ease",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.4rem",
                }}
              >
                <span>🔴</span>
                <span>SGABS (SocGen)</span>
              </button>

              <button
                type="button"
                onClick={() => handleSwitchEntity("AFG")}
                style={{
                  padding: "0.45rem 1rem",
                  borderRadius: "8px",
                  border: "none",
                  fontWeight: isCurrentAFG ? 800 : 600,
                  fontSize: "0.82rem",
                  cursor: "pointer",
                  background: isCurrentAFG ? "#00a800" : "transparent",
                  color: isCurrentAFG ? "#ffffff" : "#94a3b8",
                  transition: "all 0.15s ease",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.4rem",
                }}
              >
                <span>🟢</span>
                <span>AFG Bank</span>
              </button>
            </div>
          </div>
        </div>

        {/* BARRE D'ACTIONS & TABS */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "1rem",
            marginBottom: "1.5rem",
          }}
        >
          {/* TABS FORM vs PREVIEW */}
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button
              type="button"
              onClick={() => setActiveTab("FORM")}
              style={{
                padding: "0.6rem 1.25rem",
                borderRadius: "10px",
                border: "1px solid",
                borderColor: activeTab === "FORM" ? theme.primary : "#e2e8f0",
                background: activeTab === "FORM" ? theme.primary : "#ffffff",
                color: activeTab === "FORM" ? "#ffffff" : "#334155",
                fontWeight: 700,
                fontSize: "0.88rem",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "0.45rem",
              }}
            >
              <span>✏️</span>
              <span>Saisie du Rapport</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("PREVIEW")}
              style={{
                padding: "0.6rem 1.25rem",
                borderRadius: "10px",
                border: "1px solid",
                borderColor: activeTab === "PREVIEW" ? theme.primary : "#e2e8f0",
                background: activeTab === "PREVIEW" ? theme.primary : "#ffffff",
                color: activeTab === "PREVIEW" ? "#ffffff" : "#334155",
                fontWeight: 700,
                fontSize: "0.88rem",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "0.45rem",
              }}
            >
              <span>👁️</span>
              <span>Aperçu Document (A4)</span>
            </button>
          </div>

          {/* EXPORTS ET ACTIONS RAPIDES */}
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            <button
              type="button"
              onClick={handleLoadAlphaTemplate}
              title="Charger les données exactes de la pièce jointe (Projet Alpha)"
              style={{
                padding: "0.55rem 0.9rem",
                borderRadius: "8px",
                border: "1px solid #cbd5e1",
                background: "#f8fafc",
                color: "#334155",
                fontWeight: 600,
                fontSize: "0.8rem",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "0.4rem",
              }}
            >
              <Sparkles size={14} color="#f59e0b" />
              <span>Modèle Pièce Jointe</span>
            </button>

            <button
              type="button"
              onClick={handleResetBlank}
              title="Vider le formulaire"
              style={{
                padding: "0.55rem 0.9rem",
                borderRadius: "8px",
                border: "1px solid #cbd5e1",
                background: "#f8fafc",
                color: "#64748b",
                fontWeight: 600,
                fontSize: "0.8rem",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "0.4rem",
              }}
            >
              <RotateCcw size={14} />
              <span>Vierge</span>
            </button>

            {/* EXPORT POWERPOINT (.pptx) */}
            <button
              type="button"
              onClick={handleExportPptx}
              disabled={isExportingPptx}
              style={{
                padding: "0.55rem 1.1rem",
                borderRadius: "10px",
                border: "none",
                background: "linear-align(135deg, #d97706, #b45309)",
                backgroundColor: "#b45309",
                color: "#ffffff",
                fontWeight: 700,
                fontSize: "0.88rem",
                cursor: isExportingPptx ? "wait" : "pointer",
                display: "flex",
                alignItems: "center",
                gap: "0.45rem",
                boxShadow: "0 2px 6px rgba(180, 83, 9, 0.3)",
              }}
            >
              <Presentation size={16} />
              <span>{isExportingPptx ? "Génération PPTX..." : "PowerPoint (.pptx)"}</span>
            </button>

            {/* EXPORT PDF (.pdf) */}
            <button
              type="button"
              onClick={handleExportPdf}
              disabled={isExportingPdf}
              style={{
                padding: "0.55rem 1.1rem",
                borderRadius: "10px",
                border: "none",
                background: theme.primary,
                color: "#ffffff",
                fontWeight: 700,
                fontSize: "0.88rem",
                cursor: isExportingPdf ? "wait" : "pointer",
                display: "flex",
                alignItems: "center",
                gap: "0.45rem",
                boxShadow: `0 2px 6px ${theme.primary}40`,
              }}
            >
              <FileText size={16} />
              <span>{isExportingPdf ? "Génération PDF..." : "Télécharger PDF"}</span>
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* CONTENU PRINCIPAL : MODE FORMULAIRE vs APERÇU                            */}
        {/* ========================================================================= */}
        {activeTab === "FORM" ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            {/* 1. MÉTADONNÉES & TITRE */}
            <div
              style={{
                background: "#ffffff",
                borderRadius: "14px",
                padding: "1.5rem",
                border: "1px solid #e2e8f0",
                boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
              }}
            >
              <h2 style={{ fontSize: "1.1rem", fontWeight: 800, color: "#0f172a", margin: "0 0 1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <Building2 size={18} color={theme.primary} />
                <span>Identification du Rapport &amp; Contexte</span>
              </h2>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1rem" }}>
                <div>
                  <label style={{ fontSize: "0.78rem", fontWeight: 700, color: "#475569", display: "block", marginBottom: "0.3rem" }}>
                    PROJET / MISSION
                  </label>
                  <input
                    type="text"
                    value={report.projectName}
                    onChange={(e) => setReport({ ...report, projectName: e.target.value })}
                    placeholder="Ex: Projet Alpha ou Monétique SGABS"
                    style={{
                      width: "100%",
                      padding: "0.55rem 0.75rem",
                      borderRadius: "8px",
                      border: "1px solid #cbd5e1",
                      fontSize: "0.88rem",
                      fontWeight: 600,
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: "0.78rem", fontWeight: 700, color: "#475569", display: "block", marginBottom: "0.3rem" }}>
                    SEMAINE N° &amp; ANNÉE
                  </label>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <input
                      type="number"
                      value={report.weekNumber}
                      onChange={(e) => setReport({ ...report, weekNumber: Number(e.target.value) })}
                      style={{
                        width: "80px",
                        padding: "0.55rem 0.75rem",
                        borderRadius: "8px",
                        border: "1px solid #cbd5e1",
                        fontSize: "0.88rem",
                        fontWeight: 600,
                      }}
                    />
                    <input
                      type="number"
                      value={report.year}
                      onChange={(e) => setReport({ ...report, year: Number(e.target.value) })}
                      style={{
                        width: "90px",
                        padding: "0.55rem 0.75rem",
                        borderRadius: "8px",
                        border: "1px solid #cbd5e1",
                        fontSize: "0.88rem",
                        fontWeight: 600,
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: "0.78rem", fontWeight: 700, color: "#475569", display: "block", marginBottom: "0.3rem" }}>
                    PÉRIODE (DU ... AU ...)
                  </label>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <input
                      type="text"
                      value={report.startDate}
                      onChange={(e) => setReport({ ...report, startDate: e.target.value })}
                      placeholder="2 novembre 2026"
                      style={{
                        width: "100%",
                        padding: "0.55rem 0.75rem",
                        borderRadius: "8px",
                        border: "1px solid #cbd5e1",
                        fontSize: "0.85rem",
                      }}
                    />
                    <input
                      type="text"
                      value={report.endDate}
                      onChange={(e) => setReport({ ...report, endDate: e.target.value })}
                      placeholder="6 novembre 2026"
                      style={{
                        width: "100%",
                        padding: "0.55rem 0.75rem",
                        borderRadius: "8px",
                        border: "1px solid #cbd5e1",
                        fontSize: "0.85rem",
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: "0.78rem", fontWeight: 700, color: "#475569", display: "block", marginBottom: "0.3rem" }}>
                    ÉMETTEUR (NOM &amp; RÔLE)
                  </label>
                  <input
                    type="text"
                    value={report.authorName}
                    onChange={(e) => setReport({ ...report, authorName: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "0.55rem 0.75rem",
                      borderRadius: "8px",
                      border: "1px solid #cbd5e1",
                      fontSize: "0.85rem",
                      marginBottom: "0.3rem",
                    }}
                  />
                  <input
                    type="text"
                    value={report.authorRole}
                    onChange={(e) => setReport({ ...report, authorRole: e.target.value })}
                    placeholder="Rôle / Titre"
                    style={{
                      width: "100%",
                      padding: "0.45rem 0.75rem",
                      borderRadius: "8px",
                      border: "1px solid #cbd5e1",
                      fontSize: "0.78rem",
                      color: "#64748b",
                    }}
                  />
                </div>

                <div style={{ gridColumn: "1 / -1" }}>
                  <label style={{ fontSize: "0.78rem", fontWeight: 700, color: "#475569", display: "block", marginBottom: "0.3rem" }}>
                    DESTINATAIRE(S)
                  </label>
                  <input
                    type="text"
                    value={report.recipient}
                    onChange={(e) => setReport({ ...report, recipient: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "0.55rem 0.75rem",
                      borderRadius: "8px",
                      border: "1px solid #cbd5e1",
                      fontSize: "0.85rem",
                    }}
                  />
                </div>
              </div>
            </div>

            {/* 2. SLIDE 2 : SYNTHÈSE DE LA SEMAINE (MÉTRIQUES & À RETENIR) */}
            <div
              style={{
                background: "#ffffff",
                borderRadius: "14px",
                padding: "1.5rem",
                border: "1px solid #e2e8f0",
                boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
              }}
            >
              <h2 style={{ fontSize: "1.1rem", fontWeight: 800, color: "#0f172a", margin: "0 0 1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <BarChart3 size={18} color={theme.primary} />
                <span>Slide 2 · Synthèse de la semaine (Métriques &amp; Synthèse)</span>
              </h2>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1rem", marginBottom: "1.25rem" }}>
                {/* Métrique 1 */}
                <div style={{ background: "#f8fafc", padding: "1rem", borderRadius: "10px", border: "1px solid #cbd5e1" }}>
                  <label style={{ fontSize: "0.72rem", fontWeight: 700, color: "#64748b", display: "block", marginBottom: "0.2rem" }}>
                    VALEUR MÉTRIQUE 1
                  </label>
                  <input
                    type="text"
                    value={report.deliveredTasksText}
                    onChange={(e) => setReport({ ...report, deliveredTasksText: e.target.value })}
                    placeholder="9 / 10"
                    style={{ width: "100%", padding: "0.4rem 0.6rem", fontSize: "1.2rem", fontWeight: 800, borderRadius: "6px", border: "1px solid #cbd5e1", marginBottom: "0.4rem" }}
                  />
                  <input
                    type="text"
                    value={report.deliveredTasksLabel}
                    onChange={(e) => setReport({ ...report, deliveredTasksLabel: e.target.value })}
                    placeholder="tâches livrées"
                    style={{ width: "100%", padding: "0.3rem 0.5rem", fontSize: "0.78rem", color: "#64748b", borderRadius: "6px", border: "1px solid #e2e8f0" }}
                  />
                </div>

                {/* Métrique 2 */}
                <div style={{ background: "#f0fdf4", padding: "1rem", borderRadius: "10px", border: "1px solid #86efac" }}>
                  <label style={{ fontSize: "0.72rem", fontWeight: 700, color: "#166534", display: "block", marginBottom: "0.2rem" }}>
                    VALEUR MÉTRIQUE 2 (TAUX)
                  </label>
                  <input
                    type="text"
                    value={report.completionRateText}
                    onChange={(e) => setReport({ ...report, completionRateText: e.target.value })}
                    placeholder="90 %"
                    style={{ width: "100%", padding: "0.4rem 0.6rem", fontSize: "1.2rem", fontWeight: 800, color: "#166534", borderRadius: "6px", border: "1px solid #86efac", marginBottom: "0.4rem" }}
                  />
                  <input
                    type="text"
                    value={report.completionRateLabel}
                    onChange={(e) => setReport({ ...report, completionRateLabel: e.target.value })}
                    placeholder="taux de réalisation"
                    style={{ width: "100%", padding: "0.3rem 0.5rem", fontSize: "0.78rem", color: "#166534", borderRadius: "6px", border: "1px solid #86efac" }}
                  />
                </div>

                {/* Métrique 3 */}
                <div style={{ background: "#fffbeb", padding: "1rem", borderRadius: "10px", border: "1px solid #fde68a" }}>
                  <label style={{ fontSize: "0.72rem", fontWeight: 700, color: "#b45309", display: "block", marginBottom: "0.2rem" }}>
                    VALEUR MÉTRIQUE 3 (VIGILANCE)
                  </label>
                  <input
                    type="text"
                    value={report.vigilancePointsText}
                    onChange={(e) => setReport({ ...report, vigilancePointsText: e.target.value })}
                    placeholder="1"
                    style={{ width: "100%", padding: "0.4rem 0.6rem", fontSize: "1.2rem", fontWeight: 800, color: "#d97706", borderRadius: "6px", border: "1px solid #fde68a", marginBottom: "0.4rem" }}
                  />
                  <input
                    type="text"
                    value={report.vigilancePointsLabel}
                    onChange={(e) => setReport({ ...report, vigilancePointsLabel: e.target.value })}
                    placeholder="point de vigilance"
                    style={{ width: "100%", padding: "0.3rem 0.5rem", fontSize: "0.78rem", color: "#b45309", borderRadius: "6px", border: "1px solid #fde68a" }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: "0.8rem", fontWeight: 700, color: "#334155", display: "block", marginBottom: "0.4rem" }}>
                  MESSAGE DE SYNTHÈSE (À RETENIR DE LA SEMAINE) :
                </label>
                <textarea
                  rows={3}
                  value={report.executiveSummary}
                  onChange={(e) => setReport({ ...report, executiveSummary: e.target.value })}
                  placeholder="Semaine conforme au plan ; une tâche est reportée à la semaine prochaine."
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    borderRadius: "8px",
                    border: "1px solid #cbd5e1",
                    fontSize: "0.9rem",
                    lineHeight: 1.5,
                  }}
                />
              </div>
            </div>

            {/* 3. SLIDE 3 : ACTIVITÉS RÉALISÉES (TABLEAU 4 COLONNES) */}
            <div
              style={{
                background: "#ffffff",
                borderRadius: "14px",
                padding: "1.5rem",
                border: "1px solid #e2e8f0",
                boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                <h2 style={{ fontSize: "1.1rem", fontWeight: 800, color: "#0f172a", margin: 0, display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <ListTodo size={18} color={theme.primary} />
                  <span>Slide 3 · Activités réalisées ({report.activities.length})</span>
                </h2>
                <button
                  type="button"
                  onClick={handleAddActivity}
                  style={{
                    padding: "0.4rem 0.85rem",
                    borderRadius: "8px",
                    border: "none",
                    background: theme.primary,
                    color: "#ffffff",
                    fontSize: "0.8rem",
                    fontWeight: 700,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.3rem",
                  }}
                >
                  <Plus size={14} />
                  <span>Ajouter une Activité</span>
                </button>
              </div>

              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.86rem" }}>
                  <thead>
                    <tr style={{ background: "#0f172a", color: "#ffffff", textAlign: "left" }}>
                      <th style={{ padding: "0.6rem 0.8rem", borderRadius: "6px 0 0 0" }}>Activité</th>
                      <th style={{ padding: "0.6rem 0.8rem", width: "160px" }}>Responsable</th>
                      <th style={{ padding: "0.6rem 0.8rem", width: "150px" }}>Statut</th>
                      <th style={{ padding: "0.6rem 0.8rem", width: "140px" }}>Avancement (%)</th>
                      <th style={{ padding: "0.6rem 0.8rem", width: "50px", borderRadius: "0 6px 0 0" }}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {report.activities.map((act, idx) => (
                      <tr key={act.id} style={{ borderBottom: "1px solid #e2e8f0", background: idx % 2 === 0 ? "#ffffff" : "#f8fafc" }}>
                        <td style={{ padding: "0.5rem 0.8rem" }}>
                          <input
                            type="text"
                            value={act.name}
                            onChange={(e) => handleUpdateActivity(idx, { name: e.target.value })}
                            style={{ width: "100%", padding: "0.35rem 0.5rem", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "0.85rem" }}
                          />
                        </td>
                        <td style={{ padding: "0.5rem 0.8rem" }}>
                          <input
                            type="text"
                            value={act.owner}
                            onChange={(e) => handleUpdateActivity(idx, { owner: e.target.value })}
                            placeholder="Awa K."
                            style={{ width: "100%", padding: "0.35rem 0.5rem", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "0.85rem" }}
                          />
                        </td>
                        <td style={{ padding: "0.5rem 0.8rem" }}>
                          <select
                            value={act.status}
                            onChange={(e) => handleUpdateActivity(idx, { status: e.target.value as ActivityStatus })}
                            style={{ width: "100%", padding: "0.35rem 0.5rem", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "0.82rem", fontWeight: 600 }}
                          >
                            <option value="Terminé">Terminé</option>
                            <option value="En cours">En cours</option>
                            <option value="Reporté">Reporté</option>
                            <option value="Bloqué">Bloqué</option>
                            <option value="Non commencé">Non commencé</option>
                          </select>
                        </td>
                        <td style={{ padding: "0.5rem 0.8rem" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                            <input
                              type="number"
                              min={0}
                              max={100}
                              value={act.progress}
                              onChange={(e) => handleUpdateActivity(idx, { progress: Number(e.target.value) })}
                              style={{ width: "65px", padding: "0.35rem 0.5rem", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "0.85rem", fontWeight: 700 }}
                            />
                            <span style={{ fontSize: "0.8rem", color: "#64748b" }}>%</span>
                          </div>
                        </td>
                        <td style={{ padding: "0.5rem 0.8rem", textAlign: "center" }}>
                          <button
                            type="button"
                            onClick={() => handleDeleteActivity(idx)}
                            style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer", padding: "4px" }}
                            title="Supprimer"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* 4. SLIDE 4 : SUIVI JOURNALIER (PLANIFIÉ VS RÉALISÉ) */}
            <div
              style={{
                background: "#ffffff",
                borderRadius: "14px",
                padding: "1.5rem",
                border: "1px solid #e2e8f0",
                boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
              }}
            >
              <h2 style={{ fontSize: "1.1rem", fontWeight: 800, color: "#0f172a", margin: "0 0 1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <CalendarDays size={18} color={theme.primary} />
                <span>Slide 4 · Tâches planifiées vs réalisées par jour</span>
              </h2>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: "0.8rem", marginBottom: "1.25rem" }}>
                {report.dailyProgress.map((day, idx) => (
                  <div key={day.dayName} style={{ background: "#f8fafc", padding: "0.9rem", borderRadius: "10px", border: "1px solid #cbd5e1", textAlign: "center" }}>
                    <div style={{ fontWeight: 800, fontSize: "0.92rem", color: "#1e293b", marginBottom: "0.5rem" }}>
                      {day.dayName}
                    </div>
                    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "0.3rem", marginBottom: "0.4rem" }}>
                      <input
                        type="number"
                        min={0}
                        value={day.completed}
                        onChange={(e) => handleUpdateDaily(idx, { completed: Number(e.target.value) })}
                        title="Réalisé"
                        style={{ width: "50px", textAlign: "center", fontWeight: 800, padding: "0.3rem", borderRadius: "6px", border: "1px solid #cbd5e1" }}
                      />
                      <span style={{ fontWeight: 800, color: "#64748b" }}>/</span>
                      <input
                        type="number"
                        min={0}
                        value={day.planned}
                        onChange={(e) => handleUpdateDaily(idx, { planned: Number(e.target.value) })}
                        title="Planifié"
                        style={{ width: "50px", textAlign: "center", fontWeight: 800, padding: "0.3rem", borderRadius: "6px", border: "1px solid #cbd5e1" }}
                      />
                    </div>
                    <div style={{ fontSize: "0.75rem", color: day.completed >= day.planned ? "#15803d" : "#d97706", fontWeight: 700 }}>
                      {day.planned > 0 ? Math.round((day.completed / day.planned) * 100) : 100} % réalisé
                    </div>
                  </div>
                ))}
              </div>

              <div>
                <label style={{ fontSize: "0.8rem", fontWeight: 700, color: "#334155", display: "block", marginBottom: "0.4rem" }}>
                  À RETENIR DU RYTHME JOURNALIER :
                </label>
                <textarea
                  rows={2}
                  value={report.dailyTakeaway}
                  onChange={(e) => setReport({ ...report, dailyTakeaway: e.target.value })}
                  placeholder="Rythme tenu sur 4 jours sur 5. Une tâche glissée le mercredi..."
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    borderRadius: "8px",
                    border: "1px solid #cbd5e1",
                    fontSize: "0.88rem",
                  }}
                />
              </div>
            </div>

            {/* 5. SLIDE 5 : DIFFICULTÉS ET ACTIONS CORRECTIVES (2 COLONNES) */}
            <div
              style={{
                background: "#ffffff",
                borderRadius: "14px",
                padding: "1.5rem",
                border: "1px solid #e2e8f0",
                boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                <h2 style={{ fontSize: "1.1rem", fontWeight: 800, color: "#0f172a", margin: 0, display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <AlertTriangle size={18} color="#d97706" />
                  <span>Slide 5 · Difficultés et actions correctives ({report.difficultiesAndActions.length})</span>
                </h2>
                <button
                  type="button"
                  onClick={handleAddDifficultyAction}
                  style={{
                    padding: "0.4rem 0.85rem",
                    borderRadius: "8px",
                    border: "none",
                    background: "#0284c7",
                    color: "#ffffff",
                    fontSize: "0.8rem",
                    fontWeight: 700,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.3rem",
                  }}
                >
                  <Plus size={14} />
                  <span>Ajouter une Difficulté / Action</span>
                </button>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {report.difficultiesAndActions.map((pair, idx) => (
                  <div
                    key={pair.id}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr 40px",
                      gap: "0.75rem",
                      alignItems: "center",
                      background: "#f8fafc",
                      padding: "0.75rem",
                      borderRadius: "8px",
                      border: "1px solid #e2e8f0",
                    }}
                  >
                    <div>
                      <span style={{ fontSize: "0.7rem", fontWeight: 700, color: "#b91c1c", display: "block", marginBottom: "0.2rem" }}>
                        ⚠️ DIFFICULTÉ #{idx + 1}
                      </span>
                      <input
                        type="text"
                        value={pair.difficulty}
                        onChange={(e) => handleUpdateDifficultyAction(idx, { difficulty: e.target.value })}
                        placeholder="Disponibilité limitée des utilisateurs..."
                        style={{ width: "100%", padding: "0.4rem 0.6rem", borderRadius: "6px", border: "1px solid #fecaca", background: "#fef2f2", fontSize: "0.85rem" }}
                      />
                    </div>
                    <div>
                      <span style={{ fontSize: "0.7rem", fontWeight: 700, color: "#15803d", display: "block", marginBottom: "0.2rem" }}>
                        ✅ ACTION CORRECTIVE ASSOCIÉE
                      </span>
                      <input
                        type="text"
                        value={pair.correctiveAction}
                        onChange={(e) => handleUpdateDifficultyAction(idx, { correctiveAction: e.target.value })}
                        placeholder="Planifier des créneaux de recette dédiés..."
                        style={{ width: "100%", padding: "0.4rem 0.6rem", borderRadius: "6px", border: "1px solid #bbf7d0", background: "#f0fdf4", fontSize: "0.85rem" }}
                      />
                    </div>
                    <div>
                      <button
                        type="button"
                        onClick={() => handleDeleteDifficultyAction(idx)}
                        style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer", padding: "6px" }}
                        title="Supprimer"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 6. SLIDE 6 : SEMAINE PROCHAINE (S+1) */}
            <div
              style={{
                background: "#ffffff",
                borderRadius: "14px",
                padding: "1.5rem",
                border: "1px solid #e2e8f0",
                boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                <h2 style={{ fontSize: "1.1rem", fontWeight: 800, color: "#0f172a", margin: 0, display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <Calendar size={18} color={theme.primary} />
                  <span>Slide 6 · Semaine prochaine (Jalons 1 à 4)</span>
                </h2>
                <button
                  type="button"
                  onClick={handleAddGoal}
                  style={{
                    padding: "0.4rem 0.85rem",
                    borderRadius: "8px",
                    border: "none",
                    background: theme.primary,
                    color: "#ffffff",
                    fontSize: "0.8rem",
                    fontWeight: 700,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.3rem",
                  }}
                >
                  <Plus size={14} />
                  <span>Ajouter un Objectif</span>
                </button>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {report.nextWeekGoals.map((g, idx) => (
                  <div
                    key={g.id}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "36px 1fr 1fr 40px",
                      gap: "0.75rem",
                      alignItems: "center",
                      background: "#f8fafc",
                      padding: "0.75rem",
                      borderRadius: "8px",
                      border: "1px solid #e2e8f0",
                    }}
                  >
                    <div
                      style={{
                        width: "32px",
                        height: "32px",
                        borderRadius: "50%",
                        background: theme.primary,
                        color: "#ffffff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: 800,
                        fontSize: "0.95rem",
                      }}
                    >
                      {g.id}
                    </div>
                    <div>
                      <span style={{ fontSize: "0.7rem", fontWeight: 700, color: "#64748b", display: "block", marginBottom: "0.2rem" }}>
                        TITRE DE L&apos;ACTION #{g.id}
                      </span>
                      <input
                        type="text"
                        value={g.title}
                        onChange={(e) => handleUpdateGoal(idx, { title: e.target.value })}
                        placeholder="Ex: Finaliser la recette..."
                        style={{ width: "100%", padding: "0.4rem 0.6rem", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "0.85rem", fontWeight: 600 }}
                      />
                    </div>
                    <div>
                      <span style={{ fontSize: "0.7rem", fontWeight: 700, color: "#64748b", display: "block", marginBottom: "0.2rem" }}>
                        ÉCHÉANCE / JALON PRÉVU
                      </span>
                      <input
                        type="text"
                        value={g.deadline}
                        onChange={(e) => handleUpdateGoal(idx, { deadline: e.target.value })}
                        placeholder="Ex: Clôture prévue mardi 10 novembre"
                        style={{ width: "100%", padding: "0.4rem 0.6rem", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "0.85rem" }}
                      />
                    </div>
                    <div>
                      <button
                        type="button"
                        onClick={() => handleDeleteGoal(idx)}
                        style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer", padding: "6px" }}
                        title="Supprimer"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* ========================================================================= */
          /* MODE APERÇU DOCUMENT (A4) FIDÈLE AU PDF ET AU POWERPOINT                 */
          /* ========================================================================= */
          <div
            id="cra-printable-document"
            style={{
              background: "#ffffff",
              borderRadius: "16px",
              padding: "3.5rem 3rem",
              border: "1px solid #cbd5e1",
              boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
              maxWidth: "960px",
              margin: "0 auto",
              fontFamily: "inherit",
              color: "#0f172a",
            }}
          >
            {/* BANDEAU SUPÉRIEUR */}
            <div style={{ height: "6px", background: theme.primary, borderRadius: "3px", marginBottom: "2rem" }} />

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.5rem" }}>
              <div>
                <span
                  style={{
                    fontSize: "0.72rem",
                    fontWeight: 900,
                    textTransform: "uppercase",
                    padding: "3px 8px",
                    borderRadius: "4px",
                    background: theme.primary,
                    color: "#ffffff",
                    letterSpacing: "0.05em",
                  }}
                >
                  {theme.entityShort}
                </span>
                <h1 style={{ fontSize: "2rem", fontWeight: 900, margin: "0.6rem 0 0.2rem", color: "#111827" }}>
                  Rapport hebdomadaire
                </h1>
                <div style={{ fontSize: "1.05rem", color: "#64748b" }}>
                  {report.projectName} · Semaine {report.weekNumber} · du {report.startDate} au {report.endDate}
                </div>
              </div>

              <div style={{ textAlign: "right", fontSize: "0.82rem", color: "#64748b" }}>
                <div><strong>Auteur :</strong> {report.authorName}</div>
                <div>{report.authorRole}</div>
                <div><strong>Destinataire :</strong> {report.recipient}</div>
              </div>
            </div>

            {/* SLIDE 2 : SYNTHÈSE (3 MÉTRIQUES) */}
            <div style={{ borderTop: "2px solid #e2e8f0", paddingTop: "1.5rem", marginBottom: "2rem" }}>
              <h2 style={{ fontSize: "1.25rem", fontWeight: 800, margin: "0 0 1rem", color: "#111827" }}>
                1. Synthèse de la semaine
              </h2>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem", marginBottom: "1.25rem" }}>
                <div style={{ background: "#f8fafc", padding: "1.25rem", borderRadius: "10px", border: "1px solid #cbd5e1", textAlign: "center" }}>
                  <div style={{ fontSize: "2rem", fontWeight: 900, color: "#111827" }}>{report.deliveredTasksText}</div>
                  <div style={{ fontSize: "0.82rem", color: "#64748b" }}>{report.deliveredTasksLabel}</div>
                </div>

                <div style={{ background: "#f0fdf4", padding: "1.25rem", borderRadius: "10px", border: "1px solid #86efac", textAlign: "center" }}>
                  <div style={{ fontSize: "2rem", fontWeight: 900, color: "#15803d" }}>{report.completionRateText}</div>
                  <div style={{ fontSize: "0.82rem", color: "#166534", fontWeight: 700 }}>{report.completionRateLabel}</div>
                </div>

                <div style={{ background: "#fffbeb", padding: "1.25rem", borderRadius: "10px", border: "1px solid #fde68a", textAlign: "center" }}>
                  <div style={{ fontSize: "2rem", fontWeight: 900, color: "#d97706" }}>{report.vigilancePointsText}</div>
                  <div style={{ fontSize: "0.82rem", color: "#b45309", fontWeight: 700 }}>{report.vigilancePointsLabel}</div>
                </div>
              </div>

              <div style={{ background: "#f1f5f9", padding: "1rem 1.25rem", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "0.95rem" }}>
                <strong style={{ color: theme.primary }}>À RETENIR : </strong>
                {report.executiveSummary}
              </div>
            </div>

            {/* SLIDE 3 : ACTIVITÉS RÉALISÉES */}
            <div style={{ borderTop: "2px solid #e2e8f0", paddingTop: "1.5rem", marginBottom: "2rem" }}>
              <h2 style={{ fontSize: "1.25rem", fontWeight: 800, margin: "0 0 1rem", color: "#111827" }}>
                2. Activités réalisées
              </h2>

              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.88rem" }}>
                <thead>
                  <tr style={{ background: "#1e293b", color: "#ffffff", textAlign: "left" }}>
                    <th style={{ padding: "0.6rem 0.8rem", borderRadius: "6px 0 0 0" }}>Activité</th>
                    <th style={{ padding: "0.6rem 0.8rem" }}>Responsable</th>
                    <th style={{ padding: "0.6rem 0.8rem" }}>Statut</th>
                    <th style={{ padding: "0.6rem 0.8rem", borderRadius: "0 6px 0 0" }}>Avancement</th>
                  </tr>
                </thead>
                <tbody>
                  {report.activities.map((act, idx) => (
                    <tr key={act.id} style={{ borderBottom: "1px solid #e2e8f0", background: idx % 2 === 0 ? "#ffffff" : "#f8fafc" }}>
                      <td style={{ padding: "0.6rem 0.8rem", fontWeight: 700 }}>{act.name}</td>
                      <td style={{ padding: "0.6rem 0.8rem", color: "#64748b" }}>{act.owner}</td>
                      <td style={{ padding: "0.6rem 0.8rem", fontWeight: 700, color: act.status === "Terminé" ? "#15803d" : act.status === "Reporté" || act.status === "Bloqué" ? "#d97706" : "#0284c7" }}>
                        {act.status}
                      </td>
                      <td style={{ padding: "0.6rem 0.8rem", fontWeight: 800 }}>{act.progress} %</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* SLIDE 4 : SUIVI JOURNALIER */}
            <div style={{ borderTop: "2px solid #e2e8f0", paddingTop: "1.5rem", marginBottom: "2rem" }}>
              <h2 style={{ fontSize: "1.25rem", fontWeight: 800, margin: "0 0 1rem", color: "#111827" }}>
                3. Tâches planifiées vs réalisées par jour
              </h2>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "0.75rem", marginBottom: "1rem" }}>
                {report.dailyProgress.map((day) => (
                  <div key={day.dayName} style={{ background: "#f8fafc", padding: "0.75rem", borderRadius: "8px", border: "1px solid #cbd5e1", textAlign: "center" }}>
                    <div style={{ fontWeight: 800, fontSize: "0.85rem", marginBottom: "0.3rem" }}>{day.dayName}</div>
                    <div style={{ fontSize: "1.2rem", fontWeight: 900, color: theme.primary }}>{day.completed} / {day.planned}</div>
                    <div style={{ fontSize: "0.72rem", color: "#64748b" }}>{day.planned > 0 ? Math.round((day.completed / day.planned) * 100) : 100} %</div>
                  </div>
                ))}
              </div>

              <div style={{ background: "#f1f5f9", padding: "0.75rem 1rem", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "0.9rem" }}>
                <strong style={{ color: theme.primary }}>À RETENIR DU RYTHME : </strong>
                {report.dailyTakeaway}
              </div>
            </div>

            {/* SLIDE 5 : DIFFICULTÉS ET ACTIONS CORRECTIVES */}
            <div style={{ borderTop: "2px solid #e2e8f0", paddingTop: "1.5rem", marginBottom: "2rem" }}>
              <h2 style={{ fontSize: "1.25rem", fontWeight: 800, margin: "0 0 1rem", color: "#111827" }}>
                4. Difficultés et actions correctives
              </h2>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: "10px", padding: "1rem 1.25rem" }}>
                  <h3 style={{ fontSize: "0.95rem", fontWeight: 800, color: "#991b1b", margin: "0 0 0.75rem" }}>
                    ⚠️ Difficultés rencontrées
                  </h3>
                  <ul style={{ paddingLeft: "1.2rem", margin: 0, fontSize: "0.88rem", color: "#7f1d1d", lineHeight: 1.6 }}>
                    {report.difficultiesAndActions.map((pair) => (
                      <li key={pair.id}>{pair.difficulty}</li>
                    ))}
                  </ul>
                </div>

                <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "10px", padding: "1rem 1.25rem" }}>
                  <h3 style={{ fontSize: "0.95rem", fontWeight: 800, color: "#166534", margin: "0 0 0.75rem" }}>
                    ✅ Actions correctives
                  </h3>
                  <ul style={{ paddingLeft: "1.2rem", margin: 0, fontSize: "0.88rem", color: "#14532d", lineHeight: 1.6 }}>
                    {report.difficultiesAndActions.map((pair) => (
                      <li key={pair.id}>{pair.correctiveAction}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* SLIDE 6 : SEMAINE PROCHAINE */}
            <div style={{ borderTop: "2px solid #e2e8f0", paddingTop: "1.5rem" }}>
              <h2 style={{ fontSize: "1.25rem", fontWeight: 800, margin: "0 0 1rem", color: "#111827" }}>
                5. Semaine prochaine
              </h2>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                {report.nextWeekGoals.map((g) => (
                  <div key={g.id} style={{ display: "flex", alignItems: "center", gap: "0.75rem", background: "#f8fafc", padding: "0.75rem 1rem", borderRadius: "8px", border: "1px solid #cbd5e1" }}>
                    <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: theme.primary, color: "#ffffff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: "0.85rem", flexShrink: 0 }}>
                      {g.id}
                    </div>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: "0.92rem", color: "#111827" }}>{g.title}</div>
                      <div style={{ fontSize: "0.78rem", color: "#64748b" }}>{g.deadline}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
