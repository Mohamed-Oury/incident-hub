export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { FLEXCUBE_SCHEMA_TABLES } from "@/modules/cbs/flexcube/data/flexcube-schema-tables";
import { FlexcubeNeedInput, FlexcubeFullPlan } from "@/modules/cbs/flexcube/types";
import { prisma } from "@/lib/prisma";

export interface FlexcubeProjectRecord {
  id: string;
  name: string;
  module: string;
  flexcubeVersion: string;
  input: FlexcubeNeedInput;
  plan: FlexcubeFullPlan;
  agentSessionName?: string;
  createdAt: string;
  updatedAt: string;
}

const DATA_FILE = path.join(process.cwd(), "data", "cbs-flexcube-projects.json");

function loadPersistedProjects(): FlexcubeProjectRecord[] {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, "utf-8");
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error("Erreur lecture cbs-flexcube-projects.json:", err);
  }
  return [];
}

function savePersistedProjects(projects: FlexcubeProjectRecord[]): void {
  try {
    const dir = path.dirname(DATA_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(projects, null, 2), "utf-8");
  } catch (err) {
    console.error("Erreur écriture cbs-flexcube-projects.json:", err);
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get("id");
    const getDictionary = searchParams.get("dictionary");

    let projects: FlexcubeProjectRecord[] = [];
    let isDbConnected = false;

    try {
      if (projectId) {
        const row = await prisma.cbsCopilotProject.findUnique({
          where: { id: projectId },
        });
        if (row && row.domain.startsWith("FCUBS_")) {
          const project: FlexcubeProjectRecord = {
            id: row.id,
            name: row.name,
            module: row.domain.replace("FCUBS_", ""),
            flexcubeVersion: row.amplitudeVersion.replace("FCUBS-", ""),
            input: row.inputData as any,
            plan: row.planData as any,
            createdAt: row.createdAt.toISOString(),
            updatedAt: row.updatedAt.toISOString(),
          };
          return NextResponse.json({ success: true, project, storage: "DATABASE_MYSQL" });
        }
      } else {
        const rows = await prisma.cbsCopilotProject.findMany({
          where: { domain: { startsWith: "FCUBS_" } },
          orderBy: { updatedAt: "desc" },
        });
        if (rows.length > 0) {
          projects = rows.map((r) => ({
            id: r.id,
            name: r.name,
            module: r.domain.replace("FCUBS_", ""),
            flexcubeVersion: r.amplitudeVersion.replace("FCUBS-", ""),
            input: r.inputData as any,
            plan: r.planData as any,
            createdAt: r.createdAt.toISOString(),
            updatedAt: r.updatedAt.toISOString(),
          }));
          isDbConnected = true;
        }
      }
    } catch (dbErr) {
      console.warn("DB MySQL fallback vers fichier local pour FLEXCUBE:", dbErr);
    }

    if (!isDbConnected) {
      const fileProjects = loadPersistedProjects();
      if (projectId) {
        const found = fileProjects.find((p) => p.id === projectId);
        if (!found) {
          return NextResponse.json({ error: "Projet FLEXCUBE introuvable" }, { status: 404 });
        }
        return NextResponse.json({ success: true, project: found, storage: "FALLBACK_FILE" });
      }
      projects = fileProjects;
    }

    const dictSummary = FLEXCUBE_SCHEMA_TABLES.map((t) => ({
      tableName: t.tableName,
      module: t.module,
      description: t.description,
      columnsCount: t.keyColumns.length,
      primaryKey: t.primaryKey,
      indexingAdvice: t.indexingAdvice,
    }));

    return NextResponse.json({
      success: true,
      storage: isDbConnected ? "DATABASE_MYSQL" : "LOCAL_FILE",
      projectsCount: projects.length,
      projects,
      tablesCount: FLEXCUBE_SCHEMA_TABLES.length,
      dictionary: getDictionary === "full" ? FLEXCUBE_SCHEMA_TABLES : dictSummary,
    });
  } catch (error: any) {
    console.error("Erreur GET /api/cbs/flexcube/copilot:", error);
    return NextResponse.json(
      { error: "Erreur serveur lors de la récupération des projets FLEXCUBE" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { project } = body;

    if (!project || !project.name) {
      return NextResponse.json(
        { error: "Données de projet FLEXCUBE invalides ou incomplètes" },
        { status: 400 }
      );
    }

    const id = project.id || "FCUBS-PROJ-" + Date.now();
    const now = new Date();

    const toSave: FlexcubeProjectRecord = {
      ...project,
      id,
      module: project.input?.module || project.module || "FT",
      flexcubeVersion: project.input?.flexcubeVersion || project.flexcubeVersion || "14.x",
      updatedAt: now.toISOString(),
      createdAt: project.createdAt || now.toISOString(),
    };

    let savedInDb = false;

    try {
      await prisma.cbsCopilotProject.upsert({
        where: { id },
        create: {
          id,
          name: toSave.name,
          domain: "FCUBS_" + toSave.module,
          amplitudeVersion: "FCUBS-" + toSave.flexcubeVersion,
          inputData: toSave.input as any,
          planData: toSave.plan as any,
          createdAt: new Date(toSave.createdAt),
          updatedAt: now,
        },
        update: {
          name: toSave.name,
          domain: "FCUBS_" + toSave.module,
          amplitudeVersion: "FCUBS-" + toSave.flexcubeVersion,
          inputData: toSave.input as any,
          planData: toSave.plan as any,
          updatedAt: now,
        },
      });
      savedInDb = true;
    } catch (dbErr) {
      console.warn("Échec écriture Prisma MySQL FLEXCUBE, sauvegarde dans le fichier local:", dbErr);
    }

    const projects = loadPersistedProjects();
    const existingIdx = projects.findIndex((p) => p.id === id);
    if (existingIdx >= 0) {
      projects[existingIdx] = toSave;
    } else {
      projects.unshift(toSave);
    }
    savePersistedProjects(projects);

    return NextResponse.json({
      success: true,
      message: "Projet Oracle FLEXCUBE sauvegardé avec succès",
      project: toSave,
      storage: savedInDb ? "DATABASE_MYSQL" : "LOCAL_FILE",
    });
  } catch (error: any) {
    console.error("Erreur POST /api/cbs/flexcube/copilot:", error);
    return NextResponse.json(
      { error: "Erreur serveur lors de la sauvegarde du projet FLEXCUBE" },
      { status: 500 }
    );
  }
}
