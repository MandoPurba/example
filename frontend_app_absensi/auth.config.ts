import type { NextAuthConfig } from "next-auth";
import { NextResponse } from "next/server";

function securityCheck(request: Request) {
  const url = new URL(request.url);
  const query = decodeURIComponent(url.search);

  const sqlPattern = /(UNION|SELECT|INSERT|DELETE|DROP|UPDATE|--|;|'|")/i;
  const xssPattern = /(<script>|<\/script>|javascript:|onerror=|onload=)/i;

  if (sqlPattern.test(query)) {
    return NextResponse.json(
      { error: "SQL Injection detected" },
      { status: 403 }
    );
  }

  if (xssPattern.test(query)) {
    return NextResponse.json(
      { error: "XSS detected" },
      { status: 403 }
    );
  }

  return null;
}

function botDetection(request: Request) {
  const ua = request.headers.get("user-agent") || "";

  const badBots = [
    "sqlmap",
    "curl",
    "wget",
    "python",
    "scanner",
    "nikto",
    "nmap",
  ];

  if (badBots.some((bot) => ua.toLowerCase().includes(bot))) {
    return NextResponse.json({ error: "Bot detected" }, { status: 403 });
  }

  return null;
}

export default {
  providers: [],
  callbacks: {
    async authorized({ request, auth }) {
      const { pathname } = request.nextUrl;

      const sqlCheck = securityCheck(request);
      if (sqlCheck) return sqlCheck;

      const botCheck = botDetection(request);
      if (botCheck) return botCheck;

      if (pathname === "/sign-in" && auth) {
        return NextResponse.redirect(new URL("/", request.url));
      }

      return true;
    },
  },
} satisfies NextAuthConfig;