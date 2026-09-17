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

export function AuditTimeline() {
  const [audits, setAudits] = useState<AuditEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/audit")
      .then((res) => res.json())
      .then((data) => {
        if (data.audits) {
          setAudits(data.audits);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ background: "#ffffff", borderRadius: "14px", border: "1px solid #e2e8f0", padding: "1.75rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <div>
          <h3 style={{ fontSize: "1.15rem", fontWeight: 800, color: "#0f172a" }}>
            Piste d&apos;Audit & Traçabilité des Actions
          </h3>
          <p style={{ fontSize: "0.85rem", color: "#64748b", marginTop: "0.2rem" }}>
            Historique dynamique en temps réel issu de la base de données.
          </p>
        </div>
        <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "#059669", background: "#ecfdf5", padding: "0.3rem 0.7rem", borderRadius: "6px" }}>
          {audits.length} action{audits.length > 1 ? "s" : ""} tracée{audits.length > 1 ? "s" : ""}
        </span>
      </div>

      {loading ? (
        <p style={{ color: "#64748b", fontSize: "0.9rem", padding: "2rem 0", textAlign: "center" }}>
          Chargement de la piste d&apos;audit...
        </p>
      ) : audits.length === 0 ? (
        <div style={{ textAlign: "center", padding: "3.5rem 1rem", color: "#64748b" }}>
          <div style={{ fontSize: "2.5rem", marginBottom: "0.75rem" }}>🛡️</div>
          <h4 style={{ fontSize: "1.05rem", fontWeight: 700, color: "#0f172a" }}>Aucun événement d&apos;audit</h4>
          <p style={{ fontSize: "0.88rem", marginTop: "0.3rem" }}>
            La piste d&apos;audit est actuellement vierge. Les actions de validation, connexion et création d&apos;incident s&apos;afficheront ici.
          </p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {audits.map((ev) => (
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
