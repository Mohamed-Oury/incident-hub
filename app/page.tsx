import { getSession } from "@/modules/auth/auth-service";
import { getAllIncidents } from "@/modules/incidents/data-store";
import { AppShell } from "@/modules/layout/AppShell";
import { MetricsOverview } from "@/modules/dashboard/components/MetricsOverview";
import { KnowledgeCatalog } from "@/modules/knowledge-base/components/KnowledgeCatalog";
import Link from "next/link";

export default async function HomePage() {
  const user = await getSession();
  const incidents = await getAllIncidents();

  return (
    <AppShell user={user} pageTitle="Vue d'ensemble" eyebrow="EXPLOITATION MONÉTIQUE">
      {/* 1. Métriques clés */}
      <MetricsOverview incidents={incidents} />

      {/* 2. Appel à l'action Diagnostic et méthodologie */}
      <div
        style={{
          background: "linear-gradient(135deg, #111827 0%, #1f2937 100%)",
          color: "white",
          padding: "2rem",
          borderRadius: "16px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.35)",
          border: "1px solid #374151",
          borderLeft: "6px solid #e60028",
        }}
      >
        <div>
          <span style={{ fontSize: "0.75rem", letterSpacing: "0.1em", fontWeight: 700, textTransform: "uppercase", color: "#e60028" }}>
            ASSISTANT DE DIAGNOSTIC GUIDÉ
          </span>
          <h2 style={{ fontSize: "1.4rem", fontWeight: 800, marginTop: "0.3rem" }}>
            Un incident monétique en cours ?
          </h2>
          <p style={{ fontSize: "0.92rem", opacity: 0.9, marginTop: "0.25rem", maxWidth: "600px", color: "#d1d5db" }}>
            Suivez la démarche standardisée : Symptômes → Point de rupture → Hypothèses → Preuves ISO 8583 → Cause Racine validée.
          </p>
        </div>

        <Link
          href="/diagnostic"
          style={{
            background: "#e60028",
            color: "#ffffff",
            fontWeight: 700,
            padding: "0.85rem 1.6rem",
            borderRadius: "10px",
            fontSize: "0.95rem",
            whiteSpace: "nowrap",
            boxShadow: "0 4px 12px rgba(230, 0, 40, 0.35)",
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
