import { TransactionCandidate, AnomalyItem } from "./types";

/**
 * Moteur Déterministe de Détection des Anomalies et Incidents Monétiques.
 * Conforme à la Section 12 du Cahier des charges.
 */
export function detectTransactionAnomalies(
  tx: TransactionCandidate
): AnomalyItem[] {
  const anomalies: AnomalyItem[] = [];
  const events = tx.events.map((e) => e.event);

  // 1. Détection de Timeout / Durée anormalement élevée (> 5000 ms)
  if (tx.durationMs > 5000) {
    anomalies.push({
      id: `ANOM_TIME_${tx.id}`,
      ruleId: "RULE_COMM_01_HIGH_LATENCY",
      category: "COMMUNICATION",
      severity: tx.durationMs > 15000 ? "CRITICAL" : "HIGH",
      title: "Temps de traitement anormalement élevé",
      description: `La transaction a duré ${tx.durationMs} ms (seuil nominal : < 2000 ms). Risque élevé de time-out ressenti par le porteur ou le GAB/TPE.`,
      evidenceEventIds: events.map((e) => e.eventId),
      recommendation:
        "Vérifier les délais réseau vers le Host émetteur et la charge des passerelles de commutation.",
    });
  }

  // 2. Détection de la conversion de Code Réponse (ex: 151 -> 51)
  const conversionEvent = events.find((e) => e.responseCodeConversion);
  if (conversionEvent && conversionEvent.responseCodeConversion) {
    const { receivedCode, sendCode } = conversionEvent.responseCodeConversion;
    if (receivedCode !== sendCode) {
      anomalies.push({
        id: `ANOM_RESP_CONV_${tx.id}`,
        ruleId: "RULE_ISO_02_CODE_TRANSFORMATION",
        category: "ISO8583",
        severity: "MEDIUM",
        title: `Transformation du Code Réponse détectée (${receivedCode} -> ${sendCode})`,
        description: `Le switch a reçu le code de réponse '${receivedCode}' du Host et l'a converti en '${sendCode}' avant émission vers le canal appelant.`,
        evidenceEventIds: [conversionEvent.eventId],
        recommendation:
          "Consulter la table de mapping des codes réponse du switch (ex: 151 interne Host converti en 51 standard ISO 8583 - Solde insuffisant).",
      });
    }
  }

  // 3. Détection de Rupture de Flux (Requête reçue mais jamais de réponse transmise)
  const hasIncomingRequest = events.some(
    (e) =>
      e.eventType.includes("receive") ||
      e.eventType.includes("Msg From DISPATCH")
  );
  const hasSendToHost = events.some(
    (e) =>
      e.eventType.includes("Msg To Host") ||
      e.eventType.includes("sendMessage") ||
      e.eventType.includes("send")
  );
  const hasHostResponse = events.some(
    (e) =>
      e.eventType.includes("Msg Recu") ||
      (e.eventType === "receive" && e.realm.includes("ExternalChannel"))
  );
  const hasFinalReplyToChannel = events.some(
    (e) =>
      e.eventType.includes("FLOW - send") &&
      e.realm.includes("InternalChannel")
  );

  if (hasIncomingRequest && hasSendToHost && !hasHostResponse) {
    anomalies.push({
      id: `ANOM_NO_HOST_RESP_${tx.id}`,
      ruleId: "RULE_COMM_02_HOST_NO_REPLY",
      category: "COMMUNICATION",
      severity: "CRITICAL",
      title: "Absence de réponse du Host (Timeout Externe)",
      description:
        "La demande d'autorisation a été transmise au Host émetteur (FLOW - Msg To Host / sendMessage), mais aucun message de réponse n'a été reçu sur le canal externe.",
      evidenceEventIds: events
        .filter((e) => e.eventType.includes("To Host") || e.eventType.includes("send"))
        .map((e) => e.eventId),
      recommendation:
        "Vérifier la connectivité IP/TLS du canal externe et vérifier si un avis d'annulation automatique (Reversal 0420) a été déclenché par le switch.",
    });
  } else if (hasIncomingRequest && hasHostResponse && !hasFinalReplyToChannel) {
    anomalies.push({
      id: `ANOM_INTERNAL_DROP_${tx.id}`,
      ruleId: "RULE_PROC_01_DROPPED_BEFORE_CLIENT",
      category: "PROCESSING",
      severity: "CRITICAL",
      title: "Rupture interne : Réponse non réémise vers le canal d'origine",
      description:
        "La réponse du Host a bien été réceptionnée par le switch, mais aucun événement FLOW - send vers le canal interne d'origine (InternalChannel) n'a été constaté.",
      evidenceEventIds: events.map((e) => e.eventId),
      recommendation:
        "Vérifier si le socket client s'est déconnecté prématurément par timeout ou si le thread de dispatch a rencontré une exception interne.",
    });
  }

  // 4. Analyse du Code Réponse Final (DE39)
  const lastIsoEvent = [...events]
    .reverse()
    .find((e) => e.isoFields["39"] || e.responseCodeConversion);

  const de39 =
    lastIsoEvent?.isoFields["39"] ||
    lastIsoEvent?.responseCodeConversion?.sendCode;

  if (de39) {
    if (de39 === "91") {
      anomalies.push({
        id: `ANOM_DE39_91_${tx.id}`,
        ruleId: "RULE_ISO_03_ISSUER_UNAVAILABLE",
        category: "COMMUNICATION",
        severity: "CRITICAL",
        title: "Code DE39 = 91 (Émetteur ou switch inopérant)",
        description:
          "La transaction a abouti à un rejet technique DE39=91 : le système distant ou le switch n'a pas pu traiter la demande dans le délai imparti.",
        evidenceEventIds: lastIsoEvent ? [lastIsoEvent.eventId] : [],
        recommendation:
          "Vérifier la disponibilité du serveur d'autorisation émetteur et des liens interbancaires.",
      });
    } else if (de39 === "05" || de39 === "51" || de39 === "14" || de39 === "54" || de39 === "55") {
      anomalies.push({
        id: `ANOM_BUSINESS_REFUSAL_${tx.id}`,
        ruleId: "RULE_BUS_01_BUSINESS_REJECTION",
        category: "TRANSACTIONAL",
        severity: "LOW",
        title: `Refus Métier Normal (DE39 = ${de39})`,
        description: `Ce code réponse traduit un refus fonctionnel standard (ex: solde insuffisant, code PIN erroné, carte expirée) et non un dysfonctionnement technique de l'infrastructure switch.`,
        evidenceEventIds: lastIsoEvent ? [lastIsoEvent.eventId] : [],
        recommendation: "Aucune action technique corrective requise.",
      });
    }
  }

  // 5. Analyse des écarts requête / réponse
  if (tx.comparison?.hasDiscrepancy) {
    for (const note of tx.comparison.notes) {
      anomalies.push({
        id: `ANOM_DISCREPANCY_${Math.random().toString(36).substring(7)}`,
        ruleId: "RULE_ISO_04_FIELD_INCONSISTENCY",
        category: "ISO8583",
        severity: "MEDIUM",
        title: "Incohérence détectée entre Requête et Réponse",
        description: note,
        evidenceEventIds: events.map((e) => e.eventId),
        recommendation:
          "Vérifier le profil de packaging ISO 8583 pour s'assurer que les champs obligatoires sont bien reflétés sans altération.",
      });
    }
  }

  return anomalies;
}

