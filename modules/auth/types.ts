export type UserRole =
  | "SUPER_ADMIN"       // Super Administrateur (Accès total + Gestion des users + Suppression/Modification incidents)
  | "ADMIN"             // Administrateur (Modification d'incidents validés, accès étendu)
  | "ROLE_MONETIQUE"    // Accès au module Monétique (/hub/*)
  | "ROLE_AMPLITUDE"    // Accès au module Sopra Amplitude 4GL (/cbs/*)
  | "ROLE_FLEXCUBE"     // Accès au module Oracle FLEXCUBE (/cbs/flexcube/*)
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
  roles?: UserRole[];
}

export const SUPER_ADMIN_EMAILS = [
  "ourykohkoun@gmail.com",
  "mohaourydiallo@gmail.com",
];

export const MODULE_ROLES: { role: UserRole; label: string; badge: string; color: string; description: string }[] = [
  {
    role: "ROLE_MONETIQUE",
    label: "Module Monétique",
    badge: "💳 Monétique",
    color: "#e11d48",
    description: "Accès à l'univers Monétique (Catalogue incidents, Diagnostic, Décodeurs ISO/EMV/GAB, HSM, Formation)",
  },
  {
    role: "ROLE_AMPLITUDE",
    label: "Module Amplitude",
    badge: "🏦 Amplitude",
    color: "#0284c7",
    description: "Accès à l'univers Sopra Banking Amplitude (Copilot 4GL, Studio .per, Dictionnaire, Academy, Logs AIX)",
  },
  {
    role: "ROLE_FLEXCUBE",
    label: "Module FLEXCUBE",
    badge: "🏛️ FLEXCUBE",
    color: "#ea580c",
    description: "Accès à l'univers Oracle FLEXCUBE (Copilot PL/SQL, Tables FCUBS, Cursus Certifiant, Incidents AEOD)",
  },
];

// 1ère page par défaut pour chaque rôle
export const ROLE_DEFAULT_PAGES: Record<UserRole, string> = {
  SUPER_ADMIN: "/hub",
  ADMIN: "/hub",
  ROLE_MONETIQUE: "/hub",
  ROLE_AMPLITUDE: "/cbs",
  ROLE_FLEXCUBE: "/cbs/flexcube",
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
  SUPER_ADMIN: ["*"],
  ADMIN: ["*"],
  ROLE_MONETIQUE: ["/", "/hub"],
  ROLE_AMPLITUDE: ["/cbs"],
  ROLE_FLEXCUBE: ["/cbs/flexcube"],
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
  SUPER_ADMIN: "Super Administrateur (Contrôle Total & Gestion Users)",
  ADMIN: "Administrateur (Gestion Incidents & Supervision)",
  ROLE_MONETIQUE: "Accès Module Monétique",
  ROLE_AMPLITUDE: "Accès Module Sopra Amplitude",
  ROLE_FLEXCUBE: "Accès Module Oracle FLEXCUBE",
  OPERATOR: "Opérateur Système",
  EXPERT: "Expert Monétique & CBS",
  VALIDATOR: "Validateur d'Incidents",
  VIEWER: "Lecteur / Observateur",
  ROLE_EXPLOITATION: "Pôle Exploitation & Diagnostic",
  ROLE_DECODEURS: "Pôle Analyse & Décodeurs (ISO/EMV/EJ)",
  ROLE_REFERENTIELS: "Pôle Normes & Référentiels (MTI/DE39)",
  ROLE_EXPERTISE: "Pôle Expertise Avancée (HSM/Timeouts)",
};

export function getUserRoles(user?: SessionUser | null): UserRole[] {
  if (!user) return [];
  const set = new Set<UserRole>();
  if (user.role) set.add(user.role);
  if (Array.isArray(user.roles)) {
    for (const r of user.roles) {
      if (r) set.add(r);
    }
  }
  if (
    user.email &&
    SUPER_ADMIN_EMAILS.includes(user.email.trim().toLowerCase())
  ) {
    set.add("SUPER_ADMIN");
    set.add("ROLE_MONETIQUE");
    set.add("ROLE_AMPLITUDE");
    set.add("ROLE_FLEXCUBE");
  }
  if (set.has("SUPER_ADMIN")) {
    set.add("ROLE_MONETIQUE");
    set.add("ROLE_AMPLITUDE");
    set.add("ROLE_FLEXCUBE");
  }
  return Array.from(set);
}

export function isSuperAdminUser(user?: SessionUser | null): boolean {
  return getUserRoles(user).includes("SUPER_ADMIN");
}

export function isAdminOrSuperAdminUser(user?: SessionUser | null): boolean {
  const roles = getUserRoles(user);
  return roles.includes("SUPER_ADMIN") || roles.includes("ADMIN");
}

export function canManageUsers(user?: SessionUser | null): boolean {
  return isSuperAdminUser(user);
}

export function canEditIncident(user?: SessionUser | null): boolean {
  return isAdminOrSuperAdminUser(user);
}

export function canDeleteIncident(user?: SessionUser | null): boolean {
  return isSuperAdminUser(user);
}

export function canAccessModule(
  user: SessionUser | null | undefined,
  moduleKey: "MONETIQUE" | "AMPLITUDE" | "FLEXCUBE"
): boolean {
  if (!user) return false;
  const roles = getUserRoles(user);
  if (roles.includes("SUPER_ADMIN")) return true;

  const hasExplicitModuleRole =
    roles.includes("ROLE_MONETIQUE") ||
    roles.includes("ROLE_AMPLITUDE") ||
    roles.includes("ROLE_FLEXCUBE");

  if (hasExplicitModuleRole) {
    if (moduleKey === "MONETIQUE") return roles.includes("ROLE_MONETIQUE");
    if (moduleKey === "AMPLITUDE") return roles.includes("ROLE_AMPLITUDE");
    if (moduleKey === "FLEXCUBE") return roles.includes("ROLE_FLEXCUBE");
  }

  // Rétrocompatibilité si aucun rôle module explicite n'a été coché
  if (roles.includes("ADMIN") || roles.includes("EXPERT")) return true;
  return moduleKey === "MONETIQUE";
}

export function getDefaultRedirectForUser(user?: SessionUser | null): string {
  if (!user) return "/login";
  if (canAccessModule(user, "MONETIQUE")) return "/hub";
  if (canAccessModule(user, "AMPLITUDE")) return "/cbs";
  if (canAccessModule(user, "FLEXCUBE")) return "/cbs/flexcube";
  return ROLE_DEFAULT_PAGES[user.role] || "/hub";
}

export const DEMO_USERS: SessionUser[] = [
  {
    id: "usr-ourykohkoun",
    email: "ourykohkoun@gmail.com",
    name: "Oury Kohkoun",
    role: "SUPER_ADMIN",
    roles: ["SUPER_ADMIN", "ROLE_MONETIQUE", "ROLE_AMPLITUDE", "ROLE_FLEXCUBE"],
  },
];

