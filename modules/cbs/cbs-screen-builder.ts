// modules/cbs/cbs-screen-builder.ts
import { CBS_SCHEMA_TABLES, CbsTableDefinition } from "./cbs-advanced-data";

export type CbsPerScreenLayoutType = 
  | "STANDARD_FORM" 
  | "TABLE_ARRAY" 
  | "MODAL_POPUP" 
  | "SECURE_AUTH" 
  | "MASTER_DETAIL" 
  | "WIZARD_STEPS" 
  | "SPLIT_DASHBOARD" 
  | "SEARCH_FILTER";

export type CbsPerSyntaxMode = "GUI_GENERO" | "TERMINAL_LEGACY";
export type CbsPerSchemaHeader = "SCHEMA" | "DATABASE";

export interface GuiMockupData {
  windowTitle: string;
  headerFields: { label: string; value: string; type?: string; tag?: string }[];
  leftPanel?: { title: string; fields: { label: string; value: string; tag?: string }[] };
  rightPanel?: { title: string; fields: { label: string; value: string; tag?: string; highlight?: boolean }[] };
  activeTab?: string;
  tabs?: {
    id: string;
    label: string;
    type: "table" | "form";
    table?: {
      columns: string[];
      rows: string[][];
    };
    fields?: { label: string; value: string; tag?: string }[];
  }[];
  actions: { label: string; keyShortcut?: string; style: "primary" | "secondary" | "danger"; icon?: string }[];
  statusBar: { user: string; agency: string; accountingDate: string; environment: string };
}

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
  guiMockupData?: GuiMockupData;
  syntaxMode?: CbsPerSyntaxMode;
  schemaHeaderType?: CbsPerSchemaHeader;
  fieldsConfig: PerFieldConfig[];
  screenLayoutType: CbsPerScreenLayoutType;
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
      keywords: ["carte", "monetique", "monétique", "retrait", "gab", "atm", "tpe", "porteur", "pan", "pin", "plafond", "bin", "emv"],
      tables: ["BKCAR_PORT", "BKCAR_BIN", "BKCAR_OPPO", "BKCAR_PLAF", "BKMNT_GAB"]
    },
    {
      keywords: ["client", "kyc", "tiers", "fatca", "crs", "ppe", "morale", "physique", "piece", "identite", "resident"],
      tables: ["BKCLI", "BKCOM", "BKTRA", "BKCPT"]
    },
    {
      keywords: ["compte", "solde", "courant", "epargne", "épargne", "rib", "iban", "mouvement", "releve", "relevé", "agios", "decouvert"],
      tables: ["BKCPT", "BKCLI", "BKTRA", "BKCOM"]
    },
    {
      keywords: ["virement", "transfert", "swift", "prelevement", "prélèvement", "interbancaire", "masse", "sepa", "rtgs", "clearing"],
      tables: ["BKVIR_EMIS", "BKVIR_RECUS", "BKVIR_MASS", "BKSWF_MSG"]
    },
    {
      keywords: ["cheque", "chèque", "chéquier", "chequier", "impaye", "impayé", "opposition", "compensation", "lettre"],
      tables: ["BKCHQ_EMIS", "BKCHQ_OPPO", "BKCHQ_COMP", "BKCHQ_IMPAYE"]
    },
    {
      keywords: ["credit", "crédit", "pret", "prêt", "echeance", "échéance", "dossier", "garantie", "taux", "amortissement", "impaye"],
      tables: ["BKPRT_DOS", "BKPRT_ECH", "BKPRT_GAR", "BKPRT_TAUX"]
    },
    {
      keywords: ["caisse", "guichet", "billetage", "especes", "espèces", "coffre", "arrete", "arrêté", "versement", "retrait"],
      tables: ["BKAGE_PARAM", "BKAGE_GUICH", "BKAGE_ARRET", "BKCAR_COFFRE"]
    },
    {
      keywords: ["securite", "sécurité", "profil", "habilitation", "utilisateur", "login", "audit", "visa", "superviseur", "derogation"],
      tables: ["BKSEC_PROFIL", "BKSEC_HABIL", "BKBAT_PARAM"]
    },
    {
      keywords: ["change", "devises", "arbitrage", "cours", "tresorerie", "trésorerie", "forex", "bceao", "swift"],
      tables: ["BKCPT", "BKCOM", "BKTRA", "BKSWF_MSG"]
    },
    {
      keywords: ["commerce", "international", "credoc", "remdoc", "lettre", "credit", "garantie", "caution", "douane"],
      tables: ["BKPRT_DOS", "BKCLI", "BKCPT", "BKTRA"]
    },
    {
      keywords: ["comptabilite", "comptabilité", "general", "générale", "grand livre", "balance", "eod", "bod", "cloture", "rapprochement"],
      tables: ["BKCOM", "BKCPT", "BKTRA", "BKAGE_PARAM"]
    },
    {
      keywords: ["contentieux", "recouvrement", "huissier", "creance", "créance", "douteuse", "provision", "mise en demeure"],
      tables: ["BKPRT_DOS", "BKCPT", "BKCLI", "BKTRA"]
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
 * Générateur de code source .per en IHM Graphique Moderne (Four Js Genero Form Layout)
 */
function buildGuiGeneroPerCode(
  title: string,
  primary: CbsTableDefinition,
  secondary: CbsTableDefinition | undefined,
  fieldsConfig: PerFieldConfig[],
  layoutType: CbsPerScreenLayoutType,
  schemaHeaderType: CbsPerSchemaHeader = "SCHEMA"
): string {
  const header = `${schemaHeaderType} amplitude_db\n\n`;
  const pk = primary.primaryKey[0] || "CODE";
  const table = primary.tableName.toLowerCase();

  switch (layoutType) {
    case "TABLE_ARRAY":
      return `${header}LAYOUT (TEXT = "${title.replace(/"/g, "'")}", STYLE = "main_window")
VBOX
  GRID
  {
  Filtre Sélection [${pk}] : [f001           ]  Statut : [f002 ]
  }
  END -- GRID

  TABLE (DOUBLECLICK = detail_row)
  {
  N° Ligne  Référence       Libellé Opération                   Montant (XOF)
  [f10    ] [f11          ] [f12                               ] [f13           ]
  [f10    ] [f11          ] [f12                               ] [f13           ]
  [f10    ] [f11          ] [f12                               ] [f13           ]
  [f10    ] [f11          ] [f12                               ] [f13           ]
  [f10    ] [f11          ] [f12                               ] [f13           ]
  }
  END -- TABLE

  GRID
  {
  Total Enregistrements : [f99 ]         Cumul Général : [f98               ]
  }
  END -- GRID
END -- VBOX

TABLES
  ${table}

ATTRIBUTES
  f001 = ${table}.${pk.toLowerCase()}, REQUIRED, UPSHIFT, COMMENTS = "Critère de filtrage principal";
  f002 = FORMONLY.filtre_statut TYPE CHAR(1), UPSHIFT;
  f10  = FORMONLY.num_ligne TYPE SMALLINT, NOENTRY;
  f11  = ${table}.${fieldsConfig[1]?.column || "ref"}, UPSHIFT;
  f12  = ${table}.${fieldsConfig[2]?.column || "lib"}, UPSHIFT;
  f13  = ${table}.${fieldsConfig[3]?.column || "mnt"}, FORMAT = "---,---,---,--&.&&";
  f99  = FORMONLY.tot_lignes TYPE INTEGER, NOENTRY;
  f98  = FORMONLY.cumul_mnt TYPE DECIMAL(16,2), FORMAT = "---,---,---,--&.&&", NOENTRY;

INSTRUCTIONS
  SCREEN RECORD s_arr (num_ligne, ${fieldsConfig[1]?.column || "ref"}, ${fieldsConfig[2]?.column || "lib"}, ${fieldsConfig[3]?.column || "mnt"})
END`;

    case "MASTER_DETAIL":
      return `${header}LAYOUT (TEXT = "${title.replace(/"/g, "'")}", STYLE = "main_window")
VBOX
  GRID
  {
  <G "En-tête Dossier (Master Record)"                                           >
  N° Dossier : [f001           ]   Date Valeur : [f002      ]   Statut : [f003 ]
  Titulaire  : [f004                                                             ]
  }
  END -- GRID

  HBOX (SPLITTER)
    GRID
    {
    <G "Agences & Paramètres"                             >
    Agence Gestion : [f005 ]  Devise : [f006 ]
    Code Produit   : [f007 ]
    }
    END -- GRID

    GRID
    {
    <G "Soldes & Équilibre Financier"                     >
    Montant Global : [f008               ] XOF
    Total Lignes   : [f009               ] XOF
    }
    END -- GRID
  END -- HBOX

  TABLE (DOUBLECLICK = zoom_detail)
  {
  Ligne  Réf Écriture    Libellé Détail                     Débit          Crédit
  [d01 ] [d02          ] [d03                             ] [d04         ] [d05         ]
  [d01 ] [d02          ] [d03                             ] [d04         ] [d05         ]
  [d01 ] [d02          ] [d03                             ] [d04         ] [d05         ]
  }
  END -- TABLE
END -- VBOX

TABLES
  ${table}${secondary ? ",\n  " + secondary.tableName.toLowerCase() : ""}

ATTRIBUTES
  f001 = ${table}.${pk.toLowerCase()}, REQUIRED, UPSHIFT, STYLE = "primary_key";
  f002 = FORMONLY.dat_val TYPE DATE, DEFAULT = TODAY, NOENTRY;
  f003 = FORMONLY.statut TYPE CHAR(3), NOENTRY, STYLE = "badge_active";
  f004 = FORMONLY.nom_titulaire TYPE VARCHAR(50), NOENTRY;
  f005 = FORMONLY.code_age TYPE CHAR(5), NOENTRY;
  f006 = FORMONLY.devise TYPE CHAR(3), DEFAULT = "XOF", NOENTRY;
  f007 = FORMONLY.code_prod TYPE CHAR(4), NOENTRY;
  f008 = FORMONLY.mnt_global TYPE DECIMAL(16,2), FORMAT = "---,---,---,--&.&&", NOENTRY, STYLE = "kpi_main";
  f009 = FORMONLY.tot_details TYPE DECIMAL(16,2), FORMAT = "---,---,---,--&.&&", NOENTRY;

  d01  = FORMONLY.num_ligne TYPE SMALLINT, NOENTRY;
  d02  = FORMONLY.ref_ecr TYPE CHAR(14), NOENTRY;
  d03  = FORMONLY.lib_ecr TYPE VARCHAR(35), NOENTRY;
  d04  = FORMONLY.mnt_deb TYPE DECIMAL(14,2), FORMAT = "---,---,--&.&&", NOENTRY;
  d05  = FORMONLY.mnt_cre TYPE DECIMAL(14,2), FORMAT = "---,---,--&.&&", NOENTRY;

INSTRUCTIONS
  SCREEN RECORD s_det (num_ligne, ref_ecr, lib_ecr, mnt_deb, mnt_cre)
END`;

    case "WIZARD_STEPS":
      return `${header}LAYOUT (TEXT = "${title.replace(/"/g, "'")}", STYLE = "wizard_dialog")
VBOX
  FOLDER
    PAGE step1 (TEXT = "1. Identification & KYC")
      GRID
      {
      Numéro Client  : [f001      ]  Raison Sociale : [f002                           ]
      Type Tiers     : [f003 ]       Pièce Identité : [f004                ]
      }
      END -- GRID
    END -- PAGE

    PAGE step2 (TEXT = "2. Paramètres & Montants")
      GRID
      {
      Produit / Cpt  : [f005 ] [lib_prod                               ]
      Montant Sollicité: [f006               ] XOF   Durée (Mois) : [f007 ]
      Taux Applicable: [f008  ] %                    Échéance Est.: [f009         ]
      }
      END -- GRID
    END -- PAGE

    PAGE step3 (TEXT = "3. Garanties & Double Visa")
      GRID
      {
      Type Garantie  : [f010                                            ]
      Valeur Nette   : [f011               ] XOF
      Visa Contrôle  : [f012      ]  Statut Accord : [f013      ]
      }
      END -- GRID
    END -- PAGE
  END -- FOLDER

  HBOX
    GRID
    {
    [btn_prec    ] [btn_suiv    ] [btn_valider             ] [btn_annuler ]
    }
    END -- GRID
  END -- HBOX
END -- VBOX

TABLES
  ${table}

ATTRIBUTES
  f001 = ${table}.${pk.toLowerCase()}, REQUIRED, UPSHIFT;
  f002 = FORMONLY.nom_client TYPE VARCHAR(40), REQUIRED, UPSHIFT;
  f003 = FORMONLY.typ_client TYPE CHAR(3), UPSHIFT;
  f004 = FORMONLY.piece_id TYPE CHAR(20), UPSHIFT;
  f005 = FORMONLY.code_prod TYPE CHAR(4), REQUIRED, UPSHIFT;
  lib_prod = FORMONLY.lib_produit TYPE VARCHAR(30), NOENTRY;
  f006 = FORMONLY.mnt_demande TYPE DECIMAL(16,2), FORMAT = "---,---,---,--&.&&", REQUIRED;
  f007 = FORMONLY.duree_mois TYPE SMALLINT, REQUIRED;
  f008 = FORMONLY.taux_nom TYPE DECIMAL(5,2), FORMAT = "##&.&&", REQUIRED;
  f009 = FORMONLY.ech_estimee TYPE DECIMAL(14,2), FORMAT = "---,---,--&.&&", NOENTRY;
  f010 = FORMONLY.lib_garantie TYPE VARCHAR(45), UPSHIFT;
  f011 = FORMONLY.val_garantie TYPE DECIMAL(16,2), FORMAT = "---,---,---,--&.&&";
  f012 = FORMONLY.visa_agent TYPE CHAR(8), REQUIRED, UPSHIFT;
  f013 = FORMONLY.statut_comite TYPE CHAR(10), NOENTRY;

  BUTTON btn_prec    : previous, TEXT = "< Précédent";
  BUTTON btn_suiv    : next, TEXT = "Suivant >";
  BUTTON btn_valider : accept, TEXT = "Valider Dossier", STYLE = "primary";
  BUTTON btn_annuler : cancel, TEXT = "Annuler", STYLE = "danger";

INSTRUCTIONS
  DELIMITERS "[]"
END`;

    case "SPLIT_DASHBOARD":
      return `${header}LAYOUT (TEXT = "${title.replace(/"/g, "'")}", STYLE = "dashboard_window")
VBOX
  HBOX (SPLITTER)
    GRID
    {
    <G "Périmètre & Filtres Agence"                        >
    Code Agence : [f001 ]  Date Début : [f002      ]
    Segment     : [f003 ]  Date Fin   : [f004      ]
    }
    END -- GRID

    GRID
    {
    <G "Indicateurs Clés de Performance (KPIs Temps Réel)" >
    Transactions Traitées: [k01     ]
    Volume Global (XOF)  : [k02                    ]
    Taux de Succès       : [k03   ] %
    Alertes Détectées    : [k04     ]
    }
    END -- GRID
  END -- HBOX

  TABLE (DOUBLECLICK = zoom_incident)
  {
  Horodatage  Canal  Description Événement                  Statut     Montant (XOF)
  [h01      ] [h02 ] [h03                                 ] [h04     ] [h05           ]
  [h01      ] [h02 ] [h03                                 ] [h04     ] [h05           ]
  [h01      ] [h02 ] [h03                                 ] [h04     ] [h05           ]
  }
  END -- TABLE
END -- VBOX

TABLES
  ${table}

ATTRIBUTES
  f001 = FORMONLY.code_age TYPE CHAR(5), DEFAULT = "01001", UPSHIFT;
  f002 = FORMONLY.dat_deb TYPE DATE, DEFAULT = TODAY;
  f003 = FORMONLY.segment TYPE CHAR(4), UPSHIFT;
  f004 = FORMONLY.dat_fin TYPE DATE, DEFAULT = TODAY;
  k01  = FORMONLY.kpi_nb_tx TYPE INTEGER, NOENTRY, STYLE = "kpi_count";
  k02  = FORMONLY.kpi_vol_xof TYPE DECIMAL(18,2), FORMAT = "---,---,---,---,--&.&&", NOENTRY, STYLE = "kpi_main";
  k03  = FORMONLY.kpi_tx_succes TYPE DECIMAL(5,2), FORMAT = "##&.&&", NOENTRY, STYLE = "kpi_positive";
  k04  = FORMONLY.kpi_alertes TYPE SMALLINT, NOENTRY, STYLE = "kpi_danger";

  h01  = FORMONLY.evt_horodate TYPE DATETIME HOUR TO SECOND, NOENTRY;
  h02  = FORMONLY.evt_canal TYPE CHAR(5), NOENTRY;
  h03  = FORMONLY.evt_libelle TYPE VARCHAR(40), NOENTRY;
  h04  = FORMONLY.evt_statut TYPE VARCHAR(10), NOENTRY, STYLE = "badge_status";
  h05  = FORMONLY.evt_montant TYPE DECIMAL(14,2), FORMAT = "---,---,--&.&&", NOENTRY;

INSTRUCTIONS
  SCREEN RECORD s_dash (evt_horodate, evt_canal, evt_libelle, evt_statut, evt_montant)
END`;

    case "SEARCH_FILTER":
      return `${header}LAYOUT (TEXT = "${title.replace(/"/g, "'")}", STYLE = "search_window")
VBOX
  GRID
  {
  <G "Critères de Recherche (CONSTRUCT Dynamique)"                                 >
  Code / Identifiant : [f001           ]  Désignation / Nom : [f002                ]
  Période du         : [f003      ]       au                : [f004      ]
  Statut Dossier     : [f005 ]            Devise Opération  : [f006 ]
  }
  END -- GRID

  HBOX
    GRID
    {
    [btn_rechercher            ] [btn_reinitialiser      ] [btn_export_calc       ]
    }
    END -- GRID
  END -- HBOX

  TABLE (DOUBLECLICK = open_record)
  {
  Identifiant     Raison Sociale / Libellé        Date Événement  Montant (XOF)    Statut
  [r01          ] [r02                          ] [r03          ] [r04           ] [r05   ]
  [r01          ] [r02                          ] [r03          ] [r04           ] [r05   ]
  [r01          ] [r02                          ] [r03          ] [r04           ] [r05   ]
  }
  END -- TABLE
END -- VBOX

TABLES
  ${table}

ATTRIBUTES
  f001 = ${table}.${pk.toLowerCase()}, UPSHIFT;
  f002 = FORMONLY.nom_crit TYPE VARCHAR(35), UPSHIFT;
  f003 = FORMONLY.dco_min TYPE DATE;
  f004 = FORMONLY.dco_max TYPE DATE;
  f005 = FORMONLY.eta_crit TYPE CHAR(2), UPSHIFT;
  f006 = FORMONLY.dev_crit TYPE CHAR(3), DEFAULT = "XOF", UPSHIFT;

  BUTTON btn_rechercher   : search, TEXT = "Lancer Recherche", STYLE = "primary";
  BUTTON btn_reinitialiser: reset, TEXT = "Réinitialiser", STYLE = "secondary";
  BUTTON btn_export_calc  : export, TEXT = "Exporter Table", STYLE = "secondary";

  r01  = FORMONLY.res_id TYPE CHAR(15), NOENTRY;
  r02  = FORMONLY.res_nom TYPE VARCHAR(35), NOENTRY;
  r03  = FORMONLY.res_dat TYPE DATE, NOENTRY;
  r04  = FORMONLY.res_mnt TYPE DECIMAL(16,2), FORMAT = "---,---,---,--&.&&", NOENTRY;
  r05  = FORMONLY.res_eta TYPE CHAR(6), NOENTRY;

INSTRUCTIONS
  SCREEN RECORD s_res (res_id, res_nom, res_dat, res_mnt, res_eta)
END`;

    case "SECURE_AUTH":
      return `${header}LAYOUT (TEXT = "${title.replace(/"/g, "'")}", STYLE = "security_dialog")
VBOX
  GRID
  {
  <G "Opération Soumise à Contrôle & Double Visa"                                  >
  Type Transaction   : [f001                                                ]
  Compte Débiteur    : [f002           ]   Agence : [f003 ]
  Montant Total      : [f004               ] XOF
  }
  END -- GRID

  HBOX (SPLITTER)
    GRID
    {
    <G "Saisie Sécurisée Opérateur"                        >
    Matricule Guichet  : [f005      ]
    Code Secret PIN    : [f006    ] (NOECHO / PCI-DSS)
    }
    END -- GRID

    GRID
    {
    <G "Validation Superviseur (Double Visa)"              >
    Visa Superviseur   : [f007      ]
    Mot de Passe Sup.  : [f008        ]
    Motif Dérogation   : [f009                               ]
    }
    END -- GRID
  END -- HBOX
END -- VBOX

TABLES
  ${table}

ATTRIBUTES
  f001 = FORMONLY.lib_operation TYPE VARCHAR(50), NOENTRY;
  f002 = ${table}.${pk.toLowerCase()}, NOENTRY;
  f003 = FORMONLY.code_age TYPE CHAR(5), NOENTRY;
  f004 = FORMONLY.mnt_tx TYPE DECIMAL(16,2), FORMAT = "---,---,---,--&.&&", NOENTRY, STYLE = "kpi_alert";
  f005 = FORMONLY.user_mat TYPE CHAR(8), REQUIRED, UPSHIFT;
  f006 = FORMONLY.user_pin TYPE CHAR(4), REQUIRED, INVISIBLE;
  f007 = FORMONLY.sup_mat TYPE CHAR(8), REQUIRED, UPSHIFT;
  f008 = FORMONLY.sup_pwd TYPE CHAR(10), REQUIRED, INVISIBLE;
  f009 = FORMONLY.motif_derog TYPE VARCHAR(50), REQUIRED, UPSHIFT;

INSTRUCTIONS
  DELIMITERS "[]"
END`;

    case "MODAL_POPUP":
      return `${header}LAYOUT (TEXT = "${title.replace(/"/g, "'")}", STYLE = "dialog_modal")
VBOX
  GRID
  {
  Recherche Filtre Rapide : [f001           ]
  }
  END -- GRID

  TABLE (DOUBLECLICK = valider_selection)
  {
  Code Identifiant  Désignation / Intitulé Commercial              Statut
  [c01            ] [c02                                         ] [c03      ]
  [c01            ] [c02                                         ] [c03      ]
  [c01            ] [c02                                         ] [c03      ]
  [c01            ] [c02                                         ] [c03      ]
  }
  END -- TABLE

  HBOX
    GRID
    {
    [btn_choisir           ] [btn_annuler          ]
    }
    END -- GRID
  END -- HBOX
END -- VBOX

TABLES
  ${table}

ATTRIBUTES
  f001 = FORMONLY.filtre_val TYPE CHAR(15), UPSHIFT;
  c01  = ${table}.${pk.toLowerCase()}, NOENTRY, UPSHIFT;
  c02  = ${table}.${fieldsConfig[1]?.column || "lib"}, NOENTRY, UPSHIFT;
  c03  = FORMONLY.statut_lib TYPE CHAR(10), NOENTRY;

  BUTTON btn_choisir: accept, TEXT = "Sélectionner (ENTRÉE)", STYLE = "primary";
  BUTTON btn_annuler: cancel, TEXT = "Annuler (ESC)", STYLE = "secondary";

INSTRUCTIONS
  SCREEN RECORD s_lov (code, ${fieldsConfig[1]?.column || "lib"}, statut_lib)
END`;

    default: // STANDARD_FORM
      return `${header}LAYOUT (TEXT = "${title.replace(/"/g, "'")}", STYLE = "main_window")
VBOX
  GRID
  {
  Code Identifiant : [f001           ]  Statut : [f002 ]
  }
  END -- GRID

  HBOX (SPLITTER)
    GRID
    {
    <G "Données Générales & Fiche Métier"                                        >
    Libellé / Titre  : [f010                                                   ]
    Paramètre 1      : [f011                ]
    Paramètre 2      : [f012                ]
    }
    END -- GRID

    GRID
    {
    <G "Soldes & Indicateurs Chiffrés"                                           >
    Montant Principal: [f013               ] XOF
    Date Arrêté      : [f014      ]
    Gestionnaire     : [f015      ]
    }
    END -- GRID
  END -- HBOX
END -- VBOX

TABLES
  ${table}${secondary ? ",\n  " + secondary.tableName.toLowerCase() : ""}

ATTRIBUTES
  f001 = ${table}.${pk.toLowerCase()}, REQUIRED, UPSHIFT, STYLE = "primary_key";
  f002 = FORMONLY.statut TYPE CHAR(3), DEFAULT = "ACT", NOENTRY, STYLE = "badge_active";
  f010 = ${table}.${fieldsConfig[1]?.column || "lib"}, UPSHIFT;
  f011 = ${table}.${fieldsConfig[2]?.column || "val1"}, UPSHIFT;
  f012 = ${table}.${fieldsConfig[3]?.column || "val2"}, UPSHIFT;
  f013 = FORMONLY.solde_calc TYPE DECIMAL(16,2), FORMAT = "---,---,---,--&.&&", NOENTRY, STYLE = "kpi_main";
  f014 = FORMONLY.dco_sys TYPE DATE, DEFAULT = TODAY, NOENTRY;
  f015 = FORMONLY.user_id TYPE CHAR(8), NOENTRY;

INSTRUCTIONS
  DELIMITERS "[]"
END`;
  }
}

/**
 * Programme Genero BDL moderne pour IHM Graphique (DIALOG, ON ACTION, ui.Interface)
 */
function buildGuiGenero4GlCode(
  title: string,
  primary: CbsTableDefinition,
  fieldsConfig: PerFieldConfig[],
  layoutType: CbsPerScreenLayoutType,
  baseName: string,
  schemaHeaderType: CbsPerSchemaHeader = "SCHEMA"
): string {
  const header = `${schemaHeaderType} amplitude_db\n\n`;
  const table = primary.tableName.toLowerCase();

  return `###############################################################################
# Programme Genero BDL moderne pour IHM Graphique : ${baseName}.4gl
# Table principale : ${primary.tableName}
###############################################################################
${header}DEFINE g_rec RECORD LIKE ${table}.*

MAIN
    -- Chargement du profil d'actions graphiques (barre d'outils, icônes et styles)
    CALL ui.Interface.loadActionDefaults("amplitude_actions")

    OPEN FORM f_main FROM "${baseName}"
    DISPLAY FORM f_main

    -- Boucle événementielle moderne DIALOG multi-interactions
    DIALOG ATTRIBUTES(UNBUFFERED)
        INPUT BY NAME g_rec.*
            BEFORE FIELD ${fieldsConfig[0]?.column || "id"}
                MESSAGE "Saisie ou consultation des informations bancaires..."

            AFTER FIELD ${fieldsConfig[0]?.column || "id"}
                IF g_rec.${fieldsConfig[0]?.column || "id"} IS NULL THEN
                    ERROR "La clé d'identification est obligatoire."
                    NEXT FIELD ${fieldsConfig[0]?.column || "id"}
                END IF
        END INPUT

        ON ACTION accept
            MESSAGE "Enregistrement validé avec succès."
            ACCEPT DIALOG

        ON ACTION cancel
            EXIT DIALOG

        ON ACTION print_report
            CALL imprimer_etat_pdf("${baseName}")

        ON ACTION export_calc
            CALL exporter_donnees_office("${baseName}")
    END DIALOG

    CLOSE FORM f_main
END MAIN`;
}

/**
 * Aperçu ASCII Terminal VT100 représentant la fenêtre GUI Genero
 */
function buildGuiTerminalAscii(title: string, primary: CbsTableDefinition, layoutType: CbsPerScreenLayoutType): string {
  const pk = primary.primaryKey[0] || "CODE";
  return `+==============================================================================+
| [GENERO GUI WINDOW] ${title.slice(0, 52).padEnd(52)} [-][o][x] |
+==============================================================================+
| [Actions] [F1: Aide] [F2: Rechercher] [F10: Valider] [Export Calc] [Fermer]  |
+------------------------------------------------------------------------------+
  [VBOX / GRID: En-tête Global]
  Agence : [01001]              Date Arrêté : [26/09/2026]
  ${pk.padEnd(8)}: [01001009845]         Statut      : [ACTIF / NORMAL   ]
  +-------------------------------------+--------------------------------------+
  | [HBOX Gauche: Informations Tiers]   | [HBOX Droite: Synthèse Soldes]       |
  | Nom / Raison : [SOCIETE AGRO SARL ] | Solde Comptable : [   28,450,000.00] |
  | Code Client  : [CLI-99201         ] | Montant Bloqué  : [    1,200,000.00] |
  | Segment      : [ENTREPRISE PRIVEE ] | Disponible Réel : [   27,250,000.00] |
  +-------------------------------------+--------------------------------------+
  [FOLDER: Onglets Multi-Vues]
  ===[ Page 1: Grille Principale (TABLE) ]=== ( Page 2: Paramètres Complémentaires )
  +-------------+------------+----------------------------------+-------------+
  | Réf Ligne   | Date Opér. | Libellé Opération                | Montant XOF |
  +-------------+------------+----------------------------------+-------------+
  | REF-2609-01 | 26/09/2026 | VIREMENT SALAIRES COMPENSES      | 4,500,000.00|
  | REF-2609-02 | 25/09/2026 | ENCAISSEMENT EFFET COMMERCE      | 7,200,000.00|
  | REF-2609-03 | 24/09/2026 | PAIEMENT FOURNISSEUR MATERIEL    | 1,150,000.00|
  +-------------+------------+----------------------------------+-------------+
  Total Enregistrements : [3]             Cumul Lignes : [12,850,000.00 XOF]
+------------------------------------------------------------------------------+
| [Status Bar] User: OPR_AG01 | Agence: 01001 | Date: 26/09/2026 | Genero GWC  |
+==============================================================================+`;
}

/**
 * Données structurées pour le composant de prévisualisation IHM Graphique Moderne (GDC/GWC)
 */
function buildGuiMockupData(
  title: string,
  domain: string,
  primary: CbsTableDefinition,
  fieldsConfig: PerFieldConfig[],
  layoutType: CbsPerScreenLayoutType
): GuiMockupData {
  const pk = primary.primaryKey[0] || "CODE";
  const pkVal = "01001009845";

  return {
    windowTitle: `Banque Amplitude - ${title}`,
    headerFields: [
      { label: "Code Agence", value: "01001", tag: "f001" },
      { label: "Date Système", value: "26/09/2026", tag: "f002" },
      { label: pk, value: pkVal, tag: "f003" },
      { label: "Statut", value: "ACTIF", type: "badge", tag: "f004" }
    ],
    leftPanel: {
      title: "Informations Métier & Tiers",
      fields: [
        { label: "Identifiant / Code", value: pkVal, tag: "f010" },
        { label: "Raison Sociale / Nom", value: "SOCIETE COMMERCIALE SA", tag: "f011" },
        { label: "Segment Clientèle", value: "ENTREPRISES CORPORATE", tag: "f012" },
        { label: "Gestionnaire Compte", value: "GEST_AG01 (M. DIOP)", tag: "f013" }
      ]
    },
    rightPanel: {
      title: "Synthèse Financière & Soldes",
      fields: [
        { label: "Solde Comptable (XOF)", value: "28,450,000.00", highlight: true, tag: "f014" },
        { label: "Montant Bloqué / Réserve", value: "1,200,000.00", tag: "f015" },
        { label: "Disponible Immédiat", value: "27,250,000.00", highlight: true, tag: "f016" },
        { label: "Autorisation Découvert", value: "5,000,000.00", tag: "f017" }
      ]
    },
    tabs: [
      {
        id: "tab_mvt",
        label: "Derniers Mouvements",
        type: "table",
        table: {
          columns: ["Réf Écriture", "Date Valeur", "Libellé Opération", "Débit (XOF)", "Crédit (XOF)"],
          rows: [
            ["MVT-2026-0901", "26/09/2026", "VIREMENT COMMERCIAL EMIS", "4,500,000.00", "-"],
            ["MVT-2026-0902", "25/09/2026", "REMISE CHEQUE BANQUE NATIONALE", "-", "12,000,000.00"],
            ["MVT-2026-0903", "25/09/2026", "PRELEVEMENT COMMISSION TRIMESTRIELLE", "125,000.00", "-"],
            ["MVT-2026-0904", "24/09/2026", "REGLEMENT FACTURE TELECOM", "340,000.00", "-"]
          ]
        }
      },
      {
        id: "tab_params",
        label: "Paramètres & Sécurité",
        type: "form",
        fields: [
          { label: "Devise Tenue", value: "XOF - Franc CFA", tag: "c01" },
          { label: "Type Produit", value: "COMPTE COURANT COMMERCIAL", tag: "c02" },
          { label: "Contrôle Double Visa", value: "OUI (Seuil > 5M XOF)", tag: "c03" },
          { label: "Mode Clôture EOD", value: "AUTOMATIQUE BATCH JOUR", tag: "c04" }
        ]
      }
    ],
    actions: [
      { label: "Valider (F10)", keyShortcut: "F10", style: "primary", icon: "✓" },
      { label: "Nouveau (F2)", keyShortcut: "F2", style: "secondary", icon: "➕" },
      { label: "Export Excel", keyShortcut: "Ctrl+E", style: "secondary", icon: "📊" },
      { label: "Imprimer (Ctrl+P)", keyShortcut: "Ctrl+P", style: "secondary", icon: "🖨️" },
      { label: "Fermer (ESC)", keyShortcut: "ESC", style: "danger", icon: "✕" }
    ],
    statusBar: {
      user: "OPR_AG01",
      agency: "01001 (DAKAR CENTRAL)",
      accountingDate: "26/09/2026",
      environment: "Amplitude v11.x - Genero GWC/GDC Runtime"
    }
  };
}

/**
 * 2. Générateur automatique d'écran .per à partir d'un besoin fonctionnel
 */
export function generateCustomPerScreen(params: {
  title: string;
  description: string;
  domain?: string;
  screenLayoutType?: CbsPerScreenLayoutType;
  syntaxMode?: CbsPerSyntaxMode;
  schemaHeaderType?: CbsPerSchemaHeader;
}): CustomPerScreen {
  const { title, description } = params;
  const domain = params.domain || "Comptes & Guichet";
  const syntaxMode: CbsPerSyntaxMode = params.syntaxMode || "GUI_GENERO";
  const schemaHeaderType: CbsPerSchemaHeader = params.schemaHeaderType || "SCHEMA";
  const layoutType: CbsPerScreenLayoutType = params.screenLayoutType || (
    description.toLowerCase().includes("tableau") || description.toLowerCase().includes("liste") || description.toLowerCase().includes("grille")
      ? "TABLE_ARRAY"
      : description.toLowerCase().includes("securite") || description.toLowerCase().includes("pin") || description.toLowerCase().includes("mot de passe")
      ? "SECURE_AUTH"
      : description.toLowerCase().includes("popup") || description.toLowerCase().includes("modale") || description.toLowerCase().includes("lov")
      ? "MODAL_POPUP"
      : description.toLowerCase().includes("master") || description.toLowerCase().includes("entete") || description.toLowerCase().includes("détail")
      ? "MASTER_DETAIL"
      : description.toLowerCase().includes("etape") || description.toLowerCase().includes("wizard") || description.toLowerCase().includes("assistant")
      ? "WIZARD_STEPS"
      : description.toLowerCase().includes("dashboard") || description.toLowerCase().includes("split") || description.toLowerCase().includes("indicateur")
      ? "SPLIT_DASHBOARD"
      : description.toLowerCase().includes("recherche") || description.toLowerCase().includes("filtre") || description.toLowerCase().includes("multicritere")
      ? "SEARCH_FILTER"
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
      label: col.name,
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
  const guiMockupData = buildGuiMockupData(title, domain, primary, fieldsConfig, layoutType);

  if (syntaxMode === "GUI_GENERO") {
    perSourceCode = buildGuiGeneroPerCode(title, primary, secondary, fieldsConfig, layoutType, schemaHeaderType);
    fourGlSource = buildGuiGenero4GlCode(title, primary, fieldsConfig, layoutType, baseName, schemaHeaderType);
    visualMockup = buildGuiTerminalAscii(title, primary, layoutType);
  } else if (layoutType === "TABLE_ARRAY") {
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

  } else if (layoutType === "MODAL_POPUP") {
    // Mode Fenêtre Modale Popup / Sélection LOV
    perSourceCode = `DATABASE amplitude_db

SCREEN SIZE 14 BY 64
{
================================================================
              ${title.toUpperCase().slice(0, 36)}
================================================================
  Recherche Code/Clé : [f001           ]
  --------------------------------------------------------------
  Résultats de Sélection (LOV) :
  [Code       ] [Désignation Commerciale               ]
  [f10        ] [f11                                   ]
  [f10        ] [f11                                   ]
  [f10        ] [f11                                   ]
  [f10        ] [f11                                   ]
================================================================
  [ENTRÉE] Sélectionner   [F1] Aide   [ESC] Annuler
}
END

TABLES
    ${primary.tableName.toLowerCase()}

ATTRIBUTES
    f001 = FORMONLY.filtre_val TYPE CHAR(15), UPSHIFT;
    f10  = ${primary.tableName.toLowerCase()}.${pkCols[0]?.toLowerCase() || "code"}, NOENTRY, UPSHIFT;
    f11  = ${primary.tableName.toLowerCase()}.${fieldsConfig[1]?.column || "lib"}, NOENTRY, UPSHIFT;
INSTRUCTIONS
    DELIMITERS "[]"
    SCREEN RECORD s_lov[4] (${pkCols[0]?.toLowerCase() || "code"}, ${fieldsConfig[1]?.column || "lib"})
END`;

    visualMockup = `       +--------------------------------------------------------------+
       |   ${(title.toUpperCase()).slice(0, 40).padEnd(58)}|
       +--------------------------------------------------------------+
         Recherche Code/Clé : [0100100        ]
         ------------------------------------------------------------
         Résultats de Sélection (LOV) :
         [Code       ] [Désignation Commerciale               ]
         [01001001234] [COMPTE DE DEPOT PARTICULIERS         ]
         [01001004567] [COMPTE EPARGNE SUR LIVRET             ]
         [01001009890] [COMPTE COURANT COMMERCIAL SARL        ]
         [01001009999] [COMPTE INTERNE ATTENTE OPERATIONS     ]
       +--------------------------------------------------------------+
         [ENTRÉE] Sélectionner   [F1] Aide   [ESC] Annuler
       +--------------------------------------------------------------+`;

    fourGlSource = `###############################################################################
# Sous-fenêtre Modale Popup LOV (List Of Values) : ${baseName}_pop.4gl
###############################################################################
DATABASE amplitude_db

FUNCTION fenetre_popup_selection() RETURNING CHAR(15), VARCHAR(40)
    DEFINE v_sel_code CHAR(15),
           v_sel_lib  VARCHAR(40)

    OPEN WINDOW w_pop AT 5, 8 WITH FORM "${baseName}" ATTRIBUTE (BORDER, FORM LINE 1)

    MESSAGE "Tapez F1 pour aide, sélectionnez avec ENTRÉE ou ESC pour quitter."
    DISPLAY ARRAY g_lov_list TO s_lov.*
        ON KEY (ACCEPT)
            LET v_sel_code = g_lov_list[ARR_CURR()].code
            LET v_sel_lib  = g_lov_list[ARR_CURR()].lib
            EXIT DISPLAY
        ON KEY (INTERRUPT, ESCAPE)
            LET v_sel_code = NULL
            EXIT DISPLAY
    END DISPLAY

    CLOSE WINDOW w_pop
    RETURN v_sel_code, v_sel_lib
END FUNCTION`;

  } else if (layoutType === "MASTER_DETAIL") {
    // Mode En-tête / Lignes de détail (Master-Detail)
    perSourceCode = `DATABASE amplitude_db

SCREEN SIZE 24 BY 80
{
================================================================================
           SOPRA BANKING AMPLITUDE - SAISIE DOSSIER & MOUVEMENTS DÉTAILS
================================================================================

  Référence Dossier: [f001           ]     Date Valeur : [f002      ]
  Client Titulaire : [f003                                    ]
  Agence Gestion   : [f004 ] Devise : [f005]   Statut : [f006      ]
  ----------------------------------------------------------------------------
  LIGNES D'ÉCRITURES / DÉTAIL DES TRANSACTIONS :
  [Lg] [Compte Imput  ] [Sens] [Montant Mouvement   ] [Libellé Écriture     ]
  [f10] [f11         ] [f12 ] [f13                 ] [f14                   ]
  [f10] [f11         ] [f12 ] [f13                 ] [f14                   ]
  [f10] [f11         ] [f12 ] [f13                 ] [f14                   ]
  [f10] [f11         ] [f12 ] [f13                 ] [f14                   ]
  ----------------------------------------------------------------------------
  Total Débit : [f91               ]   Total Crédit : [f92               ]
  Écart Équilibre : [f93               ] (Doit être égal à zéro)

================================================================================
 [F1] Aide   [F2] Ligne Suiv   [F3] Insérer   [F10] Comptabiliser   [ESC] Annuler
}
END

TABLES
    ${primary.tableName.toLowerCase()}

ATTRIBUTES
    f001 = ${primary.tableName.toLowerCase()}.${pkCols[0]?.toLowerCase() || "ref"}, REQUIRED, UPSHIFT;
    f002 = FORMONLY.date_val TYPE DATE, FORMAT = "dd/mm/yyyy", REQUIRED;
    f003 = FORMONLY.nom_titulaire TYPE VARCHAR(40), NOENTRY;
    f004 = FORMONLY.code_age TYPE CHAR(5), NOENTRY;
    f005 = FORMONLY.dev_iso TYPE CHAR(3), DEFAULT = "XOF", UPSHIFT;
    f006 = FORMONLY.statut_dos TYPE CHAR(10), NOENTRY;

    f10  = FORMONLY.num_ligne TYPE SMALLINT, NOENTRY;
    f11  = FORMONLY.cpt_dest TYPE CHAR(11), REQUIRED, UPSHIFT;
    f12  = FORMONLY.sens_mvt TYPE CHAR(1), REQUIRED, INCLUDE = ("D", "C"), UPSHIFT;
    f13  = FORMONLY.mnt_mvt TYPE DECIMAL(16,2), FORMAT = "---,---,---,--&.&&", REQUIRED;
    f14  = FORMONLY.lib_mvt TYPE VARCHAR(30), UPSHIFT;

    f91  = FORMONLY.tot_deb TYPE DECIMAL(16,2), FORMAT = "---,---,---,--&.&&", NOENTRY;
    f92  = FORMONLY.tot_crd TYPE DECIMAL(16,2), FORMAT = "---,---,---,--&.&&", NOENTRY;
    f93  = FORMONLY.ecart_bal TYPE DECIMAL(16,2), FORMAT = "---,---,---,--&.&&", NOENTRY;
INSTRUCTIONS
    DELIMITERS "[]"
    SCREEN RECORD s_det[4] (num_ligne, cpt_dest, sens_mvt, mnt_mvt, lib_mvt)
END`;

    visualMockup = `+------------------------------------------------------------------------------+
|          SOPRA BANKING AMPLITUDE - SAISIE DOSSIER & MOUVEMENTS DÉTAILS       |
+------------------------------------------------------------------------------+
  Référence Dossier: [DOS-2026-0042  ]     Date Valeur : [26/09/2026]
  Client Titulaire : [SOCIETE GENERALE DISTRIB SA             ]
  Agence Gestion   : [01001] Devise : [XOF]   Statut : [EN COURS   ]
  ----------------------------------------------------------------------------
  LIGNES D'ÉCRITURES / DÉTAIL DES TRANSACTIONS :
  [Lg] [Compte Imput  ] [Sens] [Montant Mouvement   ] [Libellé Écriture     ]
  [ 1] [01001008451  ] [D   ] [        2,500,000.00] [REGLEMENT FOURNISSEUR ]
  [ 2] [01001009942  ] [C   ] [        2,497,500.00] [VIREMENT BENEFICIAIRE ]
  [ 3] [70100010001  ] [C   ] [            2,500.00] [COMMISSION EMISSION   ]
  [  ] [             ] [    ] [                    ] [                      ]
  ----------------------------------------------------------------------------
  Total Débit : [        2,500,000.00]   Total Crédit : [        2,500,000.00]
  Écart Équilibre : [                0.00] (Doit être égal à zéro)
+------------------------------------------------------------------------------+
 [F1] Aide   [F2] Ligne Suiv   [F3] Insérer   [F10] Comptabiliser   [ESC] Annuler
+------------------------------------------------------------------------------+`;

    fourGlSource = `###############################################################################
# Module Master-Detail En-tête / Lignes : ${baseName}_md.4gl
###############################################################################
DATABASE amplitude_db

MAIN
    DEFINE v_ref CHAR(15), v_dat DATE, v_tot_d, v_tot_c, v_diff DECIMAL(16,2)

    OPEN FORM f_md FROM "${baseName}"
    DISPLAY FORM f_md

    -- Étape 1 : Saisie de l'en-tête (Master)
    INPUT v_ref, v_dat FROM f001, f002
        AFTER FIELD f001
            CALL verif_existence_dossier(v_ref)
    END INPUT

    -- Étape 2 : Saisie des lignes de détail (Detail Array)
    INPUT ARRAY g_lignes WITHOUT DEFAULTS FROM s_det.*
        AFTER ROW
            CALL calculer_balance() RETURNING v_tot_d, v_tot_c, v_diff
            DISPLAY v_tot_d TO f91
            DISPLAY v_tot_c TO f92
            DISPLAY v_diff  TO f93
        ON KEY (F10)
            IF v_diff != 0 THEN
                ERROR "Impossible de comptabiliser : Écriture déséquilibrée !"
                CONTINUE INPUT
            END IF
            EXIT INPUT
    END INPUT

    CLOSE FORM f_md
END MAIN`;

  } else if (layoutType === "WIZARD_STEPS") {
    // Mode Assistant multi-étapes guidées
    perSourceCode = `DATABASE amplitude_db

SCREEN SIZE 24 BY 80
{
================================================================================
           SOPRA BANKING AMPLITUDE - ASSISTANT GUIDÉ D'INSTRUCTION
================================================================================
  [ ÉTAPE 1 : IDENTITÉ ]  ➔  [ ÉTAPE 2 : CONDITIONS ]  ➔  [ ÉTAPE 3 : ACCORD ]
================================================================================

  Phase Active : [f000                                               ]

  --------------------------- 1. CRITÈRES DU DOSSIER --------------------------
  Numéro Identifiant : [f001           ]   Code Tiers / Client : [f002           ]
  Libellé Opération  : [f003                                                 ]

  --------------------------- 2. PARAMÈTRES FINANCIERS ------------------------
  Montant Principal  : [f004               ] XOF   Taux Nominal : [f005 ] %
  Durée d'Amortisse. : [f006 ] Mois                  Différé      : [f007 ] Mois

  --------------------------- 3. RÉSULTAT SIMULATION --------------------------
  Mensualité Estimée : [f008               ] XOF   Coût Total   : [f009               ]

================================================================================
 [F7] Étape Préc   [F8] Étape Suiv   [F10] Confirmer Dossier   [ESC] Abandonner
}
END

TABLES
    ${primary.tableName.toLowerCase()}

ATTRIBUTES
    f000 = FORMONLY.phase_lib TYPE VARCHAR(45), NOENTRY;
    f001 = ${primary.tableName.toLowerCase()}.${pkCols[0]?.toLowerCase() || "num"}, REQUIRED, UPSHIFT;
    f002 = FORMONLY.cli_id TYPE CHAR(15), REQUIRED, UPSHIFT;
    f003 = FORMONLY.lib_dos TYPE VARCHAR(50), REQUIRED;
    f004 = FORMONLY.mnt_cap TYPE DECIMAL(16,2), FORMAT = "---,---,---,--&.&&", REQUIRED;
    f005 = FORMONLY.tx_nom TYPE DECIMAL(5,2), FORMAT = "##.##", REQUIRED;
    f006 = FORMONLY.nb_mois TYPE SMALLINT, REQUIRED;
    f007 = FORMONLY.differe TYPE SMALLINT, DEFAULT = 0;
    f008 = FORMONLY.mens_est TYPE DECIMAL(16,2), FORMAT = "---,---,---,--&.&&", NOENTRY;
    f009 = FORMONLY.cout_tot TYPE DECIMAL(16,2), FORMAT = "---,---,---,--&.&&", NOENTRY;
INSTRUCTIONS
    DELIMITERS "[]"
END`;

    visualMockup = `+------------------------------------------------------------------------------+
|          SOPRA BANKING AMPLITUDE - ASSISTANT GUIDÉ D'INSTRUCTION             |
+------------------------------------------------------------------------------+
  [ ÉTAPE 1 : IDENTITÉ ]  ➔  [ ÉTAPE 2 : CONDITIONS ]  ➔  [ ÉTAPE 3 : ACCORD ]
+------------------------------------------------------------------------------+
  Phase Active : [ÉTAPE 2/3 : CONDITIONS FINANCIÈRES ET AMORTISSEMENT        ]

  --------------------------- 1. CRITÈRES DU DOSSIER --------------------------
  Numéro Identifiant : [DOS-CRE-9921   ]   Code Tiers / Client : [CLI-0010049    ]
  Libellé Opération  : [CRÉDIT ÉQUIPEMENT INDUSTRIEL PME 2026                 ]

  --------------------------- 2. PARAMÈTRES FINANCIERS ------------------------
  Montant Principal  : [       45,000,000.00] XOF   Taux Nominal : [ 7.25] %
  Durée d'Amortisse. : [ 60 ] Mois                  Différé      : [  3 ] Mois

  --------------------------- 3. RÉSULTAT SIMULATION --------------------------
  Mensualité Estimée : [          896,450.00] XOF   Coût Total   : [        8,787,000.00]
+------------------------------------------------------------------------------+
 [F7] Étape Préc   [F8] Étape Suiv   [F10] Confirmer Dossier   [ESC] Abandonner
+------------------------------------------------------------------------------+`;

    fourGlSource = `###############################################################################
# Assistant Multi-Étapes (Wizard) Form-4GL : ${baseName}_wiz.4gl
###############################################################################
DATABASE amplitude_db

MAIN
    DEFINE v_etape SMALLINT, v_cap DECIMAL(16,2), v_taux DECIMAL(5,2), v_duree SMALLINT

    OPEN FORM f_wiz FROM "${baseName}"
    DISPLAY FORM f_wiz

    LET v_etape = 1
    WHILE v_etape <= 3
        IF v_etape = 1 THEN
            DISPLAY "ÉTAPE 1/3 : IDENTIFICATION DU DOSSIER ET TIERS" TO f000
            INPUT BY NAME rec_dossier.cli_id, rec_dossier.lib_dos WITHOUT DEFAULTS
        END IF

        IF v_etape = 2 THEN
            DISPLAY "ÉTAPE 2/3 : PARAMÈTRES FINANCIERS ET CALCUL" TO f000
            INPUT BY NAME v_cap, v_taux, v_duree WITHOUT DEFAULTS
                AFTER FIELD v_duree
                    CALL simuler_echeancier(v_cap, v_taux, v_duree)
            END INPUT
        END IF

        IF v_etape = 3 THEN
            DISPLAY "ÉTAPE 3/3 : CONTRÔLE DÉCISIONNEL ET ACCORD FINAL" TO f000
            MENU "Décision Comité Crédit"
                COMMAND "Accorder" CALL enregistrer_dossier() EXIT MENU
                COMMAND "Rejeter"  CALL rejeter_dossier()     EXIT MENU
                COMMAND "Retour"   LET v_etape = 1            EXIT MENU
            END MENU
        END IF
        LET v_etape = v_etape + 1
    END WHILE

    CLOSE FORM f_wiz
END MAIN`;

  } else if (layoutType === "SPLIT_DASHBOARD") {
    // Mode Tableau de Bord / Split Synthèse & Indicateurs
    perSourceCode = `DATABASE amplitude_db

SCREEN SIZE 24 BY 80
{
================================================================================
           SOPRA BANKING AMPLITUDE - TABLEAU DE BORD OPÉRATIONNEL & KPIS
================================================================================
  Date de Situation: [f001      ]           Agence / Périmètre : [f002 ] [f003 ]
--------------------------------------------------------------------------------
  SYNTHÈSE VOLUMÉTRIE TRANSACTIONS       |  INDICATEURS DE RISQUE & SUSPENS
  ---------------------------------------+--------------------------------------
  Opérations Enregistrées : [f100      ] |  Rejets Compensations : [f200      ]
  Total Traité Aujourd'hui: [f101      ] |  Écritures en Suspens : [f201      ]
  Montant Global Compensé : [f102      ] |  Dépassements Plafond : [f202      ]
  Incidents Réseau GAB/ATM: [f103      ] |  Alertes Fraude / AML : [f203      ]
-----------------------------------------+--------------------------------------
  DERNIERS ÉVÉNEMENTS MARQUANTS SUR LE PÉRIMÈTRE BANCAIRE :
  [Heure   ] [Code Event] [Description Résumée                   ] [Statut    ]
  [f30     ] [f31       ] [f32                                   ] [f33       ]
  [f30     ] [f31       ] [f32                                   ] [f33       ]
  [f30     ] [f31       ] [f32                                   ] [f33       ]
================================================================================
 [F1] Rafraîchir   [F4] Basculer Détail   [F5] Exporter   [ESC] Quitter
}
END

TABLES
    ${primary.tableName.toLowerCase()}

ATTRIBUTES
    f001 = FORMONLY.date_sit TYPE DATE, FORMAT = "dd/mm/yyyy", NOENTRY;
    f002 = FORMONLY.code_age TYPE CHAR(5), NOENTRY;
    f003 = FORMONLY.nom_age TYPE VARCHAR(25), NOENTRY;

    f100 = FORMONLY.nb_trans TYPE INTEGER, NOENTRY;
    f101 = FORMONLY.tot_trans TYPE INTEGER, NOENTRY;
    f102 = FORMONLY.vol_comp TYPE DECIMAL(16,2), FORMAT = "---,---,---,--&.&&", NOENTRY;
    f103 = FORMONLY.nb_gab_hs TYPE SMALLINT, NOENTRY;

    f200 = FORMONLY.nb_rejets TYPE INTEGER, NOENTRY;
    f201 = FORMONLY.nb_suspens TYPE INTEGER, NOENTRY;
    f202 = FORMONLY.nb_depass TYPE INTEGER, NOENTRY;
    f203 = FORMONLY.nb_aml TYPE INTEGER, NOENTRY;

    f30  = FORMONLY.hh_mm TYPE CHAR(8), NOENTRY;
    f31  = FORMONLY.evt_code TYPE CHAR(10), NOENTRY;
    f32  = FORMONLY.evt_lib TYPE VARCHAR(35), NOENTRY;
    f33  = FORMONLY.evt_sta TYPE CHAR(10), NOENTRY;
INSTRUCTIONS
    DELIMITERS "[]"
    SCREEN RECORD s_kpis[3] (hh_mm, evt_code, evt_lib, evt_sta)
END`;

    visualMockup = `+------------------------------------------------------------------------------+
|          SOPRA BANKING AMPLITUDE - TABLEAU DE BORD OPÉRATIONNEL & KPIS       |
+------------------------------------------------------------------------------+
  Date de Situation: [26/09/2026]           Agence / Périmètre : [01001] [SIEGE DAKAR]
--------------------------------------------------------------------------------
  SYNTHÈSE VOLUMÉTRIE TRANSACTIONS       |  INDICATEURS DE RISQUE & SUSPENS
  ---------------------------------------+--------------------------------------
  Opérations Enregistrées : [14,520    ] |  Rejets Compensations : [12        ]
  Total Traité Aujourd'hui: [14,488    ] |  Écritures en Suspens : [8         ]
  Montant Global Compensé : [ 890.5M XOF] | Dépassements Plafond : [5         ]
  Incidents Réseau GAB/ATM: [0         ] |  Alertes Fraude / AML : [1         ]
-----------------------------------------+--------------------------------------
  DERNIERS ÉVÉNEMENTS MARQUANTS SUR LE PÉRIMÈTRE BANCAIRE :
  [Heure   ] [Code Event] [Description Résumée                   ] [Statut    ]
  [14:22:01] [EOD_INIT  ] [Lancement Pré-clôture Agence          ] [SUCCES    ]
  [14:15:30] [ATM_MON   ] [GAB-04 Alerte fin de rouleau papier   ] [RESOLU    ]
  [13:58:12] [SWIFT_IN  ] [Message MT103 Reçu - Interbancaire    ] [INTEGRE   ]
+------------------------------------------------------------------------------+
 [F1] Rafraîchir   [F4] Basculer Détail   [F5] Exporter   [ESC] Quitter
+------------------------------------------------------------------------------+`;

    fourGlSource = `###############################################################################
# Tableau de Bord Supervisé 4GL : ${baseName}_kpi.4gl
###############################################################################
DATABASE amplitude_db

MAIN
    OPEN FORM f_dash FROM "${baseName}"
    DISPLAY FORM f_dash

    WHILE TRUE
        CALL charger_indicateurs_kpi()
        CALL afficher_evenements_recents()
        
        MESSAGE "Appuyez sur F1 pour actualiser, ou ESC pour quitter."
        PROMPT "" FOR CHAR v_touche
            ON KEY (F1)
                MESSAGE "Mise à jour des indicateurs temps réel..."
            ON KEY (ESCAPE, INTERRUPT)
                EXIT WHILE
        END PROMPT
    END WHILE

    CLOSE FORM f_dash
END MAIN`;

  } else if (layoutType === "SEARCH_FILTER") {
    // Mode Formulaire de Recherche Multi-critères
    perSourceCode = `DATABASE amplitude_db

SCREEN SIZE 24 BY 80
{
================================================================================
           SOPRA BANKING AMPLITUDE - MOTEUR DE RECHERCHE MULTI-CRITÈRES
================================================================================

  ---------------------------- CRITÈRES DE FILTRAGE ---------------------------
  Code Client / Tiers : [f001           ]   Nom / Raison Sociale : [f002       ]
  Agence Gestionnaire : [f003 ]             Numéro de Compte     : [f004       ]
  Période du           : [f005      ]       Au                   : [f006      ]
  Statut Enregistrem. : [f007] (A=Actif, B=Bloqué, C=Clôturé, T=Tous)

  ----------------------- RÉSULTATS EXTRAITS DU SYSTÈME ------------------------
  [Identifiant] [Compte Rattaché] [Titulaire du Dossier   ] [Solde Devise      ]
  [f10        ] [f11            ] [f12                    ] [f13               ]
  [f10        ] [f11            ] [f12                    ] [f13               ]
  [f10        ] [f11            ] [f12                    ] [f13               ]
  [f10        ] [f11            ] [f12                    ] [f13               ]
  ------------------------------------------------------------------------------
  Occurrences Trouvées: [f99  ]

================================================================================
 [F2] Lancer Recherche (CONSTRUCT)   [F5] Reset   [F10] Ouvrir Fiche   [ESC] Sortir
}
END

TABLES
    ${primary.tableName.toLowerCase()}

ATTRIBUTES
    f001 = FORMONLY.q_cli TYPE CHAR(15), UPSHIFT;
    f002 = FORMONLY.q_nom TYPE VARCHAR(25), UPSHIFT;
    f003 = FORMONLY.q_age TYPE CHAR(5), UPSHIFT;
    f004 = FORMONLY.q_ncp TYPE CHAR(11), UPSHIFT;
    f005 = FORMONLY.q_dat_deb TYPE DATE, FORMAT = "dd/mm/yyyy";
    f006 = FORMONLY.q_dat_fin TYPE DATE, FORMAT = "dd/mm/yyyy";
    f007 = FORMONLY.q_statut TYPE CHAR(1), DEFAULT = "T", UPSHIFT;

    f10  = ${primary.tableName.toLowerCase()}.${pkCols[0]?.toLowerCase() || "cli"}, NOENTRY, UPSHIFT;
    f11  = FORMONLY.r_cpt TYPE CHAR(11), NOENTRY;
    f12  = FORMONLY.r_nom TYPE VARCHAR(25), NOENTRY;
    f13  = FORMONLY.r_sol TYPE DECIMAL(16,2), FORMAT = "---,---,---,--&.&&", NOENTRY;
    f99  = FORMONLY.nb_res TYPE INTEGER, NOENTRY;
INSTRUCTIONS
    DELIMITERS "[]"
    SCREEN RECORD s_res[4] (${pkCols[0]?.toLowerCase() || "cli"}, r_cpt, r_nom, r_sol)
END`;

    visualMockup = `+------------------------------------------------------------------------------+
|          SOPRA BANKING AMPLITUDE - MOTEUR DE RECHERCHE MULTI-CRITÈRES        |
+------------------------------------------------------------------------------+
  ---------------------------- CRITÈRES DE FILTRAGE ---------------------------
  Code Client / Tiers : [CLI-0010*      ]   Nom / Raison Sociale : [DIALLO*    ]
  Agence Gestionnaire : [01001]             Numéro de Compte     : [           ]
  Période du           : [01/01/2026]       Au                   : [26/09/2026]
  Statut Enregistrem. : [A] (A=Actif, B=Bloqué, C=Clôturé, T=Tous)

  ----------------------- RÉSULTATS EXTRAITS DU SYSTÈME ------------------------
  [Identifiant] [Compte Rattaché] [Titulaire du Dossier   ] [Solde Devise      ]
  [CLI-0010042] [01001004281    ] [DIALLO MOHAMED OURY    ] [      4,850,000.00]
  [CLI-0010089] [01001008912    ] [DIALLO MAMADOU ALPHA   ] [        920,400.00]
  [CLI-0010155] [01001015509    ] [DIALLO AMINATA         ] [     12,340,000.00]
  [CLI-0010992] [01001099201    ] [ENTREPRISE DIALLO BTP  ] [     84,200,500.00]
  ------------------------------------------------------------------------------
  Occurrences Trouvées: [4    ]
+------------------------------------------------------------------------------+
 [F2] Lancer Recherche (CONSTRUCT)   [F5] Reset   [F10] Ouvrir Fiche   [ESC] Sortir
+------------------------------------------------------------------------------+`;

    fourGlSource = `###############################################################################
# Recherche Dynamique Informix 4GL (CONSTRUCT SQL) : ${baseName}_find.4gl
###############################################################################
DATABASE amplitude_db

MAIN
    DEFINE v_where VARCHAR(500), v_query VARCHAR(1000)

    OPEN FORM f_find FROM "${baseName}"
    DISPLAY FORM f_find

    -- Utilisation de la directive Informix CONSTRUCT pour générer la clause WHERE
    CONSTRUCT BY NAME v_where ON ${primary.tableName.toLowerCase()}.*
        BEFORE CONSTRUCT
            MESSAGE "Saisissez vos filtres (caractères génériques * autorisés) puis validez."
    END CONSTRUCT

    LET v_query = "SELECT * FROM ${primary.tableName.toLowerCase()} WHERE ", v_where CLIPPED
    PREPARE p_srch FROM v_query
    DECLARE c_srch CURSOR FOR p_srch

    CALL charger_tableau_resultats(c_srch)
    DISPLAY ARRAY g_res TO s_res.*
        ON KEY (F10)
            CALL ouvrir_fiche_detail(g_res[ARR_CURR()].id)
    END DISPLAY

    CLOSE FORM f_find
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
    guiMockupData,
    syntaxMode,
    schemaHeaderType,
    fieldsConfig,
    screenLayoutType: layoutType,
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
  };
}
