page_ts = """// app/cbs/flexcube/training/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { AppShell } from "@/modules/layout/AppShell";
import { FLEXCUBE_GRADES, FLEXCUBE_LESSONS } from "@/modules/cbs/flexcube/data/flexcube-training-data";

export default function FlexcubeTrainingPage() {
  const [selectedGrade, setSelectedGrade] = useState<number>(1);

  const currentGradeInfo = FLEXCUBE_GRADES.find((g) => g.level === selectedGrade) || FLEXCUBE_GRADES[0];
  const gradeLessons = FLEXCUBE_LESSONS.filter((l) => l.gradeLevel === selectedGrade);

  return (
    <AppShell pageTitle="Cursus de Formation & Certification FLEXCUBE" eyebrow="ACADÉMIE OFFICIELLE">
      <div className="space-y-6">
        {/* Hero Header */}
        <div className="bg-gradient-to-r from-red-950 via-slate-900 to-red-900 p-6 rounded-2xl text-white border border-red-800/40 shadow-xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-600 text-white">
                  CURSUS OFFICIEL EN 5 GRADES
                </span>
                <span className="text-xs text-red-200">De l Apprenti au niveau Architecte</span>
              </div>
              <h1 className="text-2xl font-black">Parcours Certifiant Oracle FLEXCUBE</h1>
              <p className="text-sm text-red-100/80 mt-1 max-w-2xl">
                Progression structurée validant la maîtrise des données statiques, de la chaîne de clôture nocturne AEOD, du développement d extensions PL/SQL et de l intégration Gateway/Switch.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Link
                href="/cbs/flexcube/academy"
                className="px-4 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold shadow-md transition flex items-center gap-2"
              >
                <span>🎯 Passer un Examen de Grade</span>
              </Link>
            </div>
          </div>

          {/* Sélecteur des 5 Grades */}
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-2.5 mt-6 pt-5 border-t border-red-800/40">
            {FLEXCUBE_GRADES.map((grade) => (
              <button
                key={grade.level}
                onClick={() => setSelectedGrade(grade.level)}
                className={`p-3 rounded-xl border transition text-left cursor-pointer ${
                  selectedGrade === grade.level
                    ? "bg-white text-slate-900 border-white shadow-lg"
                    : "bg-red-900/30 text-red-100 border-red-700/30 hover:bg-red-800/40"
                }`}
              >
                <div className="text-[10px] font-bold uppercase tracking-wider opacity-80">
                  Grade {grade.level}
                </div>
                <div className="text-xs font-black truncate mt-0.5">
                  {grade.badge}
                </div>
                <div className="text-[10px] opacity-75 mt-1">
                  Seuil : {grade.minPassScorePct}%
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Détail du Grade Sélectionné */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
            <div>
              <span
                className="px-2.5 py-1 rounded-full text-xs font-bold text-white inline-block mb-1"
                style={{ backgroundColor: currentGradeInfo.color }}
              >
                {currentGradeInfo.badge}
              </span>
              <h2 className="text-lg font-black text-slate-900">{currentGradeInfo.name}</h2>
            </div>
            <Link
              href="/cbs/flexcube/academy"
              className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition flex items-center gap-2 self-start"
            >
              <span>Valider ce grade par Examen QCM ➔</span>
            </Link>
          </div>

          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-1.5">
              🎯 Objectif de Compétence :
            </h3>
            <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              {currentGradeInfo.objective}
            </p>
          </div>

          {/* Ressources Recommandées */}
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
              📚 Références & Standards Officiels :
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {currentGradeInfo.recommendedResources.map((res, idx) => (
                <div key={idx} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 space-y-1">
                  <div className="text-xs font-bold text-slate-900 line-clamp-1">{res.title}</div>
                  <div className="text-[10px] font-mono font-bold text-red-700">{res.reference}</div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">{res.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Leçons du Grade */}
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
              📖 Chapitres & Leçons Techniques Approfondies ({gradeLessons.length}) :
            </h3>
            <div className="space-y-4">
              {gradeLessons.map((lesson) => (
                <div key={lesson.id} className="p-4 rounded-xl border border-slate-200 bg-white space-y-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-slate-900 text-sm">{lesson.title}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                      Module {lesson.module} • {lesson.durationMinutes} min
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{lesson.overview}</p>
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 space-y-1">
                    <div className="text-[11px] font-bold text-slate-800">Points clés à retenir :</div>
                    {lesson.keyTakeaways.map((point, pIdx) => (
                      <div key={pIdx} className="text-[11px] text-slate-700 flex items-start gap-1.5">
                        <span className="text-red-600 font-bold">•</span>
                        <span>{point}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
"""

with open("app/cbs/flexcube/training/page.tsx", "w", encoding="utf-8") as f:
    f.write(page_ts)
print("Created app/cbs/flexcube/training/page.tsx")
