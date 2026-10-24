export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/modules/auth/auth-service";
import { canEditIncident, canDeleteIncident } from "@/modules/auth/types";
import {
  getIncidentByReference,
  saveLocalIncidentOverride,
  markLocalIncidentDeleted,
} from "@/modules/incidents/data-store";

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

// Modification d'un incident (Autorisé pour SUPER_ADMIN et ADMIN uniquement, même si déjà validé)
export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const user = await getSession();

    if (!user || !canEditIncident(user)) {
      return NextResponse.json(
        { error: "Accès refusé : seuls le Super Administrateur et l'Administrateur peuvent modifier un incident." },
        { status: 403 }
      );
    }

    const currentIncident = await getIncidentByReference(id);
    if (!currentIncident) {
      return NextResponse.json({ error: "Incident introuvable" }, { status: 404 });
    }

    const body = await request.json();
    const {
      title,
      description,
      domain,
      component,
      errorCode,
      environment,
      severity,
      status,
      knowledgeStatus,
      symptom,
      facts,
      scope,
      context,
      hypotheses,
      evidence,
      rootCauseCategory,
      rootCauseDescription,
      rootCauseJustification,
      resolutionActions,
      resolutionResult,
      prevention,
    } = body;

    // 1. Persistance locale garantie (fonctionne aussi sur les incidents de référence et incidents validés)
    const updatedObservations =
      symptom !== undefined || facts !== undefined || scope !== undefined || context !== undefined
        ? [
            {
              symptom: symptom ?? currentIncident.observations?.[0]?.symptom ?? "",
              facts: facts ?? currentIncident.observations?.[0]?.facts ?? "",
              scope: scope ?? currentIncident.observations?.[0]?.scope,
              context: context ?? currentIncident.observations?.[0]?.context,
            },
          ]
        : currentIncident.observations;

    const updatedRootCause =
      rootCauseDescription !== undefined || rootCauseCategory !== undefined
        ? {
            category: rootCauseCategory || currentIncident.rootCause?.category || "Analyse Monétique",
            description: rootCauseDescription ?? currentIncident.rootCause?.description ?? "",
            justification:
              rootCauseJustification ??
              currentIncident.rootCause?.justification ??
              "Validation formelle lors de la mise à jour de l'incident.",
            validatedBy: user.name || "Administrateur",
            validatedAt: new Date().toISOString(),
          }
        : currentIncident.rootCause;

    const updatedResolution =
      resolutionActions !== undefined || resolutionResult !== undefined
        ? {
            actions: resolutionActions ?? currentIncident.resolution?.actions ?? "",
            result: resolutionResult ?? currentIncident.resolution?.result ?? "Service rétabli et vérifié.",
            executor: user.name || "Administrateur",
            approver: "Supervision Monétique",
          }
        : currentIncident.resolution;

    saveLocalIncidentOverride(currentIncident.reference, {
      title: title || currentIncident.title,
      description: description !== undefined ? description : symptom || currentIncident.description,
      domain: domain || currentIncident.domain,
      component: component || currentIncident.component,
      errorCode: errorCode || currentIncident.errorCode,
      environment: environment || currentIncident.environment || "PRODUCTION",
      severity: (severity || currentIncident.severity) as any,
      status: (status || currentIncident.status || "RESOLVED") as any,
      knowledgeStatus: (knowledgeStatus || currentIncident.knowledgeStatus || "VALIDATED") as any,
      updatedAt: new Date().toISOString(),
      observations: updatedObservations,
      hypotheses: Array.isArray(hypotheses) ? hypotheses : currentIncident.hypotheses,
      evidence: Array.isArray(evidence) ? evidence : currentIncident.evidence,
      rootCause: updatedRootCause,
      resolution: updatedResolution,
      prevention: Array.isArray(prevention) ? prevention : currentIncident.prevention,
    });

    // 2. Synchronisation Prisma / MySQL si l'incident existe en base
    try {
      const existing = await prisma.incident.findFirst({
        where: { OR: [{ id }, { reference: id }] },
        include: { rootCause: true, resolution: true },
      });

      if (existing) {
        await prisma.incident.update({
          where: { id: existing.id },
          data: {
            title: title || undefined,
            description: description !== undefined ? description : undefined,
            domain: domain || undefined,
            component: component || undefined,
            errorCode: errorCode || undefined,
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
              validatedBy: user?.name || "Administrateur",
              validatedAt: new Date(),
            },
            create: {
              incidentId: existing.id,
              category: rootCauseCategory || "Analyse Monétique",
              description: rootCauseDescription,
              justification: rootCauseJustification || "Validation formelle lors du traitement de l'incident.",
              validatedBy: user?.name || "Administrateur",
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
              executor: user?.name || "Administrateur",
              approver: "Responsable Monétique",
            },
            create: {
              incidentId: existing.id,
              actions: resolutionActions,
              result: resolutionResult || "Service rétabli et vérifié.",
              executor: user?.name || "Administrateur",
              approver: "Responsable Monétique",
            },
          });
        }
      }
    } catch {
      // Ignore si MySQL hors ligne, la persistance locale est déjà enregistrée
    }

    const updatedIncident = await getIncidentByReference(currentIncident.reference);
    return NextResponse.json({ success: true, incident: updatedIncident });
  } catch (error: any) {
    console.error("Erreur PUT /api/incidents/[id]:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Suppression d'un incident (Autorisé EXCLUSIVEMENT pour SUPER_ADMIN)
export async function DELETE(_request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const user = await getSession();

    if (!user || !canDeleteIncident(user)) {
      return NextResponse.json(
        { error: "Accès refusé : seul le Super Administrateur est autorisé à supprimer un incident." },
        { status: 403 }
      );
    }

    const currentIncident = await getIncidentByReference(id);
    const targetRef = currentIncident?.reference || id;

    // 1. Supprimer du store persistant local
    markLocalIncidentDeleted(targetRef);

    // 2. Supprimer de Prisma / MySQL si présent
    try {
      await prisma.incident.deleteMany({
        where: { OR: [{ id }, { reference: targetRef }] },
      });
    } catch {
      // Ignore si MySQL hors ligne
    }

    return NextResponse.json({
      success: true,
      deletedReference: targetRef,
      message: `L'incident ${targetRef} a été supprimé définitivement.`,
    });
  } catch (error: any) {
    console.error("Erreur DELETE /api/incidents/[id]:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
