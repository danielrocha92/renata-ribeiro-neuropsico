import { google } from 'googleapis';
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const code = url.searchParams.get('code');

  if (!code) {
    return NextResponse.json({ error: 'Missing authorization code' }, { status: 400 });
  }

  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );

  try {
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    // TODO: Store tokens securely, associated with the user
    // For now, we'll store them in cookies for simplicity
    const cookieStore = cookies();
    if (tokens.access_token) {
      cookieStore.set('google_access_token', tokens.access_token, { httpOnly: true });
    }
    if (tokens.refresh_token) {
      cookieStore.set('google_refresh_token', tokens.refresh_token, { httpOnly: true });
    }

    // Redirect to the dashboard or a success page
    return NextResponse.redirect(new URL('/admin/disponibilidade', req.url));

  } catch (error) {
    console.error('Error exchanging authorization code for tokens:', error);
    return NextResponse.json({ error: 'Failed to exchange authorization code for tokens' }, { status: 500 });
  }
}
