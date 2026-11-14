export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getTransactionCandidateById } from "@/modules/log-analyzer/store";
import { AiDiagnosticReport, TransactionCandidate } from "@/modules/log-analyzer/types";

function buildFallbackDiagnostic(tx: TransactionCandidate): AiDiagnosticReport {
  const facts = [
    `Transaction RRN=${tx.rrn} identifiée avec ${tx.events.length} événements corrélés (durée totale : ${tx.durationMs} ms).`,
    ...(tx.stan ? [`STAN DE11 = ${tx.stan}`] : []),
    ...(tx.terminalId ? [`Terminal DE41 = ${tx.terminalId}`] : []),
    ...(tx.amount ? [`Montant = ${tx.amount} ${tx.currency || ""}`] : []),
  ];

  const hasConversion = tx.anomalies.some((a) => a.ruleId.includes("CODE_TRANSFORMATION"));
  const hasTimeout = tx.anomalies.some((a) => a.category === "COMMUNICATION");
  const hasDrop = tx.anomalies.some((a) => a.category === "PROCESSING");

  let probableRootCause = "Fonctionnement régulier de la passerelle.";
  let symptom = "Parcours conforme sans incident bloquant.";

  if (hasConversion) {
    symptom = "Conversion du code réponse par le switch avant renvoi au canal appelant.";
    probableRootCause =
      "Normalisation standard opérée par le switch : le Host a renvoyé un code interne (ex: 151) transcodé en 51 (Solde insuffisant) avant restitution.";
  } else if (hasTimeout) {
    symptom = "Absence de réponse du Host ou temps de traitement excessif.";
    probableRootCause = "Timeout réseau ou saturation de la file d'attente sur le canal externe Host.";
  } else if (hasDrop) {
    symptom = "Rupture de flux interne après réponse du Host.";
    probableRootCause = "Déconnexion prématurée du client ou rupture de contexte de session dans le worker interne.";
  }

  return {
    transactionId: tx.id,
    summary: `Investigation de la transaction RRN ${tx.rrn} (${tx.events.length} jalons). ${probableRootCause}`,
    observedSymptom: symptom,
    architectureFlow: tx.events.map((e) => `${e.event.eventType} (${e.event.realm})`),
    facts,
    hypotheses: [
      {
        id: "H1",
        title: hasConversion ? "Transcodage normalisé conforme" : (hasTimeout ? "Timeout lien externe" : "Flux standard"),
        confidence: "TRÈS ÉLEVÉE",
        supportingEvidence: tx.anomalies.map((a) => a.title),
        potentialCauses: [
          hasConversion ? "Mapping officiel du switch bancaire" : "Indisponibilité temporaire ou congestion",
        ],
      },
    ],
    probableRootCause,
    rootCauseConfidence: "ÉLEVÉE",
    missingInformation: [
      ...(!tx.terminalId ? ["DE41 (TID) absent de certains messages intermédiaires"] : []),
    ],
    recommendedVerifications: [
      "Vérifier la concordance avec les écritures comptables du CBS (Amplitude / Flexcube).",
      "Vérifier si une annulation (Reversal 0420) a été enregistrée en cas de réclamation porteur.",
    ],
    correctiveActions: [
      hasConversion
        ? "Aucune action requise (refus métier légitime)."
        : "Vérifier l'état des liaisons télécoms et le keep-alive du canal.",
    ],
    preventiveActions: [
      "Documenter la table des correspondances de codes réponse dans la base de connaissances du Hub.",
    ],
    sourceEventReferences: tx.events.map((e) => `[${e.event.eventId}] ${e.event.eventType}`),
    generatedAt: new Date().toISOString(),
    validationStatus: "PENDING",
  };
}

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

    // Tenter d'appeler l'agent FastAPI Docker sur le port 8080 ou 8000
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

    for (const baseUrl of agentCandidateUrls) {
      try {
        const agentRes = await fetch(`${baseUrl}/api/v1/log-analyzer/diagnose`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
          cache: "no-store",
        });

        if (agentRes.ok) {
          const agentData = await agentRes.json();
          return NextResponse.json({
            success: true,
            provider: "AGENTIC_FASTAPI_LLM",
            diagnostic: agentData,
          });
        }
      } catch (_) {
        // En cas d'indisponibilité du conteneur, tester le suivant ou basculer sur le fallback
        continue;
      }
    }

    // Fallback certifié déterministe
    const fallbackDiag = buildFallbackDiagnostic(tx);
    return NextResponse.json({
      success: true,
      provider: "LOCAL_DETERMINISTIC_ENGINE",
      diagnostic: fallbackDiag,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Erreur lors du diagnostic IA", detail: err?.message },
      { status: 500 }
    );
  }
}

