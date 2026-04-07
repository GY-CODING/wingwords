/* eslint-disable @typescript-eslint/no-explicit-any */
'use server';

import HardcoverBook from '@/domain/HardcoverBook';
import { Book } from '@gycoding/nebula';

export default async function queryBooks(formData: FormData): Promise<Book[]> {
  const query = formData.get('title');

  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001';
    const url = `${baseUrl}/api/hardcover`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
      cache: 'no-store',
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Server Action - Error response:', errorText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: HardcoverBook[] = await response.json();

    // Filtrar y ordenar libros: primero los que tienen series
    const sortedBooks = data.sort((a, b) => {
      const aHasSeries = a.series && a.series.length > 0;
      const bHasSeries = b.series && b.series.length > 0;

      if (aHasSeries && !bHasSeries) return -1; // a va primero
      if (!aHasSeries && bHasSeries) return 1; // b va primero
      return 0; // mantienen su orden original
    });

    return sortedBooks;
  } catch (error: any) {
    console.error('Server Action - Error details:', error);
    throw new Error(`Failed to fetch books: ${error.message}`);
  }
}
