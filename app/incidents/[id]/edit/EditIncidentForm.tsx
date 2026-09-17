"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { IncidentRecord } from "@/modules/incidents/types";

export function EditIncidentForm({ incident }: { incident: IncidentRecord }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState(incident.title);
  const [severity, setSeverity] = useState(incident.severity);
  const [symptom, setSymptom] = useState(incident.observations?.[0]?.symptom || "");
  const [facts, setFacts] = useState(incident.observations?.[0]?.facts || "");
  
  // RCA
  const [rootCauseCategory, setRootCauseCategory] = useState(incident.rootCause?.category || "Système & Infrastructure");
  const [rootCauseDescription, setRootCauseDescription] = useState(incident.rootCause?.description || "");
  const [rootCauseJustification, setRootCauseJustification] = useState(incident.rootCause?.justification || "");

  // Résolution
  const [resolutionActions, setResolutionActions] = useState(incident.resolution?.actions || "");
  const [resolutionResult, setResolutionResult] = useState(incident.resolution?.result || "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/incidents/${incident.reference}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          severity,
          symptom,
          facts,
          rootCauseCategory,
          rootCauseDescription,
          rootCauseJustification,
          resolutionActions,
          resolutionResult,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Erreur lors de la mise à jour de l'incident.");
      }

      router.push(`/incidents/${incident.reference}`);
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Impossible de sauvegarder.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.75rem", maxWidth: "900px" }}>
      {error && (
        <div style={{ padding: "1rem", background: "#fee2e2", color: "#991b1b", borderRadius: "8px", border: "1px solid #fca5a5" }}>
          ⚠️ {error}
        </div>
      )}

      {/* 1. Identification */}
      <div style={{ background: "#ffffff", padding: "1.75rem", borderRadius: "14px", border: "1px solid #e2e8f0" }}>
        <h3 style={{ fontSize: "1.1rem", fontWeight: 800, color: "#0f172a", marginBottom: "1.25rem" }}>
          1. Identification de l&apos;Incident ({incident.reference})
        </h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div>
            <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, color: "#0f172a", marginBottom: "0.3rem" }}>
              Titre de l&apos;incident
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{ width: "100%", padding: "0.75rem", borderRadius: "8px", border: "1px solid #cbd5e1" }}
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div>
              <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, color: "#0f172a", marginBottom: "0.3rem" }}>
                Criticité
              </label>
              <select
                value={severity}
                onChange={(e) => setSeverity(e.target.value as any)}
                style={{ width: "100%", padding: "0.75rem", borderRadius: "8px", border: "1px solid #cbd5e1" }}
              >
                <option value="LOW">Faible (LOW)</option>
                <option value="MEDIUM">Moyenne (MEDIUM)</option>
                <option value="HIGH">Élevée (HIGH)</option>
                <option value="CRITICAL">Critique (CRITICAL)</option>
              </select>
            </div>
            <div>
              <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, color: "#0f172a", marginBottom: "0.3rem" }}>
                Composant concerné
              </label>
              <input
                type="text"
                disabled
                value={incident.component || "—"}
                style={{ width: "100%", padding: "0.75rem", borderRadius: "8px", border: "1px solid #e2e8f0", background: "#f8fafc" }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 2. Constats de terrain */}
      <div style={{ background: "#ffffff", padding: "1.75rem", borderRadius: "14px", border: "1px solid #e2e8f0" }}>
        <h3 style={{ fontSize: "1.1rem", fontWeight: 800, color: "#0f172a", marginBottom: "1.25rem" }}>
          2. Symptômes & Faits Observés
        </h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div>
            <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, color: "#0f172a", marginBottom: "0.3rem" }}>
              Symptôme constaté
            </label>
            <textarea
              rows={3}
              value={symptom}
              onChange={(e) => setSymptom(e.target.value)}
              style={{ width: "100%", padding: "0.75rem", borderRadius: "8px", border: "1px solid #cbd5e1" }}
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, color: "#0f172a", marginBottom: "0.3rem" }}>
              Faits observés et mesurés
            </label>
            <textarea
              rows={3}
              value={facts}
              onChange={(e) => setFacts(e.target.value)}
              style={{ width: "100%", padding: "0.75rem", borderRadius: "8px", border: "1px solid #cbd5e1" }}
            />
          </div>
        </div>
      </div>

      {/* 3. Validation de la Cause Racine (RCA) */}
      <div style={{ background: "#ffffff", padding: "1.75rem", borderRadius: "14px", border: "1px solid #a7f3d0" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
          <h3 style={{ fontSize: "1.1rem", fontWeight: 800, color: "#065f46" }}>
            3. Cause Racine Formelle (RCA)
          </h3>
          <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#059669", background: "#ecfdf5", padding: "0.25rem 0.6rem", borderRadius: "6px" }}>
            ✓ Passage en statut VALIDÉ
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div>
            <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, color: "#0f172a", marginBottom: "0.3rem" }}>
              Catégorie de la cause racine
            </label>
            <input
              type="text"
              required
              value={rootCauseCategory}
              onChange={(e) => setRootCauseCategory(e.target.value)}
              placeholder="Ex: Core Banking, HSM, Réseau télécom, Paramétrage ISO..."
              style={{ width: "100%", padding: "0.75rem", borderRadius: "8px", border: "1px solid #cbd5e1" }}
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, color: "#0f172a", marginBottom: "0.3rem" }}>
              Description formelle de la cause racine
            </label>
            <textarea
              rows={4}
              required
              value={rootCauseDescription}
              onChange={(e) => setRootCauseDescription(e.target.value)}
              placeholder="Détaillez la démonstration technique de la panne..."
              style={{ width: "100%", padding: "0.75rem", borderRadius: "8px", border: "1px solid #cbd5e1" }}
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, color: "#0f172a", marginBottom: "0.3rem" }}>
              Justification & Preuves de corrélation
            </label>
            <textarea
              rows={2}
              value={rootCauseJustification}
              onChange={(e) => setRootCauseJustification(e.target.value)}
              placeholder="Concordance avec les traces ISO 8583 et logs horodatés..."
              style={{ width: "100%", padding: "0.75rem", borderRadius: "8px", border: "1px solid #cbd5e1" }}
            />
          </div>
        </div>
      </div>

      {/* 4. Actions de Résolution */}
      <div style={{ background: "#ffffff", padding: "1.75rem", borderRadius: "14px", border: "1px solid #e2e8f0" }}>
        <h3 style={{ fontSize: "1.1rem", fontWeight: 800, color: "#0f172a", marginBottom: "1.25rem" }}>
          4. Actions de Résolution & Rétablissement
        </h3>

        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div>
            <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, color: "#0f172a", marginBottom: "0.3rem" }}>
              Actions correctives déployées
            </label>
            <textarea
              rows={3}
              required
              value={resolutionActions}
              onChange={(e) => setResolutionActions(e.target.value)}
              placeholder="Redémarrage de service, patch, bascule de lien, réindexation..."
              style={{ width: "100%", padding: "0.75rem", borderRadius: "8px", border: "1px solid #cbd5e1" }}
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, color: "#0f172a", marginBottom: "0.3rem" }}>
              Résultat après contrôle post-action
            </label>
            <input
              type="text"
              value={resolutionResult}
              onChange={(e) => setResolutionResult(e.target.value)}
              placeholder="Ex: Reprise nominale des transactions à 100%, temps de réponse < 400ms."
              style={{ width: "100%", padding: "0.75rem", borderRadius: "8px", border: "1px solid #cbd5e1" }}
            />
          </div>
        </div>
      </div>

      {/* Boutons d'action */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "1rem" }}>
        <Link href={`/incidents/${incident.reference}`} className="btn-secondary">
          Annuler
        </Link>
        <button type="submit" disabled={loading} className="btn-emerald" style={{ padding: "0.85rem 1.75rem" }}>
          {loading ? "Validation en cours..." : "✓ Valider et Enregistrer le traitement"}
        </button>
      </div>
    </form>
  );
}
