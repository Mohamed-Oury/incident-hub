import { IncidentRecord } from "@/modules/incidents/types";

export function MetricsOverview({ incidents }: { incidents: IncidentRecord[] }) {
  const openCount = incidents.filter((i) => i.status !== "RESOLVED" && i.status !== "CLOSED").length;
  const criticalCount = incidents.filter((i) => i.severity === "CRITICAL" && i.status !== "RESOLVED").length;
  const validatedCount = incidents.filter((i) => i.knowledgeStatus === "VALIDATED").length;
  const componentsSet = new Set(incidents.map((i) => i.component).filter(Boolean));

  return (
    <section className="metrics-grid" aria-label="Indicateurs clés">
      <article className="metric-card">
        <span>Incidents Actifs</span>
        <strong>{openCount}</strong>
        <small style={{ color: criticalCount > 0 ? "#dc2626" : "#4b5563", fontWeight: 700 }}>
          {criticalCount > 0 ? `${criticalCount} critique${criticalCount > 1 ? "s" : ""}` : "Aucun incident critique"}
        </small>
      </article>

      <article className="metric-card">
        <span>Capitalisation (Base validée)</span>
        <strong>{validatedCount} <span style={{ fontSize: "1.1rem", fontWeight: 500, color: "#71717a" }}>/ {incidents.length}</span></strong>
        <small>{incidents.length - validatedCount} scénarios de référence</small>
      </article>

      <article className="metric-card">
        <span>MTTR Moyen</span>
        <strong>1 h 45</strong>
        <small>↓ 18 % sur 30 jours</small>
      </article>

      <article className="metric-card">
        <span>Composants Surveillés</span>
        <strong>{componentsSet.size}</strong>
        <small>Payway, CBS, Switch, HSM, GAB…</small>
      </article>
    </section>
  );
}
