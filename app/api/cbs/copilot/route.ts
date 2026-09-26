import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { CBS_SCHEMA_TABLES } from "@/modules/cbs/cbs-advanced-data";
import { CopilotProject } from "@/modules/cbs/copilot/types";
import { prisma } from "@/lib/prisma";

const DATA_FILE = path.join(process.cwd(), "data", "cbs-copilot-projects.json");

// Helper pour lire les projets persistés
function loadPersistedProjects(): CopilotProject[] {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, "utf-8");
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error("Erreur lecture cbs-copilot-projects.json:", err);
  }
  return [];
}

// Helper pour sauvegarder les projets
function savePersistedProjects(projects: CopilotProject[]): void {
  try {
    const dir = path.dirname(DATA_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(projects, null, 2), "utf-8");
  } catch (err) {
    console.error("Erreur écriture cbs-copilot-projects.json:", err);
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get("id");
    const getDictionary = searchParams.get("dictionary");

    let projects: CopilotProject[] = [];
    let isDbConnected = false;

    try {
      if (projectId) {
        const row = await prisma.cbsCopilotProject.findUnique({
          where: { id: projectId },
        });
        if (row) {
          const project: CopilotProject = {
            id: row.id,
            name: row.name,
            domain: row.domain,
            amplitudeVersion: row.amplitudeVersion,
            input: row.inputData as any,
            plan: row.planData as any,
            createdAt: row.createdAt.toISOString(),
            updatedAt: row.updatedAt.toISOString(),
          };
          return NextResponse.json({ success: true, project, storage: "DATABASE_MYSQL" });
        }
      } else {
        const rows = await prisma.cbsCopilotProject.findMany({
          orderBy: { updatedAt: "desc" },
        });
        projects = rows
          .filter((r) => !r.inputData || !(r.inputData as any).isPerScreen)
          .map((r) => ({
            id: r.id,
            name: r.name,
            domain: r.domain,
            amplitudeVersion: r.amplitudeVersion,
            input: r.inputData as any,
            plan: r.planData as any,
            createdAt: r.createdAt.toISOString(),
            updatedAt: r.updatedAt.toISOString(),
          }));
        isDbConnected = true;
      }
    } catch (dbErr) {
      console.warn("DB MySQL fallback vers fichier local:", dbErr);
    }

    if (!isDbConnected) {
      const fileProjects = loadPersistedProjects();
      if (projectId) {
        const found = fileProjects.find((p) => p.id === projectId);
        if (!found) {
          return NextResponse.json({ error: "Projet introuvable" }, { status: 404 });
        }
        return NextResponse.json({ success: true, project: found, storage: "FALLBACK_FILE" });
      }
      projects = fileProjects;
    }

    const dictSummary = CBS_SCHEMA_TABLES.map((t) => ({
      tableName: t.tableName,
      module: t.module,
      description: t.description,
      columnsCount: t.columns.length,
      primaryKey: t.primaryKey,
      sampleQuery: t.sampleQuery,
    }));

    return NextResponse.json({
      success: true,
      storage: "PERSISTENT_STORE",
      projectsCount: projects.length,
      projects,
      tablesCount: CBS_SCHEMA_TABLES.length,
      dictionary: getDictionary === "full" ? CBS_SCHEMA_TABLES : dictSummary,
    });
  } catch (error: any) {
    console.error("Erreur GET /api/cbs/copilot:", error);
    return NextResponse.json(
      { error: "Erreur serveur lors de la récupération des projets Copilot" },
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
        { error: "Données de projet invalides ou incomplètes" },
        { status: 400 }
      );
    }

    const id = project.id || "PROJ-" + Date.now();
    const now = new Date();

    const toSave: CopilotProject = {
      ...project,
      id,
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
          domain: toSave.domain || "Général",
          amplitudeVersion: toSave.amplitudeVersion || "v11.x",
          inputData: toSave.input as any,
          planData: toSave.plan as any,
          createdAt: new Date(toSave.createdAt),
          updatedAt: now,
        },
        update: {
          name: toSave.name,
          domain: toSave.domain || "Général",
          amplitudeVersion: toSave.amplitudeVersion || "v11.x",
          inputData: toSave.input as any,
          planData: toSave.plan as any,
          updatedAt: now,
        },
      });
      savedInDb = true;
    } catch (dbErr) {
      console.warn("Échec écriture Prisma MySQL, sauvegarde dans le fichier de secours:", dbErr);
    }

    // Réplication de sécurité dans le fichier local
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
      message: savedInDb
        ? "Projet enregistré avec succès dans la base de données MySQL (table CbsCopilotProject)"
        : "Projet sauvegardé dans le référentiel de secours",
      storage: savedInDb ? "DATABASE_MYSQL" : "FILE_FALLBACK",
      project: toSave,
      totalProjects: projects.length,
    });
  } catch (error: any) {
    console.error("Erreur POST /api/cbs/copilot:", error);
    return NextResponse.json(
      { error: "Échec de l'enregistrement du projet Copilot dans la base de données" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Identifiant id requis" }, { status: 400 });
    }

    let deletedFromDb = false;

    try {
      await prisma.cbsCopilotProject.delete({
        where: { id },
      });
      deletedFromDb = true;
    } catch (dbErr) {
      console.warn("Erreur suppression Prisma MySQL:", dbErr);
    }

    const projects = loadPersistedProjects();
    const filtered = projects.filter((p) => p.id !== id);
    savePersistedProjects(filtered);

    return NextResponse.json({
      success: true,
      message: "Projet supprimé de la base de données",
      storage: deletedFromDb ? "DATABASE_MYSQL" : "FILE_FALLBACK",
      remainingCount: filtered.length,
    });
  } catch (error: any) {
    console.error("Erreur DELETE /api/cbs/copilot:", error);
    return NextResponse.json(
      { error: "Erreur lors de la suppression du projet" },
      { status: 500 }
    );
  }
}
