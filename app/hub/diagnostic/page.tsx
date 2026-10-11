import { getSession } from "@/modules/auth/auth-service";
import { AppShell } from "@/modules/layout/AppShell";
import { DiagnosticWizard } from "@/modules/diagnostic/components/DiagnosticWizard";

export default async function DiagnosticPage() {
  const user = await getSession();

  return (
    <AppShell user={user} pageTitle="Diagnostic Assistant" eyebrow="MÉTHODOLOGIE STANDARD">
      <DiagnosticWizard />
    </AppShell>
  );
}
