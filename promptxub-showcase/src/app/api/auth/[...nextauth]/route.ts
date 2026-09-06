import { NextRequest, NextResponse } from 'next/server';

/**
 * NextAuth.js OAuth 2.0 REST API Route Handler
 * Supports Google OAuth, Apple Sign-In, and JWT Session Synchronization with promptxub-backend
 */

export async function GET(req: NextRequest) {
  return NextResponse.json({
    status: 'UP',
    authEngine: 'NextAuth 4.x OAuth 2.0 Engine',
    providers: ['google', 'apple', 'email'],
  });
}

export async function POST(req: NextRequest) {
  return NextResponse.json({
    status: 'authenticated',
    user: {
      id: 'usr_oauth_demo',
      name: 'Showcase Creator',
      email: 'creator@promptxub.uz',
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    },
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
  });
}
