import NextAuth from 'next-auth';
import { authConfig } from './auth.config';

export default NextAuth(authConfig).auth;

export const config = {
  // Bật middleware trên tất cả request, trừ file tĩnh và api
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};
