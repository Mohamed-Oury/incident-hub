import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { prisma } from "@/lib/prisma";
import { CustomPerScreen, generateCustomPerScreen } from "@/modules/cbs/cbs-screen-builder";

const DATA_DIR = path.join(process.cwd(), ".data");
const SCREENS_FILE = path.join(DATA_DIR, "cbs_custom_screens.json");

function readLocalScreens(): CustomPerScreen[] {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(SCREENS_FILE)) {
      return [];
    }
    const raw = fs.readFileSync(SCREENS_FILE, "utf-8");
    return JSON.parse(raw);
  } catch (err) {
    console.error("Erreur lecture cbs_custom_screens.json:", err);
    return [];
  }
}

function writeLocalScreens(screens: CustomPerScreen[]): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(SCREENS_FILE, JSON.stringify(screens, null, 2), "utf-8");
  } catch (err) {
    console.error("Erreur ecriture cbs_custom_screens.json:", err);
  }
}

// GET : Récupérer tous les écrans sauvegardés (ou un écran spécifique par id)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const screenId = searchParams.get("id");

    let screens: CustomPerScreen[] = [];
    let isDbConnected = false;

    try {
      if (screenId) {
        const row = await prisma.cbsCopilotProject.findUnique({
          where: { id: screenId },
        });
        if (row && row.inputData && (row.inputData as any).isPerScreen) {
          const screen: CustomPerScreen = row.planData as any;
          return NextResponse.json({ success: true, screen, storage: "DATABASE_MYSQL" });
        }
      } else {
        const rows = await prisma.cbsCopilotProject.findMany({
          orderBy: { updatedAt: "desc" },
        });
        screens = rows
          .filter((r) => r.inputData && (r.inputData as any).isPerScreen)
          .map((r) => r.planData as any);
        isDbConnected = true;
      }
    } catch (dbErr) {
      console.warn("Prisma MySQL fallback vers fichier local pour .per:", dbErr);
    }

    if (!isDbConnected) {
      const local = readLocalScreens();
      if (screenId) {
        const found = local.find((s) => s.id === screenId);
        if (!found) {
          return NextResponse.json({ error: "Écran introuvable" }, { status: 404 });
        }
        return NextResponse.json({ success: true, screen: found, storage: "LOCAL_STORE" });
      }
      screens = local;
    }

    return NextResponse.json({
      success: true,
      screensCount: screens.length,
      screens,
      storage: isDbConnected ? "DATABASE_MYSQL" : "LOCAL_STORE",
    });
  } catch (error: any) {
    console.error("Erreur GET /api/cbs/screens:", error);
    return NextResponse.json({ error: "Erreur récupération des écrans" }, { status: 500 });
  }
}

// POST : Générer ou sauvegarder un écran .per
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, description, title, domain, screenLayoutType, syntaxMode, schemaHeaderType, screen } = body;

    // 1. Action : Génération automatique à partir de la description
    if (action === "GENERATE") {
      if (!description) {
        return NextResponse.json({ error: "Veuillez fournir une description de l'écran." }, { status: 400 });
      }
      const generated = generateCustomPerScreen({
        title: title || "Écran Métier Personnalisé",
        description,
        domain: domain || "Comptes & Guichet",
        screenLayoutType,
        syntaxMode,
        schemaHeaderType,
      });
      return NextResponse.json({ success: true, screen: generated });
    }

    // 2. Action : Sauvegarde d'un écran en base / persistance
    const toSave: CustomPerScreen = screen;
    if (!toSave || !toSave.name || !toSave.perSourceCode) {
      return NextResponse.json({ error: "Données d'écran incomplètes pour la sauvegarde." }, { status: 400 });
    }

    const now = new Date().toISOString();
    toSave.updatedAt = now;
    if (!toSave.createdAt) toSave.createdAt = now;
    if (!toSave.id) toSave.id = "SCR_" + Date.now();

    let savedInDb = false;
    try {
      await prisma.cbsCopilotProject.upsert({
        where: { id: toSave.id },
        update: {
          name: toSave.title,
          domain: toSave.domain || "IHM_PER",
          amplitudeVersion: "v11.x",
          inputData: { isPerScreen: true, description: toSave.description },
          planData: toSave as any,
          updatedAt: new Date(),
        },
        create: {
          id: toSave.id,
          name: toSave.title,
          domain: toSave.domain || "IHM_PER",
          amplitudeVersion: "v11.x",
          inputData: { isPerScreen: true, description: toSave.description },
          planData: toSave as any,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });
      savedInDb = true;
    } catch (dbErr) {
      console.warn("DB MySQL non disponible pour l'écran, enregistrement dans le fichier de persistance local:", dbErr);
    }

    // Toujours mettre à jour le fichier local de sécurité
    const local = readLocalScreens();
    const existingIndex = local.findIndex((s) => s.id === toSave.id);
    if (existingIndex >= 0) {
      local[existingIndex] = toSave;
    } else {
      local.unshift(toSave);
    }
    writeLocalScreens(local);

    return NextResponse.json({
      success: true,
      screen: toSave,
      storage: savedInDb ? "DATABASE_MYSQL" : "LOCAL_STORE",
      message: savedInDb ? "Écran .per enregistré avec succès dans la base de données MySQL !" : "Écran .per enregistré dans le stockage persistant sécurisé !"
    });
  } catch (error: any) {
    console.error("Erreur POST /api/cbs/screens:", error);
    return NextResponse.json({ error: "Erreur lors de la sauvegarde de l'écran" }, { status: 500 });
  }
}

// DELETE : Supprimer un écran de l'historique
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const screenId = searchParams.get("id");
    if (!screenId) {
      return NextResponse.json({ error: "ID requis pour suppression" }, { status: 400 });
    }

    try {
      await prisma.cbsCopilotProject.delete({
        where: { id: screenId },
      });
    } catch (_) {}

    const local = readLocalScreens().filter((s) => s.id !== screenId);
    writeLocalScreens(local);

    return NextResponse.json({ success: true, deletedId: screenId });
  } catch (error: any) {
    console.error("Erreur DELETE /api/cbs/screens:", error);
    return NextResponse.json({ error: "Erreur lors de la suppression" }, { status: 500 });
  }
}
