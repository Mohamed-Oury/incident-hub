// modules/cbs/cbs-screen-builder.ts
import { CBS_SCHEMA_TABLES, CbsTableDefinition } from "./cbs-advanced-data";

export interface CustomPerScreen {
  id: string;
  name: string;
  title: string;
  domain: string;
  primaryTable: string;
  secondaryTable?: string;
  description: string;
  perSourceCode: string;
  fourGlSourceCode: string;
  terminalMockup: string;
  fieldsConfig: PerFieldConfig[];
  screenLayoutType: "STANDARD_FORM" | "TABLE_ARRAY" | "MODAL_POPUP" | "SECURE_AUTH";
  createdAt: string;
  updatedAt: string;
}

export interface PerFieldConfig {
  tag: string;
  table: string;
  column: string;
  label: string;
  type: string;
  length: number;
  attributes: string[]; // e.g. "REQUIRED", "UPSHIFT", "NOENTRY", "INVISIBLE", "PICTURE"
  comments?: string;
}

/**
 * 1. Détection sémantique des tables Amplitude selon les mots-clés de la description
 */
export function matchTablesFromPrompt(description: string, domain?: string): { primary: CbsTableDefinition; secondary?: CbsTableDefinition } {
  const text = (description + " " + (domain || "")).toLowerCase();

  const domainKeywords: { keywords: string[]; tables: string[] }[] = [
    {
      keywords: ["carte", "monetique", "retrait", "gab", "atm", "tpe", "porteur", "pan", "pin", "plafond"],
      tables: ["BKCAR_PORT", "BKCAR_BIN", "BKCAR_OPPO", "BKCAR_PLAF", "BKMNT_GAB"]
    },
    {
      keywords: ["compte", "solde", "courant", "epargne", "rib", "iban", "mouvement", "releve", "client"],
      tables: ["BKCPT", "BKCLI", "BKTRA", "BKCOM"]
    },
    {
      keywords: ["virement", "transfert", "swift", "prelevement", "interbancaire", "masse"],
      tables: ["BKVIR_EMIS", "BKVIR_RECUS", "BKVIR_MASS", "BKSWF_MSG"]
    },
    {
      keywords: ["cheque", "chéquier", "chequier", "impaye", "opposition", "compensation"],
      tables: ["BKCHQ_EMIS", "BKCHQ_OPPO", "BKCHQ_COMP", "BKCHQ_IMPAYE"]
    },
    {
      keywords: ["credit", "pret", "prêt", "echeance", "échéance", "dossier", "garantie", "taux"],
      tables: ["BKPRT_DOS", "BKPRT_ECH", "BKPRT_GAR", "BKPRT_TAUX"]
    },
    {
      keywords: ["caisse", "guichet", "billetage", "especes", "coffre", "arrete", "arrêté"],
      tables: ["BKAGE_PARAM", "BKAGE_GUICH", "BKAGE_ARRET", "BKCAR_COFFRE"]
    },
    {
      keywords: ["securite", "sécurité", "profil", "habilitation", "utilisateur", "login"],
      tables: ["BKSEC_PROFIL", "BKSEC_HABIL", "BKBAT_PARAM"]
    }
  ];

  let selectedTableNames: string[] = [];
  for (const item of domainKeywords) {
    if (item.keywords.some((kw) => text.includes(kw))) {
      selectedTableNames = item.tables;
      break;
    }
  }

  if (selectedTableNames.length === 0) {
    selectedTableNames = ["BKCPT", "BKCLI", "BKTRA"];
  }

  const primary = CBS_SCHEMA_TABLES.find((t) => t.tableName === selectedTableNames[0]) || CBS_SCHEMA_TABLES[1] || CBS_SCHEMA_TABLES[0];
  const secondary = selectedTableNames[1] ? CBS_SCHEMA_TABLES.find((t) => t.tableName === selectedTableNames[1]) : undefined;

  return { primary, secondary };
}

/**
 * 2. Générateur automatique d'écran .per à partir d'un besoin fonctionnel
 */
export function generateCustomPerScreen(params: {
  title: string;
  description: string;
  domain?: string;
  screenLayoutType?: "STANDARD_FORM" | "TABLE_ARRAY" | "MODAL_POPUP" | "SECURE_AUTH";
}): CustomPerScreen {
  const { title, description } = params;
  const domain = params.domain || "Comptes & Guichet";
  const layoutType = params.screenLayoutType || (
    description.toLowerCase().includes("tableau") || description.toLowerCase().includes("liste") || description.toLowerCase().includes("grille")
      ? "TABLE_ARRAY"
      : description.toLowerCase().includes("securite") || description.toLowerCase().includes("pin") || description.toLowerCase().includes("mot de passe")
      ? "SECURE_AUTH"
      : description.toLowerCase().includes("popup") || description.toLowerCase().includes("recherche")
      ? "MODAL_POPUP"
      : "STANDARD_FORM"
  );

  const { primary, secondary } = matchTablesFromPrompt(description, domain);
  const now = new Date();
  const screenId = "SCR_" + Math.random().toString(36).substring(2, 9).toUpperCase();
  const baseName = "f_" + primary.tableName.toLowerCase().slice(0, 10);

  // Configuration des champs basée sur la table principale
  const pkCols = primary.primaryKey;
  const otherCols = primary.columns.filter((c) => !pkCols.includes(c.name)).slice(0, 7);
  const fieldsConfig: PerFieldConfig[] = [];

  pkCols.forEach((pk, idx) => {
    const colDef = primary.columns.find((c) => c.name === pk);
    fieldsConfig.push({
      tag: `f00${idx + 1}`,
      table: primary.tableName.toLowerCase(),
      column: pk.toLowerCase(),
      label: pk,
      type: colDef?.type || "CHAR(15)",
      length: 15,
      attributes: ["REQUIRED", "UPSHIFT", `COMMENTS = "Saisie obligatoire : ${pk}"`],
      comments: `Clé d'identification ${pk}`
    });
  });

  otherCols.forEach((col, idx) => {
    const tag = `f0${idx + 10}`;
    const attrs: string[] = [];
    if (layoutType === "SECURE_AUTH" && (col.name.includes("PIN") || col.name.includes("PWD") || col.name.includes("SECRET") || col.sensitive)) {
      attrs.push("INVISIBLE", "REQUIRED");
    } else if (col.name.includes("SOL") || col.name.includes("MNT") || col.name.includes("MONTANT")) {
      attrs.push("FORMAT = \"---,---,---,--&.&&\"", "NOENTRY");
    } else if (col.name.includes("DAT") || col.name.includes("DCO")) {
      attrs.push("FORMAT = \"dd/mm/yyyy\"");
    } else {
      attrs.push("UPSHIFT");
    }

    fieldsConfig.push({
      tag,
      table: primary.tableName.toLowerCase(),
      column: col.name.toLowerCase(),
      label: col.description.slice(0, 16),
      type: col.type,
      length: Math.min(25, col.type.includes("CHAR") ? parseInt(col.type.replace(/\D/g, "") || "20", 10) : 15),
      attributes: attrs,
      comments: col.description
    });
  });

  // Construction du code source .per
  let perSourceCode = "";
  let visualMockup = "";
  let fourGlSource = "";

  if (layoutType === "TABLE_ARRAY") {
    // Mode tableau défilant (SCREEN RECORD)
    perSourceCode = `DATABASE amplitude_db

SCREEN SIZE 24 BY 80
{
================================================================================
           SOPRA BANKING AMPLITUDE - ${title.toUpperCase().slice(0, 42)}
================================================================================

  Critère Sélection [${primary.primaryKey[0] || "CODE"}]: [f001           ]
  ----------------------------------------------------------------------------
  [N° ] [Référence        ] [Libellé / Désignation             ] [Montant XOF   ]
  [f10] [f11              ] [f12                               ] [f13           ]
  [f10] [f11              ] [f12                               ] [f13           ]
  [f10] [f11              ] [f12                               ] [f13           ]
  [f10] [f11              ] [f12                               ] [f13           ]
  [f10] [f11              ] [f12                               ] [f13           ]
  ----------------------------------------------------------------------------
  Total Enregistrements : [f99 ]         Cumul Général : [f98               ]

================================================================================
 [F1] Aide   [F2] Ligne Suiv   [F3] Insérer   [F10] Valider   [ESC] Quitter
}
END

TABLES
    ${primary.tableName.toLowerCase()}

ATTRIBUTES
    f001 = ${primary.tableName.toLowerCase()}.${(primary.primaryKey[0] || "id").toLowerCase()}, REQUIRED, UPSHIFT,
           COMMENTS = "Critère de filtrage principal";
    f10  = FORMONLY.num_ligne TYPE SMALLINT, NOENTRY;
    f11  = ${primary.tableName.toLowerCase()}.${fieldsConfig[1]?.column || "ref"}, UPSHIFT;
    f12  = ${primary.tableName.toLowerCase()}.${fieldsConfig[2]?.column || "lib"}, UPSHIFT;
    f13  = ${primary.tableName.toLowerCase()}.${fieldsConfig[3]?.column || "mnt"}, FORMAT = "---,---,---,--&.&&";
    f99  = FORMONLY.tot_lignes TYPE INTEGER, NOENTRY;
    f98  = FORMONLY.cumul_mnt TYPE DECIMAL(16,2), FORMAT = "---,---,---,--&.&&", NOENTRY;
INSTRUCTIONS
    DELIMITERS "[]"
    SCREEN RECORD s_arr[5] (num_ligne, ${fieldsConfig[1]?.column || "ref"}, ${fieldsConfig[2]?.column || "lib"}, ${fieldsConfig[3]?.column || "mnt"})
END`;

    visualMockup = `+------------------------------------------------------------------------------+
|          SOPRA BANKING AMPLITUDE - ${(title.toUpperCase()).slice(0, 42).padEnd(42)} |
+------------------------------------------------------------------------------+
  Critère Sélection [${(primary.primaryKey[0] || "CODE").padEnd(8)}]: [01001009845   ]
  ----------------------------------------------------------------------------
  [N° ] [Référence        ] [Libellé / Désignation             ] [Montant XOF   ]
  [ 1 ] [REF-2026-0091    ] [VIREMENT SALAIRE GESTIONNAIRE     ] [    450,000.00]
  [ 2 ] [REF-2026-0092    ] [RETRAIT GAB DAKAR PLATEAU         ] [     50,000.00]
  [ 3 ] [REF-2026-0093    ] [PRELEVEMENT ASSURANCE AUTO        ] [     25,000.00]
  [ 4 ] [REF-2026-0094    ] [FRAIS TENUE DE COMPTE T3          ] [      3,500.00]
  [ 5 ] [REF-2026-0095    ] [REGLEMENT FACTURE TELECOM         ] [     42,000.00]
  ----------------------------------------------------------------------------
  Total Enregistrements : [5   ]         Cumul Général : [        570,500.00]
+------------------------------------------------------------------------------+
  [F1] Aide   [F2] Ligne Suiv   [F3] Insérer   [F10] Valider   [ESC] Quitter
+------------------------------------------------------------------------------+`;

    fourGlSource = `###############################################################################
# Programme 4GL de gestion du tableau défilant : ${baseName}.4gl
###############################################################################
DATABASE amplitude_db

GLOBALS
    DEFINE g_tab ARRAY[100] OF RECORD
        num_ligne   SMALLINT,
        ref_oper    CHAR(15),
        lib_oper    CHAR(35),
        mnt_oper    DECIMAL(16,2)
    END RECORD
    DEFINE g_cpt INTEGER
END GLOBALS

MAIN
    DEFINE v_critere CHAR(15),
           v_tot_lig INTEGER,
           v_cumul   DECIMAL(16,2)

    OPEN FORM f_main FROM "${baseName}"
    DISPLAY FORM f_main

    INPUT v_critere FROM f001
        AFTER FIELD f001
            IF v_critere IS NULL THEN
                ERROR "Le critère de sélection est obligatoire."
                NEXT FIELD f001
            END IF
    END INPUT

    -- Chargement des données dans le tableau
    CALL charger_donnees(v_critere) RETURNING v_tot_lig, v_cumul
    DISPLAY v_tot_lig TO f99
    DISPLAY v_cumul TO f98

    -- Saisie et défilement dans le tableau multi-occurrences
    CALL SET_COUNT(v_tot_lig)
    INPUT ARRAY g_tab WITHOUT DEFAULTS FROM s_arr.*
        BEFORE ROW
            MESSAGE "Ligne courante : ", ARR_CURR()
        ON KEY (F10)
            MESSAGE "Enregistrement des modifications en base..."
            EXIT INPUT
        ON KEY (ESCAPE)
            IF CONFIRM_EXIT() THEN
                EXIT INPUT
            END IF
    END INPUT

    CLOSE FORM f_main
END MAIN`;

  } else if (layoutType === "SECURE_AUTH") {
    // Mode Authentification Sécurisée / Dérogation
    perSourceCode = `DATABASE amplitude_db

SCREEN SIZE 24 BY 80
{
================================================================================
           SOPRA BANKING AMPLITUDE - MODULE DE VALIDATION HAUTE SÉCURITÉ
================================================================================

  Opération Soumise    : [f001                                                ]
  Numéro de Compte     : [f002           ]   Code Guichet : [f003 ]
  Montant Transaction  : [f004               ] XOF

  ---------------------- CONTRÔLE D'AUTHENTIFICATION --------------------------
  Matricule Opérateur  : [f005      ]
  Code Secret PIN      : [f006    ]            (Saisie invisible PCI-DSS)

  ---------------------- FORÇAGE & ACCORD SUPERVISEUR -------------------------
  Visa Superviseur     : [f007      ]
  Mot de Passe Sup.    : [f008        ]        (Saisie masquée)
  Motif Dérogation     : [f009                                                ]

================================================================================
 [F1] Politiques Securite   [F9] Demande Visa   [F10] Valider   [ESC] Rejeter
}
END

TABLES
    ${primary.tableName.toLowerCase()}

ATTRIBUTES
    f001 = FORMONLY.lib_operation TYPE VARCHAR(50), NOENTRY;
    f002 = ${primary.tableName.toLowerCase()}.${pkCols[0]?.toLowerCase() || "ncp"}, NOENTRY;
    f003 = FORMONLY.code_age TYPE CHAR(5), NOENTRY;
    f004 = FORMONLY.mnt_tx TYPE DECIMAL(16,2), FORMAT = "---,---,---,--&.&&", NOENTRY;
    f005 = FORMONLY.user_mat TYPE CHAR(8), REQUIRED, UPSHIFT;
    f006 = FORMONLY.user_pin TYPE CHAR(4), REQUIRED, INVISIBLE;
    f007 = FORMONLY.sup_mat TYPE CHAR(8), REQUIRED, UPSHIFT;
    f008 = FORMONLY.sup_pwd TYPE CHAR(10), REQUIRED, INVISIBLE;
    f009 = FORMONLY.motif_derog TYPE VARCHAR(50), REQUIRED, UPSHIFT;
INSTRUCTIONS
    DELIMITERS "[]"
END`;

    visualMockup = `+------------------------------------------------------------------------------+
|     SOPRA BANKING AMPLITUDE - MODULE DE VALIDATION HAUTE SÉCURITÉ            |
+------------------------------------------------------------------------------+
  Opération Soumise    : [RETRAIT GUICHET DEPASSEMENT PLAFOND                  ]
  Numéro de Compte     : [01001009845    ]   Code Guichet : [01001]
  Montant Transaction  : [        7,500,000.00] XOF

  ---------------------- CONTRÔLE D'AUTHENTIFICATION --------------------------
  Matricule Opérateur  : [OPR_8842]
  Code Secret PIN      : [****]                (Saisie invisible PCI-DSS)

  ---------------------- FORÇAGE & ACCORD SUPERVISEUR -------------------------
  Visa Superviseur     : [SUP_DIR01]
  Mot de Passe Sup.    : [**********]          (Saisie masquée)
  Motif Dérogation     : [ACCORD TELEPHONIQUE DIRECTEUR REGIONAL              ]
+------------------------------------------------------------------------------+
  [F1] Politiques Securite   [F9] Demande Visa   [F10] Valider   [ESC] Rejeter
+------------------------------------------------------------------------------+`;

    fourGlSource = `###############################################################################
# Programme d'autorisation haute sécurité : ${baseName}_sec.4gl
###############################################################################
DATABASE amplitude_db

MAIN
    DEFINE v_pin CHAR(4),
           v_sup_pwd CHAR(10),
           v_sup_mat CHAR(8),
           v_motif   VARCHAR(50),
           v_habil_ok SMALLINT

    OPEN WINDOW w_sec AT 3, 2 WITH FORM "${baseName}" ATTRIBUTE (BORDER)
    
    INPUT BY NAME v_pin, v_sup_mat, v_sup_pwd, v_motif WITHOUT DEFAULTS
        AFTER FIELD v_pin
            IF LENGTH(v_pin) < 4 THEN
                ERROR "Le code PIN doit comporter exactement 4 chiffres."
                NEXT FIELD v_pin
            END IF
        AFTER FIELD v_sup_pwd
            CALL verif_habil_superviseur(v_sup_mat, v_sup_pwd) RETURNING v_habil_ok
            IF NOT v_habil_ok THEN
                ERROR "Superviseur non habilité pour ce montant."
                NEXT FIELD v_sup_mat
            END IF
        ON KEY (F10)
            CALL tracer_derogation(v_sup_mat, v_motif)
            MESSAGE "Dérogation validée avec succès."
            EXIT INPUT
    END INPUT

    CLOSE WINDOW w_sec
END MAIN`;

  } else {
    // Mode Standard Formulaire fiche unitaire / Consultation / Saisie
    const attrLines = fieldsConfig.map((fc) => {
      const attrsStr = fc.attributes.length > 0 ? `, ${fc.attributes.join(", ")}` : "";
      return `    ${fc.tag} = ${fc.table}.${fc.column}${attrsStr};`;
    }).join("\n");

    const visualFields = fieldsConfig.slice(0, 6).map((fc) => {
      const label = fc.label.padEnd(16, " ");
      return `  ${label}: [${fc.tag.padEnd(fc.length, " ")}]`;
    });

    perSourceCode = `DATABASE amplitude_db

SCREEN SIZE 24 BY 80
{
================================================================================
           SOPRA BANKING AMPLITUDE - ${title.toUpperCase().slice(0, 42)}
================================================================================

${visualFields.slice(0, 3).join("\n")}

  ----------------------------------------------------------------------------
${visualFields.slice(3, 6).join("\n")}

================================================================================
 [F1] Aide    [F2] Rechercher    [F5] Réinitialiser    [F10] Valider    [ESC] Quitter
}
END

TABLES
    ${primary.tableName.toLowerCase()}${secondary ? ",\n    " + secondary.tableName.toLowerCase() : ""}

ATTRIBUTES
${attrLines}
INSTRUCTIONS
    DELIMITERS "[]"
END`;

    visualMockup = `+------------------------------------------------------------------------------+
|          SOPRA BANKING AMPLITUDE - ${(title.toUpperCase()).slice(0, 42).padEnd(42)} |
+------------------------------------------------------------------------------+
${visualFields.slice(0, 3).map((f) => `|${f.padEnd(78)}|`).join("\n")}
|  ----------------------------------------------------------------------------|
${visualFields.slice(3, 6).map((f) => `|${f.padEnd(78)}|`).join("\n")}
+------------------------------------------------------------------------------+
| [F1] Aide    [F2] Rechercher    [F5] Réinitialiser    [F10] Valider    [ESC] Quitter|
+------------------------------------------------------------------------------+`;

    fourGlSource = `###############################################################################
# Programme Form-4GL standard : ${baseName}.4gl
# Table principale : ${primary.tableName}
###############################################################################
DATABASE amplitude_db

MAIN
    DEFINE rec_${primary.tableName.toLowerCase()} RECORD LIKE ${primary.tableName.toLowerCase()}.*

    OPEN FORM f_std FROM "${baseName}"
    DISPLAY FORM f_std

    MESSAGE "Saisissez les critères puis validez avec F10."
    INPUT BY NAME rec_${primary.tableName.toLowerCase()}.* WITHOUT DEFAULTS
        BEFORE FIELD ${(fieldsConfig[0]?.column || "id")}
            MESSAGE "F1 pour rechercher, F10 pour valider"
        AFTER FIELD ${(fieldsConfig[0]?.column || "id")}
            IF rec_${primary.tableName.toLowerCase()}.${(fieldsConfig[0]?.column || "id")} IS NULL THEN
                ERROR "Champ clé obligatoire."
                NEXT FIELD ${(fieldsConfig[0]?.column || "id")}
            END IF
        ON KEY (F10)
            MESSAGE "Validation et mise à jour en cours..."
            EXIT INPUT
    END INPUT

    CLOSE FORM f_std
END MAIN`;
  }

  return {
    id: screenId,
    name: baseName,
    title,
    domain,
    primaryTable: primary.tableName,
    secondaryTable: secondary?.tableName,
    description,
    perSourceCode,
    fourGlSourceCode: fourGlSource,
    terminalMockup: visualMockup,
    fieldsConfig,
    screenLayoutType: layoutType,
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
  };
}
