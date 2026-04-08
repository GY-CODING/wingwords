/* eslint-disable @typescript-eslint/no-explicit-any */
'use server';

import { headers } from 'next/headers';
import { Book } from '@gycoding/nebula';

export default async function getApiBookPublic(
  bookId: string
): Promise<Book | null> {
  try {
    const headersList = await headers();
    const host =
      headersList.get('host') || `localhost:${process.env.PORT || 3001}`;
    const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';

    const publicUrl = `${protocol}://${host}/api/public/books/${bookId}`;
    const publicResponse = await fetch(publicUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    const data = await publicResponse.json();

    if (data.status === 404) {
      return null;
    }

    return data as Book;
  } catch (error: any) {
    console.error('Server Action - Error details:', error);
    throw new Error(`Failed to get book status: ${error.message}`);
  }
}
