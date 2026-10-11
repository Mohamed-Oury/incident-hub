import { AppShell } from "@/modules/layout/AppShell";
import { BitmapDecoderTool } from "@/modules/knowledge-base/components/BitmapDecoderTool";
import { getSession } from "@/modules/auth/auth-service";

export default async function BitmapDecoderPage() {
  const user = await getSession();

  return (
    <AppShell
      user={user}
      pageTitle="Décodeur de Bitmaps ISO 8583"
      eyebrow="INGÉNIERIE & ANALYSE DE TRAMES"
    >
      <BitmapDecoderTool />
    </AppShell>
  );
}
