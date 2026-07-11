import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

// Rrugët që kërkojnë VETËM se përdoruesi të jetë i kyçur (çdo rol)
const protectedRoutes = ["/dashboard", "/profile", "/favorites", "/vehicles", "/bookings"];

// Rrugët që kërkojnë rol "admin"
const adminRoutes = ["/admin"];

export async function middleware(req) {
  const { pathname } = req.nextUrl;

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  const isProtected = protectedRoutes.some((path) => pathname.startsWith(path));
  const isAdminRoute = adminRoutes.some((path) => pathname.startsWith(path));

  // 1. Nëse s'ka token fare (s'është i kyçur) dhe kërkon rrugë të mbrojtur -> dërgo te /login
  if ((isProtected || isAdminRoute) && !token) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname); // e kthen mbrapsht pas kyçjes
    return NextResponse.redirect(loginUrl);
  }

  // 2. Nëse kërkon rrugë admin por roli s'është admin -> dërgo te ballina
  if (isAdminRoute && token?.role !== "admin") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

// Middleware ekzekutohet VETËM për këto rrugë
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/profile/:path*",
    "/favorites/:path*",
    "/vehicles/:path*",
    "/bookings/:path*",
    "/admin/:path*",
  ],
};