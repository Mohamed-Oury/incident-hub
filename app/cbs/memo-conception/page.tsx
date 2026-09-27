"use client";

import { AppShell } from "@/modules/layout/AppShell";
import { CbsConceptionCheatSheet } from "@/modules/cbs/CbsConceptionCheatSheet";

export default function CbsMemoConceptionPage() {
  return (
    <AppShell pageTitle="Antisèche Conception 4GL & .PER" eyebrow="FICHE MÉMO CORE BANKING">
      <div style={{ maxWidth: "1280px", margin: "0 auto", paddingBottom: "40px" }}>
        <CbsConceptionCheatSheet />
      </div>
    </AppShell>
  );
}
