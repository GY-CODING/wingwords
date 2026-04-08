/* eslint-disable @typescript-eslint/no-explicit-any */
'use server';

import { cookies, headers } from 'next/headers';

export default async function fetchBiography(userId: string) {
  try {
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
      `${protocol}://${host}/api/auth/books/${userId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Cookie: cookieHeader,
        },

        credentials: 'include',
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
    }
  } catch (error: any) {
    throw new Error(`Failed to rate book: ${error.message}`);
  }
}
