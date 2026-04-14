import { logger } from '@/utils/logger';
import { User } from '@/domain/friend.model';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const queryParam = req.nextUrl.searchParams.get('query');

    const baseUrl = process.env.GY_API?.replace(/['"]/g, '');
    if (!baseUrl) {
      logger.error('GY_API missing', {
        route: '/api/public/books/profiles',
        additionalData: { query: queryParam ?? 'unknown' },
      });
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    const apiResponse = await fetch(
      `${baseUrl}/books/profiles/public?query=${queryParam}`,
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );

    if (!apiResponse.ok) {
      const errorText = await apiResponse.text();
      logger.error('Profile search failed', {
        query: queryParam,
        status: apiResponse.status,
        error: errorText,
      });
      return NextResponse.json(
        { error: `API error: ${apiResponse.status}` },
        { status: apiResponse.status }
      );
    }

    const users = await apiResponse.json();
    logger.info('Profile search success', { query: queryParam });
    return NextResponse.json(users as User[]);
  } catch (error) {
    logger.error(
      'Profile search failed',
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
