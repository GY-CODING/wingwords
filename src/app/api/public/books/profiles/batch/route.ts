import { sendLog, LogLevel, LogMessage } from '@/utils/logs';
import { NextRequest, NextResponse } from 'next/server';

const MAX_BATCH_SIZE = 50;

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const { ids } = await req.json();

    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { error: 'Missing or empty ids array' },
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

    const uniqueIds = [...new Set<string>(ids)].slice(0, MAX_BATCH_SIZE);

    const results = await Promise.allSettled(
      uniqueIds.map(async (id: string) => {
        const response = await fetch(`${baseUrl}/books/profiles/${id}/public`, {
          headers: { 'Content-Type': 'application/json' },
          method: 'GET',
        });

        if (!response.ok) {
          return { id, profile: null };
        }

        const profile = await response.json();
        return { id, profile };
      })
    );

    const profilesMap: Record<string, unknown> = {};

    for (const result of results) {
      if (result.status === 'fulfilled') {
        profilesMap[result.value.id] = result.value.profile;
      }
    }

    await sendLog(LogLevel.INFO, LogMessage.PROFILE_BATCH_RETRIEVED, {
      additionalData: {
        requestedCount: uniqueIds.length,
        resolvedCount: Object.keys(profilesMap).length,
      },
    });
    return NextResponse.json(profilesMap);
  } catch (error) {
    await sendLog(LogLevel.ERROR, LogMessage.PROFILE_BATCH_FAILED, {
      additionalData: {
        error: error instanceof Error ? error.message : String(error),
      },
    });
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
