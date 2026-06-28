import type { NextFunction, Request, Response } from 'express';
import type { Role } from '../config/constants.js';
export declare const authenticate: (req: Request, _res: Response, next: NextFunction) => Promise<void>;
export declare const authorize: (...roles: Role[]) => (req: Request, _res: Response, next: NextFunction) => void;
