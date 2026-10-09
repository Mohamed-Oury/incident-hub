import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Autoriser les ressources publiques statiques et API publiques
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/api/portfolio") ||
    pathname === "/login" ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // 2. Définir les routes publiques du Portfolio (accessibles à tous sans connexion)
  const isPublicRoute =
    pathname === "/" ||
    pathname.startsWith("/portfolio") ||
    pathname.startsWith("/a-propos") ||
    pathname.startsWith("/projets") ||
    pathname.startsWith("/blog") ||
    pathname.startsWith("/contact");

  // 3. Vérifier la présence de la session pour les routes protégées
  const sessionCookie = request.cookies.get("payway_session");

  if (!isPublicRoute && (!sessionCookie || !sessionCookie.value)) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 4. Si la route est publique et qu'il n'y a pas de session, laisser passer
  if (isPublicRoute && (!sessionCookie || !sessionCookie.value)) {
    return NextResponse.next();
  }

  // 5. Contrôle d'accès basé sur les rôles (RBAC) pour les utilisateurs connectés
  try {
    const rawCookie = sessionCookie?.value || "";
    const lastDot = rawCookie.lastIndexOf(".");
    if (lastDot !== -1) {
      const payloadBase64 = rawCookie.slice(0, lastDot);
      const decodedJson = atob(payloadBase64.replace(/-/g, "+").replace(/_/g, "/"));
      const user = JSON.parse(decodedJson);
      const userRole = user?.role || "OPERATOR";

      // Si l'utilisateur tente d'accéder à /admin et qu'il n'est pas ADMIN
      if (pathname.startsWith("/admin") && userRole !== "ADMIN") {
        return NextResponse.redirect(new URL("/hub", request.url));
      }
    }
  } catch (err) {
    console.warn("Erreur validation middleware session:", err);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
