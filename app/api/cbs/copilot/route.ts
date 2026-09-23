import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { CBS_SCHEMA_TABLES } from "@/modules/cbs/cbs-advanced-data";
import { CopilotProject } from "@/modules/cbs/copilot/types";

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

    const projects = loadPersistedProjects();

    if (projectId) {
      const found = projects.find((p) => p.id === projectId);
      if (!found) {
        return NextResponse.json({ error: "Projet introuvable" }, { status: 404 });
      }
      return NextResponse.json({ success: true, project: found });
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

    const projects = loadPersistedProjects();
    const id = project.id || "PROJ-" + Date.now();
    const now = new Date().toISOString();

    const existingIdx = projects.findIndex((p) => p.id === id);
    const toSave: CopilotProject = {
      ...project,
      id,
      updatedAt: now,
      createdAt: existingIdx >= 0 ? projects[existingIdx].createdAt : now,
    };

    if (existingIdx >= 0) {
      projects[existingIdx] = toSave;
    } else {
      projects.unshift(toSave);
    }

    savePersistedProjects(projects);

    return NextResponse.json({
      success: true,
      message: "Projet sauvegardé avec succès dans le référentiel CBS",
      project: toSave,
      totalProjects: projects.length,
    });
  } catch (error: any) {
    console.error("Erreur POST /api/cbs/copilot:", error);
    return NextResponse.json(
      { error: "Échec de l'enregistrement du projet Copilot" },
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

    const projects = loadPersistedProjects();
    const filtered = projects.filter((p) => p.id !== id);

    if (filtered.length === projects.length) {
      return NextResponse.json({ error: "Projet introuvable" }, { status: 404 });
    }

    savePersistedProjects(filtered);

    return NextResponse.json({
      success: true,
      message: "Projet supprimé avec succès",
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
