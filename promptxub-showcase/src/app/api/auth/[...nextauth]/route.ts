import NextAuth from 'next-auth';
import { authOptions } from '@/lib/auth';

/**
 * NextAuth.js OAuth 2.0 REST API Route Handler
 * Supports Google OAuth, Apple Sign-In, Email Magic Links, and JWT Session Synchronization
 */

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
