import { auth0 } from '@/lib/auth0';
import { sendLog, LogLevel, LogMessage } from '@/utils/logs';
import { NextRequest, NextResponse } from 'next/server';

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

    const baseUrl = process.env.GY_API?.replace(/['"]/g, '');
    if (!baseUrl) {
      await sendLog(LogLevel.ERROR, LogMessage.CONFIG_GY_API_MISSING);
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    const body = await req.json();

    const apiResponse = await fetch(
      `${baseUrl}/books/profiles/halloffame/quote`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.tokenSet?.idToken}`,
        },
        body: JSON.stringify({ quote: body }),
      }
    );

    if (!apiResponse.ok) {
      const errorText = await apiResponse.text();
      await sendLog(LogLevel.ERROR, LogMessage.HALLOFFAME_QUOTE_UPDATE_FAILED, {
        additionalData: { status: apiResponse.status, error: errorText },
      });
      return NextResponse.json(
        { error: `API error: ${apiResponse.status}` },
        { status: apiResponse.status }
      );
    }

    await sendLog(LogLevel.INFO, LogMessage.HALLOFFAME_QUOTE_UPDATED);
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    await sendLog(LogLevel.ERROR, LogMessage.HALLOFFAME_QUOTE_UPDATE_FAILED, {
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
