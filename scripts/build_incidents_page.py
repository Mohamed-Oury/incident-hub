page_ts = """// app/cbs/flexcube/incidents/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { AppShell } from "@/modules/layout/AppShell";
import { FLEXCUBE_INCIDENTS } from "@/modules/cbs/flexcube/data/flexcube-incidents-data";
import { FLEXCUBE_AEOD_STEPS, FLEXCUBE_AEOD_SCENARIOS } from "@/modules/cbs/flexcube/data/flexcube-aeod-data";
import { analyzeFlexcubeIncident } from "@/modules/cbs/flexcube/engine/flexcube-copilot-engine";

export default function FlexcubeIncidentsPage() {
  const [activeTab, setActiveTab] = useState<"incidents" | "aeod" | "simulator">("incidents");
  const [search, setSearch] = useState("");
  const [diagnosticInput, setDiagnosticInput] = useState("");
  const [diagnosticResult, setDiagnosticResult] = useState<ReturnType<typeof analyzeFlexcubeIncident> | null>(null);

  const filteredIncidents = FLEXCUBE_INCIDENTS.filter((inc) => {
    const q = search.toLowerCase();
    return (
      inc.title.toLowerCase().includes(q) ||
      inc.errorCode.toLowerCase().includes(q) ||
      inc.symptom.toLowerCase().includes(q) ||
      inc.rootCause.toLowerCase().includes(q)
    );
  });

  const handleRunDiagnostic = (e: React.FormEvent) => {
    e.preventDefault();
    if (!diagnosticInput.trim()) return;
    const res = analyzeFlexcubeIncident(diagnosticInput);
    setDiagnosticResult(res);
  };

  return (
    <AppShell pageTitle="Gestion des Incidents RUN & AEOD FLEXCUBE" eyebrow="PILOTAGE EXPLOITATION PRODUCTION">
      <div className="space-y-6">
        {/* Hero Header */}
        <div className="bg-gradient-to-r from-red-950 via-slate-900 to-red-900 p-6 rounded-2xl text-white border border-red-800/40 shadow-xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-600 text-white">
                  INCIDENTS RUN & BATCH
                </span>
                <span className="text-xs text-red-200">Chaîne AEOD • Verrous ORA • Codes FCUBS</span>
              </div>
              <h1 className="text-2xl font-black">Supervision & Diagnostic d Incidents FLEXCUBE</h1>
              <p className="text-sm text-red-100/80 mt-1 max-w-2xl">
                Base de connaissances de production : catalogue des 20 incidents RUN majeurs, ordonnanceur des 5 phases AEOD et moteur de diagnostic par analyse de logs d erreur.
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

          {/* Assistant de Diagnostic Express */}
          <form onSubmit={handleRunDiagnostic} className="mt-5 pt-4 border-t border-red-800/40 flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={diagnosticInput}
              onChange={(e) => setDiagnosticInput(e.target.value)}
              placeholder="Collez une erreur ou log (ex: ORA-00054, ORA-01555, AC-VAL-001, timeout...)"
              className="flex-1 px-4 py-2.5 rounded-xl bg-slate-950/80 border border-red-700/50 text-white placeholder-slate-400 text-xs focus:ring-2 focus:ring-red-500 outline-none shadow-inner"
            />
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow transition cursor-pointer shrink-0"
            >
              ⚡ Analyser le log
            </button>
          </form>
        </div>

        {/* Résultat du Diagnostic Express */}
        {diagnosticResult && (
          <div className="bg-slate-900 text-white rounded-2xl p-5 border border-red-700/50 shadow-lg space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-red-400 text-sm flex items-center gap-2">
                <span>🚨 Résultat du Diagnostic Automatique</span>
                {diagnosticResult.detectedIncident && (
                  <span className="px-2 py-0.5 rounded bg-red-800 text-white text-[10px] font-bold">
                    {diagnosticResult.detectedIncident.reference}
                  </span>
                )}
              </span>
              <button
                onClick={() => setDiagnosticResult(null)}
                className="text-slate-400 hover:text-white text-xs font-bold"
              >
                Fermer ✕
              </button>
            </div>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
              <div className="text-slate-400 font-bold">Cause Racine Identifiée (RCA) :</div>
              <p className="text-slate-200">{diagnosticResult.rootCause}</p>
            </div>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
              <div className="text-slate-400 font-bold">Requête SQL d Investigation DBA :</div>
              <pre className="text-amber-400 font-mono text-[11px] overflow-x-auto">{diagnosticResult.sqlQuery}</pre>
            </div>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
              <div className="text-slate-400 font-bold">Procédure de Résolution Recommandée :</div>
              <pre className="text-emerald-400 font-mono text-[11px] whitespace-pre-wrap">{diagnosticResult.recommendedAction}</pre>
            </div>
          </div>
        )}

        {/* Onglets de Navigation */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveTab("incidents")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === "incidents"
                ? "bg-red-700 text-white shadow-md"
                : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            🚨 Catalogue des 20 Incidents RUN
          </button>
          <button
            onClick={() => setActiveTab("aeod")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === "aeod"
                ? "bg-red-700 text-white shadow-md"
                : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            ⚙️ Chaîne Batch AEOD (10 Étapes)
          </button>
          <button
            onClick={() => setActiveTab("simulator")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === "simulator"
                ? "bg-red-700 text-white shadow-md"
                : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            🛠️ Dépannage de Blocages AEOD (5 Scénarios)
          </button>
        </div>

        {/* Onglet 1 : Incidents RUN */}
        {activeTab === "incidents" && (
          <div className="space-y-4">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="🔍 Filtrer les incidents (ex: ORA-00054, provision, switch, virement)..."
              className="w-full px-4 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-red-600 outline-none bg-white"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredIncidents.map((inc) => (
                <div
                  key={inc.id}
                  className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3 text-xs"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="font-mono font-bold text-red-700 mr-2">{inc.errorCode}</span>
                      <h2 className="font-bold text-slate-900 inline">{inc.title}</h2>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold text-white shrink-0 ${
                        inc.severity === "P1"
                          ? "bg-red-600"
                          : inc.severity === "P2"
                          ? "bg-amber-600"
                          : "bg-blue-600"
                      }`}
                    >
                      {inc.severity}
                    </span>
                  </div>

                  <div className="text-slate-600"><b>Symptôme :</b> {inc.symptom}</div>

                  <div className="p-2.5 bg-slate-950 text-slate-200 rounded-lg font-mono text-[10px] overflow-x-auto">
                    {inc.typicalLog}
                  </div>

                  <div className="text-slate-700"><b>Cause Racine :</b> {inc.rootCause}</div>

                  <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100 space-y-1">
                    <span className="font-bold text-slate-900 block">Requête SQL d Investigation :</span>
                    <pre className="text-amber-800 font-mono text-[10px] overflow-x-auto">{inc.investigationQuery}</pre>
                  </div>

                  <div className="space-y-1">
                    <span className="font-bold text-slate-900 block">Procédure de Résolution :</span>
                    <ol className="list-decimal list-inside space-y-0.5 text-slate-700">
                      {inc.resolutionProcedure.map((step, sIdx) => (
                        <li key={sIdx}>{step}</li>
                      ))}
                    </ol>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Onglet 2 : Chaîne Batch AEOD */}
        {activeTab === "aeod" && (
          <div className="space-y-3">
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
              Séquencement Officiel des 10 Étapes de la Clôture AEOD :
            </h2>
            <div className="space-y-3">
              {FLEXCUBE_AEOD_STEPS.map((step) => (
                <div
                  key={step.stepNumber}
                  className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-red-100 text-red-800 font-bold flex items-center justify-center shrink-0">
                        {step.stepNumber}
                      </span>
                      <span className="font-bold text-slate-900">{step.phaseName}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 font-mono">
                        {step.phaseCode} • {step.programName}
                      </span>
                    </div>
                    <p className="text-slate-600 pl-8">{step.description}</p>
                    <div className="pl-8 text-[11px] text-red-700">
                      <b>Erreurs fréquentes :</b> {step.commonErrors.join(" | ")}
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold text-white ${
                        step.criticality === "CRITIQUE" ? "bg-red-600" : "bg-amber-600"
                      }`}
                    >
                      {step.criticality}
                    </span>
                    <div className="text-slate-500 text-[11px] mt-1">Durée : {step.estimatedDuration}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Onglet 3 : Scénarios de Dépannage AEOD */}
        {activeTab === "simulator" && (
          <div className="space-y-4">
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
              Playbooks de Déblocage Nocturne AEOD par Scénario Réel :
            </h2>
            <div className="space-y-4">
              {FLEXCUBE_AEOD_SCENARIOS.map((scen) => (
                <div
                  key={scen.id}
                  className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-slate-900 text-sm">{scen.title}</h3>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-800 font-mono">
                      Phase {scen.phase}
                    </span>
                  </div>

                  <div className="text-slate-600"><b>Symptôme :</b> {scen.symptom}</div>
                  <div className="text-slate-700"><b>Cause Racine :</b> {scen.rootCause}</div>

                  <div className="p-3 bg-slate-950 rounded-xl text-amber-400 font-mono text-[11px] overflow-x-auto">
                    {scen.sqlDiagnostic}
                  </div>

                  <div className="space-y-1">
                    <span className="font-bold text-slate-900 block">Étapes de Résolution d Urgence :</span>
                    <ol className="list-decimal list-inside space-y-1 text-slate-700">
                      {scen.resolutionSteps.map((step, idx) => (
                        <li key={idx}>{step}</li>
                      ))}
                    </ol>
                  </div>

                  <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-950 border border-emerald-200">
                    <b>Prévention :</b> {scen.prevention}
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
"""

with open("app/cbs/flexcube/incidents/page.tsx", "w", encoding="utf-8") as f:
    f.write(page_ts)
print("Created app/cbs/flexcube/incidents/page.tsx")
