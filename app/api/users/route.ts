export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/modules/auth/auth-service";
import { canManageUsers, UserRole } from "@/modules/auth/types";
import { getAllUsers, createStoredUser } from "@/modules/auth/user-store";

// Récupération de la liste des utilisateurs (Seul SUPER_ADMIN autorisé)
export async function GET() {
  const session = await getSession();
  if (!session || !canManageUsers(session)) {
    return NextResponse.json(
      { error: "Accès réservé exclusivement au Super Administrateur." },
      { status: 403 }
    );
  }

  try {
    const users = await getAllUsers();
    const sanitized = users.map((u) => ({
      id: u.id,
      email: u.email,
      name: u.name,
      role: u.role,
      roles: u.roles,
      active: u.active,
      createdAt: u.createdAt,
      updatedAt: u.updatedAt,
    }));
    return NextResponse.json({ users: sanitized });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Erreur lecture utilisateurs: " + err.message },
      { status: 500 }
    );
  }
}

// Création d'un nouvel utilisateur avec sélection des rôles (cases à cocher)
export async function POST(request: Request) {
  const session = await getSession();
  if (!session || !canManageUsers(session)) {
    return NextResponse.json(
      { error: "Accès réservé exclusivement au Super Administrateur." },
      { status: 403 }
    );
  }

  try {
    const body = await request.json();
    const { name, email, role, roles, password } = body;

    const checkedRoles: UserRole[] =
      Array.isArray(roles) && roles.length > 0
        ? roles
        : role
          ? [role]
          : [];

    if (!name || !email || checkedRoles.length === 0) {
      return NextResponse.json(
        { error: "Nom, email et au moins un rôle coché sont obligatoires." },
        { status: 400 }
      );
    }

    const defaultPassword = password && password.trim() ? password.trim() : "123456";
    const newUser = await createStoredUser({
      name,
      email,
      role: role as UserRole,
      roles: checkedRoles,
      password: defaultPassword,
    });

    // Enregistrement dans l'Audit Log
    try {
      await prisma.auditLog.create({
        data: {
          action: "CREATE_USER",
          entity: "USER",
          entityId: newUser.id,
          userId: session.id,
          metadata: {
            createdEmail: newUser.email,
            role: newUser.role,
            roles: newUser.roles,
          },
        },
      });
    } catch {
      // ignore
    }

    return NextResponse.json({
      success: true,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        roles: newUser.roles,
        active: newUser.active,
        createdAt: newUser.createdAt,
        defaultPassword,
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Échec création" }, { status: 400 });
  }
}
