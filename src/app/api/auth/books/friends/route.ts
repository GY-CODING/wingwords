import { auth0 } from '@/lib/auth0';
import { sendLog, LogLevel, LogMessage } from '@/utils/logs';
import { Profile } from '@gycoding/nebula';
import { NextResponse } from 'next/server';

export async function GET() {
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

    const baseUrl = process.env.GY_API?.replace(/['"]/g, '');
    if (!baseUrl) {
      await sendLog(LogLevel.ERROR, LogMessage.CONFIG_GY_API_MISSING);
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    const apiResponse = await fetch(`${baseUrl}/books/friends`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.tokenSet?.idToken}`,
      },
    });

    if (!apiResponse.ok) {
      const errorText = await apiResponse.text();
      await sendLog(LogLevel.ERROR, LogMessage.FRIEND_LIST_RETRIEVE_FAILED, {
        additionalData: { status: apiResponse.status, error: errorText },
      });
      return NextResponse.json(
        { error: `API error: ${apiResponse.status}` },
        { status: apiResponse.status }
      );
    }

    const friendsData = await apiResponse.json();
    await sendLog(LogLevel.INFO, LogMessage.FRIEND_LIST_RETRIEVED);
    return NextResponse.json(friendsData as Profile[]);
  } catch (error) {
    await sendLog(LogLevel.ERROR, LogMessage.FRIEND_LIST_RETRIEVE_FAILED, {
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
