import { auth0 } from '@/lib/auth0';
import { sendLog, LogLevel, LogMessage } from '@/utils/logs';
import { NextRequest, NextResponse } from 'next/server';
import { MOCK_LISTS } from '@/lib/mocks/lists.mock';

const isMockMode = !process.env.GY_API?.replace(/['"]/g, '');

async function getAuthHeaders(): Promise<
  { headers: Record<string, string>; baseUrl: string } | NextResponse
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

export async function GET() {
  if (isMockMode) {
    return NextResponse.json(MOCK_LISTS);
  }

  try {
    const auth = await getAuthHeaders();
    if (auth instanceof NextResponse) return auth;

    const response = await fetch(`${auth.baseUrl}/lists`, {
      method: 'GET',
      headers: auth.headers,
    });

    if (!response.ok) {
      // Fall back to mock while the backend endpoint is not yet published
      if (response.status === 404) return NextResponse.json(MOCK_LISTS);
      const errorText = await response.text();
      return NextResponse.json(
        { error: `API error: ${response.status} - ${errorText}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  if (isMockMode) {
    const body = await request.json();
    const newList = { id: crypto.randomUUID(), books: [], ...body };
    return NextResponse.json(newList, { status: 201 });
  }

  try {
    const auth = await getAuthHeaders();
    if (auth instanceof NextResponse) return auth;

    const body = await request.json();

    const response = await fetch(`${auth.baseUrl}/lists`, {
      method: 'POST',
      headers: auth.headers,
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { error: `API error: ${response.status} - ${errorText}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const auth = await getAuthHeaders();
    if (auth instanceof NextResponse) return auth;

    const body = await request.json();

    const response = await fetch(`${auth.baseUrl}/lists`, {
      method: 'PATCH',
      headers: auth.headers,
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { error: `API error: ${response.status} - ${errorText}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
