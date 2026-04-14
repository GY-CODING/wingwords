import { auth0 } from '@/lib/auth0';
import { logger } from '@/utils/logger';
import { Profile } from '@gycoding/nebula';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const route = req.nextUrl.pathname;
    const session = await auth0.getSession();

    if (!session) {
      logger.warn('Session not found', { route });
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: profileId } = await context.params;

    if (!profileId) {
      return NextResponse.json(
        { error: 'Missing profile id' },
        { status: 400 }
      );
    }

    const baseUrl = process.env.GY_API?.replace(/['"]/g, '');
    if (!baseUrl) {
      logger.error('GY_API missing', {
        route: req.nextUrl.pathname,
        userId: session.user.sub,
        profileId,
      });
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    const apiResponse = await fetch(`${baseUrl}/books/profiles/${profileId}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.tokenSet?.idToken}`,
      },
      method: 'GET',
    });

    if (!apiResponse.ok) {
      const errorText = await apiResponse.text();
      logger.error('Profile retrieval failed', {
        additionalData: { status: apiResponse.status, error: errorText },
        userId: session.user.sub,
        profileId,
      });

      if (apiResponse.status === 404) {
        return NextResponse.json(
          { error: 'Profile not found' },
          { status: 404 }
        );
      }

      return NextResponse.json(
        { error: `API error: ${apiResponse.status}` },
        { status: 502 }
      );
    }

    const data = await apiResponse.json();
    return NextResponse.json(data as Profile[]);
  } catch (error) {
    logger.error('Profile retrieval failed', {
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
