import 'dotenv/config';
export default {
    port: parseInt(process.env.PORT || '5000', 10),
    mongoUri: process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/sarthi-ias',
    jwt: {
        accessSecret: process.env.JWT_ACCESS_SECRET || 'dev-access-secret',
        refreshSecret: process.env.JWT_REFRESH_SECRET || 'dev-refresh-secret',
        accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
        refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
    },
    clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
    geminiApiKey: process.env.GEMINI_API_KEY || '',
    aiMock: process.env.AI_MOCK === 'true' || !process.env.GEMINI_API_KEY,
};
