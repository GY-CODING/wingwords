import { getApiAuthHeaders } from '@/lib/api/authHeaders';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  const auth = await getApiAuthHeaders();
  if (auth instanceof NextResponse) return auth;

  try {
    const response = await fetch(`${auth.baseUrl}/books/lists`, {
      method: 'GET',
      headers: auth.headers,
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

export async function POST(request: NextRequest) {
  const auth = await getApiAuthHeaders();
  if (auth instanceof NextResponse) return auth;

  try {
    const body = await request.json();

    const response = await fetch(`${auth.baseUrl}/books/lists`, {
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
  const auth = await getApiAuthHeaders();
  if (auth instanceof NextResponse) return auth;

  try {
    const body = await request.json();

    const response = await fetch(`${auth.baseUrl}/books/lists`, {
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
