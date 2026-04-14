import { logger } from '@/utils/logger';
import { Activity } from '@/domain/activity.model';
import { NextRequest, NextResponse } from 'next/server';

export const GET = async (req: NextRequest) => {
  try {
    const profileId = req.nextUrl.pathname.split('/')[5];

    const baseUrl = process.env.GY_API?.replace(/['"]/g, '');
    if (!baseUrl) {
      logger.error('GY_API missing', {
        route: req.nextUrl.pathname,
        profileId: profileId ?? 'unknown',
      });
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    const apiResponse = await fetch(`${baseUrl}/books/activity/${profileId}`, {
      headers: { 'Content-Type': 'application/json' },
    });

    if (!apiResponse.ok) {
      const errorText = await apiResponse.text();
      logger.error('Activity retrieve failed', {
        route: req.nextUrl.pathname,
        profileId,
        status: apiResponse.status,
        error: errorText,
      });
      return NextResponse.json(
        { error: `API error: ${apiResponse.status}` },
        { status: apiResponse.status }
      );
    }

    const activity = await apiResponse.json();
    return NextResponse.json(activity as Activity[]);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
};
