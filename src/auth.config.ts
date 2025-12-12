import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
  pages: {
    signIn: '/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith('/profile');
      const isOnNewListing = nextUrl.pathname.startsWith('/new-listing');

      if (isOnDashboard || isOnNewListing) {
        if (isLoggedIn) return true;
        return false; // Giriş yapmamışsa login sayfasına at
      }
      return true;
    },
  },
  providers: [],
} satisfies NextAuthConfig;