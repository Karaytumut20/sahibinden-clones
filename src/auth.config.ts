
import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: { signIn: "/login" },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnProfile = nextUrl.pathname.startsWith("/profile");
      const isOnNewListing = nextUrl.pathname.startsWith("/new-listing");
      const isOnAdmin = nextUrl.pathname.startsWith("/admin");

      if (isOnProfile || isOnNewListing) {
        return isLoggedIn;
      }

      if (isOnAdmin) {
        return isLoggedIn && (auth?.user as any)?.role === "ADMIN";
      }

      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = (user as any).id;
        token.role = (user as any).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token) {
        (session.user as any).id = token.id as string;
        (session.user as any).role = (token.role as any) ?? "INDIVIDUAL";
      }
      return session;
    },
  },
  providers: [],
} satisfies NextAuthConfig;
