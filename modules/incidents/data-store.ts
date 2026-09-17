import { prisma } from "@/lib/prisma";
import { referenceIncidents } from "@/app/reference-incidents";
import { IncidentRecord } from "./types";

// Scénarios enrichis pour INC-001 et INC-002 issus du cahier des charges
const DETAILED_CASES: Record<string, Partial<IncidentRecord>> = {
  "INC-001": {
    reference: "INC-001",
    title: "GAB - Retraits en échec suite à timeout CBS / lock ACCOUNT",
    description: "Échecs répétés de retraits GAB sur l'agence principale lors du pic d'affluence. Les clients subissent des rejets avec code retour 91 (Issuer timeout) consécutif à un verrouillage de tables sur le CBS.",
    status: "RESOLVED",
    severity: "CRITICAL",
    knowledgeStatus: "VALIDATED",
    domain: "GAB",
    channel: "GAB/ATM",
    operation: "Retrait d'espèces",
    network: "VISA / Interbancaire",
    environment: "PRODUCTION",
    component: "CBS/DB",
    host: "HOST-CBS-01",
    errorCode: "DE39=91",
    observations: [
      {
        symptom: "Rejets systématiques avec DE39=91 (Émetteur inaccessible / Timeout) et absence de délivrance de cash.",
        facts: "Plus de 140 transactions rejetées en 25 minutes entre 11h45 et 12h10 sur les GAB du réseau.",
        scope: "Tous les GAB de la région Nord rattachés au frontal Host CBS-01.",
        context: "Exécution simultanée d'un traitement batch d'arrêtés comptables imprévu en plein pic transactionnel.",
      },
    ],
    flowSteps: [
      { position: 1, source: "GAB/ATM", destination: "Payway Frontal", event: "ISO 0200 Demande d'autorisation de retrait (DE4=50000 XAF)", status: "OK" },
      { position: 2, source: "Payway Frontal", destination: "Host Switch", event: "Routage vers CBS Core Banking", status: "OK" },
      { position: 3, source: "Host Switch", destination: "CBS Database", event: "SELECT FOR UPDATE sur table ACCOUNTS", status: "TIMEOUT_BLOCKED" },
      { position: 4, source: "Host Switch", destination: "Payway Frontal", event: "ISO 0210 Réponse générée par Switch (DE39=91 Timeout)", status: "ERROR" },
      { position: 5, source: "Payway Frontal", destination: "GAB/ATM", event: "Affichage Abandon Client + Éjection Carte", status: "COMPLETED" },
    ],
    isoMessages: [
      {
        mti: "0200",
        bitmap: "7238000008C08000",
        stan: "492014",
        rrn: "426114892014",
        responseCode: "00",
        terminalId: "ATM09121",
        maskedRawMessage: "02007238000008C08000164500********9124010000000500000917114512492014...",
        fields: { DE3: "010000", DE4: "50000", DE11: "492014", DE41: "ATM09121" },
      },
      {
        mti: "0210",
        bitmap: "7238000008C08000",
        stan: "492014",
        rrn: "426114892014",
        responseCode: "91",
        terminalId: "ATM09121",
        maskedRawMessage: "02107238000008C08000164500********912401000000050000091711453549201491...",
        fields: { DE3: "010000", DE4: "50000", DE11: "492014", DE39: "91", DE41: "ATM09121" },
      },
    ],
    hypotheses: [
      { description: "Coupure liaison réseau WAN entre Payway et le Host CBS", status: "REJECTED", evidence: "Pings réguliers et requêtes écho test 0800 stables à 12ms." },
      { description: "Verrou exclusif (Row Lock) prolongé sur la table COMPTES bloquant les autorisations de solde", status: "CONFIRMED", evidence: "Dump des sessions Oracle montrant un lock en cascade provoqué par le job BATCH_INTEREST_CALC." },
    ],
    evidence: [
      { type: "Log Host", content: "ORA-00054: resource busy and acquire with NOWAIT specified or timeout expired", source: "Oracle Alert Log CBS" },
      { type: "Capture Trame", content: "DE39=91 généré localement par le switch à t=30000ms après expiration du timer d'attente réponse CBS", source: "Wireshark Host Switch" },
    ],
    rootCause: {
      category: "Base de données CBS / Ordonnancement",
      description: "Lancement non coordonné d'un script SQL de maintenance d'intérêts périodiques qui posait un verrou de table exclusif durant 4 minutes.",
      justification: "Corrélé directement avec les timestamps d'apparition et de disparition des DE39=91.",
      validatedAt: "2026-09-15T14:30:00Z",
      validatedBy: "Marc Laurent (Responsable Validation)",
    },
    resolution: {
      actions: "Arrêt immédiat de la session bloquante PID 4812, recalibrage des fenêtres de batch hors heures ouvrées (02h00 du matin).",
      executor: "Thomas Dubois (Exploitant)",
      approver: "Amina Diallo (Expert)",
      result: "Reprise nominale immédiate des autorisations GAB avec temps de réponse < 450ms.",
    },
    prevention: [
      { action: "Ajout d'une alerte Prometheus sur les sessions de lock DB > 5 secondes", owner: "Équipe Infra DB", priority: "HIGH", status: "DONE" },
      { action: "Interdiction des batchs de recalcul en production entre 07h00 et 22h00", owner: "Ordonnancement IT", priority: "CRITICAL", status: "DONE" },
    ],
  },
  "INC-002": {
    reference: "INC-002",
    title: "GAB - DE39=91 massif avec timeout côté Issuer",
    description: "Rejet généralisé des demandes de retrait émanant de porteurs d'une banque partenaire suite à l'effondrement du service d'autorisation de l'Issuer.",
    status: "RESOLVED",
    severity: "HIGH",
    knowledgeStatus: "VALIDATED",
    domain: "GAB",
    channel: "GAB/ATM",
    operation: "Retrait Confrère",
    network: "GIMAC / Switch Régional",
    environment: "PRODUCTION",
    component: "Issuer/DB",
    host: "HOST-SWITCH-REGIONAL",
    errorCode: "DE39=91",
    observations: [
      {
        symptom: "Rejets DE39=91 pour toutes les cartes commençant par le BIN 528412.",
        facts: "98% d'échec sur les cartes de l'émetteur BANQUE-X, transactions autres banques 100% fonctionnelles.",
        scope: "Ensemble du parc GAB pour les porteurs du BIN spécifique.",
        context: "Incident survenu après une mise à jour applicative chez l'Émetteur distant.",
      },
    ],
    flowSteps: [
      { position: 1, source: "GAB", destination: "Payway", event: "ISO 0200 Demande retrait", status: "OK" },
      { position: 2, source: "Payway", destination: "Switch National", event: "Routage selon BIN vers Issuer", status: "OK" },
      { position: 3, source: "Switch National", destination: "Issuer Distant", event: "Aucune réponse à l'expiration du délai 25s", status: "TIMEOUT" },
      { position: 4, source: "Payway", destination: "GAB", event: "Retour 0210 avec DE39=91", status: "COMPLETED" },
    ],
    isoMessages: [
      {
        mti: "0200",
        bitmap: "7238000008C08000",
        stan: "109823",
        rrn: "502918109823",
        responseCode: "91",
        terminalId: "GAB-CENTRAL-01",
        maskedRawMessage: "02007238000008C0800016528412******901201000000020000...",
        fields: { DE3: "010000", DE4: "20000", DE11: "109823", DE39: "91" },
      },
    ],
    hypotheses: [
      { description: "Panne de notre raccordement au switch national", status: "REJECTED", evidence: "Les autorisations des autres banques passent nominalement." },
      { description: "Crash du service frontal d'autorisation de la banque émettrice", status: "CONFIRMED", evidence: "Confirmation formelle de l'incident majeur par le NOC de la banque émettrice." },
    ],
    evidence: [
      { type: "Mail NOC", content: "Incident d'inaccessibilité de notre plateforme d'autorisation consécutif à la bascule DC", source: "NOC Banque Émettrice" },
    ],
    rootCause: {
      category: "Partenaire Externe / Émetteur",
      description: "Indisponibilité du frontal d'autorisation de l'émetteur distant.",
      justification: "Tous les flux émis vers ce BIN terminent en timeout côté switch émetteur.",
      validatedAt: "2026-09-16T10:15:00Z",
      validatedBy: "Amina Diallo (Expert Monétique)",
    },
    resolution: {
      actions: "Activation du fallback de filtrage amont pour avertir les porteurs de la banque sur écran GAB.",
      executor: "Exploitation Monétique",
      approver: "Marc Laurent",
      result: "Rétablissement après redémarrage du frontal de la banque partenaire.",
    },
    prevention: [
      { action: "Mise en place d'un seuil de détection automatique des taux d'échec par BIN", owner: "Équipe Monitoring", priority: "MEDIUM", status: "DONE" },
    ],
  },
};

export async function getAllIncidents(): Promise<IncidentRecord[]> {
  try {
    // Essayer de lire depuis Prisma / MySQL
    const dbIncidents = await prisma.incident.findMany({
      include: {
        author: true,
        observations: true,
        flowSteps: { orderBy: { position: "asc" } },
        isoMessages: true,
        hypotheses: true,
        evidence: true,
        rootCause: true,
        resolution: true,
        prevention: true,
      },
      orderBy: { reference: "asc" },
    });

    if (dbIncidents.length > 0) {
      return dbIncidents.map((inc) => ({
        id: inc.id,
        reference: inc.reference,
        title: inc.title,
        description: inc.description || "",
        status: inc.status as any,
        severity: inc.severity as any,
        knowledgeStatus: inc.knowledgeStatus as any,
        domain: inc.domain || "",
        channel: inc.channel || "",
        operation: inc.operation || "",
        network: inc.network || "",
        environment: inc.environment || "PRODUCTION",
        component: inc.component || "",
        host: inc.host || "",
        errorCode: inc.errorCode || "",
        occurredAt: inc.occurredAt?.toISOString(),
        resolvedAt: inc.resolvedAt?.toISOString(),
        authorId: inc.authorId,
        authorName: inc.author?.name || "Opérateur",
        createdAt: inc.createdAt.toISOString(),
        updatedAt: inc.updatedAt.toISOString(),
        observations: inc.observations.map((o) => ({
          symptom: o.symptom,
          facts: o.facts,
          scope: o.scope || undefined,
          context: o.context || undefined,
        })),
        flowSteps: inc.flowSteps.map((f) => ({
          position: f.position,
          source: f.source,
          destination: f.destination,
          event: f.event,
          status: f.status || undefined,
        })),
        isoMessages: inc.isoMessages.map((m) => ({
          mti: m.mti || undefined,
          bitmap: m.bitmap || undefined,
          stan: m.stan || undefined,
          rrn: m.rrn || undefined,
          responseCode: m.responseCode || undefined,
          terminalId: m.terminalId || undefined,
          maskedRawMessage: m.maskedRawMessage || undefined,
          fields: (m.fields as any) || undefined,
        })),
        hypotheses: inc.hypotheses.map((h) => ({
          description: h.description,
          status: h.status as any,
          evidence: h.evidence || undefined,
        })),
        evidence: inc.evidence.map((e) => ({
          type: e.type,
          content: e.content,
          source: e.source || undefined,
        })),
        rootCause: inc.rootCause ? {
          category: inc.rootCause.category,
          description: inc.rootCause.description,
          justification: inc.rootCause.justification,
          validatedAt: inc.rootCause.validatedAt?.toISOString(),
          validatedBy: inc.rootCause.validatedBy || undefined,
        } : null,
        resolution: inc.resolution ? {
          actions: inc.resolution.actions,
          executor: inc.resolution.executor || undefined,
          approver: inc.resolution.approver || undefined,
          result: inc.resolution.result || undefined,
        } : null,
        prevention: inc.prevention.map((p) => ({
          action: p.action,
          owner: p.owner || undefined,
          priority: p.priority || undefined,
          status: p.status || undefined,
        })),
      }));
    }
  } catch (err) {
    // Si la BD n'a pas encore été migrée ou démarre, fallback en mémoire sur le catalogue complet
    console.warn("Prisma/MySQL fallback vers dataset en mémoire:", err instanceof Error ? err.message : String(err));
  }

  // Source de données résiliente : les 50 incidents de référence documentés
  return referenceIncidents.map((ref) => {
    const detailed = DETAILED_CASES[ref.reference];
    return {
      id: ref.reference,
      reference: ref.reference,
      title: ref.title,
      description: detailed?.description || `Scénario de référence pour l'analyse d'incident : ${ref.title}. Clés d'analyse : ${ref.analysisKeys}`,
      status: (detailed?.status || (ref.knowledgeStatus === "VALIDATED" ? "RESOLVED" : "OPEN")) as any,
      severity: (detailed?.severity || (ref.reference.startsWith("INC-00") ? "HIGH" : "MEDIUM")) as any,
      knowledgeStatus: ref.knowledgeStatus,
      domain: ref.domain,
      channel: ref.domain === "GAB" ? "GAB/ATM" : ref.domain === "TPE" ? "TPE/POS" : "SWITCH",
      operation: "Transaction Monétique",
      network: "VISA / GIMAC",
      environment: "PRODUCTION",
      component: ref.component,
      host: "HOST-PAYWAY",
      errorCode: ref.analysisKeys.includes("DE39") ? ref.analysisKeys.match(/DE39[= ]*([0-9A-Za-z]+)/)?.[0] || "DE39" : "ISO_ERR",
      occurredAt: new Date(Date.now() - 3600000 * 24).toISOString(),
      resolvedAt: ref.knowledgeStatus === "VALIDATED" ? new Date().toISOString() : undefined,
      authorId: "usr-operator-01",
      authorName: "Équipe Exploitation",
      createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
      updatedAt: new Date().toISOString(),
      observations: detailed?.observations || [
        {
          symptom: `Anomalie constatée : ${ref.title}`,
          facts: `Transactions rejetées ou bloquées au niveau de ${ref.component}. Clés d'observation : ${ref.analysisKeys}.`,
          scope: `Périmètre impacté : canal ${ref.domain}`,
          context: "Exploitation quotidienne monétique",
        },
      ],
      flowSteps: detailed?.flowSteps || [
        { position: 1, source: "Terminal/Acquéreur", destination: "Payway Frontal", event: "ISO Demande d'autorisation", status: "OK" },
        { position: 2, source: "Payway Frontal", destination: ref.component, event: "Acheminement transaction", status: "POINT_DE_RUPTURE" },
      ],
      isoMessages: detailed?.isoMessages || [
        {
          mti: "0200",
          bitmap: "7238000008C08000",
          stan: "001245",
          rrn: "502918001245",
          responseCode: ref.analysisKeys.includes("91") ? "91" : "05",
          terminalId: "TERM001",
          maskedRawMessage: "0200************************************",
        },
      ],
      hypotheses: detailed?.hypotheses || [
        { description: `Analyse préliminaire sur le composant ${ref.component}`, status: "OPEN" },
      ],
      evidence: detailed?.evidence || [],
      rootCause: detailed?.rootCause || null,
      resolution: detailed?.resolution || null,
      prevention: detailed?.prevention || [],
    };
  });
}

export async function getIncidentByReference(reference: string): Promise<IncidentRecord | null> {
  const incidents = await getAllIncidents();
  return incidents.find((i) => i.reference.toLowerCase() === reference.toLowerCase() || i.id === reference) || null;
}
