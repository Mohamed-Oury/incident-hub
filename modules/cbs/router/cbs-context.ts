// modules/cbs/router/cbs-context.ts

export type CbsType = "AMPLITUDE" | "FLEXCUBE";
export type CbsWorkMode = "BUILD" | "RUN";

export interface CbsVersionInfo {
  cbsType: CbsType;
  versionName: string;
  isConfirmed: boolean;
  notes: string;
}

export interface CbsPromptTraceability {
  officialDocsUsed: string[];
  inferredRules: string[];
  unconfirmedAssumptions: string[];
  versionCaveat: string;
}

export const SUPPORTED_CBS_PLATFORMS: Record<CbsType, {
  name: string;
  vendor: string;
  primaryLanguage: string;
  database: string;
  description: string;
  versions: string[];
}> = {
  AMPLITUDE: {
    name: "Sopra Amplitude",
    vendor: "Sopra Banking Software",
    primaryLanguage: "Informix 4GL / Genero BDL",
    database: "Oracle / Informix SGBD",
    description: "Core Banking System modulaire avec interfaces terminales .per et chaîne batch EOD/BOD.",
    versions: ["v10.x", "v11.x", "v12.x", "v13.x"],
  },
  FLEXCUBE: {
    name: "Oracle FLEXCUBE",
    vendor: "Oracle Financial Services Software (OFSS)",
    primaryLanguage: "Oracle PL/SQL & RAD / ODT Workbench",
    database: "Oracle Database Enterprise (RAC, Partitioning)",
    description: "Core Banking universel multicompte, multidevise avec moteur comptable AC/GL et chaîne AEOD.",
    versions: ["12.4", "14.x", "Version à confirmer"],
  },
};
