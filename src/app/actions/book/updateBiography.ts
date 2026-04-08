'use server';

import { cookies, headers } from 'next/headers';

export default async function updateBiography(
  biography: string
): Promise<void> {
  if (!biography) throw new Error('No biography provided in formData');

  const headersList = await headers();
  const host =
    headersList.get('host') || `localhost:${process.env.PORT || 3001}`;
  const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();

  const urlPrivate = `${protocol}://${host}/api/auth/books/profiles/biography`;

  let privateRes: Response;
  try {
    privateRes = await fetch(urlPrivate, {
      method: 'POST',
      body: JSON.stringify({ biography }),
      headers: {
        'Content-Type': 'application/json',
        Cookie: cookieHeader,
      },
      credentials: 'include',
      cache: 'no-store',
    });

    if (privateRes.ok) {
      return;
    }

    const privateText = await privateRes.text();
    if (privateRes.status !== 401) {
      throw new Error(
        `Private fetch failed. Status: ${privateRes.status} - ${privateText}`
      );
    }
    // Si es 401, lanzar error
    throw new Error('Unauthorized');
  } catch (error) {
    console.warn('[DEBUG] Error in private fetch:', error);
    throw error;
  }
}
