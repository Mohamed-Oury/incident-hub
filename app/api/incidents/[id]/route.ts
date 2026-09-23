import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/modules/auth/auth-service";
import { getIncidentByReference } from "@/modules/incidents/data-store";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(_req: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const incident = await getIncidentByReference(id);

    if (!incident) {
      return NextResponse.json({ error: "Incident introuvable" }, { status: 404 });
    }

    return NextResponse.json({ success: true, incident });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const user = await getSession();
    const body = await request.json();

    const {
      title,
      severity,
      status,
      knowledgeStatus,
      symptom,
      facts,
      rootCauseCategory,
      rootCauseDescription,
      rootCauseJustification,
      resolutionActions,
      resolutionResult,
    } = body;

    const existing = await prisma.incident.findFirst({
      where: { OR: [{ id }, { reference: id }] },
      include: { rootCause: true, resolution: true },
    });

    if (!existing) {
      return NextResponse.json({ error: "Incident introuvable" }, { status: 404 });
    }

    const updated = await prisma.incident.update({
      where: { id: existing.id },
      data: {
        title: title || undefined,
        severity: severity || undefined,
        status: status || (rootCauseDescription ? "RESOLVED" : undefined),
        knowledgeStatus: knowledgeStatus || (rootCauseDescription ? "VALIDATED" : undefined),
        resolvedAt: rootCauseDescription ? new Date() : undefined,
      },
    });

    if (symptom || facts) {
      const firstObs = await prisma.observation.findFirst({ where: { incidentId: existing.id } });
      if (firstObs) {
        await prisma.observation.update({
          where: { id: firstObs.id },
          data: {
            symptom: symptom || firstObs.symptom,
            facts: facts || firstObs.facts,
          },
        });
      } else {
        await prisma.observation.create({
          data: {
            incidentId: existing.id,
            symptom: symptom || "Symptôme",
            facts: facts || "Faits observés",
          },
        });
      }
    }

    if (rootCauseDescription) {
      await prisma.rootCause.upsert({
        where: { incidentId: existing.id },
        update: {
          category: rootCauseCategory || "Analyse Monétique",
          description: rootCauseDescription,
          justification: rootCauseJustification || "Validation formelle lors du traitement de l'incident.",
          validatedBy: user?.name || "Oury Kohkoun (Expert Monétique)",
          validatedAt: new Date(),
        },
        create: {
          incidentId: existing.id,
          category: rootCauseCategory || "Analyse Monétique",
          description: rootCauseDescription,
          justification: rootCauseJustification || "Validation formelle lors du traitement de l'incident.",
          validatedBy: user?.name || "Oury Kohkoun (Expert Monétique)",
          validatedAt: new Date(),
        },
      });
    }

    if (resolutionActions) {
      await prisma.resolution.upsert({
        where: { incidentId: existing.id },
        update: {
          actions: resolutionActions,
          result: resolutionResult || "Service rétabli et vérifié.",
          executor: user?.name || "Oury Kohkoun",
          approver: "Responsable Monétique",
        },
        create: {
          incidentId: existing.id,
          actions: resolutionActions,
          result: resolutionResult || "Service rétabli et vérifié.",
          executor: user?.name || "Oury Kohkoun",
          approver: "Responsable Monétique",
        },
      });
    }

    return NextResponse.json({ success: true, incident: updated });
  } catch (error: any) {
    console.error("Erreur PUT /api/incidents/[id]:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
