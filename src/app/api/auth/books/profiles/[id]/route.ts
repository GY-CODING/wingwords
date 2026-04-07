import { auth0 } from '@/lib/auth0';
import { sendLog, LogLevel, LogMessage } from '@/utils/logs';
import { Profile } from '@gycoding/nebula';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth0.getSession();

    if (!session) {
      await sendLog(LogLevel.WARN, LogMessage.SESSION_NOT_FOUND);
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: profileId } = await context.params;

    if (!profileId) {
      return NextResponse.json(
        { error: 'Missing profile id' },
        { status: 400 }
      );
    }

    const baseUrl = process.env.GY_API?.replace(/['"]/g, '');
    if (!baseUrl) {
      await sendLog(LogLevel.ERROR, LogMessage.CONFIG_GY_API_MISSING);
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    const apiResponse = await fetch(`${baseUrl}/books/profiles/${profileId}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.tokenSet?.idToken}`,
      },
      method: 'GET',
    });

    if (!apiResponse.ok) {
      const errorText = await apiResponse.text();

      if (apiResponse.status === 404) {
        await sendLog(LogLevel.WARN, LogMessage.PROFILE_NOT_FOUND, {
          profileId,
          additionalData: { error: errorText },
        });
        return NextResponse.json(
          { error: 'Profile not found' },
          { status: 404 }
        );
      }

      await sendLog(LogLevel.ERROR, LogMessage.PROFILE_RETRIEVE_FAILED, {
        profileId,
        additionalData: { status: apiResponse.status, error: errorText },
      });
      return NextResponse.json(
        { error: `API error: ${apiResponse.status}` },
        { status: 502 }
      );
    }

    const data = await apiResponse.json();
    await sendLog(LogLevel.INFO, LogMessage.PROFILE_RETRIEVED, { profileId });
    return NextResponse.json(data as Profile);
  } catch (error) {
    await sendLog(LogLevel.ERROR, LogMessage.PROFILE_RETRIEVE_FAILED, {
      additionalData: {
        error: error instanceof Error ? error.message : String(error),
      },
    });
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
