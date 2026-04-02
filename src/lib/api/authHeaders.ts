import { auth0 } from '@/lib/auth0';
import { sendLog, LogLevel, LogMessage } from '@/utils/logs';
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
    await sendLog(LogLevel.WARN, LogMessage.SESSION_NOT_FOUND);
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const baseUrl = process.env.GY_API?.replace(/['"]/g, '');
  if (!baseUrl) {
    await sendLog(LogLevel.ERROR, LogMessage.CONFIG_GY_API_MISSING);
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
