import { auth0 } from '@/lib/auth0';
import { sendLog, LogLevel, LogMessage } from '@/utils/logs';
import { NextRequest, NextResponse } from 'next/server';

type Context = { params: Promise<{ id: string }> };

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

export async function POST(request: NextRequest, context: Context) {
  try {
    const { id } = await context.params;
    const auth = await getAuthHeaders();
    if (auth instanceof NextResponse) return auth;

    const body = await request.json();

    const response = await fetch(`${auth.baseUrl}/lists/${id}/books`, {
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

export async function PATCH(request: NextRequest, context: Context) {
  try {
    const { id } = await context.params;
    const auth = await getAuthHeaders();
    if (auth instanceof NextResponse) return auth;

    const body = await request.json();

    const response = await fetch(`${auth.baseUrl}/lists/${id}/books`, {
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

export async function DELETE(request: NextRequest, context: Context) {
  try {
    const { id } = await context.params;
    const auth = await getAuthHeaders();
    if (auth instanceof NextResponse) return auth;

    const body = await request.json();

    const response = await fetch(`${auth.baseUrl}/lists/${id}/books`, {
      method: 'DELETE',
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

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
