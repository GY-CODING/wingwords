import { auth0 } from '@/lib/auth0';
import { logger } from '@/utils/logger';
import { Book, UserData } from '@gycoding/nebula';
import { NextRequest, NextResponse } from 'next/server';

async function handler(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id: bookId } = await context.params;

  if (!bookId) {
    return NextResponse.json({ error: 'Book ID is required' }, { status: 400 });
  }

  try {
    const session = await auth0.getSession();
    const idToken = session?.tokenSet?.idToken;

    if (!session || !idToken) {
      logger.warn('No active session found', {
        bookId,
        userId: session?.user.sub,
      });
      return NextResponse.json(
        { error: 'No active session found' },
        { status: 401 }
      );
    }

    logger.debug('Session retrieved', { userId: session.user.sub });

    const baseUrl = process.env.GY_API?.replace(/['"]/g, '');
    if (!baseUrl) {
      logger.error('GY_API environment variable is not defined', {
        userId: session.user.sub,
      });
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    const apiUrl = `${baseUrl}/books/${bookId}`;
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${idToken}`,
    };

    if (request.method === 'GET') {
      const response = await fetch(apiUrl, { headers, method: 'GET' });

      if (!response.ok) {
        const errorText = await response.text();
        logger.error('The book could not be retrieved', {
          bookId,
          userId: session.user.sub,
          status: response.status,
          error: errorText,
        });
        throw new Error(`GyCoding API Error: ${errorText}`);
      }

      const book = await response.json();
      logger.info('The book has been retrieved', {
        bookId,
        userId: session.user.sub,
      });
      return NextResponse.json(book as Book);
    }

    if (request.method === 'PATCH') {
      const body = await request.json();
      const userData: Partial<UserData> = { ...body.userData };

      if (userData.progress !== undefined) {
        userData.progress = parseFloat(userData.progress as unknown as string);
      }

      const response = await fetch(apiUrl, {
        headers,
        method: 'PATCH',
        body: JSON.stringify({ userData }),
      });

      if (!response.ok) {
        logger.error('The book could not be updated', {
          bookId,
          userId: session.user.sub,
          status: response.status,
        });
        return NextResponse.json(
          { error: 'Error updating book data' },
          { status: 500 }
        );
      }

      const bookRatingData = await response.json();
      logger.info('The book has been updated', {
        bookId,
        userId: session.user.sub,
      });
      return NextResponse.json({ bookRatingData: bookRatingData as Book });
    }

    if (request.method === 'DELETE') {
      const response = await fetch(apiUrl, { headers, method: 'DELETE' });

      if (!response.ok) {
        logger.error('The book could not be deleted', {
          bookId,
          status: response.status,
          userId: session.user.sub,
        });
        return NextResponse.json(
          { error: 'Error deleting book' },
          { status: 500 }
        );
      }

      logger.info('The book has been deleted', {
        bookId,
        userId: session.user.sub,
      });
      return NextResponse.json(204);
    }

    return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
  } catch (error) {
    logger.error('The book could not be retrieved', {
      bookId,
      error: error instanceof Error ? error.message : String(error),
    });

    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  return handler(request, context);
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  return handler(request, context);
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  return handler(request, context);
}
