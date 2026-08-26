import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
  pages: {
    signIn: '/admin/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnAdmin = nextUrl.pathname.startsWith('/admin');
      
      if (isOnAdmin) {
        if (nextUrl.pathname === '/admin/login') {
          if (isLoggedIn) return Response.redirect(new URL('/admin/dashboard', nextUrl));
          return true;
        }
        
        if (isLoggedIn) return true;
        return false; // Redirect to login page
      } else if (isLoggedIn && nextUrl.pathname === '/admin/login') {
        return Response.redirect(new URL('/admin/dashboard', nextUrl));
      }
      return true;
    },
  },
  providers: [], // Cấu hình providers ở file auth.ts để tránh lỗi Edge runtime với Prisma
  secret: process.env.AUTH_SECRET || "super-secret-key-for-dev",
} satisfies NextAuthConfig;
