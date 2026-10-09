import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, subject, content } = body;

    if (!name || !email || !content) {
      return NextResponse.json({ error: "Tous les champs obligatoires doivent être remplis." }, { status: 400 });
    }

    const message = await prisma.message.create({
      data: {
        name,
        email,
        subject: subject || "Contact depuis Portfolio",
        content,
      },
    });

    return NextResponse.json({ success: true, message });
  } catch (error) {
    console.error("Erreur création message:", error);
    return NextResponse.json({ error: "Une erreur est survenue." }, { status: 500 });
  }
}
