export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { listLogFiles, deleteLogFile, clearAllLogFiles } from "@/modules/log-analyzer/store";

export async function GET() {
  try {
    const files = listLogFiles();
    return NextResponse.json({ files });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Impossible de lister les fichiers", detail: err?.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const url = new URL(request.url);
    const fileId = url.searchParams.get("fileId");
    const clearAll = url.searchParams.get("all") === "true";

    if (clearAll) {
      clearAllLogFiles();
      return NextResponse.json({ success: true, message: "Tous les fichiers ont été supprimés.", remainingCount: 0 });
    }

    if (!fileId) {
      return NextResponse.json({ error: "Le paramètre fileId est requis." }, { status: 400 });
    }

    const deleted = deleteLogFile(fileId);
    const files = listLogFiles();

    return NextResponse.json({
      success: deleted,
      message: deleted ? "Fichier supprimé avec succès." : "Fichier non trouvé.",
      remainingCount: files.length,
      files,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Erreur lors de la suppression du fichier", detail: err?.message },
      { status: 500 }
    );
  }
}
