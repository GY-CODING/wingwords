import { logger } from '@/utils/logger';
import { Profile } from '@gycoding/nebula';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const route = req.nextUrl.pathname;
  try {
    const { id: profileId } = await context.params;

    if (!profileId) {
      logger.warn('Missing profile id', { route });
      return NextResponse.json(
        { error: 'Missing profile id' },
        { status: 400 }
      );
    }

    const baseUrl = process.env.GY_API?.replace(/['"]/g, '');
    if (!baseUrl) {
      logger.error('GY_API missing', {
        route,
        profileId: profileId ?? 'unknown',
      });
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    const apiResponse = await fetch(
      `${baseUrl}/books/profiles/${profileId}/public`,
      {
        headers: { 'Content-Type': 'application/json' },
        method: 'GET',
      }
    );

    if (!apiResponse.ok) {
      const errorText = await apiResponse.text();

      if (apiResponse.status === 404) {
        logger.warn('Profile not found', {
          route,
          profileId,
          error: errorText,
        });
        return NextResponse.json(
          { error: 'Profile not found' },
          { status: 404 }
        );
      }

      logger.error('Profile retrieve failed', {
        profileId,
        status: apiResponse.status,
        error: errorText,
      });
      return NextResponse.json(
        { error: `API error: ${apiResponse.status}` },
        { status: 502 }
      );
    }

    const data = await apiResponse.json();
    logger.info('Profile retrieved', { profileId });
    return NextResponse.json(data as Profile);
  } catch (error) {
    logger.error(
      'Profile retrieve failed',
      {
        error: error instanceof Error ? error.message : String(error),
      },
      error
    );
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
