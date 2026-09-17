"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const STEPS = [
  { id: 1, name: "Symptôme", desc: "Comportement observé & message d'erreur" },
  { id: 2, name: "Faits observés", desc: "Chiffres, volumétrie et constat objectif" },
  { id: 3, name: "Périmètre", desc: "Canaux, TPE/GAB, banques et filiales impactées" },
  { id: 4, name: "Point de rupture", desc: "Composant technique défaillant dans la chaîne" },
  { id: 5, name: "Hypothèses", desc: "Pistes d'analyse sans conclusion hâtive" },
  { id: 6, name: "Preuves / Logs", desc: "Extraits de trames ISO 8583 masquées et logs" },
  { id: 7, name: "Cause racine (RCA)", desc: "Justification technique formellement prouvée" },
  { id: 8, name: "Correction & Prévention", desc: "Actions curatives et contrôle post-action" },
];

export function DiagnosticWizard() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [createdRef, setCreatedRef] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Formulaire d'incident
  const [formData, setFormData] = useState({
    title: "",
    domain: "GAB",
    component: "CBS/DB",
    errorCode: "DE39=91",
    severity: "HIGH",
    symptom: "",
    facts: "",
    scope: "",
    breakPoint: "Frontal Payway -> Switch Host",
    hypotheses: [{ desc: "", status: "OPEN" }],
    evidence: "",
    rootCause: "",
    correction: "",
    prevention: "",
  });

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, STEPS.length));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  const addHypothesis = () => {
    setFormData({
      ...formData,
      hypotheses: [...formData.hypotheses, { desc: "", status: "OPEN" }],
    });
  };

  const handleSaveIncident = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/incidents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Erreur lors de l'enregistrement de l'incident.");
      }

      setCreatedRef(data.incident.reference);
      setSavedSuccess(true);
    } catch (err: any) {
      setError(err.message || "Impossible de sauvegarder l'incident dans MySQL.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      {/* Ruban Méthodologique */}
      <div style={{ background: "#ffffff", padding: "1.25rem", borderRadius: "14px", border: "1px solid #e4e4e7" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
          <div>
            <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#e60028", letterSpacing: "0.08em" }}>
              MÉTHODOLOGIE STANDARDISÉE DU CAHIER DES CHARGES
            </span>
            <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#111827" }}>
              Étape {currentStep} / {STEPS.length} : {STEPS[currentStep - 1].name}
            </h3>
          </div>
          <span style={{ fontSize: "0.85rem", color: "#71717a" }}>
            {STEPS[currentStep - 1].desc}
          </span>
        </div>

        <div className="steps-ribbon">
          {STEPS.map((s) => (
            <button
              key={s.id}
              onClick={() => setCurrentStep(s.id)}
              className={`step-pill ${currentStep === s.id ? "active" : ""}`}
              style={{ cursor: "pointer", border: currentStep === s.id ? "1px solid #e60028" : "1px solid #e4e4e7" }}
            >
              <span
                style={{
                  width: "20px",
                  height: "20px",
                  borderRadius: "50%",
                  background: currentStep === s.id ? "#e60028" : "#e4e4e7",
                  color: currentStep === s.id ? "#ffffff" : "#71717a",
                  display: "inline-grid",
                  placeItems: "center",
                  fontSize: "0.75rem",
                }}
              >
                {s.id}
              </span>
              <span>{s.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Note d'avertissement méthodologique */}
      <div
        style={{
          background: "#fef2f2",
          borderLeft: "4px solid #e60028",
          padding: "1rem 1.25rem",
          borderRadius: "0 8px 8px 0",
          fontSize: "0.88rem",
          color: "#991b1b",
          display: "flex",
          alignItems: "center",
          gap: "0.75rem",
        }}
      >
        <span style={{ fontSize: "1.2rem" }}>⚖️</span>
        <div>
          <b>Règle de gouvernance :</b> Une hypothèse n&apos;est jamais transformée automatiquement en cause racine (RCA).
          Chaque déduction doit être étayée par des traces ISO 8583 ou des logs horodatés vérifiés.
        </div>
      </div>

      {error && (
        <div style={{ padding: "0.85rem 1.25rem", background: "#fee2e2", color: "#991b1b", borderRadius: "8px", border: "1px solid #fca5a5", fontSize: "0.9rem" }}>
          ⚠️ {error}
        </div>
      )}

      {savedSuccess ? (
        <div style={{ background: "#ffffff", padding: "3rem", borderRadius: "14px", textAlign: "center", border: "1px solid #e4e4e7" }}>
          <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>✅</div>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 800 }}>Incident {createdRef} enregistré dans MySQL</h2>
          <p style={{ color: "#71717a", marginTop: "0.5rem", marginBottom: "1.5rem" }}>
            L&apos;incident a été créé et lié à la base de données avec sa chaîne d&apos;observations et d&apos;audit.
          </p>
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
            {createdRef && (
              <button
                type="button"
                className="btn-emerald"
                onClick={() => router.push(`/incidents/${createdRef}`)}
              >
                Consulter la fiche détaillée →
              </button>
            )}
            <button
              type="button"
              className="btn-secondary"
              onClick={() => router.push("/knowledge")}
            >
              Voir la base de connaissances
            </button>
          </div>
        </div>
      ) : (
        /* Formulaire guidé par étape */
        <div style={{ background: "#ffffff", padding: "2rem", borderRadius: "14px", border: "1px solid #e4e4e7" }}>
          {currentStep === 1 && (
            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              <h4 style={{ fontSize: "1.1rem", fontWeight: 700 }}>1. Identification du problème & Symptôme initial</h4>
              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, marginBottom: "0.3rem" }}>
                  Titre de l&apos;incident *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Ex. GAB — Retraits rejetés suite à saturation pool de connexion"
                  style={{ width: "100%", padding: "0.75rem", borderRadius: "8px", border: "1px solid #d4d4d8" }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, marginBottom: "0.3rem" }}>
                    Domaine
                  </label>
                  <select
                    value={formData.domain}
                    onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
                    style={{ width: "100%", padding: "0.75rem", borderRadius: "8px", border: "1px solid #d4d4d8" }}
                  >
                    <option value="GAB">GAB / Distributeur</option>
                    <option value="TPE">TPE / Paiement commerçant</option>
                    <option value="CARTE">Carte / EMV</option>
                    <option value="INTERFACE">Interface ISO 8583</option>
                    <option value="PAYWAY">Moteur Payway</option>
                    <option value="HOST">Host & Core Banking</option>
                    <option value="CLEARING">Clearing & Règlement</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, marginBottom: "0.3rem" }}>
                    Criticité
                  </label>
                  <select
                    value={formData.severity}
                    onChange={(e) => setFormData({ ...formData, severity: e.target.value })}
                    style={{ width: "100%", padding: "0.75rem", borderRadius: "8px", border: "1px solid #d4d4d8" }}
                  >
                    <option value="LOW">Faible (LOW)</option>
                    <option value="MEDIUM">Moyenne (MEDIUM)</option>
                    <option value="HIGH">Élevée (HIGH)</option>
                    <option value="CRITICAL">Critique (CRITICAL)</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, marginBottom: "0.3rem" }}>
                  Symptôme constaté (Description du dysfonctionnement perçu par le client / guichet)
                </label>
                <textarea
                  rows={3}
                  value={formData.symptom}
                  onChange={(e) => setFormData({ ...formData, symptom: e.target.value })}
                  placeholder="Ex: Le client insère sa carte, saisit son code PIN mais l'automate affiche 'Opération impossible - Délais dépassé'."
                  style={{ width: "100%", padding: "0.75rem", borderRadius: "8px", border: "1px solid #d4d4d8" }}
                />
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              <h4 style={{ fontSize: "1.1rem", fontWeight: 700 }}>2. Faits observés (Objectifs & Mesurables)</h4>
              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, marginBottom: "0.3rem" }}>
                  Faits vérifiés sur le terrain ou sur les consoles
                </label>
                <textarea
                  rows={4}
                  value={formData.facts}
                  onChange={(e) => setFormData({ ...formData, facts: e.target.value })}
                  placeholder="Ex: 85 transactions échouées entre 10h12 et 10h34. Taux d'échec de 95% constaté sur la passerelle GAB."
                  style={{ width: "100%", padding: "0.75rem", borderRadius: "8px", border: "1px solid #d4d4d8" }}
                />
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              <h4 style={{ fontSize: "1.1rem", fontWeight: 700 }}>3. Périmètre d&apos;impact</h4>
              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, marginBottom: "0.3rem" }}>
                  Périmètre géographique & technique impacté
                </label>
                <textarea
                  rows={4}
                  value={formData.scope}
                  onChange={(e) => setFormData({ ...formData, scope: e.target.value })}
                  placeholder="Ex: 14 agences de la région Est, 28 automates NCR raccordés au contrôleur frontal NORD."
                  style={{ width: "100%", padding: "0.75rem", borderRadius: "8px", border: "1px solid #d4d4d8" }}
                />
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              <h4 style={{ fontSize: "1.1rem", fontWeight: 700 }}>4. Localisation du Point de Rupture</h4>
              <p style={{ fontSize: "0.85rem", color: "#71717a" }}>
                Chaîne technique : GAB/TPE → Frontal Payway → Host Switch → Issuer / Core Banking / HSM
              </p>
              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, marginBottom: "0.3rem" }}>
                  Premier point de rupture identifié
                </label>
                <input
                  type="text"
                  value={formData.breakPoint}
                  onChange={(e) => setFormData({ ...formData, breakPoint: e.target.value })}
                  style={{ width: "100%", padding: "0.75rem", borderRadius: "8px", border: "1px solid #d4d4d8" }}
                />
              </div>
            </div>
          )}

          {currentStep === 5 && (
            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              <h4 style={{ fontSize: "1.1rem", fontWeight: 700 }}>5. Émission des Hypothèses</h4>
              <p style={{ fontSize: "0.85rem", color: "#71717a" }}>
                Formulez les explications possibles sans statuer définitivement.
              </p>

              {formData.hypotheses.map((h, idx) => (
                <div key={idx} style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
                  <input
                    type="text"
                    value={h.desc}
                    onChange={(e) => {
                      const updated = [...formData.hypotheses];
                      updated[idx].desc = e.target.value;
                      setFormData({ ...formData, hypotheses: updated });
                    }}
                    placeholder={`Hypothèse #${idx + 1} (ex: Expiration socket TCP après 30s)`}
                    style={{ flex: 1, padding: "0.75rem", borderRadius: "8px", border: "1px solid #d4d4d8" }}
                  />
                  <select
                    value={h.status}
                    onChange={(e) => {
                      const updated = [...formData.hypotheses];
                      updated[idx].status = e.target.value;
                      setFormData({ ...formData, hypotheses: updated });
                    }}
                    style={{ padding: "0.75rem", borderRadius: "8px", border: "1px solid #d4d4d8" }}
                  >
                    <option value="OPEN">Ouverte</option>
                    <option value="PROBABLE">Probable</option>
                    <option value="REJECTED">Écartée</option>
                    <option value="CONFIRMED">Confirmée</option>
                  </select>
                </div>
              ))}

              <button
                type="button"
                onClick={addHypothesis}
                style={{
                  alignSelf: "flex-start",
                  background: "#f4f4f5",
                  border: "1px dashed #a1a1aa",
                  padding: "0.5rem 1rem",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                }}
              >
                + Ajouter une autre hypothèse
              </button>
            </div>
          )}

          {currentStep === 6 && (
            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              <h4 style={{ fontSize: "1.1rem", fontWeight: 700 }}>6. Vérification & Preuves Techniques</h4>
              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, marginBottom: "0.3rem" }}>
                  Traces ISO 8583 masquées, logs système ou captures réseau
                </label>
                <textarea
                  rows={5}
                  value={formData.evidence}
                  onChange={(e) => setFormData({ ...formData, evidence: e.target.value })}
                  placeholder="0200 7238000008C08000 164500********9124 (Données sensibles masquées)..."
                  style={{ width: "100%", padding: "0.75rem", borderRadius: "8px", border: "1px solid #d4d4d8", fontFamily: "monospace", fontSize: "0.85rem" }}
                />
              </div>
            </div>
          )}

          {currentStep === 7 && (
            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              <h4 style={{ fontSize: "1.1rem", fontWeight: 700 }}>7. Cause Racine (RCA Formelle)</h4>
              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, marginBottom: "0.3rem" }}>
                  Cause racine démontrée & justification technique
                </label>
                <textarea
                  rows={4}
                  value={formData.rootCause}
                  onChange={(e) => setFormData({ ...formData, rootCause: e.target.value })}
                  placeholder="Ex: Déconnexion brutale du frontal consécutive au dépassement du pool max de sockets (erreur MAX_CONNECTIONS_REACHED)."
                  style={{ width: "100%", padding: "0.75rem", borderRadius: "8px", border: "1px solid #d4d4d8" }}
                />
              </div>
            </div>
          )}

          {currentStep === 8 && (
            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              <h4 style={{ fontSize: "1.1rem", fontWeight: 700 }}>8. Correction, Contrôle post-action & Prévention</h4>
              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, marginBottom: "0.3rem" }}>
                  Actions de correction immédiate
                </label>
                <textarea
                  rows={3}
                  value={formData.correction}
                  onChange={(e) => setFormData({ ...formData, correction: e.target.value })}
                  placeholder="Ex: Augmentation de la taille du pool à 256 connexions et redémarrage du service frontal."
                  style={{ width: "100%", padding: "0.75rem", borderRadius: "8px", border: "1px solid #d4d4d8" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, marginBottom: "0.3rem" }}>
                  Mesures préventives pérennes
                </label>
                <textarea
                  rows={3}
                  value={formData.prevention}
                  onChange={(e) => setFormData({ ...formData, prevention: e.target.value })}
                  placeholder="Ex: Création d'une sonde de supervision surveillant le seuil à 80% du pool."
                  style={{ width: "100%", padding: "0.75rem", borderRadius: "8px", border: "1px solid #d4d4d8" }}
                />
              </div>
            </div>
          )}

          {/* Boutons de navigation */}
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "2rem", paddingTop: "1.5rem", borderTop: "1px solid #f4f4f5" }}>
            <button
              type="button"
              onClick={prevStep}
              disabled={currentStep === 1}
              className="btn-secondary"
              style={{ opacity: currentStep === 1 ? 0.5 : 1 }}
            >
              ← Étape précédente
            </button>

            {currentStep < STEPS.length ? (
              <button
                type="button"
                onClick={nextStep}
                className="btn-emerald"
              >
                Étape suivante →
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSaveIncident}
                disabled={loading}
                className="btn-emerald"
              >
                {loading ? "Enregistrement dans MySQL..." : "✓ Enregistrer dans la base de données"}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
