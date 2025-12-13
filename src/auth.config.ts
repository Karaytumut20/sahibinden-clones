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
  },
  providers: [],
} satisfies NextAuthConfig;