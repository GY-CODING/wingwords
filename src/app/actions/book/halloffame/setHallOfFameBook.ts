 
'use server';

import { cookies, headers } from 'next/headers';

export default async function setHallOfFameBook(formData: FormData) {
  if (!formData) throw new Error('No quote provided in formData');
  const headersList = await headers();
  const host = headersList.get('host') || 'localhost:3001';
  const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();

  const urlPrivate = `${protocol}://${host}/api/auth/books/profiles/halloffame/book`;

  // --- DEBUG: Log info before private fetch ---

  try {
    void (await fetch(urlPrivate, {
      method: 'PATCH',
      body: JSON.stringify(formData.get('bookId')),
      headers: {
        'Content-Type': 'application/json',
        Cookie: cookieHeader,
      },
      credentials: 'include',
      cache: 'no-store',
    }));
  } catch (error) {
    console.warn('[DEBUG] Error in private fetch:', error);
    throw error;
  }
}
