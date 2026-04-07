'use server';

export interface AuthorSearchResult {
  id: number;
  name: string;
  image: { url: string };
  booksCount: number;
}

export default async function queryAuthors(
  query: string
): Promise<AuthorSearchResult[]> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001';

  const response = await fetch(`${baseUrl}/api/hardcover/authors`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query }),
    cache: 'no-store',
  });

  if (!response.ok) {
    console.error('queryAuthors error:', await response.text());
    return [];
  }

  return response.json();
}
