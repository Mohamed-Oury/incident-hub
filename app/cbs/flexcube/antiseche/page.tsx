// app/cbs/flexcube/antiseche/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { AppShell } from "@/modules/layout/AppShell";
import {
  FLEXCUBE_CHEAT_SHEET,
  FLEXCUBE_CHEAT_CATEGORIES
} from "@/modules/cbs/flexcube/data/flexcube-cheat-sheet-data";
import { FlexcubeCheatCategory } from "@/modules/cbs/flexcube/types";

export default function FlexcubeAntisechePage() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<"ALL" | FlexcubeCheatCategory>("ALL");
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const filtered = FLEXCUBE_CHEAT_SHEET.filter((item) => {
    const matchesCat = selectedCategory === "ALL" || item.category === selectedCategory;
    const q = search.toLowerCase();
    const matchesQuery =
      item.title.toLowerCase().includes(q) ||
      item.short.toLowerCase().includes(q) ||
      item.rawText.toLowerCase().includes(q) ||
      item.summaryPoints.some((p) => p.toLowerCase().includes(q));
    return matchesCat && matchesQuery;
  });

  const copyCode = (id: number, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <AppShell pageTitle="Antisèche Officielle Oracle FLEXCUBE" eyebrow="MÉMENTO INGÉNIERIE & EXPLOITATION">
      <div className="space-y-6">
        {/* Hero Header */}
        <div className="bg-gradient-to-r from-red-950 via-slate-900 to-red-900 p-6 rounded-2xl text-white border border-red-800/40 shadow-xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-600 text-white">
                  MÉMENTO OFFICIEL
                </span>
                <span className="text-xs text-red-200">20 Fiches d Ingénierie & d Exploitation</span>
              </div>
              <h1 className="text-2xl font-black">Antisèche Pratique Oracle FLEXCUBE</h1>
              <p className="text-sm text-red-100/80 mt-1 max-w-2xl">
                Synthèse condensée des concepts clés : architecture 3-Tier, atelier ODT, tables centrales ST/AC/GL, conventions PL/SQL, chaîne batch AEOD et intégration Switch monétique.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Link
                href="/cbs/flexcube"
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition"
              >
                ⬅️ Tableau de bord FLEXCUBE
              </Link>
            </div>
          </div>

          {/* Barre de Recherche */}
          <div className="mt-5">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="🔍 Rechercher une fiche (ex: verrou, STTM_CUSTOMER, NOWAIT, AEOD, ODT, ORA-00054)..."
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-red-700/50 text-white placeholder-slate-400 text-xs focus:ring-2 focus:ring-red-500 outline-none shadow-inner"
            />
          </div>
        </div>

        {/* Filtres par Catégorie */}
        <div className="flex flex-wrap gap-2">
          {FLEXCUBE_CHEAT_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                selectedCategory === cat.id
                  ? "bg-red-700 text-white shadow-md"
                  : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>

        {/* Liste des Fiches Mémo */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h2 className="font-extrabold text-slate-900 text-sm">{item.title}</h2>
                  <span
                    className="px-2 py-0.5 rounded text-[10px] font-bold text-white whitespace-nowrap"
                    style={{ backgroundColor: item.badgeColor }}
                  >
                    {item.badge}
                  </span>
                </div>

                <p className="text-xs text-slate-600 mb-3 italic leading-relaxed">
                  {item.rawText}
                </p>

                <div className="space-y-1.5 pt-2 border-t border-slate-100">
                  {item.summaryPoints.map((point, pIdx) => (
                    <div key={pIdx} className="text-xs text-slate-700 flex items-start gap-1.5">
                      <span className="text-red-600 font-bold">•</span>
                      <span>{point}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Code sample ou caveat */}
              <div className="mt-4 pt-3 border-t border-slate-100 space-y-2">
                {item.codeSample && (
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-mono text-slate-500 uppercase">Extrait de code :</span>
                      <button
                        onClick={() => copyCode(item.id, item.codeSample!)}
                        className="text-[10px] font-bold text-red-700 hover:underline cursor-pointer"
                      >
                        {copiedId === item.id ? "✓ Copié !" : "Copier"}
                      </button>
                    </div>
                    <pre className="p-2.5 bg-slate-950 text-slate-100 rounded-lg text-[10px] font-mono overflow-x-auto">
                      {item.codeSample}
                    </pre>
                  </div>
                )}

                {item.caveat && (
                  <div className="p-2 rounded-lg bg-amber-50 text-amber-900 text-[11px] border border-amber-200">
                    <b>Attention :</b> {item.caveat}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
