import NextAuth from 'next-auth';
import { authConfig } from './auth.config';

export default NextAuth(authConfig).auth;

export const config = {
  // Chỉ bật middleware trên đường dẫn admin
  matcher: ['/admin/:path*'],
};
