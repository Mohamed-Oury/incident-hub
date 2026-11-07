import { notFound } from "next/navigation";
import Link from "next/link";
import { getIncidentByReference } from "@/modules/incidents/data-store";
import { FicheIncidentClient } from "./FicheIncidentClient";

interface FicheIncidentPageProps {
  params: Promise<{ id: string }>;
}

export default async function FicheIncidentPage({ params }: FicheIncidentPageProps) {
  const { id } = await params;
  const incident = await getIncidentByReference(id);

  if (!incident) {
    notFound();
  }

  return <FicheIncidentClient incident={incident} />;
}

