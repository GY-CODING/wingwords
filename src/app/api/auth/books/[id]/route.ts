import { auth0 } from '@/lib/auth0';
import { sendLog, LogLevel, LogMessage } from '@/utils/logs';
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
      await sendLog(LogLevel.WARN, LogMessage.SESSION_NOT_FOUND, {
        additionalData: { bookId },
      });
      return NextResponse.json(
        { error: 'No active session found' },
        { status: 401 }
      );
    }

    await sendLog(
      LogLevel.DEBUG,
      LogMessage.SESSION_RETRIEVED,
      {},
      session.user.sub
    );

    const baseUrl = process.env.GY_API?.replace(/['"]/g, '');
    if (!baseUrl) {
      await sendLog(LogLevel.ERROR, LogMessage.CONFIG_GY_API_MISSING);
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
        await sendLog(
          LogLevel.ERROR,
          LogMessage.BOOK_RETRIEVE_FAILED,
          {
            additionalData: { status: response.status, error: errorText },
          },
          bookId
        );
        throw new Error(`GyCoding API Error: ${errorText}`);
      }

      const book = await response.json();
      await sendLog(LogLevel.INFO, LogMessage.BOOK_RETRIEVED, {}, bookId);
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
        await sendLog(
          LogLevel.ERROR,
          LogMessage.BOOK_UPDATE_FAILED,
          {
            additionalData: { status: response.status },
          },
          bookId
        );
        return NextResponse.json(
          { error: 'Error updating book data' },
          { status: 500 }
        );
      }

      const bookRatingData = await response.json();
      await sendLog(LogLevel.INFO, LogMessage.BOOK_UPDATED, {}, bookId);
      return NextResponse.json({ bookRatingData: bookRatingData as Book });
    }

    if (request.method === 'DELETE') {
      const response = await fetch(apiUrl, { headers, method: 'DELETE' });

      if (!response.ok) {
        await sendLog(
          LogLevel.ERROR,
          LogMessage.BOOK_DELETE_FAILED,
          {
            additionalData: { status: response.status },
          },
          bookId
        );
        return NextResponse.json(
          { error: 'Error deleting book' },
          { status: 500 }
        );
      }

      await sendLog(LogLevel.INFO, LogMessage.BOOK_DELETED, {}, bookId);
      return NextResponse.json(204);
    }

    return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
  } catch (error) {
    await sendLog(
      LogLevel.ERROR,
      LogMessage.BOOK_RETRIEVE_FAILED,
      {
        additionalData: {
          error: error instanceof Error ? error.message : String(error),
        },
      },
      bookId
    );

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
