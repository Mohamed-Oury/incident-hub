// modules/cbs/cbs-4gl-per-screens-data.ts
import { Cbs4GlResource } from "./cbs-4gl-data";

export interface Cbs4GlPerScreenCourse {
  id: string;
  level: "DEBUTANT" | "INTERMEDIAIRE" | "AVANCE" | "EXPERT";
  levelOrder: number;
  title: string;
  summary: string;
  objectives: string[];
  perSourceCode: string;
  fourGlSourceCode: string;
  terminalMockup: string;
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
  }
];
