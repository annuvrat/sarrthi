import type { Role } from '../config/constants.js';
export declare const generateTokens: (userId: string, role: Role) => {
    accessToken: string;
    refreshToken: string;
};
