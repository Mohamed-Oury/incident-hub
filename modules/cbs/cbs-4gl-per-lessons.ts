// modules/cbs/cbs-4gl-per-lessons.ts
import { Cbs4GlLesson } from "./cbs-4gl-data";

export const CBS_4GL_PER_LESSONS: Cbs4GlLesson[] = [
  // =========================================================================
  // GRADE 1 : APPRENTI DÉVELOPPEUR 4GL - ÉCRANS .PER FONDAMENTAUX
  // =========================================================================
  {
    id: "l1_per_01",
    gradeLevel: 1,
    category: "IHM_FORMULAIRES",
    title: "1.5 Conception d'un Premier Masque Écran .per (SCREEN, ATTRIBUTES & form4gl)",
    summary: "Structurez votre premier écran guichet 80x24 et découvrez le compilateur de formulaires Informix.",
    keyConcepts: ["DATABASE nom_base", "SCREEN { ... }", "TABLES bkcpt", "ATTRIBUTES f001 = ...", "form4gl binaire .frm"],
    detailedContent: `Un écran de saisie sous Informix 4GL est un fichier source texte portant l'extension '.per'.
Il est scindé en sections obligatoires :
1. 'DATABASE' : Déclare la base Amplitude de référence pour récupérer le typage des colonnes.
2. 'SCREEN' : Dessine l'interface utilisateur entre accolades '{ ... }'. Le terminal bancaire utilise une résolution classique VT100 de 80 colonnes par 24 lignes.
3. 'TABLES' : Liste les tables de base de données associées au formulaire (ex: BKCPT, BKCLI).
4. 'ATTRIBUTES' : Relie chaque champ physique de l'écran [f001] à un champ SQL ou virtuel (FORMONLY) en lui appliquant des règles (UPSHIFT, NOENTRY).
5. 'INSTRUCTIONS' : Spécifie les délimiteurs visuels (ex: DELIMITERS "[]").

Le binaire exécutable résultant porte l'extension '.frm' après compilation avec la commande AIX 'form4gl'.`,
    codeSample: `{ Masque de saisie de base : recherche d'un compte client }
DATABASE amplitude

SCREEN
{
================================================================================
                    CONSULTATION RAPIDE DE COMPTE GUICHET
================================================================================

    Code Agence   : [f001 ]
    Numéro Compte : [f002       ]

    Titulaire     : [f003                                    ]
    Solde Actuel  : [f004               ] XOF

================================================================================
}

TABLES
    bkcpt
    bkcli

ATTRIBUTES
    f001 = bkcpt.age, UPSHIFT, COMMENTS = "Code agence 5 car.";
    f002 = bkcpt.ncp, PICTURE = "###########", REQUIRED;
    f003 = bkcli.nom, NOENTRY, UPSHIFT;
    f004 = bkcpt.sol, FORMAT = "---,---,---,##&.&&", NOENTRY;

INSTRUCTIONS
    DELIMITERS "[]"`,
    explanation: "Ce fichier .per est compilé via form4gl pour générer le binaire .frm utilisé par l'instruction OPEN FORM dans le programme 4GL.",
    goldenRules: [
      "Toujours aligner les libellés et les champs de saisie pour une ergonomie optimale sur émulateur de terminal.",
      "Appliquer NOENTRY sur toutes les zones de restitution d'information pour éviter les altérations non voulues."
    ],
    pitfallsToAvoid: [
      "Oublier de déclarer une table dans la section TABLES tout en l'utilisant dans ATTRIBUTES bloque la compilation avec l'erreur -4305."
    ],
    resources: [
      {
        title: "IBM Informix Form-4GL User Guide",
        type: "MANUEL_INFORMIX",
        urlOrRef: "IBM-FORM4GL-MANUAL",
        description: "Guide exhaustif des spécifications de syntaxe pour la conception de formulaires .per."
      },
      {
        title: "Directives d'Ergonomie des Terminaux Guichet Amplitude",
        type: "NORMES_BANCAIRES",
        urlOrRef: "AMPLITUDE-GUI-VT100",
        description: "Normes graphiques bancaires pour les interfaces guichet sous émulateur SSH / Telnet."
      }
    ]
  },

  // =========================================================================
  // GRADE 2 : JUNIOR - ATTRIBUTS DE CONTRÔLE DÉCLARATIFS
  // =========================================================================
  {
    id: "l2_per_01",
    gradeLevel: 2,
    category: "IHM_FORMULAIRES",
    title: "2.5 Attributs Avancés de Validation Saisie (AUTONEXT, INCLUDE, PICTURE)",
    summary: "Blindez la saisie opérateur sans écrire une seule ligne de code procédural avec les contraintes d'attributs.",
    keyConcepts: ["AUTONEXT", "INCLUDE = (valeurs)", "PICTURE = 'motif'", "DEFAULT = valeur", "COMMENTS = 'aide'"],
    detailedContent: `Dans les agences bancaires, les erreurs de saisie sur les numéros de comptes ou codes opérations peuvent coûter des millions.
Informix Form-4GL permet de déporter la validation au niveau même du terminal :
- 'AUTONEXT' : Dès que le dernier caractère d'un champ fixe est tapé, le curseur saute immédiatement au champ suivant.
- 'INCLUDE' : Restreint les saisies possibles à une liste stricte de codes autorisés (ex: "XOF", "EUR", "USD"). Tout autre caractère est immédiatement rejeté avec un bip sonore du terminal.
- 'PICTURE' : Impose un gabarit rigide de saisie ('#' pour les chiffres, 'A' pour les lettres alphabétiques).
- 'COMMENTS' : Affiche une ligne d'aide dynamique en bas de l'écran dès que le champ prend le focus.`,
    codeSample: `{ Attributs déclaratifs bancaires rigoureux dans un écran .per }
ATTRIBUTES
    -- Code devise avec valeurs autorisées strictes
    f001 = bkcpt.dev, UPSHIFT, DEFAULT = "XOF",
           INCLUDE = ("XOF", "EUR", "USD", "GBP"),
           COMMENTS = "Sélectionnez une devise autorisée par la Banque Centrale";

    -- Numéro de compte à 11 chiffres avec saut automatique
    f002 = bkcpt.ncp, PICTURE = "###########",
           REQUIRED, AUTONEXT,
           COMMENTS = "Saisir les 11 chiffres du numéro de compte racine";

    -- Code guichet avec masque fixe
    f003 = FORMONLY.code_guichet TYPE CHAR(5),
           PICTURE = "#####", DEFAULT = "01001", AUTONEXT;

    -- Sens de l'opération monétaire (Débit ou Crédit uniquement)
    f004 = FORMONLY.sens_operation TYPE CHAR(1),
           UPSHIFT, REQUIRED, INCLUDE = ("D", "C"),
           COMMENTS = "D pour Débit, C pour Crédit";`,
    explanation: "La directive INCLUDE filtre les devises acceptées directement au niveau de la couche présentation sans solliciter le SGBD.",
    goldenRules: [
      "Systématiquement utiliser AUTONEXT sur les champs à longueur invariable (codes agences, devises, dates).",
      "Ajouter des COMMENTS utiles sur tous les champs de saisie pour guider l'opérateur sans documentation papier."
    ],
    pitfallsToAvoid: [
      "Ne pas utiliser PICTURE sur un champ dont la longueur peut varier : cela bloquerait la validation pour les valeurs courtes."
    ],
    resources: [
      {
        title: "Guide de Validation Déclarative Informix 4GL",
        type: "MANUEL_INFORMIX",
        urlOrRef: "4GL-DECLARATIVE-RULES",
        description: "Documentation des mécanismes de contrôle intégrés au compilateur de formulaires."
      },
      {
        title: "Standard de Saisie Sécurisée des Moyens de Paiement",
        type: "NORMES_BANCAIRES",
        urlOrRef: "STD-CBS-INPUT-SEC",
        description: "Contrôles obligatoires pour les opérations guichet de versement et de retrait d'espèces."
      }
    ]
  },

  // =========================================================================
  // GRADE 3 : CONFIRMÉ - TABLEAUX ÉCRANS & SCREEN RECORDS
  // =========================================================================
  {
    id: "l3_per_01",
    gradeLevel: 3,
    category: "IHM_FORMULAIRES",
    title: "3.5 Grilles Multi-Lignes & Défilement Avancé (SCREEN RECORD)",
    summary: "Concevez des écrans de saisie de remises de chèques et de virement de masse avec SCREEN RECORD et INPUT ARRAY.",
    keyConcepts: ["SCREEN RECORD s_lignes[5]", "INPUT ARRAY WITHOUT DEFAULTS", "AFTER ROW", "ARR_CURR()", "DELETE ROW"],
    detailedContent: `Un écran guichet bancaire doit fréquemment traiter des listes de données : bordereau de 50 chèques, liste de 100 prélèvements de masse ou consultation des mouvements récents.
Un 'SCREEN RECORD' regroupe plusieurs lignes de champs identiques dessinées dans la section SCREEN.
Le programme 4GL couple ensuite ce SCREEN RECORD avec l'instruction 'INPUT ARRAY' :
- L'opérateur peut naviguer entre les lignes avec les flèches haut/bas, insérer une ligne (F3) ou supprimer une ligne (F4).
- Les événements 'BEFORE ROW' et 'AFTER ROW' permettent de valider la ligne saisie et de recalculer en temps réel les totaux de contrôle (nombre de chèques et cumul des montants).`,
    codeSample: `{ Extrait du fichier .per avec SCREEN RECORD }
SCREEN
{
  LIG | NUM CHÈQUE | BANQUE TIRÉE | MONTANT DU CHÈQUE
  ----+------------+--------------+------------------
  [a1]| [f010    ] | [f011] [f012] | [f013           ]
  [a1]| [f010    ] | [f011] [f012] | [f013           ]
  [a1]| [f010    ] | [f011] [f012] | [f013           ]
  [a1]| [f010    ] | [f011] [f012] | [f013           ]
}
TABLES bkchq
ATTRIBUTES
  a1   = FORMONLY.num_lig TYPE SMALLINT, NOENTRY;
  f010 = bkchq.num_chq, PICTURE = "########", REQUIRED;
  f011 = bkchq.bq_tiree, PICTURE = "#####", REQUIRED;
  f012 = FORMONLY.nom_banque TYPE CHAR(12), NOENTRY;
  f013 = bkchq.mon, FORMAT = "--,---,---,##&.&&", REQUIRED;
INSTRUCTIONS
  DELIMITERS "[]"
  SCREEN RECORD s_chq[4] (
    FORMONLY.num_lig,
    bkchq.num_chq,
    bkchq.bq_tiree,
    FORMONLY.nom_banque,
    bkchq.mon
  )`,
    explanation: "s_chq[4] matérialise une fenêtre glissante de 4 lignes physiques sur un tableau mémoire pouvant contenir des centaines de chèques.",
    goldenRules: [
      "Toujours recalculer les totaux de bordereau dans le bloc 'AFTER ROW'.",
      "Protéger la suppression de ligne (DELETE ROW) par une demande de confirmation explicite."
    ],
    pitfallsToAvoid: [
      "Ne pas synchroniser le nombre de champs dans le SCREEN RECORD et dans le tableau mémoire 4GL entraîne une erreur fatale à l'exécution."
    ],
    resources: [
      {
        title: "IBM Informix Screen Record Architecture Guide",
        type: "MANUEL_INFORMIX",
        urlOrRef: "IBM-4GL-SCREEN-REC-MANUAL",
        description: "Spécifications de liaison entre tableaux mémoire 4GL et enregistrements d'écrans multi-lignes."
      }
    ]
  },

  // =========================================================================
  // GRADE 4 : SENIOR - FENÊTRES MODALES ET POPUPS D'AIDE LOV
  // =========================================================================
  {
    id: "l4_per_01",
    gradeLevel: 4,
    category: "IHM_FORMULAIRES",
    title: "4.4 Fenêtrage Modale, Popups de Recherche (LOV F1) & Superposition",
    summary: "Architecturez des popups superposées d'aide à la saisie (List of Values) sans perdre le contexte écran.",
    keyConcepts: ["OPEN WINDOW WITH FORM", "ATTRIBUTE (BORDER)", "CURRENT FORM IS", "CLOSE WINDOW", "Prompt Line"],
    detailedContent: `Dans une application bancaire complexe, un guichetier ne connaît pas par cœur les 10 000 codes tiers ou les 500 agences du réseau.
La touche [F1] doit ouvrir une sous-fenêtre modale superposée (Popup LOV - List Of Values) :
1. 'OPEN WINDOW w_nom AT lig, col WITH h ROWS, w COLUMNS ATTRIBUTE (BORDER)' : Dessine une fenêtre flottante encadrée par-dessus l'écran actif.
2. Un formulaire compact est affiché à l'intérieur, permettant de rechercher un tiers par nom ou par numéro d'immatriculation.
3. Après sélection par l'opérateur, 'CLOSE WINDOW w_nom' détruit la fenêtre popup et restitue pixel par pixel l'état exact de l'écran principal sous-jacent.
4. 'CURRENT FORM IS' réactive le formulaire appelant et le code injecte automatiquement la valeur choisie.`,
    codeSample: `{ Fonction 4GL de recherche modale avec restitution de valeur }
FUNCTION rechercher_tiers_modal()
    DEFINE l_cli CHAR(15),
           l_nom CHAR(45)

    -- Ouverture de la fenêtre modale superposée au centre de l'écran
    OPEN WINDOW w_rech AT 4, 10 WITH 15 ROWS, 62 COLUMNS
        ATTRIBUTE (BORDER, FORM LINE 1, PROMPT LINE 13)

    OPEN FORM f_rech FROM "popup_tiers"
    DISPLAY FORM f_rech

    CALL selectionner_tiers_grille() RETURNING l_cli, l_nom

    CLOSE FORM f_rech
    CLOSE WINDOW w_rech

    RETURN l_cli, l_nom
END FUNCTION`,
    explanation: "La fenêtre modale est créée avec BORDER et détruite après la sélection, garantissant l'absence de résidus graphiques.",
    goldenRules: [
      "Toujours encapsuler CLOSE WINDOW dans un gestionnaire d'interruption pour éviter de laisser une popup bloquée à l'écran.",
      "Vérifier les dimensions AT lig, col pour que la fenêtre ne dépasse jamais les bornes 80x24 du terminal."
    ],
    pitfallsToAvoid: [
      "Oublier l'instruction 'CURRENT FORM IS f_source' après la fermeture de la fenêtre modale : les futurs DISPLAY échoueront."
    ],
    resources: [
      {
        title: "Informix Windowing & Modal Dialog Patterns",
        type: "MANUEL_INFORMIX",
        urlOrRef: "IBM-WINDOWING-4GL",
        description: "Techniques avancées de gestion des fenêtres superposées, termcap et boîtes de dialogue modales."
      }
    ]
  },

  // =========================================================================
  // GRADE 5 : EXPERT - SÉCURITÉ DE SAISIE INVISIBLE, PCI-DSS & OPTIMISATION WAN
  // =========================================================================
  {
    id: "l5_per_01",
    gradeLevel: 5,
    category: "IHM_FORMULAIRES",
    title: "5.4 Sécurité Guichet PCI-DSS (Attribut INVISIBLE) & Tuning Réseau WAN",
    summary: "Protégez les codes PIN et mots de passe contre l'écoute réseau et compressez les flux d'écrans pour liaisons agences lentes.",
    keyConcepts: ["INVISIBLE", "Protection anti-shoulder surfing", "Compression des trames VT100", "Cache .frm local", "Audit trail"],
    detailedContent: `Au niveau d'expertise bancaire le plus élevé, deux impératifs s'affrontent :
1. Conformité Sécurité PCI-DSS : La saisie de codes confidentiels porteurs (PIN carte guichet, mot de passe superviseur pour forçage de découvert, clé cryptographique) impose l'attribut 'INVISIBLE' dans le fichier .per.
   Contrairement à un champ mot de passe web classique qui affiche des astérisques '****', l'attribut INVISIBLE désactive l'écho de frappe au niveau du pilote de terminal : le curseur ne bouge pas et aucun octet représentatif n'est émis en clair sur le réseau agence.
2. Performance WAN / VSAT : Pour les agences bancaires rurales connectées par satellite avec des latences de 800ms, l'ingénieur optimise les séquences d'échappement ANSI.
   Les fichiers formulaires .frm compilés sont stockés sur le disque local du poste d'agence ($DBPATH), réduisant les échanges réseau aux seuls paquets de données de saisie.`,
    codeSample: `{ Formulaire sécurisé pour forçage guichet sous habilitation }
DATABASE amplitude
SCREEN
{
  ==============================================================================
               VALIDATION & FORÇAGE SÉCURISÉ DÉPASSEMENT GUICHET
  ==============================================================================

    Montant Exceptionnel : [f001               ] XOF
    Identifiant Agent    : [f002      ]
    Mot de Passe Agent   : [f003        ]  (Saisie protégée - Aucun écho)

    Code Habilitation    : [f004    ]
    Clé d'Autorisation   : [f005        ]  (Clé OTP temporaire)

  ==============================================================================
}
ATTRIBUTES
    f001 = FORMONLY.montant TYPE DECIMAL(19,4), FORMAT = "---,---,---,##&.&&", NOENTRY;
    f002 = FORMONLY.user_id TYPE CHAR(10), UPSHIFT, REQUIRED;
    -- Champs protégés sans aucun écho visuel ni réseau
    f003 = FORMONLY.user_pwd TYPE CHAR(12), INVISIBLE, REQUIRED;
    f004 = FORMONLY.habil_code TYPE CHAR(6), UPSHIFT, REQUIRED;
    f005 = FORMONLY.otp_key TYPE CHAR(8), INVISIBLE, REQUIRED;
INSTRUCTIONS
    DELIMITERS "[]"`,
    explanation: "L'attribut INVISIBLE empêche tout espionnage visuel direct ou analyse de trame sur le poste guichetier.",
    goldenRules: [
      "Appliquer INVISIBLE sur tout champ contenant un mot de passe, code secret ou cryptogramme.",
      "Purger immédiatement de la mémoire les variables contenant les mots de passe une fois la validation effectuée."
    ],
    pitfallsToAvoid: [
      "Ne jamais afficher une variable saisie en INVISIBLE dans un log de débogage ou un fichier trace sur le serveur."
    ],
    resources: [
      {
        title: "Standard International de Sécurité PCI-DSS v4.0",
        type: "NORMES_BANCAIRES",
        urlOrRef: "PCI-DSS-BANKING-V4",
        description: "Normes obligatoires de protection des données sensibles d'authentification des porteurs et employés."
      },
      {
        title: "Architecture Haute Disponibilité Réseau Agences WAN/VSAT",
        type: "GUIDE_TECHNIQUE",
        urlOrRef: "CBS-WAN-LATENCY-TUNING",
        description: "Optimisation des performances d'affichage des formulaires sous forte latence réseau."
      }
    ]
  }
];
