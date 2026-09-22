"use client";

import { useState } from "react";
import { AppShell } from "@/modules/layout/AppShell";

interface RunCheckItem {
  id: string;
  category: "SOD_MATIN" | "JOURNEE_FLUX" | "EOD_SOIR" | "MEP_CHECKLIST";
  title: string;
  targetSystem: string;
  commandOrCheck: string;
  expectedResult: string;
  criticality: "CRITIQUE" | "MAJEURE" | "MINEURE";
  troubleshootingTip: string;
}

const RUN_CHECKS: RunCheckItem[] = [
  // --- SOD (Démarrage de journée) ---
  {
    id: "sod_01",
    category: "SOD_MATIN",
    title: "Vérification des Heartbeats Réseau Switch (Echo Tests 0800)",
    targetSystem: "Switch Monétique (Payway / Frontal)",
    commandOrCheck: "Inspecter les logs 0800 / 0810 sur les liaisons Visa, Mastercard, GIM-UEMOA, GIMAC, UPI",
    expectedResult: "Trame 0810 avec DE39=00 reçue toutes les 30 à 60 secondes sur chaque canal IP/VPN",
    criticality: "CRITIQUE",
    troubleshootingTip: "Si time-out sur une liaison, contacter immédiatement le NOC du scheme concerné et basculer sur le lien VPN secours.",
  },
  {
    id: "sod_02",
    category: "SOD_MATIN",
    title: "Healthcheck & Disponibilité Boîtiers HSM (Thales / Atalla)",
    targetSystem: "HSM Host PayShield / Atalla",
    commandOrCheck: "Commande console 'NO' (Thales payShield) ou ping TCP port 8000/9000",
    expectedResult: "HSM 'ONLINE', état 'AUTHORIZED', batteries saines, clés LMK chargées sans alerte tamper",
    criticality: "CRITIQUE",
    troubleshootingTip: "Si statut 'OFFLINE' ou LMK absent, ne jamais redémarrer brutalement : appeler les officiers de sécurité LMK.",
  },
  {
    id: "sod_03",
    category: "SOD_MATIN",
    title: "Connectivité & Files d'Attente Switch ↔ CBS (Amplitude)",
    targetSystem: "Interface ISO / Middleware CBS",
    commandOrCheck: "Vérifier le statut du connecteur TCP/MQ et la profondeur de file (Queue Depth)",
    expectedResult: "Queue Depth = 0, latence < 120ms, socket CBS en écoute active",
    criticality: "CRITIQUE",
    troubleshootingTip: "Si accumulation de messages, redémarrer le daemon d'interface CBS et purger les messages orphelins.",
  },

  // --- JOURNEE_FLUX (Supervision temps réel) ---
  {
    id: "jour_01",
    category: "JOURNEE_FLUX",
    title: "Supervision Taux d'Acceptation Global (Émission & Acquisition)",
    targetSystem: "Plateforme Monétique (Payway)",
    commandOrCheck: "Tableau de bord temps réel des transactions 0200 / 0210 par tranche de 5 minutes",
    expectedResult: "Taux de succès global >= 96%. Taux de DE39=91/96 < 0.5%",
    criticality: "CRITIQUE",
    troubleshootingTip: "Pic de DE39=91 (Issuer Inoperative) : isoler le BIN émetteur défaillant pour éviter l'engorgement du switch.",
  },
  {
    id: "jour_02",
    category: "JOURNEE_FLUX",
    title: "Détection des Reversals Massifs (0420 / 0400 Auto-Reversals)",
    targetSystem: "Frontal d'Acquisition (GAB / TPE)",
    commandOrCheck: "Filtrer les messages 0420 par code motif DE90 / DE39",
    expectedResult: "Taux de reversals < 1.5% des transactions totales",
    criticality: "MAJEURE",
    troubleshootingTip: "Si hausse anormale sur un groupe de GAB, suspecter un bourrage mécanique généralisé ou un time-out frontal trop court (< 25s).",
  },
  {
    id: "jour_03",
    category: "JOURNEE_FLUX",
    title: "Surveillance de la Fraude & Rejets ARQC / PIN",
    targetSystem: "Moteur de Risque & Cryptographie",
    commandOrCheck: "Alertes sur rafales de DE39=55 (Wrong PIN) ou DE39=84 (Invalid ARQC) sur un même terminal",
    expectedResult: "Pas plus de 3 tentatives infructueuses consécutives sur une même carte",
    criticality: "MAJEURE",
    troubleshootingTip: "Déclencher la mise en liste noire (Stop List) temporaire de la carte si tentative d'attaque par brute force.",
  },

  // --- EOD_SOIR (Fin de journée & Clôtures) ---
  {
    id: "eod_01",
    category: "EOD_SOIR",
    title: "Contrôle des Télécollectes Marchands (TPE / POS)",
    targetSystem: "Serveur de Télécollecte TPE",
    commandOrCheck: "Rapport d'appel nocturne des TPE (Messages 0500 / Fichiers TLT)",
    expectedResult: "Taux de télécollecte réussie > 98% des TPE actifs du parc marchand",
    criticality: "MAJEURE",
    troubleshootingTip: "Programmer une seconde tentative automatique à 03h00 du matin pour les TPE n'ayant pas accroché le réseau.",
  },
  {
    id: "eod_02",
    category: "EOD_SOIR",
    title: "Arrêt Comptable & Balance des Automates (GAB / ATM)",
    targetSystem: "Supervision GAB & Intégration CBS",
    commandOrCheck: "Génération des fichiers d'arrêts GAB (compteurs physiques vs logiques)",
    expectedResult: "Écart de caisse GAB = 0 XOF / XAF, fichier d'arrêt injecté avant le batch EOD Amplitude",
    criticality: "CRITIQUE",
    troubleshootingTip: "En cas d'écart de caisse persistant, isoler l'EJ (Electronic Journal) pour audit le lendemain matin.",
  },
  {
    id: "eod_03",
    category: "EOD_SOIR",
    title: "Génération & Transmission des Fichiers Clearing Schemes",
    targetSystem: "Module Clearing (Visa Base II, MC IPM, GIM-UEMOA, GIMAC)",
    commandOrCheck: "Génération des lots de présentation financière avant l'heure de cut-off scheme",
    expectedResult: "Accusé de réception (ACK) reçu de Visa / MC / GIM avant l'heure limite (ex: 22h00 GMT)",
    criticality: "CRITIQUE",
    troubleshootingTip: "Tout retard de fichier de clearing entraîne des pénalités financières contractuelles de retard (Late Presentment Fees).",
  },

  // --- MEP_CHECKLIST (Mises en production & Changements) ---
  {
    id: "mep_01",
    category: "MEP_CHECKLIST",
    title: "Sauvegarde Complète à Froid / Snapshot Base Switch",
    targetSystem: "SGBD Switch (Oracle / PostgreSQL)",
    commandOrCheck: "Création d'un point de restauration garanti avant toute modification de schéma ou binaire",
    expectedResult: "Snapshot confirmé 'CONSISTENT' avec RPO=0",
    criticality: "CRITIQUE",
    troubleshootingTip: "Ne jamais démarrer une MEP sans confirmation écrite de la fin de sauvegarde.",
  },
  {
    id: "mep_02",
    category: "MEP_CHECKLIST",
    title: "Injection Sécurisée des Nouvelles Clés (ZPK / TMK / ZAK)",
    targetSystem: "HSM & Frontal Monétique",
    commandOrCheck: "Vérification des bordereaux KCV signés par les 2 custodians agréés",
    expectedResult: "KCV calculé identique au 6e caractère hexadécimal près",
    criticality: "CRITIQUE",
    troubleshootingTip: "En cas d'écart KCV d'un seul caractère, stopper immédiatement le déploiement.",
  },
  {
    id: "mep_03",
    category: "MEP_CHECKLIST",
    title: "Banc de Tests Pilotes Réels (TPE & GAB Dédiés)",
    targetSystem: "Environnement Pilote en Production",
    commandOrCheck: "Passage d'un retrait GAB 1 000 F et d'un paiement TPE 500 F avec cartes de test",
    expectedResult: "Autorisation 0210 DE39=00, impression ticket conforme, imputation correcte au CBS",
    criticality: "CRITIQUE",
    troubleshootingTip: "Si le test pilote échoue, appliquer le plan de rollback pré-approuvé sous 15 minutes.",
  },
];

const SCHEMES_MATRIX = [
  {
    name: "GIM-UEMOA",
    scope: "Régional UEMOA (8 pays)",
    currency: "XOF (952)",
    protocols: "ISO 8583 v87 / v93 adapté GIM",
    clearingCycle: "Quotidien (Cut-off 18h00 GMT, compensation multilatérale BCEAO)",
    keyRules: "Routage interbancaire direct ou via switch régional. Support carte à puce EMV GIM et contactless. Gestion des reversals 0420 avec DE90 obligatoire.",
  },
  {
    name: "GIMAC",
    scope: "Régional CEMAC (6 pays)",
    currency: "XAF (950)",
    protocols: "ISO 8583 spécifique GIMAC + API Mobile",
    clearingCycle: "Quotidien (Compensation Banque des États de l'Afrique Centrale - BEAC)",
    keyRules: "Interopérabilité totale GAB, TPE et Portefeuille Mobile (Mobile Money). Contrôle strict des plafonds interbancaires régionaux.",
  },
  {
    name: "UPI (UnionPay International)",
    scope: "International (Chine & Global)",
    currency: "Multi-devises (Règlement USD/EUR/XOF)",
    protocols: "ISO 8583 v87 spécifique UPI / PBOC 3.0",
    clearingCycle: "Cycles quotidiens multiples (Fichiers de clearing UPI EP)",
    keyRules: "Authentification EMV selon spécifications PBOC 3.0. Forte exigence sur le support de l'acquisition des touristes et commerces marchands.",
  },
  {
    name: "Visa International",
    scope: "Mondial (Global Network)",
    currency: "Multi-devises (USD / EUR / Monnaies locales)",
    protocols: "Visa Dual-Message (VIP SMS) / ISO 8583",
    clearingCycle: "Fichiers Base II (Format TCE / TC05), plusieurs cycles quotidiens",
    keyRules: "Validation obligatoire CVV/iCVV, ARQC strict, gestion des litiges VROL (Visa Resolve Online), respect des SLA réseau 99.99%.",
  },
  {
    name: "Mastercard",
    scope: "Mondial (Banknet Network)",
    currency: "Multi-devises (USD / EUR / Monnaies locales)",
    protocols: "Mastercard Dual & Single Message (MIP / CIS)",
    clearingCycle: "Fichiers IPM (Messages 1240 First Presentment, 1442 Chargeback)",
    keyRules: "Routing table IPM, contrôle strict CVC2/Chip CVC3, Mastercom pour arbitrage, pénalités sur les messages mal formés.",
  },
];

export default function RunSupervisionPage() {
  const [activeCategory, setActiveCategory] = useState<"SOD_MATIN" | "JOURNEE_FLUX" | "EOD_SOIR" | "MEP_CHECKLIST" | "SCHEMES">("SOD_MATIN");
  const [completedChecks, setCompletedChecks] = useState<Record<string, boolean>>({});

  const toggleCheck = (id: string) => {
    setCompletedChecks((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredChecks = RUN_CHECKS.filter((c) => c.category === activeCategory);
  const totalInCategory = filteredChecks.length;
  const passedInCategory = filteredChecks.filter((c) => completedChecks[c.id]).length;

  return (
    <AppShell pageTitle="Supervision & Runbook Quotidien Monétique" eyebrow="EXPLOITATION & RUN MONÉTIQUE">
      <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        {/* Navigation thématique */}
        <div style={{ display: "flex", gap: "0.5rem", borderBottom: "1px solid var(--border-light)", paddingBottom: "0.5rem", flexWrap: "wrap" }}>
          <button
            onClick={() => setActiveCategory("SOD_MATIN")}
            className={`btn-ghost ${activeCategory === "SOD_MATIN" ? "btn-primary" : ""}`}
          >
            ☀️ 1. Contrôles Matinaux (SOD)
          </button>
          <button
            onClick={() => setActiveCategory("JOURNEE_FLUX")}
            className={`btn-ghost ${activeCategory === "JOURNEE_FLUX" ? "btn-primary" : ""}`}
          >
            📊 2. Supervision Flux &amp; Reversals
          </button>
          <button
            onClick={() => setActiveCategory("EOD_SOIR")}
            className={`btn-ghost ${activeCategory === "EOD_SOIR" ? "btn-primary" : ""}`}
          >
            🌙 3. Clôtures Soir &amp; Clearing (EOD)
          </button>
          <button
            onClick={() => setActiveCategory("MEP_CHECKLIST")}
            className={`btn-ghost ${activeCategory === "MEP_CHECKLIST" ? "btn-primary" : ""}`}
          >
            🚀 4. Checklists Mises en Production (MEP)
          </button>
          <button
            onClick={() => setActiveCategory("SCHEMES")}
            className={`btn-ghost ${activeCategory === "SCHEMES" ? "btn-primary" : ""}`}
          >
            🌐 5. Référentiel Schemes (UPI, GIM, Visa, MC)
          </button>
        </div>

        {activeCategory !== "SCHEMES" ? (
          <div>
            {/* Barre de progression du Runbook */}
            <div className="card" style={{ marginBottom: "1rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--text-secondary)" }}>
                  Progression du Runbook ({activeCategory.replace("_", " ")}) :
                </span>
                <p style={{ fontSize: "1.2rem", fontWeight: 900, color: "#111827", marginTop: "0.2rem" }}>
                  {passedInCategory} / {totalInCategory} points de contrôle validés ({Math.round((passedInCategory / totalInCategory) * 100)}%)
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  const newChecks = { ...completedChecks };
                  filteredChecks.forEach((c) => (newChecks[c.id] = true));
                  setCompletedChecks(newChecks);
                }}
                className="btn-ghost"
                style={{ fontSize: "0.8rem", color: "#10b981", border: "1px solid #10b981" }}
              >
                ✓ Tout cocher comme conforme
              </button>
            </div>

            {/* Liste des points de contrôle */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {filteredChecks.map((item) => {
                const isChecked = !!completedChecks[item.id];
                return (
                  <div
                    key={item.id}
                    className="card"
                    style={{
                      borderLeft: `5px solid ${isChecked ? "#10b981" : item.criticality === "CRITIQUE" ? "#e60028" : "#f59e0b"}`,
                      background: isChecked ? "#f0fdf4" : "var(--bg-surface)",
                      transition: "all 0.2s ease",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <div style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleCheck(item.id)}
                          style={{ width: "1.2rem", height: "1.2rem", marginTop: "0.2rem", cursor: "pointer" }}
                        />
                        <div>
                          <h3 style={{ fontSize: "1rem", fontWeight: 800, color: "#111827", textDecoration: isChecked ? "line-through" : "none" }}>
                            {item.title}
                          </h3>
                          <span style={{ fontSize: "0.78rem", color: "var(--text-secondary)", display: "inline-block", marginTop: "0.2rem" }}>
                            Cible : <b>{item.targetSystem}</b>
                          </span>
                        </div>
                      </div>

                      <span
                        style={{
                          fontSize: "0.72rem",
                          fontWeight: 800,
                          padding: "0.2rem 0.6rem",
                          borderRadius: "4px",
                          background: item.criticality === "CRITIQUE" ? "#fef2f2" : "#fffbeb",
                          color: item.criticality === "CRITIQUE" ? "#e60028" : "#b45309",
                        }}
                      >
                        {item.criticality}
                      </span>
                    </div>

                    <div style={{ marginTop: "0.75rem", background: isChecked ? "#e2e8f0" : "#f8fafc", padding: "0.75rem", borderRadius: "6px", fontSize: "0.85rem" }}>
                      <p style={{ margin: "0 0 0.4rem 0" }}>
                        🔍 <b>Action / Commande d&apos;exploitation :</b> <code>{item.commandOrCheck}</code>
                      </p>
                      <p style={{ margin: 0, color: "#047857" }}>
                        🎯 <b>Résultat attendu :</b> {item.expectedResult}
                      </p>
                    </div>

                    <div style={{ marginTop: "0.5rem", fontSize: "0.8rem", color: "#64748b" }}>
                      💡 <b>Plan d&apos;escalade &amp; Troubleshooting :</b> {item.troubleshootingTip}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          /* SECTION RÉFÉRENTIEL SCHEMES */
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <div className="card">
              <h2 style={{ fontSize: "1.2rem", fontWeight: 800, marginBottom: "0.4rem" }}>
                Référentiel des Réseaux &amp; Schemes (Régionaux &amp; Internationaux)
              </h2>
              <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                Spécificités opérationnelles pour l&apos;exploitation monétique : protocoles, devises, cycles de clearing et réglementations.
              </p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "1rem" }}>
              {SCHEMES_MATRIX.map((scheme) => (
                <div key={scheme.name} className="card" style={{ borderLeft: "5px solid #1e40af" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                    <h3 style={{ fontSize: "1.1rem", fontWeight: 800, color: "#1e3a8a" }}>
                      {scheme.name}
                    </h3>
                    <span style={{ fontSize: "0.75rem", background: "#dbeafe", color: "#1e40af", padding: "0.2rem 0.6rem", borderRadius: "4px", fontWeight: 700 }}>
                      Périmètre : {scheme.scope}
                    </span>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "0.75rem", fontSize: "0.85rem", background: "#f8fafc", padding: "0.75rem", borderRadius: "6px" }}>
                    <div>
                      <span style={{ color: "#64748b", fontSize: "0.75rem" }}>Devise de Référence :</span>
                      <p style={{ fontWeight: 700, margin: "0.2rem 0 0 0" }}>{scheme.currency}</p>
                    </div>
                    <div>
                      <span style={{ color: "#64748b", fontSize: "0.75rem" }}>Protocole / Format :</span>
                      <p style={{ fontWeight: 700, margin: "0.2rem 0 0 0" }}>{scheme.protocols}</p>
                    </div>
                    <div>
                      <span style={{ color: "#64748b", fontSize: "0.75rem" }}>Cycle de Clearing :</span>
                      <p style={{ fontWeight: 700, margin: "0.2rem 0 0 0" }}>{scheme.clearingCycle}</p>
                    </div>
                  </div>

                  <p style={{ marginTop: "0.75rem", fontSize: "0.85rem", color: "#334155", lineHeight: "1.5" }}>
                    📌 <b>Règles clés d&apos;exploitation :</b> {scheme.keyRules}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
