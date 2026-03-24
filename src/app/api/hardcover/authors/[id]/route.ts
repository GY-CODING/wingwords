/* eslint-disable @typescript-eslint/no-explicit-any */
import { sendLog, LogLevel, LogMessage } from '@/utils/logs';
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
      await sendLog(
        LogLevel.ERROR,
        LogMessage.CONFIG_HARDCOVER_CREDENTIALS_MISSING
      );
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
      await sendLog(
        LogLevel.ERROR,
        LogMessage.HARDCOVER_AUTHOR_RETRIEVE_FAILED,
        {
          additionalData: {
            authorId: id,
            status: response.status,
            error: text,
          },
        }
      );
      throw new Error(`Hardcover API failed: ${response.statusText}`);
    }

    const data = await response.json();
    if (data.errors) {
      throw new Error(data.errors[0]?.message || 'GraphQL error');
    }

    const rawAuthor = data.data?.authors?.[0];
    if (!rawAuthor) {
      await sendLog(
        LogLevel.WARN,
        LogMessage.HARDCOVER_AUTHOR_NOT_FOUND,
        {},
        id
      );
      return NextResponse.json({ error: 'Author not found' }, { status: 404 });
    }

    await sendLog(LogLevel.INFO, LogMessage.HARDCOVER_AUTHOR_RETRIEVED, {
      additionalData: { authorId: id },
    });
    return NextResponse.json(mapRawAuthorToAuthor(rawAuthor));
  } catch (error) {
    await sendLog(LogLevel.ERROR, LogMessage.HARDCOVER_AUTHOR_RETRIEVE_FAILED, {
      additionalData: {
        error: error instanceof Error ? error.message : String(error),
      },
    });
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
