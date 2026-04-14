import { logger } from '@/utils/logger';
import { mapHardcoverBookToBook } from '@/mapper/mapHardcoverToBookToBook';
import { GET_BOOK_BY_ID_QUERY } from '@/utils/constants/Query';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  req: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await props.params;

    const apiUrl = process.env.HARDCOVER_API_URL;
    const apiKey = process.env.HARDCOVER_API_TOKEN;

    if (!apiUrl || !apiKey) {
      logger.error('Hardcover API credentials are missing');
      return NextResponse.json(
        { error: 'Missing Hardcover API credentials' },
        { status: 500 }
      );
    }

    if (!id) {
      return NextResponse.json({ error: 'Missing book id' }, { status: 400 });
    }

    const variables = { id: parseInt(id, 10) };
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: apiKey,
      },
      body: JSON.stringify({ query: GET_BOOK_BY_ID_QUERY, variables }),
    });

    if (!response.ok) {
      const text = await response.text();
      logger.error('Hardcover book could not be retrieved', {
        id,
        status: response.status,
        error: text,
      });
      throw new Error(`Hardcover API failed: ${response.statusText}`);
    }

    const data = await response.json();
    if (data.errors) {
      throw new Error(data.errors[0]?.message || 'GraphQL error');
    }

    const rawBook = data.data?.books_by_pk;
    if (!rawBook) {
      logger.warn('Hardcover book not found', { id });
      return NextResponse.json({ error: 'Book not found' }, { status: 404 });
    }

    const mappedBook = mapHardcoverBookToBook(rawBook);
    logger.info('Hardcover book retrieved', { id });
    return NextResponse.json(mappedBook);
  } catch (error) {
    logger.error('Hardcover book could not be retrieved', {
      error: error instanceof Error ? error.message : String(error),
    });
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
