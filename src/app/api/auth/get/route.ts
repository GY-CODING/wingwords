import { User } from '@/domain/user.model';
import { auth0 } from '@/lib/auth0';
import { sendLog, LogLevel, LogMessage } from '@/utils/logs';
import { MongoClient } from 'mongodb';
import { NextResponse } from 'next/server';

export async function GET() {
  const session = await auth0.getSession();

  if (!session) {
    await sendLog(LogLevel.WARN, LogMessage.SESSION_NOT_FOUND);
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userId = session.user.sub;
  await sendLog(LogLevel.DEBUG, LogMessage.SESSION_RETRIEVED, {}, userId);

  if (!userId) {
    return NextResponse.json({ error: 'No user session' }, { status: 401 });
  }

  const uri = process.env.MONGO_URI;
  if (!uri) {
    await sendLog(LogLevel.ERROR, LogMessage.CONFIG_MONGO_URI_MISSING);
    return NextResponse.json({ error: 'Missing Mongo URI' }, { status: 500 });
  }

  const client = new MongoClient(uri);

  try {
    await client.connect();

    const db = client.db('GYAccounts');
    const dbBooks = client.db('GYBooks');
    const userDoc = await db.collection('Metadata').findOne({ userId });

    if (!userDoc) {
      await sendLog(LogLevel.ERROR, LogMessage.USER_NOT_FOUND, {
        additionalData: { userId },
      });
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const profileId = userDoc.profile?.id;
    const userBooksDoc = await dbBooks
      .collection('Metadata')
      .findOne({ profileId });

    await sendLog(LogLevel.INFO, LogMessage.USER_RETRIEVED, {
      profileId,
    });

    return NextResponse.json({
      ...userDoc.profile,
      biography: userBooksDoc?.biography || '',
    } as User);
  } catch (error) {
    await sendLog(LogLevel.ERROR, LogMessage.USER_RETRIEVE_FAILED, {
      additionalData: {
        error: error instanceof Error ? error.message : String(error),
      },
    });
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}
