"use client";

import { useState } from "react";
import { AppShell } from "@/modules/layout/AppShell";

interface TimerConfig {
  source: string;
  target: string;
  recommendedSec: number;
  currentSec: number;
  criticalLimitSec: number;
  failureRisk: string;
}

export default function TimeoutMatrixPage() {
  const [gabTimeout, setGabTimeout] = useState<number>(30);
  const [switchTimeout, setSwitchTimeout] = useState<number>(10);
  const [cbsTimeout, setCbsTimeout] = useState<number>(4);
  const [hsmTimeout, setHsmTimeout] = useState<number>(2);

  // Évaluation de la hiérarchie des timers
  // RÈGLE MONÉTIQUE CRITIQUE : Timer Amont > Timer Aval
  // Ex: Timer GAB (30s) > Timer Switch vers CBS (10s) > Timer CBS base (4s)
  const isHierarchyValid = gabTimeout > switchTimeout && switchTimeout > cbsTimeout && cbsTimeout > hsmTimeout;
  const isCbsTooSlowForSwitch = cbsTimeout >= switchTimeout;
  const isSwitchTooSlowForGab = switchTimeout >= gabTimeout;

  // Calcul du scénario d'incident typique
  const getScenarioDiagnosis = () => {
    if (isSwitchTooSlowForGab) {
      return {
        severity: "CRITIQUE",
        title: "Désynchronisation GAB / Switch - Risque de Reversal rejeté",
        impact: "Le GAB abandonne la transaction et émet un 0420 (Reversal) alors que le Switch attend toujours la réponse du CBS. Résultat : Débit client confirmé sur le compte sans délivrance des billets au GAB.",
        solution: "Augmenter le timer GAB à 45s ou réduire le timer Switch vers CBS à 10s maximum.",
      };
    }
    if (isCbsTooSlowForSwitch) {
      return {
        severity: "ÉLEVÉ",
        title: "Timeout Switch vers CBS (Code Réponse DE39=91)",
        impact: "Le Switch coupe la session TCP vers le CBS avant que celui-ci n'ait répondu. Le switch répond 0210 DE39=91 (Switching system inoperative) au porteur.",
        solution: "Optimiser les index sur la table ACCOUNT/BALANCE du Core Banking ou allouer un pool de connexions dédié aux requêtes monétiques.",
      };
    }
    return {
      severity: "OPTIMAL",
      title: "Chaîne de temporisation saine & conforme aux standards bancaires",
      impact: "La cascade de timers respecte le principe d'entonnoir (GAB 30s > Switch 10s > CBS 4s > HSM 2s). Aucune course critique (Race Condition) détectée.",
      solution: "Conserver cette configuration en production sous monitoring régulier.",
    };
  };

  const scenario = getScenarioDiagnosis();

  return (
    <AppShell pageTitle="Matrice des Time-Outs & Chaîne de Traitement" eyebrow="OUTILS EXPERTS MONÉTIQUE">
      <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        
        {/* Bandeau d'analyse en direct */}
        <div
          style={{
            background: scenario.severity === "CRITIQUE" ? "#fef2f2" : scenario.severity === "ÉLEVÉ" ? "#fffbeb" : "#f0fdf4",
            borderLeft: `6px solid ${scenario.severity === "CRITIQUE" ? "#dc2626" : scenario.severity === "ÉLEVÉ" ? "#d97706" : "#16a34a"}`,
            padding: "1.5rem",
            borderRadius: "12px",
            border: "1px solid var(--border-light)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.4rem" }}>
            <span style={{ fontSize: "1.2rem" }}>
              {scenario.severity === "CRITIQUE" ? "🚨" : scenario.severity === "ÉLEVÉ" ? "⚠️" : "✅"}
            </span>
            <strong style={{ fontSize: "1.1rem", color: scenario.severity === "CRITIQUE" ? "#991b1b" : scenario.severity === "ÉLEVÉ" ? "#92400e" : "#166534" }}>
              {scenario.title}
            </strong>
          </div>
          <p style={{ fontSize: "0.9rem", color: "#374151", marginBottom: "0.6rem" }}>
            {scenario.impact}
          </p>
          <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "#111827" }}>
            👉 Action recommandée : <span style={{ color: "#e60028" }}>{scenario.solution}</span>
          </div>
        </div>

        {/* Simulateur interactif des timers */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
          <div className="card">
            <h2 style={{ fontSize: "1.15rem", fontWeight: 800, marginBottom: "0.5rem" }}>
              Paramétrage des Temporisations Réseau (Secondes)
            </h2>
            <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "1.5rem" }}>
              Ajustez les valeurs pour simuler l&apos;impact des délais de réponse sur l&apos;apparition des incidents DE39=91, 96 ou 68.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", fontWeight: 700, marginBottom: "0.4rem" }}>
                  <span>1. Timer GAB (Attente réponse délivrance billets) :</span>
                  <span style={{ color: "#e60028" }}>{gabTimeout} s</span>
                </div>
                <input
                  type="range"
                  min={10}
                  max={90}
                  step={5}
                  value={gabTimeout}
                  onChange={(e) => setGabTimeout(Number(e.target.value))}
                  style={{ width: "100%", accentColor: "#e60028" }}
                />
              </div>

              <div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", fontWeight: 700, marginBottom: "0.4rem" }}>
                  <span>2. Timer Frontal Switch vers Core Banking (CBS) :</span>
                  <span style={{ color: "#e60028" }}>{switchTimeout} s</span>
                </div>
                <input
                  type="range"
                  min={2}
                  max={40}
                  step={1}
                  value={switchTimeout}
                  onChange={(e) => setSwitchTimeout(Number(e.target.value))}
                  style={{ width: "100%", accentColor: "#e60028" }}
                />
              </div>

              <div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", fontWeight: 700, marginBottom: "0.4rem" }}>
                  <span>3. Délai de réponse CBS (SLA Database / Lock) :</span>
                  <span style={{ color: "#e60028" }}>{cbsTimeout} s</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={25}
                  step={1}
                  value={cbsTimeout}
                  onChange={(e) => setCbsTimeout(Number(e.target.value))}
                  style={{ width: "100%", accentColor: "#e60028" }}
                />
              </div>

              <div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", fontWeight: 700, marginBottom: "0.4rem" }}>
                  <span>4. Timer HSM (Vérification PIN &amp; MAC) :</span>
                  <span style={{ color: "#e60028" }}>{hsmTimeout} s</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={10}
                  step={1}
                  value={hsmTimeout}
                  onChange={(e) => setHsmTimeout(Number(e.target.value))}
                  style={{ width: "100%", accentColor: "#e60028" }}
                />
              </div>
            </div>
          </div>

          <div className="card" style={{ background: "#111827", color: "#ffffff", border: "1px solid #374151" }}>
            <span style={{ fontSize: "0.75rem", letterSpacing: "0.08em", color: "#e60028", fontWeight: 700, textTransform: "uppercase" }}>
              CASCADE CHRONOLOGIQUE D&apos;UNE TRANSACTION
            </span>

            <div style={{ marginTop: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div style={{ background: "#1f2937", padding: "0.9rem", borderRadius: "8px", borderLeft: "4px solid #3b82f6" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", fontWeight: 700 }}>
                  <span>ATM / GAB (Client au distributeur)</span>
                  <span>Max {gabTimeout}s</span>
                </div>
                <p style={{ fontSize: "0.78rem", color: "#94a3b8", marginTop: "0.2rem" }}>
                  Si aucune réponse n&apos;est reçue avant {gabTimeout}s, le GAB affiche &apos;Incident technique&apos; et transmet un 0420.
                </p>
              </div>

              <div style={{ background: "#1f2937", padding: "0.9rem", borderRadius: "8px", borderLeft: "4px solid #e60028" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", fontWeight: 700 }}>
                  <span>Frontal Payway / Switch</span>
                  <span>Max {switchTimeout}s</span>
                </div>
                <p style={{ fontSize: "0.78rem", color: "#94a3b8", marginTop: "0.2rem" }}>
                  Règle impérative : Le switch doit répondre avant le GAB (marge de sécurité recommandée : 15s).
                </p>
              </div>

              <div style={{ background: "#1f2937", padding: "0.9rem", borderRadius: "8px", borderLeft: "4px solid #10b981" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", fontWeight: 700 }}>
                  <span>Core Banking (CBS / Amplitude)</span>
                  <span>Max {cbsTimeout}s</span>
                </div>
                <p style={{ fontSize: "0.78rem", color: "#94a3b8", marginTop: "0.2rem" }}>
                  Vérification du solde et réservation comptable. Au-delà de {cbsTimeout}s, risque de verrouillage table.
                </p>
              </div>

              <div style={{ background: "#1f2937", padding: "0.9rem", borderRadius: "8px", borderLeft: "4px solid #f59e0b" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", fontWeight: 700 }}>
                  <span>HSM (Cryptographie)</span>
                  <span>Max {hsmTimeout}s</span>
                </div>
                <p style={{ fontSize: "0.78rem", color: "#94a3b8", marginTop: "0.2rem" }}>
                  Vérification du PIN sous ZPK. Doit toujours répondre en moins de 500ms sous charge nominale.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Table récapitulative des timers de référence */}
        <div className="card">
          <h2 style={{ fontSize: "1.15rem", fontWeight: 800, marginBottom: "0.5rem" }}>
            Référentiel des Temporisations Recommandées (Standards Réseau &amp; VISA/Mastercard)
          </h2>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Liaison / Interface</th>
                  <th>Timer Min</th>
                  <th>Timer Recommandé</th>
                  <th>Code Erreur Déclenché en Dépassement</th>
                  <th>Impact Exploitation</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><b>GAB ➔ Switch</b></td>
                  <td>30 s</td>
                  <td><b>45 s</b></td>
                  <td><code>DE39 = 68 (Response received too late)</code></td>
                  <td>Reversal 0420 automatique émis par le GAB.</td>
                </tr>
                <tr>
                  <td><b>Switch ➔ CBS (Core Banking)</b></td>
                  <td>5 s</td>
                  <td><b>8 s - 10 s</b></td>
                  <td><code>DE39 = 91 (Issuer or switch inoperative)</code></td>
                  <td>Rejet transaction, aucun débit porté au compte.</td>
                </tr>
                <tr>
                  <td><b>Switch ➔ Réseau International (Visa / MC)</b></td>
                  <td>4 s</td>
                  <td><b>6 s</b></td>
                  <td><code>DE39 = 96 (System error)</code></td>
                  <td>Stand-In Authorization (STIP) déclenchée par Visa.</td>
                </tr>
                <tr>
                  <td><b>Switch ➔ HSM</b></td>
                  <td>1 s</td>
                  <td><b>2 s</b></td>
                  <td><code>DE39 = A0 (Cryptographic failure)</code></td>
                  <td>Échec vérification PIN / MAC, blocage de la file HSM.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
