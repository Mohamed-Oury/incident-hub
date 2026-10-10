// app/cbs/flexcube/copilot/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { AppShell } from "@/modules/layout/AppShell";
import { FlexcubeNeedInput, FlexcubeFullPlan, FlexcubeModule, FlexcubeVersion } from "@/modules/cbs/flexcube/types";
import { generateFlexcubePlan, reviewFlexcubePlSql } from "@/modules/cbs/flexcube/engine/flexcube-copilot-engine";

const PRESET_NEEDS: { label: string; icon: string; input: FlexcubeNeedInput }[] = [
  {
    label: "Virement de Fonds Inter-Comptes (FTTB + ACTB)",
    icon: "💸",
    input: {
      title: "Passation d un virement compte à compte avec contrôle de provision",
      functionalDescription: "Programme de débit du compte émetteur dans STTM_CUST_ACCOUNT et crédit du compte destinataire avec génération des écritures dans ACTB_DAILY_LOG et enregistrement dans FTTB_CONTRACT_MASTER.",
      module: "FT",
      targetUsers: "Gestionnaire Agence / Automate de Virements",
      knownBusinessRules: "Vérification solde disponible >= montant, comptes dans la même agence ou agence régionale, interdiction si compte frappé d opposition (AC_STAT_NO_DR = 'Y').",
      inputData: "Code agence, Compte débit, Compte crédit, Montant, Devise, Motif",
      specialConstraints: "Verrouillage avec NOWAIT pour éviter ORA-00054, pas de COMMIT intermédiaire dans le package Custom.",
      flexcubeVersion: "14.x",
      environmentType: "PLSQL_BACKEND"
    }
  },
  {
    label: "Blocage de Provision Monétique Switch (Hold ST/AC)",
    icon: "🏧",
    input: {
      title: "Réservation de solde temps réel lors d une autorisation GAB/TPE",
      functionalDescription: "Prise d une indisponibilité (Hold) sur STTM_CUST_ACCOUNT lors de la réception d un message ISO 8583 (0100/0200) depuis le Switch monétique via la Gateway.",
      module: "AC",
      targetUsers: "Passerelle Gateway Switch Monétique",
      knownBusinessRules: "Augmentation de ACY_BLOCK_BAL de la valeur autorisée. Si délai de 7 jours dépassé sans clearing, libération automatique du montant.",
      inputData: "Identifiant compte (BRANCH_CODE, CUST_AC_NO), Référence autorisation (STAN/RRN), Montant",
      specialConstraints: "Latence maximale 200ms pour tenir le SLA de la passerelle Gateway.",
      flexcubeVersion: "14.x",
      environmentType: "GATEWAY_INTERFACE"
    }
  },
  {
    label: "Contrôle d Équilibre Comptable de Clôture (AC/GL)",
    icon: "⚖️",
    input: {
      title: "Contrôle de balance journalière Débit/Crédit avant phase EOFI",
      functionalDescription: "Vérification en fin de journée que la somme des débits égale la somme des crédits sur ACTB_DAILY_LOG pour chaque devise avant consolidation dans GLTB_GL_BALANCES.",
      module: "GL",
      targetUsers: "Opérateur de Clôture / Batch Nocturne AEOD",
      knownBusinessRules: "Somme(LCY_AMOUNT) Débit = Somme(LCY_AMOUNT) Crédit pour chaque agence et devise. Tolérance d écart = 0.000.",
      inputData: "Code agence, Date de journée comptable",
      specialConstraints: "Exécution optimisée ensembliste avec BULK COLLECT pour traiter 500 000 écritures sans saturation PGA.",
      flexcubeVersion: "12.4",
      environmentType: "BATCH_AEOD"
    }
  },
  {
    label: "Échéancier Prélèvement Prêt Personnel (CLTB)",
    icon: "📅",
    input: {
      title: "Prélèvement automatique des mensualités de crédit échues",
      functionalDescription: "Parcours des échéances dans CLTB_ACCOUNT_SCHEDULES arrivées à terme et génération du débit automatique sur le compte courant de l emprunteur.",
      module: "CL",
      targetUsers: "Moteur de Prêt Batch Consumer Lending",
      knownBusinessRules: "Prélèvement prioritaire des intérêts puis du capital. Si provision insuffisante, passage en statut impayé et calcul des pénalités.",
      inputData: "Numéro de contrat prêt, Date d échéance",
      specialConstraints: "Traitement tolérant aux exceptions individuelles avec SAVE EXCEPTIONS.",
      flexcubeVersion: "UNCONFIRMED",
      environmentType: "PLSQL_BACKEND"
    }
  }
];

export default function FlexcubeCopilotPage() {
  const [activeTab, setActiveTab] = useState<"plan" | "plsql" | "sql" | "tests" | "delivery" | "audit">("plan");

  const [input, setInput] = useState<FlexcubeNeedInput>({
    title: PRESET_NEEDS[0].input.title,
    functionalDescription: PRESET_NEEDS[0].input.functionalDescription,
    module: PRESET_NEEDS[0].input.module,
    targetUsers: PRESET_NEEDS[0].input.targetUsers,
    knownBusinessRules: PRESET_NEEDS[0].input.knownBusinessRules,
    inputData: PRESET_NEEDS[0].input.inputData,
    specialConstraints: PRESET_NEEDS[0].input.specialConstraints,
    flexcubeVersion: PRESET_NEEDS[0].input.flexcubeVersion,
    environmentType: PRESET_NEEDS[0].input.environmentType,
  });

  const [plan, setPlan] = useState<FlexcubeFullPlan>(() => generateFlexcubePlan(PRESET_NEEDS[0].input));
  const [copiedCode, setCopiedCode] = useState(false);

  // Audit de code PL/SQL
  const [customPlsql, setCustomPlsql] = useState<string>(
    "CREATE OR REPLACE PROCEDURE PR_TRANSFER IS\nBEGIN\n  SELECT * FROM STTM_CUST_ACCOUNT FOR UPDATE;\n  COMMIT;\nEND;"
  );
  const [auditResult, setAuditResult] = useState(() => reviewFlexcubePlSql(customPlsql));

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    const newPlan = generateFlexcubePlan(input);
    setPlan(newPlan);
  };

  const handleSelectPreset = (preset: (typeof PRESET_NEEDS)[0]) => {
    setInput(preset.input);
    setPlan(generateFlexcubePlan(preset.input));
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <AppShell pageTitle="FLEXCUBE PL/SQL Copilot" eyebrow="STUDIO DE DÉVELOPPEMENT CORE BANKING">
      <div className="space-y-6">
        {/* En-tête avec rappel de traçabilité */}
        <div className="bg-gradient-to-r from-red-900 via-slate-900 to-red-950 p-6 rounded-2xl text-white border border-red-800/40 shadow-xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-600 text-white">
                  STUDIO ORACLE FLEXCUBE
                </span>
                <span className="text-xs text-red-200">Générateur PL/SQL Custom & DDL</span>
              </div>
              <h1 className="text-2xl font-black">Copilot de Développement FLEXCUBE</h1>
              <p className="text-sm text-red-100/80 mt-1 max-w-2xl">
                Transformez vos besoins bancaires en spécifications fonctionnelles, packages PL/SQL respectant les normes Oracle (<code className="text-red-200">_CUSTOM</code>), requêtes SQL et plans de test.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Link
                href="/cbs/copilot"
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition"
              >
                🏦 Aller vers le Copilot Amplitude (4GL)
              </Link>
            </div>
          </div>

          {/* Préréglages */}
          <div className="mt-5 pt-4 border-t border-red-800/40">
            <div className="text-xs font-bold text-red-300 uppercase tracking-wider mb-2.5">
              Préréglages bancaires prêts à l emploi :
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
              {PRESET_NEEDS.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectPreset(preset)}
                  className="text-left p-2.5 rounded-xl bg-red-950/40 hover:bg-red-800/40 border border-red-700/40 transition text-xs font-medium text-white flex items-center gap-2"
                >
                  <span className="text-base">{preset.icon}</span>
                  <span className="truncate">{preset.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Formulaire & Résultats */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Colonne Gauche : Formulaire de besoin */}
          <div className="lg:col-span-5 bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <span>📝 Définition du Besoin Bancaire</span>
            </h2>

            <form onSubmit={handleGenerate} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Titre de la fonctionnalité</label>
                <input
                  type="text"
                  value={input.title}
                  onChange={(e) => setInput({ ...input, title: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-red-600 outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Module FLEXCUBE</label>
                  <select
                    value={input.module}
                    onChange={(e) => setInput({ ...input, module: e.target.value as FlexcubeModule })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-red-600 outline-none bg-white font-medium"
                  >
                    <option value="ST">ST - Static Maintenance</option>
                    <option value="AC">AC - Accounts & Ledger</option>
                    <option value="GL">GL - General Ledger</option>
                    <option value="FT">FT - Funds Transfer</option>
                    <option value="CL">CL - Consumer Lending</option>
                    <option value="LC">LC - Letters of Credit</option>
                    <option value="DE">DE - Data Entry / Caisse</option>
                    <option value="GW">GW - Gateway / Switch</option>
                    <option value="AEOD">AEOD - Batch Clôture</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Version FLEXCUBE</label>
                  <select
                    value={input.flexcubeVersion}
                    onChange={(e) => setInput({ ...input, flexcubeVersion: e.target.value as FlexcubeVersion })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-red-600 outline-none bg-white font-medium"
                  >
                    <option value="14.x">Oracle FCUBS 14.x</option>
                    <option value="12.4">Oracle FCUBS 12.4</option>
                    <option value="UNCONFIRMED">À confirmer</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Description fonctionnelle</label>
                <textarea
                  rows={3}
                  value={input.functionalDescription}
                  onChange={(e) => setInput({ ...input, functionalDescription: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-red-600 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Règles de gestion connues</label>
                <textarea
                  rows={2}
                  value={input.knownBusinessRules}
                  onChange={(e) => setInput({ ...input, knownBusinessRules: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-red-600 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Données d entrée requises</label>
                <input
                  type="text"
                  value={input.inputData}
                  onChange={(e) => setInput({ ...input, inputData: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-red-600 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Contraintes techniques</label>
                <input
                  type="text"
                  value={input.specialConstraints}
                  onChange={(e) => setInput({ ...input, specialConstraints: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-red-600 outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 rounded-xl bg-red-700 hover:bg-red-800 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>⚡ Générer le Plan PL/SQL & Tests</span>
              </button>
            </form>
          </div>

          {/* Colonne Droite : Visualiseur de Résultats avec Onglets */}
          <div className="lg:col-span-7 bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col">
            {/* Barre d onglets */}
            <div className="flex flex-wrap items-center gap-1.5 pb-3 border-b border-slate-200">
              <button
                onClick={() => setActiveTab("plan")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${activeTab === "plan" ? "bg-red-700 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"}`}
              >
                📋 Analyse & Tâches ({plan.subTasks.length})
              </button>
              <button
                onClick={() => setActiveTab("plsql")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${activeTab === "plsql" ? "bg-red-700 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"}`}
              >
                ⚡ Code PL/SQL ({plan.plsqlProposal.packageName})
              </button>
              <button
                onClick={() => setActiveTab("sql")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${activeTab === "sql" ? "bg-red-700 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"}`}
              >
                🗄️ SQL & Indexation
              </button>
              <button
                onClick={() => setActiveTab("tests")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${activeTab === "tests" ? "bg-red-700 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"}`}
              >
                🧪 Tests Unitaires ({plan.testCases.length})
              </button>
              <button
                onClick={() => setActiveTab("delivery")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${activeTab === "delivery" ? "bg-red-700 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"}`}
              >
                📦 Déploiement & Repli
              </button>
              <button
                onClick={() => setActiveTab("audit")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${activeTab === "audit" ? "bg-red-700 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"}`}
              >
                🔍 Audit PL/SQL
              </button>
            </div>

            {/* Contenu de l onglet */}
            <div className="pt-4 flex-1">
              {/* Onglet 1 : Plan & Analyse */}
              {activeTab === "plan" && (
                <div className="space-y-4 text-xs">
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                    <div className="font-bold text-slate-900 text-sm">Objectif Fonctionnel</div>
                    <p className="text-slate-700 leading-relaxed">{plan.analysis.businessObjective}</p>
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      <span className="font-semibold text-slate-600">Tables impactées :</span>
                      {plan.analysis.flexcubeDependencies.map((dep, i) => (
                        <span key={i} className="px-2 py-0.5 rounded bg-red-100 text-red-800 font-mono font-bold">
                          {dep}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Avertissement Traçabilité */}
                  <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs space-y-1">
                    <div className="font-bold flex items-center gap-1.5 text-amber-950">
                      <span>⚠️ Note de Traçabilité & Version :</span>
                    </div>
                    <p>{plan.traceability.versionCaveat}</p>
                  </div>

                  {/* Liste des sous-tâches */}
                  <div>
                    <h3 className="font-bold text-slate-900 mb-2">Sous-tâches ordonnées de développement :</h3>
                    <div className="space-y-2">
                      {plan.subTasks.map((task) => (
                        <div key={task.id} className="p-3 bg-white rounded-xl border border-slate-200 hover:border-slate-300 transition">
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <span className="font-bold text-slate-900">{task.id} • {task.title}</span>
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                              {task.type} • {task.estimation}
                            </span>
                          </div>
                          <p className="text-slate-600">{task.description}</p>
                          <div className="text-[11px] text-slate-500 mt-1 font-mono">
                            Objets : {task.concernedObjects.join(", ")}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Onglet 2 : Code PL/SQL */}
              {activeTab === "plsql" && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700 font-mono">
                      {plan.plsqlProposal.packageName}.sql
                    </span>
                    <button
                      onClick={() => copyToClipboard(plan.plsqlProposal.packageBody)}
                      className="px-3 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition cursor-pointer"
                    >
                      {copiedCode ? "✓ Copié !" : "📋 Copier le code"}
                    </button>
                  </div>

                  <pre className="p-4 bg-slate-950 text-slate-100 rounded-xl text-[11px] font-mono overflow-x-auto max-h-[500px] leading-relaxed border border-slate-800">
                    {plan.plsqlProposal.packageBody}
                  </pre>
                </div>
              )}

              {/* Onglet 3 : SQL & Indexation */}
              {activeTab === "sql" && (
                <div className="space-y-3">
                  <h3 className="text-xs font-bold text-slate-900">Requête d accès et indexation recommandée :</h3>
                  <pre className="p-4 bg-slate-950 text-slate-100 rounded-xl text-[11px] font-mono overflow-x-auto max-h-[300px] leading-relaxed border border-slate-800">
                    {plan.sqlProposal.sqlCode}
                  </pre>

                  <h3 className="text-xs font-bold text-slate-900 pt-2">Index recommandé pour éviter les FTS :</h3>
                  <pre className="p-3 bg-slate-900 text-emerald-400 rounded-xl text-[11px] font-mono overflow-x-auto">
                    {plan.sqlProposal.indexRecommendations.join("\n")}
                  </pre>
                </div>
              )}

              {/* Onglet 4 : Cas de Tests */}
              {activeTab === "tests" && (
                <div className="space-y-2.5">
                  <h3 className="text-xs font-bold text-slate-900 mb-2">Matrice de validation et cas de tests unitaires :</h3>
                  {plan.testCases.map((tc) => (
                    <div key={tc.id} className="p-3 rounded-xl border border-slate-200 bg-slate-50 text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900">{tc.id} : {tc.title}</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800">
                          {tc.category}
                        </span>
                      </div>
                      <div className="text-slate-600"><b>Précondition :</b> {tc.preconditions}</div>
                      <div className="text-slate-600"><b>Résultat attendu :</b> {tc.expectedResult}</div>
                    </div>
                  ))}
                </div>
              )}

              {/* Onglet 5 : Déploiement & Repli */}
              {activeTab === "delivery" && (
                <div className="space-y-3 text-xs">
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                    <div className="font-bold text-slate-900">Ordre d exécution du package de release :</div>
                    <ol className="list-decimal list-inside space-y-1 text-slate-700">
                      {plan.deliveryPackage.deploymentOrder.map((step, idx) => (
                        <li key={idx}>{step}</li>
                      ))}
                    </ol>
                  </div>

                  <div className="p-3.5 bg-red-50 rounded-xl border border-red-200 space-y-1.5">
                    <div className="font-bold text-red-950">Plan de Rollback (Retour Arrière d Urgence) :</div>
                    <pre className="p-2.5 bg-white text-red-900 rounded border border-red-200 font-mono text-[11px]">
                      {plan.deliveryPackage.rollbackPlan.join("\n")}
                    </pre>
                  </div>
                </div>
              )}

              {/* Onglet 6 : Audit PL/SQL interactif */}
              {activeTab === "audit" && (
                <div className="space-y-3 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">Testeur & Auditeur de Code PL/SQL FLEXCUBE</span>
                    <span className={`px-2.5 py-1 rounded-full font-bold ${auditResult.score >= 80 ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"}`}>
                      Score Qualité : {auditResult.score} / 100
                    </span>
                  </div>

                  <textarea
                    rows={6}
                    value={customPlsql}
                    onChange={(e) => {
                      setCustomPlsql(e.target.value);
                      setAuditResult(reviewFlexcubePlSql(e.target.value));
                    }}
                    className="w-full p-3 font-mono text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-red-600 outline-none"
                    placeholder="Collez ici votre procédure PL/SQL pour vérifier les verrous, COMMIT, bind variables..."
                  />

                  <div>
                    <h4 className="font-bold text-slate-900 mb-1.5">Anomalies détectées ({auditResult.issues.length}) :</h4>
                    {auditResult.issues.length === 0 ? (
                      <div className="p-3 bg-emerald-50 text-emerald-900 rounded-xl font-medium border border-emerald-200">
                        ✓ Aucune anomalie critique détectée. Ce code respecte les règles d atomicité et de concurrence.
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {auditResult.issues.map((iss, i) => (
                          <div key={i} className="p-3 bg-red-50 rounded-xl border border-red-200 space-y-1">
                            <div className="font-bold text-red-950 flex items-center gap-1.5">
                              <span className="px-1.5 py-0.5 rounded text-[10px] bg-red-600 text-white font-bold">{iss.severity}</span>
                              <span>{iss.message}</span>
                            </div>
                            <div className="text-red-900 text-[11px]"><b>Correction :</b> {iss.fix}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
