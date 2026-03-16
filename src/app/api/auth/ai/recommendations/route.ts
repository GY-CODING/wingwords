/* eslint-disable @typescript-eslint/no-explicit-any */
import { auth0 } from '@/lib/auth0';
import { sendLog, LogLevel, LogMessage } from '@/utils/logs';
import {
  streamBookRecommendations,
  streamDiscoverRecommendations,
  BookContext,
  HistoryMessage,
} from '@/lib/gemini/geminiService';
import { NextRequest, NextResponse } from 'next/server';

const GET_BOOKS_TITLES_QUERY = `
  query GetBooksTitles($ids: [Int!]!) {
    books(where: {id: {_in: $ids}}) {
      id
      title
      contributions(limit: 1) {
        author {
          name
        }
      }
    }
  }
`;

interface GyBook {
  id: string;
  averageRating?: number;
  userData?: {
    status?: string;
    rating?: number;
  };
}

async function fetchGyBooks(
  baseUrl: string,
  profileId: string,
  authHeader?: string
): Promise<GyBook[]> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (authHeader) headers['Authorization'] = authHeader;

  try {
    const res = await fetch(
      `${baseUrl}/books/${profileId}/list?page=0&size=200`,
      { headers, method: 'GET' }
    );
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

async function fetchHardcoverTitles(
  ids: string[]
): Promise<Map<string, { title: string; author: string }>> {
  const titleMap = new Map<string, { title: string; author: string }>();
  if (ids.length === 0) return titleMap;

  const apiUrl = process.env.HARDCOVER_API_URL;
  const apiKey = process.env.HARDCOVER_API_TOKEN;
  if (!apiUrl || !apiKey) return titleMap;

  const numericIds = ids.map((id) => parseInt(id, 10)).filter((n) => !isNaN(n));
  if (numericIds.length === 0) return titleMap;

  const CHUNK = 150;
  const chunks: number[][] = [];
  for (let i = 0; i < numericIds.length; i += CHUNK) {
    chunks.push(numericIds.slice(i, i + CHUNK));
  }

  await Promise.all(
    chunks.map(async (chunk) => {
      try {
        const res = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: apiKey,
          },
          body: JSON.stringify({
            query: GET_BOOKS_TITLES_QUERY,
            variables: { ids: chunk },
          }),
        });
        if (!res.ok) return;
        const data = await res.json();
        const books: any[] = data?.data?.books ?? [];
        for (const book of books) {
          const author =
            book.contributions?.[0]?.author?.name ?? 'Unknown Author';
          titleMap.set(String(book.id), {
            title: book.title ?? 'Unknown Title',
            author,
          });
        }
      } catch {
        // Silently skip failed chunks — AI prompt will degrade gracefully
      }
    })
  );

  return titleMap;
}

function mergeBookContext(
  books: GyBook[],
  titleMap: Map<string, { title: string; author: string }>
): BookContext[] {
  return books
    .map((b) => {
      const info = titleMap.get(b.id);
      if (!info) return null;
      return {
        id: b.id,
        title: info.title,
        author: info.author,
        rating: b.userData?.rating,
        status: b.userData?.status,
      } satisfies BookContext;
    })
    .filter((b): b is BookContext => b !== null);
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth0.getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const {
      targetUserId,
      currentUserId,
      targetUserName,
      question,
      mode,
      history,
    } = body as {
      targetUserId?: string;
      currentUserId?: string;
      targetUserName?: string;
      question?: string;
      mode?: 'recommend' | 'discover';
      history?: HistoryMessage[];
    };

    const baseUrl = process.env.GY_API?.replace(/['"]/g, '');
    if (!baseUrl) {
      await sendLog(LogLevel.ERROR, LogMessage.CONFIG_GY_API_MISSING);
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    const authHeader = session.tokenSet?.idToken
      ? `Bearer ${session.tokenSet.idToken}`
      : undefined;

    // Discover mode: recommend new books based on current user's library only
    if (mode === 'discover') {
      if (!currentUserId) {
        return NextResponse.json(
          { error: 'Missing currentUserId' },
          { status: 400 }
        );
      }

      const currentBooks = await fetchGyBooks(
        baseUrl,
        currentUserId,
        authHeader
      );
      const titleMap = await fetchHardcoverTitles(
        currentBooks.map((b) => b.id)
      );
      const currentBookContext = mergeBookContext(currentBooks, titleMap);

      const stream = streamDiscoverRecommendations({
        currentUserBooks: currentBookContext,
        userQuestion: question,
        history,
      });

      const readable = new ReadableStream({
        async start(controller) {
          const encoder = new TextEncoder();
          try {
            for await (const chunk of stream) {
              controller.enqueue(encoder.encode(chunk));
            }
          } finally {
            controller.close();
          }
        },
      });

      return new Response(readable, {
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          'Cache-Control': 'no-cache',
          'X-Content-Type-Options': 'nosniff',
        },
      });
    }

    // Default recommend mode
    if (!targetUserId || !currentUserId) {
      return NextResponse.json(
        { error: 'Missing targetUserId or currentUserId' },
        { status: 400 }
      );
    }

    const [targetBooks, currentBooks] = await Promise.all([
      fetchGyBooks(baseUrl, targetUserId),
      fetchGyBooks(baseUrl, currentUserId, authHeader),
    ]);

    const allIds = [
      ...new Set([
        ...targetBooks.map((b) => b.id),
        ...currentBooks.map((b) => b.id),
      ]),
    ];

    const titleMap = await fetchHardcoverTitles(allIds);

    const targetBookContext = mergeBookContext(targetBooks, titleMap);
    const currentBookContext = mergeBookContext(currentBooks, titleMap);

    const stream = streamBookRecommendations({
      targetUserName: targetUserName ?? 'this user',
      targetUserBooks: targetBookContext,
      currentUserBooks: currentBookContext,
      userQuestion: question,
      history,
    });

    const readable = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        try {
          for await (const chunk of stream) {
            controller.enqueue(encoder.encode(chunk));
          }
        } finally {
          controller.close();
        }
      },
    });

    return new Response(readable, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch (error) {
    await sendLog(LogLevel.ERROR, LogMessage.CONFIG_GY_API_MISSING, {
      additionalData: {
        error: error instanceof Error ? error.message : String(error),
      },
    });
    return NextResponse.json(
      { error: 'Failed to generate recommendations' },
      { status: 500 }
    );
  }
}
