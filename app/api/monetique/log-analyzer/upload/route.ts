export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { indexLogFile } from "@/modules/log-analyzer/store";

export async function POST(request: Request) {
  try {
    const contentType = (request.headers.get("content-type") || "").toLowerCase();
    const headerFilename = request.headers.get("x-filename");

    let filename = headerFilename ? decodeURIComponent(headerFilename) : "";
    let content = "";

    // 1. Envoi direct en texte brut ou flux binaire (sans limite restrictive)
    if (contentType.includes("text/plain") || contentType.includes("application/octet-stream")) {
      content = await request.text();
      if (!filename) filename = `trace_${Date.now()}.log`;
    }
    // 2. Envoi JSON
    else if (contentType.includes("application/json")) {
      const body = await request.json().catch(() => null);
      if (body && body.content) {
        content = body.content;
        filename = body.filename || `trace_${Date.now()}.log`;
      }
    }
    // 3. Envoi FormData
    else if (contentType.includes("multipart/form-data")) {
      try {
        const formData = await request.formData();
        const file = formData.get("file") as File | null;
        if (file) {
          filename = file.name;
          content = await file.text();
        }
      } catch (formErr: any) {
        content = await request.text().catch(() => "");
        filename = filename || `upload_${Date.now()}.log`;
      }
    } else {
      content = await request.text().catch(() => "");
      filename = filename || `trace_${Date.now()}.log`;
    }

    if (!content || content.trim().length === 0) {
      return NextResponse.json(
        { error: "Le fichier transmis est vide ou n'a pas pu être lu." },
        { status: 400 }
      );
    }

    const metadata = indexLogFile(filename, content);

    return NextResponse.json({
      success: true,
      message: `Fichier ${filename} indexé avec succès (${metadata.parsedEventCount} événements, ${metadata.distinctRrnCount} RRNs).`,
      file: metadata,
    });
  } catch (err: any) {
    console.error("Erreur dans /api/monetique/log-analyzer/upload :", err);
    return NextResponse.json(
      {
        error: "Erreur serveur lors de l'indexation du fichier",
        detail: err?.message || String(err),
      },
      { status: 500 }
    );
  }
}
