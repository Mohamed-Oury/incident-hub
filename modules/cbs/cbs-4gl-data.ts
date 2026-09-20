// modules/cbs/cbs-4gl-data.ts
import { CBS_4GL_EXTENDED_LESSONS } from "./cbs-4gl-extended-lessons";

export interface Cbs4GlGrade {
  level: number;
  gradeCode: "APPRENTI" | "JUNIOR" | "CONFIRME" | "SENIOR" | "EXPERT";
  name: string;
  badge: string;
  color: string;
  minPassScorePct: number;
  objective: string;
}

export interface Cbs4GlLesson {
  id: string;
  gradeLevel: number;
  category: "SYNTAXE" | "SQL_EMBARQUE" | "CURSEURS" | "TRANSACTIONS" | "IHM_FORMULAIRES" | "OPTIMISATION_EOD";
  title: string;
  summary: string;
  keyConcepts: string[];
  detailedContent: string;
  codeSample: string;
  explanation: string;
  goldenRules: string[];
  pitfallsToAvoid: string[];
}

export interface Cbs4GlExamQuestion {
  id: string;
  gradeLevel: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  trapWarning: string;
}

// ----------------------------------------------------
// 1. LES 5 GRADES DE DÉVELOPPEUR 4GL CORE BANKING
// ----------------------------------------------------
export const CBS_4GL_GRADES: Cbs4GlGrade[] = [
  {
    level: 1,
    gradeCode: "APPRENTI",
    name: "Niveau 1 : Apprenti Développeur 4GL",
    badge: "🟢 Apprenti",
    color: "#22c55e",
    minPassScorePct: 80,
    objective: "Maîtriser la grammaire 4GL, la déclaration des types scalaires, les structures de contrôle et l'organisation modulaire MAIN / FUNCTION."
  },
  {
    level: 2,
    gradeCode: "JUNIOR",
    name: "Niveau 2 : Développeur Junior 4GL",
    badge: "🔵 Junior",
    color: "#3b82f6",
    minPassScorePct: 80,
    objective: "Intégrer le SQL embarqué (SELECT INTO), lier les variables au schéma de la base (RECORD LIKE) et gérer les codes retours système (status, NOTFOUND)."
  },
  {
    level: 3,
    gradeCode: "CONFIRME",
    name: "Niveau 3 : Développeur Confirmé 4GL",
    badge: "🟡 Confirmé",
    color: "#eab308",
    minPassScorePct: 85,
    objective: "Manipuler les curseurs séquentiels (DECLARE/FOREACH), optimiser les lectures massives (DIRTY READ) et concevoir des formulaires guichet interactifs (.per / INPUT)."
  },
  {
    level: 4,
    gradeCode: "SENIOR",
    name: "Niveau 4 : Développeur Senior 4GL",
    badge: "🟠 Senior",
    color: "#f97316",
    minPassScorePct: 85,
    objective: "Garantir l'atomicité stricte des opérations bancaires (partie double, BEGIN/COMMIT/ROLLBACK), maîtriser les niveaux de verrouillage ligne et résoudre les deadlocks (-244, -107)."
  },
  {
    level: 5,
    gradeCode: "EXPERT",
    name: "Niveau 5 : Lead Architecte & Expert 4GL",
    badge: "🔴 Expert",
    color: "#ef4444",
    minPassScorePct: 90,
    objective: "Concevoir des traitements batch haute vélocité pour la chaîne EOD, optimiser les I/O disque via INSERT CURSOR / PUT / FLUSH, et maîtriser le SQL dynamique préparé (PREPARE/EXECUTE)."
  }
];

// ----------------------------------------------------
// 2. COURS DÉTAILLÉS POUR LES 5 NIVEAUX
// ----------------------------------------------------
export const CBS_4GL_LESSONS: Cbs4GlLesson[] = [
  // NIVEAU 1
  {
    id: "l1_01",
    gradeLevel: 1,
    category: "SYNTAXE",
    title: "1.1 Anatomie d'un Module 4GL & Structure MAIN",
    summary: "Découvrez le cycle de vie d'un exécutable 4GL dans l'écosystème bancaire Amplitude.",
    keyConcepts: ["DATABASE amplitude", "GLOBALS", "MAIN ... END MAIN", "CALL", "EXIT PROGRAM"],
    detailedContent: `En Informix 4GL, chaque programme autonome démarre impérativement par la clause 'DATABASE' qui définit le schéma cible. Le bloc 'MAIN' est le point d'entrée unique de l'exécutable.
Les variables peuvent être globales (accessibles à tous les fichiers sources du projet via le bloc GLOBALS) ou locales (visibles uniquement à l'intérieur d'une FUNCTION ou du bloc MAIN).

Le compilateur c4gl traduit d'abord le source 4GL en code C intermédiaire ANSI avant de générer le binaire machine natif lié aux librairies clientes du SGBD.`,
    codeSample: `{ Programme minimal : initialisation et affichage }
DATABASE amplitude

GLOBALS
    DEFINE g_banque_code CHAR(5),
           g_dco_jour DATE
END GLOBALS

MAIN
    DEFINE l_message VARCHAR(80)

    LET g_banque_code = "01001"
    LET g_dco_jour = TODAY
    LET l_message = "Démarrage du sous-système 4GL Amplitude..."

    DISPLAY l_message AT 2, 5
    CALL afficher_entete(g_banque_code, g_dco_jour)

    EXIT PROGRAM (0)
END MAIN

FUNCTION afficher_entete(p_code, p_date)
    DEFINE p_code CHAR(5),
           p_date DATE

    DISPLAY "Banque : ", p_code, " | Date d'arrêté : ", p_date AT 4, 5
END FUNCTION`,
    explanation: "Ce programme établit la connexion au catalogue 'amplitude', charge la date système 'TODAY' et transmet les paramètres à la sous-fonction.",
    goldenRules: [
      "Toujours spécifier le code retour avec EXIT PROGRAM (0 pour succès, >0 pour anomalie).",
      "Nommer les variables avec des préfixes explicites : g_ pour Globales, l_ pour Locales, p_ pour Paramètres."
    ],
    pitfallsToAvoid: [
      "Ne pas déclarer les variables locales au tout début du bloc FUNCTION provoque une erreur de compilation.",
      "Ne jamais appeler DATABASE à l'intérieur d'une FUNCTION : cela doit se faire en tête de fichier."
    ]
  },
  {
    id: "l1_02",
    gradeLevel: 1,
    category: "SYNTAXE",
    title: "1.2 Types de Données Métier & Calculs Décimaux Précis",
    summary: "Apprenez à manipuler les montants financiers sans aucune perte d'arrondi (DECIMAL vs FLOAT).",
    keyConcepts: ["DECIMAL(19,4)", "CHAR vs VARCHAR", "DATE", "NVL()", "USING '###,###,##&.&&'"],
    detailedContent: `Dans une application bancaire, l'utilisation de types à virgule flottante binaire (FLOAT ou SMALLFLOAT) est STRICTEMENT PROSCRITE car ils introduisent des imprécisions d'arrondi intolérables en comptabilité (ex: 0.1 + 0.2 != 0.3).
On utilise exclusivement le type 'DECIMAL(p,s)' ou 'MONEY(p,s)'.
- Pour les soldes bancaires : DECIMAL(19,4) permet de gérer des montants jusqu'aux centaines de milliards avec 4 décimales pour les calculs de change et d'intérêts au prorata temporis.`,
    codeSample: `FUNCTION calculer_agio(p_solde_deb, p_taux, p_jours)
    DEFINE p_solde_deb DECIMAL(19,4),
           p_taux      DECIMAL(7,4),
           p_jours     INTEGER,
           l_agio      DECIMAL(19,4)

    -- Si le solde est NULL, forcer à 0 pour éviter une propagation de NULL
    LET p_solde_deb = NVL(p_solde_deb, 0)

    IF p_solde_deb <= 0 THEN
        RETURN 0.0000
    END IF

    -- Formule bancaire : (Montant * Taux * Nombre de jours) / (360 * 100)
    LET l_agio = (p_solde_deb * p_taux * p_jours) / 36000.0000

    RETURN l_agio
END FUNCTION`,
    explanation: "La fonction utilise le type DECIMAL et la fonction système NVL() pour sécuriser le calcul d'intérêts sur base de l'année bancaire (360 jours).",
    goldenRules: [
      "Systématiquement encapsuler les variables numériques pouvant être NULL dans un NVL(valeur, 0).",
      "Formater les sorties comptables avec la clause USING pour afficher les séparateurs de milliers."
    ],
    pitfallsToAvoid: [
      "En 4GL, toute opération mathématique impliquant une variable à valeur NULL renvoie NULL sans générer d'erreur apparente."
    ]
  },

  // NIVEAU 2
  {
    id: "l2_01",
    gradeLevel: 2,
    category: "SQL_EMBARQUE",
    title: "2.1 SELECT INTO & Liaison Schéma (RECORD LIKE)",
    summary: "Liez dynamiquement vos structures mémoires aux tables Amplitude et lisez un compte en base.",
    keyConcepts: ["RECORD LIKE bkcpt.*", "SELECT * INTO", "status = 0", "status = NOTFOUND (100)"],
    detailedContent: `La puissance d'Informix 4GL réside dans sa fusion naturelle avec le dictionnaire de données du SGBD.
La directive 'RECORD LIKE bkcpt.*' inspecte le catalogue système et dimensionne exactement en mémoire toutes les variables correspondant aux colonnes de la table BKCPT.
Si une colonne de BKCPT change de type (ex: passage d'un code agence de 3 à 5 caractères), une simple recompilation du programme réajuste instantanément la structure sans modifier le code source.`,
    codeSample: `FUNCTION lire_compte_client(p_age, p_ncp)
    DEFINE p_age CHAR(5),
           p_ncp CHAR(11),
           l_cpt RECORD LIKE bkcpt.*

    SELECT * INTO l_cpt.*
      FROM bkcpt
     WHERE age = p_age
       AND ncp = p_ncp

    CASE
        WHEN status = 0
            DISPLAY "Compte trouvé : ", l_cpt.ncp, " | Solde : ", l_cpt.sol USING "---,---,---,##&.&&"
            RETURN TRUE, l_cpt.*
        WHEN status = NOTFOUND
            DISPLAY "ATTENTION : Le compte n'existe pas en agence ", p_age
            RETURN FALSE, l_cpt.*
        OTHERWISE
            DISPLAY "ERREUR SQL CRITIQUE : Code status = ", status
            CALL journaliser_erreur("SELECT_BKCPT", status)
            RETURN FALSE, l_cpt.*
    END CASE
END FUNCTION`,
    explanation: "L'instruction vérifie la variable globale 'status'. 0 correspond à une lecture réussie, NOTFOUND (100) signale l'absence de ligne.",
    goldenRules: [
      "Toujours tester status immédiatement après chaque ordre SELECT.",
      "Ne jamais supposer qu'un compte existe en base : toujours traiter explicitement le cas NOTFOUND."
    ],
    pitfallsToAvoid: [
      "Si la requête SELECT renvoie PLUS d'une ligne, status prend la valeur -284 (A subquery has returned not exactly one row) et le programme plante."
    ]
  },
  {
    id: "l2_02",
    gradeLevel: 2,
    category: "SQL_EMBARQUE",
    title: "2.2 Variables Système d'Audit (sqlca & SQLCODE)",
    summary: "Interprétez les codes de diagnostic approfondis retournés par le moteur SGBD.",
    keyConcepts: ["sqlca.sqlcode", "sqlca.sqlerrd[2]", "sqlca.sqlerrm", "WHENEVER ERROR"],
    detailedContent: `La structure globale 'sqlca' (SQL Communications Area) contient les informations exhaustives sur le dernier ordre SQL exécuté :
- sqlca.sqlcode : équivalent à 'status' (0 = OK, >0 = Avertissement/NotFound, <0 = Erreur fatale).
- sqlca.sqlerrd[2] : nombre de lignes insérées, modifiées ou supprimées par le dernier ordre INSERT/UPDATE/DELETE.
- sqlca.sqlerrd[1] : numéro d'erreur ISAM sous-jacent (précieux pour diagnostiquer une corruption d'index ou un disque plein).`,
    codeSample: `FUNCTION mettre_a_jour_decouvert(p_ncp, p_nouveau_plafond)
    DEFINE p_ncp CHAR(11),
           p_nouveau_plafond DECIMAL(19,4),
           l_lignes_modifiees INTEGER

    UPDATE bkcpt
       SET deb = p_nouveau_plafond
     WHERE ncp = p_ncp
       AND eta = "A"

    LET l_lignes_modifiees = sqlca.sqlerrd[2]

    IF status < 0 THEN
        DISPLAY "Échec de l'UPDATE. Code SQL : ", sqlca.sqlcode
        DISPLAY "Erreur ISAM moteur : ", sqlca.sqlerrd[1]
        RETURN FALSE
    END IF

    IF l_lignes_modifiees = 0 THEN
        DISPLAY "Aucun compte actif modifié (compte peut-être clôturé ou bloqué)."
        RETURN FALSE
    END IF

    DISPLAY "Succès : Plafond mis à jour sur ", l_lignes_modifiees, " compte."
    RETURN TRUE
END FUNCTION`,
    explanation: "sqlca.sqlerrd[2] confirme que la ligne a effectivement été mise à jour en base de données.",
    goldenRules: [
      "Consulter sqlca.sqlerrd[2] après un UPDATE pour s'assurer qu'il a bien ciblé la ligne visée.",
      "Consigner sqlca.sqlerrd[1] dans les logs de production pour faciliter l'analyse par les DBA."
    ],
    pitfallsToAvoid: [
      "Un UPDATE qui ne trouve aucune ligne ne met PAS status à NOTFOUND, il positionne status = 0 avec sqlca.sqlerrd[2] = 0."
    ]
  },

  // NIVEAU 3
  {
    id: "l3_01",
    gradeLevel: 3,
    category: "CURSEURS",
    title: "3.1 Curseurs Séquentiels FOREACH & Mode DIRTY READ",
    summary: "Traitez des millions d'écritures sans verrouiller la base de données en exploitation.",
    keyConcepts: ["DECLARE c_cur CURSOR FOR", "FOREACH ... INTO", "SET ISOLATION TO DIRTY READ"],
    detailedContent: `Lorsqu'une requête renvoie un jeu de plusieurs lignes (par exemple tous les mouvements de la journée dans BKTRA), on ne peut pas utiliser un simple SELECT INTO.
On déclare un curseur séquentiel. La boucle 'FOREACH c_cur INTO structure.*' gère automatiquement les étapes OPEN, FETCH itératif et CLOSE du curseur.

Pour les extractions et éditions de fin de journée, le positionnement de 'SET ISOLATION TO DIRTY READ' indique au moteur Informix de ne poser aucun verrou partagé et de ne pas attendre la levée des verrous des transactions concurrentes.`,
    codeSample: `FUNCTION extraire_journal_compensations(p_dco)
    DEFINE p_dco DATE,
           l_rec RECORD LIKE bktra.*,
           l_total_debit  DECIMAL(19,4),
           l_total_credit DECIMAL(19,4),
           l_count INTEGER

    SET ISOLATION TO DIRTY READ

    DECLARE c_tra CURSOR FOR
        SELECT * FROM bktra
         WHERE dco = p_dco
           AND ope IN ("MNT", "VIR", "CHQ")
         ORDER BY dco, eve

    LET l_total_debit = 0
    LET l_total_credit = 0
    LET l_count = 0

    FOREACH c_tra INTO l_rec.*
        LET l_count = l_count + 1
        IF l_rec.sen = "D" THEN
            LET l_total_debit = l_total_debit + l_rec.mon
        ELSE
            LET l_total_credit = l_total_credit + l_rec.mon
        END IF
    END FOREACH

    DISPLAY "Total Mouvements traités : ", l_count
    DISPLAY "Cumul Débit  : ", l_total_debit USING "###,###,##&.&&"
    DISPLAY "Cumul Crédit : ", l_total_credit USING "###,###,##&.&&"
END FUNCTION`,
    explanation: "Le curseur parcourt tous les flux de compensation en mode lecture sale pour un débit maximal sans verrou.",
    goldenRules: [
      "Toujours trier sur des colonnes indexées dans la clause ORDER BY d'un curseur.",
      "Revenir à l'isolation par défaut (COMMITTED READ) une fois les gros états terminés."
    ],
    pitfallsToAvoid: [
      "Ne jamais modifier des données dans la table cible pendant qu'un curseur non verrouillé la parcourt, sous peine de lire deux fois la même ligne déplacée."
    ]
  },
  {
    id: "l3_02",
    gradeLevel: 3,
    category: "IHM_FORMULAIRES",
    title: "3.2 Formulaires Écrans Guichet (.per) & Événements INPUT",
    summary: "Créez des masques de saisie agences sécurisés avec contrôle de validité immédiat.",
    keyConcepts: ["OPEN FORM", "INPUT BY NAME", "BEFORE/AFTER FIELD", "ON KEY(F1...F12)"],
    detailedContent: `Les interfaces guichet et agences d'Amplitude reposent sur des fichiers de formulaires textuels compilés (.per -> .frm).
L'instruction 'INPUT BY NAME' transfère automatiquement les données saisies sur l'écran vers les variables mémoire de même nom.
Les sections 'AFTER FIELD' permettent d'intercepter la validation de chaque zone pour appliquer les contrôles de conformité bancaire (vérification de signature, solde, validité de la pièce d'identité) avant même que l'utilisateur ne valide le formulaire entier.`,
    codeSample: `FUNCTION saisie_remise_cheque()
    DEFINE l_ncp CHAR(11),
           l_num_chq CHAR(10),
           l_montant DECIMAL(19,4),
           l_valide SMALLINT

    OPEN FORM f_chq FROM "rem_cheque"
    DISPLAY FORM f_chq

    INPUT BY NAME l_ncp, l_num_chq, l_montant
        BEFORE FIELD l_montant
            MESSAGE "Saisie du montant nominal en monnaie légale"

        AFTER FIELD l_ncp
            -- Contrôle d'existence et blocage éventuel
            SELECT count(*) INTO l_valide 
              FROM bkcpt 
             WHERE ncp = l_ncp AND eta = "A"

            IF l_valide = 0 THEN
                ERROR "Compte introuvable ou sous opposition judiciaire !"
                NEXT FIELD l_ncp
            END IF

        ON KEY (F8)
            CALL consulter_derniers_mouvements(l_ncp)

        ON KEY (INTERRUPT)
            MESSAGE "Opération annulée par le guichetier."
            EXIT INPUT
    END INPUT

    CLOSE FORM f_chq
END FUNCTION`,
    explanation: "NEXT FIELD renvoie le focus sur le champ en cas d'erreur sans quitter le masque de saisie.",
    goldenRules: [
      "Utiliser ERROR pour les alertes bloquantes et MESSAGE pour les aides à la saisie.",
      "Gérer systématiquement la touche INTERRUPT (Échap / Ctrl+C) pour libérer les masques proprement."
    ],
    pitfallsToAvoid: [
      "Ne jamais exécuter de requêtes lentes dans un BEFORE FIELD : cela fige le curseur de l'opérateur de saisie."
    ]
  },

  // NIVEAU 4
  {
    id: "l4_01",
    gradeLevel: 4,
    category: "TRANSACTIONS",
    title: "4.1 Atomicité Bancaire, Partie Double & Gestion des Locks",
    summary: "Garantissez l'équilibre parfait Débit/Crédit et gérez les rollbacks sans faille.",
    keyConcepts: ["BEGIN WORK", "COMMIT WORK", "ROLLBACK WORK", "Partie Double", "Deadlock -244"],
    detailedContent: `Dans une banque, une transaction n'est jamais unitaire : elle est nécessairement bilatérale (débit d'un compte émetteur, crédit d'un compte récepteur, et éventuellement débit d'une commission et crédit d'une taxe).
Toutes ces écritures doivent réussir ensemble ou être annulées intégralement : c'est le principe d'Atomicité (ACID).
Le bloc 'BEGIN WORK ... COMMIT WORK' forme une frontière transactionnelle. Si le serveur plante ou si un composant échoue, le 'ROLLBACK WORK' restitue les soldes exactement à leur état initial.`,
    codeSample: `FUNCTION virement_compte_a_compte(p_age, p_src, p_dst, p_montant)
    DEFINE p_age CHAR(5),
           p_src, p_dst CHAR(11),
           p_montant DECIMAL(19,4),
           l_solde_src DECIMAL(19,4)

    WHENEVER ERROR CONTINUE
    BEGIN WORK

    -- 1. Verrouiller et vérifier la provision du compte source
    SELECT sol - sind + NVL(deb, 0) INTO l_solde_src
      FROM bkcpt
     WHERE age = p_age AND ncp = p_src
       FOR UPDATE

    IF l_solde_src < p_montant THEN
        ROLLBACK WORK
        CALL log_rejet(p_src, "PROVISION_INSUFFISANTE")
        RETURN -1
    END IF

    -- 2. Débit du compte source
    UPDATE bkcpt SET sol = sol - p_montant WHERE age = p_age AND ncp = p_src
    IF status != 0 THEN ROLLBACK WORK RETURN -2 END IF

    -- 3. Crédit du compte récepteur
    UPDATE bkcpt SET sol = sol + p_montant WHERE age = p_age AND ncp = p_dst
    IF status != 0 THEN ROLLBACK WORK RETURN -3 END IF

    -- 4. Écritures dans le journal comptable
    INSERT INTO bktra VALUES (p_age, TODAY, TODAY, "VIR", p_src, p_montant, "D", "VIREMENT EMIS", "AUTO")
    IF status != 0 THEN ROLLBACK WORK RETURN -4 END IF

    INSERT INTO bktra VALUES (p_age, TODAY, TODAY, "VIR", p_dst, p_montant, "C", "VIREMENT RECU", "AUTO")
    IF status != 0 THEN ROLLBACK WORK RETURN -5 END IF

    COMMIT WORK
    WHENEVER ERROR STOP
    RETURN 0
END FUNCTION`,
    explanation: "La clause FOR UPDATE pose un verrou exclusif sur la ligne du compte pendant la transaction pour empêcher qu'un retrait DAB simultané ne double-dépense les fonds.",
    goldenRules: [
      "Toujours encadrer les mouvements financiers d'un BEGIN WORK / COMMIT WORK.",
      "Tester le statut après CHAQUE écriture et déclencher immédiatement ROLLBACK WORK au moindre accroc."
    ],
    pitfallsToAvoid: [
      "Ne jamais poser de verrous dans un ordre aléatoire (ex: Compte A puis Compte B dans un script, et Compte B puis Compte A dans un autre) : cela génère des interblocages mortels (deadlocks)."
    ]
  },

  // NIVEAU 5
  {
    id: "l5_01",
    gradeLevel: 5,
    category: "OPTIMISATION_EOD",
    title: "5.1 Architecture Haute Performance Batch EOD (INSERT CURSOR)",
    summary: "Passez de 200 lignes/seconde à plus de 10 000 lignes/seconde pour les arrêtés de nuit.",
    keyConcepts: ["INSERT CURSOR", "PUT", "FLUSH", "Chunking de transaction", "PREPARE / EXECUTE"],
    detailedContent: `Lors du batch de clôture journalière EOD (End of Day), Amplitude doit traiter des millions d'écritures comptables en un temps record pour respecter le cut-off agences de 07h00.
L'instruction unitaire 'INSERT INTO' est trop lente car chaque requête effectue un aller-retour réseau complet (Round-trip) et écrit un bloc journal.

L'utilisation d'un 'INSERT CURSOR' associé à l'instruction 'PUT' permet d'accumuler les données dans un tampon mémoire local côté client 4GL. Dès que le tampon atteint 4 Ko ou 8 Ko, le moteur envoie un paquet réseau unique au moteur de base de données.
Couplé à un COMMIT WORK par tranche de 1 000 lignes (chunking), cette technique supprime les engorgements de logs sans saturer la mémoire scratch.`,
    codeSample: `FUNCTION batch_arrete_interets_masse()
    DEFINE l_rec RECORD LIKE bktra.*,
           l_nb_lus, l_nb_traites INTEGER

    PREPARE stmt_ins FROM 
        "INSERT INTO bktra (age, dco, dval, ope, ncp, mon, sen, lib, uti) " ||
        "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)"

    DECLARE c_ins_rapide INSERT CURSOR FOR stmt_ins

    OPEN c_ins_rapide
    BEGIN WORK

    LET l_nb_lus = 0
    LET l_nb_traites = 0

    -- Parcours des calculs préparés
    FOREACH c_calculs INTO l_rec.*
        LET l_nb_lus = l_nb_lus + 1

        PUT c_ins_rapide FROM l_rec.*
        LET l_nb_traites = l_nb_traites + 1

        -- Validation par lots de 1000 pour libérer les logs Informix
        IF (l_nb_traites MOD 1000) = 0 THEN
            FLUSH c_ins_rapide
            COMMIT WORK
            BEGIN WORK
        END IF
    END FOREACH

    -- TRÈS IMPORTANT : Vider les dernières lignes restantes dans le buffer
    FLUSH c_ins_rapide
    COMMIT WORK

    CLOSE c_ins_rapide
    DISPLAY "Fin du batch EOD : ", l_nb_traites, " écritures injectées avec succès."
END FUNCTION`,
    explanation: "Le couplage de PREPARE, INSERT CURSOR, PUT, FLUSH et du découpage de commit garantit les meilleures performances d'exploitation.",
    goldenRules: [
      "Toujours invoquer FLUSH avant de faire un COMMIT WORK ou avant CLOSE CURSOR.",
      "Ne pas dépasser 2 000 lignes par bloc de commit pour éviter l'erreur Informix -454 (Long transaction aborted)."
    ],
    pitfallsToAvoid: [
      "Oublier le FLUSH final avant de fermer le programme : les 200 à 400 dernières lignes restant dans le buffer réseau ne seront jamais enregistrées en base !"
    ]
  },
  ...CBS_4GL_EXTENDED_LESSONS,
];

// ----------------------------------------------------
// 3. BANQUES DE QUESTIONS D'EXAMEN DE PASSAGE DE GRADE
// ----------------------------------------------------
export const CBS_4GL_EXAMS: Cbs4GlExamQuestion[] = [
  // EXAMEN NIVEAU 1 -> 2
  {
    id: "ex_n1_01",
    gradeLevel: 1,
    question: "Quelle est la clause obligatoire en tête de chaque programme Informix 4GL pour spécifier la base de données ?",
    options: ["USE amplitude", "DATABASE amplitude", "CONNECT TO amplitude", "SET DATABASE amplitude"],
    correctIndex: 1,
    explanation: "La syntaxe 4GL requiert la clause DATABASE <nom_base> au tout début du fichier source.",
    trapWarning: "USE est utilisé en MySQL, pas en 4GL."
  },
  {
    id: "ex_n1_02",
    gradeLevel: 1,
    question: "Pourquoi est-il formellement interdit d'utiliser les types FLOAT ou SMALLFLOAT pour stocker des montants bancaires en 4GL ?",
    options: [
      "Ils consomment trop de mémoire vive",
      "Leur représentation binaire entraîne des erreurs d'arrondi sur les centimes",
      "Le SGBD Informix ne les supporte pas dans la clause SELECT",
      "Les compilateurs c4gl refusent de compiler ces types"
    ],
    correctIndex: 1,
    explanation: "Les nombres à virgule flottante ne peuvent pas représenter exactement certaines fractions décimales, provoquant des écarts au centime interdits en banque. On utilise DECIMAL(p,s).",
    trapWarning: "Les calculs financiers exigent une arithmétique décimale exacte."
  },
  {
    id: "ex_n1_03",
    gradeLevel: 1,
    question: "En 4GL, quel est le résultat de l'évaluation de l'expression : LET x = 100 + NULL ?",
    options: ["x vaut 100", "x vaut 0", "x vaut NULL", "Le compilateur lève une exception arithmétique"],
    correctIndex: 2,
    explanation: "En 4GL comme en SQL standard, toute opération avec la valeur NULL produit NULL. D'où la nécessité d'utiliser la fonction NVL().",
    trapWarning: "Ne confondez pas avec d'autres langages où NULL est casté en 0."
  },

  // EXAMEN NIVEAU 2 -> 3
  {
    id: "ex_n2_01",
    gradeLevel: 2,
    question: "Quelle valeur prend la variable système 'status' lorsqu'une requête 'SELECT ... INTO' ne trouve aucun enregistrement dans la base ?",
    options: ["status = 0", "status = NOTFOUND (code 100)", "status = -1", "status = -284"],
    correctIndex: 1,
    explanation: "Le runtime positionne status à la constante NOTFOUND (100) en cas d'absence de ligne.",
    trapWarning: "0 signifie succès, -284 signifie que la sous-requête a renvoyé plus d'une ligne."
  },
  {
    id: "ex_n2_02",
    gradeLevel: 2,
    question: "Comment obtenir avec certitude le nombre de lignes modifiées par le dernier ordre 'UPDATE bkcpt' ?",
    options: [
      "En lisant la variable sqlca.sqlerrd[2]",
      "En vérifiant la valeur de status",
      "En effectuant un COUNT(*) immédiat après l'UPDATE",
      "La valeur est stockée dans sqlca.sqlcode"
    ],
    correctIndex: 0,
    explanation: "sqlca.sqlerrd[2] contient le décompte exact des lignes affectées par le dernier ordre DML.",
    trapWarning: "status vaut 0 même si 0 ligne n'a été modifiée par l'UPDATE."
  },
  {
    id: "ex_n2_03",
    gradeLevel: 2,
    question: "Quel est l'avantage décisif de déclarer une variable avec 'RECORD LIKE bkcpt.*' ?",
    options: [
      "Elle crypte automatiquement les données en mémoire vive",
      "Elle hérite de la structure exacte des colonnes et s'adapte sans modifier le code en cas d'évolution du schéma",
      "Elle verrouille automatiquement la table en mode exclusif",
      "Elle empêche la saisie de valeurs négatives"
    ],
    correctIndex: 1,
    explanation: "La directive LIKE permet une synchronisation transparente avec le dictionnaire de tables du CBS.",
    trapWarning: "Elle ne pose aucun verrou : c'est uniquement une définition de structure en mémoire."
  },

  // EXAMEN NIVEAU 3 -> 4
  {
    id: "ex_n3_01",
    gradeLevel: 3,
    question: "À quoi sert l'instruction 'SET ISOLATION TO DIRTY READ' dans un traitement d'extraction de fin de journée ?",
    options: [
      "À supprimer les index temporaires pour aller plus vite",
      "À lire les données sans poser de verrous et sans attendre la libération des verrous concurrents",
      "À forcer l'écriture immédiate des transactions sur le disque dur",
      "À réparer les blocs de données corrompus sur le tablespace"
    ],
    correctIndex: 1,
    explanation: "DIRTY READ permet aux états de lecture massive de s'exécuter sans gêner ni être gênés par les transactions d'agences.",
    trapWarning: "DIRTY READ ne doit pas être utilisé pour des écritures comptables, uniquement pour la lecture."
  },
  {
    id: "ex_n3_02",
    gradeLevel: 3,
    question: "Dans un masque écran 4GL (formulaire .per), quand le bloc d'instructions 'AFTER FIELD montant' est-il déclenché ?",
    options: [
      "Uniquement lorsque le formulaire entier est validé par l'opérateur",
      "Dès que le curseur de saisie quitte le champ 'montant' pour passer au suivant",
      "Avant même que l'utilisateur ne commence à taper",
      "Uniquement si l'utilisateur appuie sur la touche Échap"
    ],
    correctIndex: 1,
    explanation: "AFTER FIELD est un trigger événementiel exécuté à la sortie du champ, idéal pour valider les montants et plafonds.",
    trapWarning: "BEFORE FIELD est déclenché avant l'entrée dans le champ."
  },

  // EXAMEN NIVEAU 4 -> 5
  {
    id: "ex_n4_01",
    gradeLevel: 4,
    question: "Pourquoi est-il proscrit d'inclure une saisie utilisateur (PROMPT ou INPUT) au sein d'un bloc BEGIN WORK / COMMIT ?",
    options: [
      "Le système 4GL génère une erreur de syntaxe",
      "Les verrous exclusifs restent actifs tant que l'utilisateur n'a pas validé, risquant de paralyser la banque entière",
      "La base de données désactive la table journal des logs",
      "La session se déconnecte automatiquement au bout de 3 secondes"
    ],
    correctIndex: 1,
    explanation: "Une transaction bancaire doit s'exécuter en quelques millisecondes. Attendre une action humaine maintient les locks et provoque des deadlocks.",
    trapWarning: "Les verrous en base sont libérés uniquement au COMMIT ou ROLLBACK."
  },
  {
    id: "ex_n4_02",
    gradeLevel: 4,
    question: "Comment éviter de provoquer un interblocage (Deadlock / -244) entre deux processus qui mettent à jour simultanément deux comptes bancaires A et B ?",
    options: [
      "En augmentant la vitesse du processeur du serveur AIX",
      "En imposant un ordre de verrouillage strict et uniforme (ex: toujours trier les comptes par ordre croissant de numéro de compte)",
      "En utilisant uniquement des connexions non sécurisées",
      "En désactivant le fichier de log transactionnel"
    ],
    correctIndex: 1,
    explanation: "Si deux transactions accèdent toujours aux ressources dans le même ordre séquentiel, une situation de blocage croisé est mathématiquement impossible.",
    trapWarning: "La vitesse du processeur ne résout pas les blocages de concurrence logique."
  },

  // EXAMEN NIVEAU 5 -> CERTIFICATION EXPERT
  {
    id: "ex_n5_01",
    gradeLevel: 5,
    question: "Lors de l'utilisation d'un 'INSERT CURSOR' haute performance avec 'PUT', que se passe-t-il si le programmeur omet d'appeler 'FLUSH' avant le COMMIT final ?",
    options: [
      "Le compilateur 4GL déclenche une erreur à l'exécution",
      "Toutes les lignes de la table sont automatiquement effacées",
      "Les dernières lignes accumulées dans le tampon mémoire réseau sont perdues sans aucun message d'alerte",
      "Le SGBD effectue une sauvegarde complète automatique"
    ],
    correctIndex: 2,
    explanation: "PUT écrit dans un buffer local. Tant que le buffer n'est pas plein, rien n'est envoyé à la base. Sans FLUSH, la fin du lot est perdue.",
    trapWarning: "C'est l'un des bugs les plus redoutables et discrets en exploitation bancaire !"
  },
  {
    id: "ex_n5_02",
    gradeLevel: 5,
    question: "Pourquoi est-il recommandé de découper les batchs volumineux de fin de journée en tranches de commit (chunking de 1 000 lignes) ?",
    options: [
      "Pour éviter de saturer les Logical Logs Informix (erreur -454 Long Transaction Aborted) et réduire le temps de reprise sur panne",
      "Parce que le 4GL ne sait pas compter au-delà de 1 000",
      "Pour permettre aux agences d'ouvrir plus tôt",
      "Pour réinitialiser l'horloge système du serveur"
    ],
    correctIndex: 0,
    explanation: "Une transaction trop longue sature l'espace des logs de transaction du SGBD et force le moteur à un rollback complet très coûteux.",
    trapWarning: "Les journaux logiques sont en espace disque limité."
  }
];
