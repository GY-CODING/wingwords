/**
 * MongoDB singleton para reutilizar la conexión entre requests.
 *
 * En desarrollo se guarda en el global para sobrevivir al HMR.
 * En producción (Vercel serverless) el módulo se reutiliza dentro
 * del mismo proceso/worker, eliminando el coste de connect() en cada request.
 */
import { MongoClient } from 'mongodb';

const uri = process.env.MONGO_URI;

if (!uri) {
  throw new Error('Missing environment variable: MONGO_URI');
}

let clientPromise: Promise<MongoClient>;

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

if (process.env.NODE_ENV === 'development') {
  if (!global._mongoClientPromise) {
    const client = new MongoClient(uri);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  const client = new MongoClient(uri);
  clientPromise = client.connect();
}

export default clientPromise;
