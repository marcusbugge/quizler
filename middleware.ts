import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createMiddlewareClient } from "@/lib/supabase-middleware";

// Ruter som krever autentisering
const protectedRoutes = [
  "/dashboard",
  "/profile",
  "/sections/quizmaker",
  // ...andre beskyttede ruter
];

// Ruter som er tilgjengelige bare for ikke-autentiserte brukere
const authRoutes = ["/auth/login", "/auth/signup"];

export async function middleware(req: NextRequest) {
  const res = NextResponse.next({
    request: {
      headers: req.headers,
    },
  });

  const supabase = createMiddlewareClient(req, res);

  // Sjekk og forny session
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const url = req.nextUrl.clone();
  const { pathname } = url;

  // Sjekk om ruten krever autentisering
  const isProtectedRoute = protectedRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  // Sjekk om ruten er bare for ikke-autentiserte brukere
  const isAuthRoute = authRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  // Redirect til login hvis brukeren prøver å få tilgang til en beskyttet rute uten å være logget inn
  if (isProtectedRoute && !session) {
    url.pathname = "/auth/login";
    url.searchParams.set("returnUrl", pathname);
    return NextResponse.redirect(url);
  }

  // Redirect til hjemmeside hvis brukeren prøver å få tilgang til en auth-route når han er logget inn
  if (isAuthRoute && session) {
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  return res;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     * - api (API routes som ikke krever autentiseringssjekk)
     */
    "/((?!_next/static|_next/image|favicon.ico|public|api/public).*)",
  ],
};
