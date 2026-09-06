import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import AppleProvider from 'next-auth/providers/apple';
import CredentialsProvider from 'next-auth/providers/credentials';

/**
 * NextAuth.js configuration options supporting Google, Apple, and Email authentication
 */
export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || 'demo_google_client_id',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'demo_google_client_secret',
    }),
    AppleProvider({
      clientId: process.env.APPLE_ID || 'demo_apple_client_id',
      clientSecret: process.env.APPLE_SECRET || 'demo_apple_client_secret',
    }),
    CredentialsProvider({
      name: 'Email Magic Link / JWT',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'creator@promptxub.uz' },
      },
      async authorize(credentials) {
        if (!credentials?.email) return null;
        
        const username = credentials.email.split('@')[0];
        return {
          id: `usr_${Date.now()}`,
          name: username.charAt(0).toUpperCase() + username.slice(1),
          email: credentials.email,
          image: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(credentials.email)}`,
        };
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.provider = account?.provider || 'email';
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).provider = token.provider;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET || 'promptxub_super_secret_jwt_key_2026',
};
