/* eslint-disable @typescript-eslint/no-explicit-any */
'use server';

import { Profile } from '@gycoding/nebula';
import { headers } from 'next/headers';
import { cookies } from 'next/headers';

export default async function getFriends(): Promise<Profile[]> {
  try {
    const headersList = await headers();
    const host =
      headersList.get('host') || `localhost:${process.env.PORT || 3001}`;
    const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();
    const response = await fetch(
      `${protocol}://${host}/api/auth/books/friends`,
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
      if (response.status === 401) {
        // No hay sesión: devolver array vacío
        return [];
      } else {
        const errorMsg = `API error ${response.status}: ${errorText || response.statusText}`;
        console.error(`[getFriends] ${errorMsg}`);
        throw new Error(errorMsg);
      }
    }

    const data = await response.json();

    if (!data) {
      throw new Error('No friend data received from server');
    }

    return data as Profile[];
  } catch (error: any) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error(`[getFriends] Error: ${errorMsg}`);
    throw new Error(`Failed to fetch friends: ${errorMsg}`);
  }
}
