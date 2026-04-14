import { auth0 } from '@/lib/auth0';
import { logger } from '@/utils/logger';
import { NextRequest, NextResponse } from 'next/server';

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const route = req.nextUrl.pathname;
    const { id: friendId } = await context.params;
    const session = await auth0.getSession();

    if (!session) {
      logger.warn('Session not found', { route });
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
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

    const apiResponse = await fetch(`${baseUrl}/books/friends/${friendId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.tokenSet?.idToken}`,
      },
    });

    if (!apiResponse.ok) {
      const errorText = await apiResponse.text();
      logger.error('Friend delete failed', {
        additionalData: { status: apiResponse.status, error: errorText },
        userId: session.user.sub,
      });
      return NextResponse.json(
        { error: `API error: ${apiResponse.status}` },
        { status: apiResponse.status }
      );
    }

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
