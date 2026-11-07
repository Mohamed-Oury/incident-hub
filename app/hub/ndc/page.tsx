import { AppShell } from "@/modules/layout/AppShell";
import { NdcParserTool } from "@/modules/knowledge-base/components/NdcParserTool";
import { getSession } from "@/modules/auth/auth-service";

export default async function NdcParserPage() {
  const user = await getSession();

  return (
    <AppShell
      user={user}
      pageTitle="Décodeur de Trames NDC (GAB / ATM)"
      eyebrow="ANALYSE & FORENSICS MONÉTIQUE"
    >
      <NdcParserTool />
    </AppShell>
  );
}
