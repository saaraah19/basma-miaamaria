import { NextResponse } from "next/server";

// Must match AUTH_COOKIE_NAME in apps/api/src/middleware/auth.middleware.js
const AUTH_COOKIE_NAME = "bsma_session";

export function middleware(request) {
  const { pathname } = request.nextUrl;

  const isLoginPage = pathname === "/admin/login";
  const isAdminRoute = pathname.startsWith("/admin") && !isLoginPage;

  if (!isAdminRoute) return NextResponse.next();

  const hasSession = request.cookies.has(AUTH_COOKIE_NAME);

  if (!hasSession) {
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
