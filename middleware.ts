import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ROLE_ALLOWED_ROUTES, ROLE_DEFAULT_PAGES, UserRole } from "@/modules/auth/types";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Autoriser les ressources publiques, API et pages statiques
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api/auth") ||
    pathname === "/login" ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // 2. Vérifier la présence du cookie de session
  const sessionCookie = request.cookies.get("payway_session");
  if (!sessionCookie || !sessionCookie.value) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  // 3. Extraction du rôle depuis le cookie signé
  // Format token : base64url(payload).hmac
  try {
    const rawCookie = sessionCookie.value;
    const lastDot = rawCookie.lastIndexOf(".");
    if (lastDot !== -1) {
      const payloadBase64 = rawCookie.slice(0, lastDot);
      const decodedJson = atob(payloadBase64.replace(/-/g, "+").replace(/_/g, "/"));
      const user = JSON.parse(decodedJson);
      const userRole = (user?.role || "OPERATOR") as UserRole;

      // Si l'utilisateur est ADMIN, il a accès à tout
      if (userRole === "ADMIN") {
        return NextResponse.next();
      }

      // Cas racine "/" : si le rôle n'est pas ROLE_EXPLOITATION ni ADMIN, rediriger vers sa 1ère page
      if (pathname === "/") {
        if (userRole !== "ROLE_EXPLOITATION") {
          const defaultPage = ROLE_DEFAULT_PAGES[userRole] || "/";
          return NextResponse.redirect(new URL(defaultPage, request.url));
        }
        return NextResponse.next();
      }

      // Vérification des routes autorisées pour ce rôle
      const allowedRoutes = ROLE_ALLOWED_ROUTES[userRole] || [];
      const isAllowed = allowedRoutes.some((route) => {
        if (route === "/") return pathname === "/";
        return pathname.startsWith(route);
      });

      if (!isAllowed) {
        // Redirection vers la page autorisée par défaut du rôle pour empêcher la vue
        const defaultPage = ROLE_DEFAULT_PAGES[userRole] || "/";
        return NextResponse.redirect(new URL(defaultPage, request.url));
      }
    }
  } catch (err) {
    console.warn("Erreur validation middleware RBAC:", err);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
