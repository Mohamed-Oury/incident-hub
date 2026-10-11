import { AppShell } from "@/modules/layout/AppShell";
import { IsoMessageParserTool } from "@/modules/knowledge-base/components/IsoMessageParserTool";
import { getSession } from "@/modules/auth/auth-service";

export default async function ParserPage() {
  const user = await getSession();

  return (
    <AppShell
      user={user}
      pageTitle="Parseur de Trames ISO 8583"
      eyebrow="ANALYSE & FORENSICS MONÉTIQUE"
    >
      <IsoMessageParserTool />
    </AppShell>
  );
}
