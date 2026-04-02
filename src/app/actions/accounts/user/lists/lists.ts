'use server';

import { BookList } from '@/domain/list.model';
import { UUID } from 'crypto';
import { headers } from 'next/headers';
import { cookies } from 'next/headers';

/**
 * Maps raw API response to BookList domain model.
 * The GY API returns `{ bookId, order }` per book entry, while the
 * domain model uses `{ id, order }`. This normalizes the mismatch.
 */
function mapApiList(raw: unknown): BookList {
  const r = raw as {
    id: UUID;
    name: string;
    description?: string;
    books?: { bookId: string; order: number }[];
  };
  return {
    id: r.id,
    name: r.name,
    description: r.description,
    books: (r.books ?? []).map((b) => ({ id: b.bookId, order: b.order })),
  };
}

async function buildFetchOptions(
  method: string,
  body?: unknown
): Promise<{
  protocol: string;
  host: string;
  cookieHeader: string;
  init: RequestInit;
}> {
  const headersList = await headers();
  const host = headersList.get('host') || 'localhost:3000';
  const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();

  const init: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      Cookie: cookieHeader,
    },
    credentials: 'include',
  };

  if (body !== undefined) {
    init.body = JSON.stringify(body);
  }

  return { protocol, host, cookieHeader, init };
}

export async function getLists(): Promise<BookList[]> {
  const { protocol, host, init } = await buildFetchOptions('GET');

  const response = await fetch(`${protocol}://${host}/api/auth/lists`, init);

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to fetch lists: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  return (data as unknown[]).map(mapApiList);
}

export async function getListById(id: string): Promise<BookList> {
  const { protocol, host, init } = await buildFetchOptions('GET');

  const response = await fetch(
    `${protocol}://${host}/api/auth/lists/${id}`,
    init
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Failed to fetch list ${id}: ${response.status} - ${errorText}`
    );
  }

  const data = await response.json();
  return mapApiList(data);
}

export async function createList(payload: {
  name: string;
  description?: string;
}): Promise<BookList> {
  const { protocol, host, init } = await buildFetchOptions('POST', {
    ...payload,
    books: [],
  });

  const response = await fetch(`${protocol}://${host}/api/auth/lists`, init);

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to create list: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  return mapApiList(data);
}

export async function updateList(payload: {
  id: string;
  name?: string;
  description?: string;
  books: { bookId: string; order: number }[];
}): Promise<BookList> {
  const { protocol, host, init } = await buildFetchOptions('PATCH', payload);

  const response = await fetch(`${protocol}://${host}/api/auth/lists`, init);

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to update list: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  return mapApiList(data);
}

export async function deleteList(id: string): Promise<void> {
  const { protocol, host, init } = await buildFetchOptions('DELETE');

  const response = await fetch(
    `${protocol}://${host}/api/auth/lists/${id}`,
    init
  );

  if (!response.ok && response.status !== 204) {
    const errorText = await response.text();
    throw new Error(
      `Failed to delete list ${id}: ${response.status} - ${errorText}`
    );
  }
}

export async function addBookToList(
  listId: string,
  bookId: string
): Promise<BookList> {
  const { protocol, host, init } = await buildFetchOptions('POST', { bookId });

  const response = await fetch(
    `${protocol}://${host}/api/auth/lists/${listId}/books`,
    init
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Failed to add book to list: ${response.status} - ${errorText}`
    );
  }

  const data = await response.json();
  return mapApiList(data);
}

export async function updateBookInList(
  listId: string,
  bookId: string,
  order: number
): Promise<BookList> {
  const { protocol, host, init } = await buildFetchOptions('PATCH', {
    bookId,
    order,
  });

  const response = await fetch(
    `${protocol}://${host}/api/auth/lists/${listId}/books`,
    init
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Failed to update book in list: ${response.status} - ${errorText}`
    );
  }

  const data = await response.json();
  return mapApiList(data);
}

export async function removeBookFromList(
  listId: string,
  bookId: string
): Promise<void> {
  const { protocol, host, init } = await buildFetchOptions('DELETE');

  const response = await fetch(
    `${protocol}://${host}/api/auth/lists/${listId}/books/${bookId}`,
    init
  );

  if (!response.ok && response.status !== 204) {
    const errorText = await response.text();
    throw new Error(
      `Failed to remove book from list: ${response.status} - ${errorText}`
    );
  }
}
