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
          background: "linear-gradient(135deg, #059669 0%, #047857 100%)",
          color: "white",
          padding: "2rem",
          borderRadius: "16px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          boxShadow: "0 10px 25px -5px rgba(5, 150, 105, 0.4)",
        }}
      >
        <div>
          <span style={{ fontSize: "0.75rem", letterSpacing: "0.1em", fontWeight: 700, textTransform: "uppercase", opacity: 0.9 }}>
            ASSISTANT DE DIAGNOSTIC GUIDÉ
          </span>
          <h2 style={{ fontSize: "1.4rem", fontWeight: 800, marginTop: "0.3rem" }}>
            Un incident monétique en cours ?
          </h2>
          <p style={{ fontSize: "0.92rem", opacity: 0.9, marginTop: "0.25rem", maxWidth: "600px" }}>
            Suivez la démarche standardisée : Symptômes → Point de rupture → Hypothèses → Preuves ISO 8583 → Cause Racine validée.
          </p>
        </div>

        <Link
          href="/diagnostic"
          style={{
            background: "#ffffff",
            color: "#064e3b",
            fontWeight: 700,
            padding: "0.85rem 1.6rem",
            borderRadius: "10px",
            fontSize: "0.95rem",
            whiteSpace: "nowrap",
            boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
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
