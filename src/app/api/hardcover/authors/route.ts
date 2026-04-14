/* eslint-disable @typescript-eslint/no-explicit-any */
import { logger } from '@/utils/logger';
import { SEARCH_AUTHORS_QUERY } from '@/utils/constants/Query';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { query } = await req.json();

    if (typeof query !== 'string' || !query.trim()) {
      return NextResponse.json(
        { error: 'Invalid request: must provide a query string' },
        { status: 400 }
      );
    }

    const apiUrl = process.env.HARDCOVER_API_URL;
    const apiKey = process.env.HARDCOVER_API_TOKEN;

    if (!apiUrl || !apiKey) {
      logger.error('Hardcover credentials missing', {
        route: '/api/hardcover/authors',
      });
      return NextResponse.json(
        { error: 'Missing Hardcover API credentials' },
        { status: 500 }
      );
    }

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: apiKey,
      },
      body: JSON.stringify({
        query: SEARCH_AUTHORS_QUERY,
        variables: { query },
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      logger.error('Hardcover authors search failed', {
        query,
        status: response.status,
        error: text,
      });
      throw new Error(`Hardcover API failed: ${response.statusText}`);
    }

    const data = await response.json();
    if (data.errors) {
      throw new Error(data.errors[0]?.message || 'GraphQL error');
    }

    const results = data.data?.search?.results;
    let rawAuthors: any[] = [];

    if (Array.isArray(results)) {
      rawAuthors = results.map((h: any) => h.document || h);
    } else if (results?.hits) {
      rawAuthors = results.hits.map((h: any) => h.document || h);
    }

    const authors = rawAuthors.map((a: any) => ({
      id: a.id,
      name: a.name,
      image: { url: a.image?.url || a.cached_image || '' },
      booksCount: a.books_count ?? 0,
    }));

    logger.info('Hardcover authors searched', {
      query,
      resultCount: authors.length,
    });
    return NextResponse.json(authors);
  } catch (error) {
    logger.error(
      'Hardcover authors search failed',
      {
        error: error instanceof Error ? error.message : String(error),
      },
      error
    );
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
