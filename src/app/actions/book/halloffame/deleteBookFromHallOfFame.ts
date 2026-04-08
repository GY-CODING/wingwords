'use server';
import { headers, cookies } from 'next/headers';

export default async function deleteBookFromHallOfFame(formData: FormData) {
  if (!formData) throw new Error('No quote provided in formData');
  const headersList = await headers();
  const host =
    headersList.get('host') || `localhost:${process.env.PORT || 3001}`;
  const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();

  const urlPrivate = `${protocol}://${host}/api/auth/books/profiles/halloffame/book`;

  // --- DEBUG: Log info before private fetch ---

  const bookId = formData.get('bookId');
  try {
    void (await fetch(urlPrivate, {
      method: 'DELETE',
      body: JSON.stringify(bookId),
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
