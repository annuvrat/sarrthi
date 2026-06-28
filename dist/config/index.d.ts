import 'dotenv/config';
declare const _default: {
    port: number;
    mongoUri: string;
    jwt: {
        accessSecret: string;
        refreshSecret: string;
        accessExpiresIn: string;
        refreshExpiresIn: string;
    };
    clientUrl: string;
    geminiApiKey: string;
    aiMock: boolean;
};
export default _default;
