export interface MTIDefinition {
  mti: string;
  name: string;
  category: "AUTORISATION" | "FINANCIER" | "REVERSAL_CHARGEBACK" | "RECONCILIATION" | "GESTION_RESEAU";
  direction: "REQUEST" | "RESPONSE" | "ADVICE" | "NOTIFICATION";
  isoVersion: "ISO 8583:1987 (0xxx)" | "ISO 8583:1993 (1xxx)" | "ISO 8583:2003 (2xxx)";
  meaning: string;
  keyFields: string[];
  operationalUsage: string;
  diagnosticAdvice: string;
}

export const MTI_CATALOG: MTIDefinition[] = [
  // 1. Autorisation (0100 - 0130)
  {
    mti: "0100",
    name: "Authorization Request (Demande d'Autorisation)",
    category: "AUTORISATION",
    direction: "REQUEST",
    isoVersion: "ISO 8583:1987 (0xxx)",
    meaning: "Requête envoyée par le terminal (GAB/TPE) pour vérifier la validité de la carte, la provision du compte et réserver les fonds sans débit définitif immédiat.",
    keyFields: ["DE2 (PAN)", "DE3 (Processing Code)", "DE4 (Amount)", "DE11 (STAN)", "DE14 (Expiry)", "DE22 (POS Entry Mode)", "DE35 (Track 2)", "DE41 (TID)", "DE42 (MID)", "DE52 (PIN)", "DE55 (EMV)"],
    operationalUsage: "Utilisé lors d'une pré-autorisation hôtelière, location de véhicule, vérification de solde ou achat avec confirmation ultérieure.",
    diagnosticAdvice: "Si le message n'aboutit pas (absence de 0110), vérifier les timeouts de routage acquéreur et la disponibilité du serveur d'autorisation émetteur."
  },
  {
    mti: "0110",
    name: "Authorization Response (Réponse d'Autorisation)",
    category: "AUTORISATION",
    direction: "RESPONSE",
    isoVersion: "ISO 8583:1987 (0xxx)",
    meaning: "Réponse envoyée par l'Émetteur indiquant si l'autorisation est accordée (DE39='00') ou refusée (ex: DE39='51' provision insuffisante, '55' code PIN incorrect).",
    keyFields: ["DE2 (PAN)", "DE3 (Proc Code)", "DE4 (Amount)", "DE11 (STAN)", "DE38 (Auth Code)", "DE39 (Response Code)", "DE41 (TID)", "DE55 (EMV Script/ARPC)"],
    operationalUsage: "Délivre le code d'approbation DE38 en cas d'accord, indispensable pour finaliser la transaction sur le terminal.",
    diagnosticAdvice: "Analyser le DE39 pour orienter immédiatement le diagnostic vers le porteur, le réseau ou le module cryptographique HSM."
  },
  {
    mti: "0120",
    name: "Authorization Advice (Avis d'Autorisation)",
    category: "AUTORISATION",
    direction: "ADVICE",
    isoVersion: "ISO 8583:1987 (0xxx)",
    meaning: "Avis envoyé par le terminal ou le switch pour informer le système hôte d'une autorisation effectuée en mode dégradé (offline/stand-in) ou pour forcer une écriture.",
    keyFields: ["DE2 (PAN)", "DE3 (Proc Code)", "DE4 (Amount)", "DE11 (STAN)", "DE25 (POS Condition)", "DE38 (Auth Code)", "DE39 (Response Code)"],
    operationalUsage: "Gestion des autorisations forcées, du mode secours (STIP) ou de la reprise après rupture réseau.",
    diagnosticAdvice: "Vérifier si le switch autorise les transactions offline et si les plafonds plancher (floor limits) du terminal ne sont pas dépassés."
  },
  {
    mti: "0130",
    name: "Authorization Advice Response",
    category: "AUTORISATION",
    direction: "RESPONSE",
    isoVersion: "ISO 8583:1987 (0xxx)",
    meaning: "Accusé de réception émis par l'hôte confirmant la bonne prise en compte de l'avis d'autorisation 0120.",
    keyFields: ["DE11 (STAN)", "DE37 (RRN)", "DE39 (Response Code)"],
    operationalUsage: "Permet au terminal ou au switch intermédiaire de solder la file d'attente des avis (SAF - Store and Forward).",
    diagnosticAdvice: "Si le 0130 n'est pas retourné, le terminal renverra en boucle des 0120, risquant d'engorger la bande passante."
  },

  // 2. Financier (0200 - 0230)
  {
    mti: "0200",
    name: "Financial Transaction Request (Demande Financière)",
    category: "FINANCIER",
    direction: "REQUEST",
    isoVersion: "ISO 8583:1987 (0xxx)",
    meaning: "Requête de transaction avec débit ou crédit direct et immédiat du compte porteur (cas nominal d'un retrait GAB ou d'un achat direct TPE).",
    keyFields: ["DE2 (PAN)", "DE3 (Processing Code)", "DE4 (Amount)", "DE11 (STAN)", "DE12/13 (Local Time/Date)", "DE22 (Entry Mode)", "DE41 (TID)", "DE42 (MID)", "DE49 (Currency)", "DE52 (PIN)", "DE55 (EMV)"],
    operationalUsage: "Flux principal du paiement monétique. Déclenche la vérification de solde, le blocage des fonds et la comptabilisation en temps réel.",
    diagnosticAdvice: "En cas d'échec, observer si l'échec intervient avant ou après le switch, et si une trame d'annulation 0400/0420 est générée par le GAB."
  },
  {
    mti: "0210",
    name: "Financial Transaction Response (Réponse Financière)",
    category: "FINANCIER",
    direction: "RESPONSE",
    isoVersion: "ISO 8583:1987 (0xxx)",
    meaning: "Réponse de l'Émetteur à la demande financière 0200, autorisant la distribution de billets sur GAB ou l'impression du ticket validé sur TPE.",
    keyFields: ["DE2 (PAN)", "DE3 (Proc Code)", "DE4 (Amount)", "DE11 (STAN)", "DE37 (RRN)", "DE38 (Auth Code)", "DE39 (Response Code)", "DE54 (Additional Amounts)", "DE55 (ARPC)"],
    operationalUsage: "Ordre décisif déclenchant le distributeur mécanique de billets sur le GAB.",
    diagnosticAdvice: "Si DE39='00' mais que le client n'a pas reçu ses billets, investiguer immédiatement le journal GAB (EJ log) pour déceler un incident mécanique (bourrage, capteur, cassette vide)."
  },
  {
    mti: "0220",
    name: "Financial Transaction Advice (Avis Financier)",
    category: "FINANCIER",
    direction: "ADVICE",
    isoVersion: "ISO 8583:1987 (0xxx)",
    meaning: "Avis informant l'hôte qu'une transaction financière a été conclue avec certitude ou confirmation de télécollecte.",
    keyFields: ["DE2 (PAN)", "DE3 (Proc Code)", "DE4 (Amount)", "DE11 (STAN)", "DE37 (RRN)", "DE39 (Response Code)"],
    operationalUsage: "Télécollecte des paiements de péage, parking sans PIN, ou confirmation après stockage en file locale (SAF).",
    diagnosticAdvice: "Vérifier la concordance des montants télécollectés avec le fichier de compensation journalier (clearing file)."
  },
  {
    mti: "0230",
    name: "Financial Transaction Advice Response",
    category: "FINANCIER",
    direction: "RESPONSE",
    isoVersion: "ISO 8583:1987 (0xxx)",
    meaning: "Acquittement par l'hôte de la bonne réception et de la prise en charge de l'avis financier 0220.",
    keyFields: ["DE11 (STAN)", "DE37 (RRN)", "DE39 (Response Code)"],
    operationalUsage: "Dégage le terminal de sa responsabilité d'archivage temporaire de la transaction.",
    diagnosticAdvice: "Un rejet sur 0230 impose une réconciliation manuelle lors de la balance comptable."
  },

  // 3. Reversal & Chargeback (0400 - 0430)
  {
    mti: "0400",
    name: "Reversal Request (Demande d'Extourne / Annulation)",
    category: "REVERSAL_CHARGEBACK",
    direction: "REQUEST",
    isoVersion: "ISO 8583:1987 (0xxx)",
    meaning: "Annulation d'une transaction financière précédente (0200) suite à un incident technique local (délai dépassé, bourrage billets, coupure courant, carte avalée).",
    keyFields: ["DE2 (PAN)", "DE3 (Proc Code)", "DE4 (Amount)", "DE11 (STAN)", "DE37 (RRN)", "DE39 (Reversal Reason)", "DE90 (Original Data Elements)", "DE95 (Replacement Amounts)"],
    operationalUsage: "Crucial pour restituer instantanément les fonds sur le compte du porteur lorsque le GAB n'a pas pu délivrer l'argent.",
    diagnosticAdvice: "Inspecter impérativement le champ DE90 (qui contient le MTI, STAN, date/heure et code acquéreur de la trame initiale 0200). Un DE90 mal formaté empêchera l'extourne et causera un débit abusif !"
  },
  {
    mti: "0410",
    name: "Reversal Response (Réponse d'Extourne)",
    category: "REVERSAL_CHARGEBACK",
    direction: "RESPONSE",
    isoVersion: "ISO 8583:1987 (0xxx)",
    meaning: "Réponse confirmant que l'annulation/extourne a bien été appliquée au niveau de la banque émettrice et du Core Banking.",
    keyFields: ["DE11 (STAN)", "DE37 (RRN)", "DE39 (Response Code)", "DE90 (Original Elements)"],
    operationalUsage: "Garantit que le compte du client a été recrédité ou débloqué.",
    diagnosticAdvice: "Si DE39='00', l'extourne est validée. Si DE39='25' (Unable to locate record), vérifier si la transaction 0200 initiale était réellement parvenue à l'émetteur."
  },
  {
    mti: "0420",
    name: "Reversal Advice (Avis d'Extourne Répété)",
    category: "REVERSAL_CHARGEBACK",
    direction: "ADVICE",
    isoVersion: "ISO 8583:1987 (0xxx)",
    meaning: "Avis d'extourne émis de manière répétée par le terminal jusqu'à réception de l'accusé 0430 (Store and Forward impératif).",
    keyFields: ["DE2 (PAN)", "DE3 (Proc Code)", "DE4 (Amount)", "DE11 (STAN)", "DE90 (Original Data Elements)", "DE95 (Replacement Amounts)"],
    operationalUsage: "Utilisé sur rupture de liaison après distribution partielle ou échec de communication pour garantir l'intégrité financière.",
    diagnosticAdvice: "Un grand nombre de 0420 en attente traduit une indisponibilité prolongée du switch acquéreur ou de la passerelle interbancaire."
  },
  {
    mti: "0430",
    name: "Reversal Advice Response",
    category: "REVERSAL_CHARGEBACK",
    direction: "RESPONSE",
    isoVersion: "ISO 8583:1987 (0xxx)",
    meaning: "Acquittement obligatoire libérant la file d'attente d'extourne sur le terminal.",
    keyFields: ["DE11 (STAN)", "DE37 (RRN)", "DE39 (Response Code)"],
    operationalUsage: "Clôture définitive du cycle de réconciliation de l'incident automate.",
    diagnosticAdvice: "S'assurer que la trame 0430 retourne un DE39='00' pour libérer les compteurs d'alarme du GAB."
  },

  // 4. Réconciliation / Télécollecte (0500 - 0530)
  {
    mti: "0500",
    name: "Reconciliation Request (Demande de Télécollecte / Balance)",
    category: "RECONCILIATION",
    direction: "REQUEST",
    isoVersion: "ISO 8583:1987 (0xxx)",
    meaning: "Message d'échange de totaux journaliers (nombre de débits, crédits, annulations, montants cumulés) entre le terminal et le serveur acquéreur.",
    keyFields: ["DE11 (STAN)", "DE41 (TID)", "DE42 (MID)", "DE66 (Settlement Code)", "DE74-89 (Credits/Debits Number & Amounts)"],
    operationalUsage: "Télécollecte de fin de journée bancaire (Batch Close / Z de caisse TPE).",
    diagnosticAdvice: "Comparer les totaux rapportés en DE74-89 avec le grand livre comptable de l'acquéreur pour détecter tout écart de lot (Batch Out of Balance)."
  },
  {
    mti: "0510",
    name: "Reconciliation Response",
    category: "RECONCILIATION",
    direction: "RESPONSE",
    isoVersion: "ISO 8583:1987 (0xxx)",
    meaning: "Réponse de l'hôte confirmant la réconciliation ou signalant un écart sur les totaux.",
    keyFields: ["DE11 (STAN)", "DE39 (Response Code)", "DE66 (Settlement Code)"],
    operationalUsage: "Permet au terminal de remettre ses compteurs à zéro et d'entamer une nouvelle journée de télécollecte.",
    diagnosticAdvice: "Si DE39='95' (Reconcile error), déclencher un télé-déversement détaillé transaction par transaction pour identifier la transaction manquante."
  },

  // 5. Gestion Réseau & Heartbeat (0800 - 0830)
  {
    mti: "0800",
    name: "Network Management Request (Gestion Réseau & Echo)",
    category: "GESTION_RESEAU",
    direction: "REQUEST",
    isoVersion: "ISO 8583:1987 (0xxx)",
    meaning: "Message technique d'administration : test de ligne (Echo Test), ouverture de session (Logon), fermeture (Logoff), ou échange de clés cryptographiques (Key Exchange).",
    keyFields: ["DE7 (Transmission Date/Time)", "DE11 (STAN)", "DE70 (Network Management Code)", "DE53/DE128 (Sécurité/Clés)"],
    operationalUsage: "Maintien du lien socket keep-alive (Echo Test toutes les 60s) et synchronisation de session interbancaire.",
    diagnosticAdvice: "Si le DE70='001' (Echo Test) n'obtient pas de 0810, la liaison réseau TCP est considérée comme tombée (Link Down) et le routage des 0200 est immédiatement suspendu."
  },
  {
    mti: "0810",
    name: "Network Management Response",
    category: "GESTION_RESEAU",
    direction: "RESPONSE",
    isoVersion: "ISO 8583:1987 (0xxx)",
    meaning: "Réponse confirmant le bon fonctionnement du canal réseau ou la réussite du Logon / échange de clé.",
    keyFields: ["DE7 (Transmission Date/Time)", "DE11 (STAN)", "DE39 (Response Code)", "DE70 (Network Management Code)"],
    operationalUsage: "Confirme la disponibilité opérationnelle de la passerelle ou du switch distant.",
    diagnosticAdvice: "Vérifier que DE39='00'. Tout autre code (ex: '96' ou '80') signifie que le switch distant refuse les transactions de production."
  },
  {
    mti: "0820",
    name: "Network Management Advice",
    category: "GESTION_RESEAU",
    direction: "ADVICE",
    isoVersion: "ISO 8583:1987 (0xxx)",
    meaning: "Avis de gestion réseau notifiant un événement critique (ex: bascule de serveur, coupure programmée).",
    keyFields: ["DE11 (STAN)", "DE70 (Network Management Code)"],
    operationalUsage: "Supervision des alertes d'infrastructure monétique.",
    diagnosticAdvice: "Vérifier les consoles d'exploitation lors de la réception d'un avis de suspension de service."
  }
];

export interface MTIDigitsExplanation {
  digitPosition: number;
  digitRole: string;
  description: string;
  values: Array<{
    value: string;
    meaning: string;
    description: string;
  }>;
}

export const MTI_DIGITS_STRUCTURE: MTIDigitsExplanation[] = [
  {
    digitPosition: 1,
    digitRole: "Version ISO 8583",
    description: "Spécifie la révision de la norme internationale ISO 8583 régissant le message.",
    values: [
      { value: "0", meaning: "ISO 8583:1987", description: "Version la plus répandue mondialement sur les réseaux de paiement (GAB, TPE, Visa/Mastercard)." },
      { value: "1", meaning: "ISO 8583:1993", description: "Révision modernisée introduisant de nouveaux champs et formats étendus." },
      { value: "2", meaning: "ISO 8583:2003", description: "Troisième édition avec support XML et protocoles étendus." },
      { value: "9", meaning: "Usage Privatif / National", description: "Réservé pour protocoles spécifiques propriétaires ou nationaux." },
    ]
  },
  {
    digitPosition: 2,
    digitRole: "Classe de Message (Message Class)",
    description: "Définit le but global du message dans le cycle de vie monétique.",
    values: [
      { value: "1", meaning: "Autorisation (01xx)", description: "Vérification des règles métier et blocage éventuel des fonds sans débit immédiat." },
      { value: "2", meaning: "Financier (02xx)", description: "Transfert d'argent effectif et débit immédiat (retrait GAB, achat TPE)." },
      { value: "3", meaning: "Télécollecte / Fichier (03xx)", description: "Transfert de fichiers de cartes en opposition ou paramètres." },
      { value: "4", meaning: "Annulation / Reversal (04xx)", description: "Extourne d'une opération financière en cas de rupture de chaîne ou incident automate." },
      { value: "5", meaning: "Réconciliation / Balance (05xx)", description: "Échange et validation des totaux journaliers de compensation." },
      { value: "6", meaning: "Administration (06xx)", description: "Instructions administratives et alertes système." },
      { value: "7", meaning: "Gestion de Fraude (07xx)", description: "Alertes de risque, chargebacks et litiges." },
      { value: "8", meaning: "Gestion de Réseau (08xx)", description: "Supervision de liaison, Echo Test, Logon et échange de clés cryptographiques." },
    ]
  },
  {
    digitPosition: 3,
    digitRole: "Fonction du Message (Message Function)",
    description: "Indique le rôle et le comportement attendu dans le flux d'échange.",
    values: [
      { value: "0", meaning: "Demande (Request)", description: "Message initial émis par le terminal ou l'acquéreur sollicitant une action de l'émetteur." },
      { value: "1", meaning: "Réponse à Demande (Request Response)", description: "Réponse apportée par le serveur destinataire à une demande de type x0xx." },
      { value: "2", meaning: "Avis (Advice)", description: "Information transmise avec obligation de traitement (souvent répétée jusqu'à réponse)." },
      { value: "3", meaning: "Réponse à Avis (Advice Response)", description: "Accusé de réception confirmant l'enregistrement de l'avis." },
      { value: "4", meaning: "Notification", description: "Information unilatérale sans attente de réponse." },
    ]
  },
  {
    digitPosition: 4,
    digitRole: "Origine de la Transaction (Message Origin)",
    description: "Identifie qui dans la chaîne a initié ou répété le message.",
    values: [
      { value: "0", meaning: "Acquéreur (Acquirer)", description: "Le message provient du point d'acceptation (GAB, TPE, passerelle e-commerce)." },
      { value: "1", meaning: "Acquéreur Répété", description: "Répétition du message par l'acquéreur suite à un timeout réseau." },
      { value: "2", meaning: "Émetteur (Issuer)", description: "Message initié par la banque émettrice de la carte." },
      { value: "3", meaning: "Émetteur Répété", description: "Répétition de l'émetteur suite à une absence d'acquittement." },
      { value: "4", meaning: "Autre intermédiaire / Switch", description: "Message généré par un switch de routage ou concentrateur intermédiaire." },
    ]
  }
];
