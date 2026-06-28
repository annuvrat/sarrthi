import jwt, { type SignOptions } from 'jsonwebtoken';
import config from '../config/index.js';
import type { Role } from '../config/constants.js';

export const generateTokens = (userId: string, role: Role) => {
  const accessOptions: SignOptions = { expiresIn: config.jwt.accessExpiresIn as SignOptions['expiresIn'] };
  const refreshOptions: SignOptions = { expiresIn: config.jwt.refreshExpiresIn as SignOptions['expiresIn'] };

  const accessToken = jwt.sign({ userId, role }, config.jwt.accessSecret, accessOptions);
  const refreshToken = jwt.sign({ userId, role }, config.jwt.refreshSecret, refreshOptions);
  return { accessToken, refreshToken };
};
