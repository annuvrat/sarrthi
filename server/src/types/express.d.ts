import type { Request } from 'express';
import type { IUser } from '../models/User.js';

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

export type AuthRequest = Request & { user: IUser };
