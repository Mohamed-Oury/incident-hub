import { maskPAN, maskPinBlock } from "../../security/masking";
import { parseEmvTlv, EmvDecodeResult } from "./emv-tlv-decoder";

export type NdcDirection = "TERMINAL_TO_HOST" | "HOST_TO_TERMINAL" | "UNKNOWN";

export type NdcMessageCategory =
  | "TRANSACTION_REQUEST"
  | "SOLICITED_STATUS"
  | "UNSOLICITED_STATUS"
  | "FUNCTION_COMMAND"
  | "CONFIGURATION_LOAD"
  | "KEY_MANAGEMENT"
  | "UNKNOWN";

export type NdcDeviceIdentifier =
  | "A" // Time-of-Day Clock
  | "B" // System Disk / Memory
  | "C" // Card Reader
  | "D" // Cash Dispenser
  | "E" // Depository
  | "F" // Receipt Printer
  | "G" // Journal Printer (EJ)
  | "H" // Night Depository
  | "K" // Encryptor EPP / PIN Pad
  | "L" // Sensors / Cabinet tilt / Alarm
  | "M" // Supervisor Mode
  | "P" // Statement / Passbook Printer
  | "Q" // Note Acceptor / Recycler (BNA)
  | "V" // Barcode Scanner / NFC Contactless
  | "UNKNOWN";

export interface NdcResolutionRunbook {
  title: string;
  estimatedDownTime: string;
  escalationTarget: string;
  phase1Security: string;
  phase2Access: string;
  phase3ClearingOrRepair: string;
  phase4AuditAndCount: string;
  phase5Recommissioning: string;
}

export interface NdcDeviceDiagnostic {
  deviceId: NdcDeviceIdentifier;
  deviceName: string;
  frenchName: string;
  severity: "INFO" | "WARNING" | "CRITICAL";
  symptom: string;
  rootCause: string;
  recommendedAction: string;
  runbook?: NdcResolutionRunbook;
  mStatus?: string;
  mStatusDescription?: string;
  rStatus?: string;
  rStatusDescription?: string;
  extendedDetails?: string;
}

export interface NdcDispenseDetail {
  cassetteId: number;
  requested: number;
  dispensed: number;
  rejected: number;
  denomination?: number;
  currency?: string;
  totalValue?: number;
  status: "OK" | "EMPTY" | "JAMMED" | "NOT_CONFIGURED";
}

export interface NdcKeyManagementInfo {
  keyType: "MASTER_KEY_A1" | "WORKING_KEY_PEK" | "MAC_KEY" | "TR31_BLOCK" | "UNKNOWN";
  keyId: string;
  keyScheme: "DES" | "3DES_2KEY" | "3DES_3KEY" | "AES" | "TR-31";
  keyCryptogramMasked: string;
  kcv?: string; // Key Check Value (6 hex)
}

export interface NdcStateTableInfo {
  stateType: string;
  stateNumber: string;
  screenNumber?: string;
  stateDescription: string;
  nextStates?: Record<string, string>;
}

export interface NdcParsedField {
  index: number;
  name: string;
  frenchTitle: string;
  rawValue: string;
  displayValue: string;
  isMasked: boolean;
  interpretation?: string;
}

export interface NdcIsoBridgeResult {
  isoRaw: string;
  mti: string;
  de3: string;
  de4: string;
  de11: string;
  de35Masked: string;
  de41: string;
  de52Masked?: string;
  de55TagsCount?: number;
  explanation: string;
}

export interface NdcParseResult {
  rawInput: string;
  cleanedInput: string;
  direction: NdcDirection;
  messageCategory: NdcMessageCategory;
  categoryLabel: string;
  luno: string;
  sequenceNumber?: string;
  messageClass?: string;
  messageSubclass?: string;
  fields: NdcParsedField[];
  criticalInsights: {
    luno?: string;
    pan?: string;
    amount?: string;
    currency?: string;
    fdkPressed?: string;
    opCode?: string;
    opCodeLabel?: string;
    pinBlock?: string;
    hasPinBlock?: boolean;
    cardAction?: string;
    nextScreen?: string;
    deviceAffected?: string;
    deviceSeverity?: "INFO" | "WARNING" | "CRITICAL";
    dispenseDetails?: NdcDispenseDetail[];
    totalDispensedNotes?: number;
    totalDispensedAmount?: number;
    hasBillJam?: boolean;
    emvParsed?: EmvDecodeResult;
    keyManagement?: NdcKeyManagementInfo;
    stateTable?: NdcStateTableInfo;
    verdict?: string;
    recommendedAction?: string;
    isoBridge?: NdcIsoBridgeResult;
  };
  deviceDiagnostic?: NdcDeviceDiagnostic;
  errors: string[];
  warnings: string[];
}

export const NDC_DEVICE_CATALOG: Record<string, NdcDeviceDiagnostic> = {
  A: {
    deviceId: "A",
    deviceName: "Time-of-Day Clock",
    frenchName: "Horloge Temps Réel GAB",
    severity: "WARNING",
    symptom: "Désynchronisation horodatage automate ou pile CMOS épuisée.",
    rootCause: "Perte d'alimentation secourue ou pile RTC déchargée sur la carte mère NCR.",
    recommendedAction: "Remplacer la pile RTC et resynchroniser l'horloge via le menu superviseur ou NTP.",
  },
  B: {
    deviceId: "B",
    deviceName: "System Disk / Memory",
    frenchName: "Disque / Stockage Système",
    severity: "CRITICAL",
    symptom: "Erreur lecture/écriture sur le disque système ou mémoire saturée.",
    rootCause: "Secteur défectueux sur le disque SSD/HDD NCR ou journal applicatif saturé.",
    recommendedAction: "Purger les fichiers temporaires et vérifier la santé SMART du disque.",
  },
  C: {
    deviceId: "C",
    deviceName: "Card Reader / Motorized Reader",
    frenchName: "Lecteur de Carte Motorisé",
    severity: "CRITICAL",
    symptom: "Bourrage carte, tête de lecture encrassée ou bac de capture plein.",
    rootCause: "Carte physique pliée coincée dans le convoyeur ou bac de rétention plein (Capture Bin Full).",
    recommendedAction: "Vider le bac de capture des cartes avalées et nettoyer les galets d'entraînement.",
  },
  D: {
    deviceId: "D",
    deviceName: "Cash Handler / Dispenser",
    frenchName: "Distributeur de Billets (S2 / Bunch Dispenser)",
    severity: "CRITICAL",
    symptom: "Bourrage billets (Bill Jam), capteur de liassage masqué ou cassette vide.",
    rootCause: "Billet dégradé coincé au niveau des galets de transport ou du volet d'obturation (Shutter).",
    recommendedAction: "Ouvrir le coffre sécurisé, retirer les billets coincés dans le stacker et réinitialiser le dispenser.",
  },
  E: {
    deviceId: "E",
    deviceName: "Depository Module",
    frenchName: "Module de Dépôt Enveloppes / Billets",
    severity: "WARNING",
    symptom: "Bac de dépôt plein ou mécanisme d'avaleur bloqué.",
    rootCause: "Capacité maximale d'enveloppes atteinte ou bourrage dans la goulotte de dépôt.",
    recommendedAction: "Procéder à la levée du bac de dépôt et réarmer le module.",
  },
  F: {
    deviceId: "F",
    deviceName: "Receipt Printer",
    frenchName: "Imprimante Reçus Client",
    severity: "WARNING",
    symptom: "Papier épuisé, presque vide ou massicot bloqué.",
    rootCause: "Fin de bobine thermique ou bourrage papier au niveau de la fente de sortie.",
    recommendedAction: "Remplacer la bobine de reçus et tester l'éjection papier.",
  },
  G: {
    deviceId: "G",
    deviceName: "Journal Printer (EJ)",
    frenchName: "Imprimante Journal d'Audit (EJ)",
    severity: "WARNING",
    symptom: "Mémoire flash de journalisation saturée ou imprimante d'audit en défaut.",
    rootCause: "Espace disque dédié à l'Electronic Journal (EJ) insuffisant.",
    recommendedAction: "Télécollecter l'EJ vers le serveur central et archiver les anciens journaux.",
  },
  H: {
    deviceId: "H",
    deviceName: "Night Depository",
    frenchName: "Trappe Dépôt de Nuit",
    severity: "WARNING",
    symptom: "Trappe antivol coincée ou sac de dépôt non détecté.",
    rootCause: "Micro-contact de sécurité de la trappe désaligné.",
    recommendedAction: "Vérifier le verrouillage mécanique et tester le capteur de présence sac.",
  },
  K: {
    deviceId: "K",
    deviceName: "Encryptor (EPP / PIN Pad)",
    frenchName: "Clavier Sécurisé EPP / Chiffreur",
    severity: "CRITICAL",
    symptom: "Alarme anti-intrusion déclenchée (Tamper) ou clés cryptographiques effacées.",
    rootCause: "Choc physique détecté sur l'EPP ou batterie interne de sauvegarde à zéro.",
    recommendedAction: "Vérifier l'intégrité physique de l'EPP et recharger les clés maîtresses (Master Keys A1/B1).",
  },
  L: {
    deviceId: "L",
    deviceName: "Security Sensors / Cabinet",
    frenchName: "Capteurs de Sécurité & Coffre",
    severity: "CRITICAL",
    symptom: "Ouverture porte coffre non autorisée ou détecteur sismique actif.",
    rootCause: "Porte du coffre mal verrouillée ou déclenchement du capteur d'inclinaison/choc.",
    recommendedAction: "Vérifier les accès physiques du site et contacter la télésurveillance si nécessaire.",
  },
  M: {
    deviceId: "M",
    deviceName: "Supervisor / Maintenance Mode",
    frenchName: "Commutateur Superviseur / Maintenance",
    severity: "INFO",
    symptom: "L'automate a basculé en mode maintenance locale par l'exploitant.",
    rootCause: "Clé superviseur tournée ou authentification opérateur de réassort sur l'écran arrière.",
    recommendedAction: "Action normale lors des opérations de réassort ou maintenance préventive.",
  },
  P: {
    deviceId: "P",
    deviceName: "Passbook / Statement Printer",
    frenchName: "Imprimante Relevés / Livrets",
    severity: "WARNING",
    symptom: "Bourrage livret bancaire ou ruban encreur épuisé.",
    rootCause: "Bande magnétique du livret illisible ou massicot coincé.",
    recommendedAction: "Dégager le passage papier et remplacer le ruban si nécessaire.",
  },
  Q: {
    deviceId: "Q",
    deviceName: "Note Acceptor / Cash Recycler (BNA)",
    frenchName: "Recycleur / Module Dépôt Billets",
    severity: "WARNING",
    symptom: "Détection de faux billets ou bac de tri de billets saturé.",
    rootCause: "Billet rejeté par le module de reconnaissance optique ou bac de stockage plein.",
    recommendedAction: "Vider le bac de collecte et calibrer les capteurs de fluorescence UV.",
  },
  V: {
    deviceId: "V",
    deviceName: "Barcode Scanner / Contactless NFC",
    frenchName: "Lecteur Sans-Contact NFC / Code-Barres",
    severity: "WARNING",
    symptom: "Échec de lecture NFC sans-contact ou scanner optique aveuglé.",
    rootCause: "Antenne NFC perturbée par blindage métallique ou vitre du scanner encrassée.",
    recommendedAction: "Nettoyer la fenêtre optique et vérifier l'alimentation de l'antenne NFC.",
  },
};

/**
 * Dictionnaire fin des M-Status et R-Status NDC+ par sous-système matériel.
 */
interface StatusLookup {
  description: string;
  severity: "INFO" | "WARNING" | "CRITICAL";
  symptom: string;
  rootCause: string;
  action: string;
}

const NDC_M_STATUS_DICT: Record<string, Record<string, StatusLookup>> = {
  D: {
    "20": {
      description: "Nominal / Prêt (Dispenser Good)",
      severity: "INFO",
      symptom: "Le distributeur est opérationnel et prêt pour la délivrance.",
      rootCause: "Aucune anomalie détectée.",
      action: "Aucune action requise.",
    },
    "21": {
      description: "Niveau Bas Billets (Cassette Low)",
      severity: "WARNING",
      symptom: "Une ou plusieurs cassettes ont atteint le seuil d'alerte de niveau bas.",
      rootCause: "Consommation normale de billets par les retraits porteurs.",
      action: "Planifier un réassort de billets auprès du transporteur de fonds (CIT).",
    },
    "22": {
      description: "Cassettes Épuisées (Dispenser Empty)",
      severity: "CRITICAL",
      symptom: "Toutes les cassettes de coupures requises sont vides.",
      rootCause: "Stock de coupures totalement distribué.",
      action: "Arrêter le service retrait sur l'automate et déclencher un réassort d'urgence.",
    },
    "23": {
      description: "Incident Mécanique Distributeur (Dispenser Fault / Bill Jam)",
      severity: "CRITICAL",
      symptom: "Bourrage de billets ou échec mécanique du transport S2.",
      rootCause: "Billets déchirés, scotchés ou agrafés coincés dans les courroies ou le stacker.",
      action: "Ouvrir le coffre sécurisé, dégager le convoyeur, vérifier les capteurs optiques et réinitialiser.",
    },
    "24": {
      description: "Bac de Rejet Plein (Purge / Divert Bin Full)",
      severity: "WARNING",
      symptom: "Le bac de purge/rejet a atteint sa capacité maximale de billets défectueux.",
      rootCause: "Nombreux billets froissés détectés en double et écartés lors des retraits.",
      action: "Vider le bac de rejet, recompter les billets et réinitialiser le compteur de purge.",
    },
  },
  C: {
    "10": {
      description: "Nominal / Prêt (Card Reader Good)",
      severity: "INFO",
      symptom: "Le lecteur de carte motorisé est prêt à recevoir une carte.",
      rootCause: "Fonctionnement nominal.",
      action: "Aucune action requise.",
    },
    "11": {
      description: "Carte Retenue / Avalée (Card Retained)",
      severity: "WARNING",
      symptom: "Une carte a été capturée et envoyée dans le bac de rétention interne.",
      rootCause: "Carte expirée, opposition carte volée déclarée au Switch ou oubli porteur après 30s.",
      action: "Vérifier l'historique de la transaction et la conformité du bac de capture.",
    },
    "12": {
      description: "Bourrage Carte (Card Jam)",
      severity: "CRITICAL",
      symptom: "Carte physique coincée dans la gorge ou le canal de transport du lecteur.",
      rootCause: "Carte pliée, objet étranger introduit dans la fente ou galet d'entraînement fatigué.",
      action: "Intervenir sur site, ouvrir le châssis supérieur et extraire délicatement la carte.",
    },
    "13": {
      description: "Erreur de Lecture (Track / Chip Read Error)",
      severity: "WARNING",
      symptom: "Échec répété de lecture de la piste magnétique 2 ou de la puce EMV.",
      rootCause: "Piste démagnétisée ou connecteurs de puce encrassés.",
      action: "Nettoyer la tête de lecture à l'aide d'une carte de nettoyage certifiée NCR.",
    },
    "14": {
      description: "Bac de Capture Plein (Capture Bin Full)",
      severity: "WARNING",
      symptom: "Le bac de rétention des cartes avalées a atteint sa limite (20-30 cartes).",
      rootCause: "Accumulation de cartes confisquées sans relevé périodique.",
      action: "Ouvrir le coffre, consigner les cartes retenues et vider le bac.",
    },
  },
  K: {
    "70": {
      description: "Nominal / Prêt (EPP Good)",
      severity: "INFO",
      symptom: "Le clavier sécurisé EPP est opérationnel et prêt pour la saisie PIN.",
      rootCause: "Module cryptographique intègre.",
      action: "Aucune action requise.",
    },
    "71": {
      description: "Alarme Intrusion Physique (EPP Tamper Activated)",
      severity: "CRITICAL",
      symptom: "L'EPP s'est mis en autodéfense et a effacé toutes les clés cryptographiques.",
      rootCause: "Tentative d'ouverture de l'EPP, choc mécanique violent ou décharge électrostatique.",
      action: "Remplacer le module EPP s'il est endommagé, ou recharger les clés maîtresses par double contrôle.",
    },
    "72": {
      description: "Pile de Sauvegarde Épuisée (EPP Battery Low / Key Memory Lost)",
      severity: "CRITICAL",
      symptom: "Perte de la mémoire volatile contenant les Master Keys.",
      rootCause: "Pile lithium de sauvegarde de l'EPP déchargée.",
      action: "Remplacer la batterie de l'EPP en laboratoire et procéder au ré-enrôlement des clés.",
    },
  },
  L: {
    "80": {
      description: "Ouverture Porte Coffre (Safe Vault Door Open)",
      severity: "CRITICAL",
      symptom: "Le capteur de contact de la porte blindée inférieure est ouvert.",
      rootCause: "Opération de réassort en cours ou effraction physique du coffre.",
      action: "Vérifier si une intervention de réassort CIT est planifiée, sinon alerter la sécurité.",
    },
    "81": {
      description: "Ouverture Capot Supérieur (Top Cabinet Open)",
      severity: "WARNING",
      symptom: "Le châssis supérieur (écran/lecteur/imprimante) est ouvert.",
      rootCause: "Intervention technique ou remplacement de papier rouleau.",
      action: "Vérifier la présence d'un technicien de maintenance agréé.",
    },
    "82": {
      description: "Capteur Sismique / Choc Déclenché (Seismic / Vibration Alarm)",
      severity: "CRITICAL",
      symptom: "Le détecteur sismique a enregistré des vibrations d'intensité anormale.",
      rootCause: "Attaque physique au marteau-piqueur, disqueuse ou explosion au gaz.",
      action: "DÉCLENCHEMENT IMMÉDIAT DU PROTOCOLE DE SÉCURITÉ ET INTERVENTION POLICE.",
    },
    "83": {
      description: "Alarme Température / Incendie (Thermal Sensor Active)",
      severity: "CRITICAL",
      symptom: "Élévation anormale de température dans le coffre.",
      rootCause: "Attaque thermique au chalumeau ou départ de feu électrique.",
      action: "Alerter les pompiers et les services de sécurité bancaire.",
    },
  },
  F: {
    "30": {
      description: "Nominal / Prêt (Receipt Printer Good)",
      severity: "INFO",
      symptom: "L'imprimante reçus dispose de papier et est opérationnelle.",
      rootCause: "Nominal.",
      action: "Aucune action requise.",
    },
    "31": {
      description: "Papier Presque Épuisé (Receipt Paper Low)",
      severity: "WARNING",
      symptom: "La bobine thermique arrive en fin de rouleau (liseré rouge visible).",
      rootCause: "Consommation de tickets.",
      action: "Prévoir le changement de bobine lors du prochain passage technicien.",
    },
    "32": {
      description: "Papier Épuisé (Receipt Paper Out)",
      severity: "WARNING",
      symptom: "L'imprimante ne peut plus imprimer de tickets clients.",
      rootCause: "Rouleau thermique complètement vide.",
      action: "Remplacer immédiatement la bobine thermique 80mm.",
    },
    "33": {
      description: "Bourrage Papier / Massicot Bloqué (Cutter Jam)",
      severity: "WARNING",
      symptom: "Le papier est coincé ou la lame de coupe n'a pas pu revenir en position de repos.",
      rootCause: "Morceau de papier coincé dans le massicot rotatif.",
      action: "Ouvrir l'imprimante, retirer les résidus de papier et réenclencher la lame.",
    },
  },
  Q: {
    "50": {
      description: "Nominal / Prêt (Recycler BNA Good)",
      severity: "INFO",
      symptom: "Le module accepteur et recycleur de billets est prêt.",
      rootCause: "Nominal.",
      action: "Aucune action.",
    },
    "51": {
      description: "Bac de Dépôt Plein (Deposit Bin Full)",
      severity: "WARNING",
      symptom: "Le bac recevant les billets déposés par les clients est plein.",
      rootCause: "Volume élevé de dépôts d'espèces.",
      action: "Procéder à la relève des fonds déposés par le transporteur.",
    },
    "52": {
      description: "Bourrage Module de Reconnaissance (Infeed Note Jam)",
      severity: "CRITICAL",
      symptom: "Billet bloqué dans la fente d'entrée ou au passage des caméras UV/IR.",
      rootCause: "Billet plié ou trombone introduit par le client.",
      action: "Ouvrir le module BNA et dégager le trajet optique de validation.",
    },
    "53": {
      description: "Billet Faux ou Douteux Rejeté (Suspect Note)",
      severity: "WARNING",
      symptom: "Le détecteur magnétique/optique a rejeté un billet non conforme.",
      rootCause: "Caractéristiques de sécurité de la coupure non reconnues.",
      action: "Conserver le billet dans le bac des faux billets pour expertise banque centrale.",
    },
  },
};

const NDC_R_STATUS_DICT: Record<string, Record<string, string>> = {
  D: {
    "01": "Défaut d'extraction (Pick failure) - Impossible de prélever les billets dans la cassette",
    "02": "Bourrage empileur (Bunch Stacker jam) - Billets bloqués dans l'accumulateur avant transport",
    "03": "Défaut aiguillage (Divert Gate failure) - Billet bloqué lors du déroutement vers le rejet",
    "04": "Bourrage convoyeur (Belt Transport jam) - Billet coincé le long des courroies de transport",
    "05": "Gorge de sortie obstruée (Exit Pocket jam) - Billets bloqués au point de présentation",
    "06": "Défaut Volet (Shutter blocked / forced) - Le volet physique est coincé ou retenu",
    "07": "Défaut Détecteur Double (Double detect sensor fault) - Épaisseur anormale non résolue",
    "08": "Rétractation Délai Porteur (Customer timeout retract) - Billets non pris par le client",
    "09": "Perte de communication interne avec le contrôleur du distributeur (RS232/USB)",
  },
  C: {
    "01": "Bourrage dans le mécanisme de transport de la carte",
    "02": "Volet protecteur de fente carte bloqué en position fermée",
    "03": "Délai de reprise de carte expiré : carte capturée pour protection",
    "04": "Moteur pas-à-pas d'entraînement bloqué",
    "05": "Connecteurs de puce EMV non fonctionnels",
  },
  F: {
    "01": "Bourrage papier dans la goulotte d'éjection",
    "02": "Défaut moteur d'avance papier",
    "03": "Massicot bloqué en position intermédiaire",
  },
};

/**
 * Génère une marche à suivre / runbook d'intervention opérationnelle pas-à-pas
 * structuré en 5 phases standard de monétique bancaire.
 */
export function buildResolutionRunbook(
  deviceId: NdcDeviceIdentifier,
  mStatus?: string,
  rStatus?: string
): NdcResolutionRunbook {
  // 1. Distributeur de Billets (Dispenser D)
  if (deviceId === "D") {
    if (mStatus === "21") {
      return {
        title: "Procédure d'Alerte Niveau Bas Billets (Cassette Low)",
        estimatedDownTime: "Pas d'arrêt immédiat (Réassort sous 2h à 4h)",
        escalationTarget: "Service Gestion des Fonds / Transporteur CIT",
        phase1Security: "Surveiller le solde résiduel sur la console de monitoring sans couper l'automate.",
        phase2Access: "Accès blindé sécurisé réservé à l'équipe de transport de fonds CIT sous escorte.",
        phase3ClearingOrRepair: "Préparer les cassettes de billets pré-chargées et plombées selon le plan de chargement.",
        phase4AuditAndCount: "Éditer l'état des compteurs de distribution résiduels avant ouverture des cassettes.",
        phase5Recommissioning: "Charger les nouvelles cassettes, saisir les nouveaux index dans le menu superviseur et valider le test de prélèvement.",
      };
    }
    if (mStatus === "22") {
      return {
        title: "Procédure d'Urgence Cassettes Vides (Dispenser Empty)",
        estimatedDownTime: "Automate indisponible jusqu'au réassort",
        escalationTarget: "Transporteur de Fonds CIT / Responsable d'Agence",
        phase1Security: "Bascule automatique en mode Hors-Service (OOS) sur le Switch pour stopper les demandes.",
        phase2Access: "Accès coffre blindé sous protocole double combinaison OTC (One-Time Code).",
        phase3ClearingOrRepair: "Remplacement complet des cassettes vides par les cassettes approvisionnées.",
        phase4AuditAndCount: "Contrôle contradictoire du bac de purge (Divert Bin) pour vérifier l'absence de billets résiduels.",
        phase5Recommissioning: "Réinitialisation des compteurs de billets, test d'éjection à blanc et remise en service immédiate.",
      };
    }
    if (mStatus === "24") {
      return {
        title: "Procédure de Vidage du Bac de Rejet (Divert Bin Full)",
        estimatedDownTime: "15 à 20 minutes",
        escalationTarget: "Gestionnaire GAB Agence / Transporteur CIT",
        phase1Security: "Mettre temporairement l'automate en mode maintenance locale depuis le commutateur superviseur.",
        phase2Access: "Ouvrir la porte du coffre-fort sous double contrôle d'habilitation.",
        phase3ClearingOrRepair: "Retirer la boîte de purge/rejet (Divert Cassette) du mécanisme distributeur.",
        phase4AuditAndCount: "Dénombrer et classifier les coupures rejetées (froissées, doubles), consigner sur le registre de caisse.",
        phase5Recommissioning: "Remettre le bac de rejet vide en place, purger l'alarme Divert Full et réarmer le GAB.",
      };
    }
    const isShutter = rStatus === "06" || rStatus?.toLowerCase().includes("volet") || rStatus?.toLowerCase().includes("shutter");
    return {
      title: isShutter
        ? "Procédure de Dégagement du Volet de Présentation (Shutter Fault)"
        : "Procédure de Résolution Bourrage Distributeur de Billets S2 (Bill Jam)",
      estimatedDownTime: "20 à 35 minutes",
      escalationTarget: "Technicien Monétique N1 Agence / Maintenance NCR-Diebold",
      phase1Security: "Placer immédiatement l'automate en Hors-Service sur le Switch pour éviter que d'autres transactions ne soient débitées.",
      phase2Access: "Ouvrir la porte blindée inférieure du coffre à l'aide de la clé et du code combinaison électronique OTC.",
      phase3ClearingOrRepair: isShutter
        ? "Inspecter le volet motorisé de façade : vérifier l'absence de colle, réglette frauduleuse (Cash Trapping) ou bourrage au point de délivrance."
        : "Tirer le tiroir du distributeur S2 sur ses glissières. Inspecter l'empileur (stacker) et le convoyeur. Dégager minutieusement les billets coincés sans déchirer le papier.",
      phase4AuditAndCount: "Vérifier le bac de rejet (Divert Bin). Recompter le nombre exact de billets dégagés et vérifier la concordance avec la dernière transaction du journal électronique (EJ).",
      phase5Recommissioning: "Repousser le distributeur, verrouiller le coffre. En menu superviseur, exécuter un 'Test Dispense' (test de délivrance à blanc), purger l'alarme mécanique et réactiver le GAB sur le Switch.",
    };
  }

  // 2. Lecteur de Carte Motorisé (Card Reader C)
  if (deviceId === "C") {
    if (mStatus === "14") {
      return {
        title: "Procédure de Vidage du Bac de Rétention des Cartes (Capture Bin Full)",
        estimatedDownTime: "10 à 15 minutes",
        escalationTarget: "Agent d'Exploitation Agence N1",
        phase1Security: "Mettre en pause l'accueil client sur l'automate via le commutateur superviseur.",
        phase2Access: "Ouvrir le châssis supérieur (Fascia) de l'automate avec la clé mécanique d'accès.",
        phase3ClearingOrRepair: "Détacher le bac de capture situé à l'arrière du lecteur motorisé de cartes.",
        phase4AuditAndCount: "Extraire les cartes avalées, consigner chaque carte dans le registre sécurisé (date, heure, 4 derniers chiffres du PAN, motif). Placer sous pli scellé.",
        phase5Recommissioning: "Replacer le bac de capture vide, vérifier son encliquetage, refermer le châssis et réactiver le service.",
      };
    }
    return {
      title: "Procédure de Déblocage du Lecteur de Carte Motorisé (Card Jam / Fault)",
      estimatedDownTime: "15 à 25 minutes",
      escalationTarget: "Agent d'Exploitation Agence N1 / Support Technique",
      phase1Security: "Suspendre les opérations carte sur l'automate depuis la console de supervision monétique.",
      phase2Access: "Ouvrir la porte du châssis supérieur (Fascia avant) avec la clé d'exploitation.",
      phase3ClearingOrRepair: "Déverrouiller le bloc lecteur motorisé. Utiliser la molette manuelle à l'arrière pour faire avancer et expulser délicatement la carte bloquée sans la rayer.",
      phase4AuditAndCount: "Inspecter la carte extraite : vérifier si elle a été endommagée. Placer sous enveloppe sécurisée en agence selon la réglementation PCI-DSS.",
      phase5Recommissioning: "Nettoyer les galets d'entraînement et la tête de lecture avec une carte de nettoyage imprégnée d'isopropanol. Lancer le cycle de réinitialisation lecteur et remettre en service.",
    };
  }

  // 3. Clavier Sécurisé Chiffreur EPP (EPP K)
  if (deviceId === "K") {
    return {
      title: "Procédure Critique Alarme Anti-Intrusion Clavier Sécurisé (EPP Tamper)",
      estimatedDownTime: "45 min à 2h (Nécessite officiers de sécurité)",
      escalationTarget: "Officiers de Sécurité Cryptographique & Maintenance Constructeur",
      phase1Security: "Mise hors-service d'urgence absolue de l'automate. L'EPP a effacé ses clés par mesure de protection inviolable.",
      phase2Access: "Ouvrir le châssis supérieur en présence du responsable sécurité. Examiner méticuleusement la façade du clavier pour détecter tout skimmer ou micro-caméra.",
      phase3ClearingOrRepair: "Vérifier l'intégrité de la tresse anti-arrachement et des micro-rupteurs arrière. Si le boîtier EPP est physiquement violé, procéder à son remplacement matériel complet.",
      phase4AuditAndCount: "Si l'EPP est intact (décharge électrostatique ou fausse alerte), réunir les deux officiers détenant les parts secrètes de clés A1 et B1 (Dual Control).",
      phase5Recommissioning: "Recharger manuellement ou à distance les Master Keys, valider le KCV officiel, exécuter un test de chiffrement PIN à blanc et réactiver l'automate.",
    };
  }

  // 4. Capteurs Sismiques & Coffre (Security L)
  if (deviceId === "L") {
    return {
      title: "Procédure d'Alerte Sécurité Coffre-Fort & Détecteur Sismique (Vault Alarm)",
      estimatedDownTime: "Intervention d'urgence prioritaire",
      escalationTarget: "PC Sécurité Télésurveillance / Forces de l'Ordre / Responsable Sécurité",
      phase1Security: "Considérer l'incident comme une attaque physique potentielle en cours. Vérifier les caméras de vidéosurveillance extérieures et intérieures.",
      phase2Access: "Interdiction d'intervention solitaire. Dépêcher deux agents assermentés ou attendre la patrouille d'intervention de sécurité sur site.",
      phase3ClearingOrRepair: "Effectuer une inspection du local technique et du coffre (recherche de traces de perforateur, disqueuse, chalumeau ou gaz explosif).",
      phase4AuditAndCount: "Vérifier les scellés du coffre-fort. Si ouverture anormale constatée, procéder au recomptage intégral contradictoire des fonds.",
      phase5Recommissioning: "Réarmer la centrale d'alarme du GAB, réinitialiser le capteur d'ouverture ou recalibrer la sensibilité du détecteur sismique depuis le menu superviseur.",
    };
  }

  // 5. Imprimante Reçus (Receipt Printer F)
  if (deviceId === "F") {
    return {
      title: "Procédure d'Intervention Imprimante Reçus (Papier Épuisé / Massicot Bloqué)",
      estimatedDownTime: "10 minutes",
      escalationTarget: "Exploitant d'Agence N1",
      phase1Security: "Si l'automate supporte le retrait sans reçu, le laisser en service dégradé ; sinon basculer en mode superviseur.",
      phase2Access: "Déverrouiller le capot supérieur de l'automate avec la clé d'accès façade.",
      phase3ClearingOrRepair: "Ouvrir le compartiment de l'imprimante thermique. Dégager les fragments de papier coincés dans le massicot de découpe.",
      phase4AuditAndCount: "Insérer une nouvelle bobine thermique 80mm agréée constructeur, en orientant la surface imprimable vers la tête thermique.",
      phase5Recommissioning: "Actionner l'avance papier (bouton Feed), vérifier la coupe franche du ticket, fermer le capot et vérifier l'extinction du voyant incident.",
    };
  }

  // 6. Recycleur / Accepteur BNA (Recycler Q)
  if (deviceId === "Q") {
    return {
      title: "Procédure de Dégagement Module Dépôt / Recycleur de Billets (BNA Jam)",
      estimatedDownTime: "20 à 30 minutes",
      escalationTarget: "Technicien Monétique N1 / Transporteur CIT",
      phase1Security: "Désactiver uniquement le service dépôt sur le Switch tout en conservant les retraits actifs si le modèle le permet.",
      phase2Access: "Accéder au coffre sécurisé pour atteindre le module d'acceptation et de reconnaissance optique des billets.",
      phase3ClearingOrRepair: "Ouvrir les leviers de transport du BNA. Dégager avec précaution le billet froissé bloqué dans la zone de lecture optique.",
      phase4AuditAndCount: "Vérifier si le billet bloqué est un faux billet ou une coupure très abîmée. Consigner l'incident avec la référence client si connue.",
      phase5Recommissioning: "Nettoyer les cellules infrarouges/magnétiques au pinceau sec, refermer le module et lancer le cycle d'auto-étalonnage BNA.",
    };
  }

  // Runbook par défaut pour les autres modules
  return {
    title: `Procédure de Maintenance Équipement [${deviceId}]`,
    estimatedDownTime: "15 à 30 minutes",
    escalationTarget: "Technicien Support Monétique N1 / Agence",
    phase1Security: "Vérifier le statut télémétrique de l'automate sur la supervision centrale et isoler le service impacté.",
    phase2Access: "Accéder à l'automate selon les procédures de sécurité physique en vigueur dans l'établissement.",
    phase3ClearingOrRepair: "Diagnostiquer le sous-ensemble matériel défaillant, dégager les mécanismes ou remplacer la pièce défectueuse.",
    phase4AuditAndCount: "Consigner l'intervention technique dans le carnet d'entretien de l'automate.",
    phase5Recommissioning: "Effectuer un test fonctionnel complet en mode superviseur avant remise en production sur le Switch.",
  };
}

/**
 * Normalise les délimiteurs NDC.
 * En production, les trames NDC utilisent les séparateurs ASCII FS (\x1C), GS (\x1D), RS (\x1E), US (\x1F).
 * Dans les fichiers de logs, ils sont souvent matérialisés par '^', '\x1c', '<FS>', '~' ou '|'.
 */
export function normalizeNdcDelimiters(input: string): string {
  let cleaned = input.trim();
  cleaned = cleaned.replace(/<FS>/gi, "\x1c");
  cleaned = cleaned.replace(/\\x1c/gi, "\x1c");
  cleaned = cleaned.replace(/<GS>/gi, "\x1d");
  cleaned = cleaned.replace(/\\x1d/gi, "\x1d");
  cleaned = cleaned.replace(/<RS>/gi, "\x1e");
  cleaned = cleaned.replace(/\\x1e/gi, "\x1e");
  cleaned = cleaned.replace(/<US>/gi, "\x1f");
  cleaned = cleaned.replace(/\\x1f/gi, "\x1f");

  if (!cleaned.includes("\x1c") && cleaned.includes("^")) {
    cleaned = cleaned.replace(/\^/g, "\x1c");
  }

  return cleaned;
}

/**
 * Formate un montant de manière déterministe avec séparateur espace.
 * Garantit une parité absolue entre le rendu SSR (Node.js) et le client browser,
 * éliminant toute erreur d'hydratation React ("Hydration failed").
 */
export function formatNumberSpace(num: number | undefined | null): string {
  if (num === undefined || num === null || isNaN(num)) return "0";
  const parts = num.toString().split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  return parts.join(".");
}

/**
 * Extrait le M-Status et R-Status à partir d'une chaîne brute
 */
export function extractStatusCodes(raw: string): { mStatus?: string; rStatus?: string } {
  let mStatus: string | undefined;
  let rStatus: string | undefined;

  const mMatch = raw.match(/M(?:-STATUS)?[:=]?\s*([0-9A-Z]{2})/i);
  if (mMatch) mStatus = mMatch[1].toUpperCase();

  const rMatch = raw.match(/R(?:-STATUS)?[:=]?\s*([0-9A-Z]{2})/i);
  if (rMatch) rStatus = rMatch[1].toUpperCase();

  // Format compact NDC ex: "2302" ou "D03"
  if (!mStatus && /^[0-9]{4}$/.test(raw)) {
    mStatus = raw.slice(0, 2);
    rStatus = raw.slice(2, 4);
  }

  return { mStatus, rStatus };
}

/**
 * Génère le pont ISO 8583 (0200) à partir d'une transaction NDC T2H 11
 */
export function generateIso8583FromNdc(parsed: NdcParseResult): NdcIsoBridgeResult | undefined {
  if (parsed.messageCategory !== "TRANSACTION_REQUEST" || !parsed.criticalInsights.pan) {
    return undefined;
  }

  const panMasked = parsed.criticalInsights.pan;
  const opCode = parsed.criticalInsights.opCode || "01";
  const procCode = opCode === "01" ? "010000" : opCode === "31" ? "310000" : opCode === "70" ? "700000" : "000000";
  
  // Montant en 12 chiffres
  const amtNum = parseFloat(parsed.criticalInsights.amount || "0") * 100;
  const amtStr = amtNum.toString().padStart(12, "0");

  const stan = parsed.sequenceNumber || "123456";
  const luno = parsed.luno || "000";
  const terminalId = `ATM${luno.padStart(5, "0")}`;
  const pinBlock = parsed.criticalInsights.pinBlock ? "****************" : undefined;

  // Trame ISO 8583 0200 synthétisée
  const isoRaw = `02007238200108E1800016${panMasked.replace(/\*/g, "0")}${procCode}${amtStr}0917120000${stan.padStart(6, "0")}1200000917601105112345678901234123456789012${terminalId}AGENCE CENTRALE DAKAR  952`;

  return {
    isoRaw,
    mti: "0200",
    de3: procCode,
    de4: amtStr,
    de11: stan,
    de35Masked: panMasked,
    de41: terminalId,
    de52Masked: pinBlock,
    de55TagsCount: parsed.criticalInsights.emvParsed?.tags.length,
    explanation: `Passerelle NDC ➜ ISO 8583 : Sollicitation Retrait traduite en MTI 0200 (Proc Code ${procCode}, Montant ${amtStr}, Terminal ${terminalId}).`,
  };
}

/**
 * Génère un rapport d'incident forensique complet prêt à copier pour ticket JIRA / ServiceNow
 */
export function generateNdcForensicTicket(parsed: NdcParseResult): string {
  const luno = parsed.luno || "000";
  const dev = parsed.deviceDiagnostic;
  const devName = dev ? `${dev.frenchName} [${dev.deviceId}]` : "Système Automate GAB";
  const sev = dev?.severity || parsed.criticalInsights.deviceSeverity || "INFO";
  const dateStr = new Date().toISOString().replace("T", " ").slice(0, 19);

  return `======================================================================
RAPPORT D'INCIDENT FORENSIQUE AUTOMATE (GAB / ATM NDC+)
RÉFÉRENCE TICKET : INC-GAB-${luno}-${Date.now().toString().slice(-6)}
DATE / HEURE     : ${dateStr} UTC
LUNO AUTOMATE    : ${luno}
GRAVITÉ INCIDENT : ${sev}
COMPOSANT CIBLÉ  : ${devName}
======================================================================

1. SYNTHÈSE DE LA TRAME NDC
----------------------------------------------------------------------
• Direction        : ${parsed.direction === "TERMINAL_TO_HOST" ? "Automate ➜ Switch (T2H)" : "Switch ➜ Automate (H2T)"}
• Catégorie        : ${parsed.categoryLabel}
• Classe / Sub     : Class ${parsed.messageClass || "1"} / Subclass ${parsed.messageSubclass || "1"}
• LUNO GAB         : ${luno}
• Séquence Trame   : ${parsed.sequenceNumber || "N/A"}
• Verdict          : ${parsed.criticalInsights.verdict || "Analyse télémétrique enregistrée"}

2. DIAGNOSTIC MATÉRIEL & TÉLÉMÉTRIE
----------------------------------------------------------------------
• Composant        : ${dev?.frenchName || "N/A"} (${dev?.deviceName || "N/A"})
• Statut M (M-Stat): ${dev?.mStatus || "N/A"} - ${dev?.mStatusDescription || "Nominal"}
• Statut R (R-Stat): ${dev?.rStatus || "N/A"} - ${dev?.rStatusDescription || "Aucun sous-code"}
• Symptôme         : ${dev?.symptom || "Fonctionnement normal constaté"}
• Cause Racine RCA : ${dev?.rootCause || "Pas de défaillance signalée"}

3. PLAN D'ACTION & RUNBOOK D'INTERVENTION PAS-À-PAS
----------------------------------------------------------------------
• Protocole d'intervention  : ${dev?.runbook?.title || "Intervention Standard GAB"}
• Délai moyen estimé        : ${dev?.runbook?.estimatedDownTime || "15 à 30 minutes"}
• Intervenant désigné       : ${dev?.runbook?.escalationTarget || "Technicien N1 / Agence"}

Étape 1 [Sécurisation]      : ${dev?.runbook?.phase1Security || parsed.criticalInsights.recommendedAction || "Aucune action."}
Étape 2 [Accès physique]    : ${dev?.runbook?.phase2Access || "Accès sécurisé à l'automate."}
Étape 3 [Dégagement/Répar.] : ${dev?.runbook?.phase3ClearingOrRepair || "Contrôle du sous-ensemble."}
Étape 4 [Audit & Comptage]  : ${dev?.runbook?.phase4AuditAndCount || "Contrôle des billets / cartes."}
Étape 5 [Remise en service] : ${dev?.runbook?.phase5Recommissioning || "Tests superviseur et remise en ligne."}

4. DONNÉES TRANSACTIONNELLES (CONFORMITÉ PCI-DSS)
----------------------------------------------------------------------
• Porteur (PAN)    : ${parsed.criticalInsights.pan || "Non applicable"}
• Montant Demandé  : ${parsed.criticalInsights.amount ? `${parsed.criticalInsights.amount} XOF/Devise` : "N/A"}
• Code Opération   : ${parsed.criticalInsights.opCodeLabel || parsed.criticalInsights.opCode || "N/A"}
• PIN Block Présent: ${parsed.criticalInsights.hasPinBlock ? "OUI (Chiffré DES/3DES - Masqué)" : "NON"}
• Données Puce EMV : ${parsed.criticalInsights.emvParsed ? `${parsed.criticalInsights.emvParsed.tags.length} Tags CAM décodés` : "NON"}

5. TRAME BRUTE JOURNALISÉE
----------------------------------------------------------------------
${parsed.cleanedInput.replace(/\x1c/g, "<FS>")}
======================================================================`;
}

/**
 * Moteur principal de décodage des trames NDC / NDC+
 */
export function parseNdcMessage(
  rawInput: string,
  options?: {
    cassetteDenominations?: [number, number, number, number];
    currency?: string;
  }
): NdcParseResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const fields: NdcParsedField[] = [];
  const criticalInsights: NdcParseResult["criticalInsights"] = {};

  const denominations = options?.cassetteDenominations || [10000, 5000, 2000, 1000];
  const currency = options?.currency || "XOF";
  criticalInsights.currency = currency;

  const cleaned = normalizeNdcDelimiters(rawInput);
  if (!cleaned) {
    errors.push("Le message NDC fourni est vide.");
    return {
      rawInput,
      cleanedInput: "",
      direction: "UNKNOWN",
      messageCategory: "UNKNOWN",
      categoryLabel: "Message Indéterminé",
      luno: "—",
      fields: [],
      criticalInsights,
      errors,
      warnings,
    };
  }

  // Séparation selon le Field Separator (FS, \x1C)
  const rawParts = cleaned.split("\x1c");

  // Analyse de l'en-tête (Header)
  const headerBlock = rawParts[0].trim();
  let luno = "000";
  let seqNumber: string | undefined = undefined;
  let msgClass = "";
  let msgSubclass = "";
  let direction: NdcDirection = "UNKNOWN";
  let messageCategory: NdcMessageCategory = "UNKNOWN";
  let categoryLabel = "Message NDC";

  if (headerBlock.length >= 8 && /^\d{3,9}\d{3}[123]/.test(headerBlock)) {
    direction = "TERMINAL_TO_HOST";
    luno = headerBlock.slice(0, 3);
    seqNumber = headerBlock.slice(3, 6);
    msgClass = headerBlock[6] || "";
    msgSubclass = headerBlock[7] || "";
  } else if (headerBlock.length >= 4 && /^[123]/.test(headerBlock)) {
    direction = "HOST_TO_TERMINAL";
    msgClass = headerBlock[0];
    msgSubclass = headerBlock[1] || "1";
    luno = headerBlock.slice(1, 4) || "000";
  } else {
    // Heuristiques de détection
    if (headerBlock.includes("T2H") || cleaned.includes(";497010") || cleaned.includes("TRACK2")) {
      direction = "TERMINAL_TO_HOST";
      msgClass = "1";
      msgSubclass = "1";
    } else if (headerBlock.includes("H2T") || cleaned.includes("DISPENSE") || cleaned.includes("EJECT")) {
      direction = "HOST_TO_TERMINAL";
      msgClass = "1";
    } else {
      direction = "TERMINAL_TO_HOST";
      luno = headerBlock.slice(0, 3) || "000";
      msgClass = headerBlock[3] || "1";
      msgSubclass = headerBlock[4] || "1";
    }
  }

  criticalInsights.luno = luno;

  // Catégorisation de la trame
  if (direction === "TERMINAL_TO_HOST") {
    if (msgClass === "1" && msgSubclass === "1") {
      messageCategory = "TRANSACTION_REQUEST";
      categoryLabel = "Sollicitation de Transaction (Retrait / Opération Carte)";
    } else if (msgClass === "1" && msgSubclass === "2") {
      messageCategory = "UNSOLICITED_STATUS";
      categoryLabel = "Alarme / Statut Non Sollicité (Incident Matériel GAB)";
    } else if (msgClass === "2" || msgSubclass === "3" || msgSubclass === "4") {
      messageCategory = "SOLICITED_STATUS";
      categoryLabel = "Statut Sollicité (Compte-rendu de distribution / Prêt)";
    } else {
      messageCategory = "TRANSACTION_REQUEST";
      categoryLabel = "Message Terminal vers Serveur (T2H)";
    }
  } else {
    if (msgClass === "1") {
      messageCategory = "FUNCTION_COMMAND";
      categoryLabel = "Ordre d'Opération Automate (Dispense / Éjection / Écran)";
    } else if (msgClass === "2") {
      messageCategory = "CONFIGURATION_LOAD";
      categoryLabel = "Téléchargement Configuration / Masque d'États";
    } else if (msgClass === "3") {
      messageCategory = "KEY_MANAGEMENT";
      categoryLabel = "Chargement Clés Cryptographiques EPP";
    } else {
      messageCategory = "FUNCTION_COMMAND";
      categoryLabel = "Message Serveur vers Terminal (H2T)";
    }
  }

  let deviceDiagnostic: NdcDeviceDiagnostic | undefined = undefined;

  for (let idx = 0; idx < rawParts.length; idx++) {
    const rawVal = rawParts[idx].trim();
    let displayVal = rawVal;
    let isMasked = false;
    let fieldName = `Champ FS #${idx + 1}`;
    let frenchTitle = "Donnée Brute";
    let interpretation: string | undefined = undefined;

    if (idx === 0) {
      fieldName = "Header & Routing";
      frenchTitle = "En-tête & Routage LUNO";
      interpretation = `LUNO: ${luno} · Classe: ${msgClass || "1"} · Subclass: ${msgSubclass || "1"} · Direction: ${direction === "TERMINAL_TO_HOST" ? "GAB ➜ Serveur" : "Serveur ➜ GAB"}`;
    } else if (messageCategory === "TRANSACTION_REQUEST") {
      if (idx === 1) {
        fieldName = "Time Variant / Timestamp";
        frenchTitle = "Horodatage Transaction";
        interpretation = `Heure locale GAB: ${rawVal}`;
      } else if (idx === 2) {
        fieldName = "FDK & Operational Keys";
        frenchTitle = "Touches Écran / FDK Enfoncées";
        criticalInsights.fdkPressed = rawVal;
        interpretation = `Touche fonction actionnée par le porteur: FDK [${rawVal}]`;
      } else if (idx === 3 || rawVal.startsWith(";") || rawVal.includes("=")) {
        fieldName = "Track 2 / Card Data";
        frenchTitle = "Données Piste 2 Magnétique (DE35)";
        const panMatch = rawVal.match(/;?(\d{12,19})[=D](\d{4})/);
        if (panMatch) {
          const rawPan = panMatch[1];
          const maskedPan = maskPAN(rawPan);
          criticalInsights.pan = maskedPan;
          displayVal = `;${maskedPan}=**** (PISTE MASQUÉE PCI-DSS)`;
          isMasked = true;
          interpretation = `Carte Porteur : ${maskedPan} (Date Expiration : ${panMatch[2]})`;
        } else {
          displayVal = maskPAN(rawVal.slice(0, 16)) + " (DONNÉE MASQUÉE)";
          isMasked = true;
        }
      } else if (idx === 4) {
        fieldName = "Op Code Buffer";
        frenchTitle = "Code Opération Sélectionné";
        criticalInsights.opCode = rawVal;
        const opMap: Record<string, string> = {
          "01": "Retrait Espèces (Fast Cash / Normal)",
          "21": "Dépôt Espèces / Enveloppe",
          "31": "Consultation de Solde Compte",
          "32": "Mini-Relevé 10 Dernières Opérations",
          "40": "Virement Compte à Compte",
          "70": "Changement Code Confidentiel PIN",
        };
        const label = opMap[rawVal] || `Opération ${rawVal}`;
        criticalInsights.opCodeLabel = label;
        interpretation = `Code Opération GAB : ${label}`;
      } else if (idx === 5 || /^\d{10,12}$/.test(rawVal)) {
        fieldName = "Amount Buffer";
        frenchTitle = "Montant Demandé";
        const amtNum = (parseInt(rawVal, 10) / 100).toFixed(2);
        criticalInsights.amount = amtNum;
        interpretation = `Montant : ${amtNum} ${currency} (Cents: ${rawVal})`;
      } else if (idx === 6 || /^[0-9A-Fa-f]{16}$/.test(rawVal)) {
        fieldName = "PIN Buffer";
        frenchTitle = "PIN Block Chiffré";
        displayVal = maskPinBlock(rawVal);
        isMasked = true;
        criticalInsights.pinBlock = displayVal;
        criticalInsights.hasPinBlock = true;
        interpretation = "PIN chiffré DES/3DES Format ANSI X9.8 / ISO 9564-1 Format 0";
      } else if (idx >= 7 || rawVal.startsWith("9F") || rawVal.startsWith("82")) {
        fieldName = "CAM Buffer / Smart Card Data";
        frenchTitle = "Données EMV / Puce Contact";
        try {
          const emvRes = parseEmvTlv(rawVal);
          if (emvRes.tags.length > 0) {
            criticalInsights.emvParsed = emvRes;
            interpretation = `${emvRes.tags.length} Tags EMV décodés (${emvRes.tags.map((t) => t.tag).join(", ")})`;
          }
        } catch {
          interpretation = "Buffer EMV / Données privatives CAM";
        }
      }
    } else if (messageCategory === "UNSOLICITED_STATUS") {
      if (idx === 1) {
        fieldName = "Transaction Serial Number";
        frenchTitle = "Numéro Séquence Incident";
        interpretation = `Compteur incident : ${rawVal}`;
      } else if (idx === 2) {
        fieldName = "Device Status Identifier";
        frenchTitle = "Identifiant Composant Défaillant";
        const devId = (rawVal[0] || "").toUpperCase() as NdcDeviceIdentifier;
        criticalInsights.deviceAffected = devId;

        const baseDiag = NDC_DEVICE_CATALOG[devId] || {
          deviceId: devId,
          deviceName: `Unknown Device (${devId})`,
          frenchName: `Module Indéterminé [${devId}]`,
          severity: "WARNING",
          symptom: `Statut reçu pour le périphérique ${devId}`,
          rootCause: "Module non répertorié dans la nomenclature standard NCR.",
          recommendedAction: "Vérifier la table des périphériques de l'automate.",
        };

        deviceDiagnostic = { ...baseDiag };
        criticalInsights.deviceSeverity = baseDiag.severity;
        interpretation = `${baseDiag.frenchName} (${baseDiag.deviceName}) — Gravité: ${baseDiag.severity}`;

        if (devId === "D") {
          criticalInsights.hasBillJam = true;
          criticalInsights.verdict = "BOURRAGE_DISTRIBUTEUR_DETECTE";
        }
      } else if (idx === 3 || idx >= 3) {
        fieldName = `Diagnostic M/R-Status (#${idx})`;
        frenchTitle = "Code Statut M/R d'Erreur";
        const { mStatus, rStatus } = extractStatusCodes(rawVal);
        const devId = criticalInsights.deviceAffected || "D";

        if (deviceDiagnostic) {
          if (mStatus) {
            deviceDiagnostic.mStatus = mStatus;
            const mLookup = NDC_M_STATUS_DICT[devId]?.[mStatus];
            if (mLookup) {
              deviceDiagnostic.mStatusDescription = mLookup.description;
              deviceDiagnostic.severity = mLookup.severity;
              deviceDiagnostic.symptom = mLookup.symptom;
              deviceDiagnostic.rootCause = mLookup.rootCause;
              deviceDiagnostic.recommendedAction = mLookup.action;
              criticalInsights.deviceSeverity = mLookup.severity;
            }
          }

          if (rStatus) {
            deviceDiagnostic.rStatus = rStatus;
            const rDesc = NDC_R_STATUS_DICT[devId]?.[rStatus];
            if (rDesc) {
              deviceDiagnostic.rStatusDescription = rDesc;
              deviceDiagnostic.rootCause += ` - ${rDesc}`;
            }
          }
        }

        interpretation = `M-Status: ${mStatus || "N/A"} (${deviceDiagnostic?.mStatusDescription || "Code non répertorié"}) · R-Status: ${rStatus || "N/A"} (${deviceDiagnostic?.rStatusDescription || "N/A"})`;
      }
    } else if (messageCategory === "FUNCTION_COMMAND") {
      if (idx === 1) {
        fieldName = "Next State / Screen ID";
        frenchTitle = "Écran Suivant / État";
        criticalInsights.nextScreen = rawVal;
        interpretation = `Écran à afficher au porteur : Écran #${rawVal}`;
      } else if (idx === 2) {
        fieldName = "Dispense Command (Notes Count)";
        frenchTitle = "Ordre de Distribution (Cassettes)";
        const dispenseList: NdcDispenseDetail[] = [];
        let totalDispensed = 0;
        let totalVal = 0;

        for (let c = 0; c < 4; c++) {
          const countStr = rawVal.slice(c * 2, c * 2 + 2) || "00";
          const count = parseInt(countStr, 10) || 0;
          const denom = denominations[c] || 1000;
          const val = count * denom;
          totalDispensed += count;
          totalVal += val;

          dispenseList.push({
            cassetteId: c + 1,
            requested: count,
            dispensed: count,
            rejected: 0,
            denomination: denom,
            currency,
            totalValue: val,
            status: count > 0 ? "OK" : "NOT_CONFIGURED",
          });
        }

        criticalInsights.dispenseDetails = dispenseList;
        criticalInsights.totalDispensedNotes = totalDispensed;
        criticalInsights.totalDispensedAmount = totalVal;
        interpretation = `Délivrer ${totalDispensed} billets au total (${formatNumberSpace(totalVal)} ${currency})`;
      } else if (idx === 3) {
        fieldName = "Card Handling Command";
        frenchTitle = "Action Carte";
        const actionCode = rawVal[0] || "0";
        criticalInsights.cardAction =
          actionCode === "1" ? "ÉJECTER_CARTE" : actionCode === "2" ? "AVALER_CARTE" : "AUCUNE_ACTION";
        interpretation =
          actionCode === "1"
            ? "Éjecter la carte au porteur (Restitution)"
            : actionCode === "2"
            ? "Avaler la carte (Confiscation immédiate)"
            : "Conserver la carte dans le lecteur";
      } else if (idx === 4) {
        fieldName = "Print Data / Customer Receipt";
        frenchTitle = "Texte du Reçu Client";
        interpretation = `Buffer d'impression ticket de retrait : "${rawVal}"`;
      }
    } else if (messageCategory === "KEY_MANAGEMENT") {
      if (idx === 1) {
        fieldName = "Key Identifier & Scheme";
        frenchTitle = "Identifiant de Clé";
        const keyId = rawVal.slice(0, 2);
        const scheme = rawVal.length > 32 ? "3DES_2KEY" : "DES";
        criticalInsights.keyManagement = {
          keyType: keyId === "A1" ? "MASTER_KEY_A1" : "WORKING_KEY_PEK",
          keyId,
          keyScheme: scheme,
          keyCryptogramMasked: "********************************",
        };
        interpretation = `Clé EPP : ${keyId} (${scheme})`;
      } else if (idx === 2) {
        fieldName = "Encrypted Cryptogram";
        frenchTitle = "Cryptogramme de Clé Chiffré";
        displayVal = "******************************** (CLÉ PROTÉGÉE)";
        isMasked = true;
        interpretation = "Bloc de clé crypté chargé dans la mémoire inviolable de l'EPP";
      } else if (idx === 3) {
        fieldName = "Key Check Value (KCV)";
        frenchTitle = "Valeur de Contrôle KCV";
        if (criticalInsights.keyManagement) {
          criticalInsights.keyManagement.kcv = rawVal;
        }
        interpretation = `KCV officiel (6 hex) : ${rawVal} (Vérification d'intégrité)`;
      }
    } else if (messageCategory === "CONFIGURATION_LOAD") {
      if (idx === 1) {
        fieldName = "State Number & Type";
        frenchTitle = "Numéro & Type d'État NDC";
        const stateType = rawVal[0] || "A";
        const stateNum = rawVal.slice(1);
        const stateDescriptions: Record<string, string> = {
          A: "État A : Lecture de Carte & Validation Piste",
          B: "État B : Saisie du Code Confidentiel (PIN Entry)",
          C: "État C : Sélection de l'Opération Porteur",
          D: "État D : Sélection du Montant / Coupures",
          E: "État E : Saisie Données Complémentaires",
          F: "État F : Émission Sollicitation Switch (T2H Request)",
          G: "État G : Attente Réponse Switch Host (Wait Host)",
          H: "État H : Ordre de Distribution Billets & Reçu",
          I: "État I : Éjection & Restitution de Carte",
          J: "État J : Remise Reçu Porteur",
          K: "État K : Remerciement & Retour Écran d'Accueil",
          Z: "État Z : Automate Hors Service (Out of Service)",
        };
        criticalInsights.stateTable = {
          stateType,
          stateNumber: stateNum,
          stateDescription: stateDescriptions[stateType] || `État NDC Type ${stateType}`,
        };
        interpretation = criticalInsights.stateTable.stateDescription;
      }
    } else if (messageCategory === "SOLICITED_STATUS") {
      if (idx === 1) {
        fieldName = "Transaction Number";
        frenchTitle = "Numéro Transaction";
      } else if (idx === 2) {
        fieldName = "Dispense Status Summary";
        frenchTitle = "Statut Distribution Effectif";
        if (rawVal.includes("0")) {
          criticalInsights.verdict = "DISTRIBUTION_REUSSIE";
          interpretation = "Distribution effectuée avec succès sans anomalie.";
        } else if (rawVal.includes("2") || rawVal.includes("JAM")) {
          criticalInsights.hasBillJam = true;
          criticalInsights.verdict = "BOURRAGE_BILLET_SURVENU";
          interpretation = "Bourrage billet survenu lors de l'empilage ou sortie.";
        }
      }
    }

    fields.push({
      index: idx + 1,
      name: fieldName,
      frenchTitle,
      rawValue: rawVal,
      displayValue: displayVal,
      isMasked,
      interpretation,
    });
  }

  // Verdict final & Recommandation
  if (deviceDiagnostic) {
    deviceDiagnostic.runbook = buildResolutionRunbook(
      deviceDiagnostic.deviceId,
      deviceDiagnostic.mStatus,
      deviceDiagnostic.rStatus
    );
    criticalInsights.recommendedAction = deviceDiagnostic.recommendedAction;
  } else if (criticalInsights.hasBillJam) {
    criticalInsights.recommendedAction =
      "Intervention physique requise : ouvrir le coffre de l'automate, retirer les billets coincés dans le transport S2, vérifier le volet d'obturation et réconcilier le compteur.";
  } else if (messageCategory === "TRANSACTION_REQUEST") {
    criticalInsights.recommendedAction =
      "Transaction sollicitée par le GAB : vérifier la présence de l'autorisation correspondante dans les traces ISO 8583 (0200/0210) au niveau du Switch.";
  }

  const result: NdcParseResult = {
    rawInput,
    cleanedInput: cleaned,
    direction,
    messageCategory,
    categoryLabel,
    luno,
    sequenceNumber: seqNumber,
    messageClass: msgClass,
    messageSubclass: msgSubclass,
    fields,
    criticalInsights,
    deviceDiagnostic,
    errors,
    warnings,
  };

  // Génération automatique de la passerelle ISO 8583
  if (messageCategory === "TRANSACTION_REQUEST") {
    result.criticalInsights.isoBridge = generateIso8583FromNdc(result);
  }

  return result;
}
