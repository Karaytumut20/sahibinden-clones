import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: { signIn: "/login" },
  callbacks: {
    // 1. GÜVENLİK KONTROLÜ (Middleware burada çalışır)
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;

      const isOnProfile = nextUrl.pathname.startsWith("/profile");
      const isOnNewListing = nextUrl.pathname.startsWith("/new-listing");
      const isOnAdmin = nextUrl.pathname.startsWith("/admin");

      // Profil ve İlan Ekleme sayfaları için sadece giriş yapmış olmak yeterli
      if (isOnProfile || isOnNewListing) {
        return isLoggedIn;
      }

      // Admin sayfaları için hem giriş yapmış olmak HEM DE rolün ADMIN olması şart
      if (isOnAdmin) {
        // Aşağıdaki 'role' bilgisinin okunabilmesi için alttaki session callback'i şarttır
        return isLoggedIn && (auth?.user as any)?.role === "ADMIN";
      }

      return true;
    },

    // 2. JWT OLUŞTURMA (Giriş yapıldığında çalışır)
    async jwt({ token, user }) {
      if (user) {
        token.id = (user as any).id;
        token.role = (user as any).role;
      }
      return token;
    },

    // 3. SESSION OLUŞTURMA (Middleware ve Client tarafında çalışır)
    // Burası EKSİK olduğu için Middleware rolü göremiyordu!
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