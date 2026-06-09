import mongoose from 'mongoose';
import { getMongoUri } from '@/lib/env';

type MongooseCache = {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
};

declare global {
    // eslint-disable-next-line no-var
    var mongoose: MongooseCache | undefined;
}

let cached: MongooseCache = global.mongoose || { conn: null, promise: null };

if (!global.mongoose) {
    global.mongoose = cached;
}

async function connectDB(): Promise<typeof mongoose> {
    const MONGODB_URI = getMongoUri();

    if (!MONGODB_URI) {
        throw new Error(
            'MONGODB_URI is not set. Add it in Vercel → Settings → Environment Variables (Production), then Redeploy.'
        );
    }

    if (mongoose.connection.readyState === 1) {
        return mongoose;
    }

    if (mongoose.connection.readyState !== 0) {
        await mongoose.disconnect().catch(() => undefined);
        cached.conn = null;
        cached.promise = null;
    }

    if (!cached.promise) {
        cached.promise = mongoose.connect(MONGODB_URI, {
            bufferCommands: false,
            serverSelectionTimeoutMS: 15000,
            maxPoolSize: 10,
        });
    }

    try {
        cached.conn = await cached.promise;
    } catch (error) {
        cached.promise = null;
        cached.conn = null;
        throw error;
    }

    return cached.conn;
}

export default connectDB;
