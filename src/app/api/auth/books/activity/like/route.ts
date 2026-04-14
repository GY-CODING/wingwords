import { auth0 } from '@/lib/auth0';
import { logger } from '@/utils/logger';
import { NextRequest, NextResponse } from 'next/server';

interface LikeRequestBody {
  id: string;
  profileId: string;
}

export async function PATCH(req: NextRequest) {
  try {
    const route = req.nextUrl.pathname;
    const session = await auth0.getSession();

    if (!session) {
      logger.warn('Session not found', { route });
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = (await req.json()) as LikeRequestBody;
    const { id, profileId } = body;

    if (!id || !profileId) {
      return NextResponse.json(
        { error: 'Missing required fields: id, profileId' },
        { status: 400 }
      );
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

    const apiResponse = await fetch(`${baseUrl}/books/activity`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${session.tokenSet?.idToken}`,
      },
      body: JSON.stringify({ id, profileId }),
    });

    if (!apiResponse.ok) {
      const errorText = await apiResponse.text();
      logger.error(
        'Toggle like failed',
        {
          route: req.nextUrl.pathname,
          userId: session.user.sub,
          status: apiResponse.status,
          error: errorText,
        },
        new Error(`GyCoding API Error: ${errorText}`)
      );
      return NextResponse.json(
        { error: `Failed to toggle like: ${apiResponse.status}` },
        { status: apiResponse.status }
      );
    }

    const data = await apiResponse.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
