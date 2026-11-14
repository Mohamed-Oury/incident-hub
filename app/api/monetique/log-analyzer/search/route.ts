export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import {
  searchTransactionsByRrn,
  getLogFile,
  listLogFiles,
} from "@/modules/log-analyzer/store";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    if (!body || !body.rrn) {
      return NextResponse.json(
        { error: "Le paramètre 'rrn' est obligatoire." },
        { status: 400 }
      );
    }

    const cleanRrn = String(body.rrn).trim();
    let fileId = body.fileId;

    const allFiles = listLogFiles();

    if (allFiles.length === 0) {
      return NextResponse.json(
        { error: "Aucun fichier de log indexé. Veuillez d'abord importer un fichier de traces." },
        { status: 404 }
      );
    }

    if (!fileId) {
      fileId = allFiles[0].id;
    }

    let activeFile = getLogFile(fileId) || allFiles[0];
    let candidates = searchTransactionsByRrn(activeFile.id, cleanRrn);
    let switchedFile = false;

    // Recherche multi-fichiers si non trouvé dans le fichier sélectionné
    if (candidates.length === 0) {
      for (const otherFile of allFiles) {
        if (otherFile.id !== activeFile.id) {
          const otherCandidates = searchTransactionsByRrn(otherFile.id, cleanRrn);
          if (otherCandidates.length > 0) {
            candidates = otherCandidates;
            activeFile = otherFile;
            switchedFile = true;
            break;
          }
        }
      }
    }

    return NextResponse.json({
      success: true,
      file: activeFile,
      switchedFile,
      rrn: cleanRrn,
      candidatesCount: candidates.length,
      candidates,
    });
  } catch (err: any) {
    console.error("Erreur dans /api/monetique/log-analyzer/search :", err);
    return NextResponse.json(
      { error: "Erreur lors de la recherche RRN", detail: err?.message },
      { status: 500 }
    );
  }
}
