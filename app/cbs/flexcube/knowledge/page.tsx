// app/cbs/flexcube/knowledge/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { AppShell } from "@/modules/layout/AppShell";
import { FLEXCUBE_SCHEMA_TABLES } from "@/modules/cbs/flexcube/data/flexcube-schema-tables";
import { FlexcubeModule } from "@/modules/cbs/flexcube/types";

export default function FlexcubeKnowledgePage() {
  const [selectedModule, setSelectedModule] = useState<"ALL" | FlexcubeModule>("ALL");
  const [search, setSearch] = useState("");

  const modulesList: { id: "ALL" | FlexcubeModule; label: string }[] = [
    { id: "ALL", label: "Tous les modules" },
    { id: "ST", label: "ST - Clients & Agences" },
    { id: "AC", label: "AC - Écritures & Comptes" },
    { id: "GL", label: "GL - Grand Livre" },
    { id: "FT", label: "FT - Virements de Fonds" },
    { id: "CL", label: "CL - Crédits & Prêts" },
    { id: "AEOD", label: "AEOD - Batch Clôture" },
    { id: "GW", label: "GW - Passerelle Gateway" },
  ];

  const filteredTables = FLEXCUBE_SCHEMA_TABLES.filter((t) => {
    const matchesMod = selectedModule === "ALL" || t.module === selectedModule;
    const q = search.toLowerCase();
    const matchesQuery =
      t.tableName.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q) ||
      t.businessRole.toLowerCase().includes(q) ||
      t.keyColumns.some((col) => col.name.toLowerCase().includes(q));
    return matchesMod && matchesQuery;
  });

  return (
    <AppShell pageTitle="Dictionnaire de Schéma Oracle FLEXCUBE" eyebrow="RÉFÉRENTIEL DES OBJETS SGBD">
      <div className="space-y-6">
        {/* Hero Header */}
        <div className="bg-gradient-to-r from-amber-950 via-slate-900 to-red-950 p-6 rounded-2xl text-white border border-amber-800/40 shadow-xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-600 text-white">
                  SCHEMA SGBD ORACLE
                </span>
                <span className="text-xs text-amber-200">{FLEXCUBE_SCHEMA_TABLES.length} Tables Centrales Répertoriées</span>
              </div>
              <h1 className="text-2xl font-black">Dictionnaire de Données FLEXCUBE</h1>
              <p className="text-sm text-amber-100/80 mt-1 max-w-2xl">
                Structure détaillée des tables maîtresses Oracle FLEXCUBE : colonnes clés, types, clés primaires, rôle métier et recommandations d indexation.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Link
                href="/cbs/flexcube"
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition"
              >
                ⬅️ Retour Hub FLEXCUBE
              </Link>
            </div>
          </div>

          <div className="mt-5">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="🔍 Rechercher une table ou une colonne (ex: STTM_CUSTOMER, LCY_AMOUNT, DRCR_IND, BRANCH_CODE)..."
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-amber-700/50 text-white placeholder-slate-400 text-xs focus:ring-2 focus:ring-amber-500 outline-none shadow-inner"
            />
          </div>
        </div>

        {/* Filtres par Module */}
        <div className="flex flex-wrap gap-2">
          {modulesList.map((m) => (
            <button
              key={m.id}
              onClick={() => setSelectedModule(m.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                selectedModule === m.id
                  ? "bg-amber-700 text-white shadow-md"
                  : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>

        {/* Liste des Tables */}
        <div className="space-y-5">
          {filteredTables.map((tbl) => (
            <div
              key={tbl.tableName}
              className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-base font-black text-slate-900">{tbl.tableName}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900 font-mono">
                    Module {tbl.module}
                  </span>
                </div>
                <div className="text-xs text-slate-500">
                  Clé Primaire : <code className="font-mono font-bold text-red-700">({tbl.primaryKey.join(", ")})</code>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="font-bold text-slate-900 block mb-1">Description Fonctionnelle :</span>
                  <p className="text-slate-600 leading-relaxed">{tbl.description}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="font-bold text-slate-900 block mb-1">Rôle Métier dans FLEXCUBE :</span>
                  <p className="text-slate-600 leading-relaxed">{tbl.businessRole}</p>
                </div>
              </div>

              {tbl.indexingAdvice && (
                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-950">
                  <b>💡 Recommandation d indexation :</b> {tbl.indexingAdvice}
                </div>
              )}

              {/* Colonnes Clés */}
              <div>
                <span className="text-xs font-bold text-slate-900 block mb-2">Colonnes Maîtresses :</span>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border border-slate-200 rounded-xl overflow-hidden">
                    <thead className="bg-slate-100 text-slate-700 font-bold">
                      <tr>
                        <th className="p-2.5">Colonne</th>
                        <th className="p-2.5">Type SGBD</th>
                        <th className="p-2.5">Nullable</th>
                        <th className="p-2.5">Description Métier</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 text-slate-700">
                      {tbl.keyColumns.map((col, idx) => (
                        <tr key={idx} className="hover:bg-slate-50">
                          <td className="p-2.5 font-mono font-bold text-slate-900">{col.name}</td>
                          <td className="p-2.5 font-mono text-slate-600">{col.type}</td>
                          <td className="p-2.5">{col.nullable ? "OUI" : "NON (NOT NULL)"}</td>
                          <td className="p-2.5 text-slate-600">{col.description}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
