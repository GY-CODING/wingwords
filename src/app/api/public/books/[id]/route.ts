import { sendLog, LogLevel, LogMessage } from '@/utils/logs';
import { Book } from '@gycoding/nebula';
import { NextResponse } from 'next/server';

async function handler(request: Request) {
  const url = new URL(request.url);
  const pathParts = url.pathname.split('/');
  const id = pathParts[pathParts.length - 1];

  if (!id) {
    return NextResponse.json({ error: 'Book ID is required' }, { status: 400 });
  }

  try {
    const baseUrl = process.env.GY_API?.replace(/['"]/g, '');
    if (!baseUrl) {
      await sendLog(LogLevel.ERROR, LogMessage.CONFIG_GY_API_MISSING);
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
        await sendLog(
          LogLevel.WARN,
          LogMessage.BOOK_NOT_FOUND,
          { additionalData: { error: errorText } },
          id
        );
        return NextResponse.json({ error: 'Book not found' }, { status: 404 });
      }

      await sendLog(
        LogLevel.ERROR,
        LogMessage.BOOK_RETRIEVE_FAILED,
        {
          additionalData: { status: apiResponse.status, error: errorText },
        },
        id
      );
      return NextResponse.json(
        { error: `API error: ${apiResponse.status}` },
        { status: apiResponse.status }
      );
    }

    const apiBook = await apiResponse.json();
    await sendLog(LogLevel.INFO, LogMessage.BOOK_RETRIEVED, {}, id);
    return NextResponse.json(apiBook as Book);
  } catch (error) {
    await sendLog(
      LogLevel.ERROR,
      LogMessage.BOOK_RETRIEVE_FAILED,
      {
        additionalData: {
          error: error instanceof Error ? error.message : String(error),
        },
      },
      id
    );
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export const GET = handler;
