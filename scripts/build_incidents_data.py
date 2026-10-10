incidents_ts = """// modules/cbs/flexcube/data/flexcube-incidents-data.ts
import { FlexcubeIncident } from "../types";

export const FLEXCUBE_INCIDENTS: FlexcubeIncident[] = [
  {
    id: "FCUBS-INC-001",
    reference: "INC-FCUBS-ORA-00054",
    title: "Verrou Exclusif sur Table des Écritures ACTB_DAILY_LOG (ORA-00054)",
    module: "AC",
    errorCode: "ORA-00054",
    severity: "P1",
    symptom: "Rejets massifs d opérations guichet et transactions monétiques avec code d échec système.",
    typicalLog: "ORA-00054: resource busy and acquire with NOWAIT specified. Module: ACPKS_POSTING_KERNEL.",
    rootCause: "Un batch ou une session d extraction ad-hoc a posé un verrou de table en mode exclusif.",
    investigationQuery: "SELECT s.sid, s.serial#, s.username, s.program, l.mode_held FROM v$session s JOIN v$locked_object l ON s.sid = l.session_id WHERE l.object_id = (SELECT object_id FROM dba_objects WHERE object_name = 'ACTB_DAILY_LOG');",
    resolutionProcedure: [
      "1. Exécuter la requête pour trouver le SID et SERIAL# bloquant.",
      "2. Vérifier si la session provient d un utilisateur ou d un job zombie.",
      "3. Tuer la session bloquante : ALTER SYSTEM KILL SESSION 'sid,serial#' IMMEDIATE;",
      "4. Vérifier la reprise immédiate des transactions dans ACTB_DAILY_LOG."
    ],
    preventionAdvice: "Obliger l utilisation de WITH UR ou Active Data Guard pour les rapports volumineux."
  },
  {
    id: "FCUBS-INC-002",
    reference: "INC-FCUBS-ORA-01555",
    title: "Erreur Snapshot Too Old sur Calcul des Agios (ORA-01555)",
    module: "AC",
    errorCode: "ORA-01555",
    severity: "P2",
    symptom: "Arrêt du calcul des intérêts débiteurs en batch nocturne au bout de 45 minutes.",
    typicalLog: "ORA-01555: snapshot too old: rollback segment number 12 with name '_SYSSMU12$' too small.",
    rootCause: "La rétention UNDO (UNDO_RETENTION) est insuffisante pour couvrir la durée d exécution de la requête sur ACTB_DAILY_LOG.",
    investigationQuery: "SELECT begin_time, maxquerylen, undoblks, ssolderrcnt FROM v$undostat WHERE ssolderrcnt > 0;",
    resolutionProcedure: [
      "1. Consulter v$undostat pour connaître le maxquerylen observé.",
      "2. Augmenter UNDO_RETENTION à 10800 secondes (3h).",
      "3. Relancer le job d accruals d intérêts IC_ACCRUAL_BATCH."
    ],
    preventionAdvice: "Augmenter l UNDO Tablespace et planifier le batch après les écritures lourdes de transferts."
  },
  {
    id: "FCUBS-INC-003",
    reference: "INC-FCUBS-ORA-00001",
    title: "Violation de Clé Unique sur Séquence d Écritures (ORA-00001)",
    module: "AC",
    errorCode: "ORA-00001",
    severity: "P1",
    symptom: "Impossibilité totale d enregistrer des mouvements comptables, échec avec PK violation.",
    typicalLog: "ORA-00001: unique constraint (FCC.PK_ACTB_DAILY_LOG) violated on AC_ENTRY_SR_NO.",
    rootCause: "La séquence Oracle SEQ_AC_ENTRY_SR_NO est désynchronisée suite à une restauration partielle ou import de données.",
    investigationQuery: "SELECT last_number FROM user_sequences WHERE sequence_name = 'SEQ_AC_ENTRY_SR_NO'; SELECT MAX(AC_ENTRY_SR_NO) FROM ACTB_DAILY_LOG;",
    resolutionProcedure: [
      "1. Comparer la valeur maximale dans la table avec le last_number de la séquence.",
      "2. Avancer la séquence au-delà de la valeur maximale : ALTER SEQUENCE SEQ_AC_ENTRY_SR_NO INCREMENT BY 5000; SELECT SEQ_AC_ENTRY_SR_NO.NEXTVAL FROM DUAL; ALTER SEQUENCE SEQ_AC_ENTRY_SR_NO INCREMENT BY 1;",
      "3. Valider une écriture test pour s assurer du succès."
    ],
    preventionAdvice: "Automatiser un contrôle d intégrité des séquences post-maintenance DBA."
  },
  {
    id: "FCUBS-INC-004",
    reference: "INC-FCUBS-AC-VAL-001",
    title: "Contrôle de Provision Insuffisante lors d un Virement (AC-VAL-001)",
    module: "FT",
    errorCode: "AC-VAL-001",
    severity: "P2",
    symptom: "Le virement émis vers un bénéficiaire extérieur est rejeté avec le code AC-VAL-001.",
    typicalLog: "AC-VAL-001: Insufficient funds in account 001123456789. Available balance is less than required amount.",
    rootCause: "Le solde comptable du compte donneur d ordre ne prend pas en compte les montants bloqués (indisponibilités / autorisations monétiques).",
    investigationQuery: "SELECT CUST_AC_NO, ACY_AVL_BAL, ACY_BLOCK_BAL FROM STTM_CUST_ACCOUNT WHERE CUST_AC_NO = '001123456789';",
    resolutionProcedure: [
      "1. Vérifier le montant du solde disponible réel (ACY_AVL_BAL) et des blocages de provision.",
      "2. Si un blocage monétique expiré est présent, le débloquer via le module de gestion des indisponibilités.",
      "3. Informer le client du solde réellement disponible."
    ],
    preventionAdvice: "Configurer la purge automatique des pré-autorisations monétiques non confirmées au bout de 7 jours."
  },
  {
    id: "FCUBS-INC-005",
    reference: "INC-FCUBS-GW-RESP-01",
    title: "Timeout de Passerelle Gateway Monétique GAB/TPE (GW-RESP-01)",
    module: "GW",
    errorCode: "GW-RESP-01",
    severity: "P1",
    symptom: "Les retraits GAB échouent avec code d erreur 91 (Émetteur indisponible) sur le switch.",
    typicalLog: "GW-RESP-01: Gateway timeout waiting for FCUBS Core response after 3000ms. Source: SWITCH_ATM.",
    rootCause: "Surcharge CPU sur l instance WebLogic hébergeant le composant EJB de la Gateway FCUBS.",
    investigationQuery: "SELECT count(*) FROM gwtb_in_log WHERE response_status = 'TIMEOUT' AND request_time > SYSDATE - 10/1440;",
    resolutionProcedure: [
      "1. Vérifier la charge des serveurs applicatifs WebLogic (pool de connexions JDBC et threads coincés).",
      "2. Redémarrer le composant Gateway incriminé si des threads sont en état STUCK.",
      "3. Augmenter temporairement la taille du pool JDBC de la Gateway."
    ],
    preventionAdvice: "Dimensionner le pool de connexions dédié au switch monétique avec une priorité haute (Work Manager distinct)."
  },
  {
    id: "FCUBS-INC-006",
    reference: "INC-FCUBS-ORA-01653",
    title: "Tablespace Plein lors de la Clôture AEOD (ORA-01653)",
    module: "AEOD",
    errorCode: "ORA-01653",
    severity: "P1",
    symptom: "Arrêt net de la chaîne batch à l étape de déversement GL.",
    typicalLog: "ORA-01653: unable to extend table FCC.GLTB_GL_BALANCES by 8192 in tablespace FCC_DATA.",
    rootCause: "Le fichier de données (datafile) du tablespace FCC_DATA a atteint sa taille maximale sans possibilité d auto-extension.",
    investigationQuery: "SELECT tablespace_name, bytes/1024/1024 AS MB_LIBRES FROM dba_free_space WHERE tablespace_name = 'FCC_DATA';",
    resolutionProcedure: [
      "1. Ajouter un nouveau datafile au tablespace : ALTER TABLESPACE FCC_DATA ADD DATAFILE '+DATA' SIZE 10G AUTOEXTEND ON NEXT 1G MAXSIZE 32G;",
      "2. Vérifier que l espace disque du groupe ASM est suffisant.",
      "3. Relancer la phase AEOD interrompue."
    ],
    preventionAdvice: "Configurer une alerte de supervision infra dès que le tablespace dépasse 85% d occupation."
  },
  {
    id: "FCUBS-INC-007",
    reference: "INC-FCUBS-ST-SAVE-001",
    title: "Échec d Enregistrement Client pour Non-Conformité KYC (ST-SAVE-001)",
    module: "ST",
    errorCode: "ST-SAVE-001",
    severity: "P3",
    symptom: "Impossible de valider la création d un nouveau client en agence.",
    typicalLog: "ST-SAVE-001: Mandatory KYC fields missing for Customer Type Corporate. Tax ID / RCCM required.",
    rootCause: "Les champs obligatoires spécifiques à la réglementation locale n ont pas été renseignés par l opérateur.",
    investigationQuery: "SELECT CUSTOMER_NO, CUSTOMER_TYPE, UNIQUE_ID_VALUE FROM STTM_CUSTOMER WHERE CUSTOMER_NO = 'CUST00123';",
    resolutionProcedure: [
      "1. Ouvrir l écran de maintenance client STDCIF.",
      "2. Renseigner l identifiant fiscal unique et la pièce légale justificative.",
      "3. Soumettre à nouveau à la validation du superviseur."
    ],
    preventionAdvice: "Rendre les contrôles de saisie bloquants côté interface avant soumission."
  },
  {
    id: "FCUBS-INC-008",
    reference: "INC-FCUBS-ORA-04031",
    title: "Épuisement de la Mémoire Partagée Shared Pool (ORA-04031)",
    module: "AC",
    errorCode: "ORA-04031",
    severity: "P1",
    symptom: "Crash intermittent de packages PL/SQL avec refus de chargement en mémoire.",
    typicalLog: "ORA-04031: unable to allocate 4120 bytes of shared memory ('shared pool','ACPK_POSTING','sga heap(1,0)').",
    rootCause: "Fragmentation excessive de la Shared Pool due à des requêtes SQL dynamiques sans variables liées (bind variables).",
    investigationQuery: "SELECT name, bytes/1024/1024 MB FROM v$sgastat WHERE pool = 'shared pool' AND name = 'free memory';",
    resolutionProcedure: [
      "1. Exécuter un purge d urgence de la mémoire partagée : ALTER SYSTEM FLUSH SHARED_POOL;",
      "2. Épingler les packages critiques en mémoire avec DBMS_SHARED_POOL.KEEP('ACPK_POSTING');",
      "3. Augmenter le paramètre SGA_TARGET si nécessaire."
    ],
    preventionAdvice: "Proscrire l utilisation de SQL dynamique sans clauses de liaison dans les développements personnalisés."
  },
  {
    id: "FCUBS-INC-009",
    reference: "INC-FCUBS-CL-SCHD-01",
    title: "Échéance de Prêt Non Prélevée sur Compte d Amortissement (CL-SCHD-01)",
    module: "CL",
    errorCode: "CL-SCHD-01",
    severity: "P2",
    symptom: "Les remboursements automatiques d un groupe de crédits ne sont pas passés lors du batch nocturne.",
    typicalLog: "CL-SCHD-01: Auto schedule settlement skipped for account CL009988. Settlement account status is FROZEN.",
    rootCause: "Le compte de débit désigné pour le remboursement a été frappé d une opposition judiciaire (gel des avoirs).",
    investigationQuery: "SELECT ACCOUNT_NUMBER, DR_ACCOUNT, FROZEN FROM CLTB_ACCOUNT_MASTER WHERE ACCOUNT_NUMBER = 'CL009988';",
    resolutionProcedure: [
      "1. Vérifier le motif du gel du compte dans STTM_CUST_ACCOUNT.",
      "2. Selon la procédure juridique, affecter un compte de secours ou basculer le prêt en contentieux impayé.",
      "3. Notifier le département des engagements."
    ],
    preventionAdvice: "Mettre en place un reporting des comptes de remboursement bloqués 48h avant l échéance de prêt."
  },
  {
    id: "FCUBS-INC-010",
    reference: "INC-FCUBS-FT-LIMIT-01",
    title: "Dépassement du Plafond de Virement Interbancaire (FT-LIMIT-01)",
    module: "FT",
    errorCode: "FT-LIMIT-01",
    severity: "P2",
    symptom: "Un ordre de virement d entreprise est bloqué à la saisie malgré un solde disponible suffisant.",
    typicalLog: "FT-LIMIT-01: Transaction amount exceeds daily transfer limit defined for product OTIS and customer CUST991.",
    rootCause: "Le plafond journalier paramétré sur la classe de produit ou le profil de risque client a été atteint.",
    investigationQuery: "SELECT CUSTOMER_NO, DAILY_LIMIT, UTILIZED_LIMIT FROM CSTM_CUSTOMER_LIMITS WHERE CUSTOMER_NO = 'CUST991';",
    resolutionProcedure: [
      "1. Vérifier si une dérogation de plafond a été approuvée par la direction des risques.",
      "2. Si oui, augmenter temporairement le plafond autorisé via l écran de gestion des limites.",
      "3. Réautoriser le contrat de virement."
    ],
    preventionAdvice: "Configurer un workflow de double signature automatisé pour les montants exceptionnels."
  },
  {
    id: "FCUBS-INC-011",
    reference: "INC-FCUBS-DE-CASH-01",
    title: "Écart de Caisse Guichet Détecté à la Clôture d Agence (DE-CASH-01)",
    module: "DE",
    errorCode: "DE-CASH-01",
    severity: "P2",
    symptom: "L agence ne peut pas clôturer son guichet en fin de journée (PEOD bloqué).",
    typicalLog: "DE-CASH-01: Physical cash balance does not match theoretical book balance for till TILL_01. Difference: -50,000 XOF.",
    rootCause: "Une transaction de retrait d espèces a été enregistrée deux fois par erreur de manipulation guichet.",
    investigationQuery: "SELECT * FROM DETB_RTL_TELLER WHERE TILL_ID = 'TILL_01' AND TRN_DATE = TRUNC(SYSDATE) ORDER BY TRN_REF_NO DESC;",
    resolutionProcedure: [
      "1. Éditer le relevé des opérations du guichetier pour identifier la transaction en double.",
      "2. Passer une écriture d annulation (Reversal) contre-passant l opération erronée.",
      "3. Valider à nouveau l arrêté physique de caisse et clôturer le guichet."
    ],
    preventionAdvice: "Activer la détection automatique de doublon sur montant et numéro de compte dans les 60 secondes."
  },
  {
    id: "FCUBS-INC-012",
    reference: "INC-FCUBS-LC-AMND-01",
    title: "Échec d Amendement d une Lettre de Crédit Import (LC-AMND-01)",
    module: "LC",
    errorCode: "LC-AMND-01",
    severity: "P3",
    symptom: "La modification de date d expiration ou d augmentation de montant sur un crédoc est refusée.",
    typicalLog: "LC-AMND-01: Amendment validation failed. Unconfirmed collateral margin shortfall.",
    rootCause: "Le montant du dépôt de garantie (dépôt cash collatéral) n a pas été réajusté pour couvrir la majoration de montant demandée.",
    investigationQuery: "SELECT CONTRACT_REF_NO, LC_AMOUNT, COLLATERAL_AMOUNT FROM LCTB_CONTRACT_MASTER WHERE CONTRACT_REF_NO = 'LC002233';",
    resolutionProcedure: [
      "1. Calculer le supplément de couverture collatérale requis (ex: 110% du montant incrémental).",
      "2. Bloquer la provision correspondante sur le compte du donneur d ordre.",
      "3. Valider l amendement de la lettre de crédit."
    ],
    preventionAdvice: "Intégrer le calcul automatique de provision collatérale lors de la simulation d amendement."
  },
  {
    id: "FCUBS-INC-013",
    reference: "INC-FCUBS-ORA-02049",
    title: "Timeout de Transaction Distribuée avec Switch Monétique (ORA-02049)",
    module: "GW",
    errorCode: "ORA-02049",
    severity: "P1",
    symptom: "Blocage de sessions d autorisations monétiques entraînant un embouteillage sur les connexions SGBD.",
    typicalLog: "ORA-02049: timeout: distributed transaction waiting for lock across database link.",
    rootCause: "Une transaction de compensation via DB Link vers une base monétique externe est restée bloquée suite à une coupure réseau.",
    investigationQuery: "SELECT * FROM dba_2pc_pending WHERE state = 'prepared';",
    resolutionProcedure: [
      "1. Consulter la table dba_2pc_pending pour identifier la transaction distribuée en suspens (LOCAL_TRAN_ID).",
      "2. Forcer la résolution de la transaction : ROLLBACK FORCE 'local_tran_id';",
      "3. Purger l entrée résiduelle avec DBMS_TRANSACTION.PURGE_LOST_DB_ENTRY('local_tran_id');"
    ],
    preventionAdvice: "Remplacer les DB Links synchrones par des échanges asynchrones via files de messages JMS sécurisées."
  },
  {
    id: "FCUBS-INC-014",
    reference: "INC-FCUBS-GL-RECON-01",
    title: "Divergence entre Balance Compte Client et Solde GL (GL-RECON-01)",
    module: "GL",
    errorCode: "GL-RECON-01",
    severity: "P2",
    symptom: "Le rapport de réconciliation GL/AC signale un écart de balance entre les comptes courants et le compte miroir GL.",
    typicalLog: "GL-RECON-01: Reconciliation variance between STTM_CUST_ACCOUNT sum and GLTB_GL_BALANCES 211100000. Variance: 125,000 XOF.",
    rootCause: "Une écriture manuelle a été passée directement sur le compte GL de regroupement sans passer par un compte auxiliaire client.",
    investigationQuery: "SELECT SUM(LCY_AMOUNT) FROM ACTB_DAILY_LOG WHERE AC_NO = '211100000' AND MODULE NOT IN ('AC', 'ST');",
    resolutionProcedure: [
      "1. Identifier l écriture anormale postée directement sur le compte GL collectif.",
      "2. Contre-passer l écriture manuelle et la rediriger vers le compte d attente approprié.",
      "3. Verrouiller le paramétrage du compte GL pour interdire la saisie directe (Direct Posting Allowed = 'N')."
    ],
    preventionAdvice: "Configurer tous les comptes GL de liaison clientèle en saisie automatique exclusive (NO_MANUAL_POSTING)."
  },
  {
    id: "FCUBS-INC-015",
    reference: "INC-FCUBS-ST-DORM-01",
    title: "Compte Client Inactif Passé en Dormance Inattendue (ST-DORM-01)",
    module: "ST",
    errorCode: "ST-DORM-01",
    severity: "P3",
    symptom: "Rejet d un virement créditeur sur le compte d un client régulier pour cause de compte dormant.",
    typicalLog: "ST-DORM-01: Transaction rejected. Account 001987654321 has been marked as DORMANT. Reactivation required.",
    rootCause: "Le délai d inactivité de 180 jours a expiré sans transaction initiée par le client, déclenchant le passage en dormance par l AEOD.",
    investigationQuery: "SELECT CUST_AC_NO, DORMANT_STATUS, LAST_TRN_DATE FROM STTM_CUST_ACCOUNT WHERE CUST_AC_NO = '001987654321';",
    resolutionProcedure: [
      "1. Vérifier l identité du client et son autorisation de réactivation.",
      "2. Procéder à la réactivation du compte via l écran de maintenance de compte avec validation hiérarchique.",
      "3. Repasser le virement créditeur en attente."
    ],
    preventionAdvice: "Envoyer une notification automatique par SMS au client 30 jours avant le basculement en dormance."
  },
  {
    id: "FCUBS-INC-016",
    reference: "INC-FCUBS-ORA-01438",
    title: "Dépassement de Capacité Numérique sur Montant (ORA-01438)",
    module: "FT",
    errorCode: "ORA-01438",
    severity: "P2",
    symptom: "Échec d une opération de virement de montant très élevé en monnaie dépréciée.",
    typicalLog: "ORA-01438: value larger than specified precision allowed for this column. Table: FTTB_TXN_LOG.",
    rootCause: "Le montant exprimé dans une devise avec de nombreuses décimales ou de très grands nombres dépasse la précision NUMBER(22,3).",
    investigationQuery: "SELECT data_type, data_precision, data_scale FROM user_tab_columns WHERE table_name = 'FTTB_TXN_LOG' AND column_name = 'LCY_AMOUNT';",
    resolutionProcedure: [
      "1. Vérifier si l opération comporte une erreur de frappe (ex: zéros supplémentaires ajoutés par erreur).",
      "2. Si le montant est légitime, scinder l opération en deux virements séparés respectant les limites de colonne.",
      "3. Documenter l évolution de schéma auprès des architectes Core Banking."
    ],
    preventionAdvice: "Appliquer un masque de saisie avec contrôle de plausibilité sur les montants saisis."
  },
  {
    id: "FCUBS-INC-017",
    reference: "INC-FCUBS-AEOD-SKIP-01",
    title: "Saut d Étape Batch Non Autorisé lors de la Clôture (AEOD-SKIP-01)",
    module: "AEOD",
    errorCode: "AEOD-SKIP-01",
    severity: "P1",
    symptom: "La date système a basculé à J+1 mais les intérêts n ont pas été comptabilisés.",
    typicalLog: "AEOD-SKIP-01: Critical program IC_ACCRUAL_BATCH marked as SKIPPED by operator override without supervisor approval.",
    rootCause: "Un exploitant nocturne a forcé le statut 'Skip' pour contourner un blocage sans corriger la cause sous-jacente.",
    investigationQuery: "SELECT * FROM AETB_PROCESS_PROGRESS WHERE STATUS = 'K' AND EOD_DATE = TRUNC(SYSDATE - 1);",
    resolutionProcedure: [
      "1. Identifier la phase sautée et son impact sur les écritures comptables.",
      "2. Lancer le traitement d intérêts en mode manuel post-clôture avec valeur rétroactive.",
      "3. Réconcilier les balances comptables et alerter la direction des opérations."
    ],
    preventionAdvice: "Désactiver la possibilité de saut d étape sur les programmes de criticité CRITIQUE dans la console AEOD."
  },
  {
    id: "FCUBS-INC-018",
    reference: "INC-FCUBS-GW-XML-01",
    title: "Erreur de Schéma XML sur Passerelle de Paiement Gateway (GW-XML-01)",
    module: "GW",
    errorCode: "GW-XML-01",
    severity: "P2",
    symptom: "Rejet de messages XML provenant de l application Mobile Banking.",
    typicalLog: "GW-XML-01: XML Schema validation failed: element <BranchCode> expected length 3, found '0001'.",
    rootCause: "L application mobile a envoyé un code agence sur 4 caractères au lieu du format 3 caractères standard FCUBS.",
    investigationQuery: "SELECT source_code, error_detail FROM gwtb_in_log WHERE error_code = 'GW-XML-01' ORDER BY log_id DESC;",
    resolutionProcedure: [
      "1. Corriger la couche d intégration API pour normaliser le format du code agence (suppression du zéro de tête).",
      "2. Redéployer la mise à jour du connecteur middleware.",
      "3. Rejouer les requêtes en échec depuis la file de reprise."
    ],
    preventionAdvice: "Mettre en place un contrat d API OpenAPI avec validation stricte en amont de la Gateway."
  },
  {
    id: "FCUBS-INC-019",
    reference: "INC-FCUBS-AC-BLCK-01",
    title: "Provision Monétique Bloquée Non Relâchée sur Compte (AC-BLCK-01)",
    module: "AC",
    errorCode: "AC-BLCK-01",
    severity: "P3",
    symptom: "Réclamation client : montant indisponible suite à une transaction TPE annulée en boutique.",
    typicalLog: "AC-BLCK-01: Hold amount 35,000 XOF remains active beyond merchant transaction reversal time.",
    rootCause: "Le message de reversal ISO 8583 (0400) a été perdu sur le réseau télécom et n a pas atteint la Gateway FCUBS.",
    investigationQuery: "SELECT * FROM STTB_ACCOUNT_BLOCKED WHERE ACCOUNT = '001555666777' AND HOLD_STATUS = 'ACTIVE';",
    resolutionProcedure: [
      "1. Vérifier dans les journaux monétiques l échec du débit définitif du commerçant.",
      "2. Obtenir l attestation d abandon de transaction du switch.",
      "3. Débloquer la provision manuellement via l écran STDHOLD.",
      "4. Confirmer le rétablissement du solde disponible au client."
    ],
    preventionAdvice: "Configurer un job journalier de réconciliation automatique qui purge les blocages sans compensation après 5 jours ouvrés."
  },
  {
    id: "FCUBS-INC-020",
    reference: "INC-FCUBS-ORA-01013",
    title: "Interruption Utilisateur ou Timeout sur Requête de Solde (ORA-01013)",
    module: "AC",
    errorCode: "ORA-01013",
    severity: "P2",
    symptom: "Déconnexion intempestive de l interface web utilisateur lors de l édition d un grand livre.",
    typicalLog: "ORA-01013: user requested cancel of current operation. Execution timeout exceeded (60s).",
    rootCause: "La requête sur ACVW_ALL_AC_ENTRIES effectue un balayage complet de table (Full Table Scan) faute d index sur la date de valeur.",
    investigationQuery: "SELECT sql_id, elapsed_time, executions FROM v$sql WHERE sql_text LIKE '%ACVW_ALL_AC_ENTRIES%' ORDER BY elapsed_time DESC;",
    resolutionProcedure: [
      "1. Analyser le plan d exécution de la requête avec EXPLAIN PLAN FOR.",
      "2. Créer l index composite approprié sur (AC_BRANCH, VALUE_DATE, AC_NO).",
      "3. Collecter les statistiques de table : DBMS_STATS.GATHER_TABLE_STATS('FCC', 'ACTB_DAILY_LOG');",
      "4. Vérifier que le temps d exécution chute en-dessous de 200ms."
    ],
    preventionAdvice: "Procéder à une revue périodique des requêtes les plus consommatrices (AWR / ASH reports)."
  }
];
"""

with open("modules/cbs/flexcube/data/flexcube-incidents-data.ts", "w", encoding="utf-8") as f:
    f.write(incidents_ts)
print("Created flexcube-incidents-data.ts")
