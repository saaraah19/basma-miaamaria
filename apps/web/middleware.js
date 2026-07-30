import { NextResponse } from "next/server";

// This middleware used to gate /admin routes by checking for the auth
// cookie's presence before letting the request through. That check relied
// on the browser sending the API's session cookie back to the *web* app's
// own server — but web and api run on two separate onrender.com hostnames,
// and since onrender.com sits on the Public Suffix List, a cookie set by
// the api host can never be scoped (via Domain=) to also be visible to the
// web host. The check below therefore always failed and redirected every
// admin visit back to login, even with a valid session.
//
// Route protection for /admin now relies entirely on the client-side check
// already in AdminLayout.jsx (useSession() calling GET /api/auth/me
// directly against the api's own domain, where the cookie IS correctly
// scoped and sent). If web and api ever move behind a single custom
// domain (e.g. app.yourdomain.com + api.yourdomain.com with the cookie's
// Domain set to .yourdomain.com), this edge-level check can be restored.

export function middleware() {
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
