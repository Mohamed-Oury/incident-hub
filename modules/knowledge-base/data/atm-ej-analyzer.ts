import { maskPAN } from "@/modules/security/masking";

export type EjVendor = "NCR" | "DIEBOLD_NIXDORF" | "WINCOR" | "HYOSUNG" | "GENERIC";

export type EjEventSeverity = "SUCCESS" | "WARNING" | "CRITICAL" | "INFO";

export interface EjParsedEvent {
  timestamp?: string;
  sequenceNumber?: string;
  eventType: "CARD_INSERTED" | "PIN_ENTERED" | "HOST_AUTH_OK" | "HOST_AUTH_REJECT" | "DISPENSE_REQUESTED" | "DISPENSE_COMPLETED" | "BILL_JAM" | "RETRACT" | "CARD_EJECTED" | "CARD_RETAINED" | "HARDWARE_ERROR" | "TIMEOUT";
  severity: EjEventSeverity;
  description: string;
  rawLogLine: string;
  details?: Record<string, any>;
}

export interface EjAnalysisSummary {
  vendor: EjVendor;
  atmId?: string;
  transactionCount: number;
  totalDispensedNotes: number;
  totalRequestedNotes: number;
  panDetected?: string;
  stanDetected?: string;
  amountDetected?: string;
  hasBillJam: boolean;
  hasRetract: boolean;
  hasCardRetained: boolean;
  finalVerdict: "DISPENSE_SUCCESSFUL" | "DISPENSE_FAILED_BILL_JAM" | "DISPENSE_PARTIAL" | "RETRACT_CUSTOMER_TIMEOUT" | "DECLINED_BY_HOST" | "UNKNOWN";
  verdictExplanation: string;
  recommendedOperatorAction: string;
  claimAdvice: "FAVORABLE_RECREDIT" | "UNFAVORABLE_REJECT_CLAIM" | "INVESTIGATION_REQUIRED";
}

export interface EjAnalysisResult {
  rawLog: string;
  events: EjParsedEvent[];
  summary: EjAnalysisSummary;
}

export function parseAtmElectronicJournal(rawLog: string): EjAnalysisResult {
  const lines = rawLog.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  const events: EjParsedEvent[] = [];

  let vendor: EjVendor = "GENERIC";
  let atmId: string | undefined = undefined;
  let panDetected: string | undefined = undefined;
  let stanDetected: string | undefined = undefined;
  let amountDetected: string | undefined = undefined;

  let totalRequestedNotes = 0;
  let totalDispensedNotes = 0;
  let hasBillJam = false;
  let hasRetract = false;
  let hasCardRetained = false;
  let hostApproved = false;
  let hostDeclined = false;

  for (const line of lines) {
    const upper = line.toUpperCase();

    // Détection Fabricant
    if (upper.includes("NCR") || upper.includes("S2 DISPENSER") || upper.includes("M-STATUS")) {
      vendor = "NCR";
    } else if (upper.includes("DIEBOLD") || upper.includes("OPTEVA") || upper.includes("CS 7700")) {
      vendor = "DIEBOLD_NIXDORF";
    } else if (upper.includes("WINCOR") || upper.includes("PROCASH") || upper.includes("CMD-V4")) {
      vendor = "WINCOR";
    } else if (upper.includes("HYOSUNG") || upper.includes("MONIMAX")) {
      vendor = "HYOSUNG";
    }

    // Détection ID GAB
    const atmMatch = upper.match(/(ATM|TERM|TID)[:=\s]+([A-Z0-9_-]{6,12})/);
    if (atmMatch && !atmId) {
      atmId = atmMatch[2];
    }

    // Détection PAN (masquage systématique)
    const panMatch = upper.match(/(PAN|CARD|CARTE)[:=\s]+(\d{4}[\s*-]*\d{2}[\s*-]*\d{4,9}|\d{16,19})/);
    if (panMatch && !panDetected) {
      const rawPan = panMatch[2].replace(/[\s*-]/g, "");
      panDetected = maskPAN(rawPan);
    }

    // Détection STAN
    const stanMatch = upper.match(/(STAN|TRACE)[:=\s]+(\d{4,8})/);
    if (stanMatch && !stanDetected) {
      stanDetected = stanMatch[2];
    }

    // Détection Montant
    const amtMatch = upper.match(/(AMOUNT|MONTANT)[:=\s]+(\d+([.,]\d{2})?)/);
    if (amtMatch && !amountDetected) {
      amountDetected = amtMatch[2].replace(",", ".");
    }

    // Parsing des Événements
    if (upper.includes("CARD INSERT") || upper.includes("CARD READ") || upper.includes("CHIP INITIALIZED")) {
      events.push({
        eventType: "CARD_INSERTED",
        severity: "INFO",
        description: "Carte introduite et lue par le lecteur (MCR/EMV)",
        rawLogLine: line,
      });
    } else if (upper.includes("PIN ENTERED") || upper.includes("EPP KEY") || upper.includes("PIN OK")) {
      events.push({
        eventType: "PIN_ENTERED",
        severity: "INFO",
        description: "Code confidentiel saisi sur le clavier sécurisé EPP",
        rawLogLine: line,
      });
    } else if (upper.includes("RESPONSE: 00") || upper.includes("AUTH OK") || upper.includes("RC:00") || upper.includes("HOST APPROVED")) {
      hostApproved = true;
      events.push({
        eventType: "HOST_AUTH_OK",
        severity: "SUCCESS",
        description: "Autorisation accordée par le Switch/Core Banking (DE39=00)",
        rawLogLine: line,
      });
    } else if (upper.includes("RESPONSE: 51") || upper.includes("RESPONSE: 55") || upper.includes("DECLINED") || upper.includes("HOST REJECT")) {
      hostDeclined = true;
      events.push({
        eventType: "HOST_AUTH_REJECT",
        severity: "WARNING",
        description: "Transaction refusée par l'émetteur (Provision, PIN ou compte)",
        rawLogLine: line,
      });
    } else if (upper.includes("DISPENSE REQ") || upper.includes("DISPENSE START") || upper.includes("DELIVER NOTES")) {
      const notesMatch = upper.match(/(\d+)\s*(NOTES|BILLETS)/);
      if (notesMatch) totalRequestedNotes += parseInt(notesMatch[1], 10);
      events.push({
        eventType: "DISPENSE_REQUESTED",
        severity: "INFO",
        description: "Commande mécanique de distribution envoyée au distributeur",
        rawLogLine: line,
      });
    } else if (upper.includes("JAM") || upper.includes("JAMMED") || upper.includes("STACKER ERROR") || upper.includes("TRANSPORT ERROR") || upper.includes("SHUTTER BLOCKED")) {
      hasBillJam = true;
      events.push({
        eventType: "BILL_JAM",
        severity: "CRITICAL",
        description: "Bourrage mécanique détecté dans le chemin de transport des billets ou volet bloqué",
        rawLogLine: line,
      });
    } else if (upper.includes("RETRACT") || upper.includes("BILLS RETRACTED") || upper.includes("PRESENT TIMEOUT") || upper.includes("TAKEN TIMEOUT")) {
      hasRetract = true;
      events.push({
        eventType: "RETRACT",
        severity: "WARNING",
        description: "Billets avalés / rétractés dans le bac de rejet suite à un dépassement de délai (oubli client)",
        rawLogLine: line,
      });
    } else if (upper.includes("BILLS TAKEN") || upper.includes("DISPENSE OK") || upper.includes("NOTES DELIVERED") || upper.includes("EXIT SENSOR CLEARED")) {
      const notesMatch = upper.match(/(\d+)\s*(NOTES|BILLETS)/);
      if (notesMatch) totalDispensedNotes += parseInt(notesMatch[1], 10);
      events.push({
        eventType: "DISPENSE_COMPLETED",
        severity: "SUCCESS",
        description: "Billets physiquement présentés et retirés par le porteur (capteurs de sortie validés)",
        rawLogLine: line,
      });
    } else if (upper.includes("CARD CAPTURE") || upper.includes("CARD RETAIN") || upper.includes("CARD CONFISCATED")) {
      hasCardRetained = true;
      events.push({
        eventType: "CARD_RETAINED",
        severity: "CRITICAL",
        description: "Carte confisquée et avalée dans le bac de rétention du GAB",
        rawLogLine: line,
      });
    } else if (upper.includes("CARD EJECT") || upper.includes("CARD RETURN") || upper.includes("CARD TAKEN")) {
      events.push({
        eventType: "CARD_EJECTED",
        severity: "INFO",
        description: "Carte éjectée et reprise par le porteur",
        rawLogLine: line,
      });
    }
  }

  // Synthèse & Verdict pour l'exploitant monétique
  let finalVerdict: EjAnalysisSummary["finalVerdict"] = "UNKNOWN";
  let verdictExplanation = "";
  let recommendedOperatorAction = "";
  let claimAdvice: EjAnalysisSummary["claimAdvice"] = "INVESTIGATION_REQUIRED";

  if (hasBillJam) {
    finalVerdict = "DISPENSE_FAILED_BILL_JAM";
    verdictExplanation = "Échec mécanique avéré : Bourrage de billets dans le module distributeur. Les espèces n'ont pas franchi le volet de sortie.";
    recommendedOperatorAction = "Vérifier l'émission de la trame d'extourne 0400/0420 par le GAB. Si l'extourne n'est pas passée, procéder à l'arrêté du coffre et au recrédit du compte client.";
    claimAdvice = "FAVORABLE_RECREDIT";
  } else if (hasRetract) {
    finalVerdict = "RETRACT_CUSTOMER_TIMEOUT";
    verdictExplanation = "Présentation effectuée mais billets non récupérés par le client dans le délai imparti (30s). Billets orientés vers le bac de rejet/rétract.";
    recommendedOperatorAction = "Vérifier le compteur du bac de rejet (Reject Cassette) lors de la télé-collecte/arrêté contradictoire GAB avant de débloquer les fonds.";
    claimAdvice = "FAVORABLE_RECREDIT";
  } else if (totalDispensedNotes > 0 && totalRequestedNotes > 0 && totalDispensedNotes < totalRequestedNotes) {
    finalVerdict = "DISPENSE_PARTIAL";
    verdictExplanation = `Distribution partielle : ${totalDispensedNotes} billets distribués sur ${totalRequestedNotes} demandés.`;
    recommendedOperatorAction = "Vérifier le montant du DE95 dans l'extourne partielle et régulariser le différentiel en compte.";
    claimAdvice = "FAVORABLE_RECREDIT";
  } else if (events.some((e) => e.eventType === "DISPENSE_COMPLETED")) {
    finalVerdict = "DISPENSE_SUCCESSFUL";
    verdictExplanation = "Distribution mécanique réussie à 100% : Les capteurs de sortie confirment que les billets ont été physiquement retirés par le client.";
    recommendedOperatorAction = "Réclamation client non fondée ou tentative de fraude. Opposer le journal électronique horodaté attestant de la prise des espèces.";
    claimAdvice = "UNFAVORABLE_REJECT_CLAIM";
  } else if (hostDeclined) {
    finalVerdict = "DECLINED_BY_HOST";
    verdictExplanation = "Transaction refusée par le serveur bancaire en amont. Le mécanisme de distribution n'a jamais été amorcé.";
    recommendedOperatorAction = "Aucun débit n'a été validé. Vérifier le relevé de compte et le code réponse DE39.";
    claimAdvice = "UNFAVORABLE_REJECT_CLAIM";
  } else {
    finalVerdict = "UNKNOWN";
    verdictExplanation = "Journal partiel ou non concluant. Présence d'événements incomplets ne permettant pas d'attester de la prise ou du rejet.";
    recommendedOperatorAction = "Déclencher un audit physique du GAB et un comptage des cassettes de billets.";
    claimAdvice = "INVESTIGATION_REQUIRED";
  }

  return {
    rawLog,
    events,
    summary: {
      vendor,
      atmId,
      transactionCount: events.length > 0 ? 1 : 0,
      totalDispensedNotes,
      totalRequestedNotes,
      panDetected,
      stanDetected,
      amountDetected,
      hasBillJam,
      hasRetract,
      hasCardRetained,
      finalVerdict,
      verdictExplanation,
      recommendedOperatorAction,
      claimAdvice,
    },
  };
}
