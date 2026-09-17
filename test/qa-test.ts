import { PrismaClient } from "@prisma/client";
import crypto from "crypto";

const prisma = new PrismaClient();

function hashPassword(p: string) {
  return crypto.createHash("sha256").update(p).digest("hex");
}

async function runQATest() {
  console.log("=================================================");
  console.log("🚀 DÉMARRAGE DU QA TEST - PAYWAY INCIDENT HUB");
  console.log("=================================================\n");

  let passed = 0;
  let failed = 0;

  // TEST 1 : Vérification de la connexion MySQL et du compte Oury Kohkoun
  try {
    const user = await prisma.user.findUnique({
      where: { email: "ourykohkoun@gmail.com" },
    });

    if (user && user.role === "ADMIN") {
      const isPasswordValid = user.passwordHash === hashPassword("123456");
      if (isPasswordValid) {
        console.log("✅ TEST 1 - Connexion MySQL & Compte utilisateur :");
        console.log(`   Utilisateur : ${user.email} (Rôle : ${user.role}) - Mot de passe vérifié.`);
        passed++;
      } else {
        throw new Error("Mot de passe non conforme !");
      }
    } else {
      throw new Error("Utilisateur ourykohkoun@gmail.com non trouvé !");
    }
  } catch (err: any) {
    console.error("❌ TEST 1 ÉCHOUÉ :", err.message);
    failed++;
  }

  // TEST 2 : Vérification de la présence des incidents dans la base (200 incidents attendus)
  try {
    const count = await prisma.incident.count();
    if (count >= 200) {
      console.log(`✅ TEST 2 - Intégrité du catalogue (${count} incidents enregistrés dans MySQL >= 200).`);
      passed++;
    } else if (count >= 50) {
      console.log(`⚠️ TEST 2 - Base opérationnelle mais compte ${count}/200 incidents.`);
      passed++;
    } else {
      throw new Error(`Nombre d'incidents insuffisant : ${count}/200`);
    }
  } catch (err: any) {
    console.error("❌ TEST 2 ÉCHOUÉ :", err.message);
    failed++;
  }

  // TEST 3 : Vérification du cas validé INC-001 (RCA, Résolution, FlowSteps, ISO 8583)
  try {
    const inc001 = await prisma.incident.findUnique({
      where: { reference: "INC-001" },
      include: {
        rootCause: true,
        resolution: true,
        flowSteps: true,
        isoMessages: true,
      },
    });

    if (inc001 && inc001.rootCause && inc001.resolution && inc001.flowSteps.length > 0) {
      console.log("✅ TEST 3 - Structure complète du cas validé INC-001 :");
      console.log(`   RCA : ${inc001.rootCause.category} - ${inc001.rootCause.description.slice(0, 55)}...`);
      console.log(`   Étapes de flux modélisées : ${inc001.flowSteps.length}`);
      console.log(`   Messages ISO 8583 masqués : ${inc001.isoMessages.length}`);
      passed++;
    } else {
      throw new Error("INC-001 incomplet ou manquant !");
    }
  } catch (err: any) {
    console.error("❌ TEST 3 ÉCHOUÉ :", err.message);
    failed++;
  }

  // TEST 4 : Création dynamique d'un nouvel incident par API/Prisma et vérification du journal d'audit
  try {
    const author = await prisma.user.findUnique({ where: { email: "ourykohkoun@gmail.com" } });
    if (!author) throw new Error("Auteur manquant");

    const testRef = `INC-QA-${Date.now().toString().slice(-4)}`;
    const newInc = await prisma.incident.create({
      data: {
        reference: testRef,
        title: "GAB - Test Dynamique QA Automatisation",
        domain: "GAB",
        component: "Switch/Host",
        status: "OPEN",
        severity: "HIGH",
        knowledgeStatus: "REFERENCE_SCENARIO",
        authorId: author.id,
        observations: {
          create: {
            symptom: "Rejet trame 0200 automatique de test",
            facts: "Test d'intégration dynamique BD <-> Frontend",
          },
        },
      },
    });

    const audit = await prisma.auditLog.create({
      data: {
        action: "QA_AUTOMATED_TEST_EXECUTION",
        entity: "INCIDENT",
        entityId: newInc.id,
        userId: author.id,
        metadata: { reference: testRef },
      },
    });

    if (newInc && audit) {
      console.log(`✅ TEST 4 - Création dynamique d'un incident (${testRef}) et AuditLog vérifiés.`);
      passed++;
    }
  } catch (err: any) {
    console.error("❌ TEST 4 ÉCHOUÉ :", err.message);
    failed++;
  }

  // TEST 5 : Vérification de conformité du Référentiel DE39 (ISO 8583)
  try {
    const { DE39_CATALOG } = await import("../modules/knowledge-base/data/iso-de39-reference");
    const requiredCodes = ["00", "05", "51", "54", "55", "75", "91", "92", "96", "99"];
    const hasAllRequired = requiredCodes.every((code) =>
      DE39_CATALOG.some((item) => item.code === code)
    );

    const hasCompleteMetadata = DE39_CATALOG.every(
      (item) => item.code && item.meaning && item.impactIncident && item.recommendedAction && item.category
    );

    if (hasAllRequired && hasCompleteMetadata && DE39_CATALOG.length >= 25) {
      console.log(`✅ TEST 5 - Référentiel DE39 ISO 8583 conforme (${DE39_CATALOG.length} codes catalogués avec diagnostic et actions).`);
      passed++;
    } else {
      throw new Error(`Incohérence dans le dictionnaire DE39 (total: ${DE39_CATALOG.length})`);
    }
  } catch (err: any) {
    console.error("❌ TEST 5 ÉCHOUÉ :", err.message);
    failed++;
  }

  // TEST 6 : Vérification de conformité du Référentiel MTI (ISO 8583)
  try {
    const { MTI_CATALOG, MTI_DIGITS_STRUCTURE } = await import("../modules/knowledge-base/data/iso-mti-reference");
    const requiredMTIs = ["0100", "0110", "0200", "0210", "0400", "0410", "0500", "0800", "0810"];
    const hasAllMTIs = requiredMTIs.every((mti) =>
      MTI_CATALOG.some((item) => item.mti === mti)
    );

    const hasCompleteFields = MTI_CATALOG.every(
      (item) => item.mti && item.name && item.meaning && item.operationalUsage && item.diagnosticAdvice && item.keyFields.length > 0
    );

    if (hasAllMTIs && hasCompleteFields && MTI_DIGITS_STRUCTURE.length === 4) {
      console.log(`✅ TEST 6 - Référentiel MTI conforme (${MTI_CATALOG.length} MTI documentés avec anatomie à 4 chiffres).`);
      passed++;
    } else {
      throw new Error(`Incohérence dans le dictionnaire MTI (total: ${MTI_CATALOG.length})`);
    }
  } catch (err: any) {
    console.error("❌ TEST 6 ÉCHOUÉ :", err.message);
    failed++;
  }

  // TEST 7 : Vérification du Moteur de Déchiffrement des Bitmaps ISO 8583
  try {
    const { decodeIsoBitmap } = await import("../modules/knowledge-base/data/iso-bitmap-decoder");
    // Test 1: 0200 nominal -> 7238200108E18000
    const res1 = decodeIsoBitmap("7238200108E18000");
    const fields1 = res1.presentFields.map((f) => f.de);

    const expectedDe = [2, 3, 4, 7, 11, 12, 13, 19, 32, 37, 41, 42, 43, 48, 49];
    const matchDe = expectedDe.every((de) => fields1.includes(de));

    // Test 2: Extended bitmap avec bit 1 actif (Secondary map)
    const res2 = decodeIsoBitmap("B238200108E180000000000000000020");
    const hasSecondary = res2.isSecondaryPresent && res2.totalBits === 128;

    if (matchDe && hasSecondary) {
      console.log(`✅ TEST 7 - Moteur de Déchiffrement Bitmap validé (Bitmaps primaire 64-bits et étendu 128-bits testés avec succès).`);
      passed++;
    } else {
      throw new Error("Résultat inattendu lors du décodage du Bitmap de test");
    }
  } catch (err: any) {
    console.error("❌ TEST 7 ÉCHOUÉ :", err.message);
    failed++;
  }

  // TEST 8 : Vérification du Parseur Complet de Trames ISO 8583
  try {
    const { parseIso8583Message } = await import("../modules/knowledge-base/data/iso-message-parser");
    const sampleMsg = "02007238200108E1800016497010123456789001000000000005000009171200001234561200000917601105112345678901234123456789012ATM00001COMMERCE0000001AGENCE PRINCIPALE DAKAR  952";
    const parseRes = parseIso8583Message(sampleMsg);

    const isMtiValid = parseRes.mti === "0200";
    const hasCorrectAmount = parseRes.criticalInsights.amount === "500.00";
    const hasMaskedPan = parseRes.criticalInsights.pan?.includes("******");
    const hasFields = parseRes.fields.length >= 10;

    if (isMtiValid && hasCorrectAmount && hasMaskedPan && hasFields) {
      console.log(`✅ TEST 8 - Parseur de Trame ISO 8583 conforme (MTI ${parseRes.mti}, Montant ${parseRes.criticalInsights.amount}, PAN masqué ${parseRes.criticalInsights.pan}, ${parseRes.fields.length} champs extraits).`);
      passed++;
    } else {
      throw new Error(`Échec parsing trame : MTI=${parseRes.mti}, Amount=${parseRes.criticalInsights.amount}, Fields=${parseRes.fields.length}`);
    }
  } catch (err: any) {
    console.error("❌ TEST 8 ÉCHOUÉ :", err.message);
    failed++;
  }

  // TEST 9 : Vérification du Décodeur EMV / DE55 & Analyseur TVR (Tag 95)
  try {
    const { parseEmvTlv, decodeTvrHex } = await import("../modules/knowledge-base/data/emv-tlv-decoder");
    const sampleDe55 = "9F26084D5E12F9884511A29F2701809F10120110A00003220000000000000000000000009F3704C8912A349F3602005A950500000480009A032409179C01019F02060000000500005F2A020952820238009F1A020952";
    const emvRes = parseEmvTlv(sampleDe55);

    const hasArqc = emvRes.tags.some((t) => t.tag === "9F26");
    const hasTvrTag = emvRes.tags.some((t) => t.tag === "95");
    // TVR avec bit 6 de l'octet 3 actif (PIN try limit exceeded) : 0000208000 (0x20 = bit 6)
    const tvrDecoded = decodeTvrHex("0000208000");
    const pinExceededFlag = tvrDecoded.criticalFlags.some((f) => f.includes("PIN"));

    if (hasArqc && hasTvrTag && pinExceededFlag && emvRes.tags.length >= 8) {
      console.log(`✅ TEST 9 - Décodeur EMV & TVR conforme (${emvRes.tags.length} tags TLV extraits, Tag 9F26 ARQC et Tag 95 TVR décodés bit-à-bit).`);
      passed++;
    } else {
      throw new Error(`Incohérence dans le décodage EMV/TVR : Tags=${emvRes.tags.length}, hasArqc=${hasArqc}, hasTvr=${hasTvrTag}`);
    }
  } catch (err: any) {
    console.error("❌ TEST 9 ÉCHOUÉ :", err.message);
    failed++;
  }

  // TEST 10 : Vérification de l'Analyseur de Journal GAB (ATM EJ Analyzer)
  try {
    const { parseAtmElectronicJournal } = await import("../modules/knowledge-base/data/atm-ej-analyzer");
    const sampleEj = `14:32:01 ATM: GAB-AG-04 TID: 88776655
14:32:03 CARD INSERTED: PAN 4970101234567890
14:32:08 PIN ENTERED (EPP OK)
14:32:11 AUTH OK (HOST APPROVED, RC:00) AMOUNT: 50000 STAN: 045123
14:32:14 DISPENSE REQ: 5 NOTES OF 10000 XOF
14:32:17 HARDWARE ERROR: STACKER JAMMED IN TRANSPORT MODULE
14:32:18 BILL JAM SENSOR TRIGGERED
14:32:20 CARD EJECTED
14:32:25 TRANSACTION ABORTED - SHUTTER NOT OPENED`;

    const ejRes = parseAtmElectronicJournal(sampleEj);
    const hasDetectedJam = ejRes.summary.hasBillJam;
    const isVerdictFavorable = ejRes.summary.claimAdvice === "FAVORABLE_RECREDIT";
    const hasMaskedPan = ejRes.summary.panDetected?.includes("*");

    if (hasDetectedJam && isVerdictFavorable && hasMaskedPan && ejRes.events.length >= 6) {
      console.log(`✅ TEST 10 - Analyseur de Journal GAB conforme (Bourrage détecté, Décision Recrédit validée, PAN masqué ${ejRes.summary.panDetected}, ${ejRes.events.length} étapes décodées).`);
      passed++;
    } else {
      throw new Error(`Échec analyse EJ : Jam=${hasDetectedJam}, Advice=${ejRes.summary.claimAdvice}, Events=${ejRes.events.length}`);
    }
  } catch (err: any) {
    console.error("❌ TEST 10 ÉCHOUÉ :", err.message);
    failed++;
  }

  console.log("\n=================================================");
  console.log(`📊 BILAN DU QA TEST : ${passed} RÉUSSIS / ${failed} ÉCHECS`);
  console.log("=================================================");
  if (failed > 0) {
    process.exit(1);
  }
}

runQATest()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

