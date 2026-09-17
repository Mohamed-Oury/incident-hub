import { getSession } from "@/modules/auth/auth-service";
import { getAllIncidents } from "@/modules/incidents/data-store";
import { AppShell } from "@/modules/layout/AppShell";
import { KnowledgeCatalog } from "@/modules/knowledge-base/components/KnowledgeCatalog";

interface KnowledgePageProps {
  searchParams: Promise<{ search?: string }>;
}

export default async function KnowledgePage({ searchParams }: KnowledgePageProps) {
  const { search } = await searchParams;
  const user = await getSession();
  const incidents = await getAllIncidents();

  return (
    <AppShell user={user} pageTitle="Base de Connaissances" eyebrow="CAPITALISATION TECHNIQUE">
      <KnowledgeCatalog initialIncidents={incidents} initialSearch={search || ""} />
    </AppShell>
  );
}
