"use client";

import { AppShell } from "@/modules/layout/AppShell";
import { MonetiqueCheatSheet } from "@/modules/training-monetique/MonetiqueCheatSheet";

export default function MonetiqueCheatSheetPage() {
  return (
    <AppShell pageTitle="Antisèche Monétique, ISO 8583 & EMV" eyebrow="FICHE MÉMO RUN MONÉTIQUE">
      <div style={{ maxWidth: "1280px", margin: "0 auto", paddingBottom: "40px" }}>
        <MonetiqueCheatSheet />
      </div>
    </AppShell>
  );
}
