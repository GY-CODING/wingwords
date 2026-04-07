/* eslint-disable @typescript-eslint/no-explicit-any */
'use server';

import { Activity } from '@/domain/activity.model';
import { headers } from 'next/headers';
import { cookies } from 'next/headers';

export default async function sendActivity(formData: FormData) {
  try {
    const message = formData.get('message') as string;
    const headersList = await headers();
    const host = headersList.get('host') || 'localhost:3001';
    const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();

    const response = await fetch(
      `${protocol}://${host}/api/auth/books/activity`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Cookie: cookieHeader,
        },
        body: JSON.stringify({ message }),
        credentials: 'include',
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    if (!data) {
      throw new Error('No ApiBook data received from server');
    }

    return data as Activity;
  } catch (error: any) {
    throw new Error(`Failed to rate book: ${error.message}`);
  }
}
