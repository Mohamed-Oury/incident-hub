import { AppShell } from "@/modules/layout/AppShell";
import { AtmEjAnalyzerTool } from "@/modules/knowledge-base/components/AtmEjAnalyzerTool";
import { getSession } from "@/modules/auth/auth-service";

export default async function AtmEjPage() {
  const user = await getSession();

  return (
    <AppShell
      user={user}
      pageTitle="Analyseur de Journal GAB (ATM EJ)"
      eyebrow="AUDIT & RÉCLAMATIONS CLIENTS"
    >
      <AtmEjAnalyzerTool />
    </AppShell>
  );
}
