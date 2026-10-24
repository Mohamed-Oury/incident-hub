import { notFound } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/modules/auth/auth-service";
import { canEditIncident } from "@/modules/auth/types";
import { getIncidentByReference } from "@/modules/incidents/data-store";
import { AppShell } from "@/modules/layout/AppShell";
import { EditIncidentForm } from "./EditIncidentForm";

interface EditIncidentPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditIncidentPage({ params }: EditIncidentPageProps) {
  const { id } = await params;
  const user = await getSession();

  if (!user || !canEditIncident(user)) {
    return (
      <AppShell user={user} pageTitle="Accès Refusé" eyebrow="GOUVERNANCE BASE DE CONNAISSANCES">
        <div
          style={{
            background: "#ffffff",
            padding: "2.5rem",
            borderRadius: "16px",
            border: "1px solid #fecaca",
            maxWidth: "600px",
            margin: "2rem auto",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: "2.2rem", marginBottom: "0.75rem" }}>🔒</div>
          <h2 style={{ fontSize: "1.25rem", fontWeight: 800, color: "#991b1b", marginBottom: "0.5rem" }}>
            Modification réservée au Super Administrateur et à l&apos;Administrateur
          </h2>
          <p style={{ fontSize: "0.9rem", color: "#64748b", marginBottom: "1.5rem" }}>
            Les autres rôles n&apos;ont pas accès à la modification des incidents dans la base de connaissances.
          </p>
          <Link href="/hub/knowledge" className="btn-primary">
            ← Retour à la Base de Connaissances
          </Link>
        </div>
      </AppShell>
    );
  }

  const incident = await getIncidentByReference(id);

  if (!incident) {
    notFound();
  }

  return (
    <AppShell user={user} pageTitle={`Modifier l'incident ${incident.reference}`} eyebrow="MODIFICATION & CAPITALISATION MONÉTIQUE">
      <EditIncidentForm incident={incident} />
    </AppShell>
  );
}
