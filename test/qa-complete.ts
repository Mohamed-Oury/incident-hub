import { CBS_DOMAINS, CBS_EOD_STEPS, CBS_DB_ERRORS, CBS_UNIX_COMMANDS, CBS_INCIDENTS, CBS_QUIZ } from "../modules/cbs/cbs-data";
import { CBS_SCHEMA_TABLES, CBS_SQL_PLAYBOOKS, CBS_BATCH_DIAGNOSTICS, CBS_LOG_RULES, CBS_RECONCILIATION_DATA } from "../modules/cbs/cbs-advanced-data";
import { DE39_CATALOG } from "../modules/knowledge-base/data/iso-de39-reference";
import { MTI_CATALOG } from "../modules/knowledge-base/data/iso-mti-reference";
import { decodeIsoBitmap } from "../modules/knowledge-base/data/iso-bitmap-decoder";
import { parseIso8583Message } from "../modules/knowledge-base/data/iso-message-parser";
import { parseEmvTlv, decodeTvrHex } from "../modules/knowledge-base/data/emv-tlv-decoder";
import { parseAtmElectronicJournal } from "../modules/knowledge-base/data/atm-ej-analyzer";
import { CBS_4GL_GRADES, CBS_4GL_LESSONS, CBS_4GL_EXAMS } from "../modules/cbs/cbs-4gl-data";
import { CBS_4GL_KEYWORDS_CHEAT_SHEET } from "../modules/cbs/cbs-4gl-cheat-sheet";
import { CBS_4GL_PER_COURSES } from "../modules/cbs/cbs-4gl-per-screens-data";

import { MONETIQUE_GRADES, MONETIQUE_LESSONS } from "../modules/training-monetique/data";
import { MONETIQUE_EXAMS } from "../modules/training-monetique/exams-data";
import { referenceIncidents } from "../app/reference-incidents";
import { computeEmvCryptograms } from "../modules/crypto/emv-arqc";
import { generateCopilotPlan, review4GlCode, analyzeCbsFailure } from "../modules/cbs/copilot/engine";

function runQaAll() {
  console.log("=================================================");
  console.log("🚀 QA TEST GLOBAL (MONÉTIQUE & CBS AMPLITUDE WEB)");
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

  // --- VOLET MONÉTIQUE ---
  assert("TEST 1 - Référentiel DE39 ISO 8583", DE39_CATALOG.length >= 25, `${DE39_CATALOG.length} codes catalogués`);
  assert("TEST 2 - Référentiel MTI ISO 8583", MTI_CATALOG.length >= 15, `${MTI_CATALOG.length} MTI documentés`);
  
  const bitmapRes = decodeIsoBitmap("7238200108E18000");
  assert("TEST 3 - Déchiffrement Bitmap Primaire", bitmapRes.presentFields.length >= 10, `${bitmapRes.presentFields.length} champs détectés`);

  const sampleIso = "02007238200108E1800016497010123456789001000000000005000009171200001234561200000917601105112345678901234123456789012ATM00001COMMERCE0000001AGENCE PRINCIPALE DAKAR  952";
  const parsedIso = parseIso8583Message(sampleIso);
  assert("TEST 4 - Parseur Trame ISO 8583", parsedIso.mti === "0200" && parsedIso.criticalInsights.amount === "500.00", `MTI ${parsedIso.mti}, Montant ${parsedIso.criticalInsights.amount}`);

  const sampleDe55 = "9F26084D5E12F9884511A29F2701809F10120110A00003220000000000000000000000009F3704C8912A349F3602005A950500000480009A032409179C01019F02060000000500005F2A020952820238009F1A020952";
  const emvRes = parseEmvTlv(sampleDe55);
  const tvrRes = decodeTvrHex("0000208000");
  assert("TEST 5 - Décodeur EMV TLV & TVR (Tag 95)", emvRes.tags.length >= 8 && tvrRes.criticalFlags.some(f => f.includes("PIN")), `${emvRes.tags.length} tags TLV, TVR décodé bit-à-bit`);

  const sampleEj = `14:32:01 ATM: GAB-AG-04 TID: 88776655\n14:32:03 CARD INSERTED: PAN 4970101234567890\n14:32:17 HARDWARE ERROR: STACKER JAMMED IN TRANSPORT MODULE\n14:32:25 TRANSACTION ABORTED - SHUTTER NOT OPENED`;
  const ejRes = parseAtmElectronicJournal(sampleEj);
  assert("TEST 6 - Analyseur Journal GAB (ATM EJ)", ejRes.summary.hasBillJam && ejRes.summary.claimAdvice === "FAVORABLE_RECREDIT", `Bourrage détecté, Décision ${ejRes.summary.claimAdvice}`);
  assert("TEST 6 bis - Base de Connaissance Monétique (1000 incidents résolus)", referenceIncidents.length === 1000 && referenceIncidents.every(i => i.knowledgeStatus === "VALIDATED"), `${referenceIncidents.length} incidents monétiques capitalisés & résolus`);

  // --- VOLET CBS AMPLITUDE FONDAMENTAL ---
  assert("TEST 7 - Référentiel Domaines Métier CBS", CBS_DOMAINS.length === 8, `${CBS_DOMAINS.length} domaines métier Amplitude`);
  assert("TEST 8 - Chaîne Batch EOD / BOD", CBS_EOD_STEPS.length === 10, `${CBS_EOD_STEPS.length} étapes EOD séquencées`);
  assert("TEST 9 - Base Erreurs SGBD Oracle & Informix", CBS_DB_ERRORS.length >= 7, `${CBS_DB_ERRORS.length} erreurs SGBD maîtresses documentées`);
  assert("TEST 10 - Commandes Système AIX/Unix", CBS_UNIX_COMMANDS.length === 120, `${CBS_UNIX_COMMANDS.length} commandes répertoriées`);
  assert("TEST 11 - Catalogue Incidents & RCA CBS", CBS_INCIDENTS.length === 200, `${CBS_INCIDENTS.length} fiches incidents RCA`);
  assert("TEST 12 - Questions Examen CBS Academy", CBS_QUIZ.length === 240, `${CBS_QUIZ.length} QCM interactifs`);

  // --- NOUVEAUX MODULES CBS AVANCÉS ---
  assert("TEST 13 - Scénarios de Diagnostic de Blocage EOD", CBS_BATCH_DIAGNOSTICS.length >= 4, `${CBS_BATCH_DIAGNOSTICS.length} scénarios d'urgence configurés`);
  assert("TEST 14 - Playbooks & Requêtes SQL SGBD", CBS_SQL_PLAYBOOKS.length >= 5, `${CBS_SQL_PLAYBOOKS.length} requêtes d'exploitation prêtes à l'emploi`);
  assert("TEST 15 - Réconciliation & Compensation Monétique ↔ CBS", CBS_RECONCILIATION_DATA.length >= 4, `${CBS_RECONCILIATION_DATA.length} cas de clearing validés`);
  assert("TEST 16 - Moteur de Décodage de Logs Amplitude", CBS_LOG_RULES.length >= 5, `${CBS_LOG_RULES.length} signatures de logs reconnues`);
  assert("TEST 17 - Dictionnaire de Schéma Tables Amplitude", CBS_SCHEMA_TABLES.length >= 200, `${CBS_SCHEMA_TABLES.length} tables centrales documentées`);
  assert("TEST 18 - Échelle des 5 Grades 4GL Core Banking", CBS_4GL_GRADES.length === 5 && CBS_4GL_GRADES.every(g => g.recommendedResources && g.recommendedResources.length >= 5), `${CBS_4GL_GRADES.length} niveaux de certification avec ressources documentaires enrichies`);
  assert("TEST 19 - Modules de Cours Informix 4GL Détaillés", CBS_4GL_LESSONS.length >= 23, `${CBS_4GL_LESSONS.length} chapitres de formation approfondis (incluant 5 leçons écrans .per)`);
  assert("TEST 20 - Banque d'Examens de Passage de Grade CBS 4GL", CBS_4GL_EXAMS.length >= 75 && [1, 2, 3, 4, 5].every(lvl => CBS_4GL_EXAMS.filter(q => q.gradeLevel === lvl).length >= 15), `${CBS_4GL_EXAMS.length} questions officielles (au moins 15 questions par grade)`);
  assert("TEST 21 - Fiche Mémento Mots-Clés Informix 4GL", CBS_4GL_KEYWORDS_CHEAT_SHEET.length >= 200, `${CBS_4GL_KEYWORDS_CHEAT_SHEET.length} cartes de révision détaillées`);
  assert("TEST 21 bis - Cursus Dédié Conception Écrans .per (Form-4GL)", CBS_4GL_PER_COURSES.length === 4 && CBS_4GL_PER_COURSES.every(c => c.perSourceCode.length > 0 && c.terminalMockup.length > 0), `${CBS_4GL_PER_COURSES.length} cours exhaustifs Débutant à Expert avec masques, 4GL, VT100 et form4gl`);

  // --- NOUVEAU CURSUS FORMATION & CERTIFICATION MONÉTIQUE (150 EXAMENS) ---
  assert("TEST 22 - Cursus Monétique 5 Niveaux de Qualification", MONETIQUE_GRADES.length === 5 && MONETIQUE_GRADES.every(g => g.recommendedResources && g.recommendedResources.length >= 3), `${MONETIQUE_GRADES.length} grades monétique avec normes & specs`);
  assert("TEST 23 - Leçons Techniques Approfondies Monétique", MONETIQUE_LESSONS.length >= 14, `${MONETIQUE_LESSONS.length} leçons de haut niveau (incluant ARQC/ARPC, Schemes UPI/GIM et Runbook)`);
  assert("TEST 24 - Banque d'Exercices Monétique (150 examens au total, 30/grade)", 
    MONETIQUE_EXAMS.length === 150 && [1, 2, 3, 4, 5].every(lvl => MONETIQUE_EXAMS.filter(q => q.gradeLevel === lvl).length === 30),
    `${MONETIQUE_EXAMS.length} questions réparties en exactement 30 questions par grade (1 à 5)`
  );

  // --- CRYPTOGRAPHIE EMV ARQC / ARPC ---
  const arqcRes = computeEmvCryptograms({
    pan: "4970101234567890",
    panSequenceNumber: "01",
    amountAuth: "000000050000",
    amountOther: "000000000000",
    terminalCountryCode: "0952",
    tvr: "0000008000",
    transactionCurrencyCode: "0952",
    transactionDate: "260922",
    transactionType: "01",
    unpredictableNumber: "9A1B2C3D",
    applicationTransactionCounter: "004A",
    mkAcHex: "0123456789ABCDEFFEDCBA9876543210",
  });
  assert("TEST 25 - Moteur Cryptographique ARQC / ARPC & Clés EMV", 
    arqcRes.arqcHex.length === 16 && arqcRes.arpcHex.length === 16 && arqcRes.verificationStatus === "VERIFIED",
    `ARQC ${arqcRes.arqcHex}, ARPC ${arqcRes.arpcHex}, Statut ${arqcRes.verificationStatus}`
  );

  // --- CBS 4GL DEVELOPMENT COPILOT ---
  const copilotPlan = generateCopilotPlan({
    title: "Consultation du solde compte client",
    functionalDescription: "Permettre au gestionnaire de consulter le solde disponible et l historique d un compte.",
    bankingDomain: "Comptes & Relation Client",
    targetUsers: "Gestionnaire de compte",
    knownBusinessRules: "Contrôle d existence et contrôle d habilitation",
    inputData: "Numéro de compte",
    expectedOutput: "Solde et mouvements",
    specialConstraints: "Temps < 300ms",
    amplitudeVersion: "v11.x",
    technicalEnvironment: "Informix / AIX",
    nominalExample: "Compte 001001234567",
    errorExample: "Compte inexistant",
  });
  assert("TEST 26 - CBS 4GL Development Copilot (Plan, Sous-tâches, 4GL, .per, SQL, Tests)",
    copilotPlan.subTasks.length >= 5 &&
    copilotPlan.code4GlProposal.code4Gl.includes("MAIN") &&
    copilotPlan.perScreen !== null &&
    copilotPlan.testCases.length >= 4 &&
    copilotPlan.deliveryPackage.rollbackPlan.length >= 3,
    `${copilotPlan.subTasks.length} sous-tâches ordonnées, code 4GL, masque .per, SQL, ${copilotPlan.testCases.length} tests et plan de rollback`
  );

  // --- CBS COPILOT ADVANCED (REVUE 4GL, DIAGNOSTIC RUN, DICTIONNAIRE BD) ---
  const reviewRes = review4GlCode("MAIN\nSELECT sol FROM bkcpt WHERE ncp = v_ncp\nBEGIN WORK\nDELETE FROM bkcpt\nEND MAIN");
  const failRes = analyzeCbsFailure("SQLCA.SQLCODE = -143 deadlock on bkcpt");
  const hasBkTables = ["BKCPT", "BKCLI", "BKTRA", "BKCOM"].every((tbl) =>
    CBS_SCHEMA_TABLES.some((t) => t.tableName === tbl)
  );

  assert("TEST 27 - Copilot Modules (Revue 4GL, Diagnostic RUN & Dictionnaire BD)",
    reviewRes.length >= 2 &&
    failRes.rootCause.includes("verrouillage") &&
    hasBkTables,
    `Revue détecte ${reviewRes.length} anomalies, RCA deadlock validée, tables BKCPT/BKCLI/BKTRA/BKCOM connectées`
  );

  console.log("\n=================================================");
  console.log(`📊 RÉSULTAT QA TEST : ${passed} RÉUSSIS / ${failed} ÉCHECS`);
  console.log("=================================================");

  if (failed > 0) {
    process.exit(1);
  }
}

runQaAll();

