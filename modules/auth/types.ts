export type UserRole =
  | "ADMIN"             // Accès total
  | "OPERATOR"          // Opérateur système
  | "EXPERT"            // Expert Monétique & CBS
  | "VALIDATOR"         // Validateur d'incidents
  | "VIEWER"            // Lecteur / Observateur
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
  ADMIN: "/hub",
  OPERATOR: "/hub",
  EXPERT: "/cbs",
  VALIDATOR: "/hub/incidents",
  VIEWER: "/hub",
  ROLE_EXPLOITATION: "/hub",
  ROLE_DECODEURS: "/hub/parser",
  ROLE_REFERENTIELS: "/hub/mti",
  ROLE_EXPERTISE: "/hub/crypto-hsm",
};

// Liste des routes autorisées pour chaque rôle
export const ROLE_ALLOWED_ROUTES: Record<UserRole, string[]> = {
  ADMIN: ["*"], // Tout est autorisé
  OPERATOR: ["/", "/hub", "/hub/knowledge", "/hub/diagnostic", "/hub/incidents", "/cbs", "/hub/parser", "/hub/bitmap", "/hub/emv", "/hub/atm-ej"],
  EXPERT: ["*"],
  VALIDATOR: ["/", "/hub", "/hub/knowledge", "/hub/diagnostic", "/hub/incidents", "/hub/audit"],
  VIEWER: ["/", "/hub", "/hub/knowledge", "/hub/mti", "/hub/de39"],
  ROLE_EXPLOITATION: ["/", "/hub", "/hub/knowledge", "/hub/diagnostic", "/hub/incidents", "/cbs"],
  ROLE_DECODEURS: ["/hub/parser", "/hub/bitmap", "/hub/emv", "/hub/atm-ej", "/cbs"],
  ROLE_REFERENTIELS: ["/hub/mti", "/hub/de39", "/hub/audit", "/cbs"],
  ROLE_EXPERTISE: ["/hub/crypto-hsm", "/hub/timeout-matrix", "/hub/post-mortem", "/cbs"],
};

export const ROLE_LABELS: Record<UserRole, string> = {
  ADMIN: "Administrateur Global (Accès Total)",
  OPERATOR: "Opérateur Système",
  EXPERT: "Expert Monétique & CBS",
  VALIDATOR: "Validateur d'Incidents",
  VIEWER: "Lecteur / Observateur",
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
