import { getSession } from "@/modules/auth/auth-service";
import { AppShell } from "@/modules/layout/AppShell";
import { DEDirectory } from "@/modules/knowledge-base/components/DEDirectory";

interface DEPageProps {
  searchParams: Promise<{ search?: string }>;
}

export default async function DEPage({ searchParams }: DEPageProps) {
  const { search } = await searchParams;
  const user = await getSession();

  return (
    <AppShell
      user={user}
      pageTitle="Référentiel des Champs DE (ISO 8583)"
      eyebrow="DICTIONNAIRE TECHNIQUE & PROTOCOLES"
    >
      <DEDirectory initialSearch={search || ""} />
    </AppShell>
  );
}
