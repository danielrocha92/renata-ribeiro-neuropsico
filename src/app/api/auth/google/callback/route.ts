import { google } from 'googleapis';
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, updateDoc, setDoc } from 'firebase/firestore';

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const code = url.searchParams.get('code');
  const userId = url.searchParams.get('state');

  if (!code) {
    return NextResponse.json({ error: 'Missing authorization code' }, { status: 400 });
  }

  if (!userId) {
    return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
  }

  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );

  try {
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    if (tokens.refresh_token) {
      if (!db) {
        throw new Error("Firestore is not initialized");
      }
      const userDocRef = doc(db, "users", userId);
      // Use setDoc with merge: true to create or update the document
      await setDoc(userDocRef, { googleRefreshToken: tokens.refresh_token }, { merge: true });
    }

    // Redirect to the client page
    const redirectUrl = new URL('/cliente', req.url);
    return NextResponse.redirect(redirectUrl);

  } catch (error) {
    console.error('Error exchanging authorization code for tokens:', error);
    const redirectUrl = new URL('/cliente', req.url);
    redirectUrl.searchParams.set('error', 'calendar_connection_failed');
    return NextResponse.redirect(redirectUrl);
  }
}