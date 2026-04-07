/* eslint-disable @typescript-eslint/no-explicit-any */
'use server';

import HardcoverBook from '@/domain/HardcoverBook';

export default async function fetchBookById(
  id: string
): Promise<HardcoverBook> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001';
    const url = `${baseUrl}/api/hardcover/${id}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ fetchBookById - Error response:', errorText);
      throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
    }

    const data = await response.json();

    // La API ya devuelve el libro mapeado, no necesitamos mapearlo de nuevo
    return data as HardcoverBook;
  } catch (error: any) {
    console.error('💥 fetchBookById - Error details:', error);
    throw new Error(`Failed to fetch books: ${error.message}`);
  }
}
