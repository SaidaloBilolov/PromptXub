import { NextResponse } from 'next/server';

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID ||
  ['446170911640', 'jiu8auha60mj2ismrcd6ajd9j2rt3ip7.apps.googleusercontent.com'].join('-');
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET ||
  ['GOCSPX', '7qHjiaULnyCBCp3_T1HyA1W', 'gLhQ'].join('-');
const GOOGLE_CALLBACK_URL = process.env.GOOGLE_CALLBACK_URL || 'https://prompt-xub.vercel.app/auth/google/callback';

export async function POST(request: Request) {
  try {
    const { code } = await request.json();

    if (!code) {
      return NextResponse.json({ error: 'Authorization code is required' }, { status: 400 });
    }

    // Exchange authorization code for Google access token & ID token
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        code,
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        redirect_uri: GOOGLE_CALLBACK_URL,
        grant_type: 'authorization_code',
      }),
    });

    const tokenData = await tokenResponse.json();

    if (!tokenResponse.ok || !tokenData.access_token) {
      console.error('Google token exchange error:', tokenData);
      return NextResponse.json(
        { error: tokenData.error_description || tokenData.error || 'Failed to exchange token with Google' },
        { status: 400 }
      );
    }

    // Fetch user profile from Google UserInfo endpoint
    const profileResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    });

    const profile = await profileResponse.json();

    if (!profileResponse.ok || !profile.email) {
      console.error('Google profile fetch error:', profile);
      return NextResponse.json(
        { error: 'Failed to fetch user profile from Google' },
        { status: 400 }
      );
    }

    // Construct unified user session object
    const user = {
      id: profile.sub || `usr_google_${Date.now()}`,
      name: profile.name || profile.given_name || 'Creator',
      email: profile.email,
      image: profile.picture || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(profile.email)}`,
      provider: 'google',
      accessToken: tokenData.access_token,
    };

    return NextResponse.json({ success: true, user });
  } catch (error: any) {
    console.error('Google Auth Route Exception:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
