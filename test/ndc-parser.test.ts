import {
  parseNdcMessage,
  normalizeNdcDelimiters,
  generateIso8583FromNdc,
  generateNdcForensicTicket,
} from "../modules/knowledge-base/data/ndc-parser";

function runNdcParserTests() {
  console.log("=================================================");
  console.log("🧪 TESTS DU DÉCODEUR DE TRAMES NDC / NDC+ (ATM/GAB)");
  console.log("=================================================\n");

  let passed = 0;
  let failed = 0;

  function assert(name: string, condition: boolean, details?: string) {
    if (condition) {
      console.log(`✅ ${name}${details ? ` : ${details}` : ""}`);
      passed++;
    } else {
      console.error(`❌ ${name} ÉCHOUÉ ${details ? ` : ${details}` : ""}`);
      failed++;
    }
  }

  // 1. Transaction Request 11 (Retrait Espèces avec Piste 2 et PIN)
  const t2hReq = "00000111\x1c143201\x1cA\x1c;4970101234567890=2812201123456789\x1c01\x1c000000050000\x1cA1B2C3D4E5F60718\x1c";
  const r1 = parseNdcMessage(t2hReq);
  assert(
    "TEST 1 - Sollicitation Retrait Espèces (T2H Class 11)",
    r1.direction === "TERMINAL_TO_HOST" &&
      r1.messageCategory === "TRANSACTION_REQUEST" &&
      r1.luno === "000" &&
      r1.criticalInsights.amount === "500.00" &&
      r1.criticalInsights.pan === "497010******7890" &&
      r1.criticalInsights.hasPinBlock === true,
    `LUNO: ${r1.luno}, Montant: ${r1.criticalInsights.amount}, PAN masqué: ${r1.criticalInsights.pan}`
  );

  // 2. Retrait EMV avec Buffer CAM (Puce Contact)
  const emvNdc = "00100211\x1c150422\x1cB\x1c;4970109988776655=2906101000000000\x1c01\x1c000000020000\x1c8899AABBCCDDEEFF\x1c9F26084D5E12F9884511A2950500000480009F3602005A";
  const r2 = parseNdcMessage(emvNdc);
  assert(
    "TEST 2 - Décodage Données EMV CAM Buffer",
    r2.criticalInsights.emvParsed !== undefined &&
      r2.criticalInsights.emvParsed.tags.length >= 3 &&
      r2.criticalInsights.emvParsed.tags.some((t) => t.tag === "9F26"),
    `${r2.criticalInsights.emvParsed?.tags.length} tags EMV extraits (ARQC, TVR, ATC)`
  );

  // 3. Alarme Non Sollicitée : Bourrage Distributeur (Bill Jam 12-D M:23 R:02)
  const alarmJam = "00000312\x1c0042\x1cD03\x1cM-STATUS:23 R-STATUS:02 STACKER_JAM";
  const r3 = parseNdcMessage(alarmJam);
  assert(
    "TEST 3 - Alarme Matérielle Bourrage Billets (12-D avec M:23 R:02)",
    r3.messageCategory === "UNSOLICITED_STATUS" &&
      r3.criticalInsights.deviceAffected === "D" &&
      r3.criticalInsights.deviceSeverity === "CRITICAL" &&
      r3.criticalInsights.hasBillJam === true &&
      r3.deviceDiagnostic?.frenchName.includes("Distributeur") &&
      r3.deviceDiagnostic?.mStatus === "23" &&
      r3.deviceDiagnostic?.rStatus === "02",
    `M-Status: ${r3.deviceDiagnostic?.mStatusDescription}, R-Status: ${r3.deviceDiagnostic?.rStatusDescription}`
  );

  // 4. Alarme Imprimante Reçus Papier Épuisé (12-F)
  const alarmPrinter = "00000412\x1c0043\x1cF01\x1cM-STATUS:32 R-STATUS:00 PAPER_OUT";
  const r4 = parseNdcMessage(alarmPrinter);
  assert(
    "TEST 4 - Alarme Imprimante Reçus (12-F)",
    r4.criticalInsights.deviceAffected === "F" &&
      r4.criticalInsights.deviceSeverity === "WARNING" &&
      r4.deviceDiagnostic?.frenchName.includes("Imprimante"),
    `Composant: ${r4.deviceDiagnostic?.frenchName}`
  );

  // 5. Bascule Mode Superviseur (12-M)
  const supervisorNdc = "00000512\x1c0044\x1cM00\x1cSUPERVISOR_KEY_TURNED_ON";
  const r5 = parseNdcMessage(supervisorNdc);
  assert(
    "TEST 5 - Détection Mode Superviseur / Maintenance (12-M)",
    r5.criticalInsights.deviceAffected === "M" &&
      r5.criticalInsights.deviceSeverity === "INFO",
    `Événement Superviseur capturé (Gravité: ${r5.criticalInsights.deviceSeverity})`
  );

  // 6. Ordre de Distribution Host to Terminal (Function Command)
  const h2tCommand = "1000\x1c005\x1c00050000\x1c1\x1cMERCI DE VOTRE VISITE - RETRAIT 50000 XOF";
  const r6 = parseNdcMessage(h2tCommand, {
    cassetteDenominations: [10000, 10000, 5000, 2000],
    currency: "XOF",
  });
  assert(
    "TEST 6 - Commande H2T Distribution & Éjection Carte",
    r6.direction === "HOST_TO_TERMINAL" &&
      r6.messageCategory === "FUNCTION_COMMAND" &&
      r6.criticalInsights.totalDispensedNotes === 5 &&
      r6.criticalInsights.totalDispensedAmount === 50000 &&
      r6.criticalInsights.cardAction === "ÉJECTER_CARTE",
    `Billets: ${r6.criticalInsights.totalDispensedNotes}, Montant: ${r6.criticalInsights.totalDispensedAmount} XOF`
  );

  // 7. Tolérance aux délimiteurs texte (^ et <FS>)
  const caretNdc = "00000111^143201^A^;4970101234567890=2812201123456789^01^000000050000^A1B2C3D4E5F60718";
  const r7 = parseNdcMessage(caretNdc);
  assert(
    "TEST 7 - Résilience Délimiteurs Carat (^)",
    r7.fields.length >= 7 && r7.criticalInsights.pan === "497010******7890",
    `${r7.fields.length} segments FS normalisés`
  );

  // 8. Recommandation d'exploitation générée
  assert(
    "TEST 8 - Recommandation d'Exploitation Automatisée",
    Boolean(r3.criticalInsights.recommendedAction) &&
      r3.criticalInsights.recommendedAction.includes("coffre"),
    `Action: ${r3.criticalInsights.recommendedAction?.slice(0, 50)}...`
  );

  // 9. Alarme Sécurité Critique : Capteur Sismique Coffre-fort (12-L M:82)
  const seismicAlarm = "00000612\x1c0045\x1cL01\x1cM-STATUS:82 R-STATUS:01 SEISMIC_ATTACK";
  const r9 = parseNdcMessage(seismicAlarm);
  assert(
    "TEST 9 - Alarme Sismique / Effraction Coffre (12-L M:82)",
    r9.criticalInsights.deviceAffected === "L" &&
      r9.criticalInsights.deviceSeverity === "CRITICAL" &&
      r9.deviceDiagnostic?.mStatusDescription?.includes("Sismique"),
    `Statut: ${r9.deviceDiagnostic?.mStatusDescription}`
  );

  // 10. Alarme Clavier Sécurisé EPP Tamper (12-K M:71)
  const eppAlarm = "00000712\x1c0046\x1cK01\x1cM-STATUS:71 R-STATUS:01 TAMPER_TRIGGERED";
  const r10 = parseNdcMessage(eppAlarm);
  assert(
    "TEST 10 - Alarme Anti-Intrusion Clavier EPP (12-K M:71)",
    r10.criticalInsights.deviceAffected === "K" &&
      r10.criticalInsights.deviceSeverity === "CRITICAL" &&
      r10.deviceDiagnostic?.mStatusDescription?.includes("Intrusion"),
    `Statut: ${r10.deviceDiagnostic?.mStatusDescription}`
  );

  // 11. Passerelle NDC ➜ ISO 8583
  const bridge = generateIso8583FromNdc(r1);
  assert(
    "TEST 11 - Générateur Passerelle NDC ➜ ISO 8583 (0200)",
    bridge !== undefined &&
      bridge.mti === "0200" &&
      bridge.de3 === "010000" &&
      bridge.de4 === "000000050000" &&
      bridge.de41 === "ATM00000",
    `Trame ISO: ${bridge?.isoRaw.slice(0, 40)}... (STAN: ${bridge?.de11})`
  );

  // 12. Rapport Forensique Markdown Ticket d'Incident
  const ticket = generateNdcForensicTicket(r3);
  assert(
    "TEST 12 - Générateur Rapport Forensique Ticket JIRA/ServiceNow",
    ticket.includes("RAPPORT D'INCIDENT FORENSIQUE") &&
      ticket.includes("INC-GAB-000") &&
      ticket.includes("Distributeur de Billets") &&
      ticket.includes("CRITICAL"),
    `Ticket généré avec succès (${ticket.length} caractères)`
  );

  // 13. Téléchargement Masque d'États (Class 2 Subclass 1)
  const stateLoad = "2000\x1cA001\x1c001\x1c002";
  const r13 = parseNdcMessage(stateLoad);
  assert(
    "TEST 13 - Configuration / Téléchargement Table d'États (State Table)",
    r13.messageCategory === "CONFIGURATION_LOAD" &&
      r13.criticalInsights.stateTable?.stateType === "A" &&
      r13.criticalInsights.stateTable?.stateDescription.includes("Lecture de Carte"),
    `État: ${r13.criticalInsights.stateTable?.stateDescription}`
  );

  // 14. Chargement de Clé Maître EPP Master Key (Class 3)
  const keyLoad = "3000\x1cA1\x1c1234567890ABCDEF1234567890ABCDEF\x1cA1B2C3";
  const r14 = parseNdcMessage(keyLoad);
  assert(
    "TEST 14 - Gestion des Clés Cryptographiques EPP (Class 3)",
    r14.messageCategory === "KEY_MANAGEMENT" &&
      r14.criticalInsights.keyManagement?.keyId === "A1" &&
      r14.criticalInsights.keyManagement?.kcv === "A1B2C3",
    `Clé: ${r14.criticalInsights.keyManagement?.keyId}, KCV: ${r14.criticalInsights.keyManagement?.kcv}`
  );

  // 15. Marche à Suivre & Runbook d'Intervention en 5 Phases (Alarme Bourrage)
  assert(
    "TEST 15 - Génération Runbook de Résolution d'Incident (5 Phases)",
    r3.deviceDiagnostic?.runbook !== undefined &&
      r3.deviceDiagnostic.runbook.phase1Security.includes("Hors-Service") &&
      r3.deviceDiagnostic.runbook.phase2Access.includes("coffre") &&
      r3.deviceDiagnostic.runbook.phase3ClearingOrRepair.includes("stacker") &&
      r3.deviceDiagnostic.runbook.phase4AuditAndCount.includes("billets") &&
      r3.deviceDiagnostic.runbook.phase5Recommissioning.includes("superviseur"),
    `Runbook généré : "${r3.deviceDiagnostic?.runbook?.title}" (${r3.deviceDiagnostic?.runbook?.estimatedDownTime})`
  );

  // 16. Alarme Shutter Bloqué (D05 M:23 R:06)
  const shutterAlarm = "00000412\x1c0043\x1cD05\x1cM-STATUS:23 R-STATUS:06 SHUTTER_FAIL_BLOCKED";
  const r16 = parseNdcMessage(shutterAlarm);
  assert(
    "TEST 16 - Alarme Volet de Présentation Shutter Bloqué & Runbook Spécifique",
    r16.deviceDiagnostic?.mStatus === "23" &&
      r16.deviceDiagnostic?.rStatus === "06" &&
      r16.deviceDiagnostic?.runbook?.title.includes("Volet") &&
      r16.deviceDiagnostic?.runbook?.phase3ClearingOrRepair.includes("volet"),
    `Runbook Shutter: ${r16.deviceDiagnostic?.runbook?.title}`
  );

  console.log("\n=================================================");
  console.log(`📊 BILAN DU TEST NDC PARSER : ${passed} RÉUSSIS / ${failed} ÉCHECS`);
  console.log("=================================================");

  if (failed > 0) {
    process.exit(1);
  }
}

runNdcParserTests();
