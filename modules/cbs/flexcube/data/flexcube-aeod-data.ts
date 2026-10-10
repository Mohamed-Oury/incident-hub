// modules/cbs/flexcube/data/flexcube-aeod-data.ts
import { FlexcubeAeodStep, FlexcubeAeodScenario } from "../types";

export const FLEXCUBE_AEOD_STEPS: FlexcubeAeodStep[] = [
  {
    stepNumber: 1,
    phaseCode: "PEOD",
    phaseName: "Pre End of Day (Pré-clôture)",
    programName: "BA_PRE_EOD",
    module: "AEOD",
    description: "Vérification des prérequis de fermeture : validation des guichets agences, arrêt des saisies manuelles et contrôle d intégrité.",
    estimatedDuration: "10-15 min",
    criticality: "HAUTE",
    commonErrors: ["AC-BR-CLSD-01 : Agence avec des caisses encore ouvertes", "ORA-00054 : Verrou sur tables guichets"]
  },
  {
    stepNumber: 2,
    phaseCode: "EOTI",
    phaseName: "End of Transaction Input (Arrêt des Saisies)",
    programName: "BA_EOTI_MARK",
    module: "AEOD",
    description: "Bascule formelle du système en mode lecture seule pour les utilisateurs : aucune nouvelle transaction ne peut être saisie.",
    estimatedDuration: "5-10 min",
    criticality: "CRITIQUE",
    commonErrors: ["ST-TXN-PEND-01 : Contrat en statut Hold non validé", "ORA-02049 : Timeout de transaction distribuée"]
  },
  {
    stepNumber: 3,
    phaseCode: "EOTI",
    phaseName: "Validation des Flux en Attente",
    programName: "FT_BATCH_PROCESS",
    module: "FT",
    description: "Exécution des ordres de virement récurrents et compensation des flux interbancaires en attente de déversement.",
    estimatedDuration: "25-35 min",
    criticality: "HAUTE",
    commonErrors: ["FT-PROC-ERR-02 : Provision insuffisante sur compte donneur d ordre", "ORA-01555 : Snapshot too old sur FTTB_TXN_LOG"]
  },
  {
    stepNumber: 4,
    phaseCode: "EOFI",
    phaseName: "End of Financial Input (Arrêt des Flux Financiers)",
    programName: "BA_EOFI_MARK",
    module: "AEOD",
    description: "Gel complet de tous les modules financiers : suspension des passerelles Gateway et passage en mode Stand-in Monétique.",
    estimatedDuration: "10 min",
    criticality: "CRITIQUE",
    commonErrors: ["GW-CONN-ACTV : Canal Switch monétique connecté refusant la coupure temporaire"]
  },
  {
    stepNumber: 5,
    phaseCode: "EOFI",
    phaseName: "Arrêté Comptable des Mouvements du Jour",
    programName: "AC_DAILY_POST",
    module: "AC",
    description: "Consolidation des mouvements de ACTB_DAILY_LOG, vérification de l équilibre Débit = Crédit et préparation du déversement GL.",
    estimatedDuration: "30-45 min",
    criticality: "CRITIQUE",
    commonErrors: ["AC-BAL-UNBAL-01 : Déséquilibre comptable Débit/Crédit dans une devise", "ORA-01653 : Échec d extension tablespace AC_DATA"]
  },
  {
    stepNumber: 6,
    phaseCode: "EOD",
    phaseName: "Calcul des Intérêts et Agios Débiteurs",
    programName: "IC_ACCRUAL_BATCH",
    module: "AC",
    description: "Calcul journalier des courus d intérêts sur comptes d épargne, comptes courants et découverts bancaires.",
    estimatedDuration: "40-60 min",
    criticality: "CRITIQUE",
    commonErrors: ["IC-ACCR-FAIL : Formule d intérêts introuvable pour la classe de compte", "ORA-04031 : Mémoire partagée insuffisante"]
  },
  {
    stepNumber: 7,
    phaseCode: "EOD",
    phaseName: "Échéancier des Prêts & Crédits (Amortissements)",
    programName: "CL_AUTO_SCHD_SETTLE",
    module: "CL",
    description: "Prélèvement automatique des mensualités de crédit échues et passage en arriéré/contentieux des impayés.",
    estimatedDuration: "35-50 min",
    criticality: "HAUTE",
    commonErrors: ["CL-SCHD-ERR-05 : Compte de remboursement clôturé ou bloqué"]
  },
  {
    stepNumber: 8,
    phaseCode: "EOD",
    phaseName: "Déversement dans le Grand Livre (GL)",
    programName: "GL_POST_BATCH",
    module: "GL",
    description: "Mise à jour des soldes de synthèse dans GLTB_GL_BALANCES et figeage du bilan de la journée comptable.",
    estimatedDuration: "20-30 min",
    criticality: "CRITIQUE",
    commonErrors: ["GL-POST-OOB : Rupture d équilibre de balance générale", "ORA-00001 : Violation de contrainte unique sur GLTB_GL_BALANCES"]
  },
  {
    stepNumber: 9,
    phaseCode: "BOD",
    phaseName: "Basculement de Date Système (Turnover J à J+1)",
    programName: "BA_DATE_TURNOVER",
    module: "AEOD",
    description: "Avancement officiel de la date système de la banque à la date du prochain jour ouvré dans STTM_BRANCH.",
    estimatedDuration: "10-15 min",
    criticality: "CRITIQUE",
    commonErrors: ["BA-DATE-FAIL : Calendrier de l agence non configuré pour la nouvelle journée"]
  },
  {
    stepNumber: 10,
    phaseCode: "BOD",
    phaseName: "Réouverture des Canaux & Synchronisation Switch",
    programName: "GW_RESTART_SERVICES",
    module: "GW",
    description: "Rétablissement des autorisations temps réel, réactivation des passerelles d agences et reprise des flux normaux.",
    estimatedDuration: "10 min",
    criticality: "HAUTE",
    commonErrors: ["GW-INIT-TIMEOUT : La passerelle met trop de temps à se reconnecter au Switch"]
  }
];

export const FLEXCUBE_AEOD_SCENARIOS: FlexcubeAeodScenario[] = [
  {
    id: "AEOD-SCEN-01",
    title: "Blocage en Phase EOTI : Contrat en statut Non-Validé (Hold)",
    phase: "EOTI",
    symptom: "L AEOD refuse de basculer en phase EOTI et s arrête avec le message d erreur ST-TXN-PEND-01.",
    rootCause: "Un utilisateur d agence a initié un contrat de transfert de fonds (FT) ou de caisse sans le valider ni le supprimer avant son départ.",
    impact: "Blocage de l ensemble de la chaîne batch de l agence concernée, retard potentiel de l arrêté comptable global.",
    sqlDiagnostic: "SELECT CONTRACT_REF_NO, PRODUCT_CODE, AUTH_STAT, MAKER_ID FROM FTTB_CONTRACT_MASTER WHERE AUTH_STAT = 'U' AND BRANCH_CODE = '001';",
    resolutionSteps: [
      "1. Exécuter la requête d identification du contrat non autorisé pour repérer le créateur (MAKER_ID).",
      "2. Si le contrat est légitime, demander au superviseur habilité de le valider via l écran de contrat.",
      "3. Si le superviseur n est pas disponible ou s il s agit d un brouillon erroné, supprimer ou autoriser exceptionnellement selon la procédure d urgence habilitée.",
      "4. Relancer le moniteur AEOD sur la phase EOTI."
    ],
    prevention: "Mettre en place un script de contrôle pré-AEOD à 17h30 alertant les chefs d agence sur les contrats non autorisés."
  },
  {
    id: "AEOD-SCEN-02",
    title: "Blocage Phase EOFI / AC_DAILY_POST : Verrou ORA-00054 sur ACTB_DAILY_LOG",
    phase: "EOFI",
    symptom: "Le job AC_DAILY_POST échoue immédiatement avec ORA-00054: resource busy and acquire with NOWAIT specified.",
    rootCause: "Une session externe d extraction de données (reporting ou requête SQL non optimisée sans clause READ ONLY) maintient un verrou exclusif sur la table.",
    impact: "Impossible d effectuer l arrêté comptable des mouvements du jour.",
    sqlDiagnostic: "SELECT s.sid, s.serial#, s.username, s.program, l.mode_held FROM v$session s JOIN v$locked_object l ON s.sid = l.session_id JOIN dba_objects o ON l.object_id = o.object_id WHERE o.object_name = 'ACTB_DAILY_LOG';",
    resolutionSteps: [
      "1. Identifier le SID et le SERIAL# de la session bloquante avec la requête d investigation.",
      "2. Vérifier qu il ne s agit pas d un traitement critique légitime.",
      "3. Mettre fin à la session bloquante via ALTER SYSTEM KILL SESSION 'sid,serial#' IMMEDIATE;",
      "4. Relancer le programme AC_DAILY_POST depuis la console AEOD."
    ],
    prevention: "Isoler les requêtes d extraction lourdes sur un réplica Oracle Active Data Guard en lecture seule."
  },
  {
    id: "AEOD-SCEN-03",
    title: "Blocage Phase EOD : Erreur ORA-01555 Snapshot Too Old sur IC_ACCRUAL_BATCH",
    phase: "EOD",
    symptom: "Le calcul des intérêts sur comptes s interrompt après 30 minutes avec l erreur ORA-01555.",
    rootCause: "Le tablespace d annulation (UNDO Tablespace) est sous-dimensionné ou le paramètre UNDO_RETENTION est insuffisant face au volume de transactions simultanées.",
    impact: "Les écritures d agios et d intérêts courus ne sont pas générées pour la journée.",
    sqlDiagnostic: "SELECT MAX(maxquerylen), MIN(undoblks) FROM v$undostat WHERE begin_time > SYSDATE - 1/24;",
    resolutionSteps: [
      "1. Augmenter temporairement le paramètre d instance UNDO_RETENTION : ALTER SYSTEM SET UNDO_RETENTION = 7200 SCOPE=BOTH;",
      "2. Vérifier que le tablespace UNDO dispose d assez d espace avec autoextend activé.",
      "3. Relancer le job d accrual IC_ACCRUAL_BATCH.",
      "4. Documenter le redimensionnement définitif du tablespace UNDO auprès des DBA."
    ],
    prevention: "Dimensionner l UNDO_RETENTION à au moins 3 heures lors des jours de forte volumétrie (fin de mois)."
  },
  {
    id: "AEOD-SCEN-04",
    title: "Blocage Phase EOD / GL_POST_BATCH : Déséquilibre Comptable (Débit != Crédit)",
    phase: "EOD",
    symptom: "L arrêté GL_POST_BATCH s arrête avec l erreur applicative GL-POST-OOB (Out of Balance).",
    rootCause: "Une transaction monétique ou un transfert a été enregistrée avec un centime d écart d arrondi sur la conversion de devises étrangères (FX rounding error).",
    impact: "Le bilan journalier ne peut pas être figé sans respect de la balance à somme nulle.",
    sqlDiagnostic: "SELECT AC_CCY, SUM(CASE WHEN DRCR_IND='D' THEN LCY_AMOUNT ELSE -LCY_AMOUNT END) AS ECART FROM ACTB_DAILY_LOG GROUP BY AC_CCY HAVING SUM(CASE WHEN DRCR_IND='D' THEN LCY_AMOUNT ELSE -LCY_AMOUNT END) != 0;",
    resolutionSteps: [
      "1. Identifier la devise et le montant exact de l écart avec la requête d équilibre.",
      "2. Vérifier les transactions du jour sur cette devise pour repérer l écriture orpheline ou la différence d arrondi.",
      "3. Passer une écriture de rééquilibrage sur le compte GL de suspense/écart d arrondi autorisé selon le protocole comptable.",
      "4. Relancer GL_POST_BATCH."
    ],
    prevention: "Activer le paramètre d affectation automatique des micro-écarts de conversion vers le compte GL dédié de rounding difference."
  },
  {
    id: "AEOD-SCEN-05",
    title: "Blocage Phase BOD : Calendrier Agence Non Initialisé pour J+1",
    phase: "BOD",
    symptom: "Le turnover de date échoue en phase BOD avec l erreur BA-DATE-FAIL pour une agence spécifique.",
    rootCause: "Le calendrier des jours fériés et ouvrés de l agence (STTM_BRANCH_HOLIDAYS) n a pas été prorogé pour l année ou le mois en cours.",
    impact: "L agence ne peut pas ouvrir ses guichets le lendemain matin.",
    sqlDiagnostic: "SELECT BRANCH_CODE, MAX(HOLIDAY_DATE) FROM STTM_BRANCH_HOLIDAYS GROUP BY BRANCH_CODE;",
    resolutionSteps: [
      "1. Vérifier la date maximale déclarée dans le calendrier de l agence.",
      "2. Injecter les jours ouvrés et fériés de la période via la procédure standard de reconduction de calendrier.",
      "3. Valider la configuration et relancer la phase BOD.",
      "4. Confirmer que la date système dans STTM_BRANCH est passée à J+1."
    ],
    prevention: "Planifier une alerte annuelle 30 jours avant expiration du calendrier des jours fériés."
  }
];
