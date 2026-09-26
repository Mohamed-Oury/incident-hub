// modules/cbs/cbs-4gl-per-screens-data.ts
import { Cbs4GlResource } from "./cbs-4gl-data";

export interface Cbs4GlPerScreenCourse {
  id: string;
  level: "DEBUTANT" | "INTERMEDIAIRE" | "AVANCE" | "EXPERT" | "IHM_GRAPHIQUE";
  levelOrder: number;
  title: string;
  summary: string;
  objectives: string[];
  perSourceCode: string;
  fourGlSourceCode: string;
  terminalMockup: string;
  guiMockup?: string;
  isGuiModern?: boolean;
  detailedAnalysis: string;
  keyDirectives: { directive: string; role: string; example: string }[];
  goldenRules: string[];
  compilationAndRuntime: {
    commandAix: string;
    generatedBinary: string;
    environmentVariables: string[];
    troubleshooting: string;
  };
  resources: Cbs4GlResource[];
}

export const CBS_4GL_PER_COURSES: Cbs4GlPerScreenCourse[] = [
  // =========================================================================
  // NIVEAU 1 : DÉBUTANT - STRUCTURE FONDAMENTALE D'UN ÉCRAN .PER
  // =========================================================================
  {
    id: "per_deb_01",
    level: "DEBUTANT",
    levelOrder: 1,
    title: "1. Structure Fondamentale d'un Écran .per (DATABASE, SCREEN, TABLES, ATTRIBUTES)",
    summary: "Maîtrisez la syntaxe canonique d'un masque de saisie Form-4GL, la grille 80x24 et le compilateur form4gl.",
    objectives: [
      "Comprendre les 5 sections d'un masque Informix : DATABASE, SCREEN, TABLES, ATTRIBUTES, INSTRUCTIONS",
      "Positionner les champs sur la grille ASCII 80 colonnes x 24 lignes avec les délimiteurs [f000]",
      "Compiler un masque .per en binaire .frm exécutable via form4gl / fglform"
    ],
    perSourceCode: `DATABASE amplitude

SCREEN
{
================================================================================
           BANQUE CENTRALE AMPLITUDE - CONSULTATION GUICHET (v11.x)
================================================================================

  Code Agence : [f001 ]          Date Arrêté : [f002      ]
  Numéro Cpt  : [f003       ]    Statut Cpt  : [f004]

  Titulaire   : [f005                                    ]
  Type Produit: [f006 ] [f007                                ]

  Solde Compt : [f008               ] XOF
  Indisponible: [f009               ] XOF
  Disponible  : [f010               ] XOF

================================================================================
  [F1] Aide  | [F2] Mouvements  | [F10] Valider  | [ESC/Ctrl+C] Quitter
================================================================================
}

TABLES
  bkcpt
  bkcli

ATTRIBUTES
  f001 = bkcpt.age, UPSHIFT, COMMENTS = "Code agence sur 5 caractères";
  f002 = FORMONLY.dco_ecran TYPE DATE, DEFAULT = TODAY, NOENTRY;
  f003 = bkcpt.ncp, PICTURE = "###########", REQUIRED;
  f004 = bkcpt.eta, UPSHIFT, INCLUDE = ("A", "F", "D", "B");
  f005 = bkcli.nom, UPSHIFT, NOENTRY;
  f006 = bkcpt.cha, NOENTRY;
  f007 = FORMONLY.lib_produit TYPE CHAR(30), NOENTRY;
  f008 = bkcpt.sol, FORMAT = "---,---,---,##&.&&", NOENTRY;
  f009 = bkcpt.sind, FORMAT = "---,---,---,##&.&&", NOENTRY;
  f010 = FORMONLY.solde_dispo TYPE DECIMAL(19,4), FORMAT = "---,---,---,##&.&&", NOENTRY;

INSTRUCTIONS
  DELIMITERS "[]"`,
    fourGlSourceCode: `DATABASE amplitude

MAIN
    DEFINE l_rec RECORD LIKE bkcpt.*,
           l_nom LIKE bkcli.nom,
           l_dispo DECIMAL(19,4)

    -- 1. Ouverture de la fenêtre et chargement du masque compilé .frm
    OPEN FORM f_consult FROM "cpt_consult"
    DISPLAY FORM f_consult

    -- 2. Saisie interactive du compte recherché
    INPUT l_rec.age, l_rec.ncp FROM f001, f003
        AFTER FIELD f003
            SELECT sol, sind, eta, cli 
              INTO l_rec.sol, l_rec.sind, l_rec.eta, l_rec.cli
              FROM bkcpt
             WHERE age = l_rec.age AND ncp = l_rec.ncp

            IF status = NOTFOUND THEN
                ERROR "Compte introuvable dans le référentiel agence !"
                NEXT FIELD f003
            END IF

            SELECT nom INTO l_nom FROM bkcli WHERE cli = l_rec.cli
            LET l_dispo = l_rec.sol - l_rec.sind

            DISPLAY l_rec.eta, l_nom, l_rec.sol, l_rec.sind, l_dispo
                 TO f004, f005, f008, f009, f010

        ON KEY (INTERRUPT)
            EXIT INPUT
    END INPUT

    CLOSE FORM f_consult
END MAIN`,
    terminalMockup: `+------------------------------------------------------------------------------+
|          BANQUE CENTRALE AMPLITUDE - CONSULTATION GUICHET (v11.x)            |
+------------------------------------------------------------------------------+
  Code Agence : [01001]          Date Arrêté : [26/09/2026]
  Numéro Cpt  : [01001004589]    Statut Cpt  : [A]

  Titulaire   : [DIALLO MOHAMED OURY                     ]
  Type Produit: [2101] [COMPTE DE CHEQUES PARTICULIERS    ]

  Solde Compt : [    14,850,000.00] XOF
  Indisponible: [       150,000.00] XOF
  Disponible  : [    14,700,000.00] XOF
+------------------------------------------------------------------------------+
  [F1] Aide  | [F2] Mouvements  | [F10] Valider  | [ESC/Ctrl+C] Quitter
+------------------------------------------------------------------------------+`,
    detailedAnalysis: `L'architecture d'un masque .per Informix repose sur 5 piliers :
1. DATABASE : Relie le compilateur au catalogue relationnel pour hériter directement des types de données, longueurs et contraintes du dictionnaire (ex: bkcpt.sol).
2. SCREEN : Délimite la matrice de caractères affichée sur le terminal VT100/VT220. Les labels sont écrits en clair, et chaque champ de saisie ou d'affichage est balisé entre délimiteurs [champ].
3. TABLES : Énumère les tables relationnelles dont les colonnes sont exploitées dans la section ATTRIBUTES.
4. ATTRIBUTES : Déclare le mapping entre chaque identifiant d'écran [f001] et sa colonne SQL ou variable 'FORMONLY'. On y associe des directives d'intégrité (REQUIRED, NOENTRY, PICTURE, FORMAT).
5. INSTRUCTIONS : Définit les options globales de comportement d'écran, notamment les caractères délimiteurs de saisie (DELIMITERS "[]").`,
    keyDirectives: [
      { directive: "FORMONLY.nom TYPE type", role: "Déclare un champ virtuel non lié à une table du SGBD", example: "f010 = FORMONLY.solde_dispo TYPE DECIMAL(19,4)" },
      { directive: "UPSHIFT", role: "Force automatiquement la casse en majuscules lors de la frappe", example: "f001 = bkcpt.age, UPSHIFT" },
      { directive: "NOENTRY", role: "Verrouille le champ en lecture seule (affichage pur, non modifiable)", example: "f008 = bkcpt.sol, NOENTRY" },
      { directive: "REQUIRED", role: "Empêche l'opérateur de quitter le champ s'il est vide", example: "f003 = bkcpt.ncp, REQUIRED" },
      { directive: "DELIMITERS", role: "Définit les caractères entourant visuellement les champs de saisie", example: "DELIMITERS '[]'" }
    ],
    goldenRules: [
      "Toujours aligner les colonnes de chiffres à droite avec un masque FORMAT précis (---,---,---,##&.&&).",
      "Ne jamais dépasser 79 colonnes de large pour éviter le repliement de ligne sur les émulateurs SSH bancaires.",
      "Utiliser NOENTRY sur toutes les zones calculées ou extraites pour empêcher toute falsification accidentelle."
    ],
    compilationAndRuntime: {
      commandAix: "form4gl cpt_consult.per  # ou fglform sous Informix moderne",
      generatedBinary: "cpt_consult.frm (fichier binaire de formulaire chargé en mémoire par OPEN FORM)",
      environmentVariables: ["$DBPATH : répertoire contenant les fichiers .frm", "$INFORMIXDIR : chemin d'installation", "$TERM : vt100 ou xterm"],
      troubleshooting: "Erreur -4302 (Form compilation error) : vérifiez la concordance exacte entre les tags [f001] du SCREEN et la section ATTRIBUTES."
    },
    resources: [
      {
        title: "IBM Informix 4GL Form-Building Guide (Manual)",
        type: "MANUEL_INFORMIX",
        urlOrRef: "IBM-4GL-FORMS-VOL1",
        description: "Guide officiel d'ingénierie des masques de saisie écran .per et règles du compilateur form4gl."
      },
      {
        title: "Guide de Standardisation Graphique des Écrans Amplitude v11/v12",
        type: "NORMES_BANCAIRES",
        urlOrRef: "STD-CBS-SCREEN-80X24",
        description: "Norme d'ergonomie guichet : position des en-têtes agence, séparateurs horizontaux et barres de fonctions F1..F12."
      }
    ]
  },

  // =========================================================================
  // NIVEAU 2 : INTERMÉDIAIRE - ATTRIBUTS AVANCÉS, VALIDATIONS & INTERACTIONS 4GL
  // =========================================================================
  {
    id: "per_int_02",
    level: "INTERMEDIAIRE",
    levelOrder: 2,
    title: "2. Attributs de Contrôle, Listes de Valeurs & Cycle de Vie Événementiel",
    summary: "Validez la saisie sans code additionnel (AUTONEXT, INCLUDE, PICTURE) et pilotez les événements BEFORE/AFTER FIELD.",
    objectives: [
      "Exploiter les attributs déclaratifs INCLUDE, PICTURE, DEFAULT, AUTONEXT",
      "Maîtriser les blocs événementiels INPUT BY NAME : BEFORE FIELD, AFTER FIELD, ON ROW",
      "Repositionner le focus utilisateur avec NEXT FIELD en cas d'anomalie métier"
    ],
    perSourceCode: `DATABASE amplitude

SCREEN
{
================================================================================
             SAISIE D'UN ORDRE DE VIREMENT BANCAIRE PERMANENT
================================================================================

  Référence Ordre  : [f001      ]           Date Ordre : [f002      ]
  Code Émetteur    : [f003       ]          Devise     : [f004]

  Bénéficiaire IBAN: [f005                                    ]
  Nom Bénéficiaire : [f006                                    ]

  Montant Virement : [f007               ]  Périodicité: [f008     ]
  Frais de Dossier : [f009               ]  Imputation : [f010      ]

  Code Motif Éch.  : [f011] [f012                                  ]

================================================================================
  [F5] Calculer Frais | [F8] Contrôle Provision | [F10] Valider | [ESC] Annuler
================================================================================
}

TABLES
  bkvir
  bkcpt

ATTRIBUTES
  f001 = bkvir.ref, UPSHIFT, REQUIRED, COMMENTS = "Numéro d'ordre unique généré";
  f002 = bkvir.dco, DEFAULT = TODAY, TYPE DATE;
  f003 = bkvir.ncp_ord, PICTURE = "###########", REQUIRED, AUTONEXT;
  f004 = bkvir.dev, DEFAULT = "XOF", INCLUDE = ("XOF", "EUR", "USD"), UPSHIFT;
  f005 = bkvir.iban_ben, PICTURE = "AA##-####-####-####-####-####-##", UPSHIFT, REQUIRED;
  f006 = bkvir.nom_ben, UPSHIFT, REQUIRED;
  f007 = bkvir.mon, FORMAT = "---,---,---,##&.&&", REQUIRED;
  f008 = FORMONLY.periodicite TYPE CHAR(10), INCLUDE = ("MENSUEL", "TRIMESTRE", "ANNUEL"), DEFAULT = "MENSUEL";
  f009 = bkvir.mnt_frais, FORMAT = "---,---,---,##&.&&", DEFAULT = 2500.00;
  f010 = FORMONLY.mode_frais TYPE CHAR(8), INCLUDE = ("DONNEUR", "BENEF", "PARTAGE"), DEFAULT = "DONNEUR";
  f011 = bkvir.mot, PICTURE = "###", REQUIRED, AUTONEXT;
  f012 = FORMONLY.lib_motif TYPE CHAR(35), NOENTRY;

INSTRUCTIONS
  DELIMITERS "[]"`,
    fourGlSourceCode: `FUNCTION saisir_ordre_virement()
    DEFINE l_vir RECORD LIKE bkvir.*,
           l_solde_dispo DECIMAL(19,4),
           l_lib_motif CHAR(35)

    OPEN FORM f_vir FROM "vir_saisie"
    DISPLAY FORM f_vir

    INPUT BY NAME l_vir.ref, l_vir.dco, l_vir.ncp_ord, l_vir.dev,
                  l_vir.iban_ben, l_vir.nom_ben, l_vir.mon, l_vir.mnt_frais,
                  l_vir.mot
        BEFORE FIELD ncp_ord
            MESSAGE "Saisir le compte émetteur à 11 chiffres (saut automatique)"

        AFTER FIELD ncp_ord
            -- Contrôle d'existence et récupération du disponible
            SELECT (sol - sind + NVL(deb, 0)) INTO l_solde_dispo
              FROM bkcpt
             WHERE ncp = l_vir.ncp_ord AND eta = "A"

            IF status = NOTFOUND THEN
                ERROR "Compte émetteur inexistant ou inactif !"
                NEXT FIELD ncp_ord
            END IF

        AFTER FIELD mon
            IF l_vir.mon <= 0 THEN
                ERROR "Le montant du virement doit être strictement positif !"
                NEXT FIELD mon
            END IF
            IF l_vir.mon > l_solde_dispo THEN
                ERROR "Provision insuffisante ! Disponible actuel : ", l_solde_dispo USING "---,---,##&.&&"
                NEXT FIELD mon
            END IF

        AFTER FIELD mot
            SELECT lib INTO l_lib_motif FROM bkmot WHERE mot = l_vir.mot
            IF status = NOTFOUND THEN
                ERROR "Code motif inconnu dans le référentiel !"
                NEXT FIELD mot
            END IF
            DISPLAY l_lib_motif TO f012

        ON KEY (F5)
            CALL simuler_grille_tarifaire(l_vir.mon)

        ON KEY (INTERRUPT)
            MESSAGE "Saisie abandonnée."
            EXIT INPUT
    END INPUT

    CLOSE FORM f_vir
END FUNCTION`,
    terminalMockup: `+------------------------------------------------------------------------------+
|             SAISIE D'UN ORDRE DE VIREMENT BANCAIRE PERMANENT                 |
+------------------------------------------------------------------------------+
  Référence Ordre  : [VIR-2026-0892]          Date Ordre : [26/09/2026]
  Code Émetteur    : [00100123456]          Devise     : [XOF]

  Bénéficiaire IBAN: [SN08-0100-1002-3456-7890-1234-56]
  Nom Bénéficiaire : [SONATEL S.A. SERVICE CORPORATE           ]

  Montant Virement : [     2,450,000.00]  Périodicité: [MENSUEL   ]
  Frais de Dossier : [         2,500.00]  Imputation : [DONNEUR ]

  Code Motif Éch.  : [014] [PAIEMENT FACTURE FOURNISSEUR      ]
+------------------------------------------------------------------------------+
  [F5] Calculer Frais | [F8] Contrôle Provision | [F10] Valider | [ESC] Annuler
+------------------------------------------------------------------------------+`,
    detailedAnalysis: `Ce niveau démontre la délégation des contrôles au moteur de formulaire :
1. PICTURE : Garantit le formatage obligatoire des chaînes (ex: "AA##-####" pour les IBAN, "###########" pour forcer 11 chiffres).
2. INCLUDE : Restreint les choix aux valeurs autorisées par le schéma bancaire (devises, périodicités). Toute frappe hors liste est rejetée nativement par le terminal.
3. AUTONEXT : Déplace immédiatement le curseur au champ suivant dès que la longueur maximale est atteinte, accélérant la saisie des guichetiers.
4. Événementiel 4GL : AFTER FIELD intercepte la sortie du champ NCP pour valider le solde temps réel et empêcher la saisie d'un montant supérieur au solde disponible.`,
    keyDirectives: [
      { directive: "INCLUDE = (val1, val2)", role: "Liste exhaustive des valeurs acceptées par le champ", example: "INCLUDE = ('XOF', 'EUR', 'USD')" },
      { directive: "PICTURE = 'motif'", role: "Masque de saisie avec gabarit de caractères imposé", example: "PICTURE = 'AA##-####-####'" },
      { directive: "AUTONEXT", role: "Saut automatique au champ suivant dès que le champ est plein", example: "f003 = bkvir.ncp_ord, AUTONEXT" },
      { directive: "DEFAULT = valeur", role: "Valeur pré-remplie par défaut à l'ouverture de l'écran", example: "DEFAULT = TODAY" },
      { directive: "NEXT FIELD champ", role: "Redirige le curseur et force la resaisie en cas d'erreur", example: "NEXT FIELD ncp_ord" }
    ],
    goldenRules: [
      "Toujours utiliser AUTONEXT sur les champs à longueur fixe (comptes, codes agence, devises).",
      "Fournir des messages d'erreur explicites indiquant la valeur requise plutôt qu'un simple 'Erreur'.",
      "Systématiquement réinitialiser les libellés descriptifs (f012) si l'utilisateur modifie le code clé."
    ],
    compilationAndRuntime: {
      commandAix: "form4gl -d vir_saisie.per  # Option -d pour vérifier l'intégrité avec le dictionnaire",
      generatedBinary: "vir_saisie.frm",
      environmentVariables: ["$FGLGUI : 0 pour mode terminal ASCII VT100 / 1 pour GUI"],
      troubleshooting: "Erreur -4320 : Incompatibilité de type entre la directive PICTURE et le type défini dans TABLES."
    },
    resources: [
      {
        title: "Informix 4GL Dynamic Field Validation Guide",
        type: "MANUEL_INFORMIX",
        urlOrRef: "IBM-4GL-VAL-FIELD",
        description: "Contrôles déclaratifs et gestion fine des événements AFTER FIELD et BEFORE INPUT."
      },
      {
        title: "Manuel des Normes de Sécurité SWIFT & IBAN dans Amplitude",
        type: "NORMES_BANCAIRES",
        urlOrRef: "CBS-NORM-IBAN-VAL",
        description: "Règles de conformité ISO 13616 pour la saisie et validation des coordonnées bancaires internationales."
      }
    ]
  },

  // =========================================================================
  // NIVEAU 3 : AVANCÉ - TABLEAUX DÉFILANTS SCREEN RECORD, DISPLAY & INPUT ARRAY
  // =========================================================================
  {
    id: "per_ava_03",
    level: "AVANCE",
    levelOrder: 3,
    title: "3. Tableaux Défilants Multi-Lignes (SCREEN RECORD, DISPLAY ARRAY & INPUT ARRAY)",
    summary: "Concevez des écrans de saisie et de consultation multi-lignes pour bordereaux de chèques et écritures comptables.",
    objectives: [
      "Déclarer des blocs répétitifs dans SCREEN et les grouper avec SCREEN RECORD dans INSTRUCTIONS",
      "Alimenter et paginer des tableaux en mémoire avec DISPLAY ARRAY et ARR_CURR()",
      "Permettre l'insertion, la suppression et la modification dynamique de lignes avec INPUT ARRAY"
    ],
    perSourceCode: `DATABASE amplitude

SCREEN
{
================================================================================
            BORDEREAU DE REMISE DE CHÈQUES À L'ENCAISSEMENT
================================================================================
  Bordereau N° : [f001      ]      Agence : [f002 ]      Date : [f003      ]
  Compte Remettant : [f004       ]  Nom    : [f005                             ]
--------------------------------------------------------------------------------
 LIG | N° CHÈQUE  | BANQUE TIRÉE | CODE GUICHET | MONTANT NOMINAL | DATE ÉMISSION
--------------------------------------------------------------------------------
 [l1]| [f010    ] | [f011] [f012] | [f013]      | [f014         ] | [f015      ]
 [l1]| [f010    ] | [f011] [f012] | [f013]      | [f014         ] | [f015      ]
 [l1]| [f010    ] | [f011] [f012] | [f013]      | [f014         ] | [f015      ]
 [l1]| [f010    ] | [f011] [f012] | [f013]      | [f014         ] | [f015      ]
 [l1]| [f010    ] | [f011] [f012] | [f013]      | [f014         ] | [f015      ]
--------------------------------------------------------------------------------
 Nombre de Chèques : [f020 ]               Total Bordereau : [f021             ]
================================================================================
  [F1] Ligne Suiv. | [F3] Insérer | [F4] Supprimer | [F10] Valider | [ESC] Quitter
================================================================================
}

TABLES
  bkrem_chq
  bkchq

ATTRIBUTES
  f001 = bkrem_chq.num_rem, UPSHIFT, REQUIRED;
  f002 = bkrem_chq.age, NOENTRY;
  f003 = bkrem_chq.dco, DEFAULT = TODAY, TYPE DATE, NOENTRY;
  f004 = bkrem_chq.ncp, REQUIRED, PICTURE = "###########";
  f005 = FORMONLY.nom_remettant TYPE CHAR(35), NOENTRY;

  -- Éléments de la grille répétitive
  l1   = FORMONLY.num_ligne TYPE SMALLINT, NOENTRY;
  f010 = bkchq.num_chq, PICTURE = "########", REQUIRED;
  f011 = bkchq.bq_tiree, PICTURE = "#####", REQUIRED;
  f012 = FORMONLY.nom_banque TYPE CHAR(15), NOENTRY;
  f013 = bkchq.gui_tire, PICTURE = "#####", REQUIRED;
  f014 = bkchq.mon, FORMAT = "--,---,---,##&.&&", REQUIRED;
  f015 = bkchq.demi, TYPE DATE, REQUIRED;

  f020 = FORMONLY.nb_cheques TYPE SMALLINT, NOENTRY;
  f021 = FORMONLY.total_montant TYPE DECIMAL(19,4), FORMAT = "---,---,---,##&.&&", NOENTRY;

INSTRUCTIONS
  DELIMITERS "[]"
  SCREEN RECORD s_lignes[5] (
    FORMONLY.num_ligne,
    bkchq.num_chq,
    bkchq.bq_tiree,
    FORMONLY.nom_banque,
    bkchq.gui_tire,
    bkchq.mon,
    bkchq.demi
  )`,
    fourGlSourceCode: `FUNCTION saisir_bordereau_remise()
    DEFINE l_lignes ARRAY[100] OF RECORD
               num_lig SMALLINT,
               num_chq CHAR(8),
               bq_tiree CHAR(5),
               nom_bq CHAR(15),
               gui_tire CHAR(5),
               mon DECIMAL(19,4),
               demi DATE
           END RECORD,
           l_total DECIMAL(19,4),
           l_nb SMALLINT,
           l_curr SMALLINT

    OPEN FORM f_rem FROM "rem_cheques_grid"
    DISPLAY FORM f_rem

    INPUT ARRAY l_lignes WITHOUT DEFAULTS FROM s_lignes.*
        BEFORE ROW
            LET l_curr = ARR_CURR()
            LET l_lignes[l_curr].num_lig = l_curr
            DISPLAY l_curr TO s_lignes[SCR_LINE()].num_ligne

        AFTER FIELD bq_tiree
            SELECT lib_court INTO l_lignes[l_curr].nom_bq
              FROM bkbq WHERE bq = l_lignes[l_curr].bq_tiree
            DISPLAY l_lignes[l_curr].nom_bq TO s_lignes[SCR_LINE()].nom_banque

        AFTER ROW
            LET l_total = 0
            LET l_nb = ARR_COUNT()
            FOR i = 1 TO l_nb
                LET l_total = l_total + NVL(l_lignes[i].mon, 0)
            END FOR
            DISPLAY l_nb, l_total TO f020, f021

        ON KEY (F4)
            DELETE ROW l_curr
    END INPUT

    CLOSE FORM f_rem
END FUNCTION`,
    terminalMockup: `+------------------------------------------------------------------------------+
|            BORDEREAU DE REMISE DE CHÈQUES À L'ENCAISSEMENT                   |
+------------------------------------------------------------------------------+
  Bordereau N° : [REM-2026-0045]      Agence : [01001]      Date : [26/09/2026]
  Compte Remettant : [01001008745]  Nom    : [ETABLISSEMENTS KABA & FRERES     ]
--------------------------------------------------------------------------------
 LIG | N° CHÈQUE  | BANQUE TIRÉE | CODE GUICHET | MONTANT NOMINAL | DATE ÉMISSION
--------------------------------------------------------------------------------
 [ 1]| [00485912] | [00125] [SGBS           ] | [01002]      | [     850,000.00] | [20/09/2026]
 [ 2]| [00129485] | [00085] [BICIS          ] | [00001]      | [   1,200,000.00] | [22/09/2026]
 [ 3]| [00778410] | [00150] [CBAO           ] | [01005]      | [     340,500.00] | [24/09/2026]
 [ 4]| [        ] | [     ] [               ] | [     ]      | [               ] | [          ]
 [ 5]| [        ] | [     ] [               ] | [     ]      | [               ] | [          ]
--------------------------------------------------------------------------------
 Nombre de Chèques : [ 3  ]               Total Bordereau : [       2,390,500.00]
+------------------------------------------------------------------------------+
  [F1] Ligne Suiv. | [F3] Insérer | [F4] Supprimer | [F10] Valider | [ESC] Quitter
+------------------------------------------------------------------------------+`,
    detailedAnalysis: `La puissance des tableaux écrans réside dans l'abstraction de la pagination :
1. SCREEN RECORD : Déclare un groupe de champs répétés (ici s_lignes[5] pour 5 lignes physiques à l'écran).
2. INPUT ARRAY : Gère automatiquement les touches de défilement (Flèches, Page Up, Page Down), l'insertion de ligne et la suppression.
3. SCR_LINE() vs ARR_CURR() : 
   - SCR_LINE() renvoie la ligne physique visible sur l'écran (1 à 5).
   - ARR_CURR() renvoie l'indice réel dans le tableau mémoire 4GL (ex: ligne 42 d'un bordereau de 100 chèques).
4. AFTER ROW : Permet d'actualiser instantanément les totaux généraux d'équilibre de bordereau dès que l'opérateur quitte une ligne.`,
    keyDirectives: [
      { directive: "SCREEN RECORD nom[N] (champs...)", role: "Définit un tableau écran virtuel de N lignes répétées", example: "SCREEN RECORD s_lignes[5] (col1, col2, col3)" },
      { directive: "INPUT ARRAY tab FROM s_rec.*", role: "Active la saisie tabulaire avec gestion des touches système", example: "INPUT ARRAY l_tab FROM s_lignes.*" },
      { directive: "DISPLAY ARRAY tab TO s_rec.*", role: "Affiche une liste défilante en consultation", example: "DISPLAY ARRAY l_tab TO s_lignes.*" },
      { directive: "ARR_CURR()", role: "Indice de l'élément courant dans le tableau en mémoire", example: "LET l_idx = ARR_CURR()" },
      { directive: "SCR_LINE()", role: "Numéro de la ligne physique actuellement affichée sur le terminal (1..N)", example: "DISPLAY val TO s_rec[SCR_LINE()].col" }
    ],
    goldenRules: [
      "Toujours recalculer les totaux de contrôle dans l'événement AFTER ROW.",
      "Dimensionner le tableau mémoire 4GL (ARRAY) avec une marge suffisante (ex: 200 lignes) pour éviter le dépassement d'indice.",
      "Valider la cohérence de chaque ligne individuellement avant de permettre la création d'une nouvelle ligne."
    ],
    compilationAndRuntime: {
      commandAix: "form4gl rem_cheques_grid.per",
      generatedBinary: "rem_cheques_grid.frm",
      environmentVariables: ["$FGL_ROW_INSERT / $FGL_ROW_DELETE pour configurer les touches d'édition"],
      troubleshooting: "Erreur -4341 : Le nombre de champs dans la clause SCREEN RECORD ne correspond pas au nombre de champs déclarés dans le SCREEN."
    },
    resources: [
      {
        title: "IBM Informix Screen Records & Array Handling",
        type: "MANUEL_INFORMIX",
        urlOrRef: "IBM-4GL-SCREEN-RECORDS",
        description: "Guide technique approfondi de manipulation des SCREEN RECORDS, curseurs mémoire et défilement tabulaire."
      },
      {
        title: "Manuel des Procédures de Compensation Chèques et Effets Amplitude",
        type: "NORMES_BANCAIRES",
        urlOrRef: "CBS-CLEARING-CHECK-PROC",
        description: "Spécifications de validation des bordereaux de remise, pistes CMC7 et contrôles de solde interbancaire."
      }
    ]
  },

  // =========================================================================
  // NIVEAU 4 : EXPERT - FENÊTRAGE DYNAMIQUE, SÉCURITÉ INVISIBLE & PERF WAN
  // =========================================================================
  {
    id: "per_exp_04",
    level: "EXPERT",
    levelOrder: 4,
    title: "4. Fenêtrage Guichet Multi-Écrans (OPEN WINDOW), Sécurité INVISIBLE & Optimisation WAN",
    summary: "Architecturez des sous-fenêtres modales d'aide (LOV), masquez les données bancaires confidentielles et compressez les flux.",
    objectives: [
      "Créer des fenêtres modales superposées avec OPEN WINDOW ... WITH FORM",
      "Sécuriser la saisie des données sensibles (Code PIN, cryptogrammes) avec l'attribut INVISIBLE",
      "Construire des fenêtres d'aide contextuelle F1 (List of Values / LOV) avec sélection et retour de valeur",
      "Optimiser le trafic terminal VT100 sur liaisons réseaux WAN agences lentes"
    ],
    perSourceCode: `DATABASE amplitude

SCREEN
{
================================================================================
             AUTORISATION GUICHET & RETRAIT D'ESPÈCES DÉPLACÉ
================================================================================

  Agence Opération : [f001 ]          Date Comptable : [f002      ]
  Numéro de Compte : [f003       ]    [F1=Recherche Tiers]
  Titulaire Compte : [f004                                    ]

  Montant Retrait  : [f005               ] XOF
  Solde Disponible : [f006               ] XOF

  Authentification Sécurisée Porteur :
  Code PIN Guichet : [f007    ]       Cryptogramme CVV2: [f008 ]

  Profil Superviseur : [f009      ]   Mot de Passe Sup.: [f010    ]
  Motif Dérogation   : [f011                                                  ]

================================================================================
  [F1] Liste des Comptes | [F9] Forçage Superviseur | [F10] Valider | [ESC] Annuler
================================================================================
}

TABLES
  bkcpt
  bkope

ATTRIBUTES
  f001 = bkope.age, DEFAULT = "01001", NOENTRY;
  f002 = FORMONLY.dco_jour TYPE DATE, DEFAULT = TODAY, NOENTRY;
  f003 = bkcpt.ncp, PICTURE = "###########", REQUIRED, AUTONEXT;
  f004 = FORMONLY.nom_titulaire TYPE CHAR(40), NOENTRY;
  f005 = bkope.mon, FORMAT = "---,---,---,##&.&&", REQUIRED;
  f006 = FORMONLY.solde_dispo TYPE DECIMAL(19,4), FORMAT = "---,---,---,##&.&&", NOENTRY;

  -- Saisie confidentielle masquée à l'écran
  f007 = FORMONLY.code_pin TYPE CHAR(4), INVISIBLE, REQUIRED, PICTURE = "####";
  f008 = FORMONLY.cvv2 TYPE CHAR(3), INVISIBLE, REQUIRED, PICTURE = "###";

  -- Bloc de forçage sous habilitation
  f009 = FORMONLY.superviseur_id TYPE CHAR(10), UPSHIFT;
  f010 = FORMONLY.superviseur_pwd TYPE CHAR(12), INVISIBLE;
  f011 = FORMONLY.motif_derogation TYPE VARCHAR(60), UPSHIFT;

INSTRUCTIONS
  DELIMITERS "[]"`,
    fourGlSourceCode: `FUNCTION executer_retrait_especes()
    DEFINE l_ncp LIKE bkcpt.ncp,
           l_mon DECIMAL(19,4),
           l_pin CHAR(4),
           l_cvv CHAR(3),
           l_sup_id CHAR(10),
           l_sup_pwd CHAR(12)

    OPEN FORM f_ret FROM "retrait_guichet"
    DISPLAY FORM f_ret

    INPUT l_ncp, l_mon, l_pin, l_cvv, l_sup_id, l_sup_pwd
        FROM f003, f005, f007, f008, f009, f010

        ON KEY (F1)
            OPEN WINDOW w_aide AT 5, 10 WITH 12 ROWS, 60 COLUMNS
                ATTRIBUTE (BORDER, PROMPT LINE 1, MESSAGE LINE 2)
            CALL popup_selection_compte() RETURNING l_ncp
            CLOSE WINDOW w_aide
            
            CURRENT FORM IS f_ret
            DISPLAY l_ncp TO f003
            NEXT FIELD f005

        AFTER FIELD f005
            IF l_mon > 5000000 THEN
                MESSAGE "Retrait supérieur au seuil standard : validation superviseur requise !"
                NEXT FIELD f009
            END IF

        AFTER FIELD f010
            IF NOT controler_habilitation_superviseur(l_sup_id, l_sup_pwd) THEN
                ERROR "Authentification superviseur invalide ou droits insuffisants !"
                NEXT FIELD f009
            END IF

        ON KEY (INTERRUPT)
            EXIT INPUT
    END INPUT

    CLOSE FORM f_ret
END FUNCTION`,
    terminalMockup: `+------------------------------------------------------------------------------+
|             AUTORISATION GUICHET & RETRAIT D'ESPÈCES DÉPLACÉ                 |
+------------------------------------------------------------------------------+
  Agence Opération : [01001]          Date Comptable : [26/09/2026]
  Numéro de Compte : [01001009845]    [F1=Recherche Tiers]
  Titulaire Compte : [MANSOUROU BARRY - SARL AGRO-BUSINESS    ]

  Montant Retrait  : [     7,500,000.00] XOF
  Solde Disponible : [    18,400,000.00] XOF

  Authentification Sécurisée Porteur :
  Code PIN Guichet : [****]           Cryptogramme CVV2: [***]

  Profil Superviseur : [SUP_AGENCE]   Mot de Passe Sup.: [************]
  Motif Dérogation   : [DEPASSEMENT PLAFOND JOURNALIER ACCORDE PAR DIRECTION  ]
+------------------------------------------------------------------------------+
  [F1] Liste des Comptes | [F9] Forçage Superviseur | [F10] Valider | [ESC] Annuler
+------------------------------------------------------------------------------+`,
    detailedAnalysis: `Ce niveau expert résout deux enjeux critiques de sécurité et d'architecture :
1. Sécurité PCI-DSS & Confidentialité : L'attribut INVISIBLE désactive l'écho des caractères sur le terminal (ni texte ni astérisques envoyés en clair sur la ligne série/SSH), protégeant les codes secrets contre les regards indiscrets (shoulder surfing).
2. Fenêtrage superposé (OPEN WINDOW) : Permet d'ouvrir une popup autonome (avec bordure BORDER, ligne de prompt dédiée) par-dessus l'écran principal, d'exécuter une recherche interactive, puis de refermer la popup avec CLOSE WINDOW en restituant l'écran initial sans aucun artefact d'affichage.
3. Optimisation WAN bancaire : Pour les agences distantes connectées en VSAT ou liaison 2G/3G, le formulaire compilé (.frm) est mis en cache localement côté client, minimisant les échanges réseau aux seuls octets de données.`,
    keyDirectives: [
      { directive: "INVISIBLE", role: "Empêche l'affichage à l'écran de la valeur saisie (pour mots de passe et codes PIN)", example: "f007 = FORMONLY.code_pin TYPE CHAR(4), INVISIBLE" },
      { directive: "OPEN WINDOW w_nom AT lig, col WITH h ROWS, w COLS ATTRIBUTE (BORDER)", role: "Crée une fenêtre modale superposée avec cadre", example: "OPEN WINDOW w_aide AT 5, 10 WITH 12 ROWS, 60 COLUMNS ATTRIBUTE (BORDER)" },
      { directive: "CLOSE WINDOW w_nom", role: "Détruit la fenêtre et restaure automatiquement la vue antérieure", example: "CLOSE WINDOW w_aide" },
      { directive: "CURRENT FORM IS f_nom", role: "Redonne explicitement le focus au formulaire actif après une popup", example: "CURRENT FORM IS f_ret" }
    ],
    goldenRules: [
      "Appliquer systématiquement l'attribut INVISIBLE sur tout mot de passe, code confidentiel ou cryptogramme carte.",
      "Toujours encapsuler l'ouverture de fenêtre modale dans un bloc propre avec CLOSE WINDOW garanti même en cas d'annulation.",
      "Ne jamais laisser de sessions ouvertes avec des transactions pendantes lors de l'attente d'une validation superviseur."
    ],
    compilationAndRuntime: {
      commandAix: "form4gl -s retrait_guichet.per  # Option silencieuse pour scripts de déploiement CI/CD",
      generatedBinary: "retrait_guichet.frm",
      environmentVariables: ["$FGLWINDOW : gestion des dimensions de terminaux", "$INFORMIXTERM : termcap / terminfo"],
      troubleshooting: "Erreur -4314 : Dépassement de la taille physique de l'écran lors d'un OPEN WINDOW (coordonnées AT + dimensions hors des 80x24)."
    },
    resources: [
      {
        title: "Architecture Multi-Fenêtres & Fenêtrage Modale Informix 4GL",
        type: "MANUEL_INFORMIX",
        urlOrRef: "IBM-4GL-WINDOWS-MODAL",
        description: "Conception de sous-systèmes fenêtrés, gestion des bordures et interaction multi-formulaires."
      },
      {
        title: "Normes de Sécurité Bancaire PCI-DSS pour Applications Core Banking",
        type: "NORMES_BANCAIRES",
        urlOrRef: "PCI-DSS-AMPLITUDE-SEC",
        description: "Directives de chiffrement, masquage des données sensibles d'authentification et traçabilité des forçages superviseurs."
      },
      {
        title: "Guide de Tuning Terminal AIX / Unix pour Réseaux WAN Agences",
        type: "GUIDE_TECHNIQUE",
        urlOrRef: "AIX-TERM-WAN-OPTIM",
        description: "Optimisation des buffers terminfo, réduction du jitter et compression des trames d'affichage VT100."
      }
    ]
  },

  // =========================================================================
  // NIVEAU 5 : IHM GRAPHIQUE MODERNE (GENERO BDL, SCHEMA, LAYOUT, HBOX, VBOX, GRID)
  // =========================================================================
  {
    id: "per_gui_05",
    level: "IHM_GRAPHIQUE",
    levelOrder: 5,
    title: "5. IHM Graphique Moderne Genero (SCHEMA, LAYOUT, GRID, HBOX, VBOX, FOLDER, TABLE)",
    summary: "Concevez des écrans graphiques riches (Desktop GDC & Web GWC) : SCHEMA logique, conteneurs dynamiques HBOX/VBOX, grilles GRID et tables TABLE avec double-clic.",
    isGuiModern: true,
    objectives: [
      "Employer systématiquement la directive SCHEMA plutôt que DATABASE pour découpler la compilation des instances physiques",
      "Organiser l'IHM avec des conteneurs responsives modernes : LAYOUT, VBOX, HBOX (SPLITTER) et GRID",
      "Structurer la navigation multi-vues via FOLDER et PAGE (onglets graphiques)",
      "Définir des composants TABLE avec double-clic interactif (DOUBLECLICK) et colonnes redimensionnables",
      "Compiler en binaire .42f exécutable avec le client lourd GDC ou le client Web GWC d'Amplitude"
    ],
    perSourceCode: `SCHEMA amplitude_db

LAYOUT (TEXT = "Banque Amplitude - Fiche 360° Client & Soldes Temps Réel", STYLE = "main_window")
VBOX
  GRID
  {
  Code Agence : [f001 ]               Date Système : [f002      ]
  Numéro Cpt  : [f003       ]         Statut Compte: [f004] [lib_statut        ]
  }
  END -- GRID

  HBOX (SPLITTER)
    GRID
    {
    <G "Informations Tiers & KYC"                                                >
    Code Client : [f005      ]  Type Tiers : [f006 ]
    Raison/Nom  : [f007                                                        ]
    Nationalité : [f008 ]       Segment    : [f009           ]
    }
    END -- GRID

    GRID
    {
    <G "Synthèse Soldes & Risques (XOF)"                                        >
    Solde Comptable  : [f010               ]
    Montant Bloqué   : [f011               ]
    Disponible Réel  : [f012               ]
    Autorisation Dév.: [f013               ]
    }
    END -- GRID
  END -- HBOX

  FOLDER
    PAGE tab_mvt (TEXT = "Derniers Mouvements Bancaires")
      TABLE (DOUBLECLICK = detail_mouvement)
      {
      Réf Écriture    Date Val.    Libellé Opération                   Débit          Crédit
      [t01          ] [t02       ] [t03                              ] [t04         ] [t05         ]
      [t01          ] [t02       ] [t03                              ] [t04         ] [t05         ]
      [t01          ] [t02       ] [t03                              ] [t04         ] [t05         ]
      }
      END -- TABLE
    END -- PAGE

    PAGE tab_cards (TEXT = "Cartes & Moyens de Paiement")
      GRID
      {
      PAN Porteur     : [c01                 ] Type Carte : [c02        ]
      Date Expiration : [c03  ] Statut : [c04      ] Plafond Retrait : [c05        ]
      }
      END -- GRID
    END -- PAGE
  END -- FOLDER
END -- VBOX

TABLES
  bkcpt
  bkcli

ATTRIBUTES
  f001 = bkcpt.age, UPSHIFT, STYLE = "mandatory", COMMENTS = "Code agence 5 caractères";
  f002 = FORMONLY.dco_ecran TYPE DATE, DEFAULT = TODAY, NOENTRY;
  f003 = bkcpt.ncp, PICTURE = "###########", REQUIRED, STYLE = "account_no";
  f004 = bkcpt.eta, UPSHIFT, INCLUDE = ("A", "F", "D", "B");
  lib_statut = FORMONLY.lib_eta TYPE VARCHAR(20), NOENTRY, STYLE = "badge_active";
  f005 = bkcli.cli, NOENTRY;
  f006 = bkcli.typ, NOENTRY;
  f007 = bkcli.nom, NOENTRY, STYLE = "bold_label";
  f008 = bkcli.nat, NOENTRY;
  f009 = FORMONLY.segment_client TYPE VARCHAR(20), NOENTRY;
  f010 = bkcpt.sol, FORMAT = "---,---,---,##&.&&", NOENTRY;
  f011 = bkcpt.sind, FORMAT = "---,---,---,##&.&&", NOENTRY;
  f012 = FORMONLY.solde_dispo TYPE DECIMAL(19,4), FORMAT = "---,---,---,##&.&&", NOENTRY, STYLE = "kpi_positive";
  f013 = FORMONLY.aut_decouvert TYPE DECIMAL(16,2), FORMAT = "---,---,---,##&.&&", NOENTRY;

  t01  = FORMONLY.ref_mvt TYPE CHAR(14), NOENTRY;
  t02  = FORMONLY.dat_val TYPE DATE, NOENTRY;
  t03  = FORMONLY.lib_mvt TYPE VARCHAR(35), NOENTRY;
  t04  = FORMONLY.mnt_deb TYPE DECIMAL(14,2), FORMAT = "---,---,--&.&&", NOENTRY;
  t05  = FORMONLY.mnt_cre TYPE DECIMAL(14,2), FORMAT = "---,---,--&.&&", NOENTRY;

  c01  = FORMONLY.pan_masque TYPE CHAR(19), NOENTRY;
  c02  = FORMONLY.card_type TYPE VARCHAR(15), NOENTRY;
  c03  = FORMONLY.exp_date TYPE CHAR(5), NOENTRY;
  c04  = FORMONLY.card_status TYPE VARCHAR(12), NOENTRY;
  c05  = FORMONLY.card_plafond TYPE DECIMAL(12,2), FORMAT = "---,---,--&.&&", NOENTRY;

INSTRUCTIONS
  SCREEN RECORD s_mvt (ref_mvt, dat_val, lib_mvt, mnt_deb, mnt_cre)
END`,
    fourGlSourceCode: `###############################################################################
# Programme Genero BDL moderne pour IHM Graphique : cpt_consult_gui.4gl
###############################################################################
SCHEMA amplitude_db

DEFINE g_rec RECORD LIKE bkcpt.*,
       g_cli RECORD LIKE bkcli.*,
       g_mvt DYNAMIC ARRAY OF RECORD
           ref_mvt  CHAR(14),
           dat_val  DATE,
           lib_mvt  VARCHAR(35),
           mnt_deb  DECIMAL(14,2),
           mnt_cre  DECIMAL(14,2)
       END RECORD

MAIN
    -- Chargement du profil d'actions graphiques (barre d'outils, raccourcis)
    CALL ui.Interface.loadActionDefaults("amplitude_actions")
    
    OPEN FORM f_gui FROM "cpt_consult_gui"
    DISPLAY FORM f_gui

    -- Saisie interactive via la boucle événementielle moderne DIALOG (multi-interactions)
    DIALOG ATTRIBUTES(UNBUFFERED)
        INPUT BY NAME g_rec.age, g_rec.ncp
            AFTER FIELD ncp
                CALL charger_dossier_client(g_rec.age, g_rec.ncp)
                CALL charger_mouvements(g_rec.age, g_rec.ncp)
                DISPLAY ARRAY g_mvt TO s_mvt.*
        END INPUT

        DISPLAY ARRAY g_mvt TO s_mvt.*
            ON ACTION detail_mouvement
                CALL afficher_zoom_ecriture(g_mvt[ARR_CURR()].ref_mvt)
        END DISPLAY

        ON ACTION export_excel
            CALL exporter_grille_vers_calc(g_rec.ncp)

        ON ACTION imprimer_releve
            CALL generer_pdf_releve(g_rec.age, g_rec.ncp)

        ON ACTION close
            EXIT DIALOG
    END DIALOG

    CLOSE FORM f_gui
END MAIN`,
    terminalMockup: `+------------------------------------------------------------------------------+
| [GUI CLIENT WEB/GDC] BANQUE AMPLITUDE - FICHE 360° CLIENT & SOLDES           |
+------------------------------------------------------------------------------+
  [VBOX: En-tête Agence & Compte]
  Agence : [01001]                     Date Système : [26/09/2026]
  Compte : [01001009845]               Statut       : [A] [ACTIF / NORMAL   ]
  +-------------------------------------+--------------------------------------+
  | [HBOX Gauche: Tiers & KYC]          | [HBOX Droite: Soldes & Risques]      |
  | Client : [CLI-008472]  (Particulier)| Solde Comptable : [   14,850,000.00] |
  | Nom    : [DIOP AMADOU MAMADOU     ] | Montant Bloqué  : [      350,000.00] |
  | Pays   : [SN] SÉNÉGAL               | Disponible Réel : [   14,500,000.00] |
  | Segment: [PREMIUM PRIVATE BANK    ] | Aut. Découvert  : [    2,000,000.00] |
  +-------------------------------------+--------------------------------------+
  [FOLDER: Onglets Graphiques]
  ===[ Page 1: Derniers Mouvements ]=== ( Page 2: Cartes & Moyens de Paiement )
  +-------------+------------+----------------------------------+-------------+
  | Réf Mvt     | Date Val.  | Libellé Écriture                 | Débit / Cr. |
  +-------------+------------+----------------------------------+-------------+
  | MVT-2609-01 | 26/09/2026 | VIREMENT REÇU SALAIRE MENSUEL    | +850,000.00 |
  | MVT-2609-02 | 25/09/2026 | RETRAIT GAB AGENCE CENTRALE      |  -70,000.00 |
  | MVT-2609-03 | 24/09/2026 | PAIEMENT TPE HYPERMARCHE ABIDJAN |  -42,300.00 |
  +-------------+------------+----------------------------------+-------------+
  [Boutons d'action GUI] : [Export Excel] [Imprimer Relevé] [Aide F1] [Fermer]`,
    detailedAnalysis: `Dans les environnements modernes Amplitude CBS propulsés par Four Js Genero (BDL) :

================================================================================
1. DIRECTIVE SCHEMA VS DATABASE : LE DÉCOUPLAGE FONDAMENTAL
================================================================================
• 'DATABASE nom_base' (Syntaxe Informix Legacy) :
  Exigeait impérativement la présence d'une base de données physique en ligne portant le même nom lors de la compilation avec 'form4gl'. Si la base était inaccessible, la compilation échouait.
• 'SCHEMA nom_schema' (Standard Moderne Amplitude Genero) :
  Génère le masque en utilisant le schéma logique abstrait (extrait XML ou dictionnaire de schéma compilé). La compilation est 100% autonome et déconnectée de la base physique. Le fichier binaire produit (.42f) est strictement identique et portable entre les serveurs de DÉVELOPPEMENT, de RECETTE/HOMOLOGATION et de PRODUCTION.

================================================================================
2. LES CONTENEURS D'AGENCEMENT GRAPHIQUE (RESPONSIVE & FLUIDE)
================================================================================
• LAYOUT (TEXT = "...", STYLE = "...") :
  - Rôle : Conteneur racine unique remplaçant l'ancienne section 'SCREEN'.
  - Fonctionnalités : Définit les propriétés globales de la fenêtre (titre de la barre de fenêtre avec TEXT, thème graphique via STYLE, icône de l'application via IMAGE).

• VBOX (Vertical Box) :
  - Rôle : Conteneur d'empilement vertical automatique de haut en bas.
  - Comportement : Les éléments enfants (ex: GRID d'en-tête, HBOX centrale, TABLE de détail) s'empilent naturellement. En cas de redimensionnement de la fenêtre, la VBOX alloue l'espace vertical excédentaire aux composants extensibles (comme la TABLE).

• HBOX (Horizontal Box) & Option (SPLITTER) :
  - Rôle : Conteneur de disposition horizontale côte à côte (gauche à droite).
  - Cas d'usage bancaire : Placer par exemple les informations Tiers & KYC sur le panneau de gauche et la synthèse financière & alertes sur le panneau de droite.
  - Option (SPLITTER) : Insère une barre de séparation manipulable à la souris par l'opérateur d'agence pour élargir ou rétrécir l'un des deux panneaux selon son confort.

• GRID :
  - Rôle : Grille adaptative pour disposer les libellés et les champs de saisie.
  - Avantage : Supprime définitivement la contrainte rigide des terminaux 80 colonnes x 24 lignes. Les champs s'alignent automatiquement en matrice fluide avec un espacement typographique régulier.

• GROUP (<G "Titre du Cadre"> ... >) :
  - Rôle : Cadre de regroupement visuel (Fieldset) au sein d'une GRID, délimitant des sous-ensembles fonctionnels (ex: <G "Informations Tiers">).

================================================================================
3. NAVIGATION MULTI-VUES ET COMPOSANTS RICHES (FOLDER, PAGE, TABLE)
================================================================================
• FOLDER & PAGE :
  - Rôle : Gestionnaire natif d'onglets graphiques.
  - Structure : Le conteneur FOLDER regroupe plusieurs conteneurs 'PAGE nom_page (TEXT = "Libellé de l'onglet")'.
  - Avantage bancaire : Permet de condenser sur une même fiche 360° les Mouvements, les Cartes, les Prêts et les Garanties sans saturer l'écran ni multiplier les fenêtres pop-up.

• TABLE (Composant de Grille Défilante) :
  - Rôle : Remplace les boucles statiques SCREEN RECORD par un vrai composant de table graphique.
  - Fonctionnalités :
    * Tri automatique : L'utilisateur peut cliquer sur n'importe quel en-tête de colonne pour trier les données (ascendant/descendant).
    * Redimensionnement : Largeur des colonnes ajustable à la souris.
    * Défilement fluide (Scrollbar) : Navigation instantanée dans des milliers d'enregistrements bancaires.
    * Attribut DOUBLECLICK : Déclenche une action 4GL spécifique lors d'un double-clic (ex: ouvrir le zoom sur une écriture comptable).

================================================================================
4. ATTRIBUTS GRAPHIQUES MODERNES (STYLES, WIDGETS & CONTRÔLES)
================================================================================
• STYLE : Applique des feuilles de styles (.4st) pour colorer les champs (ex: STYLE="mandatory" pour surbrillance jaune/rouge, STYLE="kpi_positive" pour vert bancaire).
• COMBOBOX : Transforme un champ code en liste déroulante avec libellés conviviaux (ex: ITEMS=(("A","Actif"),("F","Fermé"),("B","Bloqué"))).
• BUTTONEDIT : Champ texte avec bouton loupe intégré pour recherche rapide (LOV) et action graphique associée (ACTION=zoom_tiers, IMAGE="zoom.png").
• DATEEDIT : Calendrier contextuel pop-up pour sélection intuitive des dates (FORMAT="dd/mm/yyyy", CENTURY="2000").
• CHECKBOX : Case à cocher booléenne pour validations bancaires immédiates (ex: VALUECHECKED="O", VALUEUNCHECKED="N", NOT NULL).
• RADIOGROUP : Boutons radio à choix exclusif (ex: ITEMS=(("M","Mensuel"),("T","Trimestriel"),("A","Annuel"))).
• PROGRESSBAR : Jauge visuelle de progression pour les traitements batch EOD, calculs d'intérêts ou exports de fichiers (VALUEMIN=0, VALUEMAX=100).
• INVISIBLE / NOECHO : Masquage strict des caractères saisis pour conformité PCI-DSS (codes PIN, mots de passe superviseur).
• PLACEHOLDER : Texte indicatif en filigrane grisé guidant l'utilisateur avant la saisie (ex: PLACEHOLDER="Ex: 01001004589").
• TABINDEX : Ordre précis de tabulation personnalisé indépendamment de l'ordre géométrique dans la GRID (ex: TABINDEX=1, TABINDEX=2).
• NOT NULL : Empêche la validation si la zone reste vide ou indéfinie au niveau du formulaire.
• DEFAULT : Pré-remplissage automatique (DEFAULT=TODAY pour date, DEFAULT="XOF" pour devise agence).
• VALIDATE LIKE : Règle de validation d'intégrité héritée directement de la colonne du schéma logique SGBD (ex: VALIDATE LIKE bkcpt.age).
• WANTFIXEDPAGESIZE = NO : Permet aux TABLE graphiques d'adapter dynamiquement leur nombre de lignes affichées à la taille de la fenêtre écran au lieu d'une pagination figée.
• SCROLLBARS = BOTH / VERTICAL / NONE : Contrôle précis des ascenseurs de défilement des panneaux ou des tableaux.
• WEBCOMPONENT : Intégration d'un composant HTML5 / JavaScript tiers dans le formulaire Genero (ex: signature électronique sur tablette, graphiques interactifs Chart.js).`,
    keyDirectives: [
      { directive: "SCHEMA nom_schema", role: "Déclare le schéma logique sans connexion SGBD physique obligatoire à la compilation", example: "SCHEMA amplitude_db" },
      { directive: "LAYOUT (TEXT = \"...\", STYLE = \"...\")", role: "Conteneur racine d'interface graphique remplaçant SCREEN", example: "LAYOUT (TEXT = \"Fiche Client 360°\", STYLE = \"main_win\")" },
      { directive: "VBOX / END -- VBOX", role: "Conteneur vertical qui empile les composants de haut en bas", example: "VBOX ... END -- VBOX" },
      { directive: "HBOX (SPLITTER) / END", role: "Conteneur horizontal côte à côte avec séparateur redimensionnable", example: "HBOX (SPLITTER) ... END -- HBOX" },
      { directive: "GRID / END -- GRID", role: "Grille responsive alignant étiquettes et champs sans coordonnées fixes", example: "GRID ... END -- GRID" },
      { directive: "<G \"Titre\"> ... >", role: "Cadre de regroupement visuel (Group Box / Fieldset) dans une GRID", example: "<G \"Synthèse Risques\"> ... >" },
      { directive: "FOLDER / PAGE ... END", role: "Conteneur d'onglets graphiques natifs cliquables", example: "FOLDER PAGE tab1 (TEXT=\"Mouvements\") ... END FOLDER" },
      { directive: "TABLE (DOUBLECLICK = action)", role: "Tableau graphique avec tri, colonnes ajustables et double-clic", example: "TABLE (DOUBLECLICK = zoom_mvt) ... END -- TABLE" },
      { directive: "BUTTONEDIT (ACTION = zoom)", role: "Champ texte assisté avec icône loupe de recherche ou zoom", example: "b01 = bkcpt.cli, BUTTONEDIT, ACTION = zoom_tiers" },
      { directive: "COMBOBOX (ITEMS = (...))", role: "Liste déroulante ergonomique alimentée en dur ou par dictionnaire", example: "c01 = bkcpt.eta, COMBOBOX, ITEMS = ((\"A\",\"Actif\"), (\"B\",\"Bloqué\"))" },
      { directive: "CHECKBOX", role: "Case à cocher booléenne pour options et bascules fonctionnelles", example: "k01 = FORMONLY.is_resident, CHECKBOX, VALUECHECKED = \"O\", VALUEUNCHECKED = \"N\"" },
      { directive: "DATEEDIT", role: "Sélecteur de calendrier graphique contextuel pop-up", example: "d01 = FORMONLY.dat_val, DATEEDIT, FORMAT = \"dd/mm/yyyy\"" },
      { directive: "PROGRESSBAR", role: "Indicateur graphique de chargement ou d'exécution", example: "p01 = FORMONLY.pct_progression, PROGRESSBAR, VALUEMIN = 0, VALUEMAX = 100" },
      { directive: "TABINDEX = n", role: "Définit la séquence de navigation au clavier touche Tab", example: "f001 = bkcpt.ncp, TABINDEX = 1" },
      { directive: "PLACEHOLDER = \"...\"", role: "Texte d'aide grisé affiché dans le champ avant saisie", example: "f003 = bkcpt.rib, PLACEHOLDER = \"Saisir 24 caractères IBAN/RIB\"" },
      { directive: "STYLE = \"nom_style\"", role: "Liaison avec la feuille de style graphique (.4st) pour thèmes d'agence", example: "f010 = bkcpt.sol, STYLE = \"kpi_positive\"" }
    ],
    goldenRules: [
      "Préférer toujours 'SCHEMA' à 'DATABASE' pour garantir la portabilité des binaires compilés .42f sur l'ensemble des environnements bancaires.",
      "Ne plus fixer de dimensions rigides 80x24 quand l'écran est destiné au client graphique : utiliser les conteneurs VBOX et HBOX.",
      "Associer des styles sémantiques (STYLE=\"mandatory\", STYLE=\"kpi_positive\") pour tirer parti des thèmes graphiques GDC/GWC d'Amplitude.",
      "Utiliser la structure événementielle DIALOG en 4GL moderne pour gérer simultanément la saisie d'en-tête et le tableau dans une seule boucle unifiée."
    ],
    compilationAndRuntime: {
      commandAix: "fglform -M ecran_gui.per  # Compilateur Genero Form produisant le binaire graphique .42f",
      generatedBinary: "ecran_gui.42f (binaire graphique Genero)",
      environmentVariables: [
        "$FGLPROFILE : Configuration de l'interface graphique et styles Genero",
        "$FGLGUI : Forçage du mode graphique (1) vs mode texte (0)",
        "$FGLDIR : Répertoire racine du runtime Four Js Genero"
      ],
      troubleshooting: "Erreur -8412 : Erreur de syntaxe dans l'imbrication des conteneurs LAYOUT / VBOX / HBOX / GRID. Vérifier que chaque conteneur possède son END correspondant."
    },
    resources: [
      {
        title: "Manuel de Référence des Formulaires Graphiques Four Js Genero BDL",
        type: "MANUEL_INFORMIX",
        urlOrRef: "FOURJS-GENERO-FORMS-LAYOUT",
        description: "Documentation officielle complète de la syntaxe LAYOUT, VBOX, HBOX, GRID, FOLDER et TABLE."
      },
      {
        title: "Guide de Migration des Masques Informix 4GL vers Genero GUI (Amplitude)",
        type: "GUIDE_TECHNIQUE",
        urlOrRef: "AMPLITUDE-MIGRATION-4GL-TO-GUI",
        description: "Règles de passage de DATABASE à SCHEMA et transformation des SCREEN records en composants graphiques."
      },
      {
        title: "Architecture Événementielle DIALOG & Actions Graphiques Genero",
        type: "MANUEL_INFORMIX",
        urlOrRef: "GENERO-DIALOG-MULTI-INPUT",
        description: "Contrôle unifié des interactions multi-dialogues et liaisons avec l'IHM Web / Desktop."
      }
    ]
  }
];
