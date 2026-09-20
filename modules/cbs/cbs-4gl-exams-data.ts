// modules/cbs/cbs-4gl-exams-data.ts
import { Cbs4GlExamQuestion } from "./cbs-4gl-data";

export const CBS_4GL_ALL_EXAMS: Cbs4GlExamQuestion[] = [
  // =========================================================================
  // GRADE 1 : APPRENTI DÉVELOPPEUR 4GL (15 QUESTIONS)
  // =========================================================================
  {
    id: "ex_n1_01",
    gradeLevel: 1,
    question: "Quelle instruction obligatoire doit figurer en toute première ligne non commentée d'un fichier source 4GL ?",
    options: ["DATABASE nom_base", "USE DATABASE nom_base", "CONNECT TO nom_base", "OPEN CATALOG nom_base"],
    correctIndex: 0,
    explanation: "La clause 'DATABASE' en tête de fichier permet au compilateur c4gl de vérifier les types de colonnes et tables lors de la compilation.",
    trapWarning: "USE ou CONNECT sont utilisés dans d'autres langages SQL, mais en 4GL c'est strictement DATABASE."
  },
  {
    id: "ex_n1_02",
    gradeLevel: 1,
    question: "Pourquoi est-il interdit d'utiliser FLOAT ou SMALLFLOAT pour manipuler des soldes ou montants bancaires en 4GL ?",
    options: [
      "Ils consomment trop de mémoire vive",
      "Leur représentation binaire flottante IEEE provoque des imprécisions d'arrondi sur les centimes",
      "Le SGBD Informix refuse les opérations arithmétiques sur FLOAT",
      "Ils ne supportent pas les valeurs négatives"
    ],
    correctIndex: 1,
    explanation: "Les types à virgule flottante ne peuvent pas représenter exactement certaines fractions décimales (ex: 0.10), ce qui engendre des écarts d'arrondi comptables inacceptables. On utilise toujours DECIMAL(p,s) ou MONEY.",
    trapWarning: "En finance et comptabilité réglementaire, l'arithmétique décimale exacte est obligatoire."
  },
  {
    id: "ex_n1_03",
    gradeLevel: 1,
    question: "Que produit l'opération 4GL suivante : LET solde = 50000 + NULL ?",
    options: ["solde vaut 50000", "solde vaut 0", "solde vaut NULL", "Une exception arithmétique est levée à l'exécution"],
    correctIndex: 2,
    explanation: "En 4GL, toute expression arithmétique ou concaténation avec NULL s'évalue à NULL. C'est pourquoi on utilise toujours NVL(variable, 0).",
    trapWarning: "NULL n'est pas équivalent à 0 en 4GL/SQL."
  },
  {
    id: "ex_n1_04",
    gradeLevel: 1,
    question: "Quelle fonction standard 4GL permet de remplacer une valeur NULL par une valeur de substitution par défaut ?",
    options: ["IFNULL()", "COALESCE()", "NVL()", "ISNULL()"],
    correctIndex: 2,
    explanation: "En Informix 4GL, la fonction intégrée est NVL(expr, valeur_si_null), par exemple NVL(l_solde, 0.00).",
    trapWarning: "COALESCE existe en SQL moderne, mais dans la grammaire 4GL native historique, c'est NVL()."
  },
  {
    id: "ex_n1_05",
    gradeLevel: 1,
    question: "Où doivent impérativement être placées les déclarations de variables (DEFINE) dans une FUNCTION 4GL ?",
    options: [
      "N'importe où dans le corps de la fonction avant leur première utilisation",
      "Au tout début de la fonction, immédiatement après le nom de la FUNCTION et avant toute instruction exécutable",
      "À la fin de la fonction, juste avant END FUNCTION",
      "Dans un fichier d'en-tête externe obligatoirement"
    ],
    correctIndex: 1,
    explanation: "En Informix 4GL classique, toutes les variables locales doivent être déclarées au sommet du bloc FUNCTION via DEFINE avant la moindre ligne exécutable.",
    trapWarning: "Placer un DEFINE après un LET ou un DISPLAY provoque une erreur de compilation c4gl."
  },
  {
    id: "ex_n1_06",
    gradeLevel: 1,
    question: "Combien de blocs 'MAIN ... END MAIN' peut comporter un même programme exécutable 4GL ?",
    options: ["Autant qu'il y a de fichiers sources", "Exactement un seul", "Au maximum deux (un pour batch et un pour interactif)", "Aucun si on utilise des fonctions"],
    correctIndex: 1,
    explanation: "Un exécutable binaire 4GL ne peut posséder qu'un seul et unique point d'entrée MAIN, même si le projet compile 50 fichiers .4gl différents.",
    trapWarning: "Avoir deux MAIN dans le même lien d'édition génère une erreur 'duplicate symbol main' à la compilation C."
  },
  {
    id: "ex_n1_07",
    gradeLevel: 1,
    question: "Comment sortir prématurément d'une boucle 'FOR i = 1 TO 100' dès qu'un compte bancaire est trouvé ?",
    options: ["BREAK", "STOP FOR", "EXIT FOR", "RETURN FOR"],
    correctIndex: 2,
    explanation: "L'instruction 4GL pour rompre une boucle FOR est 'EXIT FOR'. Pour WHILE, c'est 'EXIT WHILE'.",
    trapWarning: "BREAK est le mot-clé C/Java/Python, non valide en 4GL."
  },
  {
    id: "ex_n1_08",
    gradeLevel: 1,
    question: "Quel opérateur 4GL permet de tester un filtre de masque avec les jokers '*' et '?' (ex: numéro de compte commençant par '01') ?",
    options: ["LIKE", "MATCHES", "CONTAINS", "REGEX"],
    correctIndex: 1,
    explanation: "L'opérateur 4GL natif pour les jokers shell (* et ?) est MATCHES (ex: IF p_ncp MATCHES '01*' THEN). LIKE utilise '%' et '_'.",
    trapWarning: "MATCHES utilise '*' pour plusieurs caractères et '?' pour un seul, contrairement à LIKE SQL qui utilise '%' et '_'."
  },
  {
    id: "ex_n1_09",
    gradeLevel: 1,
    question: "Quelle instruction termine proprement l'exécution d'un binaire 4GL en transmettant un code retour 0 au script shell parent ?",
    options: ["STOP PROGRAM", "EXIT PROGRAM (0)", "TERMINATE 0", "QUIT SUCCESS"],
    correctIndex: 1,
    explanation: "EXIT PROGRAM (code) met fin au processus Unix et renvoie le code d'état système au shell (0 pour succès, >0 pour code erreur).",
    trapWarning: "EXIT sans argument ou STOP ne garantit pas la transmission propre du code d'erreur au script Unix."
  },
  {
    id: "ex_n1_10",
    gradeLevel: 1,
    question: "Comment déclarer une variable globale partagée entre plusieurs fichiers .4gl d'un même projet ?",
    options: [
      "Par le mot-clé GLOBAL DEFINE dans chaque fichier",
      "Dans un bloc GLOBALS ... END GLOBALS ou via un fichier partagé inclus par 'GLOBALS \"fichier.4gl\"'",
      "En utilisant la variable système PUBLIC",
      "Les variables globales n'existent pas en 4GL"
    ],
    correctIndex: 1,
    explanation: "Le partage de variables globales s'effectue au moyen de la clause GLOBALS, souvent centralisée dans un fichier d'en-tête commun.",
    trapWarning: "Déclarer deux fois un bloc GLOBALS avec des variables différentes dans le même fichier est interdit."
  },
  {
    id: "ex_n1_11",
    gradeLevel: 1,
    question: "Quelle est la bonne syntaxe 4GL pour tester si la variable 'devise' est vide ou non renseignée ?",
    options: ["IF devise = NULL THEN", "IF devise == '' THEN", "IF devise IS NULL THEN", "IF ISNULL(devise) THEN"],
    correctIndex: 2,
    explanation: "En 4GL et SQL standard, NULL se teste exclusivement avec la syntaxe 'IS NULL' ou 'IS NOT NULL'.",
    trapWarning: "Écrire '= NULL' renverra toujours FAUX (NULL n'est jamais égal à quoi que ce soit)."
  },
  {
    id: "ex_n1_12",
    gradeLevel: 1,
    question: "Quel formatage de chaîne USING permet d'afficher un montant avec séparateur de milliers et deux décimales (ex: 1 250 000,50) ?",
    options: [
      "USING '###,###,##&.&&'",
      "FORMAT '$###.###,##'",
      "MASK '999.999.999,99'",
      "PRINT AS CURRENCY"
    ],
    correctIndex: 0,
    explanation: "La clause USING en 4GL utilise '#' pour les chiffres facultatifs et '&' pour forcer l'affichage de zéro dans les décimales.",
    trapWarning: "'&' garantit que 0.50 s'affichera '0.50' et non '.50'."
  },
  {
    id: "ex_n1_13",
    gradeLevel: 1,
    question: "Dans une structure 'CASE ... END CASE', quelle clause de sécurité doit obligatoirement être présente pour traiter les cas non prévus ?",
    options: ["DEFAULT", "ELSE", "OTHERWISE", "CATCH"],
    correctIndex: 2,
    explanation: "En 4GL, la clause par défaut d'un CASE est 'OTHERWISE'. Si aucune condition n'est vraie et qu'il n'y a pas d'OTHERWISE, une erreur fatale survient.",
    trapWarning: "L'omission d'OTHERWISE fait planter le binaire 4GL si une valeur inattendue se présente."
  },
  {
    id: "ex_n1_14",
    gradeLevel: 1,
    question: "Quelle variable système intégrée contient la date système du jour de l'environnement hôte ?",
    options: ["SYSDATE", "CURRENT_DATE", "TODAY", "GETDATE()"],
    correctIndex: 2,
    explanation: "En 4GL, la constante de date courante est 'TODAY'. Pour l'horodatage précis à la seconde, on utilise 'CURRENT'.",
    trapWarning: "SYSDATE est spécifique à Oracle SQL, alors qu'en 4GL natif la constante est TODAY."
  },
  {
    id: "ex_n1_15",
    gradeLevel: 1,
    question: "Une fonction 4GL peut-elle retourner plusieurs valeurs à la fois lors d'un appel ?",
    options: [
      "Non, une fonction ne peut retourner qu'un seul scalaire comme en langage C",
      "Oui, grâce à la clause 'RETURN val1, val2, val3' et la réception par 'RETURNING var1, var2, var3'",
      "Uniquement si les valeurs sont regroupées dans un tableau statique",
      "Uniquement via des pointeurs mémoire"
    ],
    correctIndex: 1,
    explanation: "L'une des grandes forces du 4GL est le support natif du multi-retour : CALL fn() RETURNING a, b, c.",
    trapWarning: "Le nombre de variables réceptrices dans RETURNING doit correspondre exactement au nombre de valeurs émises par RETURN."
  },

  // =========================================================================
  // GRADE 2 : DÉVELOPPEUR JUNIOR 4GL (15 QUESTIONS)
  // =========================================================================
  {
    id: "ex_n2_01",
    gradeLevel: 2,
    question: "Quelle valeur prend la variable système 'status' lorsqu'un 'SELECT * INTO' ne trouve aucun enregistrement ?",
    options: ["status = -1", "status = 100 (NOTFOUND)", "status = 0", "status = 404"],
    correctIndex: 1,
    explanation: "En conformité SQL ANSI, quand aucune ligne ne correspond aux critères WHERE, le moteur positionne status à 100, qui correspond à la constante 4GL NOTFOUND.",
    trapWarning: "Ce n'est pas une erreur négative mais un code de notification standard (100)."
  },
  {
    id: "ex_n2_02",
    gradeLevel: 2,
    question: "Où trouve-t-on le nombre exact de lignes modifiées ou supprimées par le dernier ordre DML (UPDATE / DELETE) ?",
    options: ["sqlca.sqlcode", "sqlca.sqlerrd[2]", "status", "sqlca.sqlerrd[1]"],
    correctIndex: 1,
    explanation: "sqlca.sqlerrd[2] contient le compteur de lignes impactées par l'opération DML.",
    trapWarning: "status vaut 0 même si l'UPDATE n'a modifié 0 ligne (car l'instruction syntaxique a réussi)."
  },
  {
    id: "ex_n2_03",
    gradeLevel: 2,
    question: "Quel est l'avantage décisif de la directive 'DEFINE l_compte RECORD LIKE bkcpt.*' ?",
    options: [
      "Elle crypte la table en mémoire",
      "Elle lie la structure mémoire au schéma de la base et s'ajuste automatiquement en cas d'évolution de colonnes",
      "Elle verrouille la table en lecture exclusive",
      "Elle crée automatiquement un index temporaire"
    ],
    correctIndex: 1,
    explanation: "La synchronisation dynamique avec le dictionnaire de tables garantit qu'une modification de colonne (ex: passage à l'IBAN) n'exige qu'une simple recompilation sans retoucher le code.",
    trapWarning: "RECORD LIKE n'affecte pas la base de données et ne pose aucun verrou : c'est purement une déclaration mémoire."
  },
  {
    id: "ex_n2_04",
    gradeLevel: 2,
    question: "Que se passe-t-il si un 'SELECT ... INTO' retourne 2 lignes au lieu d'une seule attendue ?",
    options: [
      "Le 4GL prend la première ligne silencieusement",
      "Le programme s'arrête avec l'erreur -284 ('A subquery has returned not exactly one row')",
      "Le 4GL remplit automatiquement un tableau",
      "Les deux lignes sont fusionnées"
    ],
    correctIndex: 1,
    explanation: "Un ordre SELECT ... INTO exige l'unicité stricte du résultat. Si plusieurs lignes correspondent, l'erreur -284 est levée.",
    trapWarning: "Pour lire un ensemble de plusieurs lignes, l'utilisation d'un CURSEUR (DECLARE / FOREACH) est impérative."
  },
  {
    id: "ex_n2_05",
    gradeLevel: 2,
    question: "À quoi sert la directive 'WHENEVER ERROR CONTINUE' ?",
    options: [
      "À ignorer les erreurs de compilation du code C",
      "À désactiver le crash immédiat du programme lors d'une erreur SQL, permettant de gérer l'erreur manuellement via status",
      "À forcer la validation de la transaction même si elle échoue",
      "À masquer les erreurs dans la console sans les consigner"
    ],
    correctIndex: 1,
    explanation: "Par défaut (WHENEVER ERROR STOP), toute erreur SQL négative interrompt brutalement l'exécutable. 'CONTINUE' permet de capturer l'incident et de consigner un log propre.",
    trapWarning: "Il faut impérativement réactiver 'WHENEVER ERROR STOP' une fois le bloc critique achevé."
  },
  {
    id: "ex_n2_06",
    gradeLevel: 2,
    question: "Que contient la case 'sqlca.sqlerrd[1]' en cas d'échec d'une opération sur fichier de données ?",
    options: [
      "Le temps d'exécution en millisecondes",
      "Le code d'erreur du moteur de stockage ISAM sous-jacent (ex: erreur de clé en double ou disque saturé)",
      "Le numéro du port TCP de connexion",
      "L'identifiant du terminal utilisateur"
    ],
    correctIndex: 1,
    explanation: "Le code ISAM indique la raison physique exacte du problème (ex: -100 ISAM = clé dupliquée, -131 ISAM = pas d'espace disque).",
    trapWarning: "L'erreur SQL globale est souvent générique (-239 ou -268), c'est l'erreur ISAM qui donne la vraie cause technique."
  },
  {
    id: "ex_n2_07",
    gradeLevel: 2,
    question: "Quelle table maîtresse du CBS Amplitude stocke les comptes de la clientèle (soldes, devises, agence) ?",
    options: ["BKCLI", "BKCPT", "BKTRA", "BKCOM"],
    correctIndex: 1,
    explanation: "BKCPT est la table pivot des comptes client et comptes généraux (colonnes AGE, DEV, NCP, SOL, etc.).",
    trapWarning: "BKCLI stocke les informations signalétiques des clients (personnes physiques/morales), pas les soldes."
  },
  {
    id: "ex_n2_08",
    gradeLevel: 2,
    question: "Comment insérer une ligne dans la table d'audit BKAUD avec les valeurs exactes d'une structure RECORD LIKE bkaud.* ?",
    options: [
      "INSERT INTO bkaud RECORD l_aud",
      "INSERT INTO bkaud VALUES (l_aud.*)",
      "PUT bkaud FROM l_aud",
      "SAVE l_aud TO bkaud"
    ],
    correctIndex: 1,
    explanation: "La syntaxe 4GL pour injecter l'intégralité d'une variable record dans sa table correspondante est 'INSERT INTO table VALUES (record.*)'.",
    trapWarning: "Les parenthèses autour de (record.*) sont obligatoires."
  },
  {
    id: "ex_n2_09",
    gradeLevel: 2,
    question: "Quelle instruction permet d'intercepter automatiquement toutes les erreurs SQL et d'appeler une routine d'alerte spécifique ?",
    options: ["ON ERROR GOTO alerte", "TRY CATCH alerte()", "WHENEVER ERROR CALL alerte_incident", "HANDLE SQLERROR alerte"],
    correctIndex: 2,
    explanation: "L'instruction 'WHENEVER ERROR CALL routine' redirige l'exécution vers la fonction d'alerte dès qu'un ordre SQL échoue.",
    trapWarning: "TRY/CATCH n'existe pas en Informix 4GL procédural natif."
  },
  {
    id: "ex_n2_10",
    gradeLevel: 2,
    question: "Si status = 0 après un UPDATE bkcpt, cela garantit-il qu'au moins un compte a été modifié ?",
    options: [
      "Oui, obligatoirement",
      "Non, status = 0 signifie seulement que la syntaxe et l'exécution ont réussi, même si aucune ligne ne correspondait au WHERE",
      "Non, cela signifie que la base de données est en lecture seule",
      "Oui, sinon status vaudrait NOTFOUND"
    ],
    correctIndex: 1,
    explanation: "C'est un piège majeur : un UPDATE qui ne trouve aucune ligne correspondante renvoie quand même status = 0. Il faut vérifier sqlca.sqlerrd[2] > 0.",
    trapWarning: "Toujours vérifier sqlca.sqlerrd[2] après un UPDATE pour valider qu'une ligne a bien été modifiée."
  },
  {
    id: "ex_n2_11",
    gradeLevel: 2,
    question: "Dans la table BKTRA (mouvements comptables), quelle colonne identifie la date comptable de la transaction ?",
    options: ["DCO", "DVAL", "DSIS", "DTRA"],
    correctIndex: 0,
    explanation: "DCO (Date COmptable) est la date d'arrêté officielle de l'opération dans Amplitude.",
    trapWarning: "DVAL est la date de valeur (calcul des intérêts) et DSIS la date système de saisie."
  },
  {
    id: "ex_n2_12",
    gradeLevel: 2,
    question: "Comment effacer physiquement un enregistrement temporaire dans la table de sas monétique 'mon_temp' ?",
    options: ["DROP mon_temp WHERE id = 1", "DELETE FROM mon_temp WHERE id = 1", "REMOVE mon_temp WHERE id = 1", "TRUNCATE RECORD FROM mon_temp"],
    correctIndex: 1,
    explanation: "La suppression SQL standard en 4GL s'exécute avec l'instruction 'DELETE FROM table WHERE ...'.",
    trapWarning: "Oublier la clause WHERE supprimerait la totalité des lignes de la table !"
  },
  {
    id: "ex_n2_13",
    gradeLevel: 2,
    question: "Quelle fonction permet de connaître la longueur réelle d'une chaîne de caractères sans compter les espaces de fin ?",
    options: ["LENGTH(chaine)", "SIZE(chaine)", "LEN(chaine)", "CHAR_LENGTH(chaine)"],
    correctIndex: 0,
    explanation: "La fonction 4GL native 'LENGTH(texte)' retourne la position du dernier caractère non blanc d'une chaîne.",
    trapWarning: "Sur une variable CHAR(30) contenant 'ABC', LENGTH() renvoie 3 et non 30."
  },
  {
    id: "ex_n2_14",
    gradeLevel: 2,
    question: "Quelle est la différence entre les types CHAR(20) et VARCHAR(20) en Informix 4GL ?",
    options: [
      "CHAR est complété par des espaces jusqu'à 20 caractères, alors que VARCHAR ne stocke que la longueur utile",
      "VARCHAR est réservé aux chiffres et CHAR aux lettres",
      "CHAR ne peut pas être inséré dans une base SQL",
      "VARCHAR consomme toujours 20 octets fixes sur le disque"
    ],
    correctIndex: 0,
    explanation: "Le type CHAR(N) a une longueur fixe comblée d'espaces à droite. VARCHAR(N) est à longueur variable, économisant de l'espace disque et réseau.",
    trapWarning: "Lors des comparaisons, les espaces de fin d'un CHAR peuvent fausser des égalités strictes avec des VARCHAR."
  },
  {
    id: "ex_n2_15",
    gradeLevel: 2,
    question: "Quelle directive est utilisée pour déclarer une structure de données composite spécifique sans référence directe à une table ?",
    options: ["DEFINE nom RECORD ... END RECORD", "CREATE STRUCT nom ...", "TYPE nom AS OBJECT", "DECLARE RECORD nom"],
    correctIndex: 0,
    explanation: "La syntaxe 4GL pour créer une structure personnalisée est : DEFINE nom RECORD champ1 TYPE, champ2 TYPE END RECORD.",
    trapWarning: "Chaque sous-champ doit être typé explicitement à l'intérieur du bloc RECORD."
  },

  // =========================================================================
  // GRADE 3 : DÉVELOPPEUR CONFIRMÉ 4GL (15 QUESTIONS)
  // =========================================================================
  {
    id: "ex_n3_01",
    gradeLevel: 3,
    question: "À quoi sert le mode d'isolation 'SET ISOLATION TO DIRTY READ' dans les extractions batch volumineuses ?",
    options: [
      "À supprimer les index pour accélérer la lecture",
      "À lire les données sans poser de verrous partagés et sans être bloqué par les verrous exclusifs des agences",
      "À forcer l'écriture immédiate des caches disques",
      "À convertir les montants en devise de reporting"
    ],
    correctIndex: 1,
    explanation: "DIRTY READ permet de lire des tables très actives sans attendre la libération des verrous de mise à jour des guichets, évitant de paralyser la banque.",
    trapWarning: "DIRTY READ ne doit JAMAIS être utilisé pour des écritures comptables ou des calculs de solde définitifs car il peut lire des données en cours d'annulation (rollback)."
  },
  {
    id: "ex_n3_02",
    gradeLevel: 3,
    question: "Quelle boucle 4GL est spécialement conçue pour parcourir séquentiellement les lignes retournées par un curseur SQL ?",
    options: ["FOR EACH ... NEXT", "FOREACH nom_curseur INTO variables", "WHILE CURSOR.NEXT", "LOOP CURSOR nom_curseur"],
    correctIndex: 1,
    explanation: "La syntaxe 4GL 'FOREACH c_compte INTO l_cpt.* ... END FOREACH' ouvre le curseur, effectue les FETCH successifs et ferme le curseur automatiquement en fin de liste.",
    trapWarning: "Il ne faut pas appeler 'OPEN' ou 'CLOSE' sur un curseur parcouru par un FOREACH : 4GL s'en charge automatiquement."
  },
  {
    id: "ex_n3_03",
    gradeLevel: 3,
    question: "Comment verrouiller une ligne au moment de la lecture par curseur pour s'assurer qu'aucun autre processus ne la modifie avant nous ?",
    options: [
      "En ajoutant 'FOR UPDATE' à la déclaration du curseur",
      "En utilisant la commande 'LOCK TABLE IN SHARE MODE'",
      "En définissant la variable ISOLATION = EXCLUSIVE",
      "Le 4GL verrouille toujours automatiquement toutes les lignes lues"
    ],
    correctIndex: 0,
    explanation: "La clause 'DECLARE c_cpt CURSOR FOR SELECT ... FOR UPDATE' pose un verrou exclusif sur chaque ligne fetchée jusqu'à la fin de la transaction.",
    trapWarning: "Un curseur FOR UPDATE doit impérativement s'exécuter à l'intérieur d'un bloc BEGIN WORK / COMMIT."
  },
  {
    id: "ex_n3_04",
    gradeLevel: 3,
    question: "Quelle syntaxe permet de mettre à jour la ligne précise actuellement pointée par le curseur 'c_cpt' ?",
    options: [
      "UPDATE bkcpt SET sol = n_sol WHERE ROWID = c_cpt",
      "UPDATE bkcpt SET sol = n_sol WHERE CURRENT OF c_cpt",
      "UPDATE CURRENT ROW OF c_cpt",
      "APPLY UPDATE ON CURSOR c_cpt"
    ],
    correctIndex: 1,
    explanation: "La clause 'WHERE CURRENT OF nom_curseur' garantit la modification atomique de la ligne exacte verrouillée par le curseur sans réévaluer le WHERE.",
    trapWarning: "Nécessite que le curseur ait été déclaré avec la clause 'FOR UPDATE'."
  },
  {
    id: "ex_n3_05",
    gradeLevel: 3,
    question: "Dans un formulaire écran 4GL (.per), quel bloc est exécuté au moment où l'utilisateur quitte un champ de saisie ?",
    options: ["BEFORE FIELD nom_champ", "AFTER FIELD nom_champ", "ON LEAVE nom_champ", "EXIT FIELD nom_champ"],
    correctIndex: 1,
    explanation: "Le trigger 'AFTER FIELD' se déclenche lorsque la saisie dans le champ se termine. C'est l'endroit idéal pour vérifier les plafonds ou l'existence du compte.",
    trapWarning: "Si la validation échoue dans AFTER FIELD, on utilise NEXT FIELD nom_champ pour forcer l'utilisateur à corriger."
  },
  {
    id: "ex_n3_06",
    gradeLevel: 3,
    question: "Comment forcer le focus de l'opérateur à revenir sur le champ 'montant' lors d'une saisie erronée dans un formulaire 4GL ?",
    options: ["GOTO FIELD montant", "SET FOCUS TO montant", "NEXT FIELD montant", "RETRY FIELD montant"],
    correctIndex: 2,
    explanation: "L'instruction 'NEXT FIELD nom_champ' repositionne immédiatement le curseur de saisie sur le champ désigné.",
    trapWarning: "NEXT FIELD est utilisable uniquement à l'intérieur d'une instruction INPUT ou CONSTRUCT."
  },
  {
    id: "ex_n3_07",
    gradeLevel: 3,
    question: "Quelle instruction permet de régler le comportement du SGBD lorsqu'une ligne demandée est déjà verrouillée par un autre processus ?",
    options: [
      "SET LOCK MODE TO WAIT [secondes]",
      "SET TIMEOUT LOCK [secondes]",
      "WAIT FOR UNLOCK",
      "PAUSE UNTIL RELEASE"
    ],
    correctIndex: 0,
    explanation: "SET LOCK MODE TO WAIT (ou SET LOCK MODE TO WAIT 15) demande au SGBD de patienter jusqu'à 15 secondes avant de lever une erreur -244.",
    trapWarning: "Par défaut sans cette directive, Informix est en 'NOT WAIT' et échoue immédiatement à la première ressource occupée."
  },
  {
    id: "ex_n3_08",
    gradeLevel: 3,
    question: "À quoi sert l'instruction 4GL 'CONSTRUCT' lors du développement d'un écran de recherche guichet ?",
    options: [
      "À créer une nouvelle table physique dans la base",
      "À laisser l'utilisateur saisir des critères de recherche libres et générer automatiquement la clause SQL WHERE correspondante",
      "À recompiler le code C en arrière-plan",
      "À générer un fichier PDF d'extrait de compte"
    ],
    correctIndex: 1,
    explanation: "CONSTRUCT génère dynamiquement une chaîne de prédicats WHERE en analysant les valeurs saisies par l'opérateur dans les champs d'un masque écran.",
    trapWarning: "La chaîne générée par CONSTRUCT doit ensuite être combinée dans un SQL dynamique avec PREPARE."
  },
  {
    id: "ex_n3_09",
    gradeLevel: 3,
    question: "Quelle est la différence fondamentale entre un curseur 'SCROLL CURSOR' et un curseur séquentiel ordinaire ?",
    options: [
      "SCROLL CURSOR permet de se déplacer en avant, en arrière, en début ou en fin de liste (FETCH FIRST, PREVIOUS, LAST, RELATIVE)",
      "SCROLL CURSOR ne fonctionne que pour les tables de plus d'un million de lignes",
      "SCROLL CURSOR ne peut être ouvert qu'en mode plein écran",
      "SCROLL CURSOR supprime automatiquement les lignes lues"
    ],
    correctIndex: 0,
    explanation: "Un SCROLL CURSOR maintient une table de pointeurs temporaires permettant une navigation bidirectionnelle, indispensable pour les grilles d'affichage paginées.",
    trapWarning: "Un SCROLL CURSOR consomme plus de mémoire et de temps à l'ouverture qu'un curseur séquentiel simple."
  },
  {
    id: "ex_n3_10",
    gradeLevel: 3,
    question: "Dans une boucle 'FOREACH', que se passe-t-il si une erreur SQL grave survient lors du traitement d'une ligne ?",
    options: [
      "Le curseur passe à la ligne suivante sans avertir",
      "Si WHENEVER ERROR STOP est actif, le programme s'arrête immédiatement ; avec CONTINUE, status contient le code d'erreur",
      "Le SGBD redémarre le serveur",
      "La base de données supprime le curseur"
    ],
    correctIndex: 1,
    explanation: "Le statut SQL du FETCH et des ordres internes à la boucle doit être surveillé avec WHENEVER ERROR CONTINUE pour journaliser l'erreur et poursuivre les autres comptes.",
    trapWarning: "Sans gestion d'erreur, un binaire batch peut crasher à la 99 999ème ligne et perdre tout le traitement si aucun commit intermédiaire n'est posé."
  },
  {
    id: "ex_n3_11",
    gradeLevel: 3,
    question: "Quelle instruction permet d'intercepter la frappe de touches de fonction spécifiques (ex: F3 pour Quitter, F5 pour Valider) dans un INPUT ?",
    options: ["ON KEY (F3) ... END KEY", "WHEN PRESSED F3", "CATCH KEY F3", "IF KEY = 'F3' THEN"],
    correctIndex: 0,
    explanation: "Les blocs événementiels 'ON KEY (control-p, f3, accept)' capturent les interactions clavier au sein des instructions INPUT, DISPLAY ARRAY ou MENU.",
    trapWarning: "On utilise 'EXIT INPUT' dans un bloc ON KEY pour interrompre la saisie de l'écran proprement."
  },
  {
    id: "ex_n3_12",
    gradeLevel: 3,
    question: "Quelle est la portée d'un curseur déclaré à l'intérieur d'une FUNCTION 4GL sans le mot-clé GLOBALS ?",
    options: [
      "Il est visible dans tout le fichier source .4gl",
      "Il est local à la fonction et automatiquement détruit à la sortie du bloc END FUNCTION",
      "Il reste ouvert en mémoire pour toutes les sessions Unix",
      "Il est enregistré dans le catalogue système de la base"
    ],
    correctIndex: 1,
    explanation: "Les curseurs déclarés au sein d'une fonction sont locaux à cette fonction. Dès que la fonction se termine, le contexte du curseur est désalloué.",
    trapWarning: "Tenter de faire un FETCH sur un curseur local depuis une autre fonction provoquera une erreur de compilation."
  },
  {
    id: "ex_n3_13",
    gradeLevel: 3,
    question: "Comment libérer explicitement la mémoire et les verrous associés à un curseur une fois sa lecture achevée ?",
    options: ["DISPOSE nom_curseur", "CLOSE nom_curseur", "FREE nom_curseur", "KILL nom_curseur"],
    correctIndex: 1,
    explanation: "'CLOSE nom_curseur' ferme le curseur et libère les verrous de lecture. Pour désallouer complètement l'identifiant préparé, on utilise aussi 'FREE'.",
    trapWarning: "Oublier de fermer les curseurs peut saturer la table des curseurs ouverts au niveau du moteur Informix."
  },
  {
    id: "ex_n3_14",
    gradeLevel: 3,
    question: "Quelle instruction 4GL permet d'afficher une liste interactive tabulaire dans un tableau d'écran en permettant à l'utilisateur de scroller ?",
    options: ["DISPLAY TABLE", "SHOW GRID", "DISPLAY ARRAY ... TO écran_tableau.*", "LIST RECORDS"],
    correctIndex: 2,
    explanation: "DISPLAY ARRAY permet d'injecter un tableau mémoire dans une sous-grille d'un formulaire d'écran avec gestion automatique des ascenseurs et des sélections de lignes.",
    trapWarning: "Le tableau mémoire doit être dimensionné avec un nombre d'éléments suffisant (DEFINE arr ARRAY[500] OF RECORD)."
  },
  {
    id: "ex_n3_15",
    gradeLevel: 3,
    question: "Pourquoi est-il crucial de placer l'instruction 'OPEN curseur' juste avant son utilisation plutôt qu'en début de programme ?",
    options: [
      "Parce que les données en base peuvent évoluer entre le début du binaire et le moment réel du traitement",
      "Parce que le 4GL ne tolère pas plus de 3 secondes entre OPEN et FETCH",
      "Pour éviter que le CPU ne surchauffe",
      "Parce que la commande OPEN efface les fichiers journaux"
    ],
    correctIndex: 0,
    explanation: "Ouvrir un curseur trop tôt fige la photographie des données (ou les verrous) trop longtemps avant que le traitement n'en ait besoin, augmentant les risques de conflits d'accès.",
    trapWarning: "Dans les environnements haute concurrence bancaire, la durée de vie d'un curseur ouvert doit être réduite au strict minimum."
  },

  // =========================================================================
  // GRADE 4 : DÉVELOPPEUR SENIOR 4GL (15 QUESTIONS)
  // =========================================================================
  {
    id: "ex_n4_01",
    gradeLevel: 4,
    question: "Pourquoi est-il FORMELLEMENT PROSCRIT d'inclure une saisie utilisateur (PROMPT ou INPUT) à l'intérieur d'un bloc BEGIN WORK / COMMIT ?",
    options: [
      "Le compilateur c4gl refuse de générer le code binaire",
      "Les verrous exclusifs en base restent actifs tant que l'opérateur n'a pas validé son écran, risquant de paralyser la production bancaire",
      "Le SGBD désactive les sauvegardes à chaud",
      "La transaction est automatiquement convertie en DIRTY READ"
    ],
    correctIndex: 1,
    explanation: "Une transaction bancaire doit s'exécuter en quelques millisecondes. Une attente humaine de plusieurs secondes ou minutes maintient les locks et provoque des congestions massives.",
    trapWarning: "Règle d'or senior : collecter et valider toutes les saisies EN AMONT, puis ouvrir et fermer la transaction au plus vite."
  },
  {
    id: "ex_n4_02",
    gradeLevel: 4,
    question: "Comment prévenir de manière mathématique et définitive les interblocages (Deadlocks / erreur Informix -244) lors de virements entre deux comptes A et B ?",
    options: [
      "En désactivant le journal des transactions de la banque",
      "En ordonnant toujours les accès aux comptes par ordre croissant d'identifiant (ex: if c1 < c2 lock(c1) puis lock(c2))",
      "En augmentant le nombre de disques durs du serveur AIX",
      "En exécutant les mises à jour sans clause WHERE"
    ],
    correctIndex: 1,
    explanation: "Si tous les programmes concurrents verrouillent toujours les ressources dans le même ordre séquentiel prédéfini, aucun cycle d'attente circulaire (deadlock) ne peut se former.",
    trapWarning: "Si le programme 1 verrouille A puis attend B, pendant que le programme 2 verrouille B puis attend A, ils se bloquent mutuellement à l'infini."
  },
  {
    id: "ex_n4_03",
    gradeLevel: 4,
    question: "En cas d'anomalie lors du débit d'un compte émetteur pendant un virement, quelle instruction annule l'ensemble des écritures de la transaction en cours ?",
    options: ["ABORT WORK", "ROLLBACK WORK", "CANCEL TRANSACTION", "UNDO ALL"],
    correctIndex: 1,
    explanation: "'ROLLBACK WORK' révoque immédiatement toutes les modifications effectuées depuis le 'BEGIN WORK', restaurant la cohérence parfaite du bilan bancaire.",
    trapWarning: "Oublier d'appeler ROLLBACK WORK en cas d'erreur laisse la transaction pendante et les verrous actifs."
  },
  {
    id: "ex_n4_04",
    gradeLevel: 4,
    question: "Quel principe comptable fondamental oblige à toujours générer au moins deux écritures équilibrées (Débit = Crédit) dans une même transaction ?",
    options: [
      "Le principe de caisse",
      "Le principe de la partie double (équilibre débit/crédit strict)",
      "Le principe de prudence financière",
      "Le principe de non-compensation fiscale"
    ],
    correctIndex: 1,
    explanation: "En comptabilité bancaire (Amplitude / BKTRA), toute écriture au débit d'un compte doit avoir une contrepartie exacte au crédit d'un autre compte pour que le bilan soit balancé.",
    trapWarning: "Valider une transaction où Débit != Crédit fausse la balance générale de la banque (interdit par la commission bancaire)."
  },
  {
    id: "ex_n4_05",
    gradeLevel: 4,
    question: "Que signifie le niveau d'isolation 'COMMITTED READ' en Informix 4GL ?",
    options: [
      "Le programme ne peut lire que les données validées et confirmées par un COMMIT d'un autre processus",
      "Le programme lit les données même si la transaction distante n'est pas validée",
      "Le programme verrouille toutes les tables de la base en mode exclusif",
      "Les lectures sont stockées dans un fichier texte temporaire"
    ],
    correctIndex: 0,
    explanation: "COMMITTED READ garantit qu'aucune donnée en cours de modification (non validée) ne sera lue. C'est le mode recommandé pour les opérations comptables standard.",
    trapWarning: "Empêche les lectures fantômes d'opérations susceptibles d'être annulées par ROLLBACK."
  },
  {
    id: "ex_n4_06",
    gradeLevel: 4,
    question: "Quel est l'impact de l'option 'REPEATABLE READ' sur les performances du serveur de base de données ?",
    options: [
      "Elle accélère les requêtes de 50%",
      "Elle maintient des verrous partagés sur TOUTES les lignes lues jusqu'au COMMIT final, réduisant fortement la concurrence",
      "Elle désactive la journalisation des transactions",
      "Elle réduit la taille de la mémoire partagée"
    ],
    correctIndex: 1,
    explanation: "REPEATABLE READ garantit que si une requête est réexécutée, elle verra exactement les mêmes lignes. Le coût est la conservation de verrous sur tout l'ensemble lu.",
    trapWarning: "À n'utiliser que pour des clôtures comptables critiques ultra-courtes pour ne pas bloquer les autres utilisateurs."
  },
  {
    id: "ex_n4_07",
    gradeLevel: 4,
    question: "Quelle commande Informix SQL permet de définir le niveau de granularité des verrous d'une table lors de sa création ou modification ?",
    options: [
      "ALTER TABLE bkcpt LOCK MODE (ROW)",
      "SET GRANULARITY TO ROW ON bkcpt",
      "LOCK TABLE bkcpt IN ROW LEVEL",
      "CONFIGURE LOCKS FOR bkcpt = ROW"
    ],
    correctIndex: 0,
    explanation: "Par défaut historique, certaines tables Informix sont en LOCK MODE (PAGE). Pour les tables bancaires à haute concurrence comme BKCPT, il faut impérativement être en LOCK MODE (ROW).",
    trapWarning: "En mode PAGE, verrouiller un compte client peut bloquer accidentellement 30 autres clients situés sur la même page physique de 2 Ko !"
  },
  {
    id: "ex_n4_08",
    gradeLevel: 4,
    question: "Que provoque l'erreur Informix -107 ('ISAM error: key value already exists') lors de la création d'un mouvement dans BKTRA ?",
    options: [
      "Le disque dur de la baie de stockage est plein",
      "Une tentative d'insertion d'une transaction avec un numéro de pièce ou une clé primaire déjà existante (doublon d'index unique)",
      "La table BKTRA a été supprimée",
      "Le mot de passe de la base de données a expiré"
    ],
    correctIndex: 1,
    explanation: "L'erreur -107 indique la violation d'une contrainte d'unicité (index unique). En monétique, cela arrive quand deux trames portent le même RRN ou STAN.",
    trapWarning: "Nécessite la gestion des reprises ou des rejets avec un message explicite dans le log d'exploitation."
  },
  {
    id: "ex_n4_09",
    gradeLevel: 4,
    question: "Comment gérer élégamment un blocage temporaire de verrou (-244) avec un mécanisme de relance (retry loop) en 4GL ?",
    options: [
      "En utilisant une boucle FOR de 1 à 3 essais avec un sleep court et WHENEVER ERROR CONTINUE",
      "En redémarrant le serveur Unix immédiatement",
      "En passant la table en DIRTY READ pour écrire la ligne en force",
      "En arrêtant le binaire avec un code 99"
    ],
    correctIndex: 0,
    explanation: "Une tentative concurrente peut se résoudre en quelques dixièmes de seconde. Réessayer 2 ou 3 fois avec un court délai résout 95% des conflits transitoires d'agences.",
    trapWarning: "Ne jamais faire une boucle infinie de retry qui bloquerait le processus indéfiniment."
  },
  {
    id: "ex_n4_10",
    gradeLevel: 4,
    question: "Pourquoi est-il proscrit de déclarer une transaction BEGIN WORK à l'intérieur d'une autre transaction déjà ouverte en 4GL ?",
    options: [
      "Informix ne supporte pas les transactions imbriquées imbriquées réelles (nested transactions) et lèvera une erreur",
      "Le deuxième commit annule le premier",
      "Toutes les données sont automatiquement écrasées",
      "La base de données bascule en mode maintenance"
    ],
    correctIndex: 0,
    explanation: "En Informix 4GL standard, les transactions imbriquées provoquent l'erreur -535 (Already in transaction) ou ne créent aucun point de sauvegarde indépendant.",
    trapWarning: "Toujours vérifier qu'une transaction n'est pas déjà ouverte avant d'invoquer BEGIN WORK."
  },
  {
    id: "ex_n4_11",
    gradeLevel: 4,
    question: "Dans le cadre de la réconciliation monétique ATM/POS, quand doit-on positionner l'état du mouvement à 'COMPENSÉ' ?",
    options: [
      "Dès la réception de la trame d'autorisation 0100",
      "Uniquement après le rapprochement réussi entre le fichier de compensation réseau (Visa/Mastercard/GIM) et le journal interne",
      "Dès que le client a retiré ses billets au distributeur",
      "À la fin du mois calendaire"
    ],
    correctIndex: 1,
    explanation: "L'autorisation (0100/0200) bloque la provision, mais la compensation financière effective n'intervient qu'après le traitement du clearing et du fichier de règlement.",
    trapWarning: "Confondre autorisation et compensation entraîne des écarts de trésorerie sur le compte Nostro de la banque."
  },
  {
    id: "ex_n4_12",
    gradeLevel: 4,
    question: "Quelle instruction permet de sauvegarder un point intermédiaire réversible dans une longue suite d'opérations d'une même session ?",
    options: ["CHECKPOINT nom_point", "SAVEPOINT nom_point", "MARKER nom_point", "FREEZE TRANSACTION"],
    correctIndex: 1,
    explanation: "SAVEPOINT permet de définir des jalons dans une transaction pour pouvoir faire un ROLLBACK TO SAVEPOINT sans annuler toute la transaction.",
    trapWarning: "Tous les moteurs Informix plus anciens ne supportent pas les savepoints dans la syntaxe 4GL historique sans passer par du SQL préparé."
  },
  {
    id: "ex_n4_13",
    gradeLevel: 4,
    question: "Quel rôle joue la table 'BKCOM' dans la chaîne de comptabilisation des opérations ?",
    options: [
      "Elle enregistre les commissions appliquées aux transactions",
      "Elle contient l'historique des connexions des utilisateurs",
      "Elle liste les agences bancaires du pays",
      "Elle stocke les devises étrangères"
    ],
    correctIndex: 0,
    explanation: "BKCOM est la table centrale de tarification et d'enregistrement des commissions prélevées sur les flux bancaires et monétiques.",
    trapWarning: "Chaque code opération possède un barème de frais paramétré dans les tables associées."
  },
  {
    id: "ex_n4_14",
    gradeLevel: 4,
    question: "Que se passe-t-il si un programme 4GL subit un 'kill -9' du système d'exploitation alors qu'il était en plein milieu d'une transaction BEGIN WORK ?",
    options: [
      "Les modifications partielles restent définitivement écrites en base",
      "Le serveur Informix détecte la perte de connexion du client et déclenche un ROLLBACK automatique via les journaux logiques",
      "Toute la base de données est corrompue et doit être restaurée depuis la sauvegarde",
      "Le serveur AIX s'arrête"
    ],
    correctIndex: 1,
    explanation: "Grâce aux principes ACID et aux Physical/Logical Logs du SGBD, toute transaction non commitée lors de la disparition d'un processus client est automatiquement rollbackée par le moteur.",
    trapWarning: "C'est la garantie absolue qu'une opération bancaire incomplète ne laissera jamais un compte débité sans sa contrepartie."
  },
  {
    id: "ex_n4_15",
    gradeLevel: 4,
    question: "Comment auditer rigoureusement toute modification de solde critique en conservant l'ancien solde et le nouveau solde ?",
    options: [
      "En écrivant une ligne dans la table d'audit (BKAUD) au sein de la MÊME transaction que l'UPDATE du compte",
      "En imprimant une feuille de papier au guichet",
      "En envoyant un email à la fin de la journée",
      "En stockant l'ancien solde dans un fichier temporaire /tmp"
    ],
    correctIndex: 0,
    explanation: "L'audit doit impérativement faire partie de la transaction ACID du compte : si l'UPDATE échoue, l'audit est annulé ; si l'audit échoue, l'UPDATE est annulé.",
    trapWarning: "Un audit enregistré en dehors de la transaction peut créer des faux positifs si la transaction est finalement rejetée."
  },

  // =========================================================================
  // GRADE 5 : LEAD ARCHITECTE & EXPERT 4GL (15 QUESTIONS)
  // =========================================================================
  {
    id: "ex_n5_01",
    gradeLevel: 5,
    question: "Lors de l'utilisation d'un 'INSERT CURSOR' haute performance avec 'PUT', que se passe-t-il si le développeur omet l'instruction 'FLUSH' avant le COMMIT final ?",
    options: [
      "Le compilateur 4GL signale une erreur fatale",
      "Toutes les lignes de la table sont effacées",
      "Les dernières lignes accumulées dans le tampon réseau mémoire (buffer) ne sont jamais transmises au disque et sont définitivement perdues",
      "Le SGBD Informix effectue un flush automatique toutes les millisecondes"
    ],
    correctIndex: 2,
    explanation: "PUT écrit dans un buffer local en mémoire. Tant que le bloc de 4 Ko n'est pas plein, rien n'est envoyé au serveur. Sans FLUSH, la fin du lot est perdue sans aucun message d'erreur !",
    trapWarning: "C'est l'un des bugs les plus redoutables et discrets en exploitation bancaire de masse !"
  },
  {
    id: "ex_n5_02",
    gradeLevel: 5,
    question: "Pourquoi est-il impératif de découper les batchs volumineux de fin de journée (EOD) en blocs de commit périodiques (chunking de 1 000 à 2 000 lignes) ?",
    options: [
      "Pour éviter de saturer les journaux logiques Informix (erreur -454 'Long transaction aborted') et réduire la durée de reprise après incident",
      "Parce que le 4GL ne sait pas compter au-delà de 2 000 lignes",
      "Pour permettre aux agences d'ouvrir pendant la nuit",
      "Pour réinitialiser le processeur du serveur"
    ],
    correctIndex: 0,
    explanation: "Les logical logs ont un espace disque alloué fixe. Une transaction unique qui modifie 2 millions de lignes sature les logs, forçant le SGBD à un rollback massif qui bloque la banque pendant des heures.",
    trapWarning: "Le découpage par paquet de 1 000 à 2 000 lignes avec COMMIT régulier est la règle d'or des batchs bancaires."
  },
  {
    id: "ex_n5_03",
    gradeLevel: 5,
    question: "Quel est le gain technique décisif de l'utilisation conjointe de 'PREPARE' et d'un 'INSERT CURSOR' pour intégrer 1 000 000 de mouvements ?",
    options: [
      "Les lignes sont compressées en zip sur le serveur",
      "L'analyse syntaxique et le plan d'exécution de la requête SQL ne sont compilés qu'une seule fois par le SGBD, et les écritures réseau sont regroupées par blocs",
      "L'insertion ne vérifie pas les contraintes d'intégrité",
      "Le binaire utilise la carte graphique du serveur"
    ],
    correctIndex: 1,
    explanation: "Un INSERT classique répété un million de fois force un million d'allers-retours réseau et un million de compilations SQL. L'INSERT CURSOR réduit les I/O réseau d'un facteur 20 à 50.",
    trapWarning: "C'est la différence entre un batch qui met 4 heures et un batch qui s'exécute en 4 minutes !"
  },
  {
    id: "ex_n5_04",
    gradeLevel: 5,
    question: "Comment exécuter une requête SQL dynamique construite sous forme de chaîne de caractères lors de l'exécution d'un binaire 4GL ?",
    options: [
      "EVAL(chaine_sql)",
      "PREPARE identifiant FROM chaine_sql puis EXECUTE identifiant (ou DECLARE curseur FOR identifiant)",
      "RUN SQL chaine_sql",
      "SYSTEM chaine_sql"
    ],
    correctIndex: 1,
    explanation: "La syntaxe 4GL pour le SQL dynamique exige : PREPARE st_nom FROM variable_texte, puis EXECUTE st_nom USING parametres.",
    trapWarning: "Toujours libérer les requêtes préparées avec 'FREE st_nom' pour éviter les fuites de mémoire dans les sessions longues."
  },
  {
    id: "ex_n5_05",
    gradeLevel: 5,
    question: "Quelle commande de diagnostic Informix permet à un architecte d'inspecter l'utilisation des locks et d'identifier la session bloquante en production ?",
    options: ["onstat -k / onstat -u", "oncheck -pe", "ontape -s", "dbaccess sysmaster"],
    correctIndex: 0,
    explanation: "'onstat -k' affiche la table de tous les verrous actifs et 'onstat -u' donne la liste des sessions avec leurs threads et transactions en cours.",
    trapWarning: "En astreinte EOD, 'onstat -k' est la commande clé pour trouver l'adresse mémoire de la session qui bloque la chaîne batch."
  },
  {
    id: "ex_n5_06",
    gradeLevel: 5,
    question: "Pour optimiser un calcul massif d'intérêts de fin de mois sur 500 000 comptes, quelle technique de parallélisation est recommandée sous AIX ?",
    options: [
      "Lancer 10 instances du binaire 4GL en arrière-plan réparties par tranche de code agence ou modulo de compte (sharding applicatif)",
      "Mettre le serveur en mode single-user",
      "Augmenter la taille de police du terminal",
      "Désactiver la mémoire virtuelle"
    ],
    correctIndex: 0,
    explanation: "Le partitionnement logique du travail (sharding applicatif par agence ou tranche de compte) permet d'utiliser tous les cœurs du serveur AIX en parallèle sans conflit de verrous.",
    trapWarning: "S'assurer que les tranches sont mutuellement exclusives pour qu'aucun compte ne soit traité en double."
  },
  {
    id: "ex_n5_07",
    gradeLevel: 5,
    question: "Quel paramètre de configuration du moteur Informix (onconfig) contrôle la taille du cache des tampons de données en mémoire vive (Buffer Pool) ?",
    options: ["LOGFILES", "BUFFERPOOL (ou BUFFERS)", "LOCKS", "SHMVIRTSIZE"],
    correctIndex: 1,
    explanation: "Le paramètre BUFFERPOOL configure le nombre de tampons de pages (2K ou 4K) en mémoire partagée, déterminant le taux de hit mémoire (Read Cache Hit Ratio > 98%).",
    trapWarning: "Un Buffer Pool sous-dimensionné force le SGBD à lire en permanence sur les disques physiques, écroulant les performances du CBS."
  },
  {
    id: "ex_n5_08",
    gradeLevel: 5,
    question: "À quoi sert la directive 'UPDATE STATISTICS LOW / MEDIUM / HIGH' avant le lancement des arrêtés annuels ou mensuels volumineux ?",
    options: [
      "À réindexer et actualiser les statistiques d'histogrammes dans le catalogue système pour que l'optimiseur SQL choisisse le meilleur plan d'exécution",
      "À supprimer les lignes anciennes de la table d'audit",
      "À calculer la marge nette de la banque",
      "À vérifier que les disques durs ne sont pas fragmentés"
    ],
    correctIndex: 0,
    explanation: "L'optimiseur basé sur les coûts d'Informix s'appuie sur la distribution des valeurs (UPDATE STATISTICS HIGH) pour décider d'utiliser un index ou un scan séquentiel.",
    trapWarning: "Des statistiques obsolètes peuvent conduire l'optimiseur à faire un scan séquentiel complet d'une table de 10 millions de lignes plutôt que d'utiliser l'index !"
  },
  {
    id: "ex_n5_09",
    gradeLevel: 5,
    question: "Quelle instruction 4GL permet d'exécuter directement une commande système ou un script shell Unix depuis le code ?",
    options: ["EXEC_SHELL commande", "RUN commande [RETURNING variable]", "SHELL(commande)", "CALL SYSTEM(commande)"],
    correctIndex: 1,
    explanation: "L'instruction 'RUN \"script.sh\" RETURNING code_retour' délègue l'exécution à un sous-processus shell Unix et récupère le code de terminaison.",
    trapWarning: "Le binaire 4GL attend la fin du script shell avant de continuer, sauf si la commande Unix se termine par '&'."
  },
  {
    id: "ex_n5_10",
    gradeLevel: 5,
    question: "Comment déclarer et exploiter une table temporaire en mémoire/disque privée pour une session 4GL sans impacter les autres utilisateurs ?",
    options: [
      "CREATE TEMP TABLE t_nom (champs...) WITH NO LOG",
      "CREATE PRIVATE TABLE t_nom",
      "DECLARE TEMP TABLE t_nom",
      "CREATE CACHE TABLE t_nom"
    ],
    correctIndex: 0,
    explanation: "Les tables créées avec 'CREATE TEMP TABLE ... WITH NO LOG' sont stockées dans les dbspaces temporaires, n'écrivent pas dans les logical logs et sont détruites automatiquement à la fermeture de session.",
    trapWarning: "L'option WITH NO LOG accélère considérablement les traitements et n'encombre pas les journaux de transactions."
  },
  {
    id: "ex_n5_11",
    gradeLevel: 5,
    question: "Quelle est la cause principale de l'erreur Informix -271 ('Could not insert new row into the table') lors d'un traitement batch de masse ?",
    options: [
      "L'espace disque dans le Dbspace de données ou d'index est complètement saturé (tablespace plein)",
      "L'ordinateur client a été éteint",
      "Le mot de passe de la banque a changé",
      "Le câble réseau est déconnecté"
    ],
    correctIndex: 0,
    explanation: "L'erreur -271 accompagnée du sous-code ISAM -131 (no free space in dbspace) signifie qu'il n'y a plus aucun bloc libre pour agrandir la table ou son index.",
    trapWarning: "Exige l'intervention d'urgence du DBA pour ajouter un chunk de stockage au dbspace."
  },
  {
    id: "ex_n5_12",
    gradeLevel: 5,
    question: "Dans le cadre de l'architecture Core Banking Amplitude, pourquoi utilise-t-on le mécanisme de 'Two-Phase Commit' (2PC) ?",
    options: [
      "Pour synchroniser atomiquement des transactions réparties sur deux bases de données distinctes (ex: base monétique et base comptable)",
      "Pour doubler la vitesse des transactions",
      "Pour faire une sauvegarde le matin et une le soir",
      "Pour imprimer deux tickets de caisse au guichet"
    ],
    correctIndex: 0,
    explanation: "Le commit à deux phases (Prepare / Commit) garantit que les écritures réparties sur deux instances de bases hétérogènes sont soit validées toutes les deux, soit annulées toutes les deux.",
    trapWarning: "Si une liaison réseau tombe pendant la phase 2, la transaction passe en état 'in-doubt' jusqu'à résolution."
  },
  {
    id: "ex_n5_13",
    gradeLevel: 5,
    question: "Quelle clause 4GL permet de libérer les ressources d'une requête préparée dynamique afin de prévenir toute fuite mémoire dans un processus batch ?",
    options: ["FREE st_requete", "DROP st_requete", "CLEAR st_requete", "UNPREPARE st_requete"],
    correctIndex: 0,
    explanation: "L'instruction 'FREE identifiant' libère la mémoire allouée par le SGBD et le client 4GL pour la structure de l'ordre SQL préparé.",
    trapWarning: "Ne pas libérer les curseurs et requêtes préparées dans une boucle de 100 000 itérations consomme toute la mémoire virtuelle."
  },
  {
    id: "ex_n5_14",
    gradeLevel: 5,
    question: "Pour diagnostiquer le plan d'exécution précis d'une requête SQL complexe, quelle directive permet de générer le fichier de trace 'sqexplain.out' ?",
    options: [
      "SET EXPLAIN ON",
      "TRACE SQL TO FILE",
      "EXPLAIN PLAN FOR",
      "ACTIVATE SQL DEBUG"
    ],
    correctIndex: 0,
    explanation: "La commande Informix 'SET EXPLAIN ON' (ou SET EXPLAIN ON AVOID_EXEC) écrit l'analyse complète de l'optimiseur dans le fichier sqexplain.out.",
    trapWarning: "Penser à faire 'SET EXPLAIN OFF' dès l'analyse terminée pour ne pas dégrader les performances en production."
  },
  {
    id: "ex_n5_15",
    gradeLevel: 5,
    question: "Quelle stratégie d'indexation est recommandée sur une table transactionnelle de 50 millions de lignes (BKTRA) interrogée par date comptable et agence ?",
    options: [
      "Un index composite sur (AGE, DCO, NCP) ou un partitionnement par intervalle de date (table fragmentée par dbspace)",
      "Créer un index sur chacune des 40 colonnes de la table",
      "Ne créer aucun index pour accélérer les écritures",
      "Placer la table entière dans un fichier plat"
    ],
    correctIndex: 0,
    explanation: "La fragmentation de table par expression (ex: par trimestre ou année sur DCO) et un index composite adéquat limitent la recherche aux seuls dbspaces concernés (partition pruning).",
    trapWarning: "Avoir trop d'index ralentit drastiquement les ordres INSERT de la chaîne EOD."
  }
];
