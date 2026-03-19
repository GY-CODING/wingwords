import { feedActivity } from '@/domain/activity.model';
import { auth0 } from '@/lib/auth0';
import { sendLog, LogLevel, LogMessage } from '@/utils/logs';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
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
      await sendLog(LogLevel.ERROR, LogMessage.ACTIVITY_LIST_RETRIEVE_FAILED, {
        additionalData: { status: apiResponse.status, error: errorText },
      });
      throw new Error(`GyCoding API Error: ${errorText}`);
    }

    const activities = await apiResponse.json();
    const hasNext = apiResponse.headers.get('x-has-next');

    await sendLog(LogLevel.INFO, LogMessage.ACTIVITY_LIST_RETRIEVED, {
      additionalData: { page, size, hasNext },
    });

    const response = NextResponse.json(activities as feedActivity[]);
    if (hasNext !== null) {
      response.headers.set('X-Has-Next', hasNext);
    }
    return response;
  } catch (error) {
    await sendLog(LogLevel.ERROR, LogMessage.ACTIVITY_LIST_RETRIEVE_FAILED, {
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

export async function POST(req: NextRequest) {
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
      await sendLog(LogLevel.ERROR, LogMessage.CONFIG_GY_API_MISSING);
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
      await sendLog(LogLevel.ERROR, LogMessage.ACTIVITY_CREATE_FAILED, {
        additionalData: { status: apiResponse.status, error: errorText },
      });
      throw new Error(`GyCoding API Error: ${errorText}`);
    }

    const activity = await apiResponse.json();
    await sendLog(LogLevel.INFO, LogMessage.ACTIVITY_CREATED);
    return NextResponse.json(activity as feedActivity);
  } catch (error) {
    await sendLog(LogLevel.ERROR, LogMessage.ACTIVITY_CREATE_FAILED, {
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
