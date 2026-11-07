import { IncidentRecord, HypothesisItem, FlowStepItem, IsoMessageItem, EvidenceItem, RootCauseItem, ResolutionItem, PreventionItem } from "./types";
import { ReferenceIncident } from "../../app/reference-incidents";

export const SGABS_DISPLAY_LIMIT = 80;

/**
 * Générateur de données hautement réalistes pour les incidents monétiques SGABS.
 * S'inspire des cas réels de production bancaire :
 * Frontal PowerCard, Switch ISO 8583, GAB (NCR/Diebold), TPE (Ingenico/Verifone),
 * HSM Thales PayShield 9000, Core Banking Sopra Amplitude & Oracle FLEXCUBE,
 * Réseaux interbancaires GIMAC, VISA et Mastercard.
 */
export function getEnrichedSgabsIncident(ref: ReferenceIncident, index: number): IncidentRecord {
  const num = parseInt(ref.reference.replace("INC-", ""), 10) || index + 1;
  const domain = ref.domain;
  const component = ref.component;
  const keys = ref.analysisKeys;

  const stanStr = String(100000 + num).slice(-6);
  const rrnStr = `50291${String(10000000 + num).slice(-7)}`;
  const tidStr = domain === "GAB" ? `GAB-SGABS-${String(num).padStart(3, "0")}` : domain === "TPE" ? `TPE-SGABS-${String(num).padStart(3, "0")}` : `SW-SGABS-${String(num).padStart(3, "0")}`;
  const midStr = `SGABS-MID-00${String(num % 10).padStart(2, "0")}`;

  // Détermination du code retour DE39 selon les clés d'analyse
  let respCode = "05";
  if (keys.includes("91") || ref.title.includes("91") || ref.title.includes("timeout")) respCode = "91";
  else if (keys.includes("55") || ref.title.includes("PIN") || ref.title.includes("ARQC")) respCode = "55";
  else if (keys.includes("96") || ref.title.includes("système") || ref.title.includes("Erreur")) respCode = "96";
  else if (keys.includes("12") || ref.title.includes("invalide")) respCode = "12";
  else if (keys.includes("14") || ref.title.includes("inconnu")) respCode = "14";
  else if (keys.includes("51") || ref.title.includes("provision") || ref.title.includes("Solde")) respCode = "51";
  else if (keys.includes("68") || ref.title.includes("tardive") || ref.title.includes("Latence")) respCode = "68";
  else if (ref.title.includes("Plafond")) respCode = "61";
  else if (ref.title.includes("CVV")) respCode = "82";
  else if (ref.title.includes("Reversal") || ref.title.includes("extourne")) respCode = "00";

  // Profilage technique précis selon le type d'incident monétique
  const profile = buildIncidentTechnicalProfile(ref, num, respCode, stanStr, rrnStr, tidStr, midStr);

  // Répartition chronologique réaliste des 80 incidents SGABS sur la période Juin 2025 à Octobre 2026
  const startMs = new Date("2025-06-01T08:00:00.000Z").getTime();
  const endMs = new Date("2026-10-31T18:00:00.000Z").getTime();
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
    rootCause: profile.rootCause,
    resolution: profile.resolution,
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
  midStr: string
): TechnicalProfile {
  const titleLower = ref.title.toLowerCase();
  const domain = ref.domain;
  const comp = ref.component;

  // 1. CAS GAB - RETRAIT / DISPENSE / CASH
  if (titleLower.includes("cash") || titleLower.includes("retrait") || titleLower.includes("dispense") || titleLower.includes("cassette")) {
    return {
      description: `Incident de distribution d'espèces sur le réseau GAB SGABS : ${ref.title}. Les porteurs subissent des anomalies de délivrance physique avec désynchronisation entre le débit du compte et le statut matériel du distributeur CDM.`,
      channel: "GAB / ATM NCR & Diebold",
      operation: "Retrait d'espèces (Cash Withdrawal - DE3=010000)",
      network: "GIMAC / VISA / Réseau Interne SGABS",
      host: "SRV-ATM-POWERCARD-01",
      observation: {
        symptom: "Le porteur insère sa carte, valide son code PIN, le débit apparaît sur le compte mais l'obturateur (shutter) ne délivre aucun billet ou présente une liasse incomplète.",
        facts: `Plus de 48 réclamations clients enregistrées sur le cluster GAB Agence Principale & Plateaux. Taux de rejet brutal de 92% entre 10h15 et 11h30 sur les transactions > 50 000 XOF.`,
        scope: `GAB motorisés NCR Personas et Diebold Opteva rattachés au concentrateur frontal PowerCard SGABS.`,
        context: "Pic d'affluence de fin de mois (virement salaires fonctionnaires) combiné à un rechargement physique récent des cassettes billets.",
      },
      flowSteps: [
        { position: 1, source: "GAB / ATM", destination: "Frontal PowerCard", event: "ISO 0200 Demande d'autorisation de retrait (DE3=010000, DE4=5000000)", status: "OK" },
        { position: 2, source: "Frontal PowerCard", destination: "CBS Sopra Amplitude", event: "Vérification solde et réservation des fonds (DE102 / DE103)", status: "OK" },
        { position: 3, source: "Frontal PowerCard", destination: "GAB / ATM", event: "ISO 0210 Autorisation accordée (DE39=00), ordre de distribution CDM", status: "OK" },
        { position: 4, source: "Distributeur CDM", destination: "Contrôleur ATM", event: "Incident mécanique : blocage dans le transporteur liasse ou cellule optique obstruée", status: "HARDWARE_JAM" },
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
          description: "Hypothèse 1 : Coupure totale de la liaison réseau télécom fibre optique reliant le GAB au frontal bancaire",
          status: "REJECTED",
          evidence: "Les pings ICMP et trames Echo Test 0800 sont stables à 14ms sans aucune perte de paquet constatée sur la passerelle CISCO.",
        },
        {
          description: "Hypothèse 2 : Bourrage physique ou défaillance du capteur d'épaisseur (Double Detect Sensor) sur la cassette de distribution CDM",
          status: "PROBABLE",
          evidence: "Le journal électronique (EJ) signale un code d'erreur matériel M-Status 14 (CDM Jam in Transport) sur le module de présentation.",
        },
        {
          description: "Hypothèse 3 : Désynchronisation du timer d'annulation (Take-Cash Timeout) : le GAB a rapatrié les billets au bac de purge sans émettre le message ISO 0420 au CBS",
          status: "CONFIRMED",
          evidence: "Corrélation formelle des logs : le message 0420 a expiré après 30s de rétention au bac de rejet, laissant le compte client débité sur Amplitude sans contrepassation.",
        },
      ],
      evidence: [
        { type: "Journal Électronique ATM", content: "M-STATUS: 14 [CDM TRANSPORT ERROR] - BILLETS DEVIÉS VERS PURGE BIN #3. AUCUN REVERSAL ÉMIS.", source: `Journal Électronique ${tidStr}` },
        { type: "Trace ISO 8583", content: "0200 accordé avec DE39=00 à 10:22:14. Aucun 0420 reçu avant le Cut-off de 10:23:00.", source: "Frontal PowerCard Log" },
      ],
      rootCause: {
        category: "Matériel ATM & Temporisation Reversal",
        description: "Anomalie combinée : encrassement du capteur optique de l'obturateur entraînant un faux positif de non-prise billets, suivi du crash du démon d'extourne locale suite au timeout 30s.",
        justification: "Démontré formellement par l'audit du journal électronique ATM et l'absence de trace de trame 0420 dans les logs de communication PowerCard.",
        validatedAt: new Date().toISOString(),
        validatedBy: "Oury Kohkoun (Expert Monétique)",
      },
      resolution: {
        actions: "Intervention du mainteneur NCR pour nettoyage des cellules optiques CDM, recalibrage du timer de présentation à 45s, et injection manuelle du fichier d'extourne comptable sur Sopra Amplitude.",
        executor: "Équipe Exploitation & Support GAB SGABS",
        approver: "Responsable Monétique SGABS",
        result: "Rétablissement de la disponibilité des GAB à 99.8% et régularisation sans perte de 48 comptes clients.",
      },
      prevention: [
        { action: "Mise en place d'une alerte Prometheus détectant tout écart entre 0210 débité et absence de 0420 sous 60s", owner: "Équipe Supervision", priority: "CRITICAL", status: "DONE" },
        { action: "Maintenance préventive bi-mensuelle obligatoire des capteurs optiques CDM sur les 80 GAB à fort trafic", owner: "Maintenance Matériel", priority: "HIGH", status: "DONE" },
      ],
    };
  }

  // 2. CAS REVERSAL / EXTOURNE / DOUBLON (INC-005, INC-006, INC-007, INC-077...)
  if (titleLower.includes("reversal") || titleLower.includes("extourne") || titleLower.includes("doublon") || titleLower.includes("débit")) {
    return {
      description: `Incident de non-réconciliation ou rejet d'annulation automatique : ${ref.title}. Les messages d'annulation 0400/0420 ne sont pas traités correctement par le Host émetteur.`,
      channel: "Switch ISO 8583 / Frontal PowerCard",
      operation: "Annulation de transaction (Reversal Advice - MTI 0420)",
      network: "GIMAC / Réseau Bancaire Interne SGABS",
      host: "HOST-POWERCARD-REVERSAL",
      observation: {
        symptom: "Rejets systématiques des messages d'annulation ISO 0420 avec code retour DE39=96 ou absence totale de prise en compte dans le Core Banking.",
        facts: "Plus de 65 annulations de retraits non acquittées sur le système central, générant des écarts comptables en suspense interbancaire.",
        scope: "Toutes les annulations initiées suite à des abandons porteurs ou des timeouts réseau sur le réseau GAB et TPE.",
        context: "Incident apparu suite à la modification du format du champ DE90 (Original Data Elements) lors d'un patch de sécurité du Switch.",
      },
      flowSteps: [
        { position: 1, source: "Frontal PowerCard", destination: "Switch National", event: "ISO 0420 Émission de l'annulation (DE90 original data elements)", status: "OK" },
        { position: 2, source: "Switch National", destination: "Core Banking Host", event: "Transmission de la demande de contre-passation", status: "OK" },
        { position: 3, source: "Core Banking Host", destination: "Base de Données", event: "Contrôle du champ DE90 : non-concordance de la date locale originale (DE12/DE13)", status: "DE90_MISMATCH" },
        { position: 4, source: "Core Banking Host", destination: "Switch National", event: "ISO 0430 Rejet de l'annulation avec DE39=96 (Erreur de syntaxe / Format)", status: "ERROR" },
        { position: 5, source: "Switch National", destination: "Frontal PowerCard", event: "Inscription de la transaction en suspens comptable non réconcilié", status: "SUSPENSE_BLOCKED" },
      ],
      isoMessages: [
        {
          mti: "0420",
          bitmap: "7238000008C08000",
          stan: stanStr,
          rrn: rrnStr,
          responseCode: "00",
          terminalId: tidStr,
          maskedRawMessage: `04207238000008C08000164500********128901000000020000...DE90=0200${stanStr}...`,
          fields: { DE3: "010000", DE4: "20000", DE11: stanStr, DE37: rrnStr, DE39: "00", DE41: tidStr, DE90: `0200${stanStr}1120000000` },
        },
        {
          mti: "0430",
          bitmap: "7238000008C08000",
          stan: stanStr,
          rrn: rrnStr,
          responseCode: "96",
          terminalId: tidStr,
          maskedRawMessage: `04307238000008C08000164500********128901000000020000...DE39=96`,
          fields: { DE3: "010000", DE11: stanStr, DE39: "96", DE41: tidStr },
        },
      ],
      hypotheses: [
        {
          description: "Hypothèse 1 : Le compte client est gelé ou sous saisie attribution bloquant l'injection de l'écriture au crédit",
          status: "REJECTED",
          evidence: "Vérification sur le CBS Sopra Amplitude confirmant que 100% des comptes clients concernés sont à l'état actif et ouvert.",
        },
        {
          description: "Hypothèse 2 : Dépassement de la fenêtre temporelle de compensation (Time-to-Live 60s) configurée sur la passerelle d'annulation",
          status: "PROBABLE",
          evidence: "Le timestamp montre un délai d'émission du 0420 oscillant entre 55s et 75s sous forte charge réseau.",
        },
        {
          description: "Hypothèse 3 : Incompatibilité du format de cadrage du champ DE90 (Original Data Elements) : omission du code acquéreur sur 11 caractères",
          status: "CONFIRMED",
          evidence: "Dump hexadécimal de la trame 0420 prouvant que le sous-champ DE90.3 (Acquiring Institution ID) était tronqué à 6 caractères au lieu de 11.",
        },
      ],
      evidence: [
        { type: "Log Switch ISO", content: "PARSER ERROR: Field DE90 length mismatch. Expected 42 bytes, received 37 bytes. Rejecting with DE39=96.", source: "Syslog Frontal PowerCard" },
        { type: "Trace Wireshark", content: "Frame 14920: ISO 0420 rejected by Host with 0430 (DE39=96 System Malfunction).", source: "Capture Réseau Port 8000" },
      ],
      rootCause: {
        category: "Interface ISO 8583 & Spécification DE90",
        description: "Mauvais formattage du champ DE90 dans le module d'assemblage des trames 0420 suite à la migration du micro-code du Switch, provoquant le rejet systématique par le Core Banking.",
        justification: "Démontré par l'alignement strict du paquet Wireshark avec la spécification technique ISO 8583 SGABS version 4.2.",
        validatedAt: new Date().toISOString(),
        validatedBy: "Oury Kohkoun (Expert Monétique)",
      },
      resolution: {
        actions: "Application d'un patch de cadrage ASCII sur le driver ISO PowerCard pour forcer le padding à gauche sur 11 positions pour DE90.3, puis recyclage à chaud du process.",
        executor: "Ingénierie Monétique SGABS",
        approver: "Direction des Systèmes d'Information SGABS",
        result: "Toutes les annulations en suspens sont passées avec succès avec DE39=00 et apurement complet des comptes d'attente.",
      },
      prevention: [
        { action: "Intégration d'un test de non-régression automatique sur la syntaxe DE90 dans le pipeline CI/CD", owner: "Qualité & Recette", priority: "HIGH", status: "DONE" },
        { action: "Automatisation du script de conciliation journalière des 0420 non acquittés à H+1", owner: "Exploitation Monétique", priority: "HIGH", status: "DONE" },
      ],
    };
  }

  // 3. CAS TPE / MARCHAND / POS (INC-011 à INC-020, INC-056 à INC-060)
  if (domain === "TPE" || titleLower.includes("tpe") || titleLower.includes("pos") || titleLower.includes("marchand") || titleLower.includes("merchant")) {
    return {
      description: `Incident sur le réseau d'acquisition TPE Commerçants SGABS : ${ref.title}. Rejets des autorisations marchands ou anomalies de télécollecte en fin de journée.`,
      channel: "Terminaux de Paiement Électronique (TPE Ingenico & Verifone)",
      operation: "Paiement CB / Vente Marchand (Purchase - DE3=000000)",
      network: "Passerelle GPRS / IP Sécurisée SGABS",
      host: "FRONTAL-TPE-ACQUIRER-01",
      observation: {
        symptom: "Les terminaux TPE des commerçants partenaires de la zone affichent 'Transaction Refusée' (DE39=05 ou DE39=91) lors des paiements par carte.",
        facts: "Plus de 350 transactions de paiement rejetées sur 42 terminaux marchands majeurs (grandes surfaces, hôtels, pharmacies) en l'espace de 40 minutes.",
        scope: "Réseau TPE raccordé à la passerelle IP du frontal acquéreur SGABS.",
        context: "Mise à jour périodique des tables de routage marchands et des clés de sécurité acquéreur.",
      },
      flowSteps: [
        { position: 1, source: "TPE Ingenico", destination: "Passerelle Monétique IP", event: "ISO 0200 Requête d'autorisation achat (DE3=000000, DE41=TID, DE42=MID)", status: "OK" },
        { position: 2, source: "Passerelle Monétique IP", destination: "Frontal PowerCard", event: "Routage selon Merchant ID et Terminal ID", status: "OK" },
        { position: 3, source: "Frontal PowerCard", destination: "Table Paramétrage Marchands", event: "Contrôle d'éligibilité du contrat commerçant : profil Merchant désynchronisé", status: "CONFIG_ERROR" },
        { position: 4, source: "Frontal PowerCard", destination: "Passerelle Monétique IP", event: "ISO 0210 Réponse négative générée localement (DE39=05 Do Not Honor)", status: "ERROR" },
        { position: 5, source: "Passerelle Monétique IP", destination: "TPE Ingenico", event: "Affichage 'Transaction Refusée' et impression ticket abandon", status: "ABANDON_PRINTED" },
      ],
      isoMessages: [
        {
          mti: "0200",
          bitmap: "7238000008C08000",
          stan: stanStr,
          rrn: rrnStr,
          responseCode: "00",
          terminalId: tidStr,
          maskedRawMessage: `02007238000008C08000164970********441200000001500009171200${stanStr}...`,
          fields: { DE3: "000000", DE4: "15000", DE11: stanStr, DE37: rrnStr, DE41: tidStr, DE42: midStr, DE49: "952" },
        },
        {
          mti: "0210",
          bitmap: "7238000008C08000",
          stan: stanStr,
          rrn: rrnStr,
          responseCode: respCode === "91" ? "91" : "05",
          terminalId: tidStr,
          maskedRawMessage: `02107238000008C08000164970********441200000001500009171200${stanStr}${respCode}...`,
          fields: { DE3: "000000", DE4: "15000", DE11: stanStr, DE37: rrnStr, DE39: respCode === "91" ? "91" : "05", DE41: tidStr, DE42: midStr },
        },
      ],
      hypotheses: [
        {
          description: "Hypothèse 1 : Problème de réseau télécom opérateur GSM/3G/4G bloquant l'acheminement des paquets des terminaux",
          status: "REJECTED",
          evidence: "La passerelle SSL/TLS confirme la réception intégrale des trames TCP port 8443 avec un temps de socket sain à 180ms.",
        },
        {
          description: "Hypothèse 2 : Dépassement des plafonds d'autorisation journaliers par carte bancaire sur le terminal commerçant",
          status: "PROBABLE",
          evidence: "Une partie des rejets correspondait effectivement à des cartes atteignant leur plafond mensuel de paiement.",
        },
        {
          description: "Hypothèse 3 : Désactivation ou mauvaise association du code Merchant ID (DE42) avec le Terminal ID (DE41) dans la table POS_MERCHANT_ROUTING de PowerCard",
          status: "CONFIRMED",
          evidence: "Audit de la table de configuration démontrant que suite au batch de nuit, le flag 'ACTIVE' est passé à 0 pour toute la série de MID concernés.",
        },
      ],
      evidence: [
        { type: "Log Applicatif Frontal", content: `[AUTH-REJECT] MID=${midStr} TID=${tidStr} : Merchant profile status is INACTIVE in local cache. Generating DE39=05.`, source: "Frontal PowerCard Routing Engine" },
        { type: "Trace ISO 8583", content: "TPE Transaction failed. ISO 0210 returned with DE39=05 to terminal IP 10.144.12.88.", source: "Passerelle TPE Log" },
      ],
      rootCause: {
        category: "Paramétrage Marchand & Moteur d'Acquisition",
        description: "Script de purge nocturne des contrats commerçants inactifs ayant erronément désactivé les profils des terminaux actifs de la filiale SGABS en raison d'un critère de date invalide.",
        justification: "Vérification directe dans la base de données SQL et confirmation par la réactivation immédiate du profil.",
        validatedAt: new Date().toISOString(),
        validatedBy: "Oury Kohkoun (Expert Monétique)",
      },
      resolution: {
        actions: "Exécution immédiate d'un script correctif SQL de réactivation des Merchant IDs affectés, rechargement à chaud du cache mémoire du frontal PowerCard et émission d'un ordre de rafraîchissement TMS vers les TPE.",
        executor: "Équipe Monétique & Exploitation POS SGABS",
        approver: "Responsable Monétique SGABS",
        result: "Rétablissement total des paiements marchands en moins de 15 minutes, taux de succès revenu à 99.4%.",
      },
      prevention: [
        { action: "Ajout d'un contrôle de cohérence préalable (Dry-Run) obligatoire sur tout script SQL modifiant la table des contrats marchands", owner: "Équipe DBA & Prod", priority: "CRITICAL", status: "DONE" },
        { action: "Notification automatique par webhook Teams/Slack en cas de pic de DE39=05 dépassant 5% du volume global", owner: "Supervision Monétique", priority: "HIGH", status: "DONE" },
      ],
    };
  }

  // 4. CAS EMV / CARTE / PIN / HSM (INC-021 à INC-030, INC-061 à INC-068)
  if (domain === "Carte" || domain === "Infrastructure" || titleLower.includes("emv") || titleLower.includes("hsm") || titleLower.includes("pin") || titleLower.includes("crypto") || titleLower.includes("arqc") || titleLower.includes("clé")) {
    return {
      description: `Incident de sécurité cryptographique et validation de puce EMV : ${ref.title}. Échec de validation des cryptogrammes de transaction ou de déchiffrement des blocs PIN sur le HSM Thales.`,
      channel: "Module de Sécurité Matériel (HSM Thales PayShield 9000)",
      operation: "Vérification cryptographique ARQC & PIN Block (DE52 / DE55)",
      network: "Bus Cryptographique Local Sécurisé SGABS",
      host: "HSM-PAYSHIELD-01-PRIMARY",
      observation: {
        symptom: "Rejets systématiques des transactions EMV avec DE39=55 (Code PIN erroné / Échec cryptogramme) ou DE39=96 (Erreur cryptographique interne).",
        facts: "Plus de 180 tentatives de paiement et retrait rejetées sur toutes les cartes à puce EMV émises par SGABS, alors que les cartes à piste ou sans contact en mode fallback passent.",
        scope: "Toutes les cartes bancaires SGABS EMV (BINs 4500xx, 5200xx, 6000xx) présentées sur le réseau d'acquisition.",
        context: "Incident survenu immédiatement après une rotation programmée des clés de session de zone de PIN (ZPK) et des clés maîtresses LMK.",
      },
      flowSteps: [
        { position: 1, source: "Terminal GAB / TPE", destination: "Frontal PowerCard", event: "ISO 0200 avec cryptogramme ARQC (DE55 tag 9F26) et bloc PIN chiffré (DE52)", status: "OK" },
        { position: 2, source: "Frontal PowerCard", destination: "HSM Thales PayShield 9000", event: "Commande Host 'M0' (Translate PIN from ZPK to LMK) et 'KQ' (Verify ARQC)", status: "OK" },
        { position: 3, source: "HSM Thales PayShield", destination: "Module Cryptographique", event: "Désynchronisation de clé ZPK : parité de clé incorrecte (Error Code 01)", status: "KEY_PARITY_ERROR" },
        { position: 4, source: "HSM Thales PayShield", destination: "Frontal PowerCard", event: "Réponse HSM d'erreur 'M1' / 'KR' : échec vérification cryptographique", status: "ERROR" },
        { position: 5, source: "Frontal PowerCard", destination: "Terminal GAB / TPE", event: "Génération de la réponse ISO 0210 avec DE39=55 (PIN Erroné / Crypto Failed)", status: "REJECTED_55" },
      ],
      isoMessages: [
        {
          mti: "0200",
          bitmap: "7238000008C08000",
          stan: stanStr,
          rrn: rrnStr,
          responseCode: "00",
          terminalId: tidStr,
          maskedRawMessage: `02007238000008C08000164500********9901000000020000...DE52=A4F8E2...DE55=9F26084B2...`,
          fields: { DE3: "010000", DE4: "20000", DE11: stanStr, DE37: rrnStr, DE41: tidStr, DE52: "A4F8E2109842BC01", DE55: "9F26084B2019448201A984" },
        },
        {
          mti: "0210",
          bitmap: "7238000008C08000",
          stan: stanStr,
          rrn: rrnStr,
          responseCode: "55",
          terminalId: tidStr,
          maskedRawMessage: `02107238000008C08000164500********9901000000020000...DE39=55`,
          fields: { DE3: "010000", DE11: stanStr, DE37: rrnStr, DE39: "55", DE41: tidStr },
        },
      ],
      hypotheses: [
        {
          description: "Hypothèse 1 : Les porteurs de cartes ont saisi un code secret PIN erroné 3 fois consécutives",
          status: "REJECTED",
          evidence: "Le phénomène est généralisé et touche simultanément des centaines de clients différents sur plusieurs terminaux distincts.",
        },
        {
          description: "Hypothèse 2 : Corruption physique du boîtier HSM Thales PayShield ou déclenchement du capteur anti-intrusion (Tamper Active)",
          status: "REJECTED",
          evidence: "La console console du HSM indique un état 'ONLINE NORMAL' avec un compteur d'alarmes physiques à 0.",
        },
        {
          description: "Hypothèse 3 : Dérive de clé ou mauvaise synchronisation de la clé de zone ZPK entre le frontal PowerCard et le HSM suite à un rechargement partiel",
          status: "CONFIRMED",
          evidence: "Les traces de commandes HSM révèlent un retour 'Code 01: Key parity error' lors de la translation du PIN block entre la ZPK acquéreur et la clé LMK.",
        },
      ],
      evidence: [
        { type: "Log Console HSM", content: "[CMD: M0] [RC: 01] KEY PARITY ERROR ON KEY IDENTIFIER ZPK_SGABS_01. VERIFICATION ABORTED.", source: "Thales PayShield Audit Log" },
        { type: "Syslog Frontal", content: "HSM translation failed for STAN 489214. Converting HSM Error 01 to ISO Response Code DE39=55.", source: "PowerCard Crypto Manager" },
      ],
      rootCause: {
        category: "Cryptographie Monétique & Gestion des Clés ZPK",
        description: "Désynchronisation de la valeur de vérification de clé (KCV - Key Check Value) sur la clé ZPK_SGABS_01 après un chargement incomplet des 3 composantes de clé par les officiers de sécurité.",
        justification: "Démontré par la discordance entre le KCV attendu (0x4E89B2) et le KCV réel calculé par le HSM (0x1128FA).",
        validatedAt: new Date().toISOString(),
        validatedBy: "Oury Kohkoun (Expert Monétique)",
      },
      resolution: {
        actions: "Convocation en urgence des 2 officiers de sécurité pour recomposition et saisie manuelle sécurisée sous double contrôle des 3 composantes de clé ZPK sur la console du HSM, suivie de la bascule du trafic.",
        executor: "Officiers de Sécurité Monétique SGABS",
        approver: "RSSI & Direction de la Sécurité Bancaire",
        result: "Validation du KCV 0x4E89B2, reprise nominale instantanée des validations de PIN et cryptogrammes ARQC sans aucun rejet.",
      },
      prevention: [
        { action: "Mise en place d'une procédure de double signature et test unitaire automatisé du KCV avant mise en service de toute nouvelle clé", owner: "Sécurité & Cryptographie", priority: "CRITICAL", status: "DONE" },
        { action: "Basculement automatique sur le HSM secondaire configuré avec les anciennes clés en cas d'erreur de parité", owner: "Architecture Monétique", priority: "HIGH", status: "DONE" },
      ],
    };
  }

  // 5. CAS SWITCH / RÉSEAUX INTERBANCAIRES / GIMAC / VISA / MASTERCARD (INC-031 à INC-040, INC-073 à INC-076)
  if (domain === "Switch" || domain === "PowerCard" || titleLower.includes("switch") || titleLower.includes("visa") || titleLower.includes("mastercard") || titleLower.includes("gimac") || titleLower.includes("routage") || titleLower.includes("queue") || titleLower.includes("pool")) {
    return {
      description: `Incident de routage et flux transactionnel interbancaire : ${ref.title}. Blocage ou saturation des passerelles de communication inter-réseaux.`,
      channel: "Switch Interbancaire & Passerelles GIMAC / VISA Base I",
      operation: "Routage transactionnel ISO 8583 (0100 / 0200)",
      network: "Réseau Interbancaire GIMAC / Liaisons Dédiées VISA VAP",
      host: "SWITCH-GW-INTERBANK-01",
      observation: {
        symptom: "Rejets massifs avec DE39=91 (Émetteur inaccessible) ou DE39=96 sur les transactions confrères (cartes SGABS sur GAB confrères ou cartes confrères sur GAB SGABS).",
        facts: "Plus de 400 transactions interbancaires en timeout consécutif en 25 minutes. La queue de messages du Switch s'accumule à plus de 1 200 requêtes en attente.",
        scope: "Ensemble du trafic interbancaire national et sous-régional transitant par le Switch GIMAC.",
        context: "Pic d'activité transactionnelle coïncidant avec une coupure de la liaison télécom principale de secours.",
      },
      flowSteps: [
        { position: 1, source: "Frontal PowerCard", destination: "Switch Interbancaire GIMAC", event: "ISO 0200 Demande d'autorisation interbancaire (MTI 0200, DE100 Dest)", status: "OK" },
        { position: 2, source: "Switch Interbancaire GIMAC", destination: "Socket TCP Réseau", event: "Tentative d'acheminement vers le concentrateur de l'émetteur distant", status: "SOCKET_TIMEOUT" },
        { position: 3, source: "Switch Interbancaire GIMAC", destination: "File de messages (Queue)", event: "Saturation de la file d'attente FIFO : dépassement de la limite de 1 000 messages", status: "QUEUE_OVERFLOW" },
        { position: 4, source: "Switch Interbancaire GIMAC", destination: "Frontal PowerCard", event: "Génération de la réponse ISO 0210 avec DE39=91 (Issuer Inaccessible)", status: "TIMEOUT_91" },
        { position: 5, source: "Frontal PowerCard", destination: "GAB / TPE Acquéreur", event: "Notification d'abandon client et restitution immédiate de la carte", status: "ABORT_COMPLETED" },
      ],
      isoMessages: [
        {
          mti: "0200",
          bitmap: "7238000008C08000",
          stan: stanStr,
          rrn: rrnStr,
          responseCode: "00",
          terminalId: tidStr,
          maskedRawMessage: `02007238000008C08000164284********901201000000030000...DE100=GIMAC...`,
          fields: { DE3: "010000", DE4: "30000", DE11: stanStr, DE37: rrnStr, DE41: tidStr, DE49: "952", DE100: "GIMAC" },
        },
        {
          mti: "0210",
          bitmap: "7238000008C08000",
          stan: stanStr,
          rrn: rrnStr,
          responseCode: "91",
          terminalId: tidStr,
          maskedRawMessage: `02107238000008C08000164284********901201000000030000...DE39=91`,
          fields: { DE3: "010000", DE11: stanStr, DE37: rrnStr, DE39: "91", DE41: tidStr },
        },
      ],
      hypotheses: [
        {
          description: "Hypothèse 1 : Panne générale électrique sur le Data Center principal du Switch régional",
          status: "REJECTED",
          evidence: "Confirmation par le NOC du Switch régional que les générateurs et onduleurs fonctionnent normalement.",
        },
        {
          description: "Hypothèse 2 : Fuite de mémoire ou épuisement des descripteurs de sockets sur le serveur de communication PowerCard",
          status: "PROBABLE",
          evidence: "La commande 'netstat -an | grep 8000' montre plus de 800 connexions à l'état CLOSE_WAIT non libérées.",
        },
        {
          description: "Hypothèse 3 : Blocage de la socket TCP principale suite à un gel du timer Keep-Alive sans bascule automatique sur le lien BGP secondaire",
          status: "CONFIRMED",
          evidence: "Les traces réseau montrent que la socket principale était silencieuse depuis 120s alors que la route de backup était opérationnelle mais non sollicitée.",
        },
      ],
      evidence: [
        { type: "Syslog Switch", content: "SOCKET ALERT: Remote endpoint 192.168.100.12:8000 unreachable. Keep-Alive timer expired after 30s. Queue depth: 1240 msgs.", source: "Syslog Passerelle GIMAC" },
        { type: "Monitoring Réseau", content: "TCP Reconnection loop on interface eth2. Packet drop rate: 100% on primary VLAN 240.", source: "Sonde Réseau SGABS" },
      ],
      rootCause: {
        category: "Réseau Interbancaire & Mécanisme de Failover",
        description: "Défaillance de la règle de bascule dynamique (Keep-Alive failover) sur le routeur de bordure, empêchant la migration automatique du trafic sur le lien de secours lors de la micro-coupure de la liaison principale.",
        justification: "Démontré par la corrélation entre les alertes d'état du routeur BGP et l'accumulation des messages dans la file d'attente.",
        validatedAt: new Date().toISOString(),
        validatedBy: "Oury Kohkoun (Expert Monétique)",
      },
      resolution: {
        actions: "Bascule manuelle forcée de la route BGP vers le lien télécom secondaire, réinitialisation du processus d'interface de communication PowerCard et vidage de la file d'attente bloquée.",
        executor: "Équipe Réseau & Exploitation Monétique SGABS",
        approver: "Responsable Infrastructure & Réseaux SGABS",
        result: "Rétablissement du flux interbancaire en moins de 8 minutes avec un taux de succès rétabli à 99.7%.",
      },
      prevention: [
        { action: "Reconfiguration du timer BFD (Bidirectional Forwarding Detection) à 300ms pour assurer une bascule automatique sans perte de session", owner: "Équipe Réseau", priority: "CRITICAL", status: "DONE" },
        { action: "Exercice mensuel de simulation de coupure de lien principal pour valider le basculement à chaud", owner: "PCA / Plan Continuité", priority: "HIGH", status: "DONE" },
      ],
    };
  }

  // 6. CAS CORE BANKING / CLEARING / COMPENSATION / EOD (INC-041 à INC-050, INC-077 à INC-080)
  return {
    description: `Incident d'intégration Core Banking et de clôture de compensation : ${ref.title}. Blocage lors de l'intégration des fichiers de compensation ou des écritures comptables d'arrêté journalier.`,
    channel: "Core Banking Sopra Amplitude & Moteur de Clearing",
    operation: "Compensation & Imputation Comptable (Clearing Batch & EOD)",
    network: "Réseau Interne Sécurisé SGABS / Banques Partenaires",
    host: "SRV-CBS-AMPLITUDE-PROD-01",
    observation: {
      symptom: "Le batch de fin de journée (EOD) ou le job d'intégration des fichiers de clearing reste bloqué indéfiniment ou se termine en code erreur ORA-00054 / ORA-01013.",
      facts: "Plus de 12 000 écritures de compensation interbancaire VISA et GIMAC non imputées sur les comptes d'attente, risquant de différer l'ouverture du service monétique du lendemain.",
      scope: "Système comptable central Sopra Amplitude et chaîne de réconciliation monétique SGABS.",
      context: "Exécution simultanée d'un traitement batch d'arrêté trimestriel et de l'intégration du fichier de compensation Base II.",
    },
    flowSteps: [
      { position: 1, source: "Moteur de Clearing", destination: "Serveur de Fichiers", event: "Lecture du fichier d'échanges interbancaire (Base II / TTF)", status: "OK" },
      { position: 2, source: "Moteur de Clearing", destination: "Base de Données Oracle CBS", event: "Lancement de la transaction d'imputation comptable par lot (Batch INSERT)", status: "OK" },
      { position: 3, source: "Base de Données Oracle CBS", destination: "Table COMPTES_MONETIQUE", event: "Tentative d'acquisition d'un verrou exclusif (LOCK TABLE) bloqué par une session concurrente", status: "ROW_LOCK_CONTENTION" },
      { position: 4, source: "Base de Données Oracle CBS", destination: "Moteur de Clearing", event: "Expiration du timer de transaction : erreur ORA-00054 Resource Busy", status: "ERROR_ORA_00054" },
      { position: 5, source: "Moteur de Clearing", destination: "Superviseur Ordonnancement", event: "Arrêt d'urgence du job et mise en suspense du fichier de compensation", status: "BATCH_SUSPENDED" },
    ],
    isoMessages: [
      {
        mti: "0500",
        bitmap: "7238000008C08000",
        stan: stanStr,
        rrn: rrnStr,
        responseCode: "00",
        terminalId: tidStr,
        maskedRawMessage: `05007238000008C08000...BATCH_ID=20261106_CLEARING...TOTAL_COUNT=12500...`,
        fields: { DE3: "900000", DE4: "125000000", DE11: stanStr, DE37: rrnStr, DE41: "BATCH-CLR", DE49: "952" },
      },
      {
        mti: "0510",
        bitmap: "7238000008C08000",
        stan: stanStr,
        rrn: rrnStr,
        responseCode: "96",
        terminalId: tidStr,
        maskedRawMessage: `05107238000008C08000...DE39=96...SYSTEM_LOCK_ERROR`,
        fields: { DE3: "900000", DE11: stanStr, DE39: "96", DE41: "BATCH-CLR" },
      },
    ],
    hypotheses: [
      {
        description: "Hypothèse 1 : Corruption physique ou syntaxique du fichier de compensation transmis par le réseau international",
        status: "REJECTED",
        evidence: "Contrôle de hash SHA-256 et validation de structure effectuée avec succès via l'utilitaire officiel de conformité Base II.",
      },
      {
        description: "Hypothèse 2 : Espace disque insuffisant (Tablespace Full) sur le volume Oracle DATA du Core Banking",
        status: "REJECTED",
        evidence: "La commande 'df -h' et la vue dba_free_space indiquent plus de 180 Go d'espace libre sur les tablespaces concernés.",
      },
      {
        description: "Hypothèse 3 : Verrouillage exclusif en cascade (Row-Level Lock) sur la table des comptes monétiques provoqué par l'exécution concurrente d'un job de calcul d'agios",
        status: "CONFIRMED",
        evidence: "La requête 'v$locked_object' montre que la session SID 512 (Job BATCH_AGIOS_CALC) détenait un verrou exclusif bloquant 8 sessions d'imputation depuis 42 minutes.",
      },
    ],
    evidence: [
      { type: "Oracle Alert Log", content: "ORA-00054: resource busy and acquire with NOWAIT specified or timeout expired. Blocking SID: 512, Blocked SID: 784.", source: "Oracle Database CBS Log" },
      { type: "Log Ordonnanceur", content: "Job J_CLEARING_INGEST_01 failed at step 4: Unable to acquire table lock on COMPTES_MONETIQUE.", source: "Control-M / Ordonnanceur IT" },
    ],
    rootCause: {
      category: "Base de Données CBS & Conflit d'Ordonnancement",
      description: "Chevauchement imprévu des fenêtres d'exécution entre le batch périodique de calcul des intérêts et l'intégration du fichier de compensation monétique, posant un verrou exclusif sur la table des comptes.",
      justification: "Démontré par la corrélation parfaite des logs de verrouillage Oracle v$session_blockers et des heures de démarrage Control-M.",
      validatedAt: new Date().toISOString(),
      validatedBy: "Oury Kohkoun (Expert Monétique)",
    },
    resolution: {
      actions: "Terminaison contrôlée de la session bloquante SID 512 après sauvegarde du point de reprise, relance immédiate du job d'intégration de compensation et recalibrage de la matrice d'exclusion Control-M.",
      executor: "DBA Senior & Exploitation Core Banking SGABS",
      approver: "Responsable des Opérations Bancaires SGABS",
      result: "Intégration complète des 12 000 écritures de compensation en 14 minutes sans aucun rejet comptable.",
    },
    prevention: [
      { action: "Ajout d'une règle d'exclusion mutuelle stricte dans l'ordonnanceur Control-M entre les jobs de batch comptables et le clearing monétique", owner: "Ordonnancement IT", priority: "CRITICAL", status: "DONE" },
      { action: "Mise en place d'un script de détection et alerte automatique sur les sessions Oracle en attente de verrou > 3 minutes", owner: "Équipe DBA", priority: "HIGH", status: "DONE" },
    ],
  };
}

