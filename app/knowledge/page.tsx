import { getSession } from "@/modules/auth/auth-service";
import { getAllIncidents } from "@/modules/incidents/data-store";
import { AppShell } from "@/modules/layout/AppShell";
import { KnowledgeCatalog } from "@/modules/knowledge-base/components/KnowledgeCatalog";

export default async function KnowledgePage() {
  const user = await getSession();
  const incidents = await getAllIncidents();

  return (
    <AppShell user={user} pageTitle="Base de Connaissances" eyebrow="CAPITALISATION TECHNIQUE">
      <KnowledgeCatalog initialIncidents={incidents} />
    </AppShell>
  );
}
