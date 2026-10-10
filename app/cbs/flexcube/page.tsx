"use client";

import Link from "next/link";
import { AppShell } from "@/modules/layout/AppShell";
import { FLEXCUBE_SCHEMA_TABLES } from "@/modules/cbs/flexcube/data/flexcube-schema-tables";
import { FLEXCUBE_AEOD_STEPS } from "@/modules/cbs/flexcube/data/flexcube-aeod-data";
import { FLEXCUBE_INCIDENTS } from "@/modules/cbs/flexcube/data/flexcube-incidents-data";
import { FLEXCUBE_CHEAT_SHEET } from "@/modules/cbs/flexcube/data/flexcube-cheat-sheet-data";
import { FLEXCUBE_GRADES, FLEXCUBE_EXAMS } from "@/modules/cbs/flexcube/data/flexcube-training-data";

export default function FlexcubeDashboardPage() {
  const p1IncidentsCount = FLEXCUBE_INCIDENTS.filter((i) => i.severity === "P1").length;

  const quickModules = [
    {
      title: "FLEXCUBE PL/SQL Copilot",
      count: "Studio RAD / ODT & PL/SQL",
      desc: "Transformation d un besoin bancaire en package PL/SQL Custom (_CUSTOM), contrôles NOWAIT, scripts DDL et tests",
      href: "/cbs/flexcube/copilot",
      icon: "🤖",
      badge: "Nouveau • Studio",
      badgeColor: "#8b5cf6",
    },
    {
      title: "Antisèche Officielle FLEXCUBE",
      count: `${FLEXCUBE_CHEAT_SHEET.length} Fiches Pratiques`,
      desc: "Mémento complet : architecture 3-tier, schémas ST/AC/GL, conventions PL/SQL, chaîne AEOD, traces debug et Gateway",
      href: "/cbs/flexcube/antiseche",
      icon: "🧠",
      badge: "Antisèche",
      badgeColor: "#10b981",
    },
    {
      title: "Cursus Certifiant & 5 Grades",
      count: "5 Niveaux de Qualification",
      desc: "Parcours officiel de l Apprenti Core au niveau Architecte Gateway, avec ressources documentaires Oracle University",
      href: "/cbs/flexcube/training",
      icon: "🎓",
      badge: "Cursus",
      badgeColor: "#0284c7",
    },
    {
      title: "Centre d Examen Academy",
      count: `${FLEXCUBE_EXAMS.length} Questions Officielles`,
      desc: "Tests de passage de grade QCM par niveau, calcul de score, scoring d XP et délivrance de badges officiels",
      href: "/cbs/flexcube/academy",
      icon: "🎯",
      badge: "Certification",
      badgeColor: "#7c3aed",
    },
    {
      title: "Dictionnaire Tables & Schémas",
      count: `${FLEXCUBE_SCHEMA_TABLES.length} Tables Centrales`,
      desc: "Catalogue interactif : STTM_CUSTOMER, STTM_CUST_ACCOUNT, ACTB_DAILY_LOG, GLTB_GL_BALANCES, FTTB_CONTRACT_MASTER",
      href: "/cbs/flexcube/knowledge",
      icon: "🗄️",
      badge: "Base de Données",
      badgeColor: "#d97706",
    },
    {
      title: "Chaîne Batch AEOD & Incidents",
      count: `${FLEXCUBE_AEOD_STEPS.length} Étapes • ${FLEXCUBE_INCIDENTS.length} Incidents RCA`,
      desc: "Pilotage nocturne des 5 phases (PEOD à BOD), résolution des verrous ORA-00054, ORA-01555 et codes FCUBS",
      href: "/cbs/flexcube/incidents",
      icon: "⚙️",
      badge: `${p1IncidentsCount} P1 Critiques`,
      badgeColor: "#dc2626",
    },
  ];

  return (
    <AppShell pageTitle="Oracle FLEXCUBE Universal Banking" eyebrow="ESPACE CORE BANKING ORACLE">
      <div className="space-y-6">
        {/* Switcher d'environnement CBS */}
        <div className="bg-gradient-to-r from-red-950 via-slate-900 to-red-900 rounded-2xl p-6 text-white shadow-xl border border-red-800/40">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-600 text-white tracking-wider">
                  ORACLE FINANCIAL SERVICES
                </span>
                <span className="text-xs text-red-200">Universal Banking Platform (FCUBS)</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
                Oracle FLEXCUBE Hub & Copilot
              </h1>
              <p className="text-red-100/80 text-sm mt-1 max-w-2xl">
                Plateforme d ingénierie, assistance au développement PL/SQL, supervision du batch AEOD et certification métier dédiée au Core Banking Oracle FLEXCUBE.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Link
                href="/cbs"
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition flex items-center gap-2 shadow"
              >
                <span>🏦 Basculer vers Sopra Amplitude</span>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-red-800/40">
            <div className="bg-red-900/30 rounded-xl p-3 border border-red-700/30">
              <div className="text-xs text-red-200 font-medium">Tables Documentées</div>
              <div className="text-xl font-bold text-white mt-0.5">{FLEXCUBE_SCHEMA_TABLES.length}</div>
            </div>
            <div className="bg-red-900/30 rounded-xl p-3 border border-red-700/30">
              <div className="text-xs text-red-200 font-medium">Étapes Clôture AEOD</div>
              <div className="text-xl font-bold text-white mt-0.5">{FLEXCUBE_AEOD_STEPS.length}</div>
            </div>
            <div className="bg-red-900/30 rounded-xl p-3 border border-red-700/30">
              <div className="text-xs text-red-200 font-medium">Fiches Antisèche</div>
              <div className="text-xl font-bold text-white mt-0.5">{FLEXCUBE_CHEAT_SHEET.length}</div>
            </div>
            <div className="bg-red-900/30 rounded-xl p-3 border border-red-700/30">
              <div className="text-xs text-red-200 font-medium">Questions Examens</div>
              <div className="text-xl font-bold text-white mt-0.5">{FLEXCUBE_EXAMS.length}</div>
            </div>
          </div>
        </div>

        {/* Grille des modules fonctionnels */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {quickModules.map((m) => (
            <Link
              key={m.href}
              href={m.href}
              className="group block bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md hover:border-red-600/40 transition duration-200"
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <span className="text-3xl p-2 rounded-xl bg-slate-50 group-hover:bg-red-50 transition">
                  {m.icon}
                </span>
                <span
                  className="px-2.5 py-1 rounded-full text-xs font-bold text-white"
                  style={{ backgroundColor: m.badgeColor }}
                >
                  {m.badge}
                </span>
              </div>
              <h2 className="text-base font-bold text-slate-900 group-hover:text-red-700 transition">
                {m.title}
              </h2>
              <div className="text-xs font-semibold text-slate-500 mt-0.5">{m.count}</div>
              <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">
                {m.desc}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
