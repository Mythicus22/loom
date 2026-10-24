import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoServer = null;

export async function connectDB() {
  const uri = process.env.MONGODB_URI;

  if (uri) {
    try {
      console.log(`[Database] Connecting to external MongoDB at ${uri.replace(/:([^:@]{3,})@/, ':***@')}...`);
      await mongoose.connect(uri);
      console.log('[Database] Connected to external MongoDB successfully.');
      return;
    } catch (err) {
      console.warn('[Database] Failed to connect to external MongoDB, falling back to embedded MongoMemoryServer:', err.message);
    }
  }

  // Fallback to embedded MongoMemoryServer
  try {
    console.log('[Database] Initializing embedded MongoDB server (MongoMemoryServer)...');
    mongoServer = await MongoMemoryServer.create();
    const memoryUri = mongoServer.getUri();
    await mongoose.connect(memoryUri);
    console.log(`[Database] Connected to embedded MongoDB at ${memoryUri}`);
  } catch (err) {
    console.error('[Database] Failed to initialize MongoDB:', err);
    throw err;
  }
}

export async function disconnectDB() {
  await mongoose.disconnect();
  if (mongoServer) {
    await mongoServer.stop();
  }
}
