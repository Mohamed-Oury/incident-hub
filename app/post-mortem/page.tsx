"use client";

import { useState } from "react";
import { AppShell } from "@/modules/layout/AppShell";

export default function PostMortemPage() {
  const [incidentRef, setIncidentRef] = useState<string>("INC-2026-0917-GAB");
  const [title, setTitle] = useState<string>("Interruption Retraits GAB - Time-Out CBS et Reversals rejetés");
  const [component, setComponent] = useState<string>("GAB / Switch / CBS");
  const [impactDuration, setImpactDuration] = useState<string>("45 minutes");
  const [financialImpact, setFinancialImpact] = useState<string>("12 clients débités à tort (total 1 800 000 XOF)");
  const [rootCause, setRootCause] = useState<string>(
    "Saturation des connexions sur la base de données du Core Banking (CBS), provoquant un dépassement du Timer Switch (10s) et l'émission en cascade de messages 0420 (Reversal) rejetés en DE39=91."
  );
  const [correctiveActions, setCorrectiveActions] = useState<string>(
    "1. Recrédit immédiat des 12 comptes clients via script de compensation automatique.\n2. Augmentation du pool de connexions dédié aux requêtes monétiques CBS de 20 à 60 sessions.\n3. Ajustement du timer GAB à 45s pour éviter les faux abandons clients."
  );

  const [generatedDoc, setGeneratedDoc] = useState<string | null>(null);

  const handleGenerate = () => {
    const doc = `# RAPPORT D'INCIDENT MAJEUR & POST-MORTEM (RCA BANKING)
**Référence :** ${incidentRef}
**Date du rapport :** ${new Date().toLocaleDateString("fr-FR")} à ${new Date().toLocaleTimeString("fr-FR")}
**Auteur :** M.Oury — Ingénieur IT BANKING & Expert Monétique - CBS
**Statut :** OFFICIEL & VALIDÉ (Direction Générale / Audit Monétique)

---

### 1. SYNTHÈSE EXÉCUTIVE
- **Intitulé :** ${title}
- **Composant(s) impacté(s) :** ${component}
- **Durée de l'indisponibilité :** ${impactDuration}
- **Impact financier & clients :** ${financialImpact}

---

### 2. CHRONOLOGIE DE L'ÉVÉNEMENT (TIMELINE D'EXPLOITATION)
| Heure | Événement technique | Détection / Action |
|---|---|---|
| T0 | Augmentation soudaine du volume de retraits GAB | Alertes système |
| T0 + 10m | Augmentation des codes réponses DE39 = 91 et 68 | Déclenchement cellule de crise |
| T0 + 25m | Identification du goulot d'étranglement sur le Core Banking | Intervention administrateur DBA |
| T0 + 40m | Libération des verrous et rétablissement du flux ISO 8583 | Reprise du trafic normal |
| T0 + 45m | Contrôle de fin d'incident et validation du service | Clôture de l'incident |

---

### 3. ANALYSE TECHNIQUE & CAUSE RACINE (RCA - 5 POURQUOI)
${rootCause}

---

### 4. PREUVES TECHNIQUES ISO 8583 & TRACABILITÉ
- **Message de requête :** \`MTI 0200\` (Retrait GAB)
- **Code retour constaté :** \`DE39 = 91 (Switching system inoperative / Timeout)\`
- **Reversal associé :** \`MTI 0420 (Reversal Notification)\` avec DE90 conforme.

---

### 5. PLAN D'ACTIONS CORRECTIVES & PRÉVENTIVES (CAPA)
${correctiveActions}

---
*Document généré automatiquement via la plateforme M.OURY INCIDENT HUB - Tous droits réservés.*
`;
    setGeneratedDoc(doc);
  };

  return (
    <AppShell pageTitle="Générateur de Post-Mortem & Fiche d'Incident" eyebrow="OUTILS EXPERTS MONÉTIQUE">
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
        
        {/* Formulaire de saisie de l'incident */}
        <div className="card">
          <h2 style={{ fontSize: "1.15rem", fontWeight: 800, marginBottom: "0.5rem" }}>
            Générateur de Rapport Post-Mortem d&apos;Incident
          </h2>
          <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "1.25rem" }}>
            Structurez en quelques secondes un rapport technique conforme aux exigences de l&apos;Audit Bancaire, du Risque Opérationnel et des comités de crise.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
            <div>
              <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, marginBottom: "0.2rem" }}>
                Référence Incident :
              </label>
              <input
                type="text"
                value={incidentRef}
                onChange={(e) => setIncidentRef(e.target.value)}
                className="input"
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, marginBottom: "0.2rem" }}>
                Titre de l&apos;incident :
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="input"
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, marginBottom: "0.2rem" }}>
                  Composant :
                </label>
                <input
                  type="text"
                  value={component}
                  onChange={(e) => setComponent(e.target.value)}
                  className="input"
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, marginBottom: "0.2rem" }}>
                  Durée d&apos;impact :
                </label>
                <input
                  type="text"
                  value={impactDuration}
                  onChange={(e) => setImpactDuration(e.target.value)}
                  className="input"
                />
              </div>
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, marginBottom: "0.2rem" }}>
                Impact financier &amp; clients :
              </label>
              <input
                type="text"
                value={financialImpact}
                onChange={(e) => setFinancialImpact(e.target.value)}
                className="input"
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, marginBottom: "0.2rem" }}>
                Cause Racine Validée (RCA) :
              </label>
              <textarea
                rows={3}
                value={rootCause}
                onChange={(e) => setRootCause(e.target.value)}
                className="input"
                style={{ resize: "vertical" }}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, marginBottom: "0.2rem" }}>
                Plan d&apos;Actions Correctives (CAPA) :
              </label>
              <textarea
                rows={3}
                value={correctiveActions}
                onChange={(e) => setCorrectiveActions(e.target.value)}
                className="input"
                style={{ resize: "vertical" }}
              />
            </div>

            <button
              type="button"
              onClick={handleGenerate}
              className="btn-primary"
              style={{ alignSelf: "flex-start", marginTop: "0.5rem" }}
            >
              Générer le Rapport Post-Mortem →
            </button>
          </div>
        </div>

        {/* Aperçu et Téléchargement du Rapport */}
        <div className="card" style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
            <h3 style={{ fontSize: "1.1rem", fontWeight: 800 }}>Aperçu du Rapport Bancaire</h3>
            {generatedDoc && (
              <button
                type="button"
                onClick={() => {
                  const blob = new Blob([generatedDoc], { type: "text/markdown" });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = `PostMortem_${incidentRef}.md`;
                  a.click();
                }}
                className="btn-secondary"
                style={{ fontSize: "0.8rem", padding: "0.4rem 0.8rem" }}
              >
                📥 Télécharger (.md)
              </button>
            )}
          </div>

          {generatedDoc ? (
            <div
              style={{
                flex: 1,
                background: "#0f172a",
                color: "#e2e8f0",
                padding: "1.25rem",
                borderRadius: "8px",
                fontFamily: "monospace",
                fontSize: "0.82rem",
                overflowY: "auto",
                whiteSpace: "pre-wrap",
                lineHeight: "1.5",
                border: "1px solid #334155",
                maxHeight: "680px",
              }}
            >
              {generatedDoc}
            </div>
          ) : (
            <div
              style={{
                flex: 1,
                display: "grid",
                placeItems: "center",
                background: "#f8fafc",
                borderRadius: "8px",
                border: "2px dashed #cbd5e1",
                padding: "2rem",
                textAlign: "center",
                color: "#64748b",
              }}
            >
              <div>
                <span style={{ fontSize: "2.5rem", display: "block", marginBottom: "0.5rem" }}>📑</span>
                <p style={{ fontWeight: 600 }}>Aucun rapport généré pour le moment.</p>
                <p style={{ fontSize: "0.82rem", marginTop: "0.25rem" }}>
                  Renseignez les éléments à gauche et cliquez sur &apos;Générer&apos; pour obtenir la fiche officielle.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
