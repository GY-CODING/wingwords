import { auth0 } from '@/lib/auth0';
import clientPromise from '@/lib/mongodb';
import { sendLog, LogLevel, LogMessage } from '@/utils/logs';
import { FriendRequest } from '@gycoding/nebula';
import { NextRequest, NextResponse } from 'next/server';

async function handler(req: NextRequest) {
  try {
    const session = await auth0.getSession();

    if (!session) {
      await sendLog(LogLevel.WARN, LogMessage.SESSION_NOT_FOUND);
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
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

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session.tokenSet?.idToken}`,
    };

    if (req.method === 'POST') {
      const body = await req.json();
      const toUserId = body.userId || body.to;

      if (!toUserId) {
        return NextResponse.json(
          { error: 'User ID is required' },
          { status: 400 }
        );
      }

      const apiResponse = await fetch(`${baseUrl}/books/friends/request`, {
        headers,
        method: 'POST',
        body: JSON.stringify({ to: toUserId }),
      });

      if (!apiResponse.ok) {
        const errorText = await apiResponse.text();
        await sendLog(LogLevel.ERROR, LogMessage.FRIEND_REQUEST_SEND_FAILED, {
          additionalData: {
            toUserId,
            status: apiResponse.status,
            error: errorText,
          },
        });
        return NextResponse.json(
          { error: errorText },
          { status: apiResponse.status }
        );
      }

      const data = await apiResponse.json();
      await sendLog(LogLevel.INFO, LogMessage.FRIEND_REQUEST_SENT, {
        additionalData: { toUserId },
      });
      return NextResponse.json(data);
    }

    if (req.method === 'GET') {
      const url = new URL(
        req.url,
        process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
      );
      const profileId = url.searchParams.get('profileId');

      try {
        const client = await clientPromise;
        const db = client.db('GYBooks');
        const collection = db.collection('FriendRequest');
        const data = await collection.find({ to: profileId }).toArray();

        await sendLog(LogLevel.INFO, LogMessage.FRIEND_REQUEST_LIST_RETRIEVED, {
          profileId: profileId ?? undefined,
          additionalData: { count: data.length },
        });
        return NextResponse.json(data as unknown as FriendRequest[]);
      } catch (error) {
        await sendLog(LogLevel.ERROR, LogMessage.FRIEND_REQUEST_LIST_FAILED, {
          profileId: profileId ?? undefined,
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

    return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
  } catch (error) {
    await sendLog(LogLevel.ERROR, LogMessage.FRIEND_REQUEST_SEND_FAILED, {
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

export async function POST(req: NextRequest) {
  return handler(req);
}

export async function GET(req: NextRequest) {
  return handler(req);
}
