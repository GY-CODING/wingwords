/* eslint-disable @typescript-eslint/no-explicit-any */
import { logger } from '@/utils/logger';
import { mapHardcoverBooksToList } from '@/mapper/mapHardcoverToBookToBook';
import {
  GET_BOOKS_BY_IDS_QUERY,
  SEARCH_BOOKS_QUERY,
} from '@/utils/constants/Query';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { ids, query } = await req.json();

    const apiUrl = process.env.HARDCOVER_API_URL;
    const apiKey = process.env.HARDCOVER_API_TOKEN;

    if (!apiUrl || !apiKey) {
      logger.error('Hardcover API credentials are missing');
      return NextResponse.json(
        { error: 'Missing Hardcover API credentials' },
        { status: 500 }
      );
    }

    let graphQLQuery = '';
    let variables: Record<string, any> = {};

    if (Array.isArray(ids) && ids.length > 0) {
      graphQLQuery = GET_BOOKS_BY_IDS_QUERY;
      variables = { ids: [] };
    } else if (typeof query === 'string') {
      graphQLQuery = SEARCH_BOOKS_QUERY;
      variables = { query };
    } else {
      return NextResponse.json(
        { error: 'Invalid request: must provide ids[] or query' },
        { status: 400 }
      );
    }

    if (Array.isArray(ids) && ids.length > 0) {
      const BATCH_SIZE = 50;

      const chunks: number[][] = [];
      for (let i = 0; i < ids.length; i += BATCH_SIZE) {
        const chunk = ids
          .slice(i, i + BATCH_SIZE)
          .map((id: any) => parseInt(id, 10));
        chunks.push(chunk);
      }

      const fetchChunk = async (chunkIds: number[]) => {
        const resp = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: apiKey,
          },
          body: JSON.stringify({
            query: GET_BOOKS_BY_IDS_QUERY,
            variables: { ids: chunkIds },
          }),
        });

        if (!resp.ok) {
          const text = await resp.text();
          logger.error('Hardcover book search failed', {
            status: resp.status,
            error: text,
          });
          throw new Error(`Hardcover API failed: ${resp.statusText}`);
        }

        const d = await resp.json();
        if (d.errors) throw new Error(d.errors[0]?.message || 'GraphQL error');

        if (d.data?.books) return d.data.books;
        if (d.data?.search?.results) {
          if (Array.isArray(d.data.search.results))
            return d.data.search.results.map((h: any) => h.document || h);
          if (d.data.search.results?.hits)
            return d.data.search.results.hits.map((h: any) => h.document || h);
        }
        if (d.data?.books_by_pk) return [d.data.books_by_pk];
        return [];
      };

      const chunkResults = await Promise.all(chunks.map((c) => fetchChunk(c)));
      const allRawBooks = chunkResults.flat();

      const mappedBooks = mapHardcoverBooksToList(allRawBooks);
      logger.info('Hardcover book search completed', {
        idCount: ids.length,
        resultCount: mappedBooks.length,
      });
      return NextResponse.json(mappedBooks);
    }

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: apiKey,
      },
      body: JSON.stringify({ query: graphQLQuery, variables }),
    });

    if (!response.ok) {
      const text = await response.text();
      logger.error('Hardcover book search failed', {
        status: response.status,
        error: text,
      });
      throw new Error(`Hardcover API failed: ${response.statusText}`);
    }

    const data = await response.json();
    if (data.errors) {
      logger.error('Hardcover book search failed', {
        errors: data.errors,
        errorMessage: data.errors[0]?.message,
      });
      throw new Error(data.errors[0]?.message || 'GraphQL error');
    }

    let rawBooks: any[] = [];
    if (data.data?.books) {
      rawBooks = data.data.books;
    } else if (data.data?.search?.results) {
      if (Array.isArray(data.data.search.results)) {
        rawBooks = data.data.search.results.map((h: any) => h.document || h);
      } else if (data.data.search.results?.hits) {
        rawBooks = data.data.search.results.hits.map(
          (h: any) => h.document || h
        );
      }
    } else if (data.data?.books_by_pk) {
      rawBooks = [data.data.books_by_pk];
    }

    logger.debug('Hardcover book search completed', {
      query,
      rawCount: rawBooks.length,
      dataKeys: Object.keys(data.data ?? {}),
    });

    const mappedBooks = mapHardcoverBooksToList(rawBooks);
    logger.info('Hardcover book search completed', {
      query,
      resultCount: mappedBooks.length,
    });
    return NextResponse.json(mappedBooks);
  } catch (error) {
    logger.error('Hardcover book search failed', {
      error: error instanceof Error ? error.message : String(error),
    });
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
