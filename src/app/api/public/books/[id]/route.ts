import { logger } from '@/utils/logger';
import { Book } from '@gycoding/nebula';
import { NextResponse } from 'next/server';

async function handler(request: Request) {
  const url = new URL(request.url);
  const pathParts = url.pathname.split('/');
  const id = pathParts[pathParts.length - 1];

  if (!id) {
    logger.warn('Book ID is required', {
      route: '/api/public/books/[id]',
      additionalData: { bookId: id },
    });
    return NextResponse.json({ error: 'Book ID is required' }, { status: 400 });
  }

  try {
    const baseUrl = process.env.GY_API?.replace(/['"]/g, '');
    if (!baseUrl) {
      logger.error('GY_API missing', {
        route: '/api/public/books/[id]',
        additionalData: { bookId: id },
      });
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    const apiResponse = await fetch(`${baseUrl}/books/${id}/public`, {
      method: 'GET',
    });

    if (!apiResponse.ok) {
      const errorText = await apiResponse.text();
      if (apiResponse.status === 404) {
        logger.warn('Book not found', {
          route: '/api/public/books/[id]',
          additionalData: { bookId: id, error: errorText },
        });
        return NextResponse.json({ error: 'Book not found' }, { status: 404 });
      }
      logger.error('Book retrieve failed', {
        route: '/api/public/books/[id]',
        additionalData: {
          bookId: id,
          status: apiResponse.status,
          error: errorText,
        },
      });
      return NextResponse.json(
        { error: `API error: ${apiResponse.status}` },
        { status: apiResponse.status }
      );
    }

    const apiBook = await apiResponse.json();
    logger.info('Book retrieved', {
      route: '/api/public/books/[id]',
      additionalData: { bookId: id },
    });
    return NextResponse.json(apiBook as Book);
  } catch (error) {
    logger.error(
      'Book retrieve failed',
      {
        route: '/api/public/books/[id]',
        additionalData: {
          bookId: id,
          error: error instanceof Error ? error.message : String(error),
        },
      },
      error
    );
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export const GET = handler;
