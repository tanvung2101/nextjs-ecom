import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const accessToken = request.cookies.get("accessToken")?.value
  const { pathname } = request.nextUrl

  // =========================
  // PUBLIC ROUTES
  // =========================
  const publicRoutes = ["/login", "/register"]

  const isPublic = publicRoutes.some((route) =>
    pathname.startsWith(route)
  )

  // =========================
  // PROTECTED ROUTES
  // =========================
  const protectedRoutes = [
    "/profile",
    "/cart",
    "/payment",
    "/user",
    "/orders",
  ]

  const isProtected = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  )

  // =========================
  // LOGIC
  // =========================

  // đã login → không cho vào login/register
  if (accessToken && isPublic) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  // chưa login → không cho vào protected
  if (!accessToken && isProtected) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  return NextResponse.next()
}

// =========================
// MATCHER
// =========================
export const config = {
  matcher: [
    "/login",
    "/register",
    "/profile/:path*",
    "/cart/:path*",
    "/payment/:path*",
    "/user/:path*",
    "/orders/:path*",
  ],
};