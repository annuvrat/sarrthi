import type { NextFunction, Request, Response } from 'express';
import { connectDB } from '../config/db.js';

export const ensureDb = async (_req: Request, _res: Response, next: NextFunction) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    next(error);
  }
};
