/* eslint-disable @typescript-eslint/no-explicit-any */
'use server';

import { headers } from 'next/headers';
import { cookies } from 'next/headers';

export default async function addFriend(formData: FormData): Promise<boolean> {
  try {
    const userId = formData.get('userId') as string;

    if (!userId) {
      throw new Error('User ID is required');
    }

    const headersList = await headers();
    const host =
      headersList.get('host') || `localhost:${process.env.PORT || 3001}`;
    const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();

    const response = await fetch(
      `${protocol}://${host}/api/auth/books/friends/request`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Cookie: cookieHeader,
        },
        body: JSON.stringify({
          userId: userId,
        }),
        credentials: 'include',
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    if (!data) {
      throw new Error('No ApiFriendRequest data received from server');
    }

    return true;
  } catch (error: any) {
    throw new Error(`Failed to add friend: ${error.message}`);
  }
}
