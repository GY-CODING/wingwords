import { getApiAuthHeaders } from '@/lib/api/authHeaders';
import { NextRequest, NextResponse } from 'next/server';

type Context = { params: Promise<{ id: string }> };

export async function POST(request: NextRequest, context: Context) {
  const { id } = await context.params;
  const auth = await getApiAuthHeaders();
  if (auth instanceof NextResponse) return auth;

  try {
    const { bookId } = await request.json();

    const response = await fetch(`${auth.baseUrl}/books/lists/${id}/books`, {
      method: 'POST',
      headers: auth.headers,
      body: JSON.stringify({ bookId }),
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
  const { id } = await context.params;
  const auth = await getApiAuthHeaders();
  if (auth instanceof NextResponse) return auth;

  try {
    const { bookId, order } = await request.json();

    const response = await fetch(`${auth.baseUrl}/books/lists/${id}/books`, {
      method: 'PATCH',
      headers: auth.headers,
      body: JSON.stringify({ bookId, order }),
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
