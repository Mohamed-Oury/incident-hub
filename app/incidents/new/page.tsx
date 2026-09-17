import { getSession } from "@/modules/auth/auth-service";
import { AppShell } from "@/modules/layout/AppShell";
import { DiagnosticWizard } from "@/modules/diagnostic/components/DiagnosticWizard";

export default async function NewIncidentPage() {
  const user = await getSession();

  return (
    <AppShell user={user} pageTitle="Incident Builder" eyebrow="CRÉATION STRUCTURÉE">
      <DiagnosticWizard />
    </AppShell>
  );
}
