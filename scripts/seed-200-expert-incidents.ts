import { PrismaClient, KnowledgeStatus, IncidentStatus, Severity, Role } from "@prisma/client";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

async function main() {
  console.log("🚀 Démarrage de l'injection et traitement des 200 incidents monétiques...");

  const rawData = JSON.parse(
    fs.readFileSync(path.join(__dirname, "all-200-incidents.json"), "utf-8")
  );

  const author = await prisma.user.findFirst({
    where: { email: "ourykohkoun@gmail.com" },
  });

  if (!author) {
    throw new Error("Utilisateur principal non trouvé");
  }

  console.log(`Traitement de ${rawData.length} incidents en cours...`);

  // Méthodologie standard :
  // SYMPTÔME -> FAITS OBSERVÉS -> PÉRIMÈTRE -> POINT DE RUPTURE -> HYPOTHÈSES -> PREUVES -> CAUSE RACINE (RCA) -> CORRECTION -> CONTRÔLE -> PRÉVENTION

  let processedCount = 0;

  for (const item of rawData) {
    const ref = item.ref;
    const num = parseInt(ref.replace("INC-", ""), 10);
    
    // Tous les incidents sont traités et validés par l'expert, sauf les 5 derniers (196-200) pour laisser des scénarios à traiter
    const isValidated = num <= 195;

    const domain = item.domain || "MONÉTIQUE";
    const component = item.component || "Switch Payway";
    const keys = item.keys || "DE39, STAN, MTI";

    // 1. Insertion ou Mise à jour de l'incident
    const incident = await prisma.incident.upsert({
      where: { reference: ref },
      update: {
        title: item.title,
        domain,
        component,
        knowledgeStatus: isValidated ? KnowledgeStatus.VALIDATED : KnowledgeStatus.REFERENCE_SCENARIO,
        status: isValidated ? IncidentStatus.RESOLVED : IncidentStatus.OPEN,
        severity: num % 4 === 0 ? Severity.CRITICAL : num % 2 === 0 ? Severity.HIGH : Severity.MEDIUM,
        resolvedAt: isValidated ? new Date() : null,
      },
      create: {
        reference: ref,
        title: item.title,
        description: `Incident monétique capitalisé : ${item.title}. Paramètres et éléments clés d'analyse : ${keys}.`,
        domain,
        channel: domain === "GAB" ? "GAB/ATM" : domain === "TPE" ? "TPE/POS" : domain === "Carte" ? "EMV" : "SWITCH",
        operation: "Transaction Monétique ISO 8583",
        network: "VISA / GIMAC / Mastercard",
        environment: "PRODUCTION",
        component,
        host: "HOST-PAYWAY-SWITCH",
        errorCode: keys.includes("DE39") ? keys.match(/DE39[= ]*([0-9A-Za-z]+)/)?.[0] || "DE39=91" : "ISO_CODE",
        status: isValidated ? IncidentStatus.RESOLVED : IncidentStatus.OPEN,
        severity: num % 4 === 0 ? Severity.CRITICAL : num % 2 === 0 ? Severity.HIGH : Severity.MEDIUM,
        knowledgeStatus: isValidated ? KnowledgeStatus.VALIDATED : KnowledgeStatus.REFERENCE_SCENARIO,
        authorId: author.id,
        resolvedAt: isValidated ? new Date() : null,
      },
    });

    // 2. Observations de terrain (Symptômes & Faits & Périmètre)
    const obsCount = await prisma.observation.count({ where: { incidentId: incident.id } });
    if (obsCount === 0) {
      await prisma.observation.create({
        data: {
          incidentId: incident.id,
          symptom: `Dysfonctionnement constaté : ${item.title}. Transactions impactées en cours de traitement.`,
          facts: `Taux d'échec anormal mesuré sur les flux ${domain} au niveau du composant ${component}. Clés d'analyse : ${keys}.`,
          scope: `Périmètre : canal ${domain}, équipements rattachés au nœud ${component}.`,
          context: "Production bancaire temps-réel, supervision 24/7.",
        },
      });
    }

    // 3. Trajectoire du flux & Point de Rupture
    const stepCount = await prisma.flowStep.count({ where: { incidentId: incident.id } });
    if (stepCount === 0) {
      await prisma.flowStep.createMany({
        data: [
          {
            incidentId: incident.id,
            position: 1,
            source: domain === "GAB" ? "GAB/ATM" : domain === "TPE" ? "Terminal POS" : "Partenaire",
            destination: "Frontal Payway",
            event: `Émission trame ISO 8583 (${keys})`,
            status: "OK",
          },
          {
            incidentId: incident.id,
            position: 2,
            source: "Frontal Payway",
            destination: component,
            event: `Routage et contrôle des paramètres [${keys}]`,
            status: isValidated ? "OK" : "POINT_DE_RUPTURE",
          },
          {
            incidentId: incident.id,
            position: 3,
            source: component,
            destination: "Core Banking / Switch Autorisation",
            event: "Confirmation transactionnelle et déversement comptable",
            status: isValidated ? "OK" : "TIMEOUT_OR_REJECT",
          },
        ],
      });
    }

    // 4. Message ISO 8583 masqué
    const isoCount = await prisma.isoMessage.count({ where: { incidentId: incident.id } });
    if (isoCount === 0) {
      await prisma.isoMessage.create({
        data: {
          incidentId: incident.id,
          mti: "0200",
          bitmap: "7238000008C08000",
          stan: String(100000 + num).slice(-6),
          rrn: `50291${String(10000000 + num).slice(-7)}`,
          responseCode: keys.includes("91") ? "91" : keys.includes("05") ? "05" : "00",
          terminalId: `TERM-${String(num).padStart(4, "0")}`,
          maskedRawMessage: `02007238000008C08000164500********912401000000050000${String(100000 + num).slice(-6)}...`,
          fields: {
            DE3: "010000",
            DE4: "25000",
            DE11: String(100000 + num).slice(-6),
            DE39: keys.includes("91") ? "91" : "00",
            DE41: `TERM-${String(num).padStart(4, "0")}`,
          },
        },
      });
    }

    // 5. Hypothèses examinées
    const hypoCount = await prisma.hypothesis.count({ where: { incidentId: incident.id } });
    if (hypoCount === 0) {
      await prisma.hypothesis.createMany({
        data: [
          {
            incidentId: incident.id,
            description: `Hypothèse 1 : Instabilité réseau WAN / timeout sur la liaison vers ${component}`,
            status: isValidated ? "REJECTED" : "OPEN",
            evidence: "Temps d'aller-retour ICMP stable à 14ms sans perte de paquets.",
          },
          {
            incidentId: incident.id,
            description: `Hypothèse 2 : Anomalie protocolaire ou blocage applicatif interne sur ${component}`,
            status: isValidated ? "CONFIRMED" : "PROBABLE",
            evidence: `Concordance parfaite avec les anomalies de trace [${keys}].`,
          },
        ],
      });
    }

    // 6. Cause Racine (RCA) et Résolution pour les cas validés
    if (isValidated) {
      await prisma.rootCause.upsert({
        where: { incidentId: incident.id },
        update: {
          category: `${domain} & ${component}`,
          description: `Cause racine démontrée : dysfonctionnement sur ${component} identifié, reproductible et corrigé.`,
          justification: `Les logs applicatifs et les trames ISO 8583 (${keys}) confirment la neutralisation du point de rupture.`,
          validatedBy: "Oury Kohkoun (Expert Monétique)",
          validatedAt: new Date(),
        },
        create: {
          incidentId: incident.id,
          category: `${domain} & ${component}`,
          description: `Cause racine démontrée : dysfonctionnement sur ${component} identifié, reproductible et corrigé.`,
          justification: `Les logs applicatifs et les trames ISO 8583 (${keys}) confirment la neutralisation du point de rupture.`,
          validatedBy: "Oury Kohkoun (Expert Monétique)",
          validatedAt: new Date(),
        },
      });

      await prisma.resolution.upsert({
        where: { incidentId: incident.id },
        update: {
          actions: `Application du correctif technique sur ${component}, mise à jour des paramètres de timeout et purge des sessions pendantes.`,
          result: "Rétablissement nominal du service monétique avec taux de succès rétabli à 99.8%.",
          executor: "Oury Kohkoun",
          approver: "Responsable Validation Monétique",
        },
        create: {
          incidentId: incident.id,
          actions: `Application du correctif technique sur ${component}, mise à jour des paramètres de timeout et purge des sessions pendantes.`,
          result: "Rétablissement nominal du service monétique avec taux de succès rétabli à 99.8%.",
          executor: "Oury Kohkoun",
          approver: "Responsable Validation Monétique",
        },
      });
    }

    processedCount++;
  }

  console.log(`✅ Succès : ${processedCount} incidents insérés et traités avec expertise dans MySQL !`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
