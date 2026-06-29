import type { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import logger from '../config/logger.js';
import config from '../config/index.js';
import { User } from '../models/User.js';
import { AppError, sendSuccess } from '../utils/response.js';
import { generateTokens } from '../utils/tokens.js';

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    throw new AppError('Invalid email or password', 401);
  }

  const { accessToken, refreshToken } = generateTokens(user._id.toString(), user.role);
  user.refreshToken = refreshToken;
  user.lastLoginAt = new Date();
  await user.save();

  logger.info({ event: 'login', userId: user._id, role: user.role });

  sendSuccess(res, 'Login successful', {
    accessToken,
    refreshToken,
    user: { _id: user._id, name: user.name, email: user.email, role: user.role },
  });
};

export const refresh = async (req: Request, res: Response) => {
  const { refreshToken } = req.body;
  if (!refreshToken) throw new AppError('Refresh token required', 401);

  const decoded = jwt.verify(refreshToken, config.jwt.refreshSecret) as { userId: string; role: string };
  const user = await User.findById(decoded.userId);
  if (!user || user.refreshToken !== refreshToken) throw new AppError('Invalid refresh token', 401);

  const tokens = generateTokens(user._id.toString(), user.role);
  user.refreshToken = tokens.refreshToken;
  await user.save();

  sendSuccess(res, 'Token refreshed', tokens);
};

export const logout = async (req: Request, res: Response) => {
  if (req.user) {
    await User.findByIdAndUpdate(req.user._id, { refreshToken: null });
  }
  sendSuccess(res, 'Logged out successfully');
};
