import jwt from 'jsonwebtoken';
import config from '../config/index.js';
export const generateTokens = (userId, role) => {
    const accessOptions = { expiresIn: config.jwt.accessExpiresIn };
    const refreshOptions = { expiresIn: config.jwt.refreshExpiresIn };
    const accessToken = jwt.sign({ userId, role }, config.jwt.accessSecret, accessOptions);
    const refreshToken = jwt.sign({ userId, role }, config.jwt.refreshSecret, refreshOptions);
    return { accessToken, refreshToken };
};
