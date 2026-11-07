"use client";

import { useMemo } from "react";
import { IncidentRecord } from "@/modules/incidents/types";
import { useSubsidiary } from "@/modules/layout/SubsidiaryContext";

export function MetricsOverview({ incidents }: { incidents: IncidentRecord[] }) {
  const { subsidiary } = useSubsidiary();

  const filtered = useMemo(() => {
    return incidents.filter((i) => {
      const incSub = i.subsidiary === "AFG" ? "AFG" : "SGABS";
      return incSub === subsidiary;
    });
  }, [incidents, subsidiary]);

  const openCount = filtered.filter((i) => i.status !== "RESOLVED" && i.status !== "CLOSED").length;
  const criticalCount = filtered.filter((i) => i.severity === "CRITICAL" && i.status !== "RESOLVED").length;
  const validatedCount = filtered.filter((i) => i.knowledgeStatus === "VALIDATED").length;
  const componentsSet = new Set(filtered.map((i) => i.component).filter(Boolean));

  return (
    <section className="metrics-grid" aria-label="Indicateurs clés">
      <article className="metric-card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span>Incidents Actifs</span>
          <span
            style={{
              fontSize: "0.7rem",
              fontWeight: 800,
              padding: "0.15rem 0.5rem",
              borderRadius: "6px",
              background: subsidiary === "AFG" ? "#f0fdf4" : "#fef2f2",
              color: subsidiary === "AFG" ? "#15803d" : "#e60028",
              border: `1px solid ${subsidiary === "AFG" ? "#bbf7d0" : "#fecaca"}`,
            }}
          >
            {subsidiary === "AFG" ? "AFG Bank" : "SGABS"}
          </span>
        </div>
        <strong>{openCount}</strong>
        <small style={{ color: criticalCount > 0 ? "#dc2626" : "#4b5563", fontWeight: 700 }}>
          {criticalCount > 0 ? `${criticalCount} critique${criticalCount > 1 ? "s" : ""}` : "Aucun incident critique"}
        </small>
      </article>

      <article className="metric-card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span>Capitalisation ({subsidiary === "AFG" ? "AFG Bank" : "SGABS"})</span>
          <span
            style={{
              fontSize: "0.7rem",
              fontWeight: 800,
              padding: "0.15rem 0.5rem",
              borderRadius: "6px",
              background: subsidiary === "AFG" ? "#f0fdf4" : "#fef2f2",
              color: subsidiary === "AFG" ? "#15803d" : "#e60028",
              border: `1px solid ${subsidiary === "AFG" ? "#bbf7d0" : "#fecaca"}`,
            }}
          >
            {subsidiary === "AFG" ? "AFG Bank" : "SGABS"}
          </span>
        </div>
        <strong>
          {validatedCount}{" "}
          <span style={{ fontSize: "1.1rem", fontWeight: 500, color: "#71717a" }}>
            / {filtered.length}
          </span>
        </strong>
        <small>
          {filtered.length === 0
            ? "Base prête pour les déclarations AFG"
            : `${filtered.length - validatedCount} scénarios de référence`}
        </small>
      </article>

      <article className="metric-card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span>Composants Surveillés</span>
          <span
            style={{
              fontSize: "0.7rem",
              fontWeight: 800,
              padding: "0.15rem 0.5rem",
              borderRadius: "6px",
              background: subsidiary === "AFG" ? "#f0fdf4" : "#fef2f2",
              color: subsidiary === "AFG" ? "#15803d" : "#e60028",
              border: `1px solid ${subsidiary === "AFG" ? "#bbf7d0" : "#fecaca"}`,
            }}
          >
            {subsidiary === "AFG" ? "AFG Bank" : "SGABS"}
          </span>
        </div>
        <strong>{componentsSet.size}</strong>
        <small>
          {subsidiary === "AFG"
            ? "Réseau Atlantic (Switch, GAB, TPE, Host)"
            : "PowerCard & Payway, CBS, Switch, HSM, GAB…"}
        </small>
      </article>
    </section>
  );
}
