/* eslint-disable @typescript-eslint/no-explicit-any */
import { logger } from '@/utils/logger';
import { GET_AUTHOR_BY_ID_QUERY } from '@/utils/constants/Query';
import { mapRawAuthorToAuthor } from '@/mapper/mapHardcoverAuthorToAuthor';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  _req: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await props.params;

    const apiUrl = process.env.HARDCOVER_API_URL;
    const apiKey = process.env.HARDCOVER_API_TOKEN;

    if (!apiUrl || !apiKey) {
      logger.error('Hardcover credentials missing', {
        route: '/api/hardcover/authors/[id]',
      });
      return NextResponse.json(
        { error: 'Missing Hardcover API credentials' },
        { status: 500 }
      );
    }

    if (!id || isNaN(parseInt(id, 10))) {
      return NextResponse.json({ error: 'Invalid author id' }, { status: 400 });
    }

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: apiKey,
      },
      body: JSON.stringify({
        query: GET_AUTHOR_BY_ID_QUERY,
        variables: { id: parseInt(id, 10) },
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      logger.error('Hardcover author could not be retrieved', {
        authorId: id,
        status: response.status,
        error: text,
      });
      throw new Error(`Hardcover API failed: ${response.statusText}`);
    }

    const data = await response.json();
    if (data.errors) {
      throw new Error(data.errors[0]?.message || 'GraphQL error');
    }

    const rawAuthor = data.data?.authors?.[0];
    if (!rawAuthor) {
      return NextResponse.json({ error: 'Author not found' }, { status: 404 });
    }

    logger.info('Hardcover author retrieved', { authorId: id });
    return NextResponse.json(mapRawAuthorToAuthor(rawAuthor));
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
