'use server';

import { BookList } from '@/domain/list.model';
import { headers } from 'next/headers';
import { cookies } from 'next/headers';

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
  return data as BookList[];
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
  return data as BookList;
}

export async function createList(payload: {
  name: string;
  description?: string;
}): Promise<BookList> {
  const { protocol, host, init } = await buildFetchOptions('POST', payload);

  const response = await fetch(`${protocol}://${host}/api/auth/lists`, init);

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to create list: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  return data as BookList;
}

export async function updateList(payload: {
  id: string;
  name?: string;
  description?: string;
}): Promise<BookList> {
  const { protocol, host, init } = await buildFetchOptions('PATCH', payload);

  const response = await fetch(`${protocol}://${host}/api/auth/lists`, init);

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to update list: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  return data as BookList;
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
  bookId: string,
  order?: number
): Promise<BookList> {
  const { protocol, host, init } = await buildFetchOptions('POST', {
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
      `Failed to add book to list: ${response.status} - ${errorText}`
    );
  }

  const data = await response.json();
  return data as BookList;
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
  return data as BookList;
}

export async function removeBookFromList(
  listId: string,
  bookId: string
): Promise<void> {
  const { protocol, host, init } = await buildFetchOptions('DELETE', {
    bookId,
  });

  const response = await fetch(
    `${protocol}://${host}/api/auth/lists/${listId}/books`,
    init
  );

  if (!response.ok && response.status !== 204) {
    const errorText = await response.text();
    throw new Error(
      `Failed to remove book from list: ${response.status} - ${errorText}`
    );
  }
}
