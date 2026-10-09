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
      <div
        style={{
          background: "linear-gradient(135deg, #7d1538 0%, #1e293b 100%)",
          color: "white",
          padding: "2rem",
          borderRadius: "16px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          boxShadow: "0 10px 25px -5px rgba(125, 21, 56, 0.35)",
          border: "1px solid #334155",
          borderLeft: "6px solid #a01e4a",
        }}
      >
        <div>
          <span style={{ fontSize: "0.75rem", letterSpacing: "0.1em", fontWeight: 700, textTransform: "uppercase", color: "#f8d0db" }}>
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
          href="/diagnostic"
          style={{
            background: "linear-gradient(135deg, #7d1538 0%, #a01e4a 100%)",
            color: "#ffffff",
            fontWeight: 700,
            padding: "0.85rem 1.6rem",
            borderRadius: "10px",
            fontSize: "0.95rem",
            whiteSpace: "nowrap",
            boxShadow: "0 4px 12px rgba(125, 21, 56, 0.4)",
            border: "none",
          }}
        >
          Lancer le diagnostic →
        </Link>
      </div>

      {/* 3. Knowledge Base & Catalogue des incidents de référence */}
      <KnowledgeCatalog initialIncidents={incidents} />
    </AppShell>
  );
}
