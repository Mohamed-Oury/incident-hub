"use client";

import { useEffect, useState } from "react";

interface AuditEntry {
  id: string;
  action: string;
  entity: string;
  entityId: string;
  createdAt: string;
  user?: {
    name: string;
    email: string;
  };
  metadata?: any;
}

interface UnifiedAuditRecord {
  recordId: string;
  ticketId: string;
  stan?: string | null;
  domain: string;
  actionType: string;
  operatorId: string;
  role: string;
  evidenceSummary: string[];
  status: string;
  details: Record<string, any>;
  timestamp: string;
}

export function AuditTimeline() {
  const [audits, setAudits] = useState<AuditEntry[]>([]);
  const [unifiedAudits, setUnifiedAudits] = useState<UnifiedAuditRecord[]>([]);
  const [activeSource, setActiveSource] = useState<"ALL" | "UNIFIED" | "MYSQL">("ALL");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.allSettled([
      fetch("/api/audit").then((res) => (res.ok ? res.json() : { audits: [] })),
      fetch("/api/cbs/agentic/audit/trail").then((res) => (res.ok ? res.json() : [])),
    ])
      .then(([dbRes, agentRes]) => {
        if (dbRes.status === "fulfilled" && dbRes.value?.audits) {
          setAudits(dbRes.value.audits);
        }
        if (agentRes.status === "fulfilled" && Array.isArray(agentRes.value)) {
          setUnifiedAudits(agentRes.value);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const totalActionsCount = audits.length + unifiedAudits.length;

  return (
    <div style={{ background: "#ffffff", borderRadius: "14px", border: "1px solid #e2e8f0", padding: "1.75rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem", marginBottom: "1.5rem" }}>
        <div>
          <h3 style={{ fontSize: "1.15rem", fontWeight: 800, color: "#0f172a", margin: 0 }}>
            Piste d&apos;Audit &amp; Traçabilité des Actions
          </h3>
          <p style={{ fontSize: "0.85rem", color: "#64748b", margin: "0.2rem 0 0 0" }}>
            Historique dynamique en temps réel : Base de données locale &amp; Piste d&apos;Audit Unifiée RBAC (Pilier 5).
          </p>
        </div>

        {/* Sélecteur de Source & Compteur */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
          <div style={{ display: "flex", background: "#f1f5f9", borderRadius: "8px", padding: "3px", border: "1px solid #cbd5e1" }}>
            <button
              type="button"
              onClick={() => setActiveSource("ALL")}
              style={{
                border: "none",
                background: activeSource === "ALL" ? "#ffffff" : "transparent",
                color: activeSource === "ALL" ? "#0f172a" : "#64748b",
                fontWeight: 700,
                fontSize: "0.78rem",
                padding: "4px 10px",
                borderRadius: "6px",
                cursor: "pointer",
                boxShadow: activeSource === "ALL" ? "0 1px 2px rgba(0,0,0,0.06)" : "none",
              }}
            >
              Tous ({totalActionsCount})
            </button>
            <button
              type="button"
              onClick={() => setActiveSource("UNIFIED")}
              style={{
                border: "none",
                background: activeSource === "UNIFIED" ? "#4f46e5" : "transparent",
                color: activeSource === "UNIFIED" ? "#ffffff" : "#64748b",
                fontWeight: 700,
                fontSize: "0.78rem",
                padding: "4px 10px",
                borderRadius: "6px",
                cursor: "pointer",
              }}
            >
              🛡️ Audit Unifié ({unifiedAudits.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveSource("MYSQL")}
              style={{
                border: "none",
                background: activeSource === "MYSQL" ? "#ffffff" : "transparent",
                color: activeSource === "MYSQL" ? "#0f172a" : "#64748b",
                fontWeight: 700,
                fontSize: "0.78rem",
                padding: "4px 10px",
                borderRadius: "6px",
                cursor: "pointer",
                boxShadow: activeSource === "MYSQL" ? "0 1px 2px rgba(0,0,0,0.06)" : "none",
              }}
            >
              BD MySQL ({audits.length})
            </button>
          </div>

          <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "#059669", background: "#ecfdf5", padding: "0.3rem 0.7rem", borderRadius: "6px" }}>
            {activeSource === "ALL" ? totalActionsCount : activeSource === "UNIFIED" ? unifiedAudits.length : audits.length} action(s)
          </span>
        </div>
      </div>

      {loading ? (
        <p style={{ color: "#64748b", fontSize: "0.9rem", padding: "2rem 0", textAlign: "center" }}>
          Chargement de la piste d&apos;audit...
        </p>
      ) : totalActionsCount === 0 ? (
        <div style={{ textAlign: "center", padding: "3.5rem 1rem", color: "#64748b" }}>
          <div style={{ fontSize: "2.5rem", marginBottom: "0.75rem" }}>🛡️</div>
          <h4 style={{ fontSize: "1.05rem", fontWeight: 700, color: "#0f172a" }}>Aucun événement d&apos;audit</h4>
          <p style={{ fontSize: "0.88rem", marginTop: "0.3rem" }}>
            La piste d&apos;audit est actuellement vierge. Les actions de validation, connexion et diagnostic s&apos;afficheront ici.
          </p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {/* 1. Entrées de l'Audit Trail Unifié Agentic (Pilier 5) */}
          {(activeSource === "ALL" || activeSource === "UNIFIED") &&
            unifiedAudits.map((rec) => (
              <div
                key={rec.recordId}
                style={{
                  display: "flex",
                  gap: "1rem",
                  paddingBottom: "1.2rem",
                  borderBottom: "1px solid #f1f5f9",
                  background: "#f8fafc",
                  padding: "1rem",
                  borderRadius: "10px",
                  border: "1px solid #e2e8f0",
                }}
              >
                <div
                  style={{
                    width: "38px",
                    height: "38px",
                    borderRadius: "50%",
                    background: "#ede9fe",
                    color: "#6d28d9",
                    display: "grid",
                    placeItems: "center",
                    fontWeight: 800,
                    fontSize: "0.9rem",
                    flexShrink: 0,
                  }}
                >
                  ⚡
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.5rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <strong style={{ fontSize: "0.92rem", color: "#0f172a" }}>
                        {rec.operatorId}
                      </strong>
                      <span
                        style={{
                          fontSize: "0.68rem",
                          fontWeight: 800,
                          backgroundColor: "#f5f3ff",
                          color: "#6d28d9",
                          border: "1px solid #ddd6fe",
                          padding: "2px 6px",
                          borderRadius: "4px",
                        }}
                      >
                        RÔLE RBAC : {rec.role}
                      </span>
                    </div>
                    <span style={{ fontSize: "0.78rem", color: "#64748b" }}>
                      {new Date(rec.timestamp).toLocaleString("fr-FR")}
                    </span>
                  </div>

                  <p style={{ fontSize: "0.85rem", color: "#334155", marginTop: "0.35rem", marginBottom: "0.35rem" }}>
                    Ticket : <b>{rec.ticketId}</b> {rec.stan ? `| STAN : ${rec.stan}` : ""} | Domaine : <b>{rec.domain}</b>
                  </p>

                  {rec.evidenceSummary && rec.evidenceSummary.length > 0 && (
                    <div style={{ background: "#ffffff", padding: "0.5rem 0.75rem", borderRadius: "6px", border: "1px solid #e2e8f0", fontSize: "0.78rem", color: "#475569", marginTop: "0.35rem" }}>
                      <span style={{ fontWeight: 700, color: "#0f172a", display: "block", marginBottom: "2px" }}>Preuves matérielles constatées :</span>
                      {rec.evidenceSummary.map((ev, i) => (
                        <div key={i}>• {ev}</div>
                      ))}
                    </div>
                  )}

                  <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem", alignItems: "center" }}>
                    <span
                      style={{
                        fontSize: "0.72rem",
                        fontWeight: 700,
                        color: "#4338ca",
                        background: "#e0e7ff",
                        padding: "0.2rem 0.55rem",
                        borderRadius: "4px",
                        border: "1px solid #c7d2fe",
                      }}
                    >
                      {rec.actionType}
                    </span>
                    <span
                      style={{
                        fontSize: "0.72rem",
                        fontWeight: 700,
                        color: rec.status === "APPROVED" || rec.status === "SUCCESS" ? "#15803d" : "#b45309",
                        background: rec.status === "APPROVED" || rec.status === "SUCCESS" ? "#dcfce7" : "#fef3c7",
                        padding: "0.2rem 0.55rem",
                        borderRadius: "4px",
                      }}
                    >
                      {rec.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}

          {/* 2. Entrées de la base MySQL locale */}
          {(activeSource === "ALL" || activeSource === "MYSQL") &&
            audits.map((ev) => (
              <div
                key={ev.id}
                style={{
                  display: "flex",
                  gap: "1rem",
                  paddingBottom: "1.2rem",
                  borderBottom: "1px solid #f1f5f9",
                }}
              >
                <div
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "50%",
                    background: "#ecfdf5",
                    color: "#059669",
                    display: "grid",
                    placeItems: "center",
                    fontWeight: 800,
                    fontSize: "0.85rem",
                    flexShrink: 0,
                  }}
                >
                  ✓
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <strong style={{ fontSize: "0.92rem", color: "#0f172a" }}>
                      {ev.user?.name || ev.user?.email || "Action Système"}
                    </strong>
                    <span style={{ fontSize: "0.78rem", color: "#64748b" }}>
                      {new Date(ev.createdAt).toLocaleString("fr-FR")}
                    </span>
                  </div>
                  <p style={{ fontSize: "0.85rem", color: "#475569", marginTop: "0.25rem" }}>
                    Entité : <b>{ev.entity}</b> ({ev.entityId})
                  </p>
                  <span
                    style={{
                      display: "inline-block",
                      marginTop: "0.45rem",
                      fontSize: "0.72rem",
                      fontWeight: 700,
                      color: "#059669",
                      background: "#ecfdf5",
                      padding: "0.2rem 0.55rem",
                      borderRadius: "4px",
                      border: "1px solid #a7f3d0",
                    }}
                  >
                    {ev.action}
                  </span>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
