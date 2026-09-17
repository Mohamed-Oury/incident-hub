import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/modules/auth/auth-service";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const domain = searchParams.get("domain");
    const status = searchParams.get("status");
    const search = searchParams.get("search");

    const where: any = {};

    if (domain && domain !== "ALL") {
      where.domain = domain;
    }

    if (status && status !== "ALL") {
      where.knowledgeStatus = status;
    }

    if (search) {
      where.OR = [
        { reference: { contains: search } },
        { title: { contains: search } },
        { component: { contains: search } },
        { errorCode: { contains: search } },
        { description: { contains: search } },
      ];
    }

    const incidents = await prisma.incident.findMany({
      where,
      include: {
        author: true,
        observations: true,
        flowSteps: { orderBy: { position: "asc" } },
        isoMessages: true,
        hypotheses: true,
        evidence: true,
        rootCause: true,
        resolution: true,
        prevention: true,
      },
      orderBy: { reference: "asc" },
    });

    return NextResponse.json({ success: true, count: incidents.length, incidents });
  } catch (error: any) {
    console.error("Erreur GET /api/incidents:", error);
    return NextResponse.json({ error: "Erreur lors de la récupération des incidents" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await getSession();
    const body = await request.json();

    const {
      title,
      domain,
      component,
      errorCode,
      severity,
      symptom,
      facts,
      scope,
      breakPoint,
      hypotheses,
      evidence,
      rootCause,
      correction,
      prevention,
    } = body;

    if (!title) {
      return NextResponse.json({ error: "Le titre est requis" }, { status: 400 });
    }

    const count = await prisma.incident.count();
    const reference = `INC-${String(count + 1).padStart(3, "0")}`;

    const authorId = user?.id || (await prisma.user.findFirst())?.id;
    if (!authorId) {
      return NextResponse.json({ error: "Aucun utilisateur trouvé pour être auteur" }, { status: 400 });
    }

    const incident = await prisma.incident.create({
      data: {
        reference,
        title,
        description: symptom,
        domain: domain || "GAB",
        component: component || "Frontal Payway",
        errorCode: errorCode || "DE39=91",
        severity: severity || "HIGH",
        status: "UNDER_INVESTIGATION",
        knowledgeStatus: rootCause ? "VALIDATED" : "REFERENCE_SCENARIO",
        authorId,
        observations: {
          create: {
            symptom: symptom || "Symptôme non précisé",
            facts: facts || "Faits observés en attente",
            scope: scope || "Périmètre général",
            context: "Création via Diagnostic Wizard",
          },
        },
        flowSteps: {
          create: [
            {
              position: 1,
              source: domain || "GAB",
              destination: "Payway Frontal",
              event: "Requête transactionnelle initiale",
              status: "OK",
            },
            {
              position: 2,
              source: "Payway Frontal",
              destination: component || "Switch",
              event: `Acheminement et point de rupture : ${breakPoint || "Routage"}`,
              status: "POINT_DE_RUPTURE",
            },
          ],
        },
        isoMessages: {
          create: {
            mti: "0200",
            bitmap: "7238000008C08000",
            stan: "991001",
            rrn: "991001991001",
            responseCode: errorCode ? errorCode.replace(/[^0-9]/g, "") || "91" : "91",
            terminalId: "AUTO01",
            maskedRawMessage: evidence || "0200************************************",
          },
        },
        hypotheses: {
          create: (hypotheses || []).map((h: any) => ({
            description: h.desc || h.description || "Hypothèse formulée",
            status: h.status || "OPEN",
          })),
        },
        evidence: evidence
          ? {
              create: {
                type: "Trace Trame Masquée",
                content: evidence,
                source: "Console Opérateur",
              },
            }
          : undefined,
        rootCause: rootCause
          ? {
              create: {
                category: "Technique & Applicatif",
                description: rootCause,
                justification: "Validé dans le parcours de résolution",
                validatedBy: user?.name || "Expert Monétique",
                validatedAt: new Date(),
              },
            }
          : undefined,
        resolution: correction
          ? {
              create: {
                actions: correction,
                result: "Action curative déployée",
                executor: user?.name || "Opérateur",
              },
            }
          : undefined,
        prevention: prevention
          ? {
              create: {
                action: prevention,
                priority: "HIGH",
                status: "OPEN",
              },
            }
          : undefined,
      },
    });

    await prisma.auditLog.create({
      data: {
        action: "INCIDENT_CREATED",
        entity: "INCIDENT",
        entityId: incident.id,
        userId: authorId,
        metadata: { reference: incident.reference, title: incident.title },
      },
    });

    return NextResponse.json({ success: true, incident });
  } catch (error: any) {
    console.error("Erreur POST /api/incidents:", error);
    return NextResponse.json({ error: "Impossible de créer l'incident" }, { status: 500 });
  }
}
