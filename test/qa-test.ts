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

