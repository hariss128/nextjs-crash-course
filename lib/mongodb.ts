import mongoose from 'mongoose';

// Define the connection cache type
type MongooseCache = {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
};

// Extend the global object to include our mongoose cache
declare global {
    // eslint-disable-next-line no-var
    var mongoose: MongooseCache | undefined;
}

const MONGODB_URI = process.env.MONGODB_URI;


// Initialize the cache on the global object to persist across hot reloads in development
let cached: MongooseCache = global.mongoose || { conn: null, promise: null };

if (!global.mongoose) {
    global.mongoose = cached;
}

/**
 * Establishes a connection to MongoDB using Mongoose.
 * Caches the connection to prevent multiple connections during development hot reloads.
 * @returns Promise resolving to the Mongoose instance
 */
async function connectDB(): Promise<typeof mongoose> {
    // Reuse open connection (important for Vercel serverless warm starts)
    if (mongoose.connection.readyState === 1) {
        return mongoose;
    }

    if (!cached.promise) {
        if (!MONGODB_URI) {
            throw new Error(
                'Please define the MONGODB_URI environment variable in .env.local or Vercel project settings'
            );
        }

        const options = {
            bufferCommands: false,
        };

        cached.promise = mongoose.connect(MONGODB_URI, options).then((connection) => {
            return connection;
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