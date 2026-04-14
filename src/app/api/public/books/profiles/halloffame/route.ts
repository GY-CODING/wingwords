import { logger } from '@/utils/logger';
import { HallOfFame } from '@gycoding/nebula';
import { NextRequest, NextResponse } from 'next/server';

export const GET = async (req: NextRequest) => {
  try {
    const profileId = req.nextUrl.searchParams.get('profileId');

    const baseUrl = process.env.GY_API?.replace(/['"]/g, '');
    if (!baseUrl) {
      logger.error('GY_API missing', {
        route: '/api/public/books/profiles/halloffame',
        profileId: profileId ?? 'unknown',
      });
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    const apiResponse = await fetch(
      `${baseUrl}/books/profiles/${profileId}/halloffame`,
      { headers: { 'Content-Type': 'application/json' } }
    );

    if (!apiResponse.ok) {
      const errorText = await apiResponse.text();
      logger.error('Hall of Fame retrieve failed', {
        profileId: profileId ?? undefined,
        status: apiResponse.status,
        error: errorText,
      });
      return NextResponse.json(
        { error: `API error: ${apiResponse.status}` },
        { status: apiResponse.status }
      );
    }

    const hallOfFame = await apiResponse.json();
    logger.info('Hall of Fame retrieved', {
      profileId: profileId ?? undefined,
    });
    return NextResponse.json(hallOfFame as HallOfFame);
  } catch (error) {
    logger.error(
      'Hall of Fame retrieve failed',
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
};
