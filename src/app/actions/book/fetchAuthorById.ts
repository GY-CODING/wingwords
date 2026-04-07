'use server';

import HardcoverAuthor from '@/domain/HardcoverAuthor';

export default async function fetchAuthorById(
  id: number
): Promise<HardcoverAuthor | null> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001';

  const response = await fetch(`${baseUrl}/api/hardcover/authors/${id}`, {
    cache: 'no-store',
  });

  if (response.status === 404) return null;

  if (!response.ok) {
    console.error('fetchAuthorById error:', await response.text());
    return null;
  }

  return response.json();
}
