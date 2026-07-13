import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { getUserRole, ROLES } from "@/shared/lib/roles";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const role = getUserRole(user);
  const pathname = request.nextUrl.pathname;

  // --- Route classification ---
  const isAuthPage =
    pathname.startsWith("/login") ||
    pathname.startsWith("/register") ||
    pathname.startsWith("/forgot-password") ||
    pathname.startsWith("/reset-password");

  const isBuyerBrowse = pathname.startsWith("/browse");
  const isSellerDashboard = pathname.startsWith("/seller");
  const isDeveloperRegister = pathname.startsWith("/developer-register");

  const isProtectedRoute =
    isBuyerBrowse || isSellerDashboard || pathname.startsWith("/settings");

  // --- Rule 1: Unauthenticated → /login ---
  if (isProtectedRoute && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // --- Rule 2: Developer hits /browse → redirect to /seller ---
  if (isBuyerBrowse && user && role === ROLES.DEVELOPER) {
    const url = request.nextUrl.clone();
    url.pathname = "/seller";
    return NextResponse.redirect(url);
  }

  // --- Rule 3: Non-developer hits /seller → redirect to /browse ---
  if (isSellerDashboard && user && role !== ROLES.DEVELOPER) {
    const url = request.nextUrl.clone();
    url.pathname = "/browse";
    return NextResponse.redirect(url);
  }

  // --- Rule 4: Developer already registered hits /developer-register → /seller ---
  if (isDeveloperRegister && user && role === ROLES.DEVELOPER) {
    const url = request.nextUrl.clone();
    url.pathname = "/seller";
    return NextResponse.redirect(url);
  }

  // --- Rule 5: Authenticated user hits auth pages → role-based redirect ---
  if (isAuthPage && user) {
    const url = request.nextUrl.clone();
    url.pathname = role === ROLES.DEVELOPER ? "/seller" : "/browse";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
