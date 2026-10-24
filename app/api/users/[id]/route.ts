export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/modules/auth/auth-service";
import { canManageUsers, UserRole } from "@/modules/auth/types";
import { updateStoredUser, deleteStoredUser } from "@/modules/auth/user-store";

// Mise à jour d'un utilisateur (Nom, Email, Rôles cochés, Statut Actif, ou réinitialisation MDP)
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session || !canManageUsers(session)) {
    return NextResponse.json(
      { error: "Accès réservé exclusivement au Super Administrateur." },
      { status: 403 }
    );
  }

  try {
    const { id } = await params;
    const body = await request.json();
    const { name, email, role, roles, active, resetPassword, password } = body;

    const updated = await updateStoredUser(id, {
      name,
      email,
      role: role as UserRole,
      roles: Array.isArray(roles) ? (roles as UserRole[]) : undefined,
      active,
      resetPassword,
      password,
    });

    // Piste d'audit
    try {
      await prisma.auditLog.create({
        data: {
          action: "UPDATE_USER",
          entity: "USER",
          entityId: updated.id,
          userId: session.id,
          metadata: {
            newRole: updated.role,
            newRoles: updated.roles,
            active: updated.active,
          },
        },
      });
    } catch {
      // ignore
    }

    return NextResponse.json({
      success: true,
      user: {
        id: updated.id,
        name: updated.name,
        email: updated.email,
        role: updated.role,
        roles: updated.roles,
        active: updated.active,
        createdAt: updated.createdAt,
        updatedAt: updated.updatedAt,
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Échec mise à jour" },
      { status: 400 }
    );
  }
}

// Suppression d'un utilisateur (Seul SUPER_ADMIN autorisé)
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session || !canManageUsers(session)) {
    return NextResponse.json(
      { error: "Accès réservé exclusivement au Super Administrateur." },
      { status: 403 }
    );
  }

  try {
    const { id } = await params;
    const deleted = await deleteStoredUser(id);

    try {
      await prisma.auditLog.create({
        data: {
          action: "DELETE_USER",
          entity: "USER",
          entityId: id,
          userId: session.id,
          metadata: { deletedEmail: deleted.email },
        },
      });
    } catch {
      // ignore
    }

    return NextResponse.json({ success: true, message: "Utilisateur supprimé." });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Échec suppression" },
      { status: 400 }
    );
  }
}
