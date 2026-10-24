import fs from "fs";
import path from "path";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { UserRole, SUPER_ADMIN_EMAILS, getUserRoles } from "./types";

const DATA_DIR = path.join(process.cwd(), ".data");
const USERS_FILE = path.join(DATA_DIR, "users.json");

export interface StoredUser {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
  role: UserRole;
  roles: UserRole[];
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password).digest("hex");
}

function getDefaultSeedUsers(): StoredUser[] {
  const now = new Date("2026-09-17T08:00:00.000Z").toISOString();
  return [
    {
      id: "usr-mohaourydiallo",
      email: "mohaourydiallo@gmail.com",
      name: "M. Oury Diallo (Super Administrateur)",
      passwordHash: hashPassword("admin123"),
      role: "SUPER_ADMIN",
      roles: ["SUPER_ADMIN", "ROLE_MONETIQUE", "ROLE_AMPLITUDE", "ROLE_FLEXCUBE"],
      active: true,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: "usr-ourykohkoun",
      email: "ourykohkoun@gmail.com",
      name: "Oury Kohkoun (Super Administrateur)",
      passwordHash: hashPassword("123456"),
      role: "SUPER_ADMIN",
      roles: ["SUPER_ADMIN", "ROLE_MONETIQUE", "ROLE_AMPLITUDE", "ROLE_FLEXCUBE"],
      active: true,
      createdAt: now,
      updatedAt: now,
    },
  ];
}

function readLocalUsers(): StoredUser[] {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(USERS_FILE)) {
      const defaults = getDefaultSeedUsers();
      fs.writeFileSync(USERS_FILE, JSON.stringify(defaults, null, 2), "utf-8");
      return defaults;
    }
    const raw = fs.readFileSync(USERS_FILE, "utf-8");
    const parsed: StoredUser[] = JSON.parse(raw);

    // S'assurer que les superadmins par défaut sont présents
    let changed = false;
    const defaults = getDefaultSeedUsers();
    for (const def of defaults) {
      const idx = parsed.findIndex((u) => u.email.toLowerCase() === def.email.toLowerCase());
      if (idx === -1) {
        parsed.unshift(def);
        changed = true;
      } else {
        // Garantir le rôle SUPER_ADMIN sur les comptes superadmin principaux
        if (!parsed[idx].roles || !parsed[idx].roles.includes("SUPER_ADMIN")) {
          parsed[idx].role = "SUPER_ADMIN";
          parsed[idx].roles = getUserRoles(parsed[idx]);
          changed = true;
        }
      }
    }

    if (changed) {
      fs.writeFileSync(USERS_FILE, JSON.stringify(parsed, null, 2), "utf-8");
    }
    return parsed;
  } catch (err) {
    console.warn("Erreur lecture .data/users.json:", err);
    return getDefaultSeedUsers();
  }
}

function writeLocalUsers(users: StoredUser[]): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), "utf-8");
  } catch (err) {
    console.error("Erreur écriture .data/users.json:", err);
  }
}

function toPrismaSafeRole(role: UserRole): "VIEWER" | "OPERATOR" | "EXPERT" | "VALIDATOR" | "ADMIN" {
  if (role === "SUPER_ADMIN" || role === "ADMIN") return "ADMIN";
  if (role === "EXPERT" || role === "ROLE_AMPLITUDE" || role === "ROLE_FLEXCUBE" || role === "ROLE_EXPERTISE") return "EXPERT";
  if (role === "VALIDATOR") return "VALIDATOR";
  if (role === "VIEWER") return "VIEWER";
  return "OPERATOR";
}

export function resolvePrimaryRole(roles: UserRole[], explicitPrimary?: UserRole): UserRole {
  if (roles.includes("SUPER_ADMIN")) return "SUPER_ADMIN";
  if (roles.includes("ADMIN")) return "ADMIN";
  if (explicitPrimary && roles.includes(explicitPrimary)) return explicitPrimary;
  return roles[0] || "ROLE_MONETIQUE";
}

export async function getAllUsers(): Promise<StoredUser[]> {
  const localUsers = readLocalUsers();
  const byEmail = new Map<string, StoredUser>();

  for (const u of localUsers) {
    byEmail.set(u.email.toLowerCase(), {
      ...u,
      roles: getUserRoles(u),
    });
  }

  try {
    const dbUsers = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
    });
    for (const dbU of dbUsers) {
      const emailKey = dbU.email.toLowerCase();
      const existing = byEmail.get(emailKey);
      if (!existing) {
        const isSuper = SUPER_ADMIN_EMAILS.includes(emailKey);
        const primaryRole: UserRole = isSuper ? "SUPER_ADMIN" : (dbU.role as UserRole);
        const stored: StoredUser = {
          id: dbU.id,
          email: dbU.email,
          name: dbU.name,
          passwordHash: dbU.passwordHash || hashPassword("123456"),
          role: primaryRole,
          roles: getUserRoles({ id: dbU.id, email: dbU.email, name: dbU.name, role: primaryRole }),
          active: dbU.active,
          createdAt: dbU.createdAt.toISOString(),
          updatedAt: dbU.updatedAt.toISOString(),
        };
        byEmail.set(emailKey, stored);
      }
    }
  } catch {
    // DB MySQL non disponible, on utilise la persistance locale .data/users.json
  }

  const merged = Array.from(byEmail.values()).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  writeLocalUsers(merged);
  return merged;
}

export async function findUserByEmail(email: string): Promise<StoredUser | null> {
  const clean = email.trim().toLowerCase();
  const all = await getAllUsers();
  return all.find((u) => u.email.toLowerCase() === clean) || null;
}

export async function findUserById(id: string): Promise<StoredUser | null> {
  const all = await getAllUsers();
  return all.find((u) => u.id === id) || null;
}

export async function createStoredUser(input: {
  name: string;
  email: string;
  role?: UserRole;
  roles?: UserRole[];
  password?: string;
}): Promise<StoredUser> {
  const all = await getAllUsers();
  const cleanEmail = input.email.trim().toLowerCase();

  if (all.some((u) => u.email.toLowerCase() === cleanEmail)) {
    throw new Error("Un utilisateur avec cet email existe déjà.");
  }

  const rawRoles: UserRole[] =
    Array.isArray(input.roles) && input.roles.length > 0
      ? input.roles
      : input.role
        ? [input.role]
        : ["ROLE_MONETIQUE"];

  const primaryRole = resolvePrimaryRole(rawRoles, input.role);
  const normalizedRoles = getUserRoles({
    id: "temp",
    email: cleanEmail,
    name: input.name.trim(),
    role: primaryRole,
    roles: rawRoles,
  });

  const rawPassword = input.password && input.password.trim() ? input.password.trim() : "123456";
  const passwordHash = hashPassword(rawPassword);
  const now = new Date().toISOString();

  let newId = `usr-${Date.now()}`;

  try {
    const dbCreated = await prisma.user.create({
      data: {
        name: input.name.trim(),
        email: cleanEmail,
        role: toPrismaSafeRole(primaryRole) as any,
        passwordHash,
        active: true,
      },
    });
    newId = dbCreated.id;
  } catch {
    // Fallback local ID
  }

  const newUser: StoredUser = {
    id: newId,
    name: input.name.trim(),
    email: cleanEmail,
    passwordHash,
    role: primaryRole,
    roles: normalizedRoles,
    active: true,
    createdAt: now,
    updatedAt: now,
  };

  all.unshift(newUser);
  writeLocalUsers(all);
  return newUser;
}

export async function updateStoredUser(
  id: string,
  input: {
    name?: string;
    email?: string;
    role?: UserRole;
    roles?: UserRole[];
    active?: boolean;
    password?: string;
    resetPassword?: boolean;
  }
): Promise<StoredUser> {
  const all = await getAllUsers();
  const idx = all.findIndex((u) => u.id === id);
  if (idx === -1) {
    throw new Error("Utilisateur introuvable.");
  }

  const target = { ...all[idx] };

  if (input.name) target.name = input.name.trim();
  if (input.email) {
    const cleanEmail = input.email.trim().toLowerCase();
    const duplicate = all.find((u, i) => i !== idx && u.email.toLowerCase() === cleanEmail);
    if (duplicate) {
      throw new Error("Un autre utilisateur utilise déjà cet email.");
    }
    target.email = cleanEmail;
  }

  if (Array.isArray(input.roles) && input.roles.length > 0) {
    const primary = resolvePrimaryRole(input.roles, input.role);
    target.role = primary;
    target.roles = getUserRoles({
      id: target.id,
      email: target.email,
      name: target.name,
      role: primary,
      roles: input.roles,
    });
  } else if (input.role) {
    target.role = input.role;
    target.roles = getUserRoles({
      id: target.id,
      email: target.email,
      name: target.name,
      role: input.role,
      roles: [input.role],
    });
  }

  if (typeof input.active === "boolean") {
    target.active = input.active;
  }

  if (input.resetPassword) {
    target.passwordHash = hashPassword("123456");
  } else if (input.password && input.password.trim()) {
    target.passwordHash = hashPassword(input.password.trim());
  }

  target.updatedAt = new Date().toISOString();
  all[idx] = target;
  writeLocalUsers(all);

  try {
    await prisma.user.updateMany({
      where: { OR: [{ id: target.id }, { email: target.email }] },
      data: {
        name: target.name,
        email: target.email,
        role: toPrismaSafeRole(target.role) as any,
        active: target.active,
        passwordHash: target.passwordHash,
      },
    });
  } catch {
    // Ignore DB sync error if MySQL is offline
  }

  return target;
}

export async function deleteStoredUser(id: string): Promise<StoredUser> {
  const all = await getAllUsers();
  const idx = all.findIndex((u) => u.id === id);
  if (idx === -1) {
    throw new Error("Utilisateur introuvable.");
  }

  const target = all[idx];
  if (SUPER_ADMIN_EMAILS.includes(target.email.toLowerCase())) {
    throw new Error("Le compte Super Administrateur principal ne peut pas être supprimé.");
  }

  const remaining = all.filter((u) => u.id !== id);
  writeLocalUsers(remaining);

  try {
    await prisma.user.deleteMany({
      where: { OR: [{ id: target.id }, { email: target.email }] },
    });
  } catch {
    // Ignore DB sync error
  }

  return target;
}
