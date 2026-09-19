"use client";

import { useState } from "react";
import { AppShell } from "@/modules/layout/AppShell";
import { CBS_QUIZ } from "@/modules/cbs/cbs-data";

export default function CbsAcademyPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [answeredCount, setAnsweredCount] = useState(0);
  const [xpGained, setXpGained] = useState(0);

  const categories = ["ALL", ...Array.from(new Set(CBS_QUIZ.map((q) => q.category)))];

  const filteredQuestions = CBS_QUIZ.filter((q) => {
    return selectedCategory === "ALL" || q.category === selectedCategory;
  });

  const currentQ = filteredQuestions[currentIndex] || CBS_QUIZ[0];

  const handleSelectOption = (idx: number) => {
    if (showExplanation) return; // Déjà répondu
    setSelectedOption(idx);
    setShowExplanation(true);
    setAnsweredCount((prev) => prev + 1);

    if (idx === currentQ.correctIndex) {
      setScore((prev) => prev + 1);
      setXpGained((prev) => prev + currentQ.points);
    }
  };

  const handleNext = () => {
    setSelectedOption(null);
    setShowExplanation(false);
    if (currentIndex < filteredQuestions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      // Recommencer ou boucle
      setCurrentIndex(0);
    }
  };

  const handleCategoryChange = (cat: string) => {
    setSelectedCategory(cat);
    setCurrentIndex(0);
    setSelectedOption(null);
    setShowExplanation(false);
  };

  return (
    <AppShell pageTitle="CBS Academy & Certification" eyebrow="FORMATION & ÉVALUATION CONTINUE">
      <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        
        {/* Score & Progression */}
        <div
          className="card"
          style={{
            padding: "1.25rem 1.75rem",
            background: "linear-gradient(135deg, #0284c7 0%, #0369a1 100%)",
            color: "#ffffff",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "1rem",
          }}
        >
          <div>
            <span style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.08em", opacity: 0.9 }}>
              Session d&apos;évaluation en direct
            </span>
            <h2 style={{ fontSize: "1.3rem", fontWeight: 800, margin: "0.2rem 0 0 0" }}>
              Banque de {CBS_QUIZ.length} Questions QCM CBS Amplitude
            </h2>
          </div>

          <div style={{ display: "flex", gap: "1.5rem", alignItems: "center" }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "0.75rem", opacity: 0.85 }}>RÉPONSES JUSTES</div>
              <div style={{ fontSize: "1.4rem", fontWeight: 800 }}>{score} / {answeredCount}</div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "0.75rem", opacity: 0.85 }}>XP ACCUMULÉ</div>
              <div style={{ fontSize: "1.4rem", fontWeight: 800, color: "#fef08a" }}>+{xpGained} XP</div>
            </div>
          </div>
        </div>

        {/* Sélecteur de thématiques */}
        <div className="card" style={{ padding: "1rem 1.25rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
            <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--text-muted)", marginRight: "0.5rem" }}>
              Domaine :
            </span>
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => handleCategoryChange(cat)}
                  style={{
                    padding: "4px 10px",
                    borderRadius: "14px",
                    border: isSelected ? "1px solid #0284c7" : "1px solid var(--border-light)",
                    background: isSelected ? "#0284c7" : "var(--bg-subtle)",
                    color: isSelected ? "#ffffff" : "var(--text-secondary)",
                    fontSize: "0.75rem",
                    fontWeight: isSelected ? 700 : 500,
                    cursor: "pointer",
                  }}
                >
                  {cat === "ALL" ? `Toutes (${CBS_QUIZ.length})` : cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Question Card */}
        {currentQ && (
          <div className="card" style={{ padding: "2rem", border: "1px solid var(--border-light)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <span
                  style={{
                    fontSize: "0.72rem",
                    fontWeight: 800,
                    background: "#e0f2fe",
                    color: "#0369a1",
                    padding: "2px 8px",
                    borderRadius: "4px",
                  }}
                >
                  {currentQ.category}
                </span>
                <span
                  style={{
                    fontSize: "0.7rem",
                    fontWeight: 700,
                    background: currentQ.points >= 20 ? "#fee2e2" : currentQ.points >= 15 ? "#fef3c7" : "#dcfce7",
                    color: currentQ.points >= 20 ? "#991b1b" : currentQ.points >= 15 ? "#92400e" : "#166534",
                    padding: "2px 6px",
                    borderRadius: "4px",
                  }}
                >
                  +{currentQ.points} PTS
                </span>
              </div>

              <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                Question <strong>{currentIndex + 1}</strong> sur <strong>{filteredQuestions.length}</strong> • +{currentQ.points} XP
              </div>
            </div>

            <h3 style={{ fontSize: "1.2rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "1.5rem", lineHeight: "1.4" }}>
              {currentQ.question}
            </h3>

            {/* Options list */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginBottom: "1.5rem" }}>
              {currentQ.options.map((opt, idx) => {
                const isSelected = selectedOption === idx;
                const isCorrect = idx === currentQ.correctIndex;
                let bg = "var(--bg-subtle)";
                let border = "1px solid var(--border-light)";
                let textColor = "var(--text-primary)";

                if (showExplanation) {
                  if (isCorrect) {
                    bg = "rgba(16, 185, 129, 0.15)";
                    border = "1px solid #10b981";
                    textColor = "#065f46";
                  } else if (isSelected) {
                    bg = "rgba(239, 68, 68, 0.15)";
                    border = "1px solid #ef4444";
                    textColor = "#991b1b";
                  }
                } else if (isSelected) {
                  border = "2px solid #0284c7";
                }

                return (
                  <div
                    key={idx}
                    onClick={() => handleSelectOption(idx)}
                    style={{
                      padding: "1rem 1.25rem",
                      borderRadius: "var(--radius-sm)",
                      background: bg,
                      border: border,
                      color: textColor,
                      cursor: showExplanation ? "default" : "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.75rem",
                      fontSize: "0.9rem",
                      fontWeight: 500,
                      transition: "all 0.15s ease",
                    }}
                  >
                    <span
                      style={{
                        width: "24px",
                        height: "24px",
                        borderRadius: "50%",
                        background: "rgba(0,0,0,0.06)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "0.75rem",
                        fontWeight: 700,
                        flexShrink: 0,
                      }}
                    >
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span>{opt}</span>
                    {showExplanation && isCorrect && <span style={{ marginLeft: "auto", fontWeight: 800, color: "#10b981" }}>✔ Correct</span>}
                    {showExplanation && isSelected && !isCorrect && <span style={{ marginLeft: "auto", fontWeight: 800, color: "#ef4444" }}>✖ Faux</span>}
                  </div>
                );
              })}
            </div>

            {/* Explication technique */}
            {showExplanation && (
              <div
                style={{
                  background: "rgba(2, 132, 199, 0.08)",
                  border: "1px solid rgba(2, 132, 199, 0.25)",
                  borderRadius: "var(--radius-sm)",
                  padding: "1rem 1.25rem",
                  marginBottom: "1.5rem",
                }}
              >
                <div style={{ fontWeight: 700, fontSize: "0.85rem", color: "#0284c7", marginBottom: "0.35rem" }}>
                  💡 Explication Technique Expert :
                </div>
                <p style={{ margin: 0, fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: "1.5" }}>
                  {currentQ.explanation}
                </p>
              </div>
            )}

            {/* Bouton Suivant */}
            {showExplanation && (
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <button
                  type="button"
                  onClick={handleNext}
                  style={{
                    padding: "0.65rem 1.5rem",
                    background: "#0284c7",
                    color: "#ffffff",
                    border: "none",
                    borderRadius: "var(--radius-sm)",
                    fontWeight: 700,
                    fontSize: "0.9rem",
                    cursor: "pointer",
                  }}
                >
                  Question Suivante →
                </button>
              </div>
            )}
          </div>
        )}

      </div>
    </AppShell>
  );
}
