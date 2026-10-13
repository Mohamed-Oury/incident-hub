import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Autoriser les ressources publiques statiques et API publiques
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/api/cbs/agentic") ||
    pathname === "/login" ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // 2. Vérifier la présence de la session pour les routes protégées
  const sessionCookie = request.cookies.get("payway_session");

  if (!sessionCookie || !sessionCookie.value) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 3. Contrôle d'accès basé sur les rôles (RBAC) pour les utilisateurs connectés
  try {
    const rawCookie = sessionCookie?.value || "";
    const lastDot = rawCookie.lastIndexOf(".");
    if (lastDot !== -1) {
      const payloadBase64 = rawCookie.slice(0, lastDot);
      const decodedJson = atob(payloadBase64.replace(/-/g, "+").replace(/_/g, "/"));
      const user = JSON.parse(decodedJson);
      const userRole = user?.role || "OPERATOR";

      // Tout contrôle RBAC additionnel si nécessaire
    }
  } catch (err) {
    console.warn("Erreur validation middleware session:", err);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
