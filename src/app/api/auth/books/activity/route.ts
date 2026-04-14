import { feedActivity } from '@/domain/activity.model';
import { auth0 } from '@/lib/auth0';
import { logger } from '@/utils/logger';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const session = await auth0.getSession();

    if (!session) {
      logger.warn('Session not found', { route: '/api/auth/books/activity' });
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    logger.debug('Session retrieved', {
      userId: session.user.sub,
      route: '/api/auth/books/activity',
    });

    const baseUrl = process.env.GY_API?.replace(/['"]/g, '');
    if (!baseUrl) {
      logger.error('GY_API missing', {
        route: '/api/auth/books/activity',
        userId: session.user.sub,
      });
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    const { searchParams } = req.nextUrl;
    const page = searchParams.get('page') ?? '0';
    const size = searchParams.get('size') ?? '50';

    const apiUrl = `${baseUrl}/books/activity?page=${page}&size=${size}`;
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session.tokenSet?.idToken}`,
    };

    const apiResponse = await fetch(apiUrl, { headers });

    if (!apiResponse.ok) {
      const errorText = await apiResponse.text();
      logger.error('Activity list retrieve failed', {
        status: apiResponse.status,
        error: errorText,
      });
      throw new Error(`GyCoding API Error: ${errorText}`);
    }

    const activities = await apiResponse.json();
    const hasNext = apiResponse.headers.get('x-has-next');

    logger.info('Activity list retrieved', {
      page,
      size,
      hasNext,
    });

    const response = NextResponse.json(activities as feedActivity[]);
    if (hasNext !== null) {
      response.headers.set('X-Has-Next', hasNext);
    }
    return response;
  } catch (error) {
    logger.error(
      'Activity list retrieve failed',
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

export async function POST(req: NextRequest) {
  try {
    const session = await auth0.getSession();

    if (!session) {
      logger.warn('Session not found', { route: '/api/auth/books/activity' });
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    logger.debug('Session retrieved', {
      userId: session.user.sub,
      route: '/api/auth/books/activity',
    });

    const body = await req.json();
    const { message } = body;

    if (!message || typeof message !== 'string' || message.trim() === '') {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    const baseUrl = process.env.GY_API?.replace(/['"]/g, '');
    if (!baseUrl) {
      logger.error('GY_API missing', {
        route: '/api/auth/books/activity',
        userId: session.user.sub,
      });
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    const apiResponse = await fetch(`${baseUrl}/books/activity`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.tokenSet?.idToken}`,
      },
      body: JSON.stringify({ message }),
    });

    if (!apiResponse.ok) {
      const errorText = await apiResponse.text();
      logger.error('Activity create failed', {
        status: apiResponse.status,
        error: errorText,
        userId: session.user.sub,
      });
      throw new Error(`GyCoding API Error: ${errorText}`);
    }

    const activity = await apiResponse.json();
    logger.info('Activity created', {
      route: '/api/auth/books/activity',
      userId: session.user.sub,
    });
    return NextResponse.json(activity as feedActivity);
  } catch (error) {
    logger.error(
      'Activity create failed',
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
