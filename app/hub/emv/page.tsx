import { AppShell } from "@/modules/layout/AppShell";
import { EmvDecoderTool } from "@/modules/knowledge-base/components/EmvDecoderTool";
import { getSession } from "@/modules/auth/auth-service";

export default async function EmvPage() {
  const user = await getSession();

  return (
    <AppShell
      user={user}
      pageTitle="Décodeur EMV / DE55 (TLV & TVR)"
      eyebrow="ANALYSE SÉCURITÉ CRYPTO & PUCE"
    >
      <EmvDecoderTool />
    </AppShell>
  );
}
