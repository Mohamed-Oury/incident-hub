import { notFound } from "next/navigation";
import { getSession } from "@/modules/auth/auth-service";
import { getIncidentByReference } from "@/modules/incidents/data-store";
import { AppShell } from "@/modules/layout/AppShell";
import { EditIncidentForm } from "./EditIncidentForm";

interface EditIncidentPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditIncidentPage({ params }: EditIncidentPageProps) {
  const { id } = await params;
  const user = await getSession();
  const incident = await getIncidentByReference(id);

  if (!incident) {
    notFound();
  }

  return (
    <AppShell user={user} pageTitle={`Traiter l'incident ${incident.reference}`} eyebrow="RÉSOLUTION & VALIDATION MONÉTIQUE">
      <EditIncidentForm incident={incident} />
    </AppShell>
  );
}
