import 'masking.dart';

enum EjVendor { ncr, dieboldNixdorf, wincor, hyosung, generic }

enum EjEventSeverity { success, warning, critical, info }

enum EjEventType {
  cardInserted,
  pinEntered,
  hostAuthOk,
  hostAuthReject,
  dispenseRequested,
  dispenseCompleted,
  billJam,
  retract,
  cardEjected,
  cardRetained,
  hardwareError,
  timeout,
}

enum EjFinalVerdict {
  dispenseSuccessful,
  dispenseFailedBillJam,
  dispensePartial,
  retractCustomerTimeout,
  declinedByHost,
  unknown,
}

enum EjClaimAdvice {
  favorableRecredit,
  unfavorableRejectClaim,
  investigationRequired,
}

class EjParsedEvent {
  final String? timestamp;
  final String? sequenceNumber;
  final EjEventType eventType;
  final EjEventSeverity severity;
  final String description;
  final String rawLogLine;

  const EjParsedEvent({
    this.timestamp,
    this.sequenceNumber,
    required this.eventType,
    required this.severity,
    required this.description,
    required this.rawLogLine,
  });
}

class EjAnalysisSummary {
  final EjVendor vendor;
  final String? atmId;
  final int transactionCount;
  final int totalDispensedNotes;
  final int totalRequestedNotes;
  final String? panDetected;
  final String? stanDetected;
  final String? amountDetected;
  final bool hasBillJam;
  final bool hasRetract;
  final bool hasCardRetained;
  final EjFinalVerdict finalVerdict;
  final String verdictExplanation;
  final String recommendedOperatorAction;
  final EjClaimAdvice claimAdvice;

  const EjAnalysisSummary({
    required this.vendor,
    this.atmId,
    required this.transactionCount,
    required this.totalDispensedNotes,
    required this.totalRequestedNotes,
    this.panDetected,
    this.stanDetected,
    this.amountDetected,
    required this.hasBillJam,
    required this.hasRetract,
    required this.hasCardRetained,
    required this.finalVerdict,
    required this.verdictExplanation,
    required this.recommendedOperatorAction,
    required this.claimAdvice,
  });
}

class EjAnalysisResult {
  final String rawLog;
  final List<EjParsedEvent> events;
  final EjAnalysisSummary summary;

  const EjAnalysisResult({
    required this.rawLog,
    required this.events,
    required this.summary,
  });
}

class AtmEjAnalyzer {
  static EjAnalysisResult parse(String rawLog) {
    final lines = rawLog.split(RegExp(r'\r?\n'))
        .map((l) => l.trim())
        .where((l) => l.isNotEmpty)
        .toList();

    final List<EjParsedEvent> events = [];
    EjVendor vendor = EjVendor.generic;
    String? atmId;
    String? panDetected;
    String? stanDetected;
    String? amountDetected;

    int totalRequestedNotes = 0;
    int totalDispensedNotes = 0;
    bool hasBillJam = false;
    bool hasRetract = false;
    bool hasCardRetained = false;
    bool hostDeclined = false;

    for (final line in lines) {
      final upper = line.toUpperCase();

      // Détection Fabricant
      if (upper.contains('NCR') || upper.contains('S2 DISPENSER') || upper.contains('M-STATUS')) {
        vendor = EjVendor.ncr;
      } else if (upper.contains('DIEBOLD') || upper.contains('OPTEVA') || upper.contains('CS 7700')) {
        vendor = EjVendor.dieboldNixdorf;
      } else if (upper.contains('WINCOR') || upper.contains('PROCASH') || upper.contains('CMD-V4')) {
        vendor = EjVendor.wincor;
      } else if (upper.contains('HYOSUNG') || upper.contains('MONIMAX')) {
        vendor = EjVendor.hyosung;
      }

      // Détection ID GAB
      final atmMatch = RegExp(r'(?:ATM|TERM|TID)[:=\s]+([A-Z0-9_-]{6,12})').firstMatch(upper);
      if (atmMatch != null && atmId == null) {
        atmId = atmMatch.group(1);
      }

      // Détection PAN (masquage systématique PCI-DSS)
      final panMatch = RegExp(r'(?:PAN|CARD|CARTE)[:=\s]+([0-9\s*-]{12,24})').firstMatch(upper);
      if (panMatch != null && panDetected == null) {
        final rawPan = panMatch.group(1)!.replaceAll(RegExp(r'[\s*-]'), '');
        if (rawPan.length >= 12) {
          panDetected = MaskingUtils.maskPan(rawPan);
        }
      }

      // Détection STAN
      final stanMatch = RegExp(r'(?:STAN|TRACE)[:=\s]+(\d{4,8})').firstMatch(upper);
      if (stanMatch != null && stanDetected == null) {
        stanDetected = stanMatch.group(1);
      }

      // Détection Montant
      final amtMatch = RegExp(r'(?:AMOUNT|MONTANT)[:=\s]+(\d+(?:[.,]\d{2})?)').firstMatch(upper);
      if (amtMatch != null && amountDetected == null) {
        amountDetected = amtMatch.group(1)!.replaceAll(',', '.');
      }

      // Horodatage optionnel
      final timeMatch = RegExp(r'^(\d{2}:\d{2}(?::\d{2})?)').firstMatch(line);
      final timestamp = timeMatch?.group(1);

      // Parsing des Événements
      if (upper.contains('CARD INSERT') || upper.contains('CARD READ') || upper.contains('CHIP INITIALIZED')) {
        events.add(EjParsedEvent(
          timestamp: timestamp,
          eventType: EjEventType.cardInserted,
          severity: EjEventSeverity.info,
          description: 'Carte introduite et lue par le lecteur (MCR/EMV)',
          rawLogLine: line,
        ));
      } else if (upper.contains('PIN ENTERED') || upper.contains('EPP KEY') || upper.contains('PIN OK')) {
        events.add(EjParsedEvent(
          timestamp: timestamp,
          eventType: EjEventType.pinEntered,
          severity: EjEventSeverity.info,
          description: 'Code confidentiel saisi sur le clavier sécurisé EPP',
          rawLogLine: line,
        ));
      } else if (upper.contains('RESPONSE: 00') || upper.contains('AUTH OK') || upper.contains('RC:00') || upper.contains('HOST APPROVED')) {
        events.add(EjParsedEvent(
          timestamp: timestamp,
          eventType: EjEventType.hostAuthOk,
          severity: EjEventSeverity.success,
          description: 'Autorisation accordée par le Switch/Core Banking (DE39=00)',
          rawLogLine: line,
        ));
      } else if (upper.contains('RESPONSE: 51') || upper.contains('RESPONSE: 55') || upper.contains('DECLINED') || upper.contains('HOST REJECT')) {
        hostDeclined = true;
        events.add(EjParsedEvent(
          timestamp: timestamp,
          eventType: EjEventType.hostAuthReject,
          severity: EjEventSeverity.warning,
          description: 'Transaction refusée par l\'émetteur (Provision, PIN ou compte)',
          rawLogLine: line,
        ));
      } else if (upper.contains('DISPENSE REQ') || upper.contains('DISPENSE START') || upper.contains('DELIVER NOTES')) {
        final notesMatch = RegExp(r'(\d+)\s*(?:NOTES|BILLETS)').firstMatch(upper);
        if (notesMatch != null) {
          totalRequestedNotes += int.tryParse(notesMatch.group(1)!) ?? 0;
        }
        events.add(EjParsedEvent(
          timestamp: timestamp,
          eventType: EjEventType.dispenseRequested,
          severity: EjEventSeverity.info,
          description: 'Commande mécanique de distribution envoyée au distributeur',
          rawLogLine: line,
        ));
      } else if (upper.contains('JAM') || upper.contains('JAMMED') || upper.contains('STACKER ERROR') || upper.contains('TRANSPORT ERROR') || upper.contains('SHUTTER BLOCKED')) {
        hasBillJam = true;
        events.add(EjParsedEvent(
          timestamp: timestamp,
          eventType: EjEventType.billJam,
          severity: EjEventSeverity.critical,
          description: 'Bourrage mécanique détecté dans le chemin de transport des billets ou volet bloqué',
          rawLogLine: line,
        ));
      } else if (upper.contains('RETRACT') || upper.contains('BILLS RETRACTED') || upper.contains('PRESENT TIMEOUT') || upper.contains('TAKEN TIMEOUT')) {
        hasRetract = true;
        events.add(EjParsedEvent(
          timestamp: timestamp,
          eventType: EjEventType.retract,
          severity: EjEventSeverity.warning,
          description: 'Billets avalés / rétractés dans le bac de rejet suite à un dépassement de délai (oubli client)',
          rawLogLine: line,
        ));
      } else if (upper.contains('BILLS TAKEN') || upper.contains('DISPENSE OK') || upper.contains('NOTES DELIVERED') || upper.contains('EXIT SENSOR CLEARED')) {
        final notesMatch = RegExp(r'(\d+)\s*(?:NOTES|BILLETS)').firstMatch(upper);
        if (notesMatch != null) {
          totalDispensedNotes += int.tryParse(notesMatch.group(1)!) ?? 0;
        }
        events.add(EjParsedEvent(
          timestamp: timestamp,
          eventType: EjEventType.dispenseCompleted,
          severity: EjEventSeverity.success,
          description: 'Billets physiquement présentés et retirés par le porteur (capteurs de sortie validés)',
          rawLogLine: line,
        ));
      } else if (upper.contains('CARD CAPTURE') || upper.contains('CARD RETAIN') || upper.contains('CARD CONFISCATED')) {
        hasCardRetained = true;
        events.add(EjParsedEvent(
          timestamp: timestamp,
          eventType: EjEventType.cardRetained,
          severity: EjEventSeverity.critical,
          description: 'Carte confisquée et avalée dans le bac de rétention du GAB',
          rawLogLine: line,
        ));
      } else if (upper.contains('CARD EJECT') || upper.contains('CARD RETURN') || upper.contains('CARD TAKEN')) {
        events.add(EjParsedEvent(
          timestamp: timestamp,
          eventType: EjEventType.cardEjected,
          severity: EjEventSeverity.info,
          description: 'Carte éjectée et reprise par le porteur',
          rawLogLine: line,
        ));
      } else if (upper.contains('HARDWARE ERROR') || upper.contains('FATAL ERROR') || upper.contains('DEVICE ERROR')) {
        events.add(EjParsedEvent(
          timestamp: timestamp,
          eventType: EjEventType.hardwareError,
          severity: EjEventSeverity.critical,
          description: 'Anomalie matérielle majeure survenue sur le module GAB',
          rawLogLine: line,
        ));
      }
    }

    // Synthèse & Verdict pour l'exploitant monétique
    EjFinalVerdict finalVerdict = EjFinalVerdict.unknown;
    String verdictExplanation = '';
    String recommendedOperatorAction = '';
    EjClaimAdvice claimAdvice = EjClaimAdvice.investigationRequired;

    if (hasBillJam) {
      finalVerdict = EjFinalVerdict.dispenseFailedBillJam;
      verdictExplanation = "Échec mécanique avéré : Bourrage de billets dans le module distributeur. Les espèces n'ont pas franchi le volet de sortie.";
      recommendedOperatorAction = "Vérifier l'émission de la trame d'extourne 0400/0420 par le GAB. Si l'extourne n'est pas passée, procéder à l'arrêté du coffre et au recrédit du compte client.";
      claimAdvice = EjClaimAdvice.favorableRecredit;
    } else if (hasRetract) {
      finalVerdict = EjFinalVerdict.retractCustomerTimeout;
      verdictExplanation = "Présentation effectuée mais billets non récupérés par le client dans le délai imparti (30s). Billets orientés vers le bac de rejet/rétract.";
      recommendedOperatorAction = "Vérifier le compteur du bac de rejet (Reject Cassette) lors de la télé-collecte/arrêté contradictoire GAB avant de débloquer les fonds.";
      claimAdvice = EjClaimAdvice.favorableRecredit;
    } else if (totalDispensedNotes > 0 && totalRequestedNotes > 0 && totalDispensedNotes < totalRequestedNotes) {
      finalVerdict = EjFinalVerdict.dispensePartial;
      verdictExplanation = "Distribution partielle : $totalDispensedNotes billets distribués sur $totalRequestedNotes demandés.";
      recommendedOperatorAction = "Vérifier le montant du DE95 dans l'extourne partielle et régulariser le différentiel en compte.";
      claimAdvice = EjClaimAdvice.favorableRecredit;
    } else if (events.any((e) => e.eventType == EjEventType.dispenseCompleted)) {
      finalVerdict = EjFinalVerdict.dispenseSuccessful;
      verdictExplanation = "Distribution mécanique réussie à 100% : Les capteurs de sortie confirment que les billets ont été physiquement retirés par le client.";
      recommendedOperatorAction = "Réclamation client non fondée ou tentative de fraude. Opposer le journal électronique horodaté attestant de la prise des espèces.";
      claimAdvice = EjClaimAdvice.unfavorableRejectClaim;
    } else if (hostDeclined) {
      finalVerdict = EjFinalVerdict.declinedByHost;
      verdictExplanation = "Transaction refusée par le serveur bancaire en amont. Le mécanisme de distribution n'a jamais été amorcé.";
      recommendedOperatorAction = "Aucun débit n'a été validé. Vérifier le relevé de compte et le code réponse DE39.";
      claimAdvice = EjClaimAdvice.unfavorableRejectClaim;
    } else {
      finalVerdict = EjFinalVerdict.unknown;
      verdictExplanation = "Journal partiel ou non concluant. Présence d'événements incomplets ne permettant pas d'attester de la prise ou du rejet.";
      recommendedOperatorAction = "Déclencher un audit physique du GAB et un comptage des cassettes de billets.";
      claimAdvice = EjClaimAdvice.investigationRequired;
    }

    return EjAnalysisResult(
      rawLog: rawLog,
      events: events,
      summary: EjAnalysisSummary(
        vendor: vendor,
        atmId: atmId,
        transactionCount: events.isNotEmpty ? 1 : 0,
        totalDispensedNotes: totalDispensedNotes,
        totalRequestedNotes: totalRequestedNotes,
        panDetected: panDetected,
        stanDetected: stanDetected,
        amountDetected: amountDetected,
        hasBillJam: hasBillJam,
        hasRetract: hasRetract,
        hasCardRetained: hasCardRetained,
        finalVerdict: finalVerdict,
        verdictExplanation: verdictExplanation,
        recommendedOperatorAction: recommendedOperatorAction,
        claimAdvice: claimAdvice,
      ),
    );
  }
}
