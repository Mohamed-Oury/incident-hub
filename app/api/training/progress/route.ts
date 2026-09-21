import { NextResponse } from "next/server";
import { getSession } from "@/modules/auth/auth-service";
import fs from "fs";
import path from "path";

// Répertoire de stockage persistant sur disque (sécurisé, ne dépend pas d'un serveur DB externe)
const STORAGE_DIR = path.join(process.cwd(), ".data");
const PROGRESS_FILE = path.join(STORAGE_DIR, "training_progress.json");

interface UserTrainingProgress {
  cbsLevel: number;
  monetiqueLevel: number;
  cbsScores?: Record<number, { score: number; total: number; pct: number; passed: boolean }>;
  monetiqueScores?: Record<number, { score: number; total: number; pct: number; passed: boolean }>;
  updatedAt: string;
}

function readAllProgress(): Record<string, UserTrainingProgress> {
  try {
    if (!fs.existsSync(STORAGE_DIR)) {
      fs.mkdirSync(STORAGE_DIR, { recursive: true });
    }
    if (!fs.existsSync(PROGRESS_FILE)) {
      return {};
    }
    const data = fs.readFileSync(PROGRESS_FILE, "utf-8");
    return JSON.parse(data);
  } catch (err) {
    console.error("Erreur lecture fichier training_progress:", err);
    return {};
  }
}

function saveAllProgress(data: Record<string, UserTrainingProgress>) {
  try {
    if (!fs.existsSync(STORAGE_DIR)) {
      fs.mkdirSync(STORAGE_DIR, { recursive: true });
    }
    fs.writeFileSync(PROGRESS_FILE, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.error("Erreur écriture fichier training_progress:", err);
  }
}

// GET : Récupérer la progression de l'utilisateur courant
export async function GET() {
  const user = await getSession();
  const userId = user?.id || "default_user";

  const all = readAllProgress();
  const userProgress: UserTrainingProgress = all[userId] || {
    cbsLevel: 1,
    monetiqueLevel: 1,
    cbsScores: {},
    monetiqueScores: {},
    updatedAt: new Date().toISOString(),
  };

  return NextResponse.json({
    success: true,
    userId,
    progress: userProgress,
  });
}

// POST : Sauvegarder la progression
export async function POST(request: Request) {
  try {
    const user = await getSession();
    const userId = user?.id || "default_user";

    const body = await request.json();
    const { type, level, scoreData } = body;

    const all = readAllProgress();
    const current: UserTrainingProgress = all[userId] || {
      cbsLevel: 1,
      monetiqueLevel: 1,
      cbsScores: {},
      monetiqueScores: {},
      updatedAt: new Date().toISOString(),
    };

    if (type === "CBS") {
      if (typeof level === "number" && level >= current.cbsLevel) {
        current.cbsLevel = Math.min(5, Math.max(1, level));
      }
      if (scoreData && typeof scoreData.gradeLevel === "number") {
        if (!current.cbsScores) current.cbsScores = {};
        current.cbsScores[scoreData.gradeLevel] = scoreData;
      }
    } else if (type === "MONETIQUE") {
      if (typeof level === "number" && level >= current.monetiqueLevel) {
        current.monetiqueLevel = Math.min(5, Math.max(1, level));
      }
      if (scoreData && typeof scoreData.gradeLevel === "number") {
        if (!current.monetiqueScores) current.monetiqueScores = {};
        current.monetiqueScores[scoreData.gradeLevel] = scoreData;
      }
    }

    current.updatedAt = new Date().toISOString();
    all[userId] = current;
    saveAllProgress(all);

    return NextResponse.json({
      success: true,
      message: "Progression sauvegardée avec succès.",
      progress: current,
    });
  } catch (err: any) {
    console.error("Erreur sauvegarde progression:", err);
    return NextResponse.json({ error: "Erreur serveur: " + err.message }, { status: 500 });
  }
}
