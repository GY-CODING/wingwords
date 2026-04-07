/* eslint-disable @typescript-eslint/no-explicit-any */
'use server';

import { headers } from 'next/headers';
import { cookies } from 'next/headers';

export default async function removeBook(bookId: string) {
  try {
    if (!bookId) {
      throw new Error('Book ID is required');
    }

    const headersList = await headers();
    const host = headersList.get('host') || 'localhost:3001';
    const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();

    const response = await fetch(
      `${protocol}://${host}/api/auth/books/${bookId}`,
      {
        method: 'DELETE',
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
