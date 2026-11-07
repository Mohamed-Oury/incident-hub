import { getSession } from "@/modules/auth/auth-service";
import { getAllIncidents } from "@/modules/incidents/data-store";
import { AppShell } from "@/modules/layout/AppShell";
import { MetricsOverview } from "@/modules/dashboard/components/MetricsOverview";
import { KnowledgeCatalog } from "@/modules/knowledge-base/components/KnowledgeCatalog";
import Link from "next/link";

export default async function MonetiqueHubPage() {
  const user = await getSession();
  const incidents = await getAllIncidents();

  return (
    <AppShell user={user} pageTitle="Vue d'ensemble" eyebrow="EXPLOITATION MONÉTIQUE & CBS">
      {/* 1. Métriques clés */}
      <MetricsOverview incidents={incidents} />

      {/* 2. Appel à l'action Diagnostic et méthodologie */}
      <div className="banner-diagnostic-cta">
        <div>
          <span style={{ fontSize: "0.75rem", letterSpacing: "0.1em", fontWeight: 700, textTransform: "uppercase", color: "var(--sg-red-200)" }}>
            ASSISTANT DE DIAGNOSTIC GUIDÉ
          </span>
          <h2 style={{ fontSize: "1.4rem", fontWeight: 800, marginTop: "0.3rem" }}>
            Un incident monétique en cours ?
          </h2>
          <p style={{ fontSize: "0.92rem", opacity: 0.9, marginTop: "0.25rem", maxWidth: "600px", color: "#f1f5f9" }}>
            Suivez la démarche standardisée : Symptômes → Point de rupture → Hypothèses → Preuves ISO 8583 → Cause Racine validée.
          </p>
        </div>

        <Link
          href="/hub/diagnostic"
          className="banner-diagnostic-btn"
        >
          Lancer le diagnostic →
        </Link>
      </div>

      {/* 3. Knowledge Base & Catalogue des incidents de référence */}
      <KnowledgeCatalog initialIncidents={incidents} />
    </AppShell>
  );
}
