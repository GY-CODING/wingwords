import { auth0 } from '@/lib/auth0';
import { logger } from '@/utils/logger';
import { NextResponse } from 'next/server';

export interface ApiAuthContext {
  headers: Record<string, string>;
  baseUrl: string;
}

/**
 * Retrieves the Auth0 session and builds the authorization headers + base URL
 * needed to call the GY API. Returns a 401/500 NextResponse on failure.
 */
export async function getApiAuthHeaders(): Promise<
  ApiAuthContext | NextResponse
> {
  const session = await auth0.getSession();
  const idToken = session?.tokenSet?.idToken;

  if (!session || !idToken) {
    logger.warn('No active session found', {
      userId: session?.user.sub ?? 'unknown',
    });
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const baseUrl = process.env.GY_API?.replace(/['"]/g, '');
  if (!baseUrl) {
    logger.error('GY_API environment variable is not defined');
    return NextResponse.json(
      { error: 'Server configuration error' },
      { status: 500 }
    );
  }

  return {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${idToken}`,
    },
    baseUrl,
  };
}
