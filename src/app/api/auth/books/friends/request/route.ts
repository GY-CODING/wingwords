import { auth0 } from '@/lib/auth0';
import clientPromise from '@/lib/mongodb';
import { logger } from '@/utils/logger';
import { FriendRequest } from '@gycoding/nebula';
import { NextRequest, NextResponse } from 'next/server';

async function handler(req: NextRequest) {
  try {
    const route = req.nextUrl.pathname;
    const session = await auth0.getSession();

    if (!session) {
      logger.warn('Session not found', { route });
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const baseUrl = process.env.GY_API?.replace(/['"]/g, '');
    if (!baseUrl) {
      logger.error('GY_API missing', {
        route: req.nextUrl.pathname,
        userId: session.user.sub,
      });
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
        logger.error('Friend request failed', {
          additionalData: { status: apiResponse.status, error: errorText },
          userId: session.user.sub,
        });
        return NextResponse.json(
          { error: errorText },
          { status: apiResponse.status }
        );
      }

      const data = await apiResponse.json();
      return NextResponse.json(data);
    }

    if (req.method === 'GET') {
      const url = new URL(
        req.url,
        process.env.NEXT_PUBLIC_BASE_URL ||
          `http://localhost:${process.env.PORT || 3001}`
      );
      const profileId = url.searchParams.get('profileId');

      try {
        const client = await clientPromise;
        const db = client.db('GYBooks');
        const collection = db.collection('FriendRequest');
        const data = await collection.find({ to: profileId }).toArray();

        return NextResponse.json(data as unknown as FriendRequest[]);
      } catch (error) {
        logger.error('Friend request retrieval failed', {
          additionalData: {
            error: error instanceof Error ? error.message : String(error),
          },
          userId: session.user.sub,
        });
        return NextResponse.json(
          { error: error instanceof Error ? error.message : 'Unknown error' },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
  } catch (error) {
    logger.error('Friend request handler failed', {
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
