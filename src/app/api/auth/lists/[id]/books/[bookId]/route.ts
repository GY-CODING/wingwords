import { getApiAuthHeaders } from '@/lib/api/authHeaders';
import { NextRequest, NextResponse } from 'next/server';

type Context = { params: Promise<{ id: string; bookId: string }> };

export async function DELETE(_request: NextRequest, context: Context) {
  const { id, bookId } = await context.params;
  const auth = await getApiAuthHeaders();
  if (auth instanceof NextResponse) return auth;

  try {
    const response = await fetch(
      `${auth.baseUrl}/books/lists/${id}/books/${bookId}`,
      {
        method: 'DELETE',
        headers: auth.headers,
      }
    );

    if (!response.ok && response.status !== 204) {
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
