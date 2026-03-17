import { auth0 } from '@/lib/auth0';
import { sendLog, LogLevel, LogMessage } from '@/utils/logs';
import { ECommands } from '@/utils/constants/ECommands';
import { NextRequest, NextResponse } from 'next/server';

interface ManageRequestBody {
  requestId: string;
  command: ECommands;
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth0.getSession();

    if (!session) {
      await sendLog(LogLevel.ERROR, LogMessage.SESSION_NOT_FOUND);
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await sendLog(
      LogLevel.DEBUG,
      LogMessage.SESSION_RETRIEVED,
      {},
      session.user.sub
    );

    const body = (await req.json()) as ManageRequestBody;
    const { requestId, command } = body;

    const baseUrl = process.env.GY_API?.replace(/['"]/g, '');
    if (!baseUrl) {
      await sendLog(LogLevel.ERROR, LogMessage.CONFIG_GY_API_MISSING);
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    const apiResponse = await fetch(
      `${baseUrl}/books/friends/manage?requestId=${requestId}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.tokenSet?.idToken}`,
        },
        body: JSON.stringify({ command }),
      }
    );

    if (!apiResponse.ok) {
      const errorText = await apiResponse.text();
      await sendLog(LogLevel.ERROR, LogMessage.FRIEND_REQUEST_MANAGE_FAILED, {
        additionalData: {
          requestId,
          command,
          status: apiResponse.status,
          error: errorText,
        },
      });
      return NextResponse.json(
        { error: `API error: ${apiResponse.status}` },
        { status: apiResponse.status }
      );
    }

    await sendLog(LogLevel.INFO, LogMessage.FRIEND_REQUEST_MANAGED, {
      additionalData: { requestId, command },
    });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    await sendLog(LogLevel.ERROR, LogMessage.FRIEND_REQUEST_MANAGE_FAILED, {
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
