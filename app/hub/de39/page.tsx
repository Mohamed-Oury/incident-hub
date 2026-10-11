import { getSession } from "@/modules/auth/auth-service";
import { AppShell } from "@/modules/layout/AppShell";
import { DE39Directory } from "@/modules/knowledge-base/components/DE39Directory";

export default async function DE39Page() {
  const user = await getSession();

  return (
    <AppShell user={user} pageTitle="Référentiel Codes DE39 (ISO 8583)" eyebrow="NORME & DIAGNOSTIC MONÉTIQUE">
      <DE39Directory />
    </AppShell>
  );
}
