import { logger } from '@/utils/logger';
import { Book } from '@gycoding/nebula';
import { NextRequest, NextResponse } from 'next/server';

export const GET = async (req: NextRequest) => {
  let profileId: string | null | undefined = null;
  try {
    const { searchParams } = new URL(req.url);
    profileId = searchParams.get('profileId');
    const page = searchParams.get('page') || '0';
    const size = searchParams.get('size') || '50';

    if (!profileId) {
      logger.warn('Missing profileId param', { route: '/api/public/books' });
      return NextResponse.json(
        { error: 'Missing profileId param' },
        { status: 400 }
      );
    }

    const baseUrl = process.env.GY_API?.replace(/['"]/g, '');
    if (!baseUrl) {
      logger.error('GY_API missing', {
        route: '/api/public/books',
        profileId: profileId ?? 'unknown',
      });
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    const apiResponse = await fetch(
      `${baseUrl}/books/${profileId}/list?page=${page}&size=${size}`,
      {
        headers: { 'Content-Type': 'application/json' },
        method: 'GET',
      }
    );

    const data = await apiResponse.json();

    if (!apiResponse.ok) {
      logger.error('Book list retrieve failed', {
        profileId: profileId ?? 'unknown',
        status: apiResponse.status,
        error: JSON.stringify(data),
      });
      return NextResponse.json(
        { error: `API error: ${apiResponse.status}` },
        { status: apiResponse.status }
      );
    }

    logger.info('Book list retrieved', {
      profileId: profileId ?? 'unknown',
      page,
      size,
    });
    return NextResponse.json(data as Book[]);
  } catch (error) {
    logger.error(
      'Book list retrieve failed',
      {
        profileId: profileId ?? 'unknown',
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
