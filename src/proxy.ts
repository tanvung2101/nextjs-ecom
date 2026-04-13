import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const accessToken = request.cookies.get("accessToken")?.value;
  console.log("acctoken",accessToken)
  const { pathname } = request.nextUrl;

  // ===== đã login → không cho vào login =====
  if (accessToken && pathname === "/login") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // ===== route cần login =====
  const protectedRoutes = ["/profile", "/cart", "/payment", "/user", "/orders", "/register"];

  const isProtected = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (!accessToken && isProtected) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/login",
    "/profile/:path*",
    "/cart/:path*",
    "/payment/:path*",
    "/user/:path*",
    "/orders/:path*",
    "/register/:path*"
  ],
};