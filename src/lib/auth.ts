import { DefaultSession, NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;

if (process.env.NODE_ENV === "development") {
  if (!googleClientId || !googleClientSecret) {
    console.warn(
      "[auth] GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET is missing; Google sign-in will fail.",
    );
  }
  if (!process.env.NEXTAUTH_SECRET) {
    console.warn("[auth] NEXTAUTH_SECRET is missing; sessions will not work.");
  }
  if (!process.env.DATABASE_URL?.trim()) {
    console.warn(
      "[auth] DATABASE_URL is missing; Google sign-in cannot save users to the database.",
    );
  }
  if (!process.env.NEXTAUTH_URL?.trim()) {
    console.warn(
      "[auth] NEXTAUTH_URL is unset. Set it to the exact origin you use in the browser (e.g. http://localhost:3000). Mixing localhost and a LAN IP causes OAuthCallback errors.",
    );
  }
}

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
    } & DefaultSession["user"];
  }
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),

  providers: [
    GoogleProvider({
      clientId: googleClientId ?? "",
      clientSecret: googleClientSecret ?? "",
    }),
  ],

  secret: process.env.NEXTAUTH_SECRET,

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },

  debug: process.env.NODE_ENV === "development",

  callbacks: {
    async jwt({ token, user }) {
      if (user?.id) {
        token.sub = user.id;
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
      }
      return session;
    },

    // Match NextAuth defaults: support relative callbackUrl and same-origin URLs.
    // Avoid rewriting arbitrary same-origin URLs to /dashboard (breaks valid redirects).
    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) {
        return `${baseUrl}${url}`;
      }
      try {
        if (new URL(url).origin === new URL(baseUrl).origin) {
          return url;
        }
      } catch {
        /* ignore invalid url */
      }
      return `${baseUrl}/dashboard`;
    },
  },

  pages: {
    signIn: "/auth/signin",
  },
};
