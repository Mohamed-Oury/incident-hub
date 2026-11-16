import {
  TransactionCandidate,
  AiDiagnosticReport,
  AnomalyItem,
} from "./types";
import { DE39_CATALOG } from "../knowledge-base/data/iso-de39-reference";
import { ISO_MTI_CATALOG } from "./iso-standards";

/**
 * Moteur Déterministe de Diagnostic Intelligent Monétique.
 * Analyse contextuelle approfondie d'une transaction corrélée multi-sauts :
 * - Analyse fine du code réponse DE39 (00 succès, 51 provision, 55 PIN, 91 timeout émetteur, etc.)
 * - Détection du type d'opération (MTI 1100/1110, 0200/0210, 1420/1430, 0800/0810)
 * - Traitement des Reversals / Extournes SAF avec pivot DE56 (ISO 1993) ou DE90 (ISO 1987)
 * - Traitement des transcodages réels (ex: 151 -> 51, 000 -> 00, 117 -> 17)
 * - Diagnostic différentiel multi-hypothèses (H1, H2, H3) et plan d'action bancaire
 */
export function generateIntelligentDiagnostic(
  tx: TransactionCandidate
): AiDiagnosticReport {
  const events = tx.events.map((e) => e.event);

  // 1. Extraction des caractéristiques de flux
  const incomingReqEvent = events.find(
    (e) =>
      e.eventType.includes("receive") &&
      (e.realm.includes("InternalChannel") || !e.realm.includes("ExternalChannel"))
  );
  const sendToHostEvent = events.find(
    (e) =>
      e.eventType.includes("To Host") ||
      (e.eventType === "send" && e.realm.includes("ExternalChannel"))
  );
  const hostResponseEvent = events.find(
    (e) =>
      e.eventType.includes("Msg Recu") ||
      (e.eventType === "receive" && e.realm.includes("ExternalChannel"))
  );
  const finalReplyEvent = events.find(
    (e) =>
      e.eventType.includes("FLOW - send") &&
      e.realm.includes("InternalChannel")
  );

  const clientChannel = incomingReqEvent?.realm || "InternalChannel";
  const hostChannel = sendToHostEvent?.realm || hostResponseEvent?.realm || "ExternalChannel";

  // 2. Extraction du code réponse DE39 et du code d'approbation DE38
  const lastIsoEvent = [...events]
    .reverse()
    .find((e) => e.isoFields && (e.isoFields["39"] || e.isoFields["38"]));

  const de39Code =
    lastIsoEvent?.isoFields?.["39"] ||
    finalReplyEvent?.isoFields?.["39"] ||
    hostResponseEvent?.isoFields?.["39"] ||
    tx.events.find((e) => e.event.responseCodeConversion)?.event.responseCodeConversion?.sendCode;

  const authCode =
    lastIsoEvent?.isoFields?.["38"] ||
    hostResponseEvent?.isoFields?.["38"] ||
    finalReplyEvent?.isoFields?.["38"];

  const de39Def = de39Code
    ? DE39_CATALOG.find((item) => item.code === de39Code || item.code === de39Code.slice(-2))
    : undefined;

  // Conversion de code réponse
  const conversionEvent = events.find((e) => e.responseCodeConversion);
  const responseConv = conversionEvent?.responseCodeConversion;

  // Reversal / Extourne
  const isReversal =
    tx.mtiInitial === "0400" ||
    tx.mtiInitial === "0420" ||
    tx.mtiInitial === "1420" ||
    tx.mtiFinal === "1430" ||
    tx.mtiFinal === "0430" ||
    events.some((e) => e.mti?.startsWith("04") || e.mti?.startsWith("14") || e.eventType.includes("Saf"));

  const de56 = events.find((e) => e.isoFields && e.isoFields["56"])?.isoFields?.["56"];
  const de90 = events.find((e) => e.isoFields && e.isoFields["90"])?.isoFields?.["90"];

  // Détection des anomalies critiques
  const hasHostTimeout = tx.anomalies.some((a) => a.ruleId.includes("HOST_NO_REPLY"));
  const hasInternalDrop = tx.anomalies.some((a) => a.ruleId.includes("DROPPED_BEFORE_CLIENT"));
  const hasHighLatency = tx.durationMs > 5000;
  const isBiNorm = tx.isoVersion === "BI_NORME";

  // Libellé MTI
  const mtiInitInfo = tx.mtiInitial ? ISO_MTI_CATALOG[tx.mtiInitial] : undefined;
  const mtiFinalInfo = tx.mtiFinal ? ISO_MTI_CATALOG[tx.mtiFinal] : undefined;
  const mtiContext = `${tx.mtiInitial || "?"} (${mtiInitInfo?.nameFr || mtiInitInfo?.class || "Demande"}) ➔ ${tx.mtiFinal || "?"} (${mtiFinalInfo?.nameFr || mtiFinalInfo?.class || "Réponse"})`;

  // 3. Construction des Faits confirmés
  const facts: string[] = [
    `Transaction RRN ${tx.rrn} identifiée avec ${tx.events.length} événements corrélés sur ${tx.durationMs} ms.`,
    `Flux de MTI : ${mtiContext}.`,
    ...(tx.stan ? [`Numéro de trace STAN (DE11) : ${tx.stan}.`] : []),
    ...(tx.terminalId ? [`Identifiant du terminal (DE41) : ${tx.terminalId}.`] : []),
    ...(tx.amount ? [`Montant transactionnel (DE4) : ${tx.amount} ${tx.currency || ""}.`] : []),
    ...(tx.cardAcceptor ? [`Acceptation commerçant / localisation (DE43) : ${tx.cardAcceptor}.`] : []),
    `Version normative ISO 8583 : ${tx.isoVersion || "ISO 8583:1993"} (${tx.isoVersionDetails || "Standard"}).`,
  ];

  if (de39Code) {
    facts.push(`Code réponse final (DE39) : '${de39Code}' - ${de39Def?.label || "Statut réponse émetteur"}.`);
  }
  if (authCode) {
    facts.push(`Code d'autorisation accordé par l'émetteur (DE38) : '${authCode}'.`);
  }
  if (responseConv) {
    facts.push(
      `Transcodage opéré par le switch : code interne Host '${responseConv.receivedCode}' ➔ code standard émis '${responseConv.sendCode}'.`
    );
  }
  if (isReversal) {
    facts.push(
      `Type d'opération : Avis d'extourne / annulation (Reversal SAF). ${
        de56 ? `Pivot DE56 (1993) présent : ${de56}` : de90 ? `Pivot DE90 (1987) présent : ${de90}` : "Alerte : absence de champ d'origine DE56/DE90."
      }`
    );
  }

  // 4. Moteur de décision déterministe
  let observedSymptom = "";
  let probableRootCause = "";
  let rootCauseConfidence: "TRÈS ÉLEVÉE" | "ÉLEVÉE" | "MOYENNE" = "TRÈS ÉLEVÉE";
  const hypotheses: AiDiagnosticReport["hypotheses"] = [];
  const recommendedVerifications: string[] = [];
  const correctiveActions: string[] = [];
  const preventiveActions: string[] = [];

  const isSuccess = de39Code === "00" || de39Code === "000" || Boolean(authCode && !["51", "55", "91", "05", "14"].includes(de39Code || ""));

  if (hasHostTimeout) {
    // CAS 1 : Timeout Host (demande envoyée sans réponse du serveur émetteur)
    observedSymptom = `Absence de réponse du Host émetteur sur ${hostChannel} (Timeout externe après ${tx.durationMs} ms).`;
    probableRootCause = `Rupture de communication externe avec le serveur d'autorisation du Host : la demande ${tx.mtiInitial || "1100"} a été transmise mais aucun message de retour ${tx.mtiFinal || "1110"} n'a été réceptionné avant l'expiration du timer.`;
    rootCauseConfidence = "TRÈS ÉLEVÉE";

    hypotheses.push({
      id: "H1",
      title: "Indisponibilité du serveur Host ou coupure socket TCP/IP",
      confidence: "TRÈS ÉLEVÉE",
      supportingEvidence: [
        `Demande envoyée sur ${hostChannel} sans événement 'receive' correspondant`,
        `Durée observée : ${tx.durationMs} ms`,
      ],
      potentialCauses: [
        "Coupure de lien réseau télécoms ou firewall",
        "Arrêt ou plantage du listener TCP du Host Core Banking",
        "Expiration du timer socket du switch",
      ],
    });
    hypotheses.push({
      id: "H2",
      title: "Saturation de la file d'attente du Core Banking (Amplitude / Flexcube)",
      confidence: "MOYENNE",
      supportingEvidence: ["Le switch a bien émis le paquet TCP sans retour"],
      potentialCauses: ["Deadlock base de données ou saturation CPU sur le serveur bancaire"],
    });

    correctiveActions.push(
      `Vérifier la connectivité IP, le ping et le port d'écoute sur le canal ${hostChannel}.`,
      "Vérifier si un avis d'annulation/extourne automatique (SAF 1420 / 0420) a été généré pour libérer les fonds du porteur."
    );
    recommendedVerifications.push(
      "Consulter la console du switch jPOS pour inspecter l'état du socket 'ExternalChannel'.",
      "Vérifier les réceptions de trames de supervision Keepalive / Echo Test (1804/1814 ou 0800/0810)."
    );
    preventiveActions.push(
      "Ajuster les seuils de timeout du canal Host et vérifier la mise en place d'une passerelle de secours (Failover / Dual Host)."
    );
  } else if (hasInternalDrop) {
    // CAS 2 : Rupture interne (Host a répondu mais la réponse n'a pas été renvoyée au client)
    observedSymptom = `Rupture de flux interne : la réponse du Host (${de39Code || "00"}) a été reçue mais n'a pas été réémise vers ${clientChannel}.`;
    probableRootCause = `Déconnexion prématurée du canal appelant (${clientChannel}) par expiration de timeout local ou exception dans le thread de dispatching interne.`;
    rootCauseConfidence = "ÉLEVÉE";

    hypotheses.push({
      id: "H1",
      title: "Timeout du frontal d'acquisition avant réponse du switch",
      confidence: "ÉLEVÉE",
      supportingEvidence: [
        "Réception Host constatée mais pas d'émission finale vers InternalChannel",
        `Délai total : ${tx.durationMs} ms`,
      ],
      potentialCauses: [
        "Le client (TPE/GAB/Canal Digital) a fermé sa socket avant l'arrivée de la réponse",
        "Désynchronisation entre le timeout client et le timeout Host",
      ],
    });
    hypotheses.push({
      id: "H2",
      title: "Exception Java ou blocage de thread dans le processeur interne",
      confidence: "MOYENNE",
      supportingEvidence: ["Événement 'FLOW - Msg Recu' présent sans 'FLOW - send'"],
      potentialCauses: ["Erreur de formatage ou exception null-pointer dans le worker de dispatch"],
    });

    correctiveActions.push(
      `Augmenter le timer de timeout sur le canal d'entrée ${clientChannel} pour qu'il couvre le temps de réponse maximal du Host.`,
      "Inspecter les fichiers de logs Java / jPOS à l'horodatage de la transaction pour repérer une exception applicative."
    );
    recommendedVerifications.push(
      "Vérifier auprès du porteur si le débit a eu lieu et si une réclamation a été introduite.",
      "Vérifier si une annulation SAF a été programmée suite à la non-délivrance de la réponse au client."
    );
    preventiveActions.push(
      "Harmoniser les délais d'expiration de la chaîne : Timeout Client > Timeout Switch > Timeout Host."
    );
  } else if (isReversal) {
    // CAS 3 : Extourne / Reversal (SAF 1420 / 0420)
    const revSuccess = de39Code === "00" || de39Code === "000";
    observedSymptom = `Cycle d'annulation/extourne transactionnelle (SAF Reversal) ${revSuccess ? "acquitté avec succès" : "avec rejet émetteur"}.`;
    probableRootCause = revSuccess
      ? `Extourne validée par le Core Banking : les fonds réservés ou débités lors de la transaction initiale ont été restitués au compte porteur.`
      : `Rejet de l'avis d'extourne par l'Émetteur (Code DE39='${de39Code}') : risque d'écart de rapprochement comptable.`;
    rootCauseConfidence = "TRÈS ÉLEVÉE";

    hypotheses.push({
      id: "H1",
      title: revSuccess ? "Régularisation financière conforme" : "Échec d'extourne sur le Core Banking",
      confidence: "TRÈS ÉLEVÉE",
      supportingEvidence: [
        `Trame Reversal MTI ${tx.mtiInitial || "1420"} traitée`,
        ...(de56 ? [`Pivot DE56 d'origine conforme : ${de56}`] : de90 ? [`Pivot DE90 d'origine conforme : ${de90}`] : ["Alerte : pas de pivot DE56/DE90"]),
      ],
      potentialCauses: [
        revSuccess ? "Annulation automatique initiée par le terminal (incident matériel ou timeout)" : "Transaction d'origine introuvable (record not found) ou compte bloqué",
      ],
    });

    correctiveActions.push(
      revSuccess
        ? "Vérifier la bonne purge du message de la file d'attente Store & Forward (SAF Manager)."
        : "Effectuer un ajustement manuel du compte client dans le Core Banking (Amplitude / Flexcube) pour régulariser le débit."
    );
    recommendedVerifications.push(
      "Consulter le journal électronique (EJ log) du GAB pour confirmer l'incident automate (bourrage, carte avalée, refus distribution).",
      "Vérifier dans le module de clearing que l'extourne neutralise le montant de la transaction initiale."
    );
    preventiveActions.push(
      "Contrôler la fiabilité des capteurs de détection de billets et la qualité de la liaison réseau locale de l'automate."
    );
  } else if (isSuccess) {
    // CAS 4 : Transaction Approuvée (DE39 = 00 / 000)
    observedSymptom = `Transaction approuvée avec succès par l'Émetteur (Code d'autorisation DE38 : '${authCode || "Délivré"}') en ${tx.durationMs} ms.`;
    probableRootCause = `Autorisation accordée et débit validé par le Core Banking : le porteur dispose de fonds suffisants et les contrôles de sécurité (PIN/CVV) sont conformes.`;
    rootCauseConfidence = "TRÈS ÉLEVÉE";

    if (responseConv && responseConv.receivedCode !== responseConv.sendCode) {
      probableRootCause += ` Le switch a normalisé le code d'accord (code étendu Host '${responseConv.receivedCode}' converti en standard '${responseConv.sendCode}').`;
    }

    hypotheses.push({
      id: "H1",
      title: "Parcours transactionnel nominal et conforme",
      confidence: "TRÈS ÉLEVÉE",
      supportingEvidence: [
        `Code DE39 final = '${de39Code || "00"}' (Approved)`,
        ...(authCode ? [`Code accord DE38 : '${authCode}'`] : []),
        `Durée d'exécution de bout en bout : ${tx.durationMs} ms (< 2000 ms SLA)`,
      ],
      potentialCauses: ["Provision disponible, carte active et contrôles cryptographiques validés"],
    });

    correctiveActions.push(
      "Aucune action corrective requise : la transaction a abouti avec succès."
    );
    recommendedVerifications.push(
      `Rapprocher le numéro d'autorisation DE38 ('${authCode || "00"}') avec l'écriture comptable dans le CBS (Amplitude / Flexcube).`,
      "Vérifier la présence de la transaction dans le fichier de compensation journalier (Clearing interbancaire)."
    );
    preventiveActions.push(
      "Poursuivre la surveillance normale du volume d'autorisation et des métriques de temps de réponse."
    );
  } else {
    // CAS 5 : Refus Métier / Fonctionnel (DE39 = 51, 55, 14, 54, 05, 17, 91, etc.)
    const label = de39Def?.label || "Refus Émetteur";
    const meaning = de39Def?.meaning || "Transaction refusée par l'institution émettrice.";
    const recAction = de39Def?.recommendedAction || "Informer le porteur du motif du refus.";

    observedSymptom = `Refus d'autorisation émis par l'Émetteur : DE39 = '${de39Code}' (${label}).`;

    if (de39Code === "51" || de39Code === "151") {
      probableRootCause = `Provision insuffisante sur le compte débiteur lié à la carte : le Core Banking (Amplitude / Flexcube) a rejeté l'opération pour solde indisponible.`;
    } else if (de39Code === "55") {
      probableRootCause = `Échec de vérification du code PIN : le PIN Block chiffré (DE52) transmis ne concorde pas avec la référence HSM ou le compteur d'essais PIN est dépassé.`;
    } else if (de39Code === "14") {
      probableRootCause = `Numéro de carte invalide ou inexistant : le PAN transmis en DE2 n'a pas été retrouvé dans le référentiel carte du CBS.`;
    } else if (de39Code === "54") {
      probableRootCause = `Carte expirée : la date de validité transmise en DE14 est dépassée par rapport à la date de traitement.`;
    } else if (de39Code === "17" || de39Code === "117") {
      probableRootCause = `Abandon de la transaction par le client au point d'acceptation (annulation au clavier du TPE/GAB).`;
    } else if (de39Code === "91") {
      probableRootCause = `Émetteur ou switch inopérant : le centre d'autorisation émetteur est inaccessible ou ne répond pas dans le délai configuré.`;
      rootCauseConfidence = "ÉLEVÉE";
    } else {
      probableRootCause = `Refus émetteur DE39='${de39Code}' (${label}) : ${meaning}`;
    }

    if (responseConv && responseConv.receivedCode !== responseConv.sendCode) {
      probableRootCause += ` Le Host a renvoyé son code interne '${responseConv.receivedCode}', transcodé de manière conforme par le switch en '${responseConv.sendCode}' (${label}).`;
    }

    hypotheses.push({
      id: "H1",
      title: `Décision de refus légitime du Core Banking / Émetteur (${label})`,
      confidence: "TRÈS ÉLEVÉE",
      supportingEvidence: [
        `Code DE39 = '${de39Code}' présent dans le message retour du Host (${hostChannel})`,
        ...(responseConv ? [`Transcodage vérifié : '${responseConv.receivedCode}' ➔ '${responseConv.sendCode}'`] : []),
      ],
      potentialCauses: [
        de39Code === "51"
          ? "Solde comptable ou disponible insuffisant, plafond de paiement mensuel/hebdomadaire atteint"
          : de39Code === "55"
          ? "Erreur de saisie client du PIN ou mauvaise clé de chiffrement ZPK sur le terminal"
          : de39Code === "91"
          ? "Liaison réseau interbancaire dégradée ou service émetteur en maintenance"
          : "Règle de gestion métier de la banque émettrice",
      ],
    });

    if (de39Code === "55") {
      hypotheses.push({
        id: "H2",
        title: "Désynchronisation de clé HSM (ZPK / TMK) sur le frontal ou le terminal",
        confidence: "MOYENNE",
        supportingEvidence: ["Rejet cryptographique DE39=55"],
        potentialCauses: ["Échange de clé de travail (Key Exchange 0800/1804) incomplet ou clé expirée"],
      });
    }

    correctiveActions.push(
      `Informer le porteur du motif de rejet '${de39Code} - ${label}'.`,
      de39Code === "51"
        ? "Inviter le client à approvisionner son compte ou à vérifier ses plafonds de paiement."
        : de39Code === "55"
        ? "Vérifier si le client a dépassé 3 tentatives consécutives (blocage sécurité) ou redemander la saisie."
        : de39Code === "91"
        ? "Vérifier l'état de la liaison réseau interbancaire et contacter le support réseau de l'émetteur."
        : recAction
    );

    recommendedVerifications.push(
      de39Code === "51"
        ? "Consulter le solde réel et les blocages provisoires sur le compte dans le CBS (Amplitude / Flexcube)."
        : de39Code === "55"
        ? "Vérifier le statut du HSM et l'état des clés ZPK partagées avec le frontal."
        : "Vérifier si la carte n'est pas mise en opposition pour vol ou perte."
    );

    preventiveActions.push(
      "Documenter le taux de rejet par motif dans le tableau de bord de supervision monétique."
    );
  }

  // 5. Compléments contextuels (Latence & Bi-norme)
  if (hasHighLatency) {
    facts.push(`Alerte de latence : transaction traitée en ${tx.durationMs} ms (seuil nominal < 2000 ms).`);
    recommendedVerifications.push(
      `Analyser les temps de réponse saut par saut (Latence externe Host vs latence interne Switch) pour identifier le goulet d'étranglement.`
    );
  }

  if (isBiNorm) {
    facts.push(
      `Passerelle bi-norme détectée : translation protocolaire entre ISO 8583:1987 et ISO 8583:1993 (${tx.isoVersionDetails || "QBridge"}).`
    );
    recommendedVerifications.push(
      "Vérifier la bonne transposition des champs normatifs (DE12 horodatage étendu, DE56/DE90 extourne) au niveau du bridge."
    );
  }

  const missingInformation: string[] = [];
  if (!tx.terminalId) {
    missingInformation.push("DE41 (Terminal ID) non présent dans l'ensemble des trames de transport.");
  }
  if (!tx.cardAcceptor) {
    missingInformation.push("DE43 (Card Acceptor Name/Location) absent du message de requête.");
  }
  if (isReversal && !de56 && !de90) {
    missingInformation.push("Champ d'origine DE56 (1993) ou DE90 (1987) absent de la trame d'extourne.");
  }

  const summary = `Investigation de la transaction RRN ${tx.rrn} (${tx.events.length} jalons, ${tx.durationMs} ms). ${probableRootCause}`;

  return {
    transactionId: tx.id,
    summary,
    observedSymptom,
    architectureFlow: tx.events.map((e) => `${e.event.eventType} (${e.event.realm})`),
    facts,
    hypotheses,
    probableRootCause,
    rootCauseConfidence,
    missingInformation,
    recommendedVerifications,
    correctiveActions,
    preventiveActions,
    sourceEventReferences: tx.events.map((e) => `[${e.event.eventId}] ${e.event.eventType}`),
    generatedAt: new Date().toISOString(),
    validationStatus: "PENDING",
  };
}

