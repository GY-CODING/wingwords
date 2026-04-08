'use server';

import { headers, cookies } from 'next/headers';
import { Activity } from '@/domain/activity.model';

export async function sendActivity(message: string): Promise<Activity> {
  if (!message || message.trim() === '') {
    throw new Error('Message cannot be empty');
  }

  try {
    const headersList = await headers();
    const host =
      headersList.get('host') || `localhost:${process.env.PORT || 3001}`;
    const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';

    const url = `${protocol}://${host}/api/auth/books/activity`;

    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: cookieHeader,
      },
      credentials: 'include',
      cache: 'no-store',
      body: JSON.stringify({ message }),
    });

    if (response.status === 401) {
      throw new Error('Unauthorized');
    }

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[sendActivity] Error:', response.status, errorText);
      throw new Error(`Failed to create activity: ${response.status}`);
    }

    const data = await response.json();
    return data as Activity;
  } catch (error) {
    console.error('[sendActivity] Exception:', error);
    throw error;
  }
}
