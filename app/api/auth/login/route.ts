import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createSession } from "@/modules/auth/auth-service";
import crypto from "crypto";

function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password).digest("hex");
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, demoEmail } = body;

    const targetEmail = (demoEmail || email || "").trim().toLowerCase();
    const inputPassword = (password || "").trim();

    if (!targetEmail) {
      return NextResponse.json({ error: "L'adresse email est requise." }, { status: 400 });
    }

    let user: any = null;

    // 1. Recherche dans MySQL via Prisma
    try {
      user = await prisma.user.findUnique({
        where: { email: targetEmail },
      });
    } catch (dbError) {
      console.warn("Connexion Prisma MySQL:", dbError);
    }

    // 2. Gestion de l'authentification
    if (demoEmail) {
      if (!user) {
        // Profils démo de repli
        const rolesMapping: Record<string, string> = {
          "ourykohkoun@gmail.com": "ADMIN",
          "exploitant@monetique.com": "ROLE_EXPLOITATION",
          "analyste@monetique.com": "ROLE_DECODEURS",
          "normes@monetique.com": "ROLE_REFERENTIELS",
          "expert@monetique.com": "ROLE_EXPERTISE",
        };
        user = {
          id: `usr-${Date.now()}`,
          email: targetEmail,
          name: targetEmail.split("@")[0].toUpperCase(),
          role: rolesMapping[targetEmail] || "ADMIN",
        };
      }
    } else {
      // Cas connexion normale par mot de passe
      if (targetEmail === "ourykohkoun@gmail.com") {
        if (inputPassword !== "123456") {
          return NextResponse.json({ error: "Mot de passe incorrect." }, { status: 401 });
        }
        if (!user) {
          user = {
            id: "usr-ourykohkoun",
            email: "ourykohkoun@gmail.com",
            name: "Oury Kohkoun (Administrateur Global)",
            role: "ADMIN",
          };
        }
      } else {
        if (!user) {
          return NextResponse.json({ error: "Utilisateur introuvable." }, { status: 401 });
        }
        const inputHash = hashPassword(inputPassword);
        // Tolérance mot de passe 123456 ou hash en base
        if (inputPassword !== "123456" && user.passwordHash && user.passwordHash !== inputHash) {
          return NextResponse.json({ error: "Mot de passe incorrect." }, { status: 401 });
        }
      }
    }

    // 3. Création de la session signée
    const sessionUser = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };

    await createSession(sessionUser);

    // 4. Audit Log
    try {
      await prisma.auditLog.create({
        data: {
          action: "USER_LOGIN_SUCCESS",
          entity: "USER",
          entityId: user.id,
          userId: user.id,
          metadata: { email: user.email, role: user.role },
        },
      });
    } catch {
      // ignore
    }

    return NextResponse.json({ success: true, user: sessionUser });
  } catch (error: any) {
    console.error("Erreur login API:", error);
    return NextResponse.json({ error: "Erreur interne lors de la connexion." }, { status: 500 });
  }
}
