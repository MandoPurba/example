import { auth } from "@/libs/auth";
import { NextResponse } from "next/server";

// Origin publik dari header proxy (tunnel), bukan req.url yg bisa localhost:3000
function publicOrigin(req: any) {
  const host =
    req.headers.get("x-forwarded-host") || req.headers.get("host");
  const proto = req.headers.get("x-forwarded-proto") || "https";
  return host ? `${proto}://${host}` : req.nextUrl.origin;
}

export default auth(async (req) => {
  const origin = publicOrigin(req);
  const { pathname } = req.nextUrl;
  const session = req.auth;
  console.log("session", session)
  const protectedPaths = [
    /^\/profile(\/.*)?$/,
    /^\/insight(\/.*)?$/,
    /^\/calendar(\/.*)?$/,
    /^\/branch(\/.*)?$/,
    /^\/attendance(\/.*)?$/,
    /^\/users(\/.*)?$/,
    /^\/attendance-user(\/.*)?$/,
    /^\/home(\/.*)?$/,
    /^\/shift(\/.*)?$/,
    /^\/absensi(\/.*)?$/,
    /^\/bio-metrics(\/.*)?$/,
    /^\/attendance-history(\/.*)?$/,
  ];

  const isProtected = protectedPaths.some((route) =>
    route.test(pathname)
  );

  // Belum login
  if (isProtected && !session) {
    return NextResponse.redirect(new URL("/sign-in", origin));
  }

  if (isProtected && session?.user?.department_id) {
    try {
      const response = await fetch(
        `${process.env.NEXTAUTH_URL}/api/users/access-route/${session.user.department_id}`,
        {
          headers: {
            Cookie: req.headers.get("cookie") ?? "",
          },
          cache: "no-store",
        }
      );

      if (!response.ok) {
        return NextResponse.redirect(new URL("/", origin));
      }

      const result = await response.json();

      const frontendRoutes =
        result.data?.frontend_access_routes
          ?.filter((item: any) => item.path)
          ?.map((item: any) => item.path) ?? [];

      const subRoutes =
        result.data?.subitem_access_routes
          ?.flatMap((group: any) =>
            (group.children ?? [])
              .filter((child: any) => child.path)
              .map((child: any) => child.path)
          ) ?? [];

      const allowedRoutes = [
        ...frontendRoutes,
        ...subRoutes,
      ];

      console.log("Allowed Routes:", allowedRoutes);

      const isAllowed = allowedRoutes.some((route: string) =>
        pathname.startsWith(route)
      );

      if (!isAllowed) {
        console.log("isAllowed", isAllowed)
        console.log("allowedRoutes", allowedRoutes)
        return NextResponse.redirect(
          new URL(allowedRoutes[0], origin)
        );
      }
    } catch (err) {
      console.error(err);

      return NextResponse.redirect(new URL("/", origin));
    }
  }

  // Sudah login tapi membuka halaman login
  if (pathname === "/sign-in" && session) {
    return NextResponse.redirect(new URL("/", origin));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/api/:path*",
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};