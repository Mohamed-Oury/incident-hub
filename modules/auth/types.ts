export type UserRole = 
  | "ADMIN"           // Accès total
  | "ROLE_EXPLOITATION" // Vue d'ensemble, Base de connaissance, Diagnostic Assistant
  | "ROLE_DECODEURS"    // Parseur Trame ISO, Décodeur Bitmap, Décodeur EMV/DE55, Journal GAB
  | "ROLE_REFERENTIELS" // Référentiel MTI, Référentiel DE39, Piste d'audit
  | "ROLE_EXPERTISE";   // Diagnostic Clés HSM, Matrice Time-Outs, Générateur Post-Mortem

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

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
  },
  {
    id: "usr-exploitant",
    email: "exploitant@monetique.com",
    name: "Agent Exploitation",
    role: "ROLE_EXPLOITATION",
  },
  {
    id: "usr-analyste-iso",
    email: "analyste@monetique.com",
    name: "Analyste Décodeurs ISO",
    role: "ROLE_DECODEURS",
  },
  {
    id: "usr-referentiel",
    email: "normes@monetique.com",
    name: "Gestionnaire Référentiels",
    role: "ROLE_REFERENTIELS",
  },
  {
    id: "usr-expert-cbs",
    email: "expert@monetique.com",
    name: "Expert HSM & Architecte",
    role: "ROLE_EXPERTISE",
  },
];
