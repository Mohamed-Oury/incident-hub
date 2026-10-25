export interface DE39Definition {
  code: string;
  label: string;
  category: "APPROBATION" | "METIER_PORTEUR" | "SECURITE_CRYPTO" | "TECHNIQUE_RESEAU" | "GESTION_RESEAU";
  meaning: string;
  impactIncident: string;
  recommendedAction: string;
}

export const DE39_CATALOG: DE39Definition[] = [
  // ============================================================================
  // 1. APPROBATION (8 codes)
  // ============================================================================
  {
    code: "00",
    label: "Approved / Honoré",
    category: "APPROBATION",
    meaning: "Transaction approuvée avec succès par l'Émetteur (Issuer).",
    impactIncident: "Comportement nominal. Si l'incident porte sur une absence de cash ou de ticket, le problème se situe en aval (mécanique automate ou capteur de distribution).",
    recommendedAction: "Vérifier les capteurs mécaniques du GAB ou l'imprimante TPE. Consulter les messages de reversal 0400/0420."
  },
  {
    code: "08",
    label: "Honor with Identification",
    category: "APPROBATION",
    meaning: "Transaction approuvée sous réserve d'identification physique du porteur.",
    impactIncident: "Rare sur GAB, survient en TPE lors de contrôles aléatoires ou suspicion de fraude modérée.",
    recommendedAction: "Vérifier la configuration du terminal marchand pour la gestion des demandes de signature ou de pièce d'identité."
  },
  {
    code: "10",
    label: "Partial Approval",
    category: "APPROBATION",
    meaning: "Approbation partielle d'un montant inférieur au montant demandé dans le DE4.",
    impactIncident: "Peut provoquer un litige client si le terminal ne gère pas le multi-règlement (split tender) et tente d'extourner la transaction.",
    recommendedAction: "S'assurer que le paramètre Partial Approval (DE54/DE6) est bien activé sur le TPE et compris par le middleware commerçant."
  },
  {
    code: "11",
    label: "Approved VIP (Stand-In)",
    category: "APPROBATION",
    meaning: "Transaction approuvée selon le barème VIP ou en mode délégation Stand-In Processing (STIP) par le Switch.",
    impactIncident: "Le serveur d'autorisation émetteur n'a pas répondu à temps ou a délégué l'accord au réseau dans la limite des plafonds de secours.",
    recommendedAction: "Vérifier que l'avis d'autorisation Stand-In (0120/0220) est bien redescendu et comptabilisé dans le Core Banking pour éviter un écart de solde."
  },
  {
    code: "16",
    label: "Approved, Update Track 3",
    category: "APPROBATION",
    meaning: "Transaction approuvée avec consigne de mise à jour des données de piste 3 ou des compteurs offline de la carte.",
    impactIncident: "Utilisé sur certaines cartes privatives ou lors d'une synchronisation de plafond hors-ligne.",
    recommendedAction: "S'assurer que le lecteur du GAB/TPE acquitte correctement l'écriture ou les Issuer Scripts EMV (Tags 71/72)."
  },
  {
    code: "32",
    label: "Completed Partially",
    category: "APPROBATION",
    meaning: "Opération partiellement exécutée (ex: distribution partielle de billets sur GAB ou remboursement partiel).",
    impactIncident: "Le porteur n'a reçu qu'une partie des coupures demandées suite à un épuisement de cassette ou un bourrage partiel.",
    recommendedAction: "Contrôler impérativement le champ DE95 (Replacement Amounts) dans le message 0400/0420 afin de ne débiter au client que le montant réellement distribué."
  },
  {
    code: "85",
    label: "No reason to decline",
    category: "APPROBATION",
    meaning: "Pas de motif de rejet (requête de vérification de carte ou de compte sans prélèvement).",
    impactIncident: "Utilisé lors des pré-autorisations ou des tests de validité de compte e-commerce / VAD (Account Verification 0 XOF/EUR).",
    recommendedAction: "Ne pas comptabiliser de flux financier. S'assurer de la conformité du processing code DE3 (ex: 300000 ou 380000)."
  },
  {
    code: "87",
    label: "Purchase Amount Only, No Cashback Allowed",
    category: "APPROBATION",
    meaning: "Montant de l'achat approuvé mais la portion Cashback (retrait d'espèces chez le commerçant) est refusée.",
    impactIncident: "Le TPE doit finaliser uniquement la partie achat ou demander la confirmation du porteur sur le montant réduit.",
    recommendedAction: "Vérifier l'habilitation Cashback du BIN carte et le montant additionnel transmis dans le champ DE54."
  },

  // ============================================================================
  // 2. REJETS MÉTIER / PORTEUR, COMPTE & CARTE (38 codes)
  // ============================================================================
  {
    code: "01",
    label: "Refer to Card Issuer",
    category: "METIER_PORTEUR",
    meaning: "Demande de contact avec la banque émettrice pour accord manuel.",
    impactIncident: "Blocage de la transaction automatique. Souvent lié à des règles de sécurité bancaires spécifiques.",
    recommendedAction: "Inviter le porteur à contacter son agence ou le service d'autorisation de sa banque."
  },
  {
    code: "02",
    label: "Refer to Card Issuer (Special Condition)",
    category: "METIER_PORTEUR",
    meaning: "Consigne d'appel à l'émetteur sous condition particulière (ex: suspicion de fraude ou compte sous tutelle).",
    impactIncident: "Rejet strict sur automate bancaire.",
    recommendedAction: "Vérifier l'état du compte dans le Core Banking émetteur."
  },
  {
    code: "03",
    label: "Invalid Merchant / Card Acceptor",
    category: "METIER_PORTEUR",
    meaning: "Identifiant commerçant (DE42 MID) ou terminal (DE41 TID) inconnu, désactivé ou non autorisé sur le serveur d'acquisition.",
    impactIncident: "Aucun paiement ne passe sur le TPE du marchand ou sur le GAB nouvellement déployé.",
    recommendedAction: "Vérifier l'enrôlement du couple MID (DE42) / TID (DE41) et du code activité MCC (DE18) dans le système de gestion des commerçants et sur le Switch."
  },
  {
    code: "04",
    label: "Pick-up Card (Hold-call)",
    category: "METIER_PORTEUR",
    meaning: "Ordre formel de confiscation de la carte bancaire par l'automate sans motif pénal déclaré.",
    impactIncident: "L'automate avale la carte immédiatement sans délivrance de cash.",
    recommendedAction: "Vérifier si une décision commerciale de clôture de compte a été ordonnée par l'agence bancaire."
  },
  {
    code: "05",
    label: "Do Not Honor (Ne pas honorer)",
    category: "METIER_PORTEUR",
    meaning: "Refus générique de l'Émetteur sans précision du motif (règles de risque, compte inactif, suspicion).",
    impactIncident: "Très fréquent. Peut être individuel (porteur) ou massif (si une règle de scoring fraude globale a été modifiée).",
    recommendedAction: "Isoler si le rejet est concentré sur un BIN, un marchand ou une plage horaire. Analyser le moteur de scoring fraude."
  },
  {
    code: "07",
    label: "Pick-up Card, Special Condition",
    category: "METIER_PORTEUR",
    meaning: "Ordre de capture immédiate de la carte pour condition spéciale (fraude avérée ou blocage contentieux).",
    impactIncident: "Le GAB avale la carte dans le bac de rétention (Retract/Capture bin) et interrompt la session.",
    recommendedAction: "Vérifier le motif d'opposition dans le CMS (Card Management System) et notifier le service Fraude."
  },
  {
    code: "12",
    label: "Invalid Transaction",
    category: "METIER_PORTEUR",
    meaning: "Transaction invalide pour cette carte ou ce terminal.",
    impactIncident: "Tentative d'opération non supportée par le contrat porteur (ex: retrait sur compte épargne non lié, paiement e-commerce avec carte locale).",
    recommendedAction: "Vérifier le Processing Code (DE3) et le type de produit carte dans le Core Banking."
  },
  {
    code: "13",
    label: "Invalid Amount",
    category: "METIER_PORTEUR",
    meaning: "Montant invalide dans le champ DE4.",
    impactIncident: "Montant nul (0), négatif, dépassant les capacités de coupures du GAB ou avec un pas non multiple des billets disponibles.",
    recommendedAction: "Vérifier la table de coupures de l'automate (bill mix) et le cadrage du champ DE4 (format numérique 12 caractères)."
  },
  {
    code: "14",
    label: "Invalid Card Number (No Such Card)",
    category: "METIER_PORTEUR",
    meaning: "Numéro de carte inexistant dans la base émettrice ou erreur de clé de contrôle (Luhn).",
    impactIncident: "Tentative de fraude (brute-force de PAN) ou piste magnétique corrompue transmettant un numéro erroné.",
    recommendedAction: "Contrôler la validité de l'algorithme de Luhn sur le PAN et vérifier l'état d'enrôlement du BIN chez l'émetteur."
  },
  {
    code: "15",
    label: "No Such Issuer",
    category: "METIER_PORTEUR",
    meaning: "Émetteur introuvable dans la table de routage du switch acquéreur.",
    impactIncident: "Le BIN de la carte n'est rattaché à aucun contrat de routage ou accord d'interbancarité.",
    recommendedAction: "Mettre à jour les tables de routage BIN du switch et vérifier les accords d'interopérabilité (GIM-UEMOA, GIMAC, Visa, Mastercard)."
  },
  {
    code: "21",
    label: "No Action Taken (Unable to Back Out)",
    category: "METIER_PORTEUR",
    meaning: "Aucune action effectuée par l'hôte (la transaction à annuler était déjà annulée ou n'avait pas abouti).",
    impactIncident: "Survenant souvent sur un Reversal 0400/0420 lorsque le 0200 initial avait déjà été rejeté côté Core Banking.",
    recommendedAction: "Vérifier dans le CBS qu'aucune écriture de débit ou de réservation n'est restée active sur le compte du client."
  },
  {
    code: "26",
    label: "Duplicate Record",
    category: "METIER_PORTEUR",
    meaning: "Enregistrement déjà existant lors d'une opération de mise à jour de fichier carte ou d'enrôlement.",
    impactIncident: "Rejet d'un message d'administration de fichier (0300/0302) pour doublon de clé.",
    recommendedAction: "Utiliser le code d'action 'Modification' au lieu de 'Création' dans le flux de mise à jour CMS."
  },
  {
    code: "27",
    label: "File Update Field Edit Error",
    category: "METIER_PORTEUR",
    meaning: "Erreur de validation sur un champ lors d'une mise à jour du dossier carte/porteur (03xx).",
    impactIncident: "La modification de plafond ou de statut d'opposition n'a pas été prise en compte par le serveur d'autorisation.",
    recommendedAction: "Contrôler le format des champs transmis entre le Core Banking et le CMS."
  },
  {
    code: "28",
    label: "File Temporarily Unavailable",
    category: "METIER_PORTEUR",
    meaning: "Fichier des cartes ou table des soldes temporairement verrouillé pour mise à jour batch.",
    impactIncident: "Rejet temporaire des autorisations ou des mises à jour pendant un chargement massif de fichier CAF/PBF.",
    recommendedAction: "Vérifier les verrous SGBD sur la table des cartes ou des soldes et planifier les chargements en mode non bloquant."
  },
  {
    code: "29",
    label: "File Update Not Successful",
    category: "METIER_PORTEUR",
    meaning: "Échec de la mise à jour du fichier porteur/opposition.",
    impactIncident: "Désynchronisation potentielle entre le statut carte dans l'agence (CBS) et sur le Switch monétique.",
    recommendedAction: "Relancer la synchronisation de la carte dans le CMS et vérifier les logs du connecteur CBS ↔ Monétique."
  },
  {
    code: "33",
    label: "Expired Card - Pick-up",
    category: "METIER_PORTEUR",
    meaning: "Carte échue avec consigne de rétention par l'automate.",
    impactIncident: "Capture de la carte physique au GAB.",
    recommendedAction: "Vérifier la date d'expiration déclarée dans le DE14 par rapport à la date locale du frontal (DE12/DE13)."
  },
  {
    code: "34",
    label: "Suspected Fraud - Pick-up",
    category: "METIER_PORTEUR",
    meaning: "Suspicion de fraude confirmée avec ordre de capture immédiate de la carte par le GAB.",
    impactIncident: "Confiscation de la carte suite au déclenchement d'une règle critique du moteur anti-fraude (FRM).",
    recommendedAction: "Contacter le porteur pour vérifier l'authenticité de l'opération avant toute restitution de la carte en agence."
  },
  {
    code: "35",
    label: "Card Acceptor Contact Acquirer - Pick-up",
    category: "METIER_PORTEUR",
    meaning: "Consigne au commerçant de contacter l'acquéreur et de retenir la carte.",
    impactIncident: "Rejet avec demande de confiscation sur point de vente ou automate.",
    recommendedAction: "Vérifier le dossier d'alerte associé au PAN dans l'outil de monitoring monétique."
  },
  {
    code: "36",
    label: "Restricted Card - Pick-up",
    category: "METIER_PORTEUR",
    meaning: "Carte restreinte utilisée en violation grave de son périmètre d'usage, avec ordre de capture au GAB.",
    impactIncident: "L'automate retient la carte dans le bac de capture.",
    recommendedAction: "Contrôler les règles d'usage du produit carte et le motif de mise sous surveillance."
  },
  {
    code: "37",
    label: "Call Acquirer Security - Pick-up",
    category: "METIER_PORTEUR",
    meaning: "Alerte sécurité critique : retenir la carte et contacter immédiatement la sécurité monétique de l'acquéreur.",
    impactIncident: "Capture de la carte au GAB et génération d'une alerte de sécurité haute priorité.",
    recommendedAction: "Conserver les preuves (journal EJ GAB, horodatage vidéosurveillance) et alerter l'équipe Fraude & Sécurité."
  },
  {
    code: "38",
    label: "Allowable PIN Tries Exceeded - Pick-up",
    category: "METIER_PORTEUR",
    meaning: "Nombre maximal d'essais PIN dépassé avec ordre de capture immédiate de la carte par le GAB.",
    impactIncident: "Après 3 codes faux consécutifs, le GAB avale la carte au lieu de simplement la restituer bloquée.",
    recommendedAction: "Vérifier la politique de rétention de la banque (capture après 3 faux PIN vs blocage simple DE39='75')."
  },
  {
    code: "39",
    label: "No Credit Account",
    category: "METIER_PORTEUR",
    meaning: "Aucun compte de crédit n'est rattaché à cette carte pour le Processing Code sélectionné (DE3='xx30xx').",
    impactIncident: "Le porteur a choisi l'option 'Compte Crédit' sur l'écran du GAB alors que sa carte est liée uniquement à un compte courant.",
    recommendedAction: "Inviter le client à sélectionner 'Compte Courant / Chèque' ou adapter le menu GAB pour masquer les types de comptes non utilisés."
  },
  {
    code: "40",
    label: "Requested Function Not Supported",
    category: "METIER_PORTEUR",
    meaning: "Fonction demandée (ex: virement, changement de PIN, mini-relevé) non supportée par l'émetteur de la carte.",
    impactIncident: "Fréquent lorsqu'un porteur confrère (Off-Us) tente un changement de PIN ou une demande de mini-relevé sur un GAB d'une autre banque.",
    recommendedAction: "Limiter sur le GAB les services privatifs (mini-relevé, virement interne) aux seuls BIN domestiques (On-Us)."
  },
  {
    code: "41",
    label: "Lost Card - Pick-up",
    category: "METIER_PORTEUR",
    meaning: "Carte déclarée perdue par le titulaire.",
    impactIncident: "Capture immédiate de la carte. Alerte au service surveillance monétique.",
    recommendedAction: "Consigner l'automate et archiver le journal électronique pour traçabilité de capture."
  },
  {
    code: "42",
    label: "No Universal Account",
    category: "METIER_PORTEUR",
    meaning: "Aucun compte principal/universel par défaut n'est configuré sur le contrat carte (DE3='xx00xx').",
    impactIncident: "Échec de routage interne vers le compte du client dans le Core Banking.",
    recommendedAction: "Vérifier le rattachement du compte principal (DE102) sur la fiche contrat carte dans Amplitude (`BKCAR`) ou FLEXCUBE."
  },
  {
    code: "43",
    label: "Stolen Card - Pick-up",
    category: "METIER_PORTEUR",
    meaning: "Carte déclarée volée avec ordre de confiscation immédiate.",
    impactIncident: "Opposition pour vol active. Déclenchement potentiel d'une capture photo/vidéo sur l'automate.",
    recommendedAction: "Alerter le département de sécurité bancaire et isoler les traces d'horodatage."
  },
  {
    code: "44",
    label: "No Investment Account",
    category: "METIER_PORTEUR",
    meaning: "Aucun compte d'investissement rattaché à la carte.",
    impactIncident: "Sélection d'un type de compte invalide dans le Processing Code DE3.",
    recommendedAction: "Vérifier le mapping des types de comptes entre l'écran GAB et les positions 3-4 du DE3."
  },
  {
    code: "51",
    label: "Insufficient Funds (Provision insuffisante)",
    category: "METIER_PORTEUR",
    meaning: "Solde disponible insuffisant pour couvrir le montant de la transaction et les commissions éventuelles.",
    impactIncident: "Refus normal porteur. Attention aux anomalies si le solde réel est positif (blocage sur réserve d'autorisation en attente).",
    recommendedAction: "Vérifier le solde comptable vs solde disponible, et les éventuels gels de provisions temporaires sur le CBS."
  },
  {
    code: "52",
    label: "No Checking Account",
    category: "METIER_PORTEUR",
    meaning: "Aucun compte chèque / courant rattaché à la carte (DE3='xx20xx').",
    impactIncident: "Survient pour un porteur titulaire uniquement d'un compte d'épargne qui choisit 'Compte Courant' sur le GAB.",
    recommendedAction: "Vérifier le type de compte rattaché au PAN ou orienter le client vers l'option 'Épargne' sur le GAB."
  },
  {
    code: "53",
    label: "No Savings Account",
    category: "METIER_PORTEUR",
    meaning: "Aucun compte d'épargne rattaché à la carte (DE3='xx10xx').",
    impactIncident: "Très fréquent : le client appuie sur 'Épargne' au GAB alors que sa carte est adossée à un compte courant chèque.",
    recommendedAction: "Informer le client d'utiliser l'option 'Compte Courant' ou harmoniser le routage par défaut (`00`) sur le serveur d'autorisation."
  },
  {
    code: "54",
    label: "Expired Card (Carte expirée)",
    category: "METIER_PORTEUR",
    meaning: "Date de validité de la carte dépassée.",
    impactIncident: "Transaction rejetée sans capture de la carte.",
    recommendedAction: "Vérifier si le client a reçu sa carte de renouvellement et si l'horloge du frontal n'a pas dérivé."
  },
  {
    code: "56",
    label: "No Card Record",
    category: "METIER_PORTEUR",
    meaning: "Le BIN appartient bien à la banque émettrice, mais le numéro de carte (PAN) est introuvable dans le CMS.",
    impactIncident: "Carte produite mais non encore injectée dans la base du serveur d'autorisation (CAF non chargé).",
    recommendedAction: "Vérifier l'exécution du batch de synchronisation des nouvelles cartes émises entre le CMS et le frontal d'autorisation."
  },
  {
    code: "57",
    label: "Transaction Not Permitted to Cardholder",
    category: "METIER_PORTEUR",
    meaning: "Opération non autorisée selon le contrat du porteur.",
    impactIncident: "Carte de retrait exclusif utilisée sur un terminal de paiement ou carte à usage domestique tentée à l'international.",
    recommendedAction: "Contrôler le profil du produit carte et les habilitations de canaux dans le système de gestion des cartes (CMS)."
  },
  {
    code: "59",
    label: "Suspected Fraud (Decline)",
    category: "METIER_PORTEUR",
    meaning: "Refus pour suspicion de fraude par le moteur de scoring temps réel (sans capture de la carte).",
    impactIncident: "Transaction atypique détectée (pays inhabituel, montant élevé nocturne, succession rapide d'achats web).",
    recommendedAction: "Consulter l'alerte dans l'outil de lutte contre la fraude (FRM) et valider avec le porteur pour lever temporairement la règle si légitime."
  },
  {
    code: "60",
    label: "Card Acceptor Contact Acquirer",
    category: "METIER_PORTEUR",
    meaning: "Refus demandant à l'accepteur (commerçant) de prendre contact avec sa banque acquéreuse.",
    impactIncident: "Dépassement de plafond d'acceptation marchand ou contrôle de conformité sur le point de vente.",
    recommendedAction: "Vérifier le statut et les plafonds du contrat commerçant (MID DE42) côté acquisition."
  },
  {
    code: "61",
    label: "Exceeds Withdrawal Amount Limit",
    category: "METIER_PORTEUR",
    meaning: "Dépassement du plafond de retrait autorisé (journalier ou hebdomadaire glissant).",
    impactIncident: "Le client a atteint son plafond de dépenses ou de retraits paramétré sur son compte.",
    recommendedAction: "Vérifier l'historique des autorisations cumulées sur la période glissante dans le CMS."
  },
  {
    code: "62",
    label: "Restricted Card (Carte restreinte)",
    category: "METIER_PORTEUR",
    meaning: "Carte soumise à des restrictions de sécurité (pays, type de commerçant MCC, canal internet désactivé).",
    impactIncident: "Rejet ciblé lors de transactions transfrontalières ou sur des marchands spécifiques.",
    recommendedAction: "Consulter la matrice de filtrage géographique (Geo-blocking) et le code activité marchand (DE18/DE42)."
  },
  {
    code: "64",
    label: "Original Amount Incorrect",
    category: "METIER_PORTEUR",
    meaning: "Le montant indiqué dans un message d'annulation (0400/0420) ou de confirmation ne correspond pas au montant de la transaction initiale.",
    impactIncident: "L'extourne est rejetée par l'émetteur, laissant la réservation de fonds active sur le compte du porteur.",
    recommendedAction: "Comparer DE4 et DE95 du Reversal 0400 avec le DE4 du 0200 d'origine identifié par DE90."
  },
  {
    code: "65",
    label: "Exceeds Withdrawal Frequency Limit",
    category: "METIER_PORTEUR",
    meaning: "Dépassement du nombre maximal d'opérations autorisées par période.",
    impactIncident: "Règle de vélocité atteinte (ex: plus de 3 retraits dans la même journée).",
    recommendedAction: "Vérifier le compteur de fréquence de retrait du porteur dans le Core Banking."
  },
  {
    code: "67",
    label: "Hard Capture (Pick-up at ATM)",
    category: "METIER_PORTEUR",
    meaning: "Ordre impératif de capture physique de la carte sur automate bancaire (GAB).",
    impactIncident: "Carte immédiatement retenue dans le coffre de capture du GAB.",
    recommendedAction: "Identifier dans le journal d'audit CMS l'opérateur ou la règle ayant positionné le statut Hard Capture."
  },
  {
    code: "75",
    label: "Allowable PIN Tries Exceeded",
    category: "METIER_PORTEUR",
    meaning: "Nombre maximal de tentatives de code confidentiel erroné dépassé (généralement 3 essais consécutifs).",
    impactIncident: "Blocage de l'application PIN sur la puce EMV ou sur le serveur d'autorisation.",
    recommendedAction: "Déblocage du compteur PIN par le porteur en agence ou via l'application bancaire (commande de déblocage PIN / Issuer Script Tag 72)."
  },
  {
    code: "78",
    label: "Blocked, First Use (Card Not Activated)",
    category: "METIER_PORTEUR",
    meaning: "Carte neuve ou renouvelée non encore activée par le porteur pour une première utilisation.",
    impactIncident: "Le client tente un paiement sans contact ou e-commerce avant d'avoir effectué son premier retrait/paiement avec saisie du code PIN.",
    recommendedAction: "Demander au porteur d'effectuer une première opération avec insertion de la puce et saisie du PIN sur GAB ou d'activer la carte en agence/app."
  },

  // ============================================================================
  // 3. REJETS DE SÉCURITÉ, CRYPTOGRAPHIE, EMV & 3-D SECURE (14 codes)
  // ============================================================================
  {
    code: "1A",
    label: "Additional Customer Authentication Required (SCA / 3DS)",
    category: "SECURITE_CRYPTO",
    meaning: "Soft Decline : l'émetteur exige une authentification forte du porteur (Strong Customer Authentication — 3-D Secure) avant d'autoriser le paiement.",
    impactIncident: "Une transaction e-commerce soumise sans preuve d'authentification 3DS est refusée temporairement pour forcer un challenge OTP/Biométrie.",
    recommendedAction: "Le PSP / passerelle e-commerce doit relancer immédiatement le flux 3-D Secure (Challenge Flow) puis resoumettre le 0100 avec le CAVV/ECI dans DE48."
  },
  {
    code: "50",
    label: "Unauthorized Usage / 3DS Failure",
    category: "SECURITE_CRYPTO",
    meaning: "Usage non autorisé ou échec de validation du cryptogramme d'authentification 3-D Secure (CAVV / AAV).",
    impactIncident: "Refus sécuritaire lors d'un paiement en ligne (e-commerce).",
    recommendedAction: "Vérifier l'indicateur ECI et la clé de vérification CAVV entre l'ACS (Access Control Server) et le serveur d'autorisation."
  },
  {
    code: "55",
    label: "Incorrect PIN",
    category: "SECURITE_CRYPTO",
    meaning: "Code PIN saisi erroné lors de la vérification par le HSM de l'Émetteur.",
    impactIncident: "Erreur de saisie client ou désynchronisation du bloc de vérification de PIN (PVV / IBM 3624).",
    recommendedAction: "Si l'erreur est massive, suspecter un problème de clé de zone ZPK ou une mauvaise table de dérivation décimale sur le HSM."
  },
  {
    code: "63",
    label: "Security Violation",
    category: "SECURITE_CRYPTO",
    meaning: "Violation des règles de sécurité protocolaires ou cryptographiques détectée par le Switch ou l'Émetteur.",
    impactIncident: "Présence d'un repli piste interdit (Fallback DE22='801' sur carte puce), absence de données EMV obligatoires ou incohérence de certificat.",
    recommendedAction: "Inspecter DE22 (POS Entry Mode), le Service Code de la piste 2 (DE35) et la présence du champ DE55."
  },
  {
    code: "66",
    label: "Call Acquirer's Security Department",
    category: "SECURITE_CRYPTO",
    meaning: "Alerte de sécurité sur le point d'acceptation nécessitant l'intervention du département Sécurité de l'acquéreur.",
    impactIncident: "Suspicion de compromission du terminal (Skimming, TPE déclaré volé ou manipulé).",
    recommendedAction: "Suspendre immédiatement le TID (DE41) concerné dans le TMS et lancer une inspection physique du terminal."
  },
  {
    code: "70",
    label: "PIN Data Required",
    category: "SECURITE_CRYPTO",
    meaning: "La transaction exige obligatoirement un PIN Block (DE52), mais celui-ci est absent de la trame.",
    impactIncident: "Un retrait GAB ou un achat au-dessus du plafond sans contact est envoyé sans champ DE52.",
    recommendedAction: "Vérifier les règles CVM (Cardholder Verification Method) de la puce/terminal et s'assurer que le bit 52 est bien activé dans le bitmap."
  },
  {
    code: "71",
    label: "PIN Not Changed",
    category: "SECURITE_CRYPTO",
    meaning: "La demande de changement de code PIN sur GAB a été refusée par le serveur d'autorisation ou le HSM.",
    impactIncident: "Le nouveau code PIN choisi par le porteur n'a pas pu être enregistré.",
    recommendedAction: "Vérifier le format du double PIN block (ancien PIN + nouveau PIN) et la génération de l'Issuer Script EMV (Tag 72) de mise à jour PIN."
  },
  {
    code: "81",
    label: "PIN Cryptographic Error Found",
    category: "SECURITE_CRYPTO",
    meaning: "Erreur cryptographique matérielle détectée par le HSM lors du déchiffrement ou de la vérification du PIN Block (DE52).",
    impactIncident: "Parité de clé invalide, erreur de contrôle d'intégrité LMK ou clé ZPK corrompue dans la table de sécurité.",
    recommendedAction: "Exécuter un diagnostic HSM, comparer le KCV (Key Check Value) de la clé ZPK avec le Switch partenaire et recharger la clé de travail."
  },
  {
    code: "82",
    label: "Incorrect CVV / iCVV",
    category: "SECURITE_CRYPTO",
    meaning: "Cryptogramme de sécurité visuel (CVV2/CVC2) ou cryptogramme de piste (iCVV) invalide.",
    impactIncident: "Rejet fréquent sur transactions e-commerce (VAD) ou tentative de clonage de piste magnétique.",
    recommendedAction: "Vérifier l'intégrité de la formule de calcul CVV (clé CVK sur le HSM) et la concordance de la date d'expiration."
  },
  {
    code: "83",
    label: "Unable to Verify PIN",
    category: "SECURITE_CRYPTO",
    meaning: "Impossible de vérifier le code PIN car le sous-système cryptographique (HSM) est injoignable ou saturé.",
    impactIncident: "Toutes les transactions avec PIN en ligne échouent temporairement côté émetteur.",
    recommendedAction: "Vérifier la connectivité TCP/IP entre le serveur d'autorisation et les boîtiers HSM (primaire et secours) ainsi que la charge CPU des HSM."
  },
  {
    code: "86",
    label: "Cannot Verify PIN",
    category: "SECURITE_CRYPTO",
    meaning: "Méthode ou algorithme de vérification PIN non supporté pour ce BIN (ex: méthode Visa PVV vs IBM 3624 Offset).",
    impactIncident: "Échec systématique de validation PIN sur une plage de cartes nouvellement migrée.",
    recommendedAction: "Contrôler le paramétrage de l'algorithme de vérification PIN (PVV, Offset, table de décimalisation) associé au profil BIN dans le CMS."
  },
  {
    code: "88",
    label: "Cryptographic Failure",
    category: "SECURITE_CRYPTO",
    meaning: "Échec général de calcul ou de dérivation cryptographique sur le HSM.",
    impactIncident: "Indisponibilité d'une clé maîtresse (LMK/ZMK), désynchronisation de compteur DUKPT (KSN) ou firmware HSM en incident.",
    recommendedAction: "Consulter les logs d'alertes du HSM (Thales payShield, Atos, etc.) et vérifier la table des clés de session."
  },
  {
    code: "89",
    label: "Invalid PIN Block",
    category: "SECURITE_CRYPTO",
    meaning: "Format de bloc de PIN (DE52) non reconnu ou corrompu lors de la traduction cryptographique.",
    impactIncident: "Incompatibilité de format entre l'EPP du terminal (ex: Format ISO-1) et le switch récepteur (attendant Format ISO-0).",
    recommendedAction: "Standardiser le paramétrage du format de PIN block sur l'ensemble des contrôleurs de terminaux marchands et automates."
  },
  {
    code: "93",
    label: "Violation / EMV Cryptogram Failure",
    category: "SECURITE_CRYPTO",
    meaning: "Cryptogramme de transaction EMV (ARQC dans le DE55) déclaré invalide par le serveur d'autorisation.",
    impactIncident: "La carte puce et l'émetteur ne calculent pas le même résultat cryptographique (ATC désynchronisé, CSN DE23 erroné ou clé IMK-AC invalide).",
    recommendedAction: "Vérifier le numéro de séquence carte (DE23), le schéma de dérivation (Option A/B, EMV 2000 / CPS) et la clé IMK-AC dans le HSM."
  },

  // ============================================================================
  // 4. REJETS TECHNIQUES, FORMAT, TIMEOUTS & RÉSEAU (21 codes)
  // ============================================================================
  {
    code: "06",
    label: "Error (General Processing Error)",
    category: "TECHNIQUE_RESEAU",
    meaning: "Erreur générique de traitement non classifiée lors de l'exécution de l'opération.",
    impactIncident: "Interrompt la transaction sans détail métier spécifique.",
    recommendedAction: "Consulter la trace applicative détaillée sur le serveur d'autorisation et vérifier le champ DE44 s'il est présent."
  },
  {
    code: "09",
    label: "Request in Progress",
    category: "TECHNIQUE_RESEAU",
    meaning: "La requête initiale est toujours en cours de traitement par l'hôte.",
    impactIncident: "Retourné lorsqu'un terminal ou un switch renvoie prématurément une répétition (0101/0201) avant la fin du traitement initial.",
    recommendedAction: "Ajuster le délai avant répétition (Retry timer) sur le concentrateur acquéreur."
  },
  {
    code: "17",
    label: "Customer Cancellation",
    category: "TECHNIQUE_RESEAU",
    meaning: "Annulation de l'opération à l'initiative du client (appui sur la touche ANNULATION du GAB/TPE).",
    impactIncident: "Génère un Reversal 0400/0420 si l'abandon intervient après l'envoi du 0200.",
    recommendedAction: "Vérifier que la réservation de fonds éventuelle a bien été levée par l'extourne associée."
  },
  {
    code: "18",
    label: "Customer Dispute",
    category: "TECHNIQUE_RESEAU",
    meaning: "Opération marquée en litige porteur (contestation de transaction ou chargeback).",
    impactIncident: "Utilisé dans les flux d'avis ou de régularisation suite à une réclamation client (cash non distribué ou double débit).",
    recommendedAction: "Croiser le RRN (DE37) avec le journal électronique GAB (ATM EJ) et le rapport d'arrêté de caisse physique."
  },
  {
    code: "19",
    label: "Re-enter Transaction",
    category: "TECHNIQUE_RESEAU",
    meaning: "Demande de réintroduction de la transaction suite à une anomalie temporaire.",
    impactIncident: "Échec temporaire de communication entre le concentrateur et le frontal Payway.",
    recommendedAction: "Le porteur peut réitérer immédiatement. Vérifier la stabilité du réseau de collecte."
  },
  {
    code: "20",
    label: "Invalid Response",
    category: "TECHNIQUE_RESEAU",
    meaning: "La réponse reçue du système émetteur ou du Core Banking est illisible ou non conforme au protocole.",
    impactIncident: "Le Switch ne parvient pas à décoder le 0110/0210 renvoyé par l'émetteur et déclenche une annulation technique.",
    recommendedAction: "Analyser la trame de réponse brute entre le connecteur CBS et le Switch (vérifier le bitmap et les longueurs LLVAR)."
  },
  {
    code: "22",
    label: "Suspected Malfunction (Hardware / ATM Fault)",
    category: "TECHNIQUE_RESEAU",
    meaning: "Dysfonctionnement matériel détecté sur le terminal ou le GAB (bourrage billets, erreur capteur coffre, shutter bloqué).",
    impactIncident: "Code motif typique envoyé dans une trame d'extourne 0400/0420 lorsque le GAB ne peut pas délivrer les billets après un accord 0210.",
    recommendedAction: "Inspecter immédiatement le journal GAB (ATM EJ), vérifier l'acquittement du 0410/0430 pour garantir le recrédit automatique du client, et dépêcher la maintenance matériel."
  },
  {
    code: "23",
    label: "Unacceptable Transaction Fee",
    category: "TECHNIQUE_RESEAU",
    meaning: "Montant des frais de transaction (DE28) jugé inacceptable ou non conforme aux règles tarifaires du réseau.",
    impactIncident: "Rejet de la transaction par le Switch interbancaire ou l'Émetteur.",
    recommendedAction: "Vérifier le paramétrage de la grille de frais d'interchange / surcharge envoyée dans le champ DE28."
  },
  {
    code: "24",
    label: "File Update Not Supported by Receiver",
    category: "TECHNIQUE_RESEAU",
    meaning: "Le système destinataire ne supporte pas les messages de mise à jour de fichiers en ligne (0300).",
    impactIncident: "Impossible de pousser les mises à jour de listes d'opposition en temps réel vers ce partenaire.",
    recommendedAction: "Basculer sur le mode d'échange de fichiers d'opposition par lot (Batch Exception File)."
  },
  {
    code: "25",
    label: "Unable to Locate Record on File",
    category: "TECHNIQUE_RESEAU",
    meaning: "Enregistrement d'origine introuvable pour une opération de suivi (annulation 0400 ou confirmation 0220).",
    impactIncident: "Le message d'annulation ou de reversal ne parvient pas à matcher avec la transaction initiale (STAN ou DE90 incohérent).",
    recommendedAction: "Vérifier la concordance des données de référence originale dans le champ DE90 (MTI original, STAN, date et heure)."
  },
  {
    code: "30",
    label: "Format Error",
    category: "TECHNIQUE_RESEAU",
    meaning: "Erreur de syntaxe ou de conformité dans le message ISO 8583.",
    impactIncident: "Champ de longueur variable (LLVAR/LLLVAR) mal encodé, caractère interdit dans un champ numérique, ou champ obligatoire absent.",
    recommendedAction: "Capturer la trame brute avec le Parseur ISO 8583 du Hub, décoder le bitmap et identifier le premier Data Element en anomalie."
  },
  {
    code: "31",
    label: "Bank Not Supported by Switch",
    category: "TECHNIQUE_RESEAU",
    meaning: "L'institution bancaire émettrice ou réceptrice (DE32/DE100) n'est pas déclarée ou n'est plus supportée sur le Switch.",
    impactIncident: "Échec de routage interbancaire pour toutes les cartes de cet établissement.",
    recommendedAction: "Vérifier la table des membres participants et les routes d'acheminement sur le Switch central."
  },
  {
    code: "58",
    label: "Transaction Not Permitted to Terminal",
    category: "TECHNIQUE_RESEAU",
    meaning: "Opération non autorisée pour ce Terminal ID (DE41).",
    impactIncident: "Le terminal n'est pas habilité pour ce type d'opération (ex: demande de cashback ou dépôt espèces sur un terminal non certifié).",
    recommendedAction: "Vérifier la table des profils terminaux dans le système TMS et les habilitations de flux sur le frontal."
  },
  {
    code: "68",
    label: "Response Received Too Late (Timeout)",
    category: "TECHNIQUE_RESEAU",
    meaning: "La réponse de l'Host est parvenue après expiration du timer d'attente du switch ou du frontal.",
    impactIncident: "Le client a déjà abandonné ou l'automate a généré un abandon. Le compte peut être débité à tort si le Reversal 0400/0420 échoue.",
    recommendedAction: "Analyser la latence du Core Banking (requêtes SQL lentes sur `bkcom`/`bkcpt`), vérifier les timers du Switch et confirmer l'émission automatique du 0420."
  },
  {
    code: "76",
    label: "Key Synchronization Error",
    category: "TECHNIQUE_RESEAU",
    meaning: "Désynchronisation des clés de sécurité de liaison interbancaire.",
    impactIncident: "Rejet en bloc de toutes les transactions passant par une liaison spécifique.",
    recommendedAction: "Forcer un échange de clés de session (Key Exchange via message réseau 0800 DE70='101' ou '161')."
  },
  {
    code: "90",
    label: "System Cutover in Progress",
    category: "TECHNIQUE_RESEAU",
    meaning: "Arrêté comptable et bascule de journée en cours sur le Core Banking ou le Switch.",
    impactIncident: "Interruption temporaire des autorisations pendant l'exécution des procédures d'arrêté comptable (Cut-off / EOD).",
    recommendedAction: "Activer le mode Stand-In (STIP) sur le frontal monétique pendant le batch de fin de journée du CBS (Amplitude / FLEXCUBE)."
  },
  {
    code: "91",
    label: "Issuer or Switch Inoperative (Timeout)",
    category: "TECHNIQUE_RESEAU",
    meaning: "L'Émetteur distant, le Switch ou la passerelle intermédiaire ne répond pas dans le délai imparti.",
    impactIncident: "L'incident monétique d'exploitation le plus critique. Indique une panne réseau WAN, un crash du Core Banking, ou une saturation de sockets.",
    recommendedAction: "Vérifier les flux réseau (Echo test 0800 DE70='301'), l'état Sign-On (DE70='001'), les pools de connexions et le listener CBS."
  },
  {
    code: "92",
    label: "Destination Unreachable",
    category: "TECHNIQUE_RESEAU",
    meaning: "Nœud de routage ou switch intermédiaire impossible à contacter sur le réseau.",
    impactIncident: "Rupture de liaison télécom dédiée, panne de routeur BGP ou pare-feu bloquant le port TCP monétique.",
    recommendedAction: "Vérifier la connectivité IP, basculer sur le lien télécom redondant (VPN/Fibre secondaire) et sonder le switch partenaire."
  },
  {
    code: "94",
    label: "Duplicate Transmission",
    category: "TECHNIQUE_RESEAU",
    meaning: "Message identifié comme un doublon exact d'une transaction déjà enregistrée.",
    impactIncident: "Un terminal ou un switch rejoue un message déjà acquitté suite à une perte d'accusé de réception réseau.",
    recommendedAction: "Contrôler l'unicité du couple (STAN DE11, RRN DE37, Horodatage DE7) et rejeter la seconde transmission pour éviter le double débit."
  },
  {
    code: "95",
    label: "Reconcile Error",
    category: "TECHNIQUE_RESEAU",
    meaning: "Écart détecté lors de la réconciliation des totaux de fin de journée (0500/0510) entre le terminal/acquéreur et l'hôte.",
    impactIncident: "Les compteurs de débits/crédits cumulés ne concordent pas (DE66='2' Out of Balance).",
    recommendedAction: "Lancer le batch de rapprochement détaillé transaction par transaction sur la date de compensation DE15 pour isoler les suspens."
  },
  {
    code: "96",
    label: "System Malfunction",
    category: "TECHNIQUE_RESEAU",
    meaning: "Défaillance logicielle, système ou base de données sur le frontal ou le Host.",
    impactIncident: "Panne interne majeure (exception applicative, base de données inaccessible, tablespace plein, crash du démon monétique).",
    recommendedAction: "Consulter immédiatement les journaux d'erreurs, relancer le service d'autorisation et vérifier les ressources serveur (CPU/RAM/Disque/SGBD)."
  },

  // ============================================================================
  // 5. GESTION DE RÉSEAU & INTÉGRITÉ PROTOCOLE (5 codes)
  // ============================================================================
  {
    code: "77",
    label: "Inconsistent Data with Original Message",
    category: "GESTION_RESEAU",
    meaning: "Les données transmises dans le message de suivi (Reversal 0400 ou Advice 0220) sont incohérentes avec la transaction d'origine.",
    impactIncident: "La transaction initiale a bien été retrouvée via DE90, mais le PAN (DE2), le code traitement (DE3) ou la devise (DE49) ne correspondent pas.",
    recommendedAction: "S'assurer que le générateur de Reversal du GAB/Switch recopie à l'identique les champs invariables du message 0200 d'origine."
  },
  {
    code: "80",
    label: "Invalid Date / Cut-off Date Error",
    category: "GESTION_RESEAU",
    meaning: "Date de transaction (DE13) ou date de compensation (DE15) invalide ou hors fenêtre de journée comptable acceptée.",
    impactIncident: "Rejet des messages lors d'une désynchronisation de bascule de journée (Cut-off 0800 DE70='201') entre deux switches.",
    recommendedAction: "Synchroniser la date de compensation DE15 avec le Switch central et vérifier la bonne exécution du message 0800 Cut-off."
  },
  {
    code: "97",
    label: "Reconciliation Totals Reset",
    category: "GESTION_RESEAU",
    meaning: "Confirmation de remise à zéro des compteurs de compensation et bascule vers la nouvelle journée comptable.",
    impactIncident: "Clôture de la fenêtre comptable précédente et ouverture du nouveau lot de compensation.",
    recommendedAction: "Archiver le rapport d'arrêté comptable de la journée échue et déclencher la génération des fichiers de clearing."
  },
  {
    code: "98",
    label: "MAC Error (Message Authentication Code)",
    category: "GESTION_RESEAU",
    meaning: "Échec de vérification du code d'authentification de message (champ DE64 ou DE128).",
    impactIncident: "Soupçon d'altération de message sur le réseau ou désynchronisation de la clé d'intégrité MAC (TAK/ZAK).",
    recommendedAction: "Renouveler immédiatement la clé de signature MAC (TAK/ZAK) via une séquence d'échange de clés 0800."
  },
  {
    code: "99",
    label: "PIN Block Translation Failure",
    category: "GESTION_RESEAU",
    meaning: "Erreur fatale lors du transchiffrement de bloc PIN par le switch intermédiaire.",
    impactIncident: "Blocage total des opérations nécessitant la saisie du code PIN sur le canal interbancaire.",
    recommendedAction: "Vérifier les paires de clés de zone entre les switches participants et réinitialiser la liaison cryptographique."
  }
];
