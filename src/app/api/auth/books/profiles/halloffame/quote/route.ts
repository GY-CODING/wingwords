import { auth0 } from '@/lib/auth0';
import { logger } from '@/utils/logger';
import { NextRequest, NextResponse } from 'next/server';

export async function PATCH(req: NextRequest) {
  const route = req.nextUrl.pathname;
  try {
    const session = await auth0.getSession();

    if (!session) {
      logger.warn('Session not found', { route });
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    logger.debug('Session retrieved', {
      userId: session.user.sub,
      route,
    });

    const body = await req.json();
    const { quote } = body;

    const baseUrl = process.env.GY_API?.replace(/['"]/g, '');
    if (!baseUrl) {
      logger.error('GY_API missing', { route, userId: session.user.sub });
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    logger.info('Updating Hall of Fame quote', { quote });
    const apiResponse = await fetch(
      `${baseUrl}/books/profiles/halloffame/quote`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.tokenSet?.idToken}`,
        },
        body: JSON.stringify({ quote }),
      }
    );

    if (!apiResponse.ok) {
      const errorText = await apiResponse.text();
      logger.error('Hall of Fame quote update failed', {
        status: apiResponse.status,
        error: errorText,
        userId: session.user.sub,
      });
      return NextResponse.json(
        { error: `API error: ${apiResponse.status}` },
        { status: apiResponse.status }
      );
    }

    logger.info('Hall of Fame quote updated', { route });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    logger.error(
      'Hall of Fame quote update failed',
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
