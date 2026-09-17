import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/modules/auth/auth-service";
import crypto from "crypto";

function hashPassword(p: string) {
  return crypto.createHash("sha256").update(p).digest("hex");
}

// Mise à jour d'un utilisateur (Nom, Email, Rôle, Statut Actif, ou réinitialisation MDP)
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Accès réservé aux administrateurs." }, { status: 403 });
  }

  try {
    const { id } = await params;
    const body = await request.json();
    const { name, email, role, active, resetPassword } = body;

    const existingUser = await prisma.user.findUnique({ where: { id } });
    if (!existingUser) {
      return NextResponse.json({ error: "Utilisateur introuvable." }, { status: 404 });
    }

    const updateData: any = {};
    if (name) updateData.name = name.trim();
    if (email) updateData.email = email.trim().toLowerCase();
    if (role) updateData.role = role;
    if (typeof active === "boolean") updateData.active = active;
    if (resetPassword) {
      updateData.passwordHash = hashPassword("123456");
    }

    const updated = await prisma.user.update({
      where: { id },
      data: updateData,
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
            updatedFields: Object.keys(updateData),
            newRole: updated.role,
            active: updated.active,
          },
        },
      });
    } catch {
      // ignore
    }

    return NextResponse.json({ success: true, user: updated });
  } catch (err: any) {
    return NextResponse.json({ error: "Échec mise à jour: " + err.message }, { status: 500 });
  }
}

// Suppression d'un utilisateur (interdit de supprimer l'admin principal)
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Accès réservé aux administrateurs." }, { status: 403 });
  }

  try {
    const { id } = await params;
    const existing = await prisma.user.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Utilisateur introuvable." }, { status: 404 });
    }

    if (existing.email === "ourykohkoun@gmail.com") {
      return NextResponse.json({ error: "Le compte administrateur principal ne peut pas être supprimé." }, { status: 400 });
    }

    await prisma.user.delete({ where: { id } });

    try {
      await prisma.auditLog.create({
        data: {
          action: "DELETE_USER",
          entity: "USER",
          entityId: id,
          userId: session.id,
          metadata: { deletedEmail: existing.email },
        },
      });
    } catch {
      // ignore
    }

    return NextResponse.json({ success: true, message: "Utilisateur supprimé." });
  } catch (err: any) {
    return NextResponse.json({ error: "Échec suppression: " + err.message }, { status: 500 });
  }
}
