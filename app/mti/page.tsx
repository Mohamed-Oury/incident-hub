import { AppShell } from "@/modules/layout/AppShell";
import { MTIDirectory } from "@/modules/knowledge-base/components/MTIDirectory";
import { getSession } from "@/modules/auth/auth-service";

export default async function MTIPage() {
  const user = await getSession();

  return (
    <AppShell
      user={user}
      pageTitle="Référentiel des Messages MTI (ISO 8583)"
      eyebrow="DICTIONNAIRE TECHNIQUE & PROTOCOLES"
    >
      <MTIDirectory />
    </AppShell>
  );
}
