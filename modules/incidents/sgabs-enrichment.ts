import { IncidentRecord, HypothesisItem, FlowStepItem, IsoMessageItem, EvidenceItem, RootCauseItem, ResolutionItem, PreventionItem } from "./types";
import { ReferenceIncident } from "../../app/reference-incidents";

export const SGABS_DISPLAY_LIMIT = 130;

/**
 * Validateurs formels officiels SGABS mandatés pour la certification et la validation des incidents :
 * 1. Potey Dohai (Responsable Monetique)
 * 2. Gbide Andrienne (Responsable Adjoint Gestion Specifique)
 * 3. Mohamed Diallo (Lead Equipe Support & Exploitation Monetique (SGCI;SGSN;SGCAM;SGT; SGB et SGC))
 */
export const SGABS_FORMAL_VALIDATORS = [
  "Potey Dohai (Responsable Monetique)",
  "Gbide Andrienne (Responsable Adjoint Gestion Specifique)",
  "Mohamed Diallo (Lead Equipe Support & Exploitation Monetique (SGCI;SGSN;SGCAM;SGT; SGB et SGC))",
] as const;

export function getFormalValidatorForSgabs(indexOrNum: number): string {
  const idx = Math.abs(indexOrNum) % SGABS_FORMAL_VALIDATORS.length;
  return SGABS_FORMAL_VALIDATORS[idx];
}

/**
 * Générateur de données hautement réalistes pour les 130 incidents monétiques SGABS.
 * S'inspire des cas réels de production bancaire couvrant l'ensemble de la chaîne monétique :
 * - Frontal PowerCard & Payway
 * - Switch ISO 8583 (GIMAC, VISA Base I/VAP, Mastercard MIP, GIM-UEMOA)
 * - GAB / ATM (NCR SelfServ, Diebold Opteva, Wincor, EPP DUKPT, CDM, Recycleurs)
 * - TPE & POS (Ingenico Telium/Tetra, PAX Android, Contactless NFC, TMS, DCC)
 * - HSM Cryptographique (Thales PayShield 9000/10K, ZPK, LMK, ARQC, PKI Root CA)
 * - Core Banking System (Sopra Amplitude 4GL & Oracle FLEXCUBE PL/SQL)
 * - E-Commerce & 3D-Secure (Cybersource, PayGate, Pay3DS, ACS, Règles anti-fraude)
 * - Clearing & Règlement (Base II, GIM LIS, Fichiers Outgoing WinSCP, Chargeback TC40)
 */
export function getEnrichedSgabsIncident(ref: ReferenceIncident, index: number): IncidentRecord {
  const num = parseInt(ref.reference.replace("INC-", ""), 10) || index + 1;
  const domain = ref.domain;
  const keys = ref.analysisKeys;
  const titleLower = ref.title.toLowerCase();

  // Attribution formelle tournante et équilibrée entre les 3 validateurs officiels SGABS
  const validator = getFormalValidatorForSgabs(num - 1);

  const stanStr = String(100000 + num).slice(-6);
  const rrnStr = `50291${String(10000000 + num).slice(-7)}`;
  const tidStr = domain === "GAB" ? `GAB-SGABS-${String(num).padStart(3, "0")}` : domain === "TPE" ? `TPE-SGABS-${String(num).padStart(3, "0")}` : `SW-SGABS-${String(num).padStart(3, "0")}`;
  const midStr = `SGABS-MID-00${String(num % 10).padStart(2, "0")}`;

  // Détermination experte du code retour DE39 selon les clés et le titre
  let respCode = "05";
  if (keys.includes("91") || titleLower.includes("91") || titleLower.includes("timeout") || titleLower.includes("inaccessible") || titleLower.includes("cash out")) respCode = "91";
  else if (keys.includes("55") || titleLower.includes("pin") || titleLower.includes("arqc") || titleLower.includes("zpk") || titleLower.includes("kcv")) respCode = "55";
  else if (keys.includes("96") || titleLower.includes("système") || titleLower.includes("erreur") || titleLower.includes("tamper") || titleLower.includes("lock") || titleLower.includes("ora-")) respCode = "96";
  else if (keys.includes("12") || titleLower.includes("invalide") || titleLower.includes("ntp") || titleLower.includes("clock")) respCode = "12";
  else if (keys.includes("14") || titleLower.includes("inconnu") || titleLower.includes("not found")) respCode = "14";
  else if (keys.includes("51") || titleLower.includes("provision") || titleLower.includes("solde")) respCode = "51";
  else if (keys.includes("68") || titleLower.includes("tardive") || titleLower.includes("latence")) respCode = "68";
  else if (keys.includes("30") || titleLower.includes("format") || titleLower.includes("de48")) respCode = "30";
  else if (titleLower.includes("plafond") || titleLower.includes("floor limit") || titleLower.includes("61")) respCode = "61";
  else if (titleLower.includes("cvv") || titleLower.includes("cavv") || titleLower.includes("82")) respCode = "82";
  else if (titleLower.includes("reversal") || titleLower.includes("extourne") || titleLower.includes("clearing") || titleLower.includes("eod")) respCode = "00";

  // Profilage technique précis selon le type d'incident monétique
  const profile = buildIncidentTechnicalProfile(ref, num, respCode, stanStr, rrnStr, tidStr, midStr, validator);

  // Répartition chronologique réaliste des 130 incidents SGABS étalée sur toute l'année 2025 jusqu'à fin Septembre 2026
  // Les mois d'Octobre 2026 et Novembre 2026 ne sont strictement pas touchés
  const startMs = new Date("2025-01-10T08:00:00.000Z").getTime();
  const endMs = new Date("2026-09-28T16:00:00.000Z").getTime();
  const totalSpanMs = endMs - startMs;
  const progress = (num - 1) / (SGABS_DISPLAY_LIMIT - 1);
  const hourOffset = ((num * 13) % 14) * 3600000;
  const occurredTimestamp = endMs - progress * totalSpanMs - hourOffset;
  const occurredDate = new Date(occurredTimestamp);
  const createdDate = new Date(occurredTimestamp + 1800000);
  const resolvedDate = new Date(occurredTimestamp + 3600000 * (2 + (num % 6)));

  return {
    id: ref.reference,
    reference: ref.reference,
    title: ref.title,
    description: profile.description,
    status: "RESOLVED",
    severity: (num % 5 === 0 ? "CRITICAL" : num % 2 === 0 ? "HIGH" : "MEDIUM"),
    knowledgeStatus: "VALIDATED",
    subsidiary: "SGABS",
    domain: ref.domain,
    channel: profile.channel,
    operation: profile.operation,
    network: profile.network,
    environment: "PRODUCTION",
    component: ref.component,
    host: profile.host,
    errorCode: `DE39=${respCode}`,
    occurredAt: occurredDate.toISOString(),
    resolvedAt: resolvedDate.toISOString(),
    authorId: "usr-sgabs-prod-01",
    authorName: "Oury Kohkoun (Expert Monétique SGABS)",
    createdAt: createdDate.toISOString(),
    updatedAt: resolvedDate.toISOString(),
    observations: [profile.observation],
    flowSteps: profile.flowSteps,
    isoMessages: profile.isoMessages,
    hypotheses: profile.hypotheses,
    evidence: profile.evidence,
    rootCause: {
      ...profile.rootCause,
      validatedBy: validator,
      validatedAt: resolvedDate.toISOString(),
    },
    resolution: {
      ...profile.resolution,
      approver: validator,
    },
    prevention: profile.prevention,
  };
}

interface TechnicalProfile {
  description: string;
  channel: string;
  operation: string;
  network: string;
  host: string;
  observation: { symptom: string; facts: string; scope: string; context: string };
  flowSteps: FlowStepItem[];
  isoMessages: IsoMessageItem[];
  hypotheses: HypothesisItem[];
  evidence: EvidenceItem[];
  rootCause: RootCauseItem;
  resolution: ResolutionItem;
  prevention: PreventionItem[];
}

function buildIncidentTechnicalProfile(
  ref: ReferenceIncident,
  num: number,
  respCode: string,
  stanStr: string,
  rrnStr: string,
  tidStr: string,
  midStr: string,
  validator: string
): TechnicalProfile {
  const titleLower = ref.title.toLowerCase();
  const domain = ref.domain;
  const comp = ref.component;

  // =========================================================================
  // 1. CAS E-COMMERCE / 3D-SECURE / CYBERSOURCE / IWO / WEBHOOKS (INC-121 à INC-125)
  // =========================================================================
  if (
    domain === "E-Commerce" ||
    titleLower.includes("cybersource") ||
    titleLower.includes("3ds") ||
    titleLower.includes("paygate") ||
    titleLower.includes("webhook") ||
    titleLower.includes("iwo") ||
    titleLower.includes("cavv") ||
    titleLower.includes("vélocité")
  ) {
    return {
      description: `Incident sur la passerelle de paiement en ligne sécurisée et l'intégration e-commerce : ${ref.title}. Défaillance du handshake 3DSv2, de notification Webhook ou non-conformité commerçant Cybersource.`,
      channel: "Passerelle Web E-Commerce (PayGate / 3D-Secure v2 Directory Server & Cybersource Engine)",
      operation: "Paiement en ligne sécurisé 3D-Secure / Intégration Cybersource Outgoing (DE3=000000)",
      network: "Cybersource Direct / VISA Secure / Mastercard Identity Check",
      host: "SRV-CYBERSOURCE-GW-01",
      observation: {
        symptom: titleLower.includes("iwo")
          ? "Blocage complet du cycle de clearing outgoing suite à l'absence du commerçant identifié « IWO » dans le fichier journalier camerounais."
          : titleLower.includes("webhook")
          ? "Le compte porteur est débité mais la plateforme e-commerce affiche 'Échec du paiement / Panier abandonné' sans confirmation de commande."
          : "Échec de validation de la signature cryptographique 3DSecure CAVV/AAV avec rejet systématique DE39=82 sur les cartes bancaires enrôlées.",
        facts: `Plus de 210 transactions e-commerce impactées sur 18 sites marchands partenaires. Taux de rebond panier à 85% entre 14h00 et 16h30.`,
        scope: "Paiements marchands par carte bancaire sur internet (Canal Web & Mobile e-Commerce).",
        context: "Pic d'achats promotionnels e-commerce combiné à une mise à niveau du protocole 3DSecure vers la version 2.2.0.",
      },
      flowSteps: [
        { position: 1, source: "Navigateur Client", destination: "Serveur Marchand", event: "Validation du panier d'achat et initialisation du paiement e-commerce", status: "OK" },
        { position: 2, source: "Serveur Marchand", destination: "Passerelle PayGate / 3DS", event: "Requête d'authentification 3DSv2 AReq (Authentication Request)", status: "OK" },
        { position: 3, source: "Passerelle PayGate", destination: "Directory Server Visa/MC", event: "Contrôle du jeton de session et vérification d'empreinte navigateur", status: titleLower.includes("iwo") ? "IWO_NOT_FOUND" : "OK" },
        { position: 4, source: "ACS Émetteur SGABS", destination: "Passerelle PayGate", event: titleLower.includes("webhook") ? "Timeout HTTP 504 sur le webhook de notification retour" : "ISO 0110 Rejet de l'autorisation cryptographique (DE39=" + respCode + ")", status: "ERROR" },
        { position: 5, source: "Passerelle PayGate", destination: "Serveur Marchand", event: "Transmission de l'abandon de paiement et alerte d'exploitation", status: "ABORT_PROCESSED" },
      ],
      isoMessages: [
        {
          mti: "0100",
          bitmap: "7238000008C08000",
          stan: stanStr,
          rrn: rrnStr,
          responseCode: "00",
          terminalId: "WEB-SGABS-01",
          maskedRawMessage: `01007238000008C08000164284********711000000003500009171400${stanStr}...DE48=CAVV3DS...`,
          fields: { DE3: "000000", DE4: "35000", DE11: stanStr, DE37: rrnStr, DE41: "WEB-SGABS-01", DE42: midStr, DE48: "CAVV=AAABBIIIIFkAAAAAEgAAAA==" },
        },
        {
          mti: "0110",
          bitmap: "7238000008C08000",
          stan: stanStr,
          rrn: rrnStr,
          responseCode: respCode,
          terminalId: "WEB-SGABS-01",
          maskedRawMessage: `01107238000008C08000164284********711000000003500009171400${stanStr}${respCode}...`,
          fields: { DE3: "000000", DE4: "35000", DE11: stanStr, DE37: rrnStr, DE39: respCode, DE41: "WEB-SGABS-01" },
        },
      ],
      hypotheses: [
        {
          description: "Hypothèse 1 : Indisponibilité du serveur ACS (Access Control Server) de l'émetteur pour la réception du code OTP SMS",
          status: "REJECTED",
          evidence: "Le journal ACS démontre que le client a correctement saisi son mot de passe à usage unique (OTP) sous 18 secondes.",
        },
        {
          description: "Hypothèse 2 : Dépassement du timeout de socket (Timeout 15s) sur la passerelle de callback Webhook vers le marchand",
          status: "PROBABLE",
          evidence: "Les requêtes sortantes vers l'URL marchande dépassent les 15 000ms en raison d'une surcharge du serveur applicatif du site marchand.",
        },
        {
          description: "Hypothèse 3 : Incompatibilité de la règle d'intégration Cybersource : " + (titleLower.includes("iwo") ? "commerçant IWO non présent dans le cycle quotidien, bloquant le settlement" : "algorithme de hachage de la signature CAVV désynchronisé entre PayGate et le serveur 3DS"),
          status: "CONFIRMED",
          evidence: "Preuve fournie par les logs d'ingestion Cybersource : anomalie de rejet formelle bloquant l'injection de l'ordre d'autorisation.",
        },
      ],
      evidence: [
        { type: "Log Passerelle Cybersource", content: `[CYBERSOURCE-ALERT] TxID=${rrnStr} : Merchant identification failed. Verification rule [IWO_RULE] triggered error.`, source: "Cybersource Ingestion Daemon" },
        { type: "Journal 3D-Secure ACS", content: `ACS_ERROR: CAVV verification mismatch on DE48. Expected key version 02, received 01. DE39 set to ${respCode}.`, source: "Pay3DS Audit Server" },
      ],
      rootCause: {
        category: "Sécurité E-Commerce & Intégration Cybersource",
        description: titleLower.includes("iwo")
          ? "Non-respect de la règle d'intégrité Cybersource : tentative d'intégration d'un lot outgoing sans la présence obligatoire du commerçant de référence IWO, nécessitant l'intervention de l'équipe monétique."
          : "Désynchronisation de la clé publique de signature 3DSecure lors du déploiement de la version v2.2.0, entraînant le rejet systématique du cryptogramme CAVV.",
        justification: "Démontré par l'audit formel des trames HTTP 3DSecure et la conformité au référentiel opérationnel de traitement Outgoing.",
        validatedAt: new Date().toISOString(),
        validatedBy: validator,
      },
      resolution: {
        actions: titleLower.includes("iwo")
          ? "Contact immédiat du référent monétique, isolement de la ligne marchande manquante et forçage de l'intégration avec recalcul du trailer de compensation."
          : "Rollback immédiat de la clé de validation ACS vers la version certifiée, recyclage des conteneurs Pay3DS et notification aux partenaires e-commerce.",
        executor: "Équipe Monétique E-Commerce & Cybersource SGABS",
        approver: "Responsable Monétique SGABS",
        result: "Reprise instantanée des autorisations e-commerce et taux de conversion rétabli à 99.2%.",
      },
      prevention: [
        { action: "Automatisation du contrôle préventif de présence du commerçant IWO avant le lancement du process Dual et Couverture", owner: "Exploitation Clearing", priority: "CRITICAL", status: "DONE" },
        { action: "Surveillance Prometheus en temps réel du ratio de succès des callbacks 3DSv2 avec seuil d'alerte à 95%", owner: "Supervision E-Commerce", priority: "HIGH", status: "DONE" },
      ],
    };
  }

  // =========================================================================
  // 2. CAS CORE BANKING / CBS AMPLITUDE & FLEXCUBE / ROW LOCK (INC-115 à INC-120)
  // =========================================================================
  if (
    domain === "CBS" ||
    comp.includes("CBS") ||
    titleLower.includes("amplitude") ||
    titleLower.includes("flexcube") ||
    titleLower.includes("row lock") ||
    titleLower.includes("agios") ||
    titleLower.includes("hold") ||
    titleLower.includes("privilège") ||
    titleLower.includes("pool ora") ||
    titleLower.includes("connexion pool")
  ) {
    return {
      description: `Incident d'interfaçage et de synchronisation Core Banking : ${ref.title}. Conflit de verrouillage base de données Oracle, saturation de pool de connexions ou échec d'imputation comptable.`,
      channel: "Core Banking System (Sopra Amplitude 4GL & Oracle FLEXCUBE PL/SQL)",
      operation: "Réservation de solde / Imputation comptable / Compensation EOD (DE3=010000 / DE3=900000)",
      network: "Réseau Privé d'Administration Bancaire (VLAN 100 CBS)",
      host: "SRV-CBS-AMPLITUDE-RAC01",
      observation: {
        symptom: titleLower.includes("pool")
          ? "Toutes les demandes d'autorisation monétique échouent avec DE39=91 : le frontal PowerCard ne parvient plus à dialoguer avec le CBS."
          : "Le compte client est bloqué en mise en réserve (Hold Amount), ou les écritures de compensation restent coincées en attente d'un verrou table.",
        facts: `Plus de 1 200 transactions bloquées en attente d'acquittement CBS. Le temps de réponse moyen de l'API bancaire est passé de 140ms à 32 000ms.`,
        scope: "Serveurs d'application Core Banking Sopra Amplitude / Oracle FLEXCUBE et pool de connexions HikariCP.",
        context: "Exécution simultanée d'un lot lourd de calcul d'agios / prélèvements d'échéances et de pics d'autorisation retraits.",
      },
      flowSteps: [
        { position: 1, source: "Frontal PowerCard", destination: "Passerelle Middleware CBS", event: "ISO 0200 Demande de réservation de solde (DE102 Compte Débit)", status: "OK" },
        { position: 2, source: "Passerelle Middleware CBS", destination: "Pool Connexions Oracle", event: "Tentative d'obtention d'une connexion SQL active (Connection Pool Request)", status: titleLower.includes("pool") ? "POOL_EXHAUSTED" : "OK" },
        { position: 3, source: "Session Oracle CBS", destination: "Table COMPTES_CLIENTS", event: "Requête SELECT FOR UPDATE : attente sur verrou exclusif (Row-Level Lock Contention)", status: "LOCK_CONTENTION" },
        { position: 4, source: "Moteur de Données Oracle", destination: "Passerelle Middleware CBS", event: "Expiration du timeout de verrou (ORA-00054 / ORA-01013)", status: "ERROR" },
        { position: 5, source: "Passerelle Middleware CBS", destination: "Frontal PowerCard", event: "Génération de la réponse négative ISO 0210 (DE39=" + respCode + ")", status: "TIMEOUT_91" },
      ],
      isoMessages: [
        {
          mti: "0200",
          bitmap: "7238000008C08000",
          stan: stanStr,
          rrn: rrnStr,
          responseCode: "00",
          terminalId: tidStr,
          maskedRawMessage: `02007238000008C08000164500********12890100000005000009171120${stanStr}...`,
          fields: { DE3: "010000", DE4: "50000", DE11: stanStr, DE37: rrnStr, DE41: tidStr, DE102: "00120938471" },
        },
        {
          mti: "0210",
          bitmap: "7238000008C08000",
          stan: stanStr,
          rrn: rrnStr,
          responseCode: respCode,
          terminalId: tidStr,
          maskedRawMessage: `02107238000008C08000164500********12890100000005000009171120${stanStr}${respCode}...`,
          fields: { DE3: "010000", DE11: stanStr, DE37: rrnStr, DE39: respCode, DE41: tidStr },
        },
      ],
      hypotheses: [
        {
          description: "Hypothèse 1 : Crash physique du cluster de bases de données Oracle Real Application Clusters (RAC)",
          status: "REJECTED",
          evidence: "Les 2 nœuds du cluster Oracle RAC affichent un statut CRS 'ONLINE' sans bascule d'instance.",
        },
        {
          description: "Hypothèse 2 : Épuisement des descripteurs de processus sur le pool HikariCP (Maximum Pool Size=120 atteint)",
          status: "PROBABLE",
          evidence: "Le monitoring JMX de la passerelle montre 120/120 connexions allouées et 450 threads en file d'attente d'acquisition.",
        },
        {
          description: "Hypothèse 3 : Conflit de verrouillage transactionnel exclusif (Row Lock Contention) provoqué par une session batch longue non commitée",
          status: "CONFIRMED",
          evidence: "La requête 'v$session_blockers' identifie la session SID 418 (Job BATCH_AGIOS) bloquant 74 sessions d'autorisation monétique depuis 28 minutes.",
        },
      ],
      evidence: [
        { type: "Oracle Alert Log", content: "ORA-00054: resource busy and acquire with NOWAIT specified. Blocking session SID: 418, Serial: 14920.", source: "Oracle Database Alert Log" },
        { type: "Log Middleware CBS", content: "[HIKARICP-TIMEOUT] Connection is not available, request timed out after 30000ms. Active: 120, Idle: 0, Waiting: 450.", source: "HikariCP Connection Manager" },
      ],
      rootCause: {
        category: "Base de Données Core Banking & Conflit Transactionnel",
        description: "Contention sévère sur la table des comptes monétiques consécutive à l'exécution intempestive d'un script d'arrêté périodique sans clause NOWAIT ni découpage par lots (chunk commit).",
        justification: "Confirmé par la corrélation immédiate entre l'arrêt de la session bloquante SID 418 et le retour nominal de la latence CBS sous 80ms.",
        validatedAt: new Date().toISOString(),
        validatedBy: validator,
      },
      resolution: {
        actions: "Terminaison de la session Oracle bloquante par commande ALTER SYSTEM KILL SESSION, augmentation du pool HikariCP à 200 connexions et recalibrage de la fenêtre d'exécution des batchs lourds en dehors des heures ouvrées.",
        executor: "DBA Senior & Exploitation Core Banking SGABS",
        approver: "Direction des Opérations Bancaires",
        result: "Rétablissement instantané du service d'autorisation CBS avec un temps de réponse de 65ms et apurement des files.",
      },
      prevention: [
        { action: "Application obligatoire de la clause SKIP LOCKED sur tous les traitements batch d'imputation comptable", owner: "Équipe Développement CBS", priority: "CRITICAL", status: "DONE" },
        { action: "Alerte automatique SMS/Mail transmise aux DBA dès qu'un verrou exclusif excède 60 secondes", owner: "Supervision DBA", priority: "HIGH", status: "DONE" },
      ],
    };
  }

  // =========================================================================
  // 3. CAS CLEARING / BASE II / GIM LIS / CHARGEBACK TC40 / WINSCP (INC-126 à INC-130)
  // =========================================================================
  if (
    domain === "Clearing" ||
    comp.includes("Clearing") ||
    titleLower.includes("base ii") ||
    titleLower.includes("lis") ||
    titleLower.includes("chargeback") ||
    titleLower.includes("tc40") ||
    titleLower.includes("winscp") ||
    titleLower.includes("orpheline") ||
    titleLower.includes("cut-off") ||
    titleLower.includes("compensation")
  ) {
    return {
      description: `Incident de compensation interbancaire et de réconciliation financière : ${ref.title}. Rejet de fichier de clearing, non-concordance de balance financière ou contestation client hors délai.`,
      channel: "Moteur de Compensation Interbancaire & Dépôt Sécurisé SFTP (WinSCP)",
      operation: "Compensation & Règlement Interbancaire (Clearing Settlement - Fichiers Base II / LIS)",
      network: "Liaisons SFTP Chiffrées VISA Interregional / GIM-UEMOA / GIMAC",
      host: "SRV-CLEARING-SETTLE-01",
      observation: {
        symptom: titleLower.includes("winscp")
          ? "Le serveur distant WinSCP rejette le fichier outgoing en raison d'un mauvais préfixe « P » ou de permissions Linux insuffisantes (droits 777 non accordés)."
          : titleLower.includes("base ii")
          ? "Le centre de traitement Visa rejette l'intégralité du fichier de compensation Base II avec code erreur 'Trailer Checksum Mismatch'."
          : "Écart de balance financière constaté entre le rapport officiel de compensation et les écritures comptables réelles déversées sur Amplitude.",
        facts: `Plus de 4 500 transactions de compensation pour un montant global de 380 000 000 XOF bloquées en attente de validation comptable.`,
        scope: "Cycles de compensation quotidiens GIMAC, VISA International et GIM-UEMOA.",
        context: "Arrêté comptable de fin de journée (Cut-off 18h00) avec obligation réglementaire de transmission avant minuit.",
      },
      flowSteps: [
        { position: 1, source: "Frontal PowerCard", destination: "Moteur de Clearing", event: "Extraction des transactions du cycle et génération du fichier brut de compensation", status: "OK" },
        { position: 2, source: "Moteur de Clearing", destination: "Module de Renommage", event: "Application des règles de nommage strictes par filiale (Préfixe P, devises)", status: titleLower.includes("winscp") ? "NAMING_ERROR" : "OK" },
        { position: 3, source: "Moteur de Clearing", destination: "Serveur SFTP WinSCP", event: "Dépôt sur le répertoire distant et attribution des droits chmod 777", status: "OK" },
        { position: 4, source: "Centre de Compensation Visa/GIM", destination: "Moteur de Clearing", event: titleLower.includes("base ii") ? "Notification de rejet Trailer Checksum erroné" : "Acquittement avec signalement d'écarts de balance", status: "REJECTED_TRAILER" },
        { position: 5, source: "Moteur de Clearing", destination: "Équipe Exploitation", event: "Alerte de rejet critique et suspension des écritures de règlement", status: "ALERT_GENERATED" },
      ],
      isoMessages: [
        {
          mti: "0500",
          bitmap: "7238000008C08000",
          stan: stanStr,
          rrn: rrnStr,
          responseCode: "00",
          terminalId: "BATCH-CLR-01",
          maskedRawMessage: `05007238000008C08000...RECORDS_COUNT=004500...NET_AMOUNT=038000000000...`,
          fields: { DE3: "920000", DE4: "380000000", DE11: stanStr, DE37: rrnStr, DE41: "BATCH-CLR-01", DE97: "38000000000" },
        },
        {
          mti: "0510",
          bitmap: "7238000008C08000",
          stan: stanStr,
          rrn: rrnStr,
          responseCode: "00",
          terminalId: "BATCH-CLR-01",
          maskedRawMessage: `05107238000008C08000...RECONCILIATION_BALANCED...`,
          fields: { DE3: "920000", DE11: stanStr, DE39: "00", DE41: "BATCH-CLR-01" },
        },
      ],
      hypotheses: [
        {
          description: "Hypothèse 1 : Corruption physique du fichier lors du transfert réseau SFTP",
          status: "REJECTED",
          evidence: "Le hachage SHA-256 du fichier déposé sur WinSCP correspond exactement à l'empreinte locale générée par le serveur de clearing.",
        },
        {
          description: "Hypothèse 2 : Dépassement de l'heure de coupure Cut-off réglementaire entraînant le report au cycle suivant",
          status: "PROBABLE",
          evidence: "Le timestamp du transfert indique 18h04 alors que le Cut-off strict était fixé à 18h00 pour la filiale.",
        },
        {
          description: "Hypothèse 3 : Erreur de calcul de la somme de contrôle sur l'enregistrement de fin de lot (Trailer Record 99) ou non-respect de la règle de renommage",
          status: "CONFIRMED",
          evidence: "Preuve établie par l'outil de diagnostic Visa : le nombre de transactions déclaré dans le trailer (4 502) différait de 2 unités suite à une suppression manuelle.",
        },
      ],
      evidence: [
        { type: "Rapport de Rejet Visa", content: "BASE II FILE REJECTED: Reason Code RC-99 [INVALID TRAILER HASH]. Total records mismatch in batch block 04.", source: "Visa Settlement Notification" },
        { type: "Log Transfert WinSCP", content: "PERMISSION DENIED: File uploaded without execution bits. Error code 3: Access denied on /interfaces/VISA/out.", source: "WinSCP SFTP Daemon" },
      ],
      rootCause: {
        category: "Format de Compensation & Règles de Dépôt",
        description: "Altération manuelle du fichier de règlement sans recalcul automatique de la somme de contrôle de l'enregistrement Trailer, provoquant l'invalidation globale du lot de compensation.",
        justification: "Confirmé par la comparaison binaire entre le fichier brut généré et le fichier injecté dans la passerelle.",
        validatedAt: new Date().toISOString(),
        validatedBy: validator,
      },
      resolution: {
        actions: "Régénération automatique du fichier de règlement avec calcul certifié du Trailer Checksum, réapplication des permissions strictes chmod 777 via WinSCP et retransmission avec acquittement sans réserve.",
        executor: "Équipe Clearing & Rapprochement Monétique SGABS",
        approver: "Responsable des Opérations Bancaires",
        result: "Validation sans pénalité du lot de 380 millions XOF par le centre de règlement international.",
      },
      prevention: [
        { action: "Intégration d'un utilitaire de validation syntaxique automatique pré-dépôt (Dry-Run Linter) dans le pipeline Outgoing", owner: "Équipe IT Monétique", priority: "CRITICAL", status: "DONE" },
        { action: "Vérification automatisée des droits chmod 777 sur tout fichier déposé sur l'arborescence WinSCP", owner: "Exploitation Systèmes", priority: "HIGH", status: "DONE" },
      ],
    };
  }

  // =========================================================================
  // 4. CAS GAB MATÉRIEL AVANCÉ (EPP DUKPT, SHUTTER, BILL VALIDATOR, RETRACT, NTP)
  // =========================================================================
  if (
    titleLower.includes("epp") ||
    titleLower.includes("shutter") ||
    titleLower.includes("recycleur") ||
    titleLower.includes("retract") ||
    titleLower.includes("ntp") ||
    titleLower.includes("skimming") ||
    titleLower.includes("jittering") ||
    titleLower.includes("out of service") ||
    titleLower.includes("ndc") ||
    titleLower.includes("replenishment")
  ) {
    return {
      description: `Incident matériel et capteurs sur le parc distributeurs automatiques GAB : ${ref.title}. Défaillance du clavier chiffrant EPP, bourrage obturateur ou désynchronisation protocolaire NDC.`,
      channel: "GAB Motorisé NCR SelfServ 84 / Diebold Opteva / Hyosung MoniMax",
      operation: "Retrait d'espèces / Dépôt automatisé & Saisie PIN sécurisée (DE3=010000 / DE3=210000)",
      network: "Réseau Privé Sécurisé GAB (VPN IPSec Dédié SGABS)",
      host: "SRV-ATM-POWERCARD-NDC",
      observation: {
        symptom: titleLower.includes("epp")
          ? "Le GAB passe brutalement en 'Hors Service' (Out Of Service) avec alarme clavier chiffrant EPP en mode sécurité (Key Parity Tamper)."
          : titleLower.includes("ntp")
          ? "Toutes les transactions du GAB sont rejetées avec DE39=12 : dérive de l'horloge locale de plus de 15 minutes."
          : "Le client entend le comptage des billets mais l'obturateur reste scellé (Shutter Jam), sans délivrance de cash.",
        facts: `Indisponibilité totale du distributeur sur une zone à forte affluence. Plus de 35 tentatives d'opérations avortées en 1 heure.`,
        scope: "Distributeurs automatiques de billets rattachés au frontal monétique NDC SGABS.",
        context: "Maintenance matérielle récente, coupure de courant onduleur ou forte variation thermique.",
      },
      flowSteps: [
        { position: 1, source: "Porteur Carte", destination: "Clavier EPP / Lecteur GAB", event: "Insertion carte et composition du code confidentiel sur PIN Pad chiffrant", status: "OK" },
        { position: 2, source: "Clavier EPP", destination: "Contrôleur ATM", event: "Chiffrement du PIN Block sous clé DUKPT avec génération du KSN", status: titleLower.includes("epp") ? "DUKPT_PARITY_ERROR" : "OK" },
        { position: 3, source: "Contrôleur ATM", destination: "Frontal PowerCard", event: "Transmission de la trame NDC (ISO 0200, DE52=PIN, DE11=STAN)", status: "OK" },
        { position: 4, source: "Frontal PowerCard", destination: "Contrôleur ATM", event: "Accord d'autorisation DE39=00 et commande de présentation de liasse CDM", status: "OK" },
        { position: 5, source: "Module CDM", destination: "Contrôleur ATM", event: "Échec mécanique obturateur : code M-Status 14 (Shutter Blocked) / Billet avalé", status: "HARDWARE_JAM" },
      ],
      isoMessages: [
        {
          mti: "0200",
          bitmap: "7238000008C08000",
          stan: stanStr,
          rrn: rrnStr,
          responseCode: "00",
          terminalId: tidStr,
          maskedRawMessage: `02007238000008C08000164500********341201000000040000...DE52=8A4FBC...`,
          fields: { DE3: "010000", DE4: "40000", DE11: stanStr, DE37: rrnStr, DE41: tidStr, DE52: "8A4FBCE9128034AA" },
        },
        {
          mti: "0210",
          bitmap: "7238000008C08000",
          stan: stanStr,
          rrn: rrnStr,
          responseCode: respCode,
          terminalId: tidStr,
          maskedRawMessage: `02107238000008C08000164500********341201000000040000...DE39=${respCode}`,
          fields: { DE3: "010000", DE11: stanStr, DE37: rrnStr, DE39: respCode, DE41: tidStr },
        },
      ],
      hypotheses: [
        {
          description: "Hypothèse 1 : Tentative d'agression physique ou d'installation d'un dispositif de skimming sur le lecteur",
          status: "REJECTED",
          evidence: "L'inspection visuelle et les capteurs de présence de collerette frauduleuse confirment l'absence d'équipement pirate.",
        },
        {
          description: "Hypothèse 2 : Dérive de l'horloge système suite à la défaillance de la pile CMOS de la carte mère du GAB",
          status: "PROBABLE",
          evidence: "La comparaison entre la date serveur NTP et l'heure locale BIOS révélait un décalage de 912 secondes.",
        },
        {
          description: "Hypothèse 3 : Blocage mécanique du moteur d'entraînement de l'obturateur ou perte de clé de session DUKPT sur l'EPP",
          status: "CONFIRMED",
          evidence: "Le journal électronique (EJ) enregistre l'erreur matérielle M-Status 12/14 bloquant le cycle mécanique de présentation des billets.",
        },
      ],
      evidence: [
        { type: "Journal Électronique ATM", content: `EJ_LOG: [M-STATUS: 12] EPP SECURITY TAMPER - DUKPT KEY TABLE ZEROIZED. TERMINAL HALTED.`, source: `Journal Électronique ${tidStr}` },
        { type: "Diagnostic Constructeur", content: "CDM ERROR: Shutter motor voltage fault. Obstruction detected at position 3.", source: "NCR/Diebold Maintenance Tool" },
      ],
      rootCause: {
        category: "Matériel Monétique GAB & Sécurité Physique",
        description: "Défaillance matérielle sur le sous-ensemble incriminé (EPP ou transporteur CDM), forçant le contrôleur local à placer le distributeur en sécurité pour protéger les fonds et la cryptographie.",
        justification: "Validé par le relevé des codes d'erreurs internes dans les registres non volatils du contrôleur ATM.",
        validatedAt: new Date().toISOString(),
        validatedBy: validator,
      },
      resolution: {
        actions: "Dépêchement du mainteneur matériel sur site pour remplacement du sous-ensemble défectueux, réinjection sécurisée des clés d'initialisation EPP sous double contrôle et remise en service.",
        executor: "Mainteneur Matériel GAB & Support Monétique SGABS",
        approver: "Responsable Exploitation GAB",
        result: "Rétablissement du GAB en service nominal sous 45 minutes et réconciliation des montants.",
      },
      prevention: [
        { action: "Synchronisation périodique forcée des GAB sur le serveur NTP bancaire interne toutes les 4 heures", owner: "Support Systèmes GAB", priority: "HIGH", status: "DONE" },
        { action: "Remplacement préventif annuel des mécanismes de courroies et cellules optiques d'obturateurs", owner: "Maintenance Constructeur", priority: "HIGH", status: "DONE" },
      ],
    };
  }

  // =========================================================================
  // 5. CAS TPE AVANCÉ (CONTACTLESS NFC CVM, TMS, DCC, VOID, FLOOR LIMIT)
  // =========================================================================
  if (
    titleLower.includes("nfc") ||
    titleLower.includes("contactless") ||
    titleLower.includes("tms") ||
    titleLower.includes("dcc") ||
    titleLower.includes("void") ||
    titleLower.includes("floor limit") ||
    titleLower.includes("offline") ||
    titleLower.includes("pos") ||
    titleLower.includes("marchand")
  ) {
    return {
      description: `Incident d'acquisition sur les terminaux de paiement marchands TPE : ${ref.title}. Rejets des transactions sans contact NFC, échec de profil TMS ou dépassement du seuil de risque floor limit.`,
      channel: "Terminaux TPE Sans Contact (Ingenico Move 5000 / Tetra & PAX Android)",
      operation: "Vente CB Sans Contact NFC / Pré-autorisation / Annulation Void (DE3=000000 / DE3=020000)",
      network: "Réseau Monétique Commerçants GPRS/4G & TLS 1.3",
      host: "FRONTAL-POS-ACQUIRER-02",
      observation: {
        symptom: titleLower.includes("contactless")
          ? "Le paiement sans contact bipe mais la transaction est immédiatement refusée au-delà du seuil CVM sans demander l'insertion de la carte."
          : titleLower.includes("tms")
          ? "Le TPE télécharge une mise à jour de profil et perd tous ses paramètres commerçant (MID/TID inconnus sur le serveur)."
          : "Les paiements marchands affichent 'Transaction Refusée' avec code DE39=05 ou DE39=12.",
        facts: `Plus de 280 transactions rejetées chez 35 commerçants majeurs de la capitale en heure de pointe.`,
        scope: "Terminaux de paiement électroniques commerçants raccordés à la passerelle d'acquisition SGABS.",
        context: "Mise à niveau programmée des tables de configuration TMS et mise en conformité des règles CVM.",
      },
      flowSteps: [
        { position: 1, source: "Carte Porteur", destination: "Antenne NFC TPE", event: "Présentation de la carte sans contact et lecture des tags EMV (Tag 9F6E)", status: "OK" },
        { position: 2, source: "Noyau EMV TPE", destination: "Contrôleur POS", event: "Évaluation du montant face au plafond CVM : discordance de configuration", status: "CVM_EVAL_ERROR" },
        { position: 3, source: "Contrôleur POS", destination: "Passerelle Monétique IP", event: "ISO 0200 Émission de la requête d'autorisation vers le frontal", status: "OK" },
        { position: 4, source: "Frontal PowerCard", destination: "Table Marchands", event: "Contrôle contrat marchand : rejet pour paramètre terminal désynchronisé", status: "REJECTED" },
        { position: 5, source: "Passerelle Monétique IP", destination: "TPE Commerçant", event: "Génération de l'ISO 0210 (DE39=" + respCode + ") et affichage refus", status: "REFUSED" },
      ],
      isoMessages: [
        {
          mti: "0200",
          bitmap: "7238000008C08000",
          stan: stanStr,
          rrn: rrnStr,
          responseCode: "00",
          terminalId: tidStr,
          maskedRawMessage: `02007238000008C08000164970********881200000002500009171200${stanStr}...`,
          fields: { DE3: "000000", DE4: "25000", DE11: stanStr, DE37: rrnStr, DE41: tidStr, DE42: midStr, DE55: "9F6E0420000000" },
        },
        {
          mti: "0210",
          bitmap: "7238000008C08000",
          stan: stanStr,
          rrn: rrnStr,
          responseCode: respCode,
          terminalId: tidStr,
          maskedRawMessage: `02107238000008C08000164970********881200000002500009171200${stanStr}${respCode}...`,
          fields: { DE3: "000000", DE4: "25000", DE11: stanStr, DE37: rrnStr, DE39: respCode, DE41: tidStr, DE42: midStr },
        },
      ],
      hypotheses: [
        {
          description: "Hypothèse 1 : Carte bancaire client défectueuse ou antenne NFC endommagée",
          status: "REJECTED",
          evidence: "Le problème survient indistinctement sur des centaines de cartes d'émetteurs différents.",
        },
        {
          description: "Hypothèse 2 : Coupure de liaison télécom GPRS entre les TPE et la passerelle centrale",
          status: "REJECTED",
          evidence: "Les sessions TCP port 8443 sont actives et les échanges SSL s'établissent sans perte.",
        },
        {
          description: "Hypothèse 3 : Erreur dans le paramétrage du fichier TMS déployé : seuil CVM configuré en mode 'Strict Reject' sans bascule vers l'insertion contact",
          status: "CONFIRMED",
          evidence: "L'analyse du profil TMS confirme que le drapeau 'Fallback to Contact on CVM Limit' était désactivé dans le template XML.",
        },
      ],
      evidence: [
        { type: "Log Passerelle TPE", content: `[POS-REJECT] TID=${tidStr} MID=${midStr} : Tag 9F6E CVM Limit Exceeded. Cardholder authentication required. DE39=05.`, source: "Frontal TPE Server" },
        { type: "Audit TMS", content: "TMS Profile Update 202611-V4: Flag 'ALLOW_CONTACT_FALLBACK' set to FALSE in global policy.", source: "Ingenico TMS Audit Server" },
      ],
      rootCause: {
        category: "Paramétrage TPE & Profil Terminal Management System",
        description: "Régression introduite dans le fichier de paramétrage global TMS interdisant à tort la demande d'insertion carte lors du dépassement du plafond de sécurité sans contact.",
        justification: "Démontré par la reprise immédiate des transactions dès le rétablissement du profil certifié sur le serveur TMS.",
        validatedAt: new Date().toISOString(),
        validatedBy: validator,
      },
      resolution: {
        actions: "Correction immédiate du template de configuration sur le serveur TMS, activation du fallback contact et déploiement d'une télé-mise à jour forcée sur tous les terminaux actifs.",
        executor: "Équipe Support Marchands & POS SGABS",
        approver: "Responsable Monétique SGABS",
        result: "Rétablissement complet du taux de succès des paiements commerçants à 99.6%.",
      },
      prevention: [
        { action: "Validation obligatoire sur banc de test pilote (Lab TPE) avant tout déploiement massif de profil TMS", owner: "Recette Monétique", priority: "CRITICAL", status: "DONE" },
        { action: "Mise en place d'un monitoring spécifique sur les rejets sans contact pour alerter en cas de pic > 3%", owner: "Supervision POS", priority: "HIGH", status: "DONE" },
      ],
    };
  }

  // =========================================================================
  // 6. CAS HSM AVANCÉ (TAMPER ALARM, LMK, ROOT CA PKI, KEY TABLE, ZPK)
  // =========================================================================
  if (
    domain === "Infrastructure" ||
    domain === "Carte" ||
    titleLower.includes("hsm") ||
    titleLower.includes("tamper") ||
    titleLower.includes("lmk") ||
    titleLower.includes("pki") ||
    titleLower.includes("root ca") ||
    titleLower.includes("key table") ||
    titleLower.includes("arqc") ||
    titleLower.includes("cvv") ||
    titleLower.includes("zpk")
  ) {
    return {
      description: `Incident de sécurité cryptographique matériel HSM : ${ref.title}. Alarme physique de boîtier, désynchronisation de clé ZPK/LMK ou expiration de certificat racine PKI.`,
      channel: "Appliance Cryptographique Matérielle Thales PayShield 10K / 9000",
      operation: "Translation de clés, calcul CVV/iCVV, vérification ARQC EMV et gestion LMK",
      network: "Bus Sécurisé Inter-Data Center SGABS (Liaisons Fibre Chiffrées)",
      host: "HSM-PAYSHIELD-01-PRIMARY",
      observation: {
        symptom: titleLower.includes("tamper")
          ? "L'appareil HSM principal passe en état 'Tamper Active' et efface instantanément ses clés de travail LMK par sécurité matérielle."
          : titleLower.includes("pki")
          ? "Rejets systématiques de toutes les cartes bancaires neuves avec DE39=55 : certificat racine CA échu non renouvelé."
          : "Rejets massifs avec code retour DE39=55 ou DE39=82 sur les validations de PIN et cryptogrammes ARQC.",
        facts: `Plus de 450 tentatives de retraits et paiements rejetées en l'espace de 25 minutes sur l'ensemble de la clientèle SGABS.`,
        scope: "Module HSM de production principal et frontal transactionnel PowerCard.",
        context: "Opération de rotation trimestrielle des clés de sécurité ou variation de l'environnement physique en salle des machines.",
      },
      flowSteps: [
        { position: 1, source: "Terminal GAB / TPE", destination: "Frontal PowerCard", event: "ISO 0200 contenant cryptogramme ARQC et bloc PIN chiffré", status: "OK" },
        { position: 2, source: "Frontal PowerCard", destination: "HSM Thales PayShield", event: "Commande 'M0' (Translate PIN from ZPK to LMK) et 'KQ' (Verify ARQC)", status: "OK" },
        { position: 3, source: "HSM Thales PayShield", destination: "Coprocesseur Crypto", event: titleLower.includes("tamper") ? "Capteur physique actif : clés LMK effacées" : "Désynchronisation KCV ou table de clés interne (RC=01/10)", status: "CRYPTO_FAULT" },
        { position: 4, source: "HSM Thales PayShield", destination: "Frontal PowerCard", event: "Réponse d'erreur cryptographique (M1 / Error Code " + respCode + ")", status: "ERROR" },
        { position: 5, source: "Frontal PowerCard", destination: "Terminal Acquéreur", event: "Génération de l'ISO 0210 avec code de rejet (DE39=" + respCode + ")", status: "REJECTED_55" },
      ],
      isoMessages: [
        {
          mti: "0200",
          bitmap: "7238000008C08000",
          stan: stanStr,
          rrn: rrnStr,
          responseCode: "00",
          terminalId: tidStr,
          maskedRawMessage: `02007238000008C08000164500********9901000000020000...DE52=A4F8E2...`,
          fields: { DE3: "010000", DE4: "20000", DE11: stanStr, DE37: rrnStr, DE41: tidStr, DE52: "A4F8E2109842BC01", DE55: "9F26084B2019448201A984" },
        },
        {
          mti: "0210",
          bitmap: "7238000008C08000",
          stan: stanStr,
          rrn: rrnStr,
          responseCode: respCode,
          terminalId: tidStr,
          maskedRawMessage: `02107238000008C08000164500********9901000000020000...DE39=${respCode}`,
          fields: { DE3: "010000", DE11: stanStr, DE37: rrnStr, DE39: respCode, DE41: tidStr },
        },
      ],
      hypotheses: [
        {
          description: "Hypothèse 1 : Tentative d'attaque brute-force sur le boîtier cryptographique ou intrusion physique",
          status: "REJECTED",
          evidence: "La vidéosurveillance de la salle blanche et les journaux d'accès biométriques confirment qu'aucune personne n'était présente.",
        },
        {
          description: "Hypothèse 2 : Discordance de la valeur de contrôle de clé (KCV) suite à une saisie erronée d'une composante de clé ZPK",
          status: "PROBABLE",
          evidence: "Le KCV enregistré dans la configuration PowerCard (0x4E89B2) ne correspondait pas à la valeur renvoyée par le HSM (0x1128FA).",
        },
        {
          description: "Hypothèse 3 : Déclenchement de la sonde thermique du HSM ou expiration de la clé publique CA racine EMV dans la mémoire interne",
          status: "CONFIRMED",
          evidence: "Le journal d'audit interne du HSM trace l'erreur matérielle formelle ayant provoqué l'arrêt immédiat des opérations de translation de clés.",
        },
      ],
      evidence: [
        { type: "Log Console HSM", content: `HSM_AUDIT: [ALERT-TAMPER] Physical enclosure temperature sensor tripped. Error Code: 0x8021. Keys zeroized.`, source: "Thales PayShield Console Audit" },
        { type: "Syslog Frontal Crypto", content: `CRYPTO_FAIL: Translation command M0 returned RC=01 (Key Parity Error). Mapping to DE39=${respCode}.`, source: "PowerCard Crypto Subsystem" },
      ],
      rootCause: {
        category: "Sécurité Matérielle HSM & Gestion des Clés Cryptographiques",
        description: "Dérive de synchronisation cryptographique ou déclenchement de capteur de sécurité matérielle ayant inhibé les opérations de déchiffrement sécurisé du frontal monétique.",
        justification: "Confirmé par le journal d'audit scellé du HSM et le rétablissement immédiat après rechargement des composantes de clé.",
        validatedAt: new Date().toISOString(),
        validatedBy: validator,
      },
      resolution: {
        actions: "Bascule immédiate vers le HSM secondaire de secours, convocation sous astreinte des officiers de sécurité pour cérémonie de chargement des composantes de clé sous double contrôle et remise en service.",
        executor: "Officiers de Sécurité Monétique & Administrateur HSM SGABS",
        approver: "RSSI & Direction de la Sécurité des Systèmes d'Information",
        result: "Rétablissement total des vérifications cryptographiques et apurement des rejets.",
      },
      prevention: [
        { action: "Surveillance thermique et environnementale continue de la baie HSM avec seuils d'alerte stricts", owner: "Équipe Infrastructure Data Center", priority: "CRITICAL", status: "DONE" },
        { action: "Test de validation unitaire automatique du KCV dans le frontal avant toute bascule en production de nouvelles clés", owner: "Sécurité Monétique", priority: "HIGH", status: "DONE" },
      ],
    };
  }

  // =========================================================================
  // 7. CAS SWITCH & RÉSEAUX AVANCÉS (VISA VAP, MASTERCARD MIP, BOUCLE, LATENCE > 8s)
  // =========================================================================
  if (
    domain === "Switch" ||
    domain === "PowerCard" ||
    titleLower.includes("switch") ||
    titleLower.includes("vap") ||
    titleLower.includes("mip") ||
    titleLower.includes("boucle") ||
    titleLower.includes("hop count") ||
    titleLower.includes("latence") ||
    titleLower.includes("gimac") ||
    titleLower.includes("visa") ||
    titleLower.includes("mastercard")
  ) {
    return {
      description: `Incident de routage interbancaire et liaisons internationales : ${ref.title}. Coupure de lien VAP/MIP, saturation des files d'attente FIFO ou latence transfrontalière excessive.`,
      channel: "Switch Monétique Multi-Réseaux & Passerelles Internationales (VISA VAP / Mastercard MIP / GIMAC)",
      operation: "Acheminement et bascule transactionnelle haute disponibilité ISO 8583 (0100/0200)",
      network: "Liaisons Télécom Internationales SD-WAN & BGP Multihoming",
      host: "SWITCH-ROUTER-CORE-01",
      observation: {
        symptom: titleLower.includes("latence")
          ? "Rejets massifs avec DE39=68 (Response received too late) : les transactions internationales expirent après 8 000ms sans réponse émetteur."
          : titleLower.includes("vap")
          ? "Coupure brutale des flux de cartes étrangères : la session BGP du lien principal Visa VAP tombe sans bascule automatique."
          : "Accumulation de messages dans la queue FIFO du Switch et rejets DE39=91 en cascade.",
        facts: `Plus de 520 transactions interbancaires en échec en 30 minutes, affectant les flux nationaux et internationaux.`,
        scope: "Passerelles de routage interbancaires GIMAC, VISA Base I et Mastercard Banknet.",
        context: "Incident survenu lors d'un pic de trafic transactionnel international combiné à une dégradation de la fibre sous-marine.",
      },
      flowSteps: [
        { position: 1, source: "Frontal PowerCard", destination: "Switch National/Régional", event: "ISO 0200 Demande d'autorisation internationale (DE100 Destination)", status: "OK" },
        { position: 2, source: "Switch National", destination: "Routeur BGP / VAP Visa", event: "Acheminement du paquet vers la passerelle internationale", status: titleLower.includes("vap") ? "BGP_DOWN" : "OK" },
        { position: 3, source: "Passerelle VAP/MIP", destination: "Réseau Émetteur International", event: "Transmission sur le circuit international : latence anormale > 8000ms", status: "HIGH_LATENCY" },
        { position: 4, source: "Switch National", destination: "Frontal PowerCard", event: "Expiration du timer transactionnel : génération de l'ISO 0210 avec DE39=" + respCode, status: "TIMEOUT_GENERATED" },
        { position: 5, source: "Frontal PowerCard", destination: "Terminal Acquéreur", event: "Notification d'abandon client et restitution immédiate de la carte", status: "ABORT_PROCESSED" },
      ],
      isoMessages: [
        {
          mti: "0200",
          bitmap: "7238000008C08000",
          stan: stanStr,
          rrn: rrnStr,
          responseCode: "00",
          terminalId: tidStr,
          maskedRawMessage: `02007238000008C08000164284********901201000000030000...DE100=VISA...`,
          fields: { DE3: "010000", DE4: "30000", DE11: stanStr, DE37: rrnStr, DE41: tidStr, DE49: "952", DE100: "VISA" },
        },
        {
          mti: "0210",
          bitmap: "7238000008C08000",
          stan: stanStr,
          rrn: rrnStr,
          responseCode: respCode,
          terminalId: tidStr,
          maskedRawMessage: `02107238000008C08000164284********901201000000030000...DE39=${respCode}`,
          fields: { DE3: "010000", DE11: stanStr, DE37: rrnStr, DE39: respCode, DE41: tidStr },
        },
      ],
      hypotheses: [
        {
          description: "Hypothèse 1 : Panne générale électrique sur le centre de calcul du réseau international",
          status: "REJECTED",
          evidence: "Le bulletin de statut Visa/Mastercard confirme que les systèmes centraux sont à l'état nominal.",
        },
        {
          description: "Hypothèse 2 : Saturation de la mémoire tampon du routeur frontière provoquant le rejet des paquets TCP",
          status: "PROBABLE",
          evidence: "Le monitoring SNMP montre une utilisation CPU du routeur de bordure à 98% avec goulot d'étranglement sur l'interface eth1.",
        },
        {
          description: "Hypothèse 3 : Blocage de la bascule automatique BGP (Keep-Alive Freeze) ou latence réseau sous-marine transfrontalière excédant le timer de 8 secondes",
          status: "CONFIRMED",
          evidence: "Les traces Wireshark prouvent un RTT moyen de 8 450ms sur le circuit international, déclenchant l'expiration du timer local DE39=68.",
        },
      ],
      evidence: [
        { type: "Syslog Routeur BGP", content: "BGP-5-ADJCHANGE: neighbor 196.200.14.1 Down (KeepAlive timer expired). Failover policy not triggered.", source: "Border Router Syslog" },
        { type: "Capture Réseau Wireshark", content: "TCP Retransmission count: 18. Round Trip Time: 8450ms. Transaction timed out before 0210 arrival.", source: "Network Tap Switch" },
      ],
      rootCause: {
        category: "Réseaux Télécom & Routage Interbancaire",
        description: "Défaillance de la règle de bascule BGP automatique combinée à une dégradation de la latence transfrontalière, provoquant des expirations en chaîne du timer de réponse.",
        justification: "Démontré par la corrélation stricte entre les alarmes du routeur et les pointes de rejets DE39=68/91 enregistrées dans les logs du Switch.",
        validatedAt: new Date().toISOString(),
        validatedBy: validator,
      },
      resolution: {
        actions: "Bascule manuelle forcée de la route internationale vers le lien satellite de secours, réinitialisation de la session BGP et augmentation temporaire du timer de timeout à 12s.",
        executor: "Équipe Réseaux Télécom & Ingénierie Monétique SGABS",
        approver: "Responsable Infrastructure Monétique",
        result: "Rétablissement complet du trafic international avec un temps de réponse ramené sous les 1 200ms.",
      },
      prevention: [
        { action: "Configuration de la détection BFD (Bidirectional Forwarding Detection) à 300ms pour garantir un basculement instantané", owner: "Équipe Réseaux", priority: "CRITICAL", status: "DONE" },
        { action: "Alerte temps réel sur la latence médiane transfrontalière dès qu'elle dépasse 4 000ms", owner: "Supervision Infrastructure", priority: "HIGH", status: "DONE" },
      ],
    };
  }

  // =========================================================================
  // 8. CAS PAR DÉFAUT / REVERSAL / DISPENSE (INCIDENTS HISTORIQUES)
  // =========================================================================
  return {
    description: `Incident de distribution d'espèces et de synchronisation monétique : ${ref.title}. Défaillance mécanique CDM, rejet transactionnel ou divergence de comptabilisation.`,
    channel: "GAB / ATM NCR & Diebold",
    operation: "Retrait d'espèces (Cash Withdrawal - DE3=010000)",
    network: "GIMAC / VISA / Réseau Interne SGABS",
    host: "SRV-ATM-POWERCARD-01",
    observation: {
      symptom: "Le porteur insère sa carte, valide son code PIN, le débit apparaît sur le compte mais l'automate ne délivre pas les fonds ou génère un ticket d'anomalie.",
      facts: `Plus de 48 réclamations clients enregistrées sur le cluster GAB. Taux de rejet brutal constaté sur les transactions.`,
      scope: `GAB motorisés NCR Personas et Diebold rattachés au concentrateur frontal PowerCard SGABS.`,
      context: "Pic d'affluence transactionnelle combiné à une dérive de synchronisation des serveurs monétiques.",
    },
    flowSteps: [
      { position: 1, source: "GAB / ATM", destination: "Frontal PowerCard", event: "ISO 0200 Demande d'autorisation de retrait (DE3=010000, DE4=5000000)", status: "OK" },
      { position: 2, source: "Frontal PowerCard", destination: "CBS Sopra Amplitude", event: "Vérification solde et réservation des fonds (DE102 / DE103)", status: "OK" },
      { position: 3, source: "Frontal PowerCard", destination: "GAB / ATM", event: "ISO 0210 Autorisation accordée (DE39=00), ordre de distribution CDM", status: "OK" },
      { position: 4, source: "Distributeur CDM", destination: "Contrôleur ATM", event: "Incident matériel : blocage ou anomalie de transporteur billets", status: "HARDWARE_JAM" },
      { position: 5, source: "GAB / ATM", destination: "Frontal PowerCard", event: "Émission manquante ou tardive du message d'annulation ISO 0420 (Reversal)", status: "REVERSAL_TIMEOUT" },
    ],
    isoMessages: [
      {
        mti: "0200",
        bitmap: "7238000008C08000",
        stan: stanStr,
        rrn: rrnStr,
        responseCode: "00",
        terminalId: tidStr,
        maskedRawMessage: `02007238000008C08000164500********12890100000005000009171120${stanStr}...`,
        fields: { DE3: "010000", DE4: "50000", DE11: stanStr, DE37: rrnStr, DE41: tidStr, DE49: "952" },
      },
      {
        mti: "0210",
        bitmap: "7238000008C08000",
        stan: stanStr,
        rrn: rrnStr,
        responseCode: respCode,
        terminalId: tidStr,
        maskedRawMessage: `02107238000008C08000164500********12890100000005000009171120${stanStr}${respCode}...`,
        fields: { DE3: "010000", DE4: "50000", DE11: stanStr, DE37: rrnStr, DE39: respCode, DE41: tidStr },
      },
    ],
    hypotheses: [
      {
        description: "Hypothèse 1 : Coupure totale de la liaison réseau télécom reliant le point d'accès au frontal bancaire",
        status: "REJECTED",
        evidence: "Les trames de supervision ICMP et Echo Test 0800 sont stables à 14ms sans perte de paquets.",
      },
      {
        description: "Hypothèse 2 : Bourrage physique ou défaillance de capteur optique sur le module matériel",
        status: "PROBABLE",
        evidence: "Le journal d'exploitation signale un code d'erreur matériel persistant nécessitant un recyclage.",
      },
      {
        description: "Hypothèse 3 : Désynchronisation du timer d'annulation : rapatriement sans émission du message de contre-passation au Core Banking",
        status: "CONFIRMED",
        evidence: "Corrélation formelle des logs : le message d'annulation n'a pas atteint le système central avant l'heure d'arrêté comptable.",
      },
    ],
    evidence: [
      { type: "Journal Électronique ATM", content: "M-STATUS: 14 [TRANSPORT ERROR] - BILLETS DEVIÉS VERS PURGE BIN. AUCUN REVERSAL ÉMIS.", source: `Journal Électronique ${tidStr}` },
      { type: "Trace ISO 8583", content: "0200 accordé avec DE39=00. Aucun 0420 reçu avant le Cut-off.", source: "Frontal PowerCard Log" },
    ],
    rootCause: {
      category: "Matériel ATM & Temporisation Reversal",
      description: "Anomalie combinée d'encrassement de capteur et d'expiration de timer transactionnel empêchant la contrepassation automatique de l'écriture bancaire.",
      justification: "Démontré par l'audit formel des traces ISO et du journal électronique local.",
      validatedAt: new Date().toISOString(),
      validatedBy: validator,
    },
    resolution: {
      actions: "Intervention de maintenance, nettoyage des capteurs, recalibrage des timers et injection manuelle du fichier d'extourne comptable sur le Core Banking.",
      executor: "Équipe Exploitation & Support Monétique SGABS",
      approver: "Responsable Monétique SGABS",
      result: "Rétablissement de la disponibilité à 99.8% et régularisation sans perte de l'ensemble des comptes clients.",
    },
    prevention: [
      { action: "Mise en place d'une alerte Prometheus détectant tout écart entre transaction débitée et absence de reversal sous 60s", owner: "Équipe Supervision", priority: "CRITICAL", status: "DONE" },
      { action: "Maintenance préventive bi-mensuelle obligatoire des capteurs optiques sur les automates à fort trafic", owner: "Maintenance Matériel", priority: "HIGH", status: "DONE" },
    ],
  };
}
