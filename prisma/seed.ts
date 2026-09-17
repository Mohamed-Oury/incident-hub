import { PrismaClient, Role, Severity, IncidentStatus, KnowledgeStatus, HypothesisStatus } from "@prisma/client";
import { referenceIncidents } from "../app/reference-incidents";
import crypto from "crypto";

const prisma = new PrismaClient();

function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password).digest("hex");
}

async function main() {
  console.log("Seeding database Payway Incident Hub on MySQL MAMP...");

  // 1. Création des utilisateurs
  const defaultPasswordHash = hashPassword("123456");

  const users = [
    {
      email: "ourykohkoun@gmail.com",
      name: "Oury Kohkoun (Administrateur & Expert)",
      role: Role.ADMIN,
      passwordHash: defaultPasswordHash,
    },
    {
      email: "operateur@payway.local",
      name: "Thomas Dubois (Exploitant)",
      role: Role.OPERATOR,
      passwordHash: defaultPasswordHash,
    },
    {
      email: "expert@payway.local",
      name: "Amina Diallo (Expert Monétique)",
      role: Role.EXPERT,
      passwordHash: defaultPasswordHash,
    },
    {
      email: "validateur@payway.local",
      name: "Marc Laurent (Responsable Validation)",
      role: Role.VALIDATOR,
      passwordHash: defaultPasswordHash,
    },
  ];

  for (const u of users) {
    await prisma.user.upsert({
      where: { email: u.email },
      update: {
        name: u.name,
        role: u.role,
        passwordHash: u.passwordHash,
      },
      create: {
        email: u.email,
        name: u.name,
        role: u.role,
        passwordHash: u.passwordHash,
      },
    });
  }

  const primaryUser = await prisma.user.findUnique({
    where: { email: "ourykohkoun@gmail.com" },
  });

  if (!primaryUser) {
    throw new Error("Impossible de trouver l'utilisateur principal !");
  }

  // 2. Création et insertion des 50 incidents de référence
  console.log(`Insertion des ${referenceIncidents.length} incidents de référence...`);

  for (const ref of referenceIncidents) {
    const isValidated = ref.knowledgeStatus === "VALIDATED";

    const incident = await prisma.incident.upsert({
      where: { reference: ref.reference },
      update: {
        title: ref.title,
        domain: ref.domain,
        component: ref.component,
        knowledgeStatus: isValidated ? KnowledgeStatus.VALIDATED : KnowledgeStatus.REFERENCE_SCENARIO,
        status: isValidated ? IncidentStatus.RESOLVED : IncidentStatus.OPEN,
      },
      create: {
        reference: ref.reference,
        title: ref.title,
        description: `Incident monétique de référence : ${ref.title}. Analyse et clés techniques requises : ${ref.analysisKeys}.`,
        status: isValidated ? IncidentStatus.RESOLVED : IncidentStatus.OPEN,
        severity: ref.reference.startsWith("INC-00") ? Severity.HIGH : Severity.MEDIUM,
        knowledgeStatus: isValidated ? KnowledgeStatus.VALIDATED : KnowledgeStatus.REFERENCE_SCENARIO,
        domain: ref.domain,
        channel: ref.domain === "GAB" ? "GAB/ATM" : ref.domain === "TPE" ? "TPE/POS" : ref.domain === "Carte" ? "PUCE/EMV" : "SWITCH",
        operation: "Transaction Monétique ISO 8583",
        network: "VISA / GIMAC / Mastercard",
        environment: "PRODUCTION",
        component: ref.component,
        host: "HOST-PAYWAY-SWITCH-01",
        errorCode: ref.analysisKeys.includes("DE39") ? ref.analysisKeys.match(/DE39[= ]*([0-9A-Za-z]+)/)?.[0] || "DE39" : "ISO_CODE",
        authorId: primaryUser.id,
      },
    });

    // Observations
    const obsCount = await prisma.observation.count({ where: { incidentId: incident.id } });
    if (obsCount === 0) {
      await prisma.observation.create({
        data: {
          incidentId: incident.id,
          symptom: `Dysfonctionnement constaté : ${ref.title}`,
          facts: `Transactions interrompues ou rejetées au niveau de ${ref.component}. Clés d'observation : ${ref.analysisKeys}.`,
          scope: `Périmètre impacté : Canal ${ref.domain}, composant critique ${ref.component}`,
          context: "Exploitation bancaire et monétique temps-réel",
        },
      });
    }

    // FlowSteps
    const stepCount = await prisma.flowStep.count({ where: { incidentId: incident.id } });
    if (stepCount === 0) {
      await prisma.flowStep.createMany({
        data: [
          {
            incidentId: incident.id,
            position: 1,
            source: ref.domain === "GAB" ? "GAB/ATM" : "Terminal POS",
            destination: "Frontal Payway",
            event: "Émission requête d'autorisation ISO 0200",
            status: "OK",
          },
          {
            incidentId: incident.id,
            position: 2,
            source: "Frontal Payway",
            destination: ref.component,
            event: `Routage et analyse des paramètres [${ref.analysisKeys}]`,
            status: isValidated ? "RESOLVED_STEP" : "POINT_DE_RUPTURE",
          },
          {
            incidentId: incident.id,
            position: 3,
            source: ref.component,
            destination: "Core Banking / Switch",
            event: "Transmission trame de confirmation ou acquittement",
            status: isValidated ? "OK" : "TIMEOUT_OR_REJECT",
          },
        ],
      });
    }

    // IsoMessages
    const isoCount = await prisma.isoMessage.count({ where: { incidentId: incident.id } });
    if (isoCount === 0) {
      await prisma.isoMessage.create({
        data: {
          incidentId: incident.id,
          mti: "0200",
          bitmap: "7238000008C08000",
          stan: "392014",
          rrn: "402919392014",
          responseCode: ref.analysisKeys.includes("91") ? "91" : ref.analysisKeys.includes("05") ? "05" : "96",
          terminalId: "GAB0081",
          maskedRawMessage: "02007238000008C08000164500********9124010000000500000917114512392014...",
          fields: {
            DE3: "010000",
            DE4: "50000",
            DE11: "392014",
            DE39: ref.analysisKeys.includes("91") ? "91" : "05",
            DE41: "GAB0081",
          },
        },
      });
    }

    // Hypothèses
    const hypoCount = await prisma.hypothesis.count({ where: { incidentId: incident.id } });
    if (hypoCount === 0) {
      await prisma.hypothesis.createMany({
        data: [
          {
            incidentId: incident.id,
            description: `Hypothèse 1 : Problème de connectivité réseau ou latence sur le lien vers ${ref.component}`,
            status: isValidated ? HypothesisStatus.REJECTED : HypothesisStatus.OPEN,
            evidence: "Temps de réponse pings < 15ms",
          },
          {
            incidentId: incident.id,
            description: `Hypothèse 2 : Anomalie applicative ou verrouillage interne sur ${ref.component}`,
            status: isValidated ? HypothesisStatus.CONFIRMED : HypothesisStatus.PROBABLE,
            evidence: `Concordance avec les codes d'erreur ${ref.analysisKeys}`,
          },
        ],
      });
    }

    // RCA & Résolution si validé
    if (isValidated) {
      const existingRca = await prisma.rootCause.findUnique({ where: { incidentId: incident.id } });
      if (!existingRca) {
        await prisma.rootCause.create({
          data: {
            incidentId: incident.id,
            category: "Core Banking & Base de données",
            description: `Cause racine démontrée pour ${ref.reference} : verrou bloquant prolongé durant le pic transactionnel.`,
            justification: `Les logs de sessions révèlent un blocage mutuel corrélé au pic de rejets ${ref.analysisKeys}.`,
            validatedBy: "Oury Kohkoun (Expert Monétique)",
            validatedAt: new Date(),
          },
        });
      }

      const existingRes = await prisma.resolution.findUnique({ where: { incidentId: incident.id } });
      if (!existingRes) {
        await prisma.resolution.create({
          data: {
            incidentId: incident.id,
            actions: "Recalibrage des seuils de timeout, isolation des requêtes batch hors heures de pointe.",
            executor: "Équipe Exploitation Monétique",
            approver: "Oury Kohkoun",
            result: "Rétablissement à 100% des transactions avec MTTR constaté de 45 minutes.",
          },
        });
      }
    }
  }

  // NOTE DEMANDÉE : La table AuditLog reste vide lors du seed.
  await prisma.auditLog.deleteMany({});

  console.log("Seeding MySQL terminé avec succès ! 50 incidents insérés, table AuditLog vidée.");
}

main()
  .catch((e) => {
    console.error("Erreur lors du seeding :", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
