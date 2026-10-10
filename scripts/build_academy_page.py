page_ts = """// app/cbs/flexcube/academy/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { AppShell } from "@/modules/layout/AppShell";
import { FLEXCUBE_GRADES, FLEXCUBE_EXAMS } from "@/modules/cbs/flexcube/data/flexcube-training-data";

export default function FlexcubeAcademyPage() {
  const [selectedGrade, setSelectedGrade] = useState<number>(1);
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);

  const gradeQuestions = FLEXCUBE_EXAMS.filter((q) => q.gradeLevel === selectedGrade);
  const gradeInfo = FLEXCUBE_GRADES.find((g) => g.level === selectedGrade) || FLEXCUBE_GRADES[0];

  const handleSelectOption = (questionId: string, optionIndex: number) => {
    if (submitted) return;
    setUserAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
  };

  const handleReset = () => {
    setUserAnswers({});
    setSubmitted(false);
  };

  const calculateScore = () => {
    let correct = 0;
    gradeQuestions.forEach((q) => {
      if (userAnswers[q.id] === q.correctIndex) {
        correct++;
      }
    });
    return {
      correct,
      total: gradeQuestions.length,
      percentage: Math.round((correct / gradeQuestions.length) * 100),
    };
  };

  const scoreResult = calculateScore();
  const passed = scoreResult.percentage >= gradeInfo.minPassScorePct;

  return (
    <AppShell pageTitle="Centre d Examen & Certification FLEXCUBE" eyebrow="CERTIFICATION DES COMPÉTENCES">
      <div className="space-y-6">
        {/* Hero Header */}
        <div className="bg-gradient-to-r from-purple-950 via-slate-900 to-red-950 p-6 rounded-2xl text-white border border-purple-800/40 shadow-xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-600 text-white">
                  ÉVALUATION OFFICIELLE
                </span>
                <span className="text-xs text-purple-200">75 Questions de Certification Réparties sur 5 Grades</span>
              </div>
              <h1 className="text-2xl font-black">Centre d Examen Oracle FLEXCUBE</h1>
              <p className="text-sm text-purple-100/80 mt-1 max-w-2xl">
                Validez vos compétences techniques par un examen QCM chronométré de 15 questions. Obtenez au moins {gradeInfo.minPassScorePct}% pour débloquer votre qualification officielle.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Link
                href="/cbs/flexcube/training"
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition"
              >
                📖 Revoir les cours du Cursus
              </Link>
            </div>
          </div>

          {/* Sélecteur de Grade d Examen */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 mt-6 pt-5 border-t border-purple-800/40">
            {FLEXCUBE_GRADES.map((g) => (
              <button
                key={g.level}
                onClick={() => {
                  setSelectedGrade(g.level);
                  handleReset();
                }}
                className={`p-3 rounded-xl border transition text-left cursor-pointer ${
                  selectedGrade === g.level
                    ? "bg-white text-slate-900 border-white shadow-lg"
                    : "bg-purple-950/40 text-purple-100 border-purple-700/40 hover:bg-purple-900/50"
                }`}
              >
                <div className="text-[10px] font-bold uppercase tracking-wider opacity-80">Niveau {g.level}</div>
                <div className="text-xs font-black truncate mt-0.5">{g.badge}</div>
                <div className="text-[10px] opacity-75 mt-1">15 questions officielles</div>
              </button>
            ))}
          </div>
        </div>

        {/* Résultat d Examen si soumis */}
        {submitted && (
          <div
            className={`p-6 rounded-2xl border shadow-md space-y-3 ${
              passed
                ? "bg-emerald-50 border-emerald-300 text-emerald-950"
                : "bg-red-50 border-red-300 text-red-950"
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-3xl mr-2">{passed ? "🏆" : "⚠️"}</span>
                <span className="text-xl font-black">
                  {passed ? `Félicitations ! Vous validez le ${gradeInfo.name}` : "Ajourné - Seuil non atteint"}
                </span>
                <p className="text-xs mt-1 opacity-90">
                  Votre score : <b>{scoreResult.correct} / {scoreResult.total}</b> ({scoreResult.percentage}%) • Seuil exigé : <b>{gradeInfo.minPassScorePct}%</b>
                </p>
              </div>

              <button
                onClick={handleReset}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition cursor-pointer self-start"
              >
                🔄 Repasser le test
              </button>
            </div>
          </div>
        )}

        {/* Liste des 15 Questions */}
        <div className="space-y-4">
          {gradeQuestions.map((q, idx) => {
            const selectedOpt = userAnswers[q.id];
            const isAnswered = selectedOpt !== undefined;

            return (
              <div
                key={q.id}
                className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="text-xs font-bold text-slate-900">
                    <span className="text-purple-700 mr-2">Question {idx + 1} / 15</span>
                    <span>{q.question}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                    Module {q.module}
                  </span>
                </div>

                {/* Options de réponse */}
                <div className="space-y-2 pt-1">
                  {q.options.map((opt, oIdx) => {
                    const isSelected = selectedOpt === oIdx;
                    let optStyle = "border-slate-200 hover:border-slate-300 bg-slate-50 text-slate-800";

                    if (submitted) {
                      if (oIdx === q.correctIndex) {
                        optStyle = "border-emerald-500 bg-emerald-50 text-emerald-900 font-bold";
                      } else if (isSelected) {
                        optStyle = "border-red-500 bg-red-50 text-red-900 line-through";
                      } else {
                        optStyle = "border-slate-200 bg-slate-50 text-slate-400";
                      }
                    } else if (isSelected) {
                      optStyle = "border-purple-600 bg-purple-50 text-purple-950 font-bold ring-2 ring-purple-600/20";
                    }

                    return (
                      <div
                        key={oIdx}
                        onClick={() => handleSelectOption(q.id, oIdx)}
                        className={`p-3 rounded-xl border text-xs cursor-pointer transition flex items-center justify-between gap-3 ${optStyle}`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center text-[10px] font-bold shrink-0">
                            {String.fromCharCode(65 + oIdx)}
                          </span>
                          <span>{opt}</span>
                        </div>
                        {submitted && oIdx === q.correctIndex && (
                          <span className="text-emerald-700 font-bold text-xs">✓ Réponse Correcte</span>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Explication technique après soumission */}
                {submitted && (
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1 mt-2">
                    <div className="font-bold text-slate-900">💡 Justification Technique :</div>
                    <p className="text-slate-700 leading-relaxed">{q.explanation}</p>
                    <div className="text-[10px] text-purple-800 font-mono pt-1">
                      Référence : {q.referenceDoc}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bouton de Soumission Fixé en Bas */}
        {!submitted && (
          <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-md flex items-center justify-between gap-4 sticky bottom-4">
            <div className="text-xs text-slate-600">
              Questions répondues : <b>{Object.keys(userAnswers).length} / {gradeQuestions.length}</b>
            </div>

            <button
              onClick={() => setSubmitted(true)}
              disabled={Object.keys(userAnswers).length === 0}
              className="px-6 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 disabled:opacity-50 text-white font-bold text-xs shadow-md transition cursor-pointer"
            >
              Valider et Obtenir la Note d Examen ➔
            </button>
          </div>
        )}
      </div>
    </AppShell>
  );
}
"""

with open("app/cbs/flexcube/academy/page.tsx", "w", encoding="utf-8") as f:
    f.write(page_ts)
print("Created app/cbs/flexcube/academy/page.tsx")
