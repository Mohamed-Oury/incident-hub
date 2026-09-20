import { CbsTableDefinition } from "./cbs-advanced-data";

export const CBS_ADDITIONAL_TABLES: CbsTableDefinition[] = [
  // 1. CLIENTÈLE & KYC
  {
    tableName: "BKPEU",
    module: "Clientèle / KYC",
    description: "Personnes physiques liées, mandataires, bénéficiaires effectifs et procurations.",
    primaryKey: ["CLI", "PEU"],
    foreignKeys: [{ column: "CLI", references: "BKCLI.CLI" }],
    columns: [
      { name: "CLI", type: "VARCHAR2(15)", description: "Identifiant du client titulaire." },
      { name: "PEU", type: "VARCHAR2(15)", description: "Identifiant du tiers mandataire ou ayant-droit." },
      { name: "TYP", type: "VARCHAR2(2)", description: "Lien juridique : 01=Mandataire, 02=Bénéficiaire effectif, 03=Tuteur." },
      { name: "DVA", type: "DATE", description: "Date de validité ou d'expiration de la procuration." },
    ],
    sampleQuery: "SELECT CLI, PEU, TYP FROM BKPEU WHERE DVA >= TRUNC(SYSDATE);",
    criticalNotes: "Contrôlé lors des ordres de virement en agence et des transactions de guichet."
  },
  {
    tableName: "BKTIR",
    module: "Clientèle / KYC",
    description: "Registre général des personnes morales et tiers institutionnels.",
    primaryKey: ["TIR"],
    foreignKeys: [],
    columns: [
      { name: "TIR", type: "VARCHAR2(15)", description: "Identifiant unique du tiers." },
      { name: "RS", type: "VARCHAR2(60)", description: "Raison sociale officielle enregistrée au RCCM." },
      { name: "SIG", type: "VARCHAR2(20)", description: "Sigle ou nom commercial." },
      { name: "RC", type: "VARCHAR2(30)", description: "Numéro d'immatriculation au Registre du Commerce." },
      { name: "NIF", type: "VARCHAR2(30)", description: "Numéro d'Identification Fiscale de l'entreprise." },
    ],
    sampleQuery: "SELECT TIR, RS, RC, NIF FROM BKTIR WHERE TIR = 'TIR-9901';",
    criticalNotes: "Données nécessaires aux déclarations fiscales périodiques et audits fiscaux."
  },
  {
    tableName: "BKADR",
    module: "Clientèle / KYC",
    description: "Adresses postales, géographiques, emails et numéros de téléphone des tiers.",
    primaryKey: ["CLI", "NUM"],
    foreignKeys: [{ column: "CLI", references: "BKCLI.CLI" }],
    columns: [
      { name: "CLI", type: "VARCHAR2(15)", description: "Identifiant client." },
      { name: "NUM", type: "NUMBER(2)", description: "Numéro de séquence d'adresse (01=Principale, 02=Pro, etc.)." },
      { name: "L1", type: "VARCHAR2(40)", description: "Ligne d'adresse 1 (Rue, Numéro, Bâtiment)." },
      { name: "VIL", type: "VARCHAR2(35)", description: "Ville de résidence." },
      { name: "PAY", type: "VARCHAR2(3)", description: "Code pays ISO de résidence (ex: SN, CI, FR)." },
      { name: "TEL", type: "VARCHAR2(25)", description: "Numéro de téléphone mobile pour notifications SMS.", sensitive: true },
      { name: "EMA", type: "VARCHAR2(80)", description: "Adresse e-mail pour relevés dématérialisés.", sensitive: true },
    ],
    sampleQuery: "SELECT CLI, VIL, PAY, TEL FROM BKADR WHERE CLI = '0100155';",
    criticalNotes: "Table synchronisée avec le serveur de notifications SMS/Push transactionnels."
  },
  {
    tableName: "BKKYC",
    module: "Clientèle / KYC",
    description: "Données de conformité, score de vigilance anti-blanchiment et classifications FATCA/CRS.",
    primaryKey: ["CLI"],
    foreignKeys: [{ column: "CLI", references: "BKCLI.CLI" }],
    columns: [
      { name: "CLI", type: "VARCHAR2(15)", description: "Code client." },
      { name: "SCO", type: "NUMBER(3)", description: "Score de risque LCB-FT (0=Faible, 100=Élevé)." },
      { name: "PPE", type: "VARCHAR2(1)", description: "Statut Personne Politiquement Exposée (O/N)." },
      { name: "FATCA", type: "VARCHAR2(1)", description: "Assujettissement fiscal américain FATCA (O/N)." },
      { name: "DREV", type: "DATE", description: "Date de prochaine révision périodique du dossier KYC." },
    ],
    sampleQuery: "SELECT CLI, SCO, PPE, FATCA FROM BKKYC WHERE SCO > 70;",
    criticalNotes: "Tout changement de score de risque peut déclencher des blocages préventifs de comptes."
  },
  {
    tableName: "BKGRP",
    module: "Clientèle / KYC",
    description: "Groupes d'entreprises, holdings et consolidation des risques de contrepartie.",
    primaryKey: ["GRP"],
    foreignKeys: [],
    columns: [
      { name: "GRP", type: "VARCHAR2(10)", description: "Identifiant du groupe financier ou familial." },
      { name: "LIB", type: "VARCHAR2(40)", description: "Nom ou libellé du groupe." },
      { name: "TETE", type: "VARCHAR2(15)", description: "Code client de l'entité mère (chef de file)." },
      { name: "PLAF", type: "NUMBER(19,4)", description: "Plafond d'engagement global autorisé pour le groupe." },
    ],
    sampleQuery: "SELECT GRP, LIB, TETE, PLAF FROM BKGRP WHERE GRP = 'GRP-HOLD';",
    criticalNotes: "Surveillé pour le respect du ratio réglementaire de division des risques (grands risques)."
  },

  // 2. COMPTES & SOLDES
  {
    tableName: "BKCVD",
    module: "Comptes & Soldes",
    description: "Positions de change et soldes en contre-valeur devise de référence.",
    primaryKey: ["AGE", "NCP", "DEV"],
    foreignKeys: [{ column: "NCP", references: "BKCPT.NCP" }, { column: "DEV", references: "BKDEV.DEV" }],
    columns: [
      { name: "AGE", type: "VARCHAR2(5)", description: "Agence gestionnaire." },
      { name: "NCP", type: "VARCHAR2(11)", description: "Numéro de compte." },
      { name: "DEV", type: "VARCHAR2(3)", description: "Devise étrangère du compte." },
      { name: "SOLDEV", type: "NUMBER(19,4)", description: "Solde en devise d'origine." },
      { name: "SOLCV", type: "NUMBER(19,4)", description: "Solde réévalué en devise locale de référence." },
      { name: "COU", type: "NUMBER(15,7)", description: "Dernier cours de valorisation appliqué." },
    ],
    sampleQuery: "SELECT AGE, NCP, DEV, SOLDEV, SOLCV FROM BKCVD WHERE DEV != 'XOF';",
    criticalNotes: "Revalorisé chaque nuit lors de l'étape B_GL_REVAL de la chaîne EOD."
  },
  {
    tableName: "BKAPO",
    module: "Comptes & Soldes",
    description: "Oppositions, saisies-attributions, ATD et blocages judiciaires sur comptes.",
    primaryKey: ["AGE", "NCP", "NOPO"],
    foreignKeys: [{ column: "NCP", references: "BKCPT.NCP" }],
    columns: [
      { name: "AGE", type: "VARCHAR2(5)", description: "Agence du compte." },
      { name: "NCP", type: "VARCHAR2(11)", description: "Compte frappé d'opposition." },
      { name: "NOPO", type: "NUMBER(5)", description: "Numéro d'ordre de l'opposition." },
      { name: "MOT", type: "VARCHAR2(3)", description: "Code motif : ATD=Avis à Tiers Détenteur, BLQ=Blocage provision." },
      { name: "MNT", type: "NUMBER(19,4)", description: "Montant indisponible cantonné." },
      { name: "DOPO", type: "DATE", description: "Date d'enregistrement de l'opposition." },
      { name: "ETA", type: "VARCHAR2(1)", description: "État : A=Active, L=Levée / Mainlevée." },
    ],
    sampleQuery: "SELECT AGE, NCP, MOT, MNT, ETA FROM BKAPO WHERE ETA = 'A';",
    criticalNotes: "Impacte directement le champ SIND de BKCPT et provoque des rejets d'autorisations cartes."
  },
  {
    tableName: "BKHCPT",
    module: "Comptes & Soldes",
    description: "Historique journalier des soldes de clôture de tous les comptes clients.",
    primaryKey: ["AGE", "NCP", "DCO"],
    foreignKeys: [{ column: "NCP", references: "BKCPT.NCP" }],
    columns: [
      { name: "AGE", type: "VARCHAR2(5)", description: "Agence gestionnaire." },
      { name: "NCP", type: "VARCHAR2(11)", description: "Numéro de compte." },
      { name: "DCO", type: "DATE", description: "Date comptable de clôture." },
      { name: "SOL", type: "NUMBER(19,4)", description: "Solde comptable arrêté en fin de journée." },
      { name: "SIND", type: "NUMBER(19,4)", description: "Montant des indisponibilités à la date DCO." },
    ],
    sampleQuery: "SELECT NCP, DCO, SOL FROM BKHCPT WHERE NCP = '01001234567' ORDER BY DCO DESC;",
    criticalNotes: "Alimenté par l'étape EOD B_CPT_SOLDE_HISTO. Base de calcul des échelles d'intérêts."
  },
  {
    tableName: "BKAUT",
    module: "Comptes & Soldes",
    description: "Autorisations de découvert, facilités de caisse et lignes de crédit spot.",
    primaryKey: ["AGE", "NCP", "NAUT"],
    foreignKeys: [{ column: "NCP", references: "BKCPT.NCP" }],
    columns: [
      { name: "AGE", type: "VARCHAR2(5)", description: "Agence du compte." },
      { name: "NCP", type: "VARCHAR2(11)", description: "Numéro de compte bénéficiaire." },
      { name: "NAUT", type: "NUMBER(4)", description: "Numéro de l'autorisation." },
      { name: "MNT", type: "NUMBER(19,4)", description: "Plafond maximum de découvert autorisé." },
      { name: "DEB", type: "DATE", description: "Date de mise en place de la facilité." },
      { name: "FIN", type: "DATE", description: "Date d'échéance / fin de validité." },
      { name: "TAUX", type: "NUMBER(7,4)", description: "Taux débiteur contractuel négocié." },
    ],
    sampleQuery: "SELECT AGE, NCP, MNT, DEB, FIN, TAUX FROM BKAUT WHERE FIN >= TRUNC(SYSDATE);",
    criticalNotes: "Tout dépassement au-delà de MNT déclenche le taux de découvert non autorisé (fort agio)."
  },
  {
    tableName: "BKINT",
    module: "Comptes & Soldes",
    description: "Barèmes des taux d'intérêts créditeurs, débiteurs et commissions de compte.",
    primaryKey: ["CDE"],
    foreignKeys: [],
    columns: [
      { name: "CDE", type: "VARCHAR2(4)", description: "Code barème d'intérêt." },
      { name: "LIB", type: "VARCHAR2(35)", description: "Libellé de la condition de taux." },
      { name: "TCR", type: "NUMBER(7,4)", description: "Taux créditeur de base." },
      { name: "TDB", type: "NUMBER(7,4)", description: "Taux débiteur standard." },
      { name: "TMAJ", type: "NUMBER(7,4)", description: "Majoration pour découvert non autorisé." },
    ],
    sampleQuery: "SELECT CDE, LIB, TCR, TDB, TMAJ FROM BKINT;",
    criticalNotes: "Paramètre maître utilisé par l'étape EOD B_CPT_ARRETE."
  },

  // 3. DÉPÔTS À TERME & BONS DE CAISSE (DAT)
  {
    tableName: "BKDAT",
    module: "Dépôts à Terme (DAT)",
    description: "Contrats de dépôts à terme, comptes bloqués et bons de caisse souscrits.",
    primaryKey: ["NDAT"],
    foreignKeys: [{ column: "CLI", references: "BKCLI.CLI" }, { column: "NCP", references: "BKCPT.NCP" }],
    columns: [
      { name: "NDAT", type: "VARCHAR2(15)", description: "Numéro de contrat DAT." },
      { name: "CLI", type: "VARCHAR2(15)", description: "Client souscripteur." },
      { name: "NCP", type: "VARCHAR2(11)", description: "Compte courant source/remboursement." },
      { name: "MNT", type: "NUMBER(19,4)", description: "Montant du capital placé." },
      { name: "TAUX", type: "NUMBER(7,4)", description: "Taux d'intérêt annuel conventionnel." },
      { name: "DSOU", type: "DATE", description: "Date de souscription / versement initial." },
      { name: "DECH", type: "DATE", description: "Date d'échéance finale." },
      { name: "PROR", type: "VARCHAR2(1)", description: "Prorogation automatique à échéance (O/N)." },
    ],
    sampleQuery: "SELECT NDAT, CLI, MNT, TAUX, DSOU, DECH FROM BKDAT WHERE DECH >= TRUNC(SYSDATE);",
    criticalNotes: "Une erreur de date future ou de taux nul dans BKDAT cause des erreurs SIGSEGV en EOD."
  },
  {
    tableName: "BKTIC",
    module: "Dépôts à Terme (DAT)",
    description: "Cumul des Intérêts Courus Non Échus (ICNE) calculés au prorata sur les DAT.",
    primaryKey: ["NDAT", "DCO"],
    foreignKeys: [{ column: "NDAT", references: "BKDAT.NDAT" }],
    columns: [
      { name: "NDAT", type: "VARCHAR2(15)", description: "Numéro de contrat DAT." },
      { name: "DCO", type: "DATE", description: "Date de calcul comptable." },
      { name: "ICNE", type: "NUMBER(19,4)", description: "Montant cumulé des intérêts courus non payés." },
      { name: "NBJ", type: "NUMBER(4)", description: "Nombre de jours d'intérêts échus depuis l'origine." },
    ],
    sampleQuery: "SELECT NDAT, DCO, ICNE FROM BKTIC WHERE DCO = TRUNC(SYSDATE);",
    criticalNotes: "Génère les écritures comptables d'ajustement du compte de résultat dans BKCOM."
  },
  {
    tableName: "BKMDAT",
    module: "Dépôts à Terme (DAT)",
    description: "Mouvements, avenants et pénalités de rupture anticipée sur dépôts à terme.",
    primaryKey: ["NDAT", "NMOU"],
    foreignKeys: [{ column: "NDAT", references: "BKDAT.NDAT" }],
    columns: [
      { name: "NDAT", type: "VARCHAR2(15)", description: "Numéro de contrat DAT." },
      { name: "NMOU", type: "NUMBER(4)", description: "Numéro de séquence mouvement." },
      { name: "TYP", type: "VARCHAR2(3)", description: "Type : RUP=Rupture anticipée, REM=Remboursement partiel." },
      { name: "MNT", type: "NUMBER(19,4)", description: "Montant du principal remboursé." },
      { name: "PENAL", type: "NUMBER(19,4)", description: "Montant de la pénalité retenue pour rupture." },
    ],
    sampleQuery: "SELECT NDAT, TYP, MNT, PENAL FROM BKMDAT WHERE TYP = 'RUP';",
    criticalNotes: "Vérifie les calculs de rétrocession d'intérêts trop-perçus par le client."
  },
  {
    tableName: "BKECH_DAT",
    module: "Dépôts à Terme (DAT)",
    description: "Échéancier prévisionnel de paiement des coupons d'intérêts sur placements.",
    primaryKey: ["NDAT", "NECH"],
    foreignKeys: [{ column: "NDAT", references: "BKDAT.NDAT" }],
    columns: [
      { name: "NDAT", type: "VARCHAR2(15)", description: "Contrat DAT." },
      { name: "NECH", type: "NUMBER(3)", description: "Numéro d'échéance." },
      { name: "DECH", type: "DATE", description: "Date d'échéance du versement coupon." },
      { name: "MNTINT", type: "NUMBER(19,4)", description: "Montant des intérêts nets dus." },
      { name: "PAYE", type: "VARCHAR2(1)", description: "Statut paiement : O=Versé, N=En attente." },
    ],
    sampleQuery: "SELECT NDAT, DECH, MNTINT, PAYE FROM BKECH_DAT WHERE PAYE = 'N';",
    criticalNotes: "Traitée par le batch de nuit B_DAT_ECHEANCE pour créditer le compte courant."
  },

  // 4. CRÉDITS & PRÊTS
  {
    tableName: "BKDOS",
    module: "Crédits & Prêts",
    description: "Dossiers de crédit, caractéristiques du prêt, montants débloqués et durées.",
    primaryKey: ["NDOS"],
    foreignKeys: [{ column: "CLI", references: "BKCLI.CLI" }, { column: "NCP", references: "BKCPT.NCP" }],
    columns: [
      { name: "NDOS", type: "VARCHAR2(15)", description: "Numéro unique de dossier de prêt." },
      { name: "CLI", type: "VARCHAR2(15)", description: "Client emprunteur." },
      { name: "NCP", type: "VARCHAR2(11)", description: "Compte support de prélèvement." },
      { name: "MNT", type: "NUMBER(19,4)", description: "Montant accordé du crédit." },
      { name: "DUR", type: "NUMBER(4)", description: "Durée en mois du prêt." },
      { name: "TAUX", type: "NUMBER(7,4)", description: "Taux nominal annuel du prêt." },
      { name: "TYP", type: "VARCHAR2(3)", description: "Type : IMM=Immobilier, CON=Consommation, INV=Investissement pro." },
      { name: "ETA", type: "VARCHAR2(1)", description: "État : A=En cours, S=Soldé, C=Contentieux, D=Déchu." },
    ],
    sampleQuery: "SELECT NDOS, CLI, MNT, TAUX, DUR, ETA FROM BKDOS WHERE ETA = 'A';",
    criticalNotes: "Clé maîtresse pour le calcul des échéances et des provisions IFRS9."
  },
  {
    tableName: "BKECH",
    module: "Crédits & Prêts",
    description: "Tableau d'amortissement détaillé, capital restant dû et échéances unitaires.",
    primaryKey: ["NDOS", "NECH"],
    foreignKeys: [{ column: "NDOS", references: "BKDOS.NDOS" }],
    columns: [
      { name: "NDOS", type: "VARCHAR2(15)", description: "Numéro de dossier." },
      { name: "NECH", type: "NUMBER(4)", description: "Numéro de mensualité." },
      { name: "DECH", type: "DATE", description: "Date d'exigibilité de l'échéance." },
      { name: "CAP", type: "NUMBER(19,4)", description: "Part d'amortissement en capital." },
      { name: "INT", type: "NUMBER(19,4)", description: "Part d'intérêts." },
      { name: "ASS", type: "NUMBER(19,4)", description: "Prime d'assurance crédit associée." },
      { name: "REST", type: "NUMBER(19,4)", description: "Capital restant dû après règlement." },
      { name: "ETA", type: "VARCHAR2(1)", description: "Statut : P=Payée, I=Impayée, N=Non échue." },
    ],
    sampleQuery: "SELECT NDOS, NECH, DECH, (CAP + INT + ASS) AS TOTAL, ETA FROM BKECH WHERE DECH <= TRUNC(SYSDATE) AND ETA = 'I';",
    criticalNotes: "Appelée quotidiennement par B_CRE_ECH pour générer les écritures de prélèvement."
  },
  {
    tableName: "BKPAL",
    module: "Crédits & Prêts",
    description: "Paliers d'amortissement, différés d'amortissement et taux variables.",
    primaryKey: ["NDOS", "NPAL"],
    foreignKeys: [{ column: "NDOS", references: "BKDOS.NDOS" }],
    columns: [
      { name: "NDOS", type: "VARCHAR2(15)", description: "Dossier de crédit." },
      { name: "NPAL", type: "NUMBER(2)", description: "Numéro du palier." },
      { name: "DUR", type: "NUMBER(3)", description: "Durée du palier en mois." },
      { name: "DIF", type: "VARCHAR2(1)", description: "Différé : T=Total (franchise), P=Partiel (intérêts seuls), N=Aucun." },
      { name: "ECH", type: "NUMBER(19,4)", description: "Montant constant de l'échéance pendant ce palier." },
    ],
    sampleQuery: "SELECT NDOS, NPAL, DUR, DIF, ECH FROM BKPAL WHERE NDOS = 'DOS-2026-001';",
    criticalNotes: "Gère les périodes de grâce accordées aux entreprises et crédits promoteurs."
  },
  {
    tableName: "BKIMP",
    module: "Crédits & Prêts",
    description: "Suivi des impayés, ancienneté de la dette et pénalités de retard.",
    primaryKey: ["NDOS", "NECH", "NIMP"],
    foreignKeys: [{ column: "NDOS", references: "BKDOS.NDOS" }],
    columns: [
      { name: "NDOS", type: "VARCHAR2(15)", description: "Dossier de crédit." },
      { name: "NECH", type: "NUMBER(4)", description: "Échéance impayée." },
      { name: "NIMP", type: "NUMBER(3)", description: "Numéro d'impayé." },
      { name: "DIMP", type: "DATE", description: "Date du premier constat d'impayé." },
      { name: "MNT", type: "NUMBER(19,4)", description: "Montant en souffrance." },
      { name: "PENAL", type: "NUMBER(19,4)", description: "Intérêts de retard / pénalités imputés." },
    ],
    sampleQuery: "SELECT NDOS, DIMP, MNT, PENAL FROM BKIMP ORDER BY DIMP ASC;",
    criticalNotes: "Alimente le calcul des jours de retard pour le déclassement réglementaire."
  },
  {
    tableName: "BKPROV",
    module: "Crédits & Prêts",
    description: "Provisions pour dépréciation d'actifs sains et douteux (IFRS 9 Stage 1, 2, 3).",
    primaryKey: ["NDOS", "DCO"],
    foreignKeys: [{ column: "NDOS", references: "BKDOS.NDOS" }],
    columns: [
      { name: "NDOS", type: "VARCHAR2(15)", description: "Dossier de prêt." },
      { name: "DCO", type: "DATE", description: "Date de calcul de provision." },
      { name: "STAGE", type: "NUMBER(1)", description: "Classement IFRS 9 : 1=Sain, 2=Dégradé, 3=Défaut." },
      { name: "PD", type: "NUMBER(7,4)", description: "Probabilité de Défaut estimée." },
      { name: "LGD", type: "NUMBER(7,4)", description: "Perte en cas de défaut (Loss Given Default)." },
      { name: "ECL", type: "NUMBER(19,4)", description: "Montant de la provision attendue (Expected Credit Loss)." },
    ],
    sampleQuery: "SELECT NDOS, STAGE, ECL FROM BKPROV WHERE DCO = TRUNC(SYSDATE);",
    criticalNotes: "Impacte directement le bilan bancaire et les fonds propres prudentiels."
  },

  // 5. COMPTABILITÉ GÉNÉRALE & BALANCE (GL)
  {
    tableName: "BKEVE",
    module: "Comptabilité & Balance",
    description: "Événements et pièces comptables élémentaires en attente de validation GL.",
    primaryKey: ["AGE", "DCO", "EVE"],
    foreignKeys: [],
    columns: [
      { name: "AGE", type: "VARCHAR2(5)", description: "Agence émettrice." },
      { name: "DCO", type: "DATE", description: "Date comptable." },
      { name: "EVE", type: "VARCHAR2(10)", description: "Numéro d'événement comptable." },
      { name: "OPE", type: "VARCHAR2(3)", description: "Code opération." },
      { name: "MNT", type: "NUMBER(19,4)", description: "Montant global de la pièce." },
      { name: "ETA", type: "VARCHAR2(1)", description: "État : A=Attente, V=Validé, R=Rejeté." },
      { name: "UTI", type: "VARCHAR2(10)", description: "Opérateur de saisie." },
    ],
    sampleQuery: "SELECT AGE, DCO, EVE, MNT, ETA FROM BKEVE WHERE ETA = 'A';",
    criticalNotes: "Toutes les lignes de BKEVE doivent être validées avant le démarrage de l'EOD."
  },
  {
    tableName: "BKHIS",
    module: "Comptabilité & Balance",
    description: "Grand Livre historique archivé des écritures des exercices clos.",
    primaryKey: ["AGE", "EXO", "NCP", "NUMLIG"],
    foreignKeys: [],
    columns: [
      { name: "AGE", type: "VARCHAR2(5)", description: "Agence comptable." },
      { name: "EXO", type: "NUMBER(4)", description: "Exercice fiscal (ex: 2024, 2025)." },
      { name: "NCP", type: "VARCHAR2(11)", description: "Compte Grand Livre." },
      { name: "NUMLIG", type: "NUMBER(10)", description: "Numéro de ligne séquentielle." },
      { name: "MON", type: "NUMBER(19,4)", description: "Montant de l'écriture." },
      { name: "SEN", type: "VARCHAR2(1)", description: "Sens : D=Débit, C=Crédit." },
    ],
    sampleQuery: "SELECT EXO, NCP, COUNT(*) FROM BKHIS GROUP BY EXO, NCP;",
    criticalNotes: "Table volumineuse en lecture seule utilisée pour les contrôles fiscaux et commissaires aux comptes."
  },
  {
    tableName: "BKJOU",
    module: "Comptabilité & Balance",
    description: "Journaux comptables auxiliaires (Caisse, Virements, Portefeuille, Monétique, OD).",
    primaryKey: ["JOU"],
    foreignKeys: [],
    columns: [
      { name: "JOU", type: "VARCHAR2(3)", description: "Code journal auxiliaire (ex: CSH, MNT, VIR, OD)." },
      { name: "LIB", type: "VARCHAR2(35)", description: "Intitulé du journal." },
      { name: "TYP", type: "VARCHAR2(2)", description: "Type de journal : TR=Trésorerie, OP=Opérations diverses." },
      { name: "ETA", type: "VARCHAR2(1)", description: "Statut : O=Ouvert, C=Clôturé pour la journée." },
    ],
    sampleQuery: "SELECT JOU, LIB, ETA FROM BKJOU;",
    criticalNotes: "L'étape EOD B_GL_CENTRALISATION vérifie que chaque journal auxiliaire est soldé."
  },
  {
    tableName: "BKBAL",
    module: "Comptabilité & Balance",
    description: "Balances périodiques consolidées par chapitre et par devise.",
    primaryKey: ["PER", "DEV", "CHA"],
    foreignKeys: [{ column: "DEV", references: "BKDEV.DEV" }],
    columns: [
      { name: "PER", type: "VARCHAR2(6)", description: "Période comptable au format YYYYMM." },
      { name: "DEV", type: "VARCHAR2(3)", description: "Devise." },
      { name: "CHA", type: "VARCHAR2(4)", description: "Chapitre comptable (Classe 1 à 7)." },
      { name: "MDB", type: "NUMBER(19,4)", description: "Cumul mouvements Débit de la période." },
      { name: "MCR", type: "NUMBER(19,4)", description: "Cumul mouvements Crédit de la période." },
    ],
    sampleQuery: "SELECT PER, DEV, CHA, MDB, MCR FROM BKBAL WHERE PER = '202609';",
    criticalNotes: "Sert de base à l'établissement des états financiers mensuels."
  },
  {
    tableName: "BKCHA",
    module: "Comptabilité & Balance",
    description: "Plan de comptes bancaire général, nomenclature et règles de déversement.",
    primaryKey: ["CHA"],
    foreignKeys: [],
    columns: [
      { name: "CHA", type: "VARCHAR2(4)", description: "Code chapitre comptable (ex: 2011, 3711, 5210)." },
      { name: "LIB", type: "VARCHAR2(45)", description: "Libellé du chapitre comptable." },
      { name: "CLA", type: "VARCHAR2(1)", description: "Classe réglementaire (1 à 9)." },
      { name: "TYP", type: "VARCHAR2(1)", description: "Nature : B=Bilan, R=Résultat, H=Hors-Bilan." },
      { name: "SEN", type: "VARCHAR2(1)", description: "Sens habituel : D=Débiteur, C=Créditeur." },
    ],
    sampleQuery: "SELECT CHA, LIB, CLA, TYP FROM BKCHA WHERE CHA LIKE '37%';",
    criticalNotes: "Nomenclature centrale partagée entre la comptabilité et les passerelles monétiques."
  },

  // 6. VIREMENTS & MOYENS DE PAIEMENT
  {
    tableName: "BKVIR",
    module: "Virements & Paiements",
    description: "Ordres de virement émis et reçus, références interbancaires et status de dénouement.",
    primaryKey: ["REFVIR"],
    foreignKeys: [{ column: "NCP_DON", references: "BKCPT.NCP" }],
    columns: [
      { name: "REFVIR", type: "VARCHAR2(20)", description: "Identifiant unique de l'ordre de virement." },
      { name: "NCP_DON", type: "VARCHAR2(11)", description: "Compte du donneur d'ordre." },
      { name: "IBAN_BEN", type: "VARCHAR2(34)", description: "IBAN du bénéficiaire." },
      { name: "BIC_BEN", type: "VARCHAR2(11)", description: "Code BIC/SWIFT de la banque bénéficiaire." },
      { name: "MNT", type: "NUMBER(19,4)", description: "Montant du virement." },
      { name: "DEV", type: "VARCHAR2(3)", description: "Devise du virement." },
      { name: "STAT", type: "VARCHAR2(4)", description: "Statut : EMIS, EXEC, REJT, SUSP." },
      { name: "DMVT", type: "DATE", description: "Date et heure de saisie du virement." },
    ],
    sampleQuery: "SELECT REFVIR, NCP_DON, MNT, STAT FROM BKVIR WHERE STAT = 'REJT';",
    criticalNotes: "Surveillé en astreinte pour identifier les échecs de masse des salaires."
  },
  {
    tableName: "BKSWF",
    module: "Virements & Paiements",
    description: "Messages SWIFT FIN (MT103, MT202, MT940, MT700) et formats MX (ISO 20022 pacs/camt).",
    primaryKey: ["IDSWF"],
    foreignKeys: [],
    columns: [
      { name: "IDSWF", type: "VARCHAR2(25)", description: "Référence interne du message SWIFT." },
      { name: "DIR", type: "VARCHAR2(1)", description: "Direction : I=Entrant (Inward), O=Sortant (Outward)." },
      { name: "MT", type: "VARCHAR2(10)", description: "Type de message : MT103, MT202, pacs.008." },
      { name: "SENDER", type: "VARCHAR2(11)", description: "Code BIC émetteur." },
      { name: "RECEIVER", type: "VARCHAR2(11)", description: "Code BIC destinataire." },
      { name: "ACK", type: "VARCHAR2(3)", description: "Statut réseau SWIFT : ACK=Accepté, NAK=Rejeté." },
      { name: "CORPS", type: "CLOB", description: "Charge utile complète du message SWIFT.", sensitive: true },
    ],
    sampleQuery: "SELECT IDSWF, DIR, MT, SENDER, ACK FROM BKSWF WHERE ACK = 'NAK';",
    criticalNotes: "Tout NAK SWIFT doit être traité immédiatement pour éviter des blocages de trésorerie internationale."
  },
  {
    tableName: "BKLOT",
    module: "Virements & Paiements",
    description: "Lots de télécompensation et fichiers de masse (salaires, prélèvements, compensation ACH).",
    primaryKey: ["NLOT"],
    foreignKeys: [],
    columns: [
      { name: "NLOT", type: "VARCHAR2(15)", description: "Numéro de lot d'intégration." },
      { name: "TYP", type: "VARCHAR2(4)", description: "Type de flux : SAL=Salaires, PREL=Prélèvements, ACH=Compensation." },
      { name: "NBR", type: "NUMBER(6)", description: "Nombre de transactions incluses dans le lot." },
      { name: "TOT", type: "NUMBER(19,4)", description: "Montant total cumulé du lot." },
      { name: "ETA", type: "VARCHAR2(1)", description: "État : C=Créé, V=Validé, I=Imputé, E=Erreur." },
    ],
    sampleQuery: "SELECT NLOT, TYP, NBR, TOT, ETA FROM BKLOT WHERE ETA = 'E';",
    criticalNotes: "Vérifie les doublons de lots avant injection comptable en base."
  },
  {
    tableName: "BKREJ",
    module: "Virements & Paiements",
    description: "Rejets interbancaires, motifs d'échec de compensation et suspens d'émissions.",
    primaryKey: ["NREJ"],
    foreignKeys: [{ column: "REFVIR", references: "BKVIR.REFVIR" }],
    columns: [
      { name: "NREJ", type: "VARCHAR2(15)", description: "Identifiant du rejet." },
      { name: "REFVIR", type: "VARCHAR2(20)", description: "Référence du virement rejeté." },
      { name: "CODE", type: "VARCHAR2(4)", description: "Code motif normalisé (ex: AC01=IBAN invalide, AM04=Provision insuffisante)." },
      { name: "LIB", type: "VARCHAR2(60)", description: "Description claire de l'anomalie." },
      { name: "DREJ", type: "DATE", description: "Date de notification du rejet." },
    ],
    sampleQuery: "SELECT NREJ, REFVIR, CODE, LIB FROM BKREJ WHERE CODE = 'AM04';",
    criticalNotes: "Donne lieu à la restitution des fonds débités sur le compte du donneur d'ordre."
  },
  {
    tableName: "BKRTGS",
    module: "Virements & Paiements",
    description: "Transactions de gros montants en règlement brut en temps réel (RTGS Banque Centrale).",
    primaryKey: ["IDRTGS"],
    foreignKeys: [],
    columns: [
      { name: "IDRTGS", type: "VARCHAR2(20)", description: "Numéro d'ordre RTGS." },
      { name: "MNT", type: "NUMBER(19,4)", description: "Montant élevé en monnaie centrale." },
      { name: "BQC", type: "VARCHAR2(5)", description: "Code banque contrepartie." },
      { name: "STAT", type: "VARCHAR2(3)", description: "Statut : SET=Réglement irrévocable, PEN=En attente de liquidité." },
    ],
    sampleQuery: "SELECT IDRTGS, MNT, BQC, STAT FROM BKRTGS WHERE STAT = 'PEN';",
    criticalNotes: "Les suspens RTGS en fin de journée bloquent la clôture de trésorerie avec la Banque Centrale."
  },

  // 7. ENGAGEMENTS & GARANTIES
  {
    tableName: "BKGAR",
    module: "Engagements & Garanties",
    description: "Garanties réelles, hypothèques, nantissements et cautions enregistrées.",
    primaryKey: ["NGAR"],
    foreignKeys: [{ column: "CLI", references: "BKCLI.CLI" }],
    columns: [
      { name: "NGAR", type: "VARCHAR2(15)", description: "Numéro d'enregistrement de la garantie." },
      { name: "CLI", type: "VARCHAR2(15)", description: "Client cautionné." },
      { name: "TYP", type: "VARCHAR2(3)", description: "Type : HYP=Hypothèque, NAN=Nantissement, CAU=Caution personnelle." },
      { name: "VALEST", type: "NUMBER(19,4)", description: "Valeur estimée du bien en garantie." },
      { name: "VALRET", type: "NUMBER(19,4)", description: "Valeur retenue après décote prudentielle." },
      { name: "DEXP", type: "DATE", description: "Date de péremption de la garantie." },
    ],
    sampleQuery: "SELECT NGAR, CLI, TYP, VALRET, DEXP FROM BKGAR WHERE DEXP <= TRUNC(SYSDATE) + 30;",
    criticalNotes: "Si la garantie expire, le crédit associé passe en statut non couvert (surcoût provisionnel)."
  },
  {
    tableName: "BKCREDOC",
    module: "Engagements & Garanties",
    description: "Crédits documentaires import/export et lettres de crédit commerciales.",
    primaryKey: ["NCREDOC"],
    foreignKeys: [{ column: "CLI", references: "BKCLI.CLI" }],
    columns: [
      { name: "NCREDOC", type: "VARCHAR2(15)", description: "Numéro de Crédoc." },
      { name: "CLI", type: "VARCHAR2(15)", description: "Client donneur d'ordre." },
      { name: "FOURN", type: "VARCHAR2(60)", description: "Nom du fournisseur bénéficiaire étranger." },
      { name: "MNT", type: "NUMBER(19,4)", description: "Montant engagé en devise." },
      { name: "DEV", type: "VARCHAR2(3)", description: "Devise du contrat." },
      { name: "DECH", type: "DATE", description: "Date de validité des documents." },
    ],
    sampleQuery: "SELECT NCREDOC, CLI, FOURN, MNT, DEV FROM BKCREDOC;",
    criticalNotes: "Gère les engagements hors-bilan et les provisions pour risque pays."
  },
  {
    tableName: "BKCAUTION",
    module: "Engagements & Garanties",
    description: "Cautions sur marchés publics (soumission, bonne fin, retenue de garantie).",
    primaryKey: ["NCAU"],
    foreignKeys: [{ column: "CLI", references: "BKCLI.CLI" }],
    columns: [
      { name: "NCAU", type: "VARCHAR2(15)", description: "Numéro de caution bancaire." },
      { name: "CLI", type: "VARCHAR2(15)", description: "Entreprise titulaire du marché." },
      { name: "BENEF", type: "VARCHAR2(60)", description: "Maître d'ouvrage bénéficiaire (Ministère, Collectivité)." },
      { name: "MNT", type: "NUMBER(19,4)", description: "Montant de la garantie bancaire émise." },
      { name: "ECH", type: "DATE", description: "Date limite de mise en jeu." },
    ],
    sampleQuery: "SELECT NCAU, CLI, BENEF, MNT, ECH FROM BKCAUTION WHERE ECH >= TRUNC(SYSDATE);",
    criticalNotes: "Génère des commissions trimestrielles facturées automatiquement lors de B_GAR_COM."
  },

  // 8. REPORTING RÉGLEMENTAIRE & PRUDENTIEL
  {
    tableName: "BKRATIO",
    module: "Reporting Réglementaire",
    description: "Ratios prudentiels calculés (Solvabilité Cooke/McDonough, Liquidité LCR, Grands Risques).",
    primaryKey: ["PER", "CODE_RATIO"],
    foreignKeys: [],
    columns: [
      { name: "PER", type: "VARCHAR2(6)", description: "Période de calcul YYYYMM." },
      { name: "CODE_RATIO", type: "VARCHAR2(10)", description: "Code réglementaire du ratio (ex: RATIO_SOLV, RATIO_LCR)." },
      { name: "VAL", type: "NUMBER(7,4)", description: "Valeur calculée constatée." },
      { name: "MIN_REG", type: "NUMBER(7,4)", description: "Seuil réglementaire minimal obligatoire." },
      { name: "STAT", type: "VARCHAR2(2)", description: "Conformité : OK, KO, AL (Alerte zone de buffer)." },
    ],
    sampleQuery: "SELECT CODE_RATIO, VAL, MIN_REG, STAT FROM BKRATIO WHERE PER = '202609';",
    criticalNotes: "Indicateur critique inspecté par la Commission Bancaire lors des contrôles sur place."
  },
  {
    tableName: "BKRWA",
    module: "Reporting Réglementaire",
    description: "Actifs pondérés par le risque de crédit, de marché et opérationnel (RWA).",
    primaryKey: ["PER", "PORTFEUILLE"],
    foreignKeys: [],
    columns: [
      { name: "PER", type: "VARCHAR2(6)", description: "Mois d'arrêté réglementaire." },
      { name: "PORTFEUILLE", type: "VARCHAR2(10)", description: "Segment : SOUV=Souverain, CORP=Entreprises, RET=Détail." },
      { name: "ENCOURS", type: "NUMBER(19,4)", description: "Encours brut total." },
      { name: "RWA", type: "NUMBER(19,4)", description: "Encours pondéré par la quotité de risque." },
    ],
    sampleQuery: "SELECT PORTFEUILLE, ENCOURS, RWA FROM BKRWA WHERE PER = '202609';",
    criticalNotes: "Sert de dénominateur au ratio de fonds propres de base (Tier 1)."
  },

  // 9. SÉCURITÉ, UTILISATEURS & AUDIT LOGS
  {
    tableName: "BKUTI",
    module: "Sécurité & Accès",
    description: "Comptes utilisateurs, profils habilités, caissiers et gestionnaires de comptes.",
    primaryKey: ["UTI"],
    foreignKeys: [{ column: "AGE", references: "BKAGE.AGE" }],
    columns: [
      { name: "UTI", type: "VARCHAR2(10)", description: "Identifiant de connexion utilisateur." },
      { name: "NOM", type: "VARCHAR2(40)", description: "Nom et prénom du collaborateur." },
      { name: "PRO", type: "VARCHAR2(6)", description: "Code profil d'habilitation fonctionnelle." },
      { name: "AGE", type: "VARCHAR2(5)", description: "Agence d'affectation de l'agent." },
      { name: "ETA", type: "VARCHAR2(1)", description: "État du compte : A=Actif, B=Bloqué suite à mot de passe erroné." },
    ],
    sampleQuery: "SELECT UTI, NOM, PRO, AGE, ETA FROM BKUTI WHERE ETA = 'A';",
    criticalNotes: "Tout blocage intempestif de BKUTI empêche l'ouverture des caisses le matin à BOD."
  },
  {
    tableName: "BKAUD",
    module: "Sécurité & Accès",
    description: "Journal des pistes d'audit, connexions, modifications sensibles et forçages.",
    primaryKey: ["IDLOG"],
    foreignKeys: [],
    columns: [
      { name: "IDLOG", type: "NUMBER(12)", description: "Numéro de séquence d'audit." },
      { name: "UTI", type: "VARCHAR2(10)", description: "Opérateur ayant effectué l'action." },
      { name: "DLOG", type: "DATE", description: "Horodatage précis de l'action." },
      { name: "ACT", type: "VARCHAR2(10)", description: "Action : LOGIN, UPDATE, FORCAGE, EXT_BAL." },
      { name: "TABLE_NAME", type: "VARCHAR2(30)", description: "Table impactée par la modification." },
      { name: "DETAIL", type: "VARCHAR2(255)", description: "Ancienne valeur et nouvelle valeur modifiée." },
    ],
    sampleQuery: "SELECT UTI, DLOG, ACT, TABLE_NAME FROM BKAUD WHERE ACT = 'FORCAGE' ORDER BY DLOG DESC;",
    criticalNotes: "Table obligatoire et inaltérable pour les exigences de contrôle interne bancaire."
  },
  {
    tableName: "BKPRO",
    module: "Sécurité & Accès",
    description: "Profils d'accès fonctionnels, plafonds de délégation et seuils d'autorisation.",
    primaryKey: ["PRO"],
    foreignKeys: [],
    columns: [
      { name: "PRO", type: "VARCHAR2(6)", description: "Code profil (ex: CAISSE, CHEF_A, DIR_AG, RISQ)." },
      { name: "LIB", type: "VARCHAR2(35)", description: "Intitulé du profil." },
      { name: "PLAF_DEB", type: "NUMBER(19,4)", description: "Plafond maximum de débit unitaire sans visa supérieur." },
      { name: "PLAF_CRE", type: "NUMBER(19,4)", description: "Plafond maximum de crédit ou remise de fonds." },
    ],
    sampleQuery: "SELECT PRO, LIB, PLAF_DEB FROM BKPRO;",
    criticalNotes: "Contrôle les règles du principe des quatre yeux (double signature obligatoire)."
  },

  // 10. PARAMÉTRAGE RÉSEAU & AGENCES
  {
    tableName: "BKAGE",
    module: "Paramétrage Agences",
    description: "Réseau des agences, centres d'affaires, guichets et découpages régionaux.",
    primaryKey: ["AGE"],
    foreignKeys: [],
    columns: [
      { name: "AGE", type: "VARCHAR2(5)", description: "Code guichet/agence à 5 chiffres (ex: 01001)." },
      { name: "LIB", type: "VARCHAR2(35)", description: "Nom ou localisation de l'agence." },
      { name: "REG", type: "VARCHAR2(3)", description: "Région commerciale." },
      { name: "ETA", type: "VARCHAR2(1)", description: "Statut : O=Ouverte au public, F=Fermée." },
      { name: "ADR", type: "VARCHAR2(60)", description: "Adresse physique de l'agence." },
    ],
    sampleQuery: "SELECT AGE, LIB, REG, ETA FROM BKAGE WHERE ETA = 'O';",
    criticalNotes: "Définit la maille de consolidation des balances d'agences lors de la chaîne EOD."
  },
  {
    tableName: "BKFOU",
    module: "Paramétrage Agences",
    description: "Fournisseurs, partenaires et prestataires de services de la banque.",
    primaryKey: ["FOU"],
    foreignKeys: [],
    columns: [
      { name: "FOU", type: "VARCHAR2(10)", description: "Code fournisseur." },
      { name: "NOM", type: "VARCHAR2(45)", description: "Raison sociale du prestataire." },
      { name: "NCP_PAIE", type: "VARCHAR2(11)", description: "Compte de règlement bancaire." },
    ],
    sampleQuery: "SELECT FOU, NOM, NCP_PAIE FROM BKFOU;",
    criticalNotes: "Utilisée pour les facturations internes et règlements de frais généraux."
  },

  // 11. MONÉTIQUE & CANAUX DIGITAUX
  {
    tableName: "BKMNT_CRD",
    module: "Monétique & Canaux",
    description: "Référentiel des cartes bancaires émises rattachées aux comptes clients Amplitude.",
    primaryKey: ["NUMCRD"],
    foreignKeys: [{ column: "NCP", references: "BKCPT.NCP" }, { column: "CLI", references: "BKCLI.CLI" }],
    columns: [
      { name: "NUMCRD", type: "VARCHAR2(19)", description: "Numéro de carte ou proxy PAN sécurisé.", sensitive: true },
      { name: "CLI", type: "VARCHAR2(15)", description: "Titulaire de la carte." },
      { name: "NCP", type: "VARCHAR2(11)", description: "Compte principal débité." },
      { name: "PROD", type: "VARCHAR2(4)", description: "Gamme produit : CLAS=Classic, GOLD=Gold, PLAT=Platinum." },
      { name: "DEXP", type: "VARCHAR2(4)", description: "Date d'expiration (MMYY).", sensitive: true },
      { name: "ETA", type: "VARCHAR2(1)", description: "Statut : A=Active, B=Bloquée, O=Opposition, C=Confisquée." },
    ],
    sampleQuery: "SELECT NUMCRD, NCP, PROD, ETA FROM BKMNT_CRD WHERE ETA = 'A';",
    criticalNotes: "Consulte le solde de BKCPT en temps réel lors des demandes d'autorisation ISO 8583 (0100/0200)."
  },
  {
    tableName: "BKMNT_TRX",
    module: "Monétique & Canaux",
    description: "Transactions cartes en temps réel (GAB, TPE, E-Commerce) avant clearing.",
    primaryKey: ["IDTRX"],
    foreignKeys: [{ column: "NCP", references: "BKCPT.NCP" }],
    columns: [
      { name: "IDTRX", type: "VARCHAR2(25)", description: "Numéro unique de transaction monétique." },
      { name: "STAN", type: "VARCHAR2(6)", description: "Systems Trace Audit Number (DE11 ISO 8583)." },
      { name: "NCP", type: "VARCHAR2(11)", description: "Compte pré-bloqué ou impacté." },
      { name: "MNT", type: "NUMBER(19,4)", description: "Montant de l'autorisation." },
      { name: "AUTH", type: "VARCHAR2(6)", description: "Code autorisation accordé (DE38)." },
      { name: "TER", type: "VARCHAR2(8)", description: "Identifiant du terminal GAB/TPE (DE41)." },
      { name: "STAT", type: "VARCHAR2(4)", description: "Statut : AUTH=Autorisé, SETT=Compensé, CANC=Annulé." },
    ],
    sampleQuery: "SELECT STAN, NCP, MNT, AUTH, STAT FROM BKMNT_TRX WHERE DTRX = TRUNC(SYSDATE);",
    criticalNotes: "Sert de référence de matching avec les fichiers de compensation Visa BASE II et Mastercard IPM."
  },
  {
    tableName: "BKMNT_GAB",
    module: "Monétique & Canaux",
    description: "Parc des distributeurs et guichets automatiques (GAB/ATM) connectés au CBS.",
    primaryKey: ["IDGAB"],
    foreignKeys: [{ column: "AGE", references: "BKAGE.AGE" }],
    columns: [
      { name: "IDGAB", type: "VARCHAR2(8)", description: "Code terminal GAB." },
      { name: "LIB", type: "VARCHAR2(35)", description: "Nom et emplacement géographique du distributeur." },
      { name: "AGE", type: "VARCHAR2(5)", description: "Agence gestionnaire du coffre GAB." },
      { name: "CPT_COF", type: "VARCHAR2(11)", description: "Compte de trésorerie coffre GAB." },
      { name: "ETA", type: "VARCHAR2(1)", description: "Statut : S=En service, H=Hors service, M=Maintenance." },
    ],
    sampleQuery: "SELECT IDGAB, LIB, CPT_COF, ETA FROM BKMNT_GAB WHERE ETA != 'S';",
    criticalNotes: "Permet la réconciliation des écarts de caisse physiques lors des arrêtés de compteurs GAB."
  },
  {
    tableName: "BKDIG_USR",
    module: "Monétique & Canaux",
    description: "Abonnés banque en ligne (Web Banking & Mobile Banking) et statuts d'activation.",
    primaryKey: ["IDDIG"],
    foreignKeys: [{ column: "CLI", references: "BKCLI.CLI" }],
    columns: [
      { name: "IDDIG", type: "VARCHAR2(20)", description: "Identifiant de connexion digitale." },
      { name: "CLI", type: "VARCHAR2(15)", description: "Client bancaire associé." },
      { name: "DEVICE_ID", type: "VARCHAR2(64)", description: "Empreinte matérielle du smartphone enregistré." },
      { name: "ETA", type: "VARCHAR2(1)", description: "Statut : A=Actif, B=Bloqué, P=Première connexion." },
      { name: "DCON", type: "DATE", description: "Dernière connexion réussie enregistrée." },
    ],
    sampleQuery: "SELECT IDDIG, CLI, ETA, DCON FROM BKDIG_USR WHERE DCON >= TRUNC(SYSDATE);",
    criticalNotes: "Point de contrôle principal pour la détection de fraudes par takeover de compte digital."
  },

  // 12. PARAMÉTRAGE COMPTABLE, DEVISES & FISCALITÉ
  {
    tableName: "BKTVA",
    module: "Fiscalité & Taxes",
    description: "Paramétrage des taux de taxes bancaires (TVA, TOB, TAF) par type d'opération.",
    primaryKey: ["CTAX"],
    foreignKeys: [],
    columns: [
      { name: "CTAX", type: "VARCHAR2(4)", description: "Code taxe réglementaire." },
      { name: "LIB", type: "VARCHAR2(30)", description: "Désignation de la taxe fiscale." },
      { name: "TAUX", type: "NUMBER(6,3)", description: "Pourcentage appliqué (ex: 18.000 pour TVA UEMOA)." },
      { name: "CPT_TAX", type: "VARCHAR2(11)", description: "Compte d'imputation fiscale au trésor public." },
    ],
    sampleQuery: "SELECT CTAX, LIB, TAUX, CPT_TAX FROM BKTVA;",
    criticalNotes: "Appliqué automatiquement sur chaque commission prélevée lors des schémas comptables."
  },
  {
    tableName: "BKREG",
    module: "Fiscalité & Taxes",
    description: "Règles d'exonération de frais et de taxes pour régimes spéciaux et ONG.",
    primaryKey: ["CLI", "CTAX"],
    foreignKeys: [{ column: "CLI", references: "BKCLI.CLI" }, { column: "CTAX", references: "BKTVA.CTAX" }],
    columns: [
      { name: "CLI", type: "VARCHAR2(15)", description: "Client bénéficiaire de l'exonération." },
      { name: "CTAX", type: "VARCHAR2(4)", description: "Taxe faisant l'objet de l'exonération." },
      { name: "DVAL", type: "DATE", description: "Date de fin de validité de l'attestation fiscale." },
    ],
    sampleQuery: "SELECT CLI, CTAX, DVAL FROM BKREG WHERE DVAL >= TRUNC(SYSDATE);",
    criticalNotes: "Exige un certificat d'exonération visé par l'administration fiscale dans le dossier KYC."
  },
  {
    tableName: "BKCAL",
    module: "Paramétrage Système",
    description: "Calendrier d'ouverture des marchés, jours fériés légaux et dates de valeur.",
    primaryKey: ["DAT"],
    foreignKeys: [],
    columns: [
      { name: "DAT", type: "DATE", description: "Date calendaire." },
      { name: "FER", type: "VARCHAR2(1)", description: "Jour férié ou chômé (O/N)." },
      { name: "OPE", type: "VARCHAR2(1)", description: "Journée ouvrée bancaire (O/N)." },
      { name: "DVAL_SUIV", type: "DATE", description: "Date de valeur suivante applicable pour les chèques/virements." },
    ],
    sampleQuery: "SELECT DAT, FER, OPE, DVAL_SUIV FROM BKCAL WHERE DAT BETWEEN TRUNC(SYSDATE) AND TRUNC(SYSDATE)+15;",
    criticalNotes: "Si le calendrier de l'année suivante n'est pas saisi avant le 31 décembre, le batch annuel plante."
  },
  {
    tableName: "BKCHQ",
    module: "Moyens de Paiement",
    description: "Chèques émis, chéquiers délivrés, formules en circulation et oppositions chèques.",
    primaryKey: ["AGE", "NCP", "NCHQ"],
    foreignKeys: [{ column: "NCP", references: "BKCPT.NCP" }],
    columns: [
      { name: "AGE", type: "VARCHAR2(5)", description: "Agence du compte." },
      { name: "NCP", type: "VARCHAR2(11)", description: "Numéro de compte tireur." },
      { name: "NCHQ", type: "VARCHAR2(10)", description: "Numéro de formule de chèque à 7 chiffres." },
      { name: "MNT", type: "NUMBER(19,4)", description: "Montant payé ou provisionné." },
      { name: "ETA", type: "VARCHAR2(1)", description: "État : E=En circulation, P=Payé, O=Opposition (perte/vol), A=Annulé." },
      { name: "DPAY", type: "DATE", description: "Date de présentation en chambre de compensation." },
    ],
    sampleQuery: "SELECT NCP, NCHQ, ETA, MNT FROM BKCHQ WHERE ETA = 'O';",
    criticalNotes: "Rejette automatiquement tout chèque frappé d'opposition lors du déversement de compensation."
  },
  {
    tableName: "BKREM",
    module: "Moyens de Paiement",
    description: "Remises de chèques et effets de commerce à l'encaissement (LCR / BOR).",
    primaryKey: ["NREM"],
    foreignKeys: [{ column: "NCP", references: "BKCPT.NCP" }],
    columns: [
      { name: "NREM", type: "VARCHAR2(15)", description: "Bordereau de remise de chèques." },
      { name: "NCP", type: "VARCHAR2(11)", description: "Compte crédité sous réserve d'encaissement." },
      { name: "NBR", type: "NUMBER(4)", description: "Nombre de chèques remis dans le bordereau." },
      { name: "TOT", type: "NUMBER(19,4)", description: "Montant total de la remise." },
      { name: "ETA", type: "VARCHAR2(1)", description: "Statut : S=Saisie, C=Compensée, R=Rejetée." },
    ],
    sampleQuery: "SELECT NREM, NCP, TOT, ETA FROM BKREM WHERE ETA = 'S';",
    criticalNotes: "Gère la réserve d'encaissement (indisponibilité J+2 ou J+3 selon la réglementation)."
  },
  {
    tableName: "BKSYS",
    module: "Paramétrage Système",
    description: "Variables d'environnement système, date comptable courante et état de la chaîne EOD.",
    primaryKey: ["CLE"],
    foreignKeys: [],
    columns: [
      { name: "CLE", type: "VARCHAR2(10)", description: "Identifiant de variable système (ex: DCO_SYS, STAT_EOD)." },
      { name: "VAL", type: "VARCHAR2(50)", description: "Valeur actuelle de la variable." },
      { name: "DESC_VAR", type: "VARCHAR2(100)", description: "Description du paramètre moteur." },
    ],
    sampleQuery: "SELECT CLE, VAL FROM BKSYS WHERE CLE IN ('DCO_SYS', 'STAT_EOD', 'CUTOFF_TIME');",
    criticalNotes: "La date système DCO_SYS est basculée à J+1 lors de l'étape ultime de l'EOD (Étape 10)."
  },
  {
    tableName: "BKCOM_AUX",
    module: "Comptabilité & Balance",
    description: "Comptes auxiliaires et liaisons inter-agences pour les flux de centralisation de succursales.",
    primaryKey: ["AGE", "NCP_AUX"],
    foreignKeys: [],
    columns: [
      { name: "AGE", type: "VARCHAR2(5)", description: "Code agence." },
      { name: "NCP_AUX", type: "VARCHAR2(11)", description: "Compte auxiliaire de liaison." },
      { name: "SOL_AUX", type: "NUMBER(19,4)", description: "Solde de position inter-sièges." },
    ],
    sampleQuery: "SELECT AGE, NCP_AUX, SOL_AUX FROM BKCOM_AUX;",
    criticalNotes: "Doit être rigoureusement soldé chaque soir entre le siège et les agences du réseau."
  },
  {
    tableName: "BKTAB",
    module: "Paramétrage Système",
    description: "Tables de nomenclature générale, tables de transcodification et codes d'états.",
    primaryKey: ["CDE_TAB", "CDE_ELT"],
    foreignKeys: [],
    columns: [
      { name: "CDE_TAB", type: "VARCHAR2(4)", description: "Identifiant de la table de nomenclature." },
      { name: "CDE_ELT", type: "VARCHAR2(10)", description: "Code de l'élément." },
      { name: "LIB_ELT", type: "VARCHAR2(40)", description: "Désignation en clair." },
    ],
    sampleQuery: "SELECT CDE_TAB, CDE_ELT, LIB_ELT FROM BKTAB WHERE CDE_TAB = 'PAYS';",
    criticalNotes: "Contrôle les menus déroulants et contrôles d'intégrité de l'IHM Amplitude."
  },
  {
    tableName: "BKTRACE_BATCH",
    module: "Exploitation Batch",
    description: "Journal de suivi d'exécution des traitements batch, checkpoints, statuts et temps de réponse.",
    primaryKey: ["IDRUN", "STEP"],
    foreignKeys: [],
    columns: [
      { name: "IDRUN", type: "NUMBER(10)", description: "Identifiant du run journalier." },
      { name: "STEP", type: "VARCHAR2(20)", description: "Nom du binaire ou traitement exécuté." },
      { name: "DDEB", type: "DATE", description: "Horodatage de démarrage." },
      { name: "DFIN", type: "DATE", description: "Horodatage de fin d'exécution." },
      { name: "RETCODE", type: "NUMBER(3)", description: "Code retour (0=Succès, >0=Erreur)." },
      { name: "NBREC", type: "NUMBER(10)", description: "Nombre de lignes ou transactions traitées." },
    ],
    sampleQuery: "SELECT STEP, DDEB, DFIN, RETCODE, NBREC FROM BKTRACE_BATCH WHERE DDEB >= TRUNC(SYSDATE) ORDER BY DDEB ASC;",
    criticalNotes: "Consultée par le superviseur d'ordonnancement pour décider de la reprise ou du rollback."
  },
  {
    tableName: "BKLOCK",
    module: "Exploitation Batch",
    description: "Jetons de verrouillage logique des tables applicatives pour empêcher les accès concurrents.",
    primaryKey: ["LOCK_NAME"],
    foreignKeys: [],
    columns: [
      { name: "LOCK_NAME", type: "VARCHAR2(30)", description: "Nom de la ressource ou chaîne batch verrouillée." },
      { name: "PID", type: "NUMBER(8)", description: "Process ID du programme propriétaire du jeton." },
      { name: "DLOCK", type: "DATE", description: "Horodatage de pose du verrou." },
    ],
    sampleQuery: "SELECT LOCK_NAME, PID, DLOCK FROM BKLOCK;",
    criticalNotes: "Si le batch crashe brusquement, le jeton reste dans BKLOCK et bloque toute nouvelle exécution."
  },
  {
    tableName: "BKDEV_HIST",
    module: "Paramétrage Devises",
    description: "Historique quotidien des cours de change et fixing officiel des devises étrangères.",
    primaryKey: ["DEV", "DCO"],
    foreignKeys: [{ column: "DEV", references: "BKDEV.DEV" }],
    columns: [
      { name: "DEV", type: "VARCHAR2(3)", description: "Code ISO devise." },
      { name: "DCO", type: "DATE", description: "Date comptable du fixing." },
      { name: "ACHAT", type: "NUMBER(15,7)", description: "Cours d'achat appliqué au guichet." },
      { name: "VENTE", type: "NUMBER(15,7)", description: "Cours de vente appliqué au guichet." },
      { name: "PIVOT", type: "NUMBER(15,7)", description: "Cours pivot officiel Banque Centrale." },
    ],
    sampleQuery: "SELECT DEV, DCO, PIVOT FROM BKDEV_HIST WHERE DCO >= TRUNC(SYSDATE)-7;",
    criticalNotes: "Sert à la valorisation historique des portefeuilles de devises et états de change."
  }
];
