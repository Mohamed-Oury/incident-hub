import { getSession } from "@/modules/auth/auth-service";
import { AppShell } from "@/modules/layout/AppShell";
import { AuditTimeline } from "@/modules/audit/components/AuditTimeline";

export default async function AuditPage() {
  const user = await getSession();

  return (
    <AppShell user={user} pageTitle="Piste d'Audit & Gouvernance" eyebrow="SÉCURITÉ & TRACABILITÉ">
      <AuditTimeline />
    </AppShell>
  );
}
