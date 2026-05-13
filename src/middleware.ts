import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { NextRequest } from "next/server";

/** Must match how NextAuth names session cookies (see next-auth core/init + cookie.js). */
function isHttpsRequest(req: NextRequest): boolean {
  const forwarded = req.headers.get("x-forwarded-proto");
  if (forwarded) return forwarded.split(",")[0]?.trim() === "https";
  return req.nextUrl.protocol === "https:";
}

export async function middleware(req: NextRequest) {
  const session = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
    secureCookie: isHttpsRequest(req),
  });

  if (req.nextUrl.pathname.startsWith("/dashboard") && !session) {
    return NextResponse.redirect(
      new URL(
        `/auth/signin?from=${encodeURIComponent(req.nextUrl.pathname)}`,
        req.url,
      ),
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard", "/dashboard/:path*"],
};
