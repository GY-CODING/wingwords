'use server';

import { cookies, headers } from 'next/headers';

export default async function updateHallOfFame(
  formData: FormData
): Promise<string> {
  if (!formData) throw new Error('No quote provided in formData');
  const headersList = await headers();
  const host =
    headersList.get('host') || `localhost:${process.env.PORT || 3001}`;
  const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();

  const urlPrivate = `${protocol}://${host}/api/auth/books/profiles/halloffame/quote`;

  // --- DEBUG: Log info before private fetch ---

  const quote = formData.get('quote') as string;
  let privateRes: Response;
  try {
    privateRes = await fetch(urlPrivate, {
      method: 'PATCH',
      body: JSON.stringify({ quote }),
      headers: {
        'Content-Type': 'application/json',
        Cookie: cookieHeader,
      },
      credentials: 'include',
      cache: 'no-store',
    });
    const privateText = await privateRes.clone().text();

    if (privateRes.ok) {
      return privateText;
    }
    if (privateRes.status !== 401) {
      throw new Error(
        `Private fetch failed. Status: ${privateRes.status} - ${privateText}`
      );
    }
    // Si es 401, sigue al endpoint público
    return privateText as string;
  } catch (error) {
    console.warn('[DEBUG] Error in private fetch:', error);
    throw error;
  }
}
