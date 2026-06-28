import mongoose from 'mongoose';
import config from './index.js';
const cached = global.mongooseCache ?? { conn: null, promise: null };
if (!global.mongooseCache) {
    global.mongooseCache = cached;
}
export const connectDB = async () => {
    if (cached.conn) {
        return cached.conn;
    }
    if (!cached.promise) {
        cached.promise = mongoose
            .connect(config.mongoUri, {
            bufferCommands: false,
            serverSelectionTimeoutMS: 10000,
        })
            .then((connection) => {
            console.log('MongoDB connected');
            return connection;
        });
    }
    try {
        cached.conn = await cached.promise;
    }
    catch (error) {
        cached.promise = null;
        throw error;
    }
    return cached.conn;
};
