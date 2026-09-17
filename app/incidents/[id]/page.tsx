import { notFound } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/modules/auth/auth-service";
import { getIncidentByReference } from "@/modules/incidents/data-store";
import { AppShell } from "@/modules/layout/AppShell";
import { maskSensitiveFields } from "@/modules/security/masking";

interface IncidentDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function IncidentDetailPage({ params }: IncidentDetailPageProps) {
  const { id } = await params;
  const user = await getSession();
  const incident = await getIncidentByReference(id);

  if (!incident) {
    notFound();
  }

  const isValidated = incident.knowledgeStatus === "VALIDATED";

  return (
    <AppShell user={user} pageTitle={`${incident.reference} — ${incident.title}`} eyebrow="FICHE D'INCIDENT MONÉTIQUE">
      <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
        
        {/* En-tête : Badges techniques, statuts & actions */}
        <div
          style={{
            background: "#ffffff",
            padding: "1.5rem 2rem",
            borderRadius: "16px",
            border: "1px solid #e4e4e7",
            boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "1.25rem",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.85rem", flexWrap: "wrap" }}>
            <span
              className={`badge ${isValidated ? "badge-emerald" : "badge-warning"}`}
              style={{ fontSize: "0.85rem", padding: "0.35rem 0.85rem" }}
            >
              {isValidated ? "✓ Connaissance Validée" : "Scénario de Référence"}
            </span>

            <span className="badge badge-black" style={{ padding: "0.35rem 0.85rem" }}>
              Canal: {incident.domain}
            </span>

            <span
              className="badge"
              style={{
                background: incident.severity === "CRITICAL" ? "#fee2e2" : "#fef3c7",
                color: incident.severity === "CRITICAL" ? "#991b1b" : "#92400e",
                padding: "0.35rem 0.85rem",
              }}
            >
              Criticité: {incident.severity}
            </span>

            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.88rem", color: "#52525b" }}>
              <span>Composant :</span>
              <strong style={{ color: "#09090b" }}>{incident.component}</strong>
            </div>

            {incident.errorCode && (
              <code
                style={{
                  background: "#f0fdf4",
                  border: "1px solid #bbf7d0",
                  padding: "0.25rem 0.6rem",
                  borderRadius: "6px",
                  color: "#059669",
                  fontWeight: 800,
                  fontSize: "0.88rem",
                }}
              >
                Code: {incident.errorCode}
              </code>
            )}
          </div>

          <div style={{ display: "flex", gap: "0.75rem" }}>
            <Link href="/knowledge" className="btn-secondary" style={{ fontSize: "0.85rem" }}>
              ← Retour au catalogue
            </Link>
            {!isValidated && (
              <Link
                href={`/incidents/${incident.reference}/edit`}
                className="btn-emerald"
                style={{ fontSize: "0.85rem", padding: "0.5rem 1rem" }}
              >
                ✏️ Traiter & Valider l'incident
              </Link>
            )}
            <Link href="/diagnostic" className="btn-secondary" style={{ fontSize: "0.85rem" }}>
              ⚡ Analyser un cas similaire
            </Link>
          </div>
        </div>

        {/* 1. Synthèse du problème & Observations de terrain */}
        <div style={{ background: "#ffffff", padding: "2rem", borderRadius: "16px", border: "1px solid #e4e4e7" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "1.25rem" }}>
            <span style={{ fontSize: "1.3rem" }}>🔍</span>
            <h3 style={{ fontSize: "1.2rem", fontWeight: 800, color: "#09090b" }}>
              1. Symptômes & Faits Observés sur le Terrain
            </h3>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "1.5rem" }}>
            {incident.observations && incident.observations.length > 0 ? (
              incident.observations.map((obs, idx) => (
                <div
                  key={idx}
                  style={{
                    background: "#fcfcfc",
                    padding: "1.25rem",
                    borderRadius: "12px",
                    border: "1px solid #f4f4f5",
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.75rem",
                  }}
                >
                  <div>
                    <span style={{ fontSize: "0.75rem", fontWeight: 800, color: "#059669", letterSpacing: "0.05em", textTransform: "uppercase" }}>
                      Symptôme perçu
                    </span>
                    <p style={{ fontSize: "0.92rem", color: "#18181b", fontWeight: 500, marginTop: "0.2rem" }}>
                      {obs.symptom}
                    </p>
                  </div>

                  <div>
                    <span style={{ fontSize: "0.75rem", fontWeight: 800, color: "#71717a", letterSpacing: "0.05em", textTransform: "uppercase" }}>
                      Faits objectifs mesurés
                    </span>
                    <p style={{ fontSize: "0.9rem", color: "#3f3f46", marginTop: "0.2rem" }}>
                      {obs.facts}
                    </p>
                  </div>

                  {obs.scope && (
                    <div>
                      <span style={{ fontSize: "0.75rem", fontWeight: 800, color: "#71717a", letterSpacing: "0.05em", textTransform: "uppercase" }}>
                        Périmètre technique & géographique
                      </span>
                      <p style={{ fontSize: "0.9rem", color: "#3f3f46", marginTop: "0.2rem" }}>
                        {obs.scope}
                      </p>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p style={{ color: "#71717a", fontSize: "0.9rem" }}>Aucune observation documentée pour cet incident.</p>
            )}
          </div>
        </div>

        {/* 2. Flux Transactionnel & Visualisation du Point de Rupture */}
        <div style={{ background: "#ffffff", padding: "2rem", borderRadius: "16px", border: "1px solid #e4e4e7" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
              <span style={{ fontSize: "1.3rem" }}>⛓️</span>
              <h3 style={{ fontSize: "1.2rem", fontWeight: 800, color: "#09090b" }}>
                2. Flux Transactionnel & Point de Rupture
              </h3>
            </div>
            <span style={{ fontSize: "0.82rem", color: "#71717a" }}>
              Chaîne de bout en bout : GAB/TPE ➔ Payway ➔ Switch ➔ Host / DB / HSM
            </span>
          </div>
          <p style={{ fontSize: "0.88rem", color: "#71717a", marginBottom: "1.5rem" }}>
            Ordre séquentiel des étapes et identification précise de la rupture dans l&apos;acheminement.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
            {incident.flowSteps?.map((step) => {
              const isBreaking =
                step.status === "TIMEOUT_BLOCKED" ||
                step.status === "POINT_DE_RUPTURE" ||
                step.status === "ERROR" ||
                step.status === "TIMEOUT_OR_REJECT";

              return (
                <div
                  key={step.position}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1.25rem",
                    padding: "1rem 1.5rem",
                    borderRadius: "12px",
                    background: isBreaking ? "#fff1f2" : "#f8fafc",
                    border: isBreaking ? "1px solid #fecdd3" : "1px solid #e2e8f0",
                    transition: "all 0.15s ease",
                  }}
                >
                  <span
                    style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "50%",
                      background: isBreaking ? "#e11d48" : "#059669",
                      color: "white",
                      display: "grid",
                      placeItems: "center",
                      fontSize: "0.85rem",
                      fontWeight: 800,
                      flexShrink: 0,
                    }}
                  >
                    {step.position}
                  </span>

                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", gap: "0.5rem", fontSize: "0.82rem", color: "#71717a" }}>
                      <strong style={{ color: "#09090b" }}>{step.source}</strong>
                      <span>➔</span>
                      <strong style={{ color: "#09090b" }}>{step.destination}</strong>
                    </div>
                    <div
                      style={{
                        fontSize: "0.95rem",
                        fontWeight: 600,
                        color: isBreaking ? "#9f1239" : "#0f172a",
                        marginTop: "0.15rem",
                      }}
                    >
                      {step.event}
                    </div>
                  </div>

                  <span
                    style={{
                      fontSize: "0.78rem",
                      fontWeight: 800,
                      padding: "0.3rem 0.7rem",
                      borderRadius: "6px",
                      background: isBreaking ? "#ffe4e6" : "#e2e8f0",
                      color: isBreaking ? "#e11d48" : "#059669",
                    }}
                  >
                    {step.status || "OK"}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* 3. Trames ISO 8583 & Masquage de conformité PCI-DSS */}
        <div style={{ background: "#ffffff", padding: "2rem", borderRadius: "16px", border: "1px solid #e4e4e7" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
              <span style={{ fontSize: "1.3rem" }}>💳</span>
              <h3 style={{ fontSize: "1.2rem", fontWeight: 800, color: "#09090b" }}>
                3. Trames ISO 8583 & Éléments de Données (DE)
              </h3>
            </div>
            <span
              style={{
                fontSize: "0.75rem",
                color: "#059669",
                fontWeight: 700,
                background: "#ecfdf5",
                padding: "0.3rem 0.7rem",
                borderRadius: "6px",
                border: "1px solid #a7f3d0",
              }}
            >
              🛡️ SÉCURITÉ : Filtrage PAN & Cryptogrammes Actif
            </span>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: "1.25rem" }}>
            {incident.isoMessages?.map((msg, i) => (
              <div
                key={i}
                style={{
                  background: "#0a0a0c",
                  color: "#ecfdf5",
                  padding: "1.25rem",
                  borderRadius: "12px",
                  fontFamily: "ui-monospace, monospace",
                  fontSize: "0.85rem",
                  boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    borderBottom: "1px solid #27272a",
                    paddingBottom: "0.6rem",
                    marginBottom: "0.85rem",
                  }}
                >
                  <span style={{ color: "#34d399", fontWeight: 800 }}>MTI: {msg.mti || "—"}</span>
                  <span style={{ color: "#a1a1aa" }}>STAN: {msg.stan || "—"}</span>
                  <span style={{ color: "#f87171", fontWeight: 700 }}>DE39: {msg.responseCode || "—"}</span>
                </div>

                <div style={{ wordBreak: "break-all", color: "#a1a1aa", lineHeight: "1.6" }}>
                  {maskSensitiveFields(msg.maskedRawMessage || "")}
                </div>

                {msg.fields && Object.keys(msg.fields).length > 0 && (
                  <div style={{ marginTop: "0.85rem", borderTop: "1px solid #1c1d22", paddingTop: "0.6rem" }}>
                    <span style={{ color: "#71717a", fontSize: "0.75rem", display: "block", marginBottom: "0.3rem" }}>
                      CHAMPS STRUCTURÉS (DE)
                    </span>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                      {Object.entries(msg.fields).map(([k, v]) => (
                        <span key={k} style={{ background: "#1c1d22", padding: "0.2rem 0.5rem", borderRadius: "4px", fontSize: "0.75rem", color: "#34d399" }}>
                          {k}: {String(v)}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 4. Hypothèses et Preuves Techniques */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))", gap: "1.5rem" }}>
          {/* Hypothèses */}
          <div style={{ background: "#ffffff", padding: "2rem", borderRadius: "16px", border: "1px solid #e4e4e7" }}>
            <h3 style={{ fontSize: "1.1rem", fontWeight: 800, color: "#09090b", marginBottom: "1rem" }}>
              4. Hypothèses d&apos;Analyse
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
              {incident.hypotheses?.map((hypo, idx) => {
                const isConfirmed = hypo.status === "CONFIRMED";
                const isRejected = hypo.status === "REJECTED";
                return (
                  <div
                    key={idx}
                    style={{
                      padding: "1rem",
                      background: "#f8fafc",
                      borderRadius: "10px",
                      border: "1px solid #e2e8f0",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span
                        style={{
                          fontSize: "0.75rem",
                          fontWeight: 800,
                          color: isConfirmed ? "#059669" : isRejected ? "#dc2626" : "#d97706",
                        }}
                      >
                        STATUT : {hypo.status}
                      </span>
                    </div>
                    <p style={{ fontSize: "0.9rem", fontWeight: 600, color: "#09090b", marginTop: "0.3rem" }}>
                      {hypo.description}
                    </p>
                    {hypo.evidence && (
                      <p style={{ fontSize: "0.82rem", color: "#64748b", marginTop: "0.35rem" }}>
                        <b>Élément probant :</b> {hypo.evidence}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Preuves Techniques */}
          <div style={{ background: "#ffffff", padding: "2rem", borderRadius: "16px", border: "1px solid #e4e4e7" }}>
            <h3 style={{ fontSize: "1.1rem", fontWeight: 800, color: "#09090b", marginBottom: "1rem" }}>
              5. Preuves Techniques Concordantes
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
              {incident.evidence && incident.evidence.length > 0 ? (
                incident.evidence.map((ev, idx) => (
                  <div
                    key={idx}
                    style={{
                      padding: "1rem",
                      background: "#f8fafc",
                      borderRadius: "10px",
                      border: "1px solid #e2e8f0",
                    }}
                  >
                    <span style={{ fontSize: "0.75rem", fontWeight: 800, color: "#059669" }}>
                      {ev.type} — Source: {ev.source || "Console Système"}
                    </span>
                    <p style={{ fontSize: "0.88rem", color: "#1e293b", marginTop: "0.3rem", fontFamily: "monospace" }}>
                      {ev.content}
                    </p>
                  </div>
                ))
              ) : (
                <p style={{ fontSize: "0.88rem", color: "#71717a" }}>Aucune trace binaire enregistrée.</p>
              )}
            </div>
          </div>
        </div>

        {/* 5. Cause Racine (RCA Formelle) & Résolution Validée */}
        <div style={{ background: "#ffffff", padding: "2rem", borderRadius: "16px", border: "1px solid #e4e4e7" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "1.25rem" }}>
            <span style={{ fontSize: "1.3rem" }}>🎯</span>
            <h3 style={{ fontSize: "1.2rem", fontWeight: 800, color: "#09090b" }}>
              6. Cause Racine (RCA) & Solution Validée
            </h3>
          </div>

          {incident.rootCause ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              <div
                style={{
                  background: "#ecfdf5",
                  border: "1px solid #a7f3d0",
                  padding: "1.5rem",
                  borderRadius: "12px",
                }}
              >
                <span style={{ fontSize: "0.75rem", fontWeight: 800, color: "#065f46", textTransform: "uppercase" }}>
                  Catégorie : {incident.rootCause.category}
                </span>
                <h4 style={{ fontSize: "1.1rem", fontWeight: 800, color: "#064e3b", marginTop: "0.3rem" }}>
                  {incident.rootCause.description}
                </h4>
                <p style={{ fontSize: "0.92rem", color: "#047857", marginTop: "0.5rem" }}>
                  <b>Démonstration & justification :</b> {incident.rootCause.justification}
                </p>
                {incident.rootCause.validatedBy && (
                  <div style={{ fontSize: "0.82rem", color: "#059669", marginTop: "0.75rem", fontWeight: 600 }}>
                    ✓ Validation formelle par : <b>{incident.rootCause.validatedBy}</b>
                  </div>
                )}
              </div>

              {incident.resolution && (
                <div
                  style={{
                    background: "#f8fafc",
                    border: "1px solid #e2e8f0",
                    padding: "1.5rem",
                    borderRadius: "12px",
                  }}
                >
                  <strong style={{ fontSize: "0.9rem", color: "#0f172a", display: "block" }}>
                    Plan d&apos;actions de correction déployé :
                  </strong>
                  <p style={{ fontSize: "0.92rem", color: "#334155", marginTop: "0.3rem" }}>
                    {incident.resolution.actions}
                  </p>
                  {incident.resolution.result && (
                    <p style={{ fontSize: "0.85rem", color: "#059669", marginTop: "0.5rem", fontWeight: 600 }}>
                      <b>Résultat après vérification :</b> {incident.resolution.result}
                    </p>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div
              style={{
                padding: "1.75rem",
                background: "#fef3c7",
                borderRadius: "12px",
                border: "1px solid #fde68a",
                color: "#92400e",
                fontSize: "0.92rem",
              }}
            >
              ⚠️ <b>Scénario de référence :</b> La cause racine et la résolution définitive ne sont pas encore marquées comme validées en production pour cet incident.
              Vous pouvez engager un diagnostic guidé pour documenter ce cas.
            </div>
          )}
        </div>

        {/* 7. Plan d'Actions Préventives & Amélioration Continue */}
        {incident.prevention && incident.prevention.length > 0 && (
          <div style={{ background: "#ffffff", padding: "2rem", borderRadius: "16px", border: "1px solid #e4e4e7" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "1.25rem" }}>
              <span style={{ fontSize: "1.3rem" }}>🛡️</span>
              <h3 style={{ fontSize: "1.2rem", fontWeight: 800, color: "#09090b" }}>
                7. Plan d&apos;Actions Préventives & Amélioration Continue
              </h3>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "1.25rem" }}>
              {incident.prevention.map((prev, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: "1.25rem",
                    background: "#f8fafc",
                    borderRadius: "12px",
                    border: "1px solid #e2e8f0",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    gap: "0.75rem",
                  }}
                >
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.4rem" }}>
                      <span
                        style={{
                          fontSize: "0.75rem",
                          fontWeight: 800,
                          padding: "0.2rem 0.6rem",
                          borderRadius: "6px",
                          background: prev.priority === "CRITICAL" ? "#fee2e2" : prev.priority === "HIGH" ? "#fef3c7" : "#e0f2fe",
                          color: prev.priority === "CRITICAL" ? "#991b1b" : prev.priority === "HIGH" ? "#92400e" : "#0369a1",
                        }}
                      >
                        Priorité: {prev.priority || "NORMALE"}
                      </span>
                      <span style={{ fontSize: "0.75rem", fontWeight: 800, color: "#059669" }}>
                        ✓ {prev.status || "DONE"}
                      </span>
                    </div>
                    <p style={{ fontSize: "0.92rem", fontWeight: 600, color: "#0f172a" }}>
                      {prev.action}
                    </p>
                  </div>
                  {prev.owner && (
                    <div style={{ fontSize: "0.82rem", color: "#64748b" }}>
                      Responsable : <strong style={{ color: "#334155" }}>{prev.owner}</strong>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </AppShell>
  );
}
