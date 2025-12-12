import { google } from 'googleapis';
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

export async function POST(req: NextRequest) {
  const { userId, appointment } = await req.json();

  if (!userId || !appointment) {
    return NextResponse.json({ error: 'Missing userId or appointment data' }, { status: 400 });
  }

  if (!db) {
    return NextResponse.json({ error: 'Firestore is not initialized' }, { status: 500 });
  }

  try {
    // 1. Get user's refresh token from Firestore
    const userDocRef = doc(db, "users", userId);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists() || !userDoc.data().googleRefreshToken) {
      return NextResponse.json({ error: 'User has not connected their Google Calendar' }, { status: 400 });
    }
    const refreshToken = userDoc.data().googleRefreshToken;

    // 2. Create a new OAuth2 client and set the refresh token
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );
    oauth2Client.setCredentials({ refresh_token: refreshToken });

    // 3. Get a new access token
    const { token: accessToken } = await oauth2Client.getAccessToken();
    if (!accessToken) {
      throw new Error("Failed to retrieve access token");
    }
    oauth2Client.setCredentials({ access_token: accessToken });


    // 4. Create a new calendar event
    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
    const event = {
      summary: appointment.title,
      description: 'Consulta de Neuropsicologia',
      start: {
        dateTime: appointment.start,
        timeZone: 'America/Sao_Paulo',
      },
      end: {
        dateTime: appointment.end,
        timeZone: 'America/Sao_Paulo',
      },
    };

    await calendar.events.insert({
      calendarId: 'primary',
      requestBody: event,
    });

    return NextResponse.json({ message: 'Event created successfully' });

  } catch (error) {
    console.error('Error creating calendar event:', error);
    return NextResponse.json({ error: 'Failed to create calendar event' }, { status: 500 });
  }
}
