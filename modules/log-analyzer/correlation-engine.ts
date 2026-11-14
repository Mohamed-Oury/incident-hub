import {
  LogEvent,
  TransactionCandidate,
  TransactionEventAssociation,
  RequestResponseComparison,
  FieldComparison,
  CorrelationLevel,
} from "./types";
import { DE_CATALOG } from "../knowledge-base/data/iso-de-reference";

/**
 * Compare une paire requête / réponse ISO 8583.
 */
export function compareRequestResponse(
  requestEvent?: LogEvent,
  responseEvent?: LogEvent
): RequestResponseComparison | undefined {
  if (!requestEvent && !responseEvent) return undefined;

  const reqFields = requestEvent?.isoFields || {};
  const respFields = responseEvent?.isoFields || {};
  const allFieldKeys = Array.from(
    new Set([...Object.keys(reqFields), ...Object.keys(respFields)])
  ).sort((a, b) => parseInt(a, 10) - parseInt(b, 10));

  const comparisons: FieldComparison[] = [];
  const notes: string[] = [];
  let hasDiscrepancy = false;

  for (const fieldId of allFieldKeys) {
    const reqVal = reqFields[fieldId];
    const respVal = respFields[fieldId];
    const deDef = DE_CATALOG.find((d) => d.de === parseInt(fieldId, 10));
    const name = deDef ? deDef.name : `Data Element ${fieldId}`;

    if (reqVal !== undefined && respVal !== undefined) {
      if (reqVal === respVal) {
        comparisons.push({
          fieldId,
          name,
          requestValue: reqVal,
          responseValue: respVal,
          status: "IDENTICAL",
        });
      } else {
        hasDiscrepancy = true;
        comparisons.push({
          fieldId,
          name,
          requestValue: reqVal,
          responseValue: respVal,
          status: "MODIFIED",
        });
        if (fieldId === "4" || fieldId === "49" || fieldId === "11") {
          notes.push(`Divergence critique sur DE${fieldId} (${name}): ${reqVal} -> ${respVal}`);
        }
      }
    } else if (reqVal !== undefined && respVal === undefined) {
      comparisons.push({
        fieldId,
        name,
        requestValue: reqVal,
        status: "MISSING_IN_RESPONSE",
      });
    } else if (reqVal === undefined && respVal !== undefined) {
      comparisons.push({
        fieldId,
        name,
        responseValue: respVal,
        status: "NEW_IN_RESPONSE",
      });
    }
  }

  // Vérification de compatibilité MTI (ex: 0200 -> 0210, 1100 -> 1110, 0400 -> 0410)
  const reqMti = requestEvent?.mti;
  const respMti = responseEvent?.mti;
  if (reqMti && respMti) {
    const expectedRespMti = reqMti.slice(0, 2) + "1" + reqMti.slice(3);
    if (respMti !== expectedRespMti && !respMti.endsWith("10")) {
      notes.push(`MTI réponse ${respMti} atypique pour la requête ${reqMti}`);
      hasDiscrepancy = true;
    }
  }

  return {
    requestEventId: requestEvent?.eventId,
    responseEventId: responseEvent?.eventId,
    requestMti: reqMti,
    responseMti: respMti,
    fields: comparisons,
    hasDiscrepancy,
    notes,
  };
}

/**
 * Moteur de Corrélation Transactionnelle par RRN.
 * Reconstitue les parcours à partir de l'ensemble des événements d'un fichier.
 */
export function correlateTransactionsByRrn(
  targetRrn: string,
  allEvents: LogEvent[],
  fileId: string
): TransactionCandidate[] {
  const cleanTargetRrn = targetRrn.trim();
  if (!cleanTargetRrn) return [];

  // 1. Recherche des événements directs contenant exactement le RRN (DE37 ou HexDump)
  const directEvents = allEvents.filter((evt) => {
    const de37 = evt.isoFields["37"];
    const hexRrn = evt.hexDump?.detectedRrn;
    return de37 === cleanTargetRrn || hexRrn === cleanTargetRrn;
  });

  if (directEvents.length === 0) {
    return [];
  }

  // 2. Regroupement par clusters transactionnels temporels (au cas où le même RRN apparaît sur plusieurs jours ou contextes)
  // Une transaction monétique standard dure généralement moins de 120 secondes.
  const clusters: LogEvent[][] = [];
  const sortedDirect = [...directEvents].sort(
    (a, b) => (a.epochMs || 0) - (b.epochMs || 0)
  );

  let currentCluster: LogEvent[] = [sortedDirect[0]];
  for (let i = 1; i < sortedDirect.length; i++) {
    const prevEvt = currentCluster[currentCluster.length - 1];
    const currEvt = sortedDirect[i];
    const diffMs = (currEvt.epochMs || 0) - (prevEvt.epochMs || 0);

    // Si plus de 3 minutes d'écart, c'est une transaction candidate distincte
    if (diffMs > 180000) {
      clusters.push(currentCluster);
      currentCluster = [currEvt];
    } else {
      currentCluster.push(currEvt);
    }
  }
  clusters.push(currentCluster);

  const candidates: TransactionCandidate[] = [];

  for (let cIdx = 0; cIdx < clusters.length; cIdx++) {
    const clusterDirectEvents = clusters[cIdx];
    const startEpoch = Math.min(...clusterDirectEvents.map((e) => e.epochMs || 0)) - 500;
    const endEpoch = Math.max(...clusterDirectEvents.map((e) => e.epochMs || 0)) + 1500;

    // Détermination des identifiants pivots de la transaction
    const primaryStan = clusterDirectEvents.find((e) => e.isoFields["11"])?.isoFields["11"];
    const primaryTid = clusterDirectEvents.find((e) => e.isoFields["41"])?.isoFields["41"];
    const primaryAmount = clusterDirectEvents.find((e) => e.isoFields["4"])?.isoFields["4"];
    const primaryCurrency = clusterDirectEvents.find((e) => e.isoFields["49"])?.isoFields["49"];
    const primaryAcceptor = clusterDirectEvents.find((e) => e.isoFields["43"])?.isoFields["43"];

    // 3. Recherche des événements intermédiaires (corrélation secondaire prudente)
    // On examine tous les événements survenus dans la fenêtre [startEpoch, endEpoch]
    const windowEvents = allEvents.filter((evt) => {
      const ep = evt.epochMs || 0;
      return ep >= startEpoch && ep <= endEpoch;
    });

    const associatedEvents: TransactionEventAssociation[] = [];

    for (const evt of windowEvents) {
      const isDirect = clusterDirectEvents.some((de) => de.eventId === evt.eventId);

      if (isDirect) {
        associatedEvents.push({
          event: evt,
          associationType: "DIRECT_RRN",
          confidenceScore: 1.0,
          reason: `Correspondance exacte DE37 (RRN=${cleanTargetRrn})`,
          delayFromPreviousMs: 0,
        });
      } else {
        // Test d'association forte : même STAN (DE11) et même TID (DE41)
        const evtStan = evt.isoFields["11"];
        const evtTid = evt.isoFields["41"];

        if (
          primaryStan &&
          evtStan &&
          evtStan === primaryStan &&
          (!primaryTid || !evtTid || evtTid === primaryTid)
        ) {
          associatedEvents.push({
            event: evt,
            associationType: "STRONG_STAN_TID",
            confidenceScore: 0.95,
            reason: `STAN identique (DE11=${primaryStan}) et terminal compatible`,
            delayFromPreviousMs: 0,
          });
        } else if (
          evt.eventType.includes("Response Code") &&
          evt.responseCodeConversion
        ) {
          // Événement de conversion de code réponse survenant au cours de la transaction
          associatedEvents.push({
            event: evt,
            associationType: "PROBABLE",
            confidenceScore: 0.88,
            reason: `Conversion de code réponse associée dans la fenêtre temporelle de la transaction (${evt.responseCodeConversion.receivedCode} -> ${evt.responseCodeConversion.sendCode})`,
            delayFromPreviousMs: 0,
          });
        } else if (
          evt.eventType.includes("longueur Message") ||
          evt.eventType.includes("sendMessage")
        ) {
          // Détection de trames de transport externe corrélées
          if (evt.hexDump?.asciiText?.includes(cleanTargetRrn)) {
            associatedEvents.push({
              event: evt,
              associationType: "DIRECT_RRN",
              confidenceScore: 0.98,
              reason: `RRN retrouvé dans le payload hexadécimal de transport`,
              delayFromPreviousMs: 0,
            });
          }
        }
      }
    }

    // 4. Tri chronologique et calcul des délais intermédiaires
    associatedEvents.sort(
      (a, b) => (a.event.epochMs || 0) - (b.event.epochMs || 0)
    );

    for (let i = 0; i < associatedEvents.length; i++) {
      if (i === 0) {
        associatedEvents[i].delayFromPreviousMs = 0;
      } else {
        const prevMs = associatedEvents[i - 1].event.epochMs || 0;
        const curMs = associatedEvents[i].event.epochMs || 0;
        associatedEvents[i].delayFromPreviousMs = Math.max(0, curMs - prevMs);
      }
    }

    // 5. Comparaison Requête / Réponse
    const reqEvent = associatedEvents.find(
      (a) => a.event.direction === "incoming" || a.event.mti?.endsWith("00")
    )?.event;
    const respEvent = associatedEvents.find(
      (a) => a.event.direction === "outgoing" || a.event.mti?.endsWith("10")
    )?.event;
    const comparison = compareRequestResponse(reqEvent, respEvent);

    const firstTime = associatedEvents[0]?.event.timestampIso;
    const lastTime = associatedEvents[associatedEvents.length - 1]?.event.timestampIso;
    const durationMs =
      (associatedEvents[associatedEvents.length - 1]?.event.epochMs || 0) -
      (associatedEvents[0]?.event.epochMs || 0);

    const initialMti =
      clusterDirectEvents.find((e) => e.mti)?.mti || associatedEvents[0]?.event.mti;
    const finalMti =
      [...associatedEvents].reverse().find((e) => e.event.mti)?.event.mti;

    candidates.push({
      id: `TX_${fileId}_${cleanTargetRrn}_${cIdx + 1}`,
      fileId,
      rrn: cleanTargetRrn,
      stan: primaryStan,
      terminalId: primaryTid,
      mtiInitial: initialMti,
      mtiFinal: finalMti,
      amount: primaryAmount,
      currency: primaryCurrency,
      cardAcceptor: primaryAcceptor,
      firstTimestamp: firstTime,
      lastTimestamp: lastTime,
      durationMs: Math.max(0, durationMs),
      eventsCount: associatedEvents.length,
      correlationStatus: clusters.length > 1 ? "AMBIGUOUS" : "CONFIRMED",
      correlationScore:
        associatedEvents.reduce((acc, curr) => acc + curr.confidenceScore, 0) /
        associatedEvents.length,
      events: associatedEvents,
      anomalies: [], // Rempli par le module d'anomalies
      comparison,
    });
  }

  return candidates;
}

