import { Cbs4GlLesson } from "./cbs-4gl-data";

export const CBS_4GL_EXTENDED_LESSONS: Cbs4GlLesson[] = [
  // --- NIVEAU 1 : APPRENTI DÉVELOPPEUR 4GL ---
  {
    id: "l1_03",
    gradeLevel: 1,
    category: "SYNTAXE",
    title: "1.3 Structures Conditionnelles Bancaires (IF, CASE & NULL)",
    summary: "Prenez des décisions métier rigoureuses : validation de profil client et contrôles d'éligibilité.",
    keyConcepts: ["IF ... THEN ... ELSE", "CASE ... WHEN", "IS NULL / IS NOT NULL", "MATCHES", "LIKE"],
    detailedContent: `Dans les applications financières, les structures de branchement conditionnel doivent être strictement exhaustives.
L'instruction CASE est particulièrement recommandée par rapport aux suites imbriquées de IF car elle oblige le développeur à prévoir la clause 'OTHERWISE', garantissant qu'aucun cas imprévu (ex: code devise inconnu) ne traverse le code sans traitement d'erreur.

Le 4GL supporte l'opérateur 'MATCHES' pour la comparaison avec motifs réguliers :
- '*' remplace n'importe quelle chaîne de caractères.
- '?' remplace un seul caractère.
- '[0-9]' filtre sur une plage de chiffres.`,
    codeSample: `FUNCTION determiner_profil_frais(p_segment, p_nationalite)
    DEFINE p_segment CHAR(3),
           p_nationalite CHAR(3),
           l_taux_remise DECIMAL(5,2)

    -- Utilisation de CASE pour un routage sans faille
    CASE
        WHEN p_segment = "VIP" OR p_segment = "COR"
            LET l_taux_remise = 50.00
        WHEN p_segment = "ENT"
            LET l_taux_remise = 25.00
        WHEN p_segment = "PAR" AND p_nationalite = "SEN"
            LET l_taux_remise = 10.00
        WHEN p_segment IS NULL
            CALL journaliser_incident("SEGMENT_CLIENT_NULL")
            LET l_taux_remise = 0.00
        OTHERWISE
            LET l_taux_remise = 0.00
    END CASE

    RETURN l_taux_remise
END FUNCTION`,
    explanation: "La clause OTHERWISE capture tous les segments inconnus et évite les décisions bancaires non régies.",
    goldenRules: [
      "Toujours inclure la branche OTHERWISE dans chaque instruction CASE.",
      "Prêter attention aux espaces de fin dans les champs CHAR fixes : 'VIP ' n'est pas égal à 'VIP'."
    ],
    pitfallsToAvoid: [
      "Tester 'IF variable = NULL' est une erreur classique : en SQL/4GL, l'égalité avec NULL n'est jamais vraie. Il faut impérativement écrire 'IF variable IS NULL'."
    ]
  },
  {
    id: "l1_04",
    gradeLevel: 1,
    category: "SYNTAXE",
    title: "1.4 Boucles Itératives & Contrôle de Flux (WHILE, FOR)",
    summary: "Itérez de manière sûre sur des listes et tableaux d'échéances sans boucle infinie.",
    keyConcepts: ["FOR i = 1 TO N", "WHILE ... END WHILE", "EXIT FOR / EXIT WHILE", "CONTINUE FOR"],
    detailedContent: `Le 4GL propose deux types de boucles :
1. La boucle 'FOR' avec compteur à pas déterminé (STEP facultatif, par défaut +1). Elle est idéale pour parcourir des tableaux en mémoire (ARRAY) ou des simulations d'échéanciers de crédit.
2. La boucle 'WHILE' qui continue tant qu'une condition logique est vérifiée. Elle requiert une condition d'arrêt explicite ou un garde-fou (compteur maximum) pour empêcher toute boucle infinie susceptible de saturer un cœur de processeur AIX à 100%.`,
    codeSample: `FUNCTION simuler_echeancier_pret(p_capital, p_taux_mensuel, p_nb_mois)
    DEFINE p_capital DECIMAL(19,4),
           p_taux_mensuel DECIMAL(7,4),
           p_nb_mois SMALLINT,
           i SMALLINT,
           l_part_interet DECIMAL(19,4),
           l_part_capital DECIMAL(19,4),
           l_capital_restant DECIMAL(19,4)

    LET l_capital_restant = p_capital
    DISPLAY "--- ÉCHÉANCIER PRÉVISIONNEL DU CRÉDIT ---"

    FOR i = 1 TO p_nb_mois
        LET l_part_interet = l_capital_restant * p_taux_mensuel
        LET l_part_capital = (p_capital / p_nb_mois)
        LET l_capital_restant = l_capital_restant - l_part_capital

        -- Affichage sécurisé de chaque mensualité
        DISPLAY "Mois ", i USING "##&", 
                " | Amortissement : ", l_part_capital USING "##,###,##&.&&",
                " | Intérêts : ", l_part_interet USING "##,###,##&.&&",
                " | Restant Dû : ", l_capital_restant USING "##,###,##&.&&"
    END FOR
END FUNCTION`,
    explanation: "La boucle FOR assure un parcours borné et déterministe correspondant exactement au nombre de mensualités demandées.",
    goldenRules: [
      "Dans une boucle WHILE, toujours implémenter un compteur de sécurité (timeout) pour éviter le blocage de l'exécutable.",
      "Ne jamais modifier la variable d'indice à l'intérieur du corps d'une boucle FOR."
    ],
    pitfallsToAvoid: [
      "Utiliser une boucle WHILE attendant une modification de base par un autre utilisateur sans 'SLEEP' fait exploser la charge CPU du serveur."
    ]
  },

  // --- NIVEAU 2 : DÉVELOPPEUR JUNIOR 4GL ---
  {
    id: "l2_03",
    gradeLevel: 2,
    category: "SQL_EMBARQUE",
    title: "2.3 Jointures Bancaires Complexes & Multi-Tables",
    summary: "Reliez en une seule requête le client (BKCLI), son compte (BKCPT) et son agence (BKAGE).",
    keyConcepts: ["SELECT ... JOIN", "OUTER JOIN", "ALIAS", "ROWNUM / FIRST N"],
    detailedContent: `Dans le Core Banking, l'information d'un client est distribuée entre plusieurs tables :
- BKCLI contient les coordonnées et le statut KYC du tiers.
- BKCPT contient les comptes et soldes comptables.
- BKAGE contient les informations physiques de l'agence de rattachement.

Le SQL 4GL permet de réaliser des jointures directes vers des variables scalaires ou des enregistrements structurés.
L'utilisation de la syntaxe Informix 'OUTER table' ou du mot-clé standard 'LEFT JOIN' permet de ramener les clients même s'ils ne disposent pas d'autorisation de découvert formelle dans BKAUT.`,
    codeSample: `FUNCTION consulter_dossier_complet(p_ncp)
    DEFINE p_ncp CHAR(11),
           l_nom CHAR(45),
           l_solde DECIMAL(19,4),
           l_nom_agence CHAR(35),
           l_plafond_deb DECIMAL(19,4)

    SELECT c.nom, a.sol, g.lib, NVL(u.mnt, 0)
      INTO l_nom, l_solde, l_nom_agence, l_plafond_deb
      FROM bkcpt a
      JOIN bkcli c ON a.cli = c.cli
      JOIN bkage g ON a.age = g.age
      LEFT JOIN bkaut u ON a.ncp = u.ncp AND a.age = u.age AND u.fin >= TODAY
     WHERE a.ncp = p_ncp

    IF status = NOTFOUND THEN
        DISPLAY "Compte ou informations client introuvables."
        RETURN FALSE
    END IF

    DISPLAY "Titulaire   : ", l_nom
    DISPLAY "Agence      : ", l_nom_agence
    DISPLAY "Solde       : ", l_solde USING "---,---,---,##&.&&"
    DISPLAY "Découvert   : ", l_plafond_deb USING "---,---,---,##&.&&"
    RETURN TRUE
END FUNCTION`,
    explanation: "La jointure externe (LEFT JOIN) assure la récupération des données du compte même en l'absence d'autorisation de découvert.",
    goldenRules: [
      "Toujours utiliser des alias de table (a, c, g) courts et explicites pour la lisibilité.",
      "Vérifier que toutes les colonnes de jointure (ON) s'appuient sur des clés primaires ou indexées."
    ],
    pitfallsToAvoid: [
      "Oublier une condition de jointure produit un produit cartésien qui fige la base de données et génère des millions de lignes inutiles."
    ]
  },
  {
    id: "l2_04",
    gradeLevel: 2,
    category: "SQL_EMBARQUE",
    title: "2.4 Gestion Avancée des Exceptions & Traitement des Erreurs SGBD",
    summary: "Protégez vos programmes contre les crashs brutaux avec WHENEVER ERROR.",
    keyConcepts: ["WHENEVER ERROR STOP", "WHENEVER ERROR CONTINUE", "WHENEVER ERROR CALL", "sqlca.sqlcode"],
    detailedContent: `Par défaut, toute erreur SQL critique (< 0) stoppe immédiatement l'exécution du programme 4GL avec un message système brutal : c'est le comportement de 'WHENEVER ERROR STOP'.
Dans un environnement de production bancaire, ce comportement est proscrit pour les batchs critiques et les écrans guichet.
On utilise :
- 'WHENEVER ERROR CONTINUE' : désactive l'arrêt automatique et permet au développeur de tester manuellement 'status' ou 'sqlca.sqlcode'.
- 'WHENEVER ERROR CALL routine_alerte' : délègue la capture de l'incident à une procédure centrale de logging et de notification d'astreinte.`,
    codeSample: `FUNCTION transferer_provision_securisee(p_src, p_dst, p_montant)
    DEFINE p_src, p_dst CHAR(11),
           p_montant DECIMAL(19,4)

    -- Dérivation des erreurs vers le gestionnaire applicatif
    WHENEVER ERROR CONTINUE

    UPDATE bkcpt
       SET sol = sol - p_montant
     WHERE ncp = p_src

    IF sqlca.sqlcode < 0 THEN
        CALL alerte_dba_production("UPDATE_SRC_FAILED", sqlca.sqlcode, sqlca.sqlerrd[1])
        RETURN FALSE
    END IF

    UPDATE bkcpt
       SET sol = sol + p_montant
     WHERE ncp = p_dst

    IF sqlca.sqlcode < 0 THEN
        CALL alerte_dba_production("UPDATE_DST_FAILED", sqlca.sqlcode, sqlca.sqlerrd[1])
        RETURN FALSE
    END IF

    -- Rétablir le comportement standard en fin de routine
    WHENEVER ERROR STOP
    RETURN TRUE
END FUNCTION`,
    explanation: "WHENEVER ERROR CONTINUE permet d'intercepter les erreurs SQL à chaud sans planter le processus.",
    goldenRules: [
      "Toujours rétablir WHENEVER ERROR STOP après un bloc critique pour ne pas masquer involontairement des bugs ultérieurs.",
      "Enregistrer systématiquement le code SQL (sqlca.sqlcode) et le code ISAM (sqlca.sqlerrd[1]) dans le journal d'audit BKAUD."
    ],
    pitfallsToAvoid: [
      "Laisser WHENEVER ERROR CONTINUE actif sur tout le fichier : les erreurs SQL passeront inaperçues et propageront des données corrompues."
    ]
  },

  // --- NIVEAU 3 : DÉVELOPPEUR CONFIRMÉ 4GL ---
  {
    id: "l3_03",
    gradeLevel: 3,
    category: "CURSEURS",
    title: "3.3 Curseurs de Mise à Jour Ligne (FOR UPDATE & WHERE CURRENT OF)",
    summary: "Modifiez de manière fiable les lignes au fur et à mesure du parcours du curseur.",
    keyConcepts: ["DECLARE ... FOR UPDATE", "WHERE CURRENT OF", "Verrouillage ligne", "Pointeur curseur"],
    detailedContent: `Dans un batch de calcul d'agios ou de prélèvement d'échéances de crédit, le programme doit lire une ligne, valider son solde, et la mettre à jour immédiatement.
La clause 'FOR UPDATE' posée lors de la déclaration du curseur réserve chaque ligne lors de son FETCH.
L'instruction 'WHERE CURRENT OF nom_curseur' permet d'exécuter un UPDATE ou DELETE ciblé directement sur la ligne en cours de traitement, sans avoir besoin de réexécuter une recherche sur la clé primaire.`,
    codeSample: `FUNCTION imputer_frais_tenue_comptes(p_age, p_frais)
    DEFINE p_age CHAR(5),
           p_frais DECIMAL(19,4),
           l_cpt RECORD LIKE bkcpt.*

    -- Déclaration d'un curseur avec réservation de mise à jour
    DECLARE c_comptes_actifs CURSOR FOR
        SELECT * FROM bkcpt
         WHERE age = p_age
           AND eta = "A"
           AND sol > p_frais
           FOR UPDATE OF sol, sind

    OPEN c_comptes_actifs

    WHILE TRUE
        FETCH c_comptes_actifs INTO l_cpt.*
        IF status = NOTFOUND THEN
            EXIT WHILE
        END IF

        -- Débit direct de la ligne sous le curseur
        UPDATE bkcpt
           SET sol = sol - p_frais
         WHERE CURRENT OF c_comptes_actifs

        IF status != 0 THEN
            CALL journaliser_incident("ECHEC_DEBIT_CURRENT_OF")
        END IF
    END WHILE

    CLOSE c_comptes_actifs
END FUNCTION`,
    explanation: "WHERE CURRENT OF garantit que la mise à jour s'applique exactement sur la ligne sur laquelle se trouve le pointeur du curseur.",
    goldenRules: [
      "Toujours nommer explicitement les colonnes impactées dans 'FOR UPDATE OF col1, col2'.",
      "Fermer impérativement le curseur avec CLOSE dès que la boucle se termine."
    ],
    pitfallsToAvoid: [
      "Utiliser 'WHERE CURRENT OF' en dehors de la boucle ou après que le curseur a rencontré NOTFOUND provoque l'erreur -263."
    ]
  },
  {
    id: "l3_04",
    gradeLevel: 3,
    category: "IHM_FORMULAIRES",
    title: "3.4 Tableaux Écrans Défilants & Menus Interactifs (DISPLAY ARRAY)",
    summary: "Affichez et faites défiler des listes de comptes et de transactions bancaires sur terminal VT100/SSH.",
    keyConcepts: ["DISPLAY ARRAY", "SCROLL", "ON KEY", "ARR_CURR()", "SCR_LINE()"],
    detailedContent: `Pour les guichetiers et agents de conformité, Amplitude utilise des écrans textuels intégrant des listes défilantes (tableaux de 10 à 20 lignes avec barres de défilement).
L'instruction 'DISPLAY ARRAY tableau_memoire TO tableau_ecran.*' prend en charge la pagination, le défilement haut/bas avec les flèches du clavier et la sélection de ligne avec la touche Entrée.
La fonction système 'ARR_CURR()' renvoie le numéro d'index dans le tableau mémoire correspondant à la ligne actuellement sélectionnée par l'opérateur.`,
    codeSample: `FUNCTION consulter_liste_comptes_tiers(p_cli)
    DEFINE p_cli CHAR(15),
           l_tab ARRAY[50] OF RECORD
               age CHAR(5),
               ncp CHAR(11),
               dev CHAR(3),
               sol DECIMAL(19,4)
           END RECORD,
           i SMALLINT,
           l_choisi SMALLINT

    -- Chargement du tableau mémoire depuis la base
    DECLARE c_cpt_cli CURSOR FOR
        SELECT age, ncp, dev, sol FROM bkcpt WHERE cli = p_cli
    
    LET i = 0
    FOREACH c_cpt_cli INTO l_tab[i+1].*
        LET i = i + 1
        IF i = 50 THEN EXIT FOREACH END IF
    END FOREACH

    OPEN FORM f_lst FROM "lst_comptes"
    DISPLAY FORM f_lst

    -- Affichage de la liste défilante
    DISPLAY ARRAY l_tab TO s_cpt.*
        ON KEY (F2)
            LET l_choisi = ARR_CURR()
            CALL afficher_historique_mouvements(l_tab[l_choisi].ncp)

        ON KEY (INTERRUPT)
            EXIT DISPLAY
    END DISPLAY

    CLOSE FORM f_lst
END FUNCTION`,
    explanation: "ARR_CURR() permet de récupérer instantanément le compte sélectionné par le guichetier pour afficher ses mouvements.",
    goldenRules: [
      "Toujours limiter la taille maximale du tableau (ex: 50 ou 100 lignes) pour ne pas saturer la mémoire du terminal.",
      "Vérifier le nombre réel de lignes chargées avant d'appeler DISPLAY ARRAY."
    ],
    pitfallsToAvoid: [
      "Dépasser la borne maximale de l'ARRAY en 4GL provoque une violation de mémoire (Subscript out of range)."
    ]
  },

  // --- NIVEAU 4 : DÉVELOPPEUR SENIOR 4GL ---
  {
    id: "l4_02",
    gradeLevel: 4,
    category: "TRANSACTIONS",
    title: "4.2 Stratégies Anti-Deadlocks & Niveaux d'Isolation Informix",
    summary: "Éradiquez les erreurs de concurrence -244 et -107 sous forte charge en agences.",
    keyConcepts: ["SET LOCK MODE TO WAIT", "COMMITTED READ", "Ordre canonique de verrouillage", "Deadlock -244"],
    detailedContent: `En production bancaire, des centaines d'agences et de distributeurs automatiques mettent à jour les mêmes tables simultanément.
Par défaut, si une table ou ligne est verrouillée, Informix renvoie immédiatement l'erreur -107 (Record is locked).
Pour éviter cela, on exécute au début de chaque session la commande :
'SET LOCK MODE TO WAIT 15'
Le programme attend alors jusqu'à 15 secondes que la transaction concurrente libère son verrou avant de lever une exception.

Pour éviter les interblocages mortels (Deadlocks / Erreur -244), les développeurs seniors imposent un 'Ordre Canonique' : si une transaction doit impacter deux comptes X et Y, elle doit TOUJOURS verrouiller en premier le compte dont le numéro NCP est le plus petit dans l'ordre alphabétique.`,
    codeSample: `FUNCTION verrouiller_deux_comptes_sans_deadlock(p_cpt1, p_cpt2)
    DEFINE p_cpt1, p_cpt2 CHAR(11),
           l_premier, l_second CHAR(11),
           l_dummy CHAR(1)

    -- Configuration du temps de tolérance aux verrous (attente 20 secondes)
    SET LOCK MODE TO WAIT 20

    -- ORDONNANCEMENT CANONIQUE : Toujours verrouiller dans le même sens
    IF p_cpt1 < p_cpt2 THEN
        LET l_premier = p_cpt1
        LET l_second  = p_cpt2
    ELSE
        LET l_premier = p_cpt2
        LET l_second  = p_cpt1
    END IF

    -- 1. Pose du verrou sur le premier compte
    SELECT "X" INTO l_dummy FROM bkcpt WHERE ncp = l_premier FOR UPDATE
    IF status != 0 THEN RETURN FALSE END IF

    -- 2. Pose du verrou sur le second compte
    SELECT "X" INTO l_dummy FROM bkcpt WHERE ncp = l_second FOR UPDATE
    IF status != 0 THEN RETURN FALSE END IF

    -- À ce stade, aucun interblocage croisé n'est possible
    RETURN TRUE
END FUNCTION`,
    explanation: "Le tri alphabétique des comptes garantit qu'aucun processus concurrent ne pourra tenter de verrouiller ces deux comptes dans l'ordre inverse.",
    goldenRules: [
      "Toujours configurer 'SET LOCK MODE TO WAIT N' en début de session ou de batch.",
      "Trier systématiquement les identifiants de comptes avant de poser des verrous multiples."
    ],
    pitfallsToAvoid: [
      "Utiliser 'SET LOCK MODE TO NOT WAIT' dans des transactions d'écriture : cela engendre des rejets massifs d'opérations guichet en heure de pointe."
    ]
  },
  {
    id: "l4_03",
    gradeLevel: 4,
    category: "TRANSACTIONS",
    title: "4.3 Rapports Comptables Structurés & Édition d'États (REPORT)",
    summary: "Générez les balances réglementaires et journaux d'audit avec sauts de page et totaux.",
    keyConcepts: ["REPORT ... END REPORT", "OUTPUT TO PIPE / FILE", "PAGE HEADER / TRAILER", "GROUP BY", "SUM(col)"],
    detailedContent: `Le 4GL intègre un moteur de reporting natif très puissant.
Un bloc 'REPORT' définit la mise en page d'un document financier :
- PAGE HEADER : en-tête avec logo, date d'arrêté et numéro de page (PAGENO).
- ON EVERY ROW : impression des écritures de débit/crédit.
- BEFORE GROUP / AFTER GROUP : sous-totaux par agence ou par devise.
- ON LAST ROW : totaux généraux de contrôle avec vérification d'équilibre strict.
L'émission des états peut être envoyée directement vers un fichier disque, une imprimante réseau ou un tube Unix ('OUTPUT TO PIPE lp').`,
    codeSample: `REPORT balance_journaliere_report(r_ligne)
    DEFINE r_ligne RECORD
               age CHAR(5),
               cha CHAR(4),
               dev CHAR(3),
               debit DECIMAL(19,4),
               credit DECIMAL(19,4)
           END RECORD

    OUTPUT
        PAGE LENGTH 66
        TOP MARGIN 3
        BOTTOM MARGIN 3

    FORMAT
        PAGE HEADER
            PRINT "BANQUE CENTRALE AMPLITUDE - ÉTAT D'ARRÊTÉ EOD"
            PRINT "Date : ", TODAY, " | Page : ", PAGENO USING "###"
            PRINT "================================================================================"
            PRINT "AGENCE | CHAPITRE | DEVISE | TOTAL DÉBITS       | TOTAL CRÉDITS      "
            PRINT "--------------------------------------------------------------------------------"

        ON EVERY ROW
            PRINT r_ligne.age, "  | ", r_ligne.cha, "     | ", r_ligne.dev, "    | ",
                  r_ligne.debit USING "---,---,---,##&.&&", " | ",
                  r_ligne.credit USING "---,---,---,##&.&&"

        AFTER GROUP OF r_ligne.dev
            PRINT "--------------------------------------------------------------------------------"
            PRINT "TOTAL DEVISE ", r_ligne.dev, " : ",
                  GROUP SUM(r_ligne.debit) USING "---,---,---,##&.&&", " | ",
                  GROUP SUM(r_ligne.credit) USING "---,---,---,##&.&&"

        ON LAST ROW
            PRINT "================================================================================"
            PRINT "DIFFÉRENTIEL GLOBAL D'ÉQUILIBRE : ", 
                  (SUM(r_ligne.debit) - SUM(r_ligne.credit)) USING "---,---,---,##&.&&"
END REPORT`,
    explanation: "Le générateur calcule automatiquement les sous-totaux par devise et le total général sans code supplémentaire.",
    goldenRules: [
      "Vérifier que les données transmises au REPORT sont strictement triées selon la hiérarchie des AFTER GROUP.",
      "Contrôler que le différentiel global en dernière ligne soit rigoureusement égal à 0.00."
    ],
    pitfallsToAvoid: [
      "Envoyer des données non triées à un REPORT entraîne des ruptures de groupe incohérentes et des totaux erronés."
    ]
  },

  // --- NIVEAU 5 : LEAD ARCHITECTE & EXPERT 4GL ---
  {
    id: "l5_02",
    gradeLevel: 5,
    category: "OPTIMISATION_EOD",
    title: "5.2 SQL Dynamique Préparé (PREPARE, EXECUTE & DESCRIBE)",
    summary: "Compilez une seule fois vos requêtes SQL et exécutez-les des millions de fois à pleine vitesse.",
    keyConcepts: ["PREPARE nom_stmt FROM", "EXECUTE stmt USING", "FREE stmt", "Plan d'exécution mis en cache"],
    detailedContent: `Dans une boucle batch exécutant un million d'itérations, la formulation directe 'INSERT INTO ...' oblige le moteur SGBD à réanalyser la syntaxe (Parsing), vérifier les privilèges et recalculer le plan d'accès pour chaque ligne.
L'instruction 'PREPARE' résout ce goulot d'étranglement :
1. Elle transmet la chaîne SQL avec des paramètres variables représentés par des points d'interrogation ('?').
2. Le moteur SGBD parse, compile et met en cache le plan d'exécution optimisé une fois pour toutes.
3. L'instruction 'EXECUTE ... USING' transmet ensuite uniquement les valeurs binaires, éliminant 80% du temps CPU.`,
    codeSample: `FUNCTION batch_generation_agios_haute_vitesse()
    DEFINE l_sql_query VARCHAR(255),
           l_cpt CHAR(11),
           l_montant_agio DECIMAL(19,4),
           l_dco DATE

    LET l_dco = TODAY

    -- 1. Compilation unique du plan d'exécution côté SGBD
    LET l_sql_query = "UPDATE bkcpt SET sol = sol - ? WHERE ncp = ?"
    PREPARE p_maj_agio FROM l_sql_query

    IF status != 0 THEN
        DISPLAY "Erreur lors du PREPARE : ", status
        RETURN FALSE
    END IF

    -- 2. Exécution répétée à pleine vitesse
    FOREACH c_calculs INTO l_cpt, l_montant_agio
        EXECUTE p_maj_agio USING l_montant_agio, l_cpt
        IF status != 0 THEN
            CALL journaliser_erreur("EXECUTE_AGIO_FAILED", status)
        END IF
    END FOREACH

    -- 3. Libération explicite de la mémoire de la requête
    FREE p_maj_agio
    RETURN TRUE
END FUNCTION`,
    explanation: "PREPARE élimine le coût de parsing pour chaque itération du batch et accélère considérablement l'arrêté.",
    goldenRules: [
      "Toujours appeler FREE sur l'identifiant du PREPARE en fin de traitement pour libérer la mémoire côté serveur.",
      "Associer PREPARE à un INSERT CURSOR quand il s'agit d'insertions massives d'écritures."
    ],
    pitfallsToAvoid: [
      "Exécuter PREPARE à l'intérieur de la boucle FOREACH annule complètement le gain de performance et sature le dictionnaire de curseurs."
    ]
  },
  {
    id: "l5_03",
    gradeLevel: 5,
    category: "OPTIMISATION_EOD",
    title: "5.3 Traitement Parallèle, Mémoire Scratch & Profilage AIX",
    summary: "Découpez les traitements EOD en flux concurrents équilibrés par agence ou racine de compte.",
    keyConcepts: ["Partitionnement horizontal", "Shared Memory Informix", "Purge des tables temporaires", "iostat / vmstat"],
    detailedContent: `Pour les très grands groupes bancaires comptant plus de 5 millions de comptes, un batch séquentiel mono-processus ne peut pas terminer avant 07h00 du matin.
L'architecture experte consiste à partitionner le traitement en plusieurs instances 4GL indépendantes s'exécutant en parallèle :
- Instance 1 : Agences 01001 à 01050
- Instance 2 : Agences 01051 à 01100
- Instance 3 : Agences 01101 à 01150

Chaque processus 4GL opère sur sa plage de données sans conflit de verrous.
Les tables temporaires ('CREATE TEMP TABLE') doivent être déclarées 'WITH NO LOG' pour éviter toute écriture sur les disques de journaux transactionnels.`,
    codeSample: `{ Script d'appel batch partitionné par plage d'agences }
FUNCTION executer_batch_agence_borne(p_age_debut, p_age_fin)
    DEFINE p_age_debut, p_age_fin CHAR(5),
           l_rec RECORD LIKE bkcpt.*

    -- Création d'une table temporaire ultra-rapide en mémoire non journalisée
    CREATE TEMP TABLE tmp_calculs (
        ncp CHAR(11),
        agio DECIMAL(19,4)
    ) WITH NO LOG

    -- Traitement réservé à la tranche d'agences attribuée
    DECLARE c_tranche CURSOR FOR
        SELECT * FROM bkcpt
         WHERE age BETWEEN p_age_debut AND p_age_fin
           AND eta = "A"

    -- Exécution isolée sans interférence avec les autres instances
    FOREACH c_tranche INTO l_rec.*
        -- Calculs en mémoire
    END FOREACH

    DROP TABLE tmp_calculs
END FUNCTION`,
    explanation: "La clause WITH NO LOG sur les tables temporaires divise par 4 les accès disques lors des calculs intermédiaires.",
    goldenRules: [
      "Toujours utiliser 'WITH NO LOG' pour les tables temporaires de calcul batch.",
      "Équilibrer les tranches de partitionnement par volume réel de mouvements et non simplement par nombre d'agences."
    ],
    pitfallsToAvoid: [
      "Oublier de supprimer les tables temporaires (DROP TABLE) avant la sortie du programme : elles encombrent l'espace dbspace temporaire."
    ]
  }
];
