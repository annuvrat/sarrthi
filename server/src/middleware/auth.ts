import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import config from '../config/index.js';
import { User } from '../models/User.js';
import { AppError } from '../utils/response.js';
import type { Role } from '../config/constants.js';

export const authenticate = async (req: Request, _res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      throw new AppError('Unauthorized', 401);
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, config.jwt.accessSecret) as { userId: string };
    const user = await User.findById(decoded.userId).select('-passwordHash -refreshToken');

    if (!user || !user.isActive) {
      throw new AppError('Unauthorized', 401);
    }

    req.user = user;
    next();
  } catch (err) {
    if (err instanceof jwt.JsonWebTokenError || err instanceof jwt.TokenExpiredError) {
      return next(new AppError('Unauthorized', 401));
    }
    next(err);
  }
};

export const authorize =
  (...roles: Role[]) => 
  (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(new AppError('Forbidden', 403));
    }
    next();
  };
