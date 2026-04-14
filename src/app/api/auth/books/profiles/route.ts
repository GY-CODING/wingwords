import { auth0 } from '@/lib/auth0';
import { logger } from '@/utils/logger';
import { Profile } from '@gycoding/nebula';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const route = req.nextUrl.pathname;
    const session = await auth0.getSession();

    if (!session) {
      logger.warn('Session not found', { route });
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const queryParam = req.nextUrl.searchParams.get('query');

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

    const apiResponse = await fetch(
      `${baseUrl}/books/profiles?query=${queryParam}`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.tokenSet?.idToken}`,
        },
      }
    );

    if (!apiResponse.ok) {
      return NextResponse.json(
        { error: `API error: ${apiResponse.status}` },
        { status: apiResponse.status }
      );
    }

    const users = await apiResponse.json();
    return NextResponse.json(users as Profile[]);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
