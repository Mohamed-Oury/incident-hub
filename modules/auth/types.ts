export type UserRole =
  | "ADMIN"           // Accès total
  | "ROLE_EXPLOITATION" // Vue d'ensemble (/), Base de connaissance (/knowledge), Diagnostic Assistant (/diagnostic)
  | "ROLE_DECODEURS"    // Parseur Trame ISO (/parser), Décodeur Bitmap (/bitmap), Décodeur EMV/DE55 (/emv), Journal GAB (/atm-ej)
  | "ROLE_REFERENTIELS" // Référentiel MTI (/mti), Référentiel DE39 (/de39), Piste d'audit (/audit)
  | "ROLE_EXPERTISE";   // Diagnostic Clés HSM (/crypto-hsm), Matrice Time-Outs (/timeout-matrix), Générateur Post-Mortem (/post-mortem)

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

// 1ère page par défaut pour chaque rôle
export const ROLE_DEFAULT_PAGES: Record<UserRole, string> = {
  ADMIN: "/",
  ROLE_EXPLOITATION: "/",
  ROLE_DECODEURS: "/parser",
  ROLE_REFERENTIELS: "/mti",
  ROLE_EXPERTISE: "/crypto-hsm",
};

// Liste des routes autorisées pour chaque rôle
export const ROLE_ALLOWED_ROUTES: Record<UserRole, string[]> = {
  ADMIN: ["*"], // Tout est autorisé
  ROLE_EXPLOITATION: ["/", "/knowledge", "/diagnostic", "/incidents"],
  ROLE_DECODEURS: ["/parser", "/bitmap", "/emv", "/atm-ej"],
  ROLE_REFERENTIELS: ["/mti", "/de39", "/audit"],
  ROLE_EXPERTISE: ["/crypto-hsm", "/timeout-matrix", "/post-mortem"],
};

export const ROLE_LABELS: Record<UserRole, string> = {
  ADMIN: "Administrateur Global (Accès Total)",
  ROLE_EXPLOITATION: "Pôle Exploitation & Diagnostic",
  ROLE_DECODEURS: "Pôle Analyse & Décodeurs (ISO/EMV/EJ)",
  ROLE_REFERENTIELS: "Pôle Normes & Référentiels (MTI/DE39)",
  ROLE_EXPERTISE: "Pôle Expertise Avancée (HSM/Timeouts)",
};

export const DEMO_USERS: SessionUser[] = [
  {
    id: "usr-ourykohkoun",
    email: "ourykohkoun@gmail.com",
    name: "Oury Kohkoun",
    role: "ADMIN",
  }
];
