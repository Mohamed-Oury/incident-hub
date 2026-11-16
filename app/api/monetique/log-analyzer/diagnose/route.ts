export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getTransactionCandidateById } from "@/modules/log-analyzer/store";
import { generateIntelligentDiagnostic } from "@/modules/log-analyzer/diagnostic-engine";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    if (!body || !body.transactionId) {
      return NextResponse.json(
        { error: "Le paramètre 'transactionId' est obligatoire." },
        { status: 400 }
      );
    }

    const tx = getTransactionCandidateById(body.transactionId);
    if (!tx) {
      return NextResponse.json(
        { error: `Transaction ${body.transactionId} introuvable en mémoire.` },
        { status: 404 }
      );
    }

    // Tenter d'appeler l'agent FastAPI Docker sur le port 8080 ou 8000 si disponible
    const agentCandidateUrls = [
      process.env.AGENTIC_API_URL?.trim() || "http://localhost:8080",
      "http://127.0.0.1:8080",
      "http://localhost:8000",
      "http://127.0.0.1:8000",
    ];

    const payload = {
      fileId: tx.fileId,
      transactionId: tx.id,
      rrn: tx.rrn,
      stan: tx.stan,
      terminalId: tx.terminalId,
      mtiInitial: tx.mtiInitial,
      mtiFinal: tx.mtiFinal,
      amount: tx.amount,
      currency: tx.currency,
      durationMs: tx.durationMs,
      events: tx.events.map((e) => ({
        eventId: e.event.eventId,
        time: e.event.timestampIso || e.event.timestampRaw,
        realm: e.event.realm,
        eventType: e.event.eventType,
        direction: e.event.direction || "unknown",
        mti: e.event.mti,
        delayMs: e.delayFromPreviousMs,
        associationType: e.associationType,
      })),
      anomalies: tx.anomalies.map((a) => ({
        ruleId: a.ruleId,
        category: a.category,
        severity: a.severity,
        title: a.title,
        description: a.description,
      })),
      responseCodeConversion: tx.events.find((e) => e.event.responseCodeConversion)
        ? `${tx.events.find((e) => e.event.responseCodeConversion)!.event.responseCodeConversion!.receivedCode} -> ${tx.events.find((e) => e.event.responseCodeConversion)!.event.responseCodeConversion!.sendCode}`
        : null,
      rawLogExtract: tx.events
        .slice(0, 5)
        .map((e) => e.event.rawContent)
        .join("\n---\n"),
    };

    // Tentative d'appel vers l'agent FastAPI avec timeout strict (800ms) pour éviter les blocages
    for (const baseUrl of agentCandidateUrls) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 800);

        const agentRes = await fetch(`${baseUrl}/api/v1/log-analyzer/diagnose`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
          cache: "no-store",
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (agentRes.ok) {
          const agentData = await agentRes.json();
          return NextResponse.json({
            success: true,
            provider: "AGENTIC_FASTAPI_LLM",
            diagnostic: agentData,
          });
        }
      } catch (_) {
        // En cas d'indisponibilité du conteneur, tester le suivant ou basculer sur le moteur local
        continue;
      }
    }

    // Diagnostic déterministe certifié et contextualisé
    const intelligentDiag = generateIntelligentDiagnostic(tx);
    return NextResponse.json({
      success: true,
      provider: "LOCAL_INTELLIGENT_DETERMINISTIC_ENGINE",
      diagnostic: intelligentDiag,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Erreur lors du diagnostic IA", detail: err?.message },
      { status: 500 }
    );
  }
}

