import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/modules/auth/auth-service";
import crypto from "crypto";

function hashPassword(p: string) {
  return crypto.createHash("sha256").update(p).digest("hex");
}

// Récupération de la liste des utilisateurs (Seul ADMIN autorisé)
export async function GET() {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Accès réservé aux administrateurs." }, { status: 403 });
  }

  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        active: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ users });
  } catch (err: any) {
    return NextResponse.json({ error: "Erreur base de données: " + err.message }, { status: 500 });
  }
}

// Création d'un nouvel utilisateur avec mot de passe par défaut 123456
export async function POST(request: Request) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Accès réservé aux administrateurs." }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { name, email, role } = body;

    if (!name || !email || !role) {
      return NextResponse.json({ error: "Nom, email et rôle sont obligatoires." }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();
    const defaultPassword = "123456";
    const passwordHash = hashPassword(defaultPassword);

    // Vérifier l'unicité
    const existing = await prisma.user.findUnique({ where: { email: cleanEmail } });
    if (existing) {
      return NextResponse.json({ error: "Un utilisateur avec cet email existe déjà." }, { status: 400 });
    }

    const newUser = await prisma.user.create({
      data: {
        name: name.trim(),
        email: cleanEmail,
        role: role as any,
        passwordHash: passwordHash,
        active: true,
      },
    });

    // Enregistrement dans l'Audit Log
    try {
      await prisma.auditLog.create({
        data: {
          action: "CREATE_USER",
          entity: "USER",
          entityId: newUser.id,
          userId: session.id,
          metadata: { createdEmail: cleanEmail, role: role, defaultPassword: true },
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
        defaultPassword: defaultPassword,
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: "Échec création: " + err.message }, { status: 500 });
  }
}
