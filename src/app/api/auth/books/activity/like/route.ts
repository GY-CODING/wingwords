import { auth0 } from '@/lib/auth0';
import { sendLog, LogLevel, LogMessage } from '@/utils/logs';
import { NextRequest, NextResponse } from 'next/server';

interface LikeRequestBody {
  id: string;
  profileId: string;
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await auth0.getSession();

    if (!session) {
      await sendLog(LogLevel.WARN, LogMessage.SESSION_NOT_FOUND);
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await sendLog(
      LogLevel.DEBUG,
      LogMessage.SESSION_RETRIEVED,
      {},
      session.user.sub
    );

    const body = (await req.json()) as LikeRequestBody;
    const { id, profileId } = body;

    if (!id || !profileId) {
      return NextResponse.json(
        { error: 'Missing required fields: id, profileId' },
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

    const apiResponse = await fetch(`${baseUrl}/books/activity`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${session.tokenSet?.idToken}`,
      },
      body: JSON.stringify({ id, profileId }),
    });

    if (!apiResponse.ok) {
      const errorText = await apiResponse.text();
      await sendLog(LogLevel.ERROR, LogMessage.ACTIVITY_LIKE_TOGGLE_FAILED, {
        profileId,
        additionalData: {
          activityId: id,
          status: apiResponse.status,
          error: errorText,
        },
      });
      return NextResponse.json(
        { error: `Failed to toggle like: ${apiResponse.status}` },
        { status: apiResponse.status }
      );
    }

    const data = await apiResponse.json();
    await sendLog(LogLevel.INFO, LogMessage.ACTIVITY_LIKE_TOGGLED, {
      profileId,
      additionalData: { activityId: id },
    });
    return NextResponse.json(data);
  } catch (error) {
    await sendLog(LogLevel.ERROR, LogMessage.ACTIVITY_LIKE_TOGGLE_FAILED, {
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
