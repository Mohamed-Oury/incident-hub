import { PrismaClient, KnowledgeStatus, IncidentStatus } from "@prisma/client";

const prisma = new PrismaClient();

const EXPERT_KNOWLEDGE: Record<string, {
  category: string;
  rootCause: string;
  justification: string;
  actions: string;
  result: string;
}> = {
  "INC-001": {
    category: "Base de données & Verrouillage CBS",
    rootCause: "Deadlock et rétention de row lock sur la table COMPTES lors d'un batch d'intérêts intempestif.",
    justification: "Verrou exclusif ORA-00054 empêchant l'instruction SELECT FOR UPDATE lors de la vérification de solde 0200.",
    actions: "Kill session Oracle PID 4812, décalage des jobs de recalcul à 02h00 du matin.",
    result: "Autorisations GAB rétablies immédiatement avec temps de réponse < 450ms.",
  },
  "INC-002": {
    category: "Partenaire Externe / Switch Régional",
    rootCause: "Indisponibilité du frontal d'autorisation de l'émetteur distant (BIN 528412).",
    justification: "Expiration du timer 25s sur les requêtes 0200 routées vers le switch national sans acquittement.",
    actions: "Bascule temporaire en mode Stand-In local avec plafond dégradé et notification au NOC distant.",
    result: "Rétablissement du service après redémarrage du frontal de la banque émettrice.",
  },
  "INC-003": {
    category: "Matériel GAB & Automate",
    rootCause: "Bourrage mécanique au niveau de l'obturateur de présentation des billets (shutter jam).",
    justification: "Capteurs optiques du présentateur en erreur après cycle d'alimentation défaillant sur cassette 2.",
    actions: "Intervention technicien convoyeur de fonds, recalibrage des rouleaux d'éjection et purge du bac de rejet.",
    result: "Automate remis en service nominal après test de délivrance réussi.",
  },
  "INC-004": {
    category: "Comptabilité & Synchronisation CBS",
    rootCause: "Désynchronisation entre la validation du débit CBS et le capteur de sortie du distributeur.",
    justification: "Trame d'annulation d'arrêt (0420) émise par le GAB mais ignorée par le middleware avant écriture compte.",
    actions: "Recrédit automatique du compte porteur via script de régularisation et mise à jour de la passerelle middleware.",
    result: "Remboursement des clients impactés et suppression de l'anomalie de décalage.",
  },
  "INC-005": {
    category: "Règles de Reversal & Switch",
    rootCause: "Génération intempestive d'un second débit consécutif à un reversal 0400 rejoué en double par le switch.",
    justification: "Inversion du sens comptable dans la table de routage suite à un timeout réseau intermédiaire.",
    actions: "Correction du paramètre 'Auto-Reversal-Retry' fixé à 1 tentative maximum avec vérification de STAN unique.",
    result: "Élimination des écritures miroir et solde client assaini.",
  },
  "INC-006": {
    category: "Moteur Payway / Timeouts",
    rootCause: "Non émission du message d'annulation 0400 après expiration du délai d'attente réponse GAB.",
    justification: "Thread de surveillance des transactions orphelines bloqué dans une boucle infinie d'écoute socket.",
    actions: "Application du patch Payway v4.2.1 correctif du gestionnaire de timers et redémarrage du module TimerService.",
    result: "Émission automatique et systématique des 0400 en cas de non-réponse du terminal.",
  },
  "INC-007": {
    category: "Frontal Host / Reversal",
    rootCause: "Message 0400 rejeté par le Host avec DE39=25 (Transaction originale introuvable).",
    justification: "Format de date/heure dans le champ DE90 différent entre le switch et l'Host central (format YYMMDD vs MMDD).",
    actions: "Harmonisation du mapping ISO du champ DE90 sur l'adaptateur de conversion de protocole.",
    result: "Acceptation et lettrage immédiat des annulations 0400 par l'Host.",
  },
  "INC-008": {
    category: "Sécurité & Audit STAN",
    rootCause: "Collision de System Trace Audit Number (DE11) due à une réinitialisation prématurée du compteur GAB.",
    justification: "Extinction électrique brutale de l'automate réinitialisant le STAN à 000001 sans archivage de l'index.",
    actions: "Stockage du STAN en mémoire non-volatile (NVRAM) et incrémentation avec salage de session.",
    result: "Unicité stricte garantie sur 2 millions de transactions consécutives.",
  },
  "INC-009": {
    category: "Routage Switch & RRN",
    rootCause: "RRN (Retrieval Reference Number - DE37) dupliqué entraînant l'écrasement des tables de compensation.",
    justification: "Algorithme de génération du RRN utilisant uniquement l'heure sans le quantième julien.",
    actions: "Refonte de la formule RRN : Année (1) + Jour Julien (3) + Heure (2) + STAN (6).",
    result: "Unicité absolue du RRN sur l'ensemble de l'exercice comptable.",
  },
  "INC-010": {
    category: "Configuration Routage TPE/GAB",
    rootCause: "Terminal ID (DE41) non déclaré dans la table de routage TMS (Terminal Management System).",
    justification: "Déploiement d'un nouveau lot de GAB sans synchronisation préalable du fichier d'inventaire frontal.",
    actions: "Synchronisation à chaud de la table TERMINAL_CONFIG et rechargement de la mémoire partagée du frontal.",
    result: "Routage immédiat des flux des nouveaux automates.",
  },
  "INC-011": {
    category: "Acquiring TPE & Merchant ID",
    rootCause: "Rejet systématique des transactions marchands suite à l'expiration du certificat commerçant.",
    justification: "Certificat TLS du concentrateur TPE échu provoquant la rupture du tunnel HTTPS vers Payway.",
    actions: "Renouvellement du certificat SSL/TLS wildcard et automatisation du renouvellement à J-30.",
    result: "Reprise des flux de paiement marchands.",
  },
  "INC-012": {
    category: "Règles Risque Issuer / DE39=05",
    rootCause: "Vague de rejets DE39=05 (Ne pas honorer) consécutive à une mise à jour agressive des règles de scoring fraude.",
    justification: "Règle de vélocité bloquant toutes les transactions d'un montant supérieur à 50 000 XAF sans 3D-Secure.",
    actions: "Ajustement du filtre de scoring en mode 'Alerte' au lieu de 'Rejet' sur les terminaux de proximité.",
    result: "Taux d'autorisation remonté à 97.4%.",
  },
  "INC-013": {
    category: "Liaisons Réseau TPE",
    rootCause: "DE39=91 massif sur les terminaux GPRS suite à une coupure de l'APN opérateur télécom.",
    justification: "Incident chez l'opérateur mobile bloquant les trames UDP/TCP des cartes SIM M2M bancaires.",
    actions: "Bascule automatique des terminaux sur le second APN de secours (Multi-opérateur).",
    result: "Rétablissement instantané de la connectivité marchande.",
  },
  "INC-014": {
    category: "Interface Frontal Payway / Host",
    rootCause: "Timeout TCP entre Payway et le Host lors des pics de fin de mois (buffer saturation).",
    justification: "Taille de la file d'attente socket insuffisante face à une charge de 350 transactions/seconde.",
    actions: "Augmentation du paramètre SOMAXCONN à 4096 et passage du timeout socket de 15s à 25s.",
    result: "Disparition des pertes de paquets et fluidification des transactions.",
  },
  "INC-015": {
    category: "Clearing & Règlement",
    rootCause: "Transactions autorisées 0100/0110 non déversées dans le fichier de compensation journalier.",
    justification: "Flag 'CLEARED_STATUS' resté à 0 en raison d'une exception SQL silencieuse lors du commit.",
    actions: "Correction du bloc try/catch dans le batch de télécollecte et extraction manuelle du lot rattrapé.",
    result: "Intégration complète du montant dans le fichier de règlement VISA.",
  },
  "INC-016": {
    category: "Automate TPE / Reversals",
    rootCause: "Reversal automatique non généré après abandon du paiement par le client sur le TPE.",
    justification: "Composant firmware TPE ne transmettant pas l'annulation si le ticket n'est pas imprimé.",
    actions: "Mise à jour du firmware TPE v8.12 poussée à distance par le serveur TMS.",
    result: "Génération systématique du 0400 dès abandon ou timeout porteur.",
  },
  "INC-017": {
    category: "Réseau Local / Terminal",
    rootCause: "Inaccessibilité du terminal TPE consécutive à un conflit d'adresses IP sur le LAN magasin.",
    justification: "Attribution d'une IP statique en doublon avec une caisse enregistreuse.",
    actions: "Configuration du bail DHCP avec réservation fixe d'adresse MAC pour chaque TPE.",
    result: "Disponibilité continue du terminal.",
  },
  "INC-018": {
    category: "Conversion Monétaire / DE49",
    rootCause: "Rejet de transaction lié à un code devise DE49 invalide (952 au lieu de 950).",
    justification: "Mauvaise table de conversion ISO 4217 déployée lors de la création d'un nouveau compte affilié.",
    actions: "Correction de la table CURRENCY_MAPPING et injection de la valeur standard 950 (XAF).",
    result: "Acceptation nominale de la devise.",
  },
  "INC-019": {
    category: "Format ISO 8583 / DE4",
    rootCause: "Montant tronqué ou mal cadré dans le champ DE4 (absence des 2 décimales implicites).",
    justification: "Calculateur de l'application mobile omettant le zéro de cadrage sur les montants ronds.",
    actions: "Application d'un formatteur strict 12 caractères numériques (format n12) dans la passerelle API.",
    result: "Montant exact transmis au switch sans distorsion de centimes.",
  },
  "INC-020": {
    category: "Routage Marchand / DE42",
    rootCause: "Merchant ID (MID) mal configuré rejeté par le Switch Acquéreur avec code 03 (Commerçant invalide).",
    justification: "Espace typographique invisible présent en fin de chaîne dans la fiche commerçant.",
    actions: "Nettoyage par fonction TRIM() sur l'ensemble des champs MID et contrôle d'intégrité en base.",
    result: "Routage réussi pour l'ensemble des points de vente du marchand.",
  },
  "INC-021": {
    category: "EMV & Puce / Contactless",
    rootCause: "Rejet des transactions puce avec DE39=68 (Réponse tardive) sur les cartes d'un profil spécifique.",
    justification: "Taille excessive des tags EMV dans le DE55 dépassant la taille MTU du protocole réseau.",
    actions: "Filtrage et suppression des tags propriétaires non obligatoires dans le champ DE55 avant transmission.",
    result: "Taille de trame optimisée et validation instantanée.",
  },
  "INC-022": {
    category: "Sécurité Cryptographique / ARQC",
    rootCause: "Cryptogramme ARQC (Application Request Cryptogram) déclaré invalide par le HSM.",
    justification: "Mauvaise dérivation de la clé de session (ATC mal synchronisé entre la carte et l'émetteur).",
    actions: "Resynchronisation du compteur ATC (Application Transaction Counter) sur la base cartes du Core Banking.",
    result: "Vérification ARQC réussie à 100%.",
  },
  "INC-023": {
    category: "EMV / HSM Cryptogramme",
    rootCause: "Échec de validation de cryptogramme de transaction lié à une clé Master Key (IMK) périmée sur le HSM.",
    justification: "Clé de dérivation émettrice arrivée à échéance de validité cryptographique.",
    actions: "Génération et chargement sécurisé sous double contrôle d'une nouvelle clé MK-AC sur le HSM Thales.",
    result: "Cryptogrammes de nouveau validés sans rejet.",
  },
  "INC-024": {
    category: "Chiffrement PIN / PIN Block",
    rootCause: "Format de bloc PIN invalide reçu par le HSM (incompatibilité Format ISO-0 vs ISO-1).",
    justification: "Paramétrage du clavier EPP du GAB configuré en format ANSI X9.8 au lieu du standard ISO 9564 Format 0.",
    actions: "Télédistribution du profil cryptographique conforme aux automates bancaires.",
    result: "Déchiffrement et vérification du code secret rétablis.",
  },
  "INC-025": {
    category: "Traduction Cryptographique / Switch",
    rootCause: "Erreur de traduction du PIN block de la clé ZPK vers la clé LPK sur le frontal Switch.",
    justification: "Désynchronisation de la clé de zone (ZPK) échangée lors du dernier Key Exchange protocolaire.",
    actions: "Exécution manuelle de la procédure d'échange de clé de zone (Echo test 0800 + Key Change 0820).",
    result: "Traduction transparente du bloc confidentiel.",
  },
  "INC-026": {
    category: "Infrastructure HSM",
    rootCause: "Indisponibilité soudaine du cluster de boîtiers HSM (Hardware Security Module).",
    justification: "Défaillance de l'alimentation redondante sur le rack principal et défaut de commutation automatique.",
    actions: "Remplacement du bloc d'alimentation et bascule sur le cluster de secours du Data Center distant.",
    result: "Opérations cryptographiques à nouveau opérationnelles en 12 minutes.",
  },
  "INC-027": {
    category: "Performance Cryptographique",
    rootCause: "Latence excessive (> 2200ms) sur les opérations de signature et vérification HSM.",
    justification: "Saturation des files d'attente due à un trop grand nombre de sessions concurrentes ouvertes sans fermeture.",
    actions: "Implémentation d'un pool de connexions persistant avec libération stricte des handles crypto.",
    result: "Temps moyen de traitement cryptographique ramené à 28ms.",
  },
  "INC-028": {
    category: "Gestion des Clés Cryptographiques",
    rootCause: "Clé ZPK manquante dans l'emplacement mémoire slot 4 du HSM secondaire.",
    justification: "Omission de réplication des clés symétriques lors du plan de maintenance préventive.",
    actions: "Procédure de clonage sécurisé par cartes à puce smartcards et contrôle d'empreinte KCV (Key Check Value).",
    result: "Conformité parfaite des KCV sur l'ensemble des modules.",
  },
  "INC-029": {
    category: "Protocole ISO 8583 / Bitmap",
    rootCause: "Bitmap primaire et secondaire incohérents provoquant le rejet de la trame par le parseur frontal.",
    justification: "Champ 65 activé dans le premier bitmap mais message tronqué à 64 octets.",
    actions: "Correction de la classe Java de sérialisation ISO pour aligner le bitmap sur la présence réelle des champs.",
    result: "Décodage sans erreur de l'ensemble des trames entrantes.",
  },
  "INC-030": {
    category: "Conformité ISO 8583",
    rootCause: "Data Element obligatoire DE12 (Heure locale de transaction) manquant dans la trame 0200.",
    justification: "Régression introduite par un patch logiciel chez un intégrateur externe.",
    actions: "Mise en place d'un validateur de schéma strict avant transmission au switch et rejet propre en amont.",
    result: "Respect rigoureux de la norme ISO 8583.",
  },
  "INC-031": {
    category: "Validation Syntaxe ISO 8583",
    rootCause: "Longueur du champ DE48 (Données privées) non conforme au format LLVAR spécifié.",
    justification: "Longueur déclarée sur 2 caractères alors que la chaîne effective en contenait davantage.",
    actions: "Recodage du calcul d'en-tête de longueur dynamique dans la couche protocolaire.",
    result: "Trames correctement interprétées par l'ensemble des banques participantes.",
  },
  "INC-032": {
    category: "Message Type Identifier (MTI)",
    rootCause: "MTI 0220 rejeté avec erreur 'Message Type non supporté' par le frontal acquéreur.",
    justification: "Table de configuration des MTI autorisés n'incluant pas les avis d'autorisation hors ligne.",
    actions: "Ajout du MTI 0220 dans la liste blanche des types de messages acceptés par le frontal Payway.",
    result: "Prise en charge complète des avis d'autorisation hors-ligne.",
  },
  "INC-033": {
    category: "Moteur de Routage Payway",
    rootCause: "Routage transactionnel défaillant envoyant les requêtes vers un Host inactif.",
    justification: "Table de routage dynamique non mise à jour après la déclaration d'indisponibilité du serveur primaire.",
    actions: "Activation du heartbeat dynamique avec basculement automatique vers le serveur secondaire actif.",
    result: "Routage haute-disponibilité opérationnel sans perte de requêtes.",
  },
  "INC-034": {
    category: "File de Messages / Middleware",
    rootCause: "Accumulation de messages dans la queue RabbitMQ provoquant un retard de traitement de 45 secondes.",
    justification: "Consommateurs de messages bloqués par un verrou mémoire lors de l'écriture en base.",
    actions: "Augmentation du nombre de workers consommateurs de 4 à 16 et purge de la file morte (dead-letter queue).",
    result: "Délai de vidage de file < 100ms en pic de charge.",
  },
  "INC-035": {
    category: "Disponibilité Applicative Payway",
    rootCause: "Arrêt inopiné du démon Payway Interface Service consécutif à un dépassement de mémoire (Out of Memory).",
    justification: "Fuite de mémoire dans la gestion des sessions WebSocket d'écoute des automates.",
    actions: "Correction du memory leak, paramétrage de la JVM avec garbage collector G1GC et redémarrage supervisé via systemd.",
    result: "Stabilité confirmée sur 30 jours sans augmentation d'empreinte RAM.",
  },
  "INC-036": {
    category: "Pool de Connexions Base de Données",
    rootCause: "Saturation intégrale du pool de connexions HikariCP (maxPoolSize=50 atteint).",
    justification: "Requêtes SQL de contrôle d'encours non indexées mobilisant les connexions pendant plus de 3 secondes.",
    actions: "Ajout d'un index B-Tree sur la colonne (ACCOUNT_NUM, CREATED_AT) et extension du pool à 150 connexions.",
    result: "Disponibilité permanente des connexions avec temps d'acquisition < 5ms.",
  },
  "INC-037": {
    category: "Réseau Interbancaire / Latence",
    rootCause: "Latence intermittente de plus de 4000ms constatée sur le lien VPN dédié vers le switch central.",
    justification: "Bascule non maîtrisée sur un lien satellite de secours aux caractéristiques de gigue élevées.",
    actions: "Rétablissement de la fibre optique principale et configuration d'une politique QoS prioritaire pour le trafic monétique.",
    result: "Temps de transit stabilisé à 18ms.",
  },
  "INC-038": {
    category: "Corrélation & Réconciliation",
    rootCause: "Réponse 0210 reçue du Host mais rejetée car impossible à corréler avec la requête 0200 émise.",
    justification: "Suppression prématurée du contexte de transaction de la table mémoire suite à un timer local trop agressif.",
    actions: "Ajustement de la durée de rétention du contexte transactionnel à 45 secondes.",
    result: "Corrélation des réponses réussie à 100%.",
  },
  "INC-039": {
    category: "Host Banking / Gestion des Délais",
    rootCause: "Réponse de débit envoyée par le Host 32 secondes après émission, alors que le switch a déjà abandonné à 30s.",
    justification: "Files d'attente saturées sur le mainframe bancaire.",
    actions: "Optimisation des temps de réponse Host et synchronisation du timeout switch à 35s.",
    result: "Suppression des annulations techniques injustifiées.",
  },
  "INC-040": {
    category: "Host Banking / Rejets Massifs",
    rootCause: "Host affiché en statut UP mais rejetant 100% des transactions avec code DE39=96 (Erreur système).",
    justification: "Système de fichiers du serveur de logs Host rempli à 100% empêchant toute écriture de transaction.",
    actions: "Nettoyage des archives obsolètes, extension du volume disque et mise en place d'une rotation automatique des logs.",
    result: "Reprise immédiate des approbations monétiques.",
  },
  "INC-041": {
    category: "Base de Données / Core Banking",
    rootCause: "Verrouillage global de la table ACCOUNT_BALANCES suite à un ordre ALTER TABLE exécuté en production.",
    justification: "Opération de modification de structure lancée par un administrateur sans plan de bascule.",
    actions: "Annulation de la session bloquante et formalisation d'une procédure stricte d'interdiction de DDL en heures de production.",
    result: "Déblocage immédiat de l'ensemble des comptes.",
  },
  "INC-042": {
    category: "Sessions Base de Données",
    rootCause: "Pool de sessions Oracle épuisé (ORA-00018: maximum number of sessions exceeded).",
    justification: "Connexions applicatives non fermées proprement en cas d'abandon transactionnel.",
    actions: "Augmentation de la directive SESSIONS de 300 à 1000 et activation du filtre Dead Connection Detection (DCD).",
    result: "Capacité d'accueil de trafic multipliée par 3 sans incident.",
  },
  "INC-043": {
    category: "Performance SQL / Core Banking",
    rootCause: "Plan d'exécution SQL dégradé sur la requête de contrôle de solde (Full Table Scan de 12 millions de lignes).",
    justification: "Statistiques d'optimiseur Oracle obsolètes suite à un chargement massif de données.",
    actions: "Recalcul immédiat des statistiques via DBMS_STATS et épinglage du plan d'exécution optimal.",
    result: "Temps d'exécution de la requête divisé par 60 (de 1800ms à 30ms).",
  },
  "INC-044": {
    category: "Verrouillage Back-Office",
    rootCause: "Session de clôture de journée Back-Office posant un verrou partagé bloquant les écritures monétiques.",
    justification: "Absence de clause WITH (NOLOCK) sur les états récapitulatifs comptables.",
    actions: "Récriture des requêtes de consultation pour s'exécuter sur le réplica de lecture (Data Guard).",
    result: "Isolation totale entre les flux monétiques temps-réel et les rapports de Back-Office.",
  },
  "INC-045": {
    category: "Compensation & Fichiers Batch",
    rootCause: "Fichier batch de compensation interbancaire non généré à l'heure limite (Cut-off time).",
    justification: "Échec du script bash d'export consécutif à un problème de droits d'accès sur le répertoire partagé NFS.",
    actions: "Rétablissement des permissions chown/chmod et relance manuelle immédiate du batch avec acquittement de la banque centrale.",
    result: "Fichier validé et pris en compte pour la compensation du jour.",
  },
};

async function main() {
  console.log("Démarrage de la validation experte pour les 45 premiers cas...");

  for (let i = 1; i <= 45; i++) {
    const ref = `INC-${String(i).padStart(3, "0")}`;
    const knowledge = EXPERT_KNOWLEDGE[ref] || {
      category: "Système & Infrastructure Monétique",
      rootCause: `Cause racine démontrée pour ${ref} : dysfonctionnement technique identifié et neutralisé.`,
      justification: "Concordance exacte entre les traces protocolaires ISO 8583 et les logs serveurs.",
      actions: "Ajustement des paramètres système et déploiement de correctifs préventifs.",
      result: "Rétablissement nominal du service sans récidive constatée.",
    };

    const inc = await prisma.incident.findUnique({ where: { reference: ref } });
    if (!inc) {
      console.warn(`Incident ${ref} non trouvé !`);
      continue;
    }

    // 1. Mettre à jour l'incident vers VALIDATED
    await prisma.incident.update({
      where: { reference: ref },
      data: {
        knowledgeStatus: KnowledgeStatus.VALIDATED,
        status: IncidentStatus.RESOLVED,
        resolvedAt: new Date(),
      },
    });

    // 2. Créer ou mettre à jour la cause racine
    await prisma.rootCause.upsert({
      where: { incidentId: inc.id },
      update: {
        category: knowledge.category,
        description: knowledge.rootCause,
        justification: knowledge.justification,
        validatedBy: "Oury Kohkoun (Expert Monétique)",
        validatedAt: new Date(),
      },
      create: {
        incidentId: inc.id,
        category: knowledge.category,
        description: knowledge.rootCause,
        justification: knowledge.justification,
        validatedBy: "Oury Kohkoun (Expert Monétique)",
        validatedAt: new Date(),
      },
    });

    // 3. Créer ou mettre à jour la résolution
    await prisma.resolution.upsert({
      where: { incidentId: inc.id },
      update: {
        actions: knowledge.actions,
        result: knowledge.result,
        executor: "Oury Kohkoun",
        approver: "Responsable Validation Monétique",
      },
      create: {
        incidentId: inc.id,
        actions: knowledge.actions,
        result: knowledge.result,
        executor: "Oury Kohkoun",
        approver: "Responsable Validation Monétique",
      },
    });
  }

  console.log("✓ Validation des 45 premiers cas terminée avec succès !");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
