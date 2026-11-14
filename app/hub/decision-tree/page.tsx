"use client";

import { useState, useMemo } from "react";
import { AppShell } from "@/modules/layout/AppShell";
import { useSubsidiary } from "@/modules/layout/SubsidiaryContext";

// ============================================================================
// TYPES & MODÈLES DE DONNÉES DE L'ARBRE DÉCISIONNEL
// ============================================================================

export type DecisionNodeId =
  | "Q1" | "Q2" | "Q3" | "Q4" | "Q5" | "Q6" | "Q7" | "Q8" | "Q9" | "Q10" | "Q11" | "Q12"
  | "L1" | "L2" | "L3" | "L4" | "L5" | "L6" | "L7" | "L8" | "L9" | "L10";

export interface DecisionQuestion {
  id: DecisionNodeId;
  question: string;
  category: "VOLUMÉTRIE" | "CANAL_INTERNE" | "RESEAU_TCP" | "APPLICATION_HSM" | "BIN_CODES" | "GOUVERNANCE";
  explanation: string;
  verificationMethod: string;
  technicalCommands: string[];
  yesTarget: DecisionNodeId;
  noTarget: DecisionNodeId;
}

export interface DecisionConclusion {
  id: DecisionNodeId;
  title: string;
  subtitle: string;
  severity: "CRITIQUE" | "ÉLEVÉ" | "MOYEN" | "NOMINAL";
  badgeBg: string;
  badgeBorder: string;
  badgeColor: string;
  colorHex: string;
  rootCause: string;
  responsibleTeam: string;
  immediateActions: string[];
  escalationProcedure: string;
  associatedCodes: string[];
}

// Référentiel des 12 questions (Q1 à Q12)
export const DECISION_QUESTIONS: Record<string, DecisionQuestion> = {
  Q1: {
    id: "Q1",
    question: "Volume en chute de plus de 30 % ?",
    category: "VOLUMÉTRIE",
    explanation: "Compare le débit d'autorisation actuel (transactions/min) à la médiane historique observée à la même heure et jour de la semaine (J-7).",
    verificationMethod: "Contrôler la métrologie temps réel sur la console du switch monétique ou la table d'audit des flux entrants.",
    technicalCommands: [
      "select count(*), substr(date_heure, 1, 13) from switch_log where date_heure >= sysdate - 1/24 group by substr(date_heure, 1, 13);",
      "monetique-cli metrics --interval 5m --compare-j7",
    ],
    yesTarget: "Q3",
    noTarget: "Q2",
  },
  Q2: {
    id: "Q2",
    question: "Taux de timeouts au-dessus du seuil ?",
    category: "VOLUMÉTRIE",
    explanation: "Vérifie si le pourcentage de transactions sans réponse (code réponse DE39=91 ou time-out socket > 20s) dépasse le seuil toléré de 2 %.",
    verificationMethod: "Calculer le ratio (Transactions non répondues / Transactions totales) sur les 10 dernières minutes.",
    technicalCommands: [
      "select count(case when de39 in ('91', '96') then 1 end)*100.0/count(*) as pct_err from auth_trans where timestamp >= sysdate - 10/1440;",
    ],
    yesTarget: "Q9",
    noTarget: "L1",
  },
  Q3: {
    id: "Q3",
    question: "Transactions encore reçues par InternalChannel ?",
    category: "CANAL_INTERNE",
    explanation: "Valide si le frontal switch (canal d'entrée jPOS / ISO 8583) reçoit physiquement des requêtes d'autorisation en provenance des GAB, TPE et serveurs commerçants.",
    verificationMethod: "Inspecter le canal d'entrée 'InternalChannel' ou les interfaces d'acquisition amont.",
    technicalCommands: [
      "grep -i 'InternalChannel' /var/log/switch/jpos.log | tail -n 50",
      "netstat -an | grep 15000 | grep ESTABLISHED",
    ],
    yesTarget: "Q4",
    noTarget: "L2",
  },
  Q4: {
    id: "Q4",
    question: "Écho 0800 répondu par un 0810 ?",
    category: "RESEAU_TCP",
    explanation: "Teste le protocole de maintien de session ISO 8583 (Echo Test / Network Management MTI 0800 avec DE70=301) vers le partenaire distant ou le serveur d'autorisation.",
    verificationMethod: "Émettre une trame 0800 manuelle ou surveiller les battements de cœur (Heartbeats) automatiques du switch.",
    technicalCommands: [
      "iso-test --mti 0800 --de70 301 --channel ExternalChannel",
      "tail -f /var/log/switch/iso_traffic.log | grep -E '0800|0810'",
    ],
    yesTarget: "Q9",
    noTarget: "Q5",
  },
  Q5: {
    id: "Q5",
    question: "Ping vers le partenaire OK ?",
    category: "RESEAU_TCP",
    explanation: "Teste la connectivité réseau de niveau 3 (ICMP) entre le switch local et l'adresse IP de la passerelle ou du serveur partenaire.",
    verificationMethod: "Exécuter des pings ICMP répétés avec contrôle du TTL et de la perte de paquets.",
    technicalCommands: [
      "ping -c 5 10.120.45.10",
      "traceroute -n 10.120.45.10",
    ],
    yesTarget: "Q6",
    noTarget: "L3",
  },
  Q6: {
    id: "Q6",
    question: "Port TCP joignable ?",
    category: "RESEAU_TCP",
    explanation: "Vérifie l'établissement de la poignée de main TCP (SYN/ACK) sur le port d'écoute ISO du partenaire (souvent port 5000, 7000, 8583 ou 12000).",
    verificationMethod: "Tenter une ouverture de socket TCP via Netcat ou Test-NetConnection.",
    technicalCommands: [
      "nc -zv -w 5 10.120.45.10 8583",
      "telnet 10.120.45.10 8583",
      "Test-NetConnection -ComputerName 10.120.45.10 -Port 8583",
    ],
    yesTarget: "Q7",
    noTarget: "L4",
  },
  Q7: {
    id: "Q7",
    question: "Canal ExternalChannel connecté ?",
    category: "APPLICATION_HSM",
    explanation: "Valide si l'adaptateur de canal logiciel du switch (ex: jPOS ISOChannel ou QServer) a le statut actif, connecté et synchronisé.",
    verificationMethod: "Consulter la console d'administration jPOS ou les MBeans JMX du frontal monétique.",
    technicalCommands: [
      "echo 'status ExternalChannel' | nc localhost 9999",
      "jpos-cli channel --name ExternalChannel --info",
    ],
    yesTarget: "Q8",
    noTarget: "L5",
  },
  Q8: {
    id: "Q8",
    question: "Le HSM répond-il ?",
    category: "APPLICATION_HSM",
    explanation: "Contrôle la disponibilité du module de sécurité matériel (Hardware Security Module Thales / SafeNet) pour le chiffrement/déchiffrement des PIN Blocks (DE52) et la validation MAC/ARQC.",
    verificationMethod: "Envoyer une commande de diagnostic de vie HSM (ex: commande 'NC' ou 'NO' diagnostic santé).",
    technicalCommands: [
      "hsm-test --host 10.10.20.5 --port 1500 --cmd 'NC'",
      "tail -n 100 /var/log/switch/hsm_crypto.log | grep -E 'HSM_TIMEOUT|HSM_COMM_ERROR'",
    ],
    yesTarget: "L7",
    noTarget: "L6",
  },
  Q9: {
    id: "Q9",
    question: "Timeouts sur un seul BIN émetteur ?",
    category: "BIN_CODES",
    explanation: "Isole les échecs par préfixe de carte (6 premiers chiffres / Bank Identification Number - DE2) pour distinguer une panne globale d'un émetteur particulier hors-service.",
    verificationMethod: "Agréger les rejets et timeouts par groupe de BIN (DE2 substr 1, 6).",
    technicalCommands: [
      "select substr(pan, 1, 6) as bin, count(*) from auth_log where de39 in ('91', '96') and date_heure >= sysdate - 15/1440 group by substr(pan, 1, 6);",
    ],
    yesTarget: "L8",
    noTarget: "Q10",
  },
  Q10: {
    id: "Q10",
    question: "Codes 91 ou 96 dominants ?",
    category: "BIN_CODES",
    explanation: "Distingue les pannes techniques (DE39=91 Système émetteur inopérant, DE39=96 Dysfonctionnement système) des rejets fonctionnels (DE39=51 Provision insuffisante, DE39=55 PIN erroné).",
    verificationMethod: "Analyser la distribution des codes réponse DE39 sur la fenêtre d'incident.",
    technicalCommands: [
      "select de39, count(*) from auth_trans where timestamp >= sysdate - 15/1440 group by de39 order by count(*) desc;",
    ],
    yesTarget: "Q11",
    noTarget: "L9",
  },
  Q11: {
    id: "Q11",
    question: "Incident confirmé par la supervision réseau ?",
    category: "GOUVERNANCE",
    explanation: "Consulte le monitoring réseau étendu (NOC, routeurs MPLS, liaison télécoms VSAT ou fibre de secours) pour savoir si une alerte d'infrastructure a déjà été levée.",
    verificationMethod: "Vérifier le tableau de bord SolarWinds / PRTG / Zabbix et contacter l'astreinte réseau.",
    technicalCommands: [
      "curl -s http://monitoring-noc.lan/api/alerts?status=ACTIVE | jq '.[] | select(.tag==\"MONETIQUE\")'",
    ],
    yesTarget: "L7",
    noTarget: "Q12",
  },
  Q12: {
    id: "Q12",
    question: "Changement ou déploiement récent (< 2 h) ?",
    category: "GOUVERNANCE",
    explanation: "Vérifie si une mise en production, un déploiement de patch binaire, une mise à jour de tables de routage ou de clés crypto a eu lieu dans les deux dernières heures.",
    verificationMethod: "Consulter le registre des changements (Change Management) et l'historique des déploiements récents.",
    technicalCommands: [
      "git log -n 5 --since='2 hours ago' /opt/switch/conf",
      "cat /var/log/deployments.log | tail -n 20",
    ],
    yesTarget: "L10",
    noTarget: "L9",
  },
};

// Référentiel des 10 conclusions (L1 à L10)
export const DECISION_CONCLUSIONS: Record<string, DecisionConclusion> = {
  L1: {
    id: "L1",
    title: "Pas de panne",
    subtitle: "Surveiller",
    severity: "NOMINAL",
    badgeBg: "#ecfdf5",
    badgeBorder: "#a7f3d0",
    badgeColor: "#047857",
    colorHex: "#10b981",
    rootCause: "Le volume transactionnel et les taux d'approbation sont nominaux. Les métriques respectent les plages de tolérance habituelles.",
    responsibleTeam: "Supervision Monétique N1",
    immediateActions: [
      "Maintenir la surveillance de routine sans action corrective.",
      "Vérifier les alertes de seuil préventives (seuil d'alerte anticipé à 2 %).",
    ],
    escalationProcedure: "Aucune escalade requise. Classement nominal.",
    associatedCodes: ["00 (Accord)", "0810 (Écho OK)"],
  },
  L2: {
    id: "L2",
    title: "Panne amont acquéreur",
    subtitle: "Terminaux, GAB, canal d'entrée",
    severity: "CRITIQUE",
    badgeBg: "#e0f2fe",
    badgeBorder: "#7dd3fc",
    badgeColor: "#0369a1",
    colorHex: "#0284c7",
    rootCause: "Rupture de flux avant le switch. Le concentrateur GAB, les serveurs d'acquisition commerçant ou les routeurs d'agences n'acheminent plus les requêtes vers le canal d'entrée 'InternalChannel'.",
    responsibleTeam: "Équipe GAB & Support Réseau Agences",
    immediateActions: [
      "Vérifier les concentrateurs GAB/TPE (serveurs Base24, NCR Aptra, Wincor ProView).",
      "Contrôler l'état des liaisons VPN/MPLS reliant les agences bancaires au Datacenter.",
      "Redémarrer le service d'écoute du canal d'entrée 'InternalChannel' si l'amont émet des paquets.",
    ],
    escalationProcedure: "Alerte d'urgence P1 au Support GAB, responsable réseau télécoms et astreinte exploitation agences.",
    associatedCodes: ["Perte complète de flux", "Socket Reset Amont"],
  },
  L3: {
    id: "L3",
    title: "Réseau ou liaison",
    subtitle: "Équipe réseau",
    severity: "CRITIQUE",
    badgeBg: "#ffedd5",
    badgeBorder: "#fdba74",
    badgeColor: "#c2410c",
    colorHex: "#f97316",
    rootCause: "Rupture physique ou routage de niveau 3 (IP). L'adresse IP du partenaire distant est totalement injoignable (perte 100 % au ping).",
    responsibleTeam: "Équipe Réseau & Télécoms",
    immediateActions: [
      "Vérifier l'état de l'interface réseau locale et du routeur de sortie.",
      "Bascule manuelle ou automatique vers la liaison télécoms de secours (VSAT / Fibre secondaire).",
      "Ouvrir un ticket d'incident immédiat auprès du fournisseur d'accès ou opérateur télécoms (Orange, Moov, MTN, etc.).",
    ],
    escalationProcedure: "Escalade d'astreinte Réseau N2/N3 avec statut 'Coupure Ligne Louée'.",
    associatedCodes: ["Destination Host Unreachable", "Packet Loss 100%"],
  },
  L4: {
    id: "L4",
    title: "Port fermé ou pare-feu",
    subtitle: "Partenaire + sécurité réseau",
    severity: "CRITIQUE",
    badgeBg: "#ffedd5",
    badgeBorder: "#ea580c",
    badgeColor: "#9a3412",
    colorHex: "#ea580c",
    rootCause: "L'adresse IP répond au ping (L3 OK) mais la socket TCP sur le port ISO 8583 refuse les connexions. Cause : pare-feu (Firewall) bloquant, translation NAT corrompue ou service applicatif arrêté chez le partenaire.",
    responsibleTeam: "Sécurité Réseau (Firewall) & NOC Partenaire",
    immediateActions: [
      "Vérifier les logs du pare-feu local (CheckPoint, Fortinet, Cisco ASA) pour repérer d'éventuels paquets DROP/REJECT.",
      "Contacter le NOC du partenaire pour vérifier que leur listener TCP est bien à l'écoute sur le port convenu.",
      "Vérifier la validité des certificats TLS/mTLS si la liaison utilise un tunnel chiffré.",
    ],
    escalationProcedure: "Appel conjoint Ingénieur Réseau Sécurité interne et homologue technique du partenaire.",
    associatedCodes: ["Connection Refused", "TCP SYN Timeout"],
  },
  L5: {
    id: "L5",
    title: "Canal déconnecté",
    subtitle: "Support applicatif N2",
    severity: "ÉLEVÉ",
    badgeBg: "#eff6ff",
    badgeBorder: "#bfdbfe",
    badgeColor: "#1d4ed8",
    colorHex: "#3b82f6",
    rootCause: "La socket TCP de transport est ouverte mais l'adaptateur de canal logiciel 'ExternalChannel' du switch est dans un état arrêté, désynchronisé ou déconnecté.",
    responsibleTeam: "Support Applicatif Monétique N2",
    immediateActions: [
      "Se connecter sur la console d'administration du switch monétique (jPOS / Postilion / BPC).",
      "Envoyer l'instruction de redémarrage propre du canal (ex: `jpos restart ExternalChannel`).",
      "Vérifier que les paquets d'en-tête (Header TPDU, longueur 2 octets réseau) correspondent à la spécification bilatérale.",
    ],
    escalationProcedure: "Mobiliser l'ingénieur d'exploitation switch N2 de permanence.",
    associatedCodes: ["Channel Inactive", "Session Desynchronized"],
  },
  L6: {
    id: "L6",
    title: "HSM indisponible",
    subtitle: "Équipe HSM + sécurité",
    severity: "CRITIQUE",
    badgeBg: "#fef2f2",
    badgeBorder: "#f87171",
    badgeColor: "#dc2626",
    colorHex: "#ef4444",
    rootCause: "Le boîtier cryptographique matériel (HSM Thales PayShield ou SafeNet Luna EFT) ne répond pas aux requêtes de validation PIN (DE52) et calcul MAC/ARQC. Sans HSM, le switch ne peut autoriser aucune transaction par carte.",
    responsibleTeam: "Équipe Sécurité Cryptographique & HSM",
    immediateActions: [
      "Vérifier les voyants de santé en façade du HSM et la console de supervision crypto.",
      "Basculer immédiatement sur le HSM secondaire / Backup via la matrice de bascule.",
      "Vérifier les liaisons TCP internes reliant le switch au boîtier HSM (port 1500 ou 1600).",
    ],
    escalationProcedure: "Alerte de crise Sécurité Cryptographique P1. Incident bloquant pour 100 % des flux cartes.",
    associatedCodes: ["HSM Timeout", "DE52 Crypto Failure", "Error 96"],
  },
  L7: {
    id: "L7",
    title: "Partenaire muet",
    subtitle: "Escalade côté réseau",
    severity: "CRITIQUE",
    badgeBg: "#fffbeb",
    badgeBorder: "#fde68a",
    badgeColor: "#b45309",
    colorHex: "#d97706",
    rootCause: "Toute l'infrastructure locale est opérationnelle (TCP ouvert, canal connecté, HSM OK), mais le partenaire ne renvoie aucune trame 0210/0110 en réponse aux requêtes (Phénomène de trou noir / Black Hole).",
    responsibleTeam: "NOC Partenaire (Visa / Mastercard / GIM / Confrère)",
    immediateActions: [
      "Appeler d'urgence la passerelle / le NOC du partenaire pour signaler l'absence totale de réponse.",
      "Vérifier si le partenaire applique une procédure de Stand-in (SAF / Autorisation de secours).",
      "Vérifier les captures réseau Wireshark confirmant l'envoi des trames 0200 sans aucun paquet retour.",
    ],
    escalationProcedure: "Déclaration d'incident chez le partenaire avec fourniture de la capture PCAP.",
    associatedCodes: ["DE39=91 (Switching system inoperative)", "No reply timeout"],
  },
  L8: {
    id: "L8",
    title: "Émetteur en cause",
    subtitle: "Contacter l'émetteur",
    severity: "MOYEN",
    badgeBg: "#faf5ff",
    badgeBorder: "#e9d5ff",
    badgeColor: "#7e22ce",
    colorHex: "#a855f7",
    rootCause: "Les échecs et timeouts se concentrent exclusivement sur un seul BIN émetteur (DE2). L'infrastructure globale du switch et les autres banques fonctionnent parfaitement.",
    responsibleTeam: "Service Relation Partenaires & Confrères",
    immediateActions: [
      "Isoler les RRN et cartes impactées pour le BIN identifié.",
      "Contacter le responsable technique de la banque émettrice pour lui signaler son indisponibilité.",
      "Si nécessaire, activer un routage de repli ou un message d'information ciblé sur les GAB pour les porteurs de cette banque.",
    ],
    escalationProcedure: "Communication formelle au centre de traitement de la banque émettrice.",
    associatedCodes: ["DE39=91 ciblé", "DE39=96 ciblé"],
  },
  L9: {
    id: "L9",
    title: "Dégradation partielle",
    subtitle: "Surveiller + prévenir N2",
    severity: "MOYEN",
    badgeBg: "#f1f5f9",
    badgeBorder: "#cbd5e1",
    badgeColor: "#334155",
    colorHex: "#64748b",
    rootCause: "La dégradation est diffuse sans dominante franche de codes techniques 91/96, sans rupture réseau ni déploiement récent. Risque de contention base CBS, saturation de threads ou ralentissement périodique.",
    responsibleTeam: "Support N2 & DBA Core Banking",
    immediateActions: [
      "Analyser la charge CPU et I/O du serveur d'autorisation et de la base Core Banking.",
      "Vérifier les files d'attente de messages (Message Queues MQ/Kafka/JMS).",
      "Activer les traces fines (DEBUG) sur un échantillon pour isoler la cause du ralentissement.",
    ],
    escalationProcedure: "Signalement au support applicatif N2 et aux administrateurs de bases de données.",
    associatedCodes: ["DE39=05 (Do not honor)", "DE39=96 sporadique"],
  },
  L10: {
    id: "L10",
    title: "Régression post-changement",
    subtitle: "Escalade changement + rollback",
    severity: "CRITIQUE",
    badgeBg: "#fefce8",
    badgeBorder: "#fef08a",
    badgeColor: "#854d0e",
    colorHex: "#eab308",
    rootCause: "L'incident fait suite immédiate à une mise en production ou modification de configuration survenue dans les 2 dernières heures. Forte présomption de régression logicielle ou d'incompatibilité de paramètres.",
    responsibleTeam: "Équipe Release & Astreinte Changement",
    immediateActions: [
      "Informer immédiatement le Manager d'astreinte et le responsable de la Release.",
      "Engager la procédure d'urgence de Rollback (revenir à la version binaire ou de configuration précédente).",
      "Conserver tous les logs de l'incident pour analyse post-mortem ultérieure.",
    ],
    escalationProcedure: "Déclenchement du plan de retour-arrière d'urgence (Rollback Procédure P1).",
    associatedCodes: ["DE39=96", "Assertion Failure", "Uncaught Exception"],
  },
};

export default function DecisionTreePage() {
  const { isAFG } = useSubsidiary();

  // Mode d'affichage actif
  const [activeTab, setActiveTab] = useState<"SIMULATOR" | "VISUAL_TREE" | "DIRECTORY">("SIMULATOR");

  // État du simulateur pas-à-pas
  const [currentStepId, setCurrentStepId] = useState<DecisionNodeId>("Q1");
  const [historyTrail, setHistoryTrail] = useState<{ nodeId: DecisionNodeId; answer?: "OUI" | "NON" }[]>([
    { nodeId: "Q1" },
  ]);

  // Nœud sélectionné pour voir sa fiche technique détaillée
  const [inspectedNodeId, setInspectedNodeId] = useState<DecisionNodeId>("Q1");

  // Réinitialiser le simulateur
  const resetSimulator = () => {
    setCurrentStepId("Q1");
    setHistoryTrail([{ nodeId: "Q1" }]);
    setInspectedNodeId("Q1");
  };

  // Répondre à une question du simulateur
  const handleAnswer = (answer: "OUI" | "NON") => {
    const question = DECISION_QUESTIONS[currentStepId];
    if (!question) return;

    const nextId = answer === "OUI" ? question.yesTarget : question.noTarget;

    // Mise à jour de l'historique
    const newTrail = [
      ...historyTrail.slice(0, -1),
      { nodeId: currentStepId, answer },
      { nodeId: nextId },
    ];

    setHistoryTrail(newTrail);
    setCurrentStepId(nextId);
    setInspectedNodeId(nextId);
  };

  // Revenir à une étape antérieure dans le simulateur
  const handleJumpToHistoryStep = (index: number) => {
    const targetItem = historyTrail[index];
    if (!targetItem) return;

    setCurrentStepId(targetItem.nodeId);
    setHistoryTrail(historyTrail.slice(0, index + 1));
    setInspectedNodeId(targetItem.nodeId);
  };

  // Informations sur l'étape courante du simulateur
  const isConclusionReached = currentStepId.startsWith("L");
  const activeQuestion = !isConclusionReached ? DECISION_QUESTIONS[currentStepId] : null;
  const activeConclusion = isConclusionReached ? DECISION_CONCLUSIONS[currentStepId] : null;

  // Détail du nœud inspecté
  const inspectedQuestion = DECISION_QUESTIONS[inspectedNodeId];
  const inspectedConclusion = DECISION_CONCLUSIONS[inspectedNodeId];

  // Palette dynamique
  const brandPrimary = isAFG ? "#00a800" : "#e60028";
  const brandHover = isAFG ? "#15803d" : "#99001b";

  return (
    <AppShell
      pageTitle="Arbre de Diagnostic d'une Panne d'Autorisation"
      eyebrow="ARBRE DÉCISIONNEL & FORENSICS MONÉTIQUE"
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem", width: "100%" }}>
        
        {/* ========================================================================= */}
        {/* 1. HERO COMMAND CENTER : Titre & Navigation des Modes                     */}
        {/* ========================================================================= */}
        <section
          style={{
            background: "linear-gradient(135deg, #0b1320 0%, #111e33 60%, #0a1727 100%)",
            color: "#ffffff",
            padding: "24px 28px",
            borderRadius: "14px",
            border: "1px solid #1e2e47",
            borderLeft: `5px solid ${brandPrimary}`,
            boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.35)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "18px" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                <span
                  style={{
                    fontSize: "11px",
                    fontWeight: 800,
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    padding: "3px 8px",
                    borderRadius: "4px",
                    background: "rgba(0, 168, 0, 0.15)",
                    color: brandPrimary,
                    border: "1px solid rgba(0, 168, 0, 0.3)",
                  }}
                >
                  🌳 ARBRE DÉCISIONNEL HOMOLOGUÉ
                </span>
                <span style={{ fontSize: "12px", color: "#64748b" }}>•</span>
                <span style={{ fontSize: "12px", color: "#94a3b8", fontWeight: 600 }}>
                  12 Questions déterministes (Q1-Q12) · 10 Diagnostics ciblés (L1-L10)
                </span>
              </div>

              <h1 style={{ fontSize: "24px", fontWeight: 800, color: "#ffffff", margin: "0 0 6px 0", letterSpacing: "-0.02em" }}>
                Arbre de Diagnostic d'une Panne d'Autorisation
              </h1>
              <p style={{ color: "#94a3b8", fontSize: "13.5px", margin: 0, maxWidth: "820px", lineHeight: "1.5" }}>
                Méthode formelle d'investigation en cas de chute de volume ou d'explosion de timeouts sur le switch monétique. 
                Permet d'isoler avec certitude le composant défaillant (Amont GAB, Réseau L3, Pare-feu L4, Canal applicatif jPOS, Boîtier HSM, ou Partenaire émetteur).
              </p>
            </div>

            {/* Onglets de bascule de vue */}
            <div style={{ display: "flex", background: "#070d18", padding: "4px", borderRadius: "10px", border: "1px solid #1e2e47" }}>
              <button
                type="button"
                onClick={() => setActiveTab("SIMULATOR")}
                style={{
                  padding: "8px 16px",
                  borderRadius: "7px",
                  fontWeight: 700,
                  fontSize: "13px",
                  cursor: "pointer",
                  border: "none",
                  background: activeTab === "SIMULATOR" ? brandPrimary : "transparent",
                  color: activeTab === "SIMULATOR" ? "#ffffff" : "#94a3b8",
                  transition: "all 0.15s ease",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <span>🧭</span> Simulateur Pas-à-Pas
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("VISUAL_TREE")}
                style={{
                  padding: "8px 16px",
                  borderRadius: "7px",
                  fontWeight: 700,
                  fontSize: "13px",
                  cursor: "pointer",
                  border: "none",
                  background: activeTab === "VISUAL_TREE" ? brandPrimary : "transparent",
                  color: activeTab === "VISUAL_TREE" ? "#ffffff" : "#94a3b8",
                  transition: "all 0.15s ease",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <span>📊</span> Schéma Complet de l'Arbre
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("DIRECTORY")}
                style={{
                  padding: "8px 16px",
                  borderRadius: "7px",
                  fontWeight: 700,
                  fontSize: "13px",
                  cursor: "pointer",
                  border: "none",
                  background: activeTab === "DIRECTORY" ? brandPrimary : "transparent",
                  color: activeTab === "DIRECTORY" ? "#ffffff" : "#94a3b8",
                  transition: "all 0.15s ease",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <span>📖</span> Répertoire des Runbooks
              </button>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* VUE 1 : ASSISTANT SIMULATEUR PAS-À-PAS                                   */}
        {/* ========================================================================= */}
        {activeTab === "SIMULATOR" && (
          <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: "24px", alignItems: "flex-start" }}>
            
            {/* Colonne gauche : Processus décisionnel interactif */}
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              
              {/* Fil d'Ariane du cheminement */}
              <div
                style={{
                  background: "#ffffff",
                  borderRadius: "12px",
                  border: "1px solid #e2e8f0",
                  padding: "16px 20px",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                  <span style={{ fontSize: "11.5px", fontWeight: 800, color: "#64748b", textTransform: "uppercase" }}>
                    Parcours Décisionnel ({historyTrail.length} étape(s))
                  </span>
                  <button
                    onClick={resetSimulator}
                    style={{
                      background: "#f1f5f9",
                      border: "1px solid #cbd5e1",
                      borderRadius: "6px",
                      padding: "4px 10px",
                      fontSize: "12px",
                      fontWeight: 700,
                      color: "#475569",
                      cursor: "pointer",
                    }}
                  >
                    🔄 Recommencer depuis Q1
                  </button>
                </div>

                {/* Étapes du fil d'Ariane cliquables */}
                <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", alignItems: "center" }}>
                  {historyTrail.map((step, idx) => {
                    const isLast = idx === historyTrail.length - 1;
                    return (
                      <div key={idx} style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                        <button
                          onClick={() => handleJumpToHistoryStep(idx)}
                          style={{
                            padding: "4px 10px",
                            borderRadius: "6px",
                            fontSize: "12px",
                            fontWeight: 800,
                            fontFamily: "monospace",
                            background: isLast ? brandPrimary : "#f1f5f9",
                            color: isLast ? "#ffffff" : "#0f172a",
                            border: `1px solid ${isLast ? brandPrimary : "#cbd5e1"}`,
                            cursor: "pointer",
                          }}
                        >
                          {step.nodeId}
                          {step.answer && (
                            <span style={{ marginLeft: "6px", opacity: 0.85, fontWeight: 700 }}>
                              ({step.answer})
                            </span>
                          )}
                        </button>
                        {!isLast && <span style={{ color: "#94a3b8", fontSize: "12px" }}>➔</span>}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Carte Question en cours OU Conclusion finale */}
              {!isConclusionReached && activeQuestion ? (
                <div
                  style={{
                    background: "#ffffff",
                    borderRadius: "14px",
                    border: "2px solid #3b82f6",
                    padding: "28px",
                    boxShadow: "0 4px 14px rgba(59, 130, 246, 0.12)",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
                    <span
                      style={{
                        background: "#dbeafe",
                        color: "#1d4ed8",
                        padding: "3px 10px",
                        borderRadius: "6px",
                        fontSize: "13px",
                        fontWeight: 800,
                        fontFamily: "monospace",
                      }}
                    >
                      QUESTION {activeQuestion.id}
                    </span>
                    <span
                      style={{
                        background: "#f1f5f9",
                        color: "#475569",
                        padding: "2px 8px",
                        borderRadius: "4px",
                        fontSize: "11px",
                        fontWeight: 700,
                        textTransform: "uppercase",
                      }}
                    >
                      {activeQuestion.category}
                    </span>
                  </div>

                  <h2 style={{ fontSize: "22px", fontWeight: 800, color: "#0f172a", margin: "0 0 12px 0", lineHeight: "1.35" }}>
                    {activeQuestion.question}
                  </h2>

                  <p style={{ fontSize: "14px", color: "#475569", lineHeight: "1.6", marginBottom: "20px" }}>
                    {activeQuestion.explanation}
                  </p>

                  <div style={{ background: "#f8fafc", padding: "14px 16px", borderRadius: "8px", border: "1px solid #e2e8f0", marginBottom: "24px" }}>
                    <span style={{ fontSize: "11px", fontWeight: 800, color: "#64748b", textTransform: "uppercase", display: "block", marginBottom: "4px" }}>
                      🔍 Méthode de vérification sur les équipements :
                    </span>
                    <span style={{ fontSize: "13px", color: "#1e293b", fontWeight: 600 }}>
                      {activeQuestion.verificationMethod}
                    </span>
                  </div>

                  {/* Boutons d'action Oui / Non */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                    <button
                      onClick={() => handleAnswer("NON")}
                      style={{
                        padding: "14px",
                        borderRadius: "10px",
                        border: "2px solid #ef4444",
                        background: "#fff1f2",
                        color: "#991b1b",
                        fontSize: "16px",
                        fontWeight: 800,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "8px",
                        transition: "all 0.15s ease",
                      }}
                    >
                      <span>❌</span> NON
                    </button>

                    <button
                      onClick={() => handleAnswer("OUI")}
                      style={{
                        padding: "14px",
                        borderRadius: "10px",
                        border: "2px solid #10b981",
                        background: "#ecfdf5",
                        color: "#065f46",
                        fontSize: "16px",
                        fontWeight: 800,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "8px",
                        transition: "all 0.15s ease",
                      }}
                    >
                      <span>✓</span> OUI
                    </button>
                  </div>
                </div>
              ) : activeConclusion ? (
                /* CONCLUSION FINALE DU DIAGNOSTIC */
                <div
                  style={{
                    background: "#ffffff",
                    borderRadius: "14px",
                    border: `2px solid ${activeConclusion.colorHex}`,
                    padding: "28px",
                    boxShadow: `0 8px 24px ${activeConclusion.badgeBg}`,
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <span
                        style={{
                          background: activeConclusion.colorHex,
                          color: "#ffffff",
                          padding: "4px 12px",
                          borderRadius: "6px",
                          fontSize: "13px",
                          fontWeight: 800,
                          fontFamily: "monospace",
                        }}
                      >
                        DIAGNOSTIC {activeConclusion.id}
                      </span>
                      <span
                        style={{
                          background: activeConclusion.badgeBg,
                          color: activeConclusion.badgeColor,
                          border: `1px solid ${activeConclusion.badgeBorder}`,
                          padding: "3px 10px",
                          borderRadius: "4px",
                          fontSize: "11px",
                          fontWeight: 800,
                          textTransform: "uppercase",
                        }}
                      >
                        NIVEAU : {activeConclusion.severity}
                      </span>
                    </div>

                    <span style={{ fontSize: "12px", color: "#64748b", fontWeight: 600 }}>
                      Cheminement terminé en {historyTrail.length - 1} saut(s)
                    </span>
                  </div>

                  <h2 style={{ fontSize: "24px", fontWeight: 800, color: "#0f172a", margin: "0 0 4px 0" }}>
                    {activeConclusion.title}
                  </h2>
                  <div style={{ fontSize: "14px", color: activeConclusion.colorHex, fontWeight: 700, marginBottom: "16px" }}>
                    {activeConclusion.subtitle}
                  </div>

                  <div style={{ background: "#f8fafc", padding: "16px", borderRadius: "10px", border: "1px solid #e2e8f0", marginBottom: "20px" }}>
                    <h4 style={{ fontSize: "12px", fontWeight: 800, color: "#475569", textTransform: "uppercase", margin: "0 0 6px 0" }}>
                      🔍 Cause Racine Technique (RCA) :
                    </h4>
                    <p style={{ fontSize: "13.5px", color: "#1e293b", margin: 0, lineHeight: "1.5" }}>
                      {activeConclusion.rootCause}
                    </p>
                  </div>

                  {/* Équipe responsable & Plan d'actions */}
                  <div style={{ marginBottom: "20px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
                      <span style={{ fontSize: "14px" }}>👥</span>
                      <span style={{ fontSize: "13px", color: "#475569" }}>
                        Équipe d'escalade : <strong style={{ color: "#0f172a" }}>{activeConclusion.responsibleTeam}</strong>
                      </span>
                    </div>

                    <h4 style={{ fontSize: "12px", fontWeight: 800, color: "#475569", textTransform: "uppercase", margin: "0 0 8px 0" }}>
                      📋 Plan d'actions immédiat :
                    </h4>
                    <ul style={{ margin: 0, paddingLeft: "18px", fontSize: "13px", color: "#334155", lineHeight: "1.6" }}>
                      {activeConclusion.immediateActions.map((action, idx) => (
                        <li key={idx} style={{ marginBottom: "4px" }}>{action}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Bouton de réinitialisation */}
                  <button
                    onClick={resetSimulator}
                    style={{
                      width: "100%",
                      padding: "12px",
                      borderRadius: "8px",
                      border: "none",
                      background: brandPrimary,
                      color: "#ffffff",
                      fontSize: "14px",
                      fontWeight: 700,
                      cursor: "pointer",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                    }}
                  >
                    🔄 Lancer une autre analyse
                  </button>
                </div>
              ) : null}
            </div>

            {/* Colonne droite : Fiche technique du nœud sélectionné */}
            <div
              style={{
                background: "#ffffff",
                borderRadius: "14px",
                border: "1px solid #e2e8f0",
                padding: "24px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
                <span style={{ fontSize: "14px" }}>📌</span>
                <span style={{ fontSize: "12px", fontWeight: 800, color: "#64748b", textTransform: "uppercase" }}>
                  Fiche Technique d'Aide à l'Exploitation
                </span>
              </div>

              {inspectedQuestion ? (
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                    <span style={{ background: "#dbeafe", color: "#1d4ed8", padding: "2px 8px", borderRadius: "4px", fontSize: "11px", fontWeight: 800 }}>
                      {inspectedQuestion.id}
                    </span>
                    <strong style={{ fontSize: "14px", color: "#0f172a" }}>
                      {inspectedQuestion.question}
                    </strong>
                  </div>

                  <p style={{ fontSize: "13px", color: "#475569", lineHeight: "1.5", marginBottom: "16px" }}>
                    {inspectedQuestion.explanation}
                  </p>

                  <div style={{ marginBottom: "16px" }}>
                    <span style={{ fontSize: "11px", fontWeight: 800, color: "#64748b", textTransform: "uppercase", display: "block", marginBottom: "6px" }}>
                      💻 Commandes CLI recommandées :
                    </span>
                    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                      {inspectedQuestion.technicalCommands.map((cmd, idx) => (
                        <pre
                          key={idx}
                          style={{
                            margin: 0,
                            padding: "8px 12px",
                            background: "#0f172a",
                            color: "#38bdf8",
                            borderRadius: "6px",
                            fontSize: "11px",
                            fontFamily: "monospace",
                            overflowX: "auto",
                            whiteSpace: "pre-wrap",
                            wordBreak: "break-all",
                          }}
                        >
                          {cmd}
                        </pre>
                      ))}
                    </div>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", fontSize: "12px" }}>
                    <div style={{ background: "#ecfdf5", padding: "8px 10px", borderRadius: "6px", border: "1px solid #a7f3d0" }}>
                      <strong style={{ color: "#065f46" }}>Si OUI :</strong> ➔ Passe à {inspectedQuestion.yesTarget}
                    </div>
                    <div style={{ background: "#fff1f2", padding: "8px 10px", borderRadius: "6px", border: "1px solid #fecaca" }}>
                      <strong style={{ color: "#991b1b" }}>Si NON :</strong> ➔ Passe à {inspectedQuestion.noTarget}
                    </div>
                  </div>
                </div>
              ) : inspectedConclusion ? (
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                    <span style={{ background: inspectedConclusion.colorHex, color: "#ffffff", padding: "2px 8px", borderRadius: "4px", fontSize: "11px", fontWeight: 800 }}>
                      {inspectedConclusion.id}
                    </span>
                    <strong style={{ fontSize: "14px", color: "#0f172a" }}>
                      {inspectedConclusion.title}
                    </strong>
                  </div>

                  <p style={{ fontSize: "13px", color: "#475569", lineHeight: "1.5", marginBottom: "16px" }}>
                    {inspectedConclusion.rootCause}
                  </p>

                  <div style={{ background: "#f8fafc", padding: "12px", borderRadius: "6px", border: "1px solid #e2e8f0", marginBottom: "12px" }}>
                    <span style={{ fontSize: "11px", fontWeight: 800, color: "#64748b", textTransform: "uppercase", display: "block", marginBottom: "4px" }}>
                      Procédure d'escalade :
                    </span>
                    <span style={{ fontSize: "12.5px", color: "#0f172a" }}>
                      {inspectedConclusion.escalationProcedure}
                    </span>
                  </div>

                  <div style={{ fontSize: "12px", color: "#475569" }}>
                    Codes associés : <strong>{inspectedConclusion.associatedCodes.join(" · ")}</strong>
                  </div>
                </div>
              ) : null}
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* VUE 2 : SCHÉMA COMPLET HAUTE FIDÉLITÉ DE L'ARBRE (VISUAL TREE)           */}
        {/* ========================================================================= */}
        {activeTab === "VISUAL_TREE" && (
          <div
            style={{
              background: "#ffffff",
              borderRadius: "14px",
              border: "1px solid #e2e8f0",
              padding: "28px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
              overflowX: "auto",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <div>
                <h3 style={{ fontSize: "18px", fontWeight: 800, color: "#0f172a", margin: "0 0 4px 0" }}>
                  Représentation Visuelle Complète de l'Arbre Décisionnel
                </h3>
                <p style={{ fontSize: "13px", color: "#64748b", margin: 0 }}>
                  Cliquez sur n'importe quel nœud pour afficher instantanément sa description technique et ses commandes CLI.
                </p>
              </div>

              {/* Légende rapide */}
              <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap", fontSize: "11.5px" }}>
                <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                  <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#3b82f6" }} /> Question
                </span>
                <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                  <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#10b981" }} /> Nominal (L1)
                </span>
                <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                  <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#ef4444" }} /> Bloquant / Panne (L2-L7)
                </span>
                <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                  <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#a855f7" }} /> Émetteur ciblé (L8)
                </span>
                <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                  <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#eab308" }} /> Rollback (L10)
                </span>
              </div>
            </div>

            {/* GRILLE DU SCHÉMA DÉCISIONNEL */}
            <div style={{ minWidth: "960px", display: "flex", flexDirection: "column", gap: "28px", alignItems: "center" }}>
              
              {/* NIVEAU 1 : RACINE Q1 */}
              <div
                onClick={() => setInspectedNodeId("Q1")}
                style={{
                  background: inspectedNodeId === "Q1" ? "#dbeafe" : "#ffffff",
                  border: `2px solid ${inspectedNodeId === "Q1" ? "#2563eb" : "#3b82f6"}`,
                  borderRadius: "24px",
                  padding: "12px 28px",
                  textAlign: "center",
                  cursor: "pointer",
                  boxShadow: "0 4px 12px rgba(59, 130, 246, 0.15)",
                  maxWidth: "320px",
                }}
              >
                <div style={{ fontSize: "11px", fontWeight: 800, color: "#2563eb" }}>Q1</div>
                <div style={{ fontSize: "13.5px", fontWeight: 800, color: "#0f172a" }}>
                  Volume en chute de plus de 30 % ?
                </div>
              </div>

              {/* LIGNES D'AIGUILLAGE DE Q1 */}
              <div style={{ width: "65%", display: "flex", justifyContent: "space-between", position: "relative" }}>
                <span style={{ fontSize: "12px", fontWeight: 800, color: "#ef4444" }}>↙ Non</span>
                <span style={{ fontSize: "12px", fontWeight: 800, color: "#10b981" }}>Oui ↘</span>
              </div>

              {/* NIVEAU 2 : Q2 et Q3 */}
              <div style={{ width: "90%", display: "flex", justifyContent: "space-between" }}>
                
                {/* BRANCHE GAUCHE (NON) : Q2 */}
                <div style={{ width: "45%", display: "flex", flexDirection: "column", alignItems: "center", gap: "20px" }}>
                  <div
                    onClick={() => setInspectedNodeId("Q2")}
                    style={{
                      background: inspectedNodeId === "Q2" ? "#dbeafe" : "#ffffff",
                      border: "2px solid #3b82f6",
                      borderRadius: "20px",
                      padding: "10px 20px",
                      textAlign: "center",
                      cursor: "pointer",
                      width: "280px",
                    }}
                  >
                    <div style={{ fontSize: "11px", fontWeight: 800, color: "#2563eb" }}>Q2</div>
                    <div style={{ fontSize: "13px", fontWeight: 700, color: "#0f172a" }}>
                      Taux de timeouts au-dessus du seuil ?
                    </div>
                  </div>

                  <div style={{ width: "100%", display: "flex", justifyContent: "space-between", padding: "0 20px" }}>
                    <span style={{ fontSize: "11.5px", fontWeight: 800, color: "#10b981" }}>↙ Oui (➔ Q9)</span>
                    <span style={{ fontSize: "11.5px", fontWeight: 800, color: "#ef4444" }}>Non (➔ L1) ↘</span>
                  </div>

                  {/* L1 : Pas de panne */}
                  <div style={{ width: "100%", display: "flex", justifyContent: "flex-end" }}>
                    <div
                      onClick={() => setInspectedNodeId("L1")}
                      style={{
                        background: "#ecfdf5",
                        border: "2px solid #10b981",
                        borderRadius: "10px",
                        padding: "10px 16px",
                        textAlign: "center",
                        cursor: "pointer",
                        width: "180px",
                      }}
                    >
                      <div style={{ fontSize: "12px", fontWeight: 800, color: "#047857" }}>L1 · Pas de panne</div>
                      <div style={{ fontSize: "11px", color: "#065f46" }}>Surveiller</div>
                    </div>
                  </div>

                  {/* Q9 : Branche Timeout spécifique */}
                  <div
                    onClick={() => setInspectedNodeId("Q9")}
                    style={{
                      background: inspectedNodeId === "Q9" ? "#dbeafe" : "#ffffff",
                      border: "2px solid #3b82f6",
                      borderRadius: "20px",
                      padding: "10px 20px",
                      textAlign: "center",
                      cursor: "pointer",
                      width: "280px",
                    }}
                  >
                    <div style={{ fontSize: "11px", fontWeight: 800, color: "#2563eb" }}>Q9</div>
                    <div style={{ fontSize: "13px", fontWeight: 700, color: "#0f172a" }}>
                      Timeouts sur un seul BIN émetteur ?
                    </div>
                  </div>

                  <div style={{ width: "100%", display: "flex", justifyContent: "space-between", padding: "0 20px" }}>
                    <span style={{ fontSize: "11.5px", fontWeight: 800, color: "#ef4444" }}>↙ Non (➔ Q10)</span>
                    <span style={{ fontSize: "11.5px", fontWeight: 800, color: "#10b981" }}>Oui (➔ L8) ↘</span>
                  </div>

                  {/* L8 : Émetteur en cause */}
                  <div style={{ width: "100%", display: "flex", justifyContent: "flex-end" }}>
                    <div
                      onClick={() => setInspectedNodeId("L8")}
                      style={{
                        background: "#faf5ff",
                        border: "2px solid #a855f7",
                        borderRadius: "10px",
                        padding: "10px 16px",
                        textAlign: "center",
                        cursor: "pointer",
                        width: "200px",
                      }}
                    >
                      <div style={{ fontSize: "12px", fontWeight: 800, color: "#7e22ce" }}>L8 · Émetteur en cause</div>
                      <div style={{ fontSize: "11px", color: "#6b21a8" }}>Contacter l'émetteur</div>
                    </div>
                  </div>

                  {/* Q10 : Codes 91 ou 96 dominants */}
                  <div
                    onClick={() => setInspectedNodeId("Q10")}
                    style={{
                      background: inspectedNodeId === "Q10" ? "#dbeafe" : "#ffffff",
                      border: "2px solid #3b82f6",
                      borderRadius: "20px",
                      padding: "10px 20px",
                      textAlign: "center",
                      cursor: "pointer",
                      width: "280px",
                    }}
                  >
                    <div style={{ fontSize: "11px", fontWeight: 800, color: "#2563eb" }}>Q10</div>
                    <div style={{ fontSize: "13px", fontWeight: 700, color: "#0f172a" }}>
                      Codes 91 ou 96 dominants ?
                    </div>
                  </div>

                  {/* Q11 / Q12 / L9 / L10 */}
                  <div
                    onClick={() => setInspectedNodeId("Q11")}
                    style={{
                      background: inspectedNodeId === "Q11" ? "#dbeafe" : "#ffffff",
                      border: "2px solid #3b82f6",
                      borderRadius: "20px",
                      padding: "10px 20px",
                      textAlign: "center",
                      cursor: "pointer",
                      width: "280px",
                    }}
                  >
                    <div style={{ fontSize: "11px", fontWeight: 800, color: "#2563eb" }}>Q11</div>
                    <div style={{ fontSize: "13px", fontWeight: 700, color: "#0f172a" }}>
                      Incident confirmé par la supervision réseau ?
                    </div>
                  </div>

                  <div
                    onClick={() => setInspectedNodeId("Q12")}
                    style={{
                      background: inspectedNodeId === "Q12" ? "#dbeafe" : "#ffffff",
                      border: "2px solid #3b82f6",
                      borderRadius: "20px",
                      padding: "10px 20px",
                      textAlign: "center",
                      cursor: "pointer",
                      width: "280px",
                    }}
                  >
                    <div style={{ fontSize: "11px", fontWeight: 800, color: "#2563eb" }}>Q12</div>
                    <div style={{ fontSize: "13px", fontWeight: 700, color: "#0f172a" }}>
                      Changement ou déploiement récent (&lt; 2 h) ?
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
                    <div
                      onClick={() => setInspectedNodeId("L9")}
                      style={{
                        background: "#f1f5f9",
                        border: "2px solid #64748b",
                        borderRadius: "10px",
                        padding: "8px 14px",
                        textAlign: "center",
                        cursor: "pointer",
                        fontSize: "11.5px",
                      }}
                    >
                      <strong>L9 · Dégradation partielle</strong>
                      <div style={{ color: "#64748b" }}>Surveiller + prévenir N2</div>
                    </div>

                    <div
                      onClick={() => setInspectedNodeId("L10")}
                      style={{
                        background: "#fefce8",
                        border: "2px solid #eab308",
                        borderRadius: "10px",
                        padding: "8px 14px",
                        textAlign: "center",
                        cursor: "pointer",
                        fontSize: "11.5px",
                      }}
                    >
                      <strong style={{ color: "#854d0e" }}>L10 · Régression post-change</strong>
                      <div style={{ color: "#a16207" }}>Escalade + rollback</div>
                    </div>
                  </div>
                </div>

                {/* BRANCHE DROITE (OUI) : Q3 -> Q4 -> Q5 -> Q6 -> Q7 -> Q8 */}
                <div style={{ width: "45%", display: "flex", flexDirection: "column", alignItems: "center", gap: "20px" }}>
                  
                  {/* Q3 */}
                  <div
                    onClick={() => setInspectedNodeId("Q3")}
                    style={{
                      background: inspectedNodeId === "Q3" ? "#dbeafe" : "#ffffff",
                      border: "2px solid #3b82f6",
                      borderRadius: "20px",
                      padding: "10px 20px",
                      textAlign: "center",
                      cursor: "pointer",
                      width: "280px",
                    }}
                  >
                    <div style={{ fontSize: "11px", fontWeight: 800, color: "#2563eb" }}>Q3</div>
                    <div style={{ fontSize: "13px", fontWeight: 700, color: "#0f172a" }}>
                      Transactions encore reçues par InternalChannel ?
                    </div>
                  </div>

                  {/* L2 : Panne amont */}
                  <div style={{ width: "100%", display: "flex", justifyContent: "flex-end" }}>
                    <div
                      onClick={() => setInspectedNodeId("L2")}
                      style={{
                        background: "#e0f2fe",
                        border: "2px solid #0284c7",
                        borderRadius: "10px",
                        padding: "10px 16px",
                        textAlign: "center",
                        cursor: "pointer",
                        width: "220px",
                      }}
                    >
                      <div style={{ fontSize: "12px", fontWeight: 800, color: "#0369a1" }}>L2 · Panne amont acquéreur</div>
                      <div style={{ fontSize: "11px", color: "#0284c7" }}>Terminaux, GAB, canal d'entrée</div>
                    </div>
                  </div>

                  {/* Q4 */}
                  <div
                    onClick={() => setInspectedNodeId("Q4")}
                    style={{
                      background: inspectedNodeId === "Q4" ? "#dbeafe" : "#ffffff",
                      border: "2px solid #3b82f6",
                      borderRadius: "20px",
                      padding: "10px 20px",
                      textAlign: "center",
                      cursor: "pointer",
                      width: "280px",
                    }}
                  >
                    <div style={{ fontSize: "11px", fontWeight: 800, color: "#2563eb" }}>Q4</div>
                    <div style={{ fontSize: "13px", fontWeight: 700, color: "#0f172a" }}>
                      Écho 0800 répondu par un 0810 ?
                    </div>
                  </div>

                  {/* Q5 */}
                  <div
                    onClick={() => setInspectedNodeId("Q5")}
                    style={{
                      background: inspectedNodeId === "Q5" ? "#dbeafe" : "#ffffff",
                      border: "2px solid #3b82f6",
                      borderRadius: "20px",
                      padding: "10px 20px",
                      textAlign: "center",
                      cursor: "pointer",
                      width: "280px",
                    }}
                  >
                    <div style={{ fontSize: "11px", fontWeight: 800, color: "#2563eb" }}>Q5</div>
                    <div style={{ fontSize: "13px", fontWeight: 700, color: "#0f172a" }}>
                      Ping vers le partenaire OK ?
                    </div>
                  </div>

                  {/* L3 : Réseau */}
                  <div style={{ width: "100%", display: "flex", justifyContent: "flex-end" }}>
                    <div
                      onClick={() => setInspectedNodeId("L3")}
                      style={{
                        background: "#ffedd5",
                        border: "2px solid #f97316",
                        borderRadius: "10px",
                        padding: "10px 16px",
                        textAlign: "center",
                        cursor: "pointer",
                        width: "200px",
                      }}
                    >
                      <div style={{ fontSize: "12px", fontWeight: 800, color: "#c2410c" }}>L3 · Réseau ou liaison</div>
                      <div style={{ fontSize: "11px", color: "#ea580c" }}>Équipe réseau</div>
                    </div>
                  </div>

                  {/* Q6 */}
                  <div
                    onClick={() => setInspectedNodeId("Q6")}
                    style={{
                      background: inspectedNodeId === "Q6" ? "#dbeafe" : "#ffffff",
                      border: "2px solid #3b82f6",
                      borderRadius: "20px",
                      padding: "10px 20px",
                      textAlign: "center",
                      cursor: "pointer",
                      width: "280px",
                    }}
                  >
                    <div style={{ fontSize: "11px", fontWeight: 800, color: "#2563eb" }}>Q6</div>
                    <div style={{ fontSize: "13px", fontWeight: 700, color: "#0f172a" }}>
                      Port TCP joignable ?
                    </div>
                  </div>

                  {/* L4 : Port fermé */}
                  <div style={{ width: "100%", display: "flex", justifyContent: "flex-end" }}>
                    <div
                      onClick={() => setInspectedNodeId("L4")}
                      style={{
                        background: "#ffedd5",
                        border: "2px solid #ea580c",
                        borderRadius: "10px",
                        padding: "10px 16px",
                        textAlign: "center",
                        cursor: "pointer",
                        width: "220px",
                      }}
                    >
                      <div style={{ fontSize: "12px", fontWeight: 800, color: "#9a3412" }}>L4 · Port fermé ou pare-feu</div>
                      <div style={{ fontSize: "11px", color: "#c2410c" }}>Partenaire + sécurité réseau</div>
                    </div>
                  </div>

                  {/* Q7 */}
                  <div
                    onClick={() => setInspectedNodeId("Q7")}
                    style={{
                      background: inspectedNodeId === "Q7" ? "#dbeafe" : "#ffffff",
                      border: "2px solid #3b82f6",
                      borderRadius: "20px",
                      padding: "10px 20px",
                      textAlign: "center",
                      cursor: "pointer",
                      width: "280px",
                    }}
                  >
                    <div style={{ fontSize: "11px", fontWeight: 800, color: "#2563eb" }}>Q7</div>
                    <div style={{ fontSize: "13px", fontWeight: 700, color: "#0f172a" }}>
                      Canal ExternalChannel connecté ?
                    </div>
                  </div>

                  {/* L5 & Q8 */}
                  <div style={{ width: "100%", display: "flex", justifyContent: "space-between" }}>
                    <div
                      onClick={() => setInspectedNodeId("L5")}
                      style={{
                        background: "#eff6ff",
                        border: "2px solid #3b82f6",
                        borderRadius: "10px",
                        padding: "10px 14px",
                        textAlign: "center",
                        cursor: "pointer",
                        width: "180px",
                      }}
                    >
                      <div style={{ fontSize: "11.5px", fontWeight: 800, color: "#1d4ed8" }}>L5 · Canal déconnecté</div>
                      <div style={{ fontSize: "10.5px", color: "#2563eb" }}>Support applicatif N2</div>
                    </div>

                    <div
                      onClick={() => setInspectedNodeId("Q8")}
                      style={{
                        background: inspectedNodeId === "Q8" ? "#dbeafe" : "#ffffff",
                        border: "2px solid #3b82f6",
                        borderRadius: "20px",
                        padding: "10px 16px",
                        textAlign: "center",
                        cursor: "pointer",
                        width: "180px",
                      }}
                    >
                      <div style={{ fontSize: "11px", fontWeight: 800, color: "#2563eb" }}>Q8</div>
                      <div style={{ fontSize: "12px", fontWeight: 700, color: "#0f172a" }}>Le HSM répond-il ?</div>
                    </div>
                  </div>

                  {/* L6 & L7 */}
                  <div style={{ width: "100%", display: "flex", justifyContent: "space-between" }}>
                    <div
                      onClick={() => setInspectedNodeId("L7")}
                      style={{
                        background: "#fffbeb",
                        border: "2px solid #d97706",
                        borderRadius: "10px",
                        padding: "10px 14px",
                        textAlign: "center",
                        cursor: "pointer",
                        width: "180px",
                      }}
                    >
                      <div style={{ fontSize: "11.5px", fontWeight: 800, color: "#b45309" }}>L7 · Partenaire muet</div>
                      <div style={{ fontSize: "10.5px", color: "#d97706" }}>Escalade côté réseau</div>
                    </div>

                    <div
                      onClick={() => setInspectedNodeId("L6")}
                      style={{
                        background: "#fef2f2",
                        border: "2px solid #ef4444",
                        borderRadius: "10px",
                        padding: "10px 14px",
                        textAlign: "center",
                        cursor: "pointer",
                        width: "180px",
                      }}
                    >
                      <div style={{ fontSize: "11.5px", fontWeight: 800, color: "#dc2626" }}>L6 · HSM indisponible</div>
                      <div style={{ fontSize: "10.5px", color: "#b91c1c" }}>Équipe HSM + sécurité</div>
                    </div>
                  </div>

                </div>

              </div>

            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* VUE 3 : RÉPERTOIRE EXHAUSTIF DES 12 QUESTIONS ET 10 RUNBOOKS             */}
        {/* ========================================================================= */}
        {activeTab === "DIRECTORY" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            
            {/* 1. Les 10 Fiches Diagnostics & Runbooks (L1 à L10) */}
            <div style={{ background: "#ffffff", borderRadius: "14px", border: "1px solid #e2e8f0", padding: "24px" }}>
              <h3 style={{ fontSize: "17px", fontWeight: 800, color: "#0f172a", margin: "0 0 16px 0" }}>
                🎯 Les 10 Diagnostics Terminaux (Feuilles L1 à L10)
              </h3>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "16px" }}>
                {Object.values(DECISION_CONCLUSIONS).map((conc) => (
                  <div
                    key={conc.id}
                    style={{
                      background: "#f8fafc",
                      borderRadius: "10px",
                      border: `1px solid ${conc.badgeBorder}`,
                      borderLeft: `4px solid ${conc.colorHex}`,
                      padding: "16px",
                      display: "flex",
                      flexDirection: "column",
                      gap: "8px",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: "12px", fontWeight: 800, color: conc.colorHex, fontFamily: "monospace" }}>
                        {conc.id} · {conc.title}
                      </span>
                      <span
                        style={{
                          fontSize: "10px",
                          fontWeight: 800,
                          padding: "2px 6px",
                          borderRadius: "4px",
                          background: conc.badgeBg,
                          color: conc.badgeColor,
                        }}
                      >
                        {conc.severity}
                      </span>
                    </div>

                    <div style={{ fontSize: "12px", fontWeight: 700, color: "#334155" }}>
                      {conc.subtitle}
                    </div>

                    <p style={{ fontSize: "12px", color: "#64748b", margin: 0, lineHeight: "1.4" }}>
                      {conc.rootCause}
                    </p>

                    <div style={{ fontSize: "11.5px", color: "#0f172a", marginTop: "4px" }}>
                      Responsable : <strong>{conc.responsibleTeam}</strong>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 2. Les 12 Questions Décisionnelles (Q1 à Q12) */}
            <div style={{ background: "#ffffff", borderRadius: "14px", border: "1px solid #e2e8f0", padding: "24px" }}>
              <h3 style={{ fontSize: "17px", fontWeight: 800, color: "#0f172a", margin: "0 0 16px 0" }}>
                🔍 Les 12 Tests &amp; Questions Opérationnelles (Q1 à Q12)
              </h3>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "16px" }}>
                {Object.values(DECISION_QUESTIONS).map((quest) => (
                  <div
                    key={quest.id}
                    style={{
                      background: "#f8fafc",
                      borderRadius: "10px",
                      border: "1px solid #e2e8f0",
                      padding: "16px",
                      display: "flex",
                      flexDirection: "column",
                      gap: "8px",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: "12px", fontWeight: 800, color: "#2563eb", fontFamily: "monospace" }}>
                        {quest.id}
                      </span>
                      <span style={{ fontSize: "10px", fontWeight: 700, color: "#64748b", background: "#e2e8f0", padding: "2px 6px", borderRadius: "4px" }}>
                        {quest.category}
                      </span>
                    </div>

                    <strong style={{ fontSize: "13px", color: "#0f172a" }}>
                      {quest.question}
                    </strong>

                    <p style={{ fontSize: "12px", color: "#64748b", margin: 0, lineHeight: "1.4" }}>
                      {quest.explanation}
                    </p>

                    <div style={{ display: "flex", gap: "8px", fontSize: "11px", marginTop: "4px" }}>
                      <span style={{ color: "#065f46" }}>OUI ➔ <strong>{quest.yesTarget}</strong></span>
                      <span style={{ color: "#94a3b8" }}>•</span>
                      <span style={{ color: "#991b1b" }}>NON ➔ <strong>{quest.noTarget}</strong></span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

      </div>
    </AppShell>
  );
}

